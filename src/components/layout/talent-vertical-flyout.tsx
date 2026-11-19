"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TalentStripGroup } from "@/data/talent-strip-groups";

// ============================================================
// TALENT VERTICAL FLYOUT — secondary-header dropdown for one
// Talent Solutions GROUP pill (3 candidate + 3 employer = 6
// pills total in the strip).
//
// KEY DIFFERENCE vs the old TalentStripMenu:
//   • Opens on the RIGHT SIDE of the hovered pill, NOT below it.
//     The panel's left edge = the pill's right edge, and its
//     vertical center aligns with the pill's vertical center.
//   • Renders a vertical list of the group's mapped services
//     (not a 4×2 grid of deep-dive sub-pages).
//   • Each row links to an EXISTING talent option detail page
//     (/talent-solutions/<service-slug>) so nothing is broken
//     while the new group pages are still placeholders.
//
// Portalled & fixed-positioned like the other strip flyouts —
// the strip container clips absolute children.
// ============================================================

const ACCENT: Record<
  TalentStripGroup["accent"],
  {
    heading: string;
    tile: string;
    chip: string;
    link: string;
    dot: string;
    chevron: string;
    panelBorder: string;
    panelGlow: string;
  }
> = {
  blue: {
    heading: "text-blue-300",
    tile: "bg-blue-400/10 text-blue-300 ring-blue-400/25",
    chip: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    link: "text-blue-300 hover:text-blue-200",
    dot: "bg-blue-400",
    chevron: "text-blue-400/60",
    panelBorder: "ring-blue-400/20",
    panelGlow: "shadow-blue-500/10",
  },
  emerald: {
    heading: "text-emerald-300",
    tile: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    link: "text-emerald-300 hover:text-emerald-200",
    dot: "bg-emerald-400",
    chevron: "text-emerald-400/60",
    panelBorder: "ring-emerald-400/20",
    panelGlow: "shadow-emerald-500/10",
  },
  orange: {
    heading: "text-orange-300",
    tile: "bg-orange-400/10 text-orange-300 ring-orange-400/25",
    chip: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    link: "text-orange-300 hover:text-orange-200",
    dot: "bg-orange-400",
    chevron: "text-orange-400/60",
    panelBorder: "ring-orange-400/20",
    panelGlow: "shadow-orange-500/10",
  },
};

const SIDE_LABEL: Record<TalentStripGroup["side"], string> = {
  candidate: "For Job Seekers",
  employer: "For Employers",
};

export function TalentVerticalFlyout({
  anchorEl,
  group,
  activeServiceSlug,
  onClose,
  onKeepAlive,
  onScheduleClose,
}: {
  /** the hovered pill element — the panel anchors to its right edge */
  anchorEl: HTMLDivElement | null;
  group: TalentStripGroup;
  /** slug of the service currently viewed (its row is highlighted) */
  activeServiceSlug?: string;
  onClose: () => void;
  onKeepAlive: () => void;
  onScheduleClose: () => void;
}) {
  const PANEL_W = 380;
  const MARGIN = 12;
  const style: React.CSSProperties | undefined = (() => {
    if (!anchorEl || typeof window === "undefined") return undefined;
    const rect = anchorEl.getBoundingClientRect();
    const vw = window.innerWidth;

    // Default: panel sits to the RIGHT of the pill (left = pill.right + gap).
    // If the pill is too close to the right edge of the viewport, fall back
    // to opening BELOW the pill (left-aligned with the pill) so the panel
    // never gets clipped off-screen.
    const rightGap = vw - rect.right;
    const openRight = rightGap >= PANEL_W + MARGIN;

    if (openRight) {
      const left = Math.min(rect.right + 12, vw - PANEL_W - MARGIN);
      // Vertically center on the pill's center, clamped to viewport.
      const panelH = Math.min(440, window.innerHeight - 32);
      const top = Math.max(
        MARGIN,
        Math.min(
          rect.top + rect.height / 2 - panelH / 2,
          window.innerHeight - panelH - MARGIN
        )
      );
      return { top, left };
    }

    // Fallback: below the pill, left-aligned.
    const left = Math.min(rect.left, vw - PANEL_W - MARGIN);
    return { top: rect.bottom + 10, left: Math.max(MARGIN, left) };
  })();

  if (!style) return null;

  const accent = ACCENT[group.accent];

  return (
    <div
      data-flyout-panel
      className="fixed z-[60]"
      style={style}
      onMouseEnter={onKeepAlive}
      onMouseLeave={onScheduleClose}
    >
      <div
        className={cn(
          "flyout-panel w-[380px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-white/10 bg-brand-navy text-white shadow-2xl shadow-black/60 ring-1",
          accent.panelBorder,
          accent.panelGlow
        )}
        role="region"
        aria-label={`${group.name} services`}
      >
        {/* Panel header — group identity + side chip */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-5 py-3.5">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1",
              accent.tile
            )}
          >
            <group.icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-bold">{group.name}</p>
              <span
                className={cn(
                  "hidden shrink-0 rounded border px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] sm:inline-flex",
                  accent.chip
                )}
              >
                {SIDE_LABEL[group.side]}
              </span>
            </div>
            <p className="truncate text-[11px] text-slate-400">{group.tagline}</p>
          </div>
        </div>

        {/* Body — vertical list of the group's mapped services */}
        <div className="max-h-[360px] overflow-y-auto overscroll-contain px-3 py-3">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Explore the services
          </p>
          <ul className="flex flex-col gap-1">
            {group.services.map((svcRow, i) => {
              const isActive = svcRow.slug === activeServiceSlug;
              return (
                <li key={svcRow.slug}>
                  <Link
                    href={`/talent-solutions/${svcRow.slug}`}
                    onClick={() => setTimeout(onClose, 60)}
                    className={cn(
                      "group/svc flex items-start gap-3 rounded-xl border p-2.5 transition-all duration-150",
                      isActive
                        ? "border-amber-400/50 bg-amber-400/[0.08] shadow-[0_0_18px_-8px] shadow-amber-400/40"
                        : "border-transparent hover:border-white/[0.12] hover:bg-white/[0.04]"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-150 group-hover/svc:scale-105",
                        accent.tile
                      )}
                    >
                      <svcRow.icon className="h-[16px] w-[16px]" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[12.5px] font-bold leading-snug transition-colors",
                            isActive
                              ? "text-amber-300"
                              : "text-white group-hover/svc:text-amber-300"
                          )}
                        >
                          {svcRow.stripLabel}
                        </span>
                        <span className="font-mono text-[9px] font-bold text-slate-600">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p
                        className="mt-0.5 block text-[10.5px] leading-relaxed text-slate-400"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {svcRow.description}
                      </p>
                    </div>
                    <ChevronRight
                      className={cn(
                        "mt-2 h-3.5 w-3.5 shrink-0 transition-all duration-150",
                        accent.chevron,
                        "group-hover/svc:translate-x-0.5 group-hover/svc:text-amber-300"
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Panel footer — view the group page (placeholder for now) */}
        <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-5 py-2.5">
          <span className="flex items-center gap-2 text-[11px] text-slate-500">
            <span
              aria-hidden="true"
              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", accent.dot)}
            />
            {group.services.length} services in this group
          </span>
          <Link
            href={`/talent-solutions/${group.slug}`}
            onClick={() => setTimeout(onClose, 60)}
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold transition-colors",
              accent.link
            )}
          >
            View the group page
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
