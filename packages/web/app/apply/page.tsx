import type { Metadata } from "next"
import Link from "next/link"
import { Lock } from "lucide-react"
import { PageLayout } from "@/components/site/page-layout"
import { ApplicationForm } from "@/components/apply/application-form"
import { Button } from "@/components/ui/button"
import { getApplicationsOpen } from "@/lib/settings-cache"

export const metadata: Metadata = {
  title: "Formular de înscriere",
  robots: { index: false, follow: false },
}

export default async function ApplyPage() {
  const open = await getApplicationsOpen()

  return (
    <PageLayout>
      <div className="container max-w-3xl py-12 md:py-16">
        <p className="eyebrow">Înscriere</p>
        <h1 className="display-title mt-4 text-3xl sm:text-4xl">Formular de înscriere</h1>

        {open ? (
          <>
            <p className="mt-3 text-muted-foreground">
              Completează formularul în pași. Răspunsurile se salvează automat, așa că poți reveni oricând înainte de
              a-l trimite.
            </p>
            <div className="mt-10">
              <ApplicationForm />
            </div>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <Lock className="size-5" />
            </span>
            <h2 className="mt-5 font-serif text-xl font-medium">Înscrierile sunt închise momentan</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Fereastra de înscriere nu este deschisă acum. Revino pentru următoarea sesiune — între timp poți vedea ce
              acoperă bursa și cine poate aplica.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/bursa">Ce acoperă bursa</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/eligibilitate">Cine poate aplica</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
