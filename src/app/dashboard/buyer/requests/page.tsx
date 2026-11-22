"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
  Archive,
  ArrowRight,
  ChevronDown,
  History,
  Inbox,
  Loader2,
  Plus,
  XCircle,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmptyState, StatusBadge, formatDate, formatMoney } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { KIND_LABELS, REQUEST_STATUS_FLOW, REQUEST_STATUS_LABELS } from "@/lib/request-kinds";
import { cn } from "@/lib/utils";
import type { MarketRequest, MarketRequestStatus } from "@/types";

const BUDGET_OPTIONS = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
];

const TIMELINE_OPTIONS = ["ASAP (1–2 weeks)", "2–4 weeks", "4–8 weeks", "Flexible"];

// ---------- Status filter tabs ----------

type RequestTab = "all" | MarketRequestStatus;

const REQUEST_TABS: { value: RequestTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_review", label: "In review" },
  { value: "in_progress", label: "In progress" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "closed", label: "Closed" },
];

// ---------- Tracking card building blocks ----------

const KIND_BADGE_TALENT = "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
const KIND_BADGE_SERVICE = "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300";

const STATUS_DOT_COLOR: Record<MarketRequestStatus, string> = {
  open: "bg-amber-500",
  in_review: "bg-sky-500",
  in_progress: "bg-teal-500",
  fulfilled: "bg-emerald-500",
  rejected: "bg-rose-500",
  closed: "bg-slate-400",
};

