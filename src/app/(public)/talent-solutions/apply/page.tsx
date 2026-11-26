"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TalentIntakeForm } from "@/components/talent/talent-intake-form";
import type { TalentAction } from "@/data/talent-form-specs";

function TalentApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sub = searchParams.get("sub") || "custom-cohort-curriculum";
  const slug = searchParams.get("slug") || "get-trained";
  const rawAction = searchParams.get("action");
  const action: TalentAction =
    rawAction === "get-started"
      ? "get-started"
      : rawAction === "consultation"
      ? "consultation"
      : "apply";

  const returnUrl = `/talent-solutions/${slug}/${sub}`;

  return (
    <div className="relative min-h-screen bg-brand-ink text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 surface-grid opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={returnUrl}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Program Overview
          </Link>

          <Link
            href="/talent-solutions"
            className="text-xs text-slate-400 transition-colors hover:text-amber-400"
          >
            All Talent Solutions
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-md sm:p-8 md:p-10">
          <TalentIntakeForm
            optionSlug={sub}
            initialAction={action}
            isStandalonePage
            onClose={() => router.push(returnUrl)}
          />
        </div>
      </div>
    </div>
  );
}

export default function TalentApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-brand-ink text-slate-400">
          Loading talent application...
        </div>
      }
    >
      <TalentApplyContent />
    </Suspense>
  );
}
