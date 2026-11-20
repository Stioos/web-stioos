import type { LucideIcon } from "lucide-react";
import {
  Workflow,
  Bot,
  Code2,
  Clapperboard,
  Megaphone,
  Building2,
  Lightbulb,
  Wallet,
  Target,
  type LucideIcon as LucideIconType,
} from "lucide-react";
// NOTE: slugifyServiceName is now imported from the new directory catalog
// file (services-directory-catalog.ts) so the slug algorithm is shared
// with the actual /marketplace/[slug] route's data source — the hrefs
// in this file can never drift out of sync with the catalog slugs.
import { slugifyServiceName } from "@/data/services-directory-catalog";

// ============================================================
// SERVICES DIRECTORY — 9 divisions × SEO/AEO-optimized services
// (5 + 5 + 5 + 5 + 5 + 5 + 5 + 5 + 15 = 55 services). Rendered as
// a flat, minimal 4-column grid on the home page (above the footer),
// mirroring the reference design.
//
// Each service name is crafted for SEO (keyword-rich, matches
// what buyers search for) AND AEO (natural-language phrasing
// that AI answer engines like Perplexity, ChatGPT, Google AI
// Overviews can parse and cite).
//
// Service routes now point to the EXISTING marketplace detail page
// at /marketplace/<slug> — the rich design with Live Impact Signal
// panel, donut chart, before/after metrics, progress bars,
// breadcrumb pills, tags, stats row, CTAs, etc. The slug is
// derived deterministically from the service name via
// slugifyServiceName(), which matches the algorithm used by
// services-directory-catalog.ts to build the DIRECTORY_SERVICES
// entries — so every directory href resolves to a real catalog
// entry rendered at the marketplace route.
// ============================================================

export interface DirectoryService {
  /** SEO/AEO-optimized service name (keyword-rich, natural language) */
  name: string;
  /** one-line AEO-friendly description (answers "what is this?") */
  description: string;
  /** marketplace detail page href — derived from the name via slugify */
  href: string;
}

export interface DirectoryDivision {
  /** numeric id for keying */
  id: string;
  /** division name (matches the reference image) */
  name: string;
  /** lucide icon */
  icon: LucideIconType;
  /** accent color key for the icon */
  accent: "amber" | "emerald" | "violet" | "sky" | "rose" | "orange" | "teal" | "fuchsia";
  /** services under this division (5 for divisions 1-8, 15 for division 9) */
  services: DirectoryService[];
}

/**
 * Helper — wraps a service name + description into a directory entry
 * with the href derived deterministically from the name. The slug is
 * produced by the same slugifyServiceName() used by
 * services-directory-catalog.ts, so every directory href resolves to
 * a real /marketplace/[slug] entry rendered from the
 * DIRECTORY_SERVICES catalog.
 */
function svc(name: string, description: string): DirectoryService {
  return {
    name,
    description,
    href: `/marketplace/${slugifyServiceName(name)}`,
  };
}

