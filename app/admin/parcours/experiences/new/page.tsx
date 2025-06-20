import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export const metadata: Metadata = {
  title: "Nouvelle Expérience | Admin",
  description: "Ajouter une nouvelle expérience",
};

export default async function NewExperiencePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ExperienceForm />
    </div>
  );
} 