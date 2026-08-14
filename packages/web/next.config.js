/** @type {import('next').NextConfig} */

// Rutele publice sunt în română, dar folderele din `app/` rămân în engleză.
// `rewrites` mapează URL-ul românesc → folderul englezesc (fără a schimba URL-ul),
// iar `redirects` trimite vechile URL-uri englezești către varianta canonică română.
const ROUTE_MAP = [
  { ro: "/aplica", en: "/apply" },
  { ro: "/contul-meu", en: "/dashboard" },
  { ro: "/intrebari-frecvente", en: "/faq" },
  { ro: "/autentificare", en: "/auth" },
  { ro: "/autentificare/intra", en: "/auth/sign-in" },
  { ro: "/autentificare/inregistrare", en: "/auth/sign-up" },
  { ro: "/autentificare/eroare", en: "/auth/error" },
]

const nextConfig = {
  transpilePackages: ["@fm/server", "@fm/shared"],

  async rewrites() {
    return ROUTE_MAP.map(({ ro, en }) => ({ source: ro, destination: en }))
  },

  async redirects() {
    // `permanent: false` (307) cât timp slug-urile se pot încă schimba — evită
    // cache-ul agresiv de browser al lui 308. Treci pe `true` când sunt definitive.
    return ROUTE_MAP.map(({ ro, en }) => ({ source: en, destination: ro, permanent: false }))
  },
}

module.exports = nextConfig
