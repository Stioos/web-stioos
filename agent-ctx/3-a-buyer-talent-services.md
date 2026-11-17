# Task 3-a — Buyer-side Talent Services + Request Tracking (work record)

## Files created / modified

1. **CREATED** `src/app/dashboard/buyer/talent-services/page.tsx`
   - Wraps in `<RequireRole role="buyer"><DashboardShell role="buyer" title="Talent Services">` (same pattern as buyer requests/orders pages).
   - Page header: "Talent Services" (`text-white` h1) + `text-slate-400` subtitle mentioning STIOOS delivery team routing, reference codes and status tracking.
   - "Track it end to end" banner row (sky accent, `Link` → `/dashboard/buyer/requests`) with ClipboardList icon and arrow.
   - Responsive grid `grid gap-4 md:grid-cols-2 xl:grid-cols-3` rendering the 5 `TALENT_REQUEST_KINDS` offerings.
   - `KIND_ICON_MAP: Record<string, LucideIcon>` maps def.icon names: UserCheck, GraduationCap, Search, Users, Briefcase (fallback Users).
   - Each card: icon chip (amber accent), label, tagline, description, deliverables with emerald Check icons, full-width "Request service" Button (mt-auto for equal height).
   - Dialog (`TalentServiceDialog`) with common fields: Title (prefilled `${def.label} — `), Details textarea, Budget range Select, Timeline Select; plus kind-specific fields from `def.fields` (text/number → Input with type/min/inputMode, select → shadcn Select with `def.options`, `required` respected). Kind fields rendered in a `fieldset` with sr-only legend, 2-col on sm+.
   - On submit: validation → 500ms fake delay → `addMarketRequest({ categoryId: "cat-talent", categoryName: "Talent Solutions", kind: def.kind, title, details, budgetRange, timeline, meta })` → close → toast "Request submitted" / "Reference REQ-XXXXX — track it in My Requests." (`useToast` from `@/hooks/use-toast`).
   - Dialog mounting: parent keeps `activeDef` + `dialogOpen` state; `key={activeDef?.kind ?? "none"}` remounts the form per kind so state resets; explicit `reset()` on close (mirrors existing NewRequestDialog pattern).

2. **MODIFIED** `src/app/dashboard/buyer/requests/page.tsx` (tracking upgrade; NewRequestDialog and page structure preserved)
   - Kind badge per card: pill with `KIND_LABELS[request.kind ?? "service"]`; talent kinds get sky tone (`border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300`), generic "Marketplace Service" gets slate tone.
   - Reference code shown inline in the meta line as `<span className="font-mono">{request.reference}</span>` (e.g. "REQ-8F3K2").
   - Status filter tabs (shadcn Tabs, orders-page pattern, with counts): All / Open / In review / In progress / Fulfilled / Closed. `rejected` requests are folded into the "Closed" tab (noted as my call in the brief); counts memo maps rejected → closed.
   - Status pipeline: 4-step horizontal stepper (`RequestStepper`) over `REQUEST_STATUS_FLOW` — past dots filled `bg-primary border-primary`, current dot primary + `ring-4 ring-primary/20`, future dots muted; connectors fill primary once passed; `aria-current="step"` on the active `li`, `aria-label` on the `ol`. `rejected`/`closed` render an end-state chip (`RequestEndState`: XCircle rose / Archive slate) + short explanatory line instead of the stepper.
   - Activity section: `RequestActivity` shadcn Collapsible with ghost trigger (History icon, event count, rotating chevron, `aria-expanded`, aria-label). Vertical timeline `ol` with border-l, status-colored dots (`border-card` ring), status label from `REQUEST_STATUS_LABELS`, optional note, `by` and `format(new Date(event.at), "MMM d, yyyy 'at' h:mm a")` via date-fns `format`.
   - `request.orderId` → emerald "Converted to order" chip Link → `/dashboard/buyer/orders`. `request.quotedAmount` → "Quoted: $X" chip via `formatMoney`.
   - Cards extracted into `RequestCard` and rendered in `grid gap-4 xl:grid-cols-2`. Subtitle updated to mention reference codes/tracking. Empty state for "all" tab links to Talent Services. All previous imports kept (all still used); added: Collapsible, Tabs, request-kinds constants, `cn`, `format`, type imports.

