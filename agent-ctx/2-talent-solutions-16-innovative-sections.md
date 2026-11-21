# Task 2 — Talent Solutions landing page redesign (16 innovative sections)

**Agent:** 2-talent-solutions-16-innovative-sections
**Route:** `/talent-solutions`
**File rewritten:** `src/app/(public)/talent-solutions/page.tsx`

## Summary
Complete redesign of the employer-facing Talent Solutions landing page. All 16
sections were rewritten with out-of-the-box visual ideas (no generic card grids
or tables). The FAQ section was replaced with a brand-new two-column premium
layout built on native `<details>`/`<summary>` elements.

## File structure
- Server component (no `"use client"`). Scroll-triggered reveals are gated by
  the client `<Reveal>` component from `@/components/motion/reveal`.
- Static content declared at module scope: TRUST_BADGES (extended to 8),
  KPIS (redefined with `accent` + `progress` + `target`), PROCESS_STEPS,
  ROI_BARS, COMPARISON_ROWS (trimmed to 8 rows), INDUSTRIES_SERVED,
  CASE_STUDIES (added `offset` for staggered layout), PRICING_TIERS (added `bg`
  gradient per tier), GUARANTEES (added `accent`), GLOBAL_REGIONS,
  PRESENCE_STATS, TESTIMONIALS, EMPLOYER_FAQS, plus KPI_STYLE and PILLAR_STYLE
  maps and HERO_* constants for the two-column hero.
- Only `TALENT_COLUMNS` and the `TalentAccent` type are imported from
  `@/data/talent-solutions` per the brief.
- A scoped `<style>` block (PAGE_STYLES) provides: the marquee keyframe
  (`.ts-marquee-track`), the CSS-only service-pillar tabs
  (`radio + :checked` → `.ts-panel`), and FAQ `<details>` polish (chevron
  rotation, summary marker removal).
- `<main>` wraps everything; every `<section>` has an `id` + `scroll-mt-36`.
- Alternating section backgrounds (`bg-brand-ink` / `bg-brand-navy`) for
  visual rhythm; the CTA band uses an amber→orange mesh gradient.

## The 16 sections (in order, with section IDs + design idea)
1. `#hero` — Two-column merged card. Left: breadcrumb pills, gradient icon
   tile, gradient-highlighted headline "Hire job-ready talent, not resumes",
   subtitle, 4 feature pills, 4 mini stat cards, description. Right: Live
   Impact Signal panel — animated pulse dot, 85% donut gauge SVG (amber
   gradient stroke), 3 KPI before→after cards (strikethrough + delta badges),
   2 progress bars, score badge + italic quote, 3 CTAs, ShieldCheck trust note.
2. `#trust` — Horizontal scrolling marquee of 8 trust badges. Each badge has
   a gradient amber checkmark tile, label, and dot divider. Edge fade masks
   on both sides. Hover pauses the marquee and scales the badge; the icon
   tile gains an amber glow shadow.
3. `#kpi` — 4 stat cards with gradient-mesh backgrounds, a floating gradient
   number (bg-clip-text), a gradient icon tile with glow shadow, and a thin
   "of target" progress bar at the bottom. Four distinct accents: amber,
   emerald, sky, rose. Cards lift on hover.
4. `#services` — CSS-only tabbed interface (hidden radios + `:checked`).
   Three tabs (Talent Development / Workforce Solutions / Assessment &
   Placements) with a gradient underline that scales in on the active tab.
   Each panel renders 3 service rows with a gradient icon tile, title, tag
   chip, description, hover arrow, and a floating numbered badge (01–03).
   Data sourced from `TALENT_COLUMNS`.
5. `#audiences` — Asymmetric 2/3 + 1/3 split. "For Employers" card spans
   2 columns with an amber gradient background, a floating 96% badge
   overflowing the top-right corner, 4 benefit bullets with gradient
   checkmark icons, and 2 CTAs. "For Job Seekers" card is 1 column, outlined,
   with 4 bullets and a CTA. Different heights for visual interest.
6. `#process` — Vertical zigzag timeline. 5 steps alternate left/right on
   sm+ around a central dashed line. Each step has a numbered gradient
   circle (ring-clipped to the line), icon tile, title, duration badge, and
   description. Cards lift on hover.
7. `#roi` — Two overlapping panels. "Traditional Hiring" (rose, semi-
   transparent, backdrop-blur) on the left; "STIOOS Talent" (amber, on top)
   overlaps it on lg via `-ml-10 -mt-6` with a higher z-index and a 2xl
   amber shadow. Each panel has 3 progress bars (Cost, Time, Retention)
   with before→after values + delta badges. A Scale icon footnote notes the
   bars share a scale.
8. `#comparison` — 3-column card comparison (STIOOS / Traditional Agency /
   In-house), 8 feature rows each. STIOOS card is elevated (`-mt-4 mb-4`,
   gradient border via an absolute `-inset-px` layer, amber glow shadow).
   Each row uses CheckCircle2 (amber for STIOOS, slate for OK agency/in-house
   cells) or XCircle (rose) + label + value.
9. `#industries` — Honeycomb circle grid of 8 industries. Two rows of 4
   gradient circles; the second row is offset by `sm:ml-12` to create a
   honeycomb pattern. Each circle has a gradient background, an icon, a name,
   and a hire count. A blurred glow ring sits behind each circle; on hover
   the circle scales to 110% and the glow intensifies.
