import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TALENT_PAGE_SPECS, getTalentPage } from "@/data/pages/talent-pages";
import {
  buildTalentSubSpec,
  getTalentSubSeed,
  getTalentSubSeeds,
} from "@/data/pages/talent-sub-pages";
import { PageBuilderPage } from "@/components/page-builder/page-builder";
import { CandidateSubPage } from "@/components/page-builder/candidate-sub-page";
import {
  TALENT_STRIP_GROUPS,
  getTalentStripGroup,
} from "@/data/talent-strip-groups";
import {
  findCandidateSubPage,
  GROUP_ICONS,
  SUB_PAGE_ICONS,
} from "@/data/pages/talent-candidate-sub-pages";

// ============================================================
// TALENT SUB-PAGE — /talent-solutions/[slug]/[sub]
//
// Handles TWO kinds of route pairs:
//
//   A. EXISTING SERVICE sub-pages — for the 9 legacy talent
//      service slugs (train-to-hire, hire-to-train,
//      corporate-training, talent-recruitment, talent-deployment,
//      workforce-solutions, talent-assessment, staffing-solutions,
//      placements). Each has 6–8 deep-dive pages rendered by the
//      page builder from a deterministic TalentSubSeed → PageSpec.
//
//   B. NEW CANDIDATE GROUP sub-pages — for the 3 candidate-side
//      groups (get-trained, get-placed, get-certified), each with
//      3 candidate-focused sub-pages (9 total). Rendered by the
//      lighter <CandidateSubPage /> template from content stored
//      in src/data/pages/talent-candidate-sub-pages.ts.
//
// Backward compatibility: branch A is unchanged from before this
// update. Branch B is the new addition.
// ============================================================

export function generateStaticParams() {
  // Branch A — legacy service × sub pairs (9 × 6–8 = 60+ pairs)
  const legacy = TALENT_PAGE_SPECS.flatMap((option) =>
    getTalentSubSeeds(option.slug).map((sub) => ({
      slug: option.slug,
      sub: sub.slug,
    }))
  );

  // Branch B — new candidate group × sub pairs (3 × 3 = 9 pairs)
  const candidate = TALENT_STRIP_GROUPS.flatMap((group) =>
    group.subPages.map((sub) => ({
      slug: group.slug,
      sub: sub.slug,
    }))
  );

  return [...legacy, ...candidate];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const { slug, sub } = await params;

  // Branch A — legacy service sub-page metadata
  const option = getTalentPage(slug);
  const seed = getTalentSubSeed(slug, sub);
  if (option && seed) {
    return {
      title: `${seed.title} | ${option.nav} | Talent Solutions`,
      description: seed.blurb,
    };
  }

  // Branch B — new candidate group sub-page metadata
  const candidate = findCandidateSubPage(slug, sub);
  if (candidate) {
    return {
      title: `${candidate.subPage.title} | ${candidate.group.name} | Talent Solutions`,
      description: candidate.subPage.description,
    };
  }

  return {};
}

export default async function TalentSubPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;

  // ── Branch A — legacy service sub-page (24-section PageSpec) ──
  const option = getTalentPage(slug);
  const seed = getTalentSubSeed(slug, sub);
  if (option && seed) {
    return <PageBuilderPage spec={buildTalentSubSpec(option, seed)} />;
  }

  // ── Branch B — new candidate group sub-page (7-section template) ──
  const candidate = findCandidateSubPage(slug, sub);
  if (candidate) {
    // Guard against an unknown group slug (defensive —
    // getTalentStripGroup is already checked inside findCandidateSubPage).
    const groupIcon = GROUP_ICONS[candidate.group.slug];
    const subPageIcon = SUB_PAGE_ICONS[candidate.subPage.slug];
    if (!groupIcon || !subPageIcon) {
      notFound();
    }
    return (
      <CandidateSubPage
        group={candidate.group}
        subPage={candidate.subPage}
        content={candidate.content}
        groupIcon={groupIcon}
        subPageIcon={subPageIcon}
      />
    );
  }

  notFound();
}

// ============================================================
// Re-export getTalentStripGroup for downstream static-param
// callers that still expect it from this module. The data lives
// in src/data/talent-strip-groups.ts.
// ============================================================
export { getTalentStripGroup };
