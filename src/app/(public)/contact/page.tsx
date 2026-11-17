"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  Headset,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
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
import type { InquiryType } from "@/types";

// ============================================================
// CONTACT — Split layout: info + validated inquiry form
// ============================================================

const INQUIRY_TYPE_OPTIONS: { label: string; value: InquiryType }[] = [
  { label: "Contact", value: "contact" },
  { label: "Quote Request", value: "quote" },
  { label: "Service Request", value: "service_request" },
  { label: "Consultation", value: "consultation" },
];

const BUDGET_OPTIONS = [
  "Under $5k",
  "$5k–$10k",
  "$10k–$15k",
  "$15k–$30k",
  "$30k–$50k",
  "$50k+",
  "Not sure yet",
];

const TIMELINE_OPTIONS = ["Immediate", "1–3 months", "3–6 months", "6–12 months", "Ongoing"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormState {
  name: string;
  email: string;
  company: string;
  phone: string;
  type: InquiryType;
  message: string;
  budgetRange: string;
  timeline: string;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  type: "contact",
  message: "",
  budgetRange: "",
  timeline: "",
};

type FormErrors = Partial<Record<"name" | "email" | "message", string>>;

export default function ContactPage() {
  const { toast } = useToast();
  const brand = useAppStore((s) => s.brand);
  const addInquiry = useAppStore((s) => s.addInquiry);
  const requireRegistration = useAppStore((s) => s.marketplaceSettings.requireLeadRegistration);
  const currentUser = useCurrentUser();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  // Signed-in buyers get the form pre-filled from their buyer profile
  // (deferred a tick so the effect stays lint-clean and the visitor's
  // own keystrokes always win).
  const prefilledRef = useRef(false);
  useEffect(() => {
    if (!currentUser || prefilledRef.current) return;
    prefilledRef.current = true;
    const id = window.setTimeout(() => {
      setForm((f) => ({
        ...f,
        name: f.name || currentUser.name,
        email: f.email || currentUser.email,
        company: f.company || currentUser.company || "",
        phone: f.phone || currentUser.phone || "",
      }));
    }, 0);
    return () => window.clearTimeout(id);
  }, [currentUser]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "name" || key === "email" || key === "message") {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Please tell us your full name.";
    if (!form.email.trim()) next.email = "A work email is required so we can reply.";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "That email address doesn't look valid.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Please describe your requirements (at least 10 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    window.setTimeout(() => {
      const inquiry = addInquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        type: form.type,
        requirements: form.message.trim(),
        budgetRange: form.budgetRange || "Not specified",
        timeline: form.timeline || "Not specified",
      });
      setReference(inquiry.id.toUpperCase());
      setSubmitting(false);
      toast({
        title: "Request received",
        description: "Our expert team will respond within one business day.",
      });
    }, 800);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setReference(null);
  };

  const typeLabel = useMemo(
    () => INQUIRY_TYPE_OPTIONS.find((t) => t.value === form.type)?.label ?? "Contact",
    [form.type]
  );

  return (
    <>
      {/* ============================ HERO BAND ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-16 text-white md:py-20">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(30,100,232,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-amber-400">Contact</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s scope your <span className="text-gradient-brand">next advantage.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Tell us about your goals, systems, and constraints. A senior expert — not a bot — replies
            within one business day with next steps and a scoped proposal.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* ======================= LEFT: INFO ======================= */}
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <InfoCard
                  icon={<Mail className="h-5 w-5 text-blue-600" aria-hidden="true" />}
                  title="Email"
                  lines={[
                    { label: "Sales", value: brand.salesEmail },
                    { label: "Support", value: brand.supportEmail },
                  ]}
                />
                <InfoCard
                  icon={<Phone className="h-5 w-5 text-blue-600" aria-hidden="true" />}
                  title="Phone"
                  lines={[{ label: "Mon–Fri, 9:00–18:00", value: brand.phone }]}
                />
                <InfoCard
                  icon={<MapPin className="h-5 w-5 text-blue-600" aria-hidden="true" />}
                  title="Headquarters"
                  lines={[{ label: "Global Business District", value: brand.address }]}
                />
                <InfoCard
                  icon={<Building2 className="h-5 w-5 text-blue-600" aria-hidden="true" />}
                  title="Company"
                  lines={[
                    { label: "Marketplace", value: "Live — 7 divisions" },
                    { label: "Clients served", value: "10 industries worldwide" },
                  ]}
                />
              </div>

              {/* Response-time promise */}
              <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6">
                <span
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400"
                  aria-hidden="true"
                />
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/25">
                    <Clock className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Our response-time promise</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Every inquiry is triaged by a senior consultant and answered within{" "}
                      <strong className="font-semibold text-foreground">one business day</strong> — with a
                      scoped proposal for service requests within three. If we are not the right fit, we
                      will tell you who is.
                    </p>
                  </div>
                </div>
              </div>

              {/* Talk to an Expert panel */}
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-brand-ink p-6 text-white">
                <div className="absolute inset-0 surface-grid opacity-70" aria-hidden="true" />
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/30">
                    <Headset className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-lg font-semibold">Prefer to talk it through?</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Book a 30-minute discovery call with a STIOOS expert. We map your requirements live,
                    recommend the right division, and outline cost and timeline on the spot.
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      No sales scripts — senior practitioners only
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      Mutual NDA available before any detail is shared
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400" aria-hidden="true" />
                      Leave with a clear next step, whatever you decide
                    </li>
                  </ul>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                    Enterprise-grade confidentiality on every conversation
                  </div>
                </div>
              </div>
            </div>

            {/* ======================= RIGHT: FORM ======================= */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
              {requireRegistration && !currentUser && !reference && (
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <UserPlus className="h-4.5 w-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">Create a free buyer account</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Serious buyers only — register to track replies, save services, and get faster
                      responses from our experts.
                    </p>
                    <Button asChild size="sm" className="mt-2.5 h-8">
                      <a href="/auth/signup">Register as a buyer</a>
                    </Button>
                  </div>
                </div>
              )}
              {reference ? (
                <div
                  className="anim-pop-sm flex h-full min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                    Request received
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                    Thank you, {form.name.split(" ")[0] || "there"}. Your {typeLabel.toLowerCase()} has been
                    routed to the right division. A senior expert will respond to{" "}
                    <span className="font-medium text-foreground">{form.email}</span> within one business
                    day.
                  </p>
                  <div className="mt-6 w-full max-w-sm rounded-lg border border-dashed border-border bg-muted/50 px-5 py-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Reference ID
                    </p>
                    <p className="mt-1 font-mono text-lg font-semibold text-foreground">{reference}</p>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Keep this reference for faster follow-up. It is also visible to your team in the admin
                    platform.
                  </p>
                  <Button onClick={resetForm} variant="outline" className="mt-8">
                    Send another inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Send us a message</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Fields marked <span className="text-destructive">*</span> are required.
                  </p>

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" required error={errors.name} htmlFor="cf-name">
                      <Input
                        id="cf-name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Jane Okafor"
                        aria-invalid={!!errors.name}
                        className={errors.name ? "border-destructive" : undefined}
                      />
                    </Field>
                    <Field label="Work email" required error={errors.email} htmlFor="cf-email">
                      <Input
                        id="cf-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="jane@company.com"
                        aria-invalid={!!errors.email}
                        className={errors.email ? "border-destructive" : undefined}
                      />
                    </Field>
                    <Field label="Company" htmlFor="cf-company">
                      <Input
                        id="cf-company"
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        placeholder="Acme Industries"
                      />
                    </Field>
                    <Field label="Phone" htmlFor="cf-phone">
                      <Input
                        id="cf-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </Field>

                    <Field label="Inquiry type" htmlFor="cf-type">
                      <Select value={form.type} onValueChange={(v) => set("type", v as InquiryType)}>
                        <SelectTrigger id="cf-type" className="w-full">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {INQUIRY_TYPE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Budget range" htmlFor="cf-budget">
                      <Select value={form.budgetRange} onValueChange={(v) => set("budgetRange", v)}>
                        <SelectTrigger id="cf-budget" className="w-full">
                          <SelectValue placeholder="Select a range (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {BUDGET_OPTIONS.map((b) => (
                            <SelectItem key={b} value={b}>
                              {b}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Timeline" htmlFor="cf-timeline">
                        <Select value={form.timeline} onValueChange={(v) => set("timeline", v)}>
                          <SelectTrigger id="cf-timeline" className="w-full">
                            <SelectValue placeholder="When do you want to start? (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMELINE_OPTIONS.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>

                    <div className="sm:col-span-2">
                      <Field label="Message" required error={errors.message} htmlFor="cf-message">
                        <Textarea
                          id="cf-message"
                          value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="Describe your goals, current systems, and what success looks like…"
                          rows={6}
                          aria-invalid={!!errors.message}
                          className={errors.message ? "border-destructive" : undefined}
                        />
                      </Field>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-7 h-12 w-full bg-amber-500 text-base font-semibold text-brand-ink hover:bg-amber-400 sm:w-auto sm:px-10"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send inquiry
                        <Send className="ml-2 h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    By submitting, you agree to be contacted about your inquiry. We never share your
                    details with third parties, and mutual NDAs are standard before discovery calls.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================
// Small helpers
// ============================================================

function InfoCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: { label?: string; value: string }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 ring-1 ring-blue-600/20">
          {icon}
        </span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="mt-3 space-y-1.5">
        {lines.map((line) => (
          <p key={line.value} className="text-sm">
            {line.label && <span className="text-xs text-muted-foreground">{line.label}: </span>}
            <span className="font-medium text-foreground">{line.value}</span>
          </p>
        ))}
      </div>
    </div>
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
