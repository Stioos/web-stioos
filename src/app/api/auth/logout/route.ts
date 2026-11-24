import { NextRequest } from "next/server";
import { success, error } from "@/lib/auth";

// Always evaluate fresh — never cache auth responses.
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/logout
 * Client-side token removal. This API is stateless (JWT-based), so the
 * server has nothing to revoke — the client MUST discard its accessToken
 * and refreshToken from storage. This endpoint exists to give the client
 * a deterministic, promise-shaped call to await during the sign-out flow
 * (so it can show a spinner / toast / redirect only after the network
 * roundtrip completes).
 *
 * Body: optional, ignored.
 * 200 → { success: true }
 */
export async function POST(_request: NextRequest) {
  try {
    // Intentionally a no-op on the server. If a server-side session store
    // (e.g. a Prisma `Session` row keyed by refresh token) is added later,
    // this is the place to delete it.
    return success({});
  } catch (err) {
    console.error("[auth/logout] error:", err);
    return error("Unable to sign out", 500);
  }
}
