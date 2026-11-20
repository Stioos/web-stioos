# Task 3 — Talent Solutions landing page redesign (12 sections, new two-column hero)

**Agent:** 3-talent-solutions-landing-redesign
**Route:** `/talent-solutions`
**File rewritten:** `src/app/(public)/talent-solutions/page.tsx`

## Summary
Major redesign of the employer-facing Talent Solutions landing page. The old
page had a centered-text hero and 15 sections (including global-presence,
case-studies and pricing which were not in the new spec). The new page has
exactly 12 sections per the brief and a brand-new two-column hero that
mirrors the HeroSection design used on the individual talent service pages
(e.g. `/talent-solutions/talent-assessment`).

The hero is a single merged card with two columns separated by a vertical
divider rail (lg only): left column carries breadcrumb pills, a gradient
icon tile, the gradient-highlighted headline, subtitle, feature pills, a
4-cell stats row and an engaging description paragraph; the right column
carries the Live Impact Signal panel (donut gauge + 3 KPI before/after
cards + 2 progress bars + score badge + quote), three CTAs (Hire Talent
Now primary, Get a Quote, Schedule Consultation) and a trust reinforcement
footnote.

## File structure
- Server component (no `"use client"`). Static content (TRUST_BADGES,
  KPIS, PROCESS_STEPS, ROI_METRICS, COMPARISON_ROWS, INDUSTRIES_SERVED,
  GUARANTEES, EMPLOYER_FAQS, PILLAR_STYLE, PILLAR_ICON, plus HERO_*
  constants for the two-column hero) is declared at module scope. Only
  `TALENT_COLUMNS` and the `TalentAccent` type are imported from
  `@/data/talent-solutions` per the brief.
- `<main>` wraps everything; every `<section>` has an `id` for deep-linking
  and `scroll-mt-36` for anchor offset.
- Alternating section backgrounds (`bg-brand-ink` / `bg-brand-navy`) for
  visual rhythm.

## Hero design (matches the reference)
The hero follows the exact structure of `src/components/page-builder/hero.tsx`
(HeroSection), but hardcoded for the landing page since there is no PageSpec.
Left column:
1. Routing pills — "Talent Solutions" (link to /talent-solutions) +
   "For Employers" (span). Both use the same `PILL_BASE` styling
   (white/5% bg, white/10 ring, uppercase tracking, amber icon).
2. Identity row — gradient icon tile (from-amber-400 to-orange-500, ring-1,
   shadow-amber-500/30) with Users icon + headline "Hire job-ready talent,
   **not resumes.**" (gradient-clipped tail via from-amber-300 via-orange-300
   to-amber-400).
3. Subtitle — STIOOS trains, screens, places candidates against role spec.
4. Feature pills — AI Sourcing, 5-Stage Screening, Stack Training, 90-Day
   Replacement.
5. Stats row — 4 cells (2M+ pool / 48h shortlists / 96% retention / On
   request timeline) in border-white/8% bg-white/4% tiles, amber value,
   slate-400 label.
6. Engaging description — bold opening sentence + standard SLA pitch +
   slate-500 fine print.

Right column (Live Impact Signal panel + CTAs):
- Live Impact Signal panel — header chip with pulsing amber dot and
  "Readiness" caption, an 85% donut gauge (SVG with amber→orange linear
  gradient, dasharray-based fill), 3 KPI before/after cards (Placement 54→96%,
  Time-to-shortlist 21→48h, Cost-per-hire 100→60%) each with strikethrough
  before, bold after, emerald +delta% chip, 2 progress bars (Retention
  54→96%, Ramp speed 20→92%) with gradient fill, score badge + italic quote.
- 3 CTAs in a grid — primary "Hire Talent Now" full-width amber-500
  button with arrow, then a 2-col row of "Get a Quote" (amber-500) and
  "Schedule Consultation" (white outline).
- Trust footnote with ShieldCheck icon and SLA / replacement / weekly
  reporting reinforcement.

## 12 sections (in order)
1. `#hero` — Two-column merged card layout matching the reference design.
2. `#trust` — 6 trust badges in a slim horizontal strip (grid-cols-2 /
   sm:3 / lg:6) with hover border lift.
3. `#kpi` — 4 stat cards with gradient icon tiles (amber, emerald, orange,
   amber→rose) + glow blobs behind each tile + gradient-clipped white value
   text + hover lift.
4. `#services` — 3 pillars rendered from `TALENT_COLUMNS`; each pillar
   has a colored header (amber / emerald / orange) and a hover glow blob,
   3 service cards with icon tile, name, tag chip, description, and a
   `next/link` to `/talent-solutions/<slug>`.
5. `#audiences` — 2 cards. Employer card is PRIMARY (amber border,
   gradient bg, spans 2 cols on lg, 4 benefit bullets + 2 CTAs, plus a
   floating 96% placement badge rotated -3deg that overlaps the top-right
   edge). Seeker card is secondary with 4 bullets + arrow link.
