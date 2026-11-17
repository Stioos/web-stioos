import type { PageAccent } from "@/data/pages/types";

// ============================================================
// PAGE BUILDER ACCENTS — static Tailwind class maps per accent.
// Classes are written out fully so the Tailwind scanner sees them.
// ============================================================

export interface AccentClasses {
  /** small pill chip (border/bg/text) */
  chip: string;
  /** icon tile (bg/text/ring) */
  tile: string;
  /** solid primary button */
  btn: string;
  /** ghost button hover treatment */
  btnGhostHover: string;
  /** gradient text stops */
  gradText: string;
  /** glow blob color */
  glow: string;
  /** progress/feature bar gradient */
  bar: string;
  /** solid fill (SVG circles, dots) */
  solid: string;
  /** section index number color */
  idx: string;
  /** section index / accent text color (full opacity) */
  idxSolid: string;
  /** pill chip with white text (for highlighted cards) */
  chipSolid: string;
  /** card hover border */
  cardHoverBorder: string;
  /** soft section tint */
  softBg: string;
  /** avatar gradient */
  avatar: string;
  /** CTA band gradient */
  band: string;
}

export const ACCENT: Record<PageAccent, AccentClasses> = {
  amber: {
    chip: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    tile: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/25",
    btn: "bg-amber-400 text-brand-ink hover:bg-amber-300",
    btnGhostHover: "hover:border-amber-400/40 hover:bg-white/[0.08]",
    gradText: "from-amber-300 via-orange-300 to-amber-400",
    glow: "bg-amber-400/25",
    bar: "bg-gradient-to-r from-amber-500 to-amber-300",
    solid: "fill-amber-400",
    idx: "text-amber-400/70",
    idxSolid: "text-amber-400",
    chipSolid: "border-amber-400/40 bg-amber-400/15 text-white",
    cardHoverBorder: "hover:border-amber-400/40",
    softBg: "bg-amber-400/[0.04]",
    avatar: "from-amber-500/80 to-orange-500/80",
    band: "from-amber-500/[0.14] via-orange-500/[0.06] to-transparent",
  },
  emerald: {
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    tile: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-400/25",
    btn: "bg-emerald-400 text-brand-ink hover:bg-emerald-300",
    btnGhostHover: "hover:border-emerald-400/40 hover:bg-white/[0.08]",
    gradText: "from-emerald-300 via-teal-300 to-emerald-400",
    glow: "bg-emerald-400/25",
    bar: "bg-gradient-to-r from-emerald-500 to-emerald-300",
    solid: "fill-emerald-400",
    idx: "text-emerald-400/70",
    idxSolid: "text-emerald-400",
    chipSolid: "border-emerald-400/40 bg-emerald-400/15 text-white",
    cardHoverBorder: "hover:border-emerald-400/40",
    softBg: "bg-emerald-400/[0.04]",
    avatar: "from-emerald-500/80 to-teal-500/80",
    band: "from-emerald-500/[0.14] via-teal-500/[0.06] to-transparent",
  },
  violet: {
    chip: "border-violet-400/30 bg-violet-400/10 text-violet-300",
    tile: "bg-violet-500/10 text-violet-300 ring-1 ring-violet-400/25",
    btn: "bg-violet-400 text-brand-ink hover:bg-violet-300",
    btnGhostHover: "hover:border-violet-400/40 hover:bg-white/[0.08]",
    gradText: "from-violet-300 via-purple-300 to-fuchsia-400",
    glow: "bg-violet-400/25",
    bar: "bg-gradient-to-r from-violet-500 to-fuchsia-400",
    solid: "fill-violet-400",
    idx: "text-violet-400/70",
    idxSolid: "text-violet-400",
    chipSolid: "border-violet-400/40 bg-violet-400/15 text-white",
    cardHoverBorder: "hover:border-violet-400/40",
    softBg: "bg-violet-400/[0.04]",
    avatar: "from-violet-500/80 to-purple-500/80",
    band: "from-violet-500/[0.14] via-purple-500/[0.06] to-transparent",
  },
};
