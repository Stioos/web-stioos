import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentBuyer, toBuyerDTO } from "@/lib/auth-server";
import {
  badRequest,
  logActivity,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/profile — the signed-in buyer updates their own profile.
 * Only the editable identity fields are accepted here (name, company,
 * phone, country). Email, password, role, status, etc. cannot be changed
 * from this route — they require an admin / password-reset flow.
 *
 * Body: { name?, company?, phone?, country? }
 */
export async function PATCH(req: NextRequest) {
  const buyer = await getCurrentBuyer();
  if (!buyer) return unauthorized("Sign in required.");

  const body = await parseBody<{
    name?: string;
    company?: string;
    phone?: string;
    country?: string;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");

  // Build a sparse update — only fields the buyer sent. Anything else is
  // ignored, so a stale form can't accidentally wipe a field the buyer
  // didn't intend to change.
  const data: Record<string, string> = {};
  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) return badRequest("Your name cannot be empty.");
    data.name = name;
  }
  if (typeof body.company === "string") data.company = body.company.trim();
  if (typeof body.phone === "string") data.phone = body.phone.trim();
  if (typeof body.country === "string") data.country = body.country.trim();

  if (Object.keys(data).length === 0) {
    return badRequest("Nothing to update.");
  }

  const updated = await db.user.update({
    where: { id: buyer.id },
    data,
  });

  await logActivity({
    actor: buyer.name,
    action: "updated",
    module: "Profile",
    target: buyer.id,
    description: "Updated profile details.",
  });

  return ok({ ok: true, user: toBuyerDTO(updated) });
}
