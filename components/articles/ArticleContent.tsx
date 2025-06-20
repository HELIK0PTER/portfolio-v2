import { Article } from "@prisma/client";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, User } from "lucide-react";
import Image from "next/image";

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Image de couverture */}
      {article.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
          <Image
            src={article.imageUrl}
            alt={article.title}
            className="object-cover w-full h-full"
            width={1200}
            height={675}
            priority
          />
        </div>
      )}

      {/* En-tête de l'article */}
      <header className="space-y-6 mb-8">
        {/* Catégorie */}
        {article.category && (
          <Badge variant="outline" className="text-sm">
            {article.category}
          </Badge>
        )}

        {/* Titre */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Métadonnées */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-b py-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : new Date(article.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{`${article.readTime} min de lecture`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{`${article.views} vues`}</span>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      {/* Contenu de l'article */}
      <div className="mb-8">
        <MarkdownRenderer content={article.content} />
      </div>

      {/* Pied d'article */}
      <footer className="border-t pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {article.featured && (
              <Badge variant="default">Article en vedette</Badge>
            )}
            <Badge variant="outline">
              Publié le{" "}
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("fr-FR")
                : new Date(article.createdAt).toLocaleDateString("fr-FR")}
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Dernière mise à jour :{" "}
            {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </footer>
    </article>
  );
} 