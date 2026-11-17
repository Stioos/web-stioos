"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { CheckCheck, Inbox, Loader2, ShieldAlert } from "lucide-react";
import {
  EmptyState,
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/dashboard/shared";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { MarketOrder, MarketOrderStatus } from "@/types";

type BuyerOrderTab = "all" | Exclude<MarketOrderStatus, "pending">;

const TAB_LABELS: { value: BuyerOrderTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "In progress" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PROGRESS_HINTS: Partial<Record<MarketOrderStatus, string>> = {
  in_progress: "Our delivery team is building your order",
  pending: "Confirming your order",
};

function BuyerOrderCard({
  order,
  onAccept,
  onDispute,
  busy,
}: {
  order: MarketOrder;
  onAccept: (order: MarketOrder) => void;
  onDispute: (order: MarketOrder) => void;
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
          {order.status === "delivered" && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onDispute(order)}>
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                Dispute
              </Button>
              <Button size="sm" onClick={() => onAccept(order)} disabled={busy}>
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <CheckCheck className="h-4 w-4" aria-hidden="true" />
                )}
                Accept delivery
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export interface BuyerOrdersViewProps {
  orders: MarketOrder[];
}

/**
 * Buyer "My Orders" view — server-fetched list rendered through a
 * presentational client component. The "Accept delivery" action PATCHes
 * `/api/orders/[id]` with `{ status: "completed" }` then calls
 * `router.refresh()` so the server query re-runs and the updated row is
 * reflected. "Dispute" stays a toast-only action (support is notified
 * out-of-band).
 */
export function BuyerOrdersView({ orders }: BuyerOrdersViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [tab, setTab] = useState<BuyerOrderTab>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  // The server already filtered to the buyer's own orders and sorted
  // newest-first, so we just slice/filter client-side for the tabs.
  const myOrders = useMemo(() => orders, [orders]);

  const filtered = useMemo(() => {
    if (tab === "all") return myOrders;
    return myOrders.filter((o) =>
      tab === "in_progress"
        ? o.status === "in_progress" || o.status === "pending"
        : o.status === tab
    );
  }, [myOrders, tab]);

  const counts = useMemo(() => {
    const map = new Map<BuyerOrderTab, number>([["all", myOrders.length]]);
    for (const o of myOrders) {
      if (o.status === "pending") continue;
      map.set(o.status as BuyerOrderTab, (map.get(o.status as BuyerOrderTab) ?? 0) + 1);
    }
    return map;
  }, [myOrders]);

  const handleAccept = async (order: MarketOrder) => {
    setBusyId(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ status: "completed" }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok?: true; error?: string }
        | { ok?: false; error?: string };
      if (res.ok && (data as { ok?: boolean }).ok !== false) {
        toast({
          title: "Delivery accepted",
          description: `"${order.serviceName}" is marked completed. Thanks for confirming!`,
        });
        router.refresh();
        return;
      }
      toast({
        title: "Could not accept delivery",
        description: data.error ?? "Please try again in a moment.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleDispute = (order: MarketOrder) => {
    toast({
      title: "Support notified",
      description: `Our team will reach out about "${order.serviceName}" within 24 hours.`,
      variant: "destructive",
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">My Orders</h1>
        <p className="text-sm text-slate-400">
          Review deliveries and keep your projects moving.
        </p>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as BuyerOrderTab)}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto w-full justify-start sm:w-auto">
            {TAB_LABELS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="min-h-[36px] gap-1.5 px-3"
              >
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
              ? "When you order a service it will show up here with live status."
              : "No orders match this filter right now — try another tab."
          }
          action={
            tab === "all" ? (
              <Button asChild variant="outline">
                <Link href="/marketplace">Browse the marketplace</Link>
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
              onAccept={handleAccept}
              onDispute={handleDispute}
              busy={busyId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
