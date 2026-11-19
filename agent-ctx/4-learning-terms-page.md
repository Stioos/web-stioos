# Task 4 — Learning Terms Page (12 sections + infographics)

**File:** `src/app/(public)/talent-solutions/[slug]/page.tsx`

## What was built

Replaced the `TalentInfoPlaceholder` for the `learning-terms` slug only
with a full 12-section server component `LearningTermsPage`. The
`joining-terms` slug (owned by Task 2's `JoiningTermsPage`) was left
completely untouched. `TalentInfoPlaceholder` is retained in the file
as a fallback for any future info slug.

## Route behaviour

```ts
if (infoPage) {
  if (slug === "joining-terms") return <JoiningTermsPage />;
  if (slug === "learning-terms") return <LearningTermsPage />;
  return <TalentInfoPlaceholder infoSlug={slug} />;
}
```

## Content philosophy

The page documents HOW candidates learn in STIOOS training programs.
It is written to convince EMPLOYERS that STIOOS-trained candidates
arrive already knowing how real companies operate. Five pillars:

1. **Basics via external platforms** — YouTube, Udemy, Coursera, edX,
   freeCodeCamp, Khan Academy, Pluralsight, LinkedIn Learning. STIOOS
   curates the best 3-5 courses per skill, skips the noise.
2. **Real-world working culture** — standups, PR/code reviews, Jira,
   Git collaboration, Slack/Teams, sprint cadence, deadline ownership,
   stakeholder updates.
3. **Execution & delivery** — Learn → Apply → Review → Ship loop.
   Watching a video is step 1 of 4, not the whole job.
4. **Structured like a real employee** — workstation, team, manager,
   KPIs, performance reviews, career growth conversations from day 1.
5. **Advanced company-grade work** — production architecture, CI/CD,
   observability, incident response, stakeholder management, business
   domain depth, security/compliance, performance optimization.

## The 12 sections (every one has `id` + `scroll-mt-36` for deep-linking)

| # | id                  | Eyebrow                  | Infographic                                                        |
|---|---------------------|--------------------------|--------------------------------------------------------------------|
| 1 | learning-hero       | For Employers & Candidates | 3 hero stat cards (200+ tracks, 12-wk avg, 94% job-readiness)    |
| 2 | learning-philosophy | How we layer learning     | 3-layer pyramid (base/middle/apex, width 100/72/44%) + 3 layer description cards |
| 3 | learning-platforms  | Curated, not catalogued   | 8 platform cards (YouTube, Udemy, Coursera, edX, freeCodeCamp, Khan, Pluralsight, LinkedIn Learning) |
| 4 | curriculum-track    | A sample 12-week ramp     | 4-phase horizontal timeline with arrows + hours summary cards    |
| 5 | working-culture     | More than course content  | 8 culture cards (standups, code reviews, Jira, Git, Slack, sprints, deadlines, stakeholders) |
| 6 | execution-framework | Learn by doing            | Circular flowchart: Learn → Apply → Review → Ship (center hub + 4 SVG-positioned nodes + dashed ring) + 4 description cards |
| 7 | day-in-life         | Structured like an employee | 7-entry vertical timeline (9am → evening) with icon dots + time badges |
| 8 | advanced-patterns   | Beyond the basics         | 8 advanced cards (architecture, CI/CD, observability, incidents, stakeholders, domain, security, perf) |
| 9 | mentorship-structure| Never learning alone      | 3-tier org chart (Senior mentor → Peer mentors → Candidates+buddies) + tier cards + cadence cards |
| 10| skill-matrix        | Depth, by track           | 7-row × 4-col color-coded matrix table + depth legend            |
| 11| graduation-criteria | What it takes to graduate | 5 dashboard cards with progress bars/gauges + emerald success banner |
| 12| learning-cta        | From learner to employee  | Gradient CTA card + 2 buttons (Book audit / Download sample) + 3 trust stats |

## Design system compliance

- **Backgrounds alternate** `bg-brand-ink` (odd sections) / `bg-brand-navy`
  (even sections) for visual rhythm — matches JoiningTermsPage and the
  `/talent-solutions` landing page.
- **Accent colour** is amber/orange only (no indigo/blue primary).
  Emerald is used once on the graduation success banner.
- **Text colours** all overridden-and-readable in light mode:
  `text-amber-400`, `text-amber-300`, `text-slate-200`, `text-slate-300`,
  `text-slate-400`, `text-white`. **Avoided** `text-amber-100` /
  `text-amber-200` per the font-contrast rule.
- **Reveal** wraps every section header and most content blocks;
  staggered with `delay` for grid items. Page is a server component
  (no `"use client"`).
- **Button** (shadcn) used for the CTA pair with `asChild` wrapping
  `next/link` Links — one amber filled, one outlined.
- **Mobile responsive** throughout — `sm:grid-cols-2 lg:grid-cols-4`
  for card grids, `min-w-[820px]` + `overflow-x-auto` for the
  curriculum timeline, `min-w-[760px]` + `overflow-x-auto` for the
  skill matrix table, `max-w-3xl` centered for the vertical day
  timeline.
- **Semantic HTML** — `<main>`, `<section>` with `aria-label`,
  `<article>`, `<ol>/<li>` for ordered lists/timelines, `<table>` with
  `<thead>/<tbody>` and `<th scope="col">`, `<dl>/<dt>/<dd>` for the
  hero stats.

## SVG / CSS infographics

- **Pyramid (section 2)**: CSS-only stacked layers with decreasing
  `width: ${widthPct}%` (100 / 72 / 44), each a rounded gradient bar
  with an icon chip and tier label. Paired with 3 description cards.
- **Circular flowchart (section 6)**: a `relative` container holds an
  SVG dashed ring (320×320 viewBox, `r=130`, amber dashed stroke) +
  a center hub (`absolute` centered, gradient-filled circle with the
  "Execution loop" label) + 4 absolutely-positioned node chips at
  top / right / bottom / left (positioned via Tailwind `left-* top-*`
  + `translate-*` utilities).
- **Vertical timeline (section 7)**: `border-l` on the `<ol>` with
  `pl-6`, each `<li>` has an absolutely-positioned gradient dot on
  the left border, plus a card with a time badge.
- **Org chart (section 9)**: 3 vertically-stacked tiers connected by
  `h-px` / `w-px` spans — top tier = Senior mentor (1:10), middle =
  3 Peer mentor cards (1:3 each), bottom = 3 Candidate cards each
  with a Buddy chip.
- **Color-coded matrix (section 10)**: `<table>` where each cell
  applies one of 4 intensity classes from `MATRIX_CELL_TONES`
  (rgba amber 0.04 → 0.22), with a legend strip below.
- **Progress bars / gauges (section 11)**: 5 dashboard cards each
  with `h-2` track + gradient fill `width: ${progress}%`. The 5th
  card (Attendance) spans full width on `sm/lg` for emphasis.

## Verification

```
$ bun run lint
$ eslint .        # no errors, no warnings

$ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/talent-solutions/learning-terms
200

$ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/talent-solutions/joining-terms
200   # untouched — still resolves to JoiningTermsPage

$ curl -s http://localhost:3000/talent-solutions/learning-terms | grep -oE 'id="[^"]*"' | sort -u
# Confirms all 12 section ids present in rendered HTML:
# advanced-patterns, curriculum-track, day-in-life, execution-framework,
# graduation-criteria, learning-cta, learning-hero, learning-philosophy,
# learning-platforms, mentorship-structure, skill-matrix, working-culture
```

## Dev log tail (last 5 lines)

```
[browser] [stioos-watchdog] auto-recovering stale app shell: server is running newer code (stamp mismatch)
 GET /talent-solutions/train-to-hire 200 in 1619ms
 GET /api/app-stamp 200 in 132ms
 GET /talent-solutions/learning-terms 200 in 1489ms
 GET /talent-solutions/joining-terms 200 (verified separately)
```

## Notes for the next agent

- The `TalentInfoPlaceholder` is still in the file and is the fallback
  for any future info slug. The routing branch now reads
  `if (slug === "joining-terms") / if (slug === "learning-terms") /
  else <TalentInfoPlaceholder />`.
- All static content blocks for `LearningTermsPage` (LEARNING_HERO_STATS,
  PYRAMID_LAYERS, LEARNING_PLATFORMS, CURRICULUM_PHASES, CULTURE_CARDS,
  EXECUTION_LOOP, DAY_TIMELINE, ADVANCED_PATTERNS, MENTOR_TIERS,
  MENTOR_CADENCE, SKILL_TRACK_MATRIX, GRADUATION_CRITERIA) live above
  the component in the same file. If the file gets too long, consider
  extracting the learning-terms content to a
  `@/data/learning-terms.ts` module (same suggestion as Task 2 made
  for joining-terms).
- Lucide icons imported for this page: `Youtube, Building2, Code,
  GitBranch, Zap, Trophy, PlayCircle, Laptop, Rocket, Sparkles,
  Server` (added to the existing import block). `Youtube` is imported
  per the task list but not actually rendered (kept for future use /
  to match the requested import list). `Server` was added beyond the
  task list because it is the natural icon for the "Backend" row in
  the skill matrix.
- The page is a server component. Any interactivity (e.g. a download
  curriculum sample button with real asset generation) would need a
  separate client component imported here.
