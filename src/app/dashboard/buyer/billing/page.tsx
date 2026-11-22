"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
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
  formatMoney,
  timeAgo,
} from "@/components/dashboard/shared";
import {
  InvoiceDetailSheet,
  InvoiceStatusBadge,
  PaymentDialog,
} from "@/components/dashboard/lifecycle/quote-invoice";
import { Button } from "@/components/ui/button";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/types";

export default function BuyerBillingPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Billing · Buyer Dashboard">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <BillingContent />
        </div>
      </DashboardShell>
    </RequireRole>
  );
}

function BillingContent() {
  const user = useCurrentUser();
  const invoices = useAppStore((s) => s.invoices);
  const orders = useAppStore((s) => s.orders);
  const transactions = useAppStore((s) => s.transactions);
  const [detailOpen, setDetailOpen] = useState<Invoice | null>(null);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const myInvoices = useMemo(() => {
    if (!user) return [];
    return invoices
      .filter((i) => i.buyerId === user.id)
      .sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1));
  }, [invoices, user]);

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

  const handlePay = (inv: Invoice) => {
    setPayInvoice(inv);
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Marketplace · Buyer
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Billing & Invoices
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-300">
            Invoices issued against your service requests and talent
            engagements. Pay outstanding invoices, view receipts, and track
            payment history.
          </p>
        </div>
        <Link href="/dashboard/buyer/transactions">
          <Button variant="outline" size="sm">
            <Wallet className="mr-1.5 h-4 w-4" /> View Transactions
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BillingStat
          label="Total Paid"
          value={formatMoney(stats.totalPaid)}
          icon={<Receipt className="h-4 w-4 text-emerald-400" />}
          tone="text-emerald-300"
        />
        <BillingStat
          label="Outstanding"
          value={formatMoney(stats.outstanding)}
          icon={<CreditCard className="h-4 w-4 text-amber-400" />}
          tone="text-amber-300"
        />
        <BillingStat
          label="Refunded"
          value={formatMoney(stats.refunded)}
          icon={<Download className="h-4 w-4 text-rose-400" />}
          tone="text-rose-300"
        />
        <BillingStat
          label="Invoices"
          value={String(stats.invoiceCount)}
          icon={<Receipt className="h-4 w-4 text-sky-400" />}
          tone="text-sky-300"
        />
      </div>

      {/* Payment method */}
      <SectionCard title="Payment method" className="mt-5 bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-14 items-center justify-center rounded-md bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-bold text-white">
              VISA
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Visa ending in 4242
              </p>
              <p className="text-[11px] text-slate-400">
                Expires 12 / 28 · Default payment method
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <CreditCard className="mr-1.5 h-4 w-4" /> Manage
          </Button>
        </div>
      </SectionCard>

      {/* Invoices table */}
      <SectionCard
        title="Invoice history"
        className="mt-5 bg-white/[0.03]"
        action={
          <span className="text-xs text-slate-400">
            {myInvoices.length} invoice{myInvoices.length === 1 ? "" : "s"}
          </span>
        }
      >
        {myInvoices.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-8 w-8" />}
            title="No invoices yet"
            description="When the STIOOS team creates an order against your accepted quote, the invoice will appear here."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.04] text-left text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-2">Invoice</th>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Issued</th>
                  <th className="px-4 py-2">Due</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {myInvoices.map((inv) => {
                  const ord = orders.find((o) => o.id === inv.orderId);
                  return (
                    <tr key={inv.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 font-mono text-slate-200">
                        {inv.reference}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <p className="line-clamp-1">
                          {ord?.serviceName ?? "—"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {ord?.id}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {timeAgo(inv.issuedAt)}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {timeAgo(inv.dueDate)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-200">
                        {formatMoney(inv.total)}
                      </td>
                      <td className="px-4 py-3">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-slate-300"
                            onClick={() => setDetailOpen(inv)}
                          >
                            View
                          </Button>
                          {inv.status === "issued" && (
                            <Button
                              size="sm"
                              className="h-7 bg-emerald-600 px-2 hover:bg-emerald-700"
                              onClick={() => handlePay(inv)}
                            >
                              <CreditCard className="mr-1 h-3.5 w-3.5" /> Pay
                            </Button>
                          )}
                          {inv.status === "paid" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-amber-300"
                              onClick={() =>
                                toast({
                                  title: "Receipt downloaded",
                                  description: `Receipt for ${inv.reference} (${formatMoney(inv.total)}) downloaded as PDF.`,
                                })
                              }
                            >
                              <Download className="h-3.5 w-3.5" /> Receipt
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <InvoiceDetailSheet
        invoice={detailOpen}
        open={!!detailOpen}
        onOpenChange={(v) => { if (!v) setDetailOpen(null); }}
        actions={
          detailOpen && detailOpen.status === "issued" ? (
            <Button
              onClick={() => {
                setPayInvoice(detailOpen);
                setDetailOpen(null);
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <CreditCard className="mr-1.5 h-4 w-4" /> Pay {formatMoney(detailOpen.total)}
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
    </>
  );
}

function BillingStat({
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
