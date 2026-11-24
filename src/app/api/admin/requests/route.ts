import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAdmin, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — admin views span all buyers and change per
// request; never serve from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/admin/requests
// Admin-only listing of ALL service requests across every buyer.
// Powers the admin dashboard's request pipeline.
//
// Auth: `Authorization: Bearer <accessToken>` with role `admin` or
// `super-admin`.
//
// Query params (same shape as /api/requests, but without the buyerId
// scoping):
//   status   optional — single status value to filter on
//   kind     optional — single kind value to filter on
//   page     default 1 (min 1)
//   limit    default 20 (min 1, max 100)
//
// 200 → { success: true, data: { requests, total, page, limit, totalPages } }
// 401 → no/invalid bearer token
// 403 → authenticated but not an admin role
// ============================================================

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const VALID_STATUSES = new Set([
  "open",
  "in_review",
  "quoted",
  "approved",
  "ordered",
  "paid",
  "delivered",
  "closed",
  "rejected",
]);

const VALID_KINDS = new Set([
  "service",
  "train-to-hire",
  "hire-to-train",
  "talent-sourcing",
  "end-to-end-staffing",
  "post-a-job",
]);

export async function GET(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  let admin: JWTPayload;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/admin/requests] unexpected requireAdmin failure:", err);
    return error("Unauthorized", 401);
  }
  // `admin` is intentionally only used for the auth gate — this listing
  // spans all buyers, so the admin's userId doesn't filter the query.
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
    const statusParam = params.get("status")?.trim() || null;
    const kindParam = params.get("kind")?.trim() || null;

    // Unlike /api/requests, this listing has NO buyerId scoping — admins
    // see every buyer's requests. The where clause starts empty and only
    // carries the optional status / kind filters.
    const where: Prisma.MarketRequestWhereInput = {};

    if (statusParam && VALID_STATUSES.has(statusParam)) {
      where.status = statusParam;
    }

    if (kindParam && VALID_KINDS.has(kindParam)) {
      where.kind = kindParam;
    }

    // ---- Query: paged rows + total count in parallel -----------------
    // Eagerly include the related quote + order + invoice so the admin
    // dashboard can render the full pipeline row without N+1 follow-up
    // calls. All three are 1:1 relations on MarketRequest.
    const [requests, total] = await Promise.all([
      db.marketRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          quote: {
            select: {
              id: true,
              reference: true,
              total: true,
              status: true,
              validUntil: true,
            },
          },
          order: {
            select: {
              id: true,
              serviceName: true,
              status: true,
              amount: true,
            },
          },
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
      db.marketRequest.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return success({ requests, total, page, limit, totalPages });
  } catch (err) {
    console.error("[api/admin/requests] GET error:", err);
    return error("Unable to load requests", 500);
  }
}
