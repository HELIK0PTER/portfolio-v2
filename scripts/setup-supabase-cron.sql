-- Script pour configurer les tâches cron dans Supabase
-- À exécuter dans le SQL Editor de votre dashboard Supabase

-- 1. Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Créer une fonction pour nettoyer les images via HTTP
CREATE OR REPLACE FUNCTION cleanup_images_job()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response_status integer;
  response_content text;
  cleanup_url text;
  app_url text := ''; -- Remplacez par votre vraie URL
  cron_secret text := ''; -- Remplacez par votre vraie clé secrète
BEGIN
  -- Construire l'URL de nettoyage
  cleanup_url := app_url || '/api/cron/cleanup-images';
  
  -- Faire la requête HTTP POST pour déclencher le nettoyage
  SELECT status, content INTO response_status, response_content
  FROM http((
    'POST',
    cleanup_url,
    ARRAY[
      http_header('Authorization', 'Bearer ' || cron_secret),
      http_header('Content-Type', 'application/json')
    ],
    'application/json',
    '{"dryRun": false}'
  ));
  
  -- Log du résultat
  IF response_status = 200 THEN
    RAISE NOTICE 'Nettoyage des images réussi: %', response_content;
  ELSE
    RAISE WARNING 'Erreur lors du nettoyage des images (status %): %', response_status, response_content;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Exception lors du nettoyage des images: %', SQLERRM;
END;
$$;

-- 3. Programmer la tâche cron (chaque dimanche à 3h du matin, fuseau UTC)
SELECT cron.schedule(
  'cleanup-images-weekly',     -- nom de la tâche
  '0 3 * * 0',                -- cron expression (dimanche 3h UTC)
  'SELECT cleanup_images_job();'
);

-- 4. Voir les tâches programmées
SELECT 
  jobid, 
  schedule, 
  command,
  active,
  jobname
FROM cron.job; 