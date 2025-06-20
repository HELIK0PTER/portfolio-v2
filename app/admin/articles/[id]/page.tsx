import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getArticleById } from "@/lib/articles";
import Image from "next/image";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

interface AdminArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminArticlePage({
  params,
}: AdminArticlePageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/articles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {`Retour aux articles`}
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/admin/articles/${article.id}/edit`}>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                {`Éditer`}
              </Button>
            </Link>
            <Link href={`/articles/${article.slug}`} target="_blank" prefetch={false}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                {`Voir en ligne`}
              </Button>
            </Link>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              {`Supprimer`}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image de couverture */}
            {article.imageUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>{`Image de couverture`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      width={800}
                      height={450}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contenu */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <CardTitle className="text-2xl">{article.title}</CardTitle>
                    <p className="text-muted-foreground">{article.excerpt}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tags */}
                <div>
                  <h4 className="font-semibold mb-2">{`Tags`}</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Contenu */}
                <div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <MarkdownRenderer content={article.content || "Aucun contenu défini."} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations */}
            <Card>
              <CardHeader>
                <CardTitle>{`Informations`}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{`${article.readTime} min de lecture`}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span>{article.views.toLocaleString()} vues</span>
                </div>
              </CardContent>
            </Card>

            {/* Statut */}
            <Card>
              <CardHeader>
                <CardTitle>{`Statut`}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{`Publié`}</span>
                  <Badge variant={article.isPublished ? "default" : "secondary"}>
                    {article.isPublished ? "Oui" : "Non"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{`En vedette`}</span>
                  <Badge variant={article.featured ? "default" : "secondary"}>
                    {article.featured ? "Oui" : "Non"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>{`Actions rapides`}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-2" />
                    {`Éditer l'article`}
                  </Button>
                </Link>
                <Link
                  href={`/articles/${article.slug}`}
                  target="_blank"
                  className="block"
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    {`Voir en ligne`}
                  </Button>
                </Link>
                <Button variant="destructive" className="w-full justify-start">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {`Supprimer`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
