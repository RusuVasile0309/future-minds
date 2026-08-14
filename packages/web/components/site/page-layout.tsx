import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { FloatingApplyGate } from "@/components/site/floating-apply-gate"

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingApplyGate />
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string
  title: React.ReactNode
  lead?: string
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-[360px] w-[360px] animate-float rounded-full bg-brand-light/20 blur-3xl"
      />
      <div className="container relative py-16 md:py-20">
        <p className="eyebrow animate-fade-rise">{eyebrow}</p>
        <h1
          className="display-title mt-5 max-w-3xl animate-fade-rise text-4xl leading-[1.08] sm:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </h1>
        {lead ? (
          <p
            className="mt-6 max-w-2xl animate-fade-rise text-lg text-muted-foreground"
            style={{ animationDelay: "160ms" }}
          >
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  )
}
