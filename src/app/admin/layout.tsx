import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth-server";
import { getSetting, listRoles } from "@/lib/api/queries";
import { AdminShell } from "@/components/layout/admin-shell";
import type { BrandSettings } from "@/types";

export const metadata = {
  title: "Admin Platform",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin");
    return;
  }
  // Resolve the admin's role + brand settings once per request on the
  // server. AdminShell uses these for the sidebar nav (permissions) and
  // the footer copy ("© {year} {brand.siteName}"). Falls back to a
  // sensible default if the settings row isn't seeded yet.
  const [roles, brand] = await Promise.all([
    listRoles(),
    getSetting<BrandSettings>("brand"),
  ]);
  const role = roles.find((r) => r.id === admin.roleId);
  const brandSettings: BrandSettings = brand ?? {
    siteName: "STIOOS GLOBAL",
    tagline: "Intelligence That Builds What's Next",
    supportEmail: "support@stioos.com",
    salesEmail: "sales@stioos.com",
    phone: "",
    address: "",
  };
  return (
    <AdminShell admin={admin} role={role} brand={brandSettings}>
      {children}
    </AdminShell>
  );
}
