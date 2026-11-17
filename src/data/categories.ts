import type { Category, Subcategory } from "@/types";

// ============================================================
// MARKETPLACE CATEGORY ARCHITECTURE — 7 divisions: the 6 spec
// divisions (01–06) × 6 subcategories each at baseline AI 45 /
// Tech 45 / Cloud 45 / Marketing 45 / Business 40 / Multimedia 40
// = 260 purchasable services, PLUS Talent Solutions (division 07,
// 45 services) kept as the 7th catalog division → 305 total.
// Subcategory slugs are stable SEO URLs — do not rename lightly.
// ============================================================

export const CATEGORIES: Category[] = [
  // 01 — AI AUTOMATION & AGENTIC SOLUTIONS
  {
    id: "cat-ai-agents",
    name: "AI Automation & Agentic Solutions",
    slug: "ai-agents",
    icon: "Bot",
    tagline: "Autonomous digital workers for every function",
    description:
      "Design, build, and operate custom AI agents — customer support agents, AI SDRs, conversational and voice agents, agentic process automation, and governed enterprise agent fleets integrated across your stack.",
    status: "active",
    featured: true,
    createdAt: "2024-01-12",
  },
  // 02 — TECHNOLOGY & PROGRAMMING
  {
    id: "cat-tech-programming",
    name: "Technology & Programming",
    slug: "technology-programming",
    icon: "Code2",
    tagline: "Engineering capacity, on demand",
    description:
      "Custom web platforms, mobile applications, SaaS and internal software, UI/UX design, API development and integration, and AI/LLM product engineering delivered by senior engineering teams.",
    status: "active",
    featured: true,
    createdAt: "2024-01-15",
  },
  // 03 — CLOUD DEVOPS & MLOPS
  {
    id: "cat-cloud-devops-mlops",
    name: "Cloud DevOps & MLOps",
    slug: "cloud-devops-mlops",
    icon: "Cloud",
    tagline: "Resilient, cost-aware platforms that ship faster",
    description:
      "Cloud migration and modernization, Kubernetes and container platforms, DevOps automation and CI/CD, MLOps and AI infrastructure, FinOps cost optimization, and cloud security & DevSecOps delivered by certified platform engineers.",
    status: "active",
    featured: true,
    createdAt: "2024-03-28",
  },
  // 04 — DIGITAL SALES & MARKETING
  {
    id: "cat-digital-sales-marketing",
    name: "Digital Sales & Marketing",
    slug: "digital-sales-marketing",
    icon: "Target",
    tagline: "AI-driven growth engines",
    description:
      "SEO and answer-engine optimization, AI-optimized paid media, social media marketing, AI SDR outbound engines, lifecycle email and SMS, and conversion rate optimization engineered around measurable pipeline outcomes.",
    status: "active",
    featured: true,
    createdAt: "2024-02-10",
  },
  // 05 — BUSINESS & ENTERPRISE SERVICES
  {
    id: "cat-business-enterprise",
    name: "Business & Enterprise Services",
    slug: "business-enterprise-services",
    icon: "Building2",
    tagline: "Operational excellence for complex organizations",
    description:
      "CRM and ERP implementation, business intelligence and data analytics, cybersecurity and compliance programs, financial management, and customer experience programs delivered end-to-end.",
    status: "active",
    featured: true,
    createdAt: "2024-02-18",
  },
  // 06 — MULTIMEDIA AI & GRAPHICS
  {
    id: "cat-multimedia-ai",
    name: "Multimedia AI & Graphics",
    slug: "multimedia-ai-graphics",
    icon: "Clapperboard",
    tagline: "AI-crafted video, image & audio at scale",
    description:
      "Generative video, AI image and ad-creative production, motion graphics, synthetic voice and audio, and 3D or immersive content — engineered for brand-safe, rights-cleared commercial use.",
    status: "active",
    featured: true,
    createdAt: "2024-03-20",
  },
  // 07 — TALENT SOLUTIONS (7th catalog division — retained)
  {
    id: "cat-talent-solutions",
    name: "Talent Solutions",
    slug: "talent-solutions",
    icon: "Users",
    tagline: "Hire, train & manage world-class talent",
    description:
      "Train-to-hire and corporate training programs, AI-powered talent sourcing and recruitment, flexible staffing and deployment, end-to-end workforce management, AI talent assessment and placement, and HR technology & AI automation — backed by a 2M+ assessed talent pool.",
    status: "active",
    featured: true,
    createdAt: "2024-04-05",
  },
];

