"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, LifeBuoy, Search, SearchX } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { FAQS } from "@/data/content";

// ============================================================
// FAQS — Searchable, grouped accordion
// ============================================================

export default function FaqsPage() {
  const [query, setQuery] = useState("");

  const published = useMemo(() => FAQS.filter((f) => f.status === "published"), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return published;
    return published.filter(
      (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [published, query]);

  const groups = useMemo(() => {
    // preserve the canonical FAQ order for group headings
    const order = Array.from(new Set(published.map((f) => f.category)));
    return order
      .map((category) => ({
        category,
        items: filtered.filter((f) => f.category === category),
      }))
      .filter((g) => g.items.length > 0);
  }, [published, filtered]);

  return (
    <>
      {/* ============================ HEADER ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-16 text-white md:py-20">
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
          <p className="eyebrow text-amber-400">FAQs</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Answers, <span className="text-gradient-brand">straight up.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            The questions enterprise buyers ask us most — about how the marketplace works, engagements,
            delivery, and support. Can&apos;t find yours? Our experts reply within one business day.
          </p>

          <div className="relative mt-8 max-w-xl">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions — e.g. “delivery”, “NDA”, “support”"
              className="h-12 border-white/15 bg-white/5 pl-11 text-white placeholder:text-slate-500 focus-visible:ring-amber-400"
              aria-label="Search FAQs"
            />
          </div>
        </div>
      </section>

      {/* ============================ GROUPED ============================ */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {groups.length === 0 ? (
            <div className="space-y-8">
              <EmptyState
                icon={SearchX}
                title={`No answers found for “${query.trim()}”`}
                description="Try different keywords — or ask us directly. A senior expert will respond within one business day."
                action={{ label: "Clear search", onClick: () => setQuery("") }}
              />
              <AskPanel />
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground" aria-live="polite">
                <span className="font-semibold text-foreground">{filtered.length}</span> answer
                {filtered.length === 1 ? "" : "s"}
                {query.trim() && (
                  <>
                    {" "}
                    matching <span className="font-semibold text-foreground">“{query.trim()}”</span>
                  </>
                )}
              </p>

              <div className="mt-8 space-y-10">
                {groups.map((group) => (
                  <div key={group.category}>
                    <h2 className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.14em] text-foreground">
                      <span className="inline-block h-4 w-1 rounded-full bg-gradient-to-b from-blue-600 to-amber-500" aria-hidden="true" />
                      {group.category}
                      <span className="text-xs font-medium normal-case tracking-normal text-muted-foreground">
                        ({group.items.length})
                      </span>
                    </h2>
                    <Accordion type="single" collapsible className="mt-4">
                      {group.items.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-blue-700 hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <AskPanel />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

// ============================================================
// "Question not answered?" CTA panel
// ============================================================

function AskPanel() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 rounded-xl border border-border bg-card p-6 text-center sm:flex-row sm:text-left md:p-8">
      <div className="flex items-start gap-4">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/25 sm:flex">
          <LifeBuoy className="h-6 w-6 text-amber-600" aria-hidden="true" />
        </span>
        <div>
          <h2 className="flex items-center justify-center gap-2 text-lg font-bold tracking-tight text-foreground sm:justify-start">
            <HelpCircle className="h-5 w-5 text-amber-600 sm:hidden" aria-hidden="true" />
            Didn&apos;t find your answer?
          </h2>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Our team answers every question personally — whether it&apos;s about delivery, security,
            scoping, or anything else. Expect a reply within one business day.
          </p>
        </div>
      </div>
      <Button
        asChild
        className="h-11 shrink-0 bg-amber-500 px-6 font-semibold text-brand-ink hover:bg-amber-400"
      >
        <Link href="/contact">
          Talk to an Expert
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  );
}
