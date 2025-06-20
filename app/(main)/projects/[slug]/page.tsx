import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Code,
  User,
  CheckCircle,
} from "lucide-react";
import { getProjectBySlug, getOtherProjects } from "@/lib/projects";
import Image from "next/image";
import { ImageReady } from "@/components/ui/ImageReady";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const otherProjects = await getOtherProjects(project.id, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux projets
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <div className="flex justify-center gap-2 mb-4">
                <Badge variant="outline">{project.category}</Badge>
                <Badge
                  variant={
                    project.status === "Terminé" ? "default" : "secondary"
                  }
                >
                  {project.status}
                </Badge>
                {project.featured && (
                  <Badge className="bg-primary/90">⭐ Vedette</Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                {project.title}
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                {project.description}
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{project.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{project.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{project.client}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {project.liveUrl && (
                  <Button asChild size="lg" className="h-12 px-8">
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Voir le projet
                    </Link>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8"
                >
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    Code source
                  </Link>
                </Button>
              </div>
            </div>

            {/* Image principale */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-lg overflow-hidden shadow-lg">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={1000}
                  height={1000}
                  className="object-cover w-full h-full border-2 border-primary rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-t from-black/20 to-transparent" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid gap-12 lg:grid-cols-3">
            {/* Description et fonctionnalités */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter mb-6">
                  À propos du projet
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.longDescription}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tighter mb-6">
                  Fonctionnalités principales
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {project.images && project.images.length >= 1 && (
                <div>
                  <h3 className="text-2xl font-bold tracking-tighter mb-6">
                    Captures d&apos;écran
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-lg overflow-hidden"
                      >
                        <ImageReady
                          src={image.toString()}
                          alt={`Capture d'écran ${index + 1} de ${project.title}`}
                          width={1000}
                          height={1000}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Technologies utilisées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Détails du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Statut
                    </span>
                    <Badge
                      variant={
                        project.status === "Terminé" ? "default" : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Catégorie
                    </span>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Durée</span>
                    <span className="text-sm font-medium">
                      {project.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Client
                    </span>
                    <span className="text-sm font-medium">
                      {project.client}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Année</span>
                    <span className="text-sm font-medium">{project.date}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                {project.liveUrl && (
                  <Button asChild className="w-full">
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Voir en ligne
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
                    Code source
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Autres projets */}
      {otherProjects.length > 0 && (
        <section className="py-16 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Autres projets
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                {`Découvrez d'autres réalisations qui pourraient vous intéresser.`}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {otherProjects.map((otherProject) => (
                <Card
                  key={otherProject.id}
                  className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 relative overflow-hidden">
                    {otherProject.imageUrl ? (
                      <Image
                        src={otherProject.imageUrl}
                        alt={otherProject.title}
                        width={500}
                        height={500}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    )}
                    <Badge
                      variant={
                        otherProject.status === "Terminé"
                          ? "default"
                          : "secondary"
                      }
                      className="absolute top-3 right-3 backdrop-blur-sm"
                    >
                      {otherProject.status}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                      {otherProject.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {otherProject.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <Link href={`/projects/${otherProject.slug}`}>
                        Voir le projet
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">
                  Voir tous les projets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {`Intéressé par mon travail ?`}
              </h2>
              <p className="text-lg text-muted-foreground md:text-xl">
                {`Discutons de votre projet et voyons comment nous pouvons collaborer.`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/contact">
                  {`Contactez-moi`}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base"
              >
                <Link href="/projects">{`Voir tous les projets`}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  // Note: En production, vous pourriez vouloir récupérer tous les slugs depuis la base de données
  // Pour l'instant, on retourne un tableau vide et Next.js générera les pages à la demande
  return [];
}
