import { redirect } from "next/navigation";
import { getCurrentBuyer } from "@/lib/auth-server";
import { listBuyerThreads } from "@/lib/api/queries";
import { MessagesView } from "@/components/dashboard/messages-view";

export const dynamic = "force-dynamic";

export default async function BuyerMessagesPage() {
  const buyer = await getCurrentBuyer();
  if (!buyer) {
    redirect("/auth/login?next=/dashboard/buyer/messages");
    return null;
  }
  const threads = await listBuyerThreads(buyer.id);
  return <MessagesView threads={threads} buyerId={buyer.id} />;
}
