// ============================================================
// SERVICE INSIGHTS — deterministic per-service content engine.
// Builds KPI counters, before/after bars, a radial gauge, use
// cases and section microcopy for ANY service purely from
// existing Service metadata at runtime (no data-file edits).
//
// No randomness: an FNV-1a hash of the service id seeds a
// mulberry32 PRNG, so every service ALWAYS renders the exact
// same insights across renders, reloads and deployments — while
// different services get different variants (hash variance).
// ============================================================

import type { Service } from "@/types";
import { getSubcategoryById } from "@/data/categories";

// ---------- public types ----------

export type InsightUnit = "%" | "x" | "hrs" | "days" | "pts";

export interface InsightKpi {
  label: string;
  before: number;
  after: number;
  unit: InsightUnit;
  direction: "up" | "down";
  /** small qualifier rendered under the stat (e.g. "vs. industry benchmark") */
  suffix?: string;
}

export interface InsightBar {
  label: string;
  before: number;
  after: number;
  /** chart ceiling — bars render as a % of this */
  max: number;
  unit: InsightUnit;
}

export interface InsightGauge {
  label: string;
  /** 0-100 */
  value: number;
  caption: string;
}

export interface InsightUseCase {
  title: string;
  narrative: string;
  metric: string;
  industry: string;
}

export interface InsightSectionCopy {
  overviewLead: string;
  outcomesTitle: string;
  outcomesSub: string;
  useCasesTitle: string;
  useCasesSub: string;
}

export interface ServiceInsights {
  kpis: InsightKpi[];
  benefitBars: InsightBar[];
  gauge: InsightGauge;
  useCases: InsightUseCase[];
  sectionCopy: InsightSectionCopy;
}

// ---------- deterministic primitives ----------

