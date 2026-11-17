"use client";

import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Eye,
  Landmark,
  Scale,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Icon } from "@/components/shared/icon";
import { ADMINS } from "@/data/people";

// ============================================================
// ABOUT — Intelligence, engineered for outcomes.
// ============================================================

const VALUES = [
  {
    icon: Target,
    title: "Outcomes over activity",
    description:
      "We scope every engagement around a measurable business result. If it does not move a KPI you care about, it does not make the roadmap.",
  },
  {
    icon: ShieldCheck,
    title: "Radical transparency",
    description:
      "Transparent scoping, defined deliverables, and honest status reporting. You always know what is being delivered and where things stand.",
  },
  {
    icon: Landmark,
    title: "Senior craft",
    description:
      "Every service is delivered by vetted senior practitioners. We scale capacity, never dilute quality.",
  },
  {
    icon: Compass,
    title: "Data-driven decisions",
    description:
      "We baseline before we build, instrument while we deliver, and report ROI in the language of your boardroom.",
  },
  {
    icon: Scale,
    title: "Governance by default",
    description:
      "Security reviews, access controls, and audit trails are standard on every engagement — not an upsell.",
  },
  {
    icon: Eye,
    title: "Partnership for the long term",
    description:
      "We design solutions you own, document everything, and stay accountable long after launch with managed support.",
  },
];

const MILESTONES = [
  {
    year: "2019",
    title: "Founded as an AI engineering studio",
    description:
      "STIOOS began as a four-person team building machine-learning systems for logistics and finance operators.",
  },
  {
    year: "2021",
    title: "Expanded into enterprise technology & BI",
    description:
      "Custom software, data platforms, and analytics engagements became a second core practice serving mid-market enterprises.",
  },
  {
    year: "2023",
    title: "Launched the marketplace operating model",
    description:
      "We productized our delivery playbooks into a catalog of scoped, ready-to-deploy services across eleven divisions.",
  },
  {
    year: "2025",
    title: "STIOOS GLOBAL platform",
    description:
      "One intelligent marketplace: 305 expert services, 42 subcategories, and governed AI delivery for organizations worldwide.",
  },
];

const LEADERSHIP = ADMINS.slice(0, 4);

const ABOUT_STATS = [
  { value: "305", label: "Expert services on the marketplace" },
  { value: "7", label: "Specialized solution divisions" },
  { value: "40+", label: "Enterprise technologies mastered" },
  { value: "6+", label: "Years shipping production systems" },
];

export default function AboutPage() {
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
            About STIOOS GLOBAL
            <span className="inline-block h-px w-6 bg-amber-400/60" />
          </p>
          <h1
            className="anim-rise mx-auto mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Intelligence, <span className="text-gradient-brand">engineered for outcomes.</span>
          </h1>
          <p
            style={{ animationDelay: "0.1s" }}
            className="anim-rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
          >
            We are a team of AI engineers, enterprise architects, analysts, and strategists who believe
            organizations should not have to choose between speed and rigor. STIOOS GLOBAL is the
            marketplace where expertise is scoped, delivered, and supported like the product it should be.
          </p>
        </div>
      </section>

      {/* ======================= MISSION / VISION ======================= */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-lg border border-border bg-card p-8 md:p-10">
              <span
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400"
                aria-hidden="true"
              />
              <p className="eyebrow text-brand-blue">Our Mission</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Make world-class capability accessible on demand
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Every organization — from a Series A startup to a global enterprise — deserves access to
                the same caliber of AI, technology, and business expertise. Our mission is to remove the
                friction between the capability that exists and the organization that needs it: scoped
                services, senior delivery teams, and accountability from day one.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-border bg-card p-8 md:p-10">
              <span
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400"
                aria-hidden="true"
              />
              <p className="eyebrow text-amber-600">Our Vision</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                The operating system for enterprise intelligence
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We envision a future where every company operates with governed AI agents, automated
                workflows, and decision-grade data — where intelligence is infrastructure, not
                experimentation. STIOOS GLOBAL is being built to be the trusted marketplace at the
                center of that shift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= STORY ============================= */}
      <section className="border-t border-border bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our Story"
                title="From a four-person AI studio to an intelligent marketplace"
                description="STIOOS GLOBAL grew out of hundreds of enterprise deliveries — and the realization that buying expertise should work like deploying software: scoped, versioned, and reliable."
              />
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                We spent years watching great organizations lose quarters to procurement cycles, opaque
                consulting rates, and pilot projects that never reached production. So we rebuilt the
                model: a curated catalog of delivery-ready services, each with defined capabilities,
                deliverables, and engagement models; governed by the same engineering discipline we bring to client
                systems.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Today the marketplace serves ten core industries across seven solution divisions — with the
                same promise we started with in 2019: senior people, measurable outcomes, and no black
                boxes.
              </p>
            </div>
            <ol className="relative space-y-8 border-l border-border pl-8">
              {MILESTONES.map((m) => (
                <li key={m.year} className="relative">
                  <span
                    className="absolute -left-[38px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue-600/40 bg-background"
                    aria-hidden="true"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">{m.year}</p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">{m.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================= VALUES ============================= */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Values"
            title="The principles behind every engagement"
            description="Six commitments that shape how we scope, deliver, and support everything on the marketplace."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-lg border border-border bg-card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20">
                  <v.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== LEADERSHIP =========================== */}
      <section className="border-t border-border bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Leadership"
            title="Operators who have built, scaled, and shipped"
            description="The leadership team accountable for every service delivered through the marketplace."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((person) => {
              const initials = person.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .toUpperCase();
              return (
                <div
                  key={person.id}
                  className="rounded-lg border border-border bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-xl font-bold text-white shadow-lg shadow-blue-600/20 ring-4 ring-background">
                    {initials}
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-foreground">{person.name}</h3>
                  <p className="mt-1 text-sm font-medium text-blue-700">{person.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{person.email}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================== STATS BAND =========================== */}
      <section className="relative overflow-hidden bg-brand-ink py-16 text-white md:py-20">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-1/2 h-64 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {ABOUT_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <dd className="text-4xl font-bold tracking-tight text-white md:text-5xl">{s.value}</dd>
                <dt className="mt-2 text-sm font-medium text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 rounded-xl border border-border bg-card p-8 text-center md:flex-row md:p-10 md:text-left">
            <div className="flex items-start gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20 sm:flex">
                <Icon name="Handshake" className="h-6 w-6 text-blue-600" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  Want to build with a team that treats your outcomes as its own?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  Tell us what you are trying to achieve. Our experts respond within one business day with
                  a scoped proposal — no obligation, no jargon.
                </p>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="h-12 shrink-0 bg-amber-500 px-7 text-base font-semibold text-brand-ink hover:bg-amber-400"
            >
              <Link href="/contact">
                Talk to an Expert
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
