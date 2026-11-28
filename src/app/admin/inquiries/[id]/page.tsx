"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, CalendarClock, FileText, Mail, PackagePlus, Phone, SendHorizonal, Wallet } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { InquiryTypeBadge, exactTime, relTime } from "@/components/admin/inquiry-detail";
import { InitialsAvatar } from "@/components/admin/inquiry-detail";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Inquiry } from "@/types";

const NEXT_STATUS: { status: Inquiry["status"]; label: string }[] = [
  { status: "new", label: "Mark as New" },
  { status: "in_progress", label: "Mark In Progress" },
  { status: "contacted", label: "Mark Contacted" },
  { status: "closed", label: "Close Inquiry" },
];

export default function AdminInquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const inquiry = useAppStore((s) => s.inquiries.find((item) => item.id === params.id));
  const updateInquiryStatus = useAppStore((s) => s.updateInquiryStatus);
  const logActivity = useAppStore((s) => s.logActivity);
  const [reply, setReply] = useState("");
  const [logging, setLogging] = useState(false);

  if (!inquiry) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Inquiry not found.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/inquiries"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Inquiries</Link>
        </Button>
      </div>
    );
  }

  const handleStatus = (status: Inquiry["status"]) => {
    updateInquiryStatus(inquiry.id, status);
    toast({ title: "Status updated", description: `Inquiry from ${inquiry.name} marked as ${status.replace("_", " ")}.` });
  };

  const handleLogResponse = () => {
    if (!reply.trim()) {
      toast({ title: "Response is empty", description: "Write a quick reply before logging it.", variant: "destructive" });
      return;
    }
    setLogging(true);
    setTimeout(() => {
      logActivity("responded", "Inquiry Management", inquiry.id, `Response logged for inquiry from ${inquiry.name}.`);
      setLogging(false);
      setReply("");
      toast({ title: "Response logged", description: `Your reply to ${inquiry.name} was recorded in the activity log.` });
    }, 500);
  };

  return (
    <div className="-mx-4 -mt-4 flex min-h-[calc(100vh-7rem)] w-[calc(100%+2rem)] flex-col bg-background px-0 py-0 sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)]">
      <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-xl border bg-card p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link href={inquiry.type === "consultation" ? "/admin/inquiries?type=consultations" : "/admin/inquiries"}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-start gap-4 border-b pb-5">
          <InitialsAvatar name={inquiry.name} className="h-12 w-12 rounded-lg text-sm" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold">{inquiry.name}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{inquiry.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <InquiryTypeBadge type={inquiry.type} />
              <StatusBadge tone={inquiry.status === "closed" ? "gray" : inquiry.status === "contacted" ? "violet" : "blue"}>
                {inquiry.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </StatusBadge>
              <span className="text-xs text-muted-foreground" title={exactTime(inquiry.createdAt)}>Received {relTime(inquiry.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-5 py-5 lg:grid-cols-2">
          <section className="rounded-lg border bg-background p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h2>
            <div className="mt-3 space-y-3 text-sm">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">{inquiry.email}</a></p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{inquiry.phone || "—"}</p>
              <p className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" />{inquiry.company || "Independent"}</p>
            </div>
          </section>

          <section className="rounded-lg border-l-4 border-l-amber-500 bg-amber-500/10 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Requirements</h2>
            <p className="mt-2 text-sm leading-relaxed">{inquiry.requirements || "No additional requirements provided."}</p>
          </section>
        </div>

        <div className="space-y-4 border-t pt-5">
          {inquiry.serviceName && <section className="rounded-lg border bg-background p-4"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related Service</p><p className="mt-1 text-sm font-medium">{inquiry.serviceName}</p></section>}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 rounded-lg border bg-background p-4"><Wallet className="h-4 w-4 text-muted-foreground" /><div><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Budget</p><p className="text-sm font-medium">{inquiry.budgetRange || "—"}</p></div></div>
            <div className="flex items-center gap-2.5 rounded-lg border bg-background p-4"><CalendarClock className="h-4 w-4 text-muted-foreground" /><div><p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Timeline</p><p className="text-sm font-medium">{inquiry.timeline || "—"}</p></div></div>
          </div>

          <section className="rounded-lg border bg-background p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Update Status</h2>
            <div className="mt-3 flex flex-wrap gap-2">{NEXT_STATUS.map((item) => <Button key={item.status} size="sm" variant={inquiry.status === item.status ? "default" : "outline"} disabled={inquiry.status === item.status} onClick={() => handleStatus(item.status)}>{item.label}</Button>)}</div>
          </section>

          <section className="rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between gap-2"><h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Reply</h2><span className="text-[11px] text-muted-foreground">Demo — responses are logged, not sent</span></div>
            <div className="mt-3 space-y-2.5"><Label htmlFor={`reply-${inquiry.id}`} className="sr-only">Quick reply</Label><Textarea id={`reply-${inquiry.id}`} value={reply} onChange={(event) => setReply(event.target.value)} placeholder={`Write a quick response to ${inquiry.name.split(" ")[0]}…`} rows={4} /><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-muted-foreground">{reply.trim().length} characters</span><div className="flex flex-wrap gap-2"><Button asChild size="sm" variant="outline"><Link href="/admin/service-requests/create-order"><PackagePlus className="mr-1.5 h-4 w-4" /> Create Order</Link></Button><Button asChild size="sm" variant="outline"><Link href="/admin/quotes/create"><FileText className="mr-1.5 h-4 w-4" /> Create Quote</Link></Button><Button size="sm" onClick={handleLogResponse} disabled={logging}><SendHorizonal className="mr-1.5 h-4 w-4" />{logging ? "Logging…" : "Log response"}</Button></div></div></div>
          </section>
        </div>
      </div>
    </div>
  );
}
