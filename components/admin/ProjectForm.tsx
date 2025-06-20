"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UnifiedImageUploader } from "@/components/admin/UnifiedImageUploader";
import { ProjectPreview } from "@/components/admin/ProjectPreview";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface ProjectFormValues {
  id?: string;
  imageUrl?: string;
  images?: string[];
  title: string;
  category: string;
  status: string;
  date: string;
  duration: string;
  client: string;
  tags: string[];
  technologies: string[];
  features: string[];
  description: string;
  longDescription: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  isPublished: boolean;
}

interface ProjectFormProps {
  initialValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
  submitLabel: string;
  pending?: boolean;
}

// function slugify(str: string) {
//   return str
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/\p{Diacritic}/gu, "")
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/(^-|-$)+/g, "");
// }

export function ProjectForm({ initialValues = {}, onSubmit, submitLabel, pending }: ProjectFormProps) {
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || "");
  const [images, setImages] = useState<string[]>(initialValues.images || []);
  const [title, setTitle] = useState(initialValues.title || "");
  const [category, setCategory] = useState(initialValues.category || "");
  const [status, setStatus] = useState(initialValues.status || "");
  const [date, setDate] = useState(initialValues.date || "");
  const [duration, setDuration] = useState(initialValues.duration || "");
  const [client, setClient] = useState(initialValues.client || "");
  const [tags, setTags] = useState<string[]>(initialValues.tags || []);
  const [technologies, setTechnologies] = useState<string[]>(initialValues.technologies || []);
  const [features, setFeatures] = useState<string[]>(initialValues.features || []);
  const [description, setDescription] = useState(initialValues.description || "");
  const [longDescription, setLongDescription] = useState(initialValues.longDescription || "");
  const [githubUrl, setGithubUrl] = useState(initialValues.githubUrl || "");
  const [liveUrl, setLiveUrl] = useState(initialValues.liveUrl || "");
  const [featured, setFeatured] = useState(initialValues.featured || false);
  const [isPublished, setIsPublished] = useState(initialValues.isPublished || false);
  const [showPreview, setShowPreview] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values: ProjectFormValues = {
      id: initialValues.id,
      imageUrl,
      images,
      title,
      category,
      status,
      date,
      duration,
      client,
      tags,
      technologies,
      features,
      description,
      longDescription,
      githubUrl,
      liveUrl,
      featured,
      isPublished,
    };
    onSubmit(values);
  }

  return (
    <div className="w-full h-[calc(88vh-4rem)] grid grid-cols-1 md:grid-cols-2 gap-8 overflow-auto">
      {/* Colonne formulaire */}
      <div className="h-full overflow-y-auto py-2 px-1">
        <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg border p-8 shadow-lg">
          {/* Image principale */}
          <div>
            <UnifiedImageUploader
              label="Image principale"
              value={imageUrl}
              onChange={(url) => setImageUrl(url as string)}
              multiple={false}
            />
          </div>
          {/* Infos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">{`Titre`}</label>
              <input
                name="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input input-bordered w-full bg-background border-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">{`Catégorie`}</label>
              <input
                name="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="input input-bordered w-full bg-background border-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">{`Statut`}</label>
              <input
                name="status"
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="input input-bordered w-full bg-background border-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">{`Année`}</label>
              <input
                name="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input input-bordered w-full bg-background border-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">{`Durée`}</label>
              <input
                name="duration"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="input input-bordered w-full bg-background border-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">{`Client`}</label>
              <input
                name="client"
                value={client}
                onChange={e => setClient(e.target.value)}
                className="input input-bordered w-full bg-background border-2"
                required
              />
            </div>
          </div>
          {/* Champs avancés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">{`Tags (séparés par des virgules)`}</label>
              <input
                name="tags"
                value={tags.join(", ")}
                onChange={e => setTags(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                className="input input-bordered w-full bg-background border-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">{`Technologies (séparées par des virgules)`}</label>
              <input
                name="technologies"
                value={technologies.join(", ")}
                onChange={e => setTechnologies(e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                className="input input-bordered w-full bg-background border-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">{`Fonctionnalités (séparées par des virgules)`}</label>
              <input
                name="features"
                value={features.join(", ")}
                onChange={e => setFeatures(e.target.value.split(",").map(f => f.trim()).filter(Boolean))}
                className="input input-bordered w-full bg-background border-2"
              />
            </div>
            <div className="md:col-span-2">
              <UnifiedImageUploader
                label="Images secondaires"
                value={images}
                onChange={(imgs) => setImages(imgs as string[])}
                multiple={true}
              />
            </div>
          </div>
          {/* Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">{`Description`}</label>
              <textarea
                name="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="textarea textarea-bordered w-full bg-background border-2"
                rows={2}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">{`Description longue`}</label>
              <textarea
                name="longDescription"
                value={longDescription}
                onChange={e => setLongDescription(e.target.value)}
                className="textarea textarea-bordered w-full bg-background border-2"
                rows={4}
                required
              />
            </div>
          </div>
          {/* Liens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">{`Lien GitHub`}</label>
              <input
                name="githubUrl"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="input input-bordered w-full bg-background border-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">{`Lien en ligne (optionnel)`}</label>
              <input
                name="liveUrl"
                value={liveUrl}
                onChange={e => setLiveUrl(e.target.value)}
                className="input input-bordered w-full bg-background border-2"
              />
            </div>
          </div>
          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              {`Mettre en vedette`}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isPublished" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
              {`Publié`}
            </label>
          </div>
          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button type="submit" variant="default" disabled={pending}>{submitLabel}</Button>
          </div>
          {/* Bouton preview mobile */}
          {isMobile && (
            <Button type="button" variant="secondary" className="w-full mt-4" onClick={() => setShowPreview(true)}>
              {`Voir la preview`}
            </Button>
          )}
        </form>
      </div>
      {/* Colonne preview desktop */}
      {!isMobile && (
        <div className="h-full overflow-y-auto">
          <ProjectPreview
            title={title}
            description={description}
            image={imageUrl}
            images={images}
            tags={tags}
            technologies={technologies}
            features={features}
            githubUrl={githubUrl}
            demoUrl={liveUrl}
          />
        </div>
      )}
      {/* Preview mobile (drawer/modal) */}
      {isMobile && showPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="relative w-full max-w-lg mx-auto bg-background rounded-xl shadow-lg p-4">
            <Button type="button" variant="outline" className="absolute top-2 right-2" onClick={() => setShowPreview(false)}>
              {`Retour au formulaire`}
            </Button>
            <ProjectPreview
              title={title}
              description={description}
              image={imageUrl}
              images={images}
              tags={tags}
              technologies={technologies}
              features={features}
              githubUrl={githubUrl}
              demoUrl={liveUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
} 