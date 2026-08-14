import type { Metadata } from "next"
import { auth } from "@/auth"
import { CandidateDetail } from "@/components/admin/candidate-detail"

export const metadata: Metadata = { title: "Detaliu candidat" }

export default async function AdminCandidatDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const canScore = session?.role === "SUPER_USER"

  return (
    <div className="container py-12">
      <CandidateDetail id={params.id} canScore={canScore} />
    </div>
  )
}
