"use client";

import Link from "next/link";
import { ArrowRight, Trophy, TrendingUp, Workflow, Code2 } from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { SOLUTIONS } from "@/data/solutions";
import { cn } from "@/lib/utils";

export default function RodaaSSolutionsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="RODaaS Solutions">
        <RODaaSContent />
      </DashboardShell>
    </RequireRole>
  );
}

function RODaaSContent() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Hero */}
      <section className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
          — Outcome-Based Solutions —
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Six solutions. Every outcome your business needs.
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-300 sm:text-base">
          Launch with an accountable engagement instead of shopping individual
          services — every STIOOS capability is bundled inside six managed
          solutions, each with a transparent pricing model and guaranteed
          outcomes.
        </p>
      </section>

      {/* Solution grid */}
      <section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((sol) => {
            const IconCmp = sol.icon;
            return (
              <Link
                key={sol.id}
                href={`/solutions/${sol.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all hover:border-amber-400/30 hover:shadow-lg"
              >
                {/* Gradient header */}
                <div
                  className={cn(
                    "relative h-40 overflow-hidden bg-gradient-to-br p-5",
                    sol.gradient
                  )}
                >
                  {/* Ghost number */}
                  <span className="absolute right-4 top-2 text-7xl font-black text-white/15">
                    {sol.id}
                  </span>
                  {/* Metric badge */}
                  <div className="relative inline-flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    <IconCmp className="h-3.5 w-3.5" />
                    {sol.metric.value} {sol.metric.label}
                  </div>
                  {/* Icon tile */}
                  <div className="absolute bottom-4 left-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 shadow-lg">
                    <IconCmp className="h-5 w-5 text-slate-900" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-white">
                    {sol.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-sm text-slate-400">
                    {sol.description}
                  </p>
                  <div className="mt-3">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        sol.tile,
                        sol.strong
                      )}
                    >
                      {sol.charge}
                    </span>
                  </div>
                  <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-300 transition-colors group-hover:text-amber-200">
                    Explore solution
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* RODaaS highlight section */}
      <section className="overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Results on Delivery as a Service
              </h2>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Pay only for measurable, guaranteed impact — sales, cost savings,
              or qualified applicants delivered for a per-unit, outcome-based
              engagement model. You define the outcome; we deliver it. If the
              outcome isn't met, you don't pay.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                Outcome-based — pay per delivery
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                100% results guaranteed
              </span>
            </div>
          </div>
          <Button
            asChild
            className="bg-amber-500 text-slate-900 hover:bg-amber-400"
          >
            <Link href="/solutions/results-on-delivery-as-a-service">
              Explore RODaaS
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="mb-5 text-center text-xl font-bold text-white sm:text-2xl">
          How RODaaS Works
        </h2>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { step: "01", title: "Define Outcome", desc: "Tell us the exact result you need — sales, leads, cost savings, or deliverables.", icon: TrendingUp },
            { step: "02", title: "We Deliver", desc: "Our delivery team executes the work using the right mix of services and talent.", icon: Workflow },
            { step: "03", title: "Verify Results", desc: "Outcomes are measured and verified against agreed-upon metrics before billing.", icon: Code2 },
            { step: "04", title: "Pay Per Delivery", desc: "You only pay for verified, delivered outcomes — no retainer, no risk.", icon: Trophy },
          ].map((item) => {
            const IconCmp = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] ring-1 ring-white/10">
                    <IconCmp className="h-5 w-5 text-amber-400" />
                  </span>
                  <span className="text-2xl font-black text-white/10">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats bar */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { value: "+307%", label: "Results guaranteed" },
          { value: "6", label: "Outcome-based solutions" },
          { value: "360+", label: "Services bundled inside" },
          { value: "100%", label: "Pay only on delivery" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center"
          >
            <p className="text-2xl font-black text-amber-300 sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:p-8">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          Ready to launch with guaranteed outcomes?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Request a scoping call and our delivery team will design a custom
          outcome-based engagement for your business.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-amber-500 text-slate-900 hover:bg-amber-400">
            <Link href="/dashboard/buyer/requests">
              <ArrowRight className="mr-1.5 h-4 w-4" /> Request a Scoping Call
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/solutions/results-on-delivery-as-a-service">
              Learn More About RODaaS
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
