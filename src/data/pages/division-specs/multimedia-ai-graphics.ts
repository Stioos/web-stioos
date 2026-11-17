import type { DivisionSpec } from "../division-types";

// ============================================================
// 06 — MULTIMEDIA AI & GRAPHICS (cat-multimedia-ai)
// Accent: fuchsia / purple. Subcategories: ai-video-generation /
// ai-image-generation / motion-graphics-animation /
// social-ad-creatives / ai-audio-voice / 3d-immersive-content.
// ============================================================

export const MULTIMEDIA_SPEC: DivisionSpec = {
  categoryId: "cat-multimedia-ai",
  slug: "multimedia-ai-graphics",

  // 01 — Hero
  hero: {
    eyebrow: "Multimedia AI & Graphics",
    title: "AI-crafted video, image & audio that ships at",
    highlight: "studio scale, paid-media speed, software economics.",
    subtitle:
      "Generative video, AI image and ad-creative production, motion graphics, synthetic voice and audio, and 3D or immersive content — engineered for brand-safe, rights-cleared commercial use across every channel your team runs.",
    primaryCta: { label: "Request a creative consultation", href: "/contact" },
    secondaryCta: { label: "Browse 42 creative services", href: "/marketplace?category=multimedia-ai-graphics" },
    stats: [
      { value: "42", label: "Production services in catalog" },
      { value: "12x", label: "Faster video turnaround" },
      { value: "−54%", label: "Avg. cost per asset" },
    ],
  },

  // 02 — Trust bar
  trustBadges: [
    "Runway", "Sora", "Midjourney", "Stable Diffusion", "DALL-E", "Flux",
    "ElevenLabs", "HeyGen", "Synthesia", "Pika", "Luma", "ComfyUI",
    "Adobe After Effects", "Cinema 4D", "Blender", "Premiere", "Figma", "Canva",
  ],

  // 03 — KPI band
  kpis: [
    { value: "3.8x", label: "Creative output lift per designer", trend: "+280%", spark: [10, 18, 24, 29, 33, 36, 38], icon: "Zap" },
    { value: "−54%", label: "Cost per finished creative asset", trend: "−$670/asset", spark: [88, 76, 68, 60, 54, 50, 46], icon: "Coins" },
    { value: "+47%", label: "Paid-media CTR on AI creative vs. stock", trend: "+47%", spark: [22, 28, 33, 38, 42, 45, 47], icon: "TrendingUp" },
    { value: "$120K", label: "Avg. annual production savings", trend: "+$120K", spark: [0.0, 0.18, 0.42, 0.61, 0.82, 0.98, 1.20], icon: "Wallet" },
  ],

  // 04 — Pain points
  painPoints: [
    {
      icon: "Clock",
      title: "Creative can't keep up with channel sprawl",
      description: "Every platform wants 5+ aspect ratios, 3+ hook variants, and weekly refreshes. Your two designers ship 12 assets a week — your media plan needs 120.",
      impact: "10x demand gap",
    },
    {
      icon: "Receipt",
      title: "Agency retainers drain the budget",
      description: "$25K/month retainer for a video you wait 6 weeks to see, then 3 rounds of revisions. By the time it ships, the trend is over and the hook is already stale.",
      impact: "$300K/yr wasted",
    },
    {
      icon: "Shield",
      title: "No rights-cleared assets at scale",
      description: "Off-the-shelf generative tools ship assets you can't legally run in paid media. Licensing is murky, model provenance is unclear, and legal kills the launch.",
      impact: "Launches blocked",
    },
  ],

  // 05 — Solution overview
  solution: {
    eyebrow: "The STIOOS approach",
    title: "A creative production partner engineered for the generative era",
    body: "STIOOS is a full-stack creative production studio that ships broadcast-grade video, ad creative, voice, and 3D — built on Runway, Sora, Midjourney, Stable Diffusion, ElevenLabs, and Adobe. Every asset is brand-locked, rights-cleared for paid use, and delivered through a programmatic pipeline your team can re-run on demand.",
    capabilities: [
      "Brand-locked style systems across every model and tool",
      "Commercial rights clearance on every generative asset",
      "Programmatic variant engine: 1 brief → 400 ready-to-ship assets",
      "Native Adobe, Figma, and Canva handoff pipelines",
      "Human art direction on every asset — never a raw AI dump",
      "Versioned asset library with usage tracking and licensing",
    ],
    visual: "dashboard",
  },

  // 06 — Capabilities bento (links to subcategories)
  capabilities: [
    { icon: "Film", title: "AI Video Generation", description: "Runway, Sora, Pika & Luma pipelines for cinematic spots, product b-roll, and social cutdowns.", metric: "9 services", span: "lg", subslug: "ai-video-generation" },
    { icon: "Image", title: "AI Image Generation", description: "Midjourney, Stable Diffusion, DALL-E & Flux workflows for on-brand creative at scale.", metric: "8 services", span: "md", subslug: "ai-image-generation" },
    { icon: "Sparkles", title: "Motion Graphics & Animation", description: "After Effects, Cinema 4D & Blender motion packages with AI-assisted keyframes.", metric: "7 services", span: "sm", subslug: "motion-graphics-animation" },
    { icon: "Megaphone", title: "Social & Ad Creatives", description: "Programmatic variant generation across Meta, TikTok, YouTube & LinkedIn.", metric: "7 services", span: "sm", subslug: "social-ad-creatives" },
    { icon: "Mic", title: "AI Audio & Voice", description: "ElevenLabs, HeyGen & Synthesia — synthetic voiceover, avatar video & podcast.", metric: "6 services", span: "md", subslug: "ai-audio-voice" },
    { icon: "Boxes", title: "3D & Immersive Content", description: "Blender, Cinema 4D & WebXR product, store & immersive brand experiences.", metric: "5 services", span: "sm", subslug: "3d-immersive-content" },
  ],

  // 07 — Process timeline
  process: {
    title: "Production methodology",
    subtitle: "A repeatable five-phase creative pipeline — from brief to a rights-cleared, brand-locked asset library your team can re-run on demand.",
    phases: [
      { phase: "01", title: "Discover & brief", description: "We map the campaign, channels, aspect ratios, and brand guardrails the asset library must serve.", duration: "Week 1", deliverables: ["Creative brief", "Brand style system", "Reference reel"] },
      { phase: "02", title: "Model & tool selection", description: "We pick the right model stack — Runway, Sora, Midjourney, Stable Diffusion — and lock the style.", duration: "Week 1–2", deliverables: ["Model matrix", "Style tests", "Rights clearance plan"] },
      { phase: "03", title: "Generate & direct", description: "Programmatic generation at scale, with human art direction selecting and refining the winners.", duration: "Week 2–4", deliverables: ["Raw generations", "Art-direction passes", "Selects"] },
      { phase: "04", title: "Finish & master", description: "Color, sound, motion finishing, and mastering to broadcast spec across every aspect ratio.", duration: "Week 4–5", deliverables: ["Color & sound finish", "Master files", "Variant pack"] },
      { phase: "05", title: "Distribute & track", description: "Handoff to Adobe, Figma, and your ad platform — with a performance loop feeding the next brief.", duration: "Ongoing", deliverables: ["Asset library", "Channel handoff", "Performance loop"] },
    ],
  },

  // 08 — Tech radar
  techRadar: {
    title: "The creative stack we ship to production",
    subtitle: "Every tool below is in active production across STIOOS engagements. The radar shows where each sits on the adopt-to-hold spectrum for paid-media-ready output.",
    rings: [
      { label: "Adopt" },
      { label: "Trial" },
      { label: "Assess" },
      { label: "Hold" },
    ],
    nodes: [
      { name: "Runway", ring: 0, angle: -70 },
      { name: "Midjourney", ring: 0, angle: -20 },
      { name: "Stable Diffusion", ring: 0, angle: 40 },
      { name: "ElevenLabs", ring: 0, angle: 130 },
      { name: "Sora", ring: 1, angle: 110 },
      { name: "Synthesia", ring: 1, angle: 160 },
      { name: "Pika", ring: 1, angle: -140 },
      { name: "Luma", ring: 1, angle: 90 },
      { name: "ComfyUI", ring: 2, angle: 70 },
      { name: "Flux", ring: 2, angle: -100 },
      { name: "Veo", ring: 2, angle: 20 },
      { name: "Suno", ring: 3, angle: -50 },
    ],
  },

  // 09 — Before / after impact
  impact: {
    title: "Quarter-one impact",
    subtitle: "Representative results from STIOOS creative engagements in the first 90 days of production. Your numbers will vary based on channel mix and brand complexity.",
    metrics: [
      { label: "Creative assets shipped per designer / week", before: 15, after: 58, beforeLabel: "12 assets", afterLabel: "46 assets", unit: "assets" },
      { label: "Cost per finished video asset", before: 100, after: 46, beforeLabel: "$1,250", afterLabel: "$580", unit: "$" },
      { label: "Brief-to-launch cycle time", before: 88, after: 18, beforeLabel: "6.5 wks", afterLabel: "1.3 wks", unit: "wks" },
      { label: "Paid-media CTR on AI creative vs. stock", before: 32, after: 47, beforeLabel: "1.8%", afterLabel: "2.7%", unit: "%" },
    ],
  },

  // 10 — Spotlight services
  spotlightServices: [
    { name: "AI Video Production for Ads", tagline: "Runway + Sora + After Effects pipeline for broadcast-quality spots at 1/3 the agency cost.", tags: ["Runway", "Sora", "After Effects"], metric: { value: "12x", label: "faster" }, href: "/marketplace?category=multimedia-ai-graphics" },
    { name: "Programmatic Creative Generation", tagline: "One brief → 400 platform-correct ad variants, brand-locked and rights-cleared for paid.", tags: ["Stable Diffusion", "ComfyUI", "Figma"], metric: { value: "400", label: "variants/brief" }, href: "/marketplace?category=multimedia-ai-graphics" },
    { name: "Synthetic Voiceover Production (ElevenLabs)", tagline: "Multi-voice, multi-language voiceover with broadcast-grade mastering and avatar video.", tags: ["ElevenLabs", "HeyGen", "Premiere"], metric: { value: "32", label: "languages" }, href: "/marketplace?category=multimedia-ai-graphics" },
  ],

  // 11 — Outcomes gauges
  outcomes: {
    central: { value: 96, label: "Brand-safety pass rate", caption: "Across 18K+ generated assets" },
    gauges: [
      { value: 94, label: "Rights-cleared for paid media" },
      { value: 91, label: "First-pass brand-lock adherence" },
      { value: 89, label: "Stakeholder approval (no rework)" },
      { value: 87, label: "On-trend / platform-fit" },
    ],
  },

  // 12 — Case study
  caseStudy: {
    industry: "DTC Apparel · $40M revenue",
    title: "How a DTC brand shipped 400 ad variants in one quarter at 54% lower cost",
    challenge: "A $40M DTC apparel brand was burning $25K/month on a creative agency that delivered 8 ad variants a month. With Meta and TikTok demanding daily creative refreshes, paid-social CTR had slipped to 1.2% and the performance team was starving for testable variants.",
    solution: "STIOOS stood up a programmatic creative pipeline on Stable Diffusion + ComfyUI, brand-locked to the client's art direction. One brief generated 80 platform-correct variants per week; human art directors selected and finished the top 20. Every asset was rights-cleared for paid use and tagged into the performance team's tracking taxonomy.",
    results: [
      { value: "400", label: "Ad variants shipped in Q1" },
      { value: "−54%", label: "Cost per shipped asset" },
      { value: "+47%", label: "Paid-social CTR lift" },
    ],
    quote: "We shipped more creative in Q1 than the prior two years combined. The performance team finally has variants to test instead of excuses for why CTR is flat.",
    author: "VP of Growth",
    role: "DTC apparel brand",
  },

  // 13 — Comparison table
  comparison: {
    title: "Why teams choose STIOOS",
    subtitle: "How STIOOS creative engagements compare to the production options teams typically evaluate.",
    columns: ["Traditional agency", "In-house team", "AI tool subscriptions", "STIOOS"],
    rows: [
      { criterion: "Brand-locked style system across all models", values: ["partial", "partial", "no", "yes"] },
      { criterion: "Commercial rights clearance on every asset", values: ["yes", "partial", "no", "yes"] },
      { criterion: "Programmatic variant generation (1 brief → 400)", values: ["no", "no", "partial", "yes"] },
      { criterion: "Human art direction on every asset", values: ["yes", "yes", "no", "yes"] },
      { criterion: "Native Adobe / Figma / Canva handoff", values: ["yes", "partial", "no", "yes"] },
      { criterion: "Fixed-price, measurable outcome contract", values: ["no", "no", "no", "yes"] },
    ],
  },

  // 14 — Pricing tiers
  pricing: {
    title: "Engagement models",
    subtitle: "Three ways to engage, all with a transparent scope and a measurable outcome. No vague retainers, no per-asset surprises.",
    tiers: [
      {
        name: "Launch", price: "$9K", period: "project", description: "One asset type, one campaign, brand-locked pipeline.",
        features: ["1 creative asset type (video, image, or audio)", "Brand style system + lock", "Up to 50 generated variants", "Rights clearance on every asset", "Adobe / Figma handoff pack"],
        popular: false, cta: "Start a Launch project",
      },
      {
        name: "Growth", price: "$14K", period: "month", description: "Always-on creative production across every channel you run.",
        features: ["Unlimited asset types", "Up to 400 variants / month", "Brand-locked programmatic engine", "Human art direction on every asset", "Weekly creative review + roadmap", "Asset library + performance loop"],
        popular: true, cta: "Start a Growth engagement",
      },
      {
        name: "Enterprise", price: "Custom", period: "program", description: "Global creative production for multi-brand portfolios.",
        features: ["Multi-brand style systems", "Global rights + legal review", "Dedicated creative director", "Custom model fine-tuning", "On-prem / VPC generation option", "SLA: 5-day turnaround"],
        popular: false, cta: "Talk to sales",
      },
    ],
  },

  // 15 — Industries cloud
  industries: [
    { name: "E-Commerce & Retail", count: 11 },
    { name: "Media & Entertainment", count: 9 },
    { name: "Fashion & Apparel", count: 8 },
    { name: "Gaming", count: 6 },
    { name: "Food & Beverage", count: 6 },
    { name: "Real Estate", count: 5 },
    { name: "Travel & Hospitality", count: 5 },
    { name: "Health & Beauty", count: 5 },
    { name: "Education", count: 4 },
    { name: "Consumer Electronics", count: 4 },
    { name: "Sports & Live Events", count: 3 },
    { name: "Automotive", count: 3 },
  ],

  // 16 — Final CTA
  finalCta: {
    eyebrow: "Ready when you are",
    title: "Stop losing launches to creative bottlenecks.",
    subtitle: "Book a 30-minute creative scoping call. We'll map one campaign, show you the pipeline that would own it, and ship a 10-variant sample pack before you commit to anything.",
    primaryCta: { label: "Book a creative consultation", href: "/contact" },
    secondaryCta: { label: "Browse creative services", href: "/marketplace?category=multimedia-ai-graphics" },
    trustSignals: [
      "Rights-cleared for paid media",
      "Brand-locked, human-directed",
      "10-variant sample pack free",
    ],
  },
};
