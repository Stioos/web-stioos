/**
 * Export the STIOOS static catalog + demo activity to a Django fixture
 * (backend/fixtures/seed.json). Plain passwords are stored here; the
 * Django `seed` management command re-hashes them with make_password
 * after loaddata.
 *
 * Run: bun run scripts/export-seed.ts
 */
import { writeFileSync, mkdirSync } from "fs";
import { hash } from "bcryptjs";
import { CATEGORIES, SUBCATEGORIES } from "../src/data/categories";
import { ROLES, ADMINS, USERS } from "../src/data/people";
import {
  INQUIRIES,
  NOTIFICATIONS,
  ACTIVITY_LOGS,
  INDUSTRIES,
  INSIGHTS,
  RESOURCES,
  FAQS,
  HOMEPAGE_CONTENT,
} from "../src/data/content";
import {
  MARKET_USERS,
  MARKET_ORDERS,
  MARKET_REQUESTS,
  MARKET_THREADS,
  WISHLIST_SEED,
  DEMO_PASSWORD,
} from "../src/data/marketplace-activity";
import { CORE_SERVICES } from "../src/data/services-core";
import { AGENT_SERVICES } from "../src/data/services-agents";
import { TECH_SERVICES } from "../src/data/services-tech";
import { CLOUD_SERVICES } from "../src/data/services-cloud";
import { MARKETING_SERVICES } from "../src/data/services-marketing";
import { BUSINESS_SERVICES } from "../src/data/services-business";
import { MULTIMEDIA_SERVICES } from "../src/data/services-multimedia";
import { TALENT_SERVICES } from "../src/data/services-talent";
import type { Service } from "../src/types";

// ---------- helpers ----------

/** Normalize a date string to ISO-8601 with timezone (Django parses this). */
function iso(input: string | Date): string {
  if (input instanceof Date) return input.toISOString();
  if (/T/.test(input) && !/(Z|[+-]\d{2}:?\d{2})$/.test(input)) {
    return input + "Z";
  }
  return new Date(input).toISOString();
}

function dedupeServices(lists: Service[][]): Service[] {
  const seen = new Set<string>();
  const out: Service[] = [];
  for (const list of lists) {
    for (const s of list) {
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      out.push(s);
    }
  }
  return out;
}

interface Fixture {
  model: string;
  pk: string;
  fields: Record<string, unknown>;
}

const fixtures: Fixture[] = [];

function add(model: string, pk: string, fields: Record<string, unknown>) {
  fixtures.push({ model, pk, fields });
}

// ---------- export ----------

