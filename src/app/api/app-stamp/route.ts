import { getAppStamp } from "@/lib/app-stamp";

/**
 * Fingerprint endpoint for the stale-tab watchdog. Always fresh — the
 * client compares this against the stamp captured at page load and
 * hard-reloads itself when the server is running different code.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stamp = await getAppStamp();
    return Response.json(
      { stamp },
      { headers: { "cache-control": "no-store, max-age=0" } }
    );
  } catch {
    return Response.json(
      { stamp: null },
      { headers: { "cache-control": "no-store, max-age=0" } }
    );
  }
}
