import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Récupérer l'ancien slug pour la revalidation
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { slug: true }
    });

    // Mise à jour du projet
    await prisma.project.delete({
      where: { id },
    });

    // Revalidation des pages concernées
    revalidatePath("/projects"); // Page de liste des projets
    revalidatePath("/"); // Page d'accueil (projets en vedette)

    // Revalider l'ancienne et la nouvelle page du projet car il a été supprimé
    if (existingProject?.slug) {
      revalidatePath(`/projects/${existingProject.slug}`);
    }

    // Revalider par tag pour toutes les pages de projets
    revalidateTag("projects");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la suppression du projet" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}