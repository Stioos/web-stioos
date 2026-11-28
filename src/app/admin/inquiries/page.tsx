"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  Inbox,
  MoreHorizontal,
  PhoneCall,
  PlayCircle,
  RefreshCcw,
  Trash2,
  XCircle,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EntityStatusBadge } from "@/components/shared/status-badge";
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
import { Skeleton } from "@/components/ui/skeleton";
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
import { MarketplaceSectionLinks } from "@/components/admin/marketplace-section-links";

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

const CHIP_ACTIVE: Record<InquiryStatus | "all", string> = {
  all: "bg-foreground text-background ring-foreground",
  new: "bg-blue-600 text-white ring-blue-600",
  in_progress: "bg-violet-600 text-white ring-violet-600",
  contacted: "bg-amber-600 text-white ring-amber-600",
  closed: "bg-slate-500 text-white ring-slate-500",
};

function InquiriesContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");
  const typeParam = searchParams.get("type");
  const initialTab = typeParam && TAB_TYPES[typeParam] ? typeParam : "all";
  // Keyed by the focus param so ?focus={id} opens the sheet on mount and
  // re-navigation re-triggers it — without setState-in-effect patterns.
  return <InquiryQueue key={`${initialTab}-${focusId ?? "none"}`} focusId={focusId} initialTab={initialTab} />;
}

