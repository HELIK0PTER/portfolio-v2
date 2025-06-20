import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllArticlesAdmin, type Article } from "@/lib/articles";
import { ArticleCard } from "@/components/articles";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Articles | Admin",
  description: "Gestion des articles du blog (admin)",
};

export default async function AdminArticlesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const articles = await getAllArticlesAdmin();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{`Gestion des Articles`}</h1>
            <p className="text-muted-foreground">{`Visualisez, éditez ou supprimez vos articles depuis cette interface d'administration.`}</p>
          </div>
          <Link href="/admin/articles/new">
            <Button size="lg">{`Nouvel Article`}</Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">{`Aucun article pour le moment.`}</p>
              <Link href="/admin/articles/new">
                <Button className="mt-4">{`Créer un article`}</Button>
              </Link>
            </div>
          ) : (
            articles.map((article: Article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="compact"
                showActions={true}
                showStats={true}
                showCategory={true}
                showDate={true}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
} 