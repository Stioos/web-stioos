import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  ClipboardCheck,
  Globe,
  GraduationCap,
  Layers,
  MessagesSquare,
  Search,
  TrendingUp,
  UserCheck,
  UserRound,
  Users,
} from "lucide-react";

// ============================================================
// TALENT SOLUTIONS — header mega menu content (3 pillars + engage band)
// ============================================================

export type TalentAccent = "blue" | "emerald" | "orange";

export interface TalentItem {
  name: string;
  /** small capability chip, e.g. "Training + Placement" */
  tag: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export interface TalentColumn {
  title: string;
  accent: TalentAccent;
  items: TalentItem[];
}

export interface TalentEngageItem {
  name: string;
  /** audience chip, e.g. "For Job Seekers" */
  audience: string;
  description: string;
  /** short call-to-action label shown at the card bottom */
  cta: string;
  icon: LucideIcon;
  href: string;
}

export const TALENT_COLUMNS: TalentColumn[] = [
  {
    title: "Talent Development",
    accent: "blue",
    items: [
      {
        name: "Train to Hire",
        tag: "Training + Placement",
        description:
          "Upskill fresh talent through industry-aligned training before they join your team.",
        icon: GraduationCap,
        href: "/talent-solutions/train-to-hire",
      },
      {
        name: "Hire to Train",
        tag: "Hire + Upskill",
        description:
          "Hire promising candidates and we train them to meet your specific role requirements.",
        icon: UserRound,
        href: "/talent-solutions/hire-to-train",
      },
      {
        name: "Corporate Training",
        tag: "Enterprise Training",
        description:
          "Custom corporate training programs designed to upskill your teams at scale.",
        icon: Award,
        href: "/talent-solutions/corporate-training",
      },
    ],
  },
  {
    title: "Workforce Solutions",
    accent: "emerald",
    items: [
      {
        name: "Sourcing Talent Recruitment",
        tag: "Talent Sourcing",
        description:
          "AI-powered talent sourcing from 2M+ candidates. Find the right fit, fast.",
        icon: Search,
        href: "/talent-solutions/talent-recruitment",
      },
      {
        name: "Flexible Talent Deployment",
        tag: "On-Demand Talent",
        description:
          "Deploy talent flexibly — contract, project-based, or on-demand engagement models.",
        icon: Layers,
        href: "/talent-solutions/talent-deployment",
      },
      {
        name: "End-to-End Workforce Solutions",
        tag: "Full Lifecycle",
        description:
          "Complete workforce management from hiring to retention, one partner throughout.",
        icon: Globe,
        href: "/talent-solutions/workforce-solutions",
      },
    ],
  },
  {
    title: "Assessment & Placements",
    accent: "orange",
    items: [
      {
        name: "Talent Assessment",
        tag: "AI Assessment",
        description:
          "AI-powered assessments to evaluate technical skills, aptitude & job readiness.",
        icon: ClipboardCheck,
        href: "/talent-solutions/talent-assessment",
      },
      {
        name: "Staffing Solutions",
        tag: "Flexible Staffing",
        description:
          "Flexible staffing models — contract, permanent, or project-based hiring.",
        icon: Users,
        href: "/talent-solutions/staffing-solutions",
      },
      {
        name: "Placements",
        tag: "Career Placement",
        description:
          "Explore placement opportunities and connect with top employers hiring now.",
        icon: TrendingUp,
        href: "/talent-solutions/placements",
      },
    ],
  },
];

// Engagement band — three dual-audience paths that convert the visitor
// (job seeker) and the employer straight into the funnel.
export const TALENT_ENGAGE: TalentEngageItem[] = [
  {
    name: "Explore Open Roles",
    audience: "For Job Seekers",
    description:
      "Live openings across AI, tech & business — AI-matched to your skills and goals.",
    cta: "Find your role",
    icon: Briefcase,
    href: "/talent-solutions/placements",
  },
  {
    name: "Hire Pre-Vetted Talent",
    audience: "For Employers",
    description:
      "Tap a 2M+ assessed talent pool — shortlists delivered within 48 hours.",
    cta: "Start hiring",
    icon: UserCheck,
    href: "/talent-solutions/staffing-solutions",
  },
  {
    name: "Talk to a Talent Expert",
    audience: "Free Consultation",
    description:
      "One-on-one guidance on your career path or your workforce strategy.",
    cta: "Book a free call",
    icon: MessagesSquare,
    href: "/contact",
  },
];

// ============================================================
// TALENT SECONDARY STRIP — the 9 option pills shown in the
// secondary header ONLY on /talent-solutions* pages. Each pill
// opens a flyout of its 8 sub-pages (see talent-sub-pages.ts).
// ============================================================

export interface TalentStripOption {
  /** option slug — /talent-solutions/<slug> */
  slug: string;
  name: string;
  /** compact label used on the strip pill (fits 9 pills across) */
  stripLabel: string;
  tag: string;
  description: string;
  icon: LucideIcon;
  href: string;
  /** pillar this option belongs to (dropdown header color group) */
  pillar: string;
  accent: TalentAccent;
}

export const TALENT_STRIP_OPTIONS: TalentStripOption[] = TALENT_COLUMNS.flatMap(
  (col) =>
    col.items.map((item) => ({
      slug: item.href.replace("/talent-solutions/", ""),
      name: item.name,
      stripLabel:
        item.name === "Sourcing Talent Recruitment"
          ? "Talent Sourcing"
          : item.name === "Flexible Talent Deployment"
            ? "Talent Deployment"
            : item.name === "End-to-End Workforce Solutions"
              ? "Workforce Solutions"
              : item.name,
      tag: item.tag,
      description: item.description,
      icon: item.icon,
      href: item.href,
      pillar: col.title,
      accent: col.accent,
    }))
);
