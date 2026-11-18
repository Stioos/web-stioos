# Task D4 — Django API views + URL routing

**Agent:** D4 (Django 6.1 + DRF backend, Python)
**Project:** `/home/z/my-project/backend` (STIOOS GLOBAL marketplace backend)
**Scope:** Wrote ONLY `backend/api/views.py` and `backend/api/urls.py` — the
DRF function-based view handlers and URL configuration that mirror the
existing Next.js route handlers in `src/app/api/**/route.ts` one-to-one.
Did NOT modify models, dto, auth, settings, seed fixtures, or any Next.js files.

## Files written

### `backend/api/views.py`
- DRF function-based views decorated with `@api_view([...])`. One view per
  endpoint, grouped into clearly labelled sections (AUTH, INQUIRIES,
  REQUESTS, ORDERS, WISHLIST, THREADS, SERVICES, CATEGORIES, SUBCATEGORIES,
  USERS, ADMINS, ROLES, NOTIFICATIONS, ACTIVITY, SETTINGS, BOOTSTRAP,
  PROFILE). Total: 36 endpoint view functions + helpers.
- Helpers defined at top:
  - `_json`, `_ok`, `_created`, `_bad`, `_unauth`, `_not_found`, `_server_error`
    for consistent JsonResponse construction.
  - `_body(request)` mirrors Next.js `parseBody`: returns the parsed JSON
    dict or `None` (catches DRF's `ParseError` so malformed JSON returns
    `{error: "Invalid JSON body."}` with 400, matching Next.js).
  - `_log_activity(actor, action, module, target, description)` and
    `_notify(type, title, message)` — both wrapped in `try/except` so a
    logging failure never breaks the underlying mutation.
  - `new_request_reference()` — `REQ-XXXXX` (5 chars from
    `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`).
  - `slugify(input)` — identical normalization to the Next.js slugify.
  - `_avatar_initials(name)` — first letters of up to two name words.
  - `_to_base36(n)` — used for service duplication slug suffix
    (`<slug>-copy-<base36 ms>` matching `Date.now().toString(36)`).
  - `_iso_now()` — `timezone.now().isoformat()` for status_history entries.
  - `_bucket_by_week(items)` — 12-week bucketing for bootstrap chartData
    (oldest at index 0, current week at index 11), identical logic to the
    Next.js `bucketByWeek` helper.

### `backend/api/urls.py`
- `urlpatterns` lists all 36 routes under `/api/` (the project-level
  `stioos_backend/urls.py` already includes this app at `api/`).
- Ordering: more specific static-segment paths (`requests/<id>/convert`,
  `services/<id>/{status,featured,duplicate}`, `notifications/read-all`,
  `threads/<id>/messages`) are declared BEFORE the generic `<str:id>` routes
  so Django's resolver matches them first.

## Endpoint coverage (mirrors Next.js exactly)

### Auth
- `POST /api/auth/signup` — calls `sign_up_buyer`. Pattern: build a
  placeholder `JsonResponse({}, 200)`, pass it to the auth helper so the
  helper can call `response.set_cookie(...)`, then overwrite
  `response.content` with the final JSON payload once the `User` object is
  available. Returns `{ok:true, user: user_dto(user)}` (200) or
  `{error}` (400).
- `POST /api/auth/login` — tries admin first (`sign_in_admin`); if the
  error message contains "no admin", falls through to buyer
  (`sign_in_buyer`). Returns `{ok:true, role:"admin", admin:...}` or
  `{ok:true, role:"buyer", user:...}`. If admin matched but password /
  status was wrong, surfaces that error directly (no buyer fall-through).
- `POST /api/auth/logout` — `clear_session(response, token)` then
  `{ok:true}`.
- `GET /api/auth/me` — `{ok:false}` (200) if no session, else
  `{ok:true, kind:"admin", admin:...}` or `{ok:true, kind:"buyer", user:...}`.

### Inquiries
- `GET /api/inquiries` — admin only. Optional `?type=&status=` filters.
- `POST /api/inquiries` — anonymous OR buyer. Validates
  name/email/type, type ∈ {quote, service_request, contact, consultation}.
  Links `buyer_id` if a buyer session exists and increments that buyer's
  `inquiries_count`. Emits Notification (type `contact_inquiry` if
  type=="contact" else `service_request`) + ActivityLog. Returns
  `{ok:true, inquiry:{id, reference: id.upper()}}` (201).
- `PATCH /api/inquiries/<id>` — admin. status ∈
  {new, in_progress, contacted, closed}. ActivityLog.
- `DELETE /api/inquiries/<id>` — admin. ActivityLog.

