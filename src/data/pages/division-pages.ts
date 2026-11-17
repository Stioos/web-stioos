import type { DivisionSpec } from "./division-types";
import { AI_AGENTS_SPEC } from "./division-specs/ai-agents";
import { TECH_SPEC } from "./division-specs/technology-programming";
import { CLOUD_SPEC } from "./division-specs/cloud-devops-mlops";
import { MARKETING_SPEC } from "./division-specs/digital-sales-marketing";
import { BUSINESS_SPEC } from "./division-specs/business-enterprise-services";
import { MULTIMEDIA_SPEC } from "./division-specs/multimedia-ai-graphics";

// ============================================================
// DIVISION PAGES — registry of the 16-section conversion
// specs for each of the 6 solution divisions. Each spec lives
// in its own file under ./division-specs/ for editability.
// ============================================================

export const DIVISION_SPECS: Record<string, DivisionSpec> = {
  "ai-agents": AI_AGENTS_SPEC,
  "technology-programming": TECH_SPEC,
  "cloud-devops-mlops": CLOUD_SPEC,
  "digital-sales-marketing": MARKETING_SPEC,
  "business-enterprise-services": BUSINESS_SPEC,
  "multimedia-ai-graphics": MULTIMEDIA_SPEC,
};

export function getDivisionSpec(slug: string): DivisionSpec | undefined {
  return DIVISION_SPECS[slug];
}
