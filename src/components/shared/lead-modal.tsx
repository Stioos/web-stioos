"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, FileText, MessageCircle, Phone, Send, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useAppStore, useCurrentUser } from "@/lib/store";
import { cn } from "@/lib/utils";
import { resolveLeadFormProfile } from "@/lib/lead-form-profiles";
import {
  BuyerRegistrationForm,
  type BuyerRegistrationResult,
} from "@/components/auth/buyer-registration-form";
import type { InquiryType } from "@/types";

// ============================================================
// LEAD MODAL — fully functional conversion form behind the four
// action-bar CTAs (Get Started / Enquiry / Consultation / Contact).
// Visitor-entered data is captured through the app store
// (addInquiry → persisted locally) and shows up instantly in
// Admin → Inquiries, complete with the page/service context the
// visitor started from.
//
// BUYER-CAPTURE GATE: when "Require buyer registration" is on in
// Admin → Settings → Marketplace and no buyer is signed in, the
// modal first walks the visitor through the shared serious-buyer
// registration form (step 1 of 2), auto-signs them in, and then
// opens the lead form pre-filled (step 2 of 2). A duplicate email
// falls back to signing the existing account in ("Welcome back").
// ============================================================

export type LeadType = Extract<InquiryType, "quote" | "service_request" | "consultation" | "contact">;

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: LeadType;
  /** Service or page context the visitor acted from */
  context?: string;
  /** Overrides the copy title everywhere (dialog, toast, success text) —
      used when admins relabel a CTA in Settings → Marketplace. */
  title?: string;
}

const LEAD_COPY: Record<
  LeadType,
  { title: string; intro: string; submit: string; icon: typeof FileText; badgeClass: string }
