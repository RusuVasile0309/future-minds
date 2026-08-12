import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageLayout, PageHero } from "@/components/site/page-layout"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Despre",
  description:
    "FutureMinds identifică tineri cu potențial real din medii defavorizate și le acoperă integral studiile de IT și inginerie.",
}

const OBLIGATIONS = [
  {
    party: "Beneficiari",
    items: [
      "Participarea la cursuri și menținerea unei medii minime de 8.5, cu maximum o restanță reportată între ani.",
      "Finalizarea studiilor în termen și obținerea diplomei de licență.",
      "O conduită corespunzătoare pe toată durata programului.",
      "Menținerea comunicării cu reprezentanții Rotaract și respectarea condițiilor de eligibilitate.",
      "Acceptarea oportunităților de angajare sau stagii oferite de E-Infra.",
    ],
  },
  {
    party: "E-Infra",
    items: [
      "Selectarea beneficiarilor din rândul candidaților identificați de Rotaract.",
      "Achitarea burselor de studiu în cuantumul și la termenele stabilite.",
      "Oferirea de oportunități de angajare sau stagii de practică.",
      "Comunicarea cerințelor și așteptărilor privind parteneriatul.",
      "Stabilirea liniilor directoare de vizibilitate și promovare a proiectului.",
    ],
  },
  {
    party: "Rotaract SAMVS",
    items: [
      "Identificarea candidaților eligibili conform criteriilor stabilite cu E-Infra.",
      "Monitorizarea lunară a progresului beneficiarilor.",
      "Colectarea și transmiterea documentelor privind prezența și rezultatele academice.",
      "Distribuirea resurselor materiale alocate (rechizite, materiale, echipament).",
      "Îndrumare și sprijin în dezvoltarea personală și academică.",
    ],
  },
]

export default function DesprePage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Despre proiect"
        title={
          <>
            Potențialul nu așteaptă <span className="text-primary">permisiune</span>.
          </>
        }
        lead="FutureMinds identifică tineri cu competențe reale și interes pentru informatică și inginerie, apoi le deschide accesul la învățământul superior — indiferent de contextul din care provin."
      />

      {/* Problema & soluția */}
      <section className="container grid gap-12 py-16 md:grid-cols-2 md:py-20">
        <article>
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Problema</h2>
          <p className="mt-4 font-serif text-2xl leading-snug text-foreground">
            Există o diferență clară între potențialul academic al unor tineri din medii defavorizate și
            posibilitățile lor reale de a-și continua studiile.
          </p>
          <p className="mt-4 text-muted-foreground">
            Deși au capacitatea necesară pentru a urma o facultate, contextul social și economic face ca, după
            cele 12 clase, accesul la învățământul superior să fie extrem de limitat.
          </p>
        </article>

        <article>
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Soluția</h2>
          <p className="mt-4 font-serif text-2xl leading-snug text-foreground">
            Un parcurs educațional structurat, cu studiile acoperite integral pe 3–4 ani.
          </p>
          <p className="mt-4 text-muted-foreground">
            Identificăm tinerii cu competențe reale și îi sprijinim să se specializeze în IT și inginerie, cu
            obiectivul integrării profesionale la E-Infra. Programul acoperă taxe, cazare în cămin, materiale
            didactice și laptop.
          </p>
        </article>
      </section>

      {/* Obligațiile părților */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container py-16 md:py-20">
          <p className="eyebrow">Cum funcționează parteneriatul</p>
          <h2 className="display-title mt-4 text-3xl sm:text-4xl">Obligațiile părților</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {OBLIGATIONS.map((o) => (
              <div key={o.party} className="rounded-2xl border border-border bg-card p-7">
                <h3 className="font-serif text-xl font-medium text-brand-deep dark:text-primary">{o.party}</h3>
                <ul className="mt-4 space-y-3">
                  {o.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-light" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container flex flex-col items-start gap-5 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="display-title text-2xl sm:text-3xl">Crezi că te încadrezi?</h2>
          <p className="mt-2 text-muted-foreground">Vezi criteriile de eligibilitate sau începe direct aplicația.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/apply">
              Aplică acum <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/eligibilitate">Criterii de eligibilitate</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  )
}
