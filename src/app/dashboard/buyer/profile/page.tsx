"use client";

import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileView } from "@/components/dashboard/profile-view";

export default function BuyerProfilePage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Profile">
        <ProfileView role="buyer" />
      </DashboardShell>
    </RequireRole>
  );
}
