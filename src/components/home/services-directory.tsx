"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import {
  SERVICES_DIRECTORY,
  SERVICES_DIRECTORY_TOTAL,
  type DirectoryDivision,
} from "@/data/services-directory";

// ============================================================
// SERVICES DIRECTORY — flat, minimal 4-column grid showing all
// 8 divisions and their 40 SEO/AEO-optimized services. Rendered
// above the footer on the home page.
//
// Design mirrors the reference image:
//   • Centered title + tagline
//   • 4-column grid (2 rows of 4 divisions = 8 total)
//   • Each division: bold uppercase header + flat list of services
//   • No card borders/backgrounds — minimal, scannable
//   • Emoji-style accent icons per division
// ============================================================

const ACCENT_ICON: Record<
  DirectoryDivision["accent"],
  string
> = {
  amber: "text-amber-500 dark:text-amber-400",
  emerald: "text-emerald-500 dark:text-emerald-400",
  violet: "text-violet-500 dark:text-violet-400",
  sky: "text-sky-500 dark:text-sky-400",
  rose: "text-rose-500 dark:text-rose-400",
  orange: "text-orange-500 dark:text-orange-400",
  teal: "text-teal-500 dark:text-teal-400",
  fuchsia: "text-fuchsia-500 dark:text-fuchsia-400",
};

const ACCENT_HOVER: Record<
  DirectoryDivision["accent"],
  string
> = {
  amber: "group/svc:hover:text-amber-600 dark:group/svc:hover:text-amber-300",
  emerald: "group/svc:hover:text-emerald-600 dark:group/svc:hover:text-emerald-300",
  violet: "group/svc:hover:text-violet-600 dark:group/svc:hover:text-violet-300",
  sky: "group/svc:hover:text-sky-600 dark:group/svc:hover:text-sky-300",
  rose: "group/svc:hover:text-rose-600 dark:group/svc:hover:text-rose-300",
  orange: "group/svc:hover:text-orange-600 dark:group/svc:hover:text-orange-300",
  teal: "group/svc:hover:text-teal-600 dark:group/svc:hover:text-teal-300",
  fuchsia: "group/svc:hover:text-fuchsia-600 dark:group/svc:hover:text-fuchsia-300",
};

export function ServicesDirectory() {
  return (
    <section
      id="services-directory"
      className="scroll-mt-36 border-t border-white/[0.06] bg-brand-ink py-16 md:py-24"
      aria-label="Our services directory"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Title + tagline — centered, minimal */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-amber-400">Our Services</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-[2.5rem]">
            One partner.{" "}
            <span className="text-amber-400">Eight divisions.</span>{" "}
            Fifty-five services.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Our commitment is to deliver exactly what you need — and exceed
            your expectations. Explore {SERVICES_DIRECTORY_TOTAL}{" "}
            SEO-optimized services across {SERVICES_DIRECTORY.length} divisions,
            each staffed by senior practitioners and backed by delivery SLAs.
          </p>
        </Reveal>

        {/* Divider lines framing the tagline (like the reference image) */}
        <div
          className="mx-auto mt-6 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent"
          aria-hidden="true"
        />

        {/* 4-column grid of divisions — 2 rows × 4 columns = 8 divisions */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES_DIRECTORY.map((division) => {
              const iconAccent = ACCENT_ICON[division.accent];
              const hoverAccent = ACCENT_HOVER[division.accent];
              const DivisionIcon = division.icon;
              return (
                <div
                  key={division.id}
                  className="flex flex-col"
                >
                  {/* Division header — icon + uppercase name */}
                  <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
                    <DivisionIcon
                      className={cn("h-5 w-5 shrink-0", iconAccent)}
                      aria-hidden="true"
                    />
                    <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-white">
                      {division.name}
                    </h3>
                  </div>

                  {/* Services list — flat, minimal, generous spacing */}
                  <ul className="mt-4 flex flex-col gap-3">
                    {division.services.map((service) => (
                      <li key={service.name}>
                        <Link
                          href={service.href}
                          title={service.description}
                          className={cn(
                            "group/svc flex items-start gap-2 text-left transition-colors",
                            hoverAccent
                          )}
                        >
                          {/* Bullet dot — accent-colored, subtle */}
                          <span
                            className={cn(
                              "mt-2 h-1 w-1 shrink-0 rounded-full",
                              iconAccent,
                              "opacity-60 group-hover/svc:opacity-100"
                            )}
                            aria-hidden="true"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="block text-[13px] font-medium leading-snug text-slate-300 transition-colors group-hover/svc:text-white">
                              {service.name}
                            </span>
                          </div>
                          <ArrowRight
                            className="mt-0.5 h-3 w-3 shrink-0 text-slate-600 opacity-0 transition-all duration-150 group-hover/svc:translate-x-0.5 group-hover/svc:opacity-100"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Bottom CTA — explore the full marketplace */}
        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-col items-center justify-center gap-4 border-t border-white/[0.06] pt-10 sm:flex-row">
            <p className="text-sm text-slate-400">
              Can&apos;t find what you need? Browse the full{" "}
              <span className="font-semibold text-white">305-service marketplace</span>{" "}
              or talk to an expert.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/marketplace"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400"
              >
                Explore Marketplace
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
