import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { AuthService } from "@fm/server"
import { requireRole, CAN_MUTATE } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Schimbarea rolului = operație sensibilă, rezervată SUPER_USER.
const roleSchema = z.object({ role: z.enum(["STUDENT", "ADMIN", "SUPER_USER"]) })

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_MUTATE)
  if (!guard.ok) return guard.response

  // Nu-ți poți schimba propriul rol (evită să te blochezi în afara accesului).
  if (params.id === guard.userId) {
    return NextResponse.json({ success: false, error: "Nu-ți poți schimba propriul rol", code: 400 }, { status: 400 })
  }

  const parsed = roleSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0].message, code: 400 }, { status: 400 })
  }

  const user = await AuthService.updateUserRole(params.id, parsed.data.role)
  return NextResponse.json({ success: true, data: user })
}
