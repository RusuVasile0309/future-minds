import Link from "next/link"
import type { Metadata } from "next"
import { AuthShell, GoogleGlyph } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { googleSignUp } from "@/app/auth/actions"

export const metadata: Metadata = { title: "Creează cont" }

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string; email?: string }
}) {
  const noAccount = searchParams.error === "no_account"

  return (
    <AuthShell
      title="Creează-ți contul"
      subtitle="Un singur pas ca să începi aplicația la FutureMinds."
      footer={
        <>
          Ai deja cont?{" "}
          <Link href="/auth/sign-in" className="font-medium text-primary hover:underline">
            Autentifică-te
          </Link>
        </>
      }
    >
      {noAccount ? (
        <p className="mb-5 rounded-lg border border-brand-light/60 bg-secondary px-4 py-3 text-sm text-brand-deep">
          Nu am găsit un cont
          {searchParams.email ? ` pentru ${searchParams.email}` : ""}. Creează unul mai jos.
        </p>
      ) : null}

      <form action={googleSignUp}>
        <Button type="submit" variant="secondary" size="lg" className="w-full">
          <GoogleGlyph />
          Continuă cu Google
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Prin crearea contului ești de acord cu prelucrarea datelor în scopul evaluării candidaturii.
      </p>
    </AuthShell>
  )
}
