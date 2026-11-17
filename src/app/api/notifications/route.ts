import { NextRequest } from "next/server";
import { getCurrentAdmin } from "@/lib/auth-server";
import { ok, unauthorized } from "@/lib/api/helpers";
import { listNotifications } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/notifications — admin only. Newest first.
 */
export async function GET(_req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const notifications = await listNotifications();
  return ok({ notifications });
}
