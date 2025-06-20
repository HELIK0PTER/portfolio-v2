import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
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
    const githubUrl = formData.get("githubUrl") as string || "";
    const liveUrl = formData.get("liveUrl") as string || "";
    
    // Traitement des arrays (séparées par virgules)
    const tagsString = formData.get("tags") as string || "";
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
    
    const technologiesString = formData.get("technologies") as string || "";
    const technologies = technologiesString ? technologiesString.split(",").map(t => t.trim()).filter(Boolean) : [];
    
    const featuresString = formData.get("features") as string || "";
    const features = featuresString ? featuresString.split(",").map(f => f.trim()).filter(Boolean) : [];
    
    const imagesString = formData.get("images") as string || "";
    const images = imagesString ? imagesString.split(",").map(i => i.trim()).filter(Boolean) : [];
    
    // Traitement des booleans
    const featured = formData.get("featured") === "true";
    const isPublished = formData.get("isPublished") === "true";
    
    // Création du projet
    const project = await prisma.project.create({
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
    
    return new Response(JSON.stringify({ id: project.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    return new Response(JSON.stringify({ error: "Erreur lors de la création du projet" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 