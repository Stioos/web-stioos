"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ADMIN_NAV, visibleAdminNav } from "@/lib/nav";
import { Icon } from "@/components/shared/icon";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Bell, Menu, LogOut, UserCircle, Globe, ChevronLeft, X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { toast } from "@/hooks/use-toast";
import type { AdminDTO, RoleDTO } from "@/lib/auth-server";
import type { BrandSettings, AppNotification } from "@/types";

// ============================================================
// Types — the DTOs the server layout resolves for us (no store).
// ============================================================

export interface AdminShellProps {
  admin: AdminDTO;
  role?: RoleDTO;
  brand: BrandSettings;
  children: React.ReactNode;
}

// ============================================================
// SIDEBAR
// ============================================================

function SidebarNav({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname();
  const admin = useAdminFromContext();
  const role = useAdminRole();
  const isSuperAdmin = role?.slug === "super-admin";
  const groups = useMemo(
    () => visibleAdminNav(isSuperAdmin, role?.permissions ?? null),
    [isSuperAdmin, role]
  );

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        {groups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {group.label}
              </p>
            )}
            {collapsed && <div className="mx-auto mb-2 h-px w-8 bg-white/10" />}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors",
                        collapsed && "justify-center px-0",
                        active
                          ? "bg-blue-600/20 text-white ring-1 ring-inset ring-blue-500/30"
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                      )}
                    >
                      <Icon
                        name={item.icon}
                        className={cn("h-[17px] w-[17px] shrink-0", active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300")}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        {groups.length === 0 && (
          <p className="px-2.5 text-xs text-slate-500">
            No modules assigned to your role.
          </p>
        )}
      </nav>
      {!collapsed && (
        <div className="border-t border-white/8 p-3">
          <div className="rounded-lg bg-white/[0.04] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Signed in as</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{admin?.name ?? "—"}</p>
            <p className="truncate text-xs text-amber-400">{role?.name ?? "No role"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADMIN SEARCH — ⌘K palette. Reads services/requests/orders/users/inquiries
// via fetch when the palette opens (admin API).
// ============================================================

interface SearchItem { title: string; sub: string; href: string }
interface SearchBucket { group: string; items: SearchItem[] }

function AdminSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [buckets, setBuckets] = useState<SearchBucket[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Lazy-fetch the five entity lists the first time the palette opens.
  // Uses `.then()` callbacks (not async/await) so the setState calls land
  // in promise continuations, not synchronously inside the effect body —
  // that satisfies the react-hooks/set-state-in-effect rule.
  useEffect(() => {
    if (!open || loaded) return;
    let cancelled = false;
    const buildBuckets = (
      svc: { services?: { id: string; name: string; status: string }[] },
      req: { requests?: { id: string; title: string; buyerName: string }[] },
      ord: { orders?: { id: string; serviceName: string; buyerName: string }[] },
      usr: { users?: { id: string; name: string; company: string }[] },
      inq: { inquiries?: { id: string; name: string; serviceName?: string; type: string; status: string }[] }
    ): SearchBucket[] => [
      {
        group: "Services",
        items: (svc.services ?? []).slice(0, 30).map((s) => ({
          title: s.name, sub: s.status, href: `/admin/services?focus=${s.id}`,
        })),
      },
      {
        group: "Service Requests",
        items: (req.requests ?? []).slice(0, 20).map((r) => ({
          title: r.title, sub: r.buyerName, href: `/admin/service-requests?focus=${r.id}`,
        })),
      },
      {
        group: "Orders",
        items: (ord.orders ?? []).slice(0, 20).map((o) => ({
          title: o.serviceName, sub: o.buyerName, href: `/admin/orders?focus=${o.id}`,
        })),
      },
      {
        group: "Users",
        items: (usr.users ?? []).slice(0, 30).map((u) => ({
          title: u.name, sub: u.company, href: `/admin/users?focus=${u.id}`,
        })),
      },
      {
        group: "Inquiries",
        items: (inq.inquiries ?? []).slice(0, 20).map((i) => ({
          title: `${i.name} — ${i.serviceName ?? i.type}`, sub: i.status, href: `/admin/inquiries?focus=${i.id}`,
        })),
      },
    ];
    Promise.all([
      fetch("/api/services?limit=50", { credentials: "same-origin" }).then((r) => r.json()),
      fetch("/api/requests", { credentials: "same-origin" }).then((r) => r.json()),
      fetch("/api/orders", { credentials: "same-origin" }).then((r) => r.json()),
      fetch("/api/users", { credentials: "same-origin" }).then((r) => r.json()),
      fetch("/api/inquiries", { credentials: "same-origin" }).then((r) => r.json()),
    ])
      .then(([svc, req, ord, usr, inq]) => {
        if (cancelled) return;
        setBuckets(buildBuckets(svc, req, ord, usr, inq));
        setLoaded(true);
      })
      .catch(() => {
        /* network errors — palette just shows nothing */
      });
    return () => { cancelled = true; };
  }, [open, loaded]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return buckets;
    return buckets
      .map((b) => ({
        ...b,
        items: b.items.filter((i) => i.title.toLowerCase().includes(query)).slice(0, 4),
      }))
      .filter((b) => b.items.length > 0);
  }, [q, buckets]);

  const flat = results.flatMap((g) => g.items);
  const [active, setActive] = useState(0);

  // Keyboard navigation handler is bound only while the palette is open.
  // Without this guard, the handler stays bound while closed and EVERY
  // Enter keypress on any admin page (form submits, tab activation, …)
  // teleports the user to the first search result.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      if (e.key === "Enter" && flat[active]) { e.preventDefault(); router.push(flat[active].href); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flat, active, router, onClose, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[10vh] backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg overflow-hidden rounded-xl border bg-popover shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            placeholder="Search services, requests, orders, users, inquiries…"
            className="h-13 min-h-[52px] w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={onClose} aria-label="Close search"><X className="h-4 w-4 text-muted-foreground" /></button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              {loaded ? "No matches found." : "Loading index…"}
            </p>
          ) : (
            results.map((g) => (
              <div key={g.group}>
                <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.group}</p>
                {g.items.map((item) => {
                  const idx = flat.indexOf(item);
                  return (
                    <button
                      key={g.group + item.title + item.href}
                      onClick={() => { router.push(item.href); onClose(); }}
                      onMouseEnter={() => setActive(idx)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
                        idx === active ? "bg-primary/10" : "hover:bg-muted"
                      )}
                    >
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs capitalize text-muted-foreground">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NOTIFICATION BELL — fetched client-side from /api/notifications.
// ============================================================

function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);

  // Fetch via `.then()` so the setState calls land in promise continuations
  // rather than synchronously inside the effect body — that satisfies the
  // react-hooks/set-state-in-effect rule (same pattern as use-wishlist.ts).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/notifications", { credentials: "same-origin" })
      .then((r) => (r.ok ? (r.json() as Promise<{ notifications?: AppNotification[] }>) : null))
      .then((data) => {
        if (cancelled) return;
        setNotifications(data?.notifications ?? []);
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      });
    return () => { cancelled = true; };
  }, []);

  const reload = useCallback(() => {
    fetch("/api/notifications", { credentials: "same-origin" })
      .then((r) => (r.ok ? (r.json() as Promise<{ notifications?: AppNotification[] }>) : null))
      .then((data) => {
        setNotifications(data?.notifications ?? []);
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  // Re-fetch whenever the popover opens (covers the case where another
  // admin action created a notification while the bell was closed).
  useEffect(() => {
    if (!open) return;
    reload();
  }, [open, reload]);

  const unread = notifications.filter((n) => !n.read).length;

  const iconFor = (t: string) => {
    const map: Record<string, string> = {
      service_request: "Inbox",
      contact_inquiry: "MessageSquare",
      admin_created: "ShieldCheck",
      service_published: "Rocket",
      content_updated: "PenTool",
      system: "Settings",
    };
    return map[t] ?? "Bell";
  };

  const markAll = () => {
    fetch("/api/notifications/read-all", {
      method: "POST",
      credentials: "same-origin",
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        reload();
        toast({ title: "All notifications marked as read" });
      })
      .catch(() => {
        toast({ title: "Could not mark all as read", variant: "destructive" });
      });
  };

  const markRead = (id: string) => {
    fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
      credentials: "same-origin",
    })
      .then((r) => {
        if (!r.ok) return;
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      })
      .catch(() => {
        /* ignore */
      });
  };

  return (
    <Popover onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={`Notifications (${unread} unread)`}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-brand-ink">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 border-border/70 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button onClick={markAll} className="text-xs font-medium text-blue-600 hover:underline">
            Mark all as read
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.slice(0, 6).map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className="flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-0 hover:bg-muted/60"
            >
              <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md", n.read ? "bg-muted text-muted-foreground" : "bg-blue-600/10 text-blue-600")}>
                <Icon name={iconFor(n.type)} className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-sm", n.read ? "font-medium text-foreground/80" : "font-semibold text-foreground")}>
                  {n.title}
                </span>
                <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{n.message}</span>
              </span>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
            </button>
          ))}
          {notifications.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
          )}
        </div>
        <div className="border-t px-4 py-2 text-right">
          <Link
            href="/admin/notifications"
            className="text-xs font-medium text-blue-600 hover:underline"
            onClick={() => setOpen(false)}
          >
            View all
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================
// Admin-shell context — exposes the admin + role to nested client
// children (SidebarNav) without prop-drilling through every level.
// ============================================================

const AdminContext = createContext<{
  admin: AdminDTO;
  role?: RoleDTO;
} | null>(null);

function useAdminRole(): RoleDTO | undefined {
  const ctx = useContext(AdminContext);
  return ctx?.role;
}

function useAdminFromContext(): AdminDTO | undefined {
  const ctx = useContext(AdminContext);
  return ctx?.admin;
}

// ============================================================
// SHELL
// ============================================================

export function AdminShell({ admin, role, brand, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Ctrl/Cmd + K anywhere in admin
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      /* ignore — we still redirect */
    }
    setSigningOut(false);
    router.push("/auth/login?next=/admin");
  };

  const initials = admin.name.split(" ").map((p) => p[0]).slice(0, 2).join("") ?? "?";

  return (
    <AdminContext.Provider value={{ admin, role }}>
      <div className="admin-fixed flex min-h-screen bg-muted/40">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/8 bg-brand-ink transition-all duration-200 lg:flex",
            collapsed ? "w-[68px]" : "w-64"
          )}
        >
          <div className={cn("flex h-16 items-center border-b border-white/8", collapsed ? "justify-center px-2" : "gap-3 px-4")}>
            <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
              <Image src="/stioos-mark.png" alt="STIOOS" width={40} height={40} className="h-9 w-9 rounded-md" priority />
              {!collapsed && (
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold tracking-wide text-white">STIOOS</span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">Admin Platform</span>
                </span>
              )}
            </Link>
          </div>
          <SidebarNav collapsed={collapsed} />
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-10 items-center justify-center gap-2 border-t border-white/8 text-xs font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Collapse"}
          </button>
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 border-white/10 bg-brand-ink p-0 [&>button]:text-white">
            <SheetTitle asChild>
              <div className="sr-only">Admin navigation</div>
            </SheetTitle>
            <div className="flex h-16 items-center gap-3 border-b border-white/8 px-4">
              <Image src="/stioos-mark.png" alt="STIOOS" width={40} height={40} className="h-9 w-9 rounded-md" />
              <span>
                <span className="block text-sm font-bold text-white">STIOOS</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">Admin Platform</span>
              </span>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main area */}
        <div className={cn("flex min-h-screen w-full flex-col transition-all duration-200", collapsed ? "lg:pl-[68px]" : "lg:pl-64")}>
          {/* Top header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/85 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open admin menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
                <span className="font-medium text-foreground">Admin Platform</span>
                <span>/</span>
                <span className="max-w-[240px] truncate">
                  {pathname.replace("/admin", "").replace(/^\//, "").replace(/-/g, " ") || "Dashboard"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <ThemeToggle />

              <button
                onClick={() => setSearchOpen(true)}
                className="hidden items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground md:inline-flex"
              >
                <Search className="h-4 w-4" />
                <span>Search admin…</span>
                <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-semibold">⌘K</kbd>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search admin"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              <NotificationBell />

              <Button asChild variant="ghost" size="sm" className="hidden text-muted-foreground hover:text-foreground lg:inline-flex">
                <Link href="/" target="_blank">
                  <Globe className="h-4 w-4" /> View Site
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 flex items-center gap-2.5 rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-muted" aria-label="Account menu">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-blue-800 text-xs font-bold text-white">
                      {initials}
                    </span>
                    <span className="hidden text-left sm:block">
                      <span className="block max-w-[140px] truncate text-sm font-semibold leading-tight">{admin.name}</span>
                      <span className="block text-[11px] leading-tight text-muted-foreground">{role?.name ?? "Administrator"}</span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold">{admin.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{admin.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/admin/profile"><UserCircle className="h-4 w-4" /> My Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/"><Globe className="h-4 w-4" /> View Public Site</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={signingOut}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> {signingOut ? "Signing out…" : "Sign out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 sm:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>

          <footer className="mt-auto border-t bg-background px-6 py-4">
            <p className="text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} {brand.siteName} — Admin Platform · Demo environment, data stored locally
            </p>
          </footer>
        </div>

        <AdminSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </AdminContext.Provider>
  );
}
