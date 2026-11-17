# Task 3-d — Service Catalog Admin — Work Record (service-catalog-agent)

## Files created (no existing files modified)
| File | Purpose |
|---|---|
| `src/lib/use-hydrated.ts` | Shared `useHydrated()` hook — reactive zustand persist rehydration flag (useSyncExternalStore). Reuse for any admin hydration skeleton. |
| `src/components/admin/service-form.tsx` | Shared 6-tab `ServiceForm` (create + edit). |
| `src/app/admin/services/page.tsx` | Services table: search, stat filter chips, status/category selects, row actions, delete confirm, `?focus={id}` redirect. |
| `src/app/admin/services/new/page.tsx` | Create page (breadcrumb + `<ServiceForm mode="create" />`). |
| `src/app/admin/services/[id]/page.tsx` | Edit page (hydration skeleton, not-found EmptyState, `<ServiceForm mode="edit" initial key />`). |
| `src/app/admin/categories/page.tsx` | Categories DataTable + Add/Edit dialog + delete guard + `?new=1` auto-open. |
| `src/app/admin/subcategories/page.tsx` | Subcategories grouped under dark category headers + per-group add + row edit/delete + `?category={id}` URL filter. |

## ServiceForm API (for downstream agents)
```tsx
<ServiceForm mode="create" />
<ServiceForm mode="edit" initial={service} key={service.id} />
```
- Own sticky action bar (Save Draft / Publish / View public page / EntityStatusBadge) — do not duplicate.
- Validation: Publish requires name, shortDescription, categoryId, subcategoryId, >=3 capabilities, >=1 process step. Inline errors + tab dots + destructive toast + auto tab switch.
- State: single `Partial<Service>` draft + `setField<K>` helper. Local subcomponents: `ChipInput`, `DynList`, `ProcessEditor`, `Counter`, `FieldError`.

## Conventions followed
- Store mutations always: 300–900ms Loader2 pending state + toast (destructive variant for blocks).
- Destructive actions go through `useConfirmDialog()` + `<ConfirmDialog state onClose />`.
- `useSearchParams` always inside `<Suspense>`; setState-in-effect avoided (dialogs are conditionally mounted + keyed, state seeded in `useState` initializers).
- Lookups for category/subcategory names use live store lists (not static `subcategoriesFor`) so runtime-added rows resolve; `INDUSTRIES` from `@/data/content`; gradients limited to the 8-option palette (blue/cyan/teal/emerald/amber/rose/violet/fuchsia/slate — no indigo).

## Verification
- `bunx tsc --noEmit` filtered to my paths → clean.
- `bun run lint` filtered to my paths → clean.
- HTTP 200 (no 500s) for: `/admin/services`, `/admin/services/new`, `/admin/services/srv-001`, `/admin/services/nonexistent-id`, `/admin/categories`, `/admin/categories?new=1`, `/admin/subcategories`, `/admin/subcategories?category=cat-ai-automation`, `/admin/services?focus=srv-001`.
