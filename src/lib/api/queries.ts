import "next/server";
import { db } from "@/lib/db";
import type {
  ActivityLog,
  AdminUser,
  AppNotification,
  Category,
  FaqItem,
  Industry,
  Insight,
  Inquiry,
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
 * Next.js App Router server components import these and read Prisma
 * directly (no HTTP round-trip for the initial page load). Mutations go
 * through /api/* route handlers; after a mutation the page calls
 * router.refresh() to re-run these queries.
 *
 * Every function maps Prisma rows to the frontend types in src/types
 * (ISO date strings, Json fields cast to their TS shapes).
 */

// ---------- mappers ----------

type ServiceRow = Awaited<ReturnType<typeof db.service.findFirst>>;
function mapService(s: NonNullable<ServiceRow>): Service {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    categoryId: s.categoryId,
    subcategoryId: s.subcategoryId,
    shortDescription: s.shortDescription,
    fullDescription: s.fullDescription,
    tags: (s.tags as string[]) ?? [],
    industries: (s.industries as string[]) ?? [],
    deliveryType: s.deliveryType as Service["deliveryType"],
    timeline: s.timeline,
    rating: s.rating,
    reviews: s.reviews,
    popularity: s.popularity,
    featured: s.featured,
    status: s.status as Service["status"],
    accent: s.accent,
    icon: s.icon,
    problemsSolved: (s.problemsSolved as string[]) ?? [],
    capabilities: (s.capabilities as string[]) ?? [],
    deliverables: (s.deliverables as string[]) ?? [],
    process: (s.process as unknown as Service["process"]) ?? [],
    technologies: (s.technologies as string[]) ?? [],
    faqs: (s.faqs as unknown as Service["faqs"]) ?? [],
    metaTitle: s.metaTitle ?? undefined,
    metaDescription: s.metaDescription ?? undefined,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    createdBy: s.createdBy,
  };
}

function mapCategory(c: {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  status: string;
  featured: boolean;
  createdAt: Date;
}): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    tagline: c.tagline,
    description: c.description,
    status: c.status as Category["status"],
    featured: c.featured,
    createdAt: c.createdAt.toISOString(),
  };
}

function mapSubcategory(s: {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  status: string;
  createdAt: Date;
}): Subcategory {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    categoryId: s.categoryId,
    description: s.description,
    status: s.status as Subcategory["status"],
    createdAt: s.createdAt.toISOString(),
  };
}

function mapUser(u: {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  status: string;
  role: string;
  inquiriesCount: number;
  createdAt: Date;
  lastActive: Date | null;
  registrationType: string | null;
  accountType: string | null;
  profession: string | null;
  companySize: string | null;
  phoneCountry: string | null;
  intent: string | null;
  intentTimeline: string | null;
  registrationSource: string | null;
}): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    company: u.company,
    phone: u.phone,
    country: u.country,
    status: u.status as User["status"],
    role: u.role === "member" ? "member" : "buyer",
    inquiriesCount: u.inquiriesCount,
    createdAt: u.createdAt.toISOString(),
    lastActive: u.lastActive ? u.lastActive.toISOString() : "",
    registrationType: (u.registrationType as User["registrationType"]) ?? undefined,
    accountType: u.accountType ?? undefined,
    profession: u.profession ?? undefined,
    companySize: u.companySize ?? undefined,
    phoneCountry: u.phoneCountry ?? undefined,
    intent: u.intent ?? undefined,
    intentTimeline: u.intentTimeline ?? undefined,
    registrationSource: u.registrationSource ?? undefined,
  };
}

function mapAdmin(a: {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  status: string;
  title: string;
  lastActive: Date | null;
  createdAt: Date;
  avatarInitials: string | null;
}): AdminUser {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    roleId: a.roleId,
    status: a.status as AdminUser["status"],
    title: a.title,
    lastActive: a.lastActive ? a.lastActive.toISOString() : "",
    createdAt: a.createdAt.toISOString(),
    avatarInitials: a.avatarInitials ?? undefined,
  };
}

