import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAuth, JWTPayload } from "@/lib/auth";
import { newRequestReference } from "@/lib/request-kinds";

// Always evaluate fresh — a buyer's request list and POST mutations are
// per-user and must never be served from a route-segment cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/requests
// Lists the authenticated buyer's own service requests, newest first.
//
// Auth: `Authorization: Bearer <accessToken>` — any authenticated user
// (buyer or admin). Admins see only their own requests here; the
// all-buyers admin view lives at /api/admin/requests.
//
// Query params:
//   status   optional — single status value (open | in_review | quoted |
//             approved | ordered | paid | delivered | closed | rejected).
//             When omitted, every status is returned.
//   kind     optional — single kind value (service | train-to-hire |
//             hire-to-train | talent-sourcing | end-to-end-staffing |
//             post-a-job). When omitted, every kind is returned.
//   page     default 1 (min 1)
//   limit    default 20 (min 1, max 100)
//
// 200 → { success: true, data: { requests, total, page, limit, totalPages } }
// 401 → no/invalid bearer token
// ============================================================

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// Whitelist of statuses the API will filter on. Anything else is ignored
// (treated as "no status filter") so a typo in the query string doesn't
// 500 — it just returns every status.
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
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/requests] unexpected requireAuth failure:", err);
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
    const statusParam = params.get("status")?.trim() || null;
    const kindParam = params.get("kind")?.trim() || null;

    // Build the where clause — always scoped to the authenticated buyer so
    // a buyer can never see another buyer's requests even with a forged
    // query string.
    const where: Prisma.MarketRequestWhereInput = { buyerId: user.userId };

    if (statusParam && VALID_STATUSES.has(statusParam)) {
      where.status = statusParam;
    }

    if (kindParam && VALID_KINDS.has(kindParam)) {
      where.kind = kindParam;
    }

    // ---- Query: paged rows + total count in parallel -----------------
    const [requests, total] = await Promise.all([
      db.marketRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.marketRequest.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return success({ requests, total, page, limit, totalPages });
  } catch (err) {
    console.error("[api/requests] GET error:", err);
    return error("Unable to load requests", 500);
  }
}

// ============================================================
// POST /api/requests
// Creates a new service request for the authenticated buyer.
//
// Auth: any authenticated user (buyer or admin). The buyerId / buyerName /
// buyerCompany are stamped from the verified token + user record, never
// trusted from the body, so a buyer can't file a request under someone
// else's identity.
//
// Request body:
//   categoryId*     string
//   categoryName*   string
//   title*          string
//   details*        string
//   budgetRange     string  (default "")
//   timeline        string  (default "")
//   kind            string  (default "service", one of VALID_KINDS)
//   meta            object  (default {} — structured form answers)
//
// The reference is generated server-side as `REQ-XXXXX` (5 chars from the
// unambiguous alphabet ABCDEFGHJKMNPQRSTUVWXYZ23456789). The statusHistory
// JSON column is seeded with a single "open" event stamped with the buyer's
// id + name + current timestamp.
//
// 201 → { success: true, data: { request } }
// 400 → missing/invalid required field
// 401 → no/invalid bearer token
// 500 → unexpected DB error
// ============================================================

interface CreateRequestBody {
  categoryId?: unknown;
  categoryName?: unknown;
  title?: unknown;
  details?: unknown;
  budgetRange?: unknown;
  timeline?: unknown;
  kind?: unknown;
  meta?: unknown;
}

class FieldValidationError extends Error {}

function asString(value: unknown, field: string, maxLen: number): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new FieldValidationError(`"${field}" is required`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLen) {
    throw new FieldValidationError(`"${field}" is too long (max ${maxLen} chars)`);
  }
  return trimmed;
}