async function main() {
  // Roles
  for (const r of ROLES) {
    add("api.role", r.id, {
      name: r.name,
      slug: r.slug,
      description: r.description,
      permissions: r.permissions,
      is_system: r.isSystem,
      created_at: iso(r.createdAt),
    });
  }

  // Admins (plain password — Django re-hashes)
  for (const a of ADMINS) {
    add("api.adminuser", a.id, {
      name: a.name,
      email: a.email,
      password: DEMO_PASSWORD,
      phone: a.phone,
      role_id: a.roleId,
      status: a.status,
      title: a.title,
      last_active: a.lastActive ? iso(a.lastActive) : null,
      created_at: iso(a.createdAt),
      updated_at: iso(a.lastActive ?? a.createdAt),
      avatar_initials: null,
    });
  }

  // Users (buyers) — combine platform USERS + MARKET_USERS
  const allUsers = [...USERS, ...MARKET_USERS];
  for (const u of allUsers) {
    add("api.user", u.id, {
      name: u.name,
      email: u.email,
      password: u.password ?? DEMO_PASSWORD,
      company: u.company ?? "",
      phone: u.phone ?? "",
      country: u.country ?? "",
      status: u.status,
      role: u.role,
      inquiries_count: u.inquiriesCount,
      created_at: iso(u.createdAt),
      updated_at: iso(u.lastActive ?? u.createdAt),
      last_active: u.lastActive ? iso(u.lastActive) : null,
      registration_type: u.registrationType ?? null,
      account_type: u.accountType ?? null,
      profession: u.profession ?? null,
      company_size: u.companySize ?? null,
      phone_country: u.phoneCountry ?? null,
      intent: u.intent ?? null,
      intent_timeline: u.intentTimeline ?? null,
      registration_source: u.registrationSource ?? null,
    });
  }

  // Categories
  for (const c of CATEGORIES) {
    add("api.category", c.id, {
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      tagline: c.tagline,
      description: c.description,
      status: c.status,
      featured: c.featured,
      created_at: iso(c.createdAt),
    });
  }

  // Subcategories
  for (const s of SUBCATEGORIES) {
    add("api.subcategory", s.id, {
      name: s.name,
      slug: s.slug,
      category_id: s.categoryId,
      description: s.description,
      status: s.status,
      created_at: iso(s.createdAt),
    });
  }

  // Services (305 unique)
  const services = dedupeServices([
    CORE_SERVICES,
    AGENT_SERVICES,
    TECH_SERVICES,
    CLOUD_SERVICES,
    MARKETING_SERVICES,
    BUSINESS_SERVICES,
    MULTIMEDIA_SERVICES,
    TALENT_SERVICES,
  ]);
  for (const s of services) {
    add("api.service", s.id, {
      name: s.name,
      slug: s.slug,
      category_id: s.categoryId,
      subcategory_id: s.subcategoryId,
      short_description: s.shortDescription,
      full_description: s.fullDescription,
      tags: s.tags,
      industries: s.industries,
      delivery_type: s.deliveryType,
      timeline: s.timeline,
      rating: s.rating,
      reviews: s.reviews,
      popularity: s.popularity,
      featured: s.featured,
      status: s.status,
      accent: s.accent,
      icon: s.icon,
      problems_solved: s.problemsSolved,
      capabilities: s.capabilities,
      deliverables: s.deliverables,
      process: s.process,
      technologies: s.technologies,
      faqs: s.faqs,
      meta_title: s.metaTitle ?? null,
      meta_description: s.metaDescription ?? null,
      created_at: iso(s.createdAt),
      updated_at: iso(s.updatedAt),
      created_by: s.createdBy,
    });
  }

  // Industries, Insights, Resources, FAQs
  for (const ind of INDUSTRIES) {
    add("api.industry", ind.id, {
      name: ind.name,
      slug: ind.slug,
      icon: ind.icon,
      description: ind.description,
      services_count: ind.servicesCount,
      status: ind.status,
    });
  }
  for (const ins of INSIGHTS) {
    add("api.insight", ins.id, {
      title: ins.title,
      slug: ins.slug,
      category: ins.category,
      excerpt: ins.excerpt,
      content: ins.content,
      author: ins.author,
      read_time: ins.readTime,
      published_at: iso(ins.publishedAt),
      status: ins.status,
      accent: ins.accent,
    });
  }
  for (const r of RESOURCES) {
    add("api.resource", r.id, {
      title: r.title,
      slug: r.slug,
      type: r.type,
      description: r.description,
      file_format: r.fileFormat,
      size: r.size,
      downloads: r.downloads,
      published_at: iso(r.publishedAt),
      status: r.status,
      accent: r.accent,
    });
  }
  for (const f of FAQS) {
    add("api.faqitem", f.id, { ...f });
  }

  // Orders (before requests — requests reference orderId)
  for (const o of MARKET_ORDERS) {
    add("api.marketorder", o.id, {
      service_id: o.serviceId,
      service_slug: o.serviceSlug,
      service_name: o.serviceName,
      service_icon: o.serviceIcon,
      buyer_id: o.buyerId,
      buyer_name: o.buyerName,
      buyer_company: o.buyerCompany,
      amount: o.amount,
      status: o.status,
      delivery_type: o.deliveryType,
      placed_at: iso(o.placedAt),
      updated_at: iso(o.placedAt),
      requirements: o.requirements ?? null,
    });
  }

  // Requests
  for (const r of MARKET_REQUESTS) {
    add("api.marketrequest", r.id, {
      buyer_id: r.buyerId,
      buyer_name: r.buyerName,
      buyer_company: r.buyerCompany,
      category_id: r.categoryId,
      category_name: r.categoryName,
      title: r.title,
      details: r.details,
      budget_range: r.budgetRange,
      timeline: r.timeline,
      status: r.status,
      kind: r.kind ?? "service",
      reference: r.reference,
      meta: r.meta ?? {},
      status_history: r.statusHistory ?? [],
      quoted_amount: r.quotedAmount ?? null,
      order_id: r.orderId ?? null,
      created_at: iso(r.createdAt),
      updated_at: iso(r.createdAt),
    });
  }

  // Threads + messages
  for (const t of MARKET_THREADS) {
    add("api.marketthread", t.id, {
      service_id: t.serviceId,
      service_slug: t.serviceSlug,
      service_name: t.serviceName,
      service_icon: t.serviceIcon,
      buyer_id: t.buyerId,
      buyer_name: t.buyerName,
      team_id: t.teamId,
      team_name: t.teamName,
      created_at: iso(t.createdAt),
      last_message_at: iso(t.lastMessageAt),
    });
    for (const m of t.messages) {
      add("api.marketmessage", m.id, {
        thread_id: t.id,
        sender_id: m.senderId,
        sender_name: m.senderName,
        sender_role: m.senderRole,
        body: m.body,
        sent_at: iso(m.sentAt),
      });
    }
  }

  // Wishlist (seed slugs -> demo buyer)
  for (const slug of WISHLIST_SEED) {
    add("api.wishlist", `wl-${slug}`, {
      user_id: "usr-mkt-buyer",
      service_slug: slug,
      created_at: new Date().toISOString(),
    });
  }

  // Inquiries
  for (const i of INQUIRIES) {
    add("api.inquiry", i.id, {
      name: i.name,
      email: i.email,
      company: i.company,
      phone: i.phone,
      type: i.type,
      service_id: i.serviceId ?? null,
      service_name: i.serviceName ?? null,
      requirements: i.requirements,
      budget_range: i.budgetRange,
      timeline: i.timeline,
      status: i.status,
      created_at: iso(i.createdAt),
      updated_at: iso(i.createdAt),
      buyer_id: null,
    });
  }

  // Notifications + Activity
  for (const n of NOTIFICATIONS) {
    add("api.notification", n.id, {
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      created_at: iso(n.createdAt),
    });
  }
  for (const a of ACTIVITY_LOGS) {
    add("api.activitylog", a.id, {
      actor: a.actor,
      action: a.action,
      module: a.module,
      target: a.target,
      description: a.description,
      created_at: iso(a.createdAt),
    });
  }

  // Settings singletons
  const brand = {
    siteName: "STIOOS GLOBAL",
    tagline: "Intelligence that builds what's next.",
    supportEmail: "support@stioos.com",
    salesEmail: "hello@stioos.com",
    phone: "+1 (555) 010-9600",
    address: "Level 32, Integrity Towers, Global Business District",
  };
  const marketplace = {
    status: "live",
    defaultSort: "relevance",
    autoApproveServices: false,
    featuredSlots: 8,
    heroCtaPrimary: "Get a Quote",
    heroCtaSecondary: "Schedule Consultation",
    cardCtaPrimary: "Request Service",
    cardCtaSecondary: "Contact an Expert",
    requireLeadRegistration: true,
  };
  const security = {
    sessionTimeout: "60 minutes",
    passwordMinLength: 10,
    requireSymbols: true,
    twoFactorEnabled: false,
    ipAllowlist: false,
  };
  add("api.setting", "brand", { value: brand });
  add("api.setting", "marketplace", { value: marketplace });
  add("api.setting", "homepage", { value: HOMEPAGE_CONTENT });
  add("api.setting", "security", { value: security });

  mkdirSync("backend/fixtures", { recursive: true });
  writeFileSync(
    "backend/fixtures/seed.json",
    JSON.stringify(fixtures, null, 0)
  );
  console.log(
    `✅ Wrote ${fixtures.length} fixture rows to backend/fixtures/seed.json`
  );
  console.log(
    `   ${services.length} services · ${CATEGORIES.length} categories · ${allUsers.length} users · ${ADMINS.length} admins`
  );
}

main().catch((e) => {
  console.error("❌ export-seed failed:", e);
  process.exit(1);
});
