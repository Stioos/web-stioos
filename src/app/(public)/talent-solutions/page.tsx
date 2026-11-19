import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Factory,
  Globe,
  GraduationCap,
  HeartPulse,
  LineChart,
  MapPin,
  RefreshCw,
  Rocket,
  Radio,
  Server,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Target,
  Truck,
  Users,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TALENT_COLUMNS } from "@/data/talent-solutions";
import type { TalentAccent } from "@/data/talent-solutions";

// ============================================================
// TALENT SOLUTIONS — Employer landing page (15 sections)
//
// Audience: hiring teams, founders, engineering managers, and
// HR directors. The page is a server component — all data is
// static and lives in this file or in @/data/talent-solutions.
// Scroll-triggered reveals are gated client-side by <Reveal>
// (IntersectionObserver + CSS transition, no motion library).
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
];

type Kpi = {
  icon: LucideIcon;
  value: string;
  label: string;
  detail: string;
};

const KPIS: Kpi[] = [
  {
    icon: Users,
    value: "2M+",
    label: "Candidate pool",
    detail: "AI-sourced, screened, and ranked against your role spec.",
  },
  {
    icon: GraduationCap,
    value: "12,000+",
    label: "Trained talent",
    detail: "Industry-aligned curricula delivered across 200+ skill tracks.",
  },
  {
    icon: Target,
    value: "96%",
    label: "Placement rate",
    detail: "Of cohort graduates placed within 60 days of completion.",
  },
  {
    icon: Coins,
    value: "40%",
    label: "Lower cost-per-hire",
    detail: "Versus 20–30% traditional agency fees on first-year salary.",
  },
];

type ProcessStep = {
  icon: LucideIcon;
  title: string;
  duration: string;
  description: string;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: Sparkles,
    title: "Discovery call",
    duration: "Week 1",
    description:
      "30-minute deep dive into your roles, stack, team culture, and ramp expectations. You get a written engagement plan.",
  },
  {
    icon: Target,
    title: "Role definition",
    duration: "Week 1–2",
    description:
      "We translate your hiring need into a role scorecard — skills, must-haves, deal-breakers, and assessment rubric.",
  },
  {
    icon: Users,
    title: "Sourcing & screening",
    duration: "Week 2–3",
    description:
      "AI sourcing from 2M+ candidates, then 5-stage human screening. You receive a shortlist of 5–8 vetted profiles in 48h.",
  },
  {
    icon: GraduationCap,
    title: "Training & cohort",
    duration: "Week 4–9",
    description:
      "Selected candidates complete a role-aligned curriculum on your stack — projects, code reviews, and live shadowing.",
  },
  {
    icon: Rocket,
    title: "Placement & ramp",
    duration: "Week 10+",
    description:
      "Candidates join your team pre-trained. We support onboarding for 90 days and replace for free if it doesn't work out.",
  },
];

type RoiMetric = {
  label: string;
  traditional: { value: string; width: string };
  stioos: { value: string; width: string };
};

const ROI_METRICS: RoiMetric[] = [
  {
    label: "Cost per hire",
    traditional: { value: "$18k avg (20–30% fee)", width: "100%" },
    stioos: { value: "$10.8k avg (pay-after-join)", width: "60%" },
  },
  {
    label: "Time to ramp",
    traditional: { value: "3–6 months", width: "100%" },
    stioos: { value: "1–2 weeks (pre-trained)", width: "22%" },
  },
  {
    label: "Risk of bad hire",
    traditional: { value: "1 in 3 hires underperforms", width: "100%" },
    stioos: { value: "90-day free replacement", width: "12%" },
  },
];

type ComparisonRow = {
  feature: string;
  stioos: string;
  agency: string;
  inhouse: string;
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
  { feature: "Ramp time", stioos: "1–2 weeks", agency: "3–6 months", inhouse: "3–6 months" },
  { feature: "Best for", stioos: "Scale + quality", agency: "One-off hires", inhouse: "Brand-led hiring" },
];

type Industry = {
  icon: LucideIcon;
  name: string;
  hires: string;
};

