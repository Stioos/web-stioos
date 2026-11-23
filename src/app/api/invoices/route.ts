import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — a buyer's invoice list is per-user and changes
// on every payment. Never serve from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/invoices
// Lists the authenticated buyer's own invoices, newest first.
//
// Auth: `Authorization: Bearer <accessToken>`. Any authenticated user may
// call this — admins see only their own invoices here; the all-buyers
// admin view lives at /api/admin/invoices (TODO — not in this task).
//
// Query params:
//   status   optional — single status value (draft | issued | paid |
//             void | refunded). When omitted, every status is returned.
//   page     default 1 (min 1)
//   limit    default 20 (min 1, max 100)
//
// 200 → { success: true, data: { invoices, total, page, limit, totalPages } }
// 401 → no/invalid bearer token
// ============================================================

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const VALID_STATUSES = new Set([
  "draft",
  "issued",
  "paid",
  "void",
  "refunded",
]);

export async function GET(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/invoices] unexpected requireAuth failure:", err);
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
    // another buyer's invoices — even if a forged query string slips
    // through.
    const where: Prisma.InvoiceWhereInput = { buyerId: user.userId };

    if (statusParam && VALID_STATUSES.has(statusParam)) {
      where.status = statusParam;
    }

    // ---- Query: paged rows + total count in parallel -----------------
    // Eagerly include the linked order + request so the buyer dashboard
    // can render the invoice row with the originating order's status
    // without N+1 follow-up calls.
    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where,
        orderBy: { issuedAt: "desc" },
        include: {
          order: {
            select: {
              id: true,
              serviceName: true,
              status: true,
              amount: true,
            },
          },
          request: {
            select: {
              id: true,
              reference: true,
              title: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.invoice.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return success({ invoices, total, page, limit, totalPages });
  } catch (err) {
    console.error("[api/invoices] GET error:", err);
    return error("Unable to load invoices", 500);
  }
}
