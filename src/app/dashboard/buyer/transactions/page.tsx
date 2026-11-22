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
import {
  EmptyState,
  SectionCard,
  StatusBadge,
  formatDate,
  timeAgo,
} from "@/components/dashboard/shared";
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

const TXN_TABS: { value: TxnTab; label: string }[] = [
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

export default function BuyerTransactionsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="My Transactions · Buyer Dashboard">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <TransactionsContent />
        </div>
      </DashboardShell>
    </RequireRole>
  );
}

function TransactionsContent() {
  const user = useCurrentUser();
  const transactions = useAppStore((s) => s.transactions);
  const invoices = useAppStore((s) => s.invoices);
  const [tab, setTab] = useState<TxnTab>("all");
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

  const stats = useMemo(() => {
    const paid = myTxns
      .filter((t) => t.type === "payment" && t.status === "success")
      .reduce((s, t) => s + t.amount, 0);
    const refunded = myTxns
      .filter((t) => t.type === "refund")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const net = paid - refunded;
    return {
      paid,
      refunded,
      net,
      count: myTxns.length,
    };
  }, [myTxns]);

  const tabCount = (t: TxnTab) =>
    t === "all" ? myTxns.length : myTxns.filter((x) => x.type === t).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Marketplace · Buyer
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            My Transactions
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            Every payment, refund and adjustment tied to your service requests,
            orders and talent engagements.
          </p>
        </div>
        <Link href="/dashboard/buyer/billing">
          <Button variant="outline" size="sm">
            <Download className="mr-1.5 h-4 w-4" /> Download Invoices
          </Button>
        </Link>
      </div>

      {/* Stats strip */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBox
          label="Total Paid"
          value={formatMoney(stats.paid)}
          icon={<ArrowUpRight className="h-4 w-4 text-emerald-400" />}
          tone="text-emerald-300"
        />
        <StatBox
          label="Refunded"
          value={formatMoney(stats.refunded)}
          icon={<ArrowDownLeft className="h-4 w-4 text-rose-400" />}
          tone="text-rose-300"
        />
        <StatBox
          label="Net Spend"
          value={formatMoney(stats.net)}
          icon={<Wallet className="h-4 w-4 text-amber-400" />}
          tone="text-amber-300"
        />
        <StatBox
          label="Transactions"
          value={String(stats.count)}
          icon={<Receipt className="h-4 w-4 text-sky-400" />}
          tone="text-sky-300"
        />
      </div>

      {/* Filter tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TxnTab)} className="mt-5">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 h-auto p-1 bg-white/[0.03]">
          {TXN_TABS.map((t) => (
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

      {/* Transactions list */}
      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No transactions yet"
            description="Payments you make against invoices will appear here, with linked receipts."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.04] text-left text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-2">Reference</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((txn) => {
                  const invoice = txn.invoiceId
                    ? invoices.find((i) => i.id === txn.invoiceId) ?? null
                    : null;
                  return (
                    <tr key={txn.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-mono text-slate-200">
                        {txn.reference}
                      </td>
                      <td className="px-4 py-3">
                        <TxnTypeBadge type={txn.type} />
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <p className="line-clamp-1">{txn.description}</p>
                        {invoice && (
                          <p className="text-[11px] text-slate-500">
                            Invoice {invoice.reference}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {METHOD_LABELS[txn.method]}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {formatDate(txn.createdAt)}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right font-bold tabular-nums",
                          txn.amount >= 0 ? "text-emerald-300" : "text-rose-300"
                        )}
                      >
                        {txn.amount >= 0 ? "+" : ""}
                        {formatMoney(txn.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <TxnStatusPill status={txn.status} />
                      </td>
                      <td className="px-4 py-3">
                        {invoice && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-amber-300"
                            onClick={() => setInvoiceOpen(invoice)}
                          >
                            <Receipt className="mr-1 h-3.5 w-3.5" /> Invoice
                            <ChevronRight className="ml-0.5 h-3 w-3" />
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

      {/* Related: linked invoices summary */}
      <SectionCard title="Linked invoices" className="mt-5 bg-white/[0.03]">
        <p className="mb-3 text-xs text-slate-400">
          Invoices issued against your service requests and talent engagements.
        </p>
        <RelatedInvoices />
      </SectionCard>

      <InvoiceDetailSheet
        invoice={invoiceOpen}
        open={!!invoiceOpen}
        onOpenChange={(v) => { if (!v) setInvoiceOpen(null); }}
      />
    </>
  );
}

function RelatedInvoices() {
  const user = useCurrentUser();
  const invoices = useAppStore((s) => s.invoices);
  const orders = useAppStore((s) => s.orders);
  const myInvoices = useMemo(() => {
    if (!user) return [];
    return invoices
      .filter((i) => i.buyerId === user.id)
      .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1));
  }, [invoices, user]);

  if (myInvoices.length === 0) {
    return (
      <p className="text-sm text-slate-500">No invoices issued yet.</p>
    );
  }
  return (
    <div className="overflow-hidden rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.04] text-left text-[11px] uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-3 py-2">Invoice</th>
            <th className="px-3 py-2">Order</th>
            <th className="px-3 py-2">Issued</th>
            <th className="px-3 py-2">Due</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {myInvoices.map((inv) => {
            const ord = orders.find((o) => o.id === inv.orderId);
            return (
              <tr key={inv.id} className="hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-mono text-slate-200">
                  {inv.reference}
                </td>
                <td className="px-3 py-3 text-slate-300">
                  {ord?.serviceName ?? "—"}
                </td>
                <td className="px-3 py-2 text-slate-300">
                  {formatDate(inv.issuedAt)}
                </td>
                <td className="px-3 py-2 text-slate-300">
                  {formatDate(inv.dueDate)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-200">
                  {formatMoney(inv.total)}
                </td>
                <td className="px-3 py-2">
                  <InvoiceStatusBadge status={inv.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-wider text-slate-500">
          {label}
        </p>
        {icon}
      </div>
      <p className={cn("mt-1 text-xl font-bold", tone)}>{value}</p>
    </div>
  );
}

function TxnTypeBadge({ type }: { type: TransactionType }) {
  const map: Record<TransactionType, { label: string; tone: string }> = {
    payment: { label: "Payment", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
    refund: { label: "Refund", tone: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300" },
    credit: { label: "Credit", tone: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300" },
    debit: { label: "Adjustment", tone: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
    adjustment: { label: "Adjustment", tone: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  };
  const meta = map[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        meta.tone
      )}
    >
      {meta.label}
    </span>
  );
}

function TxnStatusPill({ status }: { status: Transaction["status"] }) {
  const map: Record<Transaction["status"], string> = {
    pending: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    failed: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    refunded: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize",
        map[status]
      )}
    >
      {status}
    </span>
  );
}
