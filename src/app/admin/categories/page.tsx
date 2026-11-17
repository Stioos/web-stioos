"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ExternalLink, Loader2, MoreHorizontal, Pencil, Plus, Star, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import type { Category } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Icon } from "@/components/shared/icon";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";

const GRADIENTS = [
  "from-blue-600 to-cyan-500", "from-emerald-600 to-teal-500", "from-amber-500 to-orange-600",
  "from-violet-600 to-purple-500", "from-rose-500 to-orange-500", "from-cyan-600 to-teal-500",
  "from-fuchsia-600 to-pink-500", "from-slate-700 to-slate-900",
];

const ICON_OPTIONS = [
  "Layers", "Bot", "Workflow", "Cpu", "BarChart3", "Target", "Building2",
  "Lightbulb", "Palette", "Rocket", "Globe", "Database", "CloudCog",
  "ShieldCheck", "Briefcase", "Factory", "LineChart", "Network",
  "Handshake", "MessageSquare",
];

const gradientFor = (id: string, index: number) => {
  // deterministic per-category gradient
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  void index;
  return GRADIENTS[hash % GRADIENTS.length];
};

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] animate-pulse rounded-lg bg-muted/40" />}>
      <CategoriesInner />
    </Suspense>
  );
}

function CategoriesInner() {
  const router = useRouter();
  const search = useSearchParams();
  const hydrated = useHydrated();

  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const services = useAppStore((s) => s.services);
  const updateCategory = useAppStore((s) => s.updateCategory);
  const deleteCategory = useAppStore((s) => s.deleteCategory);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  // Auto-open the Add dialog when deep-linked with ?new=1 (fresh client mount)
  const [dialogOpen, setDialogOpen] = useState(() => search.get("new") === "1");
  const [editing, setEditing] = useState<Category | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const { confirm, close, state } = useConfirmDialog();

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    if (search.get("new") === "1") router.replace("/admin/categories");
  };

  const subCount = (catId: string) => subcategories.filter((s) => s.categoryId === catId).length;
  const svcCount = (catId: string) => services.filter((s) => s.categoryId === catId).length;

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
      total: categories.length,
      active: categories.filter((c) => c.status === "active").length,
      disabled: categories.filter((c) => c.status === "disabled").length,
      services: services.length,
    }),
    [categories, services.length]
  );

  const filtered = useMemo(
    () => categories.filter((c) => statusFilter === "all" || c.status === statusFilter),
    [categories, statusFilter]
  );

  const chips = [
    { label: "Total", count: counts.total, active: statusFilter === "all", onClick: () => setStatusFilter("all") },
    { label: "Active", count: counts.active, active: statusFilter === "active", onClick: () => setStatusFilter(statusFilter === "active" ? "all" : "active") },
    { label: "Disabled", count: counts.disabled, active: statusFilter === "disabled", onClick: () => setStatusFilter(statusFilter === "disabled" ? "all" : "disabled") },
  ];

  const confirmDelete = (cat: Category) => {
    const svc = svcCount(cat.id);
    const subs = subCount(cat.id);
    if (svc > 0) {
      toast({
        title: "Cannot delete category",
        description: `Reassign ${svc} service${svc === 1 ? "" : "s"} first.`,
        variant: "destructive",
      });
      return;
    }
    confirm({
      title: "Delete category?",
      description:
        subs > 0
          ? `This will also delete ${subs} subcategor${subs === 1 ? "y" : "ies"} under "${cat.name}". This cannot be undone.`
          : `"${cat.name}" will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        deleteCategory(cat.id);
        toast({ title: "Category deleted", description: `"${cat.name}" was permanently removed.` });
      },
    });
  };

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Category",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-white",
              gradientFor(r.id, 0)
            )}
          >
            <Icon name={r.icon} className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.tagline}</p>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (r) => (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">{r.slug}</code>
      ),
    },
    {
      key: "subcategories",
      header: "Subcategories",
      sortable: true,
      sortValue: (r) => subCount(r.id),
      hideBelow: "md",
      render: (r) => (
        <Link
          href={`/admin/subcategories?category=${r.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          aria-label={`Manage ${subCount(r.id)} subcategories for ${r.name}`}
        >
          {subCount(r.id)} <ExternalLink className="h-3 w-3" />
        </Link>
      ),
    },
    {
      key: "services",
      header: "Services",
      sortable: true,
      sortValue: (r) => svcCount(r.id),
      hideBelow: "lg",
      render: (r) => <span className="text-sm tabular-nums text-muted-foreground">{svcCount(r.id)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <EntityStatusBadge status={r.status} />
          <Switch
            checked={r.status === "active"}
            disabled={pending === `status-${r.id}`}
            aria-label={`Toggle ${r.name} active`}
            onCheckedChange={(v) =>
              runAction(
                `status-${r.id}`,
                () => updateCategory(r.id, { status: v ? "active" : "disabled" }),
                {
                  title: v ? "Category activated" : "Category disabled",
                  description: `"${r.name}" is now ${v ? "active" : "disabled"}.`,
                }
              )
            }
          />
        </div>
      ),
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
              () => updateCategory(r.id, { featured: !r.featured }),
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
  ];

  const rowActions = (r: Category) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for ${r.name}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => { setEditing(r); setDialogOpen(true); }}>
          <Pencil className="h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => confirmDelete(r)}>
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (!hydrated) {
    return (
      <div>
        <Skeleton className="mb-6 h-9 w-72" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Marketplace divisions that group services and their subcategories."
        actions={
          <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
          Total services covered
          <span className="rounded-full bg-muted px-1.5 text-[10px] font-semibold tabular-nums text-foreground">
            {counts.services}
          </span>
        </span>
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["name", "slug"]}
        searchPlaceholder="Search categories…"
        pageSize={10}
        rowActions={rowActions}
        emptyState={
          <EmptyState
            icon={Pencil}
            title={statusFilter !== "all" ? "No categories match this filter" : "No categories yet"}
            description={
              statusFilter !== "all"
                ? "Try a different status filter."
                : "Create a category to start grouping services."
            }
            action={{ label: "Add Category", onClick: () => { setEditing(null); setDialogOpen(true); } }}
          />
        }
      />

      {dialogOpen && (
        <CategoryDialog
          key={editing?.id ?? "new"}
          initial={editing}
          onClose={closeDialog}
        />
      )}

      <ConfirmDialog state={state} onClose={close} />
    </div>
  );
}

// ---------- Add / Edit dialog ----------

function CategoryDialog({
  initial,
  onClose,
}: {
  initial: Category | null;
  onClose: () => void;
}) {
  const addCategory = useAppStore((s) => s.addCategory);
  const updateCategory = useAppStore((s) => s.updateCategory);

  const [open, setOpen] = useState(true);
  // Seeded on mount — parent remounts this dialog per add/edit target
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [tagline, setTagline] = useState(initial?.tagline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "Layers");
  const [status, setStatus] = useState(initial ? initial.status === "active" : true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const slugify = (v: string) =>
    v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const save = () => {
    if (!name.trim()) { setError("Category name is required."); return; }
    setError("");
    setSaving(true);
    window.setTimeout(() => {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        tagline: tagline.trim(),
        description: description.trim(),
        icon,
        status: (status ? "active" : "disabled") as Category["status"],
        featured,
      };
      if (initial) {
        updateCategory(initial.id, payload);
        toast({ title: "Category updated", description: `"${payload.name}" was saved successfully.` });
      } else {
        const created = addCategory(payload);
        toast({ title: "Category created", description: `"${created.name}" is ready for subcategories.` });
      }
      setSaving(false);
      onClose();
    }, 600);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update the division details shown across the marketplace."
              : "Create a top-level division that groups services and subcategories."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slugEdited) setSlug(slugify(e.target.value));
                  if (error) setError("");
                }}
                placeholder="e.g. Cybersecurity"
                aria-invalid={!!error}
              />
              {error && <p className="text-xs font-medium text-red-600">{error}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug (auto)</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => { setSlugEdited(true); setSlug(e.target.value); }}
                placeholder="cybersecurity"
                className="font-mono text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-tagline">Tagline</Label>
            <Input
              id="cat-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One-line positioning statement"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea
              id="cat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Short description shown on the category page"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger className="w-full" aria-label="Category icon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {ICON_OPTIONS.map((n) => (
                    <SelectItem key={n} value={n}>
                      <Icon name={n} className="h-4 w-4" /> {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="cat-status" className="text-sm font-normal">Active</Label>
                <Switch id="cat-status" checked={status} onCheckedChange={setStatus} />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="cat-featured" className="text-sm font-normal">Featured</Label>
                <Switch id="cat-featured" checked={featured} onCheckedChange={setFeatured} />
              </div>
            </div>
          </div>
          {initial && (
            <div className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br text-white", gradientFor(initial.id, 0))}>
                <Icon name={icon} className="h-5 w-5" />
              </div>
              <div className="min-w-0 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Preview</p>
                <p className="truncate">How the icon tile appears in listings.</p>
              </div>
              <Badge variant="secondary" className="ml-auto shrink-0">{initial.status}</Badge>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => { setOpen(false); onClose(); }} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {initial ? "Save Changes" : "Create Category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
