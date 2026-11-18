"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  Globe,
  Layers,
  LineChart,
  MapPin,
  Megaphone,
  Quote,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Workflow,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Icon } from "@/components/shared/icon";
import { CountUpNumber, AnimatedBar } from "@/components/division/infographics";
import { ServiceCard } from "@/components/marketplace/service-card";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/data/content";
import { MarketplaceExplorer } from "@/components/home/marketplace-explorer";

// ============================================================
// HOMEPAGE — STIOOS GLOBAL
// ============================================================

// ============================================================
// OUTCOME-BASED SOLUTIONS — the six launch solutions. Instead of
// asking buyers to shop the full 305-service catalog individually,
// every capability is bundled into one accountable engagement with
// a transparent pricing model. Accents reuse the division hue
// language (violet/sky/rose/emerald/amber/fuchsia).
// ============================================================

const SOLUTIONS = [
  {
    id: "01",
    slug: "revenue-growth-as-a-service",
    icon: TrendingUp,
    name: "Revenue Growth as a Service",
    description:
      "Generate qualified leads, improve sales pipelines, automate follow-ups and help businesses convert customers.",
    charge: "Monthly retainer + performance fee",
    metric: { value: "3.8x", label: "pipeline lift" },
    tile: "bg-[#34d39926] ring-[#34d39940]",
    iconColor: "text-[#34d399]",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    glow: "rgba(52,211,153,0.20)",
    strong: "text-[#34d399]",
  },
  {
    id: "02",
    slug: "business-automation-as-a-service",
    icon: Workflow,
    name: "Business Automation as a Service",
    description:
      "Automate repetitive tasks, customer support, invoicing, reporting and internal workflows.",
    charge: "Setup + monthly subscription",
    metric: { value: "−62%", label: "manual effort" },
    tile: "bg-[#a78bfa26] ring-[#a78bfa40]",
    iconColor: "text-[#a78bfa]",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    glow: "rgba(167,139,250,0.20)",
    strong: "text-[#a78bfa]",
  },
  {
    id: "03",
    slug: "software-as-a-service",
    icon: Code2,
    name: "Software as a Service / Managed Software",
    description:
      "Build, maintain and continuously improve business applications, websites, ERP and CRM systems.",
    charge: "Monthly managed service",
    metric: { value: "3.4x", label: "release speed" },
    tile: "bg-[#38bdf826] ring-[#38bdf840]",
    iconColor: "text-[#38bdf8]",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    glow: "rgba(56,189,248,0.20)",
    strong: "text-[#38bdf8]",
  },
  {
    id: "04",
    slug: "digital-growth-as-a-service",
    icon: Megaphone,
    name: "Digital Growth as a Service",
    description:
      "Manage digital presence, SEO, advertising, content, conversion optimization and campaign performance.",
    charge: "Monthly retainer + campaign budget",
    metric: { value: "+38%", label: "organic traffic" },
    tile: "bg-[#fb718526] ring-[#fb718540]",
    iconColor: "text-[#fb7185]",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    glow: "rgba(251,113,133,0.20)",
    strong: "text-[#fb7185]",
  },
  {
    id: "05",
    slug: "results-on-delivery-as-a-service",
    icon: Trophy,
    name: "Results on Delivery as a Service",
    description:
      "Pay only for outcomes delivered — guaranteed pipeline, revenue, cost savings, and adoption targets with a performance-based engagement model.",
    charge: "Outcome-based — pay on delivery",
    metric: { value: "100%", label: "results guaranteed" },
    tile: "bg-[#fbbf2426] ring-[#fbbf2440]",
    iconColor: "text-[#fbbf24]",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    glow: "rgba(251,191,36,0.20)",
    strong: "text-[#fbbf24]",
  },
  {
    id: "06",
    slug: "ai-transformation-as-a-service",
    icon: Sparkles,
    name: "AI Transformation as a Service",
    description:
      "Assess business processes, implement AI solutions, integrate systems and continuously optimize AI adoption.",
    charge: "Transformation project + monthly support",
    metric: { value: "+38%", label: "productivity" },
    tile: "bg-[#e879f926] ring-[#e879f940]",
    iconColor: "text-[#e879f9]",
    gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    glow: "rgba(232,121,249,0.20)",
    strong: "text-[#e879f9]",
  },
];

