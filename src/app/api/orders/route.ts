import { NextRequest } from "next/server";
import { getCurrentAdmin, getCurrentBuyer } from "@/lib/auth-server";
import { ok, unauthorized } from "@/lib/api/helpers";
import { listAllOrders, listBuyerOrders } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders — list orders.
 * Admins see all orders; buyers see only their own; anonymous → 401.
 */
export async function GET(_req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (admin) {
    const orders = await listAllOrders();
    return ok({ orders });
  }
  const buyer = await getCurrentBuyer();
  if (!buyer) return unauthorized("Sign in required.");
  const orders = await listBuyerOrders(buyer.id);
  return ok({ orders });
}
