import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers,
  Rocket,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  TALENT_STRIP_GROUPS,
  type TalentStripGroup,
  type TalentSubPage,
} from "@/data/talent-strip-groups";

// ============================================================
// CANDIDATE SUB-PAGES — 9 candidate-focused pages (3 groups × 3
// pages each) rendered at /talent-solutions/[group]/[sub].
//
// The group + sub-page identity (slug, title, stripLabel,
// description, icon) lives in src/data/talent-strip-groups.ts.
// This file adds the ENGAGING CONTENT for each of the 9 pages:
//   • heroStats       (3)
//   • overview        (2 paragraphs)
//   • capabilities    (6 cards — "What you'll learn/get")
//   • process         (4 steps — Apply → Screen → Engage → Result)
//   • benefits        (4 outcome stat cards)
//   • faqs            (5 AEO-optimized Q&As)
//   • ctaKicker/Title (CTA band)
//
// The content is rendered by <CandidateSubPage /> in
// src/components/page-builder/candidate-sub-page.tsx — a lighter
// template (7 sections) than the 24-section PageBuilder used for
// the existing /talent-solutions/[slug] pages.
// ============================================================

export type IconName = string; // resolved via <Icon name> registry

export interface CandidateHeroStat {
  value: string;
  label: string;
  detail: string;
}

export interface CandidateCapability {
  icon: IconName;
  title: string;
  description: string;
}

export interface CandidateProcessStep {
  step: string; // "01"
  title: string;
  duration: string; // "Day 0" | "Week 1-12" etc
  description: string;
}

export interface CandidateBenefit {
  value: string;
  label: string;
  description: string;
}

export interface CandidateFaq {
  q: string;
  a: string;
}

// ============================================================
// SHARED SECTION CONTENT — used by the 5 new sections (8–12)
// added to <CandidateSubPage />. Trust badges, comparison rows,
// industries and guarantees are platform-wide (identical across
// all 9 candidate sub-pages). Audiences vary by parent group.
// ============================================================

/** One trust badge in the horizontal trust strip (section 7). */
export interface CandidateTrustBadge {
  /** Lucide icon key resolved via <Icon name> registry */
  icon: IconName;
  label: string;
}

/** One row in the with/without comparison table (section 9). */
export interface CandidateComparisonRow {
  /** The dimension being compared, e.g. "Time to results" */
  dimension: string;
  /** The traditional / without-STIOOS side */
  traditional: string;
  /** The with-STIOOS side */
  withUs: string;
}

/** One industry card (section 10). */
export interface CandidateIndustry {
  icon: IconName;
  name: string;
}

/** One guarantee card (section 11). */
export interface CandidateGuarantee {
  icon: IconName;
  title: string;
  description: string;
}

/** One audience card — "For Job Seekers" or "For Employers" (section 8). */
export interface CandidateAudience {
  /** Lucide icon key resolved via <Icon name> registry */
  icon: IconName;
  /** Short kicker label, e.g. "For Job Seekers" */
  kicker: string;
  /** Card heading */
  title: string;
  /** One-line description */
  description: string;
  /** 4 bullet points */
  bullets: string[];
  /** CTA label */
  ctaLabel: string;
  /** CTA href */
  ctaHref: string;
}

export interface CandidateSubPageContent {
  /** Parent group slug — "get-trained" | "get-placed" | "get-certified" */
  groupSlug: string;
  /** Sub-page slug within the group */
  subSlug: string;
  /** Eyebrow kicker label shown in the hero (e.g. "Get Trained · For Job Seekers") */
  heroEyebrow: string;
  /** Hero subtitle (description from talent-strip-groups.ts) */
  heroSubtitle: string;
  /** 3 hero stats */
  heroStats: CandidateHeroStat[];
  /** Overview — 2 paragraphs */
  overview: { p1: string; p2: string };
  /** "What you'll learn/get" — 6 capability cards */
  capabilities: CandidateCapability[];
  /** "Process" — 4-step timeline */
  process: CandidateProcessStep[];
  /** "Benefits" — 4 outcome stat cards */
  benefits: CandidateBenefit[];
  /** 5 candidate-focused FAQs */
  faqs: CandidateFaq[];
  /** CTA band */
  ctaKicker: string;
  ctaTitle: string;
}

// ============================================================
// 9 CANDIDATE SUB-PAGE CONTENT BLOCKS
// Each block is keyed by `<groupSlug>/<subSlug>`.
// ============================================================

