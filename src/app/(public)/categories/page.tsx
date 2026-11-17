"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, LayoutGrid, Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/shared/icon";
import { PageActionBar } from "@/components/shared/page-action-bar";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { divisionAccent } from "@/lib/division-accents";
import { subIconFor } from "@/lib/sub-icons";

// ============================================================
// CATEGORIES — Directory hub for every solution division.
// Each card routes to its modern division page (/category/[slug]).
// ============================================================

export default function CategoriesPage() {
  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const services = useAppStore((s) => s.services);

  const divisions = useMemo(
    () => categories.filter((c) => c.status === "active"),
    [categories]
  );

  const published = useMemo(
    () => services.filter((s) => s.status === "published"),
    [services]
  );

  const publishedCount = (categoryId: string) =>
    published.filter((s) => s.categoryId === categoryId).length;

  const ratingFor = (categoryId: string) => {
    const list = published.filter((s) => s.categoryId === categoryId);
    if (list.length === 0) return null;
    return (list.reduce((sum, s) => sum + s.rating, 0) / list.length).toFixed(1);
  };

  const totalSubs = subcategories.filter((s) => s.status === "active").length;

  return (
    <>
      {/* ===================== PAGE ACTION BAR ===================== */}
      <PageActionBar
        items={[
          { label: "Home", href: "/" },
          { label: "Categories" },
        ]}
      />

      {/* ============================ HEADER ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-16 text-white md:py-20">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(251,191,36,0.16), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-amber-400">Category Directory</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            The full <span className="text-gradient-brand">solution taxonomy.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            {divisions.length} divisions and {totalSubs} subcategories — the complete map
            of what STIOOS GLOBAL delivers. Open any division for its modern page
            with subcategories and related services.
          </p>
        </div>
      </section>

      {/* ============================= GRID ============================= */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {divisions.map((cat, i) => {
              const subs = subcategories.filter(
                (s) => s.categoryId === cat.id && s.status === "active"
              );
              const accent = divisionAccent(cat.id);
              const rating = ratingFor(cat.id);
              return (
                <Reveal
                  key={cat.id}
                  as="article"
                  delay={Math.min(i * 0.05, 0.3)}
                  margin="-40px"
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                >
                  {/* Card header */}
                  <div className="relative border-b border-border bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-5">
                    <div className="flex items-center gap-3.5">
                      <span
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 transition-transform duration-200",
                          accent.gradient,
                          accent.heroRing
                        )}
                      >
                        <Icon name={cat.icon} className="h-[22px] w-[22px] text-white" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold tracking-tight text-foreground">
                          {cat.name}
                        </h2>
                        <p className="truncate text-xs text-muted-foreground">{cat.tagline}</p>
                      </div>
                    </div>
                    <div className="mt-3.5 flex items-center gap-2 text-[11px] font-medium">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 ring-1", accent.chip)}>
                        <LayoutGrid className="h-3 w-3" aria-hidden="true" />
                        {subs.length} subcategories
                      </span>
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-muted-foreground ring-1 ring-border">
                        {publishedCount(cat.id)} services
                      </span>
                      {rating && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-muted-foreground ring-1 ring-border">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                          {rating}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subcategory list */}
                  <ul
                    className="max-h-72 flex-1 overflow-y-auto p-3"
                    aria-label={`${cat.name} subcategories`}
                  >
                    {subs.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={`/category/${cat.slug}/${sub.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1",
                                accent.tile
                              )}
                            >
                              <Icon
                                name={subIconFor(sub, cat.icon)}
                                className={cn("h-3 w-3 shrink-0", accent.icon)}
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate font-medium text-foreground group-hover:text-primary">
                                {sub.name}
                              </span>
                              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                {sub.description}
                              </span>
                            </span>
                          </span>
                          <ChevronRight
                            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Card footer */}
                  <div className="flex items-center justify-between border-t border-border p-4">
                    <Link
                      href={`/category/${cat.slug}`}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                    >
                      Explore {cat.name}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                    <Link
                      href={`/marketplace?category=${cat.slug}`}
                      className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Marketplace →
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
