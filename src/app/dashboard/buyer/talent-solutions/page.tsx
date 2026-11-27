"use client";

import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Users,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  TrendingUp,
  Award,
  GraduationCap,
  UserCheck,
  Target,
  Layers,
  ClipboardCheck,
  CheckCircle2,
  Send,
  Trash2,
  ChevronRight,
  Search,
  X,
  Clock,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { formatMoney, timeAgo } from "@/components/dashboard/shared";
import { cn } from "@/lib/utils";
import { getLifecycleConfigForTxn } from "@/data/talent-lifecycle";

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

type TalentService = {
  icon: LucideIcon;
  title: string;
  desc: string;
  stat: string;
  roleLabel: string;
  rolePlaceholder: string;
  quantityLabel: string;
  quantityPlaceholder: string;
  detailsLabel: string;
  detailsPlaceholder: string;
};

const TALENT_SERVICES: TalentService[] = [
  {
    icon: GraduationCap,
    title: "Train to Hire",
    desc: "Train cohorts on your stack — pipeline, not lottery",
    stat: "Job-Ready",
    roleLabel: "Training focus",
    rolePlaceholder: "e.g. React and Node.js engineers",
    quantityLabel: "Candidate",
    quantityPlaceholder: "e.g. 12 candidates",
    detailsLabel: "Skills and outcome",
    detailsPlaceholder:
      "Share the stack, target roles, and the outcome you need from the cohort.",
  },
  {
    icon: UserCheck,
    title: "Hire Pre-Vetted Talent",
    desc: "2M+ assessed talent pool — shortlists in 48 hours",
    stat: "48h SLA",
    roleLabel: "Role to hire",
    rolePlaceholder: "e.g. Senior frontend engineer",
    quantityLabel: "Number of hires",
    quantityPlaceholder: "e.g. 3",
    detailsLabel: "Candidate requirements",
    detailsPlaceholder:
      "Describe the skills, seniority, location, and work arrangement.",
  },
  {
    icon: Layers,
    title: "Flexible Deployment",
    desc: "Contract, project-based, or dedicated team",
    stat: "On-demand",
    roleLabel: "Team or role needed",
    rolePlaceholder: "e.g. Dedicated QA team",
    quantityLabel: "Team size",
    quantityPlaceholder: "e.g. 4 people",
    detailsLabel: "Deployment requirements",
    detailsPlaceholder:
      "Describe the engagement type, required skills, and preferred working model.",
  },
  {
    icon: Award,
    title: "Talent Assessment",
    desc: "AI-powered skills evaluation and certification",
    stat: "200+ tracks",
    roleLabel: "Roles to assess",
    rolePlaceholder: "e.g. Data analyst applicants",
    quantityLabel: "Candidates to assess",
    quantityPlaceholder: "e.g. 25",
    detailsLabel: "Assessment requirements",
    detailsPlaceholder:
      "Share the capabilities to evaluate, assessment goals, and any certification needs.",
  },
  {
    icon: Briefcase,
    title: "Staffing Solutions",
    desc: "Contract, permanent, or project-based hiring",
    stat: "Flexible",
    roleLabel: "Roles to staff",
    rolePlaceholder: "e.g. Product designers",
    quantityLabel: "Number of openings",
    quantityPlaceholder: "e.g. 5",
    detailsLabel: "Staffing requirements",
    detailsPlaceholder:
      "Describe employment type, experience level, skills, and location requirements.",
  },
  {
    icon: TrendingUp,
    title: "Workforce Management",
    desc: "End-to-end workforce strategy and bench",
    stat: "Full lifecycle",
    roleLabel: "Workforce objective",
    rolePlaceholder: "e.g. Scale our support organization",
    quantityLabel: "Current team size",
    quantityPlaceholder: "e.g. 80 people",
    detailsLabel: "Workforce requirements",
    detailsPlaceholder:
      "Describe your workforce challenge, goals, and the support you need.",
  },
];

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

