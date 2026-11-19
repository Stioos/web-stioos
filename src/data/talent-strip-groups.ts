import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
  Rocket,
  ClipboardCheck,
  Search,
  Layers,
  Building2,
  Target,
} from "lucide-react";
import { TALENT_STRIP_OPTIONS } from "./talent-solutions";

// ============================================================
// TALENT STRIP GROUPS — 6 horizontal options shown in the
// Talent Solutions secondary header (replaces the 9 individual
// option pills that were getting truncated).
//
// Split into two equal halves:
//   • CANDIDATE-SIDE (3) — what a job seeker wants to do
//   • EMPLOYER-SIDE (3) — what an employer wants to do
//
// Each group maps to one or more of the 9 existing Talent
// Solutions option pages. The vertical flyout that opens on
// hover (right side of the pill) lists those mapped services,
// so visitors can still reach every existing detail page.
//
// The 6 group routes themselves (/talent-solutions/<group-slug>)
// are placeholder pages — full content is built AFTER user
// confirmation. The hover flyout links to the EXISTING service
// detail pages so nothing is broken in the meantime.
// ============================================================

export type TalentGroupSide = "candidate" | "employer";

export interface TalentGroupedService {
  /** slug of the EXISTING talent option — /talent-solutions/<slug> */
  slug: string;
  /** display name (from TALENT_STRIP_OPTIONS) */
  name: string;
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
  /** existing talent services this group exposes */
  services: TalentGroupedService[];
}

// Helper: pull the existing TALENT_STRIP_OPTIONS entry by slug so the
// flyout rows always match the canonical option metadata.
function svc(slug: string): TalentGroupedService {
  const found = TALENT_STRIP_OPTIONS.find((o) => o.slug === slug);
  if (!found) {
    throw new Error(`talent-strip-groups: unknown service slug "${slug}"`);
  }
  return {
    slug: found.slug,
    name: found.name,
    stripLabel: found.stripLabel,
    description: found.description,
    icon: found.icon,
  };
}

// ─────────────────────────────────────────────────────────────
// CANDIDATE-SIDE (3) — "what do I want to do as a job seeker?"
// ─────────────────────────────────────────────────────────────
const CANDIDATE_GROUPS: TalentStripGroup[] = [
  {
    slug: "candidate-get-trained",
    stripLabel: "Get Trained",
    name: "Get Trained",
    tagline: "Learn on your stack, get hired while you train",
    side: "candidate",
    icon: GraduationCap,
    accent: "blue",
    services: [svc("train-to-hire"), svc("hire-to-train"), svc("corporate-training")],
  },
  {
    slug: "candidate-get-placed",
    stripLabel: "Get Placed",
    name: "Get Placed",
    tagline: "Browse live roles and get matched with hiring employers",
    side: "candidate",
    icon: Briefcase,
    accent: "blue",
    services: [svc("placements"), svc("staffing-solutions"), svc("talent-recruitment")],
  },
  {
    slug: "candidate-get-certified",
    stripLabel: "Get Certified",
    name: "Get Certified",
    tagline: "Validate your skills with AI-scored assessments",
    side: "candidate",
    icon: Award,
    accent: "blue",
    services: [svc("talent-assessment"), svc("workforce-solutions"), svc("talent-deployment")],
  },
];

// ─────────────────────────────────────────────────────────────
// EMPLOYER-SIDE (3) — "what do I want to do as a hiring team?"
// ─────────────────────────────────────────────────────────────
const EMPLOYER_GROUPS: TalentStripGroup[] = [
  {
    slug: "employer-build-talent",
    stripLabel: "Build Talent",
    name: "Build Talent",
    tagline: "Train cohorts on your stack — pipeline, not lottery",
    side: "employer",
    icon: Users,
    accent: "emerald",
    services: [svc("train-to-hire"), svc("hire-to-train"), svc("corporate-training")],
  },
  {
    slug: "employer-hire-talent",
    stripLabel: "Hire Talent",
    name: "Hire Talent",
    tagline: "Tap a 2M+ pre-vetted pool — shortlists in 48 hours",
    side: "employer",
    icon: UserCheck,
    accent: "emerald",
    services: [svc("staffing-solutions"), svc("talent-recruitment"), svc("talent-deployment")],
  },
  {
    slug: "employer-scale-workforce",
    stripLabel: "Scale Workforce",
    name: "Scale Workforce",
    tagline: "End-to-end workforce strategy, assessment and bench",
    side: "employer",
    icon: TrendingUp,
    accent: "emerald",
    services: [svc("workforce-solutions"), svc("talent-assessment"), svc("placements")],
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
