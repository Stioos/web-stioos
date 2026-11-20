// ============================================================
// SERVICE PAGES DATA — 55 SEO/AEO-optimized service landing pages
//
// Drives the dynamic route at /services/[slug]. Each spec is a
// standalone landing page (hero + 7 sections) built for both
// classic SEO (title, meta description, keyword-rich copy) and
// AEO (Answer Engine Optimization — natural-language questions
// phrased the way buyers ask ChatGPT / Perplexity / Google AI
// Overviews, with detailed structured answers those engines can
// parse and cite).
//
// Architecture:
//   • buildServiceSpec() — factory that takes a service name +
//     division and generates capabilities/process/benefits/faqs
//     deterministically, using division-specific templates.
//   • DIVISION_TEMPLATES — per-division content generators tuned
//     to what buyers in that division actually search for.
//   • RAW_SERVICE_INPUTS — the 55 services, grouped by division.
//   • SERVICE_PAGES — the 55 fully-built specs (related services
//     cross-linked programmatically: 2 same-division + 1 sibling).
//   • getServicePage(slug) / SERVICE_PAGE_SLUGS — route helpers.
// ============================================================

export interface CapabilityItem {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  duration: string;
  description: string;
}

export interface BenefitItem {
  metric: string;
  label: string;
  description: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ServicePageSpec {
  /** URL-safe slug — `/services/[slug]` */
  slug: string;
  /** full service name */
  name: string;
  /** human-readable division name */
  division: string;
  /** division slug for grouping */
  divisionId: string;
  /** 1-line SEO meta description (≤160 chars) */
  shortDescription: string;
  /** 2-3 line hero subtitle explaining what the service does + who it's for */
  heroSubtitle: string;
  /** 6 capability cards with icon key + title + description */
  capabilities: CapabilityItem[];
  /** 5 process steps with durations */
  process: ProcessStep[];
  /** 4 quantified outcome cards */
  benefits: BenefitItem[];
  /** 6 AEO-optimized Q&As */
  faqs: FAQItem[];
  /** slugs of 3 related services */
  relatedServices: string[];
}

// ------------------------------------------------------------
// Slug derivation — strip punctuation, lowercase, hyphenate.
// Matches the two canonical sample slugs in the task brief:
//   "Operations & Process Automation"
//     → "operations-process-automation"
//   "Brand Identity Design & Strategy Development"
//     → "brand-identity-design-strategy-development"
// ------------------------------------------------------------
export function slugifyServiceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[,./'`’":;()!?]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ============================================================
// DIVISION TEMPLATES
// Per-division content generators. Each produces 6 capabilities,
// 5 process steps, 4 benefits, and 6 FAQ Q&As — flavored to the
// buyer intent of that division. The service name is interpolated
// into capability descriptions and FAQ phrasing so the copy stays
// specific (no generic "we can help" filler that AEO engines
// deprioritize).
// ============================================================

interface DivisionTemplate {
  capabilities: (name: string) => CapabilityItem[];
  process: ProcessStep[];
  benefits: BenefitItem[];
  faqs: (name: string, division: string) => FAQItem[];
}

const T: Record<string, DivisionTemplate> = {
  // ── 1. AI Workflow Automation ──
  "ai-workflow-automation": {
    capabilities: (n) => [
      {
        title: "Workflow assessment & mapping",
        description: `End-to-end audit of the processes ${n} will automate — surfacing bottlenecks, handoff friction, and the highest-ROI candidates for AI-driven execution.`,
      },
      {
        title: "AI model selection & orchestration",
        description:
          "Right-sized model selection (LLM, vision, classification, RPA) with orchestration across OpenAI, Anthropic, open-source, and your existing automation stack.",
      },
      {
        title: "Integration with existing CRM/ERP",
        description:
          "Native connectors into Salesforce, HubSpot, SAP, Oracle, NetSuite, and internal tools — no rip-and-replace, no shadow data silos.",
      },
      {
        title: "Human-in-the-loop guardrails",
        description:
          "Approval queues, exception routing, and confidence thresholds that keep AI actions auditable and reversible until trust is proven.",
      },
      {
        title: "Monitoring, alerting & cost controls",
        description:
          "Real-time dashboards tracking throughput, accuracy, model drift, token spend, and SLA breaches — with auto-throttling on runaway costs.",
      },
      {
        title: "Continuous improvement & scaling",
        description:
          "Weekly review cycles that retrain prompts, expand automation scope, and fold new edge cases back into the workflow — so ROI compounds over time.",
      },
    ],
    process: [
      {
        title: "Discovery",
        duration: "Week 1",
        description:
          "Deep-dive workshops with operations, IT, and finance stakeholders to map current workflows, quantify manual effort, and rank automation candidates by ROI.",
      },
      {
        title: "Architecture",
        duration: "Week 2",
        description:
          "Solution blueprint covering model selection, integration points, guardrails, security review, and a measurable success-criteria scorecard.",
      },
      {
        title: "Build & integrate",
        duration: "Weeks 3-5",
        description:
          "Agile build with weekly demos — automation workflows wired into your CRM/ERP, human-in-the-loop approvals, and observability dashboards live from day one.",
      },
      {
        title: "Pilot & validate",
        duration: "Week 6",
        description:
          "Two-week production pilot with a controlled user cohort. Accuracy, throughput, and cost-per-task measured against the success scorecard.",
      },
      {
        title: "Rollout & handover",
        duration: "Weeks 7-8",
        description:
          "Full rollout with runbooks, team enablement, and a 30-day stabilization window. Optional managed-service tier for ongoing optimization.",
      },
    ],
    benefits: [
      {
        metric: "62%",
        label: "Manual effort reduction",
        description:
          "Automated workflows eliminate repetitive tasks like data entry, approvals, status updates, and report generation.",
      },
      {
        metric: "4.2x",
        label: "Throughput acceleration",
        description:
          "AI-driven processes run 24/7 with sub-second cycle times vs. hours of human queue latency.",
      },
      {
        metric: "38%",
        label: "Operational cost savings",
        description:
          "Reallocated headcount moves to high-value work; overtime and outsourcing spend drop within 90 days.",
      },
      {
        metric: "99.5%",
        label: "Process accuracy",
        description:
          "Confidence-thresholded execution with human-in-the-loop fallbacks keeps error rates below manual benchmarks.",
      },
    ],
    faqs: (n) => [
      {
        q: `How does ${n.toLowerCase()} reduce operational costs?`,
        a: `${n} replaces manual, repetitive work — data entry, approvals, status updates, report generation — with AI-driven workflows that run 24/7 at a fraction of the per-task cost. Clients typically see a 30-40% reduction in operational spend within 90 days of rollout, primarily through headcount reallocation, lower overtime, and reduced outsourcing. The automation also eliminates the error-rework cycle that quietly inflates costs in manual operations.`,
      },
      {
        q: `How long does it take to implement ${n.toLowerCase()}?`,
        a: `A typical engagement runs 6-8 weeks end-to-end: one week of discovery and workflow mapping, one week of solution architecture, three weeks of build and integration into your CRM/ERP, one week of controlled pilot, and one to two weeks of rollout with team enablement. Complex enterprise deployments with multiple system integrations can extend to 10-12 weeks, but we always deliver a production-ready pilot inside the first six weeks so you see ROI before the engagement closes.`,
      },
      {
        q: `Will ${n.toLowerCase()} integrate with our existing CRM, ERP, and internal tools?`,
        a: `Yes. Every engagement starts with an integration assessment of your current stack — Salesforce, HubSpot, SAP, Oracle, NetSuite, Zendesk, Slack, internal databases, and custom tools. We use native APIs and pre-built connectors where they exist, and build custom integrations only when necessary. The goal is zero rip-and-replace: your existing systems stay in place, and the automation layer orchestrates them.`,
      },
      {
        q: `What does ${n.toLowerCase()} cost and how is it priced?`,
        a: `Pricing follows the outcome-as-a-service model: a setup fee covering discovery, architecture, and build (typically $15K-$60K depending on scope), followed by a monthly managed-service retainer ($2K-$12K) covering monitoring, optimization, and continuous improvement. Performance-based pricing is available for revenue-generating workflows. Book a scoping call for a fixed-quote proposal delivered within three business days.`,
      },
      {
        q: `How do you handle security, compliance, and data privacy in ${n.toLowerCase()}?`,
        a: `All workflows run inside your tenant or your private cloud VPC — no customer data ever leaves your environment unless you explicitly opt in. We are SOC 2 Type II aligned, support GDPR, HIPAA, and PCI-DSS workflows, and every automation includes human-in-the-loop approval gates, full audit logs, and role-based access control. A signed DPA and security review are part of every engagement.`,
      },
      {
        q: `What happens after ${n.toLowerCase()} goes live — do you provide ongoing support?`,
        a: `Yes. Every engagement includes a 30-day stabilization window at no extra cost, during which we monitor accuracy, fix edge cases, and train your team. Beyond that, a managed-service tier covers continuous improvement: weekly optimization reviews, prompt and model retraining, scope expansion to new workflows, and on-call support with a 4-hour response SLA. Most clients move to managed service after the first automation proves ROI.`,
      },
    ],
  },

  // ── 2. Custom AI Agentic Services ──
  "custom-ai-agentic-services": {
    capabilities: (n) => [
      {
        title: "Agent design & persona definition",
        description: `${n} starts with a clear agent charter — role, scope, decision rights, escalation rules, and the measurable outcomes the agent is accountable for.`,
      },
      {
        title: "Tool & function calling integration",
        description:
          "Agents are wired to real systems via function-calling: query CRMs, update tickets, trigger workflows, fetch knowledge, and execute multi-step tasks across tools.",
      },
      {
        title: "Prompt engineering & RAG pipelines",
        description:
          "Production-grade prompts backed by retrieval-augmented generation over your knowledge base, docs, and historical tickets — so responses are accurate, not hallucinated.",
      },
      {
        title: "Evaluation, testing & guardrails",
        description:
          "Offline eval suites with golden datasets, automated regression tests, and runtime guardrails (PII redaction, toxicity, jailbreak defense, citation verification).",
      },
      {
        title: "Observability & continuous tuning",
        description:
          "Per-conversation tracing, satisfaction scoring, and topic clustering that surface what to fix next — agents improve every week, not every quarter.",
      },
      {
        title: "Multi-agent orchestration",
        description:
          "When a single agent can't cover scope, we orchestrate fleets — router agents, specialist agents, and supervisor agents that cooperate under a governance layer.",
      },
    ],
    process: [
      {
        title: "Charter & scope",
        duration: "Week 1",
        description:
          "Workshops to define the agent's role, success metrics, escalation paths, and the systems it will operate on. Output: a signed agent charter.",
      },
      {
        title: "Tool & data integration",
        duration: "Week 2",
        description:
          "Wire the agent to the tools and data sources it needs — CRM, ticketing, knowledge base, internal APIs — with function-calling interfaces and access controls.",
      },
      {
        title: "Prompt & RAG build",
        duration: "Weeks 3-4",
        description:
          "Production prompts, retrieval pipelines over your knowledge base, and a golden-dataset eval suite with automated regression tests.",
      },
      {
        title: "Guardrails & pilot",
        duration: "Week 5",
        description:
          "PII redaction, toxicity filters, jailbreak defense, and citation verification go live. Controlled pilot with a subset of users measures accuracy and CSAT.",
      },
      {
        title: "Rollout & managed tuning",
        duration: "Weeks 6+",
        description:
          "Full rollout with observability dashboards, weekly tuning cycles, and a managed-service tier for continuous improvement.",
      },
    ],
    benefits: [
      {
        metric: "70%",
        label: "Ticket auto-resolution",
        description:
          "Purpose-built support and process agents resolve the majority of routine queries without human escalation.",
      },
      {
        metric: "24/7",
        label: "Always-on coverage",
        description:
          "Agents respond in under two seconds at any hour, eliminating queue latency and after-hours gaps.",
      },
      {
        metric: "3.1x",
        label: "Team capacity multiplier",
        description:
          "Human teams handle complex escalations while agents absorb the repetitive volume — output scales without hiring.",
      },
      {
        metric: "98%",
        label: "Citation accuracy",
        description:
          "Retrieval-augmented responses grounded in your knowledge base, with runtime verification against source documents.",
      },
    ],
    faqs: (n) => [
      {
        q: `What is ${n.toLowerCase()} and how does it differ from a chatbot?`,
        a: `${n} delivers purpose-built AI agents that don't just answer questions — they take action. Where a chatbot deflects, an agent resolves: it queries your CRM, updates a ticket, triggers a workflow, escalates to a human when needed, and learns from the outcome. Each agent is built for a specific role (support, sales, operations) with function-calling into your real systems, retrieval-augmented generation over your knowledge base, and runtime guardrails for accuracy and safety.`,
      },
      {
        q: `How does ${n.toLowerCase()} integrate with our CRM, ticketing system, and internal tools?`,
        a: `Every agent is wired to your stack via function-calling interfaces — Salesforce, HubSpot, Zendesk, Jira, ServiceNow, Slack, internal APIs, and custom databases. The agent calls real functions to read and write data, trigger workflows, and escalate to humans. We use native APIs where they exist and build custom connectors only when necessary. Your systems stay in place; the agent layer orchestrates them.`,
      },
      {
        q: `How do you prevent hallucinations and ensure the agent gives accurate answers?`,
        a: `Three layers: retrieval-augmented generation grounds every response in your knowledge base, docs, and historical tickets — no free-form invention. Runtime guardrails verify citations against source documents and flag un-grounded claims for human review. And an offline eval suite with golden datasets runs automated regression tests on every prompt change, so accuracy is measurable, not aspirational. We publish accuracy scores per agent and tune weekly.`,
      },
      {
        q: `How long does it take to build and deploy ${n.toLowerCase()}?`,
        a: `A production-ready agent ships in 5-6 weeks: one week for charter and scope definition, one week for tool and data integration, two weeks for prompt and RAG build with eval suite, one week for guardrails and controlled pilot, then full rollout. Multi-agent systems or agents with complex tool integrations can extend to 8-10 weeks. We always deliver a working pilot inside the first month so you see real conversations before committing to rollout.`,
      },
      {
        q: `What security, privacy, and compliance controls does ${n.toLowerCase()} include?`,
        a: `Agents run inside your tenant or private VPC — customer data never leaves your environment unless you opt in. We are SOC 2 Type II aligned, support GDPR, HIPAA, and PCI-DSS workflows, and every agent includes PII redaction, role-based access control, full audit logging of every action taken, and human-in-the-loop approval for high-stakes operations. A signed DPA and security architecture review are part of every engagement.`,
      },
      {
        q: `How is ${n.toLowerCase()} priced — and what's the ROI?`,
        a: `Pricing is a build fee ($20K-$80K depending on agent complexity and number of tool integrations) plus a monthly managed-service retainer ($2K-$15K) covering observability, tuning, and continuous improvement. ROI is typically measured in deflected tickets, hours saved, or revenue influenced — most clients recover the build cost within 60-90 days of rollout. Performance-based pricing is available for revenue-generating agents.`,
      },
    ],
  },

  // ── 3. Tech & Programming Services ──
  "tech-programming-services": {
    capabilities: (n) => [
      {
        title: "Discovery & technical scoping",
        description: `${n} begins with a technical discovery — product goals, user personas, system constraints, and a clear build-vs-buy analysis for every component.`,
      },
      {
        title: "Architecture & system design",
        description:
          "Scalable architecture documents covering data models, API contracts, security model, deployment topology, and a phased delivery roadmap.",
      },
      {
        title: "Senior engineering team",
        description:
          "A dedicated pod — tech lead, senior engineers, QA, and design — building in your stack (Next.js, Node, Python, Go, React Native, Swift, Kotlin).",
      },
      {
        title: "CI/CD & DevOps foundation",
        description:
          "Automated pipelines, infrastructure-as-code, staging environments, and observability from day one — not bolted on after launch.",
      },
      {
        title: "QA, security & compliance review",
        description:
          "Automated test coverage, security scanning (SAST/DAST), accessibility audits, and compliance documentation (SOC 2, HIPAA, PCI as needed).",
      },
      {
        title: "Handover & managed support",
        description:
          "Runbooks, code ownership transferred to your team, and an optional managed-service tier for ongoing features, patches, and infrastructure.",
      },
    ],
    process: [
      {
        title: "Discovery & scoping",
        duration: "Week 1",
        description:
          "Workshops with product, engineering, and stakeholders to define scope, success metrics, technical constraints, and a phased delivery plan.",
      },
      {
        title: "Architecture & design",
        duration: "Week 2",
        description:
          "System architecture, data models, API contracts, security model, and UI/UX design system — signed off before any code is written.",
      },
      {
        title: "Sprint build",
        duration: "Weeks 3-8",
        description:
          "Two-week sprints with demoable increments. CI/CD, automated tests, and observability live from sprint one. Weekly stakeholder reviews.",
      },
      {
        title: "QA & launch",
        duration: "Week 9",
        description:
          "Security scan, accessibility audit, performance test, and staged rollout with rollback plan. Production launch with monitoring dashboards.",
      },
      {
        title: "Handover & support",
        duration: "Weeks 10+",
        description:
          "Runbooks, team enablement sessions, code ownership transfer, and optional managed-service tier for ongoing features and maintenance.",
      },
    ],
    benefits: [
      {
        metric: "3.4x",
        label: "Release velocity",
        description:
          "CI/CD, automated tests, and two-week sprints deliver demoable features in weeks, not quarters.",
      },
      {
        metric: "99.9%",
        label: "Production uptime",
        description:
          "Observability, infrastructure-as-code, and rollback plans keep production stable from launch day.",
      },
      {
        metric: "85%",
        label: "Test coverage",
        description:
          "Automated unit, integration, and end-to-end tests catch regressions before they reach users.",
      },
      {
        metric: "30-day",
        label: "Stabilization window",
        description:
          "Free bug fixes and tuning for 30 days post-launch — your team isn't left holding the bag.",
      },
    ],
    faqs: (n) => [
      {
        q: `What does ${n.toLowerCase()} include end-to-end?`,
        a: `${n} covers the full software lifecycle: discovery and technical scoping, architecture and system design, a senior engineering pod building in your stack, CI/CD and DevOps foundation, QA and security review, launch, and a 30-day stabilization window with optional managed support. You get a production-ready product, source code ownership, runbooks, and a team enablement handover — not just code dumped in a repo.`,
      },
      {
        q: `How long does ${n.toLowerCase()} typically take from kickoff to launch?`,
        a: `Most projects launch in 8-10 weeks: one week of discovery, one week of architecture and design, six weeks of two-week sprint builds with demoable increments, and one week of QA, security scan, and staged rollout. Larger products with multiple integrations or compliance requirements can run 12-16 weeks. We always deliver a working MVP inside the first month so you can validate with users before committing to full scope.`,
      },
      {
        q: `What technology stacks does ${n.toLowerCase()} support?`,
        a: `We staff senior engineers across the modern stack — Next.js, React, Node.js, Python, Go, React Native, Swift, Kotlin, PostgreSQL, MongoDB, Redis, AWS, GCP, Azure, and Terraform. We build in your existing stack when you have one, and recommend the right tool for the job when you don't. No vendor lock-in: every line of code is yours, documented, and handover-ready.`,
      },
      {
        q: `Do we own the source code and IP from ${n.toLowerCase()}?`,
        a: `Yes — fully. Source code, IP, design assets, infrastructure configuration, and documentation are transferred to your repositories at handover. We work in your GitHub/GitLab when possible, use your cloud accounts, and sign an IP assignment agreement as part of every engagement. You are never locked into our team for changes or maintenance.`,
      },
      {
        q: `How does ${n.toLowerCase()} handle QA, security, and compliance?`,
        a: `Every project ships with automated unit, integration, and end-to-end tests (target 85% coverage), SAST and DAST security scans in the CI pipeline, accessibility audits (WCAG 2.1 AA), and compliance documentation tailored to your industry — SOC 2, HIPAA, PCI-DSS, GDPR as needed. Penetration testing is coordinated with a third party at launch. No production deploy passes without green tests and a clean security scan.`,
      },
      {
        q: `What does ${n.toLowerCase()} cost and how is it priced?`,
        a: `Pricing is a fixed-scope build fee ($30K-$200K depending on product complexity, integrations, and compliance) or a monthly managed-service retainer ($8K-$30K) for ongoing product development. We deliver a fixed-quote proposal within three business days of the discovery workshop, with milestone-based billing tied to demoable increments. Book a scoping call to get a quote specific to your scope.`,
      },
    ],
  },

  // ── 4. Multimedia & Graphic Design ──
  "multimedia-graphic-design": {
    capabilities: (n) => [
      {
        title: "Creative discovery & brief",
        description: `${n} starts with a creative brief — audience, brand voice, channel, and the single action each asset must drive.`,
      },
      {
        title: "Concept & art direction",
        description:
          "Mood boards, concept exploration, and art direction that lock visual language before production resources are committed.",
      },
      {
        title: "Design & production",
        description:
          "Senior designers and producers build the asset set — print, digital, video, motion, audio — at production quality with brand consistency.",
      },
      {
        title: "AI-accelerated iteration",
        description:
          "Where appropriate, AI generation pipelines accelerate variant exploration — 50 concepts in the time it used to take to make 5 — with human curation.",
      },
      {
        title: "Review, refine & finalize",
        description:
          "Structured review cycles with revision rounds, version control, and asset handoff in the formats each channel requires.",
      },
      {
        title: "Asset library & brand system",
        description:
          "Organized asset library, brand guidelines, and templates your team can reuse — so future assets stay on-brand without starting from scratch.",
      },
    ],
    process: [
      {
        title: "Creative brief",
        duration: "Week 1",
        description:
          "Workshop to lock audience, message, channels, success metrics, and the single action each asset must drive. Output: signed creative brief.",
      },
      {
        title: "Concept & direction",
        duration: "Week 2",
        description:
          "Mood boards, two to three concept directions, and art direction that establishes the visual language. Stakeholder review and selection.",
      },
      {
        title: "Design & production",
        duration: "Weeks 3-5",
        description:
          "Senior designers and producers build the full asset set — print, digital, video, motion, audio — with weekly review cycles.",
      },
      {
        title: "Refine & finalize",
        duration: "Week 6",
        description:
          "Revision rounds, version control, and final asset production in every format each channel requires. QA across resolutions and devices.",
      },
      {
        title: "Handoff & archive",
        duration: "Week 7",
        description:
          "Asset library handoff, brand guidelines, reusable templates, and organized archive your team can build on for future campaigns.",
      },
    ],
    benefits: [
      {
        metric: "5x",
        label: "Variant exploration speed",
        description:
          "AI-accelerated pipelines produce 50 concept variants in the time traditional production made 5.",
      },
      {
        metric: "100%",
        label: "Brand consistency",
        description:
          "Every asset built against a locked brand system — no off-brand drift across channels or campaigns.",
      },
      {
        metric: "48h",
        label: "Asset turnaround",
        description:
          "Standard digital assets delivered in 48 hours once the creative direction is locked.",
      },
      {
        metric: "3",
        label: "Revision rounds included",
        description:
          "Three structured revision rounds per asset — clarity on scope, no surprise billing.",
      },
    ],
    faqs: (n) => [
      {
        q: `What does ${n.toLowerCase()} cover end-to-end?`,
        a: `${n} covers the full creative lifecycle: a creative brief that locks audience and intent, concept exploration with art direction, senior design and production across print, digital, video, motion, and audio, AI-accelerated variant exploration where appropriate, structured revision rounds, and final asset handoff in every channel-ready format. You also receive an organized asset library and brand guidelines your team can reuse for future work.`,
      },
      {
        q: `How long does ${n.toLowerCase()} take from brief to final assets?`,
        a: `A typical engagement runs 5-7 weeks: one week for the creative brief and discovery, one week for concept exploration and art direction, three weeks for production of the full asset set with weekly reviews, one week for revisions and finalization, and a final handoff week. Urgent single-asset requests can be turned around in 48-72 hours once creative direction is locked. Campaign-scale work with multiple asset families runs 8-12 weeks.`,
      },
      {
        q: `Does ${n.toLowerCase()} use AI generation tools — and how do you keep quality high?`,
        a: `Yes — we use AI generation pipelines (image, video, audio, motion) to accelerate variant exploration and produce high-volume asset sets in a fraction of the time. But every AI-generated asset is curated, retouched, and brand-checked by a senior designer before delivery. AI is a production accelerator, not a replacement for art direction. Brand consistency, accessibility, and channel-readiness are non-negotiable.`,
      },
      {
        q: `What file formats and deliverables does ${n.toLowerCase()} provide?`,
        a: `Every channel-ready format you need: print (PDF, AI, EPS, TIFF at 300 DPI), digital (PNG, SVG, WebP, JPG at multiple resolutions), social (sized for every platform — Instagram, LinkedIn, X, TikTok, YouTube), video (MP4, MOV, WebM at multiple aspect ratios), motion (Lottie, GIF), audio (WAV, MP3), and source files (Figma, Adobe CC). You also receive brand guidelines and a reusable template library.`,
      },
      {
        q: `How many revision rounds are included in ${n.toLowerCase()}?`,
        a: `Every engagement includes three structured revision rounds per asset. Revisions are tracked in a shared review board (Frame.io or Figma comments) so feedback is consolidated and nothing is lost. Additional revision rounds are billed at a transparent hourly rate. Scope changes mid-project (new asset families, new channels) are handled via a change order so you always know what's included.`,
      },
      {
        q: `What does ${n.toLowerCase()} cost?`,
        a: `Pricing depends on scope: single-asset requests (logo refresh, hero illustration) start at $1.5K-$5K, asset families for a campaign run $8K-$30K, and full brand identity systems with guidelines and templates run $15K-$50K. AI-accelerated high-volume asset production is priced per batch. Book a scoping call for a fixed-quote proposal delivered within three business days.`,
      },
    ],
  },

  // ── 5. Digital Sales & AI Marketing ──
  "digital-sales-ai-marketing": {
    capabilities: (n) => [
      {
        title: "Funnel & channel strategy",
        description: `${n} starts with a full-funnel strategy — acquisition, nurture, conversion, retention — and the channel mix that fits your audience and budget.`,
      },
      {
        title: "AI-driven personalization",
        description:
          "Dynamic content, audience segmentation, and AI-personalized messaging across email, web, ads, and SMS — built for relevance at scale.",
      },
      {
        title: "Campaign build & automation",
        description:
          "Production-ready campaigns in your stack — HubSpot, Marketo, Salesforce, Klaviyo, Meta, Google — with lifecycle automation wired end-to-end.",
      },
      {
        title: "Content & creative production",
        description:
          "Ad creative, landing pages, email sequences, and lead magnets produced in volume by senior marketers and the multimedia team.",
      },
      {
        title: "Attribution & ROI analytics",
        description:
          "Multi-touch attribution dashboards showing cost-per-lead, pipeline influenced, and ROI per channel — no more guessing what's working.",
      },
      {
        title: "Continuous optimization",
        description:
          "Weekly A/B tests, channel-level ROI reviews, and budget reallocation toward what's working — performance compounds month over month.",
      },
    ],
    process: [
      {
        title: "Strategy & audit",
        duration: "Week 1",
        description:
          "Audit of current funnel, channel performance, and competitive position. Workshop to lock goals, target CAC, and channel mix.",
      },
      {
        title: "Build & integration",
        duration: "Weeks 2-3",
        description:
          "Campaigns, automation workflows, and tracking infrastructure built in your stack. Attribution dashboards live from day one.",
      },
      {
        title: "Launch & ramp",
        duration: "Week 4",
        description:
          "Coordinated launch across channels with daily monitoring for the first two weeks. Budget ramped based on early signal.",
      },
      {
        title: "Optimize & scale",
        duration: "Weeks 5-8",
        description:
          "Weekly A/B tests, creative refreshes, and budget reallocation toward winning channels. CAC trended down, pipeline trended up.",
      },
      {
        title: "Handover & managed",
        duration: "Weeks 9+",
        description:
          "Optional managed-service tier for ongoing optimization, creative production, and monthly performance reviews.",
      },
    ],
    benefits: [
      {
        metric: "3.8x",
        label: "Pipeline lift",
        description:
          "AI-driven targeting and nurture sequences lift qualified pipeline within 90 days of launch.",
      },
      {
        metric: "42%",
        label: "CAC reduction",
        description:
          "Budget reallocation toward winning channels and continuous A/B testing drive down acquisition cost.",
      },
      {
        metric: "5x",
        label: "Personalization scale",
        description:
          "AI-personalized messaging across email, web, and ads reaches every segment with relevant content.",
      },
      {
        metric: "100%",
        label: "Attribution visibility",
        description:
          "Multi-touch dashboards show cost-per-lead and ROI per channel — no more guessing what's working.",
      },
    ],
    faqs: (n) => [
      {
        q: `How does ${n.toLowerCase()} improve marketing ROI?`,
        a: `${n} improves ROI through three levers: AI-driven personalization that lifts engagement across email, web, and ads; multi-touch attribution that surfaces which channels actually drive pipeline so budget goes where it works; and continuous A/B testing that compounds gains month over month. Clients typically see a 3-4x lift in qualified pipeline and a 30-45% reduction in customer acquisition cost within 90 days of full rollout.`,
      },
      {
        q: `What marketing platforms does ${n.toLowerCase()} work with?`,
        a: `We build and manage campaigns across the full stack — HubSpot, Marketo, Salesforce Marketing Cloud, Klaviyo, Mailchimp, Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, YouTube, and your CMS (Webflow, WordPress, custom). We use native integrations where they exist and build custom pipelines when needed. Your existing stack stays in place; we orchestrate it.`,
      },
      {
        q: `How does ${n.toLowerCase()} use AI for personalization?`,
        a: `AI drives three layers: audience segmentation that clusters users by behavior, intent, and stage; dynamic content selection that serves the right message, creative, and offer per segment in real time; and predictive send-time optimization that delivers email and SMS when each recipient is most likely to engage. Every personalization is measured against a holdout control so the lift is quantifiable, not aspirational.`,
      },
      {
        q: `How long until we see results from ${n.toLowerCase()}?`,
        a: `First results — campaign launches, attribution dashboards live, early signal on CAC and pipeline — land within four weeks. Meaningful ROI improvements typically show between weeks 6 and 12 as the optimization cycles compound: weekly A/B tests surface winners, budget shifts toward performing channels, and the nurture sequences mature. We report on a weekly cadence with monthly executive summaries tied to revenue and pipeline metrics.`,
      },
      {
        q: `What does ${n.toLowerCase()} cost and how is it priced?`,
        a: `Pricing is a setup fee covering audit, strategy, and campaign build ($10K-$40K depending on channel count and stack complexity) plus a monthly managed-service retainer ($4K-$20K) covering optimization, creative production, and reporting. Performance-based pricing is available when attribution is reliable enough to tie spend to pipeline. Ad spend is separate and billed directly to your platform accounts. Book a scoping call for a fixed-quote proposal.`,
      },
      {
        q: `Do you provide reporting and attribution with ${n.toLowerCase()}?`,
        a: `Yes — multi-touch attribution dashboards are live from day one, showing cost-per-lead, pipeline influenced, customer acquisition cost, and ROI per channel. We use a combination of platform-native attribution (HubSpot, Google Analytics 4) and a unified dashboard pulling from every channel so you see one source of truth. Weekly performance reviews and monthly executive summaries are included; raw data is always available to your team.`,
      },
    ],
  },

  // ── 6. Business & Enterprise Services ──
  "business-enterprise-services": {
    capabilities: (n) => [
      {
        title: "Process & system assessment",
        description: `${n} begins with an assessment of your current processes, systems, and pain points — quantified baseline before any change.`,
      },
      {
        title: "Solution design & roadmap",
        description:
          "A phased roadmap covering solution selection, integration plan, change management, and measurable success criteria at each stage.",
      },
      {
        title: "Implementation & integration",
        description:
          "Senior implementation specialists build and integrate the solution into your stack — Salesforce, HubSpot, SAP, Oracle, NetSuite, custom.",
      },
      {
        title: "Data migration & quality",
        description:
          "Secure migration of historical data with deduplication, validation, and reconciliation — no data loss, no broken references.",
      },
      {
        title: "Training & change management",
        description:
          "Role-based training, documentation, and adoption tracking — so the new system actually gets used, not just deployed.",
      },
      {
        title: "Governance & ongoing optimization",
        description:
          "Governance model, admin ownership transfer, and optional managed-service tier for continuous optimization and feature rollout.",
      },
    ],
    process: [
      {
        title: "Assessment",
        duration: "Week 1-2",
        description:
          "Stakeholder interviews, system audit, and process mapping. Quantified baseline of current state, pain points, and target outcomes.",
      },
      {
        title: "Design & roadmap",
        duration: "Weeks 3-4",
        description:
          "Solution design, integration plan, change management strategy, and a phased roadmap with measurable success criteria.",
      },
      {
        title: "Implementation",
        duration: "Weeks 5-10",
        description:
          "Build, configuration, and integration of the solution into your stack. Data migration with validation. Weekly demos and review cycles.",
      },
      {
        title: "Training & adoption",
        duration: "Weeks 11-12",
        description:
          "Role-based training, documentation, and adoption tracking. Admin enablement and cutover plan executed with rollback fallback.",
      },
      {
        title: "Optimize & support",
        duration: "Weeks 13+",
        description:
          "Post-launch stabilization, optimization, and optional managed-service tier for ongoing feature rollout and support.",
      },
    ],
    benefits: [
      {
        metric: "45%",
        label: "Process cycle time cut",
        description:
          "Streamlined processes and automation cut cycle times across operations, finance, and customer workflows.",
      },
      {
        metric: "100%",
        label: "Data integrity preserved",
        description:
          "Validated migration with reconciliation reports — no data loss, no broken references, full audit trail.",
      },
      {
        metric: "92%",
        label: "Adoption rate at 90 days",
        description:
          "Role-based training and change management drive real adoption, not just deployment.",
      },
      {
        metric: "60-day",
        label: "Go-live stabilization",
        description:
          "Post-launch stabilization window included — your team isn't left holding the bag.",
      },
    ],
    faqs: (n) => [
      {
        q: `What does ${n.toLowerCase()} cover end-to-end?`,
        a: `${n} spans the full implementation lifecycle: process and system assessment to quantify the baseline, solution design and phased roadmap, implementation and integration into your existing stack, secure data migration with validation, role-based training and change management, and post-launch stabilization with optional managed service. You get a working production system, a trained team, and a governance model that survives handover.`,
      },
      {
        q: `How long does ${n.toLowerCase()} typically take?`,
        a: `Most enterprise implementations run 10-14 weeks: two weeks of assessment, two weeks of design and roadmap, six weeks of build and integration, two weeks of training and adoption, then post-launch stabilization. Complex deployments with multiple system integrations or regulatory compliance can run 16-24 weeks. We always deliver a working pilot inside the first quarter so stakeholders see real value before the engagement closes.`,
      },
      {
        q: `Does ${n.toLowerCase()} work with our existing CRM, ERP, and internal systems?`,
        a: `Yes — we implement and integrate across Salesforce, HubSpot, SAP, Oracle, NetSuite, Microsoft Dynamics, ServiceNow, Zendesk, and custom internal tools. The goal is zero rip-and-replace: your existing systems stay in place, and we layer in the new capability with native integrations and documented APIs. Custom connectors are built only when no native option exists.`,
      },
      {
        q: `How do you handle data migration during ${n.toLowerCase()}?`,
        a: `Migration is a structured four-step process: profiling (source data audit and quality check), mapping (field-by-field mapping with transformation rules), validation (reconciliation against source counts and reference checks), and cutover (staged migration with rollback plan). Every step has a documented audit trail. No production cutover happens until reconciliation reports are signed off by your data owner.`,
      },
      {
        q: `How does ${n.toLowerCase()} drive adoption — not just deployment?`,
        a: `Deployment without adoption is wasted spend. We pair every implementation with role-based training (admin, manager, end-user tracks), quick-reference documentation, super-user enablement, and adoption tracking dashboards that surface where usage is lagging. Post-launch, we run office hours for the first 60 days and target a 90%+ adoption rate within 90 days — measured by actual system usage, not login counts.`,
      },
      {
        q: `What does ${n.toLowerCase()} cost?`,
        a: `Pricing is a fixed-scope implementation fee ($40K-$250K depending on system complexity, number of integrations, and data migration volume) plus an optional monthly managed-service retainer ($5K-$25K) covering optimization, admin support, and feature rollout. We deliver a fixed-quote proposal within five business days of the assessment workshop. Book a scoping call to start the assessment.`,
      },
    ],
  },

  // ── 7. Consultation & Solutions ──
  "consultation-solutions": {
    capabilities: (n) => [
      {
        title: "Diagnostic & current-state audit",
        description: `${n} begins with a diagnostic — what's working, what's broken, what's at risk — backed by stakeholder interviews and quantified data.`,
      },
      {
        title: "Strategic recommendations",
        description:
          "Prioritized recommendations with effort-vs-impact scoring, so leadership knows what to fix first and what to defer.",
      },
      {
        title: "Implementation roadmap",
        description:
          "Phased roadmap with milestones, owners, dependencies, and budget — actionable, not theoretical.",
      },
      {
        title: "Executive alignment & facilitation",
        description:
          "Workshops and steering committee facilitation that align stakeholders around the strategy and the trade-offs it requires.",
      },
      {
        title: "Pilot & proof-of-concept delivery",
        description:
          "Where strategy needs validation, we deliver a time-boxed pilot that proves the concept before full investment.",
      },
      {
        title: "Change management & rollout",
        description:
          "Change management plan, communication cadence, and adoption tracking — so the strategy actually lands in the organization.",
      },
    ],
    process: [
      {
        title: "Diagnostic",
        duration: "Weeks 1-2",
        description:
          "Stakeholder interviews, document review, and data analysis. Quantified baseline of current state, gaps, and risk exposure.",
      },
      {
        title: "Recommendations",
        duration: "Weeks 3-4",
        description:
          "Prioritized recommendations with effort-vs-impact scoring. Strategic options and trade-offs documented for executive review.",
      },
      {
        title: "Roadmap",
        duration: "Weeks 5-6",
        description:
          "Phased implementation roadmap with milestones, owners, dependencies, and budget. Aligned with leadership in a sign-off workshop.",
      },
      {
        title: "Pilot",
        duration: "Weeks 7-10",
        description:
          "Time-boxed pilot or proof-of-concept that validates the highest-uncertainty recommendation before full investment.",
      },
      {
        title: "Rollout & adoption",
        duration: "Weeks 11+",
        description:
          "Change management, communication plan, and adoption tracking. Optional ongoing advisory retainer for executive sponsorship.",
      },
    ],
    benefits: [
      {
        metric: "100%",
        label: "Recommendations prioritized",
        description:
          "Every recommendation scored on effort vs. impact — leadership knows what to fix first.",
      },
      {
        metric: "8 wks",
        label: "Diagnostic to roadmap",
        description:
          "From kickoff to a signed-off roadmap in eight weeks — no analysis-paralysis.",
      },
      {
        metric: "1",
        label: "Pilot per engagement",
        description:
          "Highest-uncertainty recommendation validated with a time-boxed pilot before full investment.",
      },
      {
        metric: "60-day",
        label: "Adoption tracking window",
        description:
          "Rollout includes 60 days of adoption tracking so the strategy actually lands.",
      },
    ],
    faqs: (n) => [
      {
        q: `What does ${n.toLowerCase()} deliver — strategy or execution?`,
        a: `${n} delivers both. The core engagement is a strategic deliverable — a diagnostic of current state, prioritized recommendations, and a phased implementation roadmap — but we also facilitate executive alignment, run a time-boxed pilot to validate the highest-uncertainty recommendation, and stay on for change management during rollout. We are not a slide-deck-only firm; every recommendation includes the implementation path that proves it works.`,
      },
      {
        q: `How long does ${n.toLowerCase()} take?`,
        a: `A full engagement runs 10-12 weeks: two weeks of diagnostic (interviews, document review, data analysis), two weeks of prioritized recommendations, two weeks of roadmap finalization and executive sign-off, four weeks of pilot delivery, and two weeks of change management rollout setup. Diagnostic-only or roadmap-only engagements compress to 4-6 weeks. Book a scoping call to define the right scope for your situation.`,
      },
      {
        q: `Who delivers ${n.toLowerCase()} — juniors or senior practitioners?`,
        a: `Every engagement is led by a senior practitioner — typically 15+ years of operating experience in the relevant domain (operations, finance, technology, marketing, compliance). They are accountable for the diagnostic, the recommendations, and the executive workshops. Junior analysts support research and data analysis, but the strategic work and stakeholder-facing sessions are owned by the senior lead. You're paying for judgment, not a staffing pyramid.`,
      },
      {
        q: `How does ${n.toLowerCase()} prove the strategy works before full investment?`,
        a: `Every engagement includes a time-boxed pilot (typically 4-6 weeks) that validates the highest-uncertainty recommendation before you commit to full rollout. The pilot has a clear hypothesis, a measurable success criterion, and a stop-or-scale decision gate at the end. This de-risks the strategy: you see real outcomes on a small scale before authorizing the full investment recommended in the roadmap.`,
      },
      {
        q: `What does ${n.toLowerCase()} cost?`,
        a: `Pricing is a fixed-scope consulting fee ($25K-$150K depending on diagnostic depth, number of stakeholders, and pilot scope) with optional monthly advisory retainers ($5K-$15K) for ongoing executive sponsorship during rollout. Strategy-only engagements (no pilot) start at $25K; full engagement with pilot and change management typically runs $75K-$150K. Book a scoping call for a fixed-quote proposal within five business days.`,
      },
      {
        q: `What happens after ${n.toLowerCase()} ends — do you support implementation?`,
        a: `Yes. The base engagement includes 60 days of adoption tracking and change management support during rollout. Beyond that, an advisory retainer covers ongoing executive sponsorship, quarterly check-ins, and support for the implementation teams executing the roadmap. We can also deliver the implementation directly through our delivery divisions — cloud, software, automation, marketing, accounting — so the strategy has a single accountable owner from diagnostic to rollout.`,
      },
    ],
  },

  // ── 8. Startup & Accounting ──
  "startup-accounting": {
    capabilities: (n) => [
      {
        title: "Onboarding & system setup",
        description: `${n} starts with structured onboarding — accounting system setup, chart of accounts, and a clean baseline from day one.`,
      },
      {
        title: "Monthly close & reporting",
        description:
          "Accurate monthly close with P&L, balance sheet, cash flow, and management reporting delivered on a predictable cadence.",
      },
      {
        title: "Compliance & filings",
        description:
          "Regulatory filings, tax filings, payroll compliance, and statutory reports handled end-to-end — never a missed deadline.",
      },
      {
        title: "Cash flow & forecast",
        description:
          "Rolling cash flow forecast, burn rate tracking, and runway scenarios — so you always know when you need to raise or cut.",
      },
      {
        title: "Strategic advisory",
        description:
          "Monthly review with a senior advisor covering KPIs, unit economics, fundraising readiness, and the financial decisions ahead.",
      },
      {
        title: "Audit & investor ready",
        description:
          "Clean books, documented controls, and audit-ready records so due diligence and year-end audit are painless, not panic.",
      },
    ],
    process: [
      {
        title: "Onboarding",
        duration: "Week 1-2",
        description:
          "System setup (QuickBooks, Xero, NetSuite), chart of accounts design, historical transaction migration, and baseline close.",
      },
      {
        title: "Monthly close",
        duration: "Ongoing",
        description:
          "Monthly close delivered by the 10th business day — P&L, balance sheet, cash flow, and management reporting.",
      },
      {
        title: "Compliance calendar",
        duration: "Ongoing",
        description:
          "Compliance calendar tracked end-to-end — payroll, tax filings, statutory reports — with proactive deadline alerts.",
      },
      {
        title: "Forecast & advisory",
        duration: "Monthly",
        description:
          "Rolling cash flow forecast updated monthly, plus a monthly review call with a senior advisor covering KPIs and decisions ahead.",
      },
      {
        title: "Audit & diligence",
        duration: "As needed",
        description:
          "Audit prep, investor diligence support, and clean documentation when fundraising, acquisition, or year-end audit lands.",
      },
    ],
    benefits: [
      {
        metric: "10th",
        label: "Business-day close",
        description:
          "Monthly books closed by the 10th business day — never a quarter-end scramble.",
      },
      {
        metric: "0",
        label: "Missed compliance deadlines",
        description:
          "Tracked compliance calendar means every filing, every payroll, every statutory report on time.",
      },
      {
        metric: "13 wks",
        label: "Rolling cash forecast",
        description:
          "13-week rolling forecast with burn rate and runway scenarios — always know when you need to raise or cut.",
      },
      {
        metric: "100%",
        label: "Audit-ready records",
        description:
          "Clean books and documented controls make due diligence and year-end audit painless.",
      },
    ],
    faqs: (n) => [
      {
        q: `What does ${n.toLowerCase()} include month-to-month?`,
        a: `${n} includes a monthly close delivered by the 10th business day (P&L, balance sheet, cash flow, and management reporting), ongoing compliance calendar management (payroll, tax filings, statutory reports — never a missed deadline), a rolling 13-week cash flow forecast updated monthly, and a monthly review call with a senior advisor covering KPIs, unit economics, and the financial decisions ahead. Books, compliance, and advisory in one accountable engagement.`,
      },
      {
        q: `How does ${n.toLowerCase()} work with our existing accounting software?`,
        a: `We work in your existing stack — QuickBooks Online, Xero, NetSuite, Zoho Books, Sage Intacct, or custom ERPs. Onboarding includes chart of accounts design (or audit and cleanup of your existing one), historical transaction migration with validation, and a baseline close so the books are clean from day one. You always own the system and the data; we operate it.`,
      },
      {
        q: `Can ${n.toLowerCase()} support us through fundraising and due diligence?`,
        a: `Yes — this is a core use case. We produce clean books, audit-ready records, documented internal controls, and the supporting schedules investors and acquirers request during diligence: revenue recognition detail, customer cohorts, cap table, burn history, and forward financials. We coordinate directly with your due diligence data room and respond to investor Q&A. Most clients use us as the single accountable finance partner from seed through Series B.`,
      },
      {
        q: `How does ${n.toLowerCase()} differ from a traditional CPA firm?`,
        a: `Three differences: we close monthly by the 10th business day (traditional firms close 15-30 days after month-end), we operate in your accounting system with you (traditional firms take the books offline and return a PDF), and we pair bookkeeping with strategic advisory (traditional firms deliver compliance only). You get a senior advisor reviewing your numbers monthly, not just a staff accountant preparing a tax return once a year.`,
      },
      {
        q: `What does ${n.toLowerCase()} cost?`,
        a: `Pricing is a monthly retainer ($1.5K-$8K depending on transaction volume, entity complexity, and number of entities) covering bookkeeping, monthly close, compliance calendar, cash forecast, and advisory calls. One-time onboarding ($2K-$10K) covers system setup, chart of accounts design, and historical migration. Fundraising and audit support is billed as a fixed-fee project scoped to the diligence scope. Book a scoping call for a quote tailored to your stage.`,
      },
      {
        q: `Do you provide ${n.toLowerCase()} for startups at our stage?`,
        a: `Yes — we work with companies from pre-revenue through Series B and beyond. Pre-revenue clients typically need entity setup, chart of accounts, cap table management, and runway forecasting. Seed and Series A clients need monthly close, KPI tracking, board reporting, and fundraising support. Series B+ clients need multi-entity consolidation, revenue recognition (ASC 606), audit prep, and fractional CFO advisory. The engagement scales with your stage.`,
      },
    ],
  },

  // ── 9. Branding & Marketing Strategy ──
  "branding-marketing-strategy": {
    capabilities: (n) => [
      {
        title: "Brand audit & market research",
        description: `${n} opens with a brand audit — current positioning, perception gaps, competitive landscape, and market opportunity sizing.`,
      },
      {
        title: "Strategic positioning",
        description:
          "Strategic root positioning that defines who the brand is for, what it stands for, and how it differs — the foundation every asset builds on.",
      },
      {
        title: "Identity & narrative design",
        description:
          "Brand identity, voice, and narrative built from the positioning — name, logo, tagline, story, and the verbal/visual system that carries them.",
      },
      {
        title: "Go-to-market activation",
        description:
          "Activation plan covering channels, content cadence, launch sequence, and the metrics that prove the brand is landing with its audience.",
      },
      {
        title: "Emotional connection & loyalty",
        description:
          "Programs that build emotional attachment — community, content, experiences — so customers stay for the brand, not just the product.",
      },
      {
        title: "Measurement & evolution",
        description:
          "Brand health tracking (awareness, consideration, NPS, share of voice) and quarterly evolution reviews so the brand stays relevant as the market moves.",
      },
    ],
    process: [
      {
        title: "Audit & research",
        duration: "Weeks 1-3",
        description:
          "Brand audit, stakeholder interviews, customer research, and competitive analysis. Quantified baseline of current perception and market opportunity.",
      },
      {
        title: "Positioning",
        duration: "Weeks 4-5",
        description:
          "Strategic root positioning workshop — who the brand is for, what it stands for, how it differs. Signed off by leadership before any creative work.",
      },
      {
        title: "Identity & narrative",
        duration: "Weeks 6-9",
        description:
          "Brand identity, voice, and narrative built from the positioning — name, logo, tagline, story, and the verbal/visual system.",
      },
      {
        title: "Activation plan",
        duration: "Weeks 10-11",
        description:
          "Go-to-market activation plan covering channels, content cadence, launch sequence, and the metrics that prove the brand is landing.",
      },
      {
        title: "Launch & tracking",
        duration: "Weeks 12+",
        description:
          "Brand launch execution, ongoing brand health tracking, and quarterly evolution reviews to keep the brand relevant as the market moves.",
      },
    ],
    benefits: [
      {
        metric: "3x",
        label: "Brand awareness lift",
        description:
          "Strategic positioning and consistent activation lift unaided awareness within two quarters of launch.",
      },
      {
        metric: "28%",
        label: "Price premium supported",
        description:
          "Differentiated positioning supports a price premium vs. category average — brand becomes a margin lever.",
      },
      {
        metric: "4.5x",
        label: "Customer lifetime value",
        description:
          "Emotional connection and loyalty programs lift LTV by retaining customers for the brand, not just the product.",
      },
      {
        metric: "100%",
        label: "Brand-health tracked",
        description:
          "Awareness, consideration, NPS, and share of voice tracked quarterly — the brand is managed, not launched-and-forgotten.",
      },
    ],
    faqs: (n) => [
      {
        q: `What does ${n.toLowerCase()} include end-to-end?`,
        a: `${n} covers the full brand lifecycle: a brand audit with stakeholder and customer research to quantify current perception, strategic root positioning that defines who the brand is for and how it differs, identity and narrative design (name, logo, voice, story), go-to-market activation plan covering channels and launch sequence, and ongoing brand health tracking with quarterly evolution reviews. Strategy, creative, and measurement in one accountable engagement.`,
      },
      {
        q: `How long does ${n.toLowerCase()} take from kickoff to launch?`,
        a: `A full engagement runs 11-12 weeks to a launch-ready brand: three weeks of audit and research, two weeks of positioning workshop and sign-off, four weeks of identity and narrative design, two weeks of activation plan, then launch execution. Rebranding engagements for established companies with existing assets and stakeholder consensus can compress to 8-9 weeks; full brand builds for early-stage companies can extend to 14-16 weeks when naming and identity exploration is open-ended.`,
      },
      {
        q: `How does ${n.toLowerCase()} differ from a logo design or visual identity project?`,
        a: `A logo project produces a mark. ${n} produces a strategic foundation — positioning, audience, differentiation, narrative — that the identity expresses. Without positioning, a logo is decoration; with positioning, the identity becomes a competitive weapon. Every engagement starts with research and positioning before any creative work begins, so the identity, voice, and activation plan all serve a defined strategic intent rather than subjective aesthetic preference.`,
      },
      {
        q: `Does ${n.toLowerCase()} include market research and competitor analysis?`,
        a: `Yes — every engagement includes a quantified brand audit covering stakeholder interviews, customer research (surveys, interviews, or focus groups depending on scope), and competitor analysis (positioning, messaging, share of voice, perceived strengths and weaknesses). The output is a baseline document that informs positioning decisions and becomes the benchmark for post-launch brand health tracking. Research depth scales with engagement scope.`,
      },
      {
        q: `What does ${n.toLowerCase()} cost?`,
        a: `Pricing depends on scope: positioning-only engagements start at $15K-$30K, full brand builds (audit, positioning, identity, narrative, activation plan) run $40K-$120K, and established-company rebrands with stakeholder alignment complexity run $80K-$200K. Ongoing brand health tracking and quarterly evolution reviews are a monthly retainer ($2K-$8K). Book a scoping call for a fixed-quote proposal delivered within five business days.`,
      },
      {
        q: `How do you measure brand health after ${n.toLowerCase()} launches?`,
        a: `We track four dimensions quarterly: awareness (unaided and aided recall in the target market), consideration (percentage of aware audiences who would consider purchase), loyalty (NPS and repeat purchase rate), and share of voice (relative presence vs. competitors in the category's earned and owned channels). Benchmarks are set during the audit phase, and quarterly reviews surface what's working, what needs evolution, and where to invest next.`,
      },
    ],
  },
};

// ============================================================
// FACTORY — buildServiceSpec
// Generates a full spec from a minimal input. Division template
// fills capabilities/process/benefits/faqs; explicit inputs
// override slug/shortDescription/heroSubtitle/relatedServices
// when provided (for SEO-specific tuning).
// ============================================================

interface ServiceInput {
  name: string;
  division: string;
  divisionId: string;
  shortDescription: string;
  heroSubtitle?: string;
  slug?: string;
  relatedServices?: string[];
}

function buildServiceSpec(input: ServiceInput): ServicePageSpec {
  const tpl = T[input.divisionId];
  if (!tpl) {
    throw new Error(
      `No template found for divisionId "${input.divisionId}" (service: ${input.name})`
    );
  }

  const slug = input.slug ?? slugifyServiceName(input.name);

  // Default hero subtitle: division-flavored two-line summary.
  const heroSubtitle =
    input.heroSubtitle ??
    `${input.name} helps ${divisionAudience(input.divisionId)} deliver measurable outcomes — built by senior practitioners, integrated into your stack, and backed by delivery SLAs. From scoping to rollout, one accountable partner end-to-end.`;

  return {
    slug,
    name: input.name,
    division: input.division,
    divisionId: input.divisionId,
    shortDescription: input.shortDescription,
    heroSubtitle,
    capabilities: tpl.capabilities(input.name),
    process: tpl.process,
    benefits: tpl.benefits,
    faqs: tpl.faqs(input.name, input.division),
    // relatedServices filled in after all specs are built (post-process).
    relatedServices: input.relatedServices ?? [],
  };
}

function divisionAudience(divisionId: string): string {
  switch (divisionId) {
    case "ai-workflow-automation":
      return "operations and IT leaders";
    case "custom-ai-agentic-services":
      return "customer experience, support, and operations teams";
    case "tech-programming-services":
      return "product and engineering leaders";
    case "multimedia-graphic-design":
      return "marketing and brand teams";
    case "digital-sales-ai-marketing":
      return "marketing and revenue leaders";
    case "business-enterprise-services":
      return "operations, finance, and IT leaders";
    case "consultation-solutions":
      return "executives and functional leaders";
    case "startup-accounting":
      return "founders and finance leaders";
    case "branding-marketing-strategy":
      return "founders, CMOs, and brand leaders";
    default:
      return "growth-minded teams";
  }
}

// ============================================================
// RAW SERVICE INPUTS — the 55 services, grouped by division.
// Each carries an SEO-specific shortDescription (≤160 chars,
// keyword-rich, AEO-friendly). Hero subtitles use the factory
// default unless overridden.
// ============================================================

const RAW_SERVICE_INPUTS: ServiceInput[] = [
  // ── Division 1: AI Workflow Automation ──
  {
    name: "Operations & Process Automation",
    division: "AI Workflow Automation",
    divisionId: "ai-workflow-automation",
    shortDescription:
      "Automate repetitive operations and back-office processes with AI-driven workflows. Reduce manual effort up to 62%.",
  },
  {
    name: "Digital Sales & AI Marketing Automation",
    division: "AI Workflow Automation",
    divisionId: "ai-workflow-automation",
    shortDescription:
      "End-to-end AI automation for sales and marketing pipelines — lead gen, nurture, scoring, and follow-up at scale.",
  },
  {
    name: "Data, Analytics & Decision Intelligence",
    division: "AI Workflow Automation",
    divisionId: "ai-workflow-automation",
    shortDescription:
      "AI-powered data pipelines, analytics dashboards, and decision intelligence platforms that turn data into action.",
  },
  {
    name: "Supply Chain, Procurement & Management Automation",
    division: "AI Workflow Automation",
    divisionId: "ai-workflow-automation",
    shortDescription:
      "Automate supply chain workflows, procurement approvals, and vendor management with AI — cut cycle times 45%.",
  },
  {
    name: "HR & Workforce Automation",
    division: "AI Workflow Automation",
    divisionId: "ai-workflow-automation",
    shortDescription:
      "AI automation for HR — screening, onboarding, scheduling, performance reviews, and people analytics at scale.",
  },

  // ── Division 2: Custom AI Agentic Services ──
  {
    name: "Conversational & Support Agents",
    division: "Custom AI Agentic Services",
    divisionId: "custom-ai-agentic-services",
    shortDescription:
      "Custom AI agents for customer support — resolve, escalate, and learn across every channel. 70% auto-resolution.",
  },
  {
    name: "Integration & Orchestration Agents",
    division: "Custom AI Agentic Services",
    divisionId: "custom-ai-agentic-services",
    shortDescription:
      "AI agents that integrate and orchestrate across your CRM, ERP, and internal tools via function-calling.",
  },
  {
    name: "Analytical & Decision-Making Agents",
    division: "Custom AI Agentic Services",
    divisionId: "custom-ai-agentic-services",
    shortDescription:
      "AI agents that analyze data, surface insights, and make recommendations autonomously with audit trails.",
  },
  {
    name: "Process & Task Automation Agents",
    division: "Custom AI Agentic Services",
    divisionId: "custom-ai-agentic-services",
    shortDescription:
      "Purpose-built AI agents that execute multi-step business processes end-to-end with guardrails and approvals.",
  },
  {
    name: "Multi-Agent Systems & Agent Fleets",
    division: "Custom AI Agentic Services",
    divisionId: "custom-ai-agentic-services",
    shortDescription:
      "Governed fleets of cooperating AI agents for enterprise-scale automation across functions and tools.",
  },

  // ── Division 3: Tech & Programming Services ──
  {
    name: "Ready-to-Use Tools & SaaS Apps",
    division: "Tech & Programming Services",
    divisionId: "tech-programming-services",
    shortDescription:
      "Pre-built SaaS tools and applications, customized and deployed for your business — production-ready in weeks.",
  },
  {
    name: "Cloud Hosting & Deployment",
    division: "Tech & Programming Services",
    divisionId: "tech-programming-services",
    shortDescription:
      "Cloud hosting, deployment automation, and infrastructure management on AWS, GCP, and Azure — 99.9% uptime.",
  },
  {
    name: "Mobile Apps Design & Development",
    division: "Tech & Programming Services",
    divisionId: "tech-programming-services",
    shortDescription:
      "iOS and Android mobile app design and development built for performance, scale, and app store success.",
  },
  {
    name: "Software Design & Development",
    division: "Tech & Programming Services",
    divisionId: "tech-programming-services",
    shortDescription:
      "Custom software products, internal systems, and enterprise applications built by senior engineering teams.",
  },
  {
    name: "API Development & Integration",
    division: "Tech & Programming Services",
    divisionId: "tech-programming-services",
    shortDescription:
      "API strategy, development, and integration services for connecting your entire stack with documented contracts.",
  },

  // ── Division 4: Multimedia & Graphic Design ──
  {
    name: "Graphic Design & Branding",
    division: "Multimedia & Graphic Design",
    divisionId: "multimedia-graphic-design",
    shortDescription:
      "Brand identity, logo design, and graphic design services for digital and print — built to brand system.",
  },
  {
    name: "Multimedia Production Services",
    division: "Multimedia & Graphic Design",
    divisionId: "multimedia-graphic-design",
    shortDescription:
      "Full-cycle multimedia production — video, audio, motion graphics, and animation at production quality.",
  },
  {
    name: "Visual Content & Marketing Assets",
    division: "Multimedia & Graphic Design",
    divisionId: "multimedia-graphic-design",
    shortDescription:
      "High-volume visual content and marketing assets for paid and organic campaigns — 5x variant speed.",
  },
  {
    name: "UI/UX & Digital Design Services",
    division: "Multimedia & Graphic Design",
    divisionId: "multimedia-graphic-design",
    shortDescription:
      "Research-driven UI/UX design for web, mobile, and SaaS products — WCAG 2.1 AA accessible by default.",
  },
  {
    name: "AI Video & Audio Production",
    division: "Multimedia & Graphic Design",
    divisionId: "multimedia-graphic-design",
    shortDescription:
      "AI-generated video ads, synthetic voiceovers, music, and podcast production — scaled output, human-curated.",
  },

  // ── Division 5: Digital Sales & AI Marketing ──
  {
    name: "AI-Driven Marketing & Personalization",
    division: "Digital Sales & AI Marketing",
    divisionId: "digital-sales-ai-marketing",
    shortDescription:
      "AI-powered marketing personalization across email, web, and ad channels — 5x personalization scale.",
  },
  {
    name: "AI-Powered Sales Enablement",
    division: "Digital Sales & AI Marketing",
    divisionId: "digital-sales-ai-marketing",
    shortDescription:
      "AI SDRs, sales intelligence, and outbound pipeline engines for revenue teams — 3.8x pipeline lift.",
  },
  {
    name: "Conversational & Engagement Automation",
    division: "Digital Sales & AI Marketing",
    divisionId: "digital-sales-ai-marketing",
    shortDescription:
      "Chatbots, conversational marketing, and customer engagement automation across web, chat, and messaging.",
  },
  {
    name: "Analytics, Insights & ROI Optimization",
    division: "Digital Sales & AI Marketing",
    divisionId: "digital-sales-ai-marketing",
    shortDescription:
      "Marketing analytics, multi-touch attribution, and ROI optimization for every channel — 42% CAC reduction.",
  },
  {
    name: "SEO & Answer Engine Optimization",
    division: "Digital Sales & AI Marketing",
    divisionId: "digital-sales-ai-marketing",
    shortDescription:
      "SEO and AEO (Answer Engine Optimization) for Google, Perplexity, ChatGPT, and AI overviews — own the answer.",
  },

  // ── Division 6: Business & Enterprise Services ──
  {
    name: "Process & Workflow Automation",
    division: "Business & Enterprise Services",
    divisionId: "business-enterprise-services",
    shortDescription:
      "Automate business processes and workflows across operations, finance, and admin — cut cycle times 45%.",
  },
  {
    name: "Customer, Sales & Experience Management",
    division: "Business & Enterprise Services",
    divisionId: "business-enterprise-services",
    shortDescription:
      "CRM, CX programs, and customer experience management for enterprise teams — 92% adoption at 90 days.",
  },
  {
    name: "Data, Analytics & Business Intelligence",
    division: "Business & Enterprise Services",
    divisionId: "business-enterprise-services",
    shortDescription:
      "Data pipelines, warehouses, BI dashboards, and decision analytics platforms — one source of truth.",
  },
  {
    name: "Compliance, Security & Risk Management",
    division: "Business & Enterprise Services",
    divisionId: "business-enterprise-services",
    shortDescription:
      "Cybersecurity, compliance programs, and risk management for regulated industries — SOC 2, HIPAA, PCI.",
  },
  {
    name: "CRM & ERP Implementation",
    division: "Business & Enterprise Services",
    divisionId: "business-enterprise-services",
    shortDescription:
      "CRM and ERP selection, implementation, and integration — Salesforce, HubSpot, SAP, Oracle, NetSuite.",
  },

  // ── Division 7: Consultation & Solutions ──
  {
    name: "Operational & Performance Solutions",
    division: "Consultation & Solutions",
    divisionId: "consultation-solutions",
    shortDescription:
      "Operational consulting and performance improvement programs — diagnostic to roadmap in 8 weeks.",
  },
  {
    name: "Compliance, Risk & Governance Consulting",
    division: "Consultation & Solutions",
    divisionId: "consultation-solutions",
    shortDescription:
      "Governance, risk, and compliance consulting for regulated and enterprise organizations — audit-ready.",
  },
  {
    name: "Business & Strategy Consulting",
    division: "Consultation & Solutions",
    divisionId: "consultation-solutions",
    shortDescription:
      "Business strategy, market entry, and growth consulting from senior practitioners — strategy plus execution.",
  },
  {
    name: "Branding & Identity Services",
    division: "Consultation & Solutions",
    divisionId: "consultation-solutions",
    shortDescription:
      "Brand strategy, identity design, and positioning for startups and enterprises — strategic root positioning.",
  },
  {
    name: "Digital Transformation Consulting",
    division: "Consultation & Solutions",
    divisionId: "consultation-solutions",
    shortDescription:
      "End-to-end digital transformation strategy and execution for enterprise modernization — pilot-proven.",
  },

  // ── Division 8: Startup & Accounting ──
  {
    name: "Bookkeeping & Financial Management",
    division: "Startup & Accounting",
    divisionId: "startup-accounting",
    shortDescription:
      "Bookkeeping automation, financial reporting, and day-to-day financial management — close by 10th.",
  },
  {
    name: "Financial Advisory & Growth Planning",
    division: "Startup & Accounting",
    divisionId: "startup-accounting",
    shortDescription:
      "Financial advisory, FP&A, and growth planning for startups and SMBs — 13-week rolling forecast.",
  },
  {
    name: "Business Formation & Compliance",
    division: "Startup & Accounting",
    divisionId: "startup-accounting",
    shortDescription:
      "Business formation, entity setup, and regulatory compliance for new companies — zero missed deadlines.",
  },
  {
    name: "Tax Planning & Regulatory Compliance",
    division: "Startup & Accounting",
    divisionId: "startup-accounting",
    shortDescription:
      "Tax planning, preparation, and regulatory compliance services for businesses — audit-ready records.",
  },
  {
    name: "Fractional CFO & Controller Services",
    division: "Startup & Accounting",
    divisionId: "startup-accounting",
    shortDescription:
      "Fractional CFO and controller services for startups without a full-time finance team — board-ready.",
  },

  // ── Division 9: Branding & Marketing Strategy (15 services) ──
  {
    name: "Jataye Blogs & News",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Branded blogs and news content that builds authority, supports SEO, and earns organic traffic month over month.",
  },
  {
    name: "Industries Experience",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Industry-specific brand experience programs — tailored messaging, assets, and proof for every vertical you serve.",
  },
  {
    name: "Dedicated Sales Teams",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Dedicated, brand-aligned sales teams that carry your narrative into every conversation — SDRs to closers.",
  },
  {
    name: "Market Research & Analysts",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Market research and analyst programs that quantify opportunity, validate positioning, and de-risk brand bets.",
  },
  {
    name: "Marketing Specialist",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Dedicated marketing specialists embedded in your team — channel owners who execute the brand strategy daily.",
  },
  {
    name: "Humanity, Ethic & Emotion of Brand",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Define and express the humanity, ethics, and emotion of your brand — the why that earns lasting loyalty.",
  },
  {
    name: "Strategic Root Positioning of Brand",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Strategic root positioning that defines who the brand is for, what it stands for, and how it differs.",
  },
  {
    name: "Emotional Attach Brand Connection",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Programs that build emotional attachment — community, content, experiences — so customers stay for the brand.",
  },
  {
    name: "Market Segment Differentiation",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Differentiate your brand across market segments — tailored positioning that wins each audience you serve.",
  },
  {
    name: "Faster Time-to-Market",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Brand systems and activation plans built for faster time-to-market — launch in weeks, not quarters.",
  },
  {
    name: "Brand Identity Design & Strategy Development",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Brand identity design and strategy development — name, logo, voice, and visual system built from positioning.",
  },
  {
    name: "Brand Positioning & Rebranding Services",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Brand positioning and rebranding services for established companies — reposition without losing equity.",
  },
  {
    name: "Build Social Media Branding",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Build social media branding that's consistent, on-voice, and built for each platform — community-first.",
  },
  {
    name: "Digital Marketing Integration & Enhancement",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Integrate and enhance your brand across every digital marketing channel — one brand, every touchpoint.",
  },
  {
    name: "Competitor Analysis & Market Reach",
    division: "Branding & Marketing Strategy",
    divisionId: "branding-marketing-strategy",
    shortDescription:
      "Competitor analysis and market reach programs — map the field, find the gap, and own the whitespace.",
  },
];

// ============================================================
// BUILD — produce all 55 specs, then cross-link related services.
// Each service gets 2 same-division siblings + 1 cross-division
// peer (deterministic, deterministic by index — no randomness).
// ============================================================

const BUILT_SPECS: ServicePageSpec[] = RAW_SERVICE_INPUTS.map(buildServiceSpec);

// Index by slug for O(1) lookup and cross-linking.
const SPECS_BY_SLUG = new Map<string, ServicePageSpec>(
  BUILT_SPECS.map((s) => [s.slug, s])
);

// Group slugs by division for "related" computation.
const SLUGS_BY_DIVISION = new Map<string, string[]>();
for (const spec of BUILT_SPECS) {
  const arr = SLUGS_BY_DIVISION.get(spec.divisionId) ?? [];
  arr.push(spec.slug);
  SLUGS_BY_DIVISION.set(spec.divisionId, arr);
}

// Cross-division peer map: pick a stable sibling division per
// division to source the third "related" link.
const PEER_DIVISION: Record<string, string> = {
  "ai-workflow-automation": "custom-ai-agentic-services",
  "custom-ai-agentic-services": "ai-workflow-automation",
  "tech-programming-services": "business-enterprise-services",
  "multimedia-graphic-design": "branding-marketing-strategy",
  "digital-sales-ai-marketing": "branding-marketing-strategy",
  "business-enterprise-services": "tech-programming-services",
  "consultation-solutions": "startup-accounting",
  "startup-accounting": "consultation-solutions",
  "branding-marketing-strategy": "digital-sales-ai-marketing",
};

// Fill relatedServices on every spec: next 2 in same division
// (circular) + 1 from the peer division (circular by index).
for (let i = 0; i < BUILT_SPECS.length; i++) {
  const spec = BUILT_SPECS[i];
  if (spec.relatedServices.length > 0) continue; // explicit override

  const sameDiv = SLUGS_BY_DIVISION.get(spec.divisionId) ?? [];
  const sameDivIdx = sameDiv.indexOf(spec.slug);
  const siblingA = sameDiv[(sameDivIdx + 1) % sameDiv.length];
  const siblingB =
    sameDiv.length > 2
      ? sameDiv[(sameDivIdx + 2) % sameDiv.length]
      : sameDiv[(sameDivIdx + 1) % sameDiv.length];

  const peerDivId = PEER_DIVISION[spec.divisionId];
  const peerSlugs = SLUGS_BY_DIVISION.get(peerDivId) ?? [];
  const peerSlug = peerSlugs[i % peerSlugs.length];

  // Dedupe + cap at 3, fall back to another same-division sibling
  // if peer slug collides with this service's own slug.
  const related = Array.from(
    new Set([siblingA, siblingB, peerSlug].filter((s) => s && s !== spec.slug))
  ).slice(0, 3);

  spec.relatedServices = related;
}

// ============================================================
// EXPORTS
// ============================================================

/** All 55 service page specs, in directory order. */
export const SERVICE_PAGES: readonly ServicePageSpec[] = Object.freeze(
  BUILT_SPECS
);

/** All 55 slugs — used by generateStaticParams. */
export const SERVICE_PAGE_SLUGS: readonly string[] = Object.freeze(
  BUILT_SPECS.map((s) => s.slug)
);

/** O(1) lookup by slug — used by the route + sitemap. */
export function getServicePage(slug: string): ServicePageSpec | undefined {
  return SPECS_BY_SLUG.get(slug);
}

/** All specs in a given division. */
export function servicePagesForDivision(
  divisionId: string
): ServicePageSpec[] {
  return BUILT_SPECS.filter((s) => s.divisionId === divisionId);
}

/** Resolve an array of slugs to specs (skipping any unknown slugs). */
export function resolveRelatedServices(
  slugs: string[]
): ServicePageSpec[] {
  return slugs
    .map((slug) => SPECS_BY_SLUG.get(slug))
    .filter((s): s is ServicePageSpec => Boolean(s));
}
