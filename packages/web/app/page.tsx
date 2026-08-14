import Link from "next/link"
import { GraduationCap, HandCoins, Laptop, Home } from "lucide-react"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { Reveal } from "@/components/site/reveal"
import { FloatingApplyGate } from "@/components/site/floating-apply-gate"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] animate-float rounded-full bg-brand-light/25 blur-3xl"
          />
          <div className="container relative grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
            <div>
              <p className="eyebrow inline-flex animate-fade-rise items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Bursă integrală · Specializări IT &amp; Inginerie la UBB și UTCN
              </p>
              <h1
                className="display-title mt-6 animate-fade-rise text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
                style={{ animationDelay: "80ms" }}
              >
                Ai capacitatea.
                <br />
                Noi îți dăm{" "}
                <em className="not-italic font-serif italic text-primary">contextul</em>.
              </h1>
              <p
                className="mt-6 max-w-lg animate-fade-rise text-lg text-muted-foreground"
                style={{ animationDelay: "160ms" }}
              >
                FutureMinds acoperă integral studiile universitare (taxe, cazare, materiale și laptop) pentru
                tineri talentați din medii defavorizate, cu integrare profesională la Nova Power&Gas la final.
              </p>
              <div
                className="mt-9 flex flex-wrap items-center gap-3 animate-fade-rise"
                style={{ animationDelay: "240ms" }}
              >
                <Button asChild size="lg">
                  <Link href="/aplica" data-apply-cta>
                    Vreau bursă <GraduationCap className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/eligibilitate">Vezi criteriile</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/bursa">Ce oferă bursa →</Link>
                </Button>
              </div>
            </div>

            {/* Card ilustrativ — ce acoperă bursa */}
            <div className="relative animate-fade-rise" style={{ animationDelay: "320ms" }}>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Ce acoperă bursa
                </h2>
                <ul className="mt-5 space-y-4">
                  <CoverItem icon={<GraduationCap className="size-5" />} title="Taxe de studii" note="Integral, pe 3-4 ani" delay={420} />
                  <CoverItem icon={<Home className="size-5" />} title="Cazare în cămin" note="Pe toată durata studiilor" delay={490} />
                  <CoverItem icon={<Laptop className="size-5" />} title="Laptop & materiale" note="Echipament + rechizite" delay={560} />
                  <CoverItem icon={<HandCoins className="size-5" />} title="Sprijin pentru trai" note="Cheltuieli de zi cu zi" delay={630} />
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Cum funcționează ─────────────────────────────── */}
        <section className="border-t border-border bg-secondary/30">
          <div className="container py-20">
            <Reveal>
              <p className="eyebrow">Cum funcționează</p>
              <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-4xl">
                De la aplicație la primul <span className="text-primary">commit</span>.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Reveal delay={0} className="h-full">
                <Step
                  n="01"
                  title="Aplici online"
                  body="Completezi formularul de înscriere cu rezultatele academice, situația ta și motivația. Poți reveni oricând să-l editezi."
                />
              </Reveal>
              <Reveal delay={100} className="h-full">
                <Step
                  n="02"
                  title="Evaluare & selecție"
                  body="Candidații sunt evaluați după criterii clare (rezultate, nevoie financiară, implicare) și clasați transparent."
                />
              </Reveal>
              <Reveal delay={200} className="h-full">
                <Step
                  n="03"
                  title="Studii acoperite"
                  body="Bursierii primesc finanțare integrală, îndrumare din partea Rotaract și oportunități la Nova Power&Gas."
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Parteneri ────────────────────────────────────── */}
        <section className="border-t border-border">
          <Reveal className="container flex flex-col items-center gap-6 py-14 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Un proiect susținut de
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-medium text-foreground/80">
              <a
                href="https://vreaulanova.ro/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                Nova Power&amp;Gas
              </a>
              <span className="text-border">·</span>
              <a
                href="https://www.facebook.com/RotaractSamvsCluj/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                Rotaract Cluj-Napoca SAMVS
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
      <FloatingApplyGate />
    </div>
  )
}

function CoverItem({
  icon,
  title,
  note,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  note: string
  delay?: number
}) {
  return (
    <li className="flex animate-fade-rise items-center gap-4" style={delay ? { animationDelay: `${delay}ms` } : undefined}>
      <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">{icon}</span>
      <span className="flex flex-col">
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{note}</span>
      </span>
    </li>
  )
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-light/60 hover:shadow-md">
      <span className="font-mono text-sm text-primary">{n}</span>
      <h3 className="mt-3 font-serif text-xl font-medium text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}
