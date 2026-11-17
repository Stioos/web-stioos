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
 * PATCH /api/users/[id] — admin updates a buyer (partial).
 * Password is re-hashed only if `body.password` is provided and non-empty.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.user.findUnique({ where: { id } });
  if (!existing) return notFound("User not found.");

  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return badRequest("Invalid JSON body.");
  if (
    body.role !== undefined &&
    !["buyer", "member"].includes(String(body.role))
  )
    return badRequest("Invalid role.");
  if (
    body.status !== undefined &&
    !["active", "inactive", "suspended"].includes(String(body.status))
  )
    return badRequest("Invalid status.");

  const data: Record<string, unknown> = {};
  const allowed = [
    "name",
    "email",
    "company",
    "phone",
    "country",
    "role",
    "status",
    "phoneCountry",
    "registrationType",
    "accountType",
    "profession",
    "companySize",
    "intent",
    "intentTimeline",
    "registrationSource",
  ] as const;
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  if (typeof body.password === "string" && body.password.length > 0) {
    data.password = await hashPassword(body.password);
  }

  try {
    await db.user.update({ where: { id }, data });
  } catch {
    return badRequest("Update failed — email may already be in use.");
  }

  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "User Management",
    target: id,
    description: `Updated buyer "${existing.name}".`,
  });
  return ok({ ok: true });
}

/** DELETE /api/users/[id] — admin removes a buyer. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.user.findUnique({ where: { id } });
  if (!existing) return notFound("User not found.");
  await db.user.delete({ where: { id } });
  await logActivity({
    actor: admin.name,
    action: "deleted",
    module: "User Management",
    target: id,
    description: `Deleted buyer "${existing.name}".`,
  });
  return ok({ ok: true });
}
