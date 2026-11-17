import Link from "next/link";
import type { Metadata } from "next";
import {
  BrainCircuit,
  Briefcase,
  Building2,
  ClipboardCheck,
  GraduationCap,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// TALENT SOLUTIONS — End-to-end talent management
// ============================================================

export const metadata: Metadata = {
  title: "Talent Solutions",
  description:
    "Comprehensive talent solutions from STIOOS — train to hire, hire to train, staffing, corporate training, AI-powered talent assessment, and placements.",
};

type Offering = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const OFFERINGS: Offering[] = [
  {
    id: "train-to-hire",
    title: "Train to Hire",
    description:
      "Upskill candidates to your exact requirements, then hire job-ready talent.",
    icon: UserCheck,
  },
  {
    id: "hire-to-train",
    title: "Hire to Train",
    description:
      "Hire promising talent and invest in their growth with structured training.",
    icon: GraduationCap,
  },
  {
    id: "staffing-solutions",
    title: "Staffing Solutions",
    description:
      "Flexible staffing models — contract, permanent, or project-based hiring.",
    icon: Users,
  },
  {
    id: "corporate-training",
    title: "Corporate Training",
    description:
      "Custom corporate training programs to upskill your workforce at scale.",
    icon: Building2,
  },
  {
    id: "talent-assessment",
    title: "Talent Assessment",
    description:
      "AI-powered assessments to evaluate skills, aptitude, and job readiness.",
    icon: ClipboardCheck,
  },
  {
    id: "placements",
    title: "Placements",
    description:
      "Dedicated placement cell connecting trained talent with top employers.",
    icon: Briefcase,
  },
];

const HIGHLIGHTS = [
  {
    icon: BrainCircuit,
    value: "2M+",
    description: "AI-powered talent sourcing from 2M+ candidates.",
  },
  {
    icon: Users,
    value: "Flexible",
    description: "Deploy talent flexibly — contract, project-based, or on-demand staffing.",
  },
];

export default function TalentSolutionsPage() {
  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-brand-ink text-white">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(30,100,232,0.25), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
          <p className="eyebrow flex items-center justify-center gap-2 text-amber-400">
            <span className="inline-block h-px w-6 bg-amber-400/60" />
            Talent Solutions
            <span className="inline-block h-px w-6 bg-amber-400/60" />
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Comprehensive <span className="text-gradient-brand">Talent Solutions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            End-to-end talent management from training to hiring, staffing, and corporate programs.
          </p>
        </div>
      </section>

      {/* ========================== OFFERINGS ========================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-amber-400">What We Deliver</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Six capabilities across the talent lifecycle
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              One partner for sourcing, upskilling, assessment, and placement — built around your
              hiring requirements.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERINGS.map((offering) => (
              <article
                key={offering.id}
                id={offering.id}
                className="relative scroll-mt-36 overflow-hidden rounded-2xl border border-white/10 bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20">
                  <offering.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white md:text-lg">
                  {offering.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {offering.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= HIGHLIGHTS BAND ======================= */}
      <section
        id="workforce"
        className="relative scroll-mt-36 overflow-hidden border-t border-white/[0.06] bg-brand-ink py-16 text-white md:py-20"
      >
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-1/2 h-64 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-amber-400">Talent Network</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              Sourcing and deployment at scale
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {HIGHLIGHTS.map((highlight) => (
              <div
                key={highlight.value}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20">
                  <highlight.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </span>
                <p className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
                  {highlight.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="border-t border-white/[0.06] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-brand-ink px-6 py-14 text-center text-white md:py-16">
            <div className="absolute inset-0 surface-grid" aria-hidden="true" />
            <div
              className="absolute left-1/2 top-0 h-56 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/25 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-2xl">
              <Briefcase className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Build your team with STIOOS
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                Tell us the roles you need to fill. Our talent experts will map them to the right
                engagement model and respond within one business day.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-amber-500 px-8 text-base font-semibold text-brand-ink hover:bg-amber-400"
                >
                  <Link href="/contact">Talk to an Expert</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-transparent px-8 text-base font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/marketplace">Explore the Marketplace</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
