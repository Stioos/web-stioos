import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, getCurrentBuyer } from "@/lib/auth-server";
import {
  badRequest,
  created,
  logActivity,
  newRequestReference,
  notify,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";
import { listAllRequests, listBuyerRequests } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/requests — admin sees all, buyer sees only their own.
 */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (admin) {
    const rows = await listAllRequests();
    return ok({ requests: rows });
  }
  const buyer = await getCurrentBuyer();
  if (!buyer) return unauthorized("Sign in required.");
  const rows = await listBuyerRequests(buyer.id);
  return ok({ requests: rows });
}

/**
 * POST /api/requests — buyer creates a marketplace brief (service request
 * or talent-service request). Requires a buyer session.
 * Body: { categoryId, categoryName, title, details, budgetRange, timeline,
 *         kind?, meta? }
 */
export async function POST(req: NextRequest) {
  const buyer = await getCurrentBuyer();
  if (!buyer) return unauthorized("Sign in to submit a request.");
  const body = await parseBody<{
    categoryId?: string;
    categoryName?: string;
    title?: string;
    details?: string;
    budgetRange?: string;
    timeline?: string;
    kind?: string;
    meta?: Record<string, string>;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");
  const title = String(body.title ?? "").trim();
  const categoryId = String(body.categoryId ?? "").trim();
  const categoryName = String(body.categoryName ?? "").trim();
  if (!title || !categoryId || !categoryName)
    return badRequest("title, categoryId and categoryName are required.");

  // Generate a unique reference (retry on collision).
  let reference = newRequestReference();
  for (let i = 0; i < 3; i++) {
    const clash = await db.marketRequest.findUnique({
      where: { reference },
    });
    if (!clash) break;
    reference = newRequestReference();
  }

  const now = new Date();
  const kind = body.kind ?? "service";
  const request = await db.marketRequest.create({
    data: {
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerCompany: buyer.company,
      categoryId,
      categoryName,
      title,
      details: body.details ?? "",
      budgetRange: body.budgetRange ?? "",
      timeline: body.timeline ?? "",
      status: "open",
      kind,
      reference,
      meta: body.meta ?? {},
      statusHistory: [
        {
          status: "open",
          at: now.toISOString(),
          by: buyer.name,
          note: "Request submitted",
        },
      ],
    },
  });

  await notify({
    type: "service_request",
    title: "New service request",
    message: `${buyer.name}${buyer.company ? ` (${buyer.company})` : ""} submitted "${title}".`,
  });
  await logActivity({
    actor: buyer.name,
    action: "created",
    module: "Service Requests",
    target: request.id,
    description: `Submitted request ${reference}: ${title}.`,
  });

  return created({ ok: true, request: { id: request.id, reference } });
}
