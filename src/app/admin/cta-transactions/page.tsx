"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  Eye,
  Inbox,
  MessageSquare,
  MoreHorizontal,
  PhoneCall,
  PlayCircle,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EntityStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/components/shared/confirm-dialog";
import {
  InitialsAvatar,
  InquiryDetailSheet,
  InquiryTypeBadge,
  exactTime,
  relTime,
} from "@/components/admin/inquiry-detail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Inquiry, InquiryStatus, InquiryType } from "@/types";

const TAB_TYPES: Record<string, InquiryType | undefined> = {
  all: undefined,
  quotes: "quote",
  service_requests: "service_request",
  consultations: "consultation",
  contact: "contact",
};

const STATUS_CHIPS: { status: InquiryStatus | "all"; label: string }[] = [
  { status: "all", label: "All" },
  { status: "new", label: "New" },
  { status: "in_progress", label: "In Progress" },
  { status: "contacted", label: "Contacted" },
  { status: "closed", label: "Closed" },
];

const CHIP_ACTIVE: Record<string, string> = {
  all: "bg-foreground text-background ring-foreground",
  new: "bg-blue-600 text-white ring-blue-600",
  in_progress: "bg-blue-600 text-white ring-blue-600",
  contacted: "bg-violet-600 text-white ring-violet-600",
  closed: "bg-slate-500 text-white ring-slate-500",
};

const TYPE_ACCENT: Record<string, "blue" | "green" | "amber" | "violet" | "red"> = {
  total: "amber",
  quote: "amber",
  service_request: "blue",
  consultation: "violet",
  contact: "green",
};

/** Conversion rate = share of CTAs that have moved past the initial "new"
 *  stage (contacted + closed counted as converted). Falls back to 0% on empty. */
function conversionRate(rows: Inquiry[]): number {
  if (rows.length === 0) return 0;
  const converted = rows.filter(
    (r) => r.status === "contacted" || r.status === "closed"
  ).length;
  return Math.round((converted / rows.length) * 100);
}

/** Local icon lookup for the few names the CTA stat cards use — avoids
 *  pulling the global Icon registry into this client bundle twice. */
function CtaIcon({ name, className }: { name: string; className?: string }) {
  const map: Record<string, typeof Inbox> = {
    Inbox,
    Download,
    MessageSquare,
    PhoneCall,
    CheckCircle2,
  };
  const Cmp = map[name] ?? Inbox;
  return <Cmp className={className} aria-hidden="true" />;
}

/** Summary stat card showing a count, a conversion-rate sub-line, and an
 *  optional click-to-filter handler. Mirrors the look of the shared StatCard
 *  but carries the extra conversion metric the CTA console needs. */
