import { NextResponse } from "next/server"
import { RankingService } from "@fm/server"
import { requireRole, CAN_VIEW } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const versions = await RankingService.listVersions()
  return NextResponse.json({ success: true, data: versions })
}
