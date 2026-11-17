import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  created,
  logActivity,
  notFound,
  unauthorized,
} from "@/lib/api/helpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/services/[id]/duplicate — admin clones a service.
 * Copy is created with name "<name> (Copy)", slug "<slug>-copy-<ts base36>",
 * status "draft", featured false. All other catalog fields are copied verbatim.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const { id } = await params;
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) return notFound("Service not found.");

  const stamp = Date.now().toString(36);
  const newSlug = `${existing.slug}-copy-${stamp}`;
  const newName = `${existing.name} (Copy)`;

  // Cast the Json-typed fields to their concrete TS shapes so Prisma's
  // InputJsonValue accepts them (the schema marks them as non-null Json,
  // but Prisma's output type is `JsonValue` which includes `null`).
  const tags = existing.tags as string[];
  const industries = existing.industries as string[];
  const problemsSolved = existing.problemsSolved as string[];
  const capabilities = existing.capabilities as string[];
  const deliverables = existing.deliverables as string[];
  const process = existing.process as { title: string; description: string }[];
  const technologies = existing.technologies as string[];
  const faqs = existing.faqs as { question: string; answer: string }[];

  const copy = await db.service.create({
    data: {
      name: newName,
      slug: newSlug,
      categoryId: existing.categoryId,
      subcategoryId: existing.subcategoryId,
      shortDescription: existing.shortDescription,
      fullDescription: existing.fullDescription,
      tags,
      industries,
      deliveryType: existing.deliveryType,
      timeline: existing.timeline,
      rating: 0,
      reviews: 0,
      popularity: 0,
      featured: false,
      status: "draft",
      accent: existing.accent,
      icon: existing.icon,
      problemsSolved,
      capabilities,
      deliverables,
      process,
      technologies,
      faqs,
      metaTitle: existing.metaTitle,
      metaDescription: existing.metaDescription,
      createdBy: admin.name,
    },
    select: { id: true, slug: true },
  });

  await logActivity({
    actor: admin.name,
    action: "duplicated",
    module: "Service Management",
    target: copy.id,
    description: `Duplicated service "${existing.name}" → "${newName}".`,
  });

  return created({ ok: true, service: { id: copy.id, slug: copy.slug } });
}
