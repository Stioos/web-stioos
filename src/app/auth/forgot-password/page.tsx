"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Mail, Send } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Enter the email address associated with your admin account.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setError("That does not look like a valid email address. Check the format and try again.");
      return;
    }
    setError(null);
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSentTo(value);
  };

  if (sentTo) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-600/20">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </span>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Check your inbox</h2>
            <p className="text-sm text-muted-foreground">
              Reset link sent to <span className="font-semibold text-foreground">{sentTo}</span>.
              The link expires in 30 minutes.
            </p>
            <p className="text-xs text-muted-foreground">
              Note: this is a demo environment — no email is actually delivered. Use the demo
              password <span className="font-semibold text-foreground">demo1234</span> to sign in.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-2 w-full">
            <Link href="/auth/login">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold tracking-tight">Reset your password</CardTitle>
        <CardDescription>
          Enter your admin email and we will send a secure link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@stioos.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="pl-9"
                aria-invalid={!!error}
                disabled={submitting}
              />
            </div>
            {error && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending reset link…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send reset link
              </>
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
