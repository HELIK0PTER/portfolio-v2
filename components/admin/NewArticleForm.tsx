"use client";

import { ArticleForm, ArticleFormValues } from "@/components/admin/ArticleForm";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function NewArticleForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(values: ArticleFormValues) {
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
      const res = await fetch(`/api/admin/articles`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/articles/${data.article.id}`);
      } else {
        alert("Erreur lors de la création de l'article");
      }
    });
  }

  return (
    <ArticleForm
      onSubmit={handleSubmit}
      submitLabel={pending ? `Création...` : `Créer l'article`}
      pending={pending}
    />
  );
} 