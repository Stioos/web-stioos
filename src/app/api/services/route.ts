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
import { listServicesRaw } from "@/lib/api/queries";

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

/**
 * GET /api/services — public catalog read.
 * Query params: status, categoryId, subcategoryId, featured ("true"/"false"),
 * search, sort ("relevance"|"popular"|"rating"|"newest"), limit.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sp = url.searchParams;
  const featuredRaw = sp.get("featured");
  const limitRaw = sp.get("limit");
  const filter: Parameters<typeof listServicesRaw>[0] = {};
  const status = sp.get("status") ?? undefined;
  if (status) filter.status = status;
  const categoryId = sp.get("categoryId") ?? undefined;
  if (categoryId) filter.categoryId = categoryId;
  const subcategoryId = sp.get("subcategoryId") ?? undefined;
  if (subcategoryId) filter.subcategoryId = subcategoryId;
  if (featuredRaw === "true") filter.featured = true;
  if (featuredRaw === "false") filter.featured = false;
  const search = sp.get("search") ?? undefined;
  if (search) filter.search = search;
  const sort = sp.get("sort") ?? undefined;
  if (
    sort === "relevance" ||
    sort === "popular" ||
    sort === "rating" ||
    sort === "newest"
  ) {
    filter.sort = sort;
  }
  if (limitRaw) {
    const n = Number(limitRaw);
    if (Number.isFinite(n) && n > 0) filter.limit = Math.floor(n);
  }
  const services = await listServicesRaw(filter);
  return ok({ services });
}

/**
 * POST /api/services — admin creates a service.
 * Body fields per the Service type (name, slug?, categoryId, subcategoryId,
 * shortDescription, fullDescription, tags, industries, deliveryType, timeline,
 * rating, reviews, popularity, featured, status, accent, icon,
 * problemsSolved, capabilities, deliverables, process, technologies, faqs,
 * metaTitle?, metaDescription?).
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const body = await parseBody<{
    name?: string;
    slug?: string;
    categoryId?: string;
    subcategoryId?: string;
    shortDescription?: string;
    fullDescription?: string;
    tags?: string[];
    industries?: string[];
    deliveryType?: string;
    timeline?: string;
    rating?: number;
    reviews?: number;
    popularity?: number;
    featured?: boolean;
    status?: string;
    accent?: string;
    icon?: string;
    problemsSolved?: string[];
    capabilities?: string[];
    deliverables?: string[];
    process?: { title: string; description: string }[];
    technologies?: string[];
    faqs?: { question: string; answer: string }[];
    metaTitle?: string;
    metaDescription?: string;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");

  const name = String(body.name ?? "").trim();
  const categoryId = String(body.categoryId ?? "").trim();
  const subcategoryId = String(body.subcategoryId ?? "").trim();
  if (!name) return badRequest("name is required.");
  if (!categoryId) return badRequest("categoryId is required.");
  if (!subcategoryId) return badRequest("subcategoryId is required.");

  const slug = String(body.slug ?? "").trim()
    ? String(body.slug).trim()
    : slugify(name);
  if (!slug) return badRequest("Could not derive a slug from name.");

  // Validate FK existence.
  const [category, subcategory] = await Promise.all([
    db.category.findUnique({ where: { id: categoryId } }),
    db.subcategory.findUnique({ where: { id: subcategoryId } }),
  ]);
  if (!category) return badRequest("Category does not exist.");
  if (!subcategory || subcategory.categoryId !== categoryId)
    return badRequest("Subcategory does not exist for this category.");

  // Validate status / deliveryType if provided.
  if (
    body.status &&
    !["draft", "published", "archived"].includes(body.status)
  )
    return badRequest("Invalid status.");
  if (
    body.deliveryType &&
    !["project", "subscription", "retainer", "on_demand", "self_serve"].includes(
      body.deliveryType
    )
  )
    return badRequest("Invalid deliveryType.");

  let service: { id: string; slug: string; name: string };
  try {
    const row = await db.service.create({
      data: {
        name,
        slug,
        categoryId,
        subcategoryId,
        shortDescription: body.shortDescription ?? "",
        fullDescription: body.fullDescription ?? "",
        tags: body.tags ?? [],
        industries: body.industries ?? [],
        deliveryType: body.deliveryType ?? "project",
        timeline: body.timeline ?? "",
        rating: body.rating ?? 0,
        reviews: body.reviews ?? 0,
        popularity: body.popularity ?? 0,
        featured: body.featured ?? false,
        status: body.status ?? "published",
        accent: body.accent ?? "",
        icon: body.icon ?? "",
        problemsSolved: body.problemsSolved ?? [],
        capabilities: body.capabilities ?? [],
        deliverables: body.deliverables ?? [],
        process: body.process ?? [],
        technologies: body.technologies ?? [],
        faqs: body.faqs ?? [],
        metaTitle: body.metaTitle ?? null,
        metaDescription: body.metaDescription ?? null,
        createdBy: admin.name,
      },
      select: { id: true, slug: true, name: true },
    });
    service = row;
  } catch {
    return badRequest("Slug already exists for a service.");
  }

  await logActivity({
    actor: admin.name,
    action: "created",
    module: "Service Management",
    target: service.id,
    description: `Created service "${name}" (${slug}).`,
  });

  return created({
    ok: true,
    service: { id: service.id, slug: service.slug, name: service.name },
  });
}
