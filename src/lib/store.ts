"use client";

import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from "zustand/middleware";
import type {
  ActivityLog,
  AdminUser,
  AppNotification,
  Category,
  EntityStatus,
  HomepageContent,
  ID,
  Inquiry,
  InquiryStatus,
  MarketOrder,
  MarketOrderStatus,
  MarketRequest,
  MarketRequestStatus,
  MarketThread,
  PermissionMatrix,
  RequestKind,
  Role,
  Service,
  ServiceStatus,
  Subcategory,
  User,
  UserStatus,
} from "@/types";
import {
  KIND_LABELS,
  REQUEST_KIND_DEFS,
  REQUEST_STATUS_LABELS,
  newRequestReference,
} from "@/lib/request-kinds";
import { CORE_SERVICES } from "@/data/services-core";
import { CATEGORIES, SUBCATEGORIES } from "@/data/categories";
import { ADMINS, ROLES, USERS } from "@/data/people";
import { ACTIVITY_LOGS, INQUIRIES, NOTIFICATIONS } from "@/data/content";
import {
  MARKET_ORDERS,
  MARKET_REQUESTS,
  MARKET_THREADS,
  MARKET_USERS,
  WISHLIST_SEED,
} from "@/data/marketplace-activity";

const nowISO = () => new Date().toISOString();

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export interface BrandSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  salesEmail: string;
  phone: string;
  address: string;
}

export interface MarketplaceSettings {
  status: "live" | "maintenance";
  defaultSort: string;
  autoApproveServices: boolean;
  featuredSlots: number;
  /** hero primary button — opens the quote lead flow */
  heroCtaPrimary: string;
  /** hero secondary button — opens the consultation lead flow */
  heroCtaSecondary: string;
  /** engagement-card primary button — opens the service-request flow */
  cardCtaPrimary: string;
  /** engagement-card secondary button — opens the contact lead flow */
  cardCtaSecondary: string;
  /** when on, every conversion CTA first captures the visitor as a registered buyer */
  requireLeadRegistration: boolean;
}

export interface SecuritySettings {
  sessionTimeout: string;
  passwordMinLength: number;
  requireSymbols: boolean;
  twoFactorEnabled: boolean;
  ipAllowlist: boolean;
}

interface AppState {
  // ---- auth (admin platform) ----
  currentAdminId: ID | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  quickLogin: (adminId: ID) => void;
  logout: () => void;

  // ---- auth (marketplace: buyer / member) ----
  currentUserId: ID | null;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    role: "buyer";
    registrationType?: "professional" | "company";
    company?: string;
    country?: string;
    phone?: string;
    phoneCountry?: string;
    accountType?: string;
    profession?: string;
    companySize?: string;
    intent?: string;
    intentTimeline?: string;
    registrationSource?: string;
  }) => { ok: boolean; error?: string; user?: User };
  marketLogin: (
    email: string,
    password: string
  ) => { ok: boolean; role?: "buyer" | "member"; error?: string };
  quickMarketLogin: (userId: ID) => { ok: boolean; role?: "buyer" | "member" };
  marketLogout: () => void;
  updateMarketProfile: (patch: Partial<Pick<User, "name" | "company" | "phone" | "country">>) => void;

  // ---- marketplace entities ----
  orders: MarketOrder[];
  requests: MarketRequest[];
  threads: MarketThread[];
  wishlist: string[];
  toggleWishlist: (serviceSlug: string) => void;
  updateMarketOrderStatus: (orderId: ID, status: MarketOrderStatus) => void;
  addMarketRequest: (input: {
    categoryId: ID;
    categoryName: string;
    title: string;
    details: string;
    budgetRange: string;
    timeline: string;
    kind?: RequestKind;
    meta?: Record<string, string>;
  }) => MarketRequest;
  updateMarketRequestStatus: (requestId: ID, status: MarketRequestStatus, note?: string) => void;
  /** Converts an reviewed/active request into a marketplace order (admin action). */
  convertRequestToOrder: (
    requestId: ID,
    amount: number
  ) => { ok: boolean; order?: MarketOrder; error?: string };
  sendMarketMessage: (threadId: ID, body: string) => void;

  // ---- entities ----
  services: Service[];
  /**
   * False until the deferred division catalog (5 division chunks) has
   * been injected — or has definitively failed to load. Consumers that
   * hard-fail on a missing service (detail deep links) gate their
   * not-found UI on this flag instead of flashing an error.
   */
  catalogReady: boolean;
  categories: Category[];
  subcategories: Subcategory[];
  users: User[];
  admins: AdminUser[];
  roles: Role[];
  inquiries: Inquiry[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];

  // ---- settings ----
  homepage: HomepageContent;
  brand: BrandSettings;
  marketplaceSettings: MarketplaceSettings;
  security: SecuritySettings;

  // ---- services ----
  /** Injects the lazily-loaded generated catalog fill (see ensureFullCatalog). */
  injectAutoServices: (list: Service[]) => void;
  addService: (s: Partial<Service>) => Service;
  updateService: (id: ID, patch: Partial<Service>) => void;
  deleteService: (id: ID) => void;
  duplicateService: (id: ID) => Service | undefined;
  setServiceStatus: (id: ID, status: ServiceStatus) => void;
  toggleServiceFeatured: (id: ID) => void;

  // ---- categories ----
  addCategory: (c: Partial<Category>) => Category;
  updateCategory: (id: ID, patch: Partial<Category>) => void;
  deleteCategory: (id: ID) => void;

  addSubcategory: (s: Partial<Subcategory>) => Subcategory;
  updateSubcategory: (id: ID, patch: Partial<Subcategory>) => void;
  deleteSubcategory: (id: ID) => void;

  // ---- users ----
  addUser: (u: Partial<User>) => User;
  updateUser: (id: ID, patch: Partial<User>) => void;
  deleteUser: (id: ID) => void;
  setUserStatus: (id: ID, status: UserStatus) => void;

  // ---- admins ----
  addAdmin: (a: Partial<AdminUser>) => AdminUser;
  updateAdmin: (id: ID, patch: Partial<AdminUser>) => void;
  deleteAdmin: (id: ID) => void;
  setAdminStatus: (id: ID, status: EntityStatus | UserStatus) => void;

  // ---- roles ----
  addRole: (r: Partial<Role>) => Role;
  updateRole: (id: ID, patch: Partial<Role>) => void;
  updateRolePermissions: (id: ID, permissions: PermissionMatrix) => void;
  deleteRole: (id: ID) => void;
  cloneRole: (id: ID) => Role | undefined;

  // ---- inquiries ----
  addInquiry: (i: Partial<Inquiry>) => Inquiry;
  updateInquiryStatus: (id: ID, status: InquiryStatus) => void;
  deleteInquiry: (id: ID) => void;

  // ---- notifications ----
  markNotificationRead: (id: ID) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: ID) => void;

  // ---- settings ----
  updateHomepage: (patch: Partial<HomepageContent>) => void;
  updateBrand: (patch: Partial<BrandSettings>) => void;
  updateMarketplaceSettings: (patch: Partial<MarketplaceSettings>) => void;
  updateSecurity: (patch: Partial<SecuritySettings>) => void;

  // ---- misc ----
  logActivity: (action: string, module: string, target: string, description?: string) => void;
  resetDemoData: () => void;
}

