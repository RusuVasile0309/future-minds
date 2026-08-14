import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, GraduationCap, HandCoins, Sparkles, MapPin, BadgeCheck } from "lucide-react"
import { PageLayout, PageHero } from "@/components/site/page-layout"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Criterii de eligibilitate",
  description:
    "Cine poate aplica la FutureMinds: rezultate academice, situație financiară, implicare, zona de proveniență și statutul de student.",
}

const CRITERIA = [
  {
    icon: GraduationCap,
    title: "Rezultate academice",
    body: "Media obținută pe parcursul studiilor — reflectă seriozitatea și potențialul academic al candidatului.",
  },
  {
    icon: HandCoins,
    title: "Situație financiară",
    body: "Accent pe tinerii care au nevoie reală de sprijin pentru a-și putea continua studiile.",
  },
  {
    icon: Sparkles,
    title: "Interese și implicare",
    body: "Participarea la cursuri, proiecte sau alte activități relevante, observate de profesori.",
  },
  {
    icon: MapPin,
    title: "Zona de proveniență",
    body: "Sprijin suplimentar pentru cei veniți din medii cu acces mai redus la resurse educaționale.",
  },
  {
    icon: BadgeCheck,
    title: "Statut de student bugetat",
    body: "Prioritate pentru cei înscriși la forma de învățământ cu finanțare de la bugetul de stat.",
  },
]

export default function EligibilitatePage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Criterii de eligibilitate"
        title={
          <>
            Sprijinim tineri <span className="text-primary">motivați și serioși</span>.
          </>
        }
        lead="Bursa se adresează studenților de la specializări din IT și inginerie la UBB și UTCN din Cluj-Napoca. Selecția se face în urma unui proces atent, bazat pe recomandările cadrelor didactice, ținând cont de cinci criterii principale."
      />

      <section className="container py-16 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-7">
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <c.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-serif text-xl font-medium">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}

          <div className="flex flex-col justify-between rounded-2xl border border-brand-light/60 bg-secondary/50 p-7">
            <div>
              <h3 className="font-serif text-xl font-medium">Te încadrezi?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Nu trebuie să bifezi perfect fiecare criteriu — contează imaginea de ansamblu. Aplică și lasă-ne
                să te cunoaștem.
              </p>
            </div>
            <Button asChild className="mt-6 w-full">
              <Link href="/aplica">
                Începe aplicația <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="container py-14">
          <p className="max-w-3xl text-lg text-muted-foreground">
            Ne dorim să sprijinim studenți care își doresc să-și continue studiile și să-și atingă potențialul,
            indiferent de contextul din care provin. Dacă ai capacitatea și motivația, contextul nu ar trebui să
            te oprească.
          </p>
        </div>
      </section>
    </PageLayout>
  )
}