function InquiryQueue({
  focusId,
  initialTab,
}: {
  focusId: string | null;
  initialTab: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const inquiries = useAppStore((s) => s.inquiries);
  const updateInquiryStatus = useAppStore((s) => s.updateInquiryStatus);
  const deleteInquiry = useAppStore((s) => s.deleteInquiry);

  const confirm = useConfirmDialog();

  const [tab, setTab] = useState<string>(initialTab);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(focusId);

  const closeSheet = () => {
    setActiveId(null);
    if (focusId) {
      router.replace(
        initialTab === "all" ? "/admin/inquiries" : `/admin/inquiries?type=${initialTab}`,
        { scroll: false }
      );
    }
  };

  const typeFilter = TAB_TYPES[tab];
  const consultationOnly = initialTab === "consultations";
  const rows = useMemo(() => {
    return inquiries
      .filter((q) => (typeFilter ? q.type === typeFilter : true))
      .filter((q) => (statusFilter === "all" ? true : q.status === statusFilter))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [inquiries, typeFilter, statusFilter]);

  const scoped = useMemo(
    () => inquiries.filter((q) => (typeFilter ? q.type === typeFilter : true)),
    [inquiries, typeFilter]
  );
  const countBy = (s: InquiryStatus) => scoped.filter((q) => q.status === s).length;

  const active = activeId
    ? inquiries.find((q) => q.id === activeId) ?? null
    : null;

  const openConfirmDelete = (inq: Inquiry) => {
    confirm.confirm({
      title: "Delete inquiry?",
      description: `This permanently deletes the inquiry from ${inq.name} (${inq.company || "Independent"}). This action cannot be undone.`,
      confirmLabel: "Delete inquiry",
      destructive: true,
      onConfirm: () => {
        deleteInquiry(inq.id);
        toast({
          title: "Inquiry deleted",
          description: `Inquiry from ${inq.name} was permanently removed.`,
        });
      },
    });
  };

  const handleStatus = (inq: Inquiry, status: InquiryStatus) => {
    updateInquiryStatus(inq.id, status);
    toast({
      title: "Status updated",
      description: `Inquiry from ${inq.name} marked as ${status.replace("_", " ")}.`,
    });
  };

  const columns: Column<Inquiry>[] = [
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
      header: "Related Service",
      hideBelow: "md",
      sortable: true,
      sortValue: (r) => r.serviceName ?? "",
      render: (r) => (
        <span className={cn("block max-w-[200px] truncate text-sm", r.serviceName ? "text-foreground" : "text-muted-foreground")}>
          {r.serviceName || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <EntityStatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Received",
      hideBelow: "sm",
      sortable: true,
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground" title={exactTime(r.createdAt)}>
          {relTime(r.createdAt)}
        </span>
      ),
    },
  ];

  const rowActions = (r: Inquiry) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for inquiry from ${r.name}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Inquiry actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(`/admin/inquiries/${r.id}${consultationOnly ? "?type=consultations" : ""}`)}>
          <Eye className="h-4 w-4" /> View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={r.status === "in_progress"} onClick={() => handleStatus(r, "in_progress")}>
          <PlayCircle className="h-4 w-4" /> Mark In Progress
        </DropdownMenuItem>
        <DropdownMenuItem disabled={r.status === "contacted"} onClick={() => handleStatus(r, "contacted")}>
          <PhoneCall className="h-4 w-4" /> Mark Contacted
        </DropdownMenuItem>
        <DropdownMenuItem disabled={r.status === "closed"} onClick={() => handleStatus(r, "closed")}>
          <CheckCircle2 className="h-4 w-4" /> Close
        </DropdownMenuItem>
        <DropdownMenuItem disabled={r.status === "new"} onClick={() => handleStatus(r, "new")}>
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
      <div className="mb-6 grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard compact label="New" value={countBy("new")} icon="Inbox" tone="blue" onClick={() => setStatusFilter("new")} />
          <StatCard compact label="In Progress" value={countBy("in_progress")} icon="RefreshCw" tone="violet" onClick={() => setStatusFilter("in_progress")} />
          <StatCard compact label="Contacted" value={countBy("contacted")} icon="PhoneCall" tone="amber" onClick={() => setStatusFilter("contacted")} />
          <StatCard compact label="Closed" value={countBy("closed")} icon="CheckCircle2" tone="green" onClick={() => setStatusFilter("closed")} />
        </div>
        <MarketplaceSectionLinks current={consultationOnly ? "consultations" : "requests"} />
      </div>

      {!consultationOnly && (
        <Tabs value={tab} onValueChange={(v) => { setTab(v); setStatusFilter("all"); }} className="space-y-4">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            {[
              { id: "all", label: "All" },
              { id: "quotes", label: "Quotes" },
              { id: "service_requests", label: "Service Requests" },
              { id: "consultations", label: "Consultations" },
              { id: "contact", label: "Contact" },
            ].map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t.label}
                <span className="ml-1.5 rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold data-[state=active]:bg-primary-foreground/20">
                  {inquiries.filter((q) => (TAB_TYPES[t.id] ? q.type === TAB_TYPES[t.id] : true)).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Stat chips per tab — double as status filters */}
      {!consultationOnly && <StatusChips scoped={scoped} statusFilter={statusFilter} countBy={countBy} onChange={setStatusFilter} />}

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["name", "email", "company", "serviceName"]}
        searchPlaceholder="Search name, email, company, service…"
        pageSize={8}
        stickyPageHeader={consultationOnly}
        toolbar={consultationOnly ? <StatusChips scoped={scoped} statusFilter={statusFilter} countBy={countBy} onChange={setStatusFilter} /> : undefined}
        rowActions={rowActions}
        onRowClick={(r) => router.push(`/admin/inquiries/${r.id}${consultationOnly ? "?type=consultations" : ""}`)}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <Inbox className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No inquiries match this view</p>
            <p className="text-sm text-muted-foreground">
              {statusFilter !== "all"
                ? "Try a different status chip above."
                : "New inquiries from the public site will appear here."}
            </p>
          </div>
        }
      />

      <InquiryDetailSheet inquiry={active} open={!!active} onOpenChange={(o) => !o && closeSheet()} />
      <ConfirmDialog state={confirm.state} onClose={confirm.close} />
    </div>
  );
}

function StatusChips({
  scoped,
  statusFilter,
  countBy,
  onChange,
}: {
  scoped: Inquiry[];
  statusFilter: InquiryStatus | "all";
  countBy: (status: InquiryStatus) => number;
  onChange: (status: InquiryStatus | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {STATUS_CHIPS.map((chip) => {
        const count = chip.status === "all" ? scoped.length : countBy(chip.status);
        const isActive = statusFilter === chip.status;
        return (
          <button key={chip.status} type="button" onClick={() => onChange(chip.status)} aria-pressed={isActive} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors", isActive ? CHIP_ACTIVE[chip.status] : "bg-card text-muted-foreground ring-border hover:text-foreground")}>
            {chip.label}
            <span className={cn("rounded-full px-1.5 text-[10px] font-bold", isActive ? "bg-white/20 dark:bg-black/20" : "bg-muted")}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-9 w-64" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[74px] rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-72 w-full rounded-lg" />
        </div>
      }
    >
      <InquiriesContent />
    </Suspense>
  );
}
