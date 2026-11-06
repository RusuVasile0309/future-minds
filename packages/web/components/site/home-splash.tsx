import SplashScreen from "@/components/site/splash-screen"

/**
 * Animația de intro de pe pagina principală. Markup-ul este randat și pe server
 * (ca overlay-ul să acopere pagina ÎNAINTE de primul paint — fără flash). Dacă
 * trebuie sau nu să ruleze se decide înainte de paint de scriptul inline din
 * `layout.tsx` (atributul `data-splash="show"`), o singură dată per sesiune.
 */
export function HomeSplash() {
  return <SplashScreen minDuration={1500} />
}
