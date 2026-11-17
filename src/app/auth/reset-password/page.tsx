"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  KeyRound,
  Loader2,
  X,
} from "lucide-react";

type Rule = { label: string; test: (v: string) => boolean };

const RULES: Rule[] = [
  { label: "At least 10 characters", test: (v) => v.length >= 10 },
  { label: "Contains 1 uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Contains 1 number", test: (v) => /[0-9]/.test(v) },
  { label: "Contains 1 symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function ResetPasswordContent() {
  // ?token= read via useSearchParams (page is Suspense-wrapped below)
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const ruleResults = useMemo(() => RULES.map((r) => ({ ...r, pass: r.test(password) })), [password]);
  const allRulesPass = ruleResults.every((r) => r.pass);
  const matches = password.length > 0 && password === confirm;

  const truncatedToken = token ? (token.length > 16 ? `${token.slice(0, 16)}…` : token) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRulesPass || !matches) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setDone(true);
  };

  if (done) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-600/20">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </span>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Password updated</h2>
            <p className="text-sm text-muted-foreground">
              Your new password is active. Demo note: credentials are mocked, so use{" "}
              <span className="font-semibold text-foreground">demo1234</span> when signing in.
            </p>
          </div>
          <Button asChild className="mt-2 w-full">
            <Link href="/auth/login">
              <ArrowLeft className="h-4 w-4" />
              Continue to login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold tracking-tight">Set a new password</CardTitle>
        <CardDescription>
          Choose a strong password. It must meet all four requirements below.
        </CardDescription>
        {truncatedToken ? (
          <div className="pt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Reset token:</span>
            <Badge variant="outline" className="font-mono text-[11px] font-normal">
              {truncatedToken}
            </Badge>
          </div>
        ) : (
          <Alert className="mt-2 border-amber-500/40 bg-amber-50/60">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-xs text-amber-800">
              No reset token detected in the URL — continuing in demo mode. In production this page
              requires a valid token.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="new-password">New password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="pl-9"
                aria-invalid={confirm.length > 0 && !matches}
                disabled={submitting}
              />
            </div>
            {confirm.length > 0 && !matches && (
              <p className="text-xs font-medium text-destructive">Passwords do not match.</p>
            )}
          </div>

          {/* Live rules checklist */}
          <ul className="space-y-1.5 rounded-lg border bg-muted/40 p-3" aria-label="Password requirements">
            {ruleResults.map((rule) => (
              <li key={rule.label} className="flex items-center gap-2 text-xs">
                {rule.pass ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
                ) : (
                  <X className="h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={2.5} />
                )}
                <span className={rule.pass ? "font-medium text-emerald-700" : "text-muted-foreground"}>
                  {rule.label}
                </span>
              </li>
            ))}
          </ul>

          <Button type="submit" className="w-full" disabled={submitting || !allRulesPass || !matches}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating password…
              </>
            ) : (
              "Update password"
            )}
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/auth/login">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
