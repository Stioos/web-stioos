"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { Users, ArrowRight, Briefcase, TrendingUp, Award, GraduationCap, UserCheck, Target, Layers, ClipboardCheck, CheckCircle2, Send, Trash2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useMemo, useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  { icon: GraduationCap, title: "Train to Hire", desc: "Train cohorts on your stack — pipeline, not lottery", stat: "8–12 wks", roleLabel: "Training focus", rolePlaceholder: "e.g. React and Node.js engineers", quantityLabel: "Candidate", quantityPlaceholder: "e.g. 12 candidates", detailsLabel: "Skills and outcome", detailsPlaceholder: "Share the stack, target roles, and the outcome you need from the cohort." },
  { icon: UserCheck, title: "Hire Pre-Vetted Talent", desc: "2M+ assessed talent pool — shortlists in 48 hours", stat: "48h SLA", roleLabel: "Role to hire", rolePlaceholder: "e.g. Senior frontend engineer", quantityLabel: "Number of hires", quantityPlaceholder: "e.g. 3", detailsLabel: "Candidate requirements", detailsPlaceholder: "Describe the skills, seniority, location, and work arrangement." },
  { icon: Layers, title: "Flexible Deployment", desc: "Contract, project-based, or dedicated team", stat: "On-demand", roleLabel: "Team or role needed", rolePlaceholder: "e.g. Dedicated QA team", quantityLabel: "Team size", quantityPlaceholder: "e.g. 4 people", detailsLabel: "Deployment requirements", detailsPlaceholder: "Describe the engagement type, required skills, and preferred working model." },
  { icon: Award, title: "Talent Assessment", desc: "AI-powered skills evaluation and certification", stat: "200+ tracks", roleLabel: "Roles to assess", rolePlaceholder: "e.g. Data analyst applicants", quantityLabel: "Candidates to assess", quantityPlaceholder: "e.g. 25", detailsLabel: "Assessment requirements", detailsPlaceholder: "Share the capabilities to evaluate, assessment goals, and any certification needs." },
  { icon: Briefcase, title: "Staffing Solutions", desc: "Contract, permanent, or project-based hiring", stat: "Flexible", roleLabel: "Roles to staff", rolePlaceholder: "e.g. Product designers", quantityLabel: "Number of openings", quantityPlaceholder: "e.g. 5", detailsLabel: "Staffing requirements", detailsPlaceholder: "Describe employment type, experience level, skills, and location requirements." },
  { icon: TrendingUp, title: "Workforce Management", desc: "End-to-end workforce strategy and bench", stat: "Full lifecycle", roleLabel: "Workforce objective", rolePlaceholder: "e.g. Scale our support organization", quantityLabel: "Current team size", quantityPlaceholder: "e.g. 80 people", detailsLabel: "Workforce requirements", detailsPlaceholder: "Describe your workforce challenge, goals, and the support you need." },
];

const TALENT_SERVICE_NAMES = new Set(TALENT_SERVICES.map((service) => service.title.toLowerCase()));

const TRAINING_FOCUS_OPTIONS = [
  "Forward Deployed Engineer",
  "Fullstack Development Engineering",
  "Digital Sales & AI Marketing / AI Engineering",
  "Cloud, DevOps & MLOps",
  "Gen AI & Agentic Automation Engineer",
];

export default function TalentSolutionsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Talent Solutions">
        <TalentSolutionsContent />
      </DashboardShell>
    </RequireRole>
  );
}

function TalentSolutionsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useCurrentUser();
  const inquiries = useAppStore((s) => s.inquiries);
  const requests = useAppStore((s) => s.requests);
  const addInquiry = useAppStore((s) => s.addInquiry);
  const addMarketRequest = useAppStore((s) => s.addMarketRequest);
  const deleteMarketRequest = useAppStore((s) => s.deleteMarketRequest);
  const deleteInquiry = useAppStore((s) => s.deleteInquiry);
  const [selectedService, setSelectedService] = useState<TalentService | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", role: "", quantity: "", timeline: "", budget: "", details: "" });

  const handleDeleteRequest = (id: string, title: string) => {
    deleteMarketRequest(id);
    toast({
      title: "Transaction deleted",
      description: `Removed "${title}" from Your Talent Transactions.`,
    });
  };

  const handleDeleteInquiry = (id: string, title: string) => {
    deleteInquiry(id);
    toast({
      title: "Transaction deleted",
      description: `Removed "${title}" from Your Talent Transactions.`,
    });
  };

  const handleInquiryClick = (inq: (typeof talentInquiries)[0]) => {
    router.push(`/dashboard/buyer/talent-transactions?id=${inq.id}`);
  };

  const openServiceForm = (service: TalentService) => {
    setSelectedService(service);
    setSubmitted(false);
    setFormError("");
    setForm({ name: user?.name ?? "", role: "", quantity: "", timeline: "", budget: "", details: "" });
  };

  const closeServiceForm = () => {
    setSelectedService(null);
    setSubmitted(false);
    setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedService) return;
    if (!form.name.trim() || !form.role.trim() || !form.quantity.trim() || !form.timeline.trim()) {
      setFormError("Please complete the required fields.");
      return;
    }

    const refCode = `REQ-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    addMarketRequest({
      categoryId: "cat-talent",
      categoryName: "Talent Solutions",
      title: `${selectedService.title} — ${form.role.trim()} (${form.quantity.trim()})`,
      details: form.details.trim() || `${selectedService.roleLabel}: ${form.role.trim()}\n${selectedService.quantityLabel}: ${form.quantity.trim()}`,
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
      email: user?.email ?? "",
      company: user?.company ?? "",
      phone: user?.phone ?? "",
      serviceName: selectedService.title,
      requirements: [
        `${selectedService.roleLabel}: ${form.role.trim()}`,
        `${selectedService.quantityLabel}: ${form.quantity.trim()}`,
        form.details.trim() ? `${selectedService.detailsLabel}: ${form.details.trim()}` : "",
      ].filter(Boolean).join("\n"),
      budgetRange: form.budget.trim() || "Not specified",
      timeline: form.timeline.trim(),
    });
    setSubmitted(true);
  };

  // Talent-related transactions for this buyer
  const talentInquiries = useMemo(
    () =>
      inquiries.filter((i) => {
        const matchesUser =
          !user ||
          i.email?.toLowerCase() === user?.email?.toLowerCase() ||
          i.name?.toLowerCase() === user?.name?.toLowerCase() ||
          (user?.id === "usr-mkt-buyer" && i.email?.includes("northwind")) ||
          (user?.id === "usr-001" && i.email?.includes("vertex"));
        const matchesTalent =
          TALENT_SERVICE_NAMES.has(i.serviceName?.toLowerCase() ?? "") ||
          i.serviceName?.toLowerCase().includes("talent") ||
          i.serviceName?.toLowerCase().includes("training") ||
          i.serviceName?.toLowerCase().includes("staffing") ||
          i.serviceName?.toLowerCase().includes("hire") ||
          i.serviceName?.toLowerCase().includes("placement") ||
          i.serviceName?.toLowerCase().includes("curriculum") ||
          i.serviceName?.toLowerCase().includes("screening") ||
          i.serviceName?.toLowerCase().includes("sprint") ||
          i.serviceName?.toLowerCase().includes("assessment") ||
          i.serviceName?.toLowerCase().includes("deployment") ||
          i.type === "consultation" ||
          i.type === "service_request" ||
          i.type === "quote";
        return matchesUser && matchesTalent;
      }),
    [inquiries, user]
  );

  const talentRequests = useMemo(
    () =>
      requests.filter((r) => {
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
      }),
    [requests, user]
  );

  const stats = {
    totalInquiries: talentInquiries.length,
    activeRequests: talentRequests.filter((r) => r.status === "open" || r.status === "in_review" || r.status === "in_progress").length,
    completed: talentRequests.filter((r) => r.status === "fulfilled" || r.status === "completed").length,
    consultations: talentInquiries.filter((i) => i.type === "consultation").length,
  };

  return (
    <div data-theme="light" className="space-y-6 text-slate-900" style={{ color: "#0f172a" }}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900" style={{ color: "#0f172a" }}>Talent Solutions</h1>
          <p className="mt-1 text-sm text-slate-600" style={{ color: "#475569" }}>
            Hire, train, and deploy job-ready professionals — track your talent transactions here.
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div
          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-amber-600">
            <Users className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">Talent Inquiries</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900" style={{ color: "#0f172a" }}>{stats.totalInquiries}</p>
        </div>
        <div
          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-sky-600">
            <ClipboardCheck className="h-4 w-4 text-sky-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-700">Active Requests</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900" style={{ color: "#0f172a" }}>{stats.activeRequests}</p>
        </div>
        <div
          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-emerald-600">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Completed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900" style={{ color: "#0f172a" }}>{stats.completed}</p>
        </div>
        <div
          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
          className="rounded-xl border bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-2 text-violet-600">
            <Target className="h-4 w-4 text-violet-600" />
            <span className="text-xs font-semibold uppercase tracking-wide text-violet-700">Consultations</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900" style={{ color: "#0f172a" }}>{stats.consultations}</p>
        </div>
      </div>

      {/* Talent services */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-700" style={{ color: "#b45309" }}>Talent Services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TALENT_SERVICES.map((svc) => (
            <article
              key={svc.title}
              style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
              className="group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md"
            >
              <span
                style={{ backgroundColor: "#fff7ed", borderColor: "#ffedd5" }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border text-amber-600"
              >
                <svc.icon className="h-5 w-5 text-amber-600" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900" style={{ color: "#0f172a" }}>{svc.title}</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed" style={{ color: "#64748b" }}>{svc.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700" style={{ color: "#b45309" }}>{svc.stat}</span>
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

      <Dialog open={Boolean(selectedService)} onOpenChange={(open) => !open && closeServiceForm()}>
        <DialogContent
          data-theme="light"
          style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#e2e8f0" }}
          className="max-h-[90vh] overflow-y-auto sm:max-w-[560px] bg-white text-black"
        >
          <DialogHeader>
            <DialogTitle className="text-slate-900" style={{ color: "#0f172a" }}>Request {selectedService?.title}</DialogTitle>
            <DialogDescription className="text-slate-600" style={{ color: "#475569" }}>
              Share the details below and our talent team will follow up with the right next steps.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center bg-white" style={{ backgroundColor: "#ffffff" }}>
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900" style={{ color: "#0f172a" }}>Request submitted</h3>
              <p className="max-w-sm text-sm text-slate-600" style={{ color: "#475569" }}>Your {selectedService?.title} request is now listed in Your Talent Transactions.</p>
              <Button
                type="button"
                onClick={closeServiceForm}
                style={{ backgroundColor: "#f59e0b", color: "#000000" }}
                className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white" style={{ backgroundColor: "#ffffff", color: "#000000" }}>
              <div className="space-y-1.5">
                <Label htmlFor="talent-name" className="text-slate-900" style={{ color: "#0f172a" }}>Full name *</Label>
                <Input
                  id="talent-name"
                  style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }}
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Your name"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="talent-role" className="text-slate-900" style={{ color: "#0f172a" }}>{selectedService?.roleLabel} *</Label>
                  {selectedService?.title === "Train to Hire" ? (
                    <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                      <SelectTrigger
                        id="talent-role"
                        style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }}
                        className="w-full bg-white text-black"
                      >
                        <SelectValue placeholder="Select training focus" />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: "#ffffff", color: "#000000" }}>
                        {TRAINING_FOCUS_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="talent-role"
                      style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }}
                      value={form.role}
                      onChange={(event) => setForm({ ...form, role: event.target.value })}
                      placeholder={selectedService?.rolePlaceholder}
                    />
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="talent-quantity" className="text-slate-900" style={{ color: "#0f172a" }}>{selectedService?.quantityLabel} *</Label>
                  <Input
                    id="talent-quantity"
                    style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }}
                    value={form.quantity}
                    onChange={(event) => setForm({ ...form, quantity: event.target.value })}
                    placeholder={selectedService?.quantityPlaceholder}
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="talent-timeline" className="text-slate-900" style={{ color: "#0f172a" }}>Target timeline *</Label>
                  <Input
                    id="talent-timeline"
                    style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }}
                    value={form.timeline}
                    onChange={(event) => setForm({ ...form, timeline: event.target.value })}
                    placeholder="e.g. Start within 30 days"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="talent-budget" className="text-slate-900" style={{ color: "#0f172a" }}>Budget range</Label>
                  <Input
                    id="talent-budget"
                    style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }}
                    value={form.budget}
                    onChange={(event) => setForm({ ...form, budget: event.target.value })}
                    placeholder="e.g. $10k–$20k"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="talent-details" className="text-slate-900" style={{ color: "#0f172a" }}>{selectedService?.detailsLabel}</Label>
                <Textarea
                  id="talent-details"
                  rows={4}
                  style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#cbd5e1" }}
                  value={form.details}
                  onChange={(event) => setForm({ ...form, details: event.target.value })}
                  placeholder={selectedService?.detailsPlaceholder}
                />
              </div>
              {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}
              <Button
                type="submit"
                style={{ backgroundColor: "#f59e0b", color: "#000000" }}
                className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                <Send className="h-4 w-4" />Submit request
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Talent transactions */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-700" style={{ color: "#b45309" }}>Your Talent Transactions</h2>
        <div
          style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
          className="rounded-2xl border bg-white p-5 sm:p-6 shadow-sm"
        >
          {talentInquiries.length === 0 && talentRequests.length === 0 ? (
            <div className="py-8 text-center bg-white" style={{ backgroundColor: "#ffffff" }}>
              <Users className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
              <p className="mt-3 text-sm text-slate-700" style={{ color: "#334155" }}>No talent transactions yet.</p>
              <p className="mt-1 text-xs text-slate-500" style={{ color: "#64748b" }}>Explore talent services or hire a talent to get started.</p>
              <Link
                href="/dashboard/buyer/hire-talent"
                style={{ backgroundColor: "#f59e0b", color: "#000000" }}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-slate-950 hover:bg-amber-400"
              >
                Hire a Talent
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Requests */}
              {talentRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => router.push(`/dashboard/buyer/talent-transactions?id=${req.id}`)}
                  style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow-2xs transition-all hover:border-amber-400 hover:shadow-md cursor-pointer"
                  title="Click to view request details"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      style={{ backgroundColor: "#f0f9ff", borderColor: "#e0f2fe", color: "#0284c7" }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sky-600 group-hover:border-sky-400 transition-colors"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex flex-wrap items-center gap-2.5">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-amber-600 transition-colors" style={{ color: "#0f172a" }}>
                        {req.title}
                      </p>
                      <span
                        style={{ backgroundColor: "#ecfeff", borderColor: "#a5f3fc", color: "#0891b2" }}
                        className="shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-700"
                      >
                        {req.status === "in_progress"
                          ? "IN PROGRESS"
                          : req.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500 pl-12 sm:pl-0">
                    {req.timeline && <span style={{ color: "#64748b" }}>{req.timeline}</span>}
                    {req.reference && (
                      <span
                        style={{ backgroundColor: "#f1f5f9", color: "#475569" }}
                        className="font-mono text-[11px] px-2 py-0.5 rounded"
                      >
                        {req.reference}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest(req.id, req.title);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                      title="Delete transaction"
                      aria-label={`Delete ${req.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500" />
                  </div>
                </div>
              ))}

              {/* Inquiries that aren't duplicate requests */}
              {talentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => handleInquiryClick(inq)}
                  style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow-2xs transition-all hover:border-amber-400 hover:shadow-md cursor-pointer"
                  title="Click to view request details"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      style={{ backgroundColor: "#fff7ed", borderColor: "#ffedd5", color: "#d97706" }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-amber-600 group-hover:border-amber-400 transition-colors"
                    >
                      <Briefcase className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex flex-wrap items-center gap-2.5">
                      <p className="text-sm font-bold text-slate-900 truncate group-hover:text-amber-600 transition-colors" style={{ color: "#0f172a" }}>
                        {inq.serviceName ?? inq.type.replace("_", " ")}
                      </p>
                      <span
                        style={{ backgroundColor: "#fffbeb", borderColor: "#fde68a", color: "#b45309" }}
                        className="shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800"
                      >
                        {inq.status === "in_progress"
                          ? "IN PROGRESS"
                          : inq.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500 pl-12 sm:pl-0">
                    {inq.timeline && <span style={{ color: "#64748b" }}>{inq.timeline}</span>}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteInquiry(inq.id, inq.serviceName || inq.type);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                      title="Delete transaction"
                      aria-label={`Delete ${inq.serviceName || inq.type}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div
        style={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
        className="rounded-2xl border bg-white p-8 text-center shadow-sm"
      >
        <Users className="mx-auto h-8 w-8 text-amber-500" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-bold text-slate-900" style={{ color: "#0f172a" }}>Need talent fast?</h2>
        <p className="mt-1 text-sm text-slate-600" style={{ color: "#475569" }}>Get AI-matched shortlists in 48 hours from a 2M+ pool.</p>
        <Link
          href="/dashboard/buyer/hire-talent"
          style={{ backgroundColor: "#f59e0b", color: "#000000" }}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400"
        >
          Hire a Talent
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