/** Horizontal 4-step pipeline (open → in review → in progress → fulfilled). */
function RequestStepper({ status }: { status: MarketRequestStatus }) {
  const current = Math.max(REQUEST_STATUS_FLOW.indexOf(status), 0);
  return (
    <ol
      aria-label={`Progress: ${REQUEST_STATUS_LABELS[status]}`}
      className="flex items-start overflow-x-auto pb-1"
    >
      {REQUEST_STATUS_FLOW.map((step, index) => {
        const past = index < current;
        const active = index === current;
        return (
          <li key={step} aria-current={active ? "step" : undefined} className="flex items-start">
            <span className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full border-2",
                  past && "border-primary bg-primary",
                  active && "border-primary bg-primary ring-4 ring-primary/20",
                  !past && !active && "border-muted-foreground/40 bg-transparent"
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "whitespace-nowrap text-[10px] leading-none",
                  active
                    ? "font-semibold text-primary"
                    : past
                      ? "font-medium text-foreground"
                      : "font-medium text-muted-foreground"
                )}
              >
                {REQUEST_STATUS_LABELS[step]}
              </span>
            </span>
            {index < REQUEST_STATUS_FLOW.length - 1 && (
              <span
                aria-hidden="true"
                className={cn("mt-1 h-0.5 w-5 shrink-0 sm:w-10", past ? "bg-primary" : "bg-border")}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** End-state chip replacing the stepper for rejected / closed requests. */
function RequestEndState({ status }: { status: MarketRequestStatus }) {
  const rejected = status === "rejected";
  const Icon = rejected ? XCircle : Archive;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
          rejected
            ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
            : "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300"
        )}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {REQUEST_STATUS_LABELS[status]}
      </span>
      <span className="text-[11px] text-muted-foreground">
        This request is {REQUEST_STATUS_LABELS[status].toLowerCase()} — you can submit a new request any time.
      </span>
    </div>
  );
}

/** Expandable vertical timeline of the request's status history. */
function RequestActivity({ request }: { request: MarketRequest }) {
  const [open, setOpen] = useState(false);
  const events = request.statusHistory ?? [];
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
          aria-expanded={open}
          aria-label={`Activity for ${request.title}`}
        >
          <History className="h-3.5 w-3.5" aria-hidden="true" />
          Activity
          <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold">{events.length}</span>
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ol className="ml-2 space-y-4 border-l pl-5 pt-2">
          {events.map((event, index) => (
            <li key={`${event.status}-${event.at}-${index}`} className="relative">
              <span
                className={cn(
                  "absolute -left-6 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
                  STATUS_DOT_COLOR[event.status]
                )}
                aria-hidden="true"
              />
              <p className="text-xs font-semibold text-foreground">{REQUEST_STATUS_LABELS[event.status]}</p>
              {event.note && (
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{event.note}</p>
              )}
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {event.by} · {format(new Date(event.at), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </li>
          ))}
          {events.length === 0 && (
            <li className="text-xs text-muted-foreground">No activity recorded yet.</li>
          )}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
}

function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-slate-500/30 bg-slate-500/10 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
      {children}
    </span>
  );
}

function RequestCard({ request }: { request: MarketRequest }) {
  const isTalentKind = request.kind !== undefined && request.kind !== "service";
  const isEndState = request.status === "rejected" || request.status === "closed";

  return (
    <article className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{request.title}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {request.categoryName}
            {request.reference && (
              <>
                {" · "}
                <span className="font-mono">{request.reference}</span>
              </>
            )}{" "}
            · Posted {formatDate(request.createdAt)} ·{" "}
            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <span
            className={cn(
              "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
              isTalentKind ? KIND_BADGE_TALENT : KIND_BADGE_SERVICE
            )}
          >
            {KIND_LABELS[request.kind ?? "service"]}
          </span>
          <StatusBadge status={request.status} />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{request.details}</p>

      <div className="flex flex-wrap items-center gap-2 border-t pt-3">
        <MetaChip>Budget: {request.budgetRange}</MetaChip>
        <MetaChip>Timeline: {request.timeline}</MetaChip>
        {request.quotedAmount !== undefined && <MetaChip>Quoted: {formatMoney(request.quotedAmount)}</MetaChip>}
        {request.orderId && (
          <Link
            href="/dashboard/buyer/orders"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-300"
          >
            Converted to order
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="border-t pt-3">
        {isEndState ? <RequestEndState status={request.status} /> : <RequestStepper status={request.status} />}
      </div>

      <div className="border-t pt-2">
        <RequestActivity request={request} />
      </div>
    </article>
  );
}

// ---------- New request dialog (unchanged flow) ----------

function NewRequestDialog({ onCreated }: { onCreated: () => void }) {
  const user = useCurrentUser();
  const categories = useAppStore((s) => s.categories);
  const addMarketRequest = useAppStore((s) => s.addMarketRequest);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const activeCategories = useMemo(() => categories.filter((c) => c.status === "active"), [categories]);

  const reset = () => {
    setCategoryId("");
    setTitle("");
    setDetails("");
    setBudgetRange("");
    setTimeline("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!categoryId) next.category = "Choose a category.";
    if (title.trim().length < 5) next.title = "Give your request a clear title.";
    if (details.trim().length < 20) next.details = "Describe the work in at least a couple of sentences.";
    if (!budgetRange) next.budget = "Select a budget range.";
    if (!timeline) next.timeline = "Select a timeline.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const category = activeCategories.find((c) => c.id === categoryId);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    addMarketRequest({
      categoryId,
      categoryName: category?.name ?? "General",
      title: title.trim(),
      details: details.trim(),
      budgetRange,
      timeline,
    });
    setSubmitting(false);
    setOpen(false);
    reset();
    toast({
      title: "Request published",
      description: "Our expert teams will respond with proposals.",
    });
    onCreated();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Post a Service Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Post a new request</DialogTitle>
          <DialogDescription>
            Describe what you need — vetted expert teams will respond with proposals.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger aria-label="Category" aria-invalid={!!errors.category}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {activeCategories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs font-medium text-destructive">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-title">Title</Label>
            <Input
              id="request-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Multilingual support agent for EU rollout"
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-details">Details</Label>
            <Textarea
              id="request-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Scope, systems involved, success criteria…"
              aria-invalid={!!errors.details}
            />
            {errors.details && <p className="text-xs font-medium text-destructive">{errors.details}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Budget range</Label>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger aria-label="Budget range" aria-invalid={!!errors.budget}>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budget && <p className="text-xs font-medium text-destructive">{errors.budget}</p>}
            </div>
            <div className="space-y-2">
              <Label>Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger aria-label="Timeline" aria-invalid={!!errors.timeline}>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeline && <p className="text-xs font-medium text-destructive">{errors.timeline}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                "Publish request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Page ----------

function BuyerRequestsContent() {
  const user = useCurrentUser();
  const requests = useAppStore((s) => s.requests);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState<RequestTab>("all");

  const myRequests = useMemo(() => {
    void refreshKey;
    return user
      ? [...requests.filter((r) => r.buyerId === user.id)].sort(
          (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        )
      : [];
  }, [requests, user, refreshKey]);

  const filtered = useMemo(() => {
    if (tab === "all") return myRequests;
    if (tab === "closed") return myRequests.filter((r) => r.status === "closed" || r.status === "rejected");
    return myRequests.filter((r) => r.status === tab);
  }, [myRequests, tab]);

  const counts = useMemo(() => {
    const map = new Map<RequestTab, number>([["all", myRequests.length]]);
    for (const r of myRequests) {
      const key: RequestTab = r.status === "rejected" ? "closed" : r.status;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [myRequests]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">My Requests</h1>
          <p className="text-sm text-slate-400">
            Briefs you've published — each with a reference code and live delivery tracking.
          </p>
        </div>
        <NewRequestDialog onCreated={() => setRefreshKey((k) => k + 1)} />
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as RequestTab)}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto w-full justify-start sm:w-auto">
            {REQUEST_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="min-h-[36px] gap-1.5 px-3">
                {t.label}
                <span className="rounded-full bg-muted-foreground/15 px-1.5 text-[10px] font-semibold text-muted-foreground">
                  {counts.get(t.value) ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests here"
          description={
            tab === "all"
              ? "Post a brief describing the outcome you need and let expert teams come to you."
              : "No requests match this filter right now — try another tab."
          }
          action={
            tab === "all" ? (
              <Button asChild variant="outline">
                <Link href="/dashboard/buyer/talent-services">Explore Talent Services</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuyerRequestsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="My Requests">
        <BuyerRequestsContent />
      </DashboardShell>
    </RequireRole>
  );
}
