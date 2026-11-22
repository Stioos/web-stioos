"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCheck,
  ChevronRight,
  ClipboardList,
  Inbox,
  ShieldAlert,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmptyState, StatusBadge, formatDate, formatMoney } from "@/components/dashboard/shared";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import type { MarketOrder, MarketOrderStatus } from "@/types";

type BuyerOrderTab = "all" | "pending" | Exclude<MarketOrderStatus, "pending">;

const TAB_LABELS: { value: BuyerOrderTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending Payment" },
  { value: "in_progress", label: "In Progress" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PROGRESS_HINTS: Partial<Record<MarketOrderStatus, string>> = {
  pending: "Invoice issued — payment due",
  in_progress: "Our delivery team is building your order",
  delivered: "Delivery ready for your acceptance",
  completed: "Delivery accepted — order closed",
};

function BuyerOrderCard({
  order,
  requestId,
  onAccept,
  onDispute,
  onPay,
  busy,
}: {
  order: MarketOrder;
  requestId?: string | null;
  onAccept: (order: MarketOrder) => void;
  onDispute: (order: MarketOrder) => void;
  onPay: (order: MarketOrder) => void;
  busy: boolean;
}) {
  const hint = PROGRESS_HINTS[order.status];
  return (
    <article className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <Icon name={order.serviceIcon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{order.serviceName}</h3>
          <p className="truncate text-xs text-muted-foreground">Fulfilled by the STIOOS delivery team</p>
          {requestId && (
            <Link
              href={`/dashboard/buyer/requests/${requestId}`}
              className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-500"
            >
              <ClipboardList className="h-3 w-3" /> View request <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-bold text-foreground">{formatMoney(order.amount)}</p>
          <p className="text-[11px] text-muted-foreground">Placed {formatDate(order.placedAt)}</p>
        </div>
      </div>

      {order.requirements && (
        <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Your requirements: </span>
          {order.requirements}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          {hint && (
            <span className="text-[11px] text-muted-foreground">{hint}</span>
          )}
          {order.status === "delivered" && (
            <span className="text-[11px] text-muted-foreground">
              Updated {formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {order.status === "pending" && (
            <Button size="sm" onClick={() => onPay(order)}>
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              Pay Invoice
            </Button>
          )}
          {order.status === "delivered" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onDispute(order)}>
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                Dispute
              </Button>
              <Button size="sm" onClick={() => onAccept(order)} disabled={busy}>
                <CheckCheck className="h-4 w-4" aria-hidden="true" />
                Accept delivery
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function BuyerOrdersContent() {
  const router = useRouter();
  const user = useCurrentUser();
  const orders = useAppStore((s) => s.orders);
  const requests = useAppStore((s) => s.requests);
  const acceptDelivery = useAppStore((s) => s.acceptDelivery);
  const { toast } = useToast();
  const [tab, setTab] = useState<BuyerOrderTab>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

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
      map.set(o.status as BuyerOrderTab, (map.get(o.status as BuyerOrderTab) ?? 0) + 1);
    }
    return map;
  }, [myOrders]);

  const findRequestId = (orderId: string) =>
    requests.find((r) => r.orderId === orderId)?.id ?? null;

  const handleAccept = async (order: MarketOrder) => {
    setBusyId(order.id);
    await new Promise((r) => setTimeout(r, 450));
    const res = acceptDelivery(order.id);
    setBusyId(null);
    if (res.ok) {
      toast({
        title: "Delivery accepted",
        description: `"${order.serviceName}" is marked completed. The linked request is now closed.`,
      });
    } else {
      toast({
        title: "Could not accept delivery",
        description: res.error ?? "Please try again.",
        variant: "destructive",
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
      // Push to the request detail page which has the Pay action wired to the invoice.
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
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">My Orders</h1>
        <p className="text-sm text-slate-400">
          Track orders from payment through delivery. Each order links back to its
          original request and invoice.
        </p>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as BuyerOrderTab)}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto w-full justify-start sm:w-auto">
            {TAB_LABELS.map((t) => (
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
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((order) => (
            <BuyerOrderCard
              key={order.id}
              order={order}
              requestId={findRequestId(order.id)}
              onAccept={handleAccept}
              onDispute={handleDispute}
              onPay={handlePay}
              busy={busyId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuyerOrdersPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="My Orders">
        <BuyerOrdersContent />
      </DashboardShell>
    </RequireRole>
  );
}

