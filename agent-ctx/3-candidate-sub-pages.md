# Task 3 — 9 candidate/job-seeker sub-pages under the 3 talent-solutions groups

**Agent:** 3-candidate-sub-pages
**Route:** `/talent-solutions/[slug]/[sub]` (existing route, updated)

## Summary

Added 9 candidate-focused sub-pages (3 per group × 3 groups) at
`/talent-solutions/<group>/<sub>`:

- **Get Trained** — `custom-cohort-curriculum`, `ai-candidate-screening`,
  `training-sprint-delivery`
- **Get Placed** — `browse-open-roles`, `interview-preparation`,
  `offer-onboarding`
- **Get Certified** — `skills-assessment`, `industry-certifications`,
  `career-portfolio`

Each page renders a 7-section lighter template (Hero → Overview →
Capabilities → Process → Benefits → FAQ → CTA band) with the same
visual language as the existing JoiningTermsPage reference page:
`bg-brand-ink` / `bg-brand-navy` alternating sections, amber accent
colors, `eyebrow text-amber-400` kickers, `scroll-mt-36` anchor offset,
`Reveal` scroll-triggered animations, and `Accordion`-based FAQ.

## Files written

1. **`src/data/pages/talent-candidate-sub-pages.ts`** — new data file.
   Exports `CandidateSubPageContent` interface + a `CONTENT` record
   keyed by `<groupSlug>/<subSlug>` containing the engaging content for
   each of the 9 pages: `heroEyebrow`, `heroSubtitle`, 3 `heroStats`,
   2-paragraph `overview`, 6 `capabilities` (icon + title + description),
   4-step `process` (Apply → Screen → Engage → Result), 4 `benefits`,
   5 `faqs`, `ctaKicker` + `ctaTitle`. Plus lookup helpers
   `findCandidateSubPage()`, `GROUP_ICONS`, `SUB_PAGE_ICONS`.

2. **`src/components/page-builder/candidate-sub-page.tsx`** — new server
   component (no `"use client"`). Renders the 7-section template from a
   `CandidateSubPageContent` + group/sub-page metadata. Uses the client
   `Reveal` component (IntersectionObserver + CSS transition, no motion
   library) and the shadcn/ui `Accordion` (client) for the FAQ section.

## Files updated

3. **`src/app/(public)/talent-solutions/[slug]/[sub]/page.tsx`** — rewrote
   to handle TWO branches:
   - **Branch A (legacy)** — unchanged backward-compat: existing service
     × sub pairs (train-to-hire/custom-cohort-curriculum etc.) rendered
     by `PageBuilderPage` from `buildTalentSubSpec()`.
   - **Branch B (new)** — new candidate group × sub pairs rendered by
     `<CandidateSubPage>` from `findCandidateSubPage()`.
   - `generateStaticParams()` now returns both branch param sets:
     legacy (60+ pairs) + candidate (9 pairs).
   - `generateMetadata()` returns branch-appropriate title + description.

