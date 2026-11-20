import type { MetadataRoute } from "next";
import { CATEGORIES, subcategoriesFor } from "@/data/categories";
import { CLOUD_SERVICES } from "@/data/services-cloud";
import { AGENT_SERVICES } from "@/data/services-agents";
import { TECH_SERVICES } from "@/data/services-tech";
import { MARKETING_SERVICES } from "@/data/services-marketing";
import { BUSINESS_SERVICES } from "@/data/services-business";
import { MULTIMEDIA_SERVICES } from "@/data/services-multimedia";
import { TALENT_SERVICES } from "@/data/services-talent";
import { SOLUTION_LIST } from "@/data/pages/solution-pages";
import { TALENT_PAGE_SPECS } from "@/data/pages/talent-pages";
import { TALENT_STRIP_GROUPS } from "@/data/talent-strip-groups";
import { TALENT_INFO_PAGES, TALENT_INFO_SUB_PAGE_SLUGS } from "@/data/talent-info-pages";
import { WORKSONN_PAGE_SPECS } from "@/data/pages/worksonn-pages";
import { INDUSTRIES, INSIGHTS, RESOURCES } from "@/data/content";

const SITE_URL = "https://stioos.global";

/**
 * Comprehensive sitemap — every public URL in the marketplace so search
 * engines can discover and index the full catalog. Built from the same
 * data files the app renders from, so URLs never drift from reality.
 *
 * Coverage: home + directory hubs + 7 divisions + 42 subcategories +
 * 305 service pages + 6 solutions + 10 industries + 6 insights +
 * 6 resources + 9 talent pages + 8 worksonn pages + FAQs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/marketplace`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/solutions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/industries`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/resources/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/talent-solutions`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/programs`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // 7 division pages
  const divisionRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 42 subcategory pages
  const subcategoryRoutes: MetadataRoute.Sitemap = CATEGORIES.flatMap((c) =>
    subcategoriesFor(c.id).map((sub) => ({
      url: `${SITE_URL}/category/${c.slug}/${sub.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // 305 service pages
  const services = [
    ...CLOUD_SERVICES,
    ...AGENT_SERVICES,
    ...TECH_SERVICES,
    ...MARKETING_SERVICES,
    ...BUSINESS_SERVICES,
    ...MULTIMEDIA_SERVICES,
    ...TALENT_SERVICES,
  ];
  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter((s) => s.status === "published")
    .map((s) => ({
      url: `${SITE_URL}/marketplace/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: s.featured ? 0.8 : 0.6,
    }));

  // 6 solution pages
  const solutionRoutes: MetadataRoute.Sitemap = SOLUTION_LIST.map((s) => ({
    url: `${SITE_URL}/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 10 industry pages
  const industryRoutes: MetadataRoute.Sitemap = INDUSTRIES.filter(
    (i) => i.status === "active"
  ).map((i) => ({
    url: `${SITE_URL}/industries/${i.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 6 insight pages
  const insightRoutes: MetadataRoute.Sitemap = INSIGHTS.filter(
    (i) => i.status === "published"
  ).map((i) => ({
    url: `${SITE_URL}/insights/${i.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 6 resource pages
  const resourceRoutes: MetadataRoute.Sitemap = RESOURCES.filter(
    (r) => r.status === "published"
  ).map((r) => ({
    url: `${SITE_URL}/resources/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 9 talent-solution pages
  const talentRoutes: MetadataRoute.Sitemap = TALENT_PAGE_SPECS.map((t) => ({
    url: `${SITE_URL}/talent-solutions/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 6 new talent group pages (3 candidate-side + 3 employer-side placeholders)
  const talentGroupRoutes: MetadataRoute.Sitemap = TALENT_STRIP_GROUPS.map(
    (g) => ({
      url: `${SITE_URL}/talent-solutions/${g.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.55,
    })
  );

  // 2 info pages (Joining Terms, Learning Terms)
  const talentInfoRoutes: MetadataRoute.Sitemap = TALENT_INFO_PAGES.map((p) => ({
    url: `${SITE_URL}/talent-solutions/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // 6 info-page sub-pages (3 per info page × 2 = 6 pairs)
  //   joining-terms/curriculum, joining-terms/pricing, joining-terms/agreement
  //   learning-terms/self-learning, learning-terms/curriculum,
  //   learning-terms/projects-development
  const talentInfoSubRoutes: MetadataRoute.Sitemap = TALENT_INFO_PAGES.flatMap(
    (p) =>
      (TALENT_INFO_SUB_PAGE_SLUGS[p.slug] ?? []).map((sub) => ({
        url: `${SITE_URL}/talent-solutions/${p.slug}/${sub}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.45,
      }))
  );

  // 8 worksonn pages
  const worksonnRoutes: MetadataRoute.Sitemap = WORKSONN_PAGE_SPECS.map((w) => ({
    url: `${SITE_URL}/worksonn/${w.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...divisionRoutes,
    ...subcategoryRoutes,
    ...serviceRoutes,
    ...solutionRoutes,
    ...industryRoutes,
    ...insightRoutes,
    ...resourceRoutes,
    ...talentRoutes,
    ...talentGroupRoutes,
    ...talentInfoRoutes,
    ...talentInfoSubRoutes,
    ...worksonnRoutes,
  ];
}
