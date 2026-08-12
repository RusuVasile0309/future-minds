import { NextResponse } from "next/server"
import { ApplicationsService, ApplicationError } from "@fm/server"
import { requireAuth } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

export async function POST(): Promise<NextResponse<ApiResponse>> {
  const guard = await requireAuth()
  if (!guard.ok) return guard.response

  try {
    const application = await ApplicationsService.submit(guard.userId)
    return NextResponse.json({ success: true, data: application })
  } catch (e) {
    const code = e instanceof ApplicationError ? e.code : 500
    return NextResponse.json({ success: false, error: (e as Error).message, code }, { status: code })
  }
}
