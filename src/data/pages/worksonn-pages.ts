import type { PageSpec } from "./types";

// ============================================================
// WORKSONN PAGES — one PageSpec per Worksonn dropdown option.
// Each spec renders a full 24-section page at /worksonn/[slug].
// Join paths use the emerald accent; partner paths use violet.
// ============================================================

export const WORKSONN_PAGE_SPECS: PageSpec[] = [
  {
    slug: "sales-agent",
    group: "worksonn",
    accent: "emerald",
    nav: "Sales Agent",

    eyebrow: "Worksonn Network · Commission Basis",
    title: "Sales Agent —",
    highlight: "uncapped commission, real product",
    subtitle:
      "Represent STIOOS's AI, technology and talent services as an independent sales agent. No cap on earnings, no office hours, full back-office support — you sell, we deliver.",
    primaryCta: { label: "Apply as Sales Agent", href: "/contact" },
    secondaryCta: { label: "See how commission works", href: "/worksonn/sales-agent#commission" },
    heroStats: [
      { value: "15%", label: "Base commission" },
      { value: "12 mo", label: "Deal protection" },
      { value: "7 days", label: "Payout cycle" },
    ],

    trustBadges: [
      "Uncapped earnings",
      "Protected commissions",
      "Full sales enablement",
      "Weekly payouts",
      "No exclusivity",
      "Dedicated agent desk",
    ],

    kpis: [
      { icon: "Wallet", value: "15–25%", label: "Commission range", detail: "Sliding scale by service line, rising with lifetime book value." },
      { icon: "TrendingUp", value: "$3,200", label: "Avg. monthly payout", detail: "Across active agents in their first year of the network." },
      { icon: "Handshake", value: "12 mo", label: "Commission protection", detail: "Your named accounts stay yours — renewals keep paying you." },
      { icon: "Rocket", value: "48h", label: "Onboarding time", detail: "From application to first pitch-ready sales kit." },
    ],

    audiences: [
      {
        icon: "Briefcase",
        kicker: "Independent Agents",
        title: "Sell big-ticket B2B, own your book",
        description: "AI transformation, staffing and consulting deals — high contract values with recurring revenue that compounds your monthly payout.",
        bullets: [
          "Deal values from $10K to $500K+",
          "Recurring commissions on staffing renewals",
          "Named-account protection for 12 months",
          "Sell alongside your existing portfolio",
        ],
        cta: { label: "Apply in 10 minutes", href: "/contact" },
      },
      {
        icon: "Building2",
        kicker: "For Your Clients",
        title: "You bring a real solution, not a pitch",
        description: "Everything you sell is delivered by STIOOS's vetted expert teams — your reputation is backed by ours.",
        bullets: [
          "Pre-sales engineers on every big deal",
          "White-glove delivery reporting",
          "Free discovery workshops for your prospects",
          "SLA-backed contracts your clients can trust",
        ],
        cta: { label: "Meet the delivery teams", href: "/about" },
      },
    ],

    valueProps: [
      { icon: "Wallet", title: "Uncapped, tiered commission", description: "Start at 15% and climb to 25% as your lifetime book grows. Renewals keep paying — no reset each January." },
      { icon: "ShieldCheck", title: "Protected named accounts", description: "Register a prospect and it's locked to you for 12 months. Internal leads never collide with your book." },
      { icon: "Zap", title: "7-day payout cycle", description: "Commissions clear within seven days of client payment. Weekly, predictable, no clawback games." },
      { icon: "Target", title: "Ready-made sales kit", description: "Decks, pricing calculators, case studies and ROI models — everything pitch-ready from day one." },
      { icon: "Users", title: "Agent desk support", description: "A named agent manager plus pre-sales engineers who join your calls for technical depth." },
      { icon: "Globe", title: "Sell from anywhere", description: "100% remote, any timezone, no exclusivity. Build your STIOOS book around your life." },
    ],

    processTitle: "From application to first commission in 4 steps",
    process: [
      { title: "Apply & profile match", duration: "Day 1–2", description: "Tell us your network, industries and experience. We match you to the service lines with the best fit." },
      { title: "Enablement bootcamp", duration: "Day 3–5", description: "Product deep-dives, pricing walkthroughs and objection handling — recorded, so you learn at your pace." },
      { title: "Launch your book", duration: "Week 2", description: "Register your named accounts, get your unique referral links and book your first discovery calls." },
      { title: "Sell, close & earn", duration: "Ongoing", description: "Bring the deal, we handle delivery. Commission hits your account within 7 days of client payment." },
      { title: "Scale to partner tier", duration: "Quarter 2+", description: "Cross $100K lifetime book to unlock 25% tier, co-branded marketing and priority deal support." },
    ],

    spotlight: [
      {
        icon: "BarChart3",
        title: "Track every deal in the agent portal",
        description: "A live dashboard shows registered accounts, pipeline stages, expected commission and payout history — total transparency.",
        bullets: ["Live pipeline view", "Commission calculator", "Payout history"],
        visual: "dashboard",
      },
      {
        icon: "Network",
        title: "One network, many service lines",
        description: "Cross-sell across AI solutions, technology services, staffing and consulting — each new line multiplies your wallet share per account.",
        bullets: ["8 service lines", "Bundle-friendly pricing", "Warm internal referrals"],
        visual: "network",
      },
      {
        icon: "BadgeCheck",
        title: "Credibility built in",
        description: "Walk into meetings with STIOOS case studies, partner badges and co-branded materials — you're never selling alone.",
        bullets: ["Co-branded collateral", "Verified partner badge", "Reference calls arranged"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "Everything you get as a STIOOS Sales Agent",
    deliverables: [
      "Full sales enablement kit & playbooks",
      "Unique referral links + agent portal",
      "Named-account registration & protection",
      "Pre-sales engineer on big deals",
      "Commission calculator & payout tracking",
      "Weekly agent desk office hours",
      "Co-branded marketing materials",
      "Partner-tier progression program",
    ],

    modulesTitle: "Service lines you can represent",
    modules: [
      { icon: "Bot", tag: "AI", title: "AI & Agentic Solutions", description: "Automation, LLM apps and AI agents — our fastest-growing, highest-ticket line." },
      { icon: "Code", tag: "Technology", title: "Technology & Programming", description: "Web, mobile, cloud and data engineering engagements of every size." },
      { icon: "Users", tag: "Talent", title: "Talent Solutions", description: "Staffing, Train to Hire and assessments — recurring revenue via renewals." },
      { icon: "BarChart3", tag: "Consulting", title: "Consulting & Advisory", description: "Strategy, readiness and transformation roadmaps for enterprise clients." },
      { icon: "Cloud", tag: "Cloud", title: "Cloud & DevOps Services", description: "Migration, cost optimization and managed operations contracts." },
      { icon: "ShieldCheck", tag: "Security", title: "Cybersecurity Services", description: "Assessments, SOC services and compliance programs with strong demand." },
    ],

    tech: {
      title: "The agent portal does the admin for you",
      description: "Register deals, generate quotes, track commissions and get payouts — the platform handles everything except the handshake.",
      points: [
        { icon: "Gauge", title: "Deal registration", description: "Lock an account to your name in two minutes, with instant conflict checks." },
        { icon: "Wallet", title: "Commission tracking", description: "See expected vs. paid commission per deal, updated as clients pay." },
        { icon: "FileText", title: "Instant quotes & SOWs", description: "Generate client-ready pricing documents from approved templates." },
        { icon: "MessageSquare", title: "Agent desk chat", description: "Your named agent manager is one message away on every active deal." },
      ],
      stats: [
        { value: "7 days", label: "Payout cycle" },
        { value: "100%", label: "Payout transparency" },
      ],
    },

    coverage: {
      title: "Industries where agents are winning",
      note: "Your existing network is the asset — agents usually start closing inside industries they already know.",
      chips: [
        "FinTech", "Healthcare", "Retail & E-commerce", "Manufacturing", "Logistics",
        "Real Estate", "Education", "Professional Services", "SaaS & Tech", "Energy",
        "Telecom", "Public Sector",
      ],
      stats: [
        { value: "30+", label: "Active markets" },
        { value: "$500K", label: "Top agent annual payout" },
        { value: "8", label: "Service lines" },
      ],
    },

    modelsTitle: "Commission structure",
    models: [
      {
        name: "Starter Tier",
        price: "15%",
        period: "of contract value",
        description: "For new agents building momentum. Full enablement, standard deal registration.",
        features: ["15% on all service lines", "12-month account protection", "Weekly payouts", "Agent desk support"],
        popular: false,
        cta: { label: "Start as agent", href: "/contact" },
      },
      {
        name: "Growth Tier",
        price: "20%",
        period: "of contract value",
        description: "Unlocks at $50K lifetime book. Higher rate, marketing support and joint account planning.",
        features: ["20% on all service lines", "Co-branded campaigns", "Quarterly account planning", "Priority pre-sales access"],
        popular: true,
        cta: { label: "Apply now", href: "/contact" },
      },
      {
        name: "Partner Tier",
        price: "25%",
        period: "of contract value",
        description: "For agents crossing $100K lifetime book — treated like a channel partner, not an agent.",
        features: ["25% on all service lines", "Named partner listing", "Event & webinar slots", "Strategic deal input"],
        popular: false,
        cta: { label: "Talk to partnerships", href: "/contact" },
      },
    ],

    outcomes: [
      { value: "$3,200", label: "Avg. monthly payout", progress: 72 },
      { value: "68%", label: "Agents active after 2 yrs", progress: 68 },
      { value: "31 days", label: "Median time to first deal", progress: 55 },
      { value: "92%", label: "Payout accuracy", progress: 92 },
    ],

    testimonials: [
      {
        quote: "I closed my first staffing deal in week three and the payout hit my account four days after the client paid. The commission protection means renewals still pay me a year later.",
        name: "Marcus Reid", role: "Independent Sales Agent", initials: "MR", rating: 5,
      },
      {
        quote: "The pre-sales engineers are the difference. I bring the relationship, they bring the architecture — clients see a serious company from the first call.",
        name: "Anita Deshmukh", role: "Sales Agent, Growth Tier", initials: "AD", rating: 5,
      },
      {
        quote: "As a freelancer-turned-agent, this became my most reliable income stream. Big-ticket B2B with none of the delivery headaches.",
        name: "Tomás Ferreira", role: "Sales Agent, Partner Tier", initials: "TF", rating: 5,
      },
    ],

    caseStudy: {
      industry: "Professional Services",
      title: "Agent builds a $240K annual book in her first year",
      challenge: "A former account manager had deep CFO-level contacts but no product to sell and no appetite for delivery risk.",
      solution: "She registered 14 named accounts, led with free discovery workshops, and cross-sold staffing + AI automation into three logos.",
      results: [
        { value: "$240K", label: "Year-1 book" },
        { value: "14", label: "Named accounts" },
        { value: "3", label: "Service lines sold" },
      ],
    },

    comparisonTitle: "STIOOS agent vs. typical referral program",
    comparison: [
      { traditional: "5–10% one-time referral fee", withUs: "15–25% commission, rising with your book" },
      { traditional: "Commission ends at signature", withUs: "Renewals keep paying for 12+ months" },
      { traditional: "No account protection", withUs: "Named accounts locked to you" },
      { traditional: "Net-60+ payouts, frequent clawbacks", withUs: "7-day payouts, transparent ledger" },
      { traditional: "Sell one product", withUs: "Cross-sell 8 service lines per account" },
      { traditional: "You're on your own in meetings", withUs: "Pre-sales engineers join your calls" },
    ],

    industries: [
      "FinTech", "Healthcare", "Retail & E-commerce", "Manufacturing", "Logistics",
      "Real Estate", "Education", "Professional Services", "SaaS & Tech", "Energy",
    ],

    regions: [
      { region: "North America", cities: "New York · Chicago · Toronto", note: "Largest agent market" },
      { region: "Europe", cities: "London · Frankfurt · Dubai", note: "Fastest-growing book" },
      { region: "Asia Pacific", cities: "Singapore · Bengaluru · Sydney", note: "High-volume staffing demand" },
      { region: "Remote everywhere", cities: "Any timezone · No office", note: "100% remote by design" },
    ],

    guarantees: [
      { icon: "Wallet", title: "7-day payouts", description: "Commission clears within seven days of client payment — every cycle, in writing." },
      { icon: "ShieldCheck", title: "12-month protection", description: "Registered accounts can never be reassigned while your commission runs." },
      { icon: "Handshake", title: "No exclusivity", description: "Represent other products freely — your STIOOS book stays yours." },
      { icon: "Lock", title: "Transparent ledger", description: "Every deal, payment and payout visible in your portal in real time." },
    ],

    experts: [
      { name: "James O'Connor", role: "Head of Agent Network", initials: "JO", specialty: "Channel growth", stat: "180+ agents onboarded" },
      { name: "Meera Iyer", role: "Agent Desk Manager", initials: "MI", specialty: "Deal support", stat: "$12M agent book managed" },
      { name: "Lucas Bergmann", role: "Pre-Sales Lead", initials: "LB", specialty: "Technical closes", stat: "300+ joint calls" },
    ],

    resources: [
      { type: "Playbook", title: "The first-30-days agent plan", description: "How new agents land their first deal — week-by-week activity map.", readTime: "10 min read" },
      { type: "Guide", title: "Commission math, explained simply", description: "Worked examples of payouts across staffing, AI and consulting deals.", readTime: "6 min read" },
      { type: "Template", title: "Discovery call script for B2B services", description: "The exact discovery framework our top agents use on first calls.", readTime: "7 min read" },
    ],

    faqs: [
      { q: "Do I need sales experience to apply?", a: "Experience helps, but a strong network matters more. Many of our best agents come from account management, consulting or industry roles — they know buyers, we teach the product." },
      { q: "How and when do I get paid?", a: "Commissions are calculated per deal at your tier rate and paid within 7 days of the client's payment clearing. Everything is visible in your portal ledger." },
      { q: "What does 'commission basis' mean exactly?", a: "You're an independent agent, not an employee — no base salary, but 15–25% of every contract you close, with renewals included. Top agents out-earn salaried roles many times over." },
      { q: "Can I register my existing clients?", a: "Yes — that's the point. Register accounts in the portal for 12-month protection, and we'll run conflict checks so your book never collides with internal leads." },
      { q: "Who handles delivery after I close?", a: "STIOOS's delivery teams handle everything — scoping, contracts, delivery and support. You stay in the loop through your portal and optional client check-ins." },
      { q: "Is there a cost to join?", a: "No. Joining, enablement and the sales kit are free. We only earn when you earn." },
    ],

    ctaBand: {
      kicker: "Applications open",
      title: "Turn your network into uncapped income",
      primary: {
        kicker: "Become a Sales Agent",
        title: "Apply in 10 minutes",
        text: "Tell us about your network and experience — most agents are pitching within a week.",
        cta: { label: "Apply now", href: "/contact" },
      },
      secondary: {
        kicker: "Not sure yet?",
        title: "Book a 20-min agent Q&A",
        text: "Get the commission math, protection rules and real payout examples before you commit.",
        cta: { label: "Book your call", href: "/contact" },
      },
    },

    contact: {
      title: "Talk to the agent network team",
      note: "Applications are reviewed within 48 hours — you'll hear back with a clear yes/no and next steps.",
      channels: [
        { icon: "Phone", label: "Call the agent desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email partnerships", value: "partners@stioos.com", href: "mailto:partners@stioos.com" },
        { icon: "CalendarDays", label: "Book an agent Q&A", value: "20-min intro call", href: "/contact" },
      ],
    },
  },

  {
    slug: "candidates",
    group: "worksonn",
    accent: "emerald",
    nav: "Candidates",

    eyebrow: "Worksonn Network · Careers",
    title: "Candidates —",
    highlight: "get discovered by 2,000+ employers",
    subtitle:
      "Join the Worksonn network free. Our AI matches your skills to live roles in AI, tech and business — with verified assessments, interview support and a talent advocate in your corner until you sign.",
    primaryCta: { label: "Create your free profile", href: "/contact" },
    secondaryCta: { label: "See how matching works", href: "/worksonn/candidates#matching" },
    heroStats: [
      { value: "2,000+", label: "Employers hiring now" },
      { value: "11 days", label: "Median time to first offer" },
      { value: "$0", label: "Cost to join — ever" },
    ],

    trustBadges: [
      "Free forever profile",
      "AI skill matching",
      "Verified skill assessments",
      "Interview coaching",
      "Salary transparency",
      "No spam — match once",
    ],

    kpis: [
      { icon: "Users", value: "2,000+", label: "Employers in network", detail: "From seed-stage startups to Fortune 500s hiring across AI, tech and business roles." },
      { icon: "BrainCircuit", value: "94%", label: "Match satisfaction", detail: "Candidates rate at least three of every four matches a strong fit for their goals." },
      { icon: "Clock", value: "11 days", label: "Median time to offer", detail: "From complete profile to signed offer across all role families." },
      { icon: "BadgeCheck", value: "38", label: "Skill assessments", detail: "Free, proctored badges employers trust — take as many as you like." },
    ],

    audiences: [
      {
        icon: "UserCheck",
        kicker: "Job Seekers",
        title: "Let the roles find you",
        description: "Build one verified profile and our AI matches you to live openings across 2,000+ employers — no endless applying, no black-hole rejections.",
        bullets: [
          "One profile, considered for every fit",
          "Verified assessment badges lift your ranking",
          "See salary ranges before you apply",
          "A talent advocate reviews every shortlist",
        ],
        cta: { label: "Create your free profile", href: "/contact" },
      },
      {
        icon: "GraduationCap",
        kicker: "Career Switchers",
        title: "Move into AI, tech & business roles",
        description: "Coming from another field? Assessments prove what your résumé can't yet — and Train to Hire cohorts build exactly the gaps you have.",
        bullets: [
          "Skills-first matching skips the degree filter",
          "Train to Hire: learn, then get placed",
          "Interview practice with structured feedback",
          "Transferable-skill mapping built into matching",
        ],
        cta: { label: "See Train to Hire paths", href: "/talent-solutions#staffing-solutions" },
      },
    ],

    valueProps: [
      { icon: "BrainCircuit", title: "AI-matched to your skills", description: "The matching engine reads your skills, assessments and preferences — not just keywords — to surface roles you'll actually want." },
      { icon: "Globe", title: "2,000+ employers, one profile", description: "Get considered across startups, scale-ups and enterprises without re-applying anywhere or refreshing job boards." },
      { icon: "BadgeCheck", title: "Verified skill assessments", description: "Take free, proctored assessments and earn badges that put you ahead of unverified applicants in every shortlist." },
      { icon: "MessageSquare", title: "Real interview support", description: "Mock interviews, company intel and structured feedback from people who hire for a living." },
      { icon: "Lock", title: "Your data stays yours", description: "Employers only see your profile when you're matched — and you approve every reveal. Your current employer never will." },
      { icon: "Wallet", title: "Salary transparency", description: "Every role shows its range up front. Never negotiate blind again." },
    ],

    processTitle: "From sign-up to signed offer in 5 steps",
    process: [
      { title: "Build your profile", duration: "20 minutes", description: "Import your résumé, add skills and preferences, and let the AI structure everything employers look for." },
      { title: "Take assessments", duration: "Week 1", description: "Pick role-relevant assessments — each verified badge lifts your match ranking with employers." },
      { title: "Get AI-matched", duration: "Within days", description: "Your profile enters the matching engine and live roles that fit start arriving, with salary ranges attached." },
      { title: "Interview with backup", duration: "Weeks 2–4", description: "Your talent advocate preps you for each stage — mock interviews, company intel and feedback loops." },
      { title: "Sign & onboard", duration: "Offer", description: "Negotiate with real market data, then start — with 90-day check-ins to make sure the fit holds." },
    ],

    spotlight: [
      {
        icon: "Brain",
        title: "Matching that reads beyond keywords",
        description: "The engine weighs verified skills, assessment scores, work preferences and trajectory — surfacing roles keyword filters would reject.",
        bullets: ["Skills-first ranking", "Preference-aware matching", "Bias-reduced shortlists"],
        visual: "radial",
      },
      {
        icon: "BarChart3",
        title: "Your job search dashboard",
        description: "See every match, application stage and interview in one place — with clear feedback either way, after every stage.",
        bullets: ["Live pipeline tracking", "Employer view analytics", "Feedback after every stage"],
        visual: "dashboard",
      },
      {
        icon: "Network",
        title: "One profile, a whole network",
        description: "Your profile is considered across every employer in the network — plus staffing pipelines and Train to Hire paths you'd never find alone.",
        bullets: ["Direct + staffing roles", "Project-to-hire paths", "Global employer reach"],
        visual: "network",
      },
    ],

    deliverablesTitle: "Everything included — free, forever",
    deliverables: [
      "AI-structured profile & matching",
      "Unlimited free skill assessments",
      "Verified badges employers trust",
      "Curated role matches with salary ranges",
      "Mock interviews & structured feedback",
      "Named talent advocate on shortlists",
      "Offer & negotiation guidance",
      "90-day post-placement check-ins",
    ],

    modulesTitle: "Role families we place into",
    modules: [
      { icon: "Bot", tag: "AI", title: "AI & Agentic Roles", description: "ML engineers, LLM developers, agent builders and AI operations roles — the fastest-growing family." },
      { icon: "Code", tag: "Technology", title: "Software Engineering", description: "Full-stack, mobile, platform and data engineering positions at every level." },
      { icon: "BarChart3", tag: "Business", title: "Business & Strategy", description: "Analysts, product managers, operations and transformation roles." },
      { icon: "TrendingUp", tag: "Sales", title: "Sales & Growth", description: "Account executives, SDRs and growth marketers across every industry." },
      { icon: "Cloud", tag: "Cloud", title: "Cloud & Infrastructure", description: "SRE, platform engineering, security and managed-services roles." },
      { icon: "GraduationCap", tag: "Early career", title: "Train to Hire", description: "Sponsored learning pathways that convert training cohorts into full-time offers." },
    ],

    tech: {
      title: "The platform works while you sleep",
      description: "Your profile keeps matching, your badges keep verifying and your dashboard keeps you posted — no refreshing job boards at midnight.",
      points: [
        { icon: "BrainCircuit", title: "Skills graph matching", description: "Your skills map to role requirements semantically — so non-traditional paths still surface." },
        { icon: "Gauge", title: "Match score transparency", description: "See why each role matched, and exactly what to improve to rank higher next time." },
        { icon: "BadgeCheck", title: "Proctored assessments", description: "Anti-cheat, professionally scored, and trusted by employers as screening replacements." },
        { icon: "MessageSquare", title: "Instant match alerts", description: "New fits reach you the day they open — with one-tap express interest." },
      ],
      stats: [
        { value: "94%", label: "Match satisfaction" },
        { value: "11 days", label: "Median time to offer" },
      ],
    },

    coverage: {
      title: "Roles candidates are getting hired for",
      note: "Local, hybrid and remote roles across every major market — filter your matches by location, timezone and work mode.",
      chips: [
        "AI & ML", "Full-Stack", "Data Engineering", "Cloud & DevOps", "Product",
        "Business Analysis", "Sales & GTM", "Cybersecurity", "Design", "Project Management",
        "Finance & Ops", "Train to Hire",
      ],
      stats: [
        { value: "42,000+", label: "Candidates in network" },
        { value: "68", label: "Countries hired from" },
        { value: "11 days", label: "Median time to offer" },
      ],
    },

    modelsTitle: "Ways to get placed",
    models: [
      {
        name: "Permanent Placement",
        price: "Free",
        period: "for candidates",
        description: "Full-time roles matched to your profile — employers fund the network, so it never costs you a cent.",
        features: ["AI-matched shortlists", "Interview coaching", "Salary negotiation support", "90-day check-ins"],
        popular: true,
        cta: { label: "Start matching", href: "/contact" },
      },
      {
        name: "Contract & Contract-to-Hire",
        price: "Free",
        period: "for candidates",
        description: "Try a company before committing — competitive day rates with reliable weekly payroll.",
        features: ["Weekly reliable payroll", "Try-before-you-stay roles", "Convert with no penalty", "Extensions tracked for you"],
        popular: false,
        cta: { label: "Browse contracts", href: "/contact" },
      },
      {
        name: "Train to Hire",
        price: "Free",
        period: "for accepted candidates",
        description: "Sponsored upskilling for career switchers — learn the exact stack an employer needs, then step into the role.",
        features: ["Fully sponsored training", "Stipend during cohort", "Guaranteed final interview", "Cohort mentors & peers"],
        popular: false,
        cta: { label: "See open cohorts", href: "/talent-solutions#staffing-solutions" },
      },
    ],

    outcomes: [
      { value: "11 days", label: "Median time to offer", progress: 78 },
      { value: "87%", label: "Match-to-interview rate", progress: 87 },
      { value: "94%", label: "Placements in seat at 12 mo", progress: 94 },
      { value: "2.4×", label: "More interviews vs. job boards", progress: 71 },
    ],

    testimonials: [
      {
        quote: "I stopped applying cold. My profile matched to three roles in ten days, and my advocate briefed me so well on the final panel that it felt like a conversation, not an exam.",
        name: "Priya Sharma", role: "Data Engineer, placed in Bengaluru", initials: "PS", rating: 5,
      },
      {
        quote: "The assessments did what my résumé couldn't. I'm a bootcamp grad and the verified badges got me past degree filters at companies I'd never have reached on my own.",
        name: "Daniel Okafor", role: "Backend Developer, career switcher", initials: "DO", rating: 5,
      },
      {
        quote: "Salary ranges shown up front changed everything. I negotiated from data instead of hope and landed 18% above my previous role.",
        name: "Sofia Marchetti", role: "Product Manager, placed in Berlin", initials: "SM", rating: 4,
      },
    ],

    caseStudy: {
      industry: "Technology",
      title: "Career switcher lands a cloud role in six weeks",
      challenge: "A former retail operations manager wanted to move into cloud engineering but had no tech résumé and zero interview experience.",
      solution: "He completed Train to Hire cohorts, earned verified assessments, and interviewed with structured coaching — three offers by week six.",
      results: [
        { value: "6 wks", label: "Profile to offer" },
        { value: "3", label: "Offers received" },
        { value: "+41%", label: "Salary increase" },
      ],
    },

    comparisonTitle: "Worksonn vs. job boards & cold applying",
    comparison: [
      { traditional: "Spray 200 applications, hear back from 3", withUs: "One profile, matched and presented to fitting employers" },
      { traditional: "Keyword filters reject non-linear careers", withUs: "Skills graph matches verified ability, not job titles" },
      { traditional: "Salary discovered at the offer stage", withUs: "Range visible before you express interest" },
      { traditional: "Generic interview prep from videos", withUs: "Mock interviews with a named talent advocate" },
      { traditional: "Free to apply, then ghosted", withUs: "Free for you, with feedback after every stage" },
      { traditional: "Placement ends the relationship", withUs: "90-day check-ins and lifetime network membership" },
    ],

    industries: [
      "SaaS & Tech", "FinTech", "Healthcare", "Banking & Insurance", "Retail & E-commerce",
      "Manufacturing", "Logistics", "Energy & Utilities", "Media & Entertainment", "Public Sector",
    ],

    regions: [
      { region: "North America", cities: "New York · Austin · Toronto", note: "Highest AI hiring volume" },
      { region: "Europe", cities: "London · Berlin · Amsterdam", note: "Strong relocation support" },
      { region: "Asia Pacific", cities: "Bengaluru · Singapore · Sydney", note: "Largest candidate pool" },
      { region: "Middle East", cities: "Dubai · Riyadh · Doha", note: "Tax-free packages rising" },
    ],

    guarantees: [
      { icon: "Wallet", title: "Free forever, really", description: "Candidates never pay — not for assessments, coaching or matching. Employers fund the network." },
      { icon: "Lock", title: "Profile privacy by default", description: "Hidden from your current employer and revealed only where you approve." },
      { icon: "MessageSquare", title: "Feedback after every stage", description: "No black-hole rejections — you'll know where you stood and why." },
      { icon: "Handshake", title: "Advocate until day 90", description: "Your talent advocate stays with you through onboarding and your first quarter." },
    ],

    experts: [
      { name: "Grace Lim", role: "Director of Candidate Success", initials: "GL", specialty: "Career coaching", stat: "4,100+ placements guided" },
      { name: "Felix Andersson", role: "Head of Assessments", initials: "FA", specialty: "Skills verification", stat: "38 assessment suites built" },
      { name: "Divya Prasad", role: "AI Matching Lead", initials: "DP", specialty: "Matching algorithms", stat: "94% match satisfaction" },
    ],

    resources: [
      { type: "Guide", title: "The profile that gets matched", description: "Field-by-field advice on what makes the AI — and employers — shortlist you.", readTime: "8 min read" },
      { type: "Playbook", title: "Assessment day, decoded", description: "What's tested, how scoring works and how to prepare without cramming.", readTime: "6 min read" },
      { type: "Template", title: "Salary negotiation scripts", description: "Word-for-word scripts for the three conversations that decide your offer.", readTime: "5 min read" },
    ],

    faqs: [
      { q: "Is Worksonn really free for candidates?", a: "Completely — profile, assessments, coaching and matching are all free, forever. Employers pay placement fees, so our incentive is getting you placed well, not charging you." },
      { q: "How is this different from a job board?", a: "Job boards list openings and hope. We actively match your verified skills to every employer in the network and present you directly — with an advocate managing your process." },
      { q: "What are the assessments like?", a: "Role-relevant, proctored and professionally scored — most take 45–90 minutes. Badges stay on your profile for two years and employers treat them as serious signal." },
      { q: "Can I hide my profile from my current employer?", a: "Yes. Company-level blocks are automatic — list your employer and they will never see your profile appear in their searches." },
      { q: "I don't have a tech background. Can I still get in?", a: "Absolutely. Transferable skills are matched through the skills graph, and Train to Hire cohorts exist exactly for motivated switchers — sponsored training, then a guaranteed interview." },
      { q: "What happens after I'm placed?", a: "Check-ins at 30, 60 and 90 days make sure the role fits, and you stay in the network for life — contract extensions, new roles and referrals all flow through your profile." },
    ],

    ctaBand: {
      kicker: "Join 42,000+ candidates",
      title: "One profile. Every employer. Zero cost.",
      primary: {
        kicker: "Get discovered",
        title: "Create your free profile",
        text: "Twenty minutes to build, matched within days, supported until you sign.",
        cta: { label: "Join Worksonn", href: "/contact" },
      },
      secondary: {
        kicker: "Hiring instead?",
        title: "Fill roles from the network",
        text: "2,000+ employers already hire from the pool — see what matching would surface for you.",
        cta: { label: "See Talent Solutions", href: "/talent-solutions" },
      },
    },

    contact: {
      title: "Questions about your profile or a match?",
      note: "The candidate success team replies within one business day.",
      channels: [
        { icon: "MessageSquare", label: "Chat with candidate success", value: "Avg. reply in 4 hrs", href: "/contact" },
        { icon: "Phone", label: "Call the candidate desk", value: "Mon–Sat, 8am–8pm", href: "/contact" },
        { icon: "Mail", label: "Email the network team", value: "partners@stioos.com", href: "mailto:partners@stioos.com" },
      ],
    },
  },

  {
    slug: "freelancer-consultant",
    group: "worksonn",
    accent: "emerald",
    nav: "Freelancer / Consultant",

    eyebrow: "Worksonn Network · Flexible",
    title: "Freelancer / Consultant —",
    highlight: "deliver projects on your terms",
    subtitle:
      "Join a vetted stream of AI, tech and business projects — matched to your skills and rates, paid on time through escrow, with none of the bidding, haggling or dead time between gigs.",
    primaryCta: { label: "Apply to the network", href: "/contact" },
    secondaryCta: { label: "See how payments work", href: "/worksonn/freelancer-consultant#payments" },
    heroStats: [
      { value: "1,100+", label: "Projects delivered / yr" },
      { value: "100%", label: "Escrow-backed payments" },
      { value: "6 days", label: "Avg. payment cycle" },
    ],

    trustBadges: [
      "Escrow-protected payouts",
      "Rate protection",
      "No bidding wars",
      "Skills-matched projects",
      "Pick your engagements",
      "Free to join",
    ],

    kpis: [
      { icon: "Wallet", value: "100%", label: "Payments escrowed", detail: "Funds are locked before you start — no invoice chasing, ever." },
      { icon: "TrendingUp", value: "$61", label: "Avg. hourly rate", detail: "Blended network average — AI and cloud specialists earn well above it." },
      { icon: "CalendarDays", value: "83%", label: "Utilization rate", detail: "What active members average — the stream keeps your bench full without burnout." },
      { icon: "Clock", value: "72h", label: "Vetting to first brief", detail: "Matched members typically see their first project offer within days." },
    ],

    audiences: [
      {
        icon: "Briefcase",
        kicker: "Independent Freelancers",
        title: "Your practice, on rocket fuel",
        description: "Stop bidding on marketplaces and chasing invoices. Get matched to vetted, scoped projects that fit your stack, your rate and your calendar.",
        bullets: [
          "Pre-vetted clients and scoped projects",
          "Rates you set, protected at contract",
          "Weekly escrow-released payments",
          "Extensions and repeat clients built in",
        ],
        cta: { label: "Apply in 15 minutes", href: "/contact" },
      },
      {
        icon: "UserCheck",
        kicker: "Senior Consultants",
        title: "Advisory work without the BD grind",
        description: "Plug into enterprise engagements — fractional leadership, transformation advisory and audits — with delivery support behind you.",
        bullets: [
          "Fractional CTO / CIO / COO engagements",
          "Enterprise clients, statement-of-work based",
          "Associate bench for heavy lifts",
          "Compliance and contracting handled",
        ],
        cta: { label: "Explore consulting briefs", href: "/worksonn/freelancer-consultant#briefs" },
      },
    ],

    valueProps: [
      { icon: "Wallet", title: "Escrow before you start", description: "Every engagement funds an escrow milestone plan before kickoff. You deliver knowing the money is already there." },
      { icon: "ShieldCheck", title: "Rate protection", description: "Your rate is locked per client for 12 months — no race to the bottom, no surprise renegotiations." },
      { icon: "Target", title: "Matched, not bid on", description: "Projects come to you based on verified skills and availability. No proposals, no bidding wars." },
      { icon: "CalendarDays", title: "Choose your engagements", description: "Set weekly capacity, timezone windows and notice periods. Pause or scale your stream anytime." },
      { icon: "TrendingUp", title: "Repeat clients compound", description: "Deliver well and extensions follow — top-quartile members renew 3.4 engagements per client on average." },
      { icon: "Users", title: "A bench behind you", description: "Pull in specialist associates for overflow, or hand off entirely — you stay the client's point of trust." },
    ],

    processTitle: "From vetting to your first invoice in 5 steps",
    process: [
      { title: "Apply & get vetted", duration: "Day 1–3", description: "Portfolio review plus one structured interview — we verify skills, communication and reliability before you're listed." },
      { title: "Set your terms", duration: "Day 4", description: "Define your stack, day rate, capacity and preferred engagement lengths. Nothing is negotiable without you." },
      { title: "Get matched to briefs", duration: "Within days", description: "Scoped project briefs arrive matched to your profile — accept, decline or ask questions before committing." },
      { title: "Deliver with support", duration: "Per project", description: "Escrow milestones, a delivery manager on enterprise work and an associate bench when you need leverage." },
      { title: "Get paid & renew", duration: "Every milestone", description: "Milestone releases clear to your account within 6 working days of client approval — then the extensions roll in." },
    ],

    spotlight: [
      {
        icon: "Wallet",
        title: "Payments you never chase",
        description: "Escrow is funded at kickoff and released per milestone — see every pending, approved and paid amount in one ledger.",
        bullets: ["Milestone escrow plans", "6-day release cycle", "Multi-currency payouts"],
        visual: "dashboard",
      },
      {
        icon: "Layers",
        title: "A project stream, not a lottery",
        description: "The matching engine keeps your pipeline full across AI, engineering, data and advisory work — sized to your actual capacity.",
        bullets: ["Capacity-aware matching", "Skills-verified briefs", "Overflow bench access"],
        visual: "network",
      },
      {
        icon: "BadgeCheck",
        title: "Vetted status that opens doors",
        description: "The Worksonn vetted badge tells enterprise clients you've cleared reference, skill and delivery checks — so you skip the probation dip.",
        bullets: ["Reference-verified profile", "Client ratings visible", "Priority on premium briefs"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What comes with membership",
    deliverables: [
      "Skills-verified profile in the matching engine",
      "Escrow milestone plans on every project",
      "Rate protection for 12 months per client",
      "Delivery manager on enterprise engagements",
      "Associate bench for overflow and specialists",
      "Contracting, compliance and invoicing handled",
      "Multi-currency payouts with weekly cycles",
      "Priority access to retainer and fractional briefs",
    ],

    modulesTitle: "Project categories in the stream",
    modules: [
      { icon: "Bot", tag: "AI", title: "AI & Agent Builds", description: "LLM apps, agent workflows, RAG systems and AI integrations — the fastest-growing brief type." },
      { icon: "Code", tag: "Engineering", title: "Software Development", description: "Web, mobile, API and platform builds from 4-week sprints to year-long programs." },
      { icon: "Database", tag: "Data", title: "Data & Analytics", description: "Pipelines, warehouses, dashboards and analytics advisory engagements." },
      { icon: "Cloud", tag: "Cloud", title: "Cloud & DevOps", description: "Migrations, IaC, Kubernetes, cost optimization and managed operations." },
      { icon: "ShieldCheck", tag: "Security", title: "Security & Compliance", description: "Audits, SOC 2 and ISO programs, penetration testing and remediation." },
      { icon: "Compass", tag: "Advisory", title: "Fractional Leadership", description: "Fractional CTO / CPO / COO roles and transformation advisory for scale-ups." },
    ],

    tech: {
      title: "One portal runs your whole practice",
      description: "Briefs, contracts, milestones, time tracking and payouts in a single dashboard — the admin layer freelancers usually build by hand.",
      points: [
        { icon: "FileText", title: "Contracts & SOWs generated", description: "Client-ready agreements from approved templates, e-signed in minutes." },
        { icon: "Gauge", title: "Milestone & time tracking", description: "Log hours or milestones and watch escrow status change in real time." },
        { icon: "Wallet", title: "Automated invoicing", description: "Invoices raise on approval — you never chase a payment again." },
        { icon: "CalendarDays", title: "Capacity calendar", description: "Set availability windows; the engine only offers briefs that actually fit." },
      ],
      stats: [
        { value: "6 days", label: "Avg. payment cycle" },
        { value: "0", label: "Invoices chased" },
      ],
    },

    coverage: {
      title: "Brief types flowing through the network",
      note: "From two-week sprints to twelve-month fractional retainers — pick the shape that fits your practice.",
      chips: [
        "Fixed-scope sprints", "Time & materials", "Fractional retainers", "Discovery & audits",
        "Staff augmentation", "Team extensions", "Advisory days", "MVP builds",
        "Modernization programs", "AI pilots", "Compliance programs", "Interim leadership",
      ],
      stats: [
        { value: "1,100+", label: "Projects per year" },
        { value: "$61/hr", label: "Avg. blended rate" },
        { value: "31", label: "Countries billed from" },
      ],
    },

    modelsTitle: "Membership tiers",
    models: [
      {
        name: "Member",
        price: "0%",
        period: "platform fee",
        description: "Standard membership — full matching, escrow and payments. We take a transparent fee on the client side, never from your rate.",
        features: ["Full brief matching", "Escrow payment protection", "Contracting handled", "Community & office hours"],
        popular: false,
        cta: { label: "Join as member", href: "/contact" },
      },
      {
        name: "Vetted Pro",
        price: "0%",
        period: "platform fee",
        description: "For members who clear advanced vetting — priority matching, premium briefs and a named delivery contact.",
        features: ["Priority brief access", "Premium & retainer briefs", "Named delivery contact", "Rate negotiation support"],
        popular: true,
        cta: { label: "Apply for Pro", href: "/contact" },
      },
      {
        name: "Bench Lead",
        price: "0%",
        period: "platform fee",
        description: "Run your own micro-bench — subcontract vetted associates, keep the client relationship, scale your practice.",
        features: ["Subcontract vetted associates", "Multi-project dashboard", "Team rate structuring", "Dedicated partnerships manager"],
        popular: false,
        cta: { label: "Talk to partnerships", href: "mailto:partners@stioos.com" },
      },
    ],

    outcomes: [
      { value: "$8,400", label: "Avg. monthly member earnings", progress: 66 },
      { value: "83%", label: "Average utilization", progress: 83 },
      { value: "6 days", label: "Avg. payment cycle", progress: 92 },
      { value: "3.4×", label: "Avg. engagements per client", progress: 58 },
    ],

    testimonials: [
      {
        quote: "I haven't written a proposal in fourteen months. Briefs arrive matched to my stack, escrow is funded before kickoff, and the six-day payouts keep my cash flow boring — in the best way.",
        name: "Arjun Nair", role: "Full-Stack Developer", initials: "AN", rating: 5,
      },
      {
        quote: "As a fractional CFO I used to spend 40% of my time on business development. Now two retainers and a stream of advisory days come through the network, and the bench covers my holiday months.",
        name: "Hannah Kowalski", role: "Fractional CFO", initials: "HK", rating: 5,
      },
      {
        quote: "Rate protection is the sleeper feature. My rate with a Berlin client has held for a year while marketplaces tried to undercut me the whole time.",
        name: "Miguel Santos", role: "Data Engineer, Vetted Pro", initials: "MS", rating: 4,
      },
    ],

    caseStudy: {
      industry: "SaaS & Tech",
      title: "Solo developer scales to a four-person bench",
      challenge: "A freelance backend specialist kept turning down work — demand outstripped one person, but hiring and payroll felt like a second job.",
      solution: "He joined as a Vetted Pro, took multi-developer briefs and subcontracted three vetted associates through the Bench Lead tier.",
      results: [
        { value: "4×", label: "Revenue in 9 months" },
        { value: "3", label: "Associates on bench" },
        { value: "0", label: "Invoices chased" },
      ],
    },

    comparisonTitle: "Worksonn vs. freelance marketplaces",
    comparison: [
      { traditional: "Bid against 40 freelancers per gig", withUs: "Briefs matched to you — no proposals, no bidding" },
      { traditional: "20%+ platform cut from your rate", withUs: "Client-side fee model — your rate is your rate" },
      { traditional: "Invoice and chase for net-45 payments", withUs: "Escrow funded upfront, released in 6 days" },
      { traditional: "Rates reset with every new client", withUs: "Rate protected 12 months per client" },
      { traditional: "Feast-or-famine pipeline", withUs: "Capacity-aware stream sized to your calendar" },
      { traditional: "One-person shows forever", withUs: "Subcontract a vetted bench and scale up" },
    ],

    industries: [
      "SaaS & Tech", "FinTech", "Healthcare", "Retail & E-commerce", "Logistics",
      "Manufacturing", "Media & Entertainment", "Professional Services", "Energy & Utilities", "Education",
    ],

    regions: [
      { region: "Europe", cities: "Berlin · Amsterdam · London", note: "Deepest fractional demand" },
      { region: "North America", cities: "New York · Toronto · Austin", note: "Highest day rates" },
      { region: "Asia Pacific", cities: "Singapore · Bengaluru · Melbourne", note: "Fastest-growing stream" },
      { region: "Remote everywhere", cities: "31 countries billed", note: "Multi-currency payouts" },
    ],

    guarantees: [
      { icon: "Lock", title: "Escrow on every project", description: "Funds locked before kickoff, released per milestone — non-payment is structurally impossible." },
      { icon: "ShieldCheck", title: "12-month rate protection", description: "Your agreed rate can't be cut mid-engagement or at renewal within the window." },
      { icon: "CalendarDays", title: "You decline freely", description: "Turning down briefs never affects your matching rank — capacity is respected." },
      { icon: "Wallet", title: "6-day payment cycle", description: "Approved milestones clear to your account within six working days, every time." },
    ],

    experts: [
      { name: "Marco Bellini", role: "Head of Freelance Network", initials: "MB", specialty: "Member growth", stat: "3,600+ members onboarded" },
      { name: "Chen Wei", role: "Delivery Operations Lead", initials: "CW", specialty: "Escrow & payments", stat: "$19M payouts processed" },
      { name: "Amara Osei", role: "Principal Matchmaker", initials: "AO", specialty: "Brief matching", stat: "9,100+ briefs matched" },
    ],

    resources: [
      { type: "Guide", title: "Pricing your day rate in 2025", description: "Benchmarks by specialty and region — plus how to hold your rate in negotiations.", readTime: "9 min read" },
      { type: "Playbook", title: "From solo to bench lead", description: "How top members subcontract associates without becoming an agency admin.", readTime: "11 min read" },
      { type: "Checklist", title: "The vetting prep checklist", description: "Exactly what the vetting interview covers and how to clear it first time.", readTime: "4 min read" },
    ],

    faqs: [
      { q: "What does it cost to join?", a: "Nothing upfront. Membership is free; STIOOS earns a transparent fee on the client side of each engagement, so your quoted rate is what you're paid." },
      { q: "How does escrow work exactly?", a: "Before kickoff, the client funds a milestone plan. As you hit milestones and the client approves, escrow releases to your account — cleared within six working days." },
      { q: "Can I keep my existing clients?", a: "Yes — the network is additive. Many members keep direct clients and use Worksonn to fill capacity gaps with higher-quality briefs." },
      { q: "How much notice before a project starts?", a: "Briefs show start dates and expected runway before you accept. The standard window is 5–10 business days; urgent briefs are labeled and pay a premium." },
      { q: "What is vetting like?", a: "A portfolio review plus one structured interview covering skills, communication and delivery reliability. Vetted Pro adds reference checks and a live technical exercise." },
      { q: "Can I subcontract other freelancers?", a: "Yes — the Bench Lead tier lets you subcontract vetted associates under your engagement. We handle their contracting and payments; you keep the client relationship." },
    ],

    ctaBand: {
      kicker: "Membership open",
      title: "Fill your calendar with work worth doing",
      primary: {
        kicker: "Join the network",
        title: "Apply in 15 minutes",
        text: "Portfolio plus one interview — most members see their first matched brief within 72 hours.",
        cta: { label: "Apply now", href: "/contact" },
      },
      secondary: {
        kicker: "Enterprise buyer?",
        title: "Staff a project instead",
        text: "Skip freelancers entirely and scope a fully managed team through Talent Solutions.",
        cta: { label: "Explore Talent Solutions", href: "/talent-solutions" },
      },
    },

    contact: {
      title: "Talk to the freelance network team",
      note: "Applications reviewed within 72 hours — you'll get a clear decision and next steps.",
      channels: [
        { icon: "MessageSquare", label: "Chat with the member desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email partnerships", value: "partners@stioos.com", href: "mailto:partners@stioos.com" },
        { icon: "CalendarDays", label: "Book a membership call", value: "20-min intro", href: "/contact" },
      ],
    },
  },

  {
    slug: "company-agency",
    group: "worksonn",
    accent: "emerald",
    nav: "Company / Agency",

    eyebrow: "Worksonn Network · Delivery partner",
    title: "Company / Agency —",
    highlight: "your overflow delivery engine",
    subtitle:
      "Agencies and companies use STIOOS as their delivery arm — take on more client work with white-label teams, co-branded engagements and platform tooling that make your capacity look limitless.",
    primaryCta: { label: "Become a delivery partner", href: "/contact" },
    secondaryCta: { label: "See partnership models", href: "/worksonn/company-agency#models" },
    heroStats: [
      { value: "120+", label: "Agency partners" },
      { value: "40%", label: "Avg. capacity gain" },
      { value: "2 wks", label: "Team ramp-up" },
    ],

    trustBadges: [
      "White-label teams",
      "NDA-first engagements",
      "Your brand, our delivery",
      "Rate cards locked annually",
      "Dedicated partner manager",
      "No channel conflict",
    ],

    kpis: [
      { icon: "Building2", value: "120+", label: "Agency & company partners", detail: "Design, dev and consulting firms extending delivery through STIOOS." },
      { icon: "TrendingUp", value: "40%", label: "Avg. capacity gain", detail: "Additional client revenue partners take on within their first two quarters." },
      { icon: "Clock", value: "2 wks", label: "Team ramp-up", detail: "From scoped brief to a white-label team standing up in your own tools." },
      { icon: "ShieldCheck", value: "100%", label: "NDA & IP coverage", detail: "Every engagement runs under your paperwork, your brand, your ownership." },
    ],

    audiences: [
      {
        icon: "Building2",
        kicker: "Digital Agencies",
        title: "Say yes to bigger scopes",
        description: "Stop turning down work outside your core stack. Stand up white-label engineering, data or AI teams and keep the client relationship 100% yours.",
        bullets: [
          "White-label devs, designers & PMs",
          "Your brand on every artifact",
          "Fixed-price or T&M subcontracts",
          "No channel conflict — ever",
        ],
        cta: { label: "Start a partnership", href: "/contact" },
      },
      {
        icon: "Briefcase",
        kicker: "Consulting & Services Firms",
        title: "Deliver beyond the deck",
        description: "Advisory firms use STIOOS to implement what they recommend — build squads that execute roadmaps under your engagement letter.",
        bullets: [
          "Implementation squads post-advisory",
          "Specialists on 48-hour request",
          "Compliance-aligned contracting",
          "Shared QA & delivery reporting",
        ],
        cta: { label: "Discuss your roadmap work", href: "mailto:partners@stioos.com" },
      },
    ],

    valueProps: [
      { icon: "Layers", title: "Overflow delivery on demand", description: "Scale squads up for a launch and down after — capacity without permanent headcount or bench anxiety." },
      { icon: "BadgeCheck", title: "White-label everything", description: "Teams work in your repos, your tools and your brand. Your client never sees our name unless you want them to." },
      { icon: "Handshake", title: "Co-branded engagements", description: "For flagship pursuits, go co-branded — joint pitch support, shared case studies and partner-of-record status." },
      { icon: "Wrench", title: "Platform tooling included", description: "Project dashboards, time tracking, QA gates and client reporting — the ops layer agencies usually duct-tape together." },
      { icon: "ShieldCheck", title: "NDA-first, IP-safe", description: "Every engagement under your NDA. Work product, code and client relationships stay yours — contractually." },
      { icon: "Gauge", title: "Margins you can plan on", description: "Locked annual rate cards and transparent markup — price client work without guessing your delivery cost." },
    ],

    processTitle: "How a partnership spins up in 5 steps",
    process: [
      { title: "Partnership fit call", duration: "Week 1", description: "Map your delivery gaps, stacks and margin targets. We define where STIOOS plugs in and where it must not touch." },
      { title: "Papering & protections", duration: "Week 1–2", description: "NDA, master services agreement and rate card locked — including no-channel-conflict clauses in writing." },
      { title: "Pilot engagement", duration: "Weeks 2–4", description: "Start with one contained project — a white-label squad in your tools, reporting in your format." },
      { title: "Scale the bench", duration: "Quarter 1", description: "Reserve named capacity, add specialists on 48-hour requests and co-brand your biggest pursuit." },
      { title: "Run it as an engine", duration: "Ongoing", description: "Quarterly business reviews, locked rate renewals and a partner manager whose job is your utilization." },
    ],

    spotlight: [
      {
        icon: "Network",
        title: "A bench that acts like yours",
        description: "Draw on 2,000+ vetted professionals across AI, engineering, data and design — reserved capacity behaves like your own bench, minus the payroll.",
        bullets: ["2,000+ vetted professionals", "48-hour specialist requests", "Named reserved teams"],
        visual: "network",
      },
      {
        icon: "BarChart3",
        title: "The partner control tower",
        description: "One dashboard for every engagement: milestones, burn, QA gates and client-ready reports exported under your brand.",
        bullets: ["Live project dashboards", "White-label reporting", "Margin tracking per deal"],
        visual: "dashboard",
      },
      {
        icon: "Award",
        title: "Partner status that wins pitches",
        description: "Co-branded case studies, partner badges and joint reference calls turn 'we can probably deliver' into 'here is proof we do'.",
        bullets: ["Co-branded case studies", "Partner-of-record badge", "Joint reference calls"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What every delivery partner gets",
    deliverables: [
      "White-label squads in your tools & brand",
      "NDA, MSA and no-channel-conflict agreements",
      "Locked annual rate card & margin sheet",
      "Dedicated partner delivery manager",
      "Partner dashboard with white-label reports",
      "48-hour specialist request desk",
      "Co-branded case studies & pitch support",
      "Quarterly business reviews & capacity planning",
    ],

    modulesTitle: "Delivery capability you can resell",
    modules: [
      { icon: "Code", tag: "Engineering", title: "Product & Platform Teams", description: "Full-stack squads that build and run client products under your brand." },
      { icon: "Bot", tag: "AI", title: "AI & Automation Squads", description: "LLM apps, agents and automation builds — the scopes clients now expect you to offer." },
      { icon: "Database", tag: "Data", title: "Data & Analytics Teams", description: "Pipelines, warehousing and BI your agency can attach to any strategy engagement." },
      { icon: "Cloud", tag: "Cloud", title: "Cloud & DevOps Pods", description: "Migrations, infrastructure and managed ops delivered behind your logo." },
      { icon: "ShieldCheck", tag: "Security", title: "Security & Compliance", description: "Assessments and compliance programs that de-risk your client commitments." },
      { icon: "Lightbulb", tag: "Design", title: "Design & Product", description: "UX, product design and research capacity for creative-led agencies." },
    ],

    tech: {
      title: "Tooling that makes you look bigger",
      description: "The partner platform handles delivery ops end-to-end — so a five-person agency runs client work like a fifty-person firm.",
      points: [
        { icon: "Gauge", title: "Multi-project dashboard", description: "Every engagement's milestones, burn and health in one partner view." },
        { icon: "FileText", title: "White-label reporting", description: "Client-ready status reports exported with your logo and your format." },
        { icon: "Users", title: "Team reserve & request desk", description: "Hold named capacity and pull specialists within 48 hours." },
        { icon: "Lock", title: "Access & IP controls", description: "Scoped repo access, NDA enforcement and clean IP assignment per project." },
      ],
      stats: [
        { value: "48h", label: "Specialist request SLA" },
        { value: "100%", label: "NDA & IP coverage" },
      ],
    },

    coverage: {
      title: "Engagements partners run through STIOOS",
      note: "From a two-week overflow sprint to a multi-year reserved team — the model flexes to the deal you're signing.",
      chips: [
        "Overflow sprints", "Dedicated squads", "Staff augmentation", "White-label builds",
        "AI pilots", "Data platform builds", "Cloud migrations", "QA retainers",
        "Managed support", "Discovery & scoping", "Modernization", "Launch support",
      ],
      stats: [
        { value: "120+", label: "Active partners" },
        { value: "410+", label: "Partner projects / yr" },
        { value: "31%", label: "Avg. partner margin" },
      ],
    },

    modelsTitle: "Partnership models",
    models: [
      {
        name: "Overflow Partner",
        price: "Pay-per-project",
        period: "no retainer",
        description: "Send us the work you can't staff. Fixed-price subcontracts with your markup intact and zero commitment.",
        features: ["Per-project scoping", "White-label delivery", "Weekly reporting", "No commitment"],
        popular: false,
        cta: { label: "Start with a project", href: "/contact" },
      },
      {
        name: "Reserve Partner",
        price: "Reserved bench",
        period: "monthly retainer",
        description: "Hold named capacity for predictable client flow — the model 70% of partners graduate to within a year.",
        features: ["Named reserved team", "Priority ramp-up", "Locked annual rate card", "Partner manager + QBRs"],
        popular: true,
        cta: { label: "Discuss a reserve", href: "/contact" },
      },
      {
        name: "Co-Branded Alliance",
        price: "Revenue share",
        period: "per engagement",
        description: "Joint pursuit, co-branded delivery and partner-of-record status on flagship accounts.",
        features: ["Joint pitch support", "Co-branded case studies", "Partner-of-record badge", "Strategic account planning"],
        popular: false,
        cta: { label: "Talk to partnerships", href: "mailto:partners@stioos.com" },
      },
    ],

    outcomes: [
      { value: "40%", label: "Avg. capacity gain", progress: 64 },
      { value: "2 wks", label: "Avg. team ramp-up", progress: 76 },
      { value: "97%", label: "Partner retention", progress: 97 },
      { value: "31%", label: "Avg. partner margin", progress: 55 },
    ],

    testimonials: [
      {
        quote: "We took on a $400K build we'd normally decline. The white-label squad was in our Jira in nine days and the client still has no idea — they just know we finally say yes.",
        name: "Rachel Tan", role: "Founder, digital agency", initials: "RT", rating: 5,
      },
      {
        quote: "The no-channel-conflict clause is what sold us. Two years on, they've never once gone around us, and our margin sheet is exactly what we signed.",
        name: "Viktor Hansen", role: "Managing Partner, consultancy", initials: "VH", rating: 5,
      },
      {
        quote: "Their reporting exports look like our reports. Clients see our logo, our format, our timeline — the delivery engine behind it is invisible.",
        name: "Neha Kulkarni", role: "Delivery Director, SaaS services firm", initials: "NK", rating: 4,
      },
    ],

    caseStudy: {
      industry: "Creative & Digital",
      title: "Twelve-person agency triples billable capacity",
      challenge: "A branding-led agency kept losing web and app scopes to bigger rivals because engineering delivery was the bottleneck.",
      solution: "They partnered for overflow engineering, then moved to a reserved bench — product squads delivered every web scope under the agency's brand.",
      results: [
        { value: "3×", label: "Billable capacity" },
        { value: "$1.1M", label: "New revenue in year 1" },
        { value: "0", label: "Delivery escalations" },
      ],
    },

    comparisonTitle: "STIOOS delivery partner vs. hiring & subcontracting",
    comparison: [
      { traditional: "Hire in cycles, bench people between deals", withUs: "Pay for capacity only while the client pays you" },
      { traditional: "Freelance subcontractors, inconsistent quality", withUs: "Vetted squads with QA gates and delivery managers" },
      { traditional: "Subs who network directly with your clients", withUs: "Contractual no-channel-conflict protection" },
      { traditional: "Three months to hire one senior engineer", withUs: "White-label team ramping in two weeks" },
      { traditional: "DIY project ops across ten tools", withUs: "Partner dashboard with white-label reporting" },
      { traditional: "Margins squeezed at every renewal", withUs: "Rate cards locked annually, margins visible" },
    ],

    industries: [
      "SaaS & Tech", "FinTech", "Healthcare", "Retail & E-commerce", "Media & Entertainment",
      "Professional Services", "Manufacturing", "Logistics", "Education", "Energy & Utilities",
    ],

    regions: [
      { region: "North America", cities: "New York · Chicago · Toronto", note: "Largest partner base" },
      { region: "Europe", cities: "London · Berlin · Stockholm", note: "Strong agency density" },
      { region: "Asia Pacific", cities: "Singapore · Sydney · Mumbai", note: "Fastest-growing channel" },
      { region: "Middle East", cities: "Dubai · Riyadh", note: "Giga-project demand" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "No channel conflict", description: "We never approach your clients directly — contractual, not cultural." },
      { icon: "Lock", title: "Your IP, your code", description: "Work product assigns to you or your client on delivery. Repos are yours." },
      { icon: "Handshake", title: "Locked rate cards", description: "Annual rate lock with margin math you can put in front of your CFO." },
      { icon: "BadgeCheck", title: "Delivery SLA-backed", description: "Milestone quality gates and remediation commitments written into the MSA." },
    ],

    experts: [
      { name: "Stefan Novak", role: "Head of Delivery Partnerships", initials: "SN", specialty: "Agency alliances", stat: "120+ partners onboarded" },
      { name: "Lakshmi Menon", role: "Partner Delivery Manager", initials: "LM", specialty: "White-label ops", stat: "410+ projects delivered" },
      { name: "Peter Vaughn", role: "Alliances Director", initials: "PV", specialty: "Co-branded pursuits", stat: "$28M partner pipeline" },
    ],

    resources: [
      { type: "Playbook", title: "Saying yes to out-of-stack work", description: "How agencies structure overflow delivery without risking client trust.", readTime: "10 min read" },
      { type: "Guide", title: "Margin math for delivery partners", description: "Model your markup, ramp and utilization before you sign an MSA.", readTime: "7 min read" },
      { type: "Case pack", title: "Agency partner case pack", description: "Three anonymized partner engagements with real margin and NPS data.", readTime: "12 min read" },
    ],

    faqs: [
      { q: "Will STIOOS approach my clients directly?", a: "No — a no-channel-conflict clause is in every partner MSA. We deliver under your direction; direct client work only ever happens by your explicit referral." },
      { q: "How white-label is 'white-label'?", a: "Completely. Squads work in your repos and tools, reports carry your logo, and our name appears nowhere unless you choose co-branding." },
      { q: "How fast can a team start?", a: "Standard squads ramp in about two weeks from scoped brief. For Reserve Partners with named teams, re-engagement is often a matter of days." },
      { q: "What does the commercial model look like?", a: "Fixed-price or T&M subcontracts priced off your locked rate card. You bill your client as usual — the margin math stays on your side of the table." },
      { q: "Can we start with a small pilot?", a: "That's the recommended path — most partners begin with one contained project, prove delivery quality, then move to a reserved bench within a quarter." },
      { q: "Who owns the code and work product?", a: "You or your client, per the engagement paperwork. IP assignment is clean on every project — nothing reverts to STIOOS." },
    ],

    ctaBand: {
      kicker: "Partnerships open",
      title: "Give your agency limitless delivery",
      primary: {
        kicker: "Become a partner",
        title: "Book a partnership fit call",
        text: "Map your delivery gaps and see the rate card — most partners pilot within two weeks.",
        cta: { label: "Book your call", href: "/contact" },
      },
      secondary: {
        kicker: "Need people, not teams?",
        title: "Hire from the network",
        text: "Staff individual roles through Talent Solutions while your partner bench is being scoped.",
        cta: { label: "See Talent Solutions", href: "/talent-solutions#placements" },
      },
    },

    contact: {
      title: "Talk to the delivery partnerships team",
      note: "Fit calls scheduled within two business days — bring a real scope if you have one.",
      channels: [
        { icon: "Phone", label: "Call partner alliances", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email partnerships", value: "partners@stioos.com", href: "mailto:partners@stioos.com" },
        { icon: "CalendarDays", label: "Book a fit call", value: "30-min scoping session", href: "/contact" },
      ],
    },
  },

  {
    slug: "training-partner",
    group: "worksonn",
    accent: "violet",
    nav: "Training Partner",

    eyebrow: "Worksonn Network · Enablement",
    title: "Training Partner —",
    highlight: "deliver industry-ready programs",
    subtitle:
      "Training institutes and educators deliver STIOOS-aligned curricula, earn certification, fill cohorts from our 2M+ talent pool and earn per graduate placed into the network.",
    primaryCta: { label: "Become a training partner", href: "/contact" },
    secondaryCta: { label: "See the certification path", href: "/worksonn/training-partner#certification" },
    heroStats: [
      { value: "85+", label: "Training partners" },
      { value: "2M+", label: "Talent pool reach" },
      { value: "76%", label: "Graduate placement rate" },
    ],

    trustBadges: [
      "STIOOS-aligned curricula",
      "Accredited certification",
      "Cohort fill support",
      "Per-placement revenue",
      "Faculty enablement included",
      "Employer-validated content",
    ],

    kpis: [
      { icon: "GraduationCap", value: "85+", label: "Training partners", detail: "Institutes, bootcamps and university programs across 19 countries." },
      { icon: "Users", value: "2M+", label: "Talent pool reach", detail: "Your cohorts get direct pipeline into the network's candidate base." },
      { icon: "TrendingUp", value: "76%", label: "Placement rate", detail: "Graduates of aligned programs placed within 90 days of certification." },
      { icon: "Wallet", value: "$900", label: "Avg. fee per placement", detail: "Earned per placed graduate — on top of your standard tuition." },
    ],

    audiences: [
      {
        icon: "GraduationCap",
        kicker: "Training Institutes",
        title: "Teach what employers actually buy",
        description: "Replace outdated syllabi with STIOOS-aligned tracks in AI, cloud and data — validated by 2,000+ employers who hire from them.",
        bullets: [
          "Curriculum co-designed with hiring data",
          "Employer-validated capstone projects",
          "Cohort fill from the 2M+ pool",
          "Per-placement revenue share",
        ],
        cta: { label: "Apply as an institute", href: "/contact" },
      },
      {
        icon: "BookOpen",
        kicker: "Educators & Bootcamps",
        title: "Certification that carries weight",
        description: "Deliver STIOOS certification exams and give graduates a credential employers in the network screen for by name.",
        bullets: [
          "Accredited examiner onboarding",
          "Proctored assessment infrastructure",
          "Faculty train-the-trainer program",
          "Co-branded completion certificates",
        ],
        cta: { label: "See certification tracks", href: "/worksonn/training-partner#certification" },
      },
    ],

    valueProps: [
      { icon: "BookOpen", title: "Aligned, living curricula", description: "Tracks are refreshed quarterly against real hiring requirements from 2,000+ employers — never a static PDF." },
      { icon: "Users", title: "Cohort fill from 2M+ pool", description: "Struggling to fill seats? Your programs get direct pipeline from the network's candidate base, matched by intent." },
      { icon: "Wallet", title: "Earn per placed graduate", description: "Every graduate hired through the network pays your institute a placement fee — recurring revenue on top of tuition." },
      { icon: "Award", title: "Certification with teeth", description: "Proctored, employer-validated exams mean your credential is a hiring signal, not a participation trophy." },
      { icon: "Video", title: "Faculty enablement built in", description: "Train-the-trainer programs, teaching kits and grading rubrics get your staff delivery-ready in weeks." },
      { icon: "BarChart3", title: "Outcome analytics per cohort", description: "See placement rates, employer feedback and skill-gap heatmaps — and pitch those outcomes to enroll the next cohort." },
    ],

    processTitle: "Becoming a certified training partner in 5 steps",
    process: [
      { title: "Apply & accreditation review", duration: "Week 1", description: "Share your programs, faculty and facilities. We assess alignment with network hiring demand." },
      { title: "Curriculum alignment", duration: "Weeks 2–4", description: "Map your syllabus to STIOOS skill frameworks — or adopt an off-the-shelf aligned track." },
      { title: "Faculty certification", duration: "Weeks 3–6", description: "Your instructors complete train-the-trainer enablement and co-teach with network practitioners." },
      { title: "First cohort launch", duration: "Quarter 1", description: "Fill seats from the talent pool, run the program and proctor STIOOS certification exams." },
      { title: "Placement & revenue loop", duration: "Ongoing", description: "Graduates enter the matching engine, get placed, and your institute earns per placement — quarter after quarter." },
    ],

    spotlight: [
      {
        icon: "BrainCircuit",
        title: "Curricula tuned by hiring data",
        description: "Skill frameworks update quarterly from live employer requirements, so graduates are examined on what is actually being hired for.",
        bullets: ["Quarterly skill refresh", "Employer-validated capstones", "Skill-gap heatmaps"],
        visual: "radial",
      },
      {
        icon: "BarChart3",
        title: "The partner outcomes dashboard",
        description: "Track enrollment, certification pass rates and placements per cohort — the evidence pack for your next enrollment drive.",
        bullets: ["Cohort-level analytics", "Placement tracking", "Employer feedback loop"],
        visual: "dashboard",
      },
      {
        icon: "Award",
        title: "A credential employers screen for",
        description: "STIOOS certification appears directly in candidate profiles across the network — employers filter for it by name.",
        bullets: ["Proctored exams", "Network-visible badges", "Employer name recognition"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What every training partner receives",
    deliverables: [
      "STIOOS-aligned curriculum tracks & kits",
      "Train-the-trainer faculty certification",
      "Proctored certification exam infrastructure",
      "Cohort fill pipeline from the 2M+ pool",
      "Per-placement revenue share",
      "Cohort outcomes & placement dashboard",
      "Co-branded certificates & marketing kit",
      "Quarterly curriculum refresh briefings",
    ],

    modulesTitle: "Aligned program tracks",
    modules: [
      { icon: "Bot", tag: "AI", title: "AI & Agentic Engineering", description: "LLM application development, agent workflows and applied machine learning tracks." },
      { icon: "Code", tag: "Technology", title: "Full-Stack Development", description: "Web and mobile engineering tracks mapped to live hiring requirements." },
      { icon: "Cloud", tag: "Cloud", title: "Cloud & DevOps", description: "Cloud architecture, Kubernetes and SRE programs with hands-on labs." },
      { icon: "Database", tag: "Data", title: "Data & Analytics", description: "Data engineering, analytics and BI tracks with employer capstones." },
      { icon: "ShieldCheck", tag: "Security", title: "Cybersecurity", description: "Defensive security, compliance and audit-ready certification tracks." },
      { icon: "Briefcase", tag: "Business", title: "Business & Product", description: "Business analysis, product management and digital operations programs." },
    ],

    tech: {
      title: "A training platform your faculty will actually use",
      description: "Cohort management, proctored assessments, grading rubrics and placement tracking — one system from enrollment to placement.",
      points: [
        { icon: "Users", title: "Cohort management", description: "Enroll, segment and track every learner group with attendance and progress views." },
        { icon: "Video", title: "Proctored exam delivery", description: "Remote-proctored certification exams with anti-cheat and instant scoring." },
        { icon: "BarChart3", title: "Outcome analytics", description: "Placement rates and employer feedback per cohort, exportable for accreditation." },
        { icon: "FileText", title: "Curriculum versioning", description: "Quarterly updates roll out with change logs — your syllabus never goes stale." },
      ],
      stats: [
        { value: "76%", label: "Graduate placement rate" },
        { value: "19", label: "Countries with partners" },
      ],
    },

    coverage: {
      title: "Where partner programs are running",
      note: "On-campus, hybrid and fully remote cohorts — many institutes run STIOOS tracks alongside existing diplomas.",
      chips: [
        "AI & ML foundations", "Full-Stack bootcamps", "Cloud certifications", "Data engineering",
        "Cybersecurity", "Business analysis", "Product management", "Digital marketing",
        "QA & automation", "DevOps", "Train the trainer", "Corporate upskilling",
      ],
      stats: [
        { value: "85+", label: "Partner institutes" },
        { value: "19", label: "Countries" },
        { value: "9,600+", label: "Graduates certified" },
      ],
    },

    modelsTitle: "Partnership tiers",
    models: [
      {
        name: "Affiliate",
        price: "Per placement",
        period: "revenue share",
        description: "Adopt one aligned track with certification exams — a simple entry point with per-placement earnings.",
        features: ["1 aligned track", "Certification exam access", "Cohort fill support", "Placement revenue share"],
        popular: false,
        cta: { label: "Start as affiliate", href: "/contact" },
      },
      {
        name: "Certified Center",
        price: "Annual license",
        period: "multi-track",
        description: "Run multiple aligned tracks with full faculty enablement — the tier most institutes choose.",
        features: ["Up to 5 aligned tracks", "Faculty certification program", "Outcomes dashboard", "Co-branded marketing kit"],
        popular: true,
        cta: { label: "Apply for certification", href: "/contact" },
      },
      {
        name: "Academy Alliance",
        price: "Strategic",
        period: "multi-year",
        description: "Exclusive regional alignment, co-developed curricula and joint go-to-market with STIOOS.",
        features: ["Regional exclusivity options", "Co-developed curricula", "Joint marketing & events", "Executive sponsor & QBRs"],
        popular: false,
        cta: { label: "Talk to partnerships", href: "mailto:partners@stioos.com" },
      },
    ],

    outcomes: [
      { value: "76%", label: "Graduate placement rate", progress: 76 },
      { value: "$900", label: "Avg. fee per placement", progress: 60 },
      { value: "9,600+", label: "Graduates certified", progress: 81 },
      { value: "92%", label: "Partner renewal rate", progress: 92 },
    ],

    testimonials: [
      {
        quote: "Our placement numbers used to be a marketing guess. Now 78% of our last cloud cohort got offers within 90 days — and the institute earns on every one of them.",
        name: "David Mensah", role: "Director, technology institute", initials: "DM", rating: 5,
      },
      {
        quote: "The curriculum refresh is the real product. When LLM engineering took off, our track updated that quarter — competitors were teaching last year's stack.",
        name: "Laura Petrova", role: "Program Lead, bootcamp", initials: "LP", rating: 5,
      },
      {
        quote: "Cohort fill solved our biggest headache. The talent pool pipeline brought us pre-qualified, motivated learners we'd never have reached alone.",
        name: "Kenji Watanabe", role: "Dean, professional studies", initials: "KW", rating: 4,
      },
    ],

    caseStudy: {
      industry: "Education",
      title: "Regional institute becomes its city's placement leader",
      challenge: "A mid-size training institute had strong teaching but weak employer connections — graduates finished programs into silence.",
      solution: "They adopted three aligned tracks, certified six faculty and plugged cohorts into the network's matching engine from day one of enrollment.",
      results: [
        { value: "81%", label: "Placement rate (was 34%)" },
        { value: "6", label: "Certified faculty" },
        { value: "2.6×", label: "Enrollment growth" },
      ],
    },

    comparisonTitle: "STIOOS-aligned programs vs. legacy syllabi",
    comparison: [
      { traditional: "Syllabus frozen for 5+ years", withUs: "Curricula refreshed every quarter from hiring data" },
      { traditional: "Placement stats are marketing claims", withUs: "Placement tracked and verified per cohort" },
      { traditional: "Graduates job-hunt cold", withUs: "Graduates enter a 2M+ pool with AI matching" },
      { traditional: "Generic certificates nobody screens for", withUs: "Certification employers filter for by name" },
      { traditional: "Faculty left to improvise", withUs: "Train-the-trainer and teaching kits included" },
      { traditional: "Tuition is the only revenue", withUs: "Per-placement revenue on every hired graduate" },
    ],

    industries: [
      "Education", "SaaS & Tech", "FinTech", "Healthcare", "Manufacturing",
      "Retail & E-commerce", "Public Sector", "Professional Services", "Logistics", "Energy & Utilities",
    ],

    regions: [
      { region: "Asia Pacific", cities: "Bengaluru · Singapore · Manila", note: "Largest partner network" },
      { region: "Europe", cities: "London · Warsaw · Lisbon", note: "Strong bootcamp density" },
      { region: "North America", cities: "Toronto · Austin · Chicago", note: "University alliances" },
      { region: "Africa & Middle East", cities: "Nairobi · Dubai · Cairo", note: "Fastest-growing cohorts" },
    ],

    guarantees: [
      { icon: "RefreshCw", title: "Quarterly curriculum refresh", description: "Tracks update against live hiring data — never let your syllabus fossilize again." },
      { icon: "Wallet", title: "Per-placement revenue", description: "Every graduate placed through the network pays your institute, on top of tuition." },
      { icon: "Award", title: "Recognized certification", description: "Employers in the network screen for STIOOS certification in candidate search." },
      { icon: "Users", title: "Cohort fill pipeline", description: "If a cohort underfills, the talent pool pipeline is activated to top it up." },
    ],

    experts: [
      { name: "Ingrid Salazar", role: "Head of Learning Partnerships", initials: "IS", specialty: "Institute alliances", stat: "85+ partners certified" },
      { name: "Kwame Boateng", role: "Curriculum Director", initials: "KB", specialty: "Skills frameworks", stat: "26 tracks authored" },
      { name: "Yuki Tanaka", role: "Certification Lead", initials: "YT", specialty: "Assessment design", stat: "48,000 exams proctored" },
    ],

    resources: [
      { type: "Guide", title: "Aligning your syllabus to hiring demand", description: "The mapping exercise every partner completes — with a worked example.", readTime: "9 min read" },
      { type: "Playbook", title: "Filling cohorts from the talent pool", description: "How partner institutes market aligned tracks and fill seats in 6 weeks.", readTime: "8 min read" },
      { type: "Report", title: "The 2025 placement outcomes report", description: "Placement rates, salary lifts and employer satisfaction across all cohorts.", readTime: "14 min read" },
    ],

    faqs: [
      { q: "Do we have to replace our existing programs?", a: "No — most partners align one or two tracks first and run them alongside existing diplomas. Adoption grows as the placement data proves the difference." },
      { q: "How does per-placement revenue work?", a: "When a graduate from your certified program is hired through the network, your institute earns a placement fee — currently averaging $900 per placement, paid quarterly." },
      { q: "What does faculty certification involve?", a: "Train-the-trainer enablement over 3–4 weeks: skill frameworks, teaching kits, grading rubrics and a co-teaching stint with a network practitioner." },
      { q: "Who writes the curriculum?", a: "STIOOS's curriculum team authors the frameworks and refreshes them quarterly from live hiring requirements; you localize and deliver with our kits." },
      { q: "How do exams and certification work?", a: "Exams are proctored remotely or on-campus through our assessment infrastructure, scored centrally, and the credential appears in the graduate's network profile." },
      { q: "Is there regional exclusivity?", a: "At the Academy Alliance tier, yes — selected partners can hold exclusive alignment for a track within a defined region, subject to volume commitments." },
    ],

    ctaBand: {
      kicker: "Now onboarding partners",
      title: "Teach what the market is hiring for",
      primary: {
        kicker: "Become a training partner",
        title: "Apply for accreditation review",
        text: "Share your programs and get an alignment assessment within two weeks.",
        cta: { label: "Apply now", href: "/contact" },
      },
      secondary: {
        kicker: "Employer instead?",
        title: "Hire certified graduates",
        text: "Certified cohorts feed directly into the network — see the placement engine behind them.",
        cta: { label: "See Talent Solutions", href: "/talent-solutions#placements" },
      },
    },

    contact: {
      title: "Talk to the learning partnerships team",
      note: "Accreditation reviews start within two weeks of application.",
      channels: [
        { icon: "Mail", label: "Email learning partnerships", value: "partners@stioos.com", href: "mailto:partners@stioos.com" },
        { icon: "Phone", label: "Call the partner desk", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "CalendarDays", label: "Book an accreditation chat", value: "30-min intro", href: "/contact" },
      ],
    },
  },

  {
    slug: "services-partner",
    group: "worksonn",
    accent: "violet",
    nav: "Services Partner",

    eyebrow: "Worksonn Network · Co-delivery",
    title: "Services Partner —",
    highlight: "co-deliver with our teams",
    subtitle:
      "Consultancies and studios co-deliver client engagements with STIOOS squads — joint statements of work, specialist bench access on 48-hour requests and partner margin on every shared delivery.",
    primaryCta: { label: "Apply as services partner", href: "/contact" },
    secondaryCta: { label: "See how co-delivery works", href: "/worksonn/services-partner#co-delivery" },
    heroStats: [
      { value: "90+", label: "Services partners" },
      { value: "48h", label: "Specialist bench SLA" },
      { value: "18%", label: "Avg. partner margin" },
    ],

    trustBadges: [
      "Joint statements of work",
      "Specialist bench access",
      "Partner margin on delivery",
      "Client-of-record respected",
      "Joint governance model",
      "Mutual NDA framework",
    ],

    kpis: [
      { icon: "Handshake", value: "90+", label: "Active services partners", detail: "Consultancies, studios and advisory firms co-delivering with our squads." },
      { icon: "Clock", value: "48h", label: "Bench request SLA", detail: "Specialists — from LLM engineers to compliance leads — join your engagement within two days." },
      { icon: "TrendingUp", value: "18%", label: "Avg. partner margin", detail: "Share of delivery value on jointly executed engagements." },
      { icon: "FileText", value: "140+", label: "Joint SOWs signed / yr", detail: "Co-authored statements of work across AI, cloud, data and advisory programs." },
    ],

    audiences: [
      {
        icon: "Compass",
        kicker: "Consultancies",
        title: "Sell the outcome, share the build",
        description: "Keep owning strategy and the client relationship; pull in STIOOS squads to implement under a joint SOW with shared governance.",
        bullets: [
          "Joint SOWs with clear work splits",
          "Your client relationship stays yours",
          "Delivery governance you co-chair",
          "Partner margin on shared scope",
        ],
        cta: { label: "Propose a co-delivery", href: "/contact" },
      },
      {
        icon: "Lightbulb",
        kicker: "Studios & Boutiques",
        title: "Punch above your headcount",
        description: "Compete for enterprise scopes with specialist bench access that fills the gaps a boutique can't staff — without hiring.",
        bullets: [
          "48-hour specialist requests",
          "Enterprise-grade delivery ops",
          "NDA-first collaboration",
          "Scale per engagement, not payroll",
        ],
        cta: { label: "Meet the bench", href: "/worksonn/services-partner#bench" },
      },
    ],

    valueProps: [
      { icon: "Handshake", title: "Joint SOWs, clear splits", description: "One statement of work, one governance rhythm, explicit scope ownership — clients see a single accountable team." },
      { icon: "Users", title: "Specialist bench on 48-hour request", description: "LLM engineers, data architects, security leads — request a specialist and they're briefed and billing within two days." },
      { icon: "TrendingUp", title: "Partner margin on delivery", description: "Earn a defined share of delivery value on every co-executed engagement, paid on the same milestone rhythm." },
      { icon: "ShieldCheck", title: "Client-of-record respected", description: "The relationship that brought the deal stays yours — co-delivery never becomes a channel around you." },
      { icon: "Settings", title: "Shared governance that works", description: "Joint steering, one delivery dashboard and weekly triage — co-delivery without the coordination tax." },
      { icon: "Globe", title: "Follow the client anywhere", description: "Multi-region engagements with timezone-matched squads and local contracting in 31 countries." },
    ],

    processTitle: "How a co-delivery engagement comes together in 5 steps",
    process: [
      { title: "Partner fit & framework", duration: "Week 1", description: "Sign the mutual NDA and partnership framework — commercial splits, governance and client-of-record rules defined upfront." },
      { title: "Joint pursuit support", duration: "Weeks 1–3", description: "Bring a live opportunity; we contribute solution architects, estimators and proof points to the pitch." },
      { title: "Joint SOW authoring", duration: "Weeks 2–4", description: "One statement of work with explicit scope splits, milestone cadence and shared quality gates." },
      { title: "Bench assembly & kickoff", duration: "Week 4+", description: "Squads from both sides assemble under one delivery lead — specialists requested and in-seat within 48 hours." },
      { title: "Deliver, review & renew", duration: "Ongoing", description: "Weekly triage, monthly steering and margin settlement per milestone — then plan the next pursuit together." },
    ],

    spotlight: [
      {
        icon: "Network",
        title: "One team, two firms, zero seams",
        description: "Co-delivery squads share one backlog, one dashboard and one delivery lead — the client experiences a single accountable team.",
        bullets: ["Shared backlog & rituals", "Single delivery lead", "Unified reporting"],
        visual: "network",
      },
      {
        icon: "Users",
        title: "The specialist bench, on call",
        description: "2,000+ vetted professionals across AI, engineering, data, design and security — request exactly the profile your engagement is missing.",
        bullets: ["2,000+ vetted specialists", "48-hour request SLA", "Timezone-matched staffing"],
        visual: "radial",
      },
      {
        icon: "FileText",
        title: "Governance on paper, not vibes",
        description: "Joint SOW templates, steering agendas and margin settlement built into the partnership framework — disputes have nowhere to start.",
        bullets: ["Joint SOW templates", "Milestone margin settlement", "Escalation paths defined"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What the partnership framework includes",
    deliverables: [
      "Mutual NDA & co-delivery framework agreement",
      "Joint SOW templates & scope-split worksheets",
      "48-hour specialist bench access",
      "Shared delivery dashboard & reporting",
      "Joint governance & steering cadence",
      "Partner margin settlement per milestone",
      "Joint pursuit & pitch support",
      "Named partnerships manager & QBRs",
    ],

    modulesTitle: "Co-delivery practices",
    modules: [
      { icon: "Bot", tag: "AI", title: "AI Transformation Programs", description: "Strategy-to-production AI programs co-delivered with advisory-led partners." },
      { icon: "Cloud", tag: "Cloud", title: "Cloud & Platform Modernization", description: "Migration and platform programs where consultancies own change, we own build." },
      { icon: "Database", tag: "Data", title: "Data & Analytics Programs", description: "Warehouse, governance and BI programs co-executed with data-minded firms." },
      { icon: "ShieldCheck", tag: "Security", title: "Security & Compliance", description: "Assessment-to-remediation programs with audit and advisory partners." },
      { icon: "Compass", tag: "Advisory", title: "Post-Advisory Implementation", description: "Turn partner roadmaps into delivered outcomes with implementation squads." },
      { icon: "Layers", tag: "Product", title: "Product & Experience Builds", description: "Studios co-deliver product, design and experience work with engineering depth." },
    ],

    tech: {
      title: "One delivery plane, flown together",
      description: "Shared dashboards, integrated time tracking and milestone settlements — the operational plumbing co-delivery usually lacks.",
      points: [
        { icon: "BarChart3", title: "Shared delivery dashboard", description: "Both firms see the same milestones, burn and risks — one version of the truth." },
        { icon: "FileText", title: "Joint SOW workspace", description: "Author, version and e-sign co-delivery statements of work in one place." },
        { icon: "Wallet", title: "Milestone margin settlement", description: "Partner margin calculates and settles automatically per approved milestone." },
        { icon: "MessageSquare", title: "Joint triage channels", description: "Shared war rooms and weekly triage keep both teams on one rhythm." },
      ],
      stats: [
        { value: "48h", label: "Bench request SLA" },
        { value: "140+", label: "Joint SOWs / year" },
      ],
    },

    coverage: {
      title: "Engagements co-delivered with partners",
      note: "Typically partner-led strategy and client ownership, STIOOS-led build and scale — the split is yours to define.",
      chips: [
        "AI transformation", "Cloud migration", "Data platforms", "ERP modernization",
        "Digital banking", "CX redesign", "Compliance programs", "MVP-to-scale builds",
        "Analytics uplift", "Automation at scale", "Legacy re-platforming", "Change management",
      ],
      stats: [
        { value: "90+", label: "Active partners" },
        { value: "31", label: "Countries covered" },
        { value: "18%", label: "Avg. partner margin" },
      ],
    },

    modelsTitle: "Co-delivery models",
    models: [
      {
        name: "Subcontract Delivery",
        price: "Per SOW",
        period: "fixed scope",
        description: "You own the client and the SOW; we deliver an assigned scope behind your engagement letter.",
        features: ["Client-of-record stays yours", "Fixed or T&M subcontract", "White-label option", "Weekly reporting"],
        popular: false,
        cta: { label: "Scope a subcontract", href: "/contact" },
      },
      {
        name: "Joint Co-Delivery",
        price: "Margin share",
        period: "per milestone",
        description: "Both firms sign one SOW, co-govern delivery and share margin — the flagship model for enterprise pursuits.",
        features: ["Joint SOW & governance", "Shared delivery lead", "48-hour bench access", "18% avg. partner margin"],
        popular: true,
        cta: { label: "Propose a joint SOW", href: "/contact" },
      },
      {
        name: "Strategic Alliance",
        price: "Multi-year",
        period: "partnership",
        description: "Portfolio-level alliance: joint practice building, co-invested solutions and executive sponsorship.",
        features: ["Multi-year framework", "Joint practice development", "Co-invested solutions", "Executive sponsor & QBRs"],
        popular: false,
        cta: { label: "Talk to alliances", href: "mailto:partners@stioos.com" },
      },
    ],

    outcomes: [
      { value: "48h", label: "Specialist bench SLA", progress: 88 },
      { value: "18%", label: "Avg. partner margin", progress: 58 },
      { value: "96%", label: "Joint SOW renewal rate", progress: 96 },
      { value: "2.1×", label: "Avg. partner deal-size growth", progress: 65 },
    ],

    testimonials: [
      {
        quote: "We sold a transformation program twice our delivery capacity and still delivered it early. The joint SOW meant everyone knew their lane from day one.",
        name: "Isabelle Laurent", role: "Managing Partner, advisory firm", initials: "IL", rating: 5,
      },
      {
        quote: "The 48-hour bench is real. We requested an LLM engineer on a Tuesday; he was in our client's standup on Thursday morning with the brief already read.",
        name: "Rohan Mehta", role: "Founder, product studio", initials: "RM", rating: 5,
      },
      {
        quote: "Co-governance sounded like overhead until we tried it. One dashboard, one triage call — the client honestly couldn't tell where one firm ended and the other began.",
        name: "Clara Johansson", role: "Engagement Director, consultancy", initials: "CJ", rating: 4,
      },
    ],

    caseStudy: {
      industry: "Banking & Insurance",
      title: "Two firms, one SOW, a core-systems modernization",
      challenge: "An advisory-led consultancy won a core-systems modernization but lacked thirty engineers and the compliance specialists to execute it.",
      solution: "A joint SOW split strategy and change management from build and migration; the bench filled compliance and data specialists on 48-hour windows.",
      results: [
        { value: "9 mo", label: "Delivered 5 weeks early" },
        { value: "31", label: "Specialists deployed" },
        { value: "$2.4M", label: "Partner margin pool" },
      ],
    },

    comparisonTitle: "Co-delivery with STIOOS vs. going it alone",
    comparison: [
      { traditional: "Decline scopes beyond your headcount", withUs: "Take enterprise scopes with bench-backed confidence" },
      { traditional: "Recruit for 3 months to staff one deal", withUs: "Specialists in-seat within 48 hours" },
      { traditional: "Subcontractors onside, off-brand", withUs: "One team under shared governance" },
      { traditional: "Margin leaks in informal arrangements", withUs: "Margin defined in the SOW, settled per milestone" },
      { traditional: "Partners who quietly court your client", withUs: "Client-of-record protection in the framework" },
      { traditional: "Coordinate delivery across ten tools", withUs: "One shared dashboard and triage rhythm" },
    ],

    industries: [
      "Banking & Insurance", "SaaS & Tech", "Healthcare", "FinTech", "Public Sector",
      "Manufacturing", "Retail & E-commerce", "Energy & Utilities", "Telecom", "Professional Services",
    ],

    regions: [
      { region: "Europe", cities: "London · Frankfurt · Zurich", note: "Deepest co-delivery base" },
      { region: "North America", cities: "New York · Boston · Toronto", note: "Enterprise pursuits" },
      { region: "Asia Pacific", cities: "Singapore · Tokyo · Mumbai", note: "Fastest joint pipeline" },
      { region: "Middle East", cities: "Dubai · Riyadh · Doha", note: "Program-scale demand" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "Client-of-record protection", description: "Co-delivery never becomes a channel around you — it's in the framework agreement." },
      { icon: "Clock", title: "48-hour bench SLA", description: "Requested specialists are briefed and in-seat within two business days." },
      { icon: "FileText", title: "Margin settled per milestone", description: "Partner margin calculates and pays on the same cadence as delivery approval." },
      { icon: "Scale", title: "One SOW, one truth", description: "Joint governance templates mean scope, quality and escalation are never ambiguous." },
    ],

    experts: [
      { name: "Antoine Dubois", role: "Head of Services Alliances", initials: "AD", specialty: "Alliance strategy", stat: "90+ partners signed" },
      { name: "Farah Siddiqui", role: "Joint Delivery Director", initials: "FS", specialty: "Co-delivery ops", stat: "140+ joint SOWs led" },
      { name: "Henrik Olsen", role: "Bench Operations Lead", initials: "HO", specialty: "Specialist staffing", stat: "2,000+ bench profiles managed" },
    ],

    resources: [
      { type: "Framework", title: "The joint SOW field guide", description: "How partners split scope, governance and margin without friction.", readTime: "11 min read" },
      { type: "Playbook", title: "Winning enterprise pursuits together", description: "Joint pitch anatomy from three co-delivered wins.", readTime: "9 min read" },
      { type: "Template", title: "Co-delivery governance pack", description: "Steering agendas, triage formats and escalation trees, ready to run.", readTime: "6 min read" },
    ],

    faqs: [
      { q: "Who owns the client relationship?", a: "You do, if you brought the deal — client-of-record protection is contractual. Joint pursuits define ownership in the SOW before signature." },
      { q: "How fast can specialists join an engagement?", a: "The bench SLA is 48 hours from request to in-seat, with the brief pre-read. Urgent same-week requests are prioritized for joint engagements." },
      { q: "How is margin structured and paid?", a: "Partner margin is a defined share of delivery value written into the joint SOW, settled automatically per approved milestone." },
      { q: "What does joint governance actually involve?", a: "One delivery lead, one shared dashboard, weekly triage and monthly steering — templates are provided so the rhythm starts on day one." },
      { q: "Can we white-label instead of co-branding?", a: "Yes — Subcontract Delivery runs entirely behind your engagement letter. Co-branding is a choice, not a requirement." },
      { q: "What size engagements fit the model?", a: "Anything from a $50K specialist insertion to multi-year programs. Most joint SOWs land between $250K and $3M in delivery value." },
    ],

    ctaBand: {
      kicker: "Partner slots open",
      title: "Sell the outcome. Co-deliver the build.",
      primary: {
        kicker: "Become a services partner",
        title: "Bring your next pursuit",
        text: "Sign the framework, bring a live opportunity, and see joint delivery in action.",
        cta: { label: "Apply now", href: "/contact" },
      },
      secondary: {
        kicker: "Need solo capacity?",
        title: "Staff roles directly",
        text: "For straightforward hiring, place roles through Talent Solutions instead.",
        cta: { label: "See Talent Solutions", href: "/talent-solutions#staffing-solutions" },
      },
    },

    contact: {
      title: "Talk to the services alliances team",
      note: "Partnership frameworks signed within two weeks — pursuits supported from week one.",
      channels: [
        { icon: "Phone", label: "Call alliances", value: "Mon–Fri, 9am–7pm", href: "/contact" },
        { icon: "Mail", label: "Email partnerships", value: "partners@stioos.com", href: "mailto:partners@stioos.com" },
        { icon: "CalendarDays", label: "Book an alliance intro", value: "30-min intro call", href: "/contact" },
      ],
    },
  },

  {
    slug: "technology-partner",
    group: "worksonn",
    accent: "violet",
    nav: "Technology Partner",

    eyebrow: "Worksonn Network · Integration",
    title: "Technology Partner —",
    highlight: "integrate, build and co-sell",
    subtitle:
      "ISVs, platforms and tooling vendors integrate with the STIOOS marketplace, co-sell into 2,000+ employers and reach buyers through marketplace listings, technical alliances and joint programs.",
    primaryCta: { label: "Apply as technology partner", href: "/contact" },
    secondaryCta: { label: "See marketplace listings", href: "/worksonn/technology-partner#marketplace" },
    heroStats: [
      { value: "70+", label: "Technology partners" },
      { value: "2,000+", label: "Employers to co-sell into" },
      { value: "3×", label: "Avg. pipeline lift" },
    ],

    trustBadges: [
      "Certified integrations",
      "Marketplace listings",
      "Co-sell program",
      "Technical alliance desk",
      "Joint reference architecture",
      "Revenue share on referrals",
    ],

    kpis: [
      { icon: "Puzzle", value: "70+", label: "Technology partners", detail: "ISVs, platforms and tooling vendors integrated across the STIOOS stack." },
      { icon: "TrendingUp", value: "3×", label: "Avg. pipeline lift", detail: "Increase in qualified pipeline partners attribute to the co-sell program." },
      { icon: "Network", value: "2,000+", label: "Employers in reach", detail: "Every co-sell motion plugs into the network's active buyer base." },
      { icon: "Layers", value: "60+", label: "Certified integrations", detail: "Live integrations between partner tooling and the STIOOS platform." },
    ],

    audiences: [
      {
        icon: "Puzzle",
        kicker: "ISVs & Platforms",
        title: "Meet buyers where they already are",
        description: "List your product in the marketplace, integrate with the platform and let 2,000+ employers discover, buy and deploy your tooling.",
        bullets: [
          "Marketplace listing & reviews",
          "Certified integration program",
          "Bundled offers with services",
          "Co-sell with account teams",
        ],
        cta: { label: "List your product", href: "/contact" },
      },
      {
        icon: "Wrench",
        kicker: "Tooling Vendors",
        title: "Build on the network's rails",
        description: "APIs, webhooks and sandboxes to integrate deeply — from assessment data to delivery telemetry — with an alliance desk that answers in hours.",
        bullets: [
          "Full API & webhook suite",
          "Sandbox + certification track",
          "Joint reference architectures",
          "Technical alliance desk",
        ],
        cta: { label: "Get API access", href: "/worksonn/technology-partner#marketplace" },
      },
    ],

    valueProps: [
      { icon: "Network", title: "Co-sell to 2,000+ employers", description: "Account teams position your product inside active deals — pipeline arrives attached to real budgets, not cold lists." },
      { icon: "Layers", title: "Marketplace listings that convert", description: "A listing with reviews, pricing and service bundles turns the network's traffic into trials and paid deployments." },
      { icon: "Puzzle", title: "Certified integrations", description: "The certification track puts your logo on our reference stack and your integration in every relevant proposal." },
      { icon: "TrendingUp", title: "Revenue share on referrals", description: "Every deal that originates from the network pays a transparent referral share — tracked in your partner ledger." },
      { icon: "Wrench", title: "An alliance desk that ships", description: "Named technical alliance managers, sandbox support and joint architecture sessions — not a logo wall and a webinar." },
      { icon: "BadgeCheck", title: "Joint reference architectures", description: "Publish validated architectures with us and become the default answer when clients ask 'what should we use?'" },
    ],

    processTitle: "From application to co-sell in 5 steps",
    process: [
      { title: "Apply & technical review", duration: "Week 1", description: "We assess product fit, integration surface and overlap with the network's service lines." },
      { title: "Integration & certification", duration: "Weeks 2–6", description: "Build against the API suite with sandbox support, then pass the certification review." },
      { title: "Marketplace launch", duration: "Weeks 6–8", description: "Listing goes live with pricing, bundles and reviews — promoted across relevant category pages." },
      { title: "Co-sell enablement", duration: "Weeks 8–10", description: "Account teams, pre-sales and delivery get trained on your product's pitch, pricing and proof points." },
      { title: "Co-sell & iterate", duration: "Ongoing", description: "Joint pipeline reviews, referral revenue tracking and quarterly roadmap alignment with product teams." },
    ],

    spotlight: [
      {
        icon: "Layers",
        title: "The marketplace works for you",
        description: "Category placement, review syndication and bundled service offers — a listing that behaves like a channel, not a directory entry.",
        bullets: ["Category placement", "Review syndication", "Service-bundled offers"],
        visual: "dashboard",
      },
      {
        icon: "Network",
        title: "Co-sell inside live deals",
        description: "Account teams introduce your product where it solves the client's problem — with pre-sales engineers handling the technical validation.",
        bullets: ["Account team introductions", "Pre-sales validation", "Deal registration & protection"],
        visual: "network",
      },
      {
        icon: "BadgeCheck",
        title: "Certification that opens proposals",
        description: "Certified partners appear in reference architectures and RFP response libraries — specified by name in the deals that matter.",
        bullets: ["Reference architecture slot", "RFP response library", "Certified-partner badge"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What the technology alliance includes",
    deliverables: [
      "Marketplace listing with reviews & bundles",
      "Full API, webhook & sandbox access",
      "Certified integration track & badge",
      "Co-sell enablement for account teams",
      "Deal registration & referral revenue share",
      "Named technical alliance manager",
      "Joint reference architecture publication",
      "Quarterly pipeline & roadmap reviews",
    ],

    modulesTitle: "Alliance tracks",
    modules: [
      { icon: "Puzzle", tag: "Integration", title: "Platform Integrations", description: "Two-way integrations between your product and the STIOOS platform." },
      { icon: "BrainCircuit", tag: "AI", title: "AI Tooling Alliances", description: "Model providers, vector databases and agent frameworks powering network solutions." },
      { icon: "Cloud", tag: "Cloud", title: "Cloud & Infrastructure", description: "Hyperscaler and infra alliances with joint deployment patterns." },
      { icon: "Database", tag: "Data", title: "Data & Analytics Stack", description: "Warehouses, pipelines and BI tools certified for network delivery." },
      { icon: "ShieldCheck", tag: "Security", title: "Security & Identity", description: "SSO, compliance and security tooling integrated across delivery." },
      { icon: "Bot", tag: "DevTools", title: "Developer Tooling", description: "CI/CD, testing and observability vendors embedded in delivery workflows." },
    ],

    tech: {
      title: "Built to integrate in weeks, not quarters",
      description: "A complete API surface, sandbox environment and certification pipeline — plus engineers who review your PRs, not just your logo.",
      points: [
        { icon: "Code", title: "Open API & webhooks", description: "REST and event-driven endpoints across matching, delivery and payment objects." },
        { icon: "Settings", title: "Sandbox environment", description: "Full-fidelity sandbox with seeded data for realistic integration testing." },
        { icon: "BadgeCheck", title: "Certification pipeline", description: "Automated conformance checks plus a human architecture review for the badge." },
        { icon: "MessageSquare", title: "Alliance desk SLA", description: "Named alliance engineer with a 4-hour response SLA during integration sprints." },
      ],
      stats: [
        { value: "60+", label: "Certified integrations" },
        { value: "4h", label: "Alliance desk response" },
      ],
    },

    coverage: {
      title: "Integration surfaces partners build on",
      note: "From candidate-data syncs to delivery telemetry — partners integrate wherever it creates joint value.",
      chips: [
        "Assessments & skills data", "ATS & HRIS sync", "Payments & escrow", "Delivery telemetry",
        "Marketplace checkout", "Identity & SSO", "AI model providers", "Vector databases",
        "Agent frameworks", "CI/CD & DevOps", "Observability", "Compliance tooling",
      ],
      stats: [
        { value: "70+", label: "Tech partners" },
        { value: "60+", label: "Live integrations" },
        { value: "3×", label: "Avg. pipeline lift" },
      ],
    },

    modelsTitle: "Alliance models",
    models: [
      {
        name: "Marketplace Vendor",
        price: "15%",
        period: "marketplace fee",
        description: "List and sell through the marketplace — we handle checkout, billing and first-line support.",
        features: ["Marketplace listing", "Review & rating system", "Bundled service offers", "Monthly payout cycle"],
        popular: false,
        cta: { label: "List your product", href: "/contact" },
      },
      {
        name: "Certified Alliance",
        price: "Revenue share",
        period: "on referral",
        description: "Certify your integration and co-sell with account teams — the tier behind most partners' pipeline lift.",
        features: ["Certified integration badge", "Co-sell with account teams", "Deal registration", "Named alliance manager"],
        popular: true,
        cta: { label: "Apply to certify", href: "/contact" },
      },
      {
        name: "Strategic Platform",
        price: "Custom",
        period: "joint business plan",
        description: "Deep platform integration, joint solutions and shared roadmaps for vendors strategic to the network.",
        features: ["Joint solution development", "Shared roadmap planning", "Co-marketing fund", "Executive sponsorship"],
        popular: false,
        cta: { label: "Talk to alliances", href: "mailto:partners@stioos.com" },
      },
    ],

    outcomes: [
      { value: "3×", label: "Avg. pipeline lift", progress: 74 },
      { value: "60+", label: "Certified integrations", progress: 70 },
      { value: "$4.2M", label: "Top partner co-sell revenue", progress: 84 },
      { value: "45 days", label: "Median listing-to-first-deal", progress: 47 },
    ],

    testimonials: [
      {
        quote: "Our marketplace listing outperforms our own website for enterprise trials. Bundling with STIOOS services removed the 'who deploys this?' objection entirely.",
        name: "Omar Haddad", role: "VP Partnerships, ISV", initials: "OH", rating: 5,
      },
      {
        quote: "Deal registration is honored to the letter — two co-sold deals last quarter came with warm intros and pre-sales help we could never have afforded alone.",
        name: "Elena Vasquez", role: "CEO, data tooling vendor", initials: "EV", rating: 5,
      },
      {
        quote: "The alliance desk reviewed our integration PRs within hours. Certification took five weeks and the badge shows up in RFPs constantly now.",
        name: "Tom Whitfield", role: "Head of Product, devtools company", initials: "TW", rating: 4,
      },
    ],

    caseStudy: {
      industry: "SaaS & Tech",
      title: "Observability vendor finds its channel",
      challenge: "A series-B observability vendor had strong product-market fit but no channel — enterprise sales were founder-led and slow.",
      solution: "They certified their integration, launched a marketplace listing bundled with delivery services and joined the co-sell program with trained account teams.",
      results: [
        { value: "38", label: "Co-sold deals in year 1" },
        { value: "3.4×", label: "Enterprise pipeline" },
        { value: "$1.8M", label: "Partner-sourced revenue" },
      ],
    },

    comparisonTitle: "STIOOS alliance vs. traditional reseller channels",
    comparison: [
      { traditional: "Resellers demand 30%+ for cold lists", withUs: "Co-sell into 2,000+ active employer relationships" },
      { traditional: "Your product sits in a partner directory", withUs: "Marketplace listing with reviews, bundles and checkout" },
      { traditional: "Integrations stall in partner limbo", withUs: "Sandbox, open APIs and a 4-hour alliance desk SLA" },
      { traditional: "Deal registration ignored in practice", withUs: "Registration honored, tracked in your partner ledger" },
      { traditional: "Logo-wall partnerships with no engineers", withUs: "Named alliance engineers who review your PRs" },
      { traditional: "One-way marketing webinars", withUs: "Joint reference architectures and RFP placements" },
    ],

    industries: [
      "SaaS & Tech", "FinTech", "Healthcare", "Retail & E-commerce", "Manufacturing",
      "Logistics", "Media & Entertainment", "Telecom", "Public Sector", "Energy & Utilities",
    ],

    regions: [
      { region: "North America", cities: "San Francisco · New York · Toronto", note: "Largest ISV base" },
      { region: "Europe", cities: "London · Berlin · Tel Aviv", note: "Strong tooling vendors" },
      { region: "Asia Pacific", cities: "Singapore · Bengaluru · Tokyo", note: "Fastest-growing alliances" },
      { region: "Global remote", cities: "Integrate from anywhere", note: "Certification is fully remote" },
    ],

    guarantees: [
      { icon: "ShieldCheck", title: "Deal registration honored", description: "Registered opportunities are protected in writing — no channel poaching." },
      { icon: "MessageSquare", title: "4-hour alliance desk SLA", description: "Integration support answered by an engineer within four business hours." },
      { icon: "Wallet", title: "Transparent revenue share", description: "Referral and marketplace economics visible in a live partner ledger." },
      { icon: "RefreshCw", title: "Quarterly roadmap alignment", description: "Your product team meets ours every quarter — integrations never drift." },
    ],

    experts: [
      { name: "Bianca Moretti", role: "Head of Technology Alliances", initials: "BM", specialty: "ISV partnerships", stat: "70+ alliances launched" },
      { name: "Samuel Adeyemi", role: "Principal Integration Architect", initials: "SA", specialty: "Certification", stat: "60+ integrations certified" },
      { name: "Lin Xiu", role: "Co-Sell Program Lead", initials: "LX", specialty: "Joint pipeline", stat: "$31M co-sell pipeline" },
    ],

    resources: [
      { type: "Docs", title: "Integration quick-start", description: "Auth, core objects and webhooks — your first data sync running in an afternoon.", readTime: "12 min read" },
      { type: "Guide", title: "Winning marketplace placement", description: "How listings get ranked, reviewed and bundled into service offers.", readTime: "7 min read" },
      { type: "Webinar", title: "Co-sell teardown: registration to renewal", description: "A full deal walkthrough with the account team and a partner CTO.", readTime: "35 min watch" },
    ],

    faqs: [
      { q: "What are the technical requirements to integrate?", a: "A public API or webhook capability is the baseline. Our API suite covers matching, delivery and payment objects — most partners certify within four to six weeks." },
      { q: "How does the marketplace fee work?", a: "Marketplace Vendor listings carry a 15% fee on sales through the platform. Certified Alliance partners switch to referral revenue share — often more favorable at enterprise deal sizes." },
      { q: "How is deal registration protected?", a: "Register an opportunity in the partner portal and it's locked to you for the pursuit window. Protection is contractual, with an escalation path if conflicts ever arise." },
      { q: "Who supports joint customers?", a: "First-line support follows the sale: marketplace sales are first-supported by us, co-sold enterprise deals run shared support matrices defined in the alliance plan." },
      { q: "Can we co-market as well as co-sell?", a: "Yes — joint webinars, co-authored reference architectures and event slots are included, with a co-marketing fund at the Strategic Platform tier." },
      { q: "How long does certification take?", a: "Typically four to six weeks: sandbox build, automated conformance checks and a human architecture review before the badge and RFP library placement." },
    ],

    ctaBand: {
      kicker: "Alliances open",
      title: "Put your product inside every deal",
      primary: {
        kicker: "Become a technology partner",
        title: "Start the technical review",
        text: "Apply with your product docs — technical review feedback within one week.",
        cta: { label: "Apply now", href: "/contact" },
      },
      secondary: {
        kicker: "Building instead of partnering?",
        title: "Join as talent or freelancer",
        text: "The same network that lists your product also hires the people who build on it.",
        cta: { label: "See candidate paths", href: "/worksonn/candidates" },
      },
    },

    contact: {
      title: "Talk to the technology alliances team",
      note: "Technical reviews start weekly — apply any time and get a slot in the next cohort.",
      channels: [
        { icon: "Mail", label: "Email technology alliances", value: "partners@stioos.com", href: "mailto:partners@stioos.com" },
        { icon: "MessageSquare", label: "Chat with the alliance desk", value: "4-hour response SLA", href: "/contact" },
        { icon: "CalendarDays", label: "Book an alliance intro", value: "30-min technical intro", href: "/contact" },
      ],
    },
  },

  {
    slug: "ai-partner",
    group: "worksonn",
    accent: "violet",
    nav: "AI Partner",

    eyebrow: "Worksonn Network · AI Solutions",
    title: "AI Partner —",
    highlight: "bring AI solutions to market",
    subtitle:
      "AI labs and product companies partner with STIOOS to deploy AI, LLM and agent solutions across the network — joint go-to-market, a qualified POC pipeline and revenue share on every deployment.",
    primaryCta: { label: "Apply as AI partner", href: "/contact" },
    secondaryCta: { label: "See the POC pipeline", href: "/worksonn/ai-partner#poc" },
    heroStats: [
      { value: "45+", label: "AI partners" },
      { value: "130+", label: "POCs run / yr" },
      { value: "42%", label: "POC-to-production" },
    ],

    trustBadges: [
      "Joint go-to-market",
      "Qualified POC pipeline",
      "Revenue share on deployments",
      "Delivery & integration bench",
      "Responsible AI review",
      "Model-agnostic support",
    ],

    kpis: [
      { icon: "BrainCircuit", value: "45+", label: "AI partners in network", detail: "AI labs, model providers and product companies deploying through STIOOS." },
      { icon: "Target", value: "130+", label: "POCs per year", detail: "Qualified proofs-of-concept matched from employer demand, not cold outreach." },
      { icon: "TrendingUp", value: "42%", label: "POC-to-production rate", detail: "POCs that convert into deployed, revenue-generating solutions." },
      { icon: "Wallet", value: "24%", label: "Avg. revenue share", detail: "Partner share on deployment value, paid per milestone." },
    ],

    audiences: [
      {
        icon: "Brain",
        kicker: "AI Labs & Research Teams",
        title: "From paper to production",
        description: "Your models meet real enterprise problems through a qualified POC pipeline — with delivery squads handling integration, evaluation and scale.",
        bullets: [
          "Qualified POCs from employer demand",
          "Delivery squads for integration & evals",
          "Responsible AI review included",
          "Revenue share per deployment",
        ],
        cta: { label: "Apply as AI partner", href: "/contact" },
      },
      {
        icon: "Rocket",
        kicker: "AI Product Companies",
        title: "Distribution without the sales org",
        description: "Co-sell your AI product into 2,000+ employers with joint go-to-market, co-branded launches and a partner margin that scales with usage.",
        bullets: [
          "Joint GTM with account teams",
          "Co-branded launches & events",
          "Usage-based partner economics",
          "Marketplace & bundle placement",
        ],
        cta: { label: "Plan a joint launch", href: "mailto:partners@stioos.com" },
      },
    ],

    valueProps: [
      { icon: "Target", title: "A qualified POC pipeline", description: "Employer demand is scoped, qualified and matched to your strengths — you evaluate real problems, not cold leads." },
      { icon: "Handshake", title: "Joint go-to-market", description: "Shared positioning, co-branded launches and account-team enablement — your solution enters rooms we're already in." },
      { icon: "TrendingUp", title: "Revenue share on every deployment", description: "Earn on deployed value, not licenses gathering dust — economics track real production usage." },
      { icon: "Wrench", title: "A delivery bench that speaks AI", description: "Integration engineers, eval specialists and MLOps squads turn POCs into production systems your lab never has to staff." },
      { icon: "ShieldCheck", title: "Responsible AI review built in", description: "Every deployment passes bias, safety and compliance review — enterprise buyers get the assurance they need to sign." },
      { icon: "Puzzle", title: "Model-agnostic by design", description: "LLM, agentic, vision or classical ML — the pipeline routes each problem to the right partner's strength." },
    ],

    processTitle: "From partnership to production in 5 steps",
    process: [
      { title: "Partner & capability review", duration: "Week 1–2", description: "Map your models, verticals and capacity — we define which qualified demand routes to you." },
      { title: "Enablement & evaluation harness", duration: "Weeks 2–4", description: "Account teams and delivery squads get trained; eval harnesses and safety review criteria are agreed." },
      { title: "Qualified POC matching", duration: "Ongoing", description: "Employer problems arrive scoped with data access, success criteria and budget indicated." },
      { title: "POC to production", duration: "6–10 weeks", description: "Co-delivered POCs with clear gates — converting deployments trigger commercial onboarding." },
      { title: "Scale & share revenue", duration: "Ongoing", description: "Production deployments, usage tracking and milestone-based revenue share — plus joint case studies." },
    ],

    spotlight: [
      {
        icon: "Target",
        title: "Demand before you build",
        description: "The POC pipeline surfaces real employer problems — scoped with success criteria and budget — so R&D effort lands where it pays.",
        bullets: ["Scoped employer demand", "Budget-indicated POCs", "Vertical-matched routing"],
        visual: "radial",
      },
      {
        icon: "Bot",
        title: "Deploy with an AI-native bench",
        description: "Integration engineers, eval specialists and MLOps squads co-deliver — your lab stays in research, we handle the enterprise plumbing.",
        bullets: ["Integration & MLOps squads", "Evaluation harnesses", "Production SRE support"],
        visual: "dashboard",
      },
      {
        icon: "ShieldCheck",
        title: "Responsible AI, pre-cleared",
        description: "Bias, safety and compliance reviews run inside the delivery process — enterprise procurement gets assurances it can act on.",
        bullets: ["Bias & safety review", "Compliance documentation", "Enterprise-ready assurances"],
        visual: "badge",
      },
    ],

    deliverablesTitle: "What the AI alliance includes",
    deliverables: [
      "Qualified POC pipeline with scoped demand",
      "Joint go-to-market plan & enablement",
      "AI delivery bench for integration & MLOps",
      "Responsible AI review & documentation",
      "Marketplace & bundle placement for products",
      "Revenue share with milestone settlement",
      "Co-branded launches, events & case studies",
      "Named AI alliance manager & QBRs",
    ],

    modulesTitle: "AI partnership tracks",
    modules: [
      { icon: "Bot", tag: "Agents", title: "Agentic Solutions", description: "Multi-agent workflows and autonomous process automation deployed across employer operations." },
      { icon: "MessageSquare", tag: "LLM", title: "LLM & Copilot Products", description: "Enterprise copilots and LLM applications co-sold and co-delivered." },
      { icon: "Database", tag: "RAG", title: "RAG & Knowledge Systems", description: "Retrieval and knowledge platforms integrated with enterprise data estates." },
      { icon: "Brain", tag: "Models", title: "Model & Research Alliances", description: "Foundation model access and research collaborations feeding delivery workloads." },
      { icon: "Search", tag: "Vision", title: "Computer Vision", description: "Inspection, OCR and visual analytics solutions for industrial clients." },
      { icon: "Gauge", tag: "MLOps", title: "MLOps & Evals", description: "Evaluation harnesses, monitoring and lifecycle tooling for production AI." },
    ],

    tech: {
      title: "The platform AI partners build on",
      description: "Deployment infrastructure, evaluation tooling and usage metering — the production layer between your models and enterprise buyers.",
      points: [
        { icon: "Cpu", title: "Deployment infrastructure", description: "Managed inference, scaling and security on cloud infrastructure you approve." },
        { icon: "Gauge", title: "Evaluation harnesses", description: "Task-specific eval suites agreed per POC — success is measured, not vibes." },
        { icon: "BarChart3", title: "Usage metering & settlement", description: "Production usage meters feed revenue-share settlement automatically." },
        { icon: "ShieldCheck", title: "Safety & compliance review", description: "Bias, safety and regulatory checks embedded in the deployment pipeline." },
      ],
      stats: [
        { value: "42%", label: "POC-to-production rate" },
        { value: "24%", label: "Avg. revenue share" },
      ],
    },

    coverage: {
      title: "AI demand flowing through the network",
      note: "Employer demand is aggregated and scoped by our solution architects before it ever reaches a partner.",
      chips: [
        "Customer service agents", "Document intelligence", "Sales copilots", "Code assistants",
        "Knowledge search", "Fraud detection", "Forecasting", "Content generation",
        "Speech & voice", "Computer vision", "Process automation", "Decision intelligence",
      ],
      stats: [
        { value: "130+", label: "POCs per year" },
        { value: "45+", label: "AI partners" },
        { value: "18", label: "Countries deploying" },
      ],
    },

    modelsTitle: "AI alliance models",
    models: [
      {
        name: "POC Partner",
        price: "Per POC",
        period: "fixed fee",
        description: "Run qualified proofs-of-concept with delivery support — prove value before committing to a GTM plan.",
        features: ["Scoped POC pipeline", "Eval harness support", "Delivery bench access", "Success-gated conversion"],
        popular: false,
        cta: { label: "Start with a POC", href: "/contact" },
      },
      {
        name: "Go-To-Market Partner",
        price: "24%",
        period: "revenue share",
        description: "Full joint GTM with account teams, marketplace placement and revenue share on every deployment.",
        features: ["Joint GTM & enablement", "Co-branded launches", "Revenue share per milestone", "Named alliance manager"],
        popular: true,
        cta: { label: "Apply for GTM", href: "/contact" },
      },
      {
        name: "Strategic AI Alliance",
        price: "Custom",
        period: "joint business plan",
        description: "Multi-year alliance with co-invested solutions, exclusive tracks and executive sponsorship.",
        features: ["Co-invested solutions", "Exclusive vertical tracks", "Joint research agenda", "Executive sponsor"],
        popular: false,
        cta: { label: "Talk to alliances", href: "mailto:partners@stioos.com" },
      },
    ],

    outcomes: [
      { value: "42%", label: "POC-to-production rate", progress: 72 },
      { value: "130+", label: "POCs per year", progress: 68 },
      { value: "9 wks", label: "Median POC duration", progress: 55 },
      { value: "$2.9M", label: "Top partner annual share", progress: 90 },
    ],

    testimonials: [
      {
        quote: "We stopped chasing pilots. Qualified POCs arrive scoped with success criteria and budget — we converted four of six into production deployments last year.",
        name: "Nadia Rahman", role: "Co-founder, AI lab", initials: "NR", rating: 5,
      },
      {
        quote: "The delivery bench changed our economics. We stay in research; their engineers handle integration, evals and the MLOps our customers demand.",
        name: "Jonas Weber", role: "CTO, AI product company", initials: "JW", rating: 5,
      },
      {
        quote: "Responsible AI review sounds like friction until procurement makes it the deal-breaker. Pre-cleared deployments have shortened our sales cycles by months.",
        name: "Ayesha Khan", role: "VP Enterprise, LLM platform", initials: "AK", rating: 4,
      },
    ],

    caseStudy: {
      industry: "FinTech",
      title: "Agent platform turns one POC into an enterprise rollout",
      challenge: "An agentic document-platform startup had strong tech but no enterprise distribution and no bench for customer integrations.",
      solution: "A scoped POC automated claims triage for an insurer; the AI bench handled integration and evals, converting it into a multi-team rollout with usage-based share.",
      results: [
        { value: "1 → 9", label: "Teams rolled out" },
        { value: "64%", label: "Claims triage automation" },
        { value: "$740K", label: "Year-1 partner share" },
      ],
    },

    comparisonTitle: "STIOOS AI alliance vs. building GTM alone",
    comparison: [
      { traditional: "Cold outbound for every pilot", withUs: "Qualified POCs from scoped employer demand" },
      { traditional: "Hire an enterprise sales org first", withUs: "Co-sell with trained account teams from day one" },
      { traditional: "Your lab does integration & MLOps too", withUs: "AI delivery bench handles the enterprise plumbing" },
      { traditional: "Procurement stalls on AI assurances", withUs: "Responsible AI review pre-cleared" },
      { traditional: "Per-seat licenses that stall at POC", withUs: "Revenue share tied to production usage" },
      { traditional: "Distribution limited to your network", withUs: "Reach across 2,000+ employers and 8 service lines" },
    ],

    industries: [
      "FinTech", "Banking & Insurance", "Healthcare", "Retail & E-commerce", "Logistics",
      "Manufacturing", "Telecom", "Public Sector", "Media & Entertainment", "Energy & Utilities",
    ],

    regions: [
      { region: "North America", cities: "San Francisco · New York · Toronto", note: "Deepest AI buyer demand" },
      { region: "Europe", cities: "London · Paris · Zurich", note: "Enterprise AI budgets" },
      { region: "Asia Pacific", cities: "Singapore · Tokyo · Bengaluru", note: "Fastest POC growth" },
      { region: "Middle East", cities: "Dubai · Riyadh", note: "National AI programs" },
    ],

    guarantees: [
      { icon: "Target", title: "Qualified POCs only", description: "Every routed opportunity has scoped success criteria and budget indication." },
      { icon: "ShieldCheck", title: "Responsible AI included", description: "Bias, safety and compliance review embedded — no separate audit overhead." },
      { icon: "Wallet", title: "Usage-based revenue share", description: "Economics track production usage, settled per milestone automatically." },
      { icon: "Handshake", title: "Model-agnostic routing", description: "Problems route to the right partner's strength — no forced platform loyalty." },
    ],

    experts: [
      { name: "Rafael Ortiz", role: "Head of AI Partnerships", initials: "RO", specialty: "AI alliances", stat: "45+ labs & products signed" },
      { name: "Anika Bose", role: "AI Solutions Architect", initials: "AB", specialty: "POC design", stat: "130+ POCs scoped" },
      { name: "Dmitri Volkov", role: "Responsible AI Lead", initials: "DV", specialty: "Safety & compliance", stat: "100% review coverage" },
    ],

    resources: [
      { type: "Framework", title: "The POC readiness checklist", description: "Data access, success criteria and eval design — what a convertible POC needs.", readTime: "8 min read" },
      { type: "Report", title: "POC-to-production benchmarks 2025", description: "Conversion rates and timeframes across 300+ network POCs.", readTime: "13 min read" },
      { type: "Guide", title: "Responsible AI for enterprise sales", description: "The review criteria enterprise procurement actually asks about.", readTime: "9 min read" },
    ],

    faqs: [
      { q: "What kind of AI organizations fit the program?", a: "AI labs with deployable models, product companies with shipped AI offerings, and applied research teams looking for enterprise grounding. The common thread is something that can reach production." },
      { q: "How are POCs qualified?", a: "Employer demand is scoped by our solution architects with data access, success criteria and budget indication before routing — partners see the brief, not a cold lead." },
      { q: "Who handles integration and deployment?", a: "The STIOOS AI bench — integration engineers, eval specialists and MLOps squads — co-delivers with your team. Your lab can stay as close to research as it wants." },
      { q: "How is the revenue share calculated?", a: "A defined share of deployment value, metered on production usage and settled per milestone. Rates vary by track — the network average is 24%." },
      { q: "What does responsible AI review cover?", a: "Bias evaluation, safety testing, documentation and compliance mapping against the buyer's regulatory context — embedded in the delivery pipeline, not bolted on." },
      { q: "Is the program exclusive to one vendor per category?", a: "Generally no — routing is problem-to-strength. Strategic AI Alliances can negotiate exclusive vertical tracks where volume justifies it." },
    ],

    ctaBand: {
      kicker: "AI partner cohort open",
      title: "Your models deserve real problems",
      primary: {
        kicker: "Become an AI partner",
        title: "Apply for capability review",
        text: "Share your models and research — capability reviews run every two weeks.",
        cta: { label: "Apply now", href: "/contact" },
      },
      secondary: {
        kicker: "Building your AI career instead?",
        title: "Join the talent network",
        text: "The same network deploys AI talent — see where your skills fit.",
        cta: { label: "See candidate paths", href: "/worksonn/candidates" },
      },
    },

    contact: {
      title: "Talk to the AI alliances team",
      note: "Capability reviews run every two weeks — applications are rolling.",
      channels: [
        { icon: "Mail", label: "Email AI alliances", value: "partners@stioos.com", href: "mailto:partners@stioos.com" },
        { icon: "MessageSquare", label: "Chat with the alliances desk", value: "Replies within 4 hrs", href: "/contact" },
        { icon: "CalendarDays", label: "Book a capability review", value: "45-min technical session", href: "/contact" },
      ],
    },
  },
];

export function getWorksonnPage(slug: string): PageSpec | undefined {
  return WORKSONN_PAGE_SPECS.find((p) => p.slug === slug);
}
