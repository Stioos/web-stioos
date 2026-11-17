"use client";

import { useState } from "react";
import { Globe, Info, Loader2, Palette } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Logo, LogoMark } from "@/components/shared/logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const COLOR_TOKENS: { name: string; hex: string; usage: string }[] = [
  { name: "Primary Blue", hex: "#1e64e8", usage: "Primary actions, links, active states" },
  { name: "Amber Accent", hex: "#f59e0b", usage: "Accents, eyebrows, notification badges" },
  { name: "Brand Ink", hex: "#05070d", usage: "Dark surfaces: sidebar, footer, hero" },
  { name: "Panel Navy", hex: "#0a1224", usage: "Elevated dark panels and cards" },
  { name: "Logo Silver", hex: "#c9d3e0", usage: "Silver lettering inside the logo asset" },
  { name: "Surface White", hex: "#ffffff", usage: "Admin background and cards" },
];

function BrandingEditor() {
  const { toast } = useToast();
  const brand = useAppStore((s) => s.brand);
  const updateBrand = useAppStore((s) => s.updateBrand);

  const [siteName, setSiteName] = useState(brand.siteName);
  const [tagline, setTagline] = useState(brand.tagline);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!siteName.trim()) {
      toast({
        title: "Site name required",
        description: "Enter a site name before saving branding.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateBrand({ siteName: siteName.trim(), tagline: tagline.trim() });
      setSaving(false);
      toast({
        title: "Branding saved",
        description: "Site name and tagline updated across the platform.",
      });
    }, 500);
  };

  return (
    <div>
      <PageHeader
        title="Branding"
        description="Official brand assets, site identity, and the color token system."
        actions={
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving…" : "Save branding"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Logo panel */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">Logo Asset</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-brand-ink p-5">
                <p className="eyebrow mb-4 text-slate-500">Full Logo — Dark Surface</p>
                <div className="flex items-center justify-center py-8">
                  <Logo href={null} className="h-10 w-auto" />
                </div>
                <p className="text-center text-xs text-slate-400">
                  Official wide logo. The asset ships on black — dark surfaces only.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-5">
                <p className="eyebrow mb-4 text-slate-500">Square Mark — Light Surface</p>
                <div className="flex items-center justify-center py-8">
                  <LogoMark href={null} className="h-20 w-20" />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Used for the favicon, sidebar, and compact contexts.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                The logo is the official uploaded asset and is identical across every surface.
                Replacing it requires a new asset upload by the platform team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Favicon + site identity preview */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <h2 className="text-base font-semibold">Favicon</h2>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded border bg-brand-ink">
                  <LogoMark href={null} className="h-7 w-7" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">stioos-mark-v4.png</p>
                  <p className="text-xs text-muted-foreground">Browser tab icon & app tile</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg border bg-muted/50 px-3 py-2.5">
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Tab preview: STIOOS GLOBAL — Admin</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="text-base font-semibold">Site Identity</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Shown in the footer, metadata, and admin chrome.</p>
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="brand-siteName">Site Name</Label>
                  <Input
                    id="brand-siteName"
                    className="mt-1.5"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="brand-tagline">Tagline</Label>
                  <Input
                    id="brand-tagline"
                    className="mt-1.5"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                  />
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Saving…" : "Save branding"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Color tokens */}
      <Card className="mt-6">
        <CardContent className="p-5">
          <h2 className="text-base font-semibold">Color Tokens</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            The platform palette. Tokens are defined in CSS and should not be overridden ad hoc.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLOR_TOKENS.map((t) => (
              <div key={t.hex} className="flex items-center gap-3 rounded-lg border p-3">
                <span
                  className="h-12 w-12 shrink-0 rounded-md border border-black/10"
                  style={{ backgroundColor: t.hex }}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{t.hex}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminBrandingPage() {
  return <BrandingEditor />;
}
