import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

const AUTH_ROUTES = "/auth"
const PROTECTED_ROUTES = ["/apply", "/dashboard"]
const ADMIN_ROUTES = ["/admin"]

export default auth((req) => {
  const { nextUrl } = req
  const session = req.auth
  const isLoggedIn = !!session
  const isAuthRoute = nextUrl.pathname.startsWith(AUTH_ROUTES)
  const isProtected = PROTECTED_ROUTES.some((r) => nextUrl.pathname.startsWith(r))
  const isAdminRoute = ADMIN_ROUTES.some((r) => nextUrl.pathname.startsWith(r))

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Require login for protected pages
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/sign-in", nextUrl))
  }

  // Require ADMIN or SUPER_USER for /admin
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/sign-in", nextUrl))
    const role = session?.role
    if (role !== "ADMIN" && role !== "SUPER_USER") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
}
