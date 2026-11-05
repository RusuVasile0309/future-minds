import type { MetadataRoute } from "next"
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — burse integrale de studii`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: "ro",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1E2F40",
    icons: [
      {
        src: "/futureminds-icon-cerc-bleumarin.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "/futureminds-icon-cerc-bleumarin.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
    ],
  }
}
