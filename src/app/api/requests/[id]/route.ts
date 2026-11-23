import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — a single request's status / quote linkage can
// change at any time and we never want a stale detail response cached.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/requests/[id]
// Fetches a single service request by ID.
//
// Auth: the authenticated buyer may only fetch their own requests. An
// admin (role `admin` or `super-admin`) may fetch any request — used by
// the admin dashboard's detail view.
//
// 200 → { success: true, data: { request } }
// 401 → no/invalid bearer token
// 403 → request exists but doesn't belong to the authenticated buyer
//       (and the caller isn't an admin)
// 404 → no request with that id
// ============================================================

const ADMIN_ROLES = new Set(["admin", "super-admin"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth -------------------------------------------------------------
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/requests/[id]] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  try {
    // ---- Route param ---------------------------------------------------
    // Next.js 16: dynamic segment params are async and arrive as a Promise.
    const { id } = await params;
    if (!id) return error("Request id is required", 400);

    // ---- Lookup --------------------------------------------------------
    const marketRequest = await db.marketRequest.findUnique({
      where: { id },
      include: {
        quote: true,
        order: true,
        invoice: true,
      },
    });

    if (!marketRequest) {
      return error("Request not found", 404);
    }

    // ---- Ownership / admin check --------------------------------------
    // A buyer may only see their own request. An admin may see any.
    // The order matters: returning 403 vs 404 leaks existence, so for
    // non-admins we explicitly return 403 (rather than 404) when the
    // request exists but isn't theirs — the spec asks for 403 in that
    // case. Admins bypass the ownership gate entirely.
    if (marketRequest.buyerId !== user.userId && !ADMIN_ROLES.has(user.role)) {
      return error("Forbidden", 403);
    }

    return success({ request: marketRequest });
  } catch (err) {
    console.error("[api/requests/[id]] error:", err);
    return error("Unable to load request", 500);
  }
}
