import Link from "next/link"
import type { Metadata } from "next"
import { AuthShell, GoogleGlyph } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { googleSignIn } from "@/app/auth/actions"

export const metadata: Metadata = { title: "Autentificare" }

export default function SignInPage() {
  return (
    <AuthShell
      title="Bine ai revenit"
      subtitle="Autentifică-te ca să-ți continui aplicația."
      footer={
        <>
          Nu ai încă un cont?{" "}
          <Link href="/autentificare/inregistrare" className="font-medium text-primary hover:underline">
            Creează unul
          </Link>
        </>
      }
    >
      <form action={googleSignIn}>
        <Button type="submit" variant="secondary" size="lg" className="w-full">
          <GoogleGlyph />
          Continuă cu Google
        </Button>
      </form>
    </AuthShell>
  )
}
