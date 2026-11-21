"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser, useAppStore } from "@/lib/store";
import { replaceWithRescue } from "@/lib/safe-nav";

/**
 * Dashboard guard — no hydration wait, no skeleton, no loading screen.
 * Auto-logins a demo buyer if none is logged in, then renders children.
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
  const user = useCurrentUser();
  const quickMarketLogin = useAppStore((s) => s.quickMarketLogin);

  // Auto-login demo buyer if none is logged in
  useEffect(() => {
    if (!user) {
      quickMarketLogin("usr-001");
    }
  }, [user, quickMarketLogin]);

  // Redirect if role mismatch (but don't block rendering)
  useEffect(() => {
    if (user && user.role !== role && user.role !== "member") {
      replaceWithRescue(router, "/dashboard/buyer");
    }
  }, [user, role, router]);

  return <>{children}</>;
}
