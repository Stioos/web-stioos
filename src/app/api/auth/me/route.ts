import { getCurrentSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/** GET /api/auth/me — returns the current session's principal (buyer or admin). */
export async function GET() {
  const session = await getCurrentSession();
  if (!session) return Response.json({ ok: false }, { status: 200 });
  if (session.kind === "admin") {
    return Response.json({ ok: true, kind: "admin", admin: session.admin });
  }
  return Response.json({ ok: true, kind: "buyer", user: session.user });
}
