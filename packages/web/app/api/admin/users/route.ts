import { NextResponse } from "next/server"
import { AuthService } from "@fm/server"
import { requireRole, CAN_VIEW } from "@/lib/api-auth"
import type { ApiResponse } from "@fm/shared"

// Lista tuturor utilizatorilor — ambele roluri de admin pot vedea.
export async function GET(): Promise<NextResponse<ApiResponse>> {
  const guard = await requireRole(CAN_VIEW)
  if (!guard.ok) return guard.response

  const users = await AuthService.getAllUsers()
  return NextResponse.json({ success: true, data: users })
}
