import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultServices = [
  {
    title: "Développement Web Full Stack",
    description: "Création d'applications web modernes et performantes avec React, Next.js, Node.js et bases de données. Je développe des solutions complètes de la conception à la mise en production, en passant par l'architecture, le développement frontend et backend, l'intégration de bases de données et le déploiement.",
    price: 500,
    isPublished: true,
  },
  {
    title: "Optimisation de Performance",
    description: "Audit et optimisation de vos applications existantes pour améliorer les performances et l'expérience utilisateur. J'analyse votre code, identifie les goulots d'étranglement et propose des solutions concrètes pour accélérer votre application.",
    price: 400,
    isPublished: true,
  },
  {
    title: "Formation & Mentoring",
    description: "Sessions de formation personnalisées et mentoring pour développeurs juniors ou équipes techniques. Je partage mes connaissances et bonnes pratiques pour faire monter en compétences vos équipes sur les technologies modernes.",
    price: 300,
    isPublished: true,
  },
  {
    title: "Consulting Technique",
    description: "Conseil et expertise technique pour vos projets, choix technologiques et architecture système. Je vous accompagne dans la prise de décisions techniques stratégiques et la définition d'architectures robustes et évolutives.",
    price: 0, // Sur devis
    isPublished: true,
  },
  {
    title: "Migration et Modernisation",
    description: "Migration de vos applications legacy vers des technologies modernes. Refactoring de code, mise à jour des dépendances, modernisation de l'architecture et amélioration de la maintenabilité.",
    price: 0, // Sur devis
    isPublished: true,
  },
  {
    title: "Audit de Sécurité",
    description: "Audit complet de la sécurité de vos applications web. Identification des vulnérabilités, recommandations de sécurisation et mise en place de bonnes pratiques pour protéger vos données et utilisateurs.",
    price: 600,
    isPublished: false, // En brouillon pour l'instant
  },
];

async function main() {
  console.log('🌱 Ajout des services par défaut...');

  // Vérifier si des services existent déjà
  const existingServices = await prisma.service.count();
  
  if (existingServices > 0) {
    console.log(`⚠️  ${existingServices} service(s) existent déjà. Annulation de l'ajout.`);
    return;
  }

  // Ajouter les services par défaut
  for (const service of defaultServices) {
    const created = await prisma.service.create({
      data: service,
    });
    console.log(`✅ Service créé: ${created.title} (${created.isPublished ? 'Publié' : 'Brouillon'})`);
  }

  console.log(`🎉 ${defaultServices.length} services ajoutés avec succès !`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'ajout des services:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 