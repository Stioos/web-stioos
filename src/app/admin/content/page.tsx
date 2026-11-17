"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CircleHelp,
  FileText,
  Globe,
  MonitorPlay,
  Save,
} from "lucide-react";

import { useAppStore } from "@/lib/store";
import type { HomepageContent } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface AboutValueProp {
  title: string;
  description: string;
}

interface AboutDraft {
  title: string;
  intro: string;
  valueProps: AboutValueProp[];
}

const DEFAULT_ABOUT: AboutDraft = {
  title: "Intelligence, engineered for enterprise outcomes",
  intro:
    "STIOOS GLOBAL exists to close the gap between ambitious strategy and working systems. We assemble senior practitioners across AI, engineering, data, and brand — and deliver as one accountable team.",
  valueProps: [
    {
      title: "Senior-only delivery",
      description:
        "Every engagement is staffed with practitioners who have shipped at scale — no handoffs to juniors, no learning on your budget.",
    },
    {
      title: "Outcome-first scoping",
      description:
        "We start from the business metric you need to move and work backwards to the smallest system that moves it.",
    },
    {
      title: "Built to hand over",
      description:
        "Documentation, enablement, and clean architecture are deliverables — your team owns everything from day one.",
    },
  ],
};

export default function ContentAdminPage() {
  const { toast } = useToast();
  const homepage = useAppStore((s) => s.homepage);
  const updateHomepage = useAppStore((s) => s.updateHomepage);

  const [homeDraft, setHomeDraft] = useState<HomepageContent>(() => ({
    ...homepage,
    stats: homepage.stats.map((s) => ({ ...s })),
  }));
  const [publishing, setPublishing] = useState(false);

  const [aboutDraft, setAboutDraft] = useState<AboutDraft>(() => ({
    ...DEFAULT_ABOUT,
    valueProps: DEFAULT_ABOUT.valueProps.map((v) => ({ ...v })),
  }));
  const [savingAbout, setSavingAbout] = useState(false);

  const setStat = (index: number, patch: Partial<{ value: string; label: string }>) => {
    setHomeDraft((d) => ({
      ...d,
      stats: d.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  };

  const publishHomepage = () => {
    setPublishing(true);
    window.setTimeout(() => {
      updateHomepage({
        ...homeDraft,
        stats: homeDraft.stats.map((s) => ({ ...s })),
      });
      setPublishing(false);
      toast({
        title: "Homepage updated — changes are live",
        description: "Visitors now see the new hero, stats, and call-to-action copy.",
      });
    }, 900);
  };

  const saveAbout = () => {
    setSavingAbout(true);
    window.setTimeout(() => {
      setSavingAbout(false);
      toast({
        title: "About page content saved (demo)",
        description: "About page edits are captured for this demo session and not persisted.",
      });
    }, 900);
  };

  const updateValueProp = (index: number, patch: Partial<AboutValueProp>) => {
    setAboutDraft((d) => ({
      ...d,
      valueProps: d.valueProps.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));
  };

  return (
    <div>
      <PageHeader
        title="Content Management"
        description="Manage homepage copy, page content, and preview changes before they go live to visitors."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" /> View live site
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="homepage" className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <TabsList className="flex h-fit w-full flex-col items-stretch gap-1 rounded-lg border bg-card p-2 lg:sticky lg:top-24">
          <TabsTrigger value="homepage" className="justify-start data-[state=active]:bg-muted">
            <MonitorPlay className="h-4 w-4" /> Homepage
          </TabsTrigger>
          <TabsTrigger value="about" className="justify-start data-[state=active]:bg-muted">
            <FileText className="h-4 w-4" /> About page
          </TabsTrigger>
          <TabsTrigger value="faqs" className="justify-start data-[state=active]:bg-muted">
            <CircleHelp className="h-4 w-4" /> FAQs
          </TabsTrigger>
        </TabsList>

        <div className="min-w-0">
          {/* ================= HOMEPAGE ================= */}
          <TabsContent value="homepage" className="mt-0 grid gap-6 xl:grid-cols-2">
            <div className="space-y-6">
              <Card className="p-5">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Hero section</CardTitle>
                  <CardDescription>The first thing every visitor reads.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-0 pb-0">
                  <div className="space-y-2">
                    <Label htmlFor="hero-badge">Hero badge</Label>
                    <Input
                      id="hero-badge"
                      value={homeDraft.heroBadge}
                      onChange={(e) => setHomeDraft((d) => ({ ...d, heroBadge: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hero-title-top">Title line 1</Label>
                      <Input
                        id="hero-title-top"
                        value={homeDraft.heroTitleTop}
                        onChange={(e) => setHomeDraft((d) => ({ ...d, heroTitleTop: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-title-bottom">Title line 2</Label>
                      <Input
                        id="hero-title-bottom"
                        value={homeDraft.heroTitleBottom}
                        onChange={(e) => setHomeDraft((d) => ({ ...d, heroTitleBottom: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      rows={3}
                      value={homeDraft.heroSubtitle}
                      onChange={(e) => setHomeDraft((d) => ({ ...d, heroSubtitle: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cta-primary">Primary CTA text</Label>
                      <Input
                        id="cta-primary"
                        value={homeDraft.primaryCta}
                        onChange={(e) => setHomeDraft((d) => ({ ...d, primaryCta: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cta-secondary">Secondary CTA text</Label>
                      <Input
                        id="cta-secondary"
                        value={homeDraft.secondaryCta}
                        onChange={(e) => setHomeDraft((d) => ({ ...d, secondaryCta: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-5">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Hero stats</CardTitle>
                  <CardDescription>Four proof points shown beneath the hero.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 px-0 pb-0 sm:grid-cols-2">
                  {homeDraft.stats.map((stat, i) => (
                    <div key={i} className="space-y-2 rounded-md border p-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`stat-value-${i}`} className="text-xs text-muted-foreground">Value</Label>
                        <Input
                          id={`stat-value-${i}`}
                          value={stat.value}
                          onChange={(e) => setStat(i, { value: e.target.value })}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`stat-label-${i}`} className="text-xs text-muted-foreground">Label</Label>
                        <Input
                          id={`stat-label-${i}`}
                          value={stat.label}
                          onChange={(e) => setStat(i, { label: e.target.value })}
                          className="h-8"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="p-5">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Final call-to-action</CardTitle>
                  <CardDescription>Closing section before the footer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-0 pb-0">
                  <div className="space-y-2">
                    <Label htmlFor="final-title">Title</Label>
                    <Input
                      id="final-title"
                      value={homeDraft.finalCtaTitle}
                      onChange={(e) => setHomeDraft((d) => ({ ...d, finalCtaTitle: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="final-subtitle">Subtitle</Label>
                    <Textarea
                      id="final-subtitle"
                      rows={2}
                      value={homeDraft.finalCtaSubtitle}
                      onChange={(e) => setHomeDraft((d) => ({ ...d, finalCtaSubtitle: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={publishHomepage} disabled={publishing} className="min-w-44">
                  <Save className="h-4 w-4" />
                  {publishing ? "Publishing…" : "Publish Changes"}
                </Button>
              </div>
            </div>

            {/* LIVE PREVIEW */}
            <div className="xl:sticky xl:top-24 xl:self-start">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Live preview — draft values
              </p>
              <div className="overflow-hidden rounded-lg border shadow-sm">
                <div className="flex items-center gap-1.5 border-b bg-muted px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 truncate rounded bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
                    stioos.com — homepage
                  </span>
                </div>
                <div className="bg-brand-ink px-6 py-8 text-white">
                  <div className="mx-auto max-w-md">
                    <span className="inline-block rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-300">
                      {homeDraft.heroBadge || "Badge text"}
                    </span>
                    <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                      <span className="block">{homeDraft.heroTitleTop || "Title line 1"}</span>
                      <span className="block text-gradient-brand">{homeDraft.heroTitleBottom || "Title line 2"}</span>
                    </h2>
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-400">
                      {homeDraft.heroSubtitle || "Subtitle copy appears here."}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-2 text-[11px] font-semibold text-white">
                        {homeDraft.primaryCta || "Primary CTA"} <ArrowRight className="h-3 w-3" />
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-white/20 px-3.5 py-2 text-[11px] font-semibold text-slate-200">
                        {homeDraft.secondaryCta || "Secondary CTA"}
                      </span>
                    </div>
                    <div className="mt-6 grid grid-cols-4 gap-3 border-t border-white/10 pt-5">
                      {homeDraft.stats.map((s, i) => (
                        <div key={i} className="min-w-0">
                          <p className="truncate text-sm font-bold text-white sm:text-base">{s.value || "—"}</p>
                          <p className="truncate text-[9px] uppercase tracking-wide text-slate-500">{s.label || "Label"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-[#0a1224] px-6 py-6 text-white">
                  <div className="mx-auto max-w-md text-center">
                    <h3 className="text-lg font-black tracking-tight">
                      {homeDraft.finalCtaTitle || "Final CTA title"}
                    </h3>
                    <p className="mx-auto mt-2 line-clamp-2 max-w-sm text-[11px] leading-relaxed text-slate-400">
                      {homeDraft.finalCtaSubtitle || "Final CTA subtitle appears here."}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-[11px] font-bold text-brand-ink">
                      {homeDraft.primaryCta || "Primary CTA"} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ================= ABOUT PAGE ================= */}
          <TabsContent value="about" className="mt-0">
            <Card className="p-5">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-base">About page</CardTitle>
                <CardDescription>
                  Intro copy and value propositions. Saving is demo-only and not persisted across sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-0 pb-0">
                <div className="space-y-2">
                  <Label htmlFor="about-title">Page title</Label>
                  <Input
                    id="about-title"
                    value={aboutDraft.title}
                    onChange={(e) => setAboutDraft((d) => ({ ...d, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-intro">Intro paragraph</Label>
                  <Textarea
                    id="about-intro"
                    rows={4}
                    value={aboutDraft.intro}
                    onChange={(e) => setAboutDraft((d) => ({ ...d, intro: e.target.value }))}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground">Value propositions</p>
                  {aboutDraft.valueProps.map((vp, i) => (
                    <div key={i} className="grid gap-3 rounded-md border p-4 sm:grid-cols-[1fr_2fr]">
                      <div className="space-y-1.5">
                        <Label htmlFor={`vp-title-${i}`} className="text-xs text-muted-foreground">Title</Label>
                        <Input
                          id={`vp-title-${i}`}
                          value={vp.title}
                          onChange={(e) => updateValueProp(i, { title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`vp-desc-${i}`} className="text-xs text-muted-foreground">Description</Label>
                        <Textarea
                          id={`vp-desc-${i}`}
                          rows={2}
                          value={vp.description}
                          onChange={(e) => updateValueProp(i, { description: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end border-t pt-5">
                  <Button onClick={saveAbout} disabled={savingAbout} className="min-w-36">
                    <Save className="h-4 w-4" />
                    {savingAbout ? "Saving…" : "Save About page"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ================= FAQS ================= */}
          <TabsContent value="faqs" className="mt-0">
            <Card className="p-5">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-base">Frequently Asked Questions</CardTitle>
                <CardDescription>
                  FAQ content is managed in its dedicated workspace with ordering, search, and publishing controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <Link
                  href="/admin/faqs"
                  className="flex items-center justify-between rounded-lg border bg-muted/40 px-5 py-4 transition-colors hover:border-primary/40 hover:bg-muted/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <CircleHelp className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Open FAQs manager</p>
                      <p className="text-xs text-muted-foreground">
                        Edit questions, answers, categories, and display order.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
