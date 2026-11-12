import type { Metadata } from "next"
import { Instagram, Mail, Phone, User } from "lucide-react"
import { PageLayout, PageHero } from "@/components/site/page-layout"
import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Contact",
  description: "Ia legătura cu echipa FutureMinds pentru orice întrebare despre burse și înscriere.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · FutureMinds",
    description: "Ia legătura cu echipa FutureMinds pentru orice întrebare despre burse și înscriere.",
    url: "/contact",
  },
}

const CONTACTS = [
  {
    icon: User,
    label: "Persoană de contact",
    value: "Rusu Vasile",
    href: undefined,
  },
  {
    icon: Mail,
    label: "Email",
    value: "futuremindsburse@gmail.com",
    href: "mailto:futuremindsburse@gmail.com",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "0742 043 505",
    href: "tel:+40742043505",
  },
  {
    icon: Instagram,
    label: "Rotaract SAMVS",
    value: "@rotaractsamvs",
    href: "https://www.instagram.com/rotaractsamvs/",
  },
] as const

export default function ContactPage() {
  return (
    <PageLayout>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHero
        eyebrow="Contact"
        title="Ai o întrebare? Hai să vorbim."
        lead="Scrie-ne sau sună-ne, îți răspundem cât putem de repede și te ajutăm să aplici."
      />

      <section className="container py-16 md:py-20">
        <Reveal className="mx-auto max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card">
          {CONTACTS.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/60 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="font-serif text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="font-serif text-lg font-medium text-foreground">{value}</p>
                )}
              </div>
            </div>
          ))}
        </Reveal>
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
    </PageLayout>
  )
}
