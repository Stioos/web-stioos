import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAdmin, JWTPayload } from "@/lib/auth";

// Always evaluate fresh — admin mutations must never be served from cache.
export const dynamic = "force-dynamic";

// ============================================================
// POST /api/admin/services
// Admin-only service creation. Requires `Authorization: Bearer
// <accessToken>` with role `admin` or `super-admin`.
//
// Request body (all fields optional unless marked required):
//   name*             string
//   slug*             string (unique)
//   categoryId*       string
//   subcategoryId*    string
//   shortDescription  string
//   fullDescription   string
//   tags              string[] | string   (JSON-encoded array)
//   industries        string[] | string
//   deliveryType      string
//   timeline          string
//   rating            number
//   reviews           number
//   popularity        number
//   featured          boolean
//   status            string   (draft | published | archived)
//   accent            string
//   icon              string
//   problemsSolved    unknown[] | string
//   capabilities      unknown[] | string
//   deliverables      unknown[] | string
//   process           unknown[] | string
//   technologies      unknown[] | string
//   faqs              unknown[] | string
//   metaTitle         string
//   metaDescription   string
//
// `createdBy` is stamped from the authenticated admin's userId (never
// trusted from the body) so we can audit who created each record.
//
// 201 → { success: true, data: { service } }
// 400 → missing/invalid required field
// 401 → no/invalid bearer token  (thrown by requireAuth inside requireAdmin)
// 403 → authenticated but not an admin role  (thrown by requireAdmin)
// 404 → categoryId / subcategoryId don't exist  (Prisma P2025 FK violation)
// 409 → slug already taken  (Prisma P2002 unique constraint)
// ============================================================

interface CreateServiceBody {
  name?: unknown;
  slug?: unknown;
  categoryId?: unknown;
  subcategoryId?: unknown;
  shortDescription?: unknown;
  fullDescription?: unknown;
  tags?: unknown;
  industries?: unknown;
  deliveryType?: unknown;
  timeline?: unknown;
  rating?: unknown;
  reviews?: unknown;
  popularity?: unknown;
  featured?: unknown;
  status?: unknown;
  accent?: unknown;
  icon?: unknown;
  problemsSolved?: unknown;
  capabilities?: unknown;
  deliverables?: unknown;
  process?: unknown;
  technologies?: unknown;
  faqs?: unknown;
  metaTitle?: unknown;
  metaDescription?: unknown;
}

const REQUIRED_STRING_FIELDS = ["name", "slug", "categoryId", "subcategoryId"] as const;

/**
 * Coerces a JSON-array field for storage. The Prisma schema stores these
 * as String (SQLite can't hold native JSON columns), so we accept either
 * a real array (stringified server-side) or a pre-serialized string
 * (passed through as-is). Anything else is rejected.
 */
function coerceJsonField(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "string") return value;
  // Primitives (number/boolean/object) are not valid for these fields —
  // the caller must send either an array or a JSON string.
  throw new FieldValidationError(
    `"${field}" must be an array or a JSON-encoded string`
  );
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

function asNumber(value: unknown, field: string): number | undefined {
  if (value === undefined || value === null) return undefined;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    throw new FieldValidationError(`"${field}" must be a finite number`);
  }
  return n;
}

function asBoolean(value: unknown, field: string): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new FieldValidationError(`"${field}" must be a boolean`);
}

