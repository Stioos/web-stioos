"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, SearchX } from "lucide-react";
import { format } from "date-fns";
import { useAppStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ServiceForm } from "@/components/admin/service-form";

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? "";
  const hydrated = useHydrated();
  const service = useAppStore((s) => s.services.find((x) => x.id === id));

  if (!hydrated) {
    return (
      <div>
        <Skeleton className="mb-6 h-9 w-80" />
        <div className="space-y-4">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-[420px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div>
        <PageHeader title="Edit Service" />
        <EmptyState
          icon={SearchX}
          title="Service not found"
          description="This service may have been deleted or the link is out of date."
          action={{ label: "Back to Services", onClick: () => router.push("/admin/services") }}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={service.name}
        description={`Last updated ${format(new Date(service.updatedAt), "MMM d, yyyy")} · Created by ${service.createdBy}`}
        breadcrumb={
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link href="/admin/services" className="hover:text-foreground">Services</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="max-w-[220px] truncate font-medium text-foreground">{service.name}</span>
          </nav>
        }
      />
      <ServiceForm mode="edit" initial={service} key={service.id} />
    </div>
  );
}
