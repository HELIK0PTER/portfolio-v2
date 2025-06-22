import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier si l'article existe
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return new Response(
        JSON.stringify({
          error: `L'article n'existe pas`,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Supprimer l'article
    await prisma.article.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'article:`, error);
    return new Response(
      JSON.stringify({ error: `Erreur lors de la suppression de l'article` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
