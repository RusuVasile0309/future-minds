import { SITE_URL } from "@/lib/seo"

// llms.txt — ghid structurat pentru crawler-ele AI (ChatGPT, Perplexity, Claude,
// Google AI Overviews). Servit env-driven ca să rămână sincron cu URL-ul canonic.
export const dynamic = "force-static"

export function GET() {
  const body = `# FutureMinds

> FutureMinds este un program de burse care finanțează integral studiile universitare de IT și inginerie la Cluj-Napoca, pentru tineri talentați din medii defavorizate. Este un proiect susținut de Nova Power&Gas și Rotaract Cluj-Napoca (SAMVS).

## Pagini principale
- [Acasă](${SITE_URL}/): Prezentarea programului de burse FutureMinds și cum poți aplica.
- [Despre](${SITE_URL}/despre): Problema, soluția și obligațiile părților (beneficiari, Nova Power&Gas, Rotaract).
- [Bursa](${SITE_URL}/bursa): Ce acoperă bursa (~6.000 € pe an): taxe, cazare, masă, materiale, laptop, bani de buzunar.
- [Criterii de eligibilitate](${SITE_URL}/eligibilitate): Cine poate aplica — rezultate academice, situație financiară, implicare, zonă de proveniență, statut de student.
- [Întrebări frecvente](${SITE_URL}/intrebari-frecvente): Răspunsuri despre cine poate aplica, ce acoperă bursa, selecție și obligații.
- [Contact](${SITE_URL}/contact): Cum iei legătura cu echipa FutureMinds.

## Fapte cheie
- Bursa valorează aproximativ 6.000 € pe an, per bursier, și acoperă integral costul studiilor universitare.
- Acoperă: taxe de școlarizare, cazare în cămin, masă zilnică la cantină, materiale didactice, un laptop și bani de buzunar.
- Se adresează studenților de la specializări din IT și inginerie la Universitatea Babeș-Bolyai (UBB) și Universitatea Tehnică din Cluj-Napoca (UTCN).
- Beneficiarii mențin o medie minimă de 8.5 (cu maximum o restanță reportată între ani) și finalizează studiile în termen.
- Selecția se face transparent, pe baza criteriilor de eligibilitate și a recomandărilor cadrelor didactice de la UBB și UTCN.
- Program susținut financiar de Nova Power&Gas, cu identificarea și monitorizarea beneficiarilor realizată de Rotaract Cluj-Napoca (SAMVS).

## Contact
- Persoană de contact: Rusu Vasile
- Email: futuremindsburse@gmail.com
- Telefon: +40 742 043 505
`
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
