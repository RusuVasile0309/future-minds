import Link from "next/link"
import { ArrowLeft, GraduationCap } from "lucide-react"
import FutureMindsLogo from "@/components/FutureMindsLogo"
import { Button } from "@/components/ui/button"

// Pagina 404 personalizată (brand FutureMinds) — randată pentru orice rută
// inexistentă, ca să evităm ecranul implicit de eroare.
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] animate-float rounded-full bg-brand-light/20 blur-3xl"
      />

      <div className="relative w-full max-w-lg">
        <Link href="/" aria-label="Acasă FutureMinds" className="inline-flex">
          <FutureMindsLogo variant="stacked" size={44} />
        </Link>

        <p className="eyebrow mt-10">Eroare 404</p>
        <h1 className="display-title mt-4 text-5xl sm:text-6xl">Pagina nu a fost găsită</h1>
        <p className="mx-auto mt-5 max-w-md text-muted-foreground">
          Se pare că pagina pe care o cauți a fost mutată sau nu există. Verifică adresa sau întoarce-te la
          pagina principală.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="size-4" /> Înapoi acasă
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/bursa">
              <GraduationCap className="size-4" /> Vezi bursa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
