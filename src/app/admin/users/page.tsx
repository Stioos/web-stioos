import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listUsers } from "@/lib/api/queries";
import { AdminUsersView } from "@/components/admin/users-view";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/users");
    return;
  }
  const users = await listUsers();
  return <AdminUsersView users={users} />;
}
