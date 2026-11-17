"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Building2, CircleDollarSign, Inbox, Mail, Phone, Timer } from "lucide-react";

import { useAppStore } from "@/lib/store";
import type { Inquiry, InquiryStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import type { Column } from "@/components/shared/data-table";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

export default function MarketplaceRequestsPage() {
  const { toast } = useToast();
  const inquiries = useAppStore((s) => s.inquiries);
  const updateInquiryStatus = useAppStore((s) => s.updateInquiryStatus);

  const [viewing, setViewing] = useState<Inquiry | null>(null);

  const requests = useMemo(
    () =>
      inquiries
        .filter((q) => q.type === "service_request")
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [inquiries]
  );

  const changeStatus = (id: string, status: InquiryStatus, name: string) => {
    updateInquiryStatus(id, status);
    toast({
      title: "Status updated",
      description: `Request from ${name} marked as ${STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status}.`,
    });
  };

  const columns: Column<Inquiry>[] = [
    {
      key: "name",
      header: "Name / Company",
      sortable: true,
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
          <p className="truncate text-xs text-muted-foreground">{r.company || "Independent"}</p>
        </div>
      ),
    },
    {
      key: "serviceName",
      header: "Service",
      sortable: true,
      sortValue: (r) => r.serviceName ?? "",
      render: (r) => (
        <span className="block max-w-56 truncate text-sm text-foreground">
          {r.serviceName ?? "—"}
        </span>
      ),
    },
    {
      key: "budgetRange",
      header: "Budget",
      hideBelow: "md",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-sm text-foreground">
          <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" />
          {r.budgetRange || "—"}
        </span>
      ),
    },
    {
      key: "timeline",
      header: "Timeline",
      hideBelow: "lg",
      render: (r) => (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Timer className="h-3.5 w-3.5" />
          {r.timeline || "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (r) => r.status,
      render: (r) => <EntityStatusBadge status={r.status} />,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      sortValue: (r) => r.createdAt,
      hideBelow: "md",
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {format(parseISO(r.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Marketplace Requests"
        description="Service requests submitted through the marketplace. Review requirements, track progress, and update statuses."
        actions={
          <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm">
            <Inbox className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{requests.length}</span>
            <span className="text-muted-foreground">requests</span>
          </div>
        }
      />

      <DataTable
        data={requests}
        columns={columns}
        searchKeys={["name", "company", "serviceName", "requirements", "budgetRange"]}
        searchPlaceholder="Search requests…"
        pageSize={8}
        rowActions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            <Select
              value={row.status}
              onValueChange={(v) => changeStatus(row.id, v as InquiryStatus, row.name)}
            >
              <SelectTrigger
                aria-label={`Update status for ${row.name}`}
                className="h-8 w-[118px] text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-8" onClick={() => setViewing(row)}>
              View
            </Button>
          </div>
        )}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-1 text-center">
            <p className="font-medium text-foreground">No service requests</p>
            <p className="text-sm text-muted-foreground">
              Requests submitted from service pages will appear here.
            </p>
          </div>
        }
      />

      <Sheet open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {viewing && (
            <>
              <SheetHeader>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <div className="min-w-0">
                    <SheetTitle className="truncate">{viewing.name}</SheetTitle>
                    <SheetDescription className="mt-0.5">
                      {viewing.company || "Independent"} ·{" "}
                      {format(parseISO(viewing.createdAt), "MMM d, yyyy 'at' HH:mm")}
                    </SheetDescription>
                  </div>
                  <EntityStatusBadge status={viewing.status} />
                </div>
              </SheetHeader>

              <div className="space-y-6 px-4 pb-8">
                <Card className="p-5">
                  <CardContent className="space-y-3 p-0">
                    <div className="flex items-start gap-2.5">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                        <p className="truncate text-sm text-foreground">{viewing.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Phone</p>
                        <p className="text-sm text-foreground">{viewing.phone || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>
                        <p className="text-sm text-foreground">{viewing.company || "Independent"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requested service</p>
                  <p className="mt-1.5 text-sm font-medium text-foreground">
                    {viewing.serviceName ?? "General marketplace request"}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-md border bg-muted/40 px-3 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Budget</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">{viewing.budgetRange || "—"}</p>
                    </div>
                    <div className="rounded-md border bg-muted/40 px-3 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Timeline</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">{viewing.timeline || "—"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requirements</p>
                  <p className="mt-2 whitespace-pre-wrap rounded-md border bg-muted/30 px-4 py-3 text-sm leading-relaxed text-foreground">
                    {viewing.requirements || "No additional requirements provided."}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="req-status">Update status</Label>
                  <Select
                    value={viewing.status}
                    onValueChange={(v) => {
                      changeStatus(viewing.id, v as InquiryStatus, viewing.name);
                      setViewing((prev) => (prev ? { ...prev, status: v as InquiryStatus } : prev));
                    }}
                  >
                    <SelectTrigger id="req-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Status changes are recorded in the activity log immediately.
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
