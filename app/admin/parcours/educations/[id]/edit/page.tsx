import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { EducationForm } from "@/components/admin/EducationForm";

export const metadata: Metadata = {
  title: "Modifier Formation | Admin",
  description: "Modifier une formation",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEducationPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const education = await prisma.education.findUnique({
    where: { id },
  });

  if (!education) {
    notFound();
  }

  const educationForForm = {
    ...education,
    startDate: education.startDate.toISOString(),
    endDate: education.endDate?.toISOString() || null,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <EducationForm education={educationForForm} isEditing={true} />
    </div>
  );
} 