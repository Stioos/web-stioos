import type { SolutionSpec } from "../solution-types";

// ============================================================
// 01 — REVENUE GROWTH AS A SERVICE
// Accent: emerald. Engagement model: Monthly retainer +
// performance fee.
//
// Outcome bundle that turns ad spend + sales effort into
// qualified pipeline — combining AI SDR, paid media, SEO,
// lifecycle, and CRO under one accountable engagement.
// ============================================================

export const REVENUE_GROWTH_SPEC: SolutionSpec = {
  slug: "revenue-growth-as-a-service",
  name: "Revenue Growth as a Service",
  icon: "TrendingUp",
  engagementModel: "Monthly retainer + performance fee",
  accent: {
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    tile: "bg-emerald-400/10 ring-emerald-400/25",
    icon: "text-emerald-400",
    dot: "bg-emerald-400",
    chip: "bg-emerald-400/10 text-emerald-200 ring-emerald-400/25",
    eyebrow: "text-emerald-400",
    glow: "rgba(52,211,153,0.20)",
  },

  // 01 — Hero
  hero: {
    eyebrow: "Revenue Growth as a Service",
    title: "Turn every marketing dollar into",
    highlight: "qualified pipeline that closes.",
    subtitle:
      "One accountable engagement that combines AI SDR, paid media, SEO, lifecycle email/SMS, and conversion rate optimization — engineered around a single number: qualified pipeline generated.",
    primaryCta: { label: "Book a growth audit", href: "/contact" },
    secondaryCta: { label: "See case studies", href: "#case-studies" },
    metrics: [
      { value: "3.8x", label: "Avg. pipeline lift in Q1" },
      { value: "−42%", label: "Cost per qualified lead" },
      { value: "11", label: "Channels under one roof" },
    ],
    architectureLayers: [
      { name: "Acquisition Engine", icon: "Target", components: ["Paid Search", "Paid Social", "SEO/AEO", "Referral"] },
      { name: "Engagement Layer", icon: "MessageSquare", components: ["AI SDR", "Lifecycle Email", "SMS", "Chatbots"] },
      { name: "Conversion Layer", icon: "Gauge", components: ["CRO", "Landing Pages", "A/B Testing", "Funnel"] },
      { name: "Analytics & Attribution", icon: "BarChart3", components: ["GA4", "Segment", "Attribution", "Forecast"] },
      { name: "Revenue Operations", icon: "Coins", components: ["CRM Sync", "Pipeline Mgmt", "Forecasting", "Reporting"] },
    ],
  },

  // 02 — Outcome promise band
  outcomePromise: {
    promise: "We don't sell clicks or impressions. We sell qualified pipeline — and we put our fee on the line to prove it.",
    stats: [
      { value: "$2.4M", label: "Avg. quarterly pipeline generated", sublabel: "Across 40+ active engagements" },
      { value: "47%", label: "Of leads contacted within 5 minutes", sublabel: "vs. 8% industry average" },
      { value: "4.7x", label: "Blended ROAS within 90 days", sublabel: "Paid + lifecycle + CRO combined" },
    ],
  },

  // 03 — Problem / solution split
  problemSolution: {
    title: "The growth gap",
    subtitle: "Why most marketing spend never becomes pipeline",
    problems: [
      { icon: "TrendingDown", text: "Ad spend rises quarter after quarter while pipeline stays flat — nobody owns the number that matters." },
      { icon: "Clock", text: "Inbound leads cool in 5 minutes; your team follows up in 5 hours and loses the 47% that convert on first contact." },
      { icon: "RefreshCw", text: "SEO, paid, email, and CRO live in separate vendor silos with no shared attribution and no shared goal." },
      { icon: "X", text: "You can't tell which dollar produced which pipeline — so you can't double down on what works." },
      { icon: "Target", text: "Agencies report on vanity metrics (impressions, clicks, MQLs) instead of revenue and pipeline." },
    ],
    solutions: [
      { icon: "TrendingUp", text: "One accountable team owns the qualified-pipeline number end-to-end — not channel silos." },
      { icon: "Zap", text: "AI SDR follows up every inbound lead in under 5 minutes, 24/7, with context-aware personalization." },
      { icon: "Network", text: "Paid, SEO, lifecycle, and CRO run as one integrated engine with shared attribution and shared goals." },
      { icon: "BarChart3", text: "Server-side attribution ties every dollar to pipeline and revenue — so you know exactly what works." },
      { icon: "BadgeCheck", text: "We report on pipeline, ROAS, and CAC — and our retainer includes a performance fee tied to results." },
    ],
  },

  // 04 — Service architecture
  architecture: {
    title: "Solution architecture",
    subtitle: "Five connected layers that turn spend into pipeline. Every layer is staffed, instrumented, and owned by one accountable team.",
    layers: [
      { name: "Acquisition Engine", icon: "Target", components: ["Google Ads", "Meta Ads", "LinkedIn Ads", "SEO & AEO", "Affiliate"] },
      { name: "Engagement Layer", icon: "MessageSquare", components: ["AI SDR Outbound", "Lifecycle Email", "SMS Marketing", "Site Chatbots"] },
      { name: "Conversion Layer", icon: "Gauge", components: ["Landing Pages", "A/B Testing", "Funnel Optimization", "Form Optimization"] },
      { name: "Analytics & Attribution", icon: "BarChart3", components: ["GA4 Setup", "Server-side Tracking", "Multi-touch Attribution", "Pipeline Forecast"] },
      { name: "Revenue Operations", icon: "Coins", components: ["CRM Sync", "Lead Scoring", "Pipeline Reporting", "Weekly Revenue Review"] },
    ],
  },

  // 05 — Capabilities accordion
  capabilities: {
    title: "Capability breakdown",
    subtitle: "Six capabilities bundled into one engagement",
    items: [
      { icon: "Target", title: "AI-Optimized Paid Media", description: "Google, Meta, and LinkedIn campaigns managed by AI-bidding + weekly creative testing, optimized for pipeline not clicks.", stat: { value: "4.7x", label: "Avg. blended ROAS" } },
      { icon: "Search", title: "SEO & Answer Engine Optimization", description: "Rank in Google AND get cited by ChatGPT, Perplexity, and Gemini with structured content + schema.", stat: { value: "+38%", label: "Organic qualified traffic" } },
      { icon: "Bot", title: "AI SDR Outbound Engine", description: "Autonomous prospecting, qualification, and meeting booking across your ICP — 24/7, with human-grade personalization.", stat: { value: "+71%", label: "Sales-qualified leads" } },
      { icon: "Mail", title: "Lifecycle Email & SMS", description: "Automated welcome, nurture, cart-recovery, win-back, and revenue-reporting flows across email and SMS.", stat: { value: "62%", label: "Email-attributed revenue lift" } },
      { icon: "Gauge", title: "Conversion Rate Optimization", description: "Continuous A/B testing on landing pages, forms, checkout, and funnel steps — every test tied to pipeline impact.", stat: { value: "+19%", label: "Avg. conversion lift" } },
      { icon: "BarChart3", title: "Attribution & Revenue Ops", description: "Server-side tracking, multi-touch attribution, CRM sync, and weekly pipeline reviews so you know what's working.", stat: { value: "99%", label: "Pipeline source attribution" } },
    ],
  },

  // 06 — Engagement journey
  journey: {
    title: "Engagement journey",
    subtitle: "From audit to always-on pipeline engine in 90 days",
    milestones: [
      { phase: "01", title: "Growth audit & baseline", description: "We audit your funnel, attribution, channels, and CRM to baseline where pipeline leaks today.", duration: "Week 1–2", outcome: "Baseline CAC, LTV, and pipeline leakage identified" },
      { phase: "02", title: "Architecture & instrumentation", description: "Server-side tracking, GA4, CRM sync, and attribution model stood up so every dollar is traceable.", duration: "Week 2–4", outcome: "100% spend attributable to pipeline" },
      { phase: "03", title: "Channel launch", description: "Paid, SEO, AI SDR, and lifecycle launches in sequence with weekly optimization cadence.", duration: "Week 4–8", outcome: "All channels live and optimizing" },
      { phase: "04", title: "CRO & scale", description: "A/B testing program ramps, winning channels get scaled, losers get cut — tied to pipeline impact.", duration: "Week 8–12", outcome: "3.8x avg. pipeline lift achieved" },
      { phase: "05", title: "Always-on optimization", description: "Weekly revenue reviews, monthly strategy, and continuous testing — the engine never stops compounding.", duration: "Ongoing", outcome: "Pipeline compounds quarter over quarter" },
    ],
  },

  // 07 — ROI calculator
  roi: {
    title: "ROI model",
    subtitle: "What a typical Revenue Growth engagement looks like financially",
    inputs: [
      { label: "Monthly ad spend managed", value: "$80K" },
      { label: "STIOOS retainer + performance", value: "$22K/mo" },
      { label: "Internal team time saved", value: "120 hrs/mo" },
      { label: "Engagement length", value: "12 months" },
    ],
    outputs: [
      { label: "Pipeline generated Q1", value: "$2.4", unit: "M" },
      { label: "Blended ROAS", value: "4.7", unit: "x" },
      { label: "Cost per SQL", value: "−42", unit: "%" },
      { label: "Payback period", value: "3.2", unit: "mo" },
    ],
    investment: "$1.2M",
    return: "$9.6M",
  },

  // 08 — Stack & integrations grid
  stack: {
    title: "The stack we wire together",
    subtitle: "One integrated engine across acquisition, engagement, conversion, and analytics",
    categories: [
      { name: "Paid Media", tools: ["Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads", "YouTube Ads"] },
      { name: "SEO & Content", tools: ["Ahrefs", "Semrush", "GA4", "Search Console", "Schema.org"] },
      { name: "AI & SDR", tools: ["OpenAI", "Claude", "Outreach", "Salesloft", "Apollo"] },
      { name: "Lifecycle", tools: ["Klaviyo", "HubSpot", "Customer.io", "Postscript", "Attentive"] },
      { name: "Analytics", tools: ["Segment", "GA4", "Mixpanel", "Amplitude", "Looker"] },
      { name: "CRM & RevOps", tools: ["Salesforce", "HubSpot CRM", "Pipedrive", "Zoominfo", "Clari"] },
      { name: "CRO & Testing", tools: ["Optimizely", "VWO", "Hotjar", "FullStory", "Unbounce"] },
      { name: "Attribution", tools: ["Segment", "Ruler", "HockeyStack", "Dreamdata", "GA4"] },
    ],
  },

  // 09 — Metric comparison cards
  metricComparison: {
    title: "Metric comparison",
    subtitle: "How STIOOS Revenue Growth compares to industry averages and your realistic potential",
    metrics: [
      { label: "Lead response time (min)", industry: 320, stioos: 5, potential: 3, unit: "m" },
      { label: "Blended ROAS", industry: 180, stioos: 470, potential: 550, unit: "%" },
      { label: "Email revenue attribution", industry: 18, stioos: 62, potential: 70, unit: "%" },
      { label: "Pipeline source attribution", industry: 45, stioos: 99, potential: 99, unit: "%" },
    ],
  },

  // 10 — Case studies carousel
  caseStudies: {
    title: "Case studies",
    subtitle: "Revenue Growth engagements that shipped measurable pipeline",
    studies: [
      { industry: "DTC Apparel · $14M", title: "E-commerce brand lifted ROAS 4.7x in one quarter", result: { value: "4.7x", label: "blended ROAS" }, quote: "We finally have one team that owns the pipeline number. No more arguing about which channel gets credit." },
      { industry: "B2B SaaS · Series B", title: "SaaS company tripled SQL volume with AI SDR + paid", result: { value: "+71%", label: "qualified SQLs" }, quote: "The AI SDR follows up every lead in under 5 minutes. Our old team took 5 hours. The math is brutal." },
      { industry: "FinTech · $40M ARR", title: "FinTech cut CAC 42% with attribution rebuild + CRO", result: { value: "−42%", label: "cost per SQL" }, quote: "For the first time we can see which dollar produced which customer. We cut three channels and doubled down on two." },
      { industry: "Real Estate · Multi-state", title: "Brokerage grew qualified leads 3.8x with lifecycle + SEO/AEO", result: { value: "3.8x", label: "qualified leads" }, quote: "They got us cited by ChatGPT for the top 12 questions our buyers ask. That alone paid for the engagement." },
    ],
  },

  // 11 — Outcome scorecard
  scorecard: {
    title: "Outcome scorecard",
    subtitle: "The composite health of a Revenue Growth engagement at steady state",
    donut: { value: 94, label: "Pipeline engine health" },
    bars: [
      { label: "Attribution coverage", value: 99 },
      { label: "Lead response speed", value: 96 },
      { label: "Channel integration", value: 92 },
      { label: "CRO test velocity", value: 88 },
      { label: "Lifecycle automation", value: 94 },
    ],
    trend: { label: "Qualified pipeline — last 7 months", points: [42, 58, 71, 89, 112, 138, 164] },
    kpis: [
      { value: "3.8x", label: "Pipeline lift" },
      { value: "4.7x", label: "Blended ROAS" },
      { value: "−42%", label: "Cost per SQL" },
    ],
  },

  // 12 — Testimonial wall
  testimonials: {
    title: "What clients say",
    subtitle: "Revenue leaders who put their pipeline number on STIOOS",
    testimonials: [
      { quote: "We went from 5 agencies and no attribution to one team and full pipeline visibility. Best decision we made all year.", name: "Sarah Chen", role: "VP Revenue", company: "FinTech, $40M ARR", rating: 5 },
      { quote: "The AI SDR books 30+ qualified meetings a week. My AEs have never been busier with better-fit leads.", name: "Marcus Reid", role: "Head of Sales", company: "B2B SaaS, Series B", rating: 5 },
      { quote: "They tied their performance fee to pipeline. That told me everything I needed to know about how they think.", name: "Priya Nair", role: "CMO", company: "DTC Apparel, $14M", rating: 5 },
      { quote: "For the first time, marketing and sales share one dashboard and one number. The infighting stopped overnight.", name: "James Okafor", role: "COO", company: "Real Estate, Multi-state", rating: 5 },
      { quote: "We cut CAC 42% in one quarter by killing three channels we thought were working. The attribution rebuild paid for itself.", name: "Elena Volkov", role: "Growth Lead", company: "HealthTech, Series A", rating: 5 },
      { quote: "They got us cited by ChatGPT and Perplexity for the questions our buyers actually ask. Inbound changed overnight.", name: "David Park", role: "Founder", company: "SaaS, Bootstrapped", rating: 5 },
    ],
  },

  // 13 — Vs alternatives
  vsAlternatives: {
    title: "Vs the alternatives",
    subtitle: "How Revenue Growth as a Service compares to in-house, agency, and freelancer models",
    alternatives: ["In-house team", "Traditional agency", "Freelancer"],
    criteria: [
      { label: "Owns the pipeline number", scores: [40, 30, 15, 95] },
      { label: "Channel integration", scores: [50, 35, 10, 92] },
      { label: "Attribution depth", scores: [45, 25, 15, 99] },
      { label: "AI SDR capability", scores: [20, 15, 5, 88] },
      { label: "Speed to results", scores: [30, 40, 50, 90] },
      { label: "Performance-based fee", scores: [10, 20, 30, 85] },
    ],
  },

  // 14 — Engagement tabs
  engagement: {
    title: "Engagement models",
    subtitle: "Three ways to engage — all with a performance component tied to pipeline",
    tabs: [
      { name: "Launch", price: "$12K", period: "mo", description: "One channel deep-dive + attribution baseline. Ideal for validating the model.", features: ["1 primary channel (paid or SEO)", "Attribution + GA4 baseline", "AI SDR pilot (1 ICP)", "Weekly optimization", "Monthly pipeline report"], popular: false },
      { name: "Growth", price: "$22K", period: "mo", description: "Full engine: paid + SEO + AI SDR + lifecycle + CRO under one accountable team.", features: ["All 5 channels integrated", "AI SDR across all ICPs", "Lifecycle email + SMS", "CRO A/B testing program", "Server-side attribution", "Weekly revenue review", "Performance fee on pipeline"], popular: true },
      { name: "Scale", price: "Custom", period: "program", description: "Multi-brand or multi-region program with dedicated growth pod and quarterly roadmap.", features: ["Multi-brand / multi-region", "Dedicated 5-person growth pod", "Custom attribution model", "Quarterly strategy roadmap", "Executive reporting", "SLA on pipeline target"], popular: false },
    ],
  },

  // 15 — Industries strip
  industries: {
    title: "Industries we grow",
    subtitle: "Revenue Growth engagements shipped across these verticals",
    industries: [
      { name: "B2B SaaS", icon: "Boxes", count: 14 },
      { name: "E-Commerce", icon: "ShoppingCart", count: 18 },
      { name: "FinTech", icon: "Coins", count: 9 },
      { name: "Real Estate", icon: "Building2", count: 7 },
      { name: "HealthTech", icon: "HeartHandshake", count: 6 },
      { name: "Education", icon: "GraduationCap", count: 5 },
      { name: "Professional Services", icon: "Briefcase", count: 8 },
      { name: "Local & Multi-location", icon: "MapPin", count: 11 },
    ],
  },

  // 16 — CTA + FAQ
  ctaFaq: {
    cta: {
      eyebrow: "Ready to grow",
      title: "Put your pipeline number on one accountable team.",
      subtitle: "Book a 30-minute growth audit. We'll baseline your funnel, show you where pipeline leaks today, and give you a fixed-fee proposal with a performance component tied to results.",
      primaryCta: { label: "Book a growth audit", href: "/contact" },
      secondaryCta: { label: "Browse growth services", href: "/marketplace?category=digital-sales-marketing" },
    },
    faqs: [
      { q: "How is the performance fee structured?", a: "The performance fee is a percentage of incremental qualified pipeline generated above an agreed baseline, paid monthly. The retainer covers the always-on work; the performance fee aligns us to your outcome. Full terms are in the proposal." },
      { q: "How fast will I see results?", a: "Attribution and instrumentation are live by week 4. Channel launches complete by week 8. Most clients see measurable pipeline lift by week 10–12. The 3.8x average is a Q1 steady-state figure." },
      { q: "Do I keep my existing CRM and tools?", a: "Yes. We wire into your existing Salesforce, HubSpot, or Pipedrive — and your existing ad accounts, Klaviyo, Segment, etc. We don't force a stack migration; we integrate and optimize." },
      { q: "What if I already have an in-house marketing team?", a: "Most clients do. We augment your team with specialist depth (AI SDR, attribution, CRO) that's hard to staff in-house, and we own the integrated pipeline number so your team can focus on brand and product." },
      { q: "Is there a minimum engagement length?", a: "The Launch tier is month-to-month. Growth and Scale are quarterly commitments because the attribution rebuild and channel integration need 90 days to compound. Either way, you own all accounts, assets, and data from day one." },
      { q: "How do you handle attribution across channels?", a: "We stand up server-side tracking via Segment, configure multi-touch attribution in GA4 or your warehouse, and tie every touch to CRM pipeline. You see exactly which dollar produced which opportunity — no more vanity metrics." },
    ],
  },
};
