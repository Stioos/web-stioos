import { cache } from "react";
import { cookies, headers } from "next/headers";

/**
 * Server-side session resolution — backed by the Django /api/auth/me
 * endpoint. The HTTP-only `stioos-session` cookie is forwarded to Django,
 * which owns all session state. No Prisma / Next.js API routes involved.
 */

export const SESSION_COOKIE = "stioos-session";
const DJANGO = "http://127.0.0.1:8000";

// ---------- DTO types (match the frontend User/AdminUser shapes) ----------

export interface BuyerDTO {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  status: string;
  role: "buyer" | "member";
  inquiriesCount: number;
  createdAt: string;
  lastActive: string | null;
  registrationType?: string | null;
  accountType?: string | null;
  profession?: string | null;
  companySize?: string | null;
  phoneCountry?: string | null;
  intent?: string | null;
  intentTimeline?: string | null;
  registrationSource?: string | null;
}

export interface AdminDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  status: string;
  title: string;
  lastActive: string | null;
  createdAt: string;
  avatarInitials?: string | null;
}

export interface RoleDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: Record<string, string[]>;
  isSystem: boolean;
  createdAt: string;
}

export type SessionKind = "buyer" | "admin";
export interface BuyerSession {
  kind: "buyer";
  user: BuyerDTO;
}
export interface AdminSession {
  kind: "admin";
  admin: AdminDTO;
}
export type CurrentSession = BuyerSession | AdminSession | null;

// ---------- cookie forwarding ----------

/**
 * Forward the incoming request's cookies to Django. Uses the raw `cookie`
 * header from `headers()` (robust across hot-reloads) and falls back to
 * `cookies().get()` for the session token if the raw header is missing.
 */
async function cookieHeader(): Promise<Record<string, string>> {
  const h = await headers();
  const raw = h.get("cookie");
  if (raw) return { cookie: raw };
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) return { cookie: `${SESSION_COOKIE}=${token}` };
  return {};
}

// ---------- session resolution ----------

export const getCurrentSession = cache(async (): Promise<CurrentSession> => {
  try {
    const res = await fetch(`${DJANGO}/api/auth/me`, {
      headers: await cookieHeader(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.ok) return null;
    if (data.kind === "admin" && data.admin)
      return { kind: "admin", admin: data.admin as AdminDTO };
    if (data.kind === "buyer" && data.user)
      return { kind: "buyer", user: data.user as BuyerDTO };
    return null;
  } catch {
    return null;
  }
});

export async function getCurrentBuyer(): Promise<BuyerDTO | null> {
  const s = await getCurrentSession();
  return s && s.kind === "buyer" ? s.user : null;
}

export async function getCurrentAdmin(): Promise<AdminDTO | null> {
  const s = await getCurrentSession();
  return s && s.kind === "admin" ? s.admin : null;
}
