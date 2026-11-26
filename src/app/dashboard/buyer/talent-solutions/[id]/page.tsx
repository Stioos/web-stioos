"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function BuyerTalentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/dashboard/buyer/talent-transactions?id=${params.id}`);
    } else {
      router.replace("/dashboard/buyer/talent-transactions");
    }
  }, [params?.id, router]);

  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Talent Transactions">
        <div className="flex min-h-[400px] items-center justify-center p-8 text-slate-400">
          Loading talent transaction...
        </div>
      </DashboardShell>
    </RequireRole>
  );
}
