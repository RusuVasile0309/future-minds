import { NextRequest, NextResponse } from "next/server"
import { FilesService, StorageError } from "@fm/server"
import { requireAuth } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// URL semnat pentru a descărca propriul document.
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const guard = await requireAuth()
  if (!guard.ok) return guard.response

  const owner = await FilesService.ownerOf(params.id)
  if (owner !== guard.userId) {
    return NextResponse.json({ success: false, error: "Acces interzis", code: 403 }, { status: 403 })
  }

  try {
    const url = await FilesService.signedUrl(params.id)
    if (!url) return NextResponse.json({ success: false, error: "Fișierul nu există", code: 404 }, { status: 404 })
    return NextResponse.json({ success: true, data: { url } })
  } catch (e) {
    const code = e instanceof StorageError ? e.code : 500
    return NextResponse.json({ success: false, error: (e as Error).message, code }, { status: code })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const guard = await requireAuth()
  if (!guard.ok) return guard.response

  const owner = await FilesService.ownerOf(params.id)
  if (owner !== guard.userId) {
    return NextResponse.json({ success: false, error: "Acces interzis", code: 403 }, { status: 403 })
  }

  await FilesService.remove(params.id)
  return NextResponse.json({ success: true })
}
