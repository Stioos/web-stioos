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
 * PATCH /api/services/[id]/status — admin updates a service's status.
 * Body: { status } where status ∈ { draft | published | archived }.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const body = await parseBody<{ status?: string }>(req);
  if (!body?.status) return badRequest("status is required.");
  const status = body.status;
  if (!["draft", "published", "archived"].includes(status))
    return badRequest("Invalid status.");

  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) return notFound("Service not found.");

  await db.service.update({ where: { id }, data: { status } });
  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Service Management",
    target: id,
    description: `Status → ${status}.`,
  });
  return ok({ ok: true, status });
}
