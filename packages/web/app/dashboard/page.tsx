import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { auth } from "@/auth"
import { ApplicationsService } from "@fm/server"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/apply/status-badge"
import { signOutAction } from "@/app/auth/actions"

export const metadata: Metadata = { title: "Contul meu" }

const ROLE_LABEL: Record<string, string> = {
  STUDENT: "Candidat",
  ADMIN: "Administrator",
  SUPER_USER: "Administrator principal",
}

// Câmpuri pre-completate automat din cont — nu contează drept „date introduse".
const AUTO_PREFILLED_KEYS = new Set(["email", "phone"])

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  return false
}

// `true` dacă aplicația are cel puțin un răspuns completat de candidat.
function hasApplicantData(answers: Record<string, unknown>): boolean {
  return Object.entries(answers).some(
    ([key, value]) => !AUTO_PREFILLED_KEYS.has(key) && !isEmptyValue(value)
  )
}

export default async function DashboardPage() {
  const session = await auth()
  const name = session?.user?.name?.split(" ")[0] ?? "candidat"
  const role = session?.role ?? "STUDENT"
  const isAdmin = role === "ADMIN" || role === "SUPER_USER"
  const application = session?.user?.id ? await ApplicationsService.getForUser(session.user.id) : null
  const isDraft = !application || application.status === "draft"
  // „Date inserate" = răspunsuri introduse de candidat, excluzând pre-completarea
  // automată din cont (email/telefon) și valorile goale.
  const started = isDraft && application ? hasApplicantData(application.answers) : false

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="container max-w-3xl py-16">
          <p className="eyebrow">Contul meu</p>
          <h1 className="display-title mt-4 text-3xl sm:text-4xl">Salut, {name}.</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{session?.user?.email}</span>
            <span className="text-border">·</span>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 font-mono text-xs uppercase tracking-wide text-brand-deep">
              {ROLE_LABEL[role]}
            </span>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-xl font-medium">Aplicația ta</h2>
              {application ? <StatusBadge status={application.status} /> : null}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {!isDraft
                ? "Aplicația ta a fost trimisă. O poți vizualiza, dar nu o mai poți edita."
                : started
                  ? "Reia formularul de unde ai rămas. Îl poți edita oricând cât timp înscrierile sunt deschise."
                  : "Completează formularul de înscriere în mai mulți pași. Îl poți edita oricând cât timp înscrierile sunt deschise."}
            </p>
            <Button asChild className="mt-5">
              <Link href="/aplica">
                {!isDraft ? "Vezi aplicația" : started ? "Continuă aplicația" : "Începe aplicația"}{" "}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {isAdmin ? (
            <div className="mt-6 rounded-2xl border border-brand-light/60 bg-secondary/50 p-7">
              <h2 className="font-serif text-xl font-medium">Portal admin</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ai acces la portalul de administrare: candidați, formular și ranking.
              </p>
              <Button asChild variant="secondary" className="mt-5">
                <Link href="/admin">Deschide portalul</Link>
              </Button>
            </div>
          ) : null}

          <form action={signOutAction} className="mt-10">
            <Button type="submit" variant="ghost" size="sm">
              Deconectare
            </Button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
