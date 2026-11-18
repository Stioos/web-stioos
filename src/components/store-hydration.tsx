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

    // Clean up legacy persisted blobs from superseded builds (the Django/
    // backend era wrote a v21 blob with incompatible auth fields). The
    // current store key is v22, so v21 is harmless, but removing it avoids
    // confusion + frees quota.
    try {
      ["stioos-global-v21", "stioos-global-v20", "stioos-global-v19"].forEach(
        (k) => window.localStorage.removeItem(k)
      );
    } catch {
      /* storage unavailable */
    }

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

    // AGGRESSIVE self-healing: if the first rehydrate doesn't settle
    // immediately, purge ALL persisted demo state + retry ONCE. The
    // previous 3-retry/750ms loop was too slow — visitors saw skeletons
    // for nearly a second before recovery kicked in.
    let attempts = 0;
    const timer = window.setInterval(() => {
      if (persist.hasHydrated()) {
        window.clearInterval(timer);
        return;
      }
      attempts += 1;
      if (attempts >= 1) {
        window.clearInterval(timer);
        purgePersistedDemoState();
        persist.rehydrate();
        return;
      }
      persist.rehydrate();
    }, 150);

    // Fallback: if the catalog still hasn't loaded after 2s, force the
    // catalogReady flag and retry the load — dev-mode compilation can
    // fail on the first attempt and succeed on retry.
    const fallback = window.setTimeout(() => {
      if (alive && !useAppStore.getState().catalogReady) {
        useAppStore.setState({ catalogReady: true });
        ensureFullCatalog();
      }
    }, 2000);

    return () => {
      alive = false;
      window.clearInterval(timer);
      window.clearTimeout(fallback);
    };
  }, []);
  return null;
}
