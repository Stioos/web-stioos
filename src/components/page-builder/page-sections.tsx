import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  Globe,
  MapPin,
  MessageSquare,
  Quote,
  Star,
  XCircle,
} from "lucide-react";
import type {
  PageSpec,
  SpecStat,
} from "@/data/pages/types";
import { ACCENT } from "./accents";
import { Reveal } from "@/components/motion/reveal";
import { SpotlightVisual } from "./visuals";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@/components/shared/icon";

// ============================================================
// PAGE BUILDER SECTIONS — the 24 sections every dropdown-option
// page is composed from. All content comes from one PageSpec.
// ============================================================

const CONTAINER = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

/** Shared section header with mono index + eyebrow. */
function SectionHead({
  index,
  eyebrow,
  title,
  description,
  a,
  align = "center",
}: {
  index: number;
  eyebrow: string;
  title: string;
  description?: string;
  a: (typeof ACCENT)[keyof typeof ACCENT];
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl"
      }
    >
      <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span className={`font-mono text-[11px] ${a.idx}`}>
          {String(index).padStart(2, "0")}
        </span>
        <span className="h-px w-6 bg-white/15" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

function StatTiles({
  stats,
  a,
  className = "",
}: {
  stats: SpecStat[];
  a: (typeof ACCENT)[keyof typeof ACCENT];
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center backdrop-blur"
        >
          <p className={`text-lg font-bold sm:text-xl md:text-2xl ${a.idxSolid}`}>
            {s.value}
          </p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 md:text-[11px]">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── 01 · HERO ─────────────────────────────────────────────── */
// HeroSection moved to ./hero — a viewport-fit merged hero card
// shared by every /talent-solutions/* page.

/* ── 02 · TRUST BAR ────────────────────────────────────────── */
export function TrustBarSection({ spec }: { spec: PageSpec }) {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02] py-5">
      <div className={CONTAINER}>
        <Reveal className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {spec.trustBadges.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <BadgeCheck className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
              {b}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 03 · KPI BAND ─────────────────────────────────────────── */
export function KpiSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spec.kpis.map((k, i) => (
            <Reveal key={k.label} delay={i * 0.06}>
              <div className={`group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors ${a.cardHoverBorder}`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.tile}`}>
                  <Icon name={k.icon} className="h-5 w-5" />
                </span>
                <p className="mt-4 text-3xl font-bold tracking-tight text-white">{k.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-200">{k.label}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{k.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 04 · WHO IT'S FOR ─────────────────────────────────────── */
export function AudiencesSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className={`${a.softBg} py-14 md:py-20`}>
      <div className={CONTAINER}>
        <SectionHead
          index={4}
          eyebrow="Built for both sides"
          title="Who this is for"
          description="One program, two winning outcomes — whether you're chasing your next role or your next great hire."
          a={a}
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {spec.audiences.map((aud, i) => (
            <Reveal key={aud.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-brand-navy p-6 shadow-xl shadow-black/30 md:p-7">
                <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${i === 0 ? a.chip : "border-violet-400/30 bg-violet-400/10 text-violet-300"}`}>
                  <Icon name={aud.icon} className="h-3 w-3" />
                  {aud.kicker}
                </span>
                <h3 className="mt-4 text-xl font-bold text-white md:text-2xl">{aud.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{aud.description}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {aud.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className={`mt-0.5 flex h-4.5 w-4.5 h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${a.chip}`}>
                        <Check className="h-2.5 w-2.5" aria-hidden="true" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link
                    href={aud.cta.href}
                    className={`group inline-flex items-center gap-1.5 text-sm font-bold ${a.idxSolid} transition-colors hover:text-white`}
                  >
                    {aud.cta.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
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

/* ── 05 · WHY CHOOSE (VALUE GRID) ──────────────────────────── */
export function ValuePropsSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={5}
          eyebrow="Why STIOOS"
          title={`Why teams choose ${spec.nav}`}
          description="Six reasons this program outperforms traditional routes — engineered from thousands of placements and engagements."
          a={a}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spec.valueProps.map((v, i) => (
            <Reveal key={v.title} delay={(i % 3) * 0.06}>
              <div className={`group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 ${a.cardHoverBorder}`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${a.tile}`}>
                  <Icon name={v.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-white">{v.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{v.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 06 · HOW IT WORKS (PROCESS TIMELINE) ──────────────────── */
export function ProcessSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className={`${a.softBg} py-14 md:py-20`}>
      <div className={CONTAINER}>
        <SectionHead
          index={6}
          eyebrow="Simple by design"
          title={spec.processTitle}
          description="A clear, guided journey — you always know exactly where you are and what happens next."
          a={a}
        />
        <div className="relative mx-auto mt-12 max-w-3xl">
          <span className="absolute bottom-4 left-[19px] top-2 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent sm:left-1/2" aria-hidden="true" />
          <div className="flex flex-col gap-8">
            {spec.process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05} className="relative">
                <div className={`flex gap-5 sm:w-1/2 ${i % 2 === 0 ? "sm:pr-10" : "sm:ml-auto sm:flex-row-reverse sm:pl-10 sm:text-right"}`}>
                  <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-brand-ink font-mono text-xs font-bold ${a.chip}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 pb-1">
                    <div className={`flex flex-wrap items-center gap-2 ${i % 2 !== 0 ? "sm:justify-end" : ""}`}>
                      <h3 className="text-[15px] font-bold text-white">{step.title}</h3>
                      <span className={`rounded border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${a.chip}`}>
                        {step.duration}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 07 · SPOTLIGHT ROWS ───────────────────────────────────── */
export function SpotlightSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={7}
          eyebrow="Deep dive"
          title="What makes it work"
          description="Three engines run under the hood — each one measured, monitored and continuously improved."
          a={a}
        />
        <div className="mt-12 flex flex-col gap-12 md:gap-16">
          {spec.spotlight.map((s, i) => (
            <Reveal key={s.title}>
              <div className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.tile}`}>
                    <Icon name={s.icon} className="h-5.5 w-5.5 h-[22px] w-[22px]" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-white md:text-2xl">{s.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{s.description}</p>
                  <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] text-slate-300">
                        <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${a.idxSolid}`} aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <SpotlightVisual variant={s.visual} a={a} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 08 · WHAT'S INCLUDED ──────────────────────────────────── */
export function DeliverablesSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02] py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={8}
          eyebrow="Everything included"
          title={spec.deliverablesTitle}
          description="No hidden add-ons — every engagement ships with the full stack of services below."
          a={a}
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {spec.deliverables.map((d, i) => (
            <Reveal key={d} delay={(i % 4) * 0.05}>
              <div className={`flex h-full items-start gap-2.5 rounded-xl border border-white/10 bg-brand-navy p-4 transition-colors ${a.cardHoverBorder}`}>
                <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${a.chip}`}>
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <p className="text-[13px] font-medium leading-snug text-slate-200">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 09 · MODULES GRID ─────────────────────────────────────── */
export function ModulesSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={9}
          eyebrow="Pick your path"
          title={spec.modulesTitle}
          description="Mix and match capability modules — start where it hurts most and expand when you're ready."
          a={a}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spec.modules.map((m, i) => (
            <Reveal key={m.title} delay={(i % 3) * 0.06}>
              <div className={`group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 ${a.cardHoverBorder}`}>
                <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full ${a.glow} opacity-0 blur-2xl transition-opacity group-hover:opacity-30`} aria-hidden="true" />
                <div className="flex items-center justify-between gap-2">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.tile}`}>
                    <Icon name={m.icon} className="h-5 w-5" />
                  </span>
                  <span className={`rounded border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${a.chip}`}>
                    {m.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-white">{m.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{m.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 10 · AI & TECHNOLOGY ──────────────────────────────────── */
export function TechSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02] py-14 md:py-20">
      <div className={CONTAINER}>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-brand-navy p-6 shadow-2xl shadow-black/40 md:p-10">
          <div className={`pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full ${a.glow} opacity-20 blur-3xl`} aria-hidden="true" />
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHead
                index={10}
                eyebrow="AI & Technology"
                title={spec.tech.title}
                description={spec.tech.description}
                a={a}
                align="left"
              />
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {spec.tech.points.map((p, i) => (
                  <Reveal key={p.title} delay={i * 0.05}>
                    <div className="flex h-full items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.tile}`}>
                        <Icon name={p.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-bold text-white">{p.title}</span>
                        <span className="mt-0.5 block text-[11.5px] leading-relaxed text-slate-500">{p.description}</span>
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <Reveal delay={0.1}>
                <SpotlightVisual variant="dashboard" a={a} />
                <StatTiles stats={spec.tech.stats} a={a} className="mt-4" />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 11 · COVERAGE ─────────────────────────────────────────── */
export function CoverageSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={11}
          eyebrow="Coverage"
          title={spec.coverage.title}
          description={spec.coverage.note}
          a={a}
        />
        <Reveal className="mt-9 flex flex-wrap justify-center gap-2">
          {spec.coverage.chips.map((c) => (
            <span key={c} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors ${a.cardHoverBorder} border-white/10 bg-white/[0.03]`}>
              {c}
            </span>
          ))}
        </Reveal>
        <StatTiles stats={spec.coverage.stats} a={a} className="mx-auto mt-8 max-w-2xl" />
      </div>
    </section>
  );
}

/* ── 12 · ENGAGEMENT MODELS ────────────────────────────────── */
export function ModelsSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className={`${a.softBg} py-14 md:py-20`}>
      <div className={CONTAINER}>
        <SectionHead
          index={12}
          eyebrow="Flexible engagement"
          title={spec.modelsTitle}
          description="Transparent engagement models with no surprises — upgrade, pause or switch as your needs evolve."
          a={a}
        />
        <div className="mt-10 grid items-stretch gap-5 lg:grid-cols-3">
          {spec.models.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.07} className="h-full">
              <div className={`relative flex h-full flex-col rounded-2xl border p-6 shadow-xl shadow-black/30 transition-transform hover:-translate-y-1 ${
                m.popular ? `${a.chipSolid} bg-brand-navy` : "border-white/10 bg-white/[0.03]"
              } ${m.popular ? "border-white/25 ring-1 ring-inset ring-white/10" : ""}`}>
                {m.popular && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-lg ${a.btn}`}>
                    Most popular
                  </span>
                )}
                <p className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${a.chip}`}>
                  {m.name}
                </p>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-white">{m.price}</span>
                  <span className="text-xs font-medium text-slate-500">{m.period}</span>
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-slate-400">{m.description}</p>
                <ul className="mt-5 flex flex-col gap-2">
                  {m.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-slate-300">
                      <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${a.idxSolid}`} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={m.cta.href}
                  className={`group mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 pt-2.5 text-sm font-bold transition-colors mt-6 ${
                    m.popular ? a.btn : `border border-white/15 bg-white/[0.04] text-slate-200 ${a.btnGhostHover} hover:text-white`
                  }`}
                >
                  {m.cta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 13 · OUTCOMES ─────────────────────────────────────────── */
export function OutcomesSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={13}
          eyebrow="Measured, not promised"
          title="Outcomes we're accountable for"
          description="Every engagement is tracked against live KPIs — reported to you, reviewed monthly."
          a={a}
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
          {spec.outcomes.map((o, i) => (
            <Reveal key={o.label} delay={i * 0.06}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-2xl font-bold tracking-tight text-white">{o.value}</p>
                  <p className="text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">{o.label}</p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div style={{ width: `${o.progress}%` }} className={`h-full rounded-full ${a.bar}`} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 14 · TESTIMONIALS ─────────────────────────────────────── */
export function TestimonialsSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className={`${a.softBg} py-14 md:py-20`}>
      <div className={CONTAINER}>
        <SectionHead
          index={14}
          eyebrow="In their words"
          title="Success stories"
          description="From fresh graduates to enterprise hiring teams — here's what the experience feels like."
          a={a}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {spec.testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-brand-navy p-6 shadow-xl shadow-black/30">
                <Quote className={`h-5 w-5 ${a.idxSolid}`} aria-hidden="true" />
                <div className="mt-2 flex gap-0.5" aria-label={`Rated ${t.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${s < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-4">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-brand-ink ${a.avatar}`}>
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-[13px] font-bold text-white">{t.name}</span>
                    <span className="block text-[11px] text-slate-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 15 · CASE STUDY ───────────────────────────────────────── */
export function CaseStudySection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  const cs = spec.caseStudy;
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/40">
            <div className={`border-b border-white/[0.07] px-6 py-4 md:px-8 ${a.softBg}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${a.chip}`}>
                  Case study · {cs.industry}
                </span>
                <span className="text-[11px] font-medium text-slate-500">Results in 90 days</span>
              </div>
              <h2 className="mt-2.5 text-xl font-bold text-white md:text-2xl">{cs.title}</h2>
            </div>
            <div className="grid gap-0 md:grid-cols-2">
              <div className="border-b border-white/[0.07] p-6 md:border-b-0 md:border-r md:p-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-rose-400/80">The challenge</p>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">{cs.challenge}</p>
                <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-400/80">Our solution</p>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">{cs.solution}</p>
              </div>
              <div className="grid content-center gap-4 p-6 sm:grid-cols-3 md:p-8">
                {cs.results.map((r) => (
                  <div key={r.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4 text-center">
                    <p className={`text-2xl font-bold tracking-tight ${a.idxSolid}`}>{r.value}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{r.label}</p>
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

/* ── 16 · COMPARISON ───────────────────────────────────────── */
export function ComparisonSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02] py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={16}
          eyebrow="Honest difference"
          title={spec.comparisonTitle}
          description="Side by side with the old way — the gap is exactly why teams switch and never look back."
          a={a}
        />
        <Reveal className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-xl shadow-black/30">
          <div className="grid grid-cols-[1fr_1fr] border-b border-white/[0.07] bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-slate-500 max-sm:text-[10px]">
            <div className="px-4 py-3 md:px-6">Traditional approach</div>
            <div className={`border-l border-white/[0.07] px-4 py-3 md:px-6 ${a.idxSolid}`}>With STIOOS</div>
          </div>
          {spec.comparison.map((row, i) => (
            <div key={row.traditional} className={`grid grid-cols-[1fr_1fr] max-sm:text-[12px] ${i !== spec.comparison.length - 1 ? "border-b border-white/[0.05]" : ""}`}>
              <div className="flex items-start gap-2 px-4 py-3.5 text-slate-500 md:px-6">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" aria-hidden="true" />
                {row.traditional}
              </div>
              <div className="flex items-start gap-2 border-l border-white/[0.05] px-4 py-3.5 text-slate-200 md:px-6">
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${a.idxSolid}`} aria-hidden="true" />
                {row.withUs}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ── 17 · INDUSTRIES ───────────────────────────────────────── */
export function IndustriesSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={17}
          eyebrow="Cross-industry"
          title="Industries we serve"
          description="Domain-fluent talent and delivery — mapped to the realities of your sector."
          a={a}
        />
        <div className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
          {spec.industries.map((ind, i) => (
            <Reveal key={ind} delay={(i % 5) * 0.04}>
              <div className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[12px] font-semibold text-slate-200 transition-colors ${a.cardHoverBorder}`}>
                <Globe className={`h-3.5 w-3.5 shrink-0 ${a.idxSolid}`} aria-hidden="true" />
                <span className="truncate">{ind}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 18 · GLOBAL REACH ─────────────────────────────────────── */
export function GlobalSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className={`${a.softBg} py-14 md:py-20`}>
      <div className={CONTAINER}>
        <SectionHead
          index={18}
          eyebrow="Global reach"
          title="Where we operate"
          description="Follow-the-sun delivery across four regions — your program never sleeps."
          a={a}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spec.regions.map((r, i) => (
            <Reveal key={r.region} delay={i * 0.06}>
              <div className={`h-full rounded-2xl border border-white/10 bg-brand-navy p-5 transition-colors ${a.cardHoverBorder}`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${a.tile}`}>
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="mt-3.5 text-sm font-bold text-white">{r.region}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-slate-400">{r.cities}</p>
                <p className="mt-2 text-[11px] font-medium text-slate-600">{r.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 19 · GUARANTEES ───────────────────────────────────────── */
export function GuaranteesSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={19}
          eyebrow="Risk-free by contract"
          title="Our guarantees"
          description="We put skin in the game — written commitments on every engagement, not marketing promises."
          a={a}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {spec.guarantees.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.06}>
              <div className={`h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors ${a.cardHoverBorder}`}>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.tile}`}>
                  <Icon name={g.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-white">{g.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-400">{g.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 20 · EXPERTS ──────────────────────────────────────────── */
export function ExpertsSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className={`${a.softBg} py-14 md:py-20`}>
      <div className={CONTAINER}>
        <SectionHead
          index={20}
          eyebrow="People behind the program"
          title="Meet your experts"
          description="Practitioners, not account managers — the people you'll actually work with."
          a={a}
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spec.experts.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.07}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-white/10 bg-brand-navy p-6 text-center shadow-xl shadow-black/30">
                <span className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-brand-ink ring-2 ring-white/10 ${a.avatar}`}>
                  {e.initials}
                </span>
                <h3 className="mt-3.5 text-sm font-bold text-white">{e.name}</h3>
                <p className="text-[12px] text-slate-500">{e.role}</p>
                <p className={`mt-2.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${a.chip}`}>
                  {e.specialty}
                </p>
                <p className="mt-3 text-[12px] font-medium text-slate-400">{e.stat}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 21 · RESOURCES ────────────────────────────────────────── */
export function ResourcesSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={21}
          eyebrow="Keep learning"
          title="Guides & resources"
          description="Practical playbooks from our delivery teams — free to read, built from real engagements."
          a={a}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {spec.resources.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.07}>
              <Link
                href="/resources"
                className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 ${a.cardHoverBorder}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded border px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider ${a.chip}`}>
                    {r.type}
                  </span>
                  <span className="text-[10.5px] font-medium text-slate-600">{r.readTime}</span>
                </div>
                <h3 className="mt-3.5 text-[15px] font-bold leading-snug text-white">{r.title}</h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-400">{r.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-300 transition-colors group-hover:text-white">
                  Read guide
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 22 · FAQ ──────────────────────────────────────────────── */
export function FaqSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.02] py-14 md:py-20">
      <div className={CONTAINER}>
        <SectionHead
          index={22}
          eyebrow="Answers, fast"
          title="Frequently asked questions"
          a={a}
        />
        <Reveal className="mx-auto mt-9 max-w-3xl">
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {spec.faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="rounded-2xl border border-white/10 bg-brand-navy px-5 shadow-lg shadow-black/20 last:border-b"
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
        </Reveal>
      </div>
    </section>
  );
}

/* ── 23 · CTA BAND ─────────────────────────────────────────── */
export function CtaBandSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="py-14 md:py-20">
      <div className={CONTAINER}>
        <Reveal>
          <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-7 shadow-2xl shadow-black/40 md:p-12 ${a.band}`}>
            <div className={`pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full ${a.glow} opacity-30 blur-3xl`} aria-hidden="true" />
            <div className={`pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full ${a.glow} opacity-20 blur-3xl`} aria-hidden="true" />
            <div className="relative">
              <div className="mx-auto max-w-2xl text-center">
                <p className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] ${a.chip}`}>
                  <Icon name="Sparkles" className="h-3 w-3" />
                  {spec.ctaBand.kicker}
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                  {spec.ctaBand.title}
                </h2>
              </div>
              <div className="mt-9 grid gap-4 lg:grid-cols-2">
                {[spec.ctaBand.primary, spec.ctaBand.secondary].map((c, i) => (
                  <div
                    key={c.title}
                    className="flex flex-col rounded-2xl border border-white/10 bg-brand-ink/70 p-6 backdrop-blur md:p-7"
                  >
                    <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${i === 0 ? a.idxSolid : "text-violet-300"}`}>
                      {c.kicker}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white md:text-xl">{c.title}</h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-400">{c.text}</p>
                    <Link
                      href={c.cta.href}
                      className={`group mt-5 inline-flex w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
                        i === 0 ? a.btn : "border border-white/15 bg-white/[0.05] text-slate-100 hover:bg-white/[0.10] hover:text-white"
                      }`}
                    >
                      {c.cta.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
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

/* ── 24 · CONTACT STRIP ────────────────────────────────────── */
export function ContactSection({ spec }: { spec: PageSpec }) {
  const a = ACCENT[spec.accent];
  return (
    <section className="border-t border-white/[0.06] bg-white/[0.02] py-12 md:py-16">
      <div className={CONTAINER}>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-bold text-white md:text-2xl">{spec.contact.title}</h2>
          <p className="mt-2 text-sm text-slate-400">{spec.contact.note}</p>
        </Reveal>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {spec.contact.channels.map((ch, i) => (
            <Reveal key={ch.label} delay={i * 0.06}>
              <Link
                href={ch.href}
                className={`group flex h-full flex-col items-center rounded-2xl border border-white/10 bg-brand-navy p-5 text-center transition-all hover:-translate-y-0.5 ${a.cardHoverBorder}`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.tile}`}>
                  <Icon name={ch.icon} className="h-5 w-5" />
                </span>
                <p className="mt-3 text-[13px] font-bold text-white">{ch.label}</p>
                <p className="mt-0.5 text-[11.5px] text-slate-500">{ch.value}</p>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-600">
          <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
          Average first response: under 4 business hours
        </Reveal>
      </div>
    </section>
  );
}
