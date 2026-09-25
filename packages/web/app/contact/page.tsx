import type { Metadata } from "next"
import { Mail, Phone, User } from "lucide-react"
import { PageLayout, PageHero } from "@/components/site/page-layout"
import { Reveal } from "@/components/site/reveal"

export const metadata: Metadata = {
  title: "Contact",
  description: "Ia legătura cu echipa FutureMinds pentru orice întrebare despre burse și înscriere.",
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
    value: "vasile.rusu@rotaract.ro",
    href: "mailto:vasile.rusu@rotaract.ro",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "0742 043 505",
    href: "tel:+40742043505",
  },
] as const

export default function ContactPage() {
  return (
    <PageLayout>
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
    </PageLayout>
  )
}
