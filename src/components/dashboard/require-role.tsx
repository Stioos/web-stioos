"use client";

import { useEffect, useState } from "react";
import { Loader2, RotateCcw, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/**
 * Escape hatch shown when the dashboard skeleton is still on screen after
 * several seconds. Every known cause of a permanently-frozen dashboard
 * (corrupt localStorage blob, hydration that never finishes, a stale
 * browser tab holding dead JS chunks) leaves this exact skeleton on
 * screen — instead of an infinite spinner the visitor gets one-click
 * recovery.
 */
function StalledHydrationNotice() {
  const [resetting, setResetting] = useState(false);

  return (
    <div
      role="alert"
      className="mx-auto mt-6 w-full max-w-md rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center shadow-sm"
    >
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-amber-600">
        <ShieldAlert className="h-4 w-4" aria-hidden="true" />
        Still loading…
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Your workspace is taking longer than usual to open. This is usually a
        stale saved session — reload, or reset the demo data to continue.
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <Button size="sm" className="h-9" onClick={() => window.location.reload()}>
          Reload page
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9"
          disabled={resetting}
          onClick={() => {
            setResetting(true);
            // Best-effort wipe of any stale persisted demo state, then reload.
            try {
              for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key && (key.startsWith("stioos-") || key.startsWith("jobsonn-"))) {
                  localStorage.removeItem(key);
                }
              }
            } catch {
              /* ignore */
            }
            setTimeout(() => window.location.reload(), 300);
          }}
        >
          {resetting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Reset demo data
        </Button>
      </div>
    </div>
  );
}

/**
 * Pulsing placeholder shown while a redirect is in flight or while a
 * page is being fetched server-side. Reused by the dashboard entry point.
 * Includes a stalled-hydration notice so the skeleton can never silently
 * spin forever.
 */
export function DashboardSkeleton() {
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setStalled(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-6"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
      {stalled && <StalledHydrationNotice />}
    </div>
  );
}

/**
 * Thin presentational wrapper — auth gating for the buyer dashboard is now
 * enforced server-side by `/dashboard/buyer/layout.tsx` (which calls
 * `getCurrentBuyer()` and redirects unauthenticated visitors to the login
 * page). This component just renders its children so any existing call
 * sites keep working without touching the layout.
 */
export function RequireRole({
  children,
}: {
  role?: "buyer";
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
