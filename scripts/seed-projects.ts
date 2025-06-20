import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Création des projets d'exemple...");
  await createSampleProjects();
  console.log("✅ Projets créés avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de la création des projets:", e);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../lib/prisma");
    await prisma.$disconnect();
  });

// Fonction pour créer des projets d'exemple (utile pour tester)
async function createSampleProjects() {
  const sampleProjects = [
    {
      title: "E-commerce Platform",
      slug: "ecommerce-platform",
      description:
        "Plateforme e-commerce complète avec système de paiement intégré, gestion des stocks, tableau de bord administrateur et interface utilisateur moderne.",
      longDescription:
        "Une plateforme e-commerce full-stack développée avec Next.js et TypeScript. Cette application intègre Stripe pour les paiements sécurisés, PostgreSQL pour la gestion robuste des données, et un système d'authentification complet avec NextAuth.js. L'interface utilisateur est entièrement responsive et optimisée pour la conversion avec un design moderne utilisant Tailwind CSS.",
      imageUrl: "/placeholder-project.jpg",
      images: [
        "/placeholder-project.jpg",
        "/placeholder-project.jpg",
        "/placeholder-project.jpg",
      ],
      tags: ["Next.js", "Stripe", "PostgreSQL"],
      technologies: [
        "Next.js",
        "TypeScript",
        "Stripe",
        "PostgreSQL",
        "Tailwind CSS",
        "NextAuth.js",
        "Prisma",
        "Vercel",
      ],
      features: [
        "Authentification sécurisée avec NextAuth.js",
        "Paiements intégrés avec Stripe",
        "Gestion complète des stocks",
        "Tableau de bord administrateur",
        "Interface responsive et moderne",
        "Optimisations SEO avancées",
        "API REST complète",
        "Système de notifications",
      ],
      category: "Fullstack",
      status: "Terminé",
      date: "2024",
      duration: "3 mois",
      client: "Projet personnel",
      githubUrl: "https://github.com",
      liveUrl: "https://demo.com",
      featured: true,
      isPublished: true,
    },
    {
      title: "Task Management App",
      slug: "task-management-app",
      description:
        "Application de gestion de tâches collaborative avec fonctionnalités temps réel, équipes, assignations et suivi de progression.",
      longDescription:
        "Application web collaborative pour la gestion de projets et tâches développée avec React et Node.js. Elle propose des fonctionnalités temps réel grâce à Socket.io, un système complet de gestion d'équipes, des notifications push, et un tableau de bord analytique pour suivre la productivité. L'application supporte la collaboration en temps réel avec mise à jour instantanée des tâches.",
      imageUrl: "/placeholder-project.jpg",
      images: [
        "/placeholder-project.jpg",
        "/placeholder-project.jpg",
        "/placeholder-project.jpg",
      ],
      tags: ["React", "Node.js", "Socket.io"],
      technologies: [
        "React",
        "Node.js",
        "Socket.io",
        "MongoDB",
        "Express",
        "JWT",
        "Material-UI",
        "Chart.js",
      ],
      features: [
        "Collaboration temps réel avec Socket.io",
        "Gestion d'équipes et permissions",
        "Assignation de tâches dynamique",
        "Tableau de bord analytique",
        "Notifications push en temps réel",
        "Calendrier intégré",
        "Export de données",
        "Interface drag & drop",
      ],
      category: "Fullstack",
      status: "Terminé",
      date: "2024",
      duration: "4 mois",
      client: "Startup",
      githubUrl: "https://github.com",
      liveUrl: "https://demo.com",
      featured: true,
      isPublished: true,
    },
    {
      title: "Portfolio Website",
      slug: "portfolio-website",
      description:
        "Site portfolio moderne et responsive avec animations fluides, optimisé pour le SEO et la performance.",
      longDescription:
        "Site portfolio personnel développé avec Next.js 14 et les dernières technologies web. Il intègre des animations fluides avec Framer Motion, un système de gestion de contenu headless pour faciliter la maintenance, et des optimisations SEO avancées. Le site est conçu pour une performance optimale avec un score parfait sur Lighthouse.",
      imageUrl: "/placeholder-project.jpg",
      images: [
        "/placeholder-project.jpg",
        "/placeholder-project.jpg",
        "/placeholder-project.jpg",
      ],
      tags: ["Next.js", "Tailwind", "Framer Motion"],
      technologies: [
        "Next.js",
        "Tailwind CSS",
        "Framer Motion",
        "MDX",
        "TypeScript",
        "Vercel",
        "Sanity CMS",
      ],
      features: [
        "Design moderne et responsive",
        "Animations fluides avec Framer Motion",
        "CMS headless intégré",
        "Optimisations SEO avancées",
        "Performance optimisée",
        "Mode sombre/clair",
        "Blog intégré avec MDX",
        "Formulaire de contact fonctionnel",
      ],
      category: "Frontend",
      status: "Terminé",
      date: "2024",
      duration: "2 mois",
      client: "Projet personnel",
      githubUrl: "https://github.com",
      liveUrl: "https://demo.com",
      featured: true,
      isPublished: true,
    },
  ];

  try {
    for (const project of sampleProjects) {
      await prisma.project.upsert({
        where: { slug: project.slug },
        update: project,
        create: project,
      });
    }
    console.log("Projets d'exemple créés avec succès");
  } catch (error) {
    console.error("Erreur lors de la création des projets d'exemple:", error);
  }
}
