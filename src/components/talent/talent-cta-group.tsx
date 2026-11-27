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
  primaryLabel?: string;
}

// The 5 target options requested to show "Hire Talent" as their primary CTA button:
// 1. Get Trained (and 3 suboptions: custom-cohort-curriculum, ai-candidate-screening, training-sprint-delivery)
// 2. Get Placed (and 3 suboptions: browse-open-roles, interview-preparation, offer-onboarding)
// 3. Get Certified (and 3 suboptions: skills-assessment, industry-certifications, career-portfolio)
// 4. Joining Terms (and 3 suboptions: curriculum, pricing, agreement)
// 5. Learning Terms (and 3 suboptions: self-learning, curriculum, projects-development)
// Plus train-to-hire
export const HIRE_TALENT_TARGET_GROUPS = new Set([
  "train-to-hire",
  "get-trained",
  "get-placed",
  "get-certified",
  "joining-terms",
  "learning-terms",
]);

export const HIRE_TALENT_TARGET_SUBS = new Set([
  // get-trained suboptions
  "custom-cohort-curriculum",
  "ai-candidate-screening",
  "training-sprint-delivery",
  // get-placed suboptions
  "browse-open-roles",
  "interview-preparation",
  "offer-onboarding",
  // get-certified suboptions
  "skills-assessment",
  "industry-certifications",
  "career-portfolio",
  // joining-terms suboptions
  "curriculum",
  "pricing",
  "agreement",
  // learning-terms suboptions
  "self-learning",
  "projects-development",
]);

// Excluded employer options where no changes should be made:
// Build Talent, Hire Talent, Scale Workforce
export const EXCLUDED_NO_CHANGE_GROUPS = new Set([
  "build-talent",
  "hire-talent",
  "scale-workforce",
]);

export function isHireTalentOption(
  optionSlug: string,
  groupSlug: string = "talent-solutions"
): boolean {
  // If explicitly one of the excluded groups, do NOT change anything
  if (
    EXCLUDED_NO_CHANGE_GROUPS.has(groupSlug) ||
    EXCLUDED_NO_CHANGE_GROUPS.has(optionSlug) ||
    optionSlug.startsWith("build-talent") ||
    optionSlug.startsWith("hire-talent") ||
    optionSlug.startsWith("scale-workforce")
  ) {
    return false;
  }

  // Check group slug directly
  if (HIRE_TALENT_TARGET_GROUPS.has(groupSlug)) {
    return true;
  }

  // Check target group prefixes or direct matches
  for (const target of HIRE_TALENT_TARGET_GROUPS) {
    if (
      optionSlug === target ||
      optionSlug.startsWith(`${target}-`) ||
      optionSlug.startsWith(`${target}/`)
    ) {
      return true;
    }
  }

  // Check suboption slug
  if (HIRE_TALENT_TARGET_SUBS.has(optionSlug)) {
    return true;
  }

  return false;
}

export function TalentCtaGroup({
  optionSlug,
  groupSlug = "talent-solutions",
  variant = "hero",
  primaryLabel: customPrimaryLabel,
}: TalentCtaGroupProps) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<TalentAction>("apply");

  const isHireTalent = isHireTalentOption(optionSlug, groupSlug);

  const primaryLabel =
    customPrimaryLabel ?? (isHireTalent ? "Hire Talent" : "Apply Now");

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
            {primaryLabel}
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
        {/* Primary CTA button — full width: Hire Talent / Apply Now */}
        <Link
          href={getApplyUrl("apply")}
          onClick={(e) => {
            e.preventDefault();
            openAction("apply");
          }}
          className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 font-semibold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400"
        >
          {primaryLabel}
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
