import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  HandCoins,
  Laptop,
  Home,
  Sparkles,
  MapPin,
  BadgeCheck,
  Users,
  CalendarDays,
  Building2,
  ArrowRight,
  Plus,
} from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { FloatingApplyGate } from "@/components/site/floating-apply-gate";
import { HomeSplash } from "@/components/site/home-splash";
import { Button } from "@/components/ui/button";
import { ApplyCta } from "@/components/site/apply-cta";
import { ApplyWindow } from "@/components/site/apply-window";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HomeSplash />
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
              <h1
                className="display-title mt-6 animate-fade-rise text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
                style={{ animationDelay: "80ms" }}
              >
                Ai capacitatea.
                <br />
                Noi îți dăm{" "}
                <em className="not-italic font-serif italic text-primary">
                  contextul
                </em>
                .
              </h1>
              <p
                className="mt-6 max-w-lg animate-fade-rise text-lg text-muted-foreground"
                style={{ animationDelay: "160ms" }}
              >
                FutureMinds acoperă integral studiile universitare (taxe,
                cazare, materiale și laptop) pentru tineri talentați cărora le
                lipsește sprijinul financiar. În această ediție se acordă 5
                burse, pentru studenți la UBB și UTCN din Cluj-Napoca.
              </p>
              <div
                className="mt-9 flex flex-col gap-3 animate-fade-rise sm:flex-row sm:flex-wrap sm:items-center"
                style={{ animationDelay: "240ms" }}
              >
                <ApplyCta size="lg" />
                <Button asChild size="lg" variant="secondary">
                  <Link href="/eligibilitate">Vezi criteriile</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/bursa">Ce oferă bursa →</Link>
                </Button>
              </div>
              <ApplyWindow className="mt-5 animate-fade-rise" />
            </div>

            {/* Card ilustrativ — ce acoperă bursa */}
            <div
              className="relative animate-fade-rise"
              style={{ animationDelay: "320ms" }}
            >
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Ce acoperă bursa
                </h2>
                <ul className="mt-5 space-y-4">
                  <CoverItem
                    icon={<GraduationCap className="size-5" />}
                    title="Taxe de studii"
                    note="Integral, pe 3-4 ani"
                    delay={420}
                  />
                  <CoverItem
                    icon={<Home className="size-5" />}
                    title="Cazare în cămin"
                    note="Pe toată durata studiilor"
                    delay={490}
                  />
                  <CoverItem
                    icon={<Laptop className="size-5" />}
                    title="Laptop & materiale"
                    note="Echipament + rechizite"
                    delay={560}
                  />
                  <CoverItem
                    icon={<HandCoins className="size-5" />}
                    title="Sprijin pentru trai"
                    note="Cheltuieli de zi cu zi"
                    delay={630}
                  />
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Parteneri (bandă albă) ───────────────────────── */}
        <section className="border-y border-border bg-white">
          {/* Mobil: 2 logouri/rând (rând 1: Nova + Rotaract, rând 2: UBB + UTCN).
              Desktop (md+): un singur rând, ordine UBB · Nova · Rotaract · UTCN via `md:order-*`. */}
          <Reveal className="container grid grid-cols-2 place-items-center gap-x-6 gap-y-8 pb-6 pt-[39px] md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-16 md:pb-7 md:pt-[43px]">
            <a
              href="https://vreaulanova.ro/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Nova Power&Gas"
              className="flex h-16 w-full items-center justify-center opacity-90 transition-opacity hover:opacity-100 md:order-2 md:block md:h-auto md:w-auto"
            >
              <Image
                src="/nova-logo.svg"
                alt="Nova Power&Gas"
                width={400}
                height={220}
                className="h-full w-full object-contain md:h-[84px] md:w-auto"
              />
            </a>
            <a
              href="https://www.instagram.com/rotaractsamvs/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rotaract Cluj-Napoca SAMVS"
              className="flex h-16 w-full items-center justify-center opacity-90 transition-opacity hover:opacity-100 md:order-3 md:block md:h-auto md:w-auto md:-translate-y-[15px]"
            >
              <Image
                src="/rac-logo.png"
                alt="Rotaract Cluj-Napoca SAMVS"
                width={1332}
                height={388}
                className="h-full w-full object-contain md:h-[96px] md:w-auto"
              />
            </a>
            <a
              href="https://www.ubbcluj.ro/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Universitatea Babeș-Bolyai"
              className="flex h-16 w-full items-center justify-center opacity-90 transition-opacity hover:opacity-100 md:order-1 md:block md:h-auto md:w-auto"
            >
              <Image
                src="/ubb-logo.png"
                alt="Universitatea Babeș-Bolyai"
                width={2000}
                height={1014}
                className="h-full w-full object-contain md:h-[96px] md:w-auto"
              />
            </a>
            <a
              href="https://www.utcluj.ro/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Universitatea Tehnică din Cluj-Napoca"
              className="flex h-16 w-full items-center justify-center opacity-90 transition-opacity hover:opacity-100 md:order-4 md:block md:h-auto md:w-auto"
            >
              <Image
                src="/utcn-logo.svg"
                alt="Universitatea Tehnică din Cluj-Napoca"
                width={649}
                height={424}
                className="h-full w-full object-contain md:h-[96px] md:w-auto"
              />
            </a>
          </Reveal>
        </section>

        {/* ── Despre: cine suntem (rezumat /despre) ─────────── */}
        <section className="border-t border-border">
          <div className="container py-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <Reveal>
                <p className="eyebrow">Despre proiect</p>
                <h2 className="display-title mt-4 max-w-xl text-3xl sm:text-4xl">
                  Potențialul nu așteaptă{" "}
                  <span className="text-primary">permisiune</span>.
                </h2>
                <p className="mt-6 max-w-xl text-muted-foreground">
                  Există o diferență clară între potențialul academic al unor
                  tineri din medii defavorizate și posibilitățile lor reale de
                  a-și continua studiile. FutureMinds identifică tinerii cu
                  competențe reale pentru IT și inginerie și le acoperă integral
                  studiile, cu obiectivul integrării profesionale la Nova
                  Power&Gas.
                </p>
                <Button asChild variant="secondary" className="mt-8">
                  <Link href="/despre">
                    Despre proiect <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </Reveal>

              <Reveal delay={100} className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <AboutFact
                  icon={<Users className="size-5" />}
                  value="Din 2015"
                  label="Proiect al clubului Rotaract SAMVS Cluj-Napoca"
                />
                <AboutFact
                  icon={<Building2 className="size-5" />}
                  value="Nova Power&Gas"
                  label="Finanțează bursele și oferă stagii și angajare"
                />
                <AboutFact
                  icon={<Sparkles className="size-5" />}
                  value="200.000+ membri"
                  label="Rotaract, comunitate internațională din familia Rotary"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Bursa: valoare (rezumat /bursa) ───────────────── */}
        <section className="border-t border-border bg-secondary/30">
          <div className="container py-20">
            <Reveal>
              <p className="eyebrow">Bursa FutureMinds</p>
              <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-4xl">
                O bursă care acoperă{" "}
                <span className="text-primary">tot ce ai nevoie</span>.
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Nu doar taxele: bursa îți acoperă traiul complet ca student, ca
                să te poți concentra pe studii și pe viitorul tău.
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                icon={<HandCoins className="size-5" />}
                value="6.000 €"
                label="pe an, per bursier"
              />
              <Stat
                icon={<BadgeCheck className="size-5" />}
                value="5 burse"
                label="acordate în această ediție"
              />
              <Stat
                icon={<CalendarDays className="size-5" />}
                value="3-4 ani"
                label="pe toată durata licenței"
              />
              <Stat
                icon={<GraduationCap className="size-5" />}
                value="UBB & UTCN"
                label="specializări IT și inginerie"
              />
            </Reveal>

            <Reveal delay={200} className="mt-8">
              <Button asChild variant="secondary">
                <Link href="/bursa">
                  Ce include bursa <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </section>

        {/* ── Cum funcționează ─────────────────────────────── */}
        <section className="border-t border-border">
          <div className="container py-20">
            <Reveal>
              <p className="eyebrow">Cum funcționează</p>
              <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-4xl">
                De la formular la <span className="text-primary">bursă</span>.
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
                  body="Candidații sunt evaluați după criterii clare (rezultate, situație financiară, implicare) și clasați transparent."
                />
              </Reveal>
              <Reveal delay={200} className="h-full">
                <Step
                  n="03"
                  title="Studii acoperite"
                  body="Bursierii primesc finanțare integrală, îndrumare din partea Rotaract și oportunități de muncă în cadrul companiei Nova Power&Gas."
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Eligibilitate: criterii (rezumat /eligibilitate) ─ */}
        <section className="border-t border-border bg-secondary/30">
          <div className="container py-20">
            <Reveal>
              <p className="eyebrow">Criterii de eligibilitate</p>
              <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-4xl">
                Sprijinim tineri{" "}
                <span className="text-primary">motivați și serioși</span>.
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground">
                Selecția se face pe baza recomandărilor cadrelor didactice,
                ținând cont de cinci criterii principale. Nu trebuie să le bifezi
                perfect pe toate — contează imaginea de ansamblu.
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Criterion icon={<GraduationCap className="size-5" />} title="Rezultate academice" />
              <Criterion icon={<HandCoins className="size-5" />} title="Situație financiară" />
              <Criterion icon={<Sparkles className="size-5" />} title="Interese și implicare" />
              <Criterion icon={<MapPin className="size-5" />} title="Zona de proveniență" />
              <Criterion icon={<BadgeCheck className="size-5" />} title="Statut de student bugetat" />
              <Link
                href="/eligibilitate"
                className="group flex items-center justify-between gap-3 rounded-xl border border-brand-light/60 bg-card p-4 text-sm font-medium text-primary transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Vezi toate criteriile
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── Întrebări frecvente (rezumat /intrebari-frecvente) ─ */}
        <section className="border-t border-border">
          <div className="container py-20">
            <Reveal>
              <p className="eyebrow">Întrebări frecvente</p>
              <h2 className="display-title mt-4 max-w-2xl text-3xl sm:text-4xl">
                Ai o întrebare?{" "}
                <span className="text-primary">Probabil e aici.</span>
              </h2>
            </Reveal>

            <Reveal delay={100} className="mt-10 max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
              {HOME_FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group px-6 py-5 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-secondary/30 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-serif text-lg font-medium text-foreground">
                    {item.q}
                    <Plus className="size-5 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground group-open:animate-slide-down">
                    {item.a}
                  </p>
                </details>
              ))}
            </Reveal>

            <Reveal delay={200} className="mt-8 max-w-3xl">
              <Button asChild variant="secondary">
                <Link href="/intrebari-frecvente">
                  Toate întrebările <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <FloatingApplyGate />
    </div>
  );
}

