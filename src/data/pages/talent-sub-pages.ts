import type { IconKey, PageSpec } from "./types";

// ============================================================
// TALENT SUB-PAGES — 8 deep-dive pages per Talent Solutions
// option (9 × 8 = 72 pages), rendered at
// /talent-solutions/[option]/[sub] from one PageSpec each.
//
// Each seed carries the page's identity (title, highlight,
// blurb, icon, 4 focus pillars). buildTalentSubSpec() expands
// one seed + its parent option spec into a complete 24-section
// PageSpec deterministically — same seed, same page, always.
// ============================================================

export interface TalentSubSeed {
  /** URL segment — /talent-solutions/<option>/<slug> */
  slug: string;
  /** Hero title (first line) */
  title: string;
  /** Gradient-highlighted tail of the hero title */
  highlight: string;
  /** Hero subtitle */
  blurb: string;
  /** Hero/KPI icon */
  icon: IconKey;
  /** 4 focus pillars this page covers — woven through KPIs,
      value props, process, deliverables, modules, FAQs */
  focus: [string, string, string, string];
}

export const TALENT_SUB_SEEDS: Record<string, TalentSubSeed[]> = {
  // ─────────────── Train to Hire ───────────────
  "train-to-hire": [
    {
      slug: "custom-cohort-curriculum",
      title: "Custom Cohort Curriculum",
      highlight: "trained on your exact stack",
      blurb:
        "We co-design the training syllabus with your tech leads — your tools, your conventions, your workflows — so graduates join as contributors, not beginners.",
      icon: "BookOpen",
      focus: ["Role profile workshops", "Stack-specific modules", "Client checkpoint reviews", "Capstone blueprint"],
    },
    {
      slug: "ai-candidate-screening",
      title: "AI Candidate Screening",
      highlight: "a shortlist that clears your bar",
      blurb:
        "Every candidate clears AI-scored aptitude, communication and technical screens before training begins — so your cohort starts already filtered for potential.",
      icon: "BrainCircuit",
      focus: ["Skill-graph profiling", "AI-proctored assessments", "Communication scoring", "Human panel rounds"],
    },
    {
      slug: "training-sprint-delivery",
      title: "Training Sprint Delivery",
      highlight: "from intake to job-ready in weeks",
      blurb:
        "Mentor-led sprints with weekly telemetry keep cohort progress visible — attendance, assessment scores and readiness, with early-risk alerts before problems compound.",
      icon: "Clock",
      focus: ["Mentor-led sprints", "Weekly progress telemetry", "Live client-shadow work", "Readiness gates"],
    },
    {
      slug: "capstone-projects",
      title: "Capstone on Your Workflows",
      highlight: "proof before the offer",
      blurb:
        "Trainees finish with a shadow project mirroring your live environment, assessed by your own team — you evaluate real work, not interview performance.",
      icon: "Wrench",
      focus: ["Real workflow projects", "Your team as assessors", "Portfolio artifacts", "Offer-stage evaluation"],
    },
    {
      slug: "cohort-pricing-models",
      title: "Cohort Pricing & Models",
      highlight: "success-based, pay after join",
      blurb:
        "Fees are agreed per cohort upfront and collected after candidates join — never for interviews, shortlists or training. Three models from single sprint to annual academy.",
      icon: "Wallet",
      focus: ["Pay-after-join terms", "Cohort Sprint pricing", "Pipeline Partner plans", "Enterprise Academy"],
    },
    {
      slug: "hiring-workflow-sla",
      title: "Hiring Workflow & SLAs",
      highlight: "offers you can plan around",
      blurb:
        "Interview coordination, offer windows and a 90-day ramp with free replacement cover — every commitment written into the contract, tracked week by week.",
      icon: "CalendarDays",
      focus: ["Interview coordination", "Offer windows & SLAs", "90-day ramp plan", "Free replacement cover"],
    },
    {
      slug: "employer-success-stories",
      title: "Employer Success Stories",
      highlight: "cohorts that shipped from week one",
      blurb:
        "Fintechs, hospitals and retailers built their junior pipelines with Train to Hire — the numbers, the quotes and the retention data behind each cohort.",
      icon: "Star",
      focus: ["Fintech engineering pipeline", "Healthcare analyst cohorts", "Retail platform teams", "Retention benchmarks"],
    },
    {
      slug: "trainee-experience",
      title: "The Trainee Experience",
      highlight: "why candidates choose the runway",
      blurb:
        "Earn a stipend while you train, learn from senior practitioners on live client work, and step into a guaranteed interview with a named employer.",
      icon: "GraduationCap",
      focus: ["Earn-while-you-learn stipend", "Senior mentorship", "Guaranteed interview", "Cohort community"],
    },
  ],

  // ─────────────── Hire to Train ───────────────
  "hire-to-train": [
    {
      slug: "aptitude-first-hiring",
      title: "Aptitude-First Hiring",
      highlight: "hire attitude, train the skills",
      blurb:
        "We screen for learning velocity, problem-solving and work ethic first — then you hire candidates whose skills we build to your exact specification on the job.",
      icon: "UserCheck",
      focus: ["Aptitude batteries", "Structured interviews", "Culture-fit signals", "Fast offer loops"],
    },
    {
      slug: "on-the-job-training",
      title: "On-the-Job Training Tracks",
      highlight: "your stack, your standards",
      blurb:
        "New hires train inside your real delivery environment — paired with seniors, shipping to your standards from week one, with certification at every gate.",
      icon: "Code",
      focus: ["Pairing with seniors", "Internal tooling fluency", "Delivery rituals", "Certification gates"],
    },
    {
      slug: "mentorship-coaching",
      title: "Mentorship & Coaching",
      highlight: "every hire gets a senior guide",
      blurb:
        "A named mentor, weekly one-to-ones and a written growth plan turn probation into a designed runway — with skip-level reviews keeping progress honest.",
      icon: "HeartHandshake",
      focus: ["Named senior mentor", "Weekly 1:1 coaching", "Written growth plans", "Skip-level reviews"],
    },
    {
      slug: "ramp-up-milestones",
      title: "Ramp-Up Milestones",
      highlight: "from day one to independent",
      blurb:
        "A 30/60/90 plan with explicit readiness gates and manager scorecards — you always know whether each hire is on track, ahead, or needs intervention.",
      icon: "TrendingUp",
      focus: ["30/60/90 plan", "Readiness gates", "Manager scorecards", "Graduation criteria"],
    },
    {
      slug: "hire-train-pricing",
      title: "Pricing & Engagement",
      highlight: "train risk off your payroll",
      blurb:
        "Pay for training outcomes, not seat-warming — per-hire training fees, cohort conversions and ramp guarantees priced upfront with no hidden renewals.",
      icon: "Wallet",
      focus: ["Per-hire training fees", "Cohort conversion rates", "Ramp guarantees", "Transparent renewals"],
    },
    {
      slug: "probation-guarantees",
      title: "Probation & Guarantees",
      highlight: "90 days, in writing",
      blurb:
        "If a hire doesn't ramp within 90 days, we replace them free — with quality thresholds, weekly visibility and clean exit options written into every contract.",
      icon: "ShieldCheck",
      focus: ["Free replacement terms", "Quality thresholds", "Weekly visibility", "Clean exit options"],
    },
    {
      slug: "client-success-stories",
      title: "Client Success Stories",
      highlight: "teams that scaled past the senior bottleneck",
      blurb:
        "How a logistics scale-up doubled its engineering team, and a BPO turned 40% attrition into a waiting list — measured outcomes from Hire to Train programs.",
      icon: "Star",
      focus: ["Logistics scale-up", "BPO attrition turnaround", "Bench-building wins", "Attrition benchmarks"],
    },
    {
      slug: "candidate-journey",
      title: "The Candidate Journey",
      highlight: "a career path, not a probation gamble",
      blurb:
        "Transparent application flow, a written training contract and a real career ladder — plus an alumni network that keeps former trainees rising for years.",
      icon: "Rocket",
      focus: ["Transparent applications", "Training contract", "Career ladder", "Alumni network"],
    },
  ],

  // ─────────────── Corporate Training ───────────────
  "corporate-training": [
    {
      slug: "skill-gap-audit",
      title: "Skill Gap Audit",
      highlight: "know exactly what to train",
      blurb:
        "We map every role's required competencies against your team's assessed capability, and hand you a prioritized heatmap — training budget aimed where it moves the needle.",
      icon: "Search",
      focus: ["Competency mapping", "Role benchmarks", "Gap heatmaps", "Priority matrix"],
    },
    {
      slug: "custom-curriculum-design",
      title: "Custom Curriculum Design",
      highlight: "built on your real workflows",
      blurb:
        "No off-the-shelf decks — learning paths are authored on your tooling, your data and your delivery rituals, with hands-on labs and assessments designed around them.",
      icon: "BookOpen",
      focus: ["Role-based learning paths", "Hands-on labs", "Your tooling & data", "Assessment design"],
    },
    {
      slug: "delivery-formats",
      title: "Delivery Formats",
      highlight: "bootcamps, workshops & on-demand",
      blurb:
        "Live bootcamps, blended cohorts, self-paced labs and manager clinics — pick the format per team, or blend them into one continuous learning rhythm.",
      icon: "Video",
      focus: ["Live bootcamps", "Blended cohorts", "Self-paced labs", "Manager clinics"],
    },
    {
      slug: "leadership-soft-skills",
      title: "Leadership & Soft Skills",
      highlight: "managers people want to follow",
      blurb:
        "First-time manager programs, communication craft, stakeholder management and decision frameworks — the human skills that decide whether technical training sticks.",
      icon: "Users",
      focus: ["First-time managers", "Communication craft", "Stakeholder management", "Decision frameworks"],
    },
    {
      slug: "certification-programs",
      title: "Certification Programs",
      highlight: "credentials that stick",
      blurb:
        "Verifiable certificates with exam prep, renewal paths and badge issuance — credentials your L&D team can audit and your engineers are proud to display.",
      icon: "BadgeCheck",
      focus: ["Verifiable certificates", "Exam preparation", "Renewal paths", "Badge issuance"],
    },
    {
      slug: "ld-analytics-roi",
      title: "L&D Analytics & ROI",
      highlight: "prove training moved the needle",
      blurb:
        "Skill deltas before and after, performance linkage, live dashboards and exec-ready reporting — the proof layer that keeps your training budget growing.",
      icon: "BarChart3",
      focus: ["Skill delta tracking", "Performance linkage", "Live L&D dashboards", "Executive reporting"],
    },
    {
      slug: "enterprise-plans",
      title: "Enterprise Plans & Pricing",
      highlight: "programs sized to your org",
      blurb:
        "From per-seat sprints to branded academies and multi-year contracts — transparent pricing bands with volume discounts and dedicated program governance.",
      icon: "Building2",
      focus: ["Seat & sprint pricing", "Branded academies", "Multi-year contracts", "Program governance"],
    },
    {
      slug: "training-case-studies",
      title: "Training Case Studies",
      highlight: "upskilling at scale, measured",
      blurb:
        "A bank that certified 300 analysts, a manufacturer that closed its DevOps gap in one quarter — real programs, real numbers, real retention curves.",
      icon: "Star",
      focus: ["Banking certification drive", "Manufacturing DevOps", "Retail academy", "Retention curves"],
    },
  ],

  // ─────────────── Talent Sourcing (Recruitment) ───────────────
  "talent-recruitment": [
    {
      slug: "ai-sourcing-engine",
      title: "AI Sourcing Engine",
      highlight: "2M+ candidates, ranked in hours",
      blurb:
        "Semantic search and skill-graph ranking sweep a 2M+ assessed pool — with automated outreach, dedupe and constant refresh, so shortlists start verified.",
      icon: "BrainCircuit",
      focus: ["Semantic talent search", "Skill-graph ranking", "Automated outreach", "Dedupe & refresh"],
    },
    {
      slug: "talent-pool-benchmarks",
      title: "Talent Pool & Benchmarks",
      highlight: "know the market before you hire",
      blurb:
        "Salary bands, availability heatmaps, competitor hiring signals and role scarcity indexes — walk into every negotiation knowing exactly where you stand.",
      icon: "BarChart3",
      focus: ["Salary band data", "Availability heatmaps", "Competitor insights", "Role scarcity index"],
    },
    {
      slug: "shortlist-sla",
      title: "48-Hour Shortlist SLA",
      highlight: "qualified profiles in two days",
      blurb:
        "One intake call, then verified, interview-ready profiles within 48 hours — every candidate pre-screened against your bar before they ever reach your inbox.",
      icon: "Clock",
      focus: ["One-call intake", "Screening gates", "Structured profiles", "Interview-ready candidates"],
    },
    {
      slug: "screening-assessment",
      title: "Screening & Assessment",
      highlight: "only verified skills reach you",
      blurb:
        "AI-scored technical screens, proctored assessments and communication evaluation run before shortlisting — your interview time is spent only on real candidates.",
      icon: "BadgeCheck",
      focus: ["AI technical screens", "Proctored assessments", "Communication evaluation", "Verification reports"],
    },
    {
      slug: "recruitment-pricing",
      title: "Sourcing Plans & Pricing",
      highlight: "success-based sourcing",
      blurb:
        "Per-role, per-shortlist or embedded recruiter plans — success-based fees agreed upfront, with volume rates for always-on pipelines and no charge for unqualified profiles.",
      icon: "Wallet",
      focus: ["Per-role pricing", "Embedded recruiter plans", "Volume pipeline rates", "Success-based fees"],
    },
    {
      slug: "hiring-workflow",
      title: "The Hiring Workflow",
      highlight: "from brief to signed offer",
      blurb:
        "A disciplined six-touch workflow — intake, shortlist, interviews, references, offer, join — with weekly pipeline reporting and no ghosting on either side.",
      icon: "CalendarDays",
      focus: ["Role intake brief", "Weekly pipeline reports", "Reference checks", "Offer & join support"],
    },
    {
      slug: "roles-industries",
      title: "Roles & Industries",
      highlight: "the tracks we fill every week",
      blurb:
        "Engineering, data, cloud, AI, security, product and business ops — across fintech, healthcare, retail, logistics and SaaS — with specialized benches per track.",
      icon: "Layers",
      focus: ["Engineering & data tracks", "AI & security roles", "Product & business ops", "Industry benches"],
    },
    {
      slug: "sourcing-success-stories",
      title: "Sourcing Success Stories",
      highlight: "hard-to-fill roles, closed",
      blurb:
        "The 9-month-void staff engineer closed in 3 weeks, and 120 nurses sourced for a hospital network — what the sourcing engine does when the market says no.",
      icon: "Star",
      focus: ["Hard-to-fill engineering", "Healthcare volume hiring", "Sales team build-outs", "Time-to-fill records"],
    },
  ],

  // ─────────────── Flexible Talent Deployment ───────────────
  "talent-deployment": [
    {
      slug: "contract-staffing",
      title: "Contract Staffing",
      highlight: "elastic capacity on demand",
      blurb:
        "Scale teams up for the peak and down for the trough — pre-vetted contractors join in days, not months, with extensions and conversions handled in one email.",
      icon: "Users",
      focus: ["Days-not-months starts", "Pre-vetted contractors", "Extensions & conversions", "Flexible ramp down"],
    },
    {
      slug: "project-teams",
      title: "Project-Based Teams",
      highlight: "a full squad, scoped and managed",
      blurb:
        "Engineer, QA, designer and lead arrive as one delivery squad — scoped to your outcome, managed to your milestones, wound down without legacy overhead.",
      icon: "Layers",
      focus: ["Full-squad delivery", "Outcome-based scoping", "Milestone management", "Clean wind-down"],
    },
    {
      slug: "dedicated-teams",
      title: "Dedicated Offshore Teams",
      highlight: "your function, our campus",
      blurb:
        "A standing team in our delivery campus — your processes, your tooling, your culture, with office infrastructure, HR and retention handled by us.",
      icon: "Globe",
      focus: ["Standing dedicated teams", "Your process & tooling", "Campus infrastructure", "Retention management"],
    },
    {
      slug: "managed-capacity",
      title: "Managed Capacity",
      highlight: "outcomes, not headcount",
      blurb:
        "Buy throughput instead of bodies — we own the staffing mix, the delivery management and the quality bar, and report against agreed outcome metrics.",
      icon: "Gauge",
      focus: ["Outcome-based metrics", "Staffing mix ownership", "Delivery management", "Quality bar SLAs"],
    },
    {
      slug: "deployment-pricing",
      title: "Rate Cards & Pricing",
      highlight: "transparent, blended rates",
      blurb:
        "Published rate cards by role and seniority, blended team rates, and conversion terms agreed upfront — no margin games, no surprise invoices.",
      icon: "Wallet",
      focus: ["Published rate cards", "Blended team rates", "Conversion terms", "Invoice transparency"],
    },
    {
      slug: "onboarding-compliance",
      title: "Onboarding & Compliance",
      highlight: "day-one ready, audit-proof",
      blurb:
        "Contracts, NDAs, background checks, payroll registration and equipment — completed before day one, with compliance records your auditors can walk straight through.",
      icon: "ShieldCheck",
      focus: ["Contracts & NDAs", "Background verification", "Payroll registration", "Audit-ready records"],
    },
    {
      slug: "governance-reporting",
      title: "Governance & Reporting",
      highlight: "visibility without chasing",
      blurb:
        "Utilization, delivery progress, spend and risk in one monthly governance pack — plus a named engagement manager who owns every escalation end to end.",
      icon: "BarChart3",
      focus: ["Utilization dashboards", "Monthly governance packs", "Spend & risk tracking", "Named engagement manager"],
    },
    {
      slug: "deployment-success-stories",
      title: "Deployment Success Stories",
      highlight: "capacity that arrived on time",
      blurb:
        "A 14-person squad stood up in three weeks for a product launch, and a 40-contractor bench that flexed through two peak seasons — deployments measured in outcomes.",
      icon: "Star",
      focus: ["Three-week squad ramp", "Seasonal bench flexing", "Product launch support", "Outcome benchmarks"],
    },
  ],

  // ─────────────── End-to-End Workforce Solutions ───────────────
  "workforce-solutions": [
    {
      slug: "workforce-planning",
      title: "Workforce Planning",
      highlight: "right-size ahead of demand",
      blurb:
        "Demand forecasting, scenario modelling and skills mapping turn headcount planning from guesswork into a quarterly operating rhythm with named owners.",
      icon: "Target",
      focus: ["Demand forecasting", "Scenario modelling", "Skills mapping", "Quarterly planning rhythm"],
    },
    {
      slug: "hiring-onboarding",
      title: "Hiring & Onboarding",
      highlight: "from requisition to day one",
      blurb:
        "One pipeline from requisition to productive first week — sourcing, assessment, offers, equipment, orientation and a 30-day buddy plan, all under one SLA.",
      icon: "UserCheck",
      focus: ["Requisition to offer", "Assessment pipeline", "Orientation & equipment", "30-day buddy plan"],
    },
    {
      slug: "payroll-compliance",
      title: "Payroll & Compliance",
      highlight: "we carry the admin weight",
      blurb:
        "Multi-state payroll, statutory benefits, labor-law compliance and audit filings run by our team — your people get paid right, and your risk stays on our desk.",
      icon: "Scale",
      focus: ["Multi-state payroll", "Statutory benefits", "Labor-law compliance", "Audit filings"],
    },
    {
      slug: "performance-retention",
      title: "Performance & Retention",
      highlight: "keep the talent you paid for",
      blurb:
        "Structured reviews, engagement pulses, flight-risk alerts and internal mobility — a retention system that pays for itself in avoided backfill costs.",
      icon: "TrendingUp",
      focus: ["Structured reviews", "Engagement pulses", "Flight-risk alerts", "Internal mobility"],
    },
    {
      slug: "upskilling-mobility",
      title: "Upskilling & Mobility",
      highlight: "internal moves beat external hires",
      blurb:
        "Skill-gap tracking, targeted training paths and an internal talent marketplace — fill tomorrow's roles with the people who already know your business.",
      icon: "RefreshCw",
      focus: ["Skill-gap tracking", "Targeted training paths", "Internal talent marketplace", "Career pathing"],
    },
    {
      slug: "offboarding-transitions",
      title: "Offboarding & Transitions",
      highlight: "exit well, protect knowledge",
      blurb:
        "Knowledge handover protocols, clean exits, redeployment options and alumni tracking — transitions that protect your IP, your culture and your employer brand.",
      icon: "Handshake",
      focus: ["Knowledge handover", "Redeployment options", "Clean exit process", "Alumni tracking"],
    },
    {
      slug: "workforce-pricing",
      title: "Programs & Pricing",
      highlight: "one partner, one contract",
      blurb:
        "Bundle the full lifecycle or pick managed modules — per-employee-per-month pricing with volume bands and a single contract replacing five vendors.",
      icon: "Wallet",
      focus: ["Full-lifecycle bundles", "Managed modules", "PEPM pricing bands", "Single-contract model"],
    },
    {
      slug: "workforce-case-studies",
      title: "Workforce Case Studies",
      highlight: "full lifecycle, measurable",
      blurb:
        "A fintech running 800 people end-to-end, and a retailer that cut attrition by a third — workforce programs with the before-and-after numbers attached.",
      icon: "Star",
      focus: ["800-person fintech program", "Retail attrition cut", "Compliance turnaround", "Cost-per-hire deltas"],
    },
  ],

  // ─────────────── Talent Assessment ───────────────
  "talent-assessment": [
    {
      slug: "ai-proctored-testing",
      title: "AI-Proctored Testing",
      highlight: "cheat-proof by design",
      blurb:
        "Identity verification, tab-switch detection, environment scans and behavior analytics on every assessment — scores you can defend in a hiring committee.",
      icon: "Shield",
      focus: ["Identity verification", "Environment scanning", "Behavior analytics", "Defensible scores"],
    },
    {
      slug: "skill-libraries",
      title: "Skill Libraries",
      highlight: "400+ assessed competencies",
      blurb:
        "Ready-made, psychometrically tuned item banks across engineering, data, cloud, AI, business and communication — or compose your own from the same building blocks.",
      icon: "Database",
      focus: ["400+ competencies", "Tuned item banks", "Custom composition", "Constant recalibration"],
    },
    {
      slug: "psychometric-assessments",
      title: "Psychometric & Aptitude",
      highlight: "predict fit, not just skill",
      blurb:
        "Cognitive aptitude, working style and problem-solving batteries that predict on-the-job trajectory — the signals résumés never show you.",
      icon: "Brain",
      focus: ["Cognitive aptitude", "Working-style profiling", "Trajectory prediction", "Fit scoring"],
    },
    {
      slug: "coding-assessments",
      title: "Coding & Technical Assessments",
      highlight: "real tasks, real signals",
      blurb:
        "Production-style coding tasks, debugging scenarios and system-design exercises in a real IDE — auto-scored on correctness, quality and speed.",
      icon: "Code",
      focus: ["Realistic coding tasks", "Debugging scenarios", "System design exercises", "Auto-scored quality"],
    },
    {
      slug: "assessment-analytics",
      title: "Assessment Analytics",
      highlight: "every score, one dashboard",
      blurb:
        "Cohort benchmarks, question-level diagnostics, adverse-impact monitoring and exportable reports — assessment data that improves with every hiring round.",
      icon: "BarChart3",
      focus: ["Cohort benchmarks", "Question diagnostics", "Adverse-impact monitoring", "Exportable reports"],
    },
    {
      slug: "ats-integrations",
      title: "ATS & Workflow Integrations",
      highlight: "assessment inside your pipeline",
      blurb:
        "Native hooks into your ATS and scheduling tools — assessments fire automatically at the right stage and scores land back on the candidate card, same day.",
      icon: "Puzzle",
      focus: ["ATS integrations", "Automated stage triggers", "Same-day score sync", "Candidate status webhooks"],
    },
    {
      slug: "assessment-pricing",
      title: "Plans & Pricing",
      highlight: "pay per assessment or per seat",
      blurb:
        "Volume packs for hiring sprints, seat licenses for always-on screening, and enterprise unlimited — transparent tiers with usage analytics included in all.",
      icon: "Wallet",
      focus: ["Volume assessment packs", "Seat licenses", "Enterprise unlimited", "Usage analytics"],
    },
    {
      slug: "assessment-success-stories",
      title: "Assessment Success Stories",
      highlight: "better hires, fewer misfires",
      blurb:
        "A SaaS firm that cut first-year attrition in half, and a BPO that screens 40,000 applicants a month — what verified scoring does to hiring quality.",
      icon: "Star",
      focus: ["Attrition halved", "40k monthly screens", "Quality-of-hire lift", "Screening time cut"],
    },
  ],

  // ─────────────── Staffing Solutions ───────────────
  "staffing-solutions": [
    {
      slug: "permanent-hiring",
      title: "Permanent Hiring",
      highlight: "long-term fits, not stopgaps",
      blurb:
        "Assessed shortlists for career roles — screened on skill, trajectory and culture fit, with a 90-day replacement guarantee on every placement.",
      icon: "UserCheck",
      focus: ["Assessed shortlists", "Trajectory screening", "Culture-fit evaluation", "90-day replacement"],
    },
    {
      slug: "contract-staffing",
      title: "Contract Staffing",
      highlight: "flex muscle for peaks",
      blurb:
        "Qualified contractors for sprints, cover and seasonal peaks — start in days, extend or convert with one email, and never carry idle bench cost.",
      icon: "Zap",
      focus: ["Fast contractor starts", "Sprint & seasonal cover", "One-email conversions", "No idle bench"],
    },
    {
      slug: "temp-to-perm",
      title: "Temp-to-Perm Programs",
      highlight: "try before you commit",
      blurb:
        "Evaluate real performance on your floor before the offer — structured trial periods with clear conversion gates and no conversion fees on the trial itself.",
      icon: "RefreshCw",
      focus: ["Structured trial periods", "Performance evaluation", "Clear conversion gates", "No trial fees"],
    },
    {
      slug: "payroll-compliance",
      title: "Payroll & Compliance",
      highlight: "we employ, you direct",
      blurb:
        "We become the legal employer for your contract staff — payroll, benefits, statutory filings and compliance handled, while you keep full work direction.",
      icon: "Scale",
      focus: ["Employer-of-record", "Payroll & benefits", "Statutory filings", "Full work direction"],
    },
    {
      slug: "bulk-campus-hiring",
      title: "Bulk & Campus Hiring",
      highlight: "hundreds, without chaos",
      blurb:
        "Drive-in drives, campus programs and volume intakes with automated assessment waves, batch scheduling and per-batch quality reporting.",
      icon: "GraduationCap",
      focus: ["Campus programs", "Automated assessment waves", "Batch scheduling", "Per-batch reporting"],
    },
    {
      slug: "staffing-pricing",
      title: "Pricing & Plans",
      highlight: "simple, success-based fees",
      blurb:
        "Flat percentage or fixed-fee per placement, monthly contract margins disclosed upfront, and volume agreements for always-on hiring — no hidden charges, ever.",
      icon: "Wallet",
      focus: ["Flat placement fees", "Disclosed margins", "Volume agreements", "No hidden charges"],
    },
    {
      slug: "staffing-sla-guarantees",
      title: "SLAs & Guarantees",
      highlight: "commitments in writing",
      blurb:
        "48-hour shortlists, 90-day free replacements and response-time SLAs — every promise we make on staffing is written into the agreement, not the pitch deck.",
      icon: "ShieldCheck",
      focus: ["48-hour shortlists", "90-day replacements", "Response-time SLAs", "Written commitments"],
    },
    {
      slug: "staffing-success-stories",
      title: "Staffing Success Stories",
      highlight: "teams filled on time",
      blurb:
        "A 60-seat support center staffed in five weeks, and a fintech that replaced agencies with one staffing partner — the timelines and savings, in numbers.",
      icon: "Star",
      focus: ["60-seat support ramp", "Agency consolidation", "Time-to-fill records", "Cost savings data"],
    },
  ],

  // ─────────────── Placements ───────────────
  placements: [
    {
      slug: "for-job-seekers",
      title: "For Job Seekers",
      highlight: "get placed, stay placed",
      blurb:
        "One application, AI-matched to live openings across 500+ employers — with interview coaching, offer guidance and support through your first 90 days.",
      icon: "Rocket",
      focus: ["One application, many matches", "AI role matching", "Interview coaching", "First-90-days support"],
    },
    {
      slug: "for-employers",
      title: "For Employers",
      highlight: "hire from an assessed pool",
      blurb:
        "Shortlists from a 2M+ assessed talent pool, delivered within 48 hours — candidates scored on verified skill, aptitude and job readiness before you ever call.",
      icon: "Building2",
      focus: ["48-hour shortlists", "2M+ assessed pool", "Job-readiness scores", "Interview-ready only"],
    },
    {
      slug: "placement-process",
      title: "The Placement Process",
      highlight: "four steps to a signed offer",
      blurb:
        "Profile build, AI matching, employer interviews, offer and join — a transparent four-step pipeline with status updates at every gate, for both sides.",
      icon: "Compass",
      focus: ["Profile building", "AI matching engine", "Employer interviews", "Offer & onboarding"],
    },
    {
      slug: "career-coaching",
      title: "Career Coaching & Resume",
      highlight: "interview-ready, inside out",
      blurb:
        "Resume rebuilds, mock interviews with real hiring managers, salary-negotiation coaching and a personal brand review — the prep that turns matches into offers.",
      icon: "MessageSquare",
      focus: ["Resume rebuilding", "Mock interviews", "Salary negotiation", "Personal brand review"],
    },
    {
      slug: "employer-network",
      title: "Employer Network",
      highlight: "500+ companies hiring now",
      blurb:
        "Fintechs, hospitals, SaaS scale-ups, retailers and global capability centers — live openings across the network, refreshed daily with named hiring teams.",
      icon: "Network",
      focus: ["500+ active employers", "Daily refreshed openings", "Named hiring teams", "GCC & startup mix"],
    },
    {
      slug: "placement-guarantees",
      title: "Placement Guarantees",
      highlight: "commitments on both sides",
      blurb:
        "Employers get a 90-day free replacement window; candidates get honest role previews and no-fee placement, always. Guarantees in writing, on both sides of the match.",
      icon: "Handshake",
      focus: ["90-day replacement", "No candidate fees", "Honest role previews", "Written guarantees"],
    },
    {
      slug: "placement-success-stories",
      title: "Placement Success Stories",
      highlight: "careers that changed course",
      blurb:
        "The support agent who became a data analyst in 11 months, and the employer who filled 30 roles in one quarter — stories with names, numbers and timelines.",
      icon: "Star",
      focus: ["Career-switch stories", "Volume hiring wins", "Salary growth data", "Retention after placement"],
    },
    {
      slug: "support-resources",
      title: "Support & Resources",
      highlight: "help at every step",
      blurb:
        "A named placement advisor, 24-hour query response, salary benchmarks, interview libraries and relocation guides — support that continues past the offer letter.",
      icon: "Lightbulb",
      focus: ["Named placement advisor", "24-hour response", "Salary benchmarks", "Relocation guides"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────

export function getTalentSubSeeds(optionSlug: string): TalentSubSeed[] {
  return TALENT_SUB_SEEDS[optionSlug] ?? [];
}

export function getTalentSubSeed(
  optionSlug: string,
  subSlug: string
): TalentSubSeed | undefined {
  return getTalentSubSeeds(optionSlug).find((s) => s.slug === subSlug);
}

/** Total sub-page count (72) — used by the route's static params. */
export const TALENT_SUB_PAGE_COUNT = Object.values(TALENT_SUB_SEEDS).reduce(
  (n, arr) => n + arr.length,
  0
);

// ─────────────────────────────────────────────────────────────
// Deterministic expansion engine
// ─────────────────────────────────────────────────────────────

const hashStr = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const pick = <T,>(arr: readonly T[], key: string): T =>
  arr[hashStr(key) % arr.length];

const lower = (s: string) => (s.charAt(0).toLowerCase() + s.slice(1)) as string;

const KPI_ICONS = ["Target", "Gauge", "Zap", "BarChart3", "ShieldCheck", "Clock"] as const;
/** Coverage-flavored values — grammatically safe with any focus label
    ("100% Role profile workshops", "End-to-end Stack-specific modules"). */
const KPI_VALUES = ["100%", "Included", "End-to-end", "Full"] as const;
const VP_ICONS = ["Target", "BrainCircuit", "ShieldCheck", "Gauge", "Zap", "Globe", "Layers", "Lightbulb"] as const;
const MODULE_ICONS = ["Code", "Database", "Cloud", "BrainCircuit", "ShieldCheck", "Users", "BarChart3", "MessageSquare", "Settings", "Puzzle"] as const;
const VISUALS = ["dashboard", "radial", "network", "badge"] as const;
const CTA_LABELS = ["Talk to a talent expert", "Book a free consultation", "Get a tailored plan"] as const;
const CTA_KICKERS = ["Start this quarter", "Get moving this month", "Plan your next step"] as const;
const READ_TIMES = ["8 min read", "10 min read", "12 min read", "6 min read"] as const;

const VP_TEMPLATES = [
  (f: string, o: PageSpec) =>
    `${f} is engineered into every ${lower(o.nav)} engagement — owned, measured and reported, not bolted on afterwards.`,
  (f: string, o: PageSpec) =>
    `You get ${lower(f)} as a standing part of the workflow, with named owners and weekly checkpoints from day one.`,
  (f: string, _o: PageSpec) =>
    `Every plan starts from ${lower(f)} — so outcomes stay predictable and scope never drifts silently.`,
  (f: string, _o: PageSpec) =>
    `${f}, tracked week by week — you always know exactly where things stand without chasing status.`,
] as const;

const SPOT_TEMPLATES = [
  (f: string, o: PageSpec) =>
    `${f} sits at the core of this workstream — the difference between a ${lower(o.nav)} engagement that drifts and one that lands.`,
  (f: string, _o: PageSpec) =>
    `We instrument ${lower(f)} from kickoff, so every decision on this page is backed by live data instead of gut feel.`,
  (f: string, o: PageSpec) =>
    `Your team sees ${lower(f)} exactly as our delivery team does — one shared view, zero reporting lag, full accountability.`,
] as const;

const MODULE_TEMPLATES = [
  (f: string, o: PageSpec) => `The ${lower(f)} layer of the program — delivered by specialists who run it weekly across client accounts.`,
  (f: string, _o: PageSpec) => `A dedicated workstream covering ${lower(f)} end to end, with its own SLAs and completion gates.`,
  (f: string, o: PageSpec) => `Configured to your context during onboarding, then run as a repeatable component of every ${lower(o.nav)} cycle.`,
] as const;

const STEP_TEMPLATES = [
  (f: string, o: PageSpec) =>
    `We map your requirement against ${lower(f)} — must-haves, success measures and stakeholders aligned in one working session.`,
  (f: string, _o: PageSpec) =>
    `The delivery plan is built around ${lower(f)}, with owners, timelines and quality gates agreed before anything goes live.`,
  (f: string, _o: PageSpec) =>
    `Execution runs in weekly cycles focused on ${lower(f)} — visible progress, working artifacts, no big-bang surprises.`,
  (f: string, _o: PageSpec) =>
    `We verify outcomes against ${lower(f)} with your own stakeholders scoring the results — gaps get fixed before handover.`,
  (f: string, o: PageSpec) =>
    `You take over with full documentation, telemetry and a named contact — the ${lower(o.nav)} team stays on call for the agreed support window.`,
] as const;

const STEP_TITLES = [
  "Discovery & alignment",
  "Plan & setup",
  "Delivery sprint",
  "Verification & gates",
  "Handover & support",
] as const;
const STEP_DURATIONS = [
  ["Week 1", "Days 1–5", "Week 1"],
  ["Weeks 1–2", "Week 2", "Days 5–10"],
  ["Weeks 2–6", "Weeks 3–7", "Weeks 2–8"],
  ["Week 7", "Final week", "Week 8"],
  ["Week 8+", "Ongoing", "Week 9+"],
] as const;

/**
 * Expand one sub-page seed + its parent option spec into a complete
 * 24-section PageSpec. Deterministic: the same (option, seed) pair
 * always renders byte-identical content.
 */
export function buildTalentSubSpec(option: PageSpec, seed: TalentSubSeed): PageSpec {
  const key = `${option.slug}/${seed.slug}`;
  const f = seed.focus;

  // KPI band: brand anchors first/last, seed-specific middle pair
  const kv = (k: string) => KPI_VALUES[hashStr(k) % KPI_VALUES.length] as string;
  const kpiVal1 = kv(key + "v1");
  const kpiVal2 =
    kv(key + "v2") === kpiVal1
      ? KPI_VALUES[(KPI_VALUES.indexOf(kpiVal1 as (typeof KPI_VALUES)[number]) + 1) % KPI_VALUES.length]
      : kv(key + "v2");
  const kpis = [
    option.kpis[0],
    {
      icon: pick(KPI_ICONS, key + "k1"),
      value: kpiVal1,
      label: f[0],
      detail: `${f[0]} — measured on every ${lower(option.nav)} engagement, reported weekly.`,
    },
    {
      icon: pick(KPI_ICONS, key + "k2"),
      value: kpiVal2,
      label: f[1],
      detail: `${f[1]} with named owners and SLAs — visible to your team in real time.`,
    },
    option.kpis[3],
  ];

  // Value props: 4 seed pillars + 2 inherited brand props
  const vpIconFor = (i: number) => pick(VP_ICONS, key + "vp" + i) as IconKey;
  const valueProps = [
    { icon: vpIconFor(0), title: f[0], description: pick(VP_TEMPLATES, key + "t0")(f[0], option) },
    { icon: vpIconFor(1), title: f[1], description: pick(VP_TEMPLATES, key + "t1")(f[1], option) },
    { icon: vpIconFor(2), title: f[2], description: pick(VP_TEMPLATES, key + "t2")(f[2], option) },
    { icon: vpIconFor(3), title: f[3], description: pick(VP_TEMPLATES, key + "t3")(f[3], option) },
    option.valueProps[1],
    option.valueProps[4],
  ];

  // Process: 5 templated steps weaving the focus pillars
  const durSet = pick(STEP_DURATIONS, key + "dur");
  const process = STEP_TITLES.map((title, i) => ({
    title,
    duration: durSet[i],
    description: STEP_TEMPLATES[i](f[Math.min(i, 3)], option),
  }));

  // Spotlight rows: first is seed-branded, others inherit brand rows re-angled
  const spotlight = [
    {
      icon: seed.icon,
      title: f[0],
      description: pick(SPOT_TEMPLATES, key + "s0")(f[0], option),
      bullets: [f[1], f[2], f[3]],
      visual: pick(VISUALS, key + "vis0"),
    },
    {
      ...option.spotlight[1],
      title: f[2],
      description: pick(SPOT_TEMPLATES, key + "s1")(f[2], option),
    },
    {
      ...option.spotlight[2],
      title: f[3],
      description: pick(SPOT_TEMPLATES, key + "s2")(f[3], option),
    },
  ];

  // Deliverables: 4 seed pillars + 4 inherited (deterministic offset, deduped)
  const inheritedDeliverables = [...option.deliverables];
  const deliverables = [
    ...f.map((x) => x),
    ...inheritedDeliverables
      .filter((d) => !f.some((x) => d.toLowerCase().includes(x.split(" ")[0].toLowerCase())))
      .slice(0, 4),
  ].slice(0, 8);

  // Modules: seed pillars as workstreams + 2 inherited brand modules
  const modules = [
    ...f.map((x, i) => ({
      icon: pick(MODULE_ICONS, key + "m" + i) as IconKey,
      tag: option.nav,
      title: x,
      description: pick(MODULE_TEMPLATES, key + "mt" + i)(x, option),
    })),
    option.modules[0],
    option.modules[5],
  ];

  const resources = [
    {
      type: "Guide",
      title: `${seed.title}: the complete guide`,
      description: `Everything inside ${lower(seed.title)} — scope, workflow, SLAs and pricing in one document.`,
      readTime: pick(READ_TIMES, key + "r1"),
    },
    {
      type: "Checklist",
      title: `${f[0]} checklist`,
      description: `The exact gates we run before any ${lower(option.nav)} engagement goes live.`,
      readTime: pick(READ_TIMES, key + "r2"),
    },
    {
      type: "Playbook",
      title: `${seed.title} ROI playbook`,
      description: `How teams measure the return on ${lower(seed.title)} in the first 90 days.`,
      readTime: pick(READ_TIMES, key + "r3"),
    },
  ];

  const faqs = [
    {
      q: `What exactly is included in ${lower(seed.title)}?`,
      a: `${seed.blurb} Every engagement bundles ${lower(f[0])}, ${lower(f[1])} and ${lower(f[2])} with a named success manager and weekly reporting — nothing outsourced, nothing vague.`,
    },
    {
      q: `How does ${lower(seed.title)} fit into the wider ${lower(option.nav)} engagement?`,
      a: `${seed.title} is one of eight deep-dive workstreams inside ${lower(option.nav)}. Run it standalone or as part of the end-to-end program — the SLAs, pricing transparency and guarantees carry over either way.`,
    },
    ...option.faqs.slice(0, 4),
  ];

  return {
    slug: `${option.slug}-${seed.slug}`,
    group: option.group,
    accent: option.accent,
    nav: seed.title,

    eyebrow: `Talent Solutions · ${option.nav}`,
    title: seed.title,
    highlight: seed.highlight,
    subtitle: seed.blurb,
    primaryCta: { label: pick(CTA_LABELS, key + "c1"), href: "/contact" },
    secondaryCta: { label: `Back to ${option.nav}`, href: `/talent-solutions/${option.slug}` },
    heroStats: option.heroStats,

    trustBadges: option.trustBadges,
    kpis,
    audiences: option.audiences,
    valueProps,
    processTitle: `How ${lower(seed.title)} works, step by step`,
    process,
    spotlight,
    deliverablesTitle: `What's included in ${lower(seed.title)}`,
    deliverables,
    modulesTitle: `${seed.title} building blocks`,
    modules,
    tech: {
      ...option.tech,
      title: `The platform behind ${seed.title}`,
      description: `One platform runs intake, delivery telemetry and reporting for ${lower(seed.title)} — you see what we see, in real time.`,
    },
    coverage: {
      ...option.coverage,
      title: `${seed.title} — coverage at a glance`,
      chips: [...f, ...option.coverage.chips].slice(0, 12),
    },
    modelsTitle: option.modelsTitle,
    models: option.models,
    outcomes: option.outcomes,
    testimonials: option.testimonials,
    caseStudy: option.caseStudy,
    comparisonTitle: `${seed.title} vs. the DIY route`,
    comparison: option.comparison,
    industries: option.industries,
    regions: option.regions,
    guarantees: option.guarantees,
    experts: option.experts,
    resources,
    faqs,
    ctaBand: {
      kicker: pick(CTA_KICKERS, key + "ck"),
      title: `Put ${lower(seed.title)} to work`,
      primary: {
        kicker: "For Employers",
        title: `Scope your ${lower(seed.title)} plan`,
        text: `Bring your requirement to a 30-minute call — leave with scope, timeline and pricing for ${lower(seed.title)}.`,
        cta: { label: "Book the call", href: "/contact" },
      },
      secondary: {
        kicker: "For Job Seekers",
        title: "Join the talent network",
        text: "Apply once, clear the AI screen and get matched with employers hiring right now.",
        cta: { label: "Apply now", href: "/talent-solutions#placements" },
      },
    },
    contact: option.contact,
  };
}
