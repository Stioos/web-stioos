# Task 1+2+3+4 — Redesign Joining Terms & Learning Terms pages + add 6 sub-pages with dropdowns

## What was done

### Step 1 — `src/data/talent-info-pages.ts` (full rewrite)
Converted `TALENT_INFO_PAGES` from a custom `TalentInfoPage[]` interface to a
`TalentStripGroup[]` so the two info pills share the exact same shape as the
6 group pills (Get Trained, Build Talent, etc.).

Each info group now ships with:
- `slug`, `stripLabel`, `name`, `tagline`, `icon`, `accent: "orange"`
- `side: "candidate"`
- `subPages` array (3 entries each)

Sub-pages added:
- **Joining Terms**: `curriculum` (BookOpen), `pricing` (Wallet), `agreement` (FileText)
- **Learning Terms**: `self-learning` (Laptop), `curriculum` (BookOpen),
  `projects-development` (Code)

Also exports:
- `getTalentInfoPage(slug)` (back-compat alias)
- `TALENT_INFO_PAGE_SLUGS` (for sitemap)
- `TALENT_INFO_SUB_PAGE_SLUGS` (slug → sub-slug list, for generateStaticParams)
- `TALENT_INFO_GROUP_ICONS` + `TALENT_INFO_SUB_ICONS` (icon registry helpers)

### Step 2 — `src/components/layout/public-header.tsx`
- Removed the dedicated `renderInfoPill` function (lines 760-801)
- Now renders the info pills via the SAME `renderGroupPill` function used
  by the 6 group pills → the info pills get the EXACT SAME dropdown
  behaviour: `TalentVerticalFlyout`, chevron rotation, active-state styling,
  hover-intent wiring.

Verified rendered HTML on `/talent-solutions` shows the Joining Terms pill
with:
- `aria-haspopup="true"` + `aria-expanded="false"` (dropdown wiring in place)
- `text-orange-300` file-text icon (orange accent)
- `lucide-chevron-down` indicator

### Step 3 — `src/data/pages/talent-group-page-content.ts`
Added 8 new entries to the `TALENT_GROUP_PAGE_CONTENT` array (each follows
the `GroupPageContent` interface — same as the existing 6 group pages):

| # | Slug | Page |
|---|------|------|
| 7 | `joining-terms` | Joining Terms main |
| 8 | `learning-terms` | Learning Terms main |
| 9 | `joining-terms/curriculum` | Joining Curriculum |
| 10 | `joining-terms/pricing` | Joining Pricing |
| 11 | `joining-terms/agreement` | Joining Agreement |
| 12 | `learning-terms/self-learning` | Self Learning |
| 13 | `learning-terms/curriculum` | Learning Curriculum |
| 14 | `learning-terms/projects-development` | Projects Development |

The existing `getGroupPageContent(slug)` helper handles the compound slugs
unchanged (simple `.find()` on the slug field).

### Step 4 — `src/app/(public)/talent-solutions/[slug]/page.tsx`
Replaced the info-page rendering branch (which called `JoiningTermsPage` and
`LearningTermsPage`) to use `<TalentGroupPage content={getGroupPageContent(slug)} />`
— the same component used by the 6 group pages.

`TalentInfoPlaceholder` is kept as a defensive fallback for any future info
slug that doesn't yet have content built.

### Step 5 — `src/app/(public)/talent-solutions/[slug]/[sub]/page.tsx` (full rewrite)
Added Branch C to handle info-page × sub-page pairs. The route now resolves
THREE kinds of pairs:
- A: legacy service × sub (PageBuilderPage)
- B: candidate/employer group × sub (CandidateSubPage)
- C: info-page × sub (TalentGroupPage) — NEW

`generateStaticParams` now includes the 6 info-page × sub pairs.
`generateMetadata` returns proper titles/descriptions for the info sub-pages.

### Step 6 — `src/app/sitemap.ts`
Added `talentInfoSubRoutes` covering the 6 new info sub-pages, included in
the final return array.

## Verification results

### Lint
`bun run lint` → exit code 0 (clean)

### HTTP status codes (curl -s -o /dev/null -w "%{http_code}")
| Route | Status |
|-------|--------|
| `/talent-solutions/joining-terms` | 200 |
| `/talent-solutions/learning-terms` | 200 |
| `/talent-solutions/joining-terms/curriculum` | 200 |
| `/talent-solutions/joining-terms/pricing` | 200 |
| `/talent-solutions/joining-terms/agreement` | 200 |
| `/talent-solutions/learning-terms/self-learning` | 200 |
| `/talent-solutions/learning-terms/curriculum` | 200 |
| `/talent-solutions/learning-terms/projects-development` | 200 |

### Section count (grep `<section[^>]*id="..."`)
Every page → **12 sections** (hero, trust, overview, capabilities, process,
benefits, audiences, comparison, industries, guarantees, faq, cta).

### Style audit (joining-terms page)
- 127× `text-slate-400` (body text)
- 122× `text-amber-400` (kickers/icons)
- 114× `to-orange-500`, 96× `from-amber-400` (gradient CTAs/icons)
- 20× `bg-brand-ink`, 10× `bg-brand-navy` (dark navy backgrounds)
- 0× indigo or blue primary colors

### Sitemap
`/sitemap.xml` now includes all 8 new routes:
- `talent-solutions/joining-terms`
- `talent-solutions/joining-terms/curriculum`
- `talent-solutions/joining-terms/pricing`
- `talent-solutions/joining-terms/agreement`
- `talent-solutions/learning-terms`
- `talent-solutions/learning-terms/self-learning`
- `talent-solutions/learning-terms/curriculum`
- `talent-solutions/learning-terms/projects-development`

### Header dropdown wiring
Verified that the info pills on `/talent-solutions` render with:
- `aria-haspopup="true"` + `aria-expanded="false"`
- Orange-accented file-text/book-open icon
- `lucide-chevron-down` indicator
- `hover:border-orange-400/50` accent border

→ Identical dropdown behaviour to the 6 group pills.
