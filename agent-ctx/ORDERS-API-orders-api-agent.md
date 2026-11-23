# ORDERS-API — Orders / Invoices / Transactions API Routes

**Task ID:** ORDERS-API
**Agent:** orders-api-agent
**Date:** 2026-11-23
**Status:** Completed

## Summary

Built the full buyer-side + admin-side order / invoice / transaction API surface for the STIOOS marketplace. All 11 routes follow the conventions established by the existing `requests` + `quotes` routes (same `@/lib/db` + `@/lib/auth` imports, same `force-dynamic` export, same `NextRequest` typing, same sentinel-class pattern for transaction-internal error mapping, same `success` / `error` envelope, same pagination shape `{ rows, total, page, limit, totalPages }`).

## Files Created (11 routes)

### Buyer routes

1. **`src/app/api/orders/route.ts`** — `GET` lists the buyer's own orders, ordered by `placedAt desc`. Query: `?status=&page=&limit=`. Status whitelist enforced. Eagerly includes linked invoice + request (1:1 relations on MarketOrder). Scoped to `buyerId = user.userId`.

2. **`src/app/api/orders/[id]/route.ts`** — `GET` single order with full detail (invoice + request + buyer fields). Ownership check: `order.buyerId === user.userId`, admin bypasses. Returns 404 if missing, 403 if not owned.

3. **`src/app/api/orders/[id]/accept/route.ts`** — `POST` buyer accepts delivery. Single transaction:
   - Sets `order.status = "completed"`, `order.updatedAt = now`.
   - If linked, sets `MarketRequest.status = "closed"`.
   - 409 if status !== "delivered"; 403 if not buyer-owned; 404 if missing.

### Admin routes

4. **`src/app/api/admin/orders/route.ts`** — `GET` lists ALL orders across every buyer. Same pagination + filter shape as the buyer route, minus the `buyerId` scoping.

5. **`src/app/api/admin/orders/[id]/deliver/route.ts`** — `POST` admin marks in_progress order as delivered. Single transaction:
   - Sets `order.status = "delivered"`, `order.updatedAt = now`.
   - If linked, sets `MarketRequest.status = "delivered"`.
   - 409 if status !== "in_progress"; 404 if missing.

6. **`src/app/api/admin/orders/create-from-quote/route.ts`** — `POST` creates an order + invoice from an accepted quote. Body `{ quoteId, deliveryType?, dueDays? }`. Single `db.$transaction`:
   - Verifies quote is `"accepted"` (else 409).
   - Creates `MarketOrder` (status=`"pending"`, service fields denormalized from the parent request).
   - Creates `Invoice` (status=`"issued"`, items + totals mirrored from the quote, reference `INV-XXXXX` via the inline `generateRef("INV")` helper).
   - Flips parent `MarketRequest.status = "ordered"` + appends a `statusHistory` event.
   - 201 returns `{ order, invoice }`. P2002 → 409 (already converted).

### Invoice routes (buyer)

7. **`src/app/api/invoices/route.ts`** — `GET` lists the buyer's own invoices, ordered by `issuedAt desc`. Query: `?status=&page=&limit=`. Status whitelist (draft | issued | paid | void | refunded). Eagerly includes linked order + request.

8. **`src/app/api/invoices/[id]/route.ts`** — `GET` single invoice with full detail (order + request + quote + transactions). Ownership check, same 404/403 semantics.

9. **`src/app/api/invoices/[id]/pay/route.ts`** — `POST` pays an issued invoice. Body `{ method, gatewayReference? }`. Single `db.$transaction`:
   - Creates `Transaction` (type=`"payment"`, status=`"success"`, reference `TXN-XXXXX`).
   - Sets `invoice.status = "paid"`, `paidAt = now`, `paymentMethod`, `paymentReference`.
   - Sets linked `order.status = "in_progress"`, `order.updatedAt = now`.
   - If linked, sets `MarketRequest.status = "paid"`.
   - 409 if invoice.status !== "issued"; 403 if not buyer-owned; 404 if missing.

