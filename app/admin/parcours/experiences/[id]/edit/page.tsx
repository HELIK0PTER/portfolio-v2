import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "@/components/admin/ExperienceForm";

export async function generateMetadata({
  params,
}: { params: { id: string } }): Promise<Metadata> {
  return {
    title: "Modifier Expérience | Admin",
    description: "Modifier une expérience",
    alternates: {
      canonical: new URL(
        `/admin/parcours/experiences/${params.id}/edit`,
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      ).toString(),
    },
  };
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditExperiencePage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const experience = await prisma.experience.findUnique({
    where: { id },
  });

  if (!experience) {
    notFound();
  }

  const experienceForForm = {
    ...experience,
    startDate: experience.startDate.toISOString(),
    endDate: experience.endDate?.toISOString() || null,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ExperienceForm experience={experienceForForm} isEditing={true} />
    </div>
  );
} 