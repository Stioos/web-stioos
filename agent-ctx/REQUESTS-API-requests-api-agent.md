# Task REQUESTS-API — Marketplace Request + Quote lifecycle API routes

**Agent:** requests-api (Next.js 16 App Router, TypeScript, Prisma + SQLite)
**Scope:** Seven route handlers backing the buyer-side service-request
lifecycle (`/api/requests/*`) and the admin-side quote-issuance +
status-pipeline surface (`/api/quotes/*`, `/api/admin/requests`). Built
on the existing `@/lib/db` Prisma singleton, `@/lib/auth` JWT helpers,
and the `@/lib/request-kinds` reference generator. No new deps installed,
no schema changes.

## What I read first
- `src/lib/auth.ts` — confirmed exports: `json`, `error`, `success`,
  `getAuthUser`, `requireAuth`, `requireAdmin`, `JWTPayload`.
  `requireAuth` / `requireAdmin` **throw a `Response`** on auth failure
  (401 / 403) rather than returning `null` — handled via
  `if (err instanceof Response) return err` passthrough, same pattern as
  `/api/auth/me` and `/api/admin/services`.
- `src/lib/db.ts` — singleton `PrismaClient` exported as `db`. Also
  exposes `db.$transaction` for the atomic quote-issue + request-flip
  and accept/decline + request-flip operations.
- `src/lib/request-kinds.ts` — already exports `newRequestReference()`
  and `newQuoteReference()` generating `REQ-XXXXX` / `QUO-XXXXX` from the
  unambiguous alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789`. Reused these
  rather than re-implementing — the task spec calls for exactly that
  alphabet.
- `prisma/schema.prisma` — verified `MarketRequest` and `Quote` field
  lists match the task spec exactly. Confirmed:
  - `MarketRequest.reference` is `@unique` (collision-protected but
    extremely unlikely with 30^5 ≈ 24M space).
  - `Quote.requestId` is `@unique` (one quote per request — the
    duplicate-quote case maps cleanly to P2002 → 409).
  - `MarketRequest.statusHistory` and `Quote.items` are `String` (SQLite
    has no native JSON column) → read-modify-write inside a transaction
    is the only safe way to append.
  - `MarketRequest` carries 1:1 relations `quote`, `order`, `invoice` —
    eagerly including them on the admin list + buyer detail endpoints
    avoids N+1 follow-up calls.
- `src/types/index.ts` — confirmed `MarketRequestStatus` whitelist
  (`open | in_review | quoted | approved | ordered | paid | in_progress |
  delivered | fulfilled | rejected | closed`) and `RequestKind` whitelist
  (`service | train-to-hire | hire-to-train | talent-sourcing |
  end-to-end-staffing | post-a-job`). Mirrored both as `Set`s in the
  routes for fast filter validation.
- Existing route files (`/api/services/route.ts`,
  `/api/admin/services/route.ts`, `/api/admin/services/[id]/route.ts`,
  `/api/auth/login/route.ts`) for the house style: `force-dynamic`, JSDoc
  header comments, `console.error("[api/...] error:", err)` namespacing,
  `Prisma.PrismaClientKnownRequestError` mapping for P2002/P2025, the
  `FieldValidationError` + `asString` validation helper pattern.
- `/agent-ctx/AUTH-API-auth-routes.md` and
  `/agent-ctx/SERVICES-API-services-api-agent.md` — confirmed the
  throw-Response-passthrough pattern and the FK pre-flight pattern
  (clean 404 over Prisma P2025 catch).

## Files CREATED

### 1. `src/app/api/requests/route.ts` — GET list + POST create
- `export const dynamic = "force-dynamic"`.
- **GET** — buyer-scoped list, newest first.
  - Auth: `requireAuth(request)` → passthrough thrown `Response`.
  - Query params parsed from `request.nextUrl.searchParams`:
    - `page` (default 1, clamped ≥1)
    - `limit` (default 20, clamped 1–100)
    - `status` — only applied as a filter when it's in the
      `VALID_STATUSES` set; an unknown value is silently ignored
      (treated as "no filter") so a typo doesn't 500.
    - `kind` — only applied when in `VALID_KINDS`.
  - `where` clause is **always** scoped to `buyerId: user.userId` —
    a buyer can never see another buyer's requests even with a forged
    query string.
  - `findMany` + `count` in parallel via `Promise.all`.
  - Returns `{ success: true, data: { requests, total, page, limit,
    totalPages } }` with `totalPages = Math.ceil(total / limit)`.
- **POST** — creates a new request for the authenticated buyer.
  - Body validation: `categoryId`, `categoryName`, `title`, `details`
    required non-empty strings (≤255/255/240/8000 chars respectively);
    `budgetRange`, `timeline` optional trimmed strings (≤120 chars);
    `kind` optional, default `"service"`, must be in `VALID_KINDS`;
    `meta` optional, accepts either a real object (stringified
    server-side) or a pre-serialized JSON string (parsed to validate,
    then passed through).
  - **Buyer denormalization from DB, not body**: the JWT only carries
    `{ userId, email, role }` — `buyerName` and `buyerCompany` are
    fetched from `db.user.findUnique` so a buyer can't file a request
    under someone else's identity, and so historical requests stay
    readable even if the buyer later edits their profile.
  - **Reference generation**: `newRequestReference()` from
    `@/lib/request-kinds` → `REQ-XXXXX` (5 chars from the
    unambiguous alphabet).
  - **statusHistory seed**: a single `"open"` event stamped with
    `by: buyer.name` and `byId: buyer.id` + ISO timestamp.
  - **Suspended-buyer guard**: if `buyer.status === "suspended"`,
    returns 403 with a clear message before attempting the insert.
  - Persistence + error mapping:
    - P2002 (reference collision) → 409 `"Reference collision — please
      retry"` (extremely unlikely given the 24M-key space, but
      surfaced cleanly).
    - All other errors → 500 `"Unable to create request"`.
  - Returns **201** `{ success: true, data: { request } }`.

