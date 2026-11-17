"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        <h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp,
  tone = "blue",
  onClick,
}: {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  tone?: "blue" | "green" | "amber" | "violet" | "red";
  onClick?: () => void;
}) {
  const tones: Record<string, string> = {
    blue: "bg-blue-600/10 text-blue-600 dark:text-blue-400",
    green: "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-600/10 text-violet-600 dark:text-violet-400",
    red: "bg-red-600/10 text-red-600 dark:text-red-400",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-lg border bg-card p-4 text-left transition-all",
        onClick && "cursor-pointer hover:border-primary/40 hover:shadow-md"
      )}
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", tones[tone])}>
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
      {trend && (
        <span
          className={cn(
            "shrink-0 text-xs font-semibold",
            trendUp ? "text-emerald-600" : "text-red-500"
          )}
        >
          {trendUp ? "▲" : "▼"} {trend}
        </span>
      )}
    </button>
  );
}
