import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const { id } = await params;
    const { isPublished } = await request.json();
    
    const education = await prisma.education.update({
      where: { id },
      data: { isPublished },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();
    
    const education = await prisma.education.update({
      where: { id },
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
    console.error("Erreur lors de la modification:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    
    if (!session) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const { id } = await params;
    await prisma.education.delete({
      where: { id },
    });

    return new NextResponse("Formation supprimée", { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
} 