### Requests (marketplace briefs)
- `GET /api/requests` — admin sees all; buyer sees own; anon → 401.
- `POST /api/requests` — buyer only. Validates title/categoryId/categoryName.
  Generates unique `REQ-XXXXX` reference with up-to-3 collision retries.
  Creates MarketRequest with status="open", kind (default "service"),
  status_history=[{status:"open", at:now.iso, by:buyer.name,
  note:"Request submitted"}]. Emits Notification + ActivityLog.
- `GET /api/requests/<id>` — admin only (buyer detail not exposed).
  Returns `{request: request_dto}` or 404 "Not found." (Next.js default).
- `PATCH /api/requests/<id>` — admin. status ∈
  {open, in_review, in_progress, fulfilled, rejected, closed}. Appends
  to status_history: `{status, at:now.iso, by:admin.name, note}`.
- `POST /api/requests/<id>/convert` — admin. Body {amount, note?}.
  Validates amount>=0. If `order_id` already set → 400. Resolves a
  service: most-popular Service in `request.category_id`, else most-popular
  Service overall, else 400. Uses `transaction.atomic()` to create
  MarketOrder + update MarketRequest (quoted_amount, order_id, status=
  "fulfilled", status_history append) atomically. ActivityLog. Returns
  `{ok:true, orderId: order.id}`. On unexpected exception returns 500
  "Failed to convert request to order." (matches Next.js serverError).

### Orders
- `GET /api/orders` — admin: all; buyer: own; anon → 401.
- `PATCH /api/orders/<id>` — admin can set any status; buyer can only set
  "completed" on own order. status ∈
  {pending, in_progress, delivered, completed, cancelled}. ActivityLog.

### Wishlist
- `GET /api/wishlist` — buyer only. Resolves Wishlist rows → Service
  objects by slug. Returns `{services:[service_dto...], slugs:[...]}`.
  Slugs list mirrors Next.js: only slugs of services that actually exist
  (orphans are dropped).
- `POST /api/wishlist` — buyer only. Body {serviceSlug}. Toggle:
  delete existing → `{ok:true, saved:false}`; create new →
  `{ok:true, saved:true}`.

### Threads / Messages
- `GET /api/threads` — buyer only. Threads ordered by last_message_at desc;
  each thread's messages fetched ordered by sent_at asc, mapped via
  `thread_dto(t, messages)`.
- `POST /api/threads/<id>/messages` — buyer only, own thread. Body {body}.
  Creates MarketMessage (sender_role="buyer"). Updates thread.last_message_at.
  Returns `{ok:true, message:{id, sentAt: now.isoformat()}}`.

### Services
- `GET /api/services` — public. Query params: status, categoryId,
  subcategoryId, featured ("true"/"false"), search, sort
  (relevance/popular/rating/newest), limit. Default sort = popularity desc;
  default limit = 1000. Search uses `Q(name__icontains) |
  Q(short_description__icontains) | Q(tags__icontains)`.
- `POST /api/services` — admin. Validates name/categoryId/subcategoryId;
  auto-slug from name if missing; verifies Category exists and
  Subcategory belongs to the same Category; validates status/deliveryType
  enums when provided. `created_by = admin.name`. Catches IntegrityError →
  400 "Slug already exists for a service." ActivityLog. Returns
  `{ok:true, service:{id, slug, name}}` (201).
- `GET /api/services/<id>` — public. `{service: service_dto}` or 404.
- `PATCH /api/services/<id>` — admin. Partial update over a whitelist of
  25 camelCase fields mapped to snake_case model fields. Re-validates
  categoryId/subcategoryId existence, status/deliveryType enums. Catches
  IntegrityError → 400. ActivityLog. Returns `{ok:true}`.
- `DELETE /api/services/<id>` — admin. ActivityLog.
- `PATCH /api/services/<id>/status` — admin. status ∈
  {draft, published, archived}. ActivityLog. Returns `{ok:true, status}`.
- `POST /api/services/<id>/featured` — admin. Toggles featured. ActivityLog.
  Returns `{ok:true, featured}`.
- `POST /api/services/<id>/duplicate` — admin. Clones with name=`<name> (Copy)`,
  slug=`<slug>-copy-<base36 ms>`, status="draft", featured=False,
  rating/reviews/popularity reset to 0. All JSON fields cast via `list(...)`
  so the JsonValue→list coercion is explicit. ActivityLog. Returns
  `{ok:true, service:{id, slug}}` (201).

### Categories
- `GET /api/categories` — public, ordered by name asc.
- `POST /api/categories` — admin. Auto-slug from name if missing; validates
  status enum. Catches IntegrityError → 400. ActivityLog. Returns
  `{ok:true, category:{id, slug}}` (201).
- `PATCH /api/categories/<id>` — admin. Partial whitelist. Validates status.
  Catches IntegrityError. ActivityLog. Returns `{ok:true}`.
