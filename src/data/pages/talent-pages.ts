import type { PageSpec } from "./types";

// ============================================================
// TALENT SOLUTIONS PAGES — one PageSpec per Talent Solutions
// dropdown option. Each spec renders a full 24-section page at
// /talent-solutions/[slug].
// ============================================================

export const TALENT_PAGE_SPECS: PageSpec[] = [
  {
    slug: "train-to-hire",
    group: "talent",
    accent: "amber",
    nav: "Train to Hire",

    eyebrow: "Talent Development · Training + Placement",
    title: "Train to Hire —",
    highlight: "talent built to your spec",
    subtitle:
      "We source high-potential candidates, train them on your exact stack and processes, then deliver job-ready professionals who join your team from day one.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "Talk to a talent expert", href: "/contact" },
    heroStats: [
      { value: "8–12 wks", label: "Ready-to-join" },
      { value: "96%", label: "Retention @ 12 mo" },
      { value: "2M+", label: "Candidate pool" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "2M+ assessed pool",
      "48h shortlists",
      "90-day replacement",
      "Pay-after-join model",
      "4.9/5 employer rating",
    ],

    kpis: [
      { icon: "GraduationCap", value: "12,000+", label: "Candidates trained", detail: "Across AI, cloud, data and full-stack curricula since 2019." },
      { icon: "Target", value: "94%", label: "Training-to-hire rate", detail: "Cohorts that clear client bar and convert to offers." },
      { icon: "Clock", value: "70%", label: "Faster than hiring senior", detail: "Versus sourcing mid-level talent in a hot market." },
      { icon: "Wallet", value: "40%", label: "Lower cost-per-hire", detail: "Compared to agency fees plus onboarding ramp." },
    ],

    audiences: [
      {
        icon: "UserCheck",
        kicker: "For Employers",
        title: "Talent shaped around your stack",
        description: "Stop paying for skills you don't need and missing the ones you do. We co-design the curriculum with your tech leads.",
        bullets: [
          "Curriculum co-authored with your engineers",
          "Shadow projects on your real workflows",
          "Cultural and team-fit screening included",
          "Cohorts of 5–50, delivered quarterly",
        ],
        cta: { label: "Scope your first cohort", href: "/contact" },
      },
      {
        icon: "Rocket",
        kicker: "For Job Seekers",
        title: "A career runway, not just a course",
        description: "Get hired while you train — earn a stipend, learn on live client work and step into a full-time role with a named employer.",
        bullets: [
          "Earn-while-you-learn stipend",
          "Mentorship from senior practitioners",
          "Guaranteed interview with partner employers",
          "Certificate + real project portfolio",
        ],
        cta: { label: "Apply to the program", href: "/talent-solutions#placements" },
      },
    ],

    valueProps: [
      { icon: "Target", title: "Your spec, our pipeline", description: "Skills, tools and processes defined by you — we train to the exact role profile, not a generic syllabus." },
      { icon: "BrainCircuit", title: "AI-screened intake", description: "Every candidate clears AI-scored aptitude, communication and technical screens before training begins." },
      { icon: "Users", title: "Cohort culture", description: "Candidates learn in teams, mirroring how your engineering and delivery teams actually work." },
      { icon: "ShieldCheck", title: "Zero-risk replacement", description: "Anyone who doesn't ramp within 90 days is replaced free — in writing, on every contract." },
      { icon: "TrendingUp", title: "Compounding bench", description: "Repeat cohorts build you a warm, pre-trained bench for every future opening." },
      { icon: "Globe", title: "Onshore + offshore mix", description: "Blend local hires with trained offshore talent to hit both budget and collaboration goals." },
    ],

    processTitle: "From brief to first day in 10 weeks",
    process: [
      { title: "Role discovery workshop", duration: "Week 1", description: "We map the role with your leads — must-have skills, tools, ways of working and success measures." },
      { title: "AI + human candidate screening", duration: "Weeks 2–3", description: "2M+ pool is filtered by AI scoring, then technical and communication panels shortlist the cohort." },
      { title: "Cohort training sprint", duration: "Weeks 4–9", description: "Curriculum co-built with your engineers, delivered by industry mentors with weekly client checkpoints." },
      { title: "Capstone on your workflows", duration: "Week 10", description: "Trainees complete a shadow project mirroring your live environment, assessed by your own team." },
      { title: "Offer, join & 90-day ramp", duration: "Week 11+", description: "You interview and extend offers; we stay engaged through the first 90 days with free replacement cover." },
    ],

    spotlight: [
      {
        icon: "BrainCircuit",
        title: "Precision matching, not CV lottery",
        description: "Our matching engine weighs assessed skill, trajectory and team fit — so cohorts arrive pre-aligned to your bar.",
        bullets: ["Skill-graph profiling", "Trajectory modelling", "Team-fit scoring"],
        visual: "network",
      },
      {
        icon: "Gauge",
        title: "Live training telemetry",
        description: "Watch cohort progress weekly — attendance, assessment scores and capstone readiness, no surprises at the end.",
        bullets: ["Weekly scorecards", "Assessment analytics", "Early-risk alerts"],
        visual: "dashboard",
      },
      {
        icon: "BadgeCheck",
        title: "Credentials that mean something",
        description: "Graduates leave with verifiable certificates and a capstone portfolio your hiring managers can actually inspect.",
        bullets: ["Verifiable certificates", "Capstone portfolio", "Mentor references"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What's included in every Train to Hire engagement",
    deliverables: [
      "Role profile & curriculum workshop",
      "Dedicated success manager",
      "AI-screened candidate shortlist",
      "Custom cohort training sprint",
      "Weekly progress telemetry",
      "Capstone on your workflows",
      "Interview coordination & offers",
      "90-day ramp & replacement cover",
    ],

    modulesTitle: "Capability modules to compose",
    modules: [
      { icon: "Code", tag: "Engineering", title: "Full-Stack Development", description: "React, Node, Java or .NET tracks shaped to your platform conventions." },
      { icon: "Database", tag: "Data", title: "Data Engineering & Analytics", description: "SQL, Python, warehouse modelling and BI tooling on your actual stack." },
      { icon: "Cloud", tag: "Infrastructure", title: "Cloud & DevOps", description: "AWS, Azure or GCP operations, CI/CD and IaC to your governance standards." },
      { icon: "BrainCircuit", tag: "AI", title: "Applied AI & LLM Engineering", description: "Prompt engineering, RAG pipelines and agent tooling with production guardrails." },
      { icon: "ShieldCheck", tag: "Security", title: "Cybersecurity Operations", description: "SOC workflows, vulnerability management and compliance-aligned practice labs." },
      { icon: "MessageSquare", tag: "Business", title: "Business & Product Ops", description: "Analysis, process ops and product support roles with tool-specific certification." },
    ],

    tech: {
      title: "The STIOOS Talent OS behind every cohort",
      description: "One platform runs intake, training telemetry and placement reporting — you see what we see, in real time.",
      points: [
        { icon: "Brain", title: "AI skill profiling", description: "Deep skill-graph scoring across 400+ assessed competencies." },
        { icon: "Video", title: "AI-proctored assessments", description: "Identity-verified, anti-cheat proctoring on every evaluation." },
        { icon: "BarChart3", title: "Live cohort analytics", description: "Attendance, scores and readiness streamed to your dashboard." },
        { icon: "Lock", title: "Enterprise-grade privacy", description: "ISO 27001-aligned handling of candidate and client data." },
      ],
      stats: [
        { value: "400+", label: "Skills assessed" },
        { value: "24h", label: "Score turnaround" },
      ],
    },

    coverage: {
      title: "Roles & skills we train for",
      note: "Don't see your stack? We build bespoke cohorts on request — 3 weeks from brief to kickoff.",
      chips: [
        "React & Next.js", "Node.js", "Java / Spring", ".NET", "Python", "Go",
        "Data Engineering", "ML / MLOps", "DevOps & SRE", "QA Automation",
        "Cybersecurity", "Product Ops",
      ],
      stats: [
        { value: "2M+", label: "Candidate pool" },
        { value: "40+", label: "Skill tracks" },
        { value: "12", label: "Industries served" },
      ],
    },

    modelsTitle: "Engagement models",
    models: [
      {
        name: "Cohort Sprint",
        price: "Per cohort",
        period: "5–25 trainees",
        description: "One focused cohort trained to a single role profile. Ideal for teams with an immediate gap.",
        features: ["Custom curriculum", "Weekly telemetry", "Capstone assessment", "90-day replacement"],
        popular: false,
        cta: { label: "Scope a cohort", href: "/contact" },
      },
      {
        name: "Pipeline Partner",
        price: "Quarterly",
        period: "Rolling cohorts",
        description: "Continuous cohorts on a quarterly rhythm — your bench fills itself ahead of demand.",
        features: ["Multi-role pipelines", "Priority intake", "Quarterly reviews", "Dedicated success team"],
        popular: true,
        cta: { label: "Become a partner", href: "/contact" },
      },
      {
        name: "Enterprise Academy",
        price: "Custom",
        period: "Annual program",
        description: "A branded academy for large organisations — multiple tracks, campuses and governance.",
        features: ["Multi-track curricula", "Campus partnerships", "Executive reporting", "Custom SLAs"],
        popular: false,
        cta: { label: "Talk to enterprise team", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "94%", label: "Offer-accept rate", progress: 94 },
      { value: "96%", label: "12-month retention", progress: 96 },
      { value: "4.6/5", label: "Manager ramp rating", progress: 92 },
      { value: "70%", label: "Time-to-productivity gain", progress: 70 },
    ],

    testimonials: [
      {
        quote: "Our first cohort of eight joined sprint-ready. By week three they were shipping tickets — our senior engineers couldn't believe they were 'trainees' three months earlier.",
        name: "Priya Nair", role: "VP Engineering, FinServe Cloud", initials: "PN", rating: 5,
      },
      {
        quote: "The weekly telemetry removed every guesswork conversation. We could see exactly who was ramping and hire with total confidence.",
        name: "Daniel Okafor", role: "Head of Delivery, Northbridge Digital", initials: "DO", rating: 5,
      },
      {
        quote: "I joined as a trainee with a stipend and no degree from a top college. Eight months later I'm a full-time engineer mentoring the next cohort.",
        name: "Arjun Mehta", role: "Software Engineer, Cohort '24", initials: "AM", rating: 5,
      },
    ],

    caseStudy: {
      industry: "Fintech",
      title: "Fintech scale-up builds a 40-engineer pipeline in two quarters",
      challenge: "A fast-growing payments company was losing 8 weeks per senior hire, with agency spend spiralling and no consistent junior intake.",
      solution: "We ran three Train to Hire cohorts on their Java + React stack, co-designed with their leads, with capstones on their payments platform.",
      results: [
        { value: "40", label: "Engineers hired" },
        { value: "-58%", label: "Cost per hire" },
        { value: "5 wks", label: "To productivity" },
      ],
    },

    comparisonTitle: "Train to Hire vs. traditional hiring",
    comparison: [
      { traditional: "8–12 weeks sourcing mid-level talent", withUs: "Job-ready cohort in 8–12 weeks, trained to your spec" },
      { traditional: "Pay agency fees before any hire", withUs: "Pay-after-join model on success" },
      { traditional: "Generic CV screening", withUs: "AI-scored, proctored skill verification" },
      { traditional: "Ramp-up risk lands on your team", withUs: "90-day free replacement guarantee" },
      { traditional: "Skills fit the syllabus, not your stack", withUs: "Curriculum co-authored with your engineers" },
      { traditional: "Pipeline resets after every hire", withUs: "Compounding pre-trained bench" },
    ],

    industries: [
      "FinTech", "Healthcare", "E-commerce", "SaaS", "Manufacturing",
      "Logistics", "Energy", "Telecom", "Public Sector", "EdTech",
    ],

    regions: [
      { region: "North America", cities: "New York · Toronto · Austin", note: "CST–EST coverage" },
      { region: "Europe", cities: "London · Berlin · Amsterdam", note: "GMT–CET coverage" },
      { region: "Middle East", cities: "Dubai · Riyadh", note: "GST coverage" },
      { region: "Asia Pacific", cities: "Bengaluru · Singapore · Sydney", note: "IST–AEST coverage" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "90-day replacement", description: "Free replacement for any hire who doesn't ramp — contractually committed." },
      { icon: "Handshake", title: "Pay-after-join", description: "Success-based fees: you pay when talent joins, not for interviews." },
      { icon: "Lock", title: "Data protected", description: "ISO 27001-aligned security across candidate and client data." },
      { icon: "BadgeCheck", title: "Quality SLA", description: "Cohort quality thresholds defined upfront and tracked weekly." },
    ],

    experts: [
      { name: "Sarah Whitfield", role: "Director, Talent Development", initials: "SW", specialty: "Curriculum design", stat: "120+ cohorts delivered" },
      { name: "Ravi Kulkarni", role: "Head of Assessments", initials: "RK", specialty: "Skill science", stat: "400+ skill frameworks" },
      { name: "Elena Petrova", role: "Principal Talent Partner", initials: "EP", specialty: "Enterprise programs", stat: "$40M talent value placed" },
    ],

    resources: [
      { type: "Playbook", title: "The Train to Hire ROI model", description: "How to compare a trained cohort against agency hiring — with a free calculator.", readTime: "12 min read" },
      { type: "Guide", title: "Designing a role profile that trains well", description: "The five inputs that make or break custom cohort curricula.", readTime: "8 min read" },
      { type: "Report", title: "Early-career hiring benchmarks 2025", description: "Stipend bands, conversion rates and retention across 12 industries.", readTime: "15 min read" },
    ],

    faqs: [
      { q: "How is Train to Hire different from regular staffing?", a: "Traditional staffing places whoever exists in the market today. Train to Hire shapes candidates to your exact requirements before day one — curriculum, tooling and workflows are co-designed with your team, so ramp time collapses." },
      { q: "What does it cost, and when do we pay?", a: "Fees are success-based and agreed per cohort upfront. You pay after candidates join — never for interviews, training or shortlists." },
      { q: "Can we interview candidates before offers?", a: "Yes. You meet the cohort at capstone stage, run your own interviews and extend offers only to people you want. The capstone mirrors your real workflows, so evaluation is genuine." },
      { q: "What happens if a hire doesn't work out?", a: "Every engagement includes a 90-day free replacement guarantee, in writing. We backfill from the same talent line without re-running the full process." },
      { q: "Which technologies can you train for?", a: "40+ standard tracks across engineering, data, cloud, AI, security and business operations. If your stack is unusual, we build a bespoke curriculum in about three weeks." },
      { q: "How do candidates benefit — and why do they join?", a: "Candidates earn while they learn, get mentorship from senior practitioners and step into a guaranteed interview with a named employer. It's a career runway, not a bootcamp gamble." },
    ],

    ctaBand: {
      kicker: "Start this quarter",
      title: "Your next cohort is 10 weeks away",
      primary: {
        kicker: "For Employers",
        title: "Scope your first cohort",
        text: "Bring one role profile to a 30-minute workshop — leave with a cohort plan, timeline and pricing.",
        cta: { label: "Book the workshop", href: "/contact" },
      },
      secondary: {
        kicker: "For Job Seekers",
        title: "Get hired while you train",
        text: "Apply once, clear the AI screen and start earning a stipend while you build a real career.",
        cta: { label: "Apply now", href: "/talent-solutions#placements" },
      },
    },

    contact: {
      title: "Prefer to talk it through?",
      note: "Our talent strategists reply with a tailored cohort outline — not a sales script.",
      channels: [
        { icon: "Phone", label: "Call us", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email talent team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book a free consult", value: "30-min strategy call", href: "/contact" },
      ],
    },
  },
  {
    slug: "hire-to-train",
    group: "talent",
    accent: "amber",
    nav: "Hire to Train",

    eyebrow: "Talent Solutions · Hire + Upskill",
    title: "Hire the attitude —",
    highlight: "we train the skills on the job",
    subtitle:
      "Hire promising candidates on aptitude and attitude first, then STIOOS trains them on the job — your stack, your processes, your standards — into the exact role you need filled.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "Explore all talent services", href: "/talent-solutions" },
    heroStats: [
      { value: "2–3 wks", label: "Offer to onboard" },
      { value: "82%", label: "Ramp target @ 90 days" },
      { value: "45%", label: "Saved vs senior hire" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "Aptitude-first screening",
      "Mentor-led ramp plans",
      "48h interview loops",
      "90-day replacement",
      "4.8/5 employer rating",
    ],

    kpis: [
      { icon: "Handshake", value: "5,200+", label: "Potential hires converted", detail: "Candidates hired for trajectory and trained into role experts on live work." },
      { icon: "Clock", value: "10 days", label: "Median interview cycle", detail: "Attitude-first shortlists collapse screening from months to days." },
      { icon: "Gauge", value: "82%", label: "Productive by day 90", detail: "Trainees clearing full productivity benchmarks within their first quarter." },
      { icon: "Wallet", value: "45%", label: "Lower cost per hire", detail: "Versus bidding for scarce mid- and senior-level talent in a hot market." },
    ],

    audiences: [
      {
        icon: "Building2",
        kicker: "For Employers",
        title: "Stop hiring résumés, start hiring potential",
        description: "Senior hiring is slow, expensive and full of miss-hire risk. Attitude hires train faster, stay longer and cost less — when the ramp is engineered.",
        bullets: [
          "Structured 90-day on-the-job ramp plan",
          "Dedicated mentor assigned to every hire",
          "Weekly skill scorecards shared with you",
          "Free replacement if the ramp fails",
        ],
        cta: { label: "Design a hire-to-train role", href: "/contact" },
      },
      {
        icon: "Rocket",
        kicker: "For Job Seekers",
        title: "Get hired for who you can become",
        description: "No perfect CV required. Clear our aptitude and attitude screen, get a real offer, and learn the craft on live client work with a paid salary from day one.",
        bullets: [
          "Real employment offer before training",
          "Paid salary — not an unpaid bootcamp",
          "Senior mentor in your corner weekly",
          "Verifiable skills credential at certification",
        ],
        cta: { label: "Take the aptitude screen", href: "/talent-solutions#placements" },
      },
    ],

    valueProps: [
      { icon: "Target", title: "Aptitude over pedigree", description: "Our screens weigh learning velocity, grit and problem-solving — predictors of on-the-job success that CVs can't show." },
      { icon: "Wrench", title: "Trained on your real work", description: "No classroom simulations. New hires ramp on live tickets, shadowing your seniors from week one." },
      { icon: "Users", title: "Mentors in the loop", description: "Every hire gets a STIOOS mentor plus a named buddy on your team, with weekly sync baked into the ramp." },
      { icon: "Gauge", title: "Ramp you can measure", description: "Skill scorecards, milestone reviews and a day-90 certification gate — progress is visible, not vibes." },
      { icon: "ShieldCheck", title: "Risk shifted off your team", description: "If a hire isn't tracking to the ramp plan, we replace them free within 90 days. In writing." },
      { icon: "TrendingUp", title: "Loyalty that compounds", description: "People you invest in stay: attitude hires show materially higher 24-month retention than lateral hires." },
    ],

    processTitle: "From screening to self-sufficient in one quarter",
    process: [
      { title: "Aptitude & attitude screen", duration: "Week 1", description: "AI-scored aptitude, communication and motivation assessments filter the 2M+ pool to a fit shortlist." },
      { title: "Fast-track interviews", duration: "Week 2", description: "You meet a pre-vetted shortlist in structured loops focused on potential, not trivia." },
      { title: "Offer & day-one setup", duration: "Week 3", description: "Offers go out, paperwork clears and the personalised 90-day ramp plan is co-signed by your lead." },
      { title: "On-the-job training sprint", duration: "Weeks 4–10", description: "Your hire ships real work under a mentor, with weekly skill scorecards and checkpoint reviews." },
      { title: "Day-90 certification gate", duration: "Weeks 11–13", description: "A practical assessment on your workflows confirms full productivity — or triggers free replacement." },
    ],

    spotlight: [
      {
        icon: "Gauge",
        title: "One ramp plan per hire",
        description: "Every hire-to-train engagement starts with a measurable 90-day plan — skills, milestones and certification criteria agreed before day one.",
        bullets: ["Milestone-based ramp", "Skill scorecards", "Day-90 gate"],
        visual: "radial",
      },
      {
        icon: "BarChart3",
        title: "Progress without guesswork",
        description: "Weekly telemetry shows exactly where your hire is against plan — attendance, assessment scores and mentor notes in one view.",
        bullets: ["Live dashboards", "Early-risk alerts", "Manager weekly digest"],
        visual: "dashboard",
      },
      {
        icon: "BadgeCheck",
        title: "Certification that counts",
        description: "Graduation is a practical assessment on your actual workflows, signed off by your own reviewers — not a certificate of attendance.",
        bullets: ["Work-based assessment", "Verifier sign-off", "Portable credential"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What's included in every Hire to Train engagement",
    deliverables: [
      "Role profile & aptitude benchmark workshop",
      "AI-scored candidate shortlist in 10 days",
      "Structured interview kit & loops",
      "Offer, onboarding & paperwork support",
      "Personalised 90-day ramp plan",
      "Dedicated mentor + weekly scorecards",
      "Day-90 practical certification",
      "Free replacement cover to day 90",
    ],

    modulesTitle: "On-the-job training tracks",
    modules: [
      { icon: "Code", tag: "Engineering", title: "Software Engineering Ramp", description: "Language, framework and codebase fluency built on your live repos and review standards." },
      { icon: "Cloud", tag: "Infrastructure", title: "Cloud & DevOps Ramp", description: "CI/CD, observability and incident practice inside your actual environments, sandboxed safely." },
      { icon: "Database", tag: "Data", title: "Data & Analytics Ramp", description: "SQL, pipelines and dashboards trained on your warehouse and reporting conventions." },
      { icon: "BrainCircuit", tag: "AI", title: "AI & Automation Ramp", description: "Prompting, evaluation and agent workflows learned on your production use cases." },
      { icon: "MessageSquare", tag: "Support", title: "Customer Ops Ramp", description: "Product depth, tooling and tone-of-voice coaching on real customer conversations." },
      { icon: "BarChart3", tag: "Business", title: "Sales & Revenue Ramp", description: "Playbooks, CRM hygiene and discovery skills practised on live pipeline with call reviews." },
    ],

    tech: {
      title: "The ramp engine behind every hire",
      description: "STIOOS's Talent OS turns a promising hire into a certified role expert — with telemetry your managers actually read.",
      points: [
        { icon: "Brain", title: "Aptitude modelling", description: "Screening predicts ramp success, weighing learning velocity and problem-solving patterns." },
        { icon: "CalendarDays", title: "Ramp plan orchestration", description: "Milestones, mentor syncs and checkpoints scheduled and tracked automatically." },
        { icon: "BarChart3", title: "Weekly scorecards", description: "Skill-by-skill progress streamed to your managers — risks flagged while they're still cheap." },
        { icon: "Lock", title: "Privacy-first handling", description: "ISO 27001-aligned treatment of candidate data, assessments and client workflows." },
      ],
      stats: [
        { value: "90", label: "Days to certification" },
        { value: "12", label: "Telemetry signals tracked" },
      ],
    },

    coverage: {
      title: "Roles we hire-and-train into",
      note: "Need a role that's not listed? We benchmark aptitude and build the ramp in about two weeks.",
      chips: [
        "Junior Developers", "QA Engineers", "Support Engineers", "Data Analysts",
        "DevOps Associates", "Sales Development", "Customer Success", "Business Analysts",
        "Marketing Ops", "Finance Ops", "IT Helpdesk", "Product Associates",
      ],
      stats: [
        { value: "5,200+", label: "Hires ramped" },
        { value: "60+", label: "Role templates" },
        { value: "18", label: "Countries hired in" },
      ],
    },

    modelsTitle: "Engagement models",
    models: [
      {
        name: "Single Role Ramp",
        price: "Per hire",
        period: "1–3 hires",
        description: "One critical role, screened and trained into on your timeline. Ideal for a first taste of attitude-first hiring.",
        features: ["Aptitude shortlist in 10 days", "90-day ramp plan", "Mentor + weekly scorecards", "Free replacement cover"],
        popular: false,
        cta: { label: "Start with one role", href: "/contact" },
      },
      {
        name: "Team Build",
        price: "Per pod",
        period: "4–12 hires",
        description: "A mixed-seniority pod hired for potential and ramped together — the fastest way to stand up a new team.",
        features: ["Multi-role screening", "Group cohort ramp", "Shared mentor pod", "Quarterly capability review"],
        popular: true,
        cta: { label: "Plan a team build", href: "/contact" },
      },
      {
        name: "Growth Engine",
        price: "Custom",
        period: "Rolling intake",
        description: "An always-on hiring-and-ramping line that feeds your org every month, tuned to your attrition and growth plan.",
        features: ["Monthly intake cohorts", "Multi-department ramps", "Executive dashboard", "Custom SLAs"],
        popular: false,
        cta: { label: "Talk to enterprise team", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "82%", label: "Productive by day 90", progress: 82 },
      { value: "89%", label: "12-month retention", progress: 89 },
      { value: "4.7/5", label: "Manager satisfaction", progress: 94 },
      { value: "45%", label: "Cost saving vs senior hire", progress: 45 },
    ],

    testimonials: [
      {
        quote: "We stopped competing for senior engineers and started hiring for slope. Three of our four tech leads today came through hire-and-train — they know our systems better than anyone we could have bought.",
        name: "Marcus Delaney", role: "CTO, Cartwheel Logistics", initials: "MD", rating: 5,
      },
      {
        quote: "The weekly scorecards were the difference. I could see exactly where my new analyst was ahead or behind the ramp plan — and so could she. No ambiguity, no surprises.",
        name: "Grace Lin", role: "Director of Ops, Meridian Health", initials: "GL", rating: 5,
      },
      {
        quote: "I flunked three 'years of experience' filters before STIOOS screened me on how I think. Hired in week two, certified on the real stack by day 85.",
        name: "Tomás Rivera", role: "Data Analyst, placed 2024", initials: "TR", rating: 5,
      },
    ],

    caseStudy: {
      industry: "Logistics",
      title: "Logistics operator staffs a 24-strong support org without a single senior hire",
      challenge: "A national logistics platform needed 24 support and ops engineers but faced a 9-month senior-hiring backlog and 40% attrition in the role.",
      solution: "We hired 24 candidates on aptitude across three intakes and ran the full ramp — mentors, scorecards and day-90 certification — on their live ticketing stack.",
      results: [
        { value: "24", label: "Hires certified" },
        { value: "9 wks", label: "Median to full ramp" },
        { value: "-40%", label: "First-year attrition" },
      ],
    },

    comparisonTitle: "Hire to Train vs. traditional senior hiring",
    comparison: [
      { traditional: "3–6 months chasing scarce senior talent", withUs: "Offer out in 2–3 weeks on aptitude signals" },
      { traditional: "Premium salaries for unproven CVs", withUs: "Market-fair pay for verified potential" },
      { traditional: "Sink-or-swim onboarding", withUs: "Mentor-led 90-day ramp with scorecards" },
      { traditional: "Miss-hire costs absorbed by you", withUs: "Free replacement inside the ramp window" },
      { traditional: "Skills assumed from interviews", withUs: "Skills certified on your live workflows" },
      { traditional: "New hires poached within a year", withUs: "Invested hires who stay and grow" },
    ],

    industries: [
      "Logistics", "FinTech", "Healthcare", "E-commerce", "SaaS",
      "Telecom", "Manufacturing", "Retail", "Public Sector", "Media",
    ],

    regions: [
      { region: "North America", cities: "Chicago · Denver · Mexico City", note: "CST coverage" },
      { region: "Europe", cities: "Dublin · Warsaw · Lisbon", note: "GMT–CET coverage" },
      { region: "Middle East", cities: "Dubai · Doha", note: "GST coverage" },
      { region: "Asia Pacific", cities: "Pune · Kuala Lumpur · Auckland", note: "IST–SGT coverage" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "90-day replacement", description: "If a hire misses the ramp gate, we replace them free — no re-fee, no re-scoping." },
      { icon: "FileText", title: "Ramp plan in writing", description: "Milestones and certification criteria agreed and signed before day one." },
      { icon: "Handshake", title: "Success-based fees", description: "You pay when your hire starts — not for shortlists or interviews." },
      { icon: "Lock", title: "Confidential screening", description: "Your role brief and assessments never touch competitor pipelines." },
    ],

    experts: [
      { name: "Caleb Wong", role: "Head of Ramp Programs", initials: "CW", specialty: "On-the-job training design", stat: "1,100+ ramps certified" },
      { name: "Freya Nilsson", role: "Principal Aptitude Scientist", initials: "FN", specialty: "Potential assessment", stat: "2M+ candidates screened" },
      { name: "Diego Fuentes", role: "Director, Client Success", initials: "DF", specialty: "Employer partnerships", stat: "97% engagement renewals" },
    ],

    resources: [
      { type: "Framework", title: "The 90-day ramp blueprint", description: "The milestone structure behind 82% day-90 productivity — adaptable to any role.", readTime: "10 min read" },
      { type: "Guide", title: "Interviewing for attitude without the bias", description: "Structured signals that predict slope, and the traps that predict noise.", readTime: "7 min read" },
      { type: "Benchmark", title: "Attitude hire vs. lateral hire: 24-month data", description: "Retention, ramp and cost outcomes across 1,900 placements.", readTime: "14 min read" },
    ],

    faqs: [
      { q: "How is Hire to Train different from Train to Hire?", a: "Train to Hire trains candidates before they join you, in cohort programs. Hire to Train puts a real offer first — your hire joins fast, then we run the structured 90-day ramp on the job. Choose Train to Hire for volume pipelines; choose Hire to Train when speed and attitude matter most." },
      { q: "What kinds of roles fit this model?", a: "Any role with a well-defined workflow and a trainable skill core — junior engineers, QA, support, data, sales development and ops. Highly specialised leadership roles are better served by our Talent Sourcing service." },
      { q: "Who employs the candidate?", a: "You do, from day one. The hire is on your payroll and embedded in your team; STIOOS runs the screening, ramp plan, mentorship and certification layer around the employment." },
      { q: "How do you screen for 'attitude' without bias?", a: "Structured, AI-scored assessments of learning velocity, problem-solving and communication — the same instrument for every candidate, benchmarked against outcomes from thousands of prior ramps. No free-form gut-feel interviews." },
      { q: "What if the hire isn't ramping?", a: "Weekly scorecards surface risk early, and the mentor plan adjusts first. If a hire still misses the day-90 certification gate, we replace them free under the 90-day guarantee." },
      { q: "How fast can we have someone in seat?", a: "Shortlists in about 10 days, offers and onboarding typically complete within 2–3 weeks of brief — then the 90-day ramp begins immediately." },
    ],

    ctaBand: {
      kicker: "Start hiring differently",
      title: "Your next great hire is waiting on aptitude, not experience",
      primary: {
        kicker: "For Employers",
        title: "Benchmark a role in 30 minutes",
        text: "Bring one open role — leave with an aptitude benchmark, ramp plan and pricing.",
        cta: { label: "Book the session", href: "/contact" },
      },
      secondary: {
        kicker: "For Job Seekers",
        title: "Get hired for your slope",
        text: "One screen, a real offer, and a mentor-led first 90 days on a genuine career track.",
        cta: { label: "Take the screen", href: "/talent-solutions#placements" },
      },
    },

    contact: {
      title: "Want to pressure-test the model?",
      note: "Our ramp strategists will walk your role profile and show real scorecard data — no pitch deck.",
      channels: [
        { icon: "Phone", label: "Call the ramp desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email the team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book a consult", value: "30-min role review", href: "/contact" },
      ],
    },
  },
  {
    slug: "corporate-training",
    group: "talent",
    accent: "amber",
    nav: "Corporate Training",

    eyebrow: "Talent Solutions · Enterprise Training",
    title: "Enterprise upskilling at scale:",
    highlight: "a workforce ready for what's next",
    subtitle:
      "Custom curricula and cohort programs that upskill hundreds or thousands of existing employees at once — technology, data, AI and leadership tracks with L&D ROI you can actually measure.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "Browse L&D resources", href: "/resources" },
    heroStats: [
      { value: "28,000+", label: "Employees upskilled" },
      { value: "140+", label: "Enterprise programs" },
      { value: "3.4x", label: "Median L&D ROI" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "Cohorts of 50–5,000",
      "Custom curricula",
      "Pre/post skill metrics",
      "18 delivery languages",
      "4.9/5 learner rating",
    ],

    kpis: [
      { icon: "GraduationCap", value: "28,000+", label: "Employees trained", detail: "Across cloud, data, AI, security and leadership tracks since 2019." },
      { icon: "Building2", value: "140+", label: "Enterprise programs", detail: "From 50-person leadership cohorts to 5,000-seat digital academies." },
      { icon: "BarChart3", value: "3.4x", label: "Measured L&D ROI", detail: "Median first-year return on programs with pre/post skill measurement." },
      { icon: "Star", value: "92%", label: "Completion rate", detail: "Cohort delivery with manager checkpoints — 3x typical self-paced e-learning." },
    ],

    audiences: [
      {
        icon: "GraduationCap",
        kicker: "For L&D Leaders",
        title: "Programs that survive contact with the business",
        description: "Off-the-shelf courses don't move business metrics. We co-design curricula from your strategy, your tools and your definition of done.",
        bullets: [
          "Skills audit mapped to your roles",
          "Curricula built on your live systems",
          "Pre/post measurement baked in",
          "Manager toolkit for reinforcement",
        ],
        cta: { label: "Design a program", href: "/contact" },
      },
      {
        icon: "Briefcase",
        kicker: "For Business Leaders",
        title: "Teams shipping in the new stack this quarter",
        description: "Whether it's AI fluency for 2,000 analysts or platform skills for 200 engineers, cohorts learn on real work — not slideware.",
        bullets: [
          "Cohorts scheduled around delivery",
          "Capstones on live business problems",
          "Progress visible to sponsors weekly",
          "Exec-ready ROI reporting",
        ],
        cta: { label: "See the track library", href: "/talent-solutions/corporate-training" },
      },
    ],

    valueProps: [
      { icon: "Target", title: "Strategy-first curricula", description: "Every module ladders up to a business outcome you name — adoption, quality, revenue or risk." },
      { icon: "Layers", title: "Cohorts, not content dumps", description: "Facilitated peer cohorts with live sessions, labs and capstones — the format that finishes." },
      { icon: "BarChart3", title: "ROI you can defend", description: "Pre/post skill deltas, application tracking and business-KPI linkage in one exec dashboard." },
      { icon: "Users", title: "Managers as force multipliers", description: "Built-in manager toolkits turn training into on-the-job application between sessions." },
      { icon: "Globe", title: "Anywhere, any language", description: "Delivery across timezones and 18 languages, with regional case studies and compliance nuance." },
      { icon: "RefreshCw", title: "Curricula that stay current", description: "Tracks are re-validated quarterly against industry shifts — your people never learn last year's stack." },
    ],

    processTitle: "From skills audit to certified waves in one quarter",
    process: [
      { title: "Skills audit & gap map", duration: "Weeks 1–2", description: "We baseline current capability by role and team, then quantify the gap to your target operating model." },
      { title: "Curriculum co-design", duration: "Weeks 3–4", description: "Tracks, labs and capstones are built with your SMEs on your systems, tooling and standards." },
      { title: "Pilot cohort", duration: "Weeks 5–8", description: "One cohort proves the format, surfaces friction and sets the measurement baseline." },
      { title: "Wave rollout", duration: "Weeks 9–20", description: "Cohorts roll by function, region or seniority with scheduling that protects delivery capacity." },
      { title: "Measure & iterate", duration: "Ongoing", description: "Pre/post analytics, application tracking and quarterly curriculum refreshes keep results compounding." },
    ],

    spotlight: [
      {
        icon: "BarChart3",
        title: "L&D reporting the CFO respects",
        description: "Skills deltas, certification rates and business-KPI linkage roll up to a board-ready view — not vanity course-completion stats.",
        bullets: ["Pre/post skill deltas", "Business KPI linkage", "Board-ready exports"],
        visual: "dashboard",
      },
      {
        icon: "Network",
        title: "Pathways mapped per role",
        description: "Every employee sees a personalised pathway from their current skills to the next role — with the exact modules that close the gap.",
        bullets: ["Role-based pathways", "Gap-to-module mapping", "Progress milestones"],
        visual: "network",
      },
      {
        icon: "Users",
        title: "Cohort energy at any size",
        description: "Facilitators, peer pods and manager checkpoints keep 50 or 5,000 learners engaged to the finish line.",
        bullets: ["Peer learning pods", "Live facilitation", "Manager checkpoints"],
        visual: "radial",
      },
    ],

    deliverablesTitle: "What's included in every Corporate Training program",
    deliverables: [
      "Enterprise skills audit & gap map",
      "Custom curriculum & lab design",
      "Pilot cohort with baseline metrics",
      "Wave rollout scheduling & comms kit",
      "Facilitator-led live sessions & labs",
      "Manager reinforcement toolkit",
      "Exec ROI dashboard & reporting",
      "Quarterly curriculum refresh",
    ],

    modulesTitle: "Track library to compose from",
    modules: [
      { icon: "Cloud", tag: "Technology", title: "Cloud & Platform Skills", description: "Cloud fundamentals to advanced architecture, taught on your provider and landing zones." },
      { icon: "BrainCircuit", tag: "AI", title: "AI Fluency & LLM at Work", description: "Prompting, tooling and governance for every desk — plus deep tracks for engineering teams." },
      { icon: "Database", tag: "Data", title: "Data Literacy to Analytics", description: "From spreadsheet confidence to SQL, dashboards and decision storytelling for business teams." },
      { icon: "Award", tag: "Leadership", title: "People Leadership", description: "Coaching, feedback and change leadership for new and mid-level managers, practised on real scenarios." },
      { icon: "ShieldCheck", tag: "Security", title: "Security & Compliance", description: "Cyber hygiene for all staff plus role-specific tracks aligned to your regulatory regime." },
      { icon: "MessageSquare", tag: "Communication", title: "Client & Executive Communication", description: "Narrative, negotiation and stakeholder skills for customer-facing and leadership audiences." },
    ],

    tech: {
      title: "The STIOOS Learning OS behind every program",
      description: "One platform runs enrolment, cohort telemetry, assessment and exec reporting — integrated with your HRIS and SSO.",
      points: [
        { icon: "Brain", title: "Adaptive pathways", description: "Content difficulty and sequence adjust to each learner's assessment results." },
        { icon: "Video", title: "Live + on-demand delivery", description: "Facilitated sessions recorded and indexed into searchable, captioned libraries." },
        { icon: "BarChart3", title: "Skills telemetry", description: "Assessment scores, lab completion and application tracking in one graph." },
        { icon: "Lock", title: "Enterprise governance", description: "SSO, HRIS integration, data residency and ISO 27001-aligned handling." },
      ],
      stats: [
        { value: "60+", label: "Ready-made tracks" },
        { value: "18", label: "Delivery languages" },
      ],
    },

    coverage: {
      title: "Skills we train at enterprise scale",
      note: "Need a track that isn't listed? Custom curriculum build takes about four weeks from brief.",
      chips: [
        "Cloud Fundamentals", "Generative AI at Work", "Data Storytelling", "Python for Analysts",
        "Agile Delivery", "Product Management", "Cyber Hygiene", "People Leadership",
        "Negotiation Skills", "Design Thinking", "Sales Excellence", "Change Management",
      ],
      stats: [
        { value: "60+", label: "Track library" },
        { value: "5,000", label: "Largest cohort" },
        { value: "18", label: "Languages" },
      ],
    },

    modelsTitle: "Engagement models",
    models: [
      {
        name: "Sprint Program",
        price: "Per cohort",
        period: "20–200 people",
        description: "One focused track for one audience, delivered in weeks. Ideal for urgent capability gaps.",
        features: ["Custom or curated track", "Live sessions + labs", "Pre/post measurement", "Manager toolkit"],
        popular: false,
        cta: { label: "Scope a sprint", href: "/contact" },
      },
      {
        name: "Enterprise Academy",
        price: "Annual",
        period: "Multi-wave",
        description: "A branded academy running waves across functions and regions — the operating system for workforce capability.",
        features: ["Multi-track pathways", "Wave rollout plan", "Exec ROI dashboard", "Quarterly refresh"],
        popular: true,
        cta: { label: "Design the academy", href: "/contact" },
      },
      {
        name: "Transformation Program",
        price: "Custom",
        period: "2–3 year horizon",
        description: "Large-scale reskilling tied to a transformation roadmap — thousands of employees, multiple job families.",
        features: ["Workforce-wide audit", "Multi-year pathway map", "Dedicated academy team", "Custom SLAs"],
        popular: false,
        cta: { label: "Talk to enterprise team", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "92%", label: "Completion rate", progress: 92 },
      { value: "87%", label: "Verified skill lift", progress: 87 },
      { value: "4.8/5", label: "Learner rating", progress: 96 },
      { value: "3.4x", label: "Median L&D ROI", progress: 68 },
    ],

    testimonials: [
      {
        quote: "We'd bought three platforms and finished nothing. The academy format — cohorts, managers, capstones on our real systems — finally made learning stick at 2,000-person scale.",
        name: "Ingrid Halvorsen", role: "Chief People Officer, Danske Meridian", initials: "IH", rating: 5,
      },
      {
        quote: "The exec dashboard ended the ROI debate. When the CFO can see skill deltas next to delivery metrics, L&D stops being a cost line.",
        name: "Kwame Mensah", role: "Head of Engineering, Voltaic Grid", initials: "KM", rating: 5,
      },
      {
        quote: "My cohort ran during a live product launch and still finished — the scheduling respect and manager checkpoints made it possible.",
        name: "Rachel Steinberg", role: "Senior PM, Cohort graduate", initials: "RS", rating: 4,
      },
    ],

    caseStudy: {
      industry: "Banking",
      title: "Global bank certifies 4,800 staff on AI and data in nine months",
      challenge: "A retail bank needed AI and data fluency across 12,000 front-line and mid-office staff, with regulators watching and zero appetite for productivity dips.",
      solution: "We built a three-track academy on their live systems, ran waves by region and role, and tied certification to a regulator-visible skills passport.",
      results: [
        { value: "4,800", label: "Staff certified" },
        { value: "3.9x", label: "Program ROI" },
        { value: "-31%", label: "External consulting spend" },
      ],
    },

    comparisonTitle: "Corporate Training vs. ad-hoc course libraries",
    comparison: [
      { traditional: "5% completion on self-paced libraries", withUs: "92% completion in facilitated cohorts" },
      { traditional: "Generic content on someone else's stack", withUs: "Labs built on your live systems" },
      { traditional: "Completion certificates as proof", withUs: "Pre/post verified skill deltas" },
      { traditional: "ROI asserted in year-end decks", withUs: "Business-KPI linkage in exec dashboards" },
      { traditional: "Managers hear about it last", withUs: "Manager toolkits drive between-session application" },
      { traditional: "Content ages out in a year", withUs: "Quarterly curriculum refresh included" },
    ],

    industries: [
      "Banking", "Insurance", "Healthcare", "Telecom", "Manufacturing",
      "Retail", "Energy", "Public Sector", "Logistics", "Media",
    ],

    regions: [
      { region: "North America", cities: "New York · Chicago · San Francisco", note: "EST–PST coverage" },
      { region: "Europe", cities: "Frankfurt · Paris · Madrid", note: "CET coverage" },
      { region: "Middle East & Africa", cities: "Dubai · Nairobi · Johannesburg", note: "GST–SAST coverage" },
      { region: "Asia Pacific", cities: "Mumbai · Tokyo · Melbourne", note: "IST–AEST coverage" },
    ],

    guarantees: [
      { icon: "BarChart3", title: "Measurement in the contract", description: "Pre/post skill metrics and reporting cadence agreed before kickoff — not negotiated after." },
      { icon: "RefreshCw", title: "Curriculum refresh included", description: "Tracks re-validated quarterly so wave three never teaches wave one's content." },
      { icon: "Users", title: "Manager adoption support", description: "Toolkits, briefings and checkpoint scripts that turn learning into application." },
      { icon: "ShieldCheck", title: "Delivery quality SLA", description: "Facilitator quality and cohort satisfaction thresholds with remediation commitments." },
    ],

    experts: [
      { name: "Anjali Deshmukh", role: "VP, Enterprise Learning", initials: "AD", specialty: "Academy design", stat: "140+ programs launched" },
      { name: "Peter Vaughn", role: "Director, Leadership Practice", initials: "PV", specialty: "Manager development", stat: "9,000 leaders coached" },
      { name: "Leila Haddad", role: "Head of Program Delivery", initials: "LH", specialty: "Global rollout", stat: "5,000-learner peak cohort" },
    ],

    resources: [
      { type: "Playbook", title: "Building the enterprise learning academy", description: "The operating model behind 92% completion at 5,000-learner scale.", readTime: "14 min read" },
      { type: "Guide", title: "Measuring L&D ROI the CFO believes", description: "How to link skill deltas to business KPIs without a data-science project.", readTime: "9 min read" },
      { type: "Report", title: "Enterprise AI fluency benchmarks 2025", description: "Adoption, governance and skill-lift data across 80 enterprise programs.", readTime: "16 min read" },
    ],

    faqs: [
      { q: "How is this different from buying course licenses?", a: "Licenses rent content; we build capability. Cohorts are facilitated, taught on your live systems, reinforced by managers and measured against your business KPIs — which is why completion and application rates run multiples higher than self-paced libraries." },
      { q: "How large can cohorts be?", a: "From 20-person leadership pods to 5,000-learner waves. Large rollouts run as scheduled waves by function, region or seniority, so delivery capacity is protected while the program scales." },
      { q: "Can training happen on our real systems?", a: "Yes — labs and capstones are built on your actual platforms in sandboxed environments. That's where the skill lift happens; generic sandboxes produce generic skills." },
      { q: "How do you measure ROI?", a: "Every program starts with a baseline skills audit and ends with post assessment. We link deltas to operational metrics you choose — quality, velocity, adoption or revenue — and report them in an exec dashboard." },
      { q: "How long until we see results?", a: "A pilot cohort finishes in four to six weeks with measurable pre/post deltas; scaled waves run over the following two quarters. Most clients see the first business-metric movement inside one quarter." },
      { q: "Do you cover leadership and soft-skill tracks too?", a: "Yes — people leadership, change management, negotiation and client communication are among our most-composed tracks, delivered with the same cohort, practice and measurement model as technical programs." },
    ],

    ctaBand: {
      kicker: "Build the capability engine",
      title: "Your competitors are upskilling — your people are ready",
      primary: {
        kicker: "For L&D & Business Leaders",
        title: "Run the skills audit first",
        text: "A 30-minute session maps your biggest capability gap and sketches the program that closes it.",
        cta: { label: "Book the audit session", href: "/contact" },
      },
      secondary: {
        kicker: "Explore more",
        title: "See the full talent platform",
        text: "Training is one pillar — pairing it with hiring and deployment compounds the return.",
        cta: { label: "View Talent Solutions", href: "/talent-solutions" },
      },
    },

    contact: {
      title: "Ready to scope a program?",
      note: "Our learning strategists reply with an outline curriculum and measurement plan — not a brochure.",
      channels: [
        { icon: "Phone", label: "Call the L&D desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email the academy team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book a consult", value: "30-min program scoping", href: "/contact" },
      ],
    },
  },
  {
    slug: "talent-recruitment",
    group: "talent",
    accent: "amber",
    nav: "Talent Sourcing",

    eyebrow: "Talent Solutions · Talent Sourcing",
    title: "The right candidate already exists —",
    highlight: "our AI finds them in 48 hours",
    subtitle:
      "AI-powered sourcing across a 2M+ verified candidate pool surfaces your next hire in days, not months — direct-hire recruitment with shortlists in 48 hours and pay-after-join pricing.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "Explore staffing options", href: "/talent-solutions#staffing-solutions" },
    heroStats: [
      { value: "48h", label: "To first shortlist" },
      { value: "2M+", label: "Verified candidates" },
      { value: "31 days", label: "Median time-to-offer" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "2M+ verified pool",
      "48h shortlist SLA",
      "Direct-hire model",
      "Pay-after-join fees",
      "4.9/5 client rating",
    ],

    kpis: [
      { icon: "Search", value: "2M+", label: "Candidates in graph", detail: "Verified, skill-mapped profiles across 18 countries and 40+ disciplines." },
      { icon: "Clock", value: "48h", label: "Shortlist turnaround", detail: "AI ranking plus human calibration on every brief — no keyword-spam CVs." },
      { icon: "UserCheck", value: "88%", label: "Shortlist-to-interview", detail: "Candidates who clear our screen rarely fall out of your process." },
      { icon: "Wallet", value: "30%", label: "Below agency norms", detail: "Flat success fees with zero padding — invoiced after the join." },
    ],

    audiences: [
      {
        icon: "Building2",
        kicker: "For Hiring Managers",
        title: "A pipeline that starts qualified",
        description: "Stop re-reading the same 400 applications. We search the whole market — including passive talent — and deliver five people worth meeting.",
        bullets: [
          "Skill-verified shortlists in 48 hours",
          "Passive candidates reached directly",
          "Every claim checked before you call",
          "Offer negotiation handled for you",
        ],
        cta: { label: "Brief us on the role", href: "/contact" },
      },
      {
        icon: "Zap",
        kicker: "For Founders & Leaders",
        title: "One search instead of six agency calls",
        description: "A single accountable search partner with flat fees, weekly pipeline reports and a replacement guarantee — across all your open roles.",
        bullets: [
          "One contract, unlimited shortlists",
          "Weekly pipeline transparency",
          "90-day replacement guarantee",
          "Market-rate and benchmark data included",
        ],
        cta: { label: "Compare search plans", href: "/talent-solutions" },
      },
    ],

    valueProps: [
      { icon: "BrainCircuit", title: "Semantics, not keywords", description: "Our engine reads demonstrated skills and trajectory — so a great engineer at a no-name startup outranks a mediocre one at a logo." },
      { icon: "Globe", title: "Passive talent, actually reached", description: "The best candidates aren't applying. Our outreach sequence reaches them — with a 91% reply rate." },
      { icon: "ShieldCheck", title: "Verified before you meet", description: "Employment, skills and credentials are checked up front. No surprises after the offer." },
      { icon: "Clock", title: "Speed with calibration", description: "48-hour shortlists come from AI ranking plus a senior recruiter's judgment call on every name." },
      { icon: "Handshake", title: "Pay after they join", description: "Success fees only, invoiced post-acceptance. You never pay for shortlists or interviews." },
      { icon: "Users", title: "Recruiters who speak your domain", description: "Every search is led by a specialist who has hired in your discipline — not a generalist reading a script." },
    ],

    processTitle: "From role brief to signed offer",
    process: [
      { title: "Deep intake & scorecard", duration: "Day 1", description: "We build the success profile with you — must-haves, nice-to-haves, comp band and the interview scorecard." },
      { title: "AI sourcing sweep", duration: "Days 1–2", description: "The engine sweeps the 2M+ pool, ranks on skill evidence and drafts the outreach shortlist." },
      { title: "Calibrated shortlist", duration: "48h", description: "A senior recruiter verifies interest, screens and hands you five to seven people worth meeting." },
      { title: "Interviews & offer", duration: "Weeks 2–3", description: "We coordinate loops, coach candidates and manage the offer to signature — including counter-offer defense." },
      { title: "Join & guarantee window", duration: "Day 90", description: "Onboarding support through day one, then a 90-day free replacement window for total peace of mind." },
    ],

    spotlight: [
      {
        icon: "BrainCircuit",
        title: "A skill graph, not a keyword index",
        description: "2M+ profiles mapped on demonstrated skills, seniority trajectory and domain depth — searchable the way your hiring managers think.",
        bullets: ["Skill-graph profiling", "Trajectory modelling", "Domain-depth scoring"],
        visual: "network",
      },
      {
        icon: "BarChart3",
        title: "Pipeline transparency in real time",
        description: "See every sourced, contacted, screening and shortlisted candidate in a live dashboard — with funnel analytics by role.",
        bullets: ["Live pipeline view", "Funnel analytics", "Weekly digest"],
        visual: "dashboard",
      },
      {
        icon: "BadgeCheck",
        title: "Verification before introductions",
        description: "Identity, employment history, credentials and skill claims are verified before anyone reaches your calendar.",
        bullets: ["Reference checks", "Credential validation", "Skill verification"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What's included in every Talent Sourcing search",
    deliverables: [
      "Role intake & success scorecard",
      "Market & comp benchmark report",
      "AI-ranked candidate sweep",
      "Calibrated shortlist in 48 hours",
      "Verified profiles with references",
      "Interview coordination & loops",
      "Offer negotiation & counter-offer defense",
      "90-day replacement guarantee",
    ],

    modulesTitle: "Search specialisms",
    modules: [
      { icon: "Code", tag: "Engineering", title: "Software Engineering", description: "Frontend, backend, mobile and platform engineers from mid-level to principal." },
      { icon: "BrainCircuit", tag: "AI & Data", title: "AI & Data Science", description: "ML engineers, data scientists and applied-AI researchers with production track records." },
      { icon: "Cloud", tag: "Infrastructure", title: "Cloud, DevOps & SRE", description: "Platform, reliability and infrastructure specialists across all three major clouds." },
      { icon: "ShieldCheck", tag: "Security", title: "Cybersecurity", description: "AppSec, SOC, GRC and offensive-security talent with verified certifications." },
      { icon: "Briefcase", tag: "Product", title: "Product & Design", description: "Product managers, designers and researchers with shipped, measurable work." },
      { icon: "BarChart3", tag: "Business", title: "Finance, Sales & Ops Leadership", description: "Revenue, finance and operations leaders from head-of to C-level." },
    ],

    tech: {
      title: "Sourcing Intelligence: the engine behind the 48-hour SLA",
      description: "Search, outreach and verification run on one platform — so shortlists are fast and defensible.",
      points: [
        { icon: "Brain", title: "Semantic skill matching", description: "Ranking on demonstrated skill evidence rather than keyword frequency." },
        { icon: "Database", title: "2M+ profile knowledge base", description: "Continuously refreshed, deduplicated and verified candidate graph." },
        { icon: "MessageSquare", title: "Outreach that gets replies", description: "Personalised sequences that reach passive talent — 91% reply rate." },
        { icon: "Lock", title: "Compliant by design", description: "GDPR-aligned sourcing, consent trails and auditable data handling." },
      ],
      stats: [
        { value: "2M+", label: "Profiles mapped" },
        { value: "91%", label: "Outreach reply rate" },
      ],
    },

    coverage: {
      title: "Functions & levels we recruit",
      note: "Executive or niche searches are handled by our dedicated leadership practice — same 48h first contact.",
      chips: [
        "Frontend Engineers", "Backend Engineers", "Data Scientists", "ML Engineers",
        "DevOps & SRE", "Product Managers", "UX Designers", "Security Engineers",
        "Engineering Managers", "Sales Leaders", "Finance Managers", "Delivery Leads",
      ],
      stats: [
        { value: "2M+", label: "Candidate pool" },
        { value: "40+", label: "Disciplines" },
        { value: "18", label: "Countries" },
      ],
    },

    modelsTitle: "Search engagement models",
    models: [
      {
        name: "Focused Search",
        price: "Per role",
        period: "1–3 roles",
        description: "A dedicated search for one critical hire — flat success fee, invoiced after they join.",
        features: ["48h shortlist", "Dedicated search lead", "Offer & counter-offer management", "90-day replacement"],
        popular: false,
        cta: { label: "Start a search", href: "/contact" },
      },
      {
        name: "Growth Retainer",
        price: "Monthly",
        period: "Rolling pipeline",
        description: "A continuous sourcing line for scaling teams — priority intake across all open roles.",
        features: ["Multi-role pipeline", "Priority candidate access", "Weekly strategy reviews", "Market intelligence reports"],
        popular: true,
        cta: { label: "Discuss the retainer", href: "/contact" },
      },
      {
        name: "Executive Search",
        price: "Custom",
        period: "Leadership mandates",
        description: "Discreet, research-led search for C-level and board-adjacent appointments.",
        features: ["Global market mapping", "Confidential process", "Psychometric assessment", "Onboarding advisory"],
        popular: false,
        cta: { label: "Speak to the practice", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "31 days", label: "Median time-to-offer", progress: 78 },
      { value: "94%", label: "Offer-accept rate", progress: 94 },
      { value: "92%", label: "Retention @ 12 months", progress: 92 },
      { value: "4.9/5", label: "Hiring manager rating", progress: 97 },
    ],

    testimonials: [
      {
        quote: "Three agencies chased the same ten active CVs. STIOOS's shortlist arrived in two days — five people, all passive, all verified, and we hired two.",
        name: "Vikram Shah", role: "VP Product, Lumastack", initials: "VS", rating: 5,
      },
      {
        quote: "The pipeline dashboard ended the weekly 'where are we?' calls. I could see every candidate, every touch, every day.",
        name: "Amelia Fontaine", role: "Head of Talent, Volt & Co", initials: "AF", rating: 5,
      },
      {
        quote: "They defended our offer through a heavy counter-offer war. Six months in, our new engineering manager is the best hire we've made.",
        name: "Jordan Blake", role: "Founder, Northcell", initials: "JB", rating: 5,
      },
    ],

    caseStudy: {
      industry: "SaaS",
      title: "Series-B SaaS fills 11 senior roles in a single quarter",
      challenge: "A horizontal-SaaS scale-up had 11 senior openings, two stagnating agency searches and a board deadline before the next fundraise.",
      solution: "We ran a Growth Retainer across all 11 roles with one search lead, weekly exec reporting and unified market benchmarks.",
      results: [
        { value: "11", label: "Senior hires" },
        { value: "26 days", label: "Avg. time-to-offer" },
        { value: "$410k", label: "Saved vs agency fees" },
      ],
    },

    comparisonTitle: "Talent Sourcing vs. traditional agency recruitment",
    comparison: [
      { traditional: "Weeks of waiting for first CVs", withUs: "Calibrated shortlist in 48 hours" },
      { traditional: "Active applicants recycled across clients", withUs: "Passive talent reached directly at 91%" },
      { traditional: "Fees due on interview stages", withUs: "Success fee invoiced after the join" },
      { traditional: "Claims taken on faith", withUs: "Skills, references and credentials verified" },
      { traditional: "Black-box pipelines", withUs: "Live dashboards on every candidate" },
      { traditional: "Backfill billed as a new search", withUs: "90-day free replacement guarantee" },
    ],

    industries: [
      "SaaS", "FinTech", "Healthcare", "E-commerce", "Gaming",
      "Telecom", "Automotive", "Energy", "Public Sector", "Media",
    ],

    regions: [
      { region: "North America", cities: "San Francisco · Austin · Boston", note: "PST–EST coverage" },
      { region: "Europe", cities: "London · Amsterdam · Stockholm", note: "GMT–CET coverage" },
      { region: "Middle East", cities: "Dubai · Tel Aviv", note: "GST–IST coverage" },
      { region: "Asia Pacific", cities: "Singapore · Bengaluru · Tokyo", note: "SGT–JST coverage" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "90-day replacement", description: "If a hire leaves in the guarantee window, the backfill search is free and prioritised." },
      { icon: "Handshake", title: "Pay-after-join", description: "Success fees only, invoiced after acceptance — never for shortlists or interviews." },
      { icon: "Clock", title: "48-hour shortlist SLA", description: "A calibrated shortlist within two business days of brief, or we flag and rescope free." },
      { icon: "Lock", title: "Confidential by default", description: "Your brief, brand and data never shared across client engagements." },
    ],

    experts: [
      { name: "Nadia Rahman", role: "Director of Search", initials: "NR", specialty: "Tech leadership mandates", stat: "700+ placements" },
      { name: "Cedric Laurent", role: "Principal Recruiter, Engineering", initials: "CL", specialty: "Deep-tech sourcing", stat: "94% offer-accept rate" },
      { name: "Yuki Tanaka", role: "Head of Candidate Experience", initials: "YT", specialty: "Passive outreach", stat: "91% reply rate" },
    ],

    resources: [
      { type: "Guide", title: "The 48-hour shortlist method", description: "How intake quality, AI ranking and human calibration compress search cycles.", readTime: "8 min read" },
      { type: "Playbook", title: "Winning passive candidates", description: "Outreach frameworks that convert 91% — with message templates.", readTime: "11 min read" },
      { type: "Report", title: "Global compensation benchmarks 2025", description: "Band data for 40+ tech and business disciplines across 18 countries.", readTime: "18 min read" },
    ],

    faqs: [
      { q: "How do you deliver a shortlist in 48 hours?", a: "The pool is pre-mapped: 2M+ verified profiles sit in our skill graph, so a brief triggers a ranking sweep, not a cold search. A senior recruiter then calibrates interest and fit before anything reaches you — speed without spam." },
      { q: "What does it cost?", a: "Flat success fees agreed per role upfront, invoiced only after your hire accepts. Retainers add monthly platform access and priority intake. There are no charges for shortlists, interviews or withdrawals." },
      { q: "Do you only source active job seekers?", a: "No — most placements come from passive candidates reached through personalised outreach. Active applicants fill the pipeline too, but the differentiator is direct access to people not looking." },
      { q: "How is this different from a staffing agency?", a: "Agencies forward CVs; we deliver verified, calibrated shortlists with live pipeline transparency, market benchmarking and a 90-day replacement guarantee — on one accountable contract." },
      { q: "Can you handle confidential searches?", a: "Yes. Executive and confidential mandates run under strict need-to-know controls, with anonymised briefs and dedicated researcher teams. Nothing crosses between client engagements." },
      { q: "What if the hire doesn't work out?", a: "Every placement carries a 90-day free replacement guarantee in writing. We restart the search immediately at priority status — no re-fee, no re-scoping." },
    ],

    ctaBand: {
      kicker: "Start the search",
      title: "Five people worth meeting are 48 hours away",
      primary: {
        kicker: "For Hiring Managers",
        title: "Send the role brief",
        text: "One 30-minute intake and your shortlist lands within two business days.",
        cta: { label: "Start a search", href: "/contact" },
      },
      secondary: {
        kicker: "For Candidates",
        title: "Join the verified pool",
        text: "Get assessed once, verified, and matched to roles before they're ever advertised.",
        cta: { label: "Join the pool", href: "/talent-solutions#placements" },
      },
    },

    contact: {
      title: "Have a critical role open?",
      note: "Our search leads reply within one business day with a sourcing plan and market snapshot.",
      channels: [
        { icon: "Phone", label: "Call search desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email the search team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book intake call", value: "30-min role intake", href: "/contact" },
      ],
    },
  },
  {
    slug: "talent-deployment",
    group: "talent",
    accent: "amber",
    nav: "Talent Deployment",

    eyebrow: "Talent Solutions · On-Demand Talent",
    title: "Talent that flexes with your roadmap —",
    highlight: "scale up or down in days",
    subtitle:
      "Contract, project-based and on-demand pods of pre-vetted professionals plug into your teams fast — and flex down just as fast when priorities shift. One bench, one invoice, zero admin.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "Compare all engagement models", href: "/talent-solutions#staffing-solutions" },
    heroStats: [
      { value: "5 days", label: "Avg. to kickoff" },
      { value: "1,800+", label: "Pros on the bench" },
      { value: "48h", label: "To flex team size" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "Pre-vetted bench",
      "5-day kickoff",
      "Elastic team sizing",
      "Single monthly invoice",
      "4.8/5 client rating",
    ],

    kpis: [
      { icon: "Users", value: "1,800+", label: "Deployable professionals", detail: "Engineering, data, design and ops talent bench-ready across nine timezones." },
      { icon: "Zap", value: "5 days", label: "Average kickoff", detail: "From signed SOW to first standup — access, tooling and onboarding handled by us." },
      { icon: "RefreshCw", value: "48h", label: "To flex capacity", detail: "Add or release pod members with a ticket — not a renegotiation." },
      { icon: "BarChart3", value: "97%", label: "Scope delivery rate", detail: "Pods delivering against plan, tracked on weekly telemetry." },
    ],

    audiences: [
      {
        icon: "Layers",
        kicker: "For Delivery & Engineering Leads",
        title: "Capacity that arrives integrated",
        description: "Pods don't just join — they onboard into your rituals, repos and definition of done in the first week, coached by a delivery lead.",
        bullets: [
          "Pre-vetted, reference-checked members",
          "Onboards into your stack and rituals",
          "Weekly delivery telemetry from day one",
          "Continuity cover for any absence",
        ],
        cta: { label: "Assemble a pod", href: "/contact" },
      },
      {
        icon: "Wallet",
        kicker: "For Procurement & Finance",
        title: "Flexible spend without the sprawl",
        description: "One contract, one monthly invoice, one compliance regime — with utilisation and cost per pod reported transparently.",
        bullets: [
          "One MSA, rolling pod SOWs",
          "Consolidated monthly billing",
          "Full compliance and IP cover",
          "Utilisation reporting on demand",
        ],
        cta: { label: "See deployment in detail", href: "/talent-solutions/talent-deployment" },
      },
    ],

    valueProps: [
      { icon: "Zap", title: "Days, not quarters", description: "A briefed pod kicks off in five days — hiring, vetting and onboarding already done." },
      { icon: "Layers", title: "Pods shaped to your org", description: "Squads of 3–15 with the exact mix of skills and seniority your roadmap needs." },
      { icon: "RefreshCw", title: "Elastic by design", description: "Scale up for the peak, down for the trough — capacity changes land within 48 hours." },
      { icon: "UserCheck", title: "Vetted before you meet them", description: "Skill assessments, references and background checks complete before introduction." },
      { icon: "FileText", title: "One invoice, zero admin", description: "Contracts, payrolling, equipment and compliance consolidated into a single line item." },
      { icon: "ShieldCheck", title: "Continuity built in", description: "Vacations, illness or exits are covered from the bench without missing a sprint." },
    ],

    processTitle: "From brief to first sprint in five days",
    process: [
      { title: "Capacity brief", duration: "Day 1", description: "We capture the skills mix, seniority, timeline and integration points with your lead." },
      { title: "Pod assembly", duration: "Days 2–4", description: "Members are drawn from the bench, refreshed against assessments and briefed on your context." },
      { title: "Kickoff & integration", duration: "Day 5", description: "Access, tooling and rituals are set; the pod joins standups with a named engagement lead." },
      { title: "Weekly delivery telemetry", duration: "Ongoing", description: "Velocity, quality signals and utilisation stream to your dashboard with a weekly written digest." },
      { title: "Flex, extend or wind down", duration: "Any time", description: "Adjust capacity, convert members to hire, or close out — with documented handover every time." },
    ],

    spotlight: [
      {
        icon: "Gauge",
        title: "Utilisation you can actually see",
        description: "Live telemetry on velocity, review turnaround and quality signals — so pod performance is a metric, not a feeling.",
        bullets: ["Velocity tracking", "Quality signals", "Weekly digest"],
        visual: "dashboard",
      },
      {
        icon: "Network",
        title: "Wired into your workflow",
        description: "Pods integrate into your repos, boards, standups and reviews — operating as your team, not a vendor on the side.",
        bullets: ["Your rituals", "Your tooling", "Named engagement lead"],
        visual: "network",
      },
      {
        icon: "Layers",
        title: "Composable skill pods",
        description: "Compose squads from 14 archetypes — mix seniority, skill and timezone to match the roadmap slice you're funding.",
        bullets: ["14 pod archetypes", "Mix-and-match skills", "Timezone fit"],
        visual: "radial",
      },
    ],

    deliverablesTitle: "What's included in every Talent Deployment engagement",
    deliverables: [
      "Capacity brief & pod blueprint",
      "Pre-vetted members with assessment reports",
      "Day-5 kickoff & access setup",
      "Named engagement lead",
      "Weekly delivery telemetry & digest",
      "48h capacity flexing",
      "Continuity & absence cover",
      "Documented handover on wind-down",
    ],

    modulesTitle: "Pod archetypes on the bench",
    modules: [
      { icon: "Code", tag: "Delivery", title: "Feature Squad", description: "Full-stack squads that take roadmap slices from spec to production." },
      { icon: "BrainCircuit", tag: "AI", title: "AI Enablement Pod", description: "LLM integration, evaluation and guardrail pods for product teams adding AI." },
      { icon: "Database", tag: "Data", title: "Analytics Pod", description: "Pipelines, warehouse modelling and dashboards staffed by a vetted data bench." },
      { icon: "Cloud", tag: "Platform", title: "Cloud Ops Pod", description: "CI/CD, observability and reliability engineering on your cloud of choice." },
      { icon: "Wrench", tag: "Quality", title: "QA Automation Pod", description: "Test architecture, automation suites and release-gate ownership." },
      { icon: "MessageSquare", tag: "Support", title: "Customer Ops Pod", description: "Tier-1/2 support and success operations with tooling and QA built in." },
    ],

    tech: {
      title: "The deployment layer that keeps pods honest",
      description: "Bench management, delivery telemetry and compliance run on one platform — you see what we see.",
      points: [
        { icon: "BarChart3", title: "Delivery telemetry", description: "Velocity, quality and utilisation signals streamed from your tools." },
        { icon: "CalendarDays", title: "Capacity planning", description: "Bench forecasting that keeps your next pod warm before you ask." },
        { icon: "RefreshCw", title: "Instant rebalancing", description: "Skills matching that reshuffles pod composition inside 48 hours." },
        { icon: "Lock", title: "Secure access governance", description: "Least-privilege access, device policy and offboarding hygiene on every engagement." },
      ],
      stats: [
        { value: "5 days", label: "Median kickoff" },
        { value: "24h", label: "Issue response SLA" },
      ],
    },

    coverage: {
      title: "Pod skills ready to deploy",
      note: "Need a niche mix? We assemble custom pods from the wider 2M+ network in about two weeks.",
      chips: [
        "React & Next.js Squads", "Java / Spring Squads", ".NET Squads", "Python Data Pods",
        "DevOps Pods", "QA Automation Pods", "Mobile Squads", "AI / LLM Pods",
        "UX Design Pods", "Salesforce Pods", "SAP Pods", "Support Pods",
      ],
      stats: [
        { value: "1,800+", label: "Bench strength" },
        { value: "14", label: "Pod archetypes" },
        { value: "9", label: "Timezones covered" },
      ],
    },

    modelsTitle: "Deployment models",
    models: [
      {
        name: "Sprint Pod",
        price: "Weekly",
        period: "4–12 weeks",
        description: "A fixed-scope pod for a bounded push — migrations, launches, cleanups or crunch cover.",
        features: ["Fixed weekly rate", "Named engagement lead", "Weekly telemetry", "Wind-down handover"],
        popular: false,
        cta: { label: "Scope a sprint pod", href: "/contact" },
      },
      {
        name: "Managed Pod",
        price: "Monthly",
        period: "3–12 months",
        description: "An ongoing pod with delivery accountability, continuity cover and quarterly composition reviews.",
        features: ["Delivery accountability", "Continuity cover", "48h flexing", "Quarterly reviews"],
        popular: true,
        cta: { label: "Build a managed pod", href: "/contact" },
      },
      {
        name: "Surge Cloud",
        price: "On demand",
        period: "Elastic",
        description: "A standing reserve you draw on for peaks — pay only for capacity consumed, scale in hours.",
        features: ["Pre-agreed rate card", "Hour-level scaling", "Priority bench access", "No minimums"],
        popular: false,
        cta: { label: "Reserve surge capacity", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "5 days", label: "Average kickoff speed", progress: 88 },
      { value: "97%", label: "Scope delivery rate", progress: 97 },
      { value: "72%", label: "Pods extended 6+ months", progress: 72 },
      { value: "35%", label: "Avg. cost vs local contractors", progress: 55 },
    ],

    testimonials: [
      {
        quote: "Peak season used to mean panic-hiring. Now a fourteen-person pod arrives in four days, ships through Black Friday, and quietly scales down after.",
        name: "Lucia Moreno", role: "Director of Engineering, Brightlane", initials: "LM", rating: 5,
      },
      {
        quote: "The weekly telemetry changed the conversation with my steering group — pod velocity next to our own squad velocity, same dashboard.",
        name: "Henrik Dahl", role: "VP Delivery, Nordkap Software", initials: "HD", rating: 5,
      },
      {
        quote: "One invoice instead of eleven contractors with eleven contracts. Procurement signed off in a week and finance stopped chasing timesheets.",
        name: "Ananya Iyer", role: "Head of Product Ops, Zephyr Retail", initials: "AI", rating: 4,
      },
    ],

    caseStudy: {
      industry: "E-commerce",
      title: "Retail platform sails through peak season with a 14-person surge pod",
      challenge: "A fashion marketplace faced a 3x traffic peak with a half-built checkout migration and a hiring freeze on permanent roles.",
      solution: "A managed pod of 14 — engineers, QA and SRE — integrated in four days, took over the migration and ran peak on-call alongside the core team.",
      results: [
        { value: "14", label: "Pod members deployed" },
        { value: "4 days", label: "To full kickoff" },
        { value: "0", label: "Peak-season outages" },
      ],
    },

    comparisonTitle: "Talent Deployment vs. body-shop contracting",
    comparison: [
      { traditional: "6–10 weeks to assemble a team", withUs: "Pods kickoff in five days" },
      { traditional: "Individual contractors, individual risks", withUs: "Managed pods with continuity cover" },
      { traditional: "Renegotiation for every capacity change", withUs: "48h flexing on a ticket" },
      { traditional: "Timesheets, invoices and compliance sprawl", withUs: "One invoice, one compliance regime" },
      { traditional: "Performance visible at review time", withUs: "Weekly delivery telemetry" },
      { traditional: "Knowledge walks out at wind-down", withUs: "Documented handover, every time" },
    ],

    industries: [
      "E-commerce", "FinTech", "SaaS", "Healthcare", "Logistics",
      "Media", "Travel", "Telecom", "Manufacturing", "Public Sector",
    ],

    regions: [
      { region: "North America", cities: "Toronto · Seattle · Dallas", note: "EST–CST coverage" },
      { region: "Europe", cities: "Berlin · Kraków · Amsterdam", note: "CET coverage" },
      { region: "Middle East", cities: "Dubai · Riyadh", note: "GST coverage" },
      { region: "Asia Pacific", cities: "Hyderabad · Ho Chi Minh City · Sydney", note: "IST–AEST coverage" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "Continuity cover", description: "Absences and exits backfilled from the bench without breaking a sprint." },
      { icon: "Clock", title: "48h flex guarantee", description: "Capacity changes land within two business days — in the contract, not the brochure." },
      { icon: "FileText", title: "Transparent billing", description: "One consolidated invoice with rate cards and utilisation attached." },
      { icon: "Handshake", title: "No lock-in", description: "Rolling terms with 30-day wind-down and full documented handover." },
    ],

    experts: [
      { name: "Bianca Ferreira", role: "Director, Deployment Operations", initials: "BF", specialty: "Pod assembly", stat: "600+ pods launched" },
      { name: "Arvid Solberg", role: "Principal Delivery Coach", initials: "AS", specialty: "Team integration", stat: "97% scope delivery" },
      { name: "Maya Krishnan", role: "Head of Bench Quality", initials: "MK", specialty: "Vetting & assessments", stat: "1,800+ pros vetted" },
    ],

    resources: [
      { type: "Playbook", title: "Elastic staffing for product roadmaps", description: "How to plan pods around quarters instead of headcount requests.", readTime: "10 min read" },
      { type: "Guide", title: "Integrating external pods without friction", description: "The onboarding checklist that makes day-five kickoff real.", readTime: "7 min read" },
      { type: "Benchmark", title: "Contract vs. pod economics 2025", description: "Total-cost comparison across nine timezones and 14 pod types.", readTime: "13 min read" },
    ],

    faqs: [
      { q: "How fast can a pod actually start?", a: "Median is five days from signed SOW to first standup. Common archetypes launch fastest because members are pre-vetted and bench-current; bespoke mixes take up to two weeks to assemble." },
      { q: "Who manages the pod day to day?", a: "You do — pods work inside your rituals and report to your leads. A STIOOS engagement lead runs quality, continuity and admin in the background so your managers manage delivery, not vendors." },
      { q: "How does scaling up and down work?", a: "Capacity changes are requested by ticket and land within 48 hours, governed by the rate card in your SOW. Scale down at any time with 30-day notice on the overall engagement — no penalties." },
      { q: "Can we hire pod members permanently?", a: "Yes — conversion is encouraged and priced transparently after an agreed period. Because members have been delivering on your stack, the miss-hire risk is close to zero." },
      { q: "How do you handle compliance and IP?", a: "Contracts, payrolling, background checks, device policy and IP assignment are consolidated under our MSA with full audit trail — one compliance regime instead of one per contractor." },
      { q: "What if a pod member underperforms?", a: "Weekly telemetry surfaces it early, and the engagement lead acts — coaching, rebalancing or replacement from the bench within 48 hours. Continuity cover keeps delivery whole throughout." },
    ],

    ctaBand: {
      kicker: "Capacity without the wait",
      title: "Your next sprint could start Monday with a full pod",
      primary: {
        kicker: "For Delivery Leads",
        title: "Blueprint your pod",
        text: "Bring a roadmap slice — leave with pod composition, timeline and a weekly rate card.",
        cta: { label: "Blueprint my pod", href: "/contact" },
      },
      secondary: {
        kicker: "For Longer-Term Needs",
        title: "Pair pods with a pipeline",
        text: "Deployment covers today; Train to Hire and staffing cover the next 12 months.",
        cta: { label: "See all talent services", href: "/talent-solutions" },
      },
    },

    contact: {
      title: "Need capacity this month?",
      note: "Our deployment desk replies same day with bench availability for your skill mix.",
      channels: [
        { icon: "Phone", label: "Call deployment desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email the pod team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book a scoping call", value: "30-min capacity brief", href: "/contact" },
      ],
    },
  },
  {
    slug: "workforce-solutions",
    group: "talent",
    accent: "amber",
    nav: "Workforce Solutions",

    eyebrow: "Talent Solutions · Full Lifecycle",
    title: "Your entire workforce lifecycle —",
    highlight: "one accountable partner",
    subtitle:
      "Planning, hiring, onboarding, management, retention and analytics — an end-to-end operating partner for the workforce decisions that used to live in six different vendors.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "Why one partner", href: "/about" },
    heroStats: [
      { value: "6→1", label: "Vendors consolidated" },
      { value: "-24%", label: "Total workforce cost" },
      { value: "+18pts", label: "Retention lift" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "End-to-end lifecycle",
      "Unified people analytics",
      "24 countries operated",
      "90-day replacement",
      "4.9/5 partner rating",
    ],

    kpis: [
      { icon: "Compass", value: "360°", label: "Lifecycle coverage", detail: "Plan, hire, onboard, manage, retain and analyse under one operating model." },
      { icon: "BarChart3", value: "-24%", label: "Total workforce cost", detail: "Median first-year saving across consolidated enterprise accounts." },
      { icon: "HeartHandshake", value: "+18pts", label: "Retention improvement", detail: "12-month retention lift versus pre-partner baseline." },
      { icon: "Layers", value: "6→1", label: "Vendors consolidated", detail: "Typical vendor sprawl replaced by one accountable partner and contract." },
    ],

    audiences: [
      {
        icon: "Briefcase",
        kicker: "For CHROs & COOs",
        title: "One throat to choke, one truth to trust",
        description: "When planning, hiring and retention live in different vendors, nobody owns the outcome. We put the whole lifecycle under one roof — and one contract.",
        bullets: [
          "Single accountable partnership",
          "One workforce data model",
          "Unified vendor and spend governance",
          "Quarterly value reporting to the board",
        ],
        cta: { label: "Request a diagnostic", href: "/contact" },
      },
      {
        icon: "Compass",
        kicker: "For Transformation Leaders",
        title: "Workforce plans that survive replanning",
        description: "Transformations fail on people logistics, not strategy. We build the workforce engine that re-plans as fast as your roadmap does.",
        bullets: [
          "Scenario-based workforce modelling",
          "Hiring, training and deployment in one motion",
          "Compliance across every market you enter",
          "Analytics that flag risk before it lands",
        ],
        cta: { label: "See the lifecycle model", href: "/talent-solutions/workforce-solutions" },
      },
    ],

    valueProps: [
      { icon: "Compass", title: "One strategy, one owner", description: "A single workforce plan governs hiring, training, deployment and retention — no more vendors optimizing their own slice." },
      { icon: "Network", title: "Every signal in one place", description: "ATS, LMS, deployment and attrition data unified into one graph your leaders can actually query." },
      { icon: "ShieldCheck", title: "Compliance across borders", description: "Contracts, payrolling and data residency handled per market — expansion stops being a legal project." },
      { icon: "TrendingUp", title: "Planning that anticipates", description: "Predictive models flag capability gaps and attrition risk two quarters before they bite." },
      { icon: "HeartHandshake", title: "Retention by design", description: "Engagement, growth paths and manager quality treated as engineered systems, not HR wishes." },
      { icon: "BarChart3", title: "Decisions backed by data", description: "Every quarterly review ships with cost, quality and retention analytics — not anecdotes." },
    ],

    processTitle: "How a workforce partnership unfolds",
    process: [
      { title: "Workforce diagnostic", duration: "Weeks 1–3", description: "We audit capability, cost, attrition and vendor sprawl, then quantify the consolidated-state opportunity." },
      { title: "Plan & roadmap", duration: "Weeks 4–6", description: "A scenario-based workforce plan with hiring, training, deployment and retention milestones — signed by your exec team." },
      { title: "Activation", duration: "Weeks 7–12", description: "First hires sourced, first cohorts trained, first pods deployed — early wins inside one quarter." },
      { title: "Managed operations", duration: "Ongoing", description: "The lifecycle runs: pipelines fill, academies teach, telemetry streams, issues get owned by named leads." },
      { title: "Quarterly business reviews", duration: "Every quarter", description: "Cost, quality and retention reviewed against plan; the roadmap re-forecast with your leadership." },
    ],

    spotlight: [
      {
        icon: "Network",
        title: "A single workforce graph",
        description: "Skills, roles, cost and performance unified across hires, employees and contingent staff — one query answers what used to take six reports.",
        bullets: ["Unified people data", "Role & skill mapping", "Cost transparency"],
        visual: "network",
      },
      {
        icon: "BarChart3",
        title: "Analytics the board can act on",
        description: "Attrition risk, capability gaps and cost-per-outcome modelled in one executive view — refreshed continuously, not annually.",
        bullets: ["Predictive attrition flags", "Capability gap forecasts", "Cost-per-outcome models"],
        visual: "dashboard",
      },
      {
        icon: "HeartHandshake",
        title: "Retention as a designed system",
        description: "Growth paths, manager coaching and early-warning signals engineered into the lifecycle — because replacing a person costs 6–9 months of salary.",
        bullets: ["Growth path design", "Manager coaching loops", "Early-warning signals"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What's included in a Workforce Solutions partnership",
    deliverables: [
      "Workforce diagnostic & baseline report",
      "Scenario-based workforce plan",
      "Sourcing & hiring engine",
      "Onboarding & academy programs",
      "Contract & permanent deployment",
      "Retention & engagement programs",
      "Unified workforce analytics platform",
      "Quarterly business reviews",
    ],

    modulesTitle: "Lifecycle modules to compose",
    modules: [
      { icon: "Compass", tag: "Plan", title: "Workforce Planning", description: "Scenario modelling for capability, cost and location mix across your horizon." },
      { icon: "UserCheck", tag: "Hire", title: "Acquisition & Sourcing", description: "AI-powered sourcing and direct-hire recruitment tuned to your workforce plan." },
      { icon: "GraduationCap", tag: "Develop", title: "Onboarding & Upskilling", description: "Academies and hire-to-train ramps that make new capability productive fast." },
      { icon: "Users", tag: "Manage", title: "Workforce Management", description: "Deployment, capacity and performance operations for employees and contingent staff." },
      { icon: "HeartHandshake", tag: "Retain", title: "Engagement & Retention", description: "Growth paths, manager enablement and early-warning programs that keep your best people." },
      { icon: "BarChart3", tag: "Analyse", title: "Workforce Analytics", description: "Unified reporting on cost, capability and risk — the system of record for people decisions." },
    ],

    tech: {
      title: "One Workforce OS from plan to retention",
      description: "A single platform layer connects your HRIS, ATS, LMS and deployment telemetry into one governed data model.",
      points: [
        { icon: "Database", title: "Unified people data", description: "One schema across hiring, learning, deployment and attrition signals." },
        { icon: "Brain", title: "Predictive modelling", description: "Attrition, capability-gap and cost forecasts with explainable drivers." },
        { icon: "BarChart3", title: "Executive dashboards", description: "Board-ready views with quarterly narratives generated from live data." },
        { icon: "Lock", title: "Sovereign & compliant", description: "Regional data residency, role-based access and ISO 27001-aligned governance." },
      ],
      stats: [
        { value: "14", label: "Systems we integrate" },
        { value: "1", label: "Source of truth" },
      ],
    },

    coverage: {
      title: "Lifecycle capabilities under one contract",
      note: "Start with one stage or hand us the whole lifecycle — the operating model scales either way.",
      chips: [
        "Workforce Planning", "Talent Acquisition", "Contract Staffing", "Train to Hire",
        "Onboarding Design", "L&D Academies", "Performance Management", "Compensation Benchmarks",
        "Retention Analytics", "Offboarding & Redeployment", "Contingent Workforce", "Workforce Compliance",
      ],
      stats: [
        { value: "6", label: "Lifecycle stages" },
        { value: "40+", label: "Sub-services" },
        { value: "24", label: "Countries operated" },
      ],
    },

    modelsTitle: "Partnership models",
    models: [
      {
        name: "Lifecycle Audit",
        price: "Fixed fee",
        period: "4–6 weeks",
        description: "A deep diagnostic of capability, cost, attrition and vendor sprawl — with a quantified consolidation case.",
        features: ["Capability & cost baseline", "Vendor spend review", "Consolidation business case", "Exec readout"],
        popular: false,
        cta: { label: "Commission the audit", href: "/contact" },
      },
      {
        name: "Managed Partnership",
        price: "Annual",
        period: "End-to-end",
        description: "The full lifecycle run as one service with shared KPIs — the model behind our -24% median cost reduction.",
        features: ["One accountable contract", "Shared KPI framework", "Quarterly business reviews", "Dedicated partner team"],
        popular: true,
        cta: { label: "Discuss partnership", href: "/contact" },
      },
      {
        name: "Transformation Program",
        price: "Custom",
        period: "Multi-year",
        description: "Workforce change tied to a business transformation — restructurings, market entries and capability rebuilds.",
        features: ["Program governance", "Multi-country execution", "Change & comms support", "Custom SLAs"],
        popular: false,
        cta: { label: "Talk to the practice", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "-24%", label: "Workforce cost reduction", progress: 60 },
      { value: "+18pts", label: "Retention lift", progress: 74 },
      { value: "6→1", label: "Vendors consolidated", progress: 84 },
      { value: "9/10", label: "Exec sponsors renew", progress: 90 },
    ],

    testimonials: [
      {
        quote: "Six vendors became one partnership and, honestly, one meeting. The quarterly review is the only workforce meeting I never skip.",
        name: "Claire Dubois", role: "Chief People Officer, Verantis Group", initials: "CD", rating: 5,
      },
      {
        quote: "We entered three new markets in a year. Workforce compliance, hiring and training arrived as one package instead of three legal projects.",
        name: "Samuel Adeyemi", role: "COO, Harborline Freight", initials: "SA", rating: 5,
      },
      {
        quote: "The attrition model flagged a resignation cluster two quarters out. We intervened early and kept an entire delivery unit intact.",
        name: "Nikhil Verma", role: "SVP Transformation, Oberon Insurance", initials: "NV", rating: 5,
      },
    ],

    caseStudy: {
      industry: "Insurance",
      title: "Insurer consolidates six workforce vendors into one lifecycle partner",
      challenge: "A multi-country insurer ran sourcing, staffing, training and analytics through six vendors — with 34% annual attrition and no single workforce view.",
      solution: "One managed partnership replaced the stack: unified data model, consolidated hiring and academies, retention programs with early-warning analytics.",
      results: [
        { value: "-27%", label: "Workforce cost" },
        { value: "6→1", label: "Vendors consolidated" },
        { value: "+21pts", label: "12-month retention" },
      ],
    },

    comparisonTitle: "One partner vs. vendor sprawl",
    comparison: [
      { traditional: "Six vendors, six contracts, six truths", withUs: "One partner, one data model" },
      { traditional: "Each vendor optimises its own slice", withUs: "Whole-lifecycle outcomes owned end to end" },
      { traditional: "Annual vendor reviews, anecdotal", withUs: "Quarterly reviews, analytics-led" },
      { traditional: "Handoffs lose candidates and context", withUs: "One team from plan to retention" },
      { traditional: "Compliance rebuilt per market, per vendor", withUs: "One compliance regime across 24 countries" },
      { traditional: "Nobody owns the retention number", withUs: "Shared KPIs make retention contractual" },
    ],

    industries: [
      "Insurance", "Banking", "Manufacturing", "Healthcare", "Logistics",
      "Retail", "Telecom", "Energy", "Public Sector", "Automotive",
    ],

    regions: [
      { region: "North America", cities: "New York · Toronto", note: "EST coverage" },
      { region: "Europe", cities: "London · Zurich · Warsaw", note: "GMT–CET coverage" },
      { region: "Middle East & Africa", cities: "Dubai · Johannesburg", note: "GST–SAST coverage" },
      { region: "Asia Pacific", cities: "Mumbai · Manila · Melbourne", note: "IST–AEST coverage" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "Single accountability", description: "One contract and one escalation path across the entire lifecycle — no vendor ping-pong." },
      { icon: "FileText", title: "Quarterly value reporting", description: "Cost, quality and retention reported against plan every quarter, in writing." },
      { icon: "Handshake", title: "Skin in the game", description: "A meaningful share of fees tied to the KPIs we set together at kickoff." },
      { icon: "Lock", title: "Data sovereignty", description: "People data stored and processed in-region, with role-based access by default." },
    ],

    experts: [
      { name: "Jonathan Pierce", role: "Managing Partner, Workforce", initials: "JP", specialty: "Lifecycle consolidation", stat: "$120M workforce spend managed" },
      { name: "Zara Ahmed", role: "Principal, People Analytics", initials: "ZA", specialty: "Workforce modelling", stat: "18pt avg retention lift" },
      { name: "Lukas Weber", role: "Director, Global Delivery", initials: "LW", specialty: "Multi-country operations", stat: "24 countries operated" },
    ],

    resources: [
      { type: "Playbook", title: "The vendor consolidation case", description: "How six vendors become one partnership — with the ROI math inside.", readTime: "12 min read" },
      { type: "Framework", title: "Workforce planning for transformation", description: "Scenario-based planning that survives replanning — templates included.", readTime: "10 min read" },
      { type: "Report", title: "Retention benchmarks 2025", description: "Attrition, cost and program effectiveness across 24 countries.", readTime: "15 min read" },
    ],

    faqs: [
      { q: "We already have HR and procurement teams — do you replace them?", a: "No. We operate as the execution and analytics layer under your policy: your teams keep strategy and governance, we run planning models, pipelines, academies, deployment and reporting with shared KPIs." },
      { q: "Which lifecycle stages should we start with?", a: "Most clients start where pain is loudest — usually sourcing or retention — and expand once the unified data model proves value. The Lifecycle Audit tells you the highest-ROI entry point in five weeks." },
      { q: "How do shared KPIs work?", a: "At kickoff we agree a scorecard — cost per outcome, time-to-fill, retention, quality — and a meaningful share of our fees is tied to it. The scorecard is reviewed in every quarterly business review." },
      { q: "Can you operate in our countries?", a: "We operate across 24 countries with in-region compliance, payrolling and data residency. New markets are activated with a standard four-week readiness process." },
      { q: "What data do you need, and how is it protected?", a: "Role, cost and attrition data at aggregate level to start, deepening as we integrate your HRIS and ATS. Access is role-based, residency is in-region and handling is ISO 27001-aligned." },
      { q: "How is this priced?", a: "The audit is fixed-fee. Managed partnerships are annual with a base retainer plus success components tied to shared KPIs. Transformation programs are scoped per milestone." },
    ],

    ctaBand: {
      kicker: "Own the whole lifecycle",
      title: "One partner changes the math on every people decision",
      primary: {
        kicker: "For CHROs & COOs",
        title: "Start with the diagnostic",
        text: "A five-week audit quantifies your consolidation case — or tells you honestly that you don't need one.",
        cta: { label: "Request the audit", href: "/contact" },
      },
      secondary: {
        kicker: "Explore the platform",
        title: "See every capability",
        text: "Sourcing, training, deployment, assessment and staffing — meet the pieces inside the lifecycle.",
        cta: { label: "View Talent Solutions", href: "/talent-solutions" },
      },
    },

    contact: {
      title: "Let's talk about your workforce math",
      note: "Our workforce partners reply with a first-pass consolidation sketch — not a pitch deck.",
      channels: [
        { icon: "Phone", label: "Call the practice", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email workforce team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book a partner call", value: "45-min exec consult", href: "/contact" },
      ],
    },
  },
  {
    slug: "talent-assessment",
    group: "talent",
    accent: "amber",
    nav: "Talent Assessment",

    eyebrow: "Talent Solutions · AI Assessment",
    title: "Assessments you can actually trust:",
    highlight: "proctored, verifiable, instant",
    subtitle:
      "AI-powered assessments of technical skill, aptitude, communication and job-readiness — proctored, anti-cheat and verifiable. Employers hire on evidence; candidates prove skills no CV can show.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "Prove your skills", href: "/talent-solutions#placements" },
    heroStats: [
      { value: "1.4M", label: "Assessments taken" },
      { value: "400+", label: "Skills assessed" },
      { value: "99.2%", label: "Proctoring accuracy" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "AI-proctored sessions",
      "Verifiable credentials",
      "400+ skill library",
      "24h score turnaround",
      "4.9/5 fairness rating",
    ],

    kpis: [
      { icon: "Video", value: "1.4M", label: "Proctored sessions", detail: "Identity-verified, anti-cheat assessments delivered across 40+ countries." },
      { icon: "Brain", value: "400+", label: "Skills in the library", detail: "Technical, aptitude, communication and job-readiness instruments, psychometrically validated." },
      { icon: "Clock", value: "24h", label: "Score turnaround", detail: "Explainable, item-level scoring with benchmarks — same day for most suites." },
      { icon: "ShieldCheck", value: "99.2%", label: "Integrity detection", detail: "Multi-signal proctoring that flags what screen-sharing can't hide." },
    ],

    audiences: [
      {
        icon: "UserCheck",
        kicker: "For Employers",
        title: "Hire on evidence, not vibes",
        description: "Replace CV guesswork with proctored, benchmarked scores. Every candidate arrives with verifiable proof of the skills the role needs.",
        bullets: [
          "Role-calibrated assessment blueprints",
          "Proctored, anti-cheat sessions",
          "Explainable scores with benchmarks",
          "Structured-interview pairings",
        ],
        cta: { label: "Design an assessment", href: "/contact" },
      },
      {
        icon: "Award",
        kicker: "For Candidates",
        title: "Proof that beats pedigree",
        description: "No brand name? No problem. Pass a proctored assessment and carry a verifiable credential that hiring managers actually trust.",
        bullets: [
          "Free practice mode before you commit",
          "Fair, bias-audited instruments",
          "Shareable verifiable credentials",
          "Results in 24 hours",
        ],
        cta: { label: "Take an assessment", href: "/talent-solutions#placements" },
      },
    ],

    valueProps: [
      { icon: "Brain", title: "Science-backed scoring", description: "Psychometrically validated items calibrated against real job outcomes — not trivia banks." },
      { icon: "Video", title: "Proctoring that travels with the test", description: "Identity checks, environment scanning and multi-signal anomaly detection on every session." },
      { icon: "BadgeCheck", title: "Credentials that verify", description: "Scores ship as tamper-evident, link-verifiable credentials any employer can check in seconds." },
      { icon: "Clock", title: "Assess in minutes, decide in hours", description: "45–90 minute suites with same-day scoring keep candidates warm and pipelines moving." },
      { icon: "Gauge", title: "Benchmarked against outcomes", description: "Scores map to performance percentiles in real roles, so cutoffs mean something." },
      { icon: "Lock", title: "Fair, private, compliant", description: "Bias-audited instruments, GDPR-aligned data handling and accessibility by default." },
    ],

    processTitle: "From blueprint to decision in three days",
    process: [
      { title: "Blueprint the assessment", duration: "Day 1", description: "We map the role's critical skills to instruments, cutoffs and benchmarks with your hiring team." },
      { title: "Invite & identity-verify", duration: "Day 2", description: "Candidates receive secure links; government-ID and liveness checks gate entry to the session." },
      { title: "AI-proctored session", duration: "Day 2", description: "45–90 minutes under multi-signal proctoring — adaptive difficulty keeps it fair and fast." },
      { title: "Score & explainable report", duration: "Day 3", description: "Item-level scoring with strengths, gaps and benchmarks — readable by recruiters and engineers alike." },
      { title: "Decision support", duration: "Day 3+", description: "Shortlists ranked by verified evidence, paired with structured-interview guides for the finalists." },
    ],

    spotlight: [
      {
        icon: "BadgeCheck",
        title: "Verifiable skill credentials",
        description: "Every result is a tamper-evident credential with a verification link — recruiters confirm authenticity in seconds, candidates carry proof for life.",
        bullets: ["Tamper-evident", "Link verification", "Candidate-owned"],
        visual: "badge",
      },
      {
        icon: "BarChart3",
        title: "Scores your hiring team can read",
        description: "No cryptic percentiles — each report explains what was measured, how the candidate compares and what to probe in interview.",
        bullets: ["Item-level detail", "Role benchmarks", "Interview probes"],
        visual: "dashboard",
      },
      {
        icon: "Brain",
        title: "Adaptive difficulty, fair by design",
        description: "Item difficulty adjusts to the candidate, shortening sessions while sharpening measurement — audited for bias across demographics.",
        bullets: ["Adaptive items", "Bias-audited", "Accessibility built in"],
        visual: "radial",
      },
    ],

    deliverablesTitle: "What's included in Talent Assessment",
    deliverables: [
      "Role-based assessment blueprint",
      "Access to the 400+ skill library",
      "Proctored sessions with ID verification",
      "Explainable score reports & benchmarks",
      "Verifiable candidate credentials",
      "ATS integration & webhooks",
      "Structured-interview pairing guides",
      "Quarterly bias & fairness audits",
    ],

    modulesTitle: "Assessment suites",
    modules: [
      { icon: "Code", tag: "Technical", title: "Coding & Debugging", description: "Real-world coding, debugging and system-design tasks with automated, explainable scoring." },
      { icon: "Brain", tag: "Aptitude", title: "Cognitive Aptitude Suite", description: "Fluid reasoning, numerical and problem-solving measures predictive of ramp speed." },
      { icon: "MessageSquare", tag: "Communication", title: "Language & Scenario", description: "Spoken and written communication scored on clarity, empathy and domain fluency." },
      { icon: "Briefcase", tag: "Job-Readiness", title: "Situational Judgment", description: "Role-realistic dilemmas that expose judgment, prioritisation and customer instinct." },
      { icon: "Video", tag: "Interview", title: "AI-Assisted Structured Interviews", description: "Consistent question sets with evidence-based scoring guides for every interviewer." },
      { icon: "ShieldCheck", tag: "Integrity", title: "Proctoring & Anti-Cheat", description: "Multi-signal monitoring, plagiarism detection and anomaly forensics on every session." },
    ],

    tech: {
      title: "Assessment infrastructure built for trust",
      description: "Delivery, proctoring, scoring and verification run on one platform — engineered for integrity from the first click.",
      points: [
        { icon: "Video", title: "Multi-signal proctoring", description: "Identity, environment and behaviour signals fused into one integrity score." },
        { icon: "Brain", title: "Validated item banks", description: "Items calibrated against real hiring outcomes, refreshed and bias-audited quarterly." },
        { icon: "BarChart3", title: "Explainable scoring", description: "Every score decomposes into measurable subskills with plain-language evidence." },
        { icon: "Lock", title: "Privacy-first architecture", description: "GDPR-aligned storage, minimal biometrics retention and candidate data rights honored." },
      ],
      stats: [
        { value: "99.2%", label: "Integrity detection" },
        { value: "24h", label: "Score turnaround" },
      ],
    },

    coverage: {
      title: "Skills we assess",
      note: "Need a bespoke instrument for a niche role? Custom blueprint and item build takes about three weeks.",
      chips: [
        "Full-Stack Coding", "Data Science", "SQL & Analytics", "Cloud & DevOps",
        "Cybersecurity", "Cognitive Aptitude", "Verbal Reasoning", "English Proficiency",
        "Situational Judgment", "Customer Empathy", "Sales Discovery", "Leadership Judgment",
      ],
      stats: [
        { value: "400+", label: "Skill tests" },
        { value: "1.4M", label: "Sessions proctored" },
        { value: "40+", label: "Countries" },
      ],
    },

    modelsTitle: "Assessment engagement models",
    models: [
      {
        name: "Pay Per Assessment",
        price: "Per test",
        period: "Any volume",
        description: "Send assessments as you hire — no platform commitment, proctoring and reporting included.",
        features: ["Library access", "Proctoring included", "Score reports", "Verifiable credentials"],
        popular: false,
        cta: { label: "Buy assessments", href: "/contact" },
      },
      {
        name: "Hiring Suite",
        price: "Monthly",
        period: "Teams hiring",
        description: "A standing assessment layer for your funnel — blueprints, ATS integration and analytics.",
        features: ["Role blueprints", "ATS integration", "Funnel analytics", "Interview pairing guides"],
        popular: true,
        cta: { label: "Set up the suite", href: "/contact" },
      },
      {
        name: "Assessment Cloud",
        price: "Custom",
        period: "Org-wide",
        description: "Enterprise assessment infrastructure — custom instruments, SSO, audit trails and dedicated support.",
        features: ["Custom item builds", "SSO & HRIS integration", "Compliance audit trails", "Dedicated success team"],
        popular: false,
        cta: { label: "Talk to enterprise team", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "62%", label: "Fewer mis-hires", progress: 62 },
      { value: "70%", label: "Screening time cut", progress: 70 },
      { value: "4.8/5", label: "Candidate fairness score", progress: 96 },
      { value: "68%", label: "Of clients drop CV screens", progress: 68 },
    ],

    testimonials: [
      {
        quote: "We cut a two-week screening stage to three days and cut mis-hires by more than half. The explainable reports ended our interviewer debates.",
        name: "Danielle Cho", role: "Head of Talent Acquisition, Streamforge", initials: "DC", rating: 5,
      },
      {
        quote: "The proctoring is serious — I stopped wasting loops on polished CVs with thin skills. Scores now set my interview agenda.",
        name: "Omar Farouk", role: "Engineering Manager, Dataqube", initials: "OF", rating: 5,
      },
      {
        quote: "As a career switcher, one verified credential got me three interviews my CV never earned. It took an afternoon to earn it.",
        name: "Isabelle Marchetti", role: "QA Analyst, assessed & hired 2024", initials: "IM", rating: 4,
      },
    ],

    caseStudy: {
      industry: "Healthcare",
      title: "Health-tech group cuts screening time 70% with proctored assessment",
      challenge: "A healthcare-tech group hiring 200 clinical technologists a year relied on CV screens that missed skills and inflated time-to-hire.",
      solution: "Role blueprints, proctored technical and judgment suites, and structured-interview pairings replaced first-stage screening entirely.",
      results: [
        { value: "-70%", label: "Screening time" },
        { value: "12,400", label: "Candidates assessed" },
        { value: "-58%", label: "First-year mis-hires" },
      ],
    },

    comparisonTitle: "STIOOS assessments vs. CV screening",
    comparison: [
      { traditional: "Judging candidates by keywords and logos", withUs: "Judging by proctored, verified skill evidence" },
      { traditional: "Take-home tasks with no integrity checks", withUs: "Anti-cheat proctoring on every session" },
      { traditional: "Interviewer gut feel, inconsistently applied", withUs: "Benchmarked scores with structured probes" },
      { traditional: "Weeks of screening stages", withUs: "Decision-ready results in 24 hours" },
      { traditional: "Claims you can't audit later", withUs: "Tamper-evident verifiable credentials" },
      { traditional: "Bias concerns nobody measures", withUs: "Quarterly bias audits, reviewed with clients" },
    ],

    industries: [
      "Healthcare", "FinTech", "SaaS", "BPO", "E-commerce",
      "Telecom", "Public Sector", "EdTech", "Logistics", "Gaming",
    ],

    regions: [
      { region: "North America", cities: "New York · Vancouver", note: "EST–PST coverage" },
      { region: "Europe", cities: "London · Dublin · Warsaw", note: "GMT–CET coverage" },
      { region: "Middle East", cities: "Dubai · Manama", note: "GST coverage" },
      { region: "Asia Pacific", cities: "Bengaluru · Singapore · Manila", note: "IST–SGT coverage" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "Integrity commitment", description: "Every session proctored and anomaly-logged — flagged results come with forensic evidence." },
      { icon: "Scale", title: "Bias-audited instruments", description: "Quarterly adverse-impact audits with documented remediation on every instrument." },
      { icon: "Clock", title: "24-hour scoring SLA", description: "Explainable reports within a business day — or the assessment fee is waived." },
      { icon: "Lock", title: "Candidate data rights", description: "Minimal retention, in-region storage and candidate access to their own results." },
    ],

    experts: [
      { name: "Meera Subramanian", role: "Chief Assessment Scientist", initials: "MS", specialty: "Psychometrics", stat: "400+ validated instruments" },
      { name: "Oliver Grant", role: "Director, Proctoring Systems", initials: "OG", specialty: "Assessment integrity", stat: "99.2% detection accuracy" },
      { name: "Camila Duarte", role: "Head of Fairness & Bias Audit", initials: "CQ", specialty: "Adverse-impact analysis", stat: "60+ audits published" },
    ],

    resources: [
      { type: "Guide", title: "Designing assessments hiring managers trust", description: "Blueprints, cutoffs and benchmarks — the anatomy of a defensible decision.", readTime: "9 min read" },
      { type: "Report", title: "Assessment integrity in the AI era", description: "What cheating looks like now, and the proctoring signals that catch it.", readTime: "13 min read" },
      { type: "Playbook", title: "Cutting screening time without cutting quality", description: "How three-day funnels outperform six-stage ones — with funnel math.", readTime: "8 min read" },
    ],

    faqs: [
      { q: "How do you stop cheating on remote tests?", a: "Every session runs under multi-signal proctoring: government-ID and liveness checks at entry, environment scanning, and behavioural anomaly detection during the test. Flagged sessions come with forensic evidence so you can act with confidence." },
      { q: "Are the assessments fair to all candidate groups?", a: "Instruments are bias-audited quarterly for adverse impact across demographics, with documented remediation. Adaptive delivery and accessibility options keep sessions fair and as short as psychometrically valid." },
      { q: "What do candidates experience?", a: "A secure link, a five-minute identity and environment check, then a 45–90 minute adaptive session. Results and an explainable report arrive within 24 hours, and candidates keep a verifiable credential they can share." },
      { q: "Can this integrate with our ATS?", a: "Yes — standard connectors and webhooks push invitations, scores and credentials into your ATS, with custom SSO and HRIS integration on the enterprise tier." },
      { q: "Which skills can you assess?", a: "400+ instruments across coding, data, cloud, security, aptitude, communication, situational judgment and leadership. Bespoke instruments for niche roles take about three weeks to build and validate." },
      { q: "How do scores improve hiring decisions?", a: "Scores map to performance percentiles observed in real roles, so cutoffs are evidence-based. Reports include structured interview probes, turning every interview into a targeted confirmation rather than a fishing trip." },
    ],

    ctaBand: {
      kicker: "Decide on evidence",
      title: "Replace the CV pile with proof",
      primary: {
        kicker: "For Employers",
        title: "Blueprint one role free",
        text: "Send one role — we'll design the assessment blueprint and demo a live proctored session.",
        cta: { label: "Request the blueprint", href: "/contact" },
      },
      secondary: {
        kicker: "For Candidates",
        title: "Earn a credential that travels",
        text: "One proctored session, a verifiable credential, and a place in the matched-candidate pool.",
        cta: { label: "Take an assessment", href: "/talent-solutions#placements" },
      },
    },

    contact: {
      title: "Questions about integrity or fairness?",
      note: "Our assessment scientists answer technical and psychometric questions directly — no gatekeeping.",
      channels: [
        { icon: "Phone", label: "Call assessment desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email the science team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book a demo", value: "30-min live session", href: "/contact" },
      ],
    },
  },
  {
    slug: "staffing-solutions",
    group: "talent",
    accent: "amber",
    nav: "Staffing Solutions",

    eyebrow: "Talent Solutions · Flexible Staffing",
    title: "Staffing that moves at your speed —",
    highlight: "48h shortlists, guarantees in writing",
    subtitle:
      "Contract, contract-to-hire, permanent and project-based staffing from one bench — AI-matched shortlists in 48 hours, compliance handled end to end and a 90-day replacement guarantee on every placement.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "See placement services", href: "/talent-solutions#placements" },
    heroStats: [
      { value: "48h", label: "To shortlist" },
      { value: "6,500+", label: "Placements made" },
      { value: "96%", label: "Assignments completed" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "48h shortlist SLA",
      "90-day replacement",
      "Contract & permanent",
      "Compliant payrolling",
      "4.9/5 client rating",
    ],

    kpis: [
      { icon: "Briefcase", value: "6,500+", label: "Placements delivered", detail: "Contract, contract-to-hire, permanent and project-based across 14 industries." },
      { icon: "Clock", value: "48h", label: "Shortlist SLA", detail: "AI-matched, human-calibrated candidate sets on every requirement." },
      { icon: "ShieldCheck", value: "90 days", label: "Replacement guarantee", detail: "Free backfill on every placement — contract and permanent alike." },
      { icon: "Handshake", value: "96%", label: "Assignments completed", detail: "Contractors who finish the term, backed by active engagement management." },
    ],

    audiences: [
      {
        icon: "Users",
        kicker: "For Hiring Teams",
        title: "One requirement, four staffing modes",
        description: "Tell us the outcome you need; we recommend contract, contract-to-hire, permanent or project-based — and staff it from a vetted bench in days.",
        bullets: [
          "48-hour AI-matched shortlists",
          "Rate cards and benchmarks upfront",
          "Payrolling and compliance included",
          "One account team for all modes",
        ],
        cta: { label: "Send a requirement", href: "/contact" },
      },
      {
        icon: "Layers",
        kicker: "For Program Leads",
        title: "Teams assembled for the project, not the payroll",
        description: "Spin up project-based teams with the exact skills and timeline your program needs — then hand back cleanly at close-out.",
        bullets: [
          "Team assembly in under two weeks",
          "Named delivery coordinator",
          "Milestone-based reporting",
          "Clean, documented close-out",
        ],
        cta: { label: "Plan a project team", href: "/talent-solutions/staffing-solutions" },
      },
    ],

    valueProps: [
      { icon: "Clock", title: "48-hour response", description: "A calibrated shortlist within two business days — because requirements age badly." },
      { icon: "UserCheck", title: "Vetted before you see them", description: "Skills assessed, references checked and compliance cleared before anyone hits your inbox." },
      { icon: "Layers", title: "Four modes, one partner", description: "Contract, contract-to-hire, permanent and project-based under one roof — no re-briefing new agencies per mode." },
      { icon: "FileText", title: "Compliance handled end to end", description: "Contracts, right-to-work, payrolling and insurance managed by us, auditable by you." },
      { icon: "ShieldCheck", title: "Guarantees in writing", description: "90-day free replacement on every placement — the clause is standard, not negotiated." },
      { icon: "BarChart3", title: "Market-rate transparency", description: "Live rate and salary benchmarks with every shortlist, so budgets hold up in procurement." },
    ],

    processTitle: "From requirement to productive placement",
    process: [
      { title: "Requirement intake", duration: "Day 1", description: "Skills, seniority, mode, rate band and start date captured — plus the interview scorecard." },
      { title: "AI match & vetting", duration: "Days 1–2", description: "The engine ranks the bench and market; recruiters verify skills, references and availability." },
      { title: "Shortlist & interviews", duration: "Days 2–5", description: "Two to five candidates with rate cards and assessment summaries; interviews booked same week." },
      { title: "Placement & compliance onboarding", duration: "Weeks 1–2", description: "Contracts, right-to-work, equipment and access handled before day one — no admin lands on you." },
      { title: "Engagement management", duration: "Ongoing", description: "Monthly check-ins, timesheet hygiene and the 90-day guarantee window monitored by your account lead." },
    ],

    spotlight: [
      {
        icon: "BrainCircuit",
        title: "Matching that respects nuance",
        description: "Ranking weighs assessed skill, adjacent experience and tenure patterns — so a contractor from your industry beats a generic keyword match.",
        bullets: ["Skill-graph ranking", "Industry adjacency", "Availability aware"],
        visual: "network",
      },
      {
        icon: "ShieldCheck",
        title: "Compliance as a default",
        description: "Right-to-work, contracts, insurance and payrolling are cleared before placement — audit-ready documentation on demand.",
        bullets: ["Right-to-work checks", "Contract management", "Audit-ready records"],
        visual: "badge",
      },
      {
        icon: "BarChart3",
        title: "Live pipeline visibility",
        description: "Every submitted, interviewed and placed candidate in one dashboard — with fill-time and rate analytics per role family.",
        bullets: ["Pipeline tracking", "Fill-time analytics", "Rate benchmarks"],
        visual: "dashboard",
      },
    ],

    deliverablesTitle: "What's included in every Staffing Solutions engagement",
    deliverables: [
      "Requirement intake & role scorecard",
      "Rate benchmark & market snapshot",
      "AI-matched shortlist in 48 hours",
      "Skills assessments & reference checks",
      "Interview coordination & offers",
      "Compliance, payrolling & onboarding",
      "Monthly engagement management",
      "90-day replacement guarantee",
    ],

    modulesTitle: "Staffing modes & services",
    modules: [
      { icon: "Layers", tag: "Contract", title: "Contract Staffing", description: "Skilled professionals on flexible terms from 3 to 12+ months, rate-card transparent." },
      { icon: "Handshake", tag: "Contract-to-Hire", title: "Contract-to-Hire", description: "Try before you commit — a working audition with a transparent conversion fee." },
      { icon: "UserCheck", tag: "Permanent", title: "Permanent Placement", description: "Direct-hire recruitment with verified shortlists and a 90-day replacement guarantee." },
      { icon: "Puzzle", tag: "Project", title: "Project-Based Teams", description: "Full teams assembled for a defined scope, timeline and budget, managed to milestones." },
      { icon: "FileText", tag: "Compliance", title: "Payrolling & Compliance", description: "Contractor onboarding, timesheets, invoicing and audit trails handled centrally." },
      { icon: "Globe", tag: "Global", title: "Cross-Border Staffing", description: "Multi-country placements with local contracts, payrolling and data-residency compliance." },
    ],

    tech: {
      title: "The staffing engine behind the 48-hour SLA",
      description: "Bench data, AI matching and compliance automation run on one platform — so speed never costs rigor.",
      points: [
        { icon: "Brain", title: "AI candidate matching", description: "Ranked on assessed skills, adjacency and availability — refreshed nightly." },
        { icon: "Database", title: "Live bench & market data", description: "Real-time visibility of bench capacity and rate benchmarks by role family." },
        { icon: "FileText", title: "Automated compliance checks", description: "Right-to-work, contract and insurance workflows triggered at submission." },
        { icon: "BarChart3", title: "Client pipeline dashboards", description: "Submission-to-placement analytics shared with your team, live." },
      ],
      stats: [
        { value: "48h", label: "Shortlist SLA" },
        { value: "6,500+", label: "Placements" },
      ],
    },

    coverage: {
      title: "Role families we staff",
      note: "Need a family that's not here? Tell us the outcome — we staff it from the 2M+ network or say so honestly.",
      chips: [
        "Software Engineers", "QA & Automation", "Data & Analytics", "DevOps & SRE",
        "AI / ML Engineers", "Product & Design", "Project Managers", "Business Analysts",
        "Finance & Accounting", "Customer Support", "Sales & Marketing", "Healthcare IT",
      ],
      stats: [
        { value: "6,500+", label: "Placements" },
        { value: "60+", label: "Role families" },
        { value: "14", label: "Industries" },
      ],
    },

    modelsTitle: "Staffing models",
    models: [
      {
        name: "Contract",
        price: "Hourly / monthly",
        period: "3–12+ months",
        description: "Flexible capacity for coverage, peaks and skills you need now — extend or release with notice.",
        features: ["48h shortlists", "Rate-card transparency", "Compliance & payrolling included", "Monthly check-ins"],
        popular: true,
        cta: { label: "Staff on contract", href: "/contact" },
      },
      {
        name: "Contract-to-Hire",
        price: "Conversion fee",
        period: "6–12 months",
        description: "A working audition on your real work — convert the keepers, release the rest without severance risk.",
        features: ["Try-before-hire", "Transparent conversion fee", "Performance reporting", "90-day guarantee post-hire"],
        popular: false,
        cta: { label: "Try before hiring", href: "/contact" },
      },
      {
        name: "Permanent",
        price: "Success fee",
        period: "One-time",
        description: "Direct-hire recruitment with verified shortlists, offer management and a written replacement guarantee.",
        features: ["Verified shortlists", "Offer & counter management", "Comp benchmarks", "90-day replacement"],
        popular: false,
        cta: { label: "Fill a permanent role", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "48h", label: "Shortlist turnaround", progress: 90 },
      { value: "96%", label: "Assignment completion", progress: 96 },
      { value: "91%", label: "Contract-to-hire conversions", progress: 91 },
      { value: "4.9/5", label: "Client satisfaction", progress: 97 },
    ],

    testimonials: [
      {
        quote: "Eighteen specialists for our plant-digitization program, shortlisted and compliant in under three weeks. Traditional agencies quoted a quarter.",
        name: "Ryan Whitmore", role: "Director of IT, Crestview Manufacturing", initials: "RW", rating: 5,
      },
      {
        quote: "The rate benchmarks ended our procurement ping-pong. We signed in days because the numbers were defensible from the first call.",
        name: "Fatima Al-Rashid", role: "Head of Delivery, Sandline Systems", initials: "FA", rating: 5,
      },
      {
        quote: "Our contract-to-hire QA lead converted after nine months — the audition made the permanent offer the easiest decision of my year.",
        name: "Benjamin Osei", role: "Program Director, Transpacific Media", initials: "BO", rating: 5,
      },
    ],

    caseStudy: {
      industry: "Manufacturing",
      title: "Manufacturer staffs a plant-digitization program in three weeks",
      challenge: "A multi-site manufacturer needed 18 specialists — engineers, analysts and project managers — for a two-year digitization program no agency could cover in time.",
      solution: "Mixed-mode staffing: nine contractors, six contract-to-hire and three permanent placements, all compliance-cleared and onboarded within three weeks.",
      results: [
        { value: "18", label: "Specialists placed" },
        { value: "3 wks", label: "Full team live" },
        { value: "100%", label: "Term completion" },
      ],
    },

    comparisonTitle: "STIOOS staffing vs. traditional staffing agencies",
    comparison: [
      { traditional: "First CVs in one to two weeks", withUs: "Calibrated shortlist in 48 hours" },
      { traditional: "One agency per staffing mode", withUs: "Four modes under one contract" },
      { traditional: "Compliance surprises at onboarding", withUs: "Compliance cleared before submission" },
      { traditional: "Rates defended by hand-waving", withUs: "Live benchmarks with every shortlist" },
      { traditional: "Radio silence after placement", withUs: "Monthly engagement management" },
      { traditional: "Backfills renegotiated from zero", withUs: "90-day replacement in writing" },
    ],

    industries: [
      "Manufacturing", "FinTech", "Healthcare", "Retail", "Logistics",
      "Telecom", "Energy", "Public Sector", "Media", "SaaS",
    ],

    regions: [
      { region: "North America", cities: "Atlanta · Calgary · Detroit", note: "EST–CST coverage" },
      { region: "Europe", cities: "Manchester · Milan · Prague", note: "GMT–CET coverage" },
      { region: "Middle East", cities: "Dubai · Jeddah", note: "GST coverage" },
      { region: "Asia Pacific", cities: "Chennai · Jakarta · Osaka", note: "IST–JST coverage" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "90-day replacement", description: "Free, prioritised backfill on any placement that exits early — in the standard terms." },
      { icon: "Clock", title: "48h shortlist SLA", description: "A calibrated shortlist in two business days or we rescope at no charge." },
      { icon: "FileText", title: "Compliance guaranteed", description: "Right-to-work, contracts and payrolling handled to audit standard, every placement." },
      { icon: "Handshake", title: "Transparent pricing", description: "Agreed rate cards and success fees upfront — no hidden margins." },
    ],

    experts: [
      { name: "Tristan Bell", role: "Director, Staffing Operations", initials: "TB", specialty: "High-volume delivery", stat: "3,100+ placements" },
      { name: "Aisha Okonkwo", role: "Principal Account Lead", initials: "AO", specialty: "Enterprise accounts", stat: "96% assignment completion" },
      { name: "Viktor Hansen", role: "Head of Compliance & Payrolling", initials: "VH", specialty: "Cross-border staffing", stat: "0 compliance findings" },
    ],

    resources: [
      { type: "Guide", title: "Choosing between contract and perm", description: "The decision framework our account leads use — with the break-even math.", readTime: "8 min read" },
      { type: "Playbook", title: "Standing up a project team in 14 days", description: "Assembly, onboarding and milestone governance for project-based staffing.", readTime: "10 min read" },
      { type: "Report", title: "Contract rate benchmarks 2025", description: "Hourly and monthly rates across 60 role families and 14 industries.", readTime: "16 min read" },
    ],

    faqs: [
      { q: "How is STIOOS different from the staffing agencies we already use?", a: "Speed and rigor: a 48-hour shortlist SLA backed by a pre-vetted bench, compliance cleared before submission, live rate benchmarks, and a 90-day replacement guarantee in standard terms — across contract, contract-to-hire, permanent and project modes on one contract." },
      { q: "How quickly can someone actually start?", a: "Shortlists land within 48 hours; interviews typically complete that week; compliance-cleared contractors start within one to two weeks of brief. Bench-current roles are fastest." },
      { q: "What does the 90-day replacement guarantee cover?", a: "Any placement — contract or permanent — that exits or is released for performance within 90 days is backfilled free and prioritised. It's standard in our terms, not a negotiable extra." },
      { q: "Who handles contracts, payrolling and compliance?", a: "We do. Right-to-work, contracting, timesheets, invoicing, insurance and audit records are managed centrally under our MSA, with reporting your procurement and legal teams can inspect." },
      { q: "Can we start temporary and convert to permanent?", a: "Yes — contract-to-hire is built for exactly that. You agree the conversion fee upfront, get performance reporting during the contract, and make the permanent call based on real work, not interviews." },
      { q: "What geographies do you staff in?", a: "Active staffing across 18 countries with local contracting and payrolling compliance; cross-border engagements extend further through our regional delivery hubs." },
    ],

    ctaBand: {
      kicker: "Keep the pipeline full",
      title: "Your requirement is a shortlist two days from now",
      primary: {
        kicker: "For Hiring Teams",
        title: "Send the requirement today",
        text: "One intake call, a rate benchmark, and candidates worth meeting by Thursday.",
        cta: { label: "Send requirement", href: "/contact" },
      },
      secondary: {
        kicker: "For Program Leads",
        title: "Staff the whole project",
        text: "Teams assembled to scope and timeline — see how project-based staffing runs end to end.",
        cta: { label: "Explore project staffing", href: "/talent-solutions/staffing-solutions" },
      },
    },

    contact: {
      title: "Have a requirement ready?",
      note: "Our staffing desk responds within hours — with bench availability, not a brochure.",
      channels: [
        { icon: "Phone", label: "Call staffing desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email the staffing team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book intake call", value: "30-min requirement intake", href: "/contact" },
      ],
    },
  },
  {
    slug: "placements",
    group: "talent",
    accent: "amber",
    nav: "Placements",

    eyebrow: "Talent Solutions · Career Placement",
    title: "Careers launched, roles filled —",
    highlight: "one placement engine",
    subtitle:
      "Job seekers get matched into live roles by AI that reads verified skills; employers get placement-ready talent from a pipeline that's already been trained, assessed and vetted. Both sides win faster.",
    primaryCta: { label: "Apply Now", href: "/contact" },
    secondaryCta: { label: "Hire placement-ready talent", href: "/contact" },
    heroStats: [
      { value: "9,300+", label: "Placements to date" },
      { value: "21 days", label: "Median time to offer" },
      { value: "94%", label: "Employer fit score" },
    ],

    trustBadges: [
      "ISO 27001 aligned",
      "AI skill matching",
      "Live roles only",
      "Verified skill profiles",
      "Free for job seekers",
      "4.8/5 satisfaction",
    ],

    kpis: [
      { icon: "Briefcase", value: "9,300+", label: "Careers placed", detail: "Candidates matched into live roles across 18 countries and every major tech hub." },
      { icon: "BrainCircuit", value: "94%", label: "Match accuracy", detail: "Employer-rated fit across first-year placements, scored on real performance." },
      { icon: "Clock", value: "21 days", label: "Median time to offer", detail: "From verified profile to signed offer — for candidates and employers alike." },
      { icon: "HeartHandshake", value: "89%", label: "Still in role @ 12 months", detail: "Placements that stick, because matching weighed more than keywords." },
    ],

    audiences: [
      {
        icon: "Rocket",
        kicker: "For Job Seekers",
        title: "Get placed, not just listed",
        description: "Your profile is verified once, then AI matches you to live, funded roles — with a coach prepping you for every interview. Free, always.",
        bullets: [
          "Matched to live, funded roles",
          "Verified skill profile does the talking",
          "Interview prep & offer coaching",
          "Zero fees — ever",
        ],
        cta: { label: "Create your profile", href: "/talent-solutions#placements" },
      },
      {
        icon: "Building2",
        kicker: "For Employers",
        title: "Talent that's ready before you meet it",
        description: "Every introduced candidate comes from our training and assessment pipeline — skills verified, references checked, expectations aligned.",
        bullets: [
          "Pre-vetted from our training pipeline",
          "AI-matched to your scorecard",
          "Assessment reports included",
          "90-day replacement cover",
        ],
        cta: { label: "Request a shortlist", href: "/contact" },
      },
    ],

    valueProps: [
      { icon: "BrainCircuit", title: "Matching on verified skill", description: "The engine weighs assessed skills and trajectory — not keyword stuffing or referral luck." },
      { icon: "BadgeCheck", title: "Assessed before introduction", description: "Proctored assessments and reference checks are done before anyone meets anyone." },
      { icon: "Handshake", title: "Free for candidates, always", description: "Job seekers never pay fees or commissions — employers carry transparent success pricing." },
      { icon: "Clock", title: "Weeks, not months", description: "Median 21 days from verified profile to signed offer on both sides of the match." },
      { icon: "HeartHandshake", title: "Support through day 90", description: "Check-ins, coaching and early-issue mediation continue well past the start date." },
      { icon: "Globe", title: "Local and cross-border roles", description: "Placements across 18 countries, with relocation-ready and remote-first matches included." },
    ],

    processTitle: "How a placement happens",
    process: [
      { title: "Profile & verification", duration: "Day 1", description: "Candidates build one profile; skills are assessed and verified against the 400+ instrument library." },
      { title: "AI match to live roles", duration: "Days 2–3", description: "The engine matches verified profiles to funded openings and flags the strongest fits to both sides." },
      { title: "Employer interviews", duration: "Weeks 1–2", description: "Coaches prep candidates; structured scorecards keep employer evaluation consistent and fair." },
      { title: "Offer, join & onboard", duration: "Weeks 2–3", description: "Offers, negotiations and onboarding coordination handled so day one starts clean." },
      { title: "90-day follow-through", duration: "Days 1–90", description: "Scheduled check-ins with both sides surface friction early; replacement cover applies throughout." },
    ],

    spotlight: [
      {
        icon: "BrainCircuit",
        title: "The match engine",
        description: "Two-sided fit scoring weighs verified skills, trajectory, team context and expectations — matches that survive probation, not just interviews.",
        bullets: ["Two-sided scoring", "Skill-graph matching", "Expectation alignment"],
        visual: "radial",
      },
      {
        icon: "BadgeCheck",
        title: "Verified profiles, front to back",
        description: "Proctored assessments, credential checks and references complete before introduction — no surprises on either side.",
        bullets: ["Proctored assessments", "Credential checks", "References verified"],
        visual: "badge",
      },
      {
        icon: "Users",
        title: "Coaches in your corner",
        description: "Every candidate gets a placement coach for interviews, offers and the first 90 days — and every employer gets a named placement lead.",
        bullets: ["Interview coaching", "Offer guidance", "Day-90 check-ins"],
        visual: "network",
      },
    ],

    deliverablesTitle: "What's included in Placements",
    deliverables: [
      "Verified skill profile build",
      "AI matching to live, funded roles",
      "Placement coach for every candidate",
      "Employer scorecard alignment",
      "Interview scheduling & prep",
      "Offer & negotiation support",
      "Onboarding coordination",
      "90-day follow-through & replacement cover",
    ],

    modulesTitle: "Placement tracks",
    modules: [
      { icon: "Search", tag: "Discovery", title: "Role Discovery", description: "Live, funded openings matched to your verified profile — never stale postings." },
      { icon: "BrainCircuit", tag: "Matching", title: "AI Role Matching", description: "Two-sided fit scoring that respects skills, trajectory and expectations." },
      { icon: "MessageSquare", tag: "Coaching", title: "Interview Coaching", description: "Mock loops, structured feedback and role-specific prep from working practitioners." },
      { icon: "FileText", tag: "Profile", title: "Verified Skill Profile", description: "One assessed, verifiable profile that speaks to every employer you meet." },
      { icon: "Handshake", tag: "Offer", title: "Offer & Negotiation Support", description: "Market benchmarking and coaching so offers land fair for both sides." },
      { icon: "Users", tag: "Onboarding", title: "First-90-Day Support", description: "Check-ins and mediation through probation — the period where placements usually fail." },
    ],

    tech: {
      title: "Matching infrastructure serving both sides",
      description: "One platform runs verification, matching, scheduling and follow-through — transparent to candidates and employers alike.",
      points: [
        { icon: "Brain", title: "Skill-graph matching", description: "Assessed skills and trajectory modelled against role scorecards, refreshed nightly." },
        { icon: "ShieldCheck", title: "Verification pipeline", description: "Assessments, credentials and references completed before any introduction." },
        { icon: "BarChart3", title: "Two-sided fit scoring", description: "Mutual match quality surfaced to both sides, with the reasoning explained." },
        { icon: "Lock", title: "Privacy-first profiles", description: "Candidates control visibility; data is never sold or shared outside the match." },
      ],
      stats: [
        { value: "9,300+", label: "Placements" },
        { value: "94%", label: "Match accuracy" },
      ],
    },

    coverage: {
      title: "Roles we place into",
      note: "Not seeing your discipline? New tracks open monthly — join the pool and get matched when your track launches.",
      chips: [
        "Software Engineering", "Data & Analytics", "Cloud & DevOps", "AI & ML",
        "Cybersecurity", "QA & Testing", "Product Management", "UX Design",
        "Sales & BD", "Customer Success", "Finance Ops", "Digital Marketing",
      ],
      stats: [
        { value: "9,300+", label: "Placements" },
        { value: "2,400+", label: "Live roles / year" },
        { value: "18", label: "Countries" },
      ],
    },

    modelsTitle: "Placement models",
    models: [
      {
        name: "Direct Placement",
        price: "Success fee",
        period: "Employers",
        description: "Permanent placement from the verified pool — shortlists of assessed, reference-checked candidates.",
        features: ["Verified shortlists", "Assessment reports", "Offer support", "90-day replacement"],
        popular: true,
        cta: { label: "Request candidates", href: "/contact" },
      },
      {
        name: "Placement+ Ramp",
        price: "Placement + training",
        period: "Employers",
        description: "Placement plus a structured on-the-job ramp — hire the aptitude, let us train the rest.",
        features: ["90-day ramp plan", "Dedicated mentor", "Weekly scorecards", "Certification gate"],
        popular: false,
        cta: { label: "Hire and ramp", href: "/contact" },
      },
      {
        name: "Career Track",
        price: "Free",
        period: "Job seekers",
        description: "Join the pool, verify your skills once and get matched to live roles with a coach — at no cost, ever.",
        features: ["Verified profile", "AI matching", "Interview coaching", "Offer support"],
        popular: false,
        cta: { label: "Join the pool", href: "/talent-solutions#placements" },
      },
    ],

    outcomes: [
      { value: "21 days", label: "Median time to offer", progress: 85 },
      { value: "94%", label: "Employer fit score", progress: 94 },
      { value: "89%", label: "12-month retention", progress: 89 },
      { value: "4.8/5", label: "Candidate satisfaction", progress: 95 },
    ],

    testimonials: [
      {
        quote: "I applied to 200 postings with silence. One verified profile with STIOOS and I had three interviews in ten days — and an offer I actually wanted.",
        name: "Sophia Lindqvist", role: "Platform Engineer, placed at Halo Systems", initials: "SL", rating: 5,
      },
      {
        quote: "Every candidate arrived with an assessment report and reference notes. Our hiring loop shrank from four stages to two.",
        name: "Dev Patel", role: "Talent Lead, Corevance", initials: "DP", rating: 5,
      },
      {
        quote: "As a career switcher into data, the coach and the verified profile carried me. Day-90 check-ins felt like someone still had my back.",
        name: "Hannah Zimmerman", role: "Data Analyst, placed 2024", initials: "HZ", rating: 4,
      },
    ],

    caseStudy: {
      industry: "Gaming",
      title: "Gaming studio backfills a live-ops team in 19 days",
      challenge: "A mobile-gaming studio lost five live-ops engineers weeks before a global launch, with contractors quoting 60+ day start times.",
      solution: "Seven verified candidates from the placement pool were matched and interviewed in one week; four joined with ramp support through launch season.",
      results: [
        { value: "7", label: "Roles filled" },
        { value: "19 days", label: "Median to offer" },
        { value: "6/7", label: "Top-quartile at 90 days" },
      ],
    },

    comparisonTitle: "STIOOS placements vs. job boards",
    comparison: [
      { traditional: "Applications into a void", withUs: "Matched to live, funded roles" },
      { traditional: "Employers drowning in unfiltered CVs", withUs: "Verified, assessed shortlists only" },
      { traditional: "Skills claimed, never proven", withUs: "Proctored assessments before introduction" },
      { traditional: "Months of looping and ghosting", withUs: "Median 21 days to signed offer" },
      { traditional: "Support ends at the job listing", withUs: "Coaching through the first 90 days" },
      { traditional: "Candidates pay for visibility", withUs: "Free for job seekers, always" },
    ],

    industries: [
      "SaaS", "FinTech", "Gaming", "Healthcare", "E-commerce",
      "Telecom", "Logistics", "Media", "EdTech", "Public Sector",
    ],

    regions: [
      { region: "North America", cities: "New York · Chicago · Vancouver", note: "EST–PST coverage" },
      { region: "Europe", cities: "London · Berlin · Warsaw", note: "GMT–CET coverage" },
      { region: "Middle East", cities: "Dubai · Riyadh", note: "GST coverage" },
      { region: "Asia Pacific", cities: "Bengaluru · Singapore · Melbourne", note: "IST–AEST coverage" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "90-day replacement", description: "If a placement exits early, the employer gets a prioritised free backfill from the pool." },
      { icon: "Handshake", title: "Free for job seekers", description: "No fees, no commissions, no paid visibility — the model only works when you do." },
      { icon: "HeartHandshake", title: "Day-90 support", description: "Scheduled check-ins with both sides through probation, with mediation when needed." },
      { icon: "BadgeCheck", title: "Verified-only introductions", description: "Every candidate introduced has passed proctored assessments — no unvetted CVs." },
    ],

    experts: [
      { name: "Naomi Clarke", role: "Head of Placement Coaching", initials: "NC", specialty: "Candidate coaching", stat: "2,000+ candidates coached" },
      { name: "Rohan Bhatt", role: "Director, Employer Matching", initials: "RB", specialty: "Fit engineering", stat: "94% match accuracy" },
      { name: "Elif Demir", role: "Principal Career Advisor", initials: "ED", specialty: "Career switching", stat: "1,400 switchers placed" },
    ],

    resources: [
      { type: "Guide", title: "The verified profile that beats a CV", description: "How one assessed profile changes employer response rates — with data.", readTime: "7 min read" },
      { type: "Playbook", title: "Interview prep that actually converts", description: "The coaching framework behind a 21-day median time to offer.", readTime: "9 min read" },
      { type: "Report", title: "Placement outcomes 2025", description: "Retention, satisfaction and speed benchmarks across 9,300 placements.", readTime: "14 min read" },
    ],

    faqs: [
      { q: "What exactly is 'placement-ready' talent?", a: "Candidates whose skills are verified through proctored assessments, whose references and credentials are checked, and whose expectations are aligned through coaching. Employers meet them pre-vetted; candidates arrive pre-matched." },
      { q: "Is it really free for job seekers?", a: "Yes — always. No fees, commissions or paid visibility. Employers pay transparent success fees; candidates pay nothing at any stage, including coaching and assessment." },
      { q: "How does the AI matching work?", a: "Your verified profile is modelled on a skill graph and scored against each live role's scorecard — skills, trajectory, team context and mutual expectations. Both sides see the match rationale before proceeding." },
      { q: "What roles are in the pool?", a: "Twelve major tracks from engineering and data to sales and finance ops, with 2,400+ live roles a year across 18 countries. New tracks open monthly." },
      { q: "How long does a placement take?", a: "Median is 21 days from verified profile to signed offer. Coaching and scheduling keep loops tight, and both sides see status in one place — no black holes." },
      { q: "What happens if a placement doesn't stick?", a: "Employers get a prioritised free backfill within the 90-day guarantee; candidates get re-matching support and coaching at no cost. The follow-through program is designed to catch friction before it becomes failure." },
    ],

    ctaBand: {
      kicker: "Two sides, one engine",
      title: "The right role and the right person are closer than you think",
      primary: {
        kicker: "For Job Seekers",
        title: "Build your verified profile",
        text: "One assessment session puts you in the pool — matched to live roles with a coach beside you.",
        cta: { label: "Start your profile", href: "/talent-solutions#placements" },
      },
      secondary: {
        kicker: "For Employers",
        title: "Meet pre-vetted candidates",
        text: "Tell us the role — receive assessed, reference-checked shortlists within days.",
        cta: { label: "Request a shortlist", href: "/contact" },
      },
    },

    contact: {
      title: "Ready to be matched?",
      note: "Candidate coaches and employer leads share the same inbox — replies within one business day.",
      channels: [
        { icon: "Phone", label: "Call placements desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email the placements team", value: "talent@stioos.com", href: "mailto:talent@stioos.com" },
        { icon: "CalendarDays", label: "Book a quick call", value: "20-min matching consult", href: "/contact" },
      ],
    },
  },
];

export function getTalentPage(slug: string): PageSpec | undefined {
  return TALENT_PAGE_SPECS.find((p) => p.slug === slug);
}
