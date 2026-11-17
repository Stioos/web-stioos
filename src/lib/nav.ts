import type { ModuleKey } from "@/types";

// ============================================================
// PUBLIC NAVIGATION (mega menu architecture)
// ============================================================

export interface PublicNavChild {
  label: string;
  href: string;
  description?: string;
}

export interface PublicNavItem {
  label: string;
  href: string;
  mega?: boolean; // renders category grid
  children?: PublicNavChild[];
}

export const PUBLIC_NAV: PublicNavItem[] = [
  { label: "Solutions", href: "/solutions", mega: true },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Services", href: "/services", description: "The complete service catalog" },
      { label: "AI & Automation", href: "/category/ai-automation", description: "Workflow & process automation" },
      { label: "AI Automation & Agentic Solutions", href: "/category/ai-agents", description: "Autonomous agentic solutions" },
      { label: "Technology & Programming", href: "/category/technology-programming", description: "Custom engineering capacity" },
      { label: "Data & BI", href: "/category/data-business-intelligence", description: "Analytics & intelligence" },
      { label: "Consulting", href: "/category/strategy-consulting", description: "Strategy & advisory" },
    ],
  },
  { label: "Marketplace", href: "/marketplace" },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "All Industries", href: "/industries", description: "Ten core industries served" },
      { label: "Construction", href: "/industries/construction" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Technology", href: "/industries/technology" },
      { label: "Financial Services", href: "/industries/financial-services" },
      { label: "E-Commerce", href: "/industries/ecommerce" },
    ],
  },
  { label: "Insights", href: "/insights" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "All Resources", href: "/resources", description: "Guides, templates & case studies" },
      { label: "FAQs", href: "/resources/faqs", description: "Answers to common questions" },
      { label: "AI Readiness Checklist", href: "/resources#res-001", description: "42-point assessment" },
      { label: "Automation ROI Template", href: "/resources#res-002", description: "Board-ready business case" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ============================================================
// ADMIN NAVIGATION (permission-aware)
// ============================================================

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  module: ModuleKey;
  exact?: boolean;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: "LayoutDashboard", module: "dashboard", exact: true }],
  },
  {
    label: "Marketplace Management",
    items: [
      { label: "Services", href: "/admin/services", icon: "Layers", module: "services" },
      { label: "Orders", href: "/admin/orders", icon: "Package", module: "orders" },
      { label: "Service Requests", href: "/admin/service-requests", icon: "Inbox", module: "marketplace" },
      { label: "Users", href: "/admin/users", icon: "Users", module: "users" },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Inquiries", href: "/admin/inquiries", icon: "Mail", module: "inquiries" },
      { label: "Contact Requests", href: "/admin/contact-requests", icon: "MessageSquare", module: "inquiries" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Activity Logs", href: "/admin/activity", icon: "History", module: "activity" },
      { label: "Settings", href: "/admin/settings", icon: "Settings", module: "settings" },
    ],
  },
  {
    label: "Profile",
    items: [{ label: "My Profile", href: "/admin/profile", icon: "UserCircle", module: "settings" }],
  },
];

/** Modules a role can view → visible nav groups */
export function visibleAdminNav(
  isAdminSuper: boolean,
  permissions: Record<string, string[]> | null
): AdminNavGroup[] {
  if (!permissions || isAdminSuper) return ADMIN_NAV;
  return ADMIN_NAV.map((g) => ({
    ...g,
    items: g.items.filter((i) => (permissions[i.module] ?? []).includes("view")),
  })).filter((g) => g.items.length > 0);
}
