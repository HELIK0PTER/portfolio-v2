import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditArticleForm } from "@/components/admin/EditArticleForm";

export const metadata: Metadata = {
  title: "Éditer Article | Admin",
  description: "Édition d'un article (admin)",
};

export default async function AdminArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
  });
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/admin/articles/${article.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {`Annuler`}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">{`Éditer l'article`}</h1>
        </div>
        <EditArticleForm initialArticle={article} />
      </main>
    </div>
  );
} 