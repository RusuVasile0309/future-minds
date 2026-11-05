import type { MetadataRoute } from "next"
import { SITE_URL, PRIVATE_PREFIXES } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Rute private / aplicative — niciodată în index.
      disallow: PRIVATE_PREFIXES.map((p) => `${p}/`).concat(PRIVATE_PREFIXES),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
