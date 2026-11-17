import type { SolutionSpec } from "@/data/pages/solution-types";
import {
  SolutionHeroSection,
  OutcomePromiseSection,
  ProblemSolutionSection,
  ServiceArchitectureSection,
  CapabilitiesAccordionSection,
  EngagementJourneySection,
  RoiVisualSection,
  StackGridSection,
  MetricComparisonSection,
  CaseStudiesCarouselSection,
  OutcomeScorecardSection,
  TestimonialWallSection,
  VsAlternativesSection,
  EngagementTabsSection,
  IndustriesStripSection,
  CtaFaqSection,
} from "./solution-sections";

// ============================================================
// SOLUTION LANDING — composes the 16 section designs into a
// single conversion-focused outcome-bundle page.
//
// Section order alternates dark/light surfaces and every
// section uses a DIFFERENT layout language from the division
// pages so the two page families look visually distinct.
// ============================================================

export function SolutionLanding({ spec }: { spec: SolutionSpec }) {
  const accent = spec.accent;
  const props = { spec, accent };

  return (
    <article className="bg-background">
      <SolutionHeroSection {...props} />
      <OutcomePromiseSection {...props} />
      <ProblemSolutionSection {...props} />
      <ServiceArchitectureSection {...props} />
      <CapabilitiesAccordionSection {...props} />
      <EngagementJourneySection {...props} />
      <RoiVisualSection {...props} />
      <StackGridSection {...props} />
      <MetricComparisonSection {...props} />
      <CaseStudiesCarouselSection {...props} />
      <OutcomeScorecardSection {...props} />
      <TestimonialWallSection {...props} />
      <VsAlternativesSection {...props} />
      <EngagementTabsSection {...props} />
      <IndustriesStripSection {...props} />
      <CtaFaqSection {...props} />
    </article>
  );
}
