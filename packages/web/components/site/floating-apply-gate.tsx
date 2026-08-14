import { auth } from "@/auth"
import { ApplicationsService } from "@fm/server"
import { FloatingApply } from "./floating-apply"

/**
 * Decide server-side dacă butonul flotant „Aplică" se arată:
 *  - vizitator neautentificat → da (nu a aplicat);
 *  - autentificat cu aplicație în ciornă / fără aplicație → da;
 *  - autentificat cu aplicație deja trimisă → nu.
 */
export async function FloatingApplyGate() {
  const session = await auth()
  const userId = session?.user?.id

  if (userId) {
    const app = await ApplicationsService.getForUser(userId)
    if (app && app.status !== "draft") return null // a aplicat deja
  }

  return <FloatingApply />
}
