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
import { getRequestById } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/** GET /api/requests/[id] — admin or owning buyer. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const admin = await getCurrentAdmin();
  if (admin) {
    const r = await getRequestById(id);
    if (!r) return notFound();
    return ok({ request: r });
  }
  // buyer path handled by list endpoint; detail not exposed here for buyers
  return unauthorized();
}

/**
 * PATCH /api/requests/[id] — admin updates status and appends a timeline
 * event. Body: { status, note? }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const body = await parseBody<{ status?: string; note?: string }>(req);
  if (!body?.status) return badRequest("status is required.");
  const status = body.status;
  if (
    !["open", "in_review", "in_progress", "fulfilled", "rejected", "closed"].includes(
      status
    )
  )
    return badRequest("Invalid status.");

  const existing = await db.marketRequest.findUnique({ where: { id } });
  if (!existing) return notFound("Request not found.");

  const now = new Date();
  const history = Array.isArray(existing.statusHistory)
    ? (existing.statusHistory as unknown[])
    : [];
  history.push({
    status,
    at: now.toISOString(),
    by: admin.name,
    note: body.note ?? "",
  });

  const updated = await db.marketRequest.update({
    where: { id },
    data: { status, statusHistory: history as object, updatedAt: now },
  });

  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Service Requests",
    target: id,
    description: `Request ${existing.reference} moved to ${status.replace("_", " ")}${
      body.note ? ` — ${body.note}` : ""
    }.`,
  });

  return ok({ request: { id: updated.id, status: updated.status } });
}
