import type { LucideIcon } from "lucide-react";
import {
  Workflow,
  Bot,
  Code2,
  Clapperboard,
  Megaphone,
  Building2,
  Lightbulb,
  Target,
  Wallet,
  type LucideIcon as LucideIconType,
} from "lucide-react";
// NOTE: slugifyServiceName is now imported from the new directory catalog
// file (services-directory-catalog.ts) so the slug algorithm is shared
// with the actual /marketplace/[slug] route's data source — the hrefs
// in this file can never drift out of sync with the catalog slugs.
import { slugifyServiceName } from "@/data/services-directory-catalog";

// ============================================================
// SERVICES DIRECTORY — 9 divisions × 6 SEO/AEO-optimized services
// (6 × 9 = 54 services shown, 1 hidden from the 55 total).
//
// The 8 previous divisions were reorganized into a clean 3×3 grid:
//   1. AI Workflow Automation        (5 → 6, +1 from Digital Sales)
//   2. Custom AI Agentic Services    (5 → 6, +1 from Digital Sales)
//   3. Tech & Programming Services   (6, unchanged)
//   4. Multimedia & Graphic Design   (7 → 6, brand-positioning moved to D8)
//   5. Digital Sales & AI Marketing  (10 → 6, 4 trimmed/overflowed)
//   6. Business & Enterprise         (5 → 6, +1 from Consultation)
//   7. Consultation & Solutions      (12 → 6, branding overflowed to D8)
//   8. Brand Strategy & Positioning  (NEW — 6 branding/positioning services
//                                     gathered from D4, D5, D7)
//   9. Startup & Accounting          (5 → 6, +1 operational consulting from D7)
//
// The 55th service ("Jataye Blogs & News Content…") is intentionally
// HIDDEN from the home grid — it remains in the marketplace catalog so
// the existing /marketplace/<slug> route still resolves.
//
// Each service name is crafted for SEO (keyword-rich, matches what buyers
// search for) AND AEO (natural-language phrasing that AI answer engines
// like Perplexity, ChatGPT, Google AI Overviews can parse and cite).
//
// Each service now carries a Lucide icon name (string) for the redesigned
// card UI — resolved via the shared <Icon name=… /> component in
// src/components/shared/icon.tsx.
//
// Service routes point to the EXISTING marketplace detail page at
// /marketplace/<slug> — the rich design with Live Impact Signal panel,
// donut chart, before/after metrics, progress bars, breadcrumb pills,
// tags, stats row, CTAs, etc. The slug is derived deterministically from
// the service name via slugifyServiceName(), which matches the algorithm
// used by services-directory-catalog.ts to build the DIRECTORY_SERVICES
// entries — so every directory href resolves to a real catalog entry
// rendered at the marketplace route.
// ============================================================

export interface DirectoryService {
  /** SEO/AEO-optimized service name (keyword-rich, natural language) */
  name: string;
  /** one-line AEO-friendly description (answers "what is this?") */
  description: string;
  /** marketplace detail page href — derived from the name via slugify */
  href: string;
  /** Lucide icon name rendered via the shared <Icon /> component */
  icon: string;
}

export interface DirectoryDivision {
  /** numeric id for keying */
  id: string;
  /** division name (matches the reference image) */
  name: string;
  /** lucide icon component for the division header tile */
  icon: LucideIconType;
  /** accent color key for the icon tile gradient */
  accent: "amber" | "emerald" | "violet" | "sky" | "rose" | "orange" | "teal" | "fuchsia";
  /** services under this division — exactly 6 per division */
  services: DirectoryService[];
}

/**
 * Helper — wraps a service name + description + icon into a directory
 * entry with the href derived deterministically from the name. The slug
 * is produced by the same slugifyServiceName() used by
 * services-directory-catalog.ts, so every directory href resolves to
 * a real /marketplace/[slug] entry rendered from the
 * DIRECTORY_SERVICES catalog.
 */
function svc(name: string, description: string, icon: string): DirectoryService {
  return {
    name,
    description,
    href: `/marketplace/${slugifyServiceName(name)}`,
    icon,
  };
}

