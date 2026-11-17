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
import { listCategories } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** GET /api/categories — public list of categories. */
export async function GET() {
  const categories = await listCategories();
  return ok({ categories });
}

/**
 * POST /api/categories — admin creates a category.
 * Body: { name, slug?, icon, tagline, description, featured? }
 * Slug is auto-derived from the name when missing; must be unique.
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const body = await parseBody<{
    name?: string;
    slug?: string;
    icon?: string;
    tagline?: string;
    description?: string;
    featured?: boolean;
    status?: string;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");
  const name = String(body.name ?? "").trim();
  if (!name) return badRequest("name is required.");
  const slug = String(body.slug ?? "").trim()
    ? String(body.slug).trim()
    : slugify(name);
  if (!slug) return badRequest("Could not derive a slug from name.");

  if (body.status && !["active", "disabled"].includes(body.status))
    return badRequest("Invalid status.");

  let category: { id: string; slug: string };
  try {
    category = await db.category.create({
      data: {
        name,
        slug,
        icon: body.icon ?? "",
        tagline: body.tagline ?? "",
        description: body.description ?? "",
        featured: body.featured ?? false,
        status: body.status ?? "active",
      },
      select: { id: true, slug: true },
    });
  } catch {
    return badRequest("Slug already exists for a category.");
  }

  await logActivity({
    actor: admin.name,
    action: "created",
    module: "Category Management",
    target: category.id,
    description: `Created category "${name}" (${slug}).`,
  });

  return created({ ok: true, category: { id: category.id, slug: category.slug } });
}
