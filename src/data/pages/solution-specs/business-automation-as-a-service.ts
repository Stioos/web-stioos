import type { SolutionSpec } from "../solution-types";

// ============================================================
// 02 — BUSINESS AUTOMATION AS A SERVICE
// Accent: violet. Engagement model: Setup + monthly subscription.
//
// Outcome bundle that turns manual, repetitive operations work
// into automated flows — combining AI agents, RPA, integration
// layer, workflow orchestration, and observability under one
// accountable engagement. Buys back labor, compresses cycle
// time, and removes error from the operating cadence.
// ============================================================

export const BUSINESS_AUTOMATION_SPEC: SolutionSpec = {
  slug: "business-automation-as-a-service",
  name: "Business Automation as a Service",
  icon: "Workflow",
  engagementModel: "Setup + monthly subscription",
  accent: {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    tile: "bg-violet-400/10 ring-violet-400/25",
    icon: "text-violet-400",
    dot: "bg-violet-400",
    chip: "bg-violet-400/10 text-violet-200 ring-violet-400/25",
    eyebrow: "text-violet-400",
    glow: "rgba(167,139,250,0.20)",
  },

  // 01 — Hero
  hero: {
    eyebrow: "Business Automation as a Service",
    title: "Take the manual work out of running",
    highlight: "your operating cadence.",
    subtitle:
      "One accountable engagement that combines AI agents, RPA, integration, workflow orchestration, and observability — engineered around three numbers: labor recovered, cycle time compressed, and error rate eliminated.",
    primaryCta: { label: "Book an automation audit", href: "/contact" },
    secondaryCta: { label: "See case studies", href: "#case-studies" },
    metrics: [
      { value: "−62%", label: "Manual effort removed" },
      { value: "4.2x", label: "Faster cycle time" },
      { value: "$1.4M", label: "Labor recovered / yr" },
    ],
    architectureLayers: [
      { name: "Trigger Layer", icon: "Zap", components: ["Webhooks", "Schedules", "Event Bus", "Form Submissions"] },
      { name: "Agent Layer", icon: "Bot", components: ["AI Support Agent", "RPA Bots", "Document Agents", "Decision Agents"] },
      { name: "Integration Layer", icon: "Plug", components: ["API Connectors", "Data Sync", "Webhook Bridges", "ERP/CRM Links"] },
      { name: "Orchestration Layer", icon: "Workflow", components: ["Flow Engine", "Approval Routing", "State Machines", "Retry Logic"] },
      { name: "Observability Layer", icon: "Radar", components: ["Run Monitoring", "Audit Logs", "Error Alerts", "Throughput Dashboards"] },
    ],
  },

  // 02 — Outcome promise band
  outcomePromise: {
    promise: "We don't sell bots or licenses. We sell labor recovered — and we instrument every flow to prove it on a live dashboard.",
    stats: [
      { value: "$1.4M", label: "Avg. annual labor recovered", sublabel: "Across 60+ active automation engagements" },
      { value: "−54%", label: "Error rate on automated processes", sublabel: "vs. manual execution baseline" },
      { value: "4.2x", label: "Median cycle time compression", sublabel: "Invoice, reporting, and approval flows" },
    ],
  },

  // 03 — Problem / solution split
  problemSolution: {
    title: "The automation gap",
    subtitle: "Why most operations work never gets automated — and the cost of leaving it manual",
    problems: [
      { icon: "Clock", text: "Your team spends 30+ hours a week on invoicing, reporting, and data entry that never change — and never get faster." },
      { icon: "X", text: "Support tickets queue up overnight; customers wait until morning for answers a trained agent could resolve in seconds." },
      { icon: "RefreshCw", text: "Salesforce, QuickBooks, Zendesk, and Slack don't talk to each other — so your team manually copies data between them." },
      { icon: "TrendingDown", text: "Every manual step introduces error: wrong invoice, wrong report, wrong approval — and rework eats the margin." },
      { icon: "Wrench", text: "You've bought Zapier, Make, and a Power Automate license — but nobody owns the automation roadmap end-to-end." },
    ],
    solutions: [
      { icon: "Zap", text: "One accountable team owns the labor-recovered number — not 12 disconnected automations maintained by 12 different people." },
      { icon: "Bot", text: "AI support agent resolves 60%+ of Tier-1 tickets instantly, 24/7, with human handoff for the complex 40%." },
      { icon: "Network", text: "Integration layer connects every system of record — data flows between Salesforce, QuickBooks, Zendesk, and Slack without a human in the loop." },
      { icon: "BadgeCheck", text: "Every automated flow is instrumented with audit logs, error alerts, and a throughput dashboard — you see exactly what ran and what failed." },
      { icon: "Workflow", text: "We build the automation roadmap, staff the engineers, and run the platform under one subscription — you stop buying tools and start recovering labor." },
    ],
  },

  // 04 — Service architecture
  architecture: {
    title: "Solution architecture",
    subtitle: "Five connected layers that turn manual work into automated flows. Every layer is staffed, instrumented, and owned by one accountable team.",
    layers: [
      { name: "Trigger Layer", icon: "Zap", components: ["Webhooks", "Cron Schedules", "Event Bus", "Form & Email Triggers"] },
      { name: "Agent Layer", icon: "Bot", components: ["AI Support Agent", "RPA Bots", "Invoice/Doc Agents", "Approval Agents"] },
      { name: "Integration Layer", icon: "Plug", components: ["Salesforce Connector", "HubSpot Connector", "QuickBooks/Xero", "Zendesk/Slack/Notion"] },
      { name: "Orchestration Layer", icon: "Workflow", components: ["Flow Engine", "Approval Routing", "State Machines", "Retry & Fallback"] },
      { name: "Observability Layer", icon: "Radar", components: ["Run Monitoring", "Audit Logs", "Error Alerting", "Throughput Dashboard"] },
    ],
  },

  // 05 — Capabilities accordion
  capabilities: {
    title: "Capability breakdown",
    subtitle: "Six automation capabilities bundled into one engagement",
    items: [
      { icon: "Headset", title: "AI Support Agent", description: "24/7 Tier-1 resolution on Zendesk, Intercom, and Slack with retrieval over your help docs, policy files, and order history — human handoff on confidence drop.", stat: { value: "63%", label: "Tickets auto-resolved" } },
      { icon: "Receipt", title: "Invoice Automation", description: "Auto-generate, send, chase, and reconcile invoices in QuickBooks/Xero from Salesforce or Stripe events — with dunning and exception routing.", stat: { value: "−71%", label: "Invoice processing time" } },
      { icon: "FileText", title: "Report Automation", description: "Scheduled reports pulled from GA4, Salesforce, your warehouse, and ad platforms — assembled into a branded deck and dropped in Slack/Notion on a cadence.", stat: { value: "20 hrs", label: "Weekly reporting time saved" } },
      { icon: "Workflow", title: "Workflow Orchestration", description: "Multi-step flows across systems with approval routing, state machines, retry logic, and fallback paths — built on n8n, Workato, or Power Automate.", stat: { value: "4.2x", label: "Avg. cycle time lift" } },
      { icon: "RefreshCw", title: "Data Sync & Integration", description: "Bi-directional sync between Salesforce, HubSpot, QuickBooks, Airtable, Notion, and your warehouse — no more copy-paste, no more drift.", stat: { value: "99.7%", label: "Sync reliability" } },
      { icon: "ClipboardCheck", title: "Approval Automation", description: "Auto-route purchase requests, expense reports, and contract redlines to the right approver in Slack — with reminders, escalation, and full audit trail.", stat: { value: "−68%", label: "Approval cycle time" } },
    ],
  },

  // 06 — Engagement journey
  journey: {
    title: "Engagement journey",
    subtitle: "From audit to always-on automation factory in 90 days",
    milestones: [
      { phase: "01", title: "Process audit & opportunity mapping", description: "We map every recurring manual process, score it by hours consumed × error rate × automation feasibility, and prioritize the top 10 automation candidates.", duration: "Week 1–2", outcome: "Ranked automation backlog with labor-recovery estimates" },
      { phase: "02", title: "Integration layer & platform setup", description: "We stand up the integration layer, connect your systems of record, and deploy the orchestration platform (n8n/Workato/Power Automate) with observability.", duration: "Week 2–5", outcome: "All systems connected; automation platform live" },
      { phase: "03", title: "Agent & workflow build", description: "We build the AI support agent, invoice flow, report flow, and approval flow in priority order — each shipped to production with monitoring.", duration: "Week 5–10", outcome: "Top 6 flows in production with audit trails" },
      { phase: "04", title: "Production rollout & tuning", description: "Flows go live behind feature flags, we tune confidence thresholds, edge cases, and fallback paths, then ramp to full traffic with weekly review.", duration: "Week 10–12", outcome: "−62% manual effort achieved on scoped processes" },
      { phase: "05", title: "Continuous optimization & expansion", description: "Monthly expansion of the automation backlog, quarterly roadmap review, and continuous tuning — the factory compounds labor recovery quarter over quarter.", duration: "Ongoing", outcome: "Labor recovery compounds; automation backlog burns down" },
    ],
  },

  // 07 — ROI calculator
  roi: {
    title: "ROI model",
    subtitle: "What a typical Business Automation engagement looks like financially",
    inputs: [
      { label: "Manual hours automated / month", value: "1,150 hrs" },
      { label: "STIOOS setup fee", value: "$45K" },
      { label: "STIOOS monthly subscription", value: "$14K/mo" },
      { label: "Avg. loaded labor cost / hour", value: "$48" },
    ],
    outputs: [
      { label: "Labor recovered / year", value: "$1.4", unit: "M" },
      { label: "Cycle time compression", value: "4.2", unit: "x" },
      { label: "Error rate reduction", value: "−54", unit: "%" },
      { label: "Payback period", value: "4.8", unit: "mo" },
    ],
    investment: "$213K",
    return: "$1.4M",
  },

  // 08 — Stack & integrations grid
  stack: {
    title: "The stack we wire together",
    subtitle: "One integrated automation fabric across triggers, agents, integrations, orchestration, and observability",
    categories: [
      { name: "Orchestration", tools: ["n8n", "Make", "Zapier", "Workato", "Power Automate"] },
      { name: "RPA & UI Automation", tools: ["UiPath", "Power Automate Desktop", "Browser Automation", "Form Filling Bots"] },
      { name: "AI Agent Frameworks", tools: ["OpenAI", "LangChain", "LlamaIndex", "Claude", "CrewAI"] },
      { name: "CRM & Sales", tools: ["Salesforce", "HubSpot", "Pipedrive", "Apollo", "Outreach"] },
      { name: "Support & Comms", tools: ["Zendesk", "Intercom", "Slack", "Notion", "Airtable"] },
      { name: "Finance & ERP", tools: ["QuickBooks", "Xero", "NetSuite", "Stripe", "Bills"] },
      { name: "Data & Warehouse", tools: ["Postgres", "Snowflake", "BigQuery", "Airbyte", "Fivetran"] },
      { name: "Observability", tools: ["Datadog", "Grafana", "PagerDuty", "Sentry", "OpenTelemetry"] },
    ],
  },

  // 09 — Metric comparison cards
  metricComparison: {
    title: "Metric comparison",
    subtitle: "How STIOOS Business Automation compares to industry averages and your realistic potential",
    metrics: [
      { label: "Manual effort on scoped processes", industry: 100, stioos: 38, potential: 25, unit: "%" },
      { label: "Tier-1 ticket auto-resolution", industry: 18, stioos: 63, potential: 72, unit: "%" },
      { label: "Invoice cycle time (days)", industry: 9, stioos: 2, potential: 1, unit: "d" },
      { label: "Reporting hours saved / week", industry: 4, stioos: 20, potential: 28, unit: "hr" },
    ],
  },

  // 10 — Case studies carousel
  caseStudies: {
    title: "Case studies",
    subtitle: "Business Automation engagements that shipped measurable labor recovery",
    studies: [
      { industry: "B2B SaaS · $28M ARR", title: "AI support agent deflected 63% of Tier-1 tickets in 60 days", result: { value: "63%", label: "tickets auto-resolved" }, quote: "We shut down two weekend support shifts. The agent resolves in 12 seconds what took us 12 hours to triage." },
      { industry: "Logistics · Mid-market", title: "Invoice automation cut AP cycle from 9 days to 2", result: { value: "−71%", label: "invoice processing time" }, quote: "300 invoices a week used to take a full-time person. Now it takes one exception queue and 90 minutes a day." },
      { industry: "HealthTech · Series C", title: "Report automation gave back 20 hours a week to ops leaders", result: { value: "20 hrs", label: "weekly reporting saved" }, quote: "The Monday morning deck used to consume my whole team's Friday. Now it lands in Slack at 7am and we just review it." },
      { industry: "Professional Services · 240 staff", title: "Approval automation compressed cycle time 4.2x", result: { value: "4.2x", label: "cycle time lift" }, quote: "Purchase requests that used to chase approvers for a week now close in under two days. The audit trail alone was worth it." },
    ],
  },

  // 11 — Outcome scorecard
  scorecard: {
    title: "Outcome scorecard",
    subtitle: "The composite health of a Business Automation engagement at steady state",
    donut: { value: 91, label: "Automation engine health" },
    bars: [
      { label: "Integration reliability", value: 99 },
      { label: "Flow uptime", value: 97 },
      { label: "Agent resolution rate", value: 88 },
      { label: "Audit trail coverage", value: 96 },
      { label: "Error alerting latency", value: 92 },
    ],
    trend: { label: "Labor hours recovered — last 7 months", points: [180, 320, 510, 740, 960, 1120, 1380] },
    kpis: [
      { value: "−62%", label: "Manual effort" },
      { value: "4.2x", label: "Cycle time lift" },
      { value: "−54%", label: "Error rate" },
    ],
  },

  // 12 — Testimonial wall
  testimonials: {
    title: "What clients say",
    subtitle: "Operations leaders who put their manual work on STIOOS",
    testimonials: [
      { quote: "We recovered 1,150 hours a month. That's seven full-time people we redeployed to actually grow the business instead of running it.", name: "Rachel Osei", role: "COO", company: "Logistics, Mid-market", rating: 5 },
      { quote: "The AI support agent resolved 63% of tickets in the first 60 days. We re-invested the savings into a senior escalation pod instead of headcount.", name: "Daniel Kim", role: "VP Operations", company: "B2B SaaS, $28M ARR", rating: 5 },
      { quote: "I used to spend every Friday building the Monday report deck. Now it lands in Slack at 7am. I got my Fridays back.", name: "Mei Lin", role: "Director of Operations", company: "HealthTech, Series C", rating: 5 },
      { quote: "They wired Salesforce, QuickBooks, Zendesk, and Slack together in three weeks. Work that took four people now runs on a schedule.", name: "Carlos Mendez", role: "Head of Ops", company: "Professional Services, 240 staff", rating: 5 },
      { quote: "What I love is the audit trail. Every approval, every invoice, every report — I can see who, what, when. Compliance stopped being a project.", name: "Aisha Rahman", role: "COO", company: "FinTech, $40M ARR", rating: 5 },
      { quote: "We tried building this in-house with Zapier and a contractor. It worked for a week, then nobody owned it. STIOOS owns the whole thing end-to-end.", name: "Tom Walsh", role: "Founder & COO", company: "E-commerce, $18M", rating: 5 },
    ],
  },

  // 13 — Vs alternatives
  vsAlternatives: {
    title: "Vs the alternatives",
    subtitle: "How Business Automation as a Service compares to in-house, RPA vendor, and consultant models",
    alternatives: ["In-house build", "RPA vendor license", "Implementation consultant"],
    criteria: [
      { label: "Owns the labor-recovered number", scores: [30, 10, 25, 95] },
      { label: "AI agent capability", scores: [25, 15, 20, 90] },
      { label: "Integration depth", scores: [40, 30, 50, 95] },
      { label: "Observability & audit", scores: [25, 35, 30, 92] },
      { label: "Speed to first flow in prod", scores: [30, 20, 45, 88] },
      { label: "Ongoing ownership & SLA", scores: [20, 25, 30, 90] },
    ],
  },

  // 14 — Engagement tabs
  engagement: {
    title: "Engagement models",
    subtitle: "Three ways to engage — all with setup + monthly subscription tied to labor recovered",
    tabs: [
      { name: "Pilot", price: "$8K", period: "mo", description: "One process automated end-to-end. Ideal for proving the model before scaling.", features: ["1 priority flow in production", "Integration to 2 systems", "AI agent pilot (1 use case)", "Observability dashboard", "Monthly tuning"], popular: false },
      { name: "Automation Factory", price: "$14K", period: "mo", description: "Full platform: AI support agent + invoice + report + approval + data sync under one team.", features: ["6 flows in production", "AI support agent on Zendesk/Slack", "Invoice + report automation", "Approval routing in Slack", "Full observability + audit", "Quarterly backlog burn-down", "SLA on flow uptime"], popular: true },
      { name: "Enterprise", price: "Custom", period: "program", description: "Multi-team or multi-region program with dedicated automation pod and quarterly roadmap.", features: ["Unlimited flows", "Dedicated 4-person automation pod", "RPA + AI agents + orchestration", "Custom integrations & data sync", "SOC 2 / HIPAA compliance path", "Executive reporting + SLA"], popular: false },
    ],
  },

  // 15 — Industries strip
  industries: {
    title: "Industries we automate",
    subtitle: "Business Automation engagements shipped across these verticals",
    industries: [
      { name: "B2B SaaS", icon: "Boxes", count: 16 },
      { name: "E-Commerce", icon: "ShoppingCart", count: 14 },
      { name: "Logistics", icon: "Ship", count: 9 },
      { name: "FinTech", icon: "Coins", count: 11 },
      { name: "HealthTech", icon: "HeartHandshake", count: 7 },
      { name: "Professional Services", icon: "Briefcase", count: 12 },
      { name: "Real Estate", icon: "Building2", count: 6 },
      { name: "Manufacturing", icon: "Factory", count: 8 },
    ],
  },

  // 16 — CTA + FAQ
  ctaFaq: {
    cta: {
      eyebrow: "Ready to automate",
      title: "Put your manual work on one accountable team.",
      subtitle: "Book a 30-minute automation audit. We'll map your top 10 manual processes, estimate labor recoverable, and give you a fixed setup + monthly subscription proposal with an SLA on flow uptime.",
      primaryCta: { label: "Book an automation audit", href: "/contact" },
      secondaryCta: { label: "Browse automation services", href: "/marketplace?category=ai-automation" },
    },
    faqs: [
      { q: "Will this displace my team?", a: "Mostly no — most clients redeploy recovered hours into higher-value work (escalation, growth initiatives, customer success). Across 60+ engagements, less than 15% of recovered hours translated into headcount reduction. We help you re-deploy, not just cut." },
      { q: "How does this integrate with our existing stack?", a: "We wire into your existing Salesforce, HubSpot, QuickBooks/Xero, Zendesk, Slack, Notion, and Airtable via native APIs and connectors. We don't force a stack migration. If you're on NetSuite or a custom ERP, we integrate through your API or warehouse." },
      { q: "How do you handle security and data access?", a: "All flows run on your tenant (n8n self-hosted, Workato, or Power Automate in your M365). Credentials are stored in your secret manager. We follow least-privilege access, ship full audit logs, and can map to SOC 2, HIPAA, or GDPR requirements on the Enterprise tier." },
      { q: "How fast will I see the first flow in production?", a: "The first priority flow typically ships to production by week 3–4 of the engagement. By week 12, the full Automation Factory (6 flows + AI agent) is live. The 4.2x cycle time and −62% manual effort figures are steady-state at week 12." },
      { q: "What happens when a flow breaks?", a: "Every flow ships with error alerts, retry logic, and fallback paths. Failures route to PagerDuty or a Slack channel within seconds. Our subscription includes tuning, patching, and re-engineering flows when upstream systems change — you don't maintain it, we do." },
      { q: "What's the difference between this and just buying Zapier or n8n?", a: "Tools don't automate anything — engineers do. We bring the integration engineers, AI agent builders, observability, and ongoing ownership under one subscription. You stop buying licenses nobody maintains and start recovering labor on a measured cadence." },
    ],
  },
};
