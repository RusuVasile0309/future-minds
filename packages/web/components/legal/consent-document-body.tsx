import type { ReactNode } from "react"
import FutureMindsLogo from "@/components/FutureMindsLogo"

export const CONSENT_LAST_UPDATED = "26 noiembrie 2026"

/** Corpul declarației de consimțământ — folosit de pagina /consimtaminte și de modalul din formular. */
export function ConsentDocumentBody() {
  const LAST_UPDATED = CONSENT_LAST_UPDATED
  return (
    <>
    <header className="flex flex-col gap-5 border-b border-border pb-6">
      <FutureMindsLogo variant="horizontal" size={30} tagline={false} />
      <div>
        <p className="eyebrow">Programul de burse sociale FutureMinds</p>
        <h1 className="display-title mt-3 text-2xl sm:text-3xl">
          Declarație de consimțământ și de luare la cunoștință
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          privind prelucrarea datelor cu caracter personal, în temeiul art. 6, 7, 9 și 13 din Regulamentul (UE)
          2016/679 și al Legii nr. 190/2018
        </p>
      </div>
    </header>

    <div className="mt-6 space-y-3 rounded-xl border border-border bg-secondary/40 p-5 text-sm print:bg-transparent">
      <p>
        <span className="font-medium text-foreground">Operatorul datelor:</span> Asociația Rotaract Club
        Cluj-Napoca Samus (CUI 35408330, înregistrată în Registrul asociațiilor și fundațiilor sub nr.{" "}
        220/08.12.2015, prin Încheierea nr. 11754/CC/27.11.2015, dosar nr. 21448/211/2015), Str. Constantin
        Dobrogeanu Gherea nr. 21, et. 1, ap. 6, Cluj-Napoca, denumită în continuare „Operatorul&rdquo;.
      </p>
      <p>
        <span className="font-medium text-foreground">Contact:</span>{" "}
        <a href="mailto:futuremindsburse@gmail.com" className="text-primary hover:underline">
          futuremindsburse@gmail.com
        </a>
      </p>
    </div>

    <div className="mt-8 space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">
      <p>
        Eu, persoana care depune o cerere pentru o bursă socială în cadrul programului organizat de Operator
        (denumită în continuare „Declarantul&rdquo;), declar următoarele:
      </p>
    </div>

    <div className="mt-8 space-y-8 text-[0.95rem] leading-relaxed text-muted-foreground">
      <Article n={1} title="Luarea la cunoștință a informării privind prelucrarea datelor">
        <p>
          Declar că, înainte de depunerea cererii, am luat la cunoștință{" "}
          <a href="/confidentialitate" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Politica de confidențialitate și protecția datelor personale (GDPR)
          </a>{" "}
          a Operatorului, care cuprinde informațiile prevăzute de art. 13 din Regulamentul (UE) 2016/679, între
          care: identitatea și datele de contact ale Operatorului; scopurile și temeiurile juridice ale
          prelucrării; categoriile de date prelucrate; destinatarii datelor, inclusiv societatea Nova Power&amp;Gas,
          în calitate de finanțator al programului; durata de stocare; drepturile mele și modalitatea de
          exercitare a acestora.
        </p>
        <p className="mt-3">
          Sunt de acord ca datele mele cu caracter personal cuprinse în cerere și în documentele atașate să fie
          prelucrate de Operator exclusiv în scopurile programului de burse: primirea și analizarea cererii,
          verificarea eligibilității, evaluarea situației socio-economice, selecția beneficiarilor,
          comunicarea rezultatului și, în cazul selectării mele, acordarea și plata bursei, precum și
          îndeplinirea obligațiilor legale de evidență financiar-contabilă și constatarea, exercitarea sau
          apărarea drepturilor Operatorului.
        </p>
        <p className="mt-3">
          Înțeleg că aceste prelucrări se întemeiază pe interesul legitim al Operatorului (art. 6 alin. (1)
          lit. f) din GDPR) și pe obligații legale (art. 6 alin. (1) lit. c) din GDPR), astfel cum se arată în
          Politica de confidențialitate, iar prezentul acord reprezintă confirmarea că am fost informat/ă.
          Aceste prelucrări nu se întemeiază pe consimțământ; în privința lor am dreptul de opoziție prevăzut
          de art. 21 din GDPR. Datele nu sunt folosite în scopuri de marketing și nu sunt vândute.
        </p>
        <FormCheckbox>Sunt de acord cu prelucrarea datelor mele cu caracter personal (GDPR)</FormCheckbox>
      </Article>

      <Article n={2} title="Consimțământ explicit privind datele referitoare la starea de sănătate">
        <p>
          Datele privind starea de sănătate (de exemplu, certificatul de handicap sau alte documente medicale
          ale mele ori ale unui membru al familiei) nu sunt obligatorii. Dacă aleg să le completez în formular
          sau să le încarc, îmi exprim în mod liber, specific, informat și neechivoc consimțământul explicit
          ca Operatorul să le prelucreze, în baza art. 9 alin. (2) lit. a) din GDPR, exclusiv pentru a fi avute în
          vedere la evaluarea situației mele în cadrul programului.
        </p>
        <p className="mt-3">
          Știu că neprezentarea acestor date nu duce la respingerea cererii, ci doar la faptul că situația
          respectivă nu poate fi luată în considerare la evaluare. Datele privind starea de sănătate se șterg la
          încheierea procesului de selecție, în cazul solicitanților neselectați, și la încetarea bursei, în cazul
          beneficiarilor, ori la data retragerii consimțământului, dacă aceasta intervine anterior.
        </p>
        <p className="mt-3">
          Îmi pot retrage consimțământul în orice moment, în aceeași modalitate simplă în care l-am dat, fără a
          afecta legalitatea prelucrării efectuate anterior retragerii (art. 7 alin. (3) din GDPR).
        </p>
      </Article>

      <Article n={3} title="Datele privind membrii familiei">
        <p>
          Dacă în cerere includ date despre membrii familiei mele, declar că i-am informat cu privire la
          transmiterea datelor lor către Operator și la conținutul Politicii de confidențialitate. În cazul în
          care aceste date privesc starea de sănătate a unui membru al familiei, declar că am obținut
          consimțământul explicit al acestuia sau, în cazul unui minor, al reprezentantului său legal, și că îl
          pot dovedi la cererea Operatorului.
        </p>
      </Article>

      <Article n={4} title="Declarație pe propria răspundere">
        <p>
          Declar, pe propria răspundere, că informațiile completate în formular și documentele încărcate sunt
          reale, corecte și complete și reflectă situația mea la data depunerii cererii. Mă angajez să informez
          Operatorul, fără întârziere, cu privire la orice modificare care ar putea influența evaluarea.
        </p>
        <p className="mt-3">
          Am luat la cunoștință că furnizarea de informații false sau incomplete poate atrage respingerea
          cererii ori, dacă este constatată după acordarea bursei, revocarea acesteia și restituirea sumelor
          primite, fără a exclude răspunderea prevăzută de lege.
        </p>
        <FormCheckbox>Declar pe propria răspundere că datele furnizate sunt corecte</FormCheckbox>
      </Article>

      <Article n={5} title="Alte precizări">
        <ul className="list-[lower-alpha] space-y-2 pl-5">
          <li>
            Cererile sunt analizate individual de comisia de evaluare; Operatorul nu adoptă decizii bazate
            exclusiv pe prelucrare automată, inclusiv crearea de profiluri (art. 22 din GDPR).
          </li>
          <li>
            Datele solicitanților neselectați se păstrează 6 luni de la comunicarea rezultatului, iar cele ale
            beneficiarilor pe durata bursei și 3 ani de la încetarea acesteia, cu excepția documentelor
            contabile, păstrate conform Legii nr. 82/1991.
          </li>
          <li>
            Numele beneficiarilor nu sunt făcute publice fără consimțământul separat al acestora.
          </li>
          <li>
            Furnizarea datelor necesare analizării cererii este condiție pentru evaluarea acesteia; refuzul de a
            le furniza face imposibilă evaluarea.
          </li>
        </ul>
      </Article>

      <Article n={6} title="Drepturile mele și retragerea consimțământului">
        <p>
          Am luat la cunoștință că, în condițiile GDPR, am dreptul de acces (art. 15), de rectificare (art. 16),
          de ștergere (art. 17), de restricționare a prelucrării (art. 18), la portabilitatea datelor (art. 20)
          și de opoziție (art. 21), precum și dreptul de a-mi retrage oricând consimțământul acolo unde
          prelucrarea se întemeiază pe acesta. Pot exercita aceste drepturi printr-o cerere trimisă la{" "}
          <a href="mailto:futuremindsburse@gmail.com" className="text-primary hover:underline">
            futuremindsburse@gmail.com
          </a>
          , care se soluționează gratuit, în termen de o lună de la primire.
        </p>
        <p className="mt-3">
          Am dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu
          Caracter Personal (Bd. G-ral Gheorghe Magheru nr. 28-30, sector 1, București; anspdcp@dataprotection.ro;{" "}
          <a
            href="https://www.dataprotection.ro/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            dataprotection.ro
          </a>
          ) și de a mă adresa instanței de judecată.
        </p>
      </Article>

      <Article n={7} title="Modul de exprimare a declarației">
        <p>
          Prezenta declarație se exprimă prin bifarea căsuțelor „Sunt de acord cu prelucrarea datelor mele cu
          caracter personal (GDPR)&rdquo; și „Declar pe propria răspundere că datele furnizate sunt
          corecte&rdquo; din formularul de cerere, după parcurgerea acestui document și a Politicii de
          confidențialitate. Bifarea este consemnată în cererea depusă și ține loc de semnătură; nu este
          necesară o semnătură olografă.
        </p>
      </Article>
    </div>

    <footer className="mt-8 border-t border-border pt-5 text-xs text-muted-foreground">
      Data ultimei actualizări: {LAST_UPDATED}. Informarea completă privind prelucrarea datelor se regăsește în{" "}
      <a href="/confidentialitate" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        Politica de confidențialitate
      </a>
      .
    </footer>
    </>
  )
}

function Article({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-xl font-medium text-foreground">
        Art. {n}. {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** Căsuța din formular corespunzătoare articolului — păstrăm textul identic cu eticheta din formular. */
function FormCheckbox({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm italic text-foreground print:bg-transparent">
      Căsuța din formular: „{children}&rdquo;
    </p>
  )
}
