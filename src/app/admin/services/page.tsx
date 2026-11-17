import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { listCategories, listServicesRaw, listSubcategories } from "@/lib/api/queries";
import { AdminServicesView } from "@/components/admin/services-view";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin/services");
    return;
  }
  const [services, categories, subcategories] = await Promise.all([
    listServicesRaw({}),
    listCategories(),
    listSubcategories(),
  ]);
  return (
    <AdminServicesView
      services={services}
      categories={categories}
      subcategories={subcategories}
    />
  );
}
