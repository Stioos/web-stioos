import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  XCircle,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/shared/icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { LucideIcon } from "lucide-react";
import type {
  TalentStripGroup,
  TalentSubPage,
} from "@/data/talent-strip-groups";
import {
  CANDIDATE_AUDIENCES,
  CANDIDATE_COMPARISON,
  CANDIDATE_GUARANTEES,
  CANDIDATE_INDUSTRIES,
  CANDIDATE_TRUST_BADGES,
  type CandidateSubPageContent,
} from "@/data/pages/talent-candidate-sub-pages";
import { TalentCtaGroup } from "@/components/talent/talent-cta-group";

// ============================================================
// CANDIDATE SUB-PAGE — 12-section template rendering for the 9
// candidate-focused Talent Solutions sub-pages at
// /talent-solutions/[group]/[sub].
//
// Server component (no "use client"). Scroll-triggered reveals
// are gated client-side by <Reveal> (IntersectionObserver + CSS
// transition, no motion library shipped). The FAQ section uses
// the shadcn/ui Accordion client component for interactivity.
//
// Sections (matching the design language of the PageBuilder hero):
//    1. Hero        — two-column w/ Live Impact Signal panel
//    2. Overview    — 2-paragraph description (alt bg)
//    3. Capabilities — 6 cards "What you'll learn/get"
//    4. Process     — 4-step timeline Apply → Screen → Engage → Result
//    5. Benefits    — 4 outcome stat cards (alt bg)
//    6. FAQ         — 5 AEO-optimized Q&As
//    7. Trust bar   — 6 platform trust badges (strip)
//    8. Audiences   — For Job Seekers + For Employers (2 cards)
//    9. Comparison  — With STIOOS vs Without (6 rows)
//   10. Industries  — 8 vertical cards w/ icons
//   11. Guarantees  — 4 written commitment cards
//   12. CTA band    — "Ready to get started?" with 2 CTAs (LAST)
// ============================================================

interface CandidateSubPageProps {
  group: TalentStripGroup;
  subPage: TalentSubPage;
  content: CandidateSubPageContent;
  groupIcon: LucideIcon;
  subPageIcon: LucideIcon;
}

const CONTAINER = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

