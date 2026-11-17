"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Eye, Plus, Sparkles, Star, TrendingUp, X } from "lucide-react";

import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/page-header";
import { AccentTile } from "@/components/shared/icon";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function FeaturedServicesPage() {
  const { toast } = useToast();
  const services = useAppStore((s) => s.services);
  const categories = useAppStore((s) => s.categories);
  const settings = useAppStore((s) => s.marketplaceSettings);
  const toggleServiceFeatured = useAppStore((s) => s.toggleServiceFeatured);

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) ?? "Uncategorized";
  }, [categories]);

  const published = useMemo(() => services.filter((s) => s.status === "published"), [services]);
  const featuredList = useMemo(
    () => published.filter((s) => s.featured).sort((a, b) => b.popularity - a.popularity),
    [published]
  );
  const availableList = useMemo(
    () => published.filter((s) => !s.featured).sort((a, b) => b.popularity - a.popularity),
    [published]
  );

  const slotsTotal = settings.featuredSlots;
  const slotsUsed = featuredList.length;
  const slotsFull = slotsUsed >= slotsTotal;

  const removeFromFeatured = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    toggleServiceFeatured(id);
    toast({
      title: "Removed from featured",
      description: `"${svc.name}" was removed. One featured slot is now free.`,
    });
  };

  const addToFeatured = (id: string) => {
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    if (slotsFull) {
      toast({
        variant: "destructive",
        title: "Featured slots full",
        description: `All ${slotsTotal} featured slots are in use. Remove a featured service first or raise the limit in Marketplace settings.`,
      });
      return;
    }
    toggleServiceFeatured(id);
    toast({
      title: "Added to featured",
      description: `"${svc.name}" now occupies a featured slot on the marketplace.`,
    });
  };

  return (
    <div>
      <PageHeader
        title="Featured Services"
        description="Curate which published services occupy premium featured placements across the homepage and marketplace."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/marketplace">Marketplace control</Link>
          </Button>
        }
      />

      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">
              {slotsUsed} of {slotsTotal} slots used
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {slotsFull
                ? "Every featured slot is occupied. Remove a service to free a slot."
                : `${slotsTotal - slotsUsed} slot${slotsTotal - slotsUsed === 1 ? "" : "s"} still available for placement.`}
            </p>
          </div>
          <div className="w-full sm:max-w-xs">
            <Progress value={(slotsUsed / Math.max(1, slotsTotal)) * 100} className="h-2" />
            <p className="mt-1.5 text-right text-[11px] font-medium text-muted-foreground">
              {Math.round((slotsUsed / Math.max(1, slotsTotal)) * 100)}% capacity
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Currently featured */}
        <section aria-label="Currently featured services">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Currently featured
            </h2>
            <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-600">
              {featuredList.length} active
            </span>
          </div>

          {featuredList.length === 0 ? (
            <EmptyState
              icon={Star}
              title="Nothing featured yet"
              description="Add published services from the available list to fill premium placements."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredList.map((svc) => (
                <Card key={svc.id} className="overflow-hidden p-0">
                  <div className="relative">
                    <AccentTile gradient={svc.accent} icon={svc.icon} className="h-20 w-full" iconClass="h-8 w-8" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Featured
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromFeatured(svc.id)}
                      aria-label={`Remove ${svc.name} from featured`}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-black/45 text-white backdrop-blur transition-colors hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="truncate text-sm font-semibold text-foreground">{svc.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {categoryName(svc.categoryId)}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {svc.popularity.toLocaleString()} views
                      </span>
                      <EntityStatusBadge status={svc.status} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Available to feature */}
        <section aria-label="Available to feature">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Available to feature
            </h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
              {availableList.length} published
            </span>
          </div>

          {availableList.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Everything is featured"
              description="All published services already occupy featured slots. Excellent curation."
            />
          ) : (
            <Card className="p-5">
              <CardContent className="max-h-[560px] space-y-1 overflow-y-auto p-0">
                {availableList.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center gap-3 rounded-md px-1 py-2.5 transition-colors hover:bg-muted/60"
                  >
                    <AccentTile gradient={svc.accent} icon={svc.icon} className="h-10 w-10 shrink-0 rounded-md" iconClass="h-5 w-5" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{svc.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {categoryName(svc.categoryId)} · {svc.popularity.toLocaleString()} views
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={slotsFull}
                      onClick={() => addToFeatured(svc.id)}
                    >
                      <Plus className="h-3.5 w-3.5" /> Feature
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {slotsFull && availableList.length > 0 && (
            <p className="mt-3 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              Featured slots are full. Remove a featured service or raise the slot limit to add more.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
