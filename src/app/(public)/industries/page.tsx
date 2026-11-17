"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/shared/icon";
import { INDUSTRIES } from "@/data/content";
import { useAppStore } from "@/lib/store";

// ============================================================
// INDUSTRIES — Ten core industries served
// ============================================================

export default function IndustriesPage() {
  const services = useAppStore((s) => s.services);

  const liveCount = useMemo(() => {
    const map = new Map<string, number>();
    const published = services.filter((s) => s.status === "published");
    for (const ind of INDUSTRIES) {
      map.set(
        ind.name,
        published.filter((s) => s.industries.includes(ind.name)).length
      );
    }
    return map;
  }, [services]);

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
          <p className="eyebrow text-amber-400">Industries</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Solutions shaped by <span className="text-gradient-brand">your sector.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Every industry has its own economics, regulations, and operating rhythm. Our services are
            calibrated to yours — with delivery teams that have shipped in your domain.
          </p>
        </div>
      </section>

      {/* ============================= GRID ============================= */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.id}
                href={`/industries/${ind.slug}`}
                className="group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-blue-600/40 hover:shadow-lg hover:shadow-blue-600/5"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20 transition-colors group-hover:ring-blue-600/40">
                    <Icon name={ind.icon} className="h-6 w-6 text-blue-600" />
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-foreground transition-colors group-hover:text-blue-700">
                  {ind.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ind.description}</p>
                <div className="mt-auto pt-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
                    {liveCount.get(ind.name) ?? ind.servicesCount} services
                    <ArrowRight
                      className="h-3.5 w-3.5 text-blue-600 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