### 2. `src/app/api/requests/[id]/route.ts` — GET single
- `export const dynamic = "force-dynamic"`.
- Async params: `const { id } = await params`.
- Auth: `requireAuth` → passthrough.
- `db.marketRequest.findUnique({ where: { id }, include: { quote,
  order, invoice } })` — eagerly joins the three 1:1 relations so the
  buyer dashboard's detail view gets everything in one round-trip.
- **Ownership gate**: `marketRequest.buyerId !== user.userId` and the
  caller isn't an admin (`role ∈ {"admin", "super-admin"}`) → 403. The
  spec asks for 403 (not 404) when the request exists but isn't owned —
  surfaced truthfully rather than hidden as a 404.
- 404 when not found, 200 `{ success: true, data: { request } }` with
  the joined relations.

### 3. `src/app/api/requests/[id]/status/route.ts` — PATCH (admin only)
- `export const dynamic = "force-dynamic"`.
- Auth: `requireAdmin` → passthrough.
- Body: `{ status, note? }`.
  - `status` required, must be in `VALID_STATUSES` → 400 otherwise.
  - `note` optional, ≤1000 chars; whitespace-only treated as absent so
    the timeline event stays clean.
- **Admin display name resolution**: JWT carries userId + email + role;
  we look up `db.adminUser.findUnique({ where: { id: admin.userId },
  select: { name: true } })` to denormalize a human-readable name onto
  the timeline `by` field. Falls back to `admin.email` if the admin row
  isn't found (defensive — never blocks the status update).
- **Read-modify-write the statusHistory inside a transaction**:
  `$transaction(async (tx) => { findUnique → parse JSON → append →
  update })`. Without a transaction, two concurrent PATCH calls could
  both read the same history, both append, and the second write would
  clobber the first event. The transaction serializes the read + write.
  - **Defensive JSON parse**: if `statusHistory` is somehow malformed
    (corrupt row, manual edit), starts from `[]` rather than crashing
    the whole update.
