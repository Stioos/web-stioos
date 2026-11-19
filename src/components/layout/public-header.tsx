"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Icon } from "@/components/shared/icon";
import { ThemeSegmented, ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TalentMegaMenu } from "@/components/layout/talent-mega-menu";
import { TalentStripMenu } from "@/components/layout/talent-strip-menu";
import { TalentVerticalFlyout } from "@/components/layout/talent-vertical-flyout";
import { TalentAllServicesFlyout } from "@/components/layout/talent-all-services-flyout";
import { useAppStore, useCurrentUser } from "@/lib/store";
import { useLoginDrawer, LoginDrawer } from "@/components/auth/login-drawer";
import { deliveryLabel } from "@/lib/marketplace-utils";
import { subIconFor } from "@/lib/sub-icons";
import { TALENT_STRIP_OPTIONS } from "@/data/talent-solutions";
import {
  TALENT_STRIP_GROUPS,
  CANDIDATE_STRIP_GROUPS,
  EMPLOYER_STRIP_GROUPS,
  getTalentStripGroup,
} from "@/data/talent-strip-groups";
import { TALENT_INFO_PAGES } from "@/data/talent-info-pages";
import { getTalentSubSeeds } from "@/data/pages/talent-sub-pages";
import { SOLUTION_LIST } from "@/data/pages/solution-pages";
import {
  SOLUTIONS,
  DIGITAL_TECH_AI_ID,
  DIGITAL_TECH_AI_NAME,
} from "@/data/solutions";
import { SolutionCard } from "@/components/shared/solution-card";
import type { Category, Service, Subcategory } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight, ChevronDown, LayoutDashboard, LayoutGrid, Layers, LogIn, LogOut, Menu, Search, ShoppingBag, Sparkles, Users, X, UserRound,
} from "lucide-react";

// ============================================================
// MAIN-HEADER MEGA MENU — all seven marketplace divisions.
// Talent Solutions ALSO has its own main-header trigger with a
// dedicated mega panel, so it stays reachable from the top bar.
// ============================================================

const MEGA_SLUGS = [
  "ai-agents",
  "technology-programming",
  "cloud-devops-mlops",
  "digital-sales-marketing",
  "business-enterprise-services",
  "multimedia-ai-graphics",
  "talent-solutions",
] as const;

// ============================================================
// SECONDARY HEADER — exactly six fixed division pills that must
// always fit on screen (no overflow) at every desktop width.
// Talent Solutions intentionally lives in the MAIN header only
// (its own trigger + mega panel), keeping the strip uncluttered.
// ============================================================

const STRIP_SLUGS = [
  "ai-agents",
  "technology-programming",
  "cloud-devops-mlops",
  "digital-sales-marketing",
  "business-enterprise-services",
  "multimedia-ai-graphics",
] as const;

// ============================================================
// DIVISION ACCENTS — colorful icon identity per strip division
// ============================================================

type DivisionAccent = {
  tile: string; // tinted square behind the pill icon
  icon: string; // icon color
  dot: string; // footer status dot
  link: string; // footer "View all services" link color
};

const DIVISION_ACCENTS: Record<string, DivisionAccent> = {
  "cat-ai-agents": {
    tile: "bg-violet-400/10 ring-violet-400/25",
    icon: "text-violet-300",
    dot: "bg-violet-400",
    link: "text-violet-300 hover:text-violet-200",
  },
  "cat-tech-programming": {
    tile: "bg-sky-400/10 ring-sky-400/25",
    icon: "text-sky-300",
    dot: "bg-sky-400",
    link: "text-sky-300 hover:text-sky-200",
  },
  "cat-cloud-devops-mlops": {
    tile: "bg-teal-400/10 ring-teal-400/25",
    icon: "text-teal-300",
    dot: "bg-teal-400",
    link: "text-teal-300 hover:text-teal-200",
  },
  "cat-digital-sales-marketing": {
    tile: "bg-rose-400/10 ring-rose-400/25",
    icon: "text-rose-300",
    dot: "bg-rose-400",
    link: "text-rose-300 hover:text-rose-200",
  },
  "cat-business-enterprise": {
    tile: "bg-emerald-400/10 ring-emerald-400/25",
    icon: "text-emerald-300",
    dot: "bg-emerald-400",
    link: "text-emerald-300 hover:text-emerald-200",
  },
  "cat-multimedia-ai": {
    tile: "bg-fuchsia-400/10 ring-fuchsia-400/25",
    icon: "text-fuchsia-300",
    dot: "bg-fuchsia-400",
    link: "text-fuchsia-300 hover:text-fuchsia-200",
  },
  "cat-talent-solutions": {
    tile: "bg-orange-400/10 ring-orange-400/25",
    icon: "text-orange-300",
    dot: "bg-orange-400",
    link: "text-orange-300 hover:text-orange-200",
  },
};

const divisionAccent = (id: string): DivisionAccent =>
  DIVISION_ACCENTS[id] ?? {
    tile: "bg-amber-400/10 ring-amber-400/25",
    icon: "text-amber-300",
    dot: "bg-amber-400",
    link: "text-amber-300 hover:text-amber-200",
  };

// ============================================================
// PUBLIC HEADER
// ============================================================

type OpenMenu = "categories" | "talent" | null;

