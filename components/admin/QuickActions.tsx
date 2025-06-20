import Link from "next/link"
import { FolderPlus, FileText, Settings, Eye } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Nouveau Projet",
      description: "Ajouter un nouveau projet au portfolio",
      href: "/admin/projects/new",
      icon: FolderPlus,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Nouvel Article",
      description: "Rédiger un nouvel article de blog",
      href: "/admin/articles/new",
      icon: FileText,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Voir le Site",
      description: "Consulter le portfolio public",
      href: "/",
      icon: Eye,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Paramètres",
      description: "Configurer les paramètres du site",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{`Actions Rapides`}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.title} href={action.href}>
              <div className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 