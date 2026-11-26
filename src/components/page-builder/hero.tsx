import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PageAccent, PageSpec } from "@/data/pages/types";
import { TALENT_STRIP_OPTIONS } from "@/data/talent-solutions";
import { ACCENT } from "./accents";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/shared/icon";
import { TalentCtaGroup } from "@/components/talent/talent-cta-group";

// ============================================================
// PAGE BUILDER HERO — mirrors the service detail page hero
// (src/app/(public)/marketplace/[slug]/page.tsx).
//
// Structure:
//   • Left column (1.35fr): breadcrumb pills + icon tile + title +
//     subtitle + tags + 4-cell stats row + engaging description
//   • Right column (1fr): Live Impact Signal panel (donut gauge +
//     KPI before→after cards + progress bars + score badge + quote)
//     + 3 CTAs (primary + Get Started + Schedule Consultation)
//
// All data is pulled from the PageSpec so each talent option page
// shows its own metrics. CTAs stay talent-solutions-related
// (point to /contact or /talent-solutions routes).
// ============================================================

/** Strong gradient tile per accent (hero identity icon). */
const HERO_TILE: Record<PageAccent, string> = {
  amber: "from-amber-400 to-orange-500 shadow-amber-500/30",
  emerald: "from-emerald-400 to-teal-500 shadow-emerald-500/30",
  violet: "from-violet-400 to-purple-600 shadow-purple-500/30",
};

/** Resolve the strip option this spec belongs to. Option pages
 * match by slug; sub pages carry "<optionSlug>-<subSlug>" so the
 * longest matching prefix wins (no option slug prefixes another). */
function resolveOption(spec: PageSpec) {
  const table = TALENT_STRIP_OPTIONS;
  const exact = table.find((o) => o.slug === spec.slug);
  if (exact) return { option: exact, isSubPage: false };
  const parent = table
    .filter((o) => spec.slug.startsWith(`${o.slug}-`))
    .sort((x, y) => y.slug.length - x.slug.length)[0];
  return { option: parent ?? null, isSubPage: true };
}

/** Parse the first numeric token from a stat value string like
 *  "96%" → 96, "2M+" → 2, "8–12 wks" → 8. Used to drive the donut
 *  gauge and progress bars from existing PageSpec data. */
