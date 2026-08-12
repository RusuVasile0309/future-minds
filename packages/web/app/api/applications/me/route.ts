import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ApplicationsService, FilesService, ApplicationError } from "@fm/server"
import { requireAuth } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Draft-ul propriu al elevului (îl creează dacă nu există), cu fișierele atașate.
export async function GET(): Promise<NextResponse<ApiResponse>> {
  const guard = await requireAuth()
  if (!guard.ok) return guard.response

  const application = await ApplicationsService.getOrCreateDraft(guard.userId)
  const files = await FilesService.listForApplication(application.id)
  return NextResponse.json({ success: true, data: { ...application, files } })
}

const saveSchema = z.object({ answers: z.record(z.string(), z.any()) })

// Salvare parțială (auto-save) a răspunsurilor.
export async function PUT(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const guard = await requireAuth()
  if (!guard.ok) return guard.response

  const parsed = saveSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Date invalide", code: 400 }, { status: 400 })
  }

  try {
    const application = await ApplicationsService.saveAnswers(guard.userId, parsed.data.answers)
    return NextResponse.json({ success: true, data: application })
  } catch (e) {
    const code = e instanceof ApplicationError ? e.code : 500
    return NextResponse.json({ success: false, error: (e as Error).message, code }, { status: code })
  }
}
