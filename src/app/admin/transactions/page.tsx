"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, ExternalLink, Wallet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import {
  InvoiceDetailSheet,
  formatMoney,
} from "@/components/dashboard/lifecycle/quote-invoice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionType } from "@/types";

type TxnTab = "all" | TransactionType;

const TABS: { value: TxnTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "payment", label: "Payments" },
  { value: "refund", label: "Refunds" },
  { value: "credit", label: "Credits" },
  { value: "debit", label: "Adjustments" },
];

const METHOD_LABELS: Record<Transaction["method"], string> = {
  card: "Card",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  wallet: "Wallet",
  manual: "Manual",
};

const TYPE_TONE: Record<TransactionType, string> = {
  payment: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  refund: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  credit: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  debit: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  adjustment: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const STATUS_TONE: Record<Transaction["status"], string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  failed: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  refunded: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

export default function AdminTransactionsPage() {
  const transactions = useAppStore((s) => s.transactions);
  const invoices = useAppStore((s) => s.invoices);
  const [tab, setTab] = useState<TxnTab>("all");
  const [invoiceOpen, setInvoiceOpen] = useState<
    ReturnType<typeof useAppStore.getState>["invoices"][number] | null
  >(null);

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [transactions]
  );
  const filtered = useMemo(() => {
    if (tab === "all") return sorted;
    return sorted.filter((t) => t.type === tab);
  }, [sorted, tab]);

  const stats = useMemo(() => {
    const collected = sorted
      .filter((t) => t.type === "payment" && t.status === "success")
      .reduce((s, t) => s + t.amount, 0);
    const refunded = sorted
      .filter((t) => t.type === "refund")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const net = collected - refunded;
    const count = sorted.length;
    return { collected, refunded, net, count };
  }, [sorted]);

  const tabCount = (t: TxnTab) =>
    t === "all" ? sorted.length : sorted.filter((x) => x.type === t).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        title="Transactions"
        description="Every payment, refund and adjustment across the marketplace. Reconcile against invoices and orders."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/invoices">
              <ExternalLink className="mr-1.5 h-4 w-4" /> Invoices
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Collected" value={formatMoney(stats.collected)} icon="TrendingUp" tone="green" />
        <StatCard label="Refunded" value={formatMoney(stats.refunded)} icon="ArrowDownLeft" tone="violet" />
        <StatCard label="Net Revenue" value={formatMoney(stats.net)} icon="Wallet" tone="blue" />
        <StatCard label="Transactions" value={stats.count} icon="Receipt" tone="amber" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TxnTab)}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {t.label}
              <span className="ml-1.5 rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] font-semibold">
                {tabCount(t.value)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No transactions in this view yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Reference</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Buyer</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((txn) => {
                  const inv = txn.invoiceId
                    ? invoices.find((i) => i.id === txn.invoiceId) ?? null
                    : null;
                  return (
                    <tr key={txn.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                        {txn.reference}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
                            TYPE_TONE[txn.type]
                          )}
                        >
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {txn.buyerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {txn.buyerCompany}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        <p className="line-clamp-1">{txn.description}</p>
                        {txn.gatewayReference && (
                          <p className="font-mono text-[10px]">
                            {txn.gatewayReference}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {METHOD_LABELS[txn.method]}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-bold tabular-nums",
                          txn.amount >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {txn.amount >= 0 ? "+" : ""}
                        {formatMoney(txn.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
                            STATUS_TONE[txn.status]
                          )}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {inv && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => setInvoiceOpen(inv)}
                          >
                            Invoice
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InvoiceDetailSheet
        invoice={invoiceOpen}
        open={!!invoiceOpen}
        onOpenChange={(v) => { if (!v) setInvoiceOpen(null); }}
      />
    </div>
  );
}
