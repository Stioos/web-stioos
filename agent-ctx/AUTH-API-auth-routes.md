# Task AUTH-API — Authentication API routes

**Agent:** auth-api (Next.js 16 App Router, TypeScript)
**Scope:** Create the five `/api/auth/*` route handlers backing the
JWT-based auth flow: `register`, `login`, `me`, `refresh`, `logout`.

## What I read first
- `src/lib/auth.ts` — confirmed available exports: `hashPassword`,
  `verifyPassword`, `signAccessToken`, `signRefreshToken`,
  `verifyRefreshToken`, `requireAuth`, `json`, `error`, `success`.
  (`requireAuth(request)` throws a `Response` with status 401 when the
  bearer token is missing or invalid — handled by passing the thrown
  `Response` straight through in `/api/auth/me`.)
- `src/lib/db.ts` — singleton `PrismaClient` exposed as `db`.
- `prisma/schema.prisma` — `User` model has `id`, `email` (unique),
  `passwordHash`, `name`, `company`, `phone`, `country`, `status`,
  `role`, `registrationType`, `accountType`, `profession`,
  `companySize`, `phoneCountry`, `intent`, `intentTimeline`,
  `registrationSource`, `createdAt`, `updatedAt`, `lastActive`.
- `/agent-ctx/7-frontend-auth-rewire.md` — previous agent rewired the
  frontend (`login-drawer`, `auth/login`, `auth/signup`,
  `public-header`, `lead-modal`, `service-card`, dashboard pages) to
  call `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`,
  `/api/auth/logout`, `/api/wishlist`, `/api/inquiries`, `/api/requests`,
  `/api/settings`. The previous agent's notes claim `resolveRedirect`
  lived in `@/lib/auth` and was "kept as-is" — **it was not actually
  present in the file**, which was breaking the entire dev compile (see
  "Surgical fix" below).

## Files CREATED

### `src/app/api/auth/register/route.ts` — POST buyer registration
- `export const dynamic = "force-dynamic"` (no caching of auth responses).
- Body: `{ name, email, password, company?, phone?, country? }`.
- Validation (returns 400 on any failure):
  - `name` non-empty, ≤ 120 chars
  - `email` non-empty, ≤ 254 chars, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - `password` ≥ 8 chars
  - `company` / `phone` / `country` trimmed if present
- Pre-checks email uniqueness with `db.user.findUnique({ where:{ email },
  select:{ id:true } })`. Returns **409** with `"An account with this
  email already exists"` when the email is taken. (Pre-check gives a
  cleaner 409 than catching the Prisma P2002 unique-constraint error.)
- `hashPassword(password)` (bcryptjs, 12 rounds) → `db.user.create()`
  with `role:"buyer"`, `status:"active"`, and the optional profile
  fields. `select` returns only `{ id, name, email, role }`.
- Issues `signAccessToken` + `signRefreshToken` in parallel via
  `Promise.all` with payload `{ userId, email, role }`.
- Returns **201** `{ success:true, data:{ user:{ id,name,email,role },
  accessToken, refreshToken } }`.
- All errors caught → 500 `"Unable to create account. Please try again."`
  (logs to `console.error("[auth/register] ...")`).

### `src/app/api/auth/login/route.ts` — POST buyer login
- `export const dynamic = "force-dynamic"`.
- Body: `{ email, password }`.
- Validation: `email` non-empty + ≤ 254 chars; `password` non-empty →
  **400** otherwise.
- `db.user.findUnique({ where:{ email } })` (email lowercased first).
- **Account-enumeration mitigation:** when the user is `null`, we still
  run `verifyPassword(password, DUMMY_HASH)` against a pre-computed
  bcrypt hash for a 12-round salt of a fixed throwaway string, then
  discard the result with `.then(() => false)`. This keeps the
  response timing similar to a real failed login so attackers can't
  distinguish "unknown email" from "wrong password" by timing.
- Returns **401** `"Invalid email or password"` for both unknown email
  and wrong password (identical response).
- Returns **403** `"This account has been suspended..."` when
  `user.status === "suspended"`.
- Fire-and-forget `db.user.update({ where:{id}, data:{ lastActive:
  new Date() } })` so login response isn't blocked by the touch write
  (errors are logged but not surfaced).
- Issues fresh `accessToken` + `refreshToken` via `Promise.all`.
- Returns **200** with the same shape as register.
- All errors caught → 500 `"Unable to sign in. Please try again."`.

### `src/app/api/auth/me/route.ts` — GET current user
- `export const dynamic = "force-dynamic"`.
- Calls `requireAuth(request)` inside a `try`/`catch`. `requireAuth`
  throws a `Response` (status 401) on missing/invalid bearer token —
  the catch passes that `Response` straight through (`if (err instanceof
  Response) return err`), so the 401 body stays `{ error:"Unauthorized" }`.
