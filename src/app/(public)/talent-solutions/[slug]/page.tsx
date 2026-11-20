import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Construction,
  FileText,
  BookOpen,
  GraduationCap,
  Award,
  Clock,
  Wallet,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Users,
  TrendingUp,
  Download,
  Phone,
  Briefcase,
  Calendar,
  Camera,
  Home,
  CreditCard,
  Languages,
  Brain,
  Send,
  Scale,
  Handshake,
  Lock,
  Target,
  Star,
  ClipboardCheck,
  ScrollText,
  Mail,
  MessageSquare,
  Youtube,
  Building2,
  Code,
  GitBranch,
  Zap,
  Trophy,
  PlayCircle,
  Laptop,
  Rocket,
  Sparkles,
  Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TALENT_PAGE_SPECS, getTalentPage } from "@/data/pages/talent-pages";
import { PageBuilderPage } from "@/components/page-builder/page-builder";
import { BottomCTABar } from "@/components/shared/bottom-cta-bar";
import { getTalentStripGroup } from "@/data/talent-strip-groups";
import { TALENT_INFO_PAGES } from "@/data/talent-info-pages";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

// ============================================================
// TALENT SOLUTIONS OPTION PAGE — /talent-solutions/[slug]
//
// Handles THREE kinds of slugs:
//   1. EXISTING SERVICE pages (train-to-hire, hire-to-train, etc.)
//      → renders the full 24-section PageSpec landing page.
//   2. NEW GROUP pages (candidate-get-trained, employer-build-talent,
//      etc. — 6 total) → renders a PLACEHOLDER structure page while
//      the full content awaits user confirmation.
//   3. INFO PAGES (joining-terms, learning-terms)
//      → Both render a FULL 12-section reference page:
//        joining-terms → JoiningTermsPage (eligibility, fees, bond, etc.)
//        learning-terms → LearningTermsPage (curriculum, culture, execution).
//      → TalentInfoPlaceholder is retained as a fallback for any future
//        info slug that does not yet have a full page built.
// ============================================================

export function generateStaticParams() {
  // Existing service pages — full content. The 6 new group pages and
  // the 2 info pages are not pre-rendered statically; they resolve at
  // request time so their content can be swapped without a build.
  return TALENT_PAGE_SPECS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = getTalentPage(slug);
  if (spec) {
    return {
      title: `${spec.nav} | Talent Solutions`,
      description: spec.subtitle,
    };
  }
  const group = getTalentStripGroup(slug);
  if (group) {
    return {
      title: `${group.name} | Talent Solutions`,
      description: group.tagline,
    };
  }
  // Info pages (Joining Terms, Learning Terms)
  const infoPage = TALENT_INFO_PAGES.find((p) => p.slug === slug);
  if (infoPage) {
    return {
      title: `${infoPage.name} | Talent Solutions`,
      description: infoPage.tagline,
    };
  }
  return {};
}

export default async function TalentOptionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ── EXISTING SERVICE — full 24-section landing page ──
  const spec = getTalentPage(slug);
  if (spec) {
    return (
      <>
        <PageBuilderPage spec={spec} />
        <BottomCTABar serviceName={spec.nav} />
      </>
    );
  }

  // ── NEW GROUP PAGE — placeholder structure awaiting confirmation ──
  const group = getTalentStripGroup(slug);
  if (group) {
    return <TalentGroupPlaceholder groupSlug={slug} />;
  }

  // ── INFO PAGE (Joining Terms, Learning Terms) ──
  // Both info pages now have full 12-section reference pages.
  // Joining Terms → JoiningTermsPage. Learning Terms → LearningTermsPage.
  // TalentInfoPlaceholder is kept as a fallback for any future info slug.
  const infoPage = TALENT_INFO_PAGES.find((p) => p.slug === slug);
  if (infoPage) {
    if (slug === "joining-terms") {
      return <JoiningTermsPage />;
    }
    if (slug === "learning-terms") {
      return <LearningTermsPage />;
    }
    return <TalentInfoPlaceholder infoSlug={slug} />;
  }

  notFound();
}

// ============================================================
// TALENT GROUP PLACEHOLDER — shown for the 6 new grouped options
// (candidate-get-trained, candidate-get-placed, candidate-get-certified,
//  employer-build-talent, employer-hire-talent, employer-scale-workforce).
//
// This is STRUCTURE ONLY: it confirms the route resolves, shows the
// group identity and the existing services that belong to it, and
// surfaces the "page in development" notice. Full page content is
// built after user confirmation.
// ============================================================

