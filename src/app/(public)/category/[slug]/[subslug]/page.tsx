"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Globe,
  Layers,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Service } from "@/types";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { divisionAccent } from "@/lib/division-accents";
import { subIconFor } from "@/lib/sub-icons";
import { deliveryLabel } from "@/lib/marketplace-utils";
import { Icon } from "@/components/shared/icon";
import { ServiceCard } from "@/components/marketplace/service-card";
import { RequestServiceDialog } from "@/components/marketplace/request-service-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

// ============================================================
// SUBCATEGORY (CAPABILITY AREA) PAGE — /category/[slug]/[subslug]
// A dedicated, conversion-focused page for every subcategory in
// the catalog. Structure: hero (with live stats panel) → value
// props → "most requested" spotlight → full service grid →
// delivery process → FAQ → sibling capability areas → CTA band.
// Shares the division accent system for a consistent brand feel.
// ============================================================


const VALUE_ICONS = [Zap, ShieldCheck, TrendingUp, Layers] as const;

const PROCESS_STEPS = [
  {
    title: "Discover & scope",
    text: "A senior architect maps your goals, constraints, and success metrics in a free discovery call — no obligation.",
  },
  {
    title: "Proposal in 48h",
    text: "You receive a fixed-scope proposal with deliverables, timeline, and a clear statement of work — ready to sign.",
  },
  {
    title: "Build & iterate",
    text: "Dedicated experts deliver in weekly sprints with live demos, so you see progress from day one.",
  },
  {
    title: "Launch & scale",
    text: "Handover with documentation and training, then optional managed support that grows with your roadmap.",
  },
];