### Transaction routes

10. **`src/app/api/transactions/route.ts`** — `GET` lists the buyer's own transactions, ordered by `createdAt desc`. Query: `?type=&status=&page=&limit=`. Type whitelist (payment | refund | credit | debit | adjustment); status whitelist (pending | success | failed | refunded). Eagerly includes linked invoice.

11. **`src/app/api/admin/transactions/route.ts`** — `GET` lists ALL transactions across every buyer. Same shape minus `buyerId` scoping; eagerly includes linked invoice + (via invoice) the originating order.

## Conventions Followed

- **`export const dynamic = "force-dynamic"`** on every route.
- **Imports:** `NextRequest` from `next/server`; `Prisma` from `@prisma/client` where needed; `db` from `@/lib/db`; `success`, `error`, `requireAuth`, `requireAdmin`, `JWTPayload` from `@/lib/auth`.
- **Next.js 16 async params:** all `[id]` routes use `{ params }: { params: Promise<{ id: string }> }` + `await params`.
- **Error handling:** every handler wrapped in try/catch; transaction-internal failures use sentinel classes (`NotFoundError`, `ForbiddenError`, `StateConflictError`) mapped in the outer catch to 404 / 403 / 409 respectively; Prisma `P2025` (record not found) → 404; Prisma `P2002` (unique constraint) → 409.
- **Reference generator:** the `generateRef(prefix)` helper from the spec is defined inline in the two routes that need it (`create-from-quote`, `pay`), using the unambiguous alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789`.
- **Admin name denormalization:** in `create-from-quote`, the admin's display name is looked up from `AdminUser` and stamped onto `invoice.issuedByName`, falling back to `admin.email` if the lookup fails (mirrors the `quotes` route pattern).
- **Pagination:** consistent `{ rows, total, page, limit, totalPages }` envelope across all listing routes; `DEFAULT_LIMIT = 20`, `MAX_LIMIT = 100`; `page` clamped to `>= 1`.
- **BuyerId scoping:** every buyer route's `where` clause starts with `buyerId: user.userId` — even if a query-string filter is malformed, a buyer can never see another buyer's data.
- **Status whitelists:** query-string `status` / `type` filters validated against a `Set` whitelist; typos are silently treated as "no filter" rather than 500'ing.

## Lint

`bun run lint` passed with zero errors on all 11 new files.

## Dev Server

Next.js dev server is running in background (the auto-started instance is on PID 3321 / 4313 per the log). No new dev server was started manually per project rules.

## Notes for Downstream Agents

- The `MarketOrder` model has **no `reference` column** — the public-facing identifier for an order is the linked `Invoice.reference` (`INV-XXXXX`). Buyers should be directed to the invoice reference for any external tracking.
- The `MarketOrder.updatedAt` field uses `@default(now())`, NOT `@updatedAt`, so Prisma does not auto-touch it on update. All mutations that change order state (`accept`, `deliver`, `pay`) explicitly stamp `updatedAt: now`.
- The `Invoice.orderId`, `Invoice.requestId`, `Invoice.quoteId` are all `@unique` — a quote can only be converted to an order+invoice once. A second `create-from-quote` call for the same quote id will fail with P2002 → 409.
- The `pay` route intentionally does NOT guard the linked order's current status — if the order is somehow not `"pending"` (e.g. an admin already advanced it), we still flip it to `"in_progress"` rather than leaving the invoice paid but the order stuck. This is a deliberate trade-off.
- The `create-from-quote` route denormalizes `serviceId` / `serviceSlug` / `serviceName` from the parent MarketRequest (not from a `Service` row), because the Quote flow can originate from a custom engagement that doesn't correspond to a catalog Service. `serviceId = request.id`, `serviceSlug = "request-" + request.id`, `serviceName = request.title`. If a downstream agent adds a direct catalog-purchase flow, it should populate these from the actual `Service` row instead.
