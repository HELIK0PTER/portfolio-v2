import { ReactNode } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/AdminHeader"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    redirect("/login")
  }
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={session.user} />
      <main>{children}</main>
    </div>
  )
} 