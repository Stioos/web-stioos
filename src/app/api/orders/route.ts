import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — a buyer's order list is per-user and changes
// on every mutation. Never serve from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/orders
// Lists the authenticated buyer's own orders, newest first.
//
// Auth: `Authorization: Bearer <accessToken>`. Any authenticated user may
// call this — admins see only their own orders here; the all-buyers admin
// view lives at /api/admin/orders.
//
// Query params:
//   status   optional — single status value (pending | in_progress |
//             delivered | completed | cancelled). When omitted, every
//             status is returned.
//   page     default 1 (min 1)
//   limit    default 20 (min 1, max 100)
//
// 200 → { success: true, data: { orders, total, page, limit, totalPages } }
// 401 → no/invalid bearer token
// ============================================================

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Whitelist of MarketOrder.status values. A typo in the query string is
// treated as "no filter" rather than 500'ing the call.
const VALID_STATUSES = new Set([
  "pending",
  "in_progress",
  "delivered",
  "completed",
  "cancelled",
]);

export async function GET(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/orders] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  try {
    const params = request.nextUrl.searchParams;

    // ---- Pagination ---------------------------------------------------
    const page = Math.max(1, Number(params.get("page")) || 1);
    const requestedLimit = Number(params.get("limit")) || DEFAULT_LIMIT;
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number.isFinite(requestedLimit) ? requestedLimit : DEFAULT_LIMIT)
    );

    // ---- Filter -------------------------------------------------------
    const statusParam = params.get("status")?.trim() || null;

    // Always scoped to the authenticated buyer so a buyer can never see
    // another buyer's orders — even if a forged query string slips through.
    const where: Prisma.MarketOrderWhereInput = { buyerId: user.userId };

    if (statusParam && VALID_STATUSES.has(statusParam)) {
      where.status = statusParam;
    }

    // ---- Query: paged rows + total count in parallel -----------------
    // Eagerly include the linked invoice + request so the buyer dashboard
    // can render the order row + payment status without N+1 follow-up
    // calls. Both are 1:1 relations on MarketOrder.
    const [orders, total] = await Promise.all([
      db.marketOrder.findMany({
        where,
        orderBy: { placedAt: "desc" },
        include: {
          invoice: {
            select: {
              id: true,
              reference: true,
              status: true,
              total: true,
              dueDate: true,
            },
          },
          request: {
            select: {
              id: true,
              reference: true,
              title: true,
              status: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.marketOrder.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return success({ orders, total, page, limit, totalPages });
  } catch (err) {
    console.error("[api/orders] GET error:", err);
    return error("Unable to load orders", 500);
  }
}