const AI_TECH_CAPABILITIES = [
  "Custom AI Agents",
  "AI Workflow Automation",
  "AI Integrations",
  "Business Intelligence",
  "Custom Software",
  "Web Applications",
  "Mobile Applications",
  "API & Systems Integration",
  "Cloud & Deployment",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Discover",
    description: "Browse seven divisions and 42 subcategories to pinpoint the exact capability you need.",
  },
  {
    step: "02",
    title: "Compare",
    description: "Evaluate services by capabilities, deliverables, engagement models, ratings, and technologies.",
  },
  {
    step: "03",
    title: "Select",
    description: "Choose the scoped engagement that fits your goals, timeline, and budget.",
  },
  {
    step: "04",
    title: "Request & Connect",
    description: "Submit a request and receive a scoped proposal from our expert team within one business day.",
  },
  {
    step: "05",
    title: "Build & Grow",
    description: "Launch with a senior delivery team, then scale with managed support and optimization.",
  },
];

const WHY_STIOOS = [
  {
    icon: Users,
    title: "Expertise Access",
    description:
      "Work directly with senior practitioners — AI engineers, architects, strategists, and designers — vetted through hundreds of enterprise deliveries. No junior benches, no handoff churn.",
  },
  {
    icon: TrendingDown,
    title: "Cost Efficiency",
    description:
      "Scoped engagements with transparent deliverables replace slow hiring cycles and inflated retainers. Invest in outcomes and capacity, not overhead.",
  },
  {
    icon: LineChart,
    title: "Data-Driven Insights",
    description:
      "Every engagement is instrumented. Baselines, KPIs, and ROI reporting are built into delivery, so leadership sees measurable impact — not just activity.",
  },
];

const PIPELINE_NODES = [
  { icon: "Database", label: "Data Sources", meta: "CRM · ERP · Docs · APIs" },
  { icon: "Cpu", label: "AI Decisioning", meta: "Agents · Models · Rules" },
  { icon: "Workflow", label: "Automated Actions", meta: "Workflows · Integrations" },
  { icon: "BarChart3", label: "Insight Dashboards", meta: "KPIs · Alerts · Reports" },
];

const PIPELINE_STATS = [
  { label: "Throughput", value: "+38%", width: "78%" },
  { label: "Hours saved / month", value: "1,240", width: "64%" },
  { label: "Manual error rate", value: "-72%", width: "28%" },
];

