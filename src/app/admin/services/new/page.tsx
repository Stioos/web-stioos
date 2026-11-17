import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listCategories, listSubcategories } from "@/lib/api/queries";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceForm } from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

export default async function NewServicePage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/services/new");
    return;
  }
  const [categories, subcategories] = await Promise.all([
    listCategories(),
    listSubcategories(),
  ]);
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
      <ServiceForm
        mode="create"
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
}
