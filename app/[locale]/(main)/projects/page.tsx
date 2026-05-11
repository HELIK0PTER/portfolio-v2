import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Calendar,
  Eye,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import ProjectsFilter from "@/components/projects/ProjectsFilter";
import { getProjects, getFeaturedProjects, type Locale } from "@/lib/data";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Projects");

  const projects = getProjects(locale as Locale);
  const featuredProjects = getFeaturedProjects(locale as Locale);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl md:text-2xl">
              {t("subtitle")}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{projects.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>{featuredProjects.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>2022+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProjectsFilter
        projects={projects}
        featuredProjects={featuredProjects}
      />

      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t("title")}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/contact">
                  {t("viewProject")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
