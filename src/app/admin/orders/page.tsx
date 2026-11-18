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
import { PageHeader } from "@/components/shared/page-header";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const updateMarketOrderStatus = useAppStore((s) => s.updateMarketOrderStatus);

  const [statusFilter, setStatusFilter] = useState<MarketOrderStatus | "all">("all");

  const rows = useMemo(() => {
    return [...orders]
      .filter((o) => (statusFilter === "all" ? true : o.status === statusFilter))
      .sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt));
  }, [orders, statusFilter]);

  const scoped = useMemo(
    () =>
      orders.filter((o) =>
        statusFilter === "all" ? true : o.status === statusFilter
      ),
    [orders, statusFilter]
  );

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

  const rowActions = (o: MarketOrder) => (
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
      <DropdownMenuContent align="end" className="w-52">
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

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Every marketplace order fulfilled by the STIOOS delivery teams. Track progress, update statuses, and monitor revenue."
        actions={
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm">
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{orders.length}</span>
            <span className="text-muted-foreground">orders</span>
          </div>
        }
      />

      {/* Stat chips — double as status filters; revenue is a read-only stat */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUS_CHIPS.map((chip) => {
          const count =
            chip.value === "all" ? scoped.length : countBy(chip.value);
          const isActive = statusFilter === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => setStatusFilter(chip.value)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
                isActive
                  ? CHIP_ACTIVE[chip.value]
                  : "bg-card text-muted-foreground ring-border hover:text-foreground"
              )}
            >
              {chip.label}
              <span
                className={cn(
                  "rounded-full px-1.5 text-[10px] font-bold",
                  isActive ? "bg-white/20 dark:bg-black/20" : "bg-muted"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-emerald-600"
          title="Sum of all non-cancelled orders"
        >
          Revenue
          <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-bold">
            {formatMoney(revenue)}
          </span>
        </span>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["serviceName", "buyerName", "buyerCompany"]}
        searchPlaceholder="Search service, buyer, company…"
        pageSize={8}
        toolbar={
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as MarketOrderStatus | "all")}
          >
            <SelectTrigger aria-label="Filter orders by status" className="h-9 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