4. **`src/components/layout/public-header.tsx`** (line ~202) — pre-existing
   crash fix: `g.services.some(...)` → `(g.subPages ?? []).some(...)`.
   The data shape in `talent-strip-groups.ts` changed from `services`
   (legacy service slugs) to `subPages` (3 candidate-side slugs per
   group) but this code wasn't updated, causing a `TypeError: Cannot
   read properties of undefined (reading 'some')` that crashed the
   layout on every `/talent-solutions/train-to-hire/*` route (500).
   Verified unblocked: `/talent-solutions/train-to-hire/custom-cohort-curriculum`
   now returns 200.

5. **`src/app/(public)/talent-solutions/[slug]/page.tsx`** (TalentGroupPlaceholder,
   ~lines 224–258) — pre-existing crash fix: `group.services.length` /
   `group.services.map(...)` → `group.subPages.length` / `group.subPages.map(...)`.
   Also updated the card hrefs from `/talent-solutions/${svc.slug}` (legacy
   service path) to `/talent-solutions/${group.slug}/${svc.slug}` (new
   candidate sub-page path), and `svc.name` → `svc.stripLabel`. Verified
   unblocked: `/talent-solutions/get-trained` etc. now return 200.

## Design language (matches existing pages)

- `bg-brand-ink` (dark navy) for hero/capabilities/benefits/CTA band
- `bg-brand-navy` (slightly lighter navy) for overview/process/FAQ
- Amber accent colors throughout (`text-amber-400`, `bg-amber-500`,
  `from-amber-400 to-orange-500` gradient tiles)
- NO indigo or blue primary colors
- `eyebrow text-amber-400` for kicker labels above section headings
- `Reveal` from `@/components/motion/reveal` for scroll-triggered fades
- Every `<section>` has an `id` and `scroll-mt-36` for anchor offset
- `<main>` wraps the whole page (matches `JoiningTermsPage` structure)
- Mobile-responsive: `sm:` / `md:` / `lg:` breakpoints, grids collapse
  to 1 column on mobile, 2 on `sm:`, 3–4 on `lg:`
- FAQ uses shadcn/ui `Accordion` (single collapsible) — same pattern
  as `FaqSection` in `page-builder/page-sections.tsx`

## Verification

- **`bun run lint`**: clean (zero errors, zero warnings, exit 0).
- **3 sample URLs from the task brief — all return HTTP 200**:
  - `http://localhost:3000/talent-solutions/get-trained/custom-cohort-curriculum` → 200
  - `http://localhost:3000/talent-solutions/get-placed/browse-open-roles` → 200
  - `http://localhost:3000/talent-solutions/get-certified/skills-assessment` → 200
- **All 9 new candidate sub-pages — all 200**:
  - `/talent-solutions/get-trained/custom-cohort-curriculum` 200
  - `/talent-solutions/get-trained/ai-candidate-screening` 200
  - `/talent-solutions/get-trained/training-sprint-delivery` 200
  - `/talent-solutions/get-placed/browse-open-roles` 200
  - `/talent-solutions/get-placed/interview-preparation` 200
  - `/talent-solutions/get-placed/offer-onboarding` 200
  - `/talent-solutions/get-certified/skills-assessment` 200
  - `/talent-solutions/get-certified/industry-certifications` 200
  - `/talent-solutions/get-certified/career-portfolio` 200
- **Backward compat — legacy sub-page still works**:
  - `/talent-solutions/train-to-hire/custom-cohort-curriculum` → 200
    (was 500 before the public-header crash fix)
- **Group pages also unblocked**:
  - `/talent-solutions/get-trained` → 200
  - `/talent-solutions/get-placed` → 200
  - `/talent-solutions/get-certified` → 200
- **Dev log tail** (last 10 lines) — clean, no `stioos-recovery` crashes
  for any of the talent-solutions routes:

```
GET /talent-solutions/get-placed/interview-preparation 200 in 179ms
GET /talent-solutions/get-placed/offer-onboarding 200 in 114ms
GET /talent-solutions/get-certified/skills-assessment 200 in 127ms
GET /talent-solutions/get-certified/industry-certifications 200 in 145ms
GET /talent-solutions/get-certified/career-portfolio 200 in 419ms
GET /talent-solutions/train-to-hire/custom-cohort-curriculum 200 in 306ms
GET /talent-solutions/get-trained 200 in 195ms
GET /talent-solutions/get-placed 200 in 137ms
GET /talent-solutions/get-certified 200 in 97ms
GET /talent-solutions 200 in 366ms
```

## Content summary per page

Each page's content is engaging, candidate-focused, and AEO-optimized:

- **Custom Cohort Curriculum** — "Co-designed with senior mentors around
  your target role, not a generic bootcamp." Stats: 8–12 wks ramp / 96%
  capstone pass / 50+ stack-specific modules. 5 FAQs covering target
  role changes, module format, fees if not placed, sample curriculum.
- **AI Candidate Screening** — "70/100 minimum across reasoning, language
  and role-specific skills; you start where you'll succeed." 5 FAQs on
  retakes, scoring methodology, track placement.
- **Training Sprint Delivery** — "2-week sprints with weekly checkpoints,
  1:10 mentor ratio, capstone graded by industry practitioners." 5 FAQs
  on missed checkpoints, live vs recorded, capstone grading.
- **Browse Open Roles** — "AI-matched live openings across 500+ employers,
  Recommended Candidate badge for 70%+ match." 5 FAQs on match scoring,
  cross-track applications, salary verification, employer SLAs.
- **Interview Preparation** — "50+ mock interviews, 200+ company playbooks,
  coaches who actually interviewed at FAANG." 5 FAQs on session counts,
  system design coverage, custom playbook research.
- **Offer & Onboarding** — "Offer negotiation, document support, 90-day
  ramp plan; 96% retention at 12 months." 5 FAQs on negotiation style,
  multiple offers, document scope, milestone disagreements.
- **Skills Assessment** — "200+ skill tracks, AI-scored, cryptographically
  verified, portable to LinkedIn." 5 FAQs on pricing, retake policy,
  employer verification methods.
- **Industry Certifications** — "30+ certifications (AWS, Azure, GCP, K8s,
  PMP), exam fees included, 86% first-attempt pass." 5 FAQs on which
  certs are included, retake vouchers, multiple cert bundles.
- **Career Portfolio** — "3+ real client-shaped projects, public repos
  with README + tests + deploy, your portfolio is your interview." 5
  FAQs on solo vs team projects, IP ownership, post-cohort continuation.

## What was NOT touched

- Existing legacy service sub-pages (`/talent-solutions/train-to-hire/*`
  etc.) — still rendered by `PageBuilderPage` from `TALENT_SUB_SEEDS`
  via `buildTalentSubSpec()`. Branch A of the updated route file is
  byte-identical to the previous version.
- `src/data/talent-strip-groups.ts` — left unchanged; it was already
  correct (uses `subPages` for the 3 candidate-side groups).
- The existing `[slug]/page.tsx` full info pages (JoiningTermsPage,
  LearningTermsPage) — left unchanged.
- `globals.css`, `layout.tsx`, the page-builder section components,
  and the marketplace/services routes.
