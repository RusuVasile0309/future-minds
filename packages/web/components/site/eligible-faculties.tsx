import { GraduationCap } from "lucide-react";
import { UNIVERSITIES } from "@/lib/content/universities";

/**
 * Lista facultăților eligibile, grupate pe universitate. Sursa de adevăr este
 * `lib/content/universities.ts` (aceeași care alimentează cascada din formular),
 * deci lista rămâne sincronizată cu opțiunile reale de înscriere.
 */
export function EligibleFaculties({ className = "" }: { className?: string }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {UNIVERSITIES.map((uni) => (
        <div
          key={uni.code}
          className="rounded-2xl border border-border bg-card p-7 transition duration-300 hover:border-brand-light/60 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
              <GraduationCap className="size-5" />
            </span>
            <div>
              <p className="font-serif text-xl font-medium text-foreground">{uni.code}</p>
              <p className="text-sm text-muted-foreground">{uni.name}</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2.5">
            {uni.faculties.map((f) => (
              <li key={f.name} className="flex gap-2.5 text-sm text-foreground/90">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <span>{f.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
