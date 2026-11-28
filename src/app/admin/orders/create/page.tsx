"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type DeliveryType = "project" | "subscription" | "retainer" | "on_demand" | "self_serve";

export default function CreateOrderPage() {
  const router = useRouter();
  const pathname = usePathname();
  const returnPath = pathname.startsWith("/admin/service-requests") ? "/admin/service-requests" : "/admin/orders";
  const quotes = useAppStore((s) => s.quotes);
  const requests = useAppStore((s) => s.requests);
  const users = useAppStore((s) => s.users);
  const createOrderFromQuote = useAppStore((s) => s.createOrderFromQuote);
  const [quoteId, setQuoteId] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("project");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [dueDate, setDueDate] = useState(() => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [instructions, setInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const available = useMemo(() => quotes.filter((q) => q.status === "accepted" && requests.some((r) => r.id === q.requestId && !r.orderId)), [quotes, requests]);
  const quote = available.find((q) => q.id === quoteId);
  const request = requests.find((r) => r.id === quote?.requestId);
  const buyer = users.find((u) => u.id === quote?.buyerId);
  const today = new Date().toISOString().slice(0, 10);
  const money = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const submit = () => {
    setError("");
    if (!quote) return setError("Select an accepted quote first.");
    const dueDays = Math.ceil((new Date(`${dueDate}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()) / 86400000);
    if (!Number.isFinite(dueDays) || dueDays < 1) return setError("Payment due date must be after today.");
    if (deliveryDate && deliveryDate < today) return setError("Expected delivery date cannot be in the past.");
    const details = [deliveryDate && `Expected delivery: ${deliveryDate}`, instructions.trim() && `Delivery instructions: ${instructions.trim()}`, notes.trim() && `Notes: ${notes.trim()}`].filter(Boolean).join("\n");
    const result = createOrderFromQuote({ quoteId: quote.id, deliveryType, dueDays, notes: details || undefined });
    if (!result.ok) return setError(result.error ?? "Unable to create order.");
    router.push(returnPath);
  };

  return <div className="w-full space-y-5 pb-6">
    <div className="flex items-center justify-between gap-3 border-b pb-4"><div><h1 className="text-2xl font-bold">Create Order</h1><p className="mt-1 text-sm text-muted-foreground">Turn an accepted quote into an order and invoice.</p></div><Button asChild variant="outline" size="sm"><Link href={returnPath}><ArrowLeft className="mr-2 h-4 w-4" />Back to {returnPath === "/admin/orders" ? "Orders" : "Service Requests"}</Link></Button></div>
    <div className="space-y-6 rounded-xl border bg-card p-4 sm:p-6">
      <section className="space-y-3 rounded-lg border bg-background p-4"><div><h2 className="font-semibold">Accepted quote</h2><p className="text-xs text-muted-foreground">Select the approved price and scope for this order.</p></div><select aria-label="Accepted quote" className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={quoteId} onChange={(e) => setQuoteId(e.target.value)}><option value="">Select an accepted quote</option>{available.map((q) => <option key={q.id} value={q.id}>{q.reference} — {q.buyerName} — {money(q.total)}</option>)}</select>{available.length === 0 && <p className="text-sm text-muted-foreground">No accepted quotes are ready for an order. The buyer must accept a quote first.</p>}</section>
      <div className="grid gap-4 md:grid-cols-2"><section className="space-y-4 rounded-lg border bg-background p-4 sm:p-5"><div><h2 className="font-semibold">Buyer details</h2><p className="text-xs text-muted-foreground">Shown from the accepted quote.</p></div><div className="space-y-3"><div className="space-y-1"><Label>Name</Label><p className="flex min-h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">{quote?.buyerName || "Select a quote"}</p></div><div className="space-y-1"><Label>Company</Label><p className="flex min-h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">{quote?.buyerCompany || "Select a quote"}</p></div><div className="space-y-1"><Label>Contact</Label><p className="flex min-h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">{buyer?.email || "—"}</p></div></div></section><section className="space-y-4 rounded-lg border bg-background p-4 sm:p-5"><div><h2 className="font-semibold">Service request</h2><p className="text-xs text-muted-foreground">Shown from the quote's linked request.</p></div><div className="space-y-3"><div className="space-y-1"><Label>Request reference</Label><p className="flex min-h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">{request?.reference || "Select a quote"}</p></div><div className="space-y-1"><Label>Service</Label><p className="flex min-h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">{request?.title || "Select a quote"}</p></div><div className="space-y-1"><Label>Requirements</Label><p className="min-h-16 whitespace-pre-wrap rounded-md border bg-muted/40 px-3 py-2 text-sm">{request?.details || "Select a quote"}</p></div></div></section></div>
      <section className="space-y-4 rounded-lg border bg-background p-4 sm:p-5"><div><h2 className="font-semibold">Agreed work and pricing</h2><p className="text-xs text-muted-foreground">Items and prices from the accepted quote.</p></div><div className="overflow-x-auto rounded-lg border bg-card"><table className="w-full min-w-[520px] text-sm"><thead className="bg-muted/50 text-left"><tr><th className="p-3">Description</th><th className="p-3 text-right">Quantity</th><th className="p-3 text-right">Unit price</th><th className="p-3 text-right">Amount</th></tr></thead><tbody>{quote?.items.map((item) => <tr key={item.id} className="border-t"><td className="p-3">{item.description}</td><td className="p-3 text-right">{item.quantity}</td><td className="p-3 text-right">{money(item.unitPrice)}</td><td className="p-3 text-right">{money(item.amount)}</td></tr>)}</tbody></table></div></section>
      <div className="grid gap-5 md:grid-cols-2"><section className="space-y-3"><h2 className="font-semibold">Delivery and payment</h2><div><Label>Delivery type</Label><select aria-label="Delivery type" className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm" value={deliveryType} onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}><option value="project">Project</option><option value="subscription">Subscription</option><option value="retainer">Retainer</option><option value="on_demand">On demand</option><option value="self_serve">Self serve</option></select></div><div><Label>Expected delivery date</Label><Input className="mt-1" type="date" min={today} value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} /></div><div><Label>Invoice payment due date</Label><Input className="mt-1" type="date" min={today} value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div><div><Label>Delivery instructions</Label><Textarea className="mt-1" value={instructions} onChange={(e) => setInstructions(e.target.value)} /></div><div><Label>Optional notes</Label><Textarea className="mt-1" value={notes} onChange={(e) => setNotes(e.target.value)} /></div></section><section className="space-y-3 rounded-lg border bg-background p-4"><h2 className="font-semibold">Review total</h2><div className="flex justify-between"><span>Subtotal</span><span>{money(quote?.subtotal ?? 0)}</span></div><div className="flex justify-between"><span>Tax</span><span>{money(quote?.taxAmount ?? 0)}</span></div><div className="flex justify-between"><span>Discount</span><span>−{money(quote?.discount ?? 0)}</span></div><div className="flex justify-between border-t pt-3 font-bold"><span>Order and invoice total</span><span>{money(quote?.total ?? 0)}</span></div></section></div>
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}<div className="flex justify-end"><Button onClick={submit} disabled={!quote}>Create Order and Invoice</Button></div>
    </div>
  </div>;
}
