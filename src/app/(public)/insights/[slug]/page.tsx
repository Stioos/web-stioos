"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Link2,
  SearchX,
  Share2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { useToast } from "@/hooks/use-toast";
import { ADMINS } from "@/data/people";
import { INSIGHTS } from "@/data/content";

// ============================================================
// INSIGHT ARTICLE — /insights/[slug]
// ============================================================

const INITIALS = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export default function InsightDetailPage() {
  const params = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const insight = useMemo(
    () => INSIGHTS.find((i) => i.slug === params?.slug),
    [params?.slug]
  );

  const author = useMemo(
    () => ADMINS.find((a) => a.name === insight?.author) ?? null,
    [insight?.author]
  );

  const moreInsights = useMemo(() => {
    if (!insight) return [];
    const sameCategory = INSIGHTS.filter(
      (i) => i.id !== insight.id && i.category === insight.category
    );
    const others = INSIGHTS.filter(
      (i) => i.id !== insight.id && i.category !== insight.category
    );
    return [...sameCategory, ...others].slice(0, 2);
  }, [insight]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "The article URL is in your clipboard — share it with your team.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Could not copy link",
        description: "Your browser blocked clipboard access. Copy the URL from the address bar.",
        variant: "destructive",
      });
    }
  };

  /* ------------------------- Not found ------------------------- */
  if (!insight) {
    return (
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Insight not found</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            The article you are looking for may have been moved, renamed, or unpublished. Explore the
            latest insights from our practitioners instead.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-blue-600 font-semibold text-white hover:bg-blue-700">
              <Link href="/insights">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                All insights
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resources">Browse resources</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const paragraphs = insight.content.split("\n\n").filter(Boolean);

  return (
    <>
      {/* ============================ HEADER ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-14 text-white md:py-20">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(30,100,232,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/insights" className="transition-colors hover:text-white">
                  Insights
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="max-w-[220px] truncate font-medium text-slate-200 sm:max-w-none" aria-current="page">
                {insight.title}
              </li>
            </ol>
          </nav>

          <div className="anim-rise-xs mt-8">
            <span
              className={`inline-flex rounded-md bg-gradient-to-r ${insight.accent} px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white`}
            >
              {insight.category}
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {insight.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-[10px] font-bold text-white">
                  {INITIALS(insight.author)}
                </span>
                <span className="font-medium text-white">{insight.author}</span>
              </span>
              <span>{format(new Date(insight.publishedAt), "MMMM d, yyyy")}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-amber-400" aria-hidden="true" />
                {insight.readTime} read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= BODY ============================= */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article>
            {paragraphs.map((para, i) =>
              i === 0 ? (
                <p
                  key={i}
                  className="text-lg font-medium leading-relaxed text-foreground md:text-xl"
                >
                  {para}
                </p>
              ) : (
                <p key={i} className="mt-6 text-base leading-relaxed text-muted-foreground">
                  {para}
                </p>
              )
            )}
          </article>

          {/* Share row */}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-muted/40 px-5 py-4 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Share2 className="h-4 w-4 text-blue-600" aria-hidden="true" />
              Found this useful? Share it with your team.
            </p>
            <Button variant="outline" size="sm" onClick={copyLink}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-emerald-600" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Copy link
                </>
              )}
            </Button>
          </div>

          {/* Author box */}
          <div className="mt-8 flex flex-col items-start gap-5 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center md:p-8">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-lg font-bold text-white shadow-lg shadow-blue-600/20">
              {INITIALS(insight.author)}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Written by
              </p>
              <h2 className="mt-1 text-lg font-bold text-foreground">{insight.author}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {author
                  ? `${author.title} at STIOOS GLOBAL — delivering enterprise AI, automation, and data programs for organizations worldwide.`
                  : "STIOOS GLOBAL practitioner delivering enterprise AI, automation, and data programs."}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="mt-2 shrink-0 sm:mt-0 sm:ml-auto"
            >
              <Link href="/contact">
                Work with {insight.author.split(" ")[0]}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================= MORE INSIGHTS ========================= */}
      {moreInsights.length > 0 && (
        <section className="border-t border-border bg-muted/40 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                More insights
              </h2>
              <Link
                href="/insights"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {moreInsights.map((item) => (
                <Link
                  key={item.id}
                  href={`/insights/${item.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`relative h-24 overflow-hidden bg-gradient-to-br ${item.accent}`}>
                    <div className="absolute inset-0 surface-grid opacity-70" aria-hidden="true" />
                    <div className="relative flex h-full items-center justify-between p-4">
                      <span className="rounded-md bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                        {item.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-black/25 px-2 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />
                        {item.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-blue-700">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {item.excerpt}
                    </p>
                    <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      {item.author} · {format(new Date(item.publishedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
                <Icon name="Lightbulb" className="h-6 w-6 text-amber-400" />
              </span>
              <h2 className="mt-5 text-2xl font-bold tracking-tight md:text-3xl">
                Turn this insight into your roadmap
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                Our experts apply these frameworks inside real organizations every week. Tell us your
                context and we will show you what the first 90 days look like.
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
                  <Link href="/marketplace">Explore the Marketplace</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
