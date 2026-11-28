"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Plus,
  Receipt,
  Trash2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { Invoice, PaymentMethod, Quote } from "@/types";
import { useAppStore } from "@/lib/store";

// ============================================================
// QUOTE / INVOICE DISPLAY + INTERACTIVE DIALOGS
// ============================================================

export function formatMoney(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
}

const QUOTE_STATUS_TONE: Record<Quote["status"], string> = {
  draft: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
  sent: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  accepted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  declined: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  expired: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

const INVOICE_STATUS_TONE: Record<Invoice["status"], string> = {
  draft: "border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300",
  issued: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  paid: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  void: "border-slate-500/30 bg-slate-500/10 text-slate-500",
  refunded: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export function QuoteStatusBadge({ status }: { status: Quote["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
        QUOTE_STATUS_TONE[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

export function InvoiceStatusBadge({ status }: { status: Invoice["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
        INVOICE_STATUS_TONE[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}

/**
 * Quote card showing line items, totals, validity, and notes.
 * Read-only by default; buyer actions (Accept / Decline) rendered
 * by parent only when the quote status is "sent".
 */
export function QuoteCard({
  quote,
  className,
  actions,
}: {
  quote: Quote;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent p-5",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold tracking-wider text-violet-700 dark:text-violet-300">
              {quote.reference}
            </p>
            <QuoteStatusBadge status={quote.status} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Issued {formatDate(quote.issuedAt)} · Valid until{" "}
            {formatDate(quote.validUntil)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Total
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatMoney(quote.total)}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Description
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-16">
                Qty
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-28">
                Unit Price
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-28">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {quote.items.map((it) => (
              <tr key={it.id}>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                  {it.description}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                  {it.quantity}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                  {formatMoney(it.unitPrice)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium text-slate-900 dark:text-white">
                  {formatMoney(it.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-x-8 gap-y-1 text-sm">
        <div className="flex justify-between gap-6 text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatMoney(quote.subtotal)}</span>
        </div>
        {quote.taxRate > 0 && (
          <div className="flex justify-between gap-6 text-slate-600 dark:text-slate-400">
            <span>Tax ({quote.taxRate}%)</span>
            <span className="tabular-nums">{formatMoney(quote.taxAmount)}</span>
          </div>
        )}
        {quote.discount > 0 && (
          <div className="flex justify-between gap-6 text-slate-600 dark:text-slate-400">
            <span>Discount</span>
            <span className="tabular-nums">−{formatMoney(quote.discount)}</span>
          </div>
        )}
        <div className="flex justify-between gap-6 font-bold text-slate-900 dark:text-white">
          <span>Total</span>
          <span className="tabular-nums">{formatMoney(quote.total)}</span>
        </div>
      </div>

      {quote.notes && (
        <p className="mt-3 rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
          <span className="font-semibold">Notes: </span>
          {quote.notes}
        </p>
      )}

      {quote.status === "declined" && quote.declineReason && (
        <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
          <span className="font-semibold">Decline reason: </span>
          {quote.declineReason}
        </p>
      )}

      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/**
 * Invoice card showing line items, totals, due date, and payment
 * status. Includes a "Pay Now" action slot when status is "issued".
 */
export function InvoiceCard({
  invoice,
  className,
  actions,
}: {
  invoice: Invoice;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-transparent p-5",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <p className="text-sm font-bold tracking-wider text-sky-700 dark:text-sky-300">
              {invoice.reference}
            </p>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Issued {formatDate(invoice.issuedAt)} · Due{" "}
            <span className={cn(invoice.status === "issued" && "font-semibold text-amber-600")}>
              {formatDate(invoice.dueDate)}
            </span>
          </p>
          {invoice.paidAt && (
            <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
              Paid {formatDate(invoice.paidAt)} · {invoice.paymentReference ?? "—"}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-slate-500">
            Amount Due
          </p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            {formatMoney(invoice.total)}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Description
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-16">
                Qty
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-28">
                Unit Price
              </th>
              <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-28">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {invoice.items.map((it) => (
              <tr key={it.id}>
                <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                  {it.description}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                  {it.quantity}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-600 dark:text-slate-400">
                  {formatMoney(it.unitPrice)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-medium text-slate-900 dark:text-white">
                  {formatMoney(it.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-x-8 gap-y-1 text-sm">
        <div className="flex justify-between gap-6 text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatMoney(invoice.subtotal)}</span>
        </div>
        {invoice.taxRate > 0 && (
          <div className="flex justify-between gap-6 text-slate-600 dark:text-slate-400">
            <span>Tax ({invoice.taxRate}%)</span>
            <span className="tabular-nums">{formatMoney(invoice.taxAmount)}</span>
          </div>
        )}
        {invoice.discount > 0 && (
          <div className="flex justify-between gap-6 text-slate-600 dark:text-slate-400">
            <span>Discount</span>
            <span className="tabular-nums">−{formatMoney(invoice.discount)}</span>
          </div>
        )}
        <div className="flex justify-between gap-6 font-bold text-slate-900 dark:text-white">
          <span>Total</span>
          <span className="tabular-nums">{formatMoney(invoice.total)}</span>
        </div>
      </div>

      {invoice.notes && (
        <p className="mt-3 rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
          <span className="font-semibold">Notes: </span>
          {invoice.notes}
        </p>
      )}

      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ============================================================
// QUOTE BUILDER DIALOG (admin-side)
// ============================================================

interface QuoteDraftItem {
  description: string;
  quantity: string;
  unitPrice: string;
}

export function QuoteBuilderDialog({
  open,
  onOpenChange,
  requestId,
  requestTitle,
  buyerName,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  requestId: string;
  requestTitle: string;
  buyerName: string;
}) {
  const issueQuote = useAppStore((s) => s.issueQuote);
  const [items, setItems] = useState<QuoteDraftItem[]>([
    { description: "", quantity: "1", unitPrice: "0" },
  ]);
  const [taxRate, setTaxRate] = useState("0");
  const [validityDays, setValidityDays] = useState("14");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const sub = items.reduce((acc, it) => {
      const q = Number(it.quantity) || 0;
      const p = Number(it.unitPrice) || 0;
      return acc + q * p;
    }, 0);
    const t = Math.round(sub * (Number(taxRate) || 0) / 100 * 100) / 100;
    return { sub, tax: t, total: Math.round((sub + t) * 100) / 100 };
  }, [items, taxRate]);

  const updateItem = (idx: number, patch: Partial<QuoteDraftItem>) =>
    setItems((arr) => arr.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const removeItem = (idx: number) =>
    setItems((arr) => arr.filter((_, i) => i !== idx));

  const addItem = () =>
    setItems((arr) => [...arr, { description: "", quantity: "1", unitPrice: "0" }]);

  const reset = () => {
    setItems([{ description: "", quantity: "1", unitPrice: "0" }]);
    setTaxRate("0");
    setValidityDays("14");
    setNotes("");
    setError(null);
  };

  const handleSubmit = () => {
    setError(null);
    const cleaned = items
      .map((it) => ({
        description: it.description.trim(),
        quantity: Number(it.quantity) || 0,
        unitPrice: Number(it.unitPrice) || 0,
      }))
      .filter((it) => it.description && it.quantity > 0 && it.unitPrice >= 0);
    if (!cleaned.length) {
      setError("Add at least one line item with a description and quantity.");
      return;
    }
    const res = issueQuote({
      requestId,
      items: cleaned,
      taxRate: Number(taxRate) || 0,
      validityDays: Number(validityDays) || 14,
      notes: notes.trim() || undefined,
    });
    if (!res.ok) {
      setError(res.error ?? "Unable to issue quote.");
      return;
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl gap-0 overflow-y-auto p-0 sm:max-h-[90vh]">
        <DialogHeader className="border-b border-slate-200 p-5 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-base">
            Issue Quote
          </DialogTitle>
          <DialogDescription className="text-xs">
            For <span className="font-semibold text-slate-700 dark:text-slate-200">{requestTitle}</span> · Buyer: {buyerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs uppercase tracking-wider text-slate-500">
                Line items
              </Label>
              <Button size="sm" variant="outline" onClick={addItem}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Add row
              </Button>
            </div>
            <div className="space-y-2">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center gap-2 rounded-lg border border-slate-200 p-2 dark:border-slate-800"
                >
                  <Input
                    className="col-span-6"
                    placeholder="Description"
                    value={it.description}
                    onChange={(e) => updateItem(idx, { description: e.target.value })}
                  />
                  <Input
                    className="col-span-2 text-right"
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={it.quantity}
                    onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                  />
                  <Input
                    className="col-span-3 text-right"
                    type="number"
                    min="0"
                    placeholder="Unit price"
                    value={it.unitPrice}
                    onChange={(e) => updateItem(idx, { unitPrice: e.target.value })}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="col-span-1 h-8 w-8 text-rose-500"
                    onClick={() => removeItem(idx)}
                    aria-label="Remove row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tax rate (%)</Label>
              <Input
                type="number"
                min="0"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Validity (days)</Label>
              <Input
                type="number"
                min="1"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Notes (optional)</Label>
            <Textarea
              rows={2}
              placeholder="Scope assumptions, inclusions/exclusions, support terms…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatMoney(totals.sub)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
              <span>Tax ({taxRate || 0}%)</span>
              <span className="tabular-nums">{formatMoney(totals.tax)}</span>
            </div>
            <div className="mt-1 flex justify-between text-base font-bold text-slate-900 dark:text-white">
              <span>Total</span>
              <span className="tabular-nums">{formatMoney(totals.total)}</span>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-slate-200 p-4 dark:border-slate-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Issue Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// PAYMENT DIALOG (buyer-side)
// ============================================================

export function PaymentDialog({
  open,
  onOpenChange,
  invoice,
  onPaid,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  invoice: Invoice | null;
  onPaid?: () => void;
}) {
  const payInvoice = useAppStore((s) => s.payInvoice);
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [gatewayReference, setGatewayReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!invoice) return null;

  const reset = () => {
    setMethod("card");
    setGatewayReference("");
    setError(null);
    setSubmitting(false);
  };

  const handlePay = () => {
    if (!invoice) return;
    setError(null);
    setSubmitting(true);
    const res = payInvoice({
      invoiceId: invoice.id,
      method,
      gatewayReference: gatewayReference.trim() || undefined,
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? "Payment failed.");
      return;
    }
    reset();
    onOpenChange(false);
    onPaid?.();
  };

  const methodOptions: Array<{ value: PaymentMethod; label: string; hint: string }> = [
    { value: "card", label: "Credit / Debit Card", hint: "Visa •••• 4242" },
    { value: "bank_transfer", label: "Bank Transfer", hint: "ING Bank •••• 7821" },
    { value: "upi", label: "UPI", hint: "Pay via UPI ID" },
    { value: "wallet", label: "Wallet", hint: "Apple / Google Pay" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-slate-200 p-5 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Receipt className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            Pay Invoice {invoice.reference}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Amount due:{" "}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {formatMoney(invoice.total)}
            </span>{" "}
            · Due {new Date(invoice.dueDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-5">
          <div>
            <Label className="text-xs uppercase tracking-wider text-slate-500">
              Payment method
            </Label>
            <div className="mt-2 space-y-1.5">
              {methodOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
                    method === opt.value
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                  )}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={method === opt.value}
                    onChange={() => setMethod(opt.value)}
                    className="h-4 w-4 accent-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-slate-500">{opt.hint}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs">Reference / Note (optional)</Label>
            <Input
              placeholder="PO #, cost center, etc."
              value={gatewayReference}
              onChange={(e) => setGatewayReference(e.target.value)}
            />
          </div>

          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-300">
            <p className="font-semibold">Demo payment</p>
            <p className="mt-0.5">
              No real charge — this records a successful {formatMoney(invoice.total)}{" "}
              payment against invoice {invoice.reference} and moves the linked
              request to <span className="font-semibold">Paid</span> status.
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-slate-200 p-4 dark:border-slate-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePay}
            disabled={submitting}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            {submitting ? "Processing…" : `Pay ${formatMoney(invoice.total)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// ACCEPT / DECLINE QUOTE DIALOG (buyer-side)
// ============================================================

export function DeclineQuoteDialog({
  open,
  onOpenChange,
  quote,
  onDeclined,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  quote: Quote | null;
  onDeclined?: () => void;
}) {
  const declineQuote = useAppStore((s) => s.declineQuote);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!quote) return null;

  const handleDecline = () => {
    if (!quote) return;
    setError(null);
    const res = declineQuote(quote.id, reason);
    if (!res.ok) {
      setError(res.error ?? "Unable to decline quote.");
      return;
    }
    setReason("");
    onOpenChange(false);
    onDeclined?.();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setReason(""); setError(null); } onOpenChange(v); }}>
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-slate-200 p-5 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-base">
            <XCircle className="h-4 w-4 text-rose-500" />
            Decline Quote {quote.reference}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Let the STIOOS team know why you&apos;re declining this quote.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 p-5">
          <div>
            <Label className="text-xs">Reason (optional)</Label>
            <Textarea
              rows={4}
              placeholder="e.g. Budget exceeded our cap for this fiscal year"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-slate-200 p-4 dark:border-slate-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDecline}>
            <XCircle className="mr-1.5 h-4 w-4" /> Decline Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ApproveQuoteDialog({
  open,
  onOpenChange,
  quote,
  onApproved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  quote: Quote | null;
  onApproved?: () => void;
}) {
  const acceptQuote = useAppStore((s) => s.acceptQuote);
  const [error, setError] = useState<string | null>(null);

  if (!quote) return null;

  const handleApprove = () => {
    setError(null);
    const res = acceptQuote(quote.id);
    if (!res.ok) {
      setError(res.error ?? "Unable to approve quote.");
      return;
    }
    onOpenChange(false);
    onApproved?.();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setError(null);
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-slate-200 p-5 dark:border-slate-800">
          <DialogTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Approve Quote {quote.reference}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Review the quoted amount before approving this service or consultation request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 p-5">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Quote total</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
                {formatMoney(quote.total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Valid until {formatDate(quote.validUntil)}
            </p>
          </div>
          {quote.notes && (
            <div className="rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
              <span className="font-semibold">Notes: </span>{quote.notes}
            </div>
          )}
          <p className="text-xs text-slate-500">
            Approving changes this request to Approved. The STIOOS team can then create the order and invoice.
          </p>
          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-slate-200 p-4 dark:border-slate-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// QUOTE / INVOICE DETAIL SHEET (shared drawer)
// ============================================================

export function QuoteDetailSheet({
  quote,
  open,
  onOpenChange,
  actions,
}: {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  actions?: React.ReactNode;
}) {
  if (!quote) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-slate-200 p-5 dark:border-slate-800">
          <SheetTitle className="text-base">Quote {quote.reference}</SheetTitle>
          <SheetDescription className="text-xs">
            Issued by {quote.issuedByName} ·{" "}
            <Clock className="mr-1 inline h-3 w-3" />
            Valid until {new Date(quote.validUntil).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>
        <div className="p-5">
          <QuoteCard quote={quote} actions={actions} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function InvoiceDetailSheet({
  invoice,
  open,
  onOpenChange,
  actions,
}: {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  actions?: React.ReactNode;
}) {
  if (!invoice) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-slate-200 p-5 dark:border-slate-800">
          <SheetTitle className="text-base">Invoice {invoice.reference}</SheetTitle>
          <SheetDescription className="text-xs">
            Issued by {invoice.issuedByName} · Due{" "}
            {new Date(invoice.dueDate).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>
        <div className="p-5">
          <InvoiceCard invoice={invoice} actions={actions} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Re-export so consumers can import everything from one module
export { Badge };