export default function SubcategoryPage() {
  const params = useParams<{ slug: string; subslug: string }>();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug ?? "");
  const subslug = Array.isArray(params?.subslug)
    ? params.subslug[0]
    : (params?.subslug ?? "");

  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const services = useAppStore((s) => s.services);

  const cat = useMemo(
    () => categories.find((c) => c.slug === slug && c.status === "active"),
    [categories, slug]
  );

  const sub = useMemo(
    () =>
      cat
        ? subcategories.find(
            (s) => s.categoryId === cat.id && s.slug === subslug && s.status === "active"
          )
        : undefined,
    [cat, subcategories, subslug]
  );

  const subServices = useMemo(
    () =>
      cat && sub
        ? services
            .filter(
              (s) =>
                s.status === "published" &&
                s.categoryId === cat.id &&
                s.subcategoryId === sub.id
            )
            .sort((a, b) => Number(b.featured) - Number(a.featured) || b.popularity - a.popularity)
        : [],
    [cat, sub, services]
  );

  // ── Derived stats ──
  const avgRating = useMemo(
    () =>
      subServices.length > 0
        ? (subServices.reduce((sum, s) => sum + s.rating, 0) / subServices.length).toFixed(1)
        : null,
    [subServices]
  );
  const industriesCount = useMemo(
    () => new Set(subServices.flatMap((s) => s.industries)).size,
    [subServices]
  );
  const spotlight = subServices[0] ?? null;

  // ── Top capabilities → value props (deduped, popularity-ordered) ──
  const valueProps = useMemo(() => {
    const seen = new Set<string>();
    const picked: string[] = [];
    for (const svc of subServices) {
      for (const cap of svc.capabilities) {
        const key = cap.toLowerCase();
        if (!seen.has(key) && picked.length < 4) {
          seen.add(key);
          picked.push(cap);
        }
      }
    }
    const fallbacks = [
      "Senior specialists on every engagement",
      "Enterprise-grade quality and security",
      "Measurable ROI from week one",
      "Flexible engagement models that scale",
    ];
    while (picked.length < 4) picked.push(fallbacks[picked.length]);
    return picked;
  }, [subServices]);

  // ── Sibling capability areas (same division) ──
  const siblings = useMemo(
    () =>
      cat
        ? subcategories
            .filter((s) => s.categoryId === cat.id && s.status === "active" && s.id !== sub?.id)
            .slice(0, 4)
        : [],
    [cat, subcategories, sub]
  );

  const [requestService, setRequestService] = useState<Service | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // ── Not found state ──
  if (!cat || !sub) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <EmptyState
          icon={LayoutGrid}
          title="Capability area not found"
          description="The capability area you are looking for does not exist or is no longer active. Explore the full division directory instead."
          action={{
            label: "Browse all categories",
            href: "/categories",
          }}
          className="w-full border-solid"
        />
      </div>
    );
  }

  const accent = divisionAccent(cat.id);
  const subIcon = subIconFor(sub, cat.icon);

  const faqs = [
    {
      q: `How fast can a ${sub.name} engagement start?`,
      a: `Most ${sub.name} engagements kick off within 3–5 business days of signing. After a free discovery call we match you with senior specialists, align on scope, and share a delivery plan within 48 hours.`,
    },
    {
      q: "How are engagements structured?",
      a: "Depending on the capability, we offer fixed-scope packages, dedicated monthly capacity, and custom quotes. Every proposal is transparent — deliverables and timeline agreed upfront with no surprises.",
    },
    {
      q: "Who actually delivers the work?",
      a: "Every engagement is led by a senior architect and delivered by vetted specialists with enterprise experience. You get a single point of contact, weekly demos, and full documentation at handover.",
    },
    {
      q: "Can this integrate with our existing stack?",
      a: "Yes. We routinely deliver inside existing environments — cloud platforms, ERPs, CRMs, data warehouses, and custom in-house systems — and every proposal includes an integration and security review.",
    },
  ];

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden border-b border-white/5 bg-brand-ink">
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

        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
            {/* Left — identity + CTAs */}
            <div>
              <div className="anim-pop-sm flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 sm:h-[72px] sm:w-[72px]",
                    accent.gradient,
                    accent.heroRing
                  )}
                >
                  <Icon name={subIcon} className="h-8 w-8 text-white sm:h-9 sm:w-9" />
                </span>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/10 transition-colors hover:bg-white/10"
                >
                  <Icon name={cat.icon} className={cn("h-3.5 w-3.5", accent.icon)} aria-hidden="true" />
                  {cat.name}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
              </div>

              <div className="anim-rise-xs" style={{ animationDelay: "0.08s" }}>
                <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {sub.name}
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                  {sub.description}
                </p>

                {/* Stats */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/10">
                    <span className={accent.eyebrow}>{subServices.length}</span>
                    service{subServices.length === 1 ? "" : "s"}
                  </span>
                  {avgRating && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                      {avgRating} avg. rating
                    </span>
                  )}
                  {industriesCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                      <Globe className="h-3.5 w-3.5 text-sky-300" aria-hidden="true" />
                      {industriesCount} industries
                    </span>
                  )}
                </div>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => scrollTo("services")}
                    className="h-11 rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 hover:bg-amber-400"
                  >
                    Explore services
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => scrollTo("process")}
                    variant="outline"
                    className="h-11 rounded-xl border-white/15 bg-white/[0.04] font-semibold text-white hover:bg-white/10 hover:text-white"
                  >
                    How it works
                  </Button>
                </div>
              </div>
            </div>

            {/* Right — engaging live stats panel */}
            <div className="anim-rise relative hidden lg:block" style={{ animationDelay: "0.15s" }}>
              <div className="pointer-events-none absolute -inset-6 rounded-3xl opacity-60 blur-2xl" style={{ background: accent.glow }} aria-hidden="true" />
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Why teams choose this capability
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3.5">
                    <p className="text-2xl font-bold text-white">{subServices.length}</p>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Live offerings
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-3.5">
                    <p className="flex items-center gap-1.5 text-2xl font-bold text-white">
                      {avgRating ?? "—"}
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Client rating
                    </p>
                  </div>
                </div>

                {spotlight && (
                  <Link
                    href={`/marketplace/${spotlight.slug}`}
                    className="group mt-3 flex items-center gap-3.5 rounded-xl border border-white/[0.07] bg-white/[0.04] p-3.5 transition-colors hover:border-white/20"
                  >
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1", accent.tile)}>
                      <Icon name={spotlight.icon} className={cn("h-5 w-5", accent.icon)} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        Most requested
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-bold text-white transition-colors group-hover:text-amber-300">
                        {spotlight.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        {deliveryLabel(spotlight)} · {spotlight.rating} ★
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-400" aria-hidden="true" />
                  </Link>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= VALUE PROPS ========================= */}
      <section className="py-12 md:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="div" margin="-60px" className="max-w-2xl">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
              What you unlock
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Built for outcomes, not hours
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              Every {sub.name} engagement is engineered around measurable business results —
              here is what working with our specialists feels like.
            </p>
          </Reveal>

          <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop, i) => {
              const ValueIcon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <Reveal key={prop} as="div" delay={Math.min(i * 0.05, 0.3)} margin="-40px" className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-105", accent.tile)}>
                    <ValueIcon className={cn("h-[17px] w-[17px]", accent.icon)} aria-hidden="true" />
                  </span>
                  <p className="mt-3 flex-1 text-sm font-semibold leading-snug text-foreground">
                    {prop}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================== MOST REQUESTED SPOTLIGHT ====================== */}
      {spotlight && (
        <section className="pb-12 md:pb-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal as="div" margin="-60px" className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="grid md:grid-cols-[300px_1fr]">
                {/* Accent panel */}
                <div className={cn("relative flex flex-col justify-between gap-6 bg-gradient-to-br p-6 md:p-7", accent.gradient)}>
                  <div className="pointer-events-none absolute inset-0 surface-grid-light opacity-25" aria-hidden="true" />
                  <div className="relative">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Most requested
                    </span>
                    <Icon name={spotlight.icon} className="mt-6 h-12 w-12 text-white/95" aria-hidden="true" />
                    <p className="mt-3 text-sm font-semibold leading-snug text-white/95">
                      {cat.name} · {sub.name}
                    </p>
                  </div>
                  <p className="relative flex items-center gap-2 text-sm font-semibold text-white">
                    <Star className="h-4 w-4 fill-white text-white" aria-hidden="true" />
                    {spotlight.rating} rating · {spotlight.reviews} reviews
                  </p>
                </div>

                {/* Content */}
                <div className="flex flex-col p-6 md:p-7">
                  <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {spotlight.name}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                    {spotlight.shortDescription}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {spotlight.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-5">
                    <div>
                      <p className="text-xl font-bold text-foreground">{deliveryLabel(spotlight)}</p>
                      <p className="text-xs text-muted-foreground">Timeline: {spotlight.timeline}</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <Button
                        className="h-10 rounded-xl bg-amber-500 font-semibold text-brand-ink hover:bg-amber-400"
                        onClick={() => {
                          setRequestService(spotlight);
                          setRequestOpen(true);
                        }}
                      >
                        Request this service
                      </Button>
                      <Button asChild variant="outline" className="h-10 rounded-xl">
                        <Link href={`/marketplace/${spotlight.slug}`}>
                          View details
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===================== SERVICES GRID ===================== */}
      <section id="services" className="scroll-mt-36 border-t border-border/60 bg-muted/30 py-12 md:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="div" margin="-60px" className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                Full listing
              </p>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                All services in {sub.name}
              </h2>
            </div>
            <Link
              href={`/marketplace?category=${cat.slug}&subcategory=${sub.id}`}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              Compare in marketplace
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Reveal>

          {subServices.length > 0 ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {subServices.map((svc) => (
                <ServiceCard
                  key={svc.id}
                  service={svc}
                  className="rounded-xl"
                  onRequest={(s) => {
                    setRequestService(s);
                    setRequestOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No published services yet"
              description={`Listings for ${sub.name} are being curated. Tell us what you need and our architects will scope it within 24 hours.`}
              action={{ label: "Request a consultation", href: "/contact" }}
              className="mt-8 border-solid"
            />
          )}
        </div>
      </section>

      {/* ========================== PROCESS ========================== */}
      <section id="process" className="scroll-mt-36 py-12 md:py-14">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal as="div" margin="-60px" className="max-w-2xl">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
              How it works
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              From first call to live delivery in four steps
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
              {PROCESS_STEPS.map((step, i) => (
                <Reveal key={step.title} as="li" delay={Math.min(i * 0.07, 0.35)} margin="-40px" className="relative">
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
                    {step.text}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section className="border-t border-border/60 bg-muted/30 py-12 md:py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-8">
          <Reveal as="div" margin="-60px">
            <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
              Questions, answered
            </p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Everything you want to know about {sub.name}
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
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.q} value={`faq-${i}`} className={i === faqs.length - 1 ? "border-b-0" : undefined}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-foreground">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ==================== SIBLING CAPABILITY AREAS ==================== */}
      {siblings.length > 0 && (
        <section className="py-12 md:py-14">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal as="div" margin="-60px" className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
                  Keep exploring
                </p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  More in {cat.name}
                </h2>
              </div>
              <Link
                href={`/category/${cat.slug}`}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                View all {cat.name} capabilities
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </Reveal>

            <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {siblings.map((sib, i) => (
                <Reveal key={sib.id} as="div" delay={Math.min(i * 0.05, 0.3)} margin="-40px">
                  <Link
                    href={`/category/${cat.slug}/${sib.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-105", accent.tile)}>
                        <Icon name={subIconFor(sib, cat.icon)} className={cn("h-[17px] w-[17px]", accent.icon)} />
                      </span>
                      <h3 className="min-w-0 flex-1 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                        {sib.name}
                      </h3>
                    </div>
                    <p className="mt-2.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                      {sib.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
                      Explore capability area
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================ CTA BAND ============================ */}
      <section className="border-t border-white/5 bg-brand-navy">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-5 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1", accent.tile)}>
              <Icon name={subIcon} className={cn("h-5 w-5", accent.icon)} />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                Need something bespoke in {sub.name}?
              </h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                Our architects scope custom engagements within 24 hours — from a single
                capability area to a full multi-division program.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Button asChild className="h-11 rounded-xl bg-amber-500 font-semibold text-brand-ink hover:bg-amber-400">
              <Link href="/contact">
                Get A Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl border-white/15 bg-transparent text-slate-200 hover:bg-white/10 hover:text-white"
            >
              <Link href={`/marketplace?category=${cat.slug}&subcategory=${sub.id}`}>Open in marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ======================= BACK TO DIVISION ======================= */}
      <section className="py-10 md:py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href={`/category/${cat.slug}`}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between md:p-6"
          >
            <div className="flex items-center gap-4">
              <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-200 group-hover:scale-105", accent.tile)}>
                <Icon name={cat.icon} className={cn("h-[22px] w-[22px]", accent.icon)} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Parent division
                </p>
                <h3 className="mt-0.5 truncate text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {cat.name}
                </h3>
                <p className="truncate text-[13px] text-muted-foreground">{cat.tagline}</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
              Back to division
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </section>

      <RequestServiceDialog
        service={requestService}
        open={requestOpen}
        onOpenChange={setRequestOpen}
      />
    </>
  );
}
