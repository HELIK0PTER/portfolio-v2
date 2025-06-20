"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { X, Upload, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface UnifiedImageUploaderProps {
  label?: string;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export function UnifiedImageUploader({
  label,
  value,
  onChange,
  multiple = false,
}: UnifiedImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normaliser les valeurs pour le traitement
  const images = multiple
    ? (value as string[]) || []
    : value
      ? [value as string]
      : [];

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("project-images")
        .upload(fileName, file, { upsert: true });

      if (error) {
        alert("Erreur lors de l'upload : " + error.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("project-images").getPublicUrl(fileName);

      addImage(publicUrl);
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  function addImage(url: string) {
    if (multiple) {
      const newImages = [...images, url];
      onChange(newImages);
    } else {
      onChange(url);
    }
  }

  function removeImage(index: number) {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange("");
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  }

  function onUrlInputPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const items = Array.from(e.clipboardData.items);

    // Chercher une image dans le presse-papier
    const imageItem = items.find((item) => item.type.startsWith("image/"));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        handleFile(file);
        return;
      }
    }

    // Chercher du texte (URL) dans le presse-papier
    const textItem = items.find((item) => item.type === "text/plain");
    if (textItem) {
      textItem.getAsString((text) => {
        if (text.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
          setUrlInput(text);
        }
      });
    }
  }

  function addUrlImage() {
    const url = urlInput.trim();
    if (url && url.match(/^https?:\/\/.+/)) {
      if (!multiple || !images.includes(url)) {
        addImage(url);
        setUrlInput("");
      }
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {label && <label className="block font-medium mb-1">{label}</label>}

      {/* Zone de drop/upload */}
      <div
        className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/10"
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        tabIndex={0}
        role="button"
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">{`Envoi en cours...`}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">{`Cliquez, glissez ou collez une image`}</p>
              <p className="text-xs mt-1">{`Formats supportés: JPG, PNG, GIF, WebP`}</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Zone URL */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="url"
            placeholder="Ou collez une URL d'image..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onPaste={onUrlInputPaste}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrlImage();
              }
            }}
            className="input input-bordered w-full pl-10 bg-background border-2"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={addUrlImage}
          disabled={!urlInput.trim()}
        >
          {`Ajouter`}
        </Button>
      </div>

      {/* Preview des images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {images.map((img, idx) => (
            <div key={img + idx} className="relative group">
              <Image
                src={img}
                width={1000}
                height={1000}
                alt={`Image ${idx + 1}`}
                className="w-24 h-24 object-cover rounded border shadow"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 opacity-80 group-hover:opacity-100"
                onClick={() => removeImage(idx)}
                title="Supprimer"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
