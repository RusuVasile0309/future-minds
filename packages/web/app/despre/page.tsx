import type { Metadata } from "next"
import Link from "next/link"
import { ApplyCta } from "@/components/site/apply-cta"
import { PageLayout, PageHero } from "@/components/site/page-layout"
import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Despre",
  description:
    "FutureMinds identifică tineri cu potențial real din medii defavorizate și le acoperă integral studiile de IT și inginerie.",
  alternates: { canonical: "/despre" },
  openGraph: {
    title: "Despre · FutureMinds",
    description:
      "FutureMinds identifică tineri cu potențial real din medii defavorizate și le acoperă integral studiile de IT și inginerie.",
    url: "/despre",
  },
}

const OBLIGATIONS = [
  {
    party: "Beneficiari",
    items: [
      "Participarea la cursuri și menținerea unei medii minime de 8.5, cu maximum o restanță reportată între ani.",
      "Finalizarea studiilor în termen și obținerea diplomei de licență.",
      "O conduită corespunzătoare pe toată durata programului.",
      "Menținerea comunicării cu reprezentanții Rotaract și respectarea condițiilor de eligibilitate.",
      "Acceptarea oportunităților de angajare sau stagii oferite de Nova Power&Gas.",
    ],
  },
  {
    party: "Nova Power&Gas",
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
      "Identificarea candidaților eligibili conform criteriilor stabilite cu Nova Power&Gas.",
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
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Despre", path: "/despre" },
        ])}
      />
      <PageHero
        eyebrow="Despre proiect"
        title={
          <>
            Potențialul nu așteaptă <span className="text-primary">permisiune</span>.
          </>
        }
        lead="FutureMinds identifică tineri cu competențe reale și interes pentru informatică și inginerie, apoi le deschide accesul la învățământul superior, indiferent de contextul din care provin."
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
            Deși au capacitatea necesară pentru a reuși la facultate, contextul social și economic face ca, odată
            ajunși studenți, continuarea studiilor până la final să devină extrem de greu de susținut.
          </p>
        </article>

        <article>
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Soluția</h2>
          <p className="mt-4 font-serif text-2xl leading-snug text-foreground">
            Un parcurs educațional structurat, cu studiile acoperite integral pe 3-4 ani.
          </p>
          <p className="mt-4 text-muted-foreground">
            Identificăm tinerii cu competențe reale și îi sprijinim să se specializeze în IT și inginerie, cu
            obiectivul integrării profesionale la Nova Power&Gas. Programul acoperă taxe, cazare în cămin, materiale
            didactice și laptop.
          </p>
        </article>
      </section>

      {/* Obligațiile părților */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container py-16 md:py-20">
          <p className="eyebrow">Cum funcționează parteneriatul</p>
          <h2 className="display-title mt-4 text-3xl sm:text-4xl">Obligațiile părților</h2>
          <Reveal className="mt-10 grid gap-6 md:grid-cols-3">
            {OBLIGATIONS.map((o) => (
              <div
                key={o.party}
                className="rounded-2xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-light/60 hover:shadow-md"
              >
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
          </Reveal>
        </div>
      </section>

      {/* Organizator & entitate juridică */}
      <section className="border-t border-border">
        <div className="container py-16 md:py-20">
          <p className="eyebrow">Organizator</p>
          <h2 className="display-title mt-4 text-3xl sm:text-4xl">Cine este în spatele FutureMinds</h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-4 text-muted-foreground">
              <p>
                FutureMinds este un proiect al{" "}
                <strong className="text-foreground">Rotaract Club Cluj-Napoca SAMVS</strong>, club din Districtul
                2241 înființat în 2015. Membrii derulează proiecte sociale menite să îmbunătățească viața
                comunității — de la „Urban Hero” și „Mental Health During Crisis” la „O cană de fericire” și
                „Cursa de rățuște”.
              </p>
              <p>
                Bursele sunt finanțate de <strong className="text-foreground">Nova Power&amp;Gas</strong>, care
                oferă bursierilor și oportunități de stagiu și angajare.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="secondary">
                  <a href="https://www.instagram.com/rotaractsamvs/" target="_blank" rel="noopener noreferrer">
                    Rotaract SAMVS
                  </a>
                </Button>
                <Button asChild variant="ghost">
                  <a href="https://vreaulanova.ro/" target="_blank" rel="noopener noreferrer">
                    Nova Power&amp;Gas
                  </a>
                </Button>
              </div>
            </div>
            <aside className="rounded-2xl border border-border bg-secondary/40 p-6 text-sm">
              <h3 className="font-serif text-lg font-medium text-foreground">Entitate juridică</h3>
              <dl className="mt-4 space-y-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Denumire</dt>
                  <dd className="mt-0.5 font-medium text-foreground">Asociația Rotaract Club Cluj-Napoca Samus</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">CUI</dt>
                  <dd className="mt-0.5 font-medium text-foreground">35408330</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">Adresă</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    Str. Constantin Dobrogeanu Gherea nr. 21, et. 1, ap. 6, Cluj-Napoca
                  </dd>
                </div>
              </dl>
            </aside>
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
          <ApplyCta size="lg" />
          <Button asChild size="lg" variant="secondary">
            <Link href="/eligibilitate">Criterii de eligibilitate</Link>
          </Button>
        </div>
      </section>
    </PageLayout>
  )
}