function asOptionalString(value: unknown, field: string, maxLen: number): string {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") {
    throw new FieldValidationError(`"${field}" must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLen) {
    throw new FieldValidationError(`"${field}" is too long (max ${maxLen} chars)`);
  }
  return trimmed;
}

export async function POST(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  let user: JWTPayload;
  try {
    user = await requireAuth(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/requests] unexpected requireAuth failure:", err);
    return error("Unauthorized", 401);
  }

  // ---- Parse body -------------------------------------------------------
  let body: CreateRequestBody;
  try {
    body = (await request.json()) as CreateRequestBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  // ---- Validate required + optional fields ------------------------------
  let categoryId: string;
  let categoryName: string;
  let title: string;
  let details: string;
  let budgetRange: string;
  let timeline: string;
  let kind: string;
  let metaJson: string;

  try {
    categoryId = asString(body.categoryId, "categoryId", 255);
    categoryName = asString(body.categoryName, "categoryName", 255);
    title = asString(body.title, "title", 240);
    details = asString(body.details, "details", 8000);
    budgetRange = asOptionalString(body.budgetRange, "budgetRange", 120);
    timeline = asOptionalString(body.timeline, "timeline", 120);

    // kind is optional; default to the generic marketplace service kind.
    const kindRaw =
      typeof body.kind === "string" && body.kind.trim() ? body.kind.trim() : "service";
    if (!VALID_KINDS.has(kindRaw)) {
      throw new FieldValidationError(
        `"kind" must be one of: ${Array.from(VALID_KINDS).join(", ")}`
      );
    }
    kind = kindRaw;

    // meta is optional structured form answers — accept an object (stringified
    // server-side) or a pre-serialized JSON string. Reject anything else.
    if (body.meta === undefined || body.meta === null) {
      metaJson = "{}";
    } else if (typeof body.meta === "string") {
      // Validate it parses — better to 400 here than to silently store
      // malformed JSON the buyer UI then can't read back.
      try {
        JSON.parse(body.meta);
      } catch {
        throw new FieldValidationError('"meta" must be valid JSON');
      }
      metaJson = body.meta;
    } else if (typeof body.meta === "object" && !Array.isArray(body.meta)) {
      metaJson = JSON.stringify(body.meta);
    } else {
      throw new FieldValidationError('"meta" must be an object or a JSON-encoded string');
    }
  } catch (err) {
    if (err instanceof FieldValidationError) return error(err.message, 400);
    throw err;
  }

  // ---- Resolve the buyer's display fields from the DB -------------------
  // The JWT only carries { userId, email, role } — we need the user's
  // current name + company to denormalize onto the request (so historical
  // requests stay readable even if the buyer later edits their profile).
  const buyer = await db.user.findUnique({
    where: { id: user.userId },
    select: { id: true, name: true, company: true, status: true },
  });

  if (!buyer) {
    // The token was valid but the user row is gone — treat as unauthorized
    // so the client clears its tokens.
    return error("Unauthorized", 401);
  }
  if (buyer.status === "suspended") {
    return error("This account has been suspended. Contact support.", 403);
  }

  // ---- Build the status history seed event ------------------------------
  // statusHistory is stored as a JSON-encoded String column on SQLite.
  // The first entry records the "open" submission — stamped with the
  // buyer's id + name so an admin reviewing the timeline later knows who
  // filed it even if the buyer row is later deleted.
  const now = new Date();
  const statusHistory = JSON.stringify([
    {
      status: "open",
      note: "Request submitted by buyer",
      at: now.toISOString(),
      by: buyer.name,
      byId: buyer.id,
    },
  ]);

  // ---- Persist ----------------------------------------------------------
  try {
    const created = await db.marketRequest.create({
      data: {
        reference: newRequestReference(),
        buyerId: buyer.id,
        buyerName: buyer.name,
        buyerCompany: buyer.company,
        categoryId,
        categoryName,
        title,
        details,
        budgetRange,
        timeline,
        status: "open",
        kind,
        meta: metaJson,
        statusHistory,
      },
    });

    return success({ request: created }, 201);
  } catch (err) {
    // P2002 → unique constraint. The only unique column on MarketRequest
    // (besides id) is `reference` — extremely unlikely with a 5-char
    // suffix from a 30-char alphabet (30^5 ≈ 24M), but if it ever
    // collides we surface a clean 409 rather than a raw Prisma error.
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return error("Reference collision — please retry", 409);
      }
    }
    console.error("[api/requests] POST error:", err);
    return error("Unable to create request", 500);
  }
}
