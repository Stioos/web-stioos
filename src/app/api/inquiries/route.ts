import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import {
  getCurrentBuyer,
  getCurrentAdmin,
} from "@/lib/auth-server";
import {
  badRequest,
  created,
  logActivity,
  notify,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";
import { listInquiries } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/** GET /api/inquiries — admin only. Optional ?type=&status= filters. */
export async function GET(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const url = new URL(req.url);
  const type = url.searchParams.get("type") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;
  const rows = await listInquiries({ type: type ?? undefined, status: status ?? undefined });
  return ok({ inquiries: rows });
}

/**
 * POST /api/inquiries — the CTA target.
 * Works for anonymous visitors AND signed-in buyers (links buyerId).
 * Body: { name, email, company, phone, type, serviceName?, serviceId?,
 *         requirements, budgetRange, timeline }
 * Also emits a notification + activity log (mirrors the old store).
 */
export async function POST(req: NextRequest) {
  const body = await parseBody<{
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    type?: string;
    serviceName?: string;
    serviceId?: string;
    requirements?: string;
    budgetRange?: string;
    timeline?: string;
  }>(req);
  if (!body)
    return badRequest("Invalid JSON body.");
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const type = String(body.type ?? "").trim();
  if (!name || !email || !type)
    return badRequest("name, email and type are required.");
  if (!["quote", "service_request", "contact", "consultation"].includes(type))
    return badRequest("Invalid inquiry type.");

  // Link to the signed-in buyer if present (anonymous leads still allowed).
  const buyer = await getCurrentBuyer();
  const inquiry = await db.inquiry.create({
    data: {
      name,
      email,
      company: body.company ?? "",
      phone: body.phone ?? "",
      type,
      serviceId: body.serviceId ?? null,
      serviceName: body.serviceName ?? null,
      requirements: body.requirements ?? "",
      budgetRange: body.budgetRange ?? "",
      timeline: body.timeline ?? "",
      status: "new",
      buyerId: buyer?.id ?? null,
    },
  });
  if (buyer) {
    await db.user.update({
      where: { id: buyer.id },
      data: { inquiriesCount: { increment: 1 } },
    });
  }

  // Side-effects: notification + activity log
  const notifType =
    type === "contact" ? "contact_inquiry" : "service_request";
  await notify({
    type: notifType,
    title:
      type === "contact"
        ? "New contact inquiry"
        : type === "consultation"
        ? "Consultation request"
        : type === "quote"
        ? "New quote request"
        : "New service request",
    message: `${name}${body.company ? ` (${body.company})` : ""}${
      body.serviceName ? ` — ${body.serviceName}` : ""
    }.`,
  });
  await logActivity({
    actor: name,
    action: "created",
    module: "Inquiry Management",
    target: inquiry.id,
    description: `${type.replace("_", " ")} submitted${body.serviceName ? ` for ${body.serviceName}` : ""}.`,
  });

  // Tell the admin caller (if any) who created it — buyers/anon get the ref id.
  const admin = await getCurrentAdmin();
  return created({
    ok: true,
    inquiry: {
      id: inquiry.id,
      reference: inquiry.id.toUpperCase(),
    },
  });
}
