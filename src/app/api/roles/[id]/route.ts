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
 * PATCH /api/roles/[id] — admin updates a role (partial).
 * Body: any subset of { name, slug, description, permissions, isSystem }.
 * `permissions` is the full PermissionMatrix object.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.role.findUnique({ where: { id } });
  if (!existing) return notFound("Role not found.");

  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return badRequest("Invalid JSON body.");

  const data: Record<string, unknown> = {};
  const allowed = ["name", "slug", "description", "permissions", "isSystem"] as const;
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  try {
    await db.role.update({ where: { id }, data });
  } catch {
    return badRequest("Update failed — slug may already be in use.");
  }

  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Roles & Permissions",
    target: id,
    description: `Updated role "${existing.name}".`,
  });
  return ok({ ok: true });
}

/**
 * DELETE /api/roles/[id] — admin removes a role.
 * System roles (isSystem = true) are protected and cannot be deleted.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.role.findUnique({ where: { id } });
  if (!existing) return notFound("Role not found.");
  if (existing.isSystem)
    return badRequest("System roles cannot be deleted.");

  // Guard against orphaning admins that still reference this role.
  const adminsOnRole = await db.adminUser.count({
    where: { roleId: id },
  });
  if (adminsOnRole > 0)
    return badRequest(
      "Cannot delete a role that is still assigned to admin accounts."
    );

  await db.role.delete({ where: { id } });
  await logActivity({
    actor: admin.name,
    action: "deleted",
    module: "Roles & Permissions",
    target: id,
    description: `Deleted role "${existing.name}".`,
  });
  return ok({ ok: true });
}
