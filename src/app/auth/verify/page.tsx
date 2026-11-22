"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Info,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ============================================================
// OTP VERIFICATION PAGE (/auth/verify)
//
// Shown immediately after the registration form. Two side-by-side
// cards collect 6-digit codes for the buyer's email and phone.
// On submit, the buyer is logged in via quickMarketLogin and
// routed to /dashboard/buyer.
//
// Pending registration data (email/phone) is read from
// sessionStorage so we can render "Code sent to <email>" — the
// signup page writes it before redirecting here.
// ============================================================

const PENDING_KEY = "stioos-signup-pending";
const RESEND_SECONDS = 30;
const CODE_LENGTH = 6;

interface PendingSignup {
  name?: string;
  email?: string;
  phone?: string;
  phoneCountry?: string;
  username?: string;
}

const DEFAULT_PENDING: Required<Pick<PendingSignup, "email" | "phone">> = {
  email: "buyer@stioos.com",
  phone: "+10000000000",
};

const emptySubscribe = () => () => {};

function usePendingSignup(): { pending: PendingSignup; hydrated: boolean } {
  // Client-only snapshot — null on the server, populated on the client.
  const raw = useSyncExternalStore(
    emptySubscribe,
    () => window.sessionStorage.getItem(PENDING_KEY) ?? null,
    () => null
  );
  // hydrated=true once the client snapshot has applied (raw is a string
  // OR an explicit empty string when the key is missing).
  const hydrated = raw !== null;
  const pending = useMemo<PendingSignup>(() => {
    if (raw === null || raw === "") return {};
    try {
      return JSON.parse(raw) as PendingSignup;
    } catch {
      return {};
    }
  }, [raw]);
  return { pending, hydrated };
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, Math.min(2, local.length));
  return `${head}${"*".repeat(Math.max(2, local.length - head.length))}@${domain}`;
}

function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  const tail = phone.slice(-4);
  const head = phone.slice(0, Math.min(3, phone.length - 4));
  return `${head}${"*".repeat(Math.max(3, phone.length - 4 - head.length))}${tail}`;
}

// ============================================================
// OTP input — 6 rounded square boxes. Each accepts one digit.
// Auto-advance on input; Backspace returns to previous box.
// ============================================================

interface OtpRowProps {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  ariaLabel: string;
}

