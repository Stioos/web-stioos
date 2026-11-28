"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  Archive, Copy, ExternalLink, Globe, Loader2, MoreHorizontal, Pencil,
  Plus, Star, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import type { Service, ServiceStatus } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { AccentTile } from "@/components/shared/icon";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { MarketplaceSectionLinks } from "@/components/admin/marketplace-section-links";

export default function AdminServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] animate-pulse rounded-lg bg-muted/40" />}>
      <ServicesInner />
    </Suspense>
  );
}

function ServicesInner() {
  const router = useRouter();
  const search = useSearchParams();
  const hydrated = useHydrated();

  const services = useAppStore((s) => s.services);
  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const toggleServiceFeatured = useAppStore((s) => s.toggleServiceFeatured);
  const setServiceStatus = useAppStore((s) => s.setServiceStatus);
  const duplicateService = useAppStore((s) => s.duplicateService);
  const deleteService = useAppStore((s) => s.deleteService);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const { confirm, close, state } = useConfirmDialog();

  // ?focus={id} → open the edit page for that service
  useEffect(() => {
    const focus = search.get("focus");
    if (focus && hydrated) router.replace(`/admin/services/${focus}`);
  }, [search, hydrated, router]);

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";
  const subName = (id: string) => subcategories.find((s) => s.id === id)?.name ?? "—";

  const runAction = (key: string, fn: () => void, t: { title: string; description?: string }) => {
    if (pending) return;
    setPending(key);
    window.setTimeout(() => {
      fn();
      setPending(null);
      toast(t);
    }, 300);
  };

  const counts = useMemo(
    () => ({
      total: services.length,
      published: services.filter((s) => s.status === "published").length,
      draft: services.filter((s) => s.status === "draft").length,
      archived: services.filter((s) => s.status === "archived").length,
      featured: services.filter((s) => s.featured).length,
    }),
    [services]
  );

  const filtered = useMemo(
    () =>
      services.filter(
        (s) =>
          (statusFilter === "all" || s.status === statusFilter) &&
          (categoryFilter === "all" || s.categoryId === categoryFilter) &&
          (!featuredOnly || s.featured)
      ),
    [services, statusFilter, categoryFilter, featuredOnly]
  );

  const clearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setFeaturedOnly(false);
  };
  const filtersActive = statusFilter !== "all" || categoryFilter !== "all" || featuredOnly;

  const chips = [
    { label: "Total", count: counts.total, active: !filtersActive, onClick: clearFilters },
    { label: "Published", count: counts.published, active: statusFilter === "published", onClick: () => setStatusFilter(statusFilter === "published" ? "all" : "published") },
    { label: "Draft", count: counts.draft, active: statusFilter === "draft", onClick: () => setStatusFilter(statusFilter === "draft" ? "all" : "draft") },
    { label: "Archived", count: counts.archived, active: statusFilter === "archived", onClick: () => setStatusFilter(statusFilter === "archived" ? "all" : "archived") },
    { label: "Featured", count: counts.featured, active: featuredOnly, onClick: () => setFeaturedOnly((v) => !v) },
  ];

  const confirmDelete = (svc: Service) =>
    confirm({
      title: "Delete service?",
      description: `"${svc.name}" will be permanently removed from the marketplace. This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        deleteService(svc.id);
        toast({ title: "Service deleted", description: `"${svc.name}" was permanently removed.` });
      },
    });

  const columns: Column<Service>[] = [
    {
      key: "name",
      header: "Service",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="flex min-w-0 items-center gap-3">
          <AccentTile gradient={r.accent} icon={r.icon} className="h-10 w-10 shrink-0 rounded-md" iconClass="h-5 w-5" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.shortDescription}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      hideBelow: "lg",
      render: (r) => <span className="text-sm">{catName(r.categoryId)}</span>,
    },
    {
      key: "subcategory",
      header: "Subcategory",
      hideBelow: "xl",
      render: (r) => <span className="text-sm text-muted-foreground">{subName(r.subcategoryId)}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <EntityStatusBadge status={r.status} />,
    },
    {
      key: "featured",
      header: "Featured",
      render: (r) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label={r.featured ? `Unfeature ${r.name}` : `Feature ${r.name}`}
          title={r.featured ? "Unfeature" : "Feature"}
          disabled={pending === `feat-${r.id}`}
          onClick={() =>
            runAction(
              `feat-${r.id}`,
              () => toggleServiceFeatured(r.id),
              {
                title: r.featured ? "Removed from featured" : "Added to featured",
                description: `"${r.name}" featured flag updated.`,
              }
            )
          }
        >
          {pending === `feat-${r.id}` ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Star className={cn("h-4 w-4", r.featured ? "fill-amber-400 text-amber-500" : "text-muted-foreground")} />
          )}
        </Button>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      sortable: true,
      sortValue: (r) => r.updatedAt,
      hideBelow: "md",
      render: (r) => <span className="text-sm text-muted-foreground">{format(new Date(r.updatedAt), "MMM d, yyyy")}</span>,
    },
    {
      key: "createdBy",
      header: "Created By",
      hideBelow: "xl",
      render: (r) => <span className="text-sm text-muted-foreground">{r.createdBy}</span>,
    },
  ];

  const rowActions = (r: Service) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${r.name}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => window.open(`/marketplace/${r.slug}`, "_blank")}>
          <ExternalLink className="h-4 w-4" /> View public page
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/services/${r.id}`)}>
          <Pencil className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const copy = duplicateService(r.id);
            toast({
              title: "Service duplicated",
              description: copy ? `"${copy.name}" created as a draft.` : undefined,
            });
          }}
        >
          <Copy className="h-4 w-4" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {r.status !== "published" ? (
          <DropdownMenuItem
            onClick={() => {
              setServiceStatus(r.id, "published");
              toast({ title: "Service published", description: `"${r.name}" is now live on the marketplace.` });
            }}
          >
            <Globe className="h-4 w-4" /> Publish
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              setServiceStatus(r.id, "draft");
              toast({ title: "Service unpublished", description: `"${r.name}" was moved back to draft.` });
            }}
          >
            <Globe className="h-4 w-4" /> Unpublish
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          disabled={r.status === "archived"}
          onClick={() => {
            setServiceStatus(r.id, "archived" as ServiceStatus);
            toast({ title: "Service archived", description: `"${r.name}" was archived.` });
          }}
        >
          <Archive className="h-4 w-4" /> Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => confirmDelete(r)}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (!hydrated) {
    return (
      <div>
        <Skeleton className="mb-6 h-9 w-72" />
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage the marketplace catalog — create, publish, feature, and archive services."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <MarketplaceSectionLinks current="services" />
            <Button asChild size="sm">
              <Link href="/admin/services/new">
                <Plus className="h-4 w-4" /> Add Service
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stat filter chips */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {chips.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={chip.onClick}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              chip.active
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {chip.label}
            <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold tabular-nums text-foreground">
              {chip.count}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["name"]}
        searchPlaceholder="Search services…"
        pageSize={8}
        rowActions={rowActions}
        emptyState={
          <EmptyState
            icon={Pencil}
            title={filtersActive ? "No services match these filters" : "No services yet"}
            description={
              filtersActive
                ? "Try a different status, category, or clear the filters."
                : "Create your first service to publish it to the marketplace."
            }
            action={
              filtersActive
                ? { label: "Clear filters", onClick: clearFilters }
                : { label: "Add Service", onClick: () => router.push("/admin/services/new") }
            }
          />
        }
        toolbar={
          <>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-[200px]" aria-label="Filter by category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <ConfirmDialog state={state} onClose={close} />
    </div>
  );
}
