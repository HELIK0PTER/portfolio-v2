import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { EducationForm } from "@/components/admin/EducationForm";

export const metadata: Metadata = {
  title: "Nouvelle Formation | Admin",
  description: "Ajouter une nouvelle formation",
  alternates: {
    canonical: new URL(
      "/admin/parcours/educations/new",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).toString(),
  },
};

export default async function NewEducationPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <EducationForm />
    </div>
  );
} 