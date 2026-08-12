import type { Metadata } from "next"
import { PageLayout } from "@/components/site/page-layout"
import { ApplicationForm } from "@/components/apply/application-form"

export const metadata: Metadata = { title: "Formular de înscriere" }

export default function ApplyPage() {
  return (
    <PageLayout>
      <div className="container max-w-3xl py-12 md:py-16">
        <p className="eyebrow">Înscriere</p>
        <h1 className="display-title mt-4 text-3xl sm:text-4xl">Formular de înscriere</h1>
        <p className="mt-3 text-muted-foreground">
          Completează formularul în pași. Răspunsurile se salvează automat, așa că poți reveni oricând înainte de
          a-l trimite.
        </p>
        <div className="mt-10">
          <ApplicationForm />
        </div>
      </div>
    </PageLayout>
  )
}
