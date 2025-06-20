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
    
    const experience = await prisma.experience.update({
      where: { id },
      data: { isPublished },
    });

    return NextResponse.json(experience);
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
    
    const experience = await prisma.experience.update({
      where: { id },
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
    await prisma.experience.delete({
      where: { id },
    });

    return new NextResponse("Expérience supprimée", { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
} 