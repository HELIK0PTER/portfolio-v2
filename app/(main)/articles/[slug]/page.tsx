import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Eye, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getArticleBySlug } from "@/lib/articles";
import { prisma } from "@/lib/prisma";
import { ViewIncrementer, ViewTracker } from "@/components/articles";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article non trouvé",
    };
  }

  return {
    title: `${article.title} | Blog`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <ViewIncrementer slug={slug} />
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/articles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {`Retour aux articles`}
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          {/* Image de couverture */}
          {article.imageUrl && (
            <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={1200}
                height={630}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {/* Métadonnées */}
          <div className="space-y-6 mb-8">
            {/* Catégorie */}
            <div>
              <Badge variant="outline" className="text-sm">
                {article.category}
              </Badge>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>

            {/* Informations article */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
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
                <ViewTracker slug={slug} />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <Separator />
          </div>

          {/* Contenu de l'article */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{article.content}</div>

            {/* Message temporaire pour le contenu */}
            <div className="bg-muted/50 rounded-lg p-8 text-center my-8">
              <h3 className="text-lg font-semibold mb-4">
                {`Contenu en cours de rédaction`}
              </h3>
              <p className="text-muted-foreground">
                {`Cet article est actuellement en cours de rédaction. Le contenu complet sera bientôt disponible avec des exemples de code détaillés et des explications approfondies.`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  {`Partager`}
                </Button>
              </div>

              <div className="flex gap-3">
                <Link href="/articles">
                  <Button variant="outline">{`Autres articles`}</Button>
                </Link>
                <Link href="/contact">
                  <Button>{`Contactez-moi`}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  try {
    // Récupérer tous les slugs des articles publiés pour la génération statique
    const articles = await prisma.article.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });

    return articles.map((article) => ({
      slug: article.slug,
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la génération des paramètres statiques:",
      error
    );
    return [];
  }
}
