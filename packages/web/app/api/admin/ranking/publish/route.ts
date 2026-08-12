import { NextResponse } from "next/server"
import { RankingService, RankingError } from "@fm/server"
import { requireRole, CAN_MUTATE } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Publicarea unei versiuni de ranking = operație rezervată SUPER_USER.
export async function POST(): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_MUTATE)
  if (!guard.ok) return guard.response

  try {
    const version = await RankingService.publish(guard.userId)
    return NextResponse.json({ success: true, data: version })
  } catch (e) {
    const code = e instanceof RankingError ? e.code : 500
    return NextResponse.json({ success: false, error: (e as Error).message, code }, { status: code })
  }
}
