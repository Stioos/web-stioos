"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Download,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { useToast } from "@/hooks/use-toast";
import { RESOURCES } from "@/data/content";
import type { Resource } from "@/types";

// ============================================================
// RESOURCES — Library of guides, templates & case studies
// ============================================================

const TYPE_LABELS: Record<Resource["type"], string> = {
  guide: "Guide",
  whitepaper: "Whitepaper",
  checklist: "Checklist",
  case_study: "Case Study",
  template: "Template",
};

const TYPE_ICONS: Record<Resource["type"], React.ComponentType<{ className?: string }>> = {
  guide: BookOpen,
  whitepaper: FileText,
  checklist: ClipboardList,
  case_study: FileCheck2,
  template: FileSpreadsheet,
};

const TYPE_FILTERS: { value: "all" | Resource["type"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "guide", label: "Guide" },
  { value: "whitepaper", label: "Whitepaper" },
  { value: "checklist", label: "Checklist" },
  { value: "case_study", label: "Case Study" },
  { value: "template", label: "Template" },
];

export default function ResourcesPage() {
  const { toast } = useToast();
  const [activeType, setActiveType] = useState<"all" | Resource["type"]>("all");
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});

  const published = useMemo(() => RESOURCES.filter((r) => r.status === "published"), []);
  const filtered = useMemo(
    () => (activeType === "all" ? published : published.filter((r) => r.type === activeType)),
    [published, activeType]
  );

  const startDownload = (resource: Resource) => {
    if (downloading[resource.id]) return;
    setDownloading((d) => ({ ...d, [resource.id]: true }));
    window.setTimeout(() => {
      setDownloading((d) => ({ ...d, [resource.id]: false }));
      setDownloaded((d) => ({ ...d, [resource.id]: true }));
      toast({
        title: "Download started — demo file",
        description: `“${resource.title}” (${resource.fileFormat}, ${resource.size}). This demo does not serve real files.`,
      });
    }, 700);
  };

  return (
    <>
      {/* ============================ HEADER ============================ */}
      <section className="relative overflow-hidden bg-brand-ink py-16 text-white md:py-20">
        <div className="absolute inset-0 surface-grid" aria-hidden="true" />
        <div
          className="absolute inset-0 radial-fade"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 50% 0%, rgba(30,100,232,0.22), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-amber-400">Resource Library</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Tools and frameworks, <span className="text-gradient-brand">ready to use.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
            Checklists, business-case templates, whitepapers, and case studies — the same artifacts our
            consultants use in real engagements, free to download.
          </p>
        </div>
      </section>

      {/* ========================== TYPE FILTERS ========================== */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter resources by type">
            {TYPE_FILTERS.map((f) => {
              const count =
                f.value === "all" ? published.length : published.filter((r) => r.type === f.value).length;
              return (
                <Button
                  key={f.value}
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveType(f.value)}
                  aria-pressed={activeType === f.value}
                  className={
                    activeType === f.value
                      ? "border-blue-600 bg-blue-600 font-semibold text-white hover:bg-blue-700"
                      : "border-border bg-card font-medium text-foreground hover:border-blue-600/40 hover:text-blue-700"
                  }
                >
                  {f.label}
                  <span className={activeType === f.value ? "ml-1.5 text-white/70" : "ml-1.5 text-muted-foreground"}>
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* ============================= GRID ============================= */}
          {filtered.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={FolderOpen}
              title="No resources of this type yet"
              description="New resources are added regularly — try another type or check back soon."
              action={{ label: "View all resources", onClick: () => setActiveType("all") }}
            />
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((resource, i) => {
                const TypeIcon = TYPE_ICONS[resource.type];
                return (
                  <Reveal
                    key={resource.id}
                    id={resource.id}
                    as="article"
                    delay={(i % 3) * 0.06}
                    margin="-40px"
                    className="flex scroll-mt-32 flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
                  >
                    {/* Accent header */}
                    <div className={`relative h-24 overflow-hidden bg-gradient-to-br ${resource.accent}`}>
                      <div className="absolute inset-0 surface-grid opacity-70" aria-hidden="true" />
                      <div className="relative flex h-full items-center justify-between p-4">
                        <span className="rounded-md bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                          {TYPE_LABELS[resource.type]}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-black/25 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                          <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          {resource.fileFormat}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h2 className="text-base font-semibold leading-snug text-foreground">
                        {resource.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {resource.description}
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Download className="h-3.5 w-3.5" aria-hidden="true" />
                          {(resource.downloads + (downloaded[resource.id] ? 1 : 0)).toLocaleString()} downloads
                        </span>
                        <span>{resource.size}</span>
                        <span className="ml-auto">
                          {format(new Date(resource.publishedAt), "MMM yyyy")}
                        </span>
                      </div>

                      <div className="mt-auto pt-5">
                        <Button
                          onClick={() => startDownload(resource)}
                          disabled={downloading[resource.id]}
                          className={
                            downloaded[resource.id]
                              ? "w-full border border-emerald-600/30 bg-emerald-500/10 font-semibold text-emerald-700 hover:bg-emerald-500/15"
                              : "w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
                          }
                          variant={downloaded[resource.id] ? "outline" : "default"}
                        >
                          {downloading[resource.id] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                              Preparing…
                            </>
                          ) : downloaded[resource.id] ? (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                              Download again
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}

          {/* Note */}
          <p className="mt-10 rounded-lg border border-dashed border-border bg-muted/40 px-5 py-4 text-center text-xs leading-relaxed text-muted-foreground">
            All resources are free and require no signup. Need something tailored — like an industry-specific
            readiness assessment?{" "}
            <Link href="/contact" className="font-semibold text-blue-600 hover:text-blue-700">
              Ask our experts
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
