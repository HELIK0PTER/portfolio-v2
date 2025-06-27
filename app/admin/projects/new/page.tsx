import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewProjectForm } from "@/components/admin/NewProjectForm";

export const metadata: Metadata = {
  title: "Nouveau Projet | Admin",
  description: "Ajouter un nouveau projet au portfolio",
  alternates: {
    canonical: new URL(
      "/admin/projects/new",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
};

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {`Retour à la liste`}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">{`Nouveau Projet`}</h1>
        </div>
        <NewProjectForm />
      </div>
    </div>
  );
}
