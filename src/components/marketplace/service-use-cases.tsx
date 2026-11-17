"use client";

// ============================================================
// SERVICE USE CASES — engaging scenario band for the service
// detail page (Task 66-c). Renders 3 deterministic use-case
// cards (industry chip, narrative, accent metric chip) plus a
// "Who this serves" industry strip. Values come from
// buildServiceInsights() — works for ANY service.
// ============================================================

import { Reveal } from "@/components/motion/reveal";
import { Building2, TrendingUp, Users } from "lucide-react";
import type { Service } from "@/types";
import type { DivisionAccent } from "@/lib/division-accents";
import type { ServiceInsights } from "@/lib/service-insights";
import { cn } from "@/lib/utils";

export interface ServiceUseCasesProps {
  service: Service;
  insights: ServiceInsights;
  accent: DivisionAccent;
}

export function ServiceUseCases({ service, insights, accent }: ServiceUseCasesProps) {
  const industries = service.industries.filter(Boolean);

  return (
    <section
      id="use-cases"
      aria-label={`Use cases for ${service.name}`}
      className="scroll-mt-36 border-t border-border/60 py-12 md:py-14"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal className="max-w-2xl">
          <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", accent.eyebrow)}>
            Use cases
          </p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {insights.sectionCopy.useCasesTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
            {insights.sectionCopy.useCasesSub}
          </p>
        </Reveal>

        {/* Scenario cards */}
        <div className="mt-7 grid gap-3.5 md:grid-cols-3">
          {insights.useCases.map((useCase, index) => (
            <Reveal
              key={`${useCase.industry}-${useCase.title}`}
              as="article"
              delay={Math.min(index * 0.06, 0.3)}
              margin="-40px"
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md md:p-6"
            >
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-1",
                  accent.tile,
                  accent.eyebrow
                )}
              >
                <Building2 className="h-3 w-3" aria-hidden="true" />
                {useCase.industry}
              </span>
              <h3 className="mt-3.5 text-[15px] font-bold leading-snug text-foreground">
                {useCase.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {useCase.narrative}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-3 py-2 text-[13px] font-bold">
                <TrendingUp className={cn("h-4 w-4 shrink-0", accent.icon)} aria-hidden="true" />
                <span className={accent.strong}>{useCase.metric}</span>
              </p>
            </Reveal>
          ))}
        </div>

        {/* Who this serves */}
        <Reveal className="mt-3.5 flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3.5 md:px-5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            Who this serves
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
          {(industries.length > 0 ? industries : ["Technology", "Professional Services"]).map(
            (name) => (
              <span
                key={name}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
              >
                {name}
              </span>
            )
          )}
        </Reveal>
      </div>
    </section>
  );
}
