"use client";

import { useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarClock,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe,
  Info,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Target,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { User as PlatformUser } from "@/types";

// ============================================================
// BUYER REGISTRATION FORM — the platform's serious-buyer capture
// form, shared by two hosts:
//   • /auth/signup            (variant="page")
//   • LeadModal step 1 gate   (variant="modal") — every conversion
//     CTA app-wide funnels here when "Require buyer registration"
//     is enabled in Admin → Settings → Marketplace.
// Two registration tracks selectable as cards at the top:
//   • Professional / Individual — profession + "I am a"
//   • Company / Organization    — company name + type + size
// Modelled on the client's reference design: icon-prefixed fields,
// dial-code selector inside the mobile field, password + confirm
// with reveal toggles, country select and a gradient submit CTA — plus a
// serious-buyer qualification step (intent + timeline) so the
// buyer base stays high-signal.
// ============================================================

export interface BuyerRegistrationResult {
  user: PlatformUser;
  /** true when the email already existed and we signed that account in instead */
  existing: boolean;
}

interface BuyerRegistrationFormProps {
  variant?: "page" | "modal";
  /** stored on the user so the admin can see which surface captured them */
  source?: string;
  submitLabel?: string;
  onRegistered: (result: BuyerRegistrationResult) => void;
  /** controlled registration track — when provided the host owns the state
   *  and can render the track selector outside the form (e.g. signup page
   *  portals it into the brand panel). Internal state stays authoritative
   *  for the field layout; this prop is synced into it. */
  registrationType?: RegistrationType;
  /** fired whenever the track changes (internal cards or controlled prop) */
  onRegistrationTypeChange?: (track: RegistrationType) => void;
  /** hide the built-in track cards — set when the host renders them elsewhere */
  hideTypeSelector?: boolean;
}

const COUNTRIES = [
  { code: "IN", name: "India", dial: "+91" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "OT", name: "Other", dial: "+" },
] as const;

export type RegistrationType = "professional" | "company";

/** the two registration tracks — selectable as cards at the top of the form.
 *  Exported so RegistrationIntro can render the same selector externally. */
export const REGISTRATION_TYPES: {
  value: RegistrationType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "professional",
    title: "Professional / Individual",
    subtitle: "Hiring for myself or as an independent professional",
    icon: <User className="h-4 w-4" aria-hidden="true" />,
  },
  {
    value: "company",
    title: "Company / Organization",
    subtitle: "Buying on behalf of a company, team or organization",
    icon: <Building2 className="h-4 w-4" aria-hidden="true" />,
  },
];

/** account-type options adapt to the chosen registration track */
const ACCOUNT_TYPES: Record<RegistrationType, readonly string[]> = {
  professional: [
    "Working Professional",
    "Freelancer / Consultant",
    "Founder / Solopreneur",
    "Student / Individual",
  ],
  company: [
    "Startup",
    "Small Business",
    "Mid-Size Company",
    "Enterprise",
    "Agency / Consultancy",
  ],
};

const COMPANY_SIZES = [
  "Just me · Solo",
  "2–10 people",
  "11–50 people",
  "51–200 people",
  "201–1,000 people",
  "1,000+ people",
] as const;

const INTENT_OPTIONS = [
  "Hire an expert for a defined project",
  "Build a long-term / ongoing engagement",
  "Consulting, advisory or audit",
  "Shortlisting vendors before we decide",
  "Research only — exploring what's possible",
] as const;

const TIMELINE_OPTIONS = [
  "Immediately",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Researching — no fixed date",
] as const;

const RESEARCH_INTENT = INTENT_OPTIONS[4];
const RESEARCH_TIMELINE = TIMELINE_OPTIONS[4];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "password"
  | "confirm"
  | "company"
  | "companySize"
  | "profession"
  | "accountType"
  | "country"
  | "intent"
  | "intentTimeline";

type FormErrors = Partial<Record<FieldKey, string>>;

interface FormState {
  registrationType: RegistrationType;
  firstName: string;
  lastName: string;
  email: string;
  dial: string;
  phone: string;
  password: string;
  confirm: string;
  company: string;
  companySize: string;
  profession: string;
  accountType: string;
  country: string;
  intent: string;
  intentTimeline: string;
}

const INITIAL: FormState = {
  // Companies are the platform's core buyer base — the richer capture
  // track is the default; professionals can switch in one click.
  registrationType: "company",
  firstName: "",
  lastName: "",
  email: "",
  dial: "+91",
  phone: "",
  password: "",
  confirm: "",
  company: "",
  companySize: "",
  profession: "",
  accountType: "",
  country: "India",
  intent: "",
  intentTimeline: "",
};

