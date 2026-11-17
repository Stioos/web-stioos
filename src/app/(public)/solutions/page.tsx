"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { useAppStore } from "@/lib/store";

// ============================================================
// SOLUTIONS — Every division, its subcategories & services
// ============================================================

export default function SolutionsPage() {
  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const services = useAppStore((s) => s.services);

  const divisions = useMemo(() => {
    const active = categories.filter((c) => c.status === "active");
    return active.map((cat) => {
      const subs = subcategories.filter((s) => s.categoryId === cat.id && s.status === "active");
      const catServices = services
        .filter((s) => s.status === "published" && s.categoryId === cat.id)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 3);
      return { cat, subs, services: catServices };
    });
  }, [categories, subcategories, services]);

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-brand-ink text-white">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(30,100,232,0.25), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 md:py-28 lg:px-8">
          <div className="anim-rise-xs">
            <p className="eyebrow flex items-center justify-center gap-2 text-amber-400">
              <span className="inline-block h-px w-6 bg-amber-400/60" />
              Solutions
              <span className="inline-block h-px w-6 bg-amber-400/60" />
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Ten divisions. Every capability <span className="text-gradient-brand">your business needs.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              Explore the full STIOOS GLOBAL solution architecture — from autonomous AI agents to
              enterprise transformation. Each division contains focused subcategories and delivery-ready
              services.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-amber-500 px-7 text-base font-semibold text-brand-ink hover:bg-amber-400"
              >
                <Link href="/marketplace">Browse the Marketplace</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-7 text-base font-medium text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= DIVISION ROWS ========================= */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          {divisions.map(({ cat, subs, services: catServices }, index) => (
            <article
              key={cat.id}
              className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lg md:p-8"
            >
              <span
                className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500"
                aria-hidden="true"
              />
              <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
                {/* Left: identity */}
                <div>
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20">
                      <Icon name={cat.icon} className="h-7 w-7 text-blue-600" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Division {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        <Link href={`/marketplace?category=${cat.slug}`} className="transition-colors hover:text-blue-700">
                          {cat.name}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm font-medium text-amber-600">{cat.tagline}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {cat.description}
                  </p>

                  {/* Service links */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Popular services in this division
                    </p>
                    {catServices.length > 0 ? (
                      <ul className="mt-3 space-y-1.5">
                        {catServices.map((s) => (
                          <li key={s.id}>
                            <Link
                              href={`/marketplace/${s.slug}`}
                              className="group flex items-center justify-between gap-3 rounded-md border border-transparent px-3 py-2.5 text-sm transition-colors hover:border-border hover:bg-muted/60"
                            >
                              <span className="flex min-w-0 items-center gap-2.5">
                                <Icon name={s.icon} className="h-4 w-4 shrink-0 text-blue-600" />
                                <span className="truncate font-medium text-foreground group-hover:text-blue-700">
                                  {s.name}
                                </span>
                              </span>
                              <ArrowUpRight
                                className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-blue-600"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">
                        New services are being scoped for this division — talk to an expert for early
                        access.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: subcategories */}
                <div className="rounded-lg border border-dashed border-border bg-muted/40 p-5 md:p-6">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <Layers className="h-4 w-4 text-amber-500" aria-hidden="true" />
                      {subs.length} Subcategories
                    </p>
                    <Link
                      href={`/marketplace?category=${cat.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View all
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {subs.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${cat.slug}/${sub.slug}`}
                        className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-blue-600/40 hover:bg-blue-600/5 hover:text-blue-700"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ============================== CTA ============================== */}
      <section className="px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-brand-ink px-6 py-14 text-center text-white md:py-16">
          <div className="absolute inset-0 surface-grid" aria-hidden="true" />
          <div
            className="absolute left-1/2 top-0 h-56 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/25 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-2xl">
            <Sparkles className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
              Not sure which division fits your challenge?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
              Describe your goals in one message. Our experts will map them to the right capabilities,
              subcategories, and services — and reply within one business day.
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
                <Link href="/services">Explore All Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
