import type {
  ActivityLog,
  AppNotification,
  Inquiry,
  Industry,
  Insight,
  Resource,
  FaqItem,
  HomepageContent,
} from "@/types";

// ---------- Inquiries ----------
export const INQUIRIES: Inquiry[] = [
  { id: "inq-001", name: "Daniel Osei", email: "d.osei@vertexbuild.com", company: "Vertex Build Group", phone: "+1 555 01001", type: "service_request", serviceId: "srv-010", serviceName: "Custom AI Agent Development", requirements: "We need an agent that triages incoming RFQs from our construction sites and drafts responses for review.", budgetRange: "$15k–$30k", timeline: "1–3 months", status: "new", createdAt: "2025-11-28T08:24:00" },
  { id: "inq-002", name: "Hiroshi Tanaka", email: "h.tanaka@osakamfg.jp", company: "Osaka Manufacturing", phone: "+81 3 5555 0134", type: "service_request", serviceId: "srv-001", serviceName: "AI Workflow Automation Program", requirements: "Interested in automating procurement approvals across 3 plants. Need ROI assessment first.", budgetRange: "$30k–$50k", timeline: "3–6 months", status: "in_progress", createdAt: "2025-11-27T15:10:00" },
  { id: "inq-003", name: "Zara Ahmed", email: "zara@dubaifinance.ae", company: "Dubai Finance House", phone: "+971 4 555 0199", type: "consultation", requirements: "Board asked for an AI strategy review before budget season. Need a roadmap proposal.", budgetRange: "$10k–$15k", timeline: "1 month", status: "contacted", createdAt: "2025-11-26T11:47:00" },
  { id: "inq-004", name: "Lucia Moretti", email: "lucia@milanoretail.it", company: "Milano Retail Group", phone: "+39 02 5550 112", type: "service_request", serviceId: "srv-030", serviceName: "Executive BI & Dashboard Program", requirements: "Six country teams, six versions of the truth. Need unified sales + inventory dashboards.", budgetRange: "$20k–$35k", timeline: "2–4 months", status: "new", createdAt: "2025-11-26T09:03:00" },
  { id: "inq-005", name: "Tom Becker", email: "tom@becker-eng.de", company: "Becker Engineering", phone: "+49 30 5550 177", type: "service_request", serviceId: "srv-020", serviceName: "Custom Software Development", requirements: "Legacy project costing tool needs full rebuild. 40k LOC PHP app today.", budgetRange: "$50k+", timeline: "6–12 months", status: "contacted", createdAt: "2025-11-25T16:32:00" },
  { id: "inq-006", name: "Arjun Malhotra", email: "arjun@zenstartup.in", company: "Zen Startup Labs", phone: "+91 98200 55443", type: "consultation", requirements: "Pre-seed startup exploring AI agents for customer onboarding. Scoping call request.", budgetRange: "< $5k", timeline: "Immediate", status: "in_progress", createdAt: "2025-11-25T10:19:00" },
  { id: "inq-007", name: "Grace Mwangi", email: "grace@nairobifintech.ke", company: "Nairobi Fintech", phone: "+254 20 5550 143", type: "contact", requirements: "General inquiry about partnership program for East Africa region.", budgetRange: "N/A", timeline: "N/A", status: "closed", createdAt: "2025-11-21T13:44:00" },
  { id: "inq-008", name: "Raj Patel", email: "raj@gujarattools.in", company: "Gujarat Tools", phone: "+91 99250 77889", type: "service_request", serviceId: "srv-002", serviceName: "Intelligent Document Processing", requirements: "12,000 supplier invoices per month currently keyed manually. Need extraction + SAP integration.", budgetRange: "$15k–$30k", timeline: "3–6 months", status: "new", createdAt: "2025-11-28T07:58:00" },
  { id: "inq-009", name: "Marcus Chen", email: "m.chen@apexlogistics.cn", company: "Apex Logistics", phone: "+65 6555 0166", type: "service_request", serviceId: "srv-011", serviceName: "Customer Support AI Agent", requirements: "Peak season support volume tripling. Need multilingual deflection agent across web + WhatsApp.", budgetRange: "$10k–$15k", timeline: "1–3 months", status: "contacted", createdAt: "2025-11-24T14:27:00" },
  { id: "inq-010", name: "Ethan Kim", email: "ethan@seoulrobotics.kr", company: "Seoul Robotics", phone: "+82 2 5550 188", type: "consultation", requirements: "Evaluating build-vs-buy for internal agent platform. Need architecture consultation.", budgetRange: "$5k–$10k", timeline: "1 month", status: "closed", createdAt: "2025-11-18T09:15:00" },
  { id: "inq-011", name: "Sofia Ramirez", email: "sofia@mexicocityai.mx", company: "Mexico City AI", phone: "+52 55 5550 121", type: "service_request", serviceId: "srv-040", serviceName: "AI-Driven Growth Marketing", requirements: "PLG motion needs full-funnel attribution and creative testing at scale.", budgetRange: "$5k–$10k / month", timeline: "Ongoing", status: "in_progress", createdAt: "2025-11-23T11:36:00" },
  { id: "inq-012", name: "Liam O'Connor", email: "liam@dublinsoft.ie", company: "Dublin Software", phone: "+353 1 555 0145", type: "service_request", serviceId: "srv-070", serviceName: "Complete Brand Identity System", requirements: "Rebrand ahead of Series A. Full identity + messaging needed in 6 weeks.", budgetRange: "$10k–$15k", timeline: "1–3 months", status: "new", createdAt: "2025-11-27T18:52:00" },
];

