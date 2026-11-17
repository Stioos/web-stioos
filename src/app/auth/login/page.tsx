"use client";

import { Suspense, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { resolveRedirect, type LoginRole } from "@/lib/auth";
import { pushWithRescue } from "@/lib/safe-nav";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
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
  Zap,
} from "lucide-react";

const REMEMBER_KEY = "stioos-remembered-email";

const emptySubscribe = () => () => {};

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const { toast } = useToast();

  const marketLogin = useAppStore((s) => s.marketLogin);
  const quickMarketLogin = useAppStore((s) => s.quickMarketLogin);
  const quickLogin = useAppStore((s) => s.quickLogin);

  // Remembered email is read via useSyncExternalStore: the server snapshot is
  // empty and the client value applies right after hydration — no effect
  // setState and no hydration mismatch.
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
  const [quickBusy, setQuickBusy] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const handleResetDemoData = () => {
    setResetting(true);
    try {
      // Wipe every persisted STIOOS blob on this device so the app
      // re-seeds from current code — recovers from stale sessions that
      // block the advertised demo logins.
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
      description: "Saved sessions cleared. Loading a fresh sign-in…",
    });
    setTimeout(() => window.location.reload(), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email address and password to continue.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const result = marketLogin(email, password);
    if (!result.ok) {
      const base = result.error ?? "Unable to sign in.";
      const hint = base.startsWith("No ")
        ? " Demo accounts: buyer@stioos.com (Buyer) or aarav@stioos.com (Super Admin) — password demo1234."
        : "";
      setError(base + hint);
      setSubmitting(false);
      return;
    }

    if (remember) {
      window.localStorage.setItem(REMEMBER_KEY, email.trim().toLowerCase());
    } else {
      window.localStorage.removeItem(REMEMBER_KEY);
    }

    const state = useAppStore.getState();
    const lower = email.trim().toLowerCase();
    const marketUser = state.users.find((u) => u.email.toLowerCase() === lower);
    const adminUser = state.admins.find((a) => a.email.toLowerCase() === lower);
    const name = marketUser?.name ?? adminUser?.name ?? "there";
    const role: LoginRole =
      result.role ?? (marketUser?.role as LoginRole | undefined) ?? "member";

    toast({
      title: `Welcome back, ${name}`,
      description:
        role === "buyer"
          ? "Opening your buyer workspace…"
          : "Opening your workspace…",
    });
    pushWithRescue(router, resolveRedirect(next, role));
  };

  const handleQuickMarketLogin = async (userId: string) => {
    setQuickBusy(userId);
    await new Promise((r) => setTimeout(r, 400));
    const result = quickMarketLogin(userId);
    if (!result.ok) {
      toast({
        title: "Demo account unavailable",
        description: "Could not sign in to this demo account. Please try again.",
        variant: "destructive",
      });
      setQuickBusy(null);
      return;
    }
    const user = useAppStore.getState().users.find((u) => u.id === userId);
    toast({
      title: `Welcome back, ${user?.name ?? "there"}`,
      description: `Signed in to your ${result.role ?? "marketplace"} workspace.`,
    });
    pushWithRescue(router, resolveRedirect(next, result.role));
  };

  const handleQuickAdminLogin = async () => {
    setQuickBusy("adm-001");
    await new Promise((r) => setTimeout(r, 400));
    const admin = useAppStore.getState().admins.find((a) => a.id === "adm-001");
    if (!admin) {
      toast({
        title: "Demo account unavailable",
        description: "Could not sign in to the admin demo. Please try again.",
        variant: "destructive",
      });
      setQuickBusy(null);
      return;
    }
    quickLogin(admin.id);
    toast({
      title: `Welcome back, ${admin.name}`,
      description: `Signed in as ${admin.title}.`,
    });
    pushWithRescue(router, resolveRedirect(next, "member"));
  };

  const quickBusyAny =
    quickBusy === "usr-mkt-buyer" ||
    quickBusy === "adm-001";

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <p className="text-sm font-semibold text-foreground">STIOOS GLOBAL</p>
        <p className="text-xs text-muted-foreground">Marketplace &amp; Admin Access</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold tracking-tight">
            Sign in to your workspace
          </CardTitle>
          <CardDescription>
            One door for buyers and platform admins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <Alert variant="destructive" role="alert">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="pl-9"
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(c) => setRememberPref(c === true)}
              />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                Remember me on this device
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick demo access */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Zap className="h-4 w-4 text-amber-500" />
            Quick demo access
          </CardTitle>
          <CardDescription className="text-xs">
            Skip the form and explore with a preconfigured role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={quickBusyAny}
            onClick={() => handleQuickMarketLogin("usr-mkt-buyer")}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-violet-600" />
              Buyer — Meera Krishnan
            </span>
            {quickBusy === "usr-mkt-buyer" ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
            disabled={quickBusyAny}
            onClick={handleQuickAdminLogin}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              Super Admin — Aarav Mehta
            </span>
            {quickBusy === "adm-001" ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Separator className="my-1" />
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Demo password: <span className="font-semibold text-foreground">demo1234</span> ·{" "}
            buyer@stioos.com / aarav@stioos.com
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground"
            disabled={resetting}
            onClick={handleResetDemoData}
          >
            {resetting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            Reset demo data
          </Button>
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            Trouble signing in? Resetting clears any stale saved session on this
            device and restores the demo accounts.
          </p>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        New to STIOOS?{" "}
        <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>

      <Link
        href="/"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to site
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
