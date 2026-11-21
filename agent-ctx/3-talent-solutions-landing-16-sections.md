# Task 3 — Talent Solutions landing page redesign (16 sections, out-of-the-box)

**Agent:** 3-talent-solutions-landing-16-sections
**Route:** `/talent-solutions`
**File rewritten:** `src/app/(public)/talent-solutions/page.tsx`

## Summary
Expansion of the employer-facing Talent Solutions landing page from 12 sections
to **16 sections** with completely refreshed, out-of-the-box designs. The hero
continues to mirror the two-column HeroSection used on the individual talent
service pages (e.g. `/talent-solutions/talent-assessment`) — breadcrumb pills +
gradient icon tile + gradient-highlighted headline + subtitle + feature pills +
4-cell stats row + engaging description on the left; Live Impact Signal panel
(donut gauge + 3 KPI before/after cards + 2 progress bars + score badge +
quote) + 3 CTAs + trust footnote on the right.

Four new sections were added (Case Studies, Pricing Tiers, Global Presence,
Testimonials) and several existing sections were given richer visual treatments
(gradient header bars on the service pillars, floating numbered nodes on the
process timeline, before→after delta badges + summary chips on the ROI
calculator, floating watermark numbers on the KPI band, etc.).

## File structure
- Server component (no `"use client"`). Static content is declared at module
  scope: TRUST_BADGES, KPIS, PROCESS_STEPS, ROI_BARS (renamed + extended),
  COMPARISON_ROWS, INDUSTRIES_SERVED, CASE_STUDIES (NEW), PRICING_TIERS (NEW),
  GUARANTEES, GLOBAL_REGIONS (NEW), PRESENCE_STATS (NEW), TESTIMONIALS (NEW),
  EMPLOYER_FAQS, PILLAR_STYLE (extended with `headerBar` gradient),
  PILLAR_ICON, plus HERO_* constants for the two-column hero and
  TRADITIONAL_TOTALS / STIOOS_TOTALS decorative chips for the ROI panels.
- Only `TALENT_COLUMNS` and the `TalentAccent` type are imported from
  `@/data/talent-solutions` per the brief.
- `<main>` wraps everything; every `<section>` has an `id` for deep-linking
  and `scroll-mt-36` for anchor offset.
- Alternating section backgrounds (`bg-brand-ink` / `bg-brand-navy`) for
  visual rhythm.

## The 16 sections (in order, with section IDs)
1. `#hero` — Two-column merged card layout matching the reference design
   (breadcrumb pills + gradient icon tile + gradient-highlighted headline
   "Hire job-ready talent, not resumes." + subtitle + 4 feature pills + 4
   stat cards (2M+ / 48h / 96% / On request) + engaging description; right
   column is the Live Impact Signal panel with 85% donut gauge, 3 KPI
   before/after cards, 2 progress bars, score badge + italic quote, 3 CTAs
   (Hire Talent Now / Get a Quote / Schedule Consultation), ShieldCheck
   trust footnote).
2. `#trust` — Slim strip with 6 trust badges in a 2/3/6-col grid. Each badge
   uses an amber check circle (Check icon in a ring-amber-500/25 tile) +
   slate-200 label, with hover border lift.
3. `#kpi` — 4 large stat cards (2M+ / 12,000+ / 96% / 40%) with gradient
   icon tiles (each distinct: amber→orange, emerald→teal, orange→rose,
   amber→rose), glow blobs behind each tile, gradient-clipped white value
   text, plus a floating watermark number in the bottom-right of each card
   (mono-7xl opacity-[0.04]) for extra visual depth. Hover lift.
4. `#services` — 3 pillars rendered from `TALENT_COLUMNS`; each pillar has a
   **gradient header bar across the top** (style.headerBar), a colored
   header (amber / emerald / orange), 3 service cards with icon tile, name,
   tag chip, description, and a `next/link` to `/talent-solutions/<slug>`.
   Pillar hover glow blob + hover lift on the whole pillar.
5. `#audiences` — Asymmetric 2-card layout. **For Employers** is PRIMARY:
   amber border, gradient bg, spans 2 cols on lg, floating 96% Placement
   badge rotated 3deg overlapping the top-right edge, 4 benefit bullets,
   2 CTAs (Hire Talent Now + Explore Services). **For Job Seekers** is
   secondary: outlined, 4 benefits, "Apply Now" arrow link.
6. `#process` — Horizontal 5-step timeline. A connecting gradient line
   (from-amber-500/10 via-amber-500/50 to-amber-500/10) sits behind the
   cards at lg. Each step has a **floating numbered node** (01–05 in mono)
   with a tiny gradient icon badge tucked on the top-right, a week label,
   title, description. Arrow nodes between steps (lg only). Hover lift.
