"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { EmptyState } from "@/components/shared/empty-state";
import { ServiceCard } from "@/components/marketplace/service-card";
import { INDUSTRIES } from "@/data/content";
import { useAppStore } from "@/lib/store";

// ============================================================
// INDUSTRY DETAIL — /industries/[slug]
// ============================================================

export default function IndustryDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const services = useAppStore((s) => s.services);

  const industry = INDUSTRIES.find((i) => i.slug === slug);

  const matched = useMemo(() => {
    if (!industry) return [];
    return services.filter(
      (s) => s.status === "published" && s.industries.includes(industry.name)
    );
  }, [industry, services]);

  const avgRating = useMemo(() => {
    if (matched.length === 0) return "—";
    const avg = matched.reduce((acc, s) => acc + s.rating, 0) / matched.length;
    return avg.toFixed(1);
  }, [matched]);

  /* ------------------------- Not found ------------------------- */
  if (!industry) {
    return (
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Industry not found</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            We could not find an industry at <span className="font-mono text-sm">/industries/{slug}</span>.
            It may have been renamed or retired. Explore the industries we currently serve.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-blue-600 font-semibold text-white hover:bg-blue-700">
              <Link href="/industries">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                All industries
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/marketplace">Browse marketplace</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const others = INDUSTRIES.filter((i) => i.id !== industry.id);

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-16 text-white md:py-20">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 30% 0%, rgba(30,100,232,0.25), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/industries" className="transition-colors hover:text-white">
                  Industries
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-slate-200" aria-current="page">
                {industry.name}
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex flex-col items-start gap-6 md:flex-row md:items-center">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/25 to-amber-500/15 ring-1 ring-white/15">
              <Icon name={industry.icon} className="h-8 w-8 text-blue-300" />
            </span>
            <div>
              <p className="eyebrow text-amber-400">Industry</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {industry.name}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
            {industry.description}
          </p>
        </div>
      </section>

      {/* ============================= STATS ============================= */}
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-2 py-6 text-center">
              <dd className="text-3xl font-bold tracking-tight text-foreground">{matched.length}</dd>
              <dt className="mt-1 text-sm text-muted-foreground">Published services</dt>
            </div>
            <div className="px-2 py-6 text-center">
              <dd className="text-3xl font-bold tracking-tight text-foreground">{avgRating}</dd>
              <dt className="mt-1 text-sm text-muted-foreground">Average delivery rating</dt>
            </div>
            <div className="px-2 py-6 text-center">
              <dd className="text-3xl font-bold tracking-tight text-foreground">1 day</dd>
              <dt className="mt-1 text-sm text-muted-foreground">Expert response time</dt>
            </div>
          </dl>
        </div>
      </section>

      {/* =========================== SERVICES =========================== */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-brand-blue">Services for {industry.name}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Deployment-ready engagements for {industry.name.toLowerCase()} teams
              </h2>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/marketplace">
                Browse full marketplace
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {matched.length > 0 ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matched.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-10"
              icon={SearchX}
              title={`No published services tagged for ${industry.name} yet`}
              description="Our delivery teams scope new industry engagements continuously — talk to an expert about your requirement."
              action={{
                label: "Talk to an Expert",
                onClick: () => router.push("/contact"),
              }}
            />
          )}
        </div>
      </section>

      {/* ======================= OTHER INDUSTRIES ======================= */}
      <section className="border-t border-border bg-muted/40 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-brand-blue">Explore other industries</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {others.map((i) => (
              <Link
                key={i.id}
                href={`/industries/${i.slug}`}
                className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-blue-600/40 hover:text-blue-700"
              >
                <Icon name={i.icon} className="h-4 w-4 text-blue-600" />
                {i.name}
                <ArrowRight
                  className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-brand-ink px-6 py-12 text-center text-white md:px-12 md:py-16">
            <div className="absolute inset-0 surface-grid" aria-hidden="true" />
            <div
              className="absolute left-1/2 top-0 h-52 w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/25 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Ready to modernize your {industry.name.toLowerCase()} operations?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                Share your goals and constraints — a senior expert with {industry.name.toLowerCase()}{" "}
                experience replies within one business day with a scoped proposal.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-amber-500 px-8 text-base font-semibold text-brand-ink hover:bg-amber-400"
                >
                  <Link href="/contact">Talk to an Expert</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-transparent px-8 text-base font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/solutions">Explore Solutions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
