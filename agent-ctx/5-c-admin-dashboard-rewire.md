# Task 5 (Subagent C) — Super Admin dashboard rewire to Prisma + API

**Agent:** admin-dashboard-rewire (Next.js 16 App Router, TypeScript, STIOOS marketplace)
**Scope:** Rewire the Super Admin dashboard pages listed in the task brief away
from the legacy `useAppStore` Zustand store, onto the real Prisma+SQLite
backend via server-side queries (reads) and /api/* route handlers (mutations).
The legacy `src/lib/store.ts` was left intact for the pages out of scope.

## Architecture pattern applied to every page

`page.tsx` → async server component:
1. `const admin = await getCurrentAdmin();` — if null, `redirect("/auth/login?next=<path>")`.
2. Reads data via named functions from `@/lib/api/queries`.
3. Passes the data (+ admin DTO when needed) to a `<XView>` client component.

`src/components/admin/<page>-view.tsx` → `"use client"`:
- Receives data as props.
- Mutations go through `fetch("/api/...", { method, body, credentials: "same-origin" })`.
- On success: toast (via `@/hooks/use-toast`) + `router.refresh()` so the
  server query re-runs and the new state is reflected.
- On failure: `data.error` extracted from the JSON response, surfaced as a
  destructive toast. A `busyId`/`pending` flag disables the row's action
  button while the request is in flight.
- Existing UI/UX (Tailwind classes, shadcn components, copy, layout) is
  preserved verbatim — only the data source changed.

## Files CREATED (new `*-view.tsx` client components)

- `src/components/admin/admin-overview-view.tsx` — `AdminOverview` view.
  Receives `{ admin, overview, recentInquiries, recentServices,
  recentActivity, chartData, categoryData }`. Renders the 8 stat cards
  (`DashStat`), the lazy-loaded `AdminCharts` chunk (recharts), the three
  recent lists (inquiries / services / activity), and the Quick Actions grid.
- `src/components/admin/services-view.tsx` — `AdminServicesView`. Row actions:
  `PATCH /api/services/[id]/status`, `POST /api/services/[id]/featured`
  (toggle), `POST /api/services/[id]/duplicate`, `DELETE /api/services/[id]`
  (confirm dialog), Edit → `/admin/services/[id]`. Filter chips
  (status/category/featured) re-query client-side from the prop list.
- `src/components/admin/service-requests-view.tsx` — `ServiceRequestsView`.
  Two tabs:
  - **Pipeline tab** → `requests` prop, kind/status filter selects, DataTable,
    per-row View → opens a `RequestDetailSheet` with the buyer card, kind +
    budget + timeline chips, `StructuredDetails` (renders `meta` using
    `REQUEST_KIND_DEFS`), `TrackingTimeline` (statusHistory), and
    `RequestActions` (status update + convert-to-order).
    - Status update: `PATCH /api/requests/[id] { status, note }`.
    - Convert to order: `POST /api/requests/[id]/convert { amount, note? }`
      → on success, toast "Order created" + `router.refresh()`. When the
      request already has `orderId`, the actions panel is replaced with a
      "Fulfilled" card linking to `/admin/orders`.
  - **Website Enquiries tab** → filters the `inquiries` prop down to
    `{ service_request, quote, consultation }` types, DataTable, per-row
    status select + detail Sheet. Status update:
    `PATCH /api/inquiries/[id] { status }`.
- `src/components/admin/orders-view.tsx` — `AdminOrdersView`. Stat-chip
  filters + revenue chip (sum of non-cancelled amounts). Status update:
  `PATCH /api/orders/[id] { status }` from a per-row dropdown.
- `src/components/admin/inquiries-view.tsx` — `AdminInquiriesView`. Type
  tabs, status chips, `InquiryDetailSheet` (from the rewired
  `inquiry-detail.tsx`). Status update:
  `PATCH /api/inquiries/[id] { status }`. Delete:
  `DELETE /api/inquiries/[id]` (confirm dialog).
- `src/components/admin/users-view.tsx` — `AdminUsersView`. Data table with
  bulk select, status/country filters, detail Sheet, create/edit Sheet.
  - Create: `POST /api/users`.
  - Update: `PATCH /api/users/[id]`.
  - Status: `PATCH /api/users/[id] { status }` (single + bulk).
  - Delete: `DELETE /api/users/[id]` (single + bulk confirm).
  - `?new=1` opens the Add sheet; `?focus={id}` opens the detail Sheet.
- `src/components/admin/admins-view.tsx` — `AdminAdminsView`. Roster table,
  detail Sheet (role + permissions matrix popover), create/edit Sheet with
  role select + active Switch.
  - Create: `POST /api/admins` (emits an `admin_created` notification
    server-side, so the bell count updates on next load).
  - Update: `PATCH /api/admins/[id]`.
  - Status: `PATCH /api/admins/[id] { status }`.
  - Delete: `DELETE /api/admins/[id]` (confirm).
- `src/components/admin/notifications-view.tsx` — `AdminNotificationsView`.
  Type filter chips, mark-read (`PATCH /api/notifications/[id] { read: true }`),
  mark-all (`POST /api/notifications/read-all`), delete
  (`DELETE /api/notifications/[id]`, confirm). "Mark unread" stays local
  (the API only supports `read: true`) via an `unreadOverrides` map merged
  over server state for display.
- `src/components/admin/activity-view.tsx` — `AdminActivityView`. Module /
  action / date-range filters (client-side). CSV export (Blob + download
  link, same as before).

## Files MODIFIED

- `src/app/admin/layout.tsx` — converted to async server component.
  `const admin = await getCurrentAdmin();` → if null,
  `redirect("/auth/login?next=/admin")`. Otherwise resolves the admin's
  `RoleDTO` (via `listRoles().find(r => r.id === admin.roleId)`) and the
  `BrandSettings` (via `getSetting("brand")`, with a fallback default if
  the settings row isn't seeded). Passes `admin`, `role`, `brand` as props
  to `<AdminShell>`.
- `src/components/layout/admin-shell.tsx` — rewritten as a presentational
  shell that takes `admin`, `role`, `brand` as props (no more `useAppStore`
  selectors, no hydration guard, no client-side auth redirect).
  - SidebarNav reads `role` + `admin` from a React Context
    (`AdminContext`) provided by the shell — no prop-drilling through
    every level.
  - **Notification bell:** client-side fetch of `GET /api/notifications`
    on mount + when the popover opens. Mark read →
    `PATCH /api/notifications/[id] { read: true }`. Mark all →
    `POST /api/notifications/read-all`. "View all" link surfaces the full
    Notification Center page. Uses the `.then()`-callback pattern for
    fetches (mirroring `src/hooks/use-wishlist.ts`) so the
    `react-hooks/set-state-in-effect` rule is satisfied.
  - **⌘K search palette:** lazy-fetches `GET /api/services?limit=50`,
    `/api/requests`, `/api/orders`, `/api/users`, `/api/inquiries` the first
    time the palette opens (Promise.all + `.then()`), builds 5 buckets,
    filters client-side. The active index resets in the input `onChange`
    handler (not in an effect — avoids the same lint rule).
  - **Logout:** `POST /api/auth/logout` then `router.push("/auth/login?next=/admin")`.
  - **Brand footer copy:** `brand.siteName` from the prop (server-resolved).
  - Account dropdown, theme toggle, "View Site" link, collapse button,
    mobile Sheet nav — all preserved from the previous implementation.
- `src/app/admin/page.tsx` — async server component. Calls
  `getCurrentAdmin()` + `getAdminOverview()` + `listInquiries()` (sliced to
  5) + `listServicesRaw({ sort: "newest", limit: 5 })` + `listAllRequests()`
  + `listCategories()` + `listActivity(6)` + an extra `listServicesRaw({})`
  for the category distribution. Computes the 12-week chart series and the
  category distribution server-side (copies the bucketing logic from
  `src/app/api/bootstrap/route.ts`). Passes everything to `<AdminOverview>`.
- `src/app/admin/services/page.tsx` — server component. Reads
  `listServicesRaw({})`, `listCategories()`, `listSubcategories()` →
  `<AdminServicesView>`.
- `src/app/admin/services/new/page.tsx` — server component. Reads
  `listCategories()`, `listSubcategories()` → renders the PageHeader +
  `<ServiceForm mode="create" categories={...} subcategories={...} />`.
- `src/app/admin/services/[id]/page.tsx` — server component. Awaits
  `params.id`, reads `getServiceById(id)`, `listCategories()`,
  `listSubcategories()` in parallel. If the service is missing, renders an
  `EmptyState` with a "Back to Services" link. Otherwise renders the
  PageHeader + `<ServiceForm mode="edit" initial={service} categories={...} subcategories={...} />`.
- `src/app/admin/service-requests/page.tsx` — server component. Reads
  `listAllRequests()` + `listInquiries()` (full list — the Website
  Enquiries tab filters to {service_request, quote, consultation}
  client-side). Passes both to `<ServiceRequestsView>`.
- `src/app/admin/orders/page.tsx` — server component. Reads `listAllOrders()`
  → `<AdminOrdersView>`.
- `src/app/admin/inquiries/page.tsx` — server component. Reads
  `listInquiries()` → `<AdminInquiriesView>`.
- `src/app/admin/users/page.tsx` — server component. Reads `listUsers()` →
  `<AdminUsersView>`.
- `src/app/admin/admins/page.tsx` — server component. Reads `listAdmins()`
  + `listRoles()` in parallel → `<AdminAdminsView>`.
- `src/app/admin/notifications/page.tsx` — server component. Reads
  `listNotifications()` → `<AdminNotificationsView>`.
- `src/app/admin/activity/page.tsx` — server component. Reads
  `listActivity(300)` → `<AdminActivityView>`.
- `src/components/admin/inquiry-detail.tsx` — removed the `useAppStore`
  import. `InquiryDetailSheet` now:
  - Status update → `PATCH /api/inquiries/[id] { status }` (the server
    already logs the activity on its side).
  - "Quick Reply" stays a demo-only toast (no `/api/inquiries/[id]`
    endpoint exists for freeform reply logging — the API only accepts
    `{ status }`). Same UX as before; the reply textarea clears on submit.
  - Helpers `initialsOf`, `relTime`, `exactTime`, `InquiryTypeBadge`,
    `InitialsAvatar` exported unchanged so the other admin views reuse them.
- `src/components/admin/service-form.tsx` — accepts `categories` and
  `subcategories` as props (the parent server component already has them
  via `listCategories()` / `listSubcategories()`). Removed `useAppStore`
  and `useCurrentAdmin` imports — `createdBy` is now derived server-side
  from the session in the POST handler. The `submit` function is now
  `async`: builds the payload (same as before), POSTs to `/api/services`
  (create) or PATCHes `/api/services/[id]` (edit), handles `{ error }`
  responses as destructive toasts, and `router.push("/admin/services")`
  (create) or `router.refresh()` (edit) on success. All form tabs, the
  ChipInput / DynList / ProcessEditor subcomponents, validation rules,
  gradient/icon selectors, and the sticky action bar are unchanged.

## Files NOT modified (out of scope per task brief)

- `src/lib/store.ts` — left intact (the unrewired pages still need it).
- API routes, Prisma schema, `db.ts`, `auth-server.ts`, `api/helpers.ts`,
  `api/queries.ts` — consumed but not modified.
- Buyer dashboard files (`src/app/dashboard/*`, `src/components/dashboard/*`)
  — owned by another subagent.
- Pages left on the legacy store: `/admin/categories`,
  `/admin/subcategories`, `/admin/featured`, `/admin/marketplace`,
  `/admin/marketplace-requests`, `/admin/contact-requests`,
  `/admin/branding`, `/admin/navigation`, `/admin/content`, `/admin/roles`,
  `/admin/permissions`, `/admin/account`, `/admin/profile`,
  `/admin/industries`, `/admin/insights`, `/admin/resources`, `/admin/faqs`,
  `/admin/settings`.

## Verification

- `cd /home/z/my-project && bun run lint` → 0 errors, 0 warnings.
- `dev.log` (most recent lines) shows every admin page rendering 200 with
  no `Error:` or `⨯` markers in my files:
  ```
  GET /admin 200 in 423ms
  GET /admin/services 200 in 125ms
  GET /admin/service-requests 200 in 769ms
  GET /admin/orders 200 in 798ms
  GET /admin/inquiries 200 in 863ms
  GET /admin/users 200 in 766ms
  GET /admin/admins 200 in 649ms
  GET /admin/notifications 200 in 730ms
  GET /admin/activity 200 in 695ms
  GET /admin/services/new 200 in 1696ms
  GET /admin/services/srv-t-001 200 in 1450ms
  ```
- End-to-end mutation smoke test (logged in as `aarav@stioos.com`):
  - `POST /api/services/srv-t-001/featured` → `{ ok:true, featured:false }`.
  - `POST /api/notifications/read-all` → `200`.
- Overview page renders 8 live stat cards from `getAdminOverview()`:
  305 Total Services, 305 Published, 0 Drafts, 11 Service Requests,
  1 Admin, 24 Users, 4 New Inquiries, 3 Pending Inquiries.

## Judgment calls

- **Charts:** computed server-side in `page.tsx` (12-week bucketing for
  inquiries + requests, plus the category distribution pie) and passed as
  props to `AdminOverview`. The bucketing logic was copied verbatim from
  `/api/bootstrap/route.ts` so the chart shape matches the API contract
  exactly. The lazy `next/dynamic` import for recharts stays in the view
  component (with the absolute path `@/app/admin/admin-charts` so the
  module resolves from `src/components/admin/`).
- **Notification bell:** client-side fetch on mount + on popover open,
  rather than receiving notifications as a server-rendered prop. This
  keeps the bell's count fresh across admin actions without a full page
  reload, and avoids coupling the layout to the notifications table.
- **Search palette:** lazy-fetches all five entity lists the first time
  the palette opens (cached via a `loaded` flag so re-opens don't
  refetch). This is heavier than the store-based approach but reflects
  the actual DB state and keeps the palette results in sync with recent
  mutations after `router.refresh()`.
- **"Quick Reply" in InquiryDetailSheet:** kept the demo-only toast
  behavior since there is no `/api/inquiries/[id]` endpoint for freeform
  reply logging. The reply textarea clears on submit; the copy still says
  "Demo — responses are logged, not sent".
- **Admins stat card on the overview:** pointed to `/admin/admins`
  instead of the original `/admin/users` deep-link, since the dedicated
  admins page now exists and is the correct destination.

## Demo admin login

`aarav@stioos.com` / `demo1234` — confirmed working via
`POST /api/auth/login` → `{ ok:true, role:"admin", admin:{...} }`. The
session cookie then unlocks all `/admin/*` routes (without it, the
server layout issues a `307` redirect to `/auth/login?next=/admin`).