// ---------- Notifications ----------
export const NOTIFICATIONS: AppNotification[] = [
  { id: "ntf-001", type: "service_request", title: "New service request", message: "Daniel Osei (Vertex Build Group) requested Custom AI Agent Development.", read: false, createdAt: "2025-11-28T08:24:00" },
  { id: "ntf-002", type: "service_request", title: "New service request", message: "Raj Patel (Gujarat Tools) requested Intelligent Document Processing.", read: false, createdAt: "2025-11-28T07:58:00" },
  { id: "ntf-003", type: "contact_inquiry", title: "New contact inquiry", message: "Liam O'Connor submitted a rebranding inquiry via the contact form.", read: false, createdAt: "2025-11-27T18:52:00" },
  { id: "ntf-004", type: "service_published", title: "Service published", message: "Rohan Gupta published 'Customer Support AI Agent' to the marketplace.", read: true, createdAt: "2025-11-27T15:31:00" },
  { id: "ntf-005", type: "admin_created", title: "Admin account created", message: "Priya Nair created an admin account for Neha Verma (Support Manager).", read: true, createdAt: "2025-11-26T10:12:00" },
  { id: "ntf-006", type: "content_updated", title: "Homepage updated", message: "Sana Kapoor updated the hero section and featured services on the homepage.", read: true, createdAt: "2025-11-26T09:44:00" },
  { id: "ntf-007", type: "system", title: "Weekly platform report", message: "Marketplace traffic up 18% week-over-week. 12 new inquiries, 3 requests pending triage.", read: true, createdAt: "2025-11-25T06:00:00" },
  { id: "ntf-008", type: "service_request", title: "Consultation request", message: "Zara Ahmed (Dubai Finance House) requested an AI strategy consultation.", read: true, createdAt: "2025-11-26T11:47:00" },
  { id: "ntf-009", type: "system", title: "Security notice", message: "New sign-in from a recognized device for aarav@stioos.com.", read: true, createdAt: "2025-11-24T08:03:00" },
  { id: "ntf-010", type: "content_updated", title: "Insight published", message: "Sana Kapoor published the insight 'The 2025 Agentic AI Adoption Playbook'.", read: true, createdAt: "2025-11-22T12:20:00" },
];

