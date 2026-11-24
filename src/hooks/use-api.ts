/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { requestsApi, ordersApi, invoicesApi, transactionsApi, servicesApi, categoriesApi } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";

// ============================================================
// DATA FETCHING HOOKS — React hooks for API data
// ============================================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseApiState<T> {
  const { user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const doFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const key = JSON.stringify({ user: user?.id, deps });
    if (!user) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err);
          setData(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id, ...deps]);

  return { data, loading: loading || (!!user && !data && !error), error, refetch: doFetch };
}

// ---------- Domain hooks ----------

export function useRequests(params?: { status?: string; kind?: string }) {
  return useApi(
    () => requestsApi.list(params),
    [params?.status, params?.kind]
  );
}

export function useRequest(id: string | null) {
  return useApi(
    () => (id ? requestsApi.get(id) : Promise.resolve(null)),
    [id]
  );
}

export function useOrders(params?: { status?: string }) {
  return useApi(
    () => ordersApi.list(params),
    [params?.status]
  );
}

export function useOrder(id: string | null) {
  return useApi(
    () => (id ? ordersApi.get(id) : Promise.resolve(null)),
    [id]
  );
}

export function useInvoices(params?: { status?: string }) {
  return useApi(
    () => invoicesApi.list(params),
    [params?.status]
  );
}

export function useTransactions(params?: { type?: string }) {
  return useApi(
    () => transactionsApi.list(params),
    [params?.type]
  );
}

export function useServices(params?: { category?: string; search?: string }) {
  return useApi(
    () => servicesApi.list(params),
    [params?.category, params?.search]
  );
}

export function useCategories() {
  return useApi(() => categoriesApi.list(), []);
}
