import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { NewArticleForm } from "@/components/admin/NewArticleForm";

export const metadata: Metadata = {
  title: "Nouvel Article | Admin",
  description: "Rédiger un nouvel article de blog",
  alternates: {
    canonical: new URL(
      "/admin/articles/new",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
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
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/articles">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {`Annuler`}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">{`Créer un nouvel article`}</h1>
        </div>
        <NewArticleForm />
      </main>
    </div>
  );
}