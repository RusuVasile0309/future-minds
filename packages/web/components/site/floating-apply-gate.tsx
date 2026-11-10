import { auth } from "@/auth"
import { ApplicationsService } from "@fm/server"
import { getApplicationsOpen } from "@/lib/settings-cache"
import { FloatingApply } from "./floating-apply"

/**
 * Decide server-side dacă butonul flotant „Aplică" se arată:
 *  - înscrieri închise → nu (nu are unde trimite);
 *  - vizitator neautentificat → da (nu a aplicat);
 *  - autentificat cu aplicație în ciornă / fără aplicație → da;
 *  - autentificat cu aplicație deja trimisă → nu.
 */
export async function FloatingApplyGate() {
  if (!(await getApplicationsOpen())) return null // înscrieri închise

  const session = await auth()
  const userId = session?.user?.id

  if (userId) {
    const app = await ApplicationsService.getForUser(userId)
    if (app && app.status !== "draft") return null // a aplicat deja
  }

  return <FloatingApply />
}
