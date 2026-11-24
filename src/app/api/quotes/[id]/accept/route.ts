import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — accept/decline mutations change server state and
// must never be cached.
export const dynamic = "force-dynamic";

// ============================================================
// POST /api/quotes/[id]/accept
// Buyer accepts a quote. Sets quote.status = "accepted" + acceptedAt, and
// flips the parent MarketRequest.status to "approved" — both inside a
// single transaction so the request and quote never drift out of sync.
//
// Auth: `Authorization: Bearer <accessToken>`. The quote must belong to
// the authenticated buyer (quote.buyerId === user.userId). Admins do NOT
// bypass this gate — accepting a quote is a buyer-side commercial action,
// not an admin operation.
//
// No request body expected. (The handler tolerates an empty or arbitrary
// body — `await request.json()` is skipped so a missing Content-Type
// doesn't 400 the call.)
//
// 200 → { success: true, data: { quote } }
// 401 → no/invalid bearer token
// 403 → quote exists but doesn't belong to the authenticated buyer
// 404 → no quote with that id
// 409 → quote isn't in an acceptable state (already accepted / declined /
//       expired / draft)
// ============================================================

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
    console.error("[api/quotes/[id]/accept] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  // The accept call carries no body — but if a caller does send one, we
  // drain it so the underlying socket doesn't hang. We don't validate
  // the shape: the spec defines no fields for accept.
  void request;

  try {
    // ---- Route param ---------------------------------------------------
    const { id } = await params;
    if (!id) return error("Quote id is required", 400);

    // ---- Read-modify-write inside a transaction ------------------------
    const updated = await db.$transaction(async (tx) => {
      const quote = await tx.quote.findUnique({
        where: { id },
        select: {
          id: true,
          buyerId: true,
          status: true,
          requestId: true,
        },
      });

      if (!quote) {
        throw new NotFoundError();
      }

      // ---- Ownership gate --------------------------------------------
      // The quote belongs to whoever filed the parent request. A buyer
      // can only accept their own quote; an admin cannot accept on
      // behalf of a buyer (commercial action → buyer only).
      if (quote.buyerId !== user.userId) {
        throw new ForbiddenError();
      }

      // ---- State guard -----------------------------------------------
      // Only a quote in "sent" state can be accepted. Accepting an
      // already-accepted quote is idempotent-ish but the spec asks for
      // a clean state machine — surface a 409 with a clear message
      // rather than silently re-stamping acceptedAt.
      if (quote.status !== "sent") {
        throw new StateConflictError(
          `Quote cannot be accepted from status "${quote.status}"`
        );
      }

      const now = new Date();

      // Update the quote first — its status is the source of truth for
      // the buyer's decision. Then flip the parent request to "approved"
      // so the admin pipeline picks it up for order creation.
      const acceptedQuote = await tx.quote.update({
        where: { id: quote.id },
        data: {
          status: "accepted",
          acceptedAt: now,
        },
      });

      // Append an "approved" event to the parent request's statusHistory
      // so the buyer's accept shows up on the admin's timeline. Read-
      // modify-write inside the same transaction so it's atomic with
      // the request.status flip.
      const parentRequest = await tx.marketRequest.findUnique({
        where: { id: quote.requestId },
        select: { id: true, statusHistory: true },
      });

      if (parentRequest) {
        let history: unknown[] = [];
        try {
          const parsed = JSON.parse(parentRequest.statusHistory || "[]");
          if (Array.isArray(parsed)) history = parsed;
        } catch {
          history = [];
        }

        const event = {
          status: "approved",
          note: "Quote accepted by buyer",
          at: now.toISOString(),
          by: "buyer",
          byId: user.userId,
        };

        await tx.marketRequest.update({
          where: { id: parentRequest.id },
          data: {
            status: "approved",
            statusHistory: JSON.stringify([...history, event]),
          },
        });
      }

      return acceptedQuote;
    });

    return success({ quote: updated });
  } catch (err) {
    if (err instanceof NotFoundError) return error("Quote not found", 404);
    if (err instanceof ForbiddenError) return error("Forbidden", 403);
    if (err instanceof StateConflictError) return error(err.message, 409);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return error("Quote not found", 404);
    }
    console.error("[api/quotes/[id]/accept] error:", err);
    return error("Unable to accept quote", 500);
  }
}

// Sentinel classes — thrown inside the transaction so the outer catch can
// map each failure to its correct HTTP status without tripping the generic
// 500 path.
class NotFoundError extends Error {}
class ForbiddenError extends Error {}
class StateConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}
