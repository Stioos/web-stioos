import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Briefcase,
  Building2,
  Cpu,
  GraduationCap,
  HandCoins,
  UserRound,
  Wrench,
} from "lucide-react";

// ============================================================
// WORKSONN SECONDARY STRIP — the 8 network-path pills shown in
// the secondary header ONLY on /worksonn* pages. Each pill opens
// a flyout of its 8 sub-pages (see pages/worksonn-sub-pages.ts).
// Join paths use the emerald accent; partner paths use violet —
// mirroring the Worksonn mega menu grouping.
// ============================================================

export type WorksonnAccent = "emerald" | "violet";

export interface WorksonnStripOption {
  /** path slug — /worksonn/<slug> */
  slug: string;
  name: string;
  /** compact label used on the strip pill (fits 8 pills across) */
  stripLabel: string;
  tag: string;
  description: string;
  icon: LucideIcon;
  href: string;
  /** group this path belongs to (mega-menu column) */
  pillar: string;
  accent: WorksonnAccent;
}

const JOIN_ITEMS: Omit<WorksonnStripOption, "pillar" | "accent" | "href">[] = [
  {
    slug: "candidates",
    name: "Candidates / Job Seeker",
    stripLabel: "Candidates",
    tag: "Careers",
    description: "Find AI, tech & business roles",
    icon: UserRound,
  },
  {
    slug: "sales-agent",
    name: "Sales Agent — commission basis",
    stripLabel: "Sales Agent",
    tag: "Commission",
    description: "Earn uncapped commission per deal",
    icon: HandCoins,
  },
  {
    slug: "freelancer-consultant",
    name: "Freelancer / Consultant",
    stripLabel: "Freelancer",
    tag: "Flexible",
    description: "Deliver projects on your terms",
    icon: Briefcase,
  },
  {
    slug: "company-agency",
    name: "Company / Agency",
    stripLabel: "Company / Agency",
    tag: "Delivery partner",
    description: "Scale your delivery with our platform",
    icon: Building2,
  },
];

const PARTNER_ITEMS: Omit<WorksonnStripOption, "pillar" | "accent" | "href">[] = [
  {
    slug: "training-partner",
    name: "Training Partner",
    stripLabel: "Training Partner",
    tag: "Enablement",
    description: "Deliver industry-ready programs",
    icon: GraduationCap,
  },
  {
    slug: "services-partner",
    name: "Services Partner",
    stripLabel: "Services Partner",
    tag: "Co-delivery",
    description: "Co-deliver client engagements",
    icon: Wrench,
  },
  {
    slug: "technology-partner",
    name: "Technology Partner",
    stripLabel: "Technology Partner",
    tag: "Integration",
    description: "Integrate, build & co-sell",
    icon: Cpu,
  },
  {
    slug: "ai-partner",
    name: "Artificial Intelligence Partner",
    stripLabel: "AI Partner",
    tag: "AI Solutions",
    description: "Bring AI solutions to market",
    icon: Bot,
  },
];

const withMeta = (
  items: Omit<WorksonnStripOption, "pillar" | "accent" | "href">[],
  pillar: string,
  accent: WorksonnAccent
): WorksonnStripOption[] =>
  items.map((item) => ({
    ...item,
    href: `/worksonn/${item.slug}`,
    pillar,
    accent,
  }));

export const WORKSONN_STRIP_OPTIONS: WorksonnStripOption[] = [
  ...withMeta(JOIN_ITEMS, "Join Worksonn", "emerald"),
  ...withMeta(PARTNER_ITEMS, "Become A Partner", "violet"),
];
