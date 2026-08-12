import type { Metadata } from "next"
import Link from "next/link"
import { Users, Trophy, UserCog, Settings, ArrowRight } from "lucide-react"

export const metadata: Metadata = { title: "Panou admin" }

const CARDS = [
  {
    href: "/admin/candidati",
    icon: Users,
    title: "Candidați",
    body: "Vezi toate aplicațiile trimise, cu răspunsuri, documente și status de evaluare.",
    ready: true,
  },
  {
    href: "/admin/ranking",
    icon: Trophy,
    title: "Ranking",
    body: "Configurează ponderile, pragurile și departajările. Previzualizează și publică clasamentul.",
    ready: true,
  },
  {
    href: "/admin/utilizatori",
    icon: UserCog,
    title: "Utilizatori",
    body: "Gestionează conturile și rolurile (Student · Admin · Super user).",
    ready: true,
  },
  {
    href: "/admin/setari",
    icon: Settings,
    title: "Setări",
    body: "Fereastra de înscriere și cohorta curentă a programului.",
    ready: true,
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="container py-12">
      <p className="eyebrow">Portal admin</p>
      <h1 className="display-title mt-4 text-3xl sm:text-4xl">Panou de administrare</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        De aici gestionezi candidații și algoritmul de ranking. Formularul de înscriere are câmpuri
        fixe; doar ponderile de evaluare sunt configurabile.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => {
          const Card = (
            <div
              className={`h-full rounded-2xl border border-border bg-card p-7 transition-colors ${
                c.ready ? "hover:border-brand-light" : "opacity-70"
              }`}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <c.icon className="size-5" />
              </span>
              <h2 className="mt-5 flex items-center gap-2 font-serif text-xl font-medium">
                {c.title}
                {c.ready ? <ArrowRight className="size-4 text-primary" /> : null}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          )
          return c.ready ? (
            <Link key={c.href} href={c.href}>
              {Card}
            </Link>
          ) : (
            <div key={c.href}>{Card}</div>
          )
        })}
      </div>
    </div>
  )
}
