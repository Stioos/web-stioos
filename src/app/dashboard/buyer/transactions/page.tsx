"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Download,
  Inbox,
  Receipt,
  Wallet,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusBadge, formatDate, timeAgo } from "@/components/dashboard/shared";
import {
  InvoiceDetailSheet,
  InvoiceStatusBadge,
  formatMoney,
} from "@/components/dashboard/lifecycle/quote-invoice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Invoice, Transaction, TransactionType } from "@/types";

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

const STATUS_DOT: Record<TransactionType, string> = {
  payment: "bg-emerald-400",
  refund: "bg-rose-400",
  credit: "bg-sky-400",
  debit: "bg-amber-400",
  adjustment: "bg-amber-400",
};

export default function BuyerTransactionsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="My Transactions">
        <TransactionsContent />
      </DashboardShell>
    </RequireRole>
  );
}

function TransactionsContent() {
  const user = useCurrentUser();
  const transactions = useAppStore((s) => s.transactions);
  const invoices = useAppStore((s) => s.invoices);
  const [tab, setTab] = useState<TxnTab>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState<Invoice | null>(null);

  const myTxns = useMemo(() => {
    if (!user) return [];
    return transactions
      .filter((t) => t.buyerId === user.id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [transactions, user]);

  const filtered = useMemo(() => {
    if (tab === "all") return myTxns;
    return myTxns.filter((t) => t.type === tab);
  }, [myTxns, tab]);

  const counts = useMemo(() => {
    const map = new Map<TxnTab, number>([["all", myTxns.length]]);
    for (const t of myTxns) {
      map.set(t.type, (map.get(t.type) ?? 0) + 1);
    }
    return map;
  }, [myTxns]);

  const stats = useMemo(() => {
    const paid = myTxns
      .filter((t) => t.type === "payment" && t.status === "success")
      .reduce((s, t) => s + t.amount, 0);
    const refunded = myTxns
      .filter((t) => t.type === "refund")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const net = paid - refunded;
    return { paid, refunded, net, count: myTxns.length };
  }, [myTxns]);

  const selected = useMemo(() => {
    if (selectedId) {
      const found = myTxns.find((t) => t.id === selectedId);
      if (found) return found;
    }
    return filtered[0] ?? null;
  }, [selectedId, myTxns, filtered]);

  const findInvoice = (txn: Transaction) =>
    txn.invoiceId ? invoices.find((i) => i.id === txn.invoiceId) ?? null : null;

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl">
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Sidebar — transactions list (LEFT) */}
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="shrink-0 border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Transactions ({filtered.length})
              </p>
              <span className="text-[10px] text-slate-500">
                {tab === "all" ? "All types" : TABS.find((t) => t.value === tab)?.label}
              </span>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <div>
                  <Inbox className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    No transactions match this filter
                  </p>
                </div>
              </div>
            ) : (
              filtered.map((txn) => {
                const isActive = selected?.id === txn.id;
                return (
                  <button
                    key={txn.id}
                    type="button"
                    onClick={() => setSelectedId(txn.id)}
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
                          STATUS_DOT[txn.type]
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
                          {txn.reference}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                          {txn.description}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold capitalize",
                              TYPE_TONE[txn.type]
                            )}
                          >
                            {txn.type}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold tabular-nums",
                              txn.amount >= 0 ? "text-emerald-300" : "text-rose-300"
                            )}
                          >
                            {txn.amount >= 0 ? "+" : ""}
                            {formatMoney(txn.amount)}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {timeAgo(txn.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Inspector — transaction detail with tabs at top (RIGHT) */}
        <section className="flex min-h-0 flex-col overflow-hidden">
          {/* Stats strip */}
          <div className="mb-3 grid shrink-0 grid-cols-4 gap-2">
            <StatBox
              label="Total Paid"
              value={formatMoney(stats.paid)}
              icon={<ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />}
              tone="text-emerald-300"
            />
            <StatBox
              label="Refunded"
              value={formatMoney(stats.refunded)}
              icon={<ArrowDownLeft className="h-3.5 w-3.5 text-rose-400" />}
              tone="text-rose-300"
            />
            <StatBox
              label="Net Spend"
              value={formatMoney(stats.net)}
              icon={<Wallet className="h-3.5 w-3.5 text-amber-400" />}
              tone="text-amber-300"
            />
            <StatBox
              label="Count"
              value={String(stats.count)}
              icon={<Receipt className="h-3.5 w-3.5 text-sky-400" />}
              tone="text-sky-300"
            />
          </div>

          {/* Filter tabs */}
          <div className="mb-3 flex shrink-0 flex-wrap items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {TABS.map((t) => {
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
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-white/10 text-slate-400"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Inspector content */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            {selected ? (
              <TransactionInspector
                txn={selected}
                invoice={findInvoice(selected)}
                onViewInvoice={(inv) => setInvoiceOpen(inv)}
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                <div>
                  <Receipt className="mx-auto h-10 w-10 text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    Select a transaction from the sidebar
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    View its details, linked invoice, and payment metadata.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <InvoiceDetailSheet
        invoice={invoiceOpen}
        open={!!invoiceOpen}
        onOpenChange={(v) => { if (!v) setInvoiceOpen(null); }}
      />
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        {icon}
      </div>
      <p className={cn("mt-1 text-sm font-bold", tone)}>{value}</p>
    </div>
  );
}

