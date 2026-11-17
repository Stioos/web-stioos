"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import type { Category, Subcategory } from "@/types";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { Icon } from "@/components/shared/icon";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";

export default function AdminSubcategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] animate-pulse rounded-lg bg-muted/40" />}>
      <SubcategoriesInner />
    </Suspense>
  );
}

function SubcategoriesInner() {
  const router = useRouter();
  const search = useSearchParams();
  const hydrated = useHydrated();

  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const services = useAppStore((s) => s.services);
  const updateSubcategory = useAppStore((s) => s.updateSubcategory);
  const deleteSubcategory = useAppStore((s) => s.deleteSubcategory);

  const categoryFilter = search.get("category") ?? "all";
  const setCategoryFilter = (v: string) =>
    router.replace(v === "all" ? "/admin/subcategories" : `/admin/subcategories?category=${v}`, { scroll: false });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [presetCategory, setPresetCategory] = useState<string>("");
  const [pending, setPending] = useState<string | null>(null);
  const { confirm, close, state } = useConfirmDialog();

  const svcCount = (subId: string) => services.filter((s) => s.subcategoryId === subId).length;

  const runAction = (key: string, fn: () => void, t: { title: string; description?: string }) => {
    if (pending) return;
    setPending(key);
    window.setTimeout(() => {
      fn();
      setPending(null);
      toast(t);
    }, 300);
  };

  const visibleCategories = useMemo(
    () =>
      categoryFilter === "all"
        ? categories
        : categories.filter((c) => c.id === categoryFilter),
    [categories, categoryFilter]
  );

  const subsFor = (catId: string) => subcategories.filter((s) => s.categoryId === catId);

  const openAdd = (catId?: string) => {
    setEditing(null);
    setPresetCategory(catId ?? (categoryFilter !== "all" ? categoryFilter : ""));
    setDialogOpen(true);
  };

  const confirmDelete = (sub: Subcategory) => {
    const n = svcCount(sub.id);
    if (n > 0) {
      toast({
        title: "Cannot delete subcategory",
        description: `${n} service${n === 1 ? " is" : "s are"} assigned to "${sub.name}". Reassign ${n === 1 ? "it" : "them"} first.`,
        variant: "destructive",
      });
      return;
    }
    confirm({
      title: "Delete subcategory?",
      description: `"${sub.name}" will be permanently removed from "${categories.find((c) => c.id === sub.categoryId)?.name ?? "its category"}". This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        deleteSubcategory(sub.id);
        toast({ title: "Subcategory deleted", description: `"${sub.name}" was permanently removed.` });
      },
    });
  };

  if (!hydrated) {
    return (
      <div>
        <Skeleton className="mb-6 h-9 w-72" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const totalShown = visibleCategories.reduce((acc, c) => acc + subsFor(c.id).length, 0);

  return (
    <div>
      <PageHeader
        title="Subcategories"
        description="Service groupings inside each marketplace division, grouped below by parent category."
        actions={
          <Button size="sm" onClick={() => openAdd()}>
            <Plus className="h-4 w-4" /> Add Subcategory
          </Button>
        }
      />

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-[230px]" aria-label="Filter by parent category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {totalShown} subcategor{totalShown === 1 ? "y" : "ies"} in {visibleCategories.length} categor{visibleCategories.length === 1 ? "y" : "ies"}
        </p>
      </div>

      <div className="space-y-6">
        {visibleCategories.map((cat) => {
          const subs = subsFor(cat.id);
          return (
            <section key={cat.id} aria-label={`${cat.name} subcategories`}>
              {/* Dark group header */}
              <div className="flex flex-wrap items-center gap-3 rounded-t-lg bg-brand-ink px-4 py-3 sm:px-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                  <Icon name={cat.icon} className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{cat.name}</p>
                  <p className="truncate text-xs text-slate-400">{cat.tagline}</p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
                  {subs.length} {subs.length === 1 ? "subcategory" : "subcategories"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto shrink-0 border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                  onClick={() => openAdd(cat.id)}
                >
                  <Plus className="h-4 w-4" /> Add subcategory
                </Button>
              </div>

              {/* Rows */}
              {subs.length === 0 ? (
                <div className="rounded-b-lg border border-t-0 border-dashed bg-card px-5 py-8 text-center text-sm text-muted-foreground">
                  No subcategories yet for this category.
                </div>
              ) : (
                <div className="divide-y rounded-b-lg border border-t-0 bg-card">
                  {subs.map((sub) => (
                    <div key={sub.id} className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{sub.name}</p>
                          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                            {sub.slug}
                          </code>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{sub.description}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
                        <span className="whitespace-nowrap">
                          {svcCount(sub.id)} service{svcCount(sub.id) === 1 ? "" : "s"}
                        </span>
                        <span className="hidden whitespace-nowrap md:inline">
                          Added {format(new Date(sub.createdAt), "MMM d, yyyy")}
                        </span>
                        <EntityStatusBadge status={sub.status} />
                        <Switch
                          checked={sub.status === "active"}
                          disabled={pending === `status-${sub.id}`}
                          aria-label={`Toggle ${sub.name} active`}
                          onCheckedChange={(v) =>
                            runAction(
                              `status-${sub.id}`,
                              () => updateSubcategory(sub.id, { status: v ? "active" : "disabled" }),
                              {
                                title: v ? "Subcategory activated" : "Subcategory disabled",
                                description: `"${sub.name}" is now ${v ? "active" : "disabled"}.`,
                              }
                            )
                          }
                        />
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            aria-label={`Edit ${sub.name}`}
                            onClick={() => { setEditing(sub); setPresetCategory(sub.categoryId); setDialogOpen(true); }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            aria-label={`Delete ${sub.name}`}
                            onClick={() => confirmDelete(sub)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {visibleCategories.length === 0 && (
        <EmptyState
          icon={Pencil}
          title="No categories found"
          description="Create a category first, then add subcategories to it."
          action={{ label: "Go to Categories", onClick: () => router.push("/admin/categories") }}
        />
      )}

      {dialogOpen && (
        <SubcategoryDialog
          key={editing?.id ?? `new-${presetCategory}`}
          initial={editing}
          presetCategoryId={presetCategory}
          onClose={() => { setDialogOpen(false); setEditing(null); setPresetCategory(""); }}
        />
      )}

      <ConfirmDialog state={state} onClose={close} />
    </div>
  );
}

// ---------- Add / Edit dialog ----------

function SubcategoryDialog({
  initial,
  presetCategoryId,
  onClose,
}: {
  initial: Subcategory | null;
  presetCategoryId: string;
  onClose: () => void;
}) {
  const categories = useAppStore((s) => s.categories);
  const addSubcategory = useAppStore((s) => s.addSubcategory);
  const updateSubcategory = useAppStore((s) => s.updateSubcategory);

  const [open, setOpen] = useState(true);
  // Seeded on mount — parent remounts this dialog per add/edit target
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? presetCategoryId ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState(initial ? initial.status === "active" : true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const save = () => {
    const errs: Record<string, string> = {};
    if (!categoryId) errs.categoryId = "Select a parent category.";
    if (!name.trim()) errs.name = "Subcategory name is required.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    window.setTimeout(() => {
      const payload = {
        categoryId,
        name: name.trim(),
        description: description.trim(),
        status: (status ? "active" : "disabled") as Subcategory["status"],
      };
      if (initial) {
        updateSubcategory(initial.id, payload);
        toast({ title: "Subcategory updated", description: `"${payload.name}" was saved successfully.` });
      } else {
        const created = addSubcategory(payload);
        toast({ title: "Subcategory created", description: `"${created.name}" was added to the category.` });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Subcategory" : "Add Subcategory"}</DialogTitle>
          <DialogDescription>
            {initial
              ? "Update this subcategory's details and visibility."
              : "Create a new grouping inside a parent category."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-1">
          <div className="space-y-2">
            <Label>Parent Category *</Label>
            <Select value={categoryId || undefined} onValueChange={(v) => { setCategoryId(v); setErrors((e) => ({ ...e, categoryId: "" })); }}>
              <SelectTrigger className={cn("w-full", errors.categoryId && "border-red-400")} aria-label="Parent category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c: Category) => (
                  <SelectItem key={c.id} value={c.id}>
                    <Icon name={c.icon} className="h-4 w-4" /> {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && <p className="text-xs font-medium text-red-600">{errors.categoryId}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-name">Name *</Label>
            <Input
              id="sub-name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((er) => ({ ...er, name: "" })); }}
              placeholder="e.g. Chatbot Development"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-xs font-medium text-red-600">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-desc">Description</Label>
            <Textarea
              id="sub-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What kinds of services belong in this group"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="sub-status" className="text-sm font-normal">Active</Label>
            <Switch id="sub-status" checked={status} onCheckedChange={setStatus} />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => { setOpen(false); onClose(); }} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {initial ? "Save Changes" : "Create Subcategory"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
