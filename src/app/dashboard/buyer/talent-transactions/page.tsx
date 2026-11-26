"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  ExternalLink,
  GraduationCap,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  User,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusBadge, formatMoney, timeAgo } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { MarketRequest, MarketRequestStatus } from "@/types";

export interface UnifiedTalentTxn {
  id: string;
  sourceType: "request" | "inquiry";
  title: string;
  reference: string;
  status: string;
  createdAt: string;
  timeline?: string;
  budgetRange?: string;
  quotedAmount?: number;
  details?: string;
  categoryName: string;
  kind?: string;
  meta?: Record<string, any>;
  buyerName?: string;
  buyerCompany?: string;
  email?: string;
  phone?: string;
  quoteId?: string | null;
  orderId?: string | null;
  invoiceId?: string | null;
}

const TALENT_LIFECYCLE_STEPS = [
  { step: 1, key: "open", label: "Applied / Brief" },
  { step: 2, key: "in_review", label: "In Review" },
  { step: 3, key: "scoping", label: "Scoping" },
  { step: 4, key: "quoted", label: "Quoted" },
  { step: 5, key: "approved", label: "Approved" },
  { step: 6, key: "in_progress", label: "Onboarding" },
  { step: 7, key: "active", label: "Active" },
  { step: 8, key: "closed", label: "Completed" },
];

function getLifecycleStepNumber(status: string): number {
  switch (status) {
    case "open":
    case "new":
      return 1;
    case "in_review":
      return 2;
    case "scoping":
      return 3;
    case "quoted":
      return 4;
    case "approved":
      return 5;
    case "in_progress":
    case "ordered":
      return 6;
    case "active":
    case "delivered":
      return 7;
    case "completed":
    case "closed":
      return 8;
    default:
      return 2;
  }
}

const STATUS_DOT: Record<string, string> = {
  open: "bg-amber-400",
  new: "bg-amber-400",
  in_review: "bg-sky-400",
  quoted: "bg-violet-400",
  approved: "bg-teal-400",
  in_progress: "bg-sky-500",
  ordered: "bg-sky-500",
  active: "bg-emerald-500",
  delivered: "bg-emerald-500",
  completed: "bg-emerald-500",
  closed: "bg-slate-400",
  rejected: "bg-rose-500",
};

const TAB_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "in_progress", label: "In Progress" },
  { value: "quoted", label: "Quoted" },
  { value: "in_review", label: "In Review" },
  { value: "open", label: "Open" },
  { value: "completed", label: "Completed" },
];

export default function BuyerTalentTransactionsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Talent Transactions">
        <Suspense fallback={<div className="p-8 text-slate-400">Loading talent transactions...</div>}>
          <TalentTransactionsContent />
        </Suspense>
      </DashboardShell>
    </RequireRole>
  );
}

function TalentTransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const user = useCurrentUser();
  const { toast } = useToast();

  const requests = useAppStore((s) => s.requests);
  const inquiries = useAppStore((s) => s.inquiries);
  const deleteMarketRequest = useAppStore((s) => s.deleteMarketRequest);
  const deleteInquiry = useAppStore((s) => s.deleteInquiry);
  const acceptQuote = useAppStore((s) => s.acceptQuote);
  const quotes = useAppStore((s) => s.quotes);

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(queryId);

  // Unified talent transactions list matching the buyer's talent scope
  const allTalentTxns: UnifiedTalentTxn[] = useMemo(() => {
    const list: UnifiedTalentTxn[] = [];
    const seenRefs = new Set<string>();

    // 1. Process market requests that belong to talent solutions
    const talentRequests = requests.filter((r) => {
      const matchesUser =
        !user ||
        r.buyerId === user?.id ||
        (user?.id === "usr-001" && (r.buyerId === "usr-001" || r.buyerId === "usr-mkt-buyer" || r.buyerId === "usr-mkt-daniel")) ||
        (user?.id === "usr-mkt-buyer" && (r.buyerId === "usr-mkt-buyer" || r.buyerId === "usr-001")) ||
        (r.meta?.buyerId && user?.id && r.meta.buyerId === user.id) ||
        (r.meta?.email && user?.email && r.meta.email.toLowerCase() === user.email.toLowerCase()) ||
        (!r.buyerId && Boolean(r.meta?.optionSlug));

      const matchesTalent =
        r.categoryId === "cat-talent" ||
        r.categoryName?.toLowerCase().includes("talent") ||
        r.title?.toLowerCase().includes("talent") ||
        r.title?.toLowerCase().includes("hire") ||
        r.title?.toLowerCase().includes("training") ||
        r.title?.toLowerCase().includes("staff") ||
        r.kind?.includes("talent") ||
        r.kind === "end-to-end-staffing" ||
        Boolean(r.meta?.optionSlug);

      return matchesUser && matchesTalent;
    });

    for (const req of talentRequests) {
      if (req.reference) seenRefs.add(req.reference);
      list.push({
        id: req.id,
        sourceType: "request",
        title: req.title,
        reference: req.reference || req.id,
        status: req.status,
        createdAt: req.createdAt,
        timeline: req.timeline,
        budgetRange: req.budgetRange,
        quotedAmount: req.quotedAmount,
        details: req.details,
        categoryName: req.categoryName || "Talent Solutions",
        kind: req.kind,
        meta: req.meta,
        buyerName: req.buyerName,
        buyerCompany: req.buyerCompany,
        quoteId: req.quoteId,
        orderId: req.orderId,
        invoiceId: req.invoiceId,
      });
    }

    // 2. Process inquiries (e.g. from talent services forms)
    const talentInquiries = inquiries.filter((i) => {
      const matchesUser =
        !user ||
        i.email?.toLowerCase() === user?.email?.toLowerCase() ||
        i.name?.toLowerCase() === user?.name?.toLowerCase() ||
        (user?.id === "usr-mkt-buyer" && i.email?.includes("northwind")) ||
        (user?.id === "usr-001" && i.email?.includes("vertex"));

      return matchesUser;
    });

    for (const inq of talentInquiries) {
      const ref = inq.id.toUpperCase().startsWith("INQ")
        ? inq.id.toUpperCase()
        : `INQ-${inq.id.slice(-4).toUpperCase()}`;

      if (seenRefs.has(ref)) continue;

      list.push({
        id: inq.id,
        sourceType: "inquiry",
        title: inq.serviceName ?? inq.type.replace("_", " "),
        reference: ref,
        status: inq.status || "open",
        createdAt: inq.createdAt || new Date().toISOString(),
        timeline: inq.timeline,
        budgetRange: inq.budgetRange,
        details: inq.requirements,
        categoryName: "Talent Solutions",
        kind: inq.type === "consultation" ? "talent-consultation" : "talent-application",
        email: inq.email,
        phone: inq.phone,
        buyerName: inq.name,
        buyerCompany: inq.company,
      });
    }

    // Sort newest first
    return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [requests, inquiries, user]);

  // Filter transactions
  const filtered = useMemo(() => {
    return allTalentTxns.filter((txn) => {
      const matchesTab =
        tab === "all" ||
        (tab === "in_progress" && (txn.status === "in_progress" || txn.status === "ordered")) ||
        (tab === "open" && (txn.status === "open" || txn.status === "new")) ||
        txn.status === tab;

      const matchesSearch =
        !search.trim() ||
        txn.title.toLowerCase().includes(search.toLowerCase()) ||
        txn.reference.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [allTalentTxns, tab, search]);

  // Counts for tabs
  const counts = useMemo(() => {
    const map = new Map<string, number>([["all", allTalentTxns.length]]);
    for (const t of allTalentTxns) {
      const norm = t.status === "new" ? "open" : t.status;
      map.set(norm, (map.get(norm) ?? 0) + 1);
    }
    return map;
  }, [allTalentTxns]);

  // Sync selectedId with queryId
  useEffect(() => {
    if (queryId) {
      const match = allTalentTxns.find((t) => t.id === queryId || t.reference === queryId);
      if (match) {
        setSelectedId(match.id);
        if (tab !== "all" && tab !== match.status) {
          setTab("all");
        }
      }
    }
  }, [queryId, allTalentTxns, tab]);

  // Selected item
  const selected = useMemo(() => {
    const target = selectedId || queryId;
    if (target) {
      const found = allTalentTxns.find((t) => t.id === target || t.reference === target);
      if (found) return found;
    }
    return filtered[0] ?? null;
  }, [selectedId, queryId, allTalentTxns, filtered]);

  // Deletion handler
  const handleDeleteTxn = (txn: UnifiedTalentTxn) => {
    if (txn.sourceType === "request") {
      deleteMarketRequest(txn.id);
    } else {
      deleteInquiry(txn.id);
    }
    toast({
      title: "Transaction deleted",
      description: `Removed "${txn.title}" from your talent transactions.`,
    });
    if (selected?.id === txn.id) {
      const remaining = allTalentTxns.filter((t) => t.id !== txn.id);
      setSelectedId(remaining[0]?.id ?? null);
    }
  };

  const linkedQuote = selected?.quoteId
    ? quotes.find((q) => q.id === selected.quoteId) ?? null
    : null;

  return (
    <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col">
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[380px_1fr]">
        {/* ============================================================ */}
        {/* LEFT SIDEBAR — ALL TALENT TRANSACTIONS */}
        {/* ============================================================ */}
        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          {/* Sidebar Header */}
          <div className="shrink-0 space-y-2 border-b border-white/10 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.16em] text-amber-500">
                Talent Transactions ({filtered.length})
              </p>
              {/* Status filter dropdown */}
              <Select
                value={tab}
                onValueChange={(v) => {
                  setTab(v);
                  setSelectedId(null);
                }}
              >
                <SelectTrigger className="h-7 w-[130px] border-white/15 bg-white/5 text-[11px] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAB_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="text-xs">
                      {t.label} ({counts.get(t.value) ?? 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 border-white/10 bg-white/5 pl-8 text-xs text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Sidebar List */}
          <div className="min-h-0 flex-1 overflow-y-auto p-1.5 space-y-1">
            {filtered.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
                <ClipboardCheck className="h-8 w-8 text-slate-600" />
                <p className="mt-2 text-xs font-medium text-slate-400">
                  No talent transactions match this filter
                </p>
              </div>
            ) : (
              filtered.map((txn) => {
                const isActive = selected?.id === txn.id;
                return (
                  <div
                    key={txn.id}
                    onClick={() => {
                      setSelectedId(txn.id);
                      router.replace(`/dashboard/buyer/talent-transactions?id=${txn.id}`, { scroll: false });
                    }}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "group relative flex w-full cursor-pointer items-start justify-between gap-2.5 rounded-lg p-3 text-left transition-colors",
                      isActive
                        ? "bg-amber-400/10 ring-1 ring-inset ring-amber-400/30"
                        : "hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                          STATUS_DOT[txn.status] || "bg-amber-400"
                        )}
                        aria-hidden="true"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-sm font-semibold",
                            isActive ? "text-amber-300" : "text-white"
                          )}
                        >
                          {txn.title}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                          {txn.reference} · Talent Solutions
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                              txn.status === "in_progress"
                                ? "border border-sky-400/30 bg-sky-400/10 text-sky-300"
                                : txn.status === "quoted"
                                ? "border border-violet-400/30 bg-violet-400/10 text-violet-300"
                                : txn.status === "in_review"
                                ? "border border-sky-400/30 bg-sky-400/10 text-sky-300"
                                : "border border-amber-400/30 bg-amber-400/10 text-amber-300"
                            )}
                          >
                            {txn.status === "in_progress"
                              ? "In progress"
                              : txn.status.replace("_", " ")}
                          </span>
                          {txn.timeline && (
                            <span className="text-[10px] text-slate-500">
                              · {txn.timeline}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {timeAgo(txn.createdAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTxn(txn);
                      }}
                      className="opacity-0 group-hover:opacity-100 rounded-md p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      title="Delete transaction"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ============================================================ */}
        {/* RIGHT DETAIL PANEL — SELECTED TALENT TRANSACTION */}
        {/* ============================================================ */}
        <section className="flex min-h-0 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto">
            {selected ? (
              <TalentTransactionInspector
                txn={selected}
                quote={linkedQuote}
                onAcceptQuote={() => {
                  if (selected.quoteId) {
                    acceptQuote(selected.quoteId);
                    toast({
                      title: "Quote accepted",
                      description: "The STIOOS practice team will proceed with your cohort setup.",
                    });
                  }
                }}
                onDelete={() => handleDeleteTxn(selected)}
              />
            ) : (
              <div className="flex h-full min-h-[360px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                <div>
                  <ClipboardCheck className="mx-auto h-10 w-10 text-slate-600" />
                  <p className="mt-3 text-sm font-medium text-slate-300">
                    Select a talent transaction from the sidebar
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    View candidate criteria, scoping parameters, and progress updates.
                  </p>
                  <Button
                    asChild
                    className="mt-4 bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                  >
                    <Link href="/dashboard/buyer/talent-solutions">
                      <ArrowLeft className="mr-1.5 h-4 w-4" /> Return to Hire Talent
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function TalentTransactionInspector({
  txn,
  quote,
  onAcceptQuote,
  onDelete,
}: {
  txn: UnifiedTalentTxn;
  quote?: any;
  onAcceptQuote: () => void;
  onDelete: () => void;
}) {
  const currentStep = getLifecycleStepNumber(txn.status);

  // Parse structured details if present
  const details = txn.details || "";
  const lines = details
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const structuredFields: { label: string; value: string }[] = [];
  let freeTextStatement = "";

  for (const line of lines) {
    if (line.startsWith("[") && line.endsWith("]")) {
      // Header tag
      continue;
    }
    const idx = line.indexOf(":");
    if (idx > 0 && idx < 30) {
      const label = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      if (val && val !== "N/A" && val !== "Not specified") {
        structuredFields.push({ label, value: val });
      }
    } else {
      freeTextStatement += (freeTextStatement ? "\n" : "") + line;
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 space-y-6">
      {/* 1. Header with back link + tags + title */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <Link
            href="/dashboard/buyer/talent-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Hire Talent Portal
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="h-7 text-xs border-white/15 bg-white/5 text-slate-300 hover:text-rose-400 hover:border-rose-400/30"
            >
              <Trash2 className="mr-1 h-3 w-3" /> Delete
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-300">
            {txn.kind === "end-to-end-staffing"
              ? "END TO END STAFFING"
              : txn.kind === "talent-application"
              ? "CANDIDATE APPLICATION"
              : txn.kind === "talent-consultation"
              ? "DISCOVERY CONSULTATION"
              : "TALENT SOLUTION"}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              txn.status === "in_progress"
                ? "border border-sky-400/30 bg-sky-400/10 text-sky-300"
                : txn.status === "quoted"
                ? "border border-violet-400/30 bg-violet-400/10 text-violet-300"
                : txn.status === "in_review"
                ? "border border-sky-400/30 bg-sky-400/10 text-sky-300"
                : "border border-amber-400/30 bg-amber-400/10 text-amber-300"
            )}
          >
            ● {txn.status === "in_progress" ? "In progress" : txn.status.replace("_", " ")}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {txn.title}
        </h1>

        <p className="mt-1 text-xs text-slate-400 flex flex-wrap items-center gap-2">
          <span className="font-mono text-amber-300/90 font-semibold">{txn.reference}</span>
          <span>·</span>
          <span>{txn.categoryName}</span>
          <span>·</span>
          <span>{timeAgo(txn.createdAt)}</span>
          {txn.buyerCompany && (
            <>
              <span>·</span>
              <span className="text-slate-300">{txn.buyerCompany}</span>
            </>
          )}
        </p>
      </div>

      {/* 2. Lifecycle Stepper */}
      <div className="py-2">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Lifecycle
        </p>
        <div className="relative flex items-center justify-between">
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/10 -z-0" />
          <div
            className="absolute top-3 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-sky-400 transition-all -z-0"
            style={{ width: `${((currentStep - 1) / 7) * 100}%` }}
          />

          {TALENT_LIFECYCLE_STEPS.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            return (
              <div key={s.step} className="flex flex-col items-center z-10">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                    isCompleted
                      ? "bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50"
                      : isCurrent
                      ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-md shadow-amber-500/50"
                      : "bg-slate-800 text-slate-500 border border-white/10"
                  )}
                >
                  {isCompleted ? "✓" : s.step}
                </div>
                <span
                  className={cn(
                    "mt-2 text-[10px] font-medium hidden sm:block whitespace-nowrap",
                    isCurrent
                      ? "text-amber-300 font-bold"
                      : isCompleted
                      ? "text-slate-300"
                      : "text-slate-500"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Three Metric Cards: Budget / Timeline / Quoted Amount */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Budget</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {txn.budgetRange || "Standard Tier"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Timeline</p>
          <p className="mt-1 text-sm font-semibold text-white">
            {txn.timeline || "Immediate (24–48h)"}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quoted Amount</p>
          <p className="mt-1 text-sm font-bold text-emerald-400">
            {txn.quotedAmount ? formatMoney(txn.quotedAmount) : "—"}
          </p>
        </div>
      </div>

      {/* 4. Action Banner if Quoted */}
      {txn.status === "quoted" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-400/30 bg-violet-500/10 p-4">
          <div>
            <p className="text-sm font-bold text-violet-200">Quote Received & Verified</p>
            <p className="text-xs text-slate-300 mt-0.5">
              Review calibrated pricing and candidate allocation for your engagement.
            </p>
          </div>
          <Button
            onClick={onAcceptQuote}
            className="bg-emerald-600 font-bold text-white hover:bg-emerald-500"
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Accept & Proceed
          </Button>
        </div>
      )}

      {/* 5. Talent Specification / Structured Criteria */}
      {structuredFields.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
            Talent Scope & Screening Criteria
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {structuredFields.map((field) => (
              <div
                key={field.label}
                className="flex items-start justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs"
              >
                <span className="text-slate-400 font-medium">{field.label}</span>
                <span className="font-semibold text-slate-200 text-right">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Description / Statement */}
      {(freeTextStatement || details) && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Description
          </p>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
            {details}
          </div>
        </div>
      )}

      {/* 7. Contact / Candidate Profile */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Contact & Organization Profile
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-slate-500">Applicant / Contact</p>
            <p className="mt-0.5 font-semibold text-white">
              {txn.buyerName || txn.meta?.name || "Daniel Osei"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Email Address</p>
            <p className="mt-0.5 font-semibold text-white">
              {txn.email || txn.meta?.email || "d.osei@vertexbuild.com"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Phone & Dial Code</p>
            <p className="mt-0.5 font-semibold text-white">
              {txn.phone || txn.meta?.phone || "+1 555 01001"}
            </p>
          </div>
        </div>
      </div>

      {/* 8. Linked Records */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Linked Records
        </p>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-amber-500" />
            <span className="font-semibold text-white">{txn.reference}</span>
            <span className="text-slate-500">· Stioos Talent Pool Record</span>
          </div>
          <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
            SLA Guaranteed
          </span>
        </div>
      </div>

      {/* 9. Timeline */}
      <div className="border-t border-white/10 pt-4 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Timeline
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 text-xs">
            <span className="mt-1 h-2 w-2 rounded-full bg-sky-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">
                In Progress <span className="text-slate-500 font-normal">· Today</span>
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {txn.buyerName || "Daniel Osei"} — Request submitted from Talent Solutions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
