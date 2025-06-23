# Configuration des tâches Cron avec Supabase

Ce guide explique comment configurer le nettoyage automatique des images en utilisant les tâches cron intégrées de Supabase.

## 🚀 Avantages de Supabase Cron

- ✅ **Intégré** : Pas besoin de service externe
- ✅ **Gratuit** : Inclus dans Supabase
- ✅ **Fiable** : Géré par Supabase infrastructure  
- ✅ **Logs** : Suivi des exécutions dans la base
- ✅ **Contrôle** : Gestion via SQL

## 📋 Prérequis

1. **Projet Supabase** avec base de données
2. **Application déployée** (Vercel, Netlify, etc.)
3. **Variable CRON_SECRET** configurée

## 🛠️ Installation

### Étape 1: Activer les extensions

Dans le **SQL Editor** de votre dashboard Supabase, exécutez :

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Étape 2: Configurer la fonction

Copiez et modifiez le script `scripts/setup-supabase-cron.sql` :

1. **Remplacez** `VOTRE_DOMAINE.vercel.app` par votre vraie URL
2. **Remplacez** `VOTRE_CRON_SECRET` par votre clé secrète
3. **Exécutez** le script dans le SQL Editor

### Étape 3: Vérifier l'installation

```sql
-- Voir les tâches programmées
SELECT jobid, schedule, command, active, jobname 
FROM cron.job;

-- Tester manuellement
SELECT cleanup_images_job();
```

## 📅 Planification

La tâche est programmée pour s'exécuter :
- **Quand** : Chaque dimanche à 3h UTC
- **Cron** : `0 3 * * 0`
- **Action** : Nettoyage automatique des images orphelines

### Modifier l'horaire

```sql
-- Changer pour tous les jours à minuit
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'cleanup-images-weekly'),
  schedule := '0 0 * * *'
);

-- Changer pour tous les lundis à 2h
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'cleanup-images-weekly'), 
  schedule := '0 2 * * 1'
);
```

## 📊 Monitoring

### Voir les logs d'exécution

```sql
-- 10 dernières exécutions
SELECT 
  start_time,
  end_time,
  status,
  return_message
FROM cron.job_run_details 
WHERE job_name = 'cleanup-images-weekly'
ORDER BY start_time DESC 
LIMIT 10;
```

### Statistiques

```sql
-- Compter les succès/échecs
SELECT 
  status,
  COUNT(*) as count
FROM cron.job_run_details 
WHERE job_name = 'cleanup-images-weekly'
GROUP BY status;
```

## 🔧 Gestion

### Désactiver temporairement

```sql
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'cleanup-images-weekly'),
  active := false
);
```

### Réactiver

```sql
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'cleanup-images-weekly'),
  active := true
);
```

### Supprimer définitivement

```sql
SELECT cron.unschedule('cleanup-images-weekly');
```

## 🔐 Sécurité

### Variables d'environnement requises

```env
# Dans votre .env.local et variables de production
CRON_SECRET="votre_clé_secrète_très_longue_et_complexe"
```

### Authentification

La fonction fait un appel HTTP avec l'en-tête :
```
Authorization: Bearer YOUR_CRON_SECRET
```

## 🐛 Dépannage

### Problème : Tâche ne s'exécute pas

1. **Vérifier** que les extensions sont activées
2. **Vérifier** l'URL de votre application
3. **Vérifier** la clé secrète
4. **Tester** manuellement : `SELECT cleanup_images_job();`

### Problème : Erreur HTTP

```sql
-- Tester une requête simple
SELECT status, content FROM http((
  'GET',
  'https://httpbin.org/get',
  ARRAY[http_header('User-Agent', 'Supabase-Cron')],
  NULL,
  NULL
));
```

### Problème : Logs vides

```sql
-- Vérifier que la tâche existe
SELECT * FROM cron.job WHERE jobname = 'cleanup-images-weekly';

-- Forcer une exécution
SELECT cleanup_images_job();
```

## 📝 Expressions Cron

| Expression | Description |
|------------|-------------|
| `0 3 * * 0` | Dimanche 3h UTC |
| `0 0 * * *` | Tous les jours minuit |
| `0 2 * * 1` | Lundi 2h UTC |
| `0 0 1 * *` | 1er du mois minuit |
| `0 */6 * * *` | Toutes les 6h |

## 🎯 Bonnes pratiques

1. **Test** d'abord en mode dry-run
2. **Logs** réguliers pour surveiller
3. **Backup** avant le premier nettoyage
4. **URL HTTPS** obligatoire pour les webhooks
5. **Timeout** : Supabase a une limite de 30s par requête

## 📞 Support

Si vous avez des problèmes :

1. Vérifiez les logs : `SELECT * FROM cron.job_run_details`
2. Testez manuellement : `SELECT cleanup_images_job();`
3. Consultez la documentation Supabase Cron
4. Utilisez l'interface admin : `/admin/images` 