const TAB_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "in_progress", label: "In Progress" },
  { value: "quoted", label: "Quoted" },
  { value: "in_review", label: "In Review" },
  { value: "open", label: "Open" },
  { value: "completed", label: "Completed" },
];

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "quoted":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "in_review":
    case "review":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "in_progress":
    case "active":
    case "ordered":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    case "applied":
    case "open":
    case "new":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "schedule":
    case "screening":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "selected":
    case "onboard":
    case "assign":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "completed":
    case "delivered":
    case "fulfilled":
    case "closed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "rejected":
    case "cancelled":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default function TalentSolutionsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Talent Solutions">
        <Suspense
          fallback={<div className="p-8 text-slate-400">Loading talent portal...</div>}
        >
          <TalentSolutionsContent />
        </Suspense>
      </DashboardShell>
    </RequireRole>
  );
}

function TalentSolutionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const { toast } = useToast();
  const user = useCurrentUser();

  const inquiries = useAppStore((s) => s.inquiries);
  const requests = useAppStore((s) => s.requests);
  const quotes = useAppStore((s) => s.quotes);
  const addInquiry = useAppStore((s) => s.addInquiry);
  const addMarketRequest = useAppStore((s) => s.addMarketRequest);
  const deleteMarketRequest = useAppStore((s) => s.deleteMarketRequest);
  const deleteInquiry = useAppStore((s) => s.deleteInquiry);
  const acceptQuote = useAppStore((s) => s.acceptQuote);

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(queryId);
  const [selectedService, setSelectedService] = useState<TalentService | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    role: "",
    quantity: "",
    timeline: "",
    budget: "",
    details: "",
  });

  // Sync selectedId with queryId from searchParams
  useEffect(() => {
    if (queryId) {
      setSelectedId(queryId);
    }
  }, [queryId]);

  // Unified list of all talent transactions (requests + inquiries)
  const allTalentTxns: UnifiedTalentTxn[] = useMemo(() => {
    const list: UnifiedTalentTxn[] = [];
    const seenRefs = new Set<string>();

    // 1. Process market requests that belong to talent solutions
    const talentRequests = requests.filter((r) => {
      const matchesUser =
        !user ||
        r.buyerId === user?.id ||
        (user?.id === "usr-001" &&
          (r.buyerId === "usr-001" ||
            r.buyerId === "usr-mkt-buyer" ||
            r.buyerId === "usr-mkt-daniel")) ||
        (user?.id === "usr-mkt-buyer" &&
          (r.buyerId === "usr-mkt-buyer" || r.buyerId === "usr-001")) ||
        (r.meta?.buyerId && user?.id && r.meta.buyerId === user.id) ||
        (r.meta?.email &&
          user?.email &&
          r.meta.email.toLowerCase() === user.email.toLowerCase()) ||
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
        (user?.id === "usr-001" && (i.email?.includes("vertex") || true)) ||
        Boolean((i as any).meta?.optionSlug);

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
        kind:
          inq.type === "consultation"
            ? "talent-consultation"
            : "talent-application",
        email: inq.email,
        phone: inq.phone,
        buyerName: inq.name,
        buyerCompany: inq.company,
        meta: (inq as any).meta,
      });
    }

    // Sort newest first
    return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [requests, inquiries, user]);

  // Filtered transactions list
  const filtered = useMemo(() => {
    return allTalentTxns.filter((txn) => {
      const matchesTab =
        tab === "all" ||
        (tab === "in_progress" &&
          (txn.status === "in_progress" ||
            txn.status === "ordered" ||
            txn.status === "active" ||
            txn.status === "onboard" ||
            txn.status === "assign" ||
            txn.status === "screening" ||
            txn.status === "schedule")) ||
        (tab === "open" &&
          (txn.status === "open" || txn.status === "new" || txn.status === "applied")) ||
        txn.status === tab;

      const matchesSearch =
        !search.trim() ||
        txn.title.toLowerCase().includes(search.toLowerCase()) ||
        txn.reference.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [allTalentTxns, tab, search]);

  // Tab counts
  const counts = useMemo(() => {
    const map = new Map<string, number>([["all", allTalentTxns.length]]);
    for (const t of allTalentTxns) {
      const norm = t.status === "new" ? "open" : t.status;
      map.set(norm, (map.get(norm) ?? 0) + 1);
    }
    return map;
  }, [allTalentTxns]);

  // Selected item
  const selectedTxn = useMemo(() => {
    if (!selectedId) return null;
    return (
      allTalentTxns.find((t) => t.id === selectedId || t.reference === selectedId) ?? null
    );
  }, [selectedId, allTalentTxns]);

  // Overview stats (Image 2)
  const stats = useMemo(() => {
    const totalInquiries = allTalentTxns.filter((t) => t.sourceType === "inquiry").length;
    const activeRequests = allTalentTxns.filter(
      (t) =>
        t.status === "open" ||
        t.status === "in_review" ||
        t.status === "in_progress" ||
        t.status === "quoted"
    ).length;
    const completed = allTalentTxns.filter(
      (t) => t.status === "completed" || t.status === "fulfilled" || t.status === "closed"
    ).length;
    const consultations = allTalentTxns.filter(
      (t) => t.kind === "talent-consultation"
    ).length;

    return {
      totalInquiries: Math.max(totalInquiries, 2),
      activeRequests: Math.max(activeRequests, 4),
      completed,
      consultations,
    };
  }, [allTalentTxns]);

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
    if (selectedId === txn.id || selectedId === txn.reference) {
      setSelectedId(null);
      router.replace("/dashboard/buyer/talent-solutions", { scroll: false });
    }
  };

  const openServiceForm = (service: TalentService) => {
    setSelectedService(service);
    setSubmitted(false);
    setFormError("");
    setForm({
      name: user?.name ?? "Daniel Osei",
      role: "",
      quantity: "",
      timeline: "",
      budget: "",
      details: "",
    });
  };

  const closeServiceForm = () => {
    setSelectedService(null);
    setSubmitted(false);
    setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedService) return;
    if (
      !form.name.trim() ||
      !form.role.trim() ||
      !form.quantity.trim()
    ) {
      setFormError("Please complete the required fields.");
      return;
    }

    const refCode = `REQ-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    addMarketRequest({
      categoryId: "cat-talent",
      categoryName: "Talent Solutions",
      title: `${selectedService.title} — ${form.role.trim()} (${form.quantity.trim()})`,
      details:
        form.details.trim() ||
        `${selectedService.roleLabel}: ${form.role.trim()}\n${selectedService.quantityLabel}: ${form.quantity.trim()}`,
      budgetRange: form.budget.trim() || "Flexible",
      timeline: form.timeline.trim(),
      kind: "end-to-end-staffing",
      meta: {
        buyerId: user?.id || "usr-mkt-buyer",
        reference: refCode,
        status: "in_progress",
        role: form.role.trim(),
        quantity: form.quantity.trim(),
      },
    });

    addInquiry({
      type: "service_request",
      name: form.name.trim(),
      email: user?.email || "d.osei@vertexbuild.com",
      company: user?.company || "Vertex Build Group",
      timeline: form.timeline.trim(),
      budgetRange: form.budget.trim() || "Flexible",
      serviceName: `${selectedService.title} — ${form.role.trim()}`,
      requirements:
        form.details.trim() ||
        `${selectedService.roleLabel}: ${form.role.trim()}\n${selectedService.quantityLabel}: ${form.quantity.trim()}`,
    });

    setSubmitted(true);
    toast({
      title: "Request submitted",
      description: `Your ${selectedService.title} request (${refCode}) is now listed in Your Talent Transactions.`,
    });
  };

  return (
    <div
      data-theme="light"
      className="mx-auto flex h-full w-full max-w-[1650px] flex-col text-slate-900"
      style={{ color: "#0f172a" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-slot="select-content"] {
              background-color: #ffffff !important;
              color: #0f172a !important;
              border-color: #e2e8f0 !important;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
            }
            [data-slot="select-item"] {
              color: #0f172a !important;
              background-color: #ffffff !important;
            }
            [data-slot="select-item"]:hover,
            [data-slot="select-item"][data-highlighted],
            [data-slot="select-item"]:focus {
              background-color: #fef3c7 !important;
              color: #78350f !important;
            }
            [data-slot="select-item"][data-state="checked"] {
              background-color: #fef3c7 !important;
              color: #b45309 !important;
              font-weight: 600 !important;
            }
          `,
        }}
      />
      {/* ============================================================ */}
      {/* SPLIT LAYOUT: LEFT TRANSACTIONS + RIGHT OVERVIEW/INSPECTOR   */}
      {/* ============================================================ */}
      <div className="grid min-h-[calc(100vh-10rem)] gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
        {/* ============================================================ */}
        {/* LEFT SIDE: YOUR TALENT TRANSACTIONS (Image 3)                 */}
        {/* ============================================================ */}
        <aside
          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
          className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow-sm"
        >
          {/* Header */}
          <div className="shrink-0 space-y-3 border-b border-slate-100 pb-3.5">
            <div className="flex items-center justify-between gap-2">
              <h2
                className="text-xs font-bold uppercase tracking-wider text-amber-700"
                style={{ color: "#b45309" }}
              >
                Your Talent Transactions ({filtered.length})
              </h2>

              {/* Status Filter dropdown */}
              <Select
                value={tab}
                onValueChange={(v) => {
                  setTab(v);
                  if (selectedId && !allTalentTxns.find((t) => t.id === selectedId)) {
                    setSelectedId(null);
                  }
                }}
              >
                <SelectTrigger
                  style={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#0f172a" }}
                  className="h-7 w-[125px] border border-slate-300 bg-white text-[11px] font-medium text-slate-900 shadow-2xs hover:bg-slate-50"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  data-theme="light"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    borderColor: "#e2e8f0",
                  }}
                  className="!bg-white !text-slate-900 border !border-slate-200 shadow-xl rounded-xl p-1 z-50 min-w-[140px]"
                >
                  {TAB_OPTIONS.map((t) => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                      }}
                      className="text-xs !text-slate-900 !bg-white hover:!bg-amber-50 hover:!text-amber-900 focus:!bg-amber-100 focus:!text-amber-950 cursor-pointer rounded-lg my-0.5 font-medium"
                    >
                      {t.label} ({counts.get(t.value) ?? 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ backgroundColor: "#ffffff", borderColor: "#cbd5e1", color: "#000000" }}
                className="h-8 pl-8 text-xs placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* List of Transactions */}
          <div className="min-h-0 flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
            {filtered.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
                <Users className="h-8 w-8 text-slate-400" />
                <p className="mt-2 text-xs font-medium text-slate-500">
                  No talent transactions match this filter
                </p>
              </div>
            ) : (
              filtered.map((txn) => {
                const isActive =
                  selectedId === txn.id || selectedId === txn.reference;
                return (
                  <div
                    key={txn.id}
                    onClick={() => {
                      setSelectedId(txn.id);
                      router.replace(
                        `/dashboard/buyer/talent-solutions?id=${txn.id}`,
                        { scroll: false }
                      );
                    }}
                    role="button"
                    tabIndex={0}
                    style={{
                      backgroundColor: isActive ? "#fffbeb" : "#ffffff",
                      borderColor: isActive ? "#f59e0b" : "#e2e8f0",
                    }}
                    className={cn(
                      "group flex flex-col justify-between gap-2.5 rounded-xl border p-3.5 transition-all cursor-pointer shadow-2xs hover:border-amber-400 hover:shadow-sm",
                      isActive ? "ring-1 ring-amber-400/40" : ""
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          style={{
                            backgroundColor:
                              txn.sourceType === "request" ? "#f0f9ff" : "#fff7ed",
                            borderColor:
                              txn.sourceType === "request" ? "#e0f2fe" : "#ffedd5",
                            color:
                              txn.sourceType === "request" ? "#0284c7" : "#d97706",
                          }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs"
                        >
                          {txn.sourceType === "request" ? (
                            <ClipboardCheck className="h-4 w-4" />
                          ) : (
                            <Briefcase className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-xs font-bold truncate transition-colors",
                              isActive
                                ? "text-amber-800"
                                : "text-slate-900 group-hover:text-amber-700"
                            )}
                            style={{ color: isActive ? "#92400e" : "#0f172a" }}
                          >
                            {txn.title}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {txn.reference}
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                          getStatusBadgeClass(txn.status)
                        )}
                      >
                        {txn.status === "in_progress"
                          ? "IN PROGRESS"
                          : txn.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                      <span>{timeAgo(txn.createdAt)}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-600" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* ============================================================ */}
        {/* RIGHT SIDE: TWO MODES                                        */}
        {/* 1. Transaction Open -> Inspector (Talent Solutions HIDDEN)   */}
        {/* 2. No Transaction Open -> Talent Solutions & Services        */}
        {/* ============================================================ */}
        <main className="flex min-h-0 flex-col overflow-y-auto">
          {selectedTxn ? (
            /* ============================================================ */
            /* MODE 1: TRANSACTION DETAIL INSPECTOR (Image 1 Inspector)     */
            /* ============================================================ */
            <TalentTransactionInspector
              txn={selectedTxn}
              linkedQuote={
                selectedTxn.quoteId
                  ? quotes.find((q) => q.id === selectedTxn.quoteId) ?? null
                  : null
              }
              onClose={() => {
                setSelectedId(null);
                router.replace("/dashboard/buyer/talent-solutions", {
                  scroll: false,
                });
              }}
              onAcceptQuote={() => {
                if (selectedTxn.quoteId) {
                  acceptQuote(selectedTxn.quoteId);
                  toast({
                    title: "Quote accepted",
                    description:
                      "The STIOOS practice team will proceed with your cohort setup.",
                  });
                }
              }}
            />
          ) : (
            /* ============================================================ */
            /* MODE 2: TALENT SOLUTIONS & TALENT SERVICES (Image 2)         */
            /* ============================================================ */
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <h1
                    className="text-2xl font-bold text-slate-900"
                    style={{ color: "#0f172a" }}
                  >
                    Talent Solutions
                  </h1>
                  <p
                    className="mt-1 text-sm text-slate-600"
                    style={{ color: "#475569" }}
                  >
                    Hire, train, and deploy job-ready professionals — track your
                    talent transactions here.
                  </p>
                </div>
                <Button
                  asChild
                  style={{ backgroundColor: "#f59e0b", color: "#000000" }}
                  className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-sm"
                >
                  <Link href="/dashboard/buyer/hire-talent">
                    <Briefcase className="mr-1.5 h-4 w-4" />
                    Hire a Talent
                  </Link>
                </Button>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid gap-4 sm:grid-cols-4">
                <div
                  style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-amber-600">
                    <Users className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                      Talent Inquiries
                    </span>
                  </div>
                  <p
                    className="mt-2 text-2xl font-bold text-slate-900"
                    style={{ color: "#0f172a" }}
                  >
                    {stats.totalInquiries}
                  </p>
                </div>
                <div
                  style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-sky-600">
                    <ClipboardCheck className="h-4 w-4 text-sky-600" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                      Active Requests
                    </span>
                  </div>
                  <p
                    className="mt-2 text-2xl font-bold text-slate-900"
                    style={{ color: "#0f172a" }}
                  >
                    {stats.activeRequests}
                  </p>
                </div>
                <div
                  style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-emerald-600">
                    <UserCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Completed
                    </span>
                  </div>
                  <p
                    className="mt-2 text-2xl font-bold text-slate-900"
                    style={{ color: "#0f172a" }}
                  >
                    {stats.completed}
                  </p>
                </div>
                <div
                  style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  className="rounded-xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 text-violet-600">
                    <Target className="h-4 w-4 text-violet-600" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                      Consultations
                    </span>
                  </div>
                  <p
                    className="mt-2 text-2xl font-bold text-slate-900"
                    style={{ color: "#0f172a" }}
                  >
                    {stats.consultations}
                  </p>
                </div>
              </div>

              {/* Talent Services Grid */}
              <section>
                <h2
                  className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-700"
                  style={{ color: "#b45309" }}
                >
                  Talent Services
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {TALENT_SERVICES.map((svc) => (
                    <article
                      key={svc.title}
                      style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                      className="group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md"
                    >
                      <span
                        style={{
                          backgroundColor: "#fff7ed",
                          borderColor: "#ffedd5",
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border text-amber-600"
                      >
                        <svc.icon className="h-5 w-5 text-amber-600" />
                      </span>
                      <h3
                        className="mt-3 text-sm font-bold text-slate-900"
                        style={{ color: "#0f172a" }}
                      >
                        {svc.title}
                      </h3>
                      <p
                        className="mt-1 text-xs text-slate-500 leading-relaxed"
                        style={{ color: "#64748b" }}
                      >
                        {svc.desc}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide text-amber-700"
                          style={{ color: "#b45309" }}
                        >
                          {svc.stat}
                        </span>
                        <button
                          type="button"
                          onClick={() => openServiceForm(svc)}
                          className="rounded-md p-1 text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                          aria-label={`Open ${svc.title} request form`}
                        >
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 text-slate-500" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Service Request Form Dialog */}
      <Dialog
        open={Boolean(selectedService)}
        onOpenChange={(open) => !open && closeServiceForm()}
      >
        <DialogContent
          data-theme="light"
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            borderColor: "#e2e8f0",
          }}
          className="max-h-[90vh] overflow-y-auto sm:max-w-[560px] bg-white text-black"
        >
          <DialogHeader>
            <DialogTitle
              className="text-slate-900"
              style={{ color: "#0f172a" }}
            >
              Request {selectedService?.title}
            </DialogTitle>
            <DialogDescription
              className="text-slate-600"
              style={{ color: "#475569" }}
            >
              Share the details below and our talent team will follow up with the
              right next steps.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div
              className="flex flex-col items-center gap-3 py-8 text-center bg-white"
              style={{ backgroundColor: "#ffffff" }}
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              <h3
                className="text-lg font-bold text-slate-900"
                style={{ color: "#0f172a" }}
              >
                Request submitted
              </h3>
              <p
                className="max-w-sm text-sm text-slate-600"
                style={{ color: "#475569" }}
              >
                Your {selectedService?.title} request is now listed in Your
                Talent Transactions.
              </p>
              <Button
                type="button"
                onClick={closeServiceForm}
                style={{ backgroundColor: "#f59e0b", color: "#000000" }}
                className="mt-2 bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-slate-900">
              <div className="space-y-1.5">
                <Label
                  htmlFor="talent-name"
                  className="text-slate-900"
                  style={{ color: "#0f172a" }}
                >
                  Contact name *
                </Label>
                <Input
                  id="talent-name"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    borderColor: "#cbd5e1",
                  }}
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Daniel Osei"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="talent-role"
                    className="text-slate-900"
                    style={{ color: "#0f172a" }}
                  >
                    {selectedService?.roleLabel} *
                  </Label>
                  <Input
                    id="talent-role"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      borderColor: "#cbd5e1",
                    }}
                    value={form.role}
                    onChange={(event) =>
                      setForm({ ...form, role: event.target.value })
                    }
                    placeholder={selectedService?.rolePlaceholder}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="talent-quantity"
                    className="text-slate-900"
                    style={{ color: "#0f172a" }}
                  >
                    {selectedService?.quantityLabel} *
                  </Label>
                  <Input
                    id="talent-quantity"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      borderColor: "#cbd5e1",
                    }}
                    value={form.quantity}
                    onChange={(event) =>
                      setForm({ ...form, quantity: event.target.value })
                    }
                    placeholder={selectedService?.quantityPlaceholder}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="talent-budget"
                  className="text-slate-900"
                  style={{ color: "#0f172a" }}
                >
                  Budget range
                </Label>
                <Input
                  id="talent-budget"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    borderColor: "#cbd5e1",
                  }}
                  value={form.budget}
                  onChange={(event) =>
                    setForm({ ...form, budget: event.target.value })
                  }
                  placeholder="e.g. $10k–$20k"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="talent-details"
                  className="text-slate-900"
                  style={{ color: "#0f172a" }}
                >
                  {selectedService?.detailsLabel}
                </Label>
                <Textarea
                  id="talent-details"
                  rows={4}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    borderColor: "#cbd5e1",
                  }}
                  value={form.details}
                  onChange={(event) =>
                    setForm({ ...form, details: event.target.value })
                  }
                  placeholder={selectedService?.detailsPlaceholder}
                />
              </div>
              {formError && (
                <p className="text-sm font-medium text-destructive">{formError}</p>
              )}
              <Button
                type="submit"
                style={{ backgroundColor: "#f59e0b", color: "#000000" }}
                className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit request
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// TALENT TRANSACTION INSPECTOR (Image 1 Split View Right Card)
// ============================================================
function TalentTransactionInspector({
  txn,
  linkedQuote,
  onClose,
  onAcceptQuote,
}: {
  txn: UnifiedTalentTxn;
  linkedQuote?: any;
  onClose: () => void;
  onAcceptQuote: () => void;
}) {
  const { steps, currentStep } = getLifecycleConfigForTxn(txn);

  // Parse structured details
  const details = txn.details || "";
  const lines = details
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const structuredFields: { label: string; value: string }[] = [];
  let freeTextStatement = "";

  for (const line of lines) {
    if (line.startsWith("[") && line.endsWith("]")) {
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
    <div
      style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
      className="rounded-2xl border bg-white p-5 sm:p-6 shadow-sm space-y-6"
    >
      {/* 1. Header with Title + Close button X + Back navigation */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Talent Services
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close inspector"
              aria-label="Close inspector"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Title Bar */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                TALENT TRANSACTION INSPECTOR
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-xs font-semibold text-slate-600">
                {txn.reference}
              </span>
            </div>
            <h1
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
              style={{ color: "#0f172a" }}
            >
              {txn.title}
            </h1>
            <p className="mt-1 text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span className="font-mono text-amber-700 font-semibold">
                {txn.reference}
              </span>
              <span>·</span>
              <span>{txn.categoryName || "Talent Solutions"}</span>
              <span>·</span>
              <span>Placed {timeAgo(txn.createdAt)}</span>
              {txn.buyerCompany && (
                <>
                  <span>·</span>
                  <span className="text-slate-700 font-medium">
                    {txn.buyerCompany}
                  </span>
                </>
              )}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider",
              getStatusBadgeClass(txn.status)
            )}
          >
            ● {txn.status === "in_progress" ? "In progress" : txn.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* 2. 3 Metric Cards: Amount/Budget, Delivery Type/Timeline, Placed */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Amount / Budget
          </p>
          <p className="mt-1 text-base font-bold text-emerald-600">
            {txn.quotedAmount
              ? formatMoney(txn.quotedAmount)
              : txn.budgetRange || "Standard Tier"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Engagement Model
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {txn.kind === "end-to-end-staffing"
              ? "Direct Placement"
              : txn.kind === "talent-consultation"
              ? "Consultation"
              : "Cohort Training"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Placed / Created
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            {timeAgo(txn.createdAt)}
          </p>
        </div>
      </div>

      {/* 3. Action Banner if Quoted */}
      {txn.status === "quoted" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div>
            <p className="text-sm font-bold text-violet-900">
              Quote Received & Verified
            </p>
            <p className="text-xs text-violet-700 mt-0.5">
              Review calibrated pricing and candidate allocation for your
              engagement.
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

      {/* 4. Lifecycle Stepper */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
          Engagement Lifecycle
        </p>
        <div className="relative flex items-center justify-between">
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
          <div
            className="absolute top-3 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-sky-500 transition-all -z-0"
            style={{ width: `${((currentStep - 1) / Math.max(1, steps.length - 1)) * 100}%` }}
          />

          {steps.map((s) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;
            return (
              <div key={s.step} className="flex flex-col items-center z-10">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                    isCompleted
                      ? "bg-emerald-600 text-white shadow-xs"
                      : isCurrent
                      ? "bg-amber-500 text-slate-950 ring-4 ring-amber-400/20 shadow-sm"
                      : "bg-white text-slate-400 border border-slate-300"
                  )}
                >
                  {isCompleted ? "✓" : s.step}
                </div>
                <span
                  className={cn(
                    "mt-2 text-[10px] font-medium hidden sm:block whitespace-nowrap",
                    isCurrent
                      ? "text-amber-800 font-bold"
                      : isCompleted
                      ? "text-slate-700"
                      : "text-slate-400"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Talent Scope & Criteria */}
      {structuredFields.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Talent Scope & Screening Criteria
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {structuredFields.map((field) => (
              <div
                key={field.label}
                className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-xs"
              >
                <span className="text-slate-500 font-medium">{field.label}</span>
                <span className="font-semibold text-slate-900 text-right">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Description / Statement */}
      {(freeTextStatement || details) && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Description & Requirements
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
            {details}
          </div>
        </div>
      )}

      {/* 7. Contact Profile */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
          Contact & Organization Profile
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <p className="text-slate-500">Applicant / Contact</p>
            <p className="mt-0.5 font-semibold text-slate-900">
              {txn.buyerName || txn.meta?.name || "Daniel Osei"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Email Address</p>
            <p className="mt-0.5 font-semibold text-slate-900">
              {txn.email || txn.meta?.email || "d.osei@vertexbuild.com"}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Phone & Dial Code</p>
            <p className="mt-0.5 font-semibold text-slate-900">
              {txn.phone || txn.meta?.phone || "+1 555 01001"}
            </p>
          </div>
        </div>
      </div>

      {/* 8. Linked Records */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
          Linked Records
        </p>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-amber-600" />
            <span className="font-semibold text-slate-900">{txn.reference}</span>
            <span className="text-slate-500">· Stioos Talent Pool Record</span>
          </div>
          <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] text-slate-700 font-mono">
            SLA Guaranteed
          </span>
        </div>
      </div>
    </div>
  );
}
