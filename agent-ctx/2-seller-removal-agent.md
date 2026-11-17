# Task 2 — Remove seller role; keep Buyer + Super Admin; admin Orders module; super admin hardening

## Summary
Repositioned JOBSONN INTELLIGENCE to a no-sellers model: all services are fulfilled by JOBSONN's own delivery teams. Roles are now `buyer` / `member` (+ platform admins). Added an admin-facing Orders module and hardened the super admin session against stale localStorage.

## Files changed
- `src/types/index.ts` — `User.role` → `"buyer" | "member"`; removed `User.headline`; removed `sellerId`/`sellerName` from `MarketOrder`; `MarketMessage.senderRole` → `"buyer" | "team"`; `MarketThread.sellerId/sellerName` → `teamId/teamName`; deleted `SellerPayout` + `EarningsMonth`; added `"orders"` to `ModuleKey` (after `"featured"`); section comment updated.
- `src/data/marketplace-activity.ts` — rewrote: removed seller users (`usr-mkt-seller`, `usr-mkt-ana`); `order()` factory dropped seller params (12 orders kept intact); 3 threads now use `teamId: "team-jobsonn"` / `teamName: "JOBSONN Delivery Team"` with team messages sent as "Vikram Shah · Delivery Lead" (senderRole `"team"`); buyer messages address "Hi team —"; deleted `SELLER_PAYOUTS` + `SELLER_EARNINGS_SERIES`.
- `src/lib/store.ts` — `signUp` role → `"buyer"` (headline line removed); `marketLogin`/`quickMarketLogin` return `"buyer" | "member"`; `sendMarketMessage` senderRole → `"buyer" | "team"`; `updateMarketOrderStatus` activity text no longer mentions seller; `addMarketRequest` → "published to our delivery teams"; `updateMarketProfile` patch drops `"headline"`; `SEED_AUTHORITATIVE_KEYS` += `"admins"`, `"roles"`; `merge()` now nulls `currentAdminId`/`currentUserId` when the id does not resolve in merged data; persist key bumped to `jobsonn-intelligence-v12`; `addRole` fallback module list includes `orders`.
- `src/lib/nav.ts` — added `{ label: "Orders", href: "/admin/orders", icon: "Package", module: "orders" }` between Featured Services and Marketplace Requests. (PackageCheck is NOT in `src/components/shared/icon.tsx` mapping → used `Package` per fallback instruction.)
- `src/data/people.ts` — `perm()` module list + super-admin matrix include `"orders"`; role-admin/orders `["view","edit"]`, marketplace-manager `["view","edit","manage"]`, service-manager `["view","edit"]` so the Orders nav item permission-gates cleanly for staff roles.
- `src/app/admin/permissions/page.tsx`, `src/app/admin/roles/page.tsx` — added `{ key: "orders", label: "Orders" }` to the MODULES UI lists.

## Files created
- `src/app/admin/orders/page.tsx` — admin Orders module: PageHeader, status filter chips (Total/Pending/In progress/Delivered/Completed/Cancelled) synced with a status Select in the DataTable toolbar, read-only Revenue chip (sum of non-cancelled amounts via `formatMoney`), DataTable columns (icon square + service name + mono id / buyer + company / amount / type / StatusBadge / placed date), row-actions DropdownMenu to set all five statuses via `updateMarketOrderStatus` + toast. Local `useState` only (no `useSearchParams`, no Suspense needed). Matches existing admin chip/table conventions.

## Files deleted
- `src/app/dashboard/seller/` (entire directory: page, services, orders, earnings, requests, messages, profile).

## Files updated (dashboard + copy)
- `src/components/dashboard/dashboard-shell.tsx` — deleted `SELLER_NAV`; `role: "buyer"`; workspaceLabel constant "Buyer workspace"; removed dead seller conditionals and unused lucide imports (Inbox/Wallet).
- `src/components/dashboard/require-role.tsx` — `role: "buyer"`; cross-role redirect always to `/dashboard/buyer`.
- `src/app/dashboard/page.tsx` — signed-in users always go to `/dashboard/buyer`.
- `src/components/dashboard/messages-view.tsx` — buyer-only; filters `t.buyerId === user.id`; counterpart `thread.teamName`; copy: "Conversations with our delivery teams live here." / "Message our team from any service page…".
- `src/components/dashboard/profile-view.tsx` — buyer-only; removed headline state/textarea/display + seller branches; stats label "Orders placed"; badge shows actual `user.role`.
- `src/app/dashboard/buyer/orders/page.tsx` — "Fulfilled by the JOBSONN delivery team"; hints: pending "Confirming your order", in_progress "Our delivery team is building your order".
- `src/app/dashboard/buyer/page.tsx` — same hints; "In flight with delivery teams"; order row subtitle `{formatMoney} · {hint}`; "Briefs published to our expert teams".
- `src/app/dashboard/buyer/requests/page.tsx` — all four seller copy strings rewritten to expert-teams voice.
- `src/app/auth/login/page.tsx` — deleted Seller quick-access button + handler branch; `LoginRole` → `"buyer" | "member"`; `resolveRedirect` seller fallback/cases removed (non-buyer fallback `/admin`); toast seller branch removed; CardDescription "One door for buyers and platform admins."; demo hint shows buyer@jobsonn.com / aarav@jobsonn.com; `quickBusyAny` drops seller id; unused `Briefcase` import removed.
- `src/app/auth/layout.tsx` — value point → "Track orders, messages, and your wishlist in a single workspace built for buyers."; hero copy → "buyers, teams, and platform admins sign in through the same door."
- `src/app/auth/signup/page.tsx` — comment now reads "All services are fulfilled by JOBSONN delivery teams."
- `src/components/layout/public-header.tsx` — account menu `dashHome` simplified (buyer → `/dashboard/buyer`, else `/dashboard`) in both desktop and mobile; comment updated to (buyer / member).

## Kept (business copy, per spec)
- `src/data/services.ts` lines 613 / 789 ("make every seller perform like your best one", "reseller agreements").
- `src/data/pages/worksonn-pages.ts` lines 2039/2041 ("reseller channels" comparison block).

## Verification
- `bunx tsc --noEmit`: zero errors under `src/` (only pre-existing examples/scripts/skills errors remain).
- `bun run lint`: 0 errors; 2 pre-existing warnings in `src/app/(public)/category/[slug]/page.tsx` (untouched).
- `grep -rin "seller" src/`: only the 4 acceptable business-copy lines above.
- curl 200: `/admin/orders`, `/dashboard/buyer`, `/admin`, `/auth/login`, `/auth/signup`, `/dashboard`, `/admin/users`, `/admin/roles`, `/admin/permissions`, `/admin/marketplace`, `/admin/marketplace-requests`.
- `dev.log`: one transient hydration warning during the hot-reload of the login page edit (stale HTML mid-refresh), no errors after reload; zero 500s.
- Did not modify: layout.tsx, logo.tsx, public/*, globals.css, theme files, Caddyfile. Did not run db/build commands or restart the dev server.
