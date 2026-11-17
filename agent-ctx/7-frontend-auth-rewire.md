# Task 7 — Rewire frontend CTA + auth surfaces to the real backend

**Agent:** frontend-auth-rewire (Next.js 16 App Router, TypeScript)
**Scope:** Replace the legacy `useAppStore` auth/lead/wishlist/request-create
calls in the public-facing CTA + auth surfaces with real API calls against
the Prisma+SQLite backend (cookie-based session, HTTP-only).

## What I read first (to understand existing behavior)
- `src/components/auth/buyer-registration-form.tsx` (two-track form, signUp/marketLogin from store)
- `src/components/auth/login-drawer.tsx` (sheet with email/pw, demo buttons, "create-and-continue")
- `src/app/auth/login/page.tsx` (mirror of the drawer logic)
- `src/app/auth/signup/page.tsx` (uses BuyerRegistrationForm, redirects to /dashboard/buyer)
- `src/app/auth/layout.tsx` (brand-panel layout, `auth-left-top-slot` portal target)
- `src/components/shared/lead-modal.tsx` (two-step funnel: BuyerRegistrationForm → lead form, addInquiry)
- `src/components/marketplace/service-card.tsx` (heart button via store wishlist)
- `src/components/layout/public-header.tsx` (AccountButton/MobileAccountSection via store)
- `src/lib/auth.ts` (`resolveRedirect` helper — kept as-is)
- `src/lib/store.ts` (legacy store — only read the relevant selectors)
- `src/app/dashboard/buyer/talent-services/page.tsx` (TalentServiceDialog → addMarketRequest)
- `src/app/dashboard/buyer/requests/page.tsx` (NewRequestDialog → addMarketRequest; reads still from store)
- API routes: `auth/me`, `auth/signup`, `auth/login`, `auth/logout`, `wishlist`, `inquiries`, `requests`, `settings`
- `src/lib/auth-server.ts` (BuyerDTO/AdminDTO shapes; `signUpBuyer` error string "already exists")

## Files CREATED

### `src/hooks/use-current-user.tsx` ("use client")
- `<CurrentUserProvider>` — wraps the app, fetches `GET /api/auth/me` once on
  mount, exposes `{ loading, user, admin, kind, isAuthenticated, refresh }`
  via React Context.
- `kind` is `"buyer" | "admin" | null`. `user` is the buyer DTO; `admin` is
  the admin DTO. `loading` is true until the first fetch resolves.
- `refresh()` re-fetches `/api/auth/me` (used after login/logout/signup);
  coalesces concurrent refresh calls via an `AbortController` ref so
  login + redirect doesn't double-fire.
- Re-fetches on `visibilitychange` / `pageshow` — covers cross-tab sign-in/out.
- `useCurrentUser()` — the consumer hook; returns a safe default
  (`loading: true, kind: null, ...`) if used outside the provider.
- `signOutCurrent()` — `POST /api/auth/logout` (then the caller calls
  `refresh()` and redirects). Exported as a standalone helper.
- Uses `.tsx` (not `.ts`) because the provider returns JSX.

### `src/hooks/use-wishlist.ts` ("use client")
- `useWishlist()` → `{ slugs, has(slug), toggle(slug), loading, enabled }`.
- Fetches `GET /api/wishlist` once `useCurrentUser().kind === "buyer"`
  (i.e. `enabled === true`). Stays empty for guests.
- `toggle(slug)` POSTs `{ serviceSlug: slug }`, optimistically flips the
  slug in/out of `slugs`, reconciles with the server's `{ saved }` answer,
  reverts on network/error. Returns the new saved state or `null` when
  not authenticated.
- `loading = sessionLoading || pending` (where `pending` flips during a
  toggle — set from an async callback, never synchronously inside an
  effect, so it satisfies the `react-hooks/set-state-in-effect` rule).

## Files MODIFIED

### `src/app/layout.tsx`
- Added `import { CurrentUserProvider } from "@/hooks/use-current-user";`
- Wrapped `<StoreHydration />`, `<AppWatchdog />`, `{children}`, `<Toaster />`
  inside `<CurrentUserProvider>` (kept inside `<ErrorRecovery>` /
  `<ThemeProvider>`).

### `src/components/auth/buyer-registration-form.tsx`
- Removed `useAppStore` import; now imports `useCurrentUser` from
  `@/hooks/use-current-user` for `refresh()`.