export async function POST(request: NextRequest) {
  // ---- Auth -------------------------------------------------------------
  // requireAdmin calls requireAuth first (throws a 401 Response on
  // missing/invalid token) then checks role (throws a 403 Response).
  // Both are Response instances — pass them straight through so the
  // status code + body match the rest of the auth API.
  let admin: JWTPayload;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/admin/services] unexpected requireAdmin failure:", err);
    return error("Unauthorized", 401);
  }

  // ---- Parse body -------------------------------------------------------
  let body: CreateServiceBody;
  try {
    body = (await request.json()) as CreateServiceBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  // ---- Validate required fields ----------------------------------------
  try {
    for (const field of REQUIRED_STRING_FIELDS) {
      asString(body[field], field, 255);
    }
  } catch (err) {
    if (err instanceof FieldValidationError) return error(err.message, 400);
    throw err;
  }

  // ---- Verify category + subcategory exist (better 404 than FK crash) -
  // Done in parallel so the pre-flight costs one round-trip, not two.
  const [category, subcategory] = await Promise.all([
    db.category.findUnique({
      where: { id: String(body.categoryId) },
      select: { id: true },
    }),
    db.subcategory.findUnique({
      where: { id: String(body.subcategoryId) },
      select: { id: true, categoryId: true },
    }),
  ]);

  if (!category) return error("Category not found", 404);
  if (!subcategory) return error("Subcategory not found", 404);
  if (subcategory.categoryId !== category.id) {
    return error(
      "Subcategory does not belong to the specified category",
      400
    );
  }

  // ---- Build the create payload ----------------------------------------
  // Only include optional fields when they're present in the body —
  // absent fields fall back to their Prisma schema defaults.
  const data: Prisma.ServiceCreateInput = {
    name: String(body.name).trim(),
    slug: String(body.slug).trim(),
    category: { connect: { id: category.id } },
    subcategory: { connect: { id: subcategory.id } },
    createdBy: admin.userId,
  };

  // Optional scalar strings.
  const optionalStrings: Array<[keyof CreateServiceBody, string]> = [
    ["shortDescription", "shortDescription"],
    ["fullDescription", "fullDescription"],
    ["deliveryType", "deliveryType"],
    ["timeline", "timeline"],
    ["status", "status"],
    ["accent", "accent"],
    ["icon", "icon"],
    ["metaTitle", "metaTitle"],
    ["metaDescription", "metaDescription"],
  ];
  for (const [bodyKey, modelKey] of optionalStrings) {
    const raw = body[bodyKey];
    if (typeof raw === "string" && raw.trim()) {
      // Prisma's create input uses the exact model field names.
      // We index into `data` with a cast because TS can't prove the
      // union of string keys maps to writable ServiceCreateInput keys.
      (data as Record<string, unknown>)[modelKey] = raw.trim();
    }
  }

  // Optional numbers.
  const rating = asNumber(body.rating, "rating");
  if (rating !== undefined) data.rating = rating;
  const reviews = asNumber(body.reviews, "reviews");
  if (reviews !== undefined) data.reviews = Math.floor(reviews);
  const popularity = asNumber(body.popularity, "popularity");
  if (popularity !== undefined) data.popularity = Math.floor(popularity);

  // Optional boolean.
  const featured = asBoolean(body.featured, "featured");
  if (featured !== undefined) data.featured = featured;

  // JSON-array fields (stored as String in SQLite).
  const jsonFields: Array<[keyof CreateServiceBody, string]> = [
    ["tags", "tags"],
    ["industries", "industries"],
    ["problemsSolved", "problemsSolved"],
    ["capabilities", "capabilities"],
    ["deliverables", "deliverables"],
    ["process", "process"],
    ["technologies", "technologies"],
    ["faqs", "faqs"],
  ];
  for (const [bodyKey, modelKey] of jsonFields) {
    try {
      const coerced = coerceJsonField(body[bodyKey], String(bodyKey));
      if (coerced !== null) {
        (data as Record<string, unknown>)[modelKey] = coerced;
      }
    } catch (err) {
      if (err instanceof FieldValidationError) return error(err.message, 400);
      throw err;
    }
  }

  // ---- Persist ---------------------------------------------------------
  try {
    const service = await db.service.create({ data });
    return success({ service }, 201);
  } catch (err) {
    // P2002 → unique constraint (slug already taken).
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const target = (err.meta?.target as string[] | undefined)?.join(", ") ?? "slug";
        return error(`A service with this ${target} already exists`, 409);
      }
    }
    console.error("[api/admin/services] create error:", err);
    return error("Unable to create service", 500);
  }
}