// ---------- Activity ----------
const acts: [string, string, string, string, string, string][] = [
  ["Aarav Mehta", "published", "Service Management", "Custom AI Agent Development", "Service moved from draft to published and featured on homepage.", "2025-11-28T09:12:00"],
  ["Rohan Gupta", "updated", "Service Management", "AI Workflow Automation Program", "Updated pricing, tags, and process steps.", "2025-11-28T08:40:00"],
  ["Priya Nair", "created", "Admin Management", "Neha Verma", "Created admin account with Support Manager role.", "2025-11-26T10:12:00"],
  ["Sana Kapoor", "updated", "Content Management", "Homepage hero", "Changed headline and CTA copy for Q4 campaign.", "2025-11-26T09:44:00"],
  ["Rohan Gupta", "archived", "Service Management", "Legacy Portal Modernization", "Archived after discovery pause requested by client.", "2025-11-25T16:20:00"],
  ["Neha Verma", "updated", "Inquiry Management", "inq-006", "Status changed from New to In Progress; scoping call booked.", "2025-11-25T11:05:00"],
  ["Aarav Mehta", "updated", "Roles & Permissions", "Marketplace Manager", "Granted publish permission on Featured Services module.", "2025-11-24T14:50:00"],
  ["Priya Nair", "created", "User Management", "usr-020", "Created user Zara Ahmed via admin panel.", "2025-08-29T10:31:00"],
  ["Sana Kapoor", "published", "Insights", "The 2025 Agentic AI Adoption Playbook", "Insight published to public site.", "2025-11-22T12:20:00"],
  ["Vikram Shah", "updated", "Category Management", "AI Automation & Agentic Solutions", "Rewrote category description and tagline.", "2025-11-21T09:18:00"],
  ["Neha Verma", "closed", "Inquiry Management", "inq-010", "Closed after consultation delivered; follow-up scheduled Q1.", "2025-11-20T15:40:00"],
  ["Rohan Gupta", "duplicated", "Service Management", "Sales Process Automation", "Created draft duplicate for enterprise-tier variant.", "2025-11-19T11:27:00"],
  ["Priya Nair", "updated", "Marketplace Settings", "Default sorting", "Default marketplace sort changed to Most Popular.", "2025-11-18T09:02:00"],
  ["Aarav Mehta", "deactivated", "Admin Management", "Vikram Shah", "Account deactivated during sabbatical.", "2025-11-12T08:47:00"],
  ["Sana Kapoor", "created", "Resources", "AI Readiness Checklist", "Published downloadable checklist resource.", "2025-11-11T13:33:00"],
  ["Rohan Gupta", "unpublished", "Service Management", "Marketing Operations Automation", "Temporarily unpublished pending pricing review.", "2025-11-10T16:55:00"],
];

export const ACTIVITY_LOGS: ActivityLog[] = acts.map(([actor, action, module, target, description, createdAt], i) => ({
  id: `act-${String(i + 1).padStart(3, "0")}`,
  actor, action, module, target, description, createdAt,
}));

