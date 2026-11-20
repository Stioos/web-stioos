import type { Service } from "@/types";
import { makeService } from "./service-factory";

// ============================================================
// DIRECTORY SERVICES CATALOG — 55 SEO/AEO-optimized services
//
// These are the 55 services that appear in the home-page Services
// Directory grid (src/data/services-directory.ts) and were previously
// served by the standalone /services/[slug] route. They are now
// injected into the main marketplace catalog so they render at the
// EXISTING /marketplace/[slug] page — the Live Impact Signal panel,
// donut chart, before/after metrics, progress bars, breadcrumb pills,
// tags, stats row, CTAs, etc.
//
// Architecture:
//   • Each entry is built via the shared makeService() factory —
//     fields you don't specify fall back to sensible defaults.
//   • Slugs are derived deterministically from the service name via
//     slugifyServiceName() (same function the old /services route
//     used), so the directory hrefs and the marketplace route's
//     generateStaticParams() can never drift out of sync.
//   • Ids use the srv-dir-NNN namespace (001..055) — distinct from
//     every other catalog file, so injectAutoServices() never dedups
//     them away.
//   • Category / subcategory IDs map onto the existing taxonomy in
//     src/data/categories.ts (cat-* / sub-*). No new categories or
//     subcategories are introduced.
//
// Exported:
//   • DIRECTORY_SERVICES  — the 55 Service objects.
//   • DIRECTORY_SERVICE_SLUGS  — convenience slug list.
//   • slugifyServiceName  — re-exported for the directory file so
//     the hrefs stay in lockstep with the catalog slugs.
// ============================================================

/**
 * Deterministic URL-safe slug derivation. Mirrors the algorithm in
 * service-pages-data.ts exactly so every slug matches the legacy
 * /services/<slug> URL the directory was previously pointing at.
 *
 *   "Operations & Process Automation"
 *     → "operations-process-automation"
 *   "Brand Identity Design & Strategy Development"
 *     → "brand-identity-design-strategy-development"
 */
