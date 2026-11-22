"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  ChevronRight,
  ClipboardList,
  Inbox,
  MessageSquareText,
  Plus,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  EmptyState,
  SectionCard,
  StatusBadge,
  formatDate,
  formatMoney,
  timeAgo,
} from "@/components/dashboard/shared";
import { LifecycleStepper, nextBuyerActionLabel } from "@/components/dashboard/lifecycle/lifecycle-shared";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { KIND_LABELS, REQUEST_STATUS_LABELS } from "@/lib/request-kinds";
import { cn } from "@/lib/utils";
import type { Inquiry, MarketRequest, MarketRequestStatus } from "@/types";

const BUDGET_OPTIONS = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
];

const TIMELINE_OPTIONS = ["ASAP (1–2 weeks)", "2–4 weeks", "4–8 weeks", "Flexible"];

// ---------- Lifecycle filter tabs ----------

type RequestTab = "all" | MarketRequestStatus;

const REQUEST_TABS: { value: RequestTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "in_review", label: "In Review" },
  { value: "quoted", label: "Quoted" },
  { value: "approved", label: "Approved" },
  { value: "ordered", label: "Order Created" },
  { value: "paid", label: "Paid" },
  { value: "delivered", label: "Delivered" },
  { value: "closed", label: "Closed" },
  { value: "rejected", label: "Rejected" },
];

const KIND_BADGE_TALENT = "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
const KIND_BADGE_SERVICE = "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300";

const INQUIRY_STATUS_LABELS: Record<Inquiry["status"], string> = {
  new: "New",
  in_progress: "In Progress",
  contacted: "Contacted",
  closed: "Closed",
};

export default function BuyerRequestsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="My Requests · Buyer Dashboard">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <RequestsContent />
        </div>
      </DashboardShell>
    </RequireRole>
  );
}

