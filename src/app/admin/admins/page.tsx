import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listAdmins, listRoles } from "@/lib/api/queries";
import { AdminAdminsView } from "@/components/admin/admins-view";

export const dynamic = "force-dynamic";

export default async function AdminAdminsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/admins");
    return;
  }
  const [admins, roles] = await Promise.all([
    listAdmins(),
    listRoles(),
  ]);
  return <AdminAdminsView admins={admins} roles={roles} />;
}
