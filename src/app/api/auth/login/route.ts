import { NextRequest } from "next/server";
import { signInAdmin, signInBuyer } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Resolves admin first, then buyer (single active session).
 * Returns { ok, role, user? | admin? }.
 */
export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password)
    return Response.json({ error: "Email and password are required." }, { status: 400 });

  const ua = req.headers.get("user-agent");

  // Admin first (platform staff)
  const adminAttempt = await signInAdmin(email, password, ua);
  if (adminAttempt.ok && adminAttempt.admin) {
    return Response.json({ ok: true, role: "admin", admin: adminAttempt.admin });
  }
  // If the email exists on an admin but the password was wrong, surface that
  // error instead of falling through to a buyer "no account" message.
  if (adminAttempt.error && !adminAttempt.error.toLowerCase().includes("no admin")) {
    return Response.json({ error: adminAttempt.error }, { status: 401 });
  }

  // Buyer
  const buyerAttempt = await signInBuyer(email, password, ua);
  if (buyerAttempt.ok && buyerAttempt.user) {
    return Response.json({ ok: true, role: "buyer", user: buyerAttempt.user });
  }
  return Response.json({ error: buyerAttempt.error ?? "Sign in failed." }, { status: 401 });
}
