"use client";

import { useState } from "react";
import {
  BadgeCheck,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EntityStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore, useCurrentAdmin, useCurrentRole } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { initialsOf, relTime } from "@/components/admin/inquiry-detail";
import { format } from "date-fns";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SYMBOL_RE = /[!@#$%^&*(),.?":{}|<>[\]\\/~`_+\-=;']/;

function ProfilePageContent() {
  const { toast } = useToast();
  const admin = useCurrentAdmin();
  const role = useCurrentRole();
  const updateAdmin = useAppStore((s) => s.updateAdmin);
  const security = useAppStore((s) => s.security);

  // ----- profile form (initialized from the current admin; persists for the page session) -----
  const [name, setName] = useState(admin?.name ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [phone, setPhone] = useState(admin?.phone ?? "");
  const [title, setTitle] = useState(admin?.title ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);

  // ----- password form -----
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  if (!admin) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg lg:col-span-2" />
        </div>
        <Skeleton className="h-48 rounded-lg" />
      </div>
    );
  }

  const handleProfileSave = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required.";
    if (!EMAIL_RE.test(email)) errs.email = "Enter a valid email address.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast({
        title: "Check your entries",
        description: "Some fields need attention before saving.",
        variant: "destructive",
      });
      return;
    }
    setSavingProfile(true);
    setTimeout(() => {
      updateAdmin(admin.id, { name: name.trim(), email: email.trim(), phone: phone.trim(), title: title.trim() });
      setSavingProfile(false);
      toast({ title: "Profile updated", description: "Your profile details were saved successfully." });
    }, 500);
  };

  const passwordRules = [
    {
      label: `At least ${security.passwordMinLength} characters`,
      ok: newPw.length >= security.passwordMinLength,
    },
    {
      label: security.requireSymbols ? "Contains a symbol (required)" : "Contains a symbol (recommended)",
      ok: SYMBOL_RE.test(newPw),
      required: security.requireSymbols,
    },
    {
      label: "Passwords match",
      ok: newPw.length > 0 && newPw === confirmPw,
    },
  ];

  const handlePasswordSave = () => {
    if (!currentPw) {
      toast({ title: "Current password required", variant: "destructive" });
      return;
    }
    if (newPw.length < security.passwordMinLength || (security.requireSymbols && !SYMBOL_RE.test(newPw))) {
      toast({
        title: "Password does not meet the rules",
        description: "Review the highlighted requirements below the form.",
        variant: "destructive",
      });
      return;
    }
    if (newPw !== confirmPw) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setSavingPw(true);
    setTimeout(() => {
      setSavingPw(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast({ title: "Password updated (demo)", description: "Your password was changed successfully." });
    }, 500);
  };

  const permissionEntries = role ? Object.entries(role.permissions) : [];
  const viewModules = permissionEntries.filter(([, actions]) => actions.includes("view"));
  const totalActions = permissionEntries.reduce((sum, [, actions]) => sum + actions.length, 0);

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Your identity, contact details, and role within the platform."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary card */}
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 text-2xl font-bold text-white">
                {initialsOf(admin.name)}
              </span>
              <h2 className="mt-4 text-lg font-bold text-foreground">{admin.name}</h2>
              {admin.title && <p className="text-sm text-muted-foreground">{admin.title}</p>}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {role && <StatusBadge tone="blue" dot={false}>{role.name}</StatusBadge>}
                <EntityStatusBadge status={admin.status} />
              </div>
            </div>
            <div className="mt-5 space-y-2.5 border-t pt-4 text-sm">
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{admin.email}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{admin.phone || "—"}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  Active now · last seen {relTime(admin.lastActive)}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h2 className="text-base font-semibold">Profile Details</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Update how your account appears across the admin platform.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="pf-name">Full Name</Label>
                <Input id="pf-name" className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="pf-email">Email</Label>
                <Input id="pf-email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="pf-phone">Phone</Label>
                <Input id="pf-phone" className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pf-title">Title</Label>
                <Input id="pf-title" className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Platform Lead" />
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button onClick={handleProfileSave} disabled={savingProfile}>
                {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {savingProfile ? "Saving…" : "Save profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Password card */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Change Password</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="pw-current">Current Password</Label>
                <Input id="pw-current" type="password" className="mt-1.5" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pw-new">New Password</Label>
                <Input id="pw-new" type="password" className="mt-1.5" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="pw-confirm">Confirm New Password</Label>
                <Input id="pw-confirm" type="password" className="mt-1.5" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
              </div>
            </div>
            <ul className="mt-4 space-y-1.5">
              {passwordRules.map((r) => (
                <li key={r.label} className="flex items-center gap-2 text-xs">
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full ${
                      r.ok ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {r.ok && <BadgeCheck className="h-3 w-3" />}
                  </span>
                  <span className={r.ok ? "text-emerald-700" : "text-muted-foreground"}>
                    {r.label}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">Demo — passwords are not stored or validated server-side.</p>
              <Button onClick={handlePasswordSave} disabled={savingPw}>
                {savingPw && <Loader2 className="h-4 w-4 animate-spin" />}
                {savingPw ? "Updating…" : "Update password"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session card */}
        <Card>
          <CardContent className="p-5">
            <h2 className="text-base font-semibold">Session</h2>
            <div className="mt-4 rounded-lg border p-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-600" />
                </span>
                <p className="text-sm font-semibold text-emerald-700">Active now</p>
              </div>
              <div className="mt-3 border-t pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last sign-in</p>
                <p className="mt-1 text-sm font-medium">
                  {(() => {
                    try {
                      return format(new Date(admin.lastActive), "EEE, MMM d, yyyy 'at' h:mm a");
                    } catch {
                      return admin.lastActive;
                    }
                  })()}
                </p>
                <p className="text-xs text-muted-foreground">{relTime(admin.lastActive)}</p>
              </div>
              <p className="mt-3 rounded-md bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                Session timeout policy: {security.sessionTimeout} of inactivity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role & permissions summary */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Role & Permissions</h2>
            {role?.isSystem && (
              <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/20 dark:text-slate-300 dark:ring-slate-400/30">
                System Role
              </span>
            )}
          </div>
          {role ? (
            <>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</p>
                  <p className="mt-1 text-sm font-semibold">{role.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coverage</p>
                  <p className="mt-1 text-sm font-semibold">
                    {viewModules.length} of {permissionEntries.length} modules visible
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{totalActions} granted actions in total.</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {permissionEntries.map(([module, actions]) => (
                  <span
                    key={module}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                      actions.includes("view")
                        ? "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/30"
                        : "bg-slate-100 text-slate-500 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-400/30"
                    }`}
                    title={`${module}: ${actions.join(", ") || "no actions"}`}
                  >
                    {module.replace(/_/g, " ")}
                    <span className="rounded-full bg-background/70 px-1.5 text-[10px] font-bold">{actions.length}</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No role assigned to your account.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminProfilePage() {
  return <ProfilePageContent />;
}
