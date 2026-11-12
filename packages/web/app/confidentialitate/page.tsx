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

const LAST_UPDATED = "11 noiembrie 2026"

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
            Cluj-Napoca Samus (CUI 35408330, înregistrată în Registrul asociațiilor și fundațiilor sub nr.{" "}
            220/08.12.2015, prin Încheierea nr. 11754/CC/27.11.2015, dosar nr. 21448/211/2015), Str. Constantin
            Dobrogeanu Gherea nr. 21, et. 1, ap. 6, Cluj-Napoca, denumită în continuare „Operatorul&rdquo;.
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
          <Section n={1} title="Obiectul politicii și cadrul legal">
            <p>
              Prezenta politică are ca obiect informarea persoanelor care solicită acordarea unei burse sociale în
              cadrul programului organizat de Operator (denumite în continuare „solicitanții&rdquo;), precum și a
              membrilor familiilor acestora ale căror date sunt cuprinse în dosarul de aplicare, cu privire la modul
              în care sunt prelucrate datele lor cu caracter personal, în conformitate cu art. 13 și 14 din
              Regulamentul (UE) 2016/679 (denumit în continuare „GDPR&rdquo;), cu Legea nr. 190/2018 privind măsuri de
              punere în aplicare a GDPR și cu celelalte dispoziții legale aplicabile.
            </p>
          </Section>

          <Section n={2} title="Scopurile și temeiurile juridice ale prelucrării">
            <p>
              Datele cu caracter personal sunt prelucrate exclusiv în scopurile de mai jos, fiecare scop având
              temeiul juridic indicat:
            </p>
            <ul className="mt-3 list-[lower-alpha] space-y-2 pl-5">
              <li>
                primirea și analizarea cererilor, verificarea eligibilității, evaluarea situației socio-economice,
                selecția beneficiarilor, comunicarea rezultatului, precum și acordarea și plata bursei și urmărirea
                respectării condițiilor de acordare, în temeiul art. 6 alin. (1) lit. f) din GDPR, interesul legitim
                al Operatorului constând în desfășurarea programului de burse sociale, potrivit scopului său
                statutar, și în selectarea corectă și transparentă a beneficiarilor;
              </li>
              <li>
                îndeplinirea obligațiilor legale de evidență financiar-contabilă aferente plății burselor, în
                temeiul art. 6 alin. (1) lit. c) din GDPR, raportat la Legea contabilității nr. 82/1991;
              </li>
              <li>
                constatarea, exercitarea sau apărarea drepturilor Operatorului, inclusiv în cazul unor contestații
                privind rezultatul selecției, în temeiul art. 6 alin. (1) lit. f) din GDPR, interesul legitim al
                Operatorului constând în asigurarea unei selecții corecte și verificabile și în apărarea drepturilor
                sale.
              </li>
            </ul>
            <p className="mt-3">
              Datele privind starea de sănătate (de exemplu, existența unei dizabilități sau a unei afecțiuni a
              solicitantului ori a unui membru al familiei sale) nu sunt solicitate ca regulă. Acestea se
              prelucrează numai dacă solicitantul alege să le prezinte pentru a fi avute în vedere la evaluarea
              situației sale și numai în baza consimțământului explicit al persoanei la care se referă, potrivit
              art. 9 alin. (2) lit. a) din GDPR. În cazul în care datele privesc un alt membru al familiei,
              consimțământul explicit se exprimă de acesta sau, în cazul unui minor, de reprezentantul său legal.
              Consimțământul poate fi retras oricând, fără a afecta legalitatea prelucrării efectuate anterior
              retragerii.
            </p>
            <p className="mt-3">
              Datele nu vor fi utilizate în alte scopuri, în special în scopuri de marketing, și nu vor fi vândute
              sau puse la dispoziția terților în afara situațiilor prevăzute la pct. 6.
            </p>
          </Section>

          <Section n={3} title="Categoriile de date prelucrate">
            <p>În funcție de criteriile programului, Operatorul prelucrează următoarele categorii de date:</p>
            <ul className="mt-3 list-[lower-alpha] space-y-2 pl-5">
              <li>date de identificare și de contact: nume și prenume, codul numeric personal, adresă de e-mail,
                număr de telefon, adresa de domiciliu;</li>
              <li>date privind statutul de student: instituția de învățământ superior, facultatea, programul de
                studii, anul de studiu și rezultatele academice;</li>
              <li>date privind situația socio-economică: veniturile solicitantului și ale membrilor familiei,
                numărul membrilor familiei și al persoanelor aflate în întreținere, precum și informațiile
                prezentate de solicitant în motivarea cererii;</li>
              <li>documentele justificative privind statutul de student și veniturile;</li>
              <li>datele necesare plății bursei, respectiv codul IBAN și titularul contului, numai pentru
                solicitanții selectați;</li>
              <li>date privind starea de sănătate, numai în condițiile prevăzute la pct. 2.</li>
            </ul>
            <p className="mt-3">
              Solicitanții sunt rugați să acopere, în documentele justificative încărcate, codul numeric personal și
              orice alte informații care nu sunt necesare evaluării cererii (codul numeric personal se preia o
              singură dată, din formular).
            </p>
          </Section>

          <Section n={4} title="Sursa datelor și caracterul obligatoriu al furnizării acestora">
            <p>
              Datele sunt furnizate direct de solicitant. Datele privind membrii familiei sunt furnizate de
              solicitant, care, prin depunerea cererii, declară că i-a informat pe aceștia cu privire la
              transmiterea datelor lor către Operator și la conținutul prezentei politici.
            </p>
            <p className="mt-3">
              Furnizarea datelor prevăzute la pct. 3 lit. a)–e) este necesară pentru analizarea cererii, iar refuzul
              de a le furniza are ca efect imposibilitatea evaluării acesteia. Furnizarea datelor privind starea de
              sănătate este facultativă.
            </p>
          </Section>

          <Section n={5} title="Procesul de evaluare">
            <p>
              Cererile sunt analizate individual de membrii comisiei de evaluare desemnați de Operator. Operatorul
              nu adoptă decizii bazate exclusiv pe prelucrarea automată a datelor, inclusiv crearea de profiluri, în
              sensul art. 22 din GDPR.
            </p>
          </Section>

          <Section n={6} title="Destinatarii datelor">
            <p>
              Datele sunt accesibile exclusiv membrilor comisiei de evaluare și persoanelor din cadrul Operatorului
              care au atribuții în derularea programului, toate fiind ținute de obligația de confidențialitate.
              Datele pot fi comunicate, în măsura strict necesară, furnizorilor care prestează servicii pentru
              Operator, precum serviciile informatice, de găzduire, de formulare online sau de contabilitate, care
              acționează în calitate de persoane împuternicite, în baza unui contract încheiat potrivit art. 28 din
              GDPR, instituției bancare prin care se efectuează plata bursei, precum și autorităților publice, atunci
              când există o obligație legală în acest sens.
            </p>
            <p className="mt-3">
              Datele din dosarele de candidatură sunt comunicate și societății Nova Power&amp;Gas, în calitate de
              finanțator al programului, care participă la selecția beneficiarilor și primește în acest scop datele
              necesare evaluării cererilor. Nova Power&amp;Gas este ținută de aceeași obligație de confidențialitate
              și utilizează datele exclusiv în scopul programului de burse.
            </p>
            <p className="mt-3">
              Rezultatul selecției se comunică individual fiecărui solicitant. Numele beneficiarilor nu sunt făcute
              publice fără consimțământul separat al acestora.
            </p>
          </Section>

          <Section n={7} title="Transferul datelor în afara Spațiului Economic European">
            <p>
              Operatorul nu transferă datele în afara Spațiului Economic European. În măsura în care un furnizor
              utilizat de Operator ar implica un asemenea transfer, acesta se va realiza numai în temeiul unei
              decizii privind caracterul adecvat al nivelului de protecție (art. 45 din GDPR) sau cu garanții
              adecvate (art. 46 din GDPR), precum clauzele standard de protecție a datelor adoptate de Comisia
              Europeană.
            </p>
          </Section>

          <Section n={8} title="Durata stocării datelor">
            <p>
              Datele solicitanților care nu au fost selectați se păstrează timp de 6 luni de la comunicarea
              rezultatului selecției, după care se șterg. Datele beneficiarilor se păstrează pe durata acordării
              bursei și timp de 3 ani de la încetarea acesteia, după care se șterg, cu excepția documentelor care
              stau la baza înregistrărilor contabile, care se păstrează pe durata prevăzută de art. 25 din Legea
              contabilității nr. 82/1991. Datele privind starea de sănătate se șterg la încheierea procesului de
              selecție, în cazul solicitanților neselectați, și la încetarea bursei, în cazul beneficiarilor, ori la
              data retragerii consimțământului, dacă aceasta intervine anterior.
            </p>
          </Section>

          <Section n={9} title="Securitatea datelor">
            <p>
              Operatorul aplică măsuri tehnice și organizatorice adecvate pentru protejarea datelor împotriva
              accesului neautorizat, pierderii, distrugerii sau divulgării, precum limitarea accesului la persoanele
              autorizate, protejarea conturilor prin parole și, unde este posibil, autentificare în doi pași,
              păstrarea documentelor în spații de stocare securizate și asumarea de către toate persoanele implicate
              a obligației de confidențialitate.
            </p>
          </Section>

          <Section n={10} title="Drepturile persoanelor vizate">
            <p>
              În condițiile prevăzute de GDPR, persoanele vizate au dreptul de acces la date (art. 15), dreptul la
              rectificare (art. 16), dreptul la ștergere (art. 17), dreptul la restricționarea prelucrării (art.
              18), dreptul la portabilitatea datelor (art. 20), dreptul de opoziție față de prelucrarea întemeiată pe
              interesul legitim al Operatorului (art. 21), precum și dreptul de a retrage oricând consimțământul,
              atunci când prelucrarea se întemeiază pe acesta (art. 7 alin. (3)).
            </p>
            <p className="mt-3">
              Cererile privind exercitarea acestor drepturi se transmit la adresa de e-mail{" "}
              <a href="mailto:vasile.rusu@rotaract.ro" className="text-primary hover:underline">
                vasile.rusu@rotaract.ro
              </a>{" "}
              și se soluționează gratuit, în termen de o lună de la primire, termen care poate fi prelungit cu două
              luni în condițiile art. 12 alin. (3) din GDPR, cu informarea persoanei vizate.
            </p>
            <p className="mt-3">
              Persoanele vizate au, de asemenea, dreptul de a depune o plângere la Autoritatea Națională de
              Supraveghere a Prelucrării Datelor cu Caracter Personal, cu sediul în București, B-dul G-ral Gheorghe
              Magheru nr. 28-30, sector 1, cod poștal 010336, e-mail anspdcp@dataprotection.ro, website{" "}
              <a
                href="https://www.dataprotection.ro/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                dataprotection.ro
              </a>
              , precum și dreptul de a se adresa instanței de judecată.
            </p>
          </Section>

          <Section n={11} title="Dispoziții finale">
            <p>
              Prezenta politică se aplică tuturor persoanelor care solicită acordarea unei burse sociale în cadrul
              programului, indiferent de modalitatea de depunere a cererii. Operatorul poate actualiza prezenta
              politică, versiunea în vigoare fiind publicată pe website-ul său și comunicată solicitanților înainte
              de depunerea cererii.
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
