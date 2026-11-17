import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentBuyer } from "@/lib/auth-server";
import {
  badRequest,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";
import { getBuyerWishlist } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/** GET /api/wishlist — current buyer's saved services. */
export async function GET() {
  const buyer = await getCurrentBuyer();
  if (!buyer) return unauthorized();
  const services = await getBuyerWishlist(buyer.id);
  return ok({ services, slugs: services.map((s) => s.slug) });
}

/**
 * POST /api/wishlist — toggle a service in/out of the wishlist.
 * Body: { serviceSlug }
 */
export async function POST(req: NextRequest) {
  const buyer = await getCurrentBuyer();
  if (!buyer) return unauthorized("Sign in to save services.");
  const body = await parseBody<{ serviceSlug?: string }>(req);
  if (!body?.serviceSlug)
    return badRequest("serviceSlug is required.");
  const slug = body.serviceSlug;
  const existing = await db.wishlist.findUnique({
    where: { userId_serviceSlug: { userId: buyer.id, serviceSlug: slug } },
  });
  if (existing) {
    await db.wishlist.delete({
      where: { userId_serviceSlug: { userId: buyer.id, serviceSlug: slug } },
    });
    return ok({ ok: true, saved: false });
  }
  await db.wishlist.create({
    data: { userId: buyer.id, serviceSlug: slug },
  });
  return ok({ ok: true, saved: true });
}
