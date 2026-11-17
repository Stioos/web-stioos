import type { DeliveryType, Service } from "@/types";
import { getCategoryById } from "@/data/categories";

// ============================================================
// MARKETPLACE UTILS — labels, technology aggregation, filtering
// Shared by ServiceCard, FiltersPanel, marketplace listing and
// service detail pages. Pure functions, no side effects.
// ============================================================

// ---------- Delivery labels ----------

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  project: "Project",
  subscription: "Subscription",
  retainer: "Retainer",
  on_demand: "On-demand",
  self_serve: "Self-serve",
};

export const DELIVERY_TYPE_OPTIONS = (
  Object.keys(DELIVERY_TYPE_LABELS) as DeliveryType[]
).map((value) => ({ value, label: DELIVERY_TYPE_LABELS[value] }));

/** "Project" | "Subscription" | … — the card subtitle next to the timeline. */
export function deliveryLabel(service: Service): string {
  return DELIVERY_TYPE_LABELS[service.deliveryType] ?? "Project";
}

// ---------- Technologies ----------

/**
 * Static fallback list (~30 technologies aggregated from the
 * service catalog). Used when live services are not available.
 */
export const TECH_LIST: string[] = [
  "Airflow", "AWS", "Azure Document Intelligence", "After Effects", "Anthropic",
  "Docker", "DocuSign", "Figma", "GA4", "Google Ads",
  "Google Document AI", "HubSpot", "Illustrator", "Intercom", "LangChain",
  "LangGraph", "Make", "Metabase", "Next.js", "Node.js",
  "Notion", "OpenAI", "Pinecone", "Pipedrive", "PostgreSQL",
  "Power BI", "Python", "Salesforce", "Segment", "Stripe",
  "Tailwind CSS", "TypeScript", "Vercel", "Zapier", "Zendesk",
];

/** Flat, de-duplicated, alphabetically sorted technology list for a set of services. */
export function allTechnologies(services: Service[]): string[] {
  const set = new Set<string>();
  for (const service of services) {
    for (const tech of service.technologies ?? []) set.add(tech);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// ---------- Filters ----------

export type MarketplaceSort = "relevance" | "newest" | "popular" | "az";

export interface MarketplaceFilterState {
  /** Free-text search across name, description, tags, technologies, industries, category. */
  q: string;
  /** Category slug, or "" for all categories. */
  category: string;
  /** Subcategory ids (multi-select, cascading under the selected category). */
  subcategories: string[];
  /** Delivery types (multi-select). */
  serviceTypes: DeliveryType[];
  /** Industry names (multi-select). */
  industries: string[];
  /** Technology names (multi-select). */
  technologies: string[];
  /** Quick flags. */
  featuredOnly: boolean;
  newestOnly: boolean;
  popularOnly: boolean;
}

export const defaultFilters: MarketplaceFilterState = {
  q: "",
  category: "",
  subcategories: [],
  serviceTypes: [],
  industries: [],
  technologies: [],
  featuredOnly: false,
  newestOnly: false,
  popularOnly: false,
};

export const SORT_OPTIONS: { value: MarketplaceSort; label: string }[] = [
  { value: "relevance", label: "Most relevant" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most popular" },
  { value: "az", label: "Name (A–Z)" },
];

export function countActiveFilters(state: MarketplaceFilterState): number {
  let count = 0;
  if (state.q.trim()) count += 1;
  if (state.category) count += 1;
  count += state.subcategories.length;
  count += state.serviceTypes.length;
  count += state.industries.length;
  count += state.technologies.length;
  if (state.featuredOnly) count += 1;
  if (state.newestOnly) count += 1;
  if (state.popularOnly) count += 1;
  return count;
}

const matchesQuery = (service: Service, q: string): boolean => {
  const category = getCategoryById(service.categoryId);
  const haystack = [
    service.name,
    service.shortDescription,
    service.tags.join(" "),
    service.technologies.join(" "),
    service.industries.join(" "),
    category?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};

/** Keep only the newest third of the given set (deterministic "Newest" flag). */
const filterNewestCohort = (services: Service[]): Service[] => {
  if (services.length <= 1) return services;
  const sorted = [...services].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const keep = Math.max(1, Math.ceil(sorted.length / 3));
  const cutoff = new Date(sorted[keep - 1].createdAt).getTime();
  return services.filter((s) => new Date(s.createdAt).getTime() >= cutoff);
};

/** Keep the top half by popularity (deterministic "Popular" flag). */
const filterPopularCohort = (services: Service[]): Service[] => {
  if (services.length <= 1) return services;
  const scores = services.map((s) => s.popularity).sort((a, b) => a - b);
  const median = scores[Math.floor(scores.length / 2)];
  return services.filter((s) => s.popularity >= median);
};

/**
 * Apply marketplace filters + sort to a set of services.
 * The caller is responsible for passing only services that should be
 * listed (e.g. status === "published").
 */
export function applyFilters(
  services: Service[],
  state: MarketplaceFilterState,
  sort: MarketplaceSort = "relevance"
): Service[] {
  const q = state.q.trim();
  let result = services.filter((service) => {
    if (state.category) {
      const category = getCategoryById(service.categoryId);
      if (!category || category.slug !== state.category) return false;
    }
    if (
      state.subcategories.length > 0 &&
      !state.subcategories.includes(service.subcategoryId)
    ) {
      return false;
    }
    if (
      state.serviceTypes.length > 0 &&
      !state.serviceTypes.includes(service.deliveryType)
    ) {
      return false;
    }
    if (
      state.industries.length > 0 &&
      !service.industries.some((industry) => state.industries.includes(industry))
    ) {
      return false;
    }
    if (
      state.technologies.length > 0 &&
      !service.technologies.some((tech) => state.technologies.includes(tech))
    ) {
      return false;
    }
    if (state.featuredOnly && !service.featured) return false;
    if (q && !matchesQuery(service, q)) return false;
    return true;
  });

  if (state.newestOnly) result = filterNewestCohort(result);
  if (state.popularOnly) result = filterPopularCohort(result);

  const sorted = [...result];
  switch (sort) {
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "popular":
      sorted.sort((a, b) => b.popularity - a.popularity);
      break;
    case "az":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "relevance":
    default:
      sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.popularity - a.popularity;
      });
      break;
  }
  return sorted;
}

/** slugify fallback for industries not present in the INDUSTRIES dataset. */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
