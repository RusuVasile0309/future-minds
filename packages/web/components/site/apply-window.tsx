import { CalendarDays } from "lucide-react"
import { getApplicationsOpen } from "@/lib/settings-cache"
import { cn } from "@/lib/utils"
import { APPLICATION_DEADLINE_LABEL, SCHOLARSHIPS_THIS_EDITION } from "@/lib/content/timeline"

/**
 * Linia de termen afișată lângă CTA-ul de aplicare: „Înscrieri deschise până pe
 * [dată] · N burse". Apare DOAR cât timp fereastra de înscriere e deschisă (altfel
 * ar induce în eroare). Un singur read din cache-ul de setări (tag `app-settings`).
 */
export async function ApplyWindow({ className }: { className?: string }) {
  if (!(await getApplicationsOpen())) return null
  return (
    <p className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <CalendarDays className="size-4 shrink-0 text-primary" />
      <span>
        Înscrieri deschise până pe{" "}
        <strong className="font-medium text-foreground">{APPLICATION_DEADLINE_LABEL}</strong> ·{" "}
        {SCHOLARSHIPS_THIS_EDITION} burse
      </span>
    </p>
  )
}
