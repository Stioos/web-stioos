"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmptyState } from "@/components/dashboard/shared";
import { ServiceCard } from "@/components/marketplace/service-card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

function WishlistContent() {
  const wishlist = useAppStore((s) => s.wishlist);
  const services = useAppStore((s) => s.services);
  // Wishlist seed slugs point at entries living in the deferred generated
  // catalog — until that chunk lands, "empty" would be a false negative.
  const catalogReady = useAppStore((s) => s.catalogReady);

  const savedServices = useMemo(
    () =>
      wishlist
        .map((slug) => services.find((s) => s.slug === slug))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [wishlist, services]
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Wishlist</h1>
        <p className="text-sm text-slate-400">
          Services you've saved for later — {savedServices.length}{" "}
          {savedServices.length === 1 ? "item" : "items"}.
        </p>
      </header>

      {savedServices.length === 0 && catalogReady ? (
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
          {savedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuyerWishlistPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Wishlist">
        <WishlistContent />
      </DashboardShell>
    </RequireRole>
  );
}
