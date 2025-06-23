import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { ImageReady } from "@/components/ui/ImageReady";
import { startTransition } from "react";
import { Project } from "@prisma/client";

export const metadata: Metadata = {
  title: "Détail Projet | Admin",
  description: "Détail d'un projet (admin)",
};

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const { slug } = await params;
  const project : Project | null = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    notFound();
  }

  async function handleDelete() {
    startTransition(async () => {
      const res = await fetch(`/api/admin/projects/${project?.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        redirect("/admin/projects");
      } else {
        alert("Erreur lors de la suppression du projet");
      }
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {`Retour à la liste`}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          {project.featured && <Badge className="ml-2">{`Vedette`}</Badge>}
          {!project.isPublished && (
            <Badge variant="secondary" className="ml-2">{`Brouillon`}</Badge>
          )}
          <div className="ml-auto flex gap-2">
            <Link href={`/admin/projects/${project.id}/edit`}>
              <Button variant="secondary" size="sm">{`Modifier`}</Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              type="submit"
              onClick={handleDelete}
            >
              {`Supprimer`}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image principale */}
            {project.imageUrl && (
              <div>
                <h2 className="text-xl font-semibold mb-4">{`Image principale`}</h2>
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full max-w-2xl h-auto object-cover rounded-lg border shadow"
                  width={800}
                  height={450}
                />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold mb-2">{`Description`}</h2>
              <p className="text-muted-foreground mb-4">
                {project.description}
              </p>
              <h3 className="text-lg font-medium mb-1">{`Description longue`}</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {project.longDescription}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">{`Fonctionnalités principales`}</h3>
              <ul className="list-disc ml-6 space-y-1">
                {project.features.map((feature: string, i: number) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">{`Images supplémentaires`}</h3>
              <div className="flex flex-wrap gap-4">
                {project.images.map((img: string, i: number) => (
                  <ImageReady
                    key={i}
                    src={img}
                    alt={project.title}
                    className="w-40 h-24 object-cover rounded border-2 border-gray-300"
                    width={800}
                    height={800}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-2">{`Informations`}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">{`Catégorie:`}</span>{" "}
                  {project.category}
                </div>
                <div>
                  <span className="font-medium">{`Statut:`}</span>{" "}
                  {project.status}
                </div>
                <div>
                  <span className="font-medium">{`Année:`}</span> {project.date}
                </div>
                <div>
                  <span className="font-medium">{`Durée:`}</span>{" "}
                  {project.duration}
                </div>
                <div>
                  <span className="font-medium">{`Client:`}</span>{" "}
                  {project.client}
                </div>
                <div>
                  <span className="font-medium">{`Créé le:`}</span>{" "}
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">{`Modifié le:`}</span>{" "}
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-2">{`Technologies`}</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-2">{`Tags`}</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {project.liveUrl && (
                <Button asChild className="w-full">
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {`Voir en ligne`}
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full">
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  {`Voir sur GitHub`}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
