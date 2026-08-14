import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ApplicationsService, ApplicationError } from "@fm/server"
import { requireRole, CAN_MUTATE } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Notele scrisorilor = evaluare subiectivă rezervată SUPER_USER-ului.
const score = z.number().int().min(1).max(3).nullable()
const scoresSchema = z.object({
  coverLetterScore: score,
  recommendationLetterScore: score,
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_MUTATE)
  if (!guard.ok) return guard.response

  const parsed = scoresSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0].message, code: 400 }, { status: 400 })
  }

  try {
    const app = await ApplicationsService.setLetterScores(params.id, parsed.data)
    return NextResponse.json({ success: true, data: app })
  } catch (e) {
    const code = e instanceof ApplicationError ? e.code : 500
    return NextResponse.json({ success: false, error: (e as Error).message, code }, { status: code })
  }
}
