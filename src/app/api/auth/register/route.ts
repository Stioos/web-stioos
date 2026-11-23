import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  json,
  error,
  success,
} from "@/lib/auth";

// Always evaluate fresh — never cache auth responses.
export const dynamic = "force-dynamic";

interface RegisterBody {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  company?: unknown;
  phone?: unknown;
  country?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;

/**
 * POST /api/auth/register
 * Buyer registration. Creates a new buyer user, hashes the password, and
 * returns the public user record plus a fresh access/refresh token pair.
 *
 * Request body: { name, email, password, company?, phone?, country? }
 * 201 → { success: true, data: { user: { id, name, email, role }, accessToken, refreshToken } }
 * 400 → validation error
 * 409 → email already registered
 */
export async function POST(request: NextRequest) {
  let body: RegisterBody;
  try {
    body = (await request.json()) as RegisterBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  // ---- Validation -----------------------------------------------------------
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const country = typeof body.country === "string" ? body.country.trim() : "";

  if (!name) return error("Name is required", 400);
  if (name.length > MAX_NAME_LENGTH)
    return error(`Name must be ${MAX_NAME_LENGTH} characters or fewer`, 400);
  if (!email) return error("Email is required", 400);
  if (email.length > MAX_EMAIL_LENGTH)
    return error(`Email must be ${MAX_EMAIL_LENGTH} characters or fewer`, 400);
  if (!EMAIL_RE.test(email)) return error("Please enter a valid email address", 400);
  if (!password) return error("Password is required", 400);
  if (password.length < MIN_PASSWORD_LENGTH)
    return error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);

  try {
    // ---- Uniqueness check ----------------------------------------------------
    // Pre-check first so we can return a clean 409 (vs. catching the
    // Prisma P2002 unique-constraint error which is also valid but less
    // ergonomic for callers).
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return json({ error: "An account with this email already exists" }, 409);
    }

    // ---- Create user ---------------------------------------------------------
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name,
        company,
        phone,
        country,
        role: "buyer",
        status: "active",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // ---- Tokens --------------------------------------------------------------
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(tokenPayload),
      signRefreshToken(tokenPayload),
    ]);

    return success(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      201
    );
  } catch (err) {
    console.error("[auth/register] error:", err);
    return error("Unable to create account. Please try again.", 500);
  }
}
