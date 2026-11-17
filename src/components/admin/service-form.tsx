"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowDown, ArrowUp, ExternalLink, Loader2, Plus, RefreshCw, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore, useCurrentAdmin } from "@/lib/store";
import type { Service, ServiceProcessStep } from "@/types";
import { INDUSTRIES } from "@/data/content";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { AccentTile, Icon } from "@/components/shared/icon";

// ============================================================
// ServiceForm — shared multi-step editor for create + edit
// ============================================================

const TABS = [
  { id: "basic", label: "Basic Information" },
  { id: "classification", label: "Classification" },
  { id: "details", label: "Service Details" },
  { id: "commercial", label: "Commercial" },
  { id: "seo", label: "SEO" },
  { id: "media", label: "Media" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const TAB_ERROR_FIELDS: Record<TabId, string[]> = {
  basic: ["name", "shortDescription"],
  classification: ["categoryId", "subcategoryId"],
  details: ["capabilities", "process"],
  commercial: [],
  seo: [],
  media: [],
};

const GRADIENTS = [
  { value: "from-blue-600 to-cyan-500", label: "Ocean Blue" },
  { value: "from-cyan-600 to-teal-500", label: "Cyan Teal" },
  { value: "from-emerald-600 to-teal-500", label: "Emerald" },
  { value: "from-amber-500 to-orange-600", label: "Amber" },
  { value: "from-rose-500 to-orange-500", label: "Sunset" },
  { value: "from-violet-600 to-purple-500", label: "Violet" },
  { value: "from-fuchsia-600 to-pink-500", label: "Fuchsia" },
  { value: "from-slate-700 to-slate-900", label: "Graphite" },
];

const ICON_OPTIONS = [
  "Bot", "Workflow", "BarChart3", "Globe", "Smartphone", "Plug", "CloudCog",
  "Package", "LineChart", "Users", "Compass", "Target", "Briefcase",
  "MessageSquare", "Contact", "Factory", "ShieldCheck", "HeartHandshake",
  "Lightbulb", "Rocket", "Palette", "PenTool", "Clapperboard", "Calculator",
  "Receipt", "ScanLine", "RefreshCw", "FileSearch", "Headset", "Network",
  "Handshake", "Megaphone", "TrendingUp",
];

const DELIVERY_TYPES = [
  { value: "project", label: "Project" },
  { value: "subscription", label: "Subscription" },
  { value: "retainer", label: "Retainer" },
  { value: "on_demand", label: "On demand" },
  { value: "self_serve", label: "Self-serve" },
] as const;

const slugify = (v: string) =>
  v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const draftFrom = (s?: Service): Partial<Service> =>
  s
    ? { ...s }
    : {
        name: "", slug: "", shortDescription: "", fullDescription: "",
        categoryId: "", subcategoryId: "", tags: [], industries: [],
        problemsSolved: [], capabilities: [], deliverables: [], process: [],
        technologies: [],
        deliveryType: "project", timeline: "", featured: false, status: "draft",
        accent: "from-blue-600 to-cyan-500", icon: "Sparkles",
      };

// ---------- small local subcomponents ----------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-red-600">{message}</p>;
}

function Counter({ value, max }: { value: string; max: number }) {
  const len = value.length;
  return (
    <span className={cn("text-xs tabular-nums", len > max ? "text-red-600" : "text-muted-foreground")}>
      {len}/{max}
    </span>
  );
}

function ChipInput({
  values, onChange, placeholder,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [text, setText] = useState("");
  const add = () => {
    const v = text.trim();
    if (!v || values.includes(v)) { setText(""); return; }
    onChange([...values, v]);
    setText("");
  };
  return (
    <div className="rounded-md border border-input bg-transparent px-2.5 py-2 text-sm focus-within:ring-2 focus-within:ring-ring/40">
      {values.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {values.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1 font-normal">
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(values.filter((t) => t !== tag))}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); add(); }
        }}
        onBlur={add}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        aria-label={placeholder}
      />
    </div>
  );
}

