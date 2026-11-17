# Task 3-b — Admin Service Requests hub + super-admin feature cleanup

Agent: 3-b (admin-side requests tracking + feature cleanup)
Date: 2026-11-12

## Files created
- `src/app/admin/service-requests/page.tsx` — unified Service Requests hub ('use client', Suspense-wrapped for `?focus=` deep links).

## Files modified
- `src/lib/nav.ts` — ADMIN_NAV rewritten to the lean ops set (structure below).
- `src/components/layout/admin-shell.tsx` — search groups now Services / Service Requests / Orders / Users / Inquiries (removed Admins + Categories groups); notification bell items now just mark-read (no /admin/notifications nav, removed "View all" footer); account dropdown dropped "Account Settings" (/admin/account deleted); removed now-unused lucide `Settings` import.
- `src/app/admin/page.tsx` (dashboard, no redesign) — "Categories" stat replaced with "Service Requests" stat (count, Inbox icon, → /admin/service-requests); "Admins" stat kept (count 1) but repointed /admin/admins → /admin/users; quick actions now Add Service / Review Requests (/admin/service-requests) / View Orders (/admin/orders) / Create User / Open Inquiries (/admin/inquiries); stale icon-allowlist comment updated.
- `src/components/shared/icon.tsx` — added `Inbox`, `History`, `UserCircle` to the Icon allowlist so nav icons render instead of the Sparkles fallback (file was not on the do-not-touch list).

## Files deleted (17 directories)
`src/app/admin/`: marketplace-requests, marketplace, categories, subcategories, featured, content, industries, insights, resources, faqs, admins, roles, permissions, notifications, branding, navigation, account.

## New ADMIN_NAV structure
- Overview: Dashboard (/admin, LayoutDashboard, dashboard, exact)
- Marketplace Management: Services (/admin/services, Layers, services), Orders (/admin/orders, Package, orders), Service Requests (/admin/service-requests, Inbox, marketplace), Users (/admin/users, Users, users)
- Communication: Inquiries (/admin/inquiries, Mail, inquiries), Contact Requests (/admin/contact-requests, MessageSquare, inquiries)
- System: Activity Logs (/admin/activity, History, activity), Settings (/admin/settings, Settings, settings)
- Profile: My Profile (/admin/profile, UserCircle, settings)

## Service Requests page feature set
- Stat row: Open / In review / In progress / Fulfilled (StatCard, clickable → pipeline + status filter).
- Tabs: "Pipeline" (default) and "Website Enquiries", both with live counts.
- Pipeline: kind filter (All kinds + all 6 via KIND_LABELS) + status filter (All + all 6 via REQUEST_STATUS_LABELS); columns Reference (font-mono), Request (title + kind badge), Buyer, Budget, Timeline (hideBelow md), Status (dashboard/shared StatusBadge), Created (hideBelow lg); row click / View opens Sheet.
- Sheet: buyer block (name/company/category), kind + budget + timeline chips + kind tagline, structured meta rows for talent kinds (labels from REQUEST_KIND_DEFS fields, missing values skipped), details paragraph, vertical tracking timeline (status-colored dots, REQUEST_STATUS_LABELS, note, "by X · date", "No activity yet" fallback), actions: status Select + optional note → updateMarketRequestStatus + toast (button disabled on no-op); convert-to-order amount input (placeholder from budgetRange) → convertRequestToOrder; success toast names the order id; destructive toast on error; when orderId exists the whole block is replaced by an emerald "Order <id>" chip linking to /admin/orders (shows quoted amount when set).
- Website Enquiries: ported old marketplace-requests UI (DataTable + inline status Select + View sheet), now covering inquiry types service_request, quote, consultation; uses updateInquiryStatus.
- `?focus={id}` support: admin search links open the sheet directly (same pattern as admin/inquiries).

## References fixed to deleted routes
1. nav.ts — full rewrite (see above).
2. admin-shell AdminSearch — removed /admin/admins + /admin/categories result groups; added Service Requests (deep link ?focus=) and Orders groups.
3. admin-shell NotificationBell — removed two /admin/notifications navigations.
4. admin-shell account menu — removed /admin/account item.
5. admin/page.tsx — 3 quick-action links + 2 stat-card links repointed (details above).
Remaining grep hits: only a code comment in src/data/content.ts (data/** untouchable) and pages that were themselves deleted. No code imports from deleted paths.

## Verification
- `bunx tsc --noEmit | grep ^src/` → empty (0 errors in src/; pre-existing scripts/skills errors only).
- `bun run lint` → 0 errors, only the 2 pre-existing warnings in src/app/(public)/category/[slug]/page.tsx.
- Browser smoke test (super-admin login): sidebar renders the exact new nav; stats correct (5 open / 2 review / 2 in-progress / 1 fulfilled of 11); kind + status filters work; sheet shows structured details, timeline, status update appends history entry with note, convert-to-order creates order + toast + emerald chip; mr-004 shows "Order mo-007" chip; Website Enquiries tab lists 11 enquiries with inline status select; dashboard renders new stat + quick actions. All routes 200 in dev.log.

## Deviations / notes for next agents
- Icon allowlist additions (Inbox/History/UserCircle) — nav previously fell back to Sparkles for these.
- Dashboard "Categories" stat replaced by "Service Requests" stat (categories page deleted; kept dashboard useful per task judgment clause). Categories data still feeds the pie chart — untouched.
- Admins stat kept per task note, repointed to /admin/users (no admin-management page survives).
- Orders admin search group links to /admin/orders without ?focus (orders page has no focus-param support).
- Store wish (not implemented, out of scope): seed mr-004 lacks quotedAmount so the emerald chip shows "Converted to a marketplace order" instead of the quoted $950; a store-side backfill or seed quotedAmount would make that nicer. Also convertRequestToOrder errors surface only via toast here — fine for demo.
