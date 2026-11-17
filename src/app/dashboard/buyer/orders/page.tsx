import { redirect } from "next/navigation";
import { getCurrentBuyer } from "@/lib/auth-server";
import { listBuyerOrders } from "@/lib/api/queries";
import { BuyerOrdersView } from "@/components/dashboard/buyer-orders-view";

export const dynamic = "force-dynamic";

export default async function BuyerOrdersPage() {
  const buyer = await getCurrentBuyer();
  if (!buyer) {
    redirect("/auth/login?next=/dashboard/buyer/orders");
    return null;
  }
  const orders = await listBuyerOrders(buyer.id);
  return <BuyerOrdersView orders={orders} />;
}
