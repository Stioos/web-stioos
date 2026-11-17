"use client";

import { useSyncExternalStore, useState } from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const subscribeNoop = () => () => {};

/** Lint-safe hydration guard — false during SSR + first client render. */
function useIsMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun, hint: "Bright surfaces" },
  { value: "dark", label: "Dark", icon: Moon, hint: "Signature enterprise ink" },
  { value: "system", label: "System", icon: Monitor, hint: "Match your device" },
] as const;

function ModeIcon({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();
  if (!mounted) return <Sun className={className} aria-hidden="true" />;
  if (resolvedTheme === "light") return <Sun className={className} aria-hidden="true" />;
  if (resolvedTheme === "system") return <Monitor className={className} aria-hidden="true" />;
  return <Moon className={className} aria-hidden="true" />;
}

/**
 * Desktop theme switcher — dropdown with Light / Dark / System options.
 * Placed in the header action cluster. Supports controlled `open` so the
 * header can drive hover-to-open behavior (portal={false} keeps the panel
 * inline so header-level hover-intent stays alive over the panel).
 */
export function ThemeToggle({
  className,
  open: openProp,
  onOpenChange,
}: {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = openProp ?? uncontrolledOpen;
  const setOpen = (o: boolean) => {
    setUncontrolledOpen(o);
    onOpenChange?.(o);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger
        aria-label="Change color theme"
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40",
          className
        )}
      >
        <ModeIcon className="h-[18px] w-[18px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent portal={false} align="end" sideOffset={8} className="w-52">
        <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Appearance
        </DropdownMenuLabel>
        {THEME_OPTIONS.map((opt) => {
          const active = mounted && theme === opt.value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className="gap-2.5"
            >
              <opt.icon className={cn("h-4 w-4", active ? "text-amber-500" : "text-muted-foreground")} />
              <span className="flex-1">
                <span className="block text-sm font-medium">{opt.label}</span>
                <span className="block text-[11px] text-muted-foreground">{opt.hint}</span>
              </span>
              {active && <Check className="h-4 w-4 text-amber-500" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Mobile theme switcher — segmented Light / Dark / System control
 * used inside the mobile navigation drawer.
 */
export function ThemeSegmented() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="grid grid-cols-3 gap-1.5"
    >
      {THEME_OPTIONS.map((opt) => {
        const active = mounted && theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40",
              active
                ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
            )}
          >
            <opt.icon className="h-[18px] w-[18px]" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
