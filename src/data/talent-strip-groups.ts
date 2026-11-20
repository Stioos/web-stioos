import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers,
  Rocket,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

// ============================================================
// TALENT STRIP GROUPS — 3 candidate-side options shown in the
// Talent Solutions secondary header:
//
//   • Get Trained   (3 sub-pages)
//   • Get Placed    (3 sub-pages)
//   • Get Certified (3 sub-pages)
//
// Each group has its own dropdown (TalentVerticalFlyout) that
// opens on hover and lists the 3 candidate-focused sub-pages.
// The 9 sub-pages live at:
//   /talent-solutions/<group-slug>/<sub-slug>
//
// The employer-side groups (Build Talent, Hire Talent, Scale
// Workforce) have been REMOVED per user request — the header
// now shows only candidate-side options + Joining Terms +
// Learning Terms.
//
// No divider/segmentation lines between groups — the header
// is a standard flat strip of pills.
// ============================================================

export type TalentGroupSide = "candidate" | "employer";

export interface TalentSubPage {
  /** URL slug — /talent-solutions/<group-slug>/<slug> */
  slug: string;
  /** display title (SEO/AEO-optimized, two-line) */
  title: string;
  /** short label shown in the flyout row */
  stripLabel: string;
  /** one-line description for the flyout row */
  description: string;
  /** lucide icon */
  icon: LucideIcon;
}

export interface TalentStripGroup {
  /** URL slug — /talent-solutions/<slug> */
  slug: string;
  /** compact label shown on the strip pill */
  stripLabel: string;
  /** full title shown in the flyout header */
  name: string;
  /** one-line tagline shown under the pill / in the flyout header */
  tagline: string;
  /** which side of the strip this group lives on */
  side: TalentGroupSide;
  /** lucide icon used on the pill */
  icon: LucideIcon;
  /** accent color key — drives pill + flyout color */
  accent: "blue" | "emerald" | "orange";
  /** candidate-focused sub-pages (3 per group) */
  subPages: TalentSubPage[];
}

// ─────────────────────────────────────────────────────────────
// 9 candidate/job-seeker sub-pages (3 per group)
// ─────────────────────────────────────────────────────────────

const GET_TRAINED_SUB_PAGES: TalentSubPage[] = [
  {
    slug: "custom-cohort-curriculum",
    title: "Custom Cohort Curriculum — Learn on Your Exact Stack",
    stripLabel: "Custom Cohort Curriculum",
    description:
      "Co-designed curriculum built around your target role — your tools, your conventions, your workflows.",
    icon: BookOpen,
  },
  {
    slug: "ai-candidate-screening",
    title: "AI Candidate Screening — Get Matched to the Right Program",
    stripLabel: "AI Screening",
    description:
      "AI-scored aptitude, communication and technical screens that match you to the perfect training program.",
    icon: Target,
  },
  {
    slug: "training-sprint-delivery",
    title: "Training Sprint Delivery — Learn by Building Real Projects",
    stripLabel: "Training Sprints",
    description:
      "Mentor-led sprints with weekly checkpoints, real client-shaped projects, and job-ready capstones.",
    icon: Rocket,
  },
];

const GET_PLACED_SUB_PAGES: TalentSubPage[] = [
  {
    slug: "browse-open-roles",
    title: "Browse Open Roles — Explore Live Jobs Across AI, Tech & Business",
    stripLabel: "Browse Open Roles",
    description:
      "AI-matched live openings across 500+ employers — filter by role, stack, location, and salary.",
    icon: Briefcase,
  },
  {
    slug: "interview-preparation",
    title: "Interview Preparation — Master Interviews with AI Coaching",
    stripLabel: "Interview Prep",
    description:
      "AI-powered mock interviews, real-time feedback, and company-specific interview playbooks.",
    icon: Users,
  },
  {
    slug: "offer-onboarding",
    title: "Offer & Onboarding — From Offer Letter to Day One",
    stripLabel: "Offer & Onboarding",
    description:
      "Offer negotiation guidance, document support, and a guided onboarding plan for your first 90 days.",
    icon: FileText,
  },
];

const GET_CERTIFIED_SUB_PAGES: TalentSubPage[] = [
  {
    slug: "skills-assessment",
    title: "Skills Assessment — Validate Your Skills with AI-Powered Scoring",
    stripLabel: "Skills Assessment",
    description:
      "AI-scored assessments across 200+ skill tracks — get a verified competency profile employers trust.",
    icon: ClipboardCheck,
  },
  {
    slug: "industry-certifications",
    title: "Industry Certifications — Earn Recognized Credentials",
    stripLabel: "Industry Certifications",
    description:
      "Earn industry-recognized certifications in AI, cloud, data, full-stack, and more — included in your program.",
    icon: Award,
  },
  {
    slug: "career-portfolio",
    title: "Career Portfolio — Build a Real-World Project Portfolio",
    stripLabel: "Career Portfolio",
    description:
      "Build a portfolio of real client-shaped projects that prove you can deliver from day one.",
    icon: TrendingUp,
  },
];

// ─────────────────────────────────────────────────────────────
// Employer-side sub-pages (3 per group × 3 groups = 9)
// ─────────────────────────────────────────────────────────────

