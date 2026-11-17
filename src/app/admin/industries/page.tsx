"use client";

import { useMemo, useState } from "react";
import { Info, Pencil, Plus, Trash2 } from "lucide-react";

import { INDUSTRIES } from "@/data/content";
import type { Industry } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import type { Column } from "@/components/shared/data-table";
import { Icon } from "@/components/shared/icon";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ICON_OPTIONS = [
  "HardHat", "Factory", "Cpu", "Landmark", "ShoppingCart", "Cog", "Briefcase",
  "DraftingCompass", "Rocket", "Building2", "Bot", "Database", "LineChart",
  "Globe", "Workflow", "ShieldCheck", "CloudCog", "HeartHandshake", "Package",
  "GraduationCap",
];

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const uid = () => `ind-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

interface IndustryForm {
  name: string;
  icon: string;
  description: string;
}

const EMPTY_FORM: IndustryForm = { name: "", icon: "Layers", description: "" };

export default function IndustriesAdminPage() {
  const { toast } = useToast();
  const { confirm, close, state } = useConfirmDialog();

  // Local state initialized from static data — edits update the UI but do not persist.
  const [industries, setIndustries] = useState<Industry[]>(() => structuredClone(INDUSTRIES));

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IndustryForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const activeCount = useMemo(() => industries.filter((i) => i.status === "active").length, [industries]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (row: Industry) => {
    setEditingId(row.id);
    setForm({ name: row.name, icon: row.icon, description: row.description });
    setDialogOpen(true);
  };

  const saveIndustry = () => {
    if (!form.name.trim()) {
      toast({
        variant: "destructive",
        title: "Name required",
        description: "Provide a name for the industry before saving.",
      });
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      if (editingId) {
        setIndustries((list) =>
          list.map((i) =>
            i.id === editingId
              ? { ...i, name: form.name.trim(), slug: slugify(form.name), icon: form.icon, description: form.description }
              : i
          )
        );
        toast({ title: "Industry updated", description: `"${form.name.trim()}" was saved successfully.` });
      } else {
        const created: Industry = {
          id: uid(),
          name: form.name.trim(),
          slug: slugify(form.name),
          icon: form.icon,
          description: form.description,
          servicesCount: 0,
          status: "active",
        };
        setIndustries((list) => [created, ...list]);
        toast({ title: "Industry added", description: `"${created.name}" is now available for targeting.` });
      }
      setSaving(false);
      setDialogOpen(false);
    }, 600);
  };

  const requestDelete = (row: Industry) => {
    confirm({
      title: "Delete industry",
      description: `"${row.name}" will be removed from the industries list. This action cannot be undone within this session.`,
      confirmLabel: "Delete industry",
      onConfirm: () => {
        setIndustries((list) => list.filter((i) => i.id !== row.id));
        toast({ title: "Industry deleted", description: `"${row.name}" was removed.` });
      },
    });
  };

  const toggleStatus = (row: Industry) => {
    const next = row.status === "active" ? "disabled" : "active";
    setIndustries((list) => list.map((i) => (i.id === row.id ? { ...i, status: next } : i)));
    toast({
      title: next === "active" ? "Industry activated" : "Industry disabled",
      description: `"${row.name}" is now ${next === "active" ? "visible" : "hidden"} across the marketplace.`,
    });
  };

  const columns: Column<Industry>[] = [
    {
      key: "icon",
      header: "Icon",
      render: (r) => (
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
          <Icon name={r.icon} className="h-4 w-4" />
        </span>
      ),
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
          <p className="max-w-72 truncate text-xs text-muted-foreground">{r.description}</p>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      hideBelow: "md",
      render: (r) => <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.slug}</code>,
    },
    {
      key: "servicesCount",
      header: "Services",
      sortable: true,
      sortValue: (r) => r.servicesCount,
      render: (r) => <span className="text-sm font-semibold text-foreground">{r.servicesCount}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Switch checked={r.status === "active"} onCheckedChange={() => toggleStatus(r)} aria-label={`Toggle ${r.name}`} />
          <span className="text-xs text-muted-foreground">{r.status === "active" ? "Active" : "Disabled"}</span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Industries"
        description="Industry segments used for service targeting and marketplace filtering."
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Industry
          </Button>
        }
      />

      <p className="mb-4 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Demo workspace — industry edits update this interface for the session but are not persisted to the database.
      </p>

      <DataTable
        data={industries}
        columns={columns}
        searchKeys={["name", "slug", "description"]}
        searchPlaceholder="Search industries…"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)} aria-label={`Edit ${row.name}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700"
              onClick={() => requestDelete(row)}
              aria-label={`Delete ${row.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="font-medium text-foreground">No industries found</p>
            <p className="text-sm text-muted-foreground">Add an industry to start targeting services.</p>
          </div>
        }
      />

      <div className="mt-3 text-xs text-muted-foreground">
        {industries.length} industries · {activeCount} active
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit industry" : "Add industry"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Update the name, icon, or description for this industry."
                : "Create a new industry segment for service targeting."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="ind-name">Name</Label>
              <Input
                id="ind-name"
                value={form.name}
                placeholder="e.g. Healthcare"
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm((f) => ({ ...f, icon: v }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <span className="flex items-center gap-2">
                        <Icon name={icon} className="h-4 w-4" /> {icon}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ind-desc">Description</Label>
              <Textarea
                id="ind-desc"
                rows={3}
                value={form.description}
                placeholder="Short summary of the industry focus."
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            {form.name.trim() && (
              <p className="text-xs text-muted-foreground">
                Slug preview: <code className="rounded bg-muted px-1.5 py-0.5">{slugify(form.name)}</code>
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveIndustry} disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Add industry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog state={state} onClose={close} />
    </div>
  );
}
