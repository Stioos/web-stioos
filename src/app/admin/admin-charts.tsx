"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Admin dashboard charts, split into their own chunk.
 *
 * recharts is one of the heaviest dependencies in the app; the admin
 * landing page lazy-loads this component via next/dynamic so the initial
 * admin bundle and first paint no longer pay for it. The charts mount
 * after hydration with a matching skeleton placeholder (see the loading
 * option in admin/page.tsx), so there is no layout shift.
 */

export interface ActivityDatum {
  week: number;
  inquiries: number;
  requests: number;
}

export interface CategoryDatum {
  name: string;
  value: number;
}

const PIE_COLORS = ["#1e64e8", "#f59e0b", "#06b6d4", "#10b981", "#f97316", "#64748b", "#f43f5e"];

interface TooltipEntry {
  name?: string | number;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

function ActivityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-semibold text-foreground">Week {label}</p>
      {payload.map((entry) => (
        <div key={String(entry.dataKey)} className="flex items-center gap-2 text-xs">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize text-muted-foreground">{String(entry.name)}</span>
          <span className="font-semibold text-foreground">{String(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

function CardHead({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

export function AdminCharts({
  activityData,
  categoryData,
  totalServices,
  totalCategoryServices,
}: {
  activityData: ActivityDatum[];
  categoryData: CategoryDatum[];
  totalServices: number;
  totalCategoryServices: number;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-lg border bg-card p-5 lg:col-span-2">
        <CardHead
          title="Marketplace Activity"
          description="Weekly inquiries and service requests — last 12 weeks"
        />
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gradInquiries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e64e8" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#1e64e8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,116,139,0.18)" />
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v: number) => `W${v}`}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <Tooltip content={<ActivityTooltip />} cursor={{ stroke: "rgba(30,100,232,0.25)", strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="inquiries"
                name="Inquiries"
                stroke="#1e64e8"
                strokeWidth={2}
                fill="url(#gradInquiries)"
              />
              <Area
                type="monotone"
                dataKey="requests"
                name="Requests"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-5 border-t pt-3">
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[#1e64e8]" /> Inquiries
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Service requests
          </span>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <CardHead title="Category Distribution" description="Published catalog by category" />
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-44 w-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={80}
                  paddingAngle={2}
                  cornerRadius={3}
                  strokeWidth={0}
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid rgba(100,116,139,0.25)",
                    fontSize: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold tracking-tight text-foreground">{totalServices}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Services
              </span>
            </div>
          </div>
          <ul className="w-full flex-1 space-y-1.5">
            {categoryData.map((entry, i) => (
              <li key={entry.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="min-w-0 flex-1 truncate text-foreground">{entry.name}</span>
                <span className="font-semibold text-foreground">{entry.value}</span>
                <span className="w-9 text-right text-muted-foreground">
                  {Math.round((entry.value / totalCategoryServices) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default AdminCharts;
