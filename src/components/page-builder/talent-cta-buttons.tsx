"use client";

import { TalentCtaGroup } from "@/components/talent/talent-cta-group";

export interface TalentCtaButtonsProps {
  title?: string;
  fullTitle?: string;
  eyebrow?: string;
  subtitle?: string;
  heroStats?: { value: string; label: string }[];
  trustBadges?: string[];
  primaryLabel?: string;
  quoteLabel?: string;
  consultationLabel?: string;
  optionSlug?: string;
  groupSlug?: string;
  className?: string;
}

export function TalentCtaButtons({
  optionSlug = "train-to-hire",
  groupSlug = "talent-solutions",
  className,
}: TalentCtaButtonsProps) {
  return (
    <div className={className}>
      <TalentCtaGroup optionSlug={optionSlug} groupSlug={groupSlug} variant="hero" />
    </div>
  );
}

