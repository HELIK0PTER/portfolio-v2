"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/projects/ProjectCard";
import type { ResolvedProject } from "@/lib/data";

interface ProjectsFilterProps {
  projects: ResolvedProject[];
  featuredProjects: ResolvedProject[];
}

const CATEGORIES = ["Frontend", "Backend", "Fullstack", "Mobile"];

export default function ProjectsFilter({
  projects,
  featuredProjects,
}: ProjectsFilterProps) {
  const t = useTranslations("Projects");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );

  const filtered = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects;

  const showFeatured = selectedCategory === null && featuredProjects.length > 0;

  return (
    <>
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t("category")}
            </label>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="text-xs"
              >
                {t("filterAll")}
              </Button>
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showFeatured && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {t("featuredTitle")}
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                {t("featuredSubtitle")}
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="featured"
                  showActions
                  showStatus
                  showDate
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        className={`py-16 md:py-24 ${showFeatured ? "border-t bg-muted/30" : ""}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              {filtered.length} {t("title").toLowerCase()}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="default"
                showActions
                showStatus
                showCategory
                showDate
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
