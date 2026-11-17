import type { Metadata } from "next";
import { CLOUD_SERVICES } from "@/data/services-cloud";
import { AGENT_SERVICES } from "@/data/services-agents";
import { TECH_SERVICES } from "@/data/services-tech";
import { MARKETING_SERVICES } from "@/data/services-marketing";
import { BUSINESS_SERVICES } from "@/data/services-business";
import { MULTIMEDIA_SERVICES } from "@/data/services-multimedia";
import { TALENT_SERVICES } from "@/data/services-talent";
import {
  getCategoryById,
  getSubcategoryById,
} from "@/data/categories";

/**
 * SERVER layout for service detail pages (the page itself is a client
 * component and cannot export metadata). Provides per-service <title>,
 * meta description, canonical URL, Open Graph tags, and schema.org
 * JSON-LD (Service + BreadcrumbList) — the SEO/AEO layer for all 305
 * service landing pages. Data imports here are server-only: they never
 * reach the client bundle.
 */

const SITE_URL = "https://stioos.global";

const ALL_SERVICES = [
  ...CLOUD_SERVICES,
  ...AGENT_SERVICES,
  ...TECH_SERVICES,
  ...MARKETING_SERVICES,
  ...BUSINESS_SERVICES,
  ...MULTIMEDIA_SERVICES,
  ...TALENT_SERVICES,
];

const findService = (slug: string) => ALL_SERVICES.find((s) => s.slug === slug);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) {
    return { title: "Service not found" };
  }
  // Root layout template appends " | STIOOS GLOBAL" automatically.
  const title = service.metaTitle ?? service.name;
  const description = service.metaDescription ?? service.shortDescription;
  const url = `/marketplace/${service.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "STIOOS GLOBAL",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ServiceDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = findService(slug);

  if (!service) {
    // The client page renders its own not-found panel; no JSON-LD to emit.
    return <>{children}</>;
  }

  const category = getCategoryById(service.categoryId);
  const subcategory = getSubcategoryById(service.subcategoryId);
  const pageUrl = `${SITE_URL}/marketplace/${service.slug}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    ...(subcategory ? { serviceType: subcategory.name } : {}),
    ...(category ? { category: category.name } : {}),
    provider: {
      "@type": "Organization",
      name: "STIOOS GLOBAL",
      url: SITE_URL,
    },
    areaServed: "Worldwide",
    url: pageUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Marketplace",
        item: `${SITE_URL}/marketplace`,
      },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: `${SITE_URL}/category/${category.slug}`,
            },
          ]
        : []),
      ...(category && subcategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: subcategory.name,
              item: `${SITE_URL}/category/${category.slug}/${subcategory.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category && subcategory ? 4 : category ? 3 : 2,
        name: service.name,
        item: pageUrl,
      },
    ],
  };

  // FAQPage schema — the core AEO signal. Answer engines (Google AI
  // Overviews, Perplexity, ChatGPT search, Copilot) lift well-formed FAQ
  // markup directly into generated answers, so every service page
  // contributes Q&A pairs that quote our positioning verbatim.
  const faqJsonLd =
    service.faqs && service.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {children}
    </>
  );
}
