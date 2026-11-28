import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { StoreHydration } from "@/components/store-hydration";
import { AuthProvider } from "@/providers/auth-provider";
import { AppWatchdog } from "@/components/system/app-watchdog";
import { ErrorRecovery } from "@/components/system/error-recovery";
import { getAppStamp } from "@/lib/app-stamp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "STIOOS GLOBAL — Intelligence That Builds What's Next",
    template: "%s | STIOOS GLOBAL",
  },
  description:
    "STIOOS GLOBAL is a premium AI, technology, programming, business intelligence, and enterprise solutions marketplace. Discover, compare, and deploy expert services that build what's next.",
  keywords: [
    "AI services",
    "AI agents",
    "automation",
    "technology marketplace",
    "business intelligence",
    "software development",
    "enterprise solutions",
    "STIOOS GLOBAL",
  ],
  icons: {
    icon: "/stioos-mark.png",
  },
  openGraph: {
    title: "STIOOS GLOBAL",
    description:
      "The intelligent marketplace for AI, technology, and enterprise solutions.",
    siteName: "STIOOS GLOBAL",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load-time fingerprint for the stale-tab watchdog (see
  // components/system/app-watchdog.tsx): if the server later reports a
  // different stamp, the tab hard-reloads itself instead of leaving the
  // user with dead header/login handlers after code changes.
  const appStamp = await getAppStamp();
  // HYDRATION GUARD — plain inline script, deliberately OUTSIDE React so
  // it runs even when React never hydrates (the failure mode where the
  // server HTML is on screen but every handler is dead, reading to the
  // user as "header options are not working"). When a click lands on a
  // page that never hydrated, it self-repairs: one budgeted reload, or a
  // visible manual-reload bar once the reload budget is spent. The flag
  // is flipped by ErrorRecovery.componentDidMount, which only runs when
  // React actually came up.
  const hydrationGuard = `(function(){
if (window.__STIOOS_HYDRATED_GUARD__) return; window.__STIOOS_HYDRATED_GUARD__ = true;
window.__STIOOS_HYDRATED__ = false;
var KEY = "stioos-watchdog-reloads";
function budget() {
  try {
    var log = JSON.parse(sessionStorage.getItem(KEY) || "[]");
    var now = Date.now();
    log = log.filter(function (t) { return now - t < 300000; });
    if (log.length >= 3) return false;
    log.push(now);
    sessionStorage.setItem(KEY, JSON.stringify(log));
    return true;
  } catch (e) { return true; }
}
function showBar() {
  if (document.getElementById("stioos-recovery-bar")) return;
  var bar = document.createElement("div");
  bar.id = "stioos-recovery-bar";
  bar.setAttribute("style", "position:fixed;left:0;right:0;bottom:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 14px;background:#0a1224;color:#e2e8f0;font:600 13px/1.4 system-ui,sans-serif;border-top:1px solid rgba(255,255,255,.12)");
  var msg = document.createElement("span");
  msg.textContent = "This page did not finish loading its interface.";
  var btn = document.createElement("button");
  btn.textContent = "Reload";
  btn.setAttribute("style", "background:#f59e0b;color:#0a1224;border:0;border-radius:8px;padding:8px 14px;font:700 13px system-ui,sans-serif;cursor:pointer");
  btn.addEventListener("click", function () { location.reload(); });
  bar.appendChild(msg); bar.appendChild(btn);
  document.body.appendChild(bar);
}
// Hydration guard removed — the ErrorRecovery boundary + AppWatchdog
// already handle stale tabs and crashes. The pointerdown listener was
// causing false positives on service detail pages where the static data
// import delays React hydration, showing "did not finish loading" when
// users clicked FAQ accordions and other interactive elements.
})();
`;
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script
          id="app-stamp"
          dangerouslySetInnerHTML={{
            __html: `window.__APP_STAMP__=${JSON.stringify(appStamp)};`,
          }}
        />
        <script
          id="stale-overlay-cleanup"
          dangerouslySetInnerHTML={{
            __html: "document.getElementById('stioos-recovery-bar')?.remove();",
          }}
        />
        <ThemeProvider
          attribute="data-theme"
          themes={["light", "dark", "system"]}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorRecovery>
            <AuthProvider>
              <StoreHydration />
              <AppWatchdog />
              {children}
              <Toaster />
            </AuthProvider>
          </ErrorRecovery>
        </ThemeProvider>
      </body>
    </html>
  );
}
