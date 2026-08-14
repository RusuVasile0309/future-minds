import Link from "next/link"
import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Eroare de autentificare" }

const MESSAGES: Record<string, string> = {
  Configuration: "Configurarea autentificării nu este completă. Verifică cheile Google.",
  AccessDenied: "Accesul a fost refuzat. Nu ai permisiunea de a te autentifica.",
  Verification: "Linkul de verificare a expirat sau a fost deja folosit.",
  default: "A apărut o problemă la autentificare. Încearcă din nou.",
}

export default function AuthErrorPage({ searchParams }: { searchParams: { error?: string } }) {
  const message = MESSAGES[searchParams.error ?? "default"] ?? MESSAGES.default

  return (
    <AuthShell title="Ceva n-a mers">
      <p className="text-center text-sm text-muted-foreground">{message}</p>
      <Button asChild size="lg" className="mt-6 w-full">
        <Link href="/autentificare/intra">Înapoi la autentificare</Link>
      </Button>
    </AuthShell>
  )
}
