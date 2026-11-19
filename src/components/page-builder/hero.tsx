import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PageAccent, PageSpec } from "@/data/pages/types";
import { TALENT_STRIP_OPTIONS } from "@/data/talent-solutions";
import { ACCENT } from "./accents";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/shared/icon";

// ============================================================
// PAGE BUILDER HERO — viewport-fit merged hero card used by ALL
// /talent-solutions/* option + sub pages.
//
// Modeled on the service detail page hero (merged identity card
// with a "why" side panel) and upgraded:
//   • fills the first viewport (min-h = 100svh minus sticky
//     chrome: 72px main bar + 46px secondary strip on desktop,
//     64px bar + ~46px static strip on mobile) and vertically
//     centers its card, so the whole hero fits laptops and up
//   • breadcrumb pills (division + parent option) with live
//     icons derived from the strip-option tables
//   • gradient identity tile, fluid clamp() title, full-width
//     stat strip, and a "why this wins" checklist panel
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

  const pillBase =
    "inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/10";

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-brand-ink"
    >
      {/* Backdrop — grid + two accent orbs (richer than the single-orb service hero) */}
      <div
        className="pointer-events-none absolute inset-0 surface-grid opacity-40"
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute -top-32 left-1/3 h-72 w-[40rem] -translate-x-1/2 rounded-full ${a.glow} opacity-25 blur-3xl`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute -bottom-40 -right-24 h-80 w-80 rounded-full ${a.glow} opacity-15 blur-3xl`}
        aria-hidden="true"
      />

      {/* Viewport-fit shell: fills the first screen under the sticky
          chrome and centers the card vertically on tall displays.
          Wider max-width (1600px) matches the service detail hero so
          the merged identity card spans the same band on wide screens. */}
      <div className="relative mx-auto flex min-h-[calc(100svh-110px)] w-full max-w-[1600px] flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:min-h-[calc(100svh-118px)] lg:px-8 lg:py-14">
        <div className="relative">
          {/* Soft accent halo behind the card */}
          <div
            className={`pointer-events-none absolute -inset-5 hidden rounded-3xl opacity-40 blur-2xl sm:block ${a.glow}`}
            aria-hidden="true"
          />

          {/* Merged hero card — identity + why-panel in one surface */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-sm">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              aria-hidden="true"
            />

            <div className="grid lg:grid-cols-[1.4fr_1px_1fr]">
              {/* ── Left — breadcrumb pills + identity + CTAs ── */}
              <div className="p-5 sm:p-7 lg:p-8">
                {/* Breadcrumb pills — division + (option | eyebrow) */}
                <Reveal delay={0.02}>
                  <div className="flex flex-wrap items-center gap-2">
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

                {/* Identity row — gradient tile + fluid two-line title */}
                <Reveal delay={0.08}>
                  <div className="mt-4 flex items-center gap-4 sm:mt-5 sm:gap-5">
                    <span
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ring-1 ring-white/20 sm:h-16 sm:w-16 ${HERO_TILE[spec.accent]}`}
                    >
                      {OptionIcon ? (
                        <OptionIcon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                      ) : (
                        <Sparkles className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                      )}
                    </span>
                    <h1 className="line-clamp-2 min-w-0 flex-1 text-[clamp(1.5rem,1rem+1.7vw,2.25rem)] font-bold leading-[1.12] tracking-tight text-white">
                      {spec.title}{" "}
                      <span
                        className={`bg-gradient-to-r bg-clip-text text-transparent ${a.gradText}`}
                      >
                        {spec.highlight}
                      </span>
                    </h1>
                  </div>
                  <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
                    {spec.subtitle}
                  </p>
                </Reveal>

                {/* CTAs */}
                <Reveal delay={0.14}>
                  <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6">
                    <Link
                      href={spec.primaryCta.href}
                      className={`group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-lg shadow-black/30 transition-colors ${a.btn}`}
                    >
                      {spec.primaryCta.label}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                    <Link
                      href={spec.secondaryCta.href}
                      className={`inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:text-white ${a.btnGhostHover}`}
                    >
                      {spec.secondaryCta.label}
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* 1px divider rail (lg only) */}
              <div className="hidden bg-white/[0.07] lg:block" aria-hidden="true" />

              {/* ── Right — why-this-wins checklist panel ── */}
              <div className="border-t border-white/[0.07] bg-white/[0.02] p-5 sm:p-7 lg:border-t-0 lg:p-8">
                <Reveal delay={0.2}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {whyTitle}
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {spec.valueProps.slice(0, 3).map((v) => (
                      <li key={v.title} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${a.tile}`}
                        >
                          <Icon name={v.icon} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white">{v.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
                            {v.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 flex items-start gap-2 border-t border-white/[0.06] pt-3.5 text-[11px] leading-relaxed text-slate-500">
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

            {/* Full-width stat strip — the card's footer band */}
            <Reveal delay={0.26}>
              <div className="grid grid-cols-3 divide-x divide-white/[0.07] border-t border-white/[0.07] bg-white/[0.03]">
                {spec.heroStats.map((s) => (
                  <div key={s.label} className="px-2 py-3.5 text-center sm:px-4 sm:py-4">
                    <p className={`text-lg font-bold tracking-tight sm:text-xl ${a.idxSolid}`}>
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      {s.label}
                    </p>
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
