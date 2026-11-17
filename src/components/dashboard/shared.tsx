"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import type { MarketOrderStatus, MarketRequestStatus } from "@/types";
import { cn } from "@/lib/utils";

// ============================================================
// Shared dashboard building blocks — stat cards, section cards,
// status badges, empty states and formatting helpers.
// ============================================================

// ---------- Formatting helpers ----------

/** USD amount — no decimals unless the amount actually has them. */
export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Relative time — "3 days ago". */
export function timeAgo(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

/** Absolute date — "Aug 24, 2026". */
export function formatDate(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy");
}

// ---------- Stat card ----------

export type StatAccent = "amber" | "emerald" | "sky" | "violet" | "rose" | "teal" | "slate";

const STAT_ACCENTS: Record<StatAccent, string> = {
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-600",
  sky: "bg-sky-500/10 text-sky-600",
  violet: "bg-violet-500/10 text-violet-600",
  rose: "bg-rose-500/10 text-rose-600",
  teal: "bg-teal-500/10 text-teal-600",
  slate: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "amber",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accent?: StatAccent;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      {Icon && (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            STAT_ACCENTS[accent]
          )}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">{value}</p>
        {hint && <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

// ---------- Section card ----------

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("rounded-xl border bg-card p-5 shadow-sm", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}

// ---------- Status badges ----------

type BadgeTone = "amber" | "sky" | "emerald" | "teal" | "rose" | "slate";

const BADGE_TONES: Record<BadgeTone, string> = {
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  sky: "border-sky-500/30 bg-sky-500/10 text-sky-700",
  emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  teal: "border-teal-500/30 bg-teal-500/10 text-teal-700",
  rose: "border-rose-500/30 bg-rose-500/10 text-rose-700",
  slate: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

const ORDER_STATUS_META: Record<MarketOrderStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: "Pending", tone: "amber" },
  in_progress: { label: "In progress", tone: "sky" },
  delivered: { label: "Delivered", tone: "emerald" },
  completed: { label: "Completed", tone: "teal" },
  cancelled: { label: "Cancelled", tone: "rose" },
};

const REQUEST_STATUS_META: Record<MarketRequestStatus, { label: string; tone: BadgeTone }> = {
  open: { label: "Open", tone: "amber" },
  in_review: { label: "In review", tone: "sky" },
  in_progress: { label: "In progress", tone: "teal" },
  fulfilled: { label: "Fulfilled", tone: "emerald" },
  rejected: { label: "Rejected", tone: "rose" },
  closed: { label: "Closed", tone: "slate" },
};

function ToneBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        BADGE_TONES[tone]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

/** Colored badge for marketplace order / request statuses. */
export function StatusBadge({
  status,
  className,
}: {
  status: MarketOrderStatus | MarketRequestStatus;
  className?: string;
}) {
  const meta =
    ORDER_STATUS_META[status as MarketOrderStatus] ??
    REQUEST_STATUS_META[status as MarketRequestStatus] ??
    { label: status, tone: "slate" as BadgeTone };
  return (
    <span className={className}>
      <ToneBadge label={meta.label} tone={meta.tone} />
    </span>
  );
}

// ---------- Empty state ----------

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground"
        aria-hidden="true"
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
