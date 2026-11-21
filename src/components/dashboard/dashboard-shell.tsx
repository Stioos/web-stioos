"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  ChevronDown,
  ClipboardList,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Store,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PublicFooter } from "@/components/layout/public-footer";
import { useAppStore, useCurrentUser } from "@/lib/store";
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

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const BUYER_NAV: NavItem[] = [
  { href: "/dashboard/buyer", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/buyer/orders", label: "My Orders", icon: Package },
  { href: "/dashboard/buyer/talent-services", label: "Talent Services", icon: Users },
  { href: "/dashboard/buyer/requests", label: "My Requests", icon: ClipboardList },
  { href: "/dashboard/buyer/transactions", label: "My Transactions", icon: ArrowLeftRight },
  { href: "/dashboard/buyer/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/buyer/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/buyer/profile", label: "Profile", icon: UserCog },
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

/**
 * Shared marketplace dashboard chrome: sticky topbar, desktop sidebar,
 * mobile sheet navigation and the public footer. The footer sticks to the
 * bottom on short pages (min-h-screen flex-col wrapper + footer mt-auto).
 */
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

  const nav = BUYER_NAV;
  const workspaceLabel = "Buyer workspace";

  // Auto-login demo buyer if none is logged in — this ensures the
  // dashboard always opens without requiring manual login.
  useEffect(() => {
    if (!user) {
      quickMarketLogin("usr-001"); // Auto-login as Daniel Osei (demo buyer)
    }
  }, [user, quickMarketLogin]);

  // Removed the hydration guard and loading skeleton — the dashboard
  // renders immediately with seed data.

  const initials = user ? initialsOf(user.name) : "?";

  const signOut = () => {
    marketLogout();
    router.push("/");
  };

  const renderNavLinks = (onNavigate?: () => void) => (
    <nav aria-label={`${workspaceLabel} navigation`} className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40",
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
  );

  const renderUserCard = (onNavigate?: () => void) => (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-brand-ink"
        aria-hidden="true"
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{user?.name ?? "Demo User"}</p>
        <p className="truncate text-[11px] text-slate-400">{user?.email ?? "demo@stioos.com"}</p>
      </div>
      <button
        type="button"
        onClick={() => {
          signOut();
          onNavigate?.();
        }}
        aria-label="Sign out"
        title="Sign out"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-brand-ink text-white">
      {/* Skip link — visible on keyboard focus */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-ink"
      >
        Skip to main content
      </a>

      {/* Topbar */}
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
                    {workspaceLabel}
                  </p>
                </div>
              </SheetTitle>
              <div className="flex h-[calc(100%-5.5rem)] flex-col">
                <div className="flex-1 overflow-y-auto p-4">{renderNavLinks(() => setMobileNavOpen(false))}</div>
                <div className="border-t border-white/10 p-4">{renderUserCard(() => setMobileNavOpen(false))}</div>
              </div>
            </SheetContent>
          </Sheet>

          <Logo href="/" className="h-7 w-auto" priority />

          {/* Breadcrumb */}
          <div className="hidden min-w-0 items-center gap-2 text-sm sm:flex" aria-label="Breadcrumb">
            <span className="text-slate-500" aria-hidden="true">/</span>
            <span className="whitespace-nowrap text-slate-400">{workspaceLabel}</span>
            <span className="text-slate-500" aria-hidden="true">/</span>
            <span className="truncate font-semibold text-white">{title}</span>
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
                Marketplace
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Account menu"
                className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-2 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-brand-ink"
                  aria-hidden="true"
                >
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
                <DropdownMenuItem onClick={() => router.push(nav[0].href)}>
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
      </header>

      {/* Body: sidebar + content */}
      <div className="flex w-full flex-1 items-stretch">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-white/10 bg-brand-ink lg:flex">
          <div className="flex-1 overflow-y-auto p-4">{renderNavLinks()}</div>
          <div className="border-t border-white/10 p-4">{renderUserCard()}</div>
        </aside>

        <main id="main" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <PublicFooter />
    </div>
  );
}
