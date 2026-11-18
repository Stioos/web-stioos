"use client";

/**
 * Client session state backed by the real Prisma + cookie-based auth API.
 *
 * The session cookie (`stioos-session`) is HTTP-only — client JS cannot read
 * it. This provider is the single source of truth for "who is signed in"
 * across the public-facing surfaces (header, login drawer, signup form,
 * lead modal, service-card wishlist button). It fetches `/api/auth/me`
 * once on mount and exposes `refresh()` so callers can re-fetch after
 * login / logout / signup.
 *
 * This deliberately lives in its own module (separate from the legacy
 * `useAppStore`) so unrewired pages that still depend on the store keep
 * working untouched.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CurrentUserKind = "buyer" | "admin" | null;

export interface BuyerDTOLite {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  status: string;
  role: "buyer" | "member";
  inquiriesCount?: number;
  createdAt?: string;
  lastActive?: string | null;
  registrationType?: string | null;
  accountType?: string | null;
  profession?: string | null;
  companySize?: string | null;
  phoneCountry?: string | null;
  intent?: string | null;
  intentTimeline?: string | null;
  registrationSource?: string | null;
}

export interface AdminDTOLite {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  status: string;
  title: string;
  lastActive?: string | null;
  createdAt?: string;
  avatarInitials?: string | null;
}

export interface CurrentUserValue {
  loading: boolean;
  user: BuyerDTOLite | null;
  admin: AdminDTOLite | null;
  kind: CurrentUserKind;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

const CurrentUserContext = createContext<CurrentUserValue | null>(null);

interface MeResponse {
  ok: boolean;
  kind?: "buyer" | "admin";
  user?: BuyerDTOLite;
  admin?: AdminDTOLite;
}

async function fetchMe(signal?: AbortSignal): Promise<MeResponse> {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      signal,
    });
    if (!res.ok) return { ok: false };
    return (await res.json()) as MeResponse;
  } catch {
    return { ok: false };
  }
}

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<BuyerDTOLite | null>(null);
  const [admin, setAdmin] = useState<AdminDTOLite | null>(null);
  const [kind, setKind] = useState<CurrentUserKind>(null);
  const inFlight = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    // Coalesce concurrent refresh() calls into a single fetch.
    if (inFlight.current) {
      await new Promise<void>((resolve) => {
        const prev = inFlight.current!;
        const check = () => {
          if (inFlight.current === prev || inFlight.current === null) resolve();
          else setTimeout(check, 20);
        };
        check();
      });
      return;
    }
    const controller = new AbortController();
    inFlight.current = controller;
    try {
      const data = await fetchMe(controller.signal);
      if (data.ok && data.kind === "buyer" && data.user) {
        setUser(data.user);
        setAdmin(null);
        setKind("buyer");
      } else if (data.ok && data.kind === "admin" && data.admin) {
        setUser(null);
        setAdmin(data.admin);
        setKind("admin");
      } else {
        setUser(null);
        setAdmin(null);
        setKind(null);
      }
    } finally {
      setLoading(false);
      inFlight.current = null;
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount.
    void refresh();
    // When the tab becomes visible again, re-check — covers the case where
    // the user signed in or out in another tab.
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onVisibility);
    };
  }, [refresh]);

  const value = useMemo<CurrentUserValue>(
    () => ({
      loading,
      user,
      admin,
      kind,
      isAuthenticated: kind !== null,
      refresh,
    }),
    [loading, user, admin, kind, refresh]
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser(): CurrentUserValue {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    // Should be unreachable since the provider wraps the app in the root
    // layout. Returning a safe default keeps callers from crashing if it
    // ever happens (e.g. during early hydration / tests).
    return {
      loading: true,
      user: null,
      admin: null,
      kind: null,
      isAuthenticated: false,
      refresh: async () => {},
    };
  }
  return ctx;
}

/**
 * Convenience helper for handlers that need to log out the current
 * session regardless of role — calls the API, then refreshes the
 * client cache. Returns true on success.
 */
export async function signOutCurrent(): Promise<boolean> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    return true;
  } catch {
    return false;
  }
}
