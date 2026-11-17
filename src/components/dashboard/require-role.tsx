"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, RotateCcw, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCurrentUser, purgePersistedDemoState, useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { replaceWithRescue } from "@/lib/safe-nav";

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
            purgePersistedDemoState();
            useAppStore.persist.rehydrate();
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
 * Pulsing placeholder shown while the persisted store hydrates or while an
 * auth redirect is in flight. Reused by the dashboard shell and pages.
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
 * Hydration-aware dashboard guard.
 * - Renders a skeleton until the persisted store has rehydrated.
 * - Signed-out visitors are redirected to the login page (with a `next`
 *   param so they return to the page they tried to open).
 * - Cross-role access is redirected to the visitor's own dashboard home.
 *   Marketplace "member" accounts are allowed through (read-only browsing).
 */
export function RequireRole({
  role,
  children,
}: {
  role: "buyer";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const user = useCurrentUser();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      replaceWithRescue(router, `/auth/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== role && user.role !== "member") {
      replaceWithRescue(router, "/dashboard/buyer");
    }
  }, [hydrated, user, role, pathname, router]);

  if (!hydrated) return <DashboardSkeleton />;
  if (!user) return null;
  if (user.role !== role && user.role !== "member") return null;

  return <>{children}</>;
}