function RequestsContent() {
  const user = useCurrentUser();
  const requests = useAppStore((s) => s.requests);
  const inquiries = useAppStore((s) => s.inquiries);
  const quotes = useAppStore((s) => s.quotes);

  const [topTab, setTopTab] = useState<"requests" | "responses">("requests");
  const [lifecycleTab, setLifecycleTab] = useState<RequestTab>("all");
  const [newRequestOpen, setNewRequestOpen] = useState(false);

  const myRequests = useMemo(() => {
    if (!user) return [];
    return requests
      .filter((r) => r.buyerId === user.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [requests, user]);

  const filteredRequests = useMemo(() => {
    if (lifecycleTab === "all") return myRequests;
    return myRequests.filter((r) => r.status === lifecycleTab);
  }, [myRequests, lifecycleTab]);

  const responses = useMemo(() => {
    if (!user) return [];
    return inquiries
      .filter((i) => i.email.toLowerCase() === user.email.toLowerCase())
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [inquiries, user]);

  const tabCount = (tab: RequestTab) =>
    tab === "all" ? myRequests.length : myRequests.filter((r) => r.status === tab).length;

  const pendingActionCount = myRequests.filter(
    (r) => nextBuyerActionLabel(r.status) !== null
  ).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Marketplace · Buyer
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            My Requests
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            Track every service request from submission through quote, order,
            payment and delivery. {pendingActionCount > 0 && (
              <span className="font-semibold text-amber-300">
                {pendingActionCount} awaiting your action.
              </span>
            )}
          </p>
        </div>
        <Button
          onClick={() => setNewRequestOpen(true)}
          className="bg-amber-500 text-slate-900 hover:bg-amber-400"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Post a Service Request
        </Button>
      </div>

      {/* Top-level tabs: Requests vs Service Responses */}
      <div className="mt-5 flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
        <button
          onClick={() => setTopTab("requests")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
            topTab === "requests"
              ? "bg-amber-500/15 text-amber-300"
              : "text-slate-300 hover:text-white"
          )}
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Service Requests
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold">
            {myRequests.length}
          </span>
        </button>
        <button
          onClick={() => setTopTab("responses")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
            topTab === "responses"
              ? "bg-amber-500/15 text-amber-300"
              : "text-slate-300 hover:text-white"
          )}
        >
          <MessageSquareText className="h-3.5 w-3.5" />
          Service Responses
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold">
            {responses.length}
          </span>
        </button>
      </div>

      {topTab === "requests" ? (
        <>
          {/* Lifecycle tabs */}
          <Tabs value={lifecycleTab} onValueChange={(v) => setLifecycleTab(v as RequestTab)} className="mt-4">
            <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto p-1 bg-white/[0.03]">
              {REQUEST_TABS.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-300 text-xs"
                >
                  {t.label}
                  <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold">
                    {tabCount(t.value)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Stats strip */}
          <RequestStatsStrip requests={myRequests} />

          {/* Request list */}
          <div className="mt-4 space-y-3">
            {filteredRequests.length === 0 ? (
              <EmptyState
                icon={<Inbox className="h-8 w-8" />}
                title="No requests in this stage"
                description={
                  lifecycleTab === "all"
                    ? "Post a service request to get started — it goes straight to the STIOOS delivery team for review."
                    : "Try another filter, or post a new service request."
                }
                action={
                  <Button
                    onClick={() => setNewRequestOpen(true)}
                    className="bg-amber-500 text-slate-900 hover:bg-amber-400"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Post a Service Request
                  </Button>
                }
              />
            ) : (
              filteredRequests.map((req) => (
                <RequestRow
                  key={req.id}
                  request={req}
                  quote={
                    req.quoteId
                      ? quotes.find((q) => q.id === req.quoteId) ?? null
                      : null
                  }
                />
              ))
            )}
          </div>
        </>
      ) : (
        <ServiceResponsesTab responses={responses} />
      )}

      <NewRequestDialog open={newRequestOpen} onOpenChange={setNewRequestOpen} />
    </>
  );
}

// ---------- Request row (clickable card → detail page) ----------

function RequestRow({
  request,
  quote,
}: {
  request: MarketRequest;
  quote: ReturnType<typeof useAppStore.getState>["quotes"][number] | null;
}) {
  const next = nextBuyerActionLabel(request.status);
  const kindBadge =
    request.kind && request.kind !== "service" ? KIND_BADGE_TALENT : KIND_BADGE_SERVICE;
  return (
    <Link
      href={`/dashboard/buyer/requests/${request.id}`}
      className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-amber-400/40 hover:bg-white/[0.05]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                kindBadge
              )}
            >
              {request.kind ? KIND_LABELS[request.kind] : "Service"}
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {request.reference ?? request.id}
            </span>
            <StatusBadge status={request.status} />
            {next && (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                Action needed
              </span>
            )}
          </div>
          <h3 className="mt-1.5 truncate text-base font-semibold text-white">
            {request.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">
            {request.details}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
            <span>{request.categoryName}</span>
            <span>·</span>
            <span>Budget {request.budgetRange}</span>
            <span>·</span>
            <span>Timeline {request.timeline}</span>
            <span>·</span>
            <span>Posted {timeAgo(request.createdAt)}</span>
            {request.quotedAmount && (
              <>
                <span>·</span>
                <span className="font-semibold text-emerald-300">
                  Quoted {formatMoney(request.quotedAmount)}
                </span>
              </>
            )}
          </div>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-500" />
      </div>

      <div className="mt-3 border-t border-white/10 pt-3">
        <LifecycleStepper status={request.status} />
      </div>

      {next && (
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-300">
          <ArrowRight className="h-3.5 w-3.5" />
          <span className="font-semibold">{next.label}</span>
          <span className="text-slate-500">— {next.cta}</span>
        </div>
      )}
    </Link>
  );
}

// ---------- Service Responses tab (formerly its own page) ----------

