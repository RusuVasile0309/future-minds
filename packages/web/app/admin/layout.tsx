import Link from "next/link"
import { auth } from "@/auth"
import FutureMindsLogo from "@/components/FutureMindsLogo"
import { AdminNav } from "@/components/admin/admin-nav"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/auth/actions"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" aria-label="Panou admin" className="flex items-center gap-2">
              <FutureMindsLogo variant="mark" size={26} />
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Admin</span>
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
              Vezi site-ul
            </Link>
            <span className="hidden text-sm text-muted-foreground md:inline">{session?.user?.email}</span>
            <form action={signOutAction}>
              <Button type="submit" variant="secondary" size="sm">
                Ieșire
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-secondary/20">{children}</main>
    </div>
  )
}
