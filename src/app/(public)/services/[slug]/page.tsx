import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Search,
  LayoutGrid,
  Plug,
  BarChart3,
  Rocket,
  Bot,
  Code2,
  Palette,
  Megaphone,
  Building2,
  Lightbulb,
  Wallet,
  Target,
  CheckCircle2,
  Phone,
  HelpCircle,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import {
  SERVICE_PAGE_SLUGS,
  getServicePage,
  resolveRelatedServices,
  type ServicePageSpec,
} from "@/data/service-pages-data";

// ============================================================
// SERVICE LANDING PAGE — /services/[slug]
//
// Server component (no "use client"). Renders one of 55 SEO/AEO-
// optimized service landing pages from src/data/service-pages-data.
//
// Structure (7 sections):
//   1. Hero — title, subtitle, 2 CTAs, 3 hero stats
//   2. Overview — 2-paragraph description of what the service delivers
//   3. Capabilities grid — 6 cards with icon, title, description
//   4. Process timeline — 5-step timeline with durations
//   5. Benefits / outcomes — 4 stat cards with metrics + descriptions
//   6. FAQ section — 6 AEO-optimized Q&As (native <details>)
//   7. CTA band — final conversion section with 2 CTAs
//
// SEO/AEO:
//   • generateStaticParams pre-renders all 55 slugs at build
//   • generateMetadata emits title + description (≤160 chars) + OG/Twitter
//   • FAQPage JSON-LD structured data so AI answer engines can parse
//     and cite the Q&As directly (Perplexity, Google AI Overviews, etc.)
//   • BreadcrumbList JSON-LD anchors the page in the site hierarchy
// ============================================================

// ------------------------------------------------------------
// Division iconography — a Lucide icon per division, used for the
// hero badge + the overview eyebrow. Stays amber-forward, no
// indigo/blue primary.
// ------------------------------------------------------------
const DIVISION_ICON: Record<string, LucideIcon> = {
  "ai-workflow-automation": Workflow,
  "custom-ai-agentic-services": Bot,
  "tech-programming-services": Code2,
  "multimedia-graphic-design": Palette,
  "digital-sales-ai-marketing": Megaphone,
  "business-enterprise-services": Building2,
  "consultation-solutions": Lightbulb,
  "startup-accounting": Wallet,
  "branding-marketing-strategy": Target,
};

// 6 capability icons — generic enough to map to any division's
// capability list (audit → design → integration → guardrails →
// monitoring → scaling). Stable per index.
const CAPABILITY_ICONS: LucideIcon[] = [
  Search,
  LayoutGrid,
  Plug,
  ShieldCheck,
  BarChart3,
  Rocket,
];

// Process step icon set — 5 steps (Discover/Design/Build/Pilot/Rollout).
const PROCESS_ICONS: LucideIcon[] = [Search, LayoutGrid, Code2, Rocket, CheckCircle2];

// ------------------------------------------------------------
// generateStaticParams — pre-render all 55 slugs at build time.
// ------------------------------------------------------------
export function generateStaticParams() {
  return SERVICE_PAGE_SLUGS.map((slug) => ({ slug }));
}

// Unknown slugs (not in SERVICE_PAGE_SLUGS) return a real 404 at
// the routing layer instead of being rendered on-demand — keeps
// the route fully static and avoids orphan pages from inbound
// bad links.
export const dynamicParams = false;

