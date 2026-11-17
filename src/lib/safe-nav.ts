"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Router navigation with a hard-navigation rescue.
 *
 * Next.js 16's App Router can silently fail to commit a programmatic
 * navigation when the router has not finished initializing yet (observed
 * in dev as "Internal Next.js error: Router action dispatched before
 * initialization" right after a full-reload / Fast Refresh). The user is
 * then stranded on the current page with no feedback — e.g. a successful
 * sign-in that never leaves /auth/login.
 *
 * `pushWithRescue` first attempts the SPA navigation and, if the browser
 * is still on the origin path after a short grace period, falls back to a
 * full (hard) navigation which always lands on the destination.
 */
export function pushWithRescue(router: AppRouterInstance, dest: string): void {
  const originPath = window.location.pathname;
  try {
    router.push(dest);
  } catch {
    // Router threw synchronously — hard navigation is the only option.
    window.location.assign(dest);
    return;
  }
  window.setTimeout(() => {
    if (window.location.pathname === originPath) {
      // SPA navigation never committed — rescue with a hard navigation.
      window.location.assign(dest);
    }
  }, 3000);
}

/** Same rescue semantics for replace-style navigations (auth guards). */
export function replaceWithRescue(router: AppRouterInstance, dest: string): void {
  const originPath = window.location.pathname;
  try {
    router.replace(dest);
  } catch {
    window.location.assign(dest);
    return;
  }
  window.setTimeout(() => {
    if (window.location.pathname === originPath) {
      window.location.assign(dest);
    }
  }, 3000);
}
