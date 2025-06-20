import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye, EyeOff, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface RecentProject {
  id: string
  title: string
  status: string
  createdAt: Date
  isPublished: boolean
}

interface RecentArticle {
  id: string
  slug: string
  title: string
  createdAt: Date
  isPublished: boolean
}

interface RecentItemsProps {
  recentProjects: RecentProject[]
  recentArticles: RecentArticle[]
}

export function RecentItems({ recentProjects, recentArticles }: RecentItemsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Projets récents */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{`Projets Récents`}</h2>
          <Link 
            href="/admin/projects"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {`Voir tout`}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentProjects.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {`Aucun projet pour le moment`}
            </p>
          ) : (
            recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{project.title}</h3>
                    {project.isPublished ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.status === "Terminé" ? "default" : "secondary"}>
                      {project.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(project.createdAt), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </span>
                  </div>
                </div>
                <Link 
                  href={`/admin/projects/${project.id}`}
                  className="text-primary hover:underline text-sm"
                >
                  {`Modifier`}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Articles récents */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{`Articles Récents`}</h2>
          <Link 
            href="/admin/articles"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {`Voir tout`}
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentArticles.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {`Aucun article pour le moment`}
            </p>
          ) : (
            recentArticles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{article.title}</h3>
                    {article.isPublished ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(article.createdAt), { 
                      addSuffix: true, 
                      locale: fr 
                    })}
                  </span>
                </div>
                <Link 
                  href={`/admin/articles/${article.slug}`}
                  className="text-primary hover:underline text-sm"
                >
                  {`Modifier`}
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 