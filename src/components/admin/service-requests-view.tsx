"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  Building2,
  CircleDollarSign,
  ExternalLink,
  Inbox,
  Layers,
  Mail,
  Phone,
  Timer,
  User,
} from "lucide-react";

import {
  KIND_LABELS,
  REQUEST_KIND_DEFS,
  REQUEST_STATUS_LABELS,
} from "@/lib/request-kinds";
import type {
  Inquiry,
  InquiryStatus,
  InquiryType,
  MarketRequest,
  MarketRequestStatus,
  RequestKind,
} from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import type { Column } from "@/components/shared/data-table";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import {
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

const REQUEST_STATUS_OPTIONS = Object.entries(REQUEST_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as MarketRequestStatus, label })
);

const KIND_OPTIONS = Object.entries(KIND_LABELS).map(([value, label]) => ({
  value: value as RequestKind,
  label,
}));

/** Timeline dot color per request status. */
const DOT_TONE: Record<MarketRequestStatus, string> = {
  open: "bg-amber-500",
  in_review: "bg-sky-500",
  in_progress: "bg-teal-500",
  fulfilled: "bg-emerald-500",
  rejected: "bg-rose-500",
  closed: "bg-slate-400",
};

const INQUIRY_STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

/** Website enquiry types surfaced in the second tab. */
const WEBSITE_TYPES: InquiryType[] = ["service_request", "quote", "consultation"];

const formatStamp = (iso: string) => format(new Date(iso), "MMM d, yyyy 'at' HH:mm");

const kindOf = (r: MarketRequest): RequestKind => r.kind ?? "service";

// ------------------------------------------------------------
// Page shell — focus param opens the request sheet on mount
// ------------------------------------------------------------

export interface ServiceRequestsViewProps {
  requests: MarketRequest[];
  inquiries: Inquiry[];
}

export function ServiceRequestsView({
  requests,
  inquiries,
}: ServiceRequestsViewProps) {
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
      <RequestsContent requests={requests} inquiries={inquiries} />
    </Suspense>
  );
}

function RequestsContent({
  requests,
  inquiries,
}: {
  requests: MarketRequest[];
  inquiries: Inquiry[];
}) {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");
  // Keyed by the focus param so ?focus={id} opens the sheet on mount and
  // re-navigation re-triggers it — without setState-in-effect patterns.
  return (
    <RequestsHub
      key={focusId ?? "none"}
      focusId={focusId}
      requests={requests}
      inquiries={inquiries}
    />
  );
}

