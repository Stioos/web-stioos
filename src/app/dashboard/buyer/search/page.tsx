"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAllPublishedServices } from "@/lib/service-data";
import { useAppStore } from "@/lib/store";
import { ServiceCard } from "@/components/marketplace/service-card";

export default function SearchPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Search Results">
        <SearchContent />
      </DashboardShell>
    </RequireRole>
  );
}

function SearchContent() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const allServices = useMemo(() => getAllPublishedServices(), []);
  const categories = useAppStore((s) => s.categories);

  const results = useMemo(() => {
    if (!q.trim()) return { services: [], categories: [] };
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const svc = allServices.filter((s) => {
      const hay = [s.name, s.shortDescription, s.tags.join(" ")].join(" ").toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    const cats = categories.filter((c) => terms.every((t) => c.name.toLowerCase().includes(t)));
    return { services: svc, categories: cats };
  }, [q, allServices, categories]);

  const totalResults = results.services.length + results.categories.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Search Results for &ldquo;{q}&rdquo;
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {totalResults} {totalResults === 1 ? "result" : "results"} found
        </p>
      </div>

      {/* Categories */}
      {results.categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-400">Categories</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-amber-400/30 hover:bg-white/[0.05]"
              >
                <p className="text-sm font-bold text-white">{c.name}</p>
                <p className="mt-1 text-xs text-slate-400">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {results.services.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-amber-400">Services</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.services.slice(0, 12).map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {totalResults === 0 && (
        <div className="py-12 text-center">
          <Search className="mx-auto h-10 w-10 text-slate-600" aria-hidden="true" />
          <p className="mt-4 text-lg font-semibold text-white">No results found</p>
          <p className="mt-1 text-sm text-slate-400">
            Try different keywords or browse the marketplace.
          </p>
          <Link
            href="/marketplace"
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-brand-ink hover:bg-amber-400"
          >
            Browse Marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