function ServiceResponsesTab({ responses }: { responses: Inquiry[] }) {
  if (responses.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquareText className="h-8 w-8" />}
        title="No responses yet"
        description="When you submit a quote, consultation or contact request from the marketplace, the STIOOS team's responses will appear here."
      />
    );
  }
  const counts = {
    new: responses.filter((r) => r.status === "new").length,
    in_progress: responses.filter((r) => r.status === "in_progress").length,
    contacted: responses.filter((r) => r.status === "contacted").length,
    closed: responses.filter((r) => r.status === "closed").length,
  };
  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["new", "in_progress", "contacted", "closed"] as const).map((s) => (
          <div
            key={s}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
          >
            <p className="text-[11px] uppercase tracking-wider text-slate-500">
              {INQUIRY_STATUS_LABELS[s]}
            </p>
            <p className="mt-1 text-2xl font-bold text-white">{counts[s]}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-left text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Budget</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {responses.map((r) => (
              <tr key={r.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-slate-300">
                  {formatDate(r.createdAt)}
                </td>
                <td className="px-4 py-3 capitalize text-slate-300">
                  {r.type.replace("_", " ")}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {r.serviceName ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-300">{r.budgetRange}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Stats strip ----------

function RequestStatsStrip({ requests }: { requests: MarketRequest[] }) {
  const total = requests.length;
  const actionNeeded = requests.filter(
    (r) => nextBuyerActionLabel(r.status) !== null
  ).length;
  const inDelivery = requests.filter(
    (r) => r.status === "paid" || r.status === "delivered" || r.status === "ordered"
  ).length;
  const closed = requests.filter(
    (r) => r.status === "closed" || r.status === "rejected"
  ).length;

  const cards = [
    { label: "Total Requests", value: total, tone: "text-white" },
    { label: "Action Needed", value: actionNeeded, tone: "text-amber-300" },
    { label: "In Delivery", value: inDelivery, tone: "text-sky-300" },
    { label: "Closed", value: closed, tone: "text-emerald-300" },
  ];
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
        >
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            {c.label}
          </p>
          <p className={cn("mt-1 text-2xl font-bold", c.tone)}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

// ---------- New Request Dialog (Post a Service Request form) ----------

function NewRequestDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const user = useCurrentUser();
  const categories = useAppStore((s) => s.categories);
  const addMarketRequest = useAppStore((s) => s.addMarketRequest);
  const router = useRouterSafe();
  const { toast } = useToast();

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [budgetRange, setBudgetRange] = useState(BUDGET_OPTIONS[2]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[1]);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCategoryId("");
    setTitle("");
    setDetails("");
    setBudgetRange(BUDGET_OPTIONS[2]);
    setTimeline(TIMELINE_OPTIONS[1]);
    setError(null);
  };

  const handleSubmit = () => {
    setError(null);
    if (!user) {
      setError("You must be signed in to submit a request.");
      return;
    }
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) {
      setError("Choose a category.");
      return;
    }
    if (title.trim().length < 6) {
      setError("Title must be at least 6 characters.");
      return;
    }
    if (details.trim().length < 20) {
      setError("Details must be at least 20 characters so the team can scope accurately.");
      return;
    }
    const req = addMarketRequest({
      categoryId: cat.id,
      categoryName: cat.name,
      title: title.trim(),
      details: details.trim(),
      budgetRange,
      timeline,
      kind: "service",
    });
    toast({
      title: "Request submitted",
      description: `${req.reference} — ${req.title}. The STIOOS team will respond with a quote shortly.`,
    });
    reset();
    onOpenChange(false);
    // Jump straight to the new request's detail page
    if (router) router.push(`/dashboard/buyer/requests/${req.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="border-b border-slate-200 p-5 dark:border-slate-800">
          <DialogTitle className="text-base">Post a Service Request</DialogTitle>
          <DialogDescription className="text-xs">
            Describe what you need — the STIOOS delivery team will review and respond with a quote.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-5">
          <div>
            <Label className="text-xs">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              placeholder="e.g. Multilingual support agent for EU rollout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Details</Label>
            <Textarea
              rows={4}
              placeholder="Scope, deliverables, integration points, success metrics…"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Budget range</Label>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-slate-200 p-4 dark:border-slate-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-amber-500 text-slate-900 hover:bg-amber-400"
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Safe useRouter wrapper so the dialog doesn't crash on first paint
import { useRouter } from "next/navigation";
function useRouterSafe() {
  return useRouter();
}
