import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Code,
  Globe,
  Zap,
  Coffee,
  Award,
  Book,
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
import FeaturedProjects from "@/components/home/FeaturedProjects";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const stats = [
    { icon: Code, label: t("statsProjectsLabel"), value: "10+" },
    {
      icon: Award,
      label: t("statsExperienceLabel"),
      value: new Date().getFullYear() - 2022,
    },
    { icon: Book, label: t("statsEducationLabel"), value: "Bac +5" },
    { icon: Coffee, label: t("statsCoffeeLabel"), value: "500+" },
  ];

  const skills = [
    {
      icon: Globe,
      title: t("skillsWebTitle"),
      description: t("skillsWebDesc"),
    },
    {
      icon: Zap,
      title: t("skillsPerfTitle"),
      description: t("skillsPerfDesc"),
    },
    {
      icon: Code,
      title: t("skillsApiTitle"),
      description: t("skillsApiDesc"),
    },
  ];

  return (
    <div className="flex flex-col items-center *:w-full">
      <section className="py-24 md:py-32 lg:py-40 flex flex-col-reverse gap-8 lg:gap-0 lg:flex-row items-center justify-center max-w-7xl">
        <div className="mx-auto max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              {t("heroPrefix")}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("heroHighlight")}
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl md:text-2xl">
              {t("heroSubtitle")}
            </p>
          </div>
          <div className="flex flex-col gap-4 px-4 sm:px-0 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/projects">
                {t("ctaSeeProjects")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
            >
              <Link href="/contact">{t("ctaContact")}</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto flex flex-col items-center justify-center gap-4">
          <div className="aspect-square w-50 h-50">
            <OptimizedImage
              src="/profile-optimized.webp"
              alt="Matheus Kops Guedes"
              width={200}
              height={200}
              priority
              quality={90}
              sizes="(max-width: 768px) 150px, 200px"
              className="rounded-full object-cover w-full h-full"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLli2O4/VBz2lkif8AhAjjUdbjDu9HzgNJ7YZQKtSqkjHI//Z"
            />
          </div>
          <h2 className="text-2xl font-bold">Matheus Kops Guedes</h2>
          <div className="text-sm text-gray-400 italic">
            <a
              href="/cv-matheuskopsguedes.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("downloadCv")}{" "}
              <span className="text-primary">{t("downloadCvHere")}</span>
            </a>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="py-16 md:py-24">
          <div className="mx-auto grid grid-cols-2 gap-8 md:grid-cols-4 place-items-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-3 max-w-[200px] h-[150px]"
              >
                <div className="mx-auto w-fit p-3 rounded-lg bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold tracking-tight md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("skillsTitle")}
          </h2>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            {t("skillsSubtitle")}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((service, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="mx-auto w-fit p-4 rounded-lg bg-primary/10 mb-4">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FeaturedProjects />

      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("ctaHireTitle")}
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              {t("ctaHireSubtitle")}
            </p>
          </div>
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/contact">
              {t("ctaHireButton")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
