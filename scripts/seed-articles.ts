import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockArticles = [
  {
    title: "Les bases de React et Next.js",
    slug: "bases-react-nextjs",
    excerpt: "Découvrez comment créer des applications web modernes avec React et Next.js. Un guide complet pour débuter dans le développement frontend.",
    content: `# Les bases de React et Next.js

React et Next.js sont des technologies incontournables du développement web moderne. Dans cet article, nous allons explorer les concepts fondamentaux qui vous permettront de créer des applications web performantes et évolutives.

## Introduction à React

React est une bibliothèque JavaScript développée par Facebook pour créer des interfaces utilisateur interactives. Son approche basée sur les composants révolutionne la façon dont nous développons les applications web.

### Les concepts clés

- **Composants** : Blocs de construction réutilisables
- **JSX** : Syntaxe qui combine HTML et JavaScript
- **Props** : Données passées entre composants
- **State** : Gestion de l'état local des composants

## Pourquoi Next.js ?

Next.js apporte de nombreuses fonctionnalités avancées à React :

- Rendu côté serveur (SSR)
- Génération de sites statiques (SSG)
- Routing automatique
- Optimisations de performance intégrées

## Créer votre première application

\`\`\`bash
npx create-next-app@latest mon-app
cd mon-app
npm run dev
\`\`\`

## Conclusion

React et Next.js offrent un écosystème puissant pour le développement web. Maîtriser ces technologies vous ouvrira de nombreuses opportunités.`,
    author: "Matheus Kops Guedes",
    publishedAt: new Date("2024-01-15"),
    readTime: 8,
    views: 1250,
    category: "Frontend",
    tags: ["React", "Next.js", "JavaScript", "TypeScript"],
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    featured: true,
    isPublished: true,
  },
  {
    title: "Guide complet de Tailwind CSS",
    slug: "guide-tailwind-css",
    excerpt: "Maîtrisez Tailwind CSS pour créer des interfaces utilisateur élégantes et responsives rapidement.",
    content: `# Guide complet de Tailwind CSS

Tailwind CSS révolutionne la façon dont nous stylisons nos applications web. Découvrez comment cette approche utility-first peut accélérer votre développement.

## Qu'est-ce que Tailwind CSS ?

Tailwind CSS est un framework CSS utility-first qui vous permet de construire des designs personnalisés rapidement sans quitter votre HTML.

## Installation et configuration

\`\`\`bash
npm install tailwindcss
npx tailwindcss init
\`\`\`

## Les avantages de Tailwind

- **Rapidité de développement**
- **Cohérence du design**
- **Bundle size optimisé**
- **Responsive design facile**

## Exemples pratiques

Créons un bouton moderne :

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Cliquez-moi
</button>
\`\`\`

## Conclusion

Tailwind CSS transforme votre workflow de développement en vous permettant de créer des interfaces magnifiques plus rapidement.`,
    author: "Matheus Kops Guedes",
    publishedAt: new Date("2024-01-10"),
    readTime: 12,
    views: 980,
    category: "CSS",
    tags: ["Tailwind CSS", "CSS", "Design", "UI/UX"],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    featured: true,
    isPublished: true,
  },
  {
    title: "Authentification avec NextAuth.js",
    slug: "authentification-nextauth",
    excerpt: "Implémentez un système d'authentification sécurisé dans vos applications Next.js avec NextAuth.js.",
    content: `# Authentification avec NextAuth.js

L'authentification est cruciale pour toute application web. NextAuth.js simplifie grandement cette tâche en fournissant une solution complète et sécurisée.

## Configuration de base

\`\`\`javascript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
})
\`\`\`

## Les avantages de NextAuth.js

- Support de nombreux providers
- Sécurité intégrée
- Session management
- Base de données optionnelle

## Implémentation pratique

Protégeons une page :

\`\`\`javascript
import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session } = useSession()
  
  if (!session) return <p>Vous devez être connecté</p>
  
  return <p>Bienvenue {session.user.email}</p>
}
\`\`\`

## Conclusion

NextAuth.js est la solution idéale pour ajouter l'authentification à vos applications Next.js de manière simple et sécurisée.`,
    author: "Matheus Kops Guedes",
    publishedAt: new Date("2024-01-05"),
    readTime: 15,
    views: 756,
    category: "Backend",
    tags: ["NextAuth.js", "Authentication", "Security", "Next.js"],
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    featured: false,
    isPublished: true,
  },
  {
    title: "Optimisation des performances web",
    slug: "optimisation-performances-web",
    excerpt: "Techniques avancées pour optimiser les performances de vos applications web modernes.",
    content: `# Optimisation des performances web

Les performances web sont cruciales pour l'expérience utilisateur et le SEO. Découvrez les techniques essentielles pour optimiser vos applications.

## Mesurer les performances

Utilisez les Core Web Vitals :
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)

## Techniques d'optimisation

### 1. Optimisation des images

\`\`\`javascript
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority
/>
\`\`\`

### 2. Code splitting

\`\`\`javascript
const LazyComponent = dynamic(() => import('./LazyComponent'))
\`\`\`

### 3. Caching strategique

- Service Workers
- CDN configuration
- Browser caching headers

## Outils de mesure

- Lighthouse
- WebPageTest
- Chrome DevTools

## Conclusion

L'optimisation des performances est un processus continu qui améliore significativement l'expérience utilisateur.`,
    author: "Matheus Kops Guedes",
    publishedAt: new Date("2023-12-28"),
    readTime: 10,
    views: 623,
    category: "Performance",
    tags: ["Performance", "Optimization", "Web", "JavaScript"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    featured: false,
    isPublished: true,
  },
  {
    title: "Introduction à TypeScript",
    slug: "introduction-typescript",
    excerpt: "Découvrez les avantages de TypeScript et comment l'intégrer dans vos projets JavaScript.",
    content: `# Introduction à TypeScript

TypeScript apporte la puissance du typage statique à JavaScript, rendant votre code plus robuste et maintenable.

## Qu'est-ce que TypeScript ?

TypeScript est un sur-ensemble de JavaScript qui ajoute des types statiques optionnels au langage.

## Installation

\`\`\`bash
npm install -g typescript
tsc --init
\`\`\`

## Types de base

\`\`\`typescript
// Types primitifs
let nom: string = "John";
let age: number = 25;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let fruits: Array<string> = ["pomme", "banane"];

// Objects
interface User {
  name: string;
  age: number;
  email?: string; // Optionnel
}
\`\`\`

## Interfaces et types

\`\`\`typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

type Status = "pending" | "approved" | "rejected";
\`\`\`

## Avantages

- **Détection d'erreurs** à la compilation
- **IntelliSense** amélioré
- **Refactoring** plus sûr
- **Documentation** vivante

## Conclusion

TypeScript améliore significativement l'expérience de développement JavaScript et la qualité du code.`,
    author: "Matheus Kops Guedes",
    publishedAt: new Date("2023-12-20"),
    readTime: 7,
    views: 892,
    category: "JavaScript",
    tags: ["TypeScript", "JavaScript", "Types", "Development"],
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop",
    featured: true,
    isPublished: true,
  },
  {
    title: "Déploiement avec Vercel",
    slug: "deploiement-vercel",
    excerpt: "Apprenez à déployer vos applications Next.js sur Vercel avec les meilleures pratiques.",
    content: `# Déploiement avec Vercel

Vercel offre une plateforme optimisée pour déployer vos applications Next.js avec des performances exceptionnelles.

## Pourquoi Vercel ?

- **Edge Functions** pour des performances optimales
- **Déploiement automatique** depuis Git
- **Preview deployments** pour chaque PR
- **Analytics** intégrés

## Configuration initiale

\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

## Variables d'environnement

Configurez vos variables dans le dashboard Vercel :

\`\`\`bash
vercel env add DATABASE_URL
\`\`\`

## Optimisations

### 1. Configuration du cache

\`\`\`javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 's-maxage=86400'
        }
      ]
    }
  ]
}
\`\`\`

### 2. Edge Functions

\`\`\`javascript
export const config = {
  runtime: 'edge',
}
\`\`\`

## Monitoring

- Core Web Vitals
- Function logs
- Bandwidth usage

## Conclusion

Vercel simplifie le déploiement et offre des performances optimales pour vos applications Next.js.`,
    author: "Matheus Kops Guedes",
    publishedAt: new Date("2023-12-15"),
    readTime: 6,
    views: 445,
    category: "DevOps",
    tags: ["Vercel", "Deployment", "Next.js", "CI/CD"],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    featured: false,
    isPublished: true,
  },
];

async function main() {
  console.log('🌱 Début du seeding des articles...');

  for (const article of mockArticles) {
    try {
      const existingArticle = await prisma.article.findUnique({
        where: { slug: article.slug }
      });

      if (existingArticle) {
        console.log(`⚠️ Article "${article.title}" existe déjà, ignoré.`);
        continue;
      }

      await prisma.article.create({
        data: {
          ...article,
          imageUrl: article.imageUrl || "", // Compatibility avec l'ancien schéma
        }
      });

      console.log(`✅ Article "${article.title}" créé avec succès.`);
    } catch (error) {
      console.error(`❌ Erreur lors de la création de l'article "${article.title}":`, error);
    }
  }

  console.log('🎉 Seeding des articles terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 