import type { Metadata } from "next"
import Link from "next/link"
import FutureMindsLogo from "@/components/FutureMindsLogo"
import { PrintButton } from "@/components/legal/print-button"

export const metadata: Metadata = {
  title: "Consimțămintele pe care le acorzi",
  description:
    "Ce confirmi, pe larg, prin cele două căsuțe bifate la depunerea cererii de bursă FutureMinds: acordul GDPR și declarația pe propria răspundere.",
  alternates: { canonical: "/consimtaminte" },
  // Pagină-anexă a formularului; conținutul legal complet trăiește în
  // /confidentialitate, deci o ținem în afara indexării ca să nu concureze cu el.
  robots: { index: false, follow: true },
}

const LAST_UPDATED = "11 noiembrie 2026"

export default function ConsimtaminteDocPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-5">
        {/* Bara de acțiuni — ascunsă la printare. */}
        <div className="mb-6 flex items-center justify-between gap-3 print:hidden">
          <Link
            href="/apply"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Înapoi la formular
          </Link>
          <PrintButton />
        </div>

        {/* Documentul propriu-zis. */}
        <article className="rounded-2xl border border-border bg-background p-7 shadow-sm sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <header className="flex flex-col gap-5 border-b border-border pb-6">
            <FutureMindsLogo variant="horizontal" size={30} tagline={false} />
            <div>
              <p className="eyebrow">Formular de înscriere</p>
              <h1 className="display-title mt-3 text-2xl sm:text-3xl">
                Consimțămintele pe care le acorzi
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                La depunerea cererii bifezi două căsuțe. Mai jos găsești, pe larg, ce confirmi prin fiecare.
              </p>
            </div>
          </header>

          <div className="mt-6 space-y-3 rounded-xl border border-border bg-secondary/40 p-5 text-sm print:bg-transparent">
            <p>
              <span className="font-medium text-foreground">Operatorul datelor:</span> Asociația Rotaract Club
              Cluj-Napoca Samus (CUI 35408330, înregistrată în Registrul asociațiilor și fundațiilor sub nr.{" "}
              220/08.12.2015), Str. Constantin Dobrogeanu Gherea nr. 21, et. 1, ap. 6, Cluj-Napoca, denumită în
              continuare „Operatorul&rdquo;.
            </p>
            <p>
              <span className="font-medium text-foreground">Contact:</span>{" "}
              <a href="mailto:futuremindsburse@gmail.com" className="text-primary hover:underline">
                futuremindsburse@gmail.com
              </a>
            </p>
          </div>

          <div className="mt-8 space-y-8 text-[0.95rem] leading-relaxed text-muted-foreground">
            <ConsentSection
              n={1}
              checkbox="Sunt de acord cu prelucrarea datelor mele cu caracter personal (GDPR)"
              title="Acord privind prelucrarea datelor cu caracter personal"
            >
              <p>
                Prin bifarea acestei căsuțe îți exprimi acordul ca Operatorul să prelucreze datele cu caracter
                personal cuprinse în cererea ta și în documentele atașate, exclusiv în scopul derulării programului
                de burse: primirea și analizarea cererii, verificarea eligibilității, evaluarea situației
                socio-economice, selecția beneficiarilor, comunicarea rezultatului și, pentru cei selectați,
                acordarea și plata bursei.
              </p>
              <p className="mt-3">
                Sunt prelucrate date de identificare și de contact, date privind statutul de student și rezultatele
                academice, date privind situația socio-economică a ta și a membrilor familiei, documentele
                justificative, iar pentru beneficiari datele necesare plății. Datele privind starea de sănătate se
                prelucrează doar dacă alegi să le prezinte, în baza unui consimțământ explicit separat.
              </p>
              <p className="mt-3">
                Datele nu sunt folosite în scop de marketing și nu sunt vândute. Ai dreptul de acces, rectificare,
                ștergere, restricționare, opoziție și portabilitate, precum și dreptul de a-ți retrage oricând
                consimțământul, fără a afecta prelucrările anterioare. Modul complet în care îți sunt protejate
                datele, destinatarii, durata de stocare și drepturile tale sunt descrise în{" "}
                <Link href="/confidentialitate" className="text-primary hover:underline">
                  Politica de confidențialitate
                </Link>
                .
              </p>
            </ConsentSection>

            <ConsentSection
              n={2}
              checkbox="Declar pe propria răspundere că datele furnizate sunt corecte"
              title="Declarație pe propria răspundere"
            >
              <p>
                Prin bifarea acestei căsuțe declari, pe propria răspundere, că informațiile completate în formular
                și documentele încărcate sunt reale, corecte și complete și că reflectă situația ta reală la data
                depunerii cererii.
              </p>
              <p className="mt-3">
                Dacă în cerere incluzi date despre membrii familiei tale, declari totodată că i-ai informat cu
                privire la transmiterea datelor lor către Operator și la conținutul Politicii de confidențialitate.
              </p>
              <p className="mt-3">
                Iei la cunoștință că furnizarea de informații false sau incomplete poate atrage respingerea cererii,
                iar dacă este constatată după acordarea bursei, revocarea acesteia, fără a exclude eventualele
                consecințe prevăzute de lege.
              </p>
            </ConsentSection>
          </div>

          <footer className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
            Data ultimei actualizări: {LAST_UPDATED}. Documentul rezumă consimțămintele din formular; textul legal
            complet se regăsește în{" "}
            <Link href="/confidentialitate" className="text-primary hover:underline">
              Politica de confidențialitate
            </Link>
            .
          </footer>
        </article>
      </div>
    </div>
  )
}

function ConsentSection({
  n,
  checkbox,
  title,
  children,
}: {
  n: number
  checkbox: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="font-serif text-xl font-medium text-foreground">
        {n}. {title}
      </h2>
      <p className="mt-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm italic text-foreground print:bg-transparent">
        Căsuța bifată: „{checkbox}&rdquo;
      </p>
      <div className="mt-3">{children}</div>
    </section>
  )
}
