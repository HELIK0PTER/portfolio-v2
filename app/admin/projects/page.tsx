import { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAllProjectsAdmin } from "@/lib/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Projets | Admin",
  description: "Gestion des projets du portfolio (admin)",
  alternates: {
    canonical: new URL(
      "/admin/projects",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
};

export default async function AdminProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }

  const projects = await getAllProjectsAdmin();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{`Gestion des Projets`}</h1>
            <p className="text-muted-foreground">{`Visualisez, éditez ou supprimez vos projets depuis cette interface d'administration.`}</p>
          </div>
          <Link href="/admin/projects/new">
            <Button size="lg">{`Nouveau Projet`}</Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">{`Aucun projet pour le moment.`}</p>
              <Link href="/admin/projects/new">
                <Button className="mt-4">{`Créer un projet`}</Button>
              </Link>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="compact"
                showActions={true}
                showStatus={true}
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
