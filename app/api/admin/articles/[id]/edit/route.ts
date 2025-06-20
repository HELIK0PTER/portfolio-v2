import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    
    // Récupération et traitement des données
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    const category = formData.get("category") as string;
    const readTimeString = formData.get("readTime") as string;
    const readTime = parseInt(readTimeString) || 5;
    const imageUrl = formData.get("imageUrl") as string || "";
    
    // Traitement des arrays (séparées par virgules)
    const tagsString = formData.get("tags") as string || "";
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
    
    // Traitement des booleans
    const featured = formData.get("featured") === "true";
    const isPublished = formData.get("isPublished") === "true";
    
    // Validation des données
    if (!title || !excerpt || !content || !author || !category) {
      return new Response(JSON.stringify({ error: "Tous les champs obligatoires doivent être remplis" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Vérifier que l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!existingArticle) {
      return new Response(JSON.stringify({ error: "Article non trouvé" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Vérifier que le slug n'est pas déjà utilisé par un autre article
    if (slug !== existingArticle.slug) {
              const existingSlug = await prisma.article.findFirst({
          where: {
            slug,
            id: { not: id },
          },
        });

      if (existingSlug) {
        return new Response(JSON.stringify({ error: "Ce slug est déjà utilisé par un autre article" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    
    // Mise à jour de l'article
    await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        author,
        category,
        readTime,
        imageUrl: imageUrl || null,
        tags,
        featured,
        isPublished,
        updatedAt: new Date(),
      },
    });
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la modification de l'article:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la modification de l'article" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 