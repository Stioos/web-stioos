import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAdmin, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — admin views span all buyers and change per
// request; never serve from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/admin/orders
// Admin-only listing of ALL orders across every buyer.
// Powers the admin dashboard's order management view.
//
// Auth: `Authorization: Bearer <accessToken>` with role `admin` or
// `super-admin`.
//
// Query params (same shape as /api/orders, but without the buyerId
// scoping):
//   status   optional — single status value (pending | in_progress |
//             delivered | completed | cancelled). When omitted, every
//             status is returned.
//   page     default 1 (min 1)
//   limit    default 20 (min 1, max 100)
//
// 200 → { success: true, data: { orders, total, page, limit, totalPages } }
// 401 → no/invalid bearer token
// 403 → authenticated but not an admin role
// ============================================================

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const VALID_STATUSES = new Set([
  "pending",
  "in_progress",
  "delivered",
  "completed",
  "cancelled",
]);

export async function GET(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  let admin: JWTPayload;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/admin/orders] unexpected requireAdmin failure:", err);
    return error("Unauthorized", 401);
  }
  // `admin` is only used for the auth gate — this listing spans all
  // buyers, so the admin's userId doesn't filter the query.
  void admin;

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

    // Unlike /api/orders, this listing has NO buyerId scoping — admins
    // see every buyer's orders. The where clause starts empty and only
    // carries the optional status filter.
    const where: Prisma.MarketOrderWhereInput = {};

    if (statusParam && VALID_STATUSES.has(statusParam)) {
      where.status = statusParam;
    }

    // ---- Query: paged rows + total count in parallel -----------------
    // Eagerly include the linked invoice + request so the admin dashboard
    // can render the full pipeline row (order + payment + origin request)
    // without N+1 follow-up calls. Both are 1:1 relations on MarketOrder.
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
    console.error("[api/admin/orders] GET error:", err);
    return error("Unable to load orders", 500);
  }
}
