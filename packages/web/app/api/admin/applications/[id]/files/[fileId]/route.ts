import { NextRequest, NextResponse } from "next/server"
import { FilesService } from "@fm/server"
import { requireRole, CAN_VIEW } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// URL semnat (GET temporar) către un fișier din bucketul privat.
// Verificăm că fișierul aparține chiar aplicației din rută (evită enumerarea).
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; fileId: string } }
): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const file = await FilesService.getById(params.fileId)
  if (!file || file.applicationId !== params.id) {
    return NextResponse.json({ success: false, error: "Fișierul nu există", code: 404 }, { status: 404 })
  }

  const url = await FilesService.signedUrl(params.fileId)
  if (!url) {
    return NextResponse.json({ success: false, error: "Fișierul nu există", code: 404 }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: { url } })
}
