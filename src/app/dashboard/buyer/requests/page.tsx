"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Inbox,
  Plus,
  XCircle,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusBadge, formatMoney, timeAgo } from "@/components/dashboard/shared";
import {
  LifecycleStepper,
  LifecycleTimeline,
  nextBuyerActionLabel,
} from "@/components/dashboard/lifecycle/lifecycle-shared";
import {
  DeclineQuoteDialog,
  PaymentDialog,
  QuoteCard,
  formatMoney as formatLifecycleMoney,
} from "@/components/dashboard/lifecycle/quote-invoice";
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
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { KIND_LABELS } from "@/lib/request-kinds";
import { cn } from "@/lib/utils";
import type { MarketRequest, MarketRequestStatus } from "@/types";

type RequestTab = "all" | MarketRequestStatus;

const TAB_OPTIONS: { value: RequestTab; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in_review", label: "In Review" },
  { value: "quoted", label: "Quoted" },
  { value: "approved", label: "Approved" },
  { value: "ordered", label: "Ordered" },
  { value: "paid", label: "Paid" },
  { value: "delivered", label: "Delivered" },
  { value: "closed", label: "Closed" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_DOT: Record<MarketRequestStatus, string> = {
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

const BUDGET_OPTIONS = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
  "Open to quote",
];

const TIMELINE_OPTIONS = ["ASAP (1–2 weeks)", "2–4 weeks", "4–8 weeks", "4–6 weeks", "6–8 weeks", "8–10 weeks", "8–12 weeks", "Flexible"];

export default function BuyerRequestsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="My Requests">
        <RequestsContent />
      </DashboardShell>
    </RequireRole>
  );
}

