import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { SettingsService } from "@fm/server"
import { requireRole, CAN_VIEW, CAN_MUTATE } from "@/lib/api-auth"
import type { ApiResponse, AdminSettings } from "@fm/shared"

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const data: AdminSettings = {
    applicationsOpen: await SettingsService.getApplicationsOpen(),
    currentCohort: await SettingsService.getCurrentCohort(),
  }
  return NextResponse.json({ success: true, data })
}

// Setările globale (fereastra de înscriere, cohorta curentă) — modificare SUPER_USER.
const settingsSchema = z.object({
  applicationsOpen: z.boolean().optional(),
  currentCohort: z.string().trim().min(1).max(20).optional(),
})

export async function PUT(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_MUTATE)
  if (!guard.ok) return guard.response

  const parsed = settingsSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0].message, code: 400 }, { status: 400 })
  }

  if (parsed.data.applicationsOpen !== undefined) {
    await SettingsService.setApplicationsOpen(parsed.data.applicationsOpen)
  }
  if (parsed.data.currentCohort !== undefined) {
    await SettingsService.setCurrentCohort(parsed.data.currentCohort)
  }

  const data: AdminSettings = {
    applicationsOpen: await SettingsService.getApplicationsOpen(),
    currentCohort: await SettingsService.getCurrentCohort(),
  }
  return NextResponse.json({ success: true, data })
}
