import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { Check } from "lucide-react";

export const metadata = {
  title: "Marketplace & Admin Access",
};

const VALUE_POINTS = [
  {
    title: "One intelligent marketplace",
    body: "AI, automation, programming, and business intelligence services — procure everything from a single platform.",
  },
  {
    title: "Work with vetted experts",
    body: "Every division is curated: 305 expert services across 7 solution divisions, with transparent scoping.",
  },
  {
    title: "Everything in one dashboard",
    body: "Track orders, messages, and your wishlist in a single workspace built for buyers.",
  },
];

const STATS = [
  { value: "305", label: "Expert services" },
  { value: "11", label: "Solution divisions" },
  { value: "40+", label: "Technologies" },
  { value: "24/7", label: "Expert support" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background lg:h-screen lg:overflow-hidden">
      {/* Left brand panel — desktop only */}
      <aside className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-brand-ink p-10 xl:p-14 lg:flex">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-blue-600/20 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-amber-500/10 blur-[120px]"
          aria-hidden="true"
        />

        <div className="relative">
          <Logo className="h-9 w-auto" priority />
          {/* Desktop-only injection slot — the signup page portals its
              registration intro (track description + Professional/Company
              selector cards) here, filling the empty area under the logo. */}
          <div id="auth-left-top-slot" className="mt-8" />
        </div>

        <div className="relative max-w-lg">
          <p className="eyebrow mb-4 text-amber-400">Marketplace &amp; Admin Access</p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
            Intelligence that builds
            <br />
            <span className="text-gradient-brand">what&apos;s next.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            One account for the whole STIOOS GLOBAL marketplace — buyers, teams,
            and platform admins sign in through the same door.
          </p>

          <ul className="mt-10 space-y-5">
            {VALUE_POINTS.map((point) => (
              <li key={point.title} className="flex gap-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-400/15 ring-1 ring-inset ring-amber-400/30">
                  <Check className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.5} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{point.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-slate-400">
                    {point.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-bold tracking-tight text-white">{stat.value}</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Right content area — fixed to the viewport on desktop so the
          page renders without a page-level scrollbar; the column itself
          scrolls internally only if a short screen ever needs it. */}
      <main className="flex flex-1 justify-center bg-background px-4 py-8 sm:px-8 lg:h-screen lg:overflow-y-auto lg:py-4">
        <div className="m-auto w-full max-w-md lg:max-w-lg">{children}</div>
      </main>
    </div>
  );
}
