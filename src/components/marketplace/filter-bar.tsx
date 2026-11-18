"use client";

import {
  LayoutGrid,
  Layers,
  Network,
  Briefcase,
  Code2,
  ArrowUpDown,
  X,
} from "lucide-react";
import type { Category, Service, Subcategory } from "@/types";
import {
  DELIVERY_TYPE_LABELS,
  SORT_OPTIONS,
  type MarketplaceFilterState,
  type MarketplaceSort,
} from "@/lib/marketplace-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * MarketplaceFilterBar — the new secondary header for the marketplace page.
 *
 * A single horizontal row of six pill-shaped dropdown filters (Category,
 * Subcategory, Service Type, Industry, Technology, Sort) on a dark navy
 * background, with amber icons + white labels + chevrons — matching the
 * supplied design. Replaces the old hero band + left sidebar.
 *
 * Each filter is single-select (selecting a value replaces the previous
 * selection for that facet; selecting "All …" clears it).
 */
interface FilterBarProps {
  filters: MarketplaceFilterState;
  updateFilters: (patch: Partial<MarketplaceFilterState>) => void;
  sort: MarketplaceSort;
  setSort: (s: MarketplaceSort) => void;
  categories: Category[];
  subcategories: Subcategory[];
  technologies: string[];
  services: Service[];
}

const DELIVERY_OPTIONS = (
  Object.keys(DELIVERY_TYPE_LABELS) as (keyof typeof DELIVERY_TYPE_LABELS)[]
).map((value) => ({ value, label: DELIVERY_TYPE_LABELS[value] }));

function PillSelect({
  icon: Icon,
  label,
  value,
  onValueChange,
  options,
  allLabel,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  allLabel: string;
  active: boolean;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-9 w-full gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 text-xs font-medium text-white transition-colors hover:border-white/25 hover:bg-white/[0.1] focus:ring-amber-400/30",
          active && "border-amber-400/40 bg-amber-400/[0.08]"
        )}
        aria-label={label}
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", active ? "text-amber-300" : "text-amber-400")} />
        <span className="truncate">
          {label}
          {value && value !== "__all" ? `: ${options.find((o) => o.value === value)?.label ?? value}` : ""}
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value="__all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function MarketplaceFilterBar({
  filters,
  updateFilters,
  sort,
  setSort,
  categories,
  subcategories,
  technologies,
  services,
}: FilterBarProps) {
  // Subcategories scoped to the selected category (or all).
  const scopedSubs = filters.category
    ? subcategories.filter((s) => s.categoryId === categories.find((c) => c.slug === filters.category)?.id)
    : subcategories;

  // Unique industries from the published services.
  const industries = Array.from(
    new Set(services.flatMap((s) => s.industries ?? []))
  ).sort();

  const catOptions = categories.map((c) => ({ value: c.slug, label: c.name }));
  const subOptions = scopedSubs.map((s) => ({ value: s.id, label: s.name }));
  const indOptions = industries.map((i) => ({ value: i, label: i }));
  const techOptions = technologies.map((t) => ({ value: t, label: t }));

  const activeCount =
    (filters.category ? 1 : 0) +
    (filters.subcategories.length ? 1 : 0) +
    (filters.serviceTypes.length ? 1 : 0) +
    (filters.industries.length ? 1 : 0) +
    (filters.technologies.length ? 1 : 0);

  return (
    <section className="sticky top-[57px] z-30 border-b border-white/10 bg-brand-navy/95 backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 py-3">
          {/* Category */}
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <PillSelect
              icon={LayoutGrid}
              label="Category"
              value={filters.category || "__all"}
              onValueChange={(v) =>
                updateFilters({
                  category: v === "__all" ? "" : v,
                  subcategories: [],
                })
              }
              options={catOptions}
              allLabel="All categories"
              active={!!filters.category}
            />
          </div>

          {/* Subcategory */}
          <div className="min-w-[140px] flex-1 sm:flex-none">
            <PillSelect
              icon={Layers}
              label="Subcategory"
              value={filters.subcategories[0] ?? "__all"}
              onValueChange={(v) =>
                updateFilters({
                  subcategories: v === "__all" ? [] : [v],
                })
              }
              options={subOptions}
              allLabel={filters.category ? "All subcategories" : "Select a category first"}
              active={filters.subcategories.length > 0}
            />
          </div>

          {/* Service Type */}
          <div className="min-w-[130px] flex-1 sm:flex-none">
            <PillSelect
              icon={Network}
              label="Service Type"
              value={filters.serviceTypes[0] ?? "__all"}
              onValueChange={(v) =>
                updateFilters({
                  serviceTypes: v === "__all" ? [] : [v as MarketplaceFilterState["serviceTypes"][number]],
                })
              }
              options={DELIVERY_OPTIONS}
              allLabel="All service types"
              active={filters.serviceTypes.length > 0}
            />
          </div>

          {/* Industry */}
          <div className="min-w-[130px] flex-1 sm:flex-none">
            <PillSelect
              icon={Briefcase}
              label="Industry"
              value={filters.industries[0] ?? "__all"}
              onValueChange={(v) =>
                updateFilters({
                  industries: v === "__all" ? [] : [v],
                })
              }
              options={indOptions}
              allLabel="All industries"
              active={filters.industries.length > 0}
            />
          </div>

          {/* Technology */}
          <div className="min-w-[130px] flex-1 sm:flex-none">
            <PillSelect
              icon={Code2}
              label="Technology"
              value={filters.technologies[0] ?? "__all"}
              onValueChange={(v) =>
                updateFilters({
                  technologies: v === "__all" ? [] : [v],
                })
              }
              options={techOptions}
              allLabel="All technologies"
              active={filters.technologies.length > 0}
            />
          </div>

          {/* Sort */}
          <div className="min-w-[150px] flex-1 sm:flex-none">
            <Select value={sort} onValueChange={(v) => setSort(v as MarketplaceSort)}>
              <SelectTrigger
                className="h-9 w-full gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/[0.1] px-3 text-xs font-medium text-white transition-colors hover:border-amber-400/50 focus:ring-amber-400/30"
                aria-label="Sort services"
              >
                <ArrowUpDown className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span className="truncate">
                  Sort: {SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Most relevant"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() =>
                updateFilters({
                  category: "",
                  subcategories: [],
                  serviceTypes: [],
                  industries: [],
                  technologies: [],
                })
              }
              className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-white/10 px-3 text-xs font-medium text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
              Clear ({activeCount})
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
