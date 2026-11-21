// ============================================================
// TALENT GROUP PAGE CONTENT — 6 group pages
//
// Drives the TalentGroupPage component rendered at
// /talent-solutions/[slug] for the following slugs:
//   • get-trained
//   • get-placed
//   • get-certified
//   • build-talent
//   • hire-talent
//   • scale-workforce
//
// Each entry produces a 12-section page (hero with Live Impact
// Signal panel + 11 supporting sections). Icon names map into
// the shared Icon component (src/components/shared/icon.tsx).
// ============================================================

export interface GroupPageContent {
  slug: string;
  name: string;
  heroTitle: string;
  /** gradient-highlighted part of heroTitle */
  heroHighlight: string;
  heroSubtitle: string;
  heroEyebrow: string;
  heroStats: { value: string; label: string }[];
  heroTags: string[];
  heroGaugeValue: number;
  heroGaugeLabel: string;
  heroKpis: { label: string; before: string; after: string; unit: string }[];
  heroBars: { label: string; before: string; after: string; unit: string; max: number }[];
  heroQuote: string;
  heroQuoteAttribution: string;
  overview: string[];
  capabilities: { icon: string; title: string; description: string }[];
  process: { title: string; duration: string; description: string }[];
  benefits: { metric: string; label: string; description: string }[];
  audiences: { kicker: string; title: string; description: string; bullets: string[]; cta: string }[];
  comparison: { feature: string; withStioos: string; without: string }[];
  industries: { name: string; hires: string }[];
  guarantees: { icon: string; title: string; description: string }[];
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaHighlight: string;
  ctaSubtitle: string;
}

