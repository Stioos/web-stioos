import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — a single order's status / invoice linkage can
// change at any time; never serve from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/orders/[id]
// Fetches a single order by ID with full detail (linked invoice,
// linked request, buyer fields).
//
// Auth: the authenticated buyer may only fetch their own orders. An admin
// (role `admin` or `super-admin`) may fetch any order — used by the admin
// dashboard's detail view.
//
// 200 → { success: true, data: { order } }
// 401 → no/invalid bearer token
// 403 → order exists but doesn't belong to the authenticated buyer
//       (and the caller isn't an admin)
// 404 → no order with that id
// ============================================================

const ADMIN_ROLES = new Set(["admin", "super-admin"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth -------------------------------------------------------------
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/orders/[id]] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  try {
    // ---- Route param ---------------------------------------------------
    // Next.js 16: dynamic segment params are async and arrive as a Promise.
    const { id } = await params;
    if (!id) return error("Order id is required", 400);

    // ---- Lookup --------------------------------------------------------
    // Eagerly load the linked invoice + request so the buyer dashboard can
    // render the order detail view (with payment status and origin
    // request) in a single round-trip.
    const order = await db.marketOrder.findUnique({
      where: { id },
      include: {
        invoice: true,
        request: {
          select: {
            id: true,
            reference: true,
            title: true,
            status: true,
            kind: true,
            categoryName: true,
          },
        },
      },
    });

    if (!order) {
      return error("Order not found", 404);
    }

    // ---- Ownership / admin check --------------------------------------
    // A buyer may only see their own order. An admin may see any order.
    // We return 403 (not 404) when the order exists but isn't theirs —
    // the spec asks for that explicit signal so the buyer UI can show a
    // "Forbidden" message rather than a misleading "Not Found".
    if (order.buyerId !== user.userId && !ADMIN_ROLES.has(user.role)) {
      return error("Forbidden", 403);
    }

    return success({ order });
  } catch (err) {
    console.error("[api/orders/[id]] error:", err);
    return error("Unable to load order", 500);
  }
}
