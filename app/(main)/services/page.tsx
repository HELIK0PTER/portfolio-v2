import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  Globe,
  Zap,
  Users,
  Search,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Services | Matheus Kops Guedes",
  description:
    "Découvrez mes services de développement web, création d'API, optimisation et consulting technique.",
};

async function getServices() {
  return await prisma.service.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
  });
}

// Services par défaut si la base est vide
const defaultServices = [
  {
    id: "1",
    title: "Développement Web Full Stack",
    description:
      "Création d'applications web modernes et performantes avec React, Next.js, Node.js et bases de données.",
    price: 0,
    features: [
      "Applications React/Next.js",
      "API REST et GraphQL",
      "Bases de données SQL/NoSQL",
      "Authentification et sécurité",
      "Déploiement et CI/CD",
      "Responsive design",
    ],
    icon: Globe,
    highlight: true,
  },
  {
    id: "2",
    title: "Optimisation de Performance",
    description:
      "Audit et optimisation de vos applications existantes pour améliorer les performances et l'expérience utilisateur.",
    price: 0,
    features: [
      "Audit de performance",
      "Optimisation du code",
      "Amélioration SEO",
      "Optimisation des images",
      "Mise en cache",
      "Monitoring et analytics",
    ],
    icon: Zap,
    highlight: false,
  },
  {
    id: "3",
    title: "Formation & Mentoring",
    description:
      "Sessions de formation personnalisées et mentoring pour développeurs juniors ou équipes techniques.",
    price: 0,
    features: [
      "Formation React/Next.js",
      "Best practices de développement",
      "Architecture d'applications",
      "Code review et feedback",
      "Sessions individuelles ou en groupe",
      "Support continu",
    ],
    icon: Users,
    highlight: false,
  },
  {
    id: "4",
    title: "Consulting Technique",
    description:
      "Conseil et expertise technique pour vos projets, choix technologiques et architecture système.",
    price: 0,
    features: [
      "Audit technique",
      "Choix d'architecture",
      "Stratégie de développement",
      "Migration de technologies",
      "Sécurité et bonnes pratiques",
      "Accompagnement projet",
    ],
    icon: Search,
    highlight: false,
  },
];

// Force cette page à être rendue dynamiquement
export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  let services = await getServices();

  // Si pas de services en base, utiliser les services par défaut
  if (services.length === 0) {
    services = defaultServices.map((service) => ({
      ...service,
      price: service.price,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
            {`Mes Services`}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {`Je propose une gamme complète de services de développement web pour transformer vos idées en solutions digitales performantes.`}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 mb-16">
          {services.map((service) => {
            const ServiceIcon =
              defaultServices.find((d) => d.title === service.title)?.icon ||
              Code;
            const isHighlight =
              defaultServices.find((d) => d.title === service.title)
                ?.highlight || false;
            const features =
              defaultServices.find((d) => d.title === service.title)
                ?.features || [];

            return (
              <Card
                key={service.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  isHighlight ? "border-primary shadow-md" : ""
                }`}
              >
                {isHighlight && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                    {`Populaire`}
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <ServiceIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <p className="text-2xl font-bold text-primary">
                        {service.price > 0 ? (
                          <>
                            {service.price}€{" "}
                            <span className="text-sm text-muted-foreground">
                              /jour
                            </span>
                          </>
                        ) : (
                          `Sur devis`
                        )}
                      </p>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {features.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        {`Inclus dans ce service`}
                      </h4>
                      <ul className="space-y-2">
                        {features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                                    <Button 
                    asChild 
                    className="w-full" 
                    variant={isHighlight ? "default" : "outline"}
                  >
                    <Link href={`/contact?service=${encodeURIComponent(service.title)}`}>
                      {`Discuter de ce projet`}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Process Section */}
        <div className="bg-muted/30 rounded-lg p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {`Comment je travaille`}
            </h2>
            <p className="text-lg text-muted-foreground">
              {`Un processus simple et transparent pour mener votre projet à bien`}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discussion",
                description:
                  "Analyse de vos besoins et définition du cahier des charges",
              },
              {
                step: "02",
                title: "Devis",
                description:
                  "Proposition détaillée avec planning et tarification transparente",
              },
              {
                step: "03",
                title: "Développement",
                description:
                  "Création de votre solution avec suivi régulier et feedback",
              },
              {
                step: "04",
                title: "Livraison",
                description:
                  "Déploiement, formation et support pour assurer votre succès",
              },
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{process.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 rounded-lg p-12">
          <Shield className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            {`Prêt à démarrer votre projet ?`}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {`Parlons de vos objectifs et voyons comment je peux vous aider à les atteindre. Consultation initiale gratuite pour tous les projets.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                {`Demander un devis gratuit`}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">{`Voir mes réalisations`}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
