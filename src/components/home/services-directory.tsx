"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/shared/icon";
import {
  SERVICES_DIRECTORY,
  SERVICES_DIRECTORY_TOTAL,
  type DirectoryDivision,
} from "@/data/services-directory";

// ============================================================
// SERVICES DIRECTORY — premium 3-column grid (3×3 = 9 divisions,
// 6 services each, 54 shown). Rendered above the trust marquee
// on the home page.
//
// Design language:
//   • Centered title + tagline (Reveal)
//   • 3-column grid on lg (3 rows of 3 divisions = 9 total)
//   • Each card: gradient icon tile + division name + count badge,
//     then a list of 6 services (small accent icon + 2-line name +
//     hover arrow)
//   • Subtle accent-tinted card backgrounds, gradient border ring on
//     hover, lift on hover (-translate-y-1), shadow ring
//   • Equal-height cards via h-full + flex layout
//   • Service icons rendered via the shared <Icon name=… /> component
// ============================================================

// Accent → gradient (for the division header icon tile).
// Each division gets its own colored tile so the 3×3 grid reads as a
// vibrant mosaic at a glance.
const ACCENT_GRADIENT: Record<
  DirectoryDivision["accent"],
  string
> = {
  violet: "from-violet-500 to-purple-600",
  amber: "from-amber-500 to-orange-600",
  sky: "from-sky-500 to-blue-600",
  fuchsia: "from-fuchsia-500 to-pink-600",
  rose: "from-rose-500 to-red-600",
  emerald: "from-emerald-500 to-teal-600",
  orange: "from-orange-500 to-amber-600",
  teal: "from-teal-500 to-cyan-600",
};

// Accent → soft card background tint (low opacity wash)
const ACCENT_CARD_TINT: Record<
  DirectoryDivision["accent"],
  string
> = {
  violet: "bg-violet-500/[0.04]",
  amber: "bg-amber-500/[0.04]",
  sky: "bg-sky-500/[0.04]",
  fuchsia: "bg-fuchsia-500/[0.04]",
  rose: "bg-rose-500/[0.04]",
  emerald: "bg-emerald-500/[0.04]",
  orange: "bg-orange-500/[0.04]",
  teal: "bg-teal-500/[0.04]",
};

// Accent → brightened border on hover
const ACCENT_HOVER_BORDER: Record<
  DirectoryDivision["accent"],
  string
> = {
  violet: "hover:border-violet-400/40",
  amber: "hover:border-amber-400/40",
  sky: "hover:border-sky-400/40",
  fuchsia: "hover:border-fuchsia-400/40",
  rose: "hover:border-rose-400/40",
  emerald: "hover:border-emerald-400/40",
  orange: "hover:border-orange-400/40",
  teal: "hover:border-teal-400/40",
};

// Accent → small service-row icon color
const ACCENT_SVC_ICON: Record<
  DirectoryDivision["accent"],
  string
> = {
  violet: "text-violet-400",
  amber: "text-amber-400",
  sky: "text-sky-400",
  fuchsia: "text-fuchsia-400",
  rose: "text-rose-400",
  emerald: "text-emerald-400",
  orange: "text-orange-400",
  teal: "text-teal-400",
};

// Accent → hover text color for service rows
const ACCENT_SVC_HOVER: Record<
  DirectoryDivision["accent"],
  string
> = {
  violet: "group/svc:hover:text-violet-300",
  amber: "group/svc:hover:text-amber-300",
  sky: "group/svc:hover:text-sky-300",
  fuchsia: "group/svc:hover:text-fuchsia-300",
  rose: "group/svc:hover:text-rose-300",
  emerald: "group/svc:hover:text-emerald-300",
  orange: "group/svc:hover:text-orange-300",
  teal: "group/svc:hover:text-teal-300",
};

// Accent → count badge chip
const ACCENT_BADGE: Record<
  DirectoryDivision["accent"],
  string
> = {
  violet: "bg-violet-500/10 text-violet-300 ring-1 ring-inset ring-violet-400/25",
  amber: "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-400/25",
  sky: "bg-sky-500/10 text-sky-300 ring-1 ring-inset ring-sky-400/25",
  fuchsia: "bg-fuchsia-500/10 text-fuchsia-300 ring-1 ring-inset ring-fuchsia-400/25",
  rose: "bg-rose-500/10 text-rose-300 ring-1 ring-inset ring-rose-400/25",
  emerald: "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/25",
  orange: "bg-orange-500/10 text-orange-300 ring-1 ring-inset ring-orange-400/25",
  teal: "bg-teal-500/10 text-teal-300 ring-1 ring-inset ring-teal-400/25",
};

