import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSolutionSpec, SOLUTION_LIST } from "@/data/pages/solution-pages";
import { SolutionLanding } from "@/components/solution/solution-landing";
import { BottomCTABar } from "@/components/shared/bottom-cta-bar";

// ============================================================
// SOLUTION PAGE — renders the 16-section SolutionLanding for
// each of the 6 outcome-based solution bundles. Server
// component for SEO + fast first paint.
// ============================================================

export function generateStaticParams() {
  return SOLUTION_LIST.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = getSolutionSpec(slug);
  if (!spec) return { title: "Solution not found" };
  const title = `${spec.name} — Outcome-Based Solution`;
  const description = `${spec.name} — ${spec.engagementModel}. ${spec.hero.subtitle.slice(0, 120)}`;
  return {
    title,
    description,
    alternates: { canonical: `/solutions/${slug}` },
    openGraph: { title, description, url: `/solutions/${slug}`, type: "website", siteName: "STIOOS GLOBAL" },
  };
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = getSolutionSpec(slug);
  if (!spec) notFound();

  return (
    <>
      <SolutionLanding spec={spec} />
      <BottomCTABar serviceName={spec.name} />
    </>
  );
}