10. `#case-studies` — 3 staggered case study cards (each offset vertically
    via `lg:mt-0` / `lg:mt-16` / `lg:mt-8`). Each card has a company-type
    chip, an italic challenge quote, the solution applied, a large quantified
    result number in gradient text, and a before→after mini bar chart with
    rose "before" and gradient "after" bars.
11. `#pricing` — 3 pricing cards. The middle "Pipeline Partner" tier is
    elevated (`md:scale-105`, gradient border via absolute layer, 2xl amber
    shadow) with a floating "Most Popular" badge above the card. Each card
    has a tier name, price in gradient text (featured) or white, 6 features
    with checkmark icons, and a CTA button. Different background gradients
    per tier.
12. `#guarantees` — 2x2 grid of guarantee cards (not 4 columns). Each card
    has a large gradient icon tile with a glow blur, title, description, and
    a "Learn more →" link that animates on hover. Alternating accent colors
    (amber / emerald / sky / rose) via KPI_STYLE.
13. `#global-presence` — Radiating world-map layout. A central globe icon
    (gradient circle, ring-clipped) with 4 region cards in a 3-column grid
    (2 left, globe center, 2 right). SVG dashed gradient spokes connect the
    center to each card corner on lg. Each region card has a MapPin icon,
    region name, and city pills. Below: a 4-stat strip. On mobile, the globe
    renders above a stacked grid (SVG hidden).
14. `#testimonials` — 3 testimonial cards in an overlapping carousel-like
    layout (`lg:-space-x-4`). Each card uses glassmorphism
    (`bg-white/[0.05] backdrop-blur-md`), a large Quote icon, the quote text,
    a gradient avatar circle with initials, name, role, and a 5-star amber
    rating. On hover a card lifts and rises above its siblings (`z-10`).
15. `#faq` — COMPLETELY NEW two-column premium layout (see below).
16. `#cta` — Full-width amber→orange mesh gradient band (three stacked
    radial gradients + grid overlay). Centered headline "Build your talent
    pipeline this quarter" with a gradient-highlighted phrase, subtitle,
    2 CTAs (primary amber-filled + secondary outlined with backdrop-blur),
    and 3 trust items with icons in a row. A floating "48h response" badge
    with an animated pulse sits in the top-right corner.

## New FAQ design (`#faq`)
Replaced the standard accordion with a **two-column premium layout**:

- **Left column** — a sticky panel (`lg:sticky lg:top-28`) with:
  - An "FAQ" pill badge with HelpCircle icon
  - A large "Questions?" heading
  - A brief description paragraph
  - A 3-tile illustration strip (48h / NDA / 90-day) with amber icons
  - Two CTAs: "Talk to an expert" (amber-filled, Headset icon) + "Book a
    call" (outlined, PhoneCall icon)

- **Right column** — 6 questions rendered as native `<details>` cards:
  - Each `<summary>` has a **numbered gradient badge** (01–06), the question
    text in bold, and a **ChevronDown** icon that rotates 180° on open
    (`.ts-faq-chevron` transform rule).
  - The answer (3–4 sentences) slides down natively via `<details>`.
  - On open, the card gains a **subtle amber gradient background tint**
    (`open:from-amber-500/[0.07] open:to-orange-500/[0.02]`) and an amber
    border.
  - A **thin gradient left-border** (amber→orange) appears on hover and on
    open, implemented as an absolute `<span>` with `scale-y` transition.
  - The summary marker is removed via the scoped `.ts-faq` CSS so the
    numbered badge is the only visual affordance.
  - A footnote card below the list reinforces the free 30-minute discovery
    call.

Built with native `<details>`/`<summary>` for full accessibility (keyboard
operable, semantics-correct) — styled to feel premium, not like a basic
accordion.

## Color policy compliance
- No indigo or blue primary colors. The data model's `"blue"` TalentAccent is
  remapped to amber via `PILLAR_STYLE`, so the three pillar identities read
  amber / emerald / orange.
- `sky` is used ONLY for one KPI card and one guarantee card (explicitly
  requested in the brief as one of four KPI accents) — a cyan-leaning sky,
  never a primary surface color.
- Rose is used ONLY for "traditional hiring" / before-state bars and the
  comparison-matrix X icons (a semantic "bad" color).
- All CTAs are amber-filled (`bg-amber-500 text-brand-ink`) or
  outlined white/transparent.
- Body text uses `text-slate-300` / `text-slate-400` (overridden in light
  mode); accents use `text-amber-400`. No `text-amber-100`/`text-amber-200`.

## Verification
- `bun run lint`: zero errors, zero warnings (clean `$ eslint .` output).
- Dev log: `GET /talent-solutions 200 in 334ms` (after the rewrite), no
  compile errors.
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/talent-solutions`
  → **200**.
- `grep -oE 'id="..."'` on the rendered HTML confirmed all 16 section
  anchors are present: audiences, case-studies, comparison, cta, faq,
  global-presence, guarantees, hero, industries, kpi, pricing, process,
  roi, services, testimonials, trust.
- Did NOT touch: `src/data/talent-solutions.ts`, the `[slug]` page,
  globals.css, layout.tsx, the header/mega-menu, or any other file.
