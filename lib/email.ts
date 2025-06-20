import nodemailer from "nodemailer";
import { prisma } from "./prisma";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

async function getContactSettings() {
  let settings = await prisma.contactSettings.findFirst();

  if (!settings) {
    // Créer des paramètres par défaut si aucun n'existe
    settings = await prisma.contactSettings.create({
      data: {
        contactEmail: "matheuskopsguedes@gmail.com",
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpSecure: false,
        smtpUser: "",
        smtpPassword: "",
        smtpFromName: "Portfolio Contact",
        smtpFromEmail: "",
      },
    });
  }

  return settings;
}

export async function sendContactEmail(data: ContactFormData) {
  try {
    const settings = await getContactSettings();

    // Vérifier que la configuration SMTP est complète
    if (
      !settings.smtpUser ||
      !settings.smtpPassword ||
      !settings.smtpFromEmail
    ) {
      throw new Error(
        "La configuration SMTP n'est pas complète. Veuillez configurer les paramètres dans l'administration."
      );
    }

    // Créer le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpSecure,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
    });

    // Vérifier la connexion
    await transporter.verify();

    // Envoyer l'email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Nouveau message de contact</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nom:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Sujet:</strong> ${data.subject}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="line-height: 1.6; color: #555;">${data.message.replace(/\n/g, "<br>")}</p>
        </div>
        
        <div style="margin-top: 20px; font-size: 14px; color: #888;">
          <p>Ce message a été envoyé depuis votre portfolio.</p>
          <p><strong>Répondre à:</strong> ${data.email}</p>
        </div>
      </div>
    `;

    const emailText = `
      Nouveau message de contact
      
      Nom: ${data.name}
      Email: ${data.email}
      Sujet: ${data.subject}
      
      Message:
      ${data.message}
      
      ---
      Ce message a été envoyé depuis votre portfolio.
      Répondre à: ${data.email}
    `;

    // 1. Envoyer l'email au propriétaire du portfolio
    const info = await transporter.sendMail({
      from: `${settings.smtpFromName} <${settings.smtpFromEmail}>`,
      to: settings.contactEmail,
      replyTo: data.email,
      subject: `Nouveau message de contact: ${data.subject}`,
      html: emailHtml,
      text: emailText,
    });

    // 2. Envoyer un email de confirmation à l'utilisateur
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirmation de votre demande de contact</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Bonjour <strong>${data.name}</strong>,</p>
          <p>Votre demande de contact a bien été prise en compte. Je vous répondrai dans les plus brefs délais.</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h3 style="color: #333; margin-top: 0;">Récapitulatif de votre message :</h3>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <p><strong>Message :</strong></p>
          <p style="line-height: 1.6; color: #555; padding: 10px; background: #f9f9f9; border-radius: 4px;">${data.message.replace(/\n/g, "<br>")}</p>
        </div>
        
        <div style="margin-top: 20px; font-size: 14px; color: #888;">
          <p>Merci pour votre intérêt !</p>
          <p><strong>Matheus Kops Guedes</strong><br/>
          Développeur Full Stack</p>
          <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
            <em>Ceci est un message automatique, merci de ne pas répondre à cet email.</em>
          </p>
        </div>
      </div>
    `;

    const confirmationText = `
      Confirmation de votre demande de contact
      
      Bonjour ${data.name},
      
      Votre demande de contact a bien été prise en compte. Je vous répondrai dans les plus brefs délais.
      
      Récapitulatif de votre message :
      Sujet : ${data.subject}
      Message : ${data.message}
      
      Merci pour votre intérêt !
      
      Matheus Kops Guedes
      Développeur Full Stack
      
      ---
      Ceci est un message automatique, merci de ne pas répondre à cet email.
    `;

    await transporter.sendMail({
      from: `${settings.smtpFromName} <${settings.smtpFromEmail}>`,
      to: data.email,
      subject: "✅ Confirmation de votre demande de contact",
      html: confirmationHtml,
      text: confirmationText,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}
