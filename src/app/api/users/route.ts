import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, hashPassword } from "@/lib/auth-server";
import {
  badRequest,
  created,
  logActivity,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";
import { listUsers } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

/** GET /api/users — admin-only list of all buyers. */
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const users = await listUsers();
  return ok({ users });
}

/**
 * POST /api/users — admin creates a buyer.
 * Body: { name, email, password?, company?, phone?, country?, role?, status?,
 *         ...buyer registration capture fields }.
 * Email must be unique (collisions → 400). Password defaults to "demo1234".
 */
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");
  const body = await parseBody<{
    name?: string;
    email?: string;
    password?: string;
    company?: string;
    phone?: string;
    country?: string;
    role?: string;
    status?: string;
    phoneCountry?: string;
    registrationType?: string;
    accountType?: string;
    profession?: string;
    companySize?: string;
    intent?: string;
    intentTimeline?: string;
    registrationSource?: string;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!name) return badRequest("name is required.");
  if (!email) return badRequest("email is required.");

  if (body.role && !["buyer", "member"].includes(body.role))
    return badRequest("Invalid role.");
  if (
    body.status &&
    !["active", "inactive", "suspended"].includes(body.status)
  )
    return badRequest("Invalid status.");

  const password = await hashPassword(
    body.password && body.password.length > 0 ? body.password : "demo1234"
  );

  let user: { id: string };
  try {
    user = await db.user.create({
      data: {
        name,
        email,
        password,
        company: body.company ?? "",
        phone: body.phone ?? "",
        country: body.country ?? "",
        role: body.role ?? "buyer",
        status: body.status ?? "active",
        phoneCountry: body.phoneCountry ?? null,
        registrationType: body.registrationType ?? null,
        accountType: body.accountType ?? null,
        profession: body.profession ?? null,
        companySize: body.companySize ?? null,
        intent: body.intent ?? null,
        intentTimeline: body.intentTimeline ?? null,
        registrationSource: body.registrationSource ?? null,
      },
      select: { id: true },
    });
  } catch {
    return badRequest("An account with this email already exists.");
  }

  await logActivity({
    actor: admin.name,
    action: "created",
    module: "User Management",
    target: user.id,
    description: `Created buyer account for ${name} (${email}).`,
  });

  return created({ ok: true, user: { id: user.id } });
}
