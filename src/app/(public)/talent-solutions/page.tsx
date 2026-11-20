import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Factory,
  Globe2,
  GraduationCap,
  Headset,
  HeartPulse,
  HelpCircle,
  LineChart,
  MapPin,
  MessagesSquare,
  PhoneCall,
  Quote,
  Radio,
  RefreshCw,
  Rocket,
  Scale,
  Server,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Target,
  Truck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TALENT_COLUMNS } from "@/data/talent-solutions";
import type { TalentAccent } from "@/data/talent-solutions";

// ============================================================
// TALENT SOLUTIONS — Employer landing page (16 innovative sections)
//
// Every section uses an out-of-the-box visual idea: diagonal
// merged hero card, marquee trust bar, gradient-mesh KPI tiles,
// CSS-only tabbed pillars, asymmetric audience split, vertical
// zigzag timeline, overlapping ROI panels, 3-column comparison
// cards, honeycomb industry circles, staggered case-study cards,
// elevated pricing tier, 2x2 guarantee grid, radiating global
// presence map, glassmorphism testimonial overlap, premium
// two-column FAQ, and a mesh-gradient CTA band.
//
// Server component — no "use client". Scroll-triggered reveals
// are gated by the <Reveal> client component (IntersectionObserver
// + CSS transition). The service-pillar tabs use a CSS-only
// radio + :checked pattern; the FAQ uses native <details>.
// ============================================================

export const metadata: Metadata = {
  title: "Talent Solutions for Employers | STIOOS",
  description:
    "Hire job-ready talent, not resumes. STIOOS trains, screens, and places candidates against your exact role spec — 48h shortlists, 90-day replacement, 40% lower cost-per-hire.",
  alternates: { canonical: "/talent-solutions" },
};

// ----------------------------------------------------------------------
// Static content — drives every infographic on the page.
// ----------------------------------------------------------------------

type TrustBadge = { icon: LucideIcon; label: string };

const TRUST_BADGES: TrustBadge[] = [
  { icon: ShieldCheck, label: "ISO 27001 certified" },
  { icon: Briefcase, label: "500+ employers served" },
  { icon: Target, label: "96% placement rate" },
  { icon: Clock, label: "48h shortlists" },
  { icon: RefreshCw, label: "90-day replacement" },
  { icon: Star, label: "4.9/5 employer rating" },
  { icon: Users, label: "2M+ screened pool" },
  { icon: Globe2, label: "5+ country delivery" },
];

type KpiAccent = "amber" | "emerald" | "sky" | "rose";

type Kpi = {
  icon: LucideIcon;
  value: string;
  label: string;
  detail: string;
  accent: KpiAccent;
  /** "of target" progress fill */
  progress: number;
  target: string;
};

const KPIS: Kpi[] = [
  {
    icon: Users,
    value: "2M+",
    label: "Candidate pool",
    detail: "AI-sourced, screened, and ranked against your role spec.",
    accent: "amber",
    progress: 80,
    target: "of 2.5M goal",
  },
  {
    icon: GraduationCap,
    value: "12K+",
    label: "Trained talent",
    detail: "Industry-aligned curricula across 200+ skill tracks.",
    accent: "emerald",
    progress: 80,
    target: "of 15K goal",
  },
  {
    icon: Target,
    value: "96%",
    label: "Placement rate",
    detail: "Of cohort graduates placed within 60 days of completion.",
    accent: "sky",
    progress: 96,
    target: "of 100% target",
  },
  {
    icon: Coins,
    value: "40%",
    label: "Lower cost-per-hire",
    detail: "Versus 20–30% traditional agency fees on first-year salary.",
    accent: "rose",
    progress: 80,
    target: "of 50% target",
  },
];

const KPI_STYLE: Record<
  KpiAccent,
  { tile: string; text: string; glow: string; mesh: string; bar: string }
> = {
  amber: {
    tile: "from-amber-400 to-orange-500 shadow-amber-500/40",
    text: "from-amber-300 to-orange-400",
    glow: "bg-amber-500/25",
    mesh: "from-amber-500/[0.14] via-orange-500/[0.06] to-transparent",
    bar: "from-amber-400 to-orange-500",
  },
  emerald: {
    tile: "from-emerald-400 to-teal-500 shadow-emerald-500/40",
    text: "from-emerald-300 to-teal-400",
    glow: "bg-emerald-500/25",
    mesh: "from-emerald-500/[0.14] via-teal-500/[0.06] to-transparent",
    bar: "from-emerald-400 to-teal-500",
  },
  sky: {
    tile: "from-sky-400 to-cyan-500 shadow-sky-500/40",
    text: "from-sky-300 to-cyan-400",
    glow: "bg-sky-500/25",
    mesh: "from-sky-500/[0.14] via-cyan-500/[0.06] to-transparent",
    bar: "from-sky-400 to-cyan-500",
  },
  rose: {
    tile: "from-rose-400 to-pink-500 shadow-rose-500/40",
    text: "from-rose-300 to-pink-400",
    glow: "bg-rose-500/25",
    mesh: "from-rose-500/[0.14] via-pink-500/[0.06] to-transparent",
    bar: "from-rose-400 to-pink-500",
  },
};

type ProcessStep = {
  icon: LucideIcon;
  title: string;
  duration: string;
  description: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: Sparkles,
    title: "Discovery",
    duration: "Week 1",
    description:
      "30-minute deep dive into your roles, stack, team culture, and ramp expectations. You get a written engagement plan.",
  },
  {
    icon: Target,
    title: "Role Definition",
    duration: "Week 1–2",
    description:
      "We translate your hiring need into a role scorecard — skills, must-haves, deal-breakers, and assessment rubric.",
  },
  {
    icon: Users,
    title: "Sourcing & Screening",
    duration: "Week 2–3",
    description:
      "AI sourcing from 2M+ candidates, then 5-stage human screening. You receive a shortlist of 5–8 vetted profiles in 48h.",
  },
  {
    icon: GraduationCap,
    title: "Training / Cohort",
    duration: "Week 4–9",
    description:
      "Selected candidates complete a role-aligned curriculum on your stack — projects, code reviews, and live shadowing.",
  },
  {
    icon: Rocket,
    title: "Placement & Ramp",
    duration: "Week 10+",
    description:
      "Candidates join your team pre-trained. We support onboarding for 90 days and replace for free if it doesn't work out.",
  },
];

// ROI calculator — three metrics with before→after values and deltas.
type RoiBar = {
  label: string;
  beforeValue: string;
  afterValue: string;
  beforePct: number;
  afterPct: number;
  delta: string;
  deltaTone: "down" | "up";
};

const ROI_BARS: RoiBar[] = [
  {
    label: "Cost per hire",
    beforeValue: "$20K avg",
    afterValue: "$12K avg",
    beforePct: 100,
    afterPct: 60,
    delta: "−40%",
    deltaTone: "down",
  },
  {
    label: "Time to ramp",
    beforeValue: "3–6 months",
    afterValue: "8–12 weeks",
    beforePct: 100,
    afterPct: 35,
    delta: "−70%",
    deltaTone: "down",
  },
  {
    label: "12-month retention",
    beforeValue: "50%",
    afterValue: "96%",
    beforePct: 50,
    afterPct: 96,
    delta: "+46 pts",
    deltaTone: "up",
  },
];

