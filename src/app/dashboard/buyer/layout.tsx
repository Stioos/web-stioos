import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth-server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

/**
 * Server-side guard for the entire `/dashboard/buyer/*` subtree.
 *
 * - No session → redirect to login with `next=/dashboard/buyer`.
 * - Admin session → redirect to `/admin` (their own workspace).
 * - Buyer session → render the DashboardShell (which renders the topbar /
 *   sidebar / footer chrome once for every buyer page) and pass through
 *   the page content as children.
 *
 * Individual buyer pages can therefore become pure server components that
 * fetch their own data via `@/lib/api/queries` and render a `<XView>`
 * client component — they don't need to repeat the auth check or wrap
 * themselves in the shell.
 */
export default async function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/auth/login?next=/dashboard/buyer");
    return;
  }
  if (session.kind === "admin") {
    redirect("/admin");
    return;
  }
  return <DashboardShell buyer={session.user}>{children}</DashboardShell>;
}
