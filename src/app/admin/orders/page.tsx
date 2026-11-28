"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Inbox,
  MoreHorizontal,
  PackageCheck,
  PlayCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Icon } from "@/components/shared/icon";
import {
  StatusBadge,
  formatDate,
  formatMoney,
} from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
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
import type { MarketOrder, MarketOrderStatus } from "@/types";

const ORDER_STATUSES: { value: MarketOrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_CHIPS: { value: MarketOrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Total" },
  ...ORDER_STATUSES,
];

const CHIP_ACTIVE: Record<string, string> = {
  all: "bg-foreground text-background ring-foreground",
  pending: "bg-amber-600 text-white ring-amber-600",
  in_progress: "bg-sky-600 text-white ring-sky-600",
  delivered: "bg-emerald-600 text-white ring-emerald-600",
  completed: "bg-teal-600 text-white ring-teal-600",
  cancelled: "bg-rose-600 text-white ring-rose-600",
};

const STATUS_ICON: Record<MarketOrderStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  in_progress: PlayCircle,
  delivered: Truck,
  completed: CheckCircle2,
  cancelled: XCircle,
};

function titleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const orders = useAppStore((s) => s.orders);
  const requests = useAppStore((s) => s.requests);
  const updateMarketOrderStatus = useAppStore((s) => s.updateMarketOrderStatus);
  const markOrderDelivered = useAppStore((s) => s.markOrderDelivered);

  const [statusFilter, setStatusFilter] = useState<MarketOrderStatus | "all">("all");

  const rows = useMemo(() => {
    return [...orders]
      .filter((o) => (statusFilter === "all" ? true : o.status === statusFilter))
      .sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt));
  }, [orders, statusFilter]);

  const countBy = (status: MarketOrderStatus) =>
    orders.filter((o) => o.status === status).length;

  // Revenue — all non-cancelled orders regardless of the active filter.
  const revenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + o.amount, 0),
    [orders]
  );

  const changeStatus = (order: MarketOrder, status: MarketOrderStatus) => {
    updateMarketOrderStatus(order.id, status);
    toast({
      title: "Status updated",
      description: `Order "${order.serviceName}" (${order.id}) marked ${status.replace("_", " ")} for ${order.buyerName}.`,
    });
  };

  const handleMarkDelivered = (order: MarketOrder) => {
    const res = markOrderDelivered(order.id);
    if (res.ok) {
      toast({
        title: "Order delivered",
        description: `Order ${order.id} marked delivered — the buyer can now accept delivery.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Could not mark delivered",
        description: res.error ?? "Something went wrong.",
      });
    }
  };

  const findRequestId = (orderId: string) =>
    requests.find((r) => r.orderId === orderId)?.id ?? null;

  const columns: Column<MarketOrder>[] = [
    {
      key: "serviceName",
      header: "Order",
      sortable: true,
      sortValue: (o) => o.serviceName,
      render: (o) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Icon name={o.serviceIcon} className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{o.serviceName}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{o.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: "buyerName",
      header: "Buyer",
      sortable: true,
      sortValue: (o) => o.buyerName,
      render: (o) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{o.buyerName}</p>
          <p className="truncate text-xs text-muted-foreground">{o.buyerCompany || "Independent"}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      sortValue: (o) => o.amount,
      render: (o) => (
        <span className="whitespace-nowrap text-sm font-semibold text-foreground">
          {formatMoney(o.amount)}
        </span>
      ),
    },
    {
      key: "deliveryType",
      header: "Type",
      hideBelow: "md",
      render: (o) => (
        <span className="text-sm text-muted-foreground">{titleCase(o.deliveryType)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (o) => o.status,
      render: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: "placedAt",
      header: "Placed",
      sortable: true,
      sortValue: (o) => o.placedAt,
      hideBelow: "md",
      render: (o) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(o.placedAt)}
        </span>
      ),
    },
  ];

  const rowActions = (o: MarketOrder) => {
    const requestId = findRequestId(o.id);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={`Actions for order ${o.id}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {o.status === "in_progress" && (
            <>
              <DropdownMenuItem
                onClick={() => handleMarkDelivered(o)}
                className="text-sky-700 focus:text-sky-800"
              >
                <Truck className="h-4 w-4" />
                Mark Delivered
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {requestId && (
            <>
              <DropdownMenuItem asChild>
                <a
                  href={`/admin/service-requests?focus=${requestId}`}
                  className="flex items-center gap-2"
                >
                  <PackageCheck className="h-4 w-4" />
                  View Request
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuLabel className="text-xs text-muted-foreground">Set order status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ORDER_STATUSES.map((s) => {
            const IconCmp = STATUS_ICON[s.value];
            return (
              <DropdownMenuItem
                key={s.value}
                disabled={o.status === s.value}
                onClick={() => changeStatus(o, s.value)}
              >
                <IconCmp className="h-4 w-4" />
                {s.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="w-full px-0 py-2 lg:py-3">
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard compact label="Total Orders" value={orders.length} icon="PackageCheck" tone="violet" />
        <StatCard compact label="Pending" value={countBy("pending")} icon="Clock" tone="amber" />
        <StatCard compact label="Completed" value={countBy("completed")} icon="CheckCircle2" tone="green" />
        <StatCard compact label="Revenue" value={formatMoney(revenue)} icon="TrendingUp" tone="blue" />
      </div>

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["serviceName", "buyerName", "buyerCompany"]}
        searchPlaceholder="Search service, buyer, company…"
        pageSize={8}
        stickyPageHeader
        toolbar={
          <div className="flex flex-wrap items-center justify-end gap-2" role="group" aria-label="Filter orders by status">
            {STATUS_CHIPS.map((chip) => {
              const isActive = statusFilter === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setStatusFilter(chip.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
                    isActive ? CHIP_ACTIVE[chip.value] : "bg-card text-muted-foreground ring-border hover:text-foreground"
                  )}
                >
                  {chip.value === "all" ? "All" : chip.label}
                  <span className={cn("rounded-full px-1.5 text-[10px] font-bold", isActive ? "bg-white/20 dark:bg-black/20" : "bg-muted")}>
                    {chip.value === "all" ? orders.length : countBy(chip.value)}
                  </span>
                </button>
              );
            })}
          </div>
        }
        rowActions={rowActions}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <Inbox className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No orders match this view</p>
            <p className="text-sm text-muted-foreground">
              {statusFilter !== "all"
                ? "Try a different status chip above."
                : "Orders placed by buyers will appear here."}
            </p>
          </div>
        }
      />
    </div>
  );
}
