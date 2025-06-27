import { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MapPin, Phone, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact | Matheus Kops Guedes",
  description: "Contactez-moi pour discuter de vos projets et collaborations",
  alternates: {
    canonical: new URL(
      "/contact",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
};

async function getContactSettings() {
  let settings = await prisma.contactSettings.findFirst();

  if (!settings) {
    // Créer des paramètres par défaut si aucun n'existe
    settings = await prisma.contactSettings.create({
      data: {
        contactEmail: "matheus.kopsguedes@gmail.com",
        location: "France",
        availability: "Lun - Ven, 9h - 18h",
        responseTime: "Je réponds généralement dans les 24h",
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

export default async function ContactPage() {
  const settings = await getContactSettings();

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: settings.contactEmail,
      description: settings.responseTime,
    },
    {
      icon: Phone,
      title: "Téléphone",
      details: settings.phone || "Sur demande",
      description:
        settings.preferredContact === "phone"
          ? "Méthode de contact préférée"
          : "Préférence pour les échanges par email",
    },
    {
      icon: Calendar,
      title: "Disponibilité",
      details: "Dès : " + settings.availability,
      description: "Vous pouvez tout de même me contacter à tout moment",
    },
    {
      icon: MapPin,
      title: "Localisation",
      details: settings.location,
      description: "Disponible sur place et/ou en distanciel en télétravail",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-4">
            {`Contactez-moi`}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {`Vous avez un projet en tête ? Discutons-en ! Je suis toujours ouvert à de nouvelles opportunités et collaborations.`}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div>
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="text-2xl">{`Envoyez-moi un message`}</CardTitle>
                <CardDescription>
                  {`Remplissez le formulaire ci-dessous et je vous répondrai dans les plus brefs délais.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1">
                <Suspense fallback={<div>{`Chargement du formulaire...`}</div>}>
                  <ContactForm />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Informations de contact */}
          <div className="grid gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {info.title}
                      </h3>
                      <p className="font-medium text-foreground mb-2">
                        {info.details}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA supplémentaire */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">
                {`Vous préférez un appel ?`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {`Je suis disponible pour un appel de découverte pour discuter de votre projet en détail.`}
              </p>
              <p className="text-sm text-primary font-medium">
                {`Mentionnez "Appel demandé" dans votre message`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
