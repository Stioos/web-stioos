import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAdmin, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — admin views span all buyers and change per
// request; never serve from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/admin/transactions
// Admin-only listing of ALL transactions across every buyer.
// Powers the admin dashboard's payment / refund ledger view.
//
// Auth: `Authorization: Bearer <accessToken>` with role `admin` or
// `super-admin`.
//
// Query params (same shape as /api/transactions, but without the
// buyerId scoping):
//   type     optional — single type value (payment | refund | credit |
//               debit | adjustment). When omitted, every type is returned.
//   status   optional — single status value (pending | success | failed |
//               refunded). When omitted, every status is returned.
//   page     default 1 (min 1)
//   limit    default 20 (min 1, max 100)
//
// 200 → { success: true, data: { transactions, total, page, limit, totalPages } }
// 401 → no/invalid bearer token
// 403 → authenticated but not an admin role
// ============================================================

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const VALID_TYPES = new Set([
  "payment",
  "refund",
  "credit",
  "debit",
  "adjustment",
]);

const VALID_STATUSES = new Set([
  "pending",
  "success",
  "failed",
  "refunded",
]);

export async function GET(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  let admin: JWTPayload;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/admin/transactions] unexpected requireAdmin failure:", err);
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

    // ---- Filters ------------------------------------------------------
    const typeParam = params.get("type")?.trim() || null;
    const statusParam = params.get("status")?.trim() || null;

    // Unlike /api/transactions, this listing has NO buyerId scoping —
    // admins see every buyer's transactions. The where clause starts
    // empty and only carries the optional type / status filters.
    const where: Prisma.TransactionWhereInput = {};

    if (typeParam && VALID_TYPES.has(typeParam)) {
      where.type = typeParam;
    }

    if (statusParam && VALID_STATUSES.has(statusParam)) {
      where.status = statusParam;
    }

    // ---- Query: paged rows + total count in parallel -----------------
    // Eagerly include the linked invoice + order so the admin dashboard
    // can render the full ledger row (transaction + invoice + order)
    // without N+1 follow-up calls. The invoice is a 1:many relation on
    // Transaction; the order is reachable through invoice.order but we
    // pull it explicitly via the orderId / requestId / quoteId fields
    // when present.
    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          invoice: {
            select: {
              id: true,
              reference: true,
              status: true,
              total: true,
              order: {
                select: {
                  id: true,
                  serviceName: true,
                  status: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.transaction.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return success({ transactions, total, page, limit, totalPages });
  } catch (err) {
    console.error("[api/admin/transactions] GET error:", err);
    return error("Unable to load transactions", 500);
  }
}
