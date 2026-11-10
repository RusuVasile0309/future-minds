// Configurație SEO centralizată + constructori JSON-LD (schema.org).
// Sursă unică pentru URL canonic, identitatea organizației și datele structurate.

/** URL-ul canonic al site-ului (fără slash final). Env-driven: setat în .env.* */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
).replace(/\/$/, "")

export const SITE_NAME = "FutureMinds"

export const SITE_DESCRIPTION =
  "FutureMinds duce tineri talentați din medii defavorizate spre studii universitare de IT și inginerie la Cluj-Napoca, finanțate integral. Un proiect Nova Power&Gas & Rotaract Cluj-Napoca."

/** Construiește un URL absolut din o cale relativă. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString()
}

/** Paginile publice indexabile — folosite de sitemap. */
export const PUBLIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/despre", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/eligibilitate", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/bursa", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/intrebari-frecvente", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/confidentialitate", priority: 0.3, changeFrequency: "yearly" as const },
]

/** Căile private — niciodată indexate (robots.ts + metadata per-pagină). */
export const PRIVATE_PREFIXES = [
  "/aplica",
  "/contul-meu",
  "/admin",
  "/autentificare",
  "/api",
]

// ── Organizator (entitate juridică) și finanțator ──────────────────────────
/** ID stabil pentru a lega nodurile JSON-LD între ele (@id). */
export const ORG_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`
const ROTARACT_ID = `${SITE_URL}/#rotaract`

/** Nova Power&Gas — finanțatorul programului. */
const NOVA = {
  "@type": "Organization",
  name: "Nova Power&Gas",
  url: "https://vreaulanova.ro/",
}

/**
 * Asociația Rotaract Club Cluj-Napoca Samus — organizatorul programului,
 * modelat ca entitate juridică (NGO) cu CUI și adresă pentru claritate E-E-A-T.
 */
const ROTARACT = {
  "@type": "NGO",
  "@id": ROTARACT_ID,
  name: "Rotaract Cluj-Napoca SAMVS",
  legalName: "Asociația Rotaract Club Cluj-Napoca Samus",
  description:
    "Rotaract SAMVS Cluj-Napoca, aripa tânără a familiei Rotary, activează din 2015 prin proiecte caritabile pentru comunitatea clujeană. FutureMinds este unul dintre proiectele clubului.",
  foundingDate: "2015",
  taxID: "35408330",
  url: "https://rotaractsamvs.ro/",
  sameAs: ["https://rotaractsamvs.ro/", "https://www.instagram.com/rotaractsamvs/"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Str. Constantin Dobrogeanu Gherea nr. 21, et. 1, ap. 6",
    addressLocality: "Cluj-Napoca",
    addressCountry: "RO",
  },
}

/**
 * EducationalOrganization — nodul rădăcină, injectat în layout pe tot site-ul.
 * Programul finanțează integral studii universitare, deci modelăm entitatea ca
 * organizație educațională cu finanțatori (funder) declarați.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "NGO"],
    "@id": ORG_ID,
    name: SITE_NAME,
    alternateName: "Future Minds",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/futureminds-logo-bleumarin.png"),
    },
    image: absoluteUrl("/opengraph-image"),
    description: SITE_DESCRIPTION,
    areaServed: {
      "@type": "City",
      name: "Cluj-Napoca",
    },
    sameAs: ["https://www.instagram.com/rotaractsamvs/"],
    // Rotaract este organizatorul programului (entitatea juridică din spate).
    parentOrganization: ROTARACT,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "vasile.rusu@rotaract.ro",
      telephone: "+40742043505",
      areaServed: "RO",
      availableLanguage: ["Romanian"],
    },
    funder: [NOVA],
  }
}

/** WebSite — ajută brandingul și înțelegerea entității de către motoare. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "ro-RO",
    publisher: { "@id": ORG_ID },
  }
}

/**
 * Programul de burse ca EducationalOccupationalProgram (pe pagina /bursa).
 * Nu folosim `offers` cu preț, fiindcă bursa este gratuită pentru beneficiar;
 * valoarea este descrisă textual și prin financialAidEligible.
 */
export function scholarshipProgramSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: "Bursa FutureMinds",
    description:
      "Bursă integrală (~6.000 € pe an, per bursier) care acoperă taxele de studii, cazarea în cămin, masa zilnică, materialele didactice, un laptop și bani de buzunar. Se acordă 5 burse per ediție, exclusiv studenților de la UBB și UTCN din Cluj-Napoca, la specializări de IT și inginerie.",
    url: absoluteUrl("/bursa"),
    programType: "Bursă integrală de studii",
    educationalProgramMode: "full-time",
    occupationalCategory: ["IT", "Inginerie"],
    educationalCredentialAwarded: "Diplomă de licență",
    timeToComplete: "P4Y",
    // Număr de burse acordate per ediție.
    maximumEnrollment: 5,
    provider: { "@id": ORG_ID },
    financialAidEligible:
      "Bursă integrală ce acoperă taxe, cazare, masă, materiale, laptop și cheltuieli de trai.",
    offers: {
      "@type": "Offer",
      category: "Bursă",
      price: 0,
      priceCurrency: "EUR",
    },
  }
}

/** FAQPage. NB: rich results FAQ sunt restricționate (gov/health) din aug. 2023,
 *  dar marcajul ajută înțelegerea semantică și citabilitatea în căutarea AI (GEO). */
export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }
}

/** BreadcrumbList — firul Ariadnei pentru paginile interioare. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}
