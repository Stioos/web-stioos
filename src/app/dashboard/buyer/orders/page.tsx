"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  CalendarClock,
  CheckCheck,
  ChevronRight,
  ClipboardList,
  CreditCard,
  DollarSign,
  Inbox,
  Package,
  ShieldAlert,
  Store,
  X,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmptyState, StatusBadge, formatDate, formatMoney } from "@/components/dashboard/shared";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { MarketOrder, MarketOrderStatus } from "@/types";

// ---------- Tabs (image 2 reference) ----------

type BuyerOrderTab = "all" | MarketOrderStatus;

const TAB_LABELS: { value: BuyerOrderTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending Payment" },
  { value: "in_progress", label: "In Progress" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_DOT: Record<MarketOrderStatus, string> = {
  pending: "bg-amber-400",
  in_progress: "bg-sky-400",
  delivered: "bg-emerald-400",
  completed: "bg-teal-400",
  cancelled: "bg-rose-400",
};

const PROGRESS_HINTS: Partial<Record<MarketOrderStatus, string>> = {
  pending: "Invoice issued — payment due",
  in_progress: "Our delivery team is building your order",
  delivered: "Delivery ready for your acceptance",
  completed: "Delivery accepted — order closed",
  cancelled: "Order cancelled",
};

// ---------- Page ----------

export default function BuyerOrdersPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="My Orders">
        <OrdersContent />
      </DashboardShell>
    </RequireRole>
  );
}

