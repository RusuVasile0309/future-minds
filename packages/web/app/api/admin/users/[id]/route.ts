import { NextRequest, NextResponse } from "next/server"
import { AuthService } from "@fm/server"
import { requireRole, CAN_MUTATE } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Ștergerea unui utilizator (cascade pe aplicații/fișiere) — rezervată SUPER_USER.
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_MUTATE)
  if (!guard.ok) return guard.response

  if (params.id === guard.userId) {
    return NextResponse.json({ success: false, error: "Nu-ți poți șterge propriul cont", code: 400 }, { status: 400 })
  }

  await AuthService.deleteUser(params.id)
  return NextResponse.json({ success: true })
}
