# Task 2+3 — Rewrite all 55 service titles to be two-line, SEO/AEO optimized

**Agent**: Service Titles Rewrite Agent
**Task ID**: 2+3
**Date**: (session run)
**Status**: COMPLETE

## Objective

Rewrite all 55 service titles in the home-page Services Directory to match the
existing marketplace service-title style — long, descriptive, keyword-rich,
naturally spanning two lines (50–90 characters). Two files were updated in
lockstep:

1. `src/data/services-directory.ts` — first arg of each `svc()` call (55 calls)
2. `src/data/services-directory-catalog.ts` — `name:` field of each `srv()` entry (55 entries)

## Architecture notes that drove the work

- The directory file's `svc()` helper derives `href` via `slugifyServiceName(name)`.
- The catalog file's `srv()` helper derives `slug` via the same `slugifyServiceName(name)` (no catalog entry sets `slug:` explicitly — verified).
- Therefore updating the `name` in both files automatically keeps the
  directory href and the `/marketplace/[slug]` route in sync — no manual
  slug updates needed and no drift is possible.
- The 55 services in the catalog appear in a DIFFERENT numeric order than the
  task description's 1–55 listing (catalog file interleaves divisions). The
  1:1 mapping was driven by the ORIGINAL NAME (unique in each file), so the
  rewrite is order-independent.

## Verification performed

- `bun run lint` — PASS (no errors, no warnings)
- `curl /` — HTTP 200
- 3 sample `/marketplace/[new-slug]` routes — HTTP 200
  - `ai-powered-operations-process-automation-for-streamlined-business-workflows`
  - `seo-answer-engine-optimization-aeo-for-google-ai-overviews-and-perplexity`
  - `fractional-cfo-controller-services-for-startups-without-a-finance-team`
- Cross-file consistency check: both files contain the same 55 unique names
- Length check: all 55 titles are 50–90 characters
- Slug uniqueness check: all 55 derived slugs are unique (no collisions)
- Count check: directory still renders 8 divisions × 55 services

## The 55 new titles (by division, in directory order)

### Division 1 — AI Workflow Automation
1. AI-Powered Operations & Process Automation for Streamlined Business Workflows
2. AI Marketing & Sales Automation for Full-Funnel Pipeline Generation
3. AI Data Analytics & Decision Intelligence for Real-Time Business Insights
4. AI Supply Chain & Procurement Automation for Resilient Vendor Operations
5. AI HR & Workforce Automation for Modern Talent and People Operations

### Division 2 — Custom AI Agentic Services
6. Custom Conversational AI Support Agents for 24/7 Customer Service Automation
7. AI Agent Integration & Orchestration Across CRM, ERP, and SaaS Stacks
8. AI Analytical Agents for Autonomous Data-Driven Decision Making
9. AI Process Automation Agents for End-to-End Task Execution Workflows
10. Multi-Agent AI Systems and Agent Fleets for Enterprise-Scale Automation

### Division 3 — Tech & Programming Services
11. Customizable SaaS Apps & Ready-to-Use Tools for Fast Deployment
12. Cloud Hosting & Deployment Automation on AWS, GCP, and Azure
13. iOS & Android Mobile App Design and Development for High-Performance Applications
14. Custom Software Design & Development for Scalable Enterprise Applications
15. API Development & Integration Services for Connected System Stacks
16. Brand Launch Systems for Faster Time-to-Market and Rapid Activation

### Division 4 — Multimedia & Graphic Design
17. Graphic Design & Branding Services for Distinctive Visual Identity
18. Multimedia Production Services for Video, Audio, and Motion Graphics
19. Visual Content & Marketing Assets for High-Conversion Paid Campaigns
20. UI/UX & Digital Design Services for Web, Mobile, and SaaS Products
21. AI Video & Audio Production for Synthetic Voiceovers and Ad Creative
22. Brand Identity Design & Strategy Development for Cohesive Visual Systems
23. Brand Positioning & Rebranding Services for Established Companies

