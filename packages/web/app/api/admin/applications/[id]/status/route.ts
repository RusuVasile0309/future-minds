import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ApplicationsService, ApplicationError } from "@fm/server"
import { requireRole, CAN_VIEW } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Schimbarea statusului = operație de evaluare (edit), permisă ambelor roluri de admin.
const statusSchema = z.object({
  status: z.enum(["submitted", "under_review", "accepted", "rejected", "waitlist"]),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const parsed = statusSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0].message, code: 400 }, { status: 400 })
  }

  try {
    const app = await ApplicationsService.updateStatus(params.id, parsed.data.status)
    return NextResponse.json({ success: true, data: app })
  } catch (e) {
    const code = e instanceof ApplicationError ? e.code : 500
    return NextResponse.json({ success: false, error: (e as Error).message, code }, { status: code })
  }
}
