import { NextRequest, NextResponse } from "next/server"
import { ApplicationsService } from "@fm/server"
import { requireRole, CAN_VIEW } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Detaliul unei aplicații: răspunsuri + schema de randare + fișiere + candidat.
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const detail = await ApplicationsService.getDetail(params.id)
  if (!detail) {
    return NextResponse.json({ success: false, error: "Aplicația nu există", code: 404 }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: detail })
}
