import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Incrémenter le nombre de vues
    await prisma.article.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'incrémentation des vues" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const article = await prisma.article.findUnique({
      where: { slug: slug },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ views: article.views });
  } catch (error) {
    console.error("Erreur lors de la récupération des vues:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des vues" },
      { status: 500 }
    );
  }
}