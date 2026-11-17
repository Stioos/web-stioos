import { getCurrentAdmin } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import {
  getAdminOverview,
  listActivity,
  listAllRequests,
  listCategories,
  listInquiries,
  listServicesRaw,
} from "@/lib/api/queries";
import { AdminOverview } from "@/components/admin/admin-overview-view";

export const dynamic = "force-dynamic";

// 12-week bucketing — mirrors the server-side logic in /api/bootstrap/route.ts
// so the chart series is computed once on the server and passed as props.
const WEEKS = 12;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function bucketByWeek<T extends { createdAt: string }>(items: T[]): number[] {
  const buckets = new Array<number>(WEEKS).fill(0);
  const now = Date.now();
  for (const item of items) {
    const created = Date.parse(item.createdAt);
    if (Number.isNaN(created)) continue;
    const weeksAgo = Math.floor((now - created) / WEEK_MS);
    if (weeksAgo < 0 || weeksAgo >= WEEKS) continue;
    buckets[WEEKS - 1 - weeksAgo] += 1;
  }
  return buckets;
}

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/auth/login?next=/admin");
    return;
  }

  // Pull everything we need in parallel — the overview counts, the
  // recent lists, the full inquiry + request lists (for chart bucketing),
  // categories (for the distribution pie), and recent activity.
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

  // Full inquiry + request lists for the 12-week bucketing (the recent
  // slices above aren't enough to draw the chart).
  const allInquiries = inquiries;
  const inquiryBuckets = bucketByWeek(allInquiries);
  const requestBuckets = bucketByWeek(requests);
  const chartData = Array.from({ length: WEEKS }, (_, i) => ({
    week: `W${i + 1}`,
    inquiries: inquiryBuckets[i],
    requests: requestBuckets[i],
  }));

  // Category distribution — count services per category. We need every
  // service for this (not just the recent 5), so re-query without filters.
  const allServices = await listServicesRaw({});
  const categoryNameById = new Map<string, string>(
    categories.map((c) => [c.id, c.name])
  );
  const counts = new Map<string, number>();
  for (const s of allServices) {
    counts.set(s.categoryId, (counts.get(s.categoryId) ?? 0) + 1);
  }
  const sorted = Array.from(counts.entries())
    .map(([categoryId, value]) => ({
      name: categoryNameById.get(categoryId) ?? "Uncategorized",
      value,
    }))
    .sort((a, b) => b.value - a.value);
  const categoryData = sorted.slice(0, 6);
  const otherCount = sorted.slice(6).reduce((sum, d) => sum + d.value, 0);
  if (otherCount > 0) categoryData.push({ name: "Other", value: otherCount });

  return (
    <AdminOverview
      admin={admin}
      overview={overview}
      recentInquiries={inquiries.slice(0, 5)}
      recentServices={services.slice(0, 5)}
      recentActivity={recentActivity}
      chartData={chartData}
      categoryData={categoryData}
    />
  );
}
