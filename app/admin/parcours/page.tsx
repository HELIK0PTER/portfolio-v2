import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ParcoursManager } from "@/components/admin/ParcoursManager";

export const metadata: Metadata = {
  title: "Parcours | Admin",
  description: "Gestion des formations et expériences",
};

async function getEducations() {
  return await prisma.education.findMany({
    orderBy: { startDate: "desc" },
  });
}

async function getExperiences() {
  return await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });
}

export default async function ParcoursAdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const [educations, experiences] = await Promise.all([
    getEducations(),
    getExperiences(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {`Gestion du Parcours`}
        </h1>
        <p className="text-muted-foreground">
          {`Gérez vos formations et expériences professionnelles.`}
        </p>
      </div>

      <ParcoursManager educations={educations} experiences={experiences} />
    </div>
  );
} 