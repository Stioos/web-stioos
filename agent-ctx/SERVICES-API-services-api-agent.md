# Task SERVICES-API — Services & Categories API routes

**Agent:** services-api (Next.js 16 App Router, TypeScript, Prisma + SQLite)
**Scope:** Six read/write route handlers backing the public catalog
(`services`, `categories`) and the admin CRUD surface
(`admin/services`). Built on the existing `@/lib/db` Prisma singleton and
`@/lib/auth` JWT helpers — no new deps installed.

## What I read first
- `src/lib/auth.ts` — confirmed available exports: `json`, `error`,
  `success`, `getAuthUser`, `requireAuth`, `requireAdmin`, `JWTPayload`.
  `requireAuth` / `requireAdmin` **throw a `Response`** on auth failure
  (401 / 403) rather than returning `null` — handled by passing the
  thrown `Response` straight through (`if (err instanceof Response)
  return err`), same pattern as the existing `/api/auth/me` route.
- `src/lib/db.ts` — singleton `PrismaClient` exported as `db`.
- `prisma/schema.prisma` — `Service` model (24 scalar + 2 relation
  fields; the seven JSON-array columns are stored as `String` with
  `@default("[]")`), `Category` (with `subcategories` + `services`
  relations), `Subcategory`.
- `/agent-ctx/AUTH-API-auth-routes.md` — pattern reference for
  `force-dynamic`, try/catch → `error(msg, 500)`, `requireAuth`-thrown
  `Response` passthrough, JSON body parse with `await request.json()`
  wrapped in try/catch → 400 on bad JSON.
- Existing route files `src/app/api/auth/me/route.ts` + `login/route.ts`
  for the house style (header comments, JSDoc on the exported handler,
  `console.error("[api/...] ...")` namespacing).

## Files CREATED

### 1. `src/app/api/services/route.ts` — GET list (public)
- `export const dynamic = "force-dynamic"`.
- Query params parsed from `request.nextUrl.searchParams`:
  - `page` (default 1, clamped to ≥1)
  - `limit` (default 20, clamped to 1–100)
  - `category` (slug — filtered via the `category: { slug }` relation,
    no separate lookup query needed)
  - `search` (free text — `OR` of `name contains` + `shortDescription
    contains`; SQLite's LIKE is ASCII-case-insensitive so no
    `mode: "insensitive"` is needed/would work)
  - `sort` (`popularity` | `rating` | `newest` | `name`, default
    `popularity`) via a `SORT_ORDER` lookup table typed as
    `Record<SortKey, Prisma.ServiceOrderByWithRelationInput>`
  - `featured=true` (only applies the `featured: true` filter when the
    literal string `"true"` is sent — `false` / omitted means no filter)
- **Status gate:** every `where` clause starts with
  `{ status: "published" }` so draft / archived services never leak to
  the public catalog regardless of the other filters.
- **`select` clause** (`SERVICE_LIST_SELECT`, `satisfies
  Prisma.ServiceSelect`) returns all 21 scalar fields **except** the
  seven heavy JSON columns: `tags`, `problemsSolved`, `capabilities`,
  `deliverables`, `process`, `technologies`, `faqs`. Verified at
  runtime: `heavy fields leaked: []`. These fields are only fetched on
  the detail route.
- `findMany` + `count` run in parallel via `Promise.all` so the page
  request costs one round-trip, not two.
- Returns `{ success: true, data: { services, total, page, limit,
  totalPages } }` with `totalPages = Math.ceil(total / limit)`.

### 2. `src/app/api/services/[slug]/route.ts` — GET single (public)
- `export const dynamic = "force-dynamic"`.
- Next.js 16 signature: `{ params }: { params: Promise<{ slug: string }>
  }` — `const { slug } = await params` (dynamic segment params are
  async in App Router 16).
- `db.service.findFirst({ where: { slug, status: "published" },
  include: { category: true, subcategory: true } })` — uses
  `findFirst` (not `findUnique`) because the combined slug + status
  filter isn't a unique lookup. Drafts / archived services return 404
  even if the slug matches.
- 400 on empty slug, 404 when not found, 200 `{ success: true, data:
  { service } }` with **all** fields (including the heavy JSON blobs)
  plus the related `category` and `subcategory` objects.