- `handleSubmit` is now `async`: builds the payload from the captured
  fields (name, email, password, registrationType, company, country,
  phone, phoneCountry, accountType, profession, companySize, intent,
  intentTimeline, registrationSource) and POSTs to `/api/auth/signup`.
- On `{ ok, user }` → `await refresh()`, toast the welcome, call
  `onRegistered({ user, existing: false })`.
- On a 400 whose error message contains "already exists" (or "in use") →
  fall back to `POST /api/auth/login` with the entered email/password;
  on `{ ok, role:"buyer", user }` → `await refresh()`, toast "Welcome back",
  `onRegistered({ user, existing: true })`. Otherwise surface the "account
  already exists" form error.
- On other errors → `setFormError(errMsg || "Unable to create your account.")`.
- On network failure → "Network error — please try again."
- The two-track (Professional/Company) form UI, `variant` ("page"|"modal"),
  `source` prop, validation, password-strength meter, dial-code selector
  and all copy are unchanged.

### `src/components/auth/login-drawer.tsx`
- Removed `useAppStore` import (and `marketLogin`, `quickMarketLogin`,
  `quickLogin`, `signUp`, `currentUser`, `currentAdmin` selectors).
- Now imports `useCurrentUser` and `signOutCurrent` from
  `@/hooks/use-current-user`.
- `DrawerBody` reads `{ user, admin, kind, refresh }` from `useCurrentUser()`.
- `handleSubmit`: `POST /api/auth/login` with `{ email, password }`. On
  `{ ok, role:"buyer" }` → `refresh()` then `finishSignIn("buyer", name)`
  which calls `pushWithRescue(router, resolveRedirect(null, "buyer"))`
  (defaults to `/dashboard/buyer`). On `{ ok, role:"admin" }` →
  `refresh()` then `finishSignIn("member", name)` → `/admin`. On error →
  shows the error; if it starts with "no " (e.g. "No account found with
  this email."), the existing "Create buyer account with this email &
  continue" button reveals (now using a case-insensitive match — the
  API's message is "No account found with this email.").
- "Create account & continue" recovery path now POSTs `/api/auth/signup`
  with `{ name (derived from local-part), email, password }`, then on
  success `refresh()` + `finishSignIn("buyer", name)`.
- Quick demo buttons now hit `/api/auth/login` directly:
  - Buyer → `{ email: "buyer@stioos.com", password: "demo1234" }`
  - Super Admin → `{ email: "aarav@stioos.com", password: "demo1234" }`
- "Already signed in" panel reads `kind`/`user`/`admin`; "Sign out" calls
  `signOutCurrent()` + `refresh()` (with a spinner state). The "Go to
  dashboard" button uses `resolveRedirect(null, role)` like before.
- All UI, Tailwind classes, copy and the `useLoginDrawer` global store are
  unchanged.

### `src/app/auth/login/page.tsx`
- Same rewire as the drawer: removed `useAppStore` import; `useCurrentUser`
  from `@/hooks/use-current-user` for `refresh()`.
- `handleSubmit` POSTs `/api/auth/login`; on success refresh + redirect via
  `pushWithRescue(router, resolveRedirect(next, role))`.
- Quick demo buttons POST `/api/auth/login` with the demo creds above.
- "Reset demo data" stays as-is (just clears localStorage).
- All Card-based layout, copy and form fields unchanged.

### `src/app/auth/signup/page.tsx`
- No code change needed — it already delegates to `BuyerRegistrationForm`
  (now rewired) and redirects to `/dashboard/buyer` on success via
  `onRegistered`. Verified by re-reading.

### `src/components/shared/lead-modal.tsx`
- Removed `useAppStore`/`useCurrentUser` (from store) imports; now uses
  `useCurrentUser` from `@/hooks/use-current-user` and `useEffect` (added
  to the import list).
- The buyer-capture gate's `requireRegistration` flag is now fetched once
  per mount from `GET /api/settings` (public) — reads
  `data.marketplace.requireLeadRegistration`. Defaults to `true` until the
  fetch resolves so the funnel keeps capturing serious buyers even if the
  fetch is slow.
- The `currentUser` check uses the new hook's `user` (null when not signed
  in as a buyer).
