import type { Metadata } from "next"
import Link from "next/link"
import { Plus, GraduationCap } from "lucide-react"
import { PageLayout, PageHero } from "@/components/site/page-layout"
import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Întrebări frecvente",
  description: "Răspunsuri la cele mai frecvente întrebări despre bursele FutureMinds.",
}

const FAQ = [
  {
    q: "Cine poate aplica?",
    a: "Elevi și studenți cu potențial real pentru studii de IT sau inginerie, care provin din medii defavorizate și au nevoie de sprijin financiar. Contează rezultatele academice, situația financiară, implicarea și zona de proveniență.",
  },
  {
    q: "Ce acoperă bursa?",
    a: "Studiile universitare pe 3-4 ani: taxe de școlarizare, cazare în cămin, materiale didactice, laptop, precum și sprijin pentru cheltuielile de trai.",
  },
  {
    q: "Ce obligații am ca beneficiar?",
    a: "Menținerea unei medii minime de 8.5 (cu maximum o restanță reportată între ani), finalizarea studiilor în termen, o conduită corespunzătoare, comunicarea cu reprezentanții Rotaract și acceptarea oportunităților de stagiu sau angajare la Nova Power&Gas.",
  },
  {
    q: "La ce universități se aplică programul?",
    a: "Programul se adresează studenților de la specializări din IT și inginerie de la Universitatea Babeș-Bolyai (UBB) și de la Universitatea Tehnică din Cluj-Napoca (UTCN), de la Informatică și Inteligență Artificială la specializările tehnice de la Automatică și Calculatoare, Electronică, Construcții și celelalte facultăți de inginerie.",
  },
  {
    q: "Cum se face selecția?",
    a: "Printr-un proces atent bazat pe recomandările cadrelor didactice de la UBB și UTCN și pe criteriile de eligibilitate. Candidaturile sunt evaluate și clasate transparent.",
  },
  {
    q: "Pot reveni să-mi modific aplicația?",
    a: "Da. După ce îți creezi contul, poți completa formularul în mai mulți pași și reveni oricând să-l editezi cât timp înscrierile sunt deschise.",
  },
  {
    q: "Ce se întâmplă după ce sunt selectat?",
    a: "Nova Power&Gas achită bursele la termenele stabilite, iar Rotaract îți oferă îndrumare și monitorizează lunar progresul. Vei avea acces la oportunități de angajare și stagii de practică.",
  },
]

export default function FaqPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Întrebări frecvente"
        title="Ai o întrebare? Probabil e aici."
        lead="Dacă nu găsești răspunsul, scrie-ne, suntem aici să te ajutăm să aplici."
      />

      <section className="container py-16 md:py-20">
        <Reveal className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group px-6 py-5 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-secondary/30 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg font-medium text-foreground">
                {item.q}
                <Plus className="size-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-open:animate-slide-down">
                {item.a}
              </p>
            </details>
          ))}
        </Reveal>

        <Reveal className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">Ești gata să aplici?</p>
          <Button asChild size="lg">
            <Link href="/aplica" data-apply-cta>
              Vreau bursă <GraduationCap className="size-4" />
            </Link>
          </Button>
        </Reveal>
      </section>
    </PageLayout>
  )
}
