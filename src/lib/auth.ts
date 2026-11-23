import { compare, genSalt, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// ============================================================
// AUTH UTILITIES — JWT + bcrypt for password hashing
// ============================================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "stioos-dev-secret-change-in-production-min-32-chars"
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || "stioos-dev-refresh-secret-change-prod-32-chars"
);

const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(12);
  return hash(password, salt);
}

export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return compare(password, passwordHash);
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type: "access" | "refresh";
}

export async function signAccessToken(payload: Omit<JWTPayload, "type">): Promise<string> {
  return new SignJWT({ ...payload, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function signRefreshToken(payload: Omit<JWTPayload, "type">): Promise<string> {
  return new SignJWT({ ...payload, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ============================================================
// API HELPERS — consistent JSON responses
// ============================================================

export function json(body: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function error(message: string, status = 400) {
  return json({ error: message }, status);
}

export function success(data: unknown, status = 200) {
  return json({ success: true, data }, status);
}

// ============================================================
// AUTH MIDDLEWARE — extract user from Authorization header
// ============================================================

export async function getAuthUser(request: Request): Promise<JWTPayload | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  return verifyAccessToken(token);
}

export async function requireAuth(request: Request): Promise<JWTPayload> {
  const user = await getAuthUser(request);
  if (!user) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

export async function requireAdmin(request: Request): Promise<JWTPayload> {
  const user = await requireAuth(request);
  if (user.role !== "admin" && user.role !== "super-admin") {
    throw new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

// ============================================================
// CLIENT-SAFE REDIRECT HELPER
// ============================================================
// Pure function — safe to import from client components. Maps a
// post-auth role to the right workspace route, honoring an optional
// `?next=` override (validated to be a relative path so an attacker
// can't craft an open-redirect via the query string).

export type LoginRole = "buyer" | "member" | "admin" | "super-admin";

const ROLE_HOMES: Record<LoginRole, string> = {
  buyer: "/dashboard/buyer",
  member: "/admin",
  admin: "/admin",
  "super-admin": "/admin",
};

function isSafeRelativePath(path: string): boolean {
  if (!path) return false;
  if (path.startsWith("//")) return false; // protocol-relative URL
  if (/^https?:\/\//i.test(path)) return false; // absolute URL
  if (!path.startsWith("/")) return false; // must be site-relative
  // Block any backslash-based trickery that browsers might normalise
  // to a protocol-relative URL.
  if (path.includes("\\")) return false;
  return true;
}

export function resolveRedirect(
  next: string | null | undefined,
  role: LoginRole | string | undefined
): string {
  if (typeof next === "string" && next.trim() && isSafeRelativePath(next.trim())) {
    return next.trim();
  }
  const resolvedRole = (role ?? "member") as LoginRole;
  return ROLE_HOMES[resolvedRole] ?? ROLE_HOMES.member;
}