function DynList({
  values, onChange, placeholder, addLabel, error,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  addLabel: string;
  error?: string;
}) {
  const [text, setText] = useState("");
  const add = () => {
    const v = text.trim();
    if (!v) return;
    onChange([...values, v]);
    setText("");
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(error && "border-red-400 focus-visible:ring-red-200")}
        />
        <Button type="button" variant="outline" size="sm" className="h-9 shrink-0" onClick={add}>
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
      </div>
      {values.length > 0 && (
        <ul className="divide-y rounded-md border bg-muted/30">
          {values.map((v, i) => (
            <li key={`${v}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2">
              <span className="truncate text-sm">{v}</span>
              <button
                type="button"
                aria-label={`Remove item ${i + 1}`}
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <FieldError message={error} />
    </div>
  );
}

function ProcessEditor({
  steps, onChange, error,
}: {
  steps: ServiceProcessStep[];
  onChange: (next: ServiceProcessStep[]) => void;
  error?: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= steps.length) return;
    const next = [...steps];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const update = (i: number, patch: Partial<ServiceProcessStep>) =>
    onChange(steps.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <div key={i} className="rounded-md border bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Step {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move step ${i + 1} up`}>
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" disabled={i === steps.length - 1} onClick={() => move(i, 1)} aria-label={`Move step ${i + 1} down`}>
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => onChange(steps.filter((_, idx) => idx !== i))} aria-label={`Remove step ${i + 1}`}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Input
              value={step.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Step title (e.g. Discovery workshop)"
              aria-label={`Step ${i + 1} title`}
            />
            <Textarea
              value={step.description}
              onChange={(e) => update(i, { description: e.target.value })}
              placeholder="What happens in this step"
              aria-label={`Step ${i + 1} description`}
              rows={2}
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...steps, { title: "", description: "" }])}
      >
        <Plus className="h-4 w-4" /> Add step
      </Button>
      <FieldError message={error} />
    </div>
  );
}

// ---------- main form ----------

export function ServiceForm({
  initial,
  mode,
}: {
  initial?: Service;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const admin = useCurrentAdmin();
  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const addService = useAppStore((s) => s.addService);
  const updateService = useAppStore((s) => s.updateService);

  const [draft, setDraft] = useState<Partial<Service>>(() => draftFrom(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [busy, setBusy] = useState<"draft" | "published" | null>(null);

  const setField = <K extends keyof Service>(key: K, value: Service[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const catSubs = useMemo(
    () => subcategories.filter((s) => s.categoryId === draft.categoryId),
    [subcategories, draft.categoryId]
  );

  const tabHasError = (tab: TabId) =>
    TAB_ERROR_FIELDS[tab].some((f) => !!errors[f]);

  const validate = (forPublish: boolean): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!draft.name?.trim()) errs.name = "Service name is required.";
    if (forPublish) {
      if (!draft.shortDescription?.trim())
        errs.shortDescription = "Short description is required.";
      if (!draft.categoryId) errs.categoryId = "Select a category.";
      if (!draft.subcategoryId) errs.subcategoryId = "Select a subcategory.";
      if ((draft.capabilities ?? []).filter((c) => c.trim()).length < 3)
        errs.capabilities = "Add at least 3 key capabilities before publishing.";
      if (!(draft.process ?? []).some((p) => p.title.trim()))
        errs.process = "Add at least 1 process step before publishing.";
    }
    return errs;
  };

  const submit = (intent: "draft" | "published") => {
    const forPublish = intent === "published";
    const errs = validate(forPublish);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstBad = TABS.find((t) => TAB_ERROR_FIELDS[t.id].some((f) => errs[f]));
      if (firstBad) setActiveTab(firstBad.id);
      const n = Object.keys(errs).length;
      toast({
        title: "Fix required fields",
        description: `Fix ${n} required field${n === 1 ? "" : "s"} before ${forPublish ? "publishing" : "saving"}.`,
        variant: "destructive",
      });
      return;
    }
    setErrors({});
    setBusy(intent);
    window.setTimeout(() => {
      const payload: Partial<Service> = {
        ...draft,
        name: draft.name!.trim(),
        slug: draft.slug?.trim() || slugify(draft.name ?? ""),
        shortDescription: draft.shortDescription!.trim(),
        tags: (draft.tags ?? []).map((t) => t.trim()).filter(Boolean),
        industries: draft.industries ?? [],
        problemsSolved: (draft.problemsSolved ?? []).map((v) => v.trim()).filter(Boolean),
        capabilities: (draft.capabilities ?? []).map((v) => v.trim()).filter(Boolean),
        deliverables: (draft.deliverables ?? []).map((v) => v.trim()).filter(Boolean),
        technologies: (draft.technologies ?? []).map((v) => v.trim()).filter(Boolean),
        process: (draft.process ?? []).filter((p) => p.title.trim() || p.description.trim()),
      };
      if (mode === "create") {
        const created = addService({ ...payload, status: intent, createdBy: admin?.name ?? "You" });
        setBusy(null);
        toast({
          title: forPublish ? "Service published" : "Service created as draft",
          description: `"${created.name}" was ${forPublish ? "published to the marketplace" : "saved as a draft"}.`,
        });
        router.push("/admin/services");
      } else if (initial) {
        const patch: Partial<Service> = forPublish ? { ...payload, status: "published" } : payload;
        updateService(initial.id, patch);
        setDraft((d) => ({ ...d, status: forPublish ? "published" : d.status }));
        setBusy(null);
        toast({ title: "Service updated", description: `"${payload.name}" was saved successfully.` });
      } else {
        setBusy(null);
      }
    }, 900);
  };

  const err = (k: string) => (errors[k] ? cn("border-red-400 focus-visible:ring-red-200") : undefined);

  return (
    <div className="space-y-5">
      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <EntityStatusBadge status={draft.status ?? "draft"} />
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {mode === "create" ? "New service" : `Editing "${initial?.name}"`}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mode === "edit" && !!draft.slug && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/marketplace/${draft.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> View public page
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" disabled={busy !== null} onClick={() => submit("draft")}>
              {busy === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save Draft
            </Button>
            <Button size="sm" disabled={busy !== null} onClick={() => submit("published")}>
              {busy === "published" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Publish
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted/70 p-1">
          {TABS.map((t, i) => (
            <TabsTrigger key={t.id} value={t.id} className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm">
              <span className="text-muted-foreground/70">{i + 1}.</span> {t.label}
              {tabHasError(t.id) && <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-label="Has errors" />}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ---------- 1. BASIC INFORMATION ---------- */}
        <TabsContent value="basic" className="mt-4">
          <div className="grid gap-5 rounded-lg border bg-card p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="svc-name">Service Name *</Label>
                <Input
                  id="svc-name"
                  value={draft.name ?? ""}
                  onChange={(e) => {
                    setField("name", e.target.value);
                    if (!slugEdited) setField("slug", slugify(e.target.value));
                  }}
                  placeholder="e.g. Enterprise AI Workflow Automation"
                  className={err("name")}
                />
                <FieldError message={errors.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-slug">Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="svc-slug"
                    value={draft.slug ?? ""}
                    onChange={(e) => { setSlugEdited(true); setField("slug", e.target.value); }}
                    placeholder="enterprise-ai-workflow-automation"
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    aria-label="Regenerate slug from name"
                    title="Regenerate from name"
                    onClick={() => setField("slug", slugify(draft.name ?? ""))}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Public URL: /marketplace/{draft.slug || "your-service"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="svc-short">Short Description *</Label>
                <Counter value={draft.shortDescription ?? ""} max={140} />
              </div>
              <Input
                id="svc-short"
                value={draft.shortDescription ?? ""}
                maxLength={140}
                onChange={(e) => setField("shortDescription", e.target.value)}
                placeholder="One-line summary shown on marketplace cards"
                className={err("shortDescription")}
              />
              <FieldError message={errors.shortDescription} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-full">Full Description</Label>
              <Textarea
                id="svc-full"
                value={draft.fullDescription ?? ""}
                onChange={(e) => setField("fullDescription", e.target.value)}
                rows={6}
                placeholder="Detailed overview of the service, outcomes, and who it is for."
              />
            </div>
          </div>
        </TabsContent>

        {/* ---------- 2. CLASSIFICATION ---------- */}
        <TabsContent value="classification" className="mt-4">
          <div className="grid gap-5 rounded-lg border bg-card p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={draft.categoryId || undefined}
                  onValueChange={(v) => {
                    setField("categoryId", v);
                    setField("subcategoryId", "");
                  }}
                >
                  <SelectTrigger className={cn("w-full", err("categoryId"))} aria-label="Category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <Icon name={c.icon} className="h-4 w-4" /> {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.categoryId} />
              </div>
              <div className="space-y-2">
                <Label>Subcategory *</Label>
                <Select
                  value={draft.subcategoryId || undefined}
                  onValueChange={(v) => setField("subcategoryId", v)}
                  disabled={!draft.categoryId}
                >
                  <SelectTrigger className={cn("w-full", err("subcategoryId"))} aria-label="Subcategory">
                    <SelectValue placeholder={draft.categoryId ? "Select a subcategory" : "Choose a category first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {catSubs.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.subcategoryId} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-tags">Tags</Label>
              <ChipInput
                values={draft.tags ?? []}
                onChange={(v) => setField("tags", v)}
                placeholder="Type a tag and press Enter (e.g. automation, LLM)"
              />
              <p className="text-xs text-muted-foreground">Press Enter to add, click x to remove.</p>
            </div>
            <div className="space-y-2">
              <Label>Industries Served</Label>
              <div className="grid gap-2 rounded-md border p-4 sm:grid-cols-2 lg:grid-cols-3">
                {INDUSTRIES.map((ind) => (
                  <label
                    key={ind.id}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
                  >
                    <Checkbox
                      checked={(draft.industries ?? []).includes(ind.name)}
                      onCheckedChange={(checked) => {
                        const cur = draft.industries ?? [];
                        setField("industries", checked ? [...cur, ind.name] : cur.filter((n) => n !== ind.name));
                      }}
                      aria-label={`Serve ${ind.name} industry`}
                    />
                    {ind.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ---------- 3. SERVICE DETAILS ---------- */}
        <TabsContent value="details" className="mt-4">
          <div className="grid gap-6 rounded-lg border bg-card p-5">
            <div className="space-y-2">
              <Label>Problems Solved</Label>
              <DynList
                values={draft.problemsSolved ?? []}
                onChange={(v) => setField("problemsSolved", v)}
                placeholder="A problem this service removes (press Enter or Add)"
                addLabel="Add"
              />
            </div>
            <div className="space-y-2">
              <Label>Key Capabilities</Label>
              <DynList
                values={draft.capabilities ?? []}
                onChange={(v) => setField("capabilities", v)}
                placeholder="A capability buyers get (minimum 3 to publish)"
                addLabel="Add"
                error={errors.capabilities}
              />
            </div>
            <div className="space-y-2">
              <Label>Deliverables / What Is Included</Label>
              <DynList
                values={draft.deliverables ?? []}
                onChange={(v) => setField("deliverables", v)}
                placeholder="A concrete deliverable (press Enter or Add)"
                addLabel="Add"
              />
            </div>
            <div className="space-y-2">
              <Label>Process</Label>
              <ProcessEditor
                steps={draft.process ?? []}
                onChange={(v) => setField("process", v)}
                error={errors.process}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-tech">Technologies</Label>
              <ChipInput
                values={draft.technologies ?? []}
                onChange={(v) => setField("technologies", v)}
                placeholder="Type a technology and press Enter (e.g. Python, AWS)"
              />
            </div>
          </div>
        </TabsContent>

        {/* ---------- 4. COMMERCIAL ---------- */}
        <TabsContent value="commercial" className="mt-4">
          <div className="grid gap-5 rounded-lg border bg-card p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Delivery Type</Label>
                <Select value={draft.deliveryType ?? "project"} onValueChange={(v) => setField("deliveryType", v as Service["deliveryType"])}>
                  <SelectTrigger className="w-full" aria-label="Delivery type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_TYPES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="svc-timeline">Estimated Timeline</Label>
                <Input
                  id="svc-timeline"
                  value={draft.timeline ?? ""}
                  onChange={(e) => setField("timeline", e.target.value)}
                  placeholder="e.g. 4-8 weeks"
                />
              </div>
              <div className="space-y-2">
                <Label>Featured Service</Label>
                <div className="flex items-center gap-3 rounded-md border p-3">
                  <Switch
                    checked={draft.featured ?? false}
                    onCheckedChange={(v) => setField("featured", v)}
                    aria-label="Feature this service"
                  />
                  <p className="text-xs text-muted-foreground">
                    Featured services appear in the homepage Featured section and marketplace highlights (limited slots).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ---------- 5. SEO ---------- */}
        <TabsContent value="seo" className="mt-4">
          <div className="grid gap-5 rounded-lg border bg-card p-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="svc-meta-title">Meta Title</Label>
                <Counter value={draft.metaTitle ?? ""} max={60} />
              </div>
              <Input
                id="svc-meta-title"
                value={draft.metaTitle ?? ""}
                maxLength={60}
                onChange={(e) => setField("metaTitle", e.target.value)}
                placeholder="Defaults to service name if left empty"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="svc-meta-desc">Meta Description</Label>
                <Counter value={draft.metaDescription ?? ""} max={160} />
              </div>
              <Textarea
                id="svc-meta-desc"
                value={draft.metaDescription ?? ""}
                maxLength={160}
                onChange={(e) => setField("metaDescription", e.target.value)}
                rows={3}
                placeholder="Short SEO summary for search engine results"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Search engines use these fields for the public marketplace page at /marketplace/{draft.slug || "your-service"}.
            </p>
          </div>
        </TabsContent>

        {/* ---------- 6. MEDIA ---------- */}
        <TabsContent value="media" className="mt-4">
          <div className="grid gap-6 rounded-lg border bg-card p-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Accent Gradient</Label>
                <Select value={draft.accent ?? GRADIENTS[0].value} onValueChange={(v) => setField("accent", v)}>
                  <SelectTrigger className="w-full" aria-label="Accent gradient">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADIENTS.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        <span className={cn("h-3 w-6 rounded-sm bg-gradient-to-r", g.value)} aria-hidden="true" />
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Service Icon</Label>
                <Select value={draft.icon ?? "Sparkles"} onValueChange={(v) => setField("icon", v)}>
                  <SelectTrigger className="w-full" aria-label="Service icon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {ICON_OPTIONS.map((name) => (
                      <SelectItem key={name} value={name}>
                        <Icon name={name} className="h-4 w-4" /> {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Preview</Label>
              <AccentTile
                gradient={draft.accent ?? GRADIENTS[0].value}
                icon={draft.icon ?? "Sparkles"}
                className="h-44 w-full rounded-lg"
                iconClass="h-10 w-10"
              />
              <p className="text-xs text-muted-foreground">
                Shown on marketplace cards, the public service page hero, and admin tables.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
