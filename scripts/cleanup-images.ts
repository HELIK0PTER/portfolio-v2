#!/usr/bin/env tsx

import { cleanupOrphanedImages, dryRunCleanup } from '../lib/image-cleanup';

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run') || args.includes('-d');
  const isVerbose = args.includes('--verbose') || args.includes('-v');

  console.log('🧹 Script de nettoyage des images orphelines');
  console.log('='.repeat(50));

  if (isDryRun) {
    console.log('🔍 Mode TEST - Aucune suppression ne sera effectuée\n');
    
    try {
      const orphanedFiles = await dryRunCleanup();
      
      console.log('\n📊 Résultats du test:');
      console.log(`   - Images orphelines trouvées: ${orphanedFiles.length}`);
      
      if (isVerbose && orphanedFiles.length > 0) {
        console.log('\n📋 Liste des images orphelines:');
        orphanedFiles.forEach((file, index) => {
          console.log(`   ${index + 1}. ${file}`);
        });
      }
      
      if (orphanedFiles.length > 0) {
        console.log('\n💡 Pour supprimer ces images, exécutez:');
        console.log('   npm run cleanup-images');
      } else {
        console.log('\n✅ Aucune image orpheline à supprimer !');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      process.exit(1);
    }
  } else {
    console.log('🚨 Mode PRODUCTION - Les images orphelines seront supprimées\n');
    
    // Demander confirmation
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise<string>((resolve) => {
      rl.question('Êtes-vous sûr de vouloir supprimer les images orphelines ? (y/N): ', resolve);
    });
    
    rl.close();

    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('❌ Opération annulée');
      process.exit(0);
    }

    try {
      const result = await cleanupOrphanedImages();
      
      console.log('\n📊 Résultats du nettoyage:');
      console.log(`   - Fichiers dans le storage: ${result.totalFiles}`);
      console.log(`   - Images référencées: ${result.referencedFiles}`);
      console.log(`   - Images orphelines: ${result.orphanedFiles}`);
      console.log(`   - Images supprimées: ${result.deletedFiles}`);
      
      if (result.deletedFiles > 0) {
        console.log(`\n✅ Nettoyage terminé ! ${result.deletedFiles} images supprimées`);
      } else {
        console.log('\n✅ Aucune image à supprimer !');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
      process.exit(1);
    }
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Exception non capturée:', error);
  process.exit(1);
});

main().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
}); 