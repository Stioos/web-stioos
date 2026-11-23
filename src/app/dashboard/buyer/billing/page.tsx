"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

/**
 * Billing has been consolidated into My Transactions.
 * Redirect there immediately.
 */
export default function BuyerBillingPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/buyer/transactions");
  }, [router]);
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Redirecting…">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center">
          <p className="text-sm text-slate-400">Redirecting to My Transactions…</p>
        </div>
      </DashboardShell>
    </RequireRole>
  );
}
