import type { DivisionSpec } from "../division-types";

// ============================================================
// 01 — BUSINESS & ENTERPRISE SERVICES (cat-business-enterprise)
// Accent: emerald/teal. Subcategories: crm-solutions / erp-solutions /
// business-intelligence-data-analytics / security-risk /
// financial-management / customer-experience.
// ============================================================

export const BUSINESS_SPEC: DivisionSpec = {
  categoryId: "cat-business-enterprise",
  slug: "business-enterprise-services",

  // 01 — Hero
  hero: {
    eyebrow: "Business & Enterprise Services",
    title: "Operational excellence for complex organizations —",
    highlight: "systems unified, close accelerated, risk retired.",
    subtitle:
      "CRM and ERP implementation, business intelligence and data analytics, cybersecurity and compliance programs, financial management, and customer experience programs delivered end-to-end. One accountable partner for the platforms your operation runs on.",
    primaryCta: { label: "Request a consultation", href: "/contact" },
    secondaryCta: { label: "Browse 48 enterprise services", href: "/marketplace?category=business-enterprise-services" },
    stats: [
      { value: "48", label: "Enterprise services in catalog" },
      { value: "−34%", label: "Order-to-cash cycle reduction" },
      { value: "28%", label: "Faster financial close" },
    ],
  },

  // 02 — Trust bar
  trustBadges: [
    "Salesforce", "HubSpot", "Microsoft Dynamics", "SAP", "Oracle NetSuite",
    "Workday", "ServiceNow", "Snowflake", "Databricks", "Tableau", "Power BI", "Looker",
  ],

  // 03 — KPI band
  kpis: [
    { value: "99.2%", label: "Master data accuracy achieved", trend: "+18pts", spark: [81, 86, 90, 93, 96, 98, 99.2], icon: "BadgeCheck" },
    { value: "28%", label: "Faster month-end close", trend: "−14 days", spark: [45, 40, 36, 32, 29, 27, 25], icon: "Clock" },
    { value: "+42%", label: "BI dashboard adoption lift", trend: "+42%", spark: [22, 28, 33, 38, 45, 52, 58], icon: "TrendingUp" },
    { value: "−61%", label: "Compliance findings reduced", trend: "−61%", spark: [100, 82, 68, 54, 47, 42, 39], icon: "ShieldCheck" },
  ],

  // 04 — Pain points
  painPoints: [
    {
      icon: "Layers",
      title: "Seven systems, no single source of truth",
      description: "CRM, ERP, billing, and FP&A each hold a slice of the customer record. Revenue numbers disagree by Tuesday and nobody trusts the dashboard by month-end.",
      impact: "12+ hrs/wk reconciling",
    },
    {
      icon: "FileSearch",
      title: "Reporting is manual, late, and untrusted",
      description: "Analysts export, pivot, and stitch spreadsheets for three days to produce a board pack that's already stale by the time leadership reads it. Decisions lag a full reporting cycle.",
      impact: "+3-day decision lag",
    },
    {
      icon: "Lock",
      title: "Compliance risk you can't see or measure",
      description: "SOC 2, SOX, HIPAA, and ISO controls live in spreadsheets and tribal knowledge. Audit prep is a fire drill, and you can't quantify exposure until an auditor finds it for you.",
      impact: "−61% findings target",
    },
  ],

  // 05 — Solution overview
  solution: {
    eyebrow: "The STIOOS approach",
    title: "One accountable partner for every platform your operation runs on",
    body: "We don't drop a tool and disappear. STIOOS implements the platform, migrates the data, integrates the stack, trains the operators, and stays on the hook for the outcome — close cycle, data accuracy, compliance posture, and adoption. Every engagement ships with a measurable outcome contract and a named delivery lead.",
    capabilities: [
      "Certified implementation teams across Salesforce, Dynamics, SAP, NetSuite, Workday",
      "Master data migration with reconciliation and cutover runbook",
      "Native integration to your data warehouse (Snowflake, Databricks, BigQuery)",
      "Governed semantic layer — one metric definition, every dashboard",
      "Compliance programs: SOC 2, SOX, HIPAA, ISO 27001, GDPR",
      "Outcome SLAs: close cycle, data accuracy, audit findings — measured monthly",
    ],
    visual: "dashboard",
  },

  // 06 — Capabilities bento (links to subcategories)
  capabilities: [
    { icon: "Users", title: "CRM Solutions", description: "Salesforce, HubSpot, and Dynamics implementations that unify the revenue record.", metric: "9 services", span: "lg", subslug: "crm-solutions" },
    { icon: "Boxes", title: "ERP Solutions", description: "NetSuite, SAP, and Dynamics 365 modernization for finance and operations.", metric: "8 services", span: "md", subslug: "erp-solutions" },
    { icon: "BarChart3", title: "Business Intelligence & Data Analytics", description: "Snowflake, Power BI, Tableau, and Looker platforms with a governed semantic layer.", metric: "11 services", span: "md", subslug: "business-intelligence-data-analytics" },
    { icon: "ShieldCheck", title: "Security & Risk", description: "SOC 2, SOX, HIPAA, and ISO programs with continuous control monitoring.", metric: "7 services", span: "sm", subslug: "security-risk" },
    { icon: "Wallet", title: "Financial Management", description: "Close acceleration, FP&A modernization, and fractional CFO services.", metric: "7 services", span: "sm", subslug: "financial-management" },
    { icon: "HeartHandshake", title: "Customer Experience", description: "Journey orchestration, VoC programs, and service operations on ServiceNow.", metric: "6 services", span: "md", subslug: "customer-experience" },
  ],

  // 07 — Process timeline
  process: {
    title: "Delivery methodology",
    subtitle: "A repeatable five-phase path from discovery to a platform your team operates confidently — with measurable outcomes at every gate.",
    phases: [
      { phase: "01", title: "Discover & assess", description: "We map systems, data flows, control gaps, and the outcomes you're buying.", duration: "Week 1–2", deliverables: ["System landscape audit", "Data quality baseline", "Outcome contract draft"] },
      { phase: "02", title: "Design & architect", description: "Target architecture, data model, and integration design on your real stack.", duration: "Week 2–4", deliverables: ["Target-state architecture", "Data migration plan", "Integration blueprint"] },
      { phase: "03", title: "Build & migrate", description: "Platform configuration, data migration with reconciliation, and stack integration.", duration: "Week 4–10", deliverables: ["Configured platform", "Migrated master data", "Live integrations"] },
      { phase: "04", title: "Validate & cutover", description: "UAT, parallel run, compliance review, and production cutover.", duration: "Week 10–12", deliverables: ["UAT sign-off", "Compliance attestation", "Cutover runbook"] },
      { phase: "05", title: "Operate & optimize", description: "Managed operations, monthly outcome reviews, and continuous optimization.", duration: "Ongoing", deliverables: ["Outcome SLA report", "Monthly business review", "Quarterly roadmap"] },
    ],
  },

  // 08 — Tech radar
  techRadar: {
    title: "The enterprise stack we ship to production",
    subtitle: "Every platform below is in active production across STIOOS engagements. The radar shows where each sits on the adopt-to-hold spectrum for our delivery teams.",
    rings: [
      { label: "Adopt" },
      { label: "Trial" },
      { label: "Assess" },
      { label: "Hold" },
    ],
    nodes: [
      { name: "Salesforce", ring: 0, angle: -70 },
      { name: "Microsoft Dynamics", ring: 0, angle: -20 },
      { name: "Oracle NetSuite", ring: 0, angle: 40 },
      { name: "Snowflake", ring: 0, angle: 130 },
      { name: "Power BI", ring: 0, angle: -140 },
      { name: "Workday", ring: 1, angle: 110 },
      { name: "ServiceNow", ring: 1, angle: 160 },
      { name: "SAP S/4HANA", ring: 1, angle: 90 },
      { name: "Databricks", ring: 1, angle: 70 },
      { name: "CrowdStrike", ring: 2, angle: -100 },
      { name: "Splunk", ring: 2, angle: 20 },
      { name: "Looker", ring: 2, angle: -50 },
    ],
  },

  // 09 — Before / after impact
  impact: {
    title: "First-year impact",
    subtitle: "Representative results from STIOOS enterprise engagements in the first 12 months of production. Your numbers will vary based on system landscape and data maturity.",
    metrics: [
      { label: "Order-to-cash cycle (days)", before: 47, after: 31, beforeLabel: "47 days", afterLabel: "31 days", unit: "days" },
      { label: "Month-end close (days)", before: 12, after: 8.6, beforeLabel: "12 days", afterLabel: "8.6 days", unit: "days" },
      { label: "Master data accuracy", before: 78, after: 99.2, beforeLabel: "78%", afterLabel: "99.2%", unit: "%" },
      { label: "BI dashboard active users", before: 28, after: 70, beforeLabel: "28%", afterLabel: "70%", unit: "%" },
    ],
  },

  // 10 — Spotlight services
  spotlightServices: [
    { name: "Salesforce CRM Implementation", tagline: "Full Sales Cloud + Service Cloud rollout with data migration and CPQ.", tags: ["Salesforce", "CPQ", "Sales Cloud"], metric: { value: "+42%", label: "pipeline velocity" }, href: "/marketplace?category=business-enterprise-services" },
    { name: "ERP Modernization Program", tagline: "NetSuite or Dynamics 365 implementation with close acceleration baked in.", tags: ["NetSuite", "Dynamics 365", "FP&A"], metric: { value: "28%", label: "faster close" }, href: "/marketplace?category=business-enterprise-services" },
    { name: "BI & Analytics Platform Build", tagline: "Snowflake + Power BI governed semantic layer with adoption program.", tags: ["Snowflake", "Power BI", "dbt"], metric: { value: "+42%", label: "dashboard adoption" }, href: "/marketplace?category=business-enterprise-services" },
  ],

  // 11 — Outcomes gauges
  outcomes: {
    central: { value: 96, label: "Implementation success score", caption: "Across 240+ enterprise programs" },
    gauges: [
      { value: 99, label: "Go-live on or before target date" },
      { value: 94, label: "Adoption at 90-day mark" },
      { value: 97, label: "Data accuracy in production" },
      { value: 92, label: "Stakeholder satisfaction" },
    ],
  },

  // 12 — Case study
  caseStudy: {
    industry: "Industrial Manufacturing · $1.2B revenue",
    title: "How a manufacturer unified 7 systems and cut close cycle 28%",
    challenge: "A $1.2B manufacturer ran seven disconnected systems across three acquired business units — legacy ERP, two CRMs, a bolted-on billing platform, and four separate spreadsheets masquerading as a chart of accounts. Month-end close took 12 days, revenue recognition was reconciled by hand, and the audit committee had stopped trusting the numbers.",
    solution: "STIOOS consolidated the ERPs onto NetSuite, unified CRM onto Salesforce, stood up a Snowflake + Power BI governed semantic layer, and ran a parallel close for two cycles before cutover. We delivered with a fixed outcome contract tied to close-cycle reduction, data accuracy, and audit finding count.",
    results: [
      { value: "28%", label: "Faster month-end close (12 → 8.6 days)" },
      { value: "99.2%", label: "Master data accuracy achieved" },
      { value: "−61%", label: "Audit findings year-over-year" },
    ],
    quote: "For the first time in a decade, the board pack and the ERP agree on revenue to the dollar. Close went from a two-week fire drill to a Monday-morning routine.",
    author: "Chief Financial Officer",
    role: "Industrial Manufacturing",
  },

  // 13 — Comparison table
  comparison: {
    title: "Why teams choose STIOOS",
    subtitle: "How STIOOS enterprise engagements compare to the alternatives teams typically evaluate.",
    columns: ["Big-4 consult", "SI partner", "Staff augmentation", "STIOOS"],
    rows: [
      { criterion: "Certified across Salesforce, SAP, NetSuite, Dynamics, Workday", values: ["yes", "partial", "no", "yes"] },
      { criterion: "Outcome contract tied to close, accuracy, and findings", values: ["no", "partial", "no", "yes"] },
      { criterion: "Data migration with reconciliation and cutover runbook", values: ["yes", "yes", "no", "yes"] },
      { criterion: "Governed semantic layer — one metric, every dashboard", values: ["partial", "partial", "no", "yes"] },
      { criterion: "Managed operations with monthly business review", values: ["partial", "partial", "no", "yes"] },
      { criterion: "Fixed-price first phase, named delivery lead", values: ["no", "partial", "no", "yes"] },
    ],
  },

  // 14 — Pricing tiers
  pricing: {
    title: "Engagement models",
    subtitle: "Three ways to engage, all with a transparent scope and a measurable outcome. No vague retainers, no open-ended T&M.",
    tiers: [
      {
        name: "Pilot", price: "$45K", period: "project", description: "One platform, one workflow, one measurable outcome.",
        features: ["1 platform implementation (CRM or ERP)", "Single workflow scope", "Data migration + reconciliation", "30-day hypercare", "Outcome report at 90 days"],
        popular: false, cta: "Start a Pilot project",
      },
      {
        name: "Program", price: "$24K", period: "month", description: "Multi-platform program with managed operations and SLAs.",
        features: ["Up to 3 platforms in scope", "BI + analytics + integrations", "Managed operations + support", "Monthly business review", "Outcome SLAs: close, accuracy, findings", "Dedicated delivery lead"],
        popular: true, cta: "Start a Program engagement",
      },
      {
        name: "Enterprise", price: "Custom", period: "program", description: "Full enterprise transformation for multi-business-unit scale.",
        features: ["Unlimited platforms + business units", "ERP, CRM, BI, security, FP&A in one program", "SOC 2 / SOX / HIPAA compliance track", "Quarterly board reporting", "Dedicated program director", "Outcome SLA: 99.5% platform uptime"],
        popular: false, cta: "Talk to sales",
      },
    ],
  },

  // 15 — Industries cloud
  industries: [
    { name: "Manufacturing", count: 11 },
    { name: "Financial Services", count: 9 },
    { name: "Healthcare", count: 7 },
    { name: "Retail & E-Commerce", count: 8 },
    { name: "Construction", count: 5 },
    { name: "Logistics & Supply Chain", count: 6 },
    { name: "Professional Services", count: 7 },
    { name: "Public Sector", count: 4 },
    { name: "Insurance", count: 5 },
    { name: "Energy & Utilities", count: 4 },
    { name: "Education", count: 3 },
    { name: "Hospitality", count: 3 },
  ],

  // 16 — Final CTA
  finalCta: {
    eyebrow: "Ready when you are",
    title: "Stop reconciling systems that should already agree.",
    subtitle: "Book a 45-minute scoping call. We'll map your system landscape, identify the one outcome most worth buying, and give you a fixed-price pilot quote before you commit to anything.",
    primaryCta: { label: "Book a consultation", href: "/contact" },
    secondaryCta: { label: "Browse enterprise services", href: "/marketplace?category=business-enterprise-services" },
    trustSignals: [
      "Certified implementation teams",
      "Fixed-price first phase",
      "Outcome contract, not a retainer",
    ],
  },
};
