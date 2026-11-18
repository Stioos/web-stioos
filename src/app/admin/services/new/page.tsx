"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div>
      <PageHeader
        title="New Service"
        description="Define the service, classify it, add commercial details, and publish it to the marketplace."
        breadcrumb={
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/admin" className="hover:text-foreground">Admin</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link href="/admin/services" className="hover:text-foreground">Services</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-medium text-foreground">New</span>
          </nav>
        }
      />
      <ServiceForm mode="create" />
    </div>
  );
}
