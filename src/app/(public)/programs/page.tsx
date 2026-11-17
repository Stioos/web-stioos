import Link from "next/link";
import type { Metadata } from "next";
import {
  BadgeCheck,
  BookOpen,
  Braces,
  BrainCircuit,
  Clock,
  CloudCog,
  GraduationCap,
  Rocket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// PROGRAMS — Industry-ready training programs
// ============================================================

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Industry-ready training programs from STIOOS — FDE-FWD Forward Deployed Engineer, FDE Fullstack, DSAI, and Multi Cloud DevOps & Gen AI. Real-world skills, production projects, and pay after placement.",
};

type Program = {
  id: string;
  badge: string;
  name: string;
  duration: string;
  tags: string[];
  description: string;
  icon: LucideIcon;
};

const PROGRAMS: Program[] = [
  {
    id: "fde-fwd",
    badge: "FDE-FWD",
    name: "Forward Deployed Engineer",
    duration: "24 Weeks",
    tags: ["Fullstack", "Deployment", "DevOps"],
    description:
      "Master end-to-end development with cloud deployment, CI/CD, and production-ready skills.",
    icon: Rocket,
  },
  {
    id: "fde",
    badge: "FDE",
    name: "Fullstack Development Engineering",
    duration: "24 Weeks",
    tags: ["React", "Node.js", "Databases"],
    description:
      "Comprehensive fullstack web development with modern frameworks and industry projects.",
    icon: Braces,
  },
  {
    id: "dsai",
    badge: "DSAI",
    name: "Digital Sales & AI Marketing / AI Engineering",
    duration: "20 Weeks",
    tags: ["AI/ML", "Data Science", "Deep Learning"],
    description:
      "Dive into AI, machine learning, and data analytics with hands-on real-world projects.",
    icon: BrainCircuit,
  },
  {
    id: "mcdai",
    badge: "MCDAI",
    name: "Multi Cloud DevOps & Gen AI",
    duration: "24 Weeks",
    tags: ["AWS · Azure · GCP", "Kubernetes & Terraform", "Gen AI & LLMs"],
    description:
      "Multi-cloud architecture, DevOps automation, and Generative AI engineering in one hybrid program.",
    icon: CloudCog,
  },
];

const DIFFERENTIATORS = [
  {
    icon: BadgeCheck,
    title: "Pay After Placement",
    description: "Zero financial risk. Pay only after you land your dream job.",
  },
  {
    icon: BookOpen,
    title: "Industry-Ready Curriculum",
    description: "Curriculum designed with top tech companies, updated every quarter.",
  },
];

export default function ProgramsPage() {
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
            Programs
            <span className="inline-block h-px w-6 bg-amber-400/60" />
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            Industry-Ready <span className="text-gradient-brand">Training Programs</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Choose from our flagship programs designed to make you job-ready with real-world skills
            and projects.
          </p>
        </div>
      </section>

      {/* ====================== FLAGSHIP PROGRAMS ====================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-amber-400">Flagship Programs</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Pick the program that matches your career goal
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              Every program is built around production projects, mentor-led sprints, and the tools
              employers actually use.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PROGRAMS.map((program) => (
              <article
                key={program.id}
                id={program.id}
                className="relative flex scroll-mt-36 flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 md:p-7"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20">
                    <program.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {program.duration}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-white xl:text-xl">
                  {program.name}
                </h3>
                <p className="mt-1.5">
                  <span className="inline-flex w-fit rounded border border-white/15 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-slate-300">
                    {program.badge}
                  </span>
                </p>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-400">
                  {program.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${program.name} technologies`}>
                  {program.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= WHY STIOOS ========================= */}
      <section className="border-t border-white/[0.06] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-amber-400">Why STIOOS</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              What makes our programs different
            </h2>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {DIFFERENTIATORS.map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-amber-500/40 md:p-10"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400"
                  aria-hidden="true"
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-500/5 ring-1 ring-amber-500/25">
                  <item.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white md:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400 md:text-base">
                  {item.description}
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
              <GraduationCap className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Ready to become job-ready?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                Talk to an advisor to find the program that fits your goals — or explore scoped,
                ready-to-deploy services on the STIOOS marketplace.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-amber-500 px-8 text-base font-semibold text-brand-ink hover:bg-amber-400"
                >
                  <Link href="/contact">Talk to an Advisor</Link>
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
