# Task 1+2+3+4 — Move 55 directory services into the marketplace catalog

**Agent**: marketplace-directory-catalog-agent
**Task ID**: 1+2+3+4
**Status**: Complete
**Date**: 2025-11-20

## Summary

Re-anchored the 55 SEO/AEO services that previously lived at the
standalone `/services/[slug]` route into the EXISTING marketplace
catalog, so they now render at `/marketplace/[slug]` using the same
rich detail-page design (Live Impact Signal panel, donut chart,
before/after metrics, progress bars, breadcrumb pills, tags, stats
row, CTAs, etc.) that the other 305 services use. The old
`/services/[slug]` route is removed; `/services` (the listing page)
remains.

## Files touched

### Created

1. **`src/data/services-directory-catalog.ts`** (~1,250 lines)
   - 55 `Service` objects built via the existing `makeService()`
     factory in `src/data/service-factory.ts`.
   - Each entry has a unique `srv-dir-NNN` id (001–055), a slug
     derived deterministically from the service name via a local
     `slugifyServiceName()` (re-exported so the directory file can
     import it and stay in lockstep), `categoryId` + `subcategoryId`
     mapping onto the existing `cat-*` / `sub-*` taxonomy from
     `src/data/categories.ts`.
   - Full content for every service: `shortDescription`,
     `fullDescription`, `tags` (5), `industries` (4), `capabilities`
     (5), `deliverables` (4), `process` (4 steps with title +
     description), `problemsSolved` (4), `faqs` (4 AEO-optimized
     Q&As), `icon` (Lucide name string), `accent` (Tailwind gradient),
     `rating` (4.7–4.9), `reviews` (32–128).
   - 6 flagships marked `featured: true`: Operations & Process
     Automation (#1), Conversational & Support Agents (#6), Mobile
     Apps Design & Development (#13), AI-Powered Sales Enablement
     (#22), Data, Analytics & Business Intelligence (#28), and Brand
     Identity Design & Strategy Development (#51).
   - Exports: `DIRECTORY_SERVICES`, `DIRECTORY_SERVICE_SLUGS`,
     `findDirectoryService(slug)`, and `slugifyServiceName(name)`.

### Updated

2. **`src/lib/store.ts`** — `ensureFullCatalog()` now loads
   `services-directory-catalog` as an 8th deferred chunk and spreads
   `DIRECTORY_SERVICES` into the `injectAutoServices([...])` call so
   the 55 services hydrate into the Zustand catalog alongside the
   other 305 (deduped by id — `srv-dir-*` ids are unique so nothing
   gets clobbered).

3. **`src/lib/service-data.ts`** — statically imports
   `DIRECTORY_SERVICES` and concatenates it into `ALL_SERVICES` so
   the `/marketplace/[slug]` page can find any of the 55 services via
   `findServiceBySlug()` WITHOUT depending on the store's deferred
   `ensureFullCatalog()` load (eliminates the skeleton flash that
   would otherwise appear if the deferred chunk hadn't loaded yet).

4. **`src/data/services-directory.ts`** — switched the
   `slugifyServiceName` import from the now-legacy
   `service-pages-data.ts` to the new `services-directory-catalog.ts`
   so the slug algorithm is shared with the catalog. Updated the
   `svc()` helper to derive hrefs as `/marketplace/<slug>` instead of
   `/services/<slug>`. Updated the file's header comment block to
   reflect that the directory now points at the existing marketplace
   detail page (Live Impact Signal panel, donut chart, etc.) rather
   than standalone SEO pages. All 55 directory entries now resolve to
   `/marketplace/<slug>` at runtime; zero references to `/services/`
   remain in the file.

### Removed

5. **`src/app/(public)/services/[slug]/page.tsx`** + the now-empty
   `[slug]` directory — deleted. The standalone SEO landing page is
   gone; the 55 services render at the existing marketplace detail
   route instead. `/services` (the listing page) is unchanged and
   still works.

### Left as-is (per task brief)

6. **`src/data/service-pages-data.ts`** — left in place. No code
   imports it anymore (the only consumer was the deleted
   `/services/[slug]` route), so it's now inert data. Could be
   deleted later for tidiness but poses no risk.

## Verification

### Lint
```bash
$ bun run lint
$ eslint .
---EXIT: 0---
```
Clean — no errors, no warnings.

### HTTP status codes (curl)

Three URLs from the brief:
```bash
$ curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:3000/marketplace/operations-process-automation
200

$ curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:3000/marketplace/brand-identity-design-strategy-development
200

$ curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:3000/services/operations-process-automation
404   # old route correctly removed
```

Bonus spot-checks on four more of the 55 services:
```bash
/marketplace/cloud-hosting-deployment                   -> 200
/marketplace/ai-powered-sales-enablement                -> 200
/marketplace/fractional-cfo-controller-services         -> 200
/marketplace/competitor-analysis-market-reach           -> 200
/services/jataye-blogs-news                             -> 404   # old route gone
```

### Directory ↔ catalog slug parity

The `svc()` helper in `services-directory.ts` now derives its href
via the same `slugifyServiceName()` exported from
`services-directory-catalog.ts`, and the catalog uses the same
function to derive each service's `slug`. So every directory href
resolves to a real catalog entry by construction — no drift possible.

### Dev log tail (last 5 lines)
```
 GET /marketplace/cloud-hosting-deployment 200 in 714ms
 GET /marketplace/ai-powered-sales-enablement 200 in 337ms
 GET /marketplace/fractional-cfo-controller-services 200 in 200ms
 GET /marketplace/competitor-analysis-market-reach 200 in 285ms
 GET /services/jataye-blogs-news 404 in 64ms
```

## Architecture notes for downstream agents

- The 55 `DIRECTORY_SERVICES` live in two places by design:
  1. **`src/lib/service-data.ts`** — statically imported so the
     `/marketplace/[slug]` route finds them synchronously via
     `findServiceBySlug()` without waiting on store hydration.
  2. **`src/lib/store.ts` `ensureFullCatalog()`** — dynamically
     imported as the 8th catalog chunk so the services also flow into
     the Zustand catalog used by `/services`, `/marketplace` listing,
     search, admin, etc.
  The two paths coexist cleanly: `injectAutoServices()` dedups by id,
  and `srv-dir-*` ids never collide with the other catalog files.

- `slugifyServiceName()` is now the canonical slug algorithm for
  these 55 services, re-exported from
  `services-directory-catalog.ts`. Anyone needing to resolve a
  directory name → slug should import it from there, not from
  `service-pages-data.ts` (which is now legacy/inert data).

- The 55 directory entries deliberately span multiple categories
  (cat-ai-agents, cat-tech-programming, cat-multimedia-ai,
  cat-digital-sales-marketing, cat-business-enterprise) per the task
  mapping. They show up alongside the other 305 services in the
  marketplace listing, category pages, and search — and use the same
  `ServiceCard` component everywhere.

- Total catalog is now 360 services (305 curated + 55 directory + 7
  core flagships deduped against the curated set).
