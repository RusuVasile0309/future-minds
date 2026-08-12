import type { Metadata } from "next"
import { auth } from "@/auth"
import { SettingsPanel } from "@/components/admin/settings-panel"

export const metadata: Metadata = { title: "Setări" }

export default async function AdminSetariPage() {
  const session = await auth()
  const canEdit = session?.role === "SUPER_USER"

  return (
    <div className="container py-12">
      <p className="eyebrow">Portal admin</p>
      <h1 className="display-title mt-4 text-3xl sm:text-4xl">Setări</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Controlează fereastra de înscriere și cohorta curentă a programului.
      </p>
      <div className="mt-10">
        <SettingsPanel canEdit={canEdit} />
      </div>
    </div>
  )
}
