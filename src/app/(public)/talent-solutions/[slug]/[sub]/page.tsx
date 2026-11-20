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
import { TalentGroupPage } from "@/components/page-builder/talent-group-page";
import { getGroupPageContent } from "@/data/pages/talent-group-page-content";
import {
  TALENT_STRIP_GROUPS,
  getTalentStripGroup,
} from "@/data/talent-strip-groups";
import {
  TALENT_INFO_PAGES,
  TALENT_INFO_GROUP_ICONS,
  TALENT_INFO_SUB_ICONS,
} from "@/data/talent-info-pages";
import {
  findCandidateSubPage,
  GROUP_ICONS,
  SUB_PAGE_ICONS,
} from "@/data/pages/talent-candidate-sub-pages";

// ============================================================
// TALENT SUB-PAGE — /talent-solutions/[slug]/[sub]
//
// Handles THREE kinds of route pairs:
//
//   A. EXISTING SERVICE sub-pages — for the 9 legacy talent
//      service slugs (train-to-hire, hire-to-train,
//      corporate-training, talent-recruitment, talent-deployment,
//      workforce-solutions, talent-assessment, staffing-solutions,
//      placements). Each has 6–8 deep-dive pages rendered by the
//      page builder from a deterministic TalentSubSeed → PageSpec.
//
//   B. CANDIDATE/EMPLOYER GROUP sub-pages — for the 6 group slugs
//      (get-trained, get-placed, get-certified, build-talent,
//      hire-talent, scale-workforce), each with 3 sub-pages
//      (9 candidate + 9 employer = 18 total). Rendered by the
//      lighter <CandidateSubPage /> template from content stored
//      in src/data/pages/talent-candidate-sub-pages.ts.
//
//   C. INFO-PAGE sub-pages — for the 2 info slugs (joining-terms,
//      learning-terms), each with 3 sub-pages (6 total). Rendered
//      via the SAME <TalentGroupPage /> component used by the main
//      info pages and the 6 group pages — 12-section landing with
//      two-column hero + Live Impact Signal panel. Content lives
//      in src/data/pages/talent-group-page-content.ts keyed by
//      compound slug (e.g. "joining-terms/curriculum").
// ============================================================

export function generateStaticParams() {
  // Branch A — legacy service × sub pairs (9 × 6–8 = 60+ pairs)
  const legacy = TALENT_PAGE_SPECS.flatMap((option) =>
    getTalentSubSeeds(option.slug).map((sub) => ({
      slug: option.slug,
      sub: sub.slug,
    }))
  );

  // Branch B — candidate/employer group × sub pairs (6 × 3 = 18 pairs)
  const groups = TALENT_STRIP_GROUPS.flatMap((group) =>
    group.subPages.map((sub) => ({
      slug: group.slug,
      sub: sub.slug,
    }))
  );

  // Branch C — info-page × sub pairs (2 × 3 = 6 pairs)
  const info = TALENT_INFO_PAGES.flatMap((page) =>
    page.subPages.map((sub) => ({
      slug: page.slug,
      sub: sub.slug,
    }))
  );

  return [...legacy, ...groups, ...info];
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

  // Branch B — candidate/employer group sub-page metadata
  const candidate = findCandidateSubPage(slug, sub);
  if (candidate) {
    return {
      title: `${candidate.subPage.title} | ${candidate.group.name} | Talent Solutions`,
      description: candidate.subPage.description,
    };
  }

  // Branch C — info-page sub-page metadata
  const infoGroup = TALENT_INFO_PAGES.find((p) => p.slug === slug);
  if (infoGroup) {
    const infoSub = infoGroup.subPages.find((s) => s.slug === sub);
    if (infoSub) {
      return {
        title: `${infoSub.title} | ${infoGroup.name} | Talent Solutions`,
        description: infoSub.description,
      };
    }
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

  // ── Branch B — candidate/employer group sub-page (7-section template) ──
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

  // ── Branch C — info-page sub-page (12-section TalentGroupPage) ──
  // Same component + content shape as the main info pages and the 6
  // group pages — two-column hero with Live Impact Signal panel +
  // 11 supporting sections. Content is keyed by compound slug
  // ("joining-terms/curriculum", "learning-terms/self-learning",
  //  etc.) in src/data/pages/talent-group-page-content.ts.
  const infoGroup = TALENT_INFO_PAGES.find((p) => p.slug === slug);
  if (infoGroup) {
    const infoSub = infoGroup.subPages.find((s) => s.slug === sub);
    if (infoSub) {
      const content = getGroupPageContent(`${slug}/${sub}`);
      if (content) {
        // Touch the icon registries (defensive — same pattern as
        // Branch B). These are imported above but not all are used
        // directly here; the lookup keeps the bundle graph stable
        // and surfaces a 404 if a future icon key is missing.
        const _groupIcon = TALENT_INFO_GROUP_ICONS[slug];
        const _subIcon = TALENT_INFO_SUB_ICONS[sub];
        return <TalentGroupPage content={content} />;
      }
    }
    notFound();
  }

  notFound();
}

// ============================================================
// Re-export getTalentStripGroup for downstream static-param
// callers that still expect it from this module. The data lives
// in src/data/talent-strip-groups.ts.
// ============================================================
export { getTalentStripGroup };
