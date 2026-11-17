"use client";

import { useState } from "react";
import {
  CheckCheck,
  Globe2,
  Info,
  Laptop,
  Loader2,
  Mail,
  MonitorSmartphone,
  Smartphone,
  Trash2,
  UserX,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "@/components/shared/confirm-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore, useCurrentAdmin } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { relTime } from "@/components/admin/inquiry-detail";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SessionDevice {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActiveLabel: string;
  current?: boolean;
  icon: LucideIcon;
}

const INITIAL_SESSIONS: SessionDevice[] = [
  {
    id: "sess-current",
    device: "MacBook Pro",
    browser: "Chrome 141 · macOS",
    location: "This device",
    lastActiveLabel: "now",
    current: true,
    icon: Laptop,
  },
  {
    id: "sess-iphone",
    device: "iPhone 15 Pro",
    browser: "Safari · iOS 18",
    location: "Dubai, United Arab Emirates",
    lastActiveLabel: "2 hours ago",
    icon: Smartphone,
  },
  {
    id: "sess-windows",
    device: "Windows Workstation",
    browser: "Firefox 132 · Windows 11",
    location: "Berlin, Germany",
    lastActiveLabel: "3 days ago",
    icon: MonitorSmartphone,
  },
];

const ACCOUNT_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "pt", label: "Português" },
];

