import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { LinkHub } from "@/components/layout/link-hub";
import { LeadModalProvider } from "@/components/shared/lead-modal";

const SITE_URL = "https://stioos.global";

/**
 * Entity-level structured data for every public page. Organization +
 * WebSite schema anchor STIOOS GLOBAL as the provider entity for answer
 * engines (AEO) and knowledge panels (SEO); service-level FAQPage,
 * Service and BreadcrumbList schemas are emitted per-page by their
 * layouts. The action target lets AI answer engines deep-link straight
 * into the catalog search.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "STIOOS GLOBAL",
  url: SITE_URL,
  description:
    "STIOOS GLOBAL delivers 305 curated AI, engineering, marketing, enterprise, cloud, multimedia and talent services across seven divisions — fixed-scope proposals in 48 hours.",
  areaServed: "Worldwide",
  knowsAbout: [
    "AI Automation & Agentic Solutions",
    "Technology & Programming",
    "Cloud DevOps & MLOps",
    "Digital Sales & Marketing",
    "Business & Enterprise Services",
    "Multimedia AI & Graphics",
    "Talent Solutions",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "STIOOS GLOBAL",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/marketplace?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <LinkHub />
      <LeadModalProvider />
    </div>
  );
}