- `handleSubmit` is now `async`: POSTs `/api/inquiries` with
  `{ name, email, company, phone, type, serviceName: context, requirements,
  budgetRange, timeline }`. On `{ ok, inquiry: { id, reference } }` →
  shows `data.inquiry.reference` in the success panel (falls back to
  `inquiry.id.toUpperCase()` if `reference` is missing). On error → toast
  "Could not send your request" + the API error message; on network error
  → toast "Network error". Both keep the dialog open so the visitor can retry.
- Two-step UX preserved: step 1 (BuyerRegistrationForm, rewired) → step 2
  (lead form, prefilled from the new/existing buyer). `handleRegistered`
  reads `user.name/email/company/phone` from the BuyerRegistrationResult.
- `useLeadModal` (openModal/closeModal) and `<LeadModalProvider />` left
  untouched.

### `src/components/marketplace/service-card.tsx`
- Removed `useAppStore`/`useCurrentUser` (from store) imports; added
  `useCurrentUser` and `useWishlist` from `@/hooks/*`.
- The heart button reads `wishlist.has(service.slug)`; on click:
  - Not authenticated (or wishlist disabled) → toast "Sign in to save
    services" with a `<ToastAction>` that opens the LoginDrawer (unchanged).
  - Authenticated → `await wishlist.toggle(service.slug)` (optimistic
    update happens inside the hook) and toast the outcome.
- The 3 lead CTA buttons (Get a Quote / Request / Consult) are unchanged —
  they still call `useLeadModal.getState().openModal(type, service.name)`,
  and the LeadModal is now rewired above.
- Card layout, accent tile, tags, delivery badge, footer buttons — all
  unchanged. `memo()` preserved. (The `onRequest` prop was already
  declared-but-unused in the legacy code — left as-is to avoid breaking
  call sites that pass it.)

### `src/components/layout/public-header.tsx`
- Removed `useCurrentUser` from the `@/lib/store` import; added
  `import { useCurrentUser, signOutCurrent } from "@/hooks/use-current-user";`.
  The rest of the file still uses `useAppStore` for category/subcategory/
  service reads (untouched — those will be rewired by Task 6).
- `AccountButton`: now reads `{ user, admin, kind, isAuthenticated, refresh }`.
  - When `!isAuthenticated` → renders the amber "Login" button (opens
    LoginDrawer) — unchanged.
  - When authenticated → shows initials (from `user.name` or `admin.name`),
    a dropdown with "Dashboard" → `/dashboard/buyer` (buyer) or `/admin`
    (admin), "Marketplace" → `/marketplace`, and "Sign out" which calls
    `signOutCurrent()` + `refresh()` + `router.push("/")`.
- `MobileAccountSection`: same rewire; "Go to dashboard" links to
  `/dashboard/buyer` (buyer) or `/admin` (admin); "Sign out" calls the
  API + refresh + navigate.
- All other header logic (mega menu, strip menu, search, theme toggle)
  unchanged.

### `src/app/dashboard/buyer/talent-services/page.tsx`
- Removed `useAppStore` import (this page only used it for
  `addMarketRequest` — no reads). Added `useRouter` from
  `next/navigation`.
- `TalentServiceDialog` submit handler now POSTs `/api/requests` with
  `{ categoryId:"cat-talent", categoryName:"Talent Solutions",
  kind: def.kind, title, details, budgetRange, timeline, meta }`.
  On `{ ok, request: { reference } }` → toast with the reference, reset,
  close dialog, `router.refresh()`. On error → destructive toast.
- The `OfferingCard` UI, kind-icon mapping, budget/timeline options, the
  page-level `RequireRole role="buyer"` + `DashboardShell` wrapper are
  unchanged.

### `src/app/dashboard/buyer/requests/page.tsx`
- Added `useRouter` import. Removed only the `addMarketRequest` selector
  from `useAppStore`; the page still uses `useAppStore` for `categories`
  and `requests` reads, and `useCurrentUser` from `@/lib/store` for the
  `user.id` filter — **Task 6 will rewire those reads**. Per the spec,
  I only rewired the submit handler of `NewRequestDialog`.
- `handleSubmit` now POSTs `/api/requests` with
  `{ categoryId, categoryName, title, details, budgetRange, timeline }`
  (no `kind` — defaults to `"service"` server-side). On
  `{ ok, request: { reference } }` → toast with the reference, close,
  reset, `onCreated()` (which bumps the local refreshKey), `router.refresh()`.
  On error → destructive toast.
- All read paths, tabs, status steppers, activity timelines, and styling
  are unchanged.

