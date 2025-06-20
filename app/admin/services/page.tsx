import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const metadata: Metadata = {
  title: "Services | Admin",
  description: "Gestion des services",
};

async function getServices() {
  return await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ServicesAdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const services = await getServices();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          {`Gestion des Services`}
        </h1>
        <p className="text-muted-foreground">
          {`Gérez vos services, tarifs et descriptions.`}
        </p>
      </div>

      <ServicesManager services={services} />
    </div>
  );
} 