function mapRole(r: {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: unknown;
  isSystem: boolean;
  createdAt: Date;
}): Role {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    permissions: (r.permissions as Role["permissions"]) ?? {},
    isSystem: r.isSystem,
    createdAt: r.createdAt.toISOString(),
  };
}

function mapInquiry(i: {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  type: string;
  serviceId: string | null;
  serviceName: string | null;
  requirements: string;
  budgetRange: string;
  timeline: string;
  status: string;
  createdAt: Date;
}): Inquiry {
  return {
    id: i.id,
    name: i.name,
    email: i.email,
    company: i.company,
    phone: i.phone,
    type: i.type as Inquiry["type"],
    serviceId: i.serviceId ?? undefined,
    serviceName: i.serviceName ?? undefined,
    requirements: i.requirements,
    budgetRange: i.budgetRange,
    timeline: i.timeline,
    status: i.status as Inquiry["status"],
    createdAt: i.createdAt.toISOString(),
  };
}

function mapRequest(r: {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  categoryId: string;
  categoryName: string;
  title: string;
  details: string;
  budgetRange: string;
  timeline: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  kind: string;
  reference: string;
  meta: unknown;
  statusHistory: unknown;
  quotedAmount: number | null;
  orderId: string | null;
}): MarketRequest {
  return {
    id: r.id,
    buyerId: r.buyerId,
    buyerName: r.buyerName,
    buyerCompany: r.buyerCompany,
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    title: r.title,
    details: r.details,
    budgetRange: r.budgetRange,
    timeline: r.timeline,
    status: r.status as MarketRequest["status"],
    createdAt: r.createdAt.toISOString(),
    kind: r.kind as MarketRequest["kind"],
    reference: r.reference,
    meta: (r.meta as Record<string, string>) ?? undefined,
    statusHistory: (r.statusHistory as MarketRequest["statusHistory"]) ?? undefined,
    quotedAmount: r.quotedAmount ?? undefined,
    orderId: r.orderId ?? null,
  };
}

function mapOrder(o: {
  id: string;
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  serviceIcon: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  amount: number;
  status: string;
  deliveryType: string;
  placedAt: Date;
  updatedAt: Date;
  requirements: string | null;
}): MarketOrder {
  return {
    id: o.id,
    serviceId: o.serviceId,
    serviceSlug: o.serviceSlug,
    serviceName: o.serviceName,
    serviceIcon: o.serviceIcon,
    buyerId: o.buyerId,
    buyerName: o.buyerName,
    buyerCompany: o.buyerCompany,
    amount: o.amount,
    status: o.status as MarketOrder["status"],
    deliveryType: o.deliveryType as MarketOrder["deliveryType"],
    placedAt: o.placedAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    requirements: o.requirements ?? undefined,
  };
}

function mapMessage(m: {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  body: string;
  sentAt: Date;
}): MarketMessage {
  return {
    id: m.id,
    threadId: m.threadId,
    senderId: m.senderId,
    senderName: m.senderName,
    senderRole: m.senderRole as MarketMessage["senderRole"],
    body: m.body,
    sentAt: m.sentAt.toISOString(),
  };
}

function mapThread(t: {
  id: string;
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  serviceIcon: string;
  buyerId: string;
  buyerName: string;
  teamId: string;
  teamName: string;
  createdAt: Date;
  lastMessageAt: Date;
  messages?: {
    id: string;
    threadId: string;
    senderId: string;
    senderName: string;
    senderRole: string;
    body: string;
    sentAt: Date;
  }[];
}): MarketThread {
  return {
    id: t.id,
    serviceId: t.serviceId,
    serviceSlug: t.serviceSlug,
    serviceName: t.serviceName,
    serviceIcon: t.serviceIcon,
    buyerId: t.buyerId,
    buyerName: t.buyerName,
    teamId: t.teamId,
    teamName: t.teamName,
    createdAt: t.createdAt.toISOString(),
    lastMessageAt: t.lastMessageAt.toISOString(),
    messages: (t.messages ?? []).map(mapMessage),
  };
}

