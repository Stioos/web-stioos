"use client";

import { LeadModal } from "@/components/shared/lead-modal";
import type { Service } from "@/types";

// ============================================================
// REQUEST SERVICE DIALOG — thin facade over the shared, gated
// LeadModal (type service_request, titled "Request Service").
// Every host page (marketplace, category, subcategory and the
// service-detail CTA band + mobile bar + related cards) inherits
// the buyer-registration capture funnel with zero call-site
// changes: external props are unchanged.
// ============================================================

export interface RequestServiceDialogProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestServiceDialog({ service, open, onOpenChange }: RequestServiceDialogProps) {
  return (
    <LeadModal
      open={open}
      onOpenChange={onOpenChange}
      type="service_request"
      title="Request Service"
      context={service?.name}
    />
  );
}
