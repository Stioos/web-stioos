# Task 1+2+3 — 55 SEO/AEO Service Pages (Dynamic Route)

**Agent**: service-pages-agent
**Task ID**: 1+2+3
**Status**: Complete
**Date**: 2025-11-20

## Summary

Built 55 standalone SEO/AEO-optimized service landing pages at `/services/[slug]`
across all 9 divisions, plus rewired the home-page services directory to point
at the new pages and added the 15-service 9th division (Branding & Marketing
Strategy) from the reference image.

## Files touched

### Created

1. **`src/data/service-pages-data.ts`** (~860 lines)
   - `ServicePageSpec` interface + helper interfaces (`CapabilityItem`,
     `ProcessStep`, `BenefitItem`, `FAQItem`).
   - `slugifyServiceName()` — deterministic slug derivation that produces
     `operations-process-automation` and `brand-identity-design-strategy-
     development` exactly as the task brief's two sample URLs require.
   - `DIVISION_TEMPLATES` (`T`) — 9 per-division content generators
     producing 6 capabilities, 5 process steps, 4 benefits, and 6 AEO
     Q&As flavored to each division's buyer intent.
   - `buildServiceSpec(input)` factory — takes name + division + short
     description and produces a full spec deterministically.
   - `RAW_SERVICE_INPUTS` — all 55 services with SEO-specific
     short descriptions (≤160 chars, keyword-rich).
   - `SERVICE_PAGES`, `SERVICE_PAGE_SLUGS`, `getServicePage()`,
     `servicePagesForDivision()`, `resolveRelatedServices()` exports.
   - `relatedServices` cross-linked programmatically: 2 same-division
     siblings + 1 cross-division peer (deterministic, no randomness).

2. **`src/app/(public)/services/[slug]/page.tsx`** (~830 lines)
   - Server component (no `"use client"`).
   - `generateStaticParams()` pre-renders all 55 slugs at build.
   - `export const dynamicParams = false;` makes unknown slugs return
     a real 404 at the routing layer.
   - `generateMetadata()` emits SEO title + ≤160-char description +
     OpenGraph + Twitter cards + canonical URL.
   - 7-section page structure: Hero (with 3 hero stats + 2 CTAs),
     Overview (2 paragraphs), Capabilities grid (6 cards), Process
     timeline (5 steps with durations), Benefits (4 stat cards), FAQ
     (6 native `<details>` AEO Q&As), CTA band (2 CTAs).
   - Bonus: Related Services section (3 cards linking to sibling specs).
   - **JSON-LD structured data** emitted inline for AEO:
     - `FAQPage` schema (lets ChatGPT, Perplexity, Google AI Overviews
       parse + cite the Q&As directly).
     - `Service` schema (provider, area served, type).
     - `BreadcrumbList` schema (anchors the page in the site hierarchy).
   - Dark navy `bg-brand-ink` / `bg-brand-navy` backgrounds, white text,
     amber/orange CTAs — no indigo or blue primary colors.
   - `Reveal` from `@/components/motion/reveal` for scroll animations.
   - `Link` from `next/link` + `Button` from `@/components/ui/button`.
   - `scroll-mt-36` on every section for anchor nav.
   - Font contrast follows the brief: `text-amber-400`, `text-slate-300`,
     `text-slate-400` (no `text-amber-100`/`text-amber-200`).

### Updated

3. **`src/data/services-directory.ts`**
   - Imported `slugifyServiceName` from `service-pages-data.ts` so the
     directory hrefs are derived from the same slug logic the route uses
     (impossible to drift out of sync).
   - Added `svc(name, description)` helper that wraps each entry and
     derives the href as `/services/${slugifyServiceName(name)}`.
   - Rewrote all 8 existing divisions to use the new `svc()` helper —
     every href now points to `/services/<slug>` (was
     `/marketplace?cat=...&sub=...`).
   - Added **9th division: Branding & Marketing Strategy** with the 15
     services from the reference image (Jataye Blogs & News through
     Competitor Analysis & Market Reach), using the `Target` Lucide
     icon and `amber` accent.
   - Fixed a name mismatch on Division 1 service #4:
     "Supply Chain, Procurement & Management" → "Supply Chain,
     Procurement & Management Automation" (to match the spec data).

4. **`src/components/home/services-directory.tsx`**
   - Updated the hardcoded hero headline from "Eight divisions. Forty
     services." to "Nine divisions. Fifty-five services." to match the
     new directory size (the subtitle count is dynamic and already
     correct).

## Verification

### Lint
```bash
$ bun run lint
$ eslint .
---EXIT: 0---
```
Clean — no errors, no warnings.

### HTTP status codes (curl)
```bash
$ curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:3000/services/operations-process-automation
200

$ curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:3000/services/brand-identity-design-strategy-development
200

$ curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:3000/services/this-slug-does-not-exist
404   # dynamicParams = false correctly returns 404 for unknown slugs
```

### Directory ↔ spec slug parity check
Verified programmatically that all 55 directory hrefs resolve to real
spec slugs (and vice versa):
```
Total directory entries: 55
Total spec slugs: 55
Mismatches: 0
```

### Dev log tail (last 5 lines)
```
 GET /services/operations-process-automation 200 in 589ms
 GET /services/brand-identity-design-strategy-development 200 in 204ms
 GET /services/this-slug-does-not-exist 404 in 499ms
 GET /services/this-slug-does-not-exist 404 in 499ms
 GET /api/app-stamp 200 in 135ms
```

## Sample slugs (first 3 from each division)

```
1. ai-workflow-automation:
   - operations-process-automation
   - digital-sales-ai-marketing-automation
   - data-analytics-decision-intelligence

2. custom-ai-agentic-services:
   - conversational-support-agents
   - integration-orchestration-agents
   - analytical-decision-making-agents

3. tech-programming-services:
   - ready-to-use-tools-saas-apps
   - cloud-hosting-deployment
   - mobile-apps-design-development

4. multimedia-graphic-design:
   - graphic-design-branding
   - multimedia-production-services
   - visual-content-marketing-assets

5. digital-sales-ai-marketing:
   - ai-driven-marketing-personalization
   - ai-powered-sales-enablement
   - conversational-engagement-automation

6. business-enterprise-services:
   - process-workflow-automation
   - customer-sales-experience-management
   - data-analytics-business-intelligence

7. consultation-solutions:
   - operational-performance-solutions
   - compliance-risk-governance-consulting
   - business-strategy-consulting

8. startup-accounting:
   - bookkeeping-financial-management
   - financial-advisory-growth-planning
   - business-formation-compliance

9. branding-marketing-strategy:
   - jataye-blogs-news
   - industries-experience
   - dedicated-sales-teams
```

## Architecture notes for downstream agents

- The factory + division-template pattern in `service-pages-data.ts` makes
  it trivial to add a 56th service: drop a new entry into
  `RAW_SERVICE_INPUTS` with name + division + short description, and the
  factory fills the rest. The route, sitemap, and directory pick it up
  automatically.
- The route is fully static (`generateStaticParams` + `dynamicParams = false`).
  No DB, no runtime data fetching.
- The directory's hrefs are derived from `slugifyServiceName(name)`, not
  hardcoded — so renaming a service updates both the spec slug and the
  directory href atomically.
- The route emits three JSON-LD blocks (`FAQPage`, `Service`,
  `BreadcrumbList`) inline — the biggest AEO lever for answer engines
  parsing these pages.
