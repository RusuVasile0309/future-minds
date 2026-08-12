import type { Metadata } from "next"
import { CandidateTable } from "@/components/admin/candidate-table"

export const metadata: Metadata = { title: "Candidați" }

export default function AdminCandidatiPage() {
  return (
    <div className="container py-12">
      <p className="eyebrow">Portal admin</p>
      <h1 className="display-title mt-4 text-3xl sm:text-4xl">Candidați</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Toate aplicațiile trimise pentru cohorta curentă. Deschide un candidat pentru a-i vedea răspunsurile,
        documentele și pentru a-i schimba statusul de evaluare.
      </p>
      <div className="mt-10">
        <CandidateTable />
      </div>
    </div>
  )
}
