/**
 * STIOOS GLOBAL — Database seed.
 * Imports the existing static catalog + demo activity into SQLite via Prisma.
 * Run with: bun run db:seed
 *
 * Preserves the stable ids used across the app so deep-links and FK
 * relationships (service.categoryId -> Category.id, request.buyerId -> User.id,
 * request.orderId -> MarketOrder.id, etc.) stay intact.
 */
import { db } from "../src/lib/db";
import { hash } from "bcryptjs";
import {
  CATEGORIES,
  SUBCATEGORIES,
} from "../src/data/categories";
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

/** Parse a date string that may be missing a timezone designator. */
function d(input: string | Date): Date {
  if (input instanceof Date) return input;
  if (/T/.test(input) && !/(Z|[+-]\d{2}:?\d{2})$/.test(input)) {
    return new Date(input + "Z");
  }
  return new Date(input);
}

/** De-duplicate services by id, keeping the first occurrence. */
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

async function main() {
  const passwordHash = await hash(DEMO_PASSWORD, 10);

  console.log("⏳ Seeding STIOOS GLOBAL database…");

  // 1. Roles
  console.log("  • roles");
  for (const r of ROLES) {
    await db.role.upsert({
      where: { id: r.id },
      update: {
        name: r.name,
        slug: r.slug,
        description: r.description,
        permissions: r.permissions as object,
        isSystem: r.isSystem,
      },
      create: {
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        permissions: r.permissions as object,
        isSystem: r.isSystem,
        createdAt: d(r.createdAt),
      },
    });
  }

  // 2. Admins
  console.log("  • admins");
  for (const a of ADMINS) {
    await db.adminUser.upsert({
      where: { id: a.id },
      update: {
        name: a.name,
        email: a.email,
        password: passwordHash,
        phone: a.phone,
        roleId: a.roleId,
        status: a.status,
        title: a.title,
        lastActive: a.lastActive ? d(a.lastActive) : null,
      },
      create: {
        id: a.id,
        name: a.name,
        email: a.email,
        password: passwordHash,
        phone: a.phone,
        roleId: a.roleId,
        status: a.status,
        title: a.title,
        lastActive: a.lastActive ? d(a.lastActive) : null,
        createdAt: d(a.createdAt),
      },
    });
  }

  // 3. Categories
  console.log("  • categories");
  for (const c of CATEGORIES) {
    await db.category.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        tagline: c.tagline,
        description: c.description,
        status: c.status,
        featured: c.featured,
      },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        tagline: c.tagline,
        description: c.description,
        status: c.status,
        featured: c.featured,
        createdAt: d(c.createdAt),
      },
    });
  }

  // 4. Subcategories
  console.log("  • subcategories");
  for (const s of SUBCATEGORIES) {
    await db.subcategory.upsert({
      where: { slug_categoryId: { slug: s.slug, categoryId: s.categoryId } },
      update: {
        name: s.name,
        description: s.description,
        status: s.status,
      },
      create: {
        id: s.id,
        name: s.name,
        slug: s.slug,
        categoryId: s.categoryId,
        description: s.description,
        status: s.status,
        createdAt: d(s.createdAt),
      },
    });
  }

  // 5. Users (buyers) — combine platform USERS + MARKET_USERS, all get demo password.
  console.log("  • users");
  const allUsers = [...USERS, ...MARKET_USERS];
  for (const u of allUsers) {
    await db.user.upsert({
      where: { id: u.id },
      update: {
        name: u.name,
        email: u.email,
        password: u.password ? passwordHash : passwordHash,
        company: u.company ?? "",
        phone: u.phone ?? "",
        country: u.country ?? "",
        status: u.status,
        role: u.role,
        inquiriesCount: u.inquiriesCount,
        lastActive: u.lastActive ? d(u.lastActive) : null,
        registrationType: u.registrationType ?? null,
        accountType: u.accountType ?? null,
        profession: u.profession ?? null,
        companySize: u.companySize ?? null,
        phoneCountry: u.phoneCountry ?? null,
        intent: u.intent ?? null,
        intentTimeline: u.intentTimeline ?? null,
        registrationSource: u.registrationSource ?? null,
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: passwordHash,
        company: u.company ?? "",
        phone: u.phone ?? "",
        country: u.country ?? "",
        status: u.status,
        role: u.role,
        inquiriesCount: u.inquiriesCount,
        lastActive: u.lastActive ? d(u.lastActive) : null,
        createdAt: d(u.createdAt),
        registrationType: u.registrationType ?? null,
        accountType: u.accountType ?? null,
        profession: u.profession ?? null,
        companySize: u.companySize ?? null,
        phoneCountry: u.phoneCountry ?? null,
        intent: u.intent ?? null,
        intentTimeline: u.intentTimeline ?? null,
        registrationSource: u.registrationSource ?? null,
      },
    });
  }

  // 6. Services (305 unique across 7 division chunks + core)
  console.log("  • services");
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
    await db.service.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        slug: s.slug,
        categoryId: s.categoryId,
        subcategoryId: s.subcategoryId,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        tags: s.tags as object,
        industries: s.industries as object,
        deliveryType: s.deliveryType,
        timeline: s.timeline,
        rating: s.rating,
        reviews: s.reviews,
        popularity: s.popularity,
        featured: s.featured,
        status: s.status,
        accent: s.accent,
        icon: s.icon,
        problemsSolved: s.problemsSolved as object,
        capabilities: s.capabilities as object,
        deliverables: s.deliverables as object,
        process: s.process as object,
        technologies: s.technologies as object,
        faqs: s.faqs as object,
        metaTitle: s.metaTitle ?? null,
        metaDescription: s.metaDescription ?? null,
        createdBy: s.createdBy,
      },
      create: {
        id: s.id,
        name: s.name,
        slug: s.slug,
        categoryId: s.categoryId,
        subcategoryId: s.subcategoryId,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        tags: s.tags as object,
        industries: s.industries as object,
        deliveryType: s.deliveryType,
        timeline: s.timeline,
        rating: s.rating,
        reviews: s.reviews,
        popularity: s.popularity,
        featured: s.featured,
        status: s.status,
        accent: s.accent,
        icon: s.icon,
        problemsSolved: s.problemsSolved as object,
        capabilities: s.capabilities as object,
        deliverables: s.deliverables as object,
        process: s.process as object,
        technologies: s.technologies as object,
        faqs: s.faqs as object,
        metaTitle: s.metaTitle ?? null,
        metaDescription: s.metaDescription ?? null,
        createdBy: s.createdBy,
        createdAt: d(s.createdAt),
        updatedAt: d(s.updatedAt),
      },
    });
  }
  console.log(`    → ${services.length} services`);

  // 7. Industries, Insights, Resources, FAQs
  console.log("  • industries / insights / resources / faqs");
  for (const ind of INDUSTRIES) {
    await db.industry.upsert({
      where: { id: ind.id },
      update: {
        name: ind.name,
        slug: ind.slug,
        icon: ind.icon,
        description: ind.description,
        servicesCount: ind.servicesCount,
        status: ind.status,
      },
      create: { id: ind.id, ...ind },
    });
  }
  for (const ins of INSIGHTS) {
    await db.insight.upsert({
      where: { id: ins.id },
      update: {
        title: ins.title,
        slug: ins.slug,
        category: ins.category,
        excerpt: ins.excerpt,
        content: ins.content,
        author: ins.author,
        readTime: ins.readTime,
        publishedAt: d(ins.publishedAt),
        status: ins.status,
        accent: ins.accent,
      },
      create: {
        id: ins.id,
        title: ins.title,
        slug: ins.slug,
        category: ins.category,
        excerpt: ins.excerpt,
        content: ins.content,
        author: ins.author,
        readTime: ins.readTime,
        publishedAt: d(ins.publishedAt),
        status: ins.status,
        accent: ins.accent,
      },
    });
  }
  for (const r of RESOURCES) {
    await db.resource.upsert({
      where: { id: r.id },
      update: {
        title: r.title,
        slug: r.slug,
        type: r.type,
        description: r.description,
        fileFormat: r.fileFormat,
        size: r.size,
        downloads: r.downloads,
        publishedAt: d(r.publishedAt),
        status: r.status,
        accent: r.accent,
      },
      create: {
        id: r.id,
        title: r.title,
        slug: r.slug,
        type: r.type,
        description: r.description,
        fileFormat: r.fileFormat,
        size: r.size,
        downloads: r.downloads,
        publishedAt: d(r.publishedAt),
        status: r.status,
        accent: r.accent,
      },
    });
  }
  for (const f of FAQS) {
    await db.faqItem.upsert({
      where: { id: f.id },
      update: {
        question: f.question,
        answer: f.answer,
        category: f.category,
        status: f.status,
        order: f.order,
      },
      create: { id: f.id, ...f },
    });
  }

  // 8. Orders (before requests — requests reference orderId)
  console.log("  • orders");
  for (const o of MARKET_ORDERS) {
    await db.marketOrder.upsert({
      where: { id: o.id },
      update: {
        serviceId: o.serviceId,
        serviceSlug: o.serviceSlug,
        serviceName: o.serviceName,
        serviceIcon: o.serviceIcon,
        buyerId: o.buyerId,
        buyerName: o.buyerName,
        buyerCompany: o.buyerCompany,
        amount: o.amount,
        status: o.status,
        deliveryType: o.deliveryType,
        placedAt: d(o.placedAt),
        requirements: o.requirements ?? null,
      },
      create: {
        id: o.id,
        serviceId: o.serviceId,
        serviceSlug: o.serviceSlug,
        serviceName: o.serviceName,
        serviceIcon: o.serviceIcon,
        buyerId: o.buyerId,
        buyerName: o.buyerName,
        buyerCompany: o.buyerCompany,
        amount: o.amount,
        status: o.status,
        deliveryType: o.deliveryType,
        placedAt: d(o.placedAt),
        requirements: o.requirements ?? null,
      },
    });
  }

  // 9. Requests
  console.log("  • requests");
  for (const r of MARKET_REQUESTS) {
    await db.marketRequest.upsert({
      where: { id: r.id },
      update: {
        buyerId: r.buyerId,
        buyerName: r.buyerName,
        buyerCompany: r.buyerCompany,
        categoryId: r.categoryId,
        categoryName: r.categoryName,
        title: r.title,
        details: r.details,
        budgetRange: r.budgetRange,
        timeline: r.timeline,
        status: r.status,
        kind: r.kind ?? "service",
        reference: r.reference,
        meta: (r.meta ?? {}) as object,
        statusHistory: (r.statusHistory ?? []) as object,
        quotedAmount: r.quotedAmount ?? null,
        orderId: r.orderId ?? null,
        createdAt: d(r.createdAt),
      },
      create: {
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
        status: r.status,
        kind: r.kind ?? "service",
        reference: r.reference,
        meta: (r.meta ?? {}) as object,
        statusHistory: (r.statusHistory ?? []) as object,
        quotedAmount: r.quotedAmount ?? null,
        orderId: r.orderId ?? null,
        createdAt: d(r.createdAt),
      },
    });
  }

  // 10. Threads + messages
  console.log("  • threads + messages");
  for (const t of MARKET_THREADS) {
    await db.marketThread.upsert({
      where: { id: t.id },
      update: {
        serviceId: t.serviceId,
        serviceSlug: t.serviceSlug,
        serviceName: t.serviceName,
        serviceIcon: t.serviceIcon,
        buyerId: t.buyerId,
        buyerName: t.buyerName,
        teamId: t.teamId,
        teamName: t.teamName,
        createdAt: d(t.createdAt),
        lastMessageAt: d(t.lastMessageAt),
      },
      create: {
        id: t.id,
        serviceId: t.serviceId,
        serviceSlug: t.serviceSlug,
        serviceName: t.serviceName,
        serviceIcon: t.serviceIcon,
        buyerId: t.buyerId,
        buyerName: t.buyerName,
        teamId: t.teamId,
        teamName: t.teamName,
        createdAt: d(t.createdAt),
        lastMessageAt: d(t.lastMessageAt),
      },
    });
    for (const m of t.messages) {
      await db.marketMessage.upsert({
        where: { id: m.id },
        update: {
          threadId: t.id,
          senderId: m.senderId,
          senderName: m.senderName,
          senderRole: m.senderRole,
          body: m.body,
          sentAt: d(m.sentAt),
        },
        create: {
          id: m.id,
          threadId: t.id,
          senderId: m.senderId,
          senderName: m.senderName,
          senderRole: m.senderRole,
          body: m.body,
          sentAt: d(m.sentAt),
        },
      });
    }
  }

  // 11. Wishlist (assign seed slugs to the demo buyer)
  console.log("  • wishlist");
  for (const slug of WISHLIST_SEED) {
    await db.wishlist.upsert({
      where: { userId_serviceSlug: { userId: "usr-mkt-buyer", serviceSlug: slug } },
      update: {},
      create: { userId: "usr-mkt-buyer", serviceSlug: slug },
    });
  }

  // 12. Inquiries (anonymous leads — buyerId null)
  console.log("  • inquiries");
  for (const i of INQUIRIES) {
    await db.inquiry.upsert({
      where: { id: i.id },
      update: {
        name: i.name,
        email: i.email,
        company: i.company,
        phone: i.phone,
        type: i.type,
        serviceId: i.serviceId ?? null,
        serviceName: i.serviceName ?? null,
        requirements: i.requirements,
        budgetRange: i.budgetRange,
        timeline: i.timeline,
        status: i.status,
        createdAt: d(i.createdAt),
      },
      create: {
        id: i.id,
        name: i.name,
        email: i.email,
        company: i.company,
        phone: i.phone,
        type: i.type,
        serviceId: i.serviceId ?? null,
        serviceName: i.serviceName ?? null,
        requirements: i.requirements,
        budgetRange: i.budgetRange,
        timeline: i.timeline,
        status: i.status,
        createdAt: d(i.createdAt),
      },
    });
  }

  // 13. Notifications + Activity logs
  console.log("  • notifications + activity");
  for (const n of NOTIFICATIONS) {
    await db.notification.upsert({
      where: { id: n.id },
      update: {
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: d(n.createdAt),
      },
      create: {
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: d(n.createdAt),
      },
    });
  }
  for (const a of ACTIVITY_LOGS) {
    await db.activityLog.upsert({
      where: { id: a.id },
      update: {
        actor: a.actor,
        action: a.action,
        module: a.module,
        target: a.target,
        description: a.description,
        createdAt: d(a.createdAt),
      },
      create: {
        id: a.id,
        actor: a.actor,
        action: a.action,
        module: a.module,
        target: a.target,
        description: a.description,
        createdAt: d(a.createdAt),
      },
    });
  }

  // 14. Settings singletons
  console.log("  • settings");
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
  for (const [id, value] of [
    ["brand", brand],
    ["marketplace", marketplace],
    ["homepage", HOMEPAGE_CONTENT],
    ["security", security],
  ] as [string, object][]) {
    await db.setting.upsert({
      where: { id },
      update: { value },
      create: { id, value },
    });
  }

  console.log("✅ Seed complete.");
  console.log(
    `   ${services.length} services · ${CATEGORIES.length} categories · ${allUsers.length} users · ${ADMINS.length} admins · ${MARKET_REQUESTS.length} requests · ${MARKET_ORDERS.length} orders · ${INQUIRIES.length} inquiries`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