function RequestsHub({
  focusId,
  requests,
  inquiries,
}: {
  focusId: string | null;
  requests: MarketRequest[];
  inquiries: Inquiry[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [tab, setTab] = useState<string>("pipeline");
  const [statusFilter, setStatusFilter] = useState<MarketRequestStatus | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(focusId);
  const [busyId, setBusyId] = useState<string | null>(null);

  const closeSheet = () => {
    setActiveId(null);
    if (focusId) router.replace("/admin/service-requests", { scroll: false });
  };

  const active = activeId
    ? requests.find((r) => r.id === activeId) ?? null
    : null;

  const countBy = (status: MarketRequestStatus) =>
    requests.filter((r) => r.status === status).length;

  const websiteEnquiries = useMemo(
    () => inquiries.filter((q) => WEBSITE_TYPES.includes(q.type)),
    [inquiries]
  );

  // ---- mutation: PATCH /api/requests/[id] { status, note } ----
  const updateStatus = async (id: string, status: MarketRequestStatus, note: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note.trim() || undefined }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status.");
      }
      const target = requests.find((r) => r.id === id);
      toast({
        title: "Status updated",
        description: `"${target?.title ?? id}" (${target?.reference ?? id}) moved to ${REQUEST_STATUS_LABELS[status]}.`,
      });
      router.refresh();
    } catch (e) {
      toast({
        title: "Update failed",
        description: e instanceof Error ? e.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  // ---- mutation: POST /api/requests/[id]/convert { amount, note? } ----
  const convertToOrder = async (id: string, amount: number, note: string): Promise<boolean> => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/requests/${id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, note: note.trim() || undefined }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to convert request.");
      }
      const data = await res.json();
      toast({
        title: "Order created",
        description: `Order ${data.orderId} is now visible in Orders and the buyer's dashboard.`,
      });
      router.refresh();
      return true;
    } catch (e) {
      toast({
        title: "Could not convert request",
        description: e instanceof Error ? e.message : "Something went wrong.",
        variant: "destructive",
      });
      return false;
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Service Requests"
        description="Every buyer enquiry in one pipeline — review, progress, and convert requests into tracked orders."
        actions={
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm">
            <Inbox className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{requests.length}</span>
            <span className="text-muted-foreground">requests</span>
          </div>
        }
      />

      {/* Stat row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Open"
          value={countBy("open")}
          icon="Inbox"
          tone="amber"
          onClick={() => {
            setTab("pipeline");
            setStatusFilter("open");
          }}
        />
        <StatCard
          label="In review"
          value={countBy("in_review")}
          icon="Clock"
          tone="blue"
          onClick={() => {
            setTab("pipeline");
            setStatusFilter("in_review");
          }}
        />
        <StatCard
          label="In progress"
          value={countBy("in_progress")}
          icon="Timer"
          tone="violet"
          onClick={() => {
            setTab("pipeline");
            setStatusFilter("in_progress");
          }}
        />
        <StatCard
          label="Fulfilled"
          value={countBy("fulfilled")}
          icon="BadgeCheck"
          tone="green"
          onClick={() => {
            setTab("pipeline");
            setStatusFilter("fulfilled");
          }}
        />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger
            value="pipeline"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Pipeline
            <span className="ml-1.5 rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold data-[state=active]:bg-primary-foreground/20">
              {requests.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="website"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Website Enquiries
            <span className="ml-1.5 rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold data-[state=active]:bg-primary-foreground/20">
              {websiteEnquiries.length}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "pipeline" ? (
        <PipelineTab
          requests={requests}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onView={(r) => setActiveId(r.id)}
        />
      ) : (
        <WebsiteEnquiries inquiries={inquiries} />
      )}

      <RequestDetailSheet
        request={active}
        open={!!active}
        onOpenChange={(o) => !o && closeSheet()}
        busy={busyId === active?.id}
        onUpdateStatus={updateStatus}
        onConvert={convertToOrder}
      />
    </div>
  );
}

// ------------------------------------------------------------
// Pipeline tab — the MarketRequest pipeline
// ------------------------------------------------------------

function PipelineTab({
  requests,
  statusFilter,
  onStatusFilterChange,
  onView,
}: {
  requests: MarketRequest[];
  statusFilter: MarketRequestStatus | "all";
  onStatusFilterChange: (s: MarketRequestStatus | "all") => void;
  onView: (r: MarketRequest) => void;
}) {
  const [kindFilter, setKindFilter] = useState<RequestKind | "all">("all");

  const rows = useMemo(() => {
    return requests
      .filter((r) => (kindFilter === "all" ? true : kindOf(r) === kindFilter))
      .filter((r) => (statusFilter === "all" ? true : r.status === statusFilter))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [requests, kindFilter, statusFilter]);

  const columns: Column<MarketRequest>[] = [
    {
      key: "reference",
      header: "Reference",
      render: (r) => (
        <span className="font-mono text-xs text-muted-foreground">{r.reference ?? r.id}</span>
      ),
    },
    {
      key: "title",
      header: "Request",
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
          <span className="mt-1 inline-flex w-fit items-center rounded-full border bg-muted/40 px-1.5 py-px text-[10px] font-medium text-muted-foreground">
            {KIND_LABELS[kindOf(r)]}
          </span>
        </div>
      ),
    },
    {
      key: "buyerName",
      header: "Buyer",
      sortable: true,
      sortValue: (r) => r.buyerName,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{r.buyerName}</p>
          <p className="truncate text-xs text-muted-foreground">{r.buyerCompany || "Independent"}</p>
        </div>
      ),
    },
    {
      key: "budgetRange",
      header: "Budget",
      render: (r) => (
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-foreground">
          <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          {r.budgetRange || "—"}
        </span>
      ),
    },
    {
      key: "timeline",
      header: "Timeline",
      hideBelow: "md",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Timer className="h-3.5 w-3.5" />
          {r.timeline || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      sortValue: (r) => r.createdAt,
      hideBelow: "lg",
      render: (r) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(r.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={rows}
      columns={columns}
      searchKeys={["title", "buyerName", "buyerCompany", "reference", "categoryName"]}
      searchPlaceholder="Search title, buyer, reference…"
      pageSize={8}
      onRowClick={onView}
      rowActions={(r) => (
        <Button variant="outline" size="sm" className="h-8" onClick={() => onView(r)}>
          View
        </Button>
      )}
      toolbar={
        <>
          <Select
            value={kindFilter}
            onValueChange={(v) => setKindFilter(v as RequestKind | "all")}
          >
            <SelectTrigger aria-label="Filter requests by kind" className="h-9 w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              {KIND_OPTIONS.map((k) => (
                <SelectItem key={k.value} value={k.value}>
                  {k.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => onStatusFilterChange(v as MarketRequestStatus | "all")}
          >
            <SelectTrigger aria-label="Filter requests by status" className="h-9 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {REQUEST_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      }
      emptyState={
        <div className="flex flex-col items-center justify-center gap-1 text-center">
          <Inbox className="mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium text-foreground">No requests match this view</p>
          <p className="text-sm text-muted-foreground">
            {kindFilter !== "all" || statusFilter !== "all"
              ? "Try clearing the kind or status filter above."
              : "Buyer requests from the marketplace will appear here."}
          </p>
        </div>
      }
    />
  );
}

// ------------------------------------------------------------
// Request detail sheet
// ------------------------------------------------------------

function RequestDetailSheet({
  request,
  open,
  onOpenChange,
  busy,
  onUpdateStatus,
  onConvert,
}: {
  request: MarketRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  busy: boolean;
  onUpdateStatus: (id: string, status: MarketRequestStatus, note: string) => Promise<void>;
  onConvert: (id: string, amount: number, note: string) => Promise<boolean>;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {request && (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between gap-3 pr-6">
                <div className="min-w-0">
                  <SheetTitle className="truncate">{request.title}</SheetTitle>
                  <SheetDescription className="mt-0.5">
                    <span className="font-mono">{request.reference ?? request.id}</span>
                    {" · submitted "}
                    {formatStamp(request.createdAt)}
                  </SheetDescription>
                </div>
                <StatusBadge status={request.status} />
              </div>
            </SheetHeader>

            <div className="space-y-6 px-4 pb-8">
              {/* Buyer block */}
              <Card className="p-5">
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-start gap-2.5">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Buyer</p>
                      <p className="truncate text-sm text-foreground">{request.buyerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>
                      <p className="text-sm text-foreground">{request.buyerCompany || "Independent"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Layers className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</p>
                      <p className="text-sm text-foreground">{request.categoryName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Kind + budget + timeline chips */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {KIND_LABELS[kindOf(request)]}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-0.5 text-xs text-muted-foreground">
                    <CircleDollarSign className="h-3 w-3" />
                    {request.budgetRange || "No budget set"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-0.5 text-xs text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    {request.timeline || "No timeline set"}
                  </span>
                </div>
                {REQUEST_KIND_DEFS[kindOf(request)] && (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {REQUEST_KIND_DEFS[kindOf(request)]?.tagline}
                  </p>
                )}
              </div>

              {/* Structured details (talent kinds) or details paragraph */}
              <StructuredDetails request={request} />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Details</p>
                <p className="mt-2 whitespace-pre-wrap rounded-md border bg-muted/30 px-4 py-3 text-sm leading-relaxed text-foreground">
                  {request.details || "No additional details provided."}
                </p>
              </div>

              <TrackingTimeline request={request} />

              <Separator />

              <RequestActions
                key={request.id}
                request={request}
                busy={busy}
                onUpdateStatus={onUpdateStatus}
                onConvert={onConvert}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** Kind-specific structured answers, rendered as label/value rows. */
function StructuredDetails({ request }: { request: MarketRequest }) {
  const def = REQUEST_KIND_DEFS[kindOf(request)];
  if (!def || !request.meta) return null;

  const rows = def.fields
    .map((f) => ({ label: f.label, value: request.meta?.[f.key] }))
    .filter((row): row is { label: string; value: string } => Boolean(row.value));

  if (rows.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Requirement details
      </p>
      <dl className="mt-2 divide-y rounded-md border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-2.5">
            <dt className="shrink-0 text-xs font-medium text-muted-foreground">{row.label}</dt>
            <dd className="text-right text-sm font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Vertical tracking timeline built from request.statusHistory. */
function TrackingTimeline({ request }: { request: MarketRequest }) {
  const history = request.statusHistory ?? [];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Tracking timeline
      </p>
      {history.length === 0 ? (
        <p className="mt-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
          No activity yet.
        </p>
      ) : (
        <ol className="mt-3 space-y-0">
          {history.map((ev, i) => (
            <li key={`${ev.at}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
              {i < history.length - 1 && (
                <span
                  className="absolute left-[5px] top-4 h-full w-px bg-border"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                  DOT_TONE[ev.status]
                )}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {REQUEST_STATUS_LABELS[ev.status]}
                </p>
                {ev.note && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{ev.note}</p>
                )}
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  by {ev.by} · {formatStamp(ev.at)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Request actions — status update + convert to order
// ------------------------------------------------------------

function RequestActions({
  request,
  busy,
  onUpdateStatus,
  onConvert,
}: {
  request: MarketRequest;
  busy: boolean;
  onUpdateStatus: (id: string, status: MarketRequestStatus, note: string) => Promise<void>;
  onConvert: (id: string, amount: number, note: string) => Promise<boolean>;
}) {
  const [nextStatus, setNextStatus] = useState<MarketRequestStatus>(request.status);
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");

  const handleUpdateStatus = () => {
    void onUpdateStatus(request.id, nextStatus, note);
    setNote("");
  };

  const handleConvert = async () => {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 0) return;
    const ok = await onConvert(request.id, amt, note);
    if (ok) setAmount("");
  };

  // Already converted — surface the linked order instead of admin actions.
  if (request.orderId) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order</p>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                Fulfilled
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground">
                {request.quotedAmount
                  ? `Quoted ${formatMoney(request.quotedAmount)}`
                  : "Converted to a marketplace order"}
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <Link href="/admin/orders">
                <ExternalLink className="h-3.5 w-3.5" />
                Order {request.orderId}
              </Link>
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          This request is complete. Track delivery from the Orders page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Status update */}
      <div className="space-y-2">
        <Label htmlFor="request-status">Update status</Label>
        <Select
          value={nextStatus}
          onValueChange={(v) => setNextStatus(v as MarketRequestStatus)}
        >
          <SelectTrigger id="request-status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REQUEST_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note for the tracking timeline…"
          aria-label="Status note"
        />
        <Button
          className="w-full"
          disabled={busy || nextStatus === request.status}
          onClick={handleUpdateStatus}
        >
          {busy ? "Updating…" : "Update status"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Every status change is appended to the buyer&apos;s tracking timeline.
        </p>
      </div>

      {/* Convert to order */}
      <div className="space-y-2 rounded-lg border p-4">
        <Label htmlFor="quoted-amount">Convert to order</Label>
        <Input
          id="quoted-amount"
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={request.budgetRange ? `e.g. ${request.budgetRange}` : "e.g. 7500"}
          aria-label="Quoted amount in USD"
        />
        <Button className="w-full" disabled={busy || !amount} onClick={handleConvert}>
          {busy ? "Converting…" : "Convert to order"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Creates a pending order for {request.buyerName} and marks this request fulfilled.
        </p>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Website Enquiries tab — ported from the old marketplace-requests page
// ------------------------------------------------------------

function WebsiteEnquiries({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const { toast } = useToast();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const enquiries = useMemo(
    () =>
      inquiries
        .filter((q) => WEBSITE_TYPES.includes(q.type))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [inquiries]
  );

  const viewing = activeId ? inquiries.find((q) => q.id === activeId) ?? null : null;

  const changeStatus = async (id: string, status: InquiryStatus, name: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update status.");
      }
      toast({
        title: "Status updated",
        description: `Enquiry from ${name} marked as ${
          INQUIRY_STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
        }.`,
      });
      router.refresh();
    } catch (e) {
      toast({
        title: "Update failed",
        description: e instanceof Error ? e.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const columns: Column<Inquiry>[] = [
    {
      key: "name",
      header: "Name / Company",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.company || "Independent"}</p>
        </div>
      ),
    },
    {
      key: "serviceName",
      header: "Service",
      sortable: true,
      sortValue: (r) => r.serviceName ?? "",
      render: (r) => (
        <span className="block max-w-56 truncate text-sm text-foreground">
          {r.serviceName ?? "—"}
        </span>
      ),
    },
    {
      key: "budgetRange",
      header: "Budget",
      hideBelow: "md",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-sm text-foreground">
          <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          {r.budgetRange || "—"}
        </span>
      ),
    },
    {
      key: "timeline",
      header: "Timeline",
      hideBelow: "lg",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Timer className="h-3.5 w-3.5" />
          {r.timeline || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <EntityStatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      sortValue: (r) => r.createdAt,
      hideBelow: "md",
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(r.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={enquiries}
        columns={columns}
        searchKeys={["name", "company", "serviceName", "requirements", "budgetRange"]}
        searchPlaceholder="Search enquiries…"
        pageSize={8}
        onRowClick={(r) => setActiveId(r.id)}
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <Select
              value={row.status}
              onValueChange={(v) => changeStatus(row.id, v as InquiryStatus, row.name)}
            >
              <SelectTrigger
                aria-label={`Update status for ${row.name}`}
                className="h-8 w-[118px] text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INQUIRY_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setActiveId(row.id)}>
              View
            </Button>
          </div>
        )}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="font-medium text-foreground">No website enquiries</p>
            <p className="text-sm text-muted-foreground">
              Quote requests, service enquiries, and consultation bookings from the public site will appear here.
            </p>
          </div>
        }
      />

      <Sheet open={!!viewing} onOpenChange={(o) => !o && setActiveId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {viewing && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <div className="min-w-0">
                    <SheetTitle className="truncate">{viewing.name}</SheetTitle>
                    <SheetDescription className="mt-0.5">
                      {viewing.company || "Independent"} ·{" "}
                      {formatStamp(viewing.createdAt)}
                    </SheetDescription>
                  </div>
                  <EntityStatusBadge status={viewing.status} />
                </div>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-8">
                <Card className="p-5">
                  <CardContent className="space-y-3 p-0">
                    <div className="flex items-start gap-2.5">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                        <p className="truncate text-sm text-foreground">{viewing.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</p>
                        <p className="text-sm text-foreground">{viewing.phone || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>
                        <p className="text-sm text-foreground">{viewing.company || "Independent"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requested service</p>
                  <p className="mt-1.5 text-sm font-medium text-foreground">
                    {viewing.serviceName ?? "General marketplace request"}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-md border bg-muted/40 px-3 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Budget</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">{viewing.budgetRange || "—"}</p>
                    </div>
                    <div className="rounded-md border bg-muted/40 px-3 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Timeline</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">{viewing.timeline || "—"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requirements</p>
                  <p className="mt-2 whitespace-pre-wrap rounded-md border bg-muted/30 px-4 py-3 text-sm leading-relaxed text-foreground">
                    {viewing.requirements || "No additional requirements provided."}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="enquiry-status">Update status</Label>
                  <Select
                    value={viewing.status}
                    onValueChange={(v) => changeStatus(viewing.id, v as InquiryStatus, viewing.name)}
                  >
                    <SelectTrigger id="enquiry-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INQUIRY_STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Status changes are recorded in the activity log immediately.
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
