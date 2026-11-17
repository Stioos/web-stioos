import type { SolutionSpec } from "../solution-types";

// ============================================================
// 04 — DIGITAL GROWTH AS A SERVICE
// Accent: rose/pink/red. Engagement model: Monthly retainer +
// campaign budget.
//
// Outcome bundle that turns brand visibility, content, and ad
// spend into compounding digital growth — combining SEO & AEO,
// paid media, social, content, email, and CRO under one
// accountable engagement built for CMOs and marketing leaders.
// ============================================================

export const DIGITAL_GROWTH_SPEC: SolutionSpec = {
  slug: "digital-growth-as-a-service",
  name: "Digital Growth as a Service",
  icon: "Megaphone",
  engagementModel: "Monthly retainer + campaign budget",
  accent: {
    gradient: "from-rose-500 via-pink-500 to-red-500",
    tile: "bg-rose-400/10 ring-rose-400/25",
    icon: "text-rose-400",
    dot: "bg-rose-400",
    chip: "bg-rose-400/10 text-rose-200 ring-rose-400/25",
    eyebrow: "text-rose-400",
    glow: "rgba(251,113,133,0.20)",
  },

  // 01 — Hero
  hero: {
    eyebrow: "Digital Growth as a Service",
    title: "Turn your digital presence into",
    highlight: "a compounding growth engine.",
    subtitle:
      "One accountable team that manages your brand visibility, SEO & AEO, paid media, social, content, email, and conversion optimization — engineered around one dashboard tying impressions to traffic, leads, and revenue.",
    primaryCta: { label: "Book a digital audit", href: "/contact" },
    secondaryCta: { label: "See case studies", href: "#case-studies" },
    metrics: [
      { value: "+38%", label: "Organic traffic in Q1" },
      { value: "4.2x", label: "Social engagement rate" },
      { value: "3.1M", label: "Monthly impressions generated" },
    ],
    architectureLayers: [
      { name: "Content Engine", icon: "PenTool", components: ["SEO Content", "Video", "Creative", "Social Copy"] },
      { name: "Channel Distribution", icon: "Network", components: ["SEO/AEO", "Paid Media", "Email", "Social"] },
      { name: "Community & Social", icon: "MessageSquare", components: ["Engagement", "UGC", "Influencer", "Community"] },
      { name: "Analytics & Reporting", icon: "BarChart3", components: ["GA4", "Dashboards", "Attribution", "Forecast"] },
      { name: "Optimization", icon: "Gauge", components: ["CRO", "A/B Testing", "Personalization", "Funnel"] },
    ],
  },

  // 02 — Outcome promise band
  outcomePromise: {
    promise: "We don't sell impressions or posts. We sell compounding digital visibility — brand awareness, qualified traffic, and revenue you can attribute to every channel.",
    stats: [
      { value: "3.1M", label: "Monthly impressions generated", sublabel: "Across organic, paid, and social" },
      { value: "+38%", label: "Organic traffic lift in 90 days", sublabel: "SEO + AEO + content distribution" },
      { value: "4.2x", label: "Social engagement rate vs. baseline", sublabel: "Always-on posting + community" },
    ],
  },

  // 03 — Problem / solution split
  problemSolution: {
    title: "The visibility gap",
    subtitle: "Why most digital marketing spend never compounds into growth",
    problems: [
      { icon: "TrendingDown", text: "Organic traffic has plateaued — your content ranks for the wrong queries and AI answer engines don't cite you." },
      { icon: "Clock", text: "Paid ad costs rise every quarter while creative fatigue and audience saturation crush ROAS." },
      { icon: "RefreshCw", text: "SEO, paid, social, email, and content live in separate vendor silos with no shared narrative or distribution plan." },
      { icon: "X", text: "Social posting is inconsistent — there's no engagement strategy, no community, and no repurposing engine." },
      { icon: "BarChart3", text: "Reporting is a mess of disconnected dashboards full of vanity metrics that don't tie to revenue." },
    ],
    solutions: [
      { icon: "TrendingUp", text: "One accountable team owns the digital visibility number across every channel end-to-end." },
      { icon: "Zap", text: "AI-assisted creative testing rotates ads weekly to beat fatigue and keep CPC trending down." },
      { icon: "Network", text: "Content built once, distributed everywhere — optimized for search, answer engines, AND social." },
      { icon: "MessageSquare", text: "Always-on social with engagement strategy, community building, and UGC amplification." },
      { icon: "BadgeCheck", text: "One unified dashboard ties impressions → clicks → leads → revenue — no more vanity metrics." },
    ],
  },

  // 04 — Service architecture
  architecture: {
    title: "Solution architecture",
    subtitle: "Five connected layers that turn content and ad spend into compounding digital visibility. Every layer is staffed, instrumented, and owned by one accountable team.",
    layers: [
      { name: "Content Engine", icon: "PenTool", components: ["SEO Content", "Long-form Articles", "Short-form Video", "Creative Assets"] },
      { name: "Channel Distribution", icon: "Network", components: ["Google Ads", "Meta & LinkedIn", "SEO & AEO", "Email & SMS"] },
      { name: "Community & Social", icon: "MessageSquare", components: ["Organic Social", "Community Mgmt", "Influencer", "UGC Program"] },
      { name: "Analytics & Reporting", icon: "BarChart3", components: ["GA4 Setup", "Looker Dashboards", "Multi-touch Attribution", "Visibility Forecast"] },
      { name: "Optimization", icon: "Gauge", components: ["CRO Testing", "Personalization", "Funnel Optimization", "Creative Iteration"] },
    ],
  },

  // 05 — Capabilities accordion
  capabilities: {
    title: "Capability breakdown",
    subtitle: "Six capabilities bundled into one digital growth engine",
    items: [
      { icon: "Search", title: "SEO & Answer Engine Optimization", description: "Rank in Google AND get cited by ChatGPT, Perplexity, and Gemini with structured content, schema, and topical authority built page by page.", stat: { value: "+38%", label: "Organic qualified traffic" } },
      { icon: "Target", title: "Paid Media Management", description: "Google Ads, Meta, LinkedIn, and TikTok managed with AI-bidding, weekly creative testing, and audience rotation — optimized for revenue not clicks.", stat: { value: "−42%", label: "Cost per click" } },
      { icon: "MessageSquare", title: "Social Media Marketing", description: "Always-on organic social across LinkedIn, Instagram, TikTok, and X — with engagement strategy, community building, and repurposing engine.", stat: { value: "4.2x", label: "Social engagement rate" } },
      { icon: "PenTool", title: "Content Marketing", description: "Editorial calendar, long-form articles, short-form video, and creative — built once, distributed everywhere, optimized for search AND social.", stat: { value: "3.1M", label: "Monthly impressions" } },
      { icon: "Mail", title: "Email Marketing & Lifecycle", description: "Welcome, nurture, promotional, win-back, and revenue-reporting flows across Klaviyo, Mailchimp, and HubSpot — segmented and personalized.", stat: { value: "35%", label: "Email revenue attribution" } },
      { icon: "Gauge", title: "Conversion Rate Optimization", description: "Continuous A/B testing on landing pages, forms, CTAs, and funnel steps — every test tied to traffic-to-revenue impact.", stat: { value: "+19%", label: "Avg. conversion lift" } },
    ],
  },

  // 06 — Engagement journey
  journey: {
    title: "Engagement journey",
    subtitle: "From digital audit to compounding visibility engine in 90 days",
    milestones: [
      { phase: "01", title: "Digital audit & baseline", description: "We audit your brand presence, organic rankings, paid accounts, social, content, and analytics to baseline where visibility leaks today.", duration: "Week 1–2", outcome: "Baseline traffic, engagement, and visibility gaps mapped" },
      { phase: "02", title: "Foundation & instrumentation", description: "GA4 rebuild, attribution model, keyword + topic clusters, creative system, and reporting dashboard stood up so every channel is traceable.", duration: "Week 2–4", outcome: "One unified dashboard live across all channels" },
      { phase: "03", title: "Channel launch", description: "SEO/AEO, paid media, social, content, and email launch in sequence with a weekly content + creative cadence.", duration: "Week 4–8", outcome: "All channels live and producing measurable output" },
      { phase: "04", title: "Optimization & CRO", description: "A/B testing ramps, winning creative gets scaled, top content gets amplified, and losers get cut — tied to traffic and revenue impact.", duration: "Week 8–12", outcome: "+38% organic and 4.2x social engagement achieved" },
      { phase: "05", title: "Scale & compound", description: "Monthly strategy, quarterly topical authority expansion, and continuous testing — the engine compounds visibility month over month.", duration: "Ongoing", outcome: "Brand visibility compounds quarter over quarter" },
    ],
  },

  // 07 — ROI calculator
  roi: {
    title: "ROI model",
    subtitle: "What a typical Digital Growth engagement looks like financially",
    inputs: [
      { label: "Monthly campaign budget", value: "$50K" },
      { label: "STIOOS retainer", value: "$14K/mo" },
      { label: "Internal marketing time saved", value: "90 hrs/mo" },
      { label: "Engagement length", value: "12 months" },
    ],
    outputs: [
      { label: "Organic traffic lift", value: "+38", unit: "%" },
      { label: "Social engagement multiplier", value: "4.2", unit: "x" },
      { label: "Cost per click reduction", value: "−42", unit: "%" },
      { label: "Conversion rate lift", value: "+19", unit: "%" },
    ],
    investment: "$768K",
    return: "$4.8M",
  },

  // 08 — Stack & integrations grid
  stack: {
    title: "The stack we wire together",
    subtitle: "One integrated engine across content, channels, social, analytics, and optimization",
    categories: [
      { name: "Paid Media", tools: ["Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads", "YouTube Ads"] },
      { name: "SEO & Content", tools: ["Semrush", "Ahrefs", "GA4", "Search Console", "Schema.org"] },
      { name: "Social & Community", tools: ["Hootsuite", "Buffer", "Sprout Social", "Later", "Mention"] },
      { name: "Email & Lifecycle", tools: ["Klaviyo", "Mailchimp", "HubSpot", "Brevo", "Customer.io"] },
      { name: "Creative & Design", tools: ["Canva", "Figma", "CapCut", "Descript", "Adobe CC"] },
      { name: "Analytics", tools: ["GA4", "Looker", "Mixpanel", "Amplitude", "Hotjar"] },
      { name: "CRO & Testing", tools: ["Optimizely", "VWO", "Hotjar", "FullStory", "Unbounce"] },
      { name: "AI Tools", tools: ["ChatGPT", "Claude", "Perplexity", "Jasper", "Midjourney"] },
    ],
  },

  // 09 — Metric comparison cards
  metricComparison: {
    title: "Metric comparison",
    subtitle: "How STIOOS Digital Growth compares to industry averages and your realistic potential",
    metrics: [
      { label: "Organic traffic growth", industry: 12, stioos: 38, potential: 55, unit: "%" },
      { label: "Cost per click reduction", industry: 8, stioos: 42, potential: 50, unit: "%" },
      { label: "Social engagement rate", industry: 1, stioos: 4, potential: 6, unit: "%" },
      { label: "Conversion rate lift", industry: 4, stioos: 19, potential: 25, unit: "%" },
    ],
  },

  // 10 — Case studies carousel
  caseStudies: {
    title: "Case studies",
    subtitle: "Digital Growth engagements that shipped measurable visibility and revenue",
    studies: [
      { industry: "DTC Apparel · $14M", title: "Organic traffic jumped 38% in one quarter with SEO + AEO + content", result: { value: "+38%", label: "organic traffic" }, quote: "They rebuilt our content around the questions buyers actually ask. We rank in Google AND get cited by ChatGPT for the top queries in our category." },
      { industry: "B2B SaaS · Series B", title: "Social engagement 4.2x with always-on LinkedIn + short-form video", result: { value: "4.2x", label: "social engagement" }, quote: "We went from posting twice a month to a daily presence across LinkedIn, TikTok, and X. The community finally has somewhere to show up." },
      { industry: "FinTech · $40M ARR", title: "Paid CPC dropped 42% with creative testing + audience rotation", result: { value: "−42%", label: "cost per click" }, quote: "They test 8–12 creative variants a week. Our CPC dropped 42% in 90 days while lead volume went up. The math finally works." },
      { industry: "Real Estate · Multi-state", title: "3.1M monthly impressions across organic, paid, and social", result: { value: "3.1M", label: "monthly impressions" }, quote: "Brand visibility isn't a vanity number anymore. Every impression ties to a click, a lead, and a closed transaction in one dashboard." },
    ],
  },

  // 11 — Outcome scorecard
  scorecard: {
    title: "Outcome scorecard",
    subtitle: "The composite health of a Digital Growth engagement at steady state",
    donut: { value: 92, label: "Digital engine health" },
    bars: [
      { label: "Content velocity", value: 94 },
      { label: "Channel coverage", value: 90 },
      { label: "Social engagement", value: 88 },
      { label: "CRO test velocity", value: 86 },
      { label: "Attribution depth", value: 95 },
    ],
    trend: { label: "Monthly impressions — last 7 months", points: [480, 720, 980, 1280, 1820, 2440, 3100] },
    kpis: [
      { value: "+38%", label: "Organic traffic" },
      { value: "4.2x", label: "Social engagement" },
      { value: "−42%", label: "Cost per click" },
    ],
  },

  // 12 — Testimonial wall
  testimonials: {
    title: "What clients say",
    subtitle: "Marketing leaders who put their digital visibility on STIOOS",
    testimonials: [
      { quote: "We went from 6 disconnected tools and no narrative to one team and one content engine. Our organic traffic is up 38% and finally compounding.", name: "Sarah Chen", role: "CMO", company: "FinTech, $40M ARR", rating: 5 },
      { quote: "They got us cited by ChatGPT and Perplexity for the top 12 questions our buyers ask. Inbound from AI search now rivals Google.", name: "Marcus Reid", role: "VP Marketing", company: "B2B SaaS, Series B", rating: 5 },
      { quote: "Our social engagement is 4.2x what it was a year ago. The community actually shows up — and they buy.", name: "Priya Nair", role: "Marketing Director", company: "DTC Apparel, $14M", rating: 5 },
      { quote: "They test creative like a growth team. CPC dropped 42% while lead volume doubled. I've never seen a digital team move this fast.", name: "James Okafor", role: "Head of Growth", company: "HealthTech, Series A", rating: 5 },
      { quote: "One dashboard ties impressions to revenue. The board finally sees marketing as a growth function, not a cost center.", name: "Elena Volkov", role: "CMO", company: "Real Estate, Multi-state", rating: 5 },
      { quote: "Content built once, distributed everywhere — SEO, social, email, paid. We ship 4x more with the same headcount.", name: "David Park", role: "Founder", company: "SaaS, Bootstrapped", rating: 5 },
    ],
  },

  // 13 — Vs alternatives
  vsAlternatives: {
    title: "Vs the alternatives",
    subtitle: "How Digital Growth as a Service compares to in-house, agency, and freelancer models",
    alternatives: ["In-house team", "Digital agency", "Freelancer pool"],
    criteria: [
      { label: "Owns the visibility number", scores: [35, 40, 15, 95] },
      { label: "Channel integration", scores: [45, 50, 10, 92] },
      { label: "Content velocity", scores: [40, 55, 30, 94] },
      { label: "Social engagement depth", scores: [35, 45, 25, 88] },
      { label: "Speed to results", scores: [30, 40, 50, 90] },
      { label: "Unified reporting", scores: [40, 30, 10, 95] },
    ],
  },

  // 14 — Engagement tabs
  engagement: {
    title: "Engagement models",
    subtitle: "Three ways to engage — all with a campaign budget component tied to visibility outcomes",
    tabs: [
      { name: "Launch", price: "$8K", period: "mo", description: "Two channels deep + content baseline. Ideal for brands validating the model.", features: ["2 primary channels (e.g. SEO + social)", "GA4 + dashboard baseline", "Monthly content calendar", "Weekly optimization", "Monthly visibility report"], popular: false },
      { name: "Growth", price: "$14K", period: "mo", description: "Full engine: SEO/AEO + paid + social + content + email + CRO under one accountable team.", features: ["All 6 capabilities integrated", "Weekly content + creative cadence", "Paid media management", "Email & lifecycle automation", "CRO A/B testing program", "Unified GA4 + attribution dashboard", "Monthly strategy + reporting"], popular: true },
      { name: "Scale", price: "Custom", period: "program", description: "Multi-brand, multi-region, or multi-language program with dedicated digital pod.", features: ["Multi-brand / multi-region", "Dedicated 5-person digital pod", "Custom attribution + forecasting", "Quarterly strategy roadmap", "Influencer + UGC program", "SLA on visibility targets"], popular: false },
    ],
  },

  // 15 — Industries strip
  industries: {
    title: "Industries we grow",
    subtitle: "Digital Growth engagements shipped across these verticals",
    industries: [
      { name: "B2B SaaS", icon: "Boxes", count: 16 },
      { name: "E-Commerce", icon: "ShoppingCart", count: 22 },
      { name: "FinTech", icon: "Coins", count: 8 },
      { name: "Real Estate", icon: "Building2", count: 9 },
      { name: "HealthTech", icon: "HeartHandshake", count: 7 },
      { name: "Education", icon: "GraduationCap", count: 6 },
      { name: "Professional Services", icon: "Briefcase", count: 10 },
      { name: "Hospitality & Local", icon: "MapPin", count: 12 },
    ],
  },

  // 16 — CTA + FAQ
  ctaFaq: {
    cta: {
      eyebrow: "Ready to grow digitally",
      title: "Put your brand visibility on one accountable team.",
      subtitle: "Book a 30-minute digital audit. We'll baseline your organic, paid, social, and content performance, show you where visibility leaks today, and give you a fixed-retainer proposal with a campaign budget tied to outcomes.",
      primaryCta: { label: "Book a digital audit", href: "/contact" },
      secondaryCta: { label: "Browse marketing services", href: "/marketplace?category=digital-sales-marketing" },
    },
    faqs: [
      { q: "Which channels do you focus on?", a: "All six — SEO & AEO, paid media, social, content, email, and CRO — are included in the Growth and Scale tiers. The Launch tier lets you pick two primary channels to validate the model before scaling. We don't force a one-size-fits-all channel mix; the audit recommends the right starting point for your category." },
      { q: "Who owns the content and creative assets?", a: "You do — from day one. All content, creative, ad accounts, social accounts, email lists, and analytics properties live in your accounts. We're granted access to operate them; you retain full ownership. If the engagement ends, you keep everything we've produced." },
      { q: "How is the campaign budget handled?", a: "The campaign budget (paid media spend, influencer fees, production costs) is separate from the retainer and flows through your accounts. We manage, optimize, and report on it, but you hold the budget. The retainer covers strategy, content, creative, channel management, and reporting — the campaign budget is the fuel." },
      { q: "What reporting cadence can I expect?", a: "A unified GA4 + Looker dashboard updated daily, a weekly optimization report, and a monthly strategy review with your leadership team. Every metric ties to traffic, leads, and revenue — no vanity numbers. Quarterly, we deliver a full visibility scorecard and roadmap." },
      { q: "How fast will I see results?", a: "Foundation and instrumentation complete by week 4. Channel launches finish by week 8. Most clients see measurable organic and social lift by week 10–12. The +38% organic and 4.2x social engagement figures are 90-day steady-state outcomes; compounding visibility continues to build month over month." },
      { q: "What if I already have an in-house marketing team?", a: "Most clients do. We augment your team with specialist depth (SEO/AEO, paid media management, CRO, analytics) that's hard to staff in-house, and we own the integrated visibility number so your team can focus on brand, product, and customer. We integrate into your existing tools — Semrush, Ahrefs, HubSpot, Klaviyo, Hootsuite — without forcing a stack migration." },
    ],
  },
};
