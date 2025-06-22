import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Star,
  ArrowRight,
  BookOpen,
  Clock,
} from "lucide-react";
import { getAllArticles, getFeaturedArticles } from "@/lib/articles";
import { ArticlesFilter } from "@/components/articles";

// Configuration de revalidation
export const revalidate = 3600; // Revalidation toutes les heures
export const dynamic = 'force-static'; // Force la génération statique
export const dynamicParams = true; // Permet la génération de nouveaux paramètres

export default async function ArticlesPage() {
  // Récupération des données côté serveur
  const [articles, featuredArticles] = await Promise.all([
    getAllArticles(),
    getFeaturedArticles(),
  ]);

  // Calculer les statistiques
  const totalReadTime = articles.reduce((total, article) => total + article.readTime, 0);
  const totalViews = articles.reduce((total, article) => total + article.views, 0);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Mon{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl md:text-2xl">
              {`Découvrez mes articles et tutoriels sur le développement web, les technologies modernes et mes retours d'expérience. Partageons ensemble la passion du code !`}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{articles.length} articles</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>{featuredArticles.length} en vedette</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{totalReadTime} min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{totalViews.toLocaleString()} vues</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Composant client pour les filtres et l'affichage des articles */}
      <ArticlesFilter articles={articles} featuredArticles={featuredArticles} />

      {/* Newsletter Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {`Restez informé !`}
              </h2>
              <p className="text-lg text-muted-foreground md:text-xl">
                {`Recevez les derniers articles et conseils directement dans votre boîte mail. Pas de spam, juste du contenu de qualité.`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/contact">
                  {`Contactez-moi`}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                <Link href="/projects">
                  {`Voir mes projets`}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 