function AccountSettingsContent() {
  const { toast } = useToast();
  const admin = useCurrentAdmin();
  const updateAdmin = useAppStore((s) => s.updateAdmin);
  const confirm = useConfirmDialog();

  // ----- email (initialized from the current admin) -----
  const [email, setEmail] = useState(admin?.email ?? "");
  const [savingEmail, setSavingEmail] = useState(false);

  // ----- notification prefs (local) -----
  const [prefs, setPrefs] = useState({
    emailNewInquiries: true,
    emailWeeklyDigest: true,
    emailProductUpdates: false,
    pushMentions: true,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  // ----- language -----
  const [language, setLanguage] = useState("en");
  const [savingLanguage, setSavingLanguage] = useState(false);

  // ----- sessions -----
  const [sessions, setSessions] = useState<SessionDevice[]>(INITIAL_SESSIONS);

  if (!admin) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-lg" />
          <Skeleton className="h-56 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  const handleEmailSave = () => {
    if (!EMAIL_RE.test(email)) {
      toast({
        title: "Invalid email",
        description: "Enter a valid email address before saving.",
        variant: "destructive",
      });
      return;
    }
    setSavingEmail(true);
    setTimeout(() => {
      updateAdmin(admin.id, { email: email.trim() });
      setSavingEmail(false);
      toast({
        title: "Account email updated",
        description: "Sign-in and alert emails now go to the new address.",
      });
    }, 500);
  };

  const handlePrefsSave = () => {
    setSavingPrefs(true);
    setTimeout(() => {
      setSavingPrefs(false);
      toast({
        title: "Notification preferences saved",
        description: `${Object.values(prefs).filter(Boolean).length} alert channels enabled.`,
      });
    }, 500);
  };

  const handleLanguageSave = () => {
    setSavingLanguage(true);
    setTimeout(() => {
      setSavingLanguage(false);
      toast({
        title: "Language preference saved (demo)",
        description: `Interface language set to ${ACCOUNT_LANGUAGES.find((l) => l.value === language)?.label ?? "English"}.`,
      });
    }, 500);
  };

  const openRevoke = (session: SessionDevice) => {
    confirm.confirm({
      title: "Revoke session?",
      description: `Signs out ${session.browser} on ${session.device} (${session.location}). You can sign back in from that device.`,
      confirmLabel: "Revoke session",
      destructive: true,
      onConfirm: () => {
        setSessions((prev) => prev.filter((s) => s.id !== session.id));
        toast({
          title: "Session revoked",
          description: `${session.browser} on ${session.device} has been signed out.`,
        });
      },
    });
  };

  const openDeleteAccount = () => {
    confirm.confirm({
      title: "Delete this account?",
      description:
        "Account deletion removes your admin access, saved preferences, and activity attribution. This request requires owner approval before it is executed.",
      confirmLabel: "Request deletion",
      destructive: true,
      onConfirm: () => {
        toast({
          title: "Account deletion requires owner approval (demo)",
          description: "A deletion request has been recorded and routed to the platform owner.",
          variant: "destructive",
        });
      },
    });
  };

  const prefRows: { key: keyof typeof prefs; label: string; hint: string }[] = [
    { key: "emailNewInquiries", label: "Email me about new inquiries", hint: "Instant alerts for every new inquiry." },
    { key: "emailWeeklyDigest", label: "Weekly digest email", hint: "Monday summary of platform activity." },
    { key: "emailProductUpdates", label: "Product updates", hint: "Occasional notes on new platform features." },
    { key: "pushMentions", label: "Push notifications for mentions", hint: "When another admin mentions you in updates." },
  ];

  return (
    <div>
      <PageHeader
        title="Account Settings"
        description="Sign-in identity, alerts, appearance, language, and active sessions."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Account Email</h2>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Used for sign-in and all platform alerts.
            </p>
            <div className="mt-4">
              <Label htmlFor="acc-email">Email Address</Label>
              <Input
                id="acc-email"
                type="email"
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleEmailSave} disabled={savingEmail}>
                {savingEmail && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingEmail ? "Saving…" : "Update email"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme note */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Appearance</h2>
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-blue-500/30 bg-blue-500/5 px-4 py-3 text-sm text-blue-900 dark:bg-blue-500/10 dark:text-blue-200">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                The admin platform uses a light interface with the dark brand sidebar. Public pages
                follow your system light/dark preference automatically. Theme switching ships with
                the theming milestone — no action is needed today.
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin</p>
                <p className="mt-1 text-sm font-medium">Light chrome · dark sidebar</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Public site</p>
                <p className="mt-1 text-sm font-medium">Dark brand surfaces</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification prefs */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <CheckCheck className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Notification Preferences</h2>
            </div>
            <div className="mt-4 space-y-3">
              {prefRows.map((row) => (
                <div key={row.key} className="flex items-center justify-between gap-4 rounded-lg border p-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{row.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{row.hint}</p>
                  </div>
                  <Switch
                    checked={prefs[row.key]}
                    onCheckedChange={(v) => setPrefs((p) => ({ ...p, [row.key]: v }))}
                    aria-label={row.label}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handlePrefsSave} disabled={savingPrefs}>
                {savingPrefs && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingPrefs ? "Saving…" : "Save preferences"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Language</h2>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Interface language for the admin platform.
            </p>
            <div className="mt-4 max-w-xs">
              <Label htmlFor="acc-language" className="sr-only">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="acc-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_LANGUAGES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleLanguageSave} disabled={savingLanguage}>
                {savingLanguage && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingLanguage ? "Saving…" : "Save language"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected sessions */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Connected Sessions</h2>
              <p className="text-sm text-muted-foreground">
                Devices currently signed in to your account.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              {sessions.length} active
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/60">
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Device</th>
                  <th className="hidden px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:table-cell">Location</th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Active</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sessions.map((s) => {
                  const DeviceIcon = s.icon;
                  return (
                    <tr key={s.id} className={cn(s.current && "bg-primary/[0.04]")}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <DeviceIcon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 truncate font-medium text-foreground">
                              {s.device}
                              {s.current && (
                                <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:text-blue-300 dark:ring-blue-500/30">
                                  Current
                                </span>
                              )}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">{s.browser}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{s.location}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground" title={s.current ? "Active session" : undefined}>
                        {s.current ? "Active now" : s.lastActiveLabel}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {s.current ? (
                          <span className="text-xs text-muted-foreground">This session</span>
                        ) : (
                          <Button variant="outline" size="sm" className="h-8 text-red-600 hover:bg-destructive/10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => openRevoke(s)}>
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {sessions.length === 1 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      All other sessions have been revoked. Only this device remains signed in.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Last activity is relative to now ({relTime(new Date().toISOString())}).
          </p>
        </CardContent>
      </Card>

      {/* Danger card */}
      <Card className="mt-6 border-red-200 dark:border-red-500/30">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                <UserX className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-red-700">Delete Account</h2>
                <p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
                  Permanently removes your admin access and personal data. Deletion requests are
                  reviewed by the platform owner before execution.
                </p>
              </div>
            </div>
            <Button variant="destructive" onClick={openDeleteAccount} className="shrink-0">
              <Trash2 className="h-4 w-4" /> Request deletion
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog state={confirm.state} onClose={confirm.close} />
    </div>
  );
}

export default function AdminAccountPage() {
  return <AccountSettingsContent />;
}