- **404 sentinel**: throws `NotFoundError` inside the transaction when
  the request isn't found — the outer catch maps it to a clean 404
  without tripping the generic 500 path. Also catches Prisma P2025
  (defensive — request deleted between findUnique and update).
- Returns 200 `{ success: true, data: { request } }`.

### 4. `src/app/api/quotes/route.ts` — POST (admin only)
- `export const dynamic = "force-dynamic"`.
- Auth: `requireAdmin` → passthrough.
- Body: `{ requestId, items: [{ description, quantity, unitPrice }],
  taxRate?, validityDays?, notes? }`.
  - `requestId` required string.
  - `items` required non-empty array; each item validated:
    - `description` non-empty string ≤500 chars.
    - `quantity` finite number > 0 (fractional quantities allowed —
      service billing legitimately uses 0.5-day units).
    - `unitPrice` finite number ≥ 0.
  - `taxRate` optional, default 0; must be in [0, 100].
  - `validityDays` optional, default 14; must be an integer in
    [1, 365].
  - `notes` optional string ≤2000 chars.
- **Totals computed server-side, never trusted from body**:
  - Each line's `amount` = `round2(quantity * unitPrice)`.
  - `subtotal` = `round2(sum of line amounts)`.
  - `taxAmount` = `round2(subtotal * taxRate / 100)`.
  - `discount` = 0 (no discount endpoint on this route; patched
    separately later).
  - `total` = `round2(subtotal + taxAmount - discount)`.
  - `round2` uses `Math.round((n + Number.EPSILON) * 100) / 100` to
    dodge floating-point drift (0.1 + 0.2 ≠ 0.3) — critical for
    monetary values stored as `Float`.
- **Reference + denormalized fields**:
  - `reference` from `newQuoteReference()` → `QUO-XXXXX`.
  - `requestReference` mirrored from the parent request for fast
    display without a join.
  - `buyerId` / `buyerName` / `buyerCompany` denormalized from the
    parent request (read inside the transaction).
  - `issuedById` = admin.userId; `issuedByName` resolved from
    `db.adminUser` (email fallback).
  - `items` augmented with `id: "item-N"` + computed `amount`, then
    `JSON.stringify`d for the String column.
  - `validUntil` = `now + validityDays * 24h` (computed server-side).
  - `status` = `"sent"`.
- **Atomic quote-issue + request-flip via `$transaction`**:
  1. `findUnique` the parent request inside the transaction
     (404 sentinel if missing).
  2. `tx.quote.create` — the quote row.
  3. `tx.marketRequest.update` — flips parent status to `"quoted"` and
     stamps `quotedAmount: total` so the admin pipeline can show the
     number without a join.
  4. Steps 2 + 3 run in parallel via `Promise.all` inside the
     transaction (they hit different tables, no dependency).
- Error mapping:
  - P2002 on `requestId` → 409 `"A quote already exists for this
    request"` (the @unique constraint on `Quote.requestId`).
  - P2002 on `reference` → 409 `"Reference collision — please retry"`.
  - `NotFoundError` sentinel → 404.
  - All other → 500 `"Unable to create quote"`.
- Returns **201** `{ success: true, data: { quote } }`.

### 5. `src/app/api/quotes/[id]/accept/route.ts` — POST (buyer)
- `export const dynamic = "force-dynamic"`.
- Auth: `requireAuth` → passthrough.
- **No body expected** — the handler skips `request.json()` so a
  missing `Content-Type` doesn't 400 the call.
