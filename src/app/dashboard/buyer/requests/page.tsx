import { redirect } from "next/navigation";
import { getCurrentBuyer } from "@/lib/auth-server";
import { listBuyerRequests, listCategories } from "@/lib/api/queries";
import { BuyerRequestsView } from "@/components/dashboard/buyer-requests-view";

export const dynamic = "force-dynamic";

export default async function BuyerRequestsPage() {
  const buyer = await getCurrentBuyer();
  if (!buyer) {
    redirect("/auth/login?next=/dashboard/buyer/requests");
    return null;
  }
  const [requests, categories] = await Promise.all([
    listBuyerRequests(buyer.id),
    listCategories(),
  ]);
  return <BuyerRequestsView requests={requests} categories={categories} />;
}