> = {
  quote: {
    title: "Get Started",
    intro: "Share a few details and receive a scoped, fixed-outline quote from a senior consultant.",
    submit: "Get Started",
    icon: FileText,
    badgeClass: "bg-amber-500/15 text-amber-600 ring-amber-500/30 dark:text-amber-400",
  },
  service_request: {
    title: "Service Enquiry",
    intro: "Tell us what you need — an expert replies with scope, timeline and next steps.",
    submit: "Send enquiry",
    icon: Send,
    badgeClass: "bg-blue-500/15 text-blue-600 ring-blue-500/30 dark:text-blue-400",
  },
  consultation: {
    title: "Book a Consultation",
    intro: "Reserve a 30-minute discovery call with a senior practitioner — no sales scripts.",
    submit: "Book consultation",
    icon: MessageCircle,
    badgeClass: "bg-violet-500/15 text-violet-600 ring-violet-500/30 dark:text-violet-400",
  },
  contact: {
    title: "Contact Our Team",
    intro: "Questions, partnerships or anything else — we reply within one business day.",
    submit: "Send message",
    icon: Phone,
    badgeClass: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/30 dark:text-emerald-400",
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  budgetRange: string;
  timeline: string;
  message: string;
  customFields: Record<string, string>;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  budgetRange: "",
  timeline: "",
  message: "",
  customFields: {},
};

type FormErrors = Partial<Record<"name" | "email" | "message", string>> &
  Record<string, string | undefined>;

export function LeadModal({ open, onOpenChange, type, context, title }: LeadModalProps) {
  const copy = LEAD_COPY[type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card sm:max-w-lg">
        {/* Keyed by type + context so switching option or CTA remounts a fresh
            option-tailored form; the whole subtree unmounts on close. */}
        {open && (
          <LeadForm
            key={`${type}::${context ?? ""}`}
            type={type}
            context={context}
            displayTitle={title || copy.title}
            copy={copy}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function LeadForm({
  type,
  context,
  displayTitle,
  copy,
  onClose,
}: {
  type: LeadType;
  context?: string;
  displayTitle: string;
  copy: (typeof LEAD_COPY)[LeadType];
  onClose: () => void;
}) {
  const { toast } = useToast();
  const addInquiry = useAppStore((s) => s.addInquiry);
  const requireRegistration = useAppStore((s) => s.marketplaceSettings.requireLeadRegistration);
  const currentUser = useCurrentUser();

  // Funnel state: guests (when the gate is on) see the registration
  // step first; everyone else lands directly on the lead form.
  const [step, setStep] = useState<"register" | "lead">(
    requireRegistration && !currentUser ? "register" : "lead"
  );
  const [registeredHere, setRegisteredHere] = useState(false);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const profile = resolveLeadFormProfile(context);
  const Icon = copy.icon;

  /** registration step succeeded → sign-in happened inside the form;
      pre-fill the lead form from the (new or existing) buyer account. */
  const handleRegistered = ({ user, existing }: BuyerRegistrationResult) => {
    if (!existing) setRegisteredHere(true);
    setForm((f) => ({
      ...f,
      name: user.name,
      email: user.email,
      company: user.company || "",
      phone: user.phone || f.phone,
    }));
    setStep("lead");
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "name" || key === "email" || key === "message") {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  const setCustomField = (id: string, value: string) => {
    setForm((f) => ({
      ...f,
      customFields: { ...f.customFields, [id]: value },
    }));
    setErrors((e) => ({ ...e, [id]: undefined }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Please tell us your full name.";
    if (!form.email.trim()) next.email = "A work email is required so we can reply.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "That email address doesn't look valid.";
    for (const field of profile.fields) {
      if (field.required && !form.customFields[field.id]?.trim()) {
        next[field.id] = `Please select ${field.label.toLowerCase()}.`;
      }
    }
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Please add a few details (at least 10 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const structuredAnswers = profile.fields
      .map((field) => {
        const val = form.customFields[field.id];
        return val ? `${field.label}: ${val}` : null;
      })
      .filter(Boolean)
      .join("\n");
    const fullRequirements = structuredAnswers
      ? `[${profile.badge}${context ? ` — ${context}` : ""}]\n${structuredAnswers}\n\nNotes:\n${form.message.trim()}`
      : form.message.trim();

    window.setTimeout(() => {
      const inquiry = addInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        type,
        serviceName: context,
        requirements: fullRequirements,
        budgetRange: form.budgetRange || "Not specified",
        timeline: form.timeline || "Not specified",
      });
      setReference(inquiry.id.toUpperCase());
      setSubmitting(false);
      toast({
        title: `${displayTitle} — received`,
        description: "Our expert team will respond within one business day.",
      });
    }, 700);
  };

  // ---------- success panel ----------
  if (reference) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        </span>
        <DialogHeader className="items-center space-y-2">
          <DialogTitle className="text-xl">Request received</DialogTitle>
          <DialogDescription className="max-w-sm">
            Thank you, {form.name.split(" ")[0] || "there"}. Your {displayTitle.toLowerCase()} request is
            now in our queue — a senior expert will reply to{" "}
            <span className="font-medium text-foreground">{form.email}</span> within one business day.
            {registeredHere && " A buyer account was created for you — sign in anytime to track replies."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5 w-full max-w-xs rounded-lg border border-dashed border-border bg-muted/50 px-5 py-3.5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Reference ID
          </p>
          <p className="mt-0.5 font-mono text-base font-semibold text-foreground">{reference}</p>
        </div>
        {context && (
          <p className="mt-3 text-xs text-muted-foreground">
            Regarding: <span className="font-medium text-foreground">{context}</span>
          </p>
        )}
        <Button onClick={onClose} className="mt-6 w-full sm:w-auto">
          Done
        </Button>
      </div>
    );
  }

  // ---------- registration step (funnel step 1) ----------
  if (step === "register") {
    return (
      <>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-400">
              <UserPlus className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-lg">{displayTitle}</DialogTitle>
              <p className="text-xs font-medium text-muted-foreground">
                Step 1 of 2 · Create your free buyer account
              </p>
            </div>
          </div>
          <DialogDescription className="pt-1 leading-relaxed">
            STIOOS is a serious-buyer marketplace: a quick, verified buyer profile keeps our
            experts focused on real projects — then your {displayTitle.toLowerCase()} continues
            below, pre-filled.
          </DialogDescription>
        </DialogHeader>

        <BuyerRegistrationForm
          variant="modal"
          source="lead-modal"
          submitLabel="Create account & continue"
          onRegistered={handleRegistered}
        />
      </>
    );
  }

  // ---------- lead form (funnel step 2) ----------
  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1",
              copy.badgeClass
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-lg">{displayTitle}</DialogTitle>
              {profile.key !== "general" && (
                <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {profile.badge}
                </span>
              )}
            </div>
            {context && (
              <p className="truncate text-xs font-medium text-muted-foreground">
                {context} · {profile.subtitlePrefix}
              </p>
            )}
          </div>
        </div>
        <DialogDescription className="pt-1 leading-relaxed">{copy.intro}</DialogDescription>
      </DialogHeader>

      {registeredHere && (
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Step 2 of 2 · Your request
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-1">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required error={errors.name} htmlFor="lm-name">
            <Input
              id="lm-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Jane Okafor"
              aria-invalid={!!errors.name}
              className={errors.name ? "border-destructive" : undefined}
              autoComplete="name"
            />
          </Field>
          <Field label="Work email" required error={errors.email} htmlFor="lm-email">
            <Input
              id="lm-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="jane@company.com"
              aria-invalid={!!errors.email}
              className={errors.email ? "border-destructive" : undefined}
              autoComplete="email"
            />
          </Field>
          <Field label="Company" htmlFor="lm-company">
            <Input
              id="lm-company"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              placeholder="Acme Industries"
              autoComplete="organization"
            />
          </Field>
          <Field label="Phone" htmlFor="lm-phone">
            <Input
              id="lm-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
            />
          </Field>
          {profile.fields.map((field) => (
            <Field
              key={field.id}
              label={field.label}
              required={field.required}
              error={errors[field.id]}
              htmlFor={`lm-${field.id}`}
            >
              <Select
                value={form.customFields[field.id] ?? ""}
                onValueChange={(v) => setCustomField(field.id, v)}
              >
                <SelectTrigger
                  id={`lm-${field.id}`}
                  aria-invalid={!!errors[field.id]}
                  className={cn("w-full", errors[field.id] && "border-destructive")}
                >
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          ))}
          <Field label={profile.budgetLabel} htmlFor="lm-budget">
            <Select value={form.budgetRange} onValueChange={(v) => set("budgetRange", v)}>
              <SelectTrigger id="lm-budget" className="w-full">
                <SelectValue placeholder="Select a range (optional)" />
              </SelectTrigger>
              <SelectContent>
                {profile.budgetOptions.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label={profile.timelineLabel} htmlFor="lm-timeline">
            <Select value={form.timeline} onValueChange={(v) => set("timeline", v)}>
              <SelectTrigger id="lm-timeline" className="w-full">
                <SelectValue placeholder="When do you want to start?" />
              </SelectTrigger>
              <SelectContent>
                {profile.timelineOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label={profile.messageLabel} required error={errors.message} htmlFor="lm-message">
              <Textarea
                id="lm-message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder={profile.messagePlaceholder}
                rows={4}
                aria-invalid={!!errors.message}
                className={errors.message ? "border-destructive" : undefined}
              />
            </Field>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="mt-5 h-11 w-full bg-amber-500 text-sm font-semibold text-brand-ink hover:bg-amber-400"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              {copy.submit}
              <Send className="ml-2 h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
          Your request goes straight to the STIOOS team and is tracked with the reference shown
          after sending. We never share your details with third parties.
        </p>
      </form>
    </>
  );
}

function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================
// GLOBAL LEAD MODAL STORE — any component (ServiceCard,
// PageActionBar, hero CTAs) can open the lead modal without
// lifting state. Survives Fast Refresh via globalThis singleton
// (same pattern as useLoginDrawer).
// ============================================================

import { create } from "zustand";

interface LeadModalStoreState {
  open: boolean;
  type: LeadType;
  context: string;
  openModal: (type: LeadType, context?: string) => void;
  closeModal: () => void;
}

function createLeadModalStore() {
  return create<LeadModalStoreState>((set) => ({
    open: false,
    type: "quote",
    context: "",
    openModal: (type, context = "") => set({ open: true, type, context }),
    closeModal: () => set({ open: false }),
  }));
}

const lg = globalThis as unknown as { __stioosLeadModal?: ReturnType<typeof createLeadModalStore> };
export const useLeadModal =
  lg.__stioosLeadModal ?? (lg.__stioosLeadModal = createLeadModalStore());

/** Render once in the layout — listens to the store and shows the modal. */
export function LeadModalProvider() {
  const { open, type, context, closeModal } = useLeadModal();
  return (
    <LeadModal
      open={open}
      onOpenChange={(o) => (!o ? closeModal() : undefined)}
      type={type}
      context={context}
    />
  );
}
