import { cookies } from "next/headers";
import type {
  ActivityLog,
  AdminUser,
  AppNotification,
  Category,
  FaqItem,
  Industry,
  Insight,
  MarketMessage,
  MarketOrder,
  MarketRequest,
  MarketThread,
  Resource,
  Role,
  Service,
  Subcategory,
  User,
} from "@/types";

/**
 * Server-side read layer for the dashboards.
 *
 * Every function fetches the Django backend (port 8000) and returns data
 * already shaped to the frontend types (camelCase + ISO dates — Django's
 * DTOs handle the mapping). Auth-required reads forward the HTTP-only
 * `stioos-session` cookie so Django can scope the response (admin sees all,
 * buyer sees own).
 *
 * Signatures are preserved from the Prisma-based version so the dashboard
 * page.tsx files need no changes.
 */

const DJANGO = "http://localhost:8000";

async function cookieHeader(): Promise<Record<string, string>> {
  const c = await cookies();
  const token = c.get("stioos-session")?.value;
  return token ? { cookie: `stioos-session=${token}` } : {};
}

async function apiGet<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${DJANGO}${path}`, {
      headers: await cookieHeader(),
      cache: "no-store",
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

// ---------- catalog reads ----------

export interface ServiceFilter {
  status?: string;
  categoryId?: string;
  subcategoryId?: string;
  featured?: boolean;
  search?: string;
  sort?: "relevance" | "popular" | "rating" | "newest";
  limit?: number;
}

export async function listServicesRaw(
  filter: ServiceFilter = {}
): Promise<Service[]> {
  const qs = new URLSearchParams();
  if (filter.status) qs.set("status", filter.status);
  if (filter.categoryId) qs.set("categoryId", filter.categoryId);
  if (filter.subcategoryId) qs.set("subcategoryId", filter.subcategoryId);
  if (filter.featured !== undefined)
    qs.set("featured", String(filter.featured));
  if (filter.search) qs.set("search", filter.search);
  if (filter.sort) qs.set("sort", filter.sort);
  if (filter.limit) qs.set("limit", String(filter.limit));
  const data = await apiGet<{ services: Service[] }>(
    `/api/services?${qs.toString()}`,
    { services: [] }
  );
  return data.services ?? [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const data = await apiGet<{ services: Service[] }>(
    `/api/services?limit=1000`,
    { services: [] }
  );
  return data.services?.find((s) => s.slug === slug) ?? null;
}

export async function getServiceById(id: string): Promise<Service | null> {
  const data = await apiGet<{ service: Service | null }>(
    `/api/services/${id}`,
    { service: null }
  );
  return data.service ?? null;
}

export async function listCategories(): Promise<Category[]> {
  const data = await apiGet<{ categories: Category[] }>(`/api/categories`, {
    categories: [],
  });
  return data.categories ?? [];
}

export async function listSubcategories(
  categoryId?: string
): Promise<Subcategory[]> {
  const qs = categoryId ? `?categoryId=${categoryId}` : "";
  const data = await apiGet<{ subcategories: Subcategory[] }>(
    `/api/subcategories${qs}`,
    { subcategories: [] }
  );
  return data.subcategories ?? [];
}

// ---------- people reads ----------

export async function listUsers(): Promise<User[]> {
  const data = await apiGet<{ users: User[] }>(`/api/users`, { users: [] });
  return data.users ?? [];
}

export async function getUserById(_id: string): Promise<User | null> {
  // The only caller is the buyer profile page, which passes the current
  // buyer's own id. Django's GET /api/profile returns the signed-in buyer.
  const data = await apiGet<{ user: User | null }>(`/api/profile`, {
    user: null,
  });
  return data.user ?? null;
}

export async function listAdmins(): Promise<AdminUser[]> {
  const data = await apiGet<{ admins: AdminUser[] }>(`/api/admins`, {
    admins: [],
  });
  return data.admins ?? [];
}

export async function listRoles(): Promise<Role[]> {
  const data = await apiGet<{ roles: Role[] }>(`/api/roles`, { roles: [] });
  return data.roles ?? [];
}

// ---------- transaction reads ----------

export async function listInquiries(
  filter: { type?: string; status?: string } = {}
): Promise<Inquiry[]> {
  const qs = new URLSearchParams();
  if (filter.type) qs.set("type", filter.type);
  if (filter.status) qs.set("status", filter.status);
  const data = await apiGet<{ inquiries: Inquiry[] }>(
    `/api/inquiries?${qs.toString()}`,
    { inquiries: [] }
  );
  return data.inquiries ?? [];
}

export async function listAllRequests(): Promise<MarketRequest[]> {
  const data = await apiGet<{ requests: MarketRequest[] }>(`/api/requests`, {
    requests: [],
  });
  return data.requests ?? [];
}

export async function listBuyerRequests(_buyerId: string): Promise<MarketRequest[]> {
  // Buyer cookie scopes the response to the signed-in buyer's own requests.
  const data = await apiGet<{ requests: MarketRequest[] }>(`/api/requests`, {
    requests: [],
  });
  return data.requests ?? [];
}

export async function getRequestById(id: string): Promise<MarketRequest | null> {
  const data = await apiGet<{ request: MarketRequest | null }>(
    `/api/requests/${id}`,
    { request: null }
  );
  return data.request ?? null;
}

export async function listAllOrders(): Promise<MarketOrder[]> {
  const data = await apiGet<{ orders: MarketOrder[] }>(`/api/orders`, {
    orders: [],
  });
  return data.orders ?? [];
}

export async function listBuyerOrders(_buyerId: string): Promise<MarketOrder[]> {
  const data = await apiGet<{ orders: MarketOrder[] }>(`/api/orders`, {
    orders: [],
  });
  return data.orders ?? [];
}

export async function getOrderById(id: string): Promise<MarketOrder | null> {
  const data = await apiGet<{ orders: MarketOrder[] }>(`/api/orders`, {
    orders: [],
  });
  return data.orders?.find((o) => o.id === id) ?? null;
}

export async function listBuyerThreads(_buyerId: string): Promise<MarketThread[]> {
  const data = await apiGet<{ threads: MarketThread[] }>(`/api/threads`, {
    threads: [],
  });
  return data.threads ?? [];
}

export async function getBuyerWishlist(_buyerId: string): Promise<Service[]> {
  const data = await apiGet<{ services: Service[] }>(`/api/wishlist`, {
    services: [],
  });
  return data.services ?? [];
}

// ---------- system reads ----------

export async function listNotifications(): Promise<AppNotification[]> {
  const data = await apiGet<{ notifications: AppNotification[] }>(
    `/api/notifications`,
    { notifications: [] }
  );
  return data.notifications ?? [];
}

export async function listActivity(limit = 300): Promise<ActivityLog[]> {
  const data = await apiGet<{ activity: ActivityLog[] }>(
    `/api/activity?limit=${limit}`,
    { activity: [] }
  );
  return data.activity ?? [];
}

// ---------- content reads (not used by the rewired transactional pages;
// kept as no-ops so any stray import still compiles) ----------

export async function listIndustries(): Promise<Industry[]> {
  return [];
}
export async function listInsights(): Promise<Insight[]> {
  return [];
}
export async function listResources(): Promise<Resource[]> {
  return [];
}
export async function listFaqs(): Promise<FaqItem[]> {
  return [];
}

// ---------- settings ----------

export async function getSetting<T>(key: string): Promise<T | null> {
  const data = await apiGet<{
    brand: unknown;
    marketplace: unknown;
    homepage: unknown;
    security: unknown;
  }>(`/api/settings`, { brand: null, marketplace: null, homepage: null, security: null });
  const map: Record<string, unknown> = {
    brand: data.brand,
    marketplace: data.marketplace,
    homepage: data.homepage,
    security: data.security,
  };
  return (map[key] as T) ?? null;
}

// ---------- dashboard aggregates ----------

export async function getAdminOverview() {
  const data = await apiGet<{
    overview: {
      totalServices: number;
      publishedServices: number;
      draftServices: number;
      serviceRequests: number;
      admins: number;
      users: number;
      newInquiries: number;
      pendingInquiries: number;
    };
  }>(`/api/bootstrap`, { overview: null as unknown });
  return (
    data.overview ?? {
      totalServices: 0,
      publishedServices: 0,
      draftServices: 0,
      serviceRequests: 0,
      admins: 0,
      users: 0,
      newInquiries: 0,
      pendingInquiries: 0,
    }
  );
}

export async function getBuyerOverview(_buyerId: string) {
  // Computed from the buyer's own orders + requests + wishlist (cookie-scoped).
  const [orders, requests, wishlist] = await Promise.all([
    apiGet<{ orders: MarketOrder[] }>(`/api/orders`, { orders: [] }),
    apiGet<{ requests: MarketRequest[] }>(`/api/requests`, { requests: [] }),
    apiGet<{ services: Service[] }>(`/api/wishlist`, { services: [] }),
  ]);
  const activeOrders = (orders.orders ?? []).filter((o) =>
    ["pending", "in_progress"].includes(o.status)
  ).length;
  const completedOrders = (orders.orders ?? []).filter(
    (o) => o.status === "completed"
  ).length;
  const openRequests = (requests.requests ?? []).filter((r) =>
    ["open", "in_review", "in_progress"].includes(r.status)
  ).length;
  return {
    activeOrders,
    completedOrders,
    openRequests,
    savedServices: (wishlist.services ?? []).length,
    totalOrders: (orders.orders ?? []).length,
    totalRequests: (requests.requests ?? []).length,
  };
}

// Re-export the message type for any consumer that imports it from here.
export type { MarketMessage };
