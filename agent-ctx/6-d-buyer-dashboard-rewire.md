# Task 6 (Subagent D) — Buyer dashboard rewire to Prisma + API

**Agent:** buyer-dashboard-rewire (Next.js 16 App Router, TypeScript, STIOOS marketplace)
**Scope:** Rewire all 7 buyer dashboard pages + the dashboard router away
from the legacy `useAppStore` Zustand store, onto the real Prisma+SQLite
backend via server-side queries (reads) and `/api/*` route handlers
(mutations). The legacy `src/lib/store.ts` was left intact for the pages
out of scope (categories, branding, marketplace, etc.).

## Architecture pattern applied to every buyer page

`/dashboard/buyer/layout.tsx` (NEW server component, runs once for every
buyer page):
1. `const session = await getCurrentSession();`
2. `session === null` → `redirect("/auth/login?next=/dashboard/buyer")`.
3. `session.kind === "admin"` → `redirect("/admin")` (cross-role
   redirect to the admin's own workspace).
4. Otherwise render `<DashboardShell buyer={session.user}>{children}</DashboardShell>`.

Each buyer `page.tsx` is now a thin async server component:
1. `const buyer = await getCurrentBuyer();` — defensive fallback that
   redirects to `/auth/login?next=<page-path>` if the session vanished
   between the layout and the page (rare).
2. Reads data via named functions from `@/lib/api/queries`.
3. Renders a `<XView>` client component that receives data as props.

The `XView` client components:
- Receive data as props (no `useAppStore` / `useCurrentUser` from store).
- Mutations go through `fetch("/api/...", { method, body, credentials: "same-origin" })`.
- On success: toast (`@/hooks/use-toast`) + `router.refresh()` so the
  server query re-runs and the new state is reflected.
- On failure: `data.error` extracted from the JSON response, surfaced as
  a destructive toast.
- Existing UI/UX (Tailwind classes, shadcn components, copy, layout) is
  preserved verbatim — only the data source changed.

## Files CREATED

- `src/app/api/profile/route.ts` — `PATCH /api/profile` for buyer
  self-update. Requires a buyer session (`getCurrentBuyer()`; 401 if
  none). Accepts a sparse body `{ name?, company?, phone?, country? }`
  and updates ONLY those fields on the authenticated buyer's own record
  via `db.user.update({ where:{id:buyer.id}, data })`. Email, password,
  role, status, etc. cannot be changed here. `logActivity({ actor:
  buyer.name, action:"updated", module:"Profile", target:buyer.id,
  description:"Updated profile details." })` fires after the update.
  Returns `ok({ ok:true, user: toBuyerDTO(updated) })`. Mirrors the
  style of `src/app/api/orders/[id]/route.ts` (uses `parseBody`,
  `badRequest`, `unauthorized`, `ok`, `logActivity` from
  `@/lib/api/helpers`). `export const dynamic = "force-dynamic";`.

- `src/app/dashboard/buyer/layout.tsx` — server-side guard for the
  entire `/dashboard/buyer/*` subtree. Calls `getCurrentSession()`:
  no session → redirect to login; admin → redirect to `/admin`; buyer
  → wrap children in `<DashboardShell buyer={session.user}>`. This
  means every buyer page can be a pure server component that fetches
  its own data and renders a `<XView>` client component — no repeated
  auth check or shell wrap per page (matches the Subagent C admin
  pattern in `/app/admin/layout.tsx`).

- `src/components/dashboard/buyer-overview-view.tsx` — `BuyerOverviewView`.
  Receives `{ buyer, overview, orders, requests, featured }`. Renders
  the 4 stat cards (Active orders / Completed / Open requests / Saved
  services) from `overview`, the Talent Services quick action card, the
  Active-orders list + My-requests list (sliced from the server-provided
  arrays), and the Featured recommendations grid (`<ServiceCard>` for
  each).

- `src/components/dashboard/buyer-orders-view.tsx` — `BuyerOrdersView`.
  Receives `{ orders }`. Status tabs (All/In progress/Delivered/
  Completed/Cancelled) with per-tab counts. "Accept delivery" on a
  `delivered` order → `PATCH /api/orders/[id] { status:"completed" }` →
  toast + `router.refresh()`. "Dispute" stays a destructive toast
  (support notified out-of-band). Per-row `busyId` disables the action
  button while the request is in flight.

- `src/components/dashboard/buyer-requests-view.tsx` —
  `BuyerRequestsView`. Receives `{ requests, categories }`. Status tabs
  (All/Open/In review/In progress/Fulfilled/Closed) with counts.
  Preserves the entire legacy UI: `RequestCard`, `RequestStepper`
  (4-step pipeline), `RequestEndState` (rejected/closed chip),
  `RequestActivity` (expandable `statusHistory` timeline), `MetaChip`.
  The `NewRequestDialog` accepts `categories` as a prop (instead of
  reading from the store) and POSTs `/api/requests` with
  `{ categoryId, categoryName, title, details, budgetRange, timeline }`.
  On `{ ok, request:{ reference } }` → toast with the reference + close
  + reset + `router.refresh()`.

- `src/components/dashboard/buyer-wishlist-view.tsx` —
  `BuyerWishlistView`. Receives `{ services }` (the saved Service
  rows resolved by the server). Renders the grid of `<ServiceCard>` —
  the heart button on each card already toggles via `useWishlist`
  (Task 7 wired it), so the grid reflects toggle changes immediately
  and re-fetches via `router.refresh()` after a navigation.

- `src/components/dashboard/talent-services-view.tsx` —
  `TalentServicesView`. Self-contained client component (no props —
  the 5 offerings come from the static `TALENT_REQUEST_KINDS` catalog,
  so no server reads). Preserves the entire legacy UI: `OfferingCard`,
  `TalentServiceDialog` with kind-specific fields, budget/timeline
  selectors. The dialog POSTs `/api/requests` with
  `{ categoryId:"cat-talent", categoryName:"Talent Solutions",
  kind:def.kind, title, details, budgetRange, timeline, meta }` and
  calls `router.refresh()` on success.

## Files MODIFIED

- `src/app/dashboard/page.tsx` — converted to an async server
  component. `const session = await getCurrentSession();` → admin →
  `redirect("/admin")`; buyer → `redirect("/dashboard/buyer")`;
  no session → `redirect("/auth/login?next=/dashboard")`. Renders
  `<DashboardSkeleton />` after each `redirect()` so the type checker is
  satisfied (the redirect throws during render so the skeleton is never
  committed).

- `src/components/dashboard/dashboard-shell.tsx` — rewritten as a
  presentational shell that takes `buyer: BuyerDTO` as a prop. Removed
  `useAppStore` / `useCurrentUser` (from store) / `useHydrated`
  imports. The buyer is now server-resolved by the layout (no hydration
  guard, no client-side auth redirect). Logout now: `await
  signOutCurrent()` (from `@/hooks/use-current-user`) → `await refresh()`
  → `router.push("/")` so the public header / `CurrentUserProvider`
  cache reflects the signed-out state. Added a Profile deep-link to the
  account dropdown. The page title (topbar breadcrumb) is derived from
  the pathname via the `BUYER_NAV` list, so the shell can be rendered
  once by the layout without each page passing a `title` prop. Mobile
  sheet nav, desktop sidebar, theme toggle, "Marketplace" link,
  account dropdown, public footer — all preserved.

- `src/components/dashboard/require-role.tsx` — simplified.
  `RequireRole` is now a thin presentational wrapper that just renders
  its children (`<>{children}</>`) — auth gating for the buyer
  dashboard is enforced server-side by the buyer layout. The
  `DashboardSkeleton` export is kept (used by the dashboard router
  page). The `StalledHydrationNotice` reset button now wipes
  `stioos-*` / `jobsonn-*` localStorage keys directly (no longer calls
  `purgePersistedDemoState` / `useAppStore.persist.rehydrate`).

- `src/components/dashboard/messages-view.tsx` — rewritten as a
  presentational client component. Receives `{ threads, buyerId }` as
  props (instead of reading `useAppStore` / `useCurrentUser`).
  Preserves the two-pane chat UI (thread list + messages + composer).
  "Send" → `POST /api/threads/[id]/messages { body }` → on success
  `router.refresh()` so the server's authoritative copy lands.
  Optimistic append: a local `pending` array holds in-flight messages;
  the `visibleMessages` memo merges them with the thread's server
  messages, **filtering out any pending entry whose `body+sentAt` now
  matches a server message** (so once `router.refresh()` commits, the
  optimistic copy is dropped from the visible list — no effect-based
  cleanup, satisfying the `react-hooks/set-state-in-effect` lint rule).
  On error the pending entry is reverted and a destructive toast shows.
  Composer disables + shows a spinner while sending.

- `src/components/dashboard/profile-view.tsx` — rewritten as a
  presentational client component. Receives `{ user, stats }` as props
  (instead of reading `useAppStore` / `useCurrentUser` / calling
  `updateMarketProfile`). The `user` is the full `User` row from
  `getUserById(buyer.id)` (server-resolved). The `stats` object
  `{ orders, threads, wishlist }` is computed server-side from
  `listBuyerOrders(buyer.id).length`, `listBuyerThreads(buyer.id).length`,
  and `getBuyerWishlist(buyer.id).length`. Save → `PATCH /api/profile`
  with `{ name, company, phone, country }` → on success: toast +
  `router.refresh()` so the server-side name resolves into the
  DashboardShell sidebar/topbar. On error: form-level error message.
  All identity card / form / stats UI preserved.

- `src/app/dashboard/buyer/page.tsx` — async server component. Reads
  `getBuyerOverview(buyer.id)`, `listBuyerOrders(buyer.id)`,
  `listBuyerRequests(buyer.id)`, `listServicesRaw({ featured:true,
  status:"published", limit:6 })` in parallel → passes to
  `<BuyerOverviewView>`.

- `src/app/dashboard/buyer/orders/page.tsx` — async server component.
  Reads `listBuyerOrders(buyer.id)` → `<BuyerOrdersView>`.

- `src/app/dashboard/buyer/requests/page.tsx` — async server component.
  Reads `listBuyerRequests(buyer.id)` + `listCategories()` in parallel →
  `<BuyerRequestsView>`.

- `src/app/dashboard/buyer/messages/page.tsx` — async server component.
  Reads `listBuyerThreads(buyer.id)` → `<MessagesView threads={threads}
  buyerId={buyer.id} />`.

- `src/app/dashboard/buyer/wishlist/page.tsx` — async server component.
  Reads `getBuyerWishlist(buyer.id)` → `<BuyerWishlistView services={...} />`.

- `src/app/dashboard/buyer/profile/page.tsx` — async server component.
  Reads `getUserById(buyer.id)`, `listBuyerOrders(buyer.id)`,
  `listBuyerThreads(buyer.id)`, `getBuyerWishlist(buyer.id)` in parallel
  → `<ProfileView user={user} stats={{...}} />`.

- `src/app/dashboard/buyer/talent-services/page.tsx` — async server
  component. No reads (the 5 offerings are static). Renders
  `<TalentServicesView />`. (The dialog submit was already rewired by
  Task 7 to POST `/api/requests`; this rewire moved the client content
  out of the page file into a dedicated view component and removed the
  `RequireRole` + `DashboardShell` wrap — the layout handles both.)

## Files NOT modified (out of scope per task brief)

- `src/lib/store.ts` — left intact (the unrewired pages — categories,
  branding, marketplace, navigation, content, etc. — still need it).
- API routes (other than creating `/api/profile/route.ts`), Prisma
  schema, `db.ts`, `auth-server.ts`, `api/helpers.ts`, `api/queries.ts`
  — consumed but not modified.
- Admin dashboard files (`src/app/admin/*`,
  `src/components/admin/*`, `src/components/layout/admin-shell.tsx`) —
  owned by Subagent C.
- Public surfaces (`public-header.tsx`, `service-card.tsx`,
  `lead-modal.tsx`, `login-drawer.tsx`, `buyer-registration-form.tsx`)
  — owned by Task 7. They already use `useCurrentUser` / `useWishlist`
  from `@/hooks/*`, which my dashboard pages consume too.

## Verification

- `cd /home/z/my-project && bun run lint` → **0 errors, 0 warnings**
  (`$ eslint .` with no findings).
- Smoke test (logged in as `buyer@stioos.com` / `demo1234`):
  - `GET /dashboard` → 307 (redirect to `/dashboard/buyer`).
  - `GET /dashboard/buyer` → 200.
  - `GET /dashboard/buyer/orders` → 200.
  - `GET /dashboard/buyer/requests` → 200.
  - `GET /dashboard/buyer/messages` → 200.
  - `GET /dashboard/buyer/wishlist` → 200.
  - `GET /dashboard/buyer/profile` → 200.
  - `GET /dashboard/buyer/talent-services` → 200.
- Cross-role + unauth:
  - Unauth `GET /dashboard/buyer/*` → 307 to
    `/auth/login?next=/dashboard/buyer`.
  - Unauth `GET /dashboard` → 307 to `/auth/login?next=/dashboard`.
  - Admin session `GET /dashboard` → 307 to `/admin`.
  - Admin session `GET /dashboard/buyer` → 307 to `/admin`.
- Mutations:
  - `PATCH /api/profile` (auth) → 200 with updated user DTO.
  - `PATCH /api/profile` (unauth) → 401.
  - `PATCH /api/profile` (empty name) → 400 "Your name cannot be empty."
  - `POST /api/threads/{id}/messages` → 200 with `{ id, sentAt }`.
  - `PATCH /api/orders/mo-011 { status:"completed" }` → 200 with
    `{ order:{ id, status:"completed" } }` (buyer accepted delivery).
  - `POST /api/wishlist { serviceSlug }` → 200 with `{ ok, saved }`.
- `tail -120 /home/z/my-project/dev.log` shows every buyer page
  rendering 200 and every mutation returning 200 with no `Error:` /
  `⨯` markers in my files. (The admin `admin-charts` module-not-found
  error in the log is Subagent C's `src/components/admin/admin-overview-view.tsx`
  issue — outside my scope.)

## Judgment calls

1. **Layout-based shell + guard, not per-page.** The task spec said
   "buyer pages' `page.tsx` server components call `getCurrentBuyer()`
   and redirect if missing" OR "replace `<RequireRole>` usage with the
   server-side guard in each page.tsx — choose whichever is cleanest."
   I chose the cleanest option: a single `dashboard/buyer/layout.tsx`
   that runs `getCurrentSession()` once for every buyer page, handles
   the admin cross-role redirect, and wraps children in
   `<DashboardShell buyer={...}>`. This mirrors the Subagent C admin
   pattern (`/app/admin/layout.tsx` + `AdminShell`). Each page.tsx
   still has a defensive `getCurrentBuyer()` check (in case the session
   expired between layout and page render) that redirects with the
   page-specific `next` param.

2. **Generic `next=/dashboard/buyer` for unauth layout redirect.** When
   an unauth visitor hits `/dashboard/buyer/orders`, the layout
   redirects to `/auth/login?next=/dashboard/buyer` (the overview, not
   the specific sub-page). After login the buyer lands on the overview
   rather than the exact page they tried to open. This matches the
   admin pattern exactly (`redirect("/auth/login?next=/admin")`). The
   small UX deviation (one extra click) is acceptable for consistency
   and avoids the layout having to derive the pathname (which it
   doesn't have direct access to in App Router server components).

3. **`RequireRole` kept as a thin wrapper.** Auth gating is now
   server-side in the layout, so `RequireRole` is technically unused by
   the buyer pages. Kept it (and `DashboardSkeleton`) as exports so any
   out-of-scope code that imports them keeps working without throwing.

4. **Messages optimistic-append cleanup without an effect.** The
   `react-hooks/set-state-in-effect` lint rule rejects a synchronous
   `setState` inside an effect. I implemented the optimistic message
   cleanup as a derivation instead: the `visibleMessages` memo merges
   `thread.messages` (server) with the local `pending` array, filtering
   out any pending entry whose `body+sentAt` matches a server message.
   Once `router.refresh()` delivers the server's authoritative copy,
   the pending entry is automatically dropped from the visible list —
   no effect, no cascading render.

5. **`DashboardShell` logout uses `signOutCurrent()` + `refresh()`.**
   Matches the public-header pattern (`@/hooks/use-current-user`). The
   `CurrentUserProvider` cache is invalidated immediately so the public
   header's account button switches to "Login" before the hard
   navigation to `/` lands.

6. **Page title derived from pathname in the shell.** The shell is now
   rendered once by the layout (not per-page), so it doesn't receive a
   `title` prop. Instead, `titleFromPathname(pathname)` looks up the
   current path in the `BUYER_NAV` list and returns the matching label
   for the topbar breadcrumb. A safe default ("Dashboard") handles any
   future buyer sub-page that isn't in the nav.

7. **`talent-services` view is a no-prop client component.** The 5
   talent offerings come from the static `TALENT_REQUEST_KINDS` catalog
   (`@/lib/request-kinds`), so the view has no server reads. The page
   just renders `<TalentServicesView />` and the layout handles auth +
   shell. The dialog's `POST /api/requests` + `router.refresh()` was
   already wired by Task 7; I preserved that behavior verbatim.

8. **`ProfileView` uses the `User` type, not `BuyerDTO`.** The page
   fetches the full `User` row via `getUserById(buyer.id)` (the queries
   mapper returns the same fields the legacy store's `currentUser`
   exposed, including `createdAt`/`lastActive` as ISO strings). The
   `BuyerDTO` from `getCurrentBuyer()` is shape-compatible but doesn't
   include all the `User` registration fields. Using `User` keeps the
   identity card + form initialization identical to the legacy code.

## Demo buyer login

`buyer@stioos.com` / `demo1234` — confirmed working via
`POST /api/auth/login` → `{ ok:true, role:"buyer", user:{...} }`. The
session cookie then unlocks all `/dashboard/buyer/*` routes. Without it,
the server layout issues a 307 redirect to
`/auth/login?next=/dashboard/buyer`. An admin session
(`aarav@stioos.com`) hitting `/dashboard/buyer/*` is redirected to
`/admin`.
