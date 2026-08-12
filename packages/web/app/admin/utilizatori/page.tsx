import type { Metadata } from "next"
import { auth } from "@/auth"
import { UsersManager } from "@/components/admin/users-manager"

export const metadata: Metadata = { title: "Utilizatori" }

export default async function AdminUtilizatoriPage() {
  const session = await auth()
  const canManage = session?.role === "SUPER_USER"

  return (
    <div className="container py-12">
      <p className="eyebrow">Portal admin</p>
      <h1 className="display-title mt-4 text-3xl sm:text-4xl">Utilizatori</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Toți utilizatorii platformei. Un Super user poate schimba rolurile (Student · Admin · Super user) și
        poate șterge conturi.
      </p>
      <div className="mt-10">
        <UsersManager currentUserId={session?.user?.id ?? ""} canManage={canManage} />
      </div>
    </div>
  )
}
