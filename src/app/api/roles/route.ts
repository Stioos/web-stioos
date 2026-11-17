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
import { listRoles } from "@/lib/api/queries";

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

/** GET /api/roles — admin-only list of all roles. */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const roles = await listRoles();
  return ok({ roles });
}

/**
 * POST /api/roles — admin creates a role.
 * Body: { name, slug?, description?, permissions?, isSystem? }.
 * `permissions` is the PermissionMatrix object (Record<ModuleKey, PermissionAction[]>).
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const body = await parseBody<{
    name?: string;
    slug?: string;
    description?: string;
    permissions?: Record<string, string[]>;
    isSystem?: boolean;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");
  const name = String(body.name ?? "").trim();
  if (!name) return badRequest("name is required.");
  const slug = String(body.slug ?? "").trim()
    ? String(body.slug).trim()
    : slugify(name);
  if (!slug) return badRequest("Could not derive a slug from name.");

  let role: { id: string; slug: string };
  try {
    role = await db.role.create({
      data: {
        name,
        slug,
        description: body.description ?? "",
        permissions: body.permissions ?? {},
        isSystem: body.isSystem ?? false,
      },
      select: { id: true, slug: true },
    });
  } catch {
    return badRequest("Slug already exists for a role.");
  }

  await logActivity({
    actor: admin.name,
    action: "created",
    module: "Roles & Permissions",
    target: role.id,
    description: `Created role "${name}" (${slug}).`,
  });

  return created({ ok: true, role: { id: role.id, slug: role.slug } });
}
