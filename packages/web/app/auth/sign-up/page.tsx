import Link from "next/link"
import type { Metadata } from "next"
import { AuthShell, GoogleGlyph } from "@/components/auth/auth-shell"
import { AuthDivider } from "@/components/auth/credentials-form"
import { SignUpWizard } from "@/components/auth/sign-up-wizard"
import { Button } from "@/components/ui/button"
import { googleSignUp } from "@/app/auth/actions"

export const metadata: Metadata = {
  title: "Creează cont",
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return (
    <AuthShell
      title="Creează-ți contul"
      subtitle="Un singur pas ca să începi aplicația la FutureMinds."
      footer={
        <>
          Ai deja cont?{" "}
          <Link href="/autentificare/intra" className="font-medium text-primary hover:underline">
            Autentifică-te
          </Link>
        </>
      }
    >
      <form action={googleSignUp}>
        <Button type="submit" variant="secondary" size="lg" className="w-full">
          <GoogleGlyph />
          Continuă cu Google
        </Button>
      </form>

      <AuthDivider />

      <SignUpWizard />

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Prin crearea contului ești de acord cu prelucrarea datelor în scopul evaluării candidaturii.
      </p>
    </AuthShell>
  )
}