/** FNV-1a over char codes → 32-bit unsigned hash. */
const fnv1a = (input: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

/** mulberry32 — tiny deterministic PRNG. */
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

type Rng = () => number;

const rand = (rng: Rng, lo: number, hi: number) => lo + rng() * (hi - lo);

const roundTo = (value: number, decimals: number) => {
  const m = 10 ** decimals;
  return Math.round(value * m) / m;
};

/** Deterministically shuffled index list (seeded Fisher–Yates). */
const shuffledIndices = (length: number, rng: Rng): number[] => {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

function pickVariant<T>(items: T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Formats a stat for display: integers stay clean, others keep 1 decimal. */
export const formatInsightValue = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

// ---------- division metric pools ----------

interface MetricSpec {
  label: string;
  unit: InsightUnit;
  direction: "up" | "down";
  /** range for the "before" value */
  before: [number, number];
  /** after = before × uniform(lo, hi) — lo > 1 for "up", hi < 1 for "down" */
  change: [number, number];
  decimals: 0 | 1;
  suffix?: string;
}

const MARKETING_POOL: MetricSpec[] = [
  { label: "Conversion rate", unit: "%", direction: "up", before: [1.1, 3.2], change: [1.9, 3.4], decimals: 1 },
  { label: "Cost per acquisition", unit: "x", direction: "down", before: [1.3, 2.2], change: [0.45, 0.7], decimals: 1, suffix: "vs. industry benchmark" },
  { label: "ROAS", unit: "x", direction: "up", before: [1.4, 2.6], change: [1.8, 3.0], decimals: 1, suffix: "return on ad spend" },
  { label: "Email revenue share", unit: "%", direction: "up", before: [7, 18], change: [1.7, 2.9], decimals: 0, suffix: "of total online revenue" },
  { label: "MQL-to-SQL rate", unit: "%", direction: "up", before: [12, 26], change: [1.5, 2.4], decimals: 0, suffix: "lead handoff quality" },
  { label: "Organic traffic share", unit: "%", direction: "up", before: [18, 38], change: [1.4, 2.2], decimals: 0, suffix: "vs. paid channels" },
];

const TECH_POOL: MetricSpec[] = [
  { label: "Deploy frequency", unit: "x", direction: "up", before: [0.4, 1.5], change: [2.2, 4.8], decimals: 1, suffix: "more releases per week" },
  { label: "Change failure rate", unit: "%", direction: "down", before: [16, 34], change: [0.28, 0.55], decimals: 0, suffix: "post-release rollbacks" },
  { label: "MTTR", unit: "hrs", direction: "down", before: [5, 24], change: [0.18, 0.45], decimals: 0, suffix: "mean time to restore" },
  { label: "Lead time for changes", unit: "days", direction: "down", before: [4, 18], change: [0.25, 0.55], decimals: 0, suffix: "commit to production" },
  { label: "Code review turnaround", unit: "hrs", direction: "down", before: [8, 28], change: [0.3, 0.6], decimals: 0 },
  { label: "Test coverage", unit: "%", direction: "up", before: [28, 56], change: [1.3, 1.8], decimals: 0, suffix: "critical paths automated" },
  { label: "Performance score", unit: "pts", direction: "up", before: [42, 68], change: [1.3, 1.7], decimals: 0, suffix: "Lighthouse, mobile" },
];

const OPS_POOL: MetricSpec[] = [
  { label: "Order-to-cash cycle", unit: "days", direction: "down", before: [12, 45], change: [0.35, 0.65], decimals: 0, suffix: "invoice to payment" },
  { label: "Close cycle", unit: "days", direction: "down", before: [8, 20], change: [0.3, 0.6], decimals: 0, suffix: "month-end close" },
  { label: "Data accuracy", unit: "%", direction: "up", before: [72, 88], change: [1.08, 1.2], decimals: 0, suffix: "CRM / ERP records" },
  { label: "Report turnaround", unit: "hrs", direction: "down", before: [6, 28], change: [0.12, 0.4], decimals: 0, suffix: "per weekly cycle" },
  { label: "Churn risk visibility", unit: "%", direction: "up", before: [10, 30], change: [1.8, 2.8], decimals: 0, suffix: "at-risk accounts flagged early" },
  { label: "Compliance findings", unit: "%", direction: "down", before: [12, 30], change: [0.25, 0.6], decimals: 0, suffix: "audit issues after remediation" },
  { label: "Forecast accuracy", unit: "%", direction: "up", before: [55, 74], change: [1.18, 1.35], decimals: 0, suffix: "vs. prior-quarter baseline" },
  { label: "Dashboard adoption", unit: "%", direction: "up", before: [20, 45], change: [1.8, 3.0], decimals: 0, suffix: "weekly active users" },
];

const AUTOMATION_POOL: MetricSpec[] = [
  { label: "Manual effort spent", unit: "hrs", direction: "down", before: [10, 38], change: [0.15, 0.4], decimals: 0, suffix: "per week, reclaimed" },
  { label: "Process cycle time", unit: "days", direction: "down", before: [2, 14], change: [0.2, 0.5], decimals: 0, suffix: "request to resolution" },
  { label: "Automation coverage", unit: "%", direction: "up", before: [8, 28], change: [2.0, 4.2], decimals: 0, suffix: "of eligible workflows" },
  { label: "Throughput", unit: "x", direction: "up", before: [1, 1], change: [1.9, 3.6], decimals: 1, suffix: "baseline volume, same team" },
  { label: "First-response time", unit: "hrs", direction: "down", before: [3, 16], change: [0.06, 0.25], decimals: 0, suffix: "customer enquiries" },
  { label: "Error rate", unit: "%", direction: "down", before: [5, 16], change: [0.2, 0.5], decimals: 1, suffix: "manual entry mistakes" },
];

const PLATFORM_POOL: MetricSpec[] = [
  { label: "Cloud waste", unit: "%", direction: "down", before: [18, 38], change: [0.3, 0.6], decimals: 0, suffix: "of monthly spend eliminated" },
  { label: "Deployment frequency", unit: "x", direction: "up", before: [0.4, 1.5], change: [2.0, 4.5], decimals: 1, suffix: "more releases per week" },
  { label: "MTTR", unit: "hrs", direction: "down", before: [4, 22], change: [0.15, 0.45], decimals: 0, suffix: "mean time to restore" },
  { label: "Platform lead time", unit: "days", direction: "down", before: [5, 20], change: [0.2, 0.5], decimals: 0, suffix: "environment request to ready" },
  { label: "Training/inference uptime", unit: "%", direction: "up", before: [92, 98], change: [1.01, 1.03], decimals: 1, suffix: "GPU cluster availability" },
  { label: "Security findings backlog", unit: "%", direction: "down", before: [15, 40], change: [0.25, 0.55], decimals: 0, suffix: "critical issues open" },
];

const CREATIVE_POOL: MetricSpec[] = [
  { label: "Creative production speed", unit: "x", direction: "up", before: [1, 1], change: [3.0, 6.0], decimals: 1, suffix: "assets per week, same team" },
  { label: "Asset cost per variant", unit: "x", direction: "down", before: [1, 1], change: [0.2, 0.45], decimals: 1, suffix: "vs. traditional production" },
  { label: "Ad click-through rate", unit: "%", direction: "up", before: [0.8, 2.2], change: [1.4, 2.4], decimals: 1, suffix: "vs. previous creative set" },
  { label: "Time to first asset", unit: "days", direction: "down", before: [5, 15], change: [0.2, 0.5], decimals: 0, suffix: "brief to delivery" },
  { label: "Brand consistency score", unit: "%", direction: "up", before: [60, 82], change: [1.15, 1.35], decimals: 0, suffix: "guideline adherence across assets" },
  { label: "Content backlog", unit: "%", direction: "down", before: [20, 45], change: [0.25, 0.55], decimals: 0, suffix: "unfulfilled creative requests" },
];

/** Generic-safe default pool for every remaining division. */
const DEFAULT_POOL: MetricSpec[] = [
  { label: "Manual effort spent", unit: "hrs", direction: "down", before: [8, 32], change: [0.2, 0.45], decimals: 0, suffix: "per week, reclaimed" },
  { label: "Process cycle time", unit: "days", direction: "down", before: [3, 15], change: [0.25, 0.55], decimals: 0, suffix: "kickoff to delivery" },
  { label: "Data accuracy", unit: "%", direction: "up", before: [70, 88], change: [1.08, 1.2], decimals: 0, suffix: "single source of truth" },
  { label: "Throughput", unit: "x", direction: "up", before: [1, 1], change: [1.6, 3.0], decimals: 1, suffix: "baseline output" },
  { label: "Error rate", unit: "%", direction: "down", before: [4, 15], change: [0.25, 0.55], decimals: 1, suffix: "rework and corrections" },
  { label: "Team capacity freed", unit: "%", direction: "up", before: [6, 18], change: [1.8, 3.2], decimals: 0, suffix: "redirected to core work" },
  { label: "Time-to-market", unit: "days", direction: "down", before: [5, 16], change: [0.3, 0.6], decimals: 0, suffix: "concept to launch" },
];

const METRIC_POOLS: Record<string, MetricSpec[]> = {
  "cat-digital-sales-marketing": MARKETING_POOL,
  "cat-tech-programming": TECH_POOL,
  "cat-ai-agents": AUTOMATION_POOL,
  "cat-business-enterprise": OPS_POOL,
  "cat-cloud-devops-mlops": PLATFORM_POOL,
  "cat-multimedia-ai": CREATIVE_POOL,
};

// ---------- value realization ----------

const FLOORS: Record<InsightUnit, number> = { "%": 0.5, x: 0.3, hrs: 1, days: 1, pts: 2 };

/** Turns a pool spec into a plausible before→after pair (after strictly better). */
const realizeMetric = (spec: MetricSpec, rng: Rng): { before: number; after: number } => {
  const d = spec.decimals;
  const before = roundTo(rand(rng, spec.before[0], spec.before[1]), d);
  let after = before * rand(rng, spec.change[0], spec.change[1]);
  if (spec.direction === "up") {
    if (spec.unit === "%") after = Math.min(after, 97);
    after = Math.max(after, before + (d ? 0.2 : 1));
  } else {
    after = Math.min(after, before - (d ? 0.2 : 1));
    after = Math.max(after, FLOORS[spec.unit]);
  }
  after = roundTo(after, d);
  // hard guarantees after rounding
  if (spec.direction === "up" && after <= before) {
    after = roundTo(before + (d ? 0.1 : 1), d);
  }
  if (spec.direction === "down" && after >= before) {
    after = Math.max(roundTo(before - (d ? 0.1 : 1), d), FLOORS[spec.unit]);
  }
  if (spec.direction === "down" && after >= before) {
    after = roundTo(before * 0.5, d);
  }
  return { before, after };
};

/** Chart ceiling: ~115% of the larger value so bars never touch the edge. */
const niceMax = (value: number, decimals: number) => {
  const m = 10 ** decimals;
  return Math.ceil(value * 1.15 * m) / m;
};

// ---------- radial gauge variants ----------

const GAUGE_VARIANTS: { label: string; caption: string; range: [number, number] }[] = [
  {
    label: "Average efficiency uplift",
    caption: "median improvement across engagements delivered in the last 12 months",
    range: [58, 88],
  },
  {
    label: "Client goal attainment",
    caption: "of documented engagement goals met or exceeded at handover",
    range: [78, 96],
  },
  {
    label: "Delivery predictability",
    caption: "of milestones delivered on or ahead of the agreed schedule",
    range: [80, 96],
  },
  {
    label: "Program ROI realization",
    caption: "of clients recover their investment inside the first year",
    range: [68, 90],
  },
];

// ---------- division flavor for use cases ----------

interface DivisionFlavor {
  /** capability noun woven into titles (e.g. "intelligent automation") */
  noun: string;
  /** outcome clause woven into narratives */
  win: string;
  /** metric noun used in scenario metrics */
  metricNoun: string;
}

const FLAVOR_BY_DIVISION: Record<string, DivisionFlavor> = {
  "cat-ai-agents": {
    noun: "intelligent automation",
    win: "hours of manual work disappear into reliable automated flows",
    metricNoun: "operational throughput",
  },
  "cat-tech-programming": {
    noun: "engineering delivery",
    win: "the roadmap ships weeks earlier at production-grade quality",
    metricNoun: "release velocity",
  },
  "cat-digital-sales-marketing": {
    noun: "growth execution",
    win: "pipeline compounds while acquisition costs trend down",
    metricNoun: "qualified pipeline",
  },
  "cat-business-enterprise": {
    noun: "operations",
    win: "back-office friction gives way to smooth, documented processes",
    metricNoun: "process efficiency",
  },
  "cat-cloud-devops-mlops": {
    noun: "platform engineering",
    win: "workloads ship faster on resilient, cost-aware infrastructure",
    metricNoun: "deployment velocity",
  },
  "cat-multimedia-ai": {
    noun: "creative production",
    win: "campaign-ready creative ships in days instead of weeks",
    metricNoun: "content velocity",
  },
};

const DEFAULT_FLAVOR: DivisionFlavor = {
  noun: "operations",
  win: "back-office friction gives way to smooth, documented processes",
  metricNoun: "process efficiency",
};

const DEFAULT_INDUSTRIES = ["Technology", "Professional Services"];

// ---------- use case templates ----------

interface UseCaseCtx {
  sub: string;
  industry: string;
  flavor: DivisionFlavor;
  rng: Rng;
}

type UseCaseTemplate = (ctx: UseCaseCtx) => Omit<InsightUseCase, "industry">;

const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
  // 1 — scale without headcount
  ({ sub, industry, flavor, rng }) => ({
    title: `${industry} team scales ${flavor.noun} without adding headcount`,
    narrative: `A growing ${industry} company adopted this ${sub} program after internal efforts plateaued. Within one quarter, ${flavor.win} — and leadership finally had numbers they could act on.`,
    metric: `+${Math.round(rand(rng, 24, 46))}% ${flavor.metricNoun} in 90 days`,
  }),
  // 2 — manual grind → autopilot
  ({ sub, industry, flavor, rng }) => ({
    title: `From manual grind to ${flavor.noun} on autopilot`,
    narrative: `The ${industry} operations lead was losing days every month to repetitive work that never quite got finished. After go-live, ${flavor.win}, freeing the team for work that actually moves the needle.`,
    metric: `${Math.round(rand(rng, 8, 22))} hrs saved weekly per team`,
  }),
  // 3 — modernize without downtime
  ({ sub, industry, flavor, rng }) => ({
    title: `Modernizing a ${industry} stack without pausing the business`,
    narrative: `This ${industry} firm needed ${sub} expertise that could land inside an environment where downtime was not an option. The rollout shipped in controlled phases, and ${flavor.win} from the very first release.`,
    metric: `${rand(rng, 2.1, 3.4).toFixed(1)}x faster ${flavor.metricNoun}`,
  }),
  // 4 — hard deadline
  ({ sub, industry, flavor, rng }) => ({
    title: `${industry} launch deadline met with room to spare`,
    narrative: `Facing a hard launch date, the ${industry} team used this ${sub} engagement to compress months of preparation into weeks. ${capitalize(flavor.win)} — and the launch went out on schedule with zero critical escalations.`,
    metric: `${Math.round(rand(rng, 28, 52))}% faster time-to-launch`,
  }),
  // 5 — consistency at scale
  ({ sub, industry, flavor, rng }) => ({
    title: `Bringing consistency to a fast-moving ${industry} operation`,
    narrative: `Every ${industry} team hits the same wall at scale: effort everywhere, consistency nowhere. This ${sub} program installed the guardrails and cadence that ${flavor.win} — and kept them in place long after handover.`,
    metric: `${Math.round(rand(rng, 18, 36))}% fewer errors and rework cycles`,
  }),
  // 6 — executive visibility
  ({ sub, industry, flavor, rng }) => ({
    title: `Board-ready visibility for a scaling ${industry} business`,
    narrative: `As this ${industry} business scaled, answers that used to take hours started taking days. Within weeks of kickoff, ${flavor.win}, and monthly reviews moved from opinion-led to evidence-led.`,
    metric: `+${Math.round(rand(rng, 20, 40))}% faster decision cycles`,
  }),
];

// ---------- section copy templates ----------

const OVERVIEW_LEADS: ((sub: string) => string)[] = [
  (sub) => `This engagement pairs a senior ${sub} team with a clear outcome plan — so you see measurable movement in weeks, not quarters.`,
  (sub) => `Everything here is engineered around one goal: making ${sub} deliver visible business value from the very first sprint.`,
  (sub) => `More than a generic package, this is a scoped ${sub} program shaped around your industry, your stack, and the metrics your leadership cares about.`,
];

const OUTCOMES_TITLES: string[] = [
  "The outcomes you can expect",
  "Results, measured — not promised",
  "What better looks like after launch",
];

const OUTCOMES_SUBS: ((sub: string) => string)[] = [
  (sub) => `Typical before-and-after ranges teams unlock with ${sub} across recent engagements — every number below is tied to a real workflow metric.`,
  (sub) => `Here is the before-and-after picture when ${sub} is delivered with senior accountability and clear success metrics.`,
  (sub) => `A snapshot of the movement teams typically report after going live with this ${sub} engagement.`,
];

const USE_CASES_TITLES: ((sub: string) => string)[] = [
  () => `Where this service shines`,
  () => `Real scenarios we deliver for`,
  (sub) => `How teams put ${sub} to work`,
];

const USE_CASES_SUBS: string[] = [
  "Three common situations where this engagement creates immediate, measurable value.",
  "If any of these sound like your world, you are exactly who this was built for.",
  "From urgent turnarounds to long-horizon scale plays — these are the engagements we run most often.",
];

// ---------- main builder ----------

/**
 * Builds the full insight pack for a service.
 * Pure + deterministic: same service id ⇒ identical output, always.
 */
export const buildServiceInsights = (service: Service): ServiceInsights => {
  const rng = mulberry32(fnv1a(service.id));

  const subcategory = getSubcategoryById(service.subcategoryId);
  const subName = subcategory?.name ?? "expert-led";

  // ---- KPIs + benefit bars (complementary metrics from one division pool) ----
  const pool = METRIC_POOLS[service.categoryId] ?? DEFAULT_POOL;
  const order = shuffledIndices(pool.length, rng);
  const kpiSpecs = order.slice(0, 3).map((i) => pool[i]);
  const barSpecs = order.slice(3, 6).map((i) => pool[i]);

  const kpis: InsightKpi[] = kpiSpecs.map((spec) => {
    const { before, after } = realizeMetric(spec, rng);
    return {
      label: spec.label,
      before,
      after,
      unit: spec.unit,
      direction: spec.direction,
      ...(spec.suffix ? { suffix: spec.suffix } : {}),
    };
  });

  const benefitBars: InsightBar[] = barSpecs.map((spec) => {
    const { before, after } = realizeMetric(spec, rng);
    return {
      label: spec.label,
      before,
      after,
      unit: spec.unit,
      max: niceMax(Math.max(before, after), spec.decimals),
    };
  });

  // ---- radial gauge ----
  const gaugeSpec = pickVariant(GAUGE_VARIANTS, rng);
  const gauge: InsightGauge = {
    label: gaugeSpec.label,
    value: Math.round(rand(rng, gaugeSpec.range[0], gaugeSpec.range[1])),
    caption: gaugeSpec.caption,
  };

  // ---- use cases (division flavor × service industries) ----
  const flavor = FLAVOR_BY_DIVISION[service.categoryId] ?? DEFAULT_FLAVOR;
  const industries = service.industries.filter(Boolean);
  const inds = industries.length > 0 ? industries : DEFAULT_INDUSTRIES;
  const templateOrder = shuffledIndices(USE_CASE_TEMPLATES.length, rng);
  const useCases: InsightUseCase[] = [0, 1, 2].map((i) => {
    const industry = inds[i % inds.length];
    return {
      industry,
      ...USE_CASE_TEMPLATES[templateOrder[i]]({ sub: subName, industry, flavor, rng }),
    };
  });

  // ---- section microcopy (variant picked by hash) ----
  const sectionCopy: InsightSectionCopy = {
    overviewLead: pickVariant(OVERVIEW_LEADS, rng)(subName),
    outcomesTitle: pickVariant(OUTCOMES_TITLES, rng),
    outcomesSub: pickVariant(OUTCOMES_SUBS, rng)(subName),
    useCasesTitle: pickVariant(USE_CASES_TITLES, rng)(subName),
    useCasesSub: pickVariant(USE_CASES_SUBS, rng),
  };

  return { kpis, benefitBars, gauge, useCases, sectionCopy };
};
