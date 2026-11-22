"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { Briefcase, ArrowRight, DollarSign, Clock, Users } from "lucide-react";
import Link from "next/link";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useMemo } from "react";

export default function PostAJobPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Post a Service Job">
        <PostAJobContent />
      </DashboardShell>
    </RequireRole>
  );
}

function PostAJobContent() {
  const user = useCurrentUser();
  const services = useAppStore((s) => s.services);
  const requests = useAppStore((s) => s.requests);

  const stats = useMemo(() => {
    const myRequests = requests.filter((r) => r.buyerId === user?.id);
    return {
      total: myRequests.length,
      active: myRequests.filter((r) => r.status === "new" || r.status === "in_review").length,
      completed: myRequests.filter((r) => r.status === "completed" || r.status === "delivered").length,
    };
  }, [requests, user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Post a Service Job</h1>
        <p className="mt-1 text-sm text-slate-400">
          Tell us what you need — an expert replies with scope, timeline and pricing within 48 hours.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Briefcase className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Total Jobs</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sky-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Active</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Completed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.completed}</p>
        </div>
      </div>

      {/* Quick post form */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-bold text-white">Quick Job Post</h2>
        <p className="mt-1 text-sm text-slate-400">Fill in the basics — we'll match you with the right expert.</p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Job Title</label>
            <input
              type="text"
              placeholder="e.g., Build a custom AI agent for customer support"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400/40"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Budget Range</label>
              <select className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/40">
                <option>Under $5k</option>
                <option>$5k–$10k</option>
                <option>$10k–$15k</option>
                <option>$15k–$30k</option>
                <option>$30k–$50k</option>
                <option>$50k+</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Timeline</label>
              <select className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/40">
                <option>Immediate</option>
                <option>1–3 months</option>
                <option>3–6 months</option>
                <option>6–12 months</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Requirements</label>
            <textarea
              rows={4}
              placeholder="Describe what you need, your current setup, and any constraints..."
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400/40"
            />
          </div>
          <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-amber-500 px-6 text-sm font-bold text-brand-ink transition-colors hover:bg-amber-400">
            Post Job
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Browse services CTA */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <p className="text-sm text-slate-400">Not sure what you need?</p>
        <Link
          href="/marketplace"
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Browse Marketplace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