3. **MODIFIED** `src/components/dashboard/dashboard-shell.tsx`
   - Added `Users` to the lucide-react import.
   - Added exactly one buyer nav item between "My Orders" and "My Requests":
     `{ href: "/dashboard/buyer/talent-services", label: "Talent Services", icon: Users }`

4. **MODIFIED** `src/app/dashboard/buyer/page.tsx` (buyer Overview)
   - Added `Users` to lucide imports and one compact quick-action Link card (icon chip + "Talent Services" title + one-line description + ArrowRight) between the stats section and the two-column cards. No other restructuring.

## Validation rules implemented (Talent Services dialog)
- Title: required, trimmed length >= 5 → "Give your request a clear title." (pattern from NewRequestDialog)
- Details: required, trimmed length >= 20 → "Describe the work in at least a couple of sentences."
- Budget range: required select → "Select a budget range."
- Timeline: required select → "Select a timeline."
- Kind-specific fields (per `def.fields`): required → "`${field.label}` is required."; number type → must parse and be > 0 → "Enter a valid number greater than zero."
- Inline errors rendered as `text-xs font-medium text-destructive` under each field with `aria-invalid` on inputs/selects; `noValidate` on the form.
- Meta sent to the store contains only non-empty trimmed field values.

## Accessibility notes
- Label `htmlFor`/`id` on all text/number inputs (`talent-title`, `talent-details`, `talent-field-${key}`); Radix Selects use `aria-label` per the existing page pattern.
- Stepper: `aria-current="step"` + `aria-label` on the ordered list; decorative dots/connectors `aria-hidden`.
- Activity trigger: `aria-expanded`, `aria-label`; icon-only decorative icons carry `aria-hidden`.
- Kind/end-state badges are plain text pills (no icon-only buttons added anywhere).

## Deviations from brief (minor, intentional)
1. "Rejected" requests live in the **Closed** tab (brief allowed either). The card itself still shows the exact end-state ("Rejected" chip) so no information is lost.
2. Added `dark:text-sky-300` to the sky kind badge beyond the exact classes suggested — the shell supports dark mode and `text-sky-700` alone is unreadable on dark cards; consistent with how `slate`/`amber` ToneBadge tones add dark variants.
3. Requests page cards now render in a 2-col grid at xl (was a single stacked list) since cards grew taller with the stepper + activity; keeps the page scannable. Single column below xl.
4. Number inputs also enforce `min={1}` + `inputMode="numeric"` in addition to the JS validation (brief said "respect required"; the positive-number rule guards headcount/team size style fields).

## Hard rules compliance
- Did NOT touch `src/lib/store.ts`, `src/types/index.ts`, `src/lib/request-kinds.ts`, `src/data/**`, `src/app/admin/**`, `src/lib/nav.ts`, or public pages. No store change needed — `addMarketRequest` already returns the created request (with `reference`) which the toast uses.
- No emojis, no inline styles, Tailwind classes only, shadcn/ui components from `@/components/ui/*` only, no `any`, no unused imports.

## Verification output
- `bunx tsc --noEmit 2>&1 | grep -E "^src/"` → **empty** (no errors in src/).
- `bun run lint` → `2 problems (0 errors, 2 warnings)` — both warnings are the pre-existing ones in `src/app/(public)/category/[slug]/page.tsx` (110:29, 459:74, `no-location-assign-relative-destination`). Nothing new introduced.
- Smoke-tested routes: `/dashboard/buyer/talent-services`, `/dashboard/buyer/requests`, `/dashboard/buyer` all HTTP 200; dev.log clean (no compile/runtime errors).
