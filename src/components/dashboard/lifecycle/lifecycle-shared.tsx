"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { REQUEST_STATUS_FLOW, REQUEST_STATUS_LABELS } from "@/lib/request-kinds";
import type { MarketRequest, MarketRequestStatus, RequestStatusEvent } from "@/types";

// ============================================================
// SHARED LIFECYCLE COMPONENTS
// Used across buyer My Requests / Request Detail / Orders and
// admin Service Requests pipeline / Quote Builder.
// ============================================================

const STAGE_COLORS: Record<MarketRequestStatus, string> = {
  open: "bg-amber-400",
  in_review: "bg-sky-400",
  quoted: "bg-violet-400",
  approved: "bg-teal-400",
  ordered: "bg-sky-500",
  paid: "bg-emerald-500",
  in_progress: "bg-sky-500",
  delivered: "bg-emerald-500",
  fulfilled: "bg-emerald-500",
  rejected: "bg-rose-500",
  closed: "bg-slate-400",
};

const DOT_RING: Record<MarketRequestStatus, string> = {
  open: "ring-amber-400/40",
  in_review: "ring-sky-400/40",
  quoted: "ring-violet-400/40",
  approved: "ring-teal-400/40",
  ordered: "ring-sky-500/40",
  paid: "ring-emerald-500/40",
  in_progress: "ring-sky-500/40",
  delivered: "ring-emerald-500/40",
  fulfilled: "ring-emerald-500/40",
  rejected: "ring-rose-500/40",
  closed: "ring-slate-400/40",
};

/**
 * Horizontal lifecycle stepper showing the 8 stages from
 *   Open → In Review → Quoted → Approved → Order Created → Paid → Delivered → Closed
 * Highlights the active stage based on the request's current status.
 */
export function LifecycleStepper({
  status,
  className,
}: {
  status: MarketRequestStatus;
  className?: string;
}) {
  const activeIndex = useMemo(() => {
    const idx = REQUEST_STATUS_FLOW.indexOf(status);
    return idx < 0 ? 0 : idx;
  }, [status]);

  // Rejected short-circuits the flow at any point — render a small banner instead.
  if (status === "rejected") {
    return (
      <div className={cn("rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-700 dark:text-rose-300", className)}>
        Quote declined — request closed
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} aria-label="Request lifecycle progress">
      <ol className="flex items-center gap-1.5">
        {REQUEST_STATUS_FLOW.map((stage, idx) => {
          const isComplete = idx < activeIndex;
          const isActive = idx === activeIndex;
          const isFuture = idx > activeIndex;
          return (
            <li key={stage} className="flex flex-1 items-center gap-1.5">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-inset",
                    isActive && cn(STAGE_COLORS[stage], "text-white", DOT_RING[stage]),
                    isComplete && "bg-emerald-500 text-white ring-emerald-500/40",
                    isFuture && "bg-slate-200 text-slate-400 ring-slate-200 dark:bg-slate-700 dark:text-slate-500 dark:ring-slate-700"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? "✓" : idx + 1}
                </span>
                <span
                  className={cn(
                    "truncate text-center text-[10px] font-medium leading-tight",
                    isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {REQUEST_STATUS_LABELS[stage]}
                </span>
              </div>
              {idx < REQUEST_STATUS_FLOW.length - 1 && (
                <span
                  className={cn(
                    "h-px w-2 shrink-0 sm:w-3",
                    idx < activeIndex ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * Vertical timeline of every statusHistory event on a request,
 * including who performed each step and an optional note.
 */
export function LifecycleTimeline({
  request,
  className,
}: {
  request: MarketRequest;
  className?: string;
}) {
  const events = request.statusHistory ?? [];
  if (events.length === 0) {
    return (
      <p className={cn("text-sm text-slate-500", className)}>
        No tracking events yet.
      </p>
    );
  }
  return (
    <ol className={cn("relative space-y-4 pl-6", className)}>
      <span
        className="absolute left-[11px] top-1 bottom-1 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent dark:from-slate-700 dark:via-slate-700"
        aria-hidden="true"
      />
      {events.map((ev: RequestStatusEvent, idx: number) => (
        <li key={idx} className="relative">
          <span
            className={cn(
              "absolute -left-6 top-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-900",
              STAGE_COLORS[ev.status] ?? "bg-slate-400"
            )}
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {REQUEST_STATUS_LABELS[ev.status] ?? ev.status}
            </p>
            <span className="text-[11px] text-slate-500">·</span>
            <span className="text-[11px] text-slate-500">
              {formatRelative(ev.at)}
            </span>
          </div>
          <div className="mt-0.5 text-[12px] text-slate-600 dark:text-slate-400">
            <span className="font-medium">{ev.by}</span>
            {ev.note && <span className="ml-1">— {ev.note}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function formatRelative(iso: string) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diff = Date.now() - then;
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export const LIFECYCLE_STAGE_INDEX: Record<MarketRequestStatus, number> =
  REQUEST_STATUS_FLOW.reduce(
    (acc, s, idx) => {
      acc[s] = idx;
      return acc;
    },
    {} as Record<MarketRequestStatus, number>
  );

/**
 * The next action the buyer needs to take, based on the current
 * request status. Returns null when nothing is pending.
 */
export function nextBuyerActionLabel(
  status: MarketRequestStatus
): { label: string; cta: string } | null {
  switch (status) {
    case "quoted":
      return { label: "Quote awaiting your decision", cta: "Review Quote" };
    case "ordered":
      return { label: "Invoice issued — payment due", cta: "Pay Invoice" };
    case "delivered":
      return { label: "Delivery awaiting acceptance", cta: "Accept Delivery" };
    default:
      return null;
  }
}
