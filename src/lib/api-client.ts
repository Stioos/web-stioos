// ============================================================
// API CLIENT — typed fetch wrapper with JWT auth + auto-refresh
// ============================================================
// Handles:
//   - Bearer token injection on every request
//   - Automatic token refresh on 401 (once, then retries)
//   - JSON serialization / deserialization
//   - Error normalization
//   - SSR-safe (no window references in module scope)
//
// For 200K users:
//   - All requests are stateless (JWT in Authorization header)
//   - No server-side sessions — horizontally scalable
//   - Refresh tokens are HttpOnly cookies (set by /api/auth/login)
//   - Access tokens are short-lived (15min) for security
// ============================================================

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ---------- Token storage ----------

const ACCESS_TOKEN_KEY = "stioos_access_token";
const REFRESH_FLAG_KEY = "stioos_has_refresh";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(REFRESH_FLAG_KEY, "1");
}

function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_FLAG_KEY);
}

// ---------- Refresh logic ----------

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // Deduplicate concurrent refresh attempts
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // sends HttpOnly refresh cookie
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        clearTokens();
        return null;
      }
      const json = await res.json();
      if (json.success && json.data?.accessToken) {
        setAccessToken(json.data.accessToken);
        return json.data.accessToken as string;
      }
      clearTokens();
      return null;
    } catch {
      clearTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ---------- Core fetch wrapper ----------

interface FetchOptions extends RequestInit {
  // If true, a 401 response triggers a token refresh + single retry
  auth?: boolean;
  // JSON body to send (automatically serialized)
  body?: unknown;
  // Query params to append to the URL
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { auth = true, body, params, headers, ...rest } = options;

  // Build URL with query params
  const url = new URL(path, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...rest,
    headers: requestHeaders,
    credentials: "include", // always send cookies for refresh
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  let response = await fetch(url.toString(), config);

  // Auto-refresh on 401 (single retry)
  if (response.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      requestHeaders["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(url.toString(), { ...config, headers: requestHeaders });
    }
  }

  const json: ApiResponse<T> = await response.json();

  if (!response.ok || !json.success) {
    const errMsg = (json as ApiError).error || `Request failed (${response.status})`;
    const error = new Error(errMsg) as Error & { status: number; code?: string };
    error.status = response.status;
    error.code = (json as ApiError).code;
    throw error;
  }

  return (json as ApiSuccess<T>).data;
}

// ---------- Auth-specific helpers ----------

export const authApi = {
  async login(email: string, password: string) {
    const data = await apiFetch<{
      user: { id: string; name: string; email: string; role: string };
      accessToken: string;
      refreshToken?: string;
    }>("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
    setAccessToken(data.accessToken);
    return data;
  },

  async register(input: {
    name: string;
    email: string;
    password: string;
    company?: string;
    phone?: string;
    country?: string;
  }) {
    const data = await apiFetch<{
      user: { id: string; name: string; email: string; role: string };
      accessToken: string;
    }>("/api/auth/register", {
      method: "POST",
      auth: false,
      body: input,
    });
    setAccessToken(data.accessToken);
    return data;
  },

  async me() {
    return apiFetch<{ id: string; name: string; email: string; role: string; company?: string }>(
      "/api/auth/me"
    );
  },

  async logout() {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore — clearing local tokens is the important part
    }
    clearTokens();
  },

  isLoggedIn(): boolean {
    return !!getAccessToken();
  },

  getToken(): string | null {
    return getAccessToken();
  },
};

// ---------- Domain API helpers ----------

export const requestsApi = {
  list(params?: { status?: string; kind?: string; page?: number; limit?: number }) {
    return apiFetch<{
      requests: unknown[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/api/requests", { params });
  },

  get(id: string) {
    return apiFetch<unknown>(`/api/requests/${id}`);
  },

  create(input: {
    categoryId: string;
    title: string;
    details: string;
    budgetRange: string;
    timeline: string;
    kind?: string;
    meta?: Record<string, string>;
  }) {
    return apiFetch<unknown>("/api/requests", { method: "POST", body: input });
  },

  updateStatus(id: string, status: string, note?: string) {
    return apiFetch<unknown>(`/api/requests/${id}/status`, {
      method: "PATCH",
      body: { status, note },
    });
  },
};

export const quotesApi = {
  create(input: {
    requestId: string;
    items: Array<{ description: string; quantity: number; unitPrice: number }>;
    taxRate: number;
    validityDays: number;
    notes?: string;
  }) {
    return apiFetch<unknown>("/api/quotes", { method: "POST", body: input });
  },

  accept(quoteId: string) {
    return apiFetch<unknown>(`/api/quotes/${quoteId}/accept`, { method: "POST" });
  },

  decline(quoteId: string, reason: string) {
    return apiFetch<unknown>(`/api/quotes/${quoteId}/decline`, {
      method: "POST",
      body: { reason },
    });
  },
};

export const ordersApi = {
  list(params?: { status?: string; page?: number; limit?: number }) {
    return apiFetch<{
      orders: unknown[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/api/orders", { params });
  },

  get(id: string) {
    return apiFetch<unknown>(`/api/orders/${id}`);
  },

  acceptDelivery(id: string) {
    return apiFetch<unknown>(`/api/orders/${id}/accept`, { method: "POST" });
  },

  createFromQuote(quoteId: string, input?: { deliveryType?: string; dueDays?: number }) {
    return apiFetch<unknown>("/api/admin/orders/create-from-quote", {
      method: "POST",
      body: { quoteId, ...input },
    });
  },

  markDelivered(id: string) {
    return apiFetch<unknown>(`/api/admin/orders/${id}/deliver`, { method: "POST" });
  },
};

export const invoicesApi = {
  list(params?: { status?: string; page?: number; limit?: number }) {
    return apiFetch<{
      invoices: unknown[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/api/invoices", { params });
  },

  get(id: string) {
    return apiFetch<unknown>(`/api/invoices/${id}`);
  },

  pay(id: string, input: { method: string; gatewayReference?: string }) {
    return apiFetch<unknown>(`/api/invoices/${id}/pay`, { method: "POST", body: input });
  },
};

export const transactionsApi = {
  list(params?: { type?: string; page?: number; limit?: number }) {
    return apiFetch<{
      transactions: unknown[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/api/transactions", { params });
  },
};

export const servicesApi = {
  list(params?: { category?: string; search?: string; page?: number; limit?: number }) {
    return apiFetch<{
      services: unknown[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/api/services", { params });
  },

  get(slug: string) {
    return apiFetch<unknown>(`/api/services/${slug}`);
  },
};

export const categoriesApi = {
  list() {
    return apiFetch<{ categories: unknown[] }>("/api/categories");
  },

  get(slug: string) {
    return apiFetch<unknown>(`/api/categories/${slug}`);
  },
};
