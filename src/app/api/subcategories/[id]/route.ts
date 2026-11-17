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
 * PATCH /api/subcategories/[id] — admin updates a subcategory (partial).
 * Body: any subset of { name, slug, categoryId, description, status }.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.subcategory.findUnique({ where: { id } });
  if (!existing) return notFound("Subcategory not found.");

  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return badRequest("Invalid JSON body.");

  if (
    body.categoryId !== undefined &&
    String(body.categoryId) !== existing.categoryId
  ) {
    const cat = await db.category.findUnique({
      where: { id: String(body.categoryId) },
    });
    if (!cat) return badRequest("Category does not exist.");
  }
  if (
    body.status !== undefined &&
    !["active", "disabled"].includes(String(body.status))
  )
    return badRequest("Invalid status.");

  const data: Record<string, unknown> = {};
  const allowed = ["name", "slug", "categoryId", "description", "status"] as const;
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  try {
    await db.subcategory.update({ where: { id }, data });
  } catch {
    return badRequest("Update failed — slug may already exist for the category.");
  }

  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Category Management",
    target: id,
    description: `Updated subcategory "${existing.name}".`,
  });
  return ok({ ok: true });
}

/** DELETE /api/subcategories/[id] — admin removes a subcategory. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.subcategory.findUnique({ where: { id } });
  if (!existing) return notFound("Subcategory not found.");
  await db.subcategory.delete({ where: { id } });
  await logActivity({
    actor: admin.name,
    action: "deleted",
    module: "Category Management",
    target: id,
    description: `Deleted subcategory "${existing.name}".`,
  });
  return ok({ ok: true });
}
