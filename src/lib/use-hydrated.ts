"use client";

import { useSyncExternalStore } from "react";
import { useAppStore } from "@/lib/store";

const subscribe = (onStoreChange: () => void) =>
  useAppStore.persist.onFinishHydration(onStoreChange);

/**
 * Reactively tracks zustand persist rehydration so pages can show
 * skeletons until the persisted demo store is restored.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => useAppStore.persist.hasHydrated(),
    () => false
  );
}
