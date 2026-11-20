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
];

export function getGroupPageContent(slug: string): GroupPageContent | undefined {
  return TALENT_GROUP_PAGE_CONTENT.find((p) => p.slug === slug);
}

export const GROUP_PAGE_SLUGS: string[] = TALENT_GROUP_PAGE_CONTENT.map((p) => p.slug);
