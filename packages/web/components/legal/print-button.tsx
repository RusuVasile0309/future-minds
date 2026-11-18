"use client"

import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Buton care deschide dialogul de printare al browserului — de aici utilizatorul
 * poate salva documentul ca PDF („Save as PDF"). Ascuns la printare (`print:hidden`),
 * ca să nu apară în PDF-ul rezultat.
 */
export function PrintButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="secondary"
      className={`print:hidden ${className ?? ""}`}
      onClick={() => window.print()}
    >
      <Printer className="size-4" />
      Descarcă / Printează PDF
    </Button>
  )
}
