# Task 2 — Joining Terms Page (12 sections + infographics)

**File:** `src/app/(public)/talent-solutions/[slug]/page.tsx`

## What was built

Replaced the `TalentInfoPlaceholder` for the `joining-terms` slug only
with a full 12-section server component `JoiningTermsPage`. The
`learning-terms` placeholder was left untouched (another agent owns it).

## Route behaviour

```
if (infoPage) {
  if (slug === "joining-terms") return <JoiningTermsPage />;
  return <TalentInfoPlaceholder infoSlug={slug} />;
}
```

## The 12 sections (every one has `id` + `scroll-mt-36` for deep-linking)

| # | id                | Eyebrow                  | Infographic                                                       |
|---|-------------------|--------------------------|-------------------------------------------------------------------|
| 1 | joining-hero      | For Employers & Candidates | 3 hero stat cards (90-day replacement, 96% conversion, 8-12 wks) |
| 2 | eligibility       | Who can join             | 4 icon tiles + gradient progress bars                             |
| 3 | application-process | How to apply           | 5-step horizontal timeline with connector lines (lg)              |
| 4 | documents         | What to keep ready       | 8-card grid (sm:2 / lg:4 cols)                                    |
| 5 | fee-structure     | What it costs            | Fee breakdown + What's included + 3-step payment schedule         |
| 6 | stipend-chart     | Earn while you learn     | 4 vertical bars with y-axis labels + gridlines + per-bar notes    |
| 7 | training-bond     | Service agreement        | SVG circular ring with 12 month ticks + covers/breaks cards + 5-milestone timeline |
| 8 | conversion-flow   | From trainee to full-time | 5-box horizontal flowchart with arrows + 3 conversion stat cards |
| 9 | refund-policy     | If a candidate exits early | 5-row table with refund % progress bars                         |
| 10 | conduct           | What we expect           | 6 conduct cards with rule badges                                  |
| 11 | performance-metrics | Measured every week     | 4 dashboard cards with progress bars / gauges                     |
| 12 | joining-cta       | We are here to help      | Gradient CTA card with 2 buttons + contact info                  |

## Design system compliance

- **Backgrounds alternate** `bg-brand-ink` (odd sections) / `bg-brand-navy`
  (even sections) for visual rhythm, matching the existing
  `/talent-solutions` landing page.
- **Accent colour** is amber/orange only (no indigo/blue primary).
  Emerald is used once on the "Refundable" pill in the fee breakdown.
- **Text colours used** are all overridden in light mode:
  `text-amber-400`, `text-amber-300`, `text-slate-200`, `text-slate-300`,
  `text-slate-400`, `text-white`. Avoided `text-amber-100` / `text-amber-200`.
- **Reveal** wraps every section header and most content blocks; staggered
  with `delay` for grid items. The Reveal is a client component but the
  page itself is a server component (no "use client" at the top of the file).
- **Button** (shadcn) used for the CTA pair with `asChild` wrapping
  `next/link` Links — one amber filled, one outlined.
- **Lucide icons** imported as needed: ArrowRight, ArrowLeft, Construction,
  FileText, BookOpen, GraduationCap, Award, Clock, Wallet, ShieldCheck,
  FileCheck, AlertTriangle, CheckCircle2, Users, TrendingUp, Download, Phone,
  Briefcase, Calendar, Camera, Home, CreditCard, Languages, Brain, Send,
  Scale, Handshake, Lock, Target, Star, ClipboardCheck, ScrollText, Mail,
  MessageSquare.
- **Mobile responsive** throughout — `sm:grid-cols-2 lg:grid-cols-4` for
  card grids, `min-w-[640px]` + `overflow-x-auto` for tables/timelines
  that need horizontal scroll on small screens.
- **Semantic HTML** — `<main>`, `<section>` with `aria-label`, `<article>`,
  `<ol>/<li>` for ordered lists, `<table>` with `<thead>/<tbody>` and
  `<th scope="col">`, `<dl>/<dt>/<dd>` for the hero stats.

## SVG infographics

- **Bond ring (section 7)**: pure SVG with two concentric circles (track +
  amber stroke) + 12 radial `<line>` ticks computed via polar coordinates.
  Center text "12 months".
- **Bar chart (section 6)**: CSS-only using `absolute inset-0 flex items-end`
  + per-bar `height: ${heightPct}%` relative to the 256px chart container.
  Y-axis gridlines are absolutely positioned at 0/25/50/75/100%.

## Verification

```
$ bun run lint
$ eslint .        # no errors, no warnings

$ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/talent-solutions/joining-terms
200

$ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/talent-solutions/learning-terms
200   # still resolves to TalentInfoPlaceholder — untouched

$ curl -s http://localhost:3000/talent-solutions/joining-terms | grep -o 'id="[^"]*"' | sort -u
# Confirms all 12 section ids present in rendered HTML:
# joining-hero, eligibility, application-process, documents,
# fee-structure, stipend-chart, training-bond, conversion-flow,
# refund-policy, conduct, performance-metrics, joining-cta
```

## Dev log tail (last 5 lines)

```
[browser] [stioos-watchdog] auto-recovering stale app shell: server is running newer code (stamp mismatch)
 GET / 200 in 720ms
 GET /api/app-stamp 200 in 45ms
 GET /api/app-stamp 200 in 16ms
 GET /talent-solutions/joining-terms 200 in 1193ms
 GET /talent-solutions/learning-terms 200 in 123ms
```

## Notes for the next agent

- The `TalentInfoPlaceholder` component is still in the file and is still
  used for the `learning-terms` slug. When you build the Learning Terms
  page, mirror the same routing pattern: add `if (slug === "learning-terms")
  return <LearningTermsPage />;` ahead of the placeholder return.
- All the static content blocks (HERO_STATS, ELIGIBILITY, etc.) for
  JoiningTermsPage live above the component in the same file. If you want
  to keep the file from getting too long, consider extracting the joining-
  terms content to a `@/data/joining-terms.ts` module.
- The page is a server component. Any interactivity (e.g. a download PDF
  button with real asset generation) would need a separate client
  component imported here.
