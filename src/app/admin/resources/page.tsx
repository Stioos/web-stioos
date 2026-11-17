"use client";

import { useMemo, useState } from "react";
import { Download, Info, Pencil, Plus, Trash2 } from "lucide-react";

import { RESOURCES } from "@/data/content";
import type { Resource } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import type { Column } from "@/components/shared/data-table";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const TYPES: Resource["type"][] = ["guide", "whitepaper", "checklist", "case_study", "template"];
const ACCENTS = [
  "from-blue-600 to-cyan-500",
  "from-emerald-600 to-teal-500",
  "from-indigo-600 to-violet-500",
  "from-orange-500 to-red-500",
  "from-rose-500 to-pink-500",
  "from-teal-500 to-green-500",
];

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const uid = () => `res-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const typeLabel = (t: Resource["type"]) => t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

interface ResourceForm {
  title: string;
  type: Resource["type"];
  description: string;
  fileFormat: string;
  size: string;
  status: "published" | "draft";
  accent: string;
}

const EMPTY_FORM: ResourceForm = {
  title: "", type: "guide", description: "", fileFormat: "PDF", size: "1.0 MB",
  status: "draft", accent: ACCENTS[0],
};

export default function ResourcesAdminPage() {
  const { toast } = useToast();
  const { confirm, close, state } = useConfirmDialog();

  const [resources, setResources] = useState<Resource[]>(() => structuredClone(RESOURCES));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ResourceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const totalDownloads = useMemo(() => resources.reduce((a, r) => a + r.downloads, 0), [resources]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setDialogOpen(true); };

  const openEdit = (row: Resource) => {
    setEditingId(row.id);
    setForm({
      title: row.title, type: row.type, description: row.description,
      fileFormat: row.fileFormat, size: row.size, status: row.status, accent: row.accent,
    });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.title.trim() || form.description.trim().length < 15) {
      toast({
        variant: "destructive",
        title: "Missing details",
        description: "A title and a description of at least 15 characters are required.",
      });
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      if (editingId) {
        setResources((list) =>
          list.map((r) => (r.id === editingId ? { ...r, ...form, title: form.title.trim() } : r))
        );
        toast({ title: "Resource updated", description: `"${form.title.trim()}" was saved.` });
      } else {
        const created: Resource = {
          id: uid(),
          title: form.title.trim(),
          slug: slugify(form.title),
          type: form.type,
          description: form.description.trim(),
          fileFormat: form.fileFormat,
          size: form.size,
          downloads: 0,
          publishedAt: new Date().toISOString().slice(0, 10),
          status: form.status,
          accent: form.accent,
        };
        setResources((list) => [created, ...list]);
        toast({ title: "Resource created", description: `"${created.title}" added as ${created.status}.` });
      }
      setSaving(false);
      setDialogOpen(false);
    }, 600);
  };

  const requestDelete = (row: Resource) => {
    confirm({
      title: "Delete resource",
      description: `"${row.title}" will be removed from the public resources library.`,
      confirmLabel: "Delete resource",
      onConfirm: () => {
        setResources((list) => list.filter((r) => r.id !== row.id));
        toast({ title: "Resource deleted", description: `"${row.title}" was removed.` });
      },
    });
  };

  const toggleStatus = (row: Resource) => {
    const next = row.status === "published" ? "draft" : "published";
    setResources((list) => list.map((r) => (r.id === row.id ? { ...r, status: next } : r)));
    toast({
      title: next === "published" ? "Resource published" : "Moved to draft",
      description: `"${row.title}" is now ${next === "published" ? "available for download" : "hidden from visitors"}.`,
    });
  };

  const columns: Column<Resource>[] = [
    {
      key: "title",
      header: "Resource",
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${r.accent} text-[10px] font-bold text-white`}>
            {r.fileFormat}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
            <p className="max-w-80 truncate text-xs text-muted-foreground">{r.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (r) => (
        <span className="inline-flex rounded-full bg-violet-600/10 px-2.5 py-0.5 text-xs font-medium capitalize text-violet-700">
          {typeLabel(r.type)}
        </span>
      ),
    },
    { key: "fileFormat", header: "Format", hideBelow: "md", render: (r) => <span className="text-sm">{r.fileFormat} · {r.size}</span> },
    {
      key: "downloads",
      header: "Downloads",
      sortable: true,
      sortValue: (r) => r.downloads,
      hideBelow: "md",
      render: (r) => <span className="text-sm font-semibold">{r.downloads.toLocaleString()}</span>,
    },
    { key: "status", header: "Status", render: (r) => <EntityStatusBadge status={r.status} /> },
    {
      key: "publishedAt",
      header: "Published",
      sortable: true,
      sortValue: (r) => r.publishedAt,
      hideBelow: "lg",
      render: (r) => <span className="text-sm text-muted-foreground">{r.publishedAt}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Resources"
        description="Downloadable guides, templates, and case studies offered on the public Resources library."
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Resource
          </Button>
        }
      />

      <p className="mb-4 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Demo workspace — resource edits update this interface for the session but are not persisted to the database.
      </p>

      <DataTable
        data={resources}
        columns={columns}
        searchKeys={["title", "description", "type"]}
        searchPlaceholder="Search resources…"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost" size="icon" className="h-8 w-8" aria-label={`Download ${row.title}`}
              onClick={() => toast({ title: "Download started", description: `Preparing "${row.title}" (${row.fileFormat}).` })}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="sm" className="h-8 px-2 text-xs"
              onClick={() => toggleStatus(row)}
            >
              {row.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)} aria-label={`Edit ${row.title}`}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700"
              onClick={() => requestDelete(row)} aria-label={`Delete ${row.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="font-medium text-foreground">No resources found</p>
            <p className="text-sm text-muted-foreground">Add a downloadable resource to grow your library.</p>
          </div>
        }
      />

      <div className="mt-3 text-xs text-muted-foreground">
        {resources.length} resources · {resources.filter((r) => r.status === "published").length} published ·{" "}
        {totalDownloads.toLocaleString()} total downloads
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit resource" : "Add resource"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the resource details below." : "Add a new downloadable resource to the library."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-1 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="res-title">Title</Label>
              <Input id="res-title" value={form.title} placeholder="e.g. AI Governance Checklist"
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as Resource["type"] }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => <SelectItem key={t} value={t}>{typeLabel(t)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as ResourceForm["status"] }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="res-format">File format</Label>
              <Input id="res-format" value={form.fileFormat} placeholder="PDF"
                onChange={(e) => setForm((f) => ({ ...f, fileFormat: e.target.value.toUpperCase() }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="res-size">File size</Label>
              <Input id="res-size" value={form.size} placeholder="1.2 MB"
                onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="res-desc">Description ({form.description.length})</Label>
              <Textarea id="res-desc" rows={3} value={form.description} maxLength={220}
                placeholder="What the reader gets and why it matters."
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Accent color</Label>
              <div className="flex flex-wrap gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a} type="button" aria-label={`Accent ${a}`}
                    onClick={() => setForm((f) => ({ ...f, accent: a }))}
                    className={`h-8 w-12 rounded-md bg-gradient-to-br ${a} ring-offset-2 transition-all ${form.accent === a ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Add resource"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog state={state} onClose={close} />
    </div>
  );
}
