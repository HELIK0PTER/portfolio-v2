"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, RefreshCw, AlertTriangle, CheckCircle, FileImage } from 'lucide-react';

interface CleanupResult {
  success: boolean;
  mode: 'dry-run' | 'production';
  message: string;
  orphanedFiles?: string[];
  totalFiles?: number;
  referencedFiles?: number;
  deletedFiles?: number;
  count?: number;
  timestamp: string;
  error?: string;
  details?: string;
}

export function ImageCleanupManager() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  async function handleScan() {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/cron/cleanup-images?dry-run=true');
      const data = await response.json();
      
      setResult(data);
      setLastScan(new Date());
    } catch {
      setResult({
        success: false,
        mode: 'dry-run',
        message: 'Erreur lors du scan',
        error: 'Impossible de se connecter au serveur',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleCleanup() {
    if (!result || !result.orphanedFiles || result.orphanedFiles.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${result.orphanedFiles.length} images orphelines ?\n\nCette action est irréversible.`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch('/api/cron/cleanup-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dryRun: false }),
      });

      const data = await response.json();
      setResult(data);
      
      // Rafraîchir après le nettoyage
      setTimeout(() => {
        handleScan();
      }, 1000);
      
    } catch {
      setResult({
        success: false,
        mode: 'production',
        message: 'Erreur lors du nettoyage',
        error: 'Impossible de se connecter au serveur',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  }

  const hasOrphanedImages = result?.orphanedFiles && result.orphanedFiles.length > 0;
  const isCleanupResult = result?.mode === 'production';

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {`Actions de nettoyage`}
          </CardTitle>
          <CardDescription>
            {`Analysez et nettoyez les images orphelines de votre stockage Supabase`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={handleScan}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? `Scan en cours...` : `Scanner les images`}
            </Button>

            {hasOrphanedImages && !isCleanupResult && (
              <Button
                onClick={handleCleanup}
                disabled={loading}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {`Supprimer ${result.orphanedFiles?.length} images`}
              </Button>
            )}
          </div>

          {lastScan && (
            <p className="text-sm text-muted-foreground">
              {`Dernier scan: ${lastScan.toLocaleString('fr-FR')}`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
              {`Résultats`}
              <Badge variant={result.mode === 'dry-run' ? 'secondary' : 'destructive'}>
                {result.mode === 'dry-run' ? `TEST` : `RÉEL`}
              </Badge>
            </CardTitle>
            <CardDescription>
              {result.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.success ? (
              <>
                {/* Statistiques */}
                {result.mode === 'dry-run' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.count || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {`Images orphelines`}
                      </div>
                    </div>
                  </div>
                )}

                {result.mode === 'production' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.totalFiles || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {`Total fichiers`}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {result.referencedFiles || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {`Images utilisées`}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {result.orphanedFiles || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {`Images orphelines`}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {result.deletedFiles || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {`Images supprimées`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Liste des images orphelines */}
                {result.orphanedFiles && result.orphanedFiles.length > 0 && result.mode === 'dry-run' && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      {`Images orphelines trouvées:`}
                    </h4>
                    <div className="bg-muted/30 p-4 rounded-lg max-h-60 overflow-y-auto">
                      <ul className="space-y-1">
                        {result.orphanedFiles.map((file, index) => (
                          <li key={index} className="text-sm font-mono text-muted-foreground">
                            {index + 1}. {file}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {result.mode === 'production' && result.deletedFiles && result.deletedFiles > 0 && (
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      ✅ {`Nettoyage terminé avec succès !`}
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                      {result.deletedFiles} {`images orphelines ont été supprimées.`}
                    </p>
                  </div>
                )}

                {result.mode === 'production' && result.deletedFiles === 0 && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-200 font-medium">
                      ℹ️ {`Aucune image à supprimer`}
                    </p>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                      {`Toutes vos images sont correctement référencées.`}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-red-800 dark:text-red-200 font-medium">
                  ❌ {result.error || `Une erreur s'est produite`}
                </p>
                {result.details && (
                  <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                    {result.details}
                  </p>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {`Timestamp: ${new Date(result.timestamp).toLocaleString('fr-FR')}`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Informations */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration recommandée</CardTitle>
          <CardDescription>
            Pour automatiser le nettoyage des images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Tâche cron automatique</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Ajoutez cette URL à votre service de cron (Vercel Cron, GitHub Actions, etc.) :
            </p>
            <code className="bg-background p-2 rounded border text-xs block break-all">
              {`${window.location.origin}/api/cron/cleanup-images`}
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Recommandé : 1 fois par semaine à 3h du matin
            </p>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{`Variables d'environnement`}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {`Ajoutez ces variables pour sécuriser l'endpoint :`}
            </p>
            <code className="bg-background p-2 rounded border text-xs block">
              CRON_SECRET=votre_clé_secrète_ici
            </code>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{`Scripts manuels`}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {`Exécutez ces commandes depuis votre terminal :`}
            </p>
            <div className="space-y-2">
              <code className="bg-background p-2 rounded border text-xs block">
                npm run cleanup-images:dry-run
              </code>
              <code className="bg-background p-2 rounded border text-xs block">
                npm run cleanup-images
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 