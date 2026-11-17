"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Info, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { FAQS } from "@/data/content";
import type { FaqItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/page-header";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog, useConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["General", "Marketplace", "Pricing", "Delivery"];
const uid = () => `faq-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

interface FaqForm {
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft";
}

const EMPTY_FORM: FaqForm = { question: "", answer: "", category: "General", status: "draft" };

export default function FaqsAdminPage() {
  const { toast } = useToast();
  const { confirm, close, state } = useConfirmDialog();

  const [faqs, setFaqs] = useState<FaqItem[]>(() => structuredClone(FAQS));
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FaqForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = faqs
      .filter((f) => categoryFilter === "all" || f.category === categoryFilter)
      .filter((f) => !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
      .sort((a, b) => a.order - b.order);
    const map = new Map<string, FaqItem[]>();
    for (const f of list) {
      const arr = map.get(f.category) ?? [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return Array.from(map.entries());
  }, [faqs, query, categoryFilter]);

  const visibleCount = grouped.reduce((a, [, items]) => a + items.length, 0);

  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setDialogOpen(true); };

  const openEdit = (row: FaqItem) => {
    setEditingId(row.id);
    setForm({ question: row.question, answer: row.answer, category: row.category, status: row.status });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.question.trim() || form.answer.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Missing details",
        description: "A question and an answer of at least 10 characters are required.",
      });
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      if (editingId) {
        setFaqs((list) => list.map((f) => (f.id === editingId ? { ...f, ...form, question: form.question.trim() } : f)));
        toast({ title: "FAQ updated", description: "The question was saved successfully." });
      } else {
        const maxOrder = faqs.reduce((a, f) => Math.max(a, f.order), 0);
        const created: FaqItem = {
          id: uid(),
          question: form.question.trim(),
          answer: form.answer.trim(),
          category: form.category,
          status: form.status,
          order: maxOrder + 1,
        };
        setFaqs((list) => [...list, created]);
        toast({ title: "FAQ added", description: "The new question was added to the library." });
      }
      setSaving(false);
      setDialogOpen(false);
    }, 600);
  };

  const requestDelete = (row: FaqItem) => {
    confirm({
      title: "Delete FAQ",
      description: `"${row.question}" will be removed from the public FAQ page.`,
      confirmLabel: "Delete FAQ",
      onConfirm: () => {
        setFaqs((list) => list.filter((f) => f.id !== row.id));
        toast({ title: "FAQ deleted", description: "The question was removed." });
      },
    });
  };

  const move = (row: FaqItem, dir: -1 | 1) => {
    setFaqs((list) => {
      const sorted = [...list].sort((a, b) => a.order - b.order);
      const siblings = sorted.filter((f) => f.category === row.category);
      const idx = siblings.findIndex((f) => f.id === row.id);
      const swapWith = siblings[idx + dir];
      if (!swapWith) return list;
      return list.map((f) => {
        if (f.id === row.id) return { ...f, order: swapWith.order };
        if (f.id === swapWith.id) return { ...f, order: row.order };
        return f;
      });
    });
  };

  const toggleStatus = (row: FaqItem) => {
    const next = row.status === "published" ? "draft" : "published";
    setFaqs((list) => list.map((f) => (f.id === row.id ? { ...f, status: next } : f)));
    toast({
      title: next === "published" ? "FAQ published" : "FAQ hidden",
      description: next === "published" ? "The question is now visible on the FAQ page." : "The question is now hidden from visitors.",
    });
  };

  return (
    <div>
      <PageHeader
        title="FAQs"
        description="Public FAQ library shown on the Resources → FAQs page."
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add FAQ
          </Button>
        }
      />

      <p className="mb-4 flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Demo workspace — FAQ edits update this interface for the session but are not persisted to the database.
      </p>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions…" className="pl-8 h-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground sm:ml-auto">{visibleCount} of {faqs.length} questions</p>
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          title="No FAQs match your filters"
          description="Try a different search term or category, or add a new question."
          action={{ label: "Add FAQ", onClick: openAdd }}
        />
      ) : (
        <div className="space-y-5">
          {grouped.map(([category, items]) => (
            <div key={category} className="overflow-hidden rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</p>
                <p className="text-xs text-muted-foreground">{items.length} question{items.length === 1 ? "" : "s"}</p>
              </div>
              <Accordion type="multiple" className="px-4">
                {items.map((row) => (
                  <AccordionItem key={row.id} value={row.id}>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <button
                          onClick={() => move(row, -1)}
                          disabled={row === items[0]}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-25"
                          aria-label="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => move(row, 1)}
                          disabled={row === items[items.length - 1]}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-25"
                          aria-label="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <AccordionTrigger className="flex-1 py-3 text-left hover:no-underline">
                        <span className="pr-2 text-sm font-medium">{row.question}</span>
                      </AccordionTrigger>
                      <div className="flex shrink-0 items-center gap-1">
                        <EntityStatusBadge status={row.status} />
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => toggleStatus(row)}>
                          {row.status === "published" ? "Hide" : "Publish"}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)} aria-label={`Edit ${row.question}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => requestDelete(row)} aria-label={`Delete ${row.question}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <AccordionContent className="pb-4">
                      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{row.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the question and answer below." : "Add a new question to the public FAQ library."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-2">
              <Label htmlFor="faq-q">Question</Label>
              <Input id="faq-q" value={form.question} placeholder="e.g. How does the marketplace work?"
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faq-a">Answer ({form.answer.length})</Label>
              <Textarea id="faq-a" rows={4} value={form.answer}
                placeholder="Clear, complete answer shown in the accordion."
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as FaqForm["status"] }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog state={state} onClose={close} />
    </div>
  );
}