const seed = () => ({
  services: CORE_SERVICES,
  categories: CATEGORIES,
  subcategories: SUBCATEGORIES,
  users: [...USERS, ...MARKET_USERS],
  admins: ADMINS,
  roles: ROLES,
  inquiries: INQUIRIES,
  notifications: NOTIFICATIONS,
  activityLogs: ACTIVITY_LOGS,
  orders: MARKET_ORDERS,
  requests: MARKET_REQUESTS,
  threads: MARKET_THREADS,
  wishlist: WISHLIST_SEED,
});

// ============================================================
// DEFENSIVE SEED-UNION MERGE — every id-keyed collection is
// merged seed-first with per-field persisted overrides. Demo
// accounts are always present; persisted extras (sign-ups,
// admin-created entities) survive; missing seed fields are
// restored. Guards against stale/partial localStorage blobs.
// ============================================================

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const mergeEntity = <T extends { id: ID }>(seedItem: T, persistedItem: unknown): T => {
  if (!isPlainObject(persistedItem)) return seedItem;
  const out = { ...seedItem } as Record<string, unknown>;
  for (const [key, value] of Object.entries(persistedItem)) {
    if (value !== undefined) out[key] = value;
  }
  return out as T;
};

const unionById = <T extends { id: ID }>(seedArr: T[], persistedArr: unknown): T[] => {
  if (!Array.isArray(persistedArr)) return seedArr;
  const byId = new Map<ID, T>();
  for (const item of seedArr) byId.set(item.id, item);
  for (const item of persistedArr as T[]) {
    if (!item || typeof item !== "object" || !item.id) continue;
    byId.set(item.id, mergeEntity(byId.get(item.id) ?? item, item));
  }
  return [...byId.values()];
};

/**
 * SEED-AUTHORITATIVE union for the catalog collections (services,
 * categories, subcategories). These are pure-frontend mock data whose
 * cross-references (categoryId / subcategoryId / status / slug) must
 * always match the current seed — a stale persisted copy overriding a
 * single field (e.g. an old subcategoryId) silently breaks every
 * catalog-driven view (header flyouts, division pages, counts).
 * Seed entries therefore keep ALL seed fields; persisted extras
 * (admin-created items) still union in so demo CRUD survives reloads.
 */
const unionByIdSeedWins = <T extends { id: ID }>(seedArr: T[], persistedArr: unknown): T[] => {
  if (!Array.isArray(persistedArr)) return seedArr;
  const seedIds = new Set(seedArr.map((s) => s.id));
  const extras: T[] = [];
  for (const item of persistedArr as T[]) {
    if (!item || typeof item !== "object" || !item.id) continue;
    if (!seedIds.has(item.id)) extras.push(item);
  }
  return [...seedArr, ...extras];
};

// Catalog collections that must never be field-overridden by persisted state.
// "admins" and "roles" are included so seeded platform admins / role
// definitions always win per-field over stale persisted copies, while
// admin-created extras still union in via unionByIdSeedWins.
const SEED_AUTHORITATIVE_KEYS = new Set<string>(["services", "categories", "subcategories", "admins", "roles"]);

// Runtime-extras persistence — seed-authoritative catalogs are re-applied
// wholesale on every load (unionByIdSeedWins), so writing them to
// localStorage only burns quota: the services array alone is ~1.6 MB and
// pushed the persisted blob past browsers' storage limits.
// Persist ONLY items created at runtime; seeds come back from code.
const SEED_ID_SETS: Record<string, Set<string>> = {
  // Starts with the statically-bundled core catalog only; the generated
  // fill's ids are registered inside injectAutoServices BEFORE its entries
  // reach state, so the persist filter below can never write them into
  // localStorage (the original ~1.6 MB quota-blowout regression guard).
  services: new Set(CORE_SERVICES.map((s) => String(s.id))),
  categories: new Set(CATEGORIES.map((c) => String(c.id))),
  subcategories: new Set(SUBCATEGORIES.map((c) => String(c.id))),
};

// Persisted-storage key for the current build. Kept as a named constant so
// the self-healing hydration pipeline (quarantine / purge) can reference it
// without duplicating the literal.
export const PERSIST_STORAGE_KEY = "stioos-global-v21";

/**
 * Last-resort recovery for a poisoned persistence layer: drop every
 * persisted demo blob (current and legacy naming) plus the in-memory
 * overlay, so the next rehydrate starts from clean seed data. Used by
 * StoreHydration when repeated rehydrate attempts still fail.
 */
export function purgePersistedDemoState(): void {
  storageOverlay.clear();
  try {
    const doomed: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key && (key.startsWith("stioos-") || key.startsWith("jobsonn-"))) {
        doomed.push(key);
      }
    }
    for (const key of doomed) window.localStorage.removeItem(key);
  } catch {
    // storage unavailable — clearing the overlay is all we can do
  }
}

/**
 * Quota-safe localStorage wrapper. Browsers cap localStorage (~5 MB per
 * origin, sometimes less) and every persist write serializes the full
 * state — without this guard a QuotaExceededError crashes the exact
 * interaction that grew the state (e.g. signing in). On failure the
 * newest value is kept in an in-memory overlay so the session keeps
 * working (it just won't survive a reload), and a single console warning
 * is emitted instead of an uncaught exception.
 */
const storageOverlay = new Map<string, string>();
let storageWarned = false;
/**
 * Pathological-payload threshold (characters). The legitimate persisted
 * payload is ~35 KB (partializeImpl strips seed-authoritative catalogs),
 * while browsers budget ~2.6 M chars (5 MB UTF-16) per origin. Anything
 * near this threshold can only be a bug/regression blob that would fail
 * on every future setItem — see the self-heal guard in getItem below.
 */
const MAX_PERSISTED_CHARS = 1_200_000;

/**
 * Keys of persisted blobs written by superseded store versions
 * ("stioos-global-v1" … "stioos-global-v20", plus pre-rebrand naming).
 * Once the persist key is bumped the old blob is dead weight — nothing
 * ever reads it again — yet it keeps occupying the origin's storage
 * budget until the browser is fully reset.
 */
const LEGACY_PERSIST_KEY_RE = /^stioos-global-v\d+$|^jobsonn-/;

/**
 * Passive reclamation: drop blobs belonging to superseded persist
 * versions. Runs during hydration so a version bump can never leave
 * dead megabytes behind for the next session to trip over. Deliberately
 * conservative — touches only provably-dead keys, never the live one.
 */
function sweepLegacyPersistKeys(currentKey: string): void {
  try {
    const ls = window.localStorage;
    const doomed: string[] = [];
    for (let i = 0; i < ls.length; i += 1) {
      const key = ls.key(i);
      if (key && key !== currentKey && LEGACY_PERSIST_KEY_RE.test(key)) {
        doomed.push(key);
      }
    }
    for (const key of doomed) {
      try {
        ls.removeItem(key);
      } catch {
        // individual removal failure is harmless — the sweep is advisory
      }
    }
  } catch {
    // storage unavailable — nothing to sweep
  }
}

/**
 * Active reclamation under quota pressure: frees provably-dead legacy
 * blobs AND any single key whose payload alone exceeds the pathological
 * threshold (only reachable when the origin is already over budget).
 * Returns how many keys were removed. Called exclusively from the
 * setItem failure path, never proactively, so foreign storage is only
 * touched as a last-resort rescue.
 */