export function PublicHeader() {
  const pathname = usePathname();
  const categories = useAppStore((s) => s.categories);
  const subcategories = useAppStore((s) => s.subcategories);
  const services = useAppStore((s) => s.services);

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [openStrip, setOpenStrip] = useState<string | null>(null);
  const [stripAnchor, setStripAnchor] = useState<HTMLDivElement | null>(null);
  const [modeOpen, setModeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Secondary strip collapse on inner pages (home keeps it always
  // visible): pages with a dedicated hero (#hero — service detail) keep
  // the strip pinned until the hero has fully scrolled past the sticky
  // header — the exact moment the PageActionBar engages — so the two
  // swap cleanly; other inner pages collapse it after a short scroll.
  const [pastTop, setPastTop] = useState(false);
  const isHome = pathname === "/";
  // Marketplace pages (/marketplace + /marketplace/<slug>) never show the
  // secondary division strip — the marketplace has its own filter bar as
  // the secondary header, so the division pills would duplicate it.
  const isMarketplacePage =
    pathname === "/marketplace" || pathname.startsWith("/marketplace/");
  const showStrip = !isMarketplacePage && (isHome || !pastTop);
  // TALENT SECTION — on talent pages the secondary strip swaps from the
  // six marketplace division pills to the NEW 6-grouped Talent Solutions
  // options (3 candidate-side + 3 employer-side). Each group pill opens a
  // vertical flyout on its RIGHT side listing the existing talent services
  // that belong to that group.
  //
  // Active-group detection: a path can be either a GROUP page
  // (/talent-solutions/candidate-get-trained) — slug matches a group
  // directly — OR an existing SERVICE page (/talent-solutions/train-to-hire
  // or /talent-solutions/train-to-hire/<sub>) — we look up which group's
  // services include that slug and highlight the matching group.
  const isTalentSection =
    pathname === "/talent-solutions" || pathname.startsWith("/talent-solutions/");
  const talentPathParts = isTalentSection ? pathname.split("/") : [];
  const talentSegment2 = talentPathParts[2] ?? "";
  const talentActiveSub = talentPathParts[3];
  // If the segment matches a group slug directly, that's the active group.
  // Otherwise find the group whose services include this slug.
  const talentActiveGroup =
    talentSegment2 && getTalentStripGroup(talentSegment2)
      ? talentSegment2
      : TALENT_STRIP_GROUPS.find((g) =>
            g.services.some((s) => s.slug === talentSegment2)
          )?.slug ?? "";
  // Keep the legacy active option name so any code that still reads it
  // keeps working (e.g. the existing TalentStripMenu for sub-page nav).
  const talentActiveOption = talentSegment2;

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
    // Same-interaction guard: hover-intent just opened a flyout (< 600 ms
    // ago), so this click is the tail end of that interaction. Previously
    // this returned unconditionally, which swallowed legitimate clicks when
    // the flyout had already been closed by a leave-timer between the hover
    // open and the click — reading to the user as "header options are not
    // working". Now we only keep-open if the flyout IS still open; if it
    // was closed, the click opens it as the user intended.
    const wasHoverOpenedRecently = Date.now() - hoverOpenedAt.current < 600;
    hoverOpenedAt.current = 0;
    setOpenMenu((prev) => {
      if (prev === menu) {
        // Flyout is currently open. If hover opened it < 600ms ago, keep it
        // open (don't let the click close it). Otherwise toggle it closed.
        return wasHoverOpenedRecently ? menu : null;
      }
      // Flyout is closed or a different one is open — open this one.
      return menu;
    });
  };

  const pillRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ── Hover-intent engine: all three header flyouts (Browse Categories,
  // Talent Solutions, Mode) + the six strip dropdowns open on
  // hover and close once the pointer leaves the whole header. Click still
  // toggles; Escape and outside-click still dismiss.
  const closeTimer = useRef<number | null>(null);
  const openTimer = useRef<number | null>(null);
  // Timestamp of the most recent hover-intent open. A physical click lands
  // ~100-300 ms after pointerenter, i.e. right AFTER the 90 ms hover-open
  // fired — without this guard that click TOGGLES the flyout straight back
  // closed ("hover opens, click flashes it shut"), which read to users as
  // "header options are not working" and made the behavior flaky: whether
  // a click opened or closed the panel depended on millisecond timing.
  const hoverOpenedAt = useRef<number>(0);
  const clearTimers = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    if (openTimer.current !== null) window.clearTimeout(openTimer.current);
    closeTimer.current = null;
    openTimer.current = null;
  };
  const closeAllFlyouts = () => {
    setOpenMenu(null);
    setOpenStrip(null);
    setModeOpen(false);
  };
  // Click-intent dismissal: closes flyouts AND the search suggestions.
  // Used by the document pointerdown listener and route changes — never by
  // the hover engine (a parked pointer must not close the search panel
  // while the user is typing).
  const dismissAll = () => {
    closeAllFlyouts();
    setSearchOpen(false);
  };
  const dismissFlyouts = () => {
    clearTimers();
    closeAllFlyouts();
  };
  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(closeAllFlyouts, 240);
  };
  const hoverOpenMenu = (menu: Exclude<OpenMenu, null>) => {
    clearTimers();
    openTimer.current = window.setTimeout(() => {
      setOpenStrip(null);
      setModeOpen(false);
      setOpenMenu(menu);
      hoverOpenedAt.current = Date.now();
    }, 90);
  };
  const hoverOpenStrip = (catId: string) => {
    clearTimers();
    openTimer.current = window.setTimeout(() => {
      setOpenMenu(null);
      setModeOpen(false);
      setStripAnchor(pillRefs.current[catId] ?? null);
      setOpenStrip(catId);
    }, 90);
  };
  const hoverOpenMode = () => {
    clearTimers();
    openTimer.current = window.setTimeout(() => {
      setOpenMenu(null);
      setOpenStrip(null);
      setModeOpen(true);
      hoverOpenedAt.current = Date.now();
    }, 90);
  };

  useEffect(() => () => clearTimers(), []);

  // Leave-close that doesn't depend on header mouseleave (which some
  // environments synthesize unreliably): any pointer movement outside the
  // header and outside an open flyout panel schedules dismissal.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      const inside = t.closest("header") || t.closest("[data-flyout-panel]");
      if (inside) {
        if (closeTimer.current !== null) {
          window.clearTimeout(closeTimer.current);
          closeTimer.current = null;
        }
      } else if (openMenu !== null || openStrip !== null || modeOpen) {
        scheduleClose();
      }
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, [openMenu, openStrip, modeOpen]);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y > 88) setOpenStrip(null);
      // Hero-aware collapse: when the page renders a #hero section
      // (service detail), the strip stays pinned while any part of the
      // hero is on screen and collapses the instant the hero's bottom
      // edge passes the sticky main bar — the same trigger the sticky
      // PageActionBar uses, so the strip hands over to the CTA bar
      // seamlessly. Pages without a hero keep the short-scroll rule.
      const hero = document.getElementById("hero");
      if (hero && hero.offsetHeight > 0) {
        const headerH = window.matchMedia("(min-width: 1024px)").matches
          ? 72
          : 64;
        setPastTop(hero.getBoundingClientRect().bottom <= headerH + 1);
      } else {
        setPastTop(y > 88);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Escape closes any open flyout
  useEffect(() => {
    if (openMenu === null && openStrip === null && !modeOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMenu, openStrip, modeOpen, searchOpen]);

  // ── OVERLAY-FREE outside-click dismissal ──
  // There are deliberately NO full-viewport catcher divs anywhere in the
  // header. A catcher is an element that intercepts hit-testing for the
  // whole page; any z-index or stacking-context mistake around one silently
  // swallows user clicks (the historical "header options not working" bug).
  // Instead, a document-level pointerdown listener OBSERVES clicks and only
  // closes menus — it can never block, eat, or redirect a click.
  useEffect(() => {
    const anyOpen = openMenu !== null || openStrip !== null || searchOpen || modeOpen;
    if (!anyOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t || !t.closest) return;
      // Header UI (incl. the in-header mega menu) and portalled flyout
      // panels manage their own interactions — only a click that lands
      // fully outside the header surface dismisses everything.
      if (t.closest("header")) return;
      if (t.closest("[data-flyout-panel]")) return;
      if (t.closest("[data-search-panel]")) return;
      dismissAll();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openMenu, openStrip, searchOpen, modeOpen]);

  // Close menus when route changes — adjusted during render (React-recommended pattern)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    dismissAll();
    setMobileOpen(false);
  }

  const publishedCategories = useMemo(
    () => categories.filter((c) => c.status === "active"),
    [categories]
  );

  // Secondary header strip: six curated division pills shown in a fixed grid.
  // Talent Solutions is NOT a strip pill — it lives in the main header via
  // its own trigger + dedicated mega panel (and stays in Browse Categories).
  const stripCategories = useMemo(
    () =>
      STRIP_SLUGS.map((slug) => publishedCategories.find((c) => c.slug === slug)).filter(
        (c): c is Category => Boolean(c)
      ),
    [publishedCategories]
  );

  // Browse-Categories mega menu + mobile nav sheet: ALL seven marketplace
  // divisions, Talent Solutions included.
  const megaCategories = useMemo(
    () =>
      MEGA_SLUGS.map((slug) => publishedCategories.find((c) => c.slug === slug)).filter(
        (c): c is Category => Boolean(c)
      ),
    [publishedCategories]
  );

  // Per-category published service counts + active subcategories
  const serviceCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of services) {
      if (s.status !== "published") continue;
      map[s.categoryId] = (map[s.categoryId] ?? 0) + 1;
    }
    return map;
  }, [services]);

  const subsByCategory = useMemo(() => {
    const map: Record<string, Subcategory[]> = {};
    for (const sub of subcategories) {
      if (sub.status !== "active") continue;
      (map[sub.categoryId] ??= []).push(sub);
    }
    return map;
  }, [subcategories]);

  // Browse-Categories mega payload: every subcategory → its published services
  // (top few rendered per sub so the two-panel flyout stays compact).
  const servicesBySubAll = useMemo(() => {
    const map: Record<string, Service[]> = {};
    for (const s of services) {
      if (s.status !== "published" || !s.subcategoryId) continue;
      (map[s.subcategoryId] ??= []).push(s);
    }
    return map;
  }, [services]);

  // Secondary-strip dropdown payloads: ALL subcategories per division
  // (scrollable flyout), up to 6 published services per subcategory.
  const stripMenuData = useMemo(
    () =>
      stripCategories.map((cat) => {
        const subs = subsByCategory[cat.id] ?? [];
        const servicesBySub: Record<string, Service[]> = {};
        for (const sub of subs) {
          servicesBySub[sub.id] = services
            .filter((s) => s.subcategoryId === sub.id && s.status === "published")
            .slice(0, 6);
        }
        return { cat, subs, servicesBySub };
      }),
    [stripCategories, subsByCategory, services]
  );

  return (
    <>
      {/* ── Sticky header: main bar + category strip ── */}
      <header
        onMouseEnter={clearTimers}
        onMouseLeave={scheduleClose}
        className={cn(
          "sticky top-0 z-50 w-full bg-brand-ink text-white transition-shadow duration-300",
          scrolled ? "shadow-lg shadow-black/40" : "shadow-none"
        )}
      >
        <div className="relative mx-auto max-w-[1560px] px-4 sm:px-6">
          {/* Main bar */}
          <div className="flex h-16 items-center gap-1.5 sm:gap-2.5 lg:h-[72px] lg:gap-1.5 xl:gap-2.5">
            <Logo href="/" priority className="h-6 w-auto xl:h-7" />

            {/* Browse Categories — ghost mega trigger (matches Talent Solutions) */}
            <div className="relative lg:shrink-0">
              <NavTrigger
                icon={LayoutGrid}
                label="Browse Categories"
                open={openMenu === "categories"}
                controlsId="stioos-category-mega"
                onClick={() => toggleMenu("categories")}
                onMouseEnter={() => hoverOpenMenu("categories")}
                onFocus={() => hoverOpenMenu("categories")}
              />

              {/* ── Two-panel mega flyout — ALL seven marketplace divisions,
                  each with its subcategories and services ── */}
              {openMenu === "categories" && (
                <CategoryMegaMenu
                  categories={megaCategories}
                  serviceCounts={serviceCounts}
                  subsByCategory={subsByCategory}
                  servicesBySub={servicesBySubAll}
                  onClose={() => setOpenMenu(null)}
                />
              )}
            </div>

            {/* Inline search — entering it dismisses open flyouts */}
            <div
              className="min-w-0 flex-1 lg:min-w-[140px] lg:max-w-[680px]"
              onMouseEnter={dismissFlyouts}
            >
              <HeaderSearch
                className="w-full"
                open={searchOpen}
                onOpenChange={setSearchOpen}
                stripShown={showStrip}
              />
            </div>

            {/* Talent Solutions — mega menu trigger (hover / click) */}
            <NavTrigger
              icon={Users}
              label="Talent Solutions"
              open={openMenu === "talent"}
              controlsId="stioos-talent-mega"
              onClick={() => toggleMenu("talent")}
              onMouseEnter={() => hoverOpenMenu("talent")}
              onFocus={() => hoverOpenMenu("talent")}
            />

            {/* Worksonn removed entirely (header + routes) per product decision — */}

            {/* Right actions — entering the cluster dismisses nav flyouts.
                Visible from md up: below lg the main nav triggers collapse
                into the hamburger, but account + theme stay in the bar so
                mid-width windows (768-1023px, e.g. half-screen previews)
                are never left with an apparently empty header. */}
            <div
              className="ml-auto hidden shrink-0 items-center gap-1 md:flex"
              onMouseEnter={() => {
                clearTimers();
                setOpenMenu(null);
                setOpenStrip(null);
                setSearchOpen(false);
              }}
            >
              <div onMouseEnter={hoverOpenMode}>
                <ThemeToggle
                  open={modeOpen}
                  onOpenChange={(o) => {
                    clearTimers();
                    // Same-interaction guard as toggleMenu: hover-intent
                    // just opened the theme panel, so the click that
                    // follows must not instantly close it. Read-only on
                    // purpose — the timestamp expires on its own.
                    if (!o && Date.now() - hoverOpenedAt.current < 600) {
                      return;
                    }
                    setModeOpen(o);
                  }}
                />
              </div>
              <span className="mx-1 hidden h-5 w-px bg-white/10 xl:block" />
              <AccountButton />
            </div>

            {/* Mobile actions — single, unambiguous hamburger (state-controlled
                Sheet: the inline search already covers search on mobile, so a
                second search-icon trigger that ALSO opened the nav sheet was
                removed — it read as "Open menu" and duplicated the hamburger). */}
            <div className="ml-auto flex shrink-0 items-center gap-1 lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetContent
                  side="right"
                  className="w-[88vw] max-w-sm overflow-y-auto border-white/10 bg-brand-ink p-0 text-white sm:max-w-sm"
                >
                  <div className="sticky top-0 z-10 border-b border-white/10 bg-brand-ink/95 p-4 backdrop-blur">
                    <SheetTitle asChild>
                      <div className="flex items-center justify-between">
                        <Logo href={null} className="h-6 w-auto" />
                        <button
                          aria-label="Close menu"
                          onClick={() => setMobileOpen(false)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          <X className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                        </button>
                      </div>
                    </SheetTitle>
                  </div>
                  <MobileNav
                    categories={megaCategories}
                    subsByCategory={subsByCategory}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </SheetContent>
              </Sheet>
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ── Secondary header: six fixed division pills — OR, on talent
              pages the 9 Talent Solutions options, each with sub-page flyouts ── */}
          {/* Height/opacity transition is pure CSS (was framer-motion) — the
              framer-motion runtime no longer ships with the public header. */}
          <div
            className={cn(
              "hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:block",
              showStrip ? "h-[46px] opacity-100" : "h-0 opacity-0"
            )}
            aria-hidden={!showStrip}
            onMouseEnter={() => {
              // Pointer moving toward the division pills ends search mode so
              // the pills are always immediately interactive (the suggestions
              // panel otherwise paints over this band).
              if (searchOpen) setSearchOpen(false);
            }}
          >
            <nav
              aria-label={
                isTalentSection
                  ? "Talent solutions options"
                  : "Solution divisions"
              }
              className="flex h-[46px] items-center border-t border-white/[0.07]"
            >
              <div className="flex min-w-0 flex-1 items-center justify-between gap-1 xl:gap-1.5">
                {isTalentSection
                  ? (() => {
                      // Talent Solutions secondary header — 6 grouped
                      // options split into two equal halves with a visual
                      // divider: 3 candidate-side (left) + 3 employer-side
                      // (right). Each pill opens a vertical flyout on its
                      // RIGHT side listing the existing talent services
                      // that belong to that group.
                      const GROUP_ACCENT_TILE: Record<string, string> = {
                        blue: "text-sky-300",
                        emerald: "text-emerald-300",
                        orange: "text-orange-300",
                      };
                      const GROUP_ACCENT_BORDER: Record<
                        string,
                        string
                      > = {
                        blue: "hover:border-sky-400/50",
                        emerald: "hover:border-emerald-400/50",
                        orange: "hover:border-orange-400/50",
                      };
                      const GROUP_ACCENT_ACTIVE: Record<
                        string,
                        string
                      > = {
                        blue: "border-sky-400/60 bg-sky-400/[0.10]",
                        emerald:
                          "border-emerald-400/60 bg-emerald-400/[0.10]",
                        orange:
                          "border-orange-400/60 bg-orange-400/[0.10]",
                      };
                      const renderGroupPill = (
                        group: (typeof TALENT_STRIP_GROUPS)[number],
                        idx: number
                      ) => {
                        const menuId = `talent-group-${group.slug}`;
                        const isActive = talentActiveGroup === group.slug;
                        return (
                          <div
                            key={group.slug}
                            ref={(el) => {
                              pillRefs.current[menuId] = el;
                            }}
                            className="relative flex min-w-0 shrink"
                            onMouseEnter={() => hoverOpenStrip(menuId)}
                          >
                            <Link
                              href={`/talent-solutions/${group.slug}`}
                              onClick={() => {
                                // Always navigate on click — the hover
                                // flyout (onMouseEnter) provides a desktop
                                // preview; on touch devices tapping goes
                                // straight to the page.
                                dismissFlyouts();
                              }}
                              tabIndex={showStrip ? 0 : -1}
                              title={group.name}
                              aria-haspopup="true"
                              aria-expanded={openStrip === menuId}
                              aria-current={isActive ? "page" : undefined}
                              className={cn(
                                "group inline-flex h-9 min-w-0 shrink items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-2.5 shadow-[0_1px_2px_rgba(2,8,23,0.05)] transition-colors duration-200 hover:bg-white/[0.09]",
                                GROUP_ACCENT_BORDER[group.accent],
                                isActive && GROUP_ACCENT_ACTIVE[group.accent]
                              )}
                            >
                              <group.icon
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0",
                                  GROUP_ACCENT_TILE[group.accent]
                                )}
                              />
                              <span className="min-w-0 truncate text-[11px] font-semibold whitespace-nowrap leading-none text-slate-200 transition-colors group-hover:text-white xl:text-xs">
                                {group.stripLabel}
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 shrink-0 text-slate-400 transition-transform duration-200",
                                  openStrip === menuId && "rotate-180"
                                )}
                              />
                            </Link>

                            {/* Vertical flyout — opens on the RIGHT side of
                                the pill, listing the group's services */}
                            {openStrip === menuId && showStrip && (
                              <TalentVerticalFlyout
                                anchorEl={stripAnchor}
                                group={group}
                                activeServiceSlug={
                                  isActive ? talentActiveSub : undefined
                                }
                                onClose={dismissFlyouts}
                                onKeepAlive={clearTimers}
                                onScheduleClose={scheduleClose}
                              />
                            )}
                          </div>
                        );
                      };

                      return (
                        <>
                          {/* PREMIUM TALENT SOLUTIONS — left-most pill, opens
                              a wide mega menu (Browse-Categories pattern)
                              with deep-dive page cards on the left + a
                              vertical services list on the right. Premium
                              styling (deeper amber gradient + gold accents)
                              and wider button so it reads as the marquee
                              entry point and matches the header's horizontal
                              rhythm. */}
                          <div
                            ref={(el) => {
                              pillRefs.current["talent-all-services"] = el;
                            }}
                            className="relative flex min-w-0 shrink"
                            onMouseEnter={() => hoverOpenStrip("talent-all-services")}
                          >
                            <Link
                              href="/talent-solutions"
                              onClick={() => {
                                dismissFlyouts();
                              }}
                              tabIndex={showStrip ? 0 : -1}
                              title="Premium Talent Solutions"
                              aria-haspopup="true"
                              aria-expanded={openStrip === "talent-all-services"}
                              aria-current={
                                talentActiveGroup === "" && !talentActiveOption
                                  ? "page"
                                  : undefined
                              }
                              className="group inline-flex h-9 min-w-0 shrink items-center gap-1.5 rounded-lg border border-amber-400/60 bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-amber-600/15 px-2.5 shadow-[0_0_22px_-6px] shadow-amber-500/50 transition-colors duration-200 hover:border-amber-300/80 hover:from-amber-500/35 hover:via-orange-500/25 hover:to-amber-600/20"
                            >
                              <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                              <span className="min-w-0 truncate text-[11px] font-bold whitespace-nowrap leading-none text-amber-700 dark:text-amber-200 transition-colors group-hover:text-amber-800 dark:group-hover:text-amber-100 xl:text-xs">
                                Premium Talent
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 shrink-0 text-amber-600 dark:text-amber-300/80 transition-transform duration-200",
                                  openStrip === "talent-all-services" && "rotate-180"
                                )}
                              />
                            </Link>

                            {/* Mega flyout — deep-dive page cards + vertical services list */}
                            {openStrip === "talent-all-services" && showStrip && (
                              <TalentAllServicesFlyout
                                anchorEl={stripAnchor}
                                align="left"
                                activeServiceSlug={talentActiveOption || undefined}
                                onClose={dismissFlyouts}
                                onKeepAlive={clearTimers}
                                onScheduleClose={scheduleClose}
                              />
                            )}
                          </div>

                          {/* CANDIDATE SIDE (3) — left half */}
                          <div className="flex min-w-0 shrink items-center gap-1 xl:gap-1.5">
                            {CANDIDATE_STRIP_GROUPS.map(renderGroupPill)}
                          </div>

                          {/* Divider — candidate | employer */}
                          <div
                            className="mx-0.5 hidden h-5 w-px shrink-0 bg-white/15 sm:block"
                            aria-hidden="true"
                          />

                          {/* EMPLOYER SIDE (3) — right half */}
                          <div className="flex min-w-0 shrink items-center gap-1 xl:gap-1.5">
                            {EMPLOYER_STRIP_GROUPS.map(renderGroupPill)}
                          </div>

                          {/* Divider — employer | info */}
                          <div
                            className="mx-0.5 hidden h-5 w-px shrink-0 bg-white/15 sm:block"
                            aria-hidden="true"
                          />

                          {/* INFO SIDE (2) — Joining Terms + Learning Terms */}
                          <div className="flex min-w-0 shrink items-center gap-1 xl:gap-1.5">
                            {TALENT_INFO_PAGES.map((info) => {
                              const INFO_ACCENT_TILE: Record<string, string> = {
                                blue: "text-sky-300",
                                emerald: "text-emerald-300",
                                orange: "text-orange-300",
                              };
                              const INFO_ACCENT_BORDER: Record<string, string> = {
                                blue: "hover:border-sky-400/50",
                                emerald: "hover:border-emerald-400/50",
                                orange: "hover:border-orange-400/50",
                              };
                              const isActiveInfo = talentActiveOption === info.slug;
                              return (
                                <Link
                                  key={info.slug}
                                  href={`/talent-solutions/${info.slug}`}
                                  onClick={() => {
                                    dismissFlyouts();
                                  }}
                                  tabIndex={showStrip ? 0 : -1}
                                  title={info.name}
                                  aria-current={isActiveInfo ? "page" : undefined}
                                  className={cn(
                                    "group inline-flex h-9 min-w-0 shrink items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-2.5 shadow-[0_1px_2px_rgba(2,8,23,0.05)] transition-colors duration-200 hover:bg-white/[0.09]",
                                    INFO_ACCENT_BORDER[info.accent],
                                    isActiveInfo &&
                                      info.accent === "blue" &&
                                      "border-sky-400/60 bg-sky-400/[0.10]",
                                    isActiveInfo &&
                                      info.accent === "emerald" &&
                                      "border-emerald-400/60 bg-emerald-400/[0.10]",
                                    isActiveInfo &&
                                      info.accent === "orange" &&
                                      "border-orange-400/60 bg-orange-400/[0.10]"
                                  )}
                                >
                                  <info.icon
                                    className={cn(
                                      "h-3.5 w-3.5 shrink-0",
                                      INFO_ACCENT_TILE[info.accent]
                                    )}
                                  />
                                  <span className="min-w-0 truncate text-[11px] font-semibold whitespace-nowrap leading-none text-slate-200 transition-colors group-hover:text-white xl:text-xs">
                                    {info.stripLabel}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()
                  : stripCategories.map((cat, idx) => {
                  const data = stripMenuData[idx];
                  const accent = divisionAccent(cat.id);
                  return (
                    <div
                      key={cat.id}
                      ref={(el) => {
                        pillRefs.current[cat.id] = el;
                      }}
                      className="relative flex min-w-0 shrink"
                      onMouseEnter={() => hoverOpenStrip(cat.id)}
                    >
                      <Link
                        href={`/category/${cat.slug}`}
                        onClick={() => {
                          // Always navigate on click — the hover flyout
                          // (onMouseEnter) provides a desktop preview; on
                          // touch devices tapping goes straight to the page.
                          dismissFlyouts();
                        }}
                        tabIndex={showStrip ? 0 : -1}
                        title={cat.name}
                        aria-haspopup="true"
                        aria-expanded={openStrip === cat.id}
                        className="group inline-flex h-9 min-w-0 shrink items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] pl-2.5 pr-2 shadow-[0_1px_2px_rgba(2,8,23,0.05)] transition-colors duration-200 hover:border-indigo-400/40 hover:bg-white/[0.09]"
                      >
                        <Icon name={cat.icon} className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span className="min-w-0 truncate text-[11px] font-semibold whitespace-nowrap leading-none text-slate-200 transition-colors group-hover:text-white xl:text-xs">
                          {cat.name}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200",
                            openStrip === cat.id && "rotate-180"
                          )}
                        />
                      </Link>

                      {/* Hover dropdown: subcategory chips row + related services row (horizontal) */}
                      {openStrip === cat.id && showStrip && data && (
                        <StripCategoryMenu
                          anchorEl={stripAnchor}
                          cat={cat}
                          accent={accent}
                          subs={data.subs}
                          servicesBySub={data.servicesBySub}
                          totalServices={serviceCounts[cat.id] ?? 0}
                          align={idx <= 1 ? "left" : idx >= 4 ? "right" : "center"}
                          onClose={dismissFlyouts}
                          onKeepAlive={clearTimers}
                          onScheduleClose={scheduleClose}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* ── Talent Solutions mega flyout — anchored below the MAIN bar
              (overlapping the strip), mirroring the Browse Categories flyout ── */}
          {openMenu === "talent" && (
            <TalentMegaMenu onClose={() => setOpenMenu(null)} />
          )}
        </div>
      </header>

      {/* Mobile quick-scroll strip — mirrors the desktop secondary header
          (Premium Talent Solutions + 6 grouped options on talent pages,
          divisions everywhere else). Service detail views hide both
          strips entirely. */}
      {!isMarketplacePage && (
      <div className="border-b border-white/[0.06] bg-brand-ink lg:hidden">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 py-2">
          {isTalentSection
            ? (<>
                {/* Premium Talent Solutions — first pill (premium amber accent) */}
                <Link
                  href="/talent-solutions"
                  onClick={() => setMobileOpen(false)}
                  aria-current={
                    talentActiveGroup === "" && !talentActiveOption
                      ? "page"
                      : undefined
                  }
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-amber-400/60 bg-gradient-to-br from-amber-500/25 via-orange-500/20 to-amber-600/15 py-2 pl-2.5 pr-2 text-xs font-bold text-amber-700 dark:text-amber-200 shadow-[0_0_22px_-6px] shadow-amber-500/50"
                >
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-400" />
                  Premium Talent Solutions
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-300/80" />
                </Link>
                {TALENT_STRIP_GROUPS.map((group) => {
                const isActiveGroup = talentActiveGroup === group.slug;
                const GROUP_ACCENT_MOBILE_TILE: Record<string, string> = {
                  blue: "text-sky-300",
                  emerald: "text-emerald-300",
                  orange: "text-orange-300",
                };
                const GROUP_ACCENT_MOBILE_ACTIVE: Record<string, string> = {
                  blue: "border-sky-400/50 bg-sky-400/[0.10]",
                  emerald: "border-emerald-400/50 bg-emerald-400/[0.10]",
                  orange: "border-orange-400/50 bg-orange-400/[0.10]",
                };
                return (
                  <Link
                    key={group.slug}
                    href={`/talent-solutions/${group.slug}`}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActiveGroup ? "page" : undefined}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] py-2 pl-2.5 pr-2 text-xs font-semibold text-slate-200 shadow-[0_1px_2px_rgba(2,8,23,0.05)]",
                      isActiveGroup && GROUP_ACCENT_MOBILE_ACTIVE[group.accent]
                    )}
                  >
                    <group.icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        GROUP_ACCENT_MOBILE_TILE[group.accent]
                      )}
                    />
                    {group.stripLabel}
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  </Link>
                );
                })}
                {/* Info pills — Joining Terms + Learning Terms */}
                {TALENT_INFO_PAGES.map((info) => {
                  const INFO_ACCENT_MOBILE_TILE: Record<string, string> = {
                    blue: "text-sky-300",
                    emerald: "text-emerald-300",
                    orange: "text-orange-300",
                  };
                  const INFO_ACCENT_MOBILE_ACTIVE: Record<string, string> = {
                    blue: "border-sky-400/50 bg-sky-400/[0.10]",
                    emerald: "border-emerald-400/50 bg-emerald-400/[0.10]",
                    orange: "border-orange-400/50 bg-orange-400/[0.10]",
                  };
                  const isActiveInfo = talentActiveOption === info.slug;
                  return (
                    <Link
                      key={info.slug}
                      href={`/talent-solutions/${info.slug}`}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isActiveInfo ? "page" : undefined}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] py-2 pl-2.5 pr-2 text-xs font-semibold text-slate-200 shadow-[0_1px_2px_rgba(2,8,23,0.05)]",
                        isActiveInfo && INFO_ACCENT_MOBILE_ACTIVE[info.accent]
                      )}
                    >
                      <info.icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          INFO_ACCENT_MOBILE_TILE[info.accent]
                        )}
                      />
                      {info.stripLabel}
                    </Link>
                  );
                })}
              </>)
            : stripCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] py-2 pl-2.5 pr-2 text-xs font-semibold text-slate-200 shadow-[0_1px_2px_rgba(2,8,23,0.05)]"
                >
                  <Icon name={cat.icon} className="h-4 w-4 shrink-0 text-indigo-400" />
                  {cat.name}
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                </Link>
              ))}
        </div>
      </div>
      )}

      {/* Same-page sign-in panel — opens over any public page */}
      <LoginDrawer />
    </>
  );
}

