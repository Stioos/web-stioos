"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Bell,
  Check,
  Compass,
  GripVertical,
  Loader2,
  LogOut,
  Mail,
  Palette,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Store,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/components/shared/confirm-dialog";
import { LogoMark } from "@/components/shared/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import type { BrandSettings, MarketplaceSettings, SecuritySettings } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PUBLIC_NAV } from "@/lib/nav";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================
// SECTION NAV
// ============================================================

type SectionId =
  | "general"
  | "branding"
  | "navigation"
  | "marketplace"
  | "notifications"
  | "security"
  | "danger";

const SECTIONS: { id: SectionId; label: string; description: string; icon: LucideIcon; danger?: boolean }[] = [
  { id: "general", label: "General", description: "Site identity & contact details", icon: Settings2 },
  { id: "branding", label: "Branding", description: "Logo, favicon & color tokens", icon: Palette },
  { id: "navigation", label: "Navigation", description: "Public menu & footer structure", icon: Compass },
  { id: "marketplace", label: "Marketplace", description: "Catalog behavior & engagement", icon: Store },
  { id: "notifications", label: "Notifications", description: "Alert & digest preferences", icon: Bell },
  { id: "security", label: "Security", description: "Sessions, passwords & 2FA", icon: ShieldCheck },
  { id: "danger", label: "Danger Zone", description: "Irreversible platform actions", icon: AlertTriangle, danger: true },
];