const HOME_FAQ = [
  {
    q: "Cine poate aplica?",
    a: "Studenți la specializări de IT sau inginerie de la UBB și UTCN din Cluj-Napoca, care provin din medii defavorizate și au nevoie de sprijin financiar. Contează rezultatele academice, situația financiară, implicarea și zona de proveniență.",
  },
  {
    q: "Ce acoperă bursa?",
    a: "Studiile universitare pe 3-4 ani: taxe de școlarizare, cazare în cămin, materiale didactice, laptop, precum și sprijin pentru cheltuielile de trai.",
  },
  {
    q: "La ce universități se aplică programul?",
    a: "Programul se adresează studenților de la specializări din IT și inginerie de la Universitatea Babeș-Bolyai (UBB) și de la Universitatea Tehnică din Cluj-Napoca (UTCN).",
  },
  {
    q: "Ce obligații am ca beneficiar?",
    a: "Menținerea unei medii minime de 8.5 (cu maximum o restanță reportată între ani), finalizarea studiilor în termen, o conduită corespunzătoare și acceptarea oportunităților de stagiu sau angajare la Nova Power&Gas.",
  },
];

function CoverItem({
  icon,
  title,
  note,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  delay?: number;
}) {
  return (
    <li
      className="flex animate-fade-rise items-center gap-4"
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-sm text-muted-foreground">{note}</span>
      </span>
    </li>
  );
}

function AboutFact({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        {icon}
      </span>
      <div>
        <p className="font-serif text-lg font-medium text-foreground">{value}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-light/60 hover:shadow-md">
      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
        {icon}
      </span>
      <p className="mt-5 font-serif text-3xl font-medium text-brand-deep dark:text-primary">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Criterion({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand-light/60 hover:shadow-md">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <span className="font-medium text-foreground">{title}</span>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="h-full rounded-2xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-light/60 hover:shadow-md">
      <span className="font-mono text-sm text-primary">{n}</span>
      <h3 className="mt-3 font-serif text-xl font-medium text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
