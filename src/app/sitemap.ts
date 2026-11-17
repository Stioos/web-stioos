import type { MetadataRoute } from "next";
import { CATEGORIES, subcategoriesFor } from "@/data/categories";
import { CLOUD_SERVICES } from "@/data/services-cloud";
import { AGENT_SERVICES } from "@/data/services-agents";
import { TECH_SERVICES } from "@/data/services-tech";
import { MARKETING_SERVICES } from "@/data/services-marketing";
import { BUSINESS_SERVICES } from "@/data/services-business";
import { MULTIMEDIA_SERVICES } from "@/data/services-multimedia";
import { TALENT_SERVICES } from "@/data/services-talent";

const SITE_URL = "https://stioos.global";

/**
 * Static sitemap for the curated catalog: home + directory surfaces +
 * 7 divisions + 42 subcategories + 305 service landing pages. Built from
 * the same data files the store seeds from, so URLs can never drift from
 * what the app actually renders.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/marketplace`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const divisionRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const subcategoryRoutes: MetadataRoute.Sitemap = CATEGORIES.flatMap((c) =>
    subcategoriesFor(c.id).map((sub) => ({
      url: `${SITE_URL}/category/${c.slug}/${sub.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

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

  return [...staticRoutes, ...divisionRoutes, ...subcategoryRoutes, ...serviceRoutes];
}
