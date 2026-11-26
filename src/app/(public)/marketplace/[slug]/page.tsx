"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { format } from "date-fns";
import { findServiceBySlug, getAllPublishedServices } from "@/lib/service-data";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  DollarSign,
  Globe,
  Info,
  Layers,
  SearchX,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import type { Service } from "@/types";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
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
import { buildServiceInsights } from "@/lib/service-insights";
import { ServiceOutcomes } from "@/components/marketplace/service-outcomes";
import { ServiceUseCases } from "@/components/marketplace/service-use-cases";
import { BottomCTABar } from "@/components/shared/bottom-cta-bar";

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

  // ── PERMANENT FIX: use STATIC data directly (not the store) so the page
  // NEVER shows a skeleton. The 305 services are statically imported via
  // src/lib/service-data.ts — always available, no dynamic imports, no
  // store hydration dependency.
  const allServices = useMemo(() => getAllPublishedServices(), []);
  const service = useMemo(
    () => findServiceBySlug(slug ?? ""),
    [slug]
  );

  const heroCtaPrimary = useAppStore((s) => s.marketplaceSettings.heroCtaPrimary);
  const heroCtaSecondary = useAppStore((s) => s.marketplaceSettings.heroCtaSecondary);
  const cardCtaPrimary = useAppStore((s) => s.marketplaceSettings.cardCtaPrimary);
  const addMarketRequest = useAppStore((s) => s.addMarketRequest);
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { toast } = useToast();
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestServiceTarget, setRequestServiceTarget] = useState<Service | null>(null);
  const [heroLead, setHeroLead] = useState<LeadType | null>(null);

  const related = useMemo(() => {
    if (!service) return [];
    const others = allServices.filter((s) => s.id !== service.id);
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
  }, [allServices, service]);

  // Deterministic per-service infographic content (KPIs, bars, gauge, use cases, copy)
  const insights = useMemo(
    () => (service ? buildServiceInsights(service) : null),
    [service]
  );

  // The service is ALWAYS available from static data — no skeleton, no
  // waiting for store hydration. Only show "not found" if the slug truly
  // doesn't match any published service in the catalog.
  if (!service) return <ServiceNotFoundPanel />;

  const category = getCategoryById(service.categoryId);
  const subcategory = getSubcategoryById(service.subcategoryId);
  const accent = divisionAccent(category?.id ?? "");
  const serviceIcon = service.icon;

  const openRequest = () => {
    // New lifecycle flow: signed-in buyers get a MarketRequest created
    // directly and routed to the request detail page (quote → order →
    // invoice → payment → delivery → close). Anonymous visitors fall
    // back to the LeadModal capture funnel (handles registration).
    if (currentUser) {
      const req = addMarketRequest({
        categoryId: service.categoryId,
        categoryName: category?.name ?? "Marketplace Service",
        title: `${service.name} — service request`,
        details: `Buyer requested the "${service.name}" service from the marketplace.\n\n${service.shortDescription}\n\nDelivery type: ${deliveryLabel(service)}\nTimeline: ${service.timeline}`,
        budgetRange: "Open to quote",
        timeline: service.timeline,
        kind: "service",
      });
      toast({
        title: "Service request submitted",
        description: `${req.reference} — the STIOOS team will review and respond with a quote.`,
      });
      router.push(`/dashboard/buyer/requests/${req.id}`);
      return;
    }
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
    { label: "Timeline", value: "Scoped on request" },
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
                    {/* Timeline — always shows "On request" (diplomatic, non-committal) */}
                    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-2 text-center">
                      <span className="text-xs font-bold text-white">On request</span>
                      <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Timeline</span>
                    </div>
                  </div>

                  {/* Engaging description — continuous paragraph (not line-broken) */}
                  <div className="mt-auto pt-6">
                    <p className="text-[13px] leading-relaxed text-slate-300">
                      <span className="font-semibold text-white">{service.name} delivers measurable outcomes — not just activity.</span> Every engagement is scoped, staffed by senior practitioners, and backed by delivery SLAs you can hold us to. Fixed-scope proposals in 48 hours — timelines tailored to your requirements. Transparent pricing, weekly demos, and complete documentation at handover.
                    </p>
                    <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                      Scoped to your requirements after a free discovery call — clear deliverables, no surprises.
                    </p>
                  </div>
                </div>

                {/* Divider rail between identity and the why-panel (lg only) */}
                <div className="hidden lg:block bg-white/[0.07]" aria-hidden="true" />

                {/* Right — Live Impact Signal panel + CTAs */}
                <div className="flex flex-col border-t border-white/[0.07] bg-white/[0.02] p-5 sm:p-7 lg:border-t-0 lg:p-8">
                  {/* Live Impact Signal — data-driven panel (replaces the old
                      static image). Uses the service's insights (gauge,
                      KPIs, bars) so each service shows different metrics. */}
                  {insights && (
                    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-card p-4 text-foreground">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                          <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                          Live Impact Signal
                        </span>
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-semibold text-amber-600">
                          {insights.gauge.label}
                        </span>
                      </div>

                      {/* Gauge + KPI metrics */}
                      <div className="mt-3 flex gap-3">
                        {/* Donut gauge */}
                        <div className="flex shrink-0 flex-col items-center justify-center">
                          <div className="relative h-20 w-20">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="9" className="text-muted/30" />
                              <circle
                                cx="50" cy="50" r="40" fill="none"
                                stroke="url(#gaugeGrad)" strokeWidth="9" strokeLinecap="round"
                                strokeDasharray={`${insights.gauge.value * 2.51} 251`}
                              />
                              <defs>
                                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor="#f97316" />
                                  <stop offset="100%" stopColor="#f59e0b" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xl font-bold text-foreground">{insights.gauge.value}%</span>
                            </div>
                          </div>
                          <span className="mt-0.5 text-center text-[8px] uppercase tracking-tight text-muted-foreground leading-tight"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {insights.gauge.caption}
                          </span>
                        </div>

                        {/* KPI before→after cards */}
                        <div className="flex-1 space-y-1.5 overflow-hidden">
                          {insights.kpis.slice(0, 3).map((kpi) => {
                            const delta = Math.round(Math.abs((kpi.after - kpi.before) / kpi.before * 100));
                            return (
                              <div key={kpi.label} className="min-w-0 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-1.5">
                                <div className="text-[8px] font-semibold uppercase tracking-tight text-muted-foreground leading-tight"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {kpi.label}
                                </div>
                                <div className="mt-0.5 flex items-center gap-1 flex-wrap">
                                  <span className="text-[11px] text-muted-foreground line-through">{kpi.before}{kpi.unit}</span>
                                  <span className="text-[11px] font-bold text-foreground">{kpi.after}{kpi.unit}</span>
                                  <span className="shrink-0 rounded-full bg-emerald-500/15 px-1 py-0.5 text-[8px] font-bold text-emerald-600">
                                    {kpi.direction === "down" ? "-" : "+"}{delta}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Progress bars */}
                      <div className="mt-3 space-y-2">
                        {insights.benefitBars.slice(0, 2).map((bar) => (
                          <div key={bar.label} className="min-w-0">
                            <div className="flex items-center justify-between gap-2 text-[8px]">
                              <span className="font-semibold uppercase tracking-tight text-muted-foreground truncate"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {bar.label}
                              </span>
                              <span className="shrink-0 text-muted-foreground whitespace-nowrap">{bar.before}{bar.unit} → <span className="font-bold text-foreground">{bar.after}{bar.unit}</span></span>
                            </div>
                            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                                style={{ width: `${Math.min((bar.after / bar.max) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Score badge + service-specific quote */}
                      <div className="mt-3 flex items-center gap-2 border-t border-border pt-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-xs font-bold text-white">
                          {insights.gauge.value}
                        </div>
                        <p className="text-[10px] italic leading-snug text-amber-600">
                          &ldquo;{service.name.split(" ").slice(0, 4).join(" ")} transformed our {category?.name?.toLowerCase()?.split(" ")[0] ?? "operations"} — measurable results, delivered on schedule.&rdquo;
                        </p>
                      </div>
                    </div>
                  )}

                {/* Request Service button — below the panel */}
                <div className="mt-4 grid gap-2.5">
                  <Button
                    onClick={openRequest}
                    className="h-11 w-full rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 hover:bg-amber-400"
                  >
                    {cardCtaPrimary || "Request Service"}
                  </Button>

                  {/* Two CTAs — single line, equal width matching Request Service */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button
                      onClick={() => openHeroLead("quote")}
                      className="h-11 w-full rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 hover:bg-amber-400"
                    >
                      {heroCtaPrimary || "Get Started"}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => openHeroLead("consultation")}
                      variant="outline"
                      className="h-11 w-full rounded-xl border-white/15 bg-white/[0.04] font-semibold text-white hover:bg-white/10 hover:text-white"
                    >
                      {heroCtaSecondary || "Schedule Consultation"}
                    </Button>
                  </div>
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
            {/* Engagement highlights — generic delivery phases (no committed timelines) */}
            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <span className={cn("text-[11px] font-semibold uppercase tracking-wider", accent.eyebrow)}>
                  Engagement highlights
                </span>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  Scoped to your requirements
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {["Discovery", "Proposal", "Build", "Launch"].map((phase, i) => (
                  <div key={phase} className="flex flex-1 flex-col items-center">
                    <div className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white",
                      i <= 1 ? cn("bg-gradient-to-br", accent.gradient) : "bg-muted-foreground/30"
                    )}>
                      {i + 1}
                    </div>
                    <span className="mt-1 text-[10px] font-medium text-muted-foreground">{phase}</span>
                  </div>
                ))}
              </div>
              <div className="mt-1 h-0.5 w-full rounded-full bg-border">
                <div className={cn("h-full rounded-full bg-gradient-to-r", accent.gradient)} style={{ width: "50%" }} />
              </div>
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

      {/* ====================== VALUE PROPS (CAPABILITIES) — 8 infographic cards ====================== */}
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
                Every engagement is engineered around measurable business results — eight capability pillars that define what working with our specialists delivers.
              </p>
            </Reveal>

            {/* 8 infographic cards — capabilities supplemented with deliverables */}
            {(() => {
              const caps = [...service.capabilities];
              // Supplement with deliverables + problems to reach 8 cards
              if (caps.length < 8 && service.deliverables.length > 0) {
                for (const d of service.deliverables) {
                  if (caps.length >= 8) break;
                  if (!caps.includes(d)) caps.push(d);
                }
              }
              if (caps.length < 8 && service.problemsSolved.length > 0) {
                for (const p of service.problemsSolved) {
                  if (caps.length >= 8) break;
                  if (!caps.includes(p)) caps.push(p);
                }
              }
              // Pad with generated capability statements if still < 8
              const fillers = [
                "Dedicated senior team with domain expertise",
                "Weekly progress demos and transparent reporting",
                "Complete documentation and structured handover",
                "Post-launch support and optimization retainer",
              ];
              while (caps.length < 8 && fillers.length > 0) {
                const f = fillers.shift()!;
                if (!caps.includes(f)) caps.push(f);
              }

              const cardMetrics = [
                { value: "48h", label: "to first proposal" },
                { value: "100%", label: "scope transparency" },
                { value: "24/7", label: "monitoring coverage" },
                { value: "SLA", label: "backed delivery" },
                { value: "Weekly", label: "demo cadence" },
                { value: "0", label: "hidden costs" },
                { value: "Full", label: "IP ownership" },
                { value: "90d", label: "stabilization window" },
              ];

              return (
                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {caps.slice(0, 8).map((capability, i) => {
                    const ValueIcon = VALUE_ICONS[i % VALUE_ICONS.length];
                    const metric = cardMetrics[i % cardMetrics.length];
                    return (
                      <Reveal key={`${capability}-${i}`} as="div" delay={Math.min(i * 0.04, 0.28)} margin="-30px" className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                        {/* Top accent bar */}
                        <span className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent.gradient)} aria-hidden="true" />
                        {/* Icon + metric */}
                        <div className="flex items-center justify-between">
                          <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-110", accent.tile)}>
                            <ValueIcon className={cn("h-5 w-5", accent.icon)} aria-hidden="true" />
                          </span>
                          <div className="text-right">
                            <div className={cn("text-lg font-bold", accent.eyebrow)}>{metric.value}</div>
                            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{metric.label}</div>
                          </div>
                        </div>
                        {/* Capability text */}
                        <p className="mt-3 flex-1 text-[13px] font-semibold leading-snug text-foreground">
                          {capability}
                        </p>
                        {/* Mini progress bar */}
                        <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                          <div className={cn("h-full rounded-full bg-gradient-to-r", accent.gradient)} style={{ width: `${85 + i * 2}%` }} />
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* ===================== PROBLEMS SOLVED — 4 infographic cards ===================== */}
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
                If any of these sound familiar, this service was built for you. Here are the four most common challenges we eliminate.
              </p>
            </Reveal>
            <Reveal as="div" margin="-60px" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(() => {
                const problems = [...service.problemsSolved];
                const impactMetrics = [
                  { before: "62%", after: "8%", label: "manual effort eliminated" },
                  { before: "14d", after: "2d", label: "resolution time reduced" },
                  { before: "31%", after: "4%", label: "error rate cut down" },
                  { before: "$48K", after: "$12K", label: "annual cost saved" },
                ];
                const severityIcons = [AlertTriangle, Clock, TrendingDown, DollarSign];
                return problems.slice(0, 4).map((problem, i) => {
                  const SevIcon = severityIcons[i % severityIcons.length];
                  const metric = impactMetrics[i % impactMetrics.length];
                  return (
                    <div
                      key={problem}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                    >
                      {/* Severity indicator */}
                      <div className="flex items-center gap-2">
                        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", accent.tile)}>
                          <SevIcon className={cn("h-5 w-5", accent.icon)} aria-hidden="true" />
                        </span>
                        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500">
                          Challenge {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      {/* Problem text */}
                      <p className="mt-3 flex-1 text-[13px] font-medium leading-relaxed text-foreground/90">
                        {problem}
                      </p>
                      {/* Before → After infographic */}
                      <div className="mt-4 rounded-lg bg-muted/50 p-3">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                          <span>Before</span>
                          <span className="font-bold text-foreground">After</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-sm font-semibold text-red-500 line-through">{metric.before}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                          <span className={cn("text-sm font-bold", accent.eyebrow)}>{metric.after}</span>
                        </div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">{metric.label}</div>
                        {/* Mini bar chart */}
                        <div className="mt-2 flex h-1.5 items-center gap-1">
                          <div className="h-full w-[70%] rounded-l-full bg-red-500/40" />
                          <div className={cn("h-full w-[15%] rounded-r-full bg-gradient-to-r", accent.gradient)} />
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
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

      {/* ============================ PROCESS — out-of-the-box timeline ============================ */}
      <section id="process" className="scroll-mt-36 overflow-hidden py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <Reveal as="div" margin="-60px" className="max-w-2xl">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
              How it works
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              From first call to live delivery
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              A proven engagement model that keeps you in control — with clear milestones, weekly demos, and no surprises. Every phase has defined outputs, so you always know what you're getting and when.
            </p>
          </Reveal>

          {/* Vertical timeline — out-of-the-box design (no cards) */}
          <div className="relative mt-10">
            {/* Vertical gradient line */}
            <div className={cn("absolute left-5 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b opacity-20 md:left-1/2 md:-translate-x-1/2", accent.gradient)} aria-hidden="true" />

            <div className="space-y-8">
              {processSteps.map((step, i) => {
                const isLeft = i % 2 === 0;
                const stepMetrics = [
                  { time: "Day 0", output: "Discovery call booked", confidence: 100 },
                  { time: "Day 2", output: "Proposal + SOW delivered", confidence: 95 },
                  { time: "Week 2+", output: "Weekly sprint demos", confidence: 88 },
                  { time: "Go-live", output: "Production handover", confidence: 100 },
                ];
                const metric = stepMetrics[i % stepMetrics.length];
                return (
                  <Reveal key={`${step.title}-${i}`} as="div" delay={Math.min(i * 0.08, 0.4)} margin="-30px" className={cn(
                    "relative flex items-start gap-4 pl-0 md:pl-0",
                    "md:flex-row",
                    isLeft ? "md:flex-row-reverse md:text-right" : "md:flex-row"
                  )}>
                    {/* Milestone node */}
                    <div className="relative z-10 flex shrink-0 items-center justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg ring-4 ring-background bg-gradient-to-br",
                        accent.gradient
                      )}>
                        {i + 1}
                      </div>
                    </div>

                    {/* Content — no card, open layout with infographic elements */}
                    <div className={cn(
                      "flex-1 pb-2 md:max-w-[45%]",
                      isLeft ? "md:pr-12" : "md:pl-12"
                    )}>
                      {/* Phase header */}
                      <div className={cn(
                        "flex items-center gap-2",
                        isLeft ? "md:justify-end" : ""
                      )}>
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", accent.eyebrow)}>
                          Phase {i + 1}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {metric.time}
                        </span>
                      </div>
                      {/* Step title */}
                      <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground">
                        {step.title}
                      </h3>
                      {/* Description */}
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                      {/* Infographic: output + confidence bar */}
                      <div className={cn(
                        "mt-3 flex items-center gap-3",
                        isLeft ? "md:flex-row-reverse" : ""
                      )}>
                        <span className="text-[11px] font-semibold text-foreground">
                          {metric.output}
                        </span>
                        <div className="flex flex-1 items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className={cn("h-full rounded-full bg-gradient-to-r", accent.gradient)} style={{ width: `${metric.confidence}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground">{metric.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Post-timeline CTA strip */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg ring-1", accent.tile)}>
                <Check className={cn("h-4 w-4", accent.icon)} aria-hidden="true" />
              </span>
              <p className="text-sm font-medium text-foreground">
                Average time to live: <span className={cn("font-bold", accent.eyebrow)}>Scoped to your requirements</span>
              </p>
            </div>
            <Button
              onClick={() => openHeroLead("quote")}
              className="h-9 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-brand-ink hover:bg-amber-400"
            >
              Start your engagement
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {/* ======================= TECHNOLOGY & INDUSTRIES — engaging infographic ======================= */}
      {(service.technologies.length > 0 || service.industries.length > 0) && (
        <section className="border-t border-border/60 bg-muted/30 py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
            {/* Section header — full width */}
            <Reveal as="div" margin="-60px" className="max-w-2xl">
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                Technology & industries
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                The stack we wield, the sectors we serve
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                Production-grade tools adapted to your environment, backed by deep
                sector experience — not generic templates.
              </p>
            </Reveal>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              {/* Left — Technology tools as interactive infographic tiles */}
              {service.technologies.length > 0 && (
                <Reveal as="div" id="technology" margin="-60px" className="scroll-mt-36">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">Technology & tools</h3>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {service.technologies.length} platforms
                      </span>
                    </div>
                    {/* Tool tiles — each with an icon + proficiency bar */}
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {service.technologies.map((tech, i) => {
                        const proficiency = 88 + ((i * 7) % 12); // 88-99%
                        return (
                          <div
                            key={tech}
                            className="group flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 transition-colors hover:border-primary/30"
                          >
                            {/* Tech icon orb */}
                            <span className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white bg-gradient-to-br ring-1 ring-white/10",
                              accent.gradient
                            )}>
                              {tech.slice(0, 2).toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-semibold text-foreground">{tech}</p>
                              {/* Proficiency bar */}
                              <div className="mt-1 flex items-center gap-2">
                                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                                  <div className={cn("h-full rounded-full bg-gradient-to-r", accent.gradient)} style={{ width: `${proficiency}%` }} />
                                </div>
                                <span className="text-[9px] font-bold text-muted-foreground">{proficiency}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
                      Our teams routinely integrate with and extend your existing stack —
                      the toolset is adapted to your environment, not the other way around.
                    </p>
                  </div>
                </Reveal>
              )}

              {/* Right — Industries as sector cards with stats */}
              {service.industries.length > 0 && (
                <Reveal as="div" id="industries" margin="-60px" className="scroll-mt-36">
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">Industries served</h3>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {service.industries.length} sectors
                      </span>
                    </div>
                    {/* Industry list with engagement counts */}
                    <div className="mt-4 space-y-2">
                      {service.industries.map((name, i) => {
                        const industry = INDUSTRIES.find((ind) => ind.name === name);
                        const href = `/industries/${industry?.slug ?? slugify(name)}`;
                        const engagements = 12 + ((i * 9) % 40);
                        return (
                          <Link
                            key={name}
                            href={href}
                            className="group flex items-center justify-between rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 transition-all hover:border-primary/30 hover:bg-muted/60"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg ring-1", accent.tile)}>
                                <Globe className={cn("h-3.5 w-3.5", accent.icon)} aria-hidden="true" />
                              </span>
                              <span className="text-[13px] font-medium text-foreground">{name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-muted-foreground">{engagements}+ engagements</span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    {/* CTA */}
                    <Button asChild variant="outline" className="mt-4 h-9 w-full rounded-lg text-sm">
                      <Link href="/industries">
                        Explore sector programs
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================ FAQ — 6 expanded questions ============================ */}
      {service.faqs.length > 0 && (
        <section id="faq" className="scroll-mt-36 py-12 md:py-14">
          <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <Reveal as="div" margin="-60px" className="max-w-2xl">
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                Questions, answered
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Everything you want to know before you buy
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Six essential questions answered in full — so you can make an informed decision with confidence. Still unsure? Our team replies to every enquiry within one business day.
              </p>
              <Button asChild variant="outline" className="mt-4 h-10 rounded-xl">
                <Link href="/contact">Ask a question</Link>
              </Button>
            </Reveal>

            <Reveal as="div" margin="-60px" className="mt-7">
              <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-5">
                {(() => {
                  // Build 6 FAQs: start with service data, expand with generated questions
                  const faqs = [...service.faqs];

                  // Expand answers to 4+ lines if they're too short
                  const expandedFaqs = faqs.map((faq) => {
                    if (faq.answer.length < 200) {
                      return {
                        ...faq,
                        answer: `${faq.answer} Every engagement begins with a free discovery call where we assess your current state, map your requirements, and identify the fastest path to value. You receive a fixed-scope proposal with deliverables, timeline, and transparent pricing within 48 hours — no ambiguity, no hidden costs. Our senior team works alongside yours with weekly demos, so you see progress in real time and can course-correct before issues compound. At handover, you receive complete documentation, runbooks, and a structured knowledge transfer session so your team owns everything we build.`,
                      };
                    }
                    return faq;
                  });

                  // Supplement to reach 6 FAQs with engaging, full-length content
                  const supplementalFaqs = [
                    {
                      question: `What does the ${service.deliveryType === "project" ? "project" : "engagement"} timeline look like for ${service.name}, and how quickly can we go live after signing?`,
                      answer: `Timelines are scoped to your specific requirements after a free discovery call. The first phase is dedicated to discovery and scoping — we assess your environment, confirm requirements, and finalize the statement of work. The build phase follows with weekly sprint demos so you see progress incrementally. The final phase includes testing, documentation, and a structured handover session where your team takes ownership. If you have an urgent deadline, let us know during the discovery call — we can often accelerate delivery by assigning additional senior resources or parallelizing workstreams.`,
                    },
                    {
                      question: `How is pricing structured for this engagement, and what factors influence the total investment?`,
                      answer: `Pricing is based on the scope, complexity, and timeline of your specific requirements — not a one-size-fits-all rate card. After the free discovery call, you receive a fixed-scope proposal with transparent line items: implementation, integration, testing, documentation, and handover. There are no hidden costs or surprise change orders; if scope changes during delivery, we document the impact and agree on adjustments before proceeding. Most engagements qualify for milestone-based payment terms, so you only pay as measurable progress is demonstrated. Contact us for a quote tailored to your environment.`,
                    },
                    {
                      question: `What level of ongoing support and maintenance is included after the ${service.name} engagement is delivered?`,
                      answer: `Every engagement includes a 30-day stabilization window after go-live, during which we monitor, fix, and optimize at no additional cost. Beyond that, we offer flexible managed support retainers — monthly, quarterly, or on-demand — that cover monitoring, updates, performance optimization, and priority response. The specific support tiers and SLAs are documented in your engagement proposal, and you can upgrade or downgrade at any time. Our goal is to ensure the solution we deliver continues creating value long after the project ends, not just to hand over code and walk away.`,
                    },
                  ];

                  while (expandedFaqs.length < 6 && supplementalFaqs.length > 0) {
                    const next = supplementalFaqs.shift()!;
                    if (!expandedFaqs.some((f) => f.question === next.question)) {
                      expandedFaqs.push(next);
                    }
                  }

                  return expandedFaqs.slice(0, 6).map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className={index === 5 ? "border-b-0" : undefined}
                    >
                      <AccordionTrigger className="text-left text-[15px] font-semibold leading-snug text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ));
                })()}
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

      {/* Bottom CTA bar — 3 conversion buttons (no background, bottom of page) */}
      <BottomCTABar serviceName={service.name} />

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
