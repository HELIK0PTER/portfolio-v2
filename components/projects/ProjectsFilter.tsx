"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import ProjectCard from "@/components/projects/ProjectCard";

interface ProjectsFilterProps {
  projects: Project[];
  featuredProjects: Project[];
}

export default function ProjectsFilter({ projects, featuredProjects }: ProjectsFilterProps) {
  const [selectedCategory, setSelectedCategory] = React.useState("Tous");
  const [selectedStatus, setSelectedStatus] = React.useState("Tous");

  const categories = ["Tous", "Frontend", "Backend", "Fullstack", "Mobile"];
  const statuses = ["Tous", "Terminé", "En cours"];

  const filteredProjects = projects.filter((project) => {
    const categoryMatch = selectedCategory === "Tous" || project.category === selectedCategory;
    const statusMatch = selectedStatus === "Tous" || project.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <>
      {/* Filtres */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium text-muted-foreground">Statut</label>
              <div className="flex gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className="text-xs"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projets en vedette */}
      {selectedCategory === "Tous" && selectedStatus === "Tous" && featuredProjects.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Projets en Vedette
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                {`Mes projets les plus aboutis et représentatifs de mes compétences techniques.`}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="featured"
                  showActions={true}
                  showStatus={true}
                  showDate={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tous les projets */}
      <section className={`py-16 md:py-24 ${selectedCategory === "Tous" && selectedStatus === "Tous" ? "border-t bg-muted/30" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {selectedCategory === "Tous" && selectedStatus === "Tous" 
                ? "Tous mes Projets" 
                : "Projets Filtrés"
              }
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              {filteredProjects.length} projet{filteredProjects.length > 1 ? "s" : ""} 
              {selectedCategory !== "Tous" && ` dans la catégorie ${selectedCategory}`}
              {selectedStatus !== "Tous" && ` avec le statut ${selectedStatus}`}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="default"
                showActions={true}
                showStatus={true}
                showCategory={true}
                showDate={true}
              />
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {`Aucun projet trouvé avec ces filtres.`}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("Tous");
                  setSelectedStatus("Tous");
                }}
                className="mt-4"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
} 