function passwordScore(pw: string): number {
  if (!pw) return 0;
  return [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(
    Boolean
  ).length;
}

const SCORE_LABEL = ["", "Weak", "Fair", "Good", "Strong"] as const;
const SCORE_CLASS = [
  "",
  "bg-destructive",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-500",
] as const;

export function BuyerRegistrationForm({
  variant = "page",
  source = "signup-page",
  submitLabel = "Create Buyer Account",
  onRegistered,
  registrationType,
  onRegistrationTypeChange,
  hideTypeSelector = false,
}: BuyerRegistrationFormProps) {
  const { toast } = useToast();
  const signUp = useAppStore((s) => s.signUp);
  const marketLogin = useAppStore((s) => s.marketLogin);

  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isModal = variant === "modal";
  const score = passwordScore(form.password);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === "email" || key === "password") setFormError(null);
  };

  const researchFlag =
    form.intent === RESEARCH_INTENT || form.intentTimeline === RESEARCH_TIMELINE;

  /** effective track — controlled when the host owns the state (external
   *  selector cards), internal otherwise (modal variant). No sync effects
   *  needed: everything derives from this. */
  const activeTrack: RegistrationType = registrationType ?? form.registrationType;

  /** the stored account-type only counts while it belongs to the active
   *  track (the two option sets are disjoint) — so an external track switch
   *  invalidates it automatically, without effects. */
  const accountTypeValue = ACCOUNT_TYPES[activeTrack].includes(form.accountType)
    ? form.accountType
    : "";

  /** switch registration track — account-type option sets differ per track */
  const setRegistrationType = (value: RegistrationType) => {
    if (value === activeTrack) return;
    setForm((f) => ({ ...f, registrationType: value, accountType: "" }));
    setErrors((e) => ({
      ...e,
      accountType: undefined,
      company: undefined,
      companySize: undefined,
      profession: undefined,
    }));
  };

  /** switch + notify a controlled host (external selector cards) */
  const changeRegistrationType = (value: RegistrationType) => {
    setRegistrationType(value);
    onRegistrationTypeChange?.(value);
  };

  /** country select ↔ dial selector stay in sync (mirrors the reference design) */
  const setCountry = (code: string) => {
    const match = COUNTRIES.find((c) => c.code === code);
    setForm((f) => ({
      ...f,
      country: match ? match.name : f.country,
      dial: match ? match.dial : f.dial,
    }));
    setErrors((e) => ({ ...e, country: undefined }));
  };

  const setDial = (code: string) => {
    const match = COUNTRIES.find((c) => c.code === code);
    setForm((f) => ({
      ...f,
      dial: match ? match.dial : f.dial,
      country: match && match.name !== "Other" ? match.name : f.country,
    }));
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (form.firstName.trim().length < 2) next.firstName = "Enter your first name.";
    if (form.lastName.trim().length < 1) next.lastName = "Enter your last name.";
    if (!form.email.trim()) next.email = "A work email is required.";
    else if (!EMAIL_RE.test(form.email.trim()))
      next.email = "That email address doesn't look valid.";
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) next.phone = "A mobile number is required.";
    else if (digits.length < 7 || digits.length > 14)
      next.phone = "Enter a valid mobile number (7–14 digits).";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    else if (!/\d/.test(form.password) || !/[A-Za-z]/.test(form.password))
      next.password = "Include at least one letter and one number.";
    if (form.confirm !== form.password) next.confirm = "Passwords do not match.";
    if (activeTrack === "company") {
      if (form.company.trim().length < 2)
        next.company = "Enter your company / organization name.";
      if (!form.companySize) next.companySize = "Select your company size.";
      if (!accountTypeValue) next.accountType = "Select your company type.";
    } else {
      if (form.profession.trim().length < 2)
        next.profession = "Tell us your profession or role.";
      if (!accountTypeValue) next.accountType = "Select what describes you best.";
    }
    if (!form.country) next.country = "Select your country.";
    if (!form.intent) next.intent = "Tell us what brings you here.";
    if (!form.intentTimeline) next.intentTimeline = "Select an expected start.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    window.setTimeout(() => {
      const cleanEmail = form.email.trim().toLowerCase();
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.replace(/\s+/g, " ");
      const fullPhone = `${form.dial === "+" ? "" : form.dial} ${form.phone.trim()}`.trim();
      const isCompany = activeTrack === "company";

      const result = signUp({
        name: fullName,
        email: cleanEmail,
        password: form.password,
        role: "buyer",
        registrationType: activeTrack,
        company: isCompany ? form.company.trim() : "",
        country: form.country,
        phone: fullPhone,
        phoneCountry: form.dial,
        accountType: accountTypeValue,
        profession: isCompany ? undefined : form.profession.trim(),
        companySize: isCompany ? form.companySize : undefined,
        intent: form.intent,
        intentTimeline: form.intentTimeline,
        registrationSource: source,
      });

      if (result.ok && result.user) {
        setSubmitting(false);
        toast({
          title: `Welcome to STIOOS, ${result.user.name.split(" ")[0]}`,
          description: "Your buyer account is ready — serious buyers only, and you're verified in.",
        });
        onRegistered({ user: result.user, existing: false });
        return;
      }

      // Email already registered → sign that account in with the entered
      // password so the visitor continues without friction.
      if ((result.error ?? "").includes("already exists")) {
        const login = marketLogin(cleanEmail, form.password);
        if (login.ok) {
          const existing = useAppStore
            .getState()
            .users.find((u) => u.email.toLowerCase() === cleanEmail);
          if (existing) {
            setSubmitting(false);
            toast({
              title: "Welcome back",
              description: "You already have a buyer account — signed you in.",
            });
            onRegistered({ user: existing, existing: true });
            return;
          }
        }
        setSubmitting(false);
        setFormError(
          "An account with this email already exists. Use its password to continue, or try a different email."
        );
        return;
      }

      setSubmitting(false);
      setFormError(result.error ?? "Unable to create your account.");
    }, 650);
  };

  const gap = isModal ? "space-y-3.5" : "space-y-4 lg:space-y-2.5";

  return (
    <form onSubmit={handleSubmit} noValidate className={gap}>
      {formError && (
        <p
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive"
          role="alert"
        >
          {formError}
        </p>
      )}

      {/* --- registration type (Professional/Individual vs Company/Organization) ---
          hidden when the host renders the selector cards elsewhere —
          e.g. the signup page portals them into the brand panel --- */}
      {!hideTypeSelector && (
      <div
        role="radiogroup"
        aria-label="Registration type"
        className="grid gap-2.5 sm:grid-cols-2"
      >
        {REGISTRATION_TYPES.map((t) => {
          const active = activeTrack === t.value;
          return (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={submitting}
              onClick={() => changeRegistrationType(t.value)}
              className={cn(
                "group relative rounded-lg border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "border-violet-500/60 bg-violet-500/[0.07] ring-1 ring-violet-500/40"
                  : "border-border bg-card hover:border-violet-500/40 hover:bg-muted/40"
              )}
            >
              <span className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
                    active
                      ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-sm shadow-violet-600/25"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {t.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[13px] font-semibold leading-tight",
                      active ? "text-foreground" : "text-foreground/80"
                    )}
                  >
                    {t.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                    {t.subtitle}
                  </span>
                </span>
                {active && (
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400"
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
      )}

      {/* --- identity --- */}
      <div className="grid grid-cols-2 gap-3.5">
        <IconField
          htmlFor={`${source}-first-name`}
          label="First Name"
          required
          error={errors.firstName}
          icon={<User className="h-4 w-4" aria-hidden="true" />}
        >
          <Input
            id={`${source}-first-name`}
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            autoCapitalize="words"
            disabled={submitting}
            aria-invalid={!!errors.firstName}
            className={cn("pl-9", errors.firstName && "border-destructive")}
          />
        </IconField>
        <IconField
          htmlFor={`${source}-last-name`}
          label="Last Name"
          required
          error={errors.lastName}
          icon={<User className="h-4 w-4" aria-hidden="true" />}
        >
          <Input
            id={`${source}-last-name`}
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Last name"
            autoComplete="family-name"
            autoCapitalize="words"
            disabled={submitting}
            aria-invalid={!!errors.lastName}
            className={cn("pl-9", errors.lastName && "border-destructive")}
          />
        </IconField>
      </div>

      <IconField
        htmlFor={`${source}-email`}
        label="Work Email"
        required
        error={errors.email}
        icon={<Mail className="h-4 w-4" aria-hidden="true" />}
      >
        <Input
          id={`${source}-email`}
          type="email"
          inputMode="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          disabled={submitting}
          aria-invalid={!!errors.email}
          className={cn("pl-9", errors.email && "border-destructive")}
        />
      </IconField>

      {/* --- mobile with dial-code selector (reference layout) --- */}
      <IconField
        htmlFor={`${source}-phone`}
        label="Mobile Number"
        required
        error={errors.phone}
        icon={<Phone className="h-4 w-4" aria-hidden="true" />}
      >
        <div className="relative">
          <Select value={COUNTRIES.find((c) => c.dial === form.dial)?.code ?? "OT"} onValueChange={setDial}>
            <SelectTrigger
              aria-label="Country dial code"
              className="absolute left-8 top-1/2 z-20 h-7 w-[86px] -translate-y-1/2 justify-between gap-0.5 rounded-md border-0 bg-transparent px-1.5 text-xs font-semibold shadow-none focus:ring-0 focus:ring-offset-0"
            >
              <span className="truncate">
                {COUNTRIES.find((c) => c.dial === form.dial)?.code ?? "OT"} {form.dial}
              </span>
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code} className="text-xs">
                  {c.code} {c.dial} · {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id={`${source}-phone`}
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="Mobile number"
            autoComplete="tel-national"
            disabled={submitting}
            aria-invalid={!!errors.phone}
            className={cn("pl-[118px]", errors.phone && "border-destructive")}
          />
        </div>
      </IconField>

      {/* --- security --- */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        <IconField
          htmlFor={`${source}-password`}
          label="Password"
          required
          error={errors.password}
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id={`${source}-password`}
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Create password"
              autoComplete="new-password"
              disabled={submitting}
              aria-invalid={!!errors.password}
              className={cn("pl-9 pr-10", errors.password && "border-destructive")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </IconField>
        <IconField
          htmlFor={`${source}-confirm`}
          label="Confirm Password"
          required
          error={errors.confirm}
        >
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id={`${source}-confirm`}
              type={showConfirm ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              disabled={submitting}
              aria-invalid={!!errors.confirm}
              className={cn("pl-9 pr-10", errors.confirm && "border-destructive")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </IconField>
      </div>

      {form.password && (
        <div className="-mt-1.5 flex items-center gap-2.5" aria-live="polite">
          <div className="flex flex-1 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= score ? SCORE_CLASS[score] : "bg-muted"
                )}
              />
            ))}
          </div>
          <span className="w-12 text-right text-[11px] font-medium text-muted-foreground">
            {SCORE_LABEL[score]}
          </span>
        </div>
      )}

      {/* --- company / professional details (serious-buyer screening) --- */}
      {activeTrack === "company" ? (
        <>
          <IconField
            htmlFor={`${source}-company`}
            label="Company / Organization Name"
            required
            error={errors.company}
          >
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id={`${source}-company`}
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Acme Industries Pvt. Ltd."
                autoComplete="organization"
                autoCapitalize="words"
                disabled={submitting}
                aria-invalid={!!errors.company}
                className={cn("pl-9", errors.company && "border-destructive")}
              />
            </div>
          </IconField>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <IconField
              htmlFor={`${source}-account-type`}
              label="Company Type"
              required
              error={errors.accountType}
            >
              <IconSelect
                id={`${source}-account-type`}
                icon={<Briefcase className="h-4 w-4" aria-hidden="true" />}
                value={accountTypeValue}
                placeholder="Select company type"
                onValueChange={(v) => set("accountType", v)}
                invalid={!!errors.accountType}
                items={ACCOUNT_TYPES.company.map((t) => ({ value: t, label: t }))}
                disabled={submitting}
              />
            </IconField>
            <IconField
              htmlFor={`${source}-company-size`}
              label="Company Size"
              required
              error={errors.companySize}
            >
              <IconSelect
                id={`${source}-company-size`}
                icon={<Users className="h-4 w-4" aria-hidden="true" />}
                value={form.companySize}
                placeholder="Select company size"
                onValueChange={(v) => set("companySize", v)}
                invalid={!!errors.companySize}
                items={COMPANY_SIZES.map((t) => ({ value: t, label: t }))}
                disabled={submitting}
              />
            </IconField>
          </div>

          <IconField
            htmlFor={`${source}-country`}
            label="Country"
            required
            error={errors.country}
          >
            <IconSelect
              id={`${source}-country`}
              icon={<Globe className="h-4 w-4" aria-hidden="true" />}
              value={COUNTRIES.find((c) => c.name === form.country)?.code ?? ""}
              placeholder="Select country"
              onValueChange={setCountry}
              invalid={!!errors.country}
              items={COUNTRIES.map((c) => ({
                value: c.code,
                label: `${c.code === "OT" ? "" : `${c.code}  `}${c.name}`,
              }))}
              disabled={submitting}
            />
          </IconField>
        </>
      ) : (
        <>
          <IconField
            htmlFor={`${source}-profession`}
            label="Profession / Job Title"
            required
            error={errors.profession}
          >
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id={`${source}-profession`}
                value={form.profession}
                onChange={(e) => set("profession", e.target.value)}
                placeholder="e.g. Product Manager, Founder, Consultant"
                autoComplete="organization-title"
                autoCapitalize="words"
                disabled={submitting}
                aria-invalid={!!errors.profession}
                className={cn("pl-9", errors.profession && "border-destructive")}
              />
            </div>
          </IconField>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <IconField
              htmlFor={`${source}-account-type`}
              label="I am a"
              required
              error={errors.accountType}
            >
              <IconSelect
                id={`${source}-account-type`}
                icon={<User className="h-4 w-4" aria-hidden="true" />}
                value={accountTypeValue}
                placeholder="Select what describes you"
                onValueChange={(v) => set("accountType", v)}
                invalid={!!errors.accountType}
                items={ACCOUNT_TYPES.professional.map((t) => ({ value: t, label: t }))}
                disabled={submitting}
              />
            </IconField>
            <IconField
              htmlFor={`${source}-country`}
              label="Country"
              required
              error={errors.country}
            >
              <IconSelect
                id={`${source}-country`}
                icon={<Globe className="h-4 w-4" aria-hidden="true" />}
                value={COUNTRIES.find((c) => c.name === form.country)?.code ?? ""}
                placeholder="Select country"
                onValueChange={setCountry}
                invalid={!!errors.country}
                items={COUNTRIES.map((c) => ({
                  value: c.code,
                  label: `${c.code === "OT" ? "" : `${c.code}  `}${c.name}`,
                }))}
                disabled={submitting}
              />
            </IconField>
          </div>
        </>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <IconField
          htmlFor={`${source}-intent`}
          label="What brings you to STIOOS?"
          required
          error={errors.intent}
        >
          <IconSelect
            id={`${source}-intent`}
            icon={<Target className="h-4 w-4" aria-hidden="true" />}
            value={form.intent}
            placeholder="Select your buying intent"
            onValueChange={(v) => set("intent", v)}
            invalid={!!errors.intent}
            items={INTENT_OPTIONS.map((t) => ({ value: t, label: t }))}
            disabled={submitting}
          />
        </IconField>
        <IconField
          htmlFor={`${source}-timeline`}
          label="Expected project start"
          required
          error={errors.intentTimeline}
        >
          <IconSelect
            id={`${source}-timeline`}
            icon={<CalendarClock className="h-4 w-4" aria-hidden="true" />}
            value={form.intentTimeline}
            placeholder="When do you plan to start?"
            onValueChange={(v) => set("intentTimeline", v)}
            invalid={!!errors.intentTimeline}
            items={TIMELINE_OPTIONS.map((t) => ({ value: t, label: t }))}
            disabled={submitting}
          />
        </IconField>
      </div>

      {researchFlag && (
        <p className="-mt-1.5 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          STIOOS is curated for active buyers — you can still register and browse, and our
          experts will reach out when your timeline firms up.
        </p>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className={cn(
          "w-full bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 hover:from-violet-500 hover:to-blue-500",
          "h-10"
        )}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Creating your account…
          </>
        ) : (
          <>
            {submitLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] leading-relaxed text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Serious-buyer marketplace · Accounts are reviewed · Free forever · We never share your
        details.
      </p>
    </form>
  );
}

// ---------- building blocks ----------

function IconField({
  htmlFor,
  label,
  required,
  error,
  icon,
  children,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <div className="relative mt-1">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        {children}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Select rendered in the reference's icon-in-field style: the icon
 * floats over the full-width trigger, which gets matching left padding.
 */
function IconSelect({
  id,
  icon,
  value,
  placeholder,
  onValueChange,
  items,
  invalid,
  disabled,
}: {
  id: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onValueChange: (v: string) => void;
  items: { value: string; label: string }[];
  invalid?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      {/* value kept as a string (never undefined) so Radix stays controlled —
          an empty string still shows the placeholder */}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          aria-invalid={invalid}
          className={cn("w-full pl-9", invalid && "border-destructive")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
