export interface OptionFieldDef {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  required?: boolean;
}

export interface OptionFormProfile {
  key: string;
  badge: string;
  subtitlePrefix: string;
  fields: OptionFieldDef[];
  budgetLabel: string;
  budgetOptions: string[];
  timelineLabel: string;
  timelineOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
}

const DEFAULT_BUDGET = [
  "Under $5k",
  "$5k–$10k",
  "$10k–$15k",
  "$15k–$30k",
  "$30k–$50k",
  "$50k+",
  "Not sure yet",
];

const DEFAULT_TIMELINE = [
  "Immediate",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Ongoing",
];

const PROFILES: Record<string, OptionFormProfile> = {
  trainToHire: {
    key: "trainToHire",
    badge: "Train-to-Hire Program",
    subtitlePrefix: "Tailored cohort & placement intake",
    fields: [
      {
        id: "track",
        label: "Role / Tech Track",
        placeholder: "Select target skill track",
        required: true,
        options: [
          "Full-Stack Engineering (React / Next.js / Node)",
          "AI, GenAI & LLM Engineering",
          "Cloud DevOps & Kubernetes",
          "Data Engineering & Business Intelligence",
          "Enterprise Java / .NET / Backend",
          "QA Automation & SDET",
        ],
      },
      {
        id: "cohortSize",
        label: "Cohort / Hiring Volume",
        placeholder: "How many candidates?",
        required: true,
        options: [
          "Individual Candidate (Applying to join)",
          "1–3 Trained Hires",
          "4–10 Dedicated Cohort",
          "11–25 Custom Batch",
          "25+ Enterprise Academy",
        ],
      },
      {
        id: "engagementModel",
        label: "Train-to-Hire Model",
        placeholder: "Select engagement structure",
        options: [
          "Train-to-Hire (Pay after placement)",
          "Custom Corporate Upskilling",
          "Pre-Trained Ready-to-Deploy Pod",
          "Apprenticeship / Probation Track",
        ],
      },
    ],
    budgetLabel: "Target Budget / Stipend",
    budgetOptions: [
      "Pay-per-hire on placement",
      "$5k–$15k cohort sponsorship",
      "$15k–$40k custom batch",
      "$40k+ enterprise academy",
      "Individual candidate (zero upfront)",
    ],
    timelineLabel: "Target Onboarding",
    timelineOptions: [
      "Immediate (Ready cohort)",
      "4–8 weeks (Custom sprint)",
      "8–12 weeks (Full cohort)",
      "Quarterly hiring pipeline",
    ],
    messageLabel: "Role requirements & stack",
    messagePlaceholder:
      "Describe the roles you want trained, required tech stack, location/remote preference, and target onboarding date…",
  },

  hireTalent: {
    key: "hireTalent",
    badge: "Talent & Staffing",
    subtitlePrefix: "Role-matched talent sourcing",
    fields: [
      {
        id: "roleCategory",
        label: "Role / Skillset Needed",
        placeholder: "Select primary role",
        required: true,
        options: [
          "AI / ML / LLM Engineer",
          "Full-Stack / Frontend / Backend Developer",
          "Cloud / DevOps / SRE Architect",
          "Product / UI-UX Designer",
          "Data Engineer / BI Analyst",
          "Growth / Performance Marketer",
        ],
      },
      {
        id: "hiringModel",
        label: "Engagement Type",
        placeholder: "Select hiring model",
        required: true,
        options: [
          "Full-Time Direct Hire",
          "Contract / Staff Augmentation",
          "Contract-to-Hire",
          "Dedicated Cross-Functional Pod",
        ],
      },
      {
        id: "seniority",
        label: "Seniority & Work Mode",
        placeholder: "Select level & location",
        options: [
          "Mid-Level (3–5 yrs) · Remote",
          "Senior (5–8 yrs) · Remote",
          "Lead / Principal (8+ yrs)",
          "Hybrid / On-site",
        ],
      },
    ],
    budgetLabel: "Compensation / Rate Range",
    budgetOptions: DEFAULT_BUDGET,
    timelineLabel: "Start Window",
    timelineOptions: ["Immediate (Within 2 weeks)", "1 month", "1–3 months", "Ongoing pipeline"],
    messageLabel: "Role & team details",
    messagePlaceholder:
      "Share must-have skills, timezone overlap, team size, and interview process…",
  },

  aiAutomation: {
    key: "aiAutomation",
    badge: "AI & Automation",
    subtitlePrefix: "AI agent & workflow scoping",
    fields: [
      {
        id: "useCase",
        label: "Primary AI / Automation Use Case",
        placeholder: "Select solution focus",
        required: true,
        options: [
          "Autonomous AI Agents (SDR / Support / Ops)",
          "Internal Workflow & Process Automation",
          "Enterprise RAG / Knowledge Copilot",
          "AI Voice / Conversational Assistant",
          "End-to-End AI Transformation",
        ],
      },
      {
        id: "integrations",
        label: "Systems to Integrate",
        placeholder: "Select primary stack",
        options: [
          "CRM (Salesforce / HubSpot)",
          "ERP / Billing / Finance Tools",
          "Slack / Teams / Email / Helpdesk",
          "Custom Internal APIs & Databases",
          "Multiple / Not sure yet",
        ],
      },
    ],
    budgetLabel: "Estimated Budget",
    budgetOptions: DEFAULT_BUDGET,
    timelineLabel: "Target Go-Live",
    timelineOptions: DEFAULT_TIMELINE,
    messageLabel: "Workflows & automation goals",
    messagePlaceholder:
      "Describe the manual workflows you want automated, current tools/APIs, and target volume or SLA…",
  },

  softwareEngineering: {
    key: "softwareEngineering",
    badge: "Software & Engineering",
    subtitlePrefix: "Technical architecture & delivery",
    fields: [
      {
        id: "projectType",
        label: "Build / Engineering Focus",
        placeholder: "Select project type",
        required: true,
        options: [
          "New Web / SaaS Platform",
          "Mobile Application (iOS / Android)",
          "Managed Software & Ongoing Releases",
          "ERP / CRM / Internal Operations Portal",
          "API & Systems Integration",
        ],
      },
      {
        id: "stage",
        label: "Current Product Stage",
        placeholder: "Select stage",
        options: [
          "Greenfield (Starting from scratch)",
          "Scaling / Feature Expansion",
          "Legacy Modernization / Migration",
          "Takeover & Managed Maintenance",
        ],
      },
    ],
    budgetLabel: "Project Budget",
    budgetOptions: DEFAULT_BUDGET,
    timelineLabel: "Delivery Timeline",
    timelineOptions: DEFAULT_TIMELINE,
    messageLabel: "Technical scope & deliverables",
    messagePlaceholder:
      "Share your product goals, key integrations, expected users, and any existing codebase or designs…",
  },

  cloudDevops: {
    key: "cloudDevops",
    badge: "Cloud & DevOps",
    subtitlePrefix: "Infrastructure & reliability intake",
    fields: [
      {
        id: "infraFocus",
        label: "Cloud & DevOps Focus",
        placeholder: "Select primary need",
        required: true,
        options: [
          "AWS / GCP / Azure Architecture",
          "Kubernetes & Container Orchestration",
          "CI/CD & Release Automation",
          "MLOps & Model Serving",
          "Security, Compliance & Cloud FinOps",
        ],
      },
      {
        id: "cloudProvider",
        label: "Current Cloud Environment",
        placeholder: "Select environment",
        options: [
          "Amazon Web Services (AWS)",
          "Google Cloud (GCP)",
          "Microsoft Azure",
          "Multi-Cloud / Hybrid",
          "On-Premise Migration",
        ],
      },
    ],
    budgetLabel: "Estimated Budget",
    budgetOptions: DEFAULT_BUDGET,
    timelineLabel: "Target Timeline",
    timelineOptions: DEFAULT_TIMELINE,
    messageLabel: "Infrastructure & SLA goals",
    messagePlaceholder:
      "Describe your current cloud setup, uptime/SLA targets, compliance requirements, and bottlenecks…",
  },

  growthMarketing: {
    key: "growthMarketing",
    badge: "Growth & Revenue",
    subtitlePrefix: "Outcome & pipeline scoping",
    fields: [
      {
        id: "growthGoal",
        label: "Primary Growth Objective",
        placeholder: "Select outcome",
        required: true,
        options: [
          "Qualified B2B Pipeline & Lead Gen",
          "SEO / Organic & AI Search (AEO)",
          "Paid Acquisition & ROAS Optimization",
          "Conversion Rate & Funnel Optimization",
          "Results on Delivery (Pay on Outcome)",
        ],
      },
      {
        id: "market",
        label: "Business Model",
        placeholder: "Select your market",
        options: [
          "B2B SaaS / Enterprise",
          "E-Commerce / DTC",
          "Professional / Local Services",
          "Marketplace / Platform",
        ],
      },
    ],
    budgetLabel: "Monthly Retainer / Budget",
    budgetOptions: DEFAULT_BUDGET,
    timelineLabel: "Target Launch",
    timelineOptions: DEFAULT_TIMELINE,
    messageLabel: "Growth targets & current funnel",
    messagePlaceholder:
      "Share your current monthly pipeline/revenue, target CAC or ROAS, and channels you want to scale…",
  },

  multimediaDesign: {
    key: "multimediaDesign",
    badge: "Multimedia & Design",
    subtitlePrefix: "Creative & brand production",
    fields: [
      {
        id: "deliverable",
        label: "Creative Deliverable",
        placeholder: "Select deliverable type",
        required: true,
        options: [
          "AI-Assisted Brand & Visual Graphics",
          "Product / Explainer Video Production",
          "UI/UX Design & Design System",
          "Performance Ad Creatives",
          "3D & Motion Graphics",
        ],
      },
      {
        id: "cadence",
        label: "Production Cadence",
        placeholder: "Select scope",
        options: [
          "Single Campaign / Launch",
          "Monthly Creative Retainer",
          "Full Brand & Product Overhaul",
        ],
      },
    ],
    budgetLabel: "Creative Budget",
    budgetOptions: DEFAULT_BUDGET,
    timelineLabel: "Delivery Window",
    timelineOptions: DEFAULT_TIMELINE,
    messageLabel: "Creative brief & references",
    messagePlaceholder:
      "Describe your brand guidelines, target audience, formats needed, and any reference links…",
  },

  businessAdvisory: {
    key: "businessAdvisory",
    badge: "Business & Intelligence",
    subtitlePrefix: "Enterprise & BI scoping",
    fields: [
      {
        id: "advisoryFocus",
        label: "Business / BI Focus",
        placeholder: "Select focus area",
        required: true,
        options: [
          "Business Intelligence & Executive Dashboards",
          "Operations & Process Optimization",
          "Revenue & Financial Modeling",
          "Enterprise Strategy & Governance",
        ],
      },
      {
        id: "orgSize",
        label: "Organization Size",
        placeholder: "Select company stage",
        options: [
          "Startup (Seed – Series A)",
          "Growth / Mid-Market (50–500)",
          "Enterprise (500+ employees)",
        ],
      },
    ],
    budgetLabel: "Engagement Budget",
    budgetOptions: DEFAULT_BUDGET,
    timelineLabel: "Timeline",
    timelineOptions: DEFAULT_TIMELINE,
    messageLabel: "Objectives & key KPIs",
    messagePlaceholder:
      "Describe the decisions you want to improve, data sources involved, and key stakeholders…",
  },

  general: {
    key: "general",
    badge: "Custom Scope",
    subtitlePrefix: "Tailored expert response",
    fields: [],
    budgetLabel: "Budget range",
    budgetOptions: DEFAULT_BUDGET,
    timelineLabel: "Timeline",
    timelineOptions: DEFAULT_TIMELINE,
    messageLabel: "What do you need?",
    messagePlaceholder:
      "Describe your goals, current systems, and what success looks like…",
  },
};

