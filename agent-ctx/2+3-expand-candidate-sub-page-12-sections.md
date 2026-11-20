# Task 2+3 — Expand the 9 candidate sub-pages from 7 to 12 sections

**Agent:** 2+3-expand-candidate-sub-page-12-sections
**Route:** `/talent-solutions/[slug]/[sub]` (candidate branch, 9 pages)

## Summary

Expanded the `CandidateSubPage` component (rendered for the 9
candidate-focused Talent Solutions sub-pages) from 7 sections to
**12 sections**, keeping the existing two-column hero (with Live
Impact Signal panel) untouched and adding 5 new sections. The CTA
band was moved from position 7 to position 12 so it remains the
LAST section on the page.

## Final section order (12 sections)

1. **Hero** — two-column w/ Live Impact Signal panel (KEEP, bg-brand-ink)
2. **Overview** — 2-paragraph description (KEEP, bg-brand-navy)
3. **Capabilities** — 6 cards (KEEP, bg-brand-ink)
4. **Process** — 4-step timeline (KEEP, bg-brand-navy)
5. **Benefits** — 4 outcome stat cards (KEEP, bg-brand-ink)
6. **FAQ** — 5 AEO-optimized Q&As (KEEP, bg-brand-navy)
7. **Trust bar** — 6 platform trust badges strip (NEW, bg-brand-ink)
8. **Audiences** — For Job Seekers + For Employers, 2 cards (NEW, bg-brand-navy)
9. **Comparison** — With STIOOS vs Without, 6 rows (NEW, bg-brand-ink)
10. **Industries** — 8 vertical cards w/ icons (NEW, bg-brand-navy)
11. **Guarantees** — 4 written commitment cards (NEW, bg-brand-ink)
12. **CTA band** — "Ready to get started?" (MOVED to last, bg-brand-navy)

Background alternation (`bg-brand-ink` / `bg-brand-navy`) is
preserved across all 12 sections. The CTA band's section wrapper
bg changed from `bg-brand-ink` to `bg-brand-navy` to keep the
rhythm; the inner amber-gradient card still pops on navy due to its
`border-amber-500/20` border and `from-amber-500/[0.12]` gradient.

## Files modified

### 1. `src/data/pages/talent-candidate-sub-pages.ts`

Added 5 new exported interfaces + 5 shared content constants:

- **`CandidateTrustBadge`** — `{ icon: IconName; label: string }`
- **`CandidateComparisonRow`** — `{ dimension; traditional; withUs }`
- **`CandidateIndustry`** — `{ icon: IconName; name: string }`
- **`CandidateGuarantee`** — `{ icon: IconName; title; description }`
- **`CandidateAudience`** — `{ icon; kicker; title; description; bullets; ctaLabel; ctaHref }`

Exported constants (platform-wide, identical across all 9 pages):

- **`CANDIDATE_TRUST_BADGES`** (6) — ISO 27001 aligned, 2M+ assessed
  pool, 48h shortlists, 90-day replacement, Pay-after-join model,
  4.9/5 candidate rating.
- **`CANDIDATE_COMPARISON`** (6 rows) — Time to results, Cost model,
  Quality of signal, Support, Scalability, Risk.
- **`CANDIDATE_INDUSTRIES`** (8) — Fintech & Banking, Healthcare &
  Life Sciences, Retail & E-commerce, SaaS & Software,
  Manufacturing, Logistics & Supply Chain, Education & EdTech,
  Telecom & Media.
- **`CANDIDATE_GUARANTEES`** (4) — 90-day replacement, Pay-after-join
  model, SLA-backed delivery, Weekly progress reporting.
- **`CANDIDATE_AUDIENCES`** (`Record<groupSlug, CandidateAudience[]>`)
  — two audience cards (Job Seekers + Employers) per parent group,
  with group-specific copy for get-trained / get-placed /
  get-certified (6 cards total across the 3 groups).

All icons used resolve through the existing `<Icon name>` registry
in `src/components/shared/icon.tsx` (ShieldCheck, Users, Clock,
RefreshCw, Wallet, Star, Landmark, HeartHandshake, ShoppingCart,
Cloud, Factory, Package, GraduationCap, Radio, BarChart3,
Building2, Award, Briefcase).

### 2. `src/components/page-builder/candidate-sub-page.tsx`

- Updated header comment from "7-section" to "12-section template"
  with the full new section list.
- Added imports: `BadgeCheck` removed (unused), `Check`,
  `CheckCircle2`, `XCircle` from lucide-react; the 5 shared
  constants from the data file.
