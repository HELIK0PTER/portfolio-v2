import React from "react";
import Image from "next/image";
import { ImageReady } from "@/components/ui/ImageReady";
import { useTheme } from "next-themes";

interface ProjectPreviewProps {
  title: string;
  description: string;
  image: string;
  images?: string[];
  tags?: string[];
  technologies?: string[];
  features?: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export function ProjectPreview({
  title,
  description,
  image,
  images = [],
  tags = [],
  technologies = [],
  features = [],
  githubUrl,
  demoUrl,
}: ProjectPreviewProps) {
  const { theme } = useTheme();
  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-xl shadow-lg overflow-hidden border">
      {/* Image principale */}
      {image && (
        <div className="w-full aspect-video bg-muted flex items-center justify-center">
          <Image src={image} alt={title} width={1000} height={1000} className="object-cover w-full h-full" />
        </div>
      )}
      <div className="p-6 flex flex-col gap-4">
        {/* Titre */}
        <h2 className="text-2xl font-bold leading-tight">{title}</h2>
        {/* Description */}
        <p className="text-muted-foreground">{description}</p>
        {/* Images secondaires */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img, i) => (
              <ImageReady
                key={img + i}
                src={img}
                alt={`Image secondaire ${i + 1}`}
                className="w-20 h-20 object-cover rounded border-2 border-gray-300"
                width={800}
                height={800}
              />
            ))}
          </div>
        )}
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, i) => (
              <span key={tag + i} className="badge bg-primary/10 text-primary px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        )}
        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {theme === "dark" ? technologies.map((tech, i) => (
              <span key={tech + i} className="badge bg-secondary/10 px-2 py-1 rounded text-white">{tech}</span>
            )) : technologies.map((tech, i) => (
              <span key={tech + i} className="badge bg-secondary/20 px-2 py-1 rounded text-black">{tech}</span>
            ))}
          </div>
        )}
        {/* Features */}
        {features.length > 0 && (
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
            {features.map((f, i) => (
              <li key={f + i}>{f}</li>
            ))}
          </ul>
        )}
        {/* Liens */}
        <div className="flex gap-4 mt-4">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary">
              {`Code`}
            </a>
          )}
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary">
              {`Démo`}
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 