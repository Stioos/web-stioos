"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  Sparkles,
  Star,
} from "lucide-react";

import { useAppStore } from "@/lib/store";
import type { MarketplaceSettings } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import { AccentTile } from "@/components/shared/icon";
import { EntityStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
];

export default function MarketplaceControlPage() {
  const { toast } = useToast();
  const services = useAppStore((s) => s.services);
  const categories = useAppStore((s) => s.categories);
  const settings = useAppStore((s) => s.marketplaceSettings);
  const toggleServiceFeatured = useAppStore((s) => s.toggleServiceFeatured);
  const setServiceStatus = useAppStore((s) => s.setServiceStatus);

  const [settingsDraft, setSettingsDraft] = useState<MarketplaceSettings>(() => ({
    ...settings,
  }));
  const [savingSettings, setSavingSettings] = useState(false);

  const published = useMemo(() => services.filter((s) => s.status === "published"), [services]);
  const drafts = useMemo(() => services.filter((s) => s.status === "draft"), [services]);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) ?? "Uncategorized";
  }, [categories]);

  const topServices = useMemo(
    () => [...published].sort((a, b) => b.popularity - a.popularity).slice(0, 6),
    [published]
  );
  const maxPopularity = topServices[0]?.popularity ?? 1;

  const recentChanges = useMemo(
    () => [...services].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 5),
    [services]
  );

  const featuredPublished = published.filter((s) => s.featured).length;
  const slotsUsed = featuredPublished;
  const slotsTotal = settings.featuredSlots;
  const slotsFull = slotsUsed >= slotsTotal;

  const tryFeature = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    if (!svc.featured && slotsUsed >= slotsTotal) {
      toast({
        variant: "destructive",
        title: "Featured slots full",
        description: `All ${slotsTotal} featured slots are in use. Remove a featured service first or raise the slot limit in Visibility & Settings.`,
      });
      return;
    }
    toggleServiceFeatured(id);
    toast({
      title: svc.featured ? "Removed from featured" : "Added to featured",
      description: `"${svc.name}" is ${svc.featured ? "no longer" : "now"} featured on the marketplace.`,
    });
  };

  const approveService = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    setServiceStatus(id, "published");
    toast({
      title: "Service published",
      description: `"${svc.name}" was approved and is now live on the marketplace.`,
    });
  };

  const requestChanges = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    toast({
      title: "Change request sent",
      description: `The author of "${svc.name}" has been notified with review notes.`,
    });
  };

  const saveSettings = () => {
    setSavingSettings(true);
    window.setTimeout(() => {
      const normalized: MarketplaceSettings = {
        ...settingsDraft,
        featuredSlots: Math.min(12, Math.max(1, Number(settingsDraft.featuredSlots) || 1)),
      };
      useAppStore.getState().updateMarketplaceSettings(normalized);
      setSettingsDraft(normalized);
      setSavingSettings(false);
      toast({
        title: "Marketplace settings saved",
        description: "Your visibility and behaviour changes are now applied across the marketplace.",
      });
    }, 900);
  };

  return (
    <div>
      <PageHeader
        title="Marketplace Control Center"
        description="Monitor marketplace health, curate featured placements, approve new services, and control global visibility."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/featured">
              <Sparkles className="h-4 w-4" /> Featured manager
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="h-auto w-full flex-wrap justify-start sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="featured">Featured Services</TabsTrigger>
          <TabsTrigger value="approvals">
            Service Approvals
            {drafts.length > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                {drafts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Visibility &amp; Settings</TabsTrigger>
        </TabsList>

        {/* ================= OVERVIEW ================= */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Published services" value={published.length} icon="Globe" tone="blue" />
            <StatCard label="Drafts awaiting approval" value={drafts.length} icon="PenTool" tone="amber" />
            <StatCard
              label="Featured count"
              value={`${featuredPublished} / ${slotsTotal}`}
              icon="Sparkles"
              tone="violet"
            />
            <StatCard label="Categories" value={categories.length} icon="Layers" tone="green" />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card className="p-5">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-base">Top services by popularity</CardTitle>
                <CardDescription>Most viewed published services this period.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-0 pb-0">
                {topServices.length === 0 ? (
                  <EmptyState
                    icon={BarChart3}
                    title="No published services yet"
                    description="Publish services to see popularity rankings here."
                  />
                ) : (
                  topServices.map((svc, i) => (
                    <div key={svc.id} className="flex items-center gap-3">
                      <span className="w-5 shrink-0 text-right text-xs font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <AccentTile gradient={svc.accent} icon={svc.icon} className="h-9 w-9 shrink-0 rounded-md" iconClass="h-4 w-4" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-foreground">{svc.name}</p>
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            <Eye className="mr-1 inline h-3 w-3" />
                            {svc.popularity.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                              style={{ width: `${Math.max(6, Math.round((svc.popularity / Math.max(1, maxPopularity)) * 100))}%` }}
                            />
                          </div>
                          <span className="w-28 shrink-0 truncate text-[11px] text-muted-foreground">
                            {categoryName(svc.categoryId)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="p-5">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-base">Recent service changes</CardTitle>
                <CardDescription>Last five services touched by the team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 px-0 pb-0">
                {recentChanges.length === 0 ? (
                  <EmptyState
                    icon={Clock}
                    title="No activity yet"
                    description="Service edits will appear here as the team works."
                  />
                ) : (
                  recentChanges.map((svc) => (
                    <div key={svc.id} className="flex items-center gap-3 rounded-md px-1 py-2 transition-colors hover:bg-muted/60">
                      <AccentTile gradient={svc.accent} icon={svc.icon} className="h-9 w-9 shrink-0 rounded-md" iconClass="h-4 w-4" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{svc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {formatDistanceToNow(parseISO(svc.updatedAt), { addSuffix: true })} · {categoryName(svc.categoryId)}
                        </p>
                      </div>
                      <EntityStatusBadge status={svc.status} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= FEATURED SERVICES ================= */}
        <TabsContent value="featured" className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {slotsUsed} of {slotsTotal} featured slots used
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Featured services appear on the homepage and marketplace header.
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/featured">
                  Open featured manager <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <Progress value={(slotsUsed / Math.max(1, slotsTotal)) * 100} className="mt-4 h-2" />
            {slotsFull && (
              <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
                All featured slots are in use. Toggle a service off to free a slot, or increase the
                slot limit in Visibility &amp; Settings.
              </p>
            )}
          </Card>

          <Card className="p-5">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-base">Published services</CardTitle>
              <CardDescription>Toggle the switch or use the quick action to manage placements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 px-0 pb-0">
              {published.length === 0 ? (
                <EmptyState
                  icon={Layers}
                  title="No published services"
                  description="Approve and publish services before curating featured placements."
                />
              ) : (
                published.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex flex-col gap-3 rounded-md px-1 py-2.5 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center"
                  >
                    <AccentTile gradient={svc.accent} icon={svc.icon} className="h-10 w-10 shrink-0 rounded-md" iconClass="h-5 w-5" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{svc.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {categoryName(svc.categoryId)} · {svc.popularity.toLocaleString()} views ·{" "}
                        {format(parseISO(svc.updatedAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge tone={svc.featured ? "violet" : "gray"}>
                        <Star className={cn("h-3 w-3", svc.featured && "fill-current")} />
                        {svc.featured ? "Featured" : "Standard"}
                      </StatusBadge>
                      {!svc.featured && (
                        <Button variant="outline" size="sm" onClick={() => tryFeature(svc.id)}>
                          <Sparkles className="h-3.5 w-3.5" /> Feature
                        </Button>
                      )}
                      <Switch
                        checked={svc.featured}
                        onCheckedChange={() => tryFeature(svc.id)}
                        aria-label={`Toggle featured for ${svc.name}`}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= SERVICE APPROVALS ================= */}
        <TabsContent value="approvals" className="space-y-4">
          {drafts.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Approval queue is clear"
              description="No draft services are waiting for review. New drafts will appear here."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {drafts.map((svc) => (
                <Card key={svc.id} className="flex flex-col p-5">
                  <div className="flex items-start gap-3">
                    <AccentTile gradient={svc.accent} icon={svc.icon} className="h-12 w-12 shrink-0 rounded-md" iconClass="h-6 w-6" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{svc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {categoryName(svc.categoryId)} · submitted by {svc.createdBy}
                      </p>
                    </div>
                    <EntityStatusBadge status={svc.status} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{svc.shortDescription}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Updated {format(parseISO(svc.updatedAt), "MMM d, yyyy")} · {svc.timeline}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
                    <Button size="sm" onClick={() => approveService(svc.id)}>
                      <CheckCircle2 className="h-4 w-4" /> Approve &amp; Publish
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => requestChanges(svc.id)}>
                      <Clock className="h-4 w-4" /> Request Changes
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="ml-auto">
                      <Link href={`/admin/services/${svc.id}`}>
                        View <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ================= VISIBILITY & SETTINGS ================= */}
        <TabsContent value="settings">
          <Card className="p-5">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-base">Visibility &amp; Settings</CardTitle>
              <CardDescription>
                Control how the marketplace behaves for public visitors. Changes apply after saving.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-0 pb-0">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Status banner preview</Label>
                <div
                  className={cn(
                    "mt-2 flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium",
                    settingsDraft.status === "live"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  )}
                >
                  {settingsDraft.status === "live" ? (
                    <>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      Marketplace is live — all services are accepting inquiries.
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Scheduled maintenance — new inquiries are paused. We will be back shortly.
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mp-status">Marketplace status</Label>
                  <Select
                    value={settingsDraft.status}
                    onValueChange={(v) => setSettingsDraft((d) => ({ ...d, status: v as "live" | "maintenance" }))}
                  >
                    <SelectTrigger id="mp-status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live — open for business</SelectItem>
                      <SelectItem value="maintenance">Maintenance — inquiries paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mp-sort">Default sorting</Label>
                  <Select
                    value={settingsDraft.defaultSort}
                    onValueChange={(v) => setSettingsDraft((d) => ({ ...d, defaultSort: v }))}
                  >
                    <SelectTrigger id="mp-sort" className="w-full">
                      <SelectValue placeholder="Select default sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mp-slots">Featured slots (1–12)</Label>
                  <Input
                    id="mp-slots"
                    type="number"
                    min={1}
                    max={12}
                    value={settingsDraft.featuredSlots}
                    onChange={(e) =>
                      setSettingsDraft((d) => ({
                        ...d,
                        featuredSlots: Math.min(12, Math.max(1, Number(e.target.value) || 1)),
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-md border px-4 py-3">
                  <div>
                    <Label htmlFor="mp-auto" className="text-sm font-medium">Auto-approve new services</Label>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Publish new services without manual review.
                    </p>
                  </div>
                  <Switch
                    id="mp-auto"
                    checked={settingsDraft.autoApproveServices}
                    onCheckedChange={(v) => setSettingsDraft((d) => ({ ...d, autoApproveServices: v }))}
                  />
                </div>
              </div>

              <div className="flex justify-end border-t pt-5">
                <Button onClick={saveSettings} disabled={savingSettings} className="min-w-36">
                  {savingSettings ? "Saving…" : "Save settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
