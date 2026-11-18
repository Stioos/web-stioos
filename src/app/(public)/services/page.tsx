"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { SearchX, Search, LayoutGrid, ChevronDown, Sparkles, Layers, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageActionBar } from "@/components/shared/page-action-bar";
import { ServiceCard } from "@/components/marketplace/service-card";
import { useAppStore } from "@/lib/store";
import { useIncrementalList } from "@/hooks/use-incremental-list";
import { divisionAccent } from "@/lib/division-accents";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";

// ============================================================
// SERVICES — Full directory with search + category filters
// ============================================================

export default function ServicesPage() {
  const services = useAppStore((s) => s.services);
  const categories = useAppStore((s) => s.categories);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Typing stays urgent; the (memoized) filter pass + grid window reset
  // run at lower priority against the deferred query — zero jank while
  // typing into the 305-service catalog.
  const deferredQuery = useDeferredValue(query);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.status === "active"),
    [categories]
  );

  const published = useMemo(
    () => services.filter((s) => s.status === "published"),
    [services]
  );

  // Per-division counts computed once per catalog change (was a nested
  // .filter per chip on every render — O(divisions × services) per keystroke).
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of published) {
      map[s.categoryId] = (map[s.categoryId] ?? 0) + 1;
    }
    return map;
  }, [published]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return published.filter((s) => {
      if (activeCategory !== "all" && s.categoryId !== activeCategory) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [published, deferredQuery, activeCategory]);

  // Performance: the catalog holds 305 curated services; mount only a bounded
  // window of cards and reveal more as the visitor scrolls.
  const {
    visible: visibleServices,
    hasMore: hasMoreServices,
    remaining: remainingServices,
    loadMore: loadMoreServices,
    sentinelRef,
  } = useIncrementalList(filtered, {
    resetKey: `${deferredQuery}|${activeCategory}`,
  });

  return (
    <>
      {/* ===================== PAGE ACTION BAR ===================== */}
      <PageActionBar
        items={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />

      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-12 text-white md:py-16">
        <div className="absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 70% 20%, rgba(139,47,232,0.18), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_380px]">
            {/* Left — text + search + engaging stats */}
            <div>
              <p className="eyebrow text-amber-400">
                <span className="inline-block h-px w-6 bg-amber-400/60" aria-hidden="true" />
                Service Directory
              </p>
              <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                Every service, <span className="text-gradient-brand">one catalog.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                Browse the complete library of published STIOOS GLOBAL services — scoped, outcome-driven, and
                ready to deploy. Filter by division or search by capability and technology.
              </p>

              {/* Search */}
              <div className="relative mt-6 max-w-xl">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, tag, or capability — e.g. \u201cagents\u201d, \u201cdashboards\u201d"
                  className="h-12 border-white/15 bg-white/5 pl-11 text-white placeholder:text-slate-500 focus-visible:ring-amber-400"
                  aria-label="Search services"
                />
              </div>

              {/* Engaging stats */}
              <div className="mt-8 flex flex-wrap gap-6">
                <div>
                  <div className="text-3xl font-bold text-white">{published.length}</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">Services</div>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <div className="text-3xl font-bold text-white">{activeCategories.length}</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">Divisions</div>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <div className="text-3xl font-bold text-white">42</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">Subcategories</div>
                </div>
                <div className="border-l border-white/10 pl-6">
                  <div className="text-3xl font-bold text-white">40+</div>
                  <div className="text-xs uppercase tracking-wider text-slate-400">Technologies</div>
                </div>
              </div>
            </div>

            {/* Right — gradient card visual (matches the supplied design) */}
            <div className="relative hidden lg:block">
              {/* Stack effect — cards behind */}
              {activeCategories.slice(1, 4).map((cat, i) => {
                const accent = divisionAccent(cat.id);
                return (
                  <div
                    key={cat.id}
                    className={cn(
                      "absolute inset-0 rounded-[32px] bg-gradient-to-br opacity-20",
                      accent.gradient
                    )}
                    style={{
                      transform: `translate(${(i + 1) * 12}px, ${(i + 1) * 12}px) scale(${1 - (i + 1) * 0.04})`,
                    }}
                    aria-hidden="true"
                  />
                );
              })}

              {/* Featured gradient card */}
              {activeCategories[0] && (
                <Link
                  href={`/category/${activeCategories[0].slug}`}
                  className="group relative block overflow-hidden rounded-[32px] p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #8b2fe8, #d13bf5)",
                  }}
                >
                  {/* Icon tile */}
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110">
                    <Icon name={activeCategories[0].icon} className="h-10 w-10 text-[#1a0a2e]" />
                  </div>

                  {/* Heading */}
                  <h2 className="mt-5 text-center text-xl font-bold leading-tight text-[#1a0a2e]">
                    {activeCategories[0].name}
                  </h2>

                  {/* Badge pill */}
                  <div className="mt-4 flex justify-center">
                    <span className="rounded-full bg-black/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a0a2e] backdrop-blur-sm">
                      {categoryCounts[activeCategories[0].id] ?? 0} services available
                    </span>
                  </div>

                  {/* Hover hint */}
                  <div className="mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#1a0a2e]/70 transition-colors group-hover:text-[#1a0a2e]">
                    Explore division
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CATALOG ============================ */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category filter chips */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
            <FilterChip
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              label={`All divisions (${published.length})`}
            />
            {activeCategories.map((cat) => {
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <FilterChip
                  key={cat.id}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  label={`${cat.name} (${count})`}
                />
              );
            })}
          </div>

          {/* Count */}
          <p className="mt-8 text-sm font-medium text-muted-foreground" aria-live="polite">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            {published.length} published services
            {activeCategory !== "all" && (
              <>
                {" "}
                in{" "}
                <span className="font-semibold text-foreground">
                  {activeCategories.find((c) => c.id === activeCategory)?.name}
                </span>
              </>
            )}
            {query.trim() && (
              <>
                {" "}
                matching <span className="font-semibold text-foreground">“{query.trim()}”</span>
              </>
            )}
          </p>

          {/* Grid — incrementally rendered (useIncrementalList): only a
              bounded window of cards is mounted; scrolling reveals more */}
          {filtered.length > 0 ? (
            <>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
              {hasMoreServices && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl"
                    onClick={loadMoreServices}
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    Show more services ({remainingServices} remaining)
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              className="mt-8"
              icon={query.trim() ? SearchX : LayoutGrid}
              title="No services match your filters"
              description={
                query.trim()
                  ? `Nothing found for “${query.trim()}”. Try a broader term like “automation” or “analytics”.`
                  : "No published services in this division yet — check back soon or talk to an expert about early access."
              }
            />
          )}
        </div>
      </section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? "bg-blue-600 font-semibold text-white hover:bg-blue-700"
          : "border-border bg-card font-medium text-foreground hover:border-blue-600/40 hover:text-blue-700"
      }
    >
      {label}
    </Button>
  );
}
