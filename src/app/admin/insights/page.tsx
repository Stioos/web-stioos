"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Info, Pencil, Plus, Trash2 } from "lucide-react";

import { INSIGHTS } from "@/data/content";
import type { Insight } from "@/types";
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

const CATEGORIES = ["AI Strategy", "Automation", "Data & BI", "Enterprise", "Brand & Design", "Startup Ops"];
const ACCENTS = [
  "from-blue-600 to-cyan-500",
  "from-emerald-600 to-teal-500",
  "from-indigo-600 to-blue-500",
  "from-rose-500 to-orange-500",
  "from-violet-600 to-fuchsia-500",
  "from-amber-500 to-red-500",
];
const AUTHORS = ["Aarav Mehta", "Priya Nair", "Rohan Gupta", "Sana Kapoor", "Vikram Shah", "Neha Verma"];

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const uid = () => `ins-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

interface InsightForm {
  title: string;
  category: string;
  author: string;
  readTime: string;
  excerpt: string;
  content: string;
  status: "published" | "draft";
  accent: string;
}

const EMPTY_FORM: InsightForm = {
  title: "", category: CATEGORIES[0], author: AUTHORS[0], readTime: "6 min",
  excerpt: "", content: "", status: "draft", accent: ACCENTS[0],
};

export default function InsightsAdminPage() {
  const { toast } = useToast();
  const { confirm, close, state } = useConfirmDialog();

  const [insights, setInsights] = useState<Insight[]>(() => structuredClone(INSIGHTS));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InsightForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const publishedCount = useMemo(() => insights.filter((i) => i.status === "published").length, [insights]);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setDialogOpen(true); };

  const openEdit = (row: Insight) => {
    setEditingId(row.id);
    setForm({
      title: row.title, category: row.category, author: row.author, readTime: row.readTime,
      excerpt: row.excerpt, content: row.content, status: row.status, accent: row.accent,
    });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.title.trim() || form.excerpt.trim().length < 20) {
      toast({
        variant: "destructive",
        title: "Missing details",
        description: "A title and an excerpt of at least 20 characters are required.",
      });
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      if (editingId) {
        setInsights((list) =>
          list.map((i) => (i.id === editingId ? { ...i, ...form, title: form.title.trim(), slug: i.slug } : i))
        );
        toast({ title: "Insight updated", description: `"${form.title.trim()}" was saved.` });
      } else {
        const created: Insight = {
          id: uid(),
          title: form.title.trim(),
          slug: slugify(form.title),
          category: form.category,
          excerpt: form.excerpt.trim(),
          content: form.content,
          author: form.author,
          readTime: form.readTime,
          publishedAt: new Date().toISOString().slice(0, 10),
          status: form.status,
          accent: form.accent,
        };
        setInsights((list) => [created, ...list]);
        toast({ title: "Insight created", description: `"${created.title}" added as ${created.status}.` });
      }
      setSaving(false);
      setDialogOpen(false);
    }, 600);
  };

  const requestDelete = (row: Insight) => {
    confirm({
      title: "Delete insight",
      description: `"${row.title}" will be permanently removed from the insights library.`,
      confirmLabel: "Delete insight",
      onConfirm: () => {
        setInsights((list) => list.filter((i) => i.id !== row.id));
        toast({ title: "Insight deleted", description: `"${row.title}" was removed.` });
      },
    });
  };

  const toggleStatus = (row: Insight) => {
    const next = row.status === "published" ? "draft" : "published";
    setInsights((list) => list.map((i) => (i.id === row.id ? { ...i, status: next } : i)));
    toast({
      title: next === "published" ? "Insight published" : "Moved to draft",
      description: `"${row.title}" is now ${next === "published" ? "live on the site" : "hidden from readers"}.`,
    });
  };

  const columns: Column<Insight>[] = [
    {
      key: "title",
      header: "Insight",
      sortable: true,
      sortValue: (r) => r.title,
      render: (r) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className={`h-9 w-9 shrink-0 rounded-md bg-gradient-to-br ${r.accent}`} aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
            <p className="max-w-80 truncate text-xs text-muted-foreground">{r.excerpt}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      hideBelow: "md",
      render: (r) => (
        <span className="inline-flex rounded-full bg-blue-600/10 px-2.5 py-0.5 text-xs font-medium text-blue-700">
          {r.category}
        </span>
      ),
    },
    { key: "author", header: "Author", hideBelow: "lg", render: (r) => <span className="text-sm">{r.author}</span> },
    {
      key: "status",
      header: "Status",
      render: (r) => <EntityStatusBadge status={r.status} />,
    },
    {
      key: "publishedAt",
      header: "Published",
      sortable: true,
      sortValue: (r) => r.publishedAt,
      hideBelow: "md",
      render: (r) => <span className="text-sm text-muted-foreground">{r.publishedAt}</span>,
    },
    { key: "readTime", header: "Read", hideBelow: "xl", render: (r) => <span className="text-sm text-muted-foreground">{r.readTime}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Insights"
        description="Editorial insights published to the public Insights library."
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> New Insight
          </Button>
        }
      />

      <p className="mb-4 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Demo workspace — insight edits update this interface for the session but are not persisted to the database.
      </p>

      <DataTable
        data={insights}
        columns={columns}
        searchKeys={["title", "excerpt", "author", "category"]}
        searchPlaceholder="Search insights…"
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1">
            {row.status === "published" && (
              <Button
                variant="ghost" size="icon" className="h-8 w-8" aria-label={`View ${row.title}`}
                onClick={() => window.open(`/insights/${row.slug}`, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
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
            <p className="font-medium text-foreground">No insights found</p>
            <p className="text-sm text-muted-foreground">Publish your first insight to share intelligence with readers.</p>
          </div>
        }
      />

      <div className="mt-3 text-xs text-muted-foreground">
        {insights.length} insights · {publishedCount} published · {insights.length - publishedCount} drafts
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit insight" : "New insight"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the article details below." : "Draft a new editorial insight for the library."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-1 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ins-title">Title</Label>
              <Input id="ins-title" value={form.title} placeholder="e.g. The Agentic AI Adoption Playbook"
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Select value={form.author} onValueChange={(v) => setForm((f) => ({ ...f, author: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUTHORS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ins-read">Read time</Label>
              <Input id="ins-read" value={form.readTime} placeholder="e.g. 6 min"
                onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as InsightForm["status"] }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ins-excerpt">Excerpt ({form.excerpt.length}/200)</Label>
              <Textarea id="ins-excerpt" rows={2} value={form.excerpt} maxLength={200}
                placeholder="One-paragraph summary shown on cards and search results."
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ins-content">Content</Label>
              <Textarea id="ins-content" rows={8} value={form.content}
                placeholder={"Full article body. Separate paragraphs with a blank line."}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
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
              {saving ? "Saving…" : editingId ? "Save changes" : "Create insight"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog state={state} onClose={close} />
    </div>
  );
}
