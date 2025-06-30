# Portfolio V2 - Développeur Full Stack

Un portfolio moderne et dynamique construit avec **Next.js 15**, **Better Auth**, **Prisma**, **Supabase** et **TailwindCSS**.

## 🚀 Fonctionnalités

- ✅ **Next.js 15** avec App Router
- ✅ **Better Auth** pour l'authentification admin
- ✅ **Prisma** avec PostgreSQL pour la base de données
- ✅ **ShadCN UI** pour les composants
- ✅ **Supabase Storage** pour les images
- ✅ **Resend** pour les emails de contact
- ✅ **Framer Motion** pour les animations
- ✅ **Dark/Light mode** avec next-themes
- ✅ **SEO optimisé** (meta tags, og:image, sitemap)
- ✅ **Interface admin** privée pour gérer le contenu
- ✅ **TypeScript** complet

## 🎯 Sections du Portfolio

- **Accueil** - Présentation et projets sélectionnés
- **Projets** - Portfolio de projets avec détails
- **Services** - Prestations proposées
- **Labs** - Expérimentations et mini-projets
- **Blog** - Articles et tutoriels
- **Contact** - Formulaire de contact avec envoi d'email
- **Admin** - Interface privée pour gérer tout le contenu

## 📦 Installation

### 1. Cloner le projet
\`\`\`bash
git clone <votre-repo>
cd portfolio-v2
\`\`\`

### 2. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

### 3. Configuration des variables d'environnement

Créez un fichier \`.env\` à la racine du projet avec ces variables :

\`\`\`env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_v2"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-change-this-in-production-must-be-32-chars"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Admin autorisé
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"

# Supabase (Storage uniquement)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Resend (Email)
RESEND_API_KEY="your-resend-api-key"
CONTACT_EMAIL="contact@example.com"

# Site URL (pour SEO)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
\`\`\`

### 4. Configuration de la base de données

\`\`\`bash
# Générer le client Prisma
npm run db:generate

# Créer les tables dans la base de données
npm run db:push

# Créer l'utilisateur admin
npm run create-admin
\`\`\`

### 5. Lancer le projet

\`\`\`bash
npm run dev
\`\`\`

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration des services

### PostgreSQL
- Installez PostgreSQL localement ou utilisez un service cloud (Supabase, Render, etc.)
- Créez une base de données et configurez \`DATABASE_URL\`

### Supabase (Storage)
1. Créez un projet Supabase
2. Allez dans Storage et créez les buckets : \`projects\`, \`articles\`, \`profile\`
3. Configurez les variables Supabase dans \`.env\`

### Resend (Email)
1. Créez un compte sur [Resend](https://resend.com)
2. Générez une clé API
3. Configurez votre domaine pour l'envoi d'emails

### Better Auth
- Générez une clé secrète de 32 caractères pour \`BETTER_AUTH_SECRET\`
- L'authentification est configurée pour un seul admin via email/password

## 📝 Scripts disponibles

\`\`\`bash
# Développement
npm run dev

# Build production
npm run build
npm start

# Base de données
npm run db:generate      # Générer le client Prisma
npm run db:push         # Pousser le schéma vers la DB
npm run db:migrate      # Créer une migration
npm run db:studio       # Interface graphique Prisma

# Admin
npm run create-admin    # Créer l'utilisateur admin
\`\`\`

## 🎨 Personnalisation

### Couleurs et thème
Modifiez les variables CSS dans \`app/globals.css\` pour personnaliser les couleurs.

### Composants
Tous les composants UI sont basés sur ShadCN et se trouvent dans \`components/ui/\`.

### Contenu
- Modifiez \`app/page.tsx\` pour la page d'accueil
- Créez des pages dans \`app/\` pour les nouvelles sections
- Gérez le contenu via l'interface admin sur \`/admin\`

## 🛡️ Sécurité

- L'interface admin est protégée par authentification
- Seul l'email défini dans \`ADMIN_EMAIL\` peut se connecter
- Les sessions sont gérées par Better Auth avec cookies sécurisés
- Le middleware protège automatiquement les routes \`/admin/*\`

## 🚀 Déploiement

### Vercel (recommandé)
1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement
4. Vérifiez que `NEXT_PUBLIC_SITE_URL` pointe vers votre domaine afin que les routes `/sitemap.xml` et `/robots.txt` soient correctement générées. Une fois le déploiement terminé, elles doivent être accessibles.

### Autres plateformes
Le projet est compatible avec toute plateforme supportant Next.js (Netlify, Railway, etc.)

## 📚 Technologies utilisées

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Authentification** : Better Auth
- **Base de données** : PostgreSQL + Prisma
- **Styling** : TailwindCSS + ShadCN UI
- **Animations** : Framer Motion
- **Storage** : Supabase
- **Email** : Resend
- **Déploiement** : Vercel

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier \`LICENSE\` pour plus de détails.

---

**Créé avec ❤️ et Next.js**
