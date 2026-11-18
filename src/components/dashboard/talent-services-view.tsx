"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  ClipboardList,
  GraduationCap,
  Loader2,
  Search,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TALENT_REQUEST_KINDS, type RequestKindDef } from "@/lib/request-kinds";

/** Maps the icon name on each talent offering definition to a lucide component. */
const KIND_ICON_MAP: Record<string, LucideIcon> = {
  UserCheck,
  GraduationCap,
  Search,
  Users,
  Briefcase,
};

const BUDGET_OPTIONS = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000 – $25,000",
  "$25,000+",
];

const TIMELINE_OPTIONS = ["ASAP (1–2 weeks)", "2–4 weeks", "4–8 weeks", "Flexible"];

function OfferingCard({ def, onRequest }: { def: RequestKindDef; onRequest: () => void }) {
  const Icon = KIND_ICON_MAP[def.icon] ?? Users;
  return (
    <article className="flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{def.label}</h2>
          <p className="truncate text-xs text-muted-foreground">{def.tagline}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{def.description}</p>

      <ul className="mt-4 space-y-2">
        {def.deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <Button onClick={onRequest} className="w-full">
          Request service
        </Button>
      </div>
    </article>
  );
}

function TalentServiceDialog({
  def,
  open,
  onOpenChange,
}: {
  def: RequestKindDef | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState(def ? `${def.label} — ` : "");
  const [details, setDetails] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [metaValues, setMetaValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!def) return null;

  const setMetaValue = (key: string, value: string) =>
    setMetaValues((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setTitle(`${def.label} — `);
    setDetails("");
    setBudgetRange("");
    setTimeline("");
    setMetaValues({});
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (title.trim().length < 5) next.title = "Give your request a clear title.";
    if (details.trim().length < 20) next.details = "Describe the work in at least a couple of sentences.";
    if (!budgetRange) next.budget = "Select a budget range.";
    if (!timeline) next.timeline = "Select a timeline.";
    for (const field of def.fields) {
      const value = (metaValues[field.key] ?? "").trim();
      if (field.required && !value) {
        next[`meta-${field.key}`] = `${field.label} is required.`;
      } else if (field.type === "number" && value && (Number.isNaN(Number(value)) || Number(value) <= 0)) {
        next[`meta-${field.key}`] = "Enter a valid number greater than zero.";
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const meta: Record<string, string> = {};
    for (const field of def.fields) {
      const value = (metaValues[field.key] ?? "").trim();
      if (value) meta[field.key] = value;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          categoryId: "cat-talent",
          categoryName: "Talent Solutions",
          kind: def.kind,
          title: title.trim(),
          details: details.trim(),
          budgetRange,
          timeline,
          meta,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok: true; request: { id: string; reference: string } }
        | { ok?: false; error?: string };
      if (res.ok && data.ok && data.request) {
        reset();
        onOpenChange(false);
        toast({
          title: "Request submitted",
          description: `Reference ${data.request.reference} — track it in My Requests.`,
        });
        router.refresh();
        return;
      }
      toast({
        title: "Could not submit request",
        description: data.error ?? "Please try again in a moment.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Network error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Request {def.label}</DialogTitle>
          <DialogDescription>
            {def.tagline} — routed to the STIOOS delivery team with a reference code and full status tracking.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="talent-title">Title</Label>
            <Input
              id="talent-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Complete the suggested title for your request"
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-xs font-medium text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="talent-details">Details</Label>
            <Textarea
              id="talent-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="Scope, team context, systems involved, success criteria…"
              aria-invalid={!!errors.details}
            />
            {errors.details && <p className="text-xs font-medium text-destructive">{errors.details}</p>}
          </div>

          {def.fields.length > 0 && (
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="sr-only">{def.label} details</legend>
              {def.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`talent-field-${field.key}`}>{field.label}</Label>
                  {field.type === "select" ? (
                    <Select
                      value={metaValues[field.key] ?? ""}
                      onValueChange={(v) => setMetaValue(field.key, v)}
                    >
                      <SelectTrigger
                        aria-label={field.label}
                        aria-invalid={!!errors[`meta-${field.key}`]}
                      >
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={`talent-field-${field.key}`}
                      type={field.type === "number" ? "number" : "text"}
                      min={field.type === "number" ? 1 : undefined}
                      inputMode={field.type === "number" ? "numeric" : undefined}
                      value={metaValues[field.key] ?? ""}
                      onChange={(e) => setMetaValue(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      aria-invalid={!!errors[`meta-${field.key}`]}
                    />
                  )}
                  {errors[`meta-${field.key}`] && (
                    <p className="text-xs font-medium text-destructive">{errors[`meta-${field.key}`]}</p>
                  )}
                </div>
              ))}
            </fieldset>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Budget range</Label>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger aria-label="Budget range" aria-invalid={!!errors.budget}>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budget && <p className="text-xs font-medium text-destructive">{errors.budget}</p>}
            </div>
            <div className="space-y-2">
              <Label>Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger aria-label="Timeline" aria-invalid={!!errors.timeline}>
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.timeline && <p className="text-xs font-medium text-destructive">{errors.timeline}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Buyer "Talent Services" page — managed-talent offering catalog. The
 * five offerings come from `TALENT_REQUEST_KINDS` (static, no reads).
 * The per-kind dialog POSTs to `/api/requests` with the kind + meta +
 * budget + timeline, then calls `router.refresh()` so the new request
 * shows up in My Requests on the next page visit.
 *
 * Auth gating + dashboard chrome are handled by
 * `/dashboard/buyer/layout.tsx`.
 */
export function TalentServicesView() {
  const [activeDef, setActiveDef] = useState<RequestKindDef | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Talent Services</h1>
        <p className="text-sm text-slate-400">
          Managed talent offerings routed straight into the STIOOS delivery team — every request
          gets a reference code and full status tracking.
        </p>
      </header>

      <Link
        href="/dashboard/buyer/requests"
        className="group flex items-center gap-3 rounded-xl border border-sky-500/30 bg-sky-500/10 p-4 transition-colors hover:bg-sky-500/15"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-300"
          aria-hidden="true"
        >
          <ClipboardList className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">Track it end to end</span>
          <span className="block text-xs text-muted-foreground">
            Every request lands in My Requests with a reference code and a live status pipeline.
          </span>
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-sky-600 transition-transform group-hover:translate-x-0.5 dark:text-sky-300"
          aria-hidden="true"
        />
      </Link>

      <section aria-label="Talent offerings" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TALENT_REQUEST_KINDS.map((def) => (
          <OfferingCard
            key={def.kind}
            def={def}
            onRequest={() => {
              setActiveDef(def);
              setDialogOpen(true);
            }}
          />
        ))}
      </section>

      <TalentServiceDialog
        key={activeDef?.kind ?? "none"}
        def={activeDef}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
