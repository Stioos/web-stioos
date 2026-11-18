"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { format } from "date-fns";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Globe,
  Info,
  Layers,
  SearchX,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import type { Service } from "@/types";
import { useAppStore } from "@/lib/store";
import { getCategoryById, getSubcategoryById } from "@/data/categories";
import { INDUSTRIES } from "@/data/content";
import { cn } from "@/lib/utils";
import { divisionAccent } from "@/lib/division-accents";
import { subIconFor } from "@/lib/sub-icons";
import {
  deliveryLabel,
  slugify,
} from "@/lib/marketplace-utils";
import { Icon } from "@/components/shared/icon";
import { ServiceCard } from "@/components/marketplace/service-card";
import { RequestServiceDialog } from "@/components/marketplace/request-service-dialog";
import { LeadModal, type LeadType } from "@/components/shared/lead-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageActionBar } from "@/components/shared/page-action-bar";
import { buildServiceInsights } from "@/lib/service-insights";
import { ServiceOutcomes } from "@/components/marketplace/service-outcomes";
import { ServiceUseCases } from "@/components/marketplace/service-use-cases";

// ============================================================
// SERVICE DETAIL PAGE — /marketplace/[slug]
// Redesigned to mirror the subcategory (capability area) page:
// division-accent hero with gradient tile + glass stats panel,
// accent-driven section system (eyebrow labels, gradient process
// tiles, 2-col FAQ, navy CTA band, back-to-division card).
// Service data + the four admin-configurable CTAs (Settings →
// Marketplace) are preserved exactly.
// ============================================================

// ---------- small local pieces ----------

const emptySubscribe = () => () => {};
/** True once the component tree has hydrated on the client. */
function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}


const VALUE_ICONS = [Zap, ShieldCheck, TrendingUp, Layers] as const;

const FALLBACK_PROCESS = [
  {
    title: "Discover & scope",
    description:
      "A senior architect maps your goals, constraints, and success metrics in a free discovery call — no obligation.",
  },
  {
    title: "Proposal in 48h",
    description:
      "You receive a fixed-scope proposal with deliverables, timeline, and a clear statement of work — ready to sign.",
  },
  {
    title: "Build & iterate",
    description:
      "Dedicated experts deliver in weekly sprints with live demos, so you see progress from day one.",
  },
  {
    title: "Launch & scale",
    description:
      "Handover with documentation and training, then optional managed support that grows with your roadmap.",
  },
];

function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading service">
      <div className="bg-brand-ink">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="grid lg:grid-cols-[1.35fr_1px_1fr]">
              <div className="space-y-4 p-5 sm:p-7 lg:p-8">
                {/* Routing pills ghost — inside the card (client annotation) */}
                <Skeleton className="h-7 w-72 rounded-full bg-white/10" />
                <div className="flex items-center gap-4 sm:gap-5">
                  <Skeleton className="h-16 w-16 shrink-0 rounded-2xl bg-white/10 sm:h-[72px] sm:w-[72px]" />
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <Skeleton className="h-6 w-40 rounded-full bg-white/10" />
                    <Skeleton className="h-7 w-full max-w-md bg-white/10" />
                  </div>
                </div>
                <Skeleton className="h-5 w-full max-w-2xl bg-white/10" />
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-28 rounded-full bg-white/10" />
                  <Skeleton className="h-7 w-32 rounded-full bg-white/10" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-11 w-36 rounded-xl bg-white/10" />
                  <Skeleton className="h-11 w-44 rounded-xl bg-white/10" />
                </div>
              </div>
              <div className="hidden bg-white/[0.07] lg:block" aria-hidden="true" />
              <div className="space-y-4 border-t border-white/[0.07] p-5 sm:p-7 lg:border-t-0 lg:p-8">
                <Skeleton className="h-4 w-52 bg-white/10" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-20 rounded-xl bg-white/10" />
                  <Skeleton className="h-20 rounded-xl bg-white/10" />
                </div>
                <Skeleton className="h-16 rounded-xl bg-white/10" />
                <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
                <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceNotFoundPanel() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
        <SearchX className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Service not found</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        This service may have been unpublished, renamed, or removed from the marketplace.
        Explore the marketplace to find the capability you need.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/marketplace">Back to Marketplace</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact our team</Link>
        </Button>
      </div>
    </div>
  );
}

