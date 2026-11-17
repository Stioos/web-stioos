import type { DivisionSpec } from "../division-types";

// ============================================================
// 01 — AI AUTOMATION & AGENTIC SOLUTIONS (cat-ai-agents)
// Accent: violet. Subcategories: custom / support / sales /
// conversational / process / enterprise.
// ============================================================

export const AI_AGENTS_SPEC: DivisionSpec = {
  categoryId: "cat-ai-agents",
  slug: "ai-agents",

  // 01 — Hero
  hero: {
    eyebrow: "AI Automation & Agentic Solutions",
    title: "Deploy autonomous digital workers that",
    highlight: "never sleep, never quit, never miss.",
    subtitle:
      "Design, build, and operate custom AI agents — customer support agents, AI SDRs, conversational and voice agents, and governed enterprise agent fleets — integrated across your CRM, helpdesk, data warehouse, and phone tree.",
    primaryCta: { label: "Request a consultation", href: "/contact" },
    secondaryCta: { label: "Browse 36 agent services", href: "/marketplace?category=ai-agents" },
    stats: [
      { value: "36", label: "Agent services in catalog" },
      { value: "24/7", label: "Always-on coverage" },
      { value: "−62%", label: "Avg. manual effort cut" },
    ],
  },

  // 02 — Trust bar
  trustBadges: [
    "OpenAI", "Anthropic", "LangGraph", "CrewAI", "Pinecone", "Weaviate",
    "Twilio", "Zendesk", "Salesforce", "HubSpot", "Slack", "Microsoft Teams",
  ],

  // 03 — KPI band
  kpis: [
    { value: "62%", label: "Avg. reduction in manual effort", trend: "+38%", spark: [22, 34, 41, 52, 58, 60, 62], icon: "Gauge" },
    { value: "4.2x", label: "Faster response on tier-1 tickets", trend: "+320%", spark: [10, 18, 26, 31, 36, 39, 42], icon: "Zap" },
    { value: "91%", label: "First-contact resolution rate", trend: "+19pts", spark: [72, 76, 80, 84, 87, 89, 91], icon: "BadgeCheck" },
    { value: "$1.4M", label: "Avg. annual labor cost recovered", trend: "+$480K", spark: [0.6, 0.8, 1.0, 1.1, 1.25, 1.32, 1.4], icon: "Coins" },
  ],

  // 04 — Pain points
  painPoints: [
    {
      icon: "Headset",
      title: "Support queue grows faster than headcount",
      description: "Tickets pile up overnight, weekends, and holidays. Customers wait hours for answers a trained agent could resolve in seconds.",
      impact: "−42% CSAT",
    },
    {
      icon: "Target",
      title: "Pipeline leaks from slow follow-up",
      description: "Inbound leads cool in 5 minutes; your SDRs follow up in 5 hours. The 47% of leads that convert on first contact are lost to whoever replies first.",
      impact: "−38% pipeline",
    },
    {
      icon: "RefreshCw",
      title: "Repeatable work consumes senior talent",
      description: "Your best people spend 30% of their week on copy-paste reconciliation, data entry, and report assembly instead of strategy and judgment.",
      impact: "−30% capacity",
    },
  ],

  // 05 — Solution overview
  solution: {
    eyebrow: "The STIOOS approach",
    title: "One accountable partner for every agent your business runs",
    body: "We don't ship a chatbot and disappear. STIOOS designs the agent, wires it into your stack, governs it with evals and guardrails, and operates it 24/7 — so the agent keeps getting smarter and your team keeps getting time back. Every engagement ships with a measurable outcome contract.",
    capabilities: [
      "Production-grade agent architecture (not a demo)",
      "Native CRM, helpdesk, and data-warehouse integrations",
      "Evaluation harness with golden-set regression tests",
      "Guardrails: PII redaction, hallucination fences, human-escalation",
      "Observability: every decision traced, replayable, auditable",
      "SLA-backed operations with on-call agent engineers",
    ],
    visual: "dashboard",
  },

  // 06 — Capabilities bento (links to subcategories)
  capabilities: [
    { icon: "Wand2", title: "Custom AI Agents", description: "Purpose-built agents tailored to your exact operations and data.", metric: "12 services", span: "lg", subslug: "custom-ai-agents" },
    { icon: "Headset", title: "Customer Support Agents", description: "24/7 agents that resolve, escalate, and learn from every ticket.", metric: "6 services", span: "md", subslug: "customer-support-agents" },
    { icon: "Target", title: "Sales AI Agents", description: "Qualification, follow-up, and pipeline acceleration on autopilot.", metric: "6 services", span: "sm", subslug: "sales-ai-agents" },
    { icon: "MessageSquare", title: "Conversational AI Agents", description: "Natural-language agents for web, app, voice, and messaging.", metric: "6 services", span: "sm", subslug: "conversational-ai-agents" },
    { icon: "Workflow", title: "Process Automation Agents", description: "Agents that execute multi-step business processes end-to-end.", metric: "6 services", span: "md", subslug: "process-automation-agents" },
    { icon: "ShieldCheck", title: "Enterprise AI Agents", description: "Governed, secure agent fleets for enterprise scale and compliance.", metric: "6 services", span: "sm", subslug: "enterprise-ai-agents" },
  ],

  // 07 — Process timeline
  process: {
    title: "Delivery methodology",
    subtitle: "A repeatable five-phase path from discovery to a production agent fleet your team can operate confidently.",
    phases: [
      { phase: "01", title: "Discover & map", description: "We map the workflow, data sources, and decision points the agent will own.", duration: "Week 1", deliverables: ["Workflow audit", "Integration inventory", "Success metrics"] },
      { phase: "02", title: "Design & prototype", description: "Architecture, tool selection, and a working prototype on your real data.", duration: "Week 2–3", deliverables: ["Agent architecture", "Live prototype", "Eval golden set"] },
      { phase: "03", title: "Build & integrate", description: "Production build wired into your CRM, helpdesk, and data warehouse.", duration: "Week 3–6", deliverables: ["Production agent", "Stack integrations", "Guardrails"] },
      { phase: "04", title: "Evaluate & harden", description: "Regression evals, red-team prompts, and load testing before launch.", duration: "Week 6–7", deliverables: ["Eval report", "Security review", "Launch runbook"] },
      { phase: "05", title: "Deploy & operate", description: "Production rollout with 24/7 monitoring and continuous improvement.", duration: "Ongoing", deliverables: ["Live deployment", "On-call SLA", "Monthly tuning"] },
    ],
  },

  // 08 — Tech radar
  techRadar: {
    title: "The agent stack we ship to production",
    subtitle: "Every technology below is in active production across STIOOS engagements. The radar shows where each sits on the adopt-to-hold spectrum.",
    rings: [
      { label: "Adopt" },
      { label: "Trial" },
      { label: "Assess" },
      { label: "Hold" },
    ],
    nodes: [
      { name: "LangGraph", ring: 0, angle: -70 },
      { name: "OpenAI", ring: 0, angle: -20 },
      { name: "Anthropic", ring: 0, angle: 40 },
      { name: "CrewAI", ring: 1, angle: 110 },
      { name: "Pinecone", ring: 1, angle: 160 },
      { name: "Weaviate", ring: 1, angle: -140 },
      { name: "Twilio", ring: 0, angle: 130 },
      { name: "LlamaIndex", ring: 2, angle: 70 },
      { name: "DSPy", ring: 2, angle: -100 },
      { name: "Neo4j", ring: 2, angle: 20 },
      { name: "Autogen", ring: 3, angle: -50 },
      { name: "LangSmith", ring: 1, angle: 90 },
    ],
  },

  // 09 — Before / after impact
  impact: {
    title: "Quarter-one impact",
    subtitle: "Representative results from STIOOS agent engagements in the first 90 days of production. Your numbers will vary based on workflow complexity and data maturity.",
    metrics: [
      { label: "Tier-1 ticket auto-resolution rate", before: 18, after: 74, beforeLabel: "18%", afterLabel: "74%", unit: "%" },
      { label: "Median inbound lead response time", before: 82, after: 8, beforeLabel: "4.1 hrs", afterLabel: "8 min", unit: "min" },
      { label: "Weekly hours recovered from manual work", before: 12, after: 68, beforeLabel: "12 hrs", afterLabel: "68 hrs", unit: "hrs" },
      { label: "Sales-qualified lead volume", before: 30, after: 71, beforeLabel: "Baseline", afterLabel: "+71%", unit: "%" },
    ],
  },

  // 10 — Spotlight services
  spotlightServices: [
    { name: "Multi-Agent AI Orchestration System", tagline: "LangGraph + CrewAI orchestration for complex, multi-step business workflows.", tags: ["LangGraph", "CrewAI", "OpenAI"], metric: { value: "4.9★", label: "rating" }, href: "/marketplace?category=ai-agents" },
    { name: "Omnichannel AI Support Agent", tagline: "Deflects 60% of tickets across email, chat, and voice with human escalation.", tags: ["Twilio", "Zendesk", "Voice"], metric: { value: "−60%", label: "tickets" }, href: "/marketplace?category=ai-agents" },
    { name: "AI SDR Outbound Engine", tagline: "Autonomous prospecting, qualification, and meeting booking across your ICP.", tags: ["Salesforce", "Outreach", "GPT-4"], metric: { value: "+71%", label: "SQLs" }, href: "/marketplace?category=ai-agents" },
  ],

  // 11 — Outcomes gauges
  outcomes: {
    central: { value: 94, label: "Overall agent quality score", caption: "Across 1,200+ shipped agents" },
    gauges: [
      { value: 91, label: "First-contact resolution" },
      { value: 88, label: "Hallucination-free responses" },
      { value: 96, label: "Guardrail compliance" },
      { value: 79, label: "Cost vs. human baseline" },
    ],
  },

  // 12 — Case study
  caseStudy: {
    industry: "B2B SaaS · 480 employees",
    title: "How a mid-market SaaS company cut support load 62% in one quarter",
    challenge: "A 480-person SaaS company was drowning in tier-1 support tickets. Median first response was 4.1 hours, CSAT had slipped to 71%, and the support team had grown 3 years running without catching up to ticket volume.",
    solution: "STIOOS deployed an omnichannel support agent wired into Zendesk, Slack, and the product's help center. The agent resolved tier-1 tickets across email, chat, and voice, escalated edge cases to humans with full context, and retrained weekly on the latest 200 closed tickets.",
    results: [
      { value: "62%", label: "Reduction in tier-1 ticket volume" },
      { value: "94%", label: "CSAT after 90 days" },
      { value: "$860K", label: "Annualized labor cost recovered" },
    ],
    quote: "The agent resolved a ticket in 8 seconds that used to take my team 8 minutes. We didn't shrink the team — we finally got ahead of the queue.",
    author: "VP of Customer Experience",
    role: "Mid-market SaaS",
  },

  // 13 — Comparison table
  comparison: {
    title: "Why teams choose STIOOS",
    subtitle: "How STIOOS agent engagements compare to the alternatives teams typically evaluate.",
    columns: ["In-house build", "Chatbot SaaS", "Freelancer", "STIOOS"],
    rows: [
      { criterion: "Production-grade architecture (not a demo)", values: ["partial", "no", "no", "yes"] },
      { criterion: "Native CRM / helpdesk / data integrations", values: ["partial", "partial", "no", "yes"] },
      { criterion: "Evaluation harness with regression tests", values: ["no", "no", "no", "yes"] },
      { criterion: "Guardrails, PII redaction, human escalation", values: ["partial", "partial", "no", "yes"] },
      { criterion: "24/7 operations with on-call engineers", values: ["no", "yes", "no", "yes"] },
      { criterion: "SLA-backed measurable outcome contract", values: ["no", "no", "no", "yes"] },
    ],
  },

  // 14 — Pricing tiers
  pricing: {
    title: "Engagement models",
    subtitle: "Three ways to engage, all with a transparent scope and a measurable outcome. No vague retainers.",
    tiers: [
      {
        name: "Launch", price: "$12K", period: "project", description: "One production agent, one integration, one workflow.",
        features: ["1 production AI agent", "1 stack integration (CRM/helpdesk)", "Guardrails + eval harness", "30-day launch support", "Launch runbook + handoff"],
        popular: false, cta: "Start a Launch project",
      },
      {
        name: "Growth", price: "$8K", period: "month", description: "A fleet of agents operated and tuned continuously.",
        features: ["Up to 4 production agents", "Unlimited integrations", "24/7 monitoring + on-call", "Weekly eval + retraining", "Monthly business review", "SLA: 99.9% uptime"],
        popular: true, cta: "Start a Growth engagement",
      },
      {
        name: "Enterprise", price: "Custom", period: "program", description: "Governed agent programs for regulated, multi-team scale.",
        features: ["Unlimited agents + fleets", "SSO, SOC 2, audit logs", "Dedicated agent engineer", "Custom eval + compliance", "Quarterly roadmap", "SLA: 99.95% uptime"],
        popular: false, cta: "Talk to sales",
      },
    ],
  },

  // 15 — Industries cloud
  industries: [
    { name: "SaaS & Technology", count: 9 },
    { name: "Financial Services", count: 7 },
    { name: "E-Commerce & Retail", count: 8 },
    { name: "Healthcare", count: 5 },
    { name: "Real Estate", count: 4 },
    { name: "Education", count: 4 },
    { name: "Manufacturing", count: 5 },
    { name: "Telecom", count: 3 },
    { name: "Logistics", count: 4 },
    { name: "Media & Publishing", count: 3 },
    { name: "Hospitality", count: 3 },
    { name: "Insurance", count: 4 },
  ],

  // 16 — Final CTA
  finalCta: {
    eyebrow: "Ready when you are",
    title: "Stop losing hours to work an agent could do.",
    subtitle: "Book a 30-minute scoping call. We'll map one workflow, show you the agent that would own it, and give you a fixed-price quote before you commit to anything.",
    primaryCta: { label: "Book a consultation", href: "/contact" },
    secondaryCta: { label: "Browse agent services", href: "/marketplace?category=ai-agents" },
    trustSignals: [
      "No vague retainers",
      "Fixed-price first project",
      "Cancel anytime",
    ],
  },
};