export const SERVICES_DIRECTORY: DirectoryDivision[] = [
  // ── 1. AI Workflow Automation (6) ──
  {
    id: "ai-workflow-automation",
    name: "AI Workflow Automation",
    icon: Workflow,
    accent: "violet",
    services: [
      svc(
        "AI-Powered Operations & Process Automation for Streamlined Business Workflows",
        "Automate repetitive business operations and back-office processes with AI-driven workflows.",
        "Workflow"
      ),
      svc(
        "AI Marketing & Sales Automation for Full-Funnel Pipeline Generation",
        "End-to-end AI automation for sales and marketing pipelines — from lead gen to nurture.",
        "Zap"
      ),
      svc(
        "AI Data Analytics & Decision Intelligence for Real-Time Business Insights",
        "AI-powered data pipelines, analytics dashboards, and decision intelligence platforms.",
        "BarChart3"
      ),
      svc(
        "AI Supply Chain & Procurement Automation for Resilient Vendor Operations",
        "Automate supply chain workflows, procurement approvals, and vendor management with AI.",
        "Package"
      ),
      svc(
        "AI HR & Workforce Automation for Modern Talent and People Operations",
        "AI automation for HR processes — screening, onboarding, scheduling, and people analytics.",
        "Users"
      ),
      // ── Overflow from Digital Sales & AI Marketing ──
      svc(
        "AI-Driven Marketing Personalization for Email, Web, and Ad Channels",
        "AI-powered marketing personalization across email, web, and ad channels.",
        "Target"
      ),
    ],
  },

  // ── 2. Custom AI Agentic Services (6) ──
  {
    id: "custom-ai-agentic-services",
    name: "Custom AI Agentic Services",
    icon: Bot,
    accent: "amber",
    services: [
      svc(
        "Custom Conversational AI Support Agents for 24/7 Customer Service Automation",
        "Custom AI agents for customer support — resolve, escalate, and learn across every channel.",
        "Headset"
      ),
      svc(
        "AI Agent Integration & Orchestration Across CRM, ERP, and SaaS Stacks",
        "AI agents that integrate and orchestrate across your CRM, ERP, and internal tools.",
        "Network"
      ),
      svc(
        "AI Analytical Agents for Autonomous Data-Driven Decision Making",
        "AI agents that analyze data, surface insights, and make recommendations autonomously.",
        "BrainCircuit"
      ),
      svc(
        "AI Process Automation Agents for End-to-End Task Execution Workflows",
        "Purpose-built AI agents that execute multi-step business processes end-to-end.",
        "Bot"
      ),
      svc(
        "Multi-Agent AI Systems and Agent Fleets for Enterprise-Scale Automation",
        "Governed fleets of cooperating AI agents for enterprise-scale automation.",
        "Boxes"
      ),
      // ── Overflow from Digital Sales & AI Marketing ──
      svc(
        "AI-Powered Sales Enablement with SDRs and Outbound Pipeline Engines",
        "AI SDRs, sales intelligence, and outbound pipeline engines for revenue teams.",
        "TrendingUp"
      ),
    ],
  },

  // ── 3. Tech & Programming Services (6) ──
  {
    id: "tech-programming-services",
    name: "Tech & Programming Services",
    icon: Code2,
    accent: "sky",
    services: [
      svc(
        "Customizable SaaS Apps & Ready-to-Use Tools for Fast Deployment",
        "Pre-built SaaS tools and applications, customized and deployed for your business.",
        "Layers"
      ),
      svc(
        "Cloud Hosting & Deployment Automation on AWS, GCP, and Azure",
        "Cloud hosting, deployment automation, and infrastructure management on AWS, GCP, Azure.",
        "Cloud"
      ),
      svc(
        "iOS & Android Mobile App Design and Development for High-Performance Applications",
        "iOS and Android mobile app design and development built for performance and scale.",
        "Smartphone"
      ),
      svc(
        "Custom Software Design & Development for Scalable Enterprise Applications",
        "Custom software products, internal systems, and enterprise applications built by senior teams.",
        "Code2"
      ),
      svc(
        "API Development & Integration Services for Connected System Stacks",
        "API strategy, development, and integration services for connecting your entire stack.",
        "Plug"
      ),
      // ── Merged from Branding & Marketing Strategy ──
      svc(
        "Brand Launch Systems for Faster Time-to-Market and Rapid Activation",
        "Brand systems and activation plans built for faster time-to-market — launch in weeks, not quarters.",
        "Rocket"
      ),
    ],
  },

  // ── 4. Multimedia & Graphic Design (6) ──
  {
    id: "multimedia-graphic-design",
    name: "Multimedia & Graphic Design",
    icon: Clapperboard,
    accent: "fuchsia",
    services: [
      svc(
        "Graphic Design & Branding Services for Distinctive Visual Identity",
        "Brand identity, logo design, and graphic design services for digital and print.",
        "Palette"
      ),
      svc(
        "Multimedia Production Services for Video, Audio, and Motion Graphics",
        "Full-cycle multimedia production — video, audio, motion graphics, and animation.",
        "Film"
      ),
      svc(
        "Visual Content & Marketing Assets for High-Conversion Paid Campaigns",
        "High-volume visual content and marketing assets for paid and organic campaigns.",
        "Image"
      ),
      svc(
        "UI/UX & Digital Design Services for Web, Mobile, and SaaS Products",
        "Research-driven UI/UX design for web, mobile, and SaaS products.",
        "DraftingCompass"
      ),
      svc(
        "AI Video & Audio Production for Synthetic Voiceovers and Ad Creative",
        "AI-generated video ads, synthetic voiceovers, music, and podcast production.",
        "Video"
      ),
      // ── Merged from Branding & Marketing Strategy ──
      svc(
        "Brand Identity Design & Strategy Development for Cohesive Visual Systems",
        "Brand identity design and strategy development — name, logo, voice, and visual system from positioning.",
        "Brush"
      ),
    ],
  },

  // ── 5. Digital Sales & AI Marketing (6) ──
  {
    id: "digital-sales-ai-marketing",
    name: "Digital Sales & AI Marketing",
    icon: Megaphone,
    accent: "rose",
    services: [
      svc(
        "Conversational Marketing & Engagement Automation for Lead Nurturing",
        "Chatbots, conversational marketing, and customer engagement automation.",
        "MessageSquare"
      ),
      svc(
        "Marketing Analytics & ROI Optimization for Multi-Channel Attribution",
        "Marketing analytics, attribution, and ROI optimization for every channel.",
        "LineChart"
      ),
      svc(
        "SEO & Answer Engine Optimization (AEO) for Google AI Overviews and Perplexity",
        "SEO and AEO (Answer Engine Optimization) for Google, Perplexity, ChatGPT, and AI overviews.",
        "Search"
      ),
      svc(
        "Dedicated Sales Teams for Outbound Pipeline and Revenue Growth",
        "Dedicated, brand-aligned sales teams that carry your narrative into every conversation.",
        "Users"
      ),
      svc(
        "Dedicated Marketing Specialists for Channel Execution and Strategy",
        "Dedicated marketing specialists embedded in your team — channel owners who execute the strategy.",
        "Briefcase"
      ),
      svc(
        "Digital Marketing Integration & Enhancement Across Every Channel",
        "Integrate and enhance your brand across every digital marketing channel — one brand, every touchpoint.",
        "Globe"
      ),
      // ── Overflowed to D1, D2, D8 (4 trimmed):
      //    AI-Driven Marketing Personalization       → D1 #6
      //    AI-Powered Sales Enablement with SDRs     → D2 #6
      //    Social Media Branding Services            → D8 #2
      //    Jataye Blogs & News Content               → HIDDEN (55th)
    ],
  },

  // ── 6. Business & Enterprise Services (6) ──
  {
    id: "business-enterprise-services",
    name: "Business & Enterprise Services",
    icon: Building2,
    accent: "emerald",
    services: [
      svc(
        "Business Process & Workflow Automation for Operations and Finance",
        "Automate business processes and workflows across operations, finance, and admin.",
        "RefreshCw"
      ),
      svc(
        "Customer Experience & Sales Management for Enterprise CRM Programs",
        "CRM, CX programs, and customer experience management for enterprise teams.",
        "HeartHandshake"
      ),
      svc(
        "Business Intelligence & Data Analytics for Enterprise Decision Making",
        "Data pipelines, warehouses, BI dashboards, and decision analytics platforms.",
        "BarChart3"
      ),
      svc(
        "Compliance, Security & Risk Management for Regulated Industries",
        "Cybersecurity, compliance programs, and risk management for regulated industries.",
        "ShieldCheck"
      ),
      svc(
        "CRM & ERP Implementation Services for Salesforce, HubSpot, SAP, and Oracle",
        "CRM and ERP selection, implementation, and integration — Salesforce, HubSpot, SAP, Oracle.",
        "Database"
      ),
      // ── Overflow from Consultation & Solutions ──
      svc(
        "Digital Transformation Consulting for Enterprise Modernization Programs",
        "End-to-end digital transformation strategy and execution for enterprise modernization.",
        "Compass"
      ),
    ],
  },

  // ── 7. Consultation & Solutions (6) ──
  {
    id: "consultation-solutions",
    name: "Consultation & Solutions",
    icon: Lightbulb,
    accent: "orange",
    services: [
      svc(
        "Governance, Risk & Compliance Consulting for Enterprise Organizations",
        "Governance, risk, and compliance consulting for regulated and enterprise organizations.",
        "Scale"
      ),
      svc(
        "Business Strategy & Consulting Services for Market Entry and Growth",
        "Business strategy, market entry, and growth consulting from senior practitioners.",
        "Lightbulb"
      ),
      svc(
        "Branding & Identity Services for Startups and Enterprise Positioning",
        "Brand strategy, identity design, and positioning for startups and enterprises.",
        "PenTool"
      ),
      svc(
        "Industry-Specific Brand Experience Programs for Vertical Markets",
        "Industry-specific brand experience programs — tailored messaging, assets, and proof per vertical.",
        "Factory"
      ),
      svc(
        "Market Research & Analyst Programs for Brand Bet De-Risking",
        "Market research and analyst programs that quantify opportunity and de-risk brand bets.",
        "FileSearch"
      ),
      svc(
        "Emotional Brand Connection Programs for Community and Loyalty",
        "Programs that build emotional attachment — community, content, experiences — for lasting loyalty.",
        "Heart"
      ),
    ],
  },

  // ── 8. Brand Strategy & Positioning (NEW — 6) ──
  //    Gathers the branding/positioning services that previously lived
  //    scattered across Multimedia (D4), Digital Sales (D5), and
  //    Consultation (D7) into one focused division.
  {
    id: "brand-strategy-positioning",
    name: "Brand Strategy & Positioning",
    icon: Target,
    accent: "teal",
    services: [
      // ── from Multimedia & Graphic Design ──
      svc(
        "Brand Positioning & Rebranding Services for Established Companies",
        "Brand positioning and rebranding services for established companies — reposition without losing equity.",
        "Target"
      ),
      // ── from Digital Sales & AI Marketing ──
      svc(
        "Social Media Branding Services for Consistent Platform Presence",
        "Build social media branding that is consistent, on-voice, and built for each platform.",
        "Network"
      ),
      // ── from Consultation & Solutions ──
      svc(
        "Strategic Root Brand Positioning for Audience Clarity and Differentiation",
        "Strategic root positioning that defines who the brand is for, what it stands for, and how it differs.",
        "Flag"
      ),
      svc(
        "Market Segment Differentiation for Multi-Audience Brand Positioning",
        "Differentiate your brand across market segments — tailored positioning per audience you serve.",
        "Layers"
      ),
      svc(
        "Brand Humanity, Ethics & Emotion Strategy for Lasting Customer Loyalty",
        "Define and express the humanity, ethics, and emotion of your brand — the why behind the loyalty.",
        "Heart"
      ),
      svc(
        "Competitor Analysis & Market Reach for Whitespace Opportunity Capture",
        "Competitor analysis and market reach programs — map the field, find the gap, and own the whitespace.",
        "Radar"
      ),
    ],
  },

  // ── 9. Startup & Accounting (6) ──
  {
    id: "startup-accounting",
    name: "Startup & Accounting",
    icon: Wallet,
    accent: "amber",
    services: [
      svc(
        "Automated Bookkeeping & Financial Management Services for Small Businesses",
        "Bookkeeping automation, financial reporting, and day-to-day financial management.",
        "Calculator"
      ),
      svc(
        "Financial Advisory & Growth Planning for Startup FP&A and Scaling",
        "Financial advisory, FP&A, and growth planning for startups and SMBs.",
        "TrendingUp"
      ),
      svc(
        "Business Formation & Compliance Services for New Entity Setup",
        "Business formation, entity setup, and regulatory compliance for new companies.",
        "Landmark"
      ),
      svc(
        "Tax Planning & Regulatory Compliance Services for Businesses",
        "Tax planning, preparation, and regulatory compliance services for businesses.",
        "Receipt"
      ),
      svc(
        "Fractional CFO & Controller Services for Startups Without a Finance Team",
        "Fractional CFO and controller services for startups without a full-time finance team.",
        "Wallet"
      ),
      // ── Overflow from Consultation & Solutions ──
      svc(
        "Operational Consulting & Performance Solutions for Growing Businesses",
        "Operational consulting and performance improvement programs for growing businesses.",
        "Cog"
      ),
    ],
  },
];

// Total service count (for the section subtitle) — 54 shown in the grid.
export const SERVICES_DIRECTORY_TOTAL = SERVICES_DIRECTORY.reduce(
  (n, div) => n + div.services.length,
  0
);
