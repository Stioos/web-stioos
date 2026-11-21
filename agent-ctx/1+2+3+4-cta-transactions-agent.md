# Task 1+2+3+4 — CTA Transaction System (Admin + Buyer)

**Agent:** cta-transactions-agent
**Date:** 2026-11-21
**Status:** Complete

## Objective

Add a CTA (Call-to-Action) transaction management layer to both the admin and
buyer dashboards. Visitors submit CTAs (quotes, service requests, consultations,
contact) from the public site; each submission becomes an `Inquiry` in the
Zustand store. The admin needed a consolidated transactional console, and the
buyer needed visibility into their own CTA history.

## What was built

### 1. Admin — CTA Transactions page
**File:** `src/app/admin/cta-transactions/page.tsx` (new)

A comprehensive console modeled on the existing `/admin/inquiries` page:

- **Summary stat cards** (5): Total CTAs, Quotes, Service Requests,
  Consultations, Contact — each showing a count **and a conversion rate**
  (share of CTAs that reached "Contacted" or "Closed"). Each card is clickable
  and jumps to its corresponding tab.
- **Tabbed view**: All | Quotes | Service Requests | Consultations | Contact
  (with per-tab count badges).
- **Status filter chips**: All / New / In Progress / Contacted / Closed
  (double as quick filters, mirror the inquiries page UX).
- **Data table** with columns: ID, Date, Name (+email), Company, Type (badge),
  Service (linked), Budget, Timeline, Status (badge), Actions.
- **Row actions dropdown**: View details, Mark In Progress, Mark Contacted,
  Close, Reopen as New, Delete (with confirm dialog).
- **Search**: by name, email, company, or service name (via DataTable).
- **Export button**: in the PageHeader actions; shows a toast on click (demo,
  no real file generation — per task spec).
- **Detail sheet**: reuses the existing `InquiryDetailSheet` (shared admin
  component) so admins get the full contact block, requirements, budget /
  timeline, status updater, and quick-reply logging.
- **Status legend** strip at the bottom clarifying the badge tones and the
  conversion definition.

Patterns reused: `PageHeader`, `DataTable`, `EntityStatusBadge` /
`StatusBadge`, `InquiryTypeBadge`, `InitialsAvatar`, `InquiryDetailSheet`,
`ConfirmDialog`, `useConfirmDialog`, `useAppStore`, `useToast`.

### 2. Admin — Sidebar nav item
**File:** `src/lib/nav.ts`

Added to the "Communication" group:
```ts
{ label: "CTA Transactions", href: "/admin/cta-transactions", icon: "ArrowLeftRight", module: "inquiries" },
```
Placed between "Inquiries" and "Contact Requests".

### 3. Shared icon registry — `ArrowLeftRight` added
**File:** `src/components/shared/icon.tsx`

The admin sidebar renders icons by string name via the `Icon` component, which
looks up a name in the local `ICONS` map. `ArrowLeftRight` was not previously
registered (only `ArrowRightLeft` existed), so it was added to both the
`lucide-react` import and the `ICONS` record. Without this, the nav icon would
have silently fallen back to `Sparkles`.

### 4. Buyer — My Transactions page
**File:** `src/app/dashboard/buyer/transactions/page.tsx` (new)

Wrapped in `RequireRole("buyer")` + `DashboardShell` (auto-login demo buyer,
no hydration guards). Light-theme cards on the dark navy buyer shell, amber
accents.

- **Summary cards** (4): My Quotes, My Service Requests, My Consultations,
  My Contact — counts using the dashboard `StatCard` (icon + accent).
- **Tabbed view**: All | Quotes | Service Requests | Consultations | Contact
  (with per-tab count badges).
- **Data table** (native `Table`, themed for the buyer shell) with columns:
  Date, Type (badge), Service, Requirements (truncated), Budget, Timeline,
  Status (badge), and a chevron affordance. Responsive column hiding via
  `hidden md:table-cell` / `xl:table-cell`.
- **Row click** opens a `TransactionDetailDialog` (buyer-specific, read-only)
  showing:
  - **Status timeline** — a 4-step horizontal stepper
    (New → In Progress → Contacted → Closed) with the current stage
    highlighted in amber, past stages filled, future stages outlined.
  - Requirements block (amber accent, matching admin styling).
  - Related service + deep link to the marketplace (when `serviceId` exists).
  - Budget / Timeline context tiles.
  - Contact-on-file summary (email, phone, company).
- **Empty state**: when the buyer has no CTAs, shows
  "You haven't submitted any CTAs yet. Explore the marketplace to request a
  quote or schedule a consultation." with a **Browse Services** CTA button
  linking to `/marketplace`. The same CTA button sits in the page header for
  quick access.
- **Buyer scoping**: inquiries filtered by `inquiry.email === user.email`.
  The demo buyer is Daniel Osei (`usr-001`, `d.osei@vertexbuild.com`), who
  owns seed inquiry `inq-001` (a service request for Custom AI Agent
  Development) — so the page shows real data out of the box.

Patterns reused: `RequireRole`, `DashboardShell`, dashboard `StatCard` /
`EmptyState`, shared `StatusBadge` (with tone lookup), `InquiryTypeBadge`,
`Dialog`, `Tabs`, `Table*`, `useAppStore`, `useCurrentUser`.

### 5. Buyer — Sidebar nav item
**File:** `src/components/dashboard/dashboard-shell.tsx`

Added `ArrowLeftRight` to the `lucide-react` import and a new entry to
`BUYER_NAV`:
```ts
{ href: "/dashboard/buyer/transactions", label: "My Transactions", icon: ArrowLeftRight },
```
Placed right after "My Requests" (logical grouping: requests → transactions).

## Verification

| Check | Result |
|-------|--------|
| `bun run lint` | PASS — exit 0, no errors |
| `GET /admin/cta-transactions` | **200** |
| `GET /dashboard/buyer/transactions` | **200** |
| Dev log | Both routes compiled & served cleanly, no runtime errors |

## Files touched

- `src/components/shared/icon.tsx` — added `ArrowLeftRight` to imports + ICONS map
- `src/lib/nav.ts` — added CTA Transactions nav item to Communication group
- `src/components/dashboard/dashboard-shell.tsx` — added My Transactions to BUYER_NAV
- `src/app/admin/cta-transactions/page.tsx` — **new** admin CTA transactions console
- `src/app/dashboard/buyer/transactions/page.tsx` — **new** buyer transactions page

## Notes for downstream agents

- The admin CTA page deliberately **reuses** the `InquiryDetailSheet` rather
  than duplicating it, so any future improvements to that sheet (e.g. adding a
  status-history log) automatically surface in the CTA console too.
- The buyer detail dialog is **separate** from the admin sheet because buyers
  should not see admin-only affordances (quick reply / log response / status
  mutation). It is read-only with a status timeline.
- Conversion rate is defined as `(contacted + closed) / total`. If a different
  definition is wanted later, the single `conversionRate()` helper in the admin
  page is the only place to change.
- Both new pages render immediately (no Suspense / hydration guards) per the
  task spec and the existing auto-login pattern in `AdminShell` /
  `DashboardShell`.
