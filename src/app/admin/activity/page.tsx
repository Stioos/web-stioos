import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listActivity } from "@/lib/api/queries";
import { AdminActivityView } from "@/components/admin/activity-view";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/activity");
    return;
  }
  const activity = await listActivity(300);
  return <AdminActivityView activity={activity} />;
}