// ============================================================
// STRIP CATEGORY DROPDOWN — wide hover flyout per division pill.
// Horizontal layout: one scrollable row of ALL subcategory chips;
// the chip under the pointer feeds the "Related services" band
// below — one horizontal row of compact service cards for that
// subcategory (rating). Click a chip → subcategory page;
// click a card → service detail page.
// ============================================================

// ============================================================
// ACCOUNT MENU — marketplace session (buyer / member) in the public header
// ============================================================

function AccountButton() {
  const user = useCurrentUser();
  const marketLogout = useAppStore((s) => s.marketLogout);
  const router = useRouter();
  const openLoginDrawer = useLoginDrawer((s) => s.openDrawer);

  if (!user) {
    return (
      <Button
        onClick={openLoginDrawer}
        className="h-10 rounded-xl bg-amber-500 px-3 font-semibold text-brand-ink shadow-[0_0_20px_-6px] shadow-amber-500/50 hover:bg-amber-400 xl:px-4"
      >
        <LogIn className="h-4 w-4" /> Login
      </Button>
    );
  }

  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const dashHome =
    user.role === "buyer" ? "/dashboard/buyer" : "/dashboard";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-2 transition-colors hover:bg-white/10 xl:px-2.5"
          aria-label="Account menu"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-bold text-brand-ink">
            {initials}
          </span>
          <span className="hidden max-w-24 truncate text-sm font-medium text-slate-200 xl:block">
            {user.name.split(" ")[0]}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="text-xs font-normal capitalize text-muted-foreground">{user.role} workspace</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(dashHome)}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/marketplace")}>
          <Search className="h-4 w-4" /> Marketplace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => {
            marketLogout();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileAccountSection({ onNavigate }: { onNavigate?: () => void }) {
  const user = useCurrentUser();
  const marketLogout = useAppStore((s) => s.marketLogout);
  const router = useRouter();
  const openLoginDrawer = useLoginDrawer((s) => s.openDrawer);

  const dashHome =
    user?.role === "buyer" ? "/dashboard/buyer" : "/dashboard";

  if (!user) {
    return (
      <div className="mt-2 flex flex-col gap-2">
        <Button
          className="h-11 bg-amber-500 font-semibold text-brand-ink shadow-[0_0_20px_-6px] shadow-amber-500/50 hover:bg-amber-400"
          onClick={() => {
            onNavigate?.();
            openLoginDrawer();
          }}
        >
          <LogIn className="h-4 w-4" /> Login
        </Button>
        <Button asChild variant="outline" className="h-11 border-white/15 bg-transparent text-slate-200 hover:bg-white/10 hover:text-white">
          <Link href="/auth/signup" onClick={onNavigate}>
            Create account
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Button
        asChild
        className="h-11 bg-amber-500 font-semibold text-brand-ink shadow-[0_0_20px_-6px] shadow-amber-500/50 hover:bg-amber-400"
      >
        <Link href={dashHome} onClick={onNavigate}>
          <LayoutDashboard className="h-4 w-4" /> Go to dashboard
        </Link>
      </Button>
      <Button
        variant="outline"
        className="h-11 border-white/15 bg-transparent text-slate-200 hover:bg-white/10 hover:text-white"
        onClick={() => {
          marketLogout();
          onNavigate?.();
          router.push("/");
        }}
      >
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </div>
  );
}

function StripCategoryMenu({
  anchorEl,
  cat,
  accent,
  subs,
  servicesBySub,
  totalServices,
  align,
  onClose,
  onKeepAlive,
  onScheduleClose,
}: {
  anchorEl: HTMLDivElement | null;
  cat: Category;
  accent: DivisionAccent;
  subs: Subcategory[];
  servicesBySub: Record<string, Service[]>;
  totalServices: number;
  align: "left" | "center" | "right";
  onClose: () => void;
  onKeepAlive: () => void;
  onScheduleClose: () => void;
}) {
  // Portalled to <body> with fixed positioning — the strip container clips
  // absolutely-positioned children (overflow-hidden collapse animation), so
  // the flyout must live outside it. The header is sticky, so viewport-based
  // coordinates stay aligned with the pill while it is open.
  // Hooks stay above any early return (rules of hooks).
  // Active subcategory feeding the "Related services" band — defaults to
  // the first subcategory so the panel is never half-empty.
  const [activeSubId, setActiveSubId] = useState<string>(subs[0]?.id ?? "");
  const PANEL_W = 1120;
  const MARGIN = 12;
  const style: React.CSSProperties | undefined = (() => {
    if (!anchorEl || typeof window === "undefined") return undefined;
    // Effective width honors the CSS max-w clamp (w-[1120px] max-w-[100vw-1.5rem])
    // so clamping stays correct on narrow desktop viewports.
    const effW = Math.min(PANEL_W, window.innerWidth - MARGIN * 2);
    const rect = anchorEl.getBoundingClientRect();
    const rawLeft =
      align === "right"
        ? rect.right - effW
        : align === "center"
          ? rect.left + rect.width / 2 - effW / 2
          : rect.left;
    const left = Math.min(
      Math.max(rawLeft, MARGIN),
      Math.max(MARGIN, window.innerWidth - effW - MARGIN)
    );
    return { top: rect.bottom + 10, left };
  })();

  if (!style) return null;

  const activeSub = subs.find((s) => s.id === activeSubId) ?? subs[0];
  const activeServices = activeSub ? (servicesBySub[activeSub.id] ?? []) : [];

  return createPortal(
    <div
      data-flyout-panel
      className="fixed z-[60]"
      style={style}
      onMouseEnter={onKeepAlive}
      onMouseLeave={onScheduleClose}
    >
      <div
        className="flyout-panel max-h-[calc(100vh-8.5rem)] w-[1120px] max-w-[calc(100vw-1.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-brand-navy text-white shadow-2xl shadow-black/60 ring-1 ring-white/[0.06]"
        role="region"
        aria-label={`${cat.name} subcategories and services`}
      >
        {/* Panel header */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-6 py-3">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
              accent.tile
            )}
          >
            <Icon name={cat.icon} className={cn("h-[18px] w-[18px]", accent.icon)} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{cat.name}</p>
            <p className="truncate text-[11px] text-slate-400">{cat.tagline}</p>
          </div>
          <Link
            href={`/category/${cat.slug}`}
            onClick={onClose}
            className="hidden items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] font-semibold text-amber-300 transition-colors hover:bg-amber-400/20 sm:inline-flex"
          >
            Explore division
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* ── Band 1: subcategories — one horizontal, scrollable row ──
            Hover/focus a chip to switch the services band below it;
            click navigates to the subcategory page. */}
        <div className="px-6 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Subcategories · {subs.length}
            </p>
            {activeSub && (
              <p className="truncate text-[10.5px] font-medium text-slate-400">
                Hover a subcategory to preview its services
              </p>
            )}
          </div>
          <div className="thin-scrollbar -mx-1 mt-2 flex gap-2.5 overflow-x-auto px-1 pb-1.5">
            {subs.map((sub) => {
              const isActive = sub.id === activeSub?.id;
              return (
                <Link
                  key={sub.id}
                  href={`/category/${cat.slug}/${sub.slug}`}
                  onClick={onClose}
                  onMouseEnter={() => setActiveSubId(sub.id)}
                  onFocus={() => setActiveSubId(sub.id)}
                  title={sub.description}
                  data-active={isActive ? "true" : undefined}
                  className={cn(
                    "group/sub flex w-[150px] shrink-0 flex-col gap-2 rounded-xl border p-2.5 text-left transition-all duration-150",
                    isActive
                      ? "border-amber-400/50 bg-amber-400/[0.08] shadow-[0_0_18px_-8px] shadow-amber-400/40"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.05]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-150 group-hover/sub:scale-105",
                      accent.tile
                    )}
                  >
                    <Icon name={subIconFor(sub, cat.icon)} className={cn("h-[15px] w-[15px] shrink-0", accent.icon)} />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-[11.5px] font-bold leading-snug transition-colors",
                        isActive ? "text-amber-300" : "text-white group-hover/sub:text-amber-300"
                      )}
                      style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                    >
                      {sub.name}
                    </span>
                    <span className="mt-1 block text-[9.5px] font-medium uppercase tracking-wide text-slate-500">
                      {(servicesBySub[sub.id]?.length ?? 0) || 0} services
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Band 2: related services of the active subcategory — one
            horizontal row of compact service cards ── */}
        <div className="px-6 pb-4 pt-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="min-w-0 truncate text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Related services
              {activeSub ? (
                <span className="ml-1.5 normal-case tracking-normal text-slate-400">
                  {" · "}{activeSub.name}
                </span>
              ) : null}
            </p>
            {activeSub && (
              <Link
                href={`/category/${cat.slug}/${activeSub.slug}`}
                onClick={onClose}
                className={cn("shrink-0 text-[10.5px] font-semibold transition-colors", accent.link)}
              >
                View all →
              </Link>
            )}
          </div>
          <div className="thin-scrollbar -mx-1 mt-2 flex gap-2.5 overflow-x-auto px-1 pb-1.5">
            {activeServices.length === 0 && (
              <p className="py-6 text-[11.5px] text-slate-500">
                Services for this subcategory are being onboarded — explore the division meanwhile.
              </p>
            )}
            {activeServices.map((svc) => (
              <Link
                key={svc.id}
                href={`/marketplace/${svc.slug}`}
                onClick={onClose}
                className="group/svc flex w-[168px] shrink-0 flex-col rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 transition-all duration-150 hover:border-amber-400/40 hover:bg-white/[0.05]"
              >
                <span className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md ring-1",
                      accent.tile
                    )}
                  >
                    <Icon name={svc.icon} className={cn("h-3 w-3 shrink-0", accent.icon)} />
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 -translate-x-1 text-slate-600 opacity-0 transition-all duration-150 group-hover/svc:translate-x-0 group-hover/svc:text-amber-300 group-hover/svc:opacity-100" />
                </span>
                <span
                  className="mt-2 block text-[11px] font-semibold leading-snug text-slate-200 transition-colors group-hover/svc:text-white"
                  style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                >
                  {svc.name}
                </span>
                <span className="mt-auto flex items-center justify-between gap-1.5 pt-2">
                  <span className="truncate text-[10px] font-bold text-amber-300/90">{deliveryLabel(svc)}</span>
                  <span className="inline-flex shrink-0 items-center gap-0.5 text-[9.5px] font-medium text-slate-500">
                    <span className="text-amber-400/80">★</span>
                    {svc.rating.toFixed(1)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Panel footer */}
        <div className="flex items-center justify-between border-t border-white/[0.07] bg-white/[0.02] px-6 py-2.5">
          <span className="flex items-center gap-2 text-[11px] text-slate-500">
            <span aria-hidden="true" className={cn("h-1.5 w-1.5 shrink-0 rounded-full", accent.dot)} />
            {totalServices} services · {subs.length} subcategories
          </span>
          <Link
            href={`/category/${cat.slug}#services`}
            onClick={onClose}
            className={cn("text-[11px] font-semibold transition-colors", accent.link)}
          >
            View all services →
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================================
// STANDARD HEADER NAV — Solutions, Marketplace, Industries,
// Insights, Resources, About. Items with children get a hover
// dropdown panel. Self-contained (own hover state) so it
// doesn't interfere with the mega-menu openMenu system.
// ============================================================

interface NavChild {
  label: string;
  href: string;
  description?: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

const HEADER_NAV_ITEMS: NavItem[] = [
  {
    label: "Solutions",
    href: "/solutions",
    children: SOLUTION_LIST.map((s) => ({
      label: s.name,
      href: `/solutions/${s.slug}`,
      description: "Outcome-based engagement",
    })),
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "All Services", href: "/services", description: "The complete 305-service catalog" },
      { label: "AI Automation & Agentic Solutions", href: "/category/ai-agents", description: "Autonomous agentic solutions" },
      { label: "Technology & Programming", href: "/category/technology-programming", description: "Custom engineering capacity" },
      { label: "Cloud DevOps & MLOps", href: "/category/cloud-devops-mlops", description: "Resilient cloud platforms" },
      { label: "Digital Sales & Marketing", href: "/category/digital-sales-marketing", description: "AI-driven growth engines" },
      { label: "Business & Enterprise Services", href: "/category/business-enterprise-services", description: "Operational excellence" },
      { label: "Multimedia AI & Graphics", href: "/category/multimedia-ai-graphics", description: "AI-crafted content at scale" },
    ],
  },
  { label: "Marketplace", href: "/marketplace" },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "All Industries", href: "/industries", description: "Ten core industries served" },
      { label: "Construction", href: "/industries/construction" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Technology", href: "/industries/technology" },
      { label: "Financial Services", href: "/industries/financial-services" },
      { label: "E-Commerce", href: "/industries/ecommerce" },
    ],
  },
  { label: "Insights", href: "/insights" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "All Resources", href: "/resources", description: "Guides, templates & case studies" },
      { label: "FAQs", href: "/resources/faqs", description: "Answers to common questions" },
      { label: "AI Readiness Checklist", href: "/resources#res-001", description: "42-point assessment" },
      { label: "Automation ROI Template", href: "/resources#res-002", description: "Board-ready business case" },
    ],
  },
  { label: "About", href: "/about" },
];