// ---------- page ----------

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const services = useAppStore((s) => s.services);
  // The generated catalog fill arrives as a deferred chunk after first
  // paint — until then a missing service is "not loaded YET", not
  // "not found", so deep links hold the skeleton instead of an error.
  const catalogReady = useAppStore((s) => s.catalogReady);
  const mounted = useIsHydrated();
  const heroCtaPrimary = useAppStore((s) => s.marketplaceSettings.heroCtaPrimary);
  const heroCtaSecondary = useAppStore((s) => s.marketplaceSettings.heroCtaSecondary);
  const cardCtaPrimary = useAppStore((s) => s.marketplaceSettings.cardCtaPrimary);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestServiceTarget, setRequestServiceTarget] = useState<Service | null>(null);
  // hero CTAs: quote / consultation share one LeadModal instance
  const [heroLead, setHeroLead] = useState<LeadType | null>(null);

  const service = useMemo(
    () => services.find((s) => s.slug === slug && s.status === "published"),
    [services, slug]
  );

  const related = useMemo(() => {
    if (!service) return [];
    const others = services.filter((s) => s.status === "published" && s.id !== service.id);
    const sameCategory = others
      .filter((s) => s.categoryId === service.categoryId)
      .sort((a, b) => b.popularity - a.popularity);
    const featuredOthers = others
      .filter((s) => s.featured && s.categoryId !== service.categoryId)
      .sort((a, b) => b.popularity - a.popularity);
    const picks: Service[] = [...sameCategory];
    for (const candidate of featuredOthers) {
      if (picks.length >= 3) break;
      if (!picks.some((p) => p.id === candidate.id)) picks.push(candidate);
    }
    return picks.slice(0, 3);
  }, [services, service]);

  // Deterministic per-service infographic content (KPIs, bars, gauge, use cases, copy)
  const insights = useMemo(
    () => (service ? buildServiceInsights(service) : null),
    [service]
  );

  if (!mounted) return <DetailSkeleton />;
  if (!service) return catalogReady ? <ServiceNotFoundPanel /> : <DetailSkeleton />;

  const category = getCategoryById(service.categoryId);
  const subcategory = getSubcategoryById(service.subcategoryId);
  const accent = divisionAccent(category?.id ?? "");
  const serviceIcon = service.icon;

  const openRequest = () => {
    setRequestServiceTarget(service);
    setRequestOpen(true);
  };
  const openHeroLead = (type: LeadType) => setHeroLead(type);

  const paragraphs = service.fullDescription
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length < 2) {
    paragraphs.push(
      "Every engagement is delivered by a dedicated senior team following STIOOS's proven delivery framework — transparent scope, weekly demos, measurable outcomes, and complete documentation at handover."
    );
  }

  const processSteps =
    service.process.length > 0 ? service.process : FALLBACK_PROCESS;

  const facts: { label: string; value: React.ReactNode }[] = [
    {
      label: "Category",
      value: category ? (
        <Link
          href={`/category/${category.slug}`}
          className="transition-colors hover:text-primary"
        >
          {category.name}
        </Link>
      ) : (
        "—"
      ),
    },
    {
      label: "Subcategory",
      value: subcategory ? (
        <Link
          href={`/category/${category?.slug}/${subcategory.slug}`}
          className="transition-colors hover:text-primary"
        >
          {subcategory.name}
        </Link>
      ) : (
        "—"
      ),
    },
    { label: "Delivery", value: deliveryLabel(service) },
    { label: "Timeline", value: service.timeline },
    {
      label: "Rating",
      value: `${service.rating.toFixed(1)} / 5 (${service.reviews} reviews)`,
    },
    { label: "Technologies", value: `${service.technologies.length} tools & platforms` },
    {
      label: "Updated",
      value: format(new Date(service.updatedAt), "MMM d, yyyy"),
    },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      {/* ---------- Page action bar ---------- */}
      <PageActionBar
        items={[
          { label: "Home", href: "/" },
          ...(category
            ? [
                {
                  label: category.name,
                  href: `/category/${category.slug}`,
                },
              ]
            : []),
          ...(subcategory && category
            ? [
                {
                  label: subcategory.name,
                  href: `/category/${category.slug}/${subcategory.slug}`,
                },
              ]
            : []),
          { label: service.name },
        ]}
        serviceName={service.name}
      />

      {/* ============================ HERO ============================ */}
      <section id="hero" className="relative overflow-hidden border-b border-white/5 bg-brand-ink">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background: `radial-gradient(ellipse 55% 75% at 35% 0%, ${accent.glow}, transparent 70%)`,
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
          aria-hidden="true"
          style={{ background: accent.glow }}
        />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 pt-4 pb-12 sm:px-6 sm:pt-6 sm:pb-16 lg:px-8">
          {/* Merged hero card — identity + "why" panel in one surface (client annotation);
              routing pills live INSIDE the card at the top of the left column */}
          <div className="anim-rise relative" style={{ animationDelay: "0.1s" }}>
            <div
              className="pointer-events-none absolute -inset-5 hidden rounded-3xl opacity-50 blur-2xl sm:block"
              style={{ background: accent.glow }}
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
              <div className="grid lg:grid-cols-[1.35fr_1px_1fr]">
                {/* Left — routing pills + identity + CTAs */}
                <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                  {/* Routing pills — inside the card, above the identity row (client annotation) */}
                  {(category || subcategory) && (
                    <div className="anim-pop-sm mb-4 flex flex-wrap items-center gap-2 sm:mb-5 sm:gap-3">
                      {category && (
                        <Link
                          href={`/category/${category.slug}`}
                          className="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
                        >
                          <Icon name={category.icon} className={cn("h-3.5 w-3.5", accent.icon)} aria-hidden="true" />
                          {category.name}
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </Link>
                      )}
                      {subcategory && category && (
                        <Link
                          href={`/category/${category.slug}/${subcategory.slug}`}
                          className="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
                        >
                          {subcategory.name}
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  )}
                  {/* Icon tile with the service title directly opposite it — max 2 lines */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <span
                      className={cn(
                        "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 sm:h-[72px] sm:w-[72px]",
                        accent.gradient,
                        accent.heroRing
                      )}
                    >
                      <Icon name={serviceIcon} className="h-8 w-8 text-white sm:h-9 sm:w-9" />
                    </span>
                    <div className="min-w-0 flex-1">
                      {service.featured && (
                        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300 ring-1 ring-amber-400/30">
                          <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                          Featured
                        </span>
                      )}
                      <h1 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl lg:text-[26px]">
                        {service.name}
                      </h1>
                    </div>
                  </div>

                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                    {service.shortDescription}
                  </p>

                  {/* Tags */}
                  {service.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats row — moved from right panel, horizontal single line */}
                  <div className="mt-5 flex items-stretch gap-2">
                    {/* Rating */}
                    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center">
                      <span className="flex items-center gap-1 text-base font-bold text-white">
                        {service.rating.toFixed(1)}
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Rating</span>
                    </div>
                    {/* Reviews */}
                    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center">
                      <span className="text-base font-bold text-white">{service.reviews}</span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Reviews</span>
                    </div>
                    {/* Delivery */}
                    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center">
                      <span className="text-xs font-bold text-white">{deliveryLabel(service)}</span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Delivery</span>
                    </div>
                    {/* Capability area */}
                    {subcategory && category ? (
                      <Link
                        href={`/category/${category.slug}/${subcategory.slug}`}
                        className="group flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center transition-colors hover:border-white/20"
                      >
                        <Icon name={subIconFor(subcategory, category.icon)} className={cn("h-4 w-4", accent.icon)} />
                        <span className="mt-0.5 line-clamp-1 text-[9px] font-medium uppercase tracking-wider text-slate-400">{subcategory.name}</span>
                      </Link>
                    ) : (
                      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center">
                        <span className="text-xs font-bold text-white">{service.timeline}</span>
                        <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Timeline</span>
                      </div>
                    )}
                  </div>

                  {/* Engaging description — 4 lines that sell the outcome */}
                  <div className="mt-auto space-y-1.5 pt-6">
                    <p className="text-[13px] font-semibold leading-snug text-white">
                      {service.name} delivers measurable outcomes — not just activity.
                    </p>
                    <p className="text-[13px] leading-relaxed text-slate-300">
                      Every engagement is scoped, staffed by senior practitioners, and backed by delivery SLAs you can hold us to.
                    </p>
                    <p className="text-[13px] leading-relaxed text-slate-300">
                      Fixed-scope proposals in 48 hours — go live in {service.timeline.toLowerCase()}.
                    </p>
                    <p className="text-[13px] leading-relaxed text-slate-300">
                      Transparent pricing, weekly demos, and complete documentation at handover.
                    </p>
                  </div>
                </div>

                {/* Divider rail between identity and the why-panel (lg only) */}
                <div className="hidden lg:block bg-white/[0.07]" aria-hidden="true" />

                {/* Right — visual image + Request Service button */}
                <div className="flex flex-col border-t border-white/[0.07] bg-white/[0.02] p-5 sm:p-7 lg:border-t-0 lg:p-8">
                  {/* Service preview image — fills available vertical space */}
                  <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.08]">
                    <img
                      src="/service-preview.png"
                      alt="Service preview — digital intelligence network"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                {/* Request Service button + disclaimer — moved below the image */}
                <div className="mt-4 grid gap-2.5">
                  <Button
                    onClick={openRequest}
                    className="h-11 rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 hover:bg-amber-400"
                  >
                    {cardCtaPrimary || "Request Service"}
                  </Button>
                </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                    Scoped to your requirements after a free discovery call — clear
                    deliverables, no surprises.
                  </p>

                  {/* Two CTAs — moved here from the left column */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      onClick={() => openHeroLead("quote")}
                      className="h-11 rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 hover:bg-amber-400"
                    >
                      {heroCtaPrimary || "Get a Quote"}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => openHeroLead("consultation")}
                      variant="outline"
                      className="h-11 rounded-xl border-white/15 bg-white/[0.04] font-semibold text-white hover:bg-white/10 hover:text-white"
                    >
                      {heroCtaSecondary || "Schedule Consultation"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= OVERVIEW + QUICK FACTS ========================= */}
      <section id="overview" className="scroll-mt-36 py-12 md:py-14">
        <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
          <Reveal as="div" margin="-60px">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
              Service overview
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              What this service delivers
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal as="aside" margin="-60px" className="h-fit rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">Quick facts</h3>
            <dl className="mt-4 space-y-3 text-sm">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                >
                  <dt className="shrink-0 text-muted-foreground">{fact.label}</dt>
                  <dd className="text-right font-medium text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ====================== VALUE PROPS (CAPABILITIES) ====================== */}
      {service.capabilities.length > 0 && (
        <section id="capabilities" className="scroll-mt-36 border-t border-border/60 bg-muted/30 py-12 md:py-14">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <Reveal as="div" margin="-60px" className="max-w-2xl">
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                What you unlock
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Capabilities built for outcomes
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                Every engagement is engineered around measurable
                business results — here is what working with our specialists feels like.
              </p>
            </Reveal>

            <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {service.capabilities.map((capability, i) => {
                const ValueIcon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <Reveal key={capability} as="div" delay={Math.min(i * 0.05, 0.3)} margin="-40px" className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-105", accent.tile)}>
                      <ValueIcon className={cn("h-[17px] w-[17px]", accent.icon)} aria-hidden="true" />
                    </span>
                    <p className="mt-3 flex-1 text-sm font-semibold leading-snug text-foreground">
                      {capability}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================== PROBLEMS SOLVED ===================== */}
      {service.problemsSolved.length > 0 && (
        <section id="problems" className="scroll-mt-36 py-12 md:py-14">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <Reveal as="div" margin="-60px" className="max-w-2xl">
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                Who this is for
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Business problems this service solves
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                If any of these sound familiar, this service was built for you.
              </p>
            </Reveal>
            <Reveal as="div" margin="-60px" className="mt-7 grid gap-3.5 sm:grid-cols-2">
              {service.problemsSolved.map((problem) => (
                <div
                  key={problem}
                  className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1", accent.tile)}>
                    <XCircle className={cn("h-[17px] w-[17px]", accent.icon)} aria-hidden="true" />
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/90">{problem}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ========================== USE CASES ========================== */}
      {insights && <ServiceUseCases service={service} insights={insights} accent={accent} />}

      {/* ======================= WHAT IS INCLUDED ======================= */}
      {service.deliverables.length > 0 && (
        <section id="included" className="scroll-mt-36 border-t border-border/60 bg-muted/30 py-12 md:py-14">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <Reveal as="div" margin="-60px" className="max-w-2xl">
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                What is included
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Every engagement includes
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                Concrete deliverables agreed upfront — with complete documentation
                and a structured handover so your team owns everything we build.
              </p>
            </Reveal>
            <Reveal as="div" margin="-60px" className="mt-7 grid gap-3.5 sm:grid-cols-2">
              {service.deliverables.map((deliverable) => (
                <div
                  key={deliverable}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1", accent.tile)}>
                    <Check className={cn("h-3.5 w-3.5", accent.icon)} aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground/90">{deliverable}</span>
                </div>
              ))}
            </Reveal>
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              All engagements include complete documentation, runbooks, and a structured
              handover session so your team owns everything we build.
            </div>
          </div>
        </section>
      )}

      {/* ==================== OUTCOMES & ROI (INFOGRAPHICS) ==================== */}
      {insights && <ServiceOutcomes service={service} insights={insights} accent={accent} />}

      {/* ============================ PROCESS ============================ */}
      <section id="process" className="scroll-mt-36 py-12 md:py-14">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <Reveal as="div" margin="-60px" className="max-w-2xl">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
              How it works
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              From first call to live delivery
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              A proven engagement model that keeps you in control — with clear
              milestones, weekly demos, and no surprises.
            </p>
          </Reveal>

          <div className="relative mt-8">
            {/* Connecting line (desktop) */}
            <div
              className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
              aria-hidden="true"
            />
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => (
                <Reveal key={`${step.title}-${i}`} as="li" delay={Math.min(i * 0.07, 0.35)} margin="-40px" className="relative">
                  <span
                    className={cn(
                      "relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-base font-bold text-white ring-1",
                      accent.gradient,
                      accent.heroRing
                    )}
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ======================= TECHNOLOGY & INDUSTRIES ======================= */}
      {(service.technologies.length > 0 || service.industries.length > 0) && (
        <section className="border-t border-border/60 bg-muted/30 py-12 md:py-14">
          <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {service.technologies.length > 0 && (
              <Reveal as="div" id="technology" margin="-60px" className="scroll-mt-36">
                <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                  Technology & tools
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  The stack behind the service
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  These are our primary delivery tools. Our teams routinely integrate
                  with and extend your existing stack — the toolset is adapted to your
                  environment, not the other way around.
                </p>
              </Reveal>
            )}
            {service.industries.length > 0 && (
              <Reveal as="div" id="industries" margin="-60px" className="scroll-mt-36">
                <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                  Industries served
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Proven across sectors
                </h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.industries.map((name) => {
                    const industry = INDUSTRIES.find((i) => i.name === name);
                    const href = `/industries/${industry?.slug ?? slugify(name)}`;
                    return (
                      <Link
                        key={name}
                        href={href}
                        className="group inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <Globe className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
                        {name}
                      </Link>
                    );
                  })}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Proven in these industries — explore sector-specific programs for
                  deeper context.
                </p>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ============================ FAQ ============================ */}
      {service.faqs.length > 0 && (
        <section id="faq" className="scroll-mt-36 py-12 md:py-14">
          <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
            <Reveal as="div" margin="-60px">
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                Questions, answered
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Everything you want to know before you buy
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Still unsure? Our team replies to every enquiry within one business day.
              </p>
              <Button asChild variant="outline" className="mt-4 h-10 rounded-xl">
                <Link href="/contact">Ask a question</Link>
              </Button>
            </Reveal>

            <Reveal as="div" margin="-60px">
              <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-5">
                {service.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className={index === service.faqs.length - 1 ? "border-b-0" : undefined}
                  >
                    <AccordionTrigger className="text-left text-sm font-semibold text-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===================== RELATED SERVICES ===================== */}
      {related.length > 0 && (
        <section id="related" className="scroll-mt-36 border-t border-border/60 bg-muted/30 py-12 md:py-14">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <Reveal as="div" margin="-60px" className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                  Keep exploring
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  Related services
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Frequently combined with this service by teams like yours.
                </p>
              </div>
              {subcategory && category && (
                <Link
                  href={`/category/${category.slug}/${subcategory.slug}`}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  View all in {subcategory.name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              )}
            </Reveal>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((relatedService) => (
                <ServiceCard
                  key={relatedService.id}
                  service={relatedService}
                  className="rounded-xl"
                  onRequest={() => {
                    setRequestServiceTarget(relatedService);
                    setRequestOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================ CTA BAND ============================ */}
      <section id="request-cta" className="border-t border-white/5 bg-brand-navy">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1", accent.tile)}>
              <Icon name={serviceIcon} className={cn("h-5 w-5", accent.icon)} />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                Ready to move forward?
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                Tell us about your goals — you will receive a scoped proposal with clear
                deliverables and timeline within one business day.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button
              onClick={openRequest}
              className="h-11 rounded-xl bg-amber-500 font-semibold text-brand-ink hover:bg-amber-400"
            >
              {cardCtaPrimary || "Request Service"}
            </Button>
          </div>
        </div>
      </section>

      {/* ======================= BACK TO DIVISION ======================= */}
      {category && (
        <section className="py-10 md:py-12">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <Link
              href={`/category/${category.slug}`}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:p-6"
            >
              <div className="flex items-center gap-4">
                <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105", accent.tile)}>
                  <Icon name={category.icon} className={cn("h-[22px] w-[22px]", accent.icon)} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Parent division
                  </p>
                  <h3 className="mt-0.5 truncate text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {category.name}
                  </h3>
                  <p className="truncate text-[13px] text-muted-foreground">{category.tagline}</p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
                Back to division
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:hidden">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{deliveryLabel(service)}</p>
            <p className="truncate text-xs text-muted-foreground">{service.name}</p>
          </div>
          <Button
            size="sm"
            onClick={openRequest}
            className="shrink-0 rounded-xl bg-amber-500 font-semibold text-brand-ink hover:bg-amber-400"
          >
            {cardCtaPrimary || "Request Service"}
          </Button>
        </div>
      </div>

      <RequestServiceDialog
        service={requestServiceTarget ?? service}
        open={requestOpen}
        onOpenChange={setRequestOpen}
      />

      {/* Hero lead flows (quote / consultation) — service attached */}
      <LeadModal
        open={heroLead !== null}
        onOpenChange={(o) => !o && setHeroLead(null)}
        type={heroLead ?? "quote"}
        context={service.name}
      />

    </div>
  );
}
