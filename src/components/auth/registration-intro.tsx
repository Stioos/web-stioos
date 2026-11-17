"use client";

// REGISTRATION INTRO — the "why two tracks" copy + the Professional vs
// Company selector cards, extracted so the signup page can render them in
// two places:
//   • variant="panel"  → portaled into the dark brand aside on desktop
//                        (auth layout's #auth-left-top-slot) — uses the
//                        panel's fixed dark palette
//   • variant="inline" → above the form on mobile (where the aside is
//                        hidden) — uses theme-aware card styles
// Both instances drive the same controlled `registrationType` state owned
// by the signup page, which is passed down into BuyerRegistrationForm.

import { BadgeCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  REGISTRATION_TYPES,
  type RegistrationType,
} from "@/components/auth/buyer-registration-form";

interface RegistrationIntroProps {
  variant: "panel" | "inline";
  value: RegistrationType;
  onChange: (track: RegistrationType) => void;
}

export function RegistrationIntro({ variant, value, onChange }: RegistrationIntroProps) {
  const panel = variant === "panel";

  return (
    <div className={panel ? "space-y-4" : "space-y-3"}>
      <p
        className={cn(
          "leading-relaxed",
          panel ? "text-[13px] text-slate-400" : "text-sm text-muted-foreground"
        )}
      >
        Register as a{" "}
        <span className={panel ? "font-medium text-white" : "font-medium text-foreground"}>
          Professional / Individual
        </span>{" "}
        or a{" "}
        <span className={panel ? "font-medium text-white" : "font-medium text-foreground"}>
          Company / Organization
        </span>{" "}
        to start hiring great talent —{" "}
        <span className={panel ? "font-medium text-white" : "font-medium text-foreground"}>
          serious buyers only
        </span>
        . Every registration is reviewed so our experts stay focused on real projects.
      </p>

      <p
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
          panel
            ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
            : "bg-emerald-500/10 text-emerald-700 ring-emerald-500/30 dark:text-emerald-400"
        )}
      >
        <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Professionals &amp; Companies · Free forever · Vetted experts
      </p>

      {/* --- registration type (Professional/Individual vs Company/Organization) --- */}
      <div role="radiogroup" aria-label="Registration type" className="grid gap-2.5 sm:grid-cols-2">
        {REGISTRATION_TYPES.map((t) => {
          const active = value === t.value;
          return (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(t.value)}
              className={cn(
                "group relative rounded-lg border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                panel
                  ? active
                    ? "border-violet-400/60 bg-violet-500/15 ring-1 ring-violet-400/40"
                    : "border-white/15 bg-white/[0.04] hover:border-violet-400/40 hover:bg-white/[0.07]"
                  : active
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
                      : panel
                        ? "bg-white/10 text-slate-300"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {t.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-[13px] font-semibold leading-tight",
                      active
                        ? panel
                          ? "text-white"
                          : "text-foreground"
                        : panel
                          ? "text-slate-200"
                          : "text-foreground/80"
                    )}
                  >
                    {t.title}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 block text-[11px] leading-snug",
                      panel ? "text-slate-400" : "text-muted-foreground"
                    )}
                  >
                    {t.subtitle}
                  </span>
                </span>
                {active && (
                  <CheckCircle2
                    className={cn(
                      "h-4 w-4 shrink-0",
                      panel ? "text-violet-300" : "text-violet-600 dark:text-violet-400"
                    )}
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
