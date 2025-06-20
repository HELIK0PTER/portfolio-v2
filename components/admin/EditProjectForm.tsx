"use client";

import { ProjectForm, ProjectFormValues } from "@/components/admin/ProjectForm";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface EditProjectFormProps {
  initialProject: ProjectFormValues;
}

export function EditProjectForm({ initialProject }: EditProjectFormProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(values: ProjectFormValues) {
    const slug = values.title
      ? values.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      : "";
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (Array.isArray(val)) formData.set(key, val.join(", "));
      else if (typeof val === "boolean")
        formData.set(key, val ? "true" : "false");
      else if (val !== undefined) formData.set(key, val as string);
    });
    formData.set("slug", slug);
    startTransition(async () => {
      const res = await fetch(`/api/admin/projects/${initialProject.id}/edit`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        router.push(`/admin/projects/${initialProject.id}`);
      } else {
        alert("Erreur lors de la modification du projet");
      }
    });
  }

  return (
    <ProjectForm
      initialValues={initialProject}
      onSubmit={handleSubmit}
      submitLabel={pending ? `Enregistrement...` : `Enregistrer`}
      pending={pending}
    />
  );
}
