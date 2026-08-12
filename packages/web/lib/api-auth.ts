import { NextResponse } from "next/server"
import { auth } from "@/auth"
import type { ApiResponse, UserRole } from "@fm/shared"

// Citirea back-office-ului (candidați, aplicații) e deschisă ambelor roluri de admin.
// Operațiile distructive / de publicare sunt doar pentru SUPER_USER — un ADMIN vede
// aceleași ecrane, dar nu poate acționa asupra lor.
export const CAN_VIEW: readonly UserRole[] = ["ADMIN", "SUPER_USER"]
export const CAN_MUTATE: readonly UserRole[] = ["SUPER_USER"]

type Guard<T> =
  | { ok: true; userId: string; role: UserRole }
  | { ok: false; response: NextResponse<ApiResponse<T>> }

export async function requireRole<T = void>(roles: readonly UserRole[]): Promise<Guard<T>> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ success: false, error: "Neautentificat", code: 401 }, { status: 401 }),
    }
  }

  if (!roles.includes(session.role)) {
    return {
      ok: false,
      response: NextResponse.json({ success: false, error: "Acces interzis", code: 403 }, { status: 403 }),
    }
  }

  return { ok: true, userId: session.user.id, role: session.role }
}

// Doar autentificare (orice rol) — pentru rutele elevului asupra propriilor date.
export async function requireAuth<T = void>(): Promise<Guard<T>> {
  return requireRole<T>(["STUDENT", "ADMIN", "SUPER_USER"])
}
