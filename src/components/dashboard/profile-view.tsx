"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Building2, Globe2, Loader2, Mail, Package, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/dashboard/shared";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types";

export interface ProfileViewProps {
  user: User;
  stats: { orders: number; threads: number; wishlist: number };
}

/**
 * Buyer profile view — identity card, editable details form, and account
 * stats. The server fetches the user record (via `getUserById`) and the
 * counts (`listBuyerOrders`, `listBuyerThreads`, wishlist length) once
 * per render; saving the form PATCHes `/api/profile` and calls
 * `router.refresh()` so the server query re-runs and the header / sidebar
 * reflect the new name.
 */
export function ProfileView({ user, stats }: ProfileViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.company);
  const [phone, setPhone] = useState(user.phone);
  const [country, setCountry] = useState(user.country);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials =
    user.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Your name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          phone: phone.trim(),
          country: country.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok?: true; error?: string }
        | { ok?: false; error?: string };
      if (res.ok && (data as { ok?: boolean }).ok !== false) {
        toast({
          title: "Profile updated",
          description: "Your changes are live across the marketplace.",
        });
        router.refresh();
        return;
      }
      setError(data.error ?? "Could not save your changes.");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    { label: "Orders placed", value: stats.orders },
    { label: "Saved services", value: stats.wishlist },
    { label: "Conversations", value: stats.threads },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>
        <p className="text-sm text-slate-400">
          Manage how you appear across the STIOOS marketplace.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Identity card */}
        <section className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-brand-ink"
              aria-hidden="true"
            >
              {initials}
            </span>
            <h2 className="mt-3 text-lg font-bold tracking-tight text-foreground">{user.name}</h2>
            <Badge variant="outline" className="mt-1.5 capitalize">
              {user.role}
            </Badge>
          </div>

          <Separator className="my-5" />

          <dl className="space-y-3 text-sm">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Email</dt>
              <dd className="min-w-0 truncate text-foreground">{user.email}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Company</dt>
              <dd className="min-w-0 truncate text-foreground">{user.company || "—"}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <dt className="sr-only">Country</dt>
              <dd className="min-w-0 truncate text-foreground">{user.country || "—"}</dd>
            </div>
          </dl>

          <Separator className="my-5" />

          <p className="text-xs text-muted-foreground">
            Member since {format(new Date(user.createdAt), "MMMM yyyy")}
          </p>

          <Separator className="my-5" />

          <div className="grid grid-cols-3 gap-2 text-center">
            {statCards.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-muted/60 px-2 py-3">
                <p className="text-lg font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase leading-tight tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Editable form */}
        <SectionCard
          title="Account details"
          description="Update your information — changes save to your marketplace account."
          className="h-fit lg:col-span-2"
        >
          <form onSubmit={handleSave} className="space-y-4" noValidate>
            {error && (
              <p
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-company">Company</Label>
                <Input
                  id="profile-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Your company or trading name"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="pl-9"
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-country">Country</Label>
                <Input
                  id="profile-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t pt-4">
              <p className="mr-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                <Package className="h-3.5 w-3.5" aria-hidden="true" />
                Changes apply instantly across your workspace.
              </p>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}
