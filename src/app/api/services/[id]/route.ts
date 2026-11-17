import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  badRequest,
  logActivity,
  notFound,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";
import { getServiceById } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/** GET /api/services/[id] — public service detail by id. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) return notFound("Service not found.");
  return ok({ service });
}

/**
 * PATCH /api/services/[id] — admin updates a service (partial).
 * Body: any subset of Service fields. categoryId/subcategoryId, when provided,
 * are validated for FK existence. status/deliveryType validated against enums.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) return notFound("Service not found.");

  const body = await parseBody<Record<string, unknown>>(req);
  if (!body) return badRequest("Invalid JSON body.");

  // Validate FK existence for category/subcategory if provided.
  if (body.categoryId !== undefined) {
    const cat = await db.category.findUnique({
      where: { id: String(body.categoryId) },
    });
    if (!cat) return badRequest("Category does not exist.");
  }
  if (body.subcategoryId !== undefined) {
    const sub = await db.subcategory.findUnique({
      where: { id: String(body.subcategoryId) },
    });
    if (!sub) return badRequest("Subcategory does not exist.");
  }
  if (
    body.status !== undefined &&
    !["draft", "published", "archived"].includes(String(body.status))
  )
    return badRequest("Invalid status.");
  if (
    body.deliveryType !== undefined &&
    !["project", "subscription", "retainer", "on_demand", "self_serve"].includes(
      String(body.deliveryType)
    )
  )
    return badRequest("Invalid deliveryType.");

  // Build update data only from provided keys to keep PATCH partial.
  const data: Record<string, unknown> = {};
  const allowed: (keyof typeof body)[] = [
    "name",
    "slug",
    "categoryId",
    "subcategoryId",
    "shortDescription",
    "fullDescription",
    "tags",
    "industries",
    "deliveryType",
    "timeline",
    "rating",
    "reviews",
    "popularity",
    "featured",
    "status",
    "accent",
    "icon",
    "problemsSolved",
    "capabilities",
    "deliverables",
    "process",
    "technologies",
    "faqs",
    "metaTitle",
    "metaDescription",
  ];
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  try {
    await db.service.update({ where: { id }, data });
  } catch {
    return badRequest("Update failed — slug may already be in use.");
  }

  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Service Management",
    target: id,
    description: `Updated service "${existing.name}".`,
  });

  return ok({ ok: true });
}

/** DELETE /api/services/[id] — admin removes a service. */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) return notFound("Service not found.");
  await db.service.delete({ where: { id } });
  await logActivity({
    actor: admin.name,
    action: "deleted",
    module: "Service Management",
    target: id,
    description: `Deleted service "${existing.name}".`,
  });
  return ok({ ok: true });
}
