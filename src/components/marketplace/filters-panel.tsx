"use client";

import { RotateCcw } from "lucide-react";
import type { Category, DeliveryType, Subcategory } from "@/types";
import { CATEGORIES, SUBCATEGORIES } from "@/data/categories";
import { INDUSTRIES } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  DELIVERY_TYPE_OPTIONS,
  TECH_LIST,
  countActiveFilters,
  type MarketplaceFilterState,
} from "@/lib/marketplace-utils";

export interface MarketplaceFiltersProps {
  state: MarketplaceFilterState;
  /** Patch-style setter — pass only the keys that changed. */
  onChange: (patch: Partial<MarketplaceFilterState>) => void;
  /** Reset back to defaultFilters. */
  onReset: () => void;
  /** Option sources (default to the canonical seed data). */
  categories?: Category[];
  subcategories?: Subcategory[];
  industries?: string[];
  technologies?: string[];
  className?: string;
}

function FilterGroup({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t pt-4 first:border-t-0 first:pt-0", className)}>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * Marketplace filter sidebar. Desktop: sticky column.
 * Mobile: rendered inside a Sheet by the marketplace page.
 */
export function MarketplaceFilters({
  state,
  onChange,
  onReset,
  categories = CATEGORIES,
  subcategories = SUBCATEGORIES,
  industries = INDUSTRIES.map((i) => i.name),
  technologies = TECH_LIST,
  className,
}: MarketplaceFiltersProps) {
  const activeCount = countActiveFilters(state);

  const availableSubcategories = state.category
    ? subcategories.filter((s) => {
        const category = categories.find((c) => c.id === s.categoryId);
        return category?.slug === state.category;
      })
    : [];

  const toggleValue = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div
      className={cn(
        "rounded-lg border bg-card lg:sticky lg:top-24",
        className
      )}
      role="search"
      aria-label="Marketplace filters"
    >
      <div className="flex max-h-[calc(100vh-8rem)] flex-col gap-4 overflow-y-auto p-5">
        {/* Category */}
        <FilterGroup title="Category">
          <Select
            value={state.category || "all"}
            onValueChange={(value) =>
              onChange({ category: value === "all" ? "" : value, subcategories: [] })
            }
          >
            <SelectTrigger aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterGroup>

        {/* Subcategory (cascading) */}
        <FilterGroup title="Subcategory">
          {state.category && availableSubcategories.length > 0 ? (
            <div className="grid gap-2.5">
              {availableSubcategories.map((sub) => {
                const id = `filter-sub-${sub.id}`;
                return (
                  <div key={sub.id} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={state.subcategories.includes(sub.id)}
                      onCheckedChange={() =>
                        onChange({
                          subcategories: toggleValue(state.subcategories, sub.id),
                        })
                      }
                    />
                    <Label
                      htmlFor={id}
                      className="text-sm font-normal leading-snug text-foreground/90"
                    >
                      {sub.name}
                    </Label>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {state.category
                ? "No subcategories available for this category."
                : "Select a category to narrow by subcategory."}
            </p>
          )}
        </FilterGroup>

        {/* Delivery type */}
        <FilterGroup title="Service Type">
          <div className="grid gap-2.5">
            {DELIVERY_TYPE_OPTIONS.map((option) => {
              const id = `filter-type-${option.value}`;
              return (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={state.serviceTypes.includes(option.value)}
                    onCheckedChange={() =>
                      onChange({
                        serviceTypes: toggleValue(
                          state.serviceTypes as string[],
                          option.value
                        ) as DeliveryType[],
                      })
                    }
                  />
                  <Label htmlFor={id} className="text-sm font-normal text-foreground/90">
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </FilterGroup>

        {/* Industry */}
        <FilterGroup title="Industry">
          <div className="grid gap-2.5">
            {industries.map((industry) => {
              const id = `filter-industry-${industry}`;
              return (
                <div key={industry} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={state.industries.includes(industry)}
                    onCheckedChange={() =>
                      onChange({ industries: toggleValue(state.industries, industry) })
                    }
                  />
                  <Label htmlFor={id} className="text-sm font-normal text-foreground/90">
                    {industry}
                  </Label>
                </div>
              );
            })}
          </div>
        </FilterGroup>

        {/* Technology */}
        <FilterGroup title="Technology">
          <div className="max-h-40 overflow-y-auto pr-1">
            <div className="grid gap-2.5">
              {technologies.map((tech) => {
                const id = `filter-tech-${tech}`;
                return (
                  <div key={tech} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={state.technologies.includes(tech)}
                      onCheckedChange={() =>
                        onChange({ technologies: toggleValue(state.technologies, tech) })
                      }
                    />
                    <Label htmlFor={id} className="text-sm font-normal text-foreground/90">
                      {tech}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        </FilterGroup>

        {/* Quick flags */}
        <FilterGroup title="Quick Filters">
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="filter-featured" className="text-sm font-normal text-foreground/90">
                Featured only
              </Label>
              <Switch
                id="filter-featured"
                checked={state.featuredOnly}
                onCheckedChange={(checked) => onChange({ featuredOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="filter-newest" className="text-sm font-normal text-foreground/90">
                Newest
              </Label>
              <Switch
                id="filter-newest"
                checked={state.newestOnly}
                onCheckedChange={(checked) => onChange({ newestOnly: checked })}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="filter-popular" className="text-sm font-normal text-foreground/90">
                Popular
              </Label>
              <Switch
                id="filter-popular"
                checked={state.popularOnly}
                onCheckedChange={(checked) => onChange({ popularOnly: checked })}
              />
            </div>
          </div>
        </FilterGroup>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <span className="inline-flex min-h-6 items-center rounded-full bg-muted px-2.5 text-xs font-medium text-muted-foreground">
            {activeCount} active
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            disabled={activeCount === 0}
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear all
          </Button>
        </div>
      </div>
    </div>
  );
}
