import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/projects/ProjectCard";
import { getFeaturedProjects, type Locale } from "@/lib/data";

export default function FeaturedProjects() {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const projects = getFeaturedProjects(locale);

  if (projects.length === 0) return null;

  return (
    <section className="border-y bg-muted/30 w-full">
      <div className="py-16 px-4 md:py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("featuredTitle")}
          </h2>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            {t("featuredSubtitle")}
          </p>
        </div>
        <div className="flex flex-col items-center md:grid gap-8 md:grid-cols-2 lg:grid-cols-3 content-center place-items-center">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="compact"
              showActions
              className="w-full max-w-md"
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/projects">
              {t("seeAll")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
