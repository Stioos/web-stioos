"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  TALENT_COLUMNS,
  TALENT_ENGAGE,
  type TalentAccent,
} from "@/data/talent-solutions";
import { cn } from "@/lib/utils";

// ============================================================
// ACCENT SYSTEM — static class strings (Tailwind-scannable)
// ============================================================

const ACCENT: Record<
  TalentAccent,
  { heading: string; tile: string; chip: string }
> = {
  blue: {
    heading: "text-blue-400",
    tile: "bg-blue-500/10 text-blue-300 ring-blue-400/25",
    chip: "border-blue-400/30 bg-blue-400/10 text-blue-300",
  },
  emerald: {
    heading: "text-emerald-400",
    tile: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/25",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
  orange: {
    heading: "text-orange-400",
    tile: "bg-orange-500/10 text-orange-300 ring-orange-400/25",
    chip: "border-orange-400/30 bg-orange-400/10 text-orange-300",
  },
};

// Audience chip accents for the ENGAGE band (static strings)
const ENGAGE_CHIPS = [
  "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  "border-violet-400/30 bg-violet-400/10 text-violet-300",
  "border-amber-400/30 bg-amber-400/10 text-amber-300",
] as const;

// Featured-rail proof points
const RAIL_STATS = [
  { value: "2M+", label: "Talent pool" },
  { value: "96%", label: "Placement rate" },
  { value: "48h", label: "Avg. shortlist" },
] as const;

// ============================================================
// TALENT MEGA MENU — compact modern flyout for the "Talent
// Solutions" trigger: featured rail (engages job seeker +
// employer) + three pillar columns + engagement band.
// Sized to fit laptop screens (<= ~768px viewport height).
// ============================================================

export function TalentMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div
      id="stioos-talent-mega"
      data-flyout-panel
      role="region"
      aria-label="Talent solutions"
      className="flyout-panel absolute inset-x-4 top-16 z-[55] mx-auto mt-2 max-h-[calc(100dvh-8.5rem)] max-w-[1100px] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/60 ring-1 ring-white/[0.06] lg:top-[72px]"
    >
      <div className="grid xl:grid-cols-[272px_1fr]">
        {/* ── Featured rail: audience picker that converts both sides ── */}
        <aside
          aria-label="Talent highlights"
          className="relative hidden flex-col justify-between gap-4 overflow-hidden border-r border-white/[0.07] bg-gradient-to-b from-amber-400/[0.10] via-violet-500/[0.05] to-transparent p-4 xl:flex"
        >
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-400/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-amber-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Talent Intelligence
            </span>
            <h3 className="mt-2.5 text-[15px] font-bold leading-snug text-white">
              Talent that moves business forward.
            </h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
              Train, source and deploy job-ready professionals — one partner
              from assessment to placement.
            </p>
          </div>

          <div className="relative grid grid-cols-3 gap-1.5">
            {RAIL_STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-1 py-1.5 text-center"
              >
                <p className="text-[13px] font-bold text-amber-300">{s.value}</p>
                <p className="mt-0.5 text-[8.5px] font-medium uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="relative flex flex-col gap-1.5">
            <Link
              href="/talent-solutions#placements"
              onClick={() => setTimeout(onClose, 60)}
              className="group inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-brand-ink transition-colors hover:bg-amber-300"
            >
              <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
              I&apos;m a Job Seeker
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="/talent-solutions#staffing-solutions"
              onClick={() => setTimeout(onClose, 60)}
              className="group inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors hover:border-violet-400/40 hover:bg-white/[0.08] hover:text-white"
            >
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              I&apos;m an Employer
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </aside>

        {/* ── Three columns of grouped link cards ── */}
        <div className="grid gap-1 p-3.5 sm:grid-cols-3">
          {TALENT_COLUMNS.map((col) => {
            const accent = ACCENT[col.accent];
            return (
              <div key={col.title} className="flex flex-col">
                <p
                  className={cn(
                    "px-2 pb-2 pt-0.5 text-[10px] font-bold uppercase tracking-[0.14em]",
                    accent.heading
                  )}
                >
                  {col.title}
                </p>
                {col.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setTimeout(onClose, 60)}
                    className="group flex items-start gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.05]"
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
                        accent.tile
                      )}
                    >
                      <item.icon className="h-[15px] w-[15px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold text-slate-100 group-hover:text-white">
                        {item.name}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 inline-flex w-fit rounded border px-1.5 py-0.5 text-[9.5px] font-semibold",
                          accent.chip
                        )}
                      >
                        {item.tag}
                      </span>
                      <span className="mt-1 block text-[10.5px] leading-relaxed text-slate-500 line-clamp-2">
                        {item.description}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Divider + ENGAGE band (dual-audience conversion cards) ── */}
      <div className="border-t border-white/[0.07]" />
      <div className="grid gap-2 p-3.5 pt-2.5 md:grid-cols-3">
        {TALENT_ENGAGE.map((tile, i) => (
          <Link
            key={tile.name}
            href={tile.href}
            onClick={() => setTimeout(onClose, 60)}
            className="group flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:border-amber-400/40 hover:bg-amber-400/[0.06]"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-slate-300 ring-1 ring-white/10 transition-colors group-hover:bg-amber-400/10 group-hover:text-amber-300 group-hover:ring-amber-400/25">
                <tile.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span
                className={cn(
                  "inline-flex rounded border px-1.5 py-0.5 text-[9.5px] font-semibold",
                  ENGAGE_CHIPS[i]
                )}
              >
                {tile.audience}
              </span>
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-slate-100 group-hover:text-white">
                {tile.name}
              </span>
              <span className="mt-0.5 block text-[10.5px] leading-relaxed text-slate-500 line-clamp-2">
                {tile.description}
              </span>
            </span>
            <span className="mt-auto inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-300">
              {tile.cta}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>

      {/* ── Footer band: page link ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.07] bg-white/[0.02] px-4 py-2.5">
        <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
          <Briefcase className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
          One partner from assessment to placement — trusted by 500+ employers.
        </p>
        <Link
          href="/talent-solutions"
          onClick={() => setTimeout(onClose, 60)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[10.5px] font-semibold text-amber-300 transition-colors hover:bg-amber-400/20"
        >
          Explore all talent solutions
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