const INDUSTRIES_SERVED: Industry[] = [
  { icon: Coins, name: "Fintech", hires: "180+ hires" },
  { icon: HeartPulse, name: "Healthcare", hires: "120+ hires" },
  { icon: ShoppingCart, name: "Retail", hires: "260+ hires" },
  { icon: Server, name: "SaaS", hires: "320+ hires" },
  { icon: Factory, name: "Manufacturing", hires: "90+ hires" },
  { icon: Truck, name: "Logistics", hires: "140+ hires" },
  { icon: BookOpen, name: "Education", hires: "70+ hires" },
  { icon: Radio, name: "Telecom", hires: "110+ hires" },
];

type CaseStudy = {
  type: string;
  timeline: string;
  company: string;
  problem: string;
  solution: string;
  resultMetric: string;
  resultDetail: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    type: "Series B Fintech",
    timeline: "8 weeks",
    company: "Payments infrastructure scale-up",
    problem:
      "Needed to triple the engineering team in one quarter without lowering the hiring bar on payments domain depth.",
    solution:
      "Train-to-Hire cohort — three sprints of React/Node plus payments-domain training, with weekly code reviews by the client's staff engineer.",
    resultMetric: "12 hires · 96% retention",
    resultDetail: "All 12 engineers still on team at the 12-month mark.",
  },
  {
    type: "Healthcare SaaS",
    timeline: "5 weeks",
    company: "HIPAA-aware clinical analytics platform",
    problem:
      "Compliance-aware hires were the bottleneck — sourcing engineers who could pass HIPAA and SOC 2 background screens took 4+ months each.",
    solution:
      "Talent Sourcing + AI Assessment, with a pre-filtered pool of compliance-cleared candidates and a 5-stage screening rubric.",
    resultMetric: "7 hires · 0 incidents",
    resultDetail: "Zero compliance incidents across the first 12 months.",
  },
  {
    type: "Retail Giant",
    timeline: "Ongoing",
    company: "National omnichannel retailer",
    problem:
      "Seasonal demand cycles required a flexible analyst bench that could be stood up 4x per year without re-hiring from scratch.",
    solution:
      "Pipeline Partner — quarterly analyst cohorts with a dedicated 40-person bench, retainer plus success-fee model.",
    resultMetric: "38% lower cost-per-hire",
    resultDetail: "Bench covers peak season across 6 regions, ramped in days.",
  },
];

