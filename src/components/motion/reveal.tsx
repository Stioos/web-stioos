"use client";

// ============================================================
// Dependency-free motion primitives (performance pass).
//
// These replace the framer-motion runtime across all public
// routes. framer-motion was the heaviest client dependency
// after recharts (~40 KB gzip + hydration cost per route);
// every animation it powered here is either a scroll-triggered
// fade/rise (IntersectionObserver + CSS transition) or a
// numeric count-up (requestAnimationFrame) — both are ~20
// lines of framework-free code below.
// ============================================================

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Fires once when the element scrolls into view (IntersectionObserver),
 * mirroring framer-motion's `useInView(ref, { once: true })`.
 * If IO is unavailable the hook flips on immediately so content is
 * never lost.
 */
export function useInViewOnce<T extends HTMLElement>(margin = "-40px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Legacy fallback — defer via rAF so state flips in a callback
      // rather than synchronously within the effect body.
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: `${margin} 0px` }
    );
    io.observe(el);
    // Fallback: if the observer hasn't fired within 1.5s (e.g. element
    // already in view but observer didn't trigger), force inView=true so
    // count-up animations start and values don't stay at 0.
    const fallback = window.setTimeout(() => {
      setInView(true);
      io.disconnect();
    }, 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [margin]);

  return [ref, inView] as const;
}

/** rAF count-up, easeOut cubic — replaces framer-motion's `animate()`. */
export function useCountUp(target: number, start: boolean, duration = 1.6): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      // Fallback: if the animation never starts within 2s, show the
      // target value directly so cards don't stay at 0/0.0.
      const fallback = window.setTimeout(() => setValue(target), 2000);
      return () => window.clearTimeout(fallback);
    }
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

type RevealTag =
  | "div"
  | "aside"
  | "article"
  | "li"
  | "section"
  | "span"
  | "p"
  | "h2"
  | "h3"
  | "dl"
  | "ol"
  | "ul"
  | "a";

/**
 * Scroll-triggered reveal — drop-in replacement for the repeated
 * `<motion.div {...fadeUp}>` pattern (initial opacity 0 / y 18 →
 * whileInView opacity 1 / y 0, once). Rendering is gated by an
 * IntersectionObserver; the visual transition is pure CSS
 * (`.reveal` / `.reveal-in` in globals.css), so no animation
 * library ships to the client.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  style,
  id,
  margin = "-60px",
  href,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds — staggers grids of reveals (was `transition.delay`). */
  delay?: number;
  as?: RevealTag;
  style?: CSSProperties;
  id?: string;
  margin?: string;
  /** Rendered when `as` is used for anchors (e.g. directory card links). */
  href?: string;
  ariaLabel?: string;
}) {
  const [ref, inView] = useInViewOnce<HTMLElement>(margin);
  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      id={id}
      href={href}
      aria-label={ariaLabel}
      className={cn("reveal", inView && "reveal-in", className)}
      style={{
        ...style,
        ...(delay > 0 ? { transitionDelay: `${delay}s` } : null),
      }}
    >
      {children}
    </Tag>
  );
}
