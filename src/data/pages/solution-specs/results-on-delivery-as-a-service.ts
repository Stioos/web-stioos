import type { SolutionSpec } from "../solution-types";

// ============================================================
// RESULTS ON DELIVERY AS A SERVICE (RODaaS)
// Accent: amber (gold = results / achievement / performance).
// Engagement model: Outcome-based — pay on delivery.
//
// The pay-for-performance solution: clients pay only for
// outcomes actually delivered (pipeline, revenue, cost
// savings, adoption, uptime). Every section balances 50%
// content with 50% infographics so the value proposition
// is always paired with a visual proof element.
// ============================================================

export const RODAAS_SPEC: SolutionSpec = {
  slug: "results-on-delivery-as-a-service",
  name: "Results on Delivery as a Service",
  icon: "Trophy",
  engagementModel: "Outcome-based — pay on delivery",
  accent: {
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    tile: "bg-amber-400/10 ring-amber-400/25",
    icon: "text-amber-400",
    dot: "bg-amber-400",
    chip: "bg-amber-400/10 text-amber-200 ring-amber-400/25",
    eyebrow: "text-amber-400",
    glow: "rgba(251,191,36,0.20)",
  },

  // 01 — Hero (50% copy + 50% architecture diagram)
  hero: {
    eyebrow: "Results on Delivery as a Service",
    title: "Pay only for the outcomes we",
    highlight: "actually deliver — guaranteed.",
    subtitle:
      "The only engagement where your fee is tied to results, not hours. We define the outcome target together — pipeline, revenue, cost savings, adoption, uptime — and you pay when it's delivered. No results, no fee. That's the contract.",
    primaryCta: { label: "Define your outcome target", href: "/contact" },
    secondaryCta: { label: "See delivered results", href: "#case-studies" },
    metrics: [
      { value: "100%", label: "Fee tied to delivered results" },
      { value: "$0", label: "Paid if targets are missed" },
      { value: "14", label: "Outcome types we guarantee" },
    ],
    architectureLayers: [
      { name: "Outcome Definition", icon: "Target", components: ["Targets", "Baseline", "Measurement", "Success criteria"] },
      { name: "Delivery Engine", icon: "Rocket", components: ["AI agents", "Engineering", "Ops", "Optimization"] },
      { name: "Measurement Layer", icon: "Gauge", components: ["Tracking", "Attribution", "Audit trail", "Real-time"] },
      { name: "Verification", icon: "BadgeCheck", components: ["Third-party audit", "Data proof", "Client sign-off", "Immutable log"] },
      { name: "Payment on Delivery", icon: "Coins", components: ["Per-result pricing", "Escrow", "Milestone billing", "SLA-backed"] },
    ],
  },

  // 02 — Outcome promise band (50% promise text + 50% animated stats)
  outcomePromise: {
    promise: "If we don't deliver the agreed outcome, you don't pay for it. That's not a slogan — it's the contract.",
    stats: [
      { value: "$0", label: "You pay if a target is missed", sublabel: "Written into every engagement" },
      { value: "94%", label: "Of targets hit on first attempt", sublabel: "Across 60+ outcome engagements" },
      { value: "3.2x", label: "Avg. return on outcome fee", sublabel: "You pay $1, we deliver $3.20 in value" },
    ],
  },

  // 03 — Problem / solution split (50% problems + 50% solutions)
  problemSolution: {
    title: "The alignment gap",
    subtitle: "Why traditional engagements fail to deliver results",
    problems: [
      { icon: "X", text: "You pay for hours and retainers regardless of whether anything was actually delivered." },
      { icon: "Clock", text: "Agencies optimize for billable activity, not for the outcome you actually care about." },
      { icon: "TrendingDown", text: "No accountability — when results don't materialize, the vendor blames the market, the data, or your team." },
      { icon: "RefreshCw", text: "Vanity metrics mask real performance: '1M impressions' doesn't equal pipeline." },
      { icon: "Lock", text: "No skin in the game — the vendor gets paid the same whether you win or lose." },
    ],
    solutions: [
      { icon: "Check", text: "You pay only for outcomes actually delivered and verified — pipeline, revenue, savings, adoption." },
      { icon: "Target", text: "Every engagement is engineered around one number: the result you're paying for." },
      { icon: "BadgeCheck", text: "Full accountability — if we miss the target, we don't bill it. The risk is ours." },
      { icon: "BarChart3", text: "Every metric ties to revenue or cost — no vanity numbers, no ambiguous attribution." },
      { icon: "Trophy", text: "We put our fee on the line: no delivery, no payment. Aligned from day one." },
    ],
  },

  // 04 — Service architecture (50% layer labels + 50% component diagram)
  architecture: {
    title: "How RODaaS works",
    subtitle: "Five layers that guarantee the outcome — from definition to payment on delivery. Every layer is instrumented, audited, and tied to the result.",
    layers: [
      { name: "Outcome Definition", icon: "Target", components: ["Joint target-setting", "Baseline measurement", "Success criteria", "Unit economics"] },
      { name: "Delivery Engine", icon: "Rocket", components: ["AI agent fleet", "Senior engineering", "Operations team", "Continuous optimization"] },
      { name: "Measurement Layer", icon: "Gauge", components: ["Server-side tracking", "Attribution model", "Real-time dashboard", "Audit trail"] },
      { name: "Verification", icon: "BadgeCheck", components: ["Third-party audit", "Data proof package", "Client sign-off", "Immutable log"] },
      { name: "Payment on Delivery", icon: "Coins", components: ["Per-result pricing", "Escrow holding", "Milestone billing", "SLA penalties"] },
    ],
  },

  // 05 — Capabilities accordion (50% text + 50% stat badges)
  capabilities: {
    title: "Outcome types we guarantee",
    subtitle: "Fourteen result categories with per-unit pricing — you only pay for the ones you want delivered",
    items: [
      { icon: "TrendingUp", title: "Pipeline Generated", description: "Qualified sales pipeline created and attributed to the engagement. Priced per $1,000 of verified pipeline.", stat: { value: "$2.4M", label: "avg. quarterly pipeline delivered" } },
      { icon: "Coins", title: "Revenue Closed", description: "Net-new revenue closed from engagement-sourced leads and conversions. Priced as % of revenue delivered.", stat: { value: "$1.8M", label: "avg. revenue influenced per quarter" } },
      { icon: "PiggyBank", title: "Cost Savings Delivered", description: "Documented cost reductions from automation, cloud optimization, or process efficiency. Priced per $1,000 saved.", stat: { value: "$860K", label: "avg. annualized savings delivered" } },
      { icon: "Zap", title: "Cycle Time Reduction", description: "Measurable reduction in order-to-cash, support resolution, or deployment cycle time. Priced per hour saved.", stat: { value: "−62%", label: "avg. cycle time reduction" } },
      { icon: "Users", title: "Adoption Rate", description: "User/team adoption of a tool, process, or platform to a defined threshold. Priced per adopted seat.", stat: { value: "92%", label: "avg. adoption rate achieved" } },
      { icon: "ShieldCheck", title: "Uptime & SLA", description: "Guaranteed uptime or response-time SLA with credits for any miss. Priced per percentage point delivered.", stat: { value: "99.95%", label: "avg. uptime delivered" } },
    ],
  },

  // 06 — Engagement journey (50% milestone text + 50% outcome badges)
  journey: {
    title: "The delivery journey",
    subtitle: "From outcome definition to payment — a transparent five-milestone path",
    milestones: [
      { phase: "01", title: "Define the outcome", description: "We jointly define the target, the baseline, the measurement methodology, and the per-unit price. Everything is written into the contract before work starts.", duration: "Week 1", outcome: "Signed outcome contract with unit pricing" },
      { phase: "02", title: "Instrument & baseline", description: "Server-side tracking, attribution model, and dashboard stood up. Baseline is measured and both sides sign off on the starting number.", duration: "Week 2", outcome: "Baseline verified by both parties" },
      { phase: "03", title: "Deliver & optimize", description: "The delivery engine runs — AI agents, engineering, ops, optimization — with weekly progress reports against the target.", duration: "Week 3–12", outcome: "Weekly progress against target" },
      { phase: "04", title: "Verify & audit", description: "Third-party audit of the delivered results. Data proof package compiled. Client reviews and signs off on what was delivered.", duration: "Week 12–13", outcome: "Audited result with data proof" },
      { phase: "05", title: "Pay on delivery", description: "You pay only for verified outcomes delivered above baseline. Missed targets are not billed. Escrow releases per the contract.", duration: "Week 13", outcome: "You pay only for what was delivered" },
    ],
  },

  // 07 — ROI calculator (50% investment inputs + 50% return outputs with bar)
  roi: {
    title: "The economics of paying on delivery",
    subtitle: "What a typical RODaaS engagement looks like financially — your fee is tied to results, not hours",
    inputs: [
      { label: "Outcome fee per $1K pipeline", value: "$45" },
      { label: "Target pipeline to deliver", value: "$2.0M" },
      { label: "Baseline (existing)", value: "$420K" },
      { label: "Engagement length", value: "90 days" },
    ],
    outputs: [
      { label: "Pipeline delivered", value: "$2.4", unit: "M" },
      { label: "Revenue influenced", value: "$1.8", unit: "M" },
      { label: "Your outcome fee", value: "$108", unit: "K" },
      { label: "Net value to you", value: "$1.69", unit: "M" },
    ],
    investment: "$108K",
    return: "$1.8M",
  },

  // 08 — Stack grid (50% category labels + 50% tool chips)
  stack: {
    title: "The delivery stack",
    subtitle: "The tools and platforms behind every guaranteed outcome",
    categories: [
      { name: "Measurement", tools: ["Segment", "GA4", "Snowflake", "dbt", "Looker"] },
      { name: "Attribution", tools: ["Dreamdata", "Ruler", "HockeyStack", "Server-side", "Warehouse"] },
      { name: "Automation", tools: ["OpenAI", "LangGraph", "n8n", "Zapier", "Workato"] },
      { name: "CRM & Revenue", tools: ["Salesforce", "HubSpot", "Clari", "Outreach", "Salesloft"] },
      { name: "Audit & Verification", tools: ["BigQuery", "Immutable logs", "Third-party audit", "Data proof", "Client portal"] },
      { name: "Payment & Escrow", tools: ["Stripe", "Escrow.com", "Milestone billing", "SLA credits", "Contract"] },
      { name: "Optimization", tools: ["Optimizely", "VWO", "Mixpanel", "Amplitude", "Hotjar"] },
      { name: "Reporting", tools: ["Looker", "Power BI", "Tableau", "Sheets", "Weekly review"] },
    ],
  },

  // 09 — Metric comparison (50% labels + 50% animated bars)
  metricComparison: {
    title: "Metric comparison",
    subtitle: "How RODaaS compares to traditional engagements and your realistic potential",
    metrics: [
      { label: "Fee tied to results (%)", industry: 5, stioos: 100, potential: 100, unit: "%" },
      { label: "Targets hit on first attempt", industry: 38, stioos: 94, potential: 96, unit: "%" },
      { label: "Risk borne by vendor", industry: 10, stioos: 90, potential: 95, unit: "%" },
      { label: "Attribution transparency", industry: 22, stioos: 99, potential: 99, unit: "%" },
    ],
  },

  // 10 — Case studies carousel (50% narrative + 50% result stat)
  caseStudies: {
    title: "Delivered results",
    subtitle: "Outcome engagements where the client paid only for what was delivered",
    studies: [
      { industry: "B2B SaaS · Series B", title: "SaaS company paid only for pipeline actually delivered", result: { value: "$2.4M", label: "pipeline delivered" }, quote: "We paid for $2.4M of pipeline and got exactly that. The risk reversal changed how our board thinks about vendor engagements." },
      { industry: "E-Commerce · $14M", title: "DTC brand paid for revenue lift, not ad management", result: { value: "+62%", label: "revenue lift delivered" }, quote: "Every previous agency billed us for hours. STIOOS billed us for results. The alignment was immediate." },
      { industry: "FinTech · $40M ARR", title: "FinTech paid for verified cost savings — or nothing", result: { value: "$860K", label: "savings delivered" }, quote: "They missed one target out of six. That one wasn't billed. That's accountability you can take to the board." },
      { industry: "Healthcare · 12 hospitals", title: "Hospital network paid per adoption milestone", result: { value: "92%", label: "adoption rate delivered" }, quote: "We defined adoption as the outcome. STIOOS delivered 92% and billed per adopted seat. No adoption, no fee." },
    ],
  },

  // 11 — Outcome scorecard (50% labels + 50% donut/bars/trend/kpis)
  scorecard: {
    title: "Delivery scorecard",
    subtitle: "The composite health of a RODaaS engagement at steady state — every metric is audited",
    donut: { value: 94, label: "Targets hit rate" },
    bars: [
      { label: "Attribution accuracy", value: 99 },
      { label: "Audit pass rate", value: 97 },
      { label: "On-time delivery", value: 92 },
      { label: "Client sign-off rate", value: 96 },
      { label: "Fee-to-value ratio", value: 88 },
    ],
    trend: { label: "Delivered outcomes — last 7 quarters", points: [18, 28, 42, 58, 71, 84, 94] },
    kpis: [
      { value: "94%", label: "Targets hit" },
      { value: "3.2x", label: "Return on fee" },
      { value: "$0", label: "Paid for misses" },
    ],
  },

  // 12 — Testimonial wall (50% quote + 50% rating/avatar)
  testimonials: {
    title: "What clients say",
    subtitle: "Leaders who paid only for delivered results",
    testimonials: [
      { quote: "For the first time, a vendor's incentives were perfectly aligned with ours. We paid for outcomes, not promises.", name: "Sarah Chen", role: "VP Revenue", company: "FinTech, $40M ARR", rating: 5 },
      { quote: "They missed one target and didn't bill it. That one moment built more trust than three years of vendor relationships.", name: "Marcus Reid", role: "COO", company: "B2B SaaS, Series B", rating: 5 },
      { quote: "Paying for results instead of hours changed our entire procurement conversation. The board approved immediately.", name: "Priya Nair", role: "CFO", company: "Healthcare, 12 hospitals", rating: 5 },
      { quote: "The data proof package was so clean our auditors signed off without a single question. That's never happened before.", name: "James Okafor", role: "VP Operations", company: "Logistics, Multi-region", rating: 5 },
      { quote: "We defined the outcome together, agreed on the price per unit, and STIOOS delivered. Simple, transparent, accountable.", name: "Elena Volkov", role: "CMO", company: "DTC, $14M", rating: 5 },
      { quote: "The escrow and milestone billing meant we never felt at risk. The money was released only after we verified delivery.", name: "David Park", role: "Founder", company: "SaaS, Bootstrapped", rating: 5 },
    ],
  },

  // 13 — Vs alternatives (50% criteria + 50% animated score bars)
  vsAlternatives: {
    title: "Vs the alternatives",
    subtitle: "How RODaaS compares to traditional retainer, hourly, and project-based engagements",
    alternatives: ["Retainer agency", "Hourly consultant", "Fixed project"],
    criteria: [
      { label: "Fee tied to results delivered", scores: [10, 5, 15, 100] },
      { label: "Risk borne by vendor", scores: [15, 5, 20, 90] },
      { label: "Attribution transparency", scores: [25, 15, 30, 99] },
      { label: "Targets hit rate", scores: [35, 30, 45, 94] },
      { label: "Audit & verification", scores: [10, 5, 20, 97] },
      { label: "Skin in the game", scores: [10, 5, 25, 100] },
    ],
  },

  // 14 — Engagement tabs (50% description + 50% feature list)
  engagement: {
    title: "Engagement models",
    subtitle: "Three ways to structure pay-on-delivery — all with the fee tied to verified results",
    tabs: [
      { name: "Pilot", price: "$25K", period: "outcome", description: "One outcome target, 60-day delivery, per-unit pricing. Validate the model with low risk.", features: ["1 outcome target", "60-day delivery window", "Per-unit pricing", "Baseline measurement", "Weekly progress report", "Audited result"], popular: false },
      { name: "Growth", price: "$108K", period: "quarter", description: "3-4 outcome targets across pipeline, revenue, and savings. The standard pay-on-delivery engagement.", features: ["3-4 outcome targets", "90-day delivery window", "Per-unit + milestone pricing", "Server-side attribution", "Third-party audit", "Escrow & milestone billing", "SLA penalties for misses"], popular: true },
      { name: "Enterprise", price: "Custom", period: "program", description: "Multi-outcome program with dedicated delivery pod, custom measurement, and quarterly target resets.", features: ["Unlimited outcome targets", "Dedicated 6-person pod", "Custom attribution model", "Quarterly target reset", "Executive reporting", "Board-grade audit package", "SLA: 95% targets hit"], popular: false },
    ],
  },

  // 15 — Industries strip (50% industry name + 50% count badge)
  industries: {
    title: "Industries we deliver results in",
    subtitle: "RODaaS engagements shipped across these verticals — all pay-on-delivery",
    industries: [
      { name: "B2B SaaS", icon: "Boxes", count: 12 },
      { name: "E-Commerce", icon: "ShoppingCart", count: 15 },
      { name: "FinTech", icon: "Coins", count: 8 },
      { name: "Healthcare", icon: "HeartHandshake", count: 6 },
      { name: "Logistics", icon: "Ship", count: 5 },
      { name: "Manufacturing", icon: "Factory", count: 7 },
      { name: "Real Estate", icon: "Building2", count: 4 },
      { name: "Professional Services", icon: "Briefcase", count: 6 },
    ],
  },

  // 16 — CTA + FAQ (50% CTA band + 50% FAQ accordion)
  ctaFaq: {
    cta: {
      eyebrow: "Pay for results, not promises",
      title: "Define the outcome you want delivered. We'll put our fee on the line.",
      subtitle: "Book a 30-minute outcome-definition session. We'll jointly define the target, the baseline, the measurement, and the per-unit price — and put it all in a contract where you pay only when results are delivered.",
      primaryCta: { label: "Define your outcome target", href: "/contact" },
      secondaryCta: { label: "Browse all services", href: "/marketplace" },
    },
    faqs: [
      { q: "How is the outcome fee calculated?", a: "The fee is per unit of outcome delivered: per $1,000 of pipeline, per % of revenue lift, per $1,000 of cost savings, per adopted seat, etc. We agree on the unit price before the engagement starts. You pay only for units actually delivered and verified above the baseline." },
      { q: "What happens if you miss the target?", a: "You don't pay for it. Missed targets are not billed — that's the core of the contract. If we deliver 80% of the target, you pay for 80% of the units. If we deliver 0%, you pay $0 for that outcome." },
      { q: "How do you verify the results?", a: "Every outcome is measured via server-side tracking, attributed through a jointly-agreed model, and verified by a third-party audit. We compile a data proof package (raw data, attribution chain, audit trail) that your team reviews and signs off on before any billing." },
      { q: "Is there an upfront cost?", a: "The Pilot tier has a small setup fee for instrumentation and baseline measurement ($5K–$10K depending on complexity). Growth and Enterprise are fully outcome-based — no upfront fee, you pay only for delivered results. Escrow holds the commitment." },
      { q: "What if the market changes mid-engagement?", a: "The contract includes a market-adjustment clause: if external conditions materially change (regulatory shift, market crash, force majeure), both sides can renegotiate the target or exit without penalty. We don't penalize clients for things outside anyone's control." },
      { q: "How is this different from performance marketing?", a: "Performance marketing is channel-specific (paid ads) and measures proxies (clicks, leads). RODaaS is outcome-specific (pipeline, revenue, savings, adoption) and measures the actual business result end-to-end — across all channels, all teams, all technologies. It's the outcome, not the activity." },
    ],
  },
};
