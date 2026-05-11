import nodemailer from "nodemailer";
import { contact } from "./data/contact";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function readSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const fromName = process.env.SMTP_FROM_NAME ?? "Portfolio Contact";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? user;

  if (!host || !user || !pass || !fromEmail) {
    throw new Error(
      "SMTP configuration is incomplete. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL.",
    );
  }

  return { host, port, secure, user, pass, fromName, fromEmail };
}

export async function sendContactEmail(data: ContactFormData) {
  const smtp = readSmtpConfig();

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.user, pass: smtp.pass },
  });

  await transporter.verify();

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

  const emailText = `Nouveau message de contact

Nom: ${data.name}
Email: ${data.email}
Sujet: ${data.subject}

Message:
${data.message}

---
Répondre à: ${data.email}`;

  const info = await transporter.sendMail({
    from: `${smtp.fromName} <${smtp.fromEmail}>`,
    to: contact.contactEmail,
    replyTo: data.email,
    subject: `Nouveau message de contact: ${data.subject}`,
    html: emailHtml,
    text: emailText,
  });

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
        <p><strong>Matheus Kops Guedes</strong><br/>Développeur Full Stack</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `${smtp.fromName} <${smtp.fromEmail}>`,
    to: data.email,
    subject: "✅ Confirmation de votre demande de contact",
    html: confirmationHtml,
    text: `Bonjour ${data.name},\n\nVotre demande de contact a bien été prise en compte.\n\nSujet : ${data.subject}\nMessage : ${data.message}\n\nMatheus Kops Guedes`,
  });

  return { success: true, messageId: info.messageId };
}
