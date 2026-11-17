/**
 * One-off catalog audit for the 296-service architecture:
 * 6 spec divisions at baseline AI 45 / Tech 45 / Cloud 45 /
 * Marketing 45 / Business 40 / Multimedia 40 (= 260) plus the
 * retained Talent Solutions division (36) = 296 across 7 divisions.
 * Run: bun run scripts/audit-catalog.ts
 */
import { CATEGORIES, SUBCATEGORIES } from "../src/data/categories";
import { CLOUD_SERVICES } from "../src/data/services-cloud";
import { AGENT_SERVICES } from "../src/data/services-agents";
import { TECH_SERVICES } from "../src/data/services-tech";
import { MARKETING_SERVICES } from "../src/data/services-marketing";
import { BUSINESS_SERVICES } from "../src/data/services-business";
import { MULTIMEDIA_SERVICES } from "../src/data/services-multimedia";
import { TALENT_SERVICES } from "../src/data/services-talent";
import { CORE_SERVICES } from "../src/data/services-core";

const ALL = [
  ...CLOUD_SERVICES,
  ...AGENT_SERVICES,
  ...TECH_SERVICES,
  ...MARKETING_SERVICES,
  ...BUSINESS_SERVICES,
  ...MULTIMEDIA_SERVICES,
  ...TALENT_SERVICES,
];

let errors = 0;
const err = (m: string) => { console.log("  ✗ " + m); errors += 1; };

console.log(`\n== TOTAL: ${ALL.length} services (target 305 = 260 spec + 45 talent) ==\n`);

// Id / slug uniqueness
const ids = new Set<string>(), slugs = new Set<string>();
for (const s of ALL) {
  if (ids.has(s.id)) err(`duplicate id: ${s.id}`);
  if (slugs.has(s.slug)) err(`duplicate slug: ${s.slug}`);
  ids.add(s.id); slugs.add(s.slug);
}

// Category integrity
const catIds = new Set(CATEGORIES.map((c) => c.id));
const subById = new Map(SUBCATEGORIES.map((s) => [s.id, s]));
for (const s of ALL) {
  if (!catIds.has(s.categoryId)) err(`${s.id}: unknown categoryId ${s.categoryId}`);
  const sub = subById.get(s.subcategoryId);
  if (!sub) { err(`${s.id}: unknown subcategoryId ${s.subcategoryId}`); continue; }
  if (sub.categoryId !== s.categoryId) err(`${s.id}: subcategory ${sub.id} belongs to ${sub.categoryId}, service says ${s.categoryId}`);
}

// Per-division / per-sub distribution
for (const c of CATEGORIES) {
  const subs = SUBCATEGORIES.filter((x) => x.categoryId === c.id);
  const divSvc = ALL.filter((s) => s.categoryId === c.id);
  console.log(`\n[${c.slug}] ${c.name} — ${divSvc.length} services, ${subs.length} subs`);
  if (subs.length !== 6) err(`division ${c.slug} has ${subs.length} subcategories (need 6)`);
  const want = ({ "cat-ai-agents": 45, "cat-tech-programming": 45, "cat-cloud-devops-mlops": 45, "cat-digital-sales-marketing": 45 } as Record<string, number>)[c.id] ?? (c.id === "cat-talent-solutions" ? 45 : 40);
  if (divSvc.length !== want) err(`division ${c.slug} has ${divSvc.length} services (need ${want})`);
  for (const sub of subs) {
    const n = ALL.filter((s) => s.subcategoryId === sub.id).length;
    console.log(`   ${n >= 6 ? "ok" : "✗"} ${sub.slug}: ${n}`);
    if (n < 6) err(`sub ${sub.slug} has only ${n} services (need at least 6)`);
  }
}

// Core dedup ids must exist in division files
const allIds = new Set(ALL.map((s) => s.id));
for (const s of CORE_SERVICES) {
  if (!allIds.has(s.id)) err(`core flagship ${s.id} (${s.name}) has no canonical entry in division files`);
}

// Every service must have usable meta fields
for (const s of ALL) {
  if (!s.name || s.name.length < 15) err(`${s.id}: name too short for SEO`);
  if (!s.shortDescription || s.shortDescription.length < 40) err(`${s.id}: shortDescription too thin`);
  if (!s.faqs || s.faqs.length === 0) err(`${s.id}: no FAQs (AEO)`);
}

// Published / featured
const published = ALL.filter((s) => s.status === "published").length;
const featured = ALL.filter((s) => s.featured).length;
console.log(`\npublished: ${published}/${ALL.length}, featured: ${featured}`);

// Slugs must be URL-safe and unique vs category slugs
const catSlugs = new Set(CATEGORIES.map((c) => c.slug));
for (const s of ALL) {
  if (!/^[a-z0-9-]+$/.test(s.slug)) err(`${s.id}: non-URL-safe slug ${s.slug}`);
  if (catSlugs.has(s.slug)) err(`${s.id}: slug collides with division slug ${s.slug}`);
}

console.log(errors === 0 ? "\nAUDIT PASS — catalog is consistent." : `\nAUDIT FAILED — ${errors} issue(s).`);
if (errors > 0) process.exit(1);
