import { NextRequest } from "next/server";
import { getCurrentAdmin } from "@/lib/auth-server";
import { ok, unauthorized } from "@/lib/api/helpers";
import { listActivity } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/activity — admin only. Optional ?limit= (default 300, max 500).
 */
export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");

  const url = new URL(req.url);
  const raw = url.searchParams.get("limit");
  let limit = 300;
  if (raw !== null) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) {
      limit = Math.min(Math.floor(parsed), 500);
    }
  }
  const activity = await listActivity(limit);
  return ok({ activity });
}
