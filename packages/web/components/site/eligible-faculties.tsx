import { ChevronDown, GraduationCap } from "lucide-react";
import { STUDY_LANGUAGE_LABELS, UNIVERSITIES } from "@/lib/content/universities";

/**
 * Lista facultăților eligibile, grupate pe universitate. Fiecare facultate se
 * poate extinde (accordion nativ `<details>`, fără JS) pentru a arăta toate
 * specializările și limbile de studiu disponibile.
 *
 * Sursa de adevăr este `lib/content/universities.ts` (aceeași care alimentează
 * cascada din formular), deci lista rămâne sincronizată cu opțiunile reale.
 */
export function EligibleFaculties({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {UNIVERSITIES.map((uni) => (
        <div
          key={uni.code}
          className="overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:border-brand-light/60 hover:shadow-md"
        >
          <div className="flex items-center gap-3 border-b border-border p-6">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <GraduationCap className="size-5" />
            </span>
            <div>
              <p className="font-serif text-xl font-medium text-foreground">{uni.code}</p>
              <p className="text-sm text-muted-foreground">{uni.name}</p>
            </div>
          </div>

          <ul className="divide-y divide-border/60">
            {uni.faculties.map((f) => (
              <li key={f.name}>
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40">
                    <span>{f.name}</span>
                    <ChevronDown className="size-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <ul className="space-y-2.5 px-6 pb-5 pt-1 group-open:animate-slide-down">
                    {f.specializations.map((s) => (
                      <li key={s.name} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                        <span className="flex gap-2 text-foreground/90">
                          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
                          {s.name}
                        </span>
                        <span className="ml-3.5 flex flex-wrap gap-1">
                          {s.languages.map((l) => (
                            <span
                              key={l}
                              className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
                              title={STUDY_LANGUAGE_LABELS[l]}
                            >
                              {l}
                            </span>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
