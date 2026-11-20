import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  MessageSquare,
  ShieldCheck,
  Sparkles,
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
import type { CandidateSubPageContent } from "@/data/pages/talent-candidate-sub-pages";

// ============================================================
// CANDIDATE SUB-PAGE — 7-section lighter template rendering for
// the 9 candidate-focused Talent Solutions sub-pages at
// /talent-solutions/[group]/[sub].
//
// Server component (no "use client"). Scroll-triggered reveals
// are gated client-side by <Reveal> (IntersectionObserver + CSS
// transition, no motion library shipped). The FAQ section uses
// the shadcn/ui Accordion client component for interactivity.
//
// Sections (matching the design language of JoiningTermsPage):
//   1. Hero       — eyebrow + title + subtitle + 2 CTAs + 3 stats
//   2. Overview   — 2-paragraph description (alt bg)
//   3. Capabilities — 6 cards "What you'll learn/get"
//   4. Process    — 4-step timeline Apply → Screen → Engage → Result
//   5. Benefits   — 4 outcome stat cards (alt bg)
//   6. FAQ        — 5 AEO-optimized Q&As
//   7. CTA band   — "Ready to get started?" with 2 CTAs
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
      {/* 1. HERO                                                       */}
      {/* ============================================================ */}
      <section
        id="hero"
        className="relative scroll-mt-36 overflow-hidden bg-brand-ink"
        aria-label={`${subPage.stripLabel} overview`}
      >
        <div
          className="absolute inset-0 surface-grid opacity-50"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 65% at 50% 0%, rgba(245,158,11,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <Reveal>
            <Link
              href={groupHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to {group.name}
            </Link>
          </Reveal>

          <div className="mt-6 max-w-3xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-2 text-amber-400">
                <span
                  className="inline-block h-px w-6 bg-amber-400/60"
                  aria-hidden="true"
                />
                {content.heroEyebrow}
                <span
                  className="inline-block h-px w-6 bg-amber-400/60"
                  aria-hidden="true"
                />
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-5 flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 ring-1 ring-white/20">
                  <SubPageIcon
                    className="h-8 w-8 text-white"
                    aria-hidden="true"
                  />
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04]">
                  <GroupIcon
                    className="h-5 w-5 text-amber-400"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} as="h1">
              <span className="mt-6 block text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
                {subPage.title}
              </span>
            </Reveal>

            <Reveal delay={0.15} as="p">
              <span className="mt-6 block max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                {content.heroSubtitle}
              </span>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 text-sm font-bold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400"
                >
                  Apply Now
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Talk to a Talent Expert
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <dl className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
                {content.heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-brand-navy p-5"
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-3xl font-bold tracking-tight text-amber-400 sm:text-4xl">
                      {stat.value}
                    </dd>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                      {stat.detail}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
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
      {/* 7. CTA BAND                                                   */}
      {/* ============================================================ */}
      <section
        id="cta-band"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
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
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 text-sm font-bold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    Apply Now
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-transparent px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                    Talk to a Talent Expert
                  </Link>
                </div>

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