### Division 5 — Digital Sales & AI Marketing
24. AI-Driven Marketing Personalization for Email, Web, and Ad Channels
25. AI-Powered Sales Enablement with SDRs and Outbound Pipeline Engines
26. Conversational Marketing & Engagement Automation for Lead Nurturing
27. Marketing Analytics & ROI Optimization for Multi-Channel Attribution
28. SEO & Answer Engine Optimization (AEO) for Google AI Overviews and Perplexity
29. Jataye Blogs & News Content for SEO Authority and Organic Traffic
30. Dedicated Sales Teams for Outbound Pipeline and Revenue Growth
31. Dedicated Marketing Specialists for Channel Execution and Strategy
32. Social Media Branding Services for Consistent Platform Presence
33. Digital Marketing Integration & Enhancement Across Every Channel

### Division 6 — Business & Enterprise Services
34. Business Process & Workflow Automation for Operations and Finance
35. Customer Experience & Sales Management for Enterprise CRM Programs
36. Business Intelligence & Data Analytics for Enterprise Decision Making
37. Compliance, Security & Risk Management for Regulated Industries
38. CRM & ERP Implementation Services for Salesforce, HubSpot, SAP, and Oracle

### Division 7 — Consultation & Solutions
39. Operational Consulting & Performance Solutions for Growing Businesses
40. Governance, Risk & Compliance Consulting for Enterprise Organizations
41. Business Strategy & Consulting Services for Market Entry and Growth
42. Branding & Identity Services for Startups and Enterprise Positioning
43. Digital Transformation Consulting for Enterprise Modernization Programs
44. Industry-Specific Brand Experience Programs for Vertical Markets
45. Market Research & Analyst Programs for Brand Bet De-Risking
46. Brand Humanity, Ethics & Emotion Strategy for Lasting Customer Loyalty
47. Strategic Root Brand Positioning for Audience Clarity and Differentiation
48. Emotional Brand Connection Programs for Community and Loyalty
49. Market Segment Differentiation for Multi-Audience Brand Positioning
50. Competitor Analysis & Market Reach for Whitespace Opportunity Capture

### Division 8 — Startup & Accounting
51. Automated Bookkeeping & Financial Management Services for Small Businesses
52. Financial Advisory & Growth Planning for Startup FP&A and Scaling
53. Business Formation & Compliance Services for New Entity Setup
54. Tax Planning & Regulatory Compliance Services for Businesses
55. Fractional CFO & Controller Services for Startups Without a Finance Team

## SEO/AEO design pattern applied

Format: `[Modifier/Tech] [Service Name] [Use Case/Benefit]`

- **Modifier/Tech** — "AI-Powered", "AI Marketing", "Custom Conversational AI",
  "iOS & Android", "Multi-Agent AI", "Automated", "Dedicated", etc. These are
  the high-volume buyer search prefixes.
- **Service Name** — preserved the original service concept (Operations,
  Bookkeeping, CRM/ERP, SEO/AEO, etc.) so the directory structure stays
  recognizable.
- **Use Case/Benefit** — natural-language outcome that AI answer engines can
  cite verbatim: "for Streamlined Business Workflows", "for 24/7 Customer
  Service Automation", "for Google AI Overviews and Perplexity", "for Small
  Businesses", "for Enterprise-Scale Automation", etc.

Length distribution: min 58, max 81, mean ~67 chars — naturally spans two
lines in the existing card UI without overflow.

## Dev log tail (last 5 lines after home page hit)

```
 GET /api/app-stamp 200 in 5ms (next.js: 1.7ms, application-code: 3ms)
 GET /api/app-stamp 200 in 5ms (next.js: 1.8ms, application-code: 4ms)
 GET /api/app-stamp 200 in 527ms (next.js: 12ms, application-code: 514ms)
 GET /api/app-stamp 200 in 70ms (next.js: 2ms, application-code: 68ms)
 GET / 200 in 360ms (next.js: 2ms, application-code: 358ms)
```

No compile errors, no runtime errors, no warnings.

## Side effects to be aware of

- All 55 `/marketplace/[slug]` URLs have changed (the slug is derived from the
  new name). This was approved in the task brief — the home-page Services
  Directory links to the new URLs automatically.
- No other files needed changes — `services-directory.ts` hrefs are derived
  via `slugifyServiceName()` (imported from the catalog file) and the
  `/marketplace/[slug]` route uses `DIRECTORY_SERVICES.find()` which derives
  slugs the same way.
- The legacy `service-pages-data.ts` `slugifyServiceName()` is a separate,
  unused-by-directory copy (the comment in `services-directory-catalog.ts`
  only notes the algorithms mirror each other for legacy compat).