type PricingTier = {
  audience: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const PRICING_TIERS: PricingTier[] = [
  {
    audience: "Single engagement",
    name: "Cohort Sprint",
    description:
      "One training cohort, built around a single role spec. Pay-after-join — you only pay for hires that stick.",
    price: "From $12k",
    unit: "per cohort",
    features: [
      "1 training cohort (8–12 candidates)",
      "Role-aligned curriculum on your stack",
      "48-hour shortlist delivery",
      "90-day replacement guarantee",
      "Weekly progress reports",
      "Pay-after-join model",
    ],
    cta: "Start a cohort",
  },
  {
    audience: "Quarterly engagement",
    name: "Pipeline Partner",
    description:
      "Quarterly cohorts with a dedicated talent partner, priority sourcing, and a maintained bench you can pull from on demand.",
    price: "From $4.5k/mo",
    unit: "+ success fee",
    features: [
      "4 cohorts per year (annual pipeline)",
      "Dedicated talent partner",
      "Priority 48-hour shortlists",
      "Maintained bench of 20–40 candidates",
      "SLA-backed weekly reporting",
      "Quarterly business reviews",
    ],
    cta: "Become a partner",
    featured: true,
  },
  {
    audience: "Annual program",
    name: "Enterprise Academy",
    description:
      "A branded academy inside your organization — dedicated delivery team, multi-role tracks, and an LMS tuned to your stack.",
    price: "Custom",
    unit: "annual program",
    features: [
      "Annual cohort program (unlimited roles)",
      "Branded academy + LMS",
      "Dedicated delivery team",
      "Multi-role training tracks",
      "Executive QBRs + OKR mapping",
      "Integration with your HRIS",
    ],
    cta: "Talk to sales",
  },
];

type Guarantee = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const GUARANTEES: Guarantee[] = [
  {
    icon: RefreshCw,
    title: "90-day replacement",
    description:
      "If a placed candidate leaves or underperforms within 90 days, we source and place a replacement at no additional fee — no questions asked.",
  },
  {
    icon: Coins,
    title: "Pay-after-join",
    description:
      "You only pay for hires that actually join and stay past the guarantee window. No upfront fees for sourcing or training, ever.",
  },
  {
    icon: ShieldCheck,
    title: "SLA-backed delivery",
    description:
      "Every engagement ships with a written service-level agreement covering shortlist turnaround, candidate quality, and response times.",
  },
  {
    icon: LineChart,
    title: "Weekly reporting",
    description:
      "A shared dashboard updated every Monday — pipeline health, shortlist velocity, cohort progress, and placement metrics in one view.",
  },
];

type Region = {
  name: string;
  model: string;
  cities: string[];
  note: string;
};

const GLOBAL_REGIONS: Region[] = [
  {
    name: "North America",
    model: "Onshore",
    cities: ["New York", "Austin", "Toronto"],
    note: "Client-facing delivery and account management hub.",
  },
  {
    name: "South Asia",
    model: "Offshore",
    cities: ["Bengaluru", "Hyderabad", "Colombo"],
    note: "Largest talent pool and training campus — 2M+ candidates.",
  },
  {
    name: "Middle East",
    model: "Onshore + Offshore",
    cities: ["Dubai", "Riyadh", "Doha"],
    note: "Regional compliance-cleared bench for regulated sectors.",
  },
  {
    name: "APAC",
    model: "Offshore",
    cities: ["Singapore", "Manila", "Ho Chi Minh City"],
    note: "Follow-the-sun coverage and multilingual talent bench.",
  },
];

const PRESENCE_STATS = [
  { value: "5+", label: "Countries" },
  { value: "12+", label: "Cities" },
  { value: "3", label: "Delivery centers" },
  { value: "24/7", label: "Follow-the-sun" },
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
// the project's no-blue-primary color rule while keeping three
// distinct, scannable column identities.
type PillarStyle = {
  headerText: string;
  headerChip: string;
  iconTile: string;
  iconText: string;
  ring: string;
  bar: string;
};

const PILLAR_STYLE: Record<TalentAccent, PillarStyle> = {
  blue: {
    headerText: "text-amber-400",
    headerChip: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/25",
    iconTile: "bg-amber-400/10",
    iconText: "text-amber-300",
    ring: "ring-amber-400/25",
    bar: "from-amber-500 to-amber-400",
  },
  emerald: {
    // emerald-300 is NOT overridden in light mode (only emerald-400 is),
    // so we darken to emerald-600/700 for light and keep -300/-400 for dark.
    headerText: "text-emerald-400",
    headerChip:
      "bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/25",
    iconTile: "bg-emerald-400/10",
    iconText: "text-emerald-600 dark:text-emerald-300",
    ring: "ring-emerald-400/25",
    bar: "from-emerald-500 to-emerald-400",
  },
  orange: {
    // orange-400 / orange-300 are NOT overridden in light mode — darken
    // to orange-600/700 for light, keep -300/-400 for dark.
    headerText: "text-orange-600 dark:text-orange-400",
    headerChip:
      "bg-orange-400/10 text-orange-700 dark:text-orange-300 ring-1 ring-orange-400/25",
    iconTile: "bg-orange-400/10",
    iconText: "text-orange-600 dark:text-orange-300",
    ring: "ring-orange-400/25",
    bar: "from-orange-600 to-orange-500",
  },
};

const PILLAR_ICON: Record<TalentAccent, LucideIcon> = {
  blue: GraduationCap,
  emerald: Users,
  orange: BadgeCheck,
};

export default function TalentSolutionsPage() {
  return (
    <main className="bg-brand-ink text-white">
      {/* ============================================================ */}
      {/* 1. HERO                                                       */}
      {/* ============================================================ */}
      <section
        id="hero"
        className="relative scroll-mt-36 overflow-hidden bg-brand-ink text-white"
      >
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 65% at 50% 0%, rgba(245,158,11,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="eyebrow font-bold flex items-center justify-center gap-2 text-amber-400">
                <span className="inline-block h-px w-6 bg-amber-400/60" />
                For Employers · Talent Solutions
                <span className="inline-block h-px w-6 bg-amber-400/60" />
              </p>
            </Reveal>
            <Reveal delay={0.05} as="h1">
              <span className="mt-5 block text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                Hire <span className="text-amber-700 dark:text-amber-400">job-ready talent,</span> not resumes.
              </span>
            </Reveal>
            <Reveal delay={0.1} as="p">
              <span className="mx-auto mt-6 block max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                STIOOS trains, screens, and places candidates against your exact role spec — so every
                hire is ramped on your stack, covered by a 90-day replacement guarantee, and delivered
                40% cheaper than agency hiring.
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-amber-500 px-8 text-base font-semibold text-brand-ink hover:bg-amber-400"
                >
                  <Link href="/contact">
                    Hire Talent Now
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-transparent px-8 text-base font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contact">Book a Discovery Call</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div className="text-center">
                  <dt className="sr-only">Candidate pool size</dt>
                  <dd className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    2M+
                  </dd>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">Candidate pool</p>
                </div>
                <div className="border-x border-white/10 text-center">
                  <dt className="sr-only">Shortlist delivery time</dt>
                  <dd className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    48h
                  </dd>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">Shortlist SLA</p>
                </div>
                <div className="text-center">
                  <dt className="sr-only">Twelve-month retention</dt>
                  <dd className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    96%
                  </dd>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">12-month retention</p>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. TRUST BAR                                                  */}
      {/* ============================================================ */}
      <section
        id="trust"
        className="scroll-mt-36 overflow-hidden border-y border-white/[0.06] bg-brand-navy py-6"
        aria-label="Employer trust signals"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-6">
            {TRUST_BADGES.map((badge) => (
              <li
                key={badge.label}
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
              >
                <badge.icon
                  className="h-4 w-4 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                <span className="text-xs font-medium leading-tight text-slate-200">
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. KPI BAND                                                   */}
      {/* ============================================================ */}
      <section
        id="kpi"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">By the Numbers</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Outcomes that move your hiring metrics
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Every engagement is measured against the four numbers that matter to your hiring
                committee — pool depth, training volume, placement rate, and cost.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {KPIS.map((kpi) => (
                <article
                  key={kpi.label}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                    <kpi.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                    {kpi.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{kpi.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {kpi.detail}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SERVICE PILLARS                                            */}
      {/* ============================================================ */}
      <section
        id="services"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">Capabilities</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                One partner across the talent lifecycle
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Three pillars, nine services — pick the entry point that matches where you are in the
                hiring funnel, or let our talent team stitch them into a single engagement.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {TALENT_COLUMNS.map((col) => {
                const style = PILLAR_STYLE[col.accent];
                const PillarIcon = PILLAR_ICON[col.accent];
                return (
                  <article
                    key={col.title}
                    className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-ink/60 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30"
                  >
                    <header className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.iconTile} ring-1 ${style.ring}`}
                      >
                        <PillarIcon
                          className={`h-5 w-5 ${style.iconText}`}
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <p className={`eyebrow font-bold ${style.headerText}`}>{col.accent}</p>
                        <h3 className="text-lg font-bold text-white">{col.title}</h3>
                      </div>
                    </header>
                    <ul className="divide-y divide-white/5">
                      {col.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="group block px-6 py-5 transition-colors hover:bg-white/[0.03]"
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${style.iconTile} ring-1 ${style.ring}`}
                              >
                                <item.icon
                                  className={`h-4 w-4 ${style.iconText}`}
                                  aria-hidden="true"
                                />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-sm font-semibold text-white">
                                    {item.name}
                                  </h4>
                                  <ArrowUpRight
                                    className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400 transition-colors group-hover:text-amber-400"
                                    aria-hidden="true"
                                  />
                                </div>
                                <p
                                  className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.headerChip}`}
                                >
                                  {item.tag}
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. AUDIENCE PROPOSITION                                       */}
      {/* ============================================================ */}
      <section
        id="audiences"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">Who This Is For</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Built for employers. Open to talent.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Every engagement is engineered around the employer outcome — but the same pipeline
                powers job seekers who want a real career, not just a job.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {/* Employer card — PRIMARY */}
              <article className="relative flex flex-col overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.10] to-transparent p-8 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow font-bold text-amber-400">For Employers</p>
                  <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-ink">
                    Primary audience
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  Hire trained, vetted talent ramped on your stack
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Tell us the roles. We source from a 2M+ pool, screen with a 5-stage rubric, train
                  the finalists on your codebase, and place them with a 90-day replacement guarantee
                  — at 40% lower cost-per-hire than agency hiring.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    "48-hour shortlists of 5–8 vetted profiles",
                    "Pre-trained on your stack, ramped in 1–2 weeks",
                    "Pay-after-join — you only pay for hires that stick",
                    "SLA-backed weekly reporting and dashboards",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="text-slate-200">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="h-11 bg-amber-500 px-6 text-sm font-semibold text-brand-ink hover:bg-amber-400"
                  >
                    <Link href="/contact">
                      Hire Talent Now
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 border-white/25 bg-transparent px-6 text-sm font-medium text-white hover:bg-white/10"
                  >
                    <Link href="#pricing">See pricing models</Link>
                  </Button>
                </div>
              </article>

              {/* Seeker card */}
              <article className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30">
                <p className="eyebrow font-bold text-slate-600 dark:text-slate-400">For Job Seekers</p>
                <h3 className="mt-4 text-xl font-bold text-white">
                  Get trained, placed, paid
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Join a cohort, get trained on real production stacks, and walk into a role with a
                  hiring partner already lined up. Free training for accepted candidates.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Free training for accepted cohort candidates",
                    "Placement support with 500+ hiring partners",
                    "Career coaching for the first 12 months",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                        aria-hidden="true"
                      />
                      <span className="text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/talent-solutions/placements"
                  className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-amber-400 hover:text-amber-300"
                >
                  Explore open roles
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. PROCESS INFOGRAPHIC                                        */}
      {/* ============================================================ */}
      <section
        id="process"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">How It Works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                From discovery call to placement in 10 weeks
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                A predictable, SLA-backed engagement — you always know which week you are in and what
                happens next.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ol
              className="relative mt-12 grid gap-6 lg:grid-cols-5"
              aria-label="Five-step talent engagement timeline"
            >
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="relative">
                  <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-brand-ink/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-amber-400/30">
                        <step.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        Step {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-amber-400">
                      {step.duration}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                  {index < PROCESS_STEPS.length - 1 && (
                    <span
                      className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-brand-navy ring-1 ring-white/10 lg:flex"
                      aria-hidden="true"
                    >
                      <ArrowRight className="h-3 w-3 text-amber-400" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. ROI INFOGRAPHIC                                            */}
      {/* ============================================================ */}
      <section
        id="roi"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">The ROI Math</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                What you save by hiring through STIOOS
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                The same three numbers your CFO tracks — cost, time, and risk — compared side by side
                against the traditional hiring path.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {/* Traditional */}
              <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30 md:p-8">
                <header className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-400/10 ring-1 ring-rose-400/25">
                    <Coins className="h-5 w-5 text-rose-400" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="eyebrow font-bold text-rose-400">The old way</p>
                    <h3 className="text-lg font-bold text-white">Traditional Hiring</h3>
                  </div>
                </header>
                <div className="mt-6 space-y-5">
                  {ROI_METRICS.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-300">{metric.label}</span>
                        <span className="text-slate-600 dark:text-slate-400">{metric.traditional.value}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-rose-400/70"
                          style={{ width: metric.traditional.width }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                  {[
                    "20–30% agency fee on first-year salary",
                    "3–6 months of onboarding before productivity",
                    "Bad-hire risk absorbed entirely by the employer",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400/70" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* STIOOS */}
              <article className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/[0.10] to-transparent p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/50 md:p-8">
                <header className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/30">
                    <Sparkles className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="eyebrow font-bold text-amber-400">The STIOOS way</p>
                    <h3 className="text-lg font-bold text-white">STIOOS Talent</h3>
                  </div>
                </header>
                <div className="mt-6 space-y-5">
                  {ROI_METRICS.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200">{metric.label}</span>
                        <span className="text-amber-300">{metric.stioos.value}</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                          style={{ width: metric.stioos.width }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
                  {[
                    "Pay-after-join — you only pay for hires that stick",
                    "Trained on your stack, ramped in 1–2 weeks",
                    "90-day replacement guarantee on every placement",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. COMPARISON TABLE                                           */}
      {/* ============================================================ */}
      <section
        id="comparison"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">Head-to-Head</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                STIOOS vs. agency vs. in-house recruiting
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Ten capability rows, three approaches. The STIOOS column is highlighted because
                that is the column your hiring committee will actually want to read.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
              <p className="sr-only">
                Comparison table of talent hiring approaches. Swipe horizontally to view all columns.
              </p>
              <table className="min-w-[720px] w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-brand-ink">
                    <th
                      scope="col"
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
                    >
                      Capability
                    </th>
                    <th
                      scope="col"
                      className="bg-amber-500/[0.08] px-5 py-4 text-center text-xs font-bold uppercase tracking-wide text-amber-400"
                    >
                      STIOOS Talent
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
                    >
                      Traditional Agency
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
                    >
                      In-house Recruiting
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COMPARISON_ROWS.map((row) => (
                    <tr
                      key={row.feature}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 align-top text-sm font-medium text-white"
                      >
                        {row.feature}
                      </th>
                      <td className="bg-amber-500/[0.04] px-5 py-4 text-center align-top text-sm font-semibold text-amber-300">
                        {row.stioos}
                      </td>
                      <td className="px-5 py-4 text-center align-top text-sm text-slate-600 dark:text-slate-400">
                        {row.agency}
                      </td>
                      <td className="px-5 py-4 text-center align-top text-sm text-slate-600 dark:text-slate-400">
                        {row.inhouse}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. INDUSTRIES SERVED                                          */}
      {/* ============================================================ */}
      <section
        id="industries"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">Industries We Serve</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Talent placed across eight core industries
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Domain-calibrated cohorts — your candidates learn the regulations, tooling, and
                operating rhythm of your sector before they ever sit down with your team.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {INDUSTRIES_SERVED.map((ind) => (
                <article
                  key={ind.name}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30 hover:bg-white/[0.05]"
                >
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                    <ind.icon className="h-6 w-6 text-amber-400" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">{ind.name}</h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{ind.hires}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. GLOBAL PRESENCE                                           */}
      {/* ============================================================ */}
      <section
        id="global-presence"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">Global Presence</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Onshore and offshore talent, wherever you hire
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                A follow-the-sun delivery model across four regions — your
                account team is local, your talent bench is global, and every
                cohort runs on a single shared quality rubric.
              </p>
            </div>
          </Reveal>

          {/* Presence stats strip */}
          <Reveal delay={0.05}>
            <dl className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
              {PRESENCE_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center"
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-3xl font-bold tracking-tight text-amber-400">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Region cards */}
          <Reveal delay={0.1}>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {GLOBAL_REGIONS.map((region) => (
                <article
                  key={region.name}
                  className="flex flex-col rounded-2xl border border-white/10 bg-brand-ink/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                      <Globe className="h-5 w-5 text-amber-400" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {region.name}
                      </h3>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-400">
                        {region.model}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {region.cities.map((city) => (
                      <li
                        key={city}
                        className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-200"
                      >
                        <MapPin
                          className="h-3 w-3 text-amber-500"
                          aria-hidden="true"
                        />
                        {city}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {region.note}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. CASE STUDIES / RESULTS                                    */}
      {/* ============================================================ */}
      <section
        id="case-studies"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">Results</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Engagements that shipped hires, not promises
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Three recent employer engagements — each with the challenge we walked into, the
                STIOOS service we applied, and the number that mattered to the hiring committee.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {CASE_STUDIES.map((study) => (
                <article
                  key={study.company}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300 ring-1 ring-amber-400/25">
                      {study.type}
                    </span>
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{study.timeline}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-snug text-white">
                    {study.company}
                  </h3>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                        Challenge
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">
                        {study.problem}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-400">
                        Solution
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">
                        {study.solution}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto border-t border-white/10 pt-5">
                    <p className="text-2xl font-bold text-amber-400">{study.resultMetric}</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{study.resultDetail}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. GUARANTEES                                                */}
      {/* ============================================================ */}
      <section
        id="guarantees"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">Our Guarantees</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Four commitments behind every placement
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Every engagement — from a single cohort sprint to a full
                enterprise academy — ships with the same four guarantees baked
                into the contract. No opt-outs, no fine print.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {GUARANTEES.map((g) => (
                <article
                  key={g.title}
                  className="flex flex-col rounded-2xl border border-white/10 bg-brand-ink/60 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/30"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                    <g.icon className="h-6 w-6 text-amber-400" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-white">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {g.description}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 13. PRICING MODELS                                            */}
      {/* ============================================================ */}
      <section
        id="pricing"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">Engagement Models</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Three ways to engage, one pay-after-join philosophy
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Start with a single cohort, commit to a quarterly pipeline, or build a full
                enterprise academy. Every model includes the 90-day replacement guarantee.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {PRICING_TIERS.map((tier) => (
                <article
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-200 ${
                    tier.featured
                      ? "border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-transparent hover:border-amber-500/60 lg:-translate-y-2"
                      : "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-amber-500/30"
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-ink">
                      Most popular
                    </span>
                  )}
                  <p className="eyebrow font-bold text-amber-400">{tier.audience}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{tier.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {tier.description}
                  </p>
                  <div className="mt-5">
                    <span className="text-3xl font-bold tracking-tight text-white">
                      {tier.price}
                    </span>
                    <span className="ml-1.5 text-sm text-slate-600 dark:text-slate-400">{tier.unit}</span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                          aria-hidden="true"
                        />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={tier.featured ? "default" : "outline"}
                    className={`mt-6 h-11 ${
                      tier.featured
                        ? "bg-amber-500 text-brand-ink hover:bg-amber-400"
                        : "border-white/25 bg-transparent text-white hover:bg-white/10"
                    }`}
                  >
                    <Link href="/contact">
                      {tier.cta}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 14. FAQ                                                       */}
      {/* ============================================================ */}
      <section
        id="faq"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow font-bold text-amber-400">FAQ</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Common questions from employers
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                The six questions we hear on every discovery call — answered
                straight, with the specifics your hiring committee will ask for.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 space-y-3">
              {EMPLOYER_FAQS.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-white/10 bg-brand-ink/60 p-5 transition-colors open:border-amber-500/30 open:bg-white/[0.03]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-semibold text-white sm:text-base">
                        {faq.question}
                      </span>
                    </span>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-amber-400 transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="mt-4 pl-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Still have questions?{" "}
              <Link
                href="/contact"
                className="font-semibold text-amber-400 hover:text-amber-300"
              >
                Book a discovery call
              </Link>{" "}
              and we will walk you through the details.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 15. CTA BAND                                                  */}
      {/* ============================================================ */}
      <section
        id="cta"
        className="scroll-mt-36 border-t border-white/[0.06] bg-brand-ink py-16 text-white md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.12] via-brand-navy to-brand-navy px-6 py-14 text-center md:px-12 md:py-16">
              <div className="absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
              <div
                className="absolute left-1/2 top-0 h-56 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl">
                <p className="eyebrow font-bold text-amber-400">Build your pipeline</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Build your talent pipeline this quarter
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  Book a 30-minute discovery call. We will map your roles to the right engagement
                  model, hand you a written SLA, and start shortlists within 48 hours of signing.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 bg-amber-500 px-8 text-base font-semibold text-brand-ink hover:bg-amber-400"
                  >
                    <Link href="/contact">
                      Book a Free Consultation
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 border-white/25 bg-transparent px-8 text-base font-medium text-white hover:bg-white/10"
                  >
                    <Link href="#services">Explore Services</Link>
                  </Button>
                </div>
                <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                    SLA-backed delivery
                  </li>
                  <li className="flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                    90-day replacement guarantee
                  </li>
                  <li className="flex items-center gap-1.5">
                    <LineChart className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                    Weekly reporting + dashboard
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
