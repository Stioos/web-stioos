import type { MarketRequestStatus, RequestKind } from "@/types";

/**
 * Single source of truth for the buyer-side talent offerings. Both the buyer
 * "Talent Services" page (request forms) and the admin "Service Requests" hub
 * (pipeline + structured detail view) read from these definitions, so a field
 * added here shows up on both sides automatically.
 */

export interface RequestKindField {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface RequestKindDef {
  kind: RequestKind;
  label: string;
  tagline: string;
  description: string;
  /** lucide icon component name (mapped to components in the UI layer) */
  icon: string;
  deliverables: string[];
  fields: RequestKindField[];
}

export const REQUEST_STATUS_FLOW: MarketRequestStatus[] = [
  "open",
  "in_review",
  "in_progress",
  "fulfilled",
];

export const REQUEST_STATUS_LABELS: Record<MarketRequestStatus, string> = {
  open: "Open",
  in_review: "In review",
  in_progress: "In progress",
  fulfilled: "Fulfilled",
  rejected: "Rejected",
  closed: "Closed",
};

/** Friendly labels for every kind, including generic marketplace requests. */
export const KIND_LABELS: Record<RequestKind, string> = {
  service: "Marketplace Service",
  "train-to-hire": "Train to Hire",
  "hire-to-train": "Hire to Train",
  "talent-sourcing": "Talent Sourcing",
  "end-to-end-staffing": "End to End Staffing",
  "post-a-job": "Post a Job",
};

export const TALENT_REQUEST_KINDS: RequestKindDef[] = [
  {
    kind: "train-to-hire",
    label: "Train to Hire",
    tagline: "Hire for aptitude, we train for the role",
    description:
      "Hire promising candidates on aptitude and attitude first, then our delivery mentors train them on your stack, your processes and your standards into the exact role you need filled.",
    icon: "UserCheck",
    deliverables: [
      "Role-specific screening of candidates you shortlist or source",
      "Structured ramp plan with weekly mentor syncs",
      "Certification on your production stack",
      "90-day quality and continuity monitoring",
    ],
    fields: [
      { key: "headcount", label: "Candidates to train", type: "number", placeholder: "e.g. 6", required: true },
      { key: "skills", label: "Stack / skills to certify", type: "text", placeholder: "e.g. React, Node.js, AWS", required: true },
      {
        key: "workMode",
        label: "Work mode",
        type: "select",
        options: ["Onsite", "Hybrid", "Remote"],
        required: true,
      },
      { key: "startDate", label: "Preferred start", type: "text", placeholder: "e.g. Q1 2027" },
    ],
  },
  {
    kind: "hire-to-train",
    label: "Hire to Train",
    tagline: "We source, screen and train — you interview the finished engineer",
    description:
      "Our sourcing engine finds candidates against your role scorecard, screens them on how they think, and puts them through a production-grade training track before they ever sit an interview with you.",
    icon: "GraduationCap",
    deliverables: [
      "Sourcing from a verified, pre-assessed candidate pool",
      "Role scorecard calibrated with your leads",
      "Training track with lab-backed curriculum",
      "Interview-ready shortlist with assessment reports",
    ],
    fields: [
      { key: "openings", label: "Openings", type: "number", placeholder: "e.g. 4", required: true },
      { key: "domain", label: "Training domain", type: "text", placeholder: "e.g. Data Engineering", required: true },
      {
        key: "programDuration",
        label: "Program duration",
        type: "select",
        options: ["4 weeks", "8 weeks", "12 weeks", "16 weeks", "24 weeks"],
        required: true,
      },
      { key: "location", label: "Location", type: "text", placeholder: "e.g. Bengaluru, IN" },
    ],
  },
  {
    kind: "talent-sourcing",
    label: "Talent Sourcing",
    tagline: "AI-powered sourcing from 2M+ verified candidates",
    description:
      "Tell us the role and the bar — our AI-powered sourcing runs across 2M+ verified profiles and returns a 48-hour SLA shortlist with live rate benchmarks and compliance pre-cleared.",
    icon: "Search",
    deliverables: [
      "48-hour shortlist SLA backed by a pre-vetted bench",
      "Compliance cleared before submission",
      "Live rate benchmarks for every profile",
      "90-day replacement guarantee in standard terms",
    ],
    fields: [
      { key: "positions", label: "Positions", type: "number", placeholder: "e.g. 3", required: true },
      {
        key: "seniority",
        label: "Seniority",
        type: "select",
        options: ["Junior", "Mid", "Senior", "Lead", "Principal"],
        required: true,
      },
      {
        key: "employmentType",
        label: "Employment type",
        type: "select",
        options: ["Contract", "Contract-to-hire", "Permanent"],
        required: true,
      },
      { key: "skills", label: "Must-have skills", type: "text", placeholder: "e.g. Python, dbt, Snowflake", required: true },
    ],
  },
  {
    kind: "end-to-end-staffing",
    label: "End to End Staffing",
    tagline: "A complete team, scoped, staffed and managed",
    description:
      "From role definition to onboarding and ongoing management — we assemble, staff and run complete delivery pods inside your rituals, with an engagement lead running quality and continuity in the background.",
    icon: "Users",
    deliverables: [
      "Team scoping workshop and role matrix",
      "End-to-end hiring, onboarding and payroll",
      "Named engagement lead for quality and continuity",
      "Flexible scale-up / scale-down by sprint",
    ],
    fields: [
      { key: "teamSize", label: "Team size", type: "number", placeholder: "e.g. 12", required: true },
      {
        key: "engagementModel",
        label: "Engagement model",
        type: "select",
        options: ["Managed pod", "Staff augmentation", "Project team"],
        required: true,
      },
      { key: "roles", label: "Roles needed", type: "text", placeholder: "e.g. 6 engineers, 4 analysts, 2 leads", required: true },
      { key: "locations", label: "Location(s)", type: "text", placeholder: "e.g. Pune, IN" },
    ],
  },
  {
    kind: "post-a-job",
    label: "Post a Job",
    tagline: "One post, matched against the verified talent pool",
    description:
      "Publish your role directly to the STIOOS talent pool. Every applicant is identity-verified and skill-assessed before their profile reaches your inbox — no CV noise.",
    icon: "Briefcase",
    deliverables: [
      "Role published to the verified talent pool",
      "Identity and skill screening on every applicant",
      "Ranked shortlist straight to your dashboard",
      "Assessment reports attached to each profile",
    ],
    fields: [
      { key: "openings", label: "Openings", type: "number", placeholder: "e.g. 2", required: true },
      {
        key: "employmentType",
        label: "Employment type",
        type: "select",
        options: ["Full-time", "Part-time", "Contract", "Internship"],
        required: true,
      },
      { key: "salaryRange", label: "Salary range", type: "text", placeholder: "e.g. $120k – $150k", required: true },
      { key: "location", label: "Job location", type: "text", placeholder: "e.g. Remote (EU)" },
    ],
  },
];

export const REQUEST_KIND_DEFS: Record<RequestKind, RequestKindDef | undefined> =
  TALENT_REQUEST_KINDS.reduce(
    (acc, def) => {
      acc[def.kind] = def;
      return acc;
    },
    {} as Record<RequestKind, RequestKindDef | undefined>
  );

/** Generates a human-friendly tracking reference, e.g. REQ-8F3K2. */
export function newRequestReference(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `REQ-${out}`;
}
