import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — payment mutations change server state and must
// never be cached.
export const dynamic = "force-dynamic";

// ============================================================
// POST /api/invoices/[id]/pay
// Buyer pays an issued invoice. Creates a Transaction record
// (type="payment", status="success"), flips invoice.status to "paid"
// (with paidAt + paymentMethod + paymentReference), flips the linked
// order to "in_progress", and flips the linked request to "paid" — all
// four writes inside a single transaction so the payment → order →
// request pipeline never drifts out of sync.
//
// Auth: `Authorization: Bearer <accessToken>`. The invoice must belong
// to the authenticated buyer (invoice.buyerId === user.userId). Admins
// do NOT bypass this gate — paying an invoice is a buyer-side financial
// action, not an admin operation.
//
// Request body:
//   method*            string — one of VALID_PAYMENT_METHODS
//                                (card | bank_transfer | upi | wallet | manual)
//   gatewayReference   string — optional, gateway-side txn id (e.g.
//                                Stripe charge id). Stored on the
//                                transaction + invoice.paymentReference.
//
// The transaction reference (TXN-XXXXX) is generated server-side via
// the unambiguous alphabet (30^5 ≈ 24M space; collisions are
// astronomically rare and surface as P2002, mapped to a 409 retry).
//
// 200 → { success: true, data: { invoice, transaction } }
// 400 → missing/invalid method
// 401 → no/invalid bearer token
// 403 → invoice exists but doesn't belong to the authenticated buyer
// 404 → no invoice with that id
// 409 → invoice isn't in the "issued" state (already paid / void /
//       refunded / draft) — can't pay from any other status
// ============================================================

interface PayInvoiceBody {
  method?: unknown;
  gatewayReference?: unknown;
}

class FieldValidationError extends Error {}

const VALID_PAYMENT_METHODS = new Set([
  "card",
  "bank_transfer",
  "upi",
  "wallet",
  "manual",
]);

const MAX_GATEWAY_REF_LENGTH = 200;

