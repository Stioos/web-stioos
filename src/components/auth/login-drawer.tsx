"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { create } from "zustand";
import { resolveRedirect, type LoginRole } from "@/lib/auth";
import { pushWithRescue } from "@/lib/safe-nav";
import { useCurrentUser, signOutCurrent } from "@/hooks/use-current-user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
  Zap,
} from "lucide-react";

// ============================================================
// GLOBAL DRAWER STATE — any component on any public page can
// open the same-page sign-in panel:
//   useLoginDrawer.getState().openDrawer()
// ============================================================

interface LoginDrawerState {
  open: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

// Fast-Refresh-safe singleton: when the dev server hot-reloads this
// module, create() would otherwise produce a NEW store instance while
// already-mounted components (the LoginDrawer in the header, Login
// buttons across pages) still hold the OLD instance — so clicking
// Login updates the new store but the drawer reads the old one and
// never opens. Persisting the store on globalThis guarantees every
// module re-evaluation reuses the same instance, so the button and
// the drawer always share state.
function createLoginDrawerStore() {
  return create<LoginDrawerState>()((set) => ({
    open: false,
    openDrawer: () => set({ open: true }),
    closeDrawer: () => set({ open: false }),
  }));
}

const g = globalThis as unknown as { __stioosLoginDrawer?: ReturnType<typeof createLoginDrawerStore> };
export const useLoginDrawer =
  g.__stioosLoginDrawer ?? (g.__stioosLoginDrawer = createLoginDrawerStore());

const REMEMBER_KEY = "stioos-remembered-email";
const emptySubscribe = () => () => {};

// ============================================================
// LOGIN DRAWER — JOBSONN-style right-side portal sign-in panel.
// Opens over the current page; no navigation required.
// ============================================================

export function LoginDrawer() {
  const open = useLoginDrawer((s) => s.open);
  const closeDrawer = useLoginDrawer((s) => s.closeDrawer);

  return (
    <Sheet open={open} onOpenChange={(o) => (!o ? closeDrawer() : undefined)}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto border-white/10 bg-background p-0 sm:max-w-[520px]"
      >
        <DrawerBody onDone={closeDrawer} />
      </SheetContent>
    </Sheet>
  );
}

function DrawerBody({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, admin, kind, refresh } = useCurrentUser();

  // Remembered email — read after hydration without setState.
  const rememberedEmail = useSyncExternalStore(
    emptySubscribe,
    () => window.localStorage.getItem(REMEMBER_KEY) ?? "",
    () => ""
  );

  const [emailInput, setEmailInput] = useState<string | null>(null);
  const email = emailInput ?? rememberedEmail;
  const [rememberPref, setRememberPref] = useState<boolean | null>(null);
  const remember = rememberPref ?? rememberedEmail !== "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [quickBusy, setQuickBusy] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // NOTE: the Sheet unmounts its content on close, so this body remounts
  // fresh on every open — no state reset effects needed.

  const finishSignIn = (role: LoginRole, name: string, next?: string | null) => {
    toast({
      title: `Welcome back, ${name}`,
      description:
        role === "buyer"
          ? "Opening your buyer workspace…"
          : "Opening your workspace…",
    });
    onDone();
    pushWithRescue(router, resolveRedirect(next ?? null, role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email address and password to continue.");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok: true; role: "buyer" | "admin"; user?: { name: string }; admin?: { name: string } }
        | { ok?: false; error?: string };

      if (res.ok && data.ok && data.role) {
        if (remember) {
          window.localStorage.setItem(REMEMBER_KEY, email.trim().toLowerCase());
        } else {
          window.localStorage.removeItem(REMEMBER_KEY);
        }
        await refresh();
        const name = data.role === "buyer" ? data.user?.name ?? "there" : data.admin?.name ?? "there";
        finishSignIn(data.role as LoginRole, name);
        return;
      }

      const base = data.error ?? "Unable to sign in.";
      const hint = base.toLowerCase().startsWith("no ")
        ? " Demo accounts: buyer@stioos.com (Buyer) or aarav@stioos.com (Super Admin) — password demo1234."
        : "";
      setError(base + hint);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Recovery path — earlier iterations of the demo wiped saved accounts;
  // let a visitor whose email is unknown create the account instantly and
  // continue, without leaving the page.
  const handleCreateAccountAndSignIn = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter the email and a password (min 8 characters) first.");
      return;
    }
    if (password.length < 8) {
      setError("Choose a password with at least 8 characters to create the account.");
      return;
    }
    setCreating(true);
    try {
      const localPart = email.trim().split("@")[0] ?? "there";
      const name = localPart
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim() || "New User";
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ name, email: email.trim(), password }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok: true; user: { name: string } }
        | { ok?: false; error?: string };
      if (res.ok && data.ok && data.user) {
        await refresh();
        finishSignIn("buyer", data.user.name || name);
        return;
      }
      setError(data.error ?? "Could not create the account.");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleQuickBuyerLogin = async () => {
    setQuickBusy("usr-mkt-buyer");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: "buyer@stioos.com", password: "demo1234" }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok: true; role: "buyer" | "admin"; user?: { name: string } }
        | { ok?: false; error?: string };
      if (res.ok && data.ok && data.role === "buyer") {
        await refresh();
        finishSignIn("buyer", data.user?.name ?? "there");
        return;
      }
      toast({
        title: "Demo account unavailable",
        description: data.error ?? "Could not sign in to this demo account. Please try again.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Demo account unavailable",
        description: "Could not sign in to this demo account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setQuickBusy(null);
    }
  };

  const handleQuickAdminLogin = async () => {
    setQuickBusy("adm-001");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: "aarav@stioos.com", password: "demo1234" }),
      });
      const data = (await res.json().catch(() => ({}))) as
        | { ok: true; role: "buyer" | "admin"; admin?: { name: string } }
        | { ok?: false; error?: string };
      if (res.ok && data.ok && data.role === "admin") {
        await refresh();
        finishSignIn("member", data.admin?.name ?? "there");
        return;
      }
      toast({
        title: "Demo account unavailable",
        description: data.error ?? "Could not sign in to the admin demo. Please try again.",
        variant: "destructive",
      });
    } catch {
      toast({
        title: "Demo account unavailable",
        description: "Could not sign in to the admin demo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setQuickBusy(null);
    }
  };

  const handleResetDemoData = () => {
    setResetting(true);
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("stioos-") || key.startsWith("jobsonn-"))) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // storage unavailable — nothing to clean
    }
    toast({
      title: "Demo data reset",
      description: "Saved sessions cleared. Loading a fresh page…",
    });
    setTimeout(() => window.location.reload(), 400);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOutCurrent();
    await refresh();
    setSigningOut(false);
    toast({ title: "Signed out", description: "Your session has ended." });
  };

  // ── Already signed in → session panel instead of the form. ──
  if (kind === "buyer" || kind === "admin") {
    const who = kind === "buyer" ? user : admin;
    const initials = (who?.name ?? "?")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("");
    return (
      <div className="flex min-h-full flex-col px-6 py-8">
        <div className="flex items-center gap-2">
          <Image
            src="/stioos-mark.png"
            alt="STIOOS GLOBAL"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md"
          />
          <span className="text-sm font-bold tracking-wide text-foreground">STIOOS</span>
          <span className="ml-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
            PORTAL SIGN IN
          </span>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-sm flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
            {initials}
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            You&apos;re signed in
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {who?.name} · {who?.email}
          </p>
          <p className="mt-0.5 text-xs capitalize text-muted-foreground">
            {kind === "buyer" ? `${user?.role ?? "buyer"} workspace` : "Super Admin workspace"}
          </p>

          <Button
            className="mt-8 h-12 w-full rounded-xl text-base font-semibold"
            onClick={() => {
              onDone();
              pushWithRescue(
                router,
                kind === "buyer"
                  ? resolveRedirect(null, (user?.role as LoginRole) ?? "buyer")
                  : resolveRedirect(null, "member")
              );
            }}
          >
            Go to dashboard <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="mt-3 h-11 w-full rounded-xl"
            disabled={signingOut}
            onClick={handleSignOut}
          >
            {signingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Sign out of this device
          </Button>
          <button
            type="button"
            onClick={onDone}
            className="mt-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to browsing
          </button>
        </div>
      </div>
    );
  }

  // ── Signed out → the sign-in form. ──
  return (
    <div className="flex min-h-full flex-col px-6 py-8">
      <div className="flex items-center gap-2">
        <Image
          src="/stioos-mark.png"
          alt="STIOOS GLOBAL"
          width={32}
          height={32}
          className="h-8 w-8 rounded-md"
        />
        <span className="text-sm font-bold tracking-wide text-foreground">STIOOS</span>
        <span className="ml-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
          PORTAL SIGN IN
        </span>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <SheetTitle asChild>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
        </SheetTitle>
        <SheetDescription className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Sign in to manage your orders, service requests, and wishlist — right
          here, without leaving the page.
        </SheetDescription>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="drawer-email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="drawer-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email id"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              className="h-12 rounded-xl pl-10"
              disabled={submitting || creating}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="drawer-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="drawer-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl pl-10 pr-11"
              disabled={submitting || creating}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="drawer-remember"
              checked={remember}
              onCheckedChange={(c) => setRememberPref(c === true)}
            />
            <Label
              htmlFor="drawer-remember"
              className="text-sm font-normal text-muted-foreground"
            >
              Keep me signed in
            </Label>
          </div>
          <Link
            href="/auth/forgot-password"
            onClick={onDone}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-base font-semibold"
          disabled={submitting || creating}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Sign in to STIOOS <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {!submitting &&
          error &&
          error.toLowerCase().startsWith("no ") &&
          !creating && (
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl border-dashed"
            disabled={creating}
            onClick={handleCreateAccountAndSignIn}
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating…
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" /> Create buyer account with this
                email &amp; continue
              </>
            )}
          </Button>
        )}
      </form>

      <div className="mt-7 border-t pt-6">
        <p className="text-center text-sm text-muted-foreground">
          New to STIOOS?{" "}
          <Link
            href="/auth/signup"
            onClick={onDone}
            className="font-semibold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-4">
          <p className="mb-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> One-click demo access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-center rounded-xl"
              disabled={quickBusy !== null}
              onClick={handleQuickBuyerLogin}
            >
              {quickBusy === "usr-mkt-buyer" ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <ShoppingBag className="h-4 w-4 text-violet-600" />
              )}
              Buyer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-center rounded-xl"
              disabled={quickBusy !== null}
              onClick={handleQuickAdminLogin}
            >
              {quickBusy === "adm-001" ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-amber-600" />
              )}
              Super Admin
            </Button>
          </div>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            Demo password <span className="font-semibold text-foreground">demo1234</span>{" "}
            · buyer@stioos.com / aarav@stioos.com
          </p>
          <button
            type="button"
            onClick={handleResetDemoData}
            disabled={resetting}
            className="mx-auto mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
          >
            {resetting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RotateCcw className="h-3 w-3" />
            )}
            Reset demo data
          </button>
        </div>
      </div>
    </div>
  );
}
