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
    
    const education = await prisma.education.create({
      data: {
        title: data.title,
        institution: data.institution,
        location: data.location,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrently: data.isCurrently,
        grade: data.grade || null,
        skills: data.skills || [],
        isPublished: data.isPublished,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
} 