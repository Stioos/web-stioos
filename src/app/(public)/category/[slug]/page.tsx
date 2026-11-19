import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/data/categories";
import { getDivisionSpec } from "@/data/pages/division-pages";
import { DivisionLanding } from "@/components/division/division-landing";
import { Icon } from "@/components/shared/icon";
import { divisionAccent } from "@/lib/division-accents";
import { cn } from "@/lib/utils";

// ============================================================
// DIVISION PAGE — renders the 16-section DivisionLanding for
// every entry point in the main header (Browse Categories mega
// + division pills). Server component for SEO + fast first
// paint; per-division metadata lives in layout.tsx.
// ============================================================

export default async function DivisionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const spec = getDivisionSpec(slug);

  // Fallback for divisions without a full 16-section spec yet
  // (e.g. Talent Solutions, which has its own page-builder at
  // /talent-solutions). Render a clean directory card instead.
  if (!spec) {
    const accent = divisionAccent(category.id);
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ring-1", accent.tile)}>
            <Icon name={category.icon} className={cn("h-7 w-7", accent.icon)} />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-foreground">{category.name}</h1>
          <p className="mt-3 text-muted-foreground">{category.description}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/marketplace?category=${category.slug}`}
              className={cn("inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold text-white", accent.gradient)}
            >
              Browse services <Icon name="ArrowRight" className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground"
            >
              Request a consultation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DivisionLanding spec={spec} />
    </>
  );
}