type ComparisonRow = {
  feature: string;
  stioos: string;
  agency: string;
  inhouse: string;
  /** whether agency/in-house cells are positive */
  agencyOk?: boolean;
  inhouseOk?: boolean;
};

const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Time-to-hire", stioos: "48h shortlists", agency: "3–8 weeks", inhouse: "6–12 weeks" },
  { feature: "Cost-per-hire", stioos: "40% lower", agency: "20–30% of salary", inhouse: "Recruiter salary + tools" },
  { feature: "Replacement guarantee", stioos: "90-day, free", agency: "30–60 day, partial", inhouse: "None" },
  { feature: "Training included", stioos: "Yes, on your stack", agency: "No", inhouse: "No" },
  { feature: "Vetting depth", stioos: "5-stage AI + human", agency: "Resume + 1–2 calls", inhouse: "Phone screen" },
  { feature: "Talent pool size", stioos: "2M+ screened", agency: "Agency CRM", inhouse: "Inbound applicants" },
  { feature: "Dedicated bench", stioos: "Optional", agency: "No", inhouse: "No" },
  { feature: "Reporting cadence", stioos: "Weekly + SLA-backed", agency: "Monthly, ad hoc", inhouse: "Internal only" },
];

type Industry = {
  icon: LucideIcon;
  name: string;
  hires: string;
};

const INDUSTRIES_SERVED: Industry[] = [
  { icon: Coins, name: "Fintech", hires: "320+ hires" },
  { icon: HeartPulse, name: "Healthcare", hires: "240+ hires" },
  { icon: ShoppingCart, name: "Retail", hires: "260+ hires" },
  { icon: Server, name: "SaaS", hires: "320+ hires" },
  { icon: Factory, name: "Manufacturing", hires: "190+ hires" },
  { icon: Truck, name: "Logistics", hires: "140+ hires" },
  { icon: BookOpen, name: "Education", hires: "110+ hires" },
  { icon: Radio, name: "Telecom", hires: "130+ hires" },
];

const INDUSTRY_TILES = [
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
  "from-sky-400 to-cyan-500",
  "from-orange-400 to-amber-500",
  "from-teal-400 to-emerald-500",
  "from-pink-400 to-rose-500",
  "from-cyan-400 to-sky-500",
];

type CaseStudy = {
  companyType: string;
  challenge: string;
  solution: string;
  result: string;
  resultLabel: string;
  metricLabel: string;
  beforePct: number;
  afterPct: number;
  beforeLabel: string;
  afterLabel: string;
  accent: string;
  offset: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    companyType: "Series-B SaaS",
    challenge:
      "“We needed 12 senior backend engineers in one quarter — our recruiter pipeline had delivered three.”",
    solution:
      "Cohort Sprint + 5-stage technical screen. STIOOS ran a 6-week training sprint on the client's Node/Postgres stack.",
    result: "12",
    resultLabel: "hires placed in 8 weeks",
    metricLabel: "Engineering capacity",
    beforePct: 25,
    afterPct: 100,
    beforeLabel: "3 hires",
    afterLabel: "12 hires",
    accent: "from-amber-500 to-orange-500",
    offset: "lg:mt-0",
  },
  {
    companyType: "Retail enterprise",
    challenge:
      "“Seasonal ramp of 200 store ops specialists, with a 38% no-show rate from our prior vendor.”",
    solution:
      "Workforce Solutions + Placements. Pre-screened cohorts across 12 cities, with onboarding playbooks handed to store managers.",
    result: "200",
    resultLabel: "specialists onboarded in 6 weeks",
    metricLabel: "Show-up rate",
    beforePct: 62,
    afterPct: 96,
    beforeLabel: "62% show-up",
    afterLabel: "96% show-up",
    accent: "from-emerald-500 to-teal-500",
    offset: "lg:mt-16",
  },
  {
    companyType: "Fintech scale-up",
    challenge:
      "“Compliance-cleared talent is a 4-month hiring cycle. We did not have 4 months.”",
    solution:
      "Talent Assessment + Placements. STIOOS maintained a SOC 2-cleared bench of 40 candidates; placements started in week 3.",
    result: "18",
    resultLabel: "compliance-cleared hires in 10 weeks",
    metricLabel: "Hiring cycle",
    beforePct: 100,
    afterPct: 25,
    beforeLabel: "4 months",
    afterLabel: "3 weeks",
    accent: "from-orange-500 to-rose-500",
    offset: "lg:mt-8",
  },
];

type PricingTier = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  cta: string;
  featured?: boolean;
  /** background gradient for the card */
  bg: string;
};

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Cohort Sprint",
    price: "$12k",
    cadence: "per cohort",
    blurb:
      "A single role-aligned cohort — source, screen, train, and place 5–8 vetted candidates for one open role.",
    features: [
      "5–8 vetted candidates per cohort",
      "48-hour first shortlist",
      "Role-aligned 4–6 week curriculum",
      "5-stage AI + human screening",
      "90-day replacement guarantee",
      "Shared pipeline dashboard",
    ],
    cta: "Start a cohort",
    bg: "from-white/[0.04] to-white/[0.01]",
  },
  {
    name: "Pipeline Partner",
    price: "$4.5k",
    cadence: "/mo + success fee",
    blurb:
      "A dedicated bench for ongoing hiring — multiple roles, multiple cohorts, monthly retainer + pay-after-join.",
    features: [
      "Dedicated talent bench (10–30 candidates)",
      "Multiple concurrent cohorts",
      "Weekly SLA-backed reporting",
      "Priority sourcing from 2M+ pool",
      "Pay-after-join success fees only",
      "Quarterly business reviews",
    ],
    cta: "Become a partner",
    featured: true,
    bg: "from-amber-500/[0.12] to-orange-500/[0.04]",
  },
  {
    name: "Enterprise Academy",
    price: "Custom",
    cadence: "annual contract",
    blurb:
      "A full talent academy — branded cohorts, custom curriculum, internal hire-portal, and dedicated delivery team.",
    features: [
      "Branded talent academy with portal",
      "Custom curriculum on your stack",
      "Multi-region delivery (3+ centers)",
      "Dedicated senior delivery manager",
      "Internal hiring committee integration",
      "Executive sponsor + quarterly OKRs",
    ],
    cta: "Talk to sales",
    bg: "from-white/[0.04] to-white/[0.01]",
  },
];

type Guarantee = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "amber" | "emerald" | "sky" | "rose";
};

const GUARANTEES: Guarantee[] = [
  {
    icon: RefreshCw,
    title: "90-day replacement",
    description:
      "If a placed candidate leaves or underperforms within 90 days, we source and place a replacement at no additional fee — no questions asked.",
    accent: "amber",
  },
  {
    icon: Coins,
    title: "Pay-after-join",
    description:
      "You only pay for hires that actually join and stay past the guarantee window. No upfront fees for sourcing or training, ever.",
    accent: "emerald",
  },
  {
    icon: ShieldCheck,
    title: "SLA-backed delivery",
    description:
      "Every engagement ships with a written service-level agreement covering shortlist turnaround, candidate quality, and response times.",
    accent: "sky",
  },
  {
    icon: LineChart,
    title: "Weekly reporting",
    description:
      "A shared dashboard updated every Monday — pipeline health, shortlist velocity, cohort progress, and placement metrics in one view.",
    accent: "rose",
  },
];