6. `#process` — 5-step horizontal timeline with connecting line behind
   the cards + arrow nodes between steps (lg only). Each step: gradient
   icon circle, Step NN mono label, amber duration pill, title,
   description. Hover lift.
7. `#roi` — Side-by-side comparison. Traditional Hiring (rose border,
   rose ring gauge at 100% as decorative backdrop, rose gradient bars,
   XCircle bullets) vs STIOOS Talent (amber border, amber ring gauge at
   77% as decorative backdrop, amber gradient bars with gradient-clipped
   value text, CheckCircle2 bullets).
8. `#comparison` — 10-row color-coded matrix table. STIOOS column has a
   2px amber border (top/bottom in header, left in body rows), amber-tint
   bg, amber-300 text + CheckCircle2 icon prefix. Horizontally scrollable
   on mobile (min-w-[720px]).
9. `#industries` — 8 industry tiles with gradient icon tiles that scale
   on hover (110%) + an inset ring that fades in on hover.
10. `#guarantees` — 4 guarantee cards with gradient icon tiles
    (amber→orange) + glow shadow behind the tile (shadow-amber-500/40) +
    a blur-2xl glow blob that fades in on hover.
11. `#faq` — 6 employer-focused AEO-optimized natural-language questions
    with native `<details>` expandable answers. Mono-numbered (01-06),
    amber chevron rotates 180deg when open, border + bg tint change on
    open.
12. `#cta` — Final conversion band. Headline "Build your talent pipeline
    this quarter", 2 CTAs (Book a Free Consultation primary amber +
    Explore Services outline), trust reinforcement row (SLA-backed /
    90-day replacement / weekly reporting), surface-grid bg + amber blur
    orb, plus a floating "48h start" accent badge in the top-right.

## Color policy compliance
- No indigo or blue primary colors. The data model defines three accents
  (blue / emerald / orange); the PILLAR_STYLE record remaps `"blue"` to
  amber locally so the three pillar identities are amber / emerald / orange.
- Hero gradient + glow + CTA all amber/orange (rgba(245,158,11,...) and
  rgba(249,115,22,...)).
- Rose used ONLY for the "Traditional Hiring" risk/cost bars and ring
  gauge in the ROI infographic (a semantic "bad" color, not a primary).
- All CTAs are amber-filled (`bg-amber-500 text-brand-ink`) or outlined
  white/transparent.
- Font contrast respected: `text-amber-400` for accent text, `text-slate-300`
  for subtitle body, `text-slate-600 dark:text-slate-400` for fine print.
  No `text-amber-100` / `text-amber-200` used.

## Out-of-the-box design touches applied
- Gradient borders / ring insets on KPI tiles, industries grid.
- Floating stat badge on the employer audience card (overlaps the
  top-right edge, rotated 3deg).
- Connecting line + arrow nodes on the process timeline.
- Progress ring gauges (SVG circles) as decorative backdrops in the ROI
  infographic.
- Color-coded matrix table with 2px amber border on the STIOOS column.
- Hover lift effects (`hover:-translate-y-1`) on every card.
- Gradient text on KPI values (white→slate-300) and STIOOS ROI values
  (amber→orange).
- Icon tiles with glow shadows (shadow-amber-500/40 on guarantees,
  shadow-{color}-500/30 on KPI gradient tiles).
- Gradient icon tiles on KPI band (each tile uses a distinct gradient).
- Hover glow blobs that fade in on the service pillars and guarantees.

## Verification
- `bun run lint`: zero errors, zero warnings (clean `$ eslint .` output,
  no diagnostics printed for the file).
- Dev log: `GET /talent-solutions 200 in 875ms (next.js: 16ms,
  application-code: 859ms)` — first hit after the file change includes
  compile time, subsequent hits are faster.
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/talent-solutions`
  → `200`.
- `curl -s http://localhost:3000/talent-solutions | grep -oE 'id="..."'`
  confirmed all 12 section anchors are present in the rendered HTML:
  audiences, comparison, cta, faq, guarantees, hero, industries, kpi,
  process, roi, services, trust.
- Did NOT touch: `src/data/talent-solutions.ts`, the `[slug]` page,
  `src/components/page-builder/hero.tsx`, globals.css, layout.tsx, the
  header/mega-menu, or any other file.

## Sections removed vs the previous page
The old page had 15 sections. Three were dropped to match the new 12-section
spec:
- `#global-presence` (4 region cards + presence stats strip) — removed.
- `#case-studies` (3 case study cards) — removed.
- `#pricing` (3 engagement tiers) — removed.

The static data arrays for these (GLOBAL_REGIONS, PRESENCE_STATS,
CASE_STUDIES, PRICING_TIERS) and their types were also removed from the
file to keep it lean. The remaining data (TRUST_BADGES, KPIS,
PROCESS_STEPS, ROI_METRICS, COMPARISON_ROWS, INDUSTRIES_SERVED,
GUARANTEES, EMPLOYER_FAQS) was preserved verbatim from the previous
version so all copy stays consistent.
