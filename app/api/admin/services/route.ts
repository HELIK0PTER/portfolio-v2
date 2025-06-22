import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();

    // Validation des données
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: "Titre et description requis" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price || 0,
        isPublished: data.isPublished || false,
      },
    });

    // Revalidation des pages concernées
    revalidatePath("/services"); // Page de liste des services
    revalidatePath("/"); // Page d'accueil
    
    // Revalider par tag pour toutes les pages de services
    revalidateTag("services");

    return NextResponse.json(service);
  } catch (error) {
    console.error("Erreur lors de la création du service:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 