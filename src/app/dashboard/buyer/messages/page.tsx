"use client";

import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MessagesView } from "@/components/dashboard/messages-view";

export default function BuyerMessagesPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Messages">
        <MessagesView role="buyer" />
      </DashboardShell>
    </RequireRole>
  );
}
