import { NextRequest, NextResponse } from "next/server"
import { ApplicationsService, FilesService, ALLOWED_DOC_TYPES, StorageError } from "@fm/server"
import { requireAuth } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

export const runtime = "nodejs"

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

// Upload document pentru un câmp de tip fișier din aplicația proprie.
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const guard = await requireAuth()
  if (!guard.ok) return guard.response

  const form = await req.formData().catch(() => null)
  const file = form?.get("file")
  const fieldKey = (form?.get("fieldKey") as string | null)?.trim()

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: "Niciun fișier trimis.", code: 400 }, { status: 400 })
  }
  if (!fieldKey) {
    return NextResponse.json({ success: false, error: "Lipsește câmpul țintă.", code: 400 }, { status: 400 })
  }
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: `Tip nepermis. Acceptate: ${ALLOWED_DOC_TYPES.join(", ")}`, code: 400 },
      { status: 400 }
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ success: false, error: "Fișierul e prea mare (max 10 MB).", code: 400 }, { status: 400 })
  }

  try {
    const application = await ApplicationsService.getOrCreateDraft(guard.userId)
    if (application.status !== "draft") {
      return NextResponse.json({ success: false, error: "Aplicația a fost deja trimisă.", code: 409 }, { status: 409 })
    }
    const bytes = await file.arrayBuffer()
    const record = await FilesService.attach(application.id, fieldKey, {
      data: bytes,
      contentType: file.type,
      fileName: file.name,
      size: file.size,
    })
    return NextResponse.json({ success: true, data: record })
  } catch (e) {
    if (e instanceof StorageError) {
      return NextResponse.json({ success: false, error: e.message, code: e.code }, { status: e.code })
    }
    throw e
  }
}