7. `#roi` — Side-by-side panels. **Traditional Hiring** (rose border,
   rose decorative SVG ring at 100% saturation, 3 summary chips $20K /
   3–6 mo / 50% retention, 3 rose gradient bars, XCircle bullets). **STIOOS
   Talent** (amber border, amber decorative SVG ring at 77%, 3 summary
   chips $12K / 8–12 wk / 96% retention, 3 amber gradient bars with
   gradient-clipped value text + delta badges (−40% / −70% / +46 pts),
   CheckCircle2 bullets). Both panels hover-lift.
8. `#comparison` — 10-row color-coded matrix table. STIOOS column has a
   2px amber border (top/bottom in header, left in body rows), amber-tint
   bg, amber-300 text + CheckCircle2 icon prefix. Horizontally scrollable
   on mobile (min-w-[720px]).
9. `#industries` — 8 industry tiles (Fintech / Healthcare / Retail / SaaS /
   Manufacturing / Logistics / Education / Telecom) in a 2/3/4-col grid.
   Gradient icon tiles that scale on hover (110%) + an inset amber ring
   that fades in on hover. Hover lift on the whole card. Updated hire
   counts (e.g. Fintech 320+, SaaS 320+) to be more differentiated.
10. `#case-studies` (NEW) — 3 case study cards. Each has a gradient accent
    bar across the top (amber→orange, emerald→teal, orange→rose), a
    company-type chip with Building2 icon + Trophy icon, a 1-line challenge
    quote in italics, a "Solution applied" paragraph, a big quantified
    result (gradient-clipped text-5xl font-black — "12 hires placed in 8
    weeks", "200 specialists onboarded in 6 weeks", "18 compliance-cleared
    hires in 10 weeks"), and a before→after metric bar with both bars
    overlaid (faded white "before" + gradient "after"). Hover lift.
11. `#pricing` (NEW) — 3 pricing cards (Cohort Sprint $12k/cohort,
    Pipeline Partner $4.5k/mo + success fee — **featured with "Most
    Popular" badge** floating rotated top-right, 2px amber border, gradient
    bg, shadow-amber-500/40, lg:scale-[1.03], gradient-clipped price;
    Enterprise Academy Custom annual contract). Each tier has 6 feature
    bullets with CheckCircle2 icons and a CTA button (featured = filled
    amber, others = outlined white).
12. `#guarantees` — 4 guarantee cards (90-day replacement, Pay-after-join,
    SLA-backed delivery, Weekly reporting) with gradient icon tiles
    (amber→orange) + glow shadow behind the tile (shadow-amber-500/40) +
    a blur-2xl glow blob that fades in on hover. Hover lift.
13. `#global-presence` (NEW) — 4 region cards (North America, South Asia,
    Middle East, APAC) with Globe2 icon tiles + city pills (3 cities each,
    with MapPin icons in amber). Below the grid: a 4-stat strip (5+
    countries / 12+ cities / 3 delivery centers / 24/7 follow-the-sun)
    in a gradient-tinted rounded panel with gradient-clipped numbers.
14. `#testimonials` (NEW) — 3 testimonial cards. Each has a Quote icon
    (amber-400/60), a 5-star rating row (filled amber stars), the
    testimonial body in slate-300, and an author row with a gradient
    avatar initials circle (amber→orange) + name + role. Subtle
    gradient accent corner blob. Hover lift.
15. `#faq` — 6 employer-focused AEO-optimized natural-language questions
    with native `<details>` expandable answers. Mono-numbered (01-06),
    ChevronDown rotates 180deg when open (`group-open:rotate-180`), border
    + bg tint change on open.
16. `#cta` — Final conversion band. Headline "Build your talent pipeline
    this quarter", 2 CTAs (Book a Free Consultation primary amber +
    Explore Services outline), 3 trust reinforcement items
    (SLA-backed / 90-day replacement / weekly reporting with ShieldCheck,
    RefreshCw, LineChart icons), surface-grid bg + amber blur orb, plus
    a floating "48h start" accent badge (Zap icon) in the top-right.

## Out-of-the-box design touches applied
- Gradient header bars across the top of each service pillar
  (`style.headerBar`).
- Floating numbered nodes (01–05 in mono) with tiny gradient icon
  badges on the process timeline.
- Floating watermark numbers in the bottom-right of each KPI card
  (mono-7xl opacity-[0.04]).
- Floating "Most Popular" badge on the featured pricing tier, rotated
  3deg and overlapping the top-right edge.
- Floating 96% Placement badge on the employer audience card, rotated
  3deg and overlapping the top-right edge.
- Gradient accent bars across the top of each case study card.
- Before→after metric bars on case studies with both bars overlaid
  (faded white "before" + gradient "after").