const CONTENT: Record<string, CandidateSubPageContent> = {
  // ─────────────── Get Trained ───────────────

  "get-trained/custom-cohort-curriculum": {
    groupSlug: "get-trained",
    subSlug: "custom-cohort-curriculum",
    heroEyebrow: "Get Trained · For Job Seekers",
    heroSubtitle:
      "Co-designed curriculum built around your target role — your tools, your conventions, your workflows. Not a generic bootcamp.",
    heroStats: [
      {
        value: "8–12 wks",
        label: "Role-aligned ramp",
        detail: "Average time from intake to job-ready, scoped to a specific role track.",
      },
      {
        value: "96%",
        label: "Capstone pass rate",
        detail: "Cohort graduates who clear the mentor + client capstone review.",
      },
      {
        value: "50+",
        label: "Stack-specific modules",
        detail: "Per role track — React, Next.js, Python, AWS, Kubernetes and more.",
      },
    ],
    overview: {
      p1: "We don't run generic bootcamps. Your curriculum is co-designed with senior mentors and aligned to a specific role — frontend engineer, data analyst, AI engineer, cloud DevOps — then rebuilt around the exact tools, libraries, conventions and workflows that role demands. Every module is scored against a real job description, not a syllabus template.",
      p2: "You won't just learn JavaScript — you'll learn the React + Next.js + TypeScript patterns your hiring manager expects. By graduation, you've shipped production-shaped code in the stack you'll be hired to work in, with a capstone graded by industry practitioners. You join your future team as a contributor, not a beginner.",
    },
    capabilities: [
      {
        icon: "Target",
        title: "Role profile workshops",
        description:
          "Map your target job description to specific skill modules — every learning hour serves a skill the JD actually asks for.",
      },
      {
        icon: "BookOpen",
        title: "Stack-specific modules",
        description:
          "React/Next.js, Python/FastAPI, AWS, Kubernetes, Snowflake — the exact stack your future team runs in production.",
      },
      {
        icon: "Code",
        title: "Mentor-led live coding",
        description:
          "Daily pairing sessions with a senior mentor. You write code, your mentor reviews it, you ship to a real repo.",
      },
      {
        icon: "ClipboardCheck",
        title: "Weekly checkpoint reviews",
        description:
          "Each sprint ends with a graded checkpoint against real industry rubrics. Don't pass? You redo the sprint, not the cohort.",
      },
      {
        icon: "Wrench",
        title: "Client-shaped capstone",
        description:
          "Build what your future team builds — production architecture, CI/CD, observability, code review. Not a toy app.",
      },
      {
        icon: "BrainCircuit",
        title: "Stack-specific interview drills",
        description:
          "LeetCode + system design + behavioral drills calibrated to your target company's question patterns.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Apply online",
        duration: "Day 0",
        description:
          "Submit your application with role preference, target stack and prior experience. Confirmation within 24 hours.",
      },
      {
        step: "02",
        title: "AI screen + role match",
        duration: "Day 1–5",
        description:
          "AI-scored aptitude and technical screen maps you to the right starting track and mentor ratio for your target role.",
      },
      {
        step: "03",
        title: "Mentor-led training sprints",
        duration: "Week 1–12",
        description:
          "2-week sprints with weekly checkpoint reviews, live coding and capstone prep — graded against real industry rubrics.",
      },
      {
        step: "04",
        title: "Capstone + placement",
        duration: "After Week 12",
        description:
          "Defend your capstone to mentor + client reviewers, then enter the placement pool with a verified competency profile.",
      },
    ],
    benefits: [
      {
        value: "96%",
        label: "Capstone pass rate",
        description: "Cohort graduates who clear mentor + client capstone review.",
      },
      {
        value: "8–12 wks",
        label: "Average ramp time",
        description: "From intake to job-ready, scoped to one role track.",
      },
      {
        value: "3+",
        label: "Portfolio projects shipped",
        description: "Real client-shaped repos with README, tests and deploy.",
      },
      {
        value: "94%",
        label: "Job-ready score",
        description: "Composite readiness score across skills, communication and delivery.",
      },
    ],
    faqs: [
      {
        q: "Do I need to know my target role before joining?",
        a: "Not necessarily — you can apply with a role preference and we'll confirm or refine it during the AI screening + role match step. If you're undecided between two adjacent tracks (e.g. backend vs. DevOps), the screener maps your aptitude profile to the track where you're most likely to succeed and land a role fastest.",
      },
      {
        q: "What if my target role changes mid-cohort?",
        a: "You can switch tracks once during the first 4 weeks without restarting. After Week 4, the modules diverge enough that switching means repeating the new track's earlier sprints — we'll work with you on a revised timeline. Most role switches happen during the screening step, not mid-cohort, because the AI match is calibrated against real job market data.",
      },
      {
        q: "Are the modules self-paced or live?",
        a: "Both. Live mentor-led sessions run Monday to Friday (typically 9am–5pm IST, with evening cohorts for working professionals). Recordings are available within 2 hours. Self-paced curated courses layer on top — you complete ~1 hour per day of external material that feeds the next day's live session.",
      },
      {
        q: "Is there a fee if I don't get placed?",
        a: "Training fees for the candidate-side Get Trained track are success-based — you pay only after you accept a placed offer and complete 90 days in the role. If you complete the cohort but don't get placed, you don't pay. Specific terms are documented in the Joining Terms page (joining-fee, bond, conversion, refund).",
      },
      {
        q: "Can I see a sample curriculum before applying?",
        a: "Yes — book a discovery call and we'll walk you through a real 12-week ramp for your target role, including the sprint breakdown, the capstone brief and the assessment rubrics. You'll see exactly what you'll learn and how it's scored before you commit.",
      },
    ],
    ctaKicker: "Build the skills your future team runs on",
    ctaTitle: "Ready to get trained on your exact stack?",
  },

  "get-trained/ai-candidate-screening": {
    groupSlug: "get-trained",
    subSlug: "ai-candidate-screening",
    heroEyebrow: "Get Trained · For Job Seekers",
    heroSubtitle:
      "AI-scored aptitude, communication and technical screens that match you to the perfect training program before you start.",
    heroStats: [
      {
        value: "70+/100",
        label: "Aptitude threshold",
        detail: "Minimum score across numerical, logical, verbal and role-specific reasoning.",
      },
      {
        value: "60%",
        label: "Top filter rate",
        detail: "Of applicants advance past the AI screen to the human panel round.",
      },
      {
        value: "24h",
        label: "Screen turnaround",
        detail: "From application submission to AI screen result, with a written profile.",
      },
    ],
    overview: {
      p1: "Before you start training, we want to know you can finish it. Every candidate clears AI-scored aptitude, communication and technical screens — a 70/100 minimum across numerical, logical, verbal and role-specific reasoning. The screen is proctored, scored against industry benchmarks, and produces a written competency profile you keep.",
      p2: "The screening isn't a gatekeeper — it's a placement tool. Your score maps to the right starting track, the right mentor ratio, and the right program duration. Stronger communicators go to client-facing tracks; stronger analytical scorers go to engineering tracks. You start where you're most likely to succeed, not where the next cohort has seats.",
    },
    capabilities: [
      {
        icon: "BrainCircuit",
        title: "AI-proctored aptitude tests",
        description:
          "Numerical, logical and verbal reasoning — 90-minute proctored session with anti-cheat and integrity scoring.",
      },
      {
        icon: "MessageSquare",
        title: "Communication scoring",
        description:
          "CEFR B2 English plus one regional language. Speaking, writing and listening scored by AI + human review.",
      },
      {
        icon: "Code",
        title: "Role-specific technical screens",
        description:
          "30+ role tracks — frontend, backend, DevOps, data, AI/ML, mobile, QA. Calibrated to your target stack.",
      },
      {
        icon: "Network",
        title: "Skill-graph profiling",
        description:
          "Map your declared skills to a verified competency graph. We surface skills you have but undervalue.",
      },
      {
        icon: "Users",
        title: "Cultural-fit assessment",
        description:
          "Work-style preferences and team-fit signals — used for placement matching, never as a filter.",
      },
      {
        icon: "ShieldCheck",
        title: "Human panel round",
        description:
          "Final 30-minute mentor interview. Records your strengths, gaps and recommended starting track in writing.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Apply online",
        duration: "Day 0",
        description:
          "Submit your application with role preference, declared skills and resume. Receive a screening slot within 24 hours.",
      },
      {
        step: "02",
        title: "AI screen",
        duration: "Day 1–2",
        description:
          "90-minute proctored aptitude test + 30-minute communication assessment + role-specific technical screen.",
      },
      {
        step: "03",
        title: "Profile + track match",
        duration: "Day 3",
        description:
          "Your score maps to the right starting track, mentor ratio and program duration. Receive a written profile.",
      },
      {
        step: "04",
        title: "Human panel + offer",
        duration: "Day 4–7",
        description:
          "30-minute mentor interview. If you clear it, you receive a program offer with your track, start date and bond terms.",
      },
    ],
    benefits: [
      {
        value: "70+/100",
        label: "Aptitude threshold",
        description: "Verified minimum score across reasoning, language and role-specific skills.",
      },
      {
        value: "60%",
        label: "Top filter rate",
        description: "Of applicants advance to the human panel round.",
      },
      {
        value: "24h",
        label: "Screen turnaround",
        description: "From application to AI screen result, with a written profile.",
      },
      {
        value: "200+",
        label: "Skill tracks mapped",
        description: "Your profile maps to 200+ verified skill tracks for placement matching.",
      },
    ],
    faqs: [
      {
        q: "What if I don't pass the screen first time?",
        a: "You can retake the screen once after a 14-day prep window — we send you a personalized study plan based on your first attempt's gap areas. If you don't pass the retake, we'll route you to a foundational track (typically 4 weeks longer) that builds the skills the screen flagged. About 1 in 5 applicants take the foundational route and still graduate.",
      },
      {
        q: "Is the AI screen free?",
        a: "Yes — the initial AI screen (aptitude + communication + role-specific technical) is free for every applicant. You only pay program fees after you accept a placed offer and complete 90 days in the role. There are no screening fees, interview fees or shortlist fees at any stage.",
      },
      {
        q: "Can I retake the screen to improve my score?",
        a: "You get one retake after the 14-day prep window. Your higher score stands. If you've already cleared the threshold and want to improve your track placement, the retake is also free — we want you to start in the track where you'll succeed, not the track your first attempt suggested.",
      },
      {
        q: "What does the AI actually measure?",
        a: "Four things: numerical reasoning (data interpretation, percentages, ratios), logical reasoning (pattern recognition, syllogisms, sequences), verbal reasoning (reading comprehension, vocabulary, argument analysis), and role-specific technical fundamentals (e.g. JavaScript basics for frontend, SQL for data). Communication is scored separately — CEFR B2 in English plus one regional language.",
      },
      {
        q: "How does my score affect my training track?",
        a: "The score drives three things: starting track (frontend vs. backend vs. data vs. DevOps vs. AI), mentor ratio (1:6 for stronger scorers, 1:4 for foundational), and program duration (8 weeks for advanced, 12 weeks for standard, 16 weeks for foundational). You'll see your recommended track before you accept your program offer.",
      },
    ],
    ctaKicker: "Start where you'll succeed",
    ctaTitle: "Get matched to the right program in 24 hours",
  },

  "get-trained/training-sprint-delivery": {
    groupSlug: "get-trained",
    subSlug: "training-sprint-delivery",
    heroEyebrow: "Get Trained · For Job Seekers",
    heroSubtitle:
      "Mentor-led sprints with weekly checkpoints, real client-shaped projects, and job-ready capstones assessed by industry practitioners.",
    heroStats: [
      {
        value: "12 wks",
        label: "Sprint program duration",
        detail: "6 sprints × 2 weeks each, with a final capstone sprint graded by mentor + client.",
      },
      {
        value: "1:10",
        label: "Mentor ratio",
        detail: "Senior mentor per cohort. Peer mentors at 1:3. Buddies at 1:1.",
      },
      {
        value: "85%",
        label: "Min attendance",
        detail: "Biometric + LMS login. Below 85% triggers mentor review and may delay conversion.",
      },
    ],
    overview: {
      p1: "Training is delivered in 2-week sprints — each sprint ships a checkpoint deliverable graded against a real industry rubric. You don't move forward until you've demonstrated mastery of the current sprint's skills, and every sprint ends with a written review shared with you and your mentor.",
      p2: "Every sprint includes mentor-led live coding, peer pairing, real client-shaped projects, and end-of-sprint reviews. Your mentor reviews your code, your peers review your PRs, and your final capstone is graded by industry practitioners — not just your training staff. By graduation, you've shipped 3+ projects to a public repo with README, tests, and deployment.",
    },
    capabilities: [
      {
        icon: "Rocket",
        title: "2-week sprints",
        description:
          "Checkpoint-driven progress. Each sprint ships a deliverable graded against real industry rubrics.",
      },
      {
        icon: "Code",
        title: "Mentor-led live coding",
        description:
          "Daily pairing sessions with a senior mentor. Code review on every PR. Real repo, real git history.",
      },
      {
        icon: "Wrench",
        title: "Real client-shaped projects",
        description:
          "Not toy apps. Production architecture, CI/CD, observability, incident response — what your future team builds.",
      },
      {
        icon: "BarChart3",
        title: "Weekly progress telemetry",
        description:
          "Attendance, assessment scores, PR velocity, readiness score — visible to you and your mentor, weekly.",
      },
      {
        icon: "Trophy",
        title: "Job-ready capstone",
        description:
          "Final sprint capstone graded by mentor + client reviewer across architecture, delivery, quality and presentation.",
      },
      {
        icon: "Star",
        title: "Industry-practitioner assessors",
        description:
          "Senior engineers from partner employers grade your capstone — not training staff. Real bar, real feedback.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Apply + AI screen",
        duration: "Day 0–5",
        description:
          "Submit your application, clear the AI screen, get matched to a track and start-date. Offer letter within 7 days.",
      },
      {
        step: "02",
        title: "Sprint 01–02: Foundations",
        duration: "Week 1–4",
        description:
          "Stack fundamentals, dev environment setup, first solo project shipped to a public repo with tests and CI.",
      },
      {
        step: "03",
        title: "Sprint 03–05: Real projects",
        duration: "Week 5–10",
        description:
          "Pair projects, client-shaped architecture, code review rotation, production deployment, observability drills.",
      },
      {
        step: "04",
        title: "Sprint 06: Capstone",
        duration: "Week 11–12",
        description:
          "Solo capstone on a real workflow, defended to mentor + client reviewer. Pass → enter placement pool.",
      },
    ],
    benefits: [
      {
        value: "85%",
        label: "Min attendance",
        description: "Biometric + LMS login. Below 85% triggers mentor review and may delay conversion.",
      },
      {
        value: "1:10",
        label: "Mentor ratio",
        description: "Senior mentor per cohort. Peer mentors at 1:3 and buddies at 1:1.",
      },
      {
        value: "6+",
        label: "Sprints per cohort",
        description: "Each sprint ships a graded checkpoint. Don't pass? You redo the sprint, not the cohort.",
      },
      {
        value: "94%",
        label: "Job-ready graduation rate",
        description: "Cohort graduates who clear the capstone and enter the placement pool.",
      },
    ],
    faqs: [
      {
        q: "What happens if I miss a sprint checkpoint?",
        a: "You get one automatic extension (typically 3 days) per sprint no questions asked. After that, missing a checkpoint triggers a mentor review — we'll diagnose whether it's a skill gap (you redo the sprint), a time issue (you move to a part-time cohort) or a personal issue (you pause and rejoin the next cohort). About 1 in 8 candidates use an extension; very few repeat sprints.",
      },
      {
        q: "Are sessions live or recorded?",
        a: "Both. Live sessions run Mon–Fri (typically 9am–5pm IST, with evening cohorts for working professionals). Recordings are posted within 2 hours. You can attend live or watch recordings, but live attendance counts toward your 85% minimum and recorded-only attendance doesn't — the live format is where mentor pairing and code review happen.",
      },
      {
        q: "How is my progress tracked?",
        a: "Three layers: (1) attendance via biometric + LMS login, (2) assessment scores from sprint checkpoint rubrics, (3) PR velocity from your GitHub commits and review turnarounds. All three roll up into a weekly readiness score (0–100) that you and your mentor review every Friday. Below 70 triggers an intervention plan.",
      },
      {
        q: "What if I need extra help on a sprint?",
        a: "Three escalation paths: peer mentor (1:3 ratio, daily pairing), buddy (1:1, same cohort), and senior mentor office hours (3 hours/week). If you're still stuck, the senior mentor can prescribe a 1:1 tutor session — free, up to 4 hours per cohort. The point is: nobody fails silently. Help is always one Slack message away.",
      },
      {
        q: "How is the capstone graded?",
        a: "Four dimensions, each scored 0–25 by your mentor + a senior engineer from a partner employer: architecture (does it scale?), delivery (did you ship on time?), quality (tests, code review, observability) and presentation (can you defend your decisions?). You need 75/100 to pass. Below 75 → two-week extension to revise. Below 60 → repeat the capstone sprint.",
      },
    ],
    ctaKicker: "Learn by building real projects",
    ctaTitle: "Ship 3+ portfolio projects in 12 weeks",
  },

  // ─────────────── Get Placed ───────────────

  "get-placed/browse-open-roles": {
    groupSlug: "get-placed",
    subSlug: "browse-open-roles",
    heroEyebrow: "Get Placed · For Job Seekers",
    heroSubtitle:
      "AI-matched live openings across 500+ employers — filter by role, stack, location, and salary. New roles added daily.",
    heroStats: [
      {
        value: "500+",
        label: "Employers hiring",
        detail: "Startups, enterprises and consulting firms actively hiring from the STIOOS pool.",
      },
      {
        value: "2M+",
        label: "Active openings",
        detail: "Live openings across AI, tech, business and enterprise roles — refreshed daily.",
      },
      {
        value: "Daily",
        label: "New roles added",
        detail: "Fresh pipeline every 24 hours. You see new roles before they hit public job boards.",
      },
    ],
    overview: {
      p1: "AI-matched live openings across 500+ employers — filter by role, stack, location, salary, experience level and remote policy. New roles are added daily from our partner network of startups, enterprises and consulting firms. You see roles before they hit public job boards.",
      p2: "Every role is matched against your verified skills profile, your capstone scores and your mentor's recommendation. You don't apply blind — you apply to roles where you're already a 70%+ match, with a Recommended Candidate badge that puts you at the top of the employer's queue. Employers trust the match because the scores are AI-verified and cryptographically signed.",
    },
    capabilities: [
      {
        icon: "Briefcase",
        title: "AI-matched live openings",
        description:
          "500+ employers, 2M+ openings. Match score computed from your verified skills, capstone and mentor rec.",
      },
      {
        icon: "Filter",
        title: "Filter by every dimension",
        description:
          "Role, stack, location, salary, experience level, remote policy, visa sponsorship, equity offered.",
      },
      {
        icon: "BadgeCheck",
        title: "Verified skills profile",
        description:
          "Your scores are cryptographically signed — employers can verify them without taking our word for it.",
      },
      {
        icon: "Star",
        title: "Recommended Candidate badge",
        description:
          "When you're a 70%+ match, you get a badge that puts you at the top of the employer's candidate queue.",
      },
      {
        icon: "Zap",
        title: "Direct application",
        description:
          "No middleman recruiter. You apply directly to the hiring manager with your verified profile attached.",
      },
      {
        icon: "RefreshCw",
        title: "New roles added daily",
        description:
          "Fresh pipeline every 24 hours from partner employers. Set alerts for your top 3 role types.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Apply + complete training",
        duration: "Week 0–12",
        description:
          "Enter through Get Trained (or directly if you're an external candidate with a verified profile).",
      },
      {
        step: "02",
        title: "Build verified profile",
        duration: "Week 12",
        description:
          "Capstone scores, skills assessment, mentor recommendation and verified competency profile go live.",
      },
      {
        step: "03",
        title: "Get AI-matched",
        duration: "Week 13+",
        description:
          "AI matches you to live openings where you're a 70%+ match. Recommended Candidate badge activates.",
      },
      {
        step: "04",
        title: "Apply + get hired",
        duration: "Week 13–18",
        description:
          "Apply directly to hiring managers. Median time-to-offer for matched candidates: 21 days.",
      },
    ],
    benefits: [
      {
        value: "500+",
        label: "Hiring employers",
        description: "Startups, enterprises and consulting firms actively hiring from the STIOOS pool.",
      },
      {
        value: "2M+",
        label: "Active openings",
        description: "Live openings across AI, tech, business and enterprise roles.",
      },
      {
        value: "Daily",
        label: "New roles added",
        description: "Fresh pipeline every 24 hours from partner employers.",
      },
      {
        value: "70%+",
        label: "Match threshold",
        description: "You only apply to roles where you're already a verified 70%+ match.",
      },
    ],
    faqs: [
      {
        q: "Do I need to be a STIOOS graduate to browse roles?",
        a: "No — external candidates with a verified skills profile (from our Skills Assessment track, or by submitting a portfolio for mentor review) can also browse and apply. STIOOS graduates get the Recommended Candidate badge automatically; external candidates earn it by completing a skills assessment.",
      },
      {
        q: "How does the AI match work?",
        a: "Three signals: (1) your verified skills profile (capstone scores, skills assessment, mentor recommendation), (2) the employer's job description parsed into a skill graph, (3) historical placement outcomes — which skills actually predicted success in similar roles at this employer. The match score is the weighted intersection. Above 70% → you get the Recommended Candidate badge.",
      },
      {
        q: "Can I apply to roles outside my track?",
        a: "Yes — but the match score will reflect it. If you trained as a frontend engineer and apply to a backend role, your match score might be 45%. You can still apply (we don't restrict applications), but you won't get the Recommended Candidate badge and the employer will see your profile flagged as 'cross-track'. Most cross-track placements happen after 6+ months in your primary role.",
      },
      {
        q: "Are the salaries verified?",
        a: "Yes — every role listing shows a verified salary range sourced from the employer's offer letter template, not a recruiter's verbal range. We audit listings quarterly against actual offer letters received by placed candidates. Discrepancies trigger an employer review. Salary ranges are non-negotiable downwards; you can negotiate upwards.",
      },
      {
        q: "How fast do employers respond?",
        a: "Median time-to-first-response for Recommended Candidates: 4 business days. Median time-to-offer: 21 days from application. Employers sign an SLA when joining the STIOOS network — 5 business day response on Recommended Candidates, or they lose their hiring badge. About 92% of partners hit the SLA.",
      },
    ],
    ctaKicker: "Apply where you're already a match",
    ctaTitle: "Browse 2M+ live openings across 500+ employers",
  },

  "get-placed/interview-preparation": {
    groupSlug: "get-placed",
    subSlug: "interview-preparation",
    heroEyebrow: "Get Placed · For Job Seekers",
    heroSubtitle:
      "AI-powered mock interviews with real-time feedback, company-specific interview playbooks, and coaching from senior practitioners.",
    heroStats: [
      {
        value: "50+",
        label: "Mock interviews per cohort",
        detail: "AI-driven mocks plus 1:1 sessions with senior practitioner coaches.",
      },
      {
        value: "4.9/5",
        label: "Coach rating",
        detail: "Average candidate rating across 12,000+ coaching sessions since 2019.",
      },
      {
        value: "92%",
        label: "Pass rate after prep",
        detail: "Of candidates who complete the prep track clear their target company's interview loop.",
      },
    ],
    overview: {
      p1: "AI-powered mock interviews with real-time feedback on structure, clarity, technical depth and communication. Every mock is scored against the rubric your target employer actually uses — not a generic interview template. You see your scores instantly, with a written breakdown of where you lost points and how to fix it.",
      p2: "Company-specific interview playbooks cover Google, Amazon, Microsoft, Flipkart, Razorpay, Zoho and 200+ more. You walk in knowing the question patterns, the system design expectations and the cultural signals that get candidates hired at that specific company. Coaches are senior practitioners who've actually interviewed at these companies — not junior recruiters reading from a script.",
    },
    capabilities: [
      {
        icon: "BrainCircuit",
        title: "AI-powered mock interviews",
        description:
          "Real-time feedback on structure, clarity, technical depth and communication. Scored against your target employer's rubric.",
      },
      {
        icon: "BookOpen",
        title: "Company-specific playbooks",
        description:
          "200+ employers — question patterns, system design expectations, cultural signals that get candidates hired.",
      },
      {
        icon: "Layers",
        title: "System design drills",
        description:
          "Production-grade system design rounds for senior roles. Real scenarios from partner employer interview banks.",
      },
      {
        icon: "MessageSquare",
        title: "Behavioral interview coaching",
        description:
          "STAR method drills, story library building, cultural-fit signals per employer. Recorded for review.",
      },
      {
        icon: "Star",
        title: "Senior practitioner coaches",
        description:
          "Coaches have actually interviewed at FAANG and top startups. Not junior recruiters reading from a script.",
      },
      {
        icon: "Video",
        title: "Recorded sessions",
        description:
          "Every mock and coaching session is recorded. Watch yourself, share with mentors, review your blind spots.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Apply + target company",
        duration: "Day 0",
        description:
          "Tell us your target company (or pick from 200+ playbooks). We pull the playbook and assign a coach.",
      },
      {
        step: "02",
        title: "Diagnostic mock",
        duration: "Day 1–3",
        description:
          "AI-driven diagnostic mock interview. Scored against your target company's rubric. Gap report generated.",
      },
      {
        step: "03",
        title: "Targeted prep + drills",
        duration: "Week 1–3",
        description:
          "Coached drills on your gap areas. 8–12 mock interviews. System design, behavioral, technical rounds.",
      },
      {
        step: "04",
        title: "Real interview + debrief",
        duration: "Week 4",
        description:
          "Walk into the real interview. Post-interview debrief with your coach — every round, every signal.",
      },
    ],
    benefits: [
      {
        value: "50+",
        label: "Mock interviews",
        description: "AI-driven mocks plus 1:1 sessions with senior practitioner coaches per cohort.",
      },
      {
        value: "4.9/5",
        label: "Coach rating",
        description: "Average candidate rating across 12,000+ coaching sessions since 2019.",
      },
      {
        value: "92%",
        label: "Pass rate after prep",
        description: "Of candidates who complete the prep track clear their target company's interview loop.",
      },
      {
        value: "200+",
        label: "Company playbooks",
        description: "Question patterns, system design expectations and cultural signals per employer.",
      },
    ],
    faqs: [
      {
        q: "How many mock interviews can I take?",
        a: "Unlimited AI-driven mocks for the duration of your prep track (typically 4 weeks). Plus 8–12 coached 1:1 sessions with a senior practitioner. Additional coached sessions are available at ₹2,500 per session if you want extra reps before a real interview — most candidates don't need them.",
      },
      {
        q: "Are the coaches actual industry practitioners?",
        a: "Yes. Every coach has personally interviewed at FAANG (Google, Amazon, Microsoft, Apple, Meta) or at a top-tier Indian startup (Flipkart, Razorpay, Zoho, Swiggy, PhonePe). We verify employment history and interview experience before onboarding a coach. You'll see your coach's verified background before your first session.",
      },
      {
        q: "Do you cover system design interviews?",
        a: "Yes — extensively. System design drills run from foundational (design a URL shortener) to senior (design a distributed rate limiter for a multi-region API gateway). Each drill is graded on the same rubric your target company uses — capacity estimation, API design, data model, scalability, trade-offs. Senior candidates get 6+ system design mocks.",
      },
      {
        q: "Can I get a playbook for a specific company?",
        a: "Yes — we have 200+ verified company playbooks. If your target company isn't on the list, we'll build a playbook from public interview reports (Glassdoor, LeetCode Discuss, Blind) and our coach network's first-hand experience, typically within 5 business days. There's no extra charge for custom playbook research.",
      },
      {
        q: "How is feedback delivered?",
        a: "Three layers: (1) instant AI scoring after each mock — structure, clarity, technical depth, communication, each 0–25, (2) written gap report within 24 hours identifying your top 3 weak areas with specific drills to fix them, (3) live coaching session within 48 hours where your coach reviews the recording with you and rewinds the moments you lost points. Nothing is left vague.",
      },
    ],
    ctaKicker: "Walk in knowing the questions",
    ctaTitle: "Master interviews with AI coaching + company playbooks",
  },

  "get-placed/offer-onboarding": {
    groupSlug: "get-placed",
    subSlug: "offer-onboarding",
    heroEyebrow: "Get Placed · For Job Seekers",
    heroSubtitle:
      "Offer negotiation guidance, document support, and a guided 90-day onboarding plan so you ramp fast and stay.",
    heroStats: [
      {
        value: "90-day",
        label: "Guided onboarding",
        detail: "Weekly check-ins for your first 90 days. Escalate blockers before they become problems.",
      },
      {
        value: "96%",
        label: "12-month retention",
        detail: "Of placed candidates retained at 12 months — 3× the industry average for freshers.",
      },
      {
        value: "48h",
        label: "Offer turnaround",
        detail: "From interview clear to written offer letter in hand, with negotiation guidance included.",
      },
    ],
    overview: {
      p1: "From offer letter to day one, we walk with you. Offer negotiation guidance covers salary, equity, joining bonus, relocation and notice period — backed by salary benchmark data across 500+ employers. Document support handles visa applications, background check paperwork, and statutory onboarding requirements.",
      p2: "A guided 90-day onboarding plan sets ramp milestones with your hiring manager — Week 1 environment setup, Week 4 first PR merged, Week 12 first independent project. We check in weekly to make sure you're tracking, escalating blockers before they become problems. 96% of placed candidates are retained at 12 months — 3× the industry average for freshers.",
    },
    capabilities: [
      {
        icon: "Handshake",
        title: "Offer negotiation guidance",
        description:
          "Salary, equity, joining bonus, relocation, notice period. Backed by salary benchmarks across 500+ employers.",
      },
      {
        icon: "Wallet",
        title: "Salary benchmark data",
        description:
          "Real offer letters from 500+ partner employers. Know your market worth before you sign.",
      },
      {
        icon: "FileText",
        title: "Document support",
        description:
          "Visa applications, background check paperwork, statutory onboarding forms. Reviewed by paralegals.",
      },
      {
        icon: "CalendarDays",
        title: "90-day onboarding plan",
        description:
          "Week 1 environment, Week 4 first PR, Week 12 first independent project. Milestones aligned with your manager.",
      },
      {
        icon: "Phone",
        title: "Weekly check-ins",
        description:
          "30-minute weekly call for 90 days. Track your ramp, escalate blockers, decode office dynamics.",
      },
      {
        icon: "Users",
        title: "Manager alignment",
        description:
          "We align expectations with your hiring manager before day one. No surprises on either side.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Receive offer",
        duration: "Day 0",
        description:
          "Interview clears → written offer in 48 hours. We review the offer letter line by line with you.",
      },
      {
        step: "02",
        title: "Negotiate",
        duration: "Day 1–7",
        description:
          "Negotiation guidance on salary, equity, bonus, relocation. Benchmark data from 500+ employers.",
      },
      {
        step: "03",
        title: "Day 1 onboarding",
        duration: "Joining date",
        description:
          "Document support for visa, BG checks, statutory forms. Onboarding plan aligned with your manager.",
      },
      {
        step: "04",
        title: "90-day ramp",
        duration: "First 90 days",
        description:
          "Weekly check-ins. Milestone tracking. Blocker escalation. 96% retention at 12 months.",
      },
    ],
    benefits: [
      {
        value: "90-day",
        label: "Guided onboarding",
        description: "Weekly check-ins for your first 90 days. Ramp milestones tracked with your manager.",
      },
      {
        value: "96%",
        label: "12-month retention",
        description: "Of placed candidates retained at 12 months — 3× the industry average for freshers.",
      },
      {
        value: "48h",
        label: "Offer turnaround",
        description: "From interview clear to written offer letter, with negotiation guidance included.",
      },
      {
        value: "100%",
        label: "Document coverage",
        description: "Visa, BG checks, statutory forms reviewed by paralegals. No paperwork surprises.",
      },
    ],
    faqs: [
      {
        q: "Do you negotiate on my behalf?",
        a: "We don't negotiate directly — your future employer needs to hear your voice, not ours. What we do is prepare you: salary benchmark data from real offer letters at this employer and 500+ peers, a negotiation script calibrated to their compensation philosophy, and a coached role-play session before you make the call. You walk in knowing your floor, your ceiling and the exact words to use.",
      },
      {
        q: "What if I have multiple offers?",
        a: "We help you compare offers apples-to-apples — base, equity (vesting schedule + strike price), bonus (signing + annual), benefits, remote policy, growth trajectory. We'll also help you decline the offers you don't take with grace — the industry is small and you'll cross paths with these recruiters again. We do NOT recommend using one offer to leverage another unless you're genuinely ready to walk.",
      },
      {
        q: "What documents do you help with?",
        a: "Visa applications (H-1B, L-1, O-1, B-1 for the US; Schengen for EU; dependent visas for spouses), background check paperwork (employment verification, education verification, criminal record check, credit check where applicable), and statutory onboarding forms (PF, UAN, ESIC, form 12B, Form I-9, W-4). Paralegals review everything before submission.",
      },
      {
        q: "How long is the onboarding support?",
        a: "90 days from your joining date — the period where most new hires either ramp successfully or quietly disengage. Weekly 30-minute check-ins for 12 weeks. If your role ends within 90 days for any reason other than gross misconduct, you re-enter the placement pool for free. After 90 days, support transitions to quarterly check-ins for the first year.",
      },
      {
        q: "What if my manager and I disagree on milestones?",
        a: "We facilitate. If your manager wants you shipping production code in Week 2 and you feel you need Week 4 to ramp, we'll mediate — typically by proposing a middle path (shadow Week 2, paired Week 3, solo Week 4) and documenting it. About 1 in 5 placed candidates has at least one milestone negotiation in the first 90 days; most resolve in a single 30-minute alignment call.",
      },
    ],
    ctaKicker: "From offer letter to day one",
    ctaTitle: "Get offer, onboarding and 90-day ramp support",
  },

  // ─────────────── Get Certified ───────────────

  "get-certified/skills-assessment": {
    groupSlug: "get-certified",
    subSlug: "skills-assessment",
    heroEyebrow: "Get Certified · For Job Seekers",
    heroSubtitle:
      "AI-scored assessments across 200+ skill tracks — get a verified competency profile employers trust and can verify.",
    heroStats: [
      {
        value: "200+",
        label: "Skill tracks",
        detail: "Frontend, backend, DevOps, data, AI/ML, mobile, QA, cloud, security and more.",
      },
      {
        value: "70+/100",
        label: "Verified threshold",
        detail: "Minimum score to earn the verified badge on a skill track.",
      },
      {
        value: "AI",
        label: "Powered scoring",
        detail: "Scored against industry benchmarks, not relative grading. Proctored for integrity.",
      },
    ],
    overview: {
      p1: "AI-scored assessments across 200+ skill tracks — frontend, backend, DevOps, data, AI/ML, mobile, QA, cloud. Every assessment is proctored, scored against industry benchmarks (not relative grading), and produces a verified competency profile employers can trust.",
      p2: "Your competency profile is portable — it lives with you, not just on our platform. Share it with any employer, embed it on LinkedIn, attach it to applications. The verification is cryptographic: employers can confirm your scores via a signed URL without taking our word for it. Your skills become a verifiable asset, not a resume bullet.",
    },
    capabilities: [
      {
        icon: "ClipboardCheck",
        title: "AI-scored assessments",
        description:
          "200+ skill tracks. Scored against industry benchmarks, not relative grading. Proctored for integrity.",
      },
      {
        icon: "Gauge",
        title: "Industry-benchmark scoring",
        description:
          "Your score reflects where you stand against the industry, not against your cohort. 70+ = verified.",
      },
      {
        icon: "BadgeCheck",
        title: "Verified competency profile",
        description:
          "Portable, shareable. Lives with you, not just on our platform. Embed on LinkedIn or attach to applications.",
      },
      {
        icon: "ShieldCheck",
        title: "Cryptographic verification",
        description:
          "Employers confirm your scores via a signed URL — no need to take our word for it.",
      },
      {
        icon: "Lock",
        title: "Proctored exams",
        description:
          "AI proctoring + human review. Anti-cheat, identity verification, integrity scoring on every session.",
      },
      {
        icon: "Globe",
        title: "LinkedIn embed",
        description:
          "Verified badges push directly to your LinkedIn profile. License verified by LinkedIn, not self-declared.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Pick a skill track",
        duration: "Day 0",
        description:
          "Browse 200+ tracks — frontend, backend, DevOps, data, AI/ML, mobile, QA, cloud. Pick one (or several).",
      },
      {
        step: "02",
        title: "Take assessment",
        duration: "Day 1–7",
        description:
          "60–90 minute proctored session per track. AI proctoring + human review. Integrity scored.",
      },
      {
        step: "03",
        title: "Get scored",
        duration: "Day 8",
        description:
          "Written score report against industry benchmarks. 70+ earns verified badge. Gap areas flagged.",
      },
      {
        step: "04",
        title: "Share profile",
        duration: "Day 9+",
        description:
          "Push to LinkedIn, share signed URL with employers, attach to applications. Profile is portable forever.",
      },
    ],
    benefits: [
      {
        value: "200+",
        label: "Skill tracks",
        description: "Frontend, backend, DevOps, data, AI/ML, mobile, QA, cloud, security and more.",
      },
      {
        value: "70+/100",
        label: "Verified threshold",
        description: "Minimum score to earn the verified badge on a skill track.",
      },
      {
        value: "100%",
        label: "Proctored integrity",
        description: "AI proctoring + human review on every session. No self-reported scores.",
      },
      {
        value: "Portable",
        label: "Profile lives with you",
        description: "Share with any employer, embed on LinkedIn, attach to applications. Forever.",
      },
    ],
    faqs: [
      {
        q: "Are the assessments free?",
        a: "The first assessment per track is free for STIOOS cohort graduates. For external candidates and retakes, assessments are ₹1,500 per track (₹999 during promotional periods). Bundle pricing: 5 tracks for ₹6,000, 10 tracks for ₹10,000. Assessment fees are waived if you join a Get Trained cohort within 90 days of taking an assessment.",
      },
      {
        q: "How long does an assessment take?",
        a: "60–90 minutes per skill track, depending on the track. Frontend, backend, and data assessments are 90 minutes (multiple-choice + coding). DevOps and cloud assessments are 75 minutes (multiple-choice + scenario simulation). Mobile, QA, and security assessments are 60 minutes (multiple-choice + case study). You can take up to 3 assessments in a 24-hour window.",
      },
      {
        q: "Can I retake an assessment?",
        a: "Yes — after a 30-day cooldown. Your highest score stands; we don't average. Retakes are priced the same as first attempts (₹1,500 per track, or covered by your bundle). The 30-day cooldown is to discourage cramming — skill assessments should reflect durable competency, not short-term memorization.",
      },
      {
        q: "How do employers verify my scores?",
        a: "Three ways: (1) signed URL — you generate a unique verification URL per employer, valid for 30 days, that displays your verified scores without revealing your full profile, (2) LinkedIn integration — verified badges push directly to your LinkedIn profile and are confirmed via LinkedIn's license verification, (3) direct API — partner employers can query our verification API with your candidate ID for real-time confirmation.",
      },
      {
        q: "What score do I need to pass?",
        a: "70/100 earns the verified badge on a skill track. 85+ earns 'Distinction'. 95+ earns 'Expert' (rare — about 4% of assessments). Below 70: you receive a gap report identifying which sub-skills pulled your score down, plus recommended modules to close the gaps. You can retake after 30 days. There's no penalty for failing — your profile only shows your best score.",
      },
    ],
    ctaKicker: "Skills that employers can verify",
    ctaTitle: "Get AI-scored across 200+ skill tracks",
  },

  "get-certified/industry-certifications": {
    groupSlug: "get-certified",
    subSlug: "industry-certifications",
    heroEyebrow: "Get Certified · For Job Seekers",
    heroSubtitle:
      "Earn industry-recognized certifications in AI, cloud, data, full-stack, and more — exam fees and prep included in your program.",
    heroStats: [
      {
        value: "30+",
        label: "Certifications offered",
        detail: "AWS, Azure, GCP, MongoDB, Kubernetes, Scrum, PMP and more — all major vendor certs.",
      },
      {
        value: "100%",
        label: "Exam fee coverage",
        detail: "Exam fees and prep material are included in your program. You don't pay extra.",
      },
      {
        value: "4.9/5",
        label: "Prep rating",
        detail: "Average candidate rating of the prep track across 8,000+ certified candidates since 2019.",
      },
    ],
    overview: {
      p1: "Earn industry-recognized certifications in AI, cloud, data, full-stack, security and project management — AWS, Azure, Google Cloud, MongoDB, Kubernetes, Scrum, PMP and more. Exam fees and prep material are included in your program; you don't pay extra to sit the exam or to access the prep track.",
      p2: "Prep is structured — diagnostic exam, gap analysis, targeted modules, mock tests, then the real exam. Average pass rate is 86% on the first attempt for cohorts that complete the prep track. Failed first attempts get a free retake voucher and additional coaching. The certification is yours to keep, on your LinkedIn, forever.",
    },
    capabilities: [
      {
        icon: "Award",
        title: "30+ industry certifications",
        description:
          "AWS, Azure, GCP, MongoDB, Kubernetes, Scrum, PMP and more. All major vendor and methodology certs.",
      },
      {
        icon: "Wallet",
        title: "Exam fees included",
        description:
          "First-attempt exam fee and one retake voucher are bundled into your program. No extra cost, ever.",
      },
      {
        icon: "ClipboardCheck",
        title: "Diagnostic exam + gap analysis",
        description:
          "Start with a diagnostic mock exam. We map your gaps and prescribe targeted modules — no wasted prep time.",
      },
      {
        icon: "BookOpen",
        title: "Targeted prep modules",
        description:
          "Curated modules for each certification's exam blueprint. Vendor-official material where available.",
      },
      {
        icon: "BarChart3",
        title: "Full-length mock tests",
        description:
          "3–5 full-length mock exams per certification, scored against the official exam rubric. Pattern-matched questions.",
      },
      {
        icon: "RefreshCw",
        title: "Free retake voucher",
        description:
          "Failed first attempt? You get a free retake voucher plus 4 hours of additional coaching before the retake.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Diagnostic exam",
        duration: "Day 0",
        description:
          "Take a full-length diagnostic mock exam. We score you against the certification's official blueprint.",
      },
      {
        step: "02",
        title: "Gap analysis",
        duration: "Day 1–3",
        description:
          "Written gap report identifies the 3–5 blueprint domains where you're weakest. Targeted modules prescribed.",
      },
      {
        step: "03",
        title: "Prep + mock tests",
        duration: "Week 1–4",
        description:
          "Complete the prescribed modules. Take 3–5 full-length mock exams. Score 80%+ before scheduling the real exam.",
      },
      {
        step: "04",
        title: "Certify",
        duration: "Week 5",
        description:
          "Sit the real exam at a Pearson VUE / Kryterion center (or online proctored). 86% first-attempt pass rate.",
      },
    ],
    benefits: [
      {
        value: "30+",
        label: "Certifications offered",
        description: "AWS, Azure, GCP, MongoDB, Kubernetes, Scrum, PMP — all major vendor and methodology certs.",
      },
      {
        value: "100%",
        label: "Exam fee coverage",
        description: "First-attempt fee and one retake voucher bundled into your program.",
      },
      {
        value: "86%",
        label: "First-attempt pass rate",
        description: "Of cohort graduates who complete the prep track. Free retake + coaching if you don't.",
      },
      {
        value: "4.9/5",
        label: "Prep rating",
        description: "Average candidate rating across 8,000+ certified candidates since 2019.",
      },
    ],
    faqs: [
      {
        q: "Which certifications are included?",
        a: "AWS (SAA-C03, DVA-C02, SOA-C02, DOP-C02), Azure (AZ-204, AZ-104, AZ-305), Google Cloud (PCA, PCSE), MongoDB (Associate, Developer), Kubernetes (CKA, CKAD), Scrum (PSM I, CSPO), PMP, ITIL Foundation, CompTIA Security+, and Salesforce Administrator. We add 3–5 new certifications per quarter based on employer demand.",
      },
      {
        q: "Are exam fees really free?",
        a: "Yes — the first-attempt exam fee is bundled into your program. For STIOOS cohort graduates, the fee is fully covered (no separate charge). For external candidates enrolled in a certification-only prep track, the exam fee is included in the prep track price (₹15,000–₹35,000 depending on the certification). One free retake voucher is included if you fail the first attempt.",
      },
      {
        q: "What if I fail the first attempt?",
        a: "You get a free retake voucher (typically valid for 6 months) plus 4 hours of additional 1:1 coaching focused on the blueprint domains where you scored weakest. We don't charge for the retake exam or the coaching. About 14% of first attempts fail; of those, 78% pass on the retake. The certification is awarded when you pass — your transcript doesn't show first-attempt outcomes.",
      },
      {
        q: "How long is the prep track?",
        a: "4 weeks for foundational certifications (Scrum, ITIL, CompTIA Security+), 6 weeks for associate-level certifications (AWS SAA, Azure AZ-204, MongoDB Associate), 8–10 weeks for professional-level certifications (AWS SAP, Azure AZ-305, PMP, CKA). Prep tracks run alongside your cohort training or as a standalone certification-only track.",
      },
      {
        q: "Can I take multiple certifications?",
        a: "Yes — many candidates stack certifications (e.g. AWS SAA + Azure AZ-104 + Kubernetes CKA for a multi-cloud engineer profile). Bundle pricing: 2 certifications for ₹50,000 (saves ₹10,000), 3 certifications for ₹70,000 (saves ₹20,000). Each certification has its own prep track, mock tests and exam attempt — they don't share prep material.",
      },
    ],
    ctaKicker: "Certifications employers recognize",
    ctaTitle: "Earn industry certifications with prep + fees included",
  },

  "get-certified/career-portfolio": {
    groupSlug: "get-certified",
    subSlug: "career-portfolio",
    heroEyebrow: "Get Certified · For Job Seekers",
    heroSubtitle:
      "Build a portfolio of real client-shaped projects that prove you can deliver from day one — not toy projects, real work.",
    heroStats: [
      {
        value: "3+",
        label: "Portfolio projects shipped",
        detail: "Per cohort graduate. Each project lives in a public repo with README, tests, and deploy.",
      },
      {
        value: "Real",
        label: "Client-shaped work",
        detail: "Production architecture, CI/CD, observability, code review — what your future team builds.",
      },
      {
        value: "94%",
        label: "Hire-ready rate",
        detail: "Of cohort graduates with a portfolio clear the placement bar within 60 days.",
      },
    ],
    overview: {
      p1: "Build a portfolio of real client-shaped projects — not toy tutorials. Each project mirrors a real engineering challenge: production architecture, CI/CD pipelines, observability, code review, incident response. The kind of work that proves you can deliver from day one, not that you can follow a tutorial.",
      p2: "Every project ships to a public repo with README, tests, deployment and a written postmortem. Hiring managers can read your code, run your app and verify your work — not just read a resume bullet. Your portfolio is your interview: it shows what you can do before anyone asks you to do it.",
    },
    capabilities: [
      {
        icon: "Wrench",
        title: "Real client-shaped projects",
        description:
          "Not toy apps. Production architecture, real requirements, real users (sandbox), real engineering constraints.",
      },
      {
        icon: "Layers",
        title: "Production-grade architecture",
        description:
          "Microservices boundaries, event-driven design, API contracts, database sharding, caching tiers.",
      },
      {
        icon: "GitBranch",
        title: "CI/CD pipelines",
        description:
          "GitHub Actions / Jenkins — build, test, scan, deploy. You write and maintain the pipeline, not just use it.",
      },
      {
        icon: "BarChart3",
        title: "Observability stack",
        description:
          "Logs, metrics, traces, dashboards, alerts. Datadog / Sentry / Grafana. You know what to look at when things break.",
      },
      {
        icon: "ShieldCheck",
        title: "Code review + incident response",
        description:
          "Open PRs, address comments, review a peer's PR. On-call rotation, severity levels, postmortems. Real practice.",
      },
      {
        icon: "FileText",
        title: "Public repo + postmortem",
        description:
          "Every project ships with README, tests, deploy link and a written postmortem. Hiring managers can verify everything.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Spec the project",
        duration: "Sprint 03",
        description:
          "Work with your mentor to spec a real client-shaped project. Architecture, scope, milestones, success criteria.",
      },
      {
        step: "02",
        title: "Build",
        duration: "Sprint 03–05",
        description:
          "Build across 2–3 sprints. Pair-program with peers. Open PRs. Get code review. Ship to a public repo.",
      },
      {
        step: "03",
        title: "Review",
        duration: "Sprint 05–06",
        description:
          "Mentor + peer review across architecture, delivery, quality and presentation. Iterate. Write the postmortem.",
      },
      {
        step: "04",
        title: "Ship",
        duration: "Sprint 06",
        description:
          "Public repo live. README + tests + deploy + postmortem. Hiring managers can run it and read your code.",
      },
    ],
    benefits: [
      {
        value: "3+",
        label: "Portfolio projects shipped",
        description: "Per cohort graduate. Each in a public repo with README, tests, and deploy.",
      },
      {
        value: "100%",
        label: "Public, verifiable repos",
        description: "Hiring managers can read your code, run your app and verify your work — not just your resume.",
      },
      {
        value: "94%",
        label: "Hire-ready rate",
        description: "Of cohort graduates with a portfolio clear the placement bar within 60 days.",
      },
      {
        value: "Real",
        label: "Client-shaped work",
        description: "Production architecture, CI/CD, observability, code review — what your future team builds.",
      },
    ],
    faqs: [
      {
        q: "Are the projects solo or team?",
        a: "Mixed — typically 1 solo project, 1 pair project and 1 capstone (solo with mentor + client reviewer). The solo project proves you can build independently; the pair project proves you can collaborate (git workflow, code review, branching strategy); the capstone proves you can ship a production-shaped system. All three are required to graduate.",
      },
      {
        q: "Do I get to choose the project?",
        a: "Partially. Your mentor curates 3–5 project briefs that match your target role and stack — you pick from those. If you have a specific project in mind (e.g. a clone of a tool you use, or a side project you've started), your mentor can approve it as a substitute if it meets the architecture + delivery + quality bar. About 1 in 4 candidates uses a self-proposed project.",
      },
      {
        q: "Are projects graded?",
        a: "Yes — across four dimensions (architecture, delivery, quality, presentation), each 0–25, by your mentor + a peer reviewer. 75/100 is the pass bar for the solo project; 80/100 for the pair project; 75/100 for the capstone (graded by mentor + client reviewer). Failed projects get a 2-week extension to revise; very rarely a candidate repeats the project sprint.",
      },
      {
        q: "Can I show my portfolio to non-STIOOS employers?",
        a: "Yes — the repos are public on GitHub, the deployments are live (free-tier hosting maintained for 12 months after graduation), and the postmortems are public on your candidate profile. There's no STIOOS branding on the repos themselves. About 30% of placed candidates reported that their portfolio was the deciding factor in their offer, including at non-partner employers.",
      },
      {
        q: "What if I want to keep working on a project after the cohort?",
        a: "Encouraged. Many candidates turn their capstone into an open-source project or a side business after graduation. STIOOS retains no IP claim on cohort projects — the repo, the code, the deployment are yours. We do ask (not require) that you attribute the cohort and your mentor in the README if the project becomes commercially significant.",
      },
    ],
    ctaKicker: "Code that hiring managers can run",
    ctaTitle: "Build a portfolio of real client-shaped projects",
  },

  // ─────────────── Build Talent (Employer) ───────────────

  "build-talent/train-to-hire-cohorts": {
    groupSlug: "build-talent",
    subSlug: "train-to-hire-cohorts",
    heroEyebrow: "Build Talent · For Employers",
    heroSubtitle:
      "Custom training cohorts built around your stack — graduate job-ready professionals who join your team.",
    heroStats: [
      {
        value: "96%",
        label: "Trainee conversion rate",
        detail: "Cohort graduates hired as full-time engineers within 60 days of program completion.",
      },
      {
        value: "8–12 wks",
        label: "Intensive training ramp",
        detail: "Role-specific syllabus ending in a client-designed production capstone.",
      },
      {
        value: "Zero",
        label: "Upfront employer risk",
        detail: "Placement fees apply only when candidates successfully graduate and join your workforce.",
      },
    ],
    overview: {
      p1: "Off-the-shelf hiring rarely gives you engineers who understand your code conventions, architectural patterns, and internal tooling from day one. STIOOS Train to Hire Cohorts builds a tailored talent factory for your company, co-designing intensive 8–12 week bootcamps around your exact technology stack.",
      p2: "We source high-aptitude graduates and mid-level career switchers, screen them through rigorous logic and coding tests, and train them with senior industry mentors. Trainees build production-shaped capstones mimicking your internal microservices, ensuring they deploy features on their very first sprint.",
    },
    capabilities: [
      {
        icon: "BookOpen",
        title: "Co-designed curriculum",
        description:
          "Syllabus built hand-in-hand with your tech leads to cover your exact tech stack, frameworks, and conventions.",
      },
      {
        icon: "Target",
        title: "Targeted cohort sourcing",
        description:
          "High-volume intake from top universities and engineering programs screened for aptitude and learning agility.",
      },
      {
        icon: "Code",
        title: "Real-world production capstones",
        description:
          "Learners build and defend full-stack systems with CI/CD, testing, observability, and containerization.",
      },
      {
        icon: "Users",
        title: "Daily senior mentorship",
        description:
          "Experienced developers lead pair programming, review pull requests, and enforce enterprise code quality.",
      },
      {
        icon: "ClipboardCheck",
        title: "Weekly milestone assessments",
        description:
          "Transparent progress tracking with automated testing and mentor evaluations shared with your team.",
      },
      {
        icon: "ShieldCheck",
        title: "Risk-free hiring model",
        description:
          "Evaluate trainees during capstone presentations; extend offers only to candidates who exceed your bar.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Curriculum & role alignment",
        duration: "Week 0",
        description:
          "Define target engineering roles, stack requirements, and capstone criteria with STIOOS curriculum architects.",
      },
      {
        step: "02",
        title: "Cohort selection & screening",
        duration: "Week 1",
        description:
          "AI screening and proctored technical evaluations select the top 5% of applicants into the cohort.",
      },
      {
        step: "03",
        title: "Intensive mentor sprints",
        duration: "Week 2–10",
        description:
          "Hands-on development sprints covering system fundamentals, advanced frameworks, and enterprise patterns.",
      },
      {
        step: "04",
        title: "Capstone defense & hiring",
        duration: "Week 11–12",
        description:
          "Graduates present production capstones to your engineering team; selected candidates join as FTEs.",
      },
    ],
    benefits: [
      {
        value: "96%",
        label: "Graduation-to-hire",
        description: "Over 96% of cohort graduates receive and accept full-time offers with partner employers.",
      },
      {
        value: "Day 1",
        label: "Productivity ramp",
        description: "Engineers arrive familiar with your repository structure, code standards, and workflows.",
      },
      {
        value: "50%",
        label: "Lower recruiting costs",
        description: "Replace costly recruiter headhunter fees with predictable, volume-scaled cohort pricing.",
      },
      {
        value: "90-day",
        label: "Replacement guarantee",
        description: "Written warranty protecting your investment in every full-time hire made from the cohort.",
      },
    ],
    faqs: [
      {
        q: "Who covers the cost of training the cohort?",
        a: "Training costs are subsidized or shared through corporate sponsorship and candidate commitments, with employer fees tied to confirmed hires.",
      },
      {
        q: "Are we obligated to hire every graduate in the cohort?",
        a: "No. You commit to interviewing the cohort and only hire candidates who meet or exceed your engineering bar during the final capstone defense.",
      },
      {
        q: "Can our engineers participate as guest lecturers or mentors?",
        a: "Yes! Many enterprise clients participate in code reviews, tech talks, and weekly checkpoint evaluations to build strong cultural affinity early.",
      },
      {
        q: "What tech stacks can be covered in a custom cohort?",
        a: "We have established curricula for React/Next.js, Node/TypeScript, Python/FastAPI, Java/Spring Boot, Go, AWS/Azure Cloud, and GenAI/LLM orchestration.",
      },
      {
        q: "Where do training sessions take place?",
        a: "Programs can be conducted fully remote, hybrid, or on-site at your corporate facilities or STIOOS delivery hubs.",
      },
    ],
    ctaKicker: "Ready to build your custom engineering cohort?",
    ctaTitle: "Co-design your talent pipeline today",
  },

  "build-talent/hire-to-train-programs": {
    groupSlug: "build-talent",
    subSlug: "hire-to-train-programs",
    heroEyebrow: "Build Talent · For Employers",
    heroSubtitle:
      "Hire promising candidates and we train them to your exact role requirements — ramped in weeks, not months.",
    heroStats: [
      {
        value: "100%",
        label: "Role-specific training",
        detail: "Targeted upskilling designed specifically around your project's technology stack.",
      },
      {
        value: "4–8 wks",
        label: "Fast-track onboarding",
        detail: "Accelerate time-to-productivity for newly hired campus or lateral engineers.",
      },
      {
        value: "90-day",
        label: "Performance warranty",
        detail: "Full replacement support during probation if candidates fail to meet key milestones.",
      },
    ],
    overview: {
      p1: "Finding pre-packaged candidates with the exact combination of modern tools your architecture requires is increasingly rare and expensive. With STIOOS Hire to Train Programs, you identify smart, high-aptitude talent, extend contingent offers, and entrust us with ramping them to enterprise production standards.",
      p2: "We take your new hires through an intensive, custom-crafted finishing school. Under the guidance of seasoned tech leads, they learn your codebase architecture, security protocols, and operational workflows — transforming promising recruits into high-output contributors before their first sprint.",
    },
    capabilities: [
      {
        icon: "UserCheck",
        title: "Aptitude-first hiring",
        description:
          "Select candidates based on fundamental problem-solving and logical ability rather than obsolete keyword matching.",
      },
      {
        icon: "BookOpen",
        title: "Customized ramp syllabus",
        description:
          "Targeted upskilling curriculum focused strictly on the gaps between university fundamentals and your stack.",
      },
      {
        icon: "Code",
        title: "Simulated codebase immersion",
        description:
          "New hires practice bug fixes, feature branches, and code reviews on an isolated clone of your environment.",
      },
      {
        icon: "Users",
        title: "Dedicated mentor coaching",
        description:
          "1-on-1 guidance from staff-level engineers who provide daily feedback, unblock blockers, and instill best practices.",
      },
      {
        icon: "ShieldCheck",
        title: "Probation & milestone tracking",
        description:
          "Quantitative competency benchmarks ensure transparent visibility into candidate progress throughout probation.",
      },
      {
        icon: "Zap",
        title: "Toolchain & DevOps fluency",
        description:
          "Hands-on mastery of Git workflows, Docker, CI/CD pipelines, unit testing, and cloud infrastructure.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Selection & contingent offer",
        duration: "Week 0",
        description:
          "Interview and hire candidates based on aptitude; enroll them into the tailored upskilling program.",
      },
      {
        step: "02",
        title: "Diagnostic gap assessment",
        duration: "Week 1",
        description:
          "Assess each candidate's strengths and weaknesses to personalize module pacing and mentor pairing.",
      },
      {
        step: "03",
        title: "Guided technical immersion",
        duration: "Week 2–6",
        description:
          "Hands-on coding sprints, architecture walkthroughs, and weekly competency tests against industry rubrics.",
      },
      {
        step: "04",
        title: "Project handoff & integration",
        duration: "Week 7–8",
        description:
          "Graduate successfully onto your live product team with full architectural context and confident velocity.",
      },
    ],
    benefits: [
      {
        value: "60%",
        label: "Faster time to productivity",
        description: "New hires commit production code in their first week on the team instead of taking months to ramp.",
      },
      {
        value: "45%",
        label: "Salary budget optimization",
        description: "Hire high-potential junior/mid talent and train them rather than overpaying for scarce senior hires.",
      },
      {
        value: "95%",
        label: "Probation pass rate",
        description: "Structured mentorship and clear expectations ensure new hires succeed during probation.",
      },
      {
        value: "Zero",
        label: "Senior engineering distraction",
        description: "Keep your lead architects focused on core roadmap delivery instead of hand-holding new recruits.",
      },
    ],
    faqs: [
      {
        q: "How does Hire to Train differ from Train to Hire?",
        a: "In Hire to Train, you select and make employment offers to candidates first, and we train your confirmed hires. In Train to Hire, we train an open cohort and you select candidates at graduation.",
      },
      {
        q: "What size cohorts can you accommodate?",
        a: "We support cohort sizes from individual specialist hires (1–3 engineers) up to enterprise campus batches of 100+ graduates.",
      },
      {
        q: "How do you tailor the training to our codebase?",
        a: "Our curriculum leads work with your engineering managers under NDA to create mock repositories and coding exercises matching your architecture.",
      },
      {
        q: "Can training occur while candidates are already on our payroll?",
        a: "Yes. Many enterprise clients pay candidates their starting salary while STIOOS runs the training program full-time for the first 6–8 weeks.",
      },
      {
        q: "What happens if a candidate fails the final assessment?",
        a: "We provide targeted remedial sprints for borderline cases, or invoke replacement guarantees depending on your contractual preference.",
      },
    ],
    ctaKicker: "Have new hires who need fast upskilling?",
    ctaTitle: "Launch your Hire to Train program today",
  },

  "build-talent/corporate-training-programs": {
    groupSlug: "build-talent",
    subSlug: "corporate-training-programs",
    heroEyebrow: "Build Talent · For Employers",
    heroSubtitle:
      "Custom corporate training programs designed to upskill your teams across AI, cloud, data, and full-stack.",
    heroStats: [
      {
        value: "200+",
        label: "Corporate modules",
        detail: "Enterprise curricula covering GenAI, cloud modernization, distributed systems, and DevOps.",
      },
      {
        value: "4.9/5",
        label: "Learner satisfaction",
        detail: "Consistently top-rated by engineering teams, managers, and enterprise L&D directors.",
      },
      {
        value: "100%",
        label: "Practical project focus",
        detail: "Real internal enterprise challenges solved during capstone hackathons.",
      },
    ],
    overview: {
      p1: "Technology moves faster than annual hiring cycles. Upskilling your existing engineering and product workforce is the most cost-effective way to adopt Generative AI, modernize legacy systems, and improve retention. STIOOS Corporate Training Programs delivers expert-led, sprint-based learning tailored to your engineering culture.",
      p2: "Unlike generic video course platforms with sub-10% completion rates, STIOOS programs combine live interactive workshops, hands-on lab environments, and real internal capstone projects. Your developers learn by doing, guided by senior technology practitioners who build in the field every day.",
    },
    capabilities: [
      {
        icon: "Award",
        title: "GenAI & LLM engineering tracks",
        description:
          "Practical RAG architectures, prompt engineering, vector databases, and fine-tuning open-source models.",
      },
      {
        icon: "Cloud",
        title: "Cloud modernization & Kubernetes",
        description:
          "Microservices decomposition, container orchestration, Terraform IaC, and cloud-native observability.",
      },
      {
        icon: "Code",
        title: "Modern web & backend stacks",
        description:
          "Advanced TypeScript, React 19, Next.js, FastAPI, Go, and high-throughput event-driven microservices.",
      },
      {
        icon: "Brain",
        title: "Data engineering & analytics",
        description:
          "Data modeling, Snowflake, Databricks, Apache Spark, real-time Kafka streaming, and modern dbt workflows.",
      },
      {
        icon: "Users",
        title: "Live cohort-based learning",
        description:
          "Interactive instructor-led sessions, peer code reviews, and group hackathons that foster team collaboration.",
      },
      {
        icon: "TrendingUp",
        title: "Measurable skills benchmarking",
        description:
          "Pre- and post-training skill assessments provide executive leadership with verifiable ROI metrics.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Skills gap audit",
        duration: "Week 0",
        description:
          "Evaluate team capabilities and align curriculum topics with upcoming strategic technical roadmaps.",
      },
      {
        step: "02",
        title: "Custom syllabus co-design",
        duration: "Week 1",
        description:
          "Design modules, coding labs, and internal capstone projects using your existing tools and architecture.",
      },
      {
        step: "03",
        title: "Sprint delivery & labs",
        duration: "Week 2–6",
        description:
          "Deliver modular weekly sessions, hands-on cloud sandboxes, and asynchronous mentor code feedback.",
      },
      {
        step: "04",
        title: "Internal capstone showcase",
        duration: "Week 7",
        description:
          "Teams present working prototypes addressing real internal company challenges to leadership.",
      },
    ],
    benefits: [
      {
        value: "85%",
        label: "Course completion rate",
        description: "Mentor-led accountability and live labs achieve 8x the engagement of passive video libraries.",
      },
      {
        value: "3x",
        label: "Internal mobility rate",
        description: "Promote existing loyal staff into senior modern engineering roles instead of recruiting externally.",
      },
      {
        value: "Immediate",
        label: "Strategic impact",
        description: "Capstone projects frequently graduate directly into production features and automation pipelines.",
      },
      {
        value: "30+",
        label: "Global certifications",
        description: "Curricula prepare employees for AWS, Azure, GCP, CKA, and industry accreditation exams.",
      },
    ],
    faqs: [
      {
        q: "How do you accommodate employee work schedules?",
        a: "We offer flexible delivery formats including weekend workshops, 2-hour bi-weekly sprints, or intensive 1-week full-time bootcamps to avoid disrupting roadmap deliverables.",
      },
      {
        q: "What cloud lab environments are provided?",
        a: "STIOOS provisions isolated cloud sandboxes (AWS/GCP/Azure) with pre-configured datasets and compute, so learners do not incur costs on your corporate cloud bills.",
      },
      {
        q: "Can the training be customized to our internal frameworks?",
        a: "Yes. Our instructors incorporate your internal SDKs, style guides, and architectural patterns into the coding exercises.",
      },
      {
        q: "What reporting is provided to L&D and engineering leadership?",
        a: "You receive automated weekly attendance, quiz performance, lab completion metrics, and individual skill progression scorecards.",
      },
      {
        q: "Do you offer enterprise-wide licensing or per-cohort pricing?",
        a: "We offer both: per-cohort packages for targeted team sprints, and enterprise annual subscriptions for ongoing multi-track training.",
      },
    ],
    ctaKicker: "Want to future-proof your engineering team?",
    ctaTitle: "Plan your corporate training program",
  },

  // ─────────────── Hire Talent (Employer) ───────────────

  "hire-talent/staffing-solutions": {
    groupSlug: "hire-talent",
    subSlug: "staffing-solutions",
    heroEyebrow: "Hire Talent · For Employers",
    heroSubtitle:
      "Flexible staffing models — contract, permanent, or project-based — from a 2M+ pre-vetted talent pool.",
    heroStats: [
      {
        value: "48h",
        label: "To shortlist",
        detail: "5–8 vetted candidate profiles delivered within 48 hours of requirement intake.",
      },
      {
        value: "90-day",
        label: "Replacement warranty",
        detail: "Free replacement if a placed candidate exits or underperforms within 90 days.",
      },
      {
        value: "2M+",
        label: "Pre-vetted pool",
        detail: "Engineers, cloud architects, AI practitioners and product specialists ready to deploy.",
      },
    ],
    overview: {
      p1: "Hiring velocity should never compromise talent quality. STIOOS Staffing Solutions connects engineering leaders and talent acquisition teams with pre-vetted professionals across contract, permanent, and project-based engagement models. Every candidate is evaluated through AI-proctored technical assessments, mentor code reviews, and background verification before their profile reaches your desk.",
      p2: "Whether you need a senior distributed systems architect for a 6-month migration or a permanent full-stack team to scale your core product, our staffing engine matches your exact technical stack and company culture in 48 hours. Backed by written SLAs, transparent pricing, pay-after-join terms, and a 90-day replacement guarantee.",
    },
    capabilities: [
      {
        icon: "Briefcase",
        title: "Contract staffing",
        description:
          "Deploy agile engineering and operational talent for defined project timelines with zero long-term payroll liabilities.",
      },
      {
        icon: "Building2",
        title: "Permanent hiring",
        description:
          "Direct-hire placements for core team roles with rigorous cultural alignment and 90-day replacement warranties.",
      },
      {
        icon: "Layers",
        title: "Contract-to-hire (C2H)",
        description:
          "Evaluate on-the-job execution for 3–6 months before converting contract talent into full-time employees.",
      },
      {
        icon: "Zap",
        title: "Project-based squads",
        description:
          "Turnkey multi-disciplinary teams assembled to deliver specific milestones with dedicated delivery management.",
      },
      {
        icon: "ShieldCheck",
        title: "Complete compliance & EOR",
        description:
          "Full payroll, statutory compliance, PF/ESI, tax withholding, and IP assignment agreements handled by STIOOS.",
      },
      {
        icon: "Target",
        title: "Stack-exact matching",
        description:
          "AI screening calibrated to your specific tech stack, architecture patterns, and seniority requirements.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Requirement intake",
        duration: "Day 0",
        description:
          "Share your role specifications, technical stack, budget, and timeline in a 20-minute kickoff with our staffing director.",
      },
      {
        step: "02",
        title: "AI-matched shortlist",
        duration: "Day 1–2",
        description:
          "Receive 5–8 pre-screened profiles with verified assessment scorecards, code samples, and interview recordings.",
      },
      {
        step: "03",
        title: "Client interviews",
        duration: "Day 3–5",
        description:
          "Meet shortlisted candidates in streamlined technical and culture-fit rounds coordinated seamlessly by STIOOS.",
      },
      {
        step: "04",
        title: "Offer & onboarding",
        duration: "Day 6–10",
        description:
          "Finalize engagement terms; candidate is onboarded with hardware, security policies, and NDA in place.",
      },
    ],
    benefits: [
      {
        value: "48h",
        label: "Shortlist turnaround",
        description: "Go from requirement kickoff to interviewing pre-screened talent in two business days.",
      },
      {
        value: "90-day",
        label: "Replacement guarantee",
        description: "Zero-cost replacement guarantee if a candidate does not meet your performance expectations.",
      },
      {
        value: "40%",
        label: "Hiring cost reduction",
        description: "Eliminate expensive recruitment agency retainers and reduce internal HR bandwidth spend.",
      },
      {
        value: "98%",
        label: "Offer acceptance rate",
        description: "Pre-aligned expectations on compensation, role scope, and work arrangement prevent dropouts.",
      },
    ],
    faqs: [
      {
        q: "How quickly can contract staff start after selection?",
        a: "Most contract professionals from our active bench can onboard within 3 to 7 business days once contracts and compliance documentation are finalized.",
      },
      {
        q: "What is your replacement policy if a candidate does not work out?",
        a: "Every placement includes a 90-day written replacement guarantee. If a hire exits or does not meet agreed performance standards, we provide a replacement shortlist within 48 hours at zero additional cost.",
      },
      {
        q: "How are payroll, taxes, and legal compliance managed for contract staff?",
        a: "STIOOS acts as the Employer of Record (EOR) for contract hires. We handle statutory benefits, payroll processing, tax filings, insurance, and IP assignment agreements.",
      },
      {
        q: "Can we convert a contract hire to a permanent employee?",
        a: "Yes. Our contract-to-hire (C2H) model includes clear conversion milestones and transparent conversion fee structures after a 3 to 6-month trial period.",
      },
      {
        q: "Do you support specialized tech stacks and niche engineering skills?",
        a: "Yes. Our 2M+ talent network covers niche domains including GenAI, MLOps, Rust, Go, distributed cloud infrastructure, Salesforce, SAP, and embedded systems.",
      },
    ],
    ctaKicker: "Need pre-vetted talent on your team?",
    ctaTitle: "Get candidate shortlists delivered in 48 hours",
  },

  "hire-talent/talent-sourcing-recruitment": {
    groupSlug: "hire-talent",
    subSlug: "talent-sourcing-recruitment",
    heroEyebrow: "Hire Talent · For Employers",
    heroSubtitle:
      "AI-powered talent sourcing from 2M+ candidates — shortlists delivered within 48 hours.",
    heroStats: [
      {
        value: "2M+",
        label: "Candidate network",
        detail: "Continuously refreshed talent graph spanning engineering, AI, product and cloud.",
      },
      {
        value: "48h",
        label: "Average time to shortlist",
        detail: "Calibrated matching models rank the top 1% fit for your specific technical stack.",
      },
      {
        value: "85%",
        label: "Interview-to-offer ratio",
        detail: "High-precision screening ensures your engineering managers spend time only on viable candidates.",
      },
    ],
    overview: {
      p1: "Traditional sourcing is broken: recruiters flood hiring managers with hundreds of uncalibrated resumes, wasting dozens of senior engineering hours on screening calls. STIOOS Talent Sourcing & Recruitment flips the model with an AI-driven candidate discovery and evaluation engine trained on verified hiring outcomes.",
      p2: "We search passive and active talent across our 2M+ talent network, evaluate their real-world code repositories and benchmarked assessment results, and deliver a tight shortlist of 5–8 thoroughly vetted professionals. You interview only high-probability hires, cutting time-to-hire from months to days.",
    },
    capabilities: [
      {
        icon: "Target",
        title: "AI candidate discovery",
        description:
          "Multi-channel sourcing across verified databases, open-source contributors, and alumni networks.",
      },
      {
        icon: "Code",
        title: "Automated code analysis",
        description:
          "Automated inspection of public repositories and capstone submissions to evaluate real engineering depth.",
      },
      {
        icon: "Users",
        title: "Technical pre-screening",
        description:
          "Every candidate completes a rigorous 45-minute technical screen conducted by experienced mentors.",
      },
      {
        icon: "FileCheck",
        title: "Reference & background checks",
        description:
          "Prior employer verification, educational validation, and criminal history checks completed upfront.",
      },
      {
        icon: "TrendingUp",
        title: "Compensation benchmarking",
        description:
          "Real-time market salary data ensure competitive offers that close top candidates without overpaying.",
      },
      {
        icon: "CheckCircle2",
        title: "Offer negotiation support",
        description:
          "Dedicated talent partners manage candidate expectations and negotiate terms to secure 95%+ offer acceptance.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Role calibration",
        duration: "Day 0",
        description:
          "Define required competencies, architectural challenges, team culture, and compensation range.",
      },
      {
        step: "02",
        title: "Deep sourcing & screening",
        duration: "Day 1–2",
        description:
          "AI sourcing algorithm queries 2M+ profiles, followed by technical evaluation of top matches.",
      },
      {
        step: "03",
        title: "Shortlist presentation",
        duration: "Day 2–3",
        description:
          "Review calibrated shortlists with complete assessment dossiers, code artifacts, and salary expectations.",
      },
      {
        step: "04",
        title: "Interview & closing",
        duration: "Day 4–14",
        description:
          "Conduct client interviews, extend offers with STIOOS closing support, and finalize start dates.",
      },
    ],
    benefits: [
      {
        value: "48h",
        label: "Rapid shortlisting",
        description: "Skip the weeks of resume reviewing with instant access to pre-screened talent.",
      },
      {
        value: "85%",
        label: "Offer acceptance",
        description: "Transparent pre-alignment on salary and expectations prevents last-minute dropouts.",
      },
      {
        value: "60%",
        label: "Time-to-hire reduction",
        description: "Close critical senior engineering openings in under two weeks rather than two months.",
      },
      {
        value: "90-day",
        label: "Replacement guarantee",
        description: "Guaranteed replacement within 48 hours if a hired candidate leaves within 90 days.",
      },
    ],
    faqs: [
      {
        q: "How does STIOOS source passive candidates?",
        a: "Our sourcing engine continuously tracks open-source repositories, developer communities, and specialized technical networks to engage top 1% talent not active on traditional job boards.",
      },
      {
        q: "What information is included in candidate dossiers?",
        a: "Each dossier contains verified technical assessment scores, portfolio code links, mentor interview notes, current compensation breakdown, and notice period details.",
      },
      {
        q: "What are your fee terms for recruitment services?",
        a: "We operate on a contingency pay-after-join model: you only pay when a candidate successfully joins your team, backed by a 90-day replacement warranty.",
      },
      {
        q: "Can you help hire across international remote locations?",
        a: "Yes, STIOOS supports global recruitment across North America, Europe, India, Southeast Asia, and Latin America with full EOR capabilities.",
      },
      {
        q: "How do you ensure candidate diversity in shortlists?",
        a: "Our AI sourcing filters focus strictly on verified competencies and code benchmarks, removing bias and surfacing diverse candidate pipelines.",
      },
    ],
    ctaKicker: "Looking to hire senior technical talent?",
    ctaTitle: "Start sourcing with STIOOS today",
  },

  "hire-talent/talent-deployment": {
    groupSlug: "hire-talent",
    subSlug: "talent-deployment",
    heroEyebrow: "Hire Talent · For Employers",
    heroSubtitle:
      "Deploy pre-vetted talent pods on demand — contract, project-based, or dedicated team engagement.",
    heroStats: [
      {
        value: "7 days",
        label: "Pod deployment",
        detail: "Complete cross-functional teams assembled, equipped, and productive in one week.",
      },
      {
        value: "100%",
        label: "IP ownership",
        detail: "All code, documentation, and IP transferred immediately with full legal protection.",
      },
      {
        value: "98%",
        label: "Sprint delivery SLA",
        detail: "Tracked sprint velocity and milestone completion overseen by STIOOS delivery managers.",
      },
    ],
    overview: {
      p1: "When high-stakes product initiatives face looming deadlines, hiring individuals one by one is too slow and risky. STIOOS Talent Deployment delivers fully assembled, cross-functional engineering pods on demand — including tech leads, full-stack engineers, cloud architects, and QA specialists who have already delivered together.",
      p2: "Our deployment model provides agile capacity that scales up or down based on your roadmap demands. We handle workspace setup, security compliance, hardware provisioning, and daily operational management, allowing you to focus on strategy while our pods execute sprint by sprint.",
    },
    capabilities: [
      {
        icon: "Layers",
        title: "Dedicated engineering pods",
        description:
          "Pre-configured teams of 3 to 12 engineers aligned to your exact architectural patterns and development rituals.",
      },
      {
        icon: "Rocket",
        title: "Rapid pod deployment",
        description:
          "From contract sign-off to first sprint kickoff in as little as 5 to 7 business days.",
      },
      {
        icon: "ShieldCheck",
        title: "Enterprise security & compliance",
        description:
          "SOC 2, ISO 27001, and GDPR-aligned processes with MDM-managed devices and zero-trust VPN access.",
      },
      {
        icon: "TrendingUp",
        title: "Delivery governance & metrics",
        description:
          "Weekly velocity reports, burndown tracking, and direct sprint reviews led by an experienced Scrum lead.",
      },
      {
        icon: "Users",
        title: "Seamless toolchain integration",
        description:
          "Pods integrate directly into your Jira, Slack, GitHub/GitLab, and cloud environments as extended team members.",
      },
      {
        icon: "RefreshCw",
        title: "Flexible elastic scaling",
        description:
          "Scale pod capacity up or down with 30-day notice as project phases and feature priorities evolve.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Architecture & pod scoping",
        duration: "Day 0–2",
        description:
          "Define project deliverables, architectural blueprint, team composition, and integration requirements.",
      },
      {
        step: "02",
        title: "Pod assembly & match",
        duration: "Day 3–4",
        description:
          "Select pre-vetted engineers and technical lead with proven domain experience on your tech stack.",
      },
      {
        step: "03",
        title: "Environment & onboarding",
        duration: "Day 5–6",
        description:
          "Setup code repositories, access credentials, secure workspaces, and communication channels.",
      },
      {
        step: "04",
        title: "Sprint 0 & ongoing execution",
        duration: "Day 7+",
        description:
          "Execute Sprint 0 kickoff, begin feature delivery, and maintain weekly stakeholder velocity reporting.",
      },
    ],
    benefits: [
      {
        value: "7 days",
        label: "Deployment speed",
        description: "Launch complex engineering initiatives weeks faster than conventional hiring allows.",
      },
      {
        value: "100%",
        label: "Full IP transfer",
        description: "Zero IP encumbrance — all code and technical artifacts belong entirely to your company.",
      },
      {
        value: "35%",
        label: "Operational savings",
        description: "Lower overhead compared to traditional systems integrators or internal team expansion.",
      },
      {
        value: "Zero",
        label: "Management overhead",
        description: "Our dedicated delivery leads handle scrum ceremonies, sprint tracking, and HR admin.",
      },
    ],
    faqs: [
      {
        q: "What roles typically make up an on-demand pod?",
        a: "A typical pod consists of a Technical Lead/Architect, 2–4 Full-Stack or Backend Engineers, a Frontend/Mobile Engineer, a QA Automation Engineer, and an optional Scrum/Delivery Manager.",
      },
      {
        q: "How do pods coordinate with our in-house engineering team?",
        a: "Pods attend your daily standups, follow your PR review guidelines, write code directly in your repos, and participate in your regular planning and retrospective rituals.",
      },
      {
        q: "What happens if a pod member needs to be swapped out?",
        a: "We provide seamless replacement within 5 business days at zero overlap cost, including knowledge transfer managed by our delivery lead.",
      },
      {
        q: "Can we hire deployed pod members as permanent employees?",
        a: "Yes. We offer transparent conversion pathways for clients who wish to transition deployed contractors into full-time staff.",
      },
      {
        q: "How is billing structured for deployed talent pods?",
        a: "Billing is structured as a transparent monthly sprint retainer based on pod size and seniority, with no hidden platform fees.",
      },
    ],
    ctaKicker: "Ready to scale your engineering velocity?",
    ctaTitle: "Deploy a dedicated engineering pod in 7 days",
  },

  // ─────────────── Scale Workforce (Employer) ───────────────

  "scale-workforce/workforce-management": {
    groupSlug: "scale-workforce",
    subSlug: "workforce-management",
    heroEyebrow: "Scale Workforce · For Employers",
    heroSubtitle:
      "Complete workforce management from hiring to retention — one partner throughout the lifecycle.",
    heroStats: [
      {
        value: "360°",
        label: "Talent operations",
        detail: "Sourcing, onboarding, payroll, performance, retention, and offboarding under one unified SLA.",
      },
      {
        value: "99.9%",
        label: "Statutory compliance",
        detail: "Zero-penalty track record covering global labor laws, tax withholding, and benefit mandates.",
      },
      {
        value: "35%",
        label: "HR overhead reduction",
        detail: "Consolidate multiple staffing vendors, payroll agencies, and contractors into one partnership.",
      },
    ],
    overview: {
      p1: "Scaling a distributed technical workforce across regions introduces complex operational friction — vendor proliferation, compliance exposure, fragmented onboarding, and inconsistent performance metrics. STIOOS Workforce Management provides an end-to-end operational operating system for modern distributed teams.",
      p2: "We manage talent sourcing, contractor payroll, Employer of Record (EOR) services, benefits administration, hardware logistics, and continuous performance monitoring. You get a single transparent invoice, robust governance, and complete operational freedom to focus on your core product mission.",
    },
    capabilities: [
      {
        icon: "Users",
        title: "Vendor consolidation",
        description:
          "Replace dozens of fragmented staffing agencies with a single consolidated management partner and contract.",
      },
      {
        icon: "ShieldCheck",
        title: "Global Employer of Record (EOR)",
        description:
          "Hire legal contractors and full-time employees in 50+ countries without establishing local business entities.",
      },
      {
        icon: "FileCheck",
        title: "Statutory & tax compliance",
        description:
          "Automated handling of local labor laws, social security, provident funds, health coverage, and tax filings.",
      },
      {
        icon: "Briefcase",
        title: "IT hardware & asset logistics",
        description:
          "Zero-touch procurement, MDM provisioning, secure delivery, and recovery of laptops and peripheral assets.",
      },
      {
        icon: "TrendingUp",
        title: "Performance & bench retention",
        description:
          "Regular engagement check-ins, performance scorecards, and proactive retention programs that minimize churn.",
      },
      {
        icon: "DollarSign",
        title: "Transparent centralized billing",
        description:
          "One monthly consolidated invoice with transparent rate breakdowns, time tracking, and expense auditing.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Operations discovery",
        duration: "Week 0",
        description:
          "Audit existing workforce composition, vendor agreements, compliance posture, and cost structures.",
      },
      {
        step: "02",
        title: "Transition & onboarding plan",
        duration: "Week 1",
        description:
          "Build a structured migration timeline to re-badge or onboard existing contractors with zero operational downtime.",
      },
      {
        step: "03",
        title: "EOR & payroll transition",
        duration: "Week 2–3",
        description:
          "Execute compliant contracts, configure payroll engines, and transition team members seamlessly.",
      },
      {
        step: "04",
        title: "Ongoing lifecycle management",
        duration: "Ongoing",
        description:
          "Deliver automated payroll, monthly compliance audits, IT asset management, and dedicated account support.",
      },
    ],
    benefits: [
      {
        value: "35%",
        label: "Admin cost savings",
        description: "Eliminate vendor markups and reduce internal HR and legal hours dedicated to contractor management.",
      },
      {
        value: "Zero",
        label: "Misclassification risk",
        description: "Bulletproof contractor and EOR classifications safeguard your company against regulatory fines.",
      },
      {
        value: "48h",
        label: "Rapid employee onboarding",
        description: "Onboard new team members across geographies with compliant contracts and equipment in 48 hours.",
      },
      {
        value: "Single",
        label: "Consolidated point of contact",
        description: "A dedicated senior account director handles all operational queries, scaling requests, and escalations.",
      },
    ],
    faqs: [
      {
        q: "What is an Employer of Record (EOR) service?",
        a: "As your EOR, STIOOS legally employs workers on your behalf in regions where you do not have a registered legal entity, handling local payroll, benefits, and taxes while you direct their day-to-day work.",
      },
      {
        q: "Can you transition our existing contractors onto your platform?",
        a: "Yes. We offer painless transition programs that re-badge and consolidate existing freelancers and agency contractors with no disruption to ongoing project work.",
      },
      {
        q: "How do you protect intellectual property across distributed teams?",
        a: "All employment and contractor agreements include comprehensive, jurisdiction-specific IP assignment clauses, non-disclosure agreements, and strict data confidentiality protocols.",
      },
      {
        q: "What countries do you support for international payroll?",
        a: "We support compliant payroll and EOR operations across 50+ countries spanning North America, Europe, Latin America, and Asia-Pacific.",
      },
      {
        q: "How does billing and invoicing work?",
        a: "You receive a single, detailed monthly invoice in your preferred currency, summarizing approved timesheets, contractor costs, statutory fees, and asset expenses.",
      },
    ],
    ctaKicker: "Ready to streamline your distributed operations?",
    ctaTitle: "Simplify your workforce management with STIOOS",
  },

  "scale-workforce/talent-assessment-programs": {
    groupSlug: "scale-workforce",
    subSlug: "talent-assessment-programs",
    heroEyebrow: "Scale Workforce · For Employers",
    heroSubtitle:
      "AI-powered assessments to evaluate technical skills, aptitude, and job readiness at scale.",
    heroStats: [
      {
        value: "500+",
        label: "Pre-built skill tests",
        detail: "Standardized assessments across software engineering, AI, DevOps, data, and soft skills.",
      },
      {
        value: "99.4%",
        label: "Proctoring integrity",
        detail: "AI-proctored environment with webcam monitoring, keystroke analysis, and plagiarism detection.",
      },
      {
        value: "75%",
        label: "Screening time saved",
        detail: "Automate top-of-funnel technical screening and focus engineering interviews on verified talent.",
      },
    ],
    overview: {
      p1: "Evaluating technical candidates through self-reported resumes and basic coding quizzes leads to bad hires and wasted engineering hours. STIOOS Talent Assessment Programs delivers enterprise-grade, AI-proctored technical benchmarking that evaluates real problem-solving, architectural acumen, and code quality.",
      p2: "Our assessment suite includes live coding playgrounds, full-stack take-home sandboxes, and behavioral aptitude evaluations. Detailed candidate scorecards provide granular benchmarks against national percentiles, giving hiring managers definitive data to make confident offers.",
    },
    capabilities: [
      {
        icon: "ClipboardCheck",
        title: "AI-proctored coding sandboxes",
        description:
          "Real IDE environments supporting 40+ programming languages with automated test suite validation.",
      },
      {
        icon: "Brain",
        title: "Adaptive difficulty scoring",
        description:
          "Assessment questions adapt dynamically based on candidate performance to pinpoint exact skill boundaries.",
      },
      {
        icon: "ShieldCheck",
        title: "Anti-cheating & plagiarism defense",
        description:
          "Advanced webcam proctoring, dual-screen detection, ChatGPT/AI copy-paste flags, and syntax tree comparisons.",
      },
      {
        icon: "Target",
        title: "Custom role-aligned benchmarks",
        description:
          "Tailor test questions to mirror your specific production bugs, architectural decisions, and APIs.",
      },
      {
        icon: "TrendingUp",
        title: "Comparative candidate analytics",
        description:
          "Benchmark applicants against 500,000+ historical assessments with percentile rankings and skill heatmaps.",
      },
      {
        icon: "Layers",
        title: "Seamless ATS integration",
        description:
          "Integrates directly with Greenhouse, Lever, Ashby, Workday, and standard enterprise applicant tracking systems.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Assessment design",
        duration: "Day 0",
        description:
          "Select from pre-built question libraries or co-create custom coding challenges tailored to your role.",
      },
      {
        step: "02",
        title: "Candidate invitation",
        duration: "Automated",
        description:
          "Invite candidates via automated ATS triggers or direct email links with flexible completion deadlines.",
      },
      {
        step: "03",
        title: "Proctored execution",
        duration: "45–90 min",
        description:
          "Candidates complete interactive coding challenges under secure AI-proctored conditions.",
      },
      {
        step: "04",
        title: "Instant scorecard delivery",
        duration: "Real-time",
        description:
          "Receive automated reports detailing code efficiency, edge-case coverage, code style, and proctoring integrity.",
      },
    ],
    benefits: [
      {
        value: "75%",
        label: "Engineering time saved",
        description: "Eliminate low-signal initial technical phone screens conducted by expensive senior developers.",
      },
      {
        value: "0%",
        label: "AI cheating vulnerability",
        description: "Advanced proctoring algorithms detect automated code generators and copy-pasted LLM outputs.",
      },
      {
        value: "3x",
        label: "Hiring velocity",
        description: "Automatically advance qualified test-takers directly to final team interviews in minutes.",
      },
      {
        value: "Objective",
        label: "Unbiased hiring data",
        description: "Standardized scoring rubrics remove unconscious bias and promote meritocratic hiring decisions.",
      },
    ],
    faqs: [
      {
        q: "How do your assessments prevent candidates from using ChatGPT or AI tools?",
        a: "Our testing sandbox features browser lockouts, disabled copy-paste, webcam gaze tracking, keystroke pattern verification, and an AI detector that compares code structure against known LLM output models.",
      },
      {
        q: "Can we create our own custom coding challenges?",
        a: "Yes! You can author private challenges, upload your own test cases and starter repos, or customize existing library questions.",
      },
      {
        q: "What programming languages and frameworks are supported?",
        a: "We support over 40 languages including JavaScript/TypeScript, Python, Java, C++, Go, Rust, C#, PHP, Ruby, SQL, and modern frameworks like React, Next.js, and Django.",
      },
      {
        q: "How does the ATS integration work?",
        a: "Our integrations automatically trigger assessment invites when a candidate enters a specific ATS stage and pushes completed scores and reports back into the candidate profile.",
      },
      {
        q: "Can assessments be used for internal employee skill evaluations?",
        a: "Yes. Many enterprise clients use our platform for internal technical reviews, annual promotion evaluations, and training gap identification.",
      },
    ],
    ctaKicker: "Ready to upgrade your technical screening?",
    ctaTitle: "Deploy AI-proctored assessments today",
  },

  "scale-workforce/placement-services": {
    groupSlug: "scale-workforce",
    subSlug: "placement-services",
    heroEyebrow: "Scale Workforce · For Employers",
    heroSubtitle:
      "Dedicated placement cell connecting your trained talent with hiring employers across industries.",
    heroStats: [
      {
        value: "500+",
        label: "Hiring enterprise partners",
        detail: "Active network of tech unicorns, Fortune 500 enterprises, and fast-growing startups.",
      },
      {
        value: "92%",
        label: "60-day placement rate",
        detail: "Trained candidates placed into verified full-time positions within two months of graduation.",
      },
      {
        value: "90-day",
        label: "Replacement guarantee",
        detail: "Full replacement warranty backing every placement made through our corporate network.",
      },
    ],
    overview: {
      p1: "Connecting qualified technical talent with the right enterprise opportunities requires more than a job board. STIOOS Placement Services operates a dedicated, high-touch placement cell that bridges trained, verified candidates with active engineering demand across 500+ hiring organizations.",
      p2: "We manage the entire placement lifecycle: role matching, interview scheduling, compensation alignment, background verification, and initial onboarding support. For candidates, we offer guaranteed interview pipelines; for employers, we provide a constant flow of job-ready talent with verified technical track records.",
    },
    capabilities: [
      {
        icon: "TrendingUp",
        title: "Enterprise placement cell",
        description:
          "Dedicated placement managers actively pitch verified candidate portfolios directly to hiring engineering VPs.",
      },
      {
        icon: "Target",
        title: "Precision match scoring",
        description:
          "AI matching engine aligns candidate skill profiles, compensation expectations, and culture preferences with open JDs.",
      },
      {
        icon: "Users",
        title: "Mock interview masterclasses",
        description:
          "Rigorous technical and behavioral interview preparation customized to the specific interview styles of target employers.",
      },
      {
        icon: "Briefcase",
        title: "Campus & institutional tie-ups",
        description:
          "Comprehensive placement drives connecting university cohorts and bootcamp graduates with corporate hiring teams.",
      },
      {
        icon: "FileCheck",
        title: "Offer & documentation management",
        description:
          "End-to-end handling of offer letters, negotiation advisory, background verification, and joining logistics.",
      },
      {
        icon: "ShieldCheck",
        title: "Post-joining onboarding support",
        description:
          "90-day check-in cadence ensuring candidates ramp effectively and resolve early operational challenges.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Talent verification & profile lock",
        duration: "Day 0",
        description:
          "Validate assessment scores, capstone projects, and candidate availability into a verified talent profile.",
      },
      {
        step: "02",
        title: "Enterprise matching & pitches",
        duration: "Day 1–7",
        description:
          "Placement managers share vetted candidate dossiers with hiring managers across relevant open roles.",
      },
      {
        step: "03",
        title: "Interview coordination",
        duration: "Day 8–20",
        description:
          "Coordinate multi-stage interviews, debrief candidates, and communicate real-time employer feedback.",
      },
      {
        step: "04",
        title: "Offer rollout & onboarding",
        duration: "Day 21–30",
        description:
          "Finalize formal offer letters, align start dates, and oversee joining formalities with 90-day warranty.",
      },
    ],
    benefits: [
      {
        value: "92%",
        label: "Placement success rate",
        description: "Over nine out of ten qualified graduates secure confirmed full-time offers within 60 days.",
      },
      {
        value: "500+",
        label: "Active hiring partners",
        description: "Direct relationship with leading engineering organizations across North America, Europe, and Asia.",
      },
      {
        value: "48h",
        label: "Shortlist turnaround",
        description: "Hiring partners receive curated candidate slates within 48 hours of posting requirements.",
      },
      {
        value: "90-day",
        label: "Replacement protection",
        description: "Risk-free hiring terms with free candidate replacement if a placement exits within three months.",
      },
    ],
    faqs: [
      {
        q: "How does STIOOS Placement Services work for hiring companies?",
        a: "Hiring companies share their open role requirements with our placement cell. We deliver pre-screened, interview-ready candidate dossiers within 48 hours on a pay-after-join basis.",
      },
      {
        q: "What industries do your placement partners represent?",
        a: "Our network spans software SaaS, fintech, healthcare tech, ecommerce, automotive, consulting, and AI technology firms.",
      },
      {
        q: "Are candidates available for both remote and on-site roles?",
        a: "Yes. Our talent pool includes professionals open to fully remote, hybrid, or on-site relocation based on your company preferences.",
      },
      {
        q: "What guarantees do you offer employers?",
        a: "Every hire made through STIOOS Placement Services includes a 90-day replacement guarantee backed by written contract terms.",
      },
      {
        q: "How can academic institutions or bootcamps partner with STIOOS?",
        a: "We offer institutional placement partnerships where we act as the dedicated placement cell for graduating cohorts, connecting students directly to employer demand.",
      },
    ],
    ctaKicker: "Looking to hire verified talent or place a cohort?",
    ctaTitle: "Connect with our placement team today",
  },
};