// Generates a short, unambiguous reference like `TXN-7H2KP`. Kept inline
// per the spec's helper so the route is self-contained and survives a
// refactor of request-kinds.
function generateRef(prefix: string): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${out}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth -------------------------------------------------------------
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/invoices/[id]/pay] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  try {
    // ---- Route param ---------------------------------------------------
    const { id } = await params;
    if (!id) return error("Invoice id is required", 400);

    // ---- Parse body ----------------------------------------------------
    let body: PayInvoiceBody;
    try {
      body = (await request.json()) as PayInvoiceBody;
    } catch {
      return error("Invalid JSON body", 400);
    }

    // ---- Validate method (required) -----------------------------------
    if (typeof body.method !== "string" || !body.method.trim()) {
      return error('"method" is required', 400);
    }
    const method = body.method.trim();
    if (!VALID_PAYMENT_METHODS.has(method)) {
      return error(
        `"method" must be one of: ${Array.from(VALID_PAYMENT_METHODS).join(", ")}`,
        400
      );
    }

    // ---- Validate gatewayReference (optional) -------------------------
    let gatewayReference: string | null = null;
    if (body.gatewayReference !== undefined && body.gatewayReference !== null) {
      if (typeof body.gatewayReference !== "string") {
        return error('"gatewayReference" must be a string', 400);
      }
      const trimmed = body.gatewayReference.trim();
      if (trimmed.length > MAX_GATEWAY_REF_LENGTH) {
        return error(
          `"gatewayReference" is too long (max ${MAX_GATEWAY_REF_LENGTH} chars)`,
          400
        );
      }
      if (trimmed) gatewayReference = trimmed;
    }

    // ---- Resolve the buyer's display fields from the DB ----------------
    // The JWT carries userId + email + role but not the buyer's name +
    // company — we denormalize these onto the transaction so historical
    // transactions stay readable even if the buyer later edits their
    // profile. We look up inside the transaction below for consistency
    // with the invoice lookup (single source of truth for buyer state).
    // Here we just stash the verified user id.
    void user;

    // ---- Read-modify-write inside a transaction ------------------------
    // Payment touches four rows across three tables:
    //   1. create Transaction            (payment record)
    //   2. update Invoice                (status → paid)
    //   3. update MarketOrder            (status → in_progress)
    //   4. update MarketRequest          (status → paid)
    // Wrapping in $transaction means if any step fails, no partial state
    // is written — the buyer never sees a "paid" invoice with a
    // still-"pending" order, or a transaction with no matching invoice.
    const result = await db.$transaction(async (tx) => {
      // Load the invoice (with its linked order + request) inside the
      // transaction so we read the latest state — no stale reads across
      // a concurrent payment attempt.
      const invoice = await tx.invoice.findUnique({
        where: { id },
        include: {
          order: {
            select: {
              id: true,
              status: true,
              requestId: true,
            },
          },
        },
      });

      if (!invoice) {
        throw new NotFoundError();
      }

      // ---- Ownership gate --------------------------------------------
      // The invoice belongs to whoever it was issued to. A buyer can
      // only pay their own invoice; admins cannot pay on a buyer's
      // behalf (financial action → buyer only).
      if (invoice.buyerId !== user.userId) {
        throw new ForbiddenError();
      }

      // ---- State guard -----------------------------------------------
      // Only an "issued" invoice can be paid. Any other status (draft /
      // already-paid / void / refunded) is a clean 409 with a clear
      // message — never a silent idempotent no-op. The buyer should
      // see "already paid" rather than have us re-charge them.
      if (invoice.status !== "issued") {
        throw new StateConflictError(
          `Invoice cannot be paid from status "${invoice.status}"`
        );
      }

      const now = new Date();

      // ---- 1. Create the Transaction record --------------------------
      // type="payment", status="success" — we don't model pending
      // gateway flows here (this route assumes the gateway has already
      // authorized). If a real gateway returns pending, the caller
      // should retry this call once the gateway confirms.
      const transaction = await tx.transaction.create({
        data: {
          reference: generateRef("TXN"),
          type: "payment",
          invoiceId: invoice.id,
          orderId: invoice.orderId,
          requestId: invoice.requestId ?? null,
          quoteId: invoice.quoteId ?? null,
          buyerId: invoice.buyerId,
          buyerName: invoice.buyerName,
          buyerCompany: invoice.buyerCompany,
          amount: invoice.total,
          currency: "USD",
          method,
          status: "success",
          description: `Payment for invoice ${invoice.reference}`,
          initiatedById: user.userId,
          initiatedByName: invoice.buyerName, // buyer-initiated
          gatewayReference,
          meta: JSON.stringify({
            invoiceReference: invoice.reference,
            method,
            paidAt: now.toISOString(),
          }),
          createdAt: now,
        },
      });

      // ---- 2. Update the Invoice -------------------------------------
      // Flip to "paid" and stamp the payment metadata. paymentReference
      // mirrors the transaction's gatewayReference (if any) so the
      // buyer dashboard can show the gateway id without joining through
      // the transactions table.
      const updatedInvoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          status: "paid",
          paidAt: now,
          paymentMethod: method,
          paymentReference: gatewayReference,
        },
      });

      // ---- 3. Update the linked MarketOrder -------------------------
      // The order moves from "pending" → "in_progress" once the buyer
      // has paid. This is the trigger for the admin delivery flow
      // (/api/admin/orders/[id]/deliver). We don't guard the order's
      // status here — if it's somehow not "pending" (e.g. already
      // in_progress from a prior payment attempt), we still flip it to
      // in_progress; the alternative (409 on the order) would leave the
      // invoice paid but the order stuck, which is worse.
      if (invoice.order) {
        await tx.marketOrder.update({
          where: { id: invoice.order.id },
          data: {
            status: "in_progress",
            updatedAt: now,
          },
        });
      }

      // ---- 4. Update the linked MarketRequest -----------------------
      // If the invoice is linked to a MarketRequest (created via
      // create-from-quote), flip the request to "paid" too. This is a
      // defensive `if` — not every invoice has a requestId (e.g.
      // standalone invoices issued directly against an order).
      if (invoice.requestId) {
        await tx.marketRequest.update({
          where: { id: invoice.requestId },
          data: {
            status: "paid",
          },
        });
      }

      return { invoice: updatedInvoice, transaction };
    });

    return success(result);
  } catch (err) {
    if (err instanceof NotFoundError) return error("Invoice not found", 404);
    if (err instanceof ForbiddenError) return error("Forbidden", 403);
    if (err instanceof StateConflictError) return error(err.message, 409);
    if (err instanceof FieldValidationError) return error(err.message, 400);
    // Prisma P2025 → record vanished between the findUnique and an
    // update. Extremely unlikely (would require a concurrent delete)
    // but mapped to 404 for safety.
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return error("Invoice not found", 404);
      }
      // P2002 → unique constraint. The only unique column on Transaction
      // (besides id) is `reference` — collision on TXN-XXXXX is
      // astronomically unlikely (30^5 ≈ 24M space) but if it happens
      // we surface a clean 409 asking the caller to retry.
      if (err.code === "P2002") {
        return error("Reference collision — please retry", 409);
      }
    }
    console.error("[api/invoices/[id]/pay] error:", err);
    return error("Unable to pay invoice", 500);
  }
}

// Sentinel classes — thrown inside the transaction so the outer catch can
// map each failure to its correct HTTP status without tripping the
// generic 500 path.
class NotFoundError extends Error {}
class ForbiddenError extends Error {}
class StateConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}
