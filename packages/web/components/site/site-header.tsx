import Link from "next/link"
import FutureMindsLogo from "@/components/FutureMindsLogo"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/site/user-menu"
import { auth } from "@/auth"

const NAV = [
  { href: "/despre", label: "Despre" },
  { href: "/eligibilitate", label: "Eligibilitate" },
  { href: "/bursa", label: "Bursă" },
  { href: "/intrebari-frecvente", label: "Întrebări" },
]

export async function SiteHeader() {
  const session = await auth()
  const user = session?.user
  const isLoggedIn = !!user
  const role = session?.role ?? "STUDENT"
  const isAdmin = role === "ADMIN" || role === "SUPER_USER"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" aria-label="Acasă — FutureMinds" className="shrink-0">
          <FutureMindsLogo variant="horizontal" size={26} tagline={false} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <UserMenu
              name={user.name ?? user.email ?? "Contul meu"}
              email={user.email ?? ""}
              image={user.image ?? null}
              isAdmin={isAdmin}
            />
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/autentificare/intra">Autentificare</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/aplica">Aplică acum</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
