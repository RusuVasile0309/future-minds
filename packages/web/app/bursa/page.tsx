import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Home, Utensils, Wallet, GraduationCap, Laptop, Check } from "lucide-react"
import { PageLayout, PageHero } from "@/components/site/page-layout"
import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"
import { expenseTables, scholarshipIncludes, type Table } from "@/lib/content/budget"

export const metadata: Metadata = {
  title: "Bursa",
  description:
    "Bursa FutureMinds valorează aproximativ 6.000 € pe an și acoperă cazarea, masa zilnică, banii de buzunar, taxele de studii și materialele.",
}

const ICONS = [Home, Utensils, Wallet, GraduationCap, Laptop]

export default function BursaPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Bursa FutureMinds"
        title={
          <>
            O bursă care acoperă <span className="text-primary">tot ce ai nevoie</span>.
          </>
        }
        lead="Pentru studenții de la specializări din IT și inginerie la UBB și UTCN din Cluj-Napoca. Nu doar taxele: bursa îți acoperă traiul complet ca student, ca să te poți concentra pe studii și pe viitorul tău."
      />

      {/* Valoare + ce include */}
      <section className="container py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Card valoare */}
          <div className="rounded-3xl border border-brand-light/60 bg-secondary/50 p-8 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">Valoarea bursei</p>
            <p className="mt-4 font-serif text-6xl font-medium leading-none text-brand-deep dark:text-primary">
              6.000&nbsp;€
            </p>
            <p className="mt-2 text-lg text-muted-foreground">pe an, per bursier</p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Acordată pe toată durata studiilor de licență (3-4 ani), alături de îndrumare din partea Rotaract și
              oportunități de stagiu și angajare la Nova Power&Gas.
            </p>
            <Button asChild size="lg" className="mt-8 w-full">
              <Link href="/aplica" data-apply-cta>
                Vreau bursă <GraduationCap className="size-4" />
              </Link>
            </Button>
          </div>

          {/* Ce include */}
          <div>
            <h2 className="display-title text-2xl sm:text-3xl">Ce include bursa</h2>
            <ul className="mt-6 space-y-3">
              {scholarshipIncludes.map((inc, i) => {
                const Icon = ICONS[i] ?? Check
                return (
                  <li
                    key={inc.title}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition duration-300 hover:-translate-y-0.5 hover:border-brand-light/60 hover:shadow-md"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-serif text-lg font-medium text-foreground">{inc.title}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{inc.body}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Context: costurile reale în Cluj */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container py-16 md:py-20">
          <p className="eyebrow">Contextul din spate</p>
          <h2 className="display-title mt-4 text-3xl sm:text-4xl">Cât costă viața de student în Cluj</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Costuri orientative pentru un an universitar la UBB sau UTCN, exact cheltuielile pe care bursa le
            preia, ca tu să nu fii nevoit să le duci singur.
          </p>

          <Reveal className="mt-10 grid gap-8 lg:grid-cols-2">
            {expenseTables.map((t) => (
              <ExpenseTable key={t.caption} table={t} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA — aplicarea e acoperită de butonul din cardul de valoare + butonul flotant;
          aici trimitem spre criterii ca să nu existe două butoane de aplicare pe pagină. */}
      <section className="container flex flex-col items-start gap-5 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="display-title text-2xl sm:text-3xl">Bursa acoperă toate acestea.</h2>
          <p className="mt-2 text-muted-foreground">Tu concentrează-te pe studii, iar de rest ne ocupăm noi.</p>
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link href="/eligibilitate">
            Vezi criteriile <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>
    </PageLayout>
  )
}

function ExpenseTable({ table }: { table: Table }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <figcaption className="border-b border-border px-6 py-4">
        <h3 className="font-serif text-lg font-medium">{table.caption}</h3>
        {table.note ? <p className="mt-1 text-xs text-muted-foreground">{table.note}</p> : null}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-left">
              {table.head.map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-3 font-mono text-[11px] uppercase tracking-wide text-muted-foreground ${
                    i > 0 ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr
                key={r.label}
                className={`border-b border-border/60 last:border-0 ${r.strong ? "bg-secondary/30" : ""}`}
              >
                <td className={`px-6 py-3 ${r.strong ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {r.label}
                </td>
                {r.cols.map((c, i) => (
                  <td
                    key={i}
                    className={`px-6 py-3 text-right tabular-nums ${
                      r.strong ? "font-semibold text-foreground" : "text-foreground/90"
                    }`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
