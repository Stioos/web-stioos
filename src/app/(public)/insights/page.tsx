"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { INSIGHTS } from "@/data/content";
import type { Insight } from "@/types";

// ============================================================
// INSIGHTS INDEX — featured article + filterable grid
// ============================================================

const INITIALS = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function InsightsPage() {
  const published = useMemo(() => INSIGHTS.filter((i) => i.status === "published"), []);
  const categories = useMemo(
    () => Array.from(new Set(published.map((i) => i.category))),
    [published]
  );

  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? published
        : published.filter((i) => i.category === activeCategory),
    [published, activeCategory]
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      {/* ============================ HEADER ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-16 text-white md:py-20">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(30,100,232,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-amber-400">Insights</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Field notes from the <span className="text-gradient-brand">intelligent frontier.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Playbooks, frameworks, and hard-won lessons from hundreds of enterprise AI, automation, and
            data deliveries — written by the practitioners who ship the work.
          </p>
        </div>
      </section>

      {/* ========================== FILTER CHIPS ========================== */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/95 py-3.5 backdrop-blur lg:top-[108px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter insights by category">
            <Chip
              active={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
              label="All"
            />
            {categories.map((cat) => (
              <Chip
                key={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                label={cat}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============================ LISTING ============================ */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No insights in this category yet"
              description="New articles are published regularly — try another category or check back soon."
              action={{ label: "View all insights", onClick: () => setActiveCategory("All") }}
            />
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div key={featured.id} className="anim-rise-xs">
                  <Link
                    href={`/insights/${featured.slug}`}
                    className="group grid overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-xl lg:grid-cols-[1.1fr_1fr]"
                  >
                    <FeaturedHeader insight={featured} />
                    <div className="flex flex-col justify-center p-7 md:p-10">
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600 ring-1 ring-amber-500/30">
                        Featured insight
                      </span>
                      <h2 className="mt-4 text-2xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-blue-700 md:text-3xl">
                        {featured.title}
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {featured.excerpt}
                      </p>
                      <div className="mt-6 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-xs font-bold text-white">
                          {INITIALS(featured.author)}
                        </span>
                        <div className="text-sm">
                          <p className="font-semibold text-foreground">{featured.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(featured.publishedAt), "MMMM d, yyyy")} · {featured.readTime} read
                          </p>
                        </div>
                        <ArrowRight
                          className="ml-auto h-5 w-5 text-blue-600 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

// ============================================================
// Cards
// ============================================================

function FeaturedHeader({ insight }: { insight: Insight }) {
  return (
    <div
      className={`relative min-h-[240px] overflow-hidden bg-gradient-to-br ${insight.accent} p-7 md:p-10`}
    >
      <div className="absolute inset-0 surface-grid opacity-70" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-black/25 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            {insight.category}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur">
            <Clock3 className="h-3 w-3" aria-hidden="true" />
            {insight.readTime}
          </span>
        </div>
        <p className="mt-8 font-mono text-[64px] font-bold leading-none text-white/25 md:text-[96px]">
          01
        </p>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link
      href={`/insights/${insight.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Accent gradient header */}
      <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${insight.accent}`}>
        <div className="absolute inset-0 surface-grid opacity-70" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
              {insight.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-black/25 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
              <Clock3 className="h-3 w-3" aria-hidden="true" />
              {insight.readTime}
            </span>
          </div>
          <BookOpen className="h-6 w-6 self-end text-white/50" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-blue-700">
          {insight.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {insight.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2.5 pt-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-[10px] font-bold text-white">
            {INITIALS(insight.author)}
          </span>
          <p className="text-xs">
            <span className="block font-semibold text-foreground">{insight.author}</span>
            <span className="text-muted-foreground">
              {format(new Date(insight.publishedAt), "MMM d, yyyy")}
            </span>
          </p>
          <ArrowRight
            className="ml-auto h-4 w-4 text-blue-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "border-blue-600 bg-blue-600 font-semibold text-white hover:bg-blue-700"
          : "border-border bg-card font-medium text-foreground hover:border-blue-600/40 hover:text-blue-700"
      }
    >
      {label}
    </Button>
  );
}