export default function HomePage() {
  const homepage = useAppStore((s) => s.homepage);
  const services = useAppStore((s) => s.services);

  const publishedCount = useMemo(
    () => services.filter((s) => s.status === "published").length,
    [services]
  );

  const featuredServices = useMemo(() => {
    const published = services.filter((s) => s.status === "published");
    const featured = published.filter((s) => s.featured);
    return (featured.length > 0 ? featured : published).slice(0, 6);
  }, [services]);

  return (
    <>
      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden bg-brand-ink text-white">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 70% 20%, rgba(30,100,232,0.28), transparent 65%), radial-gradient(ellipse 45% 40% at 85% 75%, rgba(245,158,11,0.14), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 md:pt-8 lg:px-8 lg:pb-24">
          <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            {/* Copy */}
            <div>
              <div className="anim-rise-xs">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  {homepage.heroBadge}
                </span>
              </div>

              <h1
                style={{ animationDelay: "0.08s" }}
                className="anim-rise mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              >
                <span className="block">{homepage.heroTitleTop}</span>
                <span className="text-gradient-brand block">{homepage.heroTitleBottom}</span>
              </h1>

              <p
                style={{ animationDelay: "0.16s" }}
                className="anim-rise mt-6 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg"
              >
                {homepage.heroSubtitle}
              </p>

              <div
                style={{ animationDelay: "0.24s" }}
                className="anim-rise mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-12 bg-amber-500 px-7 text-base font-semibold text-brand-ink hover:bg-amber-400"
                >
                  <Link href="/marketplace">
                    {homepage.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/25 bg-transparent px-7 text-base font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/solutions">{homepage.secondaryCta}</Link>
                </Button>
              </div>

            </div>

            {/* Intelligence visual — CSS/SVG orbital diagram */}
            <div
              style={{ animationDelay: "0.2s" }}
              className="anim-pop relative mx-auto hidden aspect-square w-full max-w-[520px] sm:block"
              aria-hidden="true"
            >
              {/* Orbit rings */}
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-[13%] animate-[spin_46s_linear_infinite] rounded-full border border-dashed border-white/15" />
              <div className="absolute inset-[27%] rounded-full border border-white/[0.08]" />

              {/* Glow core */}
              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/25 blur-3xl" />

              {/* Central core node */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-white/15 bg-brand-navy/90 shadow-2xl shadow-blue-900/40 backdrop-blur">
                  <span className="absolute -inset-1 -z-10 animate-ping rounded-2xl bg-blue-500/10" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-amber-500 shadow-lg shadow-amber-500/20">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Intelligence Core
                </p>
              </div>

              {/* Orbiting nodes */}
              <OrbitNode className="left-[6%] top-[16%]" icon="Bot" label="AI Agents" delay={0} />
              <OrbitNode className="right-[2%] top-[34%]" icon="Workflow" label="Automation" delay={0.6} />
              <OrbitNode className="bottom-[14%] right-[12%]" icon="BarChart3" label="Data & BI" delay={1.2} />
              <OrbitNode className="bottom-[6%] left-[22%]" icon="Code2" label="Engineering" delay={1.8} />
              <OrbitNode className="left-[0%] top-[52%]" icon="ShieldCheck" label="Governance" delay={2.4} />
              <OrbitNode className="right-[18%] top-[4%]" icon="Target" label="Growth" delay={3} />

              {/* Floating stat cards */}
              <div className="anim-float absolute right-[4%] top-[62%] rounded-lg border border-white/12 bg-brand-navy/90 px-4 py-3 shadow-xl backdrop-blur">
                <p className="text-lg font-bold text-amber-400">4.9 / 5</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Delivery rating</p>
              </div>
              <div
                style={{ animationDelay: "1s" }}
                className="anim-float-rev absolute bottom-[26%] left-[2%] rounded-lg border border-white/12 bg-brand-navy/90 px-4 py-3 shadow-xl backdrop-blur"
              >
                <p className="text-lg font-bold text-blue-300">98.2%</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">SLA adherence</p>
              </div>
            </div>
          </div>

          {/* Trust strip removed — replaced by the Outcome-Based Solutions
              section below (user request: launch with six solutions). */}
        </div>
      </section>

      {/* ===================== STATS COUNTER BAND ===================== */}
      <section className="border-y border-border bg-brand-ink py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: 305, suffix: "", label: "Expert services", sub: "across 7 divisions", icon: "Layers" },
              { value: 7, suffix: "", label: "Solution divisions", sub: "AI to multimedia", icon: "Sparkles" },
              { value: 40, suffix: "+", label: "Technologies", sub: "from AWS to OpenAI", icon: "Cpu" },
              { value: 2, suffix: "M+", label: "Talent pool", sub: "assessed & indexed", icon: "Users" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="flex items-center gap-3">
                    <Icon name={stat.icon} className="h-6 w-6 text-amber-400" />
                    <span className="text-4xl font-bold tabular-nums text-white lg:text-5xl">
                      <CountUpNumber target={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{stat.label}</div>
                  <div className="text-xs text-slate-500">{stat.sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== OUTCOME-BASED SOLUTIONS ===================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Outcome-Based Solutions"
            title="Six solutions. Every outcome your business needs."
            description="Launch with an accountable engagement instead of shopping individual services — every STIOOS capability is bundled inside six managed solutions, each with a transparent pricing model."
          />

          {/* ═══ AURORA GRADIENT CARDS — out-of-the-box redesign ═══
              Each card is a cinematic dark tile with a vivid full-bleed
              gradient header band, a glassmorphic icon orb, a ghost index,
              an outcome-metric badge, an animated light-sweep on hover,
              and a colored glow shadow. The dark body holds title,
              description, engagement-model pill, and an Explore CTA.
              Cards are always-dark so they pop on any page background. */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((sol, i) => (
              <Reveal
                key={sol.id}
                as="a"
                href={`/solutions/${sol.slug}`}
                delay={Math.min(i * 0.05, 0.3)}
                margin="-40px"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:border-foreground/20"
              >
                {/* Colored glow shadow on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ boxShadow: `0 24px 70px -18px ${sol.glow}` }}
                />

                {/* ── Gradient header band ── */}
                <div className={`relative h-32 overflow-hidden bg-gradient-to-br ${sol.gradient}`}>
                  {/* Grid texture overlay */}
                  <div className="absolute inset-0 surface-grid opacity-20" aria-hidden="true" />
                  {/* Diagonal light-sweep — animates across on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ffffff4d] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                  />
                  {/* Ghost index — editorial watermark */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1 select-none text-6xl font-black leading-none tracking-tight text-[#ffffff33]"
                  >
                    {sol.id}
                  </span>
                  {/* Glassmorphic icon orb */}
                  <div className="absolute bottom-4 left-5">
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffffff26] backdrop-blur-md ring-1 ring-[#ffffff4d] transition-transform duration-500 group-hover:scale-110">
                      <sol.icon className="h-7 w-7 text-[#ffffff]" aria-hidden="true" />
                    </span>
                  </div>
                  {/* Outcome-metric badge — teases the value inside */}
                  <span className="absolute top-3 left-5 inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-xs font-bold text-[#f8fafc] backdrop-blur-md">
                    <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    {sol.metric.value} {sol.metric.label}
                  </span>
                </div>

                {/* ── Card body (theme-adaptive) ── */}
                <div className="relative flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold leading-snug tracking-tight text-foreground">
                    {sol.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                    {sol.description}
                  </p>

                  {/* Engagement-model pill */}
                  <div className={`mt-4 inline-flex items-center gap-2 self-start rounded-lg px-3 py-1.5 ${sol.tile}`}>
                    <Wallet className={`h-3.5 w-3.5 ${sol.iconColor}`} aria-hidden="true" />
                    <span className={`text-xs font-semibold ${sol.iconColor}`}>{sol.charge}</span>
                  </div>

                  {/* Explore CTA */}
                  <span className={`mt-4 flex items-center justify-between border-t border-border pt-4 text-sm font-semibold ${sol.strong}`}>
                    Explore solution
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Everything-included band — the six solutions bundle the full catalog */}
          <Reveal
            as="div"
            margin="-40px"
            className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-brand-ink px-6 py-7 text-white md:px-8"
          >
            <div className="pointer-events-none absolute inset-0 surface-grid opacity-40" aria-hidden="true" />
            <div
              className="pointer-events-none absolute -left-16 -top-24 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-amber-500 shadow-lg shadow-amber-500/20">
                  <Layers className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    All {publishedCount} services included
                  </h3>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                    Every marketplace service across our seven divisions is delivered
                    through these six solutions — our architects scope the exact
                    engagement your goal needs.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="h-11 rounded-xl bg-amber-500 font-semibold text-brand-ink hover:bg-amber-400"
                >
                  <Link href="/marketplace">
                    Browse all services
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl border-white/15 bg-transparent text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contact">Talk to an expert</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== TRUST MARQUEE ===================== */}
      <section className="border-b border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by teams building with
          </p>
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {["AWS", "Google Cloud", "Microsoft Azure", "OpenAI", "Anthropic", "Salesforce", "HubSpot", "Klaviyo", "Snowflake", "Kubernetes", "Stripe", "Slack"].map((brand) => (
                <span key={brand} className="text-sm font-bold text-muted-foreground/60 transition-colors hover:text-foreground">{brand}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================== HOW IT WORKS ========================== */}
      <section className="border-t border-border bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="From discovery to delivery in five steps"
            description="A guided path designed to remove friction between identifying a need and shipping a solution."
          />
          <ol className="relative mt-14 grid gap-10 lg:grid-cols-5 lg:gap-6">
            {/* connecting line (desktop) */}
            <span
              className="absolute left-[10%] right-[10%] top-6 hidden h-px bg-gradient-to-r from-blue-600/30 via-blue-600/40 to-amber-500/50 lg:block"
              aria-hidden="true"
            />
            {HOW_IT_WORKS.map((item, i) => (
              <li key={item.step} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
                <span
                  className={
                    i === HOW_IT_WORKS.length - 1
                      ? "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 bg-background text-sm font-bold text-amber-400 shadow-sm"
                      : "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-blue-600/50 bg-background text-sm font-bold text-blue-700 shadow-sm"
                  }
                >
                  {item.step}
                </span>
                <div className="lg:mt-5">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground lg:px-1">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== GLOBAL REACH ===================== */}
      <section className="bg-brand-ink py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Global Delivery"
              title="Global delivery, local presence"
              description="Senior specialists across four continents. Follow-the-sun delivery means your engagement progresses 24/7 — while you sleep, your agent fleet runs."
              dark
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { region: "North America", cities: "Toronto · Austin · NYC", tz: "UTC−5 to −8", hours: "24/7" },
              { region: "Europe", cities: "London · Berlin · Lisbon", tz: "UTC+0 to +2", hours: "24/7" },
              { region: "Asia Pacific", cities: "Bangalore · Singapore · Sydney", tz: "UTC+5:30 to +11", hours: "24/7" },
              { region: "Middle East", cities: "Dubai · Riyadh · Cairo", tz: "UTC+3 to +4", hours: "24/7" },
            ].map((r, i) => (
              <Reveal key={r.region} delay={i * 0.08}>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-center">
                  <Globe className="mx-auto h-8 w-8 text-amber-400" />
                  <h3 className="mt-3 text-sm font-bold text-white">{r.region}</h3>
                  <p className="mt-1 text-xs text-slate-400">{r.cities}</p>
                  <div className="mt-3 flex items-center justify-center gap-3 border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.tz}</span>
                    <span className="text-amber-400">●</span>
                    <span>{r.hours}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== FEATURED SERVICES ======================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              align="left"
              eyebrow="Featured Services"
              title="Deployment-ready engagements, proven in production"
              description="Hand-picked services with clear scoping, defined deliverables, and senior delivery teams."
            />
            <Link
              href="/marketplace"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-blue-600/40 hover:text-blue-700"
            >
              View all services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== MARKETPLACE EXPLORER =====================
          Engaging two-segmentation showcase (By Division / By Solution)
          surfacing all 8 divisions with unique per-division styling.
          Replaces the removed ROI calculator. */}
      <MarketplaceExplorer />

      {/* ==================== AI & TECHNOLOGY HIGHLIGHT ==================== */}
      <section className="border-t border-border bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="AI & Technology"
                title="The capabilities behind intelligent enterprises"
                description="From autonomous agents to production-grade engineering, we build the systems that let your teams focus on decisions — not drudgery."
              />
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {AI_TECH_CAPABILITIES.map((cap) => (
                  <li key={cap} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-amber-500" aria-hidden="true" />
                    {cap}
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-9 bg-blue-600 font-semibold text-white hover:bg-blue-700">
                <Link href="/marketplace?category=ai-automation">
                  Explore AI & Automation
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {/* Automation pipeline visual */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-brand-ink p-6 text-white shadow-2xl md:p-8">
              <div className="absolute inset-0 surface-grid opacity-70" aria-hidden="true" />
              <div
                className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Automation pipeline
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Live
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-stretch gap-2 md:flex-row md:items-center">
                  {PIPELINE_NODES.map((node, i) => (
                    <div key={node.label} className="contents">
                      <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur">
                        <div className="flex items-center gap-2.5">
                          <Icon name={node.icon} className="h-4 w-4 shrink-0 text-amber-400" />
                          <p className="text-xs font-semibold text-white">{node.label}</p>
                        </div>
                        <p className="mt-1 pl-[26px] text-[10px] text-slate-400">{node.meta}</p>
                      </div>
                      {i < PIPELINE_NODES.length - 1 && (
                        <ArrowRight
                          className="hidden h-4 w-4 shrink-0 rotate-0 text-amber-400 md:block"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  {PIPELINE_STATS.map((stat, i) => (
                    <div key={stat.label}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="text-slate-400">{stat.label}</span>
                        <span className="font-semibold text-white">{stat.value}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="anim-bar h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400"
                          style={{ width: stat.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-8 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">
                  Every pipeline is monitored, governed, and handed over with documentation — intelligence
                  you own, not a black box.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIAL SHOWCASE ===================== */}
      <section className="bg-brand-ink py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Client Results"
              title="What leaders say after shipping with STIOOS"
              description="Real outcomes from real engagements — pipeline, cost savings, and time recovered."
              dark
            />
          </Reveal>
          <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {[
              { quote: "We paid for $2.4M of pipeline and got exactly that. The risk reversal changed how our board thinks about vendors.", name: "Sarah Chen", role: "VP Revenue", company: "FinTech, $40M ARR", rating: 5 },
              { quote: "The AI SDR books 30+ qualified meetings a week. My AEs have never been busier with better-fit leads.", name: "Marcus Reid", role: "Head of Sales", company: "B2B SaaS, Series B", rating: 5 },
              { quote: "They tied their fee to pipeline. That told me everything about how they think.", name: "Priya Nair", role: "CMO", company: "DTC, $14M", rating: 5 },
              { quote: "We cut CAC 42% in one quarter by killing three channels we thought were working.", name: "James Okafor", role: "COO", company: "Logistics, Multi-region", rating: 5 },
              { quote: "For the first time, marketing and sales share one dashboard. The infighting stopped overnight.", name: "Elena Volkov", role: "Growth Lead", company: "HealthTech, Series A", rating: 5 },
              { quote: "They got us cited by ChatGPT for the questions our buyers ask. Inbound changed overnight.", name: "David Park", role: "Founder", company: "SaaS, Bootstrapped", rating: 5 },
            ].map((t, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08}>
                <div className="break-inside-avoid rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                  <Quote className="h-6 w-6 text-amber-400/40" />
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{t.quote}</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-white/[0.06] pt-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-400 ring-1 ring-amber-400/25">
                      {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-500">{t.role} · {t.company}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================== INDUSTRIES =========================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Industries"
            title="Deep expertise across ten core industries"
            description="Solutions calibrated to the operating realities, regulations, and economics of your sector."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {INDUSTRIES.map((ind) => (
              <Link
                key={ind.id}
                href={`/industries/${ind.slug}`}
                className="group flex flex-col items-start rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-blue-600/40 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/10 to-amber-500/15 ring-1 ring-blue-600/20">
                  <Icon name={ind.icon} className="h-5 w-5 text-blue-600" />
                </span>
                <span className="mt-3 text-sm font-semibold text-foreground group-hover:text-blue-700">
                  {ind.name}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  {ind.servicesCount} services
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== WHY STIOOS ========================== */}
      <section className="border-t border-border bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why STIOOS"
            title="A marketplace engineered for outcomes"
            description="We built STIOOS GLOBAL because enterprise buyers deserve faster access to expertise — with accountability built in."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {WHY_STIOOS.map((item) => (
              <div
                key={item.title}
                className="relative overflow-hidden rounded-lg border border-border bg-card p-6 md:p-8"
              >
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-600 to-amber-500"
                  aria-hidden="true"
                />
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600/10 ring-1 ring-blue-600/25">
                  <item.icon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== COMPARISON TABLE ===================== */}
      <section className="border-t border-border bg-muted/40 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Why STIOOS"
              title="How STIOOS compares to the alternatives"
              description="Same criteria buyers evaluate before choosing a delivery partner."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Criterion</th>
                    {['In-house', 'Agency', 'Freelancer', 'STIOOS'].map((col, i) => (
                      <th key={col} className={`px-4 py-3 text-center font-semibold ${i === 3 ? 'bg-gradient-to-b from-amber-500 to-orange-500 text-white' : 'text-muted-foreground'}`}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['Senior specialists across 7 divisions', 'partial', 'no', 'no', 'yes'],
                    ['305-service catalog, one accountable team', 'no', 'partial', 'no', 'yes'],
                    ['Outcome-based pricing (pay on delivery)', 'no', 'no', 'no', 'yes'],
                    ['24/7 follow-the-sun delivery', 'no', 'partial', 'no', 'yes'],
                    ['AI agent fleet included', 'no', 'no', 'no', 'yes'],
                    ['SLA-backed measurable results', 'no', 'no', 'no', 'yes'],
                  ].map((row) => (
                    <tr key={row[0]} className="bg-card transition hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{row[0]}</td>
                      {row.slice(1).map((cell, i) => (
                        <td key={i} className="px-4 py-3 text-center">
                          <div className="flex justify-center">
                            {cell === 'yes' ? (
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full ${i === 3 ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-400/30' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                <CheckCircle2 className="h-4 w-4" />
                              </span>
                            ) : cell === 'partial' ? (
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20 text-xs font-bold">~</span>
                            ) : (
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 ring-1 ring-rose-500/20 text-xs font-bold">✕</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl bg-brand-ink px-6 py-16 text-center text-white md:py-20">
          <div className="absolute inset-0 surface-grid" aria-hidden="true" />
          <div
            className="absolute left-1/2 top-0 h-64 w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl">
            <p className="eyebrow flex items-center justify-center gap-2 text-amber-400">
              <span className="inline-block h-px w-6 bg-amber-400/60" />
              Get Started
              <span className="inline-block h-px w-6 bg-amber-400/60" />
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              {homepage.finalCtaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              {homepage.finalCtaSubtitle}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-amber-500 px-8 text-base font-semibold text-brand-ink hover:bg-amber-400"
              >
                <Link href="/marketplace">Explore Marketplace</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-8 text-base font-medium text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/contact">Talk to an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================
// Hero orbit node (glass chip on the ring)
// ============================================================

function OrbitNode({
  className,
  icon,
  label,
  delay,
}: {
  className?: string;
  icon: string;
  label: string;
  delay: number;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className={`anim-float-chip absolute ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 rounded-lg border border-white/12 bg-brand-navy/90 px-3 py-2 shadow-lg backdrop-blur">
        <Icon name={icon} className="h-4 w-4 text-blue-300" />
        <span className="text-[11px] font-semibold text-slate-200">{label}</span>
      </div>
    </div>
  );
}
