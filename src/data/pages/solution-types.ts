// ============================================================
// SOLUTION LANDING — TypeScript spec for the 16-section
// per-outcome-bundle conversion page at /solutions/[slug].
//
// The six outcome-based solution bundles (Revenue Growth,
// Business Automation, Software/SaaS, Digital Growth, BI,
// AI Transformation) each ship a SolutionSpec that fills 16
// visually-distinct sections.
//
// These 16 section designs are INTENTIONALLY DIFFERENT from
// the division pages (/category/[slug]) so the two page
// families don't look alike:
//   hero (centered + architecture) · outcome promise band ·
//   problem/solution split · service architecture diagram ·
//   capabilities accordion · vertical journey stepper ·
//   ROI calculator visual · stack integrations grid ·
//   metric comparison cards · case studies carousel ·
//   outcome scorecard (multi-chart) · testimonial wall ·
//   vs-alternatives toggle · engagement tabs · industries
//   strip · CTA + FAQ.
// ============================================================

export interface SolutionAccent {
  /** tailwind gradient classes, e.g. "from-emerald-500 via-teal-500 to-green-600" */
  gradient: string;
  /** tinted tile bg + ring, e.g. "bg-emerald-400/10 ring-emerald-400/25" */
  tile: string;
  /** icon color, e.g. "text-emerald-400" */
  icon: string;
  /** solid dot, e.g. "bg-emerald-400" */
  dot: string;
  /** chip bg+text+ring, e.g. "bg-emerald-400/10 text-emerald-200 ring-emerald-400/25" */
  chip: string;
  /** eyebrow/strong text color, e.g. "text-emerald-400" */
  eyebrow: string;
  /** rgba glow */
  glow: string;
}

/** A hero metric shown in the bottom strip. */
export interface HeroMetric {
  value: string;
  label: string;
}

/** A layer in the service architecture diagram. */
export interface ArchLayer {
  name: string;
  icon: string;
  components: string[];
}

// ------------------------------------------------------------
// SECTION-SPECIFIC DATA SHAPES
// ------------------------------------------------------------

/** 01 — Centered hero with architecture diagram. */
export interface SolutionHero {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  metrics: HeroMetric[];
  architectureLayers: ArchLayer[];
}

/** 02 — Outcome promise band (full-width stat band). */
export interface OutcomePromise {
  promise: string;
  stats: { value: string; label: string; sublabel: string }[];
}

/** 03 — Problem/solution side-by-side split. */
export interface ProblemSolution {
  title: string;
  subtitle: string;
  problems: { icon: string; text: string }[];
  solutions: { icon: string; text: string }[];
}

/** 04 — Service architecture diagram (layered blocks). */
export interface ServiceArchitecture {
  title: string;
  subtitle: string;
  layers: ArchLayer[];
}

/** 05 — Capabilities accordion. */
export interface CapabilitiesAccordion {
  title: string;
  subtitle: string;
  items: { icon: string; title: string; description: string; stat: { value: string; label: string } }[];
}

/** 06 — Vertical engagement journey stepper. */
export interface EngagementJourney {
  title: string;
  subtitle: string;
  milestones: { phase: string; title: string; description: string; duration: string; outcome: string }[];
}

/** 07 — ROI calculator visual. */
export interface RoiVisual {
  title: string;
  subtitle: string;
  inputs: { label: string; value: string }[];
  outputs: { label: string; value: string; unit: string }[];
  investment: string;
  return: string;
}

/** 08 — Stack & integrations categorized grid. */
export interface StackGrid {
  title: string;
  subtitle: string;
  categories: { name: string; tools: string[] }[];
}

/** 09 — Metric comparison cards (industry vs STIOOS vs potential). */
export interface MetricComparison {
  title: string;
  subtitle: string;
  metrics: { label: string; industry: number; stioos: number; potential: number; unit: string }[];
}

/** 10 — Featured case studies carousel. */
export interface CaseStudiesCarousel {
  title: string;
  subtitle: string;
  studies: { industry: string; title: string; result: { value: string; label: string }; quote: string }[];
}

/** 11 — Outcome scorecard (multi-chart dashboard). */
export interface OutcomeScorecard {
  title: string;
  subtitle: string;
  donut: { value: number; label: string };
  bars: { label: string; value: number }[];
  trend: { label: string; points: number[] };
  kpis: { value: string; label: string }[];
}

/** 12 — Testimonial wall (masonry). */
export interface TestimonialWall {
  title: string;
  subtitle: string;
  testimonials: { quote: string; name: string; role: string; company: string; rating: number }[];
}

/** 13 — Vs alternatives toggle comparison. */
export interface VsAlternatives {
  title: string;
  subtitle: string;
  alternatives: string[];
  criteria: { label: string; scores: number[] }[];
}

/** 14 — Engagement models tabs. */
export interface EngagementTabs {
  title: string;
  subtitle: string;
  tabs: { name: string; price: string; period: string; description: string; features: string[]; popular: boolean }[];
}

/** 15 — Industries served strip. */
export interface IndustriesStrip {
  title: string;
  subtitle: string;
  industries: { name: string; icon: string; count: number }[];
}

/** 16 — Final CTA + FAQ. */
export interface CtaFaq {
  cta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  faqs: { q: string; a: string }[];
}

// ============================================================
// THE FULL SOLUTION SPEC — 16 sections.
// ============================================================

export interface SolutionSpec {
  slug: string;
  name: string;
  icon: string;
  accent: SolutionAccent;
  engagementModel: string;

  hero: SolutionHero;
  outcomePromise: OutcomePromise;
  problemSolution: ProblemSolution;
  architecture: ServiceArchitecture;
  capabilities: CapabilitiesAccordion;
  journey: EngagementJourney;
  roi: RoiVisual;
  stack: StackGrid;
  metricComparison: MetricComparison;
  caseStudies: CaseStudiesCarousel;
  scorecard: OutcomeScorecard;
  testimonials: TestimonialWall;
  vsAlternatives: VsAlternatives;
  engagement: EngagementTabs;
  industries: IndustriesStrip;
  ctaFaq: CtaFaq;
}
