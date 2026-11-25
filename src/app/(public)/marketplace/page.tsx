"use client";

import { Suspense, useEffect, useDeferredValue, useMemo, useRef, useState, startTransition, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchX, TriangleAlert, X, ChevronDown } from "lucide-react";
import type { Service } from "@/types";
import { useAppStore } from "@/lib/store";
import { getSubcategoryById } from "@/data/categories";
import {
  DELIVERY_TYPE_LABELS,
  SORT_OPTIONS,
  allTechnologies,
  applyFilters,
  countActiveFilters,
  defaultFilters,
  type MarketplaceFilterState,
  type MarketplaceSort,
} from "@/lib/marketplace-utils";
import { ServiceCard } from "@/components/marketplace/service-card";
import { useIncrementalList } from "@/hooks/use-incremental-list";
import { RequestServiceDialog } from "@/components/marketplace/request-service-dialog";
import { MarketplaceFilterBar } from "@/components/marketplace/filter-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

interface FilterChip {
  key: string;
  label: string;
  clear: () => void;
}

export function MarketplaceContent({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const services = useAppStore((s) => s.services);
  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const marketplaceSettings = useAppStore((s) => s.marketplaceSettings);

  const [filters, setFilters] = useState<MarketplaceFilterState>(defaultFilters);
  const [sort, setSort] = useState<MarketplaceSort>(
    () => (useAppStore.getState().marketplaceSettings.defaultSort as MarketplaceSort) || "relevance"
  );
  const [requestService, setRequestService] = useState<Service | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  // mobileFiltersOpen removed — filter bar handles filters

  const published = useMemo(
    () => services.filter((s) => s.status === "published"),
    [services]
  );

  // Typing stays urgent (input value updates instantly) while the filter
  // pass + grid window reset run at lower priority against the deferred
  // filter state — the expensive side of a keystroke can never block it.
  const deferredFilters = useDeferredValue(filters);
  const filtered = useMemo(
    () => applyFilters(published, deferredFilters, sort),
    [published, deferredFilters, sort]
  );

  // Performance: mount only a bounded window of cards (the catalog holds
  // 305 curated services) and reveal more as the visitor scrolls. The window
  // resets whenever the filter/sort context changes.
  const filterKey = `${deferredFilters.category}|${deferredFilters.subcategories.join(",")}|${deferredFilters.q}|${deferredFilters.serviceTypes.join(",")}|${deferredFilters.industries.join(",")}|${deferredFilters.technologies.join(",")}|${sort}`;
  const {
    visible: visibleServices,
    hasMore: hasMoreServices,
    remaining: remainingServices,
    loadMore: loadMoreServices,
    sentinelRef,
  } = useIncrementalList(filtered, { resetKey: filterKey });
  const technologies = useMemo(() => allTechnologies(published), [published]);
  const activeCount = countActiveFilters(filters);

  const updateFilters = (patch: Partial<MarketplaceFilterState>) =>
    setFilters((f) => ({ ...f, ...patch }));
  const resetFilters = () => setFilters({ ...defaultFilters });

  // ---------- URL <-> filter state sync ----------
  const spCategory = searchParams.get("category") ?? "";
  const spSub = searchParams.get("subcategory") ?? "";
  const spQ = searchParams.get("q") ?? "";
  const lastUrlKey = useRef<string | null>(null);

  // URL → state (external navigation, e.g. header/category links)
  useEffect(() => {
    const key = `${spCategory}|${spSub}|${spQ}`;
    if (key === lastUrlKey.current) return;
    lastUrlKey.current = key;
    startTransition(() => {
      setFilters((f) => ({
        ...f,
        category: spCategory,
        subcategories: spSub ? spSub.split(",").filter(Boolean) : [],
        q: spQ,
      }));
    });
  }, [spCategory, spSub, spQ]);

  // state → URL (debounced; category, subcategory and search term are reflected)
  const skipFirstUrlSync = useRef(true);
  useEffect(() => {
    if (embedded) return;
    if (skipFirstUrlSync.current) {
      skipFirstUrlSync.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.subcategories.length)
        params.set("subcategory", filters.subcategories.join(","));
      if (filters.q.trim()) params.set("q", filters.q.trim());
      const qs = params.toString();
      lastUrlKey.current = `${filters.category}|${filters.subcategories.join(",")}|${filters.q.trim()}`;
      router.replace(qs ? `/marketplace?${qs}` : "/marketplace", { scroll: false });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [embedded, filters.category, filters.subcategories, filters.q, router]);

  const openRequest = useCallback((service: Service) => {
    setRequestService(service);
    setRequestOpen(true);
  }, []);

  const chips: FilterChip[] = [];
  if (filters.q.trim())
    chips.push({ key: "q", label: `"${filters.q.trim()}"`, clear: () => updateFilters({ q: "" }) });
  if (filters.category)
    chips.push({
      key: "category",
      label: categories.find((c) => c.slug === filters.category)?.name ?? filters.category,
      clear: () => updateFilters({ category: "", subcategories: [] }),
    });
  for (const subId of filters.subcategories)
    chips.push({
      key: `sub-${subId}`,
      label: getSubcategoryById(subId)?.name ?? subId,
      clear: () =>
        updateFilters({ subcategories: filters.subcategories.filter((id) => id !== subId) }),
    });
  for (const type of filters.serviceTypes)
    chips.push({
      key: `type-${type}`,
      label: DELIVERY_TYPE_LABELS[type],
      clear: () =>
        updateFilters({ serviceTypes: filters.serviceTypes.filter((t) => t !== type) }),
    });
  for (const industry of filters.industries)
    chips.push({
      key: `ind-${industry}`,
      label: industry,
      clear: () =>
        updateFilters({ industries: filters.industries.filter((i) => i !== industry) }),
    });
  for (const tech of filters.technologies)
    chips.push({
      key: `tech-${tech}`,
      label: tech,
      clear: () =>
        updateFilters({ technologies: filters.technologies.filter((t) => t !== tech) }),
    });
  if (filters.featuredOnly)
    chips.push({ key: "featured", label: "Featured", clear: () => updateFilters({ featuredOnly: false }) });
  if (filters.newestOnly)
    chips.push({ key: "newest", label: "Newest", clear: () => updateFilters({ newestOnly: false }) });
  if (filters.popularOnly)
    chips.push({ key: "popular", label: "Popular", clear: () => updateFilters({ popularOnly: false }) });

  const contentWidth = embedded ? "max-w-[1600px]" : "max-w-7xl";

  return (
    <div className="flex flex-col">
      {/* ---------- NEW secondary header: filter bar ---------- */}
      <MarketplaceFilterBar
        embedded={embedded}
        filters={filters}
        updateFilters={updateFilters}
        sort={sort}
        setSort={setSort}
        categories={categories}
        subcategories={subcategories}
        technologies={technologies}
        services={published}
      />

      {/* ---------- Maintenance notice ---------- */}
      {marketplaceSettings.status === "maintenance" && (
        <div className={`mx-auto w-full ${contentWidth} px-4 pt-6 sm:px-6 lg:px-8`}>
          <div
            role="status"
            className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-amber-900">
              The marketplace is currently in maintenance mode. Listings below reflect our
              latest catalog and may update while you browse.
            </p>
          </div>
        </div>
      )}

      {/* ---------- Listing (full width, no sidebar) ---------- */}
      <div className={`mx-auto w-full ${contentWidth} flex-1 px-4 py-8 sm:px-6 lg:px-8`}>
        <div id="results" className="min-w-0 scroll-mt-32">
          {/* Toolbar — results count */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
              of <span className="font-semibold text-foreground">{published.length}</span>{" "}
              services
            </p>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <Badge key={chip.key} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1">
                  {chip.label}
                  <button
                    type="button"
                    onClick={chip.clear}
                    aria-label={`Remove filter: ${chip.label}`}
                    className="rounded-full p-0.5 transition-colors hover:bg-foreground/15"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </Badge>
              ))}
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid — 4 per line */}
          {filtered.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleServices.map((service) => (
                  <ServiceCard key={service.id} service={service} onRequest={openRequest} />
                ))}
              </div>
              <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
              {hasMoreServices && (
                <div className="mt-10 flex justify-center">
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
              icon={SearchX}
              title="No services found"
              description="Try broadening your filters, or explore our most popular divisions: AI & Automation, Technology & Programming, and Data & Business Intelligence."
              action={{ label: "Clear all filters", onClick: resetFilters }}
              className="border-solid"
            />
          )}

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Can&apos;t find what you need?{" "}
            <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-700">
              Talk to our team
            </Link>{" "}
            — we scope custom engagements every week.
          </p>
        </div>
      </div>

      <RequestServiceDialog
        service={requestService}
        open={requestOpen}
        onOpenChange={setRequestOpen}
      />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={null}>
      <MarketplaceContent />
    </Suspense>
  );
}
