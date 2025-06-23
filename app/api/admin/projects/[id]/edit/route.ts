import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    // Récupération et traitement des données
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as string;
    const date = formData.get("date") as string;
    const duration = formData.get("duration") as string;
    const client = formData.get("client") as string;
    const description = formData.get("description") as string;
    const longDescription = formData.get("longDescription") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const githubUrl = (formData.get("githubUrl") as string) || "";
    const liveUrl = (formData.get("liveUrl") as string) || "";

    // Traitement des arrays (séparées par virgules)
    const tagsString = (formData.get("tags") as string) || "";
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const technologiesString = (formData.get("technologies") as string) || "";
    const technologies = technologiesString
      ? technologiesString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const featuresString = (formData.get("features") as string) || "";
    const features = featuresString
      ? featuresString
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      : [];

    const imagesString = (formData.get("images") as string) || "";
    const images = imagesString
      ? imagesString
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    // Traitement des booleans
    const featured = formData.get("featured") === "true";
    const isPublished = formData.get("isPublished") === "true";

    // Récupérer l'ancien slug pour la revalidation
    const existingProject = await prisma.project.findUnique({
      where: { id },
      select: { slug: true },
    });

    // Mise à jour du projet
    await prisma.project.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        status,
        date,
        duration,
        client,
        description,
        longDescription,
        imageUrl,
        githubUrl,
        liveUrl,
        tags,
        technologies,
        features,
        images,
        featured,
        isPublished,
      },
    });

    // Revalidation des pages concernées
    revalidatePath("/projects"); // Page de liste des projets
    revalidatePath("/"); // Page d'accueil (projets en vedette)

    // Revalider l'ancienne et la nouvelle page du projet si le slug a changé
    if (existingProject?.slug) {
      revalidatePath(`/projects/${existingProject.slug}`);
    }
    if (slug && slug !== existingProject?.slug) {
      revalidatePath(`/projects/${slug}`);
    }

    // Revalider par tag pour toutes les pages de projets
    revalidateTag("projects");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la modification du projet:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la modification du projet" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
