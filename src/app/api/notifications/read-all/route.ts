import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import { ok, unauthorized } from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/notifications/read-all — admin. Marks every unread
 * notification as read.
 */
export async function POST(_req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  await db.notification.updateMany({
    where: { read: false },
    data: { read: true },
  });
  return ok({ ok: true });
}
