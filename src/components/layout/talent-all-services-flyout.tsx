"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import {
  TALENT_COLUMNS,
  type TalentAccent,
  type TalentColumn,
  type TalentItem,
} from "@/data/talent-solutions";
import { getTalentSubSeeds } from "@/data/pages/talent-sub-pages";
import type { TalentSubSeed } from "@/data/pages/talent-sub-pages";

// ============================================================
// TALENT ALL SERVICES FLYOUT — the LEFT-most pill in the Talent
// Solutions secondary header. Opens a wide mega menu (Browse-
// Categories pattern) showing ALL 9 talent services in three
// accent-colored columns (Talent Development · Workforce
// Solutions · Assessment & Placements).
//
// Interactive layout (two panels side-by-side):
//   LEFT  — 3-column grid of service cards. Hover a card to feed
//           the right panel.
//   RIGHT — the hovered service's 8 deep-dive sub-pages, listed
//           vertically with icon + title + blurb. Defaults to the
//           first service so the panel is never empty.
//
// Click a service card → /talent-solutions/<service-slug>
// Click a sub-page row → /talent-solutions/<service>/<sub>
//
// Portalled & fixed-positioned exactly like the other strip
// flyouts (the strip container clips absolute children).
// ============================================================

const ACCENT: Record<
  TalentAccent,
  {
    heading: string;
    tile: string;
    chip: string;
    link: string;
    dot: string;
    cardActiveBorder: string;
    cardActiveBg: string;
  }
> = {
  blue: {
    heading: "text-blue-300",
    tile: "bg-blue-400/10 text-blue-300 ring-blue-400/25",
    chip: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    link: "text-blue-300 hover:text-blue-200",
    dot: "bg-blue-400",
    cardActiveBorder: "border-blue-400/50",
    cardActiveBg: "bg-blue-400/[0.08]",
  },
  emerald: {
    heading: "text-emerald-300",
    tile: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    link: "text-emerald-300 hover:text-emerald-200",
    dot: "bg-emerald-400",
    cardActiveBorder: "border-emerald-400/50",
    cardActiveBg: "bg-emerald-400/[0.08]",
  },
  orange: {
    heading: "text-orange-300",
    tile: "bg-orange-400/10 text-orange-300 ring-orange-400/25",
    chip: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    link: "text-orange-300 hover:text-orange-200",
    dot: "bg-orange-400",
    cardActiveBorder: "border-orange-400/50",
    cardActiveBg: "bg-orange-400/[0.08]",
  },
};

// Flatten TALENT_COLUMNS into a single list of (column, item) pairs so
// we can track the hovered one across all three columns.
type FlatRow = {
  column: TalentColumn;
  item: TalentItem;
  serviceSlug: string;
};

const FLAT_ROWS: FlatRow[] = TALENT_COLUMNS.flatMap((column) =>
  column.items.map((item) => ({
    column,
    item,
    serviceSlug: item.href.replace("/talent-solutions/", ""),
  }))
);

const FIRST_ROW = FLAT_ROWS[0];

