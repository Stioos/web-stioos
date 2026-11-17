import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";

/**
 * Server-only auth helpers backed by the Session table + an HTTP-only cookie.
 * Sessions are opaque random tokens; the cookie is `stioos-session`.
 */

export const SESSION_COOKIE = "stioos-session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

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

// ---------- DTOs (no password hashes ever leave the server) ----------

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

export function toBuyerDTO(u: {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  status: string;
  role: string;
  inquiriesCount: number;
  createdAt: Date;
  lastActive: Date | null;
  registrationType: string | null;
  accountType: string | null;
  profession: string | null;
  companySize: string | null;
  phoneCountry: string | null;
  intent: string | null;
  intentTimeline: string | null;
  registrationSource: string | null;
}): BuyerDTO {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    company: u.company,
    phone: u.phone,
    country: u.country,
    status: u.status,
    role: u.role === "member" ? "member" : "buyer",
    inquiriesCount: u.inquiriesCount,
    createdAt: u.createdAt.toISOString(),
    lastActive: u.lastActive ? u.lastActive.toISOString() : null,
    registrationType: u.registrationType,
    accountType: u.accountType,
    profession: u.profession,
    companySize: u.companySize,
    phoneCountry: u.phoneCountry,
    intent: u.intent,
    intentTimeline: u.intentTimeline,
    registrationSource: u.registrationSource,
  };
}

export function toAdminDTO(a: {
  id: string;
  name: string;
  email: string;
  phone: string;
  roleId: string;
  status: string;
  title: string;
  lastActive: Date | null;
  createdAt: Date;
  avatarInitials: string | null;
}): AdminDTO {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone,
    roleId: a.roleId,
    status: a.status,
    title: a.title,
    lastActive: a.lastActive ? a.lastActive.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
    avatarInitials: a.avatarInitials,
  };
}

export function toRoleDTO(r: {
  id: string;
  name: string;
  slug: string;
  description: string;
  permissions: unknown;
  isSystem: boolean;
  createdAt: Date;
}): RoleDTO {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    permissions: (r.permissions as Record<string, string[]>) ?? {},
    isSystem: r.isSystem,
    createdAt: r.createdAt.toISOString(),
  };
}

// ---------- password ----------

export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, 10);
}
export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return compare(plain, hashed);
}

// ---------- session ----------

async function createSession(
  kind: SessionKind,
  userId: string,
  userAgent?: string | null
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.session.create({
    data: { token, kind, userId, expiresAt, userAgent: userAgent ?? null },
  });
  return token;
}

export async function setSessionCookie(token: string): Promise<void> {
  const c = await cookies();
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(SESSION_COOKIE);
}

// ---------- current user resolution ----------

/** Reads the session cookie and returns the resolved buyer/admin, or null. */
export async function getCurrentSession(): Promise<CurrentSession> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { token },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  if (session.kind === "admin") {
    const admin = await db.adminUser.findUnique({
      where: { id: session.userId },
    });
    if (!admin) return null;
    return { kind: "admin", admin: toAdminDTO(admin) };
  }
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return null;
  return { kind: "buyer", user: toBuyerDTO(user) };
}

export async function getCurrentBuyer(): Promise<BuyerDTO | null> {
  const s = await getCurrentSession();
  if (s?.kind === "buyer") return s.user;
  return null;
}

export async function getCurrentAdmin(): Promise<AdminDTO | null> {
  const s = await getCurrentSession();
  if (s?.kind === "admin") return s.admin;
  return null;
}

/** Throws-like helper for route handlers — returns the buyer or a 401 Response. */
export async function requireBuyer(): Promise<
  { ok: true; user: BuyerDTO } | { ok: false; response: Response }
> {
  const user = await getCurrentBuyer();
  if (!user) {
    return {
      ok: false,
      response: Response.json({ error: "Sign in required" }, { status: 401 }),
    };
  }
  return { ok: true, user };
}

export async function requireAdmin(): Promise<
  { ok: true; admin: AdminDTO } | { ok: false; response: Response }
> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      ok: false,
      response: Response.json({ error: "Admin sign in required" }, { status: 401 }),
    };
  }
  return { ok: true, admin };
}

// ---------- sign in / sign out (used by /api/auth routes) ----------

export async function signInBuyer(
  email: string,
  password: string,
  userAgent?: string | null
): Promise<{ ok: boolean; error?: string; user?: BuyerDTO }> {
  const user = await db.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!user) return { ok: false, error: "No account found with this email." };
  const valid = await verifyPassword(password, user.password);
  if (!valid) return { ok: false, error: "Incorrect password." };
  if (user.status !== "active")
    return { ok: false, error: "This account is inactive." };
  const token = await createSession("buyer", user.id, userAgent);
  await setSessionCookie(token);
  await db.user.update({
    where: { id: user.id },
    data: { lastActive: new Date() },
  });
  return { ok: true, user: toBuyerDTO(user) };
}

export async function signInAdmin(
  email: string,
  password: string,
  userAgent?: string | null
): Promise<{ ok: boolean; error?: string; admin?: AdminDTO }> {
  const admin = await db.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!admin)
    return { ok: false, error: "No admin account found with this email." };
  const valid = await verifyPassword(password, admin.password);
  if (!valid) return { ok: false, error: "Incorrect password." };
  if (admin.status !== "active")
    return { ok: false, error: "This account is inactive." };
  const token = await createSession("admin", admin.id, userAgent);
  await setSessionCookie(token);
  await db.adminUser.update({
    where: { id: admin.id },
    data: { lastActive: new Date() },
  });
  return { ok: true, admin: toAdminDTO(admin) };
}

export async function signOut(): Promise<void> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { token } }).catch(() => {});
  }
  await clearSessionCookie();
}

// ---------- signup ----------

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  company?: string;
  country?: string;
  phone?: string;
  phoneCountry?: string;
  registrationType?: "professional" | "company";
  accountType?: string;
  profession?: string;
  companySize?: string;
  intent?: string;
  intentTimeline?: string;
  registrationSource?: string;
}

export async function signUpBuyer(
  input: SignUpInput,
  userAgent?: string | null
): Promise<{ ok: boolean; error?: string; user?: BuyerDTO }> {
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password || !input.name)
    return { ok: false, error: "Name, email and password are required." };
  if (input.password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." };
  const existing = await db.user.findUnique({ where: { email } });
  if (existing)
    return { ok: false, error: "An account with this email already exists." };
  const passwordHash = await hashPassword(input.password);
  const user = await db.user.create({
    data: {
      name: input.name,
      email,
      password: passwordHash,
      company: input.company ?? "",
      country: input.country ?? "",
      phone: input.phone ?? "",
      phoneCountry: input.phoneCountry ?? null,
      registrationType: input.registrationType ?? null,
      accountType: input.accountType ?? null,
      profession: input.profession ?? null,
      companySize: input.companySize ?? null,
      intent: input.intent ?? null,
      intentTimeline: input.intentTimeline ?? null,
      registrationSource: input.registrationSource ?? null,
      role: "buyer",
      status: "active",
    },
  });
  const token = await createSession("buyer", user.id, userAgent);
  await setSessionCookie(token);
  return { ok: true, user: toBuyerDTO(user) };
}
