import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Construction, FileText, BookOpen } from "lucide-react";
import { TALENT_PAGE_SPECS, getTalentPage } from "@/data/pages/talent-pages";
import { PageBuilderPage } from "@/components/page-builder/page-builder";
import { BottomCTABar } from "@/components/shared/bottom-cta-bar";
import { getTalentStripGroup } from "@/data/talent-strip-groups";
import { TALENT_INFO_PAGES } from "@/data/talent-info-pages";

// ============================================================
// TALENT SOLUTIONS OPTION PAGE — /talent-solutions/[slug]
//
// Handles TWO kinds of slugs:
//   1. EXISTING SERVICE pages (train-to-hire, hire-to-train, etc.)
//      → renders the full 24-section PageSpec landing page.
//   2. NEW GROUP pages (candidate-get-trained, employer-build-talent,
//      etc. — 6 total) → renders a PLACEHOLDER structure page while
//      the full content awaits user confirmation.
// ============================================================

export function generateStaticParams() {
  // Existing service pages — full content. The 6 new group pages are
  // not pre-rendered statically; they resolve at request time so the
  // placeholder can be replaced with full content later without a
  // build.
  return TALENT_PAGE_SPECS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = getTalentPage(slug);
  if (spec) {
    return {
      title: `${spec.nav} | Talent Solutions`,
      description: spec.subtitle,
    };
  }
  const group = getTalentStripGroup(slug);
  if (group) {
    return {
      title: `${group.name} | Talent Solutions`,
      description: group.tagline,
    };
  }
  // Info pages (Joining Terms, Learning Terms)
  const infoPage = TALENT_INFO_PAGES.find((p) => p.slug === slug);
  if (infoPage) {
    return {
      title: `${infoPage.name} | Talent Solutions`,
      description: infoPage.tagline,
    };
  }
  return {};
}

export default async function TalentOptionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ── EXISTING SERVICE — full 24-section landing page ──
  const spec = getTalentPage(slug);
  if (spec) {
    return (
      <>
        <PageBuilderPage spec={spec} />
        <BottomCTABar serviceName={spec.nav} />
      </>
    );
  }

  // ── NEW GROUP PAGE — placeholder structure awaiting confirmation ──
  const group = getTalentStripGroup(slug);
  if (group) {
    return <TalentGroupPlaceholder groupSlug={slug} />;
  }

  // ── INFO PAGE (Joining Terms, Learning Terms) — placeholder ──
  const infoPage = TALENT_INFO_PAGES.find((p) => p.slug === slug);
  if (infoPage) {
    return <TalentInfoPlaceholder infoSlug={slug} />;
  }

  notFound();
}

// ============================================================
// TALENT GROUP PLACEHOLDER — shown for the 6 new grouped options
// (candidate-get-trained, candidate-get-placed, candidate-get-certified,
//  employer-build-talent, employer-hire-talent, employer-scale-workforce).
//
// This is STRUCTURE ONLY: it confirms the route resolves, shows the
// group identity and the existing services that belong to it, and
// surfaces the "page in development" notice. Full page content is
// built after user confirmation.
// ============================================================

function TalentGroupPlaceholder({ groupSlug }: { groupSlug: string }) {
  const group = getTalentStripGroup(groupSlug);
  if (!group) return null;

  const sideLabel =
    group.side === "candidate" ? "For Job Seekers" : "For Employers";

  return (
    <article className="min-h-[60vh] bg-brand-ink text-slate-200">
      {/* Hero — identity + "in development" notice */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Link
            href="/talent-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Talent Solutions
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 ring-1 ring-white/20">
              <group.icon className="h-7 w-7 text-white" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">
                {sideLabel} · Talent Solutions Group
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {group.name}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            {group.tagline}
          </p>

          {/* In-development notice */}
          <div className="mt-8 inline-flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3 text-amber-200">
            <Construction className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-bold">Page in development</p>
              <p className="mt-0.5 text-xs leading-relaxed text-amber-200/80">
                This is a placeholder structure for the new{" "}
                <strong>{group.name}</strong> group page. Full content (hero,
                capabilities, process, FAQs) is built after your
                confirmation. In the meantime, every service in this group
                is reachable below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services in this group — these pages ARE fully built */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-amber-400">Available now</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Services in the {group.name} group
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              {group.services.length} existing talent solutions belong to
              this group — every one is fully built and ready to explore.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/talent-solutions/${svc.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/15 ring-1 ring-amber-500/20">
                  <svc.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white md:text-lg">
                  {svc.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {svc.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 transition-colors group-hover:text-amber-300">
                  Open service page
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

// ============================================================
// TALENT INFO PLACEHOLDER — shown for the 2 informational pages
// (joining-terms, learning-terms). Structure only — full content
// built after user confirmation.
// ============================================================

function TalentInfoPlaceholder({ infoSlug }: { infoSlug: string }) {
  const info = TALENT_INFO_PAGES.find((p) => p.slug === infoSlug);
  if (!info) return null;

  return (
    <article className="min-h-[60vh] bg-brand-ink text-slate-200">
      {/* Hero — identity + "in development" notice */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Link
            href="/talent-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Talent Solutions
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30 ring-1 ring-white/20">
              <info.icon className="h-7 w-7 text-white" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                Talent Solutions · Information
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {info.name}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            {info.tagline}
          </p>

          {/* In-development notice */}
          <div className="mt-8 inline-flex items-start gap-3 rounded-xl border border-sky-400/30 bg-sky-400/[0.06] px-4 py-3 text-sky-200">
            <Construction className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-bold">Page in development</p>
              <p className="mt-0.5 text-xs leading-relaxed text-sky-200/80">
                This is a placeholder structure for the{" "}
                <strong>{info.name}</strong> page. Full content is built after
                your confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Description section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-amber-400">Overview</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              {info.name} — what to expect
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              {info.description}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-brand-navy p-8">
            <p className="text-sm leading-relaxed text-slate-300">
              This page will cover everything you need to know about{" "}
              <strong className="text-white">{info.name.toLowerCase()}</strong>{" "}
              — structured as a clear, scannable reference with sections,
              infographics and FAQs. The content will be developed once the
              overall structure is confirmed.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400"
              >
                Talk to a talent expert
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/talent-solutions"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore talent solutions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
