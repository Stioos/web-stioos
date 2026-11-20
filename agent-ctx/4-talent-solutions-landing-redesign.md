# Task 4 — Talent Solutions landing page redesign (12 sections)

**Agent:** 4-talent-solutions-landing-redesign
**Route:** `/talent-solutions`
**File rewritten:** `src/app/(public)/talent-solutions/page.tsx`

## Summary
Major redesign of the employer-facing Talent Solutions landing page. Replaced
the old 3-section page (hero / offerings grid / highlights band / CTA) with a
12-section conversion-focused page that targets hiring teams, founders,
engineering managers, and HR directors.

## File structure
- Server component (no `"use client"`); imports the client `Reveal` component
  from `@/components/motion/reveal` for scroll-triggered fades (allowed —
  server components can render client components, and the static data lives
  in the server boundary).
- All static content (TRUST_BADGES, KPIS, PROCESS_STEPS, ROI_METRICS,
  COMPARISON_ROWS, INDUSTRIES_SERVED, CASE_STUDIES, PRICING_TIERS,
  PILLAR_STYLE, PILLAR_ICON) declared at module scope. Only
  `TALENT_COLUMNS` is imported from `@/data/talent-solutions` per the brief.
- `<main>` wraps everything; every `<section>` has an `id` for deep-linking
  and `scroll-mt-36` for anchor offset.

## 12 sections (in order)
1. `#hero` — gradient headline "Hire job-ready talent, not resumes", two CTAs
   (Hire Talent Now / Book a Discovery Call), 3 hero stats (2M+, 48h, 96%).
2. `#trust` — 6 trust badges (ISO 27001, 500+ employers, 96% placement, 48h
   shortlists, 90-day replacement, 4.9/5 rating).
3. `#kpi` — 4 stat cards (2M+ pool / 12,000+ trained / 96% placement / 40%
   lower cost-per-hire).
4. `#services` — 3 pillars rendered from `TALENT_COLUMNS`; each pillar has
   a colored header + 3 service cards with icon, name, tag chip, description,
   and a `next/link` to `/talent-solutions/<slug>`.
5. `#audiences` — 2 cards, employer card is PRIMARY (amber border, gradient
   bg, spans 2 cols, 4 benefits + 2 CTAs); seeker card is secondary.
6. `#process` — 5-step horizontal timeline (Discovery → Role Definition →
   Sourcing & Screening → Training/Cohort → Placement & Ramp) with
   connecting arrows on lg.
7. `#roi` — two side-by-side comparison cards (Traditional Hiring vs
   STIOOS Talent) with 3 progress bars each (cost / time / risk).
8. `#comparison` — 10-row feature comparison table (STIOOS vs Agency vs
   In-house); STIOOS column has amber tint + bold amber text; table is
   horizontally scrollable on mobile (min-w-[720px]).
9. `#industries` — 8 industry tiles (Fintech, Healthcare, Retail, SaaS,
   Manufacturing, Logistics, Education, Telecom).
10. `#case-studies` — 3 case study cards with type chip, timeline, company,
    challenge, solution, and quantified result metric.
11. `#pricing` — 3 engagement tiers (Cohort Sprint / Pipeline Partner
    [featured, "Most popular"] / Enterprise Academy) with starting price,
    6 features each, and a CTA button.
12. `#cta` — final conversion band with "Build your talent pipeline this
    quarter" headline, 2 CTAs, and 3 trust reinforcement items.

## Color policy compliance
- No indigo or blue primary colors. Remapped the data model's `"blue"`
  TalentAccent to amber locally (PILLAR_STYLE record) so the three pillar
  identities are amber / emerald / orange — three distinct accents, none
  of them blue.
- Hero radial fade uses amber (`rgba(245,158,11,0.22)`) instead of the old
  blue (`rgba(30,100,232,0.25)`).
- Rose used ONLY for the "traditional hiring" risk/cost bars in the ROI
  infographic (a semantic "bad" color, not a primary).
- All CTAs are amber-filled (`bg-amber-500 text-brand-ink`) or outlined
  white/transparent.

## Verification
- `bun run lint`: zero errors, zero warnings (clean output, no diagnostics
  printed for the file).
- Dev log: `✓ Compiled in 587ms` and `GET /talent-solutions 200 in 502ms`.
- `curl http://localhost:3000/talent-solutions`: HTTP 200; grep for
  `id="..."` on the rendered HTML confirmed all 12 section anchors are
  present: audiences, case-studies, comparison, cta, hero, industries,
  kpi, pricing, process, roi, services, trust.
- Did NOT touch: `src/data/talent-solutions.ts`, the `[slug]` page,
  globals.css, layout.tsx, the header/mega-menu, or any other file.
