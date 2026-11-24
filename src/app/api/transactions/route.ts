import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — a buyer's transaction list is per-user and
// changes on every payment. Never serve from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/transactions
// Lists the authenticated buyer's own transactions, newest first.
//
// Auth: `Authorization: Bearer <accessToken>`. Any authenticated user may
// call this — admins see only their own transactions here; the
// all-buyers admin view lives at /api/admin/transactions.
//
// Query params:
//   type     optional — single type value (payment | refund | credit |
//              debit | adjustment). When omitted, every type is returned.
//   status   optional — single status value (pending | success | failed |
//              refunded). When omitted, every status is returned.
//   page     default 1 (min 1)
//   limit    default 20 (min 1, max 100)
//
// 200 → { success: true, data: { transactions, total, page, limit, totalPages } }
// 401 → no/invalid bearer token
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
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/transactions] unexpected requireAuth failure:", err);
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

    // ---- Filters ------------------------------------------------------
    const typeParam = params.get("type")?.trim() || null;
    const statusParam = params.get("status")?.trim() || null;

    // Always scoped to the authenticated buyer so a buyer can never see
    // another buyer's transactions — even if a forged query string slips
    // through.
    const where: Prisma.TransactionWhereInput = { buyerId: user.userId };

    if (typeParam && VALID_TYPES.has(typeParam)) {
      where.type = typeParam;
    }

    if (statusParam && VALID_STATUSES.has(statusParam)) {
      where.status = statusParam;
    }

    // ---- Query: paged rows + total count in parallel -----------------
    // Eagerly include the linked invoice so the buyer dashboard can
    // render the transaction row with the originating invoice's
    // reference without N+1 follow-up calls. The invoice is a 1:many
    // relation on Transaction (one invoice can have many transactions —
    // e.g. a payment followed by a refund).
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
    console.error("[api/transactions] GET error:", err);
    return error("Unable to load transactions", 500);
  }
}