function OtpRow({ value, onChange, disabled, ariaLabel }: OtpRowProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = useMemo(() => {
    const arr = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? "");
    return arr;
  }, [value]);

  const focusAt = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(CODE_LENGTH - 1, idx));
    const el = refs.current[clamped];
    if (el) {
      el.focus();
      // Move caret to end so re-typing replaces the digit cleanly.
      const len = el.value.length;
      try {
        el.setSelectionRange(len, len);
      } catch {
        /* not all input types support selection */
      }
    }
  }, []);

  const setDigit = (idx: number, raw: string) => {
    // Keep only the last digit typed (allows paste of a full code too).
    const cleaned = raw.replace(/\D/g, "");
    const next = cleaned.slice(-1);
    const chars = digits.slice();
    chars[idx] = next;
    const joined = chars.join("").slice(0, CODE_LENGTH);
    onChange(joined);
    if (next && idx < CODE_LENGTH - 1) {
      focusAt(idx + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!text) return;
    e.preventDefault();
    onChange(text);
    focusAt(Math.min(text.length, CODE_LENGTH - 1));
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[idx] && idx > 0) {
        e.preventDefault();
        focusAt(idx - 1);
        // Clear the previous box as well.
        const chars = digits.slice();
        chars[idx - 1] = "";
        onChange(chars.join(""));
      }
      return;
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      focusAt(idx - 1);
    }
    if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1) {
      e.preventDefault();
      focusAt(idx + 1);
    }
  };

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${CODE_LENGTH}, minmax(0, 1fr))` }}
      role="group"
      aria-label={ariaLabel}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={d}
          aria-label={`${ariaLabel} digit ${i + 1}`}
          disabled={disabled}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => {
            try {
              e.target.select();
            } catch {
              /* ignore */
            }
          }}
          className={cn(
            "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 text-center text-base font-semibold text-slate-900 shadow-sm transition-all outline-none",
            "focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-400/30",
            "disabled:opacity-60"
          )}
        />
      ))}
    </div>
  );
}

// ============================================================
// Resend timer — 30 second countdown, then "Resend code" link.
// Driven entirely by the setTimeout callback (no setState in the
// effect body): when seconds reaches 0 the effect early-returns
// and no further timeout is scheduled.
// ============================================================

function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = window.setTimeout(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearTimeout(t);
  }, [seconds]);

  const reset = useCallback(() => {
    setSeconds(initial);
  }, [initial]);

  return { seconds, canResend: seconds === 0, reset };
}

interface VerifyCardProps {
  kind: "email" | "phone";
  target: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  secondsLeft: number;
  canResend: boolean;
  onResend: () => void;
}

function VerifyCard({
  kind,
  target,
  value,
  onChange,
  disabled,
  secondsLeft,
  canResend,
  onResend,
}: VerifyCardProps) {
  const isEmail = kind === "email";
  const Icon = isEmail ? Mail : Phone;
  const label = isEmail ? "Email verification" : "Phone verification";
  const sentTo = isEmail ? maskEmail(target) : maskPhone(target);
  const changeHref = "/auth/signup";
  const changeLabel = isEmail ? "Change email" : "Change phone";

  return (
    <Card className="flex flex-col gap-4 rounded-3xl border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/[0.04]">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            isEmail
              ? "bg-teal-50 text-teal-600"
              : "bg-blue-50 text-blue-600"
          )}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Code sent to <span className="font-medium text-slate-700">{sentTo}</span>
          </p>
        </div>
      </div>

      <OtpRow
        value={value}
        onChange={onChange}
        disabled={disabled}
        ariaLabel={label}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <Link
          href={changeHref}
          className="font-semibold text-teal-600 hover:underline"
        >
          {changeLabel}
        </Link>
        {canResend ? (
          <button
            type="button"
            onClick={onResend}
            disabled={disabled}
            className="font-semibold text-teal-600 transition-opacity hover:underline disabled:opacity-50"
          >
            Resend code
          </button>
        ) : (
          <span className="text-slate-500">
            Resend in <span className="font-semibold text-slate-700">{secondsLeft}s</span>
          </span>
        )}
      </div>
    </Card>
  );
}

// ============================================================
// Page
// ============================================================

export default function VerifyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const quickMarketLogin = useAppStore((s) => s.quickMarketLogin);

  // Read the pending registration payload from sessionStorage via
  // useSyncExternalStore so SSR is stable and the client snapshot
  // applies right after hydration without any setState-in-effect.
  const { pending, hydrated } = usePendingSignup();
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const emailTarget = pending.email ?? DEFAULT_PENDING.email;
  const phoneTarget = pending.phone ?? DEFAULT_PENDING.phone;

  const emailCountdown = useCountdown(RESEND_SECONDS);
  const phoneCountdown = useCountdown(RESEND_SECONDS);

  const bothCodesEntered =
    emailCode.length === CODE_LENGTH && phoneCode.length === CODE_LENGTH;

  const onResendEmail = () => {
    emailCountdown.reset();
    toast({
      title: "Email code resent",
      description: `A new 6-digit code was sent to ${maskEmail(emailTarget)}.`,
    });
  };
  const onResendPhone = () => {
    phoneCountdown.reset();
    toast({
      title: "SMS code resent",
      description: `A new 6-digit code was sent to ${maskPhone(phoneTarget)}.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bothCodesEntered || submitting) return;

    setSubmitting(true);
    // Simulate the network round-trip for a real verification API.
    await new Promise((r) => setTimeout(r, 700));

    // Auto-login: prefer the buyer that matches the registered email,
    // otherwise fall back to the demo buyer so the dashboard always
    // opens for the demo.
    const state = useAppStore.getState();
    const lower = emailTarget.trim().toLowerCase();
    const match =
      state.users.find((u) => u.email.toLowerCase() === lower) ??
      state.users.find((u) => u.id === "usr-mkt-buyer") ??
      state.users[0];

    if (match) {
      quickMarketLogin(match.id);
    }

    // Clear the pending payload so a re-visit does not show stale data.
    try {
      window.sessionStorage.removeItem(PENDING_KEY);
    } catch {
      /* ignore */
    }

    toast({
      title: "Account verified",
      description: "Welcome to STIOOS — opening your workspace.",
    });

    window.setTimeout(() => router.push("/dashboard/buyer"), 300);
  };

  return (
    <div className="flex flex-col items-stretch gap-6">
      {/* Progress stepper */}
      <ol
        aria-label="Sign-up progress"
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        <StepPill state="done" label="ACCOUNT" />
        <StepPill state="done" label="DETAILS" />
        <StepPill state="current" label="VERIFY" />
      </ol>

      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Verify your account.
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          We sent verification codes to your registered email and phone.
        </p>
      </div>

      {/* Cards */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <VerifyCard
            kind="email"
            target={hydrated ? emailTarget : DEFAULT_PENDING.email}
            value={emailCode}
            onChange={setEmailCode}
            disabled={submitting}
            secondsLeft={emailCountdown.seconds}
            canResend={emailCountdown.seconds === 0}
            onResend={onResendEmail}
          />
          <VerifyCard
            kind="phone"
            target={hydrated ? phoneTarget : DEFAULT_PENDING.phone}
            value={phoneCode}
            onChange={setPhoneCode}
            disabled={submitting}
            secondsLeft={phoneCountdown.seconds}
            canResend={phoneCountdown.seconds === 0}
            onResend={onResendPhone}
          />
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-2.5 rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-800 ring-1 ring-inset ring-sky-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" aria-hidden="true" />
          <span>
            Check your spam folder if you don&apos;t see the email. SMS may take up to
            30 seconds to arrive.
          </span>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={!bothCodesEntered || submitting}
          className={cn(
            "h-12 w-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition-all hover:from-teal-600 hover:to-blue-600 hover:shadow-teal-500/30",
            "disabled:opacity-60 disabled:shadow-none"
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Enter both codes to continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-1 text-center text-sm text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-500" aria-hidden="true" />
          <span>Codes expire after 10 minutes.</span>
        </div>
      </form>
    </div>
  );
}

// ============================================================
// Stepper pill
// ============================================================

interface StepPillProps {
  state: "done" | "current";
  label: string;
}

function StepPill({ state, label }: StepPillProps) {
  const done = state === "done";
  return (
    <li className="flex items-center">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors",
          done
            ? "bg-orange-50 text-orange-600 ring-1 ring-inset ring-orange-200"
            : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-500/25"
        )}
      >
        {done ? (
          <Check className="h-3 w-3" aria-hidden="true" />
        ) : (
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
        )}
        {label}
      </span>
    </li>
  );
}
