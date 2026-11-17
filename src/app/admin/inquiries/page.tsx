import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listInquiries } from "@/lib/api/queries";
import { AdminInquiriesView } from "@/components/admin/inquiries-view";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/inquiries");
    return;
  }
  const inquiries = await listInquiries();
  return <AdminInquiriesView inquiries={inquiries} />;
}
