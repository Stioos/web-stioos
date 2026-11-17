// ============================================================
// PAGE BUILDER — shared types for the 24-section landing pages
// Every dropdown option page (Talent Solutions) is
// rendered by src/components/page-builder from one PageSpec.
// ============================================================

/**
 * Icon keys resolved via the shared <Icon name> registry
 * (src/components/shared/icon.tsx — falls back to Sparkles).
 */
export type IconKey =
  | "Rocket"
  | "Target"
  | "Users"
  | "UserCheck"
  | "Brain"
  | "BrainCircuit"
  | "Shield"
  | "ShieldCheck"
  | "Clock"
  | "Globe"
  | "Award"
  | "BarChart3"
  | "Sparkles"
  | "Briefcase"
  | "Building2"
  | "GraduationCap"
  | "Cpu"
  | "HeartHandshake"
  | "Zap"
  | "Layers"
  | "Search"
  | "Check"
  | "Star"
  | "MessageSquare"
  | "CalendarDays"
  | "BookOpen"
  | "TrendingUp"
  | "Network"
  | "Wrench"
  | "Bot"
  | "Handshake"
  | "Wallet"
  | "BadgeCheck"
  | "FileText"
  | "Phone"
  | "Mail"
  | "MapPin"
  | "Gauge"
  | "Lock"
  | "RefreshCw"
  | "Puzzle"
  | "Video"
  | "Database"
  | "Code"
  | "Cloud"
  | "Settings"
  | "Lightbulb"
  | "Compass"
  | "Gem"
  | "Flag"
  | "Scale";

export type PageAccent = "amber" | "emerald" | "violet";

export interface SpecStat {
  value: string;
  label: string;
}

export interface SpecCta {
  label: string;
  href: string;
}

export interface SpecKpi {
  value: string;
  label: string;
  detail: string;
  icon: IconKey;
}

export interface SpecAudience {
  icon: IconKey;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  cta: SpecCta;
}

export interface SpecValueProp {
  icon: IconKey;
  title: string;
  description: string;
}

export interface SpecStep {
  title: string;
  description: string;
  duration: string;
}

export type SpotlightVisual = "dashboard" | "radial" | "network" | "badge";

export interface SpecSpotlight {
  icon: IconKey;
  title: string;
  description: string;
  bullets: string[];
  visual: SpotlightVisual;
}

export interface SpecModule {
  icon: IconKey;
  tag: string;
  title: string;
  description: string;
}

export interface SpecTech {
  title: string;
  description: string;
  points: { icon: IconKey; title: string; description: string }[];
  stats: SpecStat[];
}

export interface SpecCoverage {
  title: string;
  note: string;
  chips: string[];
  stats: SpecStat[];
}

export interface SpecModel {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: SpecCta;
}

export interface SpecOutcome {
  value: string;
  label: string;
  progress: number; // 0-100
}

export interface SpecTestimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating: number; // 1-5
}

export interface SpecComparison {
  traditional: string;
  withUs: string;
}

export interface SpecRegion {
  region: string;
  cities: string;
  note: string;
}

export interface SpecGuarantee {
  icon: IconKey;
  title: string;
  description: string;
}

export interface SpecExpert {
  name: string;
  role: string;
  initials: string;
  specialty: string;
  stat: string;
}

export interface SpecResource {
  type: string;
  title: string;
  description: string;
  readTime: string;
}

export interface SpecFaq {
  q: string;
  a: string;
}

export interface SpecCtaBand {
  kicker: string;
  title: string;
  primary: { kicker: string; title: string; text: string; cta: SpecCta };
  secondary: { kicker: string; title: string; text: string; cta: SpecCta };
}

export interface SpecContact {
  title: string;
  note: string;
  channels: { icon: IconKey; label: string; value: string; href: string }[];
}

/** Complete content for one 24-section landing page. */
export interface PageSpec {
  /** URL slug — /talent-solutions/[slug] */
  slug: string;
  /** Which dropdown family this page belongs to */
  group: "talent" | "worksonn";
  /** Accent color system used across all sections */
  accent: PageAccent;
  /** Breadcrumb label shown above the hero title */
  nav: string;

  // 1 — Hero
  eyebrow: string;
  title: string;
  highlight: string; // gradient-highlighted tail of the title
  subtitle: string;
  primaryCta: SpecCta;
  secondaryCta: SpecCta;
  heroStats: SpecStat[]; // 3

  // 2 — Trust bar
  trustBadges: string[]; // 6

  // 3 — KPI band
  kpis: SpecKpi[]; // 4

  // 4 — Who it's for
  audiences: SpecAudience[]; // 2

  // 5 — Why choose (value grid)
  valueProps: SpecValueProp[]; // 6

  // 6 — How it works
  processTitle: string;
  process: SpecStep[]; // 5

  // 7 — Spotlight rows
  spotlight: SpecSpotlight[]; // 3

  // 8 — What's included checklist
  deliverablesTitle: string;
  deliverables: string[]; // 8

  // 9 — Modules grid
  modulesTitle: string;
  modules: SpecModule[]; // 6

  // 10 — AI & Technology
  tech: SpecTech;

  // 11 — Coverage / talent pool
  coverage: SpecCoverage;

  // 12 — Engagement models
  modelsTitle: string;
  models: SpecModel[]; // 3

  // 13 — Outcomes
  outcomes: SpecOutcome[]; // 4

  // 14 — Testimonials
  testimonials: SpecTestimonial[]; // 3

  // 15 — Case study
  caseStudy: {
    industry: string;
    title: string;
    challenge: string;
    solution: string;
    results: SpecStat[]; // 3
  };

  // 16 — Comparison table
  comparisonTitle: string;
  comparison: SpecComparison[]; // 6

  // 17 — Industries served
  industries: string[]; // 10

  // 18 — Global reach
  regions: SpecRegion[]; // 4

  // 19 — Guarantees
  guarantees: SpecGuarantee[]; // 4

  // 20 — Experts
  experts: SpecExpert[]; // 3

  // 21 — Resources
  resources: SpecResource[]; // 3

  // 22 — FAQ
  faqs: SpecFaq[]; // 6

  // 23 — CTA band
  ctaBand: SpecCtaBand;

  // 24 — Contact strip
  contact: SpecContact;
}