/**
 * Resolves the most relevant form profile for whatever option, service,
 * solution, division, or talent program the user clicked from.
 */
export function resolveLeadFormProfile(context?: string): OptionFormProfile {
  const c = (context ?? "").toLowerCase();
  if (!c) return PROFILES.general;

  if (
    /train[\s-]*to[\s-]*hire|cohort|trained|curriculum|bootcamp|upskill|apprentice|learning|academy/.test(
      c
    )
  ) {
    return PROFILES.trainToHire;
  }

  if (
    /hire|talent|staff|recruit|bench|placement|candidate|dedicated team|workforce|employer/.test(
      c
    )
  ) {
    return PROFILES.hireTalent;
  }

  if (
    /\bai\b|agent|automation|llm|rag|chatbot|copilot|workflow|rpa|voice|genai|machine learning/.test(
      c
    )
  ) {
    return PROFILES.aiAutomation;
  }

  if (
    /cloud|devops|mlops|kubernetes|aws|azure|gcp|security|infra|ci\/cd|cicd|sre/.test(
      c
    )
  ) {
    return PROFILES.cloudDevops;
  }

  if (
    /revenue|growth|marketing|seo|aeo|ads|campaign|lead|sales|pipeline|conversion|results on delivery|rodaas/.test(
      c
    )
  ) {
    return PROFILES.growthMarketing;
  }

  if (
    /multimedia|graphic|video|design|ui\/ux|brand|creative|3d|motion|animation/.test(
      c
    )
  ) {
    return PROFILES.multimediaDesign;
  }

  if (
    /software|saas|web|mobile|app|api|erp|crm|programming|engineering|platform|migration|tech/.test(
      c
    )
  ) {
    return PROFILES.softwareEngineering;
  }

  if (
    /business|enterprise|bi\b|intelligence|analytics|data|strategy|operations|finance|consulting/.test(
      c
    )
  ) {
    return PROFILES.businessAdvisory;
  }

  return PROFILES.general;
}