type GlobalRegion = {
  name: string;
  cities: string[];
};

const GLOBAL_REGIONS: GlobalRegion[] = [
  { name: "North America", cities: ["Austin", "Toronto", "Mexico City"] },
  { name: "South Asia", cities: ["Bengaluru", "Karachi", "Dhaka"] },
  { name: "Middle East", cities: ["Dubai", "Riyadh", "Doha"] },
  { name: "APAC", cities: ["Singapore", "Manila", "Sydney"] },
];

const PRESENCE_STATS: { value: string; label: string }[] = [
  { value: "5+", label: "Countries" },
  { value: "12+", label: "Cities" },
  { value: "3", label: "Delivery centers" },
  { value: "24/7", label: "Follow-the-sun" },
];

type Testimonial = {
  quote: string;
  initials: string;
  name: string;
  role: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We replaced a stalled recruiter pipeline with a STIOOS cohort and onboarded 12 senior engineers in 8 weeks. The 90-day replacement guarantee meant our CFO finally stopped arguing with HR.",
    initials: "RA",
    name: "Raza Ahmed",
    role: "VP Engineering, Series-B SaaS",
    rating: 5,
  },
  {
    quote:
      "The pay-after-join model changed the conversation. For the first time our talent spend was tied to actual hires, not activity. We have since moved all of our technical hiring to STIOOS.",
    initials: "MK",
    name: "Mei Lin Koh",
    role: "Head of People Ops, Fintech scale-up",
    rating: 5,
  },
  {
    quote:
      "What surprised me was the weekly cadence. Every Monday I had a dashboard — pipeline, shortlist velocity, cohort progress. No more chasing recruiters for status updates.",
    initials: "JS",
    name: "Jordan Sato",
    role: "Talent Acquisition Director, Retail enterprise",
    rating: 5,
  },
];

type FaqItem = {
  question: string;
  answer: string;
};

const EMPLOYER_FAQS: FaqItem[] = [
  {
    question: "How quickly can I expect my first shortlist?",
    answer:
      "From the signed engagement plan, you receive your first shortlist of 5–8 vetted profiles within 48 hours. If your role spec needs a custom assessment rubric, we add up to 3 business days for rubric design before the 48-hour clock starts.",
  },
  {
    question: "What happens if a placed candidate doesn't work out?",
    answer:
      "Every placement is covered by a 90-day replacement guarantee. If the candidate leaves voluntarily or is released for performance reasons within 90 days, we source, screen, and place a replacement at no additional fee. The replacement shortlist is delivered within 48 hours of your request.",
  },
  {
    question: "How do you train candidates on our specific tech stack?",
    answer:
      "During the role-definition phase we capture your stack, codebase conventions, and onboarding materials. Selected candidates then complete a 4–6 week curriculum that includes hands-on projects on your actual repositories, code reviews by your staff engineers, and live shadowing sessions — so they ramp in days, not months.",
  },
  {
    question: "What does 'pay-after-join' actually mean?",
    answer:
      "You are billed only for candidates who accept an offer, join your team, and remain past the 90-day guarantee window. There are no upfront sourcing fees, no training fees, and no retainer required for single-cohort engagements. Pipeline Partner and Enterprise Academy tiers include a retainer that covers dedicated bench and reporting infrastructure.",
  },
  {
    question: "Can we scale up or down between engagement models?",
    answer:
      "Yes. Most clients start with a single Cohort Sprint, then graduate to a Pipeline Partner retainer once the first cohort proves out. You can pause cohorts between quarters, scale the bench size up or down with 30 days notice, and upgrade to Enterprise Academy at any contract renewal.",
  },
  {
    question: "How do you handle data security and confidentiality?",
    answer:
      "STIOOS is ISO 27001 certified. All candidate data is encrypted at rest and in transit, access is role-based with full audit logging, and every engagement includes a mutual NDA. For regulated sectors we maintain compliance-cleared candidate pools and support SOC 2 and HIPAA background screens as part of the 5-stage screening rubric.",
  },
];

// Per-pillar visual identity. The data model defines three accents
// (blue / emerald / orange); we remap "blue" to amber here to honor
// the project's no-blue-primary color rule.
type PillarStyle = {
  text: string;
  chip: string;
  tile: string;
  iconText: string;
  ring: string;
  underline: string;
  glow: string;
};

const PILLAR_STYLE: Record<TalentAccent, PillarStyle> = {
  blue: {
    text: "text-amber-400",
    chip: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25",
    tile: "bg-gradient-to-br from-amber-400/25 to-orange-500/15 ring-1 ring-amber-400/30",
    iconText: "text-amber-300",
    ring: "ring-amber-400/30",
    underline: "from-amber-400 to-orange-500",
    glow: "bg-amber-500/20",
  },
  emerald: {
    text: "text-emerald-400",
    chip:
      "bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/25",
    tile: "bg-gradient-to-br from-emerald-400/25 to-teal-500/15 ring-1 ring-emerald-400/30",
    iconText: "text-emerald-600 dark:text-emerald-300",
    ring: "ring-emerald-400/30",
    underline: "from-emerald-400 to-teal-500",
    glow: "bg-emerald-500/20",
  },
  orange: {
    text: "text-orange-600 dark:text-orange-400",
    chip:
      "bg-orange-400/10 text-orange-700 dark:text-orange-300 ring-1 ring-orange-400/25",
    tile: "bg-gradient-to-br from-orange-400/25 to-rose-500/15 ring-1 ring-orange-400/30",
    iconText: "text-orange-600 dark:text-orange-300",
    ring: "ring-orange-400/30",
    underline: "from-orange-400 to-rose-500",
    glow: "bg-orange-500/20",
  },
};

// Hero — feature pills, mini-stats, and the Live Impact Signal panel.
const HERO_FEATURES = [
  { icon: Clock, label: "48h shortlists" },
  { icon: RefreshCw, label: "90-day replacement" },
  { icon: Coins, label: "Pay-after-join" },
  { icon: ShieldCheck, label: "5-stage vetting" },
];

const HERO_STATS = [
  { value: "2M+", label: "Pool" },
  { value: "48h", label: "Shortlist" },
  { value: "96%", label: "Placement" },
  { value: "40%", label: "Lower cost" },
];

// Live Impact Signal panel — donut gauge + 3 KPI before/after cards + 2 bars.
const HERO_GAUGE_PCT = 85;
const HERO_KPI_CARDS = [
  {
    label: "Cost per hire",
    before: "$20K",
    after: "$12K",
    delta: "−40%",
    tone: "down" as const,
  },
  {
    label: "Time to ramp",
    before: "6 mo",
    after: "10 wk",
    delta: "−60%",
    tone: "down" as const,
  },
  {
    label: "Retention",
    before: "50%",
    after: "96%",
    delta: "+46 pts",
    tone: "up" as const,
  },
];
const HERO_BARS = [
  { label: "Pipeline health", value: 92 },
  { label: "Cohort readiness", value: 88 },
];

