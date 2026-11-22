"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { Briefcase, Users, ArrowRight, Search, UserCheck, Zap } from "lucide-react";
import Link from "next/link";

export default function HireTalentPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Hire a Talent">
        <HireTalentContent />
      </DashboardShell>
    </RequireRole>
  );
}

function HireTalentContent() {
  const options = [
    {
      icon: Search,
      title: "Browse Talent Pool",
      description: "Search 2M+ pre-vetted professionals across AI, cloud, data, and full-stack.",
      stat: "2M+ candidates",
      href: "/talent-solutions/staffing-solutions",
      accent: "from-sky-500/10 to-blue-600/10",
    },
    {
      icon: UserCheck,
      title: "Get AI-Matched Shortlists",
      description: "Tell us your role spec — get shortlisted candidates in 48 hours.",
      stat: "48h shortlists",
      href: "/talent-solutions/talent-recruitment",
      accent: "from-emerald-500/10 to-teal-600/10",
    },
    {
      icon: Zap,
      title: "Train to Hire Cohorts",
      description: "Build a custom training cohort on your stack — graduate job-ready talent.",
      stat: "8–12 week programs",
      href: "/talent-solutions/train-to-hire",
      accent: "from-amber-500/10 to-orange-600/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Hire a Talent</h1>
        <p className="mt-1 text-sm text-slate-400">
          Source, screen, and deploy job-ready professionals — one partner from assessment to placement.
        </p>
      </div>

      {/* Hire options */}
      <div className="grid gap-4 lg:grid-cols-3">
        {options.map((opt) => (
          <Link
            key={opt.title}
            href={opt.href}
            className={`group rounded-2xl border border-white/10 bg-gradient-to-br ${opt.accent} p-6 transition-all hover:-translate-y-1 hover:border-amber-400/30`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
              <opt.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-bold text-white">{opt.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{opt.description}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-amber-400">{opt.stat}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-400 transition-all group-hover:gap-2">
              Get started
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">2M+</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Talent Pool</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-2xl font-bold text-sky-400">48h</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Shortlist SLA</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">96%</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Retention</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">500+</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Employers</p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <Users className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
        <h2 className="mt-3 text-lg font-bold text-white">Need help choosing?</h2>
        <p className="mt-1 text-sm text-slate-400">Talk to a talent expert — free 30-minute consultation.</p>
        <Link
          href="/contact"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400"
        >
          Book a Call
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