export const SERVICES_DIRECTORY: DirectoryDivision[] = [
  // ── 1. AI Workflow Automation ──
  {
    id: "ai-workflow-automation",
    name: "AI Workflow Automation",
    icon: Workflow,
    accent: "violet",
    services: [
      svc(
        "Operations & Process Automation",
        "Automate repetitive business operations and back-office processes with AI-driven workflows."
      ),
      svc(
        "Digital Sales & AI Marketing Automation",
        "End-to-end AI automation for sales and marketing pipelines — from lead gen to nurture."
      ),
      svc(
        "Data, Analytics & Decision Intelligence",
        "AI-powered data pipelines, analytics dashboards, and decision intelligence platforms."
      ),
      svc(
        "Supply Chain, Procurement & Management Automation",
        "Automate supply chain workflows, procurement approvals, and vendor management with AI."
      ),
      svc(
        "HR & Workforce Automation",
        "AI automation for HR processes — screening, onboarding, scheduling, and people analytics."
      ),
    ],
  },

  // ── 2. Custom AI Agentic Services ──
  {
    id: "custom-ai-agentic-services",
    name: "Custom AI Agentic Services",
    icon: Bot,
    accent: "amber",
    services: [
      svc(
        "Conversational & Support Agents",
        "Custom AI agents for customer support — resolve, escalate, and learn across every channel."
      ),
      svc(
        "Integration & Orchestration Agents",
        "AI agents that integrate and orchestrate across your CRM, ERP, and internal tools."
      ),
      svc(
        "Analytical & Decision-Making Agents",
        "AI agents that analyze data, surface insights, and make recommendations autonomously."
      ),
      svc(
        "Process & Task Automation Agents",
        "Purpose-built AI agents that execute multi-step business processes end-to-end."
      ),
      svc(
        "Multi-Agent Systems & Agent Fleets",
        "Governed fleets of cooperating AI agents for enterprise-scale automation."
      ),
    ],
  },

  // ── 3. Tech & Programming Services ──
  {
    id: "tech-programming-services",
    name: "Tech & Programming Services",
    icon: Code2,
    accent: "sky",
    services: [
      svc(
        "Ready-to-Use Tools & SaaS Apps",
        "Pre-built SaaS tools and applications, customized and deployed for your business."
      ),
      svc(
        "Cloud Hosting & Deployment",
        "Cloud hosting, deployment automation, and infrastructure management on AWS, GCP, Azure."
      ),
      svc(
        "Mobile Apps Design & Development",
        "iOS and Android mobile app design and development built for performance and scale."
      ),
      svc(
        "Software Design & Development",
        "Custom software products, internal systems, and enterprise applications built by senior teams."
      ),
      svc(
        "API Development & Integration",
        "API strategy, development, and integration services for connecting your entire stack."
      ),
    ],
  },

  // ── 4. Multimedia & Graphic Design ──
  {
    id: "multimedia-graphic-design",
    name: "Multimedia & Graphic Design",
    icon: Clapperboard,
    accent: "fuchsia",
    services: [
      svc(
        "Graphic Design & Branding",
        "Brand identity, logo design, and graphic design services for digital and print."
      ),
      svc(
        "Multimedia Production Services",
        "Full-cycle multimedia production — video, audio, motion graphics, and animation."
      ),
      svc(
        "Visual Content & Marketing Assets",
        "High-volume visual content and marketing assets for paid and organic campaigns."
      ),
      svc(
        "UI/UX & Digital Design Services",
        "Research-driven UI/UX design for web, mobile, and SaaS products."
      ),
      svc(
        "AI Video & Audio Production",
        "AI-generated video ads, synthetic voiceovers, music, and podcast production."
      ),
    ],
  },

  // ── 5. Digital Sales & AI Marketing ──
  {
    id: "digital-sales-ai-marketing",
    name: "Digital Sales & AI Marketing",
    icon: Megaphone,
    accent: "rose",
    services: [
      svc(
        "AI-Driven Marketing & Personalization",
        "AI-powered marketing personalization across email, web, and ad channels."
      ),
      svc(
        "AI-Powered Sales Enablement",
        "AI SDRs, sales intelligence, and outbound pipeline engines for revenue teams."
      ),
      svc(
        "Conversational & Engagement Automation",
        "Chatbots, conversational marketing, and customer engagement automation."
      ),
      svc(
        "Analytics, Insights & ROI Optimization",
        "Marketing analytics, attribution, and ROI optimization for every channel."
      ),
      svc(
        "SEO & Answer Engine Optimization",
        "SEO and AEO (Answer Engine Optimization) for Google, Perplexity, ChatGPT, and AI overviews."
      ),
    ],
  },

  // ── 6. Business & Enterprise Services ──
  {
    id: "business-enterprise-services",
    name: "Business & Enterprise Services",
    icon: Building2,
    accent: "emerald",
    services: [
      svc(
        "Process & Workflow Automation",
        "Automate business processes and workflows across operations, finance, and admin."
      ),
      svc(
        "Customer, Sales & Experience Management",
        "CRM, CX programs, and customer experience management for enterprise teams."
      ),
      svc(
        "Data, Analytics & Business Intelligence",
        "Data pipelines, warehouses, BI dashboards, and decision analytics platforms."
      ),
      svc(
        "Compliance, Security & Risk Management",
        "Cybersecurity, compliance programs, and risk management for regulated industries."
      ),
      svc(
        "CRM & ERP Implementation",
        "CRM and ERP selection, implementation, and integration — Salesforce, HubSpot, SAP, Oracle."
      ),
    ],
  },

  // ── 7. Consultation & Solutions ──
  {
    id: "consultation-solutions",
    name: "Consultation & Solutions",
    icon: Lightbulb,
    accent: "orange",
    services: [
      svc(
        "Operational & Performance Solutions",
        "Operational consulting and performance improvement programs for growing businesses."
      ),
      svc(
        "Compliance, Risk & Governance Consulting",
        "Governance, risk, and compliance consulting for regulated and enterprise organizations."
      ),
      svc(
        "Business & Strategy Consulting",
        "Business strategy, market entry, and growth consulting from senior practitioners."
      ),
      svc(
        "Branding & Identity Services",
        "Brand strategy, identity design, and positioning for startups and enterprises."
      ),
      svc(
        "Digital Transformation Consulting",
        "End-to-end digital transformation strategy and execution for enterprise modernization."
      ),
    ],
  },

  // ── 8. Startup & Accounting ──
  {
    id: "startup-accounting",
    name: "Startup & Accounting",
    icon: Wallet,
    accent: "teal",
    services: [
      svc(
        "Bookkeeping & Financial Management",
        "Bookkeeping automation, financial reporting, and day-to-day financial management."
      ),
      svc(
        "Financial Advisory & Growth Planning",
        "Financial advisory, FP&A, and growth planning for startups and SMBs."
      ),
      svc(
        "Business Formation & Compliance",
        "Business formation, entity setup, and regulatory compliance for new companies."
      ),
      svc(
        "Tax Planning & Regulatory Compliance",
        "Tax planning, preparation, and regulatory compliance services for businesses."
      ),
      svc(
        "Fractional CFO & Controller Services",
        "Fractional CFO and controller services for startups without a full-time finance team."
      ),
    ],
  },

  // ── 9. Branding & Marketing Strategy (15 services) ──
  // Pulled directly from the reference image's branding & marketing
  // strategy panel. The largest division — covers research, positioning,
  // identity, activation, and measurement of a brand end-to-end.
  {
    id: "branding-marketing-strategy",
    name: "Branding & Marketing Strategy",
    icon: Target,
    accent: "amber",
    services: [
      svc(
        "Jataye Blogs & News",
        "Branded blogs and news content that builds authority, supports SEO, and earns organic traffic."
      ),
      svc(
        "Industries Experience",
        "Industry-specific brand experience programs — tailored messaging, assets, and proof per vertical."
      ),
      svc(
        "Dedicated Sales Teams",
        "Dedicated, brand-aligned sales teams that carry your narrative into every conversation."
      ),
      svc(
        "Market Research & Analysts",
        "Market research and analyst programs that quantify opportunity and de-risk brand bets."
      ),
      svc(
        "Marketing Specialist",
        "Dedicated marketing specialists embedded in your team — channel owners who execute the strategy."
      ),
      svc(
        "Humanity, Ethic & Emotion of Brand",
        "Define and express the humanity, ethics, and emotion of your brand — the why behind the loyalty."
      ),
      svc(
        "Strategic Root Positioning of Brand",
        "Strategic root positioning that defines who the brand is for, what it stands for, and how it differs."
      ),
      svc(
        "Emotional Attach Brand Connection",
        "Programs that build emotional attachment — community, content, experiences — for lasting loyalty."
      ),
      svc(
        "Market Segment Differentiation",
        "Differentiate your brand across market segments — tailored positioning per audience you serve."
      ),
      svc(
        "Faster Time-to-Market",
        "Brand systems and activation plans built for faster time-to-market — launch in weeks, not quarters."
      ),
      svc(
        "Brand Identity Design & Strategy Development",
        "Brand identity design and strategy development — name, logo, voice, and visual system from positioning."
      ),
      svc(
        "Brand Positioning & Rebranding Services",
        "Brand positioning and rebranding services for established companies — reposition without losing equity."
      ),
      svc(
        "Build Social Media Branding",
        "Build social media branding that is consistent, on-voice, and built for each platform."
      ),
      svc(
        "Digital Marketing Integration & Enhancement",
        "Integrate and enhance your brand across every digital marketing channel — one brand, every touchpoint."
      ),
      svc(
        "Competitor Analysis & Market Reach",
        "Competitor analysis and market reach programs — map the field, find the gap, and own the whitespace."
      ),
    ],
  },
];

// Total service count (for the section subtitle)
export const SERVICES_DIRECTORY_TOTAL = SERVICES_DIRECTORY.reduce(
  (n, div) => n + div.services.length,
  0
);
