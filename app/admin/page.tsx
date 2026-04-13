import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

import { AdminStats } from "@/components/admin/AdminStats"
import { QuickActions } from "@/components/admin/QuickActions"
import { RecentItems } from "@/components/admin/RecentItems"

export const metadata: Metadata = {
  title: "Dashboard Admin | Portfolio",
  description: "Interface d'administration du portfolio",
}

async function getAdminData() {
  try {
    const [
      projectsCount,
      servicesCount,
      recentProjects,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          isPublished: true,
        },
      }),
    ])

    return {
      stats: {
        projects: projectsCount,
        services: servicesCount,
      },
      recentProjects,
    }
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    
    // Données par défaut en cas d'erreur de connexion
    return {
      stats: {
        projects: 0,
        services: 0,
      },
      recentProjects: [],
    }
  }
}

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const data = await getAdminData()

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {`Dashboard Admin`}
          </h1>
          <p className="text-muted-foreground">
            {`Gérez votre portfolio depuis cette interface`}
          </p>
        </div>

        {/* Statistiques */}
        <AdminStats stats={data.stats} />

        {/* Actions rapides */}
        <QuickActions />

        {/* Éléments récents */}
        <RecentItems 
          recentProjects={data.recentProjects}
        />
      </main>
    </div>
  )
} 