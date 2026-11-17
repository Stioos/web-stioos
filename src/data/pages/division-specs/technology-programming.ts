import type { DivisionSpec } from "../division-types";

// ============================================================
// 02 — TECHNOLOGY & PROGRAMMING (cat-tech-programming)
// Accent: sky/blue. Subcategories: web / mobile / software /
// ui-ux / api / ai-engineering-llmops.
// ============================================================

export const TECH_SPEC: DivisionSpec = {
  categoryId: "cat-tech-programming",
  slug: "technology-programming",

  // 01 — Hero
  hero: {
    eyebrow: "Technology & Programming",
    title: "Engineering capacity, on demand —",
    highlight: "senior teams that ship, not slide decks.",
    subtitle:
      "Custom web platforms, mobile applications, SaaS and internal software, UI/UX design, API development and integration, and AI/LLM product engineering — delivered by senior engineering teams who write production code, own outcomes, and stand behind what they ship.",
    primaryCta: { label: "Request a consultation", href: "/contact" },
    secondaryCta: { label: "Browse 42 engineering services", href: "/marketplace?category=technology-programming" },
    stats: [
      { value: "240+", label: "Senior engineers in network" },
      { value: "92%", label: "Engagements delivered on time" },
      { value: "−47%", label: "Avg. time-to-market" },
    ],
  },

  // 02 — Trust bar
  trustBadges: [
    "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "AWS",
    "Docker", "Kubernetes", "GraphQL", "Python", "Tailwind", "Vercel",
  ],

  // 03 — KPI band
  kpis: [
    { value: "92%", label: "Engagements delivered on schedule", trend: "+11pts", spark: [78, 82, 85, 87, 89, 91, 92], icon: "BadgeCheck" },
    { value: "3.2x", label: "Increase in deploy frequency", trend: "+220%", spark: [10, 14, 19, 23, 26, 29, 32], icon: "GitBranch" },
    { value: "−47%", label: "Avg. reduction in time-to-market", trend: "−47%", spark: [88, 79, 71, 64, 58, 53, 47], icon: "Rocket" },
    { value: "$1.8M", label: "Avg. annual cost savings per program", trend: "+$620K", spark: [0.7, 0.9, 1.1, 1.3, 1.5, 1.7, 1.8], icon: "Coins" },
  ],

  // 04 — Pain points
  painPoints: [
    {
      icon: "GitBranch",
      title: "Technical debt is eating your roadmap",
      description: "Every new feature ships slower than the last because the codebase is held together by workarounds. Refactoring never makes the sprint because shipping always does.",
      impact: "−34% velocity",
    },
    {
      icon: "Clock",
      title: "Releases ship in quarters, not weeks",
      description: "A 6-week feature takes 6 months. Manual QA, fragile environments, and a deploy process nobody wants to touch on a Friday keep your best engineers waiting on process instead of shipping.",
      impact: "−47% time-to-market",
    },
    {
      icon: "Wrench",
      title: "The right engineer isn't on the bench",
      description: "You need a senior React engineer who knows Next.js 14, a Postgres specialist, and a DevOps lead — and your recruiter is 90 days out. The gap shows up in every sprint review.",
      impact: "−60 days to hire",
    },
  ],

  // 05 — Solution overview
  solution: {
    eyebrow: "The STIOOS approach",
    title: "One accountable engineering partner for every product you ship",
    body: "We don't hand you a prototype and a Slack channel. STIOOS assembles a senior pod — staff or principal engineers, design, QA, and DevOps — that owns your roadmap item end to end. You get production code in your repo, tests in your CI, deploys in your pipeline, and an outcome contract that says what 'done' means before a line of code is written.",
    capabilities: [
      "Production code in your repo from week two",
      "Senior engineers — staff/principal level, not juniors learning on your dime",
      "CI/CD, tests, observability wired into your stack, not bolted on",
      "TypeScript-first, but polyglot where it matters (Python, Go, Rust)",
      "Fixed-scope sprints with weekly demos and a definition of done",
      "Outcome contract: shipped feature, not billable hours",
    ],
    visual: "dashboard",
  },

  // 06 — Capabilities bento (links to subcategories)
  capabilities: [
    { icon: "Code", title: "Web Design & Development", description: "Next.js, React, and TypeScript platforms built for scale, speed, and SEO.", metric: "9 services", span: "lg", subslug: "web-design-development" },
    { icon: "Smartphone", title: "Mobile Apps Design & Development", description: "React Native and native iOS/Android apps that ship to the stores and stay there.", metric: "8 services", span: "md", subslug: "mobile-apps-design-development" },
    { icon: "Boxes", title: "Software Design & Development", description: "SaaS platforms, internal tools, and bespoke software from architecture to launch.", metric: "8 services", span: "sm", subslug: "software-design-development" },
    { icon: "Palette", title: "UI/UX Design", description: "Research-backed design systems and product UX that convert and retain.", metric: "6 services", span: "sm", subslug: "ui-ux-design" },
    { icon: "Plug", title: "API Development", description: "REST and GraphQL APIs, integrations, and microservices architecture done right.", metric: "6 services", span: "md", subslug: "api-development" },
    { icon: "BrainCircuit", title: "AI Engineering & LLMOps", description: "LLM product engineering, RAG pipelines, and inference infra shipped to production.", metric: "5 services", span: "sm", subslug: "ai-engineering-llmops" },
  ],

  // 07 — Process timeline
  process: {
    title: "Delivery methodology",
    subtitle: "A repeatable five-phase path from scoping to a production release your team can operate confidently — with code in your repo from week two.",
    phases: [
      { phase: "01", title: "Discover & scope", description: "We map the product surface, tech stack, and acceptance criteria the team will own.", duration: "Week 1", deliverables: ["Technical spec", "Architecture review", "Definition of done"] },
      { phase: "02", title: "Design & scaffold", description: "UX flows, data models, and the project scaffold wired into your repo and CI.", duration: "Week 2", deliverables: ["Design system", "Repo + CI setup", "Data model"] },
      { phase: "03", title: "Build & integrate", description: "Feature sprints with weekly demos, tests in CI, and continuous review.", duration: "Week 3–8", deliverables: ["Production features", "Test coverage", "Weekly demos"] },
      { phase: "04", title: "Harden & launch", description: "Load testing, security review, observability, and a clean production rollout.", duration: "Week 8–10", deliverables: ["Load test report", "Security review", "Launch runbook"] },
      { phase: "05", title: "Operate & iterate", description: "Post-launch monitoring, handoff docs, and optional ongoing engineering support.", duration: "Ongoing", deliverables: ["Monitoring dashboards", "Handoff docs", "Retainer option"] },
    ],
  },

  // 08 — Tech radar
  techRadar: {
    title: "The stack we ship to production",
    subtitle: "Every technology below is in active production across STIOOS engagements. The radar shows where each sits on the adopt-to-hold spectrum — no résumé-driven choices.",
    rings: [
      { label: "Adopt" },
      { label: "Trial" },
      { label: "Assess" },
      { label: "Hold" },
    ],
    nodes: [
      { name: "Next.js", ring: 0, angle: -70 },
      { name: "TypeScript", ring: 0, angle: -25 },
      { name: "PostgreSQL", ring: 0, angle: 35 },
      { name: "Node.js", ring: 0, angle: 95 },
      { name: "React", ring: 0, angle: 150 },
      { name: "AWS", ring: 1, angle: -130 },
      { name: "GraphQL", ring: 1, angle: -80 },
      { name: "Prisma", ring: 1, angle: 130 },
      { name: "Docker", ring: 1, angle: -45 },
      { name: "Kubernetes", ring: 2, angle: 60 },
      { name: "Go", ring: 2, angle: 20 },
      { name: "Rust", ring: 2, angle: -100 },
      { name: "Bun", ring: 3, angle: 110 },
      { name: "tRPC", ring: 3, angle: -160 },
    ],
  },

  // 09 — Before / after impact
  impact: {
    title: "Quarter-one impact",
    subtitle: "Representative results from STIOOS engineering engagements in the first 90 days of production. Your numbers will vary based on stack maturity and codebase health.",
    metrics: [
      { label: "Deploy frequency (deploys per week)", before: 18, after: 76, beforeLabel: "1.8/wk", afterLabel: "7.6/wk", unit: "deploys" },
      { label: "Lead time for changes (hours)", before: 88, after: 16, beforeLabel: "88 hrs", afterLabel: "16 hrs", unit: "hrs" },
      { label: "Time-to-market for new features", before: 78, after: 38, beforeLabel: "Baseline", afterLabel: "−47%", unit: "%" },
      { label: "Production defect escape rate", before: 42, after: 11, beforeLabel: "4.2%", afterLabel: "1.1%", unit: "%" },
    ],
  },

  // 10 — Spotlight services
  spotlightServices: [
    { name: "Next.js SaaS Platform Build", tagline: "Full-stack SaaS scaffold — auth, billing, multi-tenant data, and admin — shipped in 8 weeks.", tags: ["Next.js", "TypeScript", "PostgreSQL"], metric: { value: "8 wks", label: "to MVP" }, href: "/marketplace?category=technology-programming" },
    { name: "React Native Mobile App", tagline: "Cross-platform iOS/Android app with offline sync, push, and store submission handled.", tags: ["React Native", "Expo", "GraphQL"], metric: { value: "4.8★", label: "store rating" }, href: "/marketplace?category=technology-programming" },
    { name: "Microservices API Architecture", tagline: "REST and GraphQL API layer with auth, rate limiting, observability, and zero-downtime rollout.", tags: ["Node.js", "GraphQL", "Kubernetes"], metric: { value: "99.95%", label: "uptime" }, href: "/marketplace?category=technology-programming" },
  ],

  // 11 — Outcomes gauges
  outcomes: {
    central: { value: 93, label: "Overall delivery quality score", caption: "Across 480+ shipped features" },
    gauges: [
      { value: 92, label: "On-time delivery rate" },
      { value: 88, label: "Test coverage at launch" },
      { value: 95, label: "Production stability" },
      { value: 81, label: "Cost vs. in-house build" },
    ],
  },

  // 12 — Case study
  caseStudy: {
    industry: "FinTech · Series B platform",
    title: "How a FinTech rebuilt its core platform in 14 weeks and cut deploy time 87%",
    challenge: "A Series B FinTech was shipping a major release every 11 weeks off a 7-year-old Rails monolith. Lead time for changes sat at 96 hours, a single deploy took the platform down twice a quarter, and the team had stopped accepting new product requests because the queue was 14 months deep.",
    solution: "STIOOS deployed a six-engineer pod — two staff engineers, a senior Next.js lead, a Postgres specialist, a DevOps lead, and a product designer — to rebuild the core platform on Next.js, TypeScript, and PostgreSQL behind a GraphQL API, deployed to AWS via Docker and Kubernetes. Legacy data was migrated incrementally behind feature flags, so customers never saw a cutover.",
    results: [
      { value: "−87%", label: "Reduction in deploy time" },
      { value: "3.4x", label: "Increase in release frequency" },
      { value: "$1.8M", label: "Annualized infra + labor savings" },
    ],
    quote: "We went from 'maybe by Q3' to shipping every Tuesday. The STIOOS pod wrote code we still own and still understand — that's the part that actually mattered.",
    author: "VP of Engineering",
    role: "Series B FinTech",
  },

  // 13 — Comparison table
  comparison: {
    title: "Why teams choose STIOOS",
    subtitle: "How STIOOS engineering engagements compare to the alternatives teams typically evaluate when they need to ship software.",
    columns: ["In-house hire", "Dev agency", "Freelancer", "STIOOS"],
    rows: [
      { criterion: "Senior engineers (staff/principal level)", values: ["partial", "partial", "no", "yes"] },
      { criterion: "Code in your repo from week two", values: ["partial", "partial", "no", "yes"] },
      { criterion: "CI/CD, tests, observability wired in", values: ["partial", "partial", "no", "yes"] },
      { criterion: "Outcome contract (feature shipped, not hours)", values: ["no", "no", "no", "yes"] },
      { criterion: "Pod scales up/down with roadmap", values: ["no", "partial", "no", "yes"] },
      { criterion: "Fixed-price first sprint before you commit", values: ["no", "no", "no", "yes"] },
    ],
  },

  // 14 — Pricing tiers
  pricing: {
    title: "Engagement models",
    subtitle: "Three ways to engage, all with a transparent scope and a measurable outcome. No vague retainers, no billable-hour surprises.",
    tiers: [
      {
        name: "Launch", price: "$18K", period: "sprint", description: "One feature, one team, shipped to production.",
        features: ["2 senior engineers + design", "1 feature shipped to production", "Tests + CI/CD wired in", "4-week fixed scope", "Launch runbook + handoff"],
        popular: false, cta: "Start a Launch sprint",
      },
      {
        name: "Growth", price: "$14K", period: "month", description: "A dedicated engineering pod that ships every sprint.",
        features: ["4–6 engineer pod", "Weekly sprints + demos", "Unlimited roadmap items in queue", "DevOps + QA included", "Monthly architecture review", "SLA: 99.9% uptime"],
        popular: true, cta: "Start a Growth pod",
      },
      {
        name: "Enterprise", price: "Custom", period: "program", description: "Multi-pod engineering programs for platform-scale builds.",
        features: ["Multiple pods + tech lead", "SSO, SOC 2, audit compliance", "Dedicated staff engineer", "Custom SLAs + on-call", "Quarterly roadmap planning", "SLA: 99.95% uptime"],
        popular: false, cta: "Talk to sales",
      },
    ],
  },

  // 15 — Industries cloud
  industries: [
    { name: "SaaS & Technology", count: 11 },
    { name: "FinTech", count: 8 },
    { name: "HealthTech", count: 6 },
    { name: "E-Commerce & Retail", count: 9 },
    { name: "EdTech", count: 4 },
    { name: "Logistics & Supply Chain", count: 5 },
    { name: "Media & Publishing", count: 4 },
    { name: "Real Estate / PropTech", count: 3 },
    { name: "Manufacturing", count: 4 },
    { name: "Telecom", count: 3 },
    { name: "Insurance / InsurTech", count: 4 },
    { name: "Government & Public Sector", count: 2 },
  ],

  // 16 — Final CTA
  finalCta: {
    eyebrow: "Ready when you are",
    title: "Stop shipping in quarters. Start shipping in weeks.",
    subtitle: "Book a 30-minute scoping call. We'll review one roadmap item, show you the pod that would build it, and give you a fixed-price first sprint before you commit to anything.",
    primaryCta: { label: "Book a consultation", href: "/contact" },
    secondaryCta: { label: "Browse engineering services", href: "/marketplace?category=technology-programming" },
    trustSignals: [
      "No vague retainers",
      "Fixed-price first sprint",
      "Code in your repo from week two",
    ],
  },
};
