import type { Metadata } from "next";
import { getCategoryBySlug } from "@/data/categories";

/**
 * SERVER layout for division pages — per-division <title>, meta
 * description, canonical URL and Open Graph tags (SEO layer). The page
 * itself is a client component and cannot export metadata.
 */

const SITE_URL = "https://stioos.global";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category not found" };
  }
  // Root layout template appends " | STIOOS GLOBAL" automatically.
  const title = `${category.name} Services`;
  const description =
    category.description.slice(0, 155) ||
    `Explore ${category.name} services delivered by STIOOS GLOBAL senior specialists.`;
  const url = `/category/${category.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "STIOOS GLOBAL" },
  };
}

export default function DivisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
