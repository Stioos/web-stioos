"use client";

import Link from "next/link";
import { Boxes, ClipboardList, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type MarketplaceSection = "requests" | "services" | "consultations" | "quotes";

const LINKS: Array<{ key: MarketplaceSection; label: string; href: string; icon: typeof ClipboardList }> = [
  { key: "requests", label: "Service Requests", href: "/admin/service-requests", icon: ClipboardList },
  { key: "services", label: "Services", href: "/admin/services", icon: Boxes },
  { key: "consultations", label: "Consultation", href: "/admin/inquiries?type=consultations", icon: MessageCircle },
  { key: "quotes", label: "Quotes", href: "/admin/quotes", icon: FileText },
];

export function MarketplaceSectionLinks({ current }: { current: MarketplaceSection }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {LINKS.filter((link) => link.key !== current && link.key !== "services").map((link) => {
        const Icon = link.icon;
        return (
          <Button key={link.key} asChild variant="outline" size="sm">
            <Link href={link.href}>
              <Icon className="mr-1.5 h-4 w-4" /> {link.label}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
