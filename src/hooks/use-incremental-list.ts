"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface IncrementalOptions {
  /** How many items to render initially. */
  initial?: number;
  /** How many items to reveal per expansion. */
  step?: number;
  /** When this key changes (search query, active filter…) the window resets. */
  resetKey?: string;
}

/**
 * Incremental list rendering for large catalogs.
 *
 * The marketplace grid can hold 305 heavy cards; rendering all of them at
 * once (and re-rendering on every search keystroke) is the single largest
 * source of main-thread jank in the app. This hook bounds the rendered
 * window (default 24) and reveals more as the sentinel scrolls into view,
 * with an accessible "show more" affordance driven by the returned state.
 */
export function useIncrementalList<T>(
  items: T[],
  { initial = 24, step = 24, resetKey }: IncrementalOptions = {}
) {
  const [count, setCount] = useState(initial);
  // Reset the window whenever the filter/search context changes, using the
  // React-endorsed "adjust state during render" pattern (a setState-in-effect
  // here triggers the react-hooks/set-state-in-effect rule and an extra
  // render pass).
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setCount(initial);
  }

  const visible = useMemo(() => items.slice(0, count), [items, count]);
  const hasMore = items.length > visible.length;
  const remaining = items.length - visible.length;

  const loadMore = useCallback(() => {
    setCount((c) => Math.min(c + step, items.length));
  }, [step, items.length]);

  // Sentinel-based auto-expansion: while the visitor scrolls near the end
  // of the rendered window, keep revealing the next chunk.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore();
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return { visible, hasMore, remaining, loadMore, sentinelRef };
}