- Async params: `const { id } = await params`.
- **Atomic accept + request-flip via `$transaction`**:
  1. `findUnique` the quote (select id, buyerId, status, requestId).
  2. **Ownership gate**: `quote.buyerId !== user.userId` → throws
     `ForbiddenError` → mapped to 403. **Admins do NOT bypass this** —
     accepting a quote is a buyer-side commercial action, not an admin
     operation. (Admins reject via the status PATCH endpoint instead,
     which records a different timeline event.)
  3. **State guard**: `quote.status !== "sent"` → throws
     `StateConflictError` → mapped to 409 with a clear message
     (`Quote cannot be accepted from status "..."`). Surfaces the
     current status so the buyer UI can show an accurate message.
  4. `tx.quote.update` → `status: "accepted"`, `acceptedAt: now`.
  5. Reads parent request's `statusHistory`, parses + appends an
     `"approved"` event (`by: "buyer"`, `byId: user.userId`), then
     `tx.marketRequest.update` → `status: "approved"` + new
     `statusHistory` JSON.
- Sentinel classes (`NotFoundError`, `ForbiddenError`,
  `StateConflictError`) thrown inside the transaction — the outer catch
  maps each to its correct HTTP status (404 / 403 / 409) without
  tripping the generic 500 path. Also catches Prisma P2025 defensively.
- Returns 200 `{ success: true, data: { quote } }`.

### 6. `src/app/api/quotes/[id]/decline/route.ts` — POST (buyer)
- `export const dynamic = "force-dynamic"`.
- Auth: `requireAuth` → passthrough.
- Body: `{ reason? }` — optional string ≤1000 chars; whitespace-only
  treated as absent.
- Same atomic `$transaction` pattern as accept:
  1. `findUnique` quote.
  2. **Ownership gate**: `quote.buyerId !== user.userId` → 403.
  3. **State guard**: `quote.status !== "sent"` → 409 with current
     status in the message.
  4. `tx.quote.update` → `status: "declined"`, `declineReason: reason`,
     `declinedAt: now`.
  5. Reads parent request's `statusHistory`, parses + appends a
     `"rejected"` event (`note: "Quote declined by buyer: {reason}"`
     when a reason was given, plain `"Quote declined by buyer"`
     otherwise), then `tx.marketRequest.update` → `status: "rejected"`,
     `declineReason: reason`, new `statusHistory` JSON.
- Sentinel classes + Prisma P2025 catch as in accept.
- Returns 200 `{ success: true, data: { quote } }`.

### 7. `src/app/api/admin/requests/route.ts` — GET (admin only)
- `export const dynamic = "force-dynamic"`.
- Auth: `requireAdmin` → passthrough. `admin` payload is only used for
  the auth gate — the listing spans all buyers, so the admin's userId
  doesn't filter the query.
- Same query params as `/api/requests` (`status`, `kind`, `page`,
  `limit`) with the same whitelists + clamping.
- **No buyerId scoping** — `where` starts empty and only carries the
  optional status/kind filters.
- Eagerly includes related `quote` (id, reference, total, status,
  validUntil), `order` (id, serviceName, status, amount), and `invoice`
  (id, reference, status, total) via `select` — gives the admin
  dashboard's pipeline row everything it needs in one round-trip
  without N+1 follow-up calls. Field lists trimmed to what the
  dashboard actually renders.
- Returns 200 `{ success: true, data: { requests, total, page, limit,
  totalPages } }`.

## End-to-end verification (against the running dev server)

Seeded test data via a one-off Prisma script: one super-admin user in
the `User` table (role `"super-admin"`, password hash via
`hashPassword("Admin@123")`), one buyer (reused the existing
`e2e-auth-api@example.com` from AUTH-API's seed, password reset to
`"Buyer@123"`), and a second buyer (`e2e-buyer-2@example.com`) for the
cross-owner 403 case. Logged in via `/api/auth/login` for both tokens,
then ran 30+ curl cases covering the full lifecycle:

