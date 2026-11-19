/**
 * Static service data — imports ALL 7 division data files statically so the
 * service detail page can find any service WITHOUT depending on the store's
 * deferred catalog (ensureFullCatalog). This eliminates the skeleton-loading
 * state that occurs when the store's dynamic imports fail or are slow.
 *
 * The ~447KB of data is code-split by Next.js — loaded only when the service
 * detail page is accessed, not on every route.
 */
import type { Service } from "@/types";
import { CORE_SERVICES } from "@/data/services-core";
import { AGENT_SERVICES } from "@/data/services-agents";
import { TECH_SERVICES } from "@/data/services-tech";
import { CLOUD_SERVICES } from "@/data/services-cloud";
import { MARKETING_SERVICES } from "@/data/services-marketing";
import { BUSINESS_SERVICES } from "@/data/services-business";
import { MULTIMEDIA_SERVICES } from "@/data/services-multimedia";
import { TALENT_SERVICES } from "@/data/services-talent";

/** All 305 services concatenated + deduped by id. */
const ALL_SERVICES: Service[] = (() => {
  const seen = new Set<string>();
  const out: Service[] = [];
  for (const s of [
    ...CORE_SERVICES,
    ...AGENT_SERVICES,
    ...TECH_SERVICES,
    ...CLOUD_SERVICES,
    ...MARKETING_SERVICES,
    ...BUSINESS_SERVICES,
    ...MULTIMEDIA_SERVICES,
    ...TALENT_SERVICES,
  ]) {
    if (seen.has(s.id)) continue;
    seen.add(s.id);
    out.push(s);
  }
  return out;
})();

/** Find a published service by slug — ALWAYS available (static import). */
export function findServiceBySlug(slug: string): Service | undefined {
  return ALL_SERVICES.find((s) => s.slug === slug && s.status === "published");
}

/** All published services — for related-services computation. */
export function getAllPublishedServices(): Service[] {
  return ALL_SERVICES.filter((s) => s.status === "published");
}
