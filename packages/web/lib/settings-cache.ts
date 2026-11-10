import { unstable_cache, revalidateTag } from "next/cache"
import { SettingsService } from "@fm/server"

// Starea „fereastra de înscriere" e citită pe paginile publice (butoanele de
// aplicare). O cache-uim cu un tag ca să nu lovim DB-ul la fiecare randare și o
// invalidăm explicit când adminul schimbă setarea (vezi revalidateAppSettings).
export const APP_SETTINGS_TAG = "app-settings"

export const getApplicationsOpenCached = unstable_cache(
  async () => SettingsService.getApplicationsOpen(),
  ["applications-open"],
  { tags: [APP_SETTINGS_TAG], revalidate: 300 }
)

/** De apelat după orice modificare a setărilor globale din admin. */
export function revalidateAppSettings(): void {
  revalidateTag(APP_SETTINGS_TAG)
}
