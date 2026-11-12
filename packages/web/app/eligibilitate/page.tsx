import type { Metadata } from "next";
import {
  GraduationCap,
  HandCoins,
  Sparkles,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import { PageLayout, PageHero } from "@/components/site/page-layout";
import { Reveal } from "@/components/site/reveal";
import { ApplyCta } from "@/components/site/apply-cta";
import { EligibleFaculties } from "@/components/site/eligible-faculties";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Criterii de eligibilitate",
  description:
    "Cine poate aplica la FutureMinds: rezultate academice, situație financiară, implicare, zona de proveniență și statutul de student.",
  alternates: { canonical: "/eligibilitate" },
  openGraph: {
    title: "Criterii de eligibilitate · FutureMinds",
    description:
      "Cine poate aplica la FutureMinds: rezultate academice, situație financiară, implicare, zona de proveniență și statutul de student.",
    url: "/eligibilitate",
  },
};

const CRITERIA = [
  {
    icon: GraduationCap,
    title: "Rezultate academice",
    body: "Media obținută pe parcursul studiilor, care reflectă seriozitatea și potențialul academic al candidatului.",
  },
  {
    icon: HandCoins,
    title: "Situație financiară",
    body: "Accent pe tinerii cu o nevoie reală de sprijin: acceptăm bursieri din familii cu un venit net sub 2.500 lei pe membru de familie.",
  },
  {
    icon: Sparkles,
    title: "Interese și implicare",
    body: "Participarea la cursuri, proiecte sau alte activități relevante, observate de profesori.",
  },
  {
    icon: MapPin,
    title: "Zona de proveniență",
    body: "Suntem deschiși studenților din mediul urban și din mediul rural. Ținem cont de contextul fiecăruia, cu o atenție în plus pentru cei veniți din zone cu acces mai redus la resurse educaționale.",
  },
  {
    icon: BadgeCheck,
    title: "Statut de student bugetat",
    body: "Prioritate pentru cei înscriși la forma de învățământ cu finanțare de la bugetul de stat.",
  },
];

export default function EligibilitatePage() {
  return (
    <PageLayout>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Acasă", path: "/" },
          { name: "Criterii de eligibilitate", path: "/eligibilitate" },
        ])}
      />
      <PageHero
        eyebrow="Criterii de eligibilitate"
        title={
          <>
            Sprijinim tineri{" "}
            <span className="text-primary">motivați și serioși</span>.
          </>
        }
        lead="Bursa se adresează studenților de la specializări din IT și inginerie la UBB și UTCN din Cluj-Napoca, din toți anii de studiu — de la anul I până în anul terminal. Selecția se face în urma unui proces atent, bazat pe recomandările cadrelor didactice, ținând cont de cinci criterii principale."
      />

      <section className="container py-16 md:py-20">
        <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIA.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-light/60 hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <c.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-serif text-xl font-medium">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </div>
          ))}

          <div className="flex flex-col justify-between rounded-2xl border border-brand-light/60 bg-secondary/50 p-7">
            <div>
              <h3 className="font-serif text-xl font-medium">Te încadrezi?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Nu trebuie să bifezi perfect fiecare criteriu; contează imaginea
                de ansamblu. Aplică și lasă-ne să te cunoaștem.
              </p>
            </div>
            <ApplyCta className="mt-6 w-full" />
          </div>
        </Reveal>
      </section>

      {/* Facultăți eligibile */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container py-16 md:py-20">
          <Reveal>
            <p className="eyebrow">Unde poți fi student</p>
            <h2 className="display-title mt-4 text-3xl sm:text-4xl">Facultățile eligibile</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Poți aplica dacă ești student la una dintre facultățile de IT și inginerie de mai jos, de la
              Universitatea Babeș-Bolyai sau de la Universitatea Tehnică din Cluj-Napoca —{" "}
              <strong className="text-foreground">indiferent de anul în care te afli</strong>, din anul I până în anul
              terminal.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <EligibleFaculties />
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 text-sm text-muted-foreground">
              Nu îți găsești exact specializarea în formular? Alege varianta „–” la pasul de specializare și continuă
              înscrierea — o verificăm noi.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container py-16 md:py-20">
          <Reveal className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-7 sm:p-9">
            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <HandCoins className="size-5" />
            </span>
            <h2 className="mt-5 font-serif text-2xl font-medium">Pragul de venit</h2>
            <p className="mt-3 text-muted-foreground">
              Acceptăm bursieri care provin dintr-o familie în care venitul net
              pe membru de familie este <strong className="text-foreground">sub 2.500 lei</strong>.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5 text-sm">
              <p className="font-medium text-foreground">Cum se calculează</p>
              <p className="mt-2 text-muted-foreground">
                Venitul net total al familiei (părinți care susțin financiar + student), împărțit la numărul
                de membri (student + frați/surori în întreținere + părinții în viață).
              </p>
              <p className="mt-4 text-muted-foreground">
                <span className="font-medium text-foreground">Exemplu:</span> mama 5.000 lei, tata 4.000 lei,
                2 copii în familie → <span className="font-mono">(5.000 + 4.000) ÷ 4 = 2.250 lei</span> pe membru.
                Sub prag, deci se încadrează.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="container py-14">
          <p className="max-w-3xl text-lg text-muted-foreground">
            Ne dorim să sprijinim studenți care își doresc să-și continue
            studiile și să-și atingă potențialul, indiferent de contextul din
            care provin. Dacă ai capacitatea și motivația, contextul nu ar
            trebui să te oprească.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
