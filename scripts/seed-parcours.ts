import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const educationsData = [
  {
    title: "Bac+5 Ingénierie Logicielle et Management des Systèmes d'Information",
    institution: "ESIEE-IT",
    location: "Pontoise, France",
    description: "Formation en alternance axée sur le développement logiciel avancé, DevOps, cybersécurité, IA, bases de données, gestion de projet et réalité virtuelle. Approche métier orientée conception de solutions techniques innovantes.",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2027-08-31"),
    isCurrently: true,
    grade: "En cours",
    skills: ["DevOps", "Docker", "Cybersécurité", "Data Mining", "Node.js", "React", "IA / Deep Learning"],
    isPublished: true
  },
  {
    title: "Licence Informatique Générale",
    institution: "CNAM",
    location: "Pontoise, France",
    description: "3ᵉ année de Licence orientée développement fullstack, réseaux, UX, sécurité et gestion de projet. Approfondissement de la conception d'applications web modernes et gestion de bases de données.",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-06-30"),
    isCurrently: false,
    grade: "Validé",
    skills: ["UX Design", "SQL", "React", "PHP", "Gestion de projet", "Cybersécurité"],
    isPublished: true
  },
  {
    title: "BTS SIO SLAM",
    institution: "ESIEE-IT",
    location: "Pontoise, France",
    description: "BTS axé sur le développement d'applications métier et la programmation orientée objet. Réalisations concrètes en entreprise avec intégration de technos web et automatisation de processus.",
    startDate: new Date("2022-09-01"),
    endDate: new Date("2024-06-30"),
    isCurrently: false,
    grade: "Mention Bien",
    skills: ["PHP", "SQL", "Java", "HTML/CSS", "API REST", "Automatisation", "Scrum"],
    isPublished: true
  },
  {
    title: "Licence MIPI (Maths, Informatique, Physique et Ingénierie)",
    institution: "Université CY Tech",
    location: "Cergy, France",
    description: "Première approche des bases scientifiques en informatique, mathématiques et ingénierie. Acquisition d'une méthodologie rigoureuse et logique de résolution de problèmes complexes.",
    startDate: new Date("2020-09-01"),
    endDate: new Date("2022-06-30"),
    isCurrently: false,
    grade: "Validé",
    skills: ["Algorithmique", "Mathématiques", "Logique", "Initiation au développement"],
    isPublished: true
  }
];

const experiencesData = [
  {
    title: "Développeur Fullstack - Alternance RECHERCHÉE",
    company: "En recherche",
    location: "Île-de-France",
    description: "Actuellement en Bac+5, je suis à la recherche d'une alternance dans une équipe ambitieuse pour concevoir des solutions web performantes avec un fort impact utilisateur. Je veux contribuer à des projets innovants en React, Node.js, Supabase ou similaires.",
    startDate: new Date("2025-09-01"),
    endDate: null,
    isCurrently: true,
    skills: ["Next.js", "React", "Node.js", "Prisma", "PostgreSQL", "Supabase", "Tailwind CSS", "Docker"],
    companyUrl: null,
    isPublished: true
  },
  {
    title: "Gestion de projet IT - Alternance",
    company: "DB Cargo France",
    location: "Aubervilliers, France",
    description: "Développement d'un robot RPA en Python pour automatiser un processus de réservation. Mise en place d'un outil de ticketing pour 900+ utilisateurs. Refonte d'outils internes (UX/UI), audits de sécurité RGPD sur des BDD internes, support utilisateur, onboarding et gestion de la conformité NIS 2.",
    startDate: new Date("2022-09-01"),
    endDate: null,
    isCurrently: true,
    skills: ["Python", "MySQL", "Oracle", "Power BI", "RPA", "Cybersecurité", "Scrum", "Support IT"],
    companyUrl: null,
    isPublished: true
  },
  {
    title: "Développeur Web - Projet de groupe : MeetSync",
    company: "ESIEE-IT",
    location: "Pontoise, France",
    description: "Plateforme SaaS de gestion d'événements avec notifications mail et système de trophées. Développée en équipe avec méthode agile. Stack moderne et approche dynamique du design UX et de l'automatisation des workflows.",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-06-01"),
    isCurrently: false,
    skills: ["Next.js", "Supabase", "Node.js", "Nodemailer", "Tailwind", "Agile", "Gamification"],
    companyUrl: null,
    isPublished: true
  },
  {
    title: "Développeur E-commerce - Projet personnel : Cantina Mincarone",
    company: "Projet personnel",
    location: "Remote / Brésil",
    description: "Création d'un site e-commerce pour un domaine viticole familial. Stack moderne avec paiement Stripe et Supabase. Apprentissage en autonomie des outils no-code et de l'intégration visuelle avancée.",
    startDate: new Date("2025-03-01"),
    endDate: new Date("2025-06-01"),
    isCurrently: false,
    skills: ["Next.js", "Supabase", "Stripe", "React", "Tailwind", "Figma"],
    companyUrl: null,
    isPublished: true
  }
];

async function main() {
  console.log('🎓 Ajout du parcours de Matheus...');

  // Vérifier si des données existent déjà
  const existingEducations = await prisma.education.count();
  const existingExperiences = await prisma.experience.count();
  
  if (existingEducations > 0 || existingExperiences > 0) {
    console.log(`⚠️  Données existantes trouvées (${existingEducations} formations, ${existingExperiences} expériences).`);
    console.log('🗑️  Suppression des anciennes données...');
    
    await prisma.education.deleteMany();
    await prisma.experience.deleteMany();
    
    console.log('✅ Anciennes données supprimées.');
  }

  // Ajouter les formations
  console.log('📚 Ajout des formations...');
  for (const education of educationsData) {
    const created = await prisma.education.create({
      data: education,
    });
    console.log(`✅ Formation créée: ${created.title} - ${created.institution} (${created.isCurrently ? 'En cours' : created.grade})`);
  }

  // Ajouter les expériences
  console.log('💼 Ajout des expériences...');
  for (const experience of experiencesData) {
    const created = await prisma.experience.create({
      data: experience,
    });
    console.log(`✅ Expérience créée: ${created.title} - ${created.company} (${created.isCurrently ? 'En cours' : 'Terminé'})`);
  }

  console.log(`🎉 Parcours de Matheus ajouté avec succès !`);
  console.log(`📊 Résumé: ${educationsData.length} formations et ${experiencesData.length} expériences`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de l\'ajout du parcours:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 