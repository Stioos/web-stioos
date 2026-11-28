"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft, ChevronRight, ArrowUpDown, Search, X,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  hideBelow?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  /** object keys to search across; omit to disable search */
  searchKeys?: (keyof T & string)[];
  searchPlaceholder?: string;
  pageSize?: number;
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  bulkActions?: (ids: string[], clear: () => void) => React.ReactNode;
  toolbar?: React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  dense?: boolean;
  stickyHeader?: boolean;
  stickyPageHeader?: boolean;
}

const HIDE: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKeys,
  searchPlaceholder = "Search…",
  pageSize = 8,
  selectable = false,
  selected,
  onSelectedChange,
  bulkActions,
  toolbar,
  rowActions,
  onRowClick,
  loading = false,
  emptyState,
  className,
  dense = false,
  stickyHeader = false,
  stickyPageHeader = false,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [controlsHeight, setControlsHeight] = useState(0);
  const [controlsStuck, setControlsStuck] = useState(false);
  const sel = selected ?? internalSelected;
  const setSel = onSelectedChange ?? setInternalSelected;

  useEffect(() => {
    if (!stickyPageHeader) return;
    const controls = controlsRef.current;
    const scrollArea = controls?.closest("main");
    if (!controls || !scrollArea) return;

    const observer = new ResizeObserver(() => setControlsHeight(controls.getBoundingClientRect().height));
    observer.observe(controls);
    const updateStuck = () => {
      const stickyTop = scrollArea.getBoundingClientRect().top + parseFloat(getComputedStyle(scrollArea).paddingTop);
      setControlsStuck(controls.getBoundingClientRect().top <= stickyTop + 1);
    };
    scrollArea.addEventListener("scroll", updateStuck, { passive: true });
    updateStuck();
    return () => {
      observer.disconnect();
      scrollArea.removeEventListener("scroll", updateStuck);
    };
  }, [stickyPageHeader]);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (query && searchKeys?.length) {
      const q = query.toLowerCase();
      rows = rows.filter((r) =>
        searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        rows.sort((a, b) => {
          const va = col.sortValue!(a);
          const vb = col.sortValue!(b);
          const cmp = typeof va === "number" && typeof vb === "number"
            ? va - vb
            : String(va).localeCompare(String(vb));
          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }
    return rows;
  }, [data, query, searchKeys, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => sel.includes(r.id));
  const someSelected = sel.length > 0;

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleAll = () => {
    if (!onSelectedChange) return;
    if (allOnPageSelected) {
      onSelectedChange(sel.filter((id) => !pageRows.some((r) => r.id === id)));
    } else {
      onSelectedChange(Array.from(new Set([...sel, ...pageRows.map((r) => r.id)])));
    }
  };

  const toggleOne = (id: string) => {
    if (!onSelectedChange) return;
    onSelectedChange(sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id]);
  };

  const TableElement = stickyPageHeader ? "table" : Table;

  return (
    <div className={cn(stickyPageHeader ? "space-y-0" : "space-y-3", className)}>
      {(searchKeys || toolbar) && (
        <div ref={controlsRef} className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", stickyPageHeader && "sticky top-0 z-30 bg-background py-2 pb-5")}>
          {stickyPageHeader && controlsStuck && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full h-4 bg-background sm:h-6" />}
          <div className="flex flex-1 items-center gap-2">
            {searchKeys && (
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="pl-8 h-9"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
        </div>
      )}

      {selectable && someSelected && bulkActions && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/25 bg-primary/5 px-3 py-2">
          <p className="text-sm font-medium text-foreground">
            {sel.length} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">{bulkActions(sel, () => onSelectedChange?.([]))}</div>
        </div>
      )}

      <div className={cn("table-scroll rounded-lg border bg-card", stickyPageHeader ? "overflow-x-auto md:overflow-visible" : "overflow-x-auto")}>
        <TableElement className={stickyPageHeader ? "w-full border-separate border-spacing-0 caption-bottom text-sm" : undefined}>
          <TableHeader>
            <TableRow className={cn("bg-muted/60 hover:bg-muted/60", stickyHeader && !stickyPageHeader && "sticky top-0 z-10 bg-muted/95 shadow-sm")}>
              {selectable && (
                <TableHead className={cn("w-10 pl-4", stickyPageHeader && "sticky z-20 bg-muted")} style={stickyPageHeader ? { top: controlsHeight } : undefined}>
                  <Checkbox
                    checked={pageRows.length > 0 && allOnPageSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all on page"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    stickyPageHeader ? "sticky z-20 bg-muted" : stickyHeader && "sticky top-0 z-20 bg-muted/95 shadow-sm",
                    col.hideBelow && HIDE[col.hideBelow],
                    col.className
                  )}
                  style={stickyPageHeader ? { top: controlsHeight } : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      {col.header}
                      <ArrowUpDown className={cn("h-3 w-3", sortKey === col.key ? "text-primary" : "text-muted-foreground/50")} />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
              {rowActions && <TableHead className={cn("w-14 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground", stickyPageHeader ? "sticky z-20 bg-muted" : stickyHeader && "sticky top-0 z-20 bg-muted/95 shadow-sm")} style={stickyPageHeader ? { top: controlsHeight } : undefined}>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {selectable && <TableCell className="pl-4"><Skeleton className="h-4 w-4" /></TableCell>}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.hideBelow && HIDE[col.hideBelow]}>
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </TableCell>
                  ))}
                  {rowActions && <TableCell><Skeleton className="ml-auto h-4 w-8" /></TableCell>}
                </TableRow>
              ))}

            {!loading && pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="h-40">
                  {emptyState ?? (
                    <div className="flex flex-col items-center justify-center gap-1 text-center">
                      <p className="font-medium text-foreground">No results found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              pageRows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(onRowClick && "cursor-pointer", sel.includes(row.id) && "bg-primary/5")}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={sel.includes(row.id)}
                        onCheckedChange={() => toggleOne(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key} className={cn(dense && "py-2", col.hideBelow && HIDE[col.hideBelow], col.className)}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      {rowActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </TableElement>
      </div>

      <div className={cn("flex flex-col items-center justify-between gap-3 sm:flex-row", stickyPageHeader && "mt-3")}>
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}
          </span>{" "}
          of <span className="font-medium text-foreground">{filtered.length}</span>
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
            const p = i + 1;
            return (
              <Button
                key={p}
                variant={p === safePage ? "default" : "outline"}
                size="sm"
                className="h-8 min-w-8 px-2"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            );
          })}
          {totalPages > 7 && <span className="px-1 text-muted-foreground">…</span>}
          <Button
            variant="outline"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
