"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { EmptyState } from "@/components/dashboard/shared";
import { ServiceCard } from "@/components/marketplace/service-card";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

export interface BuyerWishlistViewProps {
  services: Service[];
}

/**
 * Buyer "Wishlist" view — server-fetched list of saved services rendered
 * through a presentational client component. Each `<ServiceCard>` heart
 * button already toggles the wishlist via `useWishlist` (Task 7 wired it);
 * after a toggle the parent page should call `router.refresh()` to
 * re-fetch — but since the toggle itself optimistically updates the
 * shared wishlist cache in the `useWishlist` hook, the grid reflects the
 * change without a refresh too. The grid is purely presentational here.
 */
export function BuyerWishlistView({ services }: BuyerWishlistViewProps) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Wishlist</h1>
        <p className="text-sm text-slate-400">
          Services you've saved for later — {services.length}{" "}
          {services.length === 1 ? "item" : "items"}.
        </p>
      </header>

      {services.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any service card in the marketplace to save it here."
          action={
            <Button asChild>
              <Link href="/marketplace">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Explore the marketplace
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
