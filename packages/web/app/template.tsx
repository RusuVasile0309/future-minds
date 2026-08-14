"use client"

/**
 * Template-ul se remontează la fiecare navigare → un fade discret pe conținutul
 * paginii, ca tranzițiile client-side să nu se schimbe brusc. Doar opacitate
 * (fără transform) ca să nu afecteze header-ul `sticky`.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>
}
