"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { MessageSquareText, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useMemo } from "react";

export default function ServiceResponsesPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Service Responses">
        <ServiceResponsesContent />
      </DashboardShell>
    </RequireRole>
  );
}

function ServiceResponsesContent() {
  const user = useCurrentUser();
  const inquiries = useAppStore((s) => s.inquiries);

  // Filter inquiries by buyer email — these are responses to their CTAs
  const myResponses = useMemo(
    () => inquiries.filter((i) => i.email === user?.email),
    [inquiries, user]
  );

  const stats = {
    total: myResponses.length,
    new: myResponses.filter((r) => r.status === "new").length,
    inProgress: myResponses.filter((r) => r.status === "in_progress").length,
    contacted: myResponses.filter((r) => r.status === "contacted").length,
    closed: myResponses.filter((r) => r.status === "closed").length,
  };

  const statusIcon = {
    new: Clock,
    in_progress: Clock,
    contacted: CheckCircle2,
    closed: XCircle,
  };

  const statusColor = {
    new: "text-sky-400 bg-sky-400/10",
    in_progress: "text-amber-400 bg-amber-400/10",
    contacted: "text-emerald-400 bg-emerald-400/10",
    closed: "text-slate-400 bg-slate-400/10",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Service Responses</h1>
        <p className="mt-1 text-sm text-slate-400">
          Responses from our team to your quotes, service requests, and consultations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-sky-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">New</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.new}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">In Progress</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Contacted</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.contacted}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Closed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.closed}</p>
        </div>
      </div>

      {/* Responses list */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-bold text-white">All Responses</h2>
        {myResponses.length === 0 ? (
          <div className="mt-4 py-8 text-center">
            <MessageSquareText className="mx-auto h-8 w-8 text-slate-600" aria-hidden="true" />
            <p className="mt-3 text-sm text-slate-400">No responses yet.</p>
            <p className="mt-1 text-xs text-slate-500">Submit a quote or service request to get responses from our team.</p>
            <Link
              href="/dashboard/buyer/requests"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-amber-500 px-5 text-sm font-bold text-brand-ink hover:bg-amber-400"
            >
              Post a Service Job
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {myResponses.map((resp) => {
              const StatusIcon = statusIcon[resp.status] ?? Clock;
              const colorClass = statusColor[resp.status] ?? statusColor.new;
              return (
                <div
                  key={resp.id}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                    <StatusIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">
                        {resp.serviceName ?? resp.type.replace("_", " ")}
                      </p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>
                        {resp.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{resp.requirements}</p>
                    <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-500">
                      <span>Budget: {resp.budgetRange}</span>
                      <span>Timeline: {resp.timeline}</span>
                      <span>{resp.createdAt?.split("T")[0] ?? "—"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick action */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
        <p className="text-sm text-slate-400">Need to submit a new request?</p>
        <Link
          href="/dashboard/buyer/requests"
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-transparent px-5 text-sm font-semibold text-white hover:bg-white/10"
        >
          Post a Service Job
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