function SectionNav({ section, onSelect }: { section: SectionId; onSelect: (s: SectionId) => void }) {
  return (
    <nav aria-label="Settings sections" className="lg:sticky lg:top-24">
      <Card className="p-2">
        <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <li key={s.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                    active
                      ? s.danger
                        ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30"
                        : "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20"
                      : s.danger
                        ? "text-red-600 hover:bg-destructive/10 dark:text-red-400"
                        : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-sm font-medium">{s.label}</span>
                    <span className="hidden truncate text-xs text-muted-foreground lg:block">
                      {s.description}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </nav>
  );
}

// ============================================================
// SHARED SAVE BUTTON
// ============================================================

function SaveButton({
  saving,
  label = "Save changes",
  onClick,
  disabled,
}: {
  saving: boolean;
  label?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button onClick={onClick} disabled={saving || disabled}>
      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
      {saving ? "Saving…" : label}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>;
}

// ============================================================
// GENERAL
// ============================================================

function GeneralPanel() {
  const { toast } = useToast();
  const brand = useAppStore((s) => s.brand);
  const updateBrand = useAppStore((s) => s.updateBrand);
  const [draft, setDraft] = useState<BrandSettings>(brand);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Panels remount when switching sections, so drafts re-read fresh store state.

  const set = (key: keyof BrandSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!draft.siteName.trim()) errs.siteName = "Site name is required.";
    if (!EMAIL_RE.test(draft.supportEmail)) errs.supportEmail = "Enter a valid email address.";
    if (!EMAIL_RE.test(draft.salesEmail)) errs.salesEmail = "Enter a valid email address.";
    if (!draft.phone.trim()) errs.phone = "Phone number is required.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast({
        title: "Check your entries",
        description: "Some fields need attention before saving.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateBrand(draft);
      setSaving(false);
      toast({ title: "Settings saved", description: "General site settings updated successfully." });
    }, 500);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5">
          <h2 className="text-base font-semibold">General</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Site identity and contact details shown across the public site and footer.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" className="mt-1.5" value={draft.siteName} onChange={set("siteName")} />
            <FieldError message={errors.siteName} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" className="mt-1.5" value={draft.tagline} onChange={set("tagline")} />
          </div>
          <div>
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input id="supportEmail" type="email" className="mt-1.5" value={draft.supportEmail} onChange={set("supportEmail")} />
            <FieldError message={errors.supportEmail} />
          </div>
          <div>
            <Label htmlFor="salesEmail">Sales Email</Label>
            <Input id="salesEmail" type="email" className="mt-1.5" value={draft.salesEmail} onChange={set("salesEmail")} />
            <FieldError message={errors.salesEmail} />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" className="mt-1.5" value={draft.phone} onChange={set("phone")} />
            <FieldError message={errors.phone} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" className="mt-1.5" value={draft.address} onChange={set("address")} />
          </div>
        </div>
        <Separator className="my-5" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Changes apply immediately across the public site.</p>
          <SaveButton saving={saving} onClick={handleSave} />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// BRANDING
// ============================================================

const BRAND_TOKENS = [
  { name: "Primary Blue", hex: "#1e64e8" },
  { name: "Amber Accent", hex: "#f59e0b" },
  { name: "Brand Ink", hex: "#05070d" },
  { name: "Panel Navy", hex: "#0a1224" },
  { name: "Logo Silver", hex: "#c9d3e0" },
  { name: "Surface White", hex: "#ffffff" },
];

function BrandingPanel() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Branding saved (demo)",
        description: "Brand assets are locked to the official uploaded files in this demo.",
      });
    }, 500);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Branding</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Official logo, favicon, and color tokens for the platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-brand-ink p-6">
            <p className="eyebrow mb-4 text-slate-500">Logo — Dark Surface</p>
            <div className="flex items-center justify-center rounded-md py-6">
              <LogoMark href={null} className="h-16 w-16" />
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">Render on dark backgrounds only</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="eyebrow mb-4 text-slate-500">Mark — Light Surface</p>
            <div className="flex items-center justify-center rounded-md py-6">
              <LogoMark href={null} className="h-16 w-16" />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">Mark works on light surfaces</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          The logo is the official uploaded asset. Replacing it requires a new asset upload by the
          platform team — it cannot be swapped from the admin UI.
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Favicon</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded border bg-brand-ink">
                <LogoMark href={null} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-medium">stioos-mark-v4.png</p>
                <p className="text-xs text-muted-foreground">Square mark, sidebar + tab icon</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color Tokens</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {BRAND_TOKENS.map((t) => (
                <div key={t.hex} className="rounded-md border p-2 text-center" title={`${t.name} ${t.hex}`}>
                  <span
                    className="mx-auto block h-6 w-full rounded border border-black/10"
                    style={{ backgroundColor: t.hex }}
                    aria-hidden="true"
                  />
                  <span className="mt-1.5 block truncate text-[10px] font-medium text-muted-foreground">{t.hex}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-5" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Brand tokens are read-only in this demo.</p>
          <SaveButton saving={saving} label="Save branding" onClick={handleSave} />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// NAVIGATION
// ============================================================

const FOOTER_SUMMARY = [
  { title: "Brand Column", detail: "Logo, description, sales email, phone, address, social links" },
  { title: "Marketplace", detail: "Top 6 categories pulled dynamically from the catalog" },
  { title: "Company", detail: "About Us · Industries · Insights · Resources · Contact · Solutions" },
  { title: "Platform", detail: "Marketplace · All Services · Search · Admin Platform · Login" },
];

function NavigationPanel() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Navigation saved (demo)",
        description: "Navigation structure is managed in code for type safety.",
      });
    }, 500);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Navigation</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Public menu structure and footer columns. Editing ships with the CMS integration.
          </p>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">Main Navigation</p>
            <span className="text-xs text-muted-foreground">{PUBLIC_NAV.length} top-level items</span>
          </div>
          <ul className="divide-y">
            {PUBLIC_NAV.map((item) => (
              <li key={item.label} className="flex items-center gap-3 px-4 py-3">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-disabled="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{item.href}</p>
                </div>
                {item.mega && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/25 dark:text-amber-400 dark:ring-amber-500/30">
                    Mega Menu
                  </span>
                )}
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.children ? `${item.children.length} children` : "No children"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg border bg-card p-4">
          <p className="text-sm font-semibold">Footer Columns</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {FOOTER_SUMMARY.map((c) => (
              <div key={c.title} className="rounded-md bg-muted/50 px-3 py-2.5">
                <p className="text-sm font-medium">{c.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-5" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Navigation structure is managed in code for type safety (demo).</p>
          <SaveButton saving={saving} onClick={handleSave} />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// MARKETPLACE
// ============================================================

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
];

function MarketplacePanel() {
  const { toast } = useToast();
  const settings = useAppStore((s) => s.marketplaceSettings);
  const updateMarketplaceSettings = useAppStore((s) => s.updateMarketplaceSettings);
  const [draft, setDraft] = useState<MarketplaceSettings>(settings);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      // Trim CTA labels; a blank can never render an empty button.
      const safe: MarketplaceSettings = {
        ...draft,
        heroCtaPrimary: draft.heroCtaPrimary.trim() || "Get a Quote",
        heroCtaSecondary: draft.heroCtaSecondary.trim() || "Schedule Consultation",
        cardCtaPrimary: draft.cardCtaPrimary.trim() || "Request Service",
        cardCtaSecondary: draft.cardCtaSecondary.trim() || "Contact an Expert",
      };
      updateMarketplaceSettings(safe);
      setDraft(safe);
      setSaving(false);
      toast({
        title: "Marketplace settings saved",
        description: `Status: ${safe.status === "live" ? "Live" : "Maintenance"} · Featured slots: ${safe.featuredSlots}`,
      });
    }, 500);
  };

  const toggles: { key: keyof MarketplaceSettings; label: string; hint: string }[] = [
    {
      key: "autoApproveServices",
      label: "Auto-approve new services",
      hint: "Publish newly submitted services without admin review.",
    },
    {
      key: "requireLeadRegistration",
      label: "Require buyer registration before enquiries",
      hint: "Guests must create a free buyer account (step 1) before any quote, consultation, request or contact form opens — every capture grows the buyer base.",
    },
  ];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Marketplace</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Catalog availability and default ordering.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="mp-status">Marketplace Status</Label>
            <Select
              value={draft.status}
              onValueChange={(v) => setDraft((d) => ({ ...d, status: v as MarketplaceSettings["status"] }))}
            >
              <SelectTrigger id="mp-status" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="maintenance">Maintenance Mode</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mp-sort">Default Sort Order</Label>
            <Select value={draft.defaultSort} onValueChange={(v) => setDraft((d) => ({ ...d, defaultSort: v }))}>
              <SelectTrigger id="mp-sort" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="mp-slots">Featured Slots</Label>
            <Input
              id="mp-slots"
              type="number"
              min={0}
              max={24}
              className="mt-1.5"
              value={draft.featuredSlots}
              onChange={(e) => setDraft((d) => ({ ...d, featuredSlots: Math.max(0, parseInt(e.target.value || "0", 10) || 0) }))}
            />
            <p className="mt-1 text-xs text-muted-foreground">Number of services featured on the homepage.</p>
          </div>
        </div>

        {/* Service-page CTAs & lead capture (admin-editable labels) */}
        <div className="mt-6 rounded-lg border p-4">
          <p className="text-sm font-semibold">Service Page CTAs &amp; Lead Capture</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Reword the conversion buttons on service pages — applies site-wide instantly.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="mp-hero-primary">Hero primary (quote)</Label>
              <Input
                id="mp-hero-primary"
                className="mt-1.5"
                value={draft.heroCtaPrimary}
                onChange={(e) => setDraft((d) => ({ ...d, heroCtaPrimary: e.target.value }))}
                placeholder="Get a Quote"
              />
            </div>
            <div>
              <Label htmlFor="mp-hero-secondary">Hero secondary (consultation)</Label>
              <Input
                id="mp-hero-secondary"
                className="mt-1.5"
                value={draft.heroCtaSecondary}
                onChange={(e) => setDraft((d) => ({ ...d, heroCtaSecondary: e.target.value }))}
                placeholder="Schedule Consultation"
              />
            </div>
            <div>
              <Label htmlFor="mp-card-primary">Card primary (service request)</Label>
              <Input
                id="mp-card-primary"
                className="mt-1.5"
                value={draft.cardCtaPrimary}
                onChange={(e) => setDraft((d) => ({ ...d, cardCtaPrimary: e.target.value }))}
                placeholder="Request Service"
              />
            </div>
            <div>
              <Label htmlFor="mp-card-secondary">Card secondary (contact)</Label>
              <Input
                id="mp-card-secondary"
                className="mt-1.5"
                value={draft.cardCtaSecondary}
                onChange={(e) => setDraft((d) => ({ ...d, cardCtaSecondary: e.target.value }))}
                placeholder="Contact an Expert"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {toggles.map((t) => {
            const checked = draft[t.key] as boolean;
            return (
              <div key={t.key} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.hint}</p>
                </div>
                <Switch
                  checked={checked}
                  onCheckedChange={(v) => setDraft((d) => ({ ...d, [t.key]: v }))}
                  aria-label={t.label}
                />
              </div>
            );
          })}
        </div>

        <Separator className="my-5" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {draft.status === "maintenance" ? "Marketplace is currently in maintenance mode." : "Marketplace is live."}
          </p>
          <SaveButton saving={saving} onClick={handleSave} />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// NOTIFICATIONS
// ============================================================

interface NotificationPrefs {
  emailNewInquiry: boolean;
  emailNewServiceRequest: boolean;
  emailWeeklyDigest: boolean;
  adminAdminCreated: boolean;
  adminRoleChanged: boolean;
  inquiryStatusChanges: boolean;
}

const PREF_GROUPS: {
  title: string;
  items: { key: keyof NotificationPrefs; label: string; hint: string }[];
}[] = [
  {
    title: "Email Notifications",
    items: [
      { key: "emailNewInquiry", label: "New inquiries", hint: "Email me whenever a new inquiry arrives." },
      { key: "emailNewServiceRequest", label: "New service requests", hint: "Email me for new service and consultation requests." },
      { key: "emailWeeklyDigest", label: "Weekly digest", hint: "A Monday-morning summary of platform activity." },
    ],
  },
  {
    title: "Admin Activity",
    items: [
      { key: "adminAdminCreated", label: "Admin accounts created", hint: "Notify when a new admin account is added." },
      { key: "adminRoleChanged", label: "Role changes", hint: "Notify when an admin's role or permissions change." },
    ],
  },
  {
    title: "Inquiries",
    items: [
      { key: "inquiryStatusChanges", label: "Status changes", hint: "Notify when an inquiry status is updated by any admin." },
    ],
  },
];

function NotificationsPanel() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    emailNewInquiry: true,
    emailNewServiceRequest: true,
    emailWeeklyDigest: false,
    adminAdminCreated: true,
    adminRoleChanged: true,
    inquiryStatusChanges: false,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Notification preferences saved" });
    }, 500);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Notifications</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Choose which platform events trigger alerts for you.
          </p>
        </div>

        <div className="space-y-5">
          {PREF_GROUPS.map((group, gi) => (
            <div key={group.title}>
              {gi > 0 && <Separator className="mb-5" />}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.hint}</p>
                    </div>
                    <Switch
                      checked={prefs[item.key]}
                      onCheckedChange={(v) => setPrefs((p) => ({ ...p, [item.key]: v }))}
                      aria-label={item.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-5" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {Object.values(prefs).filter(Boolean).length} of {Object.keys(prefs).length} alerts enabled.
          </p>
          <SaveButton saving={saving} onClick={handleSave} />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// SECURITY
// ============================================================

const QR_CELLS = Array.from({ length: 64 }, (_, i) => (i * 11 + Math.floor(i / 8) * 5) % 4 !== 0);

function MockQr() {
  return (
    <div className="rounded-lg border bg-card p-3" aria-label="Mock QR code placeholder">
      <div className="grid w-28 grid-cols-8 gap-0.5">
        {QR_CELLS.map((filled, i) => (
          <span
            key={i}
            className={cn("aspect-square rounded-[1px]", filled ? "bg-slate-900" : "bg-transparent")}
          />
        ))}
      </div>
    </div>
  );
}

function SecurityPanel() {
  const { toast } = useToast();
  const security = useAppStore((s) => s.security);
  const updateSecurity = useAppStore((s) => s.updateSecurity);
  const [draft, setDraft] = useState<SecuritySettings>(security);
  const [saving, setSaving] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [ipRanges, setIpRanges] = useState("203.0.113.0/24\n198.51.100.0/24");

  const handleVerify = () => {
    if (!/^\d{6}$/.test(otp)) {
      toast({
        title: "Invalid code",
        description: "Enter the 6-digit code from your authenticator app.",
        variant: "destructive",
      });
      return;
    }
    setVerified(true);
    toast({
      title: "Two-factor verified",
      description: "Authenticator app linked successfully (demo).",
    });
  };

  const handleSave = () => {
    const minLen = Number(draft.passwordMinLength);
    if (!Number.isFinite(minLen) || minLen < 6 || minLen > 64) {
      toast({
        title: "Invalid password length",
        description: "Minimum password length must be between 6 and 64.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateSecurity({ ...draft, passwordMinLength: minLen });
      setSaving(false);
      toast({
        title: "Security settings saved",
        description: `Session timeout: ${draft.sessionTimeout} · Min password length: ${minLen}`,
      });
    }, 500);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Security</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Session policy, password rules, and multi-factor authentication.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="sec-timeout">Session Timeout</Label>
            <Select value={draft.sessionTimeout} onValueChange={(v) => setDraft((d) => ({ ...d, sessionTimeout: v }))}>
              <SelectTrigger id="sec-timeout" className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30 minutes">30 minutes</SelectItem>
                <SelectItem value="60 minutes">60 minutes</SelectItem>
                <SelectItem value="120 minutes">120 minutes</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-1 text-xs text-muted-foreground">Idle time before admins must sign in again.</p>
          </div>
          <div>
            <Label htmlFor="sec-minlen">Minimum Password Length</Label>
            <Input
              id="sec-minlen"
              type="number"
              min={6}
              max={64}
              className="mt-1.5"
              value={draft.passwordMinLength}
              onChange={(e) =>
                setDraft((d) => ({ ...d, passwordMinLength: parseInt(e.target.value || "0", 10) || 0 }))
              }
            />
            <p className="mt-1 text-xs text-muted-foreground">Between 6 and 64 characters.</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium">Require symbols in passwords</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Passwords must include at least one special character.</p>
            </div>
            <Switch
              checked={draft.requireSymbols}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, requireSymbols: v }))}
              aria-label="Require symbols in passwords"
            />
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Require an authenticator code at sign-in.</p>
              </div>
              <Switch
                checked={draft.twoFactorEnabled}
                onCheckedChange={(v) => {
                  setDraft((d) => ({ ...d, twoFactorEnabled: v }));
                  if (!v) {
                    setVerified(false);
                    setOtp("");
                  }
                }}
                aria-label="Two-factor authentication"
              />
            </div>
            {draft.twoFactorEnabled && (
              <div className="mt-4 rounded-lg bg-muted/50 p-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <MockQr />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Scan with your authenticator app</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Then enter the 6-digit code to confirm enrollment. (Demo — QR is a placeholder.)
                    </p>
                    <div className="mt-3 flex max-w-[240px] items-center gap-2">
                      <Input
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        aria-label="Six digit verification code"
                        className="text-center font-mono tracking-[0.4em]"
                      />
                      <Button variant="outline" onClick={handleVerify} disabled={verified} className="shrink-0">
                        {verified && <Check className="h-4 w-4" />}
                        {verified ? "Verified" : "Verify"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">IP allowlist</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Restrict admin sign-in to trusted networks.</p>
              </div>
              <Switch
                checked={draft.ipAllowlist}
                onCheckedChange={(v) => setDraft((d) => ({ ...d, ipAllowlist: v }))}
                aria-label="IP allowlist"
              />
            </div>
            {draft.ipAllowlist && (
              <div className="mt-4">
                <Label htmlFor="sec-ips" className="sr-only">Allowed IP ranges</Label>
                <Textarea
                  id="sec-ips"
                  rows={3}
                  value={ipRanges}
                  onChange={(e) => setIpRanges(e.target.value)}
                  placeholder={"203.0.113.0/24\n198.51.100.0/24"}
                  className="font-mono text-xs"
                />
                <p className="mt-1 text-xs text-muted-foreground">One CIDR range per line. (Demo — stored locally.)</p>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-5" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Two-factor is {draft.twoFactorEnabled ? (verified ? "enabled and verified" : "enabled — verification pending") : "disabled"}.
          </p>
          <SaveButton saving={saving} onClick={handleSave} />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// DANGER ZONE
// ============================================================

function DangerPanel() {
  const router = useRouter();
  const { toast } = useToast();
  const resetDemoData = useAppStore((s) => s.resetDemoData);
  const logout = useAppStore((s) => s.logout);
  const confirm = useConfirmDialog();
  // Dialog renders inside this panel; the panel stays mounted while open.

  const handleReset = () => {
    confirm.confirm({
      title: "Reset demo data?",
      description:
        "This restores the original catalog, users, inquiries, notifications, and settings. Every change you have made will be lost.",
      confirmLabel: "Reset everything",
      destructive: true,
      onConfirm: () => {
        resetDemoData();
        toast({
          title: "Demo data reset",
          description: "Original catalog, users, and inquiries have been restored.",
        });
      },
    });
  };

  const handleSignOut = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <Card className="border-red-200 dark:border-red-500/30">
      <CardContent className="p-5">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" /> Danger Zone
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Irreversible actions. Proceed with caution.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 rounded-lg border border-red-600/30 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-red-500/10">
            <div>
              <p className="text-sm font-medium text-red-900">Reset demo data</p>
              <p className="mt-0.5 text-xs text-red-700/80">
                Restores the original catalog, users, and inquiries. All local changes are discarded.
              </p>
            </div>
            <Button variant="destructive" onClick={handleReset} className="shrink-0">
              <RotateCcw className="h-4 w-4" /> Reset demo data
            </Button>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Sign out of this device</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Ends your admin session. You can sign back in at any time.
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="shrink-0">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>

        <ConfirmDialog state={confirm.state} onClose={confirm.close} />
      </CardContent>
    </Card>
  );
}

// ============================================================
// PAGE
// ============================================================

function SettingsHub() {
  const [section, setSection] = useState<SectionId>("general");

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Platform configuration across identity, branding, marketplace behavior, and security."
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <SectionNav section={section} onSelect={setSection} />
        <div className="min-w-0">
          {section === "general" && <GeneralPanel />}
          {section === "branding" && <BrandingPanel />}
          {section === "navigation" && <NavigationPanel />}
          {section === "marketplace" && <MarketplacePanel />}
          {section === "notifications" && <NotificationsPanel />}
          {section === "security" && <SecurityPanel />}
          {section === "danger" && <DangerPanel />}
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return <SettingsHub />;
}
