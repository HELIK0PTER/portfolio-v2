import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const data = await request.json();
    
    const experience = await prisma.experience.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrently: data.isCurrently,
        skills: data.skills || [],
        companyUrl: data.companyUrl || null,
        isPublished: data.isPublished,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
} 