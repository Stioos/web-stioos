import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-server";
import { DashboardSkeleton } from "@/components/dashboard/require-role";

export const dynamic = "force-dynamic";

/**
 * Dashboard entry point — server-side role router.
 *
 * - Admin session → `/admin`.
 * - Buyer session → `/dashboard/buyer`.
 * - Signed-out → `/auth/login?next=/dashboard`.
 *
 * `redirect()` throws during render so the skeleton below is never
 * actually committed to the DOM — it satisfies the type checker and
 * keeps a tiny escape hatch in case `redirect` ever no-ops.
 */
export default async function DashboardIndexPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/auth/login?next=/dashboard");
    return <DashboardSkeleton />;
  }
  if (session.kind === "admin") {
    redirect("/admin");
    return <DashboardSkeleton />;
  }
  redirect("/dashboard/buyer");
  return <DashboardSkeleton />;
}