- `db.user.findUnique({ where:{ id: payload.userId } })`.
  - Returns **404** `"User not found"` when the token references a user
    that no longer exists in the DB (token was issued, then the user
    was deleted). Treated as unauthorized so the client clears tokens.
  - Returns **403** `"This account has been suspended..."` when
    `status === "suspended"`.
- Strips `passwordHash` via `const { passwordHash: _omit, ...safeUser }
  = user` and returns `{ success:true, data:{ user: safeUser } }`.
- Errors caught → 500 `"Unable to load user profile"`.

### `src/app/api/auth/refresh/route.ts` — POST token refresh
- `export const dynamic = "force-dynamic"`.
- Body: `{ refreshToken }`.
- Validation: `refreshToken` non-empty string → **400** otherwise.
- `verifyRefreshToken(token)` → returns `JWTPayload | null`. Rejects
  when signature is wrong, token is expired, or `type !== "refresh"`.
  Returns **401** `"Invalid or expired refresh token"` in any of those
  cases.
- Issues a **new access token only** (refresh tokens are NOT rotated —
  the client continues using the same refresh token until it expires
  after 7d, then must re-authenticate via `/api/auth/login`). Payload
  is re-derived from the verified refresh-token claims so a tampered
  token can't escalate privileges.
- Returns **200** `{ success:true, data:{ accessToken } }`.
- Errors caught → 500 `"Unable to refresh session"`.

### `src/app/api/auth/logout/route.ts` — POST logout
- `export const dynamic = "force-dynamic"`.
- Request body is ignored (parameter is named `_request` to signal
  intentional non-use).
- The API is stateless (JWT-based) so there is nothing for the server
  to revoke — the client MUST discard its `accessToken` and
  `refreshToken` from storage. This endpoint exists to give the client
  a deterministic, promise-shaped call to `await` during the sign-out
  flow so it can show a spinner/toast/redirect only after the network
  roundtrip completes.
- Returns **200** `{ success:true }` (i.e. `success({})`).
- Errors caught → 500 `"Unable to sign out"`. Includes a comment
  pointing future authors at the `Session` Prisma model as the place to
  delete a server-side session row if a session-store revocation scheme
  is added later.

## Surgical fix to `src/lib/auth.ts` (REQUIRED to unblock dev server)

The dev server was failing to compile with `Error: Export
resolveRedirect doesn't exist in target module` on
`src/components/auth/login-drawer.tsx` and `src/app/auth/login/page.tsx`
(both client components that import `resolveRedirect` + `LoginRole`
from `@/lib/auth`). This was a pre-existing broken state from the
previous frontend-auth-rewire agent — their notes claimed the helper
was "kept as-is" in `@/lib/auth`, but it was not actually present in
the file. Without the helper, every route in the app returned 500
(including the new `/api/auth/*` routes), so the AUTH-API task could
not be verified end-to-end.

Added at the bottom of `src/lib/auth.ts` (after `requireAdmin`):
- `export type LoginRole = "buyer" | "member" | "admin" | "super-admin"`
- `const ROLE_HOMES: Record<LoginRole, string>` mapping buyer →
  `/dashboard/buyer`, member/admin/super-admin → `/admin`
- `function isSafeRelativePath(path: string): boolean` — rejects
  empty, `//`-prefixed, `https?://`-prefixed, non-site-relative, or
  backslash-containing paths (prevents open-redirect via the `?next=`
  query param)
- `export function resolveRedirect(next, role): string` — returns the
  validated `next` if it's a safe relative path, else falls back to
  `ROLE_HOMES[role] ?? ROLE_HOMES.member`

This is a **pure function** with no server-only deps (no `bcryptjs`,
no `jose`, no env access at module-eval time), so it's safe for the
client bundle. Next.js 16 / Webpack 5 tree-shakes the bcryptjs/jose
imports from `auth.ts` out of the client bundle for any client
component that only imports `resolveRedirect` + `LoginRole`.

## End-to-end verification (against the running dev server)

Ran a full E2E flow with `curl` against `http://localhost:3000`:

