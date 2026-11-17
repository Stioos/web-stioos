import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Demo dashboards and admin are session surfaces — keep crawlers
        // on the public catalog.
        disallow: ["/admin", "/dashboard", "/api/"],
      },
    ],
    sitemap: "https://stioos.global/sitemap.xml",
  };
}
