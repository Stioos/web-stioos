"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import type { TalentStripOption } from "@/data/talent-solutions";
import type { TalentSubSeed } from "@/data/pages/talent-sub-pages";

// ============================================================
// TALENT STRIP MENU — secondary-header flyout for one Talent
// Solutions option pill (shown ONLY on /talent-solutions* pages).
// Header: option identity + explore link. Body: the option's 8
// sub-pages as a horizontal 4×2 grid of deep-dive cards. Footer:
// pillar + count. Portalled & fixed-positioned exactly like the
// division strip menus (the strip container clips absolute children).
// ============================================================

const ACCENT: Record<
  TalentStripOption["accent"],
  { heading: string; tile: string; chip: string; link: string; dot: string }
> = {
  blue: {
    heading: "text-blue-300",
    tile: "bg-blue-400/10 text-blue-300 ring-blue-400/25",
    chip: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    link: "text-blue-300 hover:text-blue-200",
    dot: "bg-blue-400",
  },
  emerald: {
    heading: "text-emerald-300",
    tile: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    link: "text-emerald-300 hover:text-emerald-200",
    dot: "bg-emerald-400",
  },
  orange: {
    heading: "text-orange-300",
    tile: "bg-orange-400/10 text-orange-300 ring-orange-400/25",
    chip: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    link: "text-orange-300 hover:text-orange-200",
    dot: "bg-orange-400",
  },
};

export function TalentStripMenu({
  anchorEl,
  option,
  subs,
  activeSubSlug,
  align,
  onClose,
  onKeepAlive,
  onScheduleClose,
}: {
  anchorEl: HTMLDivElement | null;
  option: TalentStripOption;
  subs: TalentSubSeed[];
  /** slug of the sub-page currently viewed (its card is highlighted) */
  activeSubSlug?: string;
  align: "left" | "center" | "right";
  onClose: () => void;
  onKeepAlive: () => void;
  onScheduleClose: () => void;
}) {
  const PANEL_W = 1120;
  const MARGIN = 12;
  const style: React.CSSProperties | undefined = (() => {
    if (!anchorEl || typeof window === "undefined") return undefined;
    const effW = Math.min(PANEL_W, window.innerWidth - MARGIN * 2);
    const rect = anchorEl.getBoundingClientRect();
    const rawLeft =
      align === "right"
        ? rect.right - effW
        : align === "center"
          ? rect.left + rect.width / 2 - effW / 2
          : rect.left;
    const left = Math.min(
      Math.max(rawLeft, MARGIN),
      Math.max(MARGIN, window.innerWidth - effW - MARGIN)
    );
    return { top: rect.bottom + 10, left };
  })();

  if (!style) return null;

  const accent = ACCENT[option.accent];

  return (
    <div
      data-flyout-panel
      className="fixed z-[60]"
      style={style}
      onMouseEnter={onKeepAlive}
      onMouseLeave={onScheduleClose}
    >
      <div
        className="flyout-panel max-h-[calc(100vh-8.5rem)] w-[1120px] max-w-[calc(100vw-1.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-brand-navy text-white shadow-2xl shadow-black/60 ring-1 ring-white/[0.06]"
        role="region"
        aria-label={`${option.name} sub-pages`}
      >
        {/* Panel header — option identity */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-6 py-3">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
              accent.tile
            )}
          >
            <option.icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold">{option.name}</p>
              <span
                className={cn(
                  "hidden shrink-0 rounded border px-1.5 py-0.5 text-[9.5px] font-semibold sm:inline-flex",
                  accent.chip
                )}
              >
                {option.tag}
              </span>
            </div>
            <p className="truncate text-[11px] text-slate-400">{option.description}</p>
          </div>
          <Link
            href={`/talent-solutions/${option.slug}`}
            onClick={onClose}
            className={cn(
              "hidden shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold transition-colors hover:bg-white/[0.09] sm:inline-flex",
              "text-slate-200"
            )}
          >
            Explore option
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Body — 8 sub-pages in a horizontal 4×2 grid */}
        <div className="px-6 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Deep-dive pages · {subs.length}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {subs.map((sub, i) => {
              const isActive = sub.slug === activeSubSlug;
              return (
                <Link
                  key={sub.slug}
                  href={`/talent-solutions/${option.slug}/${sub.slug}`}
                  onClick={onClose}
                  className={cn(
                    "group/sub flex flex-col rounded-xl border p-3 transition-all duration-150",
                    isActive
                      ? "border-amber-400/50 bg-amber-400/[0.08] shadow-[0_0_18px_-8px] shadow-amber-400/40"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.05]"
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-150 group-hover/sub:scale-105",
                        accent.tile
                      )}
                    >
                      <Icon name={sub.icon} className="h-[15px] w-[15px]" />
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-600">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-2 block text-[12px] font-bold leading-snug transition-colors",
                      isActive
                        ? "text-amber-300"
                        : "text-white group-hover/sub:text-amber-300"
                    )}
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {sub.title}
                  </span>
                  <span
                    className="mt-1 block text-[10px] leading-relaxed text-slate-500"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {sub.blurb}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[10px] font-bold text-slate-400 transition-colors group-hover/sub:text-amber-300">
                    Open page
                    <ArrowRight className="h-3 w-3 transition-transform group-hover/sub:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Panel footer */}
        <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-6 py-2.5">
          <span className="flex items-center gap-2 text-[11px] text-slate-500">
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", accent.dot)} />
            {option.pillar} · {subs.length} deep-dive pages
          </span>
          <Link
            href={`/talent-solutions/${option.slug}`}
            onClick={onClose}
            className={cn("text-[11px] font-semibold transition-colors", accent.link)}
          >
            View the full option →
          </Link>
        </div>
      </div>
    </div>
  );
}
