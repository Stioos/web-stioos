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

/** PATCH /api/inquiries/[id] — admin updates status. Body: { status } */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const body = await parseBody<{ status?: string }>(req);
  if (!body?.status)
    return badRequest("status is required.");
  const status = body.status;
  if (!["new", "in_progress", "contacted", "closed"].includes(status))
    return badRequest("Invalid status.");
  const existing = await db.inquiry.findUnique({ where: { id } });
  if (!existing) return notFound("Inquiry not found.");
  const updated = await db.inquiry.update({
    where: { id },
    data: { status },
  });
  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Inquiry Management",
    target: id,
    description: `Status changed to ${status.replace("_", " ")}.`,
  });
  return ok({ inquiry: { id: updated.id, status: updated.status } });
}

/** DELETE /api/inquiries/[id] — admin removes an inquiry. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.inquiry.findUnique({ where: { id } });
  if (!existing) return notFound("Inquiry not found.");
  await db.inquiry.delete({ where: { id } });
  await logActivity({
    actor: admin.name,
    action: "deleted",
    module: "Inquiry Management",
    target: id,
    description: "Inquiry deleted.",
  });
  return ok({ ok: true });
}
