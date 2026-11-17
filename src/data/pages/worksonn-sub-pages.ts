import type { IconKey, PageSpec } from "./types";

// ============================================================
// WORKSONN SUB-PAGES — 8 deep-dive pages per Worksonn network
// path (8 × 8 = 64 pages), rendered at /worksonn/[path]/[sub]
// from one PageSpec each.
//
// Each seed carries the page's identity (title, highlight,
// blurb, icon, 4 focus pillars). buildWorksonnSubSpec() expands
// one seed + its parent option spec into a complete 24-section
// PageSpec deterministically — same seed, same page, always.
// ============================================================

export interface WorksonnSubSeed {
  /** URL segment — /worksonn/<path>/<slug> */
  slug: string;
  /** Hero title (first line) */
  title: string;
  /** Gradient-highlighted tail of the hero title */
  highlight: string;
  /** Hero subtitle */
  blurb: string;
  /** Hero/KPI icon */
  icon: IconKey;
  /** 4 focus pillars this page covers — woven through KPIs,
      value props, process, deliverables, modules, FAQs */
  focus: [string, string, string, string];
}

export const WORKSONN_SUB_SEEDS: Record<string, WorksonnSubSeed[]> = {
  // ─────────────── Sales Agent (emerald · commission basis) ───────────────
  "sales-agent": [
    {
      slug: "commission-tiers",
      title: "Commission Tiers & Rates",
      highlight: "15–25% on every deal",
      blurb:
        "Start at 15% and climb to 25% as your lifetime book grows — renewals keep paying at full rate, and nothing resets in January.",
      icon: "Wallet",
      focus: ["Tier progression rules", "Renewal commissions", "Lifetime book value", "Rate review cadence"],
    },
    {
      slug: "deal-registration",
      title: "Deal Registration & Protection",
      highlight: "your accounts stay yours",
      blurb:
        "Register a prospect in two minutes and it's locked to you for 12 months — instant conflict checks keep internal leads off your book.",
      icon: "Lock",
      focus: ["Named-account locking", "Instant conflict checks", "12-month protection", "Renewal rights"],
    },
    {
      slug: "sales-enablement-kit",
      title: "The Sales Enablement Kit",
      highlight: "pitch-ready from day one",
      blurb:
        "Decks, pricing calculators, ROI models and case studies for all 8 service lines — everything you need to run a serious first meeting.",
      icon: "Briefcase",
      focus: ["Service-line decks", "ROI calculators", "Case study library", "Objection handling"],
    },
    {
      slug: "agent-portal",
      title: "The Agent Portal",
      highlight: "track every deal live",
      blurb:
        "Register accounts, generate quotes, watch pipeline stages and see expected vs. paid commission — one dashboard, total transparency.",
      icon: "Gauge",
      focus: ["Live pipeline view", "Commission ledger", "Instant quotes & SOWs", "Payout history"],
    },
    {
      slug: "presales-support",
      title: "Pre-Sales & Agent Desk",
      highlight: "never sell alone",
      blurb:
        "A named agent manager plus pre-sales engineers who join your calls — you bring the relationship, we bring the architecture.",
      icon: "Users",
      focus: ["Pre-sales engineers", "Named agent manager", "Joint discovery calls", "Technical deep-dives"],
    },
    {
      slug: "payouts",
      title: "Payouts & Payments",
      highlight: "7-day cycles, zero games",
      blurb:
        "Commissions clear within seven days of client payment, tracked in a transparent ledger with multi-currency options and clean tax docs.",
      icon: "Wallet",
      focus: ["7-day payout cycle", "Transparent ledger", "Multi-currency payouts", "Tax documentation"],
    },
    {
      slug: "partner-tiers",
      title: "Agent to Partner Progression",
      highlight: "from 15% to channel partner",
      blurb:
        "Cross $50K lifetime book for Growth perks and $100K for full Partner Tier — co-branded campaigns, event slots and strategic deal input.",
      icon: "TrendingUp",
      focus: ["Starter → Growth → Partner", "Co-branded marketing", "Event & webinar slots", "Strategic deal input"],
    },
    {
      slug: "agent-success-stories",
      title: "Agent Success Stories",
      highlight: "real books, real payouts",
      blurb:
        "The agent who built a $240K book in year one, and the freelancer who made staffing renewals his most reliable income — with numbers.",
      icon: "Star",
      focus: ["Year-1 outcomes", "Cross-sell wins", "Career-switch stories", "Top-agent habits"],
    },
  ],

  // ─────────────── Candidates (emerald · careers) ───────────────
  candidates: [
    {
      slug: "profile-builder",
      title: "Profile & Resume Builder",
      highlight: "get discovered faster",
      blurb:
        "One guided profile feeds every application — AI resume building, skill tagging and a public profile employers actually search.",
      icon: "FileText",
      focus: ["AI resume building", "Skill tagging", "Searchable public profile", "Completeness score"],
    },
    {
      slug: "ai-job-matching",
      title: "AI Job Matching",
      highlight: "roles that fit, not spam",
      blurb:
        "The matching engine reads your skills, assessments and preferences — you see roles ranked by fit and employers only see qualified profiles.",
      icon: "Sparkles",
      focus: ["Fit-ranked roles", "Preference controls", "Daily fresh matches", "No spam applications"],
    },
    {
      slug: "skill-assessments",
      title: "Skill Assessments & Badges",
      highlight: "prove it before you pitch it",
      blurb:
        "AI-proctored technical, aptitude and communication assessments turn into verified badges that rank your profile above unverified ones.",
      icon: "BadgeCheck",
      focus: ["AI-proctored testing", "Verified skill badges", "Retake & improvement paths", "Employer-visible scores"],
    },
    {
      slug: "application-tracking",
      title: "Application Tracking",
      highlight: "never wonder where you stand",
      blurb:
        "Every application has a live status — viewed, shortlisted, interviewing, offer — with honest timelines instead of the resume black hole.",
      icon: "Compass",
      focus: ["Live status stages", "Honest timelines", "Interview scheduling", "Offer management"],
    },
    {
      slug: "interview-prep",
      title: "Interview Prep & Mock Rounds",
      highlight: "walk in ready",
      blurb:
        "Mock interviews with real hiring managers, role-specific question banks and salary-negotiation coaching — prep that turns matches into offers.",
      icon: "MessageSquare",
      focus: ["Mock interviews", "Role-specific question banks", "Salary negotiation", "Feedback reports"],
    },
    {
      slug: "salary-insights",
      title: "Salary & Employer Insights",
      highlight: "no surprises, ever",
      blurb:
        "Real salary bands per role and market, verified employer reviews and honest role previews — you know the deal before you apply.",
      icon: "BarChart3",
      focus: ["Salary benchmarks", "Verified employer reviews", "Honest role previews", "Market demand data"],
    },
    {
      slug: "career-resources",
      title: "Career Resources & Guides",
      highlight: "grow between roles",
      blurb:
        "Roadmaps for AI, tech and business careers, skill-up playlists and market reports — the resources that keep you promotable.",
      icon: "BookOpen",
      focus: ["Career roadmaps", "Skill-up playlists", "Market reports", "Resume templates"],
    },
    {
      slug: "candidate-support",
      title: "Candidate Support Desk",
      highlight: "a human at every step",
      blurb:
        "A named support contact, 24-hour query response and guidance from profile to first day — support that continues past the offer letter.",
      icon: "HeartHandshake",
      focus: ["Named support contact", "24-hour response", "Offer-to-onboarding help", "Post-placement check-ins"],
    },
  ],

  // ─────────────── Freelancer / Consultant (emerald) ───────────────
  "freelancer-consultant": [
    {
      slug: "project-marketplace",
      title: "The Project Marketplace",
      highlight: "pick work that fits you",
      blurb:
        "Live AI, tech and business projects with transparent scopes and budgets — filter by skill, duration and rate, then apply in one click.",
      icon: "Briefcase",
      focus: ["Transparent scopes", "Budget & rate filters", "One-click applies", "Daily new briefs"],
    },
    {
      slug: "verified-profile",
      title: "Verified Profile & Badges",
      highlight: "stand out to every client",
      blurb:
        "Identity checks, skill verifications and delivery history combine into a trust profile that wins briefs before the first call.",
      icon: "BadgeCheck",
      focus: ["Identity verification", "Skill verifications", "Delivery history", "Trust score"],
    },
    {
      slug: "client-matching",
      title: "AI Client Matching",
      highlight: "briefs come to you",
      blurb:
        "Register your skills and rate card once — the matching engine sends vetted client briefs that fit your calendar, not just your CV.",
      icon: "Sparkles",
      focus: ["Vetted client briefs", "Calendar-aware matching", "Rate-card matching", "Warm introductions"],
    },
    {
      slug: "escrow-payments",
      title: "Escrow & Milestone Payments",
      highlight: "get paid on delivery",
      blurb:
        "Funds locked at kickoff, released per milestone you control — no invoice chasing, no net-90 games, clear fee math up front.",
      icon: "Wallet",
      focus: ["Funds locked upfront", "Milestone releases", "No invoice chasing", "Transparent fees"],
    },
    {
      slug: "rate-autonomy",
      title: "Rate Setting & Negotiation",
      highlight: "your price, your terms",
      blurb:
        "Set day rates or project pricing, see market benchmarks for your skill set and negotiate with live data behind you.",
      icon: "Gauge",
      focus: ["Day & project rates", "Market benchmarks", "Rate bump guidance", "Renewal reminders"],
    },
    {
      slug: "consultant-community",
      title: "Community & Peer Network",
      highlight: "never freelance alone",
      blurb:
        "2,000+ consultants across AI, tech and business — peer reviews, specialist channels and teaming on bigger engagements.",
      icon: "Network",
      focus: ["Specialist channels", "Peer reviews", "Teaming on big briefs", "Community events"],
    },
    {
      slug: "certifications",
      title: "Certifications & Skill Graph",
      highlight: "compound your credibility",
      blurb:
        "STACK-certified courses feed your skill graph — every completed module makes your profile rank higher in client searches.",
      icon: "GraduationCap",
      focus: ["STACK certifications", "Skill graph updates", "Search ranking boost", "Learning stipends"],
    },
    {
      slug: "freelancer-benefits",
      title: "Benefits & Perks",
      highlight: "full-time style backing",
      blurb:
        "Group insurance options, tooling discounts, tax documentation support and a dedicated consultant desk — freelance with a safety net.",
      icon: "ShieldCheck",
      focus: ["Insurance options", "Tooling discounts", "Tax documentation", "Consultant desk"],
    },
  ],

  // ─────────────── Company / Agency (emerald) ───────────────
  "company-agency": [
    {
      slug: "delivery-platform",
      title: "The Delivery Platform",
      highlight: "run every project in one place",
      blurb:
        "Intake, milestones, quality gates and client reporting in one workspace — your team delivers, the platform does the admin.",
      icon: "Layers",
      focus: ["Project intake", "Milestone tracking", "Quality gates", "Client reporting"],
    },
    {
      slug: "white-label-delivery",
      title: "White-Label Delivery",
      highlight: "your brand, our engine",
      blurb:
        "Deliver under your own brand with STIOOS's platform, playbooks and specialists invisible behind the curtain — or co-branded, your call.",
      icon: "Building2",
      focus: ["Brand control", "Invisible platform layer", "Co-brand options", "NDA-first onboarding"],
    },
    {
      slug: "resource-augmentation",
      title: "Resource Augmentation",
      highlight: "scale your bench on demand",
      blurb:
        "Plug vetted specialists into your team for a sprint or a quarter — AI engineers, cloud architects, designers — without permanent hires.",
      icon: "Users",
      focus: ["Vetted specialists", "Sprint or quarterly terms", "Skill-matched plugs", "Instant swap guarantee"],
    },
    {
      slug: "project-flow",
      title: "Project Flow & Matching",
      highlight: "briefs matched to your bench",
      blurb:
        "Tell us your team's skills and capacity — client briefs from the network flow to you with scopes already shaped for delivery.",
      icon: "Sparkles",
      focus: ["Bench-aware matching", "Pre-scoped briefs", "Priority dispatch", "Fill-rate reporting"],
    },
    {
      slug: "revenue-share",
      title: "Revenue Share & Margins",
      highlight: "keep more of every deal",
      blurb:
        "Transparent margin splits by engagement type, protected rates and monthly reconciliations — you see the math, always.",
      icon: "Wallet",
      focus: ["Transparent splits", "Protected rates", "Monthly reconciliation", "Growth-tier margins"],
    },
    {
      slug: "quality-standards",
      title: "Quality Gates & Standards",
      highlight: "deliver like the A-team",
      blurb:
        "One quality bar across the network — code review standards, delivery checklists and client-satisfaction scoring that keeps partners sharp.",
      icon: "ShieldCheck",
      focus: ["Code & delivery standards", "QA checklists", "CSAT scoring", "Remediation support"],
    },
    {
      slug: "agency-onboarding",
      title: "48-Hour Onboarding",
      highlight: "live in two days",
      blurb:
        "Capability profile, compliance checks, platform training and your first matched brief — most agencies are delivering inside week one.",
      icon: "Zap",
      focus: ["Capability profiling", "Compliance checks", "Platform training", "First matched brief"],
    },
    {
      slug: "agency-success-stories",
      title: "Agency Success Stories",
      highlight: "agencies that scaled with us",
      blurb:
        "The 6-person studio that tripled revenue in a year, and the dev shop that filled 40% of its bench from network briefs — real numbers.",
      icon: "Star",
      focus: ["Revenue growth", "Bench utilization", "First enterprise client", "Retention economics"],
    },
  ],

  // ─────────────── Training Partner (violet) ───────────────
  "training-partner": [
    {
      slug: "curriculum-licensing",
      title: "Curriculum Licensing",
      highlight: "teach what industry hires for",
      blurb:
        "License STIOOS's industry-aligned curricula for AI, cloud, data and full-stack — versioned, lab-backed and updated as the market moves.",
      icon: "BookOpen",
      focus: ["Industry-aligned syllabi", "Versioned updates", "Lab-backed modules", "Assessment banks"],
    },
    {
      slug: "trainer-certification",
      title: "Trainer Certification",
      highlight: "get your trainers certified",
      blurb:
        "Train-the-trainer programs with certification gates, co-teaching shadowing and annual refreshers — your faculty teaches at industry standard.",
      icon: "GraduationCap",
      focus: ["Certification gates", "Co-teaching shadowing", "Annual refreshers", "Faculty scoring"],
    },
    {
      slug: "placement-integration",
      title: "Placement Integration",
      highlight: "outcomes, not just certificates",
      blurb:
        "Your graduates flow into the STIOOS placement engine — assessments, employer matching and hiring events that make your placement stats sell.",
      icon: "Target",
      focus: ["Graduate pipeline", "Employer matching", "Hiring events", "Placement reporting"],
    },
    {
      slug: "co-branded-programs",
      title: "Co-Branded Programs",
      highlight: "both logos on every certificate",
      blurb:
        "Joint certificates and co-marketed batches carry both brands — STIOOS's employer network becomes your institute's strongest sales pitch.",
      icon: "Award",
      focus: ["Joint certification", "Co-marketed batches", "Employer network pitch", "Alumni branding"],
    },
    {
      slug: "lab-infrastructure",
      title: "Labs & Cloud Infrastructure",
      highlight: "classrooms ready to run",
      blurb:
        "Pre-built cloud labs, GPU credits for AI batches and sandbox environments — your students practice on the same stack employers run.",
      icon: "Cloud",
      focus: ["Pre-built cloud labs", "GPU credits", "Sandbox environments", "Usage dashboards"],
    },
    {
      slug: "funding-models",
      title: "Revenue & Funding Models",
      highlight: "make the economics work",
      blurb:
        "Revenue shares, per-batch licensing and placement-fee models — pick the commercial structure that fits your institute's books.",
      icon: "Wallet",
      focus: ["Revenue share options", "Per-batch licensing", "Placement fees", "Transparent accounting"],
    },
    {
      slug: "quality-audits",
      title: "Quality Audits & Accreditations",
      highlight: "credibility, verified",
      blurb:
        "Annual delivery audits, outcome tracking and accreditation support keep your institute certified, listed and trusted by employers.",
      icon: "ShieldCheck",
      focus: ["Delivery audits", "Outcome tracking", "Accreditation support", "Directory listing"],
    },
    {
      slug: "training-partner-stories",
      title: "Partner Success Stories",
      highlight: "institutes that scaled",
      blurb:
        "The regional institute that doubled batches in a year, and the bootcamp whose placement rate jumped to 84% — stories with numbers.",
      icon: "Star",
      focus: ["Batch growth", "Placement-rate jumps", "New program launches", "Employer pipelines"],
    },
  ],

  // ─────────────── Services Partner (violet) ───────────────
  "services-partner": [
    {
      slug: "co-delivery-model",
      title: "The Co-Delivery Model",
      highlight: "two teams, one accountable roof",
      blurb:
        "Joint scoping, shared delivery plans and one unified client reporting layer — clients feel one team, not a handoff chain.",
      icon: "Handshake",
      focus: ["Joint scoping", "Shared delivery plans", "Unified reporting", "Single accountability"],
    },
    {
      slug: "practice-onboarding",
      title: "Practice Onboarding",
      highlight: "your practice, live in 48 hours",
      blurb:
        "Capability mapping, compliance checks, tooling access and delivery-standards training — your practice is pitch-ready within two days.",
      icon: "Zap",
      focus: ["Capability mapping", "Compliance checks", "Tooling access", "Standards training"],
    },
    {
      slug: "lead-sharing",
      title: "Lead Sharing & Joint Sales",
      highlight: "pipeline flows both ways",
      blurb:
        "Network briefs routed to your practice, your referrals credited transparently, and joint account plans for the logos you both want.",
      icon: "Network",
      focus: ["Routed briefs", "Referral credits", "Joint account plans", "Pipeline transparency"],
    },
    {
      slug: "delivery-standards",
      title: "Delivery Standards & SLAs",
      highlight: "one quality bar, both teams",
      blurb:
        "The same checklists, review gates and SLA clocks our internal teams run — your deliveries carry the network's quality signature.",
      icon: "ShieldCheck",
      focus: ["Shared checklists", "Review gates", "SLA clocks", "Escalation paths"],
    },
    {
      slug: "specialist-enablement",
      title: "Specialist Enablement",
      highlight: "your people, our playbooks",
      blurb:
        "Enablement sprints for your consultants — AI delivery playbooks, certification paths and shadowing on live engagements.",
      icon: "GraduationCap",
      focus: ["Delivery playbooks", "Certification paths", "Live shadowing", "Skill assessments"],
    },
    {
      slug: "joint-solutions",
      title: "Joint Solution Packages",
      highlight: "productized offers, ready to sell",
      blurb:
        "Pre-built solution bundles with pricing, decks and reference architectures — walk into client meetings with an offer, not a blank page.",
      icon: "Layers",
      focus: ["Solution bundles", "Pricing & decks", "Reference architectures", "Battle cards"],
    },
    {
      slug: "margin-structure",
      title: "Margins & Commercials",
      highlight: "transparent, protected economics",
      blurb:
        "Clear margin splits per engagement type, rate protection and monthly reconciliation — the commercial math is never a mystery.",
      icon: "Wallet",
      focus: ["Margin splits", "Rate protection", "Monthly reconciliation", "Growth incentives"],
    },
    {
      slug: "services-partner-stories",
      title: "Partner Stories",
      highlight: "practices that grew with us",
      blurb:
        "The data consultancy that added AI delivery in a quarter, and the dev agency now running 60% of its revenue on network engagements.",
      icon: "Star",
      focus: ["New practice lines", "Revenue share growth", "Enterprise logos", "Team expansion"],
    },
  ],

  // ─────────────── Technology Partner (violet) ───────────────
  "technology-partner": [
    {
      slug: "integration-program",
      title: "The Integration Program",
      highlight: "build once, sell everywhere",
      blurb:
        "Certified integrations between your product and the STIOOS platform — built with our solution architects, listed to every client.",
      icon: "Puzzle",
      focus: ["Certified integrations", "Solution architect support", "Platform listing", "Version compatibility"],
    },
    {
      slug: "api-sandbox",
      title: "APIs & Sandbox Access",
      highlight: "documented, testable, live",
      blurb:
        "Full API docs, sandbox tenants and Postman collections — your engineers integrate in days, with SLA-backed production keys after review.",
      icon: "Code",
      focus: ["API documentation", "Sandbox tenants", "Postman collections", "Production key SLAs"],
    },
    {
      slug: "marketplace-listing",
      title: "Marketplace Listing",
      highlight: "your product in front of buyers",
      blurb:
        "A listing on the STIOOS marketplace with your positioning, pricing and demos — discovery by clients who are already buying delivery.",
      icon: "Rocket",
      focus: ["Listing page", "Pricing control", "Demo embedding", "Lead routing"],
    },
    {
      slug: "co-selling",
      title: "Co-Selling & Referrals",
      highlight: "we sell with you, not against you",
      blurb:
        "Joint account mapping, shared pipeline stages and referral economics — when a client needs your product, we bring you in.",
      icon: "Handshake",
      focus: ["Joint account mapping", "Shared pipeline", "Referral economics", "Deal registration"],
    },
    {
      slug: "tech-certification",
      title: "Technical Certification",
      highlight: "badges that open deals",
      blurb:
        "Certify your team and ours on the integrated stack — badged engineers on both sides make every joint deal easier to sign.",
      icon: "BadgeCheck",
      focus: ["Engineer certification", "Dual-side badging", "Exam libraries", "Annual refresh"],
    },
    {
      slug: "joint-roadmap",
      title: "Joint Roadmap & Input",
      highlight: "your voice in our platform",
      blurb:
        "Quarterly roadmap councils and priority feature requests — partners shape the platform their integrations depend on.",
      icon: "Compass",
      focus: ["Roadmap councils", "Priority requests", "Beta access", "Breaking-change notices"],
    },
    {
      slug: "dev-support",
      title: "Developer & Solution Support",
      highlight: "architects on call",
      blurb:
        "A shared Slack channel, solution-architecture reviews and joint debugging during critical integrations — support that ships, not tickets.",
      icon: "Wrench",
      focus: ["Shared Slack channel", "Architecture reviews", "Joint debugging", "Escalation SLAs"],
    },
    {
      slug: "technology-partner-stories",
      title: "Partner Stories",
      highlight: "integrations that pay",
      blurb:
        "The observability vendor whose marketplace listing became 30% of pipeline, and the data tool co-sold into 12 enterprise accounts.",
      icon: "Star",
      focus: ["Pipeline from listings", "Co-sold accounts", "Integration adoption", "Time-to-first-deal"],
    },
  ],

  // ─────────────── AI Partner (violet) ───────────────
  "ai-partner": [
    {
      slug: "ai-incubation",
      title: "AI Solution Incubation",
      highlight: "from model to market",
      blurb:
        "Productize your model with our delivery wrappers — evaluation harnesses, guardrails, UX and deployment pipelines that make it sellable.",
      icon: "BrainCircuit",
      focus: ["Evaluation harnesses", "Guardrails & safety", "UX packaging", "Deployment pipelines"],
    },
    {
      slug: "ai-marketplace",
      title: "The AI Marketplace",
      highlight: "ship where buyers already are",
      blurb:
        "List agents, copilots and model-powered services on the STIOOS marketplace — clients with budgets discover and deploy in clicks.",
      icon: "Rocket",
      focus: ["Listing & positioning", "Buyer discovery", "One-click deployment", "Usage analytics"],
    },
    {
      slug: "compute-credits",
      title: "Compute & Tooling Credits",
      highlight: "run fast without burning cash",
      blurb:
        "GPU credits, inference discounts and tooling licenses for active partners — your runway spent on models, not metering.",
      icon: "Zap",
      focus: ["GPU credits", "Inference discounts", "Tooling licenses", "Usage dashboards"],
    },
    {
      slug: "gtm-support",
      title: "Go-to-Market Support",
      highlight: "launches with an audience",
      blurb:
        "Launch campaigns, webinar slots, case-study production and joint PR — your AI solution ships with a marketing engine behind it.",
      icon: "TrendingUp",
      focus: ["Launch campaigns", "Webinar slots", "Case-study production", "Joint PR"],
    },
    {
      slug: "research-collaboration",
      title: "Research Collaboration",
      highlight: "publish and patent together",
      blurb:
        "Joint research initiatives with our AI lab — shared datasets, co-authored papers and patent programs that build both reputations.",
      icon: "Brain",
      focus: ["Shared datasets", "Co-authored papers", "Patent programs", "Lab access"],
    },
    {
      slug: "responsible-ai",
      title: "Responsible AI Standards",
      highlight: "credible, compliant AI",
      blurb:
        "Alignment with our AI governance framework — risk assessments, EU-AI-Act-ready documentation and audit trails buyers can trust.",
      icon: "ShieldCheck",
      focus: ["Risk assessments", "EU AI Act readiness", "Audit trails", "Compliance reviews"],
    },
    {
      slug: "ai-revenue-models",
      title: "AI Revenue Models",
      highlight: "recurring revenue by design",
      blurb:
        "Subscription, usage-based and hybrid pricing wrappers for your solution — with billing, metering and renewals handled by the platform.",
      icon: "Wallet",
      focus: ["Pricing wrappers", "Usage metering", "Automated billing", "Renewal handling"],
    },
    {
      slug: "ai-partner-stories",
      title: "Partner Stories",
      highlight: "AI teams that scaled",
      blurb:
        "The two-person AI lab whose copilot hit 40 enterprise deployments, and the vision startup co-selling into healthcare — with numbers.",
      icon: "Star",
      focus: ["Enterprise deployments", "Co-sold verticals", "Revenue milestones", "Team scale-up"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────

export function getWorksonnSubSeeds(optionSlug: string): WorksonnSubSeed[] {
  return WORKSONN_SUB_SEEDS[optionSlug] ?? [];
}

export function getWorksonnSubSeed(
  optionSlug: string,
  subSlug: string
): WorksonnSubSeed | undefined {
  return getWorksonnSubSeeds(optionSlug).find((s) => s.slug === subSlug);
}

/** Total sub-page count (64) — used by the route's static params. */
export const WORKSONN_SUB_PAGE_COUNT = Object.values(WORKSONN_SUB_SEEDS).reduce(
  (n, arr) => n + arr.length,
  0
);

// ─────────────────────────────────────────────────────────────
// Deterministic expansion engine
// ─────────────────────────────────────────────────────────────

const hashStr = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const pick = <T,>(arr: readonly T[], key: string): T =>
  arr[hashStr(key) % arr.length];

const lower = (s: string) => (s.charAt(0).toLowerCase() + s.slice(1)) as string;

const KPI_ICONS = ["Target", "Gauge", "Zap", "BarChart3", "ShieldCheck", "Clock"] as const;
/** Coverage-flavored values — grammatically safe with any focus label
    ("100% Named-account locking", "End-to-end Commission ledger"). */
const KPI_VALUES = ["100%", "Included", "End-to-end", "Full"] as const;
const VP_ICONS = ["Target", "BrainCircuit", "ShieldCheck", "Gauge", "Zap", "Globe", "Layers", "Lightbulb"] as const;
const MODULE_ICONS = ["Code", "Database", "Cloud", "BrainCircuit", "ShieldCheck", "Users", "BarChart3", "MessageSquare", "Settings", "Puzzle"] as const;
const VISUALS = ["dashboard", "radial", "network", "badge"] as const;
const CTA_LABELS = ["Talk to the network team", "Book a free consultation", "Get a tailored plan"] as const;
const CTA_KICKERS = ["Start this quarter", "Get moving this month", "Plan your next step"] as const;
const READ_TIMES = ["8 min read", "10 min read", "12 min read", "6 min read"] as const;

const VP_TEMPLATES = [
  (f: string, o: PageSpec) =>
    `${f} is engineered into every ${lower(o.nav)} path — owned, measured and reported, not bolted on afterwards.`,
  (f: string, o: PageSpec) =>
    `You get ${lower(f)} as a standing part of the workflow, with named owners and weekly checkpoints from day one.`,
  (f: string, _o: PageSpec) =>
    `Every plan starts from ${lower(f)} — so outcomes stay predictable and scope never drifts silently.`,
  (f: string, _o: PageSpec) =>
    `${f}, tracked week by week — you always know exactly where things stand without chasing status.`,
] as const;

const SPOT_TEMPLATES = [
  (f: string, o: PageSpec) =>
    `${f} sits at the core of this path — the difference between a ${lower(o.nav)} run that drifts and one that lands.`,
  (f: string, _o: PageSpec) =>
    `We instrument ${lower(f)} from onboarding, so every decision on this page is backed by live data instead of gut feel.`,
  (f: string, o: PageSpec) =>
    `You see ${lower(f)} exactly as the network desk does — one shared view, zero reporting lag, full accountability.`,
] as const;

const MODULE_TEMPLATES = [
  (f: string, o: PageSpec) => `The ${lower(f)} layer of this path — delivered by specialists who run it weekly across the network.`,
  (f: string, _o: PageSpec) => `A dedicated workstream covering ${lower(f)} end to end, with its own SLAs and completion gates.`,
  (f: string, o: PageSpec) => `Configured to your context during onboarding, then run as a repeatable component of every ${lower(o.nav)} cycle.`,
] as const;

const STEP_TEMPLATES = [
  (f: string, o: PageSpec) =>
    `We map your goals against ${lower(f)} — must-haves, success measures and stakeholders aligned in one working session.`,
  (f: string, _o: PageSpec) =>
    `Your setup is built around ${lower(f)}, with owners, timelines and quality gates agreed before anything goes live.`,
  (f: string, _o: PageSpec) =>
    `Execution runs in weekly cycles focused on ${lower(f)} — visible progress, working artifacts, no big-bang surprises.`,
  (f: string, _o: PageSpec) =>
    `We verify outcomes against ${lower(f)} with your own stakeholders scoring the results — gaps get fixed before handover.`,
  (f: string, o: PageSpec) =>
    `You keep the full documentation, telemetry and a named contact — the ${lower(o.nav)} team stays on call for the agreed support window.`,
] as const;

const STEP_TITLES = [
  "Discovery & alignment",
  "Setup & access",
  "Active workstream",
  "Review & quality gates",
  "Scale & ongoing support",
] as const;
const STEP_DURATIONS = [
  ["Week 1", "Days 1–5", "Week 1"],
  ["Weeks 1–2", "Week 2", "Days 5–10"],
  ["Weeks 2–6", "Weeks 3–7", "Weeks 2–8"],
  ["Week 7", "Final week", "Week 8"],
  ["Week 8+", "Ongoing", "Week 9+"],
] as const;

/**
 * Expand one sub-page seed + its parent option spec into a complete
 * 24-section PageSpec. Deterministic: the same (option, seed) pair
 * always renders byte-identical content.
 */
export function buildWorksonnSubSpec(option: PageSpec, seed: WorksonnSubSeed): PageSpec {
  const key = `${option.slug}/${seed.slug}`;
  const f = seed.focus;

  // KPI band: brand anchors first/last, seed-specific middle pair
  const kv = (k: string) => KPI_VALUES[hashStr(k) % KPI_VALUES.length] as string;
  const kpiVal1 = kv(key + "v1");
  const kpiVal2 =
    kv(key + "v2") === kpiVal1
      ? KPI_VALUES[(KPI_VALUES.indexOf(kpiVal1 as (typeof KPI_VALUES)[number]) + 1) % KPI_VALUES.length]
      : kv(key + "v2");
  const kpis = [
    option.kpis[0],
    {
      icon: pick(KPI_ICONS, key + "k1"),
      value: kpiVal1,
      label: f[0],
      detail: `${f[0]} — measured on every ${lower(option.nav)} path, reported weekly.`,
    },
    {
      icon: pick(KPI_ICONS, key + "k2"),
      value: kpiVal2,
      label: f[1],
      detail: `${f[1]} with named owners and SLAs — visible to you in real time.`,
    },
    option.kpis[3],
  ];

  // Value props: 4 seed pillars + 2 inherited brand props
  const vpIconFor = (i: number) => pick(VP_ICONS, key + "vp" + i) as IconKey;
  const valueProps = [
    { icon: vpIconFor(0), title: f[0], description: pick(VP_TEMPLATES, key + "t0")(f[0], option) },
    { icon: vpIconFor(1), title: f[1], description: pick(VP_TEMPLATES, key + "t1")(f[1], option) },
    { icon: vpIconFor(2), title: f[2], description: pick(VP_TEMPLATES, key + "t2")(f[2], option) },
    { icon: vpIconFor(3), title: f[3], description: pick(VP_TEMPLATES, key + "t3")(f[3], option) },
    option.valueProps[1],
    option.valueProps[4],
  ];

  // Process: 5 templated steps weaving the focus pillars
  const durSet = pick(STEP_DURATIONS, key + "dur");
  const process = STEP_TITLES.map((title, i) => ({
    title,
    duration: durSet[i],
    description: STEP_TEMPLATES[i](f[Math.min(i, 3)], option),
  }));

  // Spotlight rows: first is seed-branded, others inherit brand rows re-angled
  const spotlight = [
    {
      icon: seed.icon,
      title: f[0],
      description: pick(SPOT_TEMPLATES, key + "s0")(f[0], option),
      bullets: [f[1], f[2], f[3]],
      visual: pick(VISUALS, key + "vis0"),
    },
    {
      ...option.spotlight[1],
      title: f[2],
      description: pick(SPOT_TEMPLATES, key + "s1")(f[2], option),
    },
    {
      ...option.spotlight[2],
      title: f[3],
      description: pick(SPOT_TEMPLATES, key + "s2")(f[3], option),
    },
  ];

  // Deliverables: 4 seed pillars + 4 inherited (deterministic offset, deduped)
  const inheritedDeliverables = [...option.deliverables];
  const deliverables = [
    ...f.map((x) => x),
    ...inheritedDeliverables
      .filter((d) => !f.some((x) => d.toLowerCase().includes(x.split(" ")[0].toLowerCase())))
      .slice(0, 4),
  ].slice(0, 8);

  // Modules: seed pillars as workstreams + 2 inherited brand modules
  const modules = [
    ...f.map((x, i) => ({
      icon: pick(MODULE_ICONS, key + "m" + i) as IconKey,
      tag: option.nav,
      title: x,
      description: pick(MODULE_TEMPLATES, key + "mt" + i)(x, option),
    })),
    option.modules[0],
    option.modules[5],
  ];

  const resources = [
    {
      type: "Guide",
      title: `${seed.title}: the complete guide`,
      description: `Everything inside ${lower(seed.title)} — scope, workflow, SLAs and pricing in one document.`,
      readTime: pick(READ_TIMES, key + "r1"),
    },
    {
      type: "Checklist",
      title: `${f[0]} checklist`,
      description: `The exact gates we run before any ${lower(option.nav)} path goes live.`,
      readTime: pick(READ_TIMES, key + "r2"),
    },
    {
      type: "Playbook",
      title: `${seed.title} ROI playbook`,
      description: `How members measure the return on ${lower(seed.title)} in the first 90 days.`,
      readTime: pick(READ_TIMES, key + "r3"),
    },
  ];

  const faqs = [
    {
      q: `What exactly is included in ${lower(seed.title)}?`,
      a: `${seed.blurb} Every engagement bundles ${lower(f[0])}, ${lower(f[1])} and ${lower(f[2])} with a named contact and weekly reporting — nothing outsourced, nothing vague.`,
    },
    {
      q: `How does ${lower(seed.title)} fit into the wider Worksonn network?`,
      a: `${seed.title} is one of eight deep-dive paths inside ${lower(option.nav)}. Start there or combine it with the other paths — onboarding, platform access and support carry over either way.`,
    },
    ...option.faqs.slice(0, 4),
  ];

  return {
    slug: `${option.slug}-${seed.slug}`,
    group: option.group,
    accent: option.accent,
    nav: seed.title,

    eyebrow: `Worksonn Network · ${option.nav}`,
    title: seed.title,
    highlight: seed.highlight,
    subtitle: seed.blurb,
    primaryCta: { label: pick(CTA_LABELS, key + "c1"), href: "/contact" },
    secondaryCta: { label: `Back to ${option.nav}`, href: `/worksonn/${option.slug}` },
    heroStats: option.heroStats,

    trustBadges: option.trustBadges,
    kpis,
    audiences: option.audiences,
    valueProps,
    processTitle: `How ${lower(seed.title)} works, step by step`,
    process,
    spotlight,
    deliverablesTitle: `What's included in ${lower(seed.title)}`,
    deliverables,
    modulesTitle: `${seed.title} building blocks`,
    modules,
    tech: {
      ...option.tech,
      title: `The platform behind ${seed.title}`,
      description: `One platform runs intake, delivery telemetry and reporting for ${lower(seed.title)} — you see what we see, in real time.`,
    },
    coverage: {
      ...option.coverage,
      title: `${seed.title} — coverage at a glance`,
      chips: [...f, ...option.coverage.chips].slice(0, 12),
    },
    modelsTitle: option.modelsTitle,
    models: option.models,
    outcomes: option.outcomes,
    testimonials: option.testimonials,
    caseStudy: option.caseStudy,
    comparisonTitle: `${seed.title} vs. going it alone`,
    comparison: option.comparison,
    industries: option.industries,
    regions: option.regions,
    guarantees: option.guarantees,
    experts: option.experts,
    resources,
    faqs,
    ctaBand: {
      kicker: pick(CTA_KICKERS, key + "ck"),
      title: `Put ${lower(seed.title)} to work`,
      primary: {
        kicker: "Join Worksonn",
        title: `Start with ${lower(seed.title)}`,
        text: `Bring your goals to a 20-minute call — leave with a clear path, timeline and exactly what happens after you apply.`,
        cta: { label: "Apply now", href: "/contact" },
      },
      secondary: {
        kicker: "Explore Worksonn",
        title: "One network, eight growth paths",
        text: "Talent, freelancing, agency delivery and four partnership tracks — one onboarding, one platform, zero silos.",
        cta: { label: "See all paths", href: "/worksonn" },
      },
    },
    contact: option.contact,
  };
}
