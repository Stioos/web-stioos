import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { success, error, requireAdmin } from "@/lib/auth";

// Always evaluate fresh — admin mutations must never be served from cache.
export const dynamic = "force-dynamic";

// ============================================================
// PATCH /api/admin/services/[id]
// Admin-only service update by ID. Requires `Authorization: Bearer
// <accessToken>` with role `admin` or `super-admin`.
//
// Request body: any subset of the Service model's writable fields. Only
// the fields present in the body are written — absent fields keep their
// current value. `id`, `createdAt`, `createdBy` are never writable
// (ignored if sent in the body).
//
// The optional `categoryId` / `subcategoryId` may be passed to move the
// service to a different category — both are validated to exist (and to
// belong together) before the update runs.
//
// 200 → { success: true, data: { service } }
// 400 → invalid field value / subcategory doesn't belong to category
// 401 → no/invalid bearer token
// 403 → authenticated but not an admin role
// 404 → service (or category/subcategory) not found
// 409 → slug already taken  (Prisma P2002)
// ============================================================

interface UpdateServiceBody {
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

// Fields the caller is never allowed to mutate via PATCH — `id` is the
// route key, `createdAt` is immutable history, `createdBy` is an audit
// fact set once at creation time.
const IMMUTABLE_FIELDS = new Set(["id", "createdAt", "createdBy"]);

class FieldValidationError extends Error {}

function asString(value: unknown, field: string, maxLen: number): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new FieldValidationError(`"${field}" must be a non-empty string`);
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLen) {
    throw new FieldValidationError(`"${field}" is too long (max ${maxLen} chars)`);
  }
  return trimmed;
}

function asOptionalString(value: unknown, field: string, maxLen: number): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new FieldValidationError(`"${field}" must be a string`);
  }
  // Allow empty string to explicitly clear a nullable field — but for
  // non-nullable String columns with schema defaults, an empty string
  // is still a valid value (Prisma will store "").
  if (value.length > maxLen) {
    throw new FieldValidationError(`"${field}" is too long (max ${maxLen} chars)`);
  }
  return value;
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

function coerceJsonField(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === "string") return value;
  throw new FieldValidationError(
    `"${field}" must be an array or a JSON-encoded string`
  );
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ---- Auth -------------------------------------------------------------
  let admin;
  try {
    admin = await requireAdmin(request);
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[api/admin/services/[id]] unexpected requireAdmin failure:", err);
    return error("Unauthorized", 401);
  }
  void admin; // auth gate only — `createdBy` stays unchanged on update.

  // ---- Route param ------------------------------------------------------
  let id: string;
  try {
    ({ id } = await params);
  } catch {
    return error("Service id is required", 400);
  }
  if (!id) return error("Service id is required", 400);

  // ---- Parse body -------------------------------------------------------
  let body: UpdateServiceBody;
  try {
    body = (await request.json()) as UpdateServiceBody;
  } catch {
    return error("Invalid JSON body", 400);
  }

  // Reject any attempt to mutate immutable fields — surface it as a 400
  // rather than silently ignoring, so callers learn the contract.
  for (const key of Object.keys(body)) {
    if (IMMUTABLE_FIELDS.has(key)) {
      return error(`"${key}" cannot be modified`, 400);
    }
  }

  // ---- Build the update payload ----------------------------------------
  const data: Prisma.ServiceUpdateInput = {};

  try {
    if (body.name !== undefined) data.name = asString(body.name, "name", 255);
    if (body.slug !== undefined) data.slug = asString(body.slug, "slug", 255);

    // Optional scalar strings — allow empty string to clear.
    const optionalStrings: Array<[keyof UpdateServiceBody, string]> = [
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
      if (body[bodyKey] !== undefined) {
        const val = asOptionalString(body[bodyKey], String(bodyKey), 1000);
        if (val !== undefined) {
          (data as Record<string, unknown>)[modelKey] = val;
        }
      }
    }

    // Numbers.
    const rating = asNumber(body.rating, "rating");
    if (rating !== undefined) data.rating = rating;
    const reviews = asNumber(body.reviews, "reviews");
    if (reviews !== undefined) data.reviews = Math.floor(reviews);
    const popularity = asNumber(body.popularity, "popularity");
    if (popularity !== undefined) data.popularity = Math.floor(popularity);

    // Boolean.
    const featured = asBoolean(body.featured, "featured");
    if (featured !== undefined) data.featured = featured;

    // JSON-array fields.
    const jsonFields: Array<[keyof UpdateServiceBody, string]> = [
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
      if (body[bodyKey] !== undefined) {
        const coerced = coerceJsonField(body[bodyKey], String(bodyKey));
        (data as Record<string, unknown>)[modelKey] = coerced ?? "[]";
      }
    }
  } catch (err) {
    if (err instanceof FieldValidationError) return error(err.message, 400);
    throw err;
  }

  // ---- Category / subcategory reassignment -----------------------------
  if (body.categoryId !== undefined || body.subcategoryId !== undefined) {
    // To reassign we need both IDs (we won't move a service into a
    // subcategory without knowing its parent category). If only one
    // is sent, fetch the service's current values to fill the gap.
    let categoryId = body.categoryId !== undefined ? String(body.categoryId) : null;
    let subcategoryId =
      body.subcategoryId !== undefined ? String(body.subcategoryId) : null;

    if (categoryId === null || subcategoryId === null) {
      const existing = await db.service.findUnique({
        where: { id },
        select: { categoryId: true, subcategoryId: true },
      });
      if (!existing) return error("Service not found", 404);
      if (categoryId === null) categoryId = existing.categoryId;
      if (subcategoryId === null) subcategoryId = existing.subcategoryId;
    }

    const [category, subcategory] = await Promise.all([
      db.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      }),
      db.subcategory.findUnique({
        where: { id: subcategoryId },
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

    data.category = { connect: { id: category.id } };
    data.subcategory = { connect: { id: subcategory.id } };
  }

  // ---- Persist ---------------------------------------------------------
  try {
    const service = await db.service.update({
      where: { id },
      data,
    });
    return success({ service });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 → record not found (the service id doesn't exist).
      if (err.code === "P2025") {
        return error("Service not found", 404);
      }
      // P2002 → unique constraint (slug already taken by another service).
      if (err.code === "P2002") {
        const target =
          (err.meta?.target as string[] | undefined)?.join(", ") ?? "slug";
        return error(`A service with this ${target} already exists`, 409);
      }
    }
    console.error("[api/admin/services/[id]] update error:", err);
    return error("Unable to update service", 500);
  }
}
