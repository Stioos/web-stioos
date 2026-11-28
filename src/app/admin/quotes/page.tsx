"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, Search } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import {
  QuoteDetailSheet,
  QuoteStatusBadge,
} from "@/components/dashboard/lifecycle/quote-invoice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Quote, QuoteStatus } from "@/types";
import { MarketplaceSectionLinks } from "@/components/admin/marketplace-section-links";
import { cn } from "@/lib/utils";

type QuoteTab = "all" | QuoteStatus;

const TABS: { value: QuoteTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sent", label: "Awaiting Buyer" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
  { value: "expired", label: "Expired" },
  { value: "draft", label: "Drafts" },
];

const ACTIVE_TAB_COLORS: Record<QuoteTab, string> = {
  all: "bg-foreground text-background ring-foreground",
  sent: "bg-violet-600 text-white ring-violet-600",
  accepted: "bg-emerald-600 text-white ring-emerald-600",
  declined: "bg-rose-600 text-white ring-rose-600",
  expired: "bg-amber-600 text-white ring-amber-600",
  draft: "bg-slate-600 text-white ring-slate-600",
};

export default function AdminQuotesPage() {
  const router = useRouter();
  const quotes = useAppStore((s) => s.quotes);
  const requests = useAppStore((s) => s.requests);
  const inquiries = useAppStore((s) => s.inquiries);
  const [tab, setTab] = useState<QuoteTab>("all");
  const [active, setActive] = useState<Quote | null>(null);
  const [search, setSearch] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [toolbarStuck, setToolbarStuck] = useState(false);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const observer = new ResizeObserver(() => setToolbarHeight(toolbar.getBoundingClientRect().height));
    observer.observe(toolbar);
    const scrollArea = toolbar.closest("main");
    const updateStuck = () => {
      if (!scrollArea) return;
      const stickyTop = scrollArea.getBoundingClientRect().top + parseFloat(getComputedStyle(scrollArea).paddingTop);
      setToolbarStuck(toolbar.getBoundingClientRect().top <= stickyTop + 1);
    };
    scrollArea?.addEventListener("scroll", updateStuck, { passive: true });
    updateStuck();
    return () => {
      observer.disconnect();
      scrollArea?.removeEventListener("scroll", updateStuck);
    };
  }, []);

  const quoteRequests = useMemo(
    () => inquiries.filter((inquiry) => inquiry.type === "quote"),
    [inquiries]
  );

  const sorted = useMemo(
    () =>
      [...quotes].sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1)),
    [quotes]
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sorted.filter((q) => {
      const matchesTab = tab === "all" || q.status === tab;
      const req = requests.find((r) => r.id === q.requestId);
      const matchesSearch = !query || [q.reference, q.buyerName, q.buyerCompany, req?.reference, req?.title]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
      return matchesTab && matchesSearch;
    });
  }, [requests, search, sorted, tab]);

  const visibleQuoteRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return quoteRequests;
    return quoteRequests.filter((inquiry) => [inquiry.id, inquiry.name, inquiry.email, inquiry.company, inquiry.serviceName]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)));
  }, [quoteRequests, search]);

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
    t === "all"
      ? sorted.length + quoteRequests.length
      : sorted.filter((q) => q.status === t).length;

  const showIncomingRequests = tab === "all" && visibleQuoteRequests.length > 0;
  return (
    <div className="w-full px-0 py-2 lg:py-3">
      <div className="mb-3 grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatCard compact label="Total Quotes" value={stats.total} icon="FileText" tone="violet" />
          <StatCard compact label="Awaiting Buyer" value={stats.sent} icon="Clock" tone="amber" />
          <StatCard compact label="Accepted" value={stats.accepted} icon="CheckCircle2" tone="green" />
          <StatCard compact label="Pipeline Value" value={`$${(stats.acceptedValue / 1000).toFixed(1)}k`} icon="TrendingUp" tone="blue" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <MarketplaceSectionLinks current="quotes" />
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/quotes/create"><Plus className="mr-1.5 h-4 w-4" /> Create Quote</Link>
          </Button>
        </div>
      </div>

      <div ref={toolbarRef} className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 bg-background py-2 pb-5">
        {toolbarStuck && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full h-4 bg-background sm:h-6" />}
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reference, buyer, request..." className="pl-9" />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2" role="group" aria-label="Filter quotes by status">
          {TABS.map((t) => {
            const isActive = tab === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTab(t.value)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
                  isActive ? ACTIVE_TAB_COLORS[t.value] : "bg-card text-muted-foreground ring-border hover:text-foreground"
                )}
              >
                {t.label}
                <span className={cn("rounded-full px-1.5 text-[10px] font-bold", isActive ? "bg-white/20 dark:bg-black/20" : "bg-muted")}>
                  {tabCount(t.value)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {filtered.length === 0 && !showIncomingRequests ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No quotes in this view yet.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="sticky z-20 bg-muted px-4 py-2" style={{ top: toolbarHeight }}>Reference</th>
                  <th className="sticky z-20 bg-muted px-4 py-2" style={{ top: toolbarHeight }}>Buyer</th>
                  <th className="sticky z-20 bg-muted px-4 py-2" style={{ top: toolbarHeight }}>Request</th>
                  <th className="sticky z-20 bg-muted px-4 py-2" style={{ top: toolbarHeight }}>Issued</th>
                  <th className="sticky z-20 bg-muted px-4 py-2" style={{ top: toolbarHeight }}>Valid Until</th>
                  <th className="sticky z-20 bg-muted px-4 py-2 text-right" style={{ top: toolbarHeight }}>Total</th>
                  <th className="sticky z-20 bg-muted px-4 py-2" style={{ top: toolbarHeight }}>Status</th>
                  <th className="sticky z-20 bg-muted px-4 py-2" style={{ top: toolbarHeight }}></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {showIncomingRequests && visibleQuoteRequests.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className="cursor-pointer bg-amber-500/[0.03] hover:bg-amber-500/[0.08]"
                    onClick={() => router.push(`/admin/inquiries/${inquiry.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/admin/inquiries/${inquiry.id}`);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View quote request from ${inquiry.name}`}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">
                      {inquiry.id.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">{inquiry.name}</p>
                      <p className="text-xs text-muted-foreground">{inquiry.company || inquiry.email}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="font-medium text-foreground">
                        {inquiry.serviceName || "Marketplace quote request"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">—</td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-muted-foreground">—</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        Awaiting review
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
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
