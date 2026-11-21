# Task 2 — Talent Group Pages (6 full 12-section pages)

**Agent**: page-builder agent
**Date**: 2026-11-20
**Scope**: Replace the `TalentGroupPlaceholder` for the 6 talent-solutions
group slugs with full 12-section pages whose hero matches the design of
the main `/talent-solutions` page.

## What was built

### 1. Data file — `src/data/pages/talent-group-page-content.ts`

Exports the `GroupPageContent` interface and a `TALENT_GROUP_PAGE_CONTENT`
array with **unique, fully-written content** for all 6 group slugs:

| slug | side | theme |
|---|---|---|
| `get-trained` | candidate | training programs, curriculum, mentorship, capstones |
| `get-placed` | candidate | job openings, AI matching, interview prep, offer negotiation |
| `get-certified` | candidate | AI assessments, industry certifications, skill portfolios |
| `build-talent` | employer | train-to-hire cohorts, custom curriculum, corporate training |
| `hire-talent` | employer | staffing, talent sourcing, deployment, shortlists in 48h |
| `scale-workforce` | employer | workforce management, assessment, placement, bench |

Each entry contains every field required by the interface:
`heroTitle`, `heroHighlight`, `heroEyebrow`, `heroSubtitle`,
`heroStats[4]`, `heroTags[4]`, `heroGaugeValue`, `heroGaugeLabel`,
`heroKpis[3]`, `heroBars[2]`, `heroQuote`, `heroQuoteAttribution`,
`overview[2]`, `capabilities[6]`, `process[4]`, `benefits[4]`,
`audiences[2]`, `comparison[5]`, `industries[6]`, `guarantees[4]`,
`faqs[5]`, `ctaTitle`, `ctaHighlight`, `ctaSubtitle`.

A `getGroupPageContent(slug)` helper is also exported for the route.

### 2. Component — `src/components/page-builder/talent-group-page.tsx`

A **server component** (no `"use client"`) that renders the 12 sections
described in the task brief:

1. **Hero** — two-column merged card with Live Impact Signal panel
   (donut gauge SVG, 3 KPI before→after cards with strikethrough +
   delta badges, 2 progress bars, score badge + quote, 3 CTAs
   [Get Started + Get a Quote + Schedule Consultation], ShieldCheck
   trust footnote)
2. **Trust bar** — 6 trust badges in a slim strip
3. **Overview** — 2 paragraphs in a 2-column layout
4. **Capabilities** — 6 cards with gradient icon tiles (uses shared
   `Icon` component to resolve icon names from the data file)
5. **Process** — 4-step vertical zigzag timeline
6. **Benefits** — 4 outcome stat cards with metrics + gradient mesh
7. **Audiences** — 2 cards (who this is for)
8. **Comparison** — "With STIOOS" vs "Without STIOOS" table (5 rows)
9. **Industries** — 6 industry cards with gradient circular tiles
10. **Guarantees** — 4 guarantee cards with icons
11. **FAQ** — 5 questions with expandable answers (native `<details>`,
    CSS-class prefix `tgp-faq-` so styles never leak)
12. **CTA band** — final conversion with mesh-gradient background,
    headline + highlight, 2 CTAs, trust reinforcement row

Hero design matches the main `/talent-solutions` page (same grid
`lg:grid-cols-[1.3fr_1fr]`, same `Live Impact Signal` panel structure,
same donut gauge SVG with `linearGradient id="tgp-gauge"`, same
KPI/bar/quote/CTA stack).

### 3. Route integration — `src/app/(public)/talent-solutions/[slug]/page.tsx`

Added imports:
```ts
import { TalentGroupPage } from "@/components/page-builder/talent-group-page";
import { getGroupPageContent } from "@/data/pages/talent-group-page-content";
```

Replaced the placeholder branch with a content lookup:
```tsx
const group = getTalentStripGroup(slug);
if (group) {
  const groupContent = getGroupPageContent(slug);
  if (groupContent) {
    return <TalentGroupPage content={groupContent} />;
  }
  return <TalentGroupPlaceholder groupSlug={slug} />;
}
```

The `TalentGroupPlaceholder` is kept as a defensive fallback — only
fired if a new group slug is added to `talent-strip-groups.ts` without
a matching entry in the content file.

## Style adherence

- Dark navy `bg-brand-ink` / `bg-brand-navy` backgrounds, white text,
  amber/orange CTAs throughout — no indigo or blue primary colors.
- Body text uses `text-slate-300` / `text-slate-400` (overridden in
  light mode); avoided `text-amber-100` / `text-amber-200`.
- Hero stats use `bg-gradient-to-br from-amber-300 to-orange-400
  bg-clip-text text-transparent`.
- Each section has `id` + `scroll-mt-36`; section backgrounds
  alternate between `bg-brand-ink` and `bg-brand-navy`.
- Mobile-responsive throughout (`grid-cols-2 sm:grid-cols-3
  lg:grid-cols-6` etc.); touch targets ≥ 44px on CTAs.
- Uses `Reveal` from `@/components/motion/reveal` for scroll
  animations and `Link` from `next/link` for navigation.

## Verification

### Lint
```
$ bun run lint
$ eslint .
exit=0
```
Clean — no warnings, no errors.

### HTTP status + section counts
```
get-trained:       HTTP=200 sections=12
get-placed:        HTTP=200 sections=12
get-certified:     HTTP=200 sections=12
build-talent:      HTTP=200 sections=12
hire-talent:       HTTP=200 sections=12
scale-workforce:   HTTP=200 sections=12
```

All 6 pages render with HTTP 200 and exactly 12 `<section id=`
elements each — matching the required section count.

### Dev log
The dev log shows successful compiles and 200 responses for every
group slug, e.g.:
```
GET /talent-solutions/get-trained     200 in 254ms
GET /talent-solutions/get-placed      200 in 259ms
GET /talent-solutions/get-certified   200 in 211ms
GET /talent-solutions/build-talent    200 in 239ms
GET /talent-solutions/hire-talent     200 in 225ms
GET /talent-solutions/scale-workforce 200 in 410ms
```

## Notes for downstream agents

- The `GroupPageContent` interface lives in the data file, not in a
  separate types file. If a future agent needs to extend it (e.g. add
  a `heroIcon` field for per-group hero icons), edit
  `src/data/pages/talent-group-page-content.ts` directly.
- Icon names in the data file (`capabilities[].icon`,
  `guarantees[].icon`) map into the shared `Icon` component at
  `src/components/shared/icon.tsx` — only icon names present in that
  file's `ICONS` map will render (others fall back to `Sparkles`).
- The `BuildingIcon` helper inside the component is a small inline SVG
  used for the industries grid (kept local to avoid adding new icon
  imports to the shared map); swap for a Lucide `Building2` if a
  future agent wants to remove the local helper.
