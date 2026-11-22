"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AccountSettingsPage() {
  return (
    <RequireRole role="buyer">
      <DashboardShell role="buyer" title="Account Settings">
        <AccountSettingsContent />
      </DashboardShell>
    </RequireRole>
  );
}

function AccountSettingsContent() {
  const user = useCurrentUser();
  const updateMarketProfile = useAppStore((s) => s.updateMarketProfile);
  const { toast } = useToast();

  const [name, setName] = useState(user?.name ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [country, setCountry] = useState(user?.country ?? "");

  const handleSave = () => {
    updateMarketProfile({ name, company, phone, country });
    toast({
      title: "Profile updated",
      description: "Your account settings have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your profile, company info, and preferences.</p>
      </div>

      {/* Profile section */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-bold text-white">Profile Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 bg-white/[0.05] border-white/10 text-white"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="mt-1.5 bg-white/[0.03] border-white/10 text-slate-400"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Company</Label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1.5 bg-white/[0.05] border-white/10 text-white"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 bg-white/[0.05] border-white/10 text-white"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Country</Label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-1.5 bg-white/[0.05] border-white/10 text-white"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={handleSave}
            className="h-10 bg-amber-500 px-6 text-sm font-bold text-brand-ink hover:bg-amber-400"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Security section */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-lg font-bold text-white">Security</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div>
              <p className="text-sm font-medium text-white">Password</p>
              <p className="text-xs text-slate-400">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" className="h-9 border-white/15 bg-transparent text-slate-200 hover:bg-white/10">
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div>
              <p className="text-sm font-medium text-white">Two-Factor Auth</p>
              <p className="text-xs text-slate-400">Not enabled</p>
            </div>
            <Button variant="outline" className="h-9 border-white/15 bg-transparent text-slate-200 hover:bg-white/10">
              Enable
            </Button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-6">
        <h2 className="text-lg font-bold text-rose-300">Danger Zone</h2>
        <p className="mt-1 text-sm text-slate-400">Permanently delete your account and all associated data.</p>
        <Button
          variant="outline"
          className="mt-3 h-9 border-rose-500/30 bg-transparent text-rose-300 hover:bg-rose-500/10"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}
