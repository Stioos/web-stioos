import { signOut } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST() {
  await signOut();
  return Response.json({ ok: true });
}