// ============================================================
// SHARED SECTION CONTENT — platform-wide constants rendered by
// the 5 new sections in <CandidateSubPage />. Identical across
// all 9 candidate sub-pages because they describe the STIOOS
// platform, not the specific sub-page.
// ============================================================

/** Section 7 — Trust bar. 6 platform-wide trust badges. */
export const CANDIDATE_TRUST_BADGES: CandidateTrustBadge[] = [
  { icon: "ShieldCheck", label: "ISO 27001 aligned" },
  { icon: "Users", label: "2M+ assessed pool" },
  { icon: "Clock", label: "48h shortlists" },
  { icon: "RefreshCw", label: "90-day replacement" },
  { icon: "Wallet", label: "Pay-after-join model" },
  { icon: "Star", label: "4.9/5 candidate rating" },
];

/** Section 9 — Comparison. 6 rows comparing STIOOS vs traditional. */
export const CANDIDATE_COMPARISON: CandidateComparisonRow[] = [
  {
    dimension: "Time to results",
    traditional: "3–6 months of unstructured job hunting and generic applications.",
    withUs: "48-hour shortlists, 8–12 week role-aligned ramps, placement within 60 days of capstone.",
  },
  {
    dimension: "Cost model",
    traditional: "Upfront bootcamp fees or recruiter commissions with no outcome guarantee.",
    withUs: "Pay-after-join model — you settle placement fees only after you're hired and ramped.",
  },
  {
    dimension: "Quality of signal",
    traditional: "Self-reported skills, resume keywords and take-home tests nobody trusts.",
    withUs: "AI-scored assessments plus mentor-verified competency profiles, portable to LinkedIn.",
  },
  {
    dimension: "Support",
    traditional: "Solo — you're on your own after the course ends.",
    withUs: "Senior mentors, weekly checkpoint reviews and a placement specialist until day 90.",
  },
  {
    dimension: "Scalability",
    traditional: "One application, one role, one employer at a time.",
    withUs: "500+ employers hiring, 2M+ assessed candidate pool, cross-track applications welcome.",
  },
  {
    dimension: "Risk",
    traditional: "All risk sits with you — fees, time, opportunity cost.",
    withUs: "90-day replacement guarantee and written SLAs on every engagement, by contract.",
  },
];

