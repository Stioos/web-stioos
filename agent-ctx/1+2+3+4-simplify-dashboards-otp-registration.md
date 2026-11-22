# Task 1+2+3+4 — Simplify Dashboards + Redesign Registration with OTP Verification

Agent: fullstack-dev (Z.ai Code)
Task ID: **1+2+3+4**
Date: 2026-11-22

## Summary

Simplified both admin and buyer dashboards to a single "Overview" item,
redesigned the registration page as a self-contained modern form, and
added an OTP verification page that auto-logs the user in and routes to
the buyer dashboard.

## Files Changed

### Part 1 — Admin navigation (`src/lib/nav.ts`)
- Replaced `ADMIN_NAV` with a single "Overview" group containing only
  the Dashboard item (`/admin`, LayoutDashboard icon, `exact: true`).
- Removed Marketplace Management, Communication, System, and Profile
  groups. `visibleAdminNav()` still works — it just filters the now
  single-group array.

### Part 2 — Buyer navigation (`src/components/dashboard/dashboard-shell.tsx`)
- Replaced `BUYER_NAV` with a single Overview item pointing to
  `/dashboard/buyer`.
- Removed the now-unused icon imports (`ArrowLeftRight`, `ClipboardList`,
  `Heart`, `MessageSquare`, `Package`, `UserCog`, `Users`).
- All other shell functionality (topbar, mobile sheet, user dropdown,
  auto-login as demo buyer) is unchanged.

### Part 3 — Registration page (`src/app/auth/signup/page.tsx`)
Completely rewritten as a self-contained client component:
- White card on light gradient background (provided by the auth layout).
- Pill-shaped (fully rounded) inputs with light gray fills
  (`rounded-full bg-slate-100`).
- Left icons inside each field via a local `PillInput` primitive that
  accepts a `leadingIcon` prop (User, AtSign, Mail, Phone, Lock).
- Field layout (top to bottom):
  1. First Name (User icon) / Last Name — side by side.
  2. Username (AtSign icon, full width) + helper
     "Letters, numbers & underscores only".
  3. Email (Mail icon) / Phone No (Phone icon + country dial-code
     `<select>` + number input).
  4. Password (Lock icon, eye toggle) / Confirm Password (Lock icon,
     eye toggle, `aria-invalid` when mismatched).
  5. Info banner — light blue pill (sky-50/sky-200 ring).
  6. Agreement checkbox — teal-checked, links to Terms & Privacy.
  7. "Create Account" CTA — full-width pill, teal-to-blue gradient,
     right arrow icon.
- On submit: validates fields, calls `signUp()` from `useAppStore`,
  writes pending payload to `sessionStorage` under
  `stioos-signup-pending`, redirects to `/auth/verify`.
- The old `BuyerRegistrationForm` import and `RegistrationIntro`
  portal logic are removed entirely.

### Part 4 — OTP verification page (`src/app/auth/verify/page.tsx`)
New client component:
- Reads pending registration data from `sessionStorage` via
  `useSyncExternalStore` (SSR-safe, no setState-in-effect).
- Progress stepper (3 pill-shaped steps, top center):
  - `✓ ACCOUNT` — done state (orange text, orange ring).
  - `✓ DETAILS` — done state.
  - `🛡 VERIFY` — current state (teal→cyan gradient, white text).
- Heading "Verify your account." + subheading.
- Two side-by-side white `Card`s (stacked on mobile):
  - Email card: Mail icon, "Code sent to <masked email>",
    6 rounded-square OTP boxes, "Change email" link, resend timer.
  - Phone card: Phone icon, "Code sent to <masked phone>",
    6 OTP boxes, "Change phone" link, resend timer.
- OTP input behaviour:
  - 6 individual `<input maxLength={1} inputMode="numeric">` boxes.
  - Auto-advance on input, backspace moves to previous box (and clears
    it), arrow keys navigate, paste of a full code fills all boxes.
- Resend timer: 30-second countdown via `useCountdown` hook. When
  seconds reach 0, shows a "Resend code" link.
- Info banner: "Check your spam folder…SMS may take up to 30 seconds…".
- Submit button "Enter both codes to continue" — disabled until both
  6-digit codes are entered.
- On submit: simulates a network round-trip, finds the buyer matching
  the registered email (or falls back to `usr-mkt-buyer` / first user),
  calls `quickMarketLogin(match.id)`, clears sessionStorage, redirects
  to `/dashboard/buyer`.

### Part 5 — Auth layout (`src/app/auth/layout.tsx`)
- Removed the dark left brand panel, `surface-grid` background, value
  points list, and stats footer.
- Replaced with a single centered column on a soft gradient
  (`bg-gradient-to-b from-sky-50 via-white to-slate-50`).
- Logo header + minimal copyright footer.
- Children render inside a `max-w-md sm:max-w-xl lg:max-w-3xl`
  container — works on desktop and mobile.

## Lint & HTTP Verification

- `bun run lint` → **clean** (0 errors, 0 warnings).
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/signup` → **200**
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/verify` → **200**
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin` → **200**
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard/buyer` → **200**

## Design Notes

- Light theme throughout the auth flow (white cards, slate text,
  teal/cyan accents).
- Pill-shaped inputs and CTA button — fully rounded.
- Mobile-responsive: 2-column grids collapse to 1 column on small
  screens; OTP boxes use a `grid-cols-6` that scales down naturally.
- No loading screens or hydration guards — the verify page uses
  `useSyncExternalStore` so SSR is stable and the client snapshot
  applies right after hydration.

## Known Limitations

- The auth flow does not call a real verification API; both OTPs are
  accepted as long as they are 6 digits long. This is intentional for
  the demo — the page description says "auto-login the user via
  `quickMarketLogin`".
- The agreement checkbox links point to `/` because there are no
  dedicated Terms / Privacy pages in this project. A future agent can
  repoint them when those pages are added.