function TalentGroupPlaceholder({ groupSlug }: { groupSlug: string }) {
  const group = getTalentStripGroup(groupSlug);
  if (!group) return null;

  const sideLabel =
    group.side === "candidate" ? "For Job Seekers" : "For Employers";

  return (
    <article className="min-h-[60vh] bg-brand-ink text-slate-200">
      {/* Hero — identity + "in development" notice */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Link
            href="/talent-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Talent Solutions
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 ring-1 ring-white/20">
              <group.icon className="h-7 w-7 text-white" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-400">
                {sideLabel} · Talent Solutions Group
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {group.name}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            {group.tagline}
          </p>

          {/* In-development notice */}
          <div className="mt-8 inline-flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] px-4 py-3 text-amber-200">
            <Construction className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-bold">Page in development</p>
              <p className="mt-0.5 text-xs leading-relaxed text-amber-200/80">
                This is a placeholder structure for the new{" "}
                <strong>{group.name}</strong> group page. Full content (hero,
                capabilities, process, FAQs) is built after your
                confirmation. In the meantime, every service in this group
                is reachable below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sub-pages in this group — these pages ARE fully built */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-amber-400">Available now</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Pages in the {group.name} group
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              {group.subPages.length} candidate-focused pages belong to
              this group — every one is fully built and ready to explore.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.subPages.map((svc) => (
              <Link
                key={svc.slug}
                href={`/talent-solutions/${group.slug}/${svc.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-brand-navy p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/15 ring-1 ring-amber-500/20">
                  <svc.icon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-white md:text-lg">
                  {svc.stripLabel}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {svc.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 transition-colors group-hover:text-amber-300">
                  Open page
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

// ============================================================
// TALENT INFO PLACEHOLDER — shown for the Learning Terms
// informational page. Structure only — full content built after
// user confirmation. (Joining Terms now has a full page; see
// JoiningTermsPage below.)
// ============================================================

function TalentInfoPlaceholder({ infoSlug }: { infoSlug: string }) {
  const info = TALENT_INFO_PAGES.find((p) => p.slug === infoSlug);
  if (!info) return null;

  return (
    <article className="min-h-[60vh] bg-brand-ink text-slate-200">
      {/* Hero — identity + "in development" notice */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Link
            href="/talent-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Talent Solutions
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30 ring-1 ring-white/20">
              <info.icon className="h-7 w-7 text-white" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                Talent Solutions · Information
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {info.name}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
            {info.tagline}
          </p>

          {/* In-development notice */}
          <div className="mt-8 inline-flex items-start gap-3 rounded-xl border border-sky-400/30 bg-sky-400/[0.06] px-4 py-3 text-sky-200">
            <Construction className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-bold">Page in development</p>
              <p className="mt-0.5 text-xs leading-relaxed text-sky-200/80">
                This is a placeholder structure for the{" "}
                <strong>{info.name}</strong> page. Full content is built after
                your confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Description section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-amber-400">Overview</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
              {info.name} — what to expect
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 md:text-base">
              {info.description}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-white/10 bg-brand-navy p-8">
            <p className="text-sm leading-relaxed text-slate-300">
              This page will cover everything you need to know about{" "}
              <strong className="text-white">{info.name.toLowerCase()}</strong>{" "}
              — structured as a clear, scannable reference with sections,
              infographics and FAQs. The content will be developed once the
              overall structure is confirmed.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400"
              >
                Talk to a talent expert
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/talent-solutions"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-transparent px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore talent solutions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

// ============================================================
// JOINING TERMS PAGE — full 12-section reference for candidates
// joining a STIOOS talent program. Documents eligibility,
// application, fees, stipends, bond, conversion, refund policy,
// code of conduct, performance metrics, and CTAs.
//
// Server component (no "use client"). Scroll-triggered reveals
// are gated client-side by <Reveal> (IntersectionObserver + CSS
// transition, no motion library shipped).
// ============================================================

// --- Static content blocks driving each infographic ---

type HeroStat = {
  icon: LucideIcon;
  value: string;
  label: string;
  detail: string;
};

const HERO_STATS: HeroStat[] = [
  {
    icon: ShieldCheck,
    value: "90-day",
    label: "Replacement guarantee",
    detail:
      "Free replacement if a placed candidate exits within 90 days of joining.",
  },
  {
    icon: TrendingUp,
    value: "96%",
    label: "Trainee-to-hire conversion",
    detail:
      "Of cohort graduates placed as full-time hires within 60 days of completion.",
  },
  {
    icon: Clock,
    value: "8-12 wks",
    label: "Average training duration",
    detail:
      "Role-aligned curriculum ramping to a client-specific capstone project.",
  },
];

type EligibilityCriterion = {
  icon: LucideIcon;
  title: string;
  requirement: string;
  detail: string;
  progress: number; // 0-100
  progressLabel: string;
};

const ELIGIBILITY: EligibilityCriterion[] = [
  {
    icon: GraduationCap,
    title: "Education",
    requirement: "12th pass / Graduate",
    detail:
      "Higher-secondary (Class 12) or equivalent is the floor. Graduate and post-graduate candidates are placed on faster tracks.",
    progress: 100,
    progressLabel: "Mandatory",
  },
  {
    icon: Users,
    title: "Age",
    requirement: "18 - 35 years",
    detail:
      "Candidates must be 18+ at the time of application and under 35 on the program start date. Verified via government ID.",
    progress: 100,
    progressLabel: "Mandatory",
  },
  {
    icon: Brain,
    title: "Basic aptitude",
    requirement: "AI-screened, 70+ score",
    detail:
      "Numerical, logical and verbal reasoning assessed by an AI-proctored test. A 70/100 score is required to advance.",
    progress: 70,
    progressLabel: "Threshold 70/100",
  },
  {
    icon: Languages,
    title: "Language proficiency",
    requirement: "English B2 / Regional fluent",
    detail:
      "CEFR B2 in English (read, write, speak) and fluency in at least one regional language for client-facing roles.",
    progress: 80,
    progressLabel: "CEFR B2 minimum",
  },
];

type TimelineStep = {
  icon: LucideIcon;
  step: string;
  title: string;
  duration: string;
  description: string;
};

const APPLICATION_STEPS: TimelineStep[] = [
  {
    icon: Send,
    step: "01",
    title: "Apply online",
    duration: "Day 0",
    description:
      "Submit the online application with basic profile, role preference and resume. Confirmation is sent within 24 hours.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI screening",
    duration: "Day 1-2",
    description:
      "An AI screener evaluates profile fit, prior experience and declared skills. Top 60% of applicants advance.",
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "Aptitude test",
    duration: "Day 3-5",
    description:
      "90-minute proctored aptitude assessment covering reasoning, language and role-specific fundamentals.",
  },
  {
    icon: Users,
    step: "04",
    title: "Interview",
    duration: "Day 6-8",
    description:
      "Panel interview with a STIOOS mentor and (where applicable) a client hiring manager. Recorded for feedback.",
  },
  {
    icon: FileText,
    step: "05",
    title: "Offer letter",
    duration: "Day 9-10",
    description:
      "Selected candidates receive a formal offer letter outlining stipend, training schedule and conversion terms.",
  },
];

type DocumentRequirement = {
  icon: LucideIcon;
  name: string;
  note: string;
};

const DOCUMENTS: DocumentRequirement[] = [
  {
    icon: CreditCard,
    name: "Government photo ID",
    note: "Aadhaar / Voter ID / Driving licence / Passport.",
  },
  {
    icon: FileCheck,
    name: "PAN card",
    note: "Mandatory for stipend processing and tax filings.",
  },
  {
    icon: Home,
    name: "Address proof",
    note: "Utility bill, rental agreement or passport (up to 3 months old).",
  },
  {
    icon: GraduationCap,
    name: "Education certificates",
    note: "12th / Diploma / Degree mark sheets and provisional certificate.",
  },
  {
    icon: FileText,
    name: "Resume / CV",
    note: "Latest resume in PDF, up to 2 pages, role-aligned.",
  },
  {
    icon: Camera,
    name: "Passport-size photo",
    note: "Two recent colour photographs with white background.",
  },
  {
    icon: Wallet,
    name: "Bank account details",
    note: "Cancelled cheque or bank letter for stipend disbursement.",
  },
  {
    icon: Briefcase,
    name: "Experience docs (if any)",
    note: "Relieving letters / experience certificates from previous employers.",
  },
];

type FeeLine = {
  icon: LucideIcon;
  label: string;
  amount: string;
  note: string;
  refundable: boolean;
};

const FEE_LINES: FeeLine[] = [
  {
    icon: Wallet,
    label: "Training fee",
    amount: "INR 0 - 15,000",
    note: "Subsidised on most role tracks. Fee waivers available for women candidates and tier-3 locations.",
    refundable: false,
  },
  {
    icon: ShieldCheck,
    label: "Security deposit",
    amount: "INR 10,000",
    note: "Refundable on completion of the bond period or pro-rata on early exit (see refund policy).",
    refundable: true,
  },
];

type IncludedItem = {
  icon: LucideIcon;
  label: string;
  detail: string;
};

const INCLUDED_ITEMS: IncludedItem[] = [
  {
    icon: BookOpen,
    label: "Courseware & labs",
    detail:
      "200+ hours of structured curriculum, hands-on labs and recorded sessions.",
  },
  {
    icon: Users,
    label: "1:1 mentorship",
    detail:
      "Dedicated mentor with weekly check-ins, code reviews and feedback.",
  },
  {
    icon: Award,
    label: "Industry certification",
    detail:
      "STIOOS role certificate endorsed by partner employers on capstone pass.",
  },
];

type PaymentSchedule = {
  icon: LucideIcon;
  phase: string;
  when: string;
  amount: string;
};

const PAYMENT_SCHEDULE: PaymentSchedule[] = [
  {
    icon: Send,
    phase: "Enrolment",
    when: "On offer acceptance",
    amount: "Security deposit + 50% training fee (if any)",
  },
  {
    icon: ClipboardCheck,
    phase: "Mid-programme",
    when: "Week 6",
    amount: "Remaining 50% training fee (if any)",
  },
  {
    icon: ShieldCheck,
    phase: "Refund",
    when: "On bond completion / exit",
    amount: "Security deposit refunded per policy",
  },
];

type StipendPhase = {
  phase: string;
  period: string;
  amount: string;
  heightPct: number; // 0-100, bar height
  note: string;
};

const STIPEND_PHASES: StipendPhase[] = [
  {
    phase: "Training stipend",
    period: "Week 1-4",
    amount: "INR 5,000/mo",
    heightPct: 25,
    note: "Paid during foundational training.",
  },
  {
    phase: "Project stipend",
    period: "Week 5-8",
    amount: "INR 12,000/mo",
    heightPct: 55,
    note: "Paid while working on live training projects.",
  },
  {
    phase: "Pre-placement stipend",
    period: "Week 9-12",
    amount: "INR 20,000/mo",
    heightPct: 80,
    note: "Paid during capstone and client interview prep.",
  },
  {
    phase: "Full salary",
    period: "Post-joining",
    amount: "Per offer",
    heightPct: 100,
    note: "Full CTC as per the FTE offer letter.",
  },
];

type BondRule = {
  icon: LucideIcon;
  text: string;
  strong: string;
};

const BOND_COVERS: BondRule[] = [
  {
    icon: CheckCircle2,
    strong: "12 months of continuous service",
    text: "with the placement employer.",
  },
  {
    icon: CheckCircle2,
    strong: "Counter-signed",
    text: "by the candidate, STIOOS and the hiring client.",
  },
  {
    icon: CheckCircle2,
    strong: "90-day probation sub-period",
    text: "with replacement guarantee baked in.",
  },
  {
    icon: CheckCircle2,
    strong: "Transferable",
    text: "between STIOOS partner clients on a case-by-case basis.",
  },
];

const BOND_BREAK: BondRule[] = [
  {
    icon: Scale,
    strong: "Pro-rata refund",
    text: "of the security deposit, based on months completed.",
  },
  {
    icon: AlertTriangle,
    strong: "No recovery",
    text: "of stipends already paid — those are earned income.",
  },
  {
    icon: FileCheck,
    strong: "Certificate status",
    text: "Programme certificate retained; capstone certificate may be withheld pending exit review.",
  },
  {
    icon: Handshake,
    strong: "Mutual exit",
    text: "If the candidate leaves for higher studies or personal reasons with notice, deposit is refunded in full.",
  },
];

const BOND_MILESTONES: { label: string; note: string }[] = [
  { label: "Month 0", note: "Joining & onboarding" },
  { label: "Month 3", note: "Probation review" },
  { label: "Month 6", note: "Mid-bond check-in" },
  { label: "Month 9", note: "Performance review" },
  { label: "Month 12", note: "Bond complete — deposit refunded" },
];

type ConversionStep = {
  icon: LucideIcon;
  step: string;
  title: string;
  detail: string;
};

const CONVERSION_STEPS: ConversionStep[] = [
  {
    icon: GraduationCap,
    step: "1",
    title: "Complete training",
    detail:
      "All 8-12 weeks of curriculum, assessments and labs finished.",
  },
  {
    icon: Award,
    step: "2",
    title: "Pass capstone",
    detail:
      "Final capstone reviewed and accepted by mentor + client SME.",
  },
  {
    icon: Users,
    step: "3",
    title: "Client interview",
    detail:
      "Final-round technical + behavioural interview with the hiring client.",
  },
  {
    icon: FileText,
    step: "4",
    title: "Offer letter",
    detail:
      "Formal FTE offer issued with start date, CTC and role grade.",
  },
  {
    icon: Briefcase,
    step: "5",
    title: "Join as FTE",
    detail:
      "Onboarding with the client; STIOOS hands off the candidate file.",
  },
];

type RefundRow = {
  scenario: string;
  refund: string;
  refundPct: number;
  note: string;
};

const REFUND_ROWS: RefundRow[] = [
  {
    scenario: "Voluntary exit before Week 2",
    refund: "90% of fees",
    refundPct: 90,
    note: "Candidate withdraws within the first two weeks of training.",
  },
  {
    scenario: "Voluntary exit Week 2 - 4",
    refund: "50% of fees",
    refundPct: 50,
    note: "Withdrawal between Week 2 and Week 4 of the training programme.",
  },
  {
    scenario: "Voluntary exit Week 4 - 8",
    refund: "25% of fees",
    refundPct: 25,
    note: "Withdrawal between Week 4 and Week 8 of the training programme.",
  },
  {
    scenario: "Voluntary exit after Week 8",
    refund: "No refund",
    refundPct: 0,
    note: "Withdrawal after Week 8 forfeits the security deposit entirely.",
  },
  {
    scenario: "Terminated by programme",
    refund: "Full refund",
    refundPct: 100,
    note: "If STIOOS ends the engagement (e.g. cohort cancellation) — full refund + deposit.",
  },
];

type ConductRule = {
  icon: LucideIcon;
  title: string;
  rule: string;
  detail: string;
};

const CONDUCT_RULES: ConductRule[] = [
  {
    icon: Calendar,
    title: "Attendance",
    rule: "Minimum 85%",
    detail:
      "Daily attendance tracked via biometric + LMS login. Below 85% triggers mentor review and may delay conversion.",
  },
  {
    icon: Clock,
    title: "Punctuality",
    rule: "On-time, every day",
    detail:
      "Sessions start at the published time. Three late logins in a week count as one absence for attendance purposes.",
  },
  {
    icon: Handshake,
    title: "Professional behaviour",
    rule: "Respect & collaboration",
    detail:
      "Courtesy towards mentors, peers and client teams. Harassment of any kind is a zero-tolerance ground for removal.",
  },
  {
    icon: Lock,
    title: "Confidentiality",
    rule: "NDA-bound",
    detail:
      "All client data, project IP and internal materials are NDA-protected. Breach invokes immediate exit and deposit forfeiture.",
  },
  {
    icon: Target,
    title: "Project delivery",
    rule: "On-spec, on-time",
    detail:
      "Capstone and milestone projects must meet the published acceptance criteria by the agreed deadline.",
  },
  {
    icon: Users,
    title: "Mentorship participation",
    rule: "Active engagement",
    detail:
      "Attend weekly mentor calls, complete feedback loops, and contribute to peer code reviews.",
  },
];

type PerformanceMetric = {
  icon: LucideIcon;
  label: string;
  value: string;
  target: string;
  progress: number; // 0-100
  detail: string;
};

const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    icon: Calendar,
    label: "Attendance",
    value: "85%",
    target: "Minimum threshold",
    progress: 85,
    detail: "Biometric + LMS login, weekly average.",
  },
  {
    icon: ClipboardCheck,
    label: "Assessment score",
    value: "70%",
    target: "Pass mark per module",
    progress: 70,
    detail: "Weekly assessments across all modules.",
  },
  {
    icon: CheckCircle2,
    label: "Project completion",
    value: "100%",
    target: "All milestones",
    progress: 100,
    detail: "Every capstone milestone accepted by mentor.",
  },
  {
    icon: Star,
    label: "Mentor feedback",
    value: "4.0/5",
    target: "Minimum rating",
    progress: 80,
    detail: "Composite rating across technical + soft skills.",
  },
];

function JoiningTermsPage() {
  const bondRadius = 78;
  const bondCircumference = 2 * Math.PI * bondRadius;

  return (
    <main className="min-h-screen bg-brand-ink text-white">
      {/* ============================================================ */}
      {/* 1. HERO                                                       */}
      {/* ============================================================ */}
      <section
        id="joining-hero"
        className="relative scroll-mt-36 overflow-hidden bg-brand-ink"
        aria-label="Joining Terms overview"
      >
        <div className="absolute inset-0 surface-grid opacity-50" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 65% at 50% 0%, rgba(245,158,11,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <Link
            href="/talent-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Talent Solutions
          </Link>

          <div className="mt-6 max-w-3xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-2 text-amber-400">
                <span className="inline-block h-px w-6 bg-amber-400/60" aria-hidden="true" />
                For Employers &amp; Candidates
                <span className="inline-block h-px w-6 bg-amber-400/60" aria-hidden="true" />
              </p>
            </Reveal>
            <Reveal delay={0.05} as="h1">
              <span className="mt-5 block text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                Joining Terms
              </span>
            </Reveal>
            <Reveal delay={0.1} as="p">
              <span className="mt-6 block max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                Everything you need to know about how a candidate joins a
                STIOOS talent programme — eligibility, application steps,
                documents, fees, stipends, the 12-month service bond,
                conversion to full-time hire and the refund policy. Built as a
                single scannable reference for hiring teams and prospective
                candidates.
              </span>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
                {HERO_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-brand-navy p-5"
                  >
                    <stat.icon
                      className="h-5 w-5 text-amber-400"
                      aria-hidden="true"
                    />
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {stat.value}
                    </dd>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                      {stat.detail}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. ELIGIBILITY INFOGRAPHIC                                    */}
      {/* ============================================================ */}
      <section
        id="eligibility"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Eligibility criteria"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Who can join</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Eligibility criteria
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Four baseline criteria gate entry into every STIOOS programme.
                Each is verified during the application process. Candidates who
                do not meet one or more criteria may be routed to a
                preparatory track.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ELIGIBILITY.map((item) => (
                <article
                  key={item.title}
                  className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-ink p-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                    <item.icon
                      className="h-6 w-6 text-amber-400"
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-amber-400">
                    {item.requirement}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {item.detail}
                  </p>
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      <span>{item.progressLabel}</span>
                      <span className="text-amber-400">{item.progress}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                        style={{ width: `${item.progress}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. APPLICATION PROCESS TIMELINE                              */}
      {/* ============================================================ */}
      <section
        id="application-process"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Application process timeline"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">How to apply</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Application process — 5 steps in 10 days
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                From online application to signed offer letter, the end-to-end
                process typically takes 10 calendar days. Each step has a
                published SLA so candidates always know where they stand.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {APPLICATION_STEPS.map((step, idx) => (
                <li key={step.step} className="relative">
                  {/* horizontal connector (lg only) */}
                  {idx < APPLICATION_STEPS.length - 1 && (
                    <span
                      className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-amber-500/40 to-white/10 lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <article className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-brand-navy p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 ring-1 ring-white/20">
                        <step.icon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                          Step {step.step}
                        </span>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                          {step.duration}
                        </span>
                      </div>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {step.description}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. DOCUMENT REQUIREMENTS GRID                                */}
      {/* ============================================================ */}
      <section
        id="documents"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Document requirements"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">What to keep ready</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Document requirements
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Eight standard documents are required to confirm enrolment.
                Submit scanned copies via the candidate portal at least 48
                hours before the programme start date. Originals are verified
                on Day 1.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DOCUMENTS.map((doc) => (
                <article
                  key={doc.name}
                  className="group rounded-2xl border border-white/10 bg-brand-ink p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                    <doc.icon
                      className="h-5 w-5 text-amber-400"
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {doc.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {doc.note}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. FEE STRUCTURE INFOGRAPHIC                                 */}
      {/* ============================================================ */}
      <section
        id="fee-structure"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Fee structure"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">What it costs</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Fee structure &amp; what&apos;s included
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Fees are kept transparent and minimal. The bulk of the training
                cost is borne by employer partners. Candidates pay a small
                training fee (waivers available) and a refundable security
                deposit.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Fee breakdown */}
            <Reveal>
              <div className="h-full rounded-2xl border border-white/10 bg-brand-navy p-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Wallet className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-white">
                    Fee breakdown
                  </h3>
                </div>
                <ul className="mt-4 divide-y divide-white/[0.06]">
                  {FEE_LINES.map((line) => (
                    <li key={line.label} className="py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                            <line.icon
                              className="h-4 w-4 text-amber-400"
                              aria-hidden="true"
                            />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {line.label}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-400">
                              {line.note}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-400">
                            {line.amount}
                          </p>
                          <span
                            className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              line.refundable
                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25"
                                : "bg-white/5 text-slate-400 ring-1 ring-white/10"
                            }`}
                          >
                            {line.refundable ? "Refundable" : "Non-refundable"}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* What's included */}
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-brand-navy p-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Award className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  <h3 className="text-base font-semibold text-white">
                    What&apos;s included
                  </h3>
                </div>
                <ul className="mt-4 space-y-4">
                  {INCLUDED_ITEMS.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                        <item.icon
                          className="h-4 w-4 text-amber-400"
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Payment schedule */}
          <Reveal delay={0.15}>
            <div className="mt-6 rounded-2xl border border-white/10 bg-brand-navy p-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Calendar
                  className="h-5 w-5 text-amber-400"
                  aria-hidden="true"
                />
                <h3 className="text-base font-semibold text-white">
                  Payment schedule
                </h3>
              </div>
              <ol className="mt-6 grid gap-4 sm:grid-cols-3">
                {PAYMENT_SCHEDULE.map((p, i) => (
                  <li
                    key={p.phase}
                    className="relative rounded-xl border border-white/10 bg-brand-ink p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-orange-500 text-xs font-bold text-white ring-1 ring-white/20">
                        {i + 1}
                      </span>
                      <p.icon
                        className="h-4 w-4 text-amber-400"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-white">
                      {p.phase}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-amber-400">
                      {p.when}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {p.amount}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. STIPEND & COMPENSATION BAR CHART                          */}
      {/* ============================================================ */}
      <section
        id="stipend-chart"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Stipend and compensation chart"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Earn while you learn</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Stipend &amp; compensation growth
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Stipends scale with contribution. Candidates receive a training
                stipend in the first month, growing through project work and
                capstone, then converting to full salary on placement.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-white/10 bg-brand-ink p-6 sm:p-8">
              {/* chart area */}
              <div className="relative ml-10 h-64 border-l border-b border-white/10 sm:ml-12">
                {/* y-axis labels */}
                <div className="absolute inset-y-0 left-0 flex w-10 -translate-x-full flex-col justify-between pr-2 text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:w-12">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                {/* gridlines */}
                {[0, 25, 50, 75, 100].map((pct) => (
                  <div
                    key={pct}
                    className="absolute left-0 right-0 border-t border-white/[0.06]"
                    style={{ bottom: `${pct}%` }}
                    aria-hidden="true"
                  />
                ))}
                {/* bars */}
                <div className="absolute inset-0 flex items-end justify-around gap-3 px-3 sm:gap-6">
                  {STIPEND_PHASES.map((phase) => (
                    <div
                      key={phase.phase}
                      className="group flex w-full max-w-[80px] flex-col items-center justify-end"
                    >
                      <p className="mb-1 text-center text-[11px] font-bold text-amber-400 sm:text-xs">
                        {phase.amount}
                      </p>
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-amber-500/70 to-amber-400 transition-all duration-500 group-hover:from-amber-500 group-hover:to-orange-400"
                        style={{ height: `${phase.heightPct}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* bar labels grid */}
              <div className="ml-10 mt-4 grid grid-cols-4 gap-3 sm:ml-12">
                {STIPEND_PHASES.map((phase) => (
                  <div key={phase.phase} className="text-center">
                    <p className="text-[11px] font-semibold text-white sm:text-xs">
                      {phase.phase}
                    </p>
                    <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-400">
                      {phase.period}
                    </p>
                    <p className="mt-1 text-[10px] leading-snug text-slate-400 sm:text-[11px]">
                      {phase.note}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 border-t border-white/[0.06] pt-4 text-[11px] leading-relaxed text-slate-500">
                Bar heights are proportional to monthly compensation. Stipends
                are disbursed by the 5th of the following month via direct bank
                transfer. Full salary is paid by the hiring client per their
                payroll cycle.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. TRAINING BOND INFOGRAPHIC                                 */}
      {/* ============================================================ */}
      <section
        id="training-bond"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Training bond"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Service agreement</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Training bond — 12-month service agreement
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Every placed candidate signs a 12-month service agreement with
                STIOOS. The bond ensures the time and resources invested in
                training are converted into real on-the-job impact. Breaking
                the bond triggers a pro-rata refund of the security deposit.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* circular ring */}
            <Reveal>
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-brand-navy p-8">
                <div className="relative h-52 w-52 sm:h-56 sm:w-56">
                  <svg
                    viewBox="0 0 200 200"
                    className="h-full w-full"
                    aria-hidden="true"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r={bondRadius}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="12"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r={bondRadius}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${bondCircumference}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 100 100)"
                    />
                    {Array.from({ length: 12 }).map((_, i) => {
                      const angle = ((i * 30 - 90) * Math.PI) / 180;
                      const inner = bondRadius - 18;
                      const outer = bondRadius + 14;
                      const x1 = 100 + inner * Math.cos(angle);
                      const y1 = 100 + inner * Math.sin(angle);
                      const x2 = 100 + outer * Math.cos(angle);
                      const y2 = 100 + outer * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="rgba(255,255,255,0.22)"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold tracking-tight text-white">
                      12
                    </span>
                    <span className="mt-1 text-xs font-medium uppercase tracking-wider text-amber-400">
                      months
                    </span>
                  </div>
                </div>
                <p className="mt-6 text-center text-sm font-semibold text-white">
                  Full bond period
                </p>
                <p className="mt-1 text-center text-xs leading-relaxed text-slate-400">
                  Counted from the FTE joining date with the client.
                </p>
              </div>
            </Reveal>

            {/* bond covers */}
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-brand-navy p-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <ShieldCheck
                    className="h-5 w-5 text-amber-400"
                    aria-hidden="true"
                  />
                  <h3 className="text-base font-semibold text-white">
                    What the bond covers
                  </h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {BOND_COVERS.map((rule) => (
                    <li key={rule.strong} className="flex items-start gap-2">
                      <rule.icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="text-xs leading-relaxed text-slate-300">
                        <strong className="text-white">{rule.strong}</strong>{" "}
                        {rule.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* if broken */}
            <Reveal delay={0.15}>
              <div className="h-full rounded-2xl border border-white/10 bg-brand-navy p-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <AlertTriangle
                    className="h-5 w-5 text-amber-400"
                    aria-hidden="true"
                  />
                  <h3 className="text-base font-semibold text-white">
                    If the bond is broken
                  </h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {BOND_BREAK.map((rule) => (
                    <li key={rule.strong} className="flex items-start gap-2">
                      <rule.icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="text-xs leading-relaxed text-slate-300">
                        <strong className="text-white">{rule.strong}</strong>{" "}
                        {rule.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* 12-month timeline */}
          <Reveal delay={0.2}>
            <div className="mt-6 rounded-2xl border border-white/10 bg-brand-navy p-6">
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Clock className="h-5 w-5 text-amber-400" aria-hidden="true" />
                <h3 className="text-base font-semibold text-white">
                  12-month bond timeline
                </h3>
              </div>
              <div className="mt-8 overflow-x-auto pb-4">
                <div className="relative flex min-w-[640px] items-start justify-between">
                  <div
                    className="absolute left-0 right-0 top-3 h-0.5 bg-white/10"
                    aria-hidden="true"
                  />
                  {BOND_MILESTONES.map((m) => (
                    <div
                      key={m.label}
                      className="relative z-10 flex w-32 flex-col items-center text-center"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 ring-4 ring-brand-navy">
                        <span
                          className="h-2 w-2 rounded-full bg-white"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="mt-3 text-xs font-semibold text-white">
                        {m.label}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-slate-400">
                        {m.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. CONVERSION TO HIRE FLOWCHART                              */}
      {/* ============================================================ */}
      <section
        id="conversion-flow"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Conversion to hire flowchart"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">From trainee to full-time</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Conversion to hire flowchart
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                The path from programme enrolment to full-time employee is a
                five-stage funnel. Each stage has a clear gate; failing a gate
                triggers either remediation or graceful exit.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto">
              <ol className="flex min-w-[720px] items-stretch justify-between gap-2">
                {CONVERSION_STEPS.map((step, idx) => (
                  <li key={step.step} className="flex items-stretch gap-2">
                    <article className="relative flex w-44 flex-col rounded-2xl border border-white/10 bg-brand-ink p-5 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 ring-1 ring-white/20">
                        <step.icon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                        Stage {step.step}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                        {step.detail}
                      </p>
                    </article>
                    {idx < CONVERSION_STEPS.length - 1 && (
                      <div
                        className="flex items-center px-1"
                        aria-hidden="true"
                      >
                        <ArrowRight className="h-5 w-5 text-amber-400" />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-brand-ink p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Conversion rate
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                  96%
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Of capstone-passed candidates convert to FTE within 60 days.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-brand-ink p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Time to offer
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                  ~14 days
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  From capstone pass to issued offer letter, median across 2024
                  cohorts.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-brand-ink p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  1-year retention
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                  92%
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Of placed candidates retained at the 12-month mark.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. REFUND POLICY TABLE                                       */}
      {/* ============================================================ */}
      <section
        id="refund-policy"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Refund policy"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">If a candidate exits early</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Refund policy
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Refunds are calculated based on the week the candidate exits the
                programme. The table below covers the most common scenarios.
                All refunds are processed within 14 business days of exit
                confirmation.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[640px] overflow-hidden rounded-2xl border border-white/10 bg-brand-navy text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th
                      scope="col"
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-amber-400"
                    >
                      Scenario
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-amber-400"
                    >
                      Refund
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-amber-400"
                    >
                      Refund %
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-amber-400"
                    >
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {REFUND_ROWS.map((row) => (
                    <tr
                      key={row.scenario}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-400/10 ring-1 ring-amber-400/25">
                            <ScrollText
                              className="h-3.5 w-3.5 text-amber-400"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="font-medium text-white">
                            {row.scenario}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span
                          className={`font-bold ${
                            row.refundPct === 0
                              ? "text-slate-400"
                              : "text-amber-400"
                          }`}
                        >
                          {row.refund}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full ${
                                row.refundPct === 0
                                  ? "bg-slate-500"
                                  : "bg-gradient-to-r from-amber-500 to-amber-400"
                              }`}
                              style={{ width: `${row.refundPct}%` }}
                              aria-hidden="true"
                            />
                          </div>
                          <span className="text-xs font-semibold text-white">
                            {row.refundPct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-top text-xs leading-relaxed text-slate-400">
                        {row.note}
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
      {/* 10. CODE OF CONDUCT CARDS                                    */}
      {/* ============================================================ */}
      <section
        id="conduct"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Code of conduct"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">What we expect</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Code of conduct
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Six conduct expectations govern every candidate&apos;s journey.
                They protect the cohort experience, the mentor relationship and
                the client trust that underwrites the conversion pipeline.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CONDUCT_RULES.map((rule) => (
                <article
                  key={rule.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-brand-ink p-6 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                      <rule.icon
                        className="h-5 w-5 text-amber-400"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-400/25">
                      {rule.rule}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {rule.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {rule.detail}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. ATTENDANCE & PERFORMANCE METRICS                         */}
      {/* ============================================================ */}
      <section
        id="performance-metrics"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Attendance and performance metrics"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Measured every week</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Attendance &amp; performance metrics
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Four metrics gate progression through the programme and
                eligibility for conversion. They are tracked weekly on the
                candidate dashboard, with mentor review on any metric that
                drops below threshold.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PERFORMANCE_METRICS.map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-brand-navy p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                      <metric.icon
                        className="h-5 w-5 text-amber-400"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                        {metric.target}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {metric.label}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold tracking-tight text-white">
                    {metric.value}
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      <span>Progress</span>
                      <span className="text-amber-400">
                        {metric.progress}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                        style={{ width: `${metric.progress}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {metric.detail}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. CTA BAND                                                  */}
      {/* ============================================================ */}
      <section
        id="joining-cta"
        className="scroll-mt-36 border-t border-white/[0.06] bg-brand-ink py-16 text-white md:py-24"
        aria-label="Get in touch"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.12] via-brand-navy to-brand-navy px-6 py-14 text-center md:px-12 md:py-16">
              <div
                className="absolute inset-0 surface-grid opacity-40"
                aria-hidden="true"
              />
              <div
                className="absolute left-1/2 top-0 h-56 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl">
                <p className="eyebrow text-amber-400">We are here to help</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  Have questions about joining?
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  Talk to a STIOOS talent expert for a walkthrough of the
                  joining terms, fee waivers for your cohort, or to download
                  the full joining terms PDF for your records.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 bg-amber-500 px-8 text-base font-semibold text-brand-ink hover:bg-amber-400"
                  >
                    <Link href="/contact">
                      <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                      Talk to a talent expert
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 border-white/25 bg-transparent px-8 text-base font-medium text-white hover:bg-white/10"
                  >
                    <Link href="/contact">
                      <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                      Download joining terms PDF
                    </Link>
                  </Button>
                </div>
                <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <Phone
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    +91 80 4500 1200
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Mail
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    talent@stioos.com
                  </li>
                  <li className="flex items-center gap-1.5">
                    <MessageSquare
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    Live chat · Mon-Sat, 9am-8pm IST
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

// ============================================================
// LEARNING TERMS PAGE — full 12-section reference documenting
// HOW candidates learn in STIOOS training programs. The
// philosophy: foundations via external platforms, real-world
// execution on client-shaped projects, advanced company-grade
// patterns. Convincing EMPLOYERS that STIOOS-trained candidates
// arrive already knowing how real companies operate.
//
// Server component (no "use client"). Scroll-triggered reveals
// are gated client-side by <Reveal>.
// ============================================================

// --- Static content blocks driving each infographic ---

type LearningHeroStat = {
  icon: LucideIcon;
  value: string;
  label: string;
  detail: string;
};

const LEARNING_HERO_STATS: LearningHeroStat[] = [
  {
    icon: BookOpen,
    value: "200+",
    label: "Curated skill tracks",
    detail:
      "Tracks spanning frontend, backend, DevOps, data, AI/ML, QA and mobile — each with vetted courseware.",
  },
  {
    icon: Clock,
    value: "12-wk",
    label: "Average programme length",
    detail:
      "Role-aligned curriculum ramping from external foundations to a production-grade capstone.",
  },
  {
    icon: TrendingUp,
    value: "94%",
    label: "Job-readiness score",
    detail:
      "Average mentor + employer assessment of graduate job-readiness on day one of placement.",
  },
];

type PyramidLayer = {
  tier: string;
  title: string;
  sources: string;
  detail: string;
  icon: LucideIcon;
  widthPct: number;
};

const PYRAMID_LAYERS: PyramidLayer[] = [
  {
    tier: "Layer 1 — Base",
    title: "Foundations via external platforms",
    sources: "YouTube · Udemy · Coursera · edX · freeCodeCamp",
    detail:
      "Candidates build core concepts using curated courses from the best free and paid platforms. STIOOS selects the top 3-5 courses per skill and skips the noise.",
    icon: PlayCircle,
    widthPct: 100,
  },
  {
    tier: "Layer 2 — Middle",
    title: "Real-world execution",
    sources: "Client-shaped projects · sprints · code reviews",
    detail:
      "Candidates apply what they learn on real tasks for real client-shaped projects — with sprints, code reviews and mentor feedback on every PR.",
    icon: Rocket,
    widthPct: 72,
  },
  {
    tier: "Layer 3 — Apex",
    title: "Advanced company patterns",
    sources:
      "Production architecture · CI/CD · observability · incident response",
    detail:
      "Beyond basics: patterns companies actually use on production systems — microservices, deployment pipelines, monitoring, on-call, stakeholder management.",
    icon: Sparkles,
    widthPct: 44,
  },
];

type PlatformCard = {
  icon: LucideIcon;
  name: string;
  courses: string;
  tracks: string;
  note: string;
};

const LEARNING_PLATFORMS: PlatformCard[] = [
  {
    icon: PlayCircle,
    name: "YouTube",
    courses: "1,200+ curated",
    tracks: "All tracks",
    note: "Free. Vetted playlist library per skill — no tutorial-hopping.",
  },
  {
    icon: GraduationCap,
    name: "Udemy",
    courses: "480 curated",
    tracks: "Frontend · Backend · Mobile",
    note: "Paid. Lifetime access; reimbursed on capstone pass.",
  },
  {
    icon: Award,
    name: "Coursera",
    courses: "320 curated",
    tracks: "Data · AI/ML · Business",
    note: "Paid. University-grade specialisations from Google, IBM, DeepLearning.AI.",
  },
  {
    icon: BookOpen,
    name: "edX",
    courses: "180 curated",
    tracks: "Data · AI/ML · Cloud",
    note: "Paid. MicroMasters from Harvard, MIT, Berkeley.",
  },
  {
    icon: Code,
    name: "freeCodeCamp",
    courses: "240 curated",
    tracks: "Frontend · Backend · QA",
    note: "Free. Project-based certifications covering full curricula end-to-end.",
  },
  {
    icon: Brain,
    name: "Khan Academy",
    courses: "90 curated",
    tracks: "Maths · Stats · Foundations",
    note: "Free. Foundations for candidates needing maths/stat reinforcement.",
  },
  {
    icon: Laptop,
    name: "Pluralsight",
    courses: "410 curated",
    tracks: "DevOps · Cloud · Backend",
    note: "Paid. Skill IQ assessment gates role paths against peers.",
  },
  {
    icon: Briefcase,
    name: "LinkedIn Learning",
    courses: "260 curated",
    tracks: "Soft skills · Domain",
    note: "Paid. Communication, stakeholder mgmt, business-domain depth.",
  },
];

type CurriculumPhase = {
  weeks: string;
  title: string;
  mode: string;
  detail: string;
  icon: LucideIcon;
  hours: string;
};

const CURRICULUM_PHASES: CurriculumPhase[] = [
  {
    weeks: "Week 1-2",
    title: "Foundations",
    mode: "External courses",
    detail:
      "Curated YouTube / Udemy / Coursera ramp for the role track. Mentor reviews progress daily and unblocks concept gaps.",
    icon: PlayCircle,
    hours: "~30 hrs",
  },
  {
    weeks: "Week 3-4",
    title: "Guided projects",
    mode: "STIOOS mentorship",
    detail:
      "Mentor-led pair work on a sandbox repo. First PRs, first code review, first sprint cadence — supervised end-to-end.",
    icon: GraduationCap,
    hours: "~50 hrs",
  },
  {
    weeks: "Week 5-8",
    title: "Real client work",
    mode: "Shadow + contribute",
    detail:
      "Candidates join a client-shaped project squad, shadow seniors, then take ownership of small tickets, code reviews and standups.",
    icon: Briefcase,
    hours: "~120 hrs",
  },
  {
    weeks: "Week 9-12",
    title: "Advanced patterns + capstone",
    mode: "Production-grade",
    detail:
      "Architecture, CI/CD, observability, incident drills and a capstone shipped to a production-shaped repo, reviewed by mentor + client SME.",
    icon: Rocket,
    hours: "~140 hrs",
  },
];

type CultureCard = {
  icon: LucideIcon;
  title: string;
  cadence: string;
  detail: string;
};

const CULTURE_CARDS: CultureCard[] = [
  {
    icon: Calendar,
    title: "Daily standups",
    cadence: "15 min · 9:00 AM",
    detail:
      "Yesterday, today, blockers. The exact format every engineering team on the planet uses.",
  },
  {
    icon: GitBranch,
    title: "Code reviews (PR workflow)",
    cadence: "Per PR",
    detail:
      "Open a PR, request reviewers, address comments, merge. Candidates submit and review PRs from week 3 onwards.",
  },
  {
    icon: ClipboardCheck,
    title: "Jira / ticket management",
    cadence: "Continuous",
    detail:
      "Every task is a ticket. Story points, acceptance criteria, status transitions — full backlog-to-done workflow.",
  },
  {
    icon: Code,
    title: "Git collaboration",
    cadence: "Per change",
    detail:
      "Branch from main, commit in logical chunks, rebase before merge, resolve conflicts, never force-push shared branches.",
  },
  {
    icon: MessageSquare,
    title: "Slack / Teams comms",
    cadence: "All day",
    detail:
      "Async channel updates, threads for context, DMs for sensitive topics, status emoji, working-hours respect.",
  },
  {
    icon: Clock,
    title: "Sprint cadence",
    cadence: "2-week sprints",
    detail:
      "Sprint planning, mid-sprint check-in, sprint review, retro. The same loop every engineering team runs.",
  },
  {
    icon: Target,
    title: "Deadline ownership",
    cadence: "Per milestone",
    detail:
      "Candidates own their deadlines, communicate slips early, and ship what they committed to or renegotiate before the slip.",
  },
  {
    icon: Users,
    title: "Stakeholder updates",
    cadence: "Weekly",
    detail:
      "Friday status notes to the project owner: progress, risks, asks. Written in plain English for non-technical readers.",
  },
];

type ExecutionStep = {
  icon: LucideIcon;
  step: string;
  title: string;
  detail: string;
  position: string; // tailwind positioning classes
};

const EXECUTION_LOOP: ExecutionStep[] = [
  {
    icon: BookOpen,
    step: "1",
    title: "Learn",
    detail:
      "Pick up a concept from a curated external course — watched with intent, not passively.",
    position: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
  },
  {
    icon: Zap,
    step: "2",
    title: "Apply",
    detail:
      "Apply the concept immediately to a real ticket on a real repo. No toy exercises.",
    position: "left-full top-1/2 -translate-x-1/2 -translate-y-1/2",
  },
  {
    icon: ClipboardCheck,
    step: "3",
    title: "Review",
    detail:
      "Mentor + peer code review. Feedback is specific, actionable and tied to a standard.",
    position: "left-1/2 top-full -translate-x-1/2 -translate-y-1/2",
  },
  {
    icon: Rocket,
    step: "4",
    title: "Ship",
    detail:
      "Merge to a production-shaped repo. The change goes live in staging or production.",
    position: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  },
];

type DayEntry = {
  time: string;
  title: string;
  detail: string;
  icon: LucideIcon;
};

const DAY_TIMELINE: DayEntry[] = [
  {
    time: "9:00 AM",
    title: "Standup",
    detail:
      "15-min sync with the project squad. Yesterday, today, blockers. Notes posted to Slack.",
    icon: Calendar,
  },
  {
    time: "10:00 AM",
    title: "Focused work block",
    detail:
      "Deep work on the day's ticket — coding, debugging, writing tests. Notifications muted.",
    icon: Laptop,
  },
  {
    time: "12:00 PM",
    title: "Lunch + peer learning",
    detail:
      "Lunch with the cohort. Once a week, a peer presents a tech talk or a recent PR walkthrough.",
    icon: Users,
  },
  {
    time: "1:00 PM",
    title: "Mentor pairing",
    detail:
      "30-min pairing session with the assigned mentor. Pair on a hard problem or review a design.",
    icon: Brain,
  },
  {
    time: "3:00 PM",
    title: "Code review + PR",
    detail:
      "Open a PR for the morning's work, address comments on yesterday's PRs, review a peer's PR.",
    icon: GitBranch,
  },
  {
    time: "5:00 PM",
    title: "EOD update",
    detail:
      "Post the end-of-day update in Slack: what shipped, what's in flight, what's blocked.",
    icon: MessageSquare,
  },
  {
    time: "Evening",
    title: "External course (1 hour)",
    detail:
      "One hour on a curated external course — the concept picked up today feeds tomorrow's ticket.",
    icon: PlayCircle,
  },
];

type AdvancedCard = {
  icon: LucideIcon;
  title: string;
  detail: string;
};

const ADVANCED_PATTERNS: AdvancedCard[] = [
  {
    icon: Building2,
    title: "Production-grade architecture",
    detail:
      "Microservices boundaries, event-driven design, API contracts, database sharding, caching tiers. Not just 'build a CRUD app'.",
  },
  {
    icon: Rocket,
    title: "CI/CD pipelines",
    detail:
      "GitHub Actions and Jenkins pipelines — build, test, scan, deploy. Candidates write and maintain the pipeline, not just use it.",
  },
  {
    icon: TrendingUp,
    title: "Observability",
    detail:
      "Datadog, Sentry and Grafana. Logs, metrics, traces, dashboards, alerts. Candidates know what to look at when something breaks.",
  },
  {
    icon: ShieldCheck,
    title: "Incident response",
    detail:
      "On-call rotation, severity levels, incident commander role, postmortem culture, blameless retros, action items with owners.",
  },
  {
    icon: Users,
    title: "Stakeholder management",
    detail:
      "Translating technical risk into business impact, negotiating scope, writing status notes non-technical readers can act on.",
  },
  {
    icon: Briefcase,
    title: "Business domain depth",
    detail:
      "Fintech, healthcare, e-commerce, logistics — candidates learn the domain vocabulary, the regulations and the money flows.",
  },
  {
    icon: Lock,
    title: "Security & compliance",
    detail:
      "OWASP top 10, secrets management, PCI/DSS, HIPAA, GDPR, SOC2. Security is a habit, not a checkbox at the end.",
  },
  {
    icon: Zap,
    title: "Performance optimization",
    detail:
      "Profiling, flame graphs, N+1 queries, cold-start budgets, Lighthouse scores, bundle-size budgets, real-user monitoring.",
  },
];

type MentorTier = {
  role: string;
  ratio: string;
  detail: string;
  icon: LucideIcon;
};

const MENTOR_TIERS: MentorTier[] = [
  {
    role: "Senior mentor",
    ratio: "1 : 10",
    detail:
      "Staff / principal-level engineer who owns the cohort's technical direction, capstone review and conversion sign-off.",
    icon: Star,
  },
  {
    role: "Peer mentor",
    ratio: "1 : 3",
    detail:
      "Mid-level engineer two steps ahead of the candidate. Pair-programming partner, code-reviewer, daily unblocker.",
    icon: Users,
  },
  {
    role: "Buddy",
    ratio: "1 : 1",
    detail:
      "A peer from the same cohort. First point of contact for 'how do I...' questions, lunch partner, accountability buddy.",
    icon: Handshake,
  },
];

type MentorCadence = {
  cadence: string;
  title: string;
  detail: string;
  icon: LucideIcon;
};

const MENTOR_CADENCE: MentorCadence[] = [
  {
    cadence: "Weekly",
    title: "1:1 with mentor",
    detail:
      "30-min structured 1:1. Progress against goals, blockers, career direction, wellbeing check.",
    icon: Calendar,
  },
  {
    cadence: "Bi-weekly",
    title: "Performance review",
    detail:
      "Formal review against KPIs — delivery, quality, collaboration, growth. Written feedback shared.",
    icon: ClipboardCheck,
  },
  {
    cadence: "Monthly",
    title: "Career growth conversation",
    detail:
      "Where do you want to be in 12 months? Skills gaps, next role, stretch projects, mentor roadmap.",
    icon: TrendingUp,
  },
];

type SkillTrack = {
  track: string;
  icon: LucideIcon;
  foundation: string;
  intermediate: string;
  advanced: string;
  production: string;
};

const SKILL_TRACK_MATRIX: SkillTrack[] = [
  {
    track: "Frontend",
    icon: Code,
    foundation: "40 hrs · 2 proj",
    intermediate: "60 hrs · 4 proj",
    advanced: "80 hrs · 6 proj",
    production: "120 hrs · 8 proj",
  },
  {
    track: "Backend",
    icon: Server,
    foundation: "50 hrs · 2 proj",
    intermediate: "70 hrs · 4 proj",
    advanced: "90 hrs · 6 proj",
    production: "140 hrs · 8 proj",
  },
  {
    track: "DevOps",
    icon: Rocket,
    foundation: "30 hrs · 1 proj",
    intermediate: "60 hrs · 3 proj",
    advanced: "100 hrs · 5 proj",
    production: "150 hrs · 7 proj",
  },
  {
    track: "Data",
    icon: TrendingUp,
    foundation: "40 hrs · 2 proj",
    intermediate: "70 hrs · 4 proj",
    advanced: "100 hrs · 6 proj",
    production: "130 hrs · 8 proj",
  },
  {
    track: "AI / ML",
    icon: Brain,
    foundation: "50 hrs · 2 proj",
    intermediate: "90 hrs · 4 proj",
    advanced: "120 hrs · 6 proj",
    production: "180 hrs · 8 proj",
  },
  {
    track: "QA",
    icon: ShieldCheck,
    foundation: "30 hrs · 2 proj",
    intermediate: "50 hrs · 4 proj",
    advanced: "70 hrs · 6 proj",
    production: "100 hrs · 8 proj",
  },
  {
    track: "Mobile",
    icon: Laptop,
    foundation: "40 hrs · 2 proj",
    intermediate: "70 hrs · 4 proj",
    advanced: "100 hrs · 6 proj",
    production: "150 hrs · 8 proj",
  },
];

const MATRIX_LEVELS = [
  "Foundation",
  "Intermediate",
  "Advanced",
  "Production-ready",
] as const;

// cell color intensity per column index (0..3) — darker = more advanced
const MATRIX_CELL_TONES = [
  "bg-amber-400/[0.04] text-slate-300 ring-amber-400/10",
  "bg-amber-400/[0.08] text-slate-200 ring-amber-400/15",
  "bg-amber-400/[0.14] text-white ring-amber-400/25",
  "bg-amber-400/[0.22] text-white ring-amber-400/40",
] as const;

type GraduationCriterion = {
  icon: LucideIcon;
  label: string;
  value: string;
  target: string;
  progress: number;
  detail: string;
};

const GRADUATION_CRITERIA: GraduationCriterion[] = [
  {
    icon: PlayCircle,
    label: "Course completion",
    value: "100%",
    target: "All curated modules",
    progress: 100,
    detail:
      "Every external course module assigned to the role track must be completed with a passing assessment.",
  },
  {
    icon: Briefcase,
    label: "Project delivery",
    value: "3 min",
    target: "Shipped projects",
    progress: 75,
    detail:
      "At least three real projects shipped to a production-shaped repo — one solo, one pair, one capstone.",
  },
  {
    icon: Trophy,
    label: "Capstone score",
    value: "75% min",
    target: "Mentor + client review",
    progress: 75,
    detail:
      "Final capstone scored by mentor and client SME across architecture, delivery, quality and presentation.",
  },
  {
    icon: Star,
    label: "Mentor rating",
    value: "4.0 / 5",
    target: "Composite score",
    progress: 80,
    detail:
      "Mentor composite rating across technical depth, collaboration, ownership and communication.",
  },
  {
    icon: Calendar,
    label: "Attendance",
    value: "85% min",
    target: "Daily check-in",
    progress: 85,
    detail:
      "Biometric + LMS login. Below 85% triggers mentor review and may delay conversion.",
  },
];

function LearningTermsPage() {
  return (
    <main className="min-h-screen bg-brand-ink text-white">
      {/* ============================================================ */}
      {/* 1. HERO                                                       */}
      {/* ============================================================ */}
      <section
        id="learning-hero"
        className="relative scroll-mt-36 overflow-hidden bg-brand-ink"
        aria-label="Learning Terms overview"
      >
        <div
          className="absolute inset-0 surface-grid opacity-50"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 65% at 50% 0%, rgba(245,158,11,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <Link
            href="/talent-solutions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Talent Solutions
          </Link>

          <div className="mt-6 max-w-3xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-2 text-amber-400">
                <span
                  className="inline-block h-px w-6 bg-amber-400/60"
                  aria-hidden="true"
                />
                For Employers &amp; Candidates
                <span
                  className="inline-block h-px w-6 bg-amber-400/60"
                  aria-hidden="true"
                />
              </p>
            </Reveal>
            <Reveal delay={0.05} as="h1">
              <span className="mt-5 block text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                Learning Terms
              </span>
            </Reveal>
            <Reveal delay={0.1} as="p">
              <span className="mt-6 block max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                STIOOS candidates do not just earn course certificates. They
                learn foundations on the world&apos;s best external platforms,
                then execute real work on real client-shaped projects with
                real company culture — standups, code reviews, sprints and
                on-call. By graduation, they arrive already knowing how a
                real company operates.
              </span>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
                {LEARNING_HERO_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-brand-navy p-5"
                  >
                    <stat.icon
                      className="h-5 w-5 text-amber-400"
                      aria-hidden="true"
                    />
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      {stat.value}
                    </dd>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                      {stat.detail}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. LEARNING PHILOSOPHY INFOGRAPHIC (PYRAMID)                 */}
      {/* ============================================================ */}
      <section
        id="learning-philosophy"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Learning philosophy pyramid"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">How we layer learning</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                The 3-layer learning model
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                A course certificate proves you watched videos. Job-readiness
                proves you shipped real work. STIOOS layers both, then adds
                the advanced patterns companies actually use in production —
                so candidates arrive fluent in how a real engineering team
                operates.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
            {/* Pyramid visual */}
            <Reveal>
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-brand-ink p-6 sm:p-8">
                {PYRAMID_LAYERS.map((layer) => (
                  <div
                    key={layer.tier}
                    className="relative flex items-center justify-center"
                    style={{ width: `${layer.widthPct}%` }}
                  >
                    <div className="relative flex w-full items-center gap-3 rounded-lg bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent px-4 py-4 ring-1 ring-amber-400/25">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-400/15 ring-1 ring-amber-400/30">
                        <layer.icon
                          className="h-4 w-4 text-amber-400"
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                          {layer.tier}
                        </p>
                        <p className="truncate text-xs font-semibold text-white sm:text-sm">
                          {layer.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="mt-4 max-w-sm text-center text-[11px] leading-relaxed text-slate-400">
                  Base = broad foundations · Apex = deep, company-grade
                  mastery. Each layer is gated before the next unlocks.
                </p>
              </div>
            </Reveal>

            {/* Layer descriptions */}
            <div className="flex flex-col gap-4">
              {PYRAMID_LAYERS.map((layer, idx) => (
                <Reveal key={layer.tier} delay={0.05 * idx}>
                  <article className="rounded-2xl border border-white/10 bg-brand-ink p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                        <layer.icon
                          className="h-5 w-5 text-amber-400"
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                          {layer.tier}
                        </p>
                        <h3 className="mt-0.5 text-base font-semibold text-white">
                          {layer.title}
                        </h3>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                          {layer.sources}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-slate-300">
                          {layer.detail}
                        </p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. EXTERNAL LEARNING PLATFORMS GRID                          */}
      {/* ============================================================ */}
      <section
        id="learning-platforms"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="External learning platforms"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">
                Curated, not catalogued
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                External learning platforms
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                STIOOS does not reinvent courseware. We curate the best of
                what the world already teaches — eight platforms, each with a
                hand-picked set of courses per role track. Candidates get the
                right course on the right skill at the right week.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {LEARNING_PLATFORMS.map((p) => (
                <article
                  key={p.name}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-brand-navy p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                    <p.icon
                      className="h-5 w-5 text-amber-400"
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-amber-400">
                    {p.courses}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {p.tracks}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {p.note}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CURATED CURRICULUM TRACK TIMELINE                         */}
      {/* ============================================================ */}
      <section
        id="curriculum-track"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Curated curriculum track"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">A sample 12-week ramp</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Curated curriculum track
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Four phases over twelve weeks. Foundations from external
                courses in weeks 1-2, guided STIOOS projects in weeks 3-4,
                real client work in weeks 5-8, and advanced company patterns
                plus a production-grade capstone in weeks 9-12.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto pb-4">
              <ol className="flex min-w-[820px] items-stretch justify-between gap-2">
                {CURRICULUM_PHASES.map((phase, idx) => (
                  <li key={phase.weeks} className="flex items-stretch gap-2">
                    <article className="relative flex w-56 flex-col rounded-2xl border border-white/10 bg-brand-ink p-5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 ring-1 ring-white/20">
                          <phase.icon
                            className="h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                            Phase {idx + 1}
                          </p>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                            {phase.hours}
                          </p>
                        </div>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold text-white">
                        {phase.weeks}
                      </h3>
                      <p className="mt-0.5 text-base font-bold text-white">
                        {phase.title}
                      </p>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-amber-400">
                        {phase.mode}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">
                        {phase.detail}
                      </p>
                    </article>
                    {idx < CURRICULUM_PHASES.length - 1 && (
                      <div
                        className="flex items-center px-1"
                        aria-hidden="true"
                      >
                        <ArrowRight className="h-5 w-5 text-amber-400" />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              {CURRICULUM_PHASES.map((phase) => (
                <div
                  key={phase.weeks}
                  className="rounded-xl border border-white/10 bg-brand-ink p-4 text-center"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                    {phase.weeks}
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                    {phase.hours}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {phase.title}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. REAL-WORLD WORKING CULTURE GRID                           */}
      {/* ============================================================ */}
      <section
        id="working-culture"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Real-world working culture"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">
                More than course content
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Real-world working culture
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Candidates learn the rituals every engineering team runs —
                standups, PR reviews, Jira workflow, Git collaboration, async
                communication, sprint cadence, deadline ownership and
                stakeholder updates. By week 5, these are habits, not theory.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CULTURE_CARDS.map((card) => (
                <article
                  key={card.title}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-brand-navy p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                      <card.icon
                        className="h-5 w-5 text-amber-400"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-400/25">
                      {card.cadence}
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {card.detail}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. EXECUTION FRAMEWORK (CIRCULAR FLOWCHART)                  */}
      {/* ============================================================ */}
      <section
        id="execution-framework"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Execution framework loop"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Learn by doing</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                The Learn &rarr; Apply &rarr; Review &rarr; Ship loop
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Every concept a candidate picks up goes through the same
                four-step loop — learn it from a curated course, apply it to a
                real ticket, review it with mentor and peers, then ship it to
                a production-shaped repo. Watching a video is step one of
                four, not the whole job.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-white/10 bg-brand-ink p-6 sm:p-10">
              {/* Circular flowchart */}
              <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80">
                {/* center hub */}
                <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-center shadow-xl shadow-amber-500/30 ring-4 ring-brand-ink sm:h-32 sm:w-32">
                  <Zap
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white sm:text-xs">
                    Execution loop
                  </p>
                </div>

                {/* connecting circle (SVG) */}
                <svg
                  viewBox="0 0 320 320"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <circle
                    cx="160"
                    cy="160"
                    r="130"
                    fill="none"
                    stroke="rgba(245,158,11,0.18)"
                    strokeWidth="2"
                    strokeDasharray="6 8"
                  />
                </svg>

                {/* 4 nodes positioned around the circle */}
                {EXECUTION_LOOP.map((node) => (
                  <div
                    key={node.step}
                    className={`absolute ${node.position}`}
                  >
                    <div className="flex w-32 flex-col items-center text-center sm:w-36">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-400/40 bg-brand-navy ring-1 ring-amber-400/20">
                        <node.icon
                          className="h-5 w-5 text-amber-400"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        Step {node.step}
                      </p>
                      <p className="text-xs font-semibold text-white">
                        {node.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* node descriptions */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {EXECUTION_LOOP.map((node) => (
                  <article
                    key={node.step}
                    className="rounded-xl border border-white/10 bg-brand-navy p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-400/10 ring-1 ring-amber-400/25">
                        <node.icon
                          className="h-4 w-4 text-amber-400"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        {node.step}. {node.title}
                      </p>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                      {node.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. REAL EMPLOYEE EXPERIENCE TIMELINE (VERTICAL)              */}
      {/* ============================================================ */}
      <section
        id="day-in-life"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Real employee day timeline"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Structured like an employee</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                A day in the life of a STIOOS candidate
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                From day one, candidates are treated like real employees —
                workstation, team, manager, KPIs. The day below is the actual
                cadence a candidate follows from week 5 onwards, when they
                join a real client-shaped project squad.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 max-w-3xl">
              <ol className="relative border-l border-white/10 pl-6 sm:pl-8">
                {DAY_TIMELINE.map((entry) => (
                  <li key={entry.time} className="relative pb-8 last:pb-0">
                    {/* node dot */}
                    <span
                      className="absolute -left-[calc(1.5rem+1px)] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 ring-4 ring-brand-ink sm:-left-[calc(2rem+1px)]"
                      aria-hidden="true"
                    >
                      <entry.icon
                        className="h-3.5 w-3.5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                    <article className="rounded-xl border border-white/10 bg-brand-navy p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-white">
                          {entry.title}
                        </h3>
                        <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-400/25">
                          {entry.time}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-slate-400">
                        {entry.detail}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. ADVANCED COMPANY PATTERNS                                 */}
      {/* ============================================================ */}
      <section
        id="advanced-patterns"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Advanced company patterns"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Beyond the basics</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Advanced company-grade patterns
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Most bootcamps stop at CRUD. STIOOS teaches the patterns
                companies actually use on production systems — architecture,
                CI/CD, observability, incident response, stakeholder
                management, business domain depth, security and performance.
                Candidates arrive speaking the same language as your senior
                engineers.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ADVANCED_PATTERNS.map((card) => (
                <article
                  key={card.title}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-brand-ink p-5 transition-all duration-200 hover:-translate-y-1 hover:border-amber-500/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 ring-1 ring-amber-400/25">
                    <card.icon
                      className="h-5 w-5 text-amber-400"
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {card.detail}
                  </p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. MENTORSHIP & REVIEW STRUCTURE (ORG CHART)                 */}
      {/* ============================================================ */}
      <section
        id="mentorship-structure"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Mentorship and review structure"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Never learning alone</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Mentorship &amp; review structure
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Three layers of human support wrap every candidate — a senior
                mentor who owns the cohort, a peer mentor for daily pairing,
                and a buddy for the small stuff. On top of that, a structured
                cadence of 1:1s, performance reviews and career conversations.
              </p>
            </div>
          </Reveal>

          {/* Org chart visual */}
          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-white/10 bg-brand-navy p-6 sm:p-8">
              {/* Top tier: senior mentor */}
              <div className="flex flex-col items-center">
                <div className="w-full max-w-xs rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-500/15 to-transparent p-4 text-center ring-1 ring-amber-400/20">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/15 ring-1 ring-amber-400/30">
                    <Star
                      className="h-5 w-5 text-amber-400"
                      aria-hidden="true"
                    />
                  </span>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Senior mentor
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Ratio 1 : 10
                  </p>
                </div>

                {/* vertical connector */}
                <span
                  className="h-6 w-px bg-white/15"
                  aria-hidden="true"
                />

                {/* horizontal connector to peer mentors */}
                <div
                  className="relative flex w-full max-w-3xl justify-center"
                  aria-hidden="true"
                >
                  <span className="absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-white/15 sm:w-[66%]" />
                </div>
              </div>

              {/* Middle tier: peer mentors */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-xl border border-white/10 bg-brand-ink p-4 text-center"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-400/10 ring-1 ring-amber-400/25">
                      <Users
                        className="h-4 w-4 text-amber-400"
                        aria-hidden="true"
                      />
                    </span>
                    <p className="mt-2 text-xs font-semibold text-white">
                      Peer mentor {i + 1}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      1 : 3 candidates
                    </p>
                  </div>
                ))}
              </div>

              {/* connector down to candidates */}
              <div className="mt-3 flex justify-center" aria-hidden="true">
                <span className="h-6 w-px bg-white/15" />
              </div>

              {/* Bottom tier: candidates + buddies */}
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {["Candidate A", "Candidate B", "Candidate C"].map((c) => (
                  <div
                    key={c}
                    className="rounded-xl border border-white/10 bg-brand-ink p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10">
                        <GraduationCap
                          className="h-4 w-4 text-slate-300"
                          aria-hidden="true"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-white">
                          {c}
                        </p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                          Trainee
                        </p>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 ring-1 ring-emerald-500/25">
                        <Handshake
                          className="h-4 w-4 text-emerald-400"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <p className="mt-2 text-[10px] leading-snug text-slate-400">
                      Paired 1:1 with a buddy from the same cohort.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Mentor tier cards + cadence */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-white/10 bg-brand-navy p-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Users
                    className="h-5 w-5 text-amber-400"
                    aria-hidden="true"
                  />
                  <h3 className="text-base font-semibold text-white">
                    The three mentor tiers
                  </h3>
                </div>
                <ul className="mt-4 space-y-4">
                  {MENTOR_TIERS.map((tier) => (
                    <li
                      key={tier.role}
                      className="flex items-start gap-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                        <tier.icon
                          className="h-4 w-4 text-amber-400"
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">
                            {tier.role}
                          </p>
                          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-400/25">
                            {tier.ratio}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {tier.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-white/10 bg-brand-navy p-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                  <Calendar
                    className="h-5 w-5 text-amber-400"
                    aria-hidden="true"
                  />
                  <h3 className="text-base font-semibold text-white">
                    Review &amp; growth cadence
                  </h3>
                </div>
                <ul className="mt-4 space-y-4">
                  {MENTOR_CADENCE.map((c) => (
                    <li
                      key={c.title}
                      className="flex items-start gap-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                        <c.icon
                          className="h-4 w-4 text-amber-400"
                          aria-hidden="true"
                        />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">
                            {c.title}
                          </p>
                          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 ring-1 ring-amber-400/25">
                            {c.cadence}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {c.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. SKILL TRACK MATRIX                                       */}
      {/* ============================================================ */}
      <section
        id="skill-matrix"
        className="scroll-mt-36 bg-brand-navy py-16 text-white md:py-24"
        aria-label="Skill track depth matrix"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">Depth, by track</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Skill track depth matrix
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Seven role tracks, four depth levels. Each cell shows the
                total curated course hours plus the project count required to
                clear that depth band. Colour intensity rises with depth —
                lighter for foundations, deeper amber for production-ready.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[760px] overflow-hidden rounded-2xl border border-white/10 bg-brand-ink text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th
                      scope="col"
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-amber-400"
                    >
                      Skill track
                    </th>
                    {MATRIX_LEVELS.map((lvl) => (
                      <th
                        key={lvl}
                        scope="col"
                        className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-amber-400"
                      >
                        {lvl}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {SKILL_TRACK_MATRIX.map((row) => (
                    <tr
                      key={row.track}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                            <row.icon
                              className="h-4 w-4 text-amber-400"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="font-semibold text-white">
                            {row.track}
                          </span>
                        </div>
                      </td>
                      {[row.foundation, row.intermediate, row.advanced, row.production].map(
                        (cell, idx) => (
                          <td
                            key={idx}
                            className="px-5 py-4 align-middle"
                          >
                            <div
                              className={`rounded-lg px-3 py-2 text-xs font-semibold ring-1 ${MATRIX_CELL_TONES[idx]}`}
                            >
                              {cell}
                            </div>
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Depth legend:
              </span>
              {MATRIX_LEVELS.map((lvl, idx) => (
                <span
                  key={lvl}
                  className="flex items-center gap-2"
                >
                  <span
                    className={`h-3 w-3 rounded ring-1 ${MATRIX_CELL_TONES[idx]}`}
                    aria-hidden="true"
                  />
                  {lvl}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. CERTIFICATION & GRADUATION CRITERIA                      */}
      {/* ============================================================ */}
      <section
        id="graduation-criteria"
        className="scroll-mt-36 bg-brand-ink py-16 text-white md:py-24"
        aria-label="Certification and graduation criteria"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-amber-400">What it takes to graduate</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Certification &amp; graduation criteria
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Graduation is not attendance-based. Five hard gates must be
                cleared before a candidate receives the STIOOS role
                certificate and is recommended for conversion. Every gate is
                tracked weekly on the candidate dashboard.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* The first 4 cards form a 2x2 / 3-col grid; the 5th spans */}
              {GRADUATION_CRITERIA.slice(0, 4).map((metric) => (
                <article
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-brand-navy p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                      <metric.icon
                        className="h-5 w-5 text-amber-400"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                        {metric.target}
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {metric.label}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold tracking-tight text-white">
                    {metric.value}
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      <span>Threshold</span>
                      <span className="text-amber-400">
                        {metric.progress}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                        style={{ width: `${metric.progress}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {metric.detail}
                  </p>
                </article>
              ))}

              {/* Attendance card — spans full width on lg */}
              {(() => {
                const metric = GRADUATION_CRITERIA[4];
                return (
                  <article className="rounded-2xl border border-white/10 bg-brand-navy p-6 sm:col-span-2 lg:col-span-3">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-amber-400/25">
                          <metric.icon
                            className="h-5 w-5 text-amber-400"
                            aria-hidden="true"
                          />
                        </span>
                        <div className="max-w-md">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                            {metric.target}
                          </p>
                          <p className="text-sm font-semibold text-white">
                            {metric.label}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-slate-400">
                            {metric.detail}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full max-w-xs flex-col items-start sm:items-end">
                        <p className="text-3xl font-bold tracking-tight text-white">
                          {metric.value}
                        </p>
                        <div className="mt-3 w-full">
                          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wider text-slate-400">
                            <span>Threshold</span>
                            <span className="text-amber-400">
                              {metric.progress}%
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                              style={{ width: `${metric.progress}%` }}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })()}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-6 text-center sm:flex-row sm:justify-center sm:text-left">
              <Trophy
                className="h-6 w-6 shrink-0 text-emerald-400"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-slate-300">
                <strong className="text-white">On clearing all five gates:</strong>{" "}
                candidate receives the STIOOS role certificate, is endorsed by
                partner employers, and is recommended for conversion to
                full-time hire within 60 days.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 12. CTA BAND                                                  */}
      {/* ============================================================ */}
      <section
        id="learning-cta"
        className="scroll-mt-36 border-t border-white/[0.06] bg-brand-ink py-16 text-white md:py-24"
        aria-label="Get in touch"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.12] via-brand-navy to-brand-navy px-6 py-14 text-center md:px-12 md:py-16">
              <div
                className="absolute inset-0 surface-grid opacity-40"
                aria-hidden="true"
              />
              <div
                className="absolute left-1/2 top-0 h-56 w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto max-w-2xl">
                <p className="eyebrow text-amber-400">
                  From learner to employee
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  See how we turn learners into employees
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-300">
                  Book a learning audit and we&apos;ll walk you through a real
                candidate&apos;s 12-week journey — the curated courses, the
                shipped projects, the mentor reviews, the capstone. Or
                  download a curriculum sample for any of the seven skill
                  tracks.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 bg-amber-500 px-8 text-base font-semibold text-brand-ink hover:bg-amber-400"
                  >
                    <Link href="/contact">
                      <Calendar
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      Book a learning audit
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-12 border-white/25 bg-transparent px-8 text-base font-medium text-white hover:bg-white/10"
                  >
                    <Link href="/contact">
                      <Download
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      Download curriculum sample
                    </Link>
                  </Button>
                </div>
                <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <TrendingUp
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    94% job-readiness score
                  </li>
                  <li className="flex items-center gap-1.5">
                    <BookOpen
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    200+ curated skill tracks
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Clock
                      className="h-3.5 w-3.5 text-amber-400"
                      aria-hidden="true"
                    />
                    12-week average programmes
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
