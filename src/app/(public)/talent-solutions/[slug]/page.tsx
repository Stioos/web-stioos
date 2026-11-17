import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TALENT_PAGE_SPECS, getTalentPage } from "@/data/pages/talent-pages";
import { PageBuilderPage } from "@/components/page-builder/page-builder";

// ============================================================
// TALENT SOLUTIONS OPTION PAGE — /talent-solutions/[slug]
// Renders a 24-section landing page from one PageSpec.
// ============================================================

export function generateStaticParams() {
  return TALENT_PAGE_SPECS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = getTalentPage(slug);
  if (!spec) return {};
  return {
    title: `${spec.nav} | Talent Solutions`,
    description: spec.subtitle,
  };
}

export default async function TalentOptionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = getTalentPage(slug);
  if (!spec) notFound();
  return <PageBuilderPage spec={spec} />;
}