### 3. `src/app/api/categories/route.ts` — GET list (public)
- `export const dynamic = "force-dynamic"`.
- `db.category.findMany({ where: { status: "active" }, orderBy: { name:
  "asc" }, include: { _count: { select: { subcategories: { where:
  { status: "active" } } } } } })`.
- The `_count.subcategories` filter only counts **active**
  subcategories — a disabled subcategory shouldn't inflate the badge
  shown next to the category in the nav.
- Returns `{ success: true, data: { categories } }` where each category
  carries `_count: { subcategories: number }`.

### 4. `src/app/api/categories/[slug]/route.ts` — GET single (public)
- `export const dynamic = "force-dynamic"`.
- Async params: `const { slug } = await params`.
- `db.category.findFirst({ where: { slug, status: "active" },
  include: { subcategories: { where: { status: "active" }, orderBy:
  { name: "asc" } } } })` — only the active subcategories of an active
  category are returned.
- 400 on empty slug, 404 when not found (or category is disabled),
  200 `{ success: true, data: { category } }`.

### 5. `src/app/api/admin/services/route.ts` — POST create (admin)
- `export const dynamic = "force-dynamic"`.
- Auth gate: `requireAdmin(request)` wrapped in try/catch — the thrown
  401 / 403 `Response` is passed straight through (`if (err instanceof
  Response) return err`). Non-Response errors fall back to a 401
  (matches the `/api/auth/me` precedent).
- Body parsed with `await request.json()` → 400 `"Invalid JSON body"`
  on parse failure.
- **Validation:** `name`, `slug`, `categoryId`, `subcategoryId` are all
  required non-empty strings (≤255 chars). Each is checked via an
  `asString(value, field, maxLen)` helper that throws a
  `FieldValidationError` — caught and converted to a 400.
- **FK pre-flight:** before attempting the insert, `category` and
  `subcategory` are fetched in parallel (one round-trip). 404 if either
  doesn't exist. 400 if the subcategory doesn't belong to the specified
  category (`subcategory.categoryId !== category.id`). This gives
  cleaner errors than catching Prisma's P2003 FK violation.
- **`createdBy` is stamped from `admin.userId`** (the JWT payload's
  userId) — never trusted from the body, so we can audit who created
  each record.
- **JSON-array coercion** (`coerceJsonField`): for the seven String-JSON
  columns (`tags`, `industries`, `problemsSolved`, `capabilities`,
  `deliverables`, `process`, `technologies`, `faqs`), the body may send
  either a real array (server `JSON.stringify`s it) or a pre-serialized
  string (passed through). Anything else → 400. Absent fields fall back
  to the Prisma schema default (`"[]"`).
- **Optional scalar strings / numbers / booleans** are only included in
  the `data` payload when present in the body — absent fields get their
  schema default. Numbers are validated with `Number.isFinite`;
  `reviews` and `popularity` are floored to ints.
- Build uses `Prisma.ServiceCreateInput` with `category: { connect:
  { id } }` + `subcategory: { connect: { id } }` for the relations.
- **Persistence + error mapping:**
  - `Prisma.PrismaClientKnownRequestError` with `code === "P2002"` →
    409 `"A service with this {target} already exists"` (target pulled
    from `err.meta.target`, defaults to `"slug"`).
  - All other errors → 500 `"Unable to create service"`.
- Returns **201** `{ success: true, data: { service } }` (via
  `success({ service }, 201)`).

### 6. `src/app/api/admin/services/[id]/route.ts` — PATCH update (admin)
- `export const dynamic = "force-dynamic"`.
- Same auth gate as POST (`requireAdmin` → passthrough thrown
  `Response`). The `admin` payload is intentionally unused on update —
  `createdBy` is an audit fact set once at creation and never mutated.
- Async params: `const { id } = await params`. 400 on empty id.
- **Immutability guard:** `id`, `createdAt`, `createdBy` are in an
  `IMMUTABLE_FIELDS` set. If any appears in the body keys, the request
  is rejected with 400 `"{field} cannot be modified"` — surfaces the
  contract rather than silently ignoring.