export function CandidateSubPage({
  group,
  subPage,
  content,
  groupIcon: GroupIcon,
  subPageIcon: SubPageIcon,
}: CandidateSubPageProps) {
  const groupHref = `/talent-solutions/${group.slug}`;

  return (
    <main className="min-h-screen bg-brand-ink text-white">
      {/* ============================================================ */}
      {/* 1. HERO — two-column layout matching the PageBuilder hero    */}
      {/* (Live Impact Signal panel on the right + CTAs)               */}
      {/* ============================================================ */}
      <section
        id="hero"
        className="relative scroll-mt-36 overflow-hidden border-b border-white/5 bg-brand-ink"
        aria-label={`${subPage.stripLabel} overview`}
      >
        <div
          className="pointer-events-none absolute inset-0 surface-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 75% at 35% 0%, rgba(245,158,11,0.18), transparent 70%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8">
          {/* Merged hero card — identity + Live Impact Signal panel */}
          <Reveal delay={0.05} className="relative">
            <div
              className="pointer-events-none absolute -inset-5 hidden rounded-3xl opacity-40 blur-2xl sm:block"
              style={{ background: "rgba(245,158,11,0.15)" }}
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
              <div className="grid lg:grid-cols-[1.35fr_1px_1fr]">
                {/* ── Left — breadcrumb pills + identity + stats + description ── */}
                <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                  {/* Breadcrumb pills */}
                  <Reveal delay={0.08}>
                    <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
                      <Link
                        href="/talent-solutions"
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                        Talent Solutions
                      </Link>
                      <Link
                        href={groupHref}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
                      >
                        <GroupIcon className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                        {group.name}
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </Reveal>

                  {/* Identity row — gradient tile + title */}
                  <Reveal delay={0.12}>
                    <div className="flex items-center gap-4 sm:gap-5">
                      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 ring-1 ring-white/20 sm:h-[72px] sm:w-[72px]">
                        <SubPageIcon className="h-8 w-8 text-white sm:h-9 sm:w-9" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h1 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl lg:text-[26px]">
                          {subPage.title}
                        </h1>
                      </div>
                    </div>
                  </Reveal>

                  {/* Subtitle */}
                  <Reveal delay={0.16}>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                      {content.heroSubtitle}
                    </p>
                  </Reveal>

                  {/* Tags — from first 4 capabilities */}
                  {content.capabilities && content.capabilities.length > 0 && (
                    <Reveal delay={0.2}>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {content.capabilities.slice(0, 4).map((cap) => (
                          <span
                            key={cap.title}
                            className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                          >
                            {cap.title}
                          </span>
                        ))}
                      </div>
                    </Reveal>
                  )}

                  {/* Stats row — 4 cells */}
                  <Reveal delay={0.24}>
                    <div className="mt-5 flex items-stretch gap-2">
                      {content.heroStats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center"
                        >
                          <span className="text-base font-bold text-amber-400">
                            {stat.value}
                          </span>
                          <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                            {stat.label}
                          </span>
                        </div>
                      ))}
                      {/* Timeline cell */}
                      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center">
                        <span className="text-xs font-bold text-white">On request</span>
                        <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Timeline</span>
                      </div>
                    </div>
                  </Reveal>

                  {/* Engaging description */}
                  <Reveal delay={0.28}>
                    <div className="mt-auto pt-6">
                      <p className="text-[13px] leading-relaxed text-slate-300">
                        <span className="font-semibold text-white">
                          {subPage.stripLabel} delivers measurable outcomes — not just activity.
                        </span>{" "}
                        Every program is scoped, delivered by senior mentors, and backed by
                        placement SLAs you can hold us to. Apply once, clear the AI screen, and
                        get matched with employers hiring right now.
                      </p>
                      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                        Scoped to your goals after a free application — clear next steps, no surprises.
                      </p>
                    </div>
                  </Reveal>
                </div>

                {/* Divider rail (lg only) */}
                <div className="hidden bg-white/[0.07] lg:block" aria-hidden="true" />

                {/* ── Right — Live Impact Signal panel + CTAs ── */}
                <div className="flex flex-col border-t border-white/[0.07] bg-white/[0.02] p-5 sm:p-7 lg:border-t-0 lg:p-8">
                  <Reveal delay={0.2}>
                    {/* Live Impact Signal panel */}
                    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-card p-4 text-foreground">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                          <span
                            className="h-2 w-2 rounded-full bg-amber-500"
                            aria-hidden="true"
                          />
                          Live Impact Signal
                        </span>
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-semibold text-amber-600">
                          {content.heroStats[0]?.label ?? "Outcomes"}
                        </span>
                      </div>

                      {/* Donut gauge + KPI cards */}
                      <div className="mt-3 flex gap-3">
                        {/* Donut gauge */}
                        <div className="flex shrink-0 flex-col items-center justify-center">
                          <div className="relative h-20 w-20">
                            <svg
                              className="h-full w-full -rotate-90"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="9"
                                className="text-muted/30"
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="url(#candGaugeGrad)"
                                strokeWidth="9"
                                strokeLinecap="round"
                                strokeDasharray={`${85 * 2.51} 251`}
                              />
                              <defs>
                                <linearGradient
                                  id="candGaugeGrad"
                                  x1="0"
                                  y1="0"
                                  x2="1"
                                  y2="1"
                                >
                                  <stop offset="0%" stopColor="#f97316" />
                                  <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xl font-bold text-foreground">85%</span>
                            </div>
                          </div>
                          <span className="mt-0.5 text-center text-[8px] uppercase tracking-wider text-muted-foreground">
                            Success rate
                          </span>
                        </div>

                        {/* KPI cards */}
                        <div className="flex-1 space-y-1.5">
                          {content.heroStats.slice(0, 3).map((stat) => (
                            <div
                              key={stat.label}
                              className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-1.5"
                            >
                              <div className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {stat.label}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-foreground">
                                  {stat.value}
                                </span>
                                <span className="rounded-full bg-emerald-500/15 px-1 py-0.5 text-[8px] font-bold text-emerald-600">
                                  Active
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress bars */}
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-[8px]">
                            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                              Program completion
                            </span>
                            <span className="text-muted-foreground">
                              <span className="font-bold text-foreground">85%</span>
                            </span>
                          </div>
                          <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                              style={{ width: "85%" }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-[8px]">
                            <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                              Placement rate
                            </span>
                            <span className="text-muted-foreground">
                              <span className="font-bold text-foreground">94%</span>
                            </span>
                          </div>
                          <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                              style={{ width: "94%" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Score badge + quote */}
                      <div className="mt-3 flex items-center gap-2 border-t border-border pt-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-xs font-bold text-white">
                          85
                        </div>
                        <p className="text-[10px] italic leading-snug text-amber-600">
                          &ldquo;{subPage.stripLabel} gave me the skills and the job — measurable results, delivered on schedule.&rdquo;
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  {/* CTAs */}
                  <Reveal delay={0.28}>
                    <div className="mt-4">
                      <TalentCtaGroup
                        optionSlug={subPage.slug}
                        groupSlug={group.slug}
                        variant="hero"
                      />
                    </div>
                  </Reveal>

                  {/* Trust reinforcement */}
                  <Reveal delay={0.34}>
                    <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
                      <ShieldCheck
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      Backed by written SLAs, placement guarantees and weekly progress
                      reporting — scoped to your goals on a free discovery call.
                    </p>
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. OVERVIEW                                                   */}
      {/* ============================================================ */}
      <section
        id="overview"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Overview"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">What you get</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                {subPage.stripLabel} — the candidate view
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Built around one outcome: you graduate job-ready, certified, and
                placed in a role where you&apos;ll succeed.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 max-w-3xl space-y-6">
              <p className="text-base leading-relaxed text-slate-300 md:text-lg">
                {content.overview.p1}
              </p>
              <p className="text-base leading-relaxed text-slate-300 md:text-lg">
                {content.overview.p2}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. WHAT YOU&apos;LL LEARN / GET — 6 capability cards          */}
      {/* ============================================================ */}
      <section
        id="capabilities"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="What you'll learn and get"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">
                {group.slug === "get-trained"
                  ? "What you'll learn"
                  : group.slug === "get-placed"
                    ? "What you'll get"
                    : "What you'll earn"}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Capabilities that ship with you
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Six concrete capabilities you walk away with — not vague
                promises, verifiable outcomes.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {content.capabilities.map((cap, idx) => (
                <Reveal
                  key={cap.title}
                  delay={0.05 * (idx % 3)}
                  as="article"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                    <Icon
                      name={cap.icon}
                      className="h-6 w-6 text-amber-400"
                    />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {cap.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PROCESS — 4-step timeline                                  */}
      {/* ============================================================ */}
      <section
        id="process"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="How it works"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Apply → Screen → Engage → Result
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Four steps from application to outcome. Each step has a published
                SLA so you always know where you stand.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {content.process.map((step, idx) => (
                <li key={step.step} className="relative">
                  {idx < content.process.length - 1 && (
                    <span
                      className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-amber-500/40 to-white/10 lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <article className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-brand-ink p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-xs font-bold text-white ring-1 ring-white/20">
                        {step.step}
                      </span>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        {step.duration}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. BENEFITS — 4 outcome stat cards                            */}
      {/* ============================================================ */}
      <section
        id="benefits"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Benefits and outcomes"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Outcomes you can measure</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                What changes for you
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Four measurable outcomes — tracked, verified, and shared with
                employers as part of your placement profile.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {content.benefits.map((benefit) => (
                <article
                  key={benefit.label}
                  className="flex h-full flex-col rounded-2xl border border-white/10 bg-brand-navy p-6"
                >
                  <dd className="text-3xl font-bold tracking-tight text-amber-400 sm:text-4xl">
                    {benefit.value}
                  </dd>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {benefit.label}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FAQ — 5 candidate-focused questions                       */}
      {/* ============================================================ */}
      <section
        id="faq"
        className="scroll-mt-36 border-y border-white/[0.06] bg-brand-navy py-16 text-white md:py-24"
        aria-label="Frequently asked questions"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Answers, fast</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                The five questions candidates ask most about {subPage.stripLabel}.
                Have another? Talk to a talent expert — link below.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 max-w-3xl">
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-3"
              >
                {content.faqs.map((f, i) => (
                  <AccordionItem
                    key={f.q}
                    value={`faq-${i}`}
                    className="rounded-2xl border border-white/10 bg-brand-ink px-5 shadow-lg shadow-black/20"
                  >
                    <AccordionTrigger className="text-left text-sm font-semibold text-slate-100 hover:no-underline hover:text-white">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[13px] leading-relaxed text-slate-400">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. TRUST BAR — 6 platform trust badges (slim strip)          */}
      {/* ============================================================ */}
      <section
        id="trust-bar"
        className="scroll-mt-36 border-y border-white/[0.06] bg-brand-ink py-5 text-white"
        aria-label="Trust signals"
      >
        <div className={CONTAINER}>
          <Reveal className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {CANDIDATE_TRUST_BADGES.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400"
              >
                <Icon
                  name={b.icon}
                  className="h-3.5 w-3.5 text-amber-400"
                />
                {b.label}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. AUDIENCES — For Job Seekers + For Employers (2 cards)     */}
      {/* ============================================================ */}
      <section
        id="audiences"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Who this is for"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Built for both sides</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Who {subPage.stripLabel} is for
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                One program, two winning outcomes — whether you&apos;re chasing
                your next role or your next great hire.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {(CANDIDATE_AUDIENCES[group.slug] ?? []).map((aud, i) => (
              <Reveal key={aud.title} delay={i * 0.08}>
                <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-brand-ink p-6 shadow-xl shadow-black/30 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 md:p-7">
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                      i === 0
                        ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
                        : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    }`}
                  >
                    <Icon
                      name={aud.icon}
                      className="h-3 w-3"
                    />
                    {aud.kicker}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white md:text-2xl">
                    {aud.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {aud.description}
                  </p>
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {aud.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
                      >
                        <span
                          className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                            i === 0
                              ? "border-amber-400/30 bg-amber-400/10 text-amber-400"
                              : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                          }`}
                        >
                          <Check
                            className="h-2.5 w-2.5"
                            aria-hidden="true"
                          />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link
                      href={aud.ctaHref}
                      className="group/cta inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 transition-colors hover:text-amber-300"
                    >
                      {aud.ctaLabel}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. COMPARISON — With STIOOS vs Without (6 rows)              */}
      {/* ============================================================ */}
      <section
        id="comparison"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="STIOOS compared to traditional approaches"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">The honest difference</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                With STIOOS vs without
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Side by side with the old way — the gap is exactly why
                candidates and employers switch and never look back.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-xl shadow-black/30">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_1fr] border-b border-white/[0.07] bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-slate-400 max-sm:text-[10px]">
                <div className="px-4 py-3 md:px-6">Without STIOOS</div>
                <div className="border-l border-white/[0.07] px-4 py-3 text-amber-400 md:px-6">
                  With STIOOS
                </div>
              </div>
              {/* Body rows */}
              {CANDIDATE_COMPARISON.map((row, i) => (
                <div
                  key={row.dimension}
                  className={`grid grid-cols-[1fr_1fr] max-sm:text-[12px] ${
                    i !== CANDIDATE_COMPARISON.length - 1
                      ? "border-b border-white/[0.05]"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-1 px-4 py-3.5 md:px-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {row.dimension}
                    </span>
                    <span className="flex items-start gap-2 text-slate-400">
                      <XCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-slate-600"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{row.traditional}</span>
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 border-l border-white/[0.05] px-4 py-3.5 md:px-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {row.dimension}
                    </span>
                    <span className="flex items-start gap-2 text-slate-200">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{row.withUs}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. INDUSTRIES — 8 vertical cards w/ icons                   */}
      {/* ============================================================ */}
      <section
        id="industries"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Industries we serve"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Cross-industry</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Industries we serve
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Domain-fluent talent and delivery — mapped to the realities of
                your sector. Mentors and placement partners who&apos;ve shipped
                in these verticals, not just read about them.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {CANDIDATE_INDUSTRIES.map((ind, idx) => (
                <Reveal
                  key={ind.name}
                  delay={0.04 * (idx % 4)}
                  as="article"
                  className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-white/10 bg-brand-ink p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                    <Icon
                      name={ind.icon}
                      className="h-5 w-5 text-amber-400"
                    />
                  </span>
                  <h3 className="text-sm font-semibold text-white">
                    {ind.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400">
                    Mentors, playbooks and hiring partners active in this
                    vertical today.
                  </p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. GUARANTEES — 4 written commitment cards                  */}
      {/* ============================================================ */}
      <section
        id="guarantees"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Our guarantees"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Risk-free by contract</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Our guarantees
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                We put skin in the game — written commitments on every
                engagement, not marketing promises. Four guarantees back every
                {subPage.stripLabel.toLowerCase()} engagement.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CANDIDATE_GUARANTEES.map((g, idx) => (
                <Reveal
                  key={g.title}
                  delay={0.06 * idx}
                  as="article"
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                    <Icon
                      name={g.icon}
                      className="h-6 w-6 text-amber-400"
                    />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {g.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. CTA BAND                                                  */}
      {/* ============================================================ */}
      <section
        id="cta-band"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Get in touch"
      >
        <div className={CONTAINER}>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.12] via-brand-navy to-brand-navy px-6 py-14 text-center md:px-12 md:py-16">
              <div
                className="absolute inset-0 surface-grid opacity-40"
                aria-hidden="true"
              />
              <div
                className="absolute left-1/2 top-0 h-56 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl">
                <p className="eyebrow text-amber-400">{content.ctaKicker}</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  {content.ctaTitle}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  Book a 30-minute discovery call with a talent expert. We&apos;ll
                  map your target role to the right track, share a sample
                  curriculum, and answer every question this page didn&apos;t.
                </p>
                <TalentCtaGroup
                  optionSlug={subPage.slug}
                  groupSlug={group.slug}
                  variant="bottom"
                />

                <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <ShieldCheck
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    Pay-after-join model
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    96% trainee-to-hire conversion
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    500+ employers hiring
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
