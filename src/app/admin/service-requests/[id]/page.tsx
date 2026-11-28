"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Building2, CircleDollarSign, FileText, Layers, PackagePlus, Timer, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { StatusBadge } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { KIND_LABELS, REQUEST_KIND_DEFS } from "@/lib/request-kinds";
import { REQUEST_STATUS_LABELS } from "@/lib/request-kinds";
import type { MarketRequest, RequestStatusEvent } from "@/types";

function formatStamp(iso: string) {
  return new Date(iso).toLocaleString();
}

function StructuredDetails({ request }: { request: MarketRequest }) {
  const def = REQUEST_KIND_DEFS[request.kind ?? "service"];
  const rows = def?.fields
    .map((field) => ({ label: field.label, value: request.meta?.[field.key] }))
    .filter((row): row is { label: string; value: string } => Boolean(row.value)) ?? [];
  if (!rows.length) return null;
  return <section><h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requirement Details</h2><dl className="mt-2 divide-y rounded-md border bg-background">{rows.map((row) => <div key={row.label} className="flex items-start justify-between gap-4 px-4 py-2.5"><dt className="text-xs text-muted-foreground">{row.label}</dt><dd className="text-right text-sm font-medium">{row.value}</dd></div>)}</dl></section>;
}

function TrackingTimeline({ request }: { request: MarketRequest }) {
  return <section><h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tracking Timeline</h2>{request.statusHistory?.length ? <ol className="mt-3 space-y-4">{request.statusHistory.map((event: RequestStatusEvent, index) => <li key={`${event.at}-${index}`} className="border-l-2 border-border pl-4"><p className="text-sm font-semibold">{REQUEST_STATUS_LABELS[event.status] ?? event.status}</p><p className="text-xs text-muted-foreground">{event.note || "Status updated"}</p><p className="mt-1 text-[11px] text-muted-foreground">by {event.by} · {formatStamp(event.at)}</p></li>)}</ol> : <p className="mt-2 rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">No activity yet.</p>}</section>;
}

export default function AdminServiceRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const request = useAppStore((s) => s.requests.find((item) => item.id === params.id));

  if (!request) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Service request not found.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/service-requests"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Service Requests</Link>
        </Button>
      </div>
    );
  }

  const kind = request.kind ?? "service";
  const kindDef = REQUEST_KIND_DEFS[kind];

  return (
    <div className="-mx-4 -mt-4 flex min-h-[calc(100vh-7rem)] w-[calc(100%+2rem)] flex-col bg-background sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)]">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-xl border bg-card p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/service-requests"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-foreground">{request.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-mono">{request.reference ?? request.id}</span> · submitted {formatStamp(request.createdAt)}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="grid gap-5 py-5 lg:grid-cols-2">
          <section className="rounded-lg border bg-background p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Buyer</h2>
            <div className="mt-3 space-y-3">
              <p className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" />{request.buyerName}</p>
              <p className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4 text-muted-foreground" />{request.buyerCompany || "Independent"}</p>
              <p className="flex items-center gap-2 text-sm"><Layers className="h-4 w-4 text-muted-foreground" />{request.categoryName}</p>
            </div>
          </section>

          <section className="rounded-lg border bg-background p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Request Summary</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border px-2.5 py-1 text-xs font-medium">{KIND_LABELS[kind]}</span>
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"><CircleDollarSign className="h-3 w-3" />{request.budgetRange || "No budget set"}</span>
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"><Timer className="h-3 w-3" />{request.timeline || "No timeline set"}</span>
            </div>
            {kindDef?.tagline && <p className="mt-3 text-sm text-muted-foreground">{kindDef.tagline}</p>}
          </section>
        </div>

        <div className="grid gap-5 border-t pt-5 lg:grid-cols-2">
          <div className="space-y-4">
            <StructuredDetails request={request} />
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Details</h2>
              <p className="mt-2 whitespace-pre-wrap rounded-md border bg-background px-4 py-3 text-sm leading-relaxed">{request.details || "No additional details provided."}</p>
            </section>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline"><Link href="/admin/quotes/create"><FileText className="mr-1.5 h-4 w-4" /> Create Quote</Link></Button>
              <Button asChild variant="outline"><Link href="/admin/service-requests/create-order"><PackagePlus className="mr-1.5 h-4 w-4" /> Create Order</Link></Button>
            </div>
          </div>
          <section className="rounded-lg border bg-background p-4">
            <TrackingTimeline request={request} />
          </section>
        </div>
      </div>
    </div>
  );
}