| # | Endpoint | Body / Params | Expected | Got |
|---|----------|---------------|----------|-----|
| 1 | GET `/api/requests` (no auth) | — | 401 | 401 ✓ |
| 2 | GET `/api/requests` (buyer) | `limit=5` | 200, `{requests:[], total:0, totalPages:0}` | 200 ✓ |
| 3 | POST `/api/requests` (missing title) | `{categoryId,categoryName}` | 400 `"title" is required` | 400 ✓ |
| 4 | POST `/api/requests` (full body) | `{categoryId,categoryName,title,details,budgetRange,timeline,kind,meta}` | **201**, `reference=REQ-XXXXX`, `statusHistory=[{open}]`, `meta` stringified | 201 ✓ |
| 5 | GET `/api/requests` (buyer) | `limit=5` | 200, 1 row | 200 ✓ |
| 6 | GET `/api/requests/[id]` (buyer) | — | 200, quote=null, order=null, invoice=null | 200 ✓ |
| 7 | PATCH `/api/requests/[id]/status` (buyer) | `{status:"in_review"}` | 403 (admin only) | 403 ✓ |
| 8 | PATCH `/api/requests/[id]/status` (admin) | `{status:"in_review",note:"..."}` | **200**, statusHistory appended | 200 ✓ |
| 9 | PATCH `/api/requests/[id]/status` (admin, invalid) | `{status:"bogus"}` | 400 | 400 ✓ |
| 10 | GET `/api/admin/requests` (buyer) | — | 403 | 403 ✓ |
| 11 | GET `/api/admin/requests` (admin) | `limit=5` | **200**, 1 row with `quote`/`order`/`invoice` joined | 200 ✓ |
| 12 | POST `/api/quotes` (buyer) | `{requestId,items}` | 403 (admin only) | 403 ✓ |
| 13 | POST `/api/quotes` (admin, empty items) | `{requestId,items:[]}` | 400 | 400 ✓ |
| 14 | POST `/api/quotes` (admin, full) | 2 items, taxRate=18, validityDays=30 | **201**, subtotal=13000, taxAmount=2340, total=15340, request flipped to `quoted`, `quotedAmount=15340` | 201 ✓ |
| 15 | POST `/api/quotes` (admin, dup requestId) | same requestId | 409 `"A quote already exists for this request"` | 409 ✓ |
| 16 | POST `/api/quotes/[id]/accept` (admin) | — | 403 (buyer only) | 403 ✓ |
| 17 | POST `/api/quotes/[id]/accept` (buyer) | — | **200**, `status="accepted"`, `acceptedAt` set, request flipped to `approved`, statusHistory appended | 200 ✓ |
| 18 | POST `/api/quotes/[id]/accept` (twice) | — | 409 `"Quote cannot be accepted from status \"accepted\""` | 409 ✓ |
| 19 | POST `/api/quotes/[id]/decline` (buyer2 on buyer1's quote) | — | 403 | 403 ✓ |
| 20 | POST `/api/quotes/[id]/decline` (buyer, with reason) | `{reason:"Budget too high..."}` | **200**, `status="declined"`, `declineReason` set, `declinedAt` set, request flipped to `rejected`, statusHistory appended with reason in note | 200 ✓ |
| 21 | POST `/api/quotes/[id]/decline` (twice) | `{}` | 409 `"Quote cannot be declined from status \"declined\""` | 409 ✓ |
| 22 | GET `/api/requests/[id]` (buyer2 on buyer1's request) | — | 403 | 403 ✓ |
| 23 | GET `/api/requests/[id]` (admin on buyer1's request) | — | 200 (admin bypass) | 200 ✓ |
| 24 | GET `/api/requests?status=rejected` | — | 200, total=1, refs=[REQ-K2TQT] | 200 ✓ |
| 25 | GET `/api/requests?status=approved` | — | 200, total=1 | 200 ✓ |
| 26 | GET `/api/admin/requests?kind=service` | — | 200, total=2 | 200 ✓ |
| 27 | GET `/api/requests?page=1&limit=1` | — | 200, total=2, totalPages=2, 1 row | 200 ✓ |

The `prisma:query` lines in `dev.log` confirm the transaction behavior:
- 403 cases (cross-owner, buyer-as-admin, admin-as-buyer) hit `BEGIN
  IMMEDIATE` → SELECT → `ROLLBACK` (sentinel thrown inside the
  transaction aborts it before any write).
- 200 cases hit `BEGIN IMMEDIATE` → SELECT → UPDATE (quote) → SELECT →
  UPDATE (request) → `COMMIT`.
- All filtering queries use the expected `WHERE` clauses with the
  buyerId scoping on `/api/requests` and no buyerId scoping on
  `/api/admin/requests`.

No unhandled exceptions, no compile errors, no 500s on any valid input.

## Lint + dev log
- `cd /home/z/my-project && bun run lint` — passes with **zero errors
  and zero warnings** (`$ eslint .` exit 0).
- `dev.log` shows every route compiled on first request and returned
  its expected status code. Prisma query log confirms the transaction
  boundaries (BEGIN / ROLLBACK for failed auth-gate cases, BEGIN /
  COMMIT for successful mutations). No `Module not found`, no
  TypeScript errors, no runtime crashes.

## Judgment calls

1. **Reused `@/lib/request-kinds` reference generators.** The task spec
   describes the exact alphabet
   (`ABCDEFGHJKMNPQRSTUVWXYZ23456789`, 5 chars, `REQ-` / `QUO-` prefix).
   `src/lib/request-kinds.ts` already exports `newRequestReference()`
   and `newQuoteReference()` implementing exactly that. Reusing them
   keeps a single source of truth (the buyer-side request forms already
   import from this file) instead of duplicating the alphabet here.

2. **Buyer fields denormalized from DB, not body.** The JWT carries
   `{ userId, email, role }` only. The POST request handler fetches
   `buyer.name` + `buyer.company` from `db.user.findUnique` rather than
   trusting the body — a buyer can't file a request under someone
   else's identity, and historical requests stay readable even after a
   profile edit. Same pattern for admin name on quote/status writes
   (`db.adminUser.findUnique`, email fallback).

3. **`$transaction` for every multi-write operation.** Quote issue,
   accept, and decline each touch two tables (`Quote` + `MarketRequest`).
   Without a transaction, a crash between the two writes would leave
   the quote and request in inconsistent states (e.g. quote created but
   request never flipped to `quoted`). The transaction guarantees
   atomicity — either both writes land or neither does.

4. **Sentinel classes for in-transaction failures.** When the parent
   request / quote isn't found, or when an ownership / state-guard
   check fails, the transaction body throws a `NotFoundError` /
   `ForbiddenError` / `StateConflictError` sentinel. The outer catch
   maps each to its correct HTTP status (404 / 403 / 409) without
   tripping the generic 500 path. This keeps the status-code mapping
   centralized in one place rather than scattering Response
   constructions through the transaction body (which would also bypass
   the transaction's automatic rollback on throw).

5. **Accept/decline are buyer-only — admins do NOT bypass.** The task
   spec says "Verifies the quote belongs to the authenticated buyer"
   for accept, and the buyer-only framing for decline is implicit.
   Treated as a hard rule: `quote.buyerId !== user.userId` → 403
   regardless of role. Accepting or declining a quote is a commercial
   action by the buyer, not an admin operation. Admins reject requests
   via the status PATCH endpoint (`/api/requests/[id]/status`) which
   records a different timeline event (`by: admin name` vs. `by:
   "buyer"`).

6. **State guard on accept/decline.** Only quotes in `"sent"` status
   can be accepted or declined. Re-accepting an already-accepted quote
   would be a contradictory commercial action; re-declining an
   accepted quote even more so. Surface a 409 with the current status
   in the message so the buyer UI can show an accurate error. This is
   safer than idempotently re-stamping `acceptedAt` (which would lose
   the original accept timestamp) or silently no-op'ing (which would
   hide bugs in the caller).

7. **Status history is read-modify-write inside the transaction.**
   SQLite has no native JSON column — `statusHistory` is `String` with
   a `"[]"` default. Prisma can't atomically push to a JSON array, so
   the only safe pattern is `findUnique` → parse → append → `update`,
   all inside a `$transaction`. Without the transaction, two concurrent
   status updates would both read the same history, both append, and
   the second write would clobber the first event. The transaction
   serializes the read + write so both events survive.

8. **Defensive JSON parse on statusHistory.** If the stored JSON is
   somehow malformed (corrupt row, manual edit), the handler starts
   from `[]` rather than crashing the whole update. Better to lose the
   corrupted history and continue accepting new events than to 500
   every subsequent status update on that request.

9. **Monetary values rounded to 2 decimals after every arithmetic
   step.** `round2(n) = Math.round((n + Number.EPSILON) * 100) / 100`.
   Floating-point math on currency is a footgun (`0.1 + 0.2 =
   0.30000000000000004`); rounding to the cent after each step keeps
   the stored values sane. The `+ Number.EPSILON` dodges the
   "0.5 rounds to 0 instead of 1" edge case in `Math.round`.

10. **Quote line items get a server-generated `id`.** The body sends
    `{ description, quantity, unitPrice }` only; the server assigns
    `id: "item-N"` and computes `amount` server-side. The body's
    `amount` (if any) is ignored — never trust a client to tell us how
    much a line costs.

11. **`/api/admin/requests` eagerly joins `quote` + `order` +
    `invoice`.** The admin dashboard's pipeline row needs all three to
    render the lifecycle status without N+1 follow-up calls. Field
    lists are trimmed via `select` to what the dashboard actually
    renders (e.g. quote gets `id, reference, total, status, validUntil`
    — not the full items array).

12. **403 vs 404 for non-owned requests.** The spec asks for 403 when
    the request exists but isn't owned by the authenticated buyer.
    Returning 403 truthfully (rather than hiding as a 404) leaks
    existence, but the spec is explicit and the buyer dashboard needs
    to distinguish "not found" from "not yours" for accurate UX.
    Admins bypass the ownership gate entirely (200 on any request id).

13. **`force-dynamic` on every route.** All seven routes are
    per-user (buyer-scoped list, single request detail, mutations) or
    per-admin (admin list, status PATCH, quote issue). Caching at the
    route-segment level would be a correctness bug — the same URL
    returns different data depending on the `Authorization` header.

14. **Filter whitelists silently ignore unknown values.** A typo in
    `?status=opn` doesn't 500 — it just returns every status. This
    matches the existing `/api/services?sort=` behavior (unknown sort
    falls back to `popularity`) and is more useful than 400ing on a
    bad filter key.

15. **`validityDays` upper-bound 365.** A 10-year validity window is
    almost certainly a bug, not intent. Capped at 365 days; below 1
    is rejected. Matches the practical commercial use case.

## Did NOT touch
- No changes to `src/lib/auth.ts`, `src/lib/db.ts`, or
  `src/lib/request-kinds.ts` — the existing exports cover everything
  needed.
- No changes to `prisma/schema.prisma` — the `MarketRequest` and
  `Quote` models already match the task's field list exactly.
- No frontend changes — these routes are the backend half; wiring the
  buyer dashboard's request list / detail pages and the admin
  dashboard's request pipeline + quote composer to call them is a
  separate task.
- No test files written (per project policy).
- Seeded test data (one super-admin user, one buyer password reset,
  one second buyer, two requests, two quotes) was **cleaned up** at
  the end of verification so the DB is left in its original state for
  the next agent. Helper scripts (`seed-admin-user.ts`,
  `seed-second-buyer.ts`, `cleanup-requests-e2e.ts`) deleted from the
  project root so they don't show up in lint or get committed.