export function TalentAllServicesFlyout({
  anchorEl,
  align,
  activeServiceSlug,
  onClose,
  onKeepAlive,
  onScheduleClose,
}: {
  /** the hovered pill element — panel anchors below it */
  anchorEl: HTMLDivElement | null;
  align: "left" | "center" | "right";
  /** slug of the service currently viewed (its card + sub row highlighted) */
  activeServiceSlug?: string;
  onClose: () => void;
  onKeepAlive: () => void;
  onScheduleClose: () => void;
}) {
  // Hovered service — defaults to the first row so the right panel
  // is never half-empty. Falls back to the active service if the
  // visitor is on a service detail page.
  const initialSlug =
    activeServiceSlug ?? FIRST_ROW.serviceSlug;
  const [hoveredSlug, setHoveredSlug] = useState<string>(initialSlug);

  const hoveredRow =
    FLAT_ROWS.find((r) => r.serviceSlug === hoveredSlug) ?? FIRST_ROW;
  const hoveredAccent = ACCENT[hoveredRow.column.accent];
  const subs: TalentSubSeed[] = getTalentSubSeeds(hoveredRow.serviceSlug);

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
    // Flush against the secondary header's bottom edge — no gap.
    // The panel visually continues the strip downward.
    return { top: rect.bottom, left };
  })();

  if (!style) return null;

  return createPortal(
    <div
      data-flyout-panel
      className="fixed z-[60]"
      style={style}
      onMouseEnter={onKeepAlive}
      onMouseLeave={onScheduleClose}
    >
      <div
        className="flyout-panel max-h-[calc(100vh-8.5rem)] w-[1120px] max-w-[calc(100vw-1.5rem)] overflow-y-auto overscroll-contain rounded-b-2xl border border-t-0 border-white/10 bg-brand-navy text-white shadow-2xl shadow-black/60 ring-1 ring-white/[0.06]"
        role="region"
        aria-label="All talent solutions services and deep-dive pages"
      >
        {/* Panel header */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-gradient-to-r from-amber-400/[0.06] via-orange-500/[0.04] to-transparent px-6 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-brand-ink shadow-[0_0_18px_-4px] shadow-amber-500/60 ring-1 ring-amber-400/40">
            <Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold tracking-tight text-amber-700 dark:text-amber-200">
              Premium Talent Solutions
            </p>
            <p className="truncate text-[11px] text-slate-600 dark:text-slate-400">
              9 services · 72 deep-dive pages · one partner from training to placement
            </p>
          </div>
          <Link
            href="/talent-solutions"
            onClick={() => setTimeout(onClose, 60)}
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-amber-400/50 bg-gradient-to-br from-amber-400/25 to-orange-500/15 px-3 py-1.5 text-[11px] font-bold text-amber-700 transition-colors hover:from-amber-400/40 hover:to-orange-500/25 dark:text-amber-200 sm:inline-flex"
          >
            Explore overview
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Body — two-panel split (SWAPPED per user request):
            LEFT  — all 9 services as a vertical list grouped by the
                    three pillars. Hovering a row feeds the RIGHT panel.
            RIGHT — the hovered service's 8 deep-dive sub-pages as a
                    3-column card grid. */}
        <div className="grid gap-0 lg:grid-cols-[1fr_1px_1.55fr]">
          {/* ── LEFT — all 9 services as a vertical list grouped by pillar ── */}
          <div className="px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Services · 9
              </p>
              <Link
                href={hoveredRow.item.href}
                onClick={() => setTimeout(onClose, 60)}
                className={cn(
                  "shrink-0 text-[10px] font-semibold transition-colors",
                  hoveredAccent.link
                )}
              >
                View active →
              </Link>
            </div>

            <ul className="thin-scrollbar mt-3 flex max-h-[380px] flex-col gap-3 overflow-y-auto pr-1">
              {TALENT_COLUMNS.map((col) => {
                const accent = ACCENT[col.accent];
                return (
                  <li key={col.title} className="flex flex-col gap-1.5">
                    <p
                      className={cn(
                        "px-1 text-[9px] font-bold uppercase tracking-[0.16em]",
                        accent.heading
                      )}
                    >
                      {col.title}
                    </p>
                    {col.items.map((item) => {
                      const serviceSlug = item.href.replace(
                        "/talent-solutions/",
                        ""
                      );
                      const isActive = serviceSlug === activeServiceSlug;
                      const isHovered = serviceSlug === hoveredSlug;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setTimeout(onClose, 60)}
                          onMouseEnter={() => setHoveredSlug(serviceSlug)}
                          onFocus={() => setHoveredSlug(serviceSlug)}
                          title={item.description}
                          className={cn(
                            "group/svc flex items-start gap-2.5 rounded-lg border p-2 transition-all duration-150",
                            isHovered
                              ? cn(accent.cardActiveBorder, accent.cardActiveBg, "shadow-[0_0_18px_-8px] shadow-amber-400/30")
                              : "border-transparent hover:border-white/[0.12] hover:bg-white/[0.04]",
                            isActive && "ring-1 ring-amber-400/40"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1 transition-transform duration-150 group-hover/svc:scale-105",
                              accent.tile
                            )}
                          >
                            <item.icon className="h-[14px] w-[14px]" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "block truncate text-[11.5px] font-bold leading-snug transition-colors",
                                  isHovered
                                    ? "text-amber-300"
                                    : "text-slate-200 group-hover/svc:text-white"
                                )}
                              >
                                {item.name}
                              </span>
                              <span
                                className={cn(
                                  "shrink-0 rounded border px-1 py-0.5 text-[8px] font-semibold",
                                  accent.chip
                                )}
                              >
                                {item.tag}
                              </span>
                            </div>
                            <span
                              className="mt-0.5 block text-[10px] leading-relaxed text-slate-500"
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.description}
                            </span>
                          </div>
                          <ChevronRight
                            className={cn(
                              "mt-2 h-3 w-3 shrink-0 transition-all duration-150",
                              isHovered
                                ? "translate-x-0 text-amber-300 opacity-100"
                                : "-translate-x-1 text-slate-600 opacity-0 group-hover/svc:translate-x-0 group-hover/svc:text-amber-300 group-hover/svc:opacity-100"
                            )}
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    })}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 1px divider rail (lg only) */}
          <div className="hidden bg-white/[0.07] lg:block" aria-hidden="true" />

          {/* ── RIGHT — hovered service's 8 deep-dive sub-pages (card grid) ── */}
          <div className="border-t border-white/[0.07] bg-white/[0.02] px-5 py-4 lg:border-t-0">
            <div className="flex items-baseline justify-between gap-3">
              <p
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.16em]",
                  hoveredAccent.heading
                )}
              >
                Deep-dive pages · {subs.length}
              </p>
              <p className="truncate text-[10.5px] font-medium text-slate-400">
                Hover a service → preview its 8 deep-dive pages
              </p>
            </div>

            {/* Active service identity tile */}
            <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
                  hoveredAccent.tile
                )}
              >
                <hoveredRow.item.icon className="h-[15px] w-[15px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold leading-snug text-white">
                  {hoveredRow.item.name}
                </p>
                <p
                  className="mt-0.5 block text-[10px] leading-relaxed text-slate-400"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {hoveredRow.item.description}
                </p>
              </div>
              <Link
                href={hoveredRow.item.href}
                onClick={() => setTimeout(onClose, 60)}
                className={cn(
                  "shrink-0 text-[10px] font-semibold transition-colors",
                  hoveredAccent.link
                )}
              >
                Open →
              </Link>
            </div>

            {/* Deep-dive pages rendered as a 3-column card grid */}
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {subs.map((sub, i) => {
                return (
                  <Link
                    key={sub.slug}
                    href={`/talent-solutions/${hoveredRow.serviceSlug}/${sub.slug}`}
                    onClick={() => setTimeout(onClose, 60)}
                    className={cn(
                      "group/sub flex flex-col rounded-xl border p-2.5 transition-all duration-150",
                      "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.05]"
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-150 group-hover/sub:scale-105",
                          hoveredAccent.tile
                        )}
                      >
                        <Icon name={sub.icon} className="h-[15px] w-[15px]" />
                      </span>
                      <span className="font-mono text-[9px] font-bold text-slate-600">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-2 block text-[11px] font-bold leading-snug transition-colors text-white group-hover/sub:text-amber-300"
                      )}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {sub.title}
                    </span>
                    <span
                      className="mt-1 block text-[9.5px] leading-relaxed text-slate-500"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {sub.blurb}
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[9px] font-bold text-slate-400 transition-colors group-hover/sub:text-amber-300">
                      Open page
                      <ArrowRight className="h-3 w-3 transition-transform group-hover/sub:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel footer */}
        <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-6 py-2.5">
          <span className="flex items-center gap-2 text-[11px] text-slate-500">
            <span
              aria-hidden="true"
              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", hoveredAccent.dot)}
            />
            {hoveredRow.column.title} · {hoveredRow.item.name}
          </span>
          <Link
            href="/talent-solutions"
            onClick={() => setTimeout(onClose, 60)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 transition-colors hover:text-amber-200"
          >
            View all talent solutions →
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