/** Section 10 — Industries. 8 verticals with domain-fluent delivery. */
export const CANDIDATE_INDUSTRIES: CandidateIndustry[] = [
  { icon: "Landmark", name: "Fintech & Banking" },
  { icon: "HeartHandshake", name: "Healthcare & Life Sciences" },
  { icon: "ShoppingCart", name: "Retail & E-commerce" },
  { icon: "Cloud", name: "SaaS & Software" },
  { icon: "Factory", name: "Manufacturing" },
  { icon: "Package", name: "Logistics & Supply Chain" },
  { icon: "GraduationCap", name: "Education & EdTech" },
  { icon: "Radio", name: "Telecom & Media" },
];

/** Section 11 — Guarantees. 4 written commitments on every engagement. */
export const CANDIDATE_GUARANTEES: CandidateGuarantee[] = [
  {
    icon: "RefreshCw",
    title: "90-day replacement",
    description:
      "If a placement doesn't pass the 90-day ramp, we re-run the match and replace the candidate at no extra placement fee — in writing, not in marketing copy.",
  },
  {
    icon: "Wallet",
    title: "Pay-after-join model",
    description:
      "Placement fees settle only after the candidate joins and clears the ramp period. No upfront retainers for job seekers; employers pay on confirmed start dates.",
  },
  {
    icon: "ShieldCheck",
    title: "SLA-backed delivery",
    description:
      "Every engagement ships with a written SLA — response times, checkpoint cadence, capstone grading bar and replacement triggers. You can hold us to each clause.",
  },
  {
    icon: "BarChart3",
    title: "Weekly progress reporting",
    description:
      "Candidates and employers get a shared weekly report — sprint progress, checkpoint scores, placement pipeline status. No black boxes, no surprise endings.",
  },
];

