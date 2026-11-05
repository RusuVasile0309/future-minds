import Image from "next/image"
import Link from "next/link"
import FutureMindsLogo from "@/components/FutureMindsLogo"
import { UserMenu } from "@/components/site/user-menu"
import { NavMenu } from "@/components/site/nav-menu"
import { StickyHeader } from "@/components/site/sticky-header"
import { auth } from "@/auth"

const LOGO_SIZE = 30
// Logo Nova: 1.1× înălțimea wordmark-ului pe mobil/tabletă (≈33px) și încă 1.1×
// pe ecran mare (≈36px). Înălțimile sunt aplicate prin clase Tailwind literale
// (`h-[33px]` / `lg:h-[36px]`) — JIT-ul nu poate genera clase interpolate dinamic.
const NOVA_SIZE = Math.round(LOGO_SIZE * 1.1) // 33
const NOVA_SIZE_LG = Math.round(NOVA_SIZE * 1.1) // 36
const NOVA_RATIO = 400 / 220.35 // ≈ 1.815

const NAV = [
  { href: "/", label: "Acasă" },
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
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href="/"
          aria-label="Acasă FutureMinds"
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <FutureMindsLogo variant="horizontal" size={LOGO_SIZE} tagline={false} />
        </Link>

        <span className="flex items-center gap-2 border-l border-border pl-3 sm:pl-4 lg:gap-[13px]">
          <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline">
            powered by
          </span>
          <Image
            src="/nova-logo.svg"
            alt="Nova Power & Gas"
            height={NOVA_SIZE_LG}
            width={Math.round(NOVA_SIZE_LG * NOVA_RATIO)}
            className="h-[33px] w-auto lg:h-[36px]"
            priority
          />
        </span>
      </div>

      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <UserMenu
            name={user.name ?? user.email ?? "Contul meu"}
            email={user.email ?? ""}
            image={user.image ?? null}
            isAdmin={isAdmin}
          />
        ) : null}
        <NavMenu items={NAV} isLoggedIn={isLoggedIn} />
      </div>
    </StickyHeader>
  )
}