// Audience split — employer + seeker bullets.
const EMPLOYER_BENEFITS = [
  "Shortlists of 5–8 vetted profiles within 48 hours",
  "Pay-after-join — no upfront sourcing or training fees",
  "90-day replacement guarantee on every placement",
  "Dedicated bench + weekly SLA-backed reporting",
];
const SEEKER_BENEFITS = [
  "Live roles across AI, tech & business",
  "Free, cohort-based upskilling on real stacks",
  "AI-matched roles aligned to your goals",
  "Direct line to 500+ hiring employers",
];

// CTA band — three trust items + floating response badge.
const CTA_TRUST = [
  { icon: Clock, label: "48-hour response" },
  { icon: ShieldCheck, label: "ISO 27001 secure" },
  { icon: MessagesSquare, label: "No-obligation consult" },
];

// ----------------------------------------------------------------------
// Inline <style> — marquee, service-pillar tabs, FAQ details polish.
// Kept small and scoped with prefixed classes so it never leaks.
// ----------------------------------------------------------------------
const PAGE_STYLES = `
@keyframes ts-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.ts-marquee-track {
  animation: ts-marquee 34s linear infinite;
  will-change: transform;
}
.ts-marquee-track:hover { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .ts-marquee-track { animation: none; }
}

/* CSS-only service-pillar tabs (radio + :checked). */
.ts-tabs > input[type="radio"] {
  position: absolute;
  width: 1px; height: 1px;
  opacity: 0; pointer-events: none;
}
.ts-tabs > .ts-panel { display: none; }
.ts-tabs > #ts-pillar-0:checked ~ .ts-panel-0,
.ts-tabs > #ts-pillar-1:checked ~ .ts-panel-1,
.ts-tabs > #ts-pillar-2:checked ~ .ts-panel-2 { display: block; }

.ts-tabs > #ts-pillar-0:checked ~ .ts-tab-row label[for="ts-pillar-0"],
.ts-tabs > #ts-pillar-1:checked ~ .ts-tab-row label[for="ts-pillar-1"],
.ts-tabs > #ts-pillar-2:checked ~ .ts-tab-row label[for="ts-pillar-2"] {
  color: rgb(255 255 255);
  background: rgb(255 255 255 / 0.06);
}
.ts-tabs > #ts-pillar-0:checked ~ .ts-tab-row label[for="ts-pillar-0"] .ts-tab-underline,
.ts-tabs > #ts-pillar-1:checked ~ .ts-tab-row label[for="ts-pillar-1"] .ts-tab-underline,
.ts-tabs > #ts-pillar-2:checked ~ .ts-tab-row label[for="ts-pillar-2"] .ts-tab-underline {
  transform: scaleX(1);
}

/* FAQ premium details */
.ts-faq details > summary { list-style: none; }
.ts-faq details > summary::-webkit-details-marker { display: none; }
.ts-faq details[open] > summary .ts-faq-chevron { transform: rotate(180deg); }
`;

