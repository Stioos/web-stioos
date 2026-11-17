"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import type { SolutionSpec, SolutionAccent } from "@/data/pages/solution-types";
import {
  CountUpNumber,
  AnimatedBar,
  Sparkline,
  useInViewOnce,
  useCountUp,
} from "@/components/division/infographics";

// ============================================================
// SOLUTION SECTIONS — 16 visually-distinct section designs
// for the outcome-based solution pages at /solutions/[slug].
//
// Every design here is INTENTIONALLY different from the
// division page sections (/category/[slug]) so the two page
// families don't look alike:
//   01 centered hero + architecture diagram
//   02 full-width outcome promise band
//   03 problem/solution side-by-side split
//   04 layered service architecture diagram
//   05 capabilities accordion (expandable)
//   06 vertical engagement journey stepper
//   07 ROI calculator visual (inputs → outputs)
//   08 categorized stack & integrations grid
//   09 metric comparison cards (industry/STIOOS/potential)
//   10 case studies horizontal carousel
//   11 outcome scorecard (donut + bars + trend + kpis)
//   12 testimonial wall (masonry)
//   13 vs-alternatives toggle comparison
//   14 engagement models tabbed pricing
//   15 industries served horizontal strip
//   16 CTA + FAQ accordion
// ============================================================

export interface SolutionSectionProps {
  spec: SolutionSpec;
  accent: SolutionAccent;
}

// ------------------------------------------------------------
// Local infographic: DonutChart (for the outcome scorecard).
// ------------------------------------------------------------

function DonutChart({ value, label, colorClass }: { value: number; label: string; colorClass: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const v = useCountUp(value, inView);
  const size = 140;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (v / 100) * circ;
  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className={`relative ${colorClass}`} style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/[0.06]" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={inView ? offset : circ} style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white tabular-nums">{Math.round(v)}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-slate-400">{label}</span>
    </div>
  );
}

// ------------------------------------------------------------
// Local infographic: TrendLine (for the outcome scorecard).
// ------------------------------------------------------------

