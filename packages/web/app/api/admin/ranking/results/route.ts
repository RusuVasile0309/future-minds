import { NextRequest, NextResponse } from "next/server"
import { RankingService } from "@fm/server"
import { requireRole, CAN_VIEW } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Clasamentul candidaților. ?source=draft folosește config-ul de lucru (previzualizare),
// altfel versiunea activă publicată.
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const source = req.nextUrl.searchParams.get("source") === "draft" ? "draft" : "active"
  const data = await RankingService.getResults(source)
  return NextResponse.json({ success: true, data })
}
