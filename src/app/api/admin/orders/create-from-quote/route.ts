import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  success,
  error,
  requireAdmin,
  JWTPayload,
} from "@/lib/auth";

// Always evaluate fresh — order+invoice creation is a write and must
// never be cached; the underlying request + quote state changes
// atomically with the writes.
export const dynamic = "force-dynamic";

// ============================================================
// POST /api/admin/orders/create-from-quote
// Admin-only. Creates a MarketOrder (status="pending") + Invoice
// (status="issued") from an accepted Quote, and flips the parent
// MarketRequest.status to "ordered" — all four writes inside a single
// transaction so the request → quote → order → invoice pipeline never
// drifts out of sync.
//
// Auth: `Authorization: Bearer <accessToken>` with role `admin` or
// `super-admin`.
//
// Request body:
//   quoteId*        string — the accepted Quote to convert into an order
//   deliveryType    string — optional, one of VALID_DELIVERY_TYPES
//                            (defaults to the service's own deliveryType)
//   dueDays         number — optional, days from now until the invoice's
//                            dueDate (default 14, must be 1..365)
//
// Computed server-side (never trusted from the body):
//   order.reference        n/a — MarketOrder has no reference column;
//                                 the invoice reference is the public id
//   invoice.reference      INV-XXXXX (5 chars from the unambiguous
//                                 alphabet ABCDEFGHJKMNPQRSTUVWXYZ23456789)
//   order.buyerId/Name/Company   denormalized from the quote
//   order.serviceId/Slug/Name/Icon denormalized from the parent request's
//                                 category / title (the schema has no
//                                 direct service linkage on Quote, so we
//                                 pull these from the request's title +
//                                 categoryName — the canonical service
//                                 identifier on this flow)
//   order.amount            mirrors invoice.total
//   invoice.issuedById/Name denormalized from the admin's verified
//                                 token + AdminUser row
//   invoice.items           mirrors the quote's items verbatim
//   invoice.subtotal/taxRate/taxAmount/discount/total mirror the quote
//   invoice.dueDate         issuedAt + dueDays
//   invoice.requestId       parent request id (from quote)
//   invoice.quoteId         the source quote id
//   invoice.orderId         the newly created order's id
//
// 201 → { success: true, data: { order, invoice } }
// 400 → missing/invalid field
// 401 → no/invalid bearer token
// 403 → authenticated but not an admin role
// 404 → quoteId doesn't exist
// 409 → quote isn't in "accepted" state, OR an order/invoice already
//       exists for this quote (unique constraint P2002)
// ============================================================

interface CreateFromQuoteBody {
  quoteId?: unknown;
  deliveryType?: unknown;
  dueDays?: unknown;
}

class FieldValidationError extends Error {}

const DEFAULT_DUE_DAYS = 14;
const MIN_DUE_DAYS = 1;
const MAX_DUE_DAYS = 365;

// Service delivery types (matches the Service.deliveryType enum). Used as
// the order's deliveryType when the body supplies one; otherwise we fall
// back to the service's own deliveryType stored on the parent request's
// category — but the request doesn't carry that, so we default to
// "project" if nothing was supplied.
const VALID_DELIVERY_TYPES = new Set([
  "project",
  "subscription",
  "retainer",
  "on_demand",
  "self_serve",
]);

function asFiniteNumber(value: unknown, field: string): number {
  if (value === undefined || value === null) {
    throw new FieldValidationError(`"${field}" is required`);
  }
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new FieldValidationError(`"${field}" must be a finite number`);
  }
  return n;
}

