import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "Marketplace & Admin Access",
};

// ============================================================
// AUTH LAYOUT — a single centered column on a light gradient.
// The old two-pane brand panel was removed when the signup page
// was rewritten as a self-contained registration form. Both the
// registration and verify pages render inside this column on
// desktop and mobile.
// ============================================================
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-white to-slate-50 px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-8 flex w-full max-w-md items-center justify-center sm:max-w-xl lg:max-w-3xl">
        <Logo href="/" className="h-8 w-auto" priority />
      </header>
      <main className="w-full max-w-md sm:max-w-xl lg:max-w-3xl">{children}</main>
      <footer className="mt-10 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} STIOOS GLOBAL · Marketplace &amp; Admin Access
      </footer>
    </div>
  );
}
