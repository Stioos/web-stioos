/**
 * The six "as-a-Service" solutions — the bundled engagement outcomes the
 * platform sells on top of the 305-service catalog. Shared between the
 * home page solution grid and the "Digital, Tech & AI Services" panel in
 * the Browse Categories header dropdown.
 *
 * Each entry carries its own gradient + accent so the card can render with
 * the editorial watermark / glassmorphic icon orb / metric badge design.
 */
import {
  TrendingUp,
  Workflow,
  Code2,
  Megaphone,
  Trophy,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface Solution {
  id: string; // "01".."06" — also the ghost watermark
  slug: string;
  icon: LucideIcon;
  name: string;
  description: string;
  charge: string; // engagement model / pricing label
  metric: { value: string; label: string };
  /** glassmorphic tile classes for the pricing pill */
  tile: string;
  iconColor: string;
  gradient: string; // tailwind gradient stops
  glow: string; // rgba hover shadow
  strong: string; // accent text class
}

export const SOLUTIONS: Solution[] = [
  {
    id: "01",
    slug: "revenue-growth-as-a-service",
    icon: TrendingUp,
    name: "Revenue Growth as a Service",
    description:
      "Generate qualified leads, improve sales pipelines, automate follow-ups and help businesses convert customers.",
    charge: "Monthly retainer + performance fee",
    metric: { value: "3.8x", label: "pipeline lift" },
    tile: "bg-[#34d39926] ring-[#34d39940]",
    iconColor: "text-[#34d399]",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    glow: "rgba(52,211,153,0.20)",
    strong: "text-[#34d399]",
  },
  {
    id: "02",
    slug: "business-automation-as-a-service",
    icon: Workflow,
    name: "Business Automation as a Service",
    description:
      "Automate repetitive tasks, customer support, invoicing, reporting and internal workflows.",
    charge: "Setup + monthly subscription",
    metric: { value: "−62%", label: "manual effort" },
    tile: "bg-[#a78bfa26] ring-[#a78bfa40]",
    iconColor: "text-[#a78bfa]",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "rgba(167,139,250,0.20)",
    strong: "text-[#a78bfa]",
  },
  {
    id: "03",
    slug: "software-as-a-service",
    icon: Code2,
    name: "Software as a Service / Managed Software",
    description:
      "Build, maintain and continuously improve business applications, websites, ERP and CRM systems.",
    charge: "Monthly managed service",
    metric: { value: "3.4x", label: "release speed" },
    tile: "bg-[#38bdf826] ring-[#38bdf840]",
    iconColor: "text-[#38bdf8]",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    glow: "rgba(56,189,248,0.20)",
    strong: "text-[#38bdf8]",
  },
  {
    id: "04",
    slug: "digital-growth-as-a-service",
    icon: Megaphone,
    name: "Digital Growth as a Service",
    description:
      "Manage digital presence, SEO, advertising, content, conversion optimization and campaign performance.",
    charge: "Monthly retainer + campaign budget",
    metric: { value: "+38%", label: "organic traffic" },
    tile: "bg-[#fb718526] ring-[#fb718540]",
    iconColor: "text-[#fb7185]",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    glow: "rgba(251,113,133,0.20)",
    strong: "text-[#fb7185]",
  },
  {
    id: "05",
    slug: "results-on-delivery-as-a-service",
    icon: Trophy,
    name: "Results on Delivery as a Service",
    description:
      "Pay only for outcomes delivered — guaranteed pipeline, revenue, cost savings, and adoption targets with a performance-based engagement model.",
    charge: "Outcome-based — pay on delivery",
    metric: { value: "100%", label: "results guaranteed" },
    tile: "bg-[#fbbf2426] ring-[#fbbf2440]",
    iconColor: "text-[#fbbf24]",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    glow: "rgba(251,191,36,0.20)",
    strong: "text-[#fbbf24]",
  },
  {
    id: "06",
    slug: "ai-transformation-as-a-service",
    icon: Sparkles,
    name: "AI Transformation as a Service",
    description:
      "Assess business processes, implement AI solutions, integrate systems and continuously optimize AI adoption.",
    charge: "Transformation project + monthly support",
    metric: { value: "+38%", label: "productivity" },
    tile: "bg-[#e879f926] ring-[#e879f940]",
    iconColor: "text-[#e879f9]",
    gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    glow: "rgba(232,121,249,0.20)",
    strong: "text-[#e879f9]",
  },
];

/** The pseudo-division id used inside the Browse Categories dropdown. */
export const DIGITAL_TECH_AI_ID = "digital-tech-ai";
export const DIGITAL_TECH_AI_NAME = "Digital, Tech & AI Services";
