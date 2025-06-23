"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Project } from "@prisma/client";
import ProjectCard from "@/components/projects/ProjectCard";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "../ui/skeleton";
import { getFeaturedProjectsAction } from "@/app/(main)/action";

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        setIsLoading(true);
        const result = await getFeaturedProjectsAction();

        if (result.success) {
          setProjects(result.data);
          setError(null);
        } else {
          setError(result.error || "Une erreur est survenue");
          setProjects([]);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des projets:", err);
        setError("Une erreur est survenue lors du chargement");
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading || isPending) {
    return (
      <section className="border-y bg-muted/30">
        <div className="py-16 px-4 md:py-24">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Projets en Vedette
            </h2>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
              {`Découvrez quelques-uns de mes projets les plus récents et innovants.`}
            </p>
          </div>
          <div className="flex flex-col items-center md:grid gap-8 md:grid-cols-2 lg:grid-cols-3 content-center place-items-center">
            <Skeleton className="h-64 w-full max-w-md" />
            <Skeleton className="h-64 w-full max-w-md" />
            <Skeleton className="h-64 w-full max-w-md" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="border-y bg-muted/30">
        <div className="py-16 px-4 md:py-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Projets en Vedette
            </h2>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foregroun">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <section className="border-y bg-muted/30">
        <div className="py-16 px-4 md:py-24">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Projets en Vedette
            </h2>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
              {`Aucun projet en vedette pour le moment.`}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y bg-muted/30">
      <div className="py-16 px-4 md:py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Projets en Vedette
          </h2>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            {`Découvrez quelques-uns de mes projets les plus récents et innovants.`}
          </p>
        </div>
        <div className="flex flex-col items-center md:grid gap-8 md:grid-cols-2 lg:grid-cols-3 content-center place-items-center">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="compact"
              showActions={true}
              className="w-full max-w-md"
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/projects">
              Voir tous les projets
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
