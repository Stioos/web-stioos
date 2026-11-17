"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  FileText,
  MessageCircle,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { LeadModal, type LeadType } from "@/components/shared/lead-modal";

// ============================================================
// PAGE ACTION BAR — breadcrumb trail + three quick conversion
// CTAs (Get A Quote / Enquiry / Consultation), each
// opening a fully functional lead-capture modal.
//
// STICKY-AFTER-HERO: the bar is hidden while the hero is on
// screen. Once the user scrolls past the hero (the element each
// page renders directly after this component), the bar slides
// down and sticks directly below the sticky site header
// (h-16 = 64px mobile / lg:h-[72px] = 72px desktop — the same
// slot the secondary strip vacates past the hero). Scrolling
// back up above the hero hides it again. Used on categories,
// category (division), services, marketplace and service-detail
// pages.
// ============================================================

export interface ActionCrumb {
  label: string;
  /** omit on the last (current-page) crumb */
  href?: string;
}

interface PageActionBarProps {
  items: ActionCrumb[];
  /** Service/page context attached to every lead captured from this page */
  serviceName?: string;
  className?: string;
  /** Optional label override — defaults resolve from Admin → Settings
      → Marketplace so admins can reword the CTA site-wide. */
  enquiryLabel?: string;
}

export function PageActionBar({ items, serviceName, className, enquiryLabel }: PageActionBarProps) {
  // The context every lead from this page is tagged with — the explicit
  // prop wins, otherwise the current-page breadcrumb (last crumb).
  const context = serviceName ?? items[items.length - 1]?.label;

  // CTA labels are admin-editable (MarketplaceSettings); explicit props win.
  const heroCtaPrimary = useAppStore((s) => s.marketplaceSettings.heroCtaPrimary);
  const cardCtaPrimary = useAppStore((s) => s.marketplaceSettings.cardCtaPrimary);
  const quoteLabel = heroCtaPrimary || "Get A Quote";
  const resolvedEnquiryLabel = enquiryLabel || cardCtaPrimary || "Enquiry";

  const [leadType, setLeadType] = useState<LeadType | null>(null);

  // ── Stick-below-header trigger ──
  // The hero is measured on every scroll frame (rAF-throttled):
  // the bar engages exactly when the hero's bottom edge reaches
  // the sticky header's bottom edge, and disengages on the way back.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      // Sticky site header height (public-header: h-16 / lg:h-[72px])
      const headerH = window.matchMedia("(min-width: 1024px)").matches
        ? 72
        : 64;
      // Hero = the section each host page renders right after this bar.
      // Skip the fixed bar itself (it sits between sentinel and hero in
      // the DOM) via its data attribute.
      let hero = sentinel.nextElementSibling as HTMLElement | null;
      while (hero && hero.hasAttribute("data-page-action-bar")) {
        hero = hero.nextElementSibling as HTMLElement | null;
      }
      if (hero && hero.offsetHeight > 0) {
        setStuck(hero.getBoundingClientRect().bottom <= headerH + 1);
      } else {
        // No hero sibling — engage after a short scroll as fallback
        setStuck(window.scrollY > 360);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const openLead = (type: LeadType) => setLeadType(type);

  return (
    <>
      {/* In-flow sentinel (zero height) — the element rendered right
          after it on every host page is the hero used as the trigger. */}
      <div ref={sentinelRef} className="h-0" aria-hidden="true" />

      <section
        aria-label="Page navigation and quick actions"
        aria-hidden={!stuck}
        data-page-action-bar
        className={cn(
          "fixed inset-x-0 top-16 z-40 border-b border-white/[0.07] bg-brand-ink text-white transition-all duration-300 ease-out lg:top-[72px]",
          stuck
            ? "translate-y-0 opacity-100 shadow-[0_12px_36px_-16px_rgba(0,0,0,0.7)]"
            : "pointer-events-none invisible -translate-y-full opacity-0",
          className
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2.5 px-4 py-2.5 sm:px-6 lg:flex-row lg:items-center lg:gap-4">
          {/* Breadcrumb trail */}
          <nav aria-label="Breadcrumb" className="min-w-0 shrink-0">
            <ol className="flex items-center gap-1 text-xs">
              {items.map((crumb, i) => {
                const isLast = i === items.length - 1;
                return (
                  <li key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1">
                    {i > 0 && (
                      <ChevronRight
                        className="h-3 w-3 shrink-0 text-slate-600"
                        aria-hidden="true"
                      />
                    )}
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        tabIndex={stuck ? 0 : -1}
                        className="truncate text-slate-400 transition-colors hover:text-white"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        className={cn(
                          "truncate",
                          isLast
                            ? "font-semibold text-cyan-400"
                            : "text-slate-400"
                        )}
                        {...(isLast ? { "aria-current": "page" as const } : {})}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Quick conversion CTAs — each opens a functional lead form */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:ml-auto">
            <button
              type="button"
              onClick={() => openLead("quote")}
              tabIndex={stuck ? 0 : -1}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 text-xs font-bold text-brand-ink transition-colors hover:bg-amber-500/90"
            >
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              {quoteLabel}
            </button>
            <button
              type="button"
              onClick={() => openLead("service_request")}
              tabIndex={stuck ? 0 : -1}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/20"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              {resolvedEnquiryLabel}
            </button>
            <button
              type="button"
              onClick={() => openLead("consultation")}
              tabIndex={stuck ? 0 : -1}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-violet-400/40 bg-violet-400/10 px-3.5 text-xs font-semibold text-violet-300 transition-colors hover:bg-violet-400/20"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Lead capture dialog — one instance serves all three CTAs;
          the custom enquiry label flows into the modal title so the
          dialog matches the button the visitor clicked. */}
      <LeadModal
        open={leadType !== null}
        onOpenChange={(o) => !o && setLeadType(null)}
        type={leadType ?? "quote"}
        context={context}
        title={
          leadType === "service_request" && resolvedEnquiryLabel !== "Enquiry"
            ? resolvedEnquiryLabel
            : undefined
        }
      />
    </>
  );
}
