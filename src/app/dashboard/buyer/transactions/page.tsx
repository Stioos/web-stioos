"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeftRight,
  Building2,
  CalendarClock,
  ChevronRight,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  PhoneCall,
  Store,
  Wallet,
} from "lucide-react";
import { RequireRole } from "@/components/dashboard/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  EmptyState,
  StatCard,
} from "@/components/dashboard/shared";
import { StatusBadge as SharedStatusBadge } from "@/components/shared/status-badge";
import { InquiryTypeBadge } from "@/components/admin/inquiry-detail";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Inquiry, InquiryStatus, InquiryType } from "@/types";

// ---------- Status pipeline ----------

const INQUIRY_STATUS_FLOW: InquiryStatus[] = [
  "new",
  "in_progress",
  "contacted",
  "closed",
];

const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  contacted: "Contacted",
  closed: "Closed",
};

const INQUIRY_STATUS_TONE: Record<
  InquiryStatus,
  "blue" | "violet" | "gray"
> = {
  new: "blue",
  in_progress: "blue",
  contacted: "violet",
  closed: "gray",
};

/** Horizontal 4-step pipeline: New → In Progress → Contacted → Closed. */
function InquiryStatusStepper({ status }: { status: InquiryStatus }) {
  const current = Math.max(INQUIRY_STATUS_FLOW.indexOf(status), 0);
  return (
    <ol
      aria-label={`Status: ${INQUIRY_STATUS_LABEL[status]}`}
      className="flex items-start overflow-x-auto pb-1"
    >
      {INQUIRY_STATUS_FLOW.map((step, index) => {
        const past = index < current;
        const active = index === current;
        return (
          <li key={step} aria-current={active ? "step" : undefined} className="flex items-start">
            <span className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full border-2",
                  past && "border-amber-400 bg-amber-400",
                  active && "border-amber-400 bg-amber-400 ring-4 ring-amber-400/20",
                  !past && !active && "border-muted-foreground/40 bg-transparent"
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "whitespace-nowrap text-[10px] leading-none",
                  active
                    ? "font-semibold text-amber-300"
                    : past
                      ? "font-medium text-foreground"
                      : "font-medium text-muted-foreground"
                )}
              >
                {INQUIRY_STATUS_LABEL[step]}
              </span>
            </span>
            {index < INQUIRY_STATUS_FLOW.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  "mt-1 h-0.5 w-6 shrink-0 sm:w-10",
                  past ? "bg-amber-400" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Buyer-side status badge — reuses the shared StatusBadge with a tone lookup. */
function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <SharedStatusBadge tone={INQUIRY_STATUS_TONE[status]} dot>
      {INQUIRY_STATUS_LABEL[status]}
    </SharedStatusBadge>
  );
}

// ---------- Tabs ----------

type TxTab = "all" | InquiryType;

const TX_TABS: { value: TxTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "quote", label: "Quotes" },
  { value: "service_request", label: "Service Requests" },
  { value: "consultation", label: "Consultations" },
  { value: "contact", label: "Contact" },
];

// ---------- Detail dialog ----------

function TransactionDetailDialog({
  inquiry,
  open,
  onOpenChange,
}: {
  inquiry: Inquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!inquiry) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <InquiryTypeBadge type={inquiry.type} />
            <InquiryStatusBadge status={inquiry.status} />
            <span className="text-xs text-muted-foreground" title={format(new Date(inquiry.createdAt), "MMM d, yyyy 'at' h:mm a")}>
              Submitted {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
            </span>
          </div>
          <DialogTitle className="mt-2 text-lg">
            {inquiry.serviceName ?? "General inquiry"}
          </DialogTitle>
          <DialogDescription>
            Reference {inquiry.id} — track this CTA from submission to resolution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status timeline */}
          <section aria-label="Status timeline" className="rounded-xl border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status timeline
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Your inquiry moves through four stages as our team responds.
            </p>
            <div className="mt-3">
              <InquiryStatusStepper status={inquiry.status} />
            </div>
          </section>

          {/* Requirements */}
          <section
            aria-label="Your requirements"
            className="rounded-xl border-l-4 border-l-amber-500 bg-amber-500/10 p-4"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Your requirements
            </h3>
            <blockquote className="mt-2 text-sm leading-relaxed text-foreground/90">
              {inquiry.requirements || "No additional requirements provided."}
            </blockquote>
          </section>

          {/* Context grid */}
          <section aria-label="Details" className="grid gap-3 sm:grid-cols-2">
            {inquiry.serviceName && (
              <div className="rounded-xl border bg-card p-4 sm:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Related service
                </p>
                <p className="mt-1 truncate text-sm font-medium">
                  {inquiry.serviceName}
                </p>
                {inquiry.serviceId && (
                  <Button asChild variant="link" size="sm" className="mt-1 h-auto p-0 text-amber-400">
                    <Link href={`/marketplace?focus=${inquiry.serviceId}`}>
                      View service in marketplace
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
            <div className="flex items-center gap-2.5 rounded-xl border bg-card p-4">
              <Wallet className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Budget</p>
                <p className="truncate text-sm font-medium">{inquiry.budgetRange || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border bg-card p-4">
              <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Timeline</p>
                <p className="truncate text-sm font-medium">{inquiry.timeline || "—"}</p>
              </div>
            </div>
          </section>

          {/* Contact on file */}
          <section aria-label="Contact details" className="rounded-xl border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Contact on file
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <p className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{inquiry.email}</span>
              </p>
              <p className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{inquiry.phone || "—"}</span>
              </p>
              <p className="flex items-center gap-2 text-sm sm:col-span-2">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{inquiry.company || "Independent"}</span>
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Page ----------

function BuyerTransactionsContent() {
  const user = useCurrentUser();
  const inquiries = useAppStore((s) => s.inquiries);
  const [tab, setTab] = useState<TxTab>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Filter inquiries to those submitted by this buyer (matched on email)
  const myInquiries = useMemo(() => {
    if (!user) return [];
    return inquiries
      .filter((q) => q.email === user.email)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [inquiries, user]);

  // Per-type counts for the summary cards
  const counts = useMemo(() => {
    const byType = (t: InquiryType) => myInquiries.filter((q) => q.type === t).length;
    return {
      quote: byType("quote"),
      service_request: byType("service_request"),
      consultation: byType("consultation"),
      contact: byType("contact"),
    };
  }, [myInquiries]);

  // Tab counts (for the tab badges)
  const tabCount = (value: TxTab) =>
    value === "all"
      ? myInquiries.length
      : myInquiries.filter((q) => q.type === value).length;

  const filtered = useMemo(
    () => (tab === "all" ? myInquiries : myInquiries.filter((q) => q.type === tab)),
    [myInquiries, tab]
  );

  const active = activeId ? myInquiries.find((q) => q.id === activeId) ?? null : null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">My Transactions</h1>
          <p className="text-sm text-slate-400">
            Every quote, service request, consultation, and contact form you&apos;ve submitted — tracked to resolution.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/marketplace">
            <Store className="h-4 w-4" aria-hidden="true" />
            Browse Services
          </Link>
        </Button>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="My Quotes" value={counts.quote} icon={Wallet} accent="amber" />
        <StatCard label="My Service Requests" value={counts.service_request} icon={MessageSquare} accent="sky" />
        <StatCard label="My Consultations" value={counts.consultation} icon={PhoneCall} accent="violet" />
        <StatCard label="My Contact" value={counts.contact} icon={Mail} accent="emerald" />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TxTab)}>
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto w-full justify-start sm:w-auto">
            {TX_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="min-h-[36px] gap-1.5 px-3">
                {t.label}
                <span className="rounded-full bg-muted-foreground/15 px-1.5 text-[10px] font-semibold text-muted-foreground">
                  {tabCount(t.value)}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title={
            myInquiries.length === 0
              ? "You haven't submitted any CTAs yet"
              : "Nothing in this category yet"
          }
          description={
            myInquiries.length === 0
              ? "Explore the marketplace to request a quote or schedule a consultation."
              : "Try another tab to see your other submissions."
          }
          action={
            myInquiries.length === 0 ? (
              <Button asChild>
                <Link href="/marketplace">
                  <Store className="h-4 w-4" aria-hidden="true" />
                  Browse Services
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="table-scroll overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Type</TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">Service</TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:table-cell">Requirements</TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground xl:table-cell">Budget</TableHead>
                <TableHead className="hidden text-xs font-semibold uppercase tracking-wide text-muted-foreground xl:table-cell">Timeline</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                <TableHead className="w-10 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="sr-only">Open</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((q) => (
                <TableRow
                  key={q.id}
                  className="cursor-pointer"
                  onClick={() => setActiveId(q.id)}
                >
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground" title={format(new Date(q.createdAt), "MMM d, yyyy")}>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
                      {format(new Date(q.createdAt), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <InquiryTypeBadge type={q.type} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className={cn(
                        "block max-w-[220px] truncate text-sm",
                        q.serviceName ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {q.serviceName || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden max-w-[280px] lg:table-cell">
                    <span className="block truncate text-sm text-muted-foreground">
                      {q.requirements || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground xl:table-cell">
                    {q.budgetRange || "—"}
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground xl:table-cell">
                    {q.timeline || "—"}
                  </TableCell>
                  <TableCell>
                    <InquiryStatusBadge status={q.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TransactionDetailDialog
        inquiry={active}
        open={!!active}
        onOpenChange={(o) => !o && setActiveId(null)}
      />
    </div>
  );
}

export default function BuyerTransactionsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="My Transactions">
        <BuyerTransactionsContent />
      </DashboardShell>
    </RequireRole>
  );
}
