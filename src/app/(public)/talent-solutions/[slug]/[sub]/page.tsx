import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TALENT_PAGE_SPECS, getTalentPage } from "@/data/pages/talent-pages";
import {
  buildTalentSubSpec,
  getTalentSubSeed,
  getTalentSubSeeds,
} from "@/data/pages/talent-sub-pages";
import { PageBuilderPage } from "@/components/page-builder/page-builder";

// ============================================================
// TALENT SUB-PAGE — /talent-solutions/[option]/[sub]
// 9 options × 8 deep-dive pages = 72 pages, each rendered by
// the page builder from a deterministic sub-page spec.
// These pages are reachable only via the Talent Solutions
// secondary header strip (visible on talent pages).
// ============================================================

export function generateStaticParams() {
  return TALENT_PAGE_SPECS.flatMap((option) =>
    getTalentSubSeeds(option.slug).map((sub) => ({
      slug: option.slug,
      sub: sub.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}): Promise<Metadata> {
  const { slug, sub } = await params;
  const option = getTalentPage(slug);
  const seed = getTalentSubSeed(slug, sub);
  if (!option || !seed) return {};
  return {
    title: `${seed.title} | ${option.nav} | Talent Solutions`,
    description: seed.blurb,
  };
}

export default async function TalentSubPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const option = getTalentPage(slug);
  const seed = getTalentSubSeed(slug, sub);
  if (!option || !seed) notFound();
  return <PageBuilderPage spec={buildTalentSubSpec(option, seed)} />;
}
