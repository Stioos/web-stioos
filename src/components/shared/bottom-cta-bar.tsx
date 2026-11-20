"use client";

import { FileText, MessageCircle, Send, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { LeadModal, useLeadModal, type LeadType } from "@/components/shared/lead-modal";

/**
 * BottomCTABar — three conversion CTA buttons rendered at the bottom of
 * a page's content area (no sticky bar, no background). Each button opens
 * the shared LeadModal with the appropriate lead type.
 *
 * Used ONLY on:
 *   - Service detail pages (/marketplace/[slug])
 *   - Solution pages (/solutions/[slug])
 *   - Talent solution pages (/talent-solutions/[slug])
 */
export function BottomCTABar({ serviceName }: { serviceName?: string }) {
  const heroCtaPrimary = useAppStore((s) => s.marketplaceSettings.heroCtaPrimary);
  const cardCtaPrimary = useAppStore((s) => s.marketplaceSettings.cardCtaPrimary);
  const quoteLabel = heroCtaPrimary || "Get A Quote";
  const enquiryLabel = cardCtaPrimary || "Request Service";

  const openLead = useLeadModal((s) => s.openModal);

  const handleClick = (type: LeadType) => {
    openLead(type, serviceName ?? "");
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {/* Get A Quote — primary, filled amber */}
        <button
          type="button"
          onClick={() => handleClick("quote")}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 text-sm font-bold text-brand-ink shadow-[0_0_24px_-8px] shadow-amber-500/60 transition-colors hover:bg-amber-400 sm:w-auto"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          {quoteLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Request Service — outlined cyan */}
        <button
          type="button"
          onClick={() => handleClick("service_request")}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-cyan-500/50 bg-transparent px-6 text-sm font-semibold text-cyan-600 transition-colors hover:bg-cyan-500/10 dark:text-cyan-400 sm:w-auto"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {enquiryLabel}
        </button>

        {/* Consultation — outlined violet */}
        <button
          type="button"
          onClick={() => handleClick("consultation")}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-violet-500/50 bg-transparent px-6 text-sm font-semibold text-violet-600 transition-colors hover:bg-violet-500/10 dark:text-violet-400 sm:w-auto"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Consultation
        </button>
      </div>
    </div>
  );
}
