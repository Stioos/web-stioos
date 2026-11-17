import { Skeleton } from "@/components/ui/skeleton";

// ============================================================
// ROUTE LOADING — shown by Next.js App Router while the route
// segment is being compiled/rendered. Improves perceived load
// speed by showing a skeleton instantly instead of a blank
// white screen during on-demand compilation in dev.
// ============================================================

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Skeleton hero */}
      <div className="mb-12 space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-14 w-3xl max-w-full" />
        <Skeleton className="h-14 w-2xl max-w-full" />
        <Skeleton className="h-5 w-xl max-w-full" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-12 w-44 rounded-xl" />
          <Skeleton className="h-12 w-44 rounded-xl" />
        </div>
      </div>

      {/* Skeleton card grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border">
            <Skeleton className="h-36 w-full rounded-none" />
            <div className="space-y-2.5 p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 flex-1 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
