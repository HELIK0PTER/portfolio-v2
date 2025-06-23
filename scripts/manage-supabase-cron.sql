-- Script de gestion des tâches cron Supabase
-- Utilisez ces requêtes dans le SQL Editor pour gérer vos tâches

-- =====================================================
-- CONSULTER LES TÂCHES
-- =====================================================

-- Voir toutes les tâches cron
SELECT 
  jobid, 
  schedule, 
  command,
  active,
  jobname,
  nodename,
  nodeport,
  database,
  username
FROM cron.job
ORDER BY jobid;

-- Voir les logs des exécutions (10 dernières)
SELECT 
  jobid,
  job_name,
  start_time,
  end_time,
  status,
  return_message,
  command
FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;

-- Voir les logs d'une tâche spécifique
SELECT 
  start_time,
  end_time,
  status,
  return_message
FROM cron.job_run_details 
WHERE job_name = 'cleanup-images-weekly'
ORDER BY start_time DESC 
LIMIT 5;

-- =====================================================
-- GÉRER LES TÂCHES
-- =====================================================

-- Désactiver la tâche de nettoyage
-- SELECT cron.alter_job(
--   job_id := (SELECT jobid FROM cron.job WHERE jobname = 'cleanup-images-weekly'),
--   schedule := NULL,
--   command := NULL,
--   database := NULL,
--   username := NULL,
--   active := false
-- );

-- Réactiver la tâche de nettoyage
-- SELECT cron.alter_job(
--   job_id := (SELECT jobid FROM cron.job WHERE jobname = 'cleanup-images-weekly'),
--   active := true
-- );

-- Modifier l'horaire (par exemple tous les jours à minuit)
-- SELECT cron.alter_job(
--   job_id := (SELECT jobid FROM cron.job WHERE jobname = 'cleanup-images-weekly'),
--   schedule := '0 0 * * *'
-- );

-- Supprimer complètement la tâche
-- SELECT cron.unschedule('cleanup-images-weekly');

-- =====================================================
-- TESTER LES FONCTIONS
-- =====================================================

-- Tester la fonction de nettoyage manuellement
-- SELECT cleanup_images_job();

-- Tester une requête HTTP simple
-- SELECT status, content FROM http((
--   'GET',
--   'https://httpbin.org/get',
--   ARRAY[http_header('User-Agent', 'Supabase-Cron')],
--   NULL,
--   NULL
-- ));

-- =====================================================
-- CRÉER DES TÂCHES SUPPLÉMENTAIRES
-- =====================================================

-- Créer une tâche de test (mode dry-run) quotidienne
-- CREATE OR REPLACE FUNCTION test_cleanup_images_job()
-- RETURNS void
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- DECLARE
--   response_status integer;
--   response_content text;
--   cleanup_url text;
--   app_url text := 'https://VOTRE_DOMAINE.vercel.app';
--   cron_secret text := 'VOTRE_CRON_SECRET';
-- BEGIN
--   cleanup_url := app_url || '/api/cron/cleanup-images?dry-run=true';
--   
--   SELECT status, content INTO response_status, response_content
--   FROM http((
--     'GET',
--     cleanup_url,
--     ARRAY[
--       http_header('Authorization', 'Bearer ' || cron_secret)
--     ],
--     NULL,
--     NULL
--   ));
--   
--   IF response_status = 200 THEN
--     RAISE NOTICE 'Test de nettoyage réussi: %', response_content;
--   ELSE
--     RAISE WARNING 'Erreur test nettoyage (status %): %', response_status, response_content;
--   END IF;
--   
-- EXCEPTION
--   WHEN OTHERS THEN
--     RAISE WARNING 'Exception test nettoyage: %', SQLERRM;
-- END;
-- $$;

-- Programmer le test quotidien
-- SELECT cron.schedule(
--   'test-cleanup-images-daily',
--   '0 2 * * *',
--   'SELECT test_cleanup_images_job();'
-- );

-- =====================================================
-- STATISTIQUES
-- =====================================================

-- Compter les exécutions par statut
SELECT 
  status,
  COUNT(*) as count
FROM cron.job_run_details 
WHERE job_name = 'cleanup-images-weekly'
GROUP BY status;

-- Voir la dernière exécution réussie
SELECT 
  start_time,
  end_time,
  return_message
FROM cron.job_run_details 
WHERE job_name = 'cleanup-images-weekly' 
  AND status = 'succeeded'
ORDER BY start_time DESC 
LIMIT 1; 