function HeaderNavItem({ item }: { item: NavItem }) {
  const [hovered, setHovered] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const onEnter = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setHovered(true);
  };
  const onLeave = () => {
    closeTimer.current = window.setTimeout(() => setHovered(false), 150);
  };

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="flex h-9 items-center rounded-lg px-3 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <Link
        href={item.href}
        className="flex h-9 items-center gap-1 rounded-lg px-3 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
      >
        {item.label}
        <ChevronDown className={cn("h-3 w-3 transition-transform", hovered && "rotate-180")} strokeWidth={2.5} />
      </Link>
      {hovered && (
        <div
          className="flyout-panel absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-[#ffffff14] bg-[#0b0d12] p-2 shadow-2xl shadow-black/50"
          data-flyout-panel=""
        >
          {item.children.map((child) => (
            <Link
              key={child.href + child.label}
              href={child.href}
              className="block rounded-lg px-3 py-2 transition-colors hover:bg-[#ffffff0f]"
            >
              <div className="text-[13px] font-semibold text-[#f8fafc]">{child.label}</div>
              {child.description && (
                <div className="mt-0.5 text-[11px] leading-tight text-[#64748b]">{child.description}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function HeaderNav() {
  return (
    <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
      {HEADER_NAV_ITEMS.map((item) => (
        <HeaderNavItem key={item.label} item={item} />
      ))}
    </nav>
  );
}

// ============================================================
// NAV DROPDOWN TRIGGER — Talent Solutions
// ============================================================

function NavTrigger({
  icon: IconCmp,
  label,
  open,
  controlsId,
  onClick,
  onMouseEnter,
  onFocus,
}: {
  icon: LucideIcon;
  label: string;
  open: boolean;
  controlsId: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  onFocus?: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-haspopup="true"
      aria-controls={controlsId}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      className={cn(
        "hidden h-11 items-center gap-1.5 rounded-xl px-2 text-[13px] font-semibold transition-all duration-200 lg:inline-flex xl:gap-2 xl:px-3 xl:text-sm",
        open
          ? "border border-amber-400/50 bg-white/[0.08] text-white ring-2 ring-amber-400/20"
          : "border border-transparent text-slate-200 hover:bg-white/[0.06] hover:text-white"
      )}
    >
      <IconCmp
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          open ? "text-amber-400" : "text-slate-400"
        )}
      />
      <span className="whitespace-nowrap">{label}</span>
      <svg
        className={cn(
          "h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform duration-300",
          open && "rotate-180 text-amber-400"
        )}
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

// ============================================================
// CATEGORY MEGA MENU — two-panel flyout
// Left: category list · Right: subcategories of the active category
// ============================================================

function CategoryMegaMenu({
  categories,
  serviceCounts,
  subsByCategory,
  servicesBySub,
  onClose,
}: {
  categories: Category[];
  serviceCounts: Record<string, number>;
  subsByCategory: Record<string, Subcategory[]>;
  servicesBySub: Record<string, Service[]>;
  onClose: () => void;
}) {
  // Canonical spec order (01 AI … 07 Talent Solutions) — matches the data
  // file, home division sections and footer; do NOT sort by service count.
  const sortedCats = useMemo(() => [...categories], [categories]);
  // Default to "Digital, Tech & AI Services" so the six-card grid is the
  // first thing visitors see when the Browse Categories dropdown opens.
  const [activeId, setActiveId] = useState(DIGITAL_TECH_AI_ID);
  // "Digital, Tech & AI Services" is a pseudo-division that surfaces the six
  // as-a-Service solution cards instead of a category's subcategories.
  const isSolutionsPanel = activeId === DIGITAL_TECH_AI_ID;
  const active = isSolutionsPanel
    ? null
    : sortedCats.find((c) => c.id === activeId) ?? sortedCats[0];
  if (!isSolutionsPanel && !active) return null;

  const activeSubs = active ? subsByCategory[active.id] ?? [] : [];

  return (
    <div
      id="stioos-category-mega"
      role="region"
      aria-label="Solution categories"
      className="flyout-panel absolute left-4 right-4 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-brand-navy shadow-2xl shadow-black/60 ring-1 ring-white/[0.06] sm:left-6 sm:right-auto w-[calc(100%-2rem)] sm:w-[calc(100vw-6rem)] lg:w-[min(1020px,calc(100vw-6rem))] max-w-[1020px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-[290px_1fr] xl:grid-cols-[310px_1fr]">
        {/* ── Left panel: category list ── */}
        <div className="hidden flex-col border-r border-white/[0.07] bg-white/[0.02] md:flex">
          <p className="px-4 pb-1.5 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Solution Divisions
          </p>
          <div className="max-h-[430px] flex-1 overflow-y-auto p-2">
            {/* ── Digital, Tech & AI Services — FIRST entry (pseudo-division
                that surfaces the six as-a-Service solution cards in the
                right pane instead of subcategories) ── */}
            <Link
              href="/solutions"
              onClick={(e) => {
                // Click previews the 6-card panel (doesn't navigate away);
                // the cards + "All solutions" link handle navigation.
                e.preventDefault();
                setActiveId(DIGITAL_TECH_AI_ID);
              }}
              onMouseEnter={() => setActiveId(DIGITAL_TECH_AI_ID)}
              onFocus={() => setActiveId(DIGITAL_TECH_AI_ID)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150",
                isSolutionsPanel ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
              )}
            >
              {isSolutionsPanel && (
                <span
                  className="active-bar absolute inset-y-2 left-0 w-[3px] rounded-full bg-amber-400"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-all duration-200",
                  isSolutionsPanel
                    ? "from-amber-500/25 to-blue-600/15 ring-amber-400/30"
                    : "from-blue-600/25 to-amber-500/10 ring-white/10"
                )}
              >
                <Layers
                  className={cn(
                    "h-[18px] w-[18px] transition-colors",
                    isSolutionsPanel ? "text-amber-300" : "text-blue-300"
                  )}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-sm font-semibold transition-colors",
                    isSolutionsPanel
                      ? "text-white"
                      : "text-slate-200 group-hover:text-white"
                  )}
                >
                  {DIGITAL_TECH_AI_NAME}
                </span>
                <span className="block text-[11px] text-slate-500">
                  6 as-a-Service solutions
                </span>
              </span>
              <ArrowRight
                className={cn(
                  "h-4 w-4 shrink-0 transition-all",
                  isSolutionsPanel
                    ? "translate-x-0 text-amber-400 opacity-100"
                    : "-translate-x-1 text-slate-600 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )}
              />
            </Link>

            {sortedCats.map((cat) => {
              const isActive = active ? cat.id === active.id : false;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => {
                    // A click on a header option must NAVIGATE — the rail
                    // links are real anchors and users expect them to route
                    // (the swallowed click read as "header options not
                    // working"). Hover/focus still previews the division in
                    // the right pane; the click closes the flyout right away
                    // so the (public) loading bar takes over instantly.
                    setActiveId(cat.id);
                    onClose();
                  }}
                  onMouseEnter={() => setActiveId(cat.id)}
                  onFocus={() => setActiveId(cat.id)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150",
                    isActive ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"
                  )}
                >
                  {isActive && (
                    <span
                      className="active-bar absolute inset-y-2 left-0 w-[3px] rounded-full bg-amber-400"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ring-1 transition-all duration-200",
                      isActive
                        ? "from-amber-500/25 to-blue-600/15 ring-amber-400/30"
                        : "from-blue-600/25 to-amber-500/10 ring-white/10"
                    )}
                  >
                    <Icon
                      name={cat.icon}
                      className={cn(
                        "h-[18px] w-[18px] transition-colors",
                        isActive ? "text-amber-300" : "text-blue-300"
                      )}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate text-sm font-semibold transition-colors",
                        isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                      )}
                    >
                      {cat.name}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {(serviceCounts[cat.id] ?? 0)} services
                      {" · "}
                      {(subsByCategory[cat.id] ?? []).length} subcategories
                    </span>
                  </span>
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 shrink-0 transition-all",
                      isActive
                        ? "translate-x-0 text-amber-400 opacity-100"
                        : "-translate-x-1 text-slate-600 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>
          <div className="border-t border-white/[0.07] p-3">
            <Link
              href="/categories"
              onClick={onClose}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold text-amber-400 transition-colors hover:bg-amber-400/10 hover:text-amber-300"
            >
              Explore all categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ── Right panel: active category + subcategories, OR the six
            as-a-Service solution cards when "Digital, Tech & AI Services"
            is the active pseudo-division ── */}
        <div
          className={cn(
            "flex flex-col",
            isSolutionsPanel ? "max-h-[640px]" : "max-h-[540px]"
          )}
        >
          {isSolutionsPanel ? (
            <div
              key={DIGITAL_TECH_AI_ID}
              className="panel-swap flex min-h-0 flex-1 flex-col"
            >
              {/* Solutions panel header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 xl:px-6">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/25 to-blue-600/15 ring-1 ring-amber-400/25">
                    <Layers className="h-5 w-5 text-amber-300" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-semibold leading-tight text-white">
                      {DIGITAL_TECH_AI_NAME}
                    </h2>
                    <p className="mt-0.5 max-w-md text-xs leading-relaxed text-slate-400">
                      Six outcome-driven engagement bundles — every capability
                      packaged into one accountable, transparently-priced
                      solution.
                    </p>
                  </div>
                </div>
                <Link
                  href="/solutions"
                  onClick={onClose}
                  className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-400/20 sm:inline-flex"
                >
                  All solutions <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* 6-card grid (3×2) — 3 columns from lg up (the dropdown is
                  wide enough); 2 columns on narrower viewports. */}
              <div className="min-h-0 flex-1 overflow-y-auto p-3 xl:p-4">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {SOLUTIONS.map((sol) => (
                    <SolutionCard key={sol.id} sol={sol} onNavigate={onClose} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
          <div
            key={active.id}
            className="panel-swap flex min-h-0 flex-1 flex-col"
          >
              {/* Category header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 xl:px-6">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/25 to-blue-600/15 ring-1 ring-amber-400/25">
                    <Icon name={active.icon} className="h-5 w-5 text-amber-300" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-[17px] font-semibold leading-tight text-white">
                      {active.name}
                    </h2>
                    <p className="mt-0.5 line-clamp-2 max-w-md text-xs leading-relaxed text-slate-400">
                      {active.tagline}. {active.description}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/category/${active.slug}`}
                  onClick={onClose}
                  className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-400/20 sm:inline-flex"
                >
                  Explore division <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Subcategory cards — header + related services (matches the strip flyouts) */}
              <div className="min-h-0 flex-1 overflow-y-auto p-3 xl:p-4">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {activeSubs.map((sub) => {
                    const subServices = (servicesBySub[sub.id] ?? []).slice(0, 3);
                    const total = servicesBySub[sub.id]?.length ?? 0;
                    const extra = Math.max(total - subServices.length, 0);
                    return (
                      <div
                        key={sub.id}
                        className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-2.5 transition-colors duration-150 hover:border-white/[0.12] hover:bg-white/[0.04]"
                      >
                        <Link
                          href={`/category/${active.slug}/${sub.slug}`}
                          onClick={onClose}
                          title={sub.description}
                          className="group/head flex items-center gap-2.5 rounded-lg px-1 py-1"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300 ring-1 ring-white/[0.06] transition-colors group-hover/head:bg-amber-400/15 group-hover/head:text-amber-300">
                            <Icon name={subIconFor(sub, active.icon)} className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-white transition-colors group-hover/head:text-amber-300">
                            {sub.name}
                          </span>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 -translate-x-0.5 text-slate-600 opacity-0 transition-all group-hover/head:translate-x-0 group-hover/head:text-amber-400 group-hover/head:opacity-100" />
                        </Link>
                        {subServices.length > 0 ? (
                          <div className="mt-1.5 space-y-[3px]">
                            {subServices.map((sv) => (
                              <Link
                                key={sv.id}
                                href={`/marketplace/${sv.slug}`}
                                onClick={onClose}
                                className="group/row flex h-[22px] items-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.02] px-2 transition-colors hover:border-amber-400/30 hover:bg-white/[0.06]"
                              >
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-400/10 text-amber-300">
                                  <Icon name={sv.icon} className="h-2.5 w-2.5" />
                                </span>
                                <span className="min-w-0 truncate text-[11px] text-slate-300 transition-colors group-hover/row:text-white">
                                  {sv.name}
                                </span>
                              </Link>
                            ))}
                            {extra > 0 && (
                              <Link
                                href={`/category/${active.slug}/${sub.slug}`}
                                onClick={onClose}
                                className="flex h-[18px] items-center gap-1.5 px-2 text-[10px] font-semibold text-amber-400/90 transition-colors hover:text-amber-300"
                              >
                                +{extra} more {extra === 1 ? "service" : "services"}
                              </Link>
                            )}
                          </div>
                        ) : (
                          <p className="mt-1 line-clamp-2 px-1 text-[11px] leading-relaxed text-slate-500">
                            {sub.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer band */}
              <div className="mt-auto flex flex-col gap-3 border-t border-white/[0.06] bg-white/[0.03] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between xl:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <p className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">Need something bespoke?</span>{" "}
                    Our architects scope custom solutions within 24 hours.
                  </p>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="h-9 shrink-0 rounded-lg bg-amber-500 font-semibold text-brand-ink hover:bg-amber-400"
                >
                  <Link href="/contact" onClick={onClose}>
                    Request a Consultation
                  </Link>
                </Button>
              </div>
          </div>
          )}
        </div>
      </div>

      {/* Mobile: compact category links (full flyout is desktop-only) */}
      <div className="border-t border-white/[0.07] p-3 md:hidden">
        <div className="grid grid-cols-2 gap-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              <Icon name={cat.icon} className="h-4 w-4 text-amber-400" />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HEADER SEARCH — inline field with live suggestions
// ============================================================

interface SearchItem {
  key: string;
  title: string;
  sub: string;
  href: string;
  icon?: string;
  accent?: string;
}

const TRENDING = [
  "AI Agents",
  "Workflow Automation",
  "Business Intelligence",
  "Web Development",
  "Brand Identity",
];

const QUICK_LINKS: SearchItem[] = [
  { key: "ql-marketplace", title: "Marketplace", sub: "Browse every service", href: "/marketplace", icon: "Layers" },
  { key: "ql-programs", title: "Programs", sub: "Industry-ready training", href: "/programs", icon: "GraduationCap" },
  { key: "ql-talent", title: "Talent Solutions", sub: "Hire, train & staff", href: "/talent-solutions", icon: "Users" },
  { key: "ql-contact", title: "Contact", sub: "Talk to our team", href: "/contact", icon: "Headset" },
];

function HeaderSearch({
  className,
  open,
  onOpenChange,
  stripShown,
}: {
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Desktop secondary strip currently occupies the 46px band under the main bar. */
  stripShown?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  // The suggestions panel must clear the secondary strip so it never paints
  // over the division pills (a covered control is a dead control). On lg+
  // screens with the strip visible the panel drops below the whole header
  // block — the same anchor line the mega menus use.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const services = useAppStore((s) => s.services);
  const categories = useAppStore((s) => s.categories);

  // Ctrl/Cmd + K focuses the search field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { serviceItems, categoryItems } = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return { serviceItems: [], categoryItems: [] };

    const terms = query.split(/\s+/).filter(Boolean);
    const matchSvc = (s: Service) => {
      const hay = [s.name, s.shortDescription, s.tags.join(" "), s.technologies.join(" ")]
        .join(" ")
        .toLowerCase();
      return terms.every((t) => hay.includes(t));
    };
    const svc: SearchItem[] = services
      .filter((s) => s.status === "published")
      .filter(matchSvc)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.popularity - a.popularity)
      .slice(0, 5)
      .map((s) => ({
        key: `svc-${s.id}`,
        title: s.name,
        sub: deliveryLabel(s),
        href: `/marketplace/${s.slug}`,
        icon: s.icon,
        accent: s.accent,
      }));

    const cats: SearchItem[] = categories
      .filter((c) => c.status === "active")
      .filter((c) => terms.every((t) => c.name.toLowerCase().includes(t)))
      .slice(0, 3)
      .map((c) => ({
        key: `cat-${c.id}`,
        title: c.name,
        sub: "Solution division",
        href: `/category/${c.slug}`,
        icon: c.icon,
      }));

    return { serviceItems: svc, categoryItems: cats };
  }, [q, services, categories]);

  const flat = useMemo(
    () => [...serviceItems, ...categoryItems],
    [serviceItems, categoryItems]
  );
  const showPanel = open;
  const hasQuery = q.trim().length > 0;

  const go = (href: string) => {
    onOpenChange(false);
    inputRef.current?.blur();
    router.push(href);
  };

  const submit = () => {
    const query = q.trim();
    if (!query) return;
    go(`/search?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (flat.length ? (i + 1) % flat.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (flat.length ? (i - 1 + flat.length) % flat.length : -1));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && flat[activeIdx]) {
        e.preventDefault();
        go(flat[activeIdx].href);
      } else {
        submit();
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
      inputRef.current?.blur();
    }
  };

  const popularServices = useMemo(
    () =>
      [...services]
        .filter((s) => s.status === "published")
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 3)
        .map(
          (s): SearchItem => ({
            key: `pop-${s.id}`,
            title: s.name,
            sub: deliveryLabel(s),
            href: `/marketplace/${s.slug}`,
            icon: s.icon,
            accent: s.accent,
          })
        ),
    [services]
  );

  const row = (item: SearchItem, idx: number | null) => {
    const highlighted = idx !== null && idx === activeIdx;
    return (
      <button
        key={item.key}
        type="button"
        onMouseEnter={() => idx !== null && setActiveIdx(idx)}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => go(item.href)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
          highlighted ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
        )}
      >
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/10",
            item.accent ? `bg-gradient-to-br ${item.accent}` : "bg-blue-600/20"
          )}
        >
          <Icon name={item.icon ?? "Sparkles"} className="h-4 w-4 text-white/90" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-slate-100">{item.title}</span>
          <span className="block truncate text-[11px] text-slate-500">{item.sub}</span>
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />
      </button>
    );
  };

  return (
    <div className={cn("relative", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={cn(
          "relative z-50 flex h-11 items-center gap-2 rounded-full border bg-white/[0.05] pl-4 pr-1.5 transition-all duration-200",
          showPanel
            ? "border-amber-400/50 bg-white/[0.08] ring-2 ring-amber-400/20"
            : "border-white/10 hover:border-white/20"
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActiveIdx(-1);
          }}
          onFocus={() => onOpenChange(true)}
          onKeyDown={onKeyDown}
          placeholder="Search services, solutions, industries…"
          aria-label="Search the marketplace"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
        {q && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-brand-ink transition-colors hover:bg-amber-400"
        >
          <Search className="h-4 w-4" strokeWidth={2.4} />
        </button>
      </form>

      {/* ── Suggestions panel ── */}
      {showPanel && (
          <div
            role="listbox"
            aria-label="Search suggestions"
            data-search-panel
            onMouseDown={(e) => {
              // Dead-zone guard: a press on the panel's non-interactive areas
              // (headings, padding, text) closes the panel instead of doing
              // nothing. Presses on rows/links/trending chips are excluded so
              // they keep their click-through behavior.
              const el = e.target as Element;
              if (!el.closest("button") && !el.closest("a")) {
                onOpenChange(false);
                setActiveIdx(-1);
              }
            }}
            className="flyout-panel absolute inset-x-0 top-full z-50 mt-2 max-h-[440px] overflow-y-auto rounded-2xl border border-white/10 bg-brand-navy p-2 shadow-2xl shadow-black/60 ring-1 ring-white/[0.06]"
            style={
              isDesktop && stripShown
                ? { top: "calc(100% + 2.875rem)" } // clear the 46px strip band
                : undefined
            }
          >
            {!hasQuery && (
              <div className="p-1.5">
                <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Trending searches
                </p>
                <div className="flex flex-wrap gap-1.5 px-1 pb-2">
                  {TRENDING.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => go(`/search?q=${encodeURIComponent(t)}`)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <p className="px-2 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Popular services
                </p>
                {popularServices.map((s) => row(s, null))}

                <p className="px-2 pb-1.5 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Quick links
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {QUICK_LINKS.map((l) => (
                    <button
                      key={l.key}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => go(l.href)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-slate-300">
                        <Icon name={l.icon ?? "Sparkles"} className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-slate-200">{l.title}</span>
                        <span className="block truncate text-[10px] text-slate-500">{l.sub}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasQuery && flat.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-slate-200">No instant matches for “{q}”</p>
                <p className="mt-1 text-xs text-slate-500">
                  Press Enter for a full marketplace search.
                </p>
              </div>
            )}

            {hasQuery && serviceItems.length > 0 && (
              <div className="p-1.5">
                <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Services
                </p>
                {serviceItems.map((item, i) => row(item, i))}
              </div>
            )}

            {hasQuery && categoryItems.length > 0 && (
              <div className="p-1.5 pt-0.5">
                <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Categories
                </p>
                {categoryItems.map((item, i) => row(item, serviceItems.length + i))}
              </div>
            )}

            {hasQuery && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={submit}
                className="mt-1 flex w-full items-center justify-between border-t border-white/[0.06] px-4 py-3 text-[13px] font-semibold text-amber-400 transition-colors hover:bg-amber-400/[0.07]"
              >
                <span className="truncate">
                  See all results for “<span className="text-amber-300">{q.trim()}</span>”
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            )}
          </div>
      )}
    </div>
  );
}

// ============================================================
// MOBILE NAVIGATION
// ============================================================

function MobileNav({
  categories,
  subsByCategory,
  onNavigate,
}: {
  categories: Category[];
  subsByCategory: Record<string, Subcategory[]>;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();
  const [q, setQ] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    onNavigate();
  };

  const pageLinks: { label: string; href: string }[] = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Solutions", href: "/solutions" },
    { label: "Talent Solutions", href: "/talent-solutions" },
    { label: "Resources", href: "/resources" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div className="flex flex-col p-4">
      <form onSubmit={submitSearch} className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services, industries…"
          className="border-white/15 bg-white/5 pl-9 text-white placeholder:text-slate-500 focus-visible:ring-amber-400"
        />
      </form>

      <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Browse categories
      </p>
      <div className="mb-4 flex flex-col gap-0.5">
        {categories.map((cat) => {
          const subs = subsByCategory[cat.id] ?? [];
          const isOpen = expanded === cat.id;
          return (
            <div key={cat.id} className="rounded-lg bg-white/[0.02]">
              <div className="flex items-center">
                <Link
                  href={`/category/${cat.slug}`}
                  onClick={onNavigate}
                  className="flex min-w-0 flex-1 items-center gap-2.5 px-2.5 py-2.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/25 to-amber-500/10 ring-1 ring-white/10">
                    <Icon name={cat.icon} className="h-4 w-4 text-blue-300" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-100">{cat.name}</span>
                    <span className="block text-[10px] text-slate-500">{subs.length} subcategories</span>
                  </span>
                </Link>
                <button
                  aria-label={isOpen ? `Hide ${cat.name} subcategories` : `Show ${cat.name} subcategories`}
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : cat.id)}
                  className="mr-1.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white"
                >
                  <svg
                    className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              {isOpen && (
                <div className="mb-1.5 ml-[52px] flex flex-col border-l border-white/10 pl-2.5">
                  {subs.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/category/${cat.slug}/${sub.slug}`}
                      onClick={onNavigate}
                      className="truncate rounded-md px-2 py-1.5 text-[13px] text-slate-400 hover:text-white"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        Explore
      </p>
      <nav className="mb-4 flex flex-col" aria-label="Mobile navigation">
        {pageLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center justify-between rounded-lg px-2.5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/[0.05] hover:text-white"
          >
            {item.label}
            <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
          </Link>
        ))}
        <Link
          href="/admin"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-lg px-2.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/[0.05] hover:text-white"
        >
          Admin Platform
          <LayoutDashboard className="h-3.5 w-3.5 text-slate-600" />
        </Link>
      </nav>

      <MobileAccountSection onNavigate={onNavigate} />

      <div className="mt-5 border-t border-white/[0.07] pt-4">
        <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Appearance
        </p>
        <ThemeSegmented />
      </div>
    </div>
  );
}
