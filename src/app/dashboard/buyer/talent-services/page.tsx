import { TalentServicesView } from "@/components/dashboard/talent-services-view";

export const dynamic = "force-dynamic";

/**
 * Buyer "Talent Services" page.
 *
 * All five offerings come from the static `TALENT_REQUEST_KINDS` catalog,
 * so this page has no server-side reads — auth gating + dashboard chrome
 * are handled by `/dashboard/buyer/layout.tsx`. The per-kind dialog (in
 * the client view) POSTs to `/api/requests` with the kind + meta and
 * calls `router.refresh()` on success.
 */
export default function BuyerTalentServicesPage() {
  return <TalentServicesView />;
}
