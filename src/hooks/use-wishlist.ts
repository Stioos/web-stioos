"use client";

/**
 * Wishlist hook backed by the real API.
 *
 * - Fetches `GET /api/wishlist` once the current user is a signed-in buyer.
 * - Exposes `{ slugs, has, toggle, loading }`.
 * - `toggle(slug)` POSTs to `/api/wishlist` with `{ serviceSlug }` and
 *   updates `slugs` optimistically; returns the new saved state.
 * - Returns empty/disabled when the user is not authenticated so callers
 *   can prompt a login instead of failing silently.
 */

import { useCallback, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

export interface WishlistValue {
  /** Service slugs the signed-in buyer has saved. */
  slugs: string[];
  /** True while the initial load is in flight (auth only). */
  loading: boolean;
  /** `true` when the wishlist is usable (signed-in buyer). */
  enabled: boolean;
  /** Returns true if the slug is currently saved. */
  has: (slug: string) => boolean;
  /**
   * Toggles the given slug. Resolves to the new saved state, or `null`
   * when the toggle could not be applied (e.g. not authenticated).
   */
  toggle: (slug: string) => Promise<boolean | null>;
}

interface WishlistResponse {
  ok: boolean;
  slugs?: string[];
}
interface WishlistToggleResponse {
  ok: boolean;
  saved?: boolean;
}

export function useWishlist(): WishlistValue {
  const { kind, loading: sessionLoading } = useCurrentUser();
  const enabled = kind === "buyer";

  const [slugs, setSlugs] = useState<string[]>([]);
  // `pending` flips true once a toggle is in flight (set from an async
  // callback, never synchronously inside an effect — that satisfies the
  // react-hooks/set-state-in-effect rule). The wishlist GET itself is so
  // fast that we don't need a loading flag for it: the consumer treats an
  // empty `slugs` list (before the fetch resolves) the same as "no saved
  // services yet" — which is correct.
  const [pending, setPending] = useState(false);

  // Load once the session resolves to a buyer. Guests keep the empty
  // initial state — callers must check `enabled` before relying on the
  // slugs list.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetch("/api/wishlist", {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
    })
      .then((r) => (r.ok ? (r.json() as Promise<WishlistResponse>) : null))
      .then((data) => {
        if (cancelled) return;
        setSlugs(data?.slugs ?? []);
      })
      .catch(() => {
        if (cancelled) return;
        setSlugs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const has = useCallback(
    (slug: string) => slugs.includes(slug),
    [slugs]
  );

  const toggle = useCallback(
    async (slug: string): Promise<boolean | null> => {
      if (!enabled) return null;
      const wasSaved = slugs.includes(slug);
      // Optimistic update.
      setSlugs((prev) =>
        wasSaved ? prev.filter((s) => s !== slug) : [...prev, slug]
      );
      setPending(true);
      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ serviceSlug: slug }),
        });
        if (!res.ok) {
          // Revert on failure.
          setSlugs((prev) =>
            wasSaved ? [...prev, slug] : prev.filter((s) => s !== slug)
          );
          return wasSaved;
        }
        const data = (await res.json()) as WishlistToggleResponse;
        const saved = !!data.saved;
        // Reconcile with the server's authoritative answer.
        setSlugs((prev) =>
          saved
            ? prev.includes(slug)
              ? prev
              : [...prev, slug]
            : prev.filter((s) => s !== slug)
        );
        return saved;
      } catch {
        // Revert on network failure.
        setSlugs((prev) =>
          wasSaved ? [...prev, slug] : prev.filter((s) => s !== slug)
        );
        return wasSaved;
      } finally {
        setPending(false);
      }
    },
    [enabled, slugs]
  );

  return {
    slugs,
    loading: sessionLoading || pending,
    enabled,
    has,
    toggle,
  };
}