- **Partial update semantics:** only fields present in the body are
  written. The `data: Prisma.ServiceUpdateInput` object is built
  incrementally; absent fields keep their current DB value.
- **JSON-array fields** use the same `coerceJsonField` helper as POST.
  On PATCH, an explicit `null` coerces to `"[]"` (clears the array);
  an array is stringified; a string passes through.
- **Category / subcategory reassignment:** if either `categoryId` or
  `subcategoryId` is in the body, both are resolved (fetching the
  service's current values to fill the gap when only one is sent),
  validated to exist, and checked for parent-child consistency — same
  404 / 400 behavior as POST. The update then uses `category: {
  connect: { id } }` + `subcategory: { connect: { id } }`.
- **Persistence + error mapping:**
  - P2025 (record not found) → 404 `"Service not found"`.
  - P2002 (unique constraint, e.g. slug taken by another service) → 409.
  - All other errors → 500 `"Unable to update service"`.
- Returns **200** `{ success: true, data: { service } }` with the full
  updated record.

## End-to-end verification (against the running dev server)

Seeded a test category + subcategory + admin user directly via Prisma
(role `admin`), logged in via `/api/auth/login` to get a JWT, then ran
17 curl cases:

| # | Endpoint | Body / Params | Expected | Got |
|---|----------|---------------|----------|-----|
| 1 | GET `/api/services` | default | 200, `{services:[],total:0,...}` | 200 ✓ |
| 2 | GET `/api/categories` | — | 200, 1 cat with `_count.subcategories:1` | 200 ✓ |
| 3 | GET `/api/categories/test-category` | — | 200, 1 sub | 200 ✓ |
| 4 | GET `/api/services/nonexistent` | — | 404 | 404 ✓ |
| 5 | POST `/api/admin/services` | no token | 401 | 401 ✓ |
| 6 | POST `/api/admin/services` | `{name}` only | 400 `"slug" is required` | 400 ✓ |
| 7 | POST `/api/admin/services` | full body | **201**, `createdBy=admin.userId`, `tags` stringified | 201 ✓ |
| 8 | POST `/api/admin/services` | dup slug | 409 | 409 ✓ |
| 9 | GET `/api/services/ai-strategy-audit` | — | 200, full fields + `category` + `subcategory` | 200 ✓ |
| 10 | GET `/api/services?featured=true` | — | total:1 | 1 ✓ |
| 11 | GET `/api/services?search=strategy` | — | total:1 (matched by name) | 1 ✓ |
| 12 | GET `/api/services?limit=1` | — | 21 scalar fields, **0 heavy JSON fields leaked** | ✓ |
| 13 | GET `/api/services?sort=rating` | — | 200 | 200 ✓ |
| 14 | GET `/api/services?sort=name` | — | 200, first name correct | 200 ✓ |
| 15 | GET `/api/services?category=test-category` | — | total:1 | 1 ✓ |
| 16 | GET `/api/services?category=nope` | — | total:0 | 0 ✓ |
| 17 | GET `/api/services?page=2&limit=5` | — | services:[], total:1, totalPages:1, page:2 | ✓ |
| 18 | PATCH `/api/admin/services/[id]` | `{shortDescription,featured,popularity,tags}` | 200, all 4 fields updated | 200 ✓ |
| 19 | PATCH `/api/admin/services/nonexistent-id` | `{name}` | 404 (P2025 caught) | 404 ✓ |
| 20 | PATCH `/api/admin/services/[id]` | `{id:"..."}` | 400 `"id" cannot be modified` | 400 ✓ |
| 21 | PATCH `/api/admin/services/[id]` (buyer token) | `{name}` | 403 | 403 ✓ |

The `prisma:error` lines in `dev.log` for the duplicate-slug (409) and
missing-record (404) cases are **expected** — Prisma logs the
constraint violation before our catch block converts it to a clean HTTP
response. No unhandled exceptions, no compile errors.

## Lint + dev log
- `cd /home/z/my-project && bun run lint` — passes with **zero errors
  and zero warnings** (`$ eslint .` with no findings, exit 0).
- `dev.log` shows every route compiled on first request and returned
  its expected status code. No `Module not found`, no TypeScript
  errors, no runtime crashes.

## Judgment calls
1. **Public catalog status gate.** The task spec for the list endpoint
   doesn't explicitly say "only published", but exposing drafts /
   archived services on a public marketplace route would be a bug.
   Every public `where` clause starts with `{ status: "published" }`.
   Same for the single-service route — a draft returns 404 even if the
   slug matches. Admins use `/api/admin/services/*` to manage
   non-published records.
2. **Category filter via relation, not slug→id lookup.** The query
   param is a category slug, but `Service.categoryId` is the FK.
   Rather than a separate `findUnique({ where: { slug } })` to resolve
   the id, the filter uses `where.category = { slug: categorySlug }` —
   one query instead of two, and Prisma generates the JOIN.
3. **`findFirst` vs `findUnique` on the single-service route.** The
   combined `{ slug, status: "published" }` filter isn't a unique
   lookup (slug is unique, but adding status makes it non-unique from
   Prisma's perspective), so `findFirst` is the correct call.
   `findUnique` would only accept `{ slug }` alone and couldn't apply
   the status gate.
4. **JSON-array fields accept both arrays and pre-serialized strings.**
   The Prisma schema stores them as `String` (SQLite has no native JSON
   column). Frontend forms naturally send arrays; direct API consumers
   might send pre-serialized strings. `coerceJsonField` accepts either
   and rejects primitives/objects with a 400 — predictable and ergonomic.
5. **`createdBy` stamped from JWT, never from body.** The body could
   lie about who created the record. On POST, `createdBy` is forced to
   `admin.userId` from the verified token. On PATCH, `createdBy` is in
   the `IMMUTABLE_FIELDS` set — attempting to change it returns 400.
6. **FK pre-flight on POST.** Catching Prisma's P2003 FK violation
   would work, but a pre-flight `findUnique` on `category` +
   `subcategory` in parallel gives a cleaner 404 with a specific
   message (`"Category not found"` / `"Subcategory not found"`) and
   also lets us validate the parent-child relationship (`subcategory.
   categoryId === category.id`) with a clear 400. Costs one extra
   round-trip but the error UX is much better.
7. **`featured` query param only filters when literally `"true"`.**
   `featured=false` or omitted means "no filter" (show both featured
   and non-featured). This is more useful than mapping `"false"` to a
   `featured: false` filter, which would hide all featured services —
   almost never what a caller wants.
8. **`sort` accepts a closed set, defaults to `popularity`.** Unknown
   sort values silently fall back to `popularity` rather than 400ing —
   a bad sort key shouldn't break the page, it should just use the
   default ordering.
9. **PATCH immutability surfaced as 400, not silently ignored.** If a
   caller sends `{ id: "..." }` in a PATCH body, returning 400 with
   `"{field} cannot be modified"` teaches them the contract. Silently
   dropping the field would hide bugs in the caller.
10. **PATCH category reassignment fills gaps from current DB state.**
    If only `categoryId` is sent (not `subcategoryId`), we fetch the
    service's current `subcategoryId` so we can validate the new
    category is the right parent for the existing subcategory. This
    prevents orphaning a service into a category whose subcategory
    doesn't belong to it.
11. **`reviews` and `popularity` are floored to ints.** The schema
    declares them `Int`; a body sending `42.7` would otherwise cause a
    Prisma type error. `Math.floor` is the predictable coercion.
12. **`force-dynamic` on every route.** Catalog content, auth-gated
    responses, and admin mutations all change per-request — caching at
    the route-segment level would be a correctness bug.

## Did NOT touch
- No changes to `src/lib/auth.ts` or `src/lib/db.ts` — the existing
  exports (`json`, `error`, `success`, `requireAuth`, `requireAdmin`,
  `JWTPayload`, `db`) cover everything needed.
- No changes to `prisma/schema.prisma` — the `Service` / `Category` /
  `Subcategory` models already match the task's field list exactly.
- No frontend changes — these routes are the backend half; wiring up
  the marketplace / admin UIs to call them is a separate task.
- No test files written (per project policy).
- Seeded test data (one category, one subcategory, two users, one
  service) was **cleaned up** at the end of verification so the DB is
  left in its original empty state for the next agent.
