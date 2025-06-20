import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();

    console.log("Données reçues pour test SMTP:", {
      smtpHost: data.smtpHost,
      smtpUser: data.smtpUser,
      smtpPassword: data.smtpPassword ? "***" : undefined,
      smtpFromEmail: data.smtpFromEmail,
      contactEmail: data.contactEmail,
    });

    // Validation des données avec messages détaillés
    const missingFields = [];
    if (!data.smtpHost) missingFields.push("smtpHost");
    if (!data.smtpUser) missingFields.push("smtpUser");
    if (!data.smtpPassword) missingFields.push("smtpPassword");
    if (!data.smtpFromEmail) missingFields.push("smtpFromEmail");
    if (!data.contactEmail) missingFields.push("contactEmail");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Configuration SMTP incomplète. Champs manquants: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Créer le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      host: data.smtpHost,
      port: data.smtpPort,
      secure: data.smtpSecure,
      auth: {
        user: data.smtpUser,
        pass: data.smtpPassword,
      },
    });

    // Vérifier la connexion SMTP
    await transporter.verify();

    // Envoyer un email de test
    const testEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Test de configuration SMTP</h2>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>✅ <strong>Félicitations !</strong></p>
          <p>Votre configuration SMTP fonctionne correctement.</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h3 style="color: #333; margin-top: 0;">Détails de la configuration testée :</h3>
          <ul style="line-height: 1.6; color: #555;">
            <li><strong>Serveur SMTP :</strong> ${data.smtpHost}</li>
            <li><strong>Port :</strong> ${data.smtpPort}</li>
            <li><strong>Sécurisé :</strong> ${data.smtpSecure ? "Oui" : "Non"}</li>
            <li><strong>Utilisateur :</strong> ${data.smtpUser}</li>
            <li><strong>Email d'expéditeur :</strong> ${data.smtpFromEmail}</li>
          </ul>
        </div>

        <div style="margin-top: 20px; font-size: 14px; color: #888;">
          <p>Ce message de test a été envoyé depuis votre interface d'administration.</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      </div>
    `;

    const testEmailText = `
      Test de configuration SMTP

      ✅ Félicitations !
      Votre configuration SMTP fonctionne correctement.

      Détails de la configuration testée :
      - Serveur SMTP : ${data.smtpHost}
      - Port : ${data.smtpPort}
      - Sécurisé : ${data.smtpSecure ? "Oui" : "Non"}
      - Utilisateur : ${data.smtpUser}
      - Email d'expéditeur : ${data.smtpFromEmail}

      ---
      Ce message de test a été envoyé depuis votre interface d'administration.
      Date : ${new Date().toLocaleString("fr-FR")}
    `;

    const info = await transporter.sendMail({
      from: `${data.smtpFromName} <${data.smtpFromEmail}>`,
      to: data.contactEmail,
      subject: "✅ Test de configuration SMTP - Portfolio",
      html: testEmailHtml,
      text: testEmailText,
    });

    return NextResponse.json({
      success: true,
      message: "Email de test envoyé avec succès",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Erreur lors du test SMTP:", error);

    let errorMessage = "Erreur inconnue lors du test SMTP";

    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        errorMessage =
          "Identifiants SMTP invalides. Vérifiez votre nom d'utilisateur et mot de passe.";
      } else if (error.message.includes("ENOTFOUND")) {
        errorMessage =
          "Serveur SMTP introuvable. Vérifiez l'adresse du serveur.";
      } else if (error.message.includes("ECONNREFUSED")) {
        errorMessage =
          "Connexion refusée. Vérifiez le port et les paramètres de sécurité.";
      } else if (error.message.includes("ETIMEDOUT")) {
        errorMessage =
          "Délai d'attente dépassé. Vérifiez votre connexion internet et les paramètres du serveur.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
