import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WORKSONN_PAGE_SPECS, getWorksonnPage } from "@/data/pages/worksonn-pages";
import { PageBuilderPage } from "@/components/page-builder/page-builder";

// ============================================================
// WORKSONN OPTION PAGE — /worksonn/[slug]
// Renders a 24-section landing page from one PageSpec.
// ============================================================

export function generateStaticParams() {
  return WORKSONN_PAGE_SPECS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = getWorksonnPage(slug);
  if (!spec) return {};
  return {
    title: `${spec.nav} | Worksonn`,
    description: spec.subtitle,
  };
}

export default async function WorksonnOptionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = getWorksonnPage(slug);
  if (!spec) notFound();
  return <PageBuilderPage spec={spec} />;
}
