"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Line = { description: string; quantity: string; unitPrice: string };
export default function CreateQuotePage() {
  const router = useRouter();
  const requests = useAppStore((s) => s.requests);
  const issueQuote = useAppStore((s) => s.issueQuote);
  const available = useMemo(() => requests.filter((r) => (r.status === "open" || r.status === "in_review") && !r.quoteId), [requests]);
  const [requestId, setRequestId] = useState("");
  const request = available.find((r) => r.id === requestId);
  const [business, setBusiness] = useState({ name: "STIOOS GLOBAL", address: "", phone: "", email: "" });
  const [client, setClient] = useState({ address: "", contact: "" });
  const [items, setItems] = useState<Line[]>([{ description: "", quantity: "1", unitPrice: "0" }]);
  const [validUntil, setValidUntil] = useState(() => new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10));
  const [taxRate, setTaxRate] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [terms, setTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [acceptance, setAcceptance] = useState("");
  const [error, setError] = useState("");
  const issued = new Date().toISOString().slice(0, 10);
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
  const tax = Math.round(subtotal * (Number(taxRate) || 0)) / 100;
  const money = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const field = (label: string, value: string, onChange: (value: string) => void) => <div className="space-y-1"><Label>{label}</Label><Input value={value} onChange={(e) => onChange(e.target.value)} /></div>;
  const submit = () => {
    setError("");
    if (!request) return setError("Choose a service request.");
    const lines = items.map((item) => ({ description: item.description.trim(), quantity: Number(item.quantity), unitPrice: Number(item.unitPrice) }));
    if (!lines.length || lines.some((item) => !item.description || !Number.isFinite(item.quantity) || item.quantity <= 0 || !Number.isFinite(item.unitPrice) || item.unitPrice < 0)) return setError("Complete every line item with a description, positive quantity and valid price.");
    const days = Math.ceil((new Date(`${validUntil}T00:00:00`).getTime() - new Date(`${issued}T00:00:00`).getTime()) / 86400000);
    if (!Number.isFinite(days) || days < 1) return setError("Valid until must be after the issue date.");
    if (!Number.isFinite(Number(taxRate)) || Number(taxRate) < 0) return setError("Enter a valid tax rate.");
    if (!Number.isFinite(Number(discount)) || Number(discount) < 0 || Number(discount) > subtotal + tax) return setError("Enter a discount between zero and the subtotal plus tax.");
    const detail = [`Business: ${business.name}; ${business.address}; ${business.phone}; ${business.email}`, `Client: ${request.buyerName}; ${request.buyerCompany}; ${client.address}; ${client.contact}`, terms && `Terms: ${terms}`, notes && `Notes: ${notes}`, acceptance && `Acceptance: ${acceptance}`].filter(Boolean).join("\n");
    const result = issueQuote({ requestId, items: lines, taxRate: Number(taxRate), validityDays: days, discount: Number(discount), notes: detail });
    if (!result.ok) return setError(result.error ?? "Unable to issue quote.");
    router.push("/admin/quotes");
  };
  return <div className="w-full space-y-5 pb-6">
    <div className="flex items-center justify-between gap-3 border-b pb-4"><div><h1 className="text-2xl font-bold">Create Quote</h1><p className="mt-1 text-sm text-muted-foreground">Prepare a quote for a buyer service request.</p></div><Button asChild variant="outline" size="sm"><Link href="/admin/quotes"><ArrowLeft className="mr-2 h-4 w-4" />Back to Quotes</Link></Button></div>
    <div className="space-y-6 rounded-xl border bg-card p-4 sm:p-6">
      <section className="space-y-3 rounded-lg border bg-background p-4"><div><h2 className="font-semibold">Service request</h2><p className="text-xs text-muted-foreground">Choose the request this quote will be linked to.</p></div><select aria-label="Service request" className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={requestId} onChange={(e) => setRequestId(e.target.value)}><option value="">Select a service request</option>{available.map((r) => <option value={r.id} key={r.id}>{r.reference} — {r.title} — {r.buyerName}</option>)}</select></section>
      <div className="grid gap-4 lg:grid-cols-2"><section className="space-y-4 rounded-lg border bg-background p-4 sm:p-5"><div><h2 className="font-semibold">Your business details</h2><p className="text-xs text-muted-foreground">Information shown to the buyer. These fields are editable.</p></div><div className="grid gap-4 sm:grid-cols-2">{field("Business name", business.name, (name) => setBusiness({ ...business, name }))}{field("Email", business.email, (email) => setBusiness({ ...business, email }))}{field("Phone", business.phone, (phone) => setBusiness({ ...business, phone }))}{field("Address", business.address, (address) => setBusiness({ ...business, address }))}</div></section><section className="space-y-4 rounded-lg border bg-background p-4 sm:p-5"><div><h2 className="font-semibold">Client details</h2><p className="text-xs text-muted-foreground">Name and company come from the selected request. Address and contact are editable.</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1"><Label>Name · from request</Label><p className="flex min-h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">{request?.buyerName || "Select a request"}</p></div><div className="space-y-1"><Label>Company · from request</Label><p className="flex min-h-9 items-center rounded-md border bg-muted/40 px-3 text-sm">{request?.buyerCompany || "Select a request"}</p></div>{field("Address", client.address, (address) => setClient({ ...client, address }))}{field("Contact", client.contact, (contact) => setClient({ ...client, contact }))}</div></section></div>
      <section className="grid gap-4 rounded-lg border bg-background p-4 sm:grid-cols-3 sm:p-5"><div className="space-y-1"><Label>Quote number</Label><p className="flex h-10 items-center rounded-md border px-3 text-sm text-muted-foreground">Generated when issued</p></div><div className="space-y-1"><Label>Issued on</Label><Input type="date" value={issued} readOnly /></div><div className="space-y-1"><Label>Valid until</Label><Input type="date" value={validUntil} min={issued} onChange={(e) => setValidUntil(e.target.value)} /></div></section>
      <section className="space-y-4 rounded-lg border bg-background p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="font-semibold">Work and pricing</h2><p className="text-xs text-muted-foreground">Add each deliverable with its quantity and unit price.</p></div><Button variant="outline" size="sm" onClick={() => setItems([...items, { description: "", quantity: "1", unitPrice: "0" }])}><Plus className="mr-1 h-4 w-4" />Add item</Button></div><div className="space-y-3">{items.map((item, index) => <div key={index} className="grid grid-cols-2 items-end gap-3 rounded-lg border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_90px_130px_110px_36px]"><div className="col-span-2 space-y-1 sm:col-span-1"><Label>Description</Label><Input aria-label={`Item ${index + 1} description`} placeholder="Description of work or product" value={item.description} onChange={(e) => setItems(items.map((line, i) => i === index ? { ...line, description: e.target.value } : line))} /></div><div className="space-y-1"><Label>Qty</Label><Input aria-label={`Item ${index + 1} quantity`} type="number" min="1" value={item.quantity} onChange={(e) => setItems(items.map((line, i) => i === index ? { ...line, quantity: e.target.value } : line))} /></div><div className="space-y-1"><Label>Unit price</Label><Input aria-label={`Item ${index + 1} unit price`} type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => setItems(items.map((line, i) => i === index ? { ...line, unitPrice: e.target.value } : line))} /></div><div className="space-y-1"><Label>Line total</Label><p className="flex h-10 items-center justify-end text-sm font-semibold">{money((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}</p></div><Button variant="ghost" size="icon" aria-label={`Remove item ${index + 1}`} onClick={() => setItems(items.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button></div>)}</div></section>
      <div className="grid gap-6 lg:grid-cols-2"><section className="space-y-3"><h2 className="font-semibold">Terms and notes</h2><Label>Payment, deposit, delivery and warranty</Label><Textarea value={terms} onChange={(e) => setTerms(e.target.value)} /><Label>Assumptions or exclusions</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /><Label>Acceptance instructions</Label><Textarea value={acceptance} onChange={(e) => setAcceptance(e.target.value)} /></section><section className="space-y-3 rounded-lg border bg-background p-4"><h2 className="font-semibold">Totals</h2><div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex items-center justify-between gap-3"><Label>Tax rate (%)</Label><Input className="w-28" type="number" min="0" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} /></div><div className="flex justify-between"><span>Tax</span><span>{money(tax)}</span></div><div className="flex items-center justify-between gap-3"><Label>Discount</Label><Input className="w-28" type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} /></div><div className="flex justify-between border-t pt-3 font-bold"><span>Grand total</span><span>{money(Math.max(0, subtotal + tax - (Number(discount) || 0)))}</span></div></section></div>
      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}<div className="flex justify-end"><Button onClick={submit}>Issue Quote</Button></div>
    </div>
  </div>;
}
