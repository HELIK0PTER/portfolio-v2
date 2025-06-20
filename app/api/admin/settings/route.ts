import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const settings = await prisma.contactSettings.findFirst();
    
    if (!settings) {
      // Créer des paramètres par défaut si aucun n'existe
      const defaultSettings = await prisma.contactSettings.create({
        data: {
          contactEmail: "matheus.kopsguedes@gmail.com",
          smtpHost: "smtp.gmail.com",
          smtpPort: 587,
          smtpSecure: false,
          smtpUser: "",
          smtpPassword: "",
          smtpFromName: "Portfolio Contact",
          smtpFromEmail: "",
        },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erreur lors du chargement des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

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
    if (!data.contactEmail || !data.smtpHost || !data.smtpUser || !data.smtpPassword) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Vérifier si des paramètres existent déjà
    const existingSettings = await prisma.contactSettings.findFirst();

    let settings;
    if (existingSettings) {
      // Mettre à jour les paramètres existants
      settings = await prisma.contactSettings.update({
        where: { id: existingSettings.id },
        data: {
          contactEmail: data.contactEmail,
          phone: data.phone || null,
          location: data.location,
          availability: data.availability,
          responseTime: data.responseTime,
          preferredContact: data.preferredContact,
          autoReply: data.autoReply,
          autoReplyMessage: data.autoReplyMessage || null,
          smtpHost: data.smtpHost,
          smtpPort: data.smtpPort,
          smtpSecure: data.smtpSecure,
          smtpUser: data.smtpUser,
          smtpPassword: data.smtpPassword,
          smtpFromName: data.smtpFromName,
          smtpFromEmail: data.smtpFromEmail,
        },
      });
    } else {
      // Créer de nouveaux paramètres
      settings = await prisma.contactSettings.create({
        data: {
          contactEmail: data.contactEmail,
          phone: data.phone || null,
          location: data.location,
          availability: data.availability,
          responseTime: data.responseTime,
          preferredContact: data.preferredContact,
          autoReply: data.autoReply,
          autoReplyMessage: data.autoReplyMessage || null,
          smtpHost: data.smtpHost,
          smtpPort: data.smtpPort,
          smtpSecure: data.smtpSecure,
          smtpUser: data.smtpUser,
          smtpPassword: data.smtpPassword,
          smtpFromName: data.smtpFromName,
          smtpFromEmail: data.smtpFromEmail,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 