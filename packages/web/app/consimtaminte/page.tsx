import type { Metadata } from "next"
import Link from "next/link"
import { PrintButton } from "@/components/legal/print-button"
import { ConsentDocumentBody } from "@/components/legal/consent-document-body"

export const metadata: Metadata = {
  title: "Declarație de consimțământ și de luare la cunoștință",
  description:
    "Declarația de consimțământ și de luare la cunoștință privind prelucrarea datelor cu caracter personal în cadrul programului de burse sociale FutureMinds, conform Regulamentului (UE) 2016/679.",
  alternates: { canonical: "/consimtaminte" },
  // Anexă a formularului; informarea completă trăiește în /confidentialitate,
  // deci o ținem în afara indexării ca să nu concureze cu ea.
  robots: { index: false, follow: true },
}

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
          <ConsentDocumentBody />
        </article>
      </div>
    </div>
  )
}
