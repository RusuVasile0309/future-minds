import type { Metadata } from "next"
import { PageLayout } from "@/components/site/page-layout"
import { JsonLd } from "@/components/seo/json-ld"
import { breadcrumbSchema } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Politica de confidențialitate",
  description:
    "Cum colectează și protejează FutureMinds datele personale ale candidaților la burse, conform GDPR (Regulamentul UE 2016/679) și Legii nr. 190/2018.",
  alternates: { canonical: "/confidentialitate" },
  openGraph: {
    title: "Politica de confidențialitate · FutureMinds",
    description:
      "Cum colectează și protejează FutureMinds datele personale ale candidaților la burse, conform GDPR.",
    url: "/confidentialitate",
  },
}

const LAST_UPDATED = "10 noiembrie 2026"

export default function ConfidentialitatePage() {
  return (
    <PageLayout>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Acasă", path: "/" },
            { name: "Confidențialitate", path: "/confidentialitate" },
          ]),
        ]}
      />
      <div className="container max-w-3xl py-12 md:py-16">
        <p className="eyebrow">Legal</p>
        <h1 className="display-title mt-4 text-3xl sm:text-4xl">
          Politica de confidențialitate și protecția datelor personale (GDPR)
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Data ultimei actualizări: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-4 rounded-2xl border border-border bg-secondary/40 p-6 text-sm">
          <p>
            <span className="font-medium text-foreground">Operatorul datelor:</span> Asociația Rotaract Club
            Cluj-Napoca Samus (CUI 35408330), Str. Constantin Dobrogeanu Gherea nr. 21, et. 1, ap. 6, Cluj-Napoca.
          </p>
          <p>
            <span className="font-medium text-foreground">Website:</span>{" "}
            <a href="https://burse-future-minds.ro" className="text-primary hover:underline">
              burse-future-minds.ro
            </a>
          </p>
          <p>
            <span className="font-medium text-foreground">Contact:</span>{" "}
            <a href="mailto:vasile.rusu@rotaract.ro" className="text-primary hover:underline">
              vasile.rusu@rotaract.ro
            </a>
          </p>
        </div>

        <div className="prose-legal mt-10 space-y-8 text-[0.95rem] leading-relaxed text-muted-foreground">
          <Section n={1} title="Cadrul legal">
            <p>
              Prelucrarea datelor cu caracter personal se realizează în conformitate cu Regulamentul (UE) 2016/679
              (GDPR), Legea nr. 190/2018 și celelalte dispoziții legale aplicabile.
            </p>
          </Section>

          <Section n={2} title="Scopul prelucrării datelor">
            <p>
              Datele sunt colectate și prelucrate exclusiv în scopul gestionării solicitărilor de burse sociale
              pentru studenți, verificării eligibilității, evaluării situației socioeconomice și comunicării
              rezultatelor.
            </p>
          </Section>

          <Section n={3} title="Categorii de date prelucrate">
            <p>În funcție de criteriile programului de burse, pot fi prelucrate următoarele date:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>Nume și prenume;</li>
              <li>Date de contact;</li>
              <li>Universitatea, facultatea și anul de studiu;</li>
              <li>Situația veniturilor personale și familiale, dacă este relevantă;</li>
              <li>Numărul membrilor familiei și al persoanelor aflate în întreținere, dacă este necesar;</li>
              <li>Motivul solicitării bursei și situația socio-economică;</li>
              <li>Documente justificative privind veniturile și statutul de student.</li>
            </ul>
            <p className="mt-3">
              Datele privind sănătatea sau alte categorii speciale vor fi prelucrate numai dacă sunt necesare și
              există o condiție legală aplicabilă.
            </p>
          </Section>

          <Section n={4} title="Temeiul juridic al prelucrării">
            <p>
              Prelucrarea se va realiza în baza unuia sau mai multor temeiuri prevăzute de articolul 6 din GDPR,
              după caz: consimțământ, demersuri precontractuale, obligație legală, interes public sau interes
              legitim.
            </p>
            <p className="mt-3">
              Pentru datele sensibile se vor respecta și condițiile articolului 9 din GDPR, dacă acestea sunt
              aplicabile.
            </p>
          </Section>

          <Section n={5} title="Principii și măsuri de protecție">
            <p>
              Operatorul respectă principiile legalității, transparenței, reducerii la minimum a datelor, limitării
              scopului și păstrării datelor numai pe perioada necesară.
            </p>
            <p className="mt-3">
              Datele vor fi accesibile exclusiv persoanelor autorizate, protejate prin măsuri tehnice și
              organizatorice adecvate și nu vor fi divulgate neautorizat.
            </p>
          </Section>

          <Section n={6} title="Drepturile persoanelor vizate">
            <p>
              În condițiile GDPR, persoanele vizate beneficiază de dreptul de acces, rectificare, ștergere,
              restricționare a prelucrării, opoziție și portabilitate, după caz, precum și de dreptul de a retrage
              consimțământul atunci când acesta constituie temeiul prelucrării.
            </p>
            <p className="mt-3">
              Solicitările pot fi transmise la{" "}
              <a href="mailto:vasile.rusu@rotaract.ro" className="text-primary hover:underline">
                vasile.rusu@rotaract.ro
              </a>
              .
            </p>
            <p className="mt-3">
              Persoanele vizate au dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a
              Prelucrării Datelor cu Caracter Personal:{" "}
              <a
                href="https://www.dataprotection.ro/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                dataprotection.ro
              </a>
              .
            </p>
          </Section>

          <Section n={7} title="Durata păstrării datelor">
            <p>
              Datele vor fi păstrate pe perioada necesară evaluării cererilor și administrării burselor, cu
              respectarea termenelor legale aplicabile. Ulterior, acestea vor fi șterse sau arhivate, după caz,
              conform legislației.
            </p>
          </Section>

          <Section n={8} title="Dispoziții finale">
            <p>
              Prezenta politică se aplică tuturor persoanelor care utilizează platforma pentru solicitarea sau
              administrarea burselor sociale.
            </p>
          </Section>
        </div>
      </div>
    </PageLayout>
  )
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-xl font-medium text-foreground">
        {n}. {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
