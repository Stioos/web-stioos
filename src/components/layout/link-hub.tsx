import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, subcategoriesFor } from "@/data/categories";
import { SOLUTION_LIST } from "@/data/pages/solution-pages";
import { INDUSTRIES, INSIGHTS, RESOURCES } from "@/data/content";
import { DIGITAL_TECH_AI_NAME } from "@/data/solutions";

/**
 * LinkHub — a comprehensive internal-link grid rendered above the footer on
 * every public page. Maximizes internal backlinks for SEO: every page links
 * to all 8 divisions, 6 solutions, 10 industries, 6 insights and 6 resources
 * (~36 contextual internal links per page), so crawlers and users can reach
 * any corner of the marketplace from any page.
 *
 * Server component — links are in the static HTML (no JS needed to index).
 */
export function LinkHub() {
  return (
    <section
      aria-label="Explore the full marketplace"
      className="border-t border-border bg-muted/30"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mb-6 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Explore the full marketplace
          </h2>
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-400"
          >
            All categories <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {/* Divisions + Digital Tech & AI */}
          <div>
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
              Divisions
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/solutions"
                  className="text-[12px] text-muted-foreground transition-colors hover:text-amber-600 dark:hover:text-amber-400"
                >
                  {DIGITAL_TECH_AI_NAME}
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-[12px] text-muted-foreground transition-colors hover:text-amber-600 dark:hover:text-amber-400"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
              Solutions
            </p>
            <ul className="space-y-1.5">
              {SOLUTION_LIST.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/solutions/${s.slug}`}
                    className="text-[12px] text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
              Industries
            </p>
            <ul className="space-y-1.5">
              {INDUSTRIES.filter((i) => i.status === "active").map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/industries/${i.slug}`}
                    className="text-[12px] text-muted-foreground transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                  >
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insights */}
          <div>
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
              Insights
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/insights"
                  className="text-[12px] font-semibold text-muted-foreground transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  All insights
                </Link>
              </li>
              {INSIGHTS.filter((i) => i.status === "published").map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/insights/${i.slug}`}
                    className="text-[12px] text-muted-foreground transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {i.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + directory hubs */}
          <div>
            <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-foreground">
              Resources
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/resources"
                  className="text-[12px] font-semibold text-muted-foreground transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                >
                  All resources
                </Link>
              </li>
              {RESOURCES.filter((r) => r.status === "published")
                .slice(0, 5)
                .map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/resources/${r.slug}`}
                      className="text-[12px] text-muted-foreground transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              <li>
                <Link
                  href="/resources/faqs"
                  className="text-[12px] text-muted-foreground transition-colors hover:text-rose-600 dark:hover:text-rose-400"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular subcategories — a second tier of deep links */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Popular subcategories
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {CATEGORIES.flatMap((c) =>
              subcategoriesFor(c.id)
                .slice(0, 2)
                .map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/category/${c.slug}/${sub.slug}`}
                    className="text-[11px] text-muted-foreground/80 transition-colors hover:text-foreground"
                  >
                    {sub.name}
                  </Link>
                ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