function TransactionInspector({
  txn,
  invoice,
  onViewInvoice,
}: {
  txn: Transaction;
  invoice: Invoice | null;
  onViewInvoice: (inv: Invoice) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      {/* Inspector header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <Receipt className="h-5 w-5 text-amber-400" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300">
              Transaction Inspector
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-white sm:text-xl">
              {txn.reference}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {txn.description}
            </p>
          </div>
        </div>
      </div>

      {/* Amount + status */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
            TYPE_TONE[txn.type]
          )}
        >
          {txn.type}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
            STATUS_TONE[txn.status]
          )}
        >
          {txn.status}
        </span>
      </div>

      {/* Detail fields */}
      <div className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-3">
        <InspectorField
          label="Amount"
          value={
            <span
              className={cn(
                "text-xl font-bold",
                txn.amount >= 0 ? "text-emerald-300" : "text-rose-300"
              )}
            >
              {txn.amount >= 0 ? "+" : ""}
              {formatMoney(txn.amount)}
            </span>
          }
          icon={<Wallet className="h-3.5 w-3.5 text-amber-400" />}
        />
        <InspectorField
          label="Method"
          value={<span className="capitalize text-slate-200">{METHOD_LABELS[txn.method]}</span>}
          icon={<Receipt className="h-3.5 w-3.5 text-sky-400" />}
        />
        <InspectorField
          label="Date"
          value={<span className="text-slate-200">{formatDate(txn.createdAt)}</span>}
          icon={<ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />}
        />
      </div>

      {/* Gateway reference */}
      {txn.gatewayReference && (
        <div className="py-3">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Gateway Reference
          </p>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 font-mono text-sm text-slate-300">
            {txn.gatewayReference}
          </div>
        </div>
      )}

      {/* Metadata */}
      {txn.meta && Object.keys(txn.meta).length > 0 && (
        <div className="py-3">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Payment Metadata
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(txn.meta).map(([k, v]) => (
              <div
                key={k}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm"
              >
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{k}</p>
                <p className="mt-0.5 text-slate-200">{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked invoice */}
      <div className="mt-2 space-y-3 py-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Linked Records
        </p>
        {invoice ? (
          <button
            type="button"
            onClick={() => onViewInvoice(invoice)}
            className="group flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left transition-colors hover:border-amber-400/30 hover:bg-white/[0.05]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky-400/10 ring-1 ring-sky-400/20">
              <Receipt className="h-4 w-4 text-sky-400" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-300">Invoice</p>
              <p className="truncate font-mono text-sm text-white">
                {invoice.reference} · {formatMoney(invoice.total)}
              </p>
            </div>
            <InvoiceStatusBadge status={invoice.status} />
            <ChevronRight className="h-4 w-4 text-slate-500 transition-colors group-hover:text-amber-300" />
          </button>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 p-3 text-xs text-slate-500">
            No linked invoice for this transaction.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <Link
          href="/dashboard/buyer/billing"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-amber-300"
        >
          <Download className="h-3 w-3" /> View all invoices
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