// ------------------------------------------------------------
// generateMetadata — SEO title + description (≤160 chars),
// OpenGraph + Twitter cards, canonical URL.
// ------------------------------------------------------------
const SITE_URL = "https://stioos.global";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = getServicePage(slug);
  if (!spec) return {};

  const title = `${spec.name} | ${spec.division} Services`;
  const description = spec.shortDescription;
  const url = `${SITE_URL}/services/${spec.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "STIOOS GLOBAL",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ============================================================
// PAGE — server component, fetches the spec by slug and renders.
// ============================================================
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spec = getServicePage(slug);
  if (!spec) notFound();

  const DivisionIcon = DIVISION_ICON[spec.divisionId] ?? Sparkles;
  const relatedSpecs = resolveRelatedServices(spec.relatedServices);

  return (
    <article className="bg-brand-ink text-slate-200">
      {/* ─────────────────────────────────────────────────────────
          JSON-LD STRUCTURED DATA
          • FAQPage schema — AEO play: lets ChatGPT, Perplexity,
            Google AI Overviews parse and cite the Q&As directly.
          • BreadcrumbList — anchors the page in the site hierarchy.
          • Service schema — service type, provider, area served.
          ───────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(spec)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd(spec)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(spec)),
        }}
      />

      <ServiceHero spec={spec} divisionIcon={DivisionIcon} />
      <ServiceOverview spec={spec} divisionIcon={DivisionIcon} />
      <ServiceCapabilities spec={spec} />
      <ServiceProcess spec={spec} />
      <ServiceBenefits spec={spec} />
      <ServiceFAQ spec={spec} />
      <ServiceCTABand spec={spec} />
      {relatedSpecs.length > 0 && (
        <ServiceRelated current={spec} related={relatedSpecs} />
      )}
    </article>
  );
}

// ============================================================
// SECTION 1 — HERO
// Title + subtitle, 2 CTAs (primary: Get a Quote, secondary:
// Schedule Consultation), 3 hero stats.
// ============================================================
function ServiceHero({
  spec,
  divisionIcon: DivisionIcon,
}: {
  spec: ServicePageSpec;
  divisionIcon: LucideIcon;
}) {
  // 3 hero stats: delivery timeline (constant for templated
  // processes), top benefit metric, and the 30-day stabilization
  // constant.
  const heroStats = [
    {
      icon: Clock,
      value: "6-8 wks",
      label: "Delivery timeline",
      detail: "Discovery to production rollout, with weekly demos.",
    },
    {
      icon: TrendingUp,
      value: spec.benefits[0]?.metric ?? "ROI",
      label: spec.benefits[0]?.label ?? "Measurable outcome",
      detail: spec.benefits[0]?.description ?? "",
    },
    {
      icon: ShieldCheck,
      value: "30-day",
      label: "Stabilization included",
      detail:
        "Post-launch bug fixes, tuning, and team enablement at no extra cost.",
    },
  ];

  return (
    <section
      id="overview"
      className="relative scroll-mt-36 overflow-hidden border-b border-white/[0.06]"
      aria-label={`${spec.name} overview`}
    >
      <div
        className="pointer-events-none absolute inset-0 surface-grid opacity-40"
        aria-hidden="true"
      />
      {/* Amber glow from top-right */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        {/* Breadcrumb back-link */}
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Services
        </Link>

        {/* Division eyebrow + icon */}
        <div className="mt-6 flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 ring-1 ring-white/20">
            <DivisionIcon className="h-7 w-7 text-white" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">
              {spec.division} · Service
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
              {spec.name}
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
          {spec.heroSubtitle}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-11 rounded-xl bg-amber-500 px-6 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400"
          >
            <Link href="/contact" className="gap-2">
              <Target className="h-4 w-4" aria-hidden="true" />
              Get a Quote
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 rounded-xl border border-white/20 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Link href="/contact" className="gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Schedule Consultation
            </Link>
          </Button>
        </div>

        {/* Hero stats — 3 cards */}
        <Reveal delay={0.1}>
          <dl className="mt-12 grid gap-4 sm:grid-cols-3">
            {heroStats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.08] bg-brand-navy p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20">
                      <StatIcon
                        className="h-4 w-4 text-amber-400"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {stat.label}
                      </dt>
                      <dd className="text-xl font-bold tracking-tight text-white">
                        {stat.value}
                      </dd>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {stat.detail}
                  </p>
                </div>
              );
            })}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 2 — OVERVIEW
// 2-paragraph description of what the service delivers.
// ============================================================
function ServiceOverview({
  spec,
  divisionIcon: DivisionIcon,
}: {
  spec: ServicePageSpec;
  divisionIcon: LucideIcon;
}) {
  return (
    <section
      id="about"
      className="scroll-mt-36 py-16 md:py-24"
      aria-label={`About ${spec.name}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          {/* Left rail — sticky eyebrow + division badge */}
          <Reveal as="aside" className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-amber-400">Overview</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              What this service delivers
            </h2>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-brand-navy px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
              <DivisionIcon className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              {spec.division}
            </div>
          </Reveal>

          {/* Right rail — 2 paragraphs */}
          <Reveal as="div" delay={0.05}>
            <div className="space-y-6 text-base leading-relaxed text-slate-300 md:text-lg">
              <p>
                <strong className="font-semibold text-white">{spec.name}</strong>{" "}
                is a {spec.division.toLowerCase()} engagement built for teams that
                need measurable outcomes, not deliverables that sit on a shelf.
                We start every engagement with a quantified baseline — what&apos;s
                working, what&apos;s broken, what&apos;s at risk — so the work we
                do together is anchored to a number you can defend to your
                board. {spec.shortDescription}
              </p>
              <p>
                The engagement is delivered by senior practitioners in your
                domain, integrated into your existing CRM, ERP, and internal
                tools (no rip-and-replace), and shipped with the guardrails
                every production system needs: monitoring, alerting, audit
                logs, and a 30-day stabilization window included at no extra
                cost. Whether you are scaling a proven workflow, modernizing a
                legacy system, or launching a new capability from scratch,
                this service gives you one accountable partner from scoping to
                rollout — with delivery SLAs and a measurable success
                scorecard you sign off on before any code is written.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 3 — CAPABILITIES GRID