const BUILD_TALENT_SUB_PAGES: TalentSubPage[] = [
  {
    slug: "train-to-hire-cohorts",
    title: "Train to Hire Cohorts — Build Your Talent Pipeline",
    stripLabel: "Train to Hire Cohorts",
    description:
      "Custom training cohorts built around your stack — graduate job-ready professionals who join your team.",
    icon: GraduationCap,
  },
  {
    slug: "hire-to-train-programs",
    title: "Hire to Train Programs — Upskill New Hires on Your Stack",
    stripLabel: "Hire to Train",
    description:
      "Hire promising candidates and we train them to your exact role requirements — ramped in weeks, not months.",
    icon: UserCheck,
  },
  {
    slug: "corporate-training-programs",
    title: "Corporate Training Programs — Upskill Your Workforce at Scale",
    stripLabel: "Corporate Training",
    description:
      "Custom corporate training programs designed to upskill your teams across AI, cloud, data, and full-stack.",
    icon: Award,
  },
];

const HIRE_TALENT_SUB_PAGES: TalentSubPage[] = [
  {
    slug: "staffing-solutions",
    title: "Staffing Solutions — Flexible Contract and Permanent Hiring",
    stripLabel: "Staffing Solutions",
    description:
      "Flexible staffing models — contract, permanent, or project-based — from a 2M+ pre-vetted talent pool.",
    icon: Briefcase,
  },
  {
    slug: "talent-sourcing-recruitment",
    title: "Talent Sourcing & Recruitment — AI-Powered Candidate Matching",
    stripLabel: "Talent Sourcing",
    description:
      "AI-powered talent sourcing from 2M+ candidates — shortlists delivered within 48 hours.",
    icon: Target,
  },
  {
    slug: "talent-deployment",
    title: "Talent Deployment — On-Demand Teams and Pod Staffing",
    stripLabel: "Talent Deployment",
    description:
      "Deploy pre-vetted talent pods on demand — contract, project-based, or dedicated team engagement.",
    icon: Layers,
  },
];

const SCALE_WORKFORCE_SUB_PAGES: TalentSubPage[] = [
  {
    slug: "workforce-management",
    title: "Workforce Management — End-to-End Talent Operations",
    stripLabel: "Workforce Management",
    description:
      "Complete workforce management from hiring to retention — one partner throughout the lifecycle.",
    icon: Users,
  },
  {
    slug: "talent-assessment-programs",
    title: "Talent Assessment Programs — AI-Powered Skills Evaluation",
    stripLabel: "Talent Assessment",
    description:
      "AI-powered assessments to evaluate technical skills, aptitude, and job readiness at scale.",
    icon: ClipboardCheck,
  },
  {
    slug: "placement-services",
    title: "Placement Services — Connect Trained Talent with Top Employers",
    stripLabel: "Placement Services",
    description:
      "Dedicated placement cell connecting your trained talent with hiring employers across industries.",
    icon: TrendingUp,
  },
];

// ─────────────────────────────────────────────────────────────
// 3 candidate-side groups + 3 employer-side groups
// ─────────────────────────────────────────────────────────────

const CANDIDATE_GROUPS: TalentStripGroup[] = [
  {
    slug: "get-trained",
    stripLabel: "Get Trained",
    name: "Get Trained",
    tagline: "Learn on your stack, get hired while you train",
    side: "candidate",
    icon: GraduationCap,
    accent: "blue",
    subPages: GET_TRAINED_SUB_PAGES,
  },
  {
    slug: "get-placed",
    stripLabel: "Get Placed",
    name: "Get Placed",
    tagline: "Browse live roles and get matched with hiring employers",
    side: "candidate",
    icon: Briefcase,
    accent: "blue",
    subPages: GET_PLACED_SUB_PAGES,
  },
  {
    slug: "get-certified",
    stripLabel: "Get Certified",
    name: "Get Certified",
    tagline: "Validate your skills with AI-scored assessments",
    side: "candidate",
    icon: Award,
    accent: "blue",
    subPages: GET_CERTIFIED_SUB_PAGES,
  },
];

const EMPLOYER_GROUPS: TalentStripGroup[] = [
  {
    slug: "build-talent",
    stripLabel: "Build Talent",
    name: "Build Talent",
    tagline: "Train cohorts on your stack — pipeline, not lottery",
    side: "employer",
    icon: Users,
    accent: "emerald",
    subPages: BUILD_TALENT_SUB_PAGES,
  },
  {
    slug: "hire-talent",
    stripLabel: "Hire Talent",
    name: "Hire Talent",
    tagline: "Tap a 2M+ pre-vetted pool — shortlists in 48 hours",
    side: "employer",
    icon: UserCheck,
    accent: "emerald",
    subPages: HIRE_TALENT_SUB_PAGES,
  },
  {
    slug: "scale-workforce",
    stripLabel: "Scale Workforce",
    name: "Scale Workforce",
    tagline: "End-to-end workforce strategy, assessment and bench",
    side: "employer",
    icon: TrendingUp,
    accent: "emerald",
    subPages: SCALE_WORKFORCE_SUB_PAGES,
  },
];

export const TALENT_STRIP_GROUPS: TalentStripGroup[] = [
  ...CANDIDATE_GROUPS,
  ...EMPLOYER_GROUPS,
];
export const CANDIDATE_STRIP_GROUPS = CANDIDATE_GROUPS;
export const EMPLOYER_STRIP_GROUPS = EMPLOYER_GROUPS;

export function getTalentStripGroup(
  slug: string
): TalentStripGroup | undefined {
  return TALENT_STRIP_GROUPS.find((g) => g.slug === slug);
}

// Convenience for sitemap / generateStaticParams
export const TALENT_GROUP_SLUGS: string[] = TALENT_STRIP_GROUPS.map(
  (g) => g.slug
);

// All 9 sub-page slugs grouped by parent — used by generateStaticParams
export const TALENT_SUB_PAGE_SLUGS: Record<string, string[]> = Object.fromEntries(
  TALENT_STRIP_GROUPS.map((g) => [
    g.slug,
    g.subPages.map((s) => s.slug),
  ])
);
