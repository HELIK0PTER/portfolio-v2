"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ResolvedProject } from "@/lib/data";

interface ProjectCardProps {
  project: ResolvedProject;
  variant?: "default" | "featured" | "compact";
  showActions?: boolean;
  showStatus?: boolean;
  showCategory?: boolean;
  showDate?: boolean;
  className?: string;
}

export default function ProjectCard({
  project,
  variant = "default",
  showActions = true,
  showStatus = false,
  showCategory = false,
  showDate = false,
  className = "",
}: ProjectCardProps) {
  const t = useTranslations("Projects");
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <Card
      className={`pt-0 group overflow-hidden border-1 shadow-md hover:shadow-lg transition-all duration-300 ${
        isFeatured ? "shadow-lg hover:shadow-xl" : ""
      } ${className}`}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={1000}
            height={1000}
            className="object-cover w-full h-full"
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFeatured && (
            <Badge className="bg-primary/90 backdrop-blur-sm">⭐</Badge>
          )}
          {showCategory && (
            <Badge variant="outline" className="bg-background/80">
              {project.category}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
          {showStatus && (
            <Badge variant="default">{project.status}</Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle
            className={`group-hover:text-primary transition-colors duration-300 ${
              isCompact ? "text-lg" : "text-xl"
            }`}
          >
            {project.title}
          </CardTitle>
          {showDate && (
            <span className="text-xs text-muted-foreground">
              {project.date}
            </span>
          )}
        </div>
        <CardDescription
          className={`leading-relaxed ${isCompact ? "text-sm" : "text-base"}`}
        >
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, isCompact ? 2 : 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-medium">
              {tag}
            </Badge>
          ))}
          {project.tags.length > (isCompact ? 2 : 3) && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - (isCompact ? 2 : 3)}
            </Badge>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              <Link href={`/projects/${project.slug}`}>
                {t("viewProject")}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>

            {!isCompact && (
              <>
                {project.liveUrl && (
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
                <Button asChild size="sm" variant="outline">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-3 w-3" />
                  </a>
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