- Inserted 5 new `<section>` blocks between the FAQ section (#6)
  and the CTA band:
  - **Trust bar** — slim strip (`py-5`, `border-y`) with 6 badges,
    each rendered via `<Icon name={b.icon}>` + label. Mirrors the
    PageBuilder `TrustBarSection` design.
  - **Audiences** — 2 cards (Job Seekers in amber chip, Employers in
    emerald chip), each with kicker, title, description, 4 bulleted
    points (Check icons), and a CTA link. Looks up
    `CANDIDATE_AUDIENCES[group.slug]`.
  - **Comparison** — 2-column table (Without STIOOS | With STIOOS)
    with 6 rows. Each cell shows the dimension label + the value
    with an XCircle (traditional) or CheckCircle2 (with-us) icon.
    Uses the same card treatment as the PageBuilder
    `ComparisonSection`.
  - **Industries** — 8 cards in a 2/3/4-col responsive grid, each
    with an amber icon tile + industry name + helper line. Same
    card style as the existing capabilities section.
  - **Guarantees** — 4 cards in a 2/4-col responsive grid, each with
    an amber icon tile + title + description. Same card style as
    capabilities/benefits.
- Moved the CTA band to be section 12 (last) and changed its section
  wrapper bg from `bg-brand-ink` to `bg-brand-navy` to maintain
  strict alternation with the new Guarantees section (bg-brand-ink)
  above it.

## Design language (matches existing pages)

- `bg-brand-ink` (dark navy) / `bg-brand-navy` alternating sections
- Amber accent colors throughout (`text-amber-400` eyebrows, amber
  icon tiles `bg-amber-400/10 ring-amber-400/25`, amber CTA buttons
  `bg-amber-500 text-brand-ink`)
- Emerald accent for the secondary audience card ("For Employers")
  to differentiate the two sides without using indigo/blue
- NO indigo or blue primary colors
- Every `<section>` has an `id` and `scroll-mt-36` for anchor offset
- `Reveal` from `@/components/motion/reveal` for scroll-triggered
  fades on every new section + every card (staggered delays)
- Server component (no `"use client"`) — only `<Reveal>` and
  `<Accordion>` ship client JS
- Mobile-responsive: grids collapse to 1-2 cols on mobile, 3-4 on
  `lg:`; comparison table uses `max-sm:text-[12px]`

## Verification

### `bun run lint`
Clean — zero errors, zero warnings, exit 0.

### HTTP status — all 9 candidate sub-pages return 200

```
200  /talent-solutions/get-trained/custom-cohort-curriculum
200  /talent-solutions/get-trained/ai-candidate-screening
200  /talent-solutions/get-trained/training-sprint-delivery
200  /talent-solutions/get-placed/browse-open-roles
200  /talent-solutions/get-placed/interview-preparation
200  /talent-solutions/get-placed/offer-onboarding
200  /talent-solutions/get-certified/skills-assessment
200  /talent-solutions/get-certified/industry-certifications
200  /talent-solutions/get-certified/career-portfolio
```

### Section count verification

`curl -s http://localhost:3000/talent-solutions/get-trained/custom-cohort-curriculum`
returns 12 unique section ids, in order:

```
hero, overview, capabilities, process, benefits, faq,
trust-bar, audiences, comparison, industries, guarantees, cta-band
```

(Confirmed via `grep -oE 'id="(...)"'` on the rendered HTML.)

### Dev log tail (last 10 lines) — clean, no crashes

```
GET /talent-solutions/get-trained/custom-cohort-curriculum 200 in 240ms
GET /talent-solutions/get-trained/ai-candidate-screening 200 in 262ms
GET /talent-solutions/get-trained/training-sprint-delivery 200 in 199ms
GET /talent-solutions/get-placed/browse-open-roles 200 in 201ms
GET /talent-solutions/get-placed/interview-preparation 200 in 262ms
GET /talent-solutions/get-placed/offer-onboarding 200 in 183ms
GET /talent-solutions/get-certified/skills-assessment 200 in 169ms
GET /talent-solutions/get-certified/industry-certifications 200 in 485ms
GET /talent-solutions/get-certified/career-portfolio 200 in 224ms
```

No `stioos-recovery` crashes, no 500s, no hydration errors.

## What was NOT touched

- The hero section (section 1) — left byte-identical (two-column
  layout with Live Impact Signal panel, donut gauge, KPI cards,
  progress bars, score badge + quote).
- The existing 6 sections (Overview, Capabilities, Process,
  Benefits, FAQ, CTA band content) — content unchanged; only the
  CTA band's section wrapper bg class changed (`bg-brand-ink` →
  `bg-brand-navy`) and it moved to position 12.
- The route file `src/app/(public)/talent-solutions/[slug]/[sub]/page.tsx`
  — unchanged; it already passes `group`, `subPage`, `content`,
  `groupIcon`, `subPageIcon` to `<CandidateSubPage />`.
- Legacy service sub-pages (Branch A) — still rendered by
  `PageBuilderPage` from `buildTalentSubSpec()`.
- `globals.css`, `layout.tsx`, the PageBuilder section components,
  and all other routes.
