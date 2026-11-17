"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// DIVISION INFOGRAPHICS — pure CSS/SVG animated visual
// primitives shared across the 16 section designs. Every chart
// is dependency-free (no recharts on public routes) and driven
// by IntersectionObserver so animations fire on scroll.
// ============================================================

/** rAF count-up, easeOut cubic — animated number reveal. */
export function useCountUp(target: number, start: boolean, duration = 1.4): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const total = duration * 1000;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / total, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

/** Fires once when the element scrolls into view. */
export function useInViewOnce<T extends HTMLElement>(margin = "-40px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

// ------------------------------------------------------------
// Sparkline — tiny inline trend line from data points.
// ------------------------------------------------------------

export function Sparkline({
  data,
  className,
  stroke = "currentColor",
}: {
  data: number[];
  className?: string;
  stroke?: string;
}) {
  const w = 72;
  const h = 24;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const d = `M${pts.join(" L")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cn("h-6 w-[72px]", className)} fill="none" aria-hidden="true">
      <path d={d} stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ------------------------------------------------------------
// CountUpNumber — animates from 0 to a numeric target when in view.
// Pass `suffix` for "%" etc. and `decimals` for fractional values.
// ------------------------------------------------------------

export function CountUpNumber({
  target,
  suffix = "",
  decimals = 0,
  className,
}: {
  target: number;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [ref, inView] = useInViewOnce<HTMLSpanElement>();
  const v = useCountUp(target, inView);
  return (
    <span ref={ref} className={className}>
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// ------------------------------------------------------------
// AnimatedBar — horizontal bar that grows from 0 to `pct` on view.
// ------------------------------------------------------------

export function AnimatedBar({
  pct,
  gradient,
  className,
  delay = 0,
}: {
  pct: number;
  gradient: string;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <div
        className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", gradient)}
        style={{
          width: inView ? `${pct}%` : "0%",
          transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
          transitionDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

// ------------------------------------------------------------
// RadialGauge — SVG arc that fills from 0 to `value` (0-100)
// with a count-up center label.
// ------------------------------------------------------------

export function RadialGauge({
  value,
  label,
  colorClass,
  size = 120,
  caption,
}: {
  value: number;
  label: string;
  colorClass: string;
  size?: number;
  caption?: string;
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const v = useCountUp(value, inView);
  const stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (v / 100) * circ;
  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className={`relative ${colorClass}`} style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/[0.06]" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={inView ? offset : circ}
            style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white tabular-nums">
            {Math.round(v)}
            <span className="text-sm">%</span>
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-slate-400">{label}</span>
      {caption && <span className="text-[10px] text-slate-500">{caption}</span>}
    </div>
  );
}

// ------------------------------------------------------------
// TechRadar — concentric ring chart with positioned tech nodes.
// ------------------------------------------------------------

export function TechRadarChart({
  rings,
  nodes,
  colorClass,
  accentGlowClass,
}: {
  rings: { label: string }[];
  nodes: { name: string; ring: number; angle: number }[];
  colorClass: string;
  accentGlowClass: string;
}) {
  const size = 360;
  const center = size / 2;
  const ringGap = center / (rings.length + 0.5);
  const [ref, inView] = useInViewOnce<HTMLDivElement>();

  return (
    <div ref={ref} className="relative mx-auto flex items-center justify-center">
      <svg viewBox={`0 0 ${size} ${size}`} className={`relative h-auto w-full max-w-[360px] ${colorClass}`} aria-hidden="true">
        {/* rings */}
        {rings.map((ring, i) => {
          const r = ringGap * (i + 1);
          return (
            <circle key={ring.label} cx={center} cy={center} r={r} fill="none" stroke="currentColor" strokeWidth="1" className={i === 0 ? "text-white/[0.12]" : "text-white/[0.06]"} />
          );
        })}
        {/* axis lines */}
        <line x1={center} y1={0} x2={center} y2={size} stroke="currentColor" strokeWidth="0.5" className="text-white/[0.05]" />
        <line x1={0} y1={center} x2={size} y2={center} stroke="currentColor" strokeWidth="0.5" className="text-white/[0.05]" />
        {/* nodes */}
        {nodes.map((node, i) => {
          const r = ringGap * (node.ring + 0.5);
          const rad = (node.angle * Math.PI) / 180;
          const x = center + r * Math.cos(rad);
          const y = center + r * Math.sin(rad);
          return (
            <g key={node.name} style={{ opacity: inView ? 1 : 0, transition: `opacity 0.5s ${i * 0.07}s` }}>
              <circle cx={x} cy={y} r={node.ring === 0 ? 9 : 7} fill="currentColor" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <text x={x} y={y - 13} textAnchor="middle" className="fill-slate-300 text-[9px] font-semibold">
                {node.name}
              </text>
            </g>
          );
        })}
        {/* ring labels */}
        {rings.map((ring, i) => {
          const r = ringGap * (i + 1);
          return (
            <text key={ring.label} x={center + 4} y={center - r + 12} className="fill-slate-500 text-[8px] font-medium uppercase tracking-wider">
              {ring.label}
            </text>
          );
        })}
      </svg>
      <div className={cn("pointer-events-none absolute inset-0 rounded-full opacity-20 blur-3xl", accentGlowClass)} aria-hidden="true" />
    </div>
  );
}

// ------------------------------------------------------------
// ProgressBar — thin progress bar (0-100) for outcome cards.
// ------------------------------------------------------------

export function ProgressBar({
  value,
  gradient,
  className,
}: {
  value: number;
  gradient: string;
  className?: string;
}) {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <div
        className={cn("absolute inset-y-0 left-0 rounded-full bg-gradient-to-r", gradient)}
        style={{ width: inView ? `${value}%` : "0%", transition: "width 1.4s cubic-bezier(0.22,1,0.36,1)" }}
      />
    </div>
  );
}
