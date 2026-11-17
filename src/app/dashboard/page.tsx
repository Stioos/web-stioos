"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useCurrentAdmin, useCurrentUser } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { replaceWithRescue } from "@/lib/safe-nav";
import { DashboardSkeleton } from "@/components/dashboard/require-role";

/**
 * Dashboard entry point — routes the signed-in identity to the right
 * workspace once the persisted store has rehydrated:
 * buyer / marketplace member → /dashboard/buyer ·
 * admin-only session → /admin · signed-out → login with next=/dashboard.
 */
export default function DashboardIndexPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const currentAdminId = useAppStore((s) => s.currentAdminId);
  const admins = useAppStore((s) => s.admins);
  const admin = useCurrentAdmin();

  useEffect(() => {
    if (!hydrated) return;
    // Platform staff wins ties: with a legacy blob holding both sessions
    // (pre-v14 storage), an explicit Super Admin session must never be
    // hijacked into the buyer workspace.
    const adminSession = admin ?? admins.find((a) => a.id === currentAdminId);
    if (adminSession) {
      replaceWithRescue(router, "/admin");
      return;
    }
    if (user) {
      replaceWithRescue(router, "/dashboard/buyer");
      return;
    }
    replaceWithRescue(router, "/auth/login?next=%2Fdashboard");
  }, [hydrated, user, admin, admins, currentAdminId, router]);

  return <DashboardSkeleton />;
}