function TrendLineChart({ points, colorClass }: { points: number[]; colorClass: string }) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const w = 240;
  const h = 80;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const pts = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const d = `M${pts.join(" L")}`;
  const areaD = `${d} L${w},${h} L0,${h} Z`;
  const gradId = `trend-${Math.round(points[0] * 100)}-${points.length}`;
  return (
    <div ref={ref} className={colorClass}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${gradId})`} />
        <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: inView ? 1 : 0, transition: "opacity 0.8s" }} />
        {pts.map((p, i) => {
          const [x, y] = p.split(",").map(Number);
          return <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" style={{ opacity: inView ? 1 : 0, transition: `opacity 0.4s ${i * 0.1}s` }} />;
        })}
      </svg>
    </div>
  );
}

// ------------------------------------------------------------
// 01 — CENTERED HERO + ARCHITECTURE DIAGRAM
// ------------------------------------------------------------

export function SolutionHeroSection({ spec, accent }: SolutionSectionProps) {
  const h = spec.hero;
  return (
    <section className="relative overflow-hidden bg-brand-ink">
      <div className="absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-[40rem] -translate-x-1/2 rounded-full blur-3xl" style={{ background: accent.glow }} aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div className="text-center lg:text-left">
            <Reveal>
              <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ring-1", accent.tile, accent.eyebrow)}>
                <Icon name={spec.icon} className="h-3.5 w-3.5" />
                {h.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {h.title}{" "}
                <span className={cn("bg-gradient-to-r bg-clip-text text-transparent", accent.gradient)}>{h.highlight}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0 mx-auto">{h.subtitle}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link href={h.primaryCta.href} className={cn("inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]", accent.gradient)}>
                  {h.primaryCta.label} <Icon name="ArrowRight" className="h-4 w-4" />
                </Link>
                <Link href={h.secondaryCta.href} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-200 backdrop-blur transition hover:bg-white/[0.06]">
                  {h.secondaryCta.label}
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="hidden lg:block">
            <div className="space-y-2.5">
              {h.architectureLayers.map((layer, i) => (
                <div
                  key={layer.name}
                  className="group relative flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.04]"
                  style={{ marginLeft: `${(i % 2) * 16}px`, marginRight: `${((i + 1) % 2) * 16}px` }}
                >
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1", accent.tile)}>
                    <Icon name={layer.icon} className={cn("h-5 w-5", accent.icon)} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{layer.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {layer.components.map((c) => (
                        <span key={c} className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">{c}</span>
                      ))}
                    </div>
                  </div>
                  <span className={cn("text-[10px] font-bold tabular-nums", accent.eyebrow)}>0{i + 1}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.25}>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
            {h.metrics.map((m) => (
              <div key={m.label} className="text-center lg:text-left">
                <dt className={cn("text-2xl font-bold tabular-nums sm:text-3xl", accent.eyebrow)}>{m.value}</dt>
                <dd className="mt-1 text-xs text-slate-500">{m.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 02 — OUTCOME PROMISE BAND
// ------------------------------------------------------------

export function OutcomePromiseSection({ spec, accent }: SolutionSectionProps) {
  const o = spec.outcomePromise;
  const parseNum = (v: string) => parseFloat(v.replace(/[^0-9.]/g, "")) || 0;
  const parseSuffix = (v: string) => v.replace(/[0-9.]/g, "").trim();
  return (
    <section className={cn("relative overflow-hidden bg-gradient-to-br py-16 lg:py-20", accent.gradient)}>
      <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">{o.promise}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {o.stats.map((s, i) => {
            const num = parseNum(s.value);
            const suffix = parseSuffix(s.value);
            const hasDecimal = /\./.test(s.value);
            return (
              <Reveal key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold tabular-nums text-white sm:text-5xl">
                    {num > 0 ? <CountUpNumber target={num} suffix={suffix} decimals={hasDecimal ? 1 : 0} /> : s.value}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white/90">{s.label}</div>
                  <div className="mt-0.5 text-xs text-white/70">{s.sublabel}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 03 — PROBLEM / SOLUTION SPLIT
// ------------------------------------------------------------

export function ProblemSolutionSection({ spec, accent }: SolutionSectionProps) {
  const ps = spec.problemSolution;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{ps.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{ps.subtitle}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20">
                  <Icon name="TrendingDown" className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-foreground">Without {spec.name}</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {ps.problems.map((p) => (
                  <li key={p.text} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                      <Icon name="X" className="h-3 w-3" />
                    </span>
                    <span className="text-sm text-foreground/80">{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className={cn("rounded-2xl border p-6", accent.tile.replace("/10", "/20"))}>
              <div className="flex items-center gap-3">
                <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg ring-1", accent.tile)}>
                  <Icon name="TrendingUp" className={cn("h-5 w-5", accent.icon)} />
                </span>
                <h3 className="text-lg font-semibold text-foreground">With {spec.name}</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {ps.solutions.map((s) => (
                  <li key={s.text} className="flex items-start gap-3">
                    <span className={cn("mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1", accent.tile)}>
                      <Icon name="Check" className={cn("h-3 w-3", accent.icon)} />
                    </span>
                    <span className="text-sm text-foreground/80">{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 04 — SERVICE ARCHITECTURE DIAGRAM
// ------------------------------------------------------------

export function ServiceArchitectureSection({ spec, accent }: SolutionSectionProps) {
  const a = spec.architecture;
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{a.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">How {spec.name} is composed</h2>
          <p className="mt-4 text-slate-400">{a.subtitle}</p>
        </Reveal>
        <div className="mx-auto mt-12 max-w-3xl space-y-0">
          {a.layers.map((layer, i) => (
            <Reveal key={layer.name} delay={i * 0.08}>
              <div className="relative">
                <div className="flex items-center gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/20">
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg", accent.gradient)}>
                    <Icon name={layer.icon} className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] font-bold tabular-nums", accent.eyebrow)}>LAYER 0{i + 1}</span>
                      <h3 className="text-base font-semibold text-white">{layer.name}</h3>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {layer.components.map((c) => (
                        <span key={c} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] font-medium text-slate-300 ring-1 ring-white/[0.06]">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {i < a.layers.length - 1 && (
                  <div className="flex justify-center py-1" aria-hidden="true">
                    <div className={cn("h-6 w-0.5 bg-gradient-to-b opacity-40", accent.gradient)} />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 05 — CAPABILITIES ACCORDION
// ------------------------------------------------------------

export function CapabilitiesAccordionSection({ spec, accent }: SolutionSectionProps) {
  const c = spec.capabilities;
  const [open, setOpen] = useState(0);
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{c.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{c.subtitle}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-3xl space-y-2">
            {c.items.map((item, i) => (
              <div key={item.title} className={cn("overflow-hidden rounded-xl border transition", open === i ? cn("border-transparent ring-2", accent.tile.replace("/10", "/30")) : "border-border bg-card hover:border-border/80")}>
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                  aria-expanded={open === i}
                >
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1", accent.tile)}>
                    <Icon name={item.icon} className={cn("h-5 w-5", accent.icon)} />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-foreground">{item.title}</span>
                  <span className={cn("text-sm font-bold tabular-nums", accent.eyebrow)}>{item.stat.value}</span>
                  <Icon name="ChevronDown" className={cn("h-4 w-4 shrink-0 text-muted-foreground transition", open === i && "rotate-180")} />
                </button>
                {open === i && (
                  <div className="px-4 pb-4 pl-[4.5rem]">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className={cn("mt-2 text-xs font-medium", accent.eyebrow)}>{item.stat.label}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 06 — VERTICAL ENGAGEMENT JOURNEY STEPPER
// ------------------------------------------------------------

export function EngagementJourneySection({ spec, accent }: SolutionSectionProps) {
  const j = spec.journey;
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{j.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{j.subtitle}</h2>
        </Reveal>
        <div className="mx-auto mt-12 max-w-2xl">
          {j.milestones.map((m, i) => (
            <Reveal key={m.phase} delay={i * 0.08}>
              <div className="relative flex gap-6 pb-8 last:pb-0">
                {i < j.milestones.length - 1 && (
                  <div className="absolute left-[1.4rem] top-12 bottom-0 w-px bg-white/[0.08]" aria-hidden="true" />
                )}
                <div className={cn("relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg", accent.gradient)}>
                  {m.phase}
                </div>
                <div className="flex-1 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">{m.title}</h3>
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{m.duration}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{m.description}</p>
                  <div className={cn("mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold", accent.tile, accent.eyebrow)}>
                    <Icon name="TrendingUp" className="h-3 w-3" />
                    {m.outcome}
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
// 07 — ROI CALCULATOR VISUAL
// ------------------------------------------------------------

export function RoiVisualSection({ spec, accent }: SolutionSectionProps) {
  const r = spec.roi;
  const invNum = parseFloat(r.investment.replace(/[^0-9.]/g, "")) || 0;
  const retNum = parseFloat(r.return.replace(/[^0-9.]/g, "")) || 0;
  const roiPct = invNum > 0 ? Math.min((retNum / invNum) * 100, 100) : 60;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{r.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{r.subtitle}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your investment</h3>
                <div className="mt-4 space-y-3">
                  {r.inputs.map((inp) => (
                    <div key={inp.label} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                      <span className="text-xs text-muted-foreground">{inp.label}</span>
                      <span className="text-sm font-semibold text-foreground">{inp.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-muted/40 p-3">
                  <div className="text-xs text-muted-foreground">Total investment</div>
                  <div className="text-2xl font-bold text-foreground">{r.investment}</div>
                </div>
              </div>
              <div>
                <h3 className={cn("text-sm font-semibold uppercase tracking-wider", accent.eyebrow)}>Your return</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {r.outputs.map((out) => (
                    <div key={out.label} className={cn("rounded-xl border p-3", accent.tile)}>
                      <div className={cn("text-xl font-bold tabular-nums", accent.eyebrow)}>{out.value}<span className="text-xs">{out.unit}</span></div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{out.label}</div>
                    </div>
                  ))}
                </div>
                <div className={cn("mt-4 rounded-xl bg-gradient-to-br p-4 text-white", accent.gradient)}>
                  <div className="text-xs uppercase tracking-wider opacity-80">Total return</div>
                  <div className="text-2xl font-bold">{r.return}</div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[10px] opacity-80">
                      <span>Investment</span>
                      <span>Return</span>
                    </div>
                    <AnimatedBar pct={roiPct} gradient="from-white to-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 08 — STACK & INTEGRATIONS GRID
// ------------------------------------------------------------

export function StackGridSection({ spec, accent }: SolutionSectionProps) {
  const s = spec.stack;
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{s.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{s.subtitle}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.categories.map((cat, i) => (
            <Reveal key={cat.name} delay={i * 0.06}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", accent.dot)} />
                  <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.tools.map((tool) => (
                    <span key={tool} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:text-white">{tool}</span>
                  ))}
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
// 09 — METRIC COMPARISON CARDS
// ------------------------------------------------------------

export function MetricComparisonSection({ spec, accent }: SolutionSectionProps) {
  const m = spec.metricComparison;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{m.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{m.subtitle}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {m.metrics.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{metric.label}</h3>
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-[11px]"><span className="text-muted-foreground">Industry avg</span><span className="font-semibold text-muted-foreground">{metric.industry}{metric.unit}</span></div>
                    <AnimatedBar pct={metric.industry} gradient="from-slate-400 to-slate-500" />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[11px]"><span className={cn("font-semibold", accent.eyebrow)}>STIOOS</span><span className={cn("font-bold", accent.eyebrow)}>{metric.stioos}{metric.unit}</span></div>
                    <AnimatedBar pct={metric.stioos} gradient={accent.gradient} delay={0.1} />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[11px]"><span className="text-foreground/70">Your potential</span><span className="font-semibold text-foreground">{metric.potential}{metric.unit}</span></div>
                    <AnimatedBar pct={metric.potential} gradient="from-slate-600 to-slate-700 dark:from-slate-300 dark:to-slate-200" delay={0.2} />
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
// 10 — CASE STUDIES CAROUSEL
// ------------------------------------------------------------

export function CaseStudiesCarouselSection({ spec, accent }: SolutionSectionProps) {
  const cs = spec.caseStudies;
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{cs.title}</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{cs.subtitle}</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 thin-scrollbar snap-x snap-mandatory">
            {cs.studies.map((study, i) => (
              <div key={i} className="w-[85%] shrink-0 snap-start sm:w-[420px]">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <div className={cn("flex items-center justify-between bg-gradient-to-r p-5", accent.gradient)}>
                    <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">{study.industry}</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{study.result.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-white/80">{study.result.label}</div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-semibold text-white">{study.title}</h3>
                    <blockquote className="mt-3 flex-1 border-l-2 pl-4 text-sm italic text-slate-400" style={{ borderColor: "currentColor" }}>
                      <span className={accent.eyebrow}>&ldquo;{study.quote}&rdquo;</span>
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 11 — OUTCOME SCORECARD (multi-chart dashboard)
// ------------------------------------------------------------

export function OutcomeScorecardSection({ spec, accent }: SolutionSectionProps) {
  const sc = spec.scorecard;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{sc.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{sc.subtitle}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto]">
              <div className="flex flex-col items-center justify-center border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                <DonutChart value={sc.donut.value} label={sc.donut.label} colorClass={accent.icon} />
              </div>
              <div className="space-y-6">
                <div>
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capability coverage</div>
                  <div className="space-y-2.5">
                    {sc.bars.map((b, i) => (
                      <div key={b.label}>
                        <div className="mb-1 flex justify-between text-[11px]"><span className="text-muted-foreground">{b.label}</span><span className={cn("font-semibold", accent.eyebrow)}>{b.value}%</span></div>
                        <AnimatedBar pct={b.value} gradient={accent.gradient} delay={i * 0.05} />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{sc.trend.label}</div>
                  <TrendLineChart points={sc.trend.points} colorClass={accent.icon} />
                </div>
              </div>
              <div className="flex flex-row gap-4 border-t border-border pt-6 lg:flex-col lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                {sc.kpis.map((k) => (
                  <div key={k.label} className="flex-1 text-center lg:text-right">
                    <div className={cn("text-xl font-bold tabular-nums", accent.eyebrow)}>{k.value}</div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground">{k.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 12 — TESTIMONIAL WALL (masonry)
// ------------------------------------------------------------

export function TestimonialWallSection({ spec, accent }: SolutionSectionProps) {
  const tw = spec.testimonials;
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{tw.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{tw.subtitle}</h2>
        </Reveal>
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {tw.testimonials.map((t, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08}>
              <div className="break-inside-avoid rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Icon key={s} name="Star" className={cn("h-3.5 w-3.5", s < t.rating ? accent.eyebrow : "text-white/20")} />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-3">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-1", accent.tile, accent.eyebrow)}>
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.name}</div>
                    <div className="text-[10px] text-slate-500">{t.role} · {t.company}</div>
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
// 13 — VS ALTERNATIVES TOGGLE
// ------------------------------------------------------------

export function VsAlternativesSection({ spec, accent }: SolutionSectionProps) {
  const va = spec.vsAlternatives;
  const allCols = [...va.alternatives, "STIOOS"];
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{va.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{va.subtitle}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="grid grid-cols-[1.2fr_repeat(4,1fr)] gap-2 border-b border-border bg-muted/40 px-4 py-3 text-[10px] font-semibold uppercase tracking-wider sm:text-xs">
              <span className="text-muted-foreground">Criterion</span>
              {allCols.map((col, i) => (
                <span key={col} className={cn("text-center", i === allCols.length - 1 ? accent.eyebrow : "text-muted-foreground")}>{col}</span>
              ))}
            </div>
            <div className="divide-y divide-border">
              {va.criteria.map((row) => (
                <div key={row.label} className="grid grid-cols-[1.2fr_repeat(4,1fr)] items-center gap-2 px-4 py-3">
                  <span className="text-xs font-medium text-foreground sm:text-sm">{row.label}</span>
                  {row.scores.map((score, i) => {
                    const isUs = i === row.scores.length - 1;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <span className={cn("text-[10px] font-bold tabular-nums sm:text-xs", isUs ? accent.eyebrow : "text-muted-foreground")}>{score}</span>
                        <div className="h-1.5 w-full max-w-[50px] overflow-hidden rounded-full bg-muted">
                          <AnimatedBar pct={score} gradient={isUs ? accent.gradient : "from-slate-400 to-slate-500"} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 14 — ENGAGEMENT MODELS TABS
// ------------------------------------------------------------

export function EngagementTabsSection({ spec, accent }: SolutionSectionProps) {
  const et = spec.engagement;
  const popularIdx = et.tabs.findIndex((t) => t.popular);
  const [active, setActive] = useState(popularIdx >= 0 ? popularIdx : 0);
  const tab = et.tabs[active];
  return (
    <section className="relative overflow-hidden bg-brand-ink py-20 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{et.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{et.subtitle}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 flex max-w-md gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1.5">
            {et.tabs.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setActive(i)}
                className={cn(
                  "relative flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm",
                  active === i ? cn("bg-gradient-to-r text-white shadow-lg", accent.gradient) : "text-slate-400 hover:text-white"
                )}
              >
                {t.name}
                {t.popular && <span className="ml-1 hidden rounded bg-white/20 px-1 text-[8px] uppercase sm:inline">★</span>}
              </button>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
            <div className="grid gap-8 sm:grid-cols-[1fr_1.3fr]">
              <div>
                <h3 className="text-xl font-bold text-white">{tab.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{tab.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className={cn("text-4xl font-bold", accent.eyebrow)}>{tab.price}</span>
                  <span className="text-sm text-slate-500">/{tab.period}</span>
                </div>
                <Link href="/contact" className={cn("mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.02]", accent.gradient)}>
                  {tab.popular ? "Get started" : "Choose " + tab.name} <Icon name="ArrowRight" className="h-4 w-4" />
                </Link>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">What's included</div>
                <ul className="mt-3 space-y-2.5">
                  {tab.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Icon name="Check" className={cn("mt-0.5 h-4 w-4 shrink-0", accent.icon)} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 15 — INDUSTRIES SERVED STRIP
// ------------------------------------------------------------

export function IndustriesStripSection({ spec, accent }: SolutionSectionProps) {
  const ind = spec.industries;
  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>{ind.title}</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{ind.subtitle}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex gap-4 overflow-x-auto pb-4 thin-scrollbar snap-x">
            {ind.industries.map((industry) => (
              <Link
                key={industry.name}
                href="/contact"
                className="group flex w-[180px] shrink-0 snap-start flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl ring-1", accent.tile)}>
                  <Icon name={industry.icon} className={cn("h-5 w-5", accent.icon)} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{industry.name}</div>
                  <div className={cn("mt-0.5 text-xs", accent.eyebrow)}>{industry.count} engagements shipped</div>
                </div>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 16 — CTA + FAQ
// ------------------------------------------------------------

export function CtaFaqSection({ spec, accent }: SolutionSectionProps) {
  const cf = spec.ctaFaq;
  const [openFaq, setOpenFaq] = useState(-1);
  return (
    <section className="bg-brand-ink">
      <div className="relative overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br", accent.gradient)} />
        <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">{cf.cta.eyebrow}</span>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{cf.cta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">{cf.cta.subtitle}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href={cf.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-ink shadow-lg transition hover:scale-[1.02]">{cf.cta.primaryCta.label}<Icon name="ArrowRight" className="h-4 w-4" /></Link>
              <Link href={cf.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">{cf.cta.secondaryCta.label}</Link>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <Reveal className="text-center">
          <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", accent.eyebrow)}>Frequently asked</span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">Questions about {spec.name}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 space-y-2">
            {cf.faqs.map((faq, i) => (
              <div key={i} className={cn("overflow-hidden rounded-xl border transition", openFaq === i ? cn("border-transparent ring-1", accent.tile.replace("/10", "/30")) : "border-white/[0.08] bg-white/[0.02]")}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left" aria-expanded={openFaq === i}>
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <Icon name="ChevronDown" className={cn("h-4 w-4 shrink-0 text-slate-400 transition", openFaq === i && "rotate-180")} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-slate-400">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
