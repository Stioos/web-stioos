import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAdmin, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — admin mutations must never be served from cache.
export const dynamic = "force-dynamic";

// ============================================================
// POST /api/admin/orders/[id]/deliver
// Admin marks an in_progress order as delivered. Sets order.status to
// "delivered" and flips the linked MarketRequest (if any) to "delivered"
// — both inside a single transaction so the order and request never
// drift out of sync.
//
// Auth: `Authorization: Bearer <accessToken>` with role `admin` or
// `super-admin`.
//
// No request body expected. (The handler tolerates an empty or arbitrary
// body — `await request.json()` is skipped so a missing Content-Type
// doesn't 400 the call.)
//
// 200 → { success: true, data: { order } }
// 401 → no/invalid bearer token
// 403 → authenticated but not an admin role
// 404 → no order with that id
// 409 → order isn't in the "in_progress" state (can't deliver from any
//       other status)
// ============================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth -------------------------------------------------------------
  let admin: JWTPayload;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/admin/orders/[id]/deliver] unexpected requireAdmin failure:", err);
    return error("Unauthorized", 401);
  }

  // The deliver call carries no body — but if a caller does send one, we
  // drain it so the underlying socket doesn't hang. The body shape isn't
  // validated: the spec defines no fields here.
  void request;

  try {
    // ---- Route param ---------------------------------------------------
    const { id } = await params;
    if (!id) return error("Order id is required", 400);

    // ---- Read-modify-write inside a transaction ------------------------
    // We load the order first to check its status, then update it and
    // the linked request atomically. Wrapping in $transaction means if
    // any step fails, no partial state is written — the admin never
    // sees a "delivered" order with a still-"paid" request.
    const updated = await db.$transaction(async (tx) => {
      const order = await tx.marketOrder.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          requestId: true,
        },
      });

      if (!order) {
        throw new NotFoundError();
      }

      // ---- State guard -----------------------------------------------
      // Only an "in_progress" order can be delivered. Any other status
      // (pending / already-delivered / completed / cancelled) is a
      // clean 409 with a clear message — never a silent no-op.
      if (order.status !== "in_progress") {
        throw new StateConflictError(
          `Order cannot be delivered from status "${order.status}"`
        );
      }

      const now = new Date();

      // Flip the order to "delivered" first — its status is the source
      // of truth for the admin's delivery action. updatedAt is stamped
      // explicitly because the model uses @default(now()) rather than
      // @updatedAt, so Prisma won't auto-touch it on update.
      const deliveredOrder = await tx.marketOrder.update({
        where: { id: order.id },
        data: {
          status: "delivered",
          updatedAt: now,
        },
      });

      // If the order is linked to a MarketRequest, flip it to "delivered"
      // too. This is a defensive `if` — not every order has a requestId
      // (e.g. direct catalog purchases skip the request flow).
      if (order.requestId) {
        await tx.marketRequest.update({
          where: { id: order.requestId },
          data: {
            status: "delivered",
          },
        });
      }

      return deliveredOrder;
    });

    return success({ order: updated });
  } catch (err) {
    if (err instanceof NotFoundError) return error("Order not found", 404);
    if (err instanceof StateConflictError) return error(err.message, 409);
    // Prisma P2025 → record vanished between the findUnique and the
    // update. Extremely unlikely (would require a concurrent delete)
    // but mapped to 404 for safety.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return error("Order not found", 404);
    }
    console.error("[api/admin/orders/[id]/deliver] error:", err);
    return error("Unable to deliver order", 500);
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
