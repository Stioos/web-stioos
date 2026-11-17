import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, getCurrentBuyer } from "@/lib/auth-server";
import {
  badRequest,
  logActivity,
  notFound,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/orders/[id] — update order status.
 * Admins can set any status. Buyers can only accept delivery (-> completed)
 * on their own orders.
 * Body: { status }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await parseBody<{ status?: string }>(req);
  if (!body?.status) return badRequest("status is required.");
  const status = body.status;
  if (
    !["pending", "in_progress", "delivered", "completed", "cancelled"].includes(
      status
    )
  )
    return badRequest("Invalid status.");

  const order = await db.marketOrder.findUnique({ where: { id } });
  if (!order) return notFound("Order not found.");

  const admin = await getCurrentAdmin();
  const buyer = await getCurrentBuyer();

  if (!admin && !buyer) return unauthorized();
  if (buyer && buyer.id !== order.buyerId)
    return badRequest("You can only update your own orders.");
  // Buyers may only mark an order as completed (accept delivery).
  if (buyer && !admin && status !== "completed")
    return badRequest("Buyers can only accept delivery (mark completed).");

  const now = new Date();
  const updated = await db.marketOrder.update({
    where: { id },
    data: { status, updatedAt: now },
  });

  const actor = admin ? admin.name : buyer!.name;
  await logActivity({
    actor,
    action: "updated",
    module: "Orders",
    target: id,
    description: `Order ${order.serviceName} status → ${status.replace("_", " ")}.`,
  });

  return ok({ order: { id: updated.id, status: updated.status } });
}
