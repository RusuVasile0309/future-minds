import { NextResponse } from "next/server"
import { ApplicationsService } from "@fm/server"
import { requireRole, CAN_VIEW } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Lista candidaților (cohorta curentă, fără draft-uri) — ambele roluri de admin.
export async function GET(): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const applications = await ApplicationsService.listAll()
  return NextResponse.json({ success: true, data: applications })
}
