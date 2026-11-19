import type { LucideIcon } from "lucide-react";
import { FileText, BookOpen } from "lucide-react";

// ============================================================
// TALENT INFO PAGES — two informational pages surfaced as pills
// in the Talent Solutions secondary header:
//
//   • Joining Terms — how candidates join a program (eligibility,
//     process, contracts, stipends, convert-to-hire terms)
//   • Learning Terms — what the learning experience looks like
//     (curriculum structure, schedule, assessments, certification,
//     mentorship, graduation criteria)
//
// Both render as placeholder pages for now (full content built
// after user confirmation). The data here drives the pill styling,
// the placeholder hero, and the route metadata.
// ============================================================

export interface TalentInfoPage {
  /** URL slug — /talent-solutions/<slug> */
  slug: string;
  /** compact label shown on the strip pill */
  stripLabel: string;
  /** full title shown on the placeholder hero */
  name: string;
  /** one-line tagline shown under the pill / on the hero */
  tagline: string;
  /** lucide icon used on the pill + hero */
  icon: LucideIcon;
  /** accent color key (matches the existing pill accent system) */
  accent: "blue" | "emerald" | "orange";
  /** short description shown on the placeholder */
  description: string;
}

export const TALENT_INFO_PAGES: TalentInfoPage[] = [
  {
    slug: "joining-terms",
    stripLabel: "Joining Terms",
    name: "Joining Terms",
    tagline: "Eligibility, process and conversion terms for candidates joining a program",
    icon: FileText,
    accent: "blue",
    description:
      "How candidates apply, get screened, sign up and convert from trainee to full-time hire — eligibility criteria, stipend structure, contract terms and the conversion path.",
  },
  {
    slug: "learning-terms",
    stripLabel: "Learning Terms",
    name: "Learning Terms",
    tagline: "Curriculum structure, schedule, assessments and certification",
    icon: BookOpen,
    accent: "emerald",
    description:
      "What the learning experience looks like — cohort schedule, curriculum modules, weekly assessments, mentorship, capstone projects and graduation criteria.",
  },
];

export function getTalentInfoPage(slug: string): TalentInfoPage | undefined {
  return TALENT_INFO_PAGES.find((p) => p.slug === slug);
}
