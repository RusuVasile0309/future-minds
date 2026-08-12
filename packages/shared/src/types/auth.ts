// Roluri de acces în FutureMinds.
// STUDENT     — elevul/studentul care aplică (rol implicit la înregistrare)
// ADMIN       — poate vedea datele candidaților și edita (formular, status)
// SUPER_USER  — în plus, operații distructive: publicare config ranking,
//               ștergere câmpuri, schimbare roluri, ștergere useri
export type UserRole = "STUDENT" | "ADMIN" | "SUPER_USER"

export interface User {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  role: UserRole
  firstName: string | null
  lastName: string | null
  phone: string | null
  createdAt: Date
}

export interface RefreshToken {
  id: string
  token: string
  userId: string
  expiresAt: Date
}

export interface VerificationToken {
  identifier: string
  token: string
  expires: Date
}

// Shape uniform al răspunsurilor API (ca în rem-transilvania).
export type ApiSuccess<T> = { success: true; data?: T }
export type ApiError = { success: false; error: string; code: number }
export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError
