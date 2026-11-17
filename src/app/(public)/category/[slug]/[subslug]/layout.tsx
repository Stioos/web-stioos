import type { Metadata } from "next";
import {
  getCategoryBySlug,
  subcategoriesFor,
} from "@/data/categories";

/**
 * SERVER layout for subcategory pages — per-subcategory <title>, meta
 * description, canonical URL and Open Graph tags (SEO layer). The page
 * itself is a client component and cannot export metadata.
 */

const SITE_URL = "https://stioos.global";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subslug: string }>;
}): Promise<Metadata> {
  const { slug, subslug } = await params;
  const category = getCategoryBySlug(slug);
  const subcategory = category
    ? subcategoriesFor(category.id).find((s) => s.slug === subslug)
    : undefined;
  if (!category || !subcategory) {
    return { title: "Category not found" };
  }
  // Root layout template appends " | STIOOS GLOBAL" automatically.
  const title = `${subcategory.name} Services | ${category.name}`;
  const description =
    subcategory.description.slice(0, 155) ||
    `Browse ${subcategory.name} services under ${category.name}, delivered by STIOOS GLOBAL senior specialists.`;
  const url = `/category/${category.slug}/${subcategory.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "STIOOS GLOBAL" },
  };
}

export default function SubcategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
