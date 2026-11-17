import type { SolutionSpec } from "../solution-types";

// ============================================================
// SOLUTION LANDING — SOFTWARE AS A SERVICE / MANAGED SOFTWARE
// Accent: sky. Engagement model: Monthly managed service.
//
// Outcome bundle that turns product roadmaps into shipped
// software — combining product engineering, platform/devops,
// design/UX, QA/observability, and product management under
// one accountable managed retainer. Built for CTOs, CIOs,
// founders, and product leaders who want senior engineering
// without the hiring overhead.
// ============================================================

export const SOFTWARE_SAAS_SPEC: SolutionSpec = {
  slug: "software-as-a-service",
  name: "Software as a Service / Managed Software",
  icon: "Code",
  engagementModel: "Monthly managed service",
  accent: {
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    tile: "bg-sky-400/10 ring-sky-400/25",
    icon: "text-sky-400",
    dot: "bg-sky-400",
    chip: "bg-sky-400/10 text-sky-200 ring-sky-400/25",
    eyebrow: "text-sky-400",
    glow: "rgba(56,189,248,0.20)",
  },

  // 01 — Hero
  hero: {
    eyebrow: "Software as a Service / Managed Software",
    title: "Ship software like a product company —",
    highlight: "without hiring an engineering team.",
    subtitle:
      "One retainer. One senior engineering pod. We design, build, deploy, and continuously improve your web platforms, mobile apps, APIs, and internal systems — with SLAs on delivery, uptime, and incident response baked into the engagement.",
    primaryCta: { label: "Book a solution review", href: "/contact" },
    secondaryCta: { label: "See shipped work", href: "#case-studies" },
    metrics: [
      { value: "−47%", label: "Avg. time-to-market" },
      { value: "3.4x", label: "Release frequency lift" },
      { value: "92%", label: "On-time delivery rate" },
    ],
    architectureLayers: [
      { name: "Product Engineering", icon: "Code", components: ["Next.js", "React", "TypeScript", "Node.js", "Go", "Python"] },
      { name: "Platform & DevOps", icon: "ServerCog", components: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"] },
      { name: "Design & UX", icon: "Palette", components: ["Figma", "Design System", "Accessibility", "Motion"] },
      { name: "QA & Observability", icon: "ScanEye", components: ["Playwright", "Vitest", "Sentry", "Datadog"] },
      { name: "Product Management", icon: "Compass", components: ["Discovery", "Roadmap", "Sprints", "OKRs"] },
    ],
  },

  // 02 — Outcome promise band
  outcomePromise: {
    promise: "We don't sell hours. We ship software — backed by a senior engineering pod, SLAs on delivery and uptime, and continuous improvement baked into every retainer.",
    stats: [
      { value: "92%", label: "On-time delivery rate", sublabel: "vs. 47% industry average" },
      { value: "3.4x", label: "Release frequency lift", sublabel: "within first 90 days" },
      { value: "−68%", label: "Production incidents", sublabel: "after platform hardening" },
    ],
  },

  // 03 — Problem / solution split
  problemSolution: {
    title: "The delivery gap",
    subtitle: "Why most software projects miss deadlines, balloon budgets, and drift the moment they ship",
    problems: [
      { icon: "Clock", text: "Hiring senior engineers takes 90+ days — and you ship nothing while you wait, interview, and onboard." },
      { icon: "TrendingDown", text: "Software projects balloon: scope creep, missed sprints, mysterious vendor invoices, and a roadmap that's always two weeks away." },
      { icon: "RefreshCw", text: "Your app drifts the day it ships — bugs, dependency upgrades, security patches, and infra cost creep pile up with no owner." },
      { icon: "X", text: "The dev shop that built it is gone; nobody on your team understands the codebase, the deploy pipeline, or the data model." },
      { icon: "Shield", text: "Every sprint tells the same story: 'almost done, one more thing, two more weeks' — with no accountability for the shipped outcome." },
    ],
    solutions: [
      { icon: "Users", text: "One senior engineering pod, retained and dedicated to your codebase — no ramp-up, no turnover, no surprise departures." },
      { icon: "BadgeCheck", text: "Fixed monthly retainer with SLAs on delivery, uptime, and incident response — you know the cost and the cadence upfront." },
      { icon: "RefreshCw", text: "Continuous improvement built in: every sprint ships features AND pays down tech debt, dependency upgrades, and security patches." },
      { icon: "KeyRound", text: "You own all code, repos, infra, and IP from day one — we're embedded in your GitHub and AWS, not a black-box vendor." },
      { icon: "ListChecks", text: "Roadmaps run on quarterly OKRs with weekly demos, shipped milestones, and a definition of done that actually means done." },
    ],
  },

  // 04 — Service architecture
  architecture: {
    title: "Solution architecture",
    subtitle: "Five connected layers that turn a roadmap into shipped software. Every layer is staffed, instrumented, and owned by one accountable engineering pod.",
    layers: [
      { name: "Product Engineering", icon: "Code", components: ["Next.js / React", "TypeScript", "Node.js", "Python", "Go", "GraphQL"] },
      { name: "Platform & DevOps", icon: "ServerCog", components: ["AWS / GCP", "Docker", "Kubernetes", "Terraform", "GitHub Actions"] },
      { name: "Design & UX", icon: "Palette", components: ["Figma Design System", "Accessibility (WCAG)", "Motion", "Prototyping"] },
      { name: "QA & Observability", icon: "ScanEye", components: ["Playwright E2E", "Unit & Integration Tests", "Sentry Errors", "Datadog / Grafana"] },
      { name: "Product Management", icon: "Compass", components: ["User Discovery", "Roadmap & OKRs", "Sprint Planning", "Weekly Demos"] },
    ],
  },

  // 05 — Capabilities accordion
  capabilities: {
    title: "Capability breakdown",
    subtitle: "Six capabilities bundled into one managed engagement",
    items: [
      { icon: "Globe", title: "Web Platform Engineering", description: "Next.js + React + TypeScript platforms built with server components, edge runtime, and SEO baked in — deployed on Vercel or AWS with autoscaling.", stat: { value: "−47%", label: "Avg. time-to-market" } },
      { icon: "Smartphone", title: "Mobile App Development", description: "React Native / Expo and Flutter apps for iOS and Android — one codebase, native performance, OTA updates, App Store and Play Store submission handled.", stat: { value: "4.8★", label: "Avg. app store rating" } },
      { icon: "Workflow", title: "API & Integrations", description: "GraphQL and REST APIs with typed schemas (tRPC, Zod, OpenAPI), webhook orchestration, and integrations to Salesforce, HubSpot, Stripe, Slack, and 200+ systems.", stat: { value: "99.95%", label: "API uptime SLA" } },
      { icon: "Palette", title: "UI/UX Design & Design Systems", description: "Figma design systems with tokens, accessible components (Radix, shadcn/ui), and motion — shipped as a living Storybook consumed by engineering.", stat: { value: "+34%", label: "Conversion from UX redesign" } },
      { icon: "BrainCircuit", title: "AI / LLM Engineering", description: "RAG pipelines, agents, and copilots on OpenAI, Anthropic, and open models — with vector search (Pinecone, pgvector), evals, and guardrails in production.", stat: { value: "11", label: "Production AI features shipped/mo" } },
      { icon: "ServerCog", title: "Platform Ops & SRE", description: "CI/CD pipelines, IaC with Terraform, Kubernetes autoscaling, observability with Datadog/Sentry, and on-call with a 15-minute incident response SLA.", stat: { value: "−68%", label: "Production incidents" } },
    ],
  },

  // 06 — Engagement journey
  journey: {
    title: "Engagement journey",
    subtitle: "From kickoff to continuously-shipping product team in 90 days",
    milestones: [
      { phase: "01", title: "Discovery & technical scoping", description: "We audit your codebase, infra, and roadmap — interview stakeholders, and produce a technical spec with architecture, milestones, and risk register.", duration: "Week 1–2", outcome: "Signed technical spec + architecture diagram" },
      { phase: "02", title: "Architecture & foundation", description: "Repo structure, CI/CD pipeline, IaC, observability, design system, and database schema stood up on your cloud account — production-ready skeleton.", duration: "Week 2–5", outcome: "Production-grade foundation live in your AWS/GCP" },
      { phase: "03", title: "Build & integrate", description: "Sprint cadence begins: two-week sprints with demos, feature flags, and shipped code to staging weekly. APIs, integrations, and core features land.", duration: "Week 5–10", outcome: "MVP feature set shipped behind feature flags" },
      { phase: "04", title: "Launch & harden", description: "Production launch with load testing, security review, on-call rotation, and incident runbooks. Uptime SLA and monitoring go live.", duration: "Week 10–12", outcome: "Production launch with 99.9% uptime SLA" },
      { phase: "05", title: "Continuous improvement", description: "Always-on sprints: new features, tech debt paydown, dependency upgrades, performance budgets, and quarterly roadmap reviews with your leadership.", duration: "Ongoing", outcome: "3.4x release frequency at steady state" },
    ],
  },

  // 07 — ROI calculator
  roi: {
    title: "ROI model",
    subtitle: "What a typical Managed Software engagement looks like financially",
    inputs: [
      { label: "Monthly managed retainer", value: "$28K" },
      { label: "Internal team time saved", value: "200 hrs/mo" },
      { label: "Avoided hiring (6 senior eng)", value: "$1.1M/yr" },
      { label: "Engagement length", value: "12 months" },
    ],
    outputs: [
      { label: "Time-to-market reduction", value: "−47", unit: "%" },
      { label: "Release frequency", value: "3.4", unit: "x" },
      { label: "Production incidents", value: "−68", unit: "%" },
      { label: "Annual cost savings", value: "$1.8", unit: "M" },
    ],
    investment: "$336K",
    return: "$1.8M",
  },

  // 08 — Stack & integrations grid
  stack: {
    title: "The stack we build on",
    subtitle: "Modern, typed, and portable — your codebase runs anywhere and is owned by you",
    categories: [
      { name: "Frontend", tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vite", "shadcn/ui"] },
      { name: "Backend", tools: ["Node.js", "Python", "Go", "GraphQL", "tRPC", "Prisma"] },
      { name: "Database & Cache", tools: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "PlanetScale", "Drizzle"] },
      { name: "Cloud & DevOps", tools: ["AWS", "Docker", "Kubernetes", "Terraform", "Vercel", "GitHub Actions"] },
      { name: "Mobile", tools: ["React Native", "Expo", "Flutter", "Swift", "Kotlin", "EAS Build"] },
      { name: "AI / LLM", tools: ["OpenAI", "Anthropic", "LangChain", "Pinecone", "pgvector", "Hugging Face"] },
      { name: "Observability", tools: ["Sentry", "Datadog", "Grafana", "New Relic", "OpenTelemetry", "LogRocket"] },
      { name: "QA & Testing", tools: ["Playwright", "Vitest", "Jest", "Cypress", "Storybook", "k6"] },
      { name: "Design & UX", tools: ["Figma", "Storybook", "Framer Motion", "Radix UI", "shadcn/ui", "Tailwind"] },
      { name: "Integrations", tools: ["Stripe", "Salesforce", "HubSpot", "Slack", "Twilio", "Segment"] },
    ],
  },

  // 09 — Metric comparison cards
  metricComparison: {
    title: "Metric comparison",
    subtitle: "How STIOOS Managed Software compares to industry averages and your realistic potential",
    metrics: [
      { label: "On-time delivery rate", industry: 47, stioos: 92, potential: 95, unit: "%" },
      { label: "Releases per month", industry: 3, stioos: 11, potential: 14, unit: "rls" },
      { label: "Production incidents / quarter", industry: 18, stioos: 6, potential: 3, unit: "inc" },
      { label: "Time-to-market (weeks)", industry: 24, stioos: 13, potential: 10, unit: "wk" },
    ],
  },

  // 10 — Case studies carousel
  caseStudies: {
    title: "Case studies",
    subtitle: "Managed Software engagements that shipped measurable product outcomes",
    studies: [
      { industry: "B2B SaaS · Series B", title: "SaaS platform rebuilt on Next.js — shipped MVP in 11 weeks", result: { value: "−47%", label: "time-to-market" }, quote: "We replaced a stalled 18-month rebuild with a senior pod that shipped an MVP in 11 weeks. They owned the architecture, the deploy, and the on-call." },
      { industry: "DTC · $30M GMV", title: "Mobile app launched in 90 days on React Native + Expo", result: { value: "4.8★", label: "App Store rating" }, quote: "From idea to App Store in 90 days. OTA updates mean we ship daily without re-review. Our old vendor quoted 9 months." },
      { industry: "Logistics · Enterprise", title: "Legacy ERP modernized to event-driven Go microservices", result: { value: "−68%", label: "production incidents" }, quote: "They untangled a 12-year-old monolith into Go services on Kubernetes. Incidents dropped 68% in the first quarter after launch." },
      { industry: "FinTech · Series C", title: "Internal CRM + workflow platform built on Next.js + Postgres", result: { value: "$1.8M", label: "annual cost savings" }, quote: "We retired three SaaS subscriptions and a Salesforce customization bill. The platform paid for itself in seven months." },
    ],
  },

  // 11 — Outcome scorecard
  scorecard: {
    title: "Outcome scorecard",
    subtitle: "The composite delivery health of a Managed Software engagement at steady state",
    donut: { value: 96, label: "Delivery health" },
    bars: [
      { label: "Sprint velocity", value: 94 },
      { label: "Code quality (coverage)", value: 91 },
      { label: "Production uptime", value: 99 },
      { label: "Incident response", value: 93 },
      { label: "Feature throughput", value: 88 },
    ],
    trend: { label: "Features shipped per sprint — last 7 sprints", points: [6, 8, 11, 13, 15, 17, 19] },
    kpis: [
      { value: "−47%", label: "Time-to-market" },
      { value: "3.4x", label: "Release frequency" },
      { value: "−68%", label: "Production incidents" },
    ],
  },

  // 12 — Testimonial wall
  testimonials: {
    title: "What clients say",
    subtitle: "CTOs, CIOs, and product leaders who put their roadmap on STIOOS",
    testimonials: [
      { quote: "We replaced a stalled 18-month rebuild with a senior pod that shipped in 11 weeks. They owned the architecture, the deploy pipeline, and the on-call rotation. I finally stopped apologizing to the board.", name: "Sarah Chen", role: "CTO", company: "B2B SaaS, Series B", rating: 5 },
      { quote: "One retainer, one team, one Slack channel. No more juggling three dev shops and a freelancer. The weekly demos keep my whole leadership team aligned on what actually shipped.", name: "Marcus Reid", role: "VP Product", company: "FinTech, Series C", rating: 5 },
      { quote: "They untangled a 12-year-old monolith into Go microservices without a single day of downtime. The codebase is finally something my own engineers can read and extend.", name: "Priya Nair", role: "VP Engineering", company: "Logistics, Enterprise", rating: 5 },
      { quote: "We went from idea to App Store in 90 days. OTA updates mean we ship daily without re-review. Our previous vendor quoted nine months for the same scope.", name: "James Okafor", role: "Founder & CEO", company: "DTC, $30M GMV", rating: 5 },
      { quote: "The SLA on delivery and uptime is what sold me. For the first time, a software partner put skin in the game on the outcome — not just the hours.", name: "Elena Volkov", role: "CIO", company: "HealthTech, Series A", rating: 5 },
      { quote: "We own the repos, the AWS account, and the design files. If we ever leave — and we won't — the codebase comes with us. That was non-negotiable for our board.", name: "David Park", role: "CTO", company: "Marketplace, Series B", rating: 5 },
    ],
  },

  // 13 — Vs alternatives
  vsAlternatives: {
    title: "Vs the alternatives",
    subtitle: "How Managed Software as a Service compares to in-house, dev shop, and freelancer models",
    alternatives: ["In-house team", "Dev shop", "Freelancer"],
    criteria: [
      { label: "Seniority of engineers", scores: [70, 55, 40, 92] },
      { label: "Accountability for delivery", scores: [60, 45, 25, 95] },
      { label: "Team continuity & retention", scores: [65, 30, 15, 90] },
      { label: "CI/CD & DevOps maturity", scores: [55, 50, 20, 95] },
      { label: "Observability & on-call", scores: [50, 35, 10, 92] },
      { label: "Speed to first release", scores: [40, 55, 60, 90] },
      { label: "IP & code ownership", scores: [85, 60, 70, 99] },
    ],
  },

  // 14 — Engagement tabs
  engagement: {
    title: "Engagement models",
    subtitle: "Three ways to engage — all with SLAs on delivery and uptime",
    tabs: [
      { name: "Build", price: "$18K", period: "mo", description: "Single product or module build with a focused 3-person pod. Ideal for MVP, rebuild, or feature sprint.", features: ["3-person senior pod", "Next.js / React / TypeScript", "CI/CD + staging environment", "Weekly demos", "Sentry error monitoring", "90-day fixed scope"], popular: false },
      { name: "Managed Product", price: "$28K", period: "mo", description: "Full managed engineering pod owning your product end-to-end — features, platform, QA, design, and PM under one retainer.", features: ["5-person senior pod", "Web + API + mobile capability", "Design system + UX", "Platform ops + on-call SLA", "QA automation + observability", "Product management + OKRs", "99.9% uptime SLA"], popular: true },
      { name: "Platform", price: "Custom", period: "program", description: "Multi-product or multi-team program with dedicated squads, shared platform, and quarterly roadmap at executive level.", features: ["Multiple dedicated squads", "Shared platform engineering", "Cross-product design system", "Dedicated SRE + security", "Quarterly roadmap reviews", "Executive reporting + SLAs", "24/7 on-call rotation"], popular: false },
    ],
  },

  // 15 — Industries strip
  industries: {
    title: "Industries we build for",
    subtitle: "Managed Software engagements shipped across these verticals",
    industries: [
      { name: "B2B SaaS", icon: "Boxes", count: 22 },
      { name: "FinTech", icon: "Coins", count: 14 },
      { name: "HealthTech", icon: "HeartHandshake", count: 11 },
      { name: "E-Commerce", icon: "ShoppingCart", count: 18 },
      { name: "Logistics", icon: "Workflow", count: 9 },
      { name: "Marketplaces", icon: "Network", count: 8 },
      { name: "Real Estate", icon: "Building2", count: 7 },
      { name: "Education", icon: "GraduationCap", count: 6 },
    ],
  },

  // 16 — CTA + FAQ
  ctaFaq: {
    cta: {
      eyebrow: "Ready to ship",
      title: "Put your roadmap on a senior engineering pod.",
      subtitle: "Book a 45-minute solution review. We'll audit your codebase, architecture, and roadmap — and come back with a fixed monthly retainer, a 90-day milestone plan, and SLAs on delivery and uptime.",
      primaryCta: { label: "Book a solution review", href: "/contact" },
      secondaryCta: { label: "Browse engineering services", href: "/marketplace?category=software-engineering" },
    },
    faqs: [
      { q: "Who owns the code, repos, and infrastructure?", a: "You do — from day one. All code lives in your GitHub organization, all infrastructure runs in your AWS/GCP/Vercel account, and all design files sit in your Figma workspace. We're embedded in your accounts as collaborators, never a black-box vendor. If you ever leave, everything comes with you." },
      { q: "How is the engineering team structured?", a: "A typical Managed Product pod is five senior engineers: a tech lead, two product engineers, a platform/DevOps engineer, and a designer — supported by a product manager and shared QA. We staff senior engineers (8+ years) by default; you can review team bios before kickoff and request changes anytime." },
      { q: "Can I scale the team up or down?", a: "Yes. The retainer is monthly, so you can scale the pod up (add engineers, add a mobile track, add an AI track) or down (move to Build tier, pause a track) with 30 days' notice. Most clients scale up over the first two quarters as the roadmap compounds, then stabilize." },
      { q: "What if I want to bring engineering in-house later?", a: "We design every engagement for that outcome. We document architecture decisions (ADRs), maintain runbooks, pair-program with your hires when you bring them on, and offer a 60-day transition program at the end of any engagement. Several clients have graduated to fully in-house teams — we consider that a success." },
      { q: "What tech stack do you use — can I choose?", a: "We default to a modern TypeScript stack (Next.js, React, Node.js, PostgreSQL, Prisma, AWS/Vercel) because it's portable, well-staffed, and battle-tested. For mobile we use React Native/Expo or Flutter. If you have an existing stack (Python, Go, Java, .NET, Ruby), we work in it — we don't force a rewrite unless you ask for one." },
      { q: "How fast can we start shipping?", a: "Kickoff is typically 1–2 weeks after a signed engagement. Foundation (repo, CI/CD, IaC, observability, design system) is live by week 3, first feature ships to staging by week 4, and most clients have an MVP or major release in production by week 10–12. The 3.4x release frequency figure is steady-state after 90 days." },
      { q: "What are the SLAs exactly?", a: "Managed Product and Platform tiers include a 99.9% production uptime SLA, a 15-minute incident response time during business hours (30 minutes off-hours), a weekly demo cadence, and a sprint commitment on planned scope. Build tier ships on a 90-day fixed scope. Full SLA terms are in the master services agreement." },
      { q: "Do you handle security and compliance?", a: "Yes. Every engagement ships with OWASP-aware code review, dependency scanning (Snyk/Dependabot), secrets management, and IaC security baselines. For SOC 2, HIPAA, PCI, or ISO 27001 environments, we add dedicated compliance engineering and partner with your auditor. Several pods ship inside HIPAA and SOC 2 environments today." },
    ],
  },
};
