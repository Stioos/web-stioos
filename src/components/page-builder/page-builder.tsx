import type { PageSpec } from "@/data/pages/types";
import { HeroSection } from "./hero";
import {
  AudiencesSection,
  CaseStudySection,
  ComparisonSection,
  ContactSection,
  CoverageSection,
  CtaBandSection,
  DeliverablesSection,
  ExpertsSection,
  FaqSection,
  GlobalSection,
  GuaranteesSection,
  IndustriesSection,
  KpiSection,
  ModelsSection,
  ModulesSection,
  OutcomesSection,
  ProcessSection,
  ResourcesSection,
  SpotlightSection,
  TechSection,
  TestimonialsSection,
  TrustBarSection,
  ValuePropsSection,
} from "./page-sections";

// ============================================================
// PAGE BUILDER — composes one PageSpec into a full 24-section
// landing page. Used by /talent-solutions/[slug] and
// /talent-solutions/[slug] server routes.
// ============================================================

export function PageBuilderPage({ spec }: { spec: PageSpec }) {
  return (
    <article className="bg-brand-ink text-slate-200">
      {/* 01 */} <HeroSection spec={spec} />
      {/* 02 */} <TrustBarSection spec={spec} />
      {/* 03 */} <KpiSection spec={spec} />
      {/* 04 */} <AudiencesSection spec={spec} />
      {/* 05 */} <ValuePropsSection spec={spec} />
      {/* 06 */} <ProcessSection spec={spec} />
      {/* 07 */} <SpotlightSection spec={spec} />
      {/* 08 */} <DeliverablesSection spec={spec} />
      {/* 09 */} <ModulesSection spec={spec} />
      {/* 10 */} <TechSection spec={spec} />
      {/* 11 */} <CoverageSection spec={spec} />
      {/* 12 */} <ModelsSection spec={spec} />
      {/* 13 */} <OutcomesSection spec={spec} />
      {/* 14 */} <TestimonialsSection spec={spec} />
      {/* 15 */} <CaseStudySection spec={spec} />
      {/* 16 */} <ComparisonSection spec={spec} />
      {/* 17 */} <IndustriesSection spec={spec} />
      {/* 18 */} <GlobalSection spec={spec} />
      {/* 19 */} <GuaranteesSection spec={spec} />
      {/* 20 */} <ExpertsSection spec={spec} />
      {/* 21 */} <ResourcesSection spec={spec} />
      {/* 22 */} <FaqSection spec={spec} />
      {/* 23 */} <CtaBandSection spec={spec} />
      {/* 24 */} <ContactSection spec={spec} />
    </article>
  );
}
