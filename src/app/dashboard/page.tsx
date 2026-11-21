"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useCurrentAdmin, useCurrentUser } from "@/lib/store";
import { replaceWithRescue } from "@/lib/safe-nav";

/**
 * Dashboard entry point — routes the signed-in identity to the right
 * workspace immediately (no hydration wait, no loading screen):
 * buyer / marketplace member → /dashboard/buyer ·
 * admin-only session → /admin · signed-out → auto-login as demo buyer.
 */
export default function DashboardIndexPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const currentAdminId = useAppStore((s) => s.currentAdminId);
  const admins = useAppStore((s) => s.admins);
  const admin = useCurrentAdmin();
  const quickLogin = useAppStore((s) => s.quickLogin);
  const quickMarketLogin = useAppStore((s) => s.quickMarketLogin);

  useEffect(() => {
    // Platform staff wins ties
    const adminSession = admin ?? admins.find((a) => a.id === currentAdminId);
    if (adminSession) {
      replaceWithRescue(router, "/admin");
      return;
    }
    if (user) {
      replaceWithRescue(router, "/dashboard/buyer");
      return;
    }
    // No session — auto-login as demo buyer and redirect
    quickMarketLogin("usr-001");
    replaceWithRescue(router, "/dashboard/buyer");
  }, [user, admin, admins, currentAdminId, router, quickMarketLogin]);

  // Render nothing while redirecting — no loading screen
  return null;
}
