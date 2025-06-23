import { createClient } from '@supabase/supabase-js'

export function createScriptClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '❌ Variables d\'environnement manquantes:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n' +
      'Vérifiez votre fichier .env'
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// Instance partagée pour les scripts
export const supabaseScript = createScriptClient(); 