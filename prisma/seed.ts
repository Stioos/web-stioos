import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// ============================================================
// SEED SCRIPT — populates the database with demo data
// Run: npx prisma db push --force-reset && bun run db:seed
// ============================================================

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---------- ROLES ----------
  const superAdminRole = await prisma.role.upsert({
    where: { slug: "super-admin" },
    update: {},
    create: {
      name: "Super Admin",
      slug: "super-admin",
      description: "Full platform access",
      permissions: JSON.stringify({
        dashboard: ["view", "create", "edit", "delete", "publish", "manage"],
        marketplace: ["view", "create", "edit", "delete", "publish", "manage"],
        services: ["view", "create", "edit", "delete", "publish", "manage"],
        orders: ["view", "create", "edit", "delete", "publish", "manage"],
        users: ["view", "create", "edit", "delete", "publish", "manage"],
        admins: ["view", "create", "edit", "delete", "publish", "manage"],
        roles: ["view", "create", "edit", "delete", "publish", "manage"],
        inquiries: ["view", "create", "edit", "delete", "publish", "manage"],
        settings: ["view", "create", "edit", "delete", "publish", "manage"],
      }),
      isSystem: true,
    },
  });

  // ---------- ADMIN USERS ----------
  const adminPassword = await hash("admin123", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@stioos.com" },
    update: {},
    create: {
      email: "admin@stioos.com",
      passwordHash: adminPassword,
      name: "Aarav Mehta",
      phone: "+91 98200 00001",
      roleId: superAdminRole.id,
      title: "Super Admin",
      avatarInitials: "AM",
    },
  });
  console.log(`  ✓ Admin: ${admin.email}`);

  // ---------- BUYER USERS ----------
  const buyerPassword = await hash("demo1234", 12);
  const daniel = await prisma.user.upsert({
    where: { email: "d.osei@vertexbuild.com" },
    update: {},
    create: {
      email: "d.osei@vertexbuild.com",
      passwordHash: buyerPassword,
      name: "Daniel Osei",
      company: "Vertex Build Group",
      phone: "+1 555 010-01",
      country: "United States",
      role: "buyer",
      registrationType: "company",
      accountType: "Enterprise",
      companySize: "51-200",
    },
  });
  console.log(`  ✓ Buyer: ${daniel.email}`);

  const meera = await prisma.user.upsert({
    where: { email: "buyer@stioos.com" },
    update: {},
    create: {
      email: "buyer@stioos.com",
      passwordHash: buyerPassword,
      name: "Meera Krishnan",
      company: "Northwind Retail Group",
      phone: "+1 555 771-9032",
      country: "United States",
      role: "buyer",
    },
  });
  console.log(`  ✓ Buyer: ${meera.email}`);

  // ---------- CATEGORIES ----------
  const categories = [
    { name: "AI Automation & Agentic Solutions", slug: "ai-agents", icon: "Bot", tagline: "Autonomous agentic solutions" },
    { name: "AI & Automation", slug: "ai-automation", icon: "Workflow", tagline: "Workflow & process automation" },
    { name: "Technology & Programming", slug: "technology-programming", icon: "Code2", tagline: "Custom engineering capacity" },
    { name: "Cloud DevOps & MLOps", slug: "cloud-devops-mlops", icon: "Cloud", tagline: "Resilient cloud platforms" },
    { name: "Data & Business Intelligence", slug: "data-bi", icon: "BarChart3", tagline: "Analytics & intelligence" },
    { name: "Digital Sales & Marketing", slug: "digital-sales-marketing", icon: "Megaphone", tagline: "AI-driven growth engines" },
    { name: "Business & Enterprise Services", slug: "business-enterprise-services", icon: "Building2", tagline: "Operational excellence" },
    { name: "Multimedia AI & Graphics", slug: "multimedia-ai-graphics", icon: "Clapperboard", tagline: "AI-crafted content at scale" },
    { name: "Talent Solutions", slug: "talent-solutions", icon: "Users", tagline: "Hire, train, deploy talent" },
    { name: "Consulting", slug: "strategy-consulting", icon: "Lightbulb", tagline: "Strategy & advisory" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        tagline: cat.tagline,
        description: cat.tagline,
        status: "active",
        featured: ["ai-agents", "technology-programming", "cloud-devops-mlops", "digital-sales-marketing"].includes(cat.slug),
      },
    });
  }
  console.log(`  ✓ ${categories.length} categories`);

  // ---------- SUBCATEGORIES (one per category for simplicity) ----------
  for (const cat of categories) {
    const dbCat = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (dbCat) {
      await prisma.subcategory.upsert({
        where: { categoryId_slug: { categoryId: dbCat.id, slug: cat.slug } },
        update: {},
        create: {
          name: cat.name,
          slug: cat.slug,
          categoryId: dbCat.id,
          description: cat.tagline,
          status: "active",
        },
      });
    }
  }
  console.log(`  ✓ ${categories.length} subcategories`);

  // ---------- SAMPLE SERVICES ----------
  const catAI = await prisma.category.findUnique({ where: { slug: "ai-agents" } });
  const catTech = await prisma.category.findUnique({ where: { slug: "technology-programming" } });
  const catCloud = await prisma.category.findUnique({ where: { slug: "cloud-devops-mlops" } });
  const catData = await prisma.category.findUnique({ where: { slug: "data-bi" } });

  const sampleServices = [
    {
      name: "Customer Support AI Agent",
      slug: "customer-support-ai-agent",
      categoryId: catAI!.id,
      subcategoryId: (await prisma.subcategory.findUnique({ where: { categoryId_slug: { categoryId: catAI!.id, slug: "ai-agents" } } }))!.id,
      shortDescription: "24/7 multilingual support agent with escalation paths and quality reporting.",
      fullDescription: "Deploy a production-grade customer support AI agent that handles inquiries across EN/DE/FR with seamless escalation to human agents.",
      deliveryType: "subscription",
      timeline: "4-6 weeks",
      rating: 4.8,
      reviews: 42,
      popularity: 95,
      featured: true,
      accent: "from-blue-600 to-cyan-500",
      icon: "Headset",
      tags: JSON.stringify(["AI", "Support", "Automation", "Multilingual"]),
    },
    {
      name: "Next.js Web Application Development",
      slug: "nextjs-web-app-development",
      categoryId: catTech!.id,
      subcategoryId: (await prisma.subcategory.findUnique({ where: { categoryId_slug: { categoryId: catTech!.id, slug: "technology-programming" } } }))!.id,
      shortDescription: "Production-ready SaaS web apps that ship in weeks, not months.",
      fullDescription: "Full-stack Next.js development with TypeScript, Tailwind, and Prisma. Includes CI/CD, testing, and deployment.",
      deliveryType: "project",
      timeline: "4-8 weeks",
      rating: 4.9,
      reviews: 67,
      popularity: 98,
      featured: true,
      accent: "from-slate-700 to-slate-900",
      icon: "Code2",
      tags: JSON.stringify(["Next.js", "React", "TypeScript", "SaaS"]),
    },
    {
      name: "AWS Landing Zone & Enterprise Cloud Foundation",
      slug: "aws-landing-zone-enterprise-cloud",
      categoryId: catCloud!.id,
      subcategoryId: (await prisma.subcategory.findUnique({ where: { categoryId_slug: { categoryId: catCloud!.id, slug: "cloud-devops-mlops" } } }))!.id,
      shortDescription: "Multi-account AWS foundation built on best practices.",
      fullDescription: "Complete AWS Landing Zone with Organizations, SCPs, networking, logging, and security baselines.",
      deliveryType: "project",
      timeline: "6-8 weeks",
      rating: 4.7,
      reviews: 28,
      popularity: 82,
      featured: true,
      accent: "from-orange-500 to-amber-600",
      icon: "Cloud",
      tags: JSON.stringify(["AWS", "Cloud", "DevOps", "Infrastructure"]),
    },
    {
      name: "Predictive Maintenance Model",
      slug: "predictive-maintenance-model",
      categoryId: catData!.id,
      subcategoryId: (await prisma.subcategory.findUnique({ where: { categoryId_slug: { categoryId: catData!.id, slug: "data-bi" } } }))!.id,
      shortDescription: "ML model that predicts equipment failure 72h ahead with 85%+ precision.",
      fullDescription: "End-to-end predictive maintenance pipeline: data ingestion, model training, alerting, and CMMS integration.",
      deliveryType: "project",
      timeline: "8-10 weeks",
      rating: 4.8,
      reviews: 19,
      popularity: 75,
      featured: false,
      accent: "from-emerald-500 to-teal-600",
      icon: "Activity",
      tags: JSON.stringify(["ML", "IoT", "Predictive", "Maintenance"]),
    },
  ];

  for (const svc of sampleServices) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: svc,
    });
  }
  console.log(`  ✓ ${sampleServices.length} services`);

  // ---------- SAMPLE REQUEST (full lifecycle) ----------
  const now = new Date();
  const reqRef = "REQ-LC01A";
  const existingReq = await prisma.marketRequest.findUnique({ where: { reference: reqRef } });
  if (!existingReq) {
    const request = await prisma.marketRequest.create({
      data: {
        reference: reqRef,
        buyerId: daniel.id,
        buyerName: daniel.name,
        buyerCompany: daniel.company,
        categoryId: (await prisma.category.findUnique({ where: { slug: "ai-automation" } }))!.id,
        categoryName: "AI & Automation",
        title: "Automated invoice processing pipeline",
        details: "Replace manual AP entry with an AI pipeline that reads invoices from a shared mailbox, validates against POs, and posts to NetSuite.",
        budgetRange: "$5,000 – $10,000",
        timeline: "4–6 weeks",
        status: "open",
        kind: "service",
        statusHistory: JSON.stringify([
          { status: "open", at: now.toISOString(), by: daniel.name, note: "Request submitted" },
        ]),
      },
    });
    console.log(`  ✓ Request: ${request.reference}`);
  }

  // ---------- SETTINGS ----------
  await prisma.homepageContent.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      heroBadge: "STIOOS Intelligence Core",
      heroTitleTop: "INTELLIGENCE THAT",
      heroTitleBottom: "BUILDS WHAT'S NEXT.",
      heroSubtitle: "Six outcome-based solutions. 360+ services. One accountable partner.",
      primaryCta: "Explore Marketplace",
      secondaryCta: "Explore Solutions",
      finalCtaTitle: "Ready to launch with guaranteed outcomes?",
      finalCtaSubtitle: "Book a scoping call and our delivery team will design a custom engagement.",
    },
  });

  await prisma.brandSettings.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      siteName: "STIOOS Global",
      tagline: "Intelligence That Builds What's Next",
      supportEmail: "support@stioos.com",
      salesEmail: "sales@stioos.com",
      phone: "+1 555 000-0000",
      address: "Global",
    },
  });

  await prisma.marketplaceSettings.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      status: "live",
      requireLeadRegistration: true,
    },
  });
  console.log(`  ✓ Settings`);

  console.log("\n✅ Seed complete!");
  console.log("\nLogin credentials:");
  console.log("  Buyer:  d.osei@vertexbuild.com / demo1234");
  console.log("  Buyer:  buyer@stioos.com / demo1234");
  console.log("  Admin:  admin@stioos.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
