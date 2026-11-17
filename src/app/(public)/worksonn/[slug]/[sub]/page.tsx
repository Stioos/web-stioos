import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKSONN_PAGE_SPECS, getWorksonnPage } from "@/data/pages/worksonn-pages";
import {
  buildWorksonnSubSpec,
  getWorksonnSubSeed,
  getWorksonnSubSeeds,
} from "@/data/pages/worksonn-sub-pages";
import { PageBuilderPage } from "@/components/page-builder/page-builder";

// ============================================================
// WORKSONN SUB-PAGE — /worksonn/[path]/[sub]
// 8 network paths × 8 deep-dive pages = 64 pages, each rendered
// by the page builder from a deterministic sub-page spec.
// These pages are reachable only via the Worksonn secondary
// header strip (visible on worksonn pages).
// ============================================================

export function generateStaticParams() {
  return WORKSONN_PAGE_SPECS.flatMap((option) =>
    getWorksonnSubSeeds(option.slug).map((sub) => ({
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
  const option = getWorksonnPage(slug);
  const seed = getWorksonnSubSeed(slug, sub);
  if (!option || !seed) return {};
  return {
    title: `${seed.title} | ${option.nav} | Worksonn Network`,
    description: seed.blurb,
  };
}

export default async function WorksonnSubPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const option = getWorksonnPage(slug);
  const seed = getWorksonnSubSeed(slug, sub);
  if (!option || !seed) notFound();
  return <PageBuilderPage spec={buildWorksonnSubSpec(option, seed)} />;
}
