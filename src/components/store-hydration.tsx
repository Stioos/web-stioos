"use client";

import { useEffect } from "react";
import { ensureFullCatalog, purgePersistedDemoState, useAppStore } from "@/lib/store";

/**
 * Rehydrates the persisted demo store from localStorage after mount so
 * SSR markup and first client render always match.
 *
 * SELF-HEALING: zustand's persist middleware swallows hydration failures
 * (corrupt/truncated JSON in localStorage, an unexpected merge throw) and
 * leaves hasHydrated() === false FOREVER — every dashboard then strands on
 * its loading skeleton with no recovery. The quarantine hook in the store
 * removes a poisoned blob on first failure; this loop retries rehydrate a
 * few times and, as a last resort, wipes all persisted demo keys so the
 * next pass starts from clean seed data.
 *
 * PERFORMANCE: once hydration has settled, the deferred generated catalog
 * (the division catalog chunks, the heaviest data modules in the app) start
 * so the store's static bundle stays small and every route paints fast.
 */
export function StoreHydration() {
  useEffect(() => {
    let alive = true;
    const kickCatalog = () => {
      if (alive) ensureFullCatalog();
    };

    // Start loading the full service catalog IMMEDIATELY — it comes
    // from static data files, not from persisted state, so it doesn't
    // need to wait for localStorage hydration. This prevents service
    // detail pages from staying on skeleton placeholders when the
    // persist middleware is slow or stuck.
    kickCatalog();

    const persist = useAppStore.persist;
    persist.rehydrate();
    if (persist.hasHydrated()) {
      return () => {
        alive = false;
      };
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      if (persist.hasHydrated()) {
        window.clearInterval(timer);
        return;
      }
      attempts += 1;
      if (attempts > 3) {
        window.clearInterval(timer);
        purgePersistedDemoState();
        persist.rehydrate();
        return;
      }
      persist.rehydrate();
    }, 250);

    // Fallback: if the catalog still hasn't loaded after 3s, force the
    // catalogReady flag and retry the load — dev-mode compilation can
    // fail on the first attempt and succeed on retry.
    const fallback = window.setTimeout(() => {
      if (alive && !useAppStore.getState().catalogReady) {
        useAppStore.setState({ catalogReady: true });
        // Retry the catalog load in case the first attempt failed
        // during a dev-server compilation cycle.
        ensureFullCatalog();
      }
    }, 3000);

    return () => {
      alive = false;
      window.clearInterval(timer);
      window.clearTimeout(fallback);
    };
  }, []);
  return null;
}
