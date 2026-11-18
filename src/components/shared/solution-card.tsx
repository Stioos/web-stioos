import Link from "next/link";
import { ArrowRight, TrendingUp, Wallet } from "lucide-react";
import type { Solution } from "@/data/solutions";

/**
 * A single "as-a-Service" solution card — matches the editorial card design
 * used on the home page solution grid (gradient header band, ghost index
 * watermark, glassmorphic icon orb, outcome-metric badge, pricing pill,
 * "Explore solution" footer link).
 *
 * Used inside the "Digital, Tech & AI Services" panel of the Browse
 * Categories dropdown.
 */
export function SolutionCard({
  sol,
  onNavigate,
}: {
  sol: Solution;
  onNavigate?: () => void;
}) {
  const Icon = sol.icon;
  return (
    <Link
      href={`/solutions/${sol.slug}`}
      onClick={onNavigate}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.18]"
    >
      {/* Colored glow shadow on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `0 18px 50px -16px ${sol.glow}` }}
      />

      {/* ── Gradient header band ── */}
      <div
        className={`relative h-[68px] overflow-hidden bg-gradient-to-br ${sol.gradient}`}
      >
        {/* Diagonal light-sweep on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ffffff33] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
        {/* Ghost index watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-0 select-none text-4xl font-black leading-none tracking-tight text-[#ffffff2e]"
        >
          {sol.id}
        </span>
        {/* Glassmorphic icon orb */}
        <div className="absolute bottom-2 left-3">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-[#ffffff26] backdrop-blur-md ring-1 ring-[#ffffff4d] transition-transform duration-500 group-hover:scale-110">
            <Icon className="h-4 w-4 text-white" aria-hidden="true" />
          </span>
        </div>
        {/* Outcome-metric badge */}
        <span className="absolute top-2 left-3 inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold text-slate-50 backdrop-blur-md">
          <TrendingUp className="h-2.5 w-2.5" aria-hidden="true" />
          {sol.metric.value} {sol.metric.label}
        </span>
      </div>

      {/* ── Card body ── */}
      <div className="relative flex flex-1 flex-col p-3">
        <h3 className="text-[12.5px] font-bold leading-tight tracking-tight text-white">
          {sol.name}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-snug text-slate-400">
          {sol.description}
        </p>

        {/* Engagement-model pill */}
        <div
          className={`mt-2 inline-flex items-center gap-1 self-start rounded-md px-2 py-0.5 ring-1 ${sol.tile}`}
        >
          <Wallet className={`h-2.5 w-2.5 ${sol.iconColor}`} aria-hidden="true" />
          <span className={`text-[10px] font-semibold ${sol.iconColor}`}>
            {sol.charge}
          </span>
        </div>

        {/* Divider + Explore link */}
        <div className="mt-2 border-t border-white/[0.06] pt-1.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${sol.strong} transition-colors`}
          >
            Explore solution
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
