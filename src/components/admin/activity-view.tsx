"use client";

import { useMemo, useState } from "react";
import { format, formatDistanceToNow, isToday, subDays } from "date-fns";
import { Download, History } from "lucide-react";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import {
  InitialsAvatar,
  exactTime,
} from "@/components/admin/inquiry-detail";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ActivityLog } from "@/types";

type Range = "all" | "today" | "7d" | "30d";

const VERB_TONES: { test: RegExp; cls: string }[] = [
  {
    test: /delet/i,
    cls: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/30",
  },
  {
    test: /unpublish|archiv|deactivat|unfeat/i,
    cls: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30",
  },
  {
    test: /publish/i,
    cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
  {
    test: /creat|clon/i,
    cls: "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-300 dark:ring-green-400/30",
  },
  {
    test: /updat|chang|edit|featur/i,
    cls: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30",
  },
];

function verbClass(action: string): string {
  return VERB_TONES.find((v) => v.test.test(action))?.cls ??
    "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30";
}

export interface AdminActivityViewProps {
  activity: ActivityLog[];
}

export function AdminActivityView({ activity }: AdminActivityViewProps) {
  const { toast } = useToast();

  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [range, setRange] = useState<Range>("all");
  const [exporting, setExporting] = useState(false);

  const sorted = useMemo(
    () => [...activity].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [activity]
  );

  const modules = useMemo(
    () => Array.from(new Set(activity.map((l) => l.module))).sort(),
    [activity]
  );
  const actions = useMemo(
    () => Array.from(new Set(activity.map((l) => l.action))).sort(),
    [activity]
  );

  const filtered = useMemo(() => {
    const now = new Date();
    const cutoff =
      range === "today"
        ? null
        : range === "7d"
          ? subDays(now, 7)
          : range === "30d"
            ? subDays(now, 30)
            : null;
    return sorted.filter((l) => {
      if (moduleFilter !== "all" && l.module !== moduleFilter) return false;
      if (actionFilter !== "all" && l.action !== actionFilter) return false;
      if (range === "today") {
        try {
          return isToday(new Date(l.createdAt));
        } catch {
          return false;
        }
      }
      if (cutoff) {
        try {
          return new Date(l.createdAt) >= cutoff;
        } catch {
          return true;
        }
      }
      return true;
    });
  }, [sorted, moduleFilter, actionFilter, range]);

  const countSince = (days: number) => {
    const cutoff = subDays(new Date(), days);
    return activity.filter((l) => {
      try {
        return new Date(l.createdAt) >= cutoff;
      } catch {
        return false;
      }
    }).length;
  };
  const todayCount = activity.filter((l) => {
    try {
      return isToday(new Date(l.createdAt));
    } catch {
      return false;
    }
  }).length;

  const hasActiveFilters =
    moduleFilter !== "all" || actionFilter !== "all" || range !== "all";

  const clearFilters = () => {
    setModuleFilter("all");
    setActionFilter("all");
    setRange("all");
  };

  const exportCsv = () => {
    setExporting(true);
    setTimeout(() => {
      const header = ["Actor", "Action", "Module", "Target", "Description", "Timestamp"];
      const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
      const lines = [header, ...filtered.map((l) => [l.actor, l.action, l.module, l.target, l.description, l.createdAt])];
      const csv = lines.map((row) => row.map(escape).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stioos-activity-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExporting(false);
      toast({
        title: "Export complete",
        description: `${filtered.length} activity records exported to CSV.`,
      });
    }, 500);
  };

  const columns: Column<ActivityLog>[] = [
    {
      key: "actor",
      header: "Actor",
      sortable: true,
      sortValue: (r) => r.actor,
      render: (r) => (
        <div className="flex items-center gap-3">
          <InitialsAvatar name={r.actor} />
          <span className="truncate text-sm font-medium text-foreground">{r.actor}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      sortValue: (r) => r.action,
      render: (r) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
            verbClass(r.action)
          )}
        >
          {r.action}
        </span>
      ),
    },
    {
      key: "module",
      header: "Module",
      hideBelow: "sm",
      sortable: true,
      sortValue: (r) => r.module,
      render: (r) => <span className="whitespace-nowrap text-sm text-muted-foreground">{r.module}</span>,
    },
    {
      key: "target",
      header: "Target",
      hideBelow: "md",
      sortable: true,
      sortValue: (r) => r.target,
      render: (r) => (
        <span className="block max-w-[200px] truncate text-sm font-semibold text-foreground" title={r.target}>
          {r.target}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      hideBelow: "lg",
      render: (r) => (
        <span className="block max-w-[340px] truncate text-sm text-muted-foreground" title={r.description}>
          {r.description}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "When",
      sortable: true,
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span
          className="whitespace-nowrap text-sm text-muted-foreground"
          title={exactTime(r.createdAt)}
        >
          {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
        </span>
      ),
    },
  ];

  const rangeButtons: { id: Range; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "7d", label: "7d" },
    { id: "30d", label: "30d" },
    { id: "all", label: "All" },
  ];

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        description="Full audit trail of every change made across the platform."
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={exporting || filtered.length === 0}>
            <Download className="h-4 w-4" />
            {exporting ? "Exporting…" : "Export CSV"}
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Events" value={activity.length} icon="History" tone="blue" onClick={() => setRange("all")} />
        <StatCard label="Today" value={todayCount} icon="Activity" tone="green" onClick={() => setRange("today")} />
        <StatCard label="Last 7 days" value={countSince(7)} icon="TrendingUp" tone="amber" onClick={() => setRange("7d")} />
        <StatCard label="Last 30 days" value={countSince(30)} icon="BarChart3" tone="violet" onClick={() => setRange("30d")} />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["actor", "target", "description"]}
        searchPlaceholder="Search actor, target, description…"
        pageSize={12}
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="h-9 w-[170px]" aria-label="Filter by module">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modules</SelectItem>
                {modules.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by action">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {actions.map((a) => (
                  <SelectItem key={a} value={a} className="capitalize">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div
              role="group"
              aria-label="Date range filter"
              className="inline-flex overflow-hidden rounded-md border"
            >
              {rangeButtons.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setRange(b.id)}
                  aria-pressed={range === b.id}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    range === b.id
                      ? "bg-slate-900 text-white"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-9" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        }
        emptyState={
          <EmptyState
            icon={History}
            title="No activity matches your filters"
            description="Adjust the module, action, or date range filters to see more of the audit trail."
            action={hasActiveFilters ? { label: "Clear filters", onClick: clearFilters } : undefined}
            className="border-0 bg-transparent"
          />
        }
      />
    </div>
  );
}