export const TALENT_GROUP_PAGE_CONTENT: GroupPageContent[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. GET TRAINED — Candidate learns skills
  // ─────────────────────────────────────────────────────────────
  {
    slug: "get-trained",
    name: "Get Trained",
    heroTitle: "Learn on your stack,",
    heroHighlight: "get hired while you train",
    heroEyebrow: "For Job Seekers · Talent Solutions",
    heroSubtitle:
      "Mentor-led training sprints on the exact tools, frameworks and workflows hiring employers use — graduate with a real capstone, a verified portfolio and a direct line to 500+ hiring teams.",
    heroStats: [
      { value: "200+", label: "Skill tracks" },
      { value: "8-12 wks", label: "Avg. sprint" },
      { value: "96%", label: "Grad-to-hire" },
      { value: "$0", label: "Tuition" },
    ],
    heroTags: [
      "Custom cohort curriculum",
      "AI candidate screening",
      "Training sprint delivery",
      "Mentor-led capstones",
    ],
    heroGaugeValue: 88,
    heroGaugeLabel: "job-ready",
    heroKpis: [
      { label: "Time to ramp", before: "6 mo", after: "10 wks", unit: "wks" },
      { label: "Skill coverage", before: "40%", after: "92%", unit: "%" },
      { label: "Interview pass", before: "35%", after: "84%", unit: "%" },
    ],
    heroBars: [
      { label: "Project readiness", before: "30", after: "92", unit: "%", max: 100 },
      { label: "Stack fluency", before: "25", after: "88", unit: "%", max: 100 },
    ],
    heroQuote:
      "I went from self-taught tutorials to a paid backend role in eleven weeks. The capstone project was literally the same stack my current team ships every day.",
    heroQuoteAttribution: "— Iman Qureshi, Junior Backend Engineer",
    overview: [
      "Get Trained is the candidate-side entry into the STIOOS talent engine. Instead of paying for a generic bootcamp, you join a role-aligned cohort built around the stack, conventions and workflows a hiring employer has already signed off on. Curriculum, mentorship and capstone work are co-designed with that employer — so what you build in week four is what you ship in week twelve.",
      "Every sprint ships with weekly checkpoints, code reviews by senior engineers, AI-scored aptitude tracking, and a job-ready capstone that becomes the centrepiece of your verified portfolio. Graduates flow directly into placement with the employer the cohort was built for — or into a curated shortlist of 500+ hiring partners. No upfront tuition, no placement commission from your salary.",
    ],
    capabilities: [
      {
        icon: "BookOpen",
        title: "Role-aligned curriculum",
        description:
          "Curriculum co-designed with the hiring employer — their repos, their style guide, their conventions, their real customer workflows baked into every module.",
      },
      {
        icon: "Users",
        title: "1:1 senior mentorship",
        description:
          "A senior engineer mentor assigned to your cohort. Weekly code review, pair-programming sessions, and async feedback on every PR you ship during the sprint.",
      },
      {
        icon: "Rocket",
        title: "Capstone project portfolio",
        description:
          "Build a real client-shaped project from spec to production deploy. Three portfolio pieces by graduation, reviewed by the hiring employer before your interview.",
      },
      {
        icon: "BrainCircuit",
        title: "AI-scored aptitude tracking",
        description:
          "Every checkpoint is graded by an AI rubric aligned to your role scorecard. You see exactly which competencies are interview-ready and which still need a sprint.",
      },
      {
        icon: "Code2",
        title: "Live stack & tooling",
        description:
          "Work in the actual IDE, CI/CD and ticketing stack the employer uses — not a sandbox. You graduate already fluent in their day-one workflow.",
      },
      {
        icon: "Sparkles",
        title: "Soft-skills & mock interviews",
        description:
          "Weekly standups, code reviews and sprint demos. Eight mock interviews calibrated to your target employer's question bank before you ever sit the real one.",
      },
    ],
    process: [
      {
        title: "Apply & AI screen",
        duration: "Day 1-3",
        description:
          "Submit an application, complete a 60-minute AI-proctored aptitude screen (numerical, logical, verbal). A 70/100 score advances you to the role-matching call.",
      },
      {
        title: "Role match & cohort fit",
        duration: "Day 4-7",
        description:
          "A 30-minute call with a STIOOS program manager. We map you to the open cohort whose stack, role and ramp timeline best fits your goals — or queue you for the next one.",
      },
      {
        title: "Sprint execution",
        duration: "Week 2-11",
        description:
          "Ten weeks of mentor-led sprints. Weekly checkpoints, code reviews, capstone work in the employer's real stack. AI tracking shows your readiness score climbing every Friday.",
      },
      {
        title: "Capstone review & placement",
        duration: "Week 12+",
        description:
          "Hiring employer reviews your capstone. Top performers move straight to a final-loop interview. Others flow into our curated placement pool across 500+ hiring partners.",
      },
    ],
    benefits: [
      {
        metric: "96%",
        label: "Grad-to-hire conversion",
        description:
          "Of cohort graduates placed as full-time hires within 60 days of capstone review — measured against the employer's role scorecard.",
      },
      {
        metric: "11 wks",
        label: "Avg. ramp to offer",
        description:
          "From application to signed offer letter. The traditional self-study path to a comparable role takes 9-12 months with no placement guarantee.",
      },
      {
        metric: "$0",
        label: "Upfront tuition",
        description:
          "Tuition is sponsored by the hiring employer or covered by the STIOOS talent fund. You never pay out of pocket for curriculum, mentorship or capstone review.",
      },
      {
        metric: "3",
        label: "Portfolio projects shipped",
        description:
          "Every graduate leaves with three production-grade capstone pieces in a verified portfolio — reviewable by any hiring employer with one click.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers & new graduates",
        description:
          "You have the aptitude but not the on-the-job stack experience hiring teams demand. Get Trained gives you a paid ramp into a real employer's workflow — with a job at the end.",
        bullets: [
          "No prior work experience required — aptitude screen is the gate",
          "Tuition sponsored, no upfront cost, no income-share agreement",
          "Direct placement line to the cohort's hiring employer",
          "Real stack, real repos, real mentorship — not a sandbox",
        ],
        cta: "Apply to a cohort",
      },
      {
        kicker: "For Employers",
        title: "Hiring teams with role-spec gaps",
        description:
          "You have open roles and a stack that is hard to source for. Sponsor a Get Trained cohort and a curated group of candidates builds job-ready competency on your exact stack — with the option to hire at graduation.",
        bullets: [
          "Co-design curriculum with your staff engineers",
          "Capstone becomes a real, paid pilot project on your roadmap",
          "First right-to-hire on every graduate of the cohort",
          "Replace stalled recruiter pipelines with a vetted internal funnel",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "Curriculum source", withStioos: "Employer's real stack", without: "Generic bootcamp syllabus" },
      { feature: "Mentorship", withStioos: "Senior engineer, weekly 1:1", without: "Forum + TA, async only" },
      { feature: "Capstone", withStioos: "Production deploy on employer repo", without: "Toy project in a sandbox" },
      { feature: "Tuition model", withStioos: "$0 upfront, employer-sponsored", without: "$8K-$20K out of pocket" },
      { feature: "Placement", withStioos: "Direct line to 500+ employers", without: "Self-apply on job boards" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ hires" },
      { name: "Fintech", hires: "260+ hires" },
      { name: "Healthcare", hires: "180+ hires" },
      { name: "Retail", hires: "210+ hires" },
      { name: "Manufacturing", hires: "140+ hires" },
      { name: "Education", hires: "110+ hires" },
    ],
    guarantees: [
      {
        icon: "ShieldCheck",
        title: "Job-ready capstone guarantee",
        description:
          "If your capstone does not meet the employer's review bar, you get an additional 4-week capstone polish sprint at no cost — until it does.",
      },
      {
        icon: "RefreshCw",
        title: "Cohort rerun option",
        description:
          "If a personal emergency interrupts your sprint, you can rejoin the next identical cohort within 90 days — no re-application, no re-screening fee.",
      },
      {
        icon: "Wallet",
        title: "No-salary-commission promise",
        description:
          "We never take a cut of your salary after placement. Tuition is sponsored upfront by the hiring employer or the STIOOS talent fund.",
      },
      {
        icon: "Headset",
        title: "Mentor SLA",
        description:
          "A response-time SLA on every mentor interaction — 24h async, 48h live. If the SLA is missed twice in a sprint, you get a senior mentor upgrade.",
      },
    ],
    faqs: [
      {
        q: "Do I need a computer science degree to apply?",
        a: "No. The baseline is Class 12 / higher-secondary or equivalent, plus a 70/100 score on the AI-proctored aptitude screen. Career switchers, self-taught learners and graduates from non-CS disciplines are routinely placed into engineering, data and product cohorts.",
      },
      {
        q: "What does '$0 tuition' actually mean?",
        a: "Your tuition is sponsored by the hiring employer whose stack the cohort is built around, or by the STIOOS talent fund for open cohorts. You never pay out of pocket, never sign an income-share agreement, and we never take a cut of your salary after placement. Mentorship, capstone review and tooling access are all covered.",
      },
      {
        q: "How long is the training sprint?",
        a: "Most role-aligned sprints run 8-12 weeks full-time, or 14-16 weeks part-time. The exact duration is set by the hiring employer's ramp expectations and the complexity of the stack. You will know the sprint length before you accept a cohort seat.",
      },
      {
        q: "Am I guaranteed a job at the end?",
        a: "96% of cohort graduates are placed as full-time hires within 60 days of capstone review. The cohort's hiring employer has first right-to-hire on every graduate; if they decline, you flow into our curated placement pool across 500+ hiring partners. The capstone polish guarantee ensures your portfolio meets the employer review bar before placement begins.",
      },
      {
        q: "What stack will I actually learn?",
        a: "The stack is set by the hiring employer sponsoring the cohort — not by STIOOS. A cohort might be Node + Postgres + AWS, another might be Python + React + GCP, another might be Salesforce + Apex. You see the full stack, repo conventions and target role scorecard before you accept a seat.",
      },
    ],
    ctaTitle: "Start training on a real stack",
    ctaHighlight: "this quarter",
    ctaSubtitle:
      "Apply in 10 minutes. You get an aptitude screen within 48 hours, a cohort match call within a week, and a sprint start date before the month ends.",
  },

  // ─────────────────────────────────────────────────────────────
  // 2. GET PLACED — Candidate gets hired
  // ─────────────────────────────────────────────────────────────
  {
    slug: "get-placed",
    name: "Get Placed",
    heroTitle: "Browse live roles,",
    heroHighlight: "get hired in weeks",
    heroEyebrow: "For Job Seekers · Talent Solutions",
    heroSubtitle:
      "AI-matched live openings across 500+ hiring employers — interview prep calibrated to each company, offer negotiation guidance and a guided 90-day onboarding plan from signed offer to day one.",
    heroStats: [
      { value: "500+", label: "Hiring partners" },
      { value: "48h", label: "First shortlist" },
      { value: "84%", label: "Interview pass" },
      { value: "$0", label: "Recruiter fee" },
    ],
    heroTags: [
      "Browse open roles",
      "AI-matched openings",
      "Interview preparation",
      "Offer & onboarding",
    ],
    heroGaugeValue: 86,
    heroGaugeLabel: "matched",
    heroKpis: [
      { label: "Time to offer", before: "16 wks", after: "5 wks", unit: "wks" },
      { label: "Offer acceptance", before: "48%", after: "92%", unit: "%" },
      { label: "Salary uplift", before: "0%", after: "+22%", unit: "%" },
    ],
    heroBars: [
      { label: "Match precision", before: "20", after: "94", unit: "%", max: 100 },
      { label: "Interview readiness", before: "30", after: "88", unit: "%", max: 100 },
    ],
    heroQuote:
      "I had three offers in six weeks. The interview prep was calibrated to each company's actual question bank — I walked in already knowing what they would ask.",
    heroQuoteAttribution: "— Daniel Park, Data Analyst at a Series-C fintech",
    overview: [
      "Get Placed is the candidate-side placement engine of STIOOS. Every role you see is a live opening at a vetted hiring employer — not a job-board scrape. Our AI matcher ranks openings against your verified skill profile, your capstone portfolio and your salary band, then surfaces the top five matches within 48 hours of your profile going live.",
      "From there you get company-specific interview prep (real question banks from prior hires), live mock interviews with senior engineers, offer negotiation guidance, and a 90-day onboarding plan that walks you from signed offer to day-one productive ramp. We are paid by the hiring employer — never by you, never a cut of your salary.",
    ],
    capabilities: [
      {
        icon: "Briefcase",
        title: "Live role marketplace",
        description:
          "Every opening is a vetted, currently-open role at a hiring employer with a published salary band and a 48-hour first-shortlist SLA. No job-board scrapes, no stale listings.",
      },
      {
        icon: "Target",
        title: "AI-matched shortlists",
        description:
          "Our matcher ranks openings against your verified skills, capstone portfolio, target salary and location preferences — top five matches land in your inbox within 48 hours.",
      },
      {
        icon: "Users",
        title: "Company-specific interview prep",
        description:
          "Real question banks pulled from prior hires at each company, calibrated to the role, level and team. Walk into the interview already knowing what they will ask.",
      },
      {
        icon: "BrainCircuit",
        title: "Live mock interviews",
        description:
          "Two live mock interviews with a senior engineer before every real loop. Real-time feedback on technical depth, system design, communication and signal-to-noise.",
      },
      {
        icon: "Wallet",
        title: "Offer negotiation guidance",
        description:
          "A 60-minute call with a placement strategist before you sign. We benchmark your offer against prior hires at the same company, level and city — and walk you through the counter.",
      },
      {
        icon: "FileText",
        title: "Guided 90-day onboarding",
        description:
          "A week-by-week onboarding plan from signed offer to day-90 ramp check. Manager expectation setting, peer introductions, first-PR playbook and a 30/60/90 review template.",
      },
    ],
    process: [
      {
        title: "Profile goes live",
        duration: "Day 1",
        description:
          "Verified skill profile, capstone portfolio, salary band and location preferences go live in the STIOOS marketplace. Visible only to vetted hiring employers with an open role.",
      },
      {
        title: "AI-matched shortlists",
        duration: "Day 2-3",
        description:
          "Top five role matches land in your inbox within 48 hours. Each includes the role spec, salary band, hiring manager and the verified skill gaps the matcher flagged for the interview.",
      },
      {
        title: "Interview prep & mocks",
        duration: "Week 2-4",
        description:
          "Company-specific question bank, two live mock interviews with a senior engineer, and a 30-minute prep call before every real loop — calibrated to that company's interview style.",
      },
      {
        title: "Offer, negotiation & onboarding",
        duration: "Week 5+",
        description:
          "Offer negotiation strategist on call before you sign. 90-day onboarding plan with week-by-week ramp check-ins through your first performance review.",
      },
    ],
    benefits: [
      {
        metric: "5 wks",
        label: "Avg. profile-to-offer",
        description:
          "Median time from profile live to signed offer. The job-board plus recruiter path takes 14-22 weeks for comparable roles.",
      },
      {
        metric: "+22%",
        label: "Avg. salary uplift",
        description:
          "Compared to the candidate's prior role or best alternative offer. Driven by company-specific negotiation prep and benchmarking against prior hires.",
      },
      {
        metric: "84%",
        label: "First-loop pass rate",
        description:
          "Of candidates we send into a first interview loop. The industry average for cold applications to comparable roles sits around 18-25%.",
      },
      {
        metric: "92%",
        label: "Offer acceptance",
        description:
          "Of offers extended through STIOOS are accepted. Candidates can hold multiple offers — negotiation guidance runs through the final sign-back.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Active & passive candidates",
        description:
          "You are either actively looking or quietly open to the right role. Get Placed surfaces vetted openings matched to your verified skills — without the recruiter spam, the resume black hole or the salary cut.",
        bullets: [
          "$0 recruiter fee — we are paid by the hiring employer",
          "No salary commission, ever — your salary is yours",
          "Company-specific interview prep before every loop",
          "Offer negotiation guidance backed by real hire benchmarks",
        ],
        cta: "Browse open roles",
      },
      {
        kicker: "For Employers",
        title: "Hiring teams with open reqs",
        description:
          "You have open roles, published salary bands and a 48-hour shortlist SLA. Post your req to the STIOOS marketplace and a vetted AI-matched shortlist lands in your ATS within 48 hours.",
        bullets: [
          "AI-matched shortlists of 5-8 vetted candidates in 48h",
          "Every candidate's portfolio is verified and reviewable",
          "Pay-after-join — no upfront posting or sourcing fees",
          "90-day replacement guarantee on every accepted placement",
        ],
        cta: "Post a role",
      },
    ],
    comparison: [
      { feature: "Role source", withStioos: "Vetted live openings", without: "Job-board scrapes + recruiter spam" },
      { feature: "Match precision", withStioos: "AI-ranked on verified skills", without: "Keyword match on resume" },
      { feature: "Interview prep", withStioos: "Company-specific question bank", without: "Generic LeetCode grind" },
      { feature: "Cost to candidate", withStioos: "$0, no salary cut", without: "10-20% first-year salary" },
      { feature: "Time to offer", withStioos: "5 wks avg", without: "14-22 wks avg" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ hires" },
      { name: "Fintech", hires: "260+ hires" },
      { name: "Healthcare", hires: "180+ hires" },
      { name: "Retail", hires: "210+ hires" },
      { name: "Logistics", hires: "120+ hires" },
      { name: "Telecom", hires: "110+ hires" },
    ],
    guarantees: [
      {
        icon: "Clock",
        title: "48-hour shortlist SLA",
        description:
          "From profile live, your first AI-matched shortlist of five roles lands within 48 hours — or you get a priority placement strategist assigned for free.",
      },
      {
        icon: "ShieldCheck",
        title: "Verified-employer promise",
        description:
          "Every hiring employer in the marketplace is vetted for funding stability, published salary band and a 90-day replacement track record. No anonymous startups, no ghost reqs.",
      },
      {
        icon: "Wallet",
        title: "No-candidate-fee guarantee",
        description:
          "You never pay STIOOS a recruiter fee, a placement fee or a salary commission. We are paid by the hiring employer — full stop, no carve-outs, no fine print.",
      },
      {
        icon: "Headset",
        title: "Negotiation strategist on call",
        description:
          "A 60-minute pre-sign call with a placement strategist, backed by real hire benchmarks at that company, level and city — included on every offer you receive.",
      },
    ],
    faqs: [
      {
        q: "Do I have to pay STIOOS anything to use Get Placed?",
        a: "No. The candidate side of Get Placed is entirely free — no recruiter fee, no placement fee, no salary commission, no income share. We are paid by the hiring employer on a pay-after-join basis. Your salary is yours, full stop.",
      },
      {
        q: "How fast will I get my first role shortlist?",
        a: "Your first AI-matched shortlist of five roles lands within 48 hours of your verified profile going live. The 48-hour SLA is guaranteed — if it slips, you get a priority placement strategist assigned to your profile at no cost.",
      },
      {
        q: "What does 'company-specific interview prep' actually include?",
        a: "For every role you accept an interview for, we surface the question bank pulled from prior hires at that company, calibrated to the role, level and team. Plus two live mock interviews with a senior engineer and a 30-minute prep call before every real loop — calibrated to that company's interview style (technical depth, system design, behavioural, take-home).",
      },
      {
        q: "Can I hold multiple offers at the same time?",
        a: "Yes — and many candidates do. The marketplace is not exclusive. The negotiation strategist runs through every offer you receive, benchmarks each against prior hires at that company, and helps you compare them on a single grid before you sign back.",
      },
      {
        q: "What happens after I sign an offer?",
        a: "You get a guided 90-day onboarding plan — week-by-week ramp check-ins through your first performance review. Includes manager expectation setting, peer introductions, first-PR playbook, 30/60/90 review template and a STIOOS check-in at day 30, 60 and 90. We stay with you through ramp, not just through signature.",
      },
    ],
    ctaTitle: "Get matched to live roles",
    ctaHighlight: "this week",
    ctaSubtitle:
      "Profile goes live in 10 minutes. First AI-matched shortlist of five roles lands in your inbox within 48 hours — interview prep starts the day after.",
  },

  // ─────────────────────────────────────────────────────────────
  // 3. GET CERTIFIED — Candidate validates skills
  // ─────────────────────────────────────────────────────────────
  {
    slug: "get-certified",
    name: "Get Certified",
    heroTitle: "Validate your skills,",
    heroHighlight: "earn employer-trusted proof",
    heroEyebrow: "For Job Seekers · Talent Solutions",
    heroSubtitle:
      "AI-scored assessments across 200+ skill tracks, industry-recognized certifications and a verified portfolio of real client-shaped projects — every credential proof-checked and visible to 500+ hiring employers.",
    heroStats: [
      { value: "200+", label: "Skill tracks" },
      { value: "92%", label: "Assess accuracy" },
      { value: "24", label: "Certifications" },
      { value: "1-click", label: "Portfolio share" },
    ],
    heroTags: [
      "Skills assessment",
      "Industry certifications",
      "Career portfolio",
      "Verified credentials",
    ],
    heroGaugeValue: 92,
    heroGaugeLabel: "verified",
    heroKpis: [
      { label: "Credential trust", before: "30%", after: "94%", unit: "%" },
      { label: "Skill coverage", before: "40%", after: "92%", unit: "%" },
      { label: "Interview pass", before: "35%", after: "84%", unit: "%" },
    ],
    heroBars: [
      { label: "Assessment rigor", before: "20", after: "92", unit: "%", max: 100 },
      { label: "Portfolio depth", before: "25", after: "88", unit: "%", max: 100 },
    ],
    heroQuote:
      "My STIOOS portfolio got me past resume screen at three companies that had rejected me twice before. The verified skill profile is the difference between a recruiter read and an auto-reject.",
    heroQuoteAttribution: "— Ana Sokolova, Full-Stack Engineer",
    overview: [
      "Get Certified is the candidate-side credentialing layer of STIOOS. Every assessment is AI-proctored, scored against an industry rubric and benchmarked against the distribution of prior test-takers at your experience level — so a passing score means something a hiring employer can trust. Assessments cover 200+ skill tracks across AI, cloud, data, full-stack, security, product and operations.",
      "On top of skill assessments, you earn industry-recognized certifications (AWS, Azure, GCP, Kubernetes, Scrum.org, Salesforce and more) included in your program at no extra cost. Every credential flows into your verified STIOOS portfolio — alongside your capstone projects, mentor reviews and verified work history — shareable to hiring employers with one click.",
    ],
    capabilities: [
      {
        icon: "ClipboardCheck",
        title: "AI-scored skill assessments",
        description:
          "200+ skill tracks, AI-proctored, scored against an industry rubric and benchmarked against prior test-takers at your level. A passing score is a verified signal, not a participation trophy.",
      },
      {
        icon: "Award",
        title: "Industry certifications included",
        description:
          "AWS, Azure, GCP, Kubernetes, Scrum.org, Salesforce and more — exam fees, prep materials and a senior mentor for the certification sprint are included in your program.",
      },
      {
        icon: "TrendingUp",
        title: "Verified project portfolio",
        description:
          "Three production-grade capstone pieces, mentor-reviewed, with real repo links, deploy URLs and verified contribution history. Shareable to hiring employers with one click.",
      },
      {
        icon: "ShieldCheck",
        title: "Anti-cheat proctoring",
        description:
          "Every assessment is AI-proctored — webcam, screen-share, browser-lock and keystroke dynamics. Verified credentials carry a STIOOS-trust badge that hiring employers can audit.",
      },
      {
        icon: "BrainCircuit",
        title: "Skill-gap mapping",
        description:
          "Your assessment scores flow into a skill-gap map aligned to your target role scorecard. You see exactly which competencies need a sprint and which are already interview-ready.",
      },
      {
        icon: "Sparkles",
        title: "One-click portfolio share",
        description:
          "Your verified profile, assessments, certifications and capstone portfolio are shareable to any hiring employer with a single signed link — no resume rewriting, no PDF attachment.",
      },
    ],
    process: [
      {
        title: "Baseline assessment",
        duration: "Day 1-2",
        description:
          "A 90-minute AI-proctored baseline across your target role's core competencies. Output is a skill-gap map showing exactly which tracks need a sprint and which are already interview-ready.",
      },
      {
        title: "Targeted skill sprints",
        duration: "Week 1-6",
        description:
          "Mentor-led sprints on the specific tracks the baseline flagged. Each sprint ends with a follow-up AI-scored assessment — your scorecard updates in real time as competencies close.",
      },
      {
        title: "Industry certification",
        duration: "Week 4-10",
        description:
          "Exam fees, prep materials and a senior mentor for the certification sprint are included. Most graduates clear 1-3 industry certifications during the program window.",
      },
      {
        title: "Portfolio review & verification",
        duration: "Week 10-12",
        description:
          "Capstone portfolio goes through a final mentor review and verification pass. Your STIOOS-trust badge, signed portfolio link and full credential transcript go live.",
      },
    ],
    benefits: [
      {
        metric: "94%",
        label: "Employer-trust rate",
        description:
          "Of hiring employers accept STIOOS-verified credentials at face value — bypassing the resume screen and the take-home round for verified candidates.",
      },
      {
        metric: "200+",
        label: "Skill tracks assessed",
        description:
          "Across AI, cloud, data, full-stack, security, product and operations. Each track has a published rubric, prior-test-taker distribution and a verified passing threshold.",
      },
      {
        metric: "24",
        label: "Industry certifications",
        description:
          "AWS, Azure, GCP, Kubernetes, Scrum.org, Salesforce and more — exam fees, prep materials and senior mentor support included in your program.",
      },
      {
        metric: "1-click",
        label: "Portfolio sharing",
        description:
          "Your verified profile, assessments, certifications and capstone pieces are shareable to any hiring employer with a single signed link.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Self-taught & experienced hires",
        description:
          "You have real skills — but no credential that hiring employers trust. Get Certified gives you a verified, audit-backed skill profile and a portfolio of real capstone pieces that bypass the resume black hole.",
        bullets: [
          "200+ AI-scored assessments across 7 disciplines",
          "Industry certifications included — exam fees covered",
          "Verified portfolio of 3 production-grade capstones",
          "One-click shareable to 500+ hiring employers",
        ],
        cta: "Start an assessment",
      },
      {
        kicker: "For Employers",
        title: "Hiring teams tired of resume roulette",
        description:
          "Stop paying recruiters to screen on keyword match. STIOOS-verified candidates arrive with an audit-backed skill transcript, real capstone portfolio and a trust badge you can verify in one click.",
        bullets: [
          "Trust-badge verification API for your ATS",
          "Skill rubric aligned to your role scorecard",
          "Portfolio reviewable before the first interview",
          "Verified candidates bypass the resume screen",
        ],
        cta: "Verify candidates",
      },
    ],
    comparison: [
      { feature: "Assessment rigor", withStioos: "AI-proctored, benchmarked", without: "Online quiz, no proctoring" },
      { feature: "Credential trust", withStioos: "Audit-backed STIOOS badge", without: "PDF certificate, no verification" },
      { feature: "Portfolio", withStioos: "3 real capstones, mentor-reviewed", without: "Toy projects in a sandbox" },
      { feature: "Certifications", withStioos: "Exam fees + mentor included", without: "$300-$500 per exam, self-study" },
      { feature: "Skill-gap mapping", withStioos: "Real-time, role-aligned", without: "None" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ hires" },
      { name: "Fintech", hires: "260+ hires" },
      { name: "Healthcare", hires: "180+ hires" },
      { name: "Retail", hires: "210+ hires" },
      { name: "Manufacturing", hires: "140+ hires" },
      { name: "Education", hires: "110+ hires" },
    ],
    guarantees: [
      {
        icon: "ShieldCheck",
        title: "Audit-backed trust badge",
        description:
          "Every STIOOS-verified credential carries a signed trust badge with a public audit URL — any hiring employer can verify the assessment, score, proctoring log and rubric in one click.",
      },
      {
        icon: "Award",
        title: "Certification pass guarantee",
        description:
          "If you fail an included industry certification exam on the first attempt, you get a free re-take plus a 4-week senior-mentor intervention sprint before the second attempt.",
      },
      {
        icon: "RefreshCw",
        title: "Annual recertification",
        description:
          "Verified credentials expire after 12 months. A free 60-minute recertification assessment keeps your badge current — and signals to employers that your skills have not gone stale.",
      },
      {
        icon: "Target",
        title: "Role-aligned rubric",
        description:
          "Every assessment rubric is aligned to a published role scorecard — so a passing score directly corresponds to interview readiness for that role, not just generic competency.",
      },
    ],
    faqs: [
      {
        q: "How are the assessments proctored?",
        a: "Every assessment is AI-proctored — webcam feed, screen-share, browser-lock and keystroke dynamics. The AI flags anomalies in real time and a human reviewer audits every flag before a score is finalized. Verified credentials carry the full proctoring log in the audit URL.",
      },
      {
        q: "Which industry certifications are included?",
        a: "AWS Solutions Architect / Developer / DevOps, Azure Administrator / Solutions Architect, GCP Associate Engineer / Cloud Architect, Certified Kubernetes Administrator (CKA), Scrum.org PSM I, Salesforce Administrator / Developer, and others by request. Exam fees, prep materials and a senior mentor for the certification sprint are included in your program.",
      },
      {
        q: "What does 'verified portfolio' mean?",
        a: "Three production-grade capstone pieces, each mentor-reviewed, with real repo links, deploy URL and a verified contribution history (commit graph, PR history, mentor review notes). Every portfolio is signed with a STIOOS-trust badge — any hiring employer can audit it in one click.",
      },
      {
        q: "How long does a credential stay valid?",
        a: "STIOOS-verified credentials expire after 12 months. A free 60-minute recertification assessment keeps your badge current — and signals to employers that your skills have not gone stale. Industry certifications follow their vendor's own recertification cadence.",
      },
      {
        q: "Can employers verify my credentials directly in their ATS?",
        a: "Yes. We provide a trust-badge verification API that integrates with Workday, Greenhouse, Lever and Ashby. Employers can verify the assessment, score, proctoring log and rubric in one click — no manual reference calls, no resume screen on verified candidates.",
      },
    ],
    ctaTitle: "Get your skills verified",
    ctaHighlight: "this month",
    ctaSubtitle:
      "Baseline assessment in 90 minutes. Skill-gap map in 24 hours. Your verified portfolio and trust badge go live within 12 weeks — shareable to 500+ hiring employers.",
  },

  // ─────────────────────────────────────────────────────────────
  // 4. BUILD TALENT — Employer builds pipeline
  // ─────────────────────────────────────────────────────────────
  {
    slug: "build-talent",
    name: "Build Talent",
    heroTitle: "Train cohorts on your stack,",
    heroHighlight: "build a pipeline not a lottery",
    heroEyebrow: "For Employers · Talent Solutions",
    heroSubtitle:
      "Train-to-hire cohorts, custom curriculum co-designed with your staff engineers, and corporate training programs that upskill your existing workforce at scale — every graduate ramps in weeks, not months.",
    heroStats: [
      { value: "5-8", label: "Cohort size" },
      { value: "4-6 wks", label: "Curriculum ramp" },
      { value: "96%", label: "Grad-to-hire" },
      { value: "40%", label: "Lower cost-per-hire" },
    ],
    heroTags: [
      "Train-to-hire cohorts",
      "Hire-to-train programs",
      "Corporate training",
      "Custom curriculum",
    ],
    heroGaugeValue: 90,
    heroGaugeLabel: "ramp-ready",
    heroKpis: [
      { label: "Cost per hire", before: "$20K", after: "$12K", unit: "$K" },
      { label: "Time to ramp", before: "6 mo", after: "8 wks", unit: "wks" },
      { label: "12-mo retention", before: "50%", after: "96%", unit: "%" },
    ],
    heroBars: [
      { label: "Pipeline health", before: "30", after: "94", unit: "%", max: 100 },
      { label: "Cohort readiness", before: "25", after: "92", unit: "%", max: 100 },
    ],
    heroQuote:
      "We replaced a stalled recruiter pipeline with a STIOOS cohort and onboarded 12 senior engineers in 8 weeks. The 90-day replacement guarantee meant our CFO finally stopped arguing with HR.",
    heroQuoteAttribution: "— Raza Ahmed, VP Engineering at a Series-B SaaS",
    overview: [
      "Build Talent is the employer-side pipeline engine of STIOOS. You sponsor a role-aligned cohort — 5-8 vetted candidates trained on your exact stack, your repos and your conventions — and graduate with a ready-to-hire bench. Curriculum is co-designed with your staff engineers, capstones become real paid pilot projects on your roadmap, and you hold first right-to-hire on every graduate.",
      "For existing workforce upskilling, the same engine powers corporate training programs — AI, cloud, data, full-stack, security and leadership tracks — delivered as 4-6 week mentor-led sprints. Every cohort ships with a written SLA, weekly reporting and a 90-day ramp check after graduation. Replacement is free if a placed candidate exits within the guarantee window.",
    ],
    capabilities: [
      {
        icon: "GraduationCap",
        title: "Train-to-hire cohorts",
        description:
          "5-8 vetted candidates trained on your exact stack and ramped against your role scorecard. First right-to-hire on every graduate. Capstone becomes a real paid pilot on your roadmap.",
      },
      {
        icon: "UserCheck",
        title: "Hire-to-train programs",
        description:
          "Already hired? We train your new joiners to your exact role requirements during their notice period — they ramp in weeks, not months, and ship a real PR on day one.",
      },
      {
        icon: "Award",
        title: "Corporate training at scale",
        description:
          "Upskill your existing workforce across AI, cloud, data, full-stack, security and leadership tracks. 4-6 week mentor-led sprints with weekly checkpoints and a graduation capstone.",
      },
      {
        icon: "BookOpen",
        title: "Custom curriculum co-design",
        description:
          "Your staff engineers co-design the curriculum with ours — repos, style guide, conventions, real customer workflows baked into every module. Not a generic bootcamp syllabus.",
      },
      {
        icon: "Users",
        title: "Senior mentor bench",
        description:
          "Every cohort is matched to a senior engineer mentor from our bench — weekly code reviews, pair-programming sessions, async feedback on every PR candidates ship during the sprint.",
      },
      {
        icon: "LineChart",
        title: "Weekly pipeline dashboard",
        description:
          "A shared dashboard updated every Monday — cohort progress, checkpoint scores, capstone review status and a hire-readiness scorecard per candidate. No more chasing recruiters for status.",
      },
    ],
    process: [
      {
        title: "Discovery & role definition",
        duration: "Week 1",
        description:
          "30-minute deep dive with your hiring manager + staff engineer. We translate your hiring need into a role scorecard — skills, must-haves, deal-breakers and the assessment rubric.",
      },
      {
        title: "Curriculum co-design",
        duration: "Week 1-2",
        description:
          "Your staff engineers co-design the curriculum with ours. Repos, style guide, conventions and a real capstone brief drawn from your roadmap — locked before sourcing starts.",
      },
      {
        title: "Sourcing, screening & cohort",
        duration: "Week 2-4",
        description:
          "AI sourcing from 2M+ candidates, 5-stage human screening against the role scorecard. You sign off on the final 5-8 cohort members before the training sprint starts.",
      },
      {
        title: "Sprint, capstone & placement",
        duration: "Week 4-10",
        description:
          "Mentor-led 4-6 week sprint in your stack. Capstone becomes a real paid pilot on your roadmap. You review capstones, conduct final-loop interviews and convert graduates to full-time hires.",
      },
    ],
    benefits: [
      {
        metric: "40%",
        label: "Lower cost-per-hire",
        description:
          "Versus 20-30% traditional agency fees on first-year salary. Cohort sponsorship is a fixed fee — no per-placement commission, no contingency, no surprises.",
      },
      {
        metric: "8 wks",
        label: "Time to ramp",
        description:
          "From cohort kickoff to a hired graduate shipping their first real PR. The traditional agency-plus-onboarding path takes 4-6 months for comparable roles.",
      },
      {
        metric: "96%",
        label: "12-month retention",
        description:
          "Of cohort graduates placed as full-time hires are still with the hiring employer at month 12. The 90-day replacement guarantee covers the rest.",
      },
      {
        metric: "5-8",
        label: "Vetted candidates per cohort",
        description:
          "AI-sourced from 2M+, 5-stage human screened against your role scorecard, and signed off by you before the sprint starts. Every candidate ramp-ready on your stack.",
      },
    ],
    audiences: [
      {
        kicker: "For Employers",
        title: "Hiring teams with role-spec gaps",
        description:
          "You have open roles that are hard to source for — niche stack, senior level, multiple concurrent reqs. Sponsor a Build Talent cohort and a vetted bench ramps on your exact stack with first right-to-hire on every graduate.",
        bullets: [
          "5-8 vetted candidates trained on your stack",
          "Custom curriculum co-designed with your staff engineers",
          "First right-to-hire on every graduate",
          "90-day replacement guarantee on every placement",
        ],
        cta: "Sponsor a cohort",
      },
      {
        kicker: "For Employers",
        title: "L&D leaders upskilling existing teams",
        description:
          "Your existing workforce needs to ramp on AI, cloud, data or a new internal platform. The same cohort engine delivers corporate training — mentor-led sprints, capstones on real internal projects, and a graduation scorecard per learner.",
        bullets: [
          "4-6 week mentor-led sprints on your stack",
          "Capstone on a real internal project, not a sandbox",
          "Graduation scorecard per learner — verified competency",
          "Multi-region delivery across 3+ delivery centers",
        ],
        cta: "Plan workforce training",
      },
    ],
    comparison: [
      { feature: "Curriculum source", withStioos: "Co-designed with your engineers", without: "Generic vendor syllabus" },
      { feature: "Capstone", withStioos: "Real paid pilot on your roadmap", without: "Toy project in a sandbox" },
      { feature: "Mentorship", withStioos: "Senior engineer, weekly 1:1", without: "Vendor trainer, async only" },
      { feature: "Pricing", withStioos: "Fixed cohort fee, no commission", without: "Per-seat license + travel + expenses" },
      { feature: "Pipeline visibility", withStioos: "Weekly shared dashboard", without: "Quarterly progress report" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ hires" },
      { name: "Fintech", hires: "260+ hires" },
      { name: "Healthcare", hires: "180+ hires" },
      { name: "Retail", hires: "210+ hires" },
      { name: "Manufacturing", hires: "140+ hires" },
      { name: "Logistics", hires: "120+ hires" },
    ],
    guarantees: [
      {
        icon: "RefreshCw",
        title: "90-day replacement guarantee",
        description:
          "If a placed cohort graduate leaves or underperforms within 90 days, we source and place a replacement from the next cohort at no additional fee — no questions asked.",
      },
      {
        icon: "Wallet",
        title: "Fixed cohort fee, no commission",
        description:
          "Cohort sponsorship is a fixed fee — no per-placement commission, no contingency on first-year salary. You know the total cost of the cohort before sourcing starts.",
      },
      {
        icon: "ShieldCheck",
        title: "SLA-backed delivery",
        description:
          "Every cohort ships with a written service-level agreement covering shortlist turnaround, checkpoint cadence, capstone review and response times. Missed SLAs are credited against your next cohort.",
      },
      {
        icon: "LineChart",
        title: "Weekly reporting SLA",
        description:
          "A shared dashboard updated every Monday — pipeline health, cohort progress, capstone review status and a hire-readiness scorecard per candidate. No more chasing recruiters for status updates.",
      },
    ],
    faqs: [
      {
        q: "How long does a Build Talent cohort take?",
        a: "From signed engagement plan to a hire-ready cohort, the end-to-end timeline is 8-10 weeks: 1 week for discovery and role definition, 1-2 weeks for curriculum co-design, 2 weeks for sourcing and screening, then 4-6 weeks for the mentor-led training sprint and capstone. We can compress to 6 weeks for urgent reqs with a priority sourcing surcharge.",
      },
      {
        q: "What does 'first right-to-hire' actually mean?",
        a: "Every graduate of your sponsored cohort is offered to you first — you have a 7-day exclusive window to extend an offer after capstone review. If you decline, the graduate flows into our curated placement pool across 500+ hiring partners. There is no obligation to hire any specific candidate or any specific number from the cohort.",
      },
      {
        q: "How is the capstone a 'real paid pilot'?",
        a: "During curriculum co-design, your staff engineer identifies a small, well-scoped project from your roadmap — typically a 2-3 engineer-week pilot that is real work but not on a critical path. Cohort candidates execute that pilot as their capstone, with your engineer as the reviewer. You pay a fixed pilot fee (separate from the cohort fee) and own the IP of whatever ships.",
      },
      {
        q: "Can we scale cohorts up or down between quarters?",
        a: "Yes. Most clients start with a single cohort, then graduate to a Pipeline Partner retainer once the first cohort proves out. You can pause cohorts between quarters, scale the cohort size up or down with 30 days notice, and upgrade to Enterprise Academy (branded talent academy with custom portal and dedicated delivery team) at any contract renewal.",
      },
      {
        q: "What about corporate training for existing employees?",
        a: "The same cohort engine delivers corporate training — 4-6 week mentor-led sprints across AI, cloud, data, full-stack, security and leadership tracks. Capstones are real internal projects, every learner gets a graduation scorecard, and pricing is per-seat or per-cohort (your choice). Multi-region delivery is available across 3+ delivery centers.",
      },
    ],
    ctaTitle: "Build your talent pipeline",
    ctaHighlight: "this quarter",
    ctaSubtitle:
      "Tell us your roles and ramp timeline. You get a written engagement plan in 48 hours, a co-designed curriculum in two weeks, and a vetted cohort ramping on your stack within a month.",
  },

  // ─────────────────────────────────────────────────────────────
  // 5. HIRE TALENT — Employer hires from pool
  // ─────────────────────────────────────────────────────────────
  {
    slug: "hire-talent",
    name: "Hire Talent",
    heroTitle: "Tap a 2M+ pre-vetted pool,",
    heroHighlight: "shortlists in 48 hours",
    heroEyebrow: "For Employers · Talent Solutions",
    heroSubtitle:
      "Staffing solutions, AI-powered talent sourcing and on-demand talent deployment from a 2M+ pre-vetted pool — shortlists of 5-8 vetted profiles in 48 hours, 90-day replacement, pay-after-join.",
    heroStats: [
      { value: "2M+", label: "Pre-vetted pool" },
      { value: "48h", label: "First shortlist" },
      { value: "90-day", label: "Replacement" },
      { value: "Pay-after-join", label: "Pricing" },
    ],
    heroTags: [
      "Staffing solutions",
      "Talent sourcing",
      "Talent deployment",
      "On-demand pods",
    ],
    heroGaugeValue: 87,
    heroGaugeLabel: "shortlisted",
    heroKpis: [
      { label: "Time to shortlist", before: "3 wks", after: "48h", unit: "h" },
      { label: "Cost per hire", before: "$20K", after: "$12K", unit: "$K" },
      { label: "Quality match", before: "40%", after: "94%", unit: "%" },
    ],
    heroBars: [
      { label: "Pool depth", before: "1", after: "2M+", unit: "M", max: 100 },
      { label: "Vetting rigor", before: "20", after: "92", unit: "%", max: 100 },
    ],
    heroQuote:
      "The 48-hour shortlist was the hook. The 90-day replacement was the closer. We moved all of our technical hiring to STIOOS within a quarter.",
    heroQuoteAttribution: "— Mei Lin Koh, Head of People Ops at a fintech scale-up",
    overview: [
      "Hire Talent is the employer-side staffing engine of STIOOS. You post a role spec — full-time, contract, project-based or pod — and within 48 hours a shortlist of 5-8 AI-matched, 5-stage vetted candidates lands in your ATS. Every candidate comes with a verified skill transcript, capstone portfolio, salary band and reference history.",
      "Beyond individual placements, Hire Talent powers on-demand talent pods — a pre-vetted team of 3-8 specialists deployed to a project for a fixed scope or a fixed duration. Pod staffing is priced per-pod, not per-head, and ships with a dedicated delivery manager, weekly reporting and a 90-day replacement guarantee on every pod member.",
    ],
    capabilities: [
      {
        icon: "Briefcase",
        title: "Staffing solutions",
        description:
          "Flexible staffing models — contract, permanent, or project-based — from a 2M+ pre-vetted talent pool. Pay-after-join for permanent, hourly for contract, fixed-scope for project.",
      },
      {
        icon: "Target",
        title: "AI-powered talent sourcing",
        description:
          "AI sourcing from 2M+ candidates ranked against your role scorecard. Top 5-8 vetted profiles delivered within 48 hours — with verified skill transcript and capstone portfolio.",
      },
      {
        icon: "Layers",
        title: "Talent deployment & pods",
        description:
          "Deploy pre-vetted talent pods on demand — 3-8 specialists per pod, fixed scope or fixed duration, with a dedicated delivery manager and weekly reporting.",
      },
      {
        icon: "ShieldCheck",
        title: "5-stage human screening",
        description:
          "Every candidate goes through 5-stage human screening — aptitude, technical, communication, reference and background — before they appear in a shortlist. Verified, audit-backed.",
      },
      {
        icon: "UserCheck",
        title: "Compliance-cleared bench",
        description:
          "For regulated sectors, we maintain SOC 2, HIPAA and FINRA-cleared candidate pools. Compliance screens run as part of the 5-stage screening — no separate vendor, no extra cycle time.",
      },
      {
        icon: "LineChart",
        title: "Dedicated delivery manager",
        description:
          "Every engagement ships with a dedicated delivery manager — single point of contact, weekly SLA-backed reporting, pipeline dashboard access and 24h response on every req.",
      },
    ],
    process: [
      {
        title: "Role intake & scorecard",
        duration: "Day 1",
        description:
          "A 30-minute intake call with your hiring manager. We capture the role spec, salary band, must-haves and deal-breakers, and translate it into a published role scorecard.",
      },
      {
        title: "AI sourcing & screening",
        duration: "Day 1-2",
        description:
          "AI sourcing from 2M+ candidates ranked against the scorecard. Top matches go through 5-stage human screening — aptitude, technical, communication, reference, background.",
      },
      {
        title: "48-hour shortlist delivery",
        duration: "Day 2-3",
        description:
          "A shortlist of 5-8 vetted profiles lands in your ATS within 48 hours of intake. Every profile includes verified skill transcript, capstone portfolio, salary expectation and availability.",
      },
      {
        title: "Interview loop & placement",
        duration: "Day 4+",
        description:
          "You run the interview loop. We coordinate scheduling, brief candidates on your interview style, debrief after each loop, and handle offer extension, negotiation and onboarding support.",
      },
    ],
    benefits: [
      {
        metric: "48h",
        label: "First shortlist SLA",
        description:
          "From signed intake to a shortlist of 5-8 vetted profiles in your ATS. The traditional agency path takes 3-8 weeks for a comparable shortlist of unverified resumes.",
      },
      {
        metric: "40%",
        label: "Lower cost-per-hire",
        description:
          "Versus 20-30% traditional agency fees on first-year salary. Pay-after-join pricing for permanent placements — no upfront sourcing fee, no retainer required.",
      },
      {
        metric: "90-day",
        label: "Replacement guarantee",
        description:
          "Every placement is covered by a 90-day replacement guarantee. If a placed candidate exits within 90 days, we source and place a replacement at no additional fee.",
      },
      {
        metric: "2M+",
        label: "Pre-vetted pool",
        description:
          "AI-sourced, 5-stage human screened, with verified skill transcripts and capstone portfolios. Compliance-cleared benches available for SOC 2, HIPAA and FINRA-regulated roles.",
      },
    ],
    audiences: [
      {
        kicker: "For Employers",
        title: "Hiring teams with open reqs",
        description:
          "You have open roles — full-time, contract or project — and a hiring manager who needs a vetted shortlist this week, not next month. Hire Talent delivers 5-8 vetted profiles in 48 hours with pay-after-join pricing.",
        bullets: [
          "48-hour first shortlist of 5-8 vetted profiles",
          "Pay-after-join — no upfront sourcing or training fees",
          "90-day replacement guarantee on every placement",
          "Compliance-cleared benches for regulated sectors",
        ],
        cta: "Post a role",
      },
      {
        kicker: "For Employers",
        title: "Project leaders scaling pod teams",
        description:
          "You have a fixed-scope project or a fixed-duration engagement that needs a vetted team — not individual hires. Deploy a pre-vetted talent pod of 3-8 specialists with a dedicated delivery manager.",
        bullets: [
          "Pre-vetted talent pods of 3-8 specialists",
          "Fixed-scope or fixed-duration pricing",
          "Dedicated delivery manager + weekly reporting",
          "90-day replacement guarantee on every pod member",
        ],
        cta: "Deploy a pod",
      },
    ],
    comparison: [
      { feature: "Time to shortlist", withStioos: "48 hours", without: "3-8 weeks (agency)" },
      { feature: "Vetting depth", withStioos: "5-stage AI + human", without: "Resume + 1-2 calls" },
      { feature: "Pricing", withStioos: "Pay-after-join, fixed", without: "20-30% of first-year salary" },
      { feature: "Replacement", withStioos: "90-day, free", without: "30-60 day, partial or none" },
      { feature: "Pool size", withStioos: "2M+ pre-vetted", without: "Agency CRM (thousands)" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ hires" },
      { name: "Fintech", hires: "260+ hires" },
      { name: "Healthcare", hires: "180+ hires" },
      { name: "Retail", hires: "210+ hires" },
      { name: "Manufacturing", hires: "140+ hires" },
      { name: "Telecom", hires: "110+ hires" },
    ],
    guarantees: [
      {
        icon: "Clock",
        title: "48-hour shortlist SLA",
        description:
          "From signed intake, your first shortlist of 5-8 vetted profiles lands in your ATS within 48 hours. If the SLA slips, the engagement fee is credited against your next placement.",
      },
      {
        icon: "RefreshCw",
        title: "90-day replacement guarantee",
        description:
          "Every placement is covered by a 90-day replacement guarantee. If a placed candidate exits within 90 days — voluntarily or for performance — we source and place a replacement at no additional fee.",
      },
      {
        icon: "Wallet",
        title: "Pay-after-join pricing",
        description:
          "For permanent placements, you pay only for hires who accept an offer, join your team and remain past the 90-day guarantee window. No upfront sourcing fees, no training fees, no retainer required.",
      },
      {
        icon: "ShieldCheck",
        title: "Compliance-cleared benches",
        description:
          "For regulated sectors, we maintain SOC 2, HIPAA and FINRA-cleared candidate pools. Compliance screens run as part of the 5-stage screening — no separate vendor, no extra cycle time.",
      },
    ],
    faqs: [
      {
        q: "How fast can I get a shortlist?",
        a: "From the signed intake call, your first shortlist of 5-8 vetted profiles lands in your ATS within 48 hours. If your role spec needs a custom assessment rubric (e.g. a take-home or a system-design prompt calibrated to your team), we add up to 3 business days for rubric design before the 48-hour clock starts.",
      },
      {
        q: "What does 'pay-after-join' actually mean?",
        a: "For permanent placements, you are billed only for candidates who accept an offer, join your team and remain past the 90-day replacement guarantee window. There are no upfront sourcing fees, no training fees and no retainer required for individual placements. Contract, project and pod engagements are priced hourly, fixed-scope or per-pod respectively.",
      },
      {
        q: "What happens if a placed candidate doesn't work out?",
        a: "Every placement is covered by a 90-day replacement guarantee. If the candidate leaves voluntarily or is released for performance reasons within 90 days, we source, screen and place a replacement at no additional fee. The replacement shortlist is delivered within 48 hours of your request.",
      },
      {
        q: "Can I hire for regulated sectors (SOC 2, HIPAA, FINRA)?",
        a: "Yes. We maintain compliance-cleared candidate pools for SOC 2, HIPAA and FINRA-regulated roles. Compliance screens run as part of the 5-stage human screening — no separate vendor, no extra cycle time. For roles requiring active security clearance, we partner with cleared-screening vendors and add the screen as a 6th stage.",
      },
      {
        q: "How do talent pods work?",
        a: "A talent pod is a pre-vetted team of 3-8 specialists deployed to a fixed-scope project or a fixed-duration engagement. Pricing is per-pod, not per-head — you get a single statement of work, a dedicated delivery manager, weekly reporting and a 90-day replacement guarantee on every pod member. Pod staffing is available across engineering, data, design, ops and product.",
      },
    ],
    ctaTitle: "Hire from a vetted pool",
    ctaHighlight: "this week",
    ctaSubtitle:
      "Tell us your role spec and ramp timeline. You get a published scorecard in 24 hours and a shortlist of 5-8 vetted profiles in your ATS within 48 — pay only when someone joins.",
  },

  // ─────────────────────────────────────────────────────────────
  // 6. SCALE WORKFORCE — Employer scales operations
  // ─────────────────────────────────────────────────────────────
  {
    slug: "scale-workforce",
    name: "Scale Workforce",
    heroTitle: "End-to-end workforce strategy,",
    heroHighlight: "from hiring to bench",
    heroEyebrow: "For Employers · Talent Solutions",
    heroSubtitle:
      "Workforce management, AI-powered talent assessment and dedicated placement services — one partner across the talent lifecycle. Scale your workforce up, down or sideways with a single SLA.",
    heroStats: [
      { value: "1", label: "Partner, end-to-end" },
      { value: "200+", label: "Hires / quarter" },
      { value: "96%", label: "12-mo retention" },
      { value: "24/7", label: "Follow-the-sun" },
    ],
    heroTags: [
      "Workforce management",
      "Talent assessment",
      "Placement services",
      "Bench management",
    ],
    heroGaugeValue: 89,
    heroGaugeLabel: "scaled",
    heroKpis: [
      { label: "Hires per quarter", before: "20", after: "200+", unit: "+" },
      { label: "Bench utilization", before: "45%", after: "92%", unit: "%" },
      { label: "Attrition", before: "30%", after: "6%", unit: "%" },
    ],
    heroBars: [
      { label: "Pipeline throughput", before: "30", after: "94", unit: "%", max: 100 },
      { label: "Bench readiness", before: "25", after: "90", unit: "%", max: 100 },
    ],
    heroQuote:
      "We onboarded 200 store-ops specialists in six weeks across 12 cities. The bench management and weekly cadence meant store managers finally had a predictable funnel — not a recruitment emergency every quarter.",
    heroQuoteAttribution: "— Jordan Sato, Talent Acquisition Director at a retail enterprise",
    overview: [
      "Scale Workforce is the employer-side workforce operations engine of STIOOS. For high-volume, multi-region or seasonal hiring, you get a single partner across the entire talent lifecycle — sourcing, screening, assessment, training, placement, bench management and 90-day ramp support — wrapped in one SLA and one weekly reporting cadence.",
      "The engine powers seasonal ramps (200+ specialists in 6 weeks), multi-region expansions (12 cities, 3 delivery centers, follow-the-sun), ongoing bench management (a dedicated pre-vetted bench of 10-30 candidates ready to deploy), and internal mobility assessments (skill-profile your existing workforce against new role scorecards). One partner, one dashboard, one SLA — instead of 6 vendors and 12 spreadsheets.",
    ],
    capabilities: [
      {
        icon: "Users",
        title: "Workforce management",
        description:
          "End-to-end workforce operations from hiring to retention — sourcing, screening, training, placement, ramp support and 90-day attrition management. One partner, one SLA, one dashboard.",
      },
      {
        icon: "ClipboardCheck",
        title: "Talent assessment programs",
        description:
          "AI-powered assessments to evaluate technical skills, aptitude and job readiness at scale — across 200+ skill tracks, calibrated to your role scorecards and benchmarked against prior test-takers.",
      },
      {
        icon: "TrendingUp",
        title: "Placement services",
        description:
          "A dedicated placement cell connecting your trained talent with hiring employers across industries — for internal mobility, contractor conversion or redeployment during restructuring.",
      },
      {
        icon: "Layers",
        title: "Dedicated bench management",
        description:
          "A dedicated pre-vetted bench of 10-30 candidates held warm for your next ramp — monthly bench refresh, weekly readiness check, and a deploy-on-demand SLA measured in hours.",
      },
      {
        icon: "Globe",
        title: "Multi-region delivery",
        description:
          "3+ delivery centers, 12+ cities, follow-the-sun operations. Seasonal ramps, multi-region expansions and 24/7 workforce coverage from a single partner instead of 6 regional vendors.",
      },
      {
        icon: "LineChart",
        title: "Single dashboard & SLA",
        description:
          "One dashboard across the entire talent lifecycle — pipeline, bench, cohorts, placements, attrition. One weekly reporting cadence. One SLA covering sourcing, screening, ramp and replacement.",
      },
    ],
    process: [
      {
        title: "Workforce audit & strategy",
        duration: "Week 1-2",
        description:
          "A 2-week audit of your current workforce plan — open reqs, attrition trends, ramp projections, vendor sprawl. Output is a workforce strategy document with quarterly targets and a single-SLA operating model.",
      },
      {
        title: "Bench setup & assessment",
        duration: "Week 2-4",
        description:
          "We stand up a dedicated pre-vetted bench aligned to your role scorecards. Existing workforce goes through AI-powered assessment against new role scorecards for internal mobility mapping.",
      },
      {
        title: "Sourcing, training & placement",
        duration: "Week 4+",
        description:
          "AI sourcing from 2M+, 5-stage screening, role-aligned training sprints and placement against your quarterly targets. Bench deploys on-demand; weekly reporting tracks every metric in one dashboard.",
      },
      {
        title: "Ramp, retention & redeployment",
        duration: "Ongoing",
        description:
          "90-day ramp support on every placement. Monthly attrition review, quarterly business review and internal mobility / redeployment support during restructuring — one partner through the entire lifecycle.",
      },
    ],
    benefits: [
      {
        metric: "200+",
        label: "Hires per quarter",
        description:
          "Sustained throughput for high-volume, multi-region or seasonal hiring — measured against your quarterly targets and the single-SLA operating model.",
      },
      {
        metric: "92%",
        label: "Bench utilization",
        description:
          "Of dedicated bench candidates deployed within the deploy-on-demand SLA. Bench refresh runs monthly; readiness check runs weekly; deploy SLA is measured in hours.",
      },
      {
        metric: "6%",
        label: "12-month attrition",
        description:
          "Of placements through Scale Workforce exit within 12 months — versus the 30% industry average for high-volume hiring. The 90-day ramp support drives most of the lift.",
      },
      {
        metric: "1",
        label: "Partner, end-to-end",
        description:
          "One partner across sourcing, screening, training, placement, bench and ramp — instead of 6 vendors and 12 spreadsheets. One SLA, one dashboard, one weekly reporting cadence.",
      },
    ],
    audiences: [
      {
        kicker: "For Employers",
        title: "Operations leaders scaling teams",
        description:
          "You are scaling a workforce — seasonal ramp, multi-region expansion, or a sustained high-volume hiring plan — and you need a single partner instead of 6 regional vendors and 12 spreadsheets. Scale Workforce gives you one SLA across the entire lifecycle.",
        bullets: [
          "200+ hires per quarter, sustained throughput",
          "Dedicated pre-vetted bench, deploy on-demand",
          "Multi-region delivery across 3+ centers, 12+ cities",
          "One dashboard, one SLA, one weekly reporting cadence",
        ],
        cta: "Plan a workforce ramp",
      },
      {
        kicker: "For Employers",
        title: "Talent leaders optimizing existing workforce",
        description:
          "You need to skill-profile your existing workforce against new role scorecards, map internal mobility paths, or redeploy talent during restructuring. The same engine runs assessment, mobility and redeployment.",
        bullets: [
          "AI-powered assessment of 200+ skill tracks",
          "Internal mobility mapping against new role scorecards",
          "Redeployment support during restructuring",
          "Quarterly business review with retention and attrition metrics",
        ],
        cta: "Audit your workforce",
      },
    ],
    comparison: [
      { feature: "Partner count", withStioos: "1, end-to-end", without: "6+ vendors + spreadsheets" },
      { feature: "Reporting cadence", withStioos: "Weekly, single dashboard", without: "Monthly, per-vendor exports" },
      { feature: "Bench management", withStioos: "Dedicated, deploy on-demand", without: "None — reactive sourcing" },
      { feature: "Throughput", withStioos: "200+ hires / quarter", without: "20-40 hires / quarter" },
      { feature: "Attrition (12-mo)", withStioos: "6%", without: "30% industry average" },
    ],
    industries: [
      { name: "Retail", hires: "260+ hires" },
      { name: "Manufacturing", hires: "190+ hires" },
      { name: "Logistics", hires: "140+ hires" },
      { name: "Telecom", hires: "130+ hires" },
      { name: "Healthcare", hires: "240+ hires" },
      { name: "Education", hires: "110+ hires" },
    ],
    guarantees: [
      {
        icon: "LineChart",
        title: "Single-SLA operating model",
        description:
          "One SLA covering sourcing, screening, training, placement, ramp and replacement — across every region, every role and every quarter. Missed SLAs are credited against your next billing cycle.",
      },
      {
        icon: "RefreshCw",
        title: "90-day ramp guarantee",
        description:
          "Every placement ships with 90-day ramp support — manager check-ins, peer introductions, performance review templates and a STIOOS-led intervention if ramp metrics slip. Replacements are free within 90 days.",
      },
      {
        icon: "Layers",
        title: "Bench deploy-on-demand",
        description:
          "Dedicated bench candidates deploy within a published SLA measured in hours — not weeks. Bench refresh runs monthly; readiness check runs weekly; deploy SLA is missed-credited.",
      },
      {
        icon: "ShieldCheck",
        title: "Quarterly business review",
        description:
          "A QBR with your executive sponsor every quarter — retention, attrition, pipeline throughput, bench utilization and a forward-looking ramp plan. No more flying blind on workforce metrics.",
      },
    ],
    faqs: [
      {
        q: "How is Scale Workforce different from Hire Talent?",
        a: "Hire Talent is for individual placements and pod staffing — 1 to 8 hires per engagement, pay-after-join. Scale Workforce is for sustained, high-volume or multi-region hiring — 50+ hires per quarter, a dedicated bench, a single-SLA operating model and one partner across the entire lifecycle. Most clients start with Hire Talent and graduate to Scale Workforce once quarterly throughput exceeds 20 hires.",
      },
      {
        q: "What does 'single-SLA operating model' actually mean?",
        a: "One SLA covering sourcing, screening, training, placement, ramp support and replacement — across every region, every role and every quarter. The SLA is published in the engagement plan, measured weekly in the dashboard, and missed SLAs are credited against your next billing cycle. There are no per-vendor carve-outs, no regional exceptions and no separate SLAs for training vs. placement.",
      },
      {
        q: "How does the dedicated bench work?",
        a: "We hold a pre-vetted bench of 10-30 candidates aligned to your role scorecards — warm, not cold. The bench refreshes monthly (top-up sourcing against the target size), readiness checks run weekly (every candidate's availability is confirmed), and a deploy-on-demand SLA covers the time from your request to the candidate's first day. Bench size is reviewed quarterly and can be scaled up or down with 30 days notice.",
      },
      {
        q: "Can you handle seasonal ramps and multi-region expansions?",
        a: "Yes — that is the core use case. The engine has shipped 200+ store-ops specialists in 6 weeks across 12 cities, 50+ engineers in 8 weeks across 3 regions, and 100+ healthcare specialists in 10 weeks across 4 states. Multi-region delivery runs from 3 delivery centers with follow-the-sun operations and a single weekly reporting cadence.",
      },
      {
        q: "What about internal mobility and redeployment?",
        a: "The same engine runs AI-powered assessment of your existing workforce against new role scorecards — useful for internal mobility mapping, identifying high-potential employees for accelerated tracks, or redeploying talent during restructuring. Assessment results flow into the same dashboard as your external pipeline, so workforce planning sees the full picture in one view.",
      },
    ],
    ctaTitle: "Scale your workforce",
    ctaHighlight: "this quarter",
    ctaSubtitle:
      "Tell us your quarterly targets and ramp timeline. You get a workforce strategy document in 2 weeks, a dedicated bench in 4, and a single-SLA operating model covering the entire lifecycle.",
  },

  // ─────────────────────────────────────────────────────────────
  // 7. JOINING TERMS — main info page (Talent info pill #1)
  //    /talent-solutions/joining-terms
  //    Covers eligibility, application process, documents, fee
  //    structure, stipend, training bond, conversion to hire,
  //    refund policy, code of conduct, attendance, performance.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "joining-terms",
    name: "Joining Terms",
    heroTitle: "How candidates join,",
    heroHighlight: "convert and stay hired",
    heroEyebrow: "For Job Seekers · Talent Solutions",
    heroSubtitle:
      "Everything you need to evaluate joining a STIOOS talent program — eligibility gates, the application process, document checklist, the no-upfront-cost fee model, monthly stipends, training bond terms, conversion-to-hire path, refund policy and the code of conduct that holds the cohort together.",
    heroStats: [
      { value: "70/100", label: "Aptitude gate" },
      { value: "48h", label: "Screen result" },
      { value: "$0", label: "Upfront cost" },
      { value: "96%", label: "Conversion" },
    ],
    heroTags: [
      "Eligibility & aptitude gate",
      "Document checklist",
      "Training bond & conversion",
      "Stipend + refund policy",
    ],
    heroGaugeValue: 92,
    heroGaugeLabel: "onboarding",
    heroKpis: [
      { label: "Application → screen", before: "10 days", after: "48h", unit: "h" },
      { label: "Offer → start", before: "30 days", after: "10 days", unit: "d" },
      { label: "Trainee → FTE conversion", before: "40%", after: "96%", unit: "%" },
    ],
    heroBars: [
      { label: "Document completeness", before: "55", after: "100", unit: "%", max: 100 },
      { label: "Compliance readiness", before: "60", after: "98", unit: "%", max: 100 },
    ],
    heroQuote:
      "I knew exactly what I was signing before I signed it — every fee, every stipend, every bond clause. The conversion terms were written into my offer, not negotiated later.",
    heroQuoteAttribution: "— Priya Raman, Software Engineer (converted from trainee)",
    overview: [
      "Joining Terms is the rulebook candidates read BEFORE they accept a cohort seat — and the contract framework that holds the cohort together after they do. It documents who is eligible to apply, how the application and screening process works, what documents you need to submit, how the no-upfront-cost fee model is funded, what stipend you receive during training, how the training bond works, the conversion path from trainee to full-time employee, the refund policy if you exit early, the code of conduct every trainee signs, and the attendance + performance metrics that gate conversion.",
      "Every clause is published in writing before you sign — no surprises, no verbal commitments, no fine print discovered on day one. The same terms apply whether you are joining a sponsored cohort tied to a specific hiring employer or an open cohort flowing into our curated placement pool. This page is the full reference; the Curriculum, Pricing and Agreement sub-pages drill into each section in detail.",
    ],
    capabilities: [
      {
        icon: "ClipboardCheck",
        title: "Eligibility & aptitude gate",
        description:
          "Class 12 / equivalent baseline plus a 60-minute AI-proctored aptitude screen (numerical, logical, verbal). A 70/100 score advances you to the role-matching call — no degree required, no work experience required.",
      },
      {
        icon: "ListChecks",
        title: "Document checklist",
        description:
          "Government ID, education proof, address proof, bank account, PAN/equivalent, and (where relevant) work authorization. Every document is uploaded once into a secure vault — no re-uploads every cohort.",
      },
      {
        icon: "Wallet",
        title: "No-upfront-cost fee model",
        description:
          "Tuition is sponsored upfront by the hiring employer whose stack the cohort is built around, or by the STIOOS talent fund for open cohorts. You never pay out of pocket, never sign an income-share agreement.",
      },
      {
        icon: "Receipt",
        title: "Monthly stipend",
        description:
          "Trainees receive a monthly stipend that covers living expenses during the training sprint — paid on the 1st of every month by direct deposit, with a published payslip and tax statement.",
      },
      {
        icon: "Lock",
        title: "Training bond & conversion",
        description:
          "A 12-month service bond that begins the day you convert to full-time — not the day you start training. Conversion is gated by capstone review, attendance and performance metrics, all published in writing.",
      },
      {
        icon: "Scale",
        title: "Refund policy & exit terms",
        description:
          "If you exit before week 4, you owe nothing. After week 4, the stipend already paid is pro-rated against the bond. No clawbacks, no early-exit penalty, no salary commission after placement.",
      },
    ],
    process: [
      {
        title: "Apply & submit documents",
        duration: "Day 1-3",
        description:
          "Submit an application and upload your document checklist to the secure vault. A program manager reviews completeness within 24 hours and flags any missing items before you advance to the aptitude screen.",
      },
      {
        title: "Aptitude screen & role match",
        duration: "Day 4-7",
        description:
          "Complete a 60-minute AI-proctored aptitude screen. A 70/100 score advances you to a 30-minute role-matching call where we map you to the open cohort whose stack, role and ramp timeline fits your goals.",
      },
      {
        title: "Sign & onboarding",
        duration: "Week 2",
        description:
          "Review the service agreement, training bond, stipend schedule and code of conduct with a program manager. Sign electronically. Stipend payments and cohort access begin on the published sprint start date.",
      },
      {
        title: "Train, graduate & convert",
        duration: "Week 3 → Conversion",
        description:
          "Complete the training sprint, ship the capstone, pass the capstone review and meet attendance + performance metrics. Convert to a full-time offer with the hiring employer — or flow into the curated placement pool.",
      },
    ],
    benefits: [
      {
        metric: "96%",
        label: "Trainee-to-FTE conversion",
        description:
          "Of trainees who complete the sprint and pass capstone review convert to full-time hires within 60 days — measured against the employer's role scorecard and the cohort's published conversion gates.",
      },
      {
        metric: "$0",
        label: "Upfront cost",
        description:
          "Zero application fee, zero tuition, zero tooling fee, zero capstone review fee. Stipend received during training. No income-share agreement and no salary commission after placement.",
      },
      {
        metric: "10d",
        label: "Offer to start",
        description:
          "From signed offer letter to day-one on the employer's payroll. The traditional post-offer lag of 30+ days collapses because the cohort has already ramped on the employer's stack.",
      },
      {
        metric: "12mo",
        label: "Service bond",
        description:
          "Bond begins at conversion — not at training start. Early exit is pro-rated against the stipend already received, no clawbacks, no penalty. Refund terms are published in the agreement.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers & new graduates",
        description:
          "You have the aptitude but not the stack-specific experience hiring teams demand. Joining Terms documents exactly what you are signing — eligibility, fees, stipend, bond, conversion path — so you can evaluate the program before committing.",
        bullets: [
          "No prior work experience required — aptitude gate is the only filter",
          "No upfront tuition, no income-share agreement, no salary commission",
          "Monthly stipend covers living expenses during training",
          "Conversion terms written into the offer, not negotiated later",
        ],
        cta: "Read the eligibility gate",
      },
      {
        kicker: "For Employers",
        title: "Hiring teams sponsoring a cohort",
        description:
          "Sponsor a cohort on your stack and Joining Terms becomes your contract framework with the trainee cohort — eligibility, document compliance, bond, conversion gates, refund policy and code of conduct, all pre-written and audit-ready.",
        bullets: [
          "Pre-published eligibility + document checklist for compliance audit",
          "Training bond framework covering IP, NDA and conversion gates",
          "Code of conduct + attendance + performance metrics enforceable in writing",
          "Refund + early-exit terms that protect the trainee AND the sponsor",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "Eligibility gate", withStioos: "Aptitude + role-match, no degree gate", without: "CS degree + 2 years experience" },
      { feature: "Upfront cost", withStioos: "$0, employer-sponsored", without: "$8K-$20K out of pocket" },
      { feature: "Stipend", withStioos: "Monthly, paid on the 1st", without: "None — unpaid internship" },
      { feature: "Conversion terms", withStioos: "Written into the offer before signing", without: "Verbal promise, decided later" },
      { feature: "Refund policy", withStioos: "Pro-rated, no clawbacks", without: "No refund, clawback risk" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ trainees" },
      { name: "Fintech", hires: "260+ trainees" },
      { name: "Healthcare", hires: "180+ trainees" },
      { name: "Retail", hires: "210+ trainees" },
      { name: "Manufacturing", hires: "140+ trainees" },
      { name: "Education", hires: "110+ trainees" },
    ],
    guarantees: [
      {
        icon: "ListChecks",
        title: "Published document checklist",
        description:
          "Every required document is listed before you apply — government ID, education proof, address proof, bank account, PAN/equivalent, work authorization. No surprise requests mid-cohort.",
      },
      {
        icon: "Wallet",
        title: "No-salary-commission promise",
        description:
          "We never take a cut of your salary after placement. Tuition is sponsored upfront by the hiring employer or the STIOOS talent fund. No income-share agreement, ever.",
      },
      {
        icon: "Lock",
        title: "Bond starts at conversion",
        description:
          "The 12-month service bond begins the day you convert to full-time — not the day you start training. Early exit is pro-rated against the stipend received, no clawbacks.",
      },
      {
        icon: "Scale",
        title: "Refund policy in writing",
        description:
          "Exit before week 4 = you owe nothing. Exit after week 4 = stipend already paid is pro-rated against the bond. Refund terms are published in the service agreement, signed before onboarding.",
      },
    ],
    faqs: [
      {
        q: "Who is eligible to apply for a STIOOS talent program?",
        a: "The baseline is Class 12 / higher-secondary or equivalent, plus a 70/100 score on the AI-proctored aptitude screen (numerical, logical, verbal). Career switchers, self-taught learners and graduates from non-CS disciplines are routinely placed into engineering, data and product cohorts. Specific role tracks may have additional aptitude requirements — for example, a data engineering track may require a 75/100 on the numerical sub-score — but the baseline gate is published for every cohort before applications open.",
      },
      {
        q: "What documents do I need to submit before onboarding?",
        a: "Government-issued photo ID, education proof (Class 12 / degree certificate or equivalent), address proof, an active bank account in your name, PAN or local tax ID, and where relevant, work authorization for the cohort's hiring region. Every document is uploaded once into a secure, encrypted vault — you do not re-upload per cohort. A program manager reviews completeness within 24 hours and flags any missing items before you advance to the aptitude screen.",
      },
      {
        q: "How does the no-upfront-cost fee model actually work?",
        a: "Your tuition is sponsored upfront by the hiring employer whose stack the cohort is built around, or by the STIOOS talent fund for open cohorts flowing into our placement pool. You never pay an application fee, tuition, tooling fee or capstone review fee out of pocket. You receive a monthly stipend during training to cover living expenses. We never take a cut of your salary after placement and there is no income-share agreement — the sponsor pays STIOOS directly, not you.",
      },
      {
        q: "What is the training bond and when does it start?",
        a: "The training bond is a 12-month service commitment that begins the day you convert to full-time employment — NOT the day you start training. The bond covers IP assignment, NDA, and the conversion path. If you exit before the bond completes, the stipend already received during training is pro-rated against the remaining bond period — no clawback of salary, no early-exit penalty, no salary commission. The exact bond terms are published in the service agreement you sign before onboarding.",
      },
      {
        q: "What is the refund policy if I exit the program early?",
        a: "If you exit before week 4 of the training sprint, you owe nothing — no refund obligation, no clawback. If you exit after week 4, the stipend already paid to you is pro-rated against the remaining bond period. There is no separate early-exit penalty fee and no clawback of any salary you have earned. Refund terms are written into the service agreement, signed before onboarding, and audit-ready. Specific dollar amounts and pro-ration formulas are documented in the Pricing sub-page.",
      },
    ],
    ctaTitle: "Read the joining terms",
    ctaHighlight: "before you apply",
    ctaSubtitle:
      "Every eligibility gate, document, fee, stipend, bond clause, conversion path and refund term — published in writing before you sign. Drill into Curriculum, Pricing and Agreement for the full reference.",
  },

  // ─────────────────────────────────────────────────────────────
  // 8. LEARNING TERMS — main info page (Talent info pill #2)
  //    /talent-solutions/learning-terms
  //    Covers learning philosophy, external platforms, curriculum
  //    tracks, real-world working culture, execution framework,
  //    day-in-the-life, advanced patterns, mentorship, skill
  //    matrix, graduation criteria.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "learning-terms",
    name: "Learning Terms",
    heroTitle: "How learning works,",
    heroHighlight: "from day one to graduation",
    heroEyebrow: "For Job Seekers · Talent Solutions",
    heroSubtitle:
      "The full learning experience — learning philosophy, curated external platforms (YouTube, Udemy, Coursera), curriculum tracks, real-world working culture, weekly execution framework, day-in-the-life, advanced patterns, 1:1 mentorship, the skill matrix and the graduation criteria every trainee must hit before conversion.",
    heroStats: [
      { value: "200+", label: "Skill tracks" },
      { value: "12 wks", label: "Avg. sprint" },
      { value: "94%", label: "Job-readiness" },
      { value: "1:8", label: "Mentor ratio" },
    ],
    heroTags: [
      "External platform curation",
      "Real-world working culture",
      "Weekly execution framework",
      "Skill matrix + graduation criteria",
    ],
    heroGaugeValue: 88,
    heroGaugeLabel: "job-ready",
    heroKpis: [
      { label: "Time to ramp", before: "6 mo", after: "10 wks", unit: "wks" },
      { label: "Skill coverage", before: "40%", after: "92%", unit: "%" },
      { label: "Graduation criteria met", before: "55%", after: "94%", unit: "%" },
    ],
    heroBars: [
      { label: "Project readiness", before: "30", after: "94", unit: "%", max: 100 },
      { label: "Real-world culture fluency", before: "20", after: "88", unit: "%", max: 100 },
    ],
    heroQuote:
      "It wasn't a bootcamp. It was a real engineering team — standups, code reviews, production deploys, on-call. By graduation I'd already shipped to production 14 times.",
    heroQuoteAttribution: "— Arjun Mehta, Junior Full-Stack Engineer",
    overview: [
      "Learning Terms is the operating manual for what happens inside a STIOOS cohort — the philosophy that drives the curriculum, the external platforms we curate (YouTube, Udemy, Coursera, freeCodeCamp), the curriculum tracks and skill matrix, the real-world working culture you operate inside, the weekly execution framework that structures every sprint, a typical day-in-the-life, the advanced patterns senior engineers teach you, the 1:1 mentorship cadence, and the graduation criteria that gate conversion to full-time.",
      "The model is 'learn by working inside a real engineering team' — not 'watch lectures and do toy projects'. Every module is anchored to a deliverable shipped into a real repo with real code review. Every checkpoint is graded by an AI rubric aligned to the role scorecard. Every week ends with a sprint demo to a senior mentor. By graduation you have a verified portfolio of production-grade work, fluency in the employer's day-one workflow, and a skill matrix that maps every competency you have proven.",
    ],
    capabilities: [
      {
        icon: "Lightbulb",
        title: "Learning philosophy",
        description:
          "'Learn by working inside a real engineering team' — every module anchored to a deliverable, every checkpoint graded by an AI rubric, every week ending in a sprint demo. No lectures-only modules, no toy projects.",
      },
      {
        icon: "BookOpen",
        title: "Curated external platforms",
        description:
          "We curate the best free + paid resources from YouTube, Udemy, Coursera, freeCodeCamp and edX — mapped to each module. Trainees get a personalized playlist, not a generic syllabus, and discounted access to paid courses.",
      },
      {
        icon: "Workflow",
        title: "Weekly execution framework",
        description:
          "Every week ships with a published schedule — Monday kickoff, Tuesday-Thursday build, Friday demo + retrospective. The framework mirrors a real engineering team's cadence so trainees practice the workflow they'll use after conversion.",
      },
      {
        icon: "Users",
        title: "Real-world working culture",
        description:
          "Standups, code reviews, PRs, on-call rotations, sprint planning, ticketing, CI/CD, production deploys — the cohort operates as a real engineering team from week 1. By graduation the day-one workflow is muscle memory.",
      },
      {
        icon: "Headset",
        title: "1:1 senior mentorship",
        description:
          "A senior engineer mentor assigned to every 8 trainees. Weekly 1:1, async feedback on every PR, and a 24h-response SLA. Mentor upgrades if the SLA is missed twice in a sprint.",
      },
      {
        icon: "ListChecks",
        title: "Skill matrix + graduation criteria",
        description:
          "Every trainee gets a published skill matrix mapping 200+ competencies to interview-ready status. Graduation requires meeting the role scorecard's published criteria — not just attendance, but proven, demonstrated competency.",
      },
    ],
    process: [
      {
        title: "Week 1-2: Onboarding + foundation",
        duration: "Week 1-2",
        description:
          "Onboard into the cohort's stack, repo, CI/CD and ticketing. Foundation modules cover the role scorecard's must-have competencies. First sprint demo on Friday of week 1 — even if the deliverable is small.",
      },
      {
        title: "Week 3-6: Build + checkpoints",
        duration: "Week 3-6",
        description:
          "Build modules shipped into real repos with real code review. Weekly checkpoints graded by AI rubric, mapped to the skill matrix. Mentor 1:1 every week. Sprint demo every Friday.",
      },
      {
        title: "Week 7-10: Capstone + advanced patterns",
        duration: "Week 7-10",
        description:
          "Capstone project scoped against the hiring employer's roadmap. Senior engineers teach advanced patterns — system design, observability, on-call. Two portfolio pieces shipped before capstone.",
      },
      {
        title: "Week 11-12: Capstone review + graduation",
        duration: "Week 11-12",
        description:
          "Capstone review by the hiring employer. Skill matrix finalized. Graduation criteria checked. Conversion offer extended or placement into the curated pool begins.",
      },
    ],
    benefits: [
      {
        metric: "94%",
        label: "Job-readiness score",
        description:
          "Average skill-matrix score at graduation across the last 90 days of cohorts — benchmarked against the hiring employer's role scorecard. The traditional self-study path averages 40-55% at the same point.",
      },
      {
        metric: "12",
        label: "Production deploys before graduation",
        description:
          "Average number of production deployments a trainee ships during the sprint — into a real repo, reviewed by a senior engineer. That's the difference between 'I read about CI/CD' and 'I ship to prod every week'.",
      },
      {
        metric: "1:8",
        label: "Mentor ratio",
        description:
          "One senior engineer mentor per eight trainees — weekly 1:1, async PR feedback, 24h response SLA. Senior mentor upgrade if the SLA is missed twice in a sprint.",
      },
      {
        metric: "3",
        label: "Portfolio projects shipped",
        description:
          "Every graduate leaves with three production-grade capstone pieces in a verified portfolio — reviewable by any hiring employer with one click. Plus the skill matrix mapping 200+ proven competencies.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers & new graduates",
        description:
          "You have the aptitude but not the day-one workflow experience hiring teams demand. Learning Terms shows you exactly what the 12 weeks look like — philosophy, schedule, mentorship, culture, skill matrix — so you can decide if the model fits before you sign.",
        bullets: [
          "Real engineering team from week 1 — standups, PRs, on-call, prod deploys",
          "Curated YouTube/Udemy/Coursera playlists mapped to every module",
          "1:8 senior mentor ratio with 24h response SLA",
          "Skill matrix proving 200+ competencies by graduation",
        ],
        cta: "Read the learning philosophy",
      },
      {
        kicker: "For Employers",
        title: "Hiring teams sponsoring a cohort",
        description:
          "Sponsor a cohort on your stack and Learning Terms becomes your ramp playbook — curriculum tracks aligned to your role scorecard, real-world working culture mirroring your team's cadence, skill matrix benchmarked to your must-have competencies, graduation criteria you sign off on before the sprint starts.",
        bullets: [
          "Curriculum tracks aligned to your published role scorecard",
          "Working culture mirrors your team's standup/PR/on-call cadence",
          "Skill matrix benchmarked to your must-have competencies",
          "Graduation criteria signed off by you before the sprint starts",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "Learning model", withStioos: "Real engineering team, real repo, real prod", without: "Lectures + toy projects in sandbox" },
      { feature: "External resources", withStioos: "Curated YouTube/Udemy/Coursera playlists per module", without: "Generic syllabus, self-discovered resources" },
      { feature: "Mentor ratio", withStioos: "1:8 senior engineer, 24h SLA", without: "1:30 TA, async forum only" },
      { feature: "Production deploys", withStioos: "12+ before graduation", without: "0 — sandbox only" },
      { feature: "Graduation gate", withStioos: "Skill matrix + role scorecard, employer-signed", without: "Attendance + final exam" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ grads" },
      { name: "Fintech", hires: "260+ grads" },
      { name: "Healthcare", hires: "180+ grads" },
      { name: "Retail", hires: "210+ grads" },
      { name: "Manufacturing", hires: "140+ grads" },
      { name: "Education", hires: "110+ grads" },
    ],
    guarantees: [
      {
        icon: "Lightbulb",
        title: "Real-team learning guarantee",
        description:
          "Every module is anchored to a deliverable shipped into a real repo with real code review. If a module devolves into lectures-only with no production deliverable, the module is rebuilt before the next cohort runs.",
      },
      {
        icon: "BookOpen",
        title: "Curated external resources",
        description:
          "Every module ships with a curated playlist of the best free + paid resources from YouTube, Udemy, Coursera, freeCodeCamp and edX — mapped to the module's competencies. Paid course access is discounted for trainees.",
      },
      {
        icon: "Headset",
        title: "Mentor SLA",
        description:
          "A 24h-async / 48h-live response SLA on every mentor interaction. If the SLA is missed twice in a sprint, you get a senior mentor upgrade — no questions asked.",
      },
      {
        icon: "ListChecks",
        title: "Skill matrix graduation gate",
        description:
          "Graduation requires meeting the role scorecard's published skill matrix criteria — not just attendance. Every competency is graded by an AI rubric, benchmarked against the hiring employer's expectations, and audit-ready.",
      },
    ],
    faqs: [
      {
        q: "What is the learning philosophy at STIOOS?",
        a: "The philosophy is 'learn by working inside a real engineering team' — every module anchored to a deliverable shipped into a real repo with real code review, every checkpoint graded by an AI rubric aligned to the role scorecard, every week ending in a sprint demo to a senior mentor. There are no lectures-only modules and no toy projects in a sandbox. The cohort operates as a real engineering team from week 1 — standups, PRs, CI/CD, on-call rotations, production deploys — so the day-one workflow becomes muscle memory before conversion.",
      },
      {
        q: "Which external platforms do you curate resources from?",
        a: "We curate the best free and paid resources from YouTube (freeCodeCamp, Fireship, Theo, etc.), Udemy (paid courses at discounted rates for trainees), Coursera (specializations from Google, IBM, DeepLearning.AI, etc.), edX (university-grade courses), and freeCodeCamp (free interactive tracks). Every module ships with a curated playlist mapped to that module's competencies — trainees get a personalized playlist, not a generic syllabus. Paid course access is discounted where possible, and STIOOS-sponsored where not.",
      },
      {
        q: "What does a typical week look like during the sprint?",
        a: "Monday: sprint kickoff — review the week's deliverable, assign PRs, set checkpoint goals. Tuesday-Thursday: build — async work, mentor 1:1 on Wednesday, code review on every PR. Friday: sprint demo to senior mentor + retrospective. AI-scored checkpoint graded by end of Friday. The cadence mirrors a real engineering team's standup/PR/demo rhythm, so the workflow is practiced, not just learned. Average production deploys per trainee: 12+ before graduation.",
      },
      {
        q: "How does the 1:1 mentorship work?",
        a: "Every 8 trainees get one senior engineer mentor assigned for the duration of the sprint. You meet 1:1 weekly for 30 minutes — career coaching, technical deep-dives, code review walkthroughs. Async feedback on every PR you ship, with a 24-hour response SLA. If the SLA is missed twice in a sprint, you get a senior mentor upgrade — no questions asked. Mentors are practicing senior engineers, not full-time TAs.",
      },
      {
        q: "What are the graduation criteria?",
        a: "Graduation requires meeting the role scorecard's published skill matrix criteria — typically 200+ competencies graded as 'interview-ready' or above. Every competency is graded by an AI rubric aligned to the hiring employer's expectations, benchmarked weekly in the dashboard, and audit-ready. Graduation is NOT just attendance or a final exam — it's proven, demonstrated competency across the full matrix. The exact criteria are published in the Learning Curriculum sub-page and signed off by the hiring employer before the sprint starts.",
      },
    ],
    ctaTitle: "Read how learning works",
    ctaHighlight: "before you join",
    ctaSubtitle:
      "Every module, mentor cadence, working-culture ritual and graduation criterion — published before you sign. Drill into Self Learning, Curriculum and Projects Development for the full reference.",
  },

  // ─────────────────────────────────────────────────────────────
  // 9. JOINING TERMS / CURRICULUM
  //    /talent-solutions/joining-terms/curriculum
  //    Onboarding training curriculum, modules, weekly schedule,
  //    assessments, capstone project.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "joining-terms/curriculum",
    name: "Joining Curriculum",
    heroTitle: "What you'll learn during",
    heroHighlight: "the onboarding sprint",
    heroEyebrow: "Joining Terms · Curriculum",
    heroSubtitle:
      "The full onboarding curriculum — module breakdown, weekly schedule, AI-scored assessments, the capstone project you ship into a real repo, and the skill matrix checkpoints that gate conversion. Every module is anchored to a deliverable, graded by an AI rubric, and benchmarked against the hiring employer's role scorecard.",
    heroStats: [
      { value: "12", label: "Core modules" },
      { value: "10 wks", label: "Sprint length" },
      { value: "48", label: "AI checkpoints" },
      { value: "1", label: "Capstone" },
    ],
    heroTags: [
      "Module breakdown",
      "Weekly schedule",
      "AI-scored assessments",
      "Capstone + skill matrix",
    ],
    heroGaugeValue: 90,
    heroGaugeLabel: "curriculum-ready",
    heroKpis: [
      { label: "Modules completed", before: "0", after: "12", unit: "" },
      { label: "Checkpoints passed", before: "0", after: "48", unit: "" },
      { label: "Skill matrix coverage", before: "20%", after: "92%", unit: "%" },
    ],
    heroBars: [
      { label: "Capstone progress", before: "0", after: "100", unit: "%", max: 100 },
      { label: "Production deploys shipped", before: "0", after: "12", unit: "", max: 12 },
    ],
    heroQuote:
      "The curriculum wasn't theoretical. Every module ended in something I shipped — a PR, a deploy, a tested feature. By week 10 I'd built the same kind of work I now do as a full-time engineer.",
    heroQuoteAttribution: "— Iman Qureshi, Backend Engineer (cohort grad)",
    overview: [
      "Joining Curriculum is the module-by-module breakdown of what you learn during the 10-week onboarding sprint. Each module is anchored to a deliverable shipped into a real repo, graded by an AI rubric aligned to the role scorecard, and benchmarked against the hiring employer's must-have competencies. The 12 core modules cover foundation (week 1-2), build (week 3-6), capstone + advanced patterns (week 7-10), and a graduation review (week 11-12).",
      "Every week ships with a published schedule: Monday kickoff, Tuesday-Thursday build, Friday sprint demo + AI-scored checkpoint. The capstone project — scoped against the hiring employer's roadmap — runs through weeks 7-10 and is reviewed by the employer before conversion. The skill matrix is updated weekly so you always know exactly which competencies are interview-ready and which still need a sprint.",
    ],
    capabilities: [
      {
        icon: "BookOpen",
        title: "Foundation modules",
        description:
          "Week 1-2 covers the role scorecard's must-have foundation competencies — the stack basics, the repo conventions, the CI/CD workflow, the ticketing system. First sprint demo on Friday of week 1, even if the deliverable is small.",
      },
      {
        icon: "Code2",
        title: "Build modules",
        description:
          "Week 3-6 covers the build competencies — feature implementation, code review, testing, observability basics. Every PR is reviewed by a senior mentor. Two portfolio pieces shipped before the capstone begins.",
      },
      {
        icon: "Rocket",
        title: "Capstone module",
        description:
          "Week 7-10: capstone project scoped against the hiring employer's roadmap. Senior engineers teach advanced patterns — system design, on-call, observability. The capstone is reviewed by the employer before conversion.",
      },
      {
        icon: "ListChecks",
        title: "AI-scored assessments",
        description:
          "48 AI-scored checkpoints across the 12 modules — graded by a rubric aligned to the role scorecard, mapped to the skill matrix, benchmarked weekly. You see exactly which competencies are interview-ready and which need work.",
      },
      {
        icon: "Workflow",
        title: "Weekly schedule",
        description:
          "Every week ships with a published schedule: Monday kickoff, Tuesday-Thursday build, Wednesday mentor 1:1, Friday sprint demo + retrospective + AI checkpoint. The cadence mirrors a real engineering team.",
      },
      {
        icon: "ClipboardCheck",
        title: "Skill matrix checkpoints",
        description:
          "Every module updates your skill matrix — 200+ competencies mapped to interview-ready status. Graduation requires meeting the role scorecard's published criteria, not just attendance. Audit-ready.",
      },
    ],
    process: [
      {
        title: "Week 1-2: Foundation",
        duration: "2 weeks",
        description:
          "Onboard into the cohort's stack, repo, CI/CD and ticketing. Foundation modules cover the role scorecard's must-have competencies. First sprint demo on Friday of week 1. Two AI checkpoints per module.",
      },
      {
        title: "Week 3-6: Build",
        duration: "4 weeks",
        description:
          "Build modules shipped into real repos with real code review. Feature implementation, testing, observability basics. Two portfolio pieces shipped before the capstone. Weekly mentor 1:1 + AI checkpoints.",
      },
      {
        title: "Week 7-10: Capstone + advanced",
        duration: "4 weeks",
        description:
          "Capstone project scoped against the hiring employer's roadmap. Senior engineers teach advanced patterns — system design, on-call, observability. Two more portfolio pieces. Weekly demo + AI checkpoint.",
      },
      {
        title: "Week 11-12: Review + graduation",
        duration: "2 weeks",
        description:
          "Capstone review by the hiring employer. Skill matrix finalized. Graduation criteria checked against the role scorecard. Conversion offer extended or placement into the curated pool begins.",
      },
    ],
    benefits: [
      {
        metric: "12",
        label: "Core modules",
        description:
          "12 anchor modules covering foundation, build, capstone and advanced patterns — every one anchored to a deliverable shipped into a real repo with real code review.",
      },
      {
        metric: "48",
        label: "AI-scored checkpoints",
        description:
          "48 AI-scored checkpoints across the 12 modules — graded by a rubric aligned to the role scorecard, mapped to the skill matrix, benchmarked weekly. You always know your interview-readiness.",
      },
      {
        metric: "3",
        label: "Portfolio projects",
        description:
          "Three production-grade portfolio pieces shipped by graduation — the capstone plus two build-sprint deliverables. All reviewable by any hiring employer with one click.",
      },
      {
        metric: "200+",
        label: "Skill matrix competencies",
        description:
          "Every module updates a 200+ competency skill matrix mapped to interview-ready status. Graduation requires meeting the role scorecard's published criteria — proven competency, not attendance.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers evaluating the curriculum",
        description:
          "You want to know exactly what you'll learn before you commit 10 weeks. Joining Curriculum documents every module, every checkpoint, every deliverable — so you can decide if the curriculum builds the competencies your target role demands.",
        bullets: [
          "12 modules anchored to real-repo deliverables",
          "48 AI-scored checkpoints mapped to a 200+ competency skill matrix",
          "Capstone scoped against the hiring employer's roadmap",
          "Three production-grade portfolio pieces by graduation",
        ],
        cta: "Read the module breakdown",
      },
      {
        kicker: "For Employers",
        title: "Hiring teams sponsoring a cohort",
        description:
          "Sponsor a cohort and the curriculum is aligned to your published role scorecard — modules map to your must-have competencies, the capstone is scoped against your roadmap, the skill matrix is benchmarked to your role expectations. You sign off on the curriculum before the sprint starts.",
        bullets: [
          "Modules aligned to your published role scorecard",
          "Capstone scoped against your team's roadmap",
          "Skill matrix benchmarked to your must-have competencies",
          "Curriculum signed off by you before the sprint starts",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "Module anchoring", withStioos: "Real-repo deliverable per module", without: "Toy project in sandbox" },
      { feature: "Assessments", withStioos: "48 AI-scored checkpoints, rubric-aligned", without: "2 exams, attendance-based" },
      { feature: "Capstone", withStioos: "Employer-roadmap scoped, employer-reviewed", without: "Generic capstone, instructor-reviewed" },
      { feature: "Skill matrix", withStioos: "200+ competencies, weekly benchmarked", without: "None — pass/fail only" },
      { feature: "Portfolio output", withStioos: "3 production-grade pieces", without: "1 toy project" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ grads" },
      { name: "Fintech", hires: "260+ grads" },
      { name: "Healthcare", hires: "180+ grads" },
      { name: "Retail", hires: "210+ grads" },
      { name: "Manufacturing", hires: "140+ grads" },
      { name: "Education", hires: "110+ grads" },
    ],
    guarantees: [
      {
        icon: "BookOpen",
        title: "Module deliverable guarantee",
        description:
          "Every module is anchored to a deliverable shipped into a real repo with real code review. If a module devolves into lectures-only with no production deliverable, the module is rebuilt before the next cohort runs.",
      },
      {
        icon: "ListChecks",
        title: "AI-rubric assessment guarantee",
        description:
          "48 AI-scored checkpoints graded by a rubric aligned to the role scorecard. Every checkpoint is benchmarked weekly in the dashboard, mapped to the skill matrix, and audit-ready. No grade inflation.",
      },
      {
        icon: "Rocket",
        title: "Capstone review guarantee",
        description:
          "The capstone is scoped against the hiring employer's roadmap and reviewed by the employer before conversion. If the capstone does not meet the review bar, you get an additional 4-week capstone polish sprint at no cost.",
      },
      {
        icon: "ClipboardCheck",
        title: "Skill matrix graduation gate",
        description:
          "Graduation requires meeting the role scorecard's published skill matrix criteria — 200+ competencies graded as interview-ready. The matrix is benchmarked weekly, audit-ready, and signed off by the hiring employer.",
      },
    ],
    faqs: [
      {
        q: "How many modules are in the onboarding curriculum?",
        a: "12 core modules spread across the 10-week sprint. Weeks 1-2 cover foundation (the role scorecard's must-have competencies — stack basics, repo conventions, CI/CD workflow, ticketing). Weeks 3-6 cover build (feature implementation, code review, testing, observability). Weeks 7-10 cover capstone + advanced patterns. Weeks 11-12 are capstone review + graduation. Every module is anchored to a deliverable shipped into a real repo.",
      },
      {
        q: "How are assessments scored?",
        a: "48 AI-scored checkpoints across the 12 modules — typically 4 per module. Each checkpoint is graded by an AI rubric aligned to the role scorecard's competencies. Every grade is mapped to the 200+ competency skill matrix and benchmarked weekly in the dashboard. You always know exactly which competencies are interview-ready and which still need a sprint. No grade inflation — the rubric is the rubric.",
      },
      {
        q: "What is the capstone project?",
        a: "The capstone is a production-grade project scoped against the hiring employer's actual roadmap — not a toy project, not a generic capstone. It runs through weeks 7-10. The deliverable is shipped into a real repo with real code review, deployed to a real environment, and reviewed by the hiring employer before conversion. Past capstones have shipped as real features in the employer's product.",
      },
      {
        q: "Can I see the full module list before joining?",
        a: "Yes. The full module list, with deliverables, AI checkpoints, mapped competencies and weekly schedule, is published for every cohort before applications open. The hiring employer signs off on the curriculum before the sprint starts. You will never join a cohort and discover the curriculum is different from what was published.",
      },
      {
        q: "What happens if I fail a checkpoint?",
        a: "AI checkpoints are scored against the role scorecard rubric. If you score below the interview-ready bar on a competency, the mentor assigns a focused sprint for that competency in the following week — typically a targeted exercise or a PR refactor. You do not get kicked out for a failed checkpoint. Graduation requires meeting the role scorecard's published skill matrix criteria across all 200+ competencies; the focused-sprint model is how we get you there.",
      },
    ],
    ctaTitle: "Read the joining curriculum",
    ctaHighlight: "module by module",
    ctaSubtitle:
      "12 modules, 48 AI-scored checkpoints, 1 capstone scoped against the employer's roadmap. Every module anchored to a deliverable you ship into a real repo.",
  },

  // ─────────────────────────────────────────────────────────────
  // 10. JOINING TERMS / PRICING
  //     /talent-solutions/joining-terms/pricing
  //     Fee structure, stipend schedule, payment plans, refunds.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "joining-terms/pricing",
    name: "Joining Pricing",
    heroTitle: "Fees, stipends, and",
    heroHighlight: "payment terms in writing",
    heroEyebrow: "Joining Terms · Pricing",
    heroSubtitle:
      "The full pricing reference — the no-upfront-cost fee model, monthly stipend schedule, payment plans for sponsor-funded cohorts, refund policy with pro-ration formulas, and the no-salary-commission promise that holds for every cohort. Every dollar is published before you sign.",
    heroStats: [
      { value: "$0", label: "Upfront cost" },
      { value: "Monthly", label: "Stipend paid" },
      { value: "0%", label: "Salary commission" },
      { value: "Pro-rated", label: "Refund policy" },
    ],
    heroTags: [
      "Fee structure",
      "Stipend schedule",
      "Payment plans",
      "Refund policy",
    ],
    heroGaugeValue: 95,
    heroGaugeLabel: "transparency",
    heroKpis: [
      { label: "Application fee", before: "$50-$200", after: "$0", unit: "" },
      { label: "Tuition", before: "$8K-$20K", after: "$0", unit: "" },
      { label: "Salary commission", before: "10-20%", after: "0%", unit: "%" },
    ],
    heroBars: [
      { label: "Cost transparency", before: "30", after: "100", unit: "%", max: 100 },
      { label: "Refund fairness", before: "20", after: "98", unit: "%", max: 100 },
    ],
    heroQuote:
      "I'd been burned by an income-share agreement before. STIOOS was the first program where every fee, every stipend, every refund term was published in writing before I signed — and $0 came out of my pocket.",
    heroQuoteAttribution: "— Priya Raman, Software Engineer (converted from trainee)",
    overview: [
      "Joining Pricing documents every dollar that flows in or out of a cohort — the no-upfront-cost fee model (how tuition is sponsored by the hiring employer or the STIOOS talent fund), the monthly stipend schedule (paid on the 1st of every month with a published payslip), payment plans for sponsor-funded cohorts (net-30 / net-60 invoice terms), the refund policy (pro-rated against the bond, no clawbacks, no early-exit penalty), and the no-salary-commission promise (we never take a cut of your salary after placement).",
      "Every dollar is published before you sign — no surprise fees mid-cohort, no fine print discovered at conversion, no income-share agreement. The same pricing model applies whether you join a sponsored cohort tied to a specific hiring employer or an open cohort flowing into our placement pool. This is the full reference for the financial side of joining; the Agreement sub-page covers the contract side.",
    ],
    capabilities: [
      {
        icon: "Wallet",
        title: "No-upfront-cost fee model",
        description:
          "Tuition is sponsored upfront by the hiring employer whose stack the cohort is built around, or by the STIOOS talent fund for open cohorts. Zero application fee, zero tuition, zero tooling fee, zero capstone review fee — you never pay out of pocket.",
      },
      {
        icon: "Receipt",
        title: "Monthly stipend schedule",
        description:
          "Trainees receive a monthly stipend that covers living expenses during the training sprint — paid on the 1st of every month by direct deposit, with a published payslip and tax statement. Stipend amount is published per cohort before you sign.",
      },
      {
        icon: "FileText",
        title: "Payment plans for sponsors",
        description:
          "Cohort sponsors (hiring employers) can choose net-30 or net-60 invoice terms, milestone-based payments (kickoff / mid-sprint / capstone-review), or a deferred-conversion plan that pays only on conversion. Every plan is published in the sponsor agreement.",
      },
      {
        icon: "RefreshCw",
        title: "Refund policy",
        description:
          "Exit before week 4 = you owe nothing. Exit after week 4 = stipend already paid is pro-rated against the remaining bond. No clawbacks, no early-exit penalty, no salary commission. Refund terms are written into the service agreement before onboarding.",
      },
      {
        icon: "Scale",
        title: "No-salary-commission promise",
        description:
          "We never take a cut of your salary after placement. No income-share agreement, ever. Tuition is sponsored upfront by the hiring employer or the STIOOS talent fund — the sponsor pays STIOOS directly, not you.",
      },
      {
        icon: "ListChecks",
        title: "Published payslips",
        description:
          "Every stipend payment ships with a published payslip and tax statement, downloadable from your trainee dashboard. Every sponsor invoice ships with a published line-item breakdown — no black-box billing, ever.",
      },
    ],
    process: [
      {
        title: "Read the pricing before you apply",
        duration: "Pre-application",
        description:
          "The full fee model, stipend schedule, refund policy and no-salary-commission promise are published on this page before you apply. No surprise fees mid-cohort. No fine print at conversion.",
      },
      {
        title: "Sign the financial agreement",
        duration: "Week 0",
        description:
          "Review the financial agreement (stipend schedule, refund terms, no-commission promise) with a program manager. Sign electronically. The agreement is audit-ready and identical to what's published on this page.",
      },
      {
        title: "Receive stipend monthly",
        duration: "Week 1-10",
        description:
          "Stipend paid on the 1st of every month by direct deposit. Payslip and tax statement downloadable from your trainee dashboard. Stipend continues through the training sprint.",
      },
      {
        title: "Convert with no salary commission",
        duration: "Conversion",
        description:
          "On conversion to full-time, your salary is yours — STIOOS takes 0%. The sponsor pays STIOOS directly for the cohort tuition (already paid before the sprint started). No income-share agreement, ever.",
      },
    ],
    benefits: [
      {
        metric: "$0",
        label: "Upfront cost",
        description:
          "Zero application fee, zero tuition, zero tooling fee, zero capstone review fee. You never pay out of pocket. Tuition is sponsored upfront by the hiring employer or the STIOOS talent fund.",
      },
      {
        metric: "0%",
        label: "Salary commission",
        description:
          "We never take a cut of your salary after placement. No income-share agreement, ever. The sponsor pays STIOOS directly for the cohort tuition — not you.",
      },
      {
        metric: "100%",
        label: "Refund fairness",
        description:
          "Exit before week 4 = you owe nothing. Exit after week 4 = stipend pro-rated against remaining bond, no clawbacks, no early-exit penalty. Refund terms published in writing before onboarding.",
      },
      {
        metric: "12",
        label: "Published payslips",
        description:
          "Every stipend payment ships with a downloadable payslip and tax statement. Every sponsor invoice ships with a published line-item breakdown. No black-box billing, ever.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers evaluating the cost",
        description:
          "You want to know exactly what joining costs before you commit — and you've probably been burned by income-share agreements or surprise fees before. Joining Pricing publishes every dollar in writing before you sign: $0 upfront, monthly stipend, 0% salary commission, pro-rated refund.",
        bullets: [
          "$0 upfront — no application, tuition, tooling or capstone review fee",
          "Monthly stipend paid on the 1st, with published payslip + tax statement",
          "0% salary commission — no income-share agreement, ever",
          "Pro-rated refund if you exit early — no clawbacks, no penalty",
        ],
        cta: "Read the fee structure",
      },
      {
        kicker: "For Employers",
        title: "Sponsors funding a cohort",
        description:
          "Sponsor a cohort and the pricing is transparent from day one — published tuition, net-30/net-60 invoice terms, milestone-based payment plans, deferred-conversion options. Every invoice ships with a line-item breakdown. No black-box billing, no surprise add-ons.",
        bullets: [
          "Net-30 / net-60 invoice terms, or milestone-based payments",
          "Deferred-conversion plan: pay only on conversion (premium pricing)",
          "Line-item invoices published for every payment",
          "Tuition funded upfront — trainees never pay out of pocket",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "Application fee", withStioos: "$0", without: "$50-$200 non-refundable" },
      { feature: "Tuition", withStioos: "$0 (sponsor-funded)", without: "$8K-$20K out of pocket" },
      { feature: "Stipend", withStioos: "Monthly, paid on the 1st", without: "None — unpaid internship" },
      { feature: "Salary commission", withStioos: "0%, no ISA", without: "10-20% for 2-5 years via ISA" },
      { feature: "Refund policy", withStioos: "Pro-rated, no clawbacks", without: "No refund, clawback risk" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ trainees" },
      { name: "Fintech", hires: "260+ trainees" },
      { name: "Healthcare", hires: "180+ trainees" },
      { name: "Retail", hires: "210+ trainees" },
      { name: "Manufacturing", hires: "140+ trainees" },
      { name: "Education", hires: "110+ trainees" },
    ],
    guarantees: [
      {
        icon: "Wallet",
        title: "$0 upfront guarantee",
        description:
          "Zero application fee, zero tuition, zero tooling fee, zero capstone review fee. If anyone asks you to pay out of pocket during the cohort, that's a contract breach — report it and we'll refund + escalate.",
      },
      {
        icon: "Receipt",
        title: "Stipend on-time guarantee",
        description:
          "Stipend paid on the 1st of every month by direct deposit. If a payment is late by more than 3 business days, you receive an additional 5% of the monthly stipend as a late-payment credit, no questions asked.",
      },
      {
        icon: "Scale",
        title: "No-salary-commission guarantee",
        description:
          "We never take a cut of your salary after placement. No income-share agreement, ever. This is written into the service agreement you sign before onboarding — audit-ready and enforceable.",
      },
      {
        icon: "RefreshCw",
        title: "Refund-as-published guarantee",
        description:
          "Refund terms are exactly what's published on this page — exit before week 4 = you owe nothing; exit after week 4 = stipend pro-rated against remaining bond. No clawbacks, no early-exit penalty, no fine print.",
      },
    ],
    faqs: [
      {
        q: "How much does it cost to join a STIOOS talent program?",
        a: "$0 upfront. Zero application fee, zero tuition, zero tooling fee, zero capstone review fee. Tuition is sponsored upfront by the hiring employer whose stack the cohort is built around, or by the STIOOS talent fund for open cohorts flowing into our placement pool. You receive a monthly stipend during training to cover living expenses. We never take a cut of your salary after placement and there is no income-share agreement. The sponsor pays STIOOS directly — not you.",
      },
      {
        q: "How much is the monthly stipend?",
        a: "The stipend amount is published per cohort before applications open — it varies by region, role track and the cohort's hiring employer. It is designed to cover living expenses during the training sprint, not to be a market-rate salary. Stipend is paid on the 1st of every month by direct deposit, with a published payslip and tax statement downloadable from your trainee dashboard. If a payment is late by more than 3 business days, you receive an additional 5% as a late-payment credit.",
      },
      {
        q: "What is the refund policy if I exit the program early?",
        a: "If you exit before week 4 of the training sprint, you owe nothing — no refund obligation, no clawback. If you exit after week 4, the stipend already paid to you is pro-rated against the remaining bond period (the bond begins at conversion, not at training start). There is no separate early-exit penalty fee and no clawback of any salary you have earned. The exact pro-ration formula is published in the service agreement you sign before onboarding.",
      },
      {
        q: "Do you take a commission from my salary after placement?",
        a: "No. Zero percent. No income-share agreement, ever. This is written into the service agreement you sign before onboarding, audit-ready and enforceable. Tuition is sponsored upfront by the hiring employer or the STIOOS talent fund — the sponsor pays STIOOS directly, not you. Your post-placement salary is yours.",
      },
      {
        q: "How do sponsor-funded payment plans work for employers?",
        a: "Cohort sponsors (hiring employers) can choose from three published payment plans: net-30 invoice terms (default), net-60 invoice terms (extended), or milestone-based payments (kickoff / mid-sprint / capstone-review). A fourth option — deferred-conversion plan — pays only on conversion, at a premium price. Every invoice ships with a published line-item breakdown. Tuition is funded upfront by the sponsor, so trainees never pay out of pocket regardless of which plan the sponsor chooses.",
      },
    ],
    ctaTitle: "Read every dollar",
    ctaHighlight: "before you sign",
    ctaSubtitle:
      "$0 upfront, monthly stipend, 0% salary commission, pro-rated refund. Every fee, every stipend, every refund term — published in writing before you sign.",
  },

  // ─────────────────────────────────────────────────────────────
  // 11. JOINING TERMS / AGREEMENT
  //     /talent-solutions/joining-terms/agreement
  //     Service agreement, bond period, conversion terms,
  //     termination clauses, contract framework.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "joining-terms/agreement",
    name: "Joining Agreement",
    heroTitle: "Contract terms and",
    heroHighlight: "the conversion path",
    heroEyebrow: "Joining Terms · Agreement",
    heroSubtitle:
      "The full contract framework — the service agreement structure, the 12-month training bond that begins at conversion (not at training start), conversion-to-hire terms and gates, termination clauses for both sides, IP assignment, NDA and the code of conduct every trainee signs. Every clause is published in writing before you sign.",
    heroStats: [
      { value: "12 mo", label: "Bond at conversion" },
      { value: "96%", label: "Conversion rate" },
      { value: "0", label: "Clawback clauses" },
      { value: "Audit-ready", label: "Contract" },
    ],
    heroTags: [
      "Service agreement",
      "Training bond at conversion",
      "Conversion-to-hire terms",
      "Termination + IP + NDA",
    ],
    heroGaugeValue: 94,
    heroGaugeLabel: "audit-ready",
    heroKpis: [
      { label: "Bond start", before: "Training day 1", after: "Conversion day 1", unit: "" },
      { label: "Conversion gates", before: "Verbal", after: "Published", unit: "" },
      { label: "Termination notice", before: "0 days", after: "30 days", unit: "d" },
    ],
    heroBars: [
      { label: "Contract clarity", before: "30", after: "98", unit: "%", max: 100 },
      { label: "Trainee protection", before: "20", after: "96", unit: "%", max: 100 },
    ],
    heroQuote:
      "The contract was the cleanest I've ever signed. Bond started at conversion, not training. Conversion gates were published in writing. Termination required 30 days notice from either side. No clawbacks, no fine print.",
    heroQuoteAttribution: "— Arjun Mehta, Full-Stack Engineer (converted from trainee)",
    overview: [
      "Joining Agreement is the contract framework every trainee signs before onboarding. It documents the service agreement structure (financial terms, stipend schedule, refund policy — cross-referenced from the Pricing sub-page), the 12-month training bond that begins the day you convert to full-time (NOT the day you start training), the conversion-to-hire terms and gates (capstone review + skill matrix + attendance + performance metrics, all published), termination clauses for both sides (30-day notice, no clawbacks), IP assignment (work produced during the sprint belongs to the hiring employer), NDA (mutual), and the code of conduct every trainee signs.",
      "Every clause is published in writing before you sign — no verbal commitments, no fine print discovered mid-cohort, no surprises at conversion. The same agreement applies whether you join a sponsored cohort tied to a specific hiring employer or an open cohort flowing into our placement pool. This is the contract reference; the Pricing sub-page covers the financial side.",
    ],
    capabilities: [
      {
        icon: "FileText",
        title: "Service agreement structure",
        description:
          "The full service agreement — financial terms, stipend schedule, refund policy, training bond, conversion gates, termination clauses, IP, NDA, code of conduct. Audit-ready, e-signed before onboarding, identical to what's published on this page.",
      },
      {
        icon: "Lock",
        title: "12-month training bond",
        description:
          "Bond begins the day you convert to full-time — NOT the day you start training. If you exit before the bond completes, the stipend already received is pro-rated against the remaining bond. No clawback of salary, no early-exit penalty.",
      },
      {
        icon: "ClipboardCheck",
        title: "Conversion-to-hire gates",
        description:
          "Conversion requires: capstone review by the hiring employer, skill matrix meeting the role scorecard, attendance ≥ 85%, performance metrics ≥ target. Every gate is published in writing before the sprint starts.",
      },
      {
        icon: "RefreshCw",
        title: "Termination clauses (both sides)",
        description:
          "Either side can terminate with 30 days written notice. Trainee termination: pro-rated refund per the Pricing sub-page. Employer termination: trainee flows into the curated placement pool — no penalty to the trainee.",
      },
      {
        icon: "Shield",
        title: "IP assignment + NDA",
        description:
          "Work produced during the sprint belongs to the hiring employer (since they sponsored the cohort). Mutual NDA covering the employer's code, data and roadmap. IP + NDA clauses are standard, audit-ready, and reviewed by counsel.",
      },
      {
        icon: "Scale",
        title: "Code of conduct",
        description:
          "Every trainee signs a code of conduct covering professional behavior, anti-harassment, anti-plagiarism (no copy-paste from AI without citation), and the mentor SLA. Violations are reviewed by a program manager and a senior mentor; serious violations can terminate the agreement.",
      },
    ],
    process: [
      {
        title: "Read the agreement before signing",
        duration: "Pre-onboarding",
        description:
          "The full service agreement is published on this page before you sign. Read it, ask questions, take it to counsel if you want. Every clause is audit-ready and identical to what you'll sign.",
      },
      {
        title: "Sign electronically",
        duration: "Week 0",
        description:
          "Review the agreement with a program manager. E-sign the service agreement, training bond, IP assignment, NDA and code of conduct. Audit-ready copies stored in your trainee dashboard.",
      },
      {
        title: "Train under the agreement",
        duration: "Week 1-10",
        description:
          "Stipend paid per the agreement. Capstone, skill matrix, attendance and performance tracked per the published conversion gates. Mentor SLA enforced per the code of conduct.",
      },
      {
        title: "Convert under the agreement",
        duration: "Conversion",
        description:
          "Meet the published conversion gates. Bond begins at conversion. 30-day termination notice from either side. Salary is yours — 0% commission, no clawback, no ISA.",
      },
    ],
    benefits: [
      {
        metric: "12 mo",
        label: "Bond at conversion",
        description:
          "Bond begins the day you convert to full-time — not the day you start training. If you exit before the bond completes, stipend already received is pro-rated against the remaining bond. No clawback of salary.",
      },
      {
        metric: "30 d",
        label: "Termination notice",
        description:
          "Either side can terminate with 30 days written notice. No at-will termination, no surprise exits. Trainee termination: pro-rated refund. Employer termination: trainee flows into the placement pool — no penalty.",
      },
      {
        metric: "4",
        label: "Published conversion gates",
        description:
          "Conversion requires meeting four published gates: capstone review, skill matrix, attendance ≥ 85%, performance metrics ≥ target. Every gate is benchmarked weekly in the dashboard — no surprise failures at graduation.",
      },
      {
        metric: "0",
        label: "Clawback clauses",
        description:
          "Zero clawback clauses in the agreement. No clawback of stipend, no clawback of salary, no early-exit penalty. Refund policy is pro-ration only — published in the Pricing sub-page.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers evaluating the contract",
        description:
          "You want to know exactly what you're signing before you commit — bond length, conversion gates, termination clauses, IP, NDA. Joining Agreement publishes every clause in writing before you sign. Bond starts at conversion. 30-day termination notice from either side. Zero clawbacks.",
        bullets: [
          "12-month bond begins at conversion — not at training start",
          "4 published conversion gates (capstone, skill matrix, attendance, performance)",
          "30-day termination notice from either side — no at-will exits",
          "Zero clawback clauses — refund is pro-ration only",
        ],
        cta: "Read the contract framework",
      },
      {
        kicker: "For Employers",
        title: "Sponsors funding a cohort",
        description:
          "Sponsor a cohort and the agreement framework is pre-written — IP assignment, NDA, bond, conversion gates, termination clauses, code of conduct. Every clause is audit-ready, counsel-reviewed, and enforceable. No contract negotiation per cohort — the framework is published.",
        bullets: [
          "IP assignment: sprint work belongs to the sponsor",
          "Mutual NDA covering your code, data and roadmap",
          "Bond framework covering 12-month post-conversion service",
          "Code of conduct enforceable in writing",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "Bond start", withStioos: "Conversion day 1", without: "Training day 1" },
      { feature: "Conversion gates", withStioos: "4 published, benchmarked weekly", without: "Verbal, decided at graduation" },
      { feature: "Termination", withStioos: "30-day notice, both sides", without: "At-will, employer only" },
      { feature: "Clawbacks", withStioos: "Zero — pro-ration only", without: "Salary clawback risk" },
      { feature: "IP + NDA", withStioos: "Standard, counsel-reviewed", without: "Aggressive, one-sided" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ trainees" },
      { name: "Fintech", hires: "260+ trainees" },
      { name: "Healthcare", hires: "180+ trainees" },
      { name: "Retail", hires: "210+ trainees" },
      { name: "Manufacturing", hires: "140+ trainees" },
      { name: "Education", hires: "110+ trainees" },
    ],
    guarantees: [
      {
        icon: "Lock",
        title: "Bond-at-conversion guarantee",
        description:
          "The 12-month service bond begins the day you convert to full-time employment — NOT the day you start training. This is written into the service agreement, audit-ready, and enforceable. No bond obligation during training.",
      },
      {
        icon: "ClipboardCheck",
        title: "Published conversion gates",
        description:
          "Conversion requires meeting four published gates — capstone review, skill matrix, attendance ≥ 85%, performance metrics ≥ target. Every gate is benchmarked weekly in the dashboard. No surprise failures at graduation.",
      },
      {
        icon: "RefreshCw",
        title: "30-day termination guarantee",
        description:
          "Either side can terminate the agreement with 30 days written notice. No at-will termination, no surprise exits. Trainee termination: pro-rated refund. Employer termination: trainee flows into the placement pool, no penalty.",
      },
      {
        icon: "Scale",
        title: "Zero-clawback guarantee",
        description:
          "Zero clawback clauses in the agreement. No clawback of stipend, no clawback of salary, no early-exit penalty. Refund policy is pro-ration only, published in the Pricing sub-page and written into the agreement.",
      },
    ],
    faqs: [
      {
        q: "When does the training bond begin?",
        a: "The 12-month service bond begins the day you convert to full-time employment — NOT the day you start training. This is written into the service agreement you sign before onboarding. During the training sprint (weeks 1-10), there is no bond obligation. If you exit during training, only the pro-ration formula in the Pricing sub-page applies — no bond penalty, no clawback.",
      },
      {
        q: "What are the conversion-to-hire gates?",
        a: "Four published gates: (1) capstone review by the hiring employer — the capstone must meet the employer's review bar; (2) skill matrix meeting the role scorecard's published criteria — typically 200+ competencies graded interview-ready; (3) attendance ≥ 85% across the sprint; (4) performance metrics ≥ target, benchmarked weekly. Every gate is published before the sprint starts and tracked weekly in the dashboard. No surprise failures at graduation.",
      },
      {
        q: "What are the termination clauses?",
        a: "Either side can terminate the agreement with 30 days written notice. Trainee termination: pro-rated refund per the Pricing sub-page (exit before week 4 = you owe nothing; exit after week 4 = stipend pro-rated against remaining bond). Employer termination: the trainee flows into the curated placement pool — no penalty to the trainee, no clawback of stipend received. No at-will termination, no surprise exits.",
      },
      {
        q: "Who owns the IP of work I produce during the sprint?",
        a: "Work produced during the sprint belongs to the hiring employer sponsoring the cohort — since they paid for the curriculum and the capstone is scoped against their roadmap. This is standard, counsel-reviewed, and written into the service agreement. You retain the right to list the work in your portfolio (with the employer's permission, usually granted). For open cohorts (no specific sponsor), IP is retained by STIOOS until placement, then assigned to the placement employer.",
      },
      {
        q: "Is there a non-compete clause?",
        a: "No non-compete. The agreement includes a mutual NDA covering the employer's code, data and roadmap (standard, counsel-reviewed, 2-year term post-conversion). There is no non-compete clause preventing you from working for competitors after the bond completes. The NDA is mutual — the employer is also bound not to disclose your personal information, performance reviews or capstone work to outside parties.",
      },
    ],
    ctaTitle: "Read the contract",
    ctaHighlight: "before you sign",
    ctaSubtitle:
      "Bond at conversion, 4 published conversion gates, 30-day termination notice, zero clawbacks. Every clause audit-ready and published before you sign.",
  },

  // ─────────────────────────────────────────────────────────────
  // 12. LEARNING TERMS / SELF-LEARNING
  //     /talent-solutions/learning-terms/self-learning
  //     YouTube, Udemy, Coursera, study schedules,
  //     self-assessment.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "learning-terms/self-learning",
    name: "Self Learning",
    heroTitle: "External platform resources,",
    heroHighlight: "curated and structured",
    heroEyebrow: "Learning Terms · Self Learning",
    heroSubtitle:
      "Curated YouTube, Udemy, Coursera, freeCodeCamp and edX resources mapped to every module — plus weekly self-study schedules, AI-scored self-assessments and progress tracking. Trainees get a personalized playlist, not a generic syllabus, with discounted access to paid courses where needed.",
    heroStats: [
      { value: "5+", label: "Platforms curated" },
      { value: "120+", label: "Resources mapped" },
      { value: "Weekly", label: "Self-study schedule" },
      { value: "AI", label: "Self-assessment" },
    ],
    heroTags: [
      "YouTube + Udemy + Coursera",
      "freeCodeCamp + edX",
      "Weekly self-study schedule",
      "AI-scored self-assessment",
    ],
    heroGaugeValue: 86,
    heroGaugeLabel: "self-paced",
    heroKpis: [
      { label: "Resource coverage", before: "0", after: "120+", unit: "+" },
      { label: "Self-assessment score", before: "40%", after: "88%", unit: "%" },
      { label: "Platform fluency", before: "1", after: "5", unit: "" },
    ],
    heroBars: [
      { label: "Self-study hours / week", before: "0", after: "10", unit: "h", max: 10 },
      { label: "Self-assessment pass rate", before: "30", after: "92", unit: "%", max: 100 },
    ],
    heroQuote:
      "The curated playlists saved me hundreds of hours of YouTube rabbit-holing. Every video mapped to a module, every course paid for by the program. I knew exactly what to study and when.",
    heroQuoteAttribution: "— Sneha Patel, Data Analyst (cohort grad)",
    overview: [
      "Self Learning documents the external-platform side of the cohort experience. We curate the best free and paid resources from YouTube (freeCodeCamp, Fireship, Theo, etc.), Udemy (paid courses at discounted rates for trainees), Coursera (specializations from Google, IBM, DeepLearning.AI, etc.), freeCodeCamp (free interactive tracks) and edX (university-grade courses). Every resource is mapped to a specific module's competencies — trainees get a personalized playlist, not a generic syllabus.",
      "Plus weekly self-study schedules (10 hours/week outside the live cohort cadence), AI-scored self-assessments mapped to the skill matrix, and progress tracking in the dashboard. Paid course access is discounted where possible and STIOOS-sponsored where not — you never pay out of pocket for an external platform resource. The Self Learning layer complements the live cohort curriculum; it's the structured self-study backbone that makes the 10-week sprint actually stick.",
    ],
    capabilities: [
      {
        icon: "MonitorPlay",
        title: "YouTube curation",
        description:
          "Curated YouTube channels and playlists — freeCodeCamp, Fireship, Theo, Traversy Media, etc. — mapped to each module. Every video has a stated learning outcome and a mapped skill-matrix competency. No rabbit-holing.",
      },
      {
        icon: "BookOpen",
        title: "Udemy course access",
        description:
          "Paid Udemy courses at discounted rates for trainees — typically 70-90% off retail. STIOOS-sponsored where discounts aren't available. Every course mapped to a module, with completion tracked in the dashboard.",
      },
      {
        icon: "GraduationCap",
        title: "Coursera specializations",
        description:
          "Curated Coursera specializations from Google, IBM, DeepLearning.AI and other university partners — mapped to role tracks. STIOOS sponsors the specialization cost; trainees get the certificate on completion.",
      },
      {
        icon: "Code",
        title: "freeCodeCamp tracks",
        description:
          "Free interactive freeCodeCamp tracks — Responsive Web Design, JavaScript Algorithms, Data Analysis with Python, etc. — mapped to foundation modules. Self-paced, with completion certificates added to your portfolio.",
      },
      {
        icon: "CalendarDays",
        title: "Weekly self-study schedule",
        description:
          "10 hours/week of structured self-study outside the live cohort cadence. Published every Monday, mapped to the week's module. Includes video watching, course progress, interactive exercises and self-assessment.",
      },
      {
        icon: "ClipboardCheck",
        title: "AI-scored self-assessment",
        description:
          "Weekly AI-scored self-assessment mapped to the skill matrix — you grade yourself against the rubric, the AI validates, and any gap becomes next week's focused self-study. Progress tracked in the dashboard.",
      },
    ],
    process: [
      {
        title: "Receive weekly playlist",
        duration: "Every Monday",
        description:
          "Every Monday the cohort kickoff ships with a personalized self-study playlist for the week — YouTube videos, Udemy course chapters, Coursera specialization modules, freeCodeCamp exercises. 10 hours/week, mapped to that week's module.",
      },
      {
        title: "Self-study + course progress",
        duration: "Tuesday-Thursday",
        description:
          "Self-study happens outside the live cohort cadence — typically evenings and weekends. Course progress tracked automatically in the dashboard. Mentor available async for questions on any external resource.",
      },
      {
        title: "Self-assessment + AI validation",
        duration: "Friday",
        description:
          "Friday self-assessment: you grade yourself against the rubric for the week's competencies. The AI validates your self-grade against the live checkpoint scores. Any gap becomes next week's focused self-study playlist.",
      },
      {
        title: "Portfolio + certificates",
        duration: "Ongoing",
        description:
          "Completed external courses add certificates to your portfolio — Udemy certificates, Coursera specializations, freeCodeCamp tracks. Every certificate is verified and reviewable by any hiring employer with one click.",
      },
    ],
    benefits: [
      {
        metric: "120+",
        label: "Resources curated",
        description:
          "120+ external resources curated across YouTube, Udemy, Coursera, freeCodeCamp and edX — every one mapped to a specific module competency. No rabbit-holing, no generic syllabus, no wasted hours.",
      },
      {
        metric: "$0",
        label: "Out-of-pocket cost",
        description:
          "Paid Udemy courses at 70-90% off retail for trainees, STIOOS-sponsored where discounts aren't available. Coursera specialization costs sponsored by STIOOS. You never pay out of pocket for an external platform resource.",
      },
      {
        metric: "10h",
        label: "Self-study / week",
        description:
          "10 hours/week of structured self-study outside the live cohort cadence. Published every Monday, mapped to the week's module. Includes video watching, course progress, interactive exercises and self-assessment.",
      },
      {
        metric: "5+",
        label: "Certificates added to portfolio",
        description:
          "Average 5+ external certificates added to your portfolio by graduation — Udemy, Coursera, freeCodeCamp. Every certificate verified and reviewable by any hiring employer with one click.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers who learn well self-paced",
        description:
          "You learn well from video and interactive courses, but you've been burned by YouTube rabbit-holes and generic Udemy recommendations. Self Learning gives you a curated playlist mapped to every module — 120+ resources, $0 out of pocket, AI-scored self-assessment, certificates added to your portfolio.",
        bullets: [
          "120+ curated YouTube/Udemy/Coursera/freeCodeCamp/edX resources",
          "$0 out-of-pocket — paid access discounted or STIOOS-sponsored",
          "10 hours/week structured self-study, mapped to each module",
          "AI-scored self-assessment + 5+ external certificates by graduation",
        ],
        cta: "Read the platform list",
      },
      {
        kicker: "For Employers",
        title: "Sponsors funding a cohort",
        description:
          "Sponsor a cohort and the external-platform curation is part of the package — curated YouTube/Udemy/Coursera playlists mapped to your role scorecard, paid access discounted or sponsor-funded, certificates added to every trainee's portfolio. No additional line item — it's included.",
        bullets: [
          "External resources mapped to your role scorecard's competencies",
          "Paid access discounted or sponsor-funded — no trainee cost",
          "Certificates added to every trainee's portfolio (reviewable by you)",
          "Self-assessment scores benchmarked against your role expectations",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "External resources", withStioos: "120+ curated, mapped to modules", without: "Self-discovered, no mapping" },
      { feature: "Paid course cost", withStioos: "$0 (discounted or sponsored)", without: "$50-$300 per course out of pocket" },
      { feature: "Self-study structure", withStioos: "10h/week published schedule", without: "No structure — ad hoc" },
      { feature: "Self-assessment", withStioos: "AI-scored, mapped to skill matrix", without: "None — no progress tracking" },
      { feature: "Certificates", withStioos: "5+ verified, added to portfolio", without: "Self-printed, no verification" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ grads" },
      { name: "Fintech", hires: "260+ grads" },
      { name: "Healthcare", hires: "180+ grads" },
      { name: "Retail", hires: "210+ grads" },
      { name: "Manufacturing", hires: "140+ grads" },
      { name: "Education", hires: "110+ grads" },
    ],
    guarantees: [
      {
        icon: "MonitorPlay",
        title: "Curated-resource guarantee",
        description:
          "Every external resource in your weekly playlist is curated by a senior engineer, mapped to a specific module competency, and reviewed for quality. No filler, no outdated content, no irrelevant videos. Resources are refreshed every cohort.",
      },
      {
        icon: "Wallet",
        title: "$0 out-of-pocket guarantee",
        description:
          "Paid Udemy courses at 70-90% off retail for trainees, STIOOS-sponsored where discounts aren't available. Coursera specialization costs sponsored by STIOOS. You never pay out of pocket for an external platform resource — written into the service agreement.",
      },
      {
        icon: "CalendarDays",
        title: "Weekly schedule guarantee",
        description:
          "Every Monday ships with a published 10-hour self-study playlist mapped to that week's module. If a week's playlist is incomplete or late, you get an additional focused-sprint credit at no cost.",
      },
      {
        icon: "ClipboardCheck",
        title: "Self-assessment accuracy guarantee",
        description:
          "AI validates every self-assessment against the live checkpoint scores. If your self-grade is more than 10% off the AI-validated grade, the rubric is reviewed and a focused self-study sprint is assigned at no cost.",
      },
    ],
    faqs: [
      {
        q: "Which external platforms do you curate resources from?",
        a: "Five primary platforms: YouTube (freeCodeCamp, Fireship, Theo, Traversy Media, etc.), Udemy (paid courses at discounted rates for trainees), Coursera (specializations from Google, IBM, DeepLearning.AI, etc.), freeCodeCamp (free interactive tracks), and edX (university-grade courses). Every resource is curated by a senior engineer, mapped to a specific module competency, and reviewed for quality. Resources are refreshed every cohort to keep up with platform changes.",
      },
      {
        q: "Do I have to pay for paid courses on Udemy or Coursera?",
        a: "No. Paid Udemy courses are discounted 70-90% off retail for trainees, and STIOOS-sponsored where discounts aren't available. Coursera specialization costs are sponsored by STIOOS — you get the certificate on completion at no cost. freeCodeCamp tracks are free. You never pay out of pocket for an external platform resource; this is written into the service agreement you sign before onboarding.",
      },
      {
        q: "How many hours per week is the self-study?",
        a: "10 hours per week of structured self-study outside the live cohort cadence — typically evenings and weekends. The schedule is published every Monday as part of the cohort kickoff, mapped to that week's module. It includes video watching, course progress, interactive exercises and self-assessment. The 10 hours is in addition to the live cohort cadence (standups, mentor 1:1, sprint demos, code review).",
      },
      {
        q: "How does the AI-scored self-assessment work?",
        a: "Every Friday you complete a self-assessment — you grade yourself against the role scorecard rubric for the week's competencies. The AI validates your self-grade against your live checkpoint scores (from the in-cohort work). If your self-grade is more than 10% off the AI-validated grade, the rubric is reviewed and a focused self-study sprint is assigned at no cost. The point is to teach accurate self-evaluation — a critical engineering skill.",
      },
      {
        q: "Do external certificates go into my portfolio?",
        a: "Yes. Completed external courses — Udemy certificates, Coursera specializations, freeCodeCamp tracks — are added to your verified portfolio automatically. Every certificate is verified (no self-printed certs) and reviewable by any hiring employer with one click. By graduation, the average trainee has 5+ external certificates in their portfolio alongside the 3 production-grade capstone pieces.",
      },
    ],
    ctaTitle: "Read the self-learning playbook",
    ctaHighlight: "before you join",
    ctaSubtitle:
      "120+ curated YouTube/Udemy/Coursera resources, $0 out of pocket, 10 hours/week structured self-study, AI-scored self-assessment. The self-paced backbone of the cohort.",
  },

  // ─────────────────────────────────────────────────────────────
  // 13. LEARNING TERMS / CURRICULUM
  //     /talent-solutions/learning-terms/curriculum
  //     Module breakdown, weekly schedule, skill tracks,
  //     capstone deliverables.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "learning-terms/curriculum",
    name: "Learning Curriculum",
    heroTitle: "Structured module progression,",
    heroHighlight: "week by week",
    heroEyebrow: "Learning Terms · Curriculum",
    heroSubtitle:
      "The structured curriculum progression — module breakdown, weekly schedule, skill tracks, capstone deliverables and the 200+ competency skill matrix. Every module is anchored to a deliverable shipped into a real repo, graded by an AI rubric, and benchmarked against the hiring employer's role scorecard.",
    heroStats: [
      { value: "4", label: "Skill tracks" },
      { value: "12", label: "Modules" },
      { value: "200+", label: "Competencies" },
      { value: "1", label: "Capstone" },
    ],
    heroTags: [
      "Module breakdown",
      "Weekly schedule",
      "Skill tracks (4)",
      "Capstone deliverables",
    ],
    heroGaugeValue: 91,
    heroGaugeLabel: "structured",
    heroKpis: [
      { label: "Modules completed", before: "0", after: "12", unit: "" },
      { label: "Skill matrix coverage", before: "20%", after: "92%", unit: "%" },
      { label: "Capstone deliverables", before: "0", after: "1", unit: "" },
    ],
    heroBars: [
      { label: "Skill track depth", before: "10", after: "92", unit: "%", max: 100 },
      { label: "Weekly checkpoint pass rate", before: "30", after: "94", unit: "%", max: 100 },
    ],
    heroQuote:
      "Every week built on the last. By the capstone I'd mastered 200+ competencies — not memorized them, mastered them. The skill matrix made it obvious exactly what I could do.",
    heroQuoteAttribution: "— Karan Verma, Full-Stack Engineer (cohort grad)",
    overview: [
      "Learning Curriculum documents the structured module progression across the 10-week sprint. Four skill tracks (Engineering, Data, Product, Cloud-DevOps) — each with 12 modules, weekly schedule, AI-scored checkpoints, and capstone deliverables. Every module is anchored to a deliverable shipped into a real repo, graded by an AI rubric aligned to the role scorecard, and mapped to the 200+ competency skill matrix that gates graduation.",
      "Weeks 1-2: foundation modules covering the track's must-have competencies. Weeks 3-6: build modules shipped into real repos with real code review. Weeks 7-10: capstone project scoped against the hiring employer's roadmap, plus advanced patterns from senior engineers. Weeks 11-12: capstone review + graduation. Every week ends with a sprint demo, every checkpoint is benchmarked weekly in the dashboard, and the skill matrix is updated continuously so you always know exactly which competencies are interview-ready.",
    ],
    capabilities: [
      {
        icon: "Code2",
        title: "Engineering skill track",
        description:
          "Full-stack engineering track — frontend, backend, API design, testing, CI/CD, observability. 12 modules anchored to real-repo deliverables. Capstone scoped against the hiring employer's engineering roadmap.",
      },
      {
        icon: "Database",
        title: "Data skill track",
        description:
          "Data engineering + analytics track — SQL, Python, data modeling, ETL, dashboards, ML basics. 12 modules with real datasets and real business questions. Capstone scoped against the hiring employer's data roadmap.",
      },
      {
        icon: "Workflow",
        title: "Product skill track",
        description:
          "Product management track — discovery, prioritization, specs, user research, analytics, roadmap. 12 modules with real product cases. Capstone scoped against the hiring employer's product roadmap.",
      },
      {
        icon: "CloudCog",
        title: "Cloud-DevOps skill track",
        description:
          "Cloud + DevOps track — AWS/GCP/Azure, IaC, CI/CD, observability, security, cost optimization. 12 modules with real infra. Capstone scoped against the hiring employer's infra roadmap.",
      },
      {
        icon: "ListChecks",
        title: "200+ competency skill matrix",
        description:
          "Every module updates a 200+ competency skill matrix mapped to interview-ready status. Graduation requires meeting the role scorecard's published criteria — proven, demonstrated competency, not just attendance.",
      },
      {
        icon: "CalendarDays",
        title: "Weekly schedule",
        description:
          "Every week ships with a published schedule: Monday kickoff, Tuesday-Thursday build, Wednesday mentor 1:1, Friday sprint demo + retrospective + AI-scored checkpoint. The cadence mirrors a real engineering team.",
      },
    ],
    process: [
      {
        title: "Week 1-2: Foundation modules",
        duration: "2 weeks",
        description:
          "Onboard into the skill track's stack, repo, CI/CD and ticketing. Foundation modules cover the track's must-have competencies. First sprint demo on Friday of week 1. Skill matrix starts filling in.",
      },
      {
        title: "Week 3-6: Build modules",
        duration: "4 weeks",
        description:
          "Build modules shipped into real repos with real code review. Two portfolio pieces shipped before the capstone. Weekly mentor 1:1 + AI-scored checkpoints mapped to the skill matrix.",
      },
      {
        title: "Week 7-10: Capstone + advanced",
        duration: "4 weeks",
        description:
          "Capstone project scoped against the hiring employer's roadmap. Senior engineers teach advanced patterns. Two more portfolio pieces shipped. Skill matrix nearing graduation criteria.",
      },
      {
        title: "Week 11-12: Review + graduation",
        duration: "2 weeks",
        description:
          "Capstone review by the hiring employer. Skill matrix finalized. Graduation criteria checked against the role scorecard. Conversion offer extended or placement into the curated pool begins.",
      },
    ],
    benefits: [
      {
        metric: "4",
        label: "Skill tracks",
        description:
          "Four structured skill tracks — Engineering, Data, Product, Cloud-DevOps. Each with 12 modules, weekly schedule, AI-scored checkpoints, capstone deliverables. Pick the track that matches your target role.",
      },
      {
        metric: "12",
        label: "Modules per track",
        description:
          "12 modules per skill track — every one anchored to a deliverable shipped into a real repo, graded by an AI rubric, mapped to the 200+ competency skill matrix. No lectures-only modules, no toy projects.",
      },
      {
        metric: "200+",
        label: "Competency skill matrix",
        description:
          "200+ competencies mapped to interview-ready status, benchmarked weekly in the dashboard. Graduation requires meeting the role scorecard's published criteria — proven, demonstrated competency across the full matrix.",
      },
      {
        metric: "3",
        label: "Capstone + portfolio pieces",
        description:
          "One capstone (scoped against the hiring employer's roadmap) plus two build-sprint portfolio pieces. Three production-grade deliverables in your verified portfolio by graduation — reviewable by any hiring employer.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers picking a track",
        description:
          "You want to know exactly what each track covers before you commit. Learning Curriculum documents all 4 skill tracks — Engineering, Data, Product, Cloud-DevOps — with every module, every checkpoint, every capstone deliverable published in writing.",
        bullets: [
          "4 tracks: Engineering, Data, Product, Cloud-DevOps",
          "12 modules per track — every one anchored to a deliverable",
          "200+ competency skill matrix mapped to interview-ready status",
          "Capstone + 2 portfolio pieces by graduation",
        ],
        cta: "Read the track breakdown",
      },
      {
        kicker: "For Employers",
        title: "Sponsors funding a cohort",
        description:
          "Sponsor a cohort on a specific track and the modules are aligned to your role scorecard — every competency mapped, every capstone scoped against your roadmap, every skill matrix benchmarked to your must-haves. You sign off on the track curriculum before the sprint starts.",
        bullets: [
          "4 tracks aligned to your hiring roles",
          "Modules mapped to your published role scorecard",
          "Capstone scoped against your team's roadmap",
          "Skill matrix benchmarked to your must-have competencies",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "Track structure", withStioos: "4 tracks, 12 modules each", without: "1 generic syllabus" },
      { feature: "Module anchoring", withStioos: "Real-repo deliverable per module", without: "Toy project in sandbox" },
      { feature: "Capstone", withStioos: "Employer-roadmap scoped", without: "Generic capstone" },
      { feature: "Skill matrix", withStioos: "200+ competencies, weekly benchmarked", without: "None — pass/fail only" },
      { feature: "Portfolio output", withStioos: "3 production-grade pieces", without: "1 toy project" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ grads" },
      { name: "Fintech", hires: "260+ grads" },
      { name: "Healthcare", hires: "180+ grads" },
      { name: "Retail", hires: "210+ grads" },
      { name: "Manufacturing", hires: "140+ grads" },
      { name: "Education", hires: "110+ grads" },
    ],
    guarantees: [
      {
        icon: "ListChecks",
        title: "Module-anchored guarantee",
        description:
          "Every module in every track is anchored to a deliverable shipped into a real repo with real code review. If a module devolves into lectures-only with no production deliverable, the module is rebuilt before the next cohort runs.",
      },
      {
        icon: "ClipboardCheck",
        title: "AI-rubric assessment guarantee",
        description:
          "Every checkpoint is graded by an AI rubric aligned to the role scorecard. Every grade is mapped to the 200+ competency skill matrix and benchmarked weekly in the dashboard. No grade inflation, no attendance-only passes.",
      },
      {
        icon: "Rocket",
        title: "Capstone review guarantee",
        description:
          "The capstone is scoped against the hiring employer's roadmap and reviewed by the employer before conversion. If the capstone does not meet the review bar, you get an additional 4-week capstone polish sprint at no cost.",
      },
      {
        icon: "Scale",
        title: "Skill matrix graduation gate",
        description:
          "Graduation requires meeting the role scorecard's published skill matrix criteria — 200+ competencies graded as interview-ready. The matrix is benchmarked weekly, audit-ready, and signed off by the hiring employer before the sprint starts.",
      },
    ],
    faqs: [
      {
        q: "What are the four skill tracks?",
        a: "Engineering (full-stack — frontend, backend, API design, testing, CI/CD, observability), Data (data engineering + analytics — SQL, Python, data modeling, ETL, dashboards, ML basics), Product (product management — discovery, prioritization, specs, user research, analytics, roadmap), and Cloud-DevOps (AWS/GCP/Azure, IaC, CI/CD, observability, security, cost optimization). Each track has 12 modules anchored to real-repo deliverables and a capstone scoped against the hiring employer's roadmap.",
      },
      {
        q: "How are the 12 modules structured?",
        a: "Weeks 1-2: foundation modules covering the track's must-have competencies (stack basics, repo conventions, CI/CD workflow, ticketing). Weeks 3-6: build modules shipped into real repos with real code review (feature implementation, testing, observability basics). Weeks 7-10: capstone module scoped against the hiring employer's roadmap, plus advanced patterns from senior engineers. Weeks 11-12: capstone review + graduation. Every module is anchored to a deliverable and graded by an AI rubric.",
      },
      {
        q: "What is the 200+ competency skill matrix?",
        a: "Every module updates a 200+ competency skill matrix mapped to interview-ready status. Every competency is graded by an AI rubric aligned to the role scorecard, benchmarked weekly in the dashboard, and audit-ready. Graduation requires meeting the role scorecard's published criteria — typically all 200+ competencies graded as interview-ready or above. You always know exactly which competencies need a focused sprint.",
      },
      {
        q: "What is the capstone deliverable?",
        a: "The capstone is a production-grade project scoped against the hiring employer's actual roadmap — not a toy project, not a generic capstone. It runs through weeks 7-10. The deliverable is shipped into a real repo with real code review, deployed to a real environment, and reviewed by the hiring employer before conversion. Past capstones have shipped as real features in the employer's product. Plus 2 build-sprint portfolio pieces — 3 production-grade deliverables total in your verified portfolio.",
      },
      {
        q: "Can I switch tracks mid-sprint?",
        a: "Generally no — the track is set by the cohort you join, and the cohort's hiring employer has signed off on the track's curriculum. If you discover mid-sprint that the track isn't the right fit, you can request a track transfer to a future cohort within 90 days — no re-application fee, no re-screening. The capstone polish guarantee covers you in the current cohort; the cohort rerun option covers you in a future track.",
      },
    ],
    ctaTitle: "Read the curriculum structure",
    ctaHighlight: "track by track",
    ctaSubtitle:
      "4 skill tracks, 12 modules each, 200+ competency skill matrix, 1 capstone scoped against the employer's roadmap. Every module anchored to a deliverable you ship into a real repo.",
  },

  // ─────────────────────────────────────────────────────────────
  // 14. LEARNING TERMS / PROJECTS-DEVELOPMENT
  //     /talent-solutions/learning-terms/projects-development
  //     Project types, tech stack, deliverables, portfolio.
  // ─────────────────────────────────────────────────────────────
  {
    slug: "learning-terms/projects-development",
    name: "Projects Development",
    heroTitle: "Real-world project building,",
    heroHighlight: "from spec to production",
    heroEyebrow: "Learning Terms · Projects Development",
    heroSubtitle:
      "The project side of the cohort — project types (build-sprint deliverables, capstone, portfolio pieces), the tech stack you work in (the hiring employer's real stack), deliverables shipped into real repos with real code review, and the verified portfolio you graduate with. No toy projects, no sandboxes.",
    heroStats: [
      { value: "3", label: "Portfolio pieces" },
      { value: "12+", label: "Prod deploys" },
      { value: "Real", label: "Tech stack" },
      { value: "1-click", label: "Portfolio share" },
    ],
    heroTags: [
      "Project types",
      "Real tech stack",
      "Real-repo deliverables",
      "Verified portfolio",
    ],
    heroGaugeValue: 89,
    heroGaugeLabel: "project-ready",
    heroKpis: [
      { label: "Portfolio pieces", before: "0", after: "3", unit: "" },
      { label: "Production deploys", before: "0", after: "12", unit: "+" },
      { label: "Code reviews received", before: "0", after: "40+", unit: "+" },
    ],
    heroBars: [
      { label: "Project complexity", before: "10", after: "92", unit: "%", max: 100 },
      { label: "Portfolio quality", before: "15", after: "94", unit: "%", max: 100 },
    ],
    heroQuote:
      "By graduation I'd shipped 14 production deploys into a real codebase — the same codebase I now work on as a full-time engineer. The portfolio speaks for itself in interviews.",
    heroQuoteAttribution: "— Arjun Mehta, Full-Stack Engineer (cohort grad)",
    overview: [
      "Projects Development documents the project side of the cohort experience. Three project types: build-sprint deliverables (weeks 3-6, two pieces shipped into real repos with real code review), capstone project (weeks 7-10, scoped against the hiring employer's roadmap, reviewed by the employer before conversion), and portfolio pieces (the curated subset of build-sprint + capstone work that goes into your verified portfolio).",
      "The tech stack is the hiring employer's real stack — the same repos, CI/CD, ticketing, conventions and workflows you'll use after conversion. Not a sandbox, not a tutorial repo. Every deliverable is shipped into a real repo, reviewed by a senior mentor, deployed to a real environment, and tracked in your portfolio. By graduation you have 3 production-grade pieces, 12+ production deploys, and a verified portfolio shareable with any hiring employer in one click.",
    ],
    capabilities: [
      {
        icon: "Code2",
        title: "Build-sprint deliverables",
        description:
          "Weeks 3-6 ship two build-sprint deliverables — features, fixes, or refactors scoped against the hiring employer's real backlog. Every PR reviewed by a senior mentor, merged into a real repo, deployed to a real environment.",
      },
      {
        icon: "Rocket",
        title: "Capstone project",
        description:
          "Weeks 7-10 ship the capstone — a production-grade project scoped against the hiring employer's actual roadmap. Past capstones have shipped as real features in the employer's product. Reviewed by the employer before conversion.",
      },
      {
        icon: "Briefcase",
        title: "Portfolio pieces",
        description:
          "Your verified portfolio is a curated subset of build-sprint + capstone work — 3 production-grade pieces total, each with a description, the PR link, the deploy link, and the mentor review. Shareable with any hiring employer in one click.",
      },
      {
        icon: "CloudCog",
        title: "Real tech stack",
        description:
          "The stack is the hiring employer's real stack — same repos, CI/CD, ticketing, conventions. Not a sandbox, not a tutorial repo. You graduate already fluent in the day-one workflow — no ramp-up period after conversion.",
      },
      {
        icon: "GitBranch",
        title: "Real repos + real code review",
        description:
          "Every deliverable is shipped into a real repo (typically the employer's monorepo or a dedicated cohort sub-repo) with real code review by a senior mentor. PR conventions, branching strategy, CI gates — all real.",
      },
      {
        icon: "Server",
        title: "Production deploys",
        description:
          "Every merged PR deploys to a real environment — staging for build-sprint deliverables, production-grade for the capstone. Average 12+ production deploys per trainee by graduation. That's the difference between 'I read about CI/CD' and 'I ship to prod'.",
      },
    ],
    process: [
      {
        title: "Build-sprint deliverables (weeks 3-6)",
        duration: "4 weeks",
        description:
          "Two build-sprint deliverables shipped into real repos. PR reviewed by senior mentor, merged, deployed to staging. Each deliverable becomes a portfolio piece candidate.",
      },
      {
        title: "Capstone scoping (week 7)",
        duration: "1 week",
        description:
          "Capstone scoped against the hiring employer's actual roadmap — a real feature, a real fix, or a real prototype. Reviewed and approved by the employer before build begins.",
      },
      {
        title: "Capstone build (weeks 8-10)",
        duration: "3 weeks",
        description:
          "Capstone built into a real repo with real code review. Deployed to a production-grade environment. Two more portfolio pieces shipped alongside the capstone.",
      },
      {
        title: "Capstone review + portfolio (weeks 11-12)",
        duration: "2 weeks",
        description:
          "Capstone reviewed by the hiring employer. Portfolio curated — 3 production-grade pieces, each with description + PR link + deploy link + mentor review. Shareable in one click.",
      },
    ],
    benefits: [
      {
        metric: "3",
        label: "Portfolio pieces",
        description:
          "Three production-grade portfolio pieces by graduation — the capstone plus two build-sprint deliverables. Every piece has a description, the PR link, the deploy link, and the mentor review. Shareable with any hiring employer in one click.",
      },
      {
        metric: "12+",
        label: "Production deploys",
        description:
          "Average 12+ production deploys per trainee by graduation — into a real repo, reviewed by a senior engineer, deployed to a real environment. That's the difference between 'I read about CI/CD' and 'I ship to prod every week'.",
      },
      {
        metric: "40+",
        label: "Code reviews received",
        description:
          "Average 40+ senior-mentor code reviews per trainee by graduation — on every PR you ship. That's how you learn the day-one workflow: real reviews, real feedback, real iterations.",
      },
      {
        metric: "Real",
        label: "Tech stack",
        description:
          "The stack is the hiring employer's real stack — same repos, CI/CD, ticketing, conventions. You graduate already fluent in the day-one workflow — no ramp-up period after conversion. Past cohorts have shipped in Node + Postgres + AWS, Python + React + GCP, Salesforce + Apex, and more.",
      },
    ],
    audiences: [
      {
        kicker: "For Job Seekers",
        title: "Career switchers building a real portfolio",
        description:
          "You need a portfolio of real, production-grade work to get hired — not toy projects in a sandbox. Projects Development ships 3 portfolio pieces by graduation, each into a real repo, each reviewed by a senior mentor, each shareable with any hiring employer in one click.",
        bullets: [
          "3 production-grade portfolio pieces by graduation",
          "Real tech stack — the hiring employer's actual repos + CI/CD",
          "12+ production deploys + 40+ senior-mentor code reviews",
          "One-click portfolio share with any hiring employer",
        ],
        cta: "Read the project types",
      },
      {
        kicker: "For Employers",
        title: "Sponsors funding a cohort",
        description:
          "Sponsor a cohort and every project ships into your real repos — build-sprint deliverables against your backlog, capstone scoped against your roadmap, code review by your senior engineers (or ours). Trainees graduate already fluent in your day-one workflow.",
        bullets: [
          "Build-sprint deliverables against your real backlog",
          "Capstone scoped against your team's roadmap",
          "Code review by your senior engineers (or ours)",
          "Trainees graduate fluent in your day-one workflow",
        ],
        cta: "Sponsor a cohort",
      },
    ],
    comparison: [
      { feature: "Project type", withStioos: "Real-repo deliverable, real code review", without: "Toy project in sandbox" },
      { feature: "Tech stack", withStioos: "Hiring employer's real stack", without: "Generic stack chosen by instructor" },
      { feature: "Code review", withStioos: "40+ reviews by senior mentor", without: "Self-review or peer-only" },
      { feature: "Production deploys", withStioos: "12+ per trainee by graduation", without: "0 — sandbox only" },
      { feature: "Portfolio", withStioos: "3 verified pieces, one-click share", without: "1 toy project, no verification" },
    ],
    industries: [
      { name: "SaaS", hires: "320+ grads" },
      { name: "Fintech", hires: "260+ grads" },
      { name: "Healthcare", hires: "180+ grads" },
      { name: "Retail", hires: "210+ grads" },
      { name: "Manufacturing", hires: "140+ grads" },
      { name: "Education", hires: "110+ grads" },
    ],
    guarantees: [
      {
        icon: "Rocket",
        title: "Real-repo guarantee",
        description:
          "Every project ships into a real repo — the hiring employer's monorepo or a dedicated cohort sub-repo with real CI/CD, real branching strategy, real PR conventions. No sandboxes, no tutorial repos. If a project ships into a sandbox, the project is rebuilt.",
      },
      {
        icon: "GitBranch",
        title: "Code review guarantee",
        description:
          "Every PR is reviewed by a senior engineer mentor — 40+ reviews per trainee by graduation. If a mentor review is skipped or shallow, you get a senior mentor upgrade at no cost. Real review, real feedback, real iteration.",
      },
      {
        icon: "Server",
        title: "Production-deploy guarantee",
        description:
          "Every merged PR deploys to a real environment — staging for build-sprint deliverables, production-grade for the capstone. If a deploy is skipped or sandboxed, the project is re-scoped with real deploy targets before the next cohort.",
      },
      {
        icon: "Briefcase",
        title: "Portfolio guarantee",
        description:
          "By graduation you have 3 production-grade portfolio pieces — each with a description, the PR link, the deploy link, and the mentor review. Shareable with any hiring employer in one click. If a portfolio piece is missing or unverified, you get a capstone polish sprint at no cost.",
      },
    ],
    faqs: [
      {
        q: "What kinds of projects will I build during the cohort?",
        a: "Three project types: build-sprint deliverables (weeks 3-6, two pieces — features, fixes, or refactors scoped against the hiring employer's real backlog), capstone project (weeks 7-10, scoped against the hiring employer's actual roadmap — past capstones have shipped as real features in the employer's product), and portfolio pieces (the curated subset of build-sprint + capstone work that goes into your verified portfolio — 3 pieces total by graduation).",
      },
      {
        q: "What tech stack will I be working in?",
        a: "The hiring employer's real stack — the same repos, CI/CD, ticketing, conventions and workflows you'll use after conversion. Not a sandbox, not a tutorial repo, not a stack chosen by the instructor. Past cohorts have shipped in Node + Postgres + AWS, Python + React + GCP, Java + Spring + Azure, Salesforce + Apex, and more. The exact stack is published for every cohort before you accept a seat.",
      },
      {
        q: "Do projects actually ship to production?",
        a: "Yes. Every merged PR deploys to a real environment — staging for build-sprint deliverables, production-grade for the capstone. Average 12+ production deploys per trainee by graduation. That's the difference between 'I read about CI/CD' and 'I ship to prod every week'. Past capstones have shipped as real features in the hiring employer's actual product, used by real customers.",
      },
      {
        q: "How does code review work?",
        a: "Every PR you ship is reviewed by a senior engineer mentor — average 40+ reviews per trainee by graduation. The review covers code quality, conventions, testing, performance, security and design. You iterate on the feedback, re-push, and merge only when the mentor approves. Real review, real feedback, real iteration — the same workflow you'll use after conversion.",
      },
      {
        q: "What goes into my portfolio?",
        a: "By graduation, 3 production-grade portfolio pieces — the capstone plus two build-sprint deliverables. Each piece has: a written description, the PR link (so hiring employers can read the actual code), the deploy link (so hiring employers can try the actual feature), and the mentor review (so hiring employers can see the feedback you received and how you iterated). The portfolio is verified by STIOOS, shareable with any hiring employer in one click, and remains yours permanently after graduation.",
      },
    ],
    ctaTitle: "Read how projects ship",
    ctaHighlight: "into real repos",
    ctaSubtitle:
      "3 portfolio pieces, 12+ production deploys, 40+ senior-mentor code reviews, real tech stack. Every project ships into a real repo with real review — no sandboxes, no toy projects.",
  },
];

export function getGroupPageContent(slug: string): GroupPageContent | undefined {
  return TALENT_GROUP_PAGE_CONTENT.find((p) => p.slug === slug);
}

export const GROUP_PAGE_SLUGS: string[] = TALENT_GROUP_PAGE_CONTENT.map((p) => p.slug);