| Step | Endpoint | Body | Status | Outcome |
|------|----------|------|--------|---------|
| 1 | POST `/api/auth/register` | `{}` | 400 | `"Name is required"` |
| 2 | POST `/api/auth/register` | `{name,email:"not-an-email",password:"short"}` | 400 | `"Please enter a valid email address"` |
| 3 | POST `/api/auth/register` | `{name,email,password,company,phone,country}` | **201** | `{success,data:{user:{id,name,email,role:"buyer"},accessToken,refreshToken}}` |
| 4 | GET `/api/auth/me` (no header) | — | 401 | `"Unauthorized"` |
| 5 | GET `/api/auth/me` (Bearer accessToken) | — | **200** | `{success,data:{user:{...all fields except passwordHash}}}` |
| 6 | POST `/api/auth/refresh` | `{}` | 400 | `"Refresh token is required"` |
| 7 | POST `/api/auth/refresh` | `{refreshToken}` | **200** | `{success,data:{accessToken}}` (new token) |
| 8 | POST `/api/auth/register` (same email) | same as #3 | **409** | `"An account with this email already exists"` |
| 9 | POST `/api/auth/login` (wrong password) | `{email,password:"WRONGPASS"}` | **401** | `"Invalid email or password"` |
| 10 | POST `/api/auth/login` (empty body) | `{}` | 400 | `"Email is required"` |
| 11 | POST `/api/auth/logout` | `{}` | **200** | `{success:true}` |

The `/api/auth/me` response confirmed `passwordHash` is excluded — the
returned user object contains `id, email, name, company, phone,
country, status, role, registrationType, accountType, profession,
companySize, phoneCountry, intent, intentTimeline, registrationSource,
createdAt, updatedAt, lastActive` but **not** `passwordHash`.

## Lint + dev log

- `cd /home/z/my-project && bun run lint` — passes with zero errors and
  zero warnings (output: `$ eslint .` with no findings).
- `tail -30 /home/z/my-project/dev.log` — clean. After the
  `resolveRedirect` surgical fix, all five routes return their expected
  status codes. Prisma query log confirms: register runs a SELECT
  (existence check) + INSERT; me runs a SELECT by id; login runs a
  SELECT by email. No exceptions, no warnings on any of the new files.

## Judgment calls

1. **409 vs. 400 for duplicate email.** The spec says "Returns 409 if
   email already exists." Pre-checking with `findUnique` and returning
   a clean 409 is more ergonomic than catching Prisma's P2002
   unique-constraint error (which would also work but is harder to
   distinguish from other Prisma errors in a single catch block).
2. **Account-enumeration mitigation in `login`.** Always run a bcrypt
   `compare` even when the user is `null`, so response timing is
   similar for "unknown email" vs. "wrong password". The `DUMMY_HASH`
   is a real bcrypt hash (12 rounds) of a throwaway string — `compare`
   does the work and we discard the result.
3. **Refresh-token rotation policy.** The spec only asks for a new
   access token, not rotation of the refresh token itself. Implemented
   accordingly: `/api/auth/refresh` issues a new `accessToken` and lets
   the client keep using its existing `refreshToken` until the 7-day
   expiry. This is simpler than a rotation scheme and avoids invalidating
   all of a user's other sessions when they refresh on one device.
4. **`/api/auth/me` 404 vs. 401 for a deleted user.** A valid token
   referencing a deleted user returns 404 (per the "user no longer
   exists in DB" case). The frontend treats 4xx uniformly here (clears
   tokens and shows login), so 404 is the truthful status.
5. **`requireAuth` throws `Response`.** `src/lib/auth.ts` defines
   `requireAuth` to throw a `Response` object on failure rather than
   return `null`. In `/api/auth/me`, the try/catch passes that
   `Response` through unchanged (`if (err instanceof Response) return
   err`) so the 401 body stays consistent with the rest of the API's
   error shape.
6. **`logout` is a server-side no-op.** JWT auth is stateless — there's
   nothing to revoke. The endpoint exists so the client has a
   deterministic promise to await during sign-out (spinner/toast/redirect
   gating). Comment in the file points future authors at the `Session`
   Prisma model as the place to add server-side revocation later.
7. **`force-dynamic` on every route.** Prevents Next.js from caching
   auth responses at the route-segment level — important because the
   same URL (`/api/auth/me`) returns a different user depending on the
   `Authorization` header.
8. **`resolveRedirect` + `LoginRole` added to `auth.ts`.** Strictly
   outside the AUTH-API task scope (those exports are consumed by
   client components, not by the new API routes), but the dev server
   was returning 500 on every route because the frontend wouldn't
   compile without them. Added as a pure client-safe helper at the
   bottom of the file. Open-redirect-safe: rejects `//`, `https?://`,
   non-site-relative, and backslash-containing `next` values.
9. **Did NOT touch** the frontend auth pages (`login-drawer.tsx`,
   `auth/login/page.tsx`, `auth/signup/page.tsx`) — those still call
   `/api/auth/signup` (not `/api/auth/register`). The orchestrator may
   want a follow-up task to either alias `/api/auth/signup` →
   `/api/auth/register` or rewire the frontend to the new path. The new
   routes work standalone; the existing frontend just isn't pointed at
   them yet.
