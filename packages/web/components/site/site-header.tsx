import Link from "next/link"
import { GraduationCap } from "lucide-react"
import FutureMindsLogo from "@/components/FutureMindsLogo"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/site/user-menu"
import { StickyHeader } from "@/components/site/sticky-header"
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
    <StickyHeader>
      <Link href="/" aria-label="Acasă FutureMinds" className="shrink-0 transition-opacity hover:opacity-80">
        <FutureMindsLogo variant="horizontal" size={26} tagline={false} />
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative text-sm font-medium text-muted-foreground transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100"
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
              <Link href="/aplica">
                Vreau bursă <GraduationCap className="size-4" />
              </Link>
            </Button>
          </>
        )}
      </div>
    </StickyHeader>
  )
}
