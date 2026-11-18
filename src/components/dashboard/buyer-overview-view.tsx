"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Inbox,
  Package,
  Sparkles,
  Users,
} from "lucide-react";
import {
  EmptyState,
  SectionCard,
  StatCard,
  StatusBadge,
  formatMoney,
} from "@/components/dashboard/shared";
import { ServiceCard } from "@/components/marketplace/service-card";
import { Button } from "@/components/ui/button";
import type { BuyerDTO } from "@/lib/auth-server";
import type { MarketOrder, MarketRequest, Service } from "@/types";

const PROGRESS_HINTS: Record<string, string> = {
  pending: "Confirming your order",
  in_progress: "Our delivery team is building your order",
  delivered: "Delivered — review & accept",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface BuyerOverviewViewProps {
  buyer: BuyerDTO;
  overview: {
    activeOrders: number;
    completedOrders: number;
    openRequests: number;
    savedServices: number;
    totalOrders: number;
    totalRequests: number;
  };
  orders: MarketOrder[];
  requests: MarketRequest[];
  featured: Service[];
}

/**
 * Buyer dashboard overview — server-fetched data rendered through a
 * presentational client view. Stats, active-orders list, my-requests list,
 * and featured recommendations grid. No data fetching here; mutations
 * (e.g. wishlist toggle) flow through the shared `ServiceCard` and its
 * `useWishlist` hook, then `router.refresh()` is called by the
 * marketplace's existing components.
 */
export function BuyerOverviewView({
  buyer,
  overview,
  orders,
  requests,
  featured,
}: BuyerOverviewViewProps) {
  const activeOrders = orders
    .filter((o) => ["pending", "in_progress", "delivered"].includes(o.status))
    .slice(0, 5);
  const myRequests = requests.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome back, {buyer.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-400">
          Track your orders, requests, and saved services at a glance.
        </p>
      </header>

      {/* Stats */}
      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active orders"
          value={overview.activeOrders}
          hint="In flight with delivery teams"
          icon={Package}
          accent="sky"
        />
        <StatCard
          label="Completed"
          value={overview.completedOrders}
          hint="Delivered & accepted"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Open requests"
          value={overview.openRequests}
          hint="Briefs waiting for proposals"
          icon={Inbox}
          accent="amber"
        />
        <StatCard
          label="Saved services"
          value={overview.savedServices}
          hint="In your wishlist"
          icon={Heart}
          accent="rose"
        />
      </section>

      {/* Talent Services quick action */}
      <Link
        href="/dashboard/buyer/talent-services"
        className="group flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600"
          aria-hidden="true"
        >
          <Users className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">Talent Services</span>
          <span className="block truncate text-xs text-muted-foreground">
            Train to Hire, Talent Sourcing, staffing pods and more — routed to the STIOOS delivery
            team with full tracking.
          </span>
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active orders */}
        <SectionCard
          title="Active orders"
          description="Everything currently in motion"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/buyer/orders">
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          }
        >
          <ul className="space-y-1">
            {activeOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href="/dashboard/buyer/orders"
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {order.serviceName}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {formatMoney(order.amount)} · {PROGRESS_HINTS[order.status]}
                    </span>
                  </span>
                  <StatusBadge status={order.status} />
                </Link>
              </li>
            ))}
            {activeOrders.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No active orders — browse the marketplace to get started.
              </li>
            )}
          </ul>
        </SectionCard>

        {/* My requests */}
        <SectionCard
          title="My requests"
          description="Briefs published to our expert teams"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/buyer/requests">
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          }
        >
          <ul className="space-y-1">
            {myRequests.map((request) => (
              <li key={request.id}>
                <Link
                  href="/dashboard/buyer/requests"
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/60"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {request.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {request.categoryName} · {request.budgetRange}
                    </span>
                  </span>
                  <StatusBadge status={request.status} />
                </Link>
              </li>
            ))}
            {myRequests.length === 0 && (
              <li className="py-6 text-center text-sm text-muted-foreground">
                No requests yet — post a brief to receive proposals.
              </li>
            )}
          </ul>
        </SectionCard>
      </div>

      {/* Featured recommendations */}
      <section className="space-y-3" aria-labelledby="featured-heading">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="featured-heading"
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400"
          >
            <Sparkles className="h-4 w-4 text-amber-400" aria-hidden="true" />
            Featured recommendations
          </h2>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:bg-white/[0.06] hover:text-white"
          >
            <Link href="/marketplace">
              Browse marketplace <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        {featured.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No featured services yet"
            description="Featured services from across the divisions will appear here."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
