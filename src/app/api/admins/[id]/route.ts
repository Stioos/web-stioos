import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, hashPassword } from "@/lib/auth-server";
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
 * PATCH /api/admins/[id] — admin updates another admin (partial).
 * Password is re-hashed only if `body.password` is provided and non-empty.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.adminUser.findUnique({ where: { id } });
  if (!existing) return notFound("Admin not found.");

  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return badRequest("Invalid JSON body.");
  if (
    body.status !== undefined &&
    !["active", "inactive", "suspended"].includes(String(body.status))
  )
    return badRequest("Invalid status.");

  if (body.roleId !== undefined && String(body.roleId) !== existing.roleId) {
    const role = await db.role.findUnique({ where: { id: String(body.roleId) } });
    if (!role) return badRequest("Role does not exist.");
  }

  const data: Record<string, unknown> = {};
  const allowed = ["name", "email", "phone", "roleId", "title", "status"] as const;
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  // Recompute avatar initials if name is changing.
  if (typeof body.name === "string") {
    const initials = String(body.name)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
    data.avatarInitials = initials || null;
  }
  if (typeof body.password === "string" && body.password.length > 0) {
    data.password = await hashPassword(body.password);
  }

  try {
    await db.adminUser.update({ where: { id }, data });
  } catch {
    return badRequest("Update failed — email may already be in use.");
  }

  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Admin Management",
    target: id,
    description: `Updated admin "${existing.name}".`,
  });
  return ok({ ok: true });
}

/** DELETE /api/admins/[id] — admin removes another admin. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.adminUser.findUnique({ where: { id } });
  if (!existing) return notFound("Admin not found.");
  await db.adminUser.delete({ where: { id } });
  await logActivity({
    actor: admin.name,
    action: "deleted",
    module: "Admin Management",
    target: id,
    description: `Deleted admin "${existing.name}".`,
  });
  return ok({ ok: true });
}