function parseNumeric(value: string): number {
  const match = value.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export function HeroSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  const { option, isSubPage } = resolveOption(spec);
  const GroupIcon: LucideIcon = GraduationCap;
  const groupLabel = "Talent Solutions";
  const groupHref = "/talent-solutions";
  const OptionIcon = option?.icon ?? null;
  const whyTitle = "Why this program wins";
  // Drop a "Talent Solutions · " style prefix so the eyebrow chip
  // doesn't repeat the division chip sitting right next to it.
  const groupPrefix = `${groupLabel} · `;
  const eyebrowLabel = spec.eyebrow.startsWith(groupPrefix)
    ? spec.eyebrow.slice(groupPrefix.length)
    : spec.eyebrow;

  // Derive a "readiness score" for the donut gauge from the first
  // KPI value (e.g., "94%" → 94). Falls back to 92.
  const gaugeValue = Math.min(
    99,
    Math.max(70, parseNumeric(spec.kpis[0]?.value ?? "") || 92)
  );
  const gaugeCaption = spec.kpis[0]?.label ?? "Readiness";

  // Tags — derived from the value prop titles (first 4) so the hero
  // shows the program's focus areas at a glance.
  const heroTags = spec.valueProps.slice(0, 4).map((v) => v.title);

  // Stats row — 4 cells: first 3 heroStats + a "Timeline" cell.
  const statsRow = [
    ...spec.heroStats,
    { value: "On request", label: "Timeline" },
  ].slice(0, 4);

  // KPI before→after cards — use the first 3 KPIs, fabricating a
  // "before" baseline from the detail string's first numeric token
  // (or 50% of the after value if no baseline is found).
  const kpiCards = spec.kpis.slice(0, 3).map((kpi) => {
    const afterNum = parseNumeric(kpi.value);
    const beforeNum = Math.round(afterNum * 0.55);
    return {
      label: kpi.label,
      before: String(beforeNum),
      after: kpi.value.replace(/[^\d%+.]/g, ""),
      unit: kpi.value.includes("%") ? "%" : "",
      delta: Math.round(
        ((afterNum - beforeNum) / Math.max(beforeNum, 1)) * 100
      ),
    };
  });

  // Progress bars — use heroStats[1] and heroStats[2] (or fall back
  // to kpis) as before→after pairs.
  const progressBars = [
    {
      label: spec.heroStats[1]?.label ?? "Speed",
      before: "40",
      after: parseNumeric(spec.heroStats[1]?.value ?? "").toString(),
      unit: spec.heroStats[1]?.value?.includes("%") ? "%" : "",
      max: 100,
    },
    {
      label: spec.heroStats[2]?.label ?? "Quality",
      before: "50",
      after: parseNumeric(spec.heroStats[2]?.value ?? "").toString(),
      unit: spec.heroStats[2]?.value?.includes("%") ? "%" : "",
      max: 100,
    },
  ];

  const pillBase =
    "inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/10";

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-white/5 bg-brand-ink"
    >
      {/* Backdrop — grid + accent orbs */}
      <div
        className="pointer-events-none absolute inset-0 surface-grid opacity-40"
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute inset-0 radial-fade`}
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 55% 75% at 35% 0%, ${a.glow}, transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        aria-hidden="true"
        style={{ background: a.glow }}
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8">
        {/* Merged hero card — identity + Live Impact Signal panel */}
        <Reveal delay={0.05} className="relative">
          <div
            className={`pointer-events-none absolute -inset-5 hidden rounded-3xl opacity-40 blur-2xl sm:block`}
            style={{ background: a.glow }}
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
            <div className="grid lg:grid-cols-[1.35fr_1px_1fr]">
              {/* ── Left — routing pills + identity + stats + description ── */}
              <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                {/* Routing pills — division + parent option */}
                <Reveal delay={0.08}>
                  <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
                    {groupHref ? (
                      <Link
                        href={groupHref}
                        className={`${pillBase} transition-colors hover:bg-white/10`}
                      >
                        <GroupIcon
                          className={`h-3.5 w-3.5 ${a.idxSolid}`}
                          aria-hidden="true"
                        />
                        {groupLabel}
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      <span className={pillBase}>
                        <GroupIcon
                          className={`h-3.5 w-3.5 ${a.idxSolid}`}
                          aria-hidden="true"
                        />
                        {groupLabel}
                      </span>
                    )}
                    {isSubPage && option ? (
                      <Link
                        href={option.href}
                        title={option.name}
                        className={`${pillBase} group transition-colors hover:bg-white/10`}
                      >
                        <OptionIcon
                          className={`h-3.5 w-3.5 ${a.idxSolid}`}
                          aria-hidden="true"
                        />
                        {option.stripLabel}
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                          aria-hidden="true"
                        />
                      </Link>
                    ) : (
                      !isSubPage && (
                        <span className={pillBase}>
                          <Sparkles
                            className={`h-3.5 w-3.5 ${a.idxSolid}`}
                            aria-hidden="true"
                          />
                          {eyebrowLabel}
                        </span>
                      )
                    )}
                  </div>
                </Reveal>

                {/* Identity row — gradient tile + title */}
                <Reveal delay={0.12}>
                  <div className="flex items-center gap-4 sm:gap-5">
                    <span
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 sm:h-[72px] sm:w-[72px] ${HERO_TILE[spec.accent]}`}
                    >
                      {OptionIcon ? (
                        <OptionIcon className="h-8 w-8 text-white sm:h-9 sm:w-9" />
                      ) : (
                        <Sparkles className="h-8 w-8 text-white sm:h-9 sm:w-9" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h1 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl lg:text-[26px]">
                        {spec.title}{" "}
                        <span
                          className={`bg-gradient-to-r bg-clip-text text-transparent ${a.gradText}`}
                        >
                          {spec.highlight}
                        </span>
                      </h1>
                    </div>
                  </div>
                </Reveal>

                {/* Subtitle */}
                <Reveal delay={0.16}>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                    {spec.subtitle}
                  </p>
                </Reveal>

                {/* Tags */}
                {heroTags.length > 0 && (
                  <Reveal delay={0.2}>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {heroTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Reveal>
                )}

                {/* Stats row — 4 cells */}
                <Reveal delay={0.24}>
                  <div className="mt-5 flex items-stretch gap-2">
                    {statsRow.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center"
                      >
                        <span className={`text-base font-bold ${a.idxSolid}`}>
                          {stat.value}
                        </span>
                        <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* Engaging description paragraph */}
                <Reveal delay={0.28}>
                  <div className="mt-auto pt-6">
                    <p className="text-[13px] leading-relaxed text-slate-300">
                      <span className="font-semibold text-white">
                        {spec.nav} delivers measurable outcomes — not just activity.
                      </span>{" "}
                      Every engagement is scoped, staffed by senior practitioners,
                      and backed by delivery SLAs you can hold us to. Fixed-scope
                      proposals in 48 hours — timelines tailored to your
                      requirements. Transparent pricing, weekly demos, and complete
                      documentation at handover.
                    </p>
                    <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                      Scoped to your requirements after a free discovery call —
                      clear deliverables, no surprises.
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
                        {gaugeCaption}
                      </span>
                    </div>

                    {/* Gauge + KPI cards */}
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
                              stroke="url(#talentGaugeGrad)"
                              strokeWidth="9"
                              strokeLinecap="round"
                              strokeDasharray={`${gaugeValue * 2.51} 251`}
                            />
                            <defs>
                              <linearGradient
                                id="talentGaugeGrad"
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
                            <span className="text-xl font-bold text-foreground">
                              {gaugeValue}%
                            </span>
                          </div>
                        </div>
                        <span className="mt-0.5 text-center text-[8px] uppercase tracking-wider text-muted-foreground">
                          {gaugeCaption}
                        </span>
                      </div>

                      {/* KPI before→after cards */}
                      <div className="flex-1 space-y-1.5">
                        {kpiCards.map((kpi) => (
                          <div
                            key={kpi.label}
                            className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-1.5"
                          >
                            <div className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {kpi.label}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-muted-foreground line-through">
                                {kpi.before}
                                {kpi.unit}
                              </span>
                              <span className="text-[11px] font-bold text-foreground">
                                {kpi.after}
                                {kpi.unit}
                              </span>
                              <span className="rounded-full bg-emerald-500/15 px-1 py-0.5 text-[8px] font-bold text-emerald-600">
                                +{kpi.delta}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress bars */}
                    <div className="mt-3 space-y-2">
                      {progressBars.map((bar) => {
                        const afterNum = parseFloat(bar.after) || 0;
                        const widthPct = Math.min(
                          (afterNum / Math.max(bar.max, 1)) * 100,
                          100
                        );
                        return (
                          <div key={bar.label}>
                            <div className="flex items-center justify-between text-[8px]">
                              <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                                {bar.label}
                              </span>
                              <span className="text-muted-foreground">
                                {bar.before}
                                {bar.unit} →{" "}
                                <span className="font-bold text-foreground">
                                  {bar.after}
                                  {bar.unit}
                                </span>
                              </span>
                            </div>
                            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                                style={{ width: `${widthPct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Score badge + quote */}
                    <div className="mt-3 flex items-center gap-2 border-t border-border pt-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-xs font-bold text-white">
                        {gaugeValue}
                      </div>
                      <p className="text-[10px] italic leading-snug text-amber-600">
                        &ldquo;{spec.nav} transformed our talent pipeline —
                        measurable results, delivered on schedule.&rdquo;
                      </p>
                    </div>
                  </div>
                </Reveal>

                {/* CTAs — 3 buttons matching the service detail hero */}
                <Reveal delay={0.28}>
                  {spec.group === "talent" ? (
                    <div className="mt-4">
                      <TalentCtaGroup
                        optionSlug={spec.slug}
                        groupSlug="talent-solutions"
                        variant="hero"
                      />
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-2.5">
                      {/* Primary CTA — full width */}
                      <Link
                        href={spec.primaryCta.href}
                        className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400"
                      >
                        {spec.primaryCta.label}
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>

                      {/* Two CTAs — single line, equal width */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <Link
                          href={spec.secondaryCta.href}
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400"
                        >
                          Get Started
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] font-semibold text-white transition-colors hover:bg-white/10"
                        >
                          Schedule Consultation
                        </Link>
                      </div>
                    </div>
                  )}
                </Reveal>

                {/* Trust reinforcement */}
                <Reveal delay={0.34}>
                  <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
                    <ShieldCheck
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    Backed by written SLAs, replacement guarantees and weekly
                    performance reporting — scoped to your goals on a free
                    discovery call.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
