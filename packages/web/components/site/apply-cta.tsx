import Link from "next/link"
import { GraduationCap, Lock, FileText } from "lucide-react"
import { auth } from "@/auth"
import { ApplicationsService } from "@fm/server"
import { Button, type ButtonProps } from "@/components/ui/button"
import { getApplicationsOpen } from "@/lib/settings-cache"
import { cn } from "@/lib/utils"

/**
 * CTA-ul de aplicare, partajat de paginile publice. Decide server-side ce afișează:
 *  - autentificat cu aplicație deja trimisă (status ≠ draft) → „Vezi aplicație",
 *    link către contul meu (mereu accesibil, inclusiv când înscrierile sunt închise);
 *  - altfel, dacă înscrierile sunt deschise → „Vreau bursă" către formular, marcat
 *    `data-apply-cta` (butonul flotant îl urmărește, vezi FloatingApply);
 *  - altfel (închise, fără aplicație) → buton inactiv „Înscrieri închise".
 *
 * Query la DB doar pentru utilizatorii autentificați; vizitatorii anonimi trec
 * direct pe starea cache-uită a ferestrei de înscriere (tag `app-settings`).
 */
export async function ApplyCta({
  size = "lg",
  className,
}: {
  size?: ButtonProps["size"]
  className?: string
}) {
  const session = await auth()
  const userId = session?.user?.id

  // A trimis deja aplicația → o poate vizualiza, indiferent de fereastra de înscriere.
  if (userId) {
    const app = await ApplicationsService.getForUser(userId)
    if (app && app.status !== "draft") {
      return (
        <Button asChild size={size} className={className}>
          <Link href="/contul-meu">
            Vezi aplicație <FileText className="size-4" />
          </Link>
        </Button>
      )
    }
  }

  const open = await getApplicationsOpen()

  if (!open) {
    return (
      <Button
        type="button"
        size={size}
        variant="secondary"
        disabled
        aria-disabled
        className={cn("cursor-not-allowed", className)}
      >
        Înscrieri închise <Lock className="size-4" />
      </Button>
    )
  }

  return (
    <Button asChild size={size} className={className}>
      <Link href="/aplica" data-apply-cta>
        Vreau bursă <GraduationCap className="size-4" />
      </Link>
    </Button>
  )
}
