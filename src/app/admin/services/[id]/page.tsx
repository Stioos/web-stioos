import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ChevronRight, SearchX } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  getServiceById,
  listCategories,
  listSubcategories,
} from "@/lib/api/queries";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ServiceForm } from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/services");
    return;
  }
  const { id } = await params;

  const [service, categories, subcategories] = await Promise.all([
    getServiceById(id),
    listCategories(),
    listSubcategories(),
  ]);

  if (!service) {
    return (
      <div>
        <PageHeader title="Edit Service" />
        <EmptyState
          icon={SearchX}
          title="Service not found"
          description="This service may have been deleted or the link is out of date."
          action={{ label: "Back to Services", href: "/admin/services" }}
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
      <ServiceForm
        mode="edit"
        initial={service}
        categories={categories}
        subcategories={subcategories}
        key={service.id}
      />
    </div>
  );
}