// ---------- Industries ----------
export const INDUSTRIES: Industry[] = [
  { id: "ind-construction", name: "Construction", slug: "construction", icon: "HardHat", description: "Project controls, tender automation, site intelligence, and compliance for builders and infrastructure firms.", servicesCount: 14, status: "active" },
  { id: "ind-manufacturing", name: "Manufacturing", slug: "manufacturing", icon: "Factory", description: "Production analytics, quality automation, ERP integration, and supply chain intelligence.", servicesCount: 18, status: "active" },
  { id: "ind-technology", name: "Technology", slug: "technology", icon: "Cpu", description: "Engineering capacity, AI product development, and platform scaling for software companies.", servicesCount: 26, status: "active" },
  { id: "ind-financial", name: "Financial Services", slug: "financial-services", icon: "Landmark", description: "Document AI, compliance automation, risk analytics, and customer intelligence for financial institutions.", servicesCount: 16, status: "active" },
  { id: "ind-ecommerce", name: "E-Commerce", slug: "ecommerce", icon: "ShoppingCart", description: "Conversion optimization, support automation, demand forecasting, and growth marketing.", servicesCount: 21, status: "active" },
  { id: "ind-industrial", name: "Industrial", slug: "industrial", icon: "Cog", description: "Operations automation, predictive maintenance, and field service intelligence.", servicesCount: 12, status: "active" },
  { id: "ind-professional", name: "Professional Services", slug: "professional-services", icon: "Briefcase", description: "Knowledge automation, client portals, practice intelligence, and brand systems.", servicesCount: 19, status: "active" },
  { id: "ind-engineering", name: "Engineering", slug: "engineering", icon: "DraftingCompass", description: "Simulation tooling, project data platforms, and engineering workflow automation.", servicesCount: 10, status: "active" },
  { id: "ind-startups", name: "Startups", slug: "startups", icon: "Rocket", description: "Formation, fractional leadership, MVP engineering, and growth foundations.", servicesCount: 17, status: "active" },
  { id: "ind-enterprises", name: "Enterprises", slug: "enterprises", icon: "Building2", description: "Transformation programs, governed AI adoption, and enterprise integration at scale.", servicesCount: 23, status: "active" },
];

// ---------- Insights ----------
export const INSIGHTS: Insight[] = [
  {
    id: "ins-001", title: "The 2025 Agentic AI Adoption Playbook", slug: "agentic-ai-adoption-playbook",
    category: "AI Strategy", author: "Aarav Mehta", readTime: "9 min", publishedAt: "2025-11-22",
    accent: "from-blue-600 to-cyan-500", status: "published",
    excerpt: "How mid-market enterprises are moving from AI pilots to production agent fleets — and the governance model that makes it safe.",
    content: "Agentic AI has crossed the threshold from impressive demos to dependable operations. In this playbook we break down the three adoption phases we see across successful enterprises: assisted workflows, supervised agents, and governed agent fleets. Each phase has distinct requirements for data readiness, evaluation, and human oversight.\n\nThe organizations that succeed start with a narrow, measurable process — typically support triage or document processing — and expand only after establishing evaluation baselines. Governance is not a brake; it is the accelerator that gives executives confidence to fund expansion.",
  },
  {
    id: "ins-002", title: "Workflow Automation ROI: A Practical Measurement Model", slug: "workflow-automation-roi",
    category: "Automation", author: "Rohan Gupta", readTime: "7 min", publishedAt: "2025-11-08",
    accent: "from-emerald-600 to-teal-500", status: "published",
    excerpt: "The four metrics that matter when measuring automation programs — and how to baseline them before you build.",
    content: "Most automation programs fail at measurement, not technology. Before building, baseline four metrics: cycle time, touch count, error rate, and cost per transaction. Improvements in these four numbers translate directly to financial ROI and are defensible in board conversations.\n\nWe recommend a 2-week baseline sprint before any build work begins. The discipline pays for itself: teams with baselines expand automation 3x faster because success is provable.",
  },
  {
    id: "ins-003", title: "Data Warehouses Are Having a Second Act", slug: "data-warehouses-second-act",
    category: "Data & BI", author: "Priya Nair", readTime: "6 min", publishedAt: "2025-10-27",
    accent: "from-indigo-600 to-blue-500", status: "published",
    excerpt: "AI has turned the humble warehouse into the most important platform investment of the decade.",
    content: "Every AI initiative is downstream of data quality. The resurgence of disciplined warehouse modeling — powered by transformation tools and semantic layers — is why some enterprises deploy AI in weeks while others stall for quarters.\n\nStart with the KPI dictionary. If finance, sales, and operations cannot agree on definitions, no AI system will produce trusted output.",
  },
  {
    id: "ins-004", title: "Why Your CRM Project Failed (And How to Fix It)", slug: "why-crm-projects-fail",
    category: "Enterprise", author: "Neha Verma", readTime: "8 min", publishedAt: "2025-10-14",
    accent: "from-rose-500 to-orange-500", status: "published",
    excerpt: "70% of CRM projects underdeliver. The failure pattern is predictable — and preventable with the right sequence.",
    content: "CRM failures rarely stem from software choice. They stem from process ambiguity, data debt, and absent adoption incentives. The fix sequence: map the real sales process first, clean and model data second, configure third, train continuously — never the reverse.\n\nAdoption is a design problem. Reps adopt systems that give them value in the first session: instant lead context, one-click follow-ups, and dashboards that match how they are actually measured.",
  },
  {
    id: "ins-005", title: "Design Systems as a Growth Lever", slug: "design-systems-growth-lever",
    category: "Brand & Design", author: "Sana Kapoor", readTime: "5 min", publishedAt: "2025-09-30",
    accent: "from-violet-600 to-fuchsia-500", status: "published",
    excerpt: "Consistency is not cosmetic. Brands with disciplined design systems convert measurably better.",
    content: "When every touchpoint shares a visual language, trust compounds. Our client data shows a 12–24% lift in conversion when companies pair rebrands with systematic design implementation across product, site, and sales collateral.\n\nThe mechanism is simple: consistency reduces cognitive load, and reduced cognitive load keeps buyers in the decision instead of the deciphering.",
  },
  {
    id: "ins-006", title: "The Fractional Executive Advantage", slug: "fractional-executive-advantage",
    category: "Startup Ops", author: "Vikram Shah", readTime: "6 min", publishedAt: "2025-09-16",
    accent: "from-amber-500 to-red-500", status: "published",
    excerpt: "Why 4 hours a week of senior finance leadership beats 40 hours of junior guessing.",
    content: "The fractional model has matured from a stopgap to a strategy. Startups get operator-grade finance, marketing, or technology leadership at a fraction of full-time cost, while avoiding the sequencing error of hiring senior too early or junior too late.\n\nThe best fractional engagements embed: they attend leadership meetings, own outcomes, and build the playbook a future full-time hire will inherit.",
  },
];

