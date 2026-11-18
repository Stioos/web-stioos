"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid, Layers, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { SOLUTIONS, DIGITAL_TECH_AI_NAME } from "@/data/solutions";
import { divisionAccent } from "@/lib/division-accents";
import { Icon } from "@/components/shared/icon";
import { SolutionCard } from "@/components/shared/solution-card";
import { cn } from "@/lib/utils";

/**
 * Marketplace Explorer — an engaging, interactive home-page section that
 * surfaces the full catalog through TWO segmentations (tabs):
 *
 *  1. "By Division"  — all 8 divisions (7 marketplace categories + the
 *     Digital, Tech & AI Services bundle) in a bento grid where each tile
 *     has a UNIQUE size + its own accent gradient.
 *  2. "By Solution"  — the six as-a-Service outcome bundles (reuses
 *     SolutionCard) for buyers who think in outcomes rather than domains.
 *
 * Replaces the removed ROI calculator section.
 */

// Bento spans per category id — varied so each tile has a unique footprint.
const BENTO_SPAN: Record<string, string> = {
  "cat-ai-agents": "md:col-span-7",
  "cat-tech-programming": "md:col-span-5",
  "cat-cloud-devops-mlops": "md:col-span-4",
  "cat-digital-sales-marketing": "md:col-span-4",
  "cat-business-enterprise": "md:col-span-4",
  "cat-multimedia-ai": "md:col-span-6",
  "cat-talent-solutions": "md:col-span-6",
};

const SERVICE_COUNTS: Record<string, number> = {
  "cat-ai-agents": 45,
  "cat-tech-programming": 45,
  "cat-cloud-devops-mlops": 45,
  "cat-digital-sales-marketing": 45,
  "cat-business-enterprise": 40,
  "cat-multimedia-ai": 40,
  "cat-talent-solutions": 45,
};

type Tab = "divisions" | "solutions";

export function MarketplaceExplorer() {
  const [tab, setTab] = useState<Tab>("divisions");

  return (
    <section className="border-t border-border bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading + segmentation tabs */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
              The full marketplace
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Eight divisions. 305 services. One marketplace.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Browse by the domain you operate in, or by the outcome you need
              to hit. Every path leads to a delivery-ready engagement.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Browse marketplace by"
            className="inline-flex shrink-0 rounded-xl border border-border bg-card p-1 shadow-sm"
          >
            <button
              role="tab"
              aria-selected={tab === "divisions"}
              onClick={() => setTab("divisions")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                tab === "divisions"
                  ? "bg-amber-500 text-brand-ink shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              By Division
            </button>
            <button
              role="tab"
              aria-selected={tab === "solutions"}
              onClick={() => setTab("solutions")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                tab === "solutions"
                  ? "bg-amber-500 text-brand-ink shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="h-4 w-4" />
              By Solution
            </button>
          </div>
        </div>

        {/* ── By Division — bento grid of 8 tiles ── */}
        {tab === "divisions" && (
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Featured full-width tile: Digital, Tech & AI Services */}
            <Link
              href="/solutions"
              className="group relative col-span-1 flex flex-col overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 md:col-span-12"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                    <Layers className="h-7 w-7" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {DIGITAL_TECH_AI_NAME}
                      </h3>
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        Featured
                      </span>
                    </div>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                      Six outcome-driven as-a-Service bundles — every
                      capability packaged into one accountable, transparently-
                      priced engagement.
                    </p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-brand-ink transition-transform group-hover:translate-x-0.5">
                  Explore solutions <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* 7 marketplace division tiles — bento spans for unique style */}
            {CATEGORIES.map((cat) => {
              const accent = divisionAccent(cat.id);
              const count = SERVICE_COUNTS[cat.id] ?? 0;
              const span = BENTO_SPAN[cat.id] ?? "md:col-span-4";
              const isLarge = span === "md:col-span-7";
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={cn(
                    "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20",
                    span
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ boxShadow: `0 18px 50px -16px ${accent.glow}` }}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
                      accent.gradient
                    )}
                  />
                  <div className="relative flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl ring-1 bg-gradient-to-br",
                        accent.tile,
                        accent.heroRing
                      )}
                    >
                      <Icon
                        name={cat.icon}
                        className={cn("h-6 w-6", accent.icon)}
                      />
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
                        accent.chip
                      )}
                    >
                      {count} services
                    </span>
                  </div>
                  <h3
                    className={cn(
                      "relative mt-4 font-bold tracking-tight text-foreground",
                      isLarge ? "text-lg" : "text-base"
                    )}
                  >
                    {cat.name}
                  </h3>
                  <p
                    className={cn(
                      "relative mt-1 flex-1 text-sm leading-relaxed text-muted-foreground",
                      isLarge ? "line-clamp-3" : "line-clamp-2"
                    )}
                  >
                    {cat.tagline}. {cat.description}
                  </p>
                  <div className="relative mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        accent.eyebrow
                      )}
                    >
                      Explore division
                    </span>
                    <ArrowRight
                      className={cn(
                        "h-4 w-4 transition-transform group-hover:translate-x-0.5",
                        accent.icon
                      )}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── By Solution — six as-a-Service cards ── */}
        {tab === "solutions" && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((sol) => (
              <SolutionCard key={sol.id} sol={sol} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
