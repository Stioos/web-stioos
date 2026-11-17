// ============================================================
// DIVISION ACCENTS — shared colorful identity for the 6 divisions.
// Used by the category pages and the categories directory.
// (The header keeps its own six-strip variant; hues intentionally match.)
// ============================================================

export interface DivisionAccent {
  /** tinted square behind small icons */
  tile: string;
  /** icon color inside tinted tiles */
  icon: string;
  /** footer status dot */
  dot: string;
  /** accent-colored text links */
  link: string;
  /** soft tinted chip (bg + text) for counts / badges */
  chip: string;
  /** ring color for hero icon tiles */
  heroRing: string;
  /** rgba glow used in hero radial gradients */
  glow: string;
  /** tailwind gradient for large accent surfaces */
  gradient: string;
  /** brighter eyebrow/label text color (literal class, Tailwind-scanned) */
  eyebrow: string;
  /** strong link color on light surfaces (literal class, Tailwind-scanned) */
  strong: string;
}

interface AccentSpec {
  tile: string;
  icon: string;
  dot: string;
  chip: string;
  heroRing: string;
  glow: string;
  gradient: string;
  eyebrow: string;
  strong: string;
}

const ACCENT_SPECS: Record<string, AccentSpec> = {
  "cat-ai-agents": {
    tile: "bg-violet-400/10 ring-violet-400/25",
    icon: "text-violet-300",
    dot: "bg-violet-400",
    chip: "bg-violet-400/10 text-violet-200 ring-violet-400/25",
    heroRing: "ring-violet-400/30",
    glow: "rgba(167,139,250,0.20)",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    eyebrow: "text-violet-400",
    strong: "text-violet-600",
  },
  "cat-tech-programming": {
    tile: "bg-sky-400/10 ring-sky-400/25",
    icon: "text-sky-300",
    dot: "bg-sky-400",
    chip: "bg-sky-400/10 text-sky-200 ring-sky-400/25",
    heroRing: "ring-sky-400/30",
    glow: "rgba(56,189,248,0.20)",
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
    eyebrow: "text-sky-400",
    strong: "text-sky-600",
  },
  "cat-digital-sales-marketing": {
    tile: "bg-rose-400/10 ring-rose-400/25",
    icon: "text-rose-300",
    dot: "bg-rose-400",
    chip: "bg-rose-400/10 text-rose-200 ring-rose-400/25",
    heroRing: "ring-rose-400/30",
    glow: "rgba(251,113,133,0.20)",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    eyebrow: "text-rose-400",
    strong: "text-rose-600",
  },
  "cat-business-enterprise": {
    tile: "bg-emerald-400/10 ring-emerald-400/25",
    icon: "text-emerald-300",
    dot: "bg-emerald-400",
    chip: "bg-emerald-400/10 text-emerald-200 ring-emerald-400/25",
    heroRing: "ring-emerald-400/30",
    glow: "rgba(52,211,153,0.20)",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    eyebrow: "text-emerald-400",
    strong: "text-emerald-600",
  },
  "cat-cloud-devops-mlops": {
    tile: "bg-amber-400/10 ring-amber-400/25",
    icon: "text-amber-300",
    dot: "bg-amber-400",
    chip: "bg-amber-400/10 text-amber-200 ring-amber-400/25",
    heroRing: "ring-amber-400/30",
    glow: "rgba(251,191,36,0.20)",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    eyebrow: "text-amber-400",
    strong: "text-amber-600",
  },
  "cat-multimedia-ai": {
    tile: "bg-fuchsia-400/10 ring-fuchsia-400/25",
    icon: "text-fuchsia-300",
    dot: "bg-fuchsia-400",
    chip: "bg-fuchsia-400/10 text-fuchsia-200 ring-fuchsia-400/25",
    heroRing: "ring-fuchsia-400/30",
    glow: "rgba(232,121,249,0.20)",
    gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
    eyebrow: "text-fuchsia-400",
    strong: "text-fuchsia-600",
  },
};

const FALLBACK: AccentSpec = {
  tile: "bg-amber-400/10 ring-amber-400/25",
  icon: "text-amber-300",
  dot: "bg-amber-400",
  chip: "bg-amber-400/10 text-amber-200 ring-amber-400/25",
  heroRing: "ring-amber-400/30",
  glow: "rgba(251,191,36,0.20)",
  gradient: "from-amber-500 via-orange-500 to-yellow-600",
  eyebrow: "text-amber-400",
  strong: "text-amber-600",
};

export const divisionAccent = (categoryId: string): DivisionAccent => {
  const spec = ACCENT_SPECS[categoryId] ?? FALLBACK;
  return { ...spec, link: spec.icon };
};
