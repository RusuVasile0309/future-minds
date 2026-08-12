import type { ApiResponse } from "@fm/shared"

const BASE_URL =
  typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export async function apiRequest<T = void>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    // Pentru FormData lăsăm browser-ul să seteze Content-Type (cu boundary).
    const isFormData = typeof FormData !== "undefined" && options?.body instanceof FormData
    const baseHeaders: HeadersInit = isFormData ? {} : { "Content-Type": "application/json" }
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { ...baseHeaders, ...options?.headers },
    })
    const data = (await res.json()) as ApiResponse<T>
    return data
  } catch {
    return { success: false, error: "Eroare de rețea", code: 0 }
  }
}
