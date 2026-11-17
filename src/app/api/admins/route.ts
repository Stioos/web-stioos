import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, hashPassword } from "@/lib/auth-server";
import {
  badRequest,
  created,
  logActivity,
  notify,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";
import { listAdmins } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/** GET /api/admins — admin-only list of all admin users. */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const admins = await listAdmins();
  return ok({ admins });
}

/**
 * POST /api/admins — admin creates another admin account.
 * Body: { name, email, password?, phone?, roleId?, title?, status? }.
 * Password defaults to "demo1234". A notification is emitted so the
 * "Admin account created" event surfaces in the dashboard activity feed.
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const body = await parseBody<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    roleId?: string;
    title?: string;
    status?: string;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!name) return badRequest("name is required.");
  if (!email) return badRequest("email is required.");

  if (
    body.status &&
    !["active", "inactive", "suspended"].includes(body.status)
  )
    return badRequest("Invalid status.");

  // Validate roleId existence if provided.
  if (body.roleId) {
    const role = await db.role.findUnique({ where: { id: body.roleId } });
    if (!role) return badRequest("Role does not exist.");
  }

  const password = await hashPassword(
    body.password && body.password.length > 0 ? body.password : "demo1234"
  );

  // Derive avatar initials from the name (first letters of up to two words).
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  let adminUser: { id: string };
  try {
    adminUser = await db.adminUser.create({
      data: {
        name,
        email,
        password,
        phone: body.phone ?? "",
        roleId: body.roleId ?? "role-super-admin",
        title: body.title ?? "",
        status: body.status ?? "active",
        avatarInitials: initials || null,
      },
      select: { id: true },
    });
  } catch {
    return badRequest("An admin account with this email already exists.");
  }

  await notify({
    type: "admin_created",
    title: "Admin account created",
    message: `${admin.name} created an admin account for ${name}.`,
  });
  await logActivity({
    actor: admin.name,
    action: "created",
    module: "Admin Management",
    target: adminUser.id,
    description: `Created admin account for ${name} (${email}).`,
  });

  return created({ ok: true, admin: { id: adminUser.id } });
}
