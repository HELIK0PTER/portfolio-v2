import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Nouvel Article | Admin",
  description: "Rédiger un nouvel article de blog",
};

export default async function NewArticlePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/articles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {`Retour aux articles`}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{`Nouvel Article`}</h1>
            <p className="text-muted-foreground">
              {`Rédiger un nouvel article pour votre blog`}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">
              {`Éditeur d'articles en développement`}
            </h2>
            <p className="text-muted-foreground mb-6">
              {`L'éditeur d'articles sera bientôt disponible avec un éditeur markdown avancé, upload d'images et gestion des métadonnées.`}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/admin/articles">
                <Button>{`Liste des articles`}</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">{`Retour au dashboard`}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 