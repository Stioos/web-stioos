import type { Subcategory } from "@/types";

// ============================================================
// SUBCATEGORY ICON RESOLUTION — keyword → lucide icon name
// Shared by the public header flyouts and the category pages.
// ============================================================

const SUB_ICON_RULES: Array<[RegExp, string]> = [
  // Task 66-b subcategories — scoped patterns placed first so they win over
  // the generic rules below without hijacking any pre-existing sub's icon.
  [/sdr|outbound/i, "Radar"],
  [/conversion|\bcro\b/i, "Gauge"],
  [/\bemail\b|\bsms\b/i, "Mail"],
  [/\bpaid\b|\bppc\b/i, "Target"],
  [/\bseo\b|answer engine/i, "Search"],
  [/llmops/i, "Cpu"],
  [/streaming/i, "Radio"],
  [/readiness|assessment|audit|gap analysis/i, "ClipboardCheck"],
  [/migration/i, "CloudUpload"],
  [/kubernetes|container|docker/i, "Container"],
  [/finops|\bcost\b/i, "Coins"],
  [/reliability|\bsre\b|incident/i, "Siren"],
  [/ci\/cd|pipeline|release/i, "GitBranch"],
  [/agent/i, "Bot"],
  [/conversational|chat/i, "MessageSquare"],
  [/workflow/i, "Workflow"],
  [/process/i, "Workflow"],
  [/automation/i, "Zap"],
  [/formation/i, "Landmark"],
  [/tax|bookkeeping|accounting/i, "Calculator"],
  [/advisory/i, "Handshake"],
  [/financial|finance/i, "Calculator"],
  [/cloud|deployment|devops/i, "CloudCog"],
  [/mobile/i, "Smartphone"],
  [/application|software|tools|apps/i, "Code2"],
  [/web/i, "Globe"],
  [/api|integration|orchestr/i, "Plug"],
  [/systems|architecture/i, "DraftingCompass"],
  [/dashboard/i, "LayoutDashboard"],
  [/reporting/i, "FileText"],
  [/visualiz/i, "LineChart"],
  [/predictive|forecast/i, "TrendingUp"],
  [/research|competitor/i, "FileSearch"],
  [/market/i, "ScanLine"],
  [/analyt|intelligence/i, "BarChart3"],
  [/decision/i, "ScanEye"],
  [/customer|cx\b|crm|leads/i, "Users"],
  [/performance|optimization|\broi\b/i, "Activity"],
  [/marketing|personalization|campaign/i, "Megaphone"],
  [/enablement/i, "Handshake"],
  [/strategy/i, "Compass"],
  [/growth/i, "TrendingUp"],
  [/erp/i, "Boxes"],
  [/compliance|governance|security|risk|regulatory/i, "ShieldCheck"],
  [/transformation/i, "RefreshCw"],
  [/operational|operations|\bops\b/i, "Cog"],
  [/tech/i, "Cpu"],
  [/\bai\b/i, "Sparkles"],
  [/brand|identity|graphic|design|ux/i, "PenTool"],
  [/product/i, "Layers"],
  [/multimedia|video|motion|animation/i, "Clapperboard"],
  [/content/i, "FileText"],
  [/sales/i, "Target"],
  [/support/i, "Headset"],
  [/startup|rocket/i, "Rocket"],
];

export function subIconFor(sub: Subcategory, categoryIcon: string): string {
  for (const [pattern, icon] of SUB_ICON_RULES) {
    if (pattern.test(sub.name) || pattern.test(sub.description)) return icon;
  }
  return categoryIcon;
}