function CtaStatCard({
  label,
  value,
  rate,
  tone,
  icon,
  onClick,
}: {
  label: string;
  value: number;
  rate: number;
  tone: "blue" | "green" | "amber" | "violet" | "red";
  icon: string;
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
        <CtaIcon name={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">{value}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Conversion{" "}
          <span className="font-semibold text-foreground">{rate}%</span>
        </p>
      </div>
    </button>
  );
}

function CtaTransactionsContent() {
  const { toast } = useToast();

  const inquiries = useAppStore((s) => s.inquiries);
  const updateInquiryStatus = useAppStore((s) => s.updateInquiryStatus);
  const deleteInquiry = useAppStore((s) => s.deleteInquiry);

  const confirm = useConfirmDialog();

  const [tab, setTab] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const typeFilter = TAB_TYPES[tab];

  // Per-type buckets for the summary cards
  const buckets = useMemo(() => {
    const byType = (t: InquiryType) => inquiries.filter((q) => q.type === t);
    return {
      total: inquiries,
      quotes: byType("quote"),
      service_requests: byType("service_request"),
      consultations: byType("consultation"),
      contact: byType("contact"),
    };
  }, [inquiries]);

  // Scoped = within the active tab (used by status chips + table)
  const scoped = useMemo(
    () => inquiries.filter((q) => (typeFilter ? q.type === typeFilter : true)),
    [inquiries, typeFilter]
  );

  const rows = useMemo(
    () =>
      scoped
        .filter((q) => (statusFilter === "all" ? true : q.status === statusFilter))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [scoped, statusFilter]
  );

  const countBy = (s: InquiryStatus) => scoped.filter((q) => q.status === s).length;

  const active = activeId ? inquiries.find((q) => q.id === activeId) ?? null : null;

  const openConfirmDelete = (inq: Inquiry) => {
    confirm.confirm({
      title: "Delete CTA transaction?",
      description: `This permanently deletes the ${inq.type.replace(/_/g, " ")} submission from ${inq.name} (${inq.company || "Independent"}). This action cannot be undone.`,
      confirmLabel: "Delete transaction",
      destructive: true,
      onConfirm: () => {
        deleteInquiry(inq.id);
        toast({
          title: "Transaction deleted",
          description: `CTA from ${inq.name} was permanently removed.`,
        });
      },
    });
  };

  const handleStatus = (inq: Inquiry, status: InquiryStatus) => {
    updateInquiryStatus(inq.id, status);
    toast({
      title: "Status updated",
      description: `CTA from ${inq.name} marked as ${status.replace("_", " ")}.`,
    });
  };

  const handleExport = () => {
    toast({
      title: "Export prepared",
      description: `${rows.length} CTA transaction${rows.length === 1 ? "" : "s"} ready for download (demo).`,
    });
  };

  const columns: Column<Inquiry>[] = [
    {
      key: "id",
      header: "ID",
      hideBelow: "md",
      render: (r) => (
        <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground" title={exactTime(r.createdAt)}>
          {relTime(r.createdAt)}
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-3">
          <InitialsAvatar name={r.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      hideBelow: "lg",
      sortable: true,
      sortValue: (r) => r.company,
      render: (r) => <span className="text-sm">{r.company || "—"}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (r) => <InquiryTypeBadge type={r.type} />,
    },
    {
      key: "serviceName",
      header: "Service",
      hideBelow: "lg",
      sortable: true,
      sortValue: (r) => r.serviceName ?? "",
      render: (r) => (
        <span
          className={cn(
            "block max-w-[200px] truncate text-sm",
            r.serviceName ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {r.serviceName || "—"}
        </span>
      ),
    },
    {
      key: "budgetRange",
      header: "Budget",
      hideBelow: "xl",
      render: (r) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {r.budgetRange || "—"}
        </span>
      ),
    },
    {
      key: "timeline",
      header: "Timeline",
      hideBelow: "xl",
      render: (r) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {r.timeline || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <EntityStatusBadge status={r.status} />,
    },
  ];

  const rowActions = (r: Inquiry) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={`Actions for CTA from ${r.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Transaction actions
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setActiveId(r.id)}>
          <Eye className="h-4 w-4" /> View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={r.status === "in_progress"}
          onClick={() => handleStatus(r, "in_progress")}
        >
          <PlayCircle className="h-4 w-4" /> Mark In Progress
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={r.status === "contacted"}
          onClick={() => handleStatus(r, "contacted")}
        >
          <PhoneCall className="h-4 w-4" /> Mark Contacted
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={r.status === "closed"}
          onClick={() => handleStatus(r, "closed")}
        >
          <CheckCircle2 className="h-4 w-4" /> Close
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={r.status === "new"}
          onClick={() => handleStatus(r, "new")}
        >
          <RefreshCcw className="h-4 w-4" /> Reopen as New
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openConfirmDelete(r)}
          className="text-red-600 focus:text-red-600 focus:bg-destructive/10 dark:text-red-400 dark:focus:text-red-400"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div>
      <PageHeader
        title="CTA Transactions"
        description="Consolidated console for every call-to-action submitted across the public site — quotes, service requests, consultations, and contact inquiries — tracked end-to-end."
        actions={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        }
      />

      {/* Summary stat cards — counts + conversion rates */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <CtaStatCard
          label="Total CTAs"
          value={buckets.total.length}
          rate={conversionRate(buckets.total)}
          tone={TYPE_ACCENT.total}
          icon="Inbox"
          onClick={() => {
            setTab("all");
            setStatusFilter("all");
          }}
        />
        <CtaStatCard
          label="Quotes"
          value={buckets.quotes.length}
          rate={conversionRate(buckets.quotes)}
          tone={TYPE_ACCENT.quote}
          icon="Download"
          onClick={() => {
            setTab("quotes");
            setStatusFilter("all");
          }}
        />
        <CtaStatCard
          label="Service Requests"
          value={buckets.service_requests.length}
          rate={conversionRate(buckets.service_requests)}
          tone={TYPE_ACCENT.service_request}
          icon="MessageSquare"
          onClick={() => {
            setTab("service_requests");
            setStatusFilter("all");
          }}
        />
        <CtaStatCard
          label="Consultations"
          value={buckets.consultations.length}
          rate={conversionRate(buckets.consultations)}
          tone={TYPE_ACCENT.consultation}
          icon="PhoneCall"
          onClick={() => {
            setTab("consultations");
            setStatusFilter("all");
          }}
        />
        <CtaStatCard
          label="Contact"
          value={buckets.contact.length}
          rate={conversionRate(buckets.contact)}
          tone={TYPE_ACCENT.contact}
          icon="CheckCircle2"
          onClick={() => {
            setTab("contact");
            setStatusFilter("all");
          }}
        />
      </div>

      {/* Tabs by CTA type */}
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v);
          setStatusFilter("all");
        }}
        className="space-y-4"
      >
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          {[
            { id: "all", label: "All" },
            { id: "quotes", label: "Quotes" },
            { id: "service_requests", label: "Service Requests" },
            { id: "consultations", label: "Consultations" },
            { id: "contact", label: "Contact" },
          ].map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t.label}
              <span className="ml-1.5 rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold data-[state=active]:bg-primary-foreground/20">
                {inquiries.filter((q) =>
                  TAB_TYPES[t.id] ? q.type === TAB_TYPES[t.id] : true
                ).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Status filter chips */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUS_CHIPS.map((chip) => {
          const count =
            chip.status === "all" ? scoped.length : countBy(chip.status);
          const isActive = statusFilter === chip.status;
          return (
            <button
              key={chip.status}
              type="button"
              onClick={() => setStatusFilter(chip.status)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
                isActive
                  ? CHIP_ACTIVE[chip.status]
                  : "bg-card text-muted-foreground ring-border hover:text-foreground"
              )}
            >
              {chip.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-bold",
                  isActive ? "bg-white/20 dark:bg-black/20" : "bg-muted"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["name", "email", "company", "serviceName"]}
        searchPlaceholder="Search name, email, company, service…"
        pageSize={8}
        rowActions={rowActions}
        onRowClick={(r) => setActiveId(r.id)}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <Inbox className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No CTA transactions match this view</p>
            <p className="text-sm text-muted-foreground">
              {statusFilter !== "all"
                ? "Try a different status chip above."
                : "New CTA submissions from the public site will appear here."}
            </p>
          </div>
        }
      />

      {/* Status legend */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Status legend
        </p>
        <StatusBadge tone="blue">New</StatusBadge>
        <StatusBadge tone="blue">In Progress</StatusBadge>
        <StatusBadge tone="violet">Contacted</StatusBadge>
        <StatusBadge tone="gray">Closed</StatusBadge>
        <p className="ml-auto text-[11px] text-muted-foreground">
          Conversion = share of CTAs that reached &quot;Contacted&quot; or &quot;Closed&quot;.
        </p>
      </div>

      <InquiryDetailSheet
        inquiry={active}
        open={!!active}
        onOpenChange={(o) => !o && setActiveId(null)}
      />
      <ConfirmDialog state={confirm.state} onClose={confirm.close} />
    </div>
  );
}

export default function AdminCtaTransactionsPage() {
  return <CtaTransactionsContent />;
}
