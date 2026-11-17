import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  badRequest,
  logActivity,
  notFound,
  ok,
  parseBody,
  serverError,
  unauthorized,
} from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/requests/[id]/convert — admin converts a reviewed request into
 * a marketplace order. Atomic transaction:
 *   1. create MarketOrder (amount = quotedAmount, from the request's service
 *      context + buyer)
 *   2. set request.quotedAmount, request.orderId, request.status="fulfilled"
 *   3. append a statusHistory event
 * Body: { amount }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const body = await parseBody<{ amount?: number; note?: string }>(req);
  if (body?.amount === undefined || body.amount === null)
    return badRequest("amount is required.");
  const amount = Number(body.amount);
  if (Number.isNaN(amount) || amount < 0)
    return badRequest("amount must be a non-negative number.");

  const request = await db.marketRequest.findUnique({ where: { id } });
  if (!request) return notFound("Request not found.");
  if (request.orderId)
    return badRequest("This request has already been converted to an order.");

  // Resolve a service for the order. The request references a category, not a
  // specific service; we pick the most popular service in that category as the
  // engagement line item. If the category has no services (e.g. a legacy
  // category id), fall back to the most popular service overall so the
  // conversion never blocks the admin.
  let service = await db.service.findFirst({
    where: { categoryId: request.categoryId },
    orderBy: { popularity: "desc" },
  });
  if (!service) {
    service = await db.service.findFirst({ orderBy: { popularity: "desc" } });
  }
  if (!service)
    return badRequest("No service exists to attach an order to.");

  const now = new Date();
  try {
    const result = await db.$transaction(async (tx) => {
      const order = await tx.marketOrder.create({
        data: {
          serviceId: service.id,
          serviceSlug: service.slug,
          serviceName: service.name,
          serviceIcon: service.icon,
          buyerId: request.buyerId,
          buyerName: request.buyerName,
          buyerCompany: request.buyerCompany,
          amount,
          status: "pending",
          deliveryType: service.deliveryType,
          placedAt: now,
          requirements: request.details,
        },
      });
      const history = Array.isArray(request.statusHistory)
        ? (request.statusHistory as unknown[])
        : [];
      history.push({
        status: "fulfilled",
        at: now.toISOString(),
        by: admin.name,
        note: body.note ?? `Converted to order ${order.id} — quoted $${amount}`,
      });
      await tx.marketRequest.update({
        where: { id: request.id },
        data: {
          quotedAmount: amount,
          orderId: order.id,
          status: "fulfilled",
          statusHistory: history as object,
          updatedAt: now,
        },
      });
      return order;
    });

    await logActivity({
      actor: admin.name,
      action: "converted",
      module: "Service Requests",
      target: request.id,
      description: `Converted request ${request.reference} into order ${result.id} ($${amount}).`,
    });

    return ok({ ok: true, orderId: result.id });
  } catch (e) {
    console.error("convert-request-to-order failed", e);
    return serverError("Failed to convert request to order.");
  }
}
