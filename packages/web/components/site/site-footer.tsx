import Link from "next/link"
import FutureMindsLogo from "@/components/FutureMindsLogo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <FutureMindsLogo variant="horizontal" size={24} />
          <p className="text-sm text-muted-foreground">
            Un program de burse care finanțează integral studiile universitare de IT și inginerie pentru
            tineri talentați din medii defavorizate.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <FooterCol
            title="Program"
            links={[
              { href: "/despre", label: "Despre" },
              { href: "/eligibilitate", label: "Eligibilitate" },
              { href: "/bursa", label: "Bursa" },
            ]}
          />
          <FooterCol
            title="Aplică"
            links={[
              { href: "/aplica", label: "Formular de înscriere" },
              { href: "/autentificare/intra", label: "Autentificare" },
              { href: "/intrebari-frecvente", label: "Întrebări frecvente" },
            ]}
          />
          <FooterCol
            title="Parteneri"
            links={[
              { href: "https://vreaulanova.ro/", label: "Nova Power&Gas", external: true },
              { href: "https://www.facebook.com/RotaractSamvsCluj/", label: "Rotaract Cluj-Napoca", external: true },
            ]}
          />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} FutureMinds. Toate drepturile rezervate.</span>
          <span className="font-mono uppercase tracking-[0.2em]">educație · acces · viitor</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string; external?: boolean }[]
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/70">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
