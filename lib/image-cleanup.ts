import { createScriptClient } from "@/utils/supabase/scripts";
import { prisma } from "./prisma";

/**
 * Extrait le nom du fichier d'une URL Supabase Storage
 */
function extractFileNameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    return pathParts[pathParts.length - 1];
  } catch {
    return null;
  }
}

/**
 * Vérifie si une URL appartient à notre bucket Supabase
 */
function isSupabaseStorageUrl(url: string): boolean {
  return url.includes("supabase.co/storage/") && url.includes("project-images");
}

/**
 * Récupère toutes les références d'images dans la base de données
 */
async function getAllImageReferences(): Promise<Set<string>> {
  const imageUrls = new Set<string>();

  try {
    // Images des projets
    const projects = await prisma.project.findMany({
      select: { id: true, imageUrl: true, images: true },
    });

    projects.forEach((project) => {
      // Image principale
      if (project.imageUrl && isSupabaseStorageUrl(project.imageUrl)) {
        const fileName = extractFileNameFromUrl(project.imageUrl);
        if (fileName) imageUrls.add(fileName);
      }

      // Images secondaires
      if (project.images && Array.isArray(project.images)) {
        project.images.forEach((url) => {
          if (isSupabaseStorageUrl(url)) {
            const fileName = extractFileNameFromUrl(url);
            if (fileName) imageUrls.add(fileName);
          }
        });
      }
    });


    // Images des profils
    const profiles = await prisma.profile.findMany({
      select: { id: true, avatarUrl: true },
    });

    profiles.forEach((profile) => {
      if (profile.avatarUrl && isSupabaseStorageUrl(profile.avatarUrl)) {
        const fileName = extractFileNameFromUrl(profile.avatarUrl);
        if (fileName) imageUrls.add(fileName);
      }
    });

    console.log(
      `🔍 Trouvé ${imageUrls.size} images référencées dans la base de données`
    );
    return imageUrls;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des références d'images:",
      error
    );
    throw error;
  }
}

/**
 * Récupère tous les fichiers du bucket Supabase Storage
 */
async function getAllStorageFiles(): Promise<string[]> {
  try {
    const supabaseScript = createScriptClient();
    const { data: files, error } = await supabaseScript.storage
      .from("project-images")
      .list("", {
        limit: 1000,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      throw new Error(`Erreur Supabase Storage: ${error.message}`);
    }

    const fileNames = files?.map((file) => file.name) || [];
    console.log(`📁 Trouvé ${fileNames.length} fichiers dans le storage`);
    return fileNames;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des fichiers du storage:",
      error
    );
    throw error;
  }
}

/**
 * Supprime les images orphelines du storage
 */
async function deleteOrphanedImages(orphanedFiles: string[]): Promise<void> {
  if (orphanedFiles.length === 0) {
    console.log("✅ Aucune image orpheline trouvée");
    return;
  }

  try {
    // Supprimer par lots pour éviter les timeouts
    const supabaseScript = createScriptClient();
    const batchSize = 10;
    let deletedCount = 0;

    for (let i = 0; i < orphanedFiles.length; i += batchSize) {
      const batch = orphanedFiles.slice(i, i + batchSize);

      const { error } = await supabaseScript.storage
        .from("project-images")
        .remove(batch);

      if (error) {
        console.error(
          `❌ Erreur lors de la suppression du lot ${Math.floor(i / batchSize) + 1}:`,
          error
        );
      } else {
        deletedCount += batch.length;
        console.log(
          `🗑️  Lot ${Math.floor(i / batchSize) + 1}: ${batch.length} images supprimées`
        );
      }

      // Pause entre les lots pour éviter la surcharge
      if (i + batchSize < orphanedFiles.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `✅ Nettoyage terminé: ${deletedCount}/${orphanedFiles.length} images orphelines supprimées`
    );
  } catch (error) {
    console.error(
      "❌ Erreur lors de la suppression des images orphelines:",
      error
    );
    throw error;
  }
}

/**
 * Fonction principale de nettoyage des images
 */
export async function cleanupOrphanedImages(): Promise<{
  totalFiles: number;
  referencedFiles: number;
  orphanedFiles: number;
  deletedFiles: number;
}> {
  console.log("🧹 Début du nettoyage des images orphelines...");

  try {
    // Récupérer toutes les références et tous les fichiers en parallèle
    const [imageReferences, storageFiles] = await Promise.all([
      getAllImageReferences(),
      getAllStorageFiles(),
    ]);

    // Identifier les fichiers orphelins
    const orphanedFiles = storageFiles.filter((fileName) => {
      return !imageReferences.has(fileName);
    });

    console.log(`📊 Résumé:`);
    console.log(`   - Fichiers dans le storage: ${storageFiles.length}`);
    console.log(`   - Images référencées: ${imageReferences.size}`);
    console.log(`   - Images orphelines: ${orphanedFiles.length}`);

    if (orphanedFiles.length > 0) {
      console.log(`🗑️  Images orphelines à supprimer:`, orphanedFiles);
      await deleteOrphanedImages(orphanedFiles);
    }

    return {
      totalFiles: storageFiles.length,
      referencedFiles: imageReferences.size,
      orphanedFiles: orphanedFiles.length,
      deletedFiles: orphanedFiles.length,
    };
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage des images:", error);
    throw error;
  }
}

/**
 * Version de test qui n'effectue pas la suppression
 */
export async function dryRunCleanup(): Promise<string[]> {
  console.log("🔍 Test de nettoyage (pas de suppression)...");

  try {
    const [imageReferences, storageFiles] = await Promise.all([
      getAllImageReferences(),
      getAllStorageFiles(),
    ]);

    const orphanedFiles = storageFiles.filter((fileName) => {
      return !imageReferences.has(fileName);
    });

    console.log(`📊 Images orphelines qui seraient supprimées:`, orphanedFiles);
    return orphanedFiles;
  } catch (error) {
    console.error("❌ Erreur lors du test de nettoyage:", error);
    throw error;
  }
}