function RequestsContent() {
  const router = useRouter();
  const user = useCurrentUser();
  const requests = useAppStore((s) => s.requests);
  const quotes = useAppStore((s) => s.quotes);
  const invoices = useAppStore((s) => s.invoices);
  const orders = useAppStore((s) => s.orders);
  const transactions = useAppStore((s) => s.transactions);
  const acceptQuote = useAppStore((s) => s.acceptQuote);
  const acceptDelivery = useAppStore((s) => s.acceptDelivery);
  const { toast } = useToast();

  const [tab, setTab] = useState<RequestTab>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newRequestOpen, setNewRequestOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const myRequests = useMemo(() => {
    if (!user) return [];
    return requests
      .filter((r) => r.buyerId === user.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [requests, user]);

  const filtered = useMemo(() => {
    if (tab === "all") return myRequests;
    return myRequests.filter((r) => r.status === tab);
  }, [myRequests, tab]);

  const counts = useMemo(() => {
    const map = new Map<RequestTab, number>([["all", myRequests.length]]);
    for (const r of myRequests) {
      map.set(r.status, (map.get(r.status) ?? 0) + 1);
    }
    return map;
  }, [myRequests]);

  const selected = useMemo(() => {
    if (selectedId) {
      const found = myRequests.find((r) => r.id === selectedId);
      if (found) return found;
    }
    return filtered[0] ?? null;
  }, [selectedId, myRequests, filtered]);

  const handleAcceptQuote = () => {
    if (!selected?.quoteId) return;
    const res = acceptQuote(selected.quoteId);
    if (res.ok) {
      toast({
        title: "Quote accepted",
        description: "The STIOOS team will create your order and issue an invoice.",
      });
    }
  };

  const handleAcceptDelivery = () => {
    if (!selected?.orderId) return;
    const res = acceptDelivery(selected.orderId);
    if (res.ok) {
      toast({
        title: "Delivery accepted",
        description: "Order closed. Receipt and final invoice are available under Transactions.",
      });
    }
  };

  const linkedQuote = selected?.quoteId
    ? quotes.find((q) => q.id === selected.quoteId) ?? null
    : null;
  const linkedOrder = selected?.orderId
    ? orders.find((o) => o.id === selected.orderId) ?? null
    : null;
  const linkedInvoice = selected?.invoiceId
    ? invoices.find((i) => i.id === selected.invoiceId) ?? null
    : null;
  const linkedTxn = linkedInvoice
    ? transactions.find((t) => t.invoiceId === linkedInvoice.id) ?? null
    : null;

  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px]">
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Sidebar — requests list (LEFT) */}
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="shrink-0 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Requests ({filtered.length})
              </p>
              {/* Status filter dropdown — inline next to count (green-marked position) */}
              <Select
                value={tab}
                onValueChange={(v) => {
                  setTab(v as RequestTab);
                  setSelectedId(null);
                }}
              >
                <SelectTrigger className="h-7 min-w-[140px] flex-1 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAB_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-xs">
                      {t.label} ({counts.get(t.value) ?? 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={() => setNewRequestOpen(true)}
                className="h-7 shrink-0 bg-amber-500 px-2 text-[11px] text-slate-900 hover:bg-amber-400"
              >
                <Plus className="mr-1 h-3 w-3" /> New
              </Button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <div>
                  <Inbox className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    No requests match this filter
                  </p>
                </div>
              </div>
            ) : (
              filtered.map((req) => {
                const isActive = selected?.id === req.id;
                const next = nextBuyerActionLabel(req.status);
                return (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => setSelectedId(req.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group w-full rounded-lg p-3 text-left transition-colors",
                      isActive
                        ? "bg-amber-400/10 ring-1 ring-inset ring-amber-400/30"
                        : "hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          STATUS_DOT[req.status]
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-sm font-semibold",
                            isActive ? "text-amber-300" : "text-white"
                          )}
                        >
                          {req.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                          {req.reference} · {req.categoryName}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <StatusBadge status={req.status} />
                          {next && (
                            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-300">
                              Action
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {timeAgo(req.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Inspector — request detail (RIGHT) */}
        <section className="flex min-h-0 flex-col overflow-hidden">
          {/* Inspector content */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {selected ? (
              <RequestInspector
                request={selected}
                quote={linkedQuote}
                order={linkedOrder}
                invoice={linkedInvoice}
                txn={linkedTxn}
                onAcceptQuote={handleAcceptQuote}
                onAcceptDelivery={handleAcceptDelivery}
                onDecline={() => setDeclineOpen(true)}
                onPay={() => setPayOpen(true)}
                onViewRequest={(id) => router.push(`/dashboard/buyer/requests/${id}`)}
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                <div>
                  <ClipboardList className="mx-auto h-10 w-10 text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    Select a request from the sidebar
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    View its lifecycle, quote, invoice, and delivery actions.
                  </p>
                  <Button
                    onClick={() => setNewRequestOpen(true)}
                    className="mt-4 bg-amber-500 text-slate-900 hover:bg-amber-400"
                  >
                    <Plus className="mr-1.5 h-4 w-4" /> Post a Service Request
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* New Request Dialog */}
      <NewRequestDialog
        open={newRequestOpen}
        onOpenChange={setNewRequestOpen}
        onCreated={(id) => router.push(`/dashboard/buyer/requests/${id}`)}
      />

      {/* Decline Quote Dialog */}
      {linkedQuote && (
        <DeclineQuoteDialog
          open={declineOpen}
          onOpenChange={setDeclineOpen}
          quote={linkedQuote}
        />
      )}

      {/* Payment Dialog */}
      {linkedInvoice && (
        <PaymentDialog
          open={payOpen}
          onOpenChange={setPayOpen}
          invoice={linkedInvoice}
          onPaid={() => {
            toast({
              title: "Payment successful",
              description: `${linkedInvoice.reference} paid. Your order is now in progress.`,
            });
          }}
        />
      )}
    </div>
  );
}

function RequestInspector({
  request,
  quote,
  order,
  invoice,
  txn,
  onAcceptQuote,
  onAcceptDelivery,
  onDecline,
  onPay,
  onViewRequest,
}: {
  request: MarketRequest;
  quote: ReturnType<typeof useAppStore.getState>["quotes"][number] | null;
  order: ReturnType<typeof useAppStore.getState>["orders"][number] | null;
  invoice: ReturnType<typeof useAppStore.getState>["invoices"][number] | null;
  txn: ReturnType<typeof useAppStore.getState>["transactions"][number] | null;
  onAcceptQuote: () => void;
  onAcceptDelivery: () => void;
  onDecline: () => void;
  onPay: () => void;
  onViewRequest: (id: string) => void;
}) {
  const next = nextBuyerActionLabel(request.status);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      {/* Inspector header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                request.kind && request.kind !== "service"
                  ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
                  : "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300"
              )}
            >
              {request.kind ? KIND_LABELS[request.kind] : "Service"}
            </span>
            <StatusBadge status={request.status} />
            {next && (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                Action needed
              </span>
            )}
          </div>
          <h2 className="mt-2 text-lg font-bold text-white sm:text-xl">
            {request.title}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {request.reference} · {request.categoryName} · {timeAgo(request.createdAt)}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewRequest(request.id)}
          className="text-amber-300"
        >
          Full Detail <ChevronRight className="ml-0.5 h-3 w-3" />
        </Button>
      </div>

      {/* Lifecycle stepper */}
      <div className="py-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Lifecycle
        </p>
        <LifecycleStepper status={request.status} />
        {next && (
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-300">
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold">{next.label}</span>
            <span className="text-slate-500">— {next.cta}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {next && (
        <div className="flex flex-wrap items-center gap-2 py-3">
          {request.status === "quoted" && quote && (
            <>
              <Button size="sm" onClick={onAcceptQuote} className="bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Accept Quote
              </Button>
              <Button size="sm" variant="outline" onClick={onDecline}>
                <XCircle className="h-3.5 w-3.5 text-rose-500" /> Decline
              </Button>
            </>
          )}
          {request.status === "ordered" && invoice && (
            <Button size="sm" onClick={onPay} className="bg-emerald-600 hover:bg-emerald-700">
              <CreditCard className="h-3.5 w-3.5" /> Pay {formatLifecycleMoney(invoice.total)}
            </Button>
          )}
          {request.status === "delivered" && order && (
            <Button size="sm" onClick={onAcceptDelivery} className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" /> Accept Delivery
            </Button>
          )}
        </div>
      )}

      {/* Detail fields */}
      <div className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-3">
        <InspectorField
          label="Budget"
          value={<span className="text-slate-200">{request.budgetRange}</span>}
        />
        <InspectorField
          label="Timeline"
          value={<span className="text-slate-200">{request.timeline}</span>}
        />
        <InspectorField
          label="Quoted Amount"
          value={
            request.quotedAmount ? (
              <span className="font-bold text-emerald-300">
                {formatMoney(request.quotedAmount)}
              </span>
            ) : (
              <span className="text-slate-500">—</span>
            )
          }
        />
      </div>

      {/* Requirements */}
      {request.details && (
        <div className="py-3">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Description
          </p>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
            {request.details}
          </div>
        </div>
      )}

      {/* Linked records */}
      <div className="mt-2 space-y-3 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Linked Records
        </p>
        {order && (
          <Link
            href="/dashboard/buyer/orders"
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-amber-400/30 hover:bg-white/[0.05]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-400/10 ring-1 ring-amber-400/20">
              <ClipboardList className="h-4 w-4 text-amber-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300">Order</p>
              <p className="truncate font-mono text-sm text-white">{order.id}</p>
            </div>
            <StatusBadge status={order.status} />
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-300" />
          </Link>
        )}
        {invoice && (
          <Link
            href="/dashboard/buyer/transactions"
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-amber-400/30 hover:bg-white/[0.05]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-400/10 ring-1 ring-sky-400/20">
              <CreditCard className="h-4 w-4 text-sky-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300">Invoice</p>
              <p className="truncate font-mono text-sm text-white">
                {invoice.reference} · {formatLifecycleMoney(invoice.total)}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-300" />
          </Link>
        )}
        {txn && (
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-400/10 ring-1 ring-emerald-400/20">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300">Payment</p>
              <p className="truncate font-mono text-sm text-white">
                {txn.reference} · {formatLifecycleMoney(txn.amount)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Timeline summary */}
      <div className="mt-2 border-t border-white/10 pt-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Timeline
        </p>
        <LifecycleTimeline request={request} />
      </div>
    </div>
  );
}

function InspectorField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="mt-1.5">{value}</div>
    </div>
  );
}

// ---------- New Request Dialog ----------

function NewRequestDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: (id: string) => void;
}) {
  const user = useCurrentUser();
  const categories = useAppStore((s) => s.categories);
  const addMarketRequest = useAppStore((s) => s.addMarketRequest);
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
    onCreated(req.id);
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
