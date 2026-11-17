import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth-server";
import {
  badRequest,
  logActivity,
  ok,
  parseBody,
  unauthorized,
} from "@/lib/api/helpers";
import { getSetting } from "@/lib/api/queries";
import type {
  BrandSettings,
  HomepageContent,
  MarketplaceSettings,
} from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/settings — returns the four setting singletons.
 * Any missing key → null in the response. Public (read-only).
 */
export async function GET() {
  const [brand, marketplace, homepage, security] = await Promise.all([
    getSetting<BrandSettings>("brand"),
    getSetting<MarketplaceSettings>("marketplace"),
    getSetting<HomepageContent>("homepage"),
    getSetting<Record<string, unknown>>("security"),
  ]);
  return ok({ brand, marketplace, homepage, security });
}

/**
 * PATCH /api/settings — admin only. Body may include any subset of
 * { brand?, marketplace?, homepage?, security? } — each value is the full
 * settings object. Only keys actually present are upserted.
 */
export async function PATCH(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");

  const body = await parseBody<{
    brand?: BrandSettings;
    marketplace?: MarketplaceSettings;
    homepage?: HomepageContent;
    security?: Record<string, unknown>;
  }>(req);
  if (!body) return badRequest("Invalid JSON body.");

  const keys = ["brand", "marketplace", "homepage", "security"].filter(
    (k) => body[k as keyof typeof body] !== undefined
  );
  if (keys.length === 0) return badRequest("No settings provided.");

  for (const key of keys) {
    const value = body[key as keyof typeof body];
    await db.setting.upsert({
      where: { id: key },
      update: { value: value as never },
      create: { id: key, value: value as never },
    });
  }

  await logActivity({
    actor: admin.name,
    action: "updated",
    module: "Settings",
    target: "settings",
    description: `Updated settings: ${keys.join(", ")}.`,
  });

  return ok({ ok: true });
}
