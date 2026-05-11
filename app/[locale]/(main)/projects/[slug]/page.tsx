import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
import { ImageReady } from "@/components/ui/ImageReady";
import {
  getProjectBySlug,
  getOtherProjects,
  getAllProjectSlugs,
  type Locale,
} from "@/lib/data";
import { routing } from "@/i18n/routing";

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Projects");

  const project = getProjectBySlug(locale as Locale, slug);
  if (!project) notFound();

  const otherProjects = getOtherProjects(locale as Locale, project.id, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/projects" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("backToProjects")}
            </Link>
          </Button>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6 mb-12">
              <div className="flex justify-center gap-2 mb-4">
                <Badge variant="outline">{project.category}</Badge>
                <Badge variant="default">{project.status}</Badge>
                {project.featured && (
                  <Badge className="bg-primary/90">⭐</Badge>
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
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      {t("viewLive")}
                    </a>
                  </Button>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8"
                >
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    {t("viewCode")}
                  </a>
                </Button>
              </div>
            </div>

            <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-lg overflow-hidden shadow-lg">
              {project.imageUrl && (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={1000}
                  height={1000}
                  className="object-cover w-full h-full border-2 border-primary rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.longDescription}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold tracking-tighter mb-6">
                  {t("features")}
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

              {project.images && project.images.length > 0 && (
                <div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-lg overflow-hidden"
                      >
                        <ImageReady
                          src={image}
                          alt={`${project.title} ${index + 1}`}
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

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    {t("technologies")}
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
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("status")}
                    </span>
                    <Badge variant="default">{project.status}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("category")}
                    </span>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("duration")}
                    </span>
                    <span className="text-sm font-medium">
                      {project.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("client")}
                    </span>
                    <span className="text-sm font-medium">
                      {project.client}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t("date")}
                    </span>
                    <span className="text-sm font-medium">{project.date}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                {project.liveUrl && (
                  <Button asChild className="w-full">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t("viewLive")}
                    </a>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    {t("viewCode")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {otherProjects.length > 0 && (
        <section className="py-16 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                {t("otherProjects")}
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {otherProjects.map((otherProject) => (
                <Card
                  key={otherProject.id}
                  className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 relative overflow-hidden">
                    {otherProject.imageUrl && (
                      <Image
                        src={otherProject.imageUrl}
                        alt={otherProject.title}
                        width={500}
                        height={500}
                        className="object-cover w-full h-full"
                      />
                    )}
                    <Badge
                      variant="default"
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
                        {t("viewProject")}
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
                  {t("seeAll")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
