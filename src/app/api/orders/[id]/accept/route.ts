import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — accept-delivery mutations change server state
// and must never be cached.
export const dynamic = "force-dynamic";

// ============================================================
// POST /api/orders/[id]/accept
// Buyer accepts delivery of a delivered order. Sets order.status to
// "completed" and flips the linked MarketRequest (if any) to "closed"
// — both inside a single transaction so the order and request never
// drift out of sync.
//
// Auth: `Authorization: Bearer <accessToken>`. The order must belong to
// the authenticated buyer (order.buyerId === user.userId). Admins do NOT
// bypass this gate — accepting delivery is a buyer-side commercial
// action, not an admin operation.
//
// No request body expected. (The handler tolerates an empty or arbitrary
// body — `await request.json()` is skipped so a missing Content-Type
// doesn't 400 the call.)
//
// 200 → { success: true, data: { order } }
// 401 → no/invalid bearer token
// 403 → order exists but doesn't belong to the authenticated buyer
// 404 → no order with that id
// 409 → order isn't in the "delivered" state (can't accept from any
//       other status)
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
    console.error("[api/orders/[id]/accept] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  // The accept-delivery call carries no body — but if a caller does send
  // one, we drain it so the underlying socket doesn't hang. The body
  // shape isn't validated: the spec defines no fields here.
  void request;

  try {
    // ---- Route param ---------------------------------------------------
    const { id } = await params;
    if (!id) return error("Order id is required", 400);

    // ---- Read-modify-write inside a transaction ------------------------
    // We load the order first to check ownership + status, then update it
    // and the linked request atomically. Wrapping in $transaction means
    // if any step fails, no partial state is written — the buyer never
    // sees a "completed" order with a still-"delivered" request.
    const updated = await db.$transaction(async (tx) => {
      const order = await tx.marketOrder.findUnique({
        where: { id },
        select: {
          id: true,
          buyerId: true,
          status: true,
          requestId: true,
        },
      });

      if (!order) {
        throw new NotFoundError();
      }

      // ---- Ownership gate --------------------------------------------
      // The order belongs to whoever paid for it. A buyer can only
      // accept delivery on their own order; admins cannot accept on a
      // buyer's behalf (commercial action → buyer only).
      if (order.buyerId !== user.userId) {
        throw new ForbiddenError();
      }

      // ---- State guard -----------------------------------------------
      // Only an "delivered" order can be accepted. Any other status
      // (pending / in_progress / already-completed / cancelled) is a
      // clean 409 with a clear message — never a silent no-op.
      if (order.status !== "delivered") {
        throw new StateConflictError(
          `Order cannot be accepted from status "${order.status}"`
        );
      }

      const now = new Date();

      // Flip the order to "completed" first — its status is the source
      // of truth for the buyer's acceptance. updatedAt is stamped
      // explicitly because the model uses @default(now()) rather than
      // @updatedAt, so Prisma won't auto-touch it on update.
      const completedOrder = await tx.marketOrder.update({
        where: { id: order.id },
        data: {
          status: "completed",
          updatedAt: now,
        },
      });

      // If the order is linked to a MarketRequest, close it out too.
      // This is a defensive `if` — not every order has a requestId
      // (e.g. direct catalog purchases skip the request flow).
      if (order.requestId) {
        await tx.marketRequest.update({
          where: { id: order.requestId },
          data: {
            status: "closed",
          },
        });
      }

      return completedOrder;
    });

    return success({ order: updated });
  } catch (err) {
    if (err instanceof NotFoundError) return error("Order not found", 404);
    if (err instanceof ForbiddenError) return error("Forbidden", 403);
    if (err instanceof StateConflictError) return error(err.message, 409);
    // Prisma P2025 → record vanished between the findUnique and the
    // update. Extremely unlikely (would require a concurrent delete)
    // but mapped to 404 for safety.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return error("Order not found", 404);
    }
    console.error("[api/orders/[id]/accept] error:", err);
    return error("Unable to accept order", 500);
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
