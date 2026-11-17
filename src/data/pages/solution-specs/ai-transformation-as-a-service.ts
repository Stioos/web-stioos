import type { SolutionSpec } from "../solution-types";

// ============================================================
// 05 — AI TRANSFORMATION AS A SERVICE
// Accent: fuchsia/purple/violet. Engagement model:
// Transformation project + monthly support.
//
// The most strategic of the six outcome bundles — a full AI
// transformation program: assessment → strategy → pilot →
// scale → optimize. Buyers are CEOs, CIOs, chief digital
// officers, and boards who want to become an AI-driven
// company, not run another POC.
// ============================================================

export const AI_TRANSFORMATION_SPEC: SolutionSpec = {
  slug: "ai-transformation-as-a-service",
  name: "AI Transformation as a Service",
  icon: "Sparkles",
  engagementModel: "Transformation project + monthly support",
  accent: {
    gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    tile: "bg-fuchsia-400/10 ring-fuchsia-400/25",
    icon: "text-fuchsia-400",
    dot: "bg-fuchsia-400",
    chip: "bg-fuchsia-400/10 text-fuchsia-200 ring-fuchsia-400/25",
    eyebrow: "text-fuchsia-400",
    glow: "rgba(232,121,249,0.20)",
  },

  // 01 — Hero
  hero: {
    eyebrow: "AI Transformation as a Service",
    title: "Turn AI from a board mandate into",
    highlight: "compounding operating margin.",
    subtitle:
      "One accountable program that assesses your business, rebuilds the data foundation, ships custom AI agents and LLM apps, integrates them into your stack, and drives enterprise-wide adoption — measured against one number: AI-annualized value created.",
    primaryCta: { label: "Book an AI assessment", href: "/contact" },
    secondaryCta: { label: "See case studies", href: "#case-studies" },
    metrics: [
      { value: "+38%", label: "Avg. workforce productivity gain" },
      { value: "−54%", label: "Operational cost reduction" },
      { value: "92%", label: "AI adoption rate at 12 months" },
    ],
    architectureLayers: [
      { name: "AI Strategy & Governance", icon: "Compass", components: ["Opportunity Map", "AI Policy", "ROI Model", "AI Council"] },
      { name: "Data Foundation", icon: "Database", components: ["Data Audit", "Pipelines", "Vector Store", "Catalog"] },
      { name: "Model & Agent Layer", icon: "BrainCircuit", components: ["LLM Gateway", "Custom Agents", "RAG", "Fine-tuning"] },
      { name: "Integration & Deployment", icon: "Workflow", components: ["API Layer", "Workflow Engine", "MLOps", "Observability"] },
      { name: "Adoption & Change Mgmt", icon: "GraduationCap", components: ["Enablement", "Training", "Champions", "Adoption KPIs"] },
    ],
  },

  // 02 — Outcome promise band
  outcomePromise: {
    promise: "We don't sell pilots, hackathons, or licenses. We sell an AI-driven company — and we put our roadmap, governance, and adoption KPIs on the line to prove it.",
    stats: [
      { value: "$3.2M", label: "Avg. annualized value per program", sublabel: "Across 28 enterprise transformations" },
      { value: "92%", label: "AI adoption at 12 months", sublabel: "vs. 14% industry average" },
      { value: "4.2x", label: "Faster executive decision-making", sublabel: "AI-powered ops + board dashboards" },
    ],
  },

  // 03 — Problem / solution split
  problemSolution: {
    title: "The transformation gap",
    subtitle: "Why 86% of enterprise AI pilots never reach production",
    problems: [
      { icon: "TrendingDown", text: "You've run a dozen POCs in 18 months. None reached production. The board is asking when AI shows up in the P&L — and you don't have an answer." },
      { icon: "Brain", text: "Every team is buying its own Copilot or building its own chatbot. No governance, no shared data layer, no ROI — and a growing shadow-AI liability." },
      { icon: "Database", text: "Your data is fragmented across 30 systems, half of it unstructured, none of it AI-ready. Models hallucinate on your own docs because they have no grounded context." },
      { icon: "Siren", text: "Risk, legal, and compliance block every AI initiative because there's no policy, no evals, no guardrails, and no audit trail." },
      { icon: "Users", text: "You bought the licenses. Nobody uses them. Adoption sits at 14% and change management is treated as a launch email instead of a program." },
    ],
    solutions: [
      { icon: "Target", text: "One transformation roadmap, value-ranked and sequenced, governed by an AI council with a board-grade ROI model tied to operating margin." },
      { icon: "Database", text: "We rebuild the data foundation — unified, vectorized, lineage-tracked, and evaluable — so models produce trustworthy output on your real data." },
      { icon: "BrainCircuit", text: "Custom agents and LLM apps built on your stack (OpenAI, Anthropic, Bedrock, Vertex), evaluated against your criteria, deployed into your workflows." },
      { icon: "ShieldCheck", text: "Governance, evals, and guardrails built in from day one — legal and risk sign off before code ships, not after the first incident." },
      { icon: "GraduationCap", text: "Embedded change management with a champions network, role-based training, and adoption analytics — we measure usage, not just licenses sold." },
    ],
  },

  // 04 — Service architecture
  architecture: {
    title: "Solution architecture",
    subtitle: "Five connected layers that turn an AI mandate into production AI. Every layer is staffed, instrumented, and owned by one accountable program.",
    layers: [
      { name: "AI Strategy & Governance", icon: "Compass", components: ["Opportunity Mapping", "AI Policy & Charter", "ROI Model", "AI Council"] },
      { name: "Data Foundation", icon: "Database", components: ["Data Audit & Lineage", "ETL/ELT Pipelines", "Vector Store", "Metadata Catalog"] },
      { name: "Model & Agent Layer", icon: "BrainCircuit", components: ["LLM Gateway", "RAG Pipelines", "Multi-Agent Systems", "Fine-tuning"] },
      { name: "Integration & Deployment", icon: "Workflow", components: ["API & Event Layer", "Workflow Orchestration", "MLOps / LLMOps", "Observability & Evals"] },
      { name: "Adoption & Change Mgmt", icon: "GraduationCap", components: ["Role-Based Enablement", "Champions Network", "Training Programs", "Adoption Analytics"] },
    ],
  },

  // 05 — Capabilities accordion
  capabilities: {
    title: "Capability breakdown",
    subtitle: "Six capabilities bundled into one transformation program",
    items: [
      { icon: "Compass", title: "AI Strategy & Roadmap", description: "Process-level opportunity assessment, value matrix, sequencing, AI council charter, and a board-grade ROI model tied to operating margin.", stat: { value: "$3.2M", label: "Avg. annualized value" } },
      { icon: "Database", title: "Data Readiness & Engineering", description: "Unified data layer with ETL/ELT, vectorization, lineage, and quality gates so every model runs on trustworthy, governed inputs.", stat: { value: "99%", label: "Source coverage" } },
      { icon: "BrainCircuit", title: "Custom AI & LLM Build", description: "RAG apps, multi-agent systems, fine-tuned models, and LLM gateways built on OpenAI, Anthropic, and open models — evaluated before ship.", stat: { value: "4.2x", label: "Faster decisions" } },
      { icon: "Workflow", title: "AI Integration & Deployment", description: "API, event, and workflow orchestration that plugs agents into Salesforce, SAP, ServiceNow, and your custom stack — not a sandbox.", stat: { value: "78%", label: "Process automation" } },
      { icon: "ShieldCheck", title: "AI Governance & Safety", description: "Evals, guardrails, policy, audit trails, and human-in-the-loop controls aligned to NIST AI RMF and ISO 42001 — legal and risk sign off first.", stat: { value: "100%", label: "Policy compliance" } },
      { icon: "GraduationCap", title: "AI Adoption & Change Mgmt", description: "Champions network, role-based training, adoption analytics, and exec reporting — measured by usage not licenses sold.", stat: { value: "92%", label: "Adoption at 12mo" } },
    ],
  },

  // 06 — Engagement journey
  journey: {
    title: "Engagement journey",
    subtitle: "From board mandate to enterprise-wide AI in 12 months",
    milestones: [
      { phase: "01", title: "AI opportunity assessment", description: "We map every business process, score AI opportunity by value and feasibility, and build a value-ranked roadmap with a board-grade ROI model.", duration: "Week 1–3", outcome: "Value-ranked opportunity backlog + ROI model" },
      { phase: "02", title: "AI strategy & governance", description: "AI council charter, acceptable-use policy, governance framework, and a transformation roadmap approved by exec, risk, and legal.", duration: "Week 3–6", outcome: "Approved roadmap + governance framework" },
      { phase: "03", title: "Pilot & proof", description: "Two high-value use cases built end-to-end on your data — RAG, agents, integrations — deployed, evaluated, and measured against KPIs.", duration: "Week 6–14", outcome: "2 production-grade AI apps live" },
      { phase: "04", title: "Enterprise scale", description: "Winning pilots scale across business units, integrate into core workflows, and roll out with champions and role-based training.", duration: "Month 4–9", outcome: "Enterprise-wide AI rollout live" },
      { phase: "05", title: "Continuous optimization", description: "Monthly optimization, new use-case intake, model refresh, drift monitoring, and adoption analytics — AI compounds quarter over quarter.", duration: "Ongoing", outcome: "Compounding AI value + adoption" },
    ],
  },

  // 07 — ROI calculator
  roi: {
    title: "ROI model",
    subtitle: "What a typical AI Transformation engagement looks like financially",
    inputs: [
      { label: "Transformation project fee", value: "$420K" },
      { label: "Monthly support retainer", value: "$28K/mo" },
      { label: "Internal AI team avoided", value: "$1.4M/yr" },
      { label: "Engagement length", value: "12 months" },
    ],
    outputs: [
      { label: "Annualized value created", value: "$3.2", unit: "M" },
      { label: "Productivity gain", value: "+38", unit: "%" },
      { label: "Operational cost reduction", value: "−54", unit: "%" },
      { label: "Payback period", value: "4.8", unit: "mo" },
    ],
    investment: "$756K",
    return: "$4.6M",
  },

  // 08 — Stack & integrations grid
  stack: {
    title: "The stack we wire together",
    subtitle: "One integrated AI platform across foundation models, orchestration, vector stores, ops, and governance",
    categories: [
      { name: "Foundation Models", tools: ["OpenAI GPT-4o", "Anthropic Claude 3.5", "Google Gemini 1.5", "Meta Llama 3.1", "Mistral Large"] },
      { name: "Agent Orchestration", tools: ["LangGraph", "CrewAI", "LlamaIndex", "AutoGen", "Semantic Kernel"] },
      { name: "Vector Stores", tools: ["Pinecone", "Weaviate", "Qdrant", "pgvector", "Milvus"] },
      { name: "Model & LLMOps", tools: ["MLflow", "Kubeflow", "Weights & Biases", "Hugging Face Hub", "LangSmith"] },
      { name: "Cloud AI Infrastructure", tools: ["AWS Bedrock", "Azure AI Foundry", "Google Vertex AI", "NVIDIA NIM", "Modal"] },
      { name: "Frameworks & Serving", tools: ["PyTorch", "TensorFlow", "Hugging Face Transformers", "vLLM", "NVIDIA Triton"] },
      { name: "System Integration", tools: ["MuleSoft", "Workato", "n8n", "Zapier", "Boomi"] },
      { name: "Governance & Evals", tools: ["Guardrails AI", "Arize", "WhyLabs", "Helicone", "LangSmith"] },
    ],
  },

  // 09 — Metric comparison cards
  metricComparison: {
    title: "Metric comparison",
    subtitle: "How STIOOS AI Transformation compares to industry averages and your realistic potential",
    metrics: [
      { label: "AI adoption rate at 12 months", industry: 14, stioos: 92, potential: 95, unit: "%" },
      { label: "Decision velocity (vs. baseline)", industry: 100, stioos: 420, potential: 500, unit: "%" },
      { label: "Process automation coverage", industry: 22, stioos: 78, potential: 85, unit: "%" },
      { label: "AI governance maturity", industry: 30, stioos: 94, potential: 98, unit: "%" },
    ],
  },

  // 10 — Case studies carousel
  caseStudies: {
    title: "Case studies",
    subtitle: "AI Transformation programs that shipped measurable operating impact",
    studies: [
      { industry: "Manufacturing · $1.2B", title: "Global manufacturer deployed 24 AI agents across 9 plants", result: { value: "+38%", label: "productivity gain" }, quote: "We went from a board mandate to 24 production agents in 9 months. STIOOS owned strategy, build, and adoption end-to-end." },
      { industry: "Insurance · Tier 1", title: "Insurer automated 78% of claims intake with RAG + agents", result: { value: "−54%", label: "operational cost" }, quote: "Claims that took 9 days now close in 4 hours. The governance work made it the first AI project our chief risk officer signed off on." },
      { industry: "B2B SaaS · Series C", title: "SaaS company shipped AI features in 90 days and re-rated ARR", result: { value: "$3.2M", label: "annualized value" }, quote: "We shipped three AI features before our in-house team finished hiring one ML engineer. STIOOS gave us a 6-month head start." },
      { industry: "Banking · Top 50", title: "Bank cut credit decision time from days to minutes", result: { value: "4.2x", label: "faster decisions" }, quote: "Decision velocity went from days to minutes. The data foundation work alone paid for the entire engagement." },
    ],
  },

  // 11 — Outcome scorecard
  scorecard: {
    title: "Outcome scorecard",
    subtitle: "The composite health of an AI Transformation program at steady state",
    donut: { value: 92, label: "AI transformation health" },
    bars: [
      { label: "Adoption rate", value: 92 },
      { label: "Governance maturity", value: 94 },
      { label: "Data readiness", value: 88 },
      { label: "Production coverage", value: 78 },
      { label: "Decision velocity", value: 84 },
    ],
    trend: { label: "AI-annualized value ($K) — last 7 quarters", points: [0, 240, 680, 1240, 1980, 2640, 3200] },
    kpis: [
      { value: "+38%", label: "Productivity gain" },
      { value: "−54%", label: "Opex reduction" },
      { value: "4.2x", label: "Decision velocity" },
    ],
  },

  // 12 — Testimonial wall
  testimonials: {
    title: "What clients say",
    subtitle: "CEOs, CIOs, and CDOs who put their AI transformation on STIOOS",
    testimonials: [
      { quote: "We went from AI theater to AI in the P&L. STIOOS gave us a roadmap, a council, and 24 production agents in 9 months.", name: "Robert Hayes", role: "CEO", company: "Industrial Manufacturing, $1.2B", rating: 5 },
      { quote: "The first AI program our chief risk officer signed off on. Governance and evals were built in from day one, not bolted on after an incident.", name: "Anita Kapoor", role: "CIO", company: "Tier-1 Insurance", rating: 5 },
      { quote: "We finally have one AI platform instead of 30 shadow projects. The data foundation work alone repaid the engagement in two quarters.", name: "Daniel Osei", role: "Chief Data Officer", company: "Top-50 Bank", rating: 5 },
      { quote: "STIOOS shipped three AI features before our in-house team hired one ML engineer. We re-rated our ARR multiple on the back of it.", name: "Mei Lin", role: "CTO", company: "B2B SaaS, Series C", rating: 5 },
      { quote: "Adoption went from 14% to 92% in a year. The champions network and change management were the unlock — not the models.", name: "Carlos Mendez", role: "COO", company: "Global Logistics, $2.8B", rating: 5 },
      { quote: "As a board member I've watched three CEOs fail at AI. This is the first program that showed up in operating margin within four quarters.", name: "Victoria Chen", role: "Board Director", company: "Public SaaS, NYSE", rating: 5 },
    ],
  },

  // 13 — Vs alternatives
  vsAlternatives: {
    title: "Vs the alternatives",
    subtitle: "How AI Transformation as a Service compares to in-house build, consulting firms, and point vendors",
    alternatives: ["In-house build", "Consulting firm", "Point vendor"],
    criteria: [
      { label: "Owns full transformation", scores: [60, 70, 10, 95] },
      { label: "Speed to production", scores: [25, 35, 55, 92] },
      { label: "Data + model + adoption", scores: [40, 60, 15, 96] },
      { label: "Governance depth", scores: [35, 70, 20, 94] },
      { label: "Cost efficiency", scores: [30, 25, 50, 88] },
      { label: "Adoption outcomes", scores: [35, 45, 20, 92] },
    ],
  },

  // 14 — Engagement tabs
  engagement: {
    title: "Engagement models",
    subtitle: "Three ways to engage — all anchored to a transformation roadmap and an ROI model",
    tabs: [
      { name: "Launch", price: "$40K", period: "project", description: "4-week AI opportunity assessment + roadmap. The board-grade starting point.", features: ["Business process audit", "AI opportunity matrix", "Data readiness scorecard", "Governance framework draft", "Value-ranked 12-month roadmap", "Executive readout"], popular: false },
      { name: "Transform", price: "$420K", period: "+ $28K/mo", description: "Full transformation program — assess, build, deploy, adopt, optimize. End-to-end accountable.", features: ["2 production AI use cases shipped", "Data foundation rebuild", "Custom agents + RAG + integrations", "Governance, evals, guardrails", "Champions network + training", "Monthly optimization + new intake"], popular: true },
      { name: "Enterprise", price: "Custom", period: "program", description: "Multi-business-unit program with dedicated pod and quarterly roadmap.", features: ["Multi-BU rollout", "Dedicated 7-person AI pod", "Shared AI platform + services", "Quarterly roadmap + board reporting", "Custom governance council", "SLA on adoption + value"], popular: false },
    ],
  },

  // 15 — Industries strip
  industries: {
    title: "Industries we transform",
    subtitle: "AI Transformation programs shipped across these verticals",
    industries: [
      { name: "Manufacturing", icon: "Factory", count: 9 },
      { name: "Financial Services", icon: "Landmark", count: 11 },
      { name: "Healthcare", icon: "HeartHandshake", count: 7 },
      { name: "Insurance", icon: "ShieldCheck", count: 6 },
      { name: "Retail & E-Commerce", icon: "ShoppingCart", count: 8 },
      { name: "Logistics & Supply", icon: "Ship", count: 5 },
      { name: "Public Sector", icon: "Building2", count: 4 },
      { name: "Energy & Utilities", icon: "Zap", count: 5 },
    ],
  },

  // 16 — CTA + FAQ
  ctaFaq: {
    cta: {
      eyebrow: "Become an AI-driven company",
      title: "Turn AI from a board mandate into operating margin.",
      subtitle: "Book a 30-minute AI opportunity assessment. We'll map your business processes, score AI opportunities, and give you a board-grade transformation roadmap with an ROI model tied to operating margin.",
      primaryCta: { label: "Book an AI assessment", href: "/contact" },
      secondaryCta: { label: "Browse AI services", href: "/marketplace?category=ai-data-intelligence" },
    },
    faqs: [
      { q: "How long does an AI transformation take?", a: "The Launch assessment is 4 weeks. A full Transform program runs 9–12 months: assessment (weeks 1–3), strategy and governance (weeks 3–6), pilot (weeks 6–14), scale (months 4–9), and continuous optimization ongoing. Most clients have production AI in market by week 14 and enterprise-wide rollout by month 9." },
      { q: "What ROI should we expect — and when?", a: "Average annualized value across 28 enterprise programs is $3.2M, with +38% productivity gains and −54% operational cost in automated workflows. First measurable ROI typically lands at week 14 when pilots go live; the full annualized figure compounds by month 12. We model ROI before we start and tie scope to it." },
      { q: "How do you de-risk AI for a risk-averse organization?", a: "Governance is built in from day one, not bolted on. We stand up an AI council, draft acceptable-use policy, run eval suites on every model output (accuracy, hallucination, bias, toxicity), deploy guardrails and human-in-the-loop checkpoints, and produce full audit trails. Most of our clients' chief risk officers sign off on the program before the first line of production code ships." },
      { q: "What does AI governance actually include?", a: "AI council charter and operating model, acceptable-use policy, data classification and lineage, model evals, output guardrails, human-in-the-loop checkpoints, prompt and response logging, audit trails, and ongoing drift monitoring. We align to NIST AI RMF and ISO 42001, plus your industry regs (SR 11-7, GDPR, HIPAA, EU AI Act) where applicable." },
      { q: "How do you actually drive adoption — not just deploy?", a: "We embed change management from week one: a champions network in every business unit, role-based training programs, in-workflow enablement, adoption analytics that track usage not licenses, and monthly exec reporting against adoption KPIs. Our 92% adoption rate at 12 months — vs. 14% industry average — comes from this work, not from the models." },
      { q: "We've already invested in Copilot / Bedrock / an in-house team — do we start over?", a: "No. We meet you where you are. If you have Copilot licenses, we drive adoption. If you're on AWS Bedrock, Azure AI Foundry, or Google Vertex AI, we build on it. If you have an in-house team, we augment with specialist depth (RAG, multi-agent, governance, LLMOps) and own the integrated transformation roadmap so your team can focus on the product roadmap. We never force a stack migration." },
    ],
  },
};