// ---------- Resources ----------
export const RESOURCES: Resource[] = [
  { id: "res-001", title: "AI Readiness Checklist", slug: "ai-readiness-checklist", type: "checklist", description: "42-point assessment covering data, security, skills, and process readiness before AI investment.", fileFormat: "PDF", size: "1.2 MB", downloads: 3184, publishedAt: "2025-11-11", status: "published", accent: "from-blue-600 to-cyan-500" },
  { id: "res-002", title: "Workflow Automation Business Case Template", slug: "workflow-automation-business-case", type: "template", description: "Board-ready business case template with ROI model, risk register, and phasing plan.", fileFormat: "XLSX", size: "840 KB", downloads: 2471, publishedAt: "2025-10-20", status: "published", accent: "from-emerald-600 to-teal-500" },
  { id: "res-003", title: "Enterprise Agent Governance Whitepaper", slug: "enterprise-agent-governance", type: "whitepaper", description: "Reference architecture for permissions, audit trails, and human-in-the-loop controls in agent fleets.", fileFormat: "PDF", size: "3.6 MB", downloads: 1876, publishedAt: "2025-10-05", status: "published", accent: "from-indigo-600 to-violet-500" },
  { id: "res-004", title: "Case Study: 63% Ticket Deflection at Apex Logistics", slug: "case-apex-logistics-deflection", type: "case_study", description: "How a multilingual support agent deflected 63% of tier-1 tickets within 90 days.", fileFormat: "PDF", size: "2.1 MB", downloads: 1544, publishedAt: "2025-09-12", status: "published", accent: "from-orange-500 to-red-500" },
  { id: "res-005", title: "KPI Dictionary Starter Pack", slug: "kpi-dictionary-starter", type: "guide", description: "120 pre-defined KPI definitions across sales, marketing, finance, and operations.", fileFormat: "PDF", size: "2.8 MB", downloads: 2912, publishedAt: "2025-08-28", status: "published", accent: "from-rose-500 to-pink-500" },
  { id: "res-006", title: "Startup Compliance Calendar 2026", slug: "startup-compliance-calendar-2026", type: "guide", description: "Month-by-month compliance obligations for private companies across major jurisdictions.", fileFormat: "PDF", size: "980 KB", downloads: 1247, publishedAt: "2025-11-02", status: "published", accent: "from-teal-500 to-green-500" },
];

