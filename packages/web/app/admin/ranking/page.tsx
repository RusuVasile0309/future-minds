import type { Metadata } from "next"
import { RankingManager } from "@/components/admin/ranking/ranking-manager"

export const metadata: Metadata = { title: "Ranking" }

export default function AdminRankingPage() {
  return (
    <div className="container py-12">
      <p className="eyebrow">Portal admin</p>
      <h1 className="display-title mt-4 text-3xl sm:text-4xl">Algoritm de ranking</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Definește cum se punctează candidații — ponderi, direcții, praguri de eligibilitate și departajări.
        Previzualizează clasamentul, apoi publică o versiune pentru a-l fixa.
      </p>
      <div className="mt-10">
        <RankingManager />
      </div>
    </div>
  )
}
