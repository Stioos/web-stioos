"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import {
  QuoteCard,
  QuoteDetailSheet,
  QuoteStatusBadge,
} from "@/components/dashboard/lifecycle/quote-invoice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Quote, QuoteStatus } from "@/types";

type QuoteTab = "all" | QuoteStatus;

const TABS: { value: QuoteTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sent", label: "Awaiting Buyer" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
  { value: "expired", label: "Expired" },
  { value: "draft", label: "Drafts" },
];

export default function AdminQuotesPage() {
  const quotes = useAppStore((s) => s.quotes);
  const requests = useAppStore((s) => s.requests);
  const [tab, setTab] = useState<QuoteTab>("all");
  const [active, setActive] = useState<Quote | null>(null);

  const sorted = useMemo(
    () =>
      [...quotes].sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1)),
    [quotes]
  );
  const filtered = useMemo(() => {
    if (tab === "all") return sorted;
    return sorted.filter((q) => q.status === tab);
  }, [sorted, tab]);

  const stats = useMemo(() => {
    const total = sorted.length;
    const sent = sorted.filter((q) => q.status === "sent").length;
    const accepted = sorted.filter((q) => q.status === "accepted").length;
    const declined = sorted.filter((q) => q.status === "declined").length;
    const acceptedValue = sorted
      .filter((q) => q.status === "accepted" || q.status === "sent")
      .reduce((s, q) => s + q.total, 0);
    return { total, sent, accepted, declined, acceptedValue };
  }, [sorted]);

  const tabCount = (t: QuoteTab) =>
    t === "all" ? sorted.length : sorted.filter((q) => q.status === t).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        title="Quotes"
        description="Every quote issued by the STIOOS team against buyer service requests. Track acceptance, decline reasons, and conversion to orders."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/service-requests">
              <ExternalLink className="mr-1.5 h-4 w-4" /> Service Requests
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Quotes" value={stats.total} icon="FileText" tone="violet" />
        <StatCard label="Awaiting Buyer" value={stats.sent} icon="Clock" tone="amber" />
        <StatCard label="Accepted" value={stats.accepted} icon="CheckCircle2" tone="green" />
        <StatCard
          label="Pipeline Value"
          value={`$${(stats.acceptedValue / 1000).toFixed(1)}k`}
          icon="TrendingUp"
          tone="blue"
        />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as QuoteTab)}>
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
              No quotes in this view yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Reference</th>
                  <th className="px-4 py-2">Buyer</th>
                  <th className="px-4 py-2">Request</th>
                  <th className="px-4 py-2">Issued</th>
                  <th className="px-4 py-2">Valid Until</th>
                  <th className="px-4 py-2 text-right">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((q) => {
                  const req = requests.find((r) => r.id === q.requestId);
                  return (
                    <tr
                      key={q.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => setActive(q)}
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                        {q.reference}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {q.buyerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {q.buyerCompany}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {req ? (
                          <Link
                            href={`/admin/service-requests?focus=${req.id}`}
                            className="font-mono text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {req.reference ?? req.id.slice(0, 10)}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(q.issuedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(q.validUntil).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-foreground">
                        ${q.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <QuoteStatusBadge status={q.status} />
                      </td>
                      <td className="px-4 py-3">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <QuoteDetailSheet
        quote={active}
        open={!!active}
        onOpenChange={(v) => { if (!v) setActive(null); }}
      />
    </div>
  );
}
