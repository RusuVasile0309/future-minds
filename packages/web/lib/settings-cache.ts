import { SettingsService } from "@fm/server"

// Starea „fereastra de înscriere" e citită la request-time pe paginile publice
// (butoanele de aplicare). O citim direct din DB: paginile care o folosesc devin
// dinamice (randare per-request), ceea ce reflectă imediat modificările din admin.
//
// NB: nu folosim `unstable_cache` aici — driverul Neon face fetch cu `no-store`,
// incompatibil cu scope-ul de caching al lui `unstable_cache` (aruncă
// DYNAMIC_SERVER_USAGE la prerender-ul static din build).
export async function getApplicationsOpen(): Promise<boolean> {
  return SettingsService.getApplicationsOpen()
}
