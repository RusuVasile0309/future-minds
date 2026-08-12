import type { Metadata } from "next"
import { CandidateDetail } from "@/components/admin/candidate-detail"

export const metadata: Metadata = { title: "Detaliu candidat" }

export default function AdminCandidatDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-12">
      <CandidateDetail id={params.id} />
    </div>
  )
}
