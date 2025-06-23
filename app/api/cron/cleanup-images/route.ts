import { cleanupOrphanedImages, dryRunCleanup } from '@/lib/image-cleanup';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'autorisation (clé secrète ou authentification)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer le paramètre dry-run
    const searchParams = request.nextUrl.searchParams;
    const isDryRun = searchParams.get('dry-run') === 'true';

    if (isDryRun) {
      // Mode test - ne supprime pas réellement
      const orphanedFiles = await dryRunCleanup();
      
      return NextResponse.json({
        success: true,
        mode: 'dry-run',
        message: 'Test de nettoyage effectué',
        orphanedFiles,
        count: orphanedFiles.length,
        timestamp: new Date().toISOString()
      });
    } else {
      // Mode réel - supprime les images orphelines
      const result = await cleanupOrphanedImages();
      
      return NextResponse.json({
        success: true,
        mode: 'production',
        message: 'Nettoyage des images terminé',
        ...result,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans la tâche cron de nettoyage:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du nettoyage des images',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Permettre aussi les requêtes POST pour plus de flexibilité
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const isDryRun = body.dryRun === true;

    if (isDryRun) {
      const orphanedFiles = await dryRunCleanup();
      
      return NextResponse.json({
        success: true,
        mode: 'dry-run',
        message: 'Test de nettoyage effectué',
        orphanedFiles,
        count: orphanedFiles.length,
        timestamp: new Date().toISOString()
      });
    } else {
      const result = await cleanupOrphanedImages();
      
      return NextResponse.json({
        success: true,
        mode: 'production',
        message: 'Nettoyage des images terminé',
        ...result,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Erreur dans la tâche cron de nettoyage:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du nettoyage des images',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 