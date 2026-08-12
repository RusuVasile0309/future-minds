import Link from "next/link"
import FutureMindsLogo from "@/components/FutureMindsLogo"
import { Button } from "@/components/ui/button"

const NAV = [
  { href: "/despre", label: "Despre" },
  { href: "/eligibilitate", label: "Eligibilitate" },
  { href: "/bursa", label: "Bursă" },
  { href: "/faq", label: "Întrebări" },
]

export function SiteHeader() {
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
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/auth/sign-in">Autentificare</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/apply">Aplică acum</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
