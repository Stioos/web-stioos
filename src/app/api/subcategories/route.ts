import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  badRequest,
  created,
  logActivity,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";
import { listSubcategories } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/subcategories — public list, optionally filtered by ?categoryId=.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId") ?? undefined;
  const subcategories = await listSubcategories(categoryId);
  return ok({ subcategories });
}

/**
 * POST /api/subcategories — admin creates a subcategory.
 * Body: { name, slug, categoryId, description? }
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const body = await parseBody<{
    name?: string;
    slug?: string;
    categoryId?: string;
    description?: string;
    status?: string;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? "").trim();
  const categoryId = String(body.categoryId ?? "").trim();
  if (!name) return badRequest("name is required.");
  if (!slug) return badRequest("slug is required.");
  if (!categoryId) return badRequest("categoryId is required.");

  const category = await db.category.findUnique({ where: { id: categoryId } });
  if (!category) return badRequest("Category does not exist.");

  if (body.status && !["active", "disabled"].includes(body.status))
    return badRequest("Invalid status.");

  let sub: { id: string; slug: string };
  try {
    sub = await db.subcategory.create({
      data: {
        name,
        slug,
        categoryId,
        description: body.description ?? "",
        status: body.status ?? "active",
      },
      select: { id: true, slug: true },
    });
  } catch {
    return badRequest(
      "Subcategory with this slug already exists for the category."
    );
  }

  await logActivity({
    actor: admin.name,
    action: "created",
    module: "Category Management",
    target: sub.id,
    description: `Created subcategory "${name}" under "${category.name}".`,
  });

  return created({ ok: true, subcategory: { id: sub.id, slug: sub.slug } });
}
