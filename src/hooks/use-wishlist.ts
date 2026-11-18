"use client";

/**
 * Wishlist hook backed by the real API — shared across ALL consumers.
 *
 * Previous version fetched `GET /api/wishlist` inside every ServiceCard that
 * mounted (6 cards on the buyer dashboard → 6 redundant round-trips). This
 * version keeps a module-level singleton: the first consumer triggers ONE
 * fetch, every other consumer subscribes via `useSyncExternalStore` and
 * reads the same cached list. Toggles update the shared cache and notify
 * every subscriber instantly.
 */

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

export interface WishlistValue {
  slugs: string[];
  loading: boolean;
  enabled: boolean;
  has: (slug: string) => boolean;
  toggle: (slug: string) => Promise<boolean | null>;
}

// ---------- module-level shared store ----------

interface WishlistResponse {
  ok: boolean;
  slugs?: string[];
}
interface WishlistToggleResponse {
  ok: boolean;
  saved?: boolean;
}

let slugsCache: string[] = [];
let fetchPromise: Promise<void> | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function loadWishlist(): Promise<void> {
  if (fetchPromise) return fetchPromise;
  fetchPromise = (async () => {
    try {
      const r = await fetch("/api/wishlist", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
      });
      const data = r.ok ? ((await r.json()) as WishlistResponse) : null;
      slugsCache = data?.slugs ?? [];
    } catch {
      slugsCache = [];
    }
    loaded = true;
    fetchPromise = null;
    notify();
  })();
  return fetchPromise;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot(): string[] {
  return slugsCache;
}
// Server snapshot — empty during SSR/hydration.
function getServerSnapshot(): string[] {
  return [];
}

/** Reset the cache (used after logout so a different buyer doesn't see stale slugs). */
export function resetWishlistCache() {
  slugsCache = [];
  loaded = false;
  fetchPromise = null;
  notify();
}

// ---------- hook ----------

export function useWishlist(): WishlistValue {
  const { kind, loading: sessionLoading } = useCurrentUser();
  const enabled = kind === "buyer";
  const slugs = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Trigger the (shared) load once when a buyer is signed in.
  useEffect(() => {
    if (enabled && !loaded && !fetchPromise) void loadWishlist();
    if (!enabled && loaded) resetWishlistCache();
  }, [enabled]);

  const has = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  const toggle = useCallback(
    async (slug: string): Promise<boolean | null> => {
      if (!enabled) return null;
      const wasSaved = slugsCache.includes(slug);
      // Optimistic update on the shared cache.
      slugsCache = wasSaved
        ? slugsCache.filter((s) => s !== slug)
        : [...slugsCache, slug];
      notify();
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ serviceSlug: slug }),
        });
        if (!res.ok) {
          // Revert on failure.
          slugsCache = wasSaved
            ? [...slugsCache, slug]
            : slugsCache.filter((s) => s !== slug);
          notify();
          return wasSaved;
        }
        const data = (await res.json()) as WishlistToggleResponse;
        const saved = !!data.saved;
        // Reconcile with the server's authoritative answer.
        slugsCache = saved
          ? slugsCache.includes(slug)
            ? slugsCache
            : [...slugsCache, slug]
          : slugsCache.filter((s) => s !== slug);
        notify();
        return saved;
      } catch {
        slugsCache = wasSaved
          ? [...slugsCache, slug]
          : slugsCache.filter((s) => s !== slug);
        notify();
        return wasSaved;
      }
    },
    [enabled]
  );

  return {
    slugs,
    loading: sessionLoading,
    enabled,
    has,
    toggle,
  };
}
