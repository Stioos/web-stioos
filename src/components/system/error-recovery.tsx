"use client";

/**
 * ERROR RECOVERY BOUNDARY — the last line of defense for the
 * "header options stopped responding" class of failures.
 *
 * There are two ways a page can LOOK fine while every click is dead:
 *
 * 1. REACT NEVER HYDRATES (bad network chunk, extension interference,
 *    crash during boot). The server HTML is on screen, but no handler is
 *    attached — every header option silently ignores input. This
 *    component sets window.__STIOOS_HYDRATED__ the moment it mounts, so
 *    the inline hydration guard in the root layout can detect that state
 *    and self-repair even though React itself never came up.
 *
 * 2. A CLIENT RENDER CRASH after hydration. Without a boundary, React
 *    unmounts the tree and the page goes dead with no explanation. This
 *    boundary catches it, hard-reloads ONCE per error signature (a
 *    transient failure simply heals), and if the same crash repeats it
 *    renders a visible recovery screen with a manual reload — the user
 *    is never left staring at a silent dead page.
 */

import Link from "next/link";
import React from "react";

const ERR_RELOAD_PREFIX = "stioos-err-reload:";

function hashSignature(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

function errorSignature(error: Error): string {
  return hashSignature(`${error.name}:${error.message}:${error.stack?.slice(0, 400) ?? ""}`);
}

function reloadBudgetAvailable(): boolean {
  try {
    const raw = window.sessionStorage.getItem("stioos-watchdog-reloads");
    const parsed: unknown = JSON.parse(raw ?? "[]");
    const log: number[] = Array.isArray(parsed) ? (parsed as number[]) : [];
    const now = Date.now();
    return log.filter((t) => now - t < 5 * 60_000).length < 3;
  } catch {
    return true;
  }
}

interface State {
  error: Error | null;
}

export class ErrorRecovery extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  componentDidMount(): void {
    // Hydration proven: React is alive and handlers are attached. The
    // inline guard in the root layout keys off this flag.
    (window as { __STIOOS_HYDRATED__?: boolean }).__STIOOS_HYDRATED__ = true;
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    console.error("[stioos-recovery] client render crash:", error);
    const sig = errorSignature(error);
    try {
      if (window.sessionStorage.getItem(ERR_RELOAD_PREFIX + sig)) return;
      window.sessionStorage.setItem(ERR_RELOAD_PREFIX + sig, "1");
    } catch {
      /* storage unavailable — fall through to the recovery screen */
    }
    if (reloadBudgetAvailable()) {
      window.location.reload();
    }
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div
          className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-ink px-6 text-center text-white"
          role="alert"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-400">
              STIOOS GLOBAL
            </span>
            <h1 className="text-xl font-semibold">Something interrupted this page</h1>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              A temporary error stopped the interface from responding. Reload to
              restore it — your session and preferences are preserved.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center rounded-lg bg-amber-500 px-4 text-sm font-semibold text-brand-ink transition-colors hover:bg-amber-400"
            >
              Reload page
            </button>
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