/**
 * Section 8 — Audiences. Two cards per parent group (Job Seekers +
 * Employers), varied by group so the copy stays relevant to the
 * sub-page's focus (training vs placement vs certification).
 */
export const CANDIDATE_AUDIENCES: Record<string, CandidateAudience[]> = {
  "get-trained": [
    {
      icon: "GraduationCap",
      kicker: "For Job Seekers",
      title: "Learn on your exact stack",
      description:
        "A mentor-led curriculum co-designed around your target role — not a generic bootcamp. You ship production-shaped code in the stack you'll be hired to work in.",
      bullets: [
        "Daily pairing with a senior mentor on your target stack",
        "Weekly checkpoint reviews graded against real industry rubrics",
        "Client-shaped capstone defended to mentor + client reviewers",
        "Entry into the placement pool with a verified competency profile",
      ],
      ctaLabel: "Start your application",
      ctaHref: "/contact",
    },
    {
      icon: "Building2",
      kicker: "For Employers",
      title: "Hire job-ready graduates",
      description:
        "Sponsor a cohort or hire from our active graduate pool — candidates who've already shipped code in your stack, graded by industry practitioners.",
      bullets: [
        "Vetted cohorts trained on your exact stack and conventions",
        "Stack-matched candidates with verified capstone portfolios",
        "90-day replacement guarantee on every placement, by contract",
        "Pay-after-join model — placement fees settle on confirmed start dates",
      ],
      ctaLabel: "Sponsor a cohort",
      ctaHref: "/contact",
    },
  ],
  "get-placed": [
    {
      icon: "Briefcase",
      kicker: "For Job Seekers",
      title: "Get matched to live roles",
      description:
        "AI-matched openings across 500+ employers hiring right now. You enter with a Recommended Candidate badge and leave with an offer — supported end-to-end.",
      bullets: [
        "AI match scoring against 500+ live employer openings",
        "Recommended Candidate badge for 70%+ match roles",
        "50+ mock interviews and 200+ company playbooks",
        "Offer negotiation, document support and 90-day ramp plan",
      ],
      ctaLabel: "Browse open roles",
      ctaHref: "/contact",
    },
    {
      icon: "Building2",
      kicker: "For Employers",
      title: "Hire pre-screened talent",
      description:
        "Receive AI-ranked shortlists of verified candidates within 48 hours — competency profiles, capstone repos and reference checks already done.",
      bullets: [
        "48-hour shortlists with AI-ranked, mentor-verified candidates",
        "Verified competency profiles and public capstone repos",
        "Placement SLAs with 90-day replacement guarantee",
        "Pay-after-join model — no upfront retainers, settle on start date",
      ],
      ctaLabel: "Request a shortlist",
      ctaHref: "/contact",
    },
  ],
  "get-certified": [
    {
      icon: "Award",
      kicker: "For Job Seekers",
      title: "Earn verifiable credentials",
      description:
        "AI-scored skills assessments, industry certifications and a public portfolio — cryptographically verified and portable to LinkedIn, your resume and employer ATS.",
      bullets: [
        "200+ skill tracks with AI-scored, cryptographically verified results",
        "30+ industry certifications (AWS, Azure, GCP, K8s, PMP) with exam fees included",
        "3+ real client-shaped portfolio projects in public repos",
        "Portable verification links for LinkedIn, resumes and employer ATS",
      ],
      ctaLabel: "Get certified",
      ctaHref: "/contact",
    },
    {
      icon: "Building2",
      kicker: "For Employers",
      title: "Verify candidate skills",
      description:
        "Skip the take-home tests and self-reported skills — verify every candidate against a standardized, cryptographically signed competency benchmark.",
      bullets: [
        "Cryptographically verified assessment scores per candidate",
        "Industry certification validation (AWS, Azure, GCP, K8s, PMP)",
        "Public portfolio repos — read the code, run the app, no NDA needed",
        "Standardized benchmarking across your entire candidate pipeline",
      ],
      ctaLabel: "Verify candidates",
      ctaHref: "/contact",
    },
  ],
  "build-talent": [
    {
      icon: "GraduationCap",
      kicker: "For Engineering Leaders",
      title: "Co-design your talent pipeline",
      description:
        "Sponsor custom cohorts trained on your exact stack, architecture, and coding conventions — graduates arrive as contributors, not novices.",
      bullets: [
        "Curricula co-designed around your production stack and tools",
        "Daily mentor pairing and weekly code review checkpoints",
        "Client-specific capstone defended to your engineering panel",
        "Pay-after-join model with 90-day replacement warranty",
      ],
      ctaLabel: "Sponsor a cohort",
      ctaHref: "/contact",
    },
    {
      icon: "Building2",
      kicker: "For Enterprise L&D",
      title: "Upskill internal engineering teams",
      description:
        "Practical sprint-based training across Generative AI, cloud-native architecture, and DevOps that drives immediate internal mobility.",
      bullets: [
        "Interactive mentor-led sprints and cloud sandbox labs",
        "Capstone projects solving real internal engineering problems",
        "Objective skills benchmarking before and after training",
        "Flexible scheduling designed around sprint commitments",
      ],
      ctaLabel: "Plan corporate training",
      ctaHref: "/contact",
    },
  ],
  "hire-talent": [
    {
      icon: "Briefcase",
      kicker: "For Hiring Managers",
      title: "Tap pre-vetted engineering talent",
      description:
        "Access a 2M+ candidate pool with shortlists delivered in 48 hours — technical screening, code verification, and background checks pre-completed.",
      bullets: [
        "48-hour shortlists with AI-matched, verified candidates",
        "Contract, permanent, and contract-to-hire engagement models",
        "Full statutory compliance and payroll handled via EOR",
        "90-day no-questions-asked replacement guarantee",
      ],
      ctaLabel: "Request a shortlist",
      ctaHref: "/contact",
    },
    {
      icon: "Building2",
      kicker: "For Scaling Companies",
      title: "Deploy on-demand engineering pods",
      description:
        "Turnkey multi-disciplinary squads deployed in 7 days to accelerate product roadmap delivery with dedicated delivery management.",
      bullets: [
        "Fully equipped teams of 3 to 12 experienced engineers",
        "Seamless integration into your Jira, GitHub, and Slack workflows",
        "Weekly velocity reporting and transparent milestone tracking",
        "100% intellectual property ownership transferred immediately",
      ],
      ctaLabel: "Deploy a talent pod",
      ctaHref: "/contact",
    },
  ],
  "scale-workforce": [
    {
      icon: "TrendingUp",
      kicker: "For Operations Leaders",
      title: "End-to-end workforce operations",
      description:
        "Consolidate contractor management, global EOR, payroll, compliance, and IT logistics under a single trusted operating partner.",
      bullets: [
        "Single consolidated invoice across all global contractors",
        "Compliant payroll and EOR operations in 50+ countries",
        "Zero-touch laptop procurement, MDM, and asset retrieval",
        "Bulletproof protection against worker misclassification",
      ],
      ctaLabel: "Consolidate workforce",
      ctaHref: "/contact",
    },
    {
      icon: "Building2",
      kicker: "For Talent Acquisition",
      title: "AI-proctored skills assessment",
      description:
        "Standardize technical screening across 500+ skill tracks with automated test sandboxes and anti-cheating proctoring.",
      bullets: [
        "AI-proctored code execution supporting 40+ languages",
        "Plagiarism and ChatGPT detection algorithms built in",
        "Automated candidate scorecards integrated into your ATS",
        "Eliminate low-signal initial technical phone screens",
      ],
      ctaLabel: "Explore assessments",
      ctaHref: "/contact",
    },
  ],
};

