import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Check,
  ChevronDown,
  Quote,
  ShieldCheck,
  Sparkles,
  Clock,
  RefreshCw,
  XCircle,
  HelpCircle,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/shared/icon";
import { TalentCtaGroup } from "@/components/talent/talent-cta-group";
import type { GroupPageContent } from "@/data/pages/talent-group-page-content";

// ============================================================
// TALENT GROUP PAGE — 12-section landing for each of the 6
// talent-solutions group options:
//   • get-trained, get-placed, get-certified (candidate side)
//   • build-talent, hire-talent, scale-workforce (employer side)
//
// Server component (no "use client"). Scroll-triggered reveals
// are gated by the <Reveal> client component (IntersectionObserver
// + CSS transition). The hero is a two-column merged card with
// a Live Impact Signal panel — matching the design of the main
// /talent-solutions page.
// ============================================================

// ─────────────────────────────────────────────────────────────
// Static helpers shared by every group page
// ─────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "ISO 27001 certified" },
  { icon: CheckCircle2, label: "96% placement rate" },
  { icon: Clock, label: "48-hour shortlists" },
  { icon: RefreshCw, label: "90-day replacement" },
  { icon: BadgeCheck, label: "500+ employers" },
  { icon: Sparkles, label: "2M+ vetted pool" },
];

const PROCESS_STEP_ICONS = ["Sparkles", "Target", "Users", "Rocket"];

const INDUSTRY_TILE_GRADIENTS = [
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
];

