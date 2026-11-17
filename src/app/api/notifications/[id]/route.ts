import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  badRequest,
  notFound,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/notifications/[id] — mark a notification read/unread.
 * Body: { read?: boolean }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const body = await parseBody<{ read?: boolean }>(req);
  if (!body || typeof body.read !== "boolean")
    return badRequest("read (boolean) is required.");

  const existing = await db.notification.findUnique({ where: { id } });
  if (!existing) return notFound("Notification not found.");

  await db.notification.update({
    where: { id },
    data: { read: body.read },
  });
  return ok({ ok: true, read: body.read });
}

/**
 * DELETE /api/notifications/[id] — delete a notification.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;

  const existing = await db.notification.findUnique({ where: { id } });
  if (!existing) return notFound("Notification not found.");

  await db.notification.delete({ where: { id } });
  return ok({ ok: true });
}
