"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  Link2,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/shared/icon";
import { cn } from "@/lib/utils";
import { ADMIN_NAV, PUBLIC_NAV } from "@/lib/nav";
import { useAppStore } from "@/lib/store";

function NavigationManager() {
  const categories = useAppStore((s) => s.categories);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  const footerColumns = [
    { title: "Marketplace", detail: `Top ${Math.min(6, categories.length)} categories, dynamic from the catalog`, count: Math.min(6, categories.length) + 1 },
    { title: "Company", detail: "About Us · Industries · Insights · Resources · Contact · Solutions", count: 6 },
    { title: "Platform", detail: "Marketplace · All Services · Search · Admin Platform · Login", count: 5 },
  ];

  return (
    <div>
      <PageHeader
        title="Navigation & Footer"
        description="Structure of the public mega menu, admin sidebar, and site footer."
        breadcrumb={
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
            <Link href="/admin/settings">
              <ArrowLeft className="h-4 w-4" /> Back to Settings
            </Link>
          </Button>
        }
      />

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Read-only structure</AlertTitle>
        <AlertDescription className="text-sm">
          Editable navigation ships with the CMS integration — the structure below is shown
          read-only and is managed in code for type safety.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Public navigation tree */}
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Public Navigation</h2>
                <p className="text-sm text-muted-foreground">Mega menu across the public site</p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {PUBLIC_NAV.length} items
              </span>
            </div>

            <ul className="divide-y rounded-lg border" aria-label="Public navigation">
              {PUBLIC_NAV.map((item) => {
                const open = !!expanded[item.label];
                const childCount = item.children?.length ?? 0;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => childCount > 0 && toggle(item.label)}
                      aria-expanded={childCount > 0 ? open : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
                        childCount > 0 ? "hover:bg-muted/60" : "cursor-default"
                      )}
                      aria-label={`${item.label} — ${item.href}${childCount > 0 ? `, ${childCount} children` : ""}`}
                    >
                      {childCount > 0 ? (
                        open ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )
                      ) : (
                        <span className="h-4 w-4 shrink-0" aria-hidden="true" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {item.label}
                          {item.mega && (
                            <span className="ml-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/25 dark:text-amber-400 dark:ring-amber-500/30">
                              Mega
                            </span>
                          )}
                        </span>
                        <span className="block truncate font-mono text-xs text-muted-foreground">
                          {item.href}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {childCount > 0 ? `${childCount} children` : "leaf"}
                      </span>
                    </button>
                    {childCount > 0 && open && (
                      <ul className="border-t bg-muted/30 px-4 py-2">
                        {item.children!.map((child) => (
                          <li key={child.label + child.href} className="flex items-center gap-2 py-1.5 pl-6">
                            <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm text-foreground">{child.label}</span>
                              <span className="block truncate font-mono text-[11px] text-muted-foreground">
                                {child.href}
                              </span>
                            </span>
                            {child.description && (
                              <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground sm:block">
                                {child.description}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Admin navigation + footer */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Admin Navigation</h2>
                <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {ADMIN_NAV.length} groups
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {ADMIN_NAV.map((group) => (
                  <div key={group.label} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </p>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {group.items.length}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Icon name={item.icon} className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                            <span className="truncate">{item.label}</span>
                            <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="text-base font-semibold">Footer Columns</h2>
              <p className="text-sm text-muted-foreground">Dark footer rendered on every public page</p>
              <div className="mt-4 rounded-lg bg-brand-ink p-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-sm font-bold tracking-wide text-white">STIOOS</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
                      Intelligence
                    </p>
                    <p className="mt-2 hidden text-[11px] leading-relaxed text-slate-400 sm:block">
                      Brand column with contact details and social links.
                    </p>
                  </div>
                  {footerColumns.map((col) => (
                    <div key={col.title}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        {col.title}
                      </p>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">{col.detail}</p>
                      <p className="mt-1.5 text-[10px] font-semibold text-amber-400">{col.count} links</p>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                The Marketplace column pulls the first six categories from the catalog automatically —
                no manual updates needed when the catalog changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminNavigationPage() {
  return <NavigationManager />;
}
