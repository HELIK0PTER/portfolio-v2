"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UnifiedImageUploader } from "@/components/admin/UnifiedImageUploader";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Article } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, User } from "lucide-react";
import Image from "next/image";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";

export interface ArticleFormValues
  extends Omit<
    Article,
    "id" | "createdAt" | "updatedAt" | "publishedAt" | "views"
  > {
  id?: string;
}

interface ArticleFormProps {
  initialValues?: Partial<ArticleFormValues>;
  onSubmit: (values: ArticleFormValues) => Promise<void> | void;
  submitLabel: string;
  pending?: boolean;
}

// Composant Preview de l'article
function ArticlePreview({ values }: { values: ArticleFormValues }) {
  return (
    <div className="bg-background rounded-lg border p-6 space-y-6">
      <h3 className="text-lg font-semibold mb-4">{`Aperçu de l'article`}</h3>

      {/* Image de couverture */}
      {values.imageUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
          <Image
            src={values.imageUrl}
            alt={values.title || "Image de couverture"}
            className="object-cover w-full h-full"
            width={1000}
            height={1000}
          />
        </div>
      )}

      {/* Métadonnées */}
      <div className="space-y-4">
        {/* Catégorie */}
        {values.category && (
          <Badge variant="outline" className="text-sm">
            {values.category}
          </Badge>
        )}

        {/* Titre */}
        <h1 className="text-3xl font-bold tracking-tight">
          {values.title || "Titre de l'article"}
        </h1>

        {/* Excerpt */}
        {values.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {values.excerpt}
          </p>
        )}

        {/* Informations article */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{values.author || "Auteur"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{`${values.readTime || 5} min de lecture`}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>0 vues</span>
          </div>
        </div>

        {/* Tags */}
        {values.tags && values.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {values.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Séparateur */}
      <div className="border-t"></div>

      {/* Contenu avec rendu Markdown */}
      {values.content ? (
        <MarkdownRenderer content={values.content} />
      ) : (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-muted-foreground italic">
            {`Commencez à écrire pour voir l'aperçu...`}
          </p>
        </div>
      )}

      {/* Statut badges */}
      <div className="flex gap-2 pt-4 border-t">
        {values.featured && <Badge variant="default">En vedette</Badge>}
        <Badge variant={values.isPublished ? "default" : "secondary"}>
          {values.isPublished ? "Publié" : "Brouillon"}
        </Badge>
      </div>
    </div>
  );
}

export function ArticleForm({
  initialValues = {},
  onSubmit,
  submitLabel,
  pending,
}: ArticleFormProps) {
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || "");
  const [title, setTitle] = useState(initialValues.title || "");
  const [excerpt, setExcerpt] = useState(initialValues.excerpt || "");
  const [content, setContent] = useState(initialValues.content || "");
  const [author, setAuthor] = useState(
    initialValues.author || "Matheus Kops Guedes"
  );
  const [category, setCategory] = useState(initialValues.category || "");
  const [readTime, setReadTime] = useState(initialValues.readTime || 5);
  const [tags, setTags] = useState<string[]>(initialValues.tags || []);
  const [featured, setFeatured] = useState(initialValues.featured || false);
  const [isPublished, setIsPublished] = useState(
    initialValues.isPublished || false
  );
  const [showPreview, setShowPreview] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values: ArticleFormValues = {
      id: initialValues.id,
      title,
      excerpt,
      content,
      author,
      category,
      readTime,
      imageUrl,
      tags,
      featured,
      isPublished,
      slug: "", // Will be generated in the handler
    };
    onSubmit(values);
  }

  const previewValues: ArticleFormValues = {
    id: initialValues.id,
    title,
    excerpt,
    content,
    author,
    category,
    readTime,
    imageUrl,
    tags,
    featured,
    isPublished,
    slug: "",
  };

  return (
    <div className="w-full h-[calc(88vh-4rem)] grid grid-cols-1 md:grid-cols-2 gap-8 overflow-auto">
      {/* Colonne formulaire */}
      <div className="h-full overflow-y-auto py-2 px-1">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-card rounded-lg border p-8 shadow-lg"
        >
          {/* Image principale */}
          <div>
            <UnifiedImageUploader
              label="Image de couverture"
              value={imageUrl}
              onChange={(url) => setImageUrl(url as string)}
              multiple={false}
            />
          </div>

          {/* Informations principales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{`Informations principales`}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">{`Titre`}</label>
                <input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered w-full bg-background border-2"
                  placeholder="Titre de l'article"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{`Catégorie`}</label>
                <input
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input input-bordered w-full bg-background border-2"
                  placeholder="Frontend, Backend, etc."
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{`Auteur`}</label>
                <input
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="input input-bordered w-full bg-background border-2"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{`Temps de lecture (min)`}</label>
                <input
                  name="readTime"
                  type="number"
                  min="1"
                  value={readTime}
                  onChange={(e) => setReadTime(parseInt(e.target.value) || 1)}
                  className="input input-bordered w-full bg-background border-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">{`Extrait`}</label>
              <textarea
                name="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="textarea textarea-bordered w-full bg-background border-2 min-h-[100px]"
                placeholder="Résumé de l'article"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">{`Contenu (Markdown)`}</label>
              <textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="textarea textarea-bordered w-full bg-background border-2 min-h-[300px]"
                placeholder="Contenu complet de l'article (Markdown supporté)"
                required
              />
            </div>
          </div>

          {/* Tags et options */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">{`Tags (séparés par des virgules)`}</label>
              <input
                name="tags"
                value={tags.join(", ")}
                onChange={(e) =>
                  setTags(
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
                className="input input-bordered w-full bg-background border-2"
                placeholder="React, Next.js, TypeScript"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-normal">
                  {`Article en vedette`}
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="isPublished" className="text-sm font-normal">
                  {`Publier l'article`}
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            {isMobile && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1"
              >
                {showPreview ? `Masquer aperçu` : `Voir aperçu`}
              </Button>
            )}
            <Button type="submit" disabled={pending} className="flex-1">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>

      {/* Colonne preview */}
      <div
        className={`h-full overflow-y-auto py-2 px-1 ${isMobile && !showPreview ? "hidden" : ""}`}
      >
        <ArticlePreview values={previewValues} />
      </div>
    </div>
  );
}
