"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { Users, ArrowRight, Briefcase, TrendingUp, Award, GraduationCap, UserCheck, Target, Layers, ClipboardCheck, CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useMemo, useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
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
  const user = useCurrentUser();
  const inquiries = useAppStore((s) => s.inquiries);
  const requests = useAppStore((s) => s.requests);
  const addInquiry = useAppStore((s) => s.addInquiry);
  const [selectedService, setSelectedService] = useState<TalentService | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", role: "", quantity: "", timeline: "", budget: "", details: "" });

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
    () => inquiries.filter(
      (i) => i.email === user?.email && (
        TALENT_SERVICE_NAMES.has(i.serviceName?.toLowerCase() ?? "") ||
        i.serviceName?.toLowerCase().includes("talent") ||
        i.serviceName?.toLowerCase().includes("training") ||
        i.serviceName?.toLowerCase().includes("staffing") ||
        i.serviceName?.toLowerCase().includes("hire") ||
        i.type === "consultation"
      )
    ),
    [inquiries, user]
  );

  const talentRequests = useMemo(
    () => requests.filter(
      (r) => r.buyerId === user?.id && (
        r.title?.toLowerCase().includes("talent") ||
        r.title?.toLowerCase().includes("hire") ||
        r.title?.toLowerCase().includes("training") ||
        r.title?.toLowerCase().includes("staff")
      )
    ),
    [requests, user]
  );

  const stats = {
    totalInquiries: talentInquiries.length,
    activeRequests: talentRequests.filter((r) => r.status === "open" || r.status === "in_review").length,
    completed: talentRequests.filter((r) => r.status === "fulfilled" || r.status === "completed").length,
    consultations: talentInquiries.filter((i) => i.type === "consultation").length,
  };

  const services = [
    { icon: GraduationCap, title: "Train to Hire", desc: "Train cohorts on your stack — pipeline, not lottery", href: "/talent-solutions/train-to-hire", stat: "8–12 wks" },
    { icon: UserCheck, title: "Hire Pre-Vetted Talent", desc: "2M+ assessed talent pool — shortlists in 48 hours", href: "/talent-solutions/talent-recruitment", stat: "48h SLA" },
    { icon: Layers, title: "Flexible Deployment", desc: "Contract, project-based, or dedicated team", href: "/talent-solutions/talent-deployment", stat: "On-demand" },
    { icon: Award, title: "Talent Assessment", desc: "AI-powered skills evaluation and certification", href: "/talent-solutions/talent-assessment", stat: "200+ tracks" },
    { icon: Briefcase, title: "Staffing Solutions", desc: "Contract, permanent, or project-based hiring", href: "/talent-solutions/staffing-solutions", stat: "Flexible" },
    { icon: TrendingUp, title: "Workforce Management", desc: "End-to-end workforce strategy and bench", href: "/talent-solutions/workforce-solutions", stat: "Full lifecycle" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white">Talent Solutions</h1>
          <p className="mt-1 text-sm text-slate-400">
            Hire, train, and deploy job-ready professionals — track your talent transactions here.
          </p>
        </div>
        <Button
          asChild
          className="bg-amber-500 text-slate-900 hover:bg-amber-400"
        >
          <Link href="/dashboard/buyer/hire-talent">
            <Briefcase className="mr-1.5 h-4 w-4" />
            Hire a Talent
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Talent Inquiries</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.totalInquiries}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sky-400">
            <ClipboardCheck className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Active Requests</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.activeRequests}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <UserCheck className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Completed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.completed}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-violet-400">
            <Target className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Consultations</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.consultations}</p>
        </div>
      </div>

      {/* Talent services */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-400">Talent Services</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TALENT_SERVICES.map((svc) => (
            <article
              key={svc.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-amber-400/30"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
                <svc.icon className="h-5 w-5 text-amber-400" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-white">{svc.title}</h3>
              <p className="mt-1 text-xs text-slate-400">{svc.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-amber-400">{svc.stat}</span>
                <button
                  type="button"
                  onClick={() => openServiceForm(svc)}
                  className="rounded-md p-1 text-slate-600 transition-all hover:bg-amber-400/10 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  aria-label={`Open ${svc.title} request form`}
                >
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Dialog open={Boolean(selectedService)} onOpenChange={(open) => !open && closeServiceForm()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Request {selectedService?.title}</DialogTitle>
            <DialogDescription>Share the details below and our talent team will follow up with the right next steps.</DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Request submitted</h3>
              <p className="max-w-sm text-sm text-slate-400">Your {selectedService?.title} request is now listed in Your Talent Transactions.</p>
              <Button type="button" onClick={closeServiceForm} className="bg-amber-500 text-slate-900 hover:bg-amber-400">Done</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="talent-name">Full name *</Label>
                <Input id="talent-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="talent-role">{selectedService?.roleLabel} *</Label>
                  {selectedService?.title === "Train to Hire" ? (
                    <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                      <SelectTrigger id="talent-role" className="w-full">
                        <SelectValue placeholder="Select training focus" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRAINING_FOCUS_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="talent-role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder={selectedService?.rolePlaceholder} />
                  )}
                </div>
                <div className="space-y-1.5"><Label htmlFor="talent-quantity">{selectedService?.quantityLabel} *</Label><Input id="talent-quantity" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} placeholder={selectedService?.quantityPlaceholder} /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label htmlFor="talent-timeline">Target timeline *</Label><Input id="talent-timeline" value={form.timeline} onChange={(event) => setForm({ ...form, timeline: event.target.value })} placeholder="e.g. Start within 30 days" /></div>
                <div className="space-y-1.5"><Label htmlFor="talent-budget">Budget range</Label><Input id="talent-budget" value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} placeholder="e.g. $10k–$20k" /></div>
              </div>
              <div className="space-y-1.5"><Label htmlFor="talent-details">{selectedService?.detailsLabel}</Label><Textarea id="talent-details" rows={4} value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder={selectedService?.detailsPlaceholder} /></div>
              {formError && <p className="text-sm font-medium text-destructive">{formError}</p>}
              <Button type="submit" className="w-full bg-amber-500 text-slate-900 hover:bg-amber-400"><Send className="h-4 w-4" />Submit request</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Talent transactions */}
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-400">Your Talent Transactions</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {talentInquiries.length === 0 && talentRequests.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-600" aria-hidden="true" />
              <p className="mt-3 text-sm text-slate-400">No talent transactions yet.</p>
              <p className="mt-1 text-xs text-slate-500">Explore talent services or hire a talent to get started.</p>
              <Link
                href="/dashboard/buyer/hire-talent"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-brand-ink hover:bg-amber-400"
              >
                Hire a Talent
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Inquiries */}
              {talentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{inq.serviceName ?? inq.type.replace("_", " ")}</p>
                      <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">
                        {inq.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{inq.requirements}</p>
                    <p className="mt-1 text-[11px] text-slate-500">Budget: {inq.budgetRange} · Timeline: {inq.timeline}</p>
                  </div>
                </div>
              ))}
              {/* Requests */}
              {talentRequests.map((req) => (
                <div key={req.id} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 text-sky-400">
                    <ClipboardCheck className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{req.title}</p>
                      <span className="rounded-full bg-sky-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-400">
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{req.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <Users className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-bold text-white">Need talent fast?</h2>
        <p className="mt-1 text-sm text-slate-400">Get AI-matched shortlists in 48 hours from a 2M+ pool.</p>
        <Link
          href="/dashboard/buyer/hire-talent"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-brand-ink hover:bg-amber-400"
        >
          Hire a Talent
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
