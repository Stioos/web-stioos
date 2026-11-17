"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserCog } from "lucide-react";
import {
  BuyerRegistrationForm,
  type BuyerRegistrationResult,
  type RegistrationType,
} from "@/components/auth/buyer-registration-form";
import { RegistrationIntro } from "@/components/auth/registration-intro";

export default function SignupPage() {
  const router = useRouter();

  // The track selector + intro copy live on the brand panel (desktop):
  // the page owns the controlled state and portals <RegistrationIntro
  // variant="panel"> into the layout's #auth-left-top-slot. On mobile
  // (where the aside is hidden) the inline variant renders above the form.
  const [track, setTrack] = useState<RegistrationType>("company");
  const [leftSlot, setLeftSlot] = useState<HTMLElement | null>(null);

  // Portal target lives in the auth layout's server-rendered aside. With
  // streaming SSR the page can hydrate before the aside is parsed, so the
  // slot may not exist yet on the first render — retry on the next frames
  // until it appears (setState inside the rAF callback keeps this
  // effect-async and lint-clean).
  useEffect(() => {
    let raf = 0;
    const find = () => {
      const el = document.getElementById("auth-left-top-slot");
      if (el) setLeftSlot(el);
      else raf = requestAnimationFrame(find);
    };
    raf = requestAnimationFrame(find);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Registration is buyer-only — it is the platform's serious-buyer
  // capture funnel: every new account grows the buyer base with a
  // qualified profile (company/profession, account type, intent,
  // timeline). All services are fulfilled by STIOOS delivery teams.
  const handleRegistered = (_result: BuyerRegistrationResult) => {
    // Small beat so the success toast reads before the redirect.
    window.setTimeout(() => router.push("/dashboard/buyer"), 600);
  };

  return (
    <div className="space-y-3 lg:space-y-2.5">
      {leftSlot &&
        createPortal(
          <RegistrationIntro variant="panel" value={track} onChange={setTrack} />,
          leftSlot
        )}

      <div className="space-y-3">
        <div className="lg:hidden">
          <p className="text-sm font-semibold text-foreground">STIOOS GLOBAL</p>
          <p className="text-xs text-muted-foreground">Create your account</p>
        </div>

        {/* Reference-style header */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md shadow-violet-600/20">
            <UserCog className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Create Your Buyer Account
          </h1>
        </div>

        {/* intro + track selector — mobile only (desktop sees it on the brand panel) */}
        <div className="lg:hidden">
          <RegistrationIntro variant="inline" value={track} onChange={setTrack} />
        </div>
      </div>

      <BuyerRegistrationForm
        variant="page"
        source="signup-page"
        submitLabel="Create Buyer Account"
        registrationType={track}
        onRegistrationTypeChange={setTrack}
        hideTypeSelector
        onRegistered={handleRegistered}
      />

      <div className="flex flex-col items-center gap-1.5 text-center text-sm sm:flex-row sm:justify-between sm:text-left">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <Link
          href="/"
          className="flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
      </div>
    </div>
  );
}
