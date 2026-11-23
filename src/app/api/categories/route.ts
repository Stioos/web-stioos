import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, error } from "@/lib/auth";

// Always evaluate fresh — categories can be added / renamed / disabled
// at any time and we never want a stale nav served from cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/categories
// Returns every active category, ordered by name, with a per-category
// subcategory count. Used by the public nav, the homepage directory,
// and the marketplace filter sidebar.
//
// 200 → { success: true, data: { categories } }
//   categories: Array<{
//     ...Category,
//     _count: { subcategories: number }
//   }>
// ============================================================

export async function GET(_request: NextRequest) {
  try {
    const categories = await db.category.findMany({
      where: { status: "active" },
      orderBy: { name: "asc" },
      // Only count active subcategories — a disabled subcategory shouldn't
      // inflate the number shown next to the category in the nav.
      include: {
        _count: {
          select: {
            subcategories: { where: { status: "active" } },
          },
        },
      },
    });

    return success({ categories });
  } catch (err) {
    console.error("[api/categories] error:", err);
    return error("Unable to load categories", 500);
  }
}
