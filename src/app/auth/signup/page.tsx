"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  Info,
  Lock,
  Mail,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ============================================================
// SIGN UP PAGE — modern, self-contained registration form
// (matches the reference design: white card on light gray
// background, pill-shaped inputs with light gray fills, left
// icons inside each field, teal-to-blue gradient CTA).
//
// On submit, the registration payload is written to sessionStorage
// (key: "stioos-signup-pending") and the user is redirected to
// /auth/verify where email & phone OTP verification happens.
// ============================================================

const COUNTRY_CODES: { code: string; label: string }[] = [
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+91", label: "IN +91" },
  { code: "+233", label: "GH +233" },
  { code: "+234", label: "NG +234" },
  { code: "+254", label: "KE +254" },
  { code: "+27", label: "ZA +27" },
  { code: "+971", label: "AE +971" },
];

interface SignupFormState {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneCountry: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

const PENDING_KEY = "stioos-signup-pending";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const signUp = useAppStore((s) => s.signUp);

  const [form, setForm] = useState<SignupFormState>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneCountry: "+1",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update =
    <K extends keyof SignupFormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const usernameValid = /^[a-zA-Z0-9_]+$/.test(form.username) || form.username === "";

  const passwordsMatch =
    form.confirmPassword === "" || form.password === form.confirmPassword;

  const canSubmit =
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.username.trim() !== "" &&
    usernameValid &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    form.password.length >= 8 &&
    passwordsMatch &&
    form.agreed &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.agreed) {
      setError("Please accept the Terms & Conditions and Privacy Policy to continue.");
      return;
    }
    if (!usernameValid) {
      setError("Username may only contain letters, numbers and underscores.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setSubmitting(true);

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const fullPhone = `${form.phoneCountry}${form.phone.replace(/[^\d]/g, "")}`;

    // Persist the registration payload so the OTP page can read it
    // back to display "Code sent to <email>" / "<phone>".
    const pending = {
      name: fullName,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      phoneCountry: form.phoneCountry,
      phone: fullPhone,
      password: form.password,
      createdAt: new Date().toISOString(),
    };
    try {
      window.sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    } catch {
      // sessionStorage may be unavailable (private mode) — verification
      // will fall back to demo placeholders.
    }

    // Register into the in-memory store so the account exists after
    // verification; the verify page will trigger a quickMarketLogin.
    const result = signUp({
      name: fullName,
      email: pending.email,
      password: form.password,
      role: "buyer",
      phone: pending.phone,
      phoneCountry: pending.phoneCountry,
      registrationSource: "signup-page",
    });

    if (!result.ok) {
      // The email may already exist (demo data) — that is fine: we still
      // route to verification so the flow keeps working for the demo.
      if (result.error && /already exists/i.test(result.error)) {
        toast({
          title: "Account already exists",
          description: "You can still complete verification and sign in.",
        });
      } else {
        setSubmitting(false);
        setError(result.error ?? "Could not create the account. Please try again.");
        return;
      }
    }

    toast({
      title: "Account created",
      description: "Verify your email and phone to finish sign-up.",
    });

    // Small beat so the success toast reads before the redirect.
    window.setTimeout(() => router.push("/auth/verify"), 350);
  };

  return (
    <Card className="w-full rounded-3xl border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-900/[0.04] sm:p-3">
      <CardHeader className="gap-1.5 px-4 pt-6 sm:px-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Create Your Account
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Join the STIOOS marketplace — buyers, teams and admins all sign in through the same door.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 pb-6 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1 — First name / Last name */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PillField label="First Name" htmlFor="signup-firstName">
              <PillInput
                id="signup-firstName"
                name="firstName"
                autoComplete="given-name"
                placeholder="First name"
                leadingIcon={User}
                value={form.firstName}
                onChange={update("firstName")}
                disabled={submitting}
              />
            </PillField>

            <PillField label="Last Name" htmlFor="signup-lastName">
              <PillInput
                id="signup-lastName"
                name="lastName"
                autoComplete="family-name"
                placeholder="Last name"
                value={form.lastName}
                onChange={update("lastName")}
                disabled={submitting}
              />
            </PillField>
          </div>

          {/* Row 2 — Username (full width) */}
          <PillField
            label="Username"
            htmlFor="signup-username"
            helper="Letters, numbers & underscores only"
          >
            <PillInput
              id="signup-username"
              name="username"
              autoComplete="username"
              placeholder="your_username"
              leadingIcon={AtSign}
              value={form.username}
              onChange={update("username")}
              disabled={submitting}
              aria-invalid={!usernameValid}
            />
          </PillField>

          {/* Row 3 — Email / Phone */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PillField label="Email" htmlFor="signup-email">
              <PillInput
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                leadingIcon={Mail}
                value={form.email}
                onChange={update("email")}
                disabled={submitting}
              />
            </PillField>

            <PillField label="Phone No" htmlFor="signup-phone">
              <PhonePillInput
                countryValue={form.phoneCountry}
                onCountryChange={(v) =>
                  setForm((f) => ({ ...f, phoneCountry: v }))
                }
                phoneValue={form.phone}
                onPhoneChange={(v) =>
                  setForm((f) => ({ ...f, phone: v }))
                }
                disabled={submitting}
                countryOptions={COUNTRY_CODES}
              />
            </PillField>
          </div>

          {/* Row 4 — Password / Confirm */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PillField label="Password" htmlFor="signup-password">
              <PillInput
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                leadingIcon={Lock}
                value={form.password}
                onChange={update("password")}
                disabled={submitting}
                trailing={
                  <EyeToggle
                    shown={showPassword}
                    onToggle={() => setShowPassword((s) => !s)}
                    label={showPassword ? "Hide password" : "Show password"}
                  />
                }
              />
            </PillField>

            <PillField label="Confirm Password" htmlFor="signup-confirmPassword">
              <PillInput
                id="signup-confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                leadingIcon={Lock}
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                disabled={submitting}
                aria-invalid={!passwordsMatch}
                trailing={
                  <EyeToggle
                    shown={showConfirm}
                    onToggle={() => setShowConfirm((s) => !s)}
                    label={showConfirm ? "Hide password" : "Show password"}
                  />
                }
              />
            </PillField>
          </div>

          {/* Row 5 — Info banner */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-inset ring-sky-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" aria-hidden="true" />
            <span>
              After registration you&apos;ll verify email &amp; phone, then select your
              account type.
            </span>
          </div>

          {/* Row 6 — Agreement */}
          <label
            htmlFor="signup-agreed"
            className="flex cursor-pointer items-start gap-3 text-sm text-slate-700"
          >
            <Checkbox
              id="signup-agreed"
              checked={form.agreed}
              onCheckedChange={(c) => setForm((f) => ({ ...f, agreed: c === true }))}
              disabled={submitting}
              className="mt-0.5 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
            />
            <span className="leading-relaxed">
              I agree to the{" "}
              <Link
                href="/"
                className="font-semibold text-teal-600 hover:underline"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="font-semibold text-teal-600 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {/* Row 7 — Submit */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "h-12 w-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition-all hover:from-teal-600 hover:to-blue-600 hover:shadow-teal-500/30",
              "disabled:opacity-60 disabled:shadow-none"
            )}
          >
            Create Account
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>

          <div className="flex flex-col items-center gap-1.5 text-center text-sm sm:flex-row sm:justify-between sm:text-left">
            <p className="text-slate-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-teal-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
            <Link
              href="/"
              className="flex items-center gap-1.5 font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              Back to site
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Pill-shaped field primitives — local to this page so the
// design matches the reference (fully rounded inputs, light
// gray fills, left icons inside each field).
// ============================================================

interface PillFieldProps {
  label: string;
  htmlFor: string;
  helper?: string;
  children: React.ReactNode;
}

function PillField({ label, htmlFor, helper, children }: PillFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold uppercase tracking-wide text-slate-600"
      >
        {label}
      </label>
      {children}
      {helper && <p className="text-xs text-slate-400">{helper}</p>}
    </div>
  );
}

interface PillInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: LucideIcon;
  trailing?: React.ReactNode;
}

function PillInput({
  leadingIcon: LeadingIcon,
  trailing,
  className,
  ...props
}: PillInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full bg-slate-100 ring-1 ring-inset ring-transparent transition-colors focus-within:bg-white focus-within:ring-teal-400",
        className
      )}
    >
      {LeadingIcon && (
        <LeadingIcon
          className="ml-4 h-4 w-4 shrink-0 text-slate-400"
          aria-hidden="true"
        />
      )}
      <input
        {...props}
        className={cn(
          "h-12 w-full bg-transparent px-5 text-sm text-slate-900 placeholder:text-slate-400 outline-none disabled:opacity-60",
          LeadingIcon && "pl-2",
          trailing && "pr-1"
        )}
      />
      {trailing}
    </div>
  );
}

