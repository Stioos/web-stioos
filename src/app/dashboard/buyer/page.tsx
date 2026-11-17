import {
  getBuyerOverview,
  listBuyerOrders,
  listBuyerRequests,
  listServicesRaw,
} from "@/lib/api/queries";
import { getCurrentBuyer } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { BuyerOverviewView } from "@/components/dashboard/buyer-overview-view";

export const dynamic = "force-dynamic";

/**
 * Buyer dashboard overview — server-rendered with live Prisma data.
 *
 * The layout already verified the buyer session, so `getCurrentBuyer()`
 * here is a fast lookup (cookie → Session row → User row) and only
 * acts as a defensive fallback: if the session vanished between the
 * layout and this page, redirect to the login page.
 */
export default async function BuyerDashboardPage() {
  const buyer = await getCurrentBuyer();
  if (!buyer) {
    redirect("/auth/login?next=/dashboard/buyer");
    return null;
  }

  const [overview, orders, requests, featured] = await Promise.all([
    getBuyerOverview(buyer.id),
    listBuyerOrders(buyer.id),
    listBuyerRequests(buyer.id),
    listServicesRaw({ featured: true, status: "published", limit: 6 }),
  ]);

  return (
    <BuyerOverviewView
      buyer={buyer}
      overview={overview}
      orders={orders}
      requests={requests}
      featured={featured}
    />
  );
}
