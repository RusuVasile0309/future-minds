import Link from "next/link"
import { GraduationCap, Lock } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { getApplicationsOpen } from "@/lib/settings-cache"
import { cn } from "@/lib/utils"

/**
 * CTA-ul de aplicare („Vreau bursă"), partajat de paginile publice.
 *
 * Reflectă fereastra de înscriere controlată din admin:
 *  - deschisă → link către formular, marcat `data-apply-cta` (butonul flotant
 *    îl urmărește, vezi FloatingApply);
 *  - închisă → buton inactiv „Înscrieri închise", fără link și fără
 *    `data-apply-cta` (butonul flotant nu se mai afișează — vezi FloatingApplyGate).
 *
 * Server component: citește starea cache-uită (tag `app-settings`), așa că nu
 * adaugă un query la DB pe fiecare randare.
 */
export async function ApplyCta({
  size = "lg",
  className,
}: {
  size?: ButtonProps["size"]
  className?: string
}) {
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
