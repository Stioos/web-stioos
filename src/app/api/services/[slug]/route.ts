import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, error } from "@/lib/auth";

// Always evaluate fresh — a service's status / content can change at any
// time and we never want a stale detail page served from cache.
export const dynamic = "force-dynamic";

// ============================================================
// GET /api/services/[slug]
// Public single-service detail. Fetches the full record (including the
// heavy JSON fields: tags, problemsSolved, capabilities, deliverables,
// process, technologies, faqs) plus the related category and
// subcategory for breadcrumbs / sidebar rendering.
//
// Only `published` services are reachable here. Draft / archived
// services return 404 — admins must use /api/admin/services/[id].
//
// 200 → { success: true, data: { service } }
// 404 → slug not found (or not published)
// ============================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Next.js 16: dynamic segment params are async and arrive as a Promise.
    const { slug } = await params;

    if (!slug) {
      return error("Service slug is required", 400);
    }

    const service = await db.service.findFirst({
      where: { slug, status: "published" },
      include: {
        category: true,
        subcategory: true,
      },
    });

    if (!service) {
      return error("Service not found", 404);
    }

    return success({ service });
  } catch (err) {
    console.error("[api/services/[slug]] error:", err);
    return error("Unable to load service", 500);
  }
}
