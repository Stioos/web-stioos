"use client";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "eyebrow mb-3 flex items-center gap-2",
            align === "center" && "justify-center",
            dark ? "text-amber-400" : "text-brand-blue"
          )}
        >
          <span className={cn("inline-block h-px w-6", dark ? "bg-amber-400/60" : "bg-brand-blue/50")} />
          {eyebrow}
          {align === "center" && (
            <span className={cn("inline-block h-px w-6", dark ? "bg-amber-400/60" : "bg-brand-blue/50")} />
          )}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight text-balance md:text-4xl",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed md:text-lg", dark ? "text-slate-300" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </div>
  );
}
