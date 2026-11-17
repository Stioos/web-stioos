"use client";

// ============================================================
// SERVICE OUTCOMES — data-driven infographic band for the
// service detail page (Task 66-c). Renders, for ANY service:
//   • 3 animated count-up KPI counters (before → after chips)
//   • a before/after horizontal bar chart (pure CSS bars)
//   • a radial gauge (SVG stroke-dashoffset animation)
// All values come from buildServiceInsights() — deterministic
// per service. Theme-aware: tokens only (works light + dark);
// the only "hard" colors sit on the accent-gradient gauge disc.
// ============================================================

import { Gauge, Target, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type { Service } from "@/types";
import type { DivisionAccent } from "@/lib/division-accents";
import type { InsightBar, InsightGauge, InsightKpi, ServiceInsights } from "@/lib/service-insights";
import { formatInsightValue } from "@/lib/service-insights";
import { Reveal, useCountUp, useInViewOnce } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const KPI_ICONS = [Target, Gauge, Zap] as const;

// ---------- KPI counter card ----------

function CounterCard({
  kpi,
  accent,
  index,
}: {
  kpi: InsightKpi;
  accent: DivisionAccent;
  index: number;
}) {
  // One IntersectionObserver drives both the reveal transition and the
  // count-up (was framer-motion useInView + animate).
  const [ref, inView] = useInViewOnce<HTMLDivElement>("-40px");
  const value = useCountUp(kpi.after, inView, 1.4 + index * 0.15);
  const decimals = Number.isInteger(kpi.after) ? 0 : 1;
  const Icon = KPI_ICONS[index % KPI_ICONS.length];
  const Trend = kpi.direction === "down" ? TrendingDown : TrendingUp;

  return (
    <div
      ref={ref}
      style={index > 0 ? { transitionDelay: `${Math.min(index * 0.06, 0.3)}s` } : undefined}
      className={cn(
        "reveal",
        inView && "reveal-in",
        "rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg ring-1", accent.tile)}>
          <Icon className={cn("h-[17px] w-[17px]", accent.icon)} aria-hidden="true" />
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
          <Trend className="h-3 w-3" aria-hidden="true" />
          was {formatInsightValue(kpi.before)}
          {kpi.unit}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-foreground tabular-nums md:text-4xl">
        {value.toFixed(decimals)}
        <span className={cn("ml-1 text-base font-bold md:text-lg", accent.strong)}>{kpi.unit}</span>
      </p>
      <p className="mt-1 text-sm font-medium text-foreground/90">{kpi.label}</p>
      {kpi.suffix && (
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{kpi.suffix}</p>
      )}
    </div>
  );
}

// ---------- before / after bar group ----------

function BarGroup({ bar, accent, index }: { bar: InsightBar; accent: DivisionAccent; index: number }) {
  const beforePct = Math.max((bar.before / bar.max) * 100, 2);
  const afterPct = Math.max((bar.after / bar.max) * 100, 2);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <p className="text-[13px] font-semibold text-foreground">{bar.label}</p>
        <p className="text-xs text-muted-foreground">
          <span className={cn("font-bold", accent.strong)}>
            {formatInsightValue(bar.after)}
            {bar.unit}
          </span>
          <span className="mx-1.5 text-border" aria-hidden="true">
            |
          </span>
          was {formatInsightValue(bar.before)}
          {bar.unit}
        </p>
      </div>
      <div className="mt-1.5 space-y-1">
        {/* Before — muted token bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
          <div
            className="anim-bar h-full rounded-full bg-foreground/25"
            style={{ width: `${beforePct}%`, animationDelay: `${index * 0.12}s` }}
          />
        </div>
        {/* After — division gradient bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
          <div
            className={cn("anim-bar h-full rounded-full bg-gradient-to-r", accent.gradient)}
            style={{ width: `${afterPct}%`, animationDelay: `${0.1 + index * 0.12}s` }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------- radial gauge ----------

const GAUGE_R = 52;
const GAUGE_CIRC = 2 * Math.PI * GAUGE_R;

function RadialGaugeCard({ gauge, accent }: { gauge: InsightGauge; accent: DivisionAccent }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>("-60px");
  const count = useCountUp(gauge.value, inView, 1.7);
  const targetOffset = GAUGE_CIRC * (1 - gauge.value / 100);

  return (
    <div
      ref={ref}
      className={cn("reveal", inView && "reveal-in", "flex flex-col rounded-xl border border-border bg-card p-5 md:p-6")}
    >
      <h3 className="text-sm font-bold text-foreground">{gauge.label}</h3>
      <div className="relative mx-auto mt-5 h-44 w-44 shrink-0">
        {/* Gradient disc — theme-independent surface (mirrors hero/process tiles) */}
        <div
          className={cn("absolute inset-0 rounded-full bg-gradient-to-br opacity-90", accent.gradient)}
          aria-hidden="true"
        />
        <svg
          viewBox="0 0 128 128"
          className="absolute inset-0 h-full w-full -rotate-90"
          role="img"
          aria-label={`${gauge.label}: ${gauge.value} out of 100`}
        >
          <circle cx="64" cy="64" r={GAUGE_R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="9" />
          <circle
            cx="64"
            cy="64"
            r={GAUGE_R}
            fill="none"
            stroke="#ffffff"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={GAUGE_CIRC}
            className={cn("gauge-arc", inView && "gauge-arc-go")}
            style={{ "--gauge-circ": GAUGE_CIRC, "--gauge-target": targetOffset } as React.CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-3xl font-bold tabular-nums text-white">
            {Math.round(count)}
            <span className="ml-0.5 text-base font-semibold text-white/80">%</span>
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{gauge.caption}</p>
    </div>
  );
}

// ---------- section ----------

export interface ServiceOutcomesProps {
  service: Service;
  insights: ServiceInsights;
  accent: DivisionAccent;
}

export function ServiceOutcomes({ service, insights, accent }: ServiceOutcomesProps) {
  return (
    <section
      id="outcomes"
      aria-label={`Outcomes and ROI for ${service.name}`}
      className="scroll-mt-36 border-t border-border/60 bg-muted/30 py-12 md:py-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal className="max-w-2xl">
          <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
            Outcomes &amp; ROI
          </p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {insights.sectionCopy.outcomesTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            {insights.sectionCopy.outcomesSub}
          </p>
        </Reveal>

        {/* KPI counters */}
        <div className="mt-7 grid gap-3.5 sm:grid-cols-3">
          {insights.kpis.map((kpi, index) => (
            <CounterCard key={kpi.label} kpi={kpi} accent={accent} index={index} />
          ))}
        </div>

        {/* Bars + gauge */}
        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.55fr_1fr]">
          <Reveal className="rounded-xl border border-border bg-card p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">Before vs. after</h3>
              <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-foreground/25" aria-hidden="true" />
                  Before
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={cn("h-2 w-2 rounded-full bg-gradient-to-r", accent.gradient)}
                    aria-hidden="true"
                  />
                  After
                </span>
              </div>
            </div>
            <div className="mt-5 space-y-5">
              {insights.benefitBars.map((bar, index) => (
                <BarGroup key={bar.label} bar={bar} accent={accent} index={index} />
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
              Indicative before/after ranges for comparable engagements — your own baseline is
              measured in week one, and progress is reported against it.
            </p>
          </Reveal>

          <RadialGaugeCard gauge={insights.gauge} accent={accent} />
        </div>
      </div>
    </section>
  );
}