// ============================================================
// LOOKUP HELPERS
// ============================================================

/** Find the group + sub-page for a [slug]/[sub] route pair. */
export function findCandidateSubPage(
  groupSlug: string,
  subSlug: string
): { group: TalentStripGroup; subPage: TalentSubPage; content: CandidateSubPageContent } | undefined {
  const group = TALENT_STRIP_GROUPS.find((g) => g.slug === groupSlug);
  if (!group) return undefined;
  const subPage = group.subPages.find((s) => s.slug === subSlug);
  if (!subPage) return undefined;
  const content = CONTENT[`${groupSlug}/${subSlug}`];
  if (!content) return undefined;
  return { group, subPage, content };
}

/** The 6 group icons (kept here so the page file doesn't need
 *  to import them individually). */
export const GROUP_ICONS: Record<string, LucideIcon> = {
  "get-trained": GraduationCap,
  "get-placed": Briefcase,
  "get-certified": Award,
  "build-talent": Users,
  "hire-talent": UserCheck,
  "scale-workforce": TrendingUp,
};

/** Override the sub-page icon for the hero tile (the strip icon
 *  is the same as in talent-strip-groups.ts). Kept here for the
 *  page file. */
export const SUB_PAGE_ICONS: Record<string, LucideIcon> = {
  "custom-cohort-curriculum": BookOpen,
  "ai-candidate-screening": Target,
  "training-sprint-delivery": Rocket,
  "browse-open-roles": Briefcase,
  "interview-preparation": Users,
  "offer-onboarding": FileText,
  "skills-assessment": ClipboardCheck,
  "industry-certifications": Award,
  "career-portfolio": TrendingUp,
  "train-to-hire-cohorts": GraduationCap,
  "hire-to-train-programs": UserCheck,
  "corporate-training-programs": Award,
  "staffing-solutions": Briefcase,
  "talent-sourcing-recruitment": Target,
  "talent-deployment": Layers,
  "workforce-management": Users,
  "talent-assessment-programs": ClipboardCheck,
  "placement-services": TrendingUp,
};