- `DELETE /api/categories/<id>` — admin. Cascade: deletes Subcategory rows
  where category_id=id BEFORE deleting the Category (mirrors Next.js
  explicit deleteMany). ActivityLog.

### Subcategories
- `GET /api/subcategories` — public, optional `?categoryId=`.
- `POST /api/subcategories` — admin. Validates parent Category exists;
  catches IntegrityError → 400 "Subcategory with this slug already exists
  for the category." ActivityLog.
- `PATCH /api/subcategories/<id>` — admin. Validates categoryId existence
  only when it changes; validates status. Catches IntegrityError. ActivityLog.
- `DELETE /api/subcategories/<id>` — admin. ActivityLog.

### Users (buyers)
- `GET /api/users` — admin. Ordered by created_at desc.
- `POST /api/users` — admin. Validates role ∈ {buyer, member}, status ∈
  {active, inactive, suspended}. Hashes password via `make_password`
  (default "demo1234"). Catches IntegrityError → 400. ActivityLog. Returns
  `{ok:true, user:{id}}` (201).
- `PATCH /api/users/<id>` — admin. Partial whitelist of 15 identity +
  registration-capture fields. Re-hashes password only when a non-empty
  string is provided. Catches IntegrityError. ActivityLog.
- `DELETE /api/users/<id>` — admin. ActivityLog.

### Admins
- `GET /api/admins` — admin. Ordered by created_at desc.
- `POST /api/admins` — admin. Validates status enum; validates roleId
  existence when provided. Hashes password (default "demo1234"). Derives
  `avatar_initials` from name. Catches IntegrityError → 400. **Emits
  Notification** (type "admin_created", title "Admin account created",
  message `f"{admin.name} created an admin account for {name}."`).
  ActivityLog. Returns `{ok:true, admin:{id}}` (201).
- `PATCH /api/admins/<id>` — admin. Partial whitelist. Re-validates roleId
  if changing; re-validates status. Recomputes avatar_initials when name
  changes. Re-hashes password only when non-empty. Catches IntegrityError.
  ActivityLog.
- `DELETE /api/admins/<id>` — admin. ActivityLog.

### Roles
- `GET /api/roles` — admin. Ordered by name asc.
- `POST /api/roles` — admin. Auto-slug. Catches IntegrityError → 400.
  ActivityLog. Returns `{ok:true, role:{id, slug}}` (201).
- `PATCH /api/roles/<id>` — admin. Partial whitelist including `permissions`
  (dict) and `isSystem`. Catches IntegrityError. ActivityLog.
