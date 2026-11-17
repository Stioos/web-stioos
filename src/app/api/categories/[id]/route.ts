import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  badRequest,
  logActivity,
  notFound,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/categories/[id] — admin updates a category (partial).
 * Body: any subset of { name, slug, icon, tagline, description, featured, status }.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.category.findUnique({ where: { id } });
  if (!existing) return notFound("Category not found.");

  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return badRequest("Invalid JSON body.");
  if (
    body.status !== undefined &&
    !["active", "disabled"].includes(String(body.status))
  )
    return badRequest("Invalid status.");

  const data: Record<string, unknown> = {};
  const allowed = [
    "name",
    "slug",
    "icon",
    "tagline",
    "description",
    "featured",
    "status",
  ] as const;
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  try {
    await db.category.update({ where: { id }, data });
  } catch {
    return badRequest("Update failed — slug may already be in use.");
  }

  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Category Management",
    target: id,
    description: `Updated category "${existing.name}".`,
  });
  return ok({ ok: true });
}

/**
 * DELETE /api/categories/[id] — admin removes a category.
 * Cascade: delete all subcategories that belong to this category first
 * (Category has onDelete: Cascade on the subcategory relation, but we
 * also explicitly clean subcategories before the parent delete so that
 * any referential-check surprises under SQLite don't block the deletion).
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.category.findUnique({ where: { id } });
  if (!existing) return notFound("Category not found.");

  await db.subcategory.deleteMany({ where: { categoryId: id } });
  await db.category.delete({ where: { id } });

  await logActivity({
    actor: admin.name,
    action: "deleted",
    module: "Category Management",
    target: id,
    description: `Deleted category "${existing.name}" and its subcategories.`,
  });
  return ok({ ok: true });
}
