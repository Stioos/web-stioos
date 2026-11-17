import { NextRequest } from "next/server";
import { getCurrentBuyer } from "@/lib/auth-server";
import { ok, unauthorized } from "@/lib/api/helpers";
import { listBuyerThreads } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/threads — list the current buyer's conversation threads.
 * Each thread includes its messages (oldest → newest), already mapped.
 */
export async function GET(_req: NextRequest) {
  const buyer = await getCurrentBuyer();
  if (!buyer) return unauthorized("Sign in required.");
  const threads = await listBuyerThreads(buyer.id);
  return ok({ threads });
}
