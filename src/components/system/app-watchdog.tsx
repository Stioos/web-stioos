"use client";

/**
 * APP WATCHDOG — permanent self-healing for stale browser tabs.
 *
 * THE RECURRING BUG THIS KILLS: the user keeps a tab open across code
 * changes (dev Fast Refresh, dev-server restarts, production deploys).
 * The old module graph keeps rendering, but its event handlers point at
 * dead module instances — so header dropdowns, pills, and the login
 * button silently stop responding until a manual reload. Reported
 * "again and again"; every previous fix patched a symptom. This watchdog
 * removes the root cause: a stale shell can no longer survive.
 *
 * Two independent detection layers:
 *
 * 1. STAMP MISMATCH — the server-rendered load stamp
 *    (window.__APP_STAMP__, injected by the root layout) is compared
 *    against /api/app-stamp on focus, on becoming visible, on the first
 *    user interaction, and every 20 s. Any source change or server
 *    restart changes the stamp → stale tab hard-reloads itself.
 *
 * 2. CHUNK-LOAD FAILURES — a graph error / unhandled rejection matching
 *    known "dead chunk" signatures (ChunkLoadError, dynamic-import
 *    failures, missing preload entries) means the tab already lost its
 *    code → hard reload instead of a dead page.
 *
 * Safety rails: never reloads while the user is typing or a dialog is
 * open (the check defers to the next tick), and the reload itself is
 * throttled (max 3 per 5 minutes) so a pathological loop can never trap
 * the user.
 */

import { useEffect } from "react";

const RELOAD_LOG_KEY = "stioos-watchdog-reloads";
const MAX_RELOADS_PER_WINDOW = 3;
const RELOAD_WINDOW_MS = 5 * 60_000;
const POLL_INTERVAL_MS = 20_000;

declare global {
  interface Window {
    __APP_STAMP__?: string;
  }
}

function reloadBudgetAvailable(): boolean {
  try {
    const now = Date.now();
    const raw = window.sessionStorage.getItem(RELOAD_LOG_KEY);
    const parsed: unknown = JSON.parse(raw ?? "[]");
    const log: number[] = Array.isArray(parsed) ? (parsed as number[]) : [];
    const recent = log.filter((t) => now - t < RELOAD_WINDOW_MS);
    if (recent.length >= MAX_RELOADS_PER_WINDOW) return false;
    recent.push(now);
    window.sessionStorage.setItem(RELOAD_LOG_KEY, JSON.stringify(recent));
    return true;
  } catch {
    // Storage unavailable — allow the reload; the throttle is best-effort.
    return true;
  }
}

function userIsBusy(): boolean {
  const el = document.activeElement as HTMLElement | null;
  if (
    el &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.tagName === "SELECT" ||
      el.isContentEditable)
  ) {
    return true;
  }
  if (document.querySelector('[role="dialog"][data-state="open"]')) return true;
  return false;
}

function hardReload(reason: string): void {
  if (!reloadBudgetAvailable()) return;
  console.warn("[stioos-watchdog] auto-recovering stale app shell:", reason);
  window.location.reload();
}

const CHUNK_ERROR_RE =
  /ChunkLoadError|Loading chunk \d|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS/i;

export function AppWatchdog() {
  useEffect(() => {
    let disposed = false;
    let checking = false;
    let sawInteraction = false;

    async function checkStamp(): Promise<void> {
      if (disposed || checking) return;
      checking = true;
      try {
        const res = await fetch("/api/app-stamp", {
          cache: "no-store",
          // Keep the probe cheap; a dead network must never throw.
          signal: AbortSignal.timeout ? AbortSignal.timeout(8_000) : undefined,
        });
        if (!res.ok) return;
        const data = (await res.json()) as { stamp?: string | null };
        if (disposed || !data.stamp) return;
        const mine = window.__APP_STAMP__ ?? null;
        if (mine && data.stamp !== mine) {
          if (userIsBusy()) return; // retry on the next tick
          hardReload("server is running newer code (stamp mismatch)");
        }
      } catch {
        // Network hiccup / offline / dev server restarting — ignore.
      } finally {
        checking = false;
      }
    }

    function onRejectionOrError(ev: ErrorEvent | PromiseRejectionEvent): void {
      const msg =
        ev instanceof ErrorEvent
          ? `${ev.message ?? ""}`
          : `${(ev.reason && (ev.reason.message ?? ev.reason)) ?? ""}`;
      if (CHUNK_ERROR_RE.test(msg)) {
        hardReload("chunk-load failure detected");
        return;
      }
      // A runtime error on a shell that never hydrated means the interface
      // is dead on arrival (server HTML only, no handlers) — recover now
      // instead of leaving a page that looks fine but ignores all input.
      const hydrated = (
        window as Window & { __STIOOS_HYDRATED__?: boolean }
      ).__STIOOS_HYDRATED__;
      if (hydrated === false && !userIsBusy()) {
        hardReload("runtime error on non-hydrated shell");
      }
    }

    function onVisibleCheck(): void {
      if (document.visibilityState === "visible") void checkStamp();
    }

    function onPointerDown(): void {
      // First interaction after load: verify cheaply so a dead shell
      // heals on the user's very next click rather than at the next poll.
      if (sawInteraction) return;
      sawInteraction = true;
      void checkStamp();
    }

    window.addEventListener("error", onRejectionOrError);
    window.addEventListener("unhandledrejection", onRejectionOrError);
    document.addEventListener("visibilitychange", onVisibleCheck);
    window.addEventListener("focus", onVisibleCheck);
    window.addEventListener("pointerdown", onPointerDown, { once: true });

    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") void checkStamp();
    }, POLL_INTERVAL_MS);

    // Kick off one check shortly after mount (covers an SSR-rendered page
    // whose JS graph was replaced between render and hydration).
    const kick = window.setTimeout(() => void checkStamp(), 2_500);

    return () => {
      disposed = true;
      window.clearTimeout(kick);
      window.clearInterval(poll);
      window.removeEventListener("error", onRejectionOrError);
      window.removeEventListener("unhandledrejection", onRejectionOrError);
      document.removeEventListener("visibilitychange", onVisibleCheck);
      window.removeEventListener("focus", onVisibleCheck);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}
