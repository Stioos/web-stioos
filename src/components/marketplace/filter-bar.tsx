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
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * MarketplaceFilterBar — the secondary header for the marketplace page.
 *
 * Full-width light-gray band with six equal-width white pill dropdowns
 * (Category, Subcategory, Service Type, Industry, Technology, Sort),
 * each with a violet icon + dark text + violet chevron. Matches the
 * supplied design reference exactly.
 */
interface FilterBarProps {
  embedded?: boolean;
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
          // white pill, light border, dark text, rounded — matches the
          // reference design. The [&_svg:not([class*='text-'])] rule makes
          // the chevron violet (svgs without an explicit text-* class).
          "h-10 w-full justify-start gap-2 rounded-xl border-border bg-card px-3 text-[13px] font-medium text-foreground shadow-sm transition-colors hover:border-violet-400/50 hover:bg-violet-50/40 focus:ring-violet-400/30 [&_svg:not([class*='text-'])]:text-violet-500",
          active && "border-violet-400 bg-violet-50 ring-1 ring-violet-400/20"
        )}
        aria-label={label}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            active ? "text-violet-600" : "text-violet-500"
          )}
        />
        <span className="min-w-0 flex-1 truncate text-left">
          {label}
          {value && value !== "__all"
            ? `: ${options.find((o) => o.value === value)?.label ?? value}`
            : ""}
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
  embedded = false,
  filters,
  updateFilters,
  sort,
  setSort,
  categories,
  subcategories,
  technologies,
  services,
}: FilterBarProps) {
  const scopedSubs = filters.category
    ? subcategories.filter(
        (s) =>
          s.categoryId ===
          categories.find((c) => c.slug === filters.category)?.id
      )
    : subcategories;

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
    // Full-width light-gray band — spans the entire screen (no max-w
    // container) so the pills run edge to edge like the reference design.
    <section
      className={cn(
        "sticky z-30 w-full border-b border-border bg-muted/50 backdrop-blur",
        embedded ? "top-0" : "top-[57px]"
      )}
    >
      <div className="w-full px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap">
          {/* Category */}
          <div className="min-w-[130px] flex-1 sm:min-w-0">
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
          <div className="min-w-[130px] flex-1 sm:min-w-0">
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
              allLabel={
                filters.category ? "All subcategories" : "Select a category first"
              }
              active={filters.subcategories.length > 0}
            />
          </div>

          {/* Service Type */}
          <div className="min-w-[120px] flex-1 sm:min-w-0">
            <PillSelect
              icon={Network}
              label="Service Type"
              value={filters.serviceTypes[0] ?? "__all"}
              onValueChange={(v) =>
                updateFilters({
                  serviceTypes:
                    v === "__all"
                      ? []
                      : [
                          v as MarketplaceFilterState["serviceTypes"][number],
                        ],
                })
              }
              options={DELIVERY_OPTIONS}
              allLabel="All service types"
              active={filters.serviceTypes.length > 0}
            />
          </div>

          {/* Industry */}
          <div className="min-w-[120px] flex-1 sm:min-w-0">
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
          <div className="min-w-[120px] flex-1 sm:min-w-0">
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
          <div className="min-w-[140px] flex-1 sm:min-w-0">
            <Select value={sort} onValueChange={(v) => setSort(v as MarketplaceSort)}>
              <SelectTrigger
                className="h-10 w-full justify-start gap-2 rounded-xl border-violet-300 bg-violet-50 px-3 text-[13px] font-medium text-violet-700 shadow-sm transition-colors hover:border-violet-400 hover:bg-violet-100/60 focus:ring-violet-400/30 [&_svg:not([class*='text-'])]:text-violet-500"
                aria-label="Sort services"
              >
                <ArrowUpDown className="h-4 w-4 shrink-0 text-violet-600" />
                <span className="min-w-0 flex-1 truncate text-left">
                  Sort:{" "}
                  {SORT_OPTIONS.find((o) => o.value === sort)?.label ??
                    "Most relevant"}
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
              className="inline-flex h-10 shrink-0 items-center gap-1 rounded-xl border border-border bg-card px-3 text-[13px] font-medium text-muted-foreground shadow-sm transition-colors hover:border-violet-400/50 hover:text-violet-600"
            >
              <X className="h-4 w-4" />
              Clear ({activeCount})
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