// 6 cards with icon, title, description.
// ============================================================
function ServiceCapabilities({ spec }: { spec: ServicePageSpec }) {
  return (
    <section
      id="capabilities"
      className="scroll-mt-36 border-t border-white/[0.06] py-16 md:py-24"
      aria-label={`${spec.name} capabilities`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber-400">Capabilities</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            What&apos;s included in {spec.name}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Six production-grade capabilities ship with every engagement —
            each staffed by senior practitioners and tied to a measurable
            outcome.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {spec.capabilities.map((cap, idx) => {
            const CapIcon = CAPABILITY_ICONS[idx % CAPABILITY_ICONS.length];
            return (
              <Reveal key={cap.title} delay={idx * 0.05}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/15 ring-1 ring-amber-500/20">
                    <CapIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {cap.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 4 — PROCESS TIMELINE
// 5-step vertical timeline with durations.
// ============================================================
function ServiceProcess({ spec }: { spec: ServicePageSpec }) {
  return (
    <section
      id="process"
      className="scroll-mt-36 border-t border-white/[0.06] py-16 md:py-24"
      aria-label={`${spec.name} delivery process`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber-400">Process</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            How {spec.name} is delivered
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            A structured five-step engagement — discovery to rollout — with
            weekly demos, measurable success criteria, and a
            production-ready pilot inside the first month.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ol className="mt-12 space-y-6 lg:space-y-0">
            {spec.process.map((step, idx) => {
              const StepIcon = PROCESS_ICONS[idx % PROCESS_ICONS.length];
              const isLast = idx === spec.process.length - 1;
              return (
                <li
                  key={step.title}
                  className="relative lg:grid lg:grid-cols-[180px_1fr] lg:gap-8"
                >
                  {/* Duration column — only on lg+ */}
                  <div className="hidden lg:block">
                    <div className="sticky top-32">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/20">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {step.duration}
                      </span>
                    </div>
                  </div>

                  {/* Step body */}
                  <div className="relative rounded-2xl border border-white/[0.08] bg-brand-navy p-6">
                    {/* Mobile duration badge */}
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/20 lg:hidden">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {step.duration}
                    </span>

                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-brand-ink shadow-lg shadow-amber-500/20">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <StepIcon
                            className="h-4 w-4 shrink-0 text-amber-400"
                            aria-hidden="true"
                          />
                          <h3 className="text-base font-semibold text-white">
                            {step.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical connector — only on lg+, not after last */}
                  {!isLast && (
                    <span
                      className="absolute left-[88px] top-full hidden h-6 w-px bg-white/[0.08] lg:block"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 5 — BENEFITS / OUTCOMES
// 4 stat cards with metrics + descriptions.
// ============================================================
function ServiceBenefits({ spec }: { spec: ServicePageSpec }) {
  return (
    <section
      id="benefits"
      className="scroll-mt-36 border-t border-white/[0.06] py-16 md:py-24"
      aria-label={`${spec.name} outcomes and benefits`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber-400">Outcomes</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Measurable results you can expect
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Every engagement is anchored to a quantified success scorecard.
            These are the typical outcomes clients see within 90 days of
            rollout.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {spec.benefits.map((b, idx) => (
            <Reveal key={b.label} delay={idx * 0.05}>
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-brand-navy to-brand-ink p-6">
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl"
                  aria-hidden="true"
                />
                <p className="text-3xl font-bold tracking-tight text-amber-400 md:text-4xl">
                  {b.metric}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {b.label}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  {b.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 6 — FAQ
// 6 AEO-optimized Q&As — native <details> for SSR-friendly,
// JS-free expand/collapse (also crawlable by search engines).
// ============================================================
function ServiceFAQ({ spec }: { spec: ServicePageSpec }) {
  return (
    <section
      id="faq"
      className="scroll-mt-36 border-t border-white/[0.06] py-16 md:py-24"
      aria-label={`${spec.name} frequently asked questions`}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber-400">FAQ</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            {spec.name} — frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Natural-language answers to the questions buyers actually ask —
            phrased the way ChatGPT, Perplexity, and Google AI Overviews
            parse them.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-brand-navy">
            {spec.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group px-6 py-4 open:bg-amber-500/[0.03]"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <span className="flex items-start gap-3 text-sm font-semibold text-white md:text-base">
                    <HelpCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                      aria-hidden="true"
                    />
                    {faq.q}
                  </span>
                  <span
                    className="mt-1 shrink-0 text-amber-400 transition-transform duration-200 group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 pl-7 text-sm leading-relaxed text-slate-400 md:text-base">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>

        {/* Quick contact prompt */}
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-brand-navy p-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-amber-400" aria-hidden="true" />
              <p className="text-sm text-slate-300">
                Still have questions?{" "}
                <span className="font-semibold text-white">
                  Book a scoping call
                </span>{" "}
                — we&apos;ll answer them in 30 minutes.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              className="h-9 rounded-lg bg-amber-500 px-4 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400"
            >
              <Link href="/contact" className="gap-2">
                Talk to an expert
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// SECTION 7 — CTA BAND
// Final conversion section with 2 CTAs.
// ============================================================
function ServiceCTABand({ spec }: { spec: ServicePageSpec }) {
  return (
    <section
      id="get-started"
      className="scroll-mt-36 border-t border-white/[0.06] py-16 md:py-24"
      aria-label={`Get started with ${spec.name}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-brand-navy via-brand-ink to-brand-navy p-8 sm:p-12 lg:p-16">
            {/* Amber glow accents */}
            <div
              className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
              {/* Copy */}
              <div>
                <p className="eyebrow text-amber-400">Get started</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Ready to launch{" "}
                  <span className="text-amber-400">{spec.name}</span>?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                  Book a 30-minute scoping call and walk away with a
                  fixed-quote proposal within three business days. No
                  pressure, no obligation — just a clear plan for measurable
                  outcomes.
                </p>

                {/* Trust signals */}
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    "Senior practitioners only",
                    "Fixed-scope proposals in 48-72 hours",
                    "30-day stabilization included",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs font-medium text-slate-300"
                    >
                      <CheckCircle2
                        className="h-4 w-4 text-amber-400"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA stack */}
              <div className="flex flex-col gap-3 lg:items-end">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-amber-500 px-6 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400"
                >
                  <Link href="/contact" className="gap-2">
                    <Target className="h-4 w-4" aria-hidden="true" />
                    Get a Quote
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border border-white/20 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Link href="/contact" className="gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    Schedule Consultation
                  </Link>
                </Button>
                <Link
                  href="/marketplace"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-amber-400 lg:justify-end"
                >
                  Or browse the full marketplace
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ============================================================
// RELATED SERVICES — 3 cards linking to sibling specs.
// ============================================================
function ServiceRelated({
  current,
  related,
}: {
  current: ServicePageSpec;
  related: ServicePageSpec[];
}) {
  return (
    <section
      id="related"
      className="scroll-mt-36 border-t border-white/[0.06] py-16 md:py-24"
      aria-label={`Related services to ${current.name}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber-400">Related Services</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
            Frequently paired with {current.name}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">
            Three services clients commonly engage alongside this one — same
            senior team, same accountable delivery model.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((rel, idx) => {
            const RelIcon = DIVISION_ICON[rel.divisionId] ?? Sparkles;
            return (
              <Reveal key={rel.slug} delay={idx * 0.05}>
                <Link
                  href={`/services/${rel.slug}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/15 ring-1 ring-amber-500/20">
                    <RelIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-400">
                    {rel.division}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-white">
                    {rel.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {rel.shortDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 transition-colors group-hover:text-amber-300">
                    Open service page
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// JSON-LD STRUCTURED DATA — emitted inline so answer engines
// (ChatGPT, Perplexity, Google AI Overviews) can parse the
// FAQ + service identity directly from the page markup.
// ============================================================

function faqJsonLd(spec: ServicePageSpec) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: spec.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

function serviceJsonLd(spec: ServicePageSpec) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: spec.name,
    serviceType: spec.division,
    description: spec.shortDescription,
    provider: {
      "@type": "Organization",
      name: "STIOOS GLOBAL",
      url: SITE_URL,
    },
    areaServed: "Worldwide",
    url: `${SITE_URL}/services/${spec.slug}`,
  };
}

function breadcrumbJsonLd(spec: ServicePageSpec) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: spec.name,
        item: `${SITE_URL}/services/${spec.slug}`,
      },
    ],
  };
}
