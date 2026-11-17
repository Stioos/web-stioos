"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  Info,
  MessageSquare,
  MoreHorizontal,
  PhoneCall,
  PlayCircle,
  Trash2,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/shared/page-header";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/components/shared/confirm-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  InitialsAvatar,
  InquiryDetailSheet,
  exactTime,
  relTime,
} from "@/components/admin/inquiry-detail";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import type { Inquiry, InquiryStatus } from "@/types";

function ContactRequestsContent() {
  const { toast } = useToast();
  const inquiries = useAppStore((s) => s.inquiries);
  const updateInquiryStatus = useAppStore((s) => s.updateInquiryStatus);
  const deleteInquiry = useAppStore((s) => s.deleteInquiry);
  const confirm = useConfirmDialog();

  const [activeId, setActiveId] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      inquiries
        .filter((q) => q.type === "contact")
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [inquiries]
  );

  const countBy = (s: InquiryStatus) => rows.filter((q) => q.status === s).length;

  const active = activeId ? inquiries.find((q) => q.id === activeId) ?? null : null;

  const handleStatus = (inq: Inquiry, status: InquiryStatus) => {
    updateInquiryStatus(inq.id, status);
    toast({
      title: "Status updated",
      description: `Request from ${inq.name} marked as ${status.replace("_", " ")}.`,
    });
  };

  const openConfirmDelete = (inq: Inquiry) => {
    confirm.confirm({
      title: "Delete contact request?",
      description: `This permanently deletes the message from ${inq.name} (${inq.company || "Independent"}). This action cannot be undone.`,
      confirmLabel: "Delete request",
      destructive: true,
      onConfirm: () => {
        deleteInquiry(inq.id);
        toast({
          title: "Contact request deleted",
          description: `Message from ${inq.name} was permanently removed.`,
        });
      },
    });
  };

  const columns: Column<Inquiry>[] = [
    {
      key: "name",
      header: "Name",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-3">
          <InitialsAvatar name={r.name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "company",
      header: "Company",
      hideBelow: "sm",
      sortable: true,
      sortValue: (r) => r.company,
      render: (r) => <span className="text-sm">{r.company || "—"}</span>,
    },
    {
      key: "requirements",
      header: "Message",
      hideBelow: "md",
      render: (r) => (
        <span className="block max-w-[320px] truncate text-sm text-muted-foreground">
          {r.requirements || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => <EntityStatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Received",
      sortable: true,
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground" title={exactTime(r.createdAt)}>
          {relTime(r.createdAt)}
        </span>
      ),
    },
  ];

  const rowActions = (r: Inquiry) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Actions for request from ${r.name}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Request actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setActiveId(r.id)}>
          <Eye className="h-4 w-4" /> View details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={r.status === "in_progress"} onClick={() => handleStatus(r, "in_progress")}>
          <PlayCircle className="h-4 w-4" /> Mark In Progress
        </DropdownMenuItem>
        <DropdownMenuItem disabled={r.status === "contacted"} onClick={() => handleStatus(r, "contacted")}>
          <PhoneCall className="h-4 w-4" /> Mark Contacted
        </DropdownMenuItem>
        <DropdownMenuItem disabled={r.status === "closed"} onClick={() => handleStatus(r, "closed")}>
          <CheckCircle2 className="h-4 w-4" /> Close
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => openConfirmDelete(r)}
          className="text-red-600 focus:text-red-600 focus:bg-destructive/10 dark:text-red-400 dark:focus:text-red-400"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div>
      <PageHeader
        title="Contact Requests"
        description="Messages submitted through the public contact form, tracked to resolution."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Requests" value={rows.length} icon="MessageSquare" tone="blue" />
        <StatCard label="New" value={countBy("new")} icon="Inbox" tone="violet" />
        <StatCard label="In Progress" value={countBy("in_progress")} icon="PlayCircle" tone="amber" />
        <StatCard label="Closed" value={countBy("closed")} icon="CheckCircle2" tone="green" />
      </div>

      <Alert className="mb-6 border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle>Where contact form submissions land</AlertTitle>
        <AlertDescription className="text-sm">
          Every message sent through the public <span className="font-medium">/contact</span> page is
          captured here as a contact inquiry — alongside service requests and consultations in the
          main <span className="font-medium">Inquiries</span> queue. Use the status controls to track
          each conversation from first response to close.
        </AlertDescription>
      </Alert>

      <DataTable
        data={rows}
        columns={columns}
        searchKeys={["name", "email", "company"]}
        searchPlaceholder="Search name, email, company…"
        pageSize={8}
        rowActions={rowActions}
        onRowClick={(r) => setActiveId(r.id)}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="font-medium text-foreground">No contact requests yet</p>
            <p className="text-sm text-muted-foreground">
              Submissions from the public contact form will appear here.
            </p>
          </div>
        }
      />

      <InquiryDetailSheet inquiry={active} open={!!active} onOpenChange={(o) => !o && setActiveId(null)} />
      <ConfirmDialog state={confirm.state} onClose={confirm.close} />
    </div>
  );
}

export default function AdminContactRequestsPage() {
  return <ContactRequestsContent />;
}