function OrdersContent() {
  const router = useRouter();
  const user = useCurrentUser();
  const orders = useAppStore((s) => s.orders);
  const requests = useAppStore((s) => s.requests);
  const invoices = useAppStore((s) => s.invoices);
  const transactions = useAppStore((s) => s.transactions);
  const acceptDelivery = useAppStore((s) => s.acceptDelivery);
  const { toast } = useToast();

  const [tab, setTab] = useState<BuyerOrderTab>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const myOrders = useMemo(
    () =>
      user
        ? [...orders.filter((o) => o.buyerId === user.id)].sort(
            (a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt)
          )
        : [],
    [orders, user]
  );

  const filtered = useMemo(() => {
    if (tab === "all") return myOrders;
    return myOrders.filter((o) => o.status === tab);
  }, [myOrders, tab]);

  const counts = useMemo(() => {
    const map = new Map<BuyerOrderTab, number>([["all", myOrders.length]]);
    for (const o of myOrders) {
      map.set(o.status, (map.get(o.status) ?? 0) + 1);
    }
    return map;
  }, [myOrders]);

  // Auto-select the first order in the current filter when none is selected.
  const selected = useMemo(() => {
    if (selectedId) {
      const found = myOrders.find((o) => o.id === selectedId);
      if (found) return found;
    }
    return filtered[0] ?? null;
  }, [selectedId, myOrders, filtered]);

  const findRequestId = (orderId: string) =>
    requests.find((r) => r.orderId === orderId)?.id ?? null;
  const findInvoice = (orderId: string) =>
    invoices.find((i) => i.orderId === orderId) ?? null;
  const findTransaction = (orderId: string) =>
    transactions.find((t) => t.orderId === orderId) ?? null;

  const handleAccept = async (order: MarketOrder) => {
    const res = acceptDelivery(order.id);
    if (res.ok) {
      toast({
        title: "Delivery accepted",
        description: `"${order.serviceName}" is marked completed. The linked request is now closed.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Could not accept delivery",
        description: res.error ?? "Please try again.",
      });
    }
  };

  const handleDispute = (order: MarketOrder) => {
    toast({
      title: "Support notified",
      description: `Our team will reach out about "${order.serviceName}" within 24 hours.`,
      variant: "destructive",
    });
  };

  const handlePay = (order: MarketOrder) => {
    const req = requests.find((r) => r.orderId === order.id);
    if (req) {
      router.push(`/dashboard/buyer/requests/${req.id}?tab=invoice`);
    } else {
      toast({
        title: "No linked request",
        description: "Could not find the request linked to this order.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
      {/* Tab bar (image 2 reference) */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {TAB_LABELS.map((t) => {
          const count = counts.get(t.value) ?? 0;
          const isActive = tab === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTab(t.value);
                setSelectedId(null);
              }}
              aria-pressed={isActive}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition-all",
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  isActive
                    ? "bg-slate-900/10 text-slate-700"
                    : "bg-white/10 text-slate-400"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Split layout: inspector LEFT + sidebar list RIGHT (swapped per request) */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No orders here"
          description={
            tab === "all"
              ? "When the STIOOS team creates an order from your accepted quote, it will appear here."
              : "No orders match this filter right now — try another tab."
          }
          action={
            tab === "all" ? (
              <Button asChild variant="outline">
                <Link href="/dashboard/buyer/requests">View My Requests</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_360px]">
          {/* Inspector — order detail panel (LEFT side) */}
          <section className="min-h-0 overflow-y-auto">
            {selected ? (
              <OrderInspector
                order={selected}
                requestId={findRequestId(selected.id)}
                invoice={findInvoice(selected.id)}
                transaction={findTransaction(selected.id)}
                onAccept={handleAccept}
                onDispute={handleDispute}
                onPay={handlePay}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                <div>
                  <Package className="mx-auto h-10 w-10 text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    Select an order from the sidebar
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    View its details, linked invoice, payment status, and delivery actions.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Sidebar — order list (RIGHT side, opposite) */}
          <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="shrink-0 border-b border-white/10 px-4 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Orders ({filtered.length})
                </p>
                <span className="text-[10px] text-slate-500">
                  {tab === "all" ? "All statuses" : TAB_LABELS.find((t) => t.value === tab)?.label}
                </span>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
              {filtered.map((order) => {
                const isActive = selected?.id === order.id;
                const hint = PROGRESS_HINTS[order.status];
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedId(order.id)}
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
                          STATUS_DOT[order.status]
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
                          {order.serviceName}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                          {hint ?? "Fulfilled by the STIOOS delivery team"}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <StatusBadge status={order.status} />
                          <span className="text-[10px] font-semibold text-emerald-300">
                            {formatMoney(order.amount)}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {formatDistanceToNow(new Date(order.placedAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

// ---------- Order Inspector ----------

function OrderInspector({
  order,
  requestId,
  invoice,
  transaction,
  onAccept,
  onDispute,
  onPay,
  onClose,
}: {
  order: MarketOrder;
  requestId: string | null;
  invoice: ReturnType<typeof useAppStore.getState>["invoices"][number] | null;
  transaction: ReturnType<typeof useAppStore.getState>["transactions"][number] | null;
  onAccept: (o: MarketOrder) => void;
  onDispute: (o: MarketOrder) => void;
  onPay: (o: MarketOrder) => void;
  onClose: () => void;
}) {
  const hint = PROGRESS_HINTS[order.status];
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      {/* Inspector header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <Icon name={order.serviceIcon} className="h-5 w-5 text-amber-400" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
              Order Inspector
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-white sm:text-xl">
              {order.serviceName}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Order ID: <span className="font-mono text-slate-300">{order.id}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspector"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        <StatusBadge status={order.status} />
        {hint && (
          <span className="text-[11px] text-slate-400">{hint}</span>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {order.status === "pending" && (
            <Button size="sm" onClick={() => onPay(order)}>
              <CreditCard className="h-3.5 w-3.5" /> Pay Invoice
            </Button>
          )}
          {order.status === "delivered" && (
            <>
              <Button size="sm" variant="outline" onClick={() => onDispute(order)}>
                <ShieldAlert className="h-3.5 w-3.5" /> Dispute
              </Button>
              <Button
                size="sm"
                onClick={() => onAccept(order)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Accept Delivery
              </Button>
            </>
          )}
          {order.status === "completed" && (
            <Button size="sm" variant="outline" disabled>
              <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> Completed
            </Button>
          )}
        </div>
      </div>

      {/* Amount + dates */}
      <div className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-3">
        <InspectorField
          label="Amount"
          value={
            <span className="text-xl font-bold text-emerald-300">
              {formatMoney(order.amount)}
            </span>
          }
          icon={<DollarSign className="h-3.5 w-3.5 text-emerald-400" />}
        />
        <InspectorField
          label="Delivery Type"
          value={<span className="capitalize text-slate-200">{order.deliveryType.replace("_", " ")}</span>}
          icon={<Package className="h-3.5 w-3.5 text-sky-400" />}
        />
        <InspectorField
          label="Placed"
          value={<span className="text-slate-200">{formatDate(order.placedAt)}</span>}
          icon={<CalendarClock className="h-3.5 w-3.5 text-amber-400" />}
        />
      </div>

      {/* Requirements */}
      {order.requirements && (
        <div className="py-3">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Your Requirements
          </p>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
            {order.requirements}
          </div>
        </div>
      )}

      {/* Linked records */}
      <div className="mt-2 space-y-3 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Linked Records
        </p>

        {/* Linked request */}
        {requestId ? (
          <Link
            href={`/dashboard/buyer/requests/${requestId}`}
            className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-amber-400/30 hover:bg-white/[0.05]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-400/10 ring-1 ring-amber-400/20">
              <ClipboardList className="h-4 w-4 text-amber-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300">Service Request</p>
              <p className="truncate text-sm text-white">
                View the original request lifecycle → quote → order
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-amber-300" />
          </Link>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 p-3 text-xs text-slate-500">
            No linked request found for this order.
          </div>
        )}

        {/* Linked invoice */}
        {invoice ? (
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-400/10 ring-1 ring-sky-400/20">
              <CreditCard className="h-4 w-4 text-sky-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300">Invoice</p>
              <p className="font-mono text-sm text-white">
                {invoice.reference} · {formatMoney(invoice.total)}
              </p>
            </div>
            <StatusBadge status={invoice.status} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 p-3 text-xs text-slate-500">
            No invoice issued for this order yet.
          </div>
        )}

        {/* Linked transaction */}
        {transaction ? (
          <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-400/10 ring-1 ring-emerald-400/20">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300">Payment</p>
              <p className="font-mono text-sm text-white">
                {transaction.reference} ·{" "}
                <span className="capitalize">{transaction.method.replace("_", " ")}</span>
              </p>
            </div>
            <span className="text-[11px] text-slate-400">
              {formatDate(transaction.createdAt)}
            </span>
          </div>
        ) : null}
      </div>

      {/* Footer — back to list (mobile) */}
      <div className="mt-3 border-t border-white/10 pt-3 lg:hidden">
        <Link
          href="/dashboard/buyer/requests"
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200"
        >
          <ArrowLeft className="h-3 w-3" /> Back to My Requests
        </Link>
      </div>

      {/* Footer — marketplace */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-amber-300"
        >
          <Store className="h-3 w-3" /> Browse more services
        </Link>
      </div>
    </div>
  );
}

function InspectorField({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
      <div className="mt-1.5">{value}</div>
    </div>
  );
}