// Helper — render a row of stars.
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < n
              ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
              : "h-3.5 w-3.5 text-slate-600"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function TalentSolutionsPage() {
  return (
    <main className="bg-brand-ink text-white">
      <style dangerouslySetInnerHTML={{ __html: PAGE_STYLES }} />

      {/* ============================================================
          1. HERO — Two-column merged card + Live Impact Signal
          ============================================================ */}
      <section
        id="hero"
        className="relative scroll-mt-36 overflow-hidden border-b border-white/5 bg-brand-ink"
      >
        <div
          className="pointer-events-none absolute inset-0 surface-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 75% at 30% 0%, rgba(245,158,11,0.22), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full opacity-25 blur-3xl"
          aria-hidden="true"
          style={{ background: "rgba(245,158,11,0.4)" }}
        />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 lg:px-8">
          <Reveal delay={0.05}>
            <div
              className="pointer-events-none absolute -inset-4 hidden rounded-3xl opacity-40 blur-2xl sm:block"
              style={{ background: "rgba(245,158,11,0.18)" }}
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm">
              <div className="grid lg:grid-cols-[1.3fr_1fr]">
                {/* ── LEFT — identity + stats + description ── */}
                <div className="flex flex-col gap-5 border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-8">
                  {/* Breadcrumb pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-300 ring-1 ring-white/10">
                      <Sparkles className="h-3 w-3 text-amber-400" aria-hidden="true" />
                      Talent Solutions
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-[11px] font-medium text-amber-400 ring-1 ring-amber-400/25">
                      <Briefcase className="h-3 w-3" aria-hidden="true" />
                      For Employers
                    </span>
                    <span className="text-[11px] text-slate-500">/ hiring teams & HR directors</span>
                  </div>

                  {/* Gradient icon tile + headline */}
                  <div className="flex items-start gap-4">
                    <div
                      className="grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40"
                      aria-hidden="true"
                    >
                      <Users className="h-7 w-7 text-brand-ink" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.7rem]">
                        Hire{" "}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                          job-ready talent
                        </span>
                        , not resumes.
                      </h1>
                      <p className="mt-2 text-sm text-slate-300 sm:text-base">
                        STIOOS trains, screens, and places candidates against your exact role
                        spec — 48-hour shortlists, 90-day replacement, 40% lower cost-per-hire.
                      </p>
                    </div>
                  </div>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2">
                    {HERO_FEATURES.map((f) => (
                      <span
                        key={f.label}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 ring-1 ring-white/10"
                      >
                        <f.icon className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                        {f.label}
                      </span>
                    ))}
                  </div>

                  {/* 4 mini stat cards */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {HERO_STATS.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="bg-gradient-to-br from-amber-300 to-orange-400 bg-clip-text text-xl font-bold text-transparent">
                          {s.value}
                        </div>
                        <div className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-400">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-400">
                    We run a 5-stage AI + human screen against your role scorecard, train the
                    finalists on your stack, and place them with a 90-day replacement guarantee —
                    so your next hire is productive in days, not months.
                  </p>
                </div>

                {/* ── RIGHT — Live Impact Signal panel ── */}
                <div className="relative flex flex-col gap-5 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.02] p-5 sm:p-7 lg:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex size-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Live Impact Signal
                      </span>
                    </div>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-400 ring-1 ring-white/10">
                      last 90 days
                    </span>
                  </div>

                  {/* Donut gauge */}
                  <div className="flex items-center gap-5">
                    <div className="relative size-28 shrink-0">
                      <svg viewBox="0 0 120 120" className="size-28 -rotate-90" aria-hidden="true">
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="rgba(255,255,255,0.10)"
                          strokeWidth="10"
                        />
                        <defs>
                          <linearGradient id="hero-gauge" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="url(#hero-gauge)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${(HERO_GAUGE_PCT / 100) * 2 * Math.PI * 52} ${
                            2 * Math.PI * 52
                          }`}
                        />
                      </svg>
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="text-center">
                          <div className="bg-gradient-to-br from-amber-300 to-orange-400 bg-clip-text text-2xl font-bold text-transparent">
                            {HERO_GAUGE_PCT}%
                          </div>
                          <div className="text-[9px] uppercase tracking-wider text-slate-400">
                            ready
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">
                        Placement readiness
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        Of cohort graduates hit productive ramp within 60 days of placement,
                        measured against your role scorecard.
                      </p>
                    </div>
                  </div>

                  {/* 3 KPI before → after cards */}
                  <div className="grid gap-2.5">
                    {HERO_KPI_CARDS.map((k) => (
                      <div
                        key={k.label}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                      >
                        <span className="text-xs font-medium text-slate-300">{k.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 line-through">{k.before}</span>
                          <ArrowRight className="h-3 w-3 text-slate-500" aria-hidden="true" />
                          <span className="text-sm font-semibold text-white">{k.after}</span>
                          <span
                            className={
                              "rounded-full px-1.5 py-0.5 text-[10px] font-bold " +
                              (k.tone === "down"
                                ? "bg-emerald-400/15 text-emerald-300"
                                : "bg-amber-400/15 text-amber-300")
                            }
                          >
                            {k.delta}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2 progress bars */}
                  <div className="grid gap-3">
                    {HERO_BARS.map((b) => (
                      <div key={b.label}>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{b.label}</span>
                          <span className="font-semibold text-white">{b.value}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                            style={{ width: `${b.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Score badge + quote */}
                  <div className="flex items-start gap-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] p-3">
                    <div className="grid size-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-amber-400 to-orange-500">
                      <Quote className="h-4 w-4 text-brand-ink" aria-hidden="true" />
                    </div>
                    <p className="text-xs italic leading-relaxed text-slate-300">
                      “We onboarded 12 senior engineers in 8 weeks — and our CFO finally stopped
                      arguing with HR.”
                      <span className="mt-1 block text-[10px] not-italic text-slate-500">
                        — Raza Ahmed, VP Engineering
                      </span>
                    </p>
                  </div>

                  {/* 3 CTAs */}
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" className="bg-amber-500 text-brand-ink hover:bg-amber-400">
                      <Link href="/talent-solutions/staffing-solutions">
                        Hire Talent Now <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                      <Link href="/contact">Book a Discovery Call</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="text-slate-300 hover:bg-white/5 hover:text-white">
                      <Link href="#pricing">View Pricing</Link>
                    </Button>
                  </div>

                  {/* Trust footnote */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    ISO 27001 certified · Mutual NDA on every engagement
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          2. TRUST BAR — Marquee of 8 trust badges
          ============================================================ */}
      <section
        id="trust"
        className="scroll-mt-36 overflow-hidden border-b border-white/5 bg-brand-navy py-8"
      >
        <div className="mx-auto mb-5 max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Trusted by 500+ hiring teams worldwide
          </p>
        </div>
        <div className="relative">
          {/* edge fades */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-brand-navy to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-brand-navy to-transparent"
            aria-hidden="true"
          />
          <div className="ts-marquee-track flex w-max gap-0">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-8 pr-8" aria-hidden={dup === 1}>
                {TRUST_BADGES.map((b) => (
                  <div key={b.label} className="flex items-center gap-8">
                    <div className="group flex items-center gap-3 transition-all duration-300 hover:scale-105">
                      <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-500/10 ring-1 ring-amber-400/25 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-amber-500/30">
                        <Check className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      </span>
                      <span className="whitespace-nowrap text-sm font-medium text-slate-300 transition-colors group-hover:text-white">
                        {b.label}
                      </span>
                    </div>
                    <span className="size-1.5 rounded-full bg-amber-400/40" aria-hidden="true" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          3. KPI BAND — Gradient-mesh stat cards
          ============================================================ */}
      <section id="kpi" className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              By the numbers
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Outcomes that move your hiring metrics
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {KPIS.map((k, i) => {
              const s = KPI_STYLE[k.accent];
              return (
                <Reveal key={k.label} delay={i * 0.08}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                    {/* gradient mesh background */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${s.mesh} opacity-80`}
                      aria-hidden="true"
                    />
                    {/* glow orb */}
                    <div
                      className={`pointer-events-none absolute -right-8 -top-8 size-24 rounded-full ${s.glow} blur-2xl`}
                      aria-hidden="true"
                    />
                    <div className="relative flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <div
                          className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${s.tile} shadow-lg`}
                          aria-hidden="true"
                        >
                          <k.icon className="h-6 w-6 text-brand-ink" />
                        </div>
                        <div
                          className={`bg-gradient-to-br ${s.text} bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl`}
                        >
                          {k.value}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{k.label}</div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">{k.detail}</p>
                      </div>
                      {/* thin progress bar — "of target" */}
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">{k.target}</span>
                          <span className="font-medium text-slate-300">{k.progress}%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${s.bar}`}
                            style={{ width: `${k.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. SERVICE PILLARS — CSS-only tabbed interface
          ============================================================ */}
      <section id="services" className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Three pillars
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              One partner across the talent lifecycle
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
              Pick a pillar to explore the services underneath — every service ships with a
              48-hour first shortlist and a 90-day replacement guarantee.
            </p>
          </Reveal>

          <Reveal>
            <div className="ts-tabs relative">
              {/* hidden radios */}
              <input type="radio" name="ts-pillars" id="ts-pillar-0" defaultChecked />
              <input type="radio" name="ts-pillars" id="ts-pillar-1" />
              <input type="radio" name="ts-pillars" id="ts-pillar-2" />

              {/* tab row */}
              <div className="ts-tab-row flex flex-wrap gap-1 border-b border-white/10 sm:gap-2">
                {TALENT_COLUMNS.map((col, i) => {
                  const s = PILLAR_STYLE[col.accent];
                  const Icon = col.items[0]?.icon ?? Sparkles;
                  return (
                    <label
                      key={col.title}
                      htmlFor={`ts-pillar-${i}`}
                      className="group relative flex cursor-pointer items-center gap-2.5 rounded-t-lg px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:text-white sm:px-5"
                    >
                      <span
                        className={`grid size-7 place-items-center rounded-md ${s.tile}`}
                        aria-hidden="true"
                      >
                        <Icon className={`h-4 w-4 ${s.iconText}`} />
                      </span>
                      <span>{col.title}</span>
                      <span className="hidden text-[10px] text-slate-500 sm:inline">
                        {col.items.length} services
                      </span>
                      {/* gradient underline (scaleX 0 → 1 when active) */}
                      <span
                        className={`ts-tab-underline absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-gradient-to-r ${s.underline} transition-transform duration-300`}
                        aria-hidden="true"
                      />
                    </label>
                  );
                })}
              </div>

              {/* panels */}
              {TALENT_COLUMNS.map((col, i) => {
                const s = PILLAR_STYLE[col.accent];
                return (
                  <div key={col.title} className={`ts-panel ts-panel-${i} pt-6`}>
                    <div className="grid gap-4 md:grid-cols-3">
                      {col.items.map((item, j) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                        >
                          <div
                            className={`pointer-events-none absolute -right-10 -top-10 size-24 rounded-full ${s.glow} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                            aria-hidden="true"
                          />
                          <div className="relative flex items-center justify-between">
                            <span
                              className={`grid size-11 place-items-center rounded-lg ${s.tile}`}
                              aria-hidden="true"
                            >
                              <item.icon className={`h-5 w-5 ${s.iconText}`} />
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${s.chip}`}
                            >
                              {item.tag}
                            </span>
                          </div>
                          <div className="relative">
                            <h3 className="text-base font-semibold text-white">{item.name}</h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                              {item.description}
                            </p>
                          </div>
                          <div className="relative mt-auto flex items-center gap-1 text-xs font-medium text-slate-300 transition-colors group-hover:text-white">
                            Explore
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </div>
                          {/* numbered step badge floating between cards */}
                          <span
                            className="absolute -left-2 -top-2 grid size-6 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[10px] font-bold text-brand-ink shadow-lg shadow-amber-500/30"
                            aria-hidden="true"
                          >
                            {String(j + 1).padStart(2, "0")}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          5. AUDIENCE SPLIT — Asymmetric 2/3 + 1/3 cards
          ============================================================ */}
      <section id="audiences" className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Two audiences, one platform
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for hiring teams and career seekers
            </h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* For Employers — 2/3 width, amber gradient, floating 96% badge */}
            <Reveal className="lg:col-span-2" delay={0.05}>
              <div className="relative h-full overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/[0.12] to-orange-500/[0.04] p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-amber-500/20 blur-3xl"
                  aria-hidden="true"
                />
                {/* floating 96% badge */}
                <div className="absolute -right-4 -top-4 grid size-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-center shadow-xl shadow-amber-500/40 sm:size-24">
                  <div>
                    <div className="text-xl font-bold text-brand-ink sm:text-2xl">96%</div>
                    <div className="text-[9px] font-semibold uppercase text-brand-ink/70">
                      placement
                    </div>
                  </div>
                </div>

                <div className="relative max-w-xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-amber-400/25">
                    <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    For Employers
                  </div>
                  <h3 className="text-2xl font-bold text-white sm:text-3xl">
                    Build a pipeline that actually delivers
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Replace your stalled recruiter funnel with a vetted bench, trained on your
                    stack and paid for only when someone joins.
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {EMPLOYER_BENEFITS.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm text-slate-200">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
                          <Check className="h-3 w-3 text-brand-ink" aria-hidden="true" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Button asChild className="bg-amber-500 text-brand-ink hover:bg-amber-400">
                      <Link href="/contact">
                        Start hiring <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                      <Link href="#pricing">See engagement models</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* For Job Seekers — 1/3 width, outlined */}
            <Reveal delay={0.12}>
              <div className="relative flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.02] p-6 sm:p-7">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-400/25">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  For Job Seekers
                </div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Get hired, faster — for free
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Free upskilling, AI-matched roles, and a direct line to 500+ hiring employers.
                </p>
                <ul className="mt-4 grid gap-2.5">
                  {SEEKER_BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Button asChild variant="outline" className="w-full border-emerald-400/30 bg-emerald-400/5 text-emerald-300 hover:bg-emerald-400/10">
                    <Link href="/talent-solutions/placements">
                      Find your role <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. PROCESS TIMELINE — Vertical zigzag
          ============================================================ */}
      <section id="process" className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              From kickoff to ramp
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A 5-step path to a productive hire
            </h2>
          </Reveal>

          <div className="relative">
            {/* central dashed line */}
            <div
              className="absolute left-4 top-4 h-[calc(100%-2rem)] w-px border-l border-dashed border-white/15 sm:left-1/2 sm:-translate-x-px"
              aria-hidden="true"
            />
            <ol className="space-y-8">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                const left = i % 2 === 0;
                return (
                  <Reveal as="li" key={step.title} delay={i * 0.06}>
                    <div
                      className={`relative flex items-start gap-5 sm:gap-0 ${
                        left ? "sm:flex-row" : "sm:flex-row-reverse"
                      }`}
                    >
                      {/* numbered circle node */}
                      <div className="relative z-10 -ml-0 shrink-0 sm:ml-0">
                        <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-brand-ink shadow-lg shadow-amber-500/40 ring-4 ring-brand-navy">
                          {i + 1}
                        </div>
                      </div>

                      {/* card */}
                      <div className={`flex-1 ${left ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                        <div className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 sm:p-5">
                          <div
                            className={`flex items-center gap-3 ${
                              left ? "sm:flex-row-reverse" : ""
                            }`}
                          >
                            <span className="grid size-9 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                              <Icon className="h-4 w-4 text-amber-400" aria-hidden="true" />
                            </span>
                            <h3 className="text-base font-semibold text-white">{step.title}</h3>
                            <span className="ml-auto rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 ring-1 ring-amber-400/25 sm:ml-0">
                              {step.duration}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* empty spacer on the other side (lg) */}
                      <div className="hidden flex-1 sm:block" aria-hidden="true" />
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. ROI INFOGRAPHIC — Two overlapping panels
          ============================================================ */}
      <section id="roi" className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Return on engagement
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              What changes when you switch to STIOOS
            </h2>
          </Reveal>

          <Reveal>
            <div className="relative grid gap-6 lg:grid-cols-2 lg:gap-0">
              {/* Traditional Hiring panel — rose, semi-transparent */}
              <div className="relative z-0 overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-6 backdrop-blur-sm sm:p-7 lg:rounded-r-none">
                <div
                  className="pointer-events-none absolute -left-12 -top-12 size-40 rounded-full bg-rose-500/15 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="mb-1 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-400" aria-hidden="true" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-300">
                      Traditional Hiring
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Agency + in-house funnel</h3>
                  <p className="mt-1 text-xs text-slate-400">High cost, slow ramp, leaky retention.</p>

                  <div className="mt-5 grid gap-4">
                    {ROI_BARS.map((b) => (
                      <div key={b.label}>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{b.label}</span>
                          <span className="font-medium text-rose-300">{b.beforeValue}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400"
                            style={{ width: `${b.beforePct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* STIOOS Talent panel — amber, overlaps on top */}
              <div className="relative z-10 overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/[0.14] to-orange-500/[0.05] p-6 shadow-2xl shadow-amber-500/20 sm:p-7 lg:-ml-10 lg:-mt-6 lg:rounded-l-none">
                <div
                  className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-amber-500/25 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="mb-1 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" aria-hidden="true" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                      STIOOS Talent
                    </span>
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-400/30">
                      recommended
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Cohort-trained, vetted bench</h3>
                  <p className="mt-1 text-xs text-slate-300">Lower cost, faster ramp, durable retention.</p>

                  <div className="mt-5 grid gap-4">
                    {ROI_BARS.map((b) => (
                      <div key={b.label}>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                          <span className="text-slate-300">{b.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white">{b.afterValue}</span>
                            <span
                              className={
                                "rounded-full px-1.5 py-0.5 text-[9px] font-bold " +
                                (b.deltaTone === "down"
                                  ? "bg-emerald-400/15 text-emerald-300"
                                  : "bg-amber-400/15 text-amber-300")
                              }
                            >
                              {b.delta}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                            style={{ width: `${b.afterPct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-400">
                    <Scale className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                    Side-by-side, same scale — the bars show the actual gap.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          8. COMPARISON MATRIX — 3-column card comparison
          ============================================================ */}
      <section id="comparison" className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Side by side
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              STIOOS vs Traditional Agency vs In-house
            </h2>
          </Reveal>

          <Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {/* STIOOS card — elevated, gradient border + amber glow */}
              <div className="relative md:-mt-4 md:mb-4">
                <div
                  className="absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-400/60 to-orange-500/30 opacity-80 blur-[2px]"
                  aria-hidden="true"
                />
                <div className="relative h-full overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-500/[0.10] to-white/[0.02] p-5 shadow-2xl shadow-amber-500/20 sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                        <Sparkles className="h-4 w-4 text-brand-ink" aria-hidden="true" />
                      </span>
                      <span className="text-base font-bold text-white">STIOOS</span>
                    </div>
                    <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-400/30">
                      Best fit
                    </span>
                  </div>
                  <ul className="grid gap-2.5">
                    {COMPARISON_ROWS.map((r) => (
                      <li key={r.feature} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                        <div>
                          <div className="text-[10px] uppercase tracking-wider text-slate-500">
                            {r.feature}
                          </div>
                          <div className="font-medium text-white">{r.stioos}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Traditional Agency card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                    <Briefcase className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </span>
                  <span className="text-base font-semibold text-slate-200">Traditional Agency</span>
                </div>
                <ul className="grid gap-2.5">
                  {COMPARISON_ROWS.map((r) => (
                    <li key={r.feature} className="flex items-start gap-2 text-xs">
                      {r.agencyOk ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/70" aria-hidden="true" />
                      )}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">
                          {r.feature}
                        </div>
                        <div className="text-slate-300">{r.agency}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* In-house card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
                    <Building2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </span>
                  <span className="text-base font-semibold text-slate-200">In-house Recruiting</span>
                </div>
                <ul className="grid gap-2.5">
                  {COMPARISON_ROWS.map((r) => (
                    <li key={r.feature} className="flex items-start gap-2 text-xs">
                      {r.inhouseOk ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                      ) : (
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/70" aria-hidden="true" />
                      )}
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">
                          {r.feature}
                        </div>
                        <div className="text-slate-300">{r.inhouse}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          9. INDUSTRIES — Honeycomb circle grid
          ============================================================ */}
      <section id="industries" className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Where we hire
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              8 industries, 2,000+ placements shipped
            </h2>
          </Reveal>

          <Reveal>
            <div className="flex flex-col items-center gap-8">
              {[INDUSTRIES_SERVED.slice(0, 4), INDUSTRIES_SERVED.slice(4, 8)].map((row, ri) => (
                <div
                  key={ri}
                  className={`flex flex-wrap justify-center gap-6 sm:gap-10 ${
                    ri === 1 ? "sm:ml-12" : ""
                  }`}
                >
                  {row.map((ind, i) => {
                    const idx = ri * 4 + i;
                    const tile = INDUSTRY_TILES[idx];
                    const Icon = ind.icon;
                    return (
                      <div
                        key={ind.name}
                        className="group flex w-28 flex-col items-center gap-3 sm:w-32"
                      >
                        <div className="relative">
                          <div
                            className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br ${tile} opacity-30 blur-xl transition-opacity duration-300 group-hover:opacity-70`}
                            aria-hidden="true"
                          />
                          <div
                            className={`relative grid size-24 place-items-center rounded-full bg-gradient-to-br ${tile} transition-transform duration-300 group-hover:scale-110 sm:size-28`}
                          >
                            <Icon className="h-9 w-9 text-brand-ink" aria-hidden="true" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-white">{ind.name}</div>
                          <div className="text-[11px] text-amber-400">{ind.hires}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          10. CASE STUDIES — Staggered cards
          ============================================================ */}
      <section id="case-studies" className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Proof, not promises
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Three quarters, three outcomes
            </h2>
          </Reveal>

          <div className="grid items-start gap-6 md:grid-cols-3">
            {CASE_STUDIES.map((c, i) => (
              <Reveal key={c.companyType} delay={i * 0.08} className={c.offset}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-6">
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-gradient-to-br ${c.accent} opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-30`}
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300 ring-1 ring-white/10">
                      <Building2 className="h-3 w-3 text-amber-400" aria-hidden="true" />
                      {c.companyType}
                    </span>
                    <p className="mt-3 text-sm italic leading-relaxed text-slate-300">
                      {c.challenge}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-400">
                      <span className="font-semibold text-amber-400">Solution · </span>
                      {c.solution}
                    </p>
                  </div>

                  {/* big result */}
                  <div className="relative mt-5 flex items-end gap-3">
                    <div
                      className={`bg-gradient-to-br ${c.accent} bg-clip-text text-6xl font-bold leading-none text-transparent`}
                    >
                      {c.result}
                    </div>
                    <div className="pb-1 text-[11px] text-slate-400">{c.resultLabel}</div>
                  </div>

                  {/* before → after mini bar */}
                  <div className="relative mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <div className="mb-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{c.metricLabel}</span>
                      <span className="text-slate-500">
                        {c.beforeLabel} → {c.afterLabel}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-[9px] text-slate-500">before</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-rose-400/60"
                            style={{ width: `${c.beforePct}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-10 text-[9px] text-slate-500">after</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${c.accent}`}
                            style={{ width: `${c.afterPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          11. PRICING — Elevated middle tier
          ============================================================ */}
      <section id="pricing" className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-12 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Engagement models
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Pick the depth of partnership
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
              Every tier includes 48-hour first shortlists, 5-stage screening, and a 90-day
              replacement guarantee.
            </p>
          </Reveal>

          <div className="grid items-center gap-6 md:grid-cols-3">
            {PRICING_TIERS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-b ${t.bg} p-6 sm:p-7 ${
                    t.featured
                      ? "border-amber-400/50 shadow-2xl shadow-amber-500/20 md:scale-105"
                      : "border-white/10"
                  }`}
                >
                  {t.featured && (
                    <>
                      <div
                        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-amber-400/40 to-transparent opacity-60"
                        aria-hidden="true"
                      />
                      {/* floating Most Popular badge */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-ink shadow-lg shadow-amber-500/40">
                        Most Popular
                      </div>
                    </>
                  )}
                  <div className="relative">
                    <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                      {t.name}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span
                        className={`text-4xl font-bold ${
                          t.featured
                            ? "bg-gradient-to-br from-amber-300 to-orange-400 bg-clip-text text-transparent"
                            : "text-white"
                        }`}
                      >
                        {t.price}
                      </span>
                      <span className="text-xs text-slate-400">{t.cadence}</span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-400">{t.blurb}</p>

                    <ul className="mt-5 grid gap-2.5">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-slate-200">
                          <CheckCircle2
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              t.featured ? "text-amber-400" : "text-emerald-400"
                            }`}
                            aria-hidden="true"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6">
                      <Button
                        asChild
                        className={
                          t.featured
                            ? "w-full bg-amber-500 text-brand-ink hover:bg-amber-400"
                            : "w-full border border-white/20 bg-white/5 text-white hover:bg-white/10"
                        }
                        variant={t.featured ? "default" : "outline"}
                      >
                        <Link href="/contact">
                          {t.cta} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          12. GUARANTEES — 2x2 grid
          ============================================================ */}
      <section id="guarantees" className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Our commitments
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Four guarantees on every engagement
            </h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {GUARANTEES.map((g, i) => {
              const s = KPI_STYLE[g.accent];
              const Icon = g.icon;
              return (
                <Reveal key={g.title} delay={i * 0.08}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
                    <div
                      className={`pointer-events-none absolute -right-10 -top-10 size-28 rounded-full ${s.glow} opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                      aria-hidden="true"
                    />
                    <div className="relative flex gap-4">
                      <div
                        className={`grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${s.tile} shadow-lg`}
                        aria-hidden="true"
                      >
                        <Icon className="h-7 w-7 text-brand-ink" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white">{g.title}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                          {g.description}
                        </p>
                        <Link
                          href="#faq"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-400 transition-colors hover:text-amber-300"
                        >
                          Learn more
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          13. GLOBAL PRESENCE — Radiating region cards
          ============================================================ */}
      <section id="global-presence" className="scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Follow-the-sun delivery
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              A global bench, one SLA
            </h2>
          </Reveal>

          <Reveal>
            {/* mobile globe header */}
            <div className="mb-8 flex justify-center lg:hidden">
              <div className="relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/40">
                <Globe2 className="h-10 w-10 text-brand-ink" aria-hidden="true" />
              </div>
            </div>

            <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
              {/* SVG connectors — lg only */}
              <svg
                className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="ts-spoke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(245,158,11,0.05)" />
                    <stop offset="50%" stopColor="rgba(245,158,11,0.35)" />
                    <stop offset="100%" stopColor="rgba(245,158,11,0.05)" />
                  </linearGradient>
                </defs>
                <line x1="50%" y1="50%" x2="15%" y2="25%" stroke="url(#ts-spoke)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="15%" y2="75%" stroke="url(#ts-spoke)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="85%" y2="25%" stroke="url(#ts-spoke)" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="85%" y2="75%" stroke="url(#ts-spoke)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>

              {/* left column — 2 regions */}
              <div className="grid gap-5">
                {GLOBAL_REGIONS.slice(0, 2).map((r) => (
                  <div
                    key={r.name}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-amber-400/30"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      <span className="text-sm font-semibold text-white">{r.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.cities.map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300 ring-1 ring-white/10"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* center globe */}
              <div className="relative hidden lg:block">
                <div
                  className="pointer-events-none absolute -inset-6 rounded-full bg-amber-500/20 blur-2xl"
                  aria-hidden="true"
                />
                <div className="relative grid size-28 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-500/40 ring-8 ring-brand-ink">
                  <Globe2 className="h-14 w-14 text-brand-ink" aria-hidden="true" />
                </div>
              </div>

              {/* right column — 2 regions */}
              <div className="grid gap-5">
                {GLOBAL_REGIONS.slice(2, 4).map((r) => (
                  <div
                    key={r.name}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-amber-400/30"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      <span className="text-sm font-semibold text-white">{r.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {r.cities.map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-300 ring-1 ring-white/10"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-stat strip */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {PRESENCE_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center"
                >
                  <div className="bg-gradient-to-br from-amber-300 to-orange-400 bg-clip-text text-2xl font-bold text-transparent">
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          14. TESTIMONIALS — Overlapping glass cards
          ============================================================ */}
      <section id="testimonials" className="scroll-mt-36 border-b border-white/5 bg-brand-navy py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              From the people who hire with us
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              What hiring leaders say
            </h2>
          </Reveal>

          <div className="flex flex-col gap-5 lg:-space-x-4 lg:flex-row">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08} className="lg:flex-1">
                <article className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-400/30 hover:z-10 sm:p-7">
                  <div
                    className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-amber-500/10 blur-2xl"
                    aria-hidden="true"
                  />
                  <Quote
                    className="h-9 w-9 text-amber-400/40"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">“{t.quote}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-brand-ink">
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">{t.name}</div>
                      <div className="truncate text-[11px] text-slate-400">{t.role}</div>
                      <div className="mt-1">
                        <Stars n={t.rating} />
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          15. FAQ — Two-column premium layout (native <details>)
          ============================================================ */}
      <section id="faq" className="ts-faq scroll-mt-36 border-b border-white/5 bg-brand-ink py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            {/* LEFT — sticky intro panel */}
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/[0.08] to-orange-500/[0.02] p-6 sm:p-8">
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-amber-500/15 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-amber-300 ring-1 ring-amber-400/25">
                      <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      FAQ
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Questions?</h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      Everything you need to evaluate STIOOS as your talent partner — from first
                      shortlist timing to data security. Can&apos;t find your answer? Our talent
                      experts respond within one business day.
                    </p>

                    {/* illustration tile */}
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      {[
                        { icon: Clock, label: "48h" },
                        { icon: ShieldCheck, label: "NDA" },
                        { icon: RefreshCw, label: "90-day" },
                      ].map((x) => (
                        <div
                          key={x.label}
                          className="flex flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-3"
                        >
                          <x.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                          <span className="text-[10px] text-slate-400">{x.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                      <Button asChild className="bg-amber-500 text-brand-ink hover:bg-amber-400">
                        <Link href="/contact">
                          <Headset className="h-4 w-4" />
                          Talk to an expert
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                      >
                        <Link href="tel:+1">
                          <PhoneCall className="h-4 w-4" />
                          Book a call
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* RIGHT — 6 expandable cards */}
            <Reveal delay={0.08}>
              <div className="grid gap-3">
                {EMPLOYER_FAQS.map((f, i) => (
                  <details
                    key={f.question}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition-colors hover:border-amber-400/30 open:border-amber-400/30 open:bg-gradient-to-br open:from-amber-500/[0.07] open:to-orange-500/[0.02]"
                  >
                    {/* gradient left-border on hover / open */}
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-gradient-to-b from-amber-400 to-orange-500 transition-transform duration-300 group-hover:scale-y-100 group-open:scale-y-100"
                      aria-hidden="true"
                    />
                    <summary className="flex cursor-pointer items-center gap-4 p-4 sm:p-5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-brand-ink">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm font-semibold text-white sm:text-base">
                        {f.question}
                      </span>
                      <ChevronDown
                        className="ts-faq-chevron h-5 w-5 shrink-0 text-amber-400 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-4 pb-5 pl-16 pr-5 sm:px-5 sm:pl-[4.5rem]">
                      <p className="text-sm leading-relaxed text-slate-400">{f.answer}</p>
                    </div>
                  </details>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <BadgeCheck className="h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
                <p className="text-xs text-slate-400">
                  Still have questions? Every engagement starts with a free 30-minute discovery
                  call — no NDA required to explore fit.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          16. CTA BAND — Full-width gradient mesh
          ============================================================ */}
      <section
        id="cta"
        className="relative scroll-mt-36 overflow-hidden bg-brand-ink py-20"
      >
        {/* amber→orange mesh */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(245,158,11,0.28), transparent 70%), radial-gradient(ellipse 40% 60% at 80% 20%, rgba(249,115,22,0.22), transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(245,158,11,0.18), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 surface-grid opacity-20"
          aria-hidden="true"
        />

        {/* floating 48h response badge — top right */}
        <div className="absolute right-4 top-6 z-10 sm:right-8 sm:top-10">
          <div className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-amber-400" />
            </span>
            <span className="text-xs font-semibold text-amber-300">48h response</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[900px] px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                Start this quarter
              </span>
            </div>
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              Build your talent pipeline{" "}
              <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                this quarter
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
              Tell us your roles and ramp timeline. You get a written engagement plan in 48 hours
              and your first vetted shortlist the day after.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-amber-500 text-brand-ink hover:bg-amber-400">
                <Link href="/contact">
                  Hire Talent Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
              >
                <Link href="/talent-solutions/placements">Browse open roles</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {CTA_TRUST.map((t) => (
                <div key={t.label} className="flex items-center gap-2 text-xs text-slate-300">
                  <t.icon className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  {t.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
