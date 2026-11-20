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
  type LucideIcon as LucideIconType,
} from "lucide-react";
// NOTE: slugifyServiceName is now imported from the new directory catalog
// file (services-directory-catalog.ts) so the slug algorithm is shared
// with the actual /marketplace/[slug] route's data source — the hrefs
// in this file can never drift out of sync with the catalog slugs.
import { slugifyServiceName } from "@/data/services-directory-catalog";

// ============================================================
// SERVICES DIRECTORY — 8 divisions × SEO/AEO-optimized services
// (5 + 5 + 6 + 7 + 10 + 5 + 12 + 5 = 55 services). The 15 branding
// services from the reference image are MERGED into the 8 existing
// divisions (not a separate 9th division). Rendered as a flat, minimal
// 4-column grid on the home page (before the trust marquee), mirroring
// the reference design.
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
        "AI-Powered Operations & Process Automation for Streamlined Business Workflows",
        "Automate repetitive business operations and back-office processes with AI-driven workflows."
      ),
      svc(
        "AI Marketing & Sales Automation for Full-Funnel Pipeline Generation",
        "End-to-end AI automation for sales and marketing pipelines — from lead gen to nurture."
      ),
      svc(
        "AI Data Analytics & Decision Intelligence for Real-Time Business Insights",
        "AI-powered data pipelines, analytics dashboards, and decision intelligence platforms."
      ),
      svc(
        "AI Supply Chain & Procurement Automation for Resilient Vendor Operations",
        "Automate supply chain workflows, procurement approvals, and vendor management with AI."
      ),
      svc(
        "AI HR & Workforce Automation for Modern Talent and People Operations",
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
        "Custom Conversational AI Support Agents for 24/7 Customer Service Automation",
        "Custom AI agents for customer support — resolve, escalate, and learn across every channel."
      ),
      svc(
        "AI Agent Integration & Orchestration Across CRM, ERP, and SaaS Stacks",
        "AI agents that integrate and orchestrate across your CRM, ERP, and internal tools."
      ),
      svc(
        "AI Analytical Agents for Autonomous Data-Driven Decision Making",
        "AI agents that analyze data, surface insights, and make recommendations autonomously."
      ),
      svc(
        "AI Process Automation Agents for End-to-End Task Execution Workflows",
        "Purpose-built AI agents that execute multi-step business processes end-to-end."
      ),
      svc(
        "Multi-Agent AI Systems and Agent Fleets for Enterprise-Scale Automation",
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
        "Customizable SaaS Apps & Ready-to-Use Tools for Fast Deployment",
        "Pre-built SaaS tools and applications, customized and deployed for your business."
      ),
      svc(
        "Cloud Hosting & Deployment Automation on AWS, GCP, and Azure",
        "Cloud hosting, deployment automation, and infrastructure management on AWS, GCP, Azure."
      ),
      svc(
        "iOS & Android Mobile App Design and Development for High-Performance Applications",
        "iOS and Android mobile app design and development built for performance and scale."
      ),
      svc(
        "Custom Software Design & Development for Scalable Enterprise Applications",
        "Custom software products, internal systems, and enterprise applications built by senior teams."
      ),
      svc(
        "API Development & Integration Services for Connected System Stacks",
        "API strategy, development, and integration services for connecting your entire stack."
      ),
      // ── Merged from Branding & Marketing Strategy ──
      svc(
        "Brand Launch Systems for Faster Time-to-Market and Rapid Activation",
        "Brand systems and activation plans built for faster time-to-market — launch in weeks, not quarters."
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
        "Graphic Design & Branding Services for Distinctive Visual Identity",
        "Brand identity, logo design, and graphic design services for digital and print."
      ),
      svc(
        "Multimedia Production Services for Video, Audio, and Motion Graphics",
        "Full-cycle multimedia production — video, audio, motion graphics, and animation."
      ),
      svc(
        "Visual Content & Marketing Assets for High-Conversion Paid Campaigns",
        "High-volume visual content and marketing assets for paid and organic campaigns."
      ),
      svc(
        "UI/UX & Digital Design Services for Web, Mobile, and SaaS Products",
        "Research-driven UI/UX design for web, mobile, and SaaS products."
      ),
      svc(
        "AI Video & Audio Production for Synthetic Voiceovers and Ad Creative",
        "AI-generated video ads, synthetic voiceovers, music, and podcast production."
      ),
      // ── Merged from Branding & Marketing Strategy ──
      svc(
        "Brand Identity Design & Strategy Development for Cohesive Visual Systems",
        "Brand identity design and strategy development — name, logo, voice, and visual system from positioning."
      ),
      svc(
        "Brand Positioning & Rebranding Services for Established Companies",
        "Brand positioning and rebranding services for established companies — reposition without losing equity."
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
        "AI-Driven Marketing Personalization for Email, Web, and Ad Channels",
        "AI-powered marketing personalization across email, web, and ad channels."
      ),
      svc(
        "AI-Powered Sales Enablement with SDRs and Outbound Pipeline Engines",
        "AI SDRs, sales intelligence, and outbound pipeline engines for revenue teams."
      ),
      svc(
        "Conversational Marketing & Engagement Automation for Lead Nurturing",
        "Chatbots, conversational marketing, and customer engagement automation."
      ),
      svc(
        "Marketing Analytics & ROI Optimization for Multi-Channel Attribution",
        "Marketing analytics, attribution, and ROI optimization for every channel."
      ),
      svc(
        "SEO & Answer Engine Optimization (AEO) for Google AI Overviews and Perplexity",
        "SEO and AEO (Answer Engine Optimization) for Google, Perplexity, ChatGPT, and AI overviews."
      ),
      // ── Merged from Branding & Marketing Strategy ──
      svc(
        "Jataye Blogs & News Content for SEO Authority and Organic Traffic",
        "Branded blogs and news content that builds authority, supports SEO, and earns organic traffic."
      ),
      svc(
        "Dedicated Sales Teams for Outbound Pipeline and Revenue Growth",
        "Dedicated, brand-aligned sales teams that carry your narrative into every conversation."
      ),
      svc(
        "Dedicated Marketing Specialists for Channel Execution and Strategy",
        "Dedicated marketing specialists embedded in your team — channel owners who execute the strategy."
      ),
      svc(
        "Social Media Branding Services for Consistent Platform Presence",
        "Build social media branding that is consistent, on-voice, and built for each platform."
      ),
      svc(
        "Digital Marketing Integration & Enhancement Across Every Channel",
        "Integrate and enhance your brand across every digital marketing channel — one brand, every touchpoint."
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
        "Business Process & Workflow Automation for Operations and Finance",
        "Automate business processes and workflows across operations, finance, and admin."
      ),
      svc(
        "Customer Experience & Sales Management for Enterprise CRM Programs",
        "CRM, CX programs, and customer experience management for enterprise teams."
      ),
      svc(
        "Business Intelligence & Data Analytics for Enterprise Decision Making",
        "Data pipelines, warehouses, BI dashboards, and decision analytics platforms."
      ),
      svc(
        "Compliance, Security & Risk Management for Regulated Industries",
        "Cybersecurity, compliance programs, and risk management for regulated industries."
      ),
      svc(
        "CRM & ERP Implementation Services for Salesforce, HubSpot, SAP, and Oracle",
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
        "Operational Consulting & Performance Solutions for Growing Businesses",
        "Operational consulting and performance improvement programs for growing businesses."
      ),
      svc(
        "Governance, Risk & Compliance Consulting for Enterprise Organizations",
        "Governance, risk, and compliance consulting for regulated and enterprise organizations."
      ),
      svc(
        "Business Strategy & Consulting Services for Market Entry and Growth",
        "Business strategy, market entry, and growth consulting from senior practitioners."
      ),
      svc(
        "Branding & Identity Services for Startups and Enterprise Positioning",
        "Brand strategy, identity design, and positioning for startups and enterprises."
      ),
      svc(
        "Digital Transformation Consulting for Enterprise Modernization Programs",
        "End-to-end digital transformation strategy and execution for enterprise modernization."
      ),
      // ── Merged from Branding & Marketing Strategy ──
      svc(
        "Industry-Specific Brand Experience Programs for Vertical Markets",
        "Industry-specific brand experience programs — tailored messaging, assets, and proof per vertical."
      ),
      svc(
        "Market Research & Analyst Programs for Brand Bet De-Risking",
        "Market research and analyst programs that quantify opportunity and de-risk brand bets."
      ),
      svc(
        "Brand Humanity, Ethics & Emotion Strategy for Lasting Customer Loyalty",
        "Define and express the humanity, ethics, and emotion of your brand — the why behind the loyalty."
      ),
      svc(
        "Strategic Root Brand Positioning for Audience Clarity and Differentiation",
        "Strategic root positioning that defines who the brand is for, what it stands for, and how it differs."
      ),
      svc(
        "Emotional Brand Connection Programs for Community and Loyalty",
        "Programs that build emotional attachment — community, content, experiences — for lasting loyalty."
      ),
      svc(
        "Market Segment Differentiation for Multi-Audience Brand Positioning",
        "Differentiate your brand across market segments — tailored positioning per audience you serve."
      ),
      svc(
        "Competitor Analysis & Market Reach for Whitespace Opportunity Capture",
        "Competitor analysis and market reach programs — map the field, find the gap, and own the whitespace."
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
        "Automated Bookkeeping & Financial Management Services for Small Businesses",
        "Bookkeeping automation, financial reporting, and day-to-day financial management."
      ),
      svc(
        "Financial Advisory & Growth Planning for Startup FP&A and Scaling",
        "Financial advisory, FP&A, and growth planning for startups and SMBs."
      ),
      svc(
        "Business Formation & Compliance Services for New Entity Setup",
        "Business formation, entity setup, and regulatory compliance for new companies."
      ),
      svc(
        "Tax Planning & Regulatory Compliance Services for Businesses",
        "Tax planning, preparation, and regulatory compliance services for businesses."
      ),
      svc(
        "Fractional CFO & Controller Services for Startups Without a Finance Team",
        "Fractional CFO and controller services for startups without a full-time finance team."
      ),
    ],
  },
];

// Total service count (for the section subtitle)
export const SERVICES_DIRECTORY_TOTAL = SERVICES_DIRECTORY.reduce(
  (n, div) => n + div.services.length,
  0
);
