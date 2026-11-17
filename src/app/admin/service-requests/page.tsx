import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listAllRequests, listInquiries } from "@/lib/api/queries";
import { ServiceRequestsView } from "@/components/admin/service-requests-view";

export const dynamic = "force-dynamic";

export default async function AdminServiceRequestsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/service-requests");
    return;
  }
  // The Pipeline tab needs every MarketRequest. The Website Enquiries tab
  // filters down to { service_request, quote, consultation } inquiry types
  // on the client, so we pass the full inquiry list here.
  const [requests, inquiries] = await Promise.all([
    listAllRequests(),
    listInquiries(),
  ]);
  return <ServiceRequestsView requests={requests} inquiries={inquiries} />;
}