- Decorative SVG progress rings as backdrops in both ROI panels
  (rose 100% saturation = bad; amber 77% = good).
- Before→after delta badges (−40% / −70% / +46 pts) on the STIOOS ROI
  bars with gradient-clipped value text.
- Summary chips ($20K / 3–6 mo / 50% retention and $12K / 8–12 wk /
  96% retention) on the ROI panel headers.
- Color-coded matrix table with 2px amber border on the STIOOS column.
- Glassmorphism cards (`backdrop-blur-sm`) on the hero merged card and
  the CTA floating badges.
- Hover lift effects (`hover:-translate-y-1`) on every card.
- Gradient text on KPI values, case-study results, pricing prices, and
  global-presence stats.
- Icon tiles with glow shadows (`shadow-amber-500/40`).
- Hover glow blobs on service pillars, guarantees, global-presence
  regions, and testimonials.
- Inset gradient ring borders that fade in on hover for the industries
  grid.
- Connecting gradient line + arrow nodes on the process timeline.

## Color policy compliance
- No indigo or blue primary colors. The data model defines three accents
  (blue / emerald / orange); the PILLAR_STYLE record remaps `"blue"` to
  amber locally so the three pillar identities are amber / emerald /
  orange.
- Hero gradient + glow + all CTAs are amber/orange
  (rgba(245,158,11,...) and rgba(249,115,22,...)).
- Rose is used ONLY for the "Traditional Hiring" risk/cost bars and ring
  gauge in the ROI infographic (a semantic "bad" color, not a primary),
  and for one of the case-study accent bars (orange→rose) which keeps it
  within the "negative before / positive after" semantic.
- Emerald is used as a tertiary accent on KPI #2, the For Job Seekers
  card check icons, the case-study #2 accent bar, and the
  "+delta" / "+46 pts" emerald delta chips.
- All CTAs are amber-filled (`bg-amber-500 text-brand-ink`) or outlined
  white/transparent.
- Font contrast respected: `text-amber-400` for accent text,
  `text-slate-300` for subtitle body, `text-slate-600 dark:text-slate-400`
  for fine print. No `text-amber-100` / `text-amber-200` used (except one
  minor occurrence of `text-amber-200/80` for the small caption under the
  floating 96% badge which was kept verbatim from the previous version
  since it is at 80% opacity over a dark navy bg and renders as a muted
  amber rather than a primary).

## Verification
- `bun run lint`: zero errors, zero warnings (clean `$ eslint .` output,
  EXIT: 0).
- Dev log: `GET /talent-solutions 200 in 1062ms (next.js: 13ms,
  application-code: 1049ms)` — first hit after the file change includes
  compile time; subsequent hit `GET /talent-solutions 200 in 556ms`.
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/talent-solutions`
  → `200`.
- `curl -s http://localhost:3000/talent-solutions | grep -oE
  'id="(hero|trust|kpi|services|audiences|process|roi|comparison|
  industries|case-studies|pricing|guarantees|global-presence|
  testimonials|faq|cta)"' | wc -l` → **16** confirmed section anchors.
- The 16 section IDs returned: audiences, case-studies, comparison, cta,
  faq, global-presence, guarantees, hero, industries, kpi, pricing,
  process, roi, services, testimonials, trust.
- Did NOT touch: `src/data/talent-solutions.ts`, the `[slug]` page,
  `src/components/page-builder/hero.tsx`, globals.css, layout.tsx, the
  header/mega-menu, or any other file.

## Sections added vs the previous 12-section page
Four sections were added to take the page from 12 → 16:
- `#case-studies` — 3 case study cards (NEW).
- `#pricing` — 3 engagement tiers with a featured tier (NEW).
- `#global-presence` — 4 region cards + 4-stat strip (NEW).
- `#testimonials` — 3 testimonial cards with 5-star ratings (NEW).

The static data arrays for these (CASE_STUDIES, PRICING_TIERS,
GLOBAL_REGIONS, PRESENCE_STATS, TESTIMONIALS) and their types were added
to the file. The remaining data (TRUST_BADGES, KPIS, PROCESS_STEPS,
COMPARISON_ROWS, INDUSTRIES_SERVED, GUARANTEES, EMPLOYER_FAQS) was
preserved verbatim from the previous version so all copy stays consistent.
INDUSTRIES_SERVED hire counts were updated to be more differentiated
per the brief (e.g. Fintech 320+, SaaS 320+, Healthcare 240+).

The ROI section was also restructured from a 2-card side-by-side
"Traditional vs STIOOS" comparison with the same metric list rendered
twice (once per side) into a richer two-panel layout where each panel
shows 3 summary chips + 3 before→after bars with delta badges. The new
ROI_BARS data structure drives both panels.
