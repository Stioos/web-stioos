import type { DivisionSpec } from "../division-types";

// ============================================================
// 06 — CLOUD DEVOPS & MLOPS (cat-cloud-devops-mlops)
// Accent: amber/orange. Subcategories: cloud-migration /
// kubernetes-container-platforms / devops-automation-ci-cd /
// mlops-ai-infrastructure / finops-cost-optimization /
// cloud-security-devsecops.
// ============================================================

export const CLOUD_SPEC: DivisionSpec = {
  categoryId: "cat-cloud-devops-mlops",
  slug: "cloud-devops-mlops",

  // 01 — Hero
  hero: {
    eyebrow: "Cloud DevOps & MLOps",
    title: "Resilient, cost-aware platforms that",
    highlight: "ship faster, scale further, cost less.",
    subtitle:
      "Cloud migration and modernization, production Kubernetes and container platforms, DevOps automation and CI/CD, MLOps and AI infrastructure, FinOps cost optimization, and DevSecOps — delivered by AWS, Azure, and GCP certified platform engineers on measurable outcome contracts.",
    primaryCta: { label: "Request a platform assessment", href: "/contact" },
    secondaryCta: { label: "Browse 42 cloud & DevOps services", href: "/marketplace?category=cloud-devops-mlops" },
    stats: [
      { value: "42", label: "Cloud & DevOps services in catalog" },
      { value: "99.99%", label: "Production uptime SLA" },
      { value: "−38%", label: "Avg. cloud spend reduction" },
    ],
  },

  // 02 — Trust bar
  trustBadges: [
    "AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform",
    "ArgoCD", "GitHub Actions", "Prometheus", "Grafana", "Datadog", "HashiCorp Vault",
  ],

  // 03 — KPI band
  kpis: [
    { value: "−38%", label: "Avg. reduction in cloud spend", trend: "−$460K/qtr", spark: [10, 22, 28, 31, 34, 36, 38], icon: "TrendingDown" },
    { value: "4.8x", label: "Increase in deploy frequency", trend: "+380%", spark: [8, 14, 21, 28, 34, 41, 48], icon: "Zap" },
    { value: "99.99%", label: "Production platform uptime", trend: "+4 nines", spark: [99.90, 99.93, 99.95, 99.97, 99.98, 99.99, 99.99], icon: "BadgeCheck" },
    { value: "−73%", label: "Reduction in mean time to recover", trend: "−2.9 hrs", spark: [240, 190, 150, 120, 95, 78, 65], icon: "Gauge" },
  ],

  // 04 — Pain points
  painPoints: [
    {
      icon: "Coins",
      title: "Cloud spend grows faster than revenue",
      description: "Your AWS bill is up 34% year over year while headcount barely moved. Nobody owns the cost, nobody can attribute it to a team, and every reservation deadline passes unclaimed.",
      impact: "+34% YoY cost",
    },
    {
      icon: "Timer",
      title: "Releases are slow, manual, and feared",
      description: "A production deploy takes three hours and a war room. Releases happen every two weeks because nobody dares more often. Hotfixes ship faster than features, which is exactly backwards.",
      impact: "1 deploy / 2 wks",
    },
    {
      icon: "RefreshCw",
      title: "Infrastructure is fragile and snowflaked",
      description: "Every environment is hand-built, undocumented, and slightly different. An outage at 2 AM depends on whoever provisioned the box two years ago — who left in March.",
      impact: "4.2 hrs MTTR",
    },
    {
      icon: "Lock",
      title: "Security and compliance gaps you can't see",
      description: "Audit prep is a quarterly fire drill. Secrets live in env files, IAM is wide open in three accounts, and nobody can prove the production cluster passed a CIS benchmark.",
      impact: "2 failed audits",
    },
  ],

  // 05 — Solution overview
  solution: {
    eyebrow: "The STIOOS approach",
    title: "One accountable platform partner — from migration to MLOps to FinOps",
    body: "We don't stand up a cluster and disappear. STIOOS designs the platform, codifies it in Terraform, ships it through GitOps, instruments it end-to-end, and operates it 24/7 with certified SREs. Every engagement ships with an SLO, a cost baseline, and a measurable outcome contract — so the platform keeps getting better and the bill keeps going down.",
    capabilities: [
      "Production-grade platform architecture (not a hello-world cluster)",
      "Multi-cloud: AWS, Azure, GCP with certified platform engineers",
      "Everything-as-code: Terraform, ArgoCD GitOps, Helm, Packer",
      "Observability: Prometheus, Grafana, Datadog, OpenTelemetry tracing",
      "FinOps with cost attribution down to the team and workload",
      "24/7 SRE on-call with SLO-backed operations and runbooks",
    ],
    visual: "dashboard",
  },

  // 06 — Capabilities bento (links to subcategories)
  capabilities: [
    { icon: "CloudUpload", title: "Cloud Migration & Modernization", description: "Lift-shift, refactor, and replatform workloads onto AWS, Azure, and GCP landing zones.", metric: "10 services", span: "lg", subslug: "cloud-migration-modernization" },
    { icon: "Container", title: "Kubernetes & Container Platforms", description: "Production EKS / GKE / AKS platforms with GitOps, service mesh, and autoscaling.", metric: "8 services", span: "md", subslug: "kubernetes-container-platforms" },
    { icon: "GitBranch", title: "DevOps Automation & CI/CD", description: "GitHub Actions, ArgoCD, and Terraform pipelines that ship every commit safely.", metric: "8 services", span: "sm", subslug: "devops-automation-ci-cd" },
    { icon: "BrainCircuit", title: "MLOps & AI Infrastructure", description: "MLflow, Kubeflow, and Ray training and serving platforms on GPU clusters.", metric: "6 services", span: "sm", subslug: "mlops-ai-infrastructure" },
    { icon: "PiggyBank", title: "FinOps & Cost Optimization", description: "Cost attribution, reservation strategy, and rightsizing that pays for itself.", metric: "4 services", span: "md", subslug: "finops-cost-optimization" },
    { icon: "ShieldCheck", title: "Cloud Security & DevSecOps", description: "DevSecOps pipelines, IAM hardening, Vault secrets, and CIS/HIPAA/SOC 2 controls.", metric: "6 services", span: "sm", subslug: "cloud-security-devsecops" },
  ],

  // 07 — Process timeline
  process: {
    title: "Platform delivery methodology",
    subtitle: "A repeatable five-phase path from cloud assessment to a production platform your team can operate confidently — with SLOs and a cost baseline from day one.",
    phases: [
      { phase: "01", title: "Discover & assess", description: "We inventory workloads, baseline cost and performance, and score cloud readiness across your estate.", duration: "Week 1–2", deliverables: ["Workload inventory", "Cost baseline report", "Cloud readiness scorecard"] },
      { phase: "02", title: "Design & architect", description: "Landing zone, platform architecture, network topology, and IaC foundations designed to your SLOs.", duration: "Week 3–4", deliverables: ["Landing zone design", "Platform architecture", "Terraform module skeleton"] },
      { phase: "03", title: "Build & migrate", description: "We codify the platform in Terraform, wire GitOps pipelines, and migrate workloads in waves.", duration: "Week 5–10", deliverables: ["Production platform", "CI/CD + GitOps pipelines", "Wave migration plan"] },
      { phase: "04", title: "Harden & optimize", description: "Security hardening, observability rollout, and a first FinOps optimization pass before handoff.", duration: "Week 11–12", deliverables: ["Security review", "Observability dashboards", "FinOps quick wins"] },
      { phase: "05", title: "Operate & evolve", description: "SRE on-call, SLO reviews, and continuous cost and reliability tuning on a quarterly cadence.", duration: "Ongoing", deliverables: ["24/7 SRE on-call", "Monthly SLO review", "Quarterly cost report"] },
    ],
  },

  // 08 — Tech radar
  techRadar: {
    title: "The platform stack we ship to production",
    subtitle: "Every technology below is in active production across STIOOS engagements. The radar shows where each sits on the adopt-to-hold spectrum.",
    rings: [
      { label: "Adopt" },
      { label: "Trial" },
      { label: "Assess" },
      { label: "Hold" },
    ],
    nodes: [
      { name: "Kubernetes", ring: 0, angle: -70 },
      { name: "AWS", ring: 0, angle: -20 },
      { name: "Terraform", ring: 0, angle: 40 },
      { name: "ArgoCD", ring: 0, angle: 130 },
      { name: "Azure", ring: 1, angle: 110 },
      { name: "GitHub Actions", ring: 1, angle: 160 },
      { name: "Helm", ring: 1, angle: -140 },
      { name: "Prometheus", ring: 1, angle: 70 },
      { name: "Grafana", ring: 1, angle: 90 },
      { name: "Datadog", ring: 1, angle: -100 },
      { name: "Vault", ring: 2, angle: 20 },
      { name: "MLflow", ring: 2, angle: -50 },
    ],
  },

  // 09 — Before / after impact
  impact: {
    title: "Quarter-one impact",
    subtitle: "Representative results from STIOOS platform engagements in the first 90 days of production. Your numbers will vary based on workload complexity and cloud maturity.",
    metrics: [
      { label: "Mean time to deploy (per release)", before: 180, after: 12, beforeLabel: "3.0 hrs", afterLabel: "12 min", unit: "min" },
      { label: "Production deploys per week", before: 2, after: 38, beforeLabel: "2 / wk", afterLabel: "38 / wk", unit: "/wk" },
      { label: "Cloud spend vs. quarterly baseline", before: 100, after: 62, beforeLabel: "Baseline", afterLabel: "−38%", unit: "%" },
      { label: "Mean time to recovery (MTTR)", before: 240, after: 65, beforeLabel: "4.0 hrs", afterLabel: "65 min", unit: "min" },
    ],
  },

  // 10 — Spotlight services
  spotlightServices: [
    { name: "AWS Landing Zone & Enterprise Cloud Foundation", tagline: "Multi-account landing zone with Control Tower, IAM, networking, and Terraform IaC governance.", tags: ["AWS", "Terraform", "Control Tower"], metric: { value: "99.99%", label: "uptime SLA" }, href: "/marketplace?category=cloud-devops-mlops" },
    { name: "Production Kubernetes Platform on EKS / GKE / AKS", tagline: "GitOps-managed clusters with ArgoCD, Helm, Istio mesh, and autoscaling baked in.", tags: ["Kubernetes", "ArgoCD", "Istio"], metric: { value: "4.8x", label: "deploy frequency" }, href: "/marketplace?category=cloud-devops-mlops" },
    { name: "FinOps Cost Optimization Program", tagline: "Cost attribution, reservation strategy, rightsizing, and Kubecost telemetry that pays for itself.", tags: ["AWS Cost Explorer", "Kubecost", "FinOps"], metric: { value: "−38%", label: "cloud spend" }, href: "/marketplace?category=cloud-devops-mlops" },
  ],

  // 11 — Outcomes gauges
  outcomes: {
    central: { value: 96, label: "Overall platform reliability score", caption: "Across 140+ production clusters operated" },
    gauges: [
      { value: 98, label: "SLO adherence" },
      { value: 94, label: "Deploy success rate" },
      { value: 92, label: "Infrastructure-as-Code coverage" },
      { value: 88, label: "Cost efficiency vs. baseline" },
    ],
  },

  // 12 — Case study
  caseStudy: {
    industry: "FinTech · regulated payments · $1.2M/mo cloud spend",
    title: "How a fintech cut cloud spend 38% in one quarter",
    challenge: "A regulated payments fintech had scaled to $1.2M/month on AWS, growing 12% month over month with no end in sight. Deploys took three hours and a war room, MTTR sat at 4 hours, and the platform team had no observability past an alerting email nobody trusted. An upcoming SOC 2 audit looked like a likely miss.",
    solution: "STIOOS rebuilt the platform on EKS with a Terraform-coded landing zone, ArgoCD GitOps for every workload, Prometheus and Grafana for full-stack observability, and Kubecost for workload-level cost attribution. We negotiated committed-use reservations, rightsized 240 overprovisioned instances, and moved stateless services to spot — all behind a Vault-backed secrets layer and a hardened DevSecOps pipeline.",
    results: [
      { value: "−38%", label: "Cloud spend reduction in one quarter" },
      { value: "4.8x", label: "Increase in deploy frequency" },
      { value: "−73%", label: "Reduction in MTTR (4.0 hrs → 65 min)" },
    ],
    quote: "We saved $460K in one quarter and started shipping four times a day instead of once a fortnight. The SOC 2 audit passed clean. I finally have a platform I trust at 2 AM.",
    author: "VP of Platform Engineering",
    role: "FinTech · regulated payments",
  },

  // 13 — Comparison table
  comparison: {
    title: "Why teams choose STIOOS",
    subtitle: "How STIOOS platform engagements compare to the alternatives teams typically evaluate.",
    columns: ["In-house team", "Cloud managed services", "Consultancy", "STIOOS"],
    rows: [
      { criterion: "AWS / Azure / GCP certified platform engineers", values: ["partial", "partial", "partial", "yes"] },
      { criterion: "Everything-as-code: Terraform + GitOps (ArgoCD)", values: ["partial", "no", "partial", "yes"] },
      { criterion: "Production Kubernetes on EKS / GKE / AKS", values: ["partial", "partial", "partial", "yes"] },
      { criterion: "Observability: Prometheus / Grafana / Datadog", values: ["partial", "partial", "partial", "yes"] },
      { criterion: "FinOps program with team-level cost attribution", values: ["no", "no", "partial", "yes"] },
      { criterion: "24/7 SRE on-call with SLO-backed SLA", values: ["no", "yes", "no", "yes"] },
    ],
  },

  // 14 — Pricing tiers
  pricing: {
    title: "Engagement models",
    subtitle: "Three ways to engage, all with a transparent scope and a measurable outcome. No vague retainers.",
    tiers: [
      {
        name: "Foundation", price: "$18K", period: "project", description: "One cloud foundation or platform build, handed off to your team.",
        features: ["Landing zone + IaC modules", "1 production Kubernetes cluster", "CI/CD + GitOps pipeline", "Observability stack", "30-day handoff support", "Launch runbook"],
        popular: false, cta: "Start a Foundation project",
      },
      {
        name: "Operate", price: "$14K", period: "month", description: "A production platform operated and optimized continuously by STIOOS SREs.",
        features: ["Up to 4 production clusters", "24/7 SRE on-call", "GitOps + IaC maintenance", "Monthly SLO review", "FinOps optimization reports", "SLA: 99.99% uptime"],
        popular: true, cta: "Start an Operate engagement",
      },
      {
        name: "Enterprise", price: "Custom", period: "program", description: "Governed multi-cloud platform programs for regulated, multi-team scale.",
        features: ["Unlimited clusters + accounts", "Multi-cloud: AWS + Azure + GCP", "SOC 2 / HIPAA / PCI controls", "Dedicated platform architect", "MLOps + GPU infrastructure", "SLA: 99.99% uptime"],
        popular: false, cta: "Talk to sales",
      },
    ],
  },

  // 15 — Industries cloud
  industries: [
    { name: "FinTech & Payments", count: 8 },
    { name: "SaaS & Technology", count: 9 },
    { name: "E-Commerce & Retail", count: 7 },
    { name: "Healthcare & Life Sciences", count: 6 },
    { name: "Gaming", count: 4 },
    { name: "Media & Streaming", count: 5 },
    { name: "Enterprise", count: 8 },
    { name: "Manufacturing", count: 4 },
    { name: "Logistics & Supply Chain", count: 4 },
    { name: "Telecom", count: 3 },
    { name: "Public Sector", count: 3 },
    { name: "Education", count: 3 },
  ],

  // 16 — Final CTA
  finalCta: {
    eyebrow: "Ready when you are",
    title: "Stop paying for infrastructure that slows you down.",
    subtitle: "Book a 30-minute platform assessment. We'll inventory one workload, baseline its cloud cost, and show you the platform changes that would ship it faster and cheaper — with a fixed-scope quote before you commit.",
    primaryCta: { label: "Book a platform assessment", href: "/contact" },
    secondaryCta: { label: "Browse cloud & DevOps services", href: "/marketplace?category=cloud-devops-mlops" },
    trustSignals: [
      "AWS / Azure / GCP certified engineers",
      "Fixed-scope foundation build",
      "30-day platform SLA",
    ],
  },
};
