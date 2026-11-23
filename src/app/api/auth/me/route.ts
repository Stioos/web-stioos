import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, success, error } from "@/lib/auth";

// Always evaluate fresh — never cache auth responses.
export const dynamic = "force-dynamic";

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's full record (excluding the
 * password hash). The caller must send a valid `Authorization: Bearer
 * <accessToken>` header.
 *
 * 200 → { success: true, data: { user } }   (no passwordHash field)
 * 401 → no/invalid token (thrown by requireAuth)
 * 404 → token valid but user no longer exists in DB
 */
export async function GET(request: NextRequest) {
  let payload;
  try {
    payload = await requireAuth(request);
  } catch (err) {
    // requireAuth throws a Response (401) when the bearer token is missing
    // or invalid — pass it straight through.
    if (err instanceof Response) return err;
    console.error("[auth/me] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  try {
    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      // The token references a user that no longer exists — treat as
      // unauthorized so the client clears its tokens.
      return error("User not found", 404);
    }

    if (user.status === "suspended") {
      return error("This account has been suspended. Contact support.", 403);
    }

    // Strip the password hash before exposing the record.
    const { passwordHash: _omit, ...safeUser } = user;

    return success({ user: safeUser });
  } catch (err) {
    console.error("[auth/me] error:", err);
    return error("Unable to load user profile", 500);
  }
}