## Demo login credentials wired
- Buyer demo: `buyer@stioos.com` / `demo1234` (in both the LoginDrawer and
  the `/auth/login` page quick-access buttons).
- Super Admin demo: `aarav@stioos.com` / `demo1234` (same two surfaces).
- The "Reset demo data" buttons still just wipe `stioos-*` / `jobsonn-*`
  localStorage keys (the real session is in the HTTP-only cookie, which
  the logout button now clears via `/api/auth/logout`).

## Judgment calls
1. **`use-current-user.tsx` not `.ts`.** The provider returns JSX
   (`<CurrentUserContext.Provider>...</CurrentUserContext.Provider>`), so
   it must be `.tsx` or the TypeScript parser fails with ">' expected".
   Imports resolve either way (`@/hooks/use-current-user`).
2. **Coalesced `refresh()`.** Login → `refresh()` → `pushWithRescue()` is a
   3-step chain across the drawer, the form, the page, and the demo
   buttons. Concurrent `refresh()` calls (e.g. one started by an
   in-flight login and another by a visibilitychange listener) would
   double-fetch. Used an `AbortController` ref + promise-coalesce so only
   one in-flight `/api/auth/me` request happens at a time.
3. **Lead-modal `requireLeadRegistration` source.** The spec said "when
   `requireLeadRegistration` is on". The legacy store had this as a
   marketplace setting; the real backend exposes it via `GET /api/settings`
   → `data.marketplace.requireLeadRegistration`. Fetched once per modal
   mount, defaulting to `true` (the legacy default) until the response
   arrives — keeps the buyer-capture funnel safe even on a slow fetch.
4. **Lead-modal "create account & continue" recovery path.** Kept the
   existing UX: when the visitor's email is unknown and they enter a
   password ≥ 8 chars, show the "Create buyer account with this email &
   continue" button. It now POSTs `/api/auth/signup` with a name derived
   from the email's local-part (the legacy behavior) — on success it
   signs them in (the signup route sets the cookie) and finishes the
   sign-in flow. No fallback to `/api/auth/login` here because if the
   email doesn't exist, there's nothing to log in to.
5. **`useWishlist.loading` shape.** The lint rule
   `react-hooks/set-state-in-effect` rejects a synchronous
   `setLoading(true)` at the top of an effect. Restructured so the GET
   fetch doesn't need an in-flight boolean (the consumer treats an empty
   `slugs` list as "no saved services yet" — which is correct). The
   `loading` flag now means "session resolving OR a toggle is in flight"
   (`sessionLoading || pending`), set only from async callbacks.
6. **Public-header dashHome for admins.** The legacy code sent non-buyers
   to `/dashboard` (a generic catchall). The new code sends admins to
   `/admin` (their actual workspace per `resolveRedirect`). Buyers still
   go to `/dashboard/buyer`.
7. **Service-card `onRequest` prop.** Declared in the interface and
   destructured but never referenced in the body — this was already the
   case in the legacy code. Left it untouched to avoid breaking any
   external call sites that pass it.
8. **BuyerRegistrationResult.user type.** Kept as `PlatformUser`
   (`@/types`) — the server's `BuyerDTO` is shape-compatible for every
   field the consumers actually read (`name`, `email`, `company`,
   `phone`). Cast through a union type in the fetch response handling;
   no runtime impact.
9. **Did NOT touch** `src/components/dashboard/messages-view.tsx` /
   `profile-view.tsx` / dashboard request **reads** / wishlist page
   reads — those are Task 6's scope. Only rewired the request-submit
   handlers in `talent-services/page.tsx` and `requests/page.tsx`, and
   left the `router.refresh()` after a successful create so the page
   re-reads (even though it still reads from the store for now).
10. **Did NOT delete `src/lib/store.ts`** — many unrewired pages still
    import it.

## Final checks
- `cd /home/z/my-project && bun run lint` — passes with zero errors and
  zero warnings (output: `$ eslint .` with no findings).
- `tail -20 /home/z/my-project/dev.log` — clean. No errors, no exceptions,
  no warnings about any of the rewired files. The expected 401s on
  `/api/orders`, `/api/notifications`, `/api/activity`, `/api/wishlist`,
  `/api/requests`, `/api/inquiries` (for an unsigned-in visitor) appear,
  and `/api/auth/me` returns 200 (the session fetch working).
