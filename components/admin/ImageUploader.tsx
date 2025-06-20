"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onUpload, label }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [inputUrl, setInputUrl] = useState<string>(value || "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setPreview(publicUrl);
    setInputUrl(publicUrl);
    onUpload(publicUrl);
    setUploading(false);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
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

  function onUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    const url = e.target.value;
    setInputUrl(url);
    setPreview(url);
    onUpload(url);
  }

  function clearImage() {
    setPreview(null);
    setInputUrl("");
    onUpload("");
  }

  return (
    <div
      className="w-full flex flex-col gap-2"
      onDrop={onDrop}
      onDragOver={e => e.preventDefault()}
      onPaste={onPaste}
    >
      {label && <label className="block font-medium mb-1">{label}</label>}
      <div
        className="input input-bordered w-full flex items-center justify-center min-h-[120px] cursor-pointer bg-muted/30 border-dashed border-2 border-muted-foreground hover:border-primary transition"
        onClick={() => inputRef.current?.click()}
        tabIndex={0}
        role="button"
      >
        {uploading ? (
          <span>{`Envoi en cours...`}</span>
        ) : preview ? (
          <Image src={preview} alt="Aperçu" width={1000} height={1000} className="max-h-28 max-w-full object-contain rounded" />
        ) : (
          <span className="text-muted-foreground text-center px-2">{`Cliquez, glissez ou collez une image ici`}</span>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onChange}
      />
      <input
        type="url"
        placeholder="Ou collez une URL d'image..."
        className="input input-bordered w-full mt-2"
        value={inputUrl}
        onChange={onUrlChange}
        autoComplete="off"
      />
      {preview && (
        <Button type="button" variant="outline" size="sm" onClick={clearImage}>
          {`Supprimer l'image`}
        </Button>
      )}
    </div>
  );
} 