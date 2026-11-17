"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { SearchX, Search, LayoutGrid, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PageActionBar } from "@/components/shared/page-action-bar";
import { ServiceCard } from "@/components/marketplace/service-card";
import { useAppStore } from "@/lib/store";
import { useIncrementalList } from "@/hooks/use-incremental-list";

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
          <p className="eyebrow text-amber-400">Service Directory</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Every service, <span className="text-gradient-brand">one catalog.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Browse the complete library of published STIOOS GLOBAL services — scoped, outcome-driven, and
            ready to deploy. Filter by division or search by capability and technology.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-xl">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, tag, or capability — e.g. “agents”, “dashboards”"
              className="h-12 border-white/15 bg-white/5 pl-11 text-white placeholder:text-slate-500 focus-visible:ring-amber-400"
              aria-label="Search services"
            />
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
