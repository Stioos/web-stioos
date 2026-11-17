import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listAllOrders } from "@/lib/api/queries";
import { AdminOrdersView } from "@/components/admin/orders-view";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/orders");
    return;
  }
  const orders = await listAllOrders();
  return <AdminOrdersView orders={orders} />;
}
