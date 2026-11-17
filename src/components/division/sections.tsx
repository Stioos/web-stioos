import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import type { DivisionAccent } from "@/lib/division-accents";
import type { DivisionSpec, CompareCell } from "@/data/pages/division-types";
import {
  CountUpNumber,
  Sparkline,
  AnimatedBar,
  RadialGauge,
  TechRadarChart,
  ProgressBar,
} from "./infographics";

// ============================================================
// DIVISION SECTIONS — 16 visually-distinct section designs.
// Each section reads a slice of DivisionSpec + the division
// accent. Sections alternate light/dark surfaces and use a
// DIFFERENT layout language so the page reads as a rich,
// varied narrative rather than a repeated card grid.
// ============================================================

export interface SectionProps {
  spec: DivisionSpec;
  accent: DivisionAccent;
  categoryName: string;
  categoryIcon: string;
}

// ------------------------------------------------------------
// 01 — HERO: cinematic full-viewport dark hero with gradient
// mesh, floating stat chips, division identity tile, dual CTAs.
// ------------------------------------------------------------

export function HeroSection({ spec, accent, categoryName, categoryIcon }: SectionProps) {
  const h = spec.hero;
  return (
    <section className="relative overflow-hidden bg-brand-ink">
      {/* gradient mesh background */}
      <div className="absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl"
        style={{ background: accent.glow }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: accent.glow, opacity: 0.6 }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* left: copy */}
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ring-1", accent.chip)}>
                  <Icon name={categoryIcon} className="h-3.5 w-3.5" />
                  {h.eyebrow}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  {categoryName}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {h.title}{" "}
                <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", accent.gradient)}>
                  {h.highlight}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
                {h.subtitle}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={h.primaryCta.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl",
                    accent.gradient
                  )}
                >
                  {h.primaryCta.label}
                  <Icon name="ArrowRight" className="h-4 w-4" />
                </Link>
                <Link
                  href={h.secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.06]"
                >
                  {h.secondaryCta.label}
                </Link>
              </div>
            </Reveal>
            {/* floating stat chips */}
            <Reveal delay={0.2}>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
                {h.stats.map((s) => (
                  <div key={s.label}>
                    <dt className={cn("text-2xl font-bold tabular-nums sm:text-3xl", accent.eyebrow)}>{s.value}</dt>
                    <dd className="mt-1 text-xs text-slate-500">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
          {/* right: identity tile */}
          <Reveal delay={0.15} className="hidden lg:block">
            <div className={cn("relative mx-auto flex aspect-square max-w-sm items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ring-1", accent.gradient, accent.heroRing)}>
              <div className="absolute inset-0 surface-grid opacity-30" aria-hidden="true" />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
              <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-black/20 blur-2xl" aria-hidden="true" />
              <div className="relative flex flex-col items-center gap-4 text-white">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30">
                  <Icon name={categoryIcon} className="h-12 w-12" />
                </div>
                <span className="text-center text-lg font-bold leading-tight">{categoryName}</span>
                <span className="rounded-full bg-black/25 px-3 py-1 text-[11px] font-medium uppercase tracking-widest backdrop-blur">
                  {spec.hero.eyebrow}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 02 — TRUST BAR: scrolling marquee of partner / tech badges.
// ------------------------------------------------------------

export function TrustBarSection({ spec, accent }: SectionProps) {
  const badges = spec.trustBadges;
  return (
    <section className="border-y border-white/[0.06] bg-brand-navy py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Powered by the tools and platforms that run modern business
        </p>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand-navy to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand-navy to-transparent" />
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {badges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-slate-200"
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 03 — KPI BAND: 4 count-up KPI cards with sparklines + trend.
// ------------------------------------------------------------

export function KpiBandSection({ spec, accent }: SectionProps) {
  return (
    <section className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spec.kpis.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.05}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", accent.tile)}>
                    <Icon name={k.icon} className={cn("h-5 w-5", accent.icon)} />
                  </div>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", accent.chip)}>
                    {k.trend}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <span className={cn("text-3xl font-bold tracking-tight text-foreground")}>
                    {k.value}
                  </span>
                  <Sparkline data={k.spark} className={accent.eyebrow} stroke="currentColor" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{k.label}</p>
                <div className={cn("absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 transition group-hover:opacity-100", accent.gradient)} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 04 — PAIN POINTS: dark "cost of inaction" canvas with
// problem cards and red/orange impact metrics.
// ------------------------------------------------------------

export function PainPointsSection({ spec, accent }: SectionProps) {
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="absolute inset-0 surface-grid opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>
            The cost of inaction
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What it costs when {spec.hero.title.toLowerCase()} stays manual
          </h2>
          <p className="mt-4 text-slate-400">
            Every quarter without automation, modern infrastructure, or data-driven
            execution compounds into lost pipeline, lost margin, and lost market share.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {spec.painPoints.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="group relative h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-white/15 hover:bg-white/[0.04]">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </div>
                  <span className="text-right text-lg font-bold text-rose-400">{p.impact}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 05 — SOLUTION OVERVIEW: split narrative + animated dashboard.
// ------------------------------------------------------------

export function SolutionOverviewSection({ spec, accent }: SectionProps) {
  const s = spec.solution;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.strong)}>
              {s.eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {s.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{s.body}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {s.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1", accent.tile)}>
                    <Icon name="Check" className={cn("h-3 w-3", accent.icon)} />
                  </span>
                  <span className="text-sm text-foreground/90">{c}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/marketplace?category=${spec.slug}`}
              className={cn("mt-8 inline-flex items-center gap-2 text-sm font-semibold", accent.strong)}
            >
              Explore the full catalog
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <DivisionDashboardVisual accent={accent} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Inline dashboard visual built from the division accent. */
function DivisionDashboardVisual({ accent }: { accent: DivisionAccent }) {
  const bars = [38, 62, 45, 78, 56, 88, 70, 96, 64, 82, 52, 90];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.03] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-rose-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="ml-2 h-3.5 flex-1 rounded bg-white/[0.06]" />
        <span className={cn("text-[10px] font-semibold uppercase tracking-widest", accent.eyebrow)}>live</span>
      </div>
      <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[72px_1fr]">
        <div className="flex flex-col gap-2 border-r border-white/[0.07] p-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={cn("h-2 rounded-full", i === 1 ? cn("bg-gradient-to-r", accent.gradient) : "bg-white/[0.08]")} />
          ))}
        </div>
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
                <span className="block h-1.5 w-8 rounded-full bg-white/15" />
                <span className={cn("mt-1.5 block h-2.5 w-12 rounded-full bg-gradient-to-r", accent.gradient)} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-28 items-end gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            {bars.map((hgt, i) => (
              <span
                key={i}
                style={{ height: `${hgt}%` }}
                className={cn("flex-1 rounded-t-sm", i % 3 === 1 ? cn("bg-gradient-to-t", accent.gradient) : "bg-white/[0.10]")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 06 — CAPABILITIES BENTO: asymmetric bento grid of 6 modules,
// each linking to its subcategory route.
// ------------------------------------------------------------

const bentoSpanClass: Record<string, string> = {
  sm: "sm:col-span-1 sm:row-span-1",
  md: "sm:col-span-2 sm:row-span-1",
  lg: "sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-3 sm:row-span-1",
  tall: "sm:col-span-1 sm:row-span-2",
};

export function CapabilitiesBentoSection({ spec, accent }: SectionProps) {
  return (
    <section className="bg-brand-ink py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>
            Capability map
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Six capability areas, one accountable partner
          </h2>
          <p className="mt-4 text-slate-400">
            Every capability below is a subcategory with its own service directory,
            specialists, and delivery track. Tap any tile to browse the services.
          </p>
        </Reveal>
        <div className="mt-10 grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {spec.capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05} className={cn("group", bentoSpanClass[c.span] ?? bentoSpanClass.sm)}>
              <Link
                href={`/category/${spec.slug}/${c.subslug}`}
                className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", accent.tile)}>
                    <Icon name={c.icon} className={cn("h-5 w-5", accent.icon)} />
                  </div>
                  <span className={cn("text-xs font-bold tabular-nums", accent.eyebrow)}>{c.metric}</span>
                </div>
                <div className="mt-4">
                  <h3 className="text-base font-semibold text-white">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{c.description}</p>
                  <span className={cn("mt-3 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition group-hover:opacity-100", accent.eyebrow)}>
                    Browse services <Icon name="ArrowRight" className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 07 — PROCESS TIMELINE: horizontal 5-step stepper with
// alternating up/down cards and a connecting progress line.
// ------------------------------------------------------------

export function ProcessTimelineSection({ spec, accent }: SectionProps) {
  const p = spec.process;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.strong)}>
            {p.title}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From discovery to delivery in five phases
          </h2>
          <p className="mt-4 text-muted-foreground">{p.subtitle}</p>
        </Reveal>
        <div className="relative mt-14">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-1/2 hidden h-px bg-border lg:block" />
          <div className={cn("absolute left-0 top-1/2 hidden h-px bg-gradient-to-r lg:block", accent.gradient)} style={{ width: "100%" }} />
          <ol className="grid gap-8 lg:grid-cols-5">
            {p.phases.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 0.08}>
                <li className="relative">
                  {/* node */}
                  <div className="mb-4 flex items-center gap-3 lg:mb-0 lg:flex-col lg:items-start">
                    <span className={cn("relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg", accent.gradient)}>
                      {phase.phase}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground lg:mt-3">
                      {phase.duration}
                    </span>
                  </div>
                  <div className={cn("rounded-2xl border bg-card p-5 shadow-sm lg:mt-6", i % 2 === 1 ? "border-transparent ring-1 ring-border lg:translate-y-4" : "border-border")}>
                    <h3 className="text-base font-semibold text-foreground">{phase.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{phase.description}</p>
                    <ul className="mt-3 space-y-1.5">
                      {phase.deliverables.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-xs text-foreground/80">
                          <Icon name="Check" className={cn("mt-0.5 h-3 w-3 shrink-0", accent.icon)} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 08 — TECH RADAR: concentric ring chart with positioned
// technology nodes (Adopt / Trial / Assess / Hold).
// ------------------------------------------------------------

export function TechRadarSection({ spec, accent }: SectionProps) {
  const r = spec.techRadar;
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>
              Technology radar
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {r.title}
            </h2>
            <p className="mt-4 text-slate-400">{r.subtitle}</p>
            <ul className="mt-8 space-y-3">
              {r.rings.map((ring, i) => (
                <li key={ring.label} className="flex items-center gap-3">
                  <span className={cn("h-3 w-3 rounded-full", i === 0 ? cn("bg-gradient-to-r", accent.gradient) : "bg-white/20")} />
                  <span className="text-sm font-semibold text-slate-200">{ring.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-brand-navy/60 p-6 backdrop-blur">
              <TechRadarChart
                rings={r.rings}
                nodes={r.nodes}
                colorClass={accent.icon}
                accentGlowClass={accent.tile}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 09 — BEFORE / AFTER: animated horizontal bars comparing
// baseline vs post-engagement metrics.
// ------------------------------------------------------------

export function BeforeAfterSection({ spec, accent }: SectionProps) {
  const im = spec.impact;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.strong)}>
            {im.title}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Measurable impact within the first quarter
          </h2>
          <p className="mt-4 text-muted-foreground">{im.subtitle}</p>
        </Reveal>
        <div className="mx-auto mt-12 max-w-4xl space-y-8">
          {im.metrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{m.label}</h3>
                  <span className={cn("text-xs font-bold", accent.strong)}>
                    {m.afterLabel} → {m.beforeLabel}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Before</span>
                      <span className="tabular-nums">{m.beforeLabel}</span>
                    </div>
                    <AnimatedBar pct={m.before} gradient="from-slate-400 to-slate-500" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className={cn("font-semibold", accent.strong)}>After STIOOS</span>
                      <span className={cn("font-bold tabular-nums", accent.strong)}>{m.afterLabel}</span>
                    </div>
                    <AnimatedBar pct={m.after} gradient={accent.gradient} delay={0.15} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 10 — SPOTLIGHT SERVICES: 3 premium featured service cards
// with gradient headers, tags, mini outcome stat, Request CTA.
// ------------------------------------------------------------

export function SpotlightServicesSection({ spec, accent }: SectionProps) {
  return (
    <section className="bg-brand-ink py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>
              Featured engagements
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start with a proven deployment-ready service
            </h2>
          </div>
          <Link
            href={`/marketplace?category=${spec.slug}`}
            className={cn("inline-flex items-center gap-2 text-sm font-semibold", accent.eyebrow)}
          >
            View all services <Icon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {spec.spotlightServices.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] transition hover:border-white/20">
                <div className={cn("relative h-28 bg-gradient-to-br p-5", accent.gradient)}>
                  <div className="absolute inset-0 surface-grid opacity-30" aria-hidden="true" />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                        Featured
                      </span>
                      <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                        {s.metric.value} {s.metric.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight text-white">{s.name}</h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm text-slate-400">{s.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <span key={t} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-400 ring-1 ring-white/[0.06]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={s.href}
                    className={cn("mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]")}
                  >
                    Request this service
                    <Icon name="ArrowRight" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 11 — OUTCOMES GAUGES: central large radial gauge + 4
// surrounding small gauges with progress arcs.
// ------------------------------------------------------------

export function OutcomesGaugeSection({ spec, accent }: SectionProps) {
  const o = spec.outcomes;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.strong)}>
            Outcome scorecard
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The metrics that define a successful engagement
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
            <Reveal className="flex flex-col items-center">
              <RadialGauge
                value={o.central.value}
                label={o.central.label}
                colorClass={accent.icon}
                size={180}
                caption={o.central.caption}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-6">
                {o.gauges.map((g) => (
                  <div key={g.label} className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <RadialGauge value={g.value} label={g.label} colorClass={accent.icon} size={96} />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 12 — CASE STUDY: editorial magazine layout with pull quote
// and 3 count-up result stats.
// ------------------------------------------------------------

export function CaseStudySection({ spec, accent }: SectionProps) {
  const c = spec.caseStudy;
  // Parse numeric targets from result values for count-up.
  const parseNum = (v: string) => {
    const m = v.match(/(\d+(?:\.\d+)?)/);
    return m ? parseFloat(m[1]) : 0;
  };
  const parseSuffix = (v: string) => v.replace(/[\d.]/g, "").trim();
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full blur-3xl"
        style={{ background: accent.glow }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>
              Case study · {c.industry}
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {c.title}
            </h2>
            <div className="mt-6 space-y-4 text-slate-400">
              <p><span className={cn("font-semibold", accent.eyebrow)}>Challenge — </span>{c.challenge}</p>
              <p><span className={cn("font-semibold", accent.eyebrow)}>Solution — </span>{c.solution}</p>
            </div>
            <blockquote className="mt-8 border-l-2 pl-5 text-lg italic text-slate-300" style={{ borderColor: "currentColor" }}>
              <span className={accent.eyebrow}>&ldquo;{c.quote}&rdquo;</span>
              <footer className="mt-3 text-sm not-italic text-slate-500">
                — <span className="font-semibold text-slate-300">{c.author}</span>, {c.role}
              </footer>
            </blockquote>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-4">
              {c.results.map((r, i) => {
                const num = parseNum(r.value);
                const suffix = parseSuffix(r.value);
                const hasDecimal = /\.\d/.test(r.value);
                return (
                  <div key={r.label} className="flex items-center gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                    <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", accent.gradient)}>
                      <Icon name="TrendingUp" className="h-6 w-6" />
                    </div>
                    <div>
                      <div className={cn("text-3xl font-bold tabular-nums text-white")}>
                        {num > 0 ? <CountUpNumber target={num} suffix={suffix} decimals={hasDecimal ? 1 : 0} /> : r.value}
                      </div>
                      <div className="mt-0.5 text-sm text-slate-400">{r.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 13 — COMPARISON TABLE: sticky-header matrix comparing STIOOS
// against alternatives across 6 criteria.
// ------------------------------------------------------------

function CompareIcon({ cell, accent }: { cell: CompareCell; accent: DivisionAccent }) {
  if (cell === "yes")
    return (
      <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full", accent.tile)}>
        <Icon name="Check" className={cn("h-3.5 w-3.5", accent.icon)} />
      </span>
    );
  if (cell === "partial")
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
        <Icon name="Clock" className="h-3.5 w-3.5" />
      </span>
    );
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
      <Icon name="X" className="h-3.5 w-3.5" />
    </span>
  );
}

export function ComparisonTableSection({ spec, accent }: SectionProps) {
  const c = spec.comparison;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.strong)}>
            {c.title}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why teams choose STIOOS over the alternatives
          </h2>
          <p className="mt-4 text-muted-foreground">{c.subtitle}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Criterion</th>
                  {c.columns.map((col, i) => (
                    <th
                      key={col}
                      className={cn(
                        "px-4 py-3 text-center font-semibold",
                        i === c.columns.length - 1
                          ? cn("bg-gradient-to-b text-white", accent.gradient)
                          : "text-muted-foreground"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {c.rows.map((row) => (
                  <tr key={row.criterion} className="bg-card transition hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{row.criterion}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <CompareIcon cell={v} accent={accent} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 14 — PRICING MODELS: 3 engagement tiers with feature lists
// and a "Popular" highlight on the middle tier.
// ------------------------------------------------------------

export function PricingModelsSection({ spec, accent }: SectionProps) {
  const p = spec.pricing;
  return (
    <section className="bg-brand-ink py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>
            {p.title}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Transparent engagement models
          </h2>
          <p className="mt-4 text-slate-400">{p.subtitle}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {p.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-6",
                  tier.popular
                    ? cn("border-transparent bg-gradient-to-b ring-2", accent.gradient, accent.heroRing)
                    : "border-white/[0.08] bg-white/[0.02]"
                )}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-ink shadow-lg">
                    Most popular
                  </span>
                )}
                <h3 className={cn("text-lg font-bold", tier.popular ? "text-white" : "text-white")}>{tier.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{tier.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{tier.price}</span>
                  <span className="text-sm text-slate-500">/{tier.period}</span>
                </div>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Icon name="Check" className={cn("mt-0.5 h-4 w-4 shrink-0", tier.popular ? "text-white" : accent.icon)} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={cn(
                    "mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                    tier.popular
                      ? "bg-white text-brand-ink hover:bg-slate-100"
                      : cn("bg-gradient-to-r text-white", accent.gradient)
                  )}
                >
                  {tier.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 15 — INDUSTRIES CLOUD: pill cloud of industries served with
// service counts and hover reveal.
// ------------------------------------------------------------

export function IndustriesCloudSection({ spec, accent }: SectionProps) {
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.strong)}>
            Industries served
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Specialized delivery across {spec.industries.length} industries
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each industry below has shipped services through STIOOS. The number is the
            live catalog of deployment-ready engagements.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {spec.industries.map((ind, i) => (
              <Link
                key={ind.name}
                href={`/marketplace?category=${spec.slug}&industry=${encodeURIComponent(ind.name)}`}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                  i % 5 === 0 && "hover:border-transparent hover:ring-1",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full transition group-hover:scale-125", accent.dot)} />
                {ind.name}
                <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums", accent.chip)}>
                  {ind.count}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 16 — FINAL CTA: full-bleed gradient band with urgency stat,
// dual CTAs, and trust signals row.
// ------------------------------------------------------------

export function FinalCtaSection({ spec, accent }: SectionProps) {
  const f = spec.finalCta;
  return (
    <section className="relative overflow-hidden">
      <div className={cn("absolute inset-0 bg-gradient-to-br", accent.gradient)} />
      <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-black/15 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            {f.eyebrow}
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {f.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            {f.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={f.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-ink shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              {f.primaryCta.label}
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
            <Link
              href={f.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              {f.secondaryCta.label}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/20 pt-6">
            {f.trustSignals.map((t) => (
              <span key={t} className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
                <Icon name="BadgeCheck" className="h-4 w-4" />
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
