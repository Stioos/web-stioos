import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listNotifications } from "@/lib/api/queries";
import { AdminNotificationsView } from "@/components/admin/notifications-view";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/notifications");
    return;
  }
  const notifications = await listNotifications();
  return <AdminNotificationsView notifications={notifications} />;
}
