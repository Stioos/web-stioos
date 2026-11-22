"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Store,
  Package,
  ClipboardList,
  ArrowLeftRight,
  Briefcase,
  CreditCard,
  Users,
  Settings,
  Search,
  X,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/shared/icon";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PublicFooter } from "@/components/layout/public-footer";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { getAllPublishedServices } from "@/lib/service-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Service } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const BUYER_NAV: NavItem[] = [
  { href: "/dashboard/buyer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/buyer/orders", label: "My Orders", icon: Package },
  { href: "/dashboard/buyer/requests", label: "My Requests", icon: ClipboardList },
  { href: "/dashboard/buyer/transactions", label: "My Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/buyer/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/buyer/talent-solutions", label: "Talent Solutions", icon: Users },
  { href: "/dashboard/buyer/hire-talent", label: "Hire a Talent", icon: Briefcase },
  { href: "/dashboard/buyer/account-settings", label: "Account Settings", icon: Settings },
];

function initialsOf(name: string): string {
  return (
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}

interface SearchItem {
  key: string;
  title: string;
  sub: string;
  href: string;
  icon: string;
}

export function DashboardShell({
  role,
  title,
  children,
}: {
  role: "buyer";
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useCurrentUser();
  const marketLogout = useAppStore((s) => s.marketLogout);
  const quickMarketLogin = useAppStore((s) => s.quickMarketLogin);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchIdx, setSearchIdx] = useState(-1);

  const allServices = useMemo(() => getAllPublishedServices(), []);
  const categories = useAppStore((s) => s.categories);

  useEffect(() => {
    if (!user) {
      quickMarketLogin("usr-001");
    }
  }, [user, quickMarketLogin]);

  const initials = user ? initialsOf(user.name) : "?";

  const signOut = () => {
    marketLogout();
    router.push("/");
  };

  // Search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    const svc: SearchItem[] = allServices
      .filter((s) => {
        const hay = [s.name, s.shortDescription, s.tags.join(" ")].join(" ").toLowerCase();
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, 5)
      .map((s) => ({
        key: `svc-${s.id}`,
        title: s.name,
        sub: "Service",
        href: `/marketplace/${s.slug}`,
        icon: s.icon,
      }));
    const cats: SearchItem[] = categories
      .filter((c) => terms.every((t) => c.name.toLowerCase().includes(t)))
      .slice(0, 3)
      .map((c) => ({
        key: `cat-${c.id}`,
        title: c.name,
        sub: "Category",
        href: `/category/${c.slug}`,
        icon: c.icon,
      }));
    return [...svc, ...cats];
  }, [searchQuery, allServices, categories]);

  const submitSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/dashboard/buyer/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-brand-ink text-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-ink"
      >
        Skip to main content
      </a>

      {/* Main header — logo + search + account */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-ink/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Mobile navigation */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open navigation menu"
                className="h-10 w-10 border-white/15 bg-transparent text-slate-200 hover:bg-white/10 hover:text-white lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 border-white/10 bg-brand-ink p-0 text-white"
            >
              <SheetTitle asChild>
                <div className="border-b border-white/10 px-5 py-4">
                  <Logo className="h-7 w-auto" priority />
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    Buyer workspace
                  </p>
                </div>
              </SheetTitle>
              <div className="flex h-[calc(100%-5.5rem)] flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <nav aria-label="Buyer workspace navigation" className="flex flex-col gap-1">
                    {BUYER_NAV.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileNavOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/25"
                              : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                <div className="border-t border-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-brand-ink">
                      {initials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{user?.name ?? "Demo User"}</p>
                      <p className="truncate text-[11px] text-slate-400">{user?.email ?? "demo@stioos.com"}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { signOut(); setMobileNavOpen(false); }}
                      aria-label="Sign out"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-rose-300"
                    >
                      <LogOut className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Logo href="/" className="h-7 w-auto" priority />

          {/* Browse Categories dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 md:inline-flex">
                <Store className="h-4 w-4 text-amber-400" />
                Browse Categories
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Solution Divisions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.filter((c) => c.status === "active").map((c) => (
                <DropdownMenuItem key={c.id} asChild>
                  <Link href={`/category/${c.slug}`}>
                    <Icon name={c.icon} className="mr-2 h-4 w-4 text-amber-400" />
                    {c.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/marketplace" className="font-semibold text-amber-400">
                  View All Services
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search bar */}
          <div className="relative min-w-0 flex-1 lg:max-w-[480px]">
            <form
              onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
              className={cn(
                "relative flex h-10 items-center gap-2 rounded-full border pl-4 pr-1.5 transition-all",
                searchOpen
                  ? "border-amber-400/50 bg-white/[0.08] ring-2 ring-amber-400/20"
                  : "border-white/10 bg-white/[0.05] hover:border-white/20"
              )}
            >
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); setSearchIdx(-1); }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") { setSearchOpen(false); }
                  if (e.key === "ArrowDown") { e.preventDefault(); setSearchIdx((i) => Math.min(i + 1, searchResults.length - 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setSearchIdx((i) => Math.max(i - 1, -1)); }
                  if (e.key === "Enter" && searchIdx >= 0 && searchResults[searchIdx]) {
                    e.preventDefault();
                    router.push(searchResults[searchIdx].href);
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search services, solutions, industries…"
                aria-label="Search services"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="submit"
                aria-label="Search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-brand-ink hover:bg-amber-400"
              >
                <Search className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </form>

            {/* Search suggestions dropdown */}
            {searchOpen && searchQuery && (
              <div
                className="absolute inset-x-0 top-full z-50 mt-1 max-h-[360px] overflow-y-auto rounded-2xl border border-white/10 bg-brand-navy p-2 shadow-2xl shadow-black/60"
                onMouseDown={(e) => {
                  const el = e.target as Element;
                  if (!el.closest("a") && !el.closest("button")) setSearchOpen(false);
                }}
              >
                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-slate-300">No matches for &ldquo;{searchQuery}&rdquo;</p>
                    <p className="mt-1 text-xs text-slate-500">Press Enter for full search.</p>
                  </div>
                ) : (
                  <div className="p-1.5">
                    {searchResults.length > 0 && (
                      <>
                        <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Results ({searchResults.length})
                        </p>
                        {searchResults.map((item, i) => (
                          <Link
                            key={item.key}
                            href={item.href}
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                            onMouseEnter={() => setSearchIdx(i)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                              i === searchIdx ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
                            )}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.06] ring-1 ring-white/10">
                              <Icon name={item.icon} className="h-3.5 w-3.5 text-amber-400" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-slate-100">{item.title}</span>
                              <span className="block truncate text-[11px] text-slate-500">{item.sub}</span>
                            </span>
                          </Link>
                        ))}
                      </>
                    )}
                    <button
                      onClick={submitSearch}
                      className="mt-1 flex w-full items-center justify-between border-t border-white/[0.06] px-3 py-2.5 text-[13px] font-semibold text-amber-400 hover:bg-amber-400/[0.07]"
                    >
                      <span>See all results for &ldquo;{searchQuery}&rdquo;</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right cluster */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="ghost"
              className="hidden h-10 text-slate-300 hover:bg-white/[0.06] hover:text-white md:inline-flex"
            >
              <Link href="/marketplace">
                <Store className="h-4 w-4" aria-hidden="true" />
                <span className="hidden lg:inline">Marketplace</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account menu"
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-2 transition-colors hover:bg-white/10"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-brand-ink">
                  {initials}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-medium text-slate-200 xl:block">
                  {user?.name?.split(" ")[0] ?? "Demo"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <p className="truncate text-sm font-semibold">{user?.name ?? "Demo User"}</p>
                  <p className="text-xs font-normal capitalize text-muted-foreground">
                    {user?.role ?? "buyer"} workspace
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard/buyer")}>
                  <LayoutDashboard className="h-4 w-4" /> Dashboard home
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/marketplace")}>
                  <Store className="h-4 w-4" /> Marketplace
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={signOut}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Secondary header strip — navigation pills */}
        <nav
          aria-label="Buyer workspace navigation"
          className="hidden h-[46px] items-center border-t border-white/[0.07] px-4 sm:px-6 lg:px-8 lg:flex"
        >
          <div className="no-scrollbar flex flex-1 items-center gap-1 xl:gap-1.5 overflow-x-auto">
            {BUYER_NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 transition-colors duration-200",
                    active
                      ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                      : "border-white/15 bg-white/[0.05] text-slate-200 hover:bg-white/[0.09]"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-semibold whitespace-nowrap leading-none xl:text-xs">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Body — full width, no sidebar */}
      <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <PublicFooter />
    </div>
  );
}