const sub = (
  id: string,
  name: string,
  categoryId: string,
  description: string,
  createdAt: string
): Subcategory => ({
  id,
  name,
  slug: name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  categoryId,
  description,
  status: "active",
  createdAt,
});

export const SUBCATEGORIES: Subcategory[] = [
  // ── AI Automation & Agentic Solutions — 6 subs (absorbs workflow/RPA
  //    automation + AI governance demand under the agentic umbrella) ──
  sub("sub-agents-custom", "Custom AI Agents", "cat-ai-agents", "Purpose-built agents tailored to your operations.", "2024-01-12"),
  sub("sub-agents-support", "Customer Support Agents", "cat-ai-agents", "24/7 support agents that resolve, escalate, and learn.", "2024-01-12"),
  sub("sub-agents-sales", "Sales AI Agents", "cat-ai-agents", "Qualification, follow-up, and pipeline acceleration agents.", "2024-01-13"),
  sub("sub-agents-conversational", "Conversational AI Agents", "cat-ai-agents", "Natural-language agents for web, app, and messaging.", "2024-01-12"),
  sub("sub-agents-process", "Process Automation Agents", "cat-ai-agents", "Agents that execute multi-step business processes.", "2024-01-14"),
  sub("sub-agents-enterprise", "Enterprise AI Agents", "cat-ai-agents", "Governed, secure agent fleets for enterprise scale.", "2024-01-15"),

  // ── Technology & Programming — 6 subs (UI/UX moves in from the retired
  //    Branding division; integrations fold under API Development) ──
  sub("sub-tech-web", "Web Design & Development", "cat-tech-programming", "High-performance websites and web platforms.", "2024-01-16"),
  sub("sub-tech-mobile", "Mobile Apps Design & Development", "cat-tech-programming", "iOS and Android applications built to perform.", "2024-01-17"),
  sub("sub-tech-software", "Software Design & Development", "cat-tech-programming", "Custom software products and internal systems.", "2024-01-16"),
  sub("sub-brand-uiux", "UI/UX Design", "cat-tech-programming", "Research-driven product and interface design.", "2024-03-09"),
  sub("sub-tech-api", "API Development", "cat-tech-programming", "API strategy, development, and lifecycle management.", "2024-01-17"),
  sub("sub-tech-llmops", "AI Engineering & LLMOps", "cat-tech-programming", "LLM app engineering, evaluation, and production operations.", "2025-11-21"),

  // ── Digital Sales & Marketing — 6 subs (new Social Media Marketing sub;
  //    SEO sub covers content; ABM folds under AI SDR / paid) ──
  sub("sub-dsm-seo", "SEO & Answer Engine Optimization", "cat-digital-sales-marketing", "Search and AI-answer visibility programs (SEO + GEO/AEO).", "2025-11-21"),
  sub("sub-dsm-paid", "Paid Media & PPC Management", "cat-digital-sales-marketing", "AI-optimized paid search, social, and shopping campaigns.", "2025-11-21"),
  sub("sub-dsm-social", "Social Media Marketing", "cat-digital-sales-marketing", "Always-on social management and growth across every channel.", "2025-11-21"),
  sub("sub-dsm-aisdr", "AI SDR & Outbound Sales", "cat-digital-sales-marketing", "AI sales development reps and outbound pipeline engines.", "2025-11-21"),
  sub("sub-dsm-lifecycle", "Lifecycle Email & SMS Marketing", "cat-digital-sales-marketing", "Automated lifecycle, retention, and revenue email/SMS programs.", "2025-11-21"),
  sub("sub-dsm-cro", "Conversion Rate Optimization", "cat-digital-sales-marketing", "A/B testing and conversion lift programs for web and funnels.", "2025-11-21"),

  // ── Business & Enterprise Services — 6 subs (absorbs Data & BI as a
  //    subcategory plus Financial Management from the retired Startup
  //    division; compliance folds under Security & Risk) ──
  sub("sub-be-crm", "CRM Solutions", "cat-business-enterprise", "CRM selection, implementation, and optimization.", "2024-02-19"),
  sub("sub-be-erp", "ERP Solutions", "cat-business-enterprise", "ERP implementation and integration.", "2024-02-19"),
  sub("sub-be-bi", "Business Intelligence & Data Analytics", "cat-business-enterprise", "Pipelines, warehouses, dashboards, and decision analytics.", "2025-11-21"),
  sub("sub-be-security", "Security & Risk", "cat-business-enterprise", "Security posture, risk, and governance.", "2024-02-20"),
  sub("sub-start-financial", "Financial Management", "cat-business-enterprise", "FP&A, bookkeeping automation, and fractional CFO services.", "2024-03-15"),
  sub("sub-be-cx", "Customer Experience", "cat-business-enterprise", "CX strategy, journeys, and experience management.", "2024-02-18"),

  // ── Cloud DevOps & MLOps — order drives the header mega-panel grid
  //    (column-flow): [Migration, Kubernetes] | [DevOps, MLOps] | [FinOps, Security] ──
  sub("sub-cd-migration", "Cloud Migration & Modernization", "cat-cloud-devops-mlops", "Lift-and-shift, replatforming, and cloud-native re-architecture programs.", "2024-03-28"),
  sub("sub-cd-kubernetes", "Kubernetes & Container Platforms", "cat-cloud-devops-mlops", "Production-grade EKS, GKE, and AKS platforms with GitOps delivery.", "2024-03-28"),
  sub("sub-cd-devops", "DevOps Automation & CI/CD", "cat-cloud-devops-mlops", "Pipelines, infrastructure as code, and platform engineering.", "2024-03-28"),
  sub("sub-cd-mlops", "MLOps & AI Infrastructure", "cat-cloud-devops-mlops", "GPU clusters, ML pipelines, and LLM serving platforms.", "2024-03-29"),
  sub("sub-cd-finops", "FinOps & Cost Optimization", "cat-cloud-devops-mlops", "Cloud cost visibility, rightsizing, and savings programs.", "2024-03-29"),
  sub("sub-cd-security", "Cloud Security & DevSecOps", "cat-cloud-devops-mlops", "CSPM, zero-trust IAM, and pipeline security automation.", "2024-03-29"),

  // ── Multimedia AI & Graphics — 6 subs ──
  sub("sub-mm-video", "AI Video Generation", "cat-multimedia-ai", "Text-to-video ads, product films, and explainers.", "2024-03-20"),
  sub("sub-mm-image", "AI Image Generation", "cat-multimedia-ai", "Campaign visuals and concept art, rights-cleared.", "2024-03-20"),
  sub("sub-mm-motion", "Motion Graphics & Animation", "cat-multimedia-ai", "Animated explainers, logo stings, and lower-thirds.", "2024-03-20"),
  sub("sub-mm-social", "Social & Ad Creatives", "cat-multimedia-ai", "High-volume, on-brand creative for paid and organic.", "2024-03-20"),
  sub("sub-mm-audio", "AI Audio & Voice", "cat-multimedia-ai", "Synthetic voiceovers, music, and podcast production.", "2024-03-20"),
  sub("sub-mm-3d", "3D & Immersive Content", "cat-multimedia-ai", "3D renders, AR filters, and virtual production assets.", "2024-03-20"),

  // ── Talent Solutions — 6 subs (mirrors the /talent-solutions vertical:
  //    development pillars, workforce solutions, assessment & placement) ──
  sub("sub-tl-training", "Training & Talent Development", "cat-talent-solutions", "Train-to-hire, corporate training, and AI upskilling programs.", "2024-04-05"),
  sub("sub-tl-sourcing", "Talent Sourcing & Recruitment", "cat-talent-solutions", "AI-powered sourcing, RPO, and executive search pipelines.", "2024-04-05"),
  sub("sub-tl-staffing", "Staffing & Flexible Deployment", "cat-talent-solutions", "Contract, contract-to-hire, and dedicated team deployment.", "2024-04-06"),
  sub("sub-tl-workforce", "Workforce Management & Operations", "cat-talent-solutions", "End-to-end workforce programs from hiring to retention.", "2024-04-06"),
  sub("sub-tl-assessment", "Talent Assessment & Placement", "cat-talent-solutions", "AI assessments, testing batteries, and placement matching.", "2024-04-07"),
  sub("sub-tl-hrtech", "HR Technology & AI Automation", "cat-talent-solutions", "ATS, HRIS, AI screening, and people analytics implementations.", "2024-04-07"),
];

export const getCategoryById = (id: string) =>
  CATEGORIES.find((c) => c.id === id);

export const getCategoryBySlug = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const getSubcategoryById = (id: string) =>
  SUBCATEGORIES.find((s) => s.id === id);

export const subcategoriesFor = (categoryId: string) =>
  SUBCATEGORIES.filter((s) => s.categoryId === categoryId);
