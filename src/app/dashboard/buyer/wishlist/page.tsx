import { redirect } from "next/navigation";
import { getCurrentBuyer } from "@/lib/auth-server";
import { getBuyerWishlist } from "@/lib/api/queries";
import { BuyerWishlistView } from "@/components/dashboard/buyer-wishlist-view";

export const dynamic = "force-dynamic";

export default async function BuyerWishlistPage() {
  const buyer = await getCurrentBuyer();
  if (!buyer) {
    redirect("/auth/login?next=/dashboard/buyer/wishlist");
    return null;
  }
  const services = await getBuyerWishlist(buyer.id);
  return <BuyerWishlistView services={services} />;
}
