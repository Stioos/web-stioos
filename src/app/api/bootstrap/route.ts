import { NextRequest } from "next/server";
import { getCurrentAdmin } from "@/lib/auth-server";
import { ok, unauthorized } from "@/lib/api/helpers";
import {
  getAdminOverview,
  listActivity,
  listAllRequests,
  listCategories,
  listInquiries,
  listServicesRaw,
} from "@/lib/api/queries";

export const dynamic = "force-dynamic";

const WEEKS = 12;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Bucket a list of items with a createdAt ISO string into the last
 * `WEEKS` weeks. Returns an array oldest → newest where index 0 is
 * `WEEKS-1` weeks ago and index `WEEKS-1` is the current week.
 */
function bucketByWeek<
  T extends { createdAt: string }
>(items: T[]): number[] {
  const buckets = new Array<number>(WEEKS).fill(0);
  const now = Date.now();
  for (const item of items) {
    const created = Date.parse(item.createdAt);
    if (Number.isNaN(created)) continue;
    const weeksAgo = Math.floor((now - created) / WEEK_MS);
    if (weeksAgo < 0 || weeksAgo >= WEEKS) continue;
    // oldest first: index 0 = WEEKS-1 weeks ago
    buckets[WEEKS - 1 - weeksAgo] += 1;
  }
  return buckets;
}

/**
 * GET /api/bootstrap — admin dashboard landing payload.
 * Combines overview counts, the five most-recent inquiries, the five
 * newest services, the six most-recent activity entries, a 12-week
 * inquiries+requests chart series, and the service-per-category
 * distribution.
 */
export async function GET(_req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorized("Admin sign in required.");

  const [
    overview,
    inquiries,
    services,
    requests,
    categories,
    recentActivity,
  ] = await Promise.all([
    getAdminOverview(),
    listInquiries(),
    listServicesRaw({ sort: "newest", limit: 5 }),
    listAllRequests(),
    listCategories(),
    listActivity(6),
  ]);

  const recentInquiries = inquiries.slice(0, 5);
  const recentServices = services.slice(0, 5);

  // 12-week chart (oldest → newest, W1 = oldest).
  const inquiryBuckets = bucketByWeek(inquiries);
  const requestBuckets = bucketByWeek(requests);
  const chartData = Array.from({ length: WEEKS }, (_, i) => ({
    week: `W${i + 1}`,
    inquiries: inquiryBuckets[i],
    requests: requestBuckets[i],
  }));

  // Service count per category.
  const categoryNameById = new Map<string, string>(
    categories.map((c) => [c.id, c.name])
  );
  const allServices = await listServicesRaw({});
  const counts = new Map<string, number>();
  for (const s of allServices) {
    counts.set(s.categoryId, (counts.get(s.categoryId) ?? 0) + 1);
  }
  const categoryDistribution = Array.from(counts.entries()).map(
    ([categoryId, count]) => ({
      name: categoryNameById.get(categoryId) ?? categoryId,
      count,
    })
  );

  return ok({
    overview,
    recentInquiries,
    recentServices,
    recentActivity,
    chartData,
    categoryDistribution,
  });
}
