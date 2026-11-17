import type { DivisionSpec } from "../division-types";

// ============================================================
// 06 — DIGITAL SALES & MARKETING (cat-digital-sales-marketing)
// Accent: rose/pink. Subcategories: SEO & answer-engine
// optimization / paid media & PPC / social media marketing /
// AI SDR & outbound sales / lifecycle email & SMS / conversion
// rate optimization.
// ============================================================

export const MARKETING_SPEC: DivisionSpec = {
  categoryId: "cat-digital-sales-marketing",
  slug: "digital-sales-marketing",

  // 01 — Hero
  hero: {
    eyebrow: "Digital Sales & Marketing",
    title: "AI-driven growth engines that turn ad spend into",
    highlight: "qualified pipeline, not vanity clicks.",
    subtitle:
      "SEO and answer-engine optimization, AI-optimized paid media, social media marketing, AI SDR outbound engines, lifecycle email and SMS, and conversion rate optimization — engineered around measurable pipeline outcomes and instrumented end-to-end with GA4, Segment, and your CRM.",
    primaryCta: { label: "Request a growth audit", href: "/contact" },
    secondaryCta: { label: "Browse 42 marketing services", href: "/marketplace?category=digital-sales-marketing" },
    stats: [
      { value: "42", label: "Marketing services in catalog" },
      { value: "4.7x", label: "Median ROAS achieved" },
      { value: "+38%", label: "Avg. qualified pipeline lift" },
    ],
  },

  // 02 — Trust bar
  trustBadges: [
    "Google Ads", "Meta Ads", "LinkedIn Ads", "HubSpot", "Salesforce Marketing Cloud",
    "Klaviyo", "Segment", "Google Analytics 4", "Semrush", "Ahrefs",
    "ChatGPT", "Perplexity", "Zapier", "Make", "Shopify",
  ],

  // 03 — KPI band
  kpis: [
    { value: "4.7x", label: "Median return on ad spend", trend: "+312%", spark: [1.1, 1.6, 2.2, 2.9, 3.5, 4.1, 4.7], icon: "TrendingUp" },
    { value: "−42%", label: "Avg. cost per acquisition cut", trend: "−$24", spark: [58, 52, 47, 41, 36, 32, 28], icon: "Target" },
    { value: "+38%", label: "Qualified pipeline growth (90 days)", trend: "+$1.2M", spark: [12, 18, 24, 29, 33, 36, 38], icon: "LineChart" },
    { value: "62%", label: "Avg. email revenue lift", trend: "+44pts", spark: [18, 27, 36, 44, 51, 57, 62], icon: "Megaphone" },
  ],

  // 04 — Pain points
  painPoints: [
    {
      icon: "TrendingDown",
      title: "Organic reach is collapsing under AI search",
      description: "Traffic from traditional SEO is shrinking as ChatGPT, Perplexity, and AI overviews answer queries without clicking through. Your content gets read; your site gets ghosted.",
      impact: "−34% organic clicks",
    },
    {
      icon: "Wallet",
      title: "Ad costs are rising faster than conversions",
      description: "CPMs are up 40% YoY on Meta and Google. Broad-match keywords, audience overlap, and generic creative burn budget without producing pipeline your CFO can defend.",
      impact: "+40% CPM",
    },
    {
      icon: "BarChart3",
      title: "The funnel leaks and nobody can prove why",
      description: "Attribution is broken across GA4, ad platforms, and your CRM. Leadership can't tell which channel drives pipeline — so every budget meeting becomes a knife fight.",
      impact: "−61% attributable",
    },
  ],

  // 05 — Solution overview
  solution: {
    eyebrow: "The STIOOS approach",
    title: "One accountable growth partner for every channel in your funnel",
    body: "We don't run campaigns and hope. STIOOS builds AI-driven growth engines — SEO and answer-engine optimization for ChatGPT and Perplexity, paid media tuned by predictive bidding, AI SDRs that book meetings while you sleep, and lifecycle automation that monetizes the customers you already have. Every engagement ships with a measurable pipeline outcome contract.",
    capabilities: [
      "Answer Engine Optimization — get cited by ChatGPT, Perplexity, and Google AI Overviews",
      "AI-optimized paid media across Google, Meta, LinkedIn, and TikTok",
      "Lifecycle email + SMS in Klaviyo, HubSpot, and Salesforce Marketing Cloud",
      "AI SDR outbound engines that reply in under 60 seconds, 24/7",
      "Server-side tracking with Segment + GA4 + CRM attribution",
      "CRO programs that lift conversion rate without redesigning your site",
    ],
    visual: "dashboard",
  },

  // 06 — Capabilities bento (links to subcategories)
  capabilities: [
    { icon: "Search", title: "SEO & Answer Engine Optimization", description: "Rank in Google AND get cited by ChatGPT, Perplexity, and AI Overviews.", metric: "8 services", span: "lg", subslug: "seo-answer-engine-optimization" },
    { icon: "Target", title: "Paid Media & PPC Management", description: "AI-optimized Google, Meta, and LinkedIn campaigns tuned to pipeline, not clicks.", metric: "9 services", span: "md", subslug: "paid-media-ppc-management" },
    { icon: "Megaphone", title: "Social Media Marketing", description: "Always-on organic social, creator content, and community across every platform.", metric: "7 services", span: "sm", subslug: "social-media-marketing" },
    { icon: "Rocket", title: "AI SDR & Outbound Sales", description: "Autonomous prospecting, sequencing, and meeting booking across your ICP.", metric: "6 services", span: "sm", subslug: "ai-sdr-outbound-sales" },
    { icon: "Mail", title: "Lifecycle Email & SMS Marketing", description: "Behavior-triggered flows in Klaviyo and HubSpot that monetize your list.", metric: "7 services", span: "md", subslug: "lifecycle-email-sms-marketing" },
    { icon: "ScanEye", title: "Conversion Rate Optimization", description: "A/B testing, funnel diagnostics, and on-page CRO that lifts revenue per session.", metric: "5 services", span: "sm", subslug: "conversion-rate-optimization" },
  ],

  // 07 — Process timeline
  process: {
    title: "Growth delivery methodology",
    subtitle: "A repeatable five-phase path from audit to a compounding growth engine your team can operate — and audit — confidently.",
    phases: [
      { phase: "01", title: "Audit & instrument", description: "We audit funnel, attribution, and tech stack, then fix tracking across GA4, Segment, and CRM.", duration: "Week 1", deliverables: ["Funnel audit", "Attribution fix", "Channel baseline"] },
      { phase: "02", title: "Strategy & roadmap", description: "ICP refinement, channel prioritization, and a 90-day growth roadmap with revenue targets.", duration: "Week 2", deliverables: ["ICP definition", "Channel roadmap", "KPI contract"] },
      { phase: "03", title: "Build & launch", description: "Campaigns, content, flows, and AI SDR sequences go live across all prioritized channels.", duration: "Week 3–6", deliverables: ["Live campaigns", "Lifecycle flows", "AI SDR sequences"] },
      { phase: "04", title: "Optimize & scale", description: "Daily bid management, creative testing, and weekly budget reallocation toward pipeline.", duration: "Week 6–12", deliverables: ["Weekly test cadence", "Budget reallocation", "Creative refresh"] },
      { phase: "05", title: "Compound & report", description: "Quarterly business review with attributed pipeline, CAC payback, and next-quarter plan.", duration: "Ongoing", deliverables: ["QBR deck", "Pipeline report", "Next-quarter plan"] },
    ],
  },

  // 08 — Tech radar
  techRadar: {
    title: "The marketing stack we ship to production",
    subtitle: "Every platform below is in active production across STIOOS engagements. The radar shows where each sits on the adopt-to-hold spectrum for 2025.",
    rings: [
      { label: "Adopt" },
      { label: "Trial" },
      { label: "Assess" },
      { label: "Hold" },
    ],
    nodes: [
      { name: "Google Ads", ring: 0, angle: -70 },
      { name: "Meta Ads", ring: 0, angle: -20 },
      { name: "GA4", ring: 0, angle: 40 },
      { name: "Klaviyo", ring: 0, angle: 130 },
      { name: "HubSpot", ring: 1, angle: 110 },
      { name: "LinkedIn Ads", ring: 1, angle: 160 },
      { name: "Segment", ring: 1, angle: -140 },
      { name: "Semrush", ring: 1, angle: 90 },
      { name: "Salesforce MC", ring: 2, angle: 70 },
      { name: "Ahrefs", ring: 2, angle: -100 },
      { name: "ChatGPT API", ring: 2, angle: 20 },
      { name: "Perplexity API", ring: 3, angle: -50 },
    ],
  },

  // 09 — Before / after impact
  impact: {
    title: "First-quarter impact",
    subtitle: "Representative results from STIOOS marketing engagements in the first 90 days of production. Your numbers will vary based on channel mix, market, and data maturity.",
    metrics: [
      { label: "Return on ad spend (blended)", before: 1.5, after: 4.7, beforeLabel: "1.5x ROAS", afterLabel: "4.7x ROAS", unit: "x" },
      { label: "Cost per qualified lead", before: 68, after: 31, beforeLabel: "$68", afterLabel: "$31", unit: "$" },
      { label: "Email-attributed revenue share", before: 12, after: 19, beforeLabel: "12%", afterLabel: "19%", unit: "%" },
      { label: "Landing-page conversion rate", before: 2.1, after: 4.9, beforeLabel: "2.1%", afterLabel: "4.9%", unit: "%" },
    ],
  },

  // 10 — Spotlight services
  spotlightServices: [
    { name: "Answer Engine Optimization Program", tagline: "Get cited by ChatGPT, Perplexity, and Google AI Overviews — not just ranked.", tags: ["ChatGPT", "Perplexity", "Semrush"], metric: { value: "+19%", label: "AI citations" }, href: "/marketplace?category=digital-sales-marketing" },
    { name: "Google Ads Management", tagline: "AI-bidding + creative testing tuned to pipeline, not platform vanity metrics.", tags: ["Google Ads", "GA4", "Salesforce"], metric: { value: "4.7x", label: "median ROAS" }, href: "/marketplace?category=digital-sales-marketing" },
    { name: "AI SDR Outbound Engine", tagline: "Autonomous prospecting + 60-second follow-up across your entire ICP, 24/7.", tags: ["HubSpot", "Outreach", "GPT-4"], metric: { value: "+38%", label: "pipeline" }, href: "/marketplace?category=digital-sales-marketing" },
  ],

  // 11 — Outcomes gauges
  outcomes: {
    central: { value: 92, label: "Overall growth engine score", caption: "Across 280+ active engagements" },
    gauges: [
      { value: 94, label: "Attribution coverage" },
      { value: 89, label: "Creative refresh cadence" },
      { value: 91, label: "Lead response speed" },
      { value: 86, label: "Pipeline vs. target" },
    ],
  },

  // 12 — Case study
  caseStudy: {
    industry: "E-Commerce · $14M DTC brand",
    title: "How an e-commerce brand lifted ROAS 4.7x in one quarter",
    challenge: "A $14M DTC apparel brand was spending $180K/month on Meta and Google with 1.5x ROAS and shrinking. Attribution was broken across GA4, Klaviyo, and Shopify. Creative had gone stale. Leadership couldn't defend the budget.",
    solution: "STIOOS rebuilt server-side tracking with Segment + GA4 + Klaviyo, launched an AI-bidding layer on Google and Meta with weekly creative testing, stood up 11 behavior-triggered lifecycle flows, and ran a structured CRO program on the top three landing pages.",
    results: [
      { value: "4.7x", label: "Blended ROAS after 90 days" },
      { value: "+62%", label: "Email-attributed revenue lift" },
      { value: "$1.2M", label: "Incremental pipeline (Q1)" },
    ],
    quote: "We went from defending our ad budget to scaling it. The team finally showed us which dollar produced which sale — and then made both numbers move.",
    author: "VP of Growth",
    role: "DTC Apparel Brand",
  },

  // 13 — Comparison table
  comparison: {
    title: "Why growth teams choose STIOOS",
    subtitle: "How STIOOS marketing engagements compare to the alternatives teams typically evaluate.",
    columns: ["In-house team", "Performance agency", "Freelancer", "STIOOS"],
    rows: [
      { criterion: "Answer Engine Optimization for ChatGPT / Perplexity", values: ["no", "no", "no", "yes"] },
      { criterion: "Server-side tracking + GA4 + CRM attribution", values: ["partial", "partial", "no", "yes"] },
      { criterion: "AI-bidding + weekly creative testing", values: ["partial", "yes", "no", "yes"] },
      { criterion: "Lifecycle email + SMS automation", values: ["partial", "partial", "no", "yes"] },
      { criterion: "AI SDR outbound engine included", values: ["no", "no", "no", "yes"] },
      { criterion: "SLA-backed pipeline outcome contract", values: ["no", "no", "no", "yes"] },
    ],
  },

  // 14 — Pricing tiers
  pricing: {
    title: "Engagement models",
    subtitle: "Three ways to engage, all with a transparent scope and a measurable pipeline outcome. No vague retainers.",
    tiers: [
      {
        name: "Launch", price: "$9K", period: "month", description: "One channel, fully managed and instrumented.",
        features: ["1 paid channel (Google or Meta)", "GA4 + CRM attribution fix", "8 lifecycle flows", "Weekly creative testing", "Monthly performance report"],
        popular: false, cta: "Start a Launch engagement",
      },
      {
        name: "Growth", price: "$18K", period: "month", description: "Full-funnel growth engine across paid, organic, and lifecycle.",
        features: ["Up to 4 channels (paid + SEO + email + SMS)", "Answer Engine Optimization included", "AI SDR outbound engine", "Server-side tracking + Segment", "Weekly test cadence + QBR", "SLA: pipeline target guaranteed"],
        popular: true, cta: "Start a Growth engagement",
      },
      {
        name: "Enterprise", price: "Custom", period: "program", description: "Multi-brand or multi-region growth programs at scale.",
        features: ["Unlimited channels + regions", "Dedicated growth pod", "CRO program included", "Custom attribution modeling", "Executive dashboard", "SLA: +25% pipeline / quarter"],
        popular: false, cta: "Talk to growth sales",
      },
    ],
  },

  // 15 — Industries cloud
  industries: [
    { name: "E-Commerce & Retail", count: 11 },
    { name: "SaaS & Technology", count: 9 },
    { name: "Real Estate", count: 6 },
    { name: "Healthcare", count: 5 },
    { name: "Financial Services", count: 7 },
    { name: "Education", count: 5 },
    { name: "Local Services", count: 8 },
    { name: "Travel & Hospitality", count: 4 },
    { name: "Professional Services", count: 6 },
    { name: "Media & Publishing", count: 4 },
    { name: "Manufacturing & B2B", count: 5 },
    { name: "Nonprofit", count: 3 },
  ],

  // 16 — Final CTA
  finalCta: {
    eyebrow: "Ready when you are",
    title: "Stop buying clicks. Start building pipeline.",
    subtitle: "Book a 30-minute growth audit. We'll map your funnel, fix your attribution in front of you, and show you exactly which channel we'd scale first — before you commit to anything.",
    primaryCta: { label: "Book a growth audit", href: "/contact" },
    secondaryCta: { label: "Browse marketing services", href: "/marketplace?category=digital-sales-marketing" },
    trustSignals: [
      "No vague retainers",
      "Pipeline outcome contract",
      "Cancel anytime",
    ],
  },
};
