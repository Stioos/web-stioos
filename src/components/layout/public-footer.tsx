"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Sun, Moon, Monitor, Globe, ChevronDown,
  Compass, Layers, Bot, Trophy, BookOpen, Users,
  Boxes, Sparkles, Factory, Lightbulb,
  Settings, LayoutDashboard, Search, Code,
  Cloud, Target, Building2, Clapperboard,
  TrendingUp, Workflow, Megaphone,
  Mail, MessageSquare, FileText, HeartHandshake,
  Briefcase, Handshake, Phone, Scale,
  Shield, GitBranch, HardHat, Cpu, ShoppingCart, Cog, DraftingCompass, Rocket,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INDUSTRIES } from "@/data/content";

// ============================================================
// PUBLIC FOOTER — 6-column icon-coded design, fully theme-
// adaptive (light + dark). Per-column accent icons, bottom bar
// with region selector + legal links + theme switcher trio.
// STIOOS acronym banner at the top with gradient highlight.
// ============================================================

interface FooterLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface FooterColumn {
  header: string;
  headerIcon: LucideIcon;
  accent: string; // text color class for icons (-500 for cross-theme contrast)
  links: FooterLink[];
}

const COLUMNS: FooterColumn[] = [
  {
    header: "Explore",
    headerIcon: Compass,
    accent: "text-cyan-500",
    links: [
      { label: "Marketplace", href: "/marketplace", icon: Boxes },
      { label: "Solutions", href: "/solutions", icon: Sparkles },
      { label: "All Services", href: "/services", icon: Layers },
      { label: "Industries", href: "/industries", icon: Factory },
      { label: "Insights", href: "/insights", icon: Lightbulb },
      { label: "Categories", href: "/categories", icon: Compass },
    ],
  },
  {
    header: "Industries",
    headerIcon: Factory,
    accent: "text-violet-500",
    links: INDUSTRIES.filter((i) => i.status === "active").slice(0, 6).map((i) => ({
      label: i.name,
      href: `/industries/${i.slug}`,
      icon: ({
        Construction: HardHat,
        Manufacturing: Factory,
        Technology: Cpu,
        "Financial Services": Scale,
        "E-Commerce": ShoppingCart,
        Industrial: Cog,
        "Professional Services": Briefcase,
        Engineering: DraftingCompass,
        Startups: Rocket,
        Enterprises: Building2,
      } as Record<string, LucideIcon>)[i.name] ?? Factory,
    })),
  },
  {
    header: "Divisions",
    headerIcon: Bot,
    accent: "text-amber-500",
    links: [
      { label: "AI Automation", href: "/category/ai-agents", icon: Bot },
      { label: "Technology", href: "/category/technology-programming", icon: Code },
      { label: "Cloud DevOps", href: "/category/cloud-devops-mlops", icon: Cloud },
      { label: "Digital Sales", href: "/category/digital-sales-marketing", icon: Target },
      { label: "Business", href: "/category/business-enterprise-services", icon: Building2 },
      { label: "Multimedia", href: "/category/multimedia-ai-graphics", icon: Clapperboard },
      { label: "Talent Solutions", href: "/talent-solutions", icon: Users },
    ],
  },
  {
    header: "Solutions",
    headerIcon: Trophy,
    accent: "text-emerald-500",
    links: [
      { label: "Revenue Growth", href: "/solutions/revenue-growth-as-a-service", icon: TrendingUp },
      { label: "Business Automation", href: "/solutions/business-automation-as-a-service", icon: Workflow },
      { label: "Software / SaaS", href: "/solutions/software-as-a-service", icon: Code },
      { label: "Digital Growth", href: "/solutions/digital-growth-as-a-service", icon: Megaphone },
      { label: "Results on Delivery", href: "/solutions/results-on-delivery-as-a-service", icon: Trophy },
      { label: "AI Transformation", href: "/solutions/ai-transformation-as-a-service", icon: Sparkles },
    ],
  },
  {
    header: "Resources",
    headerIcon: BookOpen,
    accent: "text-blue-500",
    links: [
      { label: "About Us", href: "/about", icon: Compass },
      { label: "Contact", href: "/contact", icon: Mail },
      { label: "FAQs", href: "/resources/faqs", icon: MessageSquare },
      { label: "Insights", href: "/insights", icon: BookOpen },
      { label: "Resources", href: "/resources", icon: FileText },
      { label: "Help Center", href: "/contact", icon: HeartHandshake },
    ],
  },
  {
    header: "Company",
    headerIcon: Users,
    accent: "text-pink-500",
    links: [
      { label: "About", href: "/about", icon: Compass },
      { label: "Careers", href: "/contact", icon: Briefcase },
      { label: "Press & Media", href: "/insights", icon: Megaphone },
      { label: "Partner Program", href: "/contact", icon: Handshake },
      { label: "Contact Us", href: "/contact", icon: Phone },
      { label: "Legal", href: "/contact", icon: Scale },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/contact", icon: Shield },
  { label: "Terms", href: "/contact", icon: Scale },
  { label: "Cookie Settings", href: "/contact", icon: Settings },
  { label: "Sitemap", href: "/sitemap.xml", icon: GitBranch },
];

// STIOOS acronym — each word highlighted with a gradient.
const STIOOS_WORDS = [
  { letter: "S", word: "Smart" },
  { letter: "T", word: "Technology" },
  { letter: "I", word: "Intelligence" },
  { letter: "O", word: "Organization" },
  { letter: "O", word: "Operating" },
  { letter: "S", word: "System" },
];

export function PublicFooter() {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme ?? "system";

  return (
    <footer className="mt-auto border-t border-border bg-background text-muted-foreground">
      {/* ── STIOOS acronym banner ── */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-[1400px] px-6 py-5 lg:px-10">
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-center">
            <span className="text-[13px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              STIOOS stands for
            </span>
            <span className="flex flex-wrap items-center justify-center gap-x-1.5">
              {STIOOS_WORDS.map(({ letter, word }, i) => (
                <span key={i} className="inline-flex items-center gap-0.5">
                  <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-amber-500 bg-clip-text text-[14px] font-bold text-transparent">
                    {letter}
                  </span>
                  <span className="text-[13px] font-medium text-foreground/80">{word}</span>
                  {i < STIOOS_WORDS.length - 1 && (
                    <span className="ml-1 text-muted-foreground/40">·</span>
                  )}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main: 6 icon-coded link columns ── */}
      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-8">
          {COLUMNS.map((col) => (
            <div key={col.header}>
              {/* Column header — colored icon + semibold label */}
              <div className="mb-5 flex items-center gap-2">
                <col.headerIcon className={cn("h-[18px] w-[18px]", col.accent)} strokeWidth={1.8} />
                <h3 className="text-[15px] font-semibold text-foreground">{col.header}</h3>
              </div>
              {/* Links — each with a small colored icon */}
              <ul className="space-y-[14px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <link.icon
                        className={cn("h-[15px] w-[15px] shrink-0 opacity-70 transition-opacity group-hover:opacity-100", col.accent)}
                        strokeWidth={1.7}
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar: region selector + legal links + copyright + theme switcher ── */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-5 lg:flex-row lg:px-10">
          {/* Left: region selector pill */}
          <button
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
            aria-label="Select region"
          >
            <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
            Global
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={2} />
          </button>

          {/* Center: legal links with pipe dividers */}
          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.label} className="flex items-center gap-3">
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <link.icon className="h-3.5 w-3.5 opacity-60" strokeWidth={1.7} />
                  {link.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span className="text-border" aria-hidden="true">|</span>
                )}
              </span>
            ))}
          </div>

          {/* Right: copyright + theme switcher trio */}
          <div className="flex items-center gap-4">
            <p className="text-[13px] text-muted-foreground">
              © {new Date().getFullYear()}{" "}
              <span className="font-bold text-foreground">STIOOS</span>{" "}
              All rights reserved.
            </p>
            {/* Theme switcher trio — circular buttons with active glow */}
            <div className="flex items-center gap-1.5">
              {([
                { value: "light", icon: Sun, label: "Light" },
                { value: "dark", icon: Moon, label: "Dark" },
                { value: "system", icon: Monitor, label: "System" },
              ] as const).map(({ value, icon: Icon, label }) => {
                const active = currentTheme === value;
                return (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    aria-label={label}
                    suppressHydrationWarning
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border transition-all",
                      active
                        ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-600 shadow-[0_0_12px_-2px] shadow-cyan-500/40"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
