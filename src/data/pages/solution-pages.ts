import type { SolutionSpec } from "./solution-types";
import { REVENUE_GROWTH_SPEC } from "./solution-specs/revenue-growth-as-a-service";
import { BUSINESS_AUTOMATION_SPEC } from "./solution-specs/business-automation-as-a-service";
import { SOFTWARE_SAAS_SPEC } from "./solution-specs/software-as-a-service";
import { DIGITAL_GROWTH_SPEC } from "./solution-specs/digital-growth-as-a-service";
import { RODAAS_SPEC } from "./solution-specs/results-on-delivery-as-a-service";
import { AI_TRANSFORMATION_SPEC } from "./solution-specs/ai-transformation-as-a-service";

// ============================================================
// SOLUTION PAGES — registry of the 16-section conversion
// specs for each of the 6 outcome-based solution bundles.
// Each spec lives in its own file under ./solution-specs/.
// ============================================================

export const SOLUTION_SPECS: Record<string, SolutionSpec> = {
  "revenue-growth-as-a-service": REVENUE_GROWTH_SPEC,
  "business-automation-as-a-service": BUSINESS_AUTOMATION_SPEC,
  "software-as-a-service": SOFTWARE_SAAS_SPEC,
  "digital-growth-as-a-service": DIGITAL_GROWTH_SPEC,
  "results-on-delivery-as-a-service": RODAAS_SPEC,
  "ai-transformation-as-a-service": AI_TRANSFORMATION_SPEC,
};

export const SOLUTION_LIST = [
  { slug: "revenue-growth-as-a-service", name: "Revenue Growth as a Service", icon: "TrendingUp" },
  { slug: "business-automation-as-a-service", name: "Business Automation as a Service", icon: "Workflow" },
  { slug: "software-as-a-service", name: "Software as a Service / Managed Software", icon: "Code" },
  { slug: "digital-growth-as-a-service", name: "Digital Growth as a Service", icon: "Megaphone" },
  { slug: "results-on-delivery-as-a-service", name: "Results on Delivery as a Service", icon: "Trophy" },
  { slug: "ai-transformation-as-a-service", name: "AI Transformation as a Service", icon: "Sparkles" },
];

export function getSolutionSpec(slug: string): SolutionSpec | undefined {
  return SOLUTION_SPECS[slug];
}
