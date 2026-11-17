"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import {
  Building2,
  CalendarClock,
  ExternalLink,
  Mail,
  Phone,
  SendHorizonal,
  Wallet,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Inquiry, InquiryStatus, InquiryType } from "@/types";

// ---------- shared helpers ----------

export function initialsOf(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .slice(0, 2)
      .join("") || "?"
  );
}

export function relTime(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
}

export function exactTime(iso: string): string {
  try {
    return format(new Date(iso), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return iso;
  }
}

// ---------- type badge ----------

const TYPE_TONE: Record<InquiryType, "blue" | "violet" | "gray" | "amber"> = {
  quote: "amber",
  service_request: "blue",
  consultation: "violet",
  contact: "gray",
};

const TYPE_LABEL: Record<InquiryType, string> = {
  quote: "Quote",
  service_request: "Service Request",
  consultation: "Consultation",
  contact: "Contact",
};

export function InquiryTypeBadge({ type }: { type: InquiryType }) {
  return (
    <StatusBadge tone={TYPE_TONE[type]} dot={false}>
      {TYPE_LABEL[type]}
    </StatusBadge>
  );
}

// ---------- avatar ----------

export function InitialsAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-900 text-xs font-bold text-white",
        className
      )}
    >
      {initialsOf(name)}
    </span>
  );
}

// ---------- detail sheet ----------

const NEXT_STATUS: { status: Inquiry["status"]; label: string }[] = [
  { status: "new", label: "Mark as New" },
  { status: "in_progress", label: "Mark In Progress" },
  { status: "contacted", label: "Mark Contacted" },
  { status: "closed", label: "Close Inquiry" },
];

export function InquiryDetailSheet({
  inquiry,
  open,
  onOpenChange,
}: {
  inquiry: Inquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [reply, setReply] = useState("");
  const [logging, setLogging] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);

  if (!inquiry) return null;

  // PATCH /api/inquiries/[id] { status } — server updates the row and
  // logs the activity on its side.
  const handleStatus = async (status: InquiryStatus) => {
    setStatusBusy(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "same-origin",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update inquiry.");
      }
      toast({
        title: "Status updated",
        description: `Inquiry from ${inquiry.name} marked as ${status.replace("_", " ")}.`,
      });
      router.refresh();
    } catch (e) {
      toast({
        title: "Update failed",
        description: e instanceof Error ? e.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setStatusBusy(false);
    }
  };

  const handleLogResponse = () => {
    if (!reply.trim()) {
      toast({
        title: "Response is empty",
        description: "Write a quick reply before logging it.",
        variant: "destructive",
      });
      return;
    }
    // Demo-only — there is no "log response" API endpoint. The server
    // already logs every status change via logActivity(); this Quick
    // Reply keeps the demo experience intact without persisting a row.
    setLogging(true);
    setTimeout(() => {
      setLogging(false);
      setReply("");
      toast({
        title: "Response logged",
        description: `Your reply to ${inquiry.name} was recorded locally for demo purposes.`,
      });
    }, 500);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="space-y-0 border-b p-5 text-left">
          <div className="flex items-start gap-4">
            <InitialsAvatar name={inquiry.name} className="h-12 w-12 rounded-lg text-sm" />
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-lg">{inquiry.name}</SheetTitle>
              <SheetDescription className="mt-0.5 truncate">
                {inquiry.email}
              </SheetDescription>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <InquiryTypeBadge type={inquiry.type} />
                <StatusBadge tone={inquiry.status === "closed" ? "gray" : inquiry.status === "contacted" ? "violet" : "blue"}>
                  {inquiry.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </StatusBadge>
                <span className="text-xs text-muted-foreground" title={exactTime(inquiry.createdAt)}>
                  Received {relTime(inquiry.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-5 p-5">
          {/* Contact block */}
          <section aria-label="Contact details" className="rounded-lg border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <p className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <a href={`mailto:${inquiry.email}`} className="truncate text-blue-600 hover:underline">
                  {inquiry.email}
                </a>
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

          {/* Requirements block */}
          <section aria-label="Requirements" className="rounded-lg border-l-4 border-l-amber-500 bg-amber-500/10 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Requirements</h3>
            <blockquote className="mt-2 text-sm leading-relaxed text-foreground/90">
              {inquiry.requirements || "No additional requirements provided."}
            </blockquote>
          </section>

          {/* Related service + budget/timeline */}
          <section aria-label="Context" className="space-y-3">
            {inquiry.serviceName && (
              <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related Service</p>
                  <p className="mt-1 truncate text-sm font-medium">{inquiry.serviceName}</p>
                </div>
                {inquiry.serviceId && (
                  <Button asChild variant="outline" size="sm" className="shrink-0">
                    <Link href={`/admin/services?focus=${inquiry.serviceId}`}>
                      View Service <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 rounded-lg border bg-card p-4">
                <Wallet className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Budget</p>
                  <p className="truncate text-sm font-medium">{inquiry.budgetRange || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border bg-card p-4">
                <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Timeline</p>
                  <p className="truncate text-sm font-medium">{inquiry.timeline || "—"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Status updater */}
          <section aria-label="Update status" className="rounded-lg border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update Status</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {NEXT_STATUS.map((s) => (
                <Button
                  key={s.status}
                  size="sm"
                  variant={inquiry.status === s.status ? "default" : "outline"}
                  disabled={inquiry.status === s.status}
                  onClick={() => handleStatus(s.status)}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </section>

          {/* Quick reply */}
          <section aria-label="Quick reply" className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Reply</h3>
              <span className="text-[11px] text-muted-foreground">Demo — responses are logged, not sent</span>
            </div>
            <div className="mt-3 space-y-2.5">
              <Label htmlFor={`reply-${inquiry.id}`} className="sr-only">Quick reply</Label>
              <Textarea
                id={`reply-${inquiry.id}`}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={`Write a quick response to ${inquiry.name.split(" ")[0]}…`}
                rows={4}
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">{reply.trim().length} characters</p>
                <Button size="sm" onClick={handleLogResponse} disabled={logging}>
                  <SendHorizonal className="h-4 w-4" />
                  {logging ? "Logging…" : "Log response"}
                </Button>
              </div>
            </div>
          </section>
        </div>

        <Separator className="mt-0" />
      </SheetContent>
    </Sheet>
  );
}
