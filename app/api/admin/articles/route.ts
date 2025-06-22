import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
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
    const imageUrl = (formData.get("imageUrl") as string) || "";

    // Traitement des arrays (séparées par virgules)
    const tagsString = (formData.get("tags") as string) || "";
    const tags = tagsString
      ? tagsString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // Traitement des booleans
    const featured = formData.get("featured") === "true";
    const isPublished = formData.get("isPublished") === "true";

    // Validation des données
    if (!title || !excerpt || !content || !author || !category) {
      return new Response(
        JSON.stringify({
          error: "Tous les champs obligatoires doivent être remplis",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Créer l'article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        author,
        category,
        readTime,
        imageUrl,
        tags,
        featured,
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
      },
    });

    return new Response(JSON.stringify({ success: true, article }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'article:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
