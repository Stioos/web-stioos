// ============================================================
// DIVISION LANDING — TypeScript spec for the 16-section
// per-division conversion page at /category/[slug].
//
// Each of the 6 solution divisions (AI Agents, Technology,
// Cloud DevOps, Marketing, Business, Multimedia) ships a
// DivisionSpec that fills 16 visually-distinct sections.
// Sections are designed to look DIFFERENT from each other
// (hero, marquee, KPI band, dark pain canvas, split dashboard,
// bento grid, horizontal timeline, tech radar, before/after
// bars, spotlight cards, gauge dashboard, case study, comparison
// table, pricing tiers, industry cloud, full-bleed CTA) so the
// page reads as a rich, varied narrative — not a repeated card.
// ============================================================

export type VisualVariant = "dashboard" | "radial" | "network" | "badge";
export type BentoSpan = "sm" | "md" | "lg" | "wide" | "tall";

/** A floating hero stat chip. */
export interface HeroStat {
  value: string;
  label: string;
}

/** Count-up KPI with a 7-point sparkline. */
export interface KpiMetric {
  value: string;
  label: string;
  trend: string;
  spark: number[];
  icon: string;
}

/** Problem-framing card for the dark "cost of inaction" band. */
export interface PainPoint {
  icon: string;
  title: string;
  description: string;
  impact: string;
}

/** Checklist + visual for the solution overview split. */
export interface SolutionOverview {
  eyebrow: string;
  title: string;
  body: string;
  capabilities: string[];
  visual: VisualVariant;
}

/** Bento-grid capability card. Links to subcategory route. */
export interface BentoCapability {
  icon: string;
  title: string;
  description: string;
  metric: string;
  span: BentoSpan;
  subslug: string;
}

/** Horizontal timeline phase. */
export interface ProcessPhase {
  phase: string;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
}

/** Tech-radar ring definition. */
export interface RadarRing {
  label: string;
}

/** Tech-radar node positioned by ring index (0=inner) + angle (deg). */
export interface RadarNode {
  name: string;
  ring: number;
  angle: number;
}

export interface TechRadar {
  title: string;
  subtitle: string;
  rings: RadarRing[];
  nodes: RadarNode[];
}

/** Before/after horizontal bar metric. */
export interface ImpactMetric {
  label: string;
  before: number;
  after: number;
  beforeLabel: string;
  afterLabel: string;
  unit: string;
}

export interface ImpactSection {
  title: string;
  subtitle: string;
  metrics: ImpactMetric[];
}

/** Featured service spotlight card. */
export interface SpotlightService {
  name: string;
  tagline: string;
  tags: string[];
  metric: { value: string; label: string };
  href: string;
}

/** Radial gauge (0-100). */
export interface Gauge {
  value: number;
  label: string;
}

export interface OutcomesGauges {
  central: Gauge & { caption: string };
  gauges: Gauge[];
}

/** Case study with results + testimonial. */
export interface CaseStudy {
  industry: string;
  title: string;
  challenge: string;
  solution: string;
  results: { value: string; label: string }[];
  quote: string;
  author: string;
  role: string;
}

/** Comparison table cell. */
export type CompareCell = "yes" | "no" | "partial";

export interface ComparisonSection {
  title: string;
  subtitle: string;
  columns: string[];
  rows: { criterion: string; values: CompareCell[] }[];
}

/** Pricing tier card. */
export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

export interface PricingSection {
  title: string;
  subtitle: string;
  tiers: PricingTier[];
}

/** Industry cloud pill. */
export interface IndustryPill {
  name: string;
  count: number;
}

/** Final full-bleed CTA band. */
export interface FinalCta {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  trustSignals: string[];
}

// ============================================================
// THE FULL DIVISION SPEC — 16 sections.
// ============================================================

export interface DivisionSpec {
  categoryId: string;
  slug: string;

  // 01 — Cinematic hero
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    stats: HeroStat[];
  };

  // 02 — Marquee trust strip
  trustBadges: string[];

  // 03 — KPI band with sparklines
  kpis: KpiMetric[];

  // 04 — Dark "cost of inaction" pain canvas
  painPoints: PainPoint[];

  // 05 — Split solution overview + live dashboard
  solution: SolutionOverview;

  // 06 — Capabilities bento grid (links to subcategories)
  capabilities: BentoCapability[];

  // 07 — Horizontal process timeline
  process: {
    title: string;
    subtitle: string;
    phases: ProcessPhase[];
  };

  // 08 — Tech radar
  techRadar: TechRadar;

  // 09 — Before/after impact bars
  impact: ImpactSection;

  // 10 — Spotlight service cards
  spotlightServices: SpotlightService[];

  // 11 — Outcomes radial gauge dashboard
  outcomes: OutcomesGauges;

  // 12 — Case study + testimonial
  caseStudy: CaseStudy;

  // 13 — Comparison matrix
  comparison: ComparisonSection;

  // 14 — Pricing / engagement tiers
  pricing: PricingSection;

  // 15 — Industries served cloud
  industries: IndustryPill[];

  // 16 — Final CTA band
  finalCta: FinalCta;
}
