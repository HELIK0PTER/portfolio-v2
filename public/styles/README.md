# 🎨 Système de Thèmes Dynamiques

Ce dossier contient les fichiers de thèmes personnalisés pour le portfolio. Le système détecte automatiquement les nouveaux thèmes et les rend disponibles dans le sélecteur de thème.

## 📁 Structure des fichiers

Chaque thème doit suivre la convention de nommage : `theme-[id].css`

Exemples :
- `theme-blue-bubblegum.css` → Thème "Bleu Bubblegum"
- `theme-dark-purple.css` → Thème "Violet Sombre"
- `theme-green-nature.css` → Thème "Vert Nature"

## ✨ Comment créer un nouveau thème

### 1. Créer le fichier CSS

Créez un nouveau fichier `theme-[votre-id].css` dans ce dossier avec la structure suivante :

```css
/* Votre nom de thème */
:root {
  /* Variables pour le mode clair */
  --background: [couleur];
  --foreground: [couleur];
  --primary: [couleur];
  --primary-foreground: [couleur];
  --secondary: [couleur];
  --secondary-foreground: [couleur];
  --muted: [couleur];
  --muted-foreground: [couleur];
  --accent: [couleur];
  --accent-foreground: [couleur];
  --destructive: [couleur];
  --destructive-foreground: [couleur];
  --border: [couleur];
  --input: [couleur];
  --ring: [couleur];
  --chart-1: [couleur];
  --chart-2: [couleur];
  --chart-3: [couleur];
  --chart-4: [couleur];
  --chart-5: [couleur];
  --font-sans: [police], sans-serif;
  --radius: [valeur];
}

.dark {
  /* Variables pour le mode sombre */
  --background: [couleur];
  --foreground: [couleur];
  /* ... autres variables ... */
}
```

### 2. Ajouter le thème à la liste

Dans `components/layout/theme-selector.tsx`, ajoutez votre thème à la liste `knownThemes` :

```typescript
const knownThemes = [
  // ... thèmes existants ...
  { 
    id: "votre-id", 
    name: "Votre Nom de Thème", 
    description: "Description de votre thème" 
  },
]
```

### 3. C'est tout ! 🎉

Le système détectera automatiquement votre nouveau thème et l'ajoutera au sélecteur de thème.

## 🎨 Format des couleurs

Utilisez le format **OKLCH** pour une meilleure cohérence :
- `oklch(lightness chroma hue)`
- Exemple : `oklch(0.7000 0.1500 285.0000)`

## 📖 Variables disponibles

### Couleurs principales
- `--background` : Arrière-plan principal
- `--foreground` : Texte principal
- `--primary` : Couleur primaire (boutons, liens)
- `--primary-foreground` : Texte sur couleur primaire

### Couleurs secondaires
- `--secondary` : Couleur secondaire
- `--muted` : Couleurs atténuées
- `--accent` : Couleur d'accent
- `--destructive` : Couleur pour actions destructives

### Interface
- `--border` : Bordures
- `--input` : Champs de saisie
- `--ring` : Contours de focus

### Graphiques
- `--chart-1` à `--chart-5` : Couleurs pour les graphiques

### Typographie
- `--font-sans` : Police principale
- `--radius` : Rayon des bordures arrondies

## 🔄 Modes clair/sombre

Chaque thème doit définir les variables pour :
- **`:root`** → Mode clair (par défaut)
- **`.dark`** → Mode sombre

Le système de mode sombre de Next.js basculera automatiquement entre les deux.

## 🚀 Fonctionnement technique

1. **Auto-détection** : Le composant `ThemeSelector` vérifie l'existence des fichiers
2. **Parsing automatique** : Les variables CSS sont extraites et parsées
3. **Injection dynamique** : Les variables sont injectées dans le DOM
4. **Sauvegarde** : Le choix est sauvegardé dans localStorage
5. **Restauration** : Le thème est restauré au rechargement de la page

## 💡 Conseils

- Testez votre thème en mode clair ET sombre
- Assurez-vous que le contraste est suffisant pour l'accessibilité
- Utilisez des couleurs cohérentes dans la même famille
- Les polices doivent être disponibles (Google Fonts ou système) 