- `DELETE /api/roles/<id>` — admin. Refuses system roles
  (`is_system=True` → 400 "System roles cannot be deleted."). Also refuses
  deletion when the role is still assigned to admin accounts
  (`AdminUser.filter(role_id=id).count() > 0` → 400 "Cannot delete a role
  that is still assigned to admin accounts."). ActivityLog.

### Notifications
- `GET /api/notifications` — admin. Newest first.
- `PATCH /api/notifications/<id>` — admin. Body {read:bool}. Returns
  `{ok:true, read}`.
- `DELETE /api/notifications/<id>` — admin.
- `POST /api/notifications/read-all` — admin.
  `Notification.filter(read=False).update(read=True)`.

### Activity / Settings / Bootstrap / Profile
- `GET /api/activity` — admin. Optional `?limit=` (default 300, max 500).
- `GET /api/settings` — public. Reads Setting rows for
  brand/marketplace/homepage/security; missing → null. Returns
  `{brand, marketplace, homepage, security}`.
- `PATCH /api/settings` — admin. Body may include any subset of
  {brand, marketplace, homepage, security}. `Setting.objects.update_or_create`
  per key. ActivityLog. Returns `{ok:true}`.
- `GET /api/bootstrap` — admin. Builds overview counts, recentInquiries[:5],
  recentServices[:5], recentActivity[:6], 12-week chartData
  ({week:"W1".."W12", inquiries, requests}), categoryDistribution
  ([{name, count}] mapping category_id → Category.name). Returns
  `{overview, recentInquiries, recentServices, recentActivity, chartData,
  categoryDistribution}`.
- `PATCH /api/profile` — buyer only. Accepts name/company/phone/country;
  rejects empty name with 400; rejects no-op body with 400 "Nothing to
  update." ActivityLog. Returns `{ok:true, user: user_dto(updated)}`.

## Auth / cookie handling pattern
For login/signup, the auth helpers in `api/auth.py` call
`response.set_cookie(SESSION_COOKIE, ...)` on the response object passed
to them. Because `JsonResponse` serializes its body at construction time
and I don't have the `User` / `AdminUser` object until the helper returns,
I use a placeholder-body pattern:

```python
response = JsonResponse({}, status=200)
user, err = sign_up_buyer(payload, response, ua)
if err:
    return json_error(err, 400)
# set_cookie has already populated response.cookies; just rewrite the body.
response.content = json.dumps({"ok": True, "user": user_dto(user)}).encode("utf-8")
return response
```

The Content-Type header stays `application/json` (set by JsonResponse's
constructor) and the cookie set by the helper is preserved.

## Final checks
- `cd /home/z/my-project/backend && python manage.py check` →
  **System check identified no issues (0 silenced).**
- `python -m py_compile api/views.py api/urls.py` → **COMPILE OK**.
- Test-client smoke tests:
  - `GET /api/auth/me` → 200 `{ok:false}` (no session).
  - `POST /api/auth/logout` → 200 `{ok:true}`.
  - `GET /api/auth/login` (wrong method) → 405.
  - `PATCH /api/auth/me` (wrong method) → 405.
  - `GET /api/unknown-path` → 404.
  - `POST /api/inquiries` bad type → 400 "Invalid inquiry type.".
  - `POST /api/inquiries` missing fields → 400 "name, email and type are required.".
  - `POST /api/inquiries` malformed JSON → 400 "Invalid JSON body.".
  - `POST /api/inquiries` empty body → 400 "name, email and type are required."
    (DRF parses empty content as `{}`; downstream validation catches the
    missing fields — same observable behavior as Next.js's empty-body case).
- All 36 URL patterns resolve correctly. URL ordering verified: specific
  sub-paths (convert, status, featured, duplicate, read-all, messages)
  resolve before `<str:id>`.

## Judgment calls

1. **`_body(request)` returns `None` for non-dict parsed JSON.** Next.js's
   `parseBody` returns the raw parsed value (could be array/scalar), but
   every downstream handler treats it as a dict. Restricting to dict and
   otherwise returning `None` (→ "Invalid JSON body.") is a defensive
   simplification; clients always send JSON objects for these endpoints.

2. **Roles DELETE keeps the extra admins-on-role guard.** The spec only
   explicitly requires the `is_system` guard, but the Next.js route also
   refuses deletion when the role is still assigned to admin accounts
   (because `AdminUser.role_id` is non-nullable, deleting a referenced
   role would orphan those rows). I mirrored Next.js exactly per the
   "frontend must not be able to tell whether Next.js or Django is serving"
   requirement.

3. **`_iso_now()` uses `timezone.now().isoformat()`** (e.g.
   `2025-11-18T12:34:56.789+00:00`). Next.js uses `new Date().toISOString()`
   (e.g. `2025-11-18T12:34:56.789Z`). Both are valid ISO-8601; the
   frontend parses these via `new Date(...)` so the format difference is
   not observable. The same applies to DTO date fields (the existing
   `api/dto.py` `_iso()` helper uses `.isoformat()` too).

4. **Service search uses `Q(tags__icontains=search)`.** The `tags` field
   is a `JSONField` (stored as TEXT on SQLite); `__icontains` performs a
   substring LIKE on the serialized JSON text, which matches Prisma's
   `tags: { contains: search }` behavior closely enough for the catalog
   search use case.

5. **`requests/<id>` GET for non-admin returns `unauthorized()` with
   default "Sign in required." message.** The spec said "admin (buyer
   detail not exposed here)" but doesn't specify the non-admin response;
   I matched the Next.js behavior (`unauthorized()` with no custom
   message).

6. **`requests/<id>` GET 404 uses default "Not found." message.** Next.js
   calls `notFound()` with no argument (default message). Mirrored.

7. **`convert` returns 500 on unexpected exceptions.** The spec only
   lists 200/201/400/401/404, but the Next.js route has a `catch` block
   that returns `serverError("Failed to convert request to order.")`.
   Mirrored to keep parity. All the explicit validation paths still
   return 400 as specified.

8. **Auth signup/login cookie pattern.** I chose to overwrite
   `response.content` on the placeholder response rather than create two
   responses and copy the cookie morsel across — both work, but the
   overwrite approach is simpler and avoids re-deriving cookie attributes
   (max-age, samesite, etc.).

9. **`inquiry.id.upper()` for the `reference` field** matches Next.js's
   `inquiry.id.toUpperCase()`. The cuid-style hex ids are uppercase-safe.

10. **Wishlist slugs list excludes orphans.** Next.js does
    `services.map(s => s.slug)` — only slugs of services that exist in
    the Service table. Mirrored exactly (so a wishlist row pointing at a
    deleted service does not appear in `slugs`).

No files outside `backend/api/views.py` and `backend/api/urls.py` were
modified. No migrations were run (per task instructions: "Do NOT run
migrate or runserver"). No tests written (per task instructions).
