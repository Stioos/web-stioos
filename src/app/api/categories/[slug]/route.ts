import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, error } from "@/lib/auth";

// Always evaluate fresh — category content can change at any time.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/categories/[slug]
// Returns a single active category with its active subcategories
// (ordered by name). Powers the category landing page + the
// subcategory nav.
//
// 200 → { success: true, data: { category } }
//   category: Category & { subcategories: Subcategory[] }
// 404 → slug not found (or category is disabled)
// ============================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Next.js 16: dynamic segment params are async and arrive as a Promise.
    const { slug } = await params;

    if (!slug) {
      return error("Category slug is required", 400);
    }

    const category = await db.category.findFirst({
      where: { slug, status: "active" },
      include: {
        subcategories: {
          where: { status: "active" },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!category) {
      return error("Category not found", 404);
    }

    return success({ category });
  } catch (err) {
    console.error("[api/categories/[slug]] error:", err);
    return error("Unable to load category", 500);
  }
}