export function slugifyServiceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[,./'`’":;()!?]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Shared gradient palette — one accent per division so the cards
 *  visually cluster on the marketplace grid. */
const ACCENT = {
  aiWorkflow: "from-violet-500 via-purple-500 to-fuchsia-400",
  aiAgents: "from-amber-500 via-orange-500 to-rose-400",
  tech: "from-sky-500 via-cyan-500 to-teal-400",
  multimedia: "from-fuchsia-500 via-pink-500 to-rose-400",
  dsm: "from-rose-500 via-red-500 to-orange-400",
  business: "from-emerald-500 via-green-500 to-lime-400",
  consulting: "from-orange-500 via-amber-500 to-yellow-400",
  startup: "from-teal-500 via-emerald-500 to-green-400",
  branding: "from-amber-500 via-orange-500 to-red-400",
} as const;

/** Tiny helper to keep each service entry readable. */
type SrvInput = Parameters<typeof makeService>[0];

const srv = (
  n: number,
  input: Omit<SrvInput, "id" | "slug"> & { slug?: string }
): Service => {
  const id = `srv-dir-${String(n).padStart(3, "0")}`;
  const slug = input.slug ?? slugifyServiceName(input.name);
  return makeService({ ...input, id, slug });
};

export const DIRECTORY_SERVICES: Service[] = [
  // =========================================================
  // DIVISION 1 — AI Workflow Automation (cat-ai-agents)
  // =========================================================

  // 1
  srv(1, {
    name: "AI-Powered Operations & Process Automation for Streamlined Business Workflows",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-process",
    icon: "Workflow",
    accent: ACCENT.aiWorkflow,
    shortDescription:
      "Automate repetitive back-office and operations workflows with AI-driven agents that run 24/7 across your stack.",
    fullDescription:
      "We map, design, and deploy AI-powered automation for the repetitive operations work eating your team's week — approvals, data entry, reconciliation, escalations, and status reporting. Each workflow is instrumented with audit logs, human-in-the-loop checkpoints where they matter, and integrations into your CRM, ERP, and collaboration tools so the work actually gets done in the systems you already use.",
    tags: ["AI", "Automation", "Workflow", "Process", "Operations"],
    industries: ["Technology", "Professional Services", "Manufacturing", "Retail"],
    deliveryType: "project",
    timeline: "4–8 weeks",
    rating: 4.9,
    reviews: 128,
    popularity: 96,
    featured: true,
    capabilities: [
      "Workflow discovery & opportunity scoring",
      "AI agent design for approval and routing work",
      "Integration with CRM, ERP, and ticketing systems",
      "Human-in-the-loop checkpoints for sensitive decisions",
      "Audit logging, observability, and exception handling",
    ],
    deliverables: [
      "Workflow blueprint and opportunity prioritization",
      "Production-ready automation agents deployed",
      "Integration connectors and runbooks",
      "Operator dashboard and exception monitoring",
    ],
    process: [
      { title: "Discover", description: "Map the operations work that is repetitive, rules-based, and high-volume." },
      { title: "Design", description: "Architect the automation: agent roles, triggers, integrations, and checkpoints." },
      { title: "Build", description: "Iterate in weekly sprints against real production workloads." },
      { title: "Launch", description: "Roll out with monitoring, training, and a 30-day stabilization window." },
    ],
    problemsSolved: [
      "Teams buried in repetitive approvals and data entry",
      "Manual work that never gets captured as process",
      "Inconsistent execution across shifts and tools",
      "No visibility into what's pending, blocked, or done",
    ],
    faqs: [
      { question: "How do you decide which processes to automate first?", answer: "We score every candidate on volume, repetitiveness, rule-clarity, and ROI — then deliver the top three automations in the first sprint so you see value fast." },
      { question: "Do we need to replace our existing tools first?", answer: "No. The automations run on top of your CRM, ERP, and ticketing — we add an integration layer rather than forcing a rip-and-replace." },
      { question: "What happens when the AI is unsure?", answer: "Sensitive or low-confidence decisions hit a human-in-the-loop checkpoint so a person reviews and approves before the workflow continues." },
      { question: "How do we monitor what the agents are doing?", answer: "Every run is logged with inputs, outputs, and decisions surfaced in a dashboard — you see exactly what ran, what passed, and what escalated." },
    ],
  }),

  // 2
  srv(2, {
    name: "AI Marketing & Sales Automation for Full-Funnel Pipeline Generation",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-sales",
    icon: "Megaphone",
    accent: ACCENT.aiWorkflow,
    shortDescription:
      "End-to-end AI automation for sales and marketing pipelines — from lead capture to nurture, scoring, and handoff.",
    fullDescription:
      "We build the AI-driven sales and marketing automation backbone that turns your funnel into a measurable, always-on machine: lead capture, enrichment, scoring, nurture sequences, channel orchestration, and clean handoff to sales. Built on your existing MAP and CRM with attribution you can actually trust.",
    tags: ["AI", "Marketing Automation", "Sales", "Lead Gen", "Pipeline"],
    industries: ["SaaS", "B2B Services", "E-commerce", "Financial Services"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.8,
    reviews: 96,
    popularity: 88,
    capabilities: [
      "Lead capture, enrichment, and AI scoring",
      "Multi-channel nurture sequences (email, SMS, LinkedIn)",
      "CRM integration with clean sales handoff",
      "Attribution modeling across funnel stages",
      "A/B testing and continuous optimization",
    ],
    deliverables: [
      "Automation architecture and journey maps",
      "Production nurture flows deployed in your MAP",
      "CRM integration and lead routing rules",
      "Attribution dashboard and KPI report",
    ],
    process: [
      { title: "Map", description: "Audit the funnel: stages, channels, lead sources, and current handoffs." },
      { title: "Design", description: "Architect scoring, nurture journeys, and routing rules." },
      { title: "Build", description: "Deploy flows into your MAP and CRM with instrumentation." },
      { title: "Optimize", description: "Run A/B tests, refine scoring, and report on pipeline lift." },
    ],
    problemsSolved: [
      "Leads sit untouched because routing rules are broken",
      "Nurture sequences are static and ignore behavior",
      "Sales and marketing disagree on what 'qualified' means",
      "No attribution tying funnel activity to closed revenue",
    ],
    faqs: [
      { question: "Which marketing automation platforms do you support?", answer: "HubSpot, Marketo, Pardot, ActiveCampaign, and Klaviyo out of the box — we can also build against custom in-house MAPs." },
      { question: "How does AI scoring actually work?", answer: "We train a model on your historical closed-won and closed-lost data so the score reflects what actually converts for your business, not a generic fit-grade." },
      { question: "Can we keep our existing sales process?", answer: "Yes — the automation routes into whatever sales motion you already run, with clean handoff notes so reps never start a conversation cold." },
      { question: "How long until we see pipeline lift?", answer: "Most engagements show measurable lift within 6–8 weeks as flows deploy and scoring stabilizes." },
    ],
  }),

  // 3
  srv(3, {
    name: "AI Data Analytics & Decision Intelligence for Real-Time Business Insights",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-enterprise",
    icon: "BarChart3",
    accent: ACCENT.aiWorkflow,
    shortDescription:
      "AI-powered data pipelines, analytics dashboards, and decision intelligence platforms that turn raw data into action.",
    fullDescription:
      "We design and deploy the data infrastructure that makes your business legible: ingestion pipelines, warehouses, semantic layers, and dashboards your leaders actually trust. On top of that, we build decision-intelligence agents that surface the next best action — not just the chart — so decisions get made faster and with fewer opinions.",
    tags: ["Analytics", "Data Pipelines", "BI", "Decision Intelligence", "AI"],
    industries: ["Financial Services", "Healthcare", "Retail", "Technology"],
    deliveryType: "project",
    timeline: "8–12 weeks",
    rating: 4.9,
    reviews: 84,
    popularity: 90,
    capabilities: [
      "Data ingestion and warehouse architecture",
      "Semantic layer and KPI definitions",
      "Executive and operational dashboards",
      "AI decision-intelligence agents",
      "Data governance and quality monitoring",
    ],
    deliverables: [
      "Production warehouse and pipeline code",
      "Executive dashboard suite",
      "Decision-intelligence agent MVP",
      "Governance playbook and data dictionary",
    ],
    process: [
      { title: "Assess", description: "Inventory sources, define KPIs, and audit current tooling." },
      { title: "Architect", description: "Design the warehouse, semantic layer, and access patterns." },
      { title: "Build", description: "Deploy pipelines, dashboards, and the decision agent." },
      { title: "Adopt", description: "Train teams, run office hours, and instrument adoption." },
    ],
    problemsSolved: [
      "Dashboards that no one trusts or uses",
      "Data scattered across spreadsheets and SaaS tools",
      "Decisions made on gut feel because analytics is too slow",
      "No single source of truth for KPIs",
    ],
    faqs: [
      { question: "What data warehouses do you build on?", answer: "Snowflake, BigQuery, Databricks, and Redshift — we pick based on your stack and cost profile." },
      { question: "How is this different from BI?", answer: "BI shows what happened. Decision intelligence also surfaces the next best action — the chart plus the recommendation, with reasoning your team can audit." },
      { question: "Will my team be able to maintain the dashboards?", answer: "Yes — everything is delivered as code with documented semantic layers and a handover workshop so your analysts can extend it." },
      { question: "How do you handle data governance?", answer: "We implement role-based access, classification, lineage tracking, and quality monitoring from day one, not as an afterthought." },
    ],
  }),

  // 4
  srv(4, {
    name: "AI Supply Chain & Procurement Automation for Resilient Vendor Operations",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-process",
    icon: "Truck",
    accent: ACCENT.aiWorkflow,
    shortDescription:
      "Automate supply chain workflows, procurement approvals, and vendor management with AI agents that cut cycle time.",
    fullDescription:
      "We automate the slow, multi-party workflows choking your supply chain: purchase requisitions, vendor onboarding, PO matching, exception resolution, and shipment tracking. AI agents handle the rules-based work, escalate exceptions to humans with full context, and surface the analytics your operations team needs to plan ahead.",
    tags: ["Supply Chain", "Procurement", "Automation", "Vendor Management", "AI"],
    industries: ["Manufacturing", "Retail", "Logistics", "Distribution"],
    deliveryType: "project",
    timeline: "8–12 weeks",
    rating: 4.7,
    reviews: 62,
    popularity: 78,
    capabilities: [
      "Procure-to-pay workflow automation",
      "Vendor onboarding and compliance checks",
      "PO matching, exception handling, and approvals",
      "Shipment tracking and anomaly alerts",
      "Spend analytics and forecasting",
    ],
    deliverables: [
      "Automated procurement workflow deployed",
      "Vendor onboarding agent and portal",
      "Spend analytics dashboard",
      "Exception monitoring runbooks",
    ],
    process: [
      { title: "Map", description: "Walk the procure-to-pay flow and identify automation points." },
      { title: "Design", description: "Architect agents, integrations, and approval gates." },
      { title: "Build", description: "Deploy against your ERP and procurement tools." },
      { title: "Scale", description: "Roll out to more categories and regions." },
    ],
    problemsSolved: [
      "PO approvals taking days instead of hours",
      "Vendor onboarding is manual and inconsistent",
      "No visibility into where an order is stuck",
      "Spend data locked in the ERP and never analyzed",
    ],
    faqs: [
      { question: "Which ERPs do you integrate with?", answer: "SAP, Oracle, NetSuite, Microsoft Dynamics, and Odoo — with documented patterns for custom ERPs as well." },
      { question: "Can the agents approve purchases on their own?", answer: "Within policy limits you define, yes — above those limits, the agent routes to a human approver with full context attached." },
      { question: "How does vendor onboarding work?", answer: "The agent collects documents, runs compliance and credit checks, and escalates anything anomalous to your procurement team for review." },
      { question: "What analytics come out of this?", answer: "Cycle times, exception rates, spend by category, vendor performance, and forecasting models — all in a dashboard your team owns." },
    ],
  }),

  // 5
  srv(5, {
    name: "AI HR & Workforce Automation for Modern Talent and People Operations",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-process",
    icon: "Users",
    accent: ACCENT.aiWorkflow,
    shortDescription:
      "AI automation for HR processes — screening, onboarding, scheduling, and people analytics that scale with your team.",
    fullDescription:
      "We automate the HR work that scales linearly with headcount: candidate screening, interview scheduling, onboarding tasks, PTO and benefits queries, and people analytics. HR shifts from administrative triage to strategic work, with AI agents handling the rules-based volume and escalating edge cases to humans with full context.",
    tags: ["HR", "Automation", "Recruiting", "Onboarding", "AI"],
    industries: ["Technology", "Healthcare", "Professional Services", "Retail"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.8,
    reviews: 54,
    popularity: 72,
    capabilities: [
      "Candidate screening and shortlist generation",
      "Interview scheduling and reminder agents",
      "Onboarding workflow automation",
      "HR query assistant (PTO, benefits, policies)",
      "People analytics dashboards",
    ],
    deliverables: [
      "Screening agent deployed in your ATS",
      "Onboarding workflow and task automation",
      "HR query assistant on Slack or Teams",
      "People analytics dashboard",
    ],
    process: [
      { title: "Discover", description: "Audit HR workflows and identify the highest-volume manual work." },
      { title: "Design", description: "Architect agents, integrations, and escalation paths." },
      { title: "Build", description: "Deploy against your HRIS and ATS." },
      { title: "Roll Out", description: "Train HR teams and instrument adoption." },
    ],
    problemsSolved: [
      "Recruiters spending days on manual screening",
      "Onboarding tasks falling through the cracks",
      "HR teams buried in repetitive policy questions",
      "No visibility into hiring funnel metrics",
    ],
    faqs: [
      { question: "Which ATS and HRIS platforms do you support?", answer: "Greenhouse, Lever, Workday, BambooHR, Gusto, and Rippling out of the box; we can build against others." },
      { question: "How does the screening agent avoid bias?", answer: "We train on structured, role-relevant signals and audit decisions for adverse impact — bias monitoring is built in, not bolted on." },
      { question: "Can employees trust the HR assistant?", answer: "Yes — it answers from your documented policies, cites the source, and routes sensitive queries to a human automatically." },
      { question: "How long until HR sees capacity freed up?", answer: "Most teams see a measurable drop in administrative volume within 4–6 weeks of deployment." },
    ],
  }),

  // =========================================================
  // DIVISION 2 — Custom AI Agentic Services (cat-ai-agents)
  // =========================================================

  // 6
  srv(6, {
    name: "Custom Conversational AI Support Agents for 24/7 Customer Service Automation",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-support",
    icon: "Bot",
    accent: ACCENT.aiAgents,
    shortDescription:
      "Custom AI support agents that resolve, escalate, and learn across every channel — chat, email, voice, and messaging.",
    fullDescription:
      "We design and deploy custom AI support agents that actually resolve customer issues instead of frustrating them. Built on your knowledge base, ticket history, and tool integrations, they handle tier-1 work end-to-end, escalate to humans with full context, and learn from every interaction so resolution rates climb over time.",
    tags: ["AI Agents", "Customer Support", "Conversational AI", "Chatbots", "Automation"],
    industries: ["SaaS", "E-commerce", "Financial Services", "Telecom"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.9,
    reviews: 112,
    popularity: 94,
    featured: true,
    capabilities: [
      "Multi-channel deployment (web, email, voice, messaging)",
      "Knowledge base grounding with cited answers",
      "Tool use for refunds, lookups, and account actions",
      "Human handoff with full conversation context",
      "Continuous learning from resolved tickets",
    ],
    deliverables: [
      "Production support agent deployed on your channels",
      "Knowledge base ingestion and freshness pipeline",
      "Agent analytics dashboard",
      "Operator console and escalation runbooks",
    ],
    process: [
      { title: "Discover", description: "Audit ticket volume, top issue categories, and current workflows." },
      { title: "Design", description: "Architect agent, knowledge base, tool integrations, and escalation paths." },
      { title: "Build", description: "Iterate against historical tickets in weekly sprints." },
      { title: "Launch", description: "Pilot on a channel, measure, then roll out everywhere." },
    ],
    problemsSolved: [
      "Long support queues and slow first response",
      "Tier-1 work consuming senior agents' time",
      "Inconsistent answers across channels",
      "No leverage from resolved tickets",
    ],
    faqs: [
      { question: "Will the agent frustrate customers with looped answers?", answer: "No — it's grounded in your knowledge base with tool access to actually resolve issues, and escalates to humans when confidence drops or sentiment turns negative." },
      { question: "Which channels can it serve?", answer: "Web chat, email, WhatsApp, SMS, Slack, Teams, and voice — the same agent logic deploys across all of them." },
      { question: "Can it take real actions like refunds?", answer: "Yes — within policy limits you define, the agent can call your APIs to issue refunds, update accounts, and resolve tickets end-to-end." },
      { question: "How do you measure success?", answer: "Resolution rate, CSAT, escalation rate, and time-to-resolution — all surfaced in a dashboard your team owns." },
    ],
  }),

  // 7
  srv(7, {
    name: "AI Agent Integration & Orchestration Across CRM, ERP, and SaaS Stacks",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-custom",
    icon: "Plug",
    accent: ACCENT.aiAgents,
    shortDescription:
      "AI agents that integrate and orchestrate across your CRM, ERP, and internal tools so workflows run end-to-end.",
    fullDescription:
      "We build integration and orchestration agents that bridge your CRM, ERP, ticketing, collaboration, and BI tools — turning multi-system work into single-agent workflows. Whether it's reconciling data, triggering cross-system processes, or surfacing unified views, the agent handles the integration choreography your team used to do manually.",
    tags: ["Integration", "Orchestration", "AI Agents", "API", "Automation"],
    industries: ["Technology", "Financial Services", "Healthcare", "Professional Services"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.8,
    reviews: 68,
    popularity: 80,
    capabilities: [
      "Cross-system workflow orchestration",
      "API integration with scoped credentials",
      "Data reconciliation and consistency checks",
      "Unified views across CRM, ERP, and BI",
      "Error handling and retry logic",
    ],
    deliverables: [
      "Integration architecture and agent design",
      "Production orchestration agent deployed",
      "Connector library for your stack",
      "Monitoring and observability dashboard",
    ],
    process: [
      { title: "Map", description: "Inventory systems, APIs, and cross-system workflows." },
      { title: "Design", description: "Architect agent, connectors, and orchestration patterns." },
      { title: "Build", description: "Deploy with instrumentation and test against real workflows." },
      { title: "Scale", description: "Add more workflows and systems over time." },
    ],
    problemsSolved: [
      "Work that requires copying data across five tools",
      "Cross-system reconciliation done manually",
      "Integration debt from years of one-off connectors",
      "No unified view of customer or order state",
    ],
    faqs: [
      { question: "What if our tools don't have public APIs?", answer: "We build against documented APIs first, but can also handle scraped or DB-direct integrations where needed — with full audit logging either way." },
      { question: "How do you secure the agent's credentials?", answer: "Scoped credentials in a secrets manager, least-privilege tokens, and full audit logging on every action the agent takes." },
      { question: "Can it handle synchronous and async workflows?", answer: "Yes — the orchestration layer supports both real-time tool calls and long-running async workflows with state management." },
      { question: "How do we monitor the agent?", answer: "Every call, decision, and outcome is logged to a dashboard so you see exactly what the agent did and why." },
    ],
  }),

  // 8
  srv(8, {
    name: "AI Analytical Agents for Autonomous Data-Driven Decision Making",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-enterprise",
    icon: "BrainCircuit",
    accent: ACCENT.aiAgents,
    shortDescription:
      "AI agents that analyze data, surface insights, and recommend decisions autonomously — with reasoning you can audit.",
    fullDescription:
      "We build analytical agents that don't just summarize data but reason over it: detect anomalies, surface root causes, recommend next actions, and explain the reasoning in language your team can audit and act on. From FP&A to operations to RevOps, the agents turn raw data into decisions your team can trust.",
    tags: ["Analytics", "AI Agents", "Decision Making", "Insights", "Automation"],
    industries: ["Financial Services", "Retail", "Healthcare", "Technology"],
    deliveryType: "project",
    timeline: "8–12 weeks",
    rating: 4.8,
    reviews: 56,
    popularity: 76,
    capabilities: [
      "Anomaly detection across KPIs and metrics",
      "Root cause analysis with cited evidence",
      "Next-best-action recommendations",
      "Reasoning audit trail for every decision",
      "Integration with BI and data warehouse",
    ],
    deliverables: [
      "Analytical agent deployed against your data",
      "Reasoning and decision log",
      "Insight dashboard and alerting",
      "Operator playbook for acting on recommendations",
    ],
    process: [
      { title: "Discover", description: "Identify the decisions your team makes repeatedly and the data behind them." },
      { title: "Design", description: "Architect the agent's reasoning, data access, and recommendation patterns." },
      { title: "Build", description: "Iterate against historical decisions to calibrate recommendations." },
      { title: "Deploy", description: "Roll out with monitoring and feedback loops." },
    ],
    problemsSolved: [
      "Anomalies detected long after damage is done",
      "Decisions made on gut feel instead of evidence",
      "Analysts buried in reporting instead of recommending",
      "No audit trail for why a decision was made",
    ],
    faqs: [
      { question: "How do we trust the agent's recommendations?", answer: "Every recommendation comes with cited evidence, a reasoning trace, and confidence score — your team audits the why, not just the what." },
      { question: "Can the agent take action or only recommend?", answer: "Both — you choose per workflow. Recommendation-only is the safer default; we add autonomous action only where you've signed off on the policy." },
      { question: "Which data sources does it use?", answer: "Your warehouse, BI tool, transactional DBs, and any API-exposed source — scoped to the data the agent needs for the decision at hand." },
      { question: "How does the agent learn over time?", answer: "Feedback on recommendations is logged and used to recalibrate the model — both automated metrics and explicit human feedback." },
    ],
  }),

  // 9
  srv(9, {
    name: "AI Process Automation Agents for End-to-End Task Execution Workflows",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-process",
    icon: "ListChecks",
    accent: ACCENT.aiAgents,
    shortDescription:
      "Purpose-built AI agents that execute multi-step business processes end-to-end with audit logs and human checkpoints.",
    fullDescription:
      "We build agents for the multi-step business processes eating your team's week — onboarding, fulfillment, reconciliation, exception handling, and case management. Each agent owns the workflow end-to-end, calls the right tools, escalates edge cases with full context, and logs every step so you have complete auditability.",
    tags: ["Process Automation", "AI Agents", "Workflow", "Task Automation", "RPA"],
    industries: ["Technology", "Financial Services", "Healthcare", "Professional Services"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.8,
    reviews: 72,
    popularity: 82,
    capabilities: [
      "Multi-step workflow execution",
      "Tool and API integrations with scoped access",
      "Human-in-the-loop checkpoints for exceptions",
      "Full audit logging of every action",
      "Exception monitoring and escalation",
    ],
    deliverables: [
      "Process automation agent deployed",
      "Integration connectors and runbooks",
      "Audit log and operator dashboard",
      "Exception handling playbook",
    ],
    process: [
      { title: "Map", description: "Walk the process and identify steps, tools, and exceptions." },
      { title: "Design", description: "Architect the agent, checkpoints, and escalation paths." },
      { title: "Build", description: "Iterate against real cases with weekly demos." },
      { title: "Launch", description: "Roll out with monitoring and operator training." },
    ],
    problemsSolved: [
      "Multi-step processes that break when one person is out",
      "No audit trail for what was done and why",
      "Exceptions piling up because no one owns them",
      "Process knowledge locked in one person's head",
    ],
    faqs: [
      { question: "How is this different from RPA?", answer: "RPA follows rigid scripts that break when interfaces change. Our agents reason over the work, handle variation, and escalate when they're unsure — far lower maintenance overhead." },
      { question: "What happens when the agent fails?", answer: "It logs the failure, escalates to a human with full context, and the workflow pauses until the exception is resolved — no silent failures." },
      { question: "Can we keep humans in the loop?", answer: "Yes — you choose which steps require human approval. Most workflows blend automated execution with human checkpoints at sensitive decisions." },
      { question: "How do we know it's working?", answer: "Cycle time, exception rate, throughput, and audit completeness are all surfaced in a dashboard from day one." },
    ],
  }),

  // 10
  srv(10, {
    name: "Multi-Agent AI Systems and Agent Fleets for Enterprise-Scale Automation",
    categoryId: "cat-ai-agents",
    subcategoryId: "sub-agents-enterprise",
    icon: "Network",
    accent: ACCENT.aiAgents,
    shortDescription:
      "Governed fleets of cooperating AI agents for enterprise-scale automation across functions and workflows.",
    fullDescription:
      "We architect multi-agent systems where specialized agents collaborate on enterprise-scale work — a planner, researcher, executor, and critic for each major workflow. Built on LangGraph or CrewAI with shared memory, scoped tools, and full traceability, fleets handle complex work end-to-end with human checkpoints where they matter.",
    tags: ["Multi-Agent", "Agent Fleets", "LangGraph", "Enterprise AI", "Orchestration"],
    industries: ["Technology", "Financial Services", "Healthcare", "Media"],
    deliveryType: "project",
    timeline: "10–14 weeks",
    rating: 4.9,
    reviews: 44,
    popularity: 86,
    capabilities: [
      "Agent role design: planner, researcher, executor, critic",
      "LangGraph state machines with human checkpoints",
      "Shared memory: vector stores and task queues",
      "Tracing and evaluation harnesses",
      "Governance, audit logging, and policy enforcement",
    ],
    deliverables: [
      "Production multi-agent fleet deployed",
      "Agent architecture diagram and spec",
      "Evaluation harness with golden test scenarios",
      "Operator console and trace dashboard",
    ],
    process: [
      { title: "Assess", description: "Identify workflows that need multiple specialized agents." },
      { title: "Architect", description: "Design agent roles, hand-offs, tools, and control gates." },
      { title: "Build", description: "Iterate against golden datasets in weekly sprints." },
      { title: "Harden", description: "Red-team edge cases, add observability, go live." },
    ],
    problemsSolved: [
      "Single agents fail at long multi-step tasks",
      "Complex workflows need multiple specialized skills",
      "Agent demos never survive production data",
      "No visibility into what an agent did or why",
    ],
    faqs: [
      { question: "When do you need a fleet instead of a single agent?", answer: "Whenever the work needs several distinct skills, tool calls, or review steps — orchestration handles the hand-offs reliably." },
      { question: "How do you keep agents from going off track?", answer: "Scoped tools, structured outputs, evaluation suites, and tracing keep behavior bounded and auditable at every step." },
      { question: "Can humans approve critical steps?", answer: "Yes — we add human-in-the-loop checkpoints where the workflow pauses for review before proceeding." },
      { question: "What does the operator console show?", answer: "Every agent run, decision, tool call, and outcome — with the ability to replay any decision and inspect the reasoning." },
    ],
  }),

  // =========================================================
  // DIVISION 3 — Tech & Programming Services (cat-tech-programming)
  // =========================================================

  // 11
  srv(11, {
    name: "Customizable SaaS Apps & Ready-to-Use Tools for Fast Deployment",
    categoryId: "cat-tech-programming",
    subcategoryId: "sub-tech-software",
    icon: "Boxes",
    accent: ACCENT.tech,
    shortDescription:
      "Pre-built SaaS tools and applications, customized and deployed for your business — launch in days, not quarters.",
    fullDescription:
      "We ship production-ready SaaS tools and internal apps customized for your business: admin dashboards, internal portals, customer-facing tools, and workflow apps. Each ships pre-integrated with your auth and data layer, then gets tailored to your workflows so it's useful from day one instead of after a six-month build.",
    tags: ["SaaS", "Internal Tools", "Customization", "Deployment", "Apps"],
    industries: ["SaaS", "Professional Services", "Retail", "Healthcare"],
    deliveryType: "project",
    timeline: "2–6 weeks",
    rating: 4.7,
    reviews: 88,
    popularity: 80,
    capabilities: [
      "Pre-built SaaS app selection and customization",
      "Branding, theming, and UX tuning",
      "Auth and SSO integration",
      "Data layer and API integration",
      "Deployment and handover with runbooks",
    ],
    deliverables: [
      "Customized SaaS tool deployed to your environment",
      "Branded UI and theme configuration",
      "Integration with your auth and data layer",
      "Operator runbooks and training",
    ],
    process: [
      { title: "Scope", description: "Identify the tool, integrations, and customization scope." },
      { title: "Configure", description: "Brand, integrate auth, and connect data sources." },
      { title: "Customize", description: "Tailor workflows, fields, and UX to your team." },
      { title: "Launch", description: "Deploy, train operators, and hand over runbooks." },
    ],
    problemsSolved: [
      "Internal teams waiting months for simple tools",
      "Off-the-shelf SaaS that doesn't fit your workflows",
      "Custom builds that drain engineering capacity",
      "No consistent tooling across teams",
    ],
    faqs: [
      { question: "What kinds of tools can you deliver?", answer: "Admin dashboards, customer portals, internal workflow apps, request trackers, and lightweight SaaS products — all customizable to your workflows." },
      { question: "How fast can we launch?", answer: "Most tools ship within 2–6 weeks depending on customization depth — far faster than a from-scratch build." },
      { question: "Do we own the code?", answer: "Yes — everything ships with source code, deployment configs, and runbooks so your team can maintain and extend it." },
      { question: "Can it integrate with our existing stack?", answer: "Yes — auth via SSO, data via your APIs or DBs, and notifications via Slack, Teams, or email." },
    ],
  }),

  // 12
  srv(12, {
    name: "Cloud Hosting & Deployment Automation on AWS, GCP, and Azure",
    categoryId: "cat-tech-programming",
    subcategoryId: "sub-tech-api",
    icon: "Cloud",
    accent: ACCENT.tech,
    shortDescription:
      "Cloud hosting, deployment automation, and infrastructure management on AWS, GCP, and Azure with cost guardrails.",
    fullDescription:
      "We design and operate your cloud hosting layer: environments, CI/CD pipelines, infrastructure as code, observability, and cost guardrails. Your team ships code with confidence, infra changes are reviewable, and the bill stays predictable instead of a quarterly surprise.",
    tags: ["Cloud", "Hosting", "DevOps", "CI/CD", "AWS"],
    industries: ["Technology", "SaaS", "E-commerce", "Media"],
    deliveryType: "subscription",
    timeline: "Ongoing",
    rating: 4.8,
    reviews: 76,
    popularity: 84,
    capabilities: [
      "Cloud environment architecture (AWS, GCP, Azure)",
      "Infrastructure as code with Terraform",
      "CI/CD pipelines with review gates",
      "Observability, alerting, and incident response",
      "Cost monitoring and FinOps guardrails",
    ],
    deliverables: [
      "Production cloud environment configured",
      "Terraform repository and pipeline",
      "Observability dashboard and alerting",
      "Cost report and optimization roadmap",
    ],
    process: [
      { title: "Assess", description: "Audit current cloud footprint and deployment workflows." },
      { title: "Architect", description: "Design environments, networking, and CI/CD pipelines." },
      { title: "Build", description: "Deploy infrastructure as code and pipelines." },
      { title: "Operate", description: "Monitor, optimize cost, and respond to incidents." },
    ],
    problemsSolved: [
      "Slow, manual deployments blocking releases",
      "Cloud bills nobody can explain",
      "No observability when things break",
      "Snowflake environments no one dares touch",
    ],
    faqs: [
      { question: "Which clouds do you support?", answer: "AWS, GCP, and Azure — we pick based on your workload, cost profile, and existing footprint." },
      { question: "Is everything delivered as code?", answer: "Yes — Terraform modules, pipeline configs, and runbooks so your team can review and extend everything." },
      { question: "How do you keep costs predictable?", answer: "Budgets, anomaly alerts, rightsizing reviews, and tagging hygiene from day one — cost surprises are caught early, not at month-end." },
      { question: "Can you take over an existing environment?", answer: "Yes — we audit the current state, codify what's there, and bring it under IaC and CI/CD without downtime." },
    ],
  }),

  // 13
  srv(13, {
    name: "iOS & Android Mobile App Design and Development for High-Performance Applications",
    categoryId: "cat-tech-programming",
    subcategoryId: "sub-tech-mobile",
    icon: "Smartphone",
    accent: ACCENT.tech,
    shortDescription:
      "iOS and Android mobile app design and development built for performance, scale, and a delightful user experience.",
    fullDescription:
      "We design and build native and cross-platform mobile apps that users actually love. From product discovery and UX through engineering, testing, and App Store submission, we own the full mobile lifecycle so you ship an app that's fast, reliable, and ready to scale — without surprises at review time.",
    tags: ["Mobile", "iOS", "Android", "React Native", "App Development"],
    industries: ["SaaS", "Retail", "Healthcare", "Media"],
    deliveryType: "project",
    timeline: "10–16 weeks",
    rating: 4.9,
    reviews: 104,
    popularity: 92,
    featured: true,
    capabilities: [
      "Product discovery and UX design",
      "Native iOS and Android engineering",
      "Cross-platform with React Native or Flutter",
      "Backend API and offline-first architecture",
      "App Store submission and review management",
    ],
    deliverables: [
      "Production mobile app deployed to stores",
      "UX design system and component library",
      "Backend API and data layer",
      "Release playbook and analytics instrumentation",
    ],
    process: [
      { title: "Discover", description: "User research, flows, and product definition." },
      { title: "Design", description: "UX and visual design with interactive prototypes." },
      { title: "Build", description: "Engineering sprints with weekly demos." },
      { title: "Ship", description: "Test, submit, and launch with analytics instrumentation." },
    ],
    problemsSolved: [
      "App ideas stuck in pitch decks for years",
      "Apps that crash, drain battery, or feel slow",
      "App Store rejections blocking launch",
      "No analytics to inform product decisions",
    ],
    faqs: [
      { question: "Native or cross-platform?", answer: "We recommend based on your requirements — cross-platform (React Native or Flutter) is usually faster and cheaper; native is better for performance-critical apps." },
      { question: "Do you handle App Store submission?", answer: "Yes — we own the full submission process including assets, listing copy, and review responses so launch isn't blocked by app store quirks." },
      { question: "What does the backend look like?", answer: "A scalable API layer with offline-first patterns where the app needs to work without connectivity, plus push notifications and analytics." },
      { question: "Can you take over an existing app?", answer: "Yes — we audit the codebase, document the state, and bring it under CI/CD with a stabilization roadmap." },
    ],
  }),

  // 14
  srv(14, {
    name: "Custom Software Design & Development for Scalable Enterprise Applications",
    categoryId: "cat-tech-programming",
    subcategoryId: "sub-tech-software",
    icon: "Code2",
    accent: ACCENT.tech,
    shortDescription:
      "Custom software products, internal systems, and enterprise applications built by senior engineering teams.",
    fullDescription:
      "We design and build custom software products and internal systems for companies that need more than off-the-shelf tools can deliver. From product discovery through architecture, engineering, and ongoing delivery, our senior teams ship software that's reliable, maintainable, and aligned to your actual workflows.",
    tags: ["Software", "Custom Development", "Engineering", "Product", "Enterprise"],
    industries: ["Technology", "Financial Services", "Healthcare", "Professional Services"],
    deliveryType: "project",
    timeline: "12–24 weeks",
    rating: 4.8,
    reviews: 92,
    popularity: 88,
    capabilities: [
      "Product discovery and specification",
      "Architecture and system design",
      "Full-stack engineering with code reviews",
      "Testing, CI/CD, and deployment automation",
      "Ongoing delivery and product iteration",
    ],
    deliverables: [
      "Production software deployed to your environment",
      "Architecture documentation and runbooks",
      "Test suite and CI/CD pipeline",
      "Release playbook and operator training",
    ],
    process: [
      { title: "Discover", description: "Product discovery, requirements, and success metrics." },
      { title: "Architect", description: "System design, tech stack, and integration plan." },
      { title: "Build", description: "Agile sprints with weekly demos and code reviews." },
      { title: "Ship", description: "Deploy, train operators, and iterate on feedback." },
    ],
    problemsSolved: [
      "Internal systems that don't fit your workflows",
      "Off-the-shelf tools that hit a wall at scale",
      "Engineering capacity gaps blocking roadmap",
      "Spaghetti codebases no one wants to touch",
    ],
    faqs: [
      { question: "What kinds of software do you build?", answer: "Internal tools, customer-facing SaaS products, marketplaces, workflow platforms, and enterprise applications — anything where off-the-shelf isn't enough." },
      { question: "How do we know the code is good?", answer: "Every PR is reviewed by a senior engineer, the test suite is part of CI, and the architecture is documented before the first line of code ships." },
      { question: "Do we own the code?", answer: "Yes — all source code, infrastructure configs, and documentation are yours from day one." },
      { question: "Can you take over an existing codebase?", answer: "Yes — we audit the state, document the path forward, and bring it under control with tests, CI, and a stabilization roadmap." },
    ],
  }),

  // 15
  srv(15, {
    name: "API Development & Integration Services for Connected System Stacks",
    categoryId: "cat-tech-programming",
    subcategoryId: "sub-tech-api",
    icon: "Plug",
    accent: ACCENT.tech,
    shortDescription:
      "API strategy, development, and integration services for connecting your entire stack — internal, partner, and public.",
    fullDescription:
      "We design and build the API layer that connects your systems, partners, and customer-facing apps. From strategy and spec through engineering, documentation, and lifecycle management, we ship APIs that are reliable, well-documented, and ready to scale — with the governance your team needs to evolve them safely.",
    tags: ["API", "Integration", "REST", "GraphQL", "Backend"],
    industries: ["Technology", "Financial Services", "Retail", "Healthcare"],
    deliveryType: "project",
    timeline: "6–12 weeks",
    rating: 4.8,
    reviews: 64,
    popularity: 78,
    capabilities: [
      "API strategy and design (REST, GraphQL, gRPC)",
      "Authentication, authorization, and rate limiting",
      "Documentation with OpenAPI and developer portals",
      "Versioning, deprecation, and lifecycle management",
      "Integration with internal and partner systems",
    ],
    deliverables: [
      "Production API deployed with documentation",
      "OpenAPI spec and developer portal",
      "Auth, rate limiting, and observability",
      "Integration examples and SDKs",
    ],
    process: [
      { title: "Strategize", description: "Define API consumers, use cases, and design constraints." },
      { title: "Design", description: "Spec the API with OpenAPI and review with stakeholders." },
      { title: "Build", description: "Engineer with tests, auth, and observability." },
      { title: "Ship", description: "Deploy, document, and onboard first consumers." },
    ],
    problemsSolved: [
      "Internal systems that can't talk to each other",
      "Partner integrations taking months each",
      "Undocumented APIs that scare off developers",
      "Version sprawl with no deprecation policy",
    ],
    faqs: [
      { question: "REST, GraphQL, or gRPC?", answer: "We recommend based on your use case — REST for broad compatibility, GraphQL for flexible client queries, gRPC for internal high-throughput services." },
      { question: "How do you document the API?", answer: "OpenAPI spec auto-generated from code, a developer portal with examples, and SDKs for the languages your consumers actually use." },
      { question: "Can you handle auth and rate limiting?", answer: "Yes — OAuth 2.0, API keys, JWT, scoped tokens, and rate limiting per consumer or per endpoint." },
      { question: "How do you handle versioning?", answer: "Explicit versioning in the URL or header, a documented deprecation policy, and consumer analytics so you know when it's safe to retire an old version." },
    ],
  }),

  // =========================================================
  // DIVISION 4 — Multimedia & Graphic Design (cat-multimedia-ai)
  // =========================================================

  // 16
  srv(16, {
    name: "Graphic Design & Branding Services for Distinctive Visual Identity",
    categoryId: "cat-multimedia-ai",
    subcategoryId: "sub-mm-social",
    icon: "Palette",
    accent: ACCENT.multimedia,
    shortDescription:
      "Brand identity, logo design, and graphic design services for digital and print — built for consistency across every touchpoint.",
    fullDescription:
      "We design brand identities that hold up across every touchpoint — logos, color systems, typography, iconography, and templates your team actually uses. From startup identity refreshes to enterprise rebrands, every asset ships with documented guidelines so your brand stays consistent even as your team scales.",
    tags: ["Branding", "Logo Design", "Graphic Design", "Identity", "Visual Design"],
    industries: ["SaaS", "Retail", "Consumer Goods", "Media"],
    deliveryType: "project",
    timeline: "4–8 weeks",
    rating: 4.8,
    reviews: 86,
    popularity: 84,
    capabilities: [
      "Logo and visual identity design",
      "Color, typography, and iconography systems",
      "Brand guidelines and usage documentation",
      "Marketing collateral templates",
      "Print and packaging design",
    ],
    deliverables: [
      "Brand identity system with logo files",
      "Brand guidelines document",
      "Marketing collateral templates",
      "Print-ready artwork for key assets",
    ],
    process: [
      { title: "Discover", description: "Brand audit, audience research, and positioning workshop." },
      { title: "Design", description: "Identity concepts, refinement, and final system." },
      { title: "Document", description: "Brand guidelines and template library." },
      { title: "Hand Over", description: "Asset pack, training, and ongoing support." },
    ],
    problemsSolved: [
      "Brand assets scattered across drives and decks",
      "No guidelines so every team reinvents the brand",
      "Logos that don't scale across touchpoints",
      "Templates that no one knows how to use",
    ],
    faqs: [
      { question: "Do you own the rights to the designs?", answer: "No — all rights transfer to you on final delivery. You own the brand outright." },
      { question: "Can you work with our existing brand?", answer: "Yes — we can refresh, extend, or build a complete identity depending on where you are in your brand journey." },
      { question: "What file formats do we get?", answer: "Vector source files (AI, SVG), raster exports (PNG, JPG), print-ready PDFs, and web-optimized versions — all organized in a brand pack." },
      { question: "Do you provide ongoing design support?", answer: "Yes — retainer options are available for ongoing design work after the identity ships." },
    ],
  }),

  // 17
  srv(17, {
    name: "Multimedia Production Services for Video, Audio, and Motion Graphics",
    categoryId: "cat-multimedia-ai",
    subcategoryId: "sub-mm-video",
    icon: "Clapperboard",
    accent: ACCENT.multimedia,
    shortDescription:
      "Full-cycle multimedia production — video, audio, motion graphics, and animation produced for brand and campaign.",
    fullDescription:
      "We produce multimedia end-to-end: brand films, product videos, motion graphics, animation, podcasts, and audio content. From script through shoot, edit, and delivery, every asset is produced to broadcast quality and optimized for the channels where your audience actually consumes it.",
    tags: ["Video Production", "Multimedia", "Animation", "Motion Graphics", "Audio"],
    industries: ["Media", "Retail", "SaaS", "Consumer Goods"],
    deliveryType: "project",
    timeline: "4–10 weeks",
    rating: 4.8,
    reviews: 58,
    popularity: 76,
    capabilities: [
      "Brand films and product videos",
      "Motion graphics and animation",
      "Podcast production and audio engineering",
      "Live action and studio shoots",
      "Channel-optimized delivery (web, social, broadcast)",
    ],
    deliverables: [
      "Final multimedia assets in required formats",
      "Source project files and rushes",
      "Caption and subtitle tracks",
      "Channel-optimized versions for distribution",
    ],
    process: [
      { title: "Concept", description: "Creative brief, script, and treatment." },
      { title: "Produce", description: "Shoot, record, and capture source assets." },
      { title: "Edit", description: "Post-production, sound, and color." },
      { title: "Deliver", description: "Final masters and channel-optimized versions." },
    ],
    problemsSolved: [
      "In-house team lacks video production capacity",
      "Brand films that look amateur or off-brand",
      "Assets not optimized for the channels where they'll run",
      "No source files so future edits are impossible",
    ],
    faqs: [
      { question: "Do you handle shoots or just post-production?", answer: "Both — we run the full production including directing, crew, gear, and location, or we can take existing footage and handle post only." },
      { question: "What deliverable formats do we get?", answer: "Broadcast-quality masters, web-optimized versions, social cuts, subtitles in multiple languages, and source project files for future edits." },
      { question: "Can you produce episodic content?", answer: "Yes — we handle multi-episode series including scheduling, recurring formats, and ongoing delivery cadence." },
      { question: "How do you keep production on brand?", answer: "Every project starts with a creative brief and brand alignment check, with review gates before shoot and before final delivery." },
    ],
  }),

  // 18
  srv(18, {
    name: "Visual Content & Marketing Assets for High-Conversion Paid Campaigns",
    categoryId: "cat-multimedia-ai",
    subcategoryId: "sub-mm-image",
    icon: "Image",
    accent: ACCENT.multimedia,
    shortDescription:
      "High-volume visual content and marketing assets for paid and organic campaigns — on-brand, on-deadline, at scale.",
    fullDescription:
      "We produce high-volume visual content for paid and organic campaigns: ad creative, social posts, display banners, email headers, and landing page visuals. Production is built for speed and scale — briefs in, brand-aligned assets out, with a review loop that keeps quality high even at hundreds of assets per month.",
    tags: ["Marketing Assets", "Visual Content", "Ad Creative", "Social Media", "Design"],
    industries: ["E-commerce", "SaaS", "Retail", "Consumer Goods"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.7,
    reviews: 72,
    popularity: 80,
    capabilities: [
      "Ad creative for paid social and display",
      "Social media post and story templates",
      "Email headers and landing page visuals",
      "Display banners in all standard sizes",
      "Brand-aligned templated production",
    ],
    deliverables: [
      "Monthly asset packs organized by campaign",
      "Editable source files for templates",
      "Channel-optimized exports",
      "Brand compliance review on every asset",
    ],
    process: [
      { title: "Brief", description: "Campaign brief, channel mix, and asset list." },
      { title: "Produce", description: "Templates and variations produced in sprints." },
      { title: "Review", description: "Brand and stakeholder review with revisions." },
      { title: "Deliver", description: "Channel-organized asset pack ready to ship." },
    ],
    problemsSolved: [
      "Campaigns blocked waiting for ad creative",
      "Off-brand assets slipping through review",
      "No templates so every asset starts from scratch",
      "Asset sprawl across drives and platforms",
    ],
    faqs: [
      { question: "How many assets can you produce per month?", answer: "Tens to hundreds depending on complexity — retainer packages scale with your campaign volume." },
      { question: "Do you handle variations for A/B testing?", answer: "Yes — we produce multiple variants per format so your growth team can test hooks, visuals, and CTAs without waiting on creative." },
      { question: "Can you take our existing brand guidelines?", answer: "Yes — we work to your documented guidelines and add a brand compliance review on every asset before delivery." },
      { question: "How fast is turnaround?", answer: "Standard turnaround is 3–5 business days per batch; rush options are available for campaign-critical work." },
    ],
  }),

  // 19
  srv(19, {
    name: "UI/UX & Digital Design Services for Web, Mobile, and SaaS Products",
    categoryId: "cat-tech-programming",
    subcategoryId: "sub-brand-uiux",
    icon: "Figma",
    accent: ACCENT.multimedia,
    shortDescription:
      "Research-driven UI/UX design for web, mobile, and SaaS products — built around real user behavior, not opinion.",
    fullDescription:
      "We design product experiences that are grounded in user research and shipped as design systems engineers can actually build. From discovery and journey maps through wireframes, prototypes, and a documented component library, every screen is justified by data and ready to hand off.",
    tags: ["UI/UX", "Product Design", "Design Systems", "Research", "Prototyping"],
    industries: ["SaaS", "Fintech", "Healthcare", "E-commerce"],
    deliveryType: "project",
    timeline: "6–12 weeks",
    rating: 4.8,
    reviews: 80,
    popularity: 84,
    capabilities: [
      "User research and journey mapping",
      "Wireframes and interactive prototypes",
      "UI design with documented design system",
      "Usability testing and iteration",
      "Engineering handoff with specs and assets",
    ],
    deliverables: [
      "Research findings and journey maps",
      "High-fidelity UI in Figma or Sketch",
      "Component library and design tokens",
      "Engineering handoff documentation",
    ],
    process: [
      { title: "Research", description: "User interviews, analytics review, and journey mapping." },
      { title: "Design", description: "Wireframes, prototypes, and high-fidelity UI." },
      { title: "Test", description: "Usability testing with target users and iteration." },
      { title: "Hand Off", description: "Design system, specs, and engineering onboarding." },
    ],
    problemsSolved: [
      "Products designed on opinion instead of user research",
      "Designs that engineers can't build cleanly",
      "No design system so every screen is bespoke",
      "UX issues caught in production, not in prototype",
    ],
    faqs: [
      { question: "Do you work in Figma or Sketch?", answer: "Both — we default to Figma for collaboration but can deliver in Sketch if your team prefers." },
      { question: "Do you include user research?", answer: "Yes — every engagement starts with research, whether that's user interviews, analytics review, or usability testing on prototypes." },
      { question: "Can you build a design system from scratch?", answer: "Yes — component library, design tokens, usage guidelines, and an engineering handoff so the system is actually adopted." },
      { question: "Do you work with our engineering team?", answer: "Yes — we hand off specs, attend standups, and stay engaged through implementation to keep design intent intact." },
    ],
  }),

  // 20
  srv(20, {
    name: "AI Video & Audio Production for Synthetic Voiceovers and Ad Creative",
    categoryId: "cat-multimedia-ai",
    subcategoryId: "sub-mm-audio",
    icon: "Video",
    accent: ACCENT.multimedia,
    shortDescription:
      "AI-generated video ads, synthetic voiceovers, music, and podcast production — brand-safe and rights-cleared.",
    fullDescription:
      "We produce video and audio at AI speed without sacrificing brand safety: AI-generated ad creative, synthetic voiceovers, royalty-free music, and full podcast production. Every asset is rights-cleared for commercial use and reviewed by humans before delivery so quality never slips.",
    tags: ["AI Video", "Synthetic Voice", "Audio Production", "Podcast", "Music"],
    industries: ["Media", "Retail", "SaaS", "E-commerce"],
    deliveryType: "project",
    timeline: "2–6 weeks",
    rating: 4.7,
    reviews: 48,
    popularity: 74,
    capabilities: [
      "AI video generation for ads and explainers",
      "Synthetic voiceover in multiple languages",
      "Royalty-free music and sound design",
      "Podcast production and editing",
      "Human review and brand compliance",
    ],
    deliverables: [
      "Final video and audio assets",
      "Voiceover source files and stems",
      "Caption and subtitle tracks",
      "Brand compliance review documentation",
    ],
    process: [
      { title: "Brief", description: "Script, format, and brand alignment check." },
      { title: "Generate", description: "AI generation with human review gates." },
      { title: "Polish", description: "Sound design, color, and final cut." },
      { title: "Deliver", description: "Final assets with rights documentation." },
    ],
    problemsSolved: [
      "Video production too slow for campaign cadence",
      "Voiceover budget eating into creative spend",
      "No multilingual content without re-recording",
      "Rights unclear on AI-generated assets",
    ],
    faqs: [
      { question: "Are AI-generated assets rights-cleared for commercial use?", answer: "Yes — every asset is produced with licensed tools and reviewed for commercial safety, with documentation you can show to legal." },
      { question: "Can you produce voiceovers in multiple languages?", answer: "Yes — synthetic voiceovers in 30+ languages, with native-speaker review for the markets where quality matters most." },
      { question: "How does quality compare to traditional production?", answer: "AI production matches traditional quality for most ad and explainer formats — we recommend traditional production only for hero brand films." },
      { question: "Can we provide the script?", answer: "Yes — you can supply a finished script or have us write one as part of the engagement." },
    ],
  }),

  // =========================================================
  // DIVISION 5 — Digital Sales & AI Marketing (cat-digital-sales-marketing)
  // =========================================================

  // 21
  srv(21, {
    name: "AI-Driven Marketing Personalization for Email, Web, and Ad Channels",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-lifecycle",
    icon: "Megaphone",
    accent: ACCENT.dsm,
    shortDescription:
      "AI-powered marketing personalization across email, web, and ad channels — segment-of-one targeting at scale.",
    fullDescription:
      "We build the personalization engine that turns generic campaigns into segment-of-one experiences: dynamic email content, web personalization, ad creative tailored to behavior, and product recommendations that actually convert. Built on your existing stack with measurable lift from day one.",
    tags: ["Personalization", "AI Marketing", "Lifecycle", "Email", "Recommendations"],
    industries: ["E-commerce", "SaaS", "Retail", "Media"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.8,
    reviews: 70,
    popularity: 82,
    capabilities: [
      "Behavioral segmentation and journey design",
      "Dynamic email and web personalization",
      "Product recommendation engine",
      "Ad creative tailored to segments",
      "A/B testing and continuous optimization",
    ],
    deliverables: [
      "Personalization engine deployed in your stack",
      "Segment library and journey templates",
      "Recommendation model and serving layer",
      "Lift dashboard and reporting",
    ],
    process: [
      { title: "Audit", description: "Review current segmentation, content, and stack." },
      { title: "Design", description: "Segmentation strategy and personalization architecture." },
      { title: "Build", description: "Deploy engine and integrate with channels." },
      { title: "Optimize", description: "A/B test, refine segments, and report on lift." },
    ],
    problemsSolved: [
      "Generic campaigns with low engagement",
      "No personalization because it's too hard to operationalize",
      "Recommendations that don't reflect user behavior",
      "No measurable lift from marketing spend",
    ],
    faqs: [
      { question: "Which platforms do you integrate with?", answer: "HubSpot, Marketo, Klaviyo, Braze, Salesforce Marketing Cloud, and Optimizely out of the box; we can build against others." },
      { question: "How do you measure lift?", answer: "We run holdout groups so you see incremental lift, not just correlation — every personalization initiative reports actual revenue impact." },
      { question: "Is personalization privacy-compliant?", answer: "Yes — we work within GDPR, CCPA, and your consent framework, with first-party data prioritized over third-party." },
      { question: "How long until we see results?", answer: "Most engagements show measurable lift within 6–8 weeks as personalization deploys across email, web, and ads." },
    ],
  }),

  // 22
  srv(22, {
    name: "AI-Powered Sales Enablement with SDRs and Outbound Pipeline Engines",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-aisdr",
    icon: "TrendingUp",
    accent: ACCENT.dsm,
    shortDescription:
      "AI SDRs, sales intelligence, and outbound pipeline engines for revenue teams — qualified meetings on autopilot.",
    fullDescription:
      "We build the AI-powered outbound engine that fills your sales team's calendar with qualified meetings: AI SDRs that prospect and book, sales intelligence that surfaces buying signals, and outbound orchestration across email, LinkedIn, and phone. Built on your CRM with attribution tied to closed revenue.",
    tags: ["AI SDR", "Sales", "Outbound", "Pipeline", "Sales Intelligence"],
    industries: ["SaaS", "B2B Services", "Financial Services", "Professional Services"],
    deliveryType: "subscription",
    timeline: "Ongoing",
    rating: 4.8,
    reviews: 96,
    popularity: 90,
    featured: true,
    capabilities: [
      "AI SDR for prospecting and booking",
      "Sales intelligence and buying signal tracking",
      "Multi-channel outbound (email, LinkedIn, phone)",
      "CRM integration with attribution to revenue",
      "Continuous optimization of messaging and targeting",
    ],
    deliverables: [
      "AI SDR deployed and integrated with CRM",
      "Outbound sequences and playbook",
      "Sales intelligence dashboard",
      "Pipeline and revenue attribution report",
    ],
    process: [
      { title: "Strategize", description: "ICP definition, channel mix, and targeting plan." },
      { title: "Build", description: "Deploy AI SDR and integrate with CRM." },
      { title: "Launch", description: "Start outbound with monitoring and tuning." },
      { title: "Scale", description: "Expand ICP, channels, and messaging variants." },
    ],
    problemsSolved: [
      "SDRs spending time on manual prospecting",
      "Outbound sequences that don't get replies",
      "No visibility into buying signals",
      "Pipeline attribution disconnected from revenue",
    ],
    faqs: [
      { question: "Will the AI SDR replace our SDR team?", answer: "It augments — handles the manual prospecting so your SDRs focus on qualified conversations. Most teams scale outbound without scaling headcount." },
      { question: "Which channels does it cover?", answer: "Email, LinkedIn, and phone — orchestrated so each touch builds on the last across channels." },
      { question: "How do you keep outbound from being spam?", answer: "We target tightly to your ICP, personalize every message, and respect frequency caps so you stay on the right side of deliverability and reputation." },
      { question: "How is success measured?", answer: "Meetings booked, qualified pipeline created, and closed revenue tied back to outbound — full attribution from first touch to close." },
    ],
  }),

  // 23
  srv(23, {
    name: "Conversational Marketing & Engagement Automation for Lead Nurturing",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-social",
    icon: "MessageSquare",
    accent: ACCENT.dsm,
    shortDescription:
      "Chatbots, conversational marketing, and customer engagement automation that convert visitors and retain customers.",
    fullDescription:
      "We build conversational experiences that actually convert — website chatbots that qualify and route, conversational marketing flows that engage visitors in real time, and customer engagement automation that drives retention across channels. Built on your stack with attribution to pipeline and retention.",
    tags: ["Chatbots", "Conversational Marketing", "Engagement", "Automation", "Retention"],
    industries: ["SaaS", "E-commerce", "B2B Services", "Financial Services"],
    deliveryType: "project",
    timeline: "4–8 weeks",
    rating: 4.7,
    reviews: 62,
    popularity: 76,
    capabilities: [
      "Website chatbots for qualification and routing",
      "Conversational marketing flows",
      "Multi-channel engagement automation",
      "Retention and lifecycle messaging",
      "Attribution to pipeline and retention",
    ],
    deliverables: [
      "Conversational flows deployed on your channels",
      "Routing and qualification logic integrated with CRM",
      "Engagement automation playbooks",
      "Performance dashboard with attribution",
    ],
    process: [
      { title: "Map", description: "Identify conversational touchpoints and goals." },
      { title: "Design", description: "Flow design, routing, and integration plan." },
      { title: "Build", description: "Deploy flows with monitoring and tuning." },
      { title: "Optimize", description: "A/B test and refine based on outcomes." },
    ],
    problemsSolved: [
      "Visitors bouncing without engaging",
      "Manual chat that doesn't scale off-hours",
      "No retention automation beyond basic email",
      "Engagement disconnected from pipeline",
    ],
    faqs: [
      { question: "Which chatbot platforms do you build on?", answer: "Intercom, Drift, HubSpot, and custom — we pick based on your stack and integration needs." },
      { question: "Can it route to humans?", answer: "Yes — qualification logic routes to the right rep with full conversation context, so the handoff is seamless." },
      { question: "Does it handle off-hours?", answer: "Yes — the bot handles off-hours volume, qualifies leads, and queues conversations for reps when they're back online." },
      { question: "How do you measure success?", answer: "Engagement rate, conversion rate from chat, pipeline attributed to conversations, and retention lift from engagement automation." },
    ],
  }),

  // 24
  srv(24, {
    name: "Marketing Analytics & ROI Optimization for Multi-Channel Attribution",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-cro",
    icon: "BarChart3",
    accent: ACCENT.dsm,
    shortDescription:
      "Marketing analytics, attribution, and ROI optimization for every channel — closed-loop from spend to revenue.",
    fullDescription:
      "We build the analytics and attribution layer that shows exactly what's driving revenue — multi-touch attribution, channel ROI, funnel analytics, and the optimization playbook that follows. You stop guessing about what's working and start reallocating spend based on incremental revenue, not vanity metrics.",
    tags: ["Analytics", "Attribution", "ROI", "Optimization", "Marketing"],
    industries: ["SaaS", "E-commerce", "B2B Services", "Financial Services"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.8,
    reviews: 58,
    popularity: 80,
    capabilities: [
      "Multi-touch attribution modeling",
      "Channel and campaign ROI analysis",
      "Funnel analytics and conversion optimization",
      "Incrementality testing and spend reallocation",
      "Executive dashboards and weekly insights",
    ],
    deliverables: [
      "Attribution model deployed in your analytics stack",
      "Channel ROI dashboard",
      "Optimization playbook with reallocation recommendations",
      "Weekly insights report and review call",
    ],
    process: [
      { title: "Audit", description: "Review analytics stack, attribution, and current measurement." },
      { title: "Build", description: "Deploy attribution model and dashboards." },
      { title: "Optimize", description: "Run incrementality tests and reallocate spend." },
      { title: "Report", description: "Weekly insights and executive review." },
    ],
    problemsSolved: [
      "No idea which channels actually drive revenue",
      "Attribution based on last-click, ignoring real contribution",
      "Spend allocated by opinion, not by ROI",
      "Dashboards nobody trusts or uses",
    ],
    faqs: [
      { question: "What attribution model do you use?", answer: "Multi-touch with custom weights tuned to your funnel — we don't force last-click or first-click on you blindly." },
      { question: "Which analytics tools do you work with?", answer: "GA4, Mixpanel, Amplitude, Segment, and warehouse-native approaches via dbt and Looker." },
      { question: "How do you measure incrementality?", answer: "Holdout tests and geo experiments so you see actual lift, not just correlation — real spend reallocation grounded in real numbers." },
      { question: "How often do we get insights?", answer: "Weekly insights report and review call, plus on-demand analysis for campaign decisions." },
    ],
  }),

  // 25
  srv(25, {
    name: "SEO & Answer Engine Optimization (AEO) for Google AI Overviews and Perplexity",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-seo",
    icon: "Search",
    accent: ACCENT.dsm,
    shortDescription:
      "SEO and AEO (Answer Engine Optimization) for Google, Perplexity, ChatGPT, and AI overviews — visibility where buyers ask.",
    fullDescription:
      "We optimize your content for both classic search and the answer engines buyers actually use — Google AI Overviews, Perplexity, ChatGPT, and Bing Copilot. From technical SEO through content strategy and structured data, every initiative is tied to measurable visibility, traffic, and pipeline — not vanity rankings.",
    tags: ["SEO", "AEO", "Answer Engines", "Content", "Structured Data"],
    industries: ["SaaS", "B2B Services", "E-commerce", "Healthcare"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.9,
    reviews: 84,
    popularity: 88,
    capabilities: [
      "Technical SEO audits and remediation",
      "Answer-engine optimization for AI overviews",
      "Content strategy and topic clusters",
      "Schema markup and structured data",
      "Visibility and traffic attribution reporting",
    ],
    deliverables: [
      "Technical SEO audit and remediation roadmap",
      "Content strategy with prioritized topics",
      "Schema markup implementation",
      "Monthly visibility and traffic report",
    ],
    process: [
      { title: "Audit", description: "Technical SEO, content, and answer-engine visibility audit." },
      { title: "Plan", description: "Content strategy and optimization roadmap." },
      { title: "Execute", description: "Technical fixes, content production, and schema." },
      { title: "Report", description: "Monthly visibility and traffic attribution." },
    ],
    problemsSolved: [
      "Lost visibility as AI overviews displace classic results",
      "Content that ranks but doesn't drive pipeline",
      "Technical SEO debt blocking rankings",
      "No structured data so AI engines can't cite you",
    ],
    faqs: [
      { question: "What's the difference between SEO and AEO?", answer: "SEO optimizes for classic search results. AEO optimizes for answer engines — AI overviews, Perplexity, ChatGPT — where the goal is to be cited as the source." },
      { question: "How do you measure answer-engine visibility?", answer: "We track citations and mentions across AI overviews and answer engines for your priority queries, alongside classic rankings and traffic." },
      { question: "How long until we see results?", answer: "Technical fixes show impact within 4–8 weeks; content and authority initiatives compound over 3–6 months." },
      { question: "Can you handle technical SEO and content?", answer: "Both — we run the full program including technical remediation, content production, schema markup, and ongoing reporting." },
    ],
  }),

  // =========================================================
  // DIVISION 6 — Business & Enterprise Services (cat-business-enterprise)
  // =========================================================

  // 26
  srv(26, {
    name: "Business Process & Workflow Automation for Operations and Finance",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-crm",
    icon: "Workflow",
    accent: ACCENT.business,
    shortDescription:
      "Automate business processes and workflows across operations, finance, and admin — measurable cycle-time reduction.",
    fullDescription:
      "We automate the business processes slowing your operations, finance, and admin teams — approvals, reconciliations, reporting, and case management. Each workflow is instrumented with audit logs and exception handling so work actually gets done with full visibility, not lost in inboxes.",
    tags: ["Process Automation", "Workflow", "Business", "Operations", "Efficiency"],
    industries: ["Financial Services", "Healthcare", "Professional Services", "Manufacturing"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.8,
    reviews: 76,
    popularity: 84,
    capabilities: [
      "Process discovery and opportunity scoring",
      "Workflow automation with audit logging",
      "Integration with ERP, CRM, and ticketing",
      "Exception handling and escalation",
      "Cycle-time analytics and reporting",
    ],
    deliverables: [
      "Automated workflows deployed in your stack",
      "Integration connectors and runbooks",
      "Exception monitoring dashboard",
      "Cycle-time analytics report",
    ],
    process: [
      { title: "Discover", description: "Map processes and identify automation opportunities." },
      { title: "Design", description: "Architect workflows, integrations, and exceptions." },
      { title: "Build", description: "Deploy with monitoring and operator training." },
      { title: "Optimize", description: "Tune exception handling and report on cycle-time lift." },
    ],
    problemsSolved: [
      "Approvals taking days instead of hours",
      "Work lost in inboxes and chat threads",
      "No visibility into where work is stuck",
      "Process knowledge locked in one person's head",
    ],
    faqs: [
      { question: "Which systems do you integrate with?", answer: "SAP, Oracle, NetSuite, Salesforce, HubSpot, ServiceNow, and Jira out of the box; we can build against custom systems as well." },
      { question: "How do you handle exceptions?", answer: "Exceptions route to a human with full context — the workflow pauses, escalates, and resumes once the exception is resolved." },
      { question: "Can we keep humans in the loop?", answer: "Yes — you choose which steps require human approval. Most workflows blend automation with human checkpoints at sensitive decisions." },
      { question: "How do we measure success?", answer: "Cycle time, exception rate, throughput, and audit completeness — all surfaced in a dashboard from day one." },
    ],
  }),

  // 27
  srv(27, {
    name: "Customer Experience & Sales Management for Enterprise CRM Programs",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-cx",
    icon: "HeartHandshake",
    accent: ACCENT.business,
    shortDescription:
      "CRM, CX programs, and customer experience management for enterprise teams — journey-led, measurable, retention-focused.",
    fullDescription:
      "We design and operate customer experience programs that drive retention and expansion: journey maps, voice-of-customer programs, CX metrics, and the operational workflows that turn insight into action. Built on your CRM and support stack with metrics tied to retention and lifetime value.",
    tags: ["CX", "Customer Experience", "CRM", "Retention", "Journey Mapping"],
    industries: ["SaaS", "Telecom", "Financial Services", "Healthcare"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.7,
    reviews: 64,
    popularity: 78,
    capabilities: [
      "Customer journey mapping and design",
      "Voice-of-customer program operation",
      "CX metrics (NPS, CSAT, CES) instrumentation",
      "Retention and expansion playbook",
      "CRM and support stack integration",
    ],
    deliverables: [
      "Customer journey maps and CX strategy",
      "VoC program with survey and feedback loops",
      "CX dashboard with retention attribution",
      "Retention playbook with operator training",
    ],
    process: [
      { title: "Audit", description: "Map journeys, review metrics, and identify gaps." },
      { title: "Design", description: "CX strategy, metrics, and program design." },
      { title: "Operate", description: "Run VoC, monitor metrics, and trigger interventions." },
      { title: "Optimize", description: "Refine journeys and report on retention lift." },
    ],
    problemsSolved: [
      "Retention issues caught only at renewal",
      "No voice-of-customer feedback loop",
      "CX metrics disconnected from revenue",
      "Journeys designed by opinion, not data",
    ],
    faqs: [
      { question: "Which CX metrics do you track?", answer: "NPS, CSAT, CES as the core, plus journey-specific metrics tied to retention and expansion — all surfaced in a dashboard with revenue attribution." },
      { question: "Do you handle the surveys?", answer: "Yes — survey design, deployment, and analysis across email, in-app, and post-interaction channels." },
      { question: "How do you connect CX to revenue?", answer: "We tie CX metrics to retention, expansion, and churn so you see actual revenue impact, not vanity scores." },
      { question: "Can you work with our existing CRM?", answer: "Yes — Salesforce, HubSpot, Zendesk, Intercom, and custom stacks; the CX program runs on top of what you already use." },
    ],
  }),

  // 28
  srv(28, {
    name: "Business Intelligence & Data Analytics for Enterprise Decision Making",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-bi",
    icon: "Database",
    accent: ACCENT.business,
    shortDescription:
      "Data pipelines, warehouses, BI dashboards, and decision analytics platforms — one source of truth, decisions made faster.",
    fullDescription:
      "We design and deploy the data infrastructure that makes your business legible: ingestion pipelines, warehouses, semantic layers, and dashboards your leaders actually trust. Decisions get made on data instead of opinion, and analytics shifts from reporting the past to recommending the next action.",
    tags: ["Data", "Analytics", "BI", "Warehouses", "Dashboards"],
    industries: ["Financial Services", "Retail", "Healthcare", "Manufacturing"],
    deliveryType: "project",
    timeline: "8–12 weeks",
    rating: 4.9,
    reviews: 88,
    popularity: 90,
    featured: true,
    capabilities: [
      "Data ingestion and warehouse architecture",
      "Semantic layer and KPI definitions",
      "Executive and operational dashboards",
      "Self-service analytics enablement",
      "Data governance and quality monitoring",
    ],
    deliverables: [
      "Production warehouse and pipeline code",
      "Executive dashboard suite",
      "Semantic layer and data dictionary",
      "Governance playbook and operator training",
    ],
    process: [
      { title: "Assess", description: "Inventory sources, define KPIs, and audit tooling." },
      { title: "Architect", description: "Design warehouse, semantic layer, and access patterns." },
      { title: "Build", description: "Deploy pipelines, dashboards, and governance." },
      { title: "Adopt", description: "Train teams and instrument adoption." },
    ],
    problemsSolved: [
      "Dashboards no one trusts or uses",
      "Data scattered across spreadsheets and SaaS",
      "Decisions made on gut feel because analytics is slow",
      "No single source of truth for KPIs",
    ],
    faqs: [
      { question: "Which warehouses do you build on?", answer: "Snowflake, BigQuery, Databricks, and Redshift — we pick based on your stack and cost profile." },
      { question: "Can our analysts extend the dashboards?", answer: "Yes — everything is delivered as code with documented semantic layers and a handover workshop so your team owns it." },
      { question: "How do you handle data governance?", answer: "Role-based access, classification, lineage tracking, and quality monitoring from day one, not as an afterthought." },
      { question: "What BI tools do you support?", answer: "Looker, Tableau, Power BI, Metabase, and warehouse-native approaches — we pick based on your team's needs." },
    ],
  }),

  // 29
  srv(29, {
    name: "Compliance, Security & Risk Management for Regulated Industries",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-security",
    icon: "ShieldCheck",
    accent: ACCENT.business,
    shortDescription:
      "Cybersecurity, compliance programs, and risk management for regulated industries — SOC 2, ISO 27001, HIPAA, and more.",
    fullDescription:
      "We design and operate cybersecurity and compliance programs that hold up to scrutiny: SOC 2, ISO 27001, HIPAA, PCI, GDPR, and CCPA. From gap assessment through control implementation, audit prep, and ongoing operations, we keep you audit-ready year-round instead of scrambling before each review.",
    tags: ["Security", "Compliance", "Risk Management", "Cybersecurity", "Audit"],
    industries: ["Financial Services", "Healthcare", "SaaS", "Technology"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.9,
    reviews: 72,
    popularity: 86,
    capabilities: [
      "Compliance gap assessment and roadmap",
      "Control implementation and evidence collection",
      "Audit prep and auditor liaison",
      "Risk assessment and mitigation program",
      "Ongoing monitoring and continuous compliance",
    ],
    deliverables: [
      "Compliance gap report and remediation roadmap",
      "Control documentation and evidence library",
      "Audit-ready posture with ongoing monitoring",
      "Risk register and quarterly review cadence",
    ],
    process: [
      { title: "Assess", description: "Gap assessment against target framework(s)." },
      { title: "Remediate", description: "Implement controls and collect evidence." },
      { title: "Audit", description: "Prepare for audit and liaison with auditor." },
      { title: "Operate", description: "Continuous monitoring and renewal readiness." },
    ],
    problemsSolved: [
      "Audit prep is a fire drill every cycle",
      "Compliance gaps no one knows about until audit",
      "Security incidents from missing controls",
      "Evidence scattered across tools and drives",
    ],
    faqs: [
      { question: "Which frameworks do you support?", answer: "SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR, CCPA, FedRAMP, and NIST CSF — and we can map controls across multiple frameworks for efficiency." },
      { question: "Can you handle audit prep?", answer: "Yes — we run the full audit prep including evidence collection, auditor liaison, and remediation tracking so your team isn't derailed." },
      { question: "How do you keep us audit-ready year-round?", answer: "Continuous compliance tooling (Vanta, Drata, or custom), evidence automation, and quarterly control reviews — no fire drills." },
      { question: "Do you handle incident response?", answer: "Yes — incident response playbooks, tabletop exercises, and on-call support so you're ready when something happens." },
    ],
  }),

  // 30
  srv(30, {
    name: "CRM & ERP Implementation Services for Salesforce, HubSpot, SAP, and Oracle",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-erp",
    icon: "Building2",
    accent: ACCENT.business,
    shortDescription:
      "CRM and ERP selection, implementation, and integration — Salesforce, HubSpot, SAP, Oracle delivered end-to-end.",
    fullDescription:
      "We implement CRM and ERP platforms end-to-end: selection, configuration, integration, data migration, training, and adoption. From first-time Salesforce rollouts to enterprise SAP migrations, we ship platforms that actually drive adoption instead of becoming shelf-ware.",
    tags: ["CRM", "ERP", "Salesforce", "HubSpot", "Implementation"],
    industries: ["Financial Services", "Manufacturing", "Professional Services", "Healthcare"],
    deliveryType: "project",
    timeline: "12–24 weeks",
    rating: 4.7,
    reviews: 92,
    popularity: 82,
    capabilities: [
      "CRM and ERP platform selection",
      "Configuration and customization",
      "Integration with existing systems",
      "Data migration and cleansing",
      "Training, change management, and adoption",
    ],
    deliverables: [
      "Production CRM/ERP deployed",
      "Configuration documentation and runbooks",
      "Integrated data flows with existing systems",
      "Adoption program with operator training",
    ],
    process: [
      { title: "Select", description: "Platform selection based on requirements and fit." },
      { title: "Configure", description: "Configuration, customization, and integration." },
      { title: "Migrate", description: "Data migration, cleansing, and validation." },
      { title: "Adopt", description: "Training, change management, and adoption program." },
    ],
    problemsSolved: [
      "CRM that no one actually uses",
      "ERP migrations that go years over schedule",
      "Data quality so poor the platform is useless",
      "Adoption stalls because change management was skipped",
    ],
    faqs: [
      { question: "Which platforms do you implement?", answer: "Salesforce, HubSpot, Microsoft Dynamics, SAP, Oracle, NetSuite, and Odoo — full lifecycle from selection through adoption." },
      { question: "Can you rescue a failed implementation?", answer: "Yes — we audit the current state, fix the highest-impact issues first, and bring the implementation back on track." },
      { question: "How do you handle data migration?", answer: "Cleansing, deduplication, validation, and rollback plans — we don't just lift and shift dirty data into the new platform." },
      { question: "Do you handle change management?", answer: "Yes — training, comms, champions program, and adoption metrics so the platform gets used, not just deployed." },
    ],
  }),

  // =========================================================
  // DIVISION 7 — Consultation & Solutions (cat-business-enterprise)
  // =========================================================

  // 31
  srv(31, {
    name: "Operational Consulting & Performance Solutions for Growing Businesses",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-cx",
    icon: "Gauge",
    accent: ACCENT.consulting,
    shortDescription:
      "Operational consulting and performance improvement programs for growing businesses — measurable efficiency gains.",
    fullDescription:
      "We run operational consulting and performance improvement engagements that deliver measurable efficiency gains: process redesign, capacity planning, cost takeout, and the operating model changes that stick. Every engagement starts with a diagnostic and ends with implemented change, not a slide deck.",
    tags: ["Operations", "Consulting", "Performance", "Efficiency", "Process"],
    industries: ["Manufacturing", "Healthcare", "Professional Services", "Retail"],
    deliveryType: "project",
    timeline: "8–16 weeks",
    rating: 4.8,
    reviews: 56,
    popularity: 76,
    capabilities: [
      "Operational diagnostic and benchmarking",
      "Process redesign and capacity planning",
      "Cost takeout and efficiency programs",
      "Operating model design and rollout",
      "Performance dashboard and KPI tracking",
    ],
    deliverables: [
      "Operational diagnostic report",
      "Redesigned processes with implementation plan",
      "Performance dashboard with KPIs",
      "Change management and adoption program",
    ],
    process: [
      { title: "Diagnose", description: "Operational diagnostic and benchmark against peers." },
      { title: "Design", description: "Redesigned processes and target operating model." },
      { title: "Implement", description: "Roll out changes with monitoring and tuning." },
      { title: "Sustain", description: "Performance dashboards and ongoing review cadence." },
    ],
    problemsSolved: [
      "Costs climbing without clear root cause",
      "Processes that don't scale with growth",
      "Capacity constraints blocking revenue",
      "No benchmarks to know if performance is good",
    ],
    faqs: [
      { question: "How is this different from strategy consulting?", answer: "We deliver implemented change, not slide decks. Every engagement ends with redesigned processes, deployed dashboards, and teams trained on the new way of working." },
      { question: "How do you measure success?", answer: "Cost reduction, cycle-time improvement, capacity gains, and throughput — all tracked in a dashboard you keep after the engagement ends." },
      { question: "Can you work alongside our existing ops team?", answer: "Yes — we partner with your operations leaders rather than replacing them, building internal capability as we go." },
      { question: "What does an engagement look like?", answer: "Diagnostic phase to identify opportunities, design phase to plan the changes, and implementation phase to roll them out — typically 8 to 16 weeks." },
    ],
  }),

  // 32
  srv(32, {
    name: "Governance, Risk & Compliance Consulting for Enterprise Organizations",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-security",
    icon: "Scale",
    accent: ACCENT.consulting,
    shortDescription:
      "Governance, risk, and compliance consulting for regulated and enterprise organizations — audit-ready, always.",
    fullDescription:
      "We help regulated and enterprise organizations build the governance, risk, and compliance programs that hold up to scrutiny: GRC frameworks, risk registers, policy programs, board reporting, and the operational rhythm that keeps you audit-ready year-round instead of scrambling before each review.",
    tags: ["GRC", "Risk", "Governance", "Compliance", "Consulting"],
    industries: ["Financial Services", "Healthcare", "Technology", "Public Sector"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.8,
    reviews: 48,
    popularity: 78,
    capabilities: [
      "GRC framework design and operation",
      "Risk register and mitigation program",
      "Policy program and documentation",
      "Board and audit committee reporting",
      "Continuous compliance monitoring",
    ],
    deliverables: [
      "GRC framework and risk register",
      "Policy library with review cadence",
      "Board reporting templates",
      "Continuous compliance dashboard",
    ],
    process: [
      { title: "Assess", description: "GRC maturity assessment and gap analysis." },
      { title: "Design", description: "Framework, risk register, and policy program." },
      { title: "Operate", description: "Run the GRC program with quarterly reviews." },
      { title: "Report", description: "Board and audit committee reporting." },
    ],
    problemsSolved: [
      "Risk register exists but is never updated",
      "Policies stale and out of step with operations",
      "Board reporting is a quarterly scramble",
      "Compliance posture unclear until audit",
    ],
    faqs: [
      { question: "Which frameworks do you build on?", answer: "COSO ERM, ISO 31000, NIST CSF, and framework-specific programs like SOC 2, HIPAA, PCI, and FedRAMP — we map controls across multiple frameworks for efficiency." },
      { question: "Can you brief our board?", answer: "Yes — we prepare board and audit committee reports and can present directly, translating technical risk into business language." },
      { question: "How do you keep the risk register current?", answer: "Quarterly risk refresh cycles, integration with incident data, and a continuous compliance dashboard — no stale registers." },
      { question: "Do you handle incident response?", answer: "Yes — incident response playbooks, tabletop exercises, and on-call support as part of the GRC program." },
    ],
  }),

  // 33
  srv(33, {
    name: "Business Strategy & Consulting Services for Market Entry and Growth",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-crm",
    icon: "Lightbulb",
    accent: ACCENT.consulting,
    shortDescription:
      "Business strategy, market entry, and growth consulting from senior practitioners — decisions made, execution planned.",
    fullDescription:
      "We deliver business strategy engagements that lead to decisions, not slide decks: market entry, growth strategy, business model design, competitive positioning, and execution roadmaps. Our senior practitioners have operated inside the same decisions you're facing — strategy you can actually execute.",
    tags: ["Strategy", "Consulting", "Growth", "Market Entry", "Business Model"],
    industries: ["SaaS", "Financial Services", "Healthcare", "Professional Services"],
    deliveryType: "project",
    timeline: "6–12 weeks",
    rating: 4.8,
    reviews: 52,
    popularity: 80,
    capabilities: [
      "Market analysis and competitive positioning",
      "Business model and growth strategy design",
      "Market entry and expansion planning",
      "Strategic roadmap and execution plan",
      "Operating model and KPI alignment",
    ],
    deliverables: [
      "Strategy document with recommendations",
      "Market analysis and competitive landscape",
      "Strategic roadmap with milestones",
      "Execution plan with KPIs",
    ],
    process: [
      { title: "Diagnose", description: "Market, competitive, and internal capability analysis." },
      { title: "Strategize", description: "Strategic options, recommendation, and roadmap." },
      { title: "Plan", description: "Execution plan with KPIs and milestones." },
      { title: "Align", description: "Stakeholder alignment and communication plan." },
    ],
    problemsSolved: [
      "Strategy trapped in slide decks that never execute",
      "Growth stalled with no clear path forward",
      "Market entry decisions made on opinion",
      "Operating model out of step with strategy",
    ],
    faqs: [
      { question: "How is this different from big consulting firms?", answer: "We deliver strategy you can actually execute. Senior practitioners who've operated inside these decisions, not analysts presenting analysis they didn't build." },
      { question: "Do you help with execution?", answer: "Yes — we hand off to implementation partners or stay engaged to drive execution, depending on what you need." },
      { question: "What kinds of strategy engagements do you run?", answer: "Market entry, growth strategy, business model design, competitive positioning, M&A diligence support, and operating model design." },
      { question: "How long is an engagement?", answer: "Typically 6 to 12 weeks for strategy work — longer if we stay engaged for execution support." },
    ],
  }),

  // 34
  srv(34, {
    name: "Branding & Identity Services for Startups and Enterprise Positioning",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-cx",
    icon: "Stamp",
    accent: ACCENT.consulting,
    shortDescription:
      "Brand strategy, identity design, and positioning for startups and enterprises — built to scale across touchpoints.",
    fullDescription:
      "We craft brand strategy and identity systems that hold up at scale — positioning, narrative, visual identity, voice, and the guidelines that keep your brand consistent across every touchpoint. From startup launches to enterprise rebrands, every decision is grounded in strategy and ready to operationalize.",
    tags: ["Branding", "Identity", "Positioning", "Strategy", "Design"],
    industries: ["SaaS", "Consumer Goods", "Retail", "Professional Services"],
    deliveryType: "project",
    timeline: "6–12 weeks",
    rating: 4.8,
    reviews: 64,
    popularity: 82,
    capabilities: [
      "Brand positioning and strategy",
      "Visual identity and design system",
      "Brand voice and messaging architecture",
      "Brand guidelines and operational playbook",
      "Launch and rollout support",
    ],
    deliverables: [
      "Brand strategy and positioning document",
      "Visual identity system with logo files",
      "Brand guidelines and usage documentation",
      "Launch playbook and stakeholder training",
    ],
    process: [
      { title: "Discover", description: "Brand audit, audience research, and positioning workshop." },
      { title: "Strategize", description: "Positioning, narrative, and messaging architecture." },
      { title: "Design", description: "Visual identity, voice, and guidelines." },
      { title: "Launch", description: "Rollout, training, and ongoing support." },
    ],
    problemsSolved: [
      "Brand that doesn't reflect your actual value",
      "Identity inconsistent across touchpoints",
      "Rebrands that lose existing brand equity",
      "No guidelines so every team reinvents the brand",
    ],
    faqs: [
      { question: "Do you handle rebrands?", answer: "Yes — we run rebrands that preserve existing equity while evolving the brand to where it needs to go, with stakeholder alignment built in." },
      { question: "Can you work with our existing brand?", answer: "Yes — we can refresh, extend, or build a complete identity depending on where you are in your brand journey." },
      { question: "Do you own the rights?", answer: "No — all rights transfer to you on final delivery. You own the brand outright." },
      { question: "Do you handle launch?", answer: "Yes — rollout planning, stakeholder training, and ongoing support so the brand actually gets adopted." },
    ],
  }),

  // 35
  srv(35, {
    name: "Digital Transformation Consulting for Enterprise Modernization Programs",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-crm",
    icon: "Rocket",
    accent: ACCENT.consulting,
    shortDescription:
      "End-to-end digital transformation strategy and execution for enterprise modernization — outcomes, not slideware.",
    fullDescription:
      "We run digital transformation engagements that actually transform: strategy, operating model, technology selection, and execution roadmap. From legacy modernization to cloud-first operating models, our practitioners have shipped transformations inside enterprises — not just advised on them.",
    tags: ["Digital Transformation", "Strategy", "Modernization", "Cloud", "Operating Model"],
    industries: ["Financial Services", "Healthcare", "Manufacturing", "Public Sector"],
    deliveryType: "project",
    timeline: "12–24 weeks",
    rating: 4.8,
    reviews: 44,
    popularity: 84,
    capabilities: [
      "Transformation strategy and roadmap",
      "Operating model and org design",
      "Technology selection and architecture",
      "Legacy modernization plan",
      "Change management and adoption",
    ],
    deliverables: [
      "Transformation strategy and roadmap",
      "Operating model and org design",
      "Technology architecture and selection",
      "Change management and adoption plan",
    ],
    process: [
      { title: "Diagnose", description: "Current-state assessment and opportunity analysis." },
      { title: "Strategize", description: "Target state, roadmap, and operating model." },
      { title: "Plan", description: "Execution plan with workstreams and milestones." },
      { title: "Execute", description: "Program governance and change management." },
    ],
    problemsSolved: [
      "Transformation initiatives that stall after kickoff",
      "Legacy systems blocking business agility",
      "Operating models out of step with strategy",
      "Change management treated as afterthought",
    ],
    faqs: [
      { question: "How is this different from strategy consulting?", answer: "We deliver implemented transformation, not slide decks. Senior practitioners who've shipped transformations inside enterprises, with execution support that actually drives outcomes." },
      { question: "Do you handle technology selection?", answer: "Yes — vendor selection, architecture, and pilot scoping as part of the transformation strategy, with an unbiased view across options." },
      { question: "Can you rescue a stalled transformation?", answer: "Yes — we diagnose what's blocking progress, reset the roadmap, and bring the program back on track with stakeholder alignment." },
      { question: "How long is an engagement?", answer: "Typically 12 to 24 weeks for the strategy and roadmap phase; we can stay engaged for execution support as well." },
    ],
  }),

  // =========================================================
  // DIVISION 8 — Startup & Accounting (cat-business-enterprise)
  // =========================================================

  // 36
  srv(36, {
    name: "Automated Bookkeeping & Financial Management Services for Small Businesses",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-start-financial",
    icon: "BookOpen",
    accent: ACCENT.startup,
    shortDescription:
      "Bookkeeping automation, financial reporting, and day-to-day financial management — clean books, always current.",
    fullDescription:
      "We handle bookkeeping and day-to-day financial management with automation at the core: transaction categorization, reconciliation, AP/AR, monthly close, and reporting. Your books are always current, your financials are audit-ready, and your team gets time back for strategic work instead of manual data entry.",
    tags: ["Bookkeeping", "Accounting", "Financial Management", "Reporting", "Close"],
    industries: ["Startups", "SaaS", "Professional Services", "E-commerce"],
    deliveryType: "subscription",
    timeline: "Ongoing",
    rating: 4.8,
    reviews: 84,
    popularity: 86,
    capabilities: [
      "Automated transaction categorization",
      "Monthly close and reconciliation",
      "AP/AR management and bill pay",
      "Financial reporting and dashboards",
      "Audit-ready books year-round",
    ],
    deliverables: [
      "Current books with monthly close",
      "Financial reports and dashboards",
      "Reconciled accounts and clean trial balance",
      "Audit support and documentation",
    ],
    process: [
      { title: "Onboard", description: "Set up automation, integrations, and chart of accounts." },
      { title: "Operate", description: "Monthly close, reconciliation, and reporting." },
      { title: "Review", description: "Monthly review call with your team." },
      { title: "Optimize", description: "Tune automation and reporting over time." },
    ],
    problemsSolved: [
      "Books months behind at any given time",
      "Manual data entry eating finance team capacity",
      "Close takes weeks instead of days",
      "Financials not ready when board or audit asks",
    ],
    faqs: [
      { question: "Which accounting platforms do you support?", answer: "QuickBooks, Xero, NetSuite, and Wave — we pick based on your scale and complexity." },
      { question: "How fast is monthly close?", answer: "Most clients close within 5 business days of month-end with automation in place, down from weeks of manual work." },
      { question: "Do you handle AP and AR?", answer: "Yes — bill pay, invoicing, collections, and cash application as part of the bookkeeping service." },
      { question: "Can you support our audit?", answer: "Yes — audit-ready books year-round, plus support during the actual audit with documentation and schedules." },
    ],
  }),

  // 37
  srv(37, {
    name: "Financial Advisory & Growth Planning for Startup FP&A and Scaling",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-start-financial",
    icon: "TrendingUp",
    accent: ACCENT.startup,
    shortDescription:
      "Financial advisory, FP&A, and growth planning for startups and SMBs — model the future, fund the plan, hit the numbers.",
    fullDescription:
      "We provide financial advisory and FP&A services that help startups and SMBs plan and hit their numbers: financial modeling, scenario planning, fundraising support, board reporting, and the operating rhythm that turns plans into actuals. Built around your business with senior practitioners who've raised and operated.",
    tags: ["FP&A", "Financial Advisory", "Growth Planning", "Modeling", "Startups"],
    industries: ["Startups", "SaaS", "Financial Services", "Professional Services"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.9,
    reviews: 66,
    popularity: 88,
    capabilities: [
      "Financial modeling and scenario planning",
      "Fundraising support and investor materials",
      "Board reporting and KPI dashboards",
      "Budgeting and forecasting",
      "Cash management and runway planning",
    ],
    deliverables: [
      "Financial model with scenarios",
      "Investor deck and data room support",
      "Board reporting templates",
      "Monthly FP&A review and forecast updates",
    ],
    process: [
      { title: "Onboard", description: "Audit current model, KPIs, and reporting." },
      { title: "Model", description: "Build financial model with scenarios." },
      { title: "Operate", description: "Monthly FP&A cycle and board reporting." },
      { title: "Advise", description: "Fundraising, scenario, and strategic support." },
    ],
    problemsSolved: [
      "No financial model investors trust",
      "Runway unclear until it's almost gone",
      "Board reporting is a quarterly scramble",
      "Forecasts that don't tie to actuals",
    ],
    faqs: [
      { question: "Can you help with fundraising?", answer: "Yes — investor materials, data room prep, financial model review, and Q&A support during diligence, with senior practitioners who've raised." },
      { question: "How detailed is the financial model?", answer: "Driver-based with revenue, COGS, OpEx, headcount, cash, and runway — scenario-ready and investor-grade." },
      { question: "Do you handle board reporting?", answer: "Yes — board deck templates, KPI dashboards, and the monthly rhythm so reporting isn't a quarterly scramble." },
      { question: "Can you work with our existing finance team?", answer: "Yes — we partner with your finance lead or CFO, building internal capability rather than replacing it." },
    ],
  }),

  // 38
  srv(38, {
    name: "Business Formation & Compliance Services for New Entity Setup",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-be-security",
    icon: "FileCheck",
    accent: ACCENT.startup,
    shortDescription:
      "Business formation, entity setup, and regulatory compliance for new companies — start right, stay compliant.",
    fullDescription:
      "We handle business formation and ongoing compliance for new and growing companies: entity selection, registration, foreign qualification, registered agent, licenses and permits, and the ongoing compliance calendar that keeps you in good standing. Start right, stay compliant, avoid the surprises that come later.",
    tags: ["Business Formation", "Compliance", "Entity Setup", "Startups", "Legal"],
    industries: ["Startups", "SaaS", "Professional Services", "E-commerce"],
    deliveryType: "project",
    timeline: "2–6 weeks",
    rating: 4.7,
    reviews: 58,
    popularity: 76,
    capabilities: [
      "Entity selection and registration",
      "Foreign qualification and registered agent",
      "Licenses, permits, and regulatory filings",
      "Compliance calendar and ongoing management",
      "Annual report and registered agent services",
    ],
    deliverables: [
      "Entity registration and formation documents",
      "Compliance calendar with all deadlines",
      "Licenses and permits obtained",
      "Ongoing compliance management",
    ],
    process: [
      { title: "Advise", description: "Entity selection and registration strategy." },
      { title: "Form", description: "Registration, filings, and permits." },
      { title: "Operationalize", description: "Compliance calendar and ongoing management." },
      { title: "Maintain", description: "Annual reports and ongoing compliance." },
    ],
    problemsSolved: [
      "Entity structure chosen without tax considerations",
      "Foreign qualification missed when expanding",
      "Annual report deadlines missed",
      "Compliance surprises that surface during diligence",
    ],
    faqs: [
      { question: "Which entity types do you help with?", answer: "LLC, S-Corp, C-Corp, and partnerships — we help you pick the right structure for your stage and tax situation." },
      { question: "Do you handle foreign qualification?", answer: "Yes — if you're operating in states beyond your formation state, we handle the qualification filings and registered agent needs." },
      { question: "Can you maintain compliance ongoing?", answer: "Yes — annual reports, registered agent services, and a compliance calendar so deadlines never sneak up." },
      { question: "Do you provide legal advice?", answer: "We handle formation and compliance operationally; for complex legal questions we partner with your attorney or recommend one." },
    ],
  }),

  // 39
  srv(39, {
    name: "Tax Planning & Regulatory Compliance Services for Businesses",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-start-financial",
    icon: "Receipt",
    accent: ACCENT.startup,
    shortDescription:
      "Tax planning, preparation, and regulatory compliance services for businesses — minimize tax, stay compliant.",
    fullDescription:
      "We provide tax planning and compliance services for businesses: federal, state, and local tax preparation, sales tax nexus and filing, R&D credits, and ongoing tax planning that minimizes tax without crossing lines. Built around your business with year-round planning, not just at filing season.",
    tags: ["Tax", "Tax Planning", "Compliance", "R&D Credits", "Sales Tax"],
    industries: ["Startups", "SaaS", "E-commerce", "Professional Services"],
    deliveryType: "subscription",
    timeline: "Ongoing",
    rating: 4.8,
    reviews: 72,
    popularity: 82,
    capabilities: [
      "Federal, state, and local tax preparation",
      "Sales tax nexus and filing",
      "R&D tax credit identification and claims",
      "Year-round tax planning",
      "Audit defense and representation",
    ],
    deliverables: [
      "Filed tax returns (federal, state, local)",
      "Sales tax filings across nexus states",
      "R&D credit study and claim documentation",
      "Year-round tax planning recommendations",
    ],
    process: [
      { title: "Onboard", description: "Review prior returns, entity structure, and tax position." },
      { title: "Plan", description: "Year-round tax planning and credit identification." },
      { title: "File", description: "Prepare and file federal, state, and local returns." },
      { title: "Defend", description: "Audit defense and representation if needed." },
    ],
    problemsSolved: [
      "Tax surprises at filing season",
      "Sales tax nexus missed when expanding",
      "R&D credits left on the table",
      "No year-round tax planning",
    ],
    faqs: [
      { question: "Can you handle sales tax across states?", answer: "Yes — nexus analysis, registration, and filing across all states where you have obligations, with automation for ongoing compliance." },
      { question: "Do you handle R&D credits?", answer: "Yes — credit identification, study documentation, and claim filing for federal and state R&D credits." },
      { question: "When should we start tax planning?", answer: "Year-round, not at filing season. We recommend starting planning at the beginning of the fiscal year so we can optimize before year-end." },
      { question: "Can you defend us in an audit?", answer: "Yes — audit defense and representation, with documentation organized and ready to go." },
    ],
  }),

  // 40
  srv(40, {
    name: "Fractional CFO & Controller Services for Startups Without a Finance Team",
    categoryId: "cat-business-enterprise",
    subcategoryId: "sub-start-financial",
    icon: "Wallet",
    accent: ACCENT.startup,
    shortDescription:
      "Fractional CFO and controller services for startups without a full-time finance team — senior expertise, part-time cost.",
    fullDescription:
      "We provide fractional CFO and controller services for startups and SMBs that need senior finance expertise without a full-time hire: financial leadership, FP&A, audit and board prep, fundraising support, and the operational finance work that keeps your business running. Senior practitioners, part-time cost.",
    tags: ["Fractional CFO", "Controller", "Finance", "Startups", "FP&A"],
    industries: ["Startups", "SaaS", "Professional Services", "E-commerce"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.9,
    reviews: 56,
    popularity: 86,
    capabilities: [
      "Financial leadership and strategic guidance",
      "FP&A, forecasting, and board reporting",
      "Audit prep and auditor liaison",
      "Fundraising support and investor relations",
      "Controller services and accounting oversight",
    ],
    deliverables: [
      "Monthly financial review and KPIs",
      "Board reporting and investor materials",
      "Audit prep and auditor liaison",
      "Strategic guidance on demand",
    ],
    process: [
      { title: "Onboard", description: "Audit financial operations and reporting." },
      { title: "Lead", description: "Monthly financial leadership and reporting." },
      { title: "Advise", description: "Strategic guidance on fundraising, M&A, and major decisions." },
      { title: "Scale", description: "Transition to full-time hire when ready." },
    ],
    problemsSolved: [
      "Need senior finance expertise but not full-time",
      "No financial leadership before fundraising",
      "Board reporting without a CFO",
      "Controller work bottlenecking growth",
    ],
    faqs: [
      { question: "How many hours per month is fractional?", answer: "Typically 20–40 hours per month depending on your needs — enough for real leadership without the full-time cost." },
      { question: "Can you help with fundraising?", answer: "Yes — investor materials, financial model review, diligence support, and investor relations during and after the raise." },
      { question: "Do you handle audit prep?", answer: "Yes — audit prep, auditor liaison, and documentation so your team isn't derailed during the audit." },
      { question: "When should we move to full-time?", answer: "Usually around Series B or $10M+ ARR — we help plan the transition and can recruit your full-time hire." },
    ],
  }),

  // =========================================================
  // DIVISION 9 — Branding & Marketing Strategy
  // (mixed cat-digital-sales-marketing / cat-multimedia-ai)
  // =========================================================

  // 41
  srv(41, {
    name: "Jataye Blogs & News Content for SEO Authority and Organic Traffic",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-social",
    icon: "Newspaper",
    accent: ACCENT.branding,
    shortDescription:
      "Branded blogs and news content that builds authority, supports SEO, and earns organic traffic from your buyers.",
    fullDescription:
      "We produce branded blog and news content that builds authority and earns organic traffic from the buyers you care about: editorial strategy, topic clusters, SEO-optimized articles, and a publishing cadence that compounds. Every piece is grounded in your expertise and the queries your buyers actually search.",
    tags: ["Content", "Blogs", "News", "SEO", "Authority"],
    industries: ["SaaS", "B2B Services", "Healthcare", "Financial Services"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.8,
    reviews: 68,
    popularity: 80,
    capabilities: [
      "Editorial strategy and topic clusters",
      "SEO-optimized article production",
      "News and timely content coverage",
      "Thought leadership development",
      "Performance reporting and optimization",
    ],
    deliverables: [
      "Monthly article volumes on plan",
      "Editorial calendar and topic strategy",
      "SEO performance report",
      "Thought leadership pieces",
    ],
    process: [
      { title: "Strategize", description: "Editorial strategy, topic clusters, and SEO plan." },
      { title: "Produce", description: "Monthly article production with editorial review." },
      { title: "Publish", description: "Publishing, distribution, and amplification." },
      { title: "Optimize", description: "Performance reporting and content refresh." },
    ],
    problemsSolved: [
      "Blog abandoned because no one owns it",
      "Content that doesn't rank or drive traffic",
      "No editorial strategy tying content to business goals",
      "Thought leadership left to chance",
    ],
    faqs: [
      { question: "How many articles per month?", answer: "Tens to twenties depending on plan — quality over volume, but enough cadence to compound traffic over time." },
      { question: "Do you handle SEO?", answer: "Yes — every article is optimized for search intent, with topic clusters that build authority over time." },
      { question: "Can you cover news and timely content?", answer: "Yes — news coverage for your industry, with quick-turn publishing when timely topics break." },
      { question: "How do we measure success?", answer: "Organic traffic, keyword rankings, engagement, and pipeline attributed to content — not vanity views." },
    ],
  }),

  // 42
  srv(42, {
    name: "Industry-Specific Brand Experience Programs for Vertical Markets",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-social",
    icon: "Layers",
    accent: ACCENT.branding,
    shortDescription:
      "Industry-specific brand experience programs — tailored messaging, assets, and proof per vertical you serve.",
    fullDescription:
      "We build industry-specific brand experience programs for companies serving multiple verticals: tailored messaging, vertical-specific assets, case studies, and proof points that resonate with each industry you target. One brand, multiple vertical voices — without losing consistency.",
    tags: ["Industry", "Vertical", "Brand Experience", "Messaging", "Assets"],
    industries: ["SaaS", "Professional Services", "Healthcare", "Financial Services"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.7,
    reviews: 44,
    popularity: 72,
    capabilities: [
      "Vertical messaging and positioning",
      "Industry-specific asset production",
      "Case study and proof point development",
      "Vertical landing pages and content",
      "Sales enablement for industry selling",
    ],
    deliverables: [
      "Vertical messaging frameworks",
      "Industry-specific asset library",
      "Case studies per vertical",
      "Sales enablement materials",
    ],
    process: [
      { title: "Audit", description: "Current vertical coverage and gaps." },
      { title: "Strategize", description: "Vertical messaging and positioning frameworks." },
      { title: "Produce", description: "Asset, case study, and content production." },
      { title: "Enable", description: "Sales enablement and rollout." },
    ],
    problemsSolved: [
      "Same generic pitch across every vertical",
      "No vertical-specific case studies or proof",
      "Industry buyers don't see themselves in your message",
      "Sales teams improvising vertical messaging",
    ],
    faqs: [
      { question: "How many verticals can you cover?", answer: "Typically 3–6 in an engagement — enough to make a real difference without diluting focus." },
      { question: "Do you handle case studies?", answer: "Yes — interview, write, and produce case studies per vertical with customer approval and usage rights." },
      { question: "Can you produce vertical landing pages?", answer: "Yes — landing page copy, design, and build for each vertical, ready to deploy in your CMS." },
      { question: "Do you enable sales teams?", answer: "Yes — messaging training, vertical-specific decks, and battle cards so sales teams can sell into each industry effectively." },
    ],
  }),

  // 43
  srv(43, {
    name: "Dedicated Sales Teams for Outbound Pipeline and Revenue Growth",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-aisdr",
    icon: "Users",
    accent: ACCENT.branding,
    shortDescription:
      "Dedicated, brand-aligned sales teams that carry your narrative into every conversation — pipeline on demand.",
    fullDescription:
      "We provide dedicated, brand-aligned sales teams that carry your narrative into every conversation: SDRs, AEs, and sales managers trained on your value prop, your verticals, and your buyers. Whether you're scaling outbound or filling a coverage gap, the team operates as an extension of yours.",
    tags: ["Sales Teams", "SDR", "Account Executive", "Outbound", "Pipeline"],
    industries: ["SaaS", "B2B Services", "Financial Services", "Professional Services"],
    deliveryType: "subscription",
    timeline: "Ongoing",
    rating: 4.7,
    reviews: 38,
    popularity: 78,
    capabilities: [
      "Dedicated SDR and AE teams",
      "Brand and product training",
      "Outbound and inbound coverage",
      "Pipeline management and forecasting",
      "Sales ops and reporting",
    ],
    deliverables: [
      "Dedicated sales team deployed",
      "Trained and ramped on your brand",
      "Pipeline created and forecasted",
      "Weekly reporting and review cadence",
    ],
    process: [
      { title: "Recruit", description: "Source, screen, and hire the team." },
      { title: "Train", description: "Brand, product, and sales motion training." },
      { title: "Ramp", description: "Coaching and ramp-up support." },
      { title: "Operate", description: "Pipeline, forecasting, and ongoing management." },
    ],
    problemsSolved: [
      "Need outbound coverage without full-time hires",
      "Sales team not aligned with brand narrative",
      "Coverage gaps during growth transitions",
      "No process for ramping new reps fast",
    ],
    faqs: [
      { question: "Are the reps employees or contractors?", answer: "Either — we can deploy dedicated contractors or help you hire full-time reps depending on what fits your stage and motion." },
      { question: "How fast can the team ramp?", answer: "Typically 4–6 weeks from kickoff to productive outbound, with structured training and shadowing built in." },
      { question: "Do you handle sales ops?", answer: "Yes — CRM hygiene, pipeline management, forecasting, and reporting as part of the engagement." },
      { question: "Can you scale up or down?", answer: "Yes — team size flexes with your pipeline needs, with notice periods built into the engagement." },
    ],
  }),

  // 44
  srv(44, {
    name: "Market Research & Analyst Programs for Brand Bet De-Risking",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-cro",
    icon: "Microscope",
    accent: ACCENT.branding,
    shortDescription:
      "Market research and analyst programs that quantify opportunity and de-risk brand bets — data, not opinion.",
    fullDescription:
      "We run market research and analyst programs that de-risk your brand and product bets: customer interviews, competitive analysis, market sizing, and analyst relations programs. Every decision gets grounded in evidence so you stop guessing about what your market actually wants.",
    tags: ["Market Research", "Analysts", "Competitive", "Customer Insights", "Strategy"],
    industries: ["SaaS", "Consumer Goods", "Financial Services", "Healthcare"],
    deliveryType: "project",
    timeline: "4–10 weeks",
    rating: 4.8,
    reviews: 42,
    popularity: 76,
    capabilities: [
      "Customer and prospect interview programs",
      "Competitive analysis and benchmarking",
      "Market sizing and opportunity analysis",
      "Analyst relations and briefing programs",
      "Insight reporting and recommendations",
    ],
    deliverables: [
      "Research findings report",
      "Competitive landscape analysis",
      "Market sizing model",
      "Strategic recommendations",
    ],
    process: [
      { title: "Scope", description: "Research questions and methodology design." },
      { title: "Execute", description: "Interviews, surveys, and competitive analysis." },
      { title: "Analyze", description: "Synthesis and insight development." },
      { title: "Recommend", description: "Strategic recommendations and briefing." },
    ],
    problemsSolved: [
      "Decisions made on opinion instead of evidence",
      "No clarity on market size or opportunity",
      "Competitive blind spots costing deals",
      "Analyst relationships not cultivated",
    ],
    faqs: [
      { question: "What research methods do you use?", answer: "Customer interviews, surveys, competitive teardowns, market sizing, and analyst briefings — we pick the right mix for your research questions." },
      { question: "Can you handle analyst relations?", answer: "Yes — briefings with Gartner, Forrester, IDC, and vertical analysts as part of the program." },
      { question: "How fast do we get insights?", answer: "Typical engagements run 4–10 weeks depending on scope, with interim findings shared throughout." },
      { question: "Do you handle customer interviews?", answer: "Yes — recruitment, interview guides, moderation, and synthesis with full transcripts and recordings." },
    ],
  }),

  // 45
  srv(45, {
    name: "Dedicated Marketing Specialists for Channel Execution and Strategy",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-social",
    icon: "UserCog",
    accent: ACCENT.branding,
    shortDescription:
      "Dedicated marketing specialists embedded in your team — channel owners who execute the strategy day in, day out.",
    fullDescription:
      "We embed dedicated marketing specialists into your team — channel owners for paid, organic, lifecycle, content, or social who execute the strategy day in and day out. Embedded with your team, reporting on your metrics, and accountable to your outcomes — without the overhead of full-time hires.",
    tags: ["Marketing Specialist", "Embedded", "Channels", "Execution", "Marketing"],
    industries: ["SaaS", "E-commerce", "B2B Services", "Consumer Goods"],
    deliveryType: "subscription",
    timeline: "Ongoing",
    rating: 4.7,
    reviews: 50,
    popularity: 76,
    capabilities: [
      "Channel-specific specialist deployment",
      "Campaign execution and optimization",
      "Performance reporting and analysis",
      "Cross-channel coordination",
      "Embedded with your team",
    ],
    deliverables: [
      "Dedicated specialist deployed",
      "Channel performance dashboard",
      "Weekly reporting and review cadence",
      "Ongoing optimization recommendations",
    ],
    process: [
      { title: "Scope", description: "Channel needs and specialist profile." },
      { title: "Deploy", description: "Specialist embedded with your team." },
      { title: "Operate", description: "Channel execution and optimization." },
      { title: "Report", description: "Weekly performance reporting." },
    ],
    problemsSolved: [
      "Marketing work waiting on full-time hires",
      "Channel expertise gaps in current team",
      "Execution inconsistent across channels",
      "No dedicated owner for key channels",
    ],
    faqs: [
      { question: "Which channels do you cover?", answer: "Paid social, paid search, organic social, content, email/lifecycle, SEO, and CRO — specialists for whichever channels you need." },
      { question: "Are specialists full-time or part-time?", answer: "Either — full-time embedded or part-time fractional depending on your volume and budget." },
      { question: "Do they report to us?", answer: "Yes — embedded with your team, attending your standups, reporting on your metrics, accountable to your outcomes." },
      { question: "How do we measure success?", answer: "Channel-specific KPIs tied to pipeline or revenue — every specialist engagement reports on outcomes, not just activity." },
    ],
  }),

  // 46
  srv(46, {
    name: "Brand Humanity, Ethics & Emotion Strategy for Lasting Customer Loyalty",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-social",
    icon: "Heart",
    accent: ACCENT.branding,
    shortDescription:
      "Define and express the humanity, ethics, and emotion of your brand — the why behind the loyalty customers feel.",
    fullDescription:
      "We help brands define and express the humanity, ethics, and emotion that create lasting customer loyalty: values articulation, ethical positioning, emotional storytelling, and the brand behaviors that turn customers into advocates. Beyond features and benefits — the why that makes people care.",
    tags: ["Brand", "Humanity", "Ethics", "Emotion", "Loyalty"],
    industries: ["Consumer Goods", "Retail", "Healthcare", "SaaS"],
    deliveryType: "project",
    timeline: "4–8 weeks",
    rating: 4.8,
    reviews: 36,
    popularity: 74,
    capabilities: [
      "Values and ethics articulation",
      "Emotional storytelling framework",
      "Brand behaviors and expression guidelines",
      "Customer emotion research",
      "Internal alignment and training",
    ],
    deliverables: [
      "Brand humanity and values framework",
      "Emotional storytelling playbook",
      "Brand behavior guidelines",
      "Internal alignment workshop",
    ],
    process: [
      { title: "Discover", description: "Customer emotion research and brand audit." },
      { title: "Articulate", description: "Values, ethics, and emotional positioning." },
      { title: "Express", description: "Storytelling framework and guidelines." },
      { title: "Align", description: "Internal alignment and rollout." },
    ],
    problemsSolved: [
      "Brand feels transactional and forgettable",
      "No articulated values or ethics",
      "Customers don't feel emotionally connected",
      "Brand behaviors inconsistent with values",
    ],
    faqs: [
      { question: "Is this just brand strategy?", answer: "No — this is the deeper work of defining the humanity, ethics, and emotion that create real customer loyalty, beyond positioning and identity." },
      { question: "How do you research customer emotion?", answer: "Interviews, ethnographic research, and behavioral analysis to understand what customers actually feel — not just what they say." },
      { question: "Can you operationalize this?", answer: "Yes — guidelines, training, and ongoing support so the brand's humanity shows up in every touchpoint." },
      { question: "How do we measure success?", answer: "Customer loyalty metrics, NPS lift, advocacy behaviors, and qualitative feedback — emotion doesn't reduce to clicks, but it shows up in retention." },
    ],
  }),

  // 47
  srv(47, {
    name: "Strategic Root Brand Positioning for Audience Clarity and Differentiation",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-social",
    icon: "Compass",
    accent: ACCENT.branding,
    shortDescription:
      "Strategic root positioning that defines who the brand is for, what it stands for, and how it differs from alternatives.",
    fullDescription:
      "We define the strategic root positioning that anchors every brand decision: who the brand is for, what it stands for, and how it differs from alternatives. The root positioning becomes the reference point for messaging, identity, and experience — so every touchpoint reinforces the same strategic foundation.",
    tags: ["Positioning", "Strategy", "Brand", "Differentiation", "Audience"],
    industries: ["SaaS", "Consumer Goods", "B2B Services", "Healthcare"],
    deliveryType: "project",
    timeline: "4–8 weeks",
    rating: 4.8,
    reviews: 40,
    popularity: 78,
    capabilities: [
      "Audience definition and segmentation",
      "Competitive positioning analysis",
      "Root positioning statement development",
      "Differentiation framework",
      "Messaging architecture",
    ],
    deliverables: [
      "Root positioning document",
      "Audience and competitive analysis",
      "Differentiation framework",
      "Messaging architecture",
    ],
    process: [
      { title: "Research", description: "Audience, competitive, and internal capability research." },
      { title: "Strategize", description: "Positioning options and root statement." },
      { title: "Test", description: "Validate with customers and stakeholders." },
      { title: "Document", description: "Final positioning and messaging architecture." },
    ],
    problemsSolved: [
      "Brand trying to be everything to everyone",
      "No clear differentiation from alternatives",
      "Positioning that drifts over time",
      "Messaging inconsistent across touchpoints",
    ],
    faqs: [
      { question: "What's root positioning vs. regular positioning?", answer: "Root positioning is the foundational statement that anchors every other brand decision — messaging, identity, and experience all derive from it." },
      { question: "Do you test positioning with customers?", answer: "Yes — we validate positioning options with target customers before locking the final statement." },
      { question: "Can you reposition an existing brand?", answer: "Yes — we run repositioning engagements that evolve without losing existing brand equity." },
      { question: "How is this different from messaging?", answer: "Positioning is the strategic foundation; messaging is how it's expressed. We deliver both, but positioning comes first." },
    ],
  }),

  // 48
  srv(48, {
    name: "Emotional Brand Connection Programs for Community and Loyalty",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-social",
    icon: "Sparkles",
    accent: ACCENT.branding,
    shortDescription:
      "Programs that build emotional attachment — community, content, experiences — for lasting customer loyalty.",
    fullDescription:
      "We design and operate programs that build emotional attachment between customers and your brand: community programs, content experiences, events, and rituals that turn transactional customers into loyal advocates. Beyond features and price — the kind of connection that survives a competitor's discount.",
    tags: ["Brand", "Emotion", "Community", "Loyalty", "Advocacy"],
    industries: ["Consumer Goods", "Retail", "SaaS", "Healthcare"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.7,
    reviews: 34,
    popularity: 72,
    capabilities: [
      "Community program design and operation",
      "Content experience production",
      "Event and ritual design",
      "Advocacy and ambassador programs",
      "Loyalty measurement and optimization",
    ],
    deliverables: [
      "Emotional connection program design",
      "Community and content production",
      "Event and experience execution",
      "Loyalty metrics and reporting",
    ],
    process: [
      { title: "Discover", description: "Customer emotion research and brand audit." },
      { title: "Design", description: "Emotional connection program and content plan." },
      { title: "Operate", description: "Community, content, and event execution." },
      { title: "Optimize", description: "Measure loyalty lift and tune programs." },
    ],
    problemsSolved: [
      "Customers transactional, not loyal",
      "No community or emotional touchpoints",
      "Loyalty programs that don't drive real attachment",
      "Brand feels like a vendor, not a relationship",
    ],
    faqs: [
      { question: "What kinds of programs build emotional attachment?", answer: "Community programs, content experiences, events, rituals, and advocacy initiatives — the mix depends on your audience and brand." },
      { question: "How do you measure emotional attachment?", answer: "Loyalty metrics, NPS lift, advocacy behaviors, retention, and qualitative feedback — emotion doesn't reduce to clicks but it shows up in behavior." },
      { question: "Can you operate community ongoing?", answer: "Yes — community management, content production, and event execution as part of an ongoing retainer." },
      { question: "How long until we see loyalty lift?", answer: "Emotional programs compound over 3–6 months — quick wins show up faster, but the real lift comes from sustained execution." },
    ],
  }),

  // 49
  srv(49, {
    name: "Market Segment Differentiation for Multi-Audience Brand Positioning",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-cro",
    icon: "Split",
    accent: ACCENT.branding,
    shortDescription:
      "Differentiate your brand across market segments — tailored positioning per audience you serve, one coherent brand.",
    fullDescription:
      "We help brands differentiate across multiple market segments without fragmenting the brand: segment-specific positioning, messaging, and assets that resonate with each audience while reinforcing one coherent brand. One brand, many audiences — each seeing themselves in what you offer.",
    tags: ["Segmentation", "Differentiation", "Positioning", "Brand", "Audience"],
    industries: ["SaaS", "Financial Services", "Healthcare", "Professional Services"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.7,
    reviews: 32,
    popularity: 74,
    capabilities: [
      "Segment identification and analysis",
      "Segment-specific positioning",
      "Tailored messaging and assets",
      "Brand coherence framework",
      "Sales enablement per segment",
    ],
    deliverables: [
      "Segment differentiation strategy",
      "Tailored messaging per segment",
      "Asset library organized by segment",
      "Sales enablement materials",
    ],
    process: [
      { title: "Analyze", description: "Segment identification and needs analysis." },
      { title: "Strategize", description: "Positioning per segment with coherence framework." },
      { title: "Produce", description: "Messaging, assets, and content per segment." },
      { title: "Enable", description: "Sales enablement and rollout." },
    ],
    problemsSolved: [
      "Same positioning for very different segments",
      "Segments not seeing themselves in your message",
      "Brand fragmented as it tries to serve everyone",
      "Sales improvising segment messaging",
    ],
    faqs: [
      { question: "How many segments can you differentiate?", answer: "Typically 3–5 in an engagement — enough to make a real difference without fragmenting the brand." },
      { question: "How do you keep the brand coherent?", answer: "A coherence framework anchors segment positioning to a single root brand — segments see themselves without the brand feeling fragmented." },
      { question: "Do you handle assets per segment?", answer: "Yes — messaging, content, and visual assets organized by segment, ready for sales and marketing to deploy." },
      { question: "Can you enable sales teams?", answer: "Yes — segment-specific decks, battle cards, and messaging training so sales can sell effectively into each segment." },
    ],
  }),

  // 50
  srv(50, {
    name: "Brand Launch Systems for Faster Time-to-Market and Rapid Activation",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-aisdr",
    icon: "Zap",
    accent: ACCENT.branding,
    shortDescription:
      "Brand systems and activation plans built for faster time-to-market — launch campaigns in weeks, not quarters.",
    fullDescription:
      "We build brand systems and activation plans engineered for faster time-to-market: modular brand assets, pre-built campaign templates, and activation playbooks that let you launch in weeks instead of quarters. Built for speed without sacrificing brand consistency.",
    tags: ["Time-to-Market", "Brand Activation", "Speed", "Templates", "Playbooks"],
    industries: ["SaaS", "E-commerce", "Consumer Goods", "B2B Services"],
    deliveryType: "project",
    timeline: "4–8 weeks",
    rating: 4.7,
    reviews: 38,
    popularity: 76,
    capabilities: [
      "Modular brand asset library",
      "Pre-built campaign templates",
      "Activation playbook per channel",
      "Launch workflow and review cadence",
      "Brand compliance automation",
    ],
    deliverables: [
      "Modular asset library",
      "Campaign template pack",
      "Activation playbook",
      "Launch workflow documentation",
    ],
    process: [
      { title: "Audit", description: "Current brand assets and launch workflows." },
      { title: "Systematize", description: "Modular assets and templates." },
      { title: "Activate", description: "Playbook and launch workflow." },
      { title: "Train", description: "Team training on faster launch motion." },
    ],
    problemsSolved: [
      "Campaigns stuck waiting on brand assets",
      "Every launch starts from scratch",
      "Brand review slowing time-to-market",
      "No templates so speed comes at quality cost",
    ],
    faqs: [
      { question: "How much faster can we launch?", answer: "Most teams cut launch cycle from quarters to weeks once the modular system is in place — 3–5x improvement is typical." },
      { question: "Does faster mean lower quality?", answer: "No — the modular system and templates maintain brand consistency and quality, just faster because the building blocks are pre-approved." },
      { question: "Can you build the templates?", answer: "Yes — asset templates for ads, emails, landing pages, social, and presentations, all brand-compliant and ready to customize." },
      { question: "Do you train the team?", answer: "Yes — workflow training so marketing teams can launch faster using the system, with ongoing support as they ramp." },
    ],
  }),

  // 51 — flagship in cat-multimedia-ai
  srv(51, {
    name: "Brand Identity Design & Strategy Development for Cohesive Visual Systems",
    categoryId: "cat-multimedia-ai",
    subcategoryId: "sub-mm-social",
    icon: "Palette",
    accent: ACCENT.branding,
    shortDescription:
      "Brand identity design and strategy development — name, logo, voice, and visual system built from positioning.",
    fullDescription:
      "We develop brand identity and strategy end-to-end: positioning, naming, logo design, visual system, voice, and guidelines. Every element derives from a strategic foundation, so the identity doesn't just look good — it communicates who you are, who you're for, and why you're different.",
    tags: ["Brand Identity", "Strategy", "Logo", "Naming", "Design System"],
    industries: ["SaaS", "Consumer Goods", "Retail", "Professional Services"],
    deliveryType: "project",
    timeline: "8–12 weeks",
    rating: 4.9,
    reviews: 82,
    popularity: 88,
    featured: true,
    capabilities: [
      "Brand positioning and strategy",
      "Naming and verbal identity",
      "Logo and visual identity design",
      "Brand voice and messaging architecture",
      "Guidelines and operational playbook",
    ],
    deliverables: [
      "Brand strategy and positioning document",
      "Name and verbal identity",
      "Visual identity system with logo files",
      "Brand guidelines and templates",
    ],
    process: [
      { title: "Discover", description: "Brand audit, audience research, and positioning workshop." },
      { title: "Strategize", description: "Positioning, naming, and messaging architecture." },
      { title: "Design", description: "Visual identity, voice, and guidelines." },
      { title: "Launch", description: "Rollout, training, and ongoing support." },
    ],
    problemsSolved: [
      "Identity that doesn't reflect strategic positioning",
      "Logo and visuals disconnected from brand strategy",
      "No naming or verbal identity system",
      "Brand inconsistent across touchpoints",
    ],
    faqs: [
      { question: "Do you handle naming?", answer: "Yes — naming exploration, trademark screening, and selection with stakeholder alignment built in." },
      { question: "What's the difference between strategy and identity?", answer: "Strategy defines who you are; identity is how that shows up visually and verbally. We deliver both as an integrated system." },
      { question: "Do we own the rights?", answer: "Yes — all rights transfer to you on final delivery. You own the brand outright." },
      { question: "Can you work with our existing positioning?", answer: "Yes — we can build identity on top of existing positioning or develop both together depending on where you are." },
    ],
  }),

  // 52
  srv(52, {
    name: "Brand Positioning & Rebranding Services for Established Companies",
    categoryId: "cat-multimedia-ai",
    subcategoryId: "sub-mm-social",
    icon: "RefreshCw",
    accent: ACCENT.branding,
    shortDescription:
      "Brand positioning and rebranding services for established companies — reposition without losing brand equity.",
    fullDescription:
      "We help established companies reposition and rebrand without losing the equity they've built: positioning refresh, identity evolution, migration strategy, and stakeholder rollout. Rebrands that respect what got you here while evolving the brand to where it needs to go.",
    tags: ["Rebranding", "Positioning", "Brand", "Evolution", "Migration"],
    industries: ["SaaS", "Financial Services", "Consumer Goods", "Healthcare"],
    deliveryType: "project",
    timeline: "8–16 weeks",
    rating: 4.8,
    reviews: 54,
    popularity: 82,
    capabilities: [
      "Positioning refresh and evolution",
      "Identity evolution and migration strategy",
      "Stakeholder alignment and rollout",
      "Asset migration and brand transition",
      "Internal and external launch",
    ],
    deliverables: [
      "Repositioning strategy document",
      "Evolved identity system",
      "Migration plan and timeline",
      "Launch playbook and stakeholder training",
    ],
    process: [
      { title: "Audit", description: "Current brand equity, perception, and gaps." },
      { title: "Strategize", description: "Repositioning options and evolution plan." },
      { title: "Redesign", description: "Evolved identity and migration strategy." },
      { title: "Roll Out", description: "Stakeholder alignment and phased launch." },
    ],
    problemsSolved: [
      "Rebrands that lose existing brand equity",
      "Positioning that's outgrown the business",
      "Identity feeling dated or off-strategy",
      "Migration chaos across hundreds of touchpoints",
    ],
    faqs: [
      { question: "Can you rebrand without losing equity?", answer: "Yes — we run evolution rather than revolution, preserving the equity you've built while moving the brand to where it needs to go." },
      { question: "Do you handle migration?", answer: "Yes — asset migration plan, timeline, and execution support across all touchpoints, from website to signage to legal." },
      { question: "How do you align stakeholders?", answer: "Stakeholder workshops, alignment sessions, and a phased rollout plan so the rebrand lands with internal and external audiences." },
      { question: "How long does a rebrand take?", answer: "Typically 8 to 16 weeks depending on scope — larger organizations with complex touchpoints take longer for migration." },
    ],
  }),

  // 53
  srv(53, {
    name: "Social Media Branding Services for Consistent Platform Presence",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-social",
    icon: "Share2",
    accent: ACCENT.branding,
    shortDescription:
      "Build social media branding that is consistent, on-voice, and built for each platform — owned, earned, and paid.",
    fullDescription:
      "We build social media branding that's consistent across platforms while optimized for each one: visual identity per platform, voice and tone adaptation, content templates, and the publishing cadence that builds an engaged following. Brand consistency without platform-generic sameness.",
    tags: ["Social Media", "Branding", "Content", "Voice", "Platforms"],
    industries: ["Consumer Goods", "Retail", "SaaS", "Media"],
    deliveryType: "retainer",
    timeline: "Ongoing",
    rating: 4.7,
    reviews: 58,
    popularity: 78,
    capabilities: [
      "Platform-specific visual identity",
      "Voice and tone adaptation per platform",
      "Content templates and publishing cadence",
      "Community engagement and management",
      "Performance reporting and optimization",
    ],
    deliverables: [
      "Social brand guidelines per platform",
      "Content templates and calendar",
      "Monthly content production",
      "Performance report and optimization plan",
    ],
    process: [
      { title: "Audit", description: "Current social presence and brand consistency." },
      { title: "Brand", description: "Platform-specific identity and voice." },
      { title: "Operate", description: "Content production and community management." },
      { title: "Optimize", description: "Performance reporting and tuning." },
    ],
    problemsSolved: [
      "Brand inconsistent across social platforms",
      "Content that doesn't fit each platform's format",
      "No defined voice for social engagement",
      "Social presence without strategic foundation",
    ],
    faqs: [
      { question: "Which platforms do you cover?", answer: "LinkedIn, Instagram, TikTok, X, Facebook, YouTube, and Threads — we focus on the platforms where your audience actually is." },
      { question: "Do you produce content?", answer: "Yes — monthly content production with templates that maintain brand consistency while optimizing for each platform." },
      { question: "Can you handle community management?", answer: "Yes — engagement, response, and community management as part of the retainer." },
      { question: "How do you measure success?", answer: "Follower growth, engagement rate, reach, and pipeline attributed to social — not vanity metrics." },
    ],
  }),

  // 54
  srv(54, {
    name: "Digital Marketing Integration & Enhancement Across Every Channel",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-lifecycle",
    icon: "Plug",
    accent: ACCENT.branding,
    shortDescription:
      "Integrate and enhance your brand across every digital marketing channel — one brand, every touchpoint.",
    fullDescription:
      "We integrate your brand across every digital marketing channel and enhance the touchpoints that matter: channel-by-channel brand audit, integration plan, and the enhancements that turn a fragmented brand presence into a coherent experience. One brand, every touchpoint, every channel.",
    tags: ["Digital Marketing", "Brand Integration", "Channels", "Touchpoints", "Consistency"],
    industries: ["SaaS", "E-commerce", "Retail", "Financial Services"],
    deliveryType: "project",
    timeline: "6–10 weeks",
    rating: 4.7,
    reviews: 46,
    popularity: 76,
    capabilities: [
      "Channel-by-channel brand audit",
      "Integration plan and roadmap",
      "Touchpoint enhancement and templates",
      "Brand compliance automation",
      "Ongoing monitoring and optimization",
    ],
    deliverables: [
      "Brand integration audit report",
      "Integration roadmap and plan",
      "Enhanced touchpoint templates",
      "Brand compliance dashboard",
    ],
    process: [
      { title: "Audit", description: "Channel-by-channel brand audit." },
      { title: "Plan", description: "Integration roadmap and enhancement plan." },
      { title: "Execute", description: "Touchpoint enhancement and template deployment." },
      { title: "Monitor", description: "Ongoing compliance monitoring and reporting." },
    ],
    problemsSolved: [
      "Brand fragmented across channels",
      "Touchpoints inconsistent with brand guidelines",
      "No monitoring so drift creeps back in",
      "Channel owners working in silos",
    ],
    faqs: [
      { question: "Which channels do you audit?", answer: "Website, email, paid, organic social, landing pages, app, and any other channel where your brand shows up." },
      { question: "Do you handle execution?", answer: "Yes — touchpoint enhancement, template deployment, and ongoing monitoring as part of the engagement." },
      { question: "How do you monitor compliance?", answer: "Brand compliance dashboard with automated checks and human review so drift gets caught early, not after launch." },
      { question: "Can you work with channel owners?", answer: "Yes — we partner with channel owners rather than replacing them, building internal capability as we go." },
    ],
  }),

  // 55
  srv(55, {
    name: "Competitor Analysis & Market Reach for Whitespace Opportunity Capture",
    categoryId: "cat-digital-sales-marketing",
    subcategoryId: "sub-dsm-cro",
    icon: "Target",
    accent: ACCENT.branding,
    shortDescription:
      "Competitor analysis and market reach programs — map the field, find the gap, and own the whitespace.",
    fullDescription:
      "We run competitor analysis and market reach programs that find the whitespace competitors aren't claiming: competitive teardown, positioning map, market reach strategy, and the messaging that lets you own a category position. Map the field, find the gap, and move to claim it.",
    tags: ["Competitor Analysis", "Market Reach", "Positioning", "Strategy", "Whitespace"],
    industries: ["SaaS", "B2B Services", "Financial Services", "Healthcare"],
    deliveryType: "project",
    timeline: "4–8 weeks",
    rating: 4.8,
    reviews: 40,
    popularity: 78,
    capabilities: [
      "Competitive teardown and benchmarking",
      "Positioning and perception mapping",
      "Whitespace and opportunity analysis",
      "Market reach strategy",
      "Messaging to claim category position",
    ],
    deliverables: [
      "Competitive analysis report",
      "Positioning and whitespace map",
      "Market reach strategy",
      "Messaging recommendations",
    ],
    process: [
      { title: "Map", description: "Competitive landscape and positioning map." },
      { title: "Analyze", description: "Whitespace and opportunity analysis." },
      { title: "Strategize", description: "Market reach and category positioning strategy." },
      { title: "Recommend", description: "Messaging and execution recommendations." },
    ],
    problemsSolved: [
      "No clarity on how you stack up vs. competitors",
      "Competitors claiming category positions you should own",
      "No strategic whitespace analysis",
      "Messaging that doesn't differentiate",
    ],
    faqs: [
      { question: "How do you map the competitive landscape?", answer: "Competitive teardowns across product, positioning, messaging, pricing, and customer perception — synthesized into a positioning map." },
      { question: "What's whitespace analysis?", answer: "Identifying category positions competitors aren't claiming — the gaps where you can move to own a unique position." },
      { question: "Can you handle ongoing competitive monitoring?", answer: "Yes — quarterly refresh of competitive analysis and positioning so you stay ahead as the market shifts." },
      { question: "Do you produce messaging?", answer: "Yes — messaging recommendations that let you claim and defend the category position identified in the analysis." },
    ],
  }),
];

/** Convenience slug list — used by the directory file to keep hrefs
 *  in sync with the catalog without importing the full Service objects. */
export const DIRECTORY_SERVICE_SLUGS: string[] = DIRECTORY_SERVICES.map(
  (s) => s.slug
);

/** Lookup helper used by the directory file. */
export function findDirectoryService(slug: string): Service | undefined {
  return DIRECTORY_SERVICES.find((s) => s.slug === slug);
}