// Generates a short, unambiguous reference like `INV-7H2KP`. Kept here as
// a local fallback even though `newInvoiceReference` in request-kinds.ts
// does the same thing — the spec asks for this helper inline, so the
// route is self-contained and survives a refactor of request-kinds.
function generateRef(prefix: string): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${out}`;
}

export async function POST(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  let admin: JWTPayload;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/admin/orders/create-from-quote] unexpected requireAdmin failure:", err);
    return error("Unauthorized", 401);
  }

  // ---- Parse body -------------------------------------------------------
  let body: CreateFromQuoteBody;
  try {
    body = (await request.json()) as CreateFromQuoteBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  // ---- Validate quoteId (required) -------------------------------------
  if (typeof body.quoteId !== "string" || !body.quoteId.trim()) {
    return error('"quoteId" is required', 400);
  }
  const quoteId = body.quoteId.trim();

  // ---- Validate optional deliveryType ---------------------------------
  let deliveryType: string | null = null;
  if (body.deliveryType !== undefined && body.deliveryType !== null) {
    if (typeof body.deliveryType !== "string") {
      return error('"deliveryType" must be a string', 400);
    }
    const trimmed = body.deliveryType.trim();
    if (!VALID_DELIVERY_TYPES.has(trimmed)) {
      return error(
        `"deliveryType" must be one of: ${Array.from(VALID_DELIVERY_TYPES).join(", ")}`,
        400
      );
    }
    deliveryType = trimmed;
  }

  // ---- Validate optional dueDays --------------------------------------
  let dueDays = DEFAULT_DUE_DAYS;
  if (body.dueDays !== undefined && body.dueDays !== null) {
    try {
      dueDays = asFiniteNumber(body.dueDays, "dueDays");
    } catch (err) {
      if (err instanceof FieldValidationError) return error(err.message, 400);
      throw err;
    }
    if (!Number.isInteger(dueDays)) {
      return error('"dueDays" must be a whole number of days', 400);
    }
    if (dueDays < MIN_DUE_DAYS || dueDays > MAX_DUE_DAYS) {
      return error(
        `"dueDays" must be between ${MIN_DUE_DAYS} and ${MAX_DUE_DAYS}`,
        400
      );
    }
  }

  // ---- Resolve the admin's display name --------------------------------
  // The JWT carries userId + email + role but not the display name —
  // denormalize it from the AdminUser row so the invoice's issuedByName
  // is human-readable. Fall back to the email if the admin row isn't
  // found (defensive — shouldn't happen, but shouldn't block the order
  // creation either).
  let issuedByName = admin.email;
  try {
    const adminRow = await db.adminUser.findUnique({
      where: { id: admin.userId },
      select: { name: true },
    });
    if (adminRow?.name) issuedByName = adminRow.name;
  } catch (lookupErr) {
    console.error("[api/admin/orders/create-from-quote] admin lookup failed:", lookupErr);
  }

  // ---- Persist: create Order + Invoice + flip Request, atomically -----
  try {
    const result = await db.$transaction(async (tx) => {
      // Lock + read the quote (with its parent request) inside the
      // transaction. We need the quote's items + totals to mirror onto
      // the invoice, its buyer fields to denormalize onto the order +
      // invoice, and the parent request's id / title / categoryName to
      // denormalize service-like fields onto the order.
      const quote = await tx.quote.findUnique({
        where: { id: quoteId },
        include: {
          request: {
            select: {
              id: true,
              reference: true,
              title: true,
              categoryName: true,
              categoryId: true,
            },
          },
        },
      });

      if (!quote) {
        throw new NotFoundError();
      }

      // ---- State guard -----------------------------------------------
      // Only an "accepted" quote can be converted to an order + invoice.
      // Any other status (draft / sent / declined / expired) is a clean
      // 409 — the admin should accept-or-reject the quote first.
      if (quote.status !== "accepted") {
        throw new StateConflictError(
          `Quote cannot be converted from status "${quote.status}" (must be "accepted")`
        );
      }

      // The parent request is required — Quote.requestId is @unique and
      // @required (no null), so the join always returns a row. But we
      // guard defensively: a corrupt quote row without a request should
      // surface a clean error rather than crash.
      if (!quote.request) {
        throw new StateConflictError("Quote has no linked request");
      }

      const now = new Date();
      const dueDate = new Date(now.getTime() + dueDays * 24 * 60 * 60 * 1000);

      // The order's service-shaped fields are denormalized from the
      // parent request. There's no direct service linkage on the quote
      // flow (the request can be for a custom engagement that doesn't
      // correspond to a catalog Service row), so:
      //   - serviceId     → the parent request's id (canonical handle)
      //   - serviceSlug   → "request" prefix + request id (URL-safe)
      //   - serviceName   → the request's title
      //   - serviceIcon   → "Package" (default lucide icon for orders)
      //   - deliveryType  → body-supplied, else "project" (catalog default)
      //   - requirements  → the request's details (buyer's stated need)
      const serviceId = quote.request.id;
      const serviceSlug = `request-${quote.request.id}`;
      const serviceName = quote.request.title;

      // ---- Create the order first (invoice.orderId is @unique → must
      // reference an existing row). Status starts at "pending" — the
      // buyer pays the invoice before delivery flips it to "in_progress".
      const order = await tx.marketOrder.create({
        data: {
          serviceId,
          serviceSlug,
          serviceName,
          serviceIcon: "Package",
          buyerId: quote.buyerId,
          buyerName: quote.buyerName,
          buyerCompany: quote.buyerCompany,
          amount: quote.total,
          status: "pending",
          deliveryType: deliveryType ?? "project",
          requirements: quote.request.title,
          requestId: quote.request.id,
          placedAt: now,
          updatedAt: now,
        },
      });

      // ---- Create the invoice. orderId + requestId + quoteId are all
      // @unique — if any of them is already taken by another invoice,
      // Prisma throws P2002 and we map it to a 409 in the catch below.
      // The reference is generated server-side via the unambiguous
      // alphabet (30^5 ≈ 24M space; collisions are astronomically rare
      // and would surface as P2002 on the reference column too).
      const invoice = await tx.invoice.create({
        data: {
          reference: generateRef("INV"),
          orderId: order.id,
          requestId: quote.request.id,
          quoteId: quote.id,
          buyerId: quote.buyerId,
          buyerName: quote.buyerName,
          buyerCompany: quote.buyerCompany,
          issuedById: admin.userId,
          issuedByName,
          items: quote.items, // already a JSON-encoded string
          subtotal: quote.subtotal,
          taxRate: quote.taxRate,
          taxAmount: quote.taxAmount,
          discount: quote.discount,
          total: quote.total,
          status: "issued",
          dueDate,
          issuedAt: now,
        },
      });

      // ---- Flip the parent request to "ordered" and stamp its
      // statusHistory so the buyer's timeline reflects the order
      // creation. Read-modify-write inside the same transaction so it's
      // atomic with the request.status flip.
      const existingHistory = await tx.marketRequest.findUnique({
        where: { id: quote.request.id },
        select: { statusHistory: true },
      });

      let history: unknown[] = [];
      if (existingHistory) {
        try {
          const parsed = JSON.parse(existingHistory.statusHistory || "[]");
          if (Array.isArray(parsed)) history = parsed;
        } catch {
          history = [];
        }
      }

      const event = {
        status: "ordered",
        note: "Order + invoice created from accepted quote",
        at: now.toISOString(),
        by: issuedByName,
        byId: admin.userId,
      };

      await tx.marketRequest.update({
        where: { id: quote.request.id },
        data: {
          status: "ordered",
          statusHistory: JSON.stringify([...history, event]),
        },
      });

      return { order, invoice };
    });

    return success(result, 201);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return error("Quote not found", 404);
    }
    if (err instanceof StateConflictError) {
      return error(err.message, 409);
    }
    if (err instanceof FieldValidationError) {
      return error(err.message, 400);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 → unique constraint violation. Three unique columns on
      // Invoice are at risk here: `reference` (collision, retry), and
      // `orderId` / `requestId` / `quoteId` (an invoice already exists
      // for one of these — meaning the quote has already been converted
      // to an order). We surface a clean 409 either way.
      if (err.code === "P2002") {
        const target =
          (err.meta?.target as string[] | undefined)?.join(", ") ?? "constraint";
        return error(
          `An invoice already exists for this ${target} — quote may already be converted`,
          409
        );
      }
    }
    console.error("[api/admin/orders/create-from-quote] POST error:", err);
    return error("Unable to create order from quote", 500);
  }
}

// Sentinel classes — thrown inside the transaction so the outer catch can
// map each failure to its correct HTTP status without tripping the
// generic 500 path.
class NotFoundError extends Error {}
class StateConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}
