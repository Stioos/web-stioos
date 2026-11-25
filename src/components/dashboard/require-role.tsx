"use client";

import { useEffect } from "react";
import { useAppStore, useCurrentUser } from "@/lib/store";

/**
 * Dashboard guard that shares the marketplace demo session used by the
 * public sign-in drawer. Direct buyer-dashboard visits enter the seeded
 * buyer workspace instead of being sent to the standalone login page.
 */
export function RequireRole({
  role,
  children,
}: {
  role: "buyer";
  children: React.ReactNode;
}) {
  const user = useCurrentUser();
  const quickMarketLogin = useAppStore((s) => s.quickMarketLogin);

  useEffect(() => {
    if (!user) quickMarketLogin("usr-mkt-buyer");
  }, [quickMarketLogin, user]);

  if (!user || (user.role !== role && user.role !== "member")) return null;

  return <>{children}</>;
}
