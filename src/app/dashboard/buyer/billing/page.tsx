"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { CreditCard, Download, DollarSign, Receipt } from "lucide-react";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useMemo } from "react";

export default function BillingPage() {
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
  const orders = useAppStore((s) => s.orders);

  const myOrders = useMemo(
    () => orders.filter((o) => o.buyerId === user?.id),
    [orders, user]
  );

  const totalSpent = myOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="mt-1 text-sm text-slate-400">Track your spending, invoices, and payment methods.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Total Spent</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sky-400">
            <Receipt className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Orders</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{myOrders.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Payment Method</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-white">•••• 4242</p>
        </div>
      </div>

      {/* Invoices table */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Invoice History</h2>
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-3 text-xs font-semibold text-slate-200 hover:bg-white/10">
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2 pr-4">Invoice ID</th>
                <th className="pb-2 pr-4">Service</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Amount</th>
                <th className="pb-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {myOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">No invoices yet.</td>
                </tr>
              ) : (
                myOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-400">{order.id}</td>
                    <td className="py-3 pr-4 text-white">{order.serviceName}</td>
                    <td className="py-3 pr-4 text-slate-400">{order.createdAt?.split("T")[0] ?? "—"}</td>
                    <td className="py-3 pr-4 font-semibold text-white">${(order.amount || 0).toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
