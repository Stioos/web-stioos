"use client";

import Link from "next/link";
import { memo, useState } from "react";
import { CalendarClock, FileText, Heart, Star } from "lucide-react";
import type { Service } from "@/types";
import { getCategoryById } from "@/data/categories";
import { AccentTile } from "@/components/shared/icon";
import { ToastAction } from "@/components/ui/toast";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useLoginDrawer } from "@/components/auth/login-drawer";
import { useLeadModal } from "@/components/shared/lead-modal";
import { MeetingDialog } from "@/components/marketplace/meeting-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { deliveryLabel } from "@/lib/marketplace-utils";

export interface ServiceCardProps {
  service: Service;
  className?: string;
  /** Called when the "Request" button is pressed. If omitted the card navigates to the detail page. */
  onRequest?: (service: Service) => void;
}

/**
 * Premium, consistent marketplace service card.
 * The ENTIRE card is clickable — clicking anywhere routes to the
 * service detail page. The two footer buttons ("Get A Quote" and
 * "Book Consultation") and the wishlist heart use stopPropagation
 * so they act as independent actions.
 *
 * Memoized: grids render dozens of these at once, so unchanged cards
 * must not re-render when a sibling's wishlist toggle or a parent
 * state update triggers the list to re-evaluate.
 */
export const ServiceCard = memo(function ServiceCard({
  service,
  className,
  onRequest,
}: ServiceCardProps) {
  const { toast } = useToast();
  const [meetingOpen, setMeetingOpen] = useState(false);
  const category = getCategoryById(service.categoryId);
  const href = `/marketplace/${service.slug}`;
  const visibleTags = service.tags.slice(0, 3);
  const extraTags = service.tags.length - visibleTags.length;

  const wishlist = useAppStore((s) => s.wishlist);
  const toggleWishlist = useAppStore((s) => s.toggleWishlist);
  const user = useCurrentUser();
  const saved = wishlist.includes(service.slug);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Sign in to save services",
        description: "Create a free account to build your wishlist.",
        action: (
          <ToastAction altText="Sign in" onClick={() => useLoginDrawer.getState().openDrawer()}>
            Sign in
          </ToastAction>
        ),
      });
      return;
    }
    toggleWishlist(service.slug);
    toast({
      title: saved ? "Removed from wishlist" : "Saved to wishlist",
      description: saved
        ? `${service.name} was removed from your wishlist.`
        : `${service.name} was added to your wishlist.`,
    });
  };

  return (
    <>
    <article
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      {/* The entire card body is a <Link> — the most reliable navigation
          method in Next.js (works even if JS hydration is slow, and is
          crawlable by search engines). CTAs are OUTSIDE the Link so they
          can't intercept the navigation click. */}
      <Link
        href={href}
        aria-label={`${service.name} — view details`}
        className="flex flex-1 flex-col"
      >
        {/* Gradient header */}
        <div className="relative">
          <AccentTile
            gradient={service.accent}
            icon={service.icon}
            className="h-36 w-full"
            iconClass="h-9 w-9 transition-transform duration-300 group-hover:scale-110"
          />
          {category && (
            <span className="absolute left-3 top-3 rounded-md border border-white/20 bg-black/35 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
              {category.name}
            </span>
          )}
          {service.featured && (
            <span className="absolute right-12 top-3 inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-amber-950">
              <Star className="h-3 w-3 fill-current" aria-hidden="true" />
              Featured
            </span>
          )}
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label={saved ? `Remove ${service.name} from wishlist` : `Save ${service.name} to wishlist`}
            aria-pressed={saved}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform",
                saved ? "scale-110 fill-rose-400 text-rose-400" : "text-white"
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
            {category?.name ?? "Service"}
          </p>
          <h3 className="text-balance text-base leading-snug font-semibold text-foreground transition-colors group-hover:text-blue-700">
            {service.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {service.shortDescription}
          </p>

          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {extraTags > 0 && (
                <span className="rounded border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  +{extraTags}
                </span>
              )}
            </div>
          )}

          {/* Delivery + timeline */}
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-md bg-muted/60 px-2 py-1 font-semibold text-foreground">
              {deliveryLabel(service)}
            </span>
            <span className="text-muted-foreground">{service.timeline}</span>
          </div>
        </div>
      </Link>

      {/* CTA footer — OUTSIDE the Link so clicks on CTAs never trigger
          card navigation. No stopPropagation needed. */}
      <div className="flex items-center gap-2 border-t px-5 py-3">
        <button
          onClick={() => useLeadModal.getState().openModal("quote", service.name)}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-2 text-[12px] font-bold text-brand-ink transition-colors hover:bg-amber-400"
        >
          <FileText className="h-3.5 w-3.5" strokeWidth={2.2} />
          Get a Quote
        </button>
        <button
          onClick={() => setMeetingOpen(true)}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-violet-500/50 bg-transparent px-2 text-[12px] font-semibold text-violet-600 transition-colors hover:bg-violet-500/10 dark:text-violet-400"
        >
          <CalendarClock className="h-3.5 w-3.5" strokeWidth={2} />
          Book a Meeting
        </button>
      </div>
    </article>

      {/* Meeting booking dialog — outside the article entirely */}
      <MeetingDialog
        service={service}
        open={meetingOpen}
        onOpenChange={setMeetingOpen}
      />
    </>
  );
});
