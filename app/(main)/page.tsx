import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Code,
  Globe,
  Zap,
  Coffee,
  Award,
  Book,
} from "lucide-react";
import Image from "next/image";
import FeaturedProjects from "@/components/home/FeaturedProjects";

export default async function HomePage() {
  const stats = [
    { icon: Code, label: "Projets réalisés", value: "10+" },
    {
      icon: Award,
      label: "Années d'expérience dev",
      value: new Date().getFullYear() - 2022,
    },
    {
      icon: Book,
      label: "Spécialisé dans le développement",
      value: "Bac +5",
    },
    { icon: Coffee, label: "Tasses de café", value: "500+" },
  ];

  const services = [
    {
      icon: Globe,
      title: "Développement Web",
      description:
        "Applications web modernes et performantes avec React, Next.js et TypeScript.",
    },
    {
      icon: Zap,
      title: "Optimisation Performance",
      description:
        "Amélioration des performances et de l'expérience utilisateur de vos applications.",
    },
    {
      icon: Code,
      title: "API & Backend",
      description:
        "Développement d'APIs robustes et scalables avec Node.js et bases de données.",
    },
  ];

  return (
    <div className="flex flex-col items-center *:w-full">
      {/* Hero Section */}
      <section className="py-24 md:py-32 lg:py-40 flex flex-col-reverse gap-8 lg:gap-0 lg:flex-row items-center justify-center max-w-7xl">
        <div className="mx-auto max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Développeur{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Full Stack
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl md:text-2xl">
              Développeur Full Stack expert en Next.js, React et TypeScript.
              Spécialisé dans la création d&apos;applications web modernes et
              performantes.
            </p>
          </div>
          <div className="flex flex-col gap-4 px-4 sm:px-0 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/projects">
                Voir mes projets
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
            >
              <Link href="/contact">Me contacter</Link>
            </Button>
          </div>
        </div>
        {/* Image et nom */}
        <div className="mx-auto flex flex-col items-center justify-center gap-4">
          <div className="aspect-square w-50 h-50">
            <Image
              src="/profile.jpg"
              alt="Profile"
              width={200}
              height={200}
              priority
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <h2 className="text-2xl font-bold">Matheus Kops Guedes</h2>
          <div className="text-sm text-gray-400 italic">
            <a href="/cv-matheuskopsguedes.pdf" target="_blank" rel="noopener noreferrer">
              {`Téléchargez mon CV `}<span className="text-primary">{`ici`}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="py-16 md:py-24 ">
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

      {/* Compétences Section */}
      <section className="py-16 px-4 md:py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Mes Compétences
          </h2>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
            J&apos;ai une gamme complète de compétences en développement web
            pour répondre à vos besoins.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
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

      {/* Featured Projects Section - Composant client */}
      <FeaturedProjects />

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Prêt à m&apos;embaucher dans votre équipe ?
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">
              Discutons en et créons ensemble quelque chose
              d&apos;extraordinaire.
            </p>
          </div>
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/contact">
              Contactez-moi
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
