import type { Metadata } from "next"
import { PageLayout } from "@/components/site/page-layout"
import { JsonLd } from "@/components/seo/json-ld"
import { PrivacyPolicyBody } from "@/components/legal/privacy-policy-body"
import { breadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum colectează și protejează FutureMinds datele personale ale candidaților la burse, conform GDPR (Regulamentul UE 2016/679) și Legii nr. 190/2018.",
  alternates: { canonical: "/confidentialitate" },
  openGraph: {
    title: "Politica de confidențialitate · FutureMinds",
    description:
      "Cum colectează și protejează FutureMinds datele personale ale candidaților la burse, conform GDPR.",
    url: "/confidentialitate",
  },
}

export default function ConfidentialitatePage() {
  return (
    <PageLayout>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Confidențialitate", path: "/confidentialitate" },
          ]),
        ]}
      />
      <div className="container max-w-3xl py-12 md:py-16">
        <PrivacyPolicyBody />
      </div>
    </PageLayout>
  )
}
