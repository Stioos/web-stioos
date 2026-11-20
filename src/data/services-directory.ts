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

// ============================================================
// SERVICES DIRECTORY — 8 divisions × 5 SEO/AEO-optimized
// services = 40 services. Rendered as a flat, minimal 4-column
// grid on the home page (above the footer), mirroring the
// reference design.
//
// Each service name is crafted for SEO (keyword-rich, matches
// what buyers search for) AND AEO (natural-language phrasing
// that AI answer engines like Perplexity, ChatGPT, Google AI
// Overviews can parse and cite).
//
// Service routes point to the marketplace search filtered by
// the matching category/subcategory slug so every link resolves
// to a real, populated results page.
// ============================================================

export interface DirectoryService {
  /** SEO/AEO-optimized service name (keyword-rich, natural language) */
  name: string;
  /** one-line AEO-friendly description (answers "what is this?") */
  description: string;
  /** marketplace search href (resolves to a real results page) */
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
  /** 5 services under this division */
  services: DirectoryService[];
}

export const SERVICES_DIRECTORY: DirectoryDivision[] = [
  // ── 1. AI Workflow Automation ──
  {
    id: "ai-workflow-automation",
    name: "AI Workflow Automation",
    icon: Workflow,
    accent: "violet",
    services: [
      {
        name: "Operations & Process Automation",
        description: "Automate repetitive business operations and back-office processes with AI-driven workflows.",
        href: "/marketplace?cat=ai-agents&sub=process-automation-agents",
      },
      {
        name: "Digital Sales & AI Marketing Automation",
        description: "End-to-end AI automation for sales and marketing pipelines — from lead gen to nurture.",
        href: "/marketplace?cat=digital-sales-marketing&sub=ai-sdr-outbound-sales",
      },
      {
        name: "Data, Analytics & Decision Intelligence",
        description: "AI-powered data pipelines, analytics dashboards, and decision intelligence platforms.",
        href: "/marketplace?cat=business-enterprise-services&sub=business-intelligence-data-analytics",
      },
      {
        name: "Supply Chain, Procurement & Management",
        description: "Automate supply chain workflows, procurement approvals, and vendor management with AI.",
        href: "/marketplace?cat=business-enterprise-services&sub=erp-solutions",
      },
      {
        name: "HR & Workforce Automation",
        description: "AI automation for HR processes — screening, onboarding, scheduling, and people analytics.",
        href: "/marketplace?cat=talent-solutions&sub=hr-technology-ai-automation",
      },
    ],
  },

  // ── 2. Custom AI Agentic Services ──
  {
    id: "custom-ai-agentic-services",
    name: "Custom AI Agentic Services",
    icon: Bot,
    accent: "amber",
    services: [
      {
        name: "Conversational & Support Agents",
        description: "Custom AI agents for customer support — resolve, escalate, and learn across every channel.",
        href: "/marketplace?cat=ai-agents&sub=customer-support-agents",
      },
      {
        name: "Integration & Orchestration Agents",
        description: "AI agents that integrate and orchestrate across your CRM, ERP, and internal tools.",
        href: "/marketplace?cat=ai-agents&sub=custom-ai-agents",
      },
      {
        name: "Analytical & Decision-Making Agents",
        description: "AI agents that analyze data, surface insights, and make recommendations autonomously.",
        href: "/marketplace?cat=ai-agents&sub=enterprise-ai-agents",
      },
      {
        name: "Process & Task Automation Agents",
        description: "Purpose-built AI agents that execute multi-step business processes end-to-end.",
        href: "/marketplace?cat=ai-agents&sub=process-automation-agents",
      },
      {
        name: "Multi-Agent Systems & Agent Fleets",
        description: "Governed fleets of cooperating AI agents for enterprise-scale automation.",
        href: "/marketplace?cat=ai-agents&sub=enterprise-ai-agents",
      },
    ],
  },

  // ── 3. Tech & Programming Services ──
  {
    id: "tech-programming-services",
    name: "Tech & Programming Services",
    icon: Code2,
    accent: "sky",
    services: [
      {
        name: "Ready-to-Use Tools & SaaS Apps",
        description: "Pre-built SaaS tools and applications, customized and deployed for your business.",
        href: "/marketplace?cat=technology-programming&sub=software-design-development",
      },
      {
        name: "Cloud Hosting & Deployment",
        description: "Cloud hosting, deployment automation, and infrastructure management on AWS, GCP, Azure.",
        href: "/marketplace?cat=cloud-devops-mlops&sub=cloud-migration-modernization",
      },
      {
        name: "Mobile Apps Design & Development",
        description: "iOS and Android mobile app design and development built for performance and scale.",
        href: "/marketplace?cat=technology-programming&sub=mobile-apps-design-development",
      },
      {
        name: "Software Design & Development",
        description: "Custom software products, internal systems, and enterprise applications built by senior teams.",
        href: "/marketplace?cat=technology-programming&sub=software-design-development",
      },
      {
        name: "API Development & Integration",
        description: "API strategy, development, and integration services for connecting your entire stack.",
        href: "/marketplace?cat=technology-programming&sub=api-development",
      },
    ],
  },

  // ── 4. Multimedia & Graphic Design ──
  {
    id: "multimedia-graphic-design",
    name: "Multimedia & Graphic Design",
    icon: Clapperboard,
    accent: "fuchsia",
    services: [
      {
        name: "Graphic Design & Branding",
        description: "Brand identity, logo design, and graphic design services for digital and print.",
        href: "/marketplace?cat=multimedia-ai-graphics&sub=social-ad-creatives",
      },
      {
        name: "Multimedia Production Services",
        description: "Full-cycle multimedia production — video, audio, motion graphics, and animation.",
        href: "/marketplace?cat=multimedia-ai-graphics&sub=ai-video-generation",
      },
      {
        name: "Visual Content & Marketing Assets",
        description: "High-volume visual content and marketing assets for paid and organic campaigns.",
        href: "/marketplace?cat=multimedia-ai-graphics&sub=ai-image-generation",
      },
      {
        name: "UI/UX & Digital Design Services",
        description: "Research-driven UI/UX design for web, mobile, and SaaS products.",
        href: "/marketplace?cat=technology-programming&sub=ui-ux-design",
      },
      {
        name: "AI Video & Audio Production",
        description: "AI-generated video ads, synthetic voiceovers, music, and podcast production.",
        href: "/marketplace?cat=multimedia-ai-graphics&sub=ai-audio-voice",
      },
    ],
  },

  // ── 5. Digital Sales & AI Marketing ──
  {
    id: "digital-sales-ai-marketing",
    name: "Digital Sales & AI Marketing",
    icon: Megaphone,
    accent: "rose",
    services: [
      {
        name: "AI-Driven Marketing & Personalization",
        description: "AI-powered marketing personalization across email, web, and ad channels.",
        href: "/marketplace?cat=digital-sales-marketing&sub=lifecycle-email-sms-marketing",
      },
      {
        name: "AI-Powered Sales Enablement",
        description: "AI SDRs, sales intelligence, and outbound pipeline engines for revenue teams.",
        href: "/marketplace?cat=digital-sales-marketing&sub=ai-sdr-outbound-sales",
      },
      {
        name: "Conversational & Engagement Automation",
        description: "Chatbots, conversational marketing, and customer engagement automation.",
        href: "/marketplace?cat=ai-agents&sub=conversational-ai-agents",
      },
      {
        name: "Analytics, Insights & ROI Optimization",
        description: "Marketing analytics, attribution, and ROI optimization for every channel.",
        href: "/marketplace?cat=digital-sales-marketing&sub=conversion-rate-optimization",
      },
      {
        name: "SEO & Answer Engine Optimization",
        description: "SEO and AEO (Answer Engine Optimization) for Google, Perplexity, ChatGPT, and AI overviews.",
        href: "/marketplace?cat=digital-sales-marketing&sub=seo-answer-engine-optimization",
      },
    ],
  },

  // ── 6. Business & Enterprise Services ──
  {
    id: "business-enterprise-services",
    name: "Business & Enterprise Services",
    icon: Building2,
    accent: "emerald",
    services: [
      {
        name: "Process & Workflow Automation",
        description: "Automate business processes and workflows across operations, finance, and admin.",
        href: "/marketplace?cat=business-enterprise-services&sub=crm-solutions",
      },
      {
        name: "Customer, Sales & Experience Management",
        description: "CRM, CX programs, and customer experience management for enterprise teams.",
        href: "/marketplace?cat=business-enterprise-services&sub=customer-experience",
      },
      {
        name: "Data, Analytics & Business Intelligence",
        description: "Data pipelines, warehouses, BI dashboards, and decision analytics platforms.",
        href: "/marketplace?cat=business-enterprise-services&sub=business-intelligence-data-analytics",
      },
      {
        name: "Compliance, Security & Risk Management",
        description: "Cybersecurity, compliance programs, and risk management for regulated industries.",
        href: "/marketplace?cat=business-enterprise-services&sub=security-risk",
      },
      {
        name: "CRM & ERP Implementation",
        description: "CRM and ERP selection, implementation, and integration — Salesforce, HubSpot, SAP, Oracle.",
        href: "/marketplace?cat=business-enterprise-services&sub=erp-solutions",
      },
    ],
  },

  // ── 7. Consultation & Solutions ──
  {
    id: "consultation-solutions",
    name: "Consultation & Solutions",
    icon: Lightbulb,
    accent: "orange",
    services: [
      {
        name: "Operational & Performance Solutions",
        description: "Operational consulting and performance improvement programs for growing businesses.",
        href: "/marketplace?cat=business-enterprise-services&sub=customer-experience",
      },
      {
        name: "Compliance, Risk & Governance Consulting",
        description: "Governance, risk, and compliance consulting for regulated and enterprise organizations.",
        href: "/marketplace?cat=business-enterprise-services&sub=security-risk",
      },
      {
        name: "Business & Strategy Consulting",
        description: "Business strategy, market entry, and growth consulting from senior practitioners.",
        href: "/marketplace?cat=business-enterprise-services",
      },
      {
        name: "Branding & Identity Services",
        description: "Brand strategy, identity design, and positioning for startups and enterprises.",
        href: "/marketplace?cat=multimedia-ai-graphics&sub=social-ad-creatives",
      },
      {
        name: "Digital Transformation Consulting",
        description: "End-to-end digital transformation strategy and execution for enterprise modernization.",
        href: "/marketplace?cat=cloud-devops-mlops&sub=cloud-migration-modernization",
      },
    ],
  },

  // ── 8. Startup & Accounting ──
  {
    id: "startup-accounting",
    name: "Startup & Accounting",
    icon: Wallet,
    accent: "teal",
    services: [
      {
        name: "Bookkeeping & Financial Management",
        description: "Bookkeeping automation, financial reporting, and day-to-day financial management.",
        href: "/marketplace?cat=business-enterprise-services&sub=financial-management",
      },
      {
        name: "Financial Advisory & Growth Planning",
        description: "Financial advisory, FP&A, and growth planning for startups and SMBs.",
        href: "/marketplace?cat=business-enterprise-services&sub=financial-management",
      },
      {
        name: "Business Formation & Compliance",
        description: "Business formation, entity setup, and regulatory compliance for new companies.",
        href: "/marketplace?cat=business-enterprise-services&sub=security-risk",
      },
      {
        name: "Tax Planning & Regulatory Compliance",
        description: "Tax planning, preparation, and regulatory compliance services for businesses.",
        href: "/marketplace?cat=business-enterprise-services&sub=financial-management",
      },
      {
        name: "Fractional CFO & Controller Services",
        description: "Fractional CFO and controller services for startups without a full-time finance team.",
        href: "/marketplace?cat=business-enterprise-services&sub=financial-management",
      },
    ],
  },
];

// Total service count (for the section subtitle)
export const SERVICES_DIRECTORY_TOTAL = SERVICES_DIRECTORY.reduce(
  (n, div) => n + div.services.length,
  0
);
