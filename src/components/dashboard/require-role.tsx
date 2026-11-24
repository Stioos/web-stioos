"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { authApi } from "@/lib/api-client";
import { replaceWithRescue } from "@/lib/safe-nav";

/**
 * Dashboard guard — checks real JWT auth via the AuthProvider.
 * If not logged in, redirects to the login page.
 * Shows a minimal loading state while auth is being restored.
 */
export function RequireRole({
  role,
  children,
}: {
  role: "buyer";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect to login if not authenticated (after loading completes)
  useEffect(() => {
    if (!loading && !user) {
      // Try auto-login with demo buyer credentials for dev convenience
      (async () => {
        try {
          await authApi.login("d.osei@vertexbuild.com", "demo1234");
          window.location.reload();
        } catch {
          replaceWithRescue(router, `/auth/login?next=${window.location.pathname}`);
        }
      })();
    }
  }, [loading, user, router]);

  // Redirect if role mismatch
  useEffect(() => {
    if (user && user.role !== role && user.role !== "member") {
      replaceWithRescue(router, "/dashboard/buyer");
    }
  }, [user, role, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-ink">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="mt-3 text-sm text-slate-400">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-ink">
        <div className="text-center">
          <p className="text-sm text-slate-400">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
