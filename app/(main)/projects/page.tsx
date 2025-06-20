import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Eye,
  Star,
  ArrowRight,
} from "lucide-react";
import { getAllProjects, getFeaturedProjects } from "@/lib/projects";
import { ProjectsFilter } from "@/components/projects";

export default async function ProjectsPage() {
  // Récupération des données côté serveur
  const [projects, featuredProjects] = await Promise.all([
    getAllProjects(),
    getFeaturedProjects(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Mes{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Projets
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl md:text-2xl">
              {`Découvrez mes réalisations et projets techniques. Du développement frontend aux architectures fullstack, chaque projet reflète ma passion pour la technologie.`}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{projects.length} projets</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>{featuredProjects.length} en vedette</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Depuis 2022</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Composant client pour les filtres et l'affichage des projets */}
      <ProjectsFilter projects={projects} featuredProjects={featuredProjects} />

      {/* CTA Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {`Vous avez un projet en tête ?`}
              </h2>
              <p className="text-lg text-muted-foreground md:text-xl">
                {`Discutons ensemble de vos besoins et créons quelque chose d'exceptionnel.`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/contact">
                  {`Contactez-moi`}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href="/cv-matheuskopsguedes.pdf" target="_blank">
                  {`Télécharger mon CV`}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}