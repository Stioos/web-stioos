import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  logActivity,
  notFound,
  ok,
  unauthorized,
} from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/services/[id]/featured — admin toggles the `featured` flag.
 * Reads the current value, flips it, persists, logs the activity.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) return notFound("Service not found.");
  const featured = !existing.featured;
  await db.service.update({ where: { id }, data: { featured } });
  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Service Management",
    target: id,
    description: `Featured toggled → ${featured ? "on" : "off"}.`,
  });
  return ok({ ok: true, featured });
}
