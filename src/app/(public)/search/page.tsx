"use client";

import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Building2,
  FolderOpen,
  Layers,
  Search,
  SearchX,
  Wrench,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { EmptyState } from "@/components/shared/empty-state";
import { useAppStore } from "@/lib/store";
import { INDUSTRIES, INSIGHTS, RESOURCES } from "@/data/content";

// ============================================================
// GLOBAL SEARCH — /search?q=
// ============================================================

const RECOMMENDATIONS = ["AI agents", "automation", "dashboards", "branding"];

interface ResultRow {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon?: string;
}

interface ResultGroup {
  key: "Services" | "Categories" | "Industries" | "Insights" | "Resources";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  rows: ResultRow[];
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [, startTransition] = useTransition();

  const services = useAppStore((s) => s.services);
  const categories = useAppStore((s) => s.categories);

  const [input, setInput] = useState(q);
  const [lastQ, setLastQ] = useState(q);
  // Keep the input in sync when the URL changes (header search, chips)
  if (lastQ !== q) {
    setLastQ(q);
    setInput(q);
  }

  // Debounced URL sync while typing
  useEffect(() => {
    const t = window.setTimeout(() => {
      const trimmed = input.trim();
      if (trimmed === q) return;
      startTransition(() => {
        router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search", {
          scroll: false,
        });
      });
    }, 250);
    return () => window.clearTimeout(t);
  }, [input, q, router, startTransition]);

  const groups = useMemo<ResultGroup[]>(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];

    /* Services */
    const serviceRows: ResultRow[] = services
      .filter((s) => s.status === "published")
      .filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.shortDescription.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      )
      .map((s) => ({
        id: s.id,
        title: s.name,
        subtitle: s.shortDescription,
        href: `/marketplace/${s.slug}`,
        icon: s.icon,
      }));

    /* Categories */
    const categoryRows: ResultRow[] = categories
      .filter((c) => c.status === "active")
      .filter((c) => c.name.toLowerCase().includes(query) || c.tagline.toLowerCase().includes(query))
      .map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: c.tagline,
        href: `/marketplace?category=${c.slug}`,
        icon: c.icon,
      }));

    /* Industries */
    const industryRows: ResultRow[] = INDUSTRIES.filter(
      (i) =>
        i.name.toLowerCase().includes(query) || i.description.toLowerCase().includes(query)
    ).map((i) => ({
      id: i.id,
      title: i.name,
      subtitle: i.description,
      href: `/industries/${i.slug}`,
      icon: i.icon,
    }));

    /* Insights */
    const insightRows: ResultRow[] = INSIGHTS.filter(
      (i) =>
        i.title.toLowerCase().includes(query) ||
        i.excerpt.toLowerCase().includes(query) ||
        i.category.toLowerCase().includes(query)
    ).map((i) => ({
      id: i.id,
      title: i.title,
      subtitle: i.excerpt,
      href: `/insights/${i.slug}`,
    }));

    /* Resources */
    const resourceRows: ResultRow[] = RESOURCES.filter(
      (r) =>
        r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
    ).map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.description,
      href: "/resources",
    }));

    const defs: Omit<ResultGroup, "rows">[] = [
      { key: "Services", label: "Services", icon: Wrench },
      { key: "Categories", label: "Categories", icon: Layers },
      { key: "Industries", label: "Industries", icon: Building2 },
      { key: "Insights", label: "Insights", icon: BookOpen },
      { key: "Resources", label: "Resources", icon: FolderOpen },
    ];

    const rowsBykey: Record<ResultGroup["key"], ResultRow[]> = {
      Services: serviceRows,
      Categories: categoryRows,
      Industries: industryRows,
      Insights: insightRows,
      Resources: resourceRows,
    };

    return defs
      .map((d) => ({ ...d, rows: rowsBykey[d.key] }))
      .filter((g) => g.rows.length > 0);
  }, [q, services, categories]);

  const total = groups.reduce((acc, g) => acc + g.rows.length, 0);

  return (
    <>
      {/* ============================ HEADER ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-14 text-white md:py-16">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(30,100,232,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-amber-400">Search</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {q.trim() ? (
              <>
                Results for <span className="text-gradient-brand">“{q.trim()}”</span>
              </>
            ) : (
              <>
                Search <span className="text-gradient-brand">everything.</span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            {q.trim()
              ? `${total} match${total === 1 ? "" : "es"} across services, categories, industries, insights, and resources.`
              : "Find services, divisions, industries, insights, and resources across the entire STIOOS GLOBAL platform."}
          </p>

          <div className="relative mt-7 max-w-xl">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search services, industries, insights…"
              className="h-12 border-white/15 bg-white/5 pl-11 text-white placeholder:text-slate-500 focus-visible:ring-amber-400"
              aria-label="Search the platform"
              autoFocus
            />
          </div>

          {/* Recommendation chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Try:</span>
            {RECOMMENDATIONS.map((rec) => (
              <button
                key={rec}
                onClick={() => setInput(rec)}
                className="rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-amber-400/40 hover:text-amber-300"
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ RESULTS ============================ */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!q.trim() ? (
            <EmptySearchState onPick={(chip) => setInput(chip)} />
          ) : total === 0 ? (
            <div className="space-y-10">
              <EmptyState
                icon={SearchX}
                title={`No results for “${q.trim()}”`}
                description="Check your spelling or try a broader term. Our experts can also help you find the right capability — just ask."
                action={{ label: "Talk to an Expert", onClick: () => router.push("/contact") }}
              />
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Popular searches:</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {RECOMMENDATIONS.map((rec) => (
                    <Button
                      key={rec}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(rec)}
                      className="border-border bg-card font-medium text-foreground hover:border-blue-600/40 hover:text-blue-700"
                    >
                      {rec}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {groups.map((group) => (
                <div key={group.key}>
                  <h2 className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                    <group.icon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    {group.label}
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold normal-case tracking-normal text-foreground">
                      {group.rows.length}
                    </span>
                  </h2>
                  <ul className="mt-4 grid gap-2.5">
                    {group.rows.map((row) => (
                      <li key={`${group.key}-${row.id}`}>
                        <Link
                          href={row.href}
                          className="group flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3.5 transition-all hover:border-blue-600/40 hover:shadow-md sm:px-5"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20">
                            {row.icon ? (
                              <Icon name={row.icon} className="h-5 w-5 text-blue-600" />
                            ) : (
                              <group.icon className="h-5 w-5 text-blue-600" />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-foreground transition-colors group-hover:text-blue-700">
                              {row.title}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                              {row.subtitle}
                            </span>
                          </span>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-blue-600"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ============================================================
// Empty "no query" browse state
// ============================================================

function EmptySearchState({ onPick }: { onPick: (chip: string) => void }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
        <Boxes className="h-7 w-7 text-blue-600" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-bold text-foreground">What are you looking for?</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        Search across the entire platform — or start from one of these popular areas:
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {RECOMMENDATIONS.map((rec) => (
          <Button
            key={rec}
            variant="outline"
            size="sm"
            onClick={() => onPick(rec)}
            className="border-border bg-card font-medium text-foreground hover:border-blue-600/40 hover:text-blue-700"
          >
            {rec}
          </Button>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
        <Link href="/solutions" className="underline decoration-dotted underline-offset-4 hover:text-blue-700">
          Browse solutions
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/services" className="underline decoration-dotted underline-offset-4 hover:text-blue-700">
          View all services
        </Link>
        <span aria-hidden="true">·</span>
        <Link href="/industries" className="underline decoration-dotted underline-offset-4 hover:text-blue-700">
          Explore industries
        </Link>
      </div>
    </div>
  );
}
