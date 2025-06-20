"use client";

import { ArticleForm, ArticleFormValues } from "@/components/admin/ArticleForm";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@prisma/client";

interface EditArticleFormProps {
  initialArticle: Article;
}

export function EditArticleForm({ initialArticle }: EditArticleFormProps) {
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
      const res = await fetch(`/api/admin/articles/${initialArticle.id}/edit`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        router.push(`/admin/articles/${initialArticle.id}`);
      } else {
        alert("Erreur lors de la modification de l'article");
      }
    });
  }

  return (
    <ArticleForm
      initialValues={{
        ...initialArticle,
        imageUrl: initialArticle.imageUrl || "",
      }}
      onSubmit={handleSubmit}
      submitLabel={pending ? `Enregistrement...` : `Enregistrer`}
      pending={pending}
    />
  );
} 