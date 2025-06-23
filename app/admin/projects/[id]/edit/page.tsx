import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditProjectForm } from "@/components/admin/EditProjectForm";

export const metadata: Metadata = {
  title: "Éditer Projet | Admin",
  description: "Édition d'un projet (admin)",
};

export default async function AdminProjectEditPage({
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

  const project = await prisma.project.findUnique({
    where: { id: id },
  });
  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/admin/projects/${project.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {`Annuler`}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">{`Éditer le projet`}</h1>
        </div>
        <EditProjectForm
          initialProject={{
            ...project,
            liveUrl: project.liveUrl ?? "",
            githubUrl: project.githubUrl ?? "",
            imageUrl: project.imageUrl ?? "",
          }}
        />
      </main>
    </div>
  );
}
