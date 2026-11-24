import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error } from "@/lib/auth";

// Always evaluate fresh — catalog filters change per request and we never
// want a stale page of services served from the route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/services
// Public catalog listing with pagination, filtering and sorting.
//
// Query params:
//   page      default 1   (min 1)
//   limit     default 20  (min 1, max 100)
//   category  category slug — filtered via the category relation
//   search    free-text — matched against name + shortDescription
//   sort      popularity | rating | newest | name  (default popularity)
//   featured  "true" → only featured services
//
// Only `published` services are exposed on the public catalog. Draft and
// archived records are invisible here (admins use /api/admin/services).
//
// The `select` clause excludes the heavy JSON blob columns
// (tags, problemsSolved, capabilities, deliverables, process,
// technologies, faqs) so a 20-item page stays small on the wire — those
// fields are only fetched on the single-service detail route.
// ============================================================

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

type SortKey = "popularity" | "rating" | "newest" | "name";

const SORT_ORDER: Record<SortKey, Prisma.ServiceOrderByWithRelationInput> = {
  popularity: { popularity: "desc" },
  rating: { rating: "desc" },
  newest: { createdAt: "desc" },
  name: { name: "asc" },
};

function parseSort(value: string | null): SortKey {
  if (value && value in SORT_ORDER) return value as SortKey;
  return "popularity";
}

// Scalar fields returned on the list endpoint. Deliberately omits the
// seven heavy JSON columns — they're only fetched on the detail route.
const SERVICE_LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  categoryId: true,
  subcategoryId: true,
  shortDescription: true,
  fullDescription: true,
  industries: true,
  deliveryType: true,
  timeline: true,
  rating: true,
  reviews: true,
  popularity: true,
  featured: true,
  status: true,
  accent: true,
  icon: true,
  metaTitle: true,
  metaDescription: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ServiceSelect;

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    // ---- Pagination -------------------------------------------------------
    const page = Math.max(1, Number(params.get("page")) || 1);
    const requestedLimit = Number(params.get("limit")) || DEFAULT_LIMIT;
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number.isFinite(requestedLimit) ? requestedLimit : DEFAULT_LIMIT)
    );

    // ---- Filters ----------------------------------------------------------
    const categorySlug = params.get("category")?.trim() || null;
    const search = params.get("search")?.trim() || null;
    const featuredOnly = params.get("featured") === "true";
    const sort = parseSort(params.get("sort"));

    // Build the Prisma `where` clause incrementally. Start with the
    // status gate so drafts/archived records never leak to the public
    // catalog regardless of the other filters.
    const where: Prisma.ServiceWhereInput = { status: "published" };

    if (categorySlug) {
      // Filter through the category relation by slug — avoids a separate
      // lookup query to resolve slug → id.
      where.category = { slug: categorySlug };
    }

    if (featuredOnly) {
      where.featured = true;
    }

    if (search) {
      // SQLite's LIKE is ASCII-case-insensitive by default, so `contains`
      // gives us a reasonable free-text match without `mode: "insensitive"`
      // (which isn't supported on the SQLite connector).
      where.OR = [
        { name: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    // ---- Query: paged rows + total count in parallel ---------------------
    const [services, total] = await Promise.all([
      db.service.findMany({
        where,
        select: SERVICE_LIST_SELECT,
        orderBy: SORT_ORDER[sort],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.service.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return success({
      services,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err) {
    console.error("[api/services] error:", err);
    return error("Unable to load services", 500);
  }
}