function mapNotification(n: {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}): AppNotification {
  return {
    id: n.id,
    type: n.type as AppNotification["type"],
    title: n.title,
    message: n.message,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  };
}

function mapActivity(a: {
  id: string;
  actor: string;
  action: string;
  module: string;
  target: string;
  description: string;
  createdAt: Date;
}): ActivityLog {
  return {
    id: a.id,
    actor: a.actor,
    action: a.action,
    module: a.module,
    target: a.target,
    description: a.description,
    createdAt: a.createdAt.toISOString(),
  };
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

export async function listServicesRaw(filter: ServiceFilter = {}): Promise<Service[]> {
  const where: Record<string, unknown> = {};
  if (filter.status) where.status = filter.status;
  if (filter.categoryId) where.categoryId = filter.categoryId;
  if (filter.subcategoryId) where.subcategoryId = filter.subcategoryId;
  if (filter.featured !== undefined) where.featured = filter.featured;
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search } },
      { shortDescription: { contains: filter.search } },
      { tags: { contains: filter.search } },
    ];
  }
  let orderBy: Record<string, "asc" | "desc"> = { popularity: "desc" };
  if (filter.sort === "popular") orderBy = { popularity: "desc" };
  if (filter.sort === "rating") orderBy = { rating: "desc" };
  if (filter.sort === "newest") orderBy = { createdAt: "desc" };
  const rows = await db.service.findMany({
    where,
    orderBy,
    take: filter.limit ?? 1000,
  });
  return rows.map(mapService);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const s = await db.service.findUnique({ where: { slug } });
  return s ? mapService(s) : null;
}
export async function getServiceById(id: string): Promise<Service | null> {
  const s = await db.service.findUnique({ where: { id } });
  return s ? mapService(s) : null;
}

export async function listCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapCategory);
}

export async function listSubcategories(categoryId?: string): Promise<Subcategory[]> {
  const rows = await db.subcategory.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: { name: "asc" },
  });
  return rows.map(mapSubcategory);
}

// ---------- people reads ----------

export async function listUsers(): Promise<User[]> {
  const rows = await db.user.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapUser);
}
export async function getUserById(id: string): Promise<User | null> {
  const u = await db.user.findUnique({ where: { id } });
  return u ? mapUser(u) : null;
}

export async function listAdmins(): Promise<AdminUser[]> {
  const rows = await db.adminUser.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapAdmin);
}

export async function listRoles(): Promise<Role[]> {
  const rows = await db.role.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapRole);
}

// ---------- transaction reads ----------

export async function listInquiries(filter: {
  type?: string;
  status?: string;
} = {}): Promise<Inquiry[]> {
  const where: Record<string, unknown> = {};
  if (filter.type) where.type = filter.type;
  if (filter.status) where.status = filter.status;
  const rows = await db.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapInquiry);
}

export async function listAllRequests(): Promise<MarketRequest[]> {
  const rows = await db.marketRequest.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapRequest);
}

