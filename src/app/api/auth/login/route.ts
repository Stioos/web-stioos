import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  error,
  success,
} from "@/lib/auth";

// Always evaluate fresh — never cache auth responses.
export const dynamic = "force-dynamic";

interface LoginBody {
  email?: unknown;
  password?: unknown;
}

const MAX_EMAIL_LENGTH = 254;

/**
 * POST /api/auth/login
 * Buyer login. Verifies credentials and issues a fresh access/refresh
 * token pair.
 *
 * Request body: { email, password }
 * 200 → { success: true, data: { user: { id, name, email, role }, accessToken, refreshToken } }
 * 400 → missing/invalid input
 * 401 → invalid credentials (deliberately identical for unknown-email vs.
 *       wrong-password to avoid account enumeration)
 */
export async function POST(request: NextRequest) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  // ---- Validation -----------------------------------------------------------
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email) return error("Email is required", 400);
  if (email.length > MAX_EMAIL_LENGTH) return error("Email is too long", 400);
  if (!password) return error("Password is required", 400);

  try {
    // ---- Lookup + verify -----------------------------------------------------
    // Always run a hash comparison even when the user doesn't exist so the
    // response timing is similar to a real login attempt (reduces
    // account-enumeration signal). The pre-computed bcrypt hash below is
    // for a 12-round salt of a fixed throwaway string.
    const DUMMY_HASH =
      "$2a$12$CwTycUXWue0Thq9StjUM0uJ8.ObQFMqJ2cGMkVqQBgnS2nRJQ6X5m";

    const user = await db.user.findUnique({ where: { email } });

    const passwordOk = user
      ? await verifyPassword(password, user.passwordHash)
      : await verifyPassword(password, DUMMY_HASH).then(() => false);

    if (!user || !passwordOk) {
      return error("Invalid email or password", 401);
    }

    if (user.status === "suspended") {
      return error("This account has been suspended. Contact support.", 403);
    }

    // ---- Update last-active --------------------------------------------------
    // Fire-and-forget — don't block the login response on this.
    void db.user
      .update({
        where: { id: user.id },
        data: { lastActive: new Date() },
        select: { id: true },
      })
      .catch((updateErr) => {
        console.error("[auth/login] failed to update lastActive:", updateErr);
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

    return success({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("[auth/login] error:", err);
    return error("Unable to sign in. Please try again.", 500);
  }
}
