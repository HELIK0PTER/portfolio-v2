import { FolderOpen, FileText, Briefcase, TrendingUp } from "lucide-react"

interface AdminStatsProps {
  stats: {
    projects: number
    articles: number
    services: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statItems = [
    {
      title: "Projets",
      value: stats.projects,
      icon: FolderOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Articles",
      value: stats.articles,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Services",
      value: stats.services,
      icon: Briefcase,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Total",
      value: stats.projects + stats.articles + stats.services,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.title} className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 