export async function listBuyerRequests(buyerId: string): Promise<MarketRequest[]> {
  const rows = await db.marketRequest.findMany({
    where: { buyerId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapRequest);
}

export async function getRequestById(id: string): Promise<MarketRequest | null> {
  const r = await db.marketRequest.findUnique({ where: { id } });
  return r ? mapRequest(r) : null;
}

export async function listAllOrders(): Promise<MarketOrder[]> {
  const rows = await db.marketOrder.findMany({ orderBy: { placedAt: "desc" } });
  return rows.map(mapOrder);
}

export async function listBuyerOrders(buyerId: string): Promise<MarketOrder[]> {
  const rows = await db.marketOrder.findMany({
    where: { buyerId },
    orderBy: { placedAt: "desc" },
  });
  return rows.map(mapOrder);
}

export async function getOrderById(id: string): Promise<MarketOrder | null> {
  const o = await db.marketOrder.findUnique({ where: { id } });
  return o ? mapOrder(o) : null;
}

export async function listBuyerThreads(buyerId: string): Promise<MarketThread[]> {
  const rows = await db.marketThread.findMany({
    where: { buyerId },
    orderBy: { lastMessageAt: "desc" },
    include: { messages: { orderBy: { sentAt: "asc" } } },
  });
  return rows.map(mapThread);
}

export async function getBuyerWishlist(buyerId: string): Promise<Service[]> {
  const items = await db.wishlist.findMany({ where: { userId: buyerId } });
  const slugs = items.map((w) => w.serviceSlug);
  if (slugs.length === 0) return [];
  const services = await db.service.findMany({ where: { slug: { in: slugs } } });
  return services.map(mapService);
}

// ---------- system reads ----------

export async function listNotifications(): Promise<AppNotification[]> {
  const rows = await db.notification.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(mapNotification);
}
export async function listActivity(limit = 300): Promise<ActivityLog[]> {
  const rows = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapActivity);
}

// ---------- content reads ----------

export async function listIndustries(): Promise<Industry[]> {
  const rows = await db.industry.findMany({ orderBy: { name: "asc" } });
  return rows as unknown as Industry[];
}
export async function listInsights(): Promise<Insight[]> {
  const rows = await db.insight.findMany({ orderBy: { publishedAt: "desc" } });
  return rows as unknown as Insight[];
}
export async function listResources(): Promise<Resource[]> {
  const rows = await db.resource.findMany({ orderBy: { publishedAt: "desc" } });
  return rows as unknown as Resource[];
}
export async function listFaqs(): Promise<FaqItem[]> {
  const rows = await db.faqItem.findMany({ orderBy: { order: "asc" } });
  return rows as unknown as FaqItem[];
}

// ---------- settings ----------

export async function getSetting<T>(key: string): Promise<T | null> {
  const row = await db.setting.findUnique({ where: { id: key } });
  if (!row) return null;
  return row.value as T;
}

// ---------- dashboard aggregates ----------

export async function getAdminOverview() {
  const [
    services,
    publishedCount,
    draftCount,
    requests,
    admins,
    users,
    newInquiries,
    pendingInquiries,
  ] = await Promise.all([
    db.service.count(),
    db.service.count({ where: { status: "published" } }),
    db.service.count({ where: { status: "draft" } }),
    db.marketRequest.count(),
    db.adminUser.count(),
    db.user.count(),
    db.inquiry.count({ where: { status: "new" } }),
    db.inquiry.count({ where: { status: "in_progress" } }),
  ]);
  return {
    totalServices: services,
    publishedServices: publishedCount,
    draftServices: draftCount,
    serviceRequests: requests,
    admins,
    users,
    newInquiries,
    pendingInquiries,
  };
}

export async function getBuyerOverview(buyerId: string) {
  const [orders, requests, wishlist] = await Promise.all([
    db.marketOrder.count({ where: { buyerId } }),
    db.marketRequest.count({ where: { buyerId } }),
    db.wishlist.count({ where: { userId: buyerId } }),
  ]);
  const activeOrders = await db.marketOrder.count({
    where: { buyerId, status: { in: ["pending", "in_progress"] } },
  });
  const completedOrders = await db.marketOrder.count({
    where: { buyerId, status: "completed" },
  });
  const openRequests = await db.marketRequest.count({
    where: { buyerId, status: { in: ["open", "in_review", "in_progress"] } },
  });
  return {
    activeOrders,
    completedOrders,
    openRequests,
    savedServices: wishlist,
    totalOrders: orders,
    totalRequests: requests,
  };
}
