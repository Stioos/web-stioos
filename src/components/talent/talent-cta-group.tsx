"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageSquare } from "lucide-react";
import { TalentActionDialog } from "./talent-action-dialog";
import type { TalentAction } from "@/data/talent-form-specs";

interface TalentCtaGroupProps {
  optionSlug: string;
  groupSlug?: string;
  variant?: "hero" | "bottom";
}

export function TalentCtaGroup({
  optionSlug,
  groupSlug = "talent-solutions",
  variant = "hero",
}: TalentCtaGroupProps) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<TalentAction>("apply");

  const openAction = (act: TalentAction) => {
    setActiveAction(act);
    setOpen(true);
  };

  const getApplyUrl = (act: TalentAction) =>
    `/talent-solutions/apply?action=${act}&slug=${groupSlug}&sub=${optionSlug}`;

  if (variant === "bottom") {
    return (
      <>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href={getApplyUrl("apply")}
            onClick={(e) => {
              e.preventDefault();
              openAction("apply");
            }}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 text-sm font-bold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Apply Now
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>

          <Link
            href={getApplyUrl("consultation")}
            onClick={(e) => {
              e.preventDefault();
              openAction("consultation");
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-transparent px-8 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Talk to a Talent Expert
          </Link>
        </div>

        <TalentActionDialog
          open={open}
          onOpenChange={setOpen}
          optionSlug={optionSlug}
          initialAction={activeAction}
        />
      </>
    );
  }

  // Variant = "hero"
  return (
    <>
      <div className="flex flex-col gap-2.5">
        {/* Primary CTA button — full width: Apply Now */}
        <Link
          href={getApplyUrl("apply")}
          onClick={(e) => {
            e.preventDefault();
            openAction("apply");
          }}
          className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400"
        >
          Apply Now
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        {/* Two CTAs — single line, equal width */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href={getApplyUrl("get-started")}
            onClick={(e) => {
              e.preventDefault();
              openAction("get-started");
            }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400"
          >
            Get Started
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <Link
            href={getApplyUrl("consultation")}
            onClick={(e) => {
              e.preventDefault();
              openAction("consultation");
            }}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] font-semibold text-white transition-colors hover:bg-white/10"
          >
            Schedule Consultation
          </Link>
        </div>
      </div>

      <TalentActionDialog
        open={open}
        onOpenChange={setOpen}
        optionSlug={optionSlug}
        initialAction={activeAction}
      />
    </>
  );
}