function reclaimQuota(currentKey: string): number {
  let freed = 0;
  try {
    const ls = window.localStorage;
    const doomed: string[] = [];
    for (let i = 0; i < ls.length; i += 1) {
      const key = ls.key(i);
      if (!key || key === currentKey) continue;
      const oversized = (ls.getItem(key)?.length ?? 0) > MAX_PERSISTED_CHARS;
      if (LEGACY_PERSIST_KEY_RE.test(key) || oversized) doomed.push(key);
    }
    for (const key of doomed) {
      try {
        ls.removeItem(key);
        freed += 1;
      } catch {
        // keep going — every freed byte raises the odds of the retry
      }
    }
  } catch {
    // storage unavailable — nothing to reclaim
  }
  return freed;
}

const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    if (storageOverlay.has(name)) return storageOverlay.get(name) ?? null;
    sweepLegacyPersistKeys(name);
    try {
      const value = window.localStorage.getItem(name);
      // Oversized-blob self-heal: a persist write that somehow exceeds the
      // storage budget would fail on EVERY future setItem, silently
      // degrading every subsequent session to in-memory-only state
      // ("changes reset on reload"). Discard the pathological blob once
      // so the store re-seeds and the next change writes a compact payload.
      if (value && value.length > MAX_PERSISTED_CHARS) {
        try {
          window.localStorage.removeItem(name);
        } catch {
          // storage unavailable — returning null still forces a re-seed
        }
        if (!storageWarned) {
          storageWarned = true;
          console.warn(
            "Oversized persisted state discarded — the store re-seeded to stay within the browser storage quota."
          );
        }
        return null;
      }
      return value;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    storageOverlay.set(name, value);
    try {
      window.localStorage.setItem(name, value);
    } catch {
      // Quota rescue: free provably-dead storage (superseded persist
      // blobs, pathological oversized keys) and retry once before
      // degrading the session to in-memory-only persistence.
      const reclaimed = reclaimQuota(name);
      if (reclaimed > 0) {
        try {
          window.localStorage.setItem(name, value);
          return;
        } catch {
          // still over budget — fall through to the session-only warning
        }
      }
      if (!storageWarned) {
        storageWarned = true;
        console.warn(
          "Browser storage quota exceeded — changes persist for this session only and will reset on reload."
        );
      }
    }
  },
  removeItem: (name) => {
    storageOverlay.delete(name);
    try {
      window.localStorage.removeItem(name);
    } catch {
      // storage unavailable — nothing else to do
    }
  },
};

const asStringArray = (seedArr: string[], persisted: unknown): string[] =>
  Array.isArray(persisted) && persisted.every((s) => typeof s === "string")
    ? (persisted as string[])
    : seedArr;

