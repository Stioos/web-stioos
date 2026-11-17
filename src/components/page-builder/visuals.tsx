import type { AccentClasses } from "./accents";

// ============================================================
// PAGE BUILDER VISUALS — pure CSS/SVG mock graphics used by the
// spotlight rows & tech band. No data, no client JS.
// ============================================================

/** Browser-style dashboard with KPI cards + bar chart */
export function DashboardVisual({ a }: { a: AccentClasses }) {
  const bars = [38, 62, 45, 78, 56, 88, 70, 96, 64, 82, 52, 90];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/50">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] bg-white/[0.03] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-rose-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="ml-2 h-3.5 flex-1 rounded bg-white/[0.06]" />
      </div>
      <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[72px_1fr]">
        {/* sidebar */}
        <div className="flex flex-col gap-2 border-r border-white/[0.07] p-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-2 rounded-full ${i === 1 ? a.bar : "bg-white/[0.08]"}`}
            />
          ))}
        </div>
        <div className="p-3">
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
                <span className="block h-1.5 w-8 rounded-full bg-white/15" />
                <span className={`mt-1.5 block h-2.5 w-12 rounded-full ${a.bar}`} />
              </div>
            ))}
          </div>
          {/* chart */}
          <div className="mt-3 flex h-24 items-end gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            {bars.map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-t-sm ${i % 3 === 1 ? a.bar : "bg-white/[0.10]"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Concentric rings with a center badge — assessment / scoring motif */
export function RadialVisual({ a }: { a: AccentClasses }) {
  return (
    <div className="relative flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/50">
      <span className={`absolute h-48 w-48 rounded-full border border-white/[0.07]`} />
      <span className="absolute h-36 w-36 rounded-full border border-white/[0.10]" />
      <span className="absolute h-24 w-24 rounded-full border border-white/20" />
      <span className={`absolute h-48 w-48 rounded-full ${a.glow} blur-3xl opacity-40`} aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-1">
        <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${a.tile}`}>
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 12.5l2.4 2.4 4.6-5.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="text-sm font-bold text-white">96.4</span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Match score</span>
      </div>
      {/* orbit dots */}
      <span className={`absolute left-[18%] top-[24%] h-2.5 w-2.5 rounded-full ${a.bar}`} />
      <span className="absolute right-[16%] top-[40%] h-2 w-2 rounded-full bg-white/30" />
      <span className={`absolute bottom-[18%] right-[28%] h-2.5 w-2.5 rounded-full ${a.bar}`} />
    </div>
  );
}

/** Node network — sourcing / matching motif */
export function NetworkVisual({ a }: { a: AccentClasses }) {
  return (
    <div className="relative h-56 overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/50">
      <svg viewBox="0 0 320 224" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {/* edges */}
        {[
          [60, 70, 160, 112], [60, 70, 110, 40], [160, 112, 250, 60], [160, 112, 264, 150],
          [160, 112, 120, 180], [250, 60, 288, 120], [264, 150, 200, 196], [110, 40, 190, 34],
          [120, 180, 48, 150], [264, 150, 300, 190],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" className="text-white/[0.10]" />
        ))}
        {/* nodes */}
        {[
          { x: 60, y: 70, r: 9, accent: true }, { x: 110, y: 40, r: 5 }, { x: 190, y: 34, r: 5 },
          { x: 160, y: 112, r: 14, accent: true }, { x: 250, y: 60, r: 7 }, { x: 264, y: 150, r: 9, accent: true },
          { x: 288, y: 120, r: 4 }, { x: 120, y: 180, r: 6 }, { x: 200, y: 196, r: 5 },
          { x: 48, y: 150, r: 5 }, { x: 300, y: 190, r: 4 },
        ].map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            className={n.accent ? a.solid : "fill-white/20"}
          />
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-white/10 bg-brand-ink/80 px-2.5 py-1.5 backdrop-blur">
        <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${a.bar}`} />
        <span className="text-[10px] font-semibold text-slate-300">2M+ profiles indexed</span>
      </div>
    </div>
  );
}

/** Certification badge stack — training / guarantee motif */
export function BadgeVisual({ a }: { a: AccentClasses }) {
  return (
    <div className="relative flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/50">
      <span className={`absolute h-40 w-40 rounded-full ${a.glow} blur-3xl opacity-30`} aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-2.5">
        {["Industry-aligned", "Proctored & verified", "Employer-trusted"].map((label, i) => (
          <div
            key={label}
            style={{ marginLeft: `${(i - 1) * 18}px` }}
            className={`flex items-center gap-2.5 rounded-xl border px-4 py-2 backdrop-blur ${
              i === 1 ? `${a.chip} border-white/20 bg-white/[0.06]` : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8L12 3z" strokeLinejoin="round" />
            </svg>
            <span className={`text-xs font-semibold ${i === 1 ? "text-white" : "text-slate-300"}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpotlightVisual({
  variant,
  a,
}: {
  variant: "dashboard" | "radial" | "network" | "badge";
  a: AccentClasses;
}) {
  if (variant === "radial") return <RadialVisual a={a} />;
  if (variant === "network") return <NetworkVisual a={a} />;
  if (variant === "badge") return <BadgeVisual a={a} />;
  return <DashboardVisual a={a} />;
}