// ---------- FAQs ----------
export const FAQS: FaqItem[] = [
  { id: "faq-001", question: "What is STIOOS GLOBAL?", answer: "STIOOS GLOBAL is a premium AI, technology, programming, business intelligence, and enterprise solutions marketplace. We connect organizations with vetted, delivery-ready services across ten solution divisions.", category: "General", status: "published", order: 1 },
  { id: "faq-002", question: "How does the marketplace work?", answer: "Browse services by category, industry, or technology. Every service page details capabilities, deliverables, process, and pricing. Submit a request and our expert team responds within one business day with a scoped proposal.", category: "Marketplace", status: "published", order: 2 },
  { id: "faq-003", question: "How are services priced?", answer: "Services use three pricing models: fixed starting prices for scoped projects, monthly subscriptions for ongoing programs, and custom quotes for enterprise engagements. Every proposal includes a transparent breakdown.", category: "Pricing", status: "published", order: 3 },
  { id: "faq-004", question: "Who delivers the services?", answer: "Services are delivered by STIOOS GLOBAL vetted delivery teams — senior practitioners with domain expertise, managed under a single accountable engagement lead.", category: "Delivery", status: "published", order: 4 },
  { id: "faq-005", question: "Do you sign NDAs?", answer: "Yes. Mutual NDAs are standard before discovery conversations. Your requirements and data remain confidential throughout and after the engagement.", category: "General", status: "published", order: 5 },
  { id: "faq-006", question: "What industries do you serve?", answer: "We serve ten core industries including construction, manufacturing, technology, financial services, e-commerce, industrial, professional services, engineering, startups, and enterprises.", category: "General", status: "published", order: 6 },
  { id: "faq-007", question: "Can services be customized to our stack?", answer: "Absolutely. Every engagement begins with a discovery assessment of your existing systems, and every solution is designed to integrate rather than replace.", category: "Delivery", status: "published", order: 7 },
  { id: "faq-008", question: "What support exists after delivery?", answer: "All projects include a 30-day stabilization window. Ongoing managed support, optimization retainers, and SLA-backed plans are available for every service.", category: "Pricing", status: "published", order: 8 },
];

// ---------- Homepage content (managed via /admin/content) ----------
export const HOMEPAGE_CONTENT: HomepageContent = {
  heroBadge: "AI · Technology · Business Intelligence · Enterprise Solutions",
  heroTitleTop: "INTELLIGENCE THAT BUILDS",
  heroTitleBottom: "WHAT'S NEXT.",
  heroSubtitle:
    "STIOOS GLOBAL brings together AI, technology, programming, automation, data intelligence, and business solutions in one intelligent marketplace.",
  primaryCta: "Explore Marketplace",
  secondaryCta: "Explore Solutions",
  stats: [
    { value: "305", label: "Expert Services" },
    { value: "7", label: "Solution Divisions" },
    { value: "40+", label: "Technologies" },
    { value: "24/7", label: "Expert Support" },
  ],
  finalCtaTitle: "READY TO BUILD WITH INTELLIGENCE?",
  finalCtaSubtitle:
    "Join forward-thinking organizations using STIOOS GLOBAL to automate, scale, and lead their markets.",
};
