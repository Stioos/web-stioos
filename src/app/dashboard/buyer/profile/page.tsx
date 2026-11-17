import { redirect } from "next/navigation";
import { getCurrentBuyer } from "@/lib/auth-server";
import {
  getBuyerWishlist,
  getUserById,
  listBuyerOrders,
  listBuyerThreads,
} from "@/lib/api/queries";
import { ProfileView } from "@/components/dashboard/profile-view";

export const dynamic = "force-dynamic";

export default async function BuyerProfilePage() {
  const buyer = await getCurrentBuyer();
  if (!buyer) {
    redirect("/auth/login?next=/dashboard/buyer/profile");
    return null;
  }
  const [user, orders, threads, wishlist] = await Promise.all([
    getUserById(buyer.id),
    listBuyerOrders(buyer.id),
    listBuyerThreads(buyer.id),
    getBuyerWishlist(buyer.id),
  ]);
  // `getUserById` should always resolve for a valid session, but
  // defensively fall back to the buyer DTO if the row was pruned
  // between the layout and this page.
  if (!user) {
    redirect("/auth/login?next=/dashboard/buyer/profile");
    return null;
  }
  return (
    <ProfileView
      user={user}
      stats={{
        orders: orders.length,
        threads: threads.length,
        wishlist: wishlist.length,
      }}
    />
  );
}
