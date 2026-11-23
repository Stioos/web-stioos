"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  CreditCard,
  Download,
  Inbox,
  Receipt,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { timeAgo } from "@/components/dashboard/shared";
import {
  InvoiceDetailSheet,
  InvoiceStatusBadge,
  PaymentDialog,
  formatMoney,
} from "@/components/dashboard/lifecycle/quote-invoice";
import { Button } from "@/components/ui/button";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types";

type InvoiceTab = "all" | InvoiceStatus;

const TABS: { value: InvoiceTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "issued", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
  { value: "void", label: "Void" },
];

const STATUS_DOT: Record<InvoiceStatus, string> = {
  draft: "bg-slate-400",
  issued: "bg-amber-400",
  paid: "bg-emerald-400",
  void: "bg-slate-500",
  refunded: "bg-rose-400",
};

export default function BuyerBillingPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Billing">
        <BillingContent />
      </DashboardShell>
    </RequireRole>
  );
}

function BillingContent() {
  const user = useCurrentUser();
  const invoices = useAppStore((s) => s.invoices);
  const orders = useAppStore((s) => s.orders);
  const transactions = useAppStore((s) => s.transactions);
  const [tab, setTab] = useState<InvoiceTab>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const myInvoices = useMemo(() => {
    if (!user) return [];
    return invoices
      .filter((i) => i.buyerId === user.id)
      .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1));
  }, [invoices, user]);

  const filtered = useMemo(() => {
    if (tab === "all") return myInvoices;
    return myInvoices.filter((i) => i.status === tab);
  }, [myInvoices, tab]);

  const counts = useMemo(() => {
    const map = new Map<InvoiceTab, number>([["all", myInvoices.length]]);
    for (const i of myInvoices) {
      map.set(i.status, (map.get(i.status) ?? 0) + 1);
    }
    return map;
  }, [myInvoices]);

  const stats = useMemo(() => {
    const totalPaid = myInvoices
      .filter((i) => i.status === "paid" || i.status === "refunded")
      .reduce((s, i) => s + i.total, 0);
    const outstanding = myInvoices
      .filter((i) => i.status === "issued")
      .reduce((s, i) => s + i.total, 0);
    const refunded = transactions
      .filter((t) => t.buyerId === user?.id && t.type === "refund")
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    return {
      totalPaid,
      outstanding,
      refunded,
      invoiceCount: myInvoices.length,
    };
  }, [myInvoices, transactions, user]);

  const selected = useMemo(() => {
    if (selectedId) {
      const found = myInvoices.find((i) => i.id === selectedId);
      if (found) return found;
    }
    return filtered[0] ?? null;
  }, [selectedId, myInvoices, filtered]);

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl">
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Sidebar — invoice list (LEFT) */}
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          <div className="shrink-0 border-b border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Invoices ({filtered.length})
              </p>
              <span className="text-[10px] text-slate-500">
                {tab === "all" ? "All statuses" : TABS.find((t) => t.value === tab)?.label}
              </span>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <div>
                  <Inbox className="mx-auto h-8 w-8 text-slate-600" />
                  <p className="mt-2 text-xs font-medium text-slate-400">
                    No invoices match this filter
                  </p>
                </div>
              </div>
            ) : (
              filtered.map((inv) => {
                const isActive = selected?.id === inv.id;
                const ord = orders.find((o) => o.id === inv.orderId);
                return (
                  <button
                    key={inv.id}
                    type="button"
                    onClick={() => setSelectedId(inv.id)}
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
                          STATUS_DOT[inv.status]
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate font-mono text-sm font-semibold",
                            isActive ? "text-amber-300" : "text-white"
                          )}
                        >
                          {inv.reference}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                          {ord?.serviceName ?? "—"}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <InvoiceStatusBadge status={inv.status} />
                          <span className="text-[10px] font-bold tabular-nums text-emerald-300">
                            {formatMoney(inv.total)}
                          </span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {timeAgo(inv.issuedAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Inspector — invoice detail with tabs + stats at top (RIGHT) */}
        <section className="flex min-h-0 flex-col overflow-hidden">
          {/* Stats strip */}
          <div className="mb-3 grid shrink-0 grid-cols-4 gap-2">
            <StatBox label="Total Paid" value={formatMoney(stats.totalPaid)} tone="text-emerald-300" />
            <StatBox label="Outstanding" value={formatMoney(stats.outstanding)} tone="text-amber-300" />
            <StatBox label="Refunded" value={formatMoney(stats.refunded)} tone="text-rose-300" />
            <StatBox label="Invoices" value={String(stats.invoiceCount)} tone="text-sky-300" />
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
              <InvoiceInspector
                invoice={selected}
                onViewDetail={(inv) => setDetailInvoice(inv)}
                onPay={(inv) => setPayInvoice(inv)}
                onReceipt={(inv) =>
                  toast({
                    title: "Receipt downloaded",
                    description: `Receipt for ${inv.reference} (${formatMoney(inv.total)}) downloaded as PDF.`,
                  })
                }
              />
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                <div>
                  <Receipt className="mx-auto h-10 w-10 text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    Select an invoice from the sidebar
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    View its details, pay outstanding invoices, and download receipts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <InvoiceDetailSheet
        invoice={detailInvoice}
        open={!!detailInvoice}
        onOpenChange={(v) => { if (!v) setDetailInvoice(null); }}
        actions={
          detailInvoice && detailInvoice.status === "issued" ? (
            <Button
              onClick={() => {
                setPayInvoice(detailInvoice);
                setDetailInvoice(null);
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CreditCard className="mr-1.5 h-4 w-4" /> Pay {formatMoney(detailInvoice.total)}
            </Button>
          ) : null
        }
      />

      <PaymentDialog
        open={!!payInvoice}
        onOpenChange={(v) => { if (!v) setPayInvoice(null); }}
        invoice={payInvoice}
        onPaid={() => {
          toast({
            title: "Payment successful",
            description: payInvoice
              ? `${payInvoice.reference} paid. Your order is now in progress.`
              : "Invoice paid.",
          });
        }}
      />
    </div>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={cn("mt-1 text-sm font-bold", tone)}>{value}</p>
    </div>
  );
}

function InvoiceInspector({
  invoice,
  onViewDetail,
  onPay,
  onReceipt,
}: {
  invoice: Invoice;
  onViewDetail: (inv: Invoice) => void;
  onPay: (inv: Invoice) => void;
  onReceipt: (inv: Invoice) => void;
}) {
  const orders = useAppStore((s) => s.orders);
  const ord = orders.find((o) => o.id === invoice.orderId);

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
              Invoice Inspector
            </p>
            <h2 className="mt-0.5 font-mono text-lg font-bold text-white sm:text-xl">
              {invoice.reference}
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {ord?.serviceName ?? "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Status + actions */}
      <div className="flex flex-wrap items-center gap-2 py-4">
        <InvoiceStatusBadge status={invoice.status} />
        {invoice.status === "issued" && (
          <Button size="sm" onClick={() => onPay(invoice)} className="bg-emerald-600 hover:bg-emerald-700">
            <CreditCard className="h-3.5 w-3.5" /> Pay {formatMoney(invoice.total)}
          </Button>
        )}
        {invoice.status === "paid" && (
          <Button size="sm" variant="outline" onClick={() => onReceipt(invoice)}>
            <Download className="h-3.5 w-3.5" /> Download Receipt
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => onViewDetail(invoice)} className="ml-auto text-amber-300">
          View Full Invoice <ChevronRight className="ml-0.5 h-3 w-3" />
        </Button>
      </div>

      {/* Detail fields */}
      <div className="grid grid-cols-2 gap-3 py-3 sm:grid-cols-3">
        <InspectorField
          label="Amount Due"
          value={
            <span className="text-xl font-bold text-emerald-300">
              {formatMoney(invoice.total)}
            </span>
          }
        />
        <InspectorField
          label="Issued"
          value={<span className="text-slate-200">{timeAgo(invoice.issuedAt)}</span>}
        />
        <InspectorField
          label="Due Date"
          value={
            <span
              className={cn(
                invoice.status === "issued" && "font-semibold text-amber-300"
              )}
            >
              {timeAgo(invoice.dueDate)}
            </span>
          }
        />
      </div>

      {/* Payment info */}
      {invoice.paidAt && (
        <div className="py-3">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Payment Details
          </p>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Paid on</span>
              <span className="text-white">{timeAgo(invoice.paidAt)}</span>
            </div>
            {invoice.paymentMethod && (
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-300">Method</span>
                <span className="capitalize text-white">
                  {invoice.paymentMethod.replace("_", " ")}
                </span>
              </div>
            )}
            {invoice.paymentReference && (
              <div className="mt-1 flex items-center justify-between">
                <span className="text-slate-300">Reference</span>
                <span className="font-mono text-white">{invoice.paymentReference}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="py-3">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Notes
          </p>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
            {invoice.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <Link
          href="/dashboard/buyer/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-amber-300"
        >
          <Receipt className="h-3 w-3" /> View transactions
        </Link>
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