export function ServicesDirectory() {
  return (
    <section
      id="services-directory"
      className="scroll-mt-36 border-t border-white/[0.06] bg-brand-ink py-16 md:py-24"
      aria-label="Our services directory"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Title + tagline — centered, premium */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber-400">Our Services</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.5rem]">
            One partner.{" "}
            <span className="text-amber-400">Nine divisions.</span>{" "}
            Fifty-four services.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Our commitment is to deliver exactly what you need — and exceed
            your expectations. Explore {SERVICES_DIRECTORY_TOTAL}{" "}
            SEO-optimized services across {SERVICES_DIRECTORY.length} divisions,
            each staffed by senior practitioners and backed by delivery SLAs.
          </p>
        </Reveal>

        {/* Divider line framing the tagline */}
        <div
          className="mx-auto mt-6 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent"
          aria-hidden="true"
        />

        {/* 3-column grid of divisions — 3×3 = 9 divisions. All cards
            share equal column width and equal height via h-full + flex,
            so the grid reads as a clean mosaic regardless of service
            title length. */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DIRECTORY.map((division) => {
              const tileGradient = ACCENT_GRADIENT[division.accent];
              const cardTint = ACCENT_CARD_TINT[division.accent];
              const hoverBorder = ACCENT_HOVER_BORDER[division.accent];
              const svcIcon = ACCENT_SVC_ICON[division.accent];
              const svcHover = ACCENT_SVC_HOVER[division.accent];
              const badgeCls = ACCENT_BADGE[division.accent];
              const DivisionIcon = division.icon;

              return (
                <div
                  key={division.id}
                  className={cn(
                    "group/div flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] p-5 transition-all duration-200",
                    "shadow-[0_2px_18px_-6px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_18px_44px_-18px_rgba(0,0,0,0.65)]",
                    cardTint,
                    hoverBorder
                  )}
                >
                  {/* Division header — gradient icon tile + name + count badge */}
                  <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                    {/* Gradient icon tile (rounded-xl, accent gradient bg) */}
                    <div
                      className={cn(
                        "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br shadow-lg transition-transform duration-200 group-hover/div:scale-105",
                        tileGradient
                      )}
                      aria-hidden="true"
                    >
                      {/* Inner grid texture for premium feel */}
                      <div className="absolute inset-0 surface-grid opacity-50" />
                      {/* Top-right glow */}
                      <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/25 blur-md" />
                      <DivisionIcon className="relative h-5 w-5 text-white" strokeWidth={2} />
                    </div>

                    {/* Division name + count badge */}
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
                      <h3 className="text-[14px] font-bold uppercase tracking-[0.08em] text-white leading-tight">
                        {division.name}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          badgeCls
                        )}
                      >
                        {division.services.length} services
                      </span>
                    </div>
                  </div>

                  {/* Services list — 6 rows with accent icon + truncated name + hover arrow */}
                  <ul className="mt-4 flex flex-1 flex-col gap-1.5">
                    {division.services.map((service) => (
                      <li key={service.name} className="flex-1">
                        <Link
                          href={service.href}
                          title={service.description}
                          className={cn(
                            "group/svc flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors",
                            "hover:bg-white/[0.04]",
                            svcHover
                          )}
                        >
                          {/* Small accent-colored service icon */}
                          <span
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04] ring-1 ring-inset ring-white/[0.06] transition-colors",
                              svcIcon
                            )}
                            aria-hidden="true"
                          >
                            <Icon
                              name={service.icon}
                              className="h-3.5 w-3.5"
                            />
                          </span>
                          {/* Service name — clamp to 2 lines */}
                          <span
                            className="min-w-0 flex-1 text-[12.5px] font-medium leading-snug text-slate-300 transition-colors line-clamp-2 group-hover/svc:text-white"
                          >
                            {service.name}
                          </span>
                          {/* Hover arrow */}
                          <ArrowRight
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600 opacity-0 transition-all duration-150 group-hover/svc:translate-x-0.5 group-hover/svc:opacity-100"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Bottom CTA — explore the full marketplace */}
        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-white/[0.06] pt-10 sm:flex-row">
            <p className="text-sm text-slate-400">
              Can&apos;t find what you need? Browse the full{" "}
              <span className="font-semibold text-white">305-service marketplace</span>{" "}
              or talk to an expert.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/marketplace"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400"
              >
                Explore Marketplace
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
