"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, ExternalLink, RefreshCw } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import {
  InvoiceDetailSheet,
  InvoiceStatusBadge,
  formatMoney,
} from "@/components/dashboard/lifecycle/quote-invoice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@/types";

type InvoiceTab = "all" | InvoiceStatus;

const TABS: { value: InvoiceTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "issued", label: "Issued / Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
  { value: "void", label: "Void" },
  { value: "draft", label: "Drafts" },
];

export default function AdminInvoicesPage() {
  const invoices = useAppStore((s) => s.invoices);
  const orders = useAppStore((s) => s.orders);
  const refundInvoice = useAppStore((s) => s.refundInvoice);
  const voidInvoice = useAppStore((s) => s.voidInvoice);
  const { toast } = useToast();

  const [tab, setTab] = useState<InvoiceTab>("all");
  const [active, setActive] = useState<Invoice | null>(null);
  const [refundTarget, setRefundTarget] = useState<Invoice | null>(null);
  const [voidTarget, setVoidTarget] = useState<Invoice | null>(null);

  const sorted = useMemo(
    () => [...invoices].sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1)),
    [invoices]
  );
  const filtered = useMemo(() => {
    if (tab === "all") return sorted;
    return sorted.filter((i) => i.status === tab);
  }, [sorted, tab]);

  const stats = useMemo(() => {
    const total = sorted.length;
    const outstanding = sorted
      .filter((i) => i.status === "issued")
      .reduce((s, i) => s + i.total, 0);
    const collected = sorted
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + i.total, 0);
    const refunded = sorted
      .filter((i) => i.status === "refunded")
      .reduce((s, i) => s + i.total, 0);
    return { total, outstanding, collected, refunded };
  }, [sorted]);

  const tabCount = (t: InvoiceTab) =>
    t === "all" ? sorted.length : sorted.filter((i) => i.status === t).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        title="Invoices"
        description="Invoices issued against accepted quotes. Track payment status, issue refunds, and void invoices that should never have been issued."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/transactions">
              <ExternalLink className="mr-1.5 h-4 w-4" /> Transactions
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Invoices" value={stats.total} icon="Receipt" tone="blue" />
        <StatCard
          label="Outstanding"
          value={formatMoney(stats.outstanding)}
          icon="Clock"
          tone="amber"
        />
        <StatCard
          label="Collected"
          value={formatMoney(stats.collected)}
          icon="TrendingUp"
          tone="green"
        />
        <StatCard
          label="Refunded"
          value={formatMoney(stats.refunded)}
          icon="RefreshCw"
          tone="violet"
        />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as InvoiceTab)}>
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
              No invoices in this view yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Reference</th>
                  <th className="px-4 py-2">Buyer</th>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Issued</th>
                  <th className="px-4 py-2">Due</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((inv) => {
                  const ord = orders.find((o) => o.id === inv.orderId);
                  return (
                    <tr
                      key={inv.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => setActive(inv)}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                        {inv.reference}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {inv.buyerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inv.buyerCompany}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {ord ? (
                          <Link
                            href="/admin/orders"
                            className="font-mono text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {ord.id.slice(0, 10)}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(inv.issuedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(inv.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-foreground">
                        {formatMoney(inv.total)}
                      </td>
                      <td className="px-4 py-3">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {inv.status === "paid" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-amber-600"
                              onClick={() => setRefundTarget(inv)}
                            >
                              <RefreshCw className="h-3.5 w-3.5" /> Refund
                            </Button>
                          )}
                          {(inv.status === "issued" || inv.status === "draft") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-rose-600"
                              onClick={() => setVoidTarget(inv)}
                            >
                              Void
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => setActive(inv)}
                          >
                            View <ChevronRight className="ml-0.5 h-3 w-3" />
                          </Button>
                        </div>
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
        invoice={active}
        open={!!active}
        onOpenChange={(v) => { if (!v) setActive(null); }}
      />

      <RefundDialog
        invoice={refundTarget}
        onOpenChange={(v) => { if (!v) setRefundTarget(null); }}
        onConfirm={(reason, amount) => {
          if (!refundTarget) return;
          const res = refundInvoice({
            invoiceId: refundTarget.id,
            reason,
            amount: amount ? Number(amount) : undefined,
          });
          if (res.ok) {
            toast({
              title: "Refund issued",
              description: `${res.transaction?.reference} recorded against ${refundTarget.reference}.`,
            });
            setRefundTarget(null);
          } else {
            toast({
              variant: "destructive",
              title: "Refund failed",
              description: res.error ?? "Something went wrong.",
            });
          }
        }}
      />

      <VoidDialog
        invoice={voidTarget}
        onOpenChange={(v) => { if (!v) setVoidTarget(null); }}
        onConfirm={(reason) => {
          if (!voidTarget) return;
          const res = voidInvoice(voidTarget.id, reason);
          if (res.ok) {
            toast({
              title: "Invoice voided",
              description: `${voidTarget.reference} has been voided.`,
            });
            setVoidTarget(null);
          } else {
            toast({
              variant: "destructive",
              title: "Could not void",
              description: res.error ?? "Something went wrong.",
            });
          }
        }}
      />
    </div>
  );
}

function RefundDialog({
  invoice,
  onOpenChange,
  onConfirm,
}: {
  invoice: Invoice | null;
  onOpenChange: (v: boolean) => void;
  onConfirm: (reason: string, amount: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  if (!invoice) return null;
  return (
    <Dialog open={!!invoice} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b p-5">
          <DialogTitle>Refund Invoice {invoice.reference}</DialogTitle>
          <DialogDescription className="text-xs">
            Issue a refund of {formatMoney(invoice.total)} (or a partial amount) to{" "}
            {invoice.buyerName}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 p-5">
          <div>
            <Label className="text-xs">Reason</Label>
            <Textarea
              rows={3}
              placeholder="e.g. Service partially delivered — 2 of 4 sites not migrated"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Refund amount (leave blank for full)</Label>
            <Input
              type="number"
              min={0}
              max={invoice.total}
              placeholder={String(invoice.total)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="border-t p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => onConfirm(reason, amount)}
          >
            <RefreshCw className="mr-1.5 h-4 w-4" /> Issue Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VoidDialog({
  invoice,
  onOpenChange,
  onConfirm,
}: {
  invoice: Invoice | null;
  onOpenChange: (v: boolean) => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  if (!invoice) return null;
  return (
    <Dialog open={!!invoice} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b p-5">
          <DialogTitle>Void Invoice {invoice.reference}</DialogTitle>
          <DialogDescription className="text-xs">
            Voiding marks this invoice as cancelled. It cannot be paid. Use
            this for invoices issued in error.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 p-5">
          <div>
            <Label className="text-xs">Reason (optional)</Label>
            <Textarea
              rows={3}
              placeholder="e.g. Issued in error — wrong line items"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="border-t p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(reason)}>
            Void Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
