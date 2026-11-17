import { divisionAccent } from "@/lib/division-accents";
import { getCategoryBySlug } from "@/data/categories";
import type { DivisionSpec } from "@/data/pages/division-types";
import {
  HeroSection,
  TrustBarSection,
  KpiBandSection,
  PainPointsSection,
  SolutionOverviewSection,
  CapabilitiesBentoSection,
  ProcessTimelineSection,
  TechRadarSection,
  BeforeAfterSection,
  SpotlightServicesSection,
  OutcomesGaugeSection,
  CaseStudySection,
  ComparisonTableSection,
  PricingModelsSection,
  IndustriesCloudSection,
  FinalCtaSection,
} from "./sections";

// ============================================================
// DIVISION LANDING — composes the 16 section designs into a
// single conversion-focused per-division page.
//
// Order alternates dark / light surfaces so the eye never
// tires of a single tone, and each section uses a distinct
// layout language (hero, marquee, KPI band, dark pain canvas,
// split dashboard, bento grid, horizontal timeline, tech radar,
// before/after bars, spotlight cards, gauge dashboard, case
// study, comparison table, pricing tiers, industry cloud,
// full-bleed CTA).
// ============================================================

export function DivisionLanding({ spec }: { spec: DivisionSpec }) {
  const category = getCategoryBySlug(spec.slug);
  const accent = divisionAccent(spec.categoryId);
  const categoryName = category?.name ?? "Division";
  const categoryIcon = category?.icon ?? "Sparkles";

  const sectionProps = {
    spec,
    accent,
    categoryName,
    categoryIcon,
  };

  return (
    <article className="bg-background">
      {/* 01 — Hero */}
      <HeroSection {...sectionProps} />
      {/* 02 — Trust marquee */}
      <TrustBarSection {...sectionProps} />
      {/* 03 — KPI band */}
      <KpiBandSection {...sectionProps} />
      {/* 04 — Cost of inaction */}
      <PainPointsSection {...sectionProps} />
      {/* 05 — Solution overview + dashboard */}
      <SolutionOverviewSection {...sectionProps} />
      {/* 06 — Capabilities bento (links to subcategories) */}
      <CapabilitiesBentoSection {...sectionProps} />
      {/* 07 — Process timeline */}
      <ProcessTimelineSection {...sectionProps} />
      {/* 08 — Tech radar */}
      <TechRadarSection {...sectionProps} />
      {/* 09 — Before / after impact */}
      <BeforeAfterSection {...sectionProps} />
      {/* 10 — Spotlight services */}
      <SpotlightServicesSection {...sectionProps} />
      {/* 11 — Outcomes gauge dashboard */}
      <OutcomesGaugeSection {...sectionProps} />
      {/* 12 — Case study */}
      <CaseStudySection {...sectionProps} />
      {/* 13 — Comparison table */}
      <ComparisonTableSection {...sectionProps} />
      {/* 14 — Pricing tiers */}
      <PricingModelsSection {...sectionProps} />
      {/* 15 — Industries cloud */}
      <IndustriesCloudSection {...sectionProps} />
      {/* 16 — Final CTA */}
      <FinalCtaSection {...sectionProps} />
    </article>
  );
}
