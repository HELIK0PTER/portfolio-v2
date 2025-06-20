"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MultiImageUploaderProps {
  value?: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export function MultiImageUploader({ value = [], onChange, label }: MultiImageUploaderProps) {
  const [images, setImages] = useState<string[]>(value);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const { error } = await supabase.storage.from("project-images").upload(fileName, file, { upsert: true });
    if (error) {
      alert("Erreur lors de l'upload : " + error.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("project-images").getPublicUrl(fileName);
    const newImages = [...images, publicUrl];
    setImages(newImages);
    onChange(newImages);
    setUploading(false);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onPaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const file = Array.from(e.clipboardData.files)[0];
    if (file) handleFile(file);
  }

  function onUrlAdd() {
    const url = urlInputRef.current?.value.trim();
    if (url && !images.includes(url)) {
      const newImages = [...images, url];
      setImages(newImages);
      onChange(newImages);
      if (urlInputRef.current) urlInputRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    const newImages = images.filter((_, i) => i !== idx);
    setImages(newImages);
    onChange(newImages);
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label className="block font-medium mb-1">{label}</label>}
      <div
        className="input input-bordered w-full flex items-center justify-center min-h-[80px] cursor-pointer bg-muted/30 border-dashed border-2 border-muted-foreground hover:border-primary transition"
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onPaste={onPaste}
        tabIndex={0}
        role="button"
      >
        {uploading ? (
          <span>{`Envoi en cours...`}</span>
        ) : (
          <span className="text-muted-foreground text-center px-2">{`Cliquez, glissez, collez ou ajoutez une URL pour chaque image secondaire`}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
      <div className="flex gap-2 mt-2">
        <input
          ref={urlInputRef}
          type="url"
          placeholder="URL d'image..."
          className="input input-bordered w-full"
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onUrlAdd(); } }}
        />
        <Button type="button" variant="outline" size="sm" onClick={onUrlAdd}>{`Ajouter`}</Button>
      </div>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2">
          {images.map((img, idx) => (
            <div key={img + idx} className="relative group">
              <Image src={img} alt={`Image ${idx + 1}`} width={96} height={96} className="w-24 h-24 object-cover rounded border shadow" />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 opacity-80 group-hover:opacity-100"
                onClick={() => removeImage(idx)}
                title="Supprimer"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 