"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import type { ActivityLog, Inquiry, Service } from "@/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { AccentTile } from "@/components/shared/icon";
import { EntityStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Globe,
  Inbox,
  Layers,
  Mail,
  Package,
  Plus,
  ShieldCheck,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * date-fns throws on invalid dates (RangeError: Invalid time value) —
 * persisted demo data may carry a missing or garbled timestamp. Degrade
 * to null instead of crashing the whole dashboard.
 */
function safeRelativeTime(value: unknown): string | null {
  try {
    const d = new Date(value as string);
    if (Number.isNaN(d.getTime())) return null;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return null;
  }
}

// ------------------------------------------------------------
// Local stat card — mirrors shared StatCard visuals but accepts
// lucide components directly, so the dashboard does not depend
// on the shared string-based Icon allowlist.
// ------------------------------------------------------------

type Tone = "blue" | "green" | "amber" | "violet" | "red";

const TONES: Record<Tone, string> = {
  blue: "bg-blue-600/10 text-blue-600 dark:text-blue-400",
  green: "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  violet: "bg-violet-600/10 text-violet-600 dark:text-violet-400",
  red: "bg-red-600/10 text-red-600 dark:text-red-400",
};

function DashStat({
  label,
  value,
  icon: Icon,
  tone,
  trend,
  trendUp,
  onClick,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone: Tone;
  trend?: string;
  trendUp?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-card p-5 text-left transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", TONES[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      </div>
      {trend && (
        <span className={cn("shrink-0 text-xs font-semibold", trendUp ? "text-emerald-600" : "text-red-500")}>
          {trendUp ? "▲" : "▼"} {trend}
        </span>
      )}
    </button>
  );
}

/**
 * Lazy charts — recharts is the heaviest dependency in the app, so the
 * admin landing page loads it as a separate client chunk only after the
 * page itself has painted (see src/app/admin/admin-charts.tsx).
 */
const AdminCharts = dynamic(
  () => import("./admin-charts").then((m) => m.AdminCharts),
  {
    ssr: false,
    loading: () => (
      <section className="grid gap-4 lg:grid-cols-3" aria-busy="true" aria-label="Loading charts">
        <div className="h-[360px] animate-pulse rounded-lg border bg-card p-5 lg:col-span-2" />
        <div className="h-[360px] animate-pulse rounded-lg border bg-card p-5" />
      </section>
    ),
  }
);

const TYPE_BADGE: Record<string, { label: string; tone: "blue" | "amber" | "violet" }> = {
  service_request: { label: "Service request", tone: "blue" },
  contact: { label: "Contact", tone: "amber" },
  consultation: { label: "Consultation", tone: "violet" },
};

const emptySubscribe = () => () => {};

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

function CardHead({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

// ------------------------------------------------------------
// Dashboard
// ------------------------------------------------------------

export default function AdminDashboardPage() {
  const router = useRouter();
  const services = useAppStore((s) => s.services);
  const categories = useAppStore((s) => s.categories);
  const admins = useAppStore((s) => s.admins);
  const users = useAppStore((s) => s.users);
  const inquiries = useAppStore((s) => s.inquiries);
  const requests = useAppStore((s) => s.requests);
  const activityLogs = useAppStore((s) => s.activityLogs);

  // Date label via useSyncExternalStore: empty server snapshot, real value
  // applied right after hydration — no effect setState, no hydration mismatch
  const dateLabel = useSyncExternalStore(
    emptySubscribe,
    () => format(new Date(), "EEEE, d MMMM yyyy"),
    () => ""
  );

  const publishedCount = services.filter((s) => s.status === "published").length;
  const draftCount = services.filter((s) => s.status === "draft").length;
  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === "in_progress").length;

  const activityData = useMemo(() => {
    // Deterministic 12-week series derived from live inquiry volume
    const base = Math.max(4, Math.round(inquiries.length * 0.85));
    return Array.from({ length: 12 }).map((_, i) => ({
      week: i + 1,
      inquiries: Math.max(2, base + Math.round(2.2 * i + 3.5 * Math.sin(i * 1.7))),
      requests: Math.max(1, Math.round(base * 0.55 + 1.6 * i + 4 * Math.cos(i * 1.15))),
    }));
  }, [inquiries.length]);

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>();
    services.forEach((s) => {
      const cat = categories.find((c) => c.id === s.categoryId);
      const name = cat?.name ?? "Uncategorized";
      counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const data = sorted.slice(0, 6).map(([name, value]) => ({ name, value }));
    const otherCount = sorted.slice(6).reduce((sum, [, n]) => sum + n, 0);
    if (otherCount > 0) data.push({ name: "Other", value: otherCount });
    return data;
  }, [services, categories]);

  const recentInquiries = useMemo<Inquiry[]>(
    () => [...inquiries].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5),
    [inquiries]
  );

  const recentServices = useMemo<Service[]>(
    () => [...services].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5),
    [services]
  );

  const recentActivity = useMemo<ActivityLog[]>(
    () => [...activityLogs].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 6),
    [activityLogs]
  );

  const totalCategoryServices = categoryData.reduce((sum, d) => sum + d.value, 0) || 1;

  const quickActions: { label: string; icon: LucideIcon; href: string }[] = [
    { label: "Add Service", icon: Plus, href: "/admin/services/new" },
    { label: "Review Requests", icon: Inbox, href: "/admin/service-requests" },
    { label: "View Orders", icon: Package, href: "/admin/orders" },
    { label: "Create User", icon: UserPlus, href: "/admin/users?new=1" },
    { label: "Open Inquiries", icon: Mail, href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={
          dateLabel ? `Platform overview — ${dateLabel}` : "Platform overview"
        }
        actions={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="h-4 w-4" />
              Add Service
            </Link>
          </Button>
        }
      />

      {/* Stat cards */}
      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <DashStat
          label="Total Services"
          value={services.length}
          icon={Layers}
          tone="blue"
          trend="+12%"
          trendUp
          onClick={() => router.push("/admin/services")}
        />
        <DashStat
          label="Published"
          value={publishedCount}
          icon={Globe}
          tone="green"
          trend="+8%"
          trendUp
          onClick={() => router.push("/admin/services")}
        />
        <DashStat
          label="Drafts"
          value={draftCount}
          icon={FileText}
          tone="amber"
          onClick={() => router.push("/admin/services")}
        />
        <DashStat
          label="Service Requests"
          value={requests.length}
          icon={Inbox}
          tone="violet"
          onClick={() => router.push("/admin/service-requests")}
        />
        <DashStat
          label="Admins"
          value={admins.length}
          icon={ShieldCheck}
          tone="blue"
          onClick={() => router.push("/admin/users")}
        />
        <DashStat
          label="Users"
          value={users.length}
          icon={Users}
          tone="green"
          trend="+5%"
          trendUp
          onClick={() => router.push("/admin/users")}
        />
        <DashStat
          label="New Inquiries"
          value={newInquiriesCount}
          icon={Mail}
          tone="red"
          trend="+2"
          trendUp
          onClick={() => router.push("/admin/inquiries")}
        />
        <DashStat
          label="Pending Requests"
          value={pendingInquiriesCount}
          icon={Inbox}
          tone="blue"
          trend="-1"
          trendUp={false}
          onClick={() => router.push("/admin/inquiries")}
        />
      </section>

      {/* Charts — lazy-loaded recharts chunk (see admin-charts.tsx) */}
      <AdminCharts
        activityData={activityData}
        categoryData={categoryData}
        totalServices={services.length}
        totalCategoryServices={totalCategoryServices}
      />

      {/* Recent lists */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Recent inquiries */}
        <div className="rounded-lg border bg-card p-5">
          <CardHead title="Recent Inquiries" description="Latest demand across the marketplace" />
          <div className="space-y-1">
            {recentInquiries.map((inq) => {
              const badge = TYPE_BADGE[inq.type] ?? TYPE_BADGE.service_request;
              return (
                <button
                  key={inq.id}
                  type="button"
                  onClick={() => router.push("/admin/inquiries")}
                  className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/60"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">{inq.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {inq.company || "Independent"}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5">
                      <StatusBadge tone={badge.tone} dot={false} className="text-[10px]">
                        {badge.label}
                      </StatusBadge>
                      <EntityStatusBadge status={inq.status} className="text-[10px]" />
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {safeRelativeTime(inq.createdAt) ?? "Recently"}
                    </span>
                  </span>
                </button>
              );
            })}
            {recentInquiries.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No inquiries yet.</p>
            )}
          </div>
          <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
            <Link href="/admin/inquiries">View all inquiries</Link>
          </Button>
        </div>

        {/* Recently added services */}
        <div className="rounded-lg border bg-card p-5">
          <CardHead title="Recently Added Services" description="Newest entries in the catalog" />
          <div className="space-y-1">
            {recentServices.map((svc) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => router.push(`/admin/services?focus=${svc.id}`)}
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/60"
              >
                <AccentTile gradient={svc.accent} icon={svc.icon} className="h-9 w-9 shrink-0 rounded-md" iconClass="h-4 w-4" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{svc.name}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {safeRelativeTime(svc.updatedAt)
                      ? `Updated ${safeRelativeTime(svc.updatedAt)}`
                      : "Recently added"}
                  </span>
                </span>
                <EntityStatusBadge status={svc.status} className="shrink-0 text-[10px]" />
              </button>
            ))}
            {recentServices.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No services yet.</p>
            )}
          </div>
          <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
            <Link href="/admin/services">View all services</Link>
          </Button>
        </div>

        {/* Recent activity */}
        <div className="rounded-lg border bg-card p-5">
          <CardHead title="Recent Activity" description="Latest actions across the platform" />
          <ul className="space-y-3">
            {recentActivity.map((log) => (
              <li key={log.id} className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-[10px] font-bold text-white">
                  {initialsOf(log.actor)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] leading-snug">
                    <span className="font-semibold text-foreground">{log.actor}</span>{" "}
                    <span className="text-muted-foreground">{log.action}</span>{" "}
                    <span className="font-medium text-foreground">{log.target}</span>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">
                    {log.module} · {safeRelativeTime(log.createdAt) ?? "Recently"}
                  </span>
                </span>
              </li>
            ))}
            {recentActivity.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">No activity yet.</li>
            )}
          </ul>
          <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
            <Link href="/admin/activity">View full activity log</Link>
          </Button>
        </div>
      </section>

      {/* Quick actions */}
      <section className="rounded-lg border bg-card p-5" aria-label="Quick actions">
        <CardHead title="Quick Actions" description="Jump straight into the most common workflows" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="justify-start"
              onClick={() => router.push(action.href)}
            >
              <action.icon className="h-4 w-4 text-muted-foreground" />
              {action.label}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
