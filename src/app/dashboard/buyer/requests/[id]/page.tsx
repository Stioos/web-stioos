"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  MessageSquareText,
  Receipt,
  XCircle,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  EmptyState,
  SectionCard,
  StatusBadge,
  formatMoney,
  timeAgo,
} from "@/components/dashboard/shared";
import {
  LifecycleStepper,
  LifecycleTimeline,
  nextBuyerActionLabel,
} from "@/components/dashboard/lifecycle/lifecycle-shared";
import {
  DeclineQuoteDialog,
  ApproveQuoteDialog,
  InvoiceCard,
  PaymentDialog,
  QuoteCard,
  formatMoney as formatLifecycleMoney,
} from "@/components/dashboard/lifecycle/quote-invoice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { KIND_LABELS } from "@/lib/request-kinds";
import { cn } from "@/lib/utils";

export default function BuyerRequestDetailPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Request Detail · Buyer Dashboard">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
          <RequestDetailContent />
        </div>
      </DashboardShell>
    </RequireRole>
  );
}

function RequestDetailContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useCurrentUser();
  const requests = useAppStore((s) => s.requests);
  const quotes = useAppStore((s) => s.quotes);
  const invoices = useAppStore((s) => s.invoices);
  const orders = useAppStore((s) => s.orders);
  const transactions = useAppStore((s) => s.transactions);

  const acceptDelivery = useAppStore((s) => s.acceptDelivery);
  const { toast } = useToast();

  const [declineOpen, setDeclineOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [tab, setTab] = useState<"timeline" | "quote" | "invoice" | "transaction">("timeline");

  const request = useMemo(
    () => requests.find((r) => r.id === params.id),
    [requests, params.id]
  );

  if (!request || (user && request.buyerId !== user.id)) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Request not found"
        description="This request may have been removed, never existed, or doesn't belong to your account."
        action={
          <Button onClick={() => router.push("/dashboard/buyer/requests")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to My Requests
          </Button>
        }
      />
    );
  }

  const quote = request.quoteId
    ? quotes.find((q) => q.id === request.quoteId) ?? null
    : null;
  const order = request.orderId
    ? orders.find((o) => o.id === request.orderId) ?? null
    : null;
  const invoice = request.invoiceId
    ? invoices.find((i) => i.id === request.invoiceId) ?? null
    : null;
  const txn = transactions.find((t) => t.invoiceId === invoice?.id) ?? null;
  const next = nextBuyerActionLabel(request.status);

  const handleQuoteApproved = () => {
    toast({
      title: "Quote approved",
      description: "The STIOOS team will create your order and issue an invoice.",
    });
  };

  const handleAcceptDelivery = () => {
    if (!order) return;
    const res = acceptDelivery(order.id);
    if (res.ok) {
      toast({
        title: "Delivery accepted",
        description: "Order closed. Receipt and final invoice are available under Billing.",
      });
    }
  };

  const tabs: Array<{ value: typeof tab; label: string; visible: boolean }> = [
    { value: "timeline", label: "Timeline", visible: true },
    { value: "quote", label: "Quote", visible: !!quote },
    { value: "invoice", label: "Invoice", visible: !!invoice },
    { value: "transaction", label: "Transaction", visible: !!txn },
  ];
  const visibleTabs = tabs.filter((t) => t.visible);
  const activeTab = visibleTabs.some((t) => t.value === tab)
    ? tab
    : (visibleTabs[0]?.value ?? "timeline");

  return (
    <>
      {/* Breadcrumb + back */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/dashboard/buyer/requests" className="hover:text-amber-300">
          My Requests
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-mono text-slate-300">
          {request.reference ?? request.id}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
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
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {request.title}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {request.categoryName} · Posted {timeAgo(request.createdAt)}
          </p>
        </div>
        <Link href="/dashboard/buyer/requests">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      {/* Lifecycle stepper */}
      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Lifecycle
        </p>
        <LifecycleStepper status={request.status} />
        {next && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-300">
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold">{next.label}</span>
            <span className="text-slate-500">— {next.cta}</span>
          </div>
        )}
      </div>

      {/* Details + actions */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Request details" className="bg-white/[0.03]">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Budget
                  </p>
                  <p className="text-slate-200">{request.budgetRange}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Timeline
                  </p>
                  <p className="text-slate-200">{request.timeline}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Reference
                  </p>
                  <p className="font-mono text-slate-200">
                    {request.reference ?? request.id}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Submitted
                  </p>
                  <p className="text-slate-200">{timeAgo(request.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  Description
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">
                  {request.details}
                </p>
              </div>
              {request.meta && Object.keys(request.meta).length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">
                    Structured answers
                  </p>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {Object.entries(request.meta).map(([k, v]) => (
                      <div
                        key={k}
                        className="rounded-md bg-white/[0.04] px-2 py-1.5 text-xs"
                      >
                        <p className="text-slate-500">{k}</p>
                        <p className="text-slate-200">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Engagement record"
            className="bg-white/[0.03]"
            action={
              <Tabs value={activeTab} onValueChange={(v) => setTab(v as typeof tab)}>
                <TabsList className="h-auto p-0.5 bg-white/[0.03]">
                  {visibleTabs.map((t) => (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="text-xs data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-300"
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            }
          >
            {activeTab === "timeline" && <LifecycleTimeline request={request} />}
            {activeTab === "quote" && quote && (
              <QuoteCard
                quote={quote}
                actions={
                  quote.status === "sent" ? (
                    <>
                      <Button
                        onClick={() => setApproveOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve Quote
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setDeclineOpen(true)}
                      >
                        <XCircle className="mr-1.5 h-4 w-4 text-rose-500" />
                        Decline
                      </Button>
                    </>
                  ) : null
                }
              />
            )}
            {activeTab === "invoice" && invoice && (
              <InvoiceCard
                invoice={invoice}
                actions={
                  invoice.status === "issued" ? (
                    <Button
                      onClick={() => setPayOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CreditCard className="mr-1.5 h-4 w-4" /> Pay{" "}
                      {formatLifecycleMoney(invoice.total)}
                    </Button>
                  ) : invoice.status === "paid" ? (
                    <Button variant="outline" disabled>
                      <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-500" />
                      Paid {invoice.paidAt ? timeAgo(invoice.paidAt) : ""}
                    </Button>
                  ) : null
                }
              />
            )}
            {activeTab === "transaction" && txn && (
              <TransactionDetail txn={txn} />
            )}
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {order && (
            <SectionCard title="Linked order" className="bg-white/[0.03]">
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono text-slate-200">{order.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold text-emerald-300">
                    {formatMoney(order.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Placed</span>
                  <span className="text-slate-200">{timeAgo(order.placedAt)}</span>
                </div>
                <Link
                  href={`/dashboard/buyer/orders`}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200"
                >
                  View in My Orders <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </SectionCard>
          )}

          <SectionCard title="Next action" className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-400/20">
            {next ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-200">{next.label}</p>
                {request.status === "quoted" && quote && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => setApproveOpen(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve Quote
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setDeclineOpen(true)}
                    >
                      <XCircle className="mr-1.5 h-4 w-4 text-rose-500" /> Decline Quote
                    </Button>
                  </div>
                )}
                {request.status === "ordered" && invoice && (
                  <Button
                    onClick={() => setPayOpen(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CreditCard className="mr-1.5 h-4 w-4" /> Pay{" "}
                    {formatLifecycleMoney(invoice.total)}
                  </Button>
                )}
                {request.status === "delivered" && order && (
                  <Button
                    onClick={handleAcceptDelivery}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Accept Delivery
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                {request.status === "rejected"
                  ? "This request was declined. Reach out to the STIOOS team to revisit scope."
                  : request.status === "closed"
                  ? "This request is complete. View the final invoice under Billing."
                  : "Awaiting the STIOOS team's response."}
              </p>
            )}
          </SectionCard>

          <SectionCard title="Quick links" className="bg-white/[0.03]">
            <div className="space-y-1 text-sm">
              <Link
                href="/dashboard/buyer/orders"
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-slate-300 hover:bg-white/[0.04]"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> My Orders
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>
              <Link
                href="/dashboard/buyer/transactions"
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-slate-300 hover:bg-white/[0.04]"
              >
                <span className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" /> Transactions
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>
              <Link
                href="/dashboard/buyer/transactions"
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-slate-300 hover:bg-white/[0.04]"
              >
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Transactions & Invoices
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>
              <Link
                href="/dashboard/buyer/messages"
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-slate-300 hover:bg-white/[0.04]"
              >
                <span className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4" /> Messages
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Dialogs */}
      {quote && (
        <ApproveQuoteDialog
          open={approveOpen}
          onOpenChange={setApproveOpen}
          quote={quote}
          onApproved={handleQuoteApproved}
        />
      )}
      {quote && (
        <DeclineQuoteDialog
          open={declineOpen}
          onOpenChange={setDeclineOpen}
          quote={quote}
        />
      )}
      {invoice && (
        <PaymentDialog
          open={payOpen}
          onOpenChange={setPayOpen}
          invoice={invoice}
        />
      )}
    </>
  );
}

function TransactionDetail({
  txn,
}: {
  txn: ReturnType<typeof useAppStore.getState>["transactions"][number];
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">
              {txn.type}
            </p>
            <p className="font-mono text-sm font-bold text-emerald-300">
              {txn.reference}
            </p>
          </div>
          <p
            className={cn(
              "text-xl font-bold",
              txn.amount >= 0 ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {txn.amount >= 0 ? "+" : ""}
            {formatLifecycleMoney(txn.amount)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Method
          </p>
          <p className="text-slate-200 capitalize">{txn.method.replace("_", " ")}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Status
          </p>
          <p className="capitalize text-slate-200">{txn.status}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Date
          </p>
          <p className="text-slate-200">{timeAgo(txn.createdAt)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Gateway ref
          </p>
          <p className="font-mono text-xs text-slate-300">
            {txn.gatewayReference ?? "—"}
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-400">{txn.description}</p>
      {txn.meta && Object.keys(txn.meta).length > 0 && (
        <div className="rounded-md bg-white/[0.04] p-2 text-xs">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Payment metadata
          </p>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {Object.entries(txn.meta).map(([k, v]) => (
              <div key={k}>
                <span className="text-slate-500">{k}: </span>
                <span className="text-slate-200">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
