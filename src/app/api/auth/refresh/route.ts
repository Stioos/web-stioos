import { NextRequest } from "next/server";
import {
  verifyRefreshToken,
  signAccessToken,
  error,
  success,
} from "@/lib/auth";

// Always evaluate fresh — never cache auth responses.
export const dynamic = "force-dynamic";

interface RefreshBody {
  refreshToken?: unknown;
}

/**
 * POST /api/auth/refresh
 * Exchanges a valid refresh token for a new access token. Refresh tokens
 * are NOT rotated here — the caller may continue using the same refresh
 * token until it expires (7d). When the refresh token itself expires, the
 * client must re-authenticate via /api/auth/login.
 *
 * Request body: { refreshToken }
 * 200 → { success: true, data: { accessToken } }
 * 400 → missing/invalid input
 * 401 → refresh token invalid or expired
 */
export async function POST(request: NextRequest) {
  let body: RefreshBody;
  try {
    body = (await request.json()) as RefreshBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  const refreshToken = typeof body.refreshToken === "string" ? body.refreshToken.trim() : "";

  if (!refreshToken) {
    return error("Refresh token is required", 400);
  }

  try {
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload || payload.type !== "refresh") {
      return error("Invalid or expired refresh token", 401);
    }

    // Issue a fresh access token. We deliberately re-derive the payload
    // from the verified refresh-token claims so a tampered token can't
    // escalate privileges (verifyRefreshToken already rejected any
    // signature/type mismatch above).
    const accessToken = await signAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return success({ accessToken });
  } catch (err) {
    console.error("[auth/refresh] error:", err);
    return error("Unable to refresh session", 500);
  }
}
