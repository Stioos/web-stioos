import { NextRequest } from "next/server";
import { signUpBuyer, type SignUpInput } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Partial<SignUpInput> = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const ua = req.headers.get("user-agent");
  const result = await signUpBuyer(
    {
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      password: String(body.password ?? ""),
      company: body.company,
      country: body.country,
      phone: body.phone,
      phoneCountry: body.phoneCountry,
      registrationType: body.registrationType,
      accountType: body.accountType,
      profession: body.profession,
      companySize: body.companySize,
      intent: body.intent,
      intentTimeline: body.intentTimeline,
      registrationSource: body.registrationSource,
    },
    ua
  );
  if (!result.ok || !result.user) {
    return Response.json({ error: result.error }, { status: 400 });
  }
  return Response.json({ ok: true, user: result.user });
}
