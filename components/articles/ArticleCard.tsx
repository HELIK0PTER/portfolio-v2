"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Clock, Eye } from "lucide-react";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  author: string;
  publishedAt: Date;
  readTime: number;
  views: number;
  category: string;
  tags: string[];
  imageUrl: string | null;
  featured: boolean;
  isPublished: boolean;
}

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured" | "compact";
  showActions?: boolean;
  showStats?: boolean;
  showCategory?: boolean;
  showDate?: boolean;
  className?: string;
}

export default function ArticleCard({
  article,
  variant = "default",
  showActions = true,
  showStats = false,
  showCategory = false,
  showDate = false,
  className = "",
}: ArticleCardProps) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <Card
      className={`pt-0 group overflow-hidden border-1 shadow-md hover:shadow-lg transition-all duration-300 ${
        isFeatured ? "shadow-lg hover:shadow-xl" : ""
      } ${className}`}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFeatured && (
            <Badge className="bg-primary/90 backdrop-blur-sm">⭐ Vedette</Badge>
          )}
          {showCategory && (
            <Badge variant="outline" className="bg-background/80">
              {article.category}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          {showStats && (
            <Badge
              variant="secondary"
              className="backdrop-blur-sm"
            >
              <Eye className="h-3 w-3 mr-1" />
              {article.views}
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle
            className={`group-hover:text-primary transition-colors duration-300 ${
              isCompact ? "text-lg" : "text-xl"
            }`}
          >
            {article.title}
          </CardTitle>
          {showDate && (
            <span className="text-xs text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
            </span>
          )}
        </div>
        <CardDescription
          className={`leading-relaxed ${isCompact ? "text-sm" : "text-base"}`}
        >
          {article.excerpt}
        </CardDescription>
        
        {/* Article metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(article.publishedAt).toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{`${article.readTime} min de lecture`}</span>
          </div>
          {showStats && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{article.views} vues</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, isCompact ? 2 : 3).map((tag: string) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-medium"
            >
              {tag}
            </Badge>
          ))}
          {article.tags.length > (isCompact ? 2 : 3) && (
            <Badge variant="outline" className="text-xs">
              +{article.tags.length - (isCompact ? 2 : 3)}
            </Badge>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              {isAdmin ? (
              <Link
                href={`/admin/articles/${article.id}`}
              >
                  {isCompact ? "Voir" : "Voir l'article"}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              ) : (
                <Link href={`/articles/${article.slug}`}>
                {isCompact ? "Lire" : "Lire l'article"}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}