interface PhonePillInputProps {
  countryValue: string;
  onCountryChange: (value: string) => void;
  phoneValue: string;
  onPhoneChange: (value: string) => void;
  disabled?: boolean;
  countryOptions: { code: string; label: string }[];
}

function PhonePillInput({
  countryValue,
  onCountryChange,
  phoneValue,
  onPhoneChange,
  disabled,
  countryOptions,
}: PhonePillInputProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full bg-slate-100 ring-1 ring-inset ring-transparent transition-colors focus-within:bg-white focus-within:ring-teal-400"
      )}
    >
      <Phone className="ml-4 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
      <select
        aria-label="Phone country code"
        value={countryValue}
        onChange={(e) => onCountryChange(e.target.value)}
        disabled={disabled}
        className="h-12 shrink-0 bg-transparent pr-2 text-sm font-medium text-slate-700 outline-none disabled:opacity-60"
      >
        {countryOptions.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      <span className="h-5 w-px shrink-0 bg-slate-300" aria-hidden="true" />
      <input
        type="tel"
        autoComplete="tel-national"
        placeholder="000 000 0000"
        value={phoneValue}
        onChange={(e) => onPhoneChange(e.target.value)}
        disabled={disabled}
        className="h-12 w-full bg-transparent pr-5 text-sm text-slate-900 placeholder:text-slate-400 outline-none disabled:opacity-60"
      />
    </div>
  );
}

function EyeToggle({
  shown,
  onToggle,
  label,
}: {
  shown: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      tabIndex={-1}
      className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
    >
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}