/** Module-level guard: the deferred catalog chunk loads at most once. */
let catalogLoadStarted = false;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentAdminId: null,
      currentUserId: null,
      catalogReady: false,
      ...seed(),
      homepage: {
        heroBadge: "AI · Technology · Business Intelligence · Enterprise Solutions",
        heroTitleTop: "INTELLIGENCE THAT BUILDS",
        heroTitleBottom: "WHAT'S NEXT.",
        heroSubtitle:
          "STIOOS GLOBAL brings together AI, technology, programming, automation, data intelligence, and business solutions in one intelligent marketplace.",
        primaryCta: "Explore Marketplace",
        secondaryCta: "Explore Solutions",
        stats: [
          { value: "305", label: "Expert Services" },
          { value: "7", label: "Solution Divisions" },
          { value: "40+", label: "Technologies" },
          { value: "24/7", label: "Expert Support" },
        ],
        finalCtaTitle: "READY TO BUILD WITH INTELLIGENCE?",
        finalCtaSubtitle:
          "Join forward-thinking organizations using STIOOS GLOBAL to automate, scale, and lead their markets.",
      },
      brand: {
        siteName: "STIOOS GLOBAL",
        tagline: "Intelligence that builds what's next.",
        supportEmail: "support@stioos.com",
        salesEmail: "hello@stioos.com",
        phone: "+1 (555) 010-9600",
        address: "Level 32, Integrity Towers, Global Business District",
      },
      marketplaceSettings: {
        status: "live",
        defaultSort: "relevance",
        autoApproveServices: false,
        featuredSlots: 8,
        heroCtaPrimary: "Get a Quote",
        heroCtaSecondary: "Schedule Consultation",
        cardCtaPrimary: "Request Service",
        cardCtaSecondary: "Contact an Expert",
        requireLeadRegistration: true,
      },
      security: {
        sessionTimeout: "60 minutes",
        passwordMinLength: 10,
        requireSymbols: true,
        twoFactorEnabled: false,
        ipAllowlist: false,
      },

      // ================= AUTH =================
      login: (email, password) => {
        const admin = get().admins.find(
          (a) => a.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (!admin) return { ok: false, error: "No admin account found with this email." };
        if (password !== "demo1234") return { ok: false, error: "Incorrect password. Use demo1234 for demo accounts." };
        if (admin.status !== "active") return { ok: false, error: "This account is inactive. Contact a Super Admin." };
        // Single active session — signing in as platform staff ends any
        // marketplace buyer session so the two workspaces never fight over
        // the dispatcher (root cause of "super admin login dumps me into the
        // buyer dashboard" reports).
        set({ currentAdminId: admin.id, currentUserId: null });
        get().logActivity("signed in", "Authentication", admin.name, `${admin.name} signed in to the admin platform.`);
        return { ok: true };
      },
      quickLogin: (adminId) => {
        const admin = get().admins.find((a) => a.id === adminId);
        if (!admin) return;
        set({ currentAdminId: admin.id, currentUserId: null });
        get().logActivity("signed in", "Authentication", admin.name, `${admin.name} signed in via demo quick access.`);
      },
      logout: () => set({ currentAdminId: null }),

      // ================= MARKETPLACE AUTH =================
      signUp: ({ name, email, password, role, registrationType, company, country, phone, phoneCountry, accountType, profession, companySize, intent, intentTimeline, registrationSource }) => {
        const cleanEmail = email.trim().toLowerCase();
        if (!name.trim() || !cleanEmail || !password) {
          return { ok: false, error: "Name, email and password are required." };
        }
        if (password.length < 8) {
          return { ok: false, error: "Password must be at least 8 characters." };
        }
        const emailTaken =
          get().users.some((u) => u.email.toLowerCase() === cleanEmail) ||
          get().admins.some((a) => a.email.toLowerCase() === cleanEmail);
        if (emailTaken) {
          return { ok: false, error: "An account with this email already exists. Sign in instead." };
        }
        const user: User = {
          id: uid("usr-mkt"),
          name: name.trim(),
          email: cleanEmail,
          company: company?.trim() ?? "",
          phone: phone?.trim() ?? "",
          country: country?.trim() ?? "",
          status: "active",
          role,
          inquiriesCount: 0,
          createdAt: nowISO(),
          lastActive: nowISO(),
          password,
          registrationType: registrationType || undefined,
          phoneCountry: phoneCountry?.trim() || undefined,
          accountType: accountType?.trim() || undefined,
          profession: profession?.trim() || undefined,
          companySize: companySize?.trim() || undefined,
          intent: intent?.trim() || undefined,
          intentTimeline: intentTimeline?.trim() || undefined,
          registrationSource: registrationSource?.trim() || undefined,
        };
        set((st) => ({ users: [user, ...st.users], currentUserId: user.id, currentAdminId: null }));
        get().logActivity("registered", "Marketplace", user.name, `${user.name} joined as a ${role}.`);
        return { ok: true, user };
      },
      marketLogin: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        // Platform admin accounts are authoritative — always resolve them
        // first so a stale marketplace duplicate can never block an admin
        // sign-in (defensive: signUp prevents such collisions, but older
        // persisted sessions may still carry them).
        const admin = get().admins.find((a) => a.email.toLowerCase() === cleanEmail);
        if (admin) {
          if (password !== "demo1234") {
            return { ok: false, error: "Incorrect password. Use demo1234 for demo accounts." };
          }
          if (admin.status !== "active") {
            return { ok: false, error: "This account is inactive. Contact a Super Admin." };
          }
          // Single active session — an admin sign-in replaces any buyer session.
          set({ currentAdminId: admin.id, currentUserId: null });
          get().logActivity("signed in", "Authentication", admin.name, `${admin.name} signed in to the admin platform.`);
          return { ok: true, role: "member" as const };
        }
        const user = get().users.find(
          (u) => u.email.toLowerCase() === cleanEmail && !!u.password
        );
        if (user) {
          if (user.password !== password) {
            return { ok: false, error: "Incorrect password. Use demo1234 for demo accounts." };
          }
          if (user.status !== "active") {
            return { ok: false, error: "This account is inactive. Contact support." };
          }
          // Single active session — a buyer sign-in replaces any admin session.
          set((st) => ({
            currentUserId: user.id,
            currentAdminId: null,
            users: st.users.map((u) => (u.id === user.id ? { ...u, lastActive: nowISO() } : u)),
          }));
          get().logActivity("signed in", "Marketplace", user.name, `${user.name} signed in to the marketplace.`);
          return { ok: true, role: user.role };
        }
        return { ok: false, error: "No account found with this email. Create one or use demo access." };
      },
      quickMarketLogin: (userId) => {
        const user = get().users.find((u) => u.id === userId && !!u.password);
        if (!user) return { ok: false };
        set({ currentUserId: user.id, currentAdminId: null });
        get().logActivity("signed in", "Marketplace", user.name, `${user.name} signed in via demo quick access.`);
        return { ok: true, role: user.role };
      },
      marketLogout: () => set({ currentUserId: null }),
      updateMarketProfile: (patch) => {
        const id = get().currentUserId;
        if (!id) return;
        set((st) => ({
          users: st.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        }));
        const usr = get().users.find((u) => u.id === id);
        if (usr) get().logActivity("updated", "Marketplace Profile", usr.name, `${usr.name} updated their profile.`);
      },

      // ================= MARKETPLACE ENTITIES =================
      toggleWishlist: (serviceSlug) => {
        const has = get().wishlist.includes(serviceSlug);
        set((st) => ({
          wishlist: has
            ? st.wishlist.filter((s) => s !== serviceSlug)
            : [serviceSlug, ...st.wishlist],
        }));
      },
      updateMarketOrderStatus: (orderId, status) => {
        set((st) => ({
          orders: st.orders.map((o) =>
            o.id === orderId ? { ...o, status, updatedAt: nowISO() } : o
          ),
        }));
        const ord = get().orders.find((o) => o.id === orderId);
        if (ord)
          get().logActivity(
            "updated",
            "Marketplace Order",
            ord.serviceName,
            `Order "${ord.serviceName}" (${ord.id}) marked ${status.replace("_", " ")} for ${ord.buyerName}.`
          );
      },
      addMarketRequest: ({ categoryId, categoryName, title, details, budgetRange, timeline, kind, meta }) => {
        const me = get().users.find((u) => u.id === get().currentUserId);
        const request: MarketRequest = {
          id: uid("mr"),
          buyerId: me?.id ?? "",
          buyerName: me?.name ?? "Guest",
          buyerCompany: me?.company ?? "",
          categoryId,
          categoryName,
          title: title.trim(),
          details: details.trim(),
          budgetRange,
          timeline,
          status: "open",
          createdAt: nowISO(),
          kind: kind ?? "service",
          reference: newRequestReference(),
          meta: meta && Object.keys(meta).length > 0 ? meta : undefined,
          statusHistory: [
            {
              status: "open",
              at: nowISO(),
              by: me?.name ?? "Guest",
              note: kind && kind !== "service" ? "Request submitted from Talent Services" : "Request submitted",
            },
          ],
          orderId: null,
        };
        set((st) => ({ requests: [request, ...st.requests] }));
        get().logActivity("created", "Marketplace Request", request.title, `New ${KIND_LABELS[request.kind ?? "service"]} request "${request.title}" (${request.reference}) from ${request.buyerName}.`);
        return request;
      },
      updateMarketRequestStatus: (requestId, status, note) => {
        const actor =
          get().admins.find((a) => a.id === get().currentAdminId)?.name ?? "STIOOS Team";
        set((st) => ({
          requests: st.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status,
                  statusHistory: [
                    ...(r.statusHistory ?? []),
                    { status, note: note?.trim() || undefined, at: nowISO(), by: actor },
                  ],
                }
              : r
          ),
        }));
        const req = get().requests.find((r) => r.id === requestId);
        if (req)
          get().logActivity("updated", "Marketplace Request", req.title, `Request "${req.title}" (${req.reference ?? req.id}) moved to ${REQUEST_STATUS_LABELS[status]}.`);
      },
      convertRequestToOrder: (requestId, amount) => {
        const req = get().requests.find((r) => r.id === requestId);
        if (!req) return { ok: false, error: "Request not found." };
        if (req.orderId) return { ok: false, error: "This request is already linked to an order." };
        if (!(amount > 0)) return { ok: false, error: "Enter a valid quoted amount for the order." };
        const admin = get().admins.find((a) => a.id === get().currentAdminId);
        const kind = req.kind ?? "service";
        const kindDef = REQUEST_KIND_DEFS[kind];
        const order: MarketOrder = {
          id: uid("mo"),
          serviceId: kind === "service" ? req.categoryId : `talent-${kind}`,
          serviceSlug: kind === "service" ? req.categoryId : kind,
          serviceName: req.title,
          serviceIcon: kindDef?.icon ?? "Inbox",
          buyerId: req.buyerId,
          buyerName: req.buyerName,
          buyerCompany: req.buyerCompany,
          amount,
          status: "pending",
          deliveryType: "project",
          placedAt: nowISO(),
          updatedAt: nowISO(),
          requirements: req.details,
        };
        set((st) => ({
          orders: [order, ...st.orders],
          requests: st.requests.map((r) =>
            r.id === requestId
              ? {
                  ...r,
                  status: "fulfilled" as const,
                  orderId: order.id,
                  quotedAmount: amount,
                  statusHistory: [
                    ...(r.statusHistory ?? []),
                    {
                      status: "fulfilled" as const,
                      at: nowISO(),
                      by: admin?.name ?? "STIOOS Team",
                      note: `Converted to order ${order.id} — quoted $${amount.toLocaleString()}`,
                    },
                  ],
                }
              : r
          ),
        }));
        get().logActivity("created", "Marketplace Order", order.serviceName, `Request "${req.title}" (${req.reference ?? req.id}) converted into order ${order.id} for ${req.buyerName}.`);
        return { ok: true, order };
      },
      sendMarketMessage: (threadId, body) => {
        const me = get().users.find((u) => u.id === get().currentUserId);
        if (!me || !body.trim()) return;
        const thread = get().threads.find((t) => t.id === threadId);
        if (!thread) return;
        const senderRole: "buyer" | "team" = thread.buyerId === me.id ? "buyer" : "team";
        const message = {
          id: uid("mm"),
          threadId,
          senderId: me.id,
          senderName: me.name,
          senderRole,
          body: body.trim(),
          sentAt: nowISO(),
        };
        set((st) => ({
          threads: st.threads.map((t) =>
            t.id === threadId
              ? { ...t, messages: [...t.messages, message], lastMessageAt: message.sentAt }
              : t
          ),
        }));
      },

      // ================= DEFERRED CATALOG =================
      /**
       * Injects the generated catalog fill loaded via ensureFullCatalog().
       * Seed-id registration happens BEFORE the state update so the persist
       * filter never serializes generated entries into localStorage.
       * Idempotent — duplicate ids are skipped.
       */
      injectAutoServices: (list) => {
        if (!Array.isArray(list) || list.length === 0) {
          set({ catalogReady: true });
          return;
        }
        const existing = new Set(get().services.map((s) => String(s.id)));
        const additions = list.filter(
          (s) =>
            !!s &&
            typeof s === "object" &&
            typeof (s as { id?: unknown }).id === "string" &&
            !existing.has(String((s as { id: string }).id))
        );
        for (const item of additions) SEED_ID_SETS.services.add(String(item.id));
        set((state) => ({
          services: additions.length > 0 ? [...state.services, ...additions] : state.services,
          catalogReady: true,
        }));
      },

      // ================= SERVICES =================
      addService: (s) => {
        const service: Service = {
          id: uid("srv"),
          name: s.name ?? "Untitled Service",
          slug:
            s.slug ||
            (s.name ?? "service")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          categoryId: s.categoryId ?? "",
          subcategoryId: s.subcategoryId ?? "",
          shortDescription: s.shortDescription ?? "",
          fullDescription: s.fullDescription ?? s.shortDescription ?? "",
          tags: s.tags ?? [],
          industries: s.industries ?? [],
          deliveryType: s.deliveryType ?? "project",
          timeline: s.timeline ?? "4–8 weeks",
          rating: s.rating ?? 5,
          reviews: s.reviews ?? 0,
          popularity: s.popularity ?? 0,
          featured: s.featured ?? false,
          status: s.status ?? "draft",
          accent: s.accent ?? "from-blue-600 to-cyan-500",
          icon: s.icon ?? "Sparkles",
          problemsSolved: s.problemsSolved ?? [],
          capabilities: s.capabilities ?? [],
          deliverables: s.deliverables ?? [],
          process: s.process ?? [],
          technologies: s.technologies ?? [],
          faqs: s.faqs ?? [],
          metaTitle: s.metaTitle,
          metaDescription: s.metaDescription,
          createdAt: nowISO(),
          updatedAt: nowISO(),
          createdBy: s.createdBy ?? "You",
        };
        set((st) => ({ services: [service, ...st.services] }));
        get().logActivity("created", "Service Management", service.name, `New service "${service.name}" created.`);
        return service;
      },
      updateService: (id, patch) => {
        set((st) => ({
          services: st.services.map((s) =>
            s.id === id ? { ...s, ...patch, updatedAt: nowISO() } : s
          ),
        }));
        const svc = get().services.find((s) => s.id === id);
        if (svc) get().logActivity("updated", "Service Management", svc.name, `Service "${svc.name}" updated.`);
      },
      deleteService: (id) => {
        const svc = get().services.find((s) => s.id === id);
        set((st) => ({ services: st.services.filter((s) => s.id !== id) }));
        if (svc) get().logActivity("deleted", "Service Management", svc.name, `Service "${svc.name}" permanently deleted.`);
      },
      duplicateService: (id) => {
        const orig = get().services.find((s) => s.id === id);
        if (!orig) return undefined;
        const copy: Service = {
          ...orig,
          id: uid("srv"),
          name: `${orig.name} (Copy)`,
          slug: `${orig.slug}-copy-${Math.random().toString(36).slice(2, 5)}`,
          status: "draft",
          featured: false,
          rating: 0,
          reviews: 0,
          popularity: 0,
          createdAt: nowISO(),
          updatedAt: nowISO(),
          createdBy: "You",
        };
        set((st) => ({ services: [copy, ...st.services] }));
        get().logActivity("duplicated", "Service Management", copy.name, `Duplicated from "${orig.name}" as draft.`);
        return copy;
      },
      setServiceStatus: (id, status) => {
        const verb = status === "published" ? "published" : status === "archived" ? "archived" : "unpublished";
        set((st) => ({
          services: st.services.map((s) =>
            s.id === id ? { ...s, status, updatedAt: nowISO() } : s
          ),
        }));
        const svc = get().services.find((s) => s.id === id);
        if (svc) get().logActivity(verb, "Service Management", svc.name, `Service "${svc.name}" ${verb}.`);
      },
      toggleServiceFeatured: (id) => {
        set((st) => ({
          services: st.services.map((s) =>
            s.id === id ? { ...s, featured: !s.featured, updatedAt: nowISO() } : s
          ),
        }));
        const svc = get().services.find((s) => s.id === id);
        if (svc)
          get().logActivity(svc.featured ? "featured" : "unfeatured", "Marketplace", svc.name, `"${svc.name}" featured flag updated.`);
      },

      // ================= CATEGORIES =================
      addCategory: (c) => {
        const category: Category = {
          id: uid("cat"),
          name: c.name ?? "New Category",
          slug: c.slug || (c.name ?? "category").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          icon: c.icon ?? "Layers",
          tagline: c.tagline ?? "",
          description: c.description ?? "",
          status: c.status ?? "active",
          featured: c.featured ?? false,
          createdAt: nowISO(),
        };
        set((st) => ({ categories: [...st.categories, category] }));
        get().logActivity("created", "Category Management", category.name, `Category "${category.name}" created.`);
        return category;
      },
      updateCategory: (id, patch) => {
        set((st) => ({ categories: st.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
        const cat = get().categories.find((c) => c.id === id);
        if (cat) get().logActivity("updated", "Category Management", cat.name, `Category "${cat.name}" updated.`);
      },
      deleteCategory: (id) => {
        const cat = get().categories.find((c) => c.id === id);
        set((st) => ({
          categories: st.categories.filter((c) => c.id !== id),
          subcategories: st.subcategories.filter((s) => s.categoryId !== id),
        }));
        if (cat) get().logActivity("deleted", "Category Management", cat.name, `Category "${cat.name}" and its subcategories deleted.`);
      },
      addSubcategory: (s) => {
        const sub: Subcategory = {
          id: uid("sub"),
          name: s.name ?? "New Subcategory",
          slug: s.slug || (s.name ?? "subcategory").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          categoryId: s.categoryId ?? "",
          description: s.description ?? "",
          status: s.status ?? "active",
          createdAt: nowISO(),
        };
        set((st) => ({ subcategories: [...st.subcategories, sub] }));
        get().logActivity("created", "Subcategory Management", sub.name, `Subcategory "${sub.name}" created.`);
        return sub;
      },
      updateSubcategory: (id, patch) => {
        set((st) => ({ subcategories: st.subcategories.map((s) => (s.id === id ? { ...s, ...patch } : s)) }));
        const sub = get().subcategories.find((s) => s.id === id);
        if (sub) get().logActivity("updated", "Subcategory Management", sub.name, `Subcategory "${sub.name}" updated.`);
      },
      deleteSubcategory: (id) => {
        const sub = get().subcategories.find((s) => s.id === id);
        set((st) => ({ subcategories: st.subcategories.filter((s) => s.id !== id) }));
        if (sub) get().logActivity("deleted", "Subcategory Management", sub.name, `Subcategory "${sub.name}" deleted.`);
      },

      // ================= USERS =================
      addUser: (u) => {
        const user: User = {
          id: uid("usr"),
          name: u.name ?? "New User",
          email: u.email ?? "",
          company: u.company ?? "",
          phone: u.phone ?? "",
          country: u.country ?? "",
          status: u.status ?? "active",
          role: u.role ?? "buyer",
          inquiriesCount: u.inquiriesCount ?? 0,
          createdAt: nowISO(),
          lastActive: nowISO(),
        };
        set((st) => ({ users: [user, ...st.users] }));
        get().logActivity("created", "User Management", user.name, `User "${user.name}" created.`);
        return user;
      },
      updateUser: (id, patch) => {
        set((st) => ({ users: st.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
        const usr = get().users.find((u) => u.id === id);
        if (usr) get().logActivity("updated", "User Management", usr.name, `User "${usr.name}" updated.`);
      },
      deleteUser: (id) => {
        const usr = get().users.find((u) => u.id === id);
        set((st) => ({ users: st.users.filter((u) => u.id !== id) }));
        if (usr) get().logActivity("deleted", "User Management", usr.name, `User "${usr.name}" deleted.`);
      },
      setUserStatus: (id, status) => {
        set((st) => ({ users: st.users.map((u) => (u.id === id ? { ...u, status } : u)) }));
        const usr = get().users.find((u) => u.id === id);
        if (usr) get().logActivity(status, "User Management", usr.name, `User "${usr.name}" set to ${status}.`);
      },

      // ================= ADMINS =================
      addAdmin: (a) => {
        const admin: AdminUser = {
          id: uid("adm"),
          name: a.name ?? "New Admin",
          email: a.email ?? "",
          phone: a.phone ?? "",
          roleId: a.roleId ?? "role-admin",
          status: a.status ?? "active",
          title: a.title ?? "",
          lastActive: nowISO(),
          createdAt: nowISO(),
        };
        set((st) => ({ admins: [admin, ...st.admins] }));
        const role = get().roles.find((r) => r.id === admin.roleId);
        get().logActivity("created", "Admin Management", admin.name, `Admin "${admin.name}" created with role ${role?.name ?? "Unknown"}.`);
        set((st) => ({
          notifications: [
            {
              id: uid("ntf"),
              type: "admin_created",
              title: "Admin account created",
              message: `${admin.name} was added as ${role?.name ?? "an admin"}.`,
              read: false,
              createdAt: nowISO(),
            },
            ...st.notifications.slice(0, 99),
          ],
        }));
        return admin;
      },
      updateAdmin: (id, patch) => {
        set((st) => ({ admins: st.admins.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
        const adm = get().admins.find((a) => a.id === id);
        if (adm) get().logActivity("updated", "Admin Management", adm.name, `Admin "${adm.name}" updated.`);
      },
      deleteAdmin: (id) => {
        const adm = get().admins.find((a) => a.id === id);
        set((st) => ({ admins: st.admins.filter((a) => a.id !== id) }));
        if (adm) get().logActivity("deleted", "Admin Management", adm.name, `Admin "${adm.name}" deleted.`);
      },
      setAdminStatus: (id, status) => {
        const mapped: UserStatus = status === "disabled" ? "inactive" : (status as UserStatus);
        set((st) => ({ admins: st.admins.map((a) => (a.id === id ? { ...a, status: mapped } : a)) }));
        const adm = get().admins.find((a) => a.id === id);
        if (adm)
          get().logActivity(mapped === "active" ? "activated" : "deactivated", "Admin Management", adm.name, `Admin "${adm.name}" ${mapped === "active" ? "activated" : "deactivated"}.`);
      },

      // ================= ROLES =================
      addRole: (r) => {
        const role: Role = {
          id: uid("role"),
          name: r.name ?? "New Role",
          slug: r.slug || (r.name ?? "role").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: r.description ?? "",
          permissions: r.permissions ?? (Object.fromEntries(
            ("dashboard marketplace services categories subcategories featured orders homepage pages industries insights resources faqs users admins roles permissions inquiries notifications activity settings branding navigation".split(" ") as (keyof PermissionMatrix)[]).map((m) => [m, []])
          ) as unknown as PermissionMatrix),
          isSystem: false,
          createdAt: nowISO(),
        };
        set((st) => ({ roles: [...st.roles, role] }));
        get().logActivity("created", "Roles & Permissions", role.name, `Role "${role.name}" created.`);
        return role;
      },
      updateRole: (id, patch) => {
        set((st) => ({ roles: st.roles.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
        const role = get().roles.find((r) => r.id === id);
        if (role) get().logActivity("updated", "Roles & Permissions", role.name, `Role "${role.name}" updated.`);
      },
      updateRolePermissions: (id, permissions) => {
        set((st) => ({ roles: st.roles.map((r) => (r.id === id ? { ...r, permissions } : r)) }));
        const role = get().roles.find((r) => r.id === id);
        if (role) get().logActivity("updated", "Roles & Permissions", role.name, `Permission matrix for "${role.name}" updated.`);
      },
      deleteRole: (id) => {
        const role = get().roles.find((r) => r.id === id);
        set((st) => ({ roles: st.roles.filter((r) => r.id !== id) }));
        if (role) get().logActivity("deleted", "Roles & Permissions", role.name, `Role "${role.name}" deleted.`);
      },
      cloneRole: (id) => {
        const orig = get().roles.find((r) => r.id === id);
        if (!orig) return undefined;
        const copy: Role = {
          ...orig,
          id: uid("role"),
          name: `${orig.name} Copy`,
          slug: `${orig.slug}-copy`,
          isSystem: false,
          createdAt: nowISO(),
        };
        set((st) => ({ roles: [...st.roles, copy] }));
        get().logActivity("cloned", "Roles & Permissions", copy.name, `Role cloned from "${orig.name}".`);
        return copy;
      },

      // ================= INQUIRIES =================
      addInquiry: (i) => {
        const inquiry: Inquiry = {
          id: uid("inq"),
          name: i.name ?? "",
          email: i.email ?? "",
          company: i.company ?? "",
          phone: i.phone ?? "",
          type: i.type ?? "service_request",
          serviceId: i.serviceId,
          serviceName: i.serviceName,
          requirements: i.requirements ?? "",
          budgetRange: i.budgetRange ?? "",
          timeline: i.timeline ?? "",
          status: "new",
          createdAt: nowISO(),
        };
        set((st) => ({ inquiries: [inquiry, ...st.inquiries] }));
        set((st) => ({
          notifications: [
            {
              id: uid("ntf"),
              type: i.type === "contact" ? "contact_inquiry" : "service_request",
              title:
                i.type === "contact"
                  ? "New contact inquiry"
                  : i.type === "consultation"
                    ? "Consultation request"
                    : i.type === "quote"
                      ? "New quote request"
                      : "New service request",
              message: `${inquiry.name} (${inquiry.company || "Independent"})${inquiry.serviceName ? ` requested ${inquiry.serviceName}` : " submitted an inquiry"}.`,
              read: false,
              createdAt: nowISO(),
            },
            ...st.notifications.slice(0, 99),
          ],
        }));
        return inquiry;
      },
      updateInquiryStatus: (id, status) => {
        set((st) => ({ inquiries: st.inquiries.map((q) => (q.id === id ? { ...q, status } : q)) }));
        const inq = get().inquiries.find((q) => q.id === id);
        if (inq) get().logActivity("updated", "Inquiry Management", inq.id, `Inquiry from ${inq.name} set to ${status.replace("_", " ")}.`);
      },
      deleteInquiry: (id) => {
        set((st) => ({ inquiries: st.inquiries.filter((q) => q.id !== id) }));
      },

      // ================= NOTIFICATIONS =================
      markNotificationRead: (id) =>
        set((st) => ({
          notifications: st.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((st) => ({ notifications: st.notifications.map((n) => ({ ...n, read: true })) })),
      deleteNotification: (id) =>
        set((st) => ({ notifications: st.notifications.filter((n) => n.id !== id) })),

      // ================= SETTINGS =================
      updateHomepage: (patch) => {
        set((st) => ({ homepage: { ...st.homepage, ...patch } }));
        get().logActivity("updated", "Content Management", "Homepage", "Homepage content updated.");
      },
      updateBrand: (patch) => {
        set((st) => ({ brand: { ...st.brand, ...patch } }));
        get().logActivity("updated", "Settings", "Branding", "Brand settings updated.");
      },
      updateMarketplaceSettings: (patch) => {
        set((st) => ({ marketplaceSettings: { ...st.marketplaceSettings, ...patch } }));
        get().logActivity("updated", "Settings", "Marketplace", "Marketplace settings updated.");
      },
      updateSecurity: (patch) => {
        set((st) => ({ security: { ...st.security, ...patch } }));
        get().logActivity("updated", "Settings", "Security", "Security settings updated.");
      },

      // ================= MISC =================
      logActivity: (action, module, target, description) => {
        const admin = get().admins.find((a) => a.id === get().currentAdminId);
        const marketUser = get().users.find((u) => u.id === get().currentUserId);
        const actor = admin?.name ?? marketUser?.name ?? "System";
        const entry: ActivityLog = {
          id: uid("act"),
          actor,
          action,
          module,
          target,
          description: description ?? `${actor} ${action} ${target}.`,
          createdAt: nowISO(),
        };
        set((st) => ({ activityLogs: [entry, ...st.activityLogs].slice(0, 200) }));
      },
      resetDemoData: () => {
        // Re-arm the deferred catalog: reset restores CORE-only services, so
        // the generated fill must be re-injected (ensureFullCatalog re-loads
        // instantly — the chunk is already in the browser cache).
        catalogLoadStarted = false;
        set({
          ...seed(),
          catalogReady: false,
          currentAdminId: get().currentAdminId,
          currentUserId: get().currentUserId,
        });
        ensureFullCatalog();
      },
    }),
    {
      // v21 — catalog expanded to the 305-service architecture: the 6 spec
      // divisions (01–06) at AI 45 / Tech 45 / Cloud 45 / Marketing 45 /
      // Business 40 / Multimedia 40 (= 260) plus the retained Talent
      // Solutions division (45) = 305 across 7 divisions; "Cloud, DevOps &
      // MLOps" renamed to spec-exact "Cloud DevOps & MLOps" (slug unchanged).
      // Earlier bumps discarded stale blobs (old 624-service catalog,
      // retired divisions, pre-rebrand sessions, stale "230+ / 11 divisions"
      // homepage content).
      // Safe: seed data re-seeds on first load.
      name: PERSIST_STORAGE_KEY,
      storage: createJSONStorage(() => safeLocalStorage),
      skipHydration: true,
      // Self-healing hook — zustand's persist middleware SWALLOWS hydration
      // errors (corrupt/truncated JSON, any merge throw) and leaves
      // hasHydrated() === false forever, which strands every dashboard on an
      // infinite skeleton. On failure: quarantine the poisoned blob so the
      // retry in StoreHydration starts clean instead of failing forever.
      onRehydrateStorage: () => (_state, error) => {
        if (!error) return;
        console.warn(
          "Stored demo state could not be read — resetting it to factory seed data.",
          error
        );
        storageOverlay.delete(PERSIST_STORAGE_KEY);
        try {
          window.localStorage.removeItem(PERSIST_STORAGE_KEY);
        } catch {
          // storage unavailable — overlay deletion is enough
        }
      },
      merge: (persisted, current) => {
        // Belt-and-braces: a throwing merge has the same frozen-skeleton
        // consequence as a corrupt blob (zustand swallows the error and
        // never marks the store hydrated). Fall back to fresh seed state.
        try {
          return mergePersistedState(persisted, current);
        } catch (error) {
          console.warn(
            "Persisted demo state was malformed — loading fresh seed data instead.",
            error
          );
          return current;
        }
      },
      partialize: partializeImpl,
    }
  )
);

/**
 * Deferred catalog loader. The seven curated division files (305 services
 * total; each hand-crafted for its division) load as async chunks right
 * after store hydration and are merged into state (see injectAutoServices).
 * The 7 core flagships in services-core.ts are statically bundled; their
 * ids dedup here. Safe to call repeatedly; failure keeps the core catalog
 * usable and still flips catalogReady so consumers can leave their
 * waiting state.
 */
export function ensureFullCatalog(): void {
  if (catalogLoadStarted) return;
  catalogLoadStarted = true;
  Promise.all([
    import("@/data/services-agents"),
    import("@/data/services-tech"),
    import("@/data/services-marketing"),
    import("@/data/services-business"),
    import("@/data/services-multimedia"),
    import("@/data/services-cloud"),
    import("@/data/services-talent"),
  ])
    .then((
      [
        { AGENT_SERVICES },
        { TECH_SERVICES },
        { MARKETING_SERVICES },
        { BUSINESS_SERVICES },
        { MULTIMEDIA_SERVICES },
        { CLOUD_SERVICES },
        { TALENT_SERVICES },
      ]
    ) => {
      useAppStore
        .getState()
        .injectAutoServices([
          ...AGENT_SERVICES,
          ...TECH_SERVICES,
          ...MARKETING_SERVICES,
          ...BUSINESS_SERVICES,
          ...MULTIMEDIA_SERVICES,
          ...CLOUD_SERVICES,
          ...TALENT_SERVICES,
        ]);
    })
    .catch((error) => {
      console.warn(
        "Deferred catalog chunk failed to load — continuing with the core catalog.",
        error
      );
      // Reset the flag so a future call can retry — the first attempt
      // may fail due to a transient dev-server compilation error that
      // resolves on the next render cycle.
      catalogLoadStarted = false;
      useAppStore.setState({ catalogReady: true });
    });
}

/**
 * The real persisted/seed merge. Extracted from the persist options so the
 * wrapper above can guard it — a single unexpected TypeError here used to
 * freeze every dashboard on its loading skeleton permanently.
 */
function mergePersistedState(persisted: unknown, current: AppState): AppState {
  {
        const p = (isPlainObject(persisted) ? persisted : {}) as Record<string, unknown>;
        const merged = { ...current } as Record<string, unknown>;
        for (const key of Object.keys(current) as (keyof typeof current)[]) {
          const persistedValue = p[key];
          if (persistedValue === undefined) continue;
          const seedValue = current[key];
          if (Array.isArray(seedValue)) {
            // id-keyed entity collections → defensive union merge;
            // plain string arrays (wishlist) validated as a whole.
            if (SEED_AUTHORITATIVE_KEYS.has(key)) {
              // Catalog mock data — seed wins per-field (see unionByIdSeedWins).
              merged[key] = unionByIdSeedWins(
                seedValue as unknown as { id: ID }[],
                persistedValue
              ) as never;
            } else if (seedValue.length > 0 && isPlainObject(seedValue[0]) && "id" in (seedValue[0] as object)) {
              merged[key] = unionById(
                seedValue as unknown as { id: ID }[],
                persistedValue
              ) as never;
            } else if (key === "wishlist") {
              merged[key] = asStringArray(seedValue as string[], persistedValue) as never;
            } else {
              merged[key] = persistedValue as never;
            }
          } else if (!isPlainObject(seedValue)) {
            // primitives (sessions) restore as persisted
            merged[key] = persistedValue as never;
          } else {
            // settings objects → shallow per-field merge
            merged[key] = {
              ...(seedValue as Record<string, unknown>),
              ...(isPlainObject(persistedValue) ? persistedValue : {}),
            } as never;
          }
        }
        // Role sanitizer — this platform is buyer + platform-admin only.
        // Drop persisted marketplace duplicates that collide with admin
        // emails, and coerce any stale legacy role (e.g. "seller" from
        // earlier iterations) to "buyer" so ghost roles can never surface.
        const mergedUserList = merged.users as
          | (Record<string, unknown> & { id: ID })[]
          | undefined;
        if (Array.isArray(mergedUserList)) {
          const adminEmails = new Set(
            ((merged.admins as { email: string }[] | undefined) ?? []).map((a) =>
              String(a.email ?? "").toLowerCase()
            )
          );
          merged.users = mergedUserList
            .filter((u) => !adminEmails.has(String(u.email ?? "").toLowerCase()))
            .map((u) =>
              u.role && u.role !== "buyer" ? { ...u, role: "buyer" } : u
            ) as never;
        }
        // Demo-account lockout guard — a stale persisted copy of a seeded
        // demo user must never override the seed credential (e.g. a blob
        // from an earlier build that stored a different or missing demo
        // password), otherwise the advertised demo login stops working.
        const seedMarketUsers = MARKET_USERS as { id: ID; password?: string }[];
        if (Array.isArray(merged.users)) {
          merged.users = (merged.users as (Record<string, unknown> & { id: ID })[]).map(
            (u) => {
              const seedUser = seedMarketUsers.find((m) => m.id === u.id);
              return seedUser?.password ? { ...u, password: seedUser.password } : u;
            }
          ) as never;
        }
        // Request sanitizer — the tracking pipeline replaced the legacy
        // open/addressed/closed statuses; coerce persisted requests from
        // earlier iterations into the new flow and synthesize a timeline
        // entry so every request always has trackable history.
        const mergedRequestList = merged.requests as
          | (Record<string, unknown> & { id: ID })[]
          | undefined;
        if (Array.isArray(mergedRequestList)) {
          merged.requests = mergedRequestList.map((r) => {
            const legacyAddressed = r.status === "addressed";
            const status = legacyAddressed
              ? ("fulfilled" as MarketRequestStatus)
              : (r.status as MarketRequestStatus);
            const history = Array.isArray(r.statusHistory)
              ? r.statusHistory
              : [
                  {
                    status: legacyAddressed ? ("open" as MarketRequestStatus) : status,
                    at: String(r.createdAt ?? nowISO()),
                    by: String(r.buyerName ?? "Buyer"),
                    note: "Request submitted",
                  },
                ];
            return {
              ...r,
              status,
              statusHistory: history,
              kind: (r.kind as RequestKind) ?? "service",
            };
          }) as never;
        }
        // Admin roster enforcement — the platform runs buyer + super-admin
        // only; persisted staff accounts and roles from earlier iterations
        // are discarded so stale identities can never sign back in.
        merged.admins = ADMINS as never;
        merged.roles = ROLES as never;
        // Session hardening — a stale or corrupted persisted blob can point
        // sessions at identities that no longer exist in the merged data.
        // Drop any session reference that does not resolve, so visitors are
        // never treated as signed in as a ghost admin / user.
        const mergedAdmins = merged.admins as { id: ID }[] | undefined;
        if (
          typeof merged.currentAdminId === "string" &&
          merged.currentAdminId !== null &&
          !(mergedAdmins ?? []).some((a) => a.id === merged.currentAdminId)
        ) {
          merged.currentAdminId = null;
        }
        const mergedUsers = merged.users as { id: ID }[] | undefined;
        if (
          typeof merged.currentUserId === "string" &&
          merged.currentUserId !== null &&
          !(mergedUsers ?? []).some((u) => u.id === merged.currentUserId)
        ) {
          merged.currentUserId = null;
        }
        return merged as unknown as AppState;
  }
}

/**
 * Persist filter — keeps runtime-created items and drops seed-authoritative
 * catalogs (mergePersistedState re-applies them wholesale on every load).
 * Writing the full catalog used to blow the localStorage quota (~1.6 MB
 * blob), which is why only runtime extras are stored.
 */
function partializeImpl(state: AppState): AppState {
  const {
          login,
          quickLogin,
          logout,
          signUp,
          marketLogin,
          quickMarketLogin,
          marketLogout,
          updateMarketProfile,
          toggleWishlist,
          updateMarketOrderStatus,
          addMarketRequest,
          updateMarketRequestStatus,
          convertRequestToOrder,
          sendMarketMessage,
          ...rest
        } = state as unknown as Record<string, unknown>;
        const out = rest as unknown as Record<string, unknown>;
        // Seed-authoritative catalogs: persist runtime extras only.
        // Seeds re-apply on every load (unionByIdSeedWins); writing the
        // full catalog exceeded the localStorage quota (~1.6 MB blob).
        for (const key of ["services", "categories", "subcategories"]) {
          const list = out[key];
          if (Array.isArray(list)) {
            const seedIds = SEED_ID_SETS[key];
            out[key] = list.filter(
              (item) =>
                !!item &&
                typeof item === "object" &&
                typeof (item as { id?: unknown }).id === "string" &&
                !seedIds.has(String((item as { id: string }).id))
            );
          }
        }
        // Unbounded-growth insurance: runtime collections only ever grow
        // (every quote request, order, message and admin action appends).
        // Cap them to the most recent entries so a long-lived session can
        // never push the persisted blob past the storage quota.
        for (const [key, max] of [
          ["activityLogs", 300],
          ["notifications", 300],
          ["threads", 300],
          ["inquiries", 500],
          ["orders", 500],
          ["requests", 500],
        ] as const) {
          const list = out[key];
          if (Array.isArray(list) && list.length > max) out[key] = list.slice(-max);
        }
        // Admin roster / roles are force-reseeded by merge — never persist.
  delete out.admins;
  delete out.roles;
  // catalogReady is a runtime readiness flag, not session state: it must
  // stay false across reloads until the deferred catalog chunk re-arrives,
  // otherwise detail-page deep links flash "not found" during the gap.
  delete out.catalogReady;
  return out as unknown as AppState;
}

// ---------- derived helpers ----------

export const useCurrentAdmin = () =>
  useAppStore((s) => s.admins.find((a) => a.id === s.currentAdminId) ?? null);

export const useCurrentUser = () =>
  useAppStore((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);

export const useCurrentRole = () => {
  const admin = useCurrentAdmin();
  return useAppStore((s) => s.roles.find((r) => r.id === admin?.roleId) ?? null);
};

export const usePermissions = () => {
  const role = useCurrentRole();
  return role?.permissions ?? null;
};

export const useCan = (module: keyof PermissionMatrix, action: string) => {
  const admin = useCurrentAdmin();
  const role = useAppStore((s) => s.roles.find((r) => r.id === admin?.roleId));
  if (!role) return true; // not signed in → allow viewing admin UI (demo)
  if (role.slug === "super-admin") return true;
  return (role.permissions[module] ?? []).includes(action as never);
};
