import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Code,
  FileText,
  Laptop,
  Wallet,
} from "lucide-react";
import type { TalentStripGroup } from "@/data/talent-strip-groups";

// ============================================================
// TALENT INFO PAGES — two informational GROUPS surfaced as pills
// in the Talent Solutions secondary header:
//
//   • Joining Terms — how candidates join a program (eligibility,
//     process, contracts, stipends, convert-to-hire terms).
//   • Learning Terms — what the learning experience looks like
//     (curriculum structure, schedule, assessments, certification,
//     mentorship, graduation criteria).
//
// Both info pills now use the SAME TalentStripGroup interface as
// the 6 group pills (Get Trained, Build Talent, etc.) so they
// share the same dropdown behaviour in the secondary header —
// each opens a TalentVerticalFlyout listing its 3 sub-pages.
//
// The two main info pages + 6 sub-pages all render via the same
// <TalentGroupPage> component (12-section landing) used by the
// 6 group pages — content lives in
//   src/data/pages/talent-group-page-content.ts
// keyed by slug (e.g. "joining-terms", "joining-terms/curriculum").
// ============================================================

export const TALENT_INFO_PAGES: TalentStripGroup[] = [
  {
    slug: "joining-terms",
    stripLabel: "Joining Terms",
    name: "Joining Terms",
    tagline:
      "Eligibility, process and conversion terms for candidates joining a program",
    side: "candidate",
    icon: FileText,
    accent: "orange",
    subPages: [
      {
        slug: "curriculum",
        title:
          "Joining Curriculum — What You'll Learn During Onboarding",
        stripLabel: "Curriculum",
        description:
          "Training curriculum, modules, weekly schedule, assessments and the capstone project you ship during onboarding.",
        icon: BookOpen,
      },
      {
        slug: "pricing",
        title: "Joining Pricing — Fees, Stipends, and Payment Terms",
        stripLabel: "Pricing",
        description:
          "Fee structure, stipend schedule, payment plans, refund policy and the no-upfront-cost model that funds every cohort.",
        icon: Wallet,
      },
      {
        slug: "agreement",
        title:
          "Joining Agreement — Contract Terms and Conversion Path",
        stripLabel: "Agreement",
        description:
          "Service agreement, training bond, conversion-to-hire terms, termination clauses and the full contract framework.",
        icon: FileText,
      },
    ],
  },
  {
    slug: "learning-terms",
    stripLabel: "Learning Terms",
    name: "Learning Terms",
    tagline: "Curriculum structure, schedule, assessments and certification",
    side: "candidate",
    icon: BookOpen,
    accent: "orange",
    subPages: [
      {
        slug: "self-learning",
        title:
          "Self Learning — External Platform Resources and Study Plans",
        stripLabel: "Self Learning",
        description:
          "Curated YouTube, Udemy and Coursera resources, weekly self-study schedules, AI-scored self-assessment and progress tracking.",
        icon: Laptop,
      },
      {
        slug: "curriculum",
        title: "Learning Curriculum — Structured Module Progression",
        stripLabel: "Curriculum",
        description:
          "Module breakdown, weekly schedule, skill tracks, capstone deliverables and the structured progression through 200+ competency areas.",
        icon: BookOpen,
      },
      {
        slug: "projects-development",
        title: "Projects Development — Real-World Project Building",
        stripLabel: "Projects Development",
        description:
          "Project types, tech stack, deliverables, portfolio output and the real-world engineering culture you'll work inside.",
        icon: Code,
      },
    ],
  },
];

/** Back-compat alias — older code reads `getTalentInfoPage(slug)`. */
export function getTalentInfoPage(
  slug: string
): TalentStripGroup | undefined {
  return TALENT_INFO_PAGES.find((p) => p.slug === slug);
}

/** Info-page slug list — used by sitemap & generateStaticParams. */
export const TALENT_INFO_PAGE_SLUGS: string[] = TALENT_INFO_PAGES.map(
  (p) => p.slug
);

/** All info-page × sub-page slug pairs (used by generateStaticParams). */
export const TALENT_INFO_SUB_PAGE_SLUGS: Record<string, string[]> =
  Object.fromEntries(
    TALENT_INFO_PAGES.map((p) => [
      p.slug,
      p.subPages.map((s) => s.slug),
    ])
  );

/** Lucide icon registry for info-page groups + their sub-pages.
 *  Kept here so the [sub] route file can resolve icons without
 *  reaching into the data structure. */
export const TALENT_INFO_GROUP_ICONS: Record<string, LucideIcon> = {
  "joining-terms": FileText,
  "learning-terms": BookOpen,
};

export const TALENT_INFO_SUB_ICONS: Record<string, LucideIcon> = {
  // Joining Terms sub-pages
  curriculum: BookOpen,
  pricing: Wallet,
  agreement: FileText,
  // Learning Terms sub-pages
  "self-learning": Laptop,
  "projects-development": Code,
};