// Inline styles — kept small and prefixed so they never leak.
const PAGE_STYLES = `
.tgp-faq details > summary { list-style: none; }
.tgp-faq details > summary::-webkit-details-marker { display: none; }
.tgp-faq details[open] > summary .tgp-faq-chevron { transform: rotate(180deg); }
`;

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function TalentGroupPage({ content }: { content: GroupPageContent }) {
  const gaugeRadius = 52;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = (content.heroGaugeValue / 100) * gaugeCircumference;

  return (
    <main className="bg-brand-ink text-white">
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

      {/* ============================================================
          1. HERO — Two-column merged card + Live Impact Signal
          ============================================================ */}
      <section
        id="hero"
        className="relative scroll-mt-36 overflow-hidden border-b border-white/5 bg-brand-ink"
        aria-label={`${content.name} overview`}
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
              "radial-gradient(ellipse 55% 75% at 30% 0%, rgba(245,158,11,0.22), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full opacity-25 blur-3xl"
          aria-hidden="true"
          style={{ background: "rgba(245,158,11,0.4)" }}
        />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 lg:px-8">
          {/* Back link */}
          <Link
            href="/talent-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Talent Solutions
          </Link>

          <Reveal delay={0.05} className="mt-5">
            <div
              className="pointer-events-none absolute -inset-4 hidden rounded-3xl opacity-40 blur-2xl sm:block"
              style={{ background: "rgba(245,158,11,0.18)" }}
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
              <div className="grid lg:grid-cols-[1.3fr_1fr]">
                {/* ── LEFT — identity + stats + description ── */}
                <div className="flex flex-col gap-5 border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-8">
                  {/* Breadcrumb pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href="/talent-solutions"
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Sparkles className="h-3 w-3 text-amber-400" aria-hidden="true" />
                      Talent Solutions
                    </Link>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-400 ring-1 ring-amber-400/25">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      {content.name}
                    </span>
                  </div>

                  {/* Gradient icon tile + headline */}
                  <div className="flex items-start gap-4">
                    <div
                      className="grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40"
                      aria-hidden="true"
                    >
                      <Sparkles className="h-7 w-7 text-brand-ink" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">
                        {content.heroEyebrow}
                      </p>
                      <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
                        {content.heroTitle}{" "}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                          {content.heroHighlight}
                        </span>
                      </h1>
                      <p className="mt-2 text-sm text-slate-300 sm:text-base">
                        {content.heroSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Feature pills (heroTags) */}
                  <div className="flex flex-wrap gap-2">
                    {content.heroTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 ring-1 ring-white/10"
                      >
                        <Check className="h-3 w-3 text-amber-400" aria-hidden="true" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 4 mini stat cards */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {content.heroStats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="bg-gradient-to-br from-amber-300 to-orange-400 bg-clip-text text-xl font-bold text-transparent">
                          {s.value}
                        </div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-400">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description paragraph */}
                  <p className="text-sm leading-relaxed text-slate-400">
                    {content.overview[0]}
                  </p>
                </div>

                {/* ── RIGHT — Live Impact Signal panel ── */}
                <div className="relative flex flex-col gap-5 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.02] p-5 sm:p-7 lg:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex size-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Live Impact Signal
                      </span>
                    </div>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400 ring-1 ring-white/10">
                      last 90 days
                    </span>
                  </div>

                  {/* Donut gauge */}
                  <div className="flex items-center gap-5">
                    <div className="relative size-28 shrink-0">
                      <svg viewBox="0 0 120 120" className="size-28 -rotate-90" aria-hidden="true">
                        <circle
                          cx="60"
                          cy="60"
                          r={gaugeRadius}
                          fill="none"
                          stroke="rgba(255,255,255,0.10)"
                          strokeWidth="10"
                        />
                        <defs>
                          <linearGradient id="tgp-gauge" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="60"
                          cy="60"
                          r={gaugeRadius}
                          fill="none"
                          stroke="url(#tgp-gauge)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${gaugeOffset} ${gaugeCircumference}`}
                        />
                      </svg>
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-amber-300 to-orange-400 bg-clip-text text-2xl font-bold text-transparent">
                            {content.heroGaugeValue}%
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-400">
                            {content.heroGaugeLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">
                        {content.heroGaugeLabel} signal
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        Measured across the last 90 days of placements, ramp check-ins
                        and cohort graduations — benchmarked against your role scorecard.
                      </p>
                    </div>
                  </div>

                  {/* 3 KPI before → after cards */}
                  <div className="grid gap-2.5">
                    {content.heroKpis.map((k) => (
                      <div
                        key={k.label}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                      >
                        <span className="text-xs font-medium text-slate-300">{k.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 line-through">{k.before}</span>
                          <ArrowRight className="h-3 w-3 text-slate-500" aria-hidden="true" />
                          <span className="text-sm font-semibold text-white">{k.after}</span>
                          <span className="rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                            {k.after}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2 progress bars (before → after) */}
                  <div className="grid gap-3">
                    {content.heroBars.map((b) => {
                      const afterNum = parseFloat(b.after);
                      const afterPct = Math.min(100, Math.max(0, (afterNum / b.max) * 100));
                      return (
                        <div key={b.label}>
                          <div className="mb-1 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{b.label}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 line-through">{b.before}{b.unit}</span>
                              <span className="font-semibold text-white">{b.after}{b.unit}</span>
                            </div>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                              style={{ width: `${afterPct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Score badge + quote */}
                  <div className="flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] p-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-amber-400 to-orange-500">
                      <Quote className="h-4 w-4 text-brand-ink" aria-hidden="true" />
                    </div>
                    <p className="text-xs italic leading-relaxed text-slate-300">
                      “{content.heroQuote}”
                      <span className="mt-1 block text-[10px] not-italic text-slate-500">
                        {content.heroQuoteAttribution}
                      </span>
                    </p>
                  </div>

                  {/* 3 CTAs */}
                  <div className="mt-4">
                    <TalentCtaGroup
                      optionSlug={content.slug}
                      groupSlug="talent-solutions"
                      variant="hero"
                    />
                  </div>

                  {/* Trust footnote */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    ISO 27001 certified · Mutual NDA on every engagement
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          2. TRUST BAR — 6 trust badges in a slim strip
          ============================================================ */}
      <section
        id="trust"
        className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-8"
        aria-label="Trust signals"
      >
        <div className="mx-auto mb-5 w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Trusted by 500+ hiring teams worldwide
          </p>
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {TRUST_BADGES.map((b) => (
                <div
                  key={b.label}
                  className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/30"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-amber-400/20 to-orange-500/10 ring-1 ring-amber-400/25">
                    <b.icon className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium text-slate-300 transition-colors group-hover:text-white">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          3. OVERVIEW — 2-paragraph description
          ============================================================ */}
      <section
        id="overview"
        className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20"
        aria-label="Overview"
      >
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              What this is
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {content.name} — what you get
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="grid gap-6 md:grid-cols-2">
              {content.overview.map((para, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                    <span className="grid size-6 place-items-center rounded-md bg-amber-400/15 ring-1 ring-amber-400/25">
                      {i + 1}
                    </span>
                    {i === 0 ? "The model" : "The promise"}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300">{para}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          4. CAPABILITIES — 6 cards with gradient icon tiles
          ============================================================ */}
      <section
        id="capabilities"
        className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20"
        aria-label="Capabilities"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              What you get
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Six capabilities shipped with every engagement
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
              Each capability is wrapped in a published SLA and tracked weekly in a shared
              dashboard — no surprises, no add-on invoices, no carve-outs.
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30">
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-amber-500/10 opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span
                        className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
                        aria-hidden="true"
                      >
                        <Icon name={c.icon} className="h-6 w-6 text-brand-ink" />
                      </span>
                      <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-400/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {c.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. PROCESS — 4-step vertical zigzag timeline
          ============================================================ */}
      <section
        id="process"
        className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20"
        aria-label="Process timeline"
      >
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              From kickoff to ramp
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A 4-step path to {content.heroHighlight}
            </h2>
          </Reveal>

          <div className="relative">
            {/* central dashed line */}
            <div
              className="absolute left-4 top-4 h-[calc(100%-2rem)] w-px border-l border-dashed border-white/15 sm:left-1/2 sm:-translate-x-px"
              aria-hidden="true"
            />
            <ol className="space-y-8">
              {content.process.map((step, i) => {
                const left = i % 2 === 0;
                const iconName = PROCESS_STEP_ICONS[i % PROCESS_STEP_ICONS.length];
                return (
                  <Reveal as="li" key={step.title} delay={i * 0.06}>
                    <div
                      className={`relative flex items-start gap-5 sm:gap-0 ${
                        left ? "sm:flex-row" : "sm:flex-row-reverse"
                      }`}
                    >
                      {/* numbered circle node */}
                      <div className="relative z-10 -ml-0 shrink-0 sm:ml-0">
                        <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-brand-ink shadow-lg shadow-amber-500/40 ring-4 ring-brand-ink">
                          {i + 1}
                        </div>
                      </div>

                      {/* card */}
                      <div className={`flex-1 ${left ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                        <div className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 sm:p-5">
                          <div
                            className={`flex items-center gap-3 ${
                              left ? "sm:flex-row-reverse" : ""
                            }`}
                          >
                            <span className="grid size-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                              <Icon name={iconName} className="h-4 w-4 text-amber-400" />
                            </span>
                            <h3 className="text-base font-semibold text-white">{step.title}</h3>
                            <span className="ml-auto rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 ring-1 ring-amber-400/25 sm:ml-0">
                              {step.duration}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* empty spacer on the other side (lg) */}
                      <div className="hidden flex-1 sm:block" aria-hidden="true" />
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. BENEFITS — 4 outcome stat cards with metrics
          ============================================================ */}
      <section
        id="benefits"
        className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20"
        aria-label="Benefits"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              By the numbers
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Outcomes that move your metrics
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
              Every metric below is measured across the last 90 days of engagements and
              benchmarked against the relevant industry average.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.benefits.map((b, i) => (
              <Reveal key={b.label} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/[0.14] via-orange-500/[0.06] to-transparent opacity-80"
                    aria-hidden="true"
                  />
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-amber-500/25 blur-2xl"
                    aria-hidden="true"
                  />
                  <div className="relative flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-amber-300 to-orange-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
                      {b.metric}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{b.label}</div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {b.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          7. AUDIENCES — 2 cards (who this is for)
          ============================================================ */}
      <section
        id="audiences"
        className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20"
        aria-label="Who this is for"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Two audiences, one platform
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Who {content.name} is built for
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {content.audiences.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.08}>
                <div className="relative h-full overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.10] to-orange-500/[0.02] p-6 sm:p-8">
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-amber-500/20 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-amber-400/25">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      {a.kicker}
                    </div>
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">{a.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">{a.description}</p>
                    <ul className="mt-5 grid gap-3">
                      {a.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-slate-200">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                            <Check className="h-3 w-3 text-brand-ink" aria-hidden="true" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Button asChild className="bg-amber-500 text-brand-ink hover:bg-amber-400">
                        <Link href="/contact">
                          {a.cta} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          8. COMPARISON — With STIOOS vs Without STIOOS (5 rows)
          ============================================================ */}
      <section
        id="comparison"
        className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20"
        aria-label="Comparison"
      >
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Side by side
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              With STIOOS vs without
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
              Five rows that show what changes when {content.name} runs your engagement
              instead of the traditional path.
            </p>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-white/10">
              {/* header row */}
              <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-white/10 bg-white/[0.05]">
                <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-6">
                  Feature
                </div>
                <div className="border-l border-white/10 px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-amber-400 to-orange-500">
                      <Sparkles className="h-4 w-4 text-brand-ink" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-bold text-white">With STIOOS</span>
                  </div>
                </div>
                <div className="border-l border-white/10 px-4 py-4 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="grid size-7 place-items-center rounded-md bg-white/5 ring-1 ring-white/10">
                      <XCircle className="h-4 w-4 text-rose-400/70" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-slate-300">Without STIOOS</span>
                  </div>
                </div>
              </div>

              {/* rows */}
              <div className="divide-y divide-white/5">
                {content.comparison.map((row) => (
                  <div
                    key={row.feature}
                    className="grid grid-cols-[1fr_1fr_1fr] bg-white/[0.02] transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="px-4 py-4 text-xs font-medium uppercase tracking-wider text-slate-400 sm:px-6 sm:text-sm sm:normal-case sm:tracking-normal sm:text-slate-300">
                      {row.feature}
                    </div>
                    <div className="border-l border-white/10 px-4 py-4 sm:px-6">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                        <span className="text-xs font-medium text-white sm:text-sm">
                          {row.withStioos}
                        </span>
                      </div>
                    </div>
                    <div className="border-l border-white/10 px-4 py-4 sm:px-6">
                      <div className="flex items-start gap-2">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/70" aria-hidden="true" />
                        <span className="text-xs text-slate-400 sm:text-sm">
                          {row.without}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          9. INDUSTRIES — 6 industry cards
          ============================================================ */}
      <section
        id="industries"
        className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20"
        aria-label="Industries served"
      >
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Where we hire
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Six industries, 2,000+ placements shipped
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
              Each industry has a dedicated delivery manager and a published role-scorecard
              library aligned to the roles hiring teams in that sector actually post.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {content.industries.map((ind, i) => {
                const tile = INDUSTRY_TILE_GRADIENTS[i % INDUSTRY_TILE_GRADIENTS.length];
                return (
                  <div
                    key={ind.name}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30"
                  >
                    <div className="relative">
                      <div
                        className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br ${tile} opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-70`}
                        aria-hidden="true"
                      />
                      <div
                        className={`relative grid size-16 place-items-center rounded-full bg-gradient-to-br ${tile} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <BuildingIcon />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{ind.name}</div>
                      <div className="mt-0.5 text-[11px] text-amber-400">{ind.hires}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          10. GUARANTEES — 4 guarantee cards with icons
          ============================================================ */}
      <section
        id="guarantees"
        className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20"
        aria-label="Guarantees"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Backed in writing
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Four guarantees on every engagement
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
              Every guarantee below is published in the engagement plan, measured weekly,
              and missed-SLA credits are applied automatically to your next billing cycle.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {content.guarantees.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.08}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30">
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full bg-amber-500/10 opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <span
                      className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
                      aria-hidden="true"
                    >
                      <Icon name={g.icon} className="h-6 w-6 text-brand-ink" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold text-white">{g.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {g.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          11. FAQ — 5 questions with expandable answers
          ============================================================ */}
      <section
        id="faq"
        className="tgp-faq scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20"
        aria-label="Frequently asked questions"
      >
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            {/* LEFT — sticky intro panel */}
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/[0.08] to-orange-500/[0.02] p-6 sm:p-8">
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-amber-500/15 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-amber-400/25">
                      <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      FAQ
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Questions?</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      Everything you need to evaluate {content.name} as part of your
                      talent strategy — from timing and pricing to data security. Can&apos;t
                      find your answer? Our talent experts respond within one business day.
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {[
                        { icon: Clock, label: "48h" },
                        { icon: ShieldCheck, label: "NDA" },
                        { icon: RefreshCw, label: "90-day" },
                      ].map((x) => (
                        <div
                          key={x.label}
                          className="flex flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-3"
                        >
                          <x.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                          <span className="text-[10px] text-slate-400">{x.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <Button asChild className="bg-amber-500 text-brand-ink hover:bg-amber-400">
                        <Link href="/contact">Talk to an expert</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                      >
                        <Link href="#cta">Schedule consultation</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* RIGHT — 5 expandable cards */}
            <Reveal delay={0.08}>
              <div className="grid gap-3">
                {content.faqs.map((f, i) => (
                  <details
                    key={f.q}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors hover:border-amber-400/30 open:border-amber-400/30 open:bg-gradient-to-br open:from-amber-500/[0.07] open:to-orange-500/[0.02]"
                  >
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-gradient-to-b from-amber-400 to-orange-500 transition-transform duration-300 group-hover:scale-y-100 group-open:scale-y-100"
                      aria-hidden="true"
                    />
                    <summary className="flex cursor-pointer items-center gap-4 p-4 sm:p-5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-brand-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm font-semibold text-white sm:text-base">
                        {f.q}
                      </span>
                      <ChevronDown
                        className="tgp-faq-chevron h-5 w-5 shrink-0 text-amber-400 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-4 pb-5 pl-16 pr-5 sm:px-5 sm:pl-[4.5rem]">
                      <p className="text-sm leading-relaxed text-slate-400">{f.a}</p>
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <BadgeCheck className="h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
                <p className="text-xs text-slate-400">
                  Still have questions? Every engagement starts with a free 30-minute
                  discovery call — no NDA required to explore fit.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          12. CTA BAND — Final conversion
          ============================================================ */}
      <section
        id="cta"
        className="relative scroll-mt-36 overflow-hidden bg-brand-ink py-20"
        aria-label="Get started"
      >
        {/* amber→orange mesh */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(245,158,11,0.28), transparent 70%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(249,115,22,0.22), transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(245,158,11,0.18), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 surface-grid opacity-20"
          aria-hidden="true"
        />

        {/* floating 48h response badge — top right */}
        <div className="absolute right-4 top-6 z-10 sm:right-8 sm:top-10">
          <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
            </span>
            <span className="text-xs font-semibold text-amber-300">48h response</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[900px] px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                Start {content.ctaHighlight.replace("this ", "this ") || "this quarter"}
              </span>
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {content.ctaTitle}{" "}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                {content.ctaHighlight}
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
              {content.ctaSubtitle}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-amber-500 text-brand-ink hover:bg-amber-400">
                <Link href="/contact">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
              >
                <Link href="/talent-solutions">
                  Explore Talent Solutions <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="h-4 w-4 text-amber-400" aria-hidden="true" />
                48-hour response
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 text-amber-400" aria-hidden="true" />
                ISO 27001 secure
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <BadgeCheck className="h-4 w-4 text-amber-400" aria-hidden="true" />
                No-obligation consult
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

// Tiny helper — a building icon for the industries grid (no extra
// import churn from the data file's string-only icon set).
function BuildingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 text-brand-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="1.5" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}
