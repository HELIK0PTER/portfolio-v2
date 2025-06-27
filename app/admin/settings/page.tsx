import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Paramètres | Admin",
  description: "Configuration des paramètres de contact et SMTP",
  alternates: {
    canonical: new URL(
      "/admin/settings",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {`Paramètres`}
        </h1>
        <p className="text-muted-foreground">
          {`Configurez vos informations de contact et les paramètres SMTP pour recevoir les messages.`}
        </p>
      </div>

      <SettingsForm />
    </div>
  );
} 