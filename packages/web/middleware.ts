import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

// Rutele publice sunt în română (folderele din `app/` rămân în engleză —
// vezi maparea din next.config.js). Middleware rulează după redirects și
// înainte de rewrites, deci vede întotdeauna URL-ul românesc.
const AUTH_ROUTES = "/autentificare"
const PROTECTED_ROUTES = ["/aplica", "/contul-meu"]
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
    return NextResponse.redirect(new URL("/contul-meu", nextUrl))
  }

  // Require login for protected pages. Pe `/aplica`, un vizitator nelogat vine
  // de regulă prima dată („Vreau bursă") — îl ducem la înregistrare, nu la login
  // (login-ul rămâne pentru cei care revin). Restul rutelor protejate (contul meu)
  // presupun un cont existent, deci merg la login.
  if (isProtected && !isLoggedIn) {
    const dest = nextUrl.pathname.startsWith("/aplica")
      ? "/autentificare/inregistrare"
      : "/autentificare/intra"
    return NextResponse.redirect(new URL(dest, nextUrl))
  }

  // Require ADMIN or SUPER_USER for /admin
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/autentificare/intra", nextUrl))
    const role = session?.role
    if (role !== "ADMIN" && role !== "SUPER_USER") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  // Rulează DOAR pe rutele care au nevoie de sesiune (auth + protejate + admin).
  // Important: paginile publice (`/`, `/despre`, `/bursa`, `/eligibilitate`,
  // `/intrebari-frecvente`, `/contact`) nu mai trec prin middleware, așa că nu
  // mai primesc cookie-urile Auth.js (CSRF / callback-url) și pot fi cache-uite
  // la edge de Vercel (TTFB mai mic, fără cookie-uri către crawleri).
  matcher: ["/autentificare/:path*", "/aplica/:path*", "/contul-meu/:path*", "/admin/:path*"],
}
