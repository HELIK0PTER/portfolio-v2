import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [educations, experiences] = await Promise.all([
      prisma.education.findMany({
        where: { isPublished: true },
        orderBy: { startDate: "desc" },
      }),
      prisma.experience.findMany({
        where: { isPublished: true },
        orderBy: { startDate: "desc" },
      }),
    ]);

    return NextResponse.json({
      educations,
      experiences,